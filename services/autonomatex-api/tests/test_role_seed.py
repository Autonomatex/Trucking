"""
Integration tests: role-seed correctness during tenant provisioning.

Verifies that `RoleService.seed_default_roles` and the role-assignment path
inside `TenantService` work correctly end-to-end across the full HTTP stack.
A future breakage in either the seed step or the `UserRole` assignment will
be caught here before it ships.

Scenarios tested
----------------
1. Owner role seed
   - When a new tenant is provisioned, the owner user is assigned exactly
     the built-in ``owner`` role — not admin, operator, or viewer.

2. Invited operator role seed
   - When an owner invites a teammate with role="operator", that user gets
     the ``operator`` role and NOT the ``owner`` role.

3. Role update reflected in user list
   - When the owner PATCHes a user's role from ``operator`` to ``admin``,
     the next GET /users response shows the updated role.
"""

from __future__ import annotations

import uuid

import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.asyncio(loop_scope="session")

API = "/api/v1"

# ---------------------------------------------------------------------------
# Helpers (mirrors the pattern in test_tenant_isolation.py)
# ---------------------------------------------------------------------------


def _uniq(prefix: str = "u") -> str:
    return f"{prefix}-{uuid.uuid4().hex[:8]}"


def _email(prefix: str = "user") -> str:
    return f"{_uniq(prefix)}@example.com"


async def _provision_tenant(client: AsyncClient, *, slug: str | None = None) -> dict:
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
    role: str = "operator",
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
            "role": role,
        },
    )
    assert resp.status_code == 201, resp.text
    return resp.json()


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------


class TestOwnerRoleSeed:
    """The tenant owner is seeded with exactly the 'owner' built-in role."""

    @pytest.mark.asyncio(loop_scope="session")
    async def test_owner_has_owner_role_after_signup(self, client: AsyncClient) -> None:
        """Provisioning a new tenant assigns exactly the 'owner' role to the owner."""
        prov = await _provision_tenant(client)
        token = await _login(client, prov["owner_email"], prov["owner_password"])

        resp = await client.get(f"{API}/users", headers=_auth(token))
        assert resp.status_code == 200, resp.text

        users = resp.json()["users"]
        # There should be exactly one user (the owner) at this point.
        assert len(users) == 1, (
            f"Expected exactly 1 user (the owner) right after signup, found {len(users)}"
        )

        owner_user = users[0]
        roles: list[str] = owner_user["roles"]

        assert "owner" in roles, (
            f"Owner user must have the 'owner' role after signup; got roles={roles}"
        )

    @pytest.mark.asyncio(loop_scope="session")
    async def test_owner_does_not_have_other_roles(self, client: AsyncClient) -> None:
        """The owner user has ONLY the 'owner' role — no duplicate or extra roles."""
        prov = await _provision_tenant(client)
        token = await _login(client, prov["owner_email"], prov["owner_password"])

        resp = await client.get(f"{API}/users", headers=_auth(token))
        assert resp.status_code == 200, resp.text

        owner_user = resp.json()["users"][0]
        roles: list[str] = owner_user["roles"]

        assert roles == ["owner"], (
            f"Owner user should have exactly ['owner'], got {roles}"
        )


class TestInvitedOperatorRoleSeed:
    """An invited operator gets 'operator', not 'owner' or any other role."""

    @pytest.mark.asyncio(loop_scope="session")
    async def test_invited_operator_has_operator_role(self, client: AsyncClient) -> None:
        """POST /users with role='operator' seeds the correct role row."""
        prov = await _provision_tenant(client)
        token = await _login(client, prov["owner_email"], prov["owner_password"])

        operator = await _invite_user(client, token=token, role="operator")
        roles: list[str] = operator["roles"]

        assert "operator" in roles, (
            f"Invited operator must have the 'operator' role; got roles={roles}"
        )

    @pytest.mark.asyncio(loop_scope="session")
    async def test_invited_operator_does_not_have_owner_role(
        self, client: AsyncClient
    ) -> None:
        """An invited operator must never receive the escalated 'owner' role."""
        prov = await _provision_tenant(client)
        token = await _login(client, prov["owner_email"], prov["owner_password"])

        operator = await _invite_user(client, token=token, role="operator")
        roles: list[str] = operator["roles"]

        assert "owner" not in roles, (
            f"Invited operator must NOT have the 'owner' role; got roles={roles}"
        )
        assert roles == ["operator"], (
            f"Invited operator should have exactly ['operator'], got {roles}"
        )

    @pytest.mark.asyncio(loop_scope="session")
    async def test_invited_operator_visible_in_user_list_with_correct_role(
        self, client: AsyncClient
    ) -> None:
        """The operator's role is consistent between POST response and GET /users list."""
        prov = await _provision_tenant(client)
        token = await _login(client, prov["owner_email"], prov["owner_password"])

        operator = await _invite_user(client, token=token, role="operator")
        operator_id: str = operator["id"]

        resp = await client.get(f"{API}/users", headers=_auth(token))
        assert resp.status_code == 200, resp.text

        users_by_id = {u["id"]: u for u in resp.json()["users"]}
        assert operator_id in users_by_id, (
            "Invited operator is missing from the tenant user list"
        )

        list_roles: list[str] = users_by_id[operator_id]["roles"]
        assert "operator" in list_roles, (
            f"Operator user in GET /users list has wrong roles: {list_roles}"
        )
        assert "owner" not in list_roles, (
            f"Operator user in GET /users list incorrectly has 'owner' role: {list_roles}"
        )


class TestRoleUpdateReflectedInUserList:
    """PATCH /users/{id}/role changes are visible in the subsequent GET /users list."""

    @pytest.mark.asyncio(loop_scope="session")
    async def test_role_update_reflected_in_get_users(self, client: AsyncClient) -> None:
        """Updating a user's role via PATCH shows the new role in GET /users."""
        prov = await _provision_tenant(client)
        token = await _login(client, prov["owner_email"], prov["owner_password"])

        # Start as operator.
        operator = await _invite_user(client, token=token, role="operator")
        operator_id: str = operator["id"]
        assert "operator" in operator["roles"]

        # Promote to admin.
        patch_resp = await client.patch(
            f"{API}/users/{operator_id}/role",
            headers=_auth(token),
            json={"role": "admin"},
        )
        assert patch_resp.status_code == 200, (
            f"PATCH /users/{{id}}/role returned {patch_resp.status_code}: {patch_resp.text}"
        )
        patched_roles: list[str] = patch_resp.json()["roles"]
        assert "admin" in patched_roles, (
            f"PATCH response should reflect the new 'admin' role; got {patched_roles}"
        )

        # Confirm the change is visible in the user list.
        list_resp = await client.get(f"{API}/users", headers=_auth(token))
        assert list_resp.status_code == 200, list_resp.text

        users_by_id = {u["id"]: u for u in list_resp.json()["users"]}
        assert operator_id in users_by_id, (
            "Updated user is missing from GET /users list after role change"
        )

        updated_roles: list[str] = users_by_id[operator_id]["roles"]
        assert "admin" in updated_roles, (
            f"GET /users list does not reflect role update; expected 'admin' in {updated_roles}"
        )
        assert "operator" not in updated_roles, (
            f"Old 'operator' role still present after update to 'admin'; got {updated_roles}"
        )

    @pytest.mark.asyncio(loop_scope="session")
    async def test_role_update_patch_response_matches_list(
        self, client: AsyncClient
    ) -> None:
        """PATCH response roles and GET /users list roles are consistent for same user."""
        prov = await _provision_tenant(client)
        token = await _login(client, prov["owner_email"], prov["owner_password"])

        viewer = await _invite_user(client, token=token, role="viewer")
        viewer_id: str = viewer["id"]

        # Change to operator.
        patch_resp = await client.patch(
            f"{API}/users/{viewer_id}/role",
            headers=_auth(token),
            json={"role": "operator"},
        )
        assert patch_resp.status_code == 200, patch_resp.text
        patch_roles = set(patch_resp.json()["roles"])

        # List should agree.
        list_resp = await client.get(f"{API}/users", headers=_auth(token))
        assert list_resp.status_code == 200, list_resp.text

        users_by_id = {u["id"]: u for u in list_resp.json()["users"]}
        list_roles = set(users_by_id[viewer_id]["roles"])

        assert patch_roles == list_roles, (
            f"PATCH response roles {patch_roles} do not match GET /users roles {list_roles}"
        )
        assert "operator" in list_roles, (
            f"Expected 'operator' after role update; got {list_roles}"
        )
