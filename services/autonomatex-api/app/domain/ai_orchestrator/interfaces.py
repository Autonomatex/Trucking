"""
AI Orchestrator domain contract.

Routes requests to one of several registered `AIProvider` adapters (LLM
vendors, internal models, etc.). Phase 1 defines the routing contract and
provider registration mechanism only — no provider adapter is wired up yet,
since that requires per-vendor credentials the user has not provided. The
orchestrator fails loudly and explicitly (`AppError`) when no provider is
registered for a capability, rather than returning a fabricated response.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Protocol, runtime_checkable


@dataclass(frozen=True, slots=True)
class AIRequest:
    tenant_id: str
    capability: str  # e.g. "summarize", "classify", "extract"
    prompt: str
    metadata: dict = field(default_factory=dict)


@dataclass(frozen=True, slots=True)
class AIResponse:
    provider_name: str
    capability: str
    output: str
    metadata: dict = field(default_factory=dict)


@runtime_checkable
class AIProvider(Protocol):
    name: str
    supported_capabilities: frozenset[str]

    async def invoke(self, request: AIRequest) -> AIResponse: ...


@runtime_checkable
class AIOrchestrator(Protocol):
    def register_provider(self, provider: AIProvider) -> None: ...

    async def dispatch(self, request: AIRequest) -> AIResponse: ...
