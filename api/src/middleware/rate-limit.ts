import type { MiddlewareHandler } from 'hono';

interface RateEntry {
  count: number;
  resetAt: number;
}

export function createRateLimiter(maxRequests: number, windowMs: number): MiddlewareHandler {
  const store = new Map<string, RateEntry>();

  return async (c, next) => {
    const now = Date.now();

    // Sweep expired entries
    for (const [key, entry] of store) {
      if (entry.resetAt <= now) store.delete(key);
    }

    const ip = c.req.header('x-forwarded-for') ?? 'unknown';
    const entry = store.get(ip);

    if (entry) {
      if (entry.count >= maxRequests) {
        const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
        c.header('Retry-After', String(retryAfter));
        return c.json(
          { error: { code: 'rate_limited', message: 'Too many signup requests. Try again later.' } },
          429,
        );
      }
      entry.count++;
    } else {
      store.set(ip, { count: 1, resetAt: now + windowMs });
    }

    await next();
  };
}
