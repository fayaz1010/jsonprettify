import { rateLimit } from '@/utils/rate-limiter';

export async function GET(request: Request) {
  const rateLimitResponse = rateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  const authHeader = request.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return Response.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Mock subscription status
  return Response.json({
    success: true,
    subscription: {
      status: 'active',
      plan: 'free',
      expires: null,
      features: {
        maxSavedFiles: 5,
        adFree: false,
        sharedFiles: false,
      },
    },
  })
}

export async function POST(request: Request) {
  const rateLimitResponse = rateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  const authHeader = request.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return Response.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const { plan } = body

    if (!plan || !['pro', 'free'].includes(plan)) {
      return Response.json(
        { success: false, error: 'Invalid plan. Must be "free" or "pro"' },
        { status: 400 }
      )
    }

    if (plan === 'free') {
      return Response.json(
        { success: false, error: 'You are already on the free plan' },
        { status: 400 }
      )
    }

    return Response.json({
      success: true,
      message: 'Subscription upgraded to Pro successfully',
      subscription: {
        status: 'active',
        plan: 'pro',
        expires: '2026-03-22T00:00:00Z',
        features: {
          maxSavedFiles: 200,
          adFree: true,
          sharedFiles: true,
        },
      },
    })
  } catch {
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
