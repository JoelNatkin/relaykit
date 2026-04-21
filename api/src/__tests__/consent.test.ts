import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createApp } from '../app.js';
import type { ApiKeyRecord, ConsentRecord, ConsentStore } from '../types.js';

const validKey: ApiKeyRecord = {
  id: 'key_1',
  user_id: 'user_42',
  key_hash: 'anything',
  key_prefix: 'rk_test_ab',
  environment: 'sandbox',
  status: 'active',
  created_at: '2026-01-01T00:00:00Z',
  revoked_at: null,
  last_used_at: null,
  label: null,
  raw_key: null,
};

const alwaysValidLookup = vi.fn<(keyHash: string) => Promise<ApiKeyRecord | null>>();
alwaysValidLookup.mockResolvedValue(validKey);

const mockStore: ConsentStore = {
  record: vi.fn(),
  check: vi.fn(),
  revoke: vi.fn(),
};

const app = createApp(alwaysValidLookup, mockStore);
const AUTH = { Authorization: 'Bearer rk_test_testkey' };

beforeEach(() => {
  vi.mocked(mockStore.record).mockReset();
  vi.mocked(mockStore.check).mockReset();
  vi.mocked(mockStore.revoke).mockReset();
});

describe('POST /v1/consent', () => {
  it('returns 400 when phone is missing', async () => {
    const res = await app.request('/v1/consent', {
      method: 'POST',
      headers: { ...AUTH, 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: 'opt_in_form' }),
    });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe('invalid_data');
  });

  it('returns 400 when source is missing', async () => {
    const res = await app.request('/v1/consent', {
      method: 'POST',
      headers: { ...AUTH, 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+15551234567' }),
    });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe('invalid_data');
  });

  it('returns 200 with recorded consent on valid request', async () => {
    const record: ConsentRecord = {
      id: 'consent_1',
      user_id: 'user_42',
      phone: '+15551234567',
      consented_at: '2026-04-01T12:00:00.000Z',
      revoked_at: null,
      ip_address: null,
      source: 'opt_in_form',
    };
    vi.mocked(mockStore.record).mockResolvedValueOnce(record);

    const res = await app.request('/v1/consent', {
      method: 'POST',
      headers: { ...AUTH, 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+15551234567', source: 'opt_in_form' }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.phone).toBe('+15551234567');
    expect(body.status).toBe('recorded');
    expect(body.consented_at).toBe('2026-04-01T12:00:00.000Z');
  });

  it('passes user_id from auth context to store', async () => {
    const record: ConsentRecord = {
      id: 'consent_1',
      user_id: 'user_42',
      phone: '+15551234567',
      consented_at: '2026-04-01T12:00:00.000Z',
      revoked_at: null,
      ip_address: null,
      source: 'checkout_page',
    };
    vi.mocked(mockStore.record).mockResolvedValueOnce(record);

    await app.request('/v1/consent', {
      method: 'POST',
      headers: { ...AUTH, 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+15551234567', source: 'checkout_page' }),
    });
    expect(mockStore.record).toHaveBeenCalledWith(
      'user_42',
      '+15551234567',
      'checkout_page',
      null,
    );
  });
});

describe('GET /v1/consent/:phone', () => {
  it('returns 200 with consented true when active consent exists', async () => {
    const record: ConsentRecord = {
      id: 'consent_1',
      user_id: 'user_42',
      phone: '+15551234567',
      consented_at: '2026-04-01T12:00:00.000Z',
      revoked_at: null,
      ip_address: null,
      source: 'opt_in_form',
    };
    vi.mocked(mockStore.check).mockResolvedValueOnce(record);

    const res = await app.request('/v1/consent/+15551234567', {
      method: 'GET',
      headers: AUTH,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.phone).toBe('+15551234567');
    expect(body.consented).toBe(true);
    expect(body.consented_at).toBe('2026-04-01T12:00:00.000Z');
  });

  it('returns 200 with consented false when no consent exists', async () => {
    vi.mocked(mockStore.check).mockResolvedValueOnce(null);

    const res = await app.request('/v1/consent/+15559999999', {
      method: 'GET',
      headers: AUTH,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.phone).toBe('+15559999999');
    expect(body.consented).toBe(false);
  });

  it('passes user_id from auth context to store', async () => {
    vi.mocked(mockStore.check).mockResolvedValueOnce(null);

    await app.request('/v1/consent/+15551234567', {
      method: 'GET',
      headers: AUTH,
    });
    expect(mockStore.check).toHaveBeenCalledWith('user_42', '+15551234567');
  });
});

describe('DELETE /v1/consent/:phone', () => {
  it('returns 200 with status revoked when consent exists', async () => {
    const record: ConsentRecord = {
      id: 'consent_1',
      user_id: 'user_42',
      phone: '+15551234567',
      consented_at: '2026-04-01T12:00:00.000Z',
      revoked_at: '2026-04-01T14:00:00.000Z',
      ip_address: null,
      source: 'opt_in_form',
    };
    vi.mocked(mockStore.revoke).mockResolvedValueOnce(record);

    const res = await app.request('/v1/consent/+15551234567', {
      method: 'DELETE',
      headers: AUTH,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.phone).toBe('+15551234567');
    expect(body.status).toBe('revoked');
    expect(body.revoked_at).toBe('2026-04-01T14:00:00.000Z');
  });

  it('returns 200 with status not_found when no consent exists (idempotent)', async () => {
    vi.mocked(mockStore.revoke).mockResolvedValueOnce(null);

    const res = await app.request('/v1/consent/+15559999999', {
      method: 'DELETE',
      headers: AUTH,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.phone).toBe('+15559999999');
    expect(body.status).toBe('not_found');
  });

  it('passes user_id from auth context to store', async () => {
    vi.mocked(mockStore.revoke).mockResolvedValueOnce(null);

    await app.request('/v1/consent/+15551234567', {
      method: 'DELETE',
      headers: AUTH,
    });
    expect(mockStore.revoke).toHaveBeenCalledWith('user_42', '+15551234567');
  });
});

describe('consent lifecycle: record → revoke → check', () => {
  it('GET returns consented false after consent is revoked', async () => {
    // 1. Record consent
    const recorded: ConsentRecord = {
      id: 'consent_1',
      user_id: 'user_42',
      phone: '+15551234567',
      consented_at: '2026-04-01T12:00:00.000Z',
      revoked_at: null,
      ip_address: null,
      source: 'opt_in_form',
    };
    vi.mocked(mockStore.record).mockResolvedValueOnce(recorded);
    await app.request('/v1/consent', {
      method: 'POST',
      headers: { ...AUTH, 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+15551234567', source: 'opt_in_form' }),
    });

    // 2. Revoke consent
    const revoked: ConsentRecord = {
      ...recorded,
      revoked_at: '2026-04-01T14:00:00.000Z',
    };
    vi.mocked(mockStore.revoke).mockResolvedValueOnce(revoked);
    const revokeRes = await app.request('/v1/consent/+15551234567', {
      method: 'DELETE',
      headers: AUTH,
    });
    expect(revokeRes.status).toBe(200);
    const revokeBody = await revokeRes.json();
    expect(revokeBody.status).toBe('revoked');

    // 3. Check consent — store returns null (revoked = no active consent)
    vi.mocked(mockStore.check).mockResolvedValueOnce(null);
    const checkRes = await app.request('/v1/consent/+15551234567', {
      method: 'GET',
      headers: AUTH,
    });
    expect(checkRes.status).toBe(200);
    const checkBody = await checkRes.json();
    expect(checkBody.phone).toBe('+15551234567');
    expect(checkBody.consented).toBe(false);
  });
});

describe('consent endpoints with unlinked sandbox key (D-292)', () => {
  const unlinkedKey: ApiKeyRecord = {
    ...validKey,
    id: 'key_anon',
    user_id: null,
    raw_key: 'rk_test_anonkey',
  };
  const anonLookup = vi.fn<(keyHash: string) => Promise<ApiKeyRecord | null>>();
  anonLookup.mockResolvedValue(unlinkedKey);
  const anonApp = createApp(anonLookup, mockStore);
  const ANON_AUTH = { Authorization: 'Bearer rk_test_anonkey' };

  it('POST /v1/consent returns 403 sandbox_not_linked', async () => {
    const res = await anonApp.request('/v1/consent', {
      method: 'POST',
      headers: { ...ANON_AUTH, 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+15551234567', source: 'opt_in_form' }),
    });
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error.code).toBe('sandbox_not_linked');
  });

  it('GET /v1/consent/:phone returns 403 sandbox_not_linked', async () => {
    const res = await anonApp.request('/v1/consent/+15551234567', {
      method: 'GET',
      headers: ANON_AUTH,
    });
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error.code).toBe('sandbox_not_linked');
  });

  it('DELETE /v1/consent/:phone returns 403 sandbox_not_linked', async () => {
    const res = await anonApp.request('/v1/consent/+15551234567', {
      method: 'DELETE',
      headers: ANON_AUTH,
    });
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error.code).toBe('sandbox_not_linked');
  });
});
