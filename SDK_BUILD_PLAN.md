# SDK_BUILD_PLAN.md

> **Purpose:** Build spec for the RelayKit npm package (`/sdk`). Covers the conversion from validation-experiment mock to production TypeScript package, README structure, AGENTS.md snippet template, the canonical integration prompt, the guided vs quick-start UI spec for the dashboard, and the module pattern recommendation for developers.
>
> **Audience:** CC working in `/sdk`, plus whoever authors the README copy and the AGENTS.md snippet. Each section is scoped so CC can pick up an individual part as a session task.
>
> **CC: before implementing any section, verify every D-number cited in this spec against DECISIONS.md. If a summary here doesn't match the recorded decision, stop and flag the mismatch before writing code.**

---

## Status at a glance

| Area | Status |
|------|--------|
| Mock SDK from validation Round 12 | Exists in `/sdk` |
| TypeScript conversion | NOT STARTED |
| tsup build pipeline | NOT STARTED |
| README | NOT STARTED |
| AGENTS.md snippet template | Draft in `docs/AI_INTEGRATION_RESEARCH.md` §8 |
| Integration prompt | Draft below; finalize before first marketing use |
| Guided vs quick-start UI | NOT STARTED in prototype |
| Module pattern | Specified; ship in starter kit first |

---

## 1. SDK build steps

**Starting point:** the validated mock from experiment Round 12, currently at `/sdk`. It proved the shape of the API across Claude Code, Cursor, Windsurf, Lovable, Bolt, and Replit. It is JavaScript, unbuilt, and not TypeScript-strict.

### Step 1: Convert mock to TypeScript strict

- Move all source into `/sdk/src`
- Add `tsconfig.json` with `strict: true`, `target: ES2022`, `module: ESNext`, `moduleResolution: bundler`, `declaration: true`
- Type every public surface explicitly. No `any` without a justifying comment.
- Preserve the mock's method signatures exactly — they were validated across six AI tools

### Step 2: tsup build pipeline (D-272)

- Dual output: ESM (`dist/index.mjs`) + CJS (`dist/index.cjs`)
- TypeScript declarations: `dist/index.d.ts`
- `package.json` `exports` field maps both and types
- `package.json` `sideEffects: false` for tree-shaking
- `build` script: `tsup src/index.ts --format esm,cjs --dts --clean`

### Step 3: Package structure

```
/sdk
├── src/
│   ├── index.ts              # Public API surface
│   ├── client.ts             # Init + core send function
│   ├── namespaces/
│   │   ├── appointments.ts
│   │   ├── orders.ts
│   │   ├── verification.ts
│   │   ├── support.ts
│   │   ├── marketing.ts
│   │   ├── internal.ts
│   │   ├── community.ts
│   │   └── waitlist.ts
│   ├── consent.ts            # Top-level consent functions
│   └── types.ts              # Shared types
├── dist/                     # Build output (gitignored)
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── README.md
```

### Step 4: Implement required behaviors

| Decision | Behavior |
|----------|----------|
| D-266 | Per-vertical namespaces: `relaykit.appointments.sendConfirmation(...)` |
| D-273 | All namespaces present at launch; empty methods throw "not yet available" |
| D-274 | Top-level consent: `relaykit.recordConsent()`, `relaykit.checkConsent()`, `relaykit.revokeConsent()` — not namespaced |
| D-276 | Single wire endpoint: `POST /v1/messages` for all namespaced calls |
| D-277 | Default: failures return `{ success: false, error }` and log a warning. Strict mode (opt-in via init) throws. |
| D-278 | Zero-config init: reads `RELAYKIT_API_KEY` from `process.env` automatically. Explicit `{ apiKey }` override supported. |
| D-296 | REST and SDK are equal paths — anything the SDK does, the REST API does |
| D-330 | SDK is static at launch: every namespace method exists in code from day one |

### Step 5: Local testing

- `npm pack` produces a `.tgz`
- Install into the prototype with `npm install ../sdk/relaykit-0.0.1.tgz`
- Verify ESM import works in Next.js App Router server code
- Verify CJS require works in a plain Node script
- Verify types resolve in both

### Step 6: Publish

- Publish to npm as `relaykit`
- Scoped version bumps: `0.0.x` through beta, `0.1.0` at first paying customer, `1.0.0` at public launch
- Public npm readme pulls from `/sdk/README.md`

---

## 2. SDK structure decisions (settled)

- **One package, all namespaces** — not per-vertical packages (D-273, D-330)
- **Fetch only** — no HTTP client dependency; use the platform `fetch` (Node 18+, Edge runtimes, browsers if that were allowed)
- **No runtime dependencies** — the SDK is zero-dep at runtime to minimize install surface. Dev dependencies only (tsup, typescript, vitest, @types/node)
- **Server-side only** — documented hard constraint. The SDK is never safe in a browser because it holds the API key.

---

## 3. README structure (13 sections)

CC writes the README during the TypeScript conversion pass. Voice is developer-documentation — thorough, clear, no marketing copy. Voice Principles still apply to every user-visible string inside the README (error messages, example console output, etc.).

The README is the single source the developer's AI coding tool reads during integration. Treat it as a machine-readable spec wearing human-readable clothes.

### Section 1 — One-liner + install

One-line positioning. Install command. Nothing else.

```
Add SMS to your app. RelayKit handles compliance, registration, and delivery.

npm install relaykit
```

### Section 2 — Quick start

Five lines of code. Not a tutorial — a working example.

```ts
import { relaykit } from 'relaykit';

await relaykit.appointments.sendConfirmation({
  to: '+15551234567',
  data: { name: 'Sam', time: 'Tuesday at 3pm' }
});
```

### Section 3 — Server-side only (hard constraint)

The most important section in the README. First thing after Quick Start.

Content requirements:
- Plain statement: the SDK must run server-side
- Explanation: the API key cannot be exposed in a browser bundle
- Concrete guidance for common stacks:
  - Next.js → API route, Server Action, or Route Handler
  - Remix → Action or Loader
  - Client-only app (Vite/CRA) → call from a backend function or edge function
- Do NOT explain why this matters in general terms ("for security reasons" etc.). State it plainly.

### Section 4 — Setup

One env var, zero-config init.

- `RELAYKIT_API_KEY` — read automatically from `process.env` (D-278)
- Explicit override: `const rk = createClient({ apiKey: '...' })`
- `.env` example: `RELAYKIT_API_KEY=rk_test_...`

### Section 5 — How it works

Three-sentence architecture explanation, no jargon:

- Messages are authored on relaykit.ai and saved as templates
- The SDK sends a semantic event (e.g. `sendConfirmation`) with data
- The RelayKit server composes the SMS from the saved template at send time

Emphasize: your codebase contains no message text. Update copy on the website; deploys not required.

### Section 6 — Available namespaces

Full reference for every namespace method. This is the section AI coding tools read most carefully.

Per namespace, document:
- Namespace name (`appointments`, `orders`, `verification`, `support`, `marketing`, `internal`, `community`, `waitlist`)
- Each method signature with typed `data` shape
- Required vs optional fields in `data`
- Brief one-line purpose per method

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

If a namespace has no live methods at launch (D-330), list it with the note "methods available after launch" — don't hide the namespace.

### Section 7 — Consent management (D-274)

Top-level functions, not namespaced.

```ts
await relaykit.recordConsent({ phone: '+15551234567', source: 'signup-form' });
const allowed = await relaykit.checkConsent('+15551234567');
await relaykit.revokeConsent('+15551234567');
```

One sentence on enforcement: STOP handling and opt-out enforcement happen at the proxy level; the SDK does not need to implement them.

### Section 8 — Response format + error handling (D-277)

Default (graceful) mode — what every call returns:

```ts
// Success
{ success: true, messageId: 'msg_...', status: 'sent' }

// Failure (default mode)
{ success: false, error: { code: 'string', message: 'string' } }

// Blocked (e.g. consent revoked, carrier rejected)
{ success: false, error: { code: 'blocked', message: '...' } }
```

Strict mode (opt-in):

```ts
const rk = createClient({ strict: true });
// Throws on failure instead of returning { success: false }
```

### Section 9 — REST API (D-276, D-296)

SDK and API are equal paths. Document the REST equivalent alongside the SDK.

- `POST /v1/messages` — unified send endpoint
- `POST /v1/consent` — record consent
- `GET /v1/consent/:phone` — check consent
- `DELETE /v1/consent/:phone` — revoke consent
- `GET /v1/messages/:id` — check a message's delivery status

Show a curl example for `POST /v1/messages` that mirrors the Quick Start SDK call.

### Section 10 — AI coding tool integration

The section that makes RelayKit work for vibe coders.

Content requirements:
- Server-side only — restate
- Scan the codebase before writing calls; find the events (new appointment, order placed, etc.) and attach SDK calls there
- Use namespace methods, never build message strings
- Do not implement opt-out, consent storage, or quiet hours — the SDK and proxy handle all of that
- Check the response; log errors
- Do not retry on failure (the proxy handles retries)

### Section 11 — Test mode

- API keys beginning with `rk_test_` are test-mode keys (D-349)
- Test mode sends to verified testers only
- No real SMS goes out; messages are recorded as if they did
- 100/day limit per project
- Same code path as live — only the key prefix differs

### Section 12 — What NOT to do

Explicit list. Short. Imperative.

- Don't build message strings in your code
- Don't call the SDK from a browser
- Don't implement STOP / opt-out handling
- Don't store consent state in your DB
- Don't add quiet-hours logic
- Don't retry on failure

### Section 13 — Links

- Dashboard: https://relaykit.ai
- Docs: https://relaykit.ai/docs
- Status: https://status.relaykit.ai

---

## 4. AGENTS.md snippet template

The AGENTS.md snippet is what the developer pastes into their project's `AGENTS.md` (or creates new) so their AI coding tool picks up RelayKit-specific constraints.

### Characteristics

- **Human-curated, never auto-generated** — template lives on the website, personalized at generation time with the developer's use case and relevant methods only
- **Under 60 lines**
- **Contains:**
  - The SDK methods for their use case (not the whole namespace catalog)
  - Hard constraints (server-side only, API key never in client code, don't modify the proxy's schema)
  - Recommended integration pattern: `lib/relaykit/` (see §7 below)
  - Test commands (`npm run test`, or whatever they use)

### Reference

Draft template is at `docs/AI_INTEGRATION_RESEARCH.md` §8. Refine that draft when the SDK README is complete — AGENTS.md and README must not drift.

---

## 5. Integration prompt (canonical)

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

### Why this works

- Points at the README (not self-contained) → the tool reads current docs, not stale copies
- Business context → the tool picks the right namespace
- "Show me your plan before writing code" → a reviewable diff before churn

### Where this lives

- Dashboard setup page (prototype step 3) — pre-filled with the developer's business context from the wizard
- Marketing site — generic version without business context, for cold readers
- README §10 — as an example

---

## 6. Guided vs Quick Start UI spec

**Location:** Step 3 of the setup instructions on the workspace page, post-signup.

**Current state (Session 32):** Three steps — Install RelayKit, Add your API key, Add SMS to your app. Step 3 has a single prompt block.

**Target state:** Steps 1 and 2 unchanged. Step 3 splits into two options.

### Guided (default, visually primary)

- Heading: "Add SMS to your app"
- Sub: one sentence along the lines of "Follow along as your AI tool adds SMS one message at a time."
- Step-by-step cards, one per message type for the developer's use case
- Each card:
  - Message type name (e.g. "Appointment confirmation")
  - Pre-filled prompt to paste into their AI tool
  - A "Send test" verification step after the code is written
- Developer works through cards sequentially
- Completion state per card persists across sessions

### Quick start (secondary, clearly available)

- Heading: something like "Or do it all at once"
- Sub: "For new projects or if you're comfortable with AI-driven integration."
- Single prompt block — the full integration prompt from §5
- Copy button
- No step tracking

### What's spec'd vs what needs design

- **Spec'd here:** structure, content model, visual hierarchy (guided primary, quick start secondary), completion-state persistence
- **Needs a design session before implementation:**
  - Exact copy for every heading, sub, and card
  - Card visual treatment (checklist? cards? accordion?)
  - "Send test" verification UX (inline input? panel?)
  - Completion-state indicators

Voice Principles v2.0 applies to every string. Draft copy, then audit against the kill list before shipping.

---

## 7. Module pattern recommendation

How developers should structure their integration code.

### For the starter kit (prescriptive)

Ship the starter kit with:

```
/lib/relaykit
├── client.ts          # SDK init; exports `relaykit` instance
└── notifications.ts   # Wrapper functions per business event
```

`client.ts`:
```ts
import { createClient } from 'relaykit';
export const relaykit = createClient({ strict: false });
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

- Clean business logic (call `notifyBookingCreated(booking)`, not `relaykit.appointments.sendConfirmation({...})`)
- Centralized error handling (one place to log, retry-policy, fallbacks)
- Easier testing — mock the wrapper, not the SDK
- Cleaner rollback — delete the wrapper calls, no SDK refactor

### Enforcement stance

- **Starter kit:** ship it this way
- **Docs:** recommend it
- **SDK:** do not enforce it. The SDK must work with direct calls too, because developers have existing codebases and AI tools often generate direct calls.

---

## 8. Decisions referenced

- **D-266** — Per-vertical namespaces
- **D-272** — Dual ESM/CJS + declarations via tsup
- **D-273** — All namespaces present at launch
- **D-274** — Top-level consent (not namespaced)
- **D-276** — Single wire endpoint `POST /v1/messages`
- **D-277** — Graceful failure default; strict mode opt-in
- **D-278** — Zero-config init from `process.env`
- **D-296** — REST and SDK are equal paths
- **D-330** — SDK is static at launch

---

## 9. API key prefix (resolved — D-349)

User-facing API key prefix is `rk_test_` for test mode and `rk_live_` for live. Internal `environment` column stays `'sandbox' | 'live'`; the boundary layer translates at key generation.

**Follow-up sweep (not blocking SDK build):** `PRICING_MODEL.md` and any prototype strings referencing `rk_sandbox_` need updating. Scoped as a separate PROTOTYPE_SPEC / docs cleanup task.