"""
Knowledge Graph domain contract.

Models entities (trucks, carriers, dispatchers, customers, ...) and typed
relationships between them so operational intelligence compounds over
time instead of living only in individual employees' heads.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol, runtime_checkable


@dataclass(frozen=True, slots=True)
class KnowledgeNode:
    id: str
    tenant_id: str
    node_type: str
    label: str
    attributes: dict


@dataclass(frozen=True, slots=True)
class KnowledgeEdge:
    tenant_id: str
    source_id: str
    target_id: str
    relation: str


@runtime_checkable
class KnowledgeGraphStore(Protocol):
    def upsert_node(self, node: KnowledgeNode) -> KnowledgeNode: ...

    def add_edge(self, edge: KnowledgeEdge) -> KnowledgeEdge: ...

    def get_related(
        self, *, tenant_id: str, node_id: str, relation: str | None = None
    ) -> list[KnowledgeNode]: ...
