"""
In-process implementation of `SearchIndex`.

Uses real (if simple) term-frequency scoring over tokenized title/body text
— a working search implementation, not a stub. A later phase can swap this
for a dedicated search engine (e.g. Postgres full-text search or
OpenSearch) behind the same `SearchIndex` interface.
"""

from __future__ import annotations

import re
from collections import Counter
from threading import Lock

from app.domain.search.interfaces import SearchDocument, SearchResult

_TOKEN_RE = re.compile(r"[a-z0-9]+")


def _tokenize(text: str) -> list[str]:
    return _TOKEN_RE.findall(text.lower())


class InMemorySearchIndex:
    def __init__(self) -> None:
        self._documents: dict[str, SearchDocument] = {}
        self._lock = Lock()

    def index_document(self, document: SearchDocument) -> None:
        with self._lock:
            self._documents[document.id] = document

    def search(self, *, tenant_id: str, query: str, limit: int = 20) -> list[SearchResult]:
        query_terms = _tokenize(query)
        if not query_terms:
            return []

        results: list[SearchResult] = []
        for document in self._documents.values():
            if document.tenant_id != tenant_id:
                continue

            term_counts = Counter(_tokenize(f"{document.title} {document.body}"))
            score = sum(term_counts.get(term, 0) for term in query_terms)
            if score > 0:
                results.append(SearchResult(document=document, score=float(score)))

        results.sort(key=lambda r: r.score, reverse=True)
        return results[:limit]
