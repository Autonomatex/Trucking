"""
Workflow Engine domain contract.

Later phases extend this into a full durable, persisted workflow engine
(e.g. onboarding a new truck, dispatcher handoff). Phase 1 defines the
contract and a working in-process implementation so the API layer, tests,
and later phases can all depend on the `WorkflowEngine` protocol rather
than a concrete engine.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import UTC, datetime
from enum import StrEnum
from typing import Protocol, runtime_checkable


class WorkflowStatus(StrEnum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


@dataclass(frozen=True, slots=True)
class WorkflowStep:
    name: str
    order: int


@dataclass(frozen=True, slots=True)
class WorkflowDefinition:
    key: str
    tenant_id: str
    steps: tuple[WorkflowStep, ...]


@dataclass(slots=True)
class WorkflowInstance:
    id: str
    definition_key: str
    tenant_id: str
    status: WorkflowStatus
    current_step_index: int = 0
    context: dict = field(default_factory=dict)
    created_at: datetime = field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = field(default_factory=lambda: datetime.now(UTC))


@runtime_checkable
class WorkflowEngine(Protocol):
    def register_workflow(self, definition: WorkflowDefinition) -> None: ...

    def start_instance(
        self, *, tenant_id: str, definition_key: str, context: dict | None = None
    ) -> WorkflowInstance: ...

    def advance_instance(self, *, tenant_id: str, instance_id: str) -> WorkflowInstance: ...

    def get_instance(self, *, tenant_id: str, instance_id: str) -> WorkflowInstance | None: ...
