"""Tenant provisioning endpoints — the entry point into multi-tenancy.

Both routes are intentionally unauthenticated:

- ``POST /tenants`` — creating a tenant is how a brand-new company signs up
  (there is no principal yet). Rate-limited per IP to prevent scripted bulk
  provisioning. Also checked against the platform blocklist so banned email
  domains and IP ranges cannot re-register under a new slug.

- ``GET /tenants?slug=<slug>`` — resolves a single tenant by slug so that a
  "choose your company" or login screen can look up which tenant a user
  belongs to. A mandatory ``slug`` query parameter is required; the endpoint
  does not return the full tenant list, preventing directory scraping.

No tenant-owned data is reachable from either route — every other resource
in the API stays behind ``get_current_principal`` and is filtered by
``tenant_id``.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.services.blocklist_service import BlockedSignupError, BlocklistService
from app.application.services.tenant_service import TenantService
from app.core.config import Settings, get_settings
from app.core.exceptions import AuthorizationError, NotFoundError
from app.infrastructure.db.repositories.blocklist_repository import BlocklistRepository
from app.infrastructure.db.repositories.tenant_repository import TenantRepository
from app.infrastructure.db.session import get_db_session
from app.infrastructure.rate_limit import make_rate_limiter, resolve_client_ip
from app.interface.api.deps import get_tenant_repository
from app.interface.schemas.tenant import TenantCreateRequest, TenantResponse

router = APIRouter()

# Rate limiter for the public signup endpoint — 5 attempts per IP per hour.
# Fail-open: if Redis is unreachable the request is allowed through.
_signup_rate_limit = make_rate_limiter("tenant_signup")


@router.post(
    "",
    response_model=TenantResponse,
    status_code=201,
    dependencies=[Depends(_signup_rate_limit)],
)
async def create_tenant(
    request: Request,
    payload: TenantCreateRequest,
    session: AsyncSession = Depends(get_db_session),
    tenant_repository: TenantRepository = Depends(get_tenant_repository),
    settings: Settings = Depends(get_settings),
) -> TenantResponse:
    """Provision a new tenant plus its first (owner) user in one request.

    Rate-limited: at most 5 signups per IP per hour.
    Blocklist-checked: rejects registrations from banned email domains or IPs.
    """
    # Resolve the client IP the same way the rate limiter does so the two
    # defences use a consistent IP value.
    client_ip = resolve_client_ip(request, trusted_proxy_count=settings.rate_limit_trusted_proxy_count)

    blocklist_service = BlocklistService(
        blocklist_repository=BlocklistRepository(session)
    )
    try:
        await blocklist_service.check_signup(
            email=payload.owner_email,
            ip=client_ip,
        )
    except BlockedSignupError as exc:
        raise AuthorizationError(exc.message) from exc

    service = TenantService(tenant_repository=tenant_repository, session=session)
    provisioned = await service.create_tenant(
        name=payload.name,
        slug=payload.slug,
        owner_email=payload.owner_email,
        owner_password=payload.owner_password,
        owner_full_name=payload.owner_full_name,
    )
    tenant = provisioned.tenant
    return TenantResponse(id=tenant.id, name=tenant.name, slug=tenant.slug, is_active=tenant.is_active)


@router.get("", response_model=TenantResponse)
async def lookup_tenant_by_slug(
    slug: str = Query(..., min_length=1, max_length=100, description="Exact slug of the tenant to look up."),
    tenant_repository: TenantRepository = Depends(get_tenant_repository),
) -> TenantResponse:
    """Look up a single tenant by its slug.

    Intended for login/signup screens that need to resolve a company slug to
    a tenant record before authenticating a user. A ``slug`` query parameter
    is required — the endpoint does not expose the full tenant list to prevent
    directory enumeration and scraping.

    Returns 404 if no tenant with the given slug exists.
    """
    tenant = await tenant_repository.get_by_slug(slug)
    if tenant is None:
        raise NotFoundError(f"No tenant found with slug '{slug}'.")
    return TenantResponse(id=tenant.id, name=tenant.name, slug=tenant.slug, is_active=tenant.is_active)
