import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { rateLimit } from '@/utils/rate-limiter';

export async function GET(request: Request) {
  const rateLimitResponse = rateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return Response.json(
      { success: false, error: 'User not found' },
      { status: 404 }
    );
  }

  const isPro = user.subscriptionStatus === 'PRO';

  return Response.json({
    success: true,
    subscription: {
      status: user.subscriptionStatus,
      plan: isPro ? 'pro' : 'free',
      isPro,
      features: {
        maxSavedFiles: isPro ? 200 : 5,
        adFree: isPro,
        hasJsonDiff: isPro,
        hasSchemaValidation: isPro,
        hasAdvancedConversions: isPro,
      },
    },
  });
}
