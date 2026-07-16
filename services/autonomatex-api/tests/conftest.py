"""
Pytest configuration and shared fixtures for the autonomatex-api integration tests.

Tests run against the real development Postgres database using isolated tenant
slugs so each test run can create tenants without colliding with previous ones.
All async tests share a single event loop (via asyncio_default_fixture_loop_scope
= session) so the lru_cache'd SQLAlchemy engine and connection pool are never
handed to a different loop.
"""

from __future__ import annotations

import uuid
from typing import AsyncGenerator

import pytest_asyncio
from httpx import ASGITransport, AsyncClient

from app.main import create_app


@pytest_asyncio.fixture(scope="session")
async def client() -> AsyncGenerator[AsyncClient, None]:
    """HTTP client wired directly to the ASGI app — no network round-trip.

    Session-scoped so the SQLAlchemy engine (lru_cache'd) stays on one loop
    for the entire test run.
    """
    application = create_app()
    async with AsyncClient(
        transport=ASGITransport(app=application),
        base_url="http://test",
    ) as ac:
        yield ac
