"""
In-process implementation of the `WorkflowEngine` contract.

Persists workflow definitions and instances in memory for Phase 1. This is
a real, working state machine (not a mock) — it correctly enforces step
ordering and terminal states. A future phase can swap in a
database-persisted implementation without changing the interface or any
caller.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime
from threading import Lock

from app.core.exceptions import ConflictError, NotFoundError
from app.domain.workflow_engine.interfaces import (
    WorkflowDefinition,
    WorkflowInstance,
    WorkflowStatus,
)


class InMemoryWorkflowEngine:
    def __init__(self) -> None:
        self._definitions: dict[str, WorkflowDefinition] = {}
        self._instances: dict[str, WorkflowInstance] = {}
        self._lock = Lock()

    def register_workflow(self, definition: WorkflowDefinition) -> None:
        with self._lock:
            key = f"{definition.tenant_id}:{definition.key}"
            if key in self._definitions:
                raise ConflictError(f"Workflow '{definition.key}' is already registered.")
            self._definitions[key] = definition

    def start_instance(
        self, *, tenant_id: str, definition_key: str, context: dict | None = None
    ) -> WorkflowInstance:
        key = f"{tenant_id}:{definition_key}"
        with self._lock:
            if key not in self._definitions:
                raise NotFoundError(f"Workflow '{definition_key}' is not registered.")
            instance = WorkflowInstance(
                id=str(uuid.uuid4()),
                definition_key=definition_key,
                tenant_id=tenant_id,
                status=WorkflowStatus.RUNNING,
                context=context or {},
            )
            self._instances[instance.id] = instance
            return instance

    def advance_instance(self, *, tenant_id: str, instance_id: str) -> WorkflowInstance:
        with self._lock:
            instance = self._require_instance(tenant_id, instance_id)
            definition = self._definitions[f"{tenant_id}:{instance.definition_key}"]

            if instance.status != WorkflowStatus.RUNNING:
                raise ConflictError(f"Workflow instance is {instance.status.value}, cannot advance.")

            instance.current_step_index += 1
            instance.updated_at = datetime.now(UTC)
            if instance.current_step_index >= len(definition.steps):
                instance.status = WorkflowStatus.COMPLETED
            return instance

    def get_instance(self, *, tenant_id: str, instance_id: str) -> WorkflowInstance | None:
        instance = self._instances.get(instance_id)
        if instance is None or instance.tenant_id != tenant_id:
            return None
        return instance

    def _require_instance(self, tenant_id: str, instance_id: str) -> WorkflowInstance:
        instance = self._instances.get(instance_id)
        if instance is None or instance.tenant_id != tenant_id:
            raise NotFoundError("Workflow instance not found.", details={"id": instance_id})
        return instance
