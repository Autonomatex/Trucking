"""
Centralized exception hierarchy and FastAPI exception handlers.

Every domain/application error raised anywhere in the codebase must derive
from `AppError` so a single set of handlers can translate it into a
consistent JSON error envelope. Handlers never leak stack traces to clients.
"""

from __future__ import annotations

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.core.logging import get_logger

logger = get_logger(__name__)


class AppError(Exception):
    """Base class for all application-raised errors."""

    status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR
    error_code: str = "internal_error"

    def __init__(self, message: str, *, details: dict | None = None) -> None:
        self.message = message
        self.details = details or {}
        super().__init__(message)


class NotFoundError(AppError):
    status_code = status.HTTP_404_NOT_FOUND
    error_code = "not_found"


class ValidationAppError(AppError):
    status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
    error_code = "validation_error"


class AuthenticationError(AppError):
    status_code = status.HTTP_401_UNAUTHORIZED
    error_code = "authentication_error"


class AuthorizationError(AppError):
    status_code = status.HTTP_403_FORBIDDEN
    error_code = "authorization_error"


class ConflictError(AppError):
    status_code = status.HTTP_409_CONFLICT
    error_code = "conflict"


class TenantMismatchError(AuthorizationError):
    """Raised when a request tries to access a resource outside its tenant."""

    error_code = "tenant_mismatch"


def _error_envelope(error_code: str, message: str, details: dict | None = None) -> dict:
    return {"error": {"code": error_code, "message": message, "details": details or {}}}


def register_exception_handlers(app: FastAPI) -> None:
    """Attach all exception handlers to the given FastAPI application."""

    @app.exception_handler(AppError)
    async def handle_app_error(_: Request, exc: AppError) -> JSONResponse:
        logger.warning("app_error", extra={"error_code": exc.error_code, "message": exc.message})
        return JSONResponse(
            status_code=exc.status_code,
            content=_error_envelope(exc.error_code, exc.message, exc.details),
        )

    @app.exception_handler(RequestValidationError)
    async def handle_validation_error(_: Request, exc: RequestValidationError) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content=_error_envelope(
                "validation_error",
                "Request validation failed.",
                {"errors": exc.errors()},
            ),
        )

    @app.exception_handler(Exception)
    async def handle_unexpected_error(_: Request, exc: Exception) -> JSONResponse:
        logger.exception("unhandled_error", exc_info=exc)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=_error_envelope("internal_error", "An unexpected error occurred."),
        )
