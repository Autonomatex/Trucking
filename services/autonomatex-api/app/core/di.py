"""
Lightweight dependency-injection container.

FastAPI's own `Depends` system already provides request-scoped DI for
routes. This module adds a small process-wide container for singleton
infrastructure objects (settings, engines, Redis client, Celery app) so
services and use cases depend on *interfaces*, not concrete infrastructure,
and can be swapped in tests without monkeypatching globals.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Callable, TypeVar

T = TypeVar("T")


@dataclass
class Container:
    """A minimal service locator keyed by type or explicit string key."""

    _singletons: dict[Any, Any]

    def __init__(self) -> None:
        self._singletons = {}

    def register(self, key: Any, instance: Any) -> None:
        self._singletons[key] = instance

    def register_factory(self, key: Any, factory: Callable[[], T]) -> None:
        """Register a lazily-created singleton, built on first `resolve`."""
        self._singletons[key] = factory

    def resolve(self, key: Any) -> Any:
        value = self._singletons.get(key)
        if value is None:
            raise KeyError(f"No dependency registered for key: {key!r}")
        if callable(value) and not isinstance(value, type):
            # Lazily materialize factories on first use, then cache the result.
            instance = value()
            self._singletons[key] = instance
            return instance
        return value

    def override(self, key: Any, instance: Any) -> None:
        """Explicit override, primarily used by tests."""
        self._singletons[key] = instance


container = Container()
