"""
Structured logging configuration.

Emits JSON-formatted log records so logs remain machine-parseable in every
environment (local development and production alike), with request-scoped
context (request id, tenant id) attached via `contextvars`.
"""

from __future__ import annotations

import json
import logging
import sys
from contextvars import ContextVar
from datetime import UTC, datetime
from typing import Any

request_id_ctx: ContextVar[str | None] = ContextVar("request_id", default=None)
tenant_id_ctx: ContextVar[str | None] = ContextVar("tenant_id", default=None)


class JsonFormatter(logging.Formatter):
    """Renders each `LogRecord` as a single JSON line."""

    def format(self, record: logging.LogRecord) -> str:
        payload: dict[str, Any] = {
            "timestamp": datetime.now(UTC).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }

        request_id = request_id_ctx.get()
        if request_id:
            payload["request_id"] = request_id

        tenant_id = tenant_id_ctx.get()
        if tenant_id:
            payload["tenant_id"] = tenant_id

        if record.exc_info:
            payload["exception"] = self.formatException(record.exc_info)

        for key, value in record.__dict__.items():
            if key in payload or key in logging.LogRecord.__dict__:
                continue
            if key.startswith("_"):
                continue
            payload[key] = value

        return json.dumps(payload, default=str)


def configure_logging(log_level: str = "INFO") -> None:
    """Install the JSON formatter on the root logger exactly once."""
    root = logging.getLogger()
    if getattr(root, "_autonomatex_configured", False):
        return

    handler = logging.StreamHandler(stream=sys.stdout)
    handler.setFormatter(JsonFormatter())

    root.handlers.clear()
    root.addHandler(handler)
    root.setLevel(log_level.upper())

    # Quiet noisy third-party loggers without losing warnings/errors.
    for noisy in ("uvicorn.access", "sqlalchemy.engine"):
        logging.getLogger(noisy).setLevel(logging.WARNING)

    root._autonomatex_configured = True  # type: ignore[attr-defined]


def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)
