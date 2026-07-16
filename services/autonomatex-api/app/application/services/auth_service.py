"""
Authentication application service.

Implements the real login use case against the `User` table: verifies the
supplied credentials with `passlib` and issues a signed access/refresh
token pair via `app.infrastructure.security.jwt`. No mocked users or
hard-coded credentials are involved.
"""

from __future__ import annotations

from dataclasses import dataclass

from app.core.config import Settings
from app.core.exceptions import AuthenticationError
from app.infrastructure.db.repositories.user_repository import UserRepository
from app.infrastructure.db.repositories.user_role_repository import UserRoleRepository
from app.infrastructure.security.jwt import create_token, verify_password
from app.infrastructure.security.rbac import Role


@dataclass(frozen=True, slots=True)
class TokenPair:
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class AuthService:
    def __init__(
        self,
        *,
        user_repository: UserRepository,
        user_role_repository: UserRoleRepository,
        settings: Settings,
    ) -> None:
        self._users = user_repository
        self._user_roles = user_role_repository
        self._settings = settings

    async def authenticate(self, *, email: str, password: str) -> TokenPair:
        user = await self._users.get_by_email(email)
        if user is None or not user.is_active or not verify_password(password, user.password_hash):
            raise AuthenticationError("Invalid email or password.")

        roles = await self._user_roles.list_role_names_for_user(user.id)
        if not roles:
            # Safety net: a user somehow left without a role assignment
            # still gets read-only access rather than being locked out.
            roles = [Role.VIEWER.value]

        access_token = create_token(
            settings=self._settings,
            subject=user.id,
            tenant_id=user.tenant_id,
            roles=roles,
            token_type="access",
        )
        refresh_token = create_token(
            settings=self._settings,
            subject=user.id,
            tenant_id=user.tenant_id,
            roles=roles,
            token_type="refresh",
        )
        return TokenPair(access_token=access_token, refresh_token=refresh_token)
