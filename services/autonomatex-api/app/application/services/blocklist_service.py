"""Blocklist application service.

Provides the two operations consumers care about:

1. ``check_signup`` — called during ``POST /tenants`` to reject banned
   email domains or IP addresses before a tenant row is created.
2. CRUD helpers for the admin management endpoints.
"""

from __future__ import annotations

from app.core.exceptions import ConflictError, NotFoundError
from app.infrastructure.db.models.blocklist import BlocklistEntry
from app.infrastructure.db.repositories.blocklist_repository import BlocklistRepository

VALID_KINDS = {"email_domain", "ip_cidr"}


class BlocklistService:
    def __init__(self, *, blocklist_repository: BlocklistRepository) -> None:
        self._repo = blocklist_repository

    # ------------------------------------------------------------------
    # Signup guard
    # ------------------------------------------------------------------

    async def check_signup(self, *, email: str, ip: str) -> None:
        """Raise ``BlockedSignupError`` if *email* or *ip* is on the blocklist.

        Called before any tenant or user row is written so nothing is
        persisted when the check fails.
        """
        if await self._repo.is_email_domain_blocked(email):
            raise BlockedSignupError("This email domain is not permitted to register.")
        if await self._repo.is_ip_blocked(ip):
            raise BlockedSignupError("This IP address is not permitted to register.")

    # ------------------------------------------------------------------
    # Admin CRUD
    # ------------------------------------------------------------------

    async def add_entry(self, *, kind: str, value: str, note: str = "") -> BlocklistEntry:
        if kind not in VALID_KINDS:
            raise ValueError(f"kind must be one of {sorted(VALID_KINDS)}, got {kind!r}.")
        return await self._repo.add(BlocklistEntry(kind=kind, value=value, note=note))

    async def list_entries(self, *, limit: int = 500, offset: int = 0) -> list[BlocklistEntry]:
        return await self._repo.list_all(limit=limit, offset=offset)

    async def delete_entry(self, entry_id: str) -> None:
        deleted = await self._repo.delete(entry_id)
        if not deleted:
            raise NotFoundError(f"No blocklist entry with id '{entry_id}'.")


class BlockedSignupError(Exception):
    """Raised when a signup attempt matches the platform blocklist."""

    def __init__(self, message: str) -> None:
        self.message = message
        super().__init__(message)
