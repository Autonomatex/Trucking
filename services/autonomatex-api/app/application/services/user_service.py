"""Staff user management application service — admin-facing CRUD + role assignment."""

from __future__ import annotations

from dataclasses import dataclass

from app.core.exceptions import ConflictError
from app.core.logging import get_logger
from app.domain.notifications.interfaces import Notification, NotificationSender
from app.infrastructure.db.models.user import User
from app.infrastructure.db.repositories.role_repository import RoleRepository
from app.infrastructure.db.repositories.user_repository import UserRepository
from app.infrastructure.db.repositories.user_role_repository import UserRoleRepository
from app.infrastructure.security.jwt import hash_password
from app.application.services.role_service import RoleService

logger = get_logger(__name__)


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
        notification_sender: NotificationSender | None = None,
    ) -> None:
        self._users = user_repository
        self._roles = RoleService(role_repository=role_repository)
        self._user_roles = user_role_repository
        self._notifications = notification_sender

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
        result = UserWithRoles(user=user, roles=[role.name])

        await self._send_welcome_notification(result)
        return result

    async def _send_welcome_notification(self, entry: UserWithRoles) -> None:
        """Fire a welcome notification to the newly invited user.

        Failures are caught and logged so the invite flow is never blocked by a
        notification error.
        """
        if self._notifications is None:
            return
        user = entry.user
        notification = Notification(
            tenant_id=user.tenant_id,
            recipient_user_id=user.id,
            channel="email",
            subject="Welcome to Autonomatex — your account is ready",
            body=(
                f"Hi {user.full_name},\n\n"
                "An account has been created for you on Autonomatex.\n\n"
                f"Email: {user.email}\n\n"
                "Sign in and change your password on first login. "
                "If you have any questions, reach out to your team owner.\n\n"
                "— The Autonomatex team"
            ),
            metadata={"roles": entry.roles},
        )
        try:
            await self._notifications.send(notification)
        except Exception:
            logger.exception(
                "welcome_notification_failed",
                extra={"recipient_user_id": user.id, "tenant_id": user.tenant_id},
            )

    async def list_users(self) -> list[UserWithRoles]:
        users = await self._users.list_all()
        roles_by_user = await self._user_roles.list_role_names_for_users([u.id for u in users])
        return [UserWithRoles(user=u, roles=roles_by_user.get(u.id, [])) for u in users]

    async def update_user_role(self, *, user_id: str, role_name: str) -> UserWithRoles:
        user = await self._users.get_by_id_or_raise(user_id)
        role = await self._roles.get_by_name_or_raise(role_name)
        await self._user_roles.replace_role_for_user(user_id=user.id, role_id=role.id)
        return UserWithRoles(user=user, roles=[role.name])

    async def set_active(
        self, *, user_id: str, is_active: bool, requesting_user_id: str
    ) -> UserWithRoles:
        if not is_active and user_id == requesting_user_id:
            raise ConflictError(
                "You cannot disable your own account.",
                details={"user_id": user_id},
            )
        user = await self._users.get_by_id_or_raise(user_id)
        user.is_active = is_active
        await self._users.session.flush()
        role_names = await self._user_roles.list_role_names_for_users([user.id])
        return UserWithRoles(user=user, roles=role_names.get(user.id, []))
