# SDK_BUILD_PLAN.md

> **Purpose:** Living spec for the RelayKit npm package (`/sdk`). Split into two parts: a retrospective of what shipped in `relaykit@0.1.0` (the facts CC and future maintainers need as ground truth) and a forward-looking section for Phase 8 delivery (npm publish, README, AGENTS.md, integration prompt). Reference tables document the structural decisions that still govern SDK work.
>
> **Audience:** CC working in `/sdk` or on Phase 8 artifacts; whoever authors the README copy and AGENTS.md snippet when Phase 8 begins.
>
> **CC: before implementing any section, verify every D-number cited here against DECISIONS.md. If a summary here doesn't match the recorded decision, stop and flag the mismatch before writing code.**

---

## Status at a glance

| Area | Status |
|------|--------|
| TypeScript conversion (strict) | **Shipped** in `relaykit@0.1.0` |
| tsup build pipeline (ESM + CJS + .d.ts) | **Shipped** |
| Package structure (`/sdk/src/namespaces/`, consent, types) | **Shipped** |
| 8 namespaces × 30 methods | **Shipped** |
| Top-level consent (`recordConsent`, `checkConsent`, `revokeConsent`) | **Shipped** |
| Test suite | **Shipped** (235 lines, single file — see §2d) |
| Local validation (`npm pack` → `relaykit-0.1.0.tgz`) | **Shipped** |
| npm publish | **Pending — Phase 8** |
| README | **Pending — Phase 8** (spec in §4b) |
| AGENTS.md template | **Pending — Phase 8** (spec in §4c) |
| Integration prompt | **Drafted below** (§4d); finalize before first marketing use |
| Module pattern (starter-kit wrapper) | **Specified** (§5); ships with Phase 9 starter-kit integration |
| `rk_sandbox_` → `rk_test_` sweep | **Complete** — Phase 0 Group E applied 2026-04-21; SDK side already used `rk_test_` |

---

## 1. Preamble

This document was originally a forward-looking build plan written before the SDK existed. The SDK now exists — `relaykit@0.1.0`, packed to `relaykit-0.1.0.tgz`, tested, not yet published — so the document has been rewritten as retrospective-plus-forward. §2–§3 describe what shipped and the decisions that shape it; §4 scopes Phase 8 delivery; §5 describes the starter-kit pattern that lands in Phase 9.

Nothing in this rewrite changes shipped code. One new decision, **D-362 (2026-04-21)**, pins the `SendResult` shape that ships in v0.1.0 as canonical so documentation, README examples, and `/api` response contracts all resolve to one structure going forward.

---

## 2. What shipped (v0.1.0)

### 2a. Timeline

The v0.1.0 package is the codified outcome of validation experiment Round 12 (six-AI-tool API-shape validation) plus Phase-0-era build work. TypeScript conversion, the tsup build pipeline, the eight-namespace public surface, the top-level consent functions, and the test suite all shipped together as `relaykit@0.1.0`. `npm pack` produced `/sdk/relaykit-0.1.0.tgz`. The package has not been published to npm; that is Phase 8 work (§5a).

### 2b. Shipped surface

**Initialization.** Class-based, zero-config (D-278):

```ts
import { RelayKit } from 'relaykit';

const relaykit = new RelayKit();
// reads RELAYKIT_API_KEY and BUSINESS_NAME from process.env

// Explicit config supported:
const relaykit = new RelayKit({ apiKey: '...', businessName: '...' });

// Strict mode opts out of graceful failure (see §2e):
const relaykit = new RelayKit({ strict: true });
```

`/sdk/src/index.ts` exports the `RelayKit` class, the `RelayKitError` error class, and type symbols (`RelayKitConfig`, `SendResult`, etc.).

**Namespaces (D-266, D-273).** Eight namespaces, 30 methods:

| Namespace | Methods |
|-----------|---------|
| `appointments` | `sendConfirmation`, `sendReminder`, `sendReschedule`, `sendCancellation`, `sendNoShow` |
| `orders` | `sendConfirmation`, `sendShipping`, `sendDelivered`, `sendReturn`, `sendRefund` |
| `verification` | `sendCode`, `sendPasswordReset`, `sendNewDevice` |
| `support` | `sendTicketCreated`, `sendStatusUpdate`, `sendResolution` |
| `marketing` | `sendPromotion`, `sendLoyaltyReward`, `sendNewArrivals` |
| `internal` | `sendMeetingReminder`, `sendScheduleChange`, `sendShiftConfirmation` |
| `community` | `sendEventReminder`, `sendWelcome`, `sendGroupUpdate`, `sendRenewalNotice` |
| `waitlist` | `sendConfirmation`, `sendSpotAvailable`, `sendReservationConfirmed`, `sendWaitTimeUpdate` |

Per D-330, every namespace is present from day one.

**Top-level consent (D-274).** Not namespaced:

```ts
await relaykit.recordConsent({ phone, consentType: 'transactional', source: 'signup_form' });
const allowed = await relaykit.checkConsent(phone);
await relaykit.revokeConsent(phone);
```

Plus a generic `relaykit.send({ ... })` for custom messages (D-351 pattern) alongside the namespace methods.

### 2c. Build & package

- **Language:** TypeScript strict, target ES2022, module ESNext, `declaration: true`. No `any` without a justifying comment.
- **Build:** tsup dual output per D-272 — ESM (`dist/index.js`), CJS (`dist/index.cjs`), and declarations (`dist/index.d.ts` / `.d.cts`).
- **`package.json`:** `name: relaykit`, `version: 0.1.0`, `main: ./dist/index.cjs`, `module: ./dist/index.js`, `types: ./dist/index.d.ts`, `exports` field maps both module systems with correct types per condition, `sideEffects: false` for tree-shaking.
- **Scripts:** `build`, `test`, `lint`, `typecheck`, `format`, `format:check`. No prepublish hook — publishing consumes the pre-built `dist/`.
- **Runtime deps:** zero. Platform `fetch` only (Node 18+, Edge, workers).
- **Local validation artifact:** `/sdk/relaykit-0.1.0.tgz`, produced by `npm pack`, installable into a consumer project for round-trip testing.

### 2d. Tests

Test suite at `/sdk/src/__tests__/relaykit.test.ts` (235 lines, single file). Covers: initialization (3 tests), graceful failure (3), strict mode (3), namespace structure (2 + parametrized ×8 namespaces), type contracts (3). Structured around behaviors rather than namespace-per-file. Adequate for v0.1.0; per-namespace test files are deferred unless they become necessary (not scoped into any current phase).

### 2e. Shipped behaviors reference

Mapping decisions to shipped behaviors — used by future SDK sessions to verify any proposed change preserves the governing contract:

| Decision | Shipped behavior |
|----------|------------------|
| D-266 | Per-vertical namespaces: `relaykit.appointments.sendConfirmation(...)`. |
| D-273 | All eight namespaces present; no lazy loading. |
| D-274 | Consent is top-level: `recordConsent`, `checkConsent`, `revokeConsent`. Not namespaced. |
| D-276 | SDK sends to a single wire endpoint: `POST /v1/messages`. |
| D-306 | Request body carries `namespace + event` (e.g. `{ namespace: 'appointments', event: 'sendConfirmation', ... }`), not a flat `message_type`. |
| D-307 | SDK method names are the public API; registry keys on the server align to them. |
| D-277 | Graceful default: failures return a `SendResult` with `id: null` and `status: 'failed'` or `'blocked'` and a populated `reason`. Strict mode (`new RelayKit({ strict: true })`) throws `RelayKitError` instead. |
| D-362 | `SendResult` canonical shape: `{ id: string \| null; status: 'sent' \| 'queued' \| 'blocked' \| 'failed'; reason?: string }`. |
| D-308 | `/api` error responses use `{ error: { code, message } }`; the SDK reads from this structure and maps to `SendResult.reason` in graceful mode (or `RelayKitError` in strict). |
| D-278 | Zero-config init via `new RelayKit()` reads `RELAYKIT_API_KEY` and `BUSINESS_NAME` from `process.env`. Explicit config overrides. |
| D-296 | SDK and raw REST API are equal paths — anything the SDK does, `/v1/messages` does. |
| D-330 | Static surface: every namespace method exists in code from day one, regardless of what the developer configured. |
| D-349 | User-facing API keys are `rk_test_` (test mode) or `rk_live_` (live); the internal `environment` column stays `'sandbox' \| 'live'`. |
| D-351 | Custom messages delivered via `relaykit.<namespace>.sendCustom(slug, data)` or `relaykit.send({ ... })`; curated templates still use named methods. |

---

## 3. SDK structure decisions (settled)

- **One package, all namespaces** — not per-vertical packages (D-273, D-330).
- **Fetch only** — no HTTP client dependency; use the platform `fetch` (Node 18+, Edge runtimes).
- **No runtime dependencies** — dev-only deps (tsup, typescript, vitest, @types/node).
- **Server-side only** — documented hard constraint. The SDK is never safe in a browser because it holds the API key.
- **Class-based init (`new RelayKit()`)** — the shipped pattern. README examples, AGENTS.md examples, and module-pattern docs all use this form. A singleton convenience pattern (e.g. a shared `import { relaykit }` default export) is a **Phase 8 decision**, not in scope for v0.1.0.

---

## 4. Remaining work (Phase 8)

### 4a. npm publish

- Publish as `relaykit`.
- Semver policy: `0.1.0` shipped locally; bump minors for additive surface, patches for fixes, `1.0.0` at public launch.
- Public npm readme pulls from `/sdk/README.md` (see §4b — README itself still pending).
- No prepublish hook currently — Phase 8 work should either add one or document the manual `npm run build && npm publish` sequence.

### 4b. README spec (13 sections)

The README is the single source the developer's AI coding tool reads during integration. Treat it as a machine-readable spec wearing human-readable clothes. Voice is developer-documentation — thorough, clear, no marketing copy. Voice Principles v2.0 apply to every user-visible string inside the README (errors, example console output, etc.).

**Note on init-pattern examples:** every Quick Start and example in the README must use `const relaykit = new RelayKit()` (the shipped pattern — §3). A singleton convenience pattern (e.g. `import { relaykit }`) is a Phase 8 decision and, if adopted, must be added to the SDK in a separate, decided commit before README examples can reference it.

#### Section 1 — One-liner + install

One-line positioning. Install command. Nothing else.

```
Add SMS to your app. RelayKit handles compliance, registration, and delivery.

npm install relaykit
```

#### Section 2 — Quick start

Five lines of code. Not a tutorial — a working example.

```ts
import { RelayKit } from 'relaykit';

const relaykit = new RelayKit();

await relaykit.appointments.sendConfirmation({
  to: '+15551234567',
  data: { name: 'Sam', time: 'Tuesday at 3pm' }
});
```

#### Section 3 — Server-side only (hard constraint)

The most important section in the README. First thing after Quick Start.

Content requirements:
- Plain statement: the SDK must run server-side.
- Explanation: the API key cannot be exposed in a browser bundle.
- Concrete guidance for common stacks:
  - Next.js → API route, Server Action, or Route Handler.
  - Remix → Action or Loader.
  - Client-only app (Vite/CRA) → call from a backend function or edge function.
- Do NOT explain why this matters in general terms ("for security reasons" etc.). State it plainly.

#### Section 4 — Setup

One env var, zero-config init.

- `RELAYKIT_API_KEY` — read automatically from `process.env` (D-278).
- Explicit override: `new RelayKit({ apiKey: '...' })`.
- `.env` example: `RELAYKIT_API_KEY=rk_test_...`.

#### Section 5 — How it works

Three-sentence architecture explanation, no jargon:

- Messages are authored on relaykit.ai and saved as templates.
- The SDK sends a semantic event (e.g. `sendConfirmation`) with data.
- The RelayKit server composes the SMS from the saved template at send time.

Emphasize: your codebase contains no message text. Update copy on the website; deploys not required.

#### Section 6 — Available namespaces

Full reference for every namespace method. This is the section AI coding tools read most carefully.

Per namespace, document:
- Namespace name (`appointments`, `orders`, `verification`, `support`, `marketing`, `internal`, `community`, `waitlist`).
- Each method signature with typed `data` shape.
- Required vs optional fields in `data`.
- Brief one-line purpose per method.
- For each applicable vertical, the `sendCustom(slug, data)` pattern (D-351) and the `reviewRequest(...)` method where D-361 applies.

Example:

```ts
relaykit.appointments.sendConfirmation({
  to: string;
  data: {
    name: string;          // required
    time: string;          // required
    location?: string;     // optional
  };
});
```

Per D-330, every namespace is present; nothing is hidden. OTP/verification exposure across verticals (D-360) is documented here — every namespace exposes a `verifyCode(...)` method in addition to its transactional templates.

#### Section 7 — Consent management (D-274)

Top-level functions, not namespaced.

```ts
await relaykit.recordConsent({ phone: '+15551234567', consentType: 'transactional', source: 'signup_form' });
const allowed = await relaykit.checkConsent('+15551234567');
await relaykit.revokeConsent('+15551234567');
```

One sentence on enforcement: STOP handling and opt-out enforcement happen at the proxy level; the SDK does not need to implement them.

#### Section 8 — Response format + error handling (D-277, D-362)

Every call returns a `SendResult`:

```ts
type SendResult = {
  id: string | null;
  status: 'sent' | 'queued' | 'blocked' | 'failed';
  reason?: string;
};
```

Graceful mode (default):

```ts
// Success
{ id: 'msg_...', status: 'sent' }

// Queued (carrier accepted, not yet delivered)
{ id: 'msg_...', status: 'queued' }

// Blocked (e.g. consent revoked, carrier rejected)
{ id: null, status: 'blocked', reason: 'recipient_opted_out' }

// Failed (network, auth, or validation)
{ id: null, status: 'failed', reason: 'invalid_phone_number' }
```

Strict mode (opt-in):

```ts
const relaykit = new RelayKit({ strict: true });
// Throws RelayKitError on failure instead of returning { id: null, ... }
```

The `/api` carries errors as `{ error: { code, message } }` (D-308); the SDK maps `error.code` into `SendResult.reason` in graceful mode, or into `RelayKitError` in strict mode.

#### Section 9 — REST API (D-276, D-296)

SDK and API are equal paths. Document the REST equivalent alongside the SDK.

- `POST /v1/messages` — unified send endpoint; body carries `namespace + event` (D-306).
- `POST /v1/consent` — record consent.
- `GET /v1/consent/:phone` — check consent.
- `DELETE /v1/consent/:phone` — revoke consent.
- `GET /v1/messages/:id` — check a message's delivery status.

Show a curl example for `POST /v1/messages` that mirrors the Quick Start SDK call.

#### Section 10 — AI coding tool integration

The section that makes RelayKit work for vibe coders.

Content requirements:
- Server-side only — restate.
- Scan the codebase before writing calls; find the events (new appointment, order placed, etc.) and attach SDK calls there.
- Use namespace methods, never build message strings.
- Do not implement opt-out, consent storage, or quiet hours — the SDK and proxy handle all of that.
- Check the response; log errors.
- Do not retry on failure (the proxy handles retries).

#### Section 11 — Test mode

- API keys beginning with `rk_test_` are test-mode keys (D-349).
- Test mode sends to verified testers only.
- No real SMS goes out to non-testers; messages are recorded as if they did.
- 100/day limit per project.
- Same code path as live — only the key prefix differs.

#### Section 12 — What NOT to do

Explicit list. Short. Imperative.

- Don't build message strings in your code.
- Don't call the SDK from a browser.
- Don't implement STOP / opt-out handling.
- Don't store consent state in your DB.
- Don't add quiet-hours logic.
- Don't retry on failure.

#### Section 13 — Links

- Dashboard: https://relaykit.ai
- Docs: https://relaykit.ai/docs
- Status: https://status.relaykit.ai

### 4c. AGENTS.md snippet template

The AGENTS.md snippet is what the developer pastes into their project's `AGENTS.md` (or creates new) so their AI coding tool picks up RelayKit-specific constraints.

**Characteristics:**

- **Human-curated, never auto-generated** — template lives on the website, personalized at generation time with the developer's use case and relevant methods only.
- **Under 60 lines.**
- **Contains:**
  - The SDK methods for their use case (not the whole namespace catalog).
  - Hard constraints (server-side only, API key never in client code, don't modify the proxy's schema).
  - Recommended integration pattern: `lib/relaykit/` (see §5 below).
  - Test commands (`npm run test`, or whatever they use).
  - Init pattern: `const relaykit = new RelayKit()` — not a shared singleton import (see §3 note on Phase 8 decision).

**Reference:** draft template is at `docs/AI_INTEGRATION_RESEARCH.md` §8. Refine that draft when the SDK README is written — AGENTS.md and README must not drift.

### 4d. Integration prompt (canonical)

The prompt the developer pastes into their AI tool after `npm install relaykit`. Works for brownfield apps.

```
I installed the RelayKit SDK. Read the RelayKit README in node_modules/relaykit
for integration guidance.

I run [one sentence about the business — e.g. "a beauty and wellness
appointments business called GlowStudio"].

Analyze my codebase and find where [use-case events — e.g. "appointment
events"] happen. For each event, add the matching RelayKit SDK call. The
README has the exact method signatures. Show me your plan before writing code.
```

**Why this works:**

- Points at the README (not self-contained) → the tool reads current docs, not stale copies.
- Business context → the tool picks the right namespace.
- "Show me your plan before writing code" → a reviewable diff before churn.

**Where this lives:**

- Workspace setup page — pre-filled with the developer's business context from the wizard.
- Marketing site — generic version without business context, for cold readers.
- README §10 — as an example.

**Voice check (2026-04-21):** prompt re-read against Voice Principles v2.0 during Group D rewrite. No pricing claims present, no prohibited compliance-guarantee language, no jargon. Clean.

---

## 5. Module pattern recommendation

How developers should structure their integration code. Specified here; ships in the Phase 9 starter-kit integration work.

### For the starter kit (prescriptive)

Ship the starter kit with:

```
/lib/relaykit
├── client.ts          # SDK init; exports a `relaykit` instance scoped to the app
└── notifications.ts   # Wrapper functions per business event
```

`client.ts`:
```ts
import { RelayKit } from 'relaykit';
export const relaykit = new RelayKit();
```

`notifications.ts`:
```ts
import { relaykit } from './client';
import type { Booking } from '@/types';

export async function notifyBookingCreated(booking: Booking) {
  return relaykit.appointments.sendConfirmation({
    to: booking.phone,
    data: { name: booking.customerName, time: booking.scheduledFor }
  });
}
```

### For brownfield integrations (recommended, not required)

The AGENTS.md snippet says: prefer `lib/relaykit/` if one doesn't exist; match existing patterns if they do.

### Why the wrapper pattern matters

- Clean business logic (call `notifyBookingCreated(booking)`, not `relaykit.appointments.sendConfirmation({...})`).
- Centralized error handling (one place to log, retry-policy, fallbacks).
- Easier testing — mock the wrapper, not the SDK.
- Cleaner rollback — delete the wrapper calls, no SDK refactor.

### Enforcement stance

- **Starter kit (Phase 9):** ship it this way.
- **Docs:** recommend it.
- **SDK:** do not enforce. The SDK must work with direct calls too, because developers have existing codebases and AI tools often generate direct calls.

---

## 6. Decisions referenced

| # | Summary |
|---|---------|
| D-266 | Per-vertical namespaces |
| D-272 | Dual ESM/CJS + declarations via tsup |
| D-273 | All namespaces present at launch |
| D-274 | Top-level consent (not namespaced) |
| D-276 | Single wire endpoint `POST /v1/messages` |
| D-277 | Graceful failure default; strict mode opt-in |
| D-278 | Zero-config init from `process.env` |
| D-296 | REST and SDK are equal paths |
| D-306 | SDK sends `namespace + event`, not flat `message_type` |
| D-307 | SDK method names are the public API; registry keys align to them |
| D-308 | `/api` error responses use `{ error: { code, message } }`; SDK maps to `SendResult.reason` or `RelayKitError` |
| D-330 | SDK is static at launch |
| D-349 | `rk_test_` / `rk_live_` user-facing; `sandbox` / `live` internal |
| D-351 | Custom message delivery via `sendCustom(slug, data)` and `relaykit.send({ ... })` |
| D-362 | `SendResult` canonical shape `{ id, status, reason? }` |

---

## 7. API key prefix follow-up

User-facing API key prefix is `rk_test_` for test mode and `rk_live_` for live (D-349). Internal `environment` column stays `'sandbox' | 'live'`; the boundary layer translates at key generation.

**Follow-up sweep:** stale `rk_sandbox_` references in docs, prototype strings, `PRICING_MODEL.md`, and `WORKSPACE_DESIGN_SPEC.md` were scoped into **Phase 0 Group E** and swept 2026-04-21. The SDK side already used `rk_test_`; nothing to do in `/sdk`.

---

*End of SDK_BUILD_PLAN.md.*
