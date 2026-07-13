"""
Async SQLAlchemy engine and session management.

A single process-wide async engine is created from `Settings.database_url`
and exposed to FastAPI routes via the `get_db_session` dependency, which
guarantees each request gets its own `AsyncSession` and that the session is
always closed, committing on success and rolling back on any exception.
"""

from __future__ import annotations

from collections.abc import AsyncGenerator
from functools import lru_cache

from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import Settings, get_settings


@lru_cache
def get_engine() -> AsyncEngine:
    settings = get_settings()
    return create_async_engine(
        settings.database_url,
        echo=settings.db_echo,
        pool_size=settings.db_pool_size,
        max_overflow=settings.db_max_overflow,
        pool_pre_ping=True,
    )


@lru_cache
def get_sessionmaker() -> async_sessionmaker[AsyncSession]:
    return async_sessionmaker(bind=get_engine(), expire_on_commit=False, class_=AsyncSession)


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency yielding a transactional `AsyncSession`."""
    session_factory = get_sessionmaker()
    async with session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def ensure_schema_exists(settings: Settings | None = None) -> None:
    """Create the enterprise platform's dedicated Postgres schema if missing.

    The platform is intentionally isolated in its own schema inside the
    workspace's shared Postgres instance so it never collides with the
    existing Node/Drizzle tables living in `public`.
    """
    from sqlalchemy import text

    settings = settings or get_settings()
    engine = get_engine()
    async with engine.begin() as conn:
        await conn.execute(text(f'CREATE SCHEMA IF NOT EXISTS "{settings.db_schema}"'))
