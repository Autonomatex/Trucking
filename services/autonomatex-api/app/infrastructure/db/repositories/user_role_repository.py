"""Repository for the `UserRole` join table (per-user role assignment)."""

from __future__ import annotations

from sqlalchemy import delete, select

from app.infrastructure.db.models.user import Role, UserRole
from app.infrastructure.db.repositories.base import BaseRepository


class UserRoleRepository(BaseRepository[UserRole]):
    model = UserRole

    async def list_role_names_for_user(self, user_id: str) -> list[str]:
        stmt = (
            select(Role.name)
            .join(UserRole, UserRole.role_id == Role.id)
            .where(UserRole.tenant_id == self.tenant_id, UserRole.user_id == user_id)
        )
        result = await self.session.execute(stmt)
        return [row[0] for row in result.all()]

    async def list_role_names_for_users(self, user_ids: list[str]) -> dict[str, list[str]]:
        """Batch-resolve role names for several users in a single query."""
        roles_by_user: dict[str, list[str]] = {user_id: [] for user_id in user_ids}
        if not user_ids:
            return roles_by_user

        stmt = (
            select(UserRole.user_id, Role.name)
            .join(Role, UserRole.role_id == Role.id)
            .where(UserRole.tenant_id == self.tenant_id, UserRole.user_id.in_(user_ids))
        )
        result = await self.session.execute(stmt)
        for user_id, role_name in result.all():
            roles_by_user.setdefault(user_id, []).append(role_name)
        return roles_by_user

    async def replace_role_for_user(self, *, user_id: str, role_id: str) -> UserRole:
        """Set a user's single role assignment, replacing any existing ones.

        The admin UI only ever assigns one role per user at a time; the
        underlying join table remains many-to-many so a later phase can
        support stacking roles without a schema change.
        """
        await self.session.execute(
            delete(UserRole).where(
                UserRole.tenant_id == self.tenant_id, UserRole.user_id == user_id
            )
        )
        return await self.add(UserRole(tenant_id=self.tenant_id, user_id=user_id, role_id=role_id))
