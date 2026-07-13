"""
Generic, multi-tenant-scoped repository base class.

Every concrete repository inherits from `BaseRepository` and every query it
issues is automatically filtered by `tenant_id`. This is the single
enforcement point for tenant isolation at the data-access layer — no
feature-specific repository can accidentally omit the filter because the
base class applies it before any feature code runs.
"""

from __future__ import annotations

from typing import Generic, TypeVar

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.infrastructure.db.models.base import Base

ModelT = TypeVar("ModelT", bound=Base)


class BaseRepository(Generic[ModelT]):
    model: type[ModelT]

    def __init__(self, session: AsyncSession, *, tenant_id: str) -> None:
        self.session = session
        self.tenant_id = tenant_id

    async def get_by_id(self, entity_id: str) -> ModelT | None:
        stmt = select(self.model).where(
            self.model.id == entity_id,
            self.model.tenant_id == self.tenant_id,
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_id_or_raise(self, entity_id: str) -> ModelT:
        entity = await self.get_by_id(entity_id)
        if entity is None:
            raise NotFoundError(
                f"{self.model.__name__} not found.",
                details={"id": entity_id},
            )
        return entity

    async def list_all(self, *, limit: int = 100, offset: int = 0) -> list[ModelT]:
        stmt = (
            select(self.model)
            .where(self.model.tenant_id == self.tenant_id)
            .limit(limit)
            .offset(offset)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def add(self, entity: ModelT) -> ModelT:
        self.session.add(entity)
        await self.session.flush()
        return entity

    async def delete(self, entity: ModelT) -> None:
        await self.session.delete(entity)
        await self.session.flush()
