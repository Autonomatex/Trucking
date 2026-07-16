"""
Integration tests: disabled-account sign-in rejection.

Verifies that:

1. A user whose ``is_active`` flag is set to ``False`` cannot obtain a new
   access token via ``POST /api/v1/auth/login`` — the endpoint must return
   HTTP 401 regardless of whether the password is correct.

2. The ``is_active`` filter inside ``AuthService.authenticate`` continues to
   work correctly through the ``PATCH /users/{id}/active`` mutation path —
   i.e. disabling an account after the user has already authenticated blocks
   any subsequent login attempt with that account's credentials.

These tests close the regression gap identified in Task 17: previously there
were no automated checks ensuring that a valid-credential holder whose account
was later disabled could not re-authenticate.
"""

from __future__ import annotations

import uuid

import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.asyncio(loop_scope="session")

API = "/api/v1"


# ---------------------------------------------------------------------------
# Helpers (mirrors conventions in test_tenant_isolation.py)
# ---------------------------------------------------------------------------


def _uniq(prefix: str = "u") -> str:
    return f"{prefix}-{uuid.uuid4().hex[:8]}"


def _email(prefix: str = "user") -> str:
    return f"{_uniq(prefix)}@example.com"


async def _provision_tenant(client: AsyncClient) -> dict:
    """Create a fresh tenant and return owner credentials alongside the response."""
    slug = f"co-{uuid.uuid4().hex[:10]}"
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
        "owner_email": owner_email,
        "owner_password": owner_password,
    }


async def _login(client: AsyncClient, email: str, password: str) -> str:
    """Return a bearer access token; asserts HTTP 200."""
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
    password: str = "Teammate!99",
    role: str = "operator",
) -> dict:
    """Invite a new staff member into the authenticated tenant. Returns JSON."""
    email = email or _email("staff")
    resp = await client.post(
        f"{API}/users",
        headers=_auth(token),
        json={
            "email": email,
            "password": password,
            "full_name": "Staff Member",
            "role": role,
        },
    )
    assert resp.status_code == 201, resp.text
    return {**resp.json(), "_email": email, "_password": password}


async def _set_active(
    client: AsyncClient, *, token: str, user_id: str, is_active: bool
) -> None:
    """PATCH /users/{user_id}/active and assert HTTP 200."""
    resp = await client.patch(
        f"{API}/users/{user_id}/active",
        headers=_auth(token),
        json={"is_active": is_active},
    )
    assert resp.status_code == 200, resp.text


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------


class TestDisabledAccountCannotLogin:
    """A disabled account is rejected at the login endpoint."""

    @pytest.mark.asyncio(loop_scope="session")
    async def test_disabled_user_cannot_obtain_token(
        self, client: AsyncClient
    ) -> None:
        """
        Given a user whose account is disabled by the owner,
        when the user tries to log in with correct credentials,
        then POST /auth/login must return HTTP 401.
        """
        prov = await _provision_tenant(client)
        owner_token = await _login(
            client, prov["owner_email"], prov["owner_password"]
        )

        # Invite a staff member who will later be disabled.
        staff = await _invite_user(client, token=owner_token)
        staff_email = staff["_email"]
        staff_password = staff["_password"]
        staff_id = staff["id"]

        # Confirm the staff member can log in while still active.
        await _login(client, staff_email, staff_password)

        # Owner disables the account.
        await _set_active(client, token=owner_token, user_id=staff_id, is_active=False)

        # Attempt to log in with the now-disabled account.
        resp = await client.post(
            f"{API}/auth/login",
            json={"email": staff_email, "password": staff_password},
        )
        assert resp.status_code == 401, (
            f"Expected 401 for disabled account login, got {resp.status_code}: {resp.text}"
        )

    @pytest.mark.asyncio(loop_scope="session")
    async def test_disabled_owner_cannot_obtain_token(
        self, client: AsyncClient
    ) -> None:
        """
        A tenant owner whose account is disabled by another admin is also
        rejected — the is_active check applies regardless of role.
        """
        prov = await _provision_tenant(client)
        owner_token = await _login(
            client, prov["owner_email"], prov["owner_password"]
        )

        # Invite an admin who will disable the owner's account.
        admin = await _invite_user(
            client, token=owner_token, role="admin"
        )
        admin_token = await _login(client, admin["_email"], admin["_password"])

        # Retrieve the owner's user ID from the user list.
        list_resp = await client.get(f"{API}/users", headers=_auth(owner_token))
        assert list_resp.status_code == 200, list_resp.text
        owner_id = next(
            u["id"]
            for u in list_resp.json()["users"]
            if u["email"] == prov["owner_email"]
        )

        # Admin disables the owner.
        await _set_active(
            client, token=admin_token, user_id=owner_id, is_active=False
        )

        # Owner's credentials must now be rejected.
        resp = await client.post(
            f"{API}/auth/login",
            json={"email": prov["owner_email"], "password": prov["owner_password"]},
        )
        assert resp.status_code == 401, (
            f"Expected 401 for disabled owner login, got {resp.status_code}: {resp.text}"
        )

    @pytest.mark.asyncio(loop_scope="session")
    async def test_re_enabled_account_can_login_again(
        self, client: AsyncClient
    ) -> None:
        """
        A previously disabled account that is re-enabled can obtain a token
        again — ensures the is_active flag is not a one-way latch.
        """
        prov = await _provision_tenant(client)
        owner_token = await _login(
            client, prov["owner_email"], prov["owner_password"]
        )

        staff = await _invite_user(client, token=owner_token)
        staff_email = staff["_email"]
        staff_password = staff["_password"]
        staff_id = staff["id"]

        # Disable then re-enable.
        await _set_active(client, token=owner_token, user_id=staff_id, is_active=False)
        await _set_active(client, token=owner_token, user_id=staff_id, is_active=True)

        # Should be able to log in after re-enabling.
        token = await _login(client, staff_email, staff_password)
        assert token, "Expected a non-empty access token after account was re-enabled"


class TestIsActiveFilterSurvivesMutationPath:
    """
    Verify the is_active guard in AuthService.authenticate is not bypassed
    through the PATCH /users/{id}/active mutation path.
    """

    @pytest.mark.asyncio(loop_scope="session")
    async def test_authenticate_rejects_after_patch_disable(
        self, client: AsyncClient
    ) -> None:
        """
        After PATCH /users/{id}/active sets is_active=False, a subsequent call
        to POST /auth/login with correct credentials returns 401 — confirming
        that the mutation path writes through to the same column that
        AuthService.authenticate reads.
        """
        prov = await _provision_tenant(client)
        owner_token = await _login(
            client, prov["owner_email"], prov["owner_password"]
        )

        staff = await _invite_user(client, token=owner_token)
        staff_id = staff["id"]
        staff_email = staff["_email"]
        staff_password = staff["_password"]

        # Verify login works before mutation.
        pre_disable_resp = await client.post(
            f"{API}/auth/login",
            json={"email": staff_email, "password": staff_password},
        )
        assert pre_disable_resp.status_code == 200, (
            f"Login should succeed before disable: {pre_disable_resp.text}"
        )

        # Apply the mutation.
        await _set_active(client, token=owner_token, user_id=staff_id, is_active=False)

        # Same credentials must now be rejected.
        post_disable_resp = await client.post(
            f"{API}/auth/login",
            json={"email": staff_email, "password": staff_password},
        )
        assert post_disable_resp.status_code == 401, (
            "AuthService.authenticate must reject a disabled account even with "
            f"correct credentials; got {post_disable_resp.status_code}: {post_disable_resp.text}"
        )

    @pytest.mark.asyncio(loop_scope="session")
    async def test_patch_response_reflects_is_active_false(
        self, client: AsyncClient
    ) -> None:
        """
        The PATCH /users/{id}/active response body must include is_active=False
        so callers can confirm the write succeeded before relying on downstream
        enforcement.
        """
        prov = await _provision_tenant(client)
        owner_token = await _login(
            client, prov["owner_email"], prov["owner_password"]
        )

        staff = await _invite_user(client, token=owner_token)
        staff_id = staff["id"]

        resp = await client.patch(
            f"{API}/users/{staff_id}/active",
            headers=_auth(owner_token),
            json={"is_active": False},
        )
        assert resp.status_code == 200, resp.text
        body = resp.json()
        assert body["is_active"] is False, (
            f"PATCH response should show is_active=False, got: {body.get('is_active')}"
        )
