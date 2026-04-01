import { describe, it, expect, vi } from 'vitest';
import { createApp } from '../app.js';
import type { ApiKeyRecord } from '../types.js';

const validKey: ApiKeyRecord = {
  id: 'key_1',
  user_id: 'user_42',
  key_hash: 'anything',
  key_prefix: 'rk_sandbox_ab',
  environment: 'sandbox',
  created_at: '2026-01-01T00:00:00Z',
  revoked_at: null,
};

// Lookup always succeeds — auth is tested elsewhere
const alwaysValidLookup = vi.fn<(keyHash: string) => Promise<ApiKeyRecord | null>>();
alwaysValidLookup.mockResolvedValue(validKey);

const app = createApp(alwaysValidLookup);

const AUTH = { Authorization: 'Bearer rk_sandbox_testkey' };

function post(body: unknown) {
  return app.request('/v1/messages', {
    method: 'POST',
    headers: { ...AUTH, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /v1/messages', () => {
  it('returns 400 when body is missing', async () => {
    const res = await app.request('/v1/messages', {
      method: 'POST',
      headers: AUTH,
    });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe('invalid_data');
  });

  it('returns 400 when namespace is missing', async () => {
    const res = await post({ event: 'sendConfirmation', to: '+1555', data: {} });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe('invalid_data');
  });

  it('returns 400 when event is missing', async () => {
    const res = await post({ namespace: 'appointments', to: '+1555', data: {} });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe('invalid_data');
  });

  it('returns 400 when to is missing', async () => {
    const res = await post({ namespace: 'appointments', event: 'sendConfirmation', data: {} });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe('invalid_data');
  });

  it('returns 400 when data is missing', async () => {
    const res = await post({ namespace: 'appointments', event: 'sendConfirmation', to: '+1555' });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe('invalid_data');
  });

  it('returns 422 template_not_found for unknown namespace/event', async () => {
    const res = await post({ namespace: 'nonexistent', event: 'nope', to: '+1555', data: {} });
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error.code).toBe('template_not_found');
    expect(body.error.message).toContain('nonexistent.nope');
  });

  it('returns 200 with msg_ id, status sent, and valid timestamp for valid request', async () => {
    const res = await post({
      namespace: 'appointments',
      event: 'sendConfirmation',
      to: '+15551234567',
      data: {
        business_name: 'TestBiz',
        service_type: 'haircut',
        date: '2026-04-05',
        time: '10:00 AM',
      },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toMatch(/^msg_/);
    expect(body.status).toBe('sent');
    expect(new Date(body.timestamp).toISOString()).toBe(body.timestamp);
  });

  it('returns 422 invalid_data when a required template variable is missing', async () => {
    const res = await post({
      namespace: 'appointments',
      event: 'sendConfirmation',
      to: '+15551234567',
      data: {
        business_name: 'TestBiz',
        // missing service_type, date, time
      },
    });
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error.code).toBe('invalid_data');
    expect(body.error.message).toContain('Missing required variable');
  });

  it('returns 422 not yet supported for custom namespace', async () => {
    const res = await post({
      namespace: 'custom',
      event: 'send',
      to: '+1555',
      data: {},
    });
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error.code).toBe('template_not_found');
    expect(body.error.message).toContain('Custom messages not yet supported');
  });

  it('generates unique IDs across requests', async () => {
    const data = {
      business_name: 'TestBiz',
      service_type: 'haircut',
      date: '2026-04-05',
      time: '10:00 AM',
    };
    const [res1, res2] = await Promise.all([
      post({ namespace: 'appointments', event: 'sendConfirmation', to: '+1555', data }),
      post({ namespace: 'appointments', event: 'sendConfirmation', to: '+1555', data }),
    ]);
    const body1 = await res1.json();
    const body2 = await res2.json();
    expect(body1.id).not.toBe(body2.id);
  });
});
