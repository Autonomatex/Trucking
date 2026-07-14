from __future__ import annotations

from pydantic import BaseModel, EmailStr, Field


class TenantResponse(BaseModel):
    id: str
    name: str
    slug: str
    is_active: bool


class TenantCreateRequest(BaseModel):
    """Provisions a brand-new tenant along with its first (owner) user."""

    name: str = Field(min_length=1, max_length=255)
    slug: str = Field(min_length=1, max_length=100, pattern=r"^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$")
    owner_email: EmailStr
    owner_password: str = Field(min_length=8, max_length=128)
    owner_full_name: str = Field(min_length=1, max_length=255)


class TenantListResponse(BaseModel):
    tenants: list[TenantResponse]
