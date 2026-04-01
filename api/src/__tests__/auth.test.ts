import { createHash } from 'node:crypto';
import { describe, it, expect, vi } from 'vitest';
import { Hono } from 'hono';
import { createAuthMiddleware } from '../middleware/auth.js';
import type { ApiKeyRecord, AppVariables } from '../types.js';

function buildApp(lookup: (keyHash: string) => Promise<ApiKeyRecord | null>) {
  const app = new Hono<{ Variables: AppVariables }>();
  const auth = createAuthMiddleware(lookup);
  app.use('/v1/*', auth);
  app.post('/v1/messages', (c) => {
    return c.json({ user_id: c.get('user_id'), environment: c.get('environment') });
  });
  return app;
}

const mockLookup = vi.fn<(keyHash: string) => Promise<ApiKeyRecord | null>>();

describe('auth middleware', () => {
  it('returns 401 when Authorization header is missing', async () => {
    const app = buildApp(mockLookup);
    const res = await app.request('/v1/messages', { method: 'POST' });
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toEqual({
      error: { code: 'invalid_api_key', message: 'Missing or invalid API key' },
    });
  });

  it('returns 401 when Authorization header does not start with Bearer', async () => {
    const app = buildApp(mockLookup);
    const res = await app.request('/v1/messages', {
      method: 'POST',
      headers: { Authorization: 'Basic abc123' },
    });
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toEqual({
      error: { code: 'invalid_api_key', message: 'Missing or invalid API key' },
    });
  });

  it('returns 401 when Bearer token does not match any record', async () => {
    mockLookup.mockResolvedValueOnce(null);
    const app = buildApp(mockLookup);
    const res = await app.request('/v1/messages', {
      method: 'POST',
      headers: { Authorization: 'Bearer rk_sandbox_fakekeyvalue' },
    });
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toEqual({
      error: { code: 'invalid_api_key', message: 'Missing or invalid API key' },
    });
  });

  it('passes request through and sets context for valid Bearer token', async () => {
    mockLookup.mockResolvedValueOnce({
      id: 'key_1',
      user_id: 'user_42',
      key_hash: 'doesntmatter',
      key_prefix: 'rk_sandbox_ab',
      environment: 'sandbox',
      status: 'active',
      created_at: '2026-01-01T00:00:00Z',
      revoked_at: null,
      last_used_at: null,
      label: null,
      raw_key: null,
    });
    const app = buildApp(mockLookup);
    const res = await app.request('/v1/messages', {
      method: 'POST',
      headers: { Authorization: 'Bearer rk_sandbox_validkey123' },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ user_id: 'user_42', environment: 'sandbox' });
  });

  it('returns 401 when Bearer token matches a revoked key', async () => {
    mockLookup.mockResolvedValueOnce({
      id: 'key_1',
      user_id: 'user_1',
      key_hash: 'doesntmatter',
      key_prefix: 'rk_sandbox_ab',
      environment: 'sandbox',
      status: 'active',
      created_at: '2026-01-01T00:00:00Z',
      revoked_at: '2026-03-15T00:00:00Z',
      last_used_at: null,
      label: null,
      raw_key: null,
    });
    const app = buildApp(mockLookup);
    const res = await app.request('/v1/messages', {
      method: 'POST',
      headers: { Authorization: 'Bearer rk_sandbox_revokedkey' },
    });
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toEqual({
      error: { code: 'invalid_api_key', message: 'Missing or invalid API key' },
    });
  });

  it('sets user_id to null for sandbox keys with no linked customer (D-292)', async () => {
    mockLookup.mockResolvedValueOnce({
      id: 'key_anon',
      user_id: null,
      key_hash: 'doesntmatter',
      key_prefix: 'rk_sandbox_ab',
      environment: 'sandbox',
      status: 'active',
      created_at: '2026-01-01T00:00:00Z',
      revoked_at: null,
      last_used_at: null,
      label: null,
      raw_key: 'rk_sandbox_abc123',
    });
    const app = buildApp(mockLookup);
    const res = await app.request('/v1/messages', {
      method: 'POST',
      headers: { Authorization: 'Bearer rk_sandbox_abc123' },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ user_id: null, environment: 'sandbox' });
  });

  it('hashes the key before calling lookup (lookup receives SHA-256 hash, not raw key)', async () => {
    const rawKey = 'rk_sandbox_testkey999';
    const expectedHash = createHash('sha256').update(rawKey).digest('hex');
    mockLookup.mockResolvedValueOnce(null);
    const app = buildApp(mockLookup);
    await app.request('/v1/messages', {
      method: 'POST',
      headers: { Authorization: `Bearer ${rawKey}` },
    });
    expect(mockLookup).toHaveBeenCalledWith(expectedHash);
  });
});
