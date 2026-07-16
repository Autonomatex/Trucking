"""Repository for the `Role` aggregate — a tenant's role catalog.

Every tenant gets the built-in role catalog (owner/admin/operator/viewer)
seeded as concrete rows at tenant-creation time (see `RoleService`), so
`UserRole.role_id` always foreign-keys into a real row instead of the RBAC
enum needing a special case for "built-in" vs. "custom" roles.
"""

from __future__ import annotations

from sqlalchemy import select

from app.infrastructure.db.models.user import Role
from app.infrastructure.db.repositories.base import BaseRepository


class RoleRepository(BaseRepository[Role]):
    model = Role

    async def get_by_name(self, name: str) -> Role | None:
        stmt = select(Role).where(Role.tenant_id == self.tenant_id, Role.name == name)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()
