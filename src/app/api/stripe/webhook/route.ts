import { stripe, STRIPE_CONFIG } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import Stripe from 'stripe';

// Disable Next.js body parsing — Stripe needs the raw body for signature verification
export const runtime = 'nodejs';

// In-memory set for idempotency (in production, use Redis or a DB table)
const processedEvents = new Set<string>();
const MAX_PROCESSED_EVENTS = 10000;

function markEventProcessed(eventId: string): boolean {
  if (processedEvents.has(eventId)) {
    return false;
  }
  if (processedEvents.size >= MAX_PROCESSED_EVENTS) {
    const first = processedEvents.values().next().value;
    if (first !== undefined) processedEvents.delete(first);
  }
  processedEvents.add(eventId);
  return true;
}

// Map Stripe price amounts (in cents) to subscription tiers
function resolveSubscriptionTier(subscription: Stripe.Subscription): {
  tier: string;
  maxSavedFiles: number;
} {
  const item = subscription.items?.data?.[0];
  const amount = item?.price?.unit_amount ?? 0;
  const amountDollars = amount / 100;

  if (amountDollars >= 349) {
    return { tier: 'professional', maxSavedFiles: 200 };
  } else if (amountDollars >= 149) {
    return { tier: 'growth', maxSavedFiles: 200 };
  }
  return { tier: 'starter', maxSavedFiles: 200 };
}

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('[Stripe Webhook] Missing stripe-signature header');
    return Response.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  if (!STRIPE_CONFIG.webhookSecret) {
    console.error('[Stripe Webhook] STRIPE_WEBHOOK_SECRET is not configured');
    return Response.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    const rawBody = await request.text();
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      STRIPE_CONFIG.webhookSecret
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`[Stripe Webhook] Signature verification failed: ${message}`);
    return Response.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    );
  }

  // Idempotency check — skip duplicate events
  if (!markEventProcessed(event.id)) {
    console.log(`[Stripe Webhook] Duplicate event ignored: ${event.id}`);
    return Response.json({ received: true, duplicate: true }, { status: 200 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return Response.json({ received: true }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`[Stripe Webhook] Error processing event ${event.type}: ${message}`);
    return Response.json(
      { error: `Webhook handler failed: ${message}` },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const customerEmail = session.customer_details?.email ?? session.customer_email;
  const customerId = typeof session.customer === 'string'
    ? session.customer
    : session.customer?.id;
  const subscriptionId = typeof session.subscription === 'string'
    ? session.subscription
    : session.subscription?.id;

  console.log(`[Stripe Webhook] checkout.session.completed — email: ${customerEmail}, customer: ${customerId}, subscription: ${subscriptionId}`);

  if (!customerEmail) {
    console.error('[Stripe Webhook] No customer email found in checkout session');
    return;
  }

  const user = await prisma.user.findUnique({ where: { email: customerEmail } });
  if (!user) {
    console.error(`[Stripe Webhook] No user found with email: ${customerEmail}`);
    return;
  }

  await prisma.user.update({
    where: { email: customerEmail },
    data: {
      subscriptionStatus: 'PRO',
      subscriptionTier: 'starter',
      stripeCustomerId: customerId ?? null,
      stripeSubscriptionId: subscriptionId ?? null,
      maxSavedFiles: 200,
    },
  });

  console.log(`[Stripe Webhook] User ${customerEmail} upgraded to PRO`);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = typeof invoice.customer === 'string'
    ? invoice.customer
    : invoice.customer?.id;
  const sub = (invoice as unknown as Record<string, unknown>).subscription;
  const subscriptionId = typeof sub === 'string'
    ? sub
    : (sub as { id?: string })?.id;
  const periodEnd = invoice.lines?.data?.[0]?.period?.end;

  console.log(`[Stripe Webhook] invoice.payment_succeeded — customer: ${customerId}, subscription: ${subscriptionId}`);

  if (!customerId) {
    console.error('[Stripe Webhook] No customer ID found in invoice');
    return;
  }

  const user = await prisma.user.findUnique({ where: { stripeCustomerId: customerId } });
  if (!user) {
    console.error(`[Stripe Webhook] No user found with stripeCustomerId: ${customerId}`);
    return;
  }

  await prisma.user.update({
    where: { stripeCustomerId: customerId },
    data: {
      subscriptionStatus: 'PRO',
      stripeSubscriptionId: subscriptionId ?? null,
    },
  });

  console.log(`[Stripe Webhook] Subscription payment confirmed for customer ${customerId}, period ends: ${periodEnd ? new Date(periodEnd * 1000).toISOString() : 'unknown'}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer?.id;
  const status = subscription.status;

  console.log(`[Stripe Webhook] customer.subscription.updated — customer: ${customerId}, status: ${status}`);

  if (!customerId) {
    console.error('[Stripe Webhook] No customer ID found in subscription update');
    return;
  }

  const isActive = status === 'active' || status === 'trialing';

  const user = await prisma.user.findUnique({ where: { stripeCustomerId: customerId } });
  if (!user) {
    console.error(`[Stripe Webhook] No user found with stripeCustomerId: ${customerId}`);
    return;
  }

  await prisma.user.update({
    where: { stripeCustomerId: customerId },
    data: {
      subscriptionStatus: isActive ? 'PRO' : 'FREE',
      subscriptionTier: isActive ? resolveSubscriptionTier(subscription).tier : 'free',
      maxSavedFiles: isActive ? resolveSubscriptionTier(subscription).maxSavedFiles : 5,
    },
  });

  console.log(`[Stripe Webhook] Subscription for customer ${customerId} updated — active: ${isActive}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer?.id;

  console.log(`[Stripe Webhook] customer.subscription.deleted — customer: ${customerId}`);

  if (!customerId) {
    console.error('[Stripe Webhook] No customer ID found in subscription deletion');
    return;
  }

  const user = await prisma.user.findUnique({ where: { stripeCustomerId: customerId } });
  if (!user) {
    console.error(`[Stripe Webhook] No user found with stripeCustomerId: ${customerId}`);
    return;
  }

  await prisma.user.update({
    where: { stripeCustomerId: customerId },
    data: {
      subscriptionStatus: 'FREE',
      subscriptionTier: 'free',
      stripeSubscriptionId: null,
      maxSavedFiles: 5,
    },
  });

  console.log(`[Stripe Webhook] Subscription cancelled for customer ${customerId} — downgraded to free`);
}
