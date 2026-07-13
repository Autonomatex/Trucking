"""
Health and readiness endpoints.

`/health` is a liveness probe with no dependencies. `/health/ready`
actively checks Postgres and Redis connectivity so orchestration/monitoring
can distinguish "process is up" from "process can actually serve traffic".
"""

from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings, get_settings
from app.infrastructure.cache.redis_client import get_redis
from app.infrastructure.db.session import get_db_session
from app.interface.schemas.health import HealthResponse, ReadinessResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health(settings: Settings = Depends(get_settings)) -> HealthResponse:
    return HealthResponse(status="ok", environment=settings.environment)


@router.get("/health/ready", response_model=ReadinessResponse)
async def readiness(session: AsyncSession = Depends(get_db_session)) -> ReadinessResponse:
    database_ok = False
    redis_ok = False

    try:
        await session.execute(text("SELECT 1"))
        database_ok = True
    except Exception:
        database_ok = False

    try:
        redis_ok = bool(await get_redis().ping())
    except Exception:
        redis_ok = False

    return ReadinessResponse(
        status="ok" if database_ok and redis_ok else "degraded",
        database=database_ok,
        redis=redis_ok,
    )
