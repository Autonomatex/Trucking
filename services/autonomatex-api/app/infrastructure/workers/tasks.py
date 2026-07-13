"""
Baseline Celery tasks.

`healthcheck_task` is a real, executable task (not a placeholder) used both
to verify the worker end-to-end during setup and as a smoke test any later
phase can reuse in CI. Domain-specific tasks (workflow engine steps,
knowledge graph indexing jobs, notification delivery) are added by later
phases alongside their owning module.
"""

from __future__ import annotations

from datetime import UTC, datetime

from app.infrastructure.workers.celery_app import celery_app


@celery_app.task(name="autonomatex.healthcheck")
def healthcheck_task() -> dict[str, str]:
    """Round-trips through the broker/backend to prove the worker is alive."""
    return {"status": "ok", "checked_at": datetime.now(UTC).isoformat()}
