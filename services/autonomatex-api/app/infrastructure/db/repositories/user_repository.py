"""Concrete repository for the `User` aggregate."""

from __future__ import annotations

from sqlalchemy import select

from app.infrastructure.db.models.user import User
from app.infrastructure.db.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    model = User

    async def get_by_email(self, email: str) -> User | None:
        stmt = select(User).where(User.tenant_id == self.tenant_id, User.email == email)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()
