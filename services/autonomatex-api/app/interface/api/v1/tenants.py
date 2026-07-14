"""Tenant provisioning endpoints — the entry point into multi-tenancy.

Both routes are intentionally unauthenticated: creating a tenant is how a
brand-new company signs up (there is no principal yet), and listing tenants
only exposes non-sensitive identifiers (name/slug) so a "choose your
company" screen can resolve which tenant a login belongs to. No tenant-owned
data is reachable from either route — every other resource in the API stays
behind `get_current_principal` and is filtered by `tenant_id`.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.services.tenant_service import TenantService
from app.infrastructure.db.repositories.tenant_repository import TenantRepository
from app.infrastructure.db.session import get_db_session
from app.interface.api.deps import get_tenant_repository
from app.interface.schemas.tenant import TenantCreateRequest, TenantListResponse, TenantResponse

router = APIRouter()


@router.post("", response_model=TenantResponse, status_code=201)
async def create_tenant(
    payload: TenantCreateRequest,
    session: AsyncSession = Depends(get_db_session),
    tenant_repository: TenantRepository = Depends(get_tenant_repository),
) -> TenantResponse:
    """Provision a new tenant plus its first (owner) user in one request."""
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


@router.get("", response_model=TenantListResponse)
async def list_tenants(
    tenant_repository: TenantRepository = Depends(get_tenant_repository),
) -> TenantListResponse:
    tenants = await tenant_repository.list_all()
    return TenantListResponse(
        tenants=[
            TenantResponse(id=t.id, name=t.name, slug=t.slug, is_active=t.is_active) for t in tenants
        ]
    )
