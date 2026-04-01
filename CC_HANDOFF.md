# CC_HANDOFF.md — Session Handoff
**Date:** 2026-04-01 (SDK tests, API server scaffold, full API surface build)
**Branch:** main

---

## Commits This Session

```
30dc4bc  test(sdk): add contract test suite with Vitest
b9bd011  docs: add TDD skill for CC
aafa65a  docs: record D-284 through D-290
77db4dd  feat(api): initialize Hono API server with quality tooling
55d5c90  test(api): add health check endpoint test
0d91e2e  feat(api): add API key validation middleware with dependency-injected lookup
bdb5b1a  feat(api): add static template registry with lookup and interpolation (D-286)
1646a8b  feat(api): implement POST /v1/messages with template lookup and interpolation
3293b72  feat(api): add consent API endpoints with dependency-injected store (D-276)
7d522b3  feat(api): add POST /v1/messages/preview with shared validation
```

---

## What We Completed

### SDK Test Suite
22 Vitest tests covering the SDK's public API: core initialization (4), graceful failure mode (3), strict mode (3), namespace structure (9 — method counts for all 8 namespaces + send escape hatch), type contracts (3). Global fetch mock prevents real HTTP calls.

### TDD Skill
`.claude/skills/tdd/SKILL.md` — Red-Green-Refactor workflow for CC. Vitest, co-located tests, mock external deps, one module per test file.

### Decisions D-284–D-290
- D-284: API server is Hono in /api, standalone deployment target
- D-285: API keys hashed (SHA-256), environment-prefixed (rk_sandbox_, rk_live_), shown once
- D-286: Static JSON template registry for sandbox, Supabase for production
- D-287: API response contract — msg_ IDs, structured errors, standard HTTP codes
- D-288: Starter Kit Program — post-launch, after Priorities 1-3
- D-289: Starters supersede message reference page as lead magnet
- D-290: Starters are not gated — open source, no signup to clone

### API Server — Full Scaffold and API Surface
Built `/api` from scratch with Hono + @hono/node-server. All 5 endpoints from D-276 are implemented:

1. **GET /** — Health check. Returns `{ status: "ok", service: "relaykit-api" }`. No auth.
2. **POST /v1/messages** — Send a message. Auth required. Validates body (`namespace`, `event`, `to`, `data`), looks up template from static registry, interpolates variables, returns `{ id: "msg_...", status: "sent", timestamp }`. Send step is a console.log stub.
3. **POST /v1/messages/preview** — Validate without sending. Same validation, returns `{ valid: true, message, template_id, namespace, event }`. No msg_ ID generated.
4. **POST /v1/consent** — Record consent. Body: `{ phone, source }`. Captures IP from x-forwarded-for. Returns `{ phone, status: "recorded", consented_at }`.
5. **GET /v1/consent/:phone** — Check consent. Returns `{ phone, consented: true/false, consented_at? }`. Always 200 (privacy — no 404 leakage).
6. **DELETE /v1/consent/:phone** — Revoke consent. Idempotent: returns `{ phone, status: "revoked", revoked_at }` or `{ phone, status: "not_found" }`. Always 200.

### Architecture Patterns Established
- **Auth middleware** (`src/middleware/auth.ts`): SHA-256 hashes Bearer token, calls injected `KeyLookup` function, rejects missing/invalid/revoked keys with 401, sets `user_id` + `environment` on Hono context.
- **Dependency injection**: `createApp(lookup, consentStore?)` accepts a key lookup function and optional ConsentStore interface. Real Supabase implementations get wired in later.
- **Shared validation** (`src/routes/shared.ts`): `validateMessageRequest()` returns discriminated union `{ ok: true, value }` or `{ ok: false, response }`. Used by both messages and preview handlers — zero duplicated validation.
- **Static template registry** (`src/templates/registry.ts`): 18 templates across 8 namespaces (appointments: 3, orders: 3, verification: 2, support: 2, marketing: 2, internal: 2, community: 2, waitlist: 2). All default-ON base messages from PRD_02.
- **Template lookup + interpolation** (`src/templates/lookup.ts`): `lookupTemplate(namespace, event)` and `interpolate(template, data)` with missing-variable error.

---

## Quality Checks Passed

- `tsc --noEmit` — clean (both /sdk and /api)
- `eslint src/` — clean (/api)
- `vitest run` — 50 tests passing (/api), 22 tests passing (/sdk)
- Dev server verified: `GET /` returns health check JSON on port 3002

---

## In Progress / Partially Done

### Real Supabase Integration
ConsentStore and KeyLookup are interfaces with no Supabase implementation yet. The API server uses dependency injection — real implementations get wired into `createApp()` when Supabase is connected.

### Sinch Carrier Integration
POST /v1/messages logs to console instead of sending via Sinch. The msg_ ID and response contract are ready — just needs the carrier send call.

### Custom Messages
`namespace: "custom", event: "send"` returns 422 "not yet supported". Placeholder for D-280 (website authoring surface).

### Experience Principles File Rename (from prior session)
`V4_EXPERIENCE_PRINCIPLES_v1.1.md` exists as untracked file. Original still tracked. CLAUDE.md references point to original. Needs Joel decision.

---

## Gotchas for Next Session

1. **Delete `.next` before every dev server start** (prototype). API server has no `.next` — it uses tsx directly.

2. **API server runs on port 3002.** Prototype is port 3001, Next.js dev is default port 3000.

3. **`createApp()` takes two params.** `createApp(lookup, consentStore?)` — the consent store is optional. Tests that don't need consent pass only the lookup. The default `app` export uses a stub lookup that always returns null (all requests get 401).

4. **Shared validation returns a Response object.** `validateMessageRequest()` returns `{ ok: false, response }` where `response` is already a Hono Response. Handlers just `return result.response`.

5. **DELETE /v1/consent is idempotent.** Returns 200 with `status: "not_found"` when no consent exists — NOT 404. Privacy reasoning: 404 leaks whether a phone number has ever had consent.

6. **Template registry is static.** 18 templates from PRD_02 default-ON base messages. Production will add Supabase lookup for user-customized templates (D-286).

7. **SDK and API are sibling directories at repo root.** `/sdk` and `/api` — separate package.json, separate node_modules, separate test suites. Run tests from the correct directory.

8. **ESLint config is `.mjs` in /api, `.js` in /sdk.** Both use flat config with @typescript-eslint strict rules.

9. **Two Experience Principles files still exist.** Original tracked, v1.1 untracked. Resolve before writing new copy.

10. **`api/node_modules/` is untracked.** This is expected — it's gitignored. The `docs/STARTER_KIT_PROGRAM.md` is also untracked from outside this session.

---

## Files Modified This Session

```
# SDK tests
sdk/package.json                              # Added vitest devDep + test script
sdk/package-lock.json                         # Updated
sdk/src/__tests__/relaykit.test.ts             # NEW — 22 contract tests

# TDD skill
.claude/skills/tdd/SKILL.md                   # NEW — Red-Green-Refactor workflow

# Decisions
DECISIONS.md                                  # D-284–D-290 appended

# API server (all NEW)
api/package.json                              # relaykit-api, private, all scripts
api/package-lock.json                         # Dependencies
api/tsconfig.json                             # Strict, ES2022, NodeNext
api/eslint.config.mjs                         # Flat config, typescript-eslint
api/.prettierrc                               # Matches SDK settings
api/tsup.config.ts                            # ESM, dts, clean
api/src/index.ts                              # Server entry — Hono on port 3002
api/src/app.ts                                # createApp factory + route wiring
api/src/types.ts                              # ApiKeyRecord, AppVariables, ConsentRecord, ConsentStore
api/src/middleware/auth.ts                     # Auth middleware — SHA-256 hash, DI lookup
api/src/routes/messages.ts                    # POST /v1/messages handler
api/src/routes/preview.ts                     # POST /v1/messages/preview handler
api/src/routes/consent.ts                     # Consent CRUD handlers
api/src/routes/shared.ts                      # Shared validation for messages + preview
api/src/templates/registry.ts                 # 18 static templates from PRD_02
api/src/templates/lookup.ts                   # lookupTemplate + interpolate
api/src/__tests__/health.test.ts              # Health check + auth integration tests
api/src/__tests__/auth.test.ts                # Auth middleware tests (6)
api/src/__tests__/templates.test.ts           # Template registry + lookup tests (14)
api/src/__tests__/messages.test.ts            # Message endpoint tests (10)
api/src/__tests__/consent.test.ts             # Consent endpoint tests (11)
api/src/__tests__/preview.test.ts             # Preview endpoint tests (6)

# Session docs
CC_HANDOFF.md                                 # This file (overwritten)
```

---

## What's Next (suggested order)

1. **Supabase integration for API keys** — Implement real `KeyLookup` that queries `api_keys` table. Create migration for the table (D-285 schema).
2. **Supabase integration for consent** — Implement real `ConsentStore` that queries consent table. Create migration.
3. **Sinch carrier integration** — Replace console.log stub in POST /v1/messages with real Sinch API call. Wire msg_ ID as correlation ID.
4. **Sandbox signup flow** — API key creation endpoint or dashboard integration. Key shown once, hashed for storage.
5. **SDK → API server wiring** — Point SDK's fetch calls at the real API server. Verify end-to-end: `npm install relaykit` → `new RelayKit()` → `sendConfirmation()` → real text message.
6. **Experience Principles file resolution** — Decide on v1.0 vs v1.1, update CLAUDE.md references.
7. **Remaining prototype work** — Category landing vocabulary (D-254), "two files" copy removal (D-257), compliance attention section (D-243).
