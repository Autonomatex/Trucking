"""Authentication endpoints — real login against the `User` table."""

from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings, get_settings
from app.core.exceptions import AuthenticationError
from app.infrastructure.db.session import get_db_session
from app.infrastructure.security.principal import CurrentPrincipal, get_current_principal
from app.interface.schemas.auth import LoginRequest, MeResponse, TokenResponse

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
async def login(
    payload: LoginRequest,
    session: AsyncSession = Depends(get_db_session),
    settings: Settings = Depends(get_settings),
) -> TokenResponse:
    """
    Authenticate a user by email/password.

    Phase 1 resolves the tenant by looking up the email across all tenants
    (email is only unique per-tenant, not globally) and picking the first
    active match. Tenant-aware login (subdomain or explicit tenant slug) is
    added when the tenant management endpoints ship in a later phase.
    """
    from sqlalchemy import select

    from app.application.services.auth_service import AuthService
    from app.infrastructure.db.models.user import User
    from app.infrastructure.db.repositories.user_repository import UserRepository
    from app.infrastructure.db.repositories.user_role_repository import UserRoleRepository

    result = await session.execute(
        select(User).where(User.email == payload.email, User.is_active.is_(True))
    )
    user = result.scalars().first()
    if user is None:
        raise AuthenticationError("Invalid email or password.")

    user_repository = UserRepository(session, tenant_id=user.tenant_id)
    user_role_repository = UserRoleRepository(session, tenant_id=user.tenant_id)
    auth_service = AuthService(
        user_repository=user_repository,
        user_role_repository=user_role_repository,
        settings=settings,
    )
    tokens = await auth_service.authenticate(email=payload.email, password=payload.password)

    return TokenResponse(access_token=tokens.access_token, refresh_token=tokens.refresh_token)


@router.get("/me", response_model=MeResponse)
async def me(
    principal: CurrentPrincipal = Depends(get_current_principal),
    session: AsyncSession = Depends(get_db_session),
) -> MeResponse:
    """Resolve the authenticated principal's profile and effective permissions.

    Used by the frontend right after login (and on every page load) to know
    who is signed in and what they're allowed to do, without decoding the
    JWT client-side.
    """
    from app.infrastructure.db.repositories.user_repository import UserRepository
    from app.infrastructure.security.rbac import permissions_for_roles

    user_repository = UserRepository(session, tenant_id=principal.tenant_id)
    user = await user_repository.get_by_id_or_raise(principal.user_id)
    permissions = sorted(p.value for p in permissions_for_roles(principal.roles))

    return MeResponse(
        id=user.id,
        tenant_id=principal.tenant_id,
        email=user.email,
        full_name=user.full_name,
        roles=principal.roles,
        permissions=permissions,
    )
