import { describe, it, expect, vi } from 'vitest';
import { createApp } from '../app.js';
import { hashApiKey } from '../middleware/auth.js';
import { registry } from '../templates/registry.js';
import type { ApiKeyRecord } from '../types.js';

// ── Test key setup ─────────────────────────────────────────────────

const TEST_KEY = 'rk_sandbox_testkey123';
const TEST_KEY_HASH = hashApiKey(TEST_KEY);
const BAD_KEY = 'rk_sandbox_badkey';

const validKey: ApiKeyRecord = {
  id: 'key_integration',
  user_id: null,
  key_hash: TEST_KEY_HASH,
  key_prefix: 'rk_sandbox_te',
  environment: 'sandbox',
  status: 'active',
  created_at: '2026-01-01T00:00:00Z',
  revoked_at: null,
  last_used_at: null,
  label: null,
  raw_key: null,
};

const mockLookup = vi.fn<(keyHash: string) => Promise<ApiKeyRecord | null>>();
mockLookup.mockImplementation(async (keyHash: string) => {
  if (keyHash === TEST_KEY_HASH) return validKey;
  return null;
});

const app = createApp(mockLookup);

const AUTH = { Authorization: `Bearer ${TEST_KEY}` };

function post(body: unknown, headers: Record<string, string> = AUTH) {
  return app.request('/v1/messages', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

// ── Integration tests ──────────────────────────────────────────────

describe('SDK-to-API integration', () => {
  it('SDK-shaped request succeeds with 200, msg_ id, sent status, and ISO timestamp', async () => {
    const res = await post({
      namespace: 'appointments',
      event: 'sendConfirmation',
      to: '+15551234567',
      data: {
        business_name: 'Test Biz',
        service_type: 'haircut',
        date: '2026-04-10',
        time: '2:00 PM',
      },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toMatch(/^msg_/);
    expect(body.status).toBe('sent');
    expect(new Date(body.timestamp).toISOString()).toBe(body.timestamp);
  });

  it('unknown namespace returns 422 with template_not_found', async () => {
    const res = await post({
      namespace: 'fake',
      event: 'nothing',
      to: '+15551234567',
      data: {},
    });
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error.code).toBe('template_not_found');
  });

  it('missing fields return 400 with invalid_data', async () => {
    const res = await post({ namespace: 'appointments' });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe('invalid_data');
  });

  it('invalid API key returns 401 with invalid_api_key', async () => {
    const res = await post(
      {
        namespace: 'appointments',
        event: 'sendConfirmation',
        to: '+15551234567',
        data: { business_name: 'X', service_type: 'Y', date: 'Z', time: 'W' },
      },
      { Authorization: `Bearer ${BAD_KEY}` },
    );
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error.code).toBe('invalid_api_key');
  });

  // ── Every namespace reachable ──────────────────────────────────────

  const variableFills: Record<string, string> = {
    business_name: 'TestBiz',
    service_type: 'haircut',
    date: '2026-04-10',
    time: '2:00 PM',
    website_url: 'https://example.com',
    order_id: 'ORD-001',
    tracking_url: 'https://track.example.com/123',
    app_name: 'TestApp',
    code: '123456',
    device: 'iPhone 15',
    ticket_id: 'TK-100',
    status: 'in_progress',
    content: 'Important update for the group.',
    community_name: 'TestCommunity',
    location: '123 Main St',
    renewal_date: '2026-05-01',
    wait_time: '15 minutes',
    estimated_wait: '20 minutes',
  };

  const namespaces = Object.keys(registry);

  it('registry has all 8 namespaces', () => {
    expect(namespaces).toHaveLength(8);
  });

  it.each(namespaces)('%s — first template returns 200', async (ns) => {
    const events = Object.keys(registry[ns]);
    const firstEvent = events[0];
    const template = registry[ns][firstEvent];
    const data: Record<string, string> = {};
    for (const v of template.variables) {
      data[v] = variableFills[v] ?? `test_${v}`;
    }

    const res = await post({
      namespace: ns,
      event: firstEvent,
      to: '+15551234567',
      data,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toMatch(/^msg_/);
    expect(body.status).toBe('sent');
  });
});
