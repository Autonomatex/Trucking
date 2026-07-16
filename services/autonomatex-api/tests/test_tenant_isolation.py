"""
Integration tests: cross-company data-leak regression suite.

Verifies that the tenant-isolation guarantees enforced by `BaseRepository`
hold end-to-end across the full HTTP stack **and** at the repository layer
directly. This suite is the automated backstop for the manual verification
done during the original tenant-isolation work — a future change to
`BaseRepository`, `UserRepository`, or the session factory that accidentally
breaks multi-tenant scoping will be caught here before it ships.

Scenarios tested
----------------
1. `list_all` isolation
   - Tenant A's owner lists users → sees only Tenant A's users.
   - Tenant B's owner lists users → sees only Tenant B's users.
   - Neither list contains the other tenant's rows.

2. `get_by_id` isolation (repository-level)
   - A `UserRepository` scoped to Tenant A cannot retrieve a User that
     belongs to Tenant B using that user's UUID — it returns ``None``.

3. Duplicate-slug rejection
   - Creating a second tenant with an already-taken slug is rejected with
     HTTP 409.
"""

from __future__ import annotations

import uuid

import pytest
from httpx import AsyncClient

from app.infrastructure.db.repositories.user_repository import UserRepository
from app.infrastructure.db.session import get_sessionmaker

# All tests in this file share the session-scoped event loop so the
# lru_cache'd SQLAlchemy engine is never handed to a different loop.
pytestmark = pytest.mark.asyncio(loop_scope="session")

API = "/api/v1"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _uniq(prefix: str = "u") -> str:
    return f"{prefix}-{uuid.uuid4().hex[:8]}"


def _email(prefix: str = "user") -> str:
    return f"{_uniq(prefix)}@example.com"


async def _provision_tenant(
    client: AsyncClient,
    *,
    slug: str | None = None,
) -> dict:
    """Create a fresh tenant and return credentials alongside the response body."""
    slug = slug or f"co-{uuid.uuid4().hex[:10]}"
    owner_email = _email("owner")
    owner_password = "Str0ng!Pass"
    resp = await client.post(
        f"{API}/tenants",
        json={
            "name": slug.title(),
            "slug": slug,
            "owner_email": owner_email,
            "owner_password": owner_password,
            "owner_full_name": "Test Owner",
        },
    )
    assert resp.status_code == 201, resp.text
    return {
        "tenant": resp.json(),
        "slug": slug,
        "owner_email": owner_email,
        "owner_password": owner_password,
    }


async def _login(client: AsyncClient, email: str, password: str) -> str:
    """Return a bearer access token."""
    resp = await client.post(
        f"{API}/auth/login", json={"email": email, "password": password}
    )
    assert resp.status_code == 200, resp.text
    return resp.json()["access_token"]


def _auth(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


async def _invite_user(
    client: AsyncClient,
    *,
    token: str,
    email: str | None = None,
) -> dict:
    """Invite a new staff member into the authenticated tenant. Returns JSON."""
    email = email or _email("staff")
    resp = await client.post(
        f"{API}/users",
        headers=_auth(token),
        json={
            "email": email,
            "password": "Teammate!99",
            "full_name": "Staff Member",
            "role": "operator",
        },
    )
    assert resp.status_code == 201, resp.text
    return resp.json()


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------


class TestListAllIsolation:
    """list_all via GET /users never returns another tenant's rows."""

    @pytest.mark.asyncio(loop_scope="session")
    async def test_tenant_a_list_excludes_tenant_b_users(
        self, client: AsyncClient
    ) -> None:
        """Tenant A's user list contains only Tenant A's users."""
        prov_a = await _provision_tenant(client)
        prov_b = await _provision_tenant(client)

        token_a = await _login(client, prov_a["owner_email"], prov_a["owner_password"])
        token_b = await _login(client, prov_b["owner_email"], prov_b["owner_password"])

        # Create an extra staff member in each tenant so there is more than
        # one row to verify (catches off-by-one filtering mistakes).
        staff_a = await _invite_user(client, token=token_a)
        staff_b = await _invite_user(client, token=token_b)

        resp = await client.get(f"{API}/users", headers=_auth(token_a))
        assert resp.status_code == 200, resp.text

        ids_seen_by_a = {u["id"] for u in resp.json()["users"]}

        # Tenant A should see its own owner and its own staff member.
        assert staff_a["id"] in ids_seen_by_a, (
            "Tenant A's staff user is missing from its own user list"
        )

        # Tenant B's staff member must NOT appear in Tenant A's list.
        assert staff_b["id"] not in ids_seen_by_a, (
            "Tenant B's user leaked into Tenant A's user list — cross-tenant data leak!"
        )

    @pytest.mark.asyncio(loop_scope="session")
    async def test_tenant_b_list_excludes_tenant_a_users(
        self, client: AsyncClient
    ) -> None:
        """Tenant B's user list contains only Tenant B's users (symmetric check)."""
        prov_a = await _provision_tenant(client)
        prov_b = await _provision_tenant(client)

        token_a = await _login(client, prov_a["owner_email"], prov_a["owner_password"])
        token_b = await _login(client, prov_b["owner_email"], prov_b["owner_password"])

        staff_a = await _invite_user(client, token=token_a)
        staff_b = await _invite_user(client, token=token_b)

        resp = await client.get(f"{API}/users", headers=_auth(token_b))
        assert resp.status_code == 200, resp.text

        ids_seen_by_b = {u["id"] for u in resp.json()["users"]}

        assert staff_b["id"] in ids_seen_by_b, (
            "Tenant B's staff user is missing from its own user list"
        )
        assert staff_a["id"] not in ids_seen_by_b, (
            "Tenant A's user leaked into Tenant B's user list — cross-tenant data leak!"
        )

    @pytest.mark.asyncio(loop_scope="session")
    async def test_each_tenant_sees_only_its_own_count(
        self, client: AsyncClient
    ) -> None:
        """The number of users returned per tenant matches only that tenant's members."""
        prov_a = await _provision_tenant(client)
        prov_b = await _provision_tenant(client)

        token_a = await _login(client, prov_a["owner_email"], prov_a["owner_password"])
        token_b = await _login(client, prov_b["owner_email"], prov_b["owner_password"])

        # Invite two extra members into A, one extra into B.
        await _invite_user(client, token=token_a)
        await _invite_user(client, token=token_a)
        await _invite_user(client, token=token_b)

        resp_a = await client.get(f"{API}/users", headers=_auth(token_a))
        resp_b = await client.get(f"{API}/users", headers=_auth(token_b))

        assert resp_a.status_code == 200
        assert resp_b.status_code == 200

        # 1 owner + 2 staff = 3 for A; 1 owner + 1 staff = 2 for B.
        count_a = len(resp_a.json()["users"])
        count_b = len(resp_b.json()["users"])

        assert count_a == 3, f"Tenant A expected 3 users, got {count_a}"
        assert count_b == 2, f"Tenant B expected 2 users, got {count_b}"


class TestGetByIdIsolation:
    """UserRepository.get_by_id scoped to tenant A returns None for tenant B's IDs."""

    @pytest.mark.asyncio(loop_scope="session")
    async def test_cross_tenant_get_by_id_returns_none(
        self, client: AsyncClient
    ) -> None:
        """A repository scoped to Tenant A cannot retrieve Tenant B's user by ID."""
        prov_a = await _provision_tenant(client)
        prov_b = await _provision_tenant(client)

        token_a = await _login(client, prov_a["owner_email"], prov_a["owner_password"])
        token_b = await _login(client, prov_b["owner_email"], prov_b["owner_password"])

        # Create a user in Tenant B and capture its UUID.
        staff_b = await _invite_user(client, token=token_b)
        b_user_id = staff_b["id"]

        # Retrieve tenant IDs from the provisioning response.
        tenant_a_id: str = prov_a["tenant"]["id"]
        tenant_b_id: str = prov_b["tenant"]["id"]

        # Sanity-check: a Tenant B-scoped repo can find the user.
        session_factory = get_sessionmaker()
        async with session_factory() as session:
            repo_b = UserRepository(session, tenant_id=tenant_b_id)
            found_in_b = await repo_b.get_by_id(b_user_id)
            assert found_in_b is not None, (
                "Tenant B's own user should be retrievable by its own repository"
            )

            # The critical assertion: the same UUID looked up through Tenant A's
            # repository must return None — never another tenant's row.
            repo_a = UserRepository(session, tenant_id=tenant_a_id)
            found_in_a = await repo_a.get_by_id(b_user_id)
            assert found_in_a is None, (
                f"Tenant A's repository returned Tenant B's user (id={b_user_id}) "
                "— cross-tenant get_by_id data leak!"
            )

    @pytest.mark.asyncio(loop_scope="session")
    async def test_cross_tenant_get_by_id_both_directions(
        self, client: AsyncClient
    ) -> None:
        """Cross-tenant isolation holds in both directions."""
        prov_a = await _provision_tenant(client)
        prov_b = await _provision_tenant(client)

        token_a = await _login(client, prov_a["owner_email"], prov_a["owner_password"])
        token_b = await _login(client, prov_b["owner_email"], prov_b["owner_password"])

        staff_a = await _invite_user(client, token=token_a)
        staff_b = await _invite_user(client, token=token_b)

        tenant_a_id: str = prov_a["tenant"]["id"]
        tenant_b_id: str = prov_b["tenant"]["id"]

        session_factory = get_sessionmaker()
        async with session_factory() as session:
            repo_a = UserRepository(session, tenant_id=tenant_a_id)
            repo_b = UserRepository(session, tenant_id=tenant_b_id)

            # A cannot see B's user.
            assert await repo_a.get_by_id(staff_b["id"]) is None, (
                "Tenant A's repository returned Tenant B's user — leak A→B!"
            )
            # B cannot see A's user.
            assert await repo_b.get_by_id(staff_a["id"]) is None, (
                "Tenant B's repository returned Tenant A's user — leak B→A!"
            )
            # Each can still see its own user.
            assert await repo_a.get_by_id(staff_a["id"]) is not None
            assert await repo_b.get_by_id(staff_b["id"]) is not None


class TestDuplicateSlugRejection:
    """Duplicate tenant slugs are rejected with 409 Conflict."""

    @pytest.mark.asyncio(loop_scope="session")
    async def test_duplicate_slug_returns_409(self, client: AsyncClient) -> None:
        """Creating a second tenant with an existing slug returns HTTP 409."""
        slug = f"co-dup-{uuid.uuid4().hex[:8]}"
        # First registration succeeds.
        await _provision_tenant(client, slug=slug)

        # Second attempt with the same slug must fail.
        resp = await client.post(
            f"{API}/tenants",
            json={
                "name": "Duplicate Co",
                "slug": slug,
                "owner_email": _email("dup-owner"),
                "owner_password": "Str0ng!Pass",
                "owner_full_name": "Dup Owner",
            },
        )
        assert resp.status_code == 409, (
            f"Expected 409 for duplicate slug '{slug}', got {resp.status_code}: {resp.text}"
        )

    @pytest.mark.asyncio(loop_scope="session")
    async def test_unique_slugs_both_succeed(self, client: AsyncClient) -> None:
        """Two tenants with distinct slugs are both created successfully."""
        slug_a = f"co-uniq-a-{uuid.uuid4().hex[:8]}"
        slug_b = f"co-uniq-b-{uuid.uuid4().hex[:8]}"

        prov_a = await _provision_tenant(client, slug=slug_a)
        prov_b = await _provision_tenant(client, slug=slug_b)

        assert prov_a["tenant"]["id"] != prov_b["tenant"]["id"], (
            "Two tenants with distinct slugs must have distinct IDs"
        )
