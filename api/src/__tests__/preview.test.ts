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

const alwaysValidLookup = vi.fn<(keyHash: string) => Promise<ApiKeyRecord | null>>();
alwaysValidLookup.mockResolvedValue(validKey);

const app = createApp(alwaysValidLookup);
const AUTH = { Authorization: 'Bearer rk_sandbox_testkey' };

function post(body: unknown) {
  return app.request('/v1/messages/preview', {
    method: 'POST',
    headers: { ...AUTH, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /v1/messages/preview', () => {
  it('returns 400 when body is missing', async () => {
    const res = await app.request('/v1/messages/preview', {
      method: 'POST',
      headers: AUTH,
    });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe('invalid_data');
  });

  it('returns 400 when a required field is missing', async () => {
    const res = await post({ namespace: 'appointments', event: 'sendConfirmation', data: {} });
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

  it('returns 422 invalid_data when a required template variable is missing', async () => {
    const res = await post({
      namespace: 'appointments',
      event: 'sendConfirmation',
      to: '+15551234567',
      data: { business_name: 'TestBiz' },
    });
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error.code).toBe('invalid_data');
    expect(body.error.message).toContain('Missing required variable');
  });

  it('returns 200 with valid true, interpolated message, template_id, namespace, and event', async () => {
    const res = await post({
      namespace: 'appointments',
      event: 'sendConfirmation',
      to: '+15551234567',
      data: {
        business_name: 'GlowStudio',
        service_type: 'facial',
        date: '2026-04-05',
        time: '2:00 PM',
      },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.valid).toBe(true);
    expect(body.message).toContain('GlowStudio');
    expect(body.message).toContain('facial');
    expect(body.message).toContain('2026-04-05');
    expect(body.message).toContain('2:00 PM');
    expect(body.template_id).toBe('appointments_booking_confirmation');
    expect(body.namespace).toBe('appointments');
    expect(body.event).toBe('sendConfirmation');
  });

  it('returns 422 not yet supported for custom namespace', async () => {
    const res = await post({ namespace: 'custom', event: 'send', to: '+1555', data: {} });
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error.code).toBe('template_not_found');
    expect(body.error.message).toContain('Custom messages not yet supported');
  });
});
