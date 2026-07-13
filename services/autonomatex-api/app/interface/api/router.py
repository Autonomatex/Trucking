"""Base API router — aggregates every versioned sub-router."""

from __future__ import annotations

from fastapi import APIRouter

from app.interface.api.v1.auth import router as auth_router
from app.interface.api.v1.health import router as health_router

api_router = APIRouter()
api_router.include_router(health_router, tags=["health"])
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
