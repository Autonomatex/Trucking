"""Role catalog application service.

Seeds each tenant's built-in role catalog (owner/admin/operator/viewer) as
concrete `Role` rows at tenant-creation time, so per-user role assignment
(`UserRole`) can foreign-key into a real row instead of special-casing the
RBAC enum. Tenants cannot yet define custom roles beyond this catalog —
that is a later phase.
"""

from __future__ import annotations

from app.core.exceptions import NotFoundError
from app.infrastructure.db.models.user import Role as RoleModel
from app.infrastructure.db.repositories.role_repository import RoleRepository
from app.infrastructure.security.rbac import ROLE_PERMISSIONS


class RoleService:
    def __init__(self, *, role_repository: RoleRepository) -> None:
        self._roles = role_repository

    async def seed_default_roles(self, *, tenant_id: str) -> dict[str, RoleModel]:
        """Create one `Role` row per built-in role for a brand-new tenant."""
        seeded: dict[str, RoleModel] = {}
        for role, permissions in ROLE_PERMISSIONS.items():
            row = await self._roles.add(
                RoleModel(
                    tenant_id=tenant_id,
                    name=role.value,
                    permissions=",".join(sorted(p.value for p in permissions)),
                )
            )
            seeded[role.value] = row
        return seeded

    async def list_roles(self) -> list[RoleModel]:
        return await self._roles.list_all()

    async def get_by_name_or_raise(self, name: str) -> RoleModel:
        role = await self._roles.get_by_name(name)
        if role is None:
            raise NotFoundError("Role not found.", details={"name": name})
        return role
