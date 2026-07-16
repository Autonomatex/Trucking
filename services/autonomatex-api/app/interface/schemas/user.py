from __future__ import annotations

from pydantic import BaseModel, EmailStr, Field


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    is_active: bool
    roles: list[str]


class UserListResponse(BaseModel):
    users: list[UserResponse]


class UserCreateRequest(BaseModel):
    """Admin-facing staff creation — a specific role is required up front."""

    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    full_name: str = Field(min_length=1, max_length=255)
    role: str = Field(min_length=1, max_length=100)


class UserRoleUpdateRequest(BaseModel):
    role: str = Field(min_length=1, max_length=100)


class UserActiveUpdateRequest(BaseModel):
    is_active: bool


class RoleResponse(BaseModel):
    name: str
    permissions: list[str]


class RoleListResponse(BaseModel):
    roles: list[RoleResponse]
