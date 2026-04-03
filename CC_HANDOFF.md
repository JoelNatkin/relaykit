# CC_HANDOFF.md — Session Handoff
**Date:** 2026-04-03 (D-306–D-309, SDK↔API wire format alignment, registry reconciliation, error parsing, rate limiting)
**Branch:** main

---

## Commits This Session

```
62aed62  refactor(sdk): send namespace + event instead of message_type (D-306)
4e27c3d  feat(sdk): add missing namespace methods, align with registry (D-307)
f4f53b5  feat(api): rename registry keys and add missing templates (D-307)
dd37e88  test(api): add SDK-to-API integration tests (D-306, D-307)
f19a63c  fix(sdk): parse API error format correctly (D-308)
ac243a0  feat(api): add rate limiting to sandbox signup endpoint
```

---

## What Was Completed

### D-306: SDK wire format alignment
- SDK `sendMessage()` signature changed from `(options, messageType, to, data)` to `(options, namespace, event, to, data)`
- Fetch body changed from `{ to, message_type, data }` to `{ namespace, event, to, data }` — matches API server's `shared.ts` validated contract
- All 8 namespace files updated to pass namespace string + event name
- `SendParams` type updated: `messageType` replaced with `namespace` + `event`
- `send()` escape hatch updated to pass both fields through
- Base URL now configurable via `RELAYKIT_API_URL` env var (defaults to `https://api.relaykit.ai/v1`)

### D-307: SDK↔Registry reconciliation
**SDK additions (3 new methods):**
- `waitlist.sendConfirmation` — maps to existing registry template
- `community.sendWelcome` — maps to existing registry template
- `marketing.sendLoyaltyReward` — maps to existing registry template

**Registry renames (2):**
- `orders.sendDelivery` → `sendDelivered` (matches SDK method name)
- `support.sendAcknowledgment` → `sendTicketCreated` (matches SDK method name)

**Registry additions (12 new templates):**
- appointments: sendReschedule, sendNoShow
- orders: sendReturn, sendRefund
- verification: sendNewDevice
- support: sendStatusUpdate
- marketing: sendNewArrivals
- internal: sendShiftConfirmation
- community: sendGroupUpdate, sendRenewalNotice
- waitlist: sendReservationConfirmed, sendWaitTimeUpdate

**Final count: 30 methods across 8 namespaces — 1:1 match between SDK and registry.**

### D-308: SDK error response parsing
- SDK now reads `err.error?.message` instead of `err.reason` from API error responses
- Both `sendMessage()` and `consentRequest()` fixed
- API error format `{ error: { code, message } }` is the source of truth

### Integration tests
- New `api/src/__tests__/integration.test.ts` — 13 test cases
- Validates: success path, unknown namespace 422, missing fields 400, invalid key 401, all 8 namespaces reachable

### Rate limiting on sandbox signup
- New `api/src/middleware/rate-limit.ts` — in-memory IP-based rate limiter
- Applied to `POST /v1/signup/sandbox` only: 5 requests per IP per hour
- Returns 429 with `Retry-After` header when exceeded
- Expired entries cleaned up on each request (no timer needed)
- 5 test cases covering: under limit, exceed, Retry-After header, window reset, independent IPs

### D-309: Quiet hours decision recorded
- Marketing messages blocked/queued outside 8 AM–9 PM recipient local time
- Proxy-level enforcement — developers never think about it
- Decision recorded, not yet implemented (Phase 2: messaging proxy)

---

## Quality Checks Passed

- `tsc --noEmit` — clean (SDK)
- `tsc --noEmit` — clean (API)
- `eslint src/` — clean (SDK)
- `eslint src/` — clean (API)
- `vitest run` — 22/22 passed (SDK)
- `vitest run` — 87/87 passed (API)

---

## In Progress / Partially Done (Carried Forward)

### Sinch Carrier Integration
POST /v1/messages still logs to console instead of sending via Sinch. The msg_ ID and response contract are ready — just needs the carrier send call.

### Custom Messages
`namespace: "custom", event: "send"` returns 422 "not yet supported". Placeholder for D-280 (website authoring surface).

---

## Gotchas for Next Session

1. **Delete `.next` before every dev server start** (prototype). API server has no `.next` — it uses tsx directly.

2. **API server runs on port 3002.** Prototype is port 3001, Next.js dev is default port 3000.

3. **D-294 is amended, not superseded.** D-304 and D-305 amend specific constraints (symmetrical pricing, marketing standalone). Core D-294 mechanics remain valid.

4. **Rate limiter is in-memory.** Resets on server restart. Fine for single-instance, needs Redis or similar for multi-instance deployment.

5. **`user_id` is `string | null` everywhere (D-292).** Unchanged from prior sessions.

6. **Signup endpoint is PUBLIC.** `POST /v1/signup/sandbox` — now rate-limited (5/IP/hour) but no auth.

7. **Migrations 003 and 004 may not be applied to live DB.** Run via Supabase dashboard SQL editor if MCP permissions aren't fixed.

8. **SDK and API are sibling directories at repo root.** `/sdk` and `/api` — separate package.json, separate node_modules, separate test suites.

9. **RELAYKIT_API_URL env var added.** SDK base URL is now configurable. Defaults to `https://api.relaykit.ai/v1` if not set.

10. **30 templates across 8 namespaces.** All SDK methods have matching registry entries. Adding a new SDK method requires adding a registry template (and vice versa).

11. **`createApp()` takes two params.** `createApp(lookup, consentStore?)` — consent store optional. Tests that don't need consent pass only the lookup.

12. **`hasSupabase` guard in `index.ts`.** Both KeyLookup and ConsentStore are created behind `Boolean(supabaseUrl && supabaseKey)` check.

13. **Environment type is `'sandbox' | 'live'`, not `'production'`.** Fixed in a prior session.

---

## Files Modified This Session

```
# Decisions
DECISIONS.md                                           # MODIFIED — D-306–D-309

# SDK — wire format + reconciliation + error parsing
sdk/src/client.ts                                      # MODIFIED — new sendMessage signature, configurable URL, error parsing
sdk/src/types.ts                                       # MODIFIED — SendParams, 3 namespace interfaces expanded
sdk/src/index.ts                                       # MODIFIED — send() updated for namespace+event
sdk/src/namespaces/appointments.ts                     # MODIFIED — namespace+event args
sdk/src/namespaces/orders.ts                           # MODIFIED — namespace+event args
sdk/src/namespaces/verification.ts                     # MODIFIED — namespace+event args
sdk/src/namespaces/support.ts                          # MODIFIED — namespace+event args
sdk/src/namespaces/marketing.ts                        # MODIFIED — namespace+event args + sendLoyaltyReward
sdk/src/namespaces/internal.ts                         # MODIFIED — namespace+event args
sdk/src/namespaces/community.ts                        # MODIFIED — namespace+event args + sendWelcome
sdk/src/namespaces/waitlist.ts                         # MODIFIED — namespace+event args + sendConfirmation
sdk/src/__tests__/relaykit.test.ts                     # MODIFIED — updated for new wire format + method counts

# API — registry + integration tests + rate limiting
api/src/templates/registry.ts                          # MODIFIED — 2 renames, 12 additions (18→30 templates)
api/src/__tests__/templates.test.ts                    # MODIFIED — updated expected counts
api/src/__tests__/integration.test.ts                  # NEW — 13 SDK-to-API integration tests
api/src/middleware/rate-limit.ts                        # NEW — IP-based rate limiter
api/src/app.ts                                         # MODIFIED — rate limiter wired to signup route
api/src/__tests__/rate-limit.test.ts                   # NEW — 5 rate limiter tests

# Session docs
CC_HANDOFF.md                                          # This file (overwritten)
```

---

## What's Next (suggested order)

1. **Run migrations 003 + 004 in Supabase** — raw_key column and nullable user_id. Either fix MCP permissions or run via dashboard SQL editor.
2. **Sinch carrier integration** — Replace console.log stub in POST /v1/messages with real Sinch API call. Wire msg_ ID as correlation ID.
3. **Sandbox signup flow integration** — Wire API key creation into the dashboard. Key shown once at creation, always visible in dashboard for sandbox (D-291).
4. **SDK → API server wiring** — Point SDK's fetch calls at the real API server. Verify end-to-end: `npm install relaykit` → `new RelayKit()` → `sendConfirmation()` → real text message.
5. **EIN verification data source research** — Investigate IRS BMF, state SOS, Middesk, Enigma. Pick a source and estimate integration effort (D-302/D-303).
6. **Quiet hours implementation (D-309)** — NPA-NXX timezone lookup, message queue for delayed delivery, proxy-level enforcement.
7. **Prototype cleanup** — Remove compliance alerts system (D-293) and marketing expansion modal (D-294, D-295). Replace with inline marketing status/toggle.
8. **Website intake interview design (D-300)** — Per-vertical question sets, Claude API integration architecture, spec file generation pipeline.
