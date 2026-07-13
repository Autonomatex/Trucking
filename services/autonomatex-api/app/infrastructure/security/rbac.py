"""
Role-Based Access Control (RBAC) skeleton.

Defines the enterprise role/permission model and a `require_permission`
dependency usable on any FastAPI route. Roles are seeded per-tenant so each
tenant can have its own role assignments while sharing the same permission
catalog.
"""

from __future__ import annotations

from enum import StrEnum

from fastapi import Depends

from app.core.exceptions import AuthorizationError
from app.infrastructure.security.principal import CurrentPrincipal, get_current_principal


class Permission(StrEnum):
    """Fine-grained permission catalog. Extend as new modules are built."""

    TENANT_READ = "tenant:read"
    TENANT_MANAGE = "tenant:manage"
    USER_READ = "user:read"
    USER_MANAGE = "user:manage"
    ROLE_MANAGE = "role:manage"
    WORKFLOW_READ = "workflow:read"
    WORKFLOW_MANAGE = "workflow:manage"
    OPERATIONAL_MEMORY_READ = "operational_memory:read"
    OPERATIONAL_MEMORY_WRITE = "operational_memory:write"
    KNOWLEDGE_GRAPH_READ = "knowledge_graph:read"
    KNOWLEDGE_GRAPH_WRITE = "knowledge_graph:write"
    AI_ORCHESTRATOR_INVOKE = "ai_orchestrator:invoke"
    SEARCH_QUERY = "search:query"
    NOTIFICATION_SEND = "notification:send"


class Role(StrEnum):
    """Built-in enterprise roles. Custom roles are stored per-tenant in the DB."""

    OWNER = "owner"
    ADMIN = "admin"
    OPERATOR = "operator"
    VIEWER = "viewer"


# Default permission set granted to each built-in role. Tenant-specific
# custom roles are resolved from the database (see `RoleRepository`) and are
# additive to this map, not a replacement for it.
ROLE_PERMISSIONS: dict[Role, frozenset[Permission]] = {
    Role.OWNER: frozenset(Permission),
    Role.ADMIN: frozenset(
        p for p in Permission if p not in {Permission.TENANT_MANAGE}
    ),
    Role.OPERATOR: frozenset(
        {
            Permission.TENANT_READ,
            Permission.USER_READ,
            Permission.WORKFLOW_READ,
            Permission.WORKFLOW_MANAGE,
            Permission.OPERATIONAL_MEMORY_READ,
            Permission.OPERATIONAL_MEMORY_WRITE,
            Permission.KNOWLEDGE_GRAPH_READ,
            Permission.SEARCH_QUERY,
        }
    ),
    Role.VIEWER: frozenset(
        {
            Permission.TENANT_READ,
            Permission.USER_READ,
            Permission.WORKFLOW_READ,
            Permission.OPERATIONAL_MEMORY_READ,
            Permission.KNOWLEDGE_GRAPH_READ,
            Permission.SEARCH_QUERY,
        }
    ),
}


def permissions_for_roles(role_names: list[str]) -> frozenset[Permission]:
    """Resolve the union of permissions granted by a principal's role names."""
    granted: set[Permission] = set()
    for name in role_names:
        try:
            role = Role(name)
        except ValueError:
            continue  # Unknown/custom role names are resolved via the DB in later phases.
        granted |= ROLE_PERMISSIONS[role]
    return frozenset(granted)


def require_permission(permission: Permission):
    """FastAPI dependency factory enforcing a single permission on a route."""

    def _check(principal: CurrentPrincipal = Depends(get_current_principal)) -> CurrentPrincipal:
        if permission not in permissions_for_roles(principal.roles):
            raise AuthorizationError(
                f"Missing required permission: {permission.value}",
                details={"required_permission": permission.value},
            )
        return principal

    return _check
