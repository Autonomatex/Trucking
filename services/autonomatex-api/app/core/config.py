"""
Centralized application configuration.

All runtime configuration is sourced from environment variables through a
single `Settings` object, following the twelve-factor pattern. No secrets or
environment-specific values are hard-coded anywhere else in the codebase —
every module that needs configuration imports `get_settings()`.
"""

from __future__ import annotations

from functools import lru_cache
from typing import Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Strongly-typed application settings loaded from the environment."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    # --- Application ---------------------------------------------------
    app_name: str = "Autonomatex Enterprise Platform"
    environment: Literal["development", "staging", "production"] = "development"
    api_v1_prefix: str = "/api/v1"
    port: int = Field(default=8000, validation_alias="PORT")
    log_level: str = "INFO"

    # --- Database --------------------------------------------------------
    # Reuses the workspace's pre-provisioned PostgreSQL instance. The
    # enterprise platform is isolated from the existing Node stack by using
    # its own Postgres schema (`db_schema`) inside the same database rather
    # than a second database instance.
    database_url: str = Field(validation_alias="DATABASE_URL")
    db_schema: str = "autonomatex_enterprise"
    db_pool_size: int = 10
    db_max_overflow: int = 20
    db_echo: bool = False

    # --- Redis / Celery ---------------------------------------------------
    redis_url: str = Field(default="redis://localhost:6379/0", validation_alias="REDIS_URL")
    celery_broker_url: str | None = Field(default=None, validation_alias="CELERY_BROKER_URL")
    celery_result_backend: str | None = Field(default=None, validation_alias="CELERY_RESULT_BACKEND")

    # --- Security ----------------------------------------------------------
    jwt_secret_key: str = Field(validation_alias="SESSION_SECRET")
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_minutes: int = 60 * 24 * 7

    # --- CORS ---------------------------------------------------------------
    cors_allow_origins: list[str] = Field(default_factory=lambda: ["*"])

    # --- Rate limiting ------------------------------------------------------
    # POST /tenants (public signup): limit per remote IP, using a fixed window.
    signup_rate_limit_requests: int = 5    # max signups per window
    signup_rate_limit_window_seconds: int = 3600  # 1 hour

    # How many reverse-proxy hops sit in front of this app.
    # 0 (default) = use the raw TCP peer address; X-Forwarded-For is ignored.
    # N > 0 = trust the rightmost N entries in X-Forwarded-For as added by
    # controlled proxies and use the entry just before them as the client IP.
    # Set this to 1 when behind a single load-balancer/reverse-proxy.
    rate_limit_trusted_proxy_count: int = Field(
        default=0, validation_alias="RATE_LIMIT_TRUSTED_PROXY_COUNT"
    )

    @field_validator("database_url")
    @classmethod
    def _normalize_database_url(cls, value: str) -> str:
        """Ensure the async SQLAlchemy driver (asyncpg) is used at runtime.

        `asyncpg` (unlike psycopg2) does not accept a `sslmode` query
        parameter — it takes an `ssl` connect arg instead — so `sslmode` is
        stripped here and re-added only on the sync DSN used by Alembic.
        """
        if value.startswith("postgres://"):
            value = "postgresql://" + value[len("postgres://"):]
        if value.startswith("postgresql://") and "+asyncpg" not in value:
            value = value.replace("postgresql://", "postgresql+asyncpg://", 1)
        return cls._strip_query_param(value, "sslmode")

    @staticmethod
    def _strip_query_param(url: str, param: str) -> str:
        from urllib.parse import urlencode, urlparse, urlunparse, parse_qsl

        parsed = urlparse(url)
        query_pairs = [(k, v) for k, v in parse_qsl(parsed.query) if k != param]
        return urlunparse(parsed._replace(query=urlencode(query_pairs)))

    @property
    def sync_database_url(self) -> str:
        """Synchronous (psycopg2) DSN, used by Alembic migrations."""
        url = self.database_url
        if "+asyncpg" in url:
            url = url.replace("+asyncpg", "+psycopg2")
        return url

    @property
    def celery_broker(self) -> str:
        return self.celery_broker_url or self.redis_url

    @property
    def celery_backend(self) -> str:
        return self.celery_result_backend or self.redis_url


@lru_cache
def get_settings() -> Settings:
    """Return the process-wide cached settings instance."""
    return Settings()
