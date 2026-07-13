"""
Baseline `NotificationSender` implementation.

Delivers notifications through the structured application log — a real,
working in-app delivery channel suitable for the operational audit trail.
Later phases register additional channel adapters (email/SMS/push) behind
the same interface without touching call sites.
"""

from __future__ import annotations

from app.core.logging import get_logger
from app.domain.notifications.interfaces import Notification

logger = get_logger("notifications")


class LoggingNotificationSender:
    async def send(self, notification: Notification) -> bool:
        logger.info(
            "notification_sent",
            extra={
                "tenant_id": notification.tenant_id,
                "recipient_user_id": notification.recipient_user_id,
                "channel": notification.channel,
                "subject": notification.subject,
            },
        )
        return True
