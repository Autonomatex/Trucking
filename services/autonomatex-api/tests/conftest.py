"""
Pytest configuration and shared fixtures for the autonomatex-api integration tests.

Tests run against the real development Postgres database using isolated tenant
slugs so each test run can create tenants without colliding with previous ones.
All async tests share a single event loop (via asyncio_default_fixture_loop_scope
= session) so the lru_cache'd SQLAlchemy engine and connection pool are never
handed to a different loop.

Rate limiting is disabled for tests by overriding the `get_settings` dependency
with a copy of the real settings that has `signup_rate_limit_requests` set to
an arbitrarily high value. This prevents the shared Redis counter (keyed to
127.0.0.1) from throttling test-tenant provisioning calls.
"""

from __future__ import annotations

import uuid
from typing import AsyncGenerator

import pytest_asyncio
from httpx import ASGITransport, AsyncClient

from app.core.config import get_settings
from app.main import create_app


@pytest_asyncio.fixture(scope="session")
async def client() -> AsyncGenerator[AsyncClient, None]:
    """HTTP client wired directly to the ASGI app — no network round-trip.

    Session-scoped so the SQLAlchemy engine (lru_cache'd) stays on one loop
    for the entire test run.

    The rate limiter dependency is overridden so the 5-per-hour signup cap
    never interferes with tests that provision many tenants in quick succession.
    """
    application = create_app()

    # Build a test-safe settings copy: keep all real config (DB URL, JWT
    # secret, Redis URL, etc.) but raise the rate limit cap high enough that
    # no realistic test suite will ever hit it.
    real_settings = get_settings()
    test_settings = real_settings.model_copy(
        update={"signup_rate_limit_requests": 100_000}
    )
    application.dependency_overrides[get_settings] = lambda: test_settings

    async with AsyncClient(
        transport=ASGITransport(app=application),
        base_url="http://test",
    ) as ac:
        yield ac
