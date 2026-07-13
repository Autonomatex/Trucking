"""
Request principal resolution.

Extracts and validates the bearer JWT on every authenticated request,
producing a `CurrentPrincipal` that carries the tenant id — the anchor for
all multi-tenant scoping performed by the base repository layer.
"""

from __future__ import annotations

from dataclasses import dataclass

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import Settings, get_settings
from app.core.exceptions import AuthenticationError
from app.infrastructure.security.jwt import decode_token

_bearer_scheme = HTTPBearer(auto_error=False)


@dataclass(frozen=True, slots=True)
class CurrentPrincipal:
    user_id: str
    tenant_id: str
    roles: list[str]


def get_current_principal(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer_scheme),
    settings: Settings = Depends(get_settings),
) -> CurrentPrincipal:
    if credentials is None:
        raise AuthenticationError("Missing bearer authentication token.")

    claims = decode_token(settings=settings, token=credentials.credentials)
    if claims.get("type") != "access":
        raise AuthenticationError("A valid access token is required.")

    return CurrentPrincipal(
        user_id=claims["sub"],
        tenant_id=claims["tenant_id"],
        roles=claims.get("roles", []),
    )
