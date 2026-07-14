"""Shared FastAPI dependencies for the interface layer."""

from __future__ import annotations

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.db.repositories.tenant_repository import TenantRepository
from app.infrastructure.db.repositories.user_repository import UserRepository
from app.infrastructure.db.session import get_db_session
from app.infrastructure.security.principal import CurrentPrincipal, get_current_principal


def get_user_repository(
    session: AsyncSession = Depends(get_db_session),
    principal: CurrentPrincipal = Depends(get_current_principal),
) -> UserRepository:
    return UserRepository(session, tenant_id=principal.tenant_id)


def get_user_repository_for_tenant(tenant_id: str, session: AsyncSession) -> UserRepository:
    """Used by unauthenticated flows (e.g. login) that resolve tenant from the request body."""
    return UserRepository(session, tenant_id=tenant_id)


def get_tenant_repository(session: AsyncSession = Depends(get_db_session)) -> TenantRepository:
    """`Tenant` is the root aggregate — this repository is intentionally not
    tenant-scoped (see `TenantRepository`)."""
    return TenantRepository(session)
