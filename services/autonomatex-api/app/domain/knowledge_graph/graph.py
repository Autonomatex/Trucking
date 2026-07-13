"""In-process adjacency-list implementation of `KnowledgeGraphStore`."""

from __future__ import annotations

from threading import Lock

from app.domain.knowledge_graph.interfaces import KnowledgeEdge, KnowledgeNode


class InMemoryKnowledgeGraphStore:
    def __init__(self) -> None:
        self._nodes: dict[str, KnowledgeNode] = {}
        self._edges: list[KnowledgeEdge] = []
        self._lock = Lock()

    def upsert_node(self, node: KnowledgeNode) -> KnowledgeNode:
        with self._lock:
            self._nodes[node.id] = node
            return node

    def add_edge(self, edge: KnowledgeEdge) -> KnowledgeEdge:
        with self._lock:
            self._edges.append(edge)
            return edge

    def get_related(
        self, *, tenant_id: str, node_id: str, relation: str | None = None
    ) -> list[KnowledgeNode]:
        related_ids = {
            e.target_id
            for e in self._edges
            if e.tenant_id == tenant_id
            and e.source_id == node_id
            and (relation is None or e.relation == relation)
        }
        return [
            node
            for node_id_, node in self._nodes.items()
            if node_id_ in related_ids and node.tenant_id == tenant_id
        ]
