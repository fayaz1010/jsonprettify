import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
import { rateLimit } from '@/utils/rate-limiter';

const handler = NextAuth(authOptions);

async function wrappedHandler(request: Request, context: unknown) {
  const rateLimitResponse = rateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  return (handler as (req: Request, ctx: unknown) => Promise<Response>)(request, context);
}

export { wrappedHandler as GET, wrappedHandler as POST };
