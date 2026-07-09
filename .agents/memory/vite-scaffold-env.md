---
name: Vite scaffold PORT/BASE_PATH
description: The artifact scaffold's vite.config.ts throws if PORT or BASE_PATH env vars are missing — breaks CI/Netlify builds.
---

## Rule
When working on any artifact's vite.config.ts, add safe fallbacks so `pnpm run build` succeeds without the artifact runner's env vars.

**Why:** The scaffold throws hard errors on missing PORT/BASE_PATH. This breaks `pnpm --filter @workspace/<artifact> run build` in Netlify CI or any context that doesn't provide these vars. PORT is only used by the dev/preview server — not the build output — so a fallback to 3000 is safe. BASE_PATH defaults to '/' for root-domain Netlify deploys.

**How to apply:**
```typescript
// Replace the throw-on-missing guards with:
const port = rawPort ? Number(rawPort) : 3000;
const basePath = process.env.BASE_PATH ?? '/';
```
Only the artifact runner provides real values; fallbacks are harmless for it.
