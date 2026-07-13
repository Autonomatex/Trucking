"""In-process, append-only implementation of `OperationalMemoryStore`."""

from __future__ import annotations

from threading import Lock

from app.domain.operational_memory.interfaces import OperationalEvent


class InMemoryOperationalMemoryStore:
    def __init__(self) -> None:
        self._events: list[OperationalEvent] = []
        self._lock = Lock()

    def record_event(self, event: OperationalEvent) -> OperationalEvent:
        with self._lock:
            self._events.append(event)
            return event

    def get_events_for_subject(
        self, *, tenant_id: str, subject_type: str, subject_id: str
    ) -> list[OperationalEvent]:
        return [
            e
            for e in self._events
            if e.tenant_id == tenant_id
            and e.subject_type == subject_type
            and e.subject_id == subject_id
        ]
