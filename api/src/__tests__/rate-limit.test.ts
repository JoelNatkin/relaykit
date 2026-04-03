import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Hono } from 'hono';
import { createRateLimiter } from '../middleware/rate-limit.js';

function createTestApp(max: number, windowMs: number) {
  const app = new Hono();
  app.post('/test', createRateLimiter(max, windowMs), (c) => c.json({ ok: true }));
  return app;
}

function post(app: ReturnType<typeof createTestApp>, ip = '1.2.3.4') {
  return app.request('/test', {
    method: 'POST',
    headers: { 'x-forwarded-for': ip, 'Content-Type': 'application/json' },
    body: '{}',
  });
}

describe('rate limiter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-03T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows requests under the limit', async () => {
    const app = createTestApp(3, 60_000);
    for (let i = 0; i < 3; i++) {
      const res = await post(app);
      expect(res.status).toBe(200);
    }
  });

  it('returns 429 when limit exceeded', async () => {
    const app = createTestApp(2, 60_000);
    await post(app);
    await post(app);
    const res = await post(app);
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.error.code).toBe('rate_limited');
    expect(body.error.message).toContain('Too many');
  });

  it('returns Retry-After header on 429', async () => {
    const app = createTestApp(1, 60_000);
    await post(app);
    const res = await post(app);
    expect(res.status).toBe(429);
    const retryAfter = res.headers.get('Retry-After');
    expect(retryAfter).toBeDefined();
    expect(Number(retryAfter)).toBeGreaterThan(0);
    expect(Number(retryAfter)).toBeLessThanOrEqual(60);
  });

  it('resets after window expires', async () => {
    const app = createTestApp(1, 60_000);
    await post(app);
    const blocked = await post(app);
    expect(blocked.status).toBe(429);

    // Advance past window
    vi.advanceTimersByTime(60_001);

    const res = await post(app);
    expect(res.status).toBe(200);
  });

  it('tracks different IPs independently', async () => {
    const app = createTestApp(1, 60_000);
    const res1 = await post(app, '10.0.0.1');
    expect(res1.status).toBe(200);

    const res2 = await post(app, '10.0.0.2');
    expect(res2.status).toBe(200);

    const res3 = await post(app, '10.0.0.1');
    expect(res3.status).toBe(429);

    const res4 = await post(app, '10.0.0.2');
    expect(res4.status).toBe(429);
  });
});
