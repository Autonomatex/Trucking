"""Staff user management endpoints — admin-facing CRUD + role assignment.

Every route sits behind `get_current_principal` (via the permission
dependencies below) and is tenant-scoped by the injected repositories, so
one tenant's admin can never see or modify another tenant's users. `USER_READ`
gates visibility (granted to every built-in role); `USER_MANAGE` and
`ROLE_MANAGE` gate mutations to owner/admin.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends

from app.application.services.user_service import UserService, UserWithRoles
from app.domain.notifications.sender import LoggingNotificationSender
from app.infrastructure.db.repositories.role_repository import RoleRepository
from app.infrastructure.db.repositories.user_repository import UserRepository
from app.infrastructure.db.repositories.user_role_repository import UserRoleRepository
from app.infrastructure.security.principal import CurrentPrincipal
from app.infrastructure.security.rbac import Permission, require_permission
from app.interface.api.deps import (
    get_role_repository,
    get_user_repository,
    get_user_role_repository,
)
from app.interface.schemas.user import (
    UserActiveUpdateRequest,
    UserCreateRequest,
    UserListResponse,
    UserResponse,
    UserRoleUpdateRequest,
)

router = APIRouter()


def _to_response(entry: UserWithRoles) -> UserResponse:
    return UserResponse(
        id=entry.user.id,
        email=entry.user.email,
        full_name=entry.user.full_name,
        is_active=entry.user.is_active,
        roles=entry.roles,
    )


def _build_service(
    user_repository: UserRepository,
    role_repository: RoleRepository,
    user_role_repository: UserRoleRepository,
) -> UserService:
    return UserService(
        user_repository=user_repository,
        role_repository=role_repository,
        user_role_repository=user_role_repository,
        notification_sender=LoggingNotificationSender(),
    )


@router.get("", response_model=UserListResponse)
async def list_users(
    _: CurrentPrincipal = Depends(require_permission(Permission.USER_READ)),
    user_repository: UserRepository = Depends(get_user_repository),
    role_repository: RoleRepository = Depends(get_role_repository),
    user_role_repository: UserRoleRepository = Depends(get_user_role_repository),
) -> UserListResponse:
    service = _build_service(user_repository, role_repository, user_role_repository)
    entries = await service.list_users()
    return UserListResponse(users=[_to_response(e) for e in entries])


@router.post("", response_model=UserResponse, status_code=201)
async def create_user(
    payload: UserCreateRequest,
    _: CurrentPrincipal = Depends(require_permission(Permission.USER_MANAGE)),
    user_repository: UserRepository = Depends(get_user_repository),
    role_repository: RoleRepository = Depends(get_role_repository),
    user_role_repository: UserRoleRepository = Depends(get_user_role_repository),
) -> UserResponse:
    service = _build_service(user_repository, role_repository, user_role_repository)
    entry = await service.create_user(
        email=payload.email,
        password=payload.password,
        full_name=payload.full_name,
        role_name=payload.role,
    )
    return _to_response(entry)


@router.patch("/{user_id}/role", response_model=UserResponse)
async def update_user_role(
    user_id: str,
    payload: UserRoleUpdateRequest,
    _: CurrentPrincipal = Depends(require_permission(Permission.ROLE_MANAGE)),
    user_repository: UserRepository = Depends(get_user_repository),
    role_repository: RoleRepository = Depends(get_role_repository),
    user_role_repository: UserRoleRepository = Depends(get_user_role_repository),
) -> UserResponse:
    service = _build_service(user_repository, role_repository, user_role_repository)
    entry = await service.update_user_role(user_id=user_id, role_name=payload.role)
    return _to_response(entry)


@router.patch("/{user_id}/active", response_model=UserResponse)
async def set_user_active(
    user_id: str,
    payload: UserActiveUpdateRequest,
    principal: CurrentPrincipal = Depends(require_permission(Permission.USER_MANAGE)),
    user_repository: UserRepository = Depends(get_user_repository),
    role_repository: RoleRepository = Depends(get_role_repository),
    user_role_repository: UserRoleRepository = Depends(get_user_role_repository),
) -> UserResponse:
    service = _build_service(user_repository, role_repository, user_role_repository)
    entry = await service.set_active(
        user_id=user_id,
        is_active=payload.is_active,
        requesting_user_id=principal.user_id,
    )
    return _to_response(entry)
