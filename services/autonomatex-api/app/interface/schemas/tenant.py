from __future__ import annotations

from pydantic import BaseModel


class TenantResponse(BaseModel):
    id: str
    name: str
    slug: str
    is_active: bool
