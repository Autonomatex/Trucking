"""Repository for the platform-level signup blocklist.

Like `TenantRepository`, this is deliberately not tenant-scoped — blocklist
entries are platform-wide controls, not per-tenant resources.
"""

from __future__ import annotations

import ipaddress

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.db.models.blocklist import BlocklistEntry


class BlocklistRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    # ------------------------------------------------------------------
    # Writes
    # ------------------------------------------------------------------

    async def add(self, entry: BlocklistEntry) -> BlocklistEntry:
        self.session.add(entry)
        await self.session.flush()
        return entry

    async def delete(self, entry_id: str) -> bool:
        """Delete an entry by id. Returns True if the entry existed."""
        stmt = select(BlocklistEntry).where(BlocklistEntry.id == entry_id)
        result = await self.session.execute(stmt)
        entry = result.scalar_one_or_none()
        if entry is None:
            return False
        await self.session.delete(entry)
        await self.session.flush()
        return True

    # ------------------------------------------------------------------
    # Reads
    # ------------------------------------------------------------------

    async def get_by_id(self, entry_id: str) -> BlocklistEntry | None:
        stmt = select(BlocklistEntry).where(BlocklistEntry.id == entry_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_all(self, *, limit: int = 500, offset: int = 0) -> list[BlocklistEntry]:
        stmt = (
            select(BlocklistEntry)
            .order_by(BlocklistEntry.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    # ------------------------------------------------------------------
    # Match check
    # ------------------------------------------------------------------

    async def is_email_domain_blocked(self, email: str) -> bool:
        """Return True if the domain part of *email* matches a blocklist entry."""
        domain = email.split("@", 1)[-1].lower().strip()
        stmt = select(BlocklistEntry).where(
            BlocklistEntry.kind == "email_domain",
        )
        result = await self.session.execute(stmt)
        for entry in result.scalars().all():
            if entry.value.lower().strip() == domain:
                return True
        return False

    async def is_ip_blocked(self, ip: str) -> bool:
        """Return True if *ip* falls within any blocklisted CIDR (or equals an exact IP)."""
        try:
            client_addr = ipaddress.ip_address(ip)
        except ValueError:
            return False

        stmt = select(BlocklistEntry).where(BlocklistEntry.kind == "ip_cidr")
        result = await self.session.execute(stmt)
        for entry in result.scalars().all():
            try:
                network = ipaddress.ip_network(entry.value, strict=False)
                if client_addr in network:
                    return True
            except ValueError:
                continue
        return False
