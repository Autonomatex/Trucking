"""
Tenant provisioning application service.

Creating a tenant is the one operation in this codebase that legitimately
spans tenant boundaries: it has to insert the `Tenant` row itself *and* the
first (owner) `User` row scoped to that brand-new tenant, in the same
transaction, before any tenant-scoped repository can be used against it.
"""

from __future__ import annotations

from dataclasses import dataclass

from app.application.services.role_service import RoleService
from app.core.exceptions import ConflictError
from app.infrastructure.db.models.tenant import Tenant
from app.infrastructure.db.models.user import User
from app.infrastructure.db.repositories.role_repository import RoleRepository
from app.infrastructure.db.repositories.tenant_repository import TenantRepository
from app.infrastructure.db.repositories.user_repository import UserRepository
from app.infrastructure.db.repositories.user_role_repository import UserRoleRepository
from app.infrastructure.security.jwt import hash_password
from app.infrastructure.security.rbac import Role


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

        # The role catalog and owner user are both scoped to the tenant we
        # just created, so tenant-scoped repositories can be built directly
        # from its id — the same repositories every other feature uses,
        # there is no special-cased "unscoped" write path here.
        role_service = RoleService(role_repository=RoleRepository(self._session, tenant_id=tenant.id))
        seeded_roles = await role_service.seed_default_roles(tenant_id=tenant.id)

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

        user_role_repository = UserRoleRepository(self._session, tenant_id=tenant.id)
        await user_role_repository.replace_role_for_user(
            user_id=owner.id, role_id=seeded_roles[Role.OWNER.value].id
        )

        return ProvisionedTenant(tenant=tenant, owner=owner)

    async def list_tenants(self, *, limit: int = 100, offset: int = 0) -> list[Tenant]:
        return await self._tenants.list_all(limit=limit, offset=offset)
