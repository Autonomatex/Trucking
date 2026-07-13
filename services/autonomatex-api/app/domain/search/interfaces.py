"""Search domain contract — indexing and querying operational entities."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Protocol, runtime_checkable


@dataclass(frozen=True, slots=True)
class SearchDocument:
    id: str
    tenant_id: str
    doc_type: str
    title: str
    body: str
    attributes: dict = field(default_factory=dict)


@dataclass(frozen=True, slots=True)
class SearchResult:
    document: SearchDocument
    score: float


@runtime_checkable
class SearchIndex(Protocol):
    def index_document(self, document: SearchDocument) -> None: ...

    def search(self, *, tenant_id: str, query: str, limit: int = 20) -> list[SearchResult]: ...
