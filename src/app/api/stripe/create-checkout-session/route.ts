import { stripe, STRIPE_CONFIG } from '@/lib/stripe';
import { rateLimit } from '@/utils/rate-limiter';

export async function POST(request: Request) {
  const rateLimitResponse = rateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const { priceId, billingPeriod } = body;

    const resolvedPriceId = priceId || STRIPE_CONFIG.proPriceId;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: resolvedPriceId,
          quantity: 1,
        },
      ],
      success_url: `${STRIPE_CONFIG.appUrl}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${STRIPE_CONFIG.appUrl}/pricing?checkout=cancelled`,
      metadata: {
        billingPeriod: billingPeriod || 'monthly',
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create checkout session';
    return Response.json(
      { error: message },
      { status: 500 }
    );
  }
}
