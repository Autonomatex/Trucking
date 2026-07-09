// ─────────────────────────────────────────────────────────────────────────────
// STRIPE PAYMENT LINKS
// Replace each placeholder with a real Stripe Payment Link URL before
// public paid outreach. All other functionality works without these.
// ─────────────────────────────────────────────────────────────────────────────

export const PAYMENT_LINKS: Record<string, string> = {
  pilot:    'https://buy.stripe.com/REPLACE_WITH_79_PAID_PILOT_LINK',
  oneTruck: 'https://buy.stripe.com/REPLACE_WITH_99_ONE_TRUCK_LINK',
  fourTruck:'https://buy.stripe.com/REPLACE_WITH_199_FOUR_TRUCK_LINK',
  core:     'https://buy.stripe.com/REPLACE_WITH_299_CORE_LINK',
  growth:   'https://buy.stripe.com/REPLACE_WITH_749_GROWTH_LINK',
  pro:      'https://buy.stripe.com/REPLACE_WITH_1499_PRO_LINK',
};

export function isPlaceholder(url: string): boolean {
  return !url || url.includes('REPLACE_WITH') || url === '#';
}

export function getPaymentUrl(plan: string): string | null {
  const url = PAYMENT_LINKS[plan];
  if (!url || isPlaceholder(url)) return null;
  return url;
}
