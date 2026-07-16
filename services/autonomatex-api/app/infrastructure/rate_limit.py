"""Per-IP rate limiting backed by Redis.

Uses a fixed-window counter: each (key, window) pair is stored as a Redis
string. The first request in a window sets the key with a TTL equal to the
window length; every subsequent request increments it. If the counter
exceeds the configured limit the caller gets ``RateLimitError``.

## Client IP resolution

Trusting X-Forwarded-For blindly lets any caller spoof the header and
rotate fake IPs to bypass the rate limit. This module uses a configurable
``TRUSTED_PROXY_COUNT`` (default 0) to decide how much of the header is
safe to use:

- **0 (default)**: always use ``request.client.host``, i.e. the TCP peer
  address. This is correct when the app is directly reachable (no reverse
  proxy) and is the safe default.
- **N > 0**: trust the rightmost N entries in ``X-Forwarded-For`` as
  added by our own proxies, and use the entry just before them as the real
  client IP. This is correct behind N known, controlled proxies (e.g. one
  load balancer: N=1). Attackers can still prepend fake IPs to the header,
  but those appear on the *left*, not in the N-rightmost positions our
  proxies added.

Set ``RATE_LIMIT_TRUSTED_PROXY_COUNT`` in the environment to match your
deployment topology.

## Fail-open policy

If Redis is unavailable (``redis.exceptions.RedisError``), the request is
allowed through with a warning. This keeps the signup flow alive during a
Redis outage while still enforcing limits when Redis is healthy.

Unexpected non-Redis exceptions (e.g. programming errors) are *not* caught
here; they bubble up and are handled by the global exception handler so they
are not silently swallowed.
"""

from __future__ import annotations

import time
from typing import Callable

import redis.asyncio as aioredis
import redis.exceptions as redis_exc
from fastapi import Depends, Request

from app.core.config import Settings, get_settings
from app.core.exceptions import RateLimitError
from app.core.logging import get_logger

logger = get_logger(__name__)

_redis_client: aioredis.Redis | None = None


def _get_redis(settings: Settings) -> aioredis.Redis:
    global _redis_client
    if _redis_client is None:
        _redis_client = aioredis.from_url(settings.redis_url, decode_responses=True)
    return _redis_client


def _client_ip(request: Request, trusted_proxy_count: int) -> str:
    """Derive the real client IP from the request.

    When ``trusted_proxy_count == 0`` (the safe default), we use the raw TCP
    peer address (``request.client.host``). This cannot be spoofed by the
    client because the OS hands it to us from the network stack.

    When ``trusted_proxy_count > 0``, we take the rightmost
    ``trusted_proxy_count`` entries in ``X-Forwarded-For`` as belonging to
    our own controlled proxies, and return the entry immediately to their
    left. An attacker who prepends extra IPs cannot influence those rightmost
    entries because our proxies always *append* the IP they see.

    Example (trusted_proxy_count=1):
        Client sends: X-Forwarded-For: 1.2.3.4
        Our LB appends its view (the real client): X-Forwarded-For: 1.2.3.4, 5.6.7.8
        We take parts[-1] = "5.6.7.8"  ← correct; attacker cannot forge this
    """
    if trusted_proxy_count == 0 or not request.client:
        return request.client.host if request.client else "unknown"

    xff = request.headers.get("x-forwarded-for", "")
    if not xff:
        return request.client.host if request.client else "unknown"

    parts = [p.strip() for p in xff.split(",") if p.strip()]
    if len(parts) >= trusted_proxy_count:
        # The entry added by the outermost trusted proxy is at index
        # -(trusted_proxy_count), counting from the right.
        return parts[-trusted_proxy_count]

    # Fewer entries than expected — fall back to TCP peer.
    return request.client.host if request.client else "unknown"


async def _check_rate_limit(
    *,
    redis: aioredis.Redis,
    key_prefix: str,
    max_requests: int,
    window_seconds: int,
    ip: str,
) -> None:
    """Increment the counter for ``ip`` and raise if the limit is exceeded.

    The Redis key encodes the fixed window start time so different windows
    never share a counter.
    """
    window_start = int(time.time()) // window_seconds
    redis_key = f"rl:{key_prefix}:{ip}:{window_start}"

    count = await redis.incr(redis_key)
    if count == 1:
        # First request in this window — set expiry so keys clean themselves up.
        await redis.expire(redis_key, window_seconds)

    if count > max_requests:
        logger.warning(
            "rate_limit_exceeded",
            extra={
                "key_prefix": key_prefix,
                "ip": ip,
                "count": count,
                "max_requests": max_requests,
            },
        )
        raise RateLimitError(
            f"Too many requests. Allowed {max_requests} per "
            f"{window_seconds // 60} minute(s). Please try again later."
        )


def resolve_client_ip(request: Request, *, trusted_proxy_count: int) -> str:
    """Public wrapper around ``_client_ip`` for non-rate-limit callers."""
    return _client_ip(request, trusted_proxy_count)


def make_rate_limiter(key_prefix: str) -> Callable:
    """Return a FastAPI dependency that enforces per-IP rate limiting.

    Usage::

        @router.post("", dependencies=[Depends(make_rate_limiter("signup"))])
        async def create_tenant(...): ...

    The returned dependency reads its limits from ``Settings`` at call time.
    Redis outages (``redis.exceptions.RedisError``) are caught and logged so
    that the underlying route is not blocked by infrastructure failures. All
    other exceptions propagate normally.
    """

    async def _dependency(
        request: Request,
        settings: Settings = Depends(get_settings),
    ) -> None:
        ip = _client_ip(request, settings.rate_limit_trusted_proxy_count)

        try:
            redis = _get_redis(settings)
            await _check_rate_limit(
                redis=redis,
                key_prefix=key_prefix,
                max_requests=settings.signup_rate_limit_requests,
                window_seconds=settings.signup_rate_limit_window_seconds,
                ip=ip,
            )
        except RateLimitError:
            raise
        except redis_exc.RedisError as exc:
            # Redis is down or unreachable — fail open so the signup flow
            # keeps working. Log a warning so ops can react.
            logger.warning(
                "rate_limit_redis_unavailable",
                extra={"key_prefix": key_prefix, "ip": ip, "error": str(exc)},
            )
        # All other exceptions (programming errors, etc.) propagate normally.

    return _dependency
