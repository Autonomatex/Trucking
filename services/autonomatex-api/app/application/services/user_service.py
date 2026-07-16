"""Staff user management application service — admin-facing CRUD + role assignment."""

from __future__ import annotations

from dataclasses import dataclass

from app.core.exceptions import ConflictError
from app.infrastructure.db.models.user import User
from app.infrastructure.db.repositories.role_repository import RoleRepository
from app.infrastructure.db.repositories.user_repository import UserRepository
from app.infrastructure.db.repositories.user_role_repository import UserRoleRepository
from app.infrastructure.security.jwt import hash_password
from app.application.services.role_service import RoleService


@dataclass(frozen=True, slots=True)
class UserWithRoles:
    user: User
    roles: list[str]


class UserService:
    def __init__(
        self,
        *,
        user_repository: UserRepository,
        role_repository: RoleRepository,
        user_role_repository: UserRoleRepository,
    ) -> None:
        self._users = user_repository
        self._roles = RoleService(role_repository=role_repository)
        self._user_roles = user_role_repository

    async def create_user(
        self, *, email: str, password: str, full_name: str, role_name: str
    ) -> UserWithRoles:
        if await self._users.get_by_email(email) is not None:
            raise ConflictError(
                "A user with this email already exists.", details={"email": email}
            )

        role = await self._roles.get_by_name_or_raise(role_name)

        user = await self._users.add(
            User(
                tenant_id=self._users.tenant_id,
                email=email,
                full_name=full_name,
                password_hash=hash_password(password),
                is_active=True,
            )
        )
        await self._user_roles.replace_role_for_user(user_id=user.id, role_id=role.id)
        return UserWithRoles(user=user, roles=[role.name])

    async def list_users(self) -> list[UserWithRoles]:
        users = await self._users.list_all()
        roles_by_user = await self._user_roles.list_role_names_for_users([u.id for u in users])
        return [UserWithRoles(user=u, roles=roles_by_user.get(u.id, [])) for u in users]

    async def update_user_role(self, *, user_id: str, role_name: str) -> UserWithRoles:
        user = await self._users.get_by_id_or_raise(user_id)
        role = await self._roles.get_by_name_or_raise(role_name)
        await self._user_roles.replace_role_for_user(user_id=user.id, role_id=role.id)
        return UserWithRoles(user=user, roles=[role.name])

    async def set_active(self, *, user_id: str, is_active: bool) -> UserWithRoles:
        user = await self._users.get_by_id_or_raise(user_id)
        user.is_active = is_active
        await self._users.session.flush()
        role_names = await self._user_roles.list_role_names_for_users([user.id])
        return UserWithRoles(user=user, roles=role_names.get(user.id, []))
