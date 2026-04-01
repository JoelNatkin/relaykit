import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ApiKeyRecord } from '../types.js';

// Mock Supabase client
const mockInsert = vi.fn();
const mockFrom = vi.fn();

vi.mock('../supabase/client.js', () => ({
  getSupabaseClient: () => ({
    from: mockFrom,
  }),
}));

// Import after mock
const { createApp } = await import('../app.js');

const stubLookup = vi.fn<(keyHash: string) => Promise<ApiKeyRecord | null>>();
stubLookup.mockResolvedValue(null);

const app = createApp(stubLookup);

function post(body: unknown) {
  return app.request('/v1/signup/sandbox', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mockFrom.mockReturnValue({ insert: mockInsert });
  mockInsert.mockResolvedValue({ error: null });
});

describe('POST /v1/signup/sandbox', () => {
  it('returns 201 with api_key starting with rk_sandbox_', async () => {
    const res = await post({ email: 'dev@example.com', phone: '+15551234567' });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.api_key).toMatch(/^rk_sandbox_[0-9a-f]{32}$/);
  });

  it('returns environment: "sandbox"', async () => {
    const res = await post({ email: 'dev@example.com', phone: '+15551234567' });
    const body = await res.json();
    expect(body.environment).toBe('sandbox');
  });

  it('returns 400 when email is missing', async () => {
    const res = await post({ phone: '+15551234567' });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe('invalid_data');
    expect(body.error.message).toContain('email');
  });

  it('returns 400 for invalid email format', async () => {
    const res = await post({ email: 'not-an-email', phone: '+15551234567' });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe('invalid_data');
    expect(body.error.message).toContain('email');
  });

  it('returns 400 when phone is missing', async () => {
    const res = await post({ email: 'dev@example.com' });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe('invalid_data');
    expect(body.error.message).toContain('phone');
  });

  it('returns 400 for invalid phone format (not E.164)', async () => {
    const res = await post({ email: 'dev@example.com', phone: '5551234567' });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe('invalid_data');
    expect(body.error.message).toContain('E.164');
  });

  it('inserts into api_keys with hashed key and raw_key', async () => {
    await post({ email: 'dev@example.com', phone: '+15551234567' });
    expect(mockFrom).toHaveBeenCalledWith('api_keys');
    expect(mockInsert).toHaveBeenCalledTimes(1);
    const inserted = mockInsert.mock.calls[0][0];
    expect(inserted.environment).toBe('sandbox');
    expect(inserted.raw_key).toMatch(/^rk_sandbox_/);
    expect(inserted.key_hash).toBeTruthy();
    expect(inserted.key_hash).not.toBe(inserted.raw_key);
    expect(inserted.key_prefix).toBe(inserted.raw_key.slice(0, 12));
    expect(inserted.status).toBe('active');
  });

  it('returns 500 when Supabase insert fails', async () => {
    mockInsert.mockResolvedValueOnce({ error: { message: 'db error' } });
    const res = await post({ email: 'dev@example.com', phone: '+15551234567' });
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error.code).toBe('signup_failed');
  });

  it('returns 400 for missing request body', async () => {
    const res = await app.request('/v1/signup/sandbox', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '',
    });
    expect(res.status).toBe(400);
  });
});
