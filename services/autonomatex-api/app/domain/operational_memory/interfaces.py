"""
Operational Memory domain contract.

Operational Memory captures the "why" behind operational decisions —
context, actions taken, and outcomes — so that knowledge survives staff
turnover instead of leaving with the employee who held it. Phase 1 defines
the contract and a working append-only store; later phases add durable
persistence, summarization, and retrieval ranking.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import UTC, datetime
from typing import Protocol, runtime_checkable


@dataclass(frozen=True, slots=True)
class OperationalEvent:
    id: str
    tenant_id: str
    subject_type: str  # e.g. "truck", "dispatch", "carrier"
    subject_id: str
    actor_user_id: str
    summary: str
    details: dict = field(default_factory=dict)
    occurred_at: datetime = field(default_factory=lambda: datetime.now(UTC))


@runtime_checkable
class OperationalMemoryStore(Protocol):
    def record_event(self, event: OperationalEvent) -> OperationalEvent: ...

    def get_events_for_subject(
        self, *, tenant_id: str, subject_type: str, subject_id: str
    ) -> list[OperationalEvent]: ...
