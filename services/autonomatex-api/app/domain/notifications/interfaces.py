"""Notifications domain contract."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Protocol, runtime_checkable


@dataclass(frozen=True, slots=True)
class Notification:
    tenant_id: str
    recipient_user_id: str
    channel: str  # e.g. "email", "sms", "in_app"
    subject: str
    body: str
    metadata: dict = field(default_factory=dict)


@runtime_checkable
class NotificationSender(Protocol):
    async def send(self, notification: Notification) -> bool: ...
