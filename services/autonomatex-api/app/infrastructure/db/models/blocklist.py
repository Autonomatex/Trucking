"""BlocklistEntry model — platform-level signup blocklist.

Stores email domains and IP CIDR ranges that are permanently banned from
re-registering.  This is intentionally *not* tenant-scoped: the blocklist
is a platform-wide control applied before any tenant exists for the incoming
request.
"""

from __future__ import annotations

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.infrastructure.db.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class BlocklistEntry(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "blocklist_entries"

    # "email_domain" or "ip_cidr"
    kind: Mapped[str] = mapped_column(String(20), nullable=False, index=True)

    # e.g. "evil.com" or "203.0.113.0/24" or "203.0.113.5"
    value: Mapped[str] = mapped_column(String(255), nullable=False, index=True)

    # Human-readable reason / note for audit trail
    note: Mapped[str] = mapped_column(Text, nullable=False, default="")
