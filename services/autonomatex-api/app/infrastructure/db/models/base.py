"""
Declarative base and shared mixins for all ORM models.

`TenantScopedMixin` is applied to every domain table so multi-tenancy is
structural, not something each new feature has to remember to add. Every
model lives in the platform's dedicated Postgres schema (see
`app.core.config.Settings.db_schema`), never in `public`.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import DateTime, MetaData, String
from sqlalchemy.orm import DeclarativeBase, Mapped, declared_attr, mapped_column

from app.core.config import get_settings

_settings = get_settings()

metadata = MetaData(schema=_settings.db_schema)


class Base(DeclarativeBase):
    metadata = metadata


class UUIDPrimaryKeyMixin:
    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
        nullable=False,
    )


class TenantScopedMixin:
    """Every tenant-owned table carries a `tenant_id` foreign key column.

    Base repositories filter every query by this column, so a bug in one
    feature's query logic cannot leak another tenant's data.
    """

    @declared_attr
    def tenant_id(cls) -> Mapped[str]:  # noqa: N805
        return mapped_column(
            String(36),
            nullable=False,
            index=True,
        )
