"""Base API router — aggregates every versioned sub-router."""

from __future__ import annotations

from fastapi import APIRouter

from app.interface.api.v1.auth import router as auth_router
from app.interface.api.v1.health import router as health_router
from app.interface.api.v1.roles import router as roles_router
from app.interface.api.v1.tenants import router as tenants_router
from app.interface.api.v1.users import router as users_router

api_router = APIRouter()
api_router.include_router(health_router, tags=["health"])
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(tenants_router, prefix="/tenants", tags=["tenants"])
api_router.include_router(users_router, prefix="/users", tags=["users"])
api_router.include_router(roles_router, prefix="/roles", tags=["roles"])
