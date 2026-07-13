"""
JWT authentication skeleton.

Provides real (not mocked) token issuance and verification built on
`python-jose`. Password hashing uses `passlib`'s bcrypt scheme. This is the
foundation the Phase 2 auth endpoints build on; the contract here is final,
the surrounding user-management flows (signup, password reset, etc.) are
out of scope for Phase 1.
"""

from __future__ import annotations

from datetime import UTC, datetime, timedelta
from typing import Any, Literal

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import Settings
from app.core.exceptions import AuthenticationError

_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

TokenType = Literal["access", "refresh"]


def hash_password(plain_password: str) -> str:
    return _pwd_context.hash(plain_password)


def verify_password(plain_password: str, password_hash: str) -> bool:
    return _pwd_context.verify(plain_password, password_hash)


def create_token(
    *,
    settings: Settings,
    subject: str,
    tenant_id: str,
    roles: list[str],
    token_type: TokenType = "access",
    extra_claims: dict[str, Any] | None = None,
) -> str:
    """Issue a signed JWT for the given subject (user id)."""
    now = datetime.now(UTC)
    expires_delta = (
        timedelta(minutes=settings.access_token_expire_minutes)
        if token_type == "access"
        else timedelta(minutes=settings.refresh_token_expire_minutes)
    )

    claims: dict[str, Any] = {
        "sub": subject,
        "tenant_id": tenant_id,
        "roles": roles,
        "type": token_type,
        "iat": now,
        "exp": now + expires_delta,
    }
    if extra_claims:
        claims.update(extra_claims)

    return jwt.encode(claims, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decode_token(*, settings: Settings, token: str) -> dict[str, Any]:
    """Validate and decode a JWT, raising `AuthenticationError` on failure."""
    try:
        return jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
    except JWTError as exc:
        raise AuthenticationError("Invalid or expired authentication token.") from exc
