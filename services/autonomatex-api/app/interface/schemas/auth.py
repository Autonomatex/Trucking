from __future__ import annotations

from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class MeResponse(BaseModel):
    """The authenticated principal, resolved from the access token + DB."""

    id: str
    tenant_id: str
    email: str
    full_name: str
    roles: list[str]
    permissions: list[str]
