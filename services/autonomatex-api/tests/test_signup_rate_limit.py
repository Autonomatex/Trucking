"""
Integration tests: signup rate-limit enforcement on POST /api/v1/tenants.

Verifies that the per-IP fixed-window rate limiter actually blocks a burst of
requests from the same IP and that requests from a different IP are unaffected.

Design
------
The ASGI transport used in tests always presents the same TCP peer address
("testclient").  To exercise real IP-based discrimination without touching the
network, these tests use a dedicated ASGI app whose settings are overridden to
set ``rate_limit_trusted_proxy_count=1``.  That makes the server read the real
client IP from ``X-Forwarded-For``, so each test can supply a unique fake IP.

Redis is replaced with an in-memory ``fakeredis.aioredis.FakeRedis`` instance
that is injected directly into the rate-limit module's ``_redis_client``
singleton.  The same instance is exposed as the ``fake_redis`` fixture so that
tests can seed and inspect counters without talking to a real Redis server.  This
makes the tests:

  - Hermetic (no external Redis required).
  - Reproducible (each test starts with a fresh, predictable counter state).
  - Fast (no network I/O).

Redis key cleanup
-----------------
Each test deletes all keys it creates in a ``finally`` block so that a failing
test cannot poison a later one.  ``delete`` on a non-existent key is a no-op.
"""

from __future__ import annotations

import time
import uuid
from typing import AsyncGenerator

import fakeredis.aioredis
import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient

import app.infrastructure.rate_limit as _rl_module
from app.core.config import get_settings
from app.main import create_app

# All async tests share the session-scoped event loop (mirrors conftest.py).
pytestmark = pytest.mark.asyncio(loop_scope="session")

API = "/api/v1/tenants"

# These must match the values in Settings / rate_limit.py defaults.
_KEY_PREFIX = "tenant_signup"
_MAX_REQUESTS = 5       # Settings.signup_rate_limit_requests
_WINDOW_SECONDS = 3600  # Settings.signup_rate_limit_window_seconds (1 hour)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _rate_limit_key(ip: str) -> str:
    """Return the exact Redis key the rate limiter uses for *ip* right now."""
    window_start = int(time.time()) // _WINDOW_SECONDS
    return f"rl:{_KEY_PREFIX}:{ip}:{window_start}"


def _unique_ip(label: str = "ip") -> str:
    """Generate a unique fake IP string that is isolated to the current test."""
    return f"192.0.2.{label}.{uuid.uuid4().hex[:8]}"


def _xff(ip: str) -> dict[str, str]:
    """Build the X-Forwarded-For header that makes the server see *ip*."""
    return {"X-Forwarded-For": ip}


def _signup_payload() -> dict:
    """Build a valid, unique tenant-creation payload."""
    uid = uuid.uuid4().hex[:10]
    return {
        "name": f"Rate Limit Test Co {uid}",
        "slug": f"rl-test-{uid}",
        "owner_email": f"owner.{uid}@example.com",
        "owner_password": "Str0ng!Pass99",
        "owner_full_name": "RL Test Owner",
    }


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------


@pytest_asyncio.fixture(scope="session")
async def fake_redis() -> AsyncGenerator[fakeredis.aioredis.FakeRedis, None]:
    """In-memory Redis substitute shared by the app under test and the tests themselves.

    Injected into the rate-limit module's ``_redis_client`` singleton so that
    the real ``_get_redis`` factory is bypassed — no real Redis server is needed.
    The original singleton value is restored after the session ends.
    """
    original = _rl_module._redis_client
    server = fakeredis.aioredis.FakeServer()
    client: fakeredis.aioredis.FakeRedis = fakeredis.aioredis.FakeRedis(
        server=server, decode_responses=True
    )
    _rl_module._redis_client = client  # type: ignore[assignment]
    yield client
    _rl_module._redis_client = original


@pytest_asyncio.fixture(scope="session")
async def rl_client(
    fake_redis: fakeredis.aioredis.FakeRedis,
) -> AsyncGenerator[AsyncClient, None]:
    """ASGI client with rate limiting wired to fake Redis and trusted_proxy_count=1.

    Setting ``rate_limit_trusted_proxy_count=1`` lets each test control which
    IP bucket the rate limiter writes to by passing an ``X-Forwarded-For``
    header — without this, every test request would be attributed to the fixed
    TCP peer address ("testclient") used by the ASGI transport.
    """
    base = get_settings()
    overridden_settings = base.model_copy(
        update={"rate_limit_trusted_proxy_count": 1}
    )

    application = create_app()
    application.dependency_overrides[get_settings] = lambda: overridden_settings

    async with AsyncClient(
        transport=ASGITransport(app=application),
        base_url="http://test",
    ) as ac:
        yield ac

    application.dependency_overrides.clear()


# ---------------------------------------------------------------------------
# Tests: burst from the same IP
# ---------------------------------------------------------------------------


class TestSignupRateLimitBurst:
    """Sending > 5 requests from the same IP within a single window triggers 429."""

    @pytest.mark.asyncio(loop_scope="session")
    async def test_sixth_request_returns_429(
        self,
        rl_client: AsyncClient,
        fake_redis: fakeredis.aioredis.FakeRedis,
    ) -> None:
        """Requests 1-5 succeed (or fail for business reasons); the 6th gets 429."""
        ip = _unique_ip("burst-sixth")
        key = _rate_limit_key(ip)

        try:
            statuses: list[int] = []
            for _ in range(_MAX_REQUESTS + 1):
                resp = await rl_client.post(
                    API,
                    json=_signup_payload(),
                    headers=_xff(ip),
                )
                statuses.append(resp.status_code)

            # The last request must be rate-limited.
            assert statuses[-1] == 429, (
                f"Expected 429 on request #{_MAX_REQUESTS + 1}, "
                f"got {statuses[-1]}. All statuses: {statuses}"
            )

            # No earlier request may have been rate-limited.
            for i, status in enumerate(statuses[:-1], start=1):
                assert status != 429, (
                    f"Request #{i} was unexpectedly rate-limited (429) "
                    f"before the limit was reached. All statuses: {statuses}"
                )
        finally:
            await fake_redis.delete(key)

    @pytest.mark.asyncio(loop_scope="session")
    async def test_sixth_request_error_code(
        self,
        rl_client: AsyncClient,
        fake_redis: fakeredis.aioredis.FakeRedis,
    ) -> None:
        """The 429 response body carries error_code='rate_limit_exceeded'."""
        ip = _unique_ip("burst-errcode")
        key = _rate_limit_key(ip)

        try:
            # Exhaust the limit.
            for _ in range(_MAX_REQUESTS):
                await rl_client.post(API, json=_signup_payload(), headers=_xff(ip))

            # One more — must be blocked.
            resp = await rl_client.post(
                API, json=_signup_payload(), headers=_xff(ip)
            )
            assert resp.status_code == 429, (
                f"Expected 429 on request #{_MAX_REQUESTS + 1}, got {resp.status_code}"
            )

            body = resp.json()
            assert "error" in body, f"Response body missing 'error' key: {body}"
            assert body["error"].get("code") == "rate_limit_exceeded", (
                f"Expected error code 'rate_limit_exceeded', got: {body}"
            )
        finally:
            await fake_redis.delete(key)

    @pytest.mark.asyncio(loop_scope="session")
    async def test_requests_beyond_sixth_also_blocked(
        self,
        rl_client: AsyncClient,
        fake_redis: fakeredis.aioredis.FakeRedis,
    ) -> None:
        """Every request after the 5th (not just the 6th) is blocked with 429."""
        ip = _unique_ip("burst-beyond")
        key = _rate_limit_key(ip)

        try:
            # Exhaust the limit.
            for _ in range(_MAX_REQUESTS):
                await rl_client.post(API, json=_signup_payload(), headers=_xff(ip))

            # Requests 6, 7, and 8 should all be blocked.
            for attempt in range(3):
                resp = await rl_client.post(
                    API, json=_signup_payload(), headers=_xff(ip)
                )
                assert resp.status_code == 429, (
                    f"Request #{_MAX_REQUESTS + attempt + 1} was not blocked "
                    f"(got {resp.status_code})"
                )
        finally:
            await fake_redis.delete(key)


# ---------------------------------------------------------------------------
# Tests: cross-IP isolation
# ---------------------------------------------------------------------------


class TestSignupRateLimitIsolation:
    """Rate-limit counters are scoped per IP; a different IP is never blocked."""

    @pytest.mark.asyncio(loop_scope="session")
    async def test_different_ip_not_affected(
        self,
        rl_client: AsyncClient,
        fake_redis: fakeredis.aioredis.FakeRedis,
    ) -> None:
        """An IP at the rate limit does not block requests from a different IP."""
        blocked_ip = _unique_ip("iso-blocked")
        clean_ip = _unique_ip("iso-clean")
        blocked_key = _rate_limit_key(blocked_ip)
        clean_key = _rate_limit_key(clean_ip)

        try:
            # Seed the blocked IP's counter to the exact limit directly in Redis,
            # then confirm the very next request from that IP is rejected.
            await fake_redis.set(blocked_key, _MAX_REQUESTS, ex=_WINDOW_SECONDS)

            blocked_resp = await rl_client.post(
                API, json=_signup_payload(), headers=_xff(blocked_ip)
            )
            assert blocked_resp.status_code == 429, (
                f"Blocked IP should get 429, got {blocked_resp.status_code}"
            )

            # A clean IP with no counter must NOT be blocked.
            clean_resp = await rl_client.post(
                API, json=_signup_payload(), headers=_xff(clean_ip)
            )
            assert clean_resp.status_code != 429, (
                f"Clean IP was unexpectedly rate-limited (429). "
                f"Blocked key: {blocked_key!r}"
            )
        finally:
            await fake_redis.delete(blocked_key, clean_key)

    @pytest.mark.asyncio(loop_scope="session")
    async def test_key_deletion_resets_counter(
        self,
        rl_client: AsyncClient,
        fake_redis: fakeredis.aioredis.FakeRedis,
    ) -> None:
        """Deleting the rate-limit key for an IP resets its counter to zero.

        This is an explicit simulation of the window expiring: once the Redis
        key is gone, the same IP can make requests again from scratch.
        """
        ip = _unique_ip("iso-reset")
        key = _rate_limit_key(ip)

        try:
            # Exhaust the limit.
            for _ in range(_MAX_REQUESTS):
                await rl_client.post(API, json=_signup_payload(), headers=_xff(ip))

            blocked = await rl_client.post(
                API, json=_signup_payload(), headers=_xff(ip)
            )
            assert blocked.status_code == 429, (
                f"Expected 429 after exhausting limit, got {blocked.status_code}"
            )

            # Simulate end-of-window by removing the key (as Redis TTL expiry would).
            await fake_redis.delete(key)

            # The IP can now make requests again (counter reset to zero).
            reset_resp = await rl_client.post(
                API, json=_signup_payload(), headers=_xff(ip)
            )
            assert reset_resp.status_code != 429, (
                f"IP should not be rate-limited after key was deleted, "
                f"got {reset_resp.status_code}"
            )
        finally:
            await fake_redis.delete(key)
