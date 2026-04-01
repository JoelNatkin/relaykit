# CC_HANDOFF.md — Session Handoff
**Date:** 2026-04-01 (Supabase integration — api_keys + consent tables, real KeyLookup + ConsentStore)
**Branch:** main

---

## Commits This Session

```
abeb637  chore(api): add api_keys table migration (D-285)
7718d19  fix(api): align ApiKeyRecord with DB schema — environment 'live' not 'production', add status/last_used_at/label
7c2eb58  chore(api): add @supabase/supabase-js dependency
8c83da0  feat(api): add Supabase client module with env var initialization
05a8c6e  feat(api): implement Supabase KeyLookup with last_used_at tracking (D-285)
3755246  feat(api): wire Supabase KeyLookup into server, fall back to stub without env vars
a333dd5  fix(api): resolve eslint unused-vars in key-lookup tests
3ce374c  chore(api): add consent table migration (D-252, D-253)
a786fbd  feat(api): implement Supabase ConsentStore with upsert and revocation (D-252)
f7c3275  feat(api): wire Supabase ConsentStore into server
```

---

## What We Completed

### api_keys Table + Real KeyLookup
- Created `api_keys` table in Supabase with SHA-256 hashed keys, environment prefix (`rk_sandbox_`, `rk_live_`), status tracking, and `last_used_at` timestamp.
- Fixed `ApiKeyRecord` type: `environment` changed from `'sandbox' | 'production'` to `'sandbox' | 'live'` to match DB schema. Added `status`, `last_used_at`, `label` fields.
- Implemented `createSupabaseKeyLookup()` — queries `api_keys` where `key_hash` matches AND `status = 'active'`, fires non-blocking `last_used_at` update on hit.
- Added `@supabase/supabase-js` as dependency in `/api`.
- Created shared Supabase client singleton (`getSupabaseClient()`) that accepts both `SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL`.
- 4 new tests covering: valid key lookup, missing key, revoked key, `last_used_at` update.

### consent Table + Real ConsentStore
- Created `consent` table in Supabase with `UNIQUE(user_id, phone)` constraint — one consent record per phone per customer.
- Implemented `createSupabaseConsentStore()` with three methods:
  - `record()`: UPSERT on `(user_id, phone)`. Re-consenting clears `revoked_at` and updates `consented_at`, `source`, `ip_address`.
  - `check()`: SELECT where `revoked_at IS NULL`. Returns record or null.
  - `revoke()`: UPDATE sets `revoked_at` only on active consent. Returns updated record or null.
- 6 new tests covering all ConsentStore methods.

### Server Wiring
- `index.ts` conditionally creates real KeyLookup + ConsentStore when `SUPABASE_URL` (or `NEXT_PUBLIC_SUPABASE_URL`) and `SUPABASE_SERVICE_ROLE_KEY` are present.
- Falls back to stub lookup (all requests 401) and no consent routes when env vars are missing — tests work without Supabase.
- Startup log reports auth mode: `[auth: supabase]` or `[auth: stub (no SUPABASE_URL)]`.
- Removed default `app` export from `app.ts` — `index.ts` now creates its own app instance.

### Implementation Plan
- Created `docs/superpowers/plans/2026-04-01-api-keys-supabase-keylookup.md` — full 7-task plan used for the api_keys implementation. Untracked (not committed).

---

## Quality Checks Passed

- `tsc --noEmit` — clean (`/api`)
- `eslint src/` — clean (`/api`)
- `vitest run` — 60 tests passing across 8 test files (`/api`)
- Both `api_keys` and `consent` tables verified accessible via Supabase JS client

---

## In Progress / Partially Done

### Sinch Carrier Integration
POST /v1/messages still logs to console instead of sending via Sinch. The msg_ ID and response contract are ready — just needs the carrier send call.

### Custom Messages
`namespace: "custom", event: "send"` returns 422 "not yet supported". Placeholder for D-280 (website authoring surface).

### Experience Principles File Rename
`V4_EXPERIENCE_PRINCIPLES_v1.1.md` exists as untracked file. Original still tracked. CLAUDE.md references point to original. Needs Joel decision.

---

## Gotchas for Next Session

1. **Delete `.next` before every dev server start** (prototype). API server has no `.next` — it uses tsx directly.

2. **API server runs on port 3002.** Prototype is port 3001, Next.js dev is default port 3000.

3. **`createApp()` takes two params.** `createApp(lookup, consentStore?)` — the consent store is optional. Tests that don't need consent pass only the lookup.

4. **`index.ts` creates its own app instance now.** The default `app` export was removed from `app.ts`. Tests use `createApp()` directly with mocks.

5. **`hasSupabase` guard in `index.ts`.** Both KeyLookup and ConsentStore are created behind the same `Boolean(supabaseUrl && supabaseKey)` check. Without env vars, the server runs with stub auth (all 401) and no consent routes.

6. **Environment type is `'sandbox' | 'live'`, not `'production'`.** This was fixed this session to match the DB schema. All test mocks updated.

7. **Consent UPSERT on `(user_id, phone)`.** Re-recording consent for an existing phone clears `revoked_at` — this is intentional. The DB UNIQUE constraint enforces one record per user+phone.

8. **DELETE /v1/consent is idempotent.** Returns 200 with `status: "not_found"` when no active consent exists — NOT 404. Privacy reasoning.

9. **Fire-and-forget `last_used_at` on KeyLookup.** The update is non-blocking (`.then(() => {})`) — doesn't slow down auth. If it fails silently, that's acceptable.

10. **SDK and API are sibling directories at repo root.** `/sdk` and `/api` — separate package.json, separate node_modules, separate test suites. Run tests from the correct directory.

11. **Two Experience Principles files still exist.** Original tracked, v1.1 untracked. Resolve before writing new copy.

12. **`api/node_modules/` and `docs/superpowers/plans/` are untracked.** Both expected — `node_modules` is gitignored, plans directory is new.

13. **Supabase MCP has permission issues.** The MCP OAuth scope didn't include write access to this project's database. Migrations were run manually via the Supabase dashboard SQL editor. This may need fixing for future sessions.

---

## Files Modified This Session

```
# API keys — migration + implementation
api/supabase/migrations/001_api_keys.sql          # NEW — api_keys DDL
api/src/types.ts                                   # MODIFIED — environment 'live', added fields
api/src/app.ts                                     # MODIFIED — removed default app export
api/src/index.ts                                   # MODIFIED — conditional Supabase wiring
api/src/supabase/client.ts                         # NEW — shared Supabase client singleton
api/src/supabase/key-lookup.ts                     # NEW — real KeyLookup implementation
api/src/__tests__/key-lookup.test.ts               # NEW — 4 tests
api/src/__tests__/auth.test.ts                     # MODIFIED — updated mock records
api/src/__tests__/consent.test.ts                  # MODIFIED — updated mock records
api/src/__tests__/messages.test.ts                 # MODIFIED — updated mock records
api/src/__tests__/preview.test.ts                  # MODIFIED — updated mock records
api/src/__tests__/health.test.ts                   # MODIFIED — uses createApp() directly
api/package.json                                   # MODIFIED — added @supabase/supabase-js
api/package-lock.json                              # MODIFIED — updated

# Consent — migration + implementation
api/supabase/migrations/002_consent.sql            # NEW — consent DDL
api/src/supabase/consent-store.ts                  # NEW — real ConsentStore implementation
api/src/__tests__/consent-store.test.ts            # NEW — 6 tests

# Plans (untracked)
docs/superpowers/plans/2026-04-01-api-keys-supabase-keylookup.md  # NEW — implementation plan

# Session docs
CC_HANDOFF.md                                      # This file (overwritten)
```

---

## What's Next (suggested order)

1. **Sinch carrier integration** — Replace console.log stub in POST /v1/messages with real Sinch API call. Wire msg_ ID as correlation ID. D-271 (Sinch account created).
2. **Sandbox signup flow** — API key creation endpoint or dashboard integration. Key shown once, hashed with SHA-256 for storage (D-285).
3. **SDK → API server wiring** — Point SDK's fetch calls at the real API server. Verify end-to-end: `npm install relaykit` → `new RelayKit()` → `sendConfirmation()` → real text message.
4. **Experience Principles file resolution** — Decide on v1.0 vs v1.1, update CLAUDE.md references.
5. **Remaining prototype work** — Category landing vocabulary (D-254), "two files" copy removal (D-257), compliance attention section (D-243).
