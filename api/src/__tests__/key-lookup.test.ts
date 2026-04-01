import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createHash } from 'node:crypto';

// Mock the Supabase client module before importing key-lookup
const mockSelect = vi.fn();
const mockUpdate = vi.fn();
const mockFrom = vi.fn();

vi.mock('../supabase/client.js', () => ({
  getSupabaseClient: () => ({
    from: mockFrom,
  }),
}));

// Import after mock is set up
const { createSupabaseKeyLookup } = await import('../supabase/key-lookup.js');

function hashKey(raw: string): string {
  return createHash('sha256').update(raw).digest('hex');
}

describe('createSupabaseKeyLookup', () => {
  const lookup = createSupabaseKeyLookup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the record when key_hash matches an active key', async () => {
    const record = {
      id: 'uuid-1',
      user_id: 'user-1',
      key_hash: hashKey('rk_sandbox_abc123'),
      key_prefix: 'rk_sand',
      environment: 'sandbox' as const,
      status: 'active' as const,
      created_at: '2026-01-01T00:00:00Z',
      revoked_at: null,
      last_used_at: null,
      label: 'My test key',
    };

    // SELECT query
    mockFrom.mockReturnValueOnce({
      select: () => ({
        eq: (col: string, val: string) => ({
          eq: () => ({
            single: () => Promise.resolve({ data: record, error: null }),
          }),
        }),
      }),
    });

    // UPDATE query for last_used_at
    mockFrom.mockReturnValueOnce({
      update: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
    });

    const result = await lookup(hashKey('rk_sandbox_abc123'));

    expect(result).toEqual(record);
    expect(mockFrom).toHaveBeenCalledWith('api_keys');
    // Verify last_used_at update was triggered
    expect(mockFrom).toHaveBeenCalledTimes(2);
  });

  it('returns null when no key matches', async () => {
    mockFrom.mockReturnValueOnce({
      select: () => ({
        eq: (col: string, val: string) => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
      }),
    });

    const result = await lookup(hashKey('rk_sandbox_nonexistent'));

    expect(result).toBeNull();
    // No update call when key not found
    expect(mockFrom).toHaveBeenCalledTimes(1);
  });

  it('returns null when key exists but status is revoked', async () => {
    // The query filters by status = 'active', so a revoked key returns no rows
    mockFrom.mockReturnValueOnce({
      select: () => ({
        eq: (col: string, val: string) => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
      }),
    });

    const result = await lookup(hashKey('rk_sandbox_revokedkey'));

    expect(result).toBeNull();
    expect(mockFrom).toHaveBeenCalledTimes(1);
  });

  it('fires a last_used_at update on successful lookup', async () => {
    const record = {
      id: 'uuid-2',
      user_id: 'user-2',
      key_hash: hashKey('rk_live_livekey'),
      key_prefix: 'rk_live',
      environment: 'live' as const,
      status: 'active' as const,
      created_at: '2026-02-01T00:00:00Z',
      revoked_at: null,
      last_used_at: '2026-03-01T00:00:00Z',
      label: null,
    };

    let updateCalledWith: Record<string, unknown> = {};
    let updateFilteredById = '';

    mockFrom.mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: record, error: null }),
          }),
        }),
      }),
    });

    mockFrom.mockReturnValueOnce({
      update: (data: Record<string, unknown>) => {
        updateCalledWith = data;
        return {
          eq: (col: string, val: string) => {
            updateFilteredById = val;
            return Promise.resolve({ error: null });
          },
        };
      },
    });

    await lookup(hashKey('rk_live_livekey'));

    expect(updateCalledWith).toHaveProperty('last_used_at');
    expect(typeof updateCalledWith.last_used_at).toBe('string');
    expect(updateFilteredById).toBe('uuid-2');
  });
});
