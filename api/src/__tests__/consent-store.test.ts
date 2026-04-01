import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the Supabase client module before importing consent-store
const mockFrom = vi.fn();

vi.mock('../supabase/client.js', () => ({
  getSupabaseClient: () => ({
    from: mockFrom,
  }),
}));

// Import after mock is set up
const { createSupabaseConsentStore } = await import('../supabase/consent-store.js');

const baseRecord = {
  id: 'consent-uuid-1',
  user_id: 'user-1',
  phone: '+15005550001',
  consented_at: '2026-01-01T00:00:00Z',
  revoked_at: null,
  ip_address: '1.2.3.4',
  source: 'web-form',
};

describe('createSupabaseConsentStore', () => {
  const store = createSupabaseConsentStore();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- record ---

  it('record: upserts and returns the new consent record', async () => {
    mockFrom.mockReturnValueOnce({
      upsert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: baseRecord, error: null }),
        }),
      }),
    });

    const result = await store.record('user-1', '+15005550001', 'web-form', '1.2.3.4');

    expect(result).toEqual(baseRecord);
    expect(mockFrom).toHaveBeenCalledWith('consent');
  });

  it('record: overwrites revoked consent and returns updated record', async () => {
    const reactivated = { ...baseRecord, revoked_at: null, consented_at: '2026-03-01T00:00:00Z' };

    mockFrom.mockReturnValueOnce({
      upsert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: reactivated, error: null }),
        }),
      }),
    });

    const result = await store.record('user-1', '+15005550001', 'web-form', null);

    expect(result).toEqual(reactivated);
    expect(result.revoked_at).toBeNull();
  });

  // --- check ---

  it('check: returns active consent record when revoked_at is null', async () => {
    mockFrom.mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          eq: () => ({
            is: () => ({
              single: () => Promise.resolve({ data: baseRecord, error: null }),
            }),
          }),
        }),
      }),
    });

    const result = await store.check('user-1', '+15005550001');

    expect(result).toEqual(baseRecord);
    expect(mockFrom).toHaveBeenCalledWith('consent');
  });

  it('check: returns null when consent is revoked or missing', async () => {
    mockFrom.mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          eq: () => ({
            is: () => ({
              single: () => Promise.resolve({ data: null, error: { code: 'PGRST116', message: 'no rows' } }),
            }),
          }),
        }),
      }),
    });

    const result = await store.check('user-1', '+15005550001');

    expect(result).toBeNull();
  });

  // --- revoke ---

  it('revoke: sets revoked_at and returns updated record', async () => {
    const revoked = { ...baseRecord, revoked_at: '2026-04-01T00:00:00Z' };

    mockFrom.mockReturnValueOnce({
      update: () => ({
        eq: () => ({
          eq: () => ({
            is: () => ({
              select: () => ({
                single: () => Promise.resolve({ data: revoked, error: null }),
              }),
            }),
          }),
        }),
      }),
    });

    const result = await store.revoke('user-1', '+15005550001');

    expect(result).toEqual(revoked);
    expect(result?.revoked_at).not.toBeNull();
  });

  it('revoke: returns null when no active consent exists to revoke', async () => {
    mockFrom.mockReturnValueOnce({
      update: () => ({
        eq: () => ({
          eq: () => ({
            is: () => ({
              select: () => ({
                single: () => Promise.resolve({ data: null, error: { code: 'PGRST116', message: 'no rows' } }),
              }),
            }),
          }),
        }),
      }),
    });

    const result = await store.revoke('user-1', '+15005550099');

    expect(result).toBeNull();
  });
});
