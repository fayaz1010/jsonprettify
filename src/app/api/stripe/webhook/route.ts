import { stripe, STRIPE_CONFIG } from '@/lib/stripe';
import Stripe from 'stripe';

// Disable Next.js body parsing — Stripe needs the raw body for signature verification
export const runtime = 'nodejs';

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

  // TODO: Replace with real database update when DB is integrated
  // Example:
  // await db.user.update({
  //   where: { email: customerEmail },
  //   data: {
  //     isPro: true,
  //     subscription: 'pro',
  //     stripeCustomerId: customerId,
  //     stripeSubscriptionId: subscriptionId,
  //     maxSavedFiles: 200,
  //   },
  // });

  console.log(`[Stripe Webhook] User ${customerEmail} upgraded to pro`);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = typeof invoice.customer === 'string'
    ? invoice.customer
    : invoice.customer?.id;
  const subscriptionId = typeof invoice.subscription === 'string'
    ? invoice.subscription
    : invoice.subscription?.id;
  const periodEnd = invoice.lines?.data?.[0]?.period?.end;

  console.log(`[Stripe Webhook] invoice.payment_succeeded — customer: ${customerId}, subscription: ${subscriptionId}`);

  if (!customerId) {
    console.error('[Stripe Webhook] No customer ID found in invoice');
    return;
  }

  // TODO: Replace with real database update when DB is integrated
  // Example:
  // await db.user.update({
  //   where: { stripeCustomerId: customerId },
  //   data: {
  //     isPro: true,
  //     subscriptionRenewsAt: periodEnd ? new Date(periodEnd * 1000) : null,
  //   },
  // });

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

  // TODO: Replace with real database update when DB is integrated
  // Example:
  // await db.user.update({
  //   where: { stripeCustomerId: customerId },
  //   data: {
  //     isPro: isActive,
  //     subscription: isActive ? 'pro' : 'free',
  //     maxSavedFiles: isActive ? 200 : 5,
  //   },
  // });

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

  // TODO: Replace with real database update when DB is integrated
  // Example:
  // await db.user.update({
  //   where: { stripeCustomerId: customerId },
  //   data: {
  //     isPro: false,
  //     subscription: 'free',
  //     stripeSubscriptionId: null,
  //     maxSavedFiles: 5,
  //   },
  // });

  console.log(`[Stripe Webhook] Subscription cancelled for customer ${customerId} — downgraded to free`);
}
