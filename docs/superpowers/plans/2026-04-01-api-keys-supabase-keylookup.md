# API Keys Table + Supabase KeyLookup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the `api_keys` database table and wire a real Supabase-backed `KeyLookup` into the API server, replacing the stub.

**Architecture:** The API server (`/api`) uses dependency injection — `createApp(lookup, consentStore?)` accepts a `KeyLookup` function. We'll add a Supabase client module, implement a real lookup that queries `api_keys`, and conditionally wire it in `index.ts` (falling back to the stub when `SUPABASE_URL` is unset so tests still work without Supabase).

**Tech Stack:** Supabase (Postgres), `@supabase/supabase-js`, Hono, Vitest

---

## File Structure

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `api/supabase/migrations/001_api_keys.sql` | DDL for `api_keys` table + indexes |
| Modify | `api/src/types.ts` | Fix `environment` union to `'sandbox' \| 'live'`, add `status`, `last_used_at`, `label` fields |
| Modify | `api/src/middleware/auth.ts` | Update `environment` type usage (already reads from record) |
| Create | `api/src/supabase/client.ts` | Initialize Supabase service-role client from env vars |
| Create | `api/src/supabase/key-lookup.ts` | Real `KeyLookup` implementation: hash, query, update `last_used_at` |
| Modify | `api/src/index.ts` | Conditionally import real lookup when `SUPABASE_URL` is set |
| Modify | `api/src/app.ts` | Update `AppVariables` environment type reference |
| Create | `api/src/__tests__/key-lookup.test.ts` | Tests for lookup with mocked Supabase client |
| Modify | `api/src/__tests__/auth.test.ts` | Update mock records to use `'live'` instead of `'production'` and include new fields |
| Modify | `api/package.json` | Add `@supabase/supabase-js` dependency |

---

## Task 1: Database Migration

**Files:**
- Create: `api/supabase/migrations/001_api_keys.sql`

- [ ] **Step 1: Create migration file**

```sql
-- api/supabase/migrations/001_api_keys.sql
-- API key storage for RelayKit API server (D-285)
-- Keys are SHA-256 hashed, environment-prefixed (rk_sandbox_, rk_live_), shown once at creation.

CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES customers(id),
  key_hash TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL,
  environment TEXT NOT NULL CHECK (environment IN ('sandbox', 'live')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  label TEXT
);

CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_user ON api_keys(user_id);
```

- [ ] **Step 2: Run migration against Supabase**

Run:
```bash
cd /Users/macbookpro/relaykit
npx supabase db push --db-url "$(grep SUPABASE_DB_URL .env | cut -d= -f2)" 2>/dev/null || \
  node -e "
    const { createClient } = require('@supabase/supabase-js');
    const fs = require('fs');
    const sql = fs.readFileSync('api/supabase/migrations/001_api_keys.sql', 'utf8');
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(url, key);
    supabase.rpc('exec_sql', { sql }).then(r => console.log(r));
  "
```

If neither approach works, run the SQL directly via the Supabase MCP `execute_sql` tool or the Supabase dashboard SQL editor. Verify with:

```bash
npx tsx -e "
  import { createClient } from '@supabase/supabase-js';
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data, error } = await supabase.from('api_keys').select('id').limit(1);
  console.log('api_keys accessible:', error === null, 'error:', error);
"
```

Expected: `api_keys accessible: true error: null`

- [ ] **Step 3: Commit**

```bash
git add api/supabase/migrations/001_api_keys.sql
git commit -m "chore(api): add api_keys table migration (D-285)"
```

---

## Task 2: Update TypeScript Types

**Files:**
- Modify: `api/src/types.ts`

The current `ApiKeyRecord` has `environment: 'sandbox' | 'production'` which doesn't match the DB schema (`'sandbox' | 'live'`). It also lacks `status`, `last_used_at`, and `label` columns.

- [ ] **Step 1: Update ApiKeyRecord and AppVariables types**

In `api/src/types.ts`, replace:

```typescript
export interface ApiKeyRecord {
  id: string;
  user_id: string;
  key_hash: string;
  key_prefix: string;
  environment: 'sandbox' | 'production';
  created_at: string;
  revoked_at: string | null;
}
```

with:

```typescript
export interface ApiKeyRecord {
  id: string;
  user_id: string;
  key_hash: string;
  key_prefix: string;
  environment: 'sandbox' | 'live';
  status: 'active' | 'revoked';
  created_at: string;
  revoked_at: string | null;
  last_used_at: string | null;
  label: string | null;
}
```

Also replace:

```typescript
export type AppVariables = {
  user_id: string;
  environment: 'sandbox' | 'production';
};
```

with:

```typescript
export type AppVariables = {
  user_id: string;
  environment: 'sandbox' | 'live';
};
```

- [ ] **Step 2: Fix auth test mock records**

In `api/src/__tests__/auth.test.ts`, every mock `ApiKeyRecord` needs `status`, `last_used_at`, and `label` fields added, and `environment` values that were `'production'` changed to `'live'`. There are two mock records. Update the one at line 58:

```typescript
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
});
```

And the one at line 78:

```typescript
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
});
```

- [ ] **Step 3: Run typecheck and tests**

Run: `cd /Users/macbookpro/relaykit/api && npx tsc --noEmit && npx vitest run`

Expected: All 50 tests pass, no type errors.

- [ ] **Step 4: Commit**

```bash
cd /Users/macbookpro/relaykit/api
git add src/types.ts src/__tests__/auth.test.ts
git commit -m "fix(api): align ApiKeyRecord with DB schema — environment 'live' not 'production', add status/last_used_at/label"
```

---

## Task 3: Add Supabase Dependency

**Files:**
- Modify: `api/package.json`

- [ ] **Step 1: Install @supabase/supabase-js**

Run:
```bash
cd /Users/macbookpro/relaykit/api && npm install @supabase/supabase-js
```

Expected: Package installs successfully, added to `dependencies` in `package.json`.

- [ ] **Step 2: Commit**

```bash
cd /Users/macbookpro/relaykit/api
git add package.json package-lock.json
git commit -m "chore(api): add @supabase/supabase-js dependency"
```

---

## Task 4: Supabase Client Module

**Files:**
- Create: `api/src/supabase/client.ts`

- [ ] **Step 1: Create the client module**

```typescript
// api/src/supabase/client.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) or SUPABASE_SERVICE_ROLE_KEY');
  }

  client = createClient(url, key);
  return client;
}
```

Note: Accepts both `SUPABASE_URL` (preferred for API server) and `NEXT_PUBLIC_SUPABASE_URL` (existing .env key from Next.js app) so it works with the current `.env` without changes.

- [ ] **Step 2: Run typecheck**

Run: `cd /Users/macbookpro/relaykit/api && npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/macbookpro/relaykit/api
git add src/supabase/client.ts
git commit -m "feat(api): add Supabase client module with env var initialization"
```

---

## Task 5: Real KeyLookup Implementation (TDD)

**Files:**
- Create: `api/src/__tests__/key-lookup.test.ts`
- Create: `api/src/supabase/key-lookup.ts`

- [ ] **Step 1: Write the failing tests**

Create `api/src/__tests__/key-lookup.test.ts`:

```typescript
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /Users/macbookpro/relaykit/api && npx vitest run src/__tests__/key-lookup.test.ts`

Expected: FAIL — module `../supabase/key-lookup.js` does not export `createSupabaseKeyLookup`.

- [ ] **Step 3: Write the implementation**

Create `api/src/supabase/key-lookup.ts`:

```typescript
// api/src/supabase/key-lookup.ts
import { getSupabaseClient } from './client.js';
import type { ApiKeyRecord } from '../types.js';
import type { KeyLookup } from '../app.js';

export function createSupabaseKeyLookup(): KeyLookup {
  return async (keyHash: string): Promise<ApiKeyRecord | null> => {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('api_keys')
      .select('id, user_id, key_hash, key_prefix, environment, status, created_at, revoked_at, last_used_at, label')
      .eq('key_hash', keyHash)
      .eq('status', 'active')
      .single();

    if (error || !data) {
      return null;
    }

    // Fire-and-forget: update last_used_at timestamp
    supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', data.id)
      .then(() => {});

    return data as ApiKeyRecord;
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd /Users/macbookpro/relaykit/api && npx vitest run src/__tests__/key-lookup.test.ts`

Expected: All 4 tests pass.

- [ ] **Step 5: Run full test suite**

Run: `cd /Users/macbookpro/relaykit/api && npx vitest run`

Expected: All tests pass (50 existing + 4 new = 54).

- [ ] **Step 6: Commit**

```bash
cd /Users/macbookpro/relaykit/api
git add src/supabase/key-lookup.ts src/__tests__/key-lookup.test.ts
git commit -m "feat(api): implement Supabase KeyLookup with last_used_at tracking (D-285)"
```

---

## Task 6: Wire Real Lookup into Server

**Files:**
- Modify: `api/src/index.ts`

- [ ] **Step 1: Update index.ts to conditionally use real lookup**

Replace the entire contents of `api/src/index.ts` with:

```typescript
import { serve } from '@hono/node-server';
import { createApp } from './app.js';
import { createSupabaseKeyLookup } from './supabase/key-lookup.js';

const port = 3002;

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const lookup = supabaseUrl && supabaseKey
  ? createSupabaseKeyLookup()
  : () => Promise.resolve(null);

const app = createApp(lookup);

serve({ fetch: app.fetch, port }, () => {
  const mode = supabaseUrl && supabaseKey ? 'supabase' : 'stub (no SUPABASE_URL)';
  console.log(`RelayKit API running on port ${port} [auth: ${mode}]`);
});
```

- [ ] **Step 2: Update app.ts default export**

The `app.ts` file exports a default `app` instance using the stub lookup. This is only used by `index.ts` (which we just changed) and potentially by tests. Tests use `createApp()` directly with their own mocks, so the default export is now unused. Remove it.

In `api/src/app.ts`, remove the last two lines:

```typescript
// Default app instance with a stub lookup for dev/health-check use
export const app = createApp(() => Promise.resolve(null));
```

- [ ] **Step 3: Run typecheck**

Run: `cd /Users/macbookpro/relaykit/api && npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 4: Run full test suite**

Run: `cd /Users/macbookpro/relaykit/api && npx vitest run`

Expected: All 54 tests pass. Tests don't import `index.ts` — they use `createApp()` directly.

- [ ] **Step 5: Commit**

```bash
cd /Users/macbookpro/relaykit/api
git add src/index.ts src/app.ts
git commit -m "feat(api): wire Supabase KeyLookup into server, fall back to stub without env vars"
```

---

## Task 7: Quality Gate

- [ ] **Step 1: Run typecheck**

Run: `cd /Users/macbookpro/relaykit/api && npx tsc --noEmit`

Expected: Clean — no errors.

- [ ] **Step 2: Run linter**

Run: `cd /Users/macbookpro/relaykit/api && npx eslint src/`

Expected: Clean — no warnings or errors.

- [ ] **Step 3: Run full test suite**

Run: `cd /Users/macbookpro/relaykit/api && npx vitest run`

Expected: 54 tests passing.

- [ ] **Step 4: Verify Supabase table exists**

Run:
```bash
cd /Users/macbookpro/relaykit && npx tsx -e "
  import { createClient } from '@supabase/supabase-js';
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data, error } = await supabase.from('api_keys').select('id').limit(1);
  console.log('api_keys table:', error ? 'ERROR: ' + error.message : 'OK (accessible)');
"
```

Expected: `api_keys table: OK (accessible)`

- [ ] **Step 5: End-of-task restart**

```bash
cd /Users/macbookpro/relaykit && rm -rf .next && npm run dev
```

Verify dev server starts. Stop it. Done.
