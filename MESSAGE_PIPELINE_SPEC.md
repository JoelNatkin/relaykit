# MESSAGE_PIPELINE_SPEC.md

> **Purpose:** Build spec for the `/api` message delivery pipeline — Session A (normalization, interpolation, consent) complete; Session B (Sinch outbound + delivery callbacks) addressed by Phase 2; Session C (quiet hours) deferred post-launch. Defines the pipeline step interface, MessageContext type, and execution order.
>
> Not for: SDK surface (SDK_BUILD_PLAN), registration pipeline (MASTER_PLAN Phase 5 + `experiments/sinch/experiments-log.md`), UI/dashboard surfaces (PROTOTYPE_SPEC).
>
> **CC: before implementing any section, verify every D-number cited in this spec against DECISIONS.md. If a summary here doesn't match the recorded decision, stop and flag the mismatch before writing code.**

---

## Status at a glance

| Session | Scope | Status | Blocker |
|---------|-------|--------|---------|
| A | Foundation: phone normalization, messages table, pipeline refactor | COMPLETE | — |
| Consent API | Endpoints: record / check / revoke | COMPLETE | — |
| B | Sinch SMS send step | GATED | Phase 1 Sinch experiments (MASTER_PLAN §5) must produce recorded Sinch request/response shapes before start |
| C | Quiet hours enforcement (marketing only) | NOT STARTED | None — buildable now with mocks |
| Future | EIN verification step | NOT STARTED | Blocked on Sinch registration flow details |

---

## Pipeline architecture (reference)

The `/api` message pipeline is a sequence of composable steps, each operating on a shared `MessageContext`. A step either returns the mutated context (to continue) or a `Response` (to short-circuit and return to the caller).

**Core types** (`/api/src/pipeline/types.ts`):

```ts
interface MessageContext {
  // Auth
  userId: string;
  environment: 'sandbox' | 'live';  // internal column; user-facing copy says "test mode"
  apiKeyId: string;

  // Request
  namespace: string;
  event: string;
  toPhone: string;
  data: Record<string, unknown>;

  // Template lookup
  template?: { id: string; body: string };
  composedText?: string;

  // Send result
  messageId?: string;
  timestamp?: string;
  carrierMessageId?: string;
  status?: 'queued' | 'sent' | 'delivered' | 'failed';
  queuedUntil?: string;
  failureReason?: string;
}

type PipelineStep = (ctx: MessageContext) => Promise<MessageContext | Response>;
```

**Pipeline runner** (`/api/src/pipeline/run.ts`): Accepts an ordered array of steps, runs them sequentially, short-circuits the moment any step returns a `Response`.

**Current pipeline order** (set in `/api/src/routes/messages.ts`):
```
[normalize, interpolate, send, logDelivery]
```

**After Session C lands**, the order becomes:
```
[normalize, interpolate, quietHours, send, logDelivery]
```

---

## Session A: Foundation [COMPLETE]

Built and shipped. Documented here so later sessions can reference what exists.

### What's in place

**Phone normalization** (`/api/src/utils/phone.ts`)
- `normalizePhone(input: string): string` — strips non-digits except leading `+`, handles 10-digit US, 11-digit with leading `1`, already-valid E.164. Throws for invalid formats, non-US numbers, too-short input.
- `isValidE164(phone: string): boolean`
- 8 test cases in `/api/src/__tests__/phone.test.ts`

**Messages table** (`/api/supabase/migrations/005_messages_table.sql`)

| Column | Type | Notes |
|--------|------|-------|
| `id` | TEXT PK | |
| `user_id` | TEXT | |
| `api_key_id` | TEXT | |
| `environment` | TEXT | CHECK `'sandbox' \| 'live'` (internal naming — user sees "test mode") |
| `namespace` | TEXT | |
| `event` | TEXT | |
| `to_phone` | TEXT | E.164 normalized |
| `composed_text` | TEXT | |
| `status` | TEXT | CHECK `'queued' \| 'sent' \| 'delivered' \| 'failed'` |
| `carrier_message_id` | TEXT | Populated after Session B |
| `queued_until` | TIMESTAMPTZ | Populated by Session C quiet-hours step |
| `created_at` | TIMESTAMPTZ | |
| `delivered_at` | TIMESTAMPTZ | |
| `failed_at` | TIMESTAMPTZ | |
| `failure_reason` | TEXT | |

Indexes: `user_id`, `created_at`, `status WHERE queued`.

Migration file exists but is **not run**. Joel applies it in the Supabase dashboard when Session B is ready to ship.

**Pipeline refactor**
- `/api/src/pipeline/types.ts` — `MessageContext`, `PipelineStep`
- `/api/src/pipeline/run.ts` — `runPipeline()` runs steps sequentially, short-circuits on `Response`
- `/api/src/pipeline/steps/normalize.ts` — calls `normalizePhone`, populates `ctx.toPhone`
- `/api/src/pipeline/steps/interpolate.ts` — looks up template, produces `ctx.composedText`
- `/api/src/pipeline/steps/send.ts` — console.log stub (replaced in Session B)
- `/api/src/pipeline/steps/log-delivery.ts` — stub (completed in Session B)
- `/api/src/routes/messages.ts` — refactored: parse body → build context → run pipeline → return response

**Auth middleware**
- `ctx.apiKeyId` populated from the matched API key record's `id` field
- `AppVariables` in `types.ts` includes `api_key_id: string`

**Verification**
- 13 existing integration tests still pass
- `tsc --noEmit`, `eslint`, `vitest` all clean

---

## Consent API [COMPLETE]

Built and shipped alongside Session A foundation. Originally listed as "Future additions" in earlier drafts of this spec — promoted here in Phase 0 (2026-04-21) to reflect reality.

### What's in place

**Endpoints** (`/api/src/routes/consent.ts`, wired in `/api/src/app.ts`)

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/v1/consent` | Record consent for a phone number (body: `{ phone, source }`) |
| `GET` | `/v1/consent/:phone` | Check consent status — returns `{ phone, consented, consented_at? }` |
| `DELETE` | `/v1/consent/:phone` | Revoke consent — returns `{ phone, status: 'revoked', revoked_at }` or `{ phone, status: 'not_found' }` |

All three require an authenticated API key that is linked to a customer account (`user_id` present). Unlinked sandbox keys receive `403 sandbox_not_linked`.

**Data layer** (`/api/src/types.ts` `ConsentStore` interface, Supabase-backed implementation)

- `record(userId, phone, source, ip) → ConsentRecord`
- `check(userId, phone) → ConsentRecord | null`
- `revoke(userId, phone) → ConsentRecord | null`

**Migration** (`/api/supabase/migrations/002_consent.sql`) — present alongside the other Session A migrations (001, 003, 004). Runtime application status tracked in deploy infra, not this spec.

**Tests** (`/api/src/__tests__/consent.test.ts`, `consent-store.test.ts`) — passing under `vitest` with the in-memory store.

### Pipeline integration (not yet wired)

A `consent-check` step that runs before `send` and short-circuits if consent is missing or revoked is planned but not yet added to the pipeline order. Tracked as a follow-up — logically belongs with Session B (send wiring) or a dedicated Session D after Sinch lands.

---

## Session B: Sinch Send [GATED — Phase 1 experiments first]

> **Dependency on Phase 1.** Per MASTER_PLAN §5, Session B start requires Phase 1 Sinch proving-ground experiments to complete and produce recorded Sinch request/response shapes, latency numbers, and failure modes. The request/response contract and failure-handling logic below were drafted before Sinch experience — treat them as a starting hypothesis and reconcile against Phase 1 findings before implementing. Update this spec in place if experiments reveal divergence.

### Dependencies

Required before starting:
- Sinch Service Plan ID
- Sinch API Token
- Virtual phone number provisioned in Sinch
- Sinch region (e.g. `us`, `eu`)

All four go into the runtime env. The module never reads env directly — config is injected.

### Build steps

**Part 1: Sinch carrier module** (`/api/src/carrier/sinch.ts`)

```ts
interface CarrierSendResult {
  carrierId: string;
  status: 'sent' | 'failed';
  failureReason?: string;
}

interface CarrierConfig {
  servicePlanId: string;
  apiToken: string;
  sinchNumber: string;
  region: string;
}

type CarrierSend = (to: string, body: string, correlationId: string) => Promise<CarrierSendResult>;

export function createSinchSender(config: CarrierConfig): CarrierSend { /* ... */ }
```

Implementation:
- Use `fetch()` directly — no Sinch SDK (D-02)
- `POST https://{region}.sms.api.sinch.com/xms/v1/{servicePlanId}/batches`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer {apiToken}`
- Body: `{ from: sinchNumber, to: [to], body: body }`
- Extract `id` from response JSON as `carrierId`
- Handle: network failure, non-200 response, invalid JSON — all return `{ status: 'failed', failureReason: '...' }`. Never throw.

**Part 2: Update send pipeline step** (`/api/src/pipeline/steps/send.ts`)

- Accept an optional `CarrierSend` via dependency injection from the app factory
- If provided: call it, populate `ctx.carrierMessageId`, set `ctx.status` from the result
- If not provided (local dev with no Sinch env): fall back to the Session A console.log stub
- Never throw — capture failures in `ctx.status` and `ctx.failureReason` so the log-delivery step can record them

**Part 3: Wire into app**

- `createApp(options)` accepts optional `carrierSender: CarrierSend`
- `/api/src/index.ts` constructs the Sinch sender from env vars behind a `hasSinch` guard — same pattern as `hasSupabase`
- Env vars: `SINCH_SERVICE_PLAN_ID`, `SINCH_API_TOKEN`, `SINCH_NUMBER`, `SINCH_REGION`

**Part 4: Log delivery** (`/api/src/pipeline/steps/log-delivery.ts`)

- If Supabase client is available: insert row into `messages` table with all context fields (id, user_id, api_key_id, environment, namespace, event, to_phone, composed_text, status, carrier_message_id, timestamps, failure_reason)
- If not available: skip silently (same guard pattern)
- Must run after `send` so `carrierMessageId` and `status` are populated

**Part 5: Tests** (`/api/src/__tests__/sinch.test.ts`)

- Mock `fetch` globally (vitest)
- Test cases:
  - Successful send → returns `{ carrierId, status: 'sent' }`
  - Network failure → returns `{ status: 'failed', failureReason: ... }`
  - Non-200 response → returns `{ status: 'failed', failureReason: ... }`
  - Invalid JSON response → returns `{ status: 'failed', failureReason: ... }`

### Acceptance criteria

- `tsc --noEmit` clean
- `eslint` clean
- `vitest` — all Session A tests still pass, new Sinch tests pass
- Manual verification: with real Sinch env vars, `POST /v1/messages` delivers a real SMS and writes a row to `messages` with `status: 'sent'` and a populated `carrier_message_id`

### Session B CC prompt (paste when ready)

> Wire Sinch SMS send into the message pipeline per MESSAGE_PIPELINE_SPEC.md Session B. Build all five parts: Sinch carrier module with fetch-only implementation, update the send pipeline step to accept injected CarrierSend, wire into createApp with hasSinch guard, implement log-delivery to insert into messages table, add Sinch unit tests with mocked fetch. Respect D-02 (no Sinch SDK). Never throw from the carrier module — capture failures in the result. Run tsc and eslint clean before committing.

---

## Session C: Quiet Hours [NOT STARTED — buildable now]

Enforces D-309: marketing messages only send between 8 AM and 9 PM in the recipient's local time. Non-marketing messages pass through unchanged.

### Dependencies

None operational. Can be built and tested entirely with mocks. Full end-to-end verification requires Session B (real send), but unit tests cover the logic independently.

### Build steps

**Part 1: NPA-NXX timezone lookup** (`/api/src/utils/timezone.ts`)

```ts
export function getTimezoneFromPhone(phone: string): string | null;
```

- Input: E.164 string (`+1XXXXXXXXXX`)
- Extract area code — digits 2–4 (after `+1`)
- Static lookup table mapping US area codes → IANA timezone strings (e.g. `'212' → 'America/New_York'`)
- Return `null` for unknown area codes
- Large file expected (~300+ entries). Static data is fine; no DB lookup.

**Part 2: Quiet hours step** (`/api/src/pipeline/steps/quiet-hours.ts`)

Logic:
- If `ctx.namespace !== 'marketing'`: pass through unchanged (return ctx)
- Otherwise:
  - `tz = getTimezoneFromPhone(ctx.toPhone)`
  - If `tz === null`: pass through and log a warning (fail open — better to send than to silently drop)
  - Get current time in `tz`. If hour `< 8` or hour `>= 21` (i.e. before 8 AM or at/after 9 PM):
    - Set `ctx.status = 'queued'`
    - Set `ctx.queuedUntil` to the next 8 AM in that timezone (ISO 8601 string)

**Part 3: Update send step**

- If `ctx.status === 'queued'` when send runs: skip the carrier call
- `log-delivery` inserts the row with `status: 'queued'` and `queued_until` populated; `carrier_message_id` stays null

**Part 4: Queue processor stub** (`/api/src/queue/process-queued.ts`)

```ts
export async function processQueuedMessages(): Promise<void>;
```

- Query `messages` WHERE `status = 'queued' AND queued_until <= NOW()`
- For each: look up template, send via carrier, update status to `'sent'` or `'failed'`
- Function only — not wired to cron. Cron wiring is a future task.
- Testable with mocks; don't block on real cron infra.

**Part 5: Tests** (`/api/src/__tests__/quiet-hours.test.ts`)

Mock `Date.now()` for deterministic timezone assertions. 8 test cases:

1. Marketing message at 10 PM ET → queued
2. Marketing message at 2 PM ET → passes through
3. Transactional (non-marketing) message at 10 PM → passes through
4. Unknown area code → passes through with warning logged
5. Boundary: 8:59 PM ET → queued
6. Boundary: 9:00 PM ET → queued (9 PM is the close of the window)
7. Boundary: 7:59 AM ET → queued
8. Boundary: 8:00 AM ET → passes through (8 AM is the open of the window)

### Acceptance criteria

- `tsc --noEmit` clean
- `eslint` clean
- `vitest` — all prior tests still pass, 8 new quiet-hours tests pass
- Pipeline order in `/api/src/routes/messages.ts` updated to `[normalize, interpolate, quietHours, send, logDelivery]`

### Session C CC prompt (paste when ready)

> Implement quiet hours enforcement per MESSAGE_PIPELINE_SPEC.md Session C. Build all five parts: NPA-NXX timezone lookup utility, quiet-hours pipeline step (marketing only, fail-open on unknown area codes), updates to the send step to skip queued messages, queue processor stub, and 8 boundary-condition tests with mocked Date.now. Insert the new step into the pipeline order as `[normalize, interpolate, quietHours, send, logDelivery]`. Reference D-309. Run tsc and eslint clean before committing.

---

## Future additions

### EIN verification step (D-302, D-303)

Pre-registration pipeline step — runs before Sinch brand/campaign submission, not before message delivery. Pre-validates business identity from EIN lookup so registration doesn't fail on a preventable mismatch.

Blocked on Sinch registration flow details. Build spec can't be written until we know Sinch's registration API surface. Tracked here so it doesn't get lost.

---

## Decisions referenced

- **D-02** — No Twilio/Sinch SDK; use `fetch()` only
- **D-274** — Top-level consent functions; consent endpoints separate from message namespaces
- **D-276** — Single API endpoint: `POST /v1/messages`
- **D-277** — Graceful failure default: null + warning; strict mode opt-in
- **D-309** — Marketing quiet hours 8 AM – 9 PM recipient local time
- **D-302, D-303** — EIN verification (deferred, see Future additions)
