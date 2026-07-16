"""Platform-level admin endpoints — blocklist management.

These routes are authenticated and require the ``TENANT_MANAGE`` permission,
which is exclusive to the ``owner`` role.  In the current single-level auth
model this is the closest approximation to a platform super-admin: only
owners of any tenant can add, view, or delete blocklist entries.

Routes
------
GET  /admin/blocklist         — list all blocklist entries
POST /admin/blocklist         — add a new entry
DELETE /admin/blocklist/{id}  — remove an entry by id
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, Path
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.services.blocklist_service import BlocklistService
from app.infrastructure.db.repositories.blocklist_repository import BlocklistRepository
from app.infrastructure.db.session import get_db_session
from app.infrastructure.security.principal import CurrentPrincipal
from app.infrastructure.security.rbac import Permission, require_permission
from app.interface.schemas.blocklist import (
    BlocklistEntryCreateRequest,
    BlocklistEntryResponse,
    BlocklistListResponse,
)

router = APIRouter()


def _get_blocklist_service(session: AsyncSession = Depends(get_db_session)) -> BlocklistService:
    return BlocklistService(blocklist_repository=BlocklistRepository(session))


def _to_response(entry) -> BlocklistEntryResponse:
    return BlocklistEntryResponse(
        id=entry.id,
        kind=entry.kind,
        value=entry.value,
        note=entry.note,
        created_at=entry.created_at,
    )


@router.get("/blocklist", response_model=BlocklistListResponse)
async def list_blocklist(
    _: CurrentPrincipal = Depends(require_permission(Permission.TENANT_MANAGE)),
    service: BlocklistService = Depends(_get_blocklist_service),
) -> BlocklistListResponse:
    """Return all active blocklist entries.

    Requires the ``tenant:manage`` permission (owner role only).
    """
    entries = await service.list_entries()
    return BlocklistListResponse(entries=[_to_response(e) for e in entries])


@router.post("/blocklist", response_model=BlocklistEntryResponse, status_code=201)
async def create_blocklist_entry(
    payload: BlocklistEntryCreateRequest,
    _: CurrentPrincipal = Depends(require_permission(Permission.TENANT_MANAGE)),
    service: BlocklistService = Depends(_get_blocklist_service),
) -> BlocklistEntryResponse:
    """Add a new email domain or IP/CIDR to the blocklist.

    Requires the ``tenant:manage`` permission (owner role only).
    """
    entry = await service.add_entry(kind=payload.kind, value=payload.value, note=payload.note)
    return _to_response(entry)


@router.delete("/blocklist/{entry_id}", status_code=204)
async def delete_blocklist_entry(
    entry_id: str = Path(..., description="UUID of the blocklist entry to remove."),
    _: CurrentPrincipal = Depends(require_permission(Permission.TENANT_MANAGE)),
    service: BlocklistService = Depends(_get_blocklist_service),
) -> None:
    """Remove a blocklist entry by id.

    Requires the ``tenant:manage`` permission (owner role only).
    Returns 404 if the entry does not exist.
    """
    await service.delete_entry(entry_id)
