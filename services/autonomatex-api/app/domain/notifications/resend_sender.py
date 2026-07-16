"""
Resend email adapter for the NotificationSender protocol.

Activated when RESEND_API_KEY is present in the environment.  Sends
transactional email through the Resend API.  The channel field of the
Notification is checked so that only "email" notifications are dispatched;
any other channel falls back to a no-op and returns False.
"""

from __future__ import annotations

import resend

from app.core.logging import get_logger
from app.domain.notifications.interfaces import Notification

logger = get_logger("notifications.resend")


class ResendNotificationSender:
    """Concrete NotificationSender that delivers email via the Resend API."""

    def __init__(self, *, api_key: str, from_email: str) -> None:
        self._api_key = api_key
        self._from_email = from_email

    async def send(self, notification: Notification) -> bool:
        if notification.channel != "email":
            logger.warning(
                "resend_sender_unsupported_channel",
                extra={
                    "channel": notification.channel,
                    "recipient_user_id": notification.recipient_user_id,
                },
            )
            return False

        # recipient_user_id is the user's email address when the Notification
        # is constructed by UserService (see _send_welcome_notification).
        # The metadata dict may carry an explicit "to_email" override for
        # future callers that pass a separate address.
        to_email: str = notification.metadata.get(
            "to_email", notification.recipient_user_id
        )

        try:
            resend.api_key = self._api_key
            resend.Emails.send(
                {
                    "from": self._from_email,
                    "to": [to_email],
                    "subject": notification.subject,
                    "text": notification.body,
                }
            )
            logger.info(
                "resend_email_sent",
                extra={
                    "tenant_id": notification.tenant_id,
                    "recipient_user_id": notification.recipient_user_id,
                    "subject": notification.subject,
                },
            )
            return True
        except Exception:
            logger.exception(
                "resend_email_failed",
                extra={
                    "tenant_id": notification.tenant_id,
                    "recipient_user_id": notification.recipient_user_id,
                },
            )
            return False
