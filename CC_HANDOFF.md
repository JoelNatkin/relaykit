# CC_HANDOFF.md — Session Handoff
**Date:** 2026-04-02 (Sandbox signup endpoint, D-291–D-299, PRD/pricing/CLAUDE.md updates)
**Branch:** main

---

## Commits This Session

```
e95b30c  docs: record D-291 — raw_key column for sandbox API keys
c744d93  chore(api): add raw_key column migration (D-291)
ba6ea37  fix(api): add raw_key to ApiKeyRecord type (D-291)
48e419c  feat(api): POST /v1/signup/sandbox — sandbox API key creation (D-285, D-291)
e864905  test(api): signup endpoint validation and happy path
676940c  fix(api): simplify signup endpoint — remove email/phone, add error logging
be1f07d  docs: record D-292 — nullable user_id for sandbox API keys
d199799  feat(api): nullable user_id for sandbox keys with CHECK constraint (D-292)
68346c4  fix(api): auth middleware and consent guards for nullable user_id (D-292)
919919a  docs: record D-293–D-299 (original D-294 — bundled marketing)
53a6755  docs: add supersedes notes to D-15, D-37, D-89, D-242, D-19 index entry
a2c5767  docs: update consolidated PRD for D-293–D-299 (original D-294)
e56dc3f  docs: update PRICING_MODEL.md v5.0 (original D-294)
db295e8  docs: record D-293–D-299 (REVISED D-294 — smart marketing registration)
beee173  docs: update consolidated PRD for D-293–D-299 (revised D-294)
7da4d86  docs: update PRICING_MODEL.md v5.0 (revised D-294)
c20040f  docs: update CLAUDE.md to reference Voice & Product Principles v2.0
```

---

## What We Completed

### Sandbox Signup Endpoint (POST /v1/signup/sandbox)
- Migration 003: `raw_key` column on `api_keys` with CHECK constraint (sandbox NOT NULL, live NULL) — D-291
- Migration 004: `user_id` DROP NOT NULL with CHECK (sandbox allows NULL, live requires NOT NULL) — D-292
- `POST /v1/signup/sandbox` — public endpoint (no auth required), accepts `{}`, generates `rk_sandbox_` + 32 hex chars, SHA-256 hashes, inserts with `user_id: null` and `raw_key: <plaintext>`, returns key + environment + message
- Auth middleware: `user_id` flows as `string | null`; `AppVariables.user_id` is `string | null`
- Consent route guards: all three handlers (record/check/revoke) return 403 `sandbox_not_linked` when `user_id` is null
- Messages handler: unchanged — sandbox keys with null user_id can send test messages
- 69 tests passing across 9 test files

### Decisions D-291 through D-299
- **D-291:** Sandbox API keys store `raw_key` for dashboard re-display
- **D-292:** Sandbox API keys allow NULL `user_id`, live keys require it
- **D-293:** Compliance enforcement collapses to authoring time; runtime enforcement removed
- **D-294:** Marketing available from day one; smart registration (auto-submit if used in sandbox), on-demand activation, $19/$29 monthly tiers
- **D-295:** Remove marketing upsell cards from dashboard
- **D-296:** SDK and raw API are equal entry points
- **D-297:** No-code vibe coders are an unserved market
- **D-298:** Free tier sends to verified phones only
- **D-299:** New tables use `project_id` as ownership key

### Supersedes Notes Added
- D-15: superseded by D-294 (smart marketing registration)
- D-19: reframed by D-293 (authoring time, not send time)
- D-37: superseded by D-294
- D-89: superseded by D-294 (conditional both-campaign submission)
- D-242: superseded by D-293 (runtime enforcement removed)

### Document Updates
- **RELAYKIT_PRD_CONSOLIDATED.md** — v April 2, 2026. Compliance collapse, smart marketing, SDK+API equal paths, $19/$29 tiers, no-code audience, verified-only sandbox
- **PRICING_MODEL.md** — v5.0. Two monthly tiers ($19/$29), smart registration economics, recalculated unit economics ($29 fixes the 4% margin → 36%), marketing LTV rows, `marketing_active` boolean in DB schema, subscription lifecycle with marketing activate/deactivate
- **CLAUDE.md** — Voice doc references updated: `V4_EXPERIENCE_PRINCIPLES_v1.1.md` → `VOICE_AND_PRODUCT_PRINCIPLES_v2.md` (5 references)

### BACKLOG.md Addition
- Rate limiting on `POST /v1/signup/sandbox` — public endpoint needs rate limiting before launch

---

## Quality Checks Passed

- `tsc --noEmit` — clean (`/api`)
- `eslint src/` — clean (`/api`)
- `vitest run` — 69 tests passing across 9 test files (`/api`)

---

## In Progress / Partially Done

### Sinch Carrier Integration
POST /v1/messages still logs to console instead of sending via Sinch. The msg_ ID and response contract are ready — just needs the carrier send call.

### Custom Messages
`namespace: "custom", event: "send"` returns 422 "not yet supported". Placeholder for D-280 (website authoring surface).

### Voice & Product Principles File
`VOICE_AND_PRODUCT_PRINCIPLES_v2.md` exists as untracked file. `V4_EXPERIENCE_PRINCIPLES_v1.1.md` shows as deleted in git status but the archive copy exists at `docs/archive/V4_EXPERIENCE_PRINCIPLES_v1.1.md`. CLAUDE.md references now point to the v2 file. Need to `git add` the new file and archive move, and `git rm` the old file.

### D-294 Revision History
D-294 was revised mid-session. The original version ("bundled marketing, both always submit") was recorded, propagated to PRD and pricing, then replaced with the revised version ("smart registration, on-demand activation, $19/$29 tiers"). Both PRD and pricing were updated twice — the final versions reflect the revised D-294. Commits 919919a/a2c5767/e56dc3f contain the original; db295e8/beee173/7da4d86 contain the revision.

---

## Gotchas for Next Session

1. **Delete `.next` before every dev server start** (prototype). API server has no `.next` — it uses tsx directly.

2. **API server runs on port 3002.** Prototype is port 3001, Next.js dev is default port 3000.

3. **`createApp()` takes two params.** `createApp(lookup, consentStore?)` — the consent store is optional. Tests that don't need consent pass only the lookup.

4. **`index.ts` creates its own app instance.** The default `app` export was removed from `app.ts`. Tests use `createApp()` directly with mocks.

5. **`hasSupabase` guard in `index.ts`.** Both KeyLookup and ConsentStore are created behind the same `Boolean(supabaseUrl && supabaseKey)` check. Without env vars, the server runs with stub auth (all 401) and no consent routes.

6. **Environment type is `'sandbox' | 'live'`, not `'production'`.** Fixed in previous session.

7. **`user_id` is `string | null` everywhere (D-292).** `ApiKeyRecord.user_id`, `AppVariables.user_id` are both `string | null`. Auth middleware passes `null` through for unlinked sandbox keys. Consent endpoints return 403 `sandbox_not_linked` when null.

8. **Signup endpoint is PUBLIC.** `POST /v1/signup/sandbox` is mounted on the main `app` before the auth middleware sub-router. It accepts `{}` and returns a sandbox key. No rate limiting yet — in BACKLOG.md.

9. **`api_keys` table has FK on `user_id` to `customers(id)`.** The FK is preserved but `user_id` is nullable for sandbox keys (D-292). Live keys still require a valid `customers` reference.

10. **Consent UPSERT on `(user_id, phone)`.** Re-recording consent for an existing phone clears `revoked_at`.

11. **DELETE /v1/consent is idempotent.** Returns 200 with `status: "not_found"` — NOT 404.

12. **Fire-and-forget `last_used_at` on KeyLookup.** Non-blocking, silent failure acceptable.

13. **SDK and API are sibling directories at repo root.** `/sdk` and `/api` — separate package.json, separate node_modules, separate test suites.

14. **Voice doc files in transition.** `VOICE_AND_PRODUCT_PRINCIPLES_v2.md` is untracked. Old file shows as deleted. Archive copy exists. Needs cleanup commit.

15. **Supabase MCP had permission issues last session.** Migrations were run manually via dashboard SQL editor. May need fixing.

16. **`STARTER_KIT_PROGRAM.md` is untracked.** New doc from this or previous session, not yet committed.

17. **Migrations 003 and 004 need to be run in Supabase.** `003_raw_key.sql` (ADD COLUMN raw_key + CHECK) and `004_nullable_user_id.sql` (DROP NOT NULL + CHECK) are committed but may not be applied to the live database yet. Run via Supabase dashboard SQL editor if MCP permissions aren't fixed.

---

## Files Modified This Session

```
# Migrations
api/supabase/migrations/003_raw_key.sql               # NEW — raw_key column (D-291)
api/supabase/migrations/004_nullable_user_id.sql       # NEW — nullable user_id (D-292)

# API source
api/src/types.ts                                       # MODIFIED — raw_key, user_id nullable
api/src/app.ts                                         # MODIFIED — signup route wired
api/src/middleware/auth.ts                              # MODIFIED — user_id ?? null
api/src/routes/signup.ts                               # NEW — POST /v1/signup/sandbox
api/src/routes/consent.ts                              # MODIFIED — 403 guard for null user_id
api/src/supabase/key-lookup.ts                         # MODIFIED — raw_key in SELECT

# Tests
api/src/__tests__/signup.test.ts                       # NEW — 5 tests
api/src/__tests__/auth.test.ts                         # MODIFIED — null user_id test
api/src/__tests__/consent.test.ts                      # MODIFIED — 3 sandbox_not_linked tests
api/src/__tests__/messages.test.ts                     # MODIFIED — raw_key in mock
api/src/__tests__/preview.test.ts                      # MODIFIED — raw_key in mock
api/src/__tests__/key-lookup.test.ts                   # UNCHANGED (untyped mocks, still valid)

# Decisions and docs
DECISIONS.md                                           # MODIFIED — D-291–D-299, supersedes notes
CLAUDE.md                                              # MODIFIED — voice doc references
BACKLOG.md                                             # MODIFIED — rate limiting item
docs/RELAYKIT_PRD_CONSOLIDATED.md                      # MODIFIED — D-293–D-299 updates
docs/PRICING_MODEL.md                                  # MODIFIED — v5.0

# Session docs
CC_HANDOFF.md                                          # This file (overwritten)
```

---

## What's Next (suggested order)

1. **Voice doc file cleanup** — `git add` the new v2 file, `git rm` the old v1.1, commit the archive move. Quick cleanup.
2. **Run migrations 003 + 004 in Supabase** — raw_key column and nullable user_id. Either fix MCP permissions or run via dashboard SQL editor.
3. **Sinch carrier integration** — Replace console.log stub in POST /v1/messages with real Sinch API call. Wire msg_ ID as correlation ID.
4. **Sandbox signup flow integration** — API key creation endpoint exists; now wire it into the dashboard or a signup page. Key shown once at creation, always visible in dashboard for sandbox (D-291).
5. **SDK → API server wiring** — Point SDK's fetch calls at the real API server. Verify end-to-end: `npm install relaykit` → `new RelayKit()` → `sendConfirmation()` → real text message.
6. **Marketing sandbox usage tracking (D-294)** — Track which namespaces a sandbox key has used, so registration can auto-submit marketing campaign if marketing was used.
7. **Prototype cleanup** — Remove compliance alerts system (D-293) and marketing expansion modal (D-294, D-295) from prototype. Replace with inline marketing status/toggle.
