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
  it('returns 201 with api_key starting with rk_sandbox_ on empty body', async () => {
    const res = await post({});
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.api_key).toMatch(/^rk_sandbox_[0-9a-f]{32}$/);
  });

  it('returns environment: "sandbox"', async () => {
    const res = await post({});
    const body = await res.json();
    expect(body.environment).toBe('sandbox');
  });

  it('inserts into api_keys with hashed key and raw_key', async () => {
    await post({});
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
    const res = await post({});
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
