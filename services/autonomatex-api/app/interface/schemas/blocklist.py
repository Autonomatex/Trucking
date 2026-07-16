"""Pydantic schemas for blocklist management endpoints."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field, field_validator

VALID_KINDS = {"email_domain", "ip_cidr"}


class BlocklistEntryCreateRequest(BaseModel):
    """Request body for adding a blocklist entry."""

    kind: str = Field(
        description="Type of entry: 'email_domain' to block a domain, 'ip_cidr' to block an IP or CIDR range.",
        examples=["email_domain", "ip_cidr"],
    )
    value: str = Field(
        min_length=1,
        max_length=255,
        description="The domain (e.g. 'evil.com') or CIDR (e.g. '203.0.113.0/24' or '203.0.113.5').",
        examples=["evil.com", "203.0.113.0/24"],
    )
    note: str = Field(
        default="",
        max_length=1000,
        description="Optional human-readable reason for this entry.",
    )

    @field_validator("kind")
    @classmethod
    def _validate_kind(cls, v: str) -> str:
        if v not in VALID_KINDS:
            raise ValueError(f"kind must be one of {sorted(VALID_KINDS)}.")
        return v

    @field_validator("value")
    @classmethod
    def _strip_value(cls, v: str) -> str:
        return v.strip()


class BlocklistEntryResponse(BaseModel):
    """Serialised blocklist entry returned from admin endpoints."""

    id: str
    kind: str
    value: str
    note: str
    created_at: datetime


class BlocklistListResponse(BaseModel):
    entries: list[BlocklistEntryResponse]
