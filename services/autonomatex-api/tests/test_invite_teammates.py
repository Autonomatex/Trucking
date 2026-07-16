"""
Integration tests: company owners can invite teammates to their own tenant.

Verifies:
1. A user with USER_MANAGE permission (owner/admin) can create a new user
   scoped to their own tenant via POST /api/v1/users.
2. Two invited teammates are visible in the same tenant's user list.
3. A second tenant's owner cannot see users that belong to the first tenant
   (cross-tenant isolation).
4. A caller without USER_MANAGE permission (operator/viewer) gets 403.
"""

from __future__ import annotations

import uuid

import pytest
from httpx import AsyncClient

# Share one event loop with the session-scoped client fixture so the
# lru_cache'd SQLAlchemy engine is never handed to a different loop.
pytestmark = pytest.mark.asyncio(loop_scope="session")

API = "/api/v1"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _uniq_email(prefix: str = "user") -> str:
    return f"{prefix}-{uuid.uuid4().hex[:8]}@example.com"


async def _provision_tenant(client: AsyncClient, slug: str | None = None) -> dict:
    """Create a new tenant and return its JSON payload (including the owner creds)."""
    slug = slug or f"co-{uuid.uuid4().hex[:10]}"
    owner_email = _uniq_email("owner")
    owner_password = "Str0ng!Pass"
    resp = await client.post(f"{API}/tenants", json={
        "name": slug.title(),
        "slug": slug,
        "owner_email": owner_email,
        "owner_password": owner_password,
        "owner_full_name": "Test Owner",
    })
    assert resp.status_code == 201, resp.text
    return {
        "tenant": resp.json(),
        "owner_email": owner_email,
        "owner_password": owner_password,
    }


async def _login(client: AsyncClient, email: str, password: str) -> str:
    """Return a bearer access token."""
    resp = await client.post(f"{API}/auth/login", json={"email": email, "password": password})
    assert resp.status_code == 200, resp.text
    return resp.json()["access_token"]


def _auth(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_owner_can_invite_teammate(client: AsyncClient):
    """POST /users creates a new user scoped to the caller's own tenant."""
    provision = await _provision_tenant(client)
    token = await _login(client, provision["owner_email"], provision["owner_password"])

    teammate_email = _uniq_email("teammate")
    resp = await client.post(
        f"{API}/users",
        json={
            "email": teammate_email,
            "password": "Teammate!99",
            "full_name": "Alice Teammate",
            "role": "operator",
        },
        headers=_auth(token),
    )
    assert resp.status_code == 201, resp.text
    body = resp.json()
    assert body["email"] == teammate_email
    assert body["full_name"] == "Alice Teammate"
    assert body["is_active"] is True
    assert "operator" in body["roles"]


@pytest.mark.asyncio
async def test_two_teammates_visible_in_same_tenant(client: AsyncClient):
    """Inviting two teammates means both appear in the same tenant's user list."""
    provision = await _provision_tenant(client)
    token = await _login(client, provision["owner_email"], provision["owner_password"])
    headers = _auth(token)

    email_a = _uniq_email("ta")
    email_b = _uniq_email("tb")

    for email in (email_a, email_b):
        resp = await client.post(
            f"{API}/users",
            json={"email": email, "password": "Teammate!99", "full_name": "Staff", "role": "viewer"},
            headers=headers,
        )
        assert resp.status_code == 201, resp.text

    # Owner + 2 teammates = 3 users in the list
    list_resp = await client.get(f"{API}/users", headers=headers)
    assert list_resp.status_code == 200, list_resp.text
    emails_in_list = {u["email"] for u in list_resp.json()["users"]}
    assert email_a in emails_in_list
    assert email_b in emails_in_list
    assert provision["owner_email"] in emails_in_list


@pytest.mark.asyncio
async def test_cross_tenant_isolation(client: AsyncClient):
    """A second tenant's owner cannot see users created inside the first tenant."""
    # Tenant A: create two users
    prov_a = await _provision_tenant(client)
    token_a = await _login(client, prov_a["owner_email"], prov_a["owner_password"])

    teammate_a_email = _uniq_email("ta")
    resp = await client.post(
        f"{API}/users",
        json={"email": teammate_a_email, "password": "Teammate!99", "full_name": "Tenant A Staff", "role": "operator"},
        headers=_auth(token_a),
    )
    assert resp.status_code == 201, resp.text

    # Tenant B: fresh tenant, completely separate
    prov_b = await _provision_tenant(client)
    token_b = await _login(client, prov_b["owner_email"], prov_b["owner_password"])

    list_resp = await client.get(f"{API}/users", headers=_auth(token_b))
    assert list_resp.status_code == 200, list_resp.text
    emails_in_b = {u["email"] for u in list_resp.json()["users"]}

    # Tenant B sees only its own owner — never tenant A's users
    assert teammate_a_email not in emails_in_b
    assert prov_a["owner_email"] not in emails_in_b
    assert prov_b["owner_email"] in emails_in_b


@pytest.mark.asyncio
async def test_invited_teammate_can_login(client: AsyncClient):
    """A newly invited teammate can authenticate with their own credentials."""
    provision = await _provision_tenant(client)
    token = await _login(client, provision["owner_email"], provision["owner_password"])

    teammate_email = _uniq_email("logintest")
    teammate_password = "Login!Mate99"
    resp = await client.post(
        f"{API}/users",
        json={"email": teammate_email, "password": teammate_password, "full_name": "Loginable User", "role": "viewer"},
        headers=_auth(token),
    )
    assert resp.status_code == 201, resp.text

    # The teammate should be able to log in independently
    teammate_token = await _login(client, teammate_email, teammate_password)
    assert isinstance(teammate_token, str) and len(teammate_token) > 0

    # And /auth/me confirms their identity
    me_resp = await client.get(f"{API}/auth/me", headers=_auth(teammate_token))
    assert me_resp.status_code == 200, me_resp.text
    assert me_resp.json()["email"] == teammate_email


@pytest.mark.asyncio
async def test_operator_cannot_invite(client: AsyncClient):
    """A user with only operator permissions gets 403 when trying to invite."""
    provision = await _provision_tenant(client)
    owner_token = await _login(client, provision["owner_email"], provision["owner_password"])

    # Invite an operator
    op_email = _uniq_email("operator")
    resp = await client.post(
        f"{API}/users",
        json={"email": op_email, "password": "Operator!99", "full_name": "Op User", "role": "operator"},
        headers=_auth(owner_token),
    )
    assert resp.status_code == 201, resp.text

    # Operator tries to invite another user — must be refused
    op_token = await _login(client, op_email, "Operator!99")
    new_email = _uniq_email("blocked")
    blocked_resp = await client.post(
        f"{API}/users",
        json={"email": new_email, "password": "Blocked!99", "full_name": "Blocked User", "role": "viewer"},
        headers=_auth(op_token),
    )
    assert blocked_resp.status_code == 403, blocked_resp.text


@pytest.mark.asyncio
async def test_unauthenticated_invite_rejected(client: AsyncClient):
    """POST /users without a bearer token returns 401/403."""
    resp = await client.post(
        f"{API}/users",
        json={"email": _uniq_email(), "password": "NoAuth!99", "full_name": "Ghost", "role": "viewer"},
    )
    assert resp.status_code in {401, 403}, resp.text


@pytest.mark.asyncio
async def test_duplicate_email_within_tenant_rejected(client: AsyncClient):
    """Inviting the same email address twice to the same tenant returns 409."""
    provision = await _provision_tenant(client)
    token = await _login(client, provision["owner_email"], provision["owner_password"])
    headers = _auth(token)

    email = _uniq_email("dup")
    payload = {"email": email, "password": "Dup!Pass99", "full_name": "Dup User", "role": "viewer"}

    first = await client.post(f"{API}/users", json=payload, headers=headers)
    assert first.status_code == 201, first.text

    second = await client.post(f"{API}/users", json=payload, headers=headers)
    assert second.status_code == 409, second.text
