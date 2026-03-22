import Stripe from 'stripe';

// Server-side Stripe instance - only use in API routes
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
});

// Environment variable helpers
export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  proPriceId: process.env.STRIPE_PRO_PRICE_ID || 'price_PRO_MONTHLY',
  proProductId: process.env.STRIPE_PRO_PRODUCT_ID || 'prod_PRO_PLAN',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://jsonprettify.com',
};
