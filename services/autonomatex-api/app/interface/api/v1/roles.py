"""Role catalog endpoint — lets the admin UI populate a role picker."""

from __future__ import annotations

from fastapi import APIRouter, Depends

from app.infrastructure.db.repositories.role_repository import RoleRepository
from app.infrastructure.security.principal import CurrentPrincipal
from app.infrastructure.security.rbac import Permission, require_permission
from app.interface.api.deps import get_role_repository
from app.interface.schemas.user import RoleListResponse, RoleResponse

router = APIRouter()


@router.get("", response_model=RoleListResponse)
async def list_roles(
    _: CurrentPrincipal = Depends(require_permission(Permission.USER_READ)),
    role_repository: RoleRepository = Depends(get_role_repository),
) -> RoleListResponse:
    roles = await role_repository.list_all()
    return RoleListResponse(
        roles=[
            RoleResponse(
                name=role.name,
                permissions=[p for p in role.permissions.split(",") if p],
            )
            for role in roles
        ]
    )
