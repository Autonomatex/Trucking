---
name: Autonomatex API backend quirks
description: Non-obvious environment/library gotchas in services/autonomatex-api that aren't visible from reading the code alone.
---

## passlib + bcrypt version mismatch
`passlib==1.7.4`'s bcrypt backend probe crashes with `ValueError: password cannot be longer than 72 bytes` for *any* password (even short ones) when paired with `bcrypt>=4.1` — the bcrypt package dropped the `__about__.__version__` attribute passlib's `detect_wrap_bug` probe relies on.

**Why:** passlib has not shipped a fix; the community workaround is pinning bcrypt below the breaking change.
**How to apply:** keep `bcrypt<4.1` pinned in this service's Python deps. If password hashing suddenly starts throwing that error again after a dependency update, check `bcrypt.__version__` first before debugging application code.

## AppError logging crashes the whole error-handling path
`register_exception_handlers`' `AppError` handler used to call `logger.warning(..., extra={"message": exc.message})`. Python's stdlib `logging` reserves `message` as a computed `LogRecord` attribute, so passing it via `extra` raises `KeyError` inside `makeRecord` — which happens *while handling the original exception*, so every `AppError` subclass (404s, 409s, 401s, etc.) turned into an opaque 500.

**Why:** discovered while adding tenant endpoints — a deliberate `ConflictError` (409) came back as a generic `internal_error` until this was fixed.
**How to apply:** never pass `extra={"message": ...}` (or any other reserved LogRecord attr name — `name`, `levelname`, `args`, etc.) to a stdlib logger call anywhere in this service.
