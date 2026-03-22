const WINDOW_MS = 60_000; // 60 seconds
const MAX_REQUESTS = 60;

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now >= entry.resetTime) {
      store.delete(key);
    }
  }
}, WINDOW_MS);

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  // Fallback — in Next.js App Router, socket info isn't directly available on Request,
  // but x-forwarded-for is typically set by the server or reverse proxy.
  return '127.0.0.1';
}

/**
 * Checks the rate limit for the given request.
 * Returns a 429 Response if the limit is exceeded, or null if the request is allowed.
 */
export function rateLimit(request: Request): Response | null {
  const ip = getClientIp(request);
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now >= entry.resetTime) {
    store.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return null;
  }

  entry.count++;

  if (entry.count > MAX_REQUESTS) {
    return Response.json(
      {
        error: 'Too Many Requests',
        message: 'You have exceeded the rate limit. Please try again later.',
      },
      { status: 429 }
    );
  }

  return null;
}
