"""
FastAPI application entry point.

Wires together configuration, logging, exception handlers, CORS, the base
API router, and the process-wide DI container. Run via:

    uvicorn app.main:app --host 0.0.0.0 --port $PORT

which is exactly what the `Autonomatex API` Replit workflow does.
"""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.di import container
from app.core.exceptions import register_exception_handlers
from app.core.logging import configure_logging, get_logger
from app.domain.ai_orchestrator.orchestrator import DefaultAIOrchestrator
from app.domain.knowledge_graph.graph import InMemoryKnowledgeGraphStore
from app.domain.notifications.sender import LoggingNotificationSender
from app.domain.operational_memory.store import InMemoryOperationalMemoryStore
from app.domain.search.index import InMemorySearchIndex
from app.domain.workflow_engine.engine import InMemoryWorkflowEngine
from app.infrastructure.db.session import ensure_schema_exists
from app.interface.api.router import api_router

settings = get_settings()
configure_logging(settings.log_level)
logger = get_logger(__name__)


def _wire_container() -> None:
    """Register singleton domain-module implementations in the DI container.

    Registering the in-process implementations here — rather than in each
    router — is what lets a later phase swap any module's implementation
    (e.g. persisted workflow engine, real AI provider) without touching a
    single call site: everything downstream depends on the interface type,
    resolved from this container.
    """
    container.register("workflow_engine", InMemoryWorkflowEngine())
    container.register("operational_memory_store", InMemoryOperationalMemoryStore())
    container.register("knowledge_graph_store", InMemoryKnowledgeGraphStore())
    container.register("ai_orchestrator", DefaultAIOrchestrator())
    container.register("search_index", InMemorySearchIndex())
    container.register("notification_sender", LoggingNotificationSender())


@asynccontextmanager
async def lifespan(_: FastAPI):
    _wire_container()
    await ensure_schema_exists(settings)
    logger.info("startup_complete", extra={"environment": settings.environment})
    yield
    logger.info("shutdown_complete")


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        version="0.1.0",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_allow_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    register_exception_handlers(app)
    app.include_router(api_router, prefix=settings.api_v1_prefix)

    return app


app = create_app()
