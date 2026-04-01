import { describe, it, expect } from 'vitest';
import { app } from '../app.js';

describe('GET /', () => {
  it('returns 200 with status ok and service name', async () => {
    const res = await app.request('/');
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body).toEqual({ status: 'ok', service: 'relaykit-api' });
  });
});
