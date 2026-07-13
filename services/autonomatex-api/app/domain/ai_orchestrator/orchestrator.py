"""
Default AI Orchestrator implementation.

Maintains a capability -> provider registry and dispatches requests to the
first registered provider that supports the requested capability. Later
phases register real provider adapters (e.g. an Anthropic/OpenAI adapter
via Replit's AI Integrations proxy); Phase 1 ships the routing skeleton so
those adapters can be dropped in without changing this class.
"""

from __future__ import annotations

from app.core.exceptions import AppError
from app.domain.ai_orchestrator.interfaces import AIProvider, AIRequest, AIResponse


class NoProviderAvailableError(AppError):
    status_code = 503
    error_code = "ai_provider_unavailable"


class DefaultAIOrchestrator:
    def __init__(self) -> None:
        self._providers: list[AIProvider] = []

    def register_provider(self, provider: AIProvider) -> None:
        self._providers.append(provider)

    async def dispatch(self, request: AIRequest) -> AIResponse:
        for provider in self._providers:
            if request.capability in provider.supported_capabilities:
                return await provider.invoke(request)

        raise NoProviderAvailableError(
            f"No AI provider is registered for capability '{request.capability}'.",
            details={"capability": request.capability},
        )
