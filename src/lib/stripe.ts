import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY is not configured');
    _stripe = new Stripe(key);
  }
  return _stripe;
}

/** @deprecated Use getStripe() instead */
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

// Environment variable helpers
export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  proPriceId: process.env.STRIPE_PRO_PRICE_ID || 'price_PRO_MONTHLY',
  proProductId: process.env.STRIPE_PRO_PRODUCT_ID || 'prod_PRO_PLAN',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://jsonprettify.com',
};
