"""
Base application service.

Application services orchestrate one or more repositories/domain
interfaces to fulfill a use case, and are the only layer allowed to open a
database transaction boundary. Every concrete service receives its
tenant-scoped session via the constructor rather than reaching into global
state, which keeps use cases trivially testable.
"""

from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession


class BaseService:
    def __init__(self, *, session: AsyncSession, tenant_id: str) -> None:
        self.session = session
        self.tenant_id = tenant_id
