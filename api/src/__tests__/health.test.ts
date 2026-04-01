import { describe, it, expect } from 'vitest';
import { app } from '../app.js';

describe('GET /', () => {
  it('returns 200 with status ok and service name', async () => {
    const res = await app.request('/');
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body).toEqual({ status: 'ok', service: 'relaykit-api' });
  });

  it('does not require authentication', async () => {
    const res = await app.request('/');
    expect(res.status).toBe(200);
  });
});

describe('POST /v1/messages', () => {
  it('returns 401 without authentication', async () => {
    const res = await app.request('/v1/messages', { method: 'POST' });
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toEqual({
      error: { code: 'invalid_api_key', message: 'Missing or invalid API key' },
    });
  });
});
