---
name: Dispatch site build
description: Key decisions for the Autonomatex Dispatch React + Vite site at artifacts/dispatch/
---

## Structure
- Artifact slug: `dispatch`, previewPath: `/dispatch/`
- Router: wouter with `base={import.meta.env.BASE_URL.replace(/\/$/, '')}`
- 4 pages: HomePage (19 sections), WorkflowPage, OnboardingPage, ThankYouPage

## Netlify Forms
- Hidden forms in `index.html`: `autonomatex-paid-pilot-interest` and `autonomatex-paid-pilot-onboarding`
- React forms submit via `fetch('/', { method: 'POST', body: urlEncoded })` — no action attribute needed
- On success: `navigate('/thank-you')` via wouter

**Why:** Netlify requires a static HTML copy of the form for detection at build time; React-only forms are not detected.

## Stripe
- All 6 plan links are placeholders in `src/config/stripe.ts`
- `isPlaceholder(planId)` returns true for placeholder links
- Clicking a placeholder scrolls to `#paid-pilot` form instead of redirecting
- `getPaymentUrl(planId)` returns `null` for placeholders

**How to apply:** Drop real Stripe payment URLs into `PAYMENT_LINKS` in stripe.ts before public outreach.

## Design system
- Matches autonomatex.com: accent `#0D9488`, dark `#1E2433`, bg `#FAFBFC`, border `#E6EAF0`, Inter font
- FadeUp component wraps sections; staggerContainer/staggerItem for card grids
- Hero uses a hand-coded SVG dispatch console (no external image dependency)
