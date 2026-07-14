"""
Tenant provisioning application service.

Creating a tenant is the one operation in this codebase that legitimately
spans tenant boundaries: it has to insert the `Tenant` row itself *and* the
first (owner) `User` row scoped to that brand-new tenant, in the same
transaction, before any tenant-scoped repository can be used against it.
"""

from __future__ import annotations

from dataclasses import dataclass

from app.core.exceptions import ConflictError
from app.infrastructure.db.models.tenant import Tenant
from app.infrastructure.db.models.user import User
from app.infrastructure.db.repositories.tenant_repository import TenantRepository
from app.infrastructure.db.repositories.user_repository import UserRepository
from app.infrastructure.security.jwt import hash_password


@dataclass(frozen=True, slots=True)
class ProvisionedTenant:
    tenant: Tenant
    owner: User


class TenantService:
    def __init__(self, *, tenant_repository: TenantRepository, session) -> None:  # AsyncSession
        self._tenants = tenant_repository
        self._session = session

    async def create_tenant(
        self,
        *,
        name: str,
        slug: str,
        owner_email: str,
        owner_password: str,
        owner_full_name: str,
    ) -> ProvisionedTenant:
        if await self._tenants.get_by_slug(slug) is not None:
            raise ConflictError(
                "A tenant with this slug already exists.",
                details={"slug": slug},
            )

        tenant = await self._tenants.add(Tenant(name=name, slug=slug, is_active=True))

        # The owner user is scoped to the tenant we just created, so a
        # tenant-scoped `UserRepository` can be built directly from its id —
        # this is the same repository every other feature uses, there is no
        # special-cased "unscoped" write path for user creation.
        user_repository = UserRepository(self._session, tenant_id=tenant.id)
        owner = await user_repository.add(
            User(
                tenant_id=tenant.id,
                email=owner_email,
                full_name=owner_full_name,
                password_hash=hash_password(owner_password),
                is_active=True,
            )
        )

        return ProvisionedTenant(tenant=tenant, owner=owner)

    async def list_tenants(self, *, limit: int = 100, offset: int = 0) -> list[Tenant]:
        return await self._tenants.list_all(limit=limit, offset=offset)
