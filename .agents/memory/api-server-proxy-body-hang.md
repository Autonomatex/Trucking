---
name: api-server proxy body-parser hang
description: Why proxied POST/PATCH/PUT requests through artifacts/api-server hang forever, and the mounting-order fix.
---

## The bug
`artifacts/api-server/src/app.ts` applies `express.json()` / `express.urlencoded()`
globally before mounting feature routers. Any router that uses
`http-proxy-middleware` to reverse-proxy to a backend service (e.g. the
FastAPI `autonomatex-api` service via `/api/enterprise/*`) breaks for any
request with a body: the global body parser drains the request stream to
populate `req.body`, so by the time `http-proxy-middleware` tries to pipe the
raw stream to the upstream target, there's nothing left to send. The upstream
request hangs waiting for a body that will never arrive — GET requests
(no body) work fine, masking the bug until a POST/PATCH/PUT is tried.

**Why:** `http-proxy-middleware` streams the raw incoming request; it does
not know how to re-serialize an already-parsed `req.body` back into the
proxied request unless explicitly configured to (e.g. `fixRequestBody`).

**How to apply:** mount any raw reverse-proxy router in `app.ts` *before*
`app.use(express.json())` / `app.use(express.urlencoded())`, not inside the
regular `routes/index.ts` router tree (which sits after the body parsers).
If a future proxy route also needs body parsing itself (not just pass-through),
use `http-proxy-middleware`'s `fixRequestBody` option instead of reordering.
