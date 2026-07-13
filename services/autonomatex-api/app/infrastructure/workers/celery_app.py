"""
Celery application factory.

Runs as its own native Replit workflow (`Autonomatex Celery Worker`), fully
decoupled from the FastAPI process. Broker and result backend both point at
the Redis instance run by the `Autonomatex Redis` workflow.
"""

from __future__ import annotations

from celery import Celery

from app.core.config import get_settings

settings = get_settings()

celery_app = Celery(
    "autonomatex",
    broker=settings.celery_broker,
    backend=settings.celery_backend,
    include=["app.infrastructure.workers.tasks"],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    worker_send_task_events=True,
)
