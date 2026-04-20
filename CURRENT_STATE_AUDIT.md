# CURRENT_STATE_AUDIT.md
## RelayKit repo inventory — audit session
### Generated: 2026-04-20 (Session 37 audit pass)

> **Purpose:** A snapshot of what actually exists in this repo right now, with attention to contradictions, drift, and abandoned work. This is information, not action. No code was modified during this audit.
>
> **Method:** Five parallel investigation agents (one per directory group), plus direct reads of the spec docs. `tsc --noEmit` run against `/api`, `/sdk`, `/prototype`. Supabase live DB schema was **not** verified — the agent lacked credentials.

---

## 1. Executive Summary

**Overall health: operationally sound, documentation drifting.** All three TypeScript projects (`/api`, `/sdk`, `/prototype`) compile clean. Test suites pass (`/api`: 98/98; `/sdk`: full vitest suite). The prototype runs without errors on port 3001. `/src` is a live Twilio-era production app that continues to serve traffic. Nothing is on fire.

**What's concerning is the gap between the spec docs and reality.** `SDK_BUILD_PLAN.md` says the SDK is "NOT STARTED" — but `/sdk` is a complete, built, TypeScript-strict, dual-published npm package at v0.1.0 with a packed `.tgz`. `MESSAGE_PIPELINE_SPEC.md` says the consent API is "Future — not started" — but it shipped with tests weeks ago. `CLAUDE.md` says wizard sessionStorage uses `relaykit_intake` — but the actual key is `relaykit_wizard`. `REPO_INDEX.md` says 28 unpushed commits — `CC_HANDOFF.md` says 31. The specs are not wrong, just stale: the code moved past them without the docs catching up.

**Top weirdness/concerns:**
1. **Verification vertical is a UI-only placeholder with broken wizard→workspace handoff.** The wizard stores `vertical: "verification"` but the workspace never reads it — every user lands on Appointments content regardless of what they picked.
2. **Inbound-message handling is a split-brain story.** `/src` (Twilio-era) has a fully working webhook receiver, STOP/START processing, and a `messages` table with `direction='inbound'`. The new `/api` has zero inbound surface. `MESSAGE_PIPELINE_SPEC` Sessions A/B/C don't mention inbound at all — yet `PRICING_MODEL.md` advertises "inbound message forwarding" as a sandbox feature. No UI anywhere surfaces inbound.
3. **Two parallel backends exist.** `/src` (Next.js, Twilio, deployed) and `/api` (Hono, Sinch-shaped, not deployed). Each has its own `supabase/migrations/` directory with a `messages` table of different shape. No bridge, no migration plan, no sunset date for `/src`.
4. **`rk_sandbox_` / `rk_test_` key-prefix split is unresolved.** D-349 changed the prefix to `rk_test_` but `rk_sandbox_` appears in 40+ files across PRICING_MODEL, PROTOTYPE_SPEC, WORKSPACE_DESIGN_SPEC, prototype code, `/src` code, and `/api` code (sandbox signup endpoint still mints `rk_sandbox_*` keys).
5. **SDK_BUILD_PLAN is entirely stale.** The plan describes work that's already shipped. The SDK's `SendResult` shape diverges from what the plan documents (no `success` boolean, different error shape). No README.md exists in `/sdk` despite the plan specifying a 13-section README as a first-class deliverable.

---

## 2. Per-Directory Inventory

### 2.1 `/src` — Legacy Next.js production app

**State:** Active production. Deployed (likely Vercel). Last meaningful commit 3 weeks ago (`2d63a63 feat: import intake wizard components from production`). Slower-moving than `/prototype` but not abandoned.

**Contents (319 files, ~39K LOC):**
- `app/` — 40 files, Next.js App Router pages + 23 API routes
- `lib/` — 92 files, business logic (twilio/, proxy/, orchestrator/, deliverable/, intake/)
- `components/` — 176 files, Untitled UI component library
- `utils/supabase/` — Supabase SSR helpers (browser/server/middleware)
- `middleware.ts` — auth middleware

**Key endpoints (live):**
- `POST /api/v1/messages` — outbound send via Twilio proxy
- `GET/POST /api/v1/account`
- `GET/POST /api/v1/consents/[phoneNumber]`
- `GET/POST /api/v1/opt-outs/[phoneNumber]`
- `GET/POST /api/v1/webhooks`, `DELETE /api/v1/webhooks/[webhookId]`
- `POST /api/webhooks/inbound/[registrationId]` — **Twilio inbound SMS + STOP/START/HELP**
- `POST /api/webhooks/status/[registrationId]` — Twilio delivery status
- `POST /api/webhooks/stripe` — Stripe events (225 LOC)
- `POST /api/otp` — Twilio brand OTP (Trust Hub)
- `POST /api/phone-verify` — Twilio Verify
- `POST /api/sandbox-key` — mints `rk_sandbox_*` keys
- `POST /api/checkout` — Stripe checkout
- Plus 10 others (build-spec, deliverable, message-plan, compliance/alerts, cron/poll-registrations, etc.)

**Twilio footprint (21 files):** `/lib/twilio/{client,subaccount,brand,phone-number,messaging-service,campaign,poll,vetting}.ts`. Subaccount auth tokens encrypted via AES-256-GCM with `TWILIO_ENCRYPTION_KEY`. **D-02 compliant** (fetch only, no `twilio` SDK package).

**Twilio env vars:** `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_ENCRYPTION_KEY`, `TWILIO_VERIFY_SID`.

**Auth:** Email OTP via Supabase Auth. Component file is still named `magic-link-form.tsx` but implements 6-digit OTP (commit `d5cbdfb` "switch auth from magic link to email OTP"). Misleading filename.

**Dependency direction:** Nothing in `/prototype` or `/api` imports from `/src`. One-way isolation.

**TODOs in `/src`:**
- `api/webhooks/stripe/route.ts:203` — "Send 'payment failed' email — 7-day grace period"
- `api/webhooks/stripe/route.ts:222` — "Pause Messaging Service via Twilio API" + "Send reactivation email"
- `lib/orchestrator/processor.ts:218` — "deploy to Cloudflare Pages"

**Alignment with current decisions:**
- D-02 (no Twilio SDK): ✅ compliant
- D-03 (magic link auth): ⚠️ partial — implements OTP, not magic link, and the component name hasn't been updated
- D-215 (Sinch replaces Twilio): ❌ `/src` is entirely Twilio; migration not started

**Dead/weird:**
- `/app/dev/intake` — dev route still reachable in production. Should be gated.
- `/app/auth/page.tsx` — appears unreachable; no nav link.
- `components/auth/magic-link-form.tsx` — name lies about what the component does.

---

### 2.2 `/api` — New Hono backend (MESSAGE_PIPELINE_SPEC target)

**State:** Session A shipped, tests passing. Session B blocked (needs Sinch account). Session C unstarted. Consent API shipped ahead of spec.

**Framework:** **Hono** + `@hono/node-server` (not Next.js). `@supabase/supabase-js` for DB. `vitest` + `tsup` + strict TS.

**File tree (~2,600 LOC, source + tests):**
```
api/src/
├── app.ts, index.ts, types.ts
├── middleware/{auth.ts, rate-limit.ts}
├── pipeline/{types.ts, run.ts, steps/{normalize,interpolate,send,log-delivery}.ts}
├── routes/{messages.ts, preview.ts, signup.ts, consent.ts, shared.ts}
├── supabase/{client.ts, key-lookup.ts, consent-store.ts}
├── templates/{registry.ts (8 namespaces, 29 templates), lookup.ts}
├── utils/phone.ts
└── __tests__/ (12 files, 98 tests, all green)
api/supabase/migrations/
├── 001_api_keys.sql
├── 002_consent.sql
├── 003_raw_key.sql
├── 004_nullable_user_id.sql
└── 005_messages_table.sql   ← NOT RUN (spec says Joel applies when B ready)
```

**Live endpoints:**
| Method | Path | Status |
|---|---|---|
| GET | `/` | health check |
| POST | `/v1/signup/sandbox` | mints `rk_sandbox_*` keys (rate-limited, 5/hr/IP) |
| POST | `/v1/messages` | validated + normalized + interpolated + send-stub + log-stub |
| POST | `/v1/messages/preview` | dry-run validation (not listed in MESSAGE_PIPELINE_SPEC but implemented) |
| POST | `/v1/consent` | record |
| GET | `/v1/consent/:phone` | check |
| DELETE | `/v1/consent/:phone` | revoke |

**Session A / B / C status (from code, not spec claims):**
- **A — COMPLETE:** phone normalization, pipeline framework, auth middleware, templates, 98 tests green.
- **B — NOT IMPLEMENTED:** `/api/src/carrier/sinch.ts` does not exist. `send.ts` is pure `console.log` stub that always returns `status:'sent'`. `log-delivery.ts` returns ctx unchanged (no DB write). `createApp()` has no `carrierSender` parameter. Zero Sinch env vars referenced. **Spec status "BLOCKED" accurately matches code.**
- **C — NOT IMPLEMENTED:** no `timezone.ts`, no `quiet-hours.ts`, no `queue/process-queued.ts`. Pipeline order is `[normalize, interpolate, send, logDelivery]` — missing `quietHours` insertion.
- **Consent — SHIPPED AHEAD OF SPEC:** fully implemented with 2 test files (443 LOC). Spec calls this "Future — needs its own session prompt."

**`MessageContext` type drift:** spec (`MESSAGE_PIPELINE_SPEC.md` line 51) defines `queuedUntil: string`. Code `api/src/pipeline/types.ts` omits this field. Will need to be added before Session C.

**`createApp` signature drift:** spec (`MESSAGE_PIPELINE_SPEC.md` line 180) says `createApp(options)` with optional `carrierSender`. Code is `createApp(lookup, consentStore)` — no options object. Will need refactor for Session B.

**Env vars referenced:** `SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_URL` (fallback), `SUPABASE_SERVICE_ROLE_KEY`. **No `.env.example`, no README.**

**Future Sinch env vars (spec):** `SINCH_SERVICE_PLAN_ID`, `SINCH_API_TOKEN`, `SINCH_NUMBER`, `SINCH_REGION` — not yet referenced in code.

**TODOs / FIXMEs:** none. Two explicit stub comments (send.ts line 8, log-delivery.ts line 4).

---

### 2.3 `/sdk` — RelayKit npm package

**State:** Complete, production-ready, packed as `relaykit-0.1.0.tgz`. **This is a significant gap with `SDK_BUILD_PLAN.md`, which describes this package as "NOT STARTED" / "TypeScript conversion: NOT STARTED."** The plan is stale.

**Contents:**
```
sdk/src/
├── index.ts, client.ts, types.ts (440 LOC), errors.ts, consent.ts
└── namespaces/
    ├── appointments.ts (5 methods)
    ├── orders.ts (5)
    ├── verification.ts (3: sendCode, sendPasswordReset, sendNewDevice)
    ├── support.ts (3)
    ├── marketing.ts (3)
    ├── internal.ts (3)
    ├── community.ts (4)
    └── waitlist.ts (4)
sdk/dist/
├── index.js (ESM), index.cjs (CJS)
├── index.d.ts, index.d.cts
└── sourcemaps
sdk/__tests__/relaykit.test.ts (235 LOC)
sdk/package.json (v0.1.0, MIT)
sdk/tsconfig.json (strict, declaration)
sdk/tsup.config.ts (dual output)
sdk/relaykit-0.1.0.tgz (9.7 KB, pre-packed)
```

**What's built (vs SDK_BUILD_PLAN):**
| Spec item | Status |
|---|---|
| 8 namespaces w/ named methods (D-266, D-273) | ✅ complete, 30 methods total |
| Top-level consent (D-274) | ✅ `recordConsent/checkConsent/revokeConsent` |
| Generic `send()` escape hatch (D-280) | ✅ implemented |
| Zero-config init (D-278) | ✅ reads `RELAYKIT_API_KEY` |
| Graceful failure default + strict opt-in (D-277) | ✅ |
| Fetch-only, zero runtime deps | ✅ |
| Dual ESM+CJS + declarations (D-272) | ✅ |
| POST /v1/messages wire (D-276) | ✅ |
| Test suite | ✅ |
| README.md | ❌ **missing** (plan §3 specifies 13 sections) |
| `sideEffects: false` in package.json | ❌ missing (minor) |
| AGENTS.md template | ❌ draft only in `docs/AI_INTEGRATION_RESEARCH.md` §8 |

**`SendResult` shape drift from plan:**
- Plan §8: `{ success: true, messageId: '...', status: 'sent' }` on success; `{ success: false, error: { code, message } }` on failure.
- Code `types.ts`: `{ id: string | null, status: 'sent'|'queued'|'blocked'|'failed', reason?: string }`.
- **No `success` boolean. No nested `error` object. Different field names (`id` vs `messageId`).** Consumer code cannot do `if (result.success)`.

**Response-shape drift between SDK and `/api`:** `/api/src/routes/messages.ts` returns `{ id, status, timestamp }`. SDK's `SendResult` includes `status` but no `timestamp`. SDK's `id` can be null (per types) but `/api` always returns a string. Minor — would not cause runtime errors but should be reconciled.

**TODOs:** none. Clean.

---

### 2.4 `/prototype` — UI source of truth (port 3001)

**State:** Heavy active development. All `/prototype/*` dirs compile clean. Custom message CRUD + authoring lock are the last-shipped features (D-351 revised, D-356, D-357 — Session 36).

**Framework:** Next.js 15 App Router, React 19, Tailwind v4.1, Tiptap v3, Zod v4, `@untitledui/icons`. No ESLint config in `/prototype` (CC_HANDOFF notes this is unchanged from prior sessions).

**Route surface (abbreviated):**
- **Wizard:** `/start` → `/start/{business,details,website,context,verify}` — all wired ✅
- **Workspace:** `/apps/[appId]` (hardcoded `glowstudio`), `/apps/[appId]/{get-started, opt-in, register, register/review, registration, ready, signup, signup/verify, settings}`
- **Public/marketing:** `/`, `/compliance`, `/sms/[category]`, `/sms/[category]/messages`, `/account`
- **Admin (not in nav):** `/admin`, `/admin/{registrations, customers, revenue}`
- **Dev-only:** `/registration-test`

**State management:** `context/session-context.tsx` — sessionStorage key `relaykit_prototype`. Separate `lib/wizard-storage.ts` uses key `relaykit_wizard`. `localStorage` key `relaykit_personalize` for personalization.

**Wired-vs-mock-vs-placeholder feature classification:**
| Feature | Status |
|---|---|
| Intake wizard Steps 1–6 | ✅ Wired (EIN + phone OTP are setTimeout stubs) |
| Workspace message CRUD (built-ins + customs) | ✅ Fully wired |
| Authoring-time compliance (opt-out + business-name) | ✅ Fully wired |
| Registration flow (frontend) | ✅ Wired; backend stubbed |
| Registration states (onboarding/building/pending/changes_requested/registered/rejected) | ✅ Full UI, mock data |
| Monitor mode + Test send + Preview list invite | 🟡 UI wired, send is 1.5s setTimeout |
| Ask Claude panel | 🟡 UI wired, composer is non-functional stub |
| Account page (`/account`) | 🟡 UI complete, all actions no-op brand-links |
| Registration-tracker metrics (Registered state) | 🟡 Mock data |
| Category landing for non-Appointments | ❌ Placeholder stub |
| `/sms/verification/messages` | ❌ Placeholder stub (page is hardcoded for Appointments, 1609 LOC) |
| Marketing message list | ❌ Hardcoded to Appointments only in `/apps/[appId]/page.tsx` |

**Alignment with PROTOTYPE_SPEC:** generally good; spec is actively maintained. Screens not mentioned in SPEC: `/admin/*`, `/registration-test`, `EditBusinessDetailsModal` (shipped Session 36 but not yet in SPEC narrative).

**Verdict on largest file:** `/prototype/app/sms/[category]/messages/page.tsx` is **1609 LOC** and entirely hardcoded for Appointments. Good candidate for data-driven refactor once content exists for other verticals.

---

### 2.5 `/supabase` — root-level, `/src`-era migrations

**State:** 9 migrations, dated 20260301–20260307. **Separate from `/api/supabase/migrations/`.** No `config.toml` tracked.

**Migration list:**
```
20260301000000_stripe_checkout_schema.sql
20260302000000_twilio_submission_engine.sql
20260305000000_phase2_project_id_guardrails.sql
20260305100000_message_plans.sql
20260306000000_messaging_proxy.sql
20260306100000_compliance_monitoring.sql
20260307000000_byo_waitlist.sql
20260307100000_stripe_events.sql
20260307200000_audit_fixes.sql
```

**Tables created:** `customers`, `registrations`, `message_usage`, `intake_sessions`, `message_plans`, `sms_opt_outs`, `recipient_consents`, `messages`, `webhook_endpoints`, `sandbox_daily_usage`, `twilio_api_log`, `registration_events`, `api_keys`, `message_scans`, `compliance_alerts`, `stripe_events`, `byo_waitlist`. 17 tables total.

**This is where inbound lives.** The root `messages` table has `direction CHECK IN ('outbound','inbound')`. `sms_opt_outs` tracks STOP processing. `webhook_endpoints.events` defaults to `{message.received}`.

**Twilio-named columns:** `registrations.twilio_{brand,campaign,messaging_service,phone_number,trust_product,end_user,address,vetting,subaccount}_sid`, `customers.twilio_subaccount_{sid,auth}`, `twilio_api_log` table. **Not yet renamed to `sinch_*` despite D-215.**

**RLS enabled on all tables, but no policies defined in any migration file.** Either they live outside version control or the tables are service-role-only. Not verifiable without DB access.

**Destructive migration:** `20260307200000_audit_fixes.sql` is marked "DESTRUCTIVE: Dev database only" and contains `DELETE FROM customers WHERE TRUE;` among other things. If this ever ran against production, data loss occurred.

**`.temp/` directory present** — local Supabase CLI state, not version control content.

**Live-DB verification:** not performed. Supabase MCP was available but the agent did not obtain credentials. **Flagged: cannot confirm whether migrations applied or whether prod DB drifted.**

---

### 2.6 `/api/supabase/` — second migrations tree

**State:** 5 migrations, different numbering scheme (001-005).

**Files:**
```
001_api_keys.sql
002_consent.sql
003_raw_key.sql
004_nullable_user_id.sql
005_messages_table.sql   ← exists but NOT applied (per MESSAGE_PIPELINE_SPEC)
```

**Tables:** `api_keys`, `consent`, `messages` (different shape from root `/supabase/messages`).

**The two `messages` table schemas differ:**
| Column | `/supabase/migrations/20260306000000_messaging_proxy.sql` | `/api/supabase/migrations/005_messages_table.sql` |
|---|---|---|
| body storage | `body_hash` only | `composed_text` (full body) |
| direction | `outbound`/`inbound` CHECK | absent — outbound-only |
| queued state | absent | `status` includes `queued` + `queued_until` TIMESTAMPTZ |
| carrier ref | `twilio_sid` | `carrier_message_id` (carrier-agnostic) |
| environment | `sandbox`/`live` CHECK | `sandbox`/`live` CHECK (same) |

**Two databases, two shapes for the same concept.** No documented migration plan from one to the other.

---

### 2.7 `/docs`

**Live docs at `/docs/` root:**
- `RELAYKIT_PRD_CONSOLIDATED.md` (2026-04-15) — product narrative
- `PRICING_MODEL.md` (v6.0, 2026-04-08) — pricing
- `PRD_SETTINGS_v2_3.md` (2026-04-15) — settings
- `VOICE_AND_PRODUCT_PRINCIPLES_v2.md` (stable) — Tier-1 project-knowledge
- `UNTITLED_UI_REFERENCE.md` (stable) — Tier-1
- `STARTER_KIT_PROGRAM.md` (2026-04-17) — post-launch backlog
- `AI_INTEGRATION_RESEARCH.md` (2026-04-15) — research dossier

**Sub-directories:**
- `/docs/plans/` — one file, `2026-03-08-ux-prototype.md` (superseded)
- `/docs/superpowers/` — CC internal artifacts. `/specs/2026-04-17-message-editor-tiptap-design.md` is the live architecture note for Tiptap.
- `/docs/archive/` — 22 historical files

---

### 2.8 `/docs/archive`

**Contents (22 files):** full PRD set (01–09) from Twilio-era, v3.0 pricing model, v1.0/v1.1 experience principles, old project overview, vision docs, build-spec validation log, compliance-page design reference.

**Key contradictions:**
- `PRD_04_TWILIO_SUBMISSION.md` describes the Twilio 10DLC pipeline in detail. `/src` still implements this, but D-215 (2026-03-23) changed the carrier to Sinch. The archive file has no deprecation notice.
- `PRICING_MODEL.md` (archive, v3.0) still describes the $199 setup model, which was replaced by $49 flat (D-320/D-334).
- `V4_EXPERIENCE_PRINCIPLES_v1.1.md` and `V4_-_RELAYKIT_EXPERIENCE_PRINCIPLES.md` are superseded by `/docs/VOICE_AND_PRODUCT_PRINCIPLES_v2.md`.
- `VISION_IMPLEMENTATION_MEMO.md` header says "consume and discard after implementation" — still present.

**Live-doc references into archive:**
- `STARTER_KIT_PROGRAM.md`, `AI_INTEGRATION_RESEARCH.md`, `PRICING_MODEL.md`, and `RELAYKIT_PRD_CONSOLIDATED.md` reference `PRD_02`, `PRD_07`, `PRD_09` by name in explanatory context ("PRD_02 has 6 base + 3 expansion messages..."). None are directive reads — all are historical references with supersession statements. No dangling directives.

---

## 3. Verification Codes Trace — End to End

**Scenario:** user lands on `/start`, clicks the "Verification codes" card, completes the wizard, lands on the workspace.

**Step 1 — Vertical card click:**
- File: `prototype/app/start/page.tsx`, lines 32–36
- Handler: `handleSelect("verification")` → `saveWizardData({ vertical: "verification" })` → `router.push("/start/business")`
- sessionStorage key `relaykit_wizard` now contains `{ vertical: "verification", ... }`

**Steps 2–6:** standard wizard flow, all wired, all stubs for EIN/phone OTP.

**Step 6 exit — wizard → workspace:**
- `/start/verify/page.tsx` line ~166 pushes to `/apps/glowstudio` (hardcoded)

**Workspace rendering:**
- File: `prototype/app/apps/[appId]/page.tsx` line 175:
  ```ts
  const categoryId = state.selectedCategory || "appointments";
  ```
- `state.selectedCategory` is NULL (it was never set — the wizard writes to a different storage key)
- **Result: user who picked "Verification codes" is now viewing the Appointments catalog.**

**What exists for Verification (if ever reached):**
- `data/messages.ts` lines 45–158: **8 messages fully defined** (login_code, signup_code, password_reset, mfa_code, device_confirmation, security_tip, welcome, feature_announcement) with variables (`{app_name}`, `{code}`, `{website_url}`, `{customer_name}`).
- `CATEGORY_VARIANTS.verification`: 2 variants ("standard", "action-first").
- `lib/catalog-helpers.ts`:
  - `getExampleValues("verification")` returns full variable map ✅
  - `getPrimaryBusinessVariable("verification") → "app_name"` ✅
  - All helpers support verification ✅
- `lib/intake/use-case-data.ts` lines 133–165: verification use-case scope defined (OTP, 2FA, phone verification, login codes; plus expansion options for welcome/notifications).

**What's missing:**
- `/sms/verification/page.tsx` — file renders "Category landing page coming soon" placeholder (category-landing page is Appointments-only, line 169 `isAppointments` check).
- `/sms/verification/messages/page.tsx` — the 1609-LOC file is hardcoded to Appointments content. Loading this route for verification shows the wrong messages.
- **No hydration logic** in workspace init that reads `relaykit_wizard.vertical` into `state.selectedCategory`.

**Verdict:** Verification codes is a **fully populated data vertical with a broken entry path**. The wizard card "works" in the sense that the click fires, but the user never reaches Verification content anywhere in the app. This is not a Verification-specific bug — the same is true for Orders, Support, Marketing, Internal, Community, and Waitlist. Only Appointments is reachable end-to-end.

---

## 4. Spec-to-Reality Gaps

### 4.1 MESSAGE_PIPELINE_SPEC.md

| Spec claim | Reality | Severity |
|---|---|---|
| Session A complete | ✅ matches | — |
| Session B blocked on Sinch account | ✅ matches — code is stubbed | — |
| Session C not started, buildable | ✅ matches | — |
| Consent API is "Future — needs its own session prompt" | ❌ **shipped and tested** already | **stale** |
| `MessageContext.queuedUntil: string` | Not in code `types.ts` | will need to add for Session C |
| `createApp(options)` accepts `carrierSender` | Code is `createApp(lookup, consentStore)` — no options | refactor needed for B |
| Pipeline currently `[normalize, interpolate, send, logDelivery]` | ✅ matches | — |
| Messages table migration not yet applied | ✅ matches (also `logDelivery` is stubbed) | — |
| `POST /v1/messages/preview` endpoint | not mentioned in pipeline spec, but **exists in code** (tested) | spec gap |
| Inbound message handling | **not mentioned in A/B/C or Future** | **gap** — see §5 |

### 4.2 SDK_BUILD_PLAN.md

| Spec claim | Reality | Severity |
|---|---|---|
| "Mock from Round 12, JavaScript, unbuilt" | Actual `/sdk` is TypeScript-strict, tsup-built, dual-published, v0.1.0, 8 namespaces, tests | **entire plan stale** |
| "TypeScript conversion: NOT STARTED" | done | stale |
| "tsup build pipeline: NOT STARTED" | done | stale |
| "All namespaces present at launch" | ✅ 8 namespaces, 30 methods | matches |
| `SendResult` shape: `{ success, messageId, error }` | Code: `{ id, status, reason }` — different | **API shape drift** |
| README.md | ❌ missing | real gap |
| AGENTS.md snippet generator | ❌ not built (research only in `docs/AI_INTEGRATION_RESEARCH.md` §8) | known backlog |
| `relaykit-0.0.1.tgz` / scoped bumps from 0.0.x | actual tgz is `relaykit-0.1.0.tgz` | minor version drift |
| "Follow-up sweep: PRICING_MODEL.md references `rk_sandbox_`" (per §9) | still present, plus PROTOTYPE_SPEC, WORKSPACE_DESIGN_SPEC, prototype code, `/src`, `/api/v1/signup/sandbox` | **widespread, unresolved** |

### 4.3 PROTOTYPE_SPEC.md

Generally current and well-maintained. Gaps:
- Screens not covered: `/admin/*`, `/registration-test`, `EditBusinessDetailsModal` (Session 36 addition).
- Raw-color violations still exist beyond the 3 lines flagged in CC_HANDOFF (see §5.8).
- No [IN PROGRESS] markers currently.

### 4.4 WORKSPACE_DESIGN_SPEC.md

Dated 2026-04-07 (Session 25). A large amount of subsequent work (D-320/321/322/323/324/325/326/327/328/329/330/331/332/333 + D-349 + D-351–357) partially supersedes the document:
- Get-Started step 10 still shows `RELAYKIT_API_KEY=rk_sandbox_7Kx9mP2vL4qR8nJ5` — needs to become `rk_test_*` per D-349.
- "Phase 3.7 Single-Page Workspace Build" marked NEXT. Per CC_HANDOFF / PROTOTYPE_SPEC, this appears to still be the target but actual workspace-page status isn't called out explicitly.
- References "Claude Support Slideout" and "App Doctor" as future — matches reality.

### 4.5 RELAYKIT_PRD_CONSOLIDATED.md

Dated 2026-04-15.
- Says "329+ decisions" — actual count is **D-357**. Minor staleness.
- Lists **5 API endpoints** (D-276): `POST /v1/messages`, `POST /v1/consent`, `GET /v1/consent/:phone`, `DELETE /v1/consent/:phone`, **`POST /v1/messages/preview`**, **`GET /v1/messages/:id`**. `/api` implements the first five. `GET /v1/messages/:id` is not implemented. MESSAGE_PIPELINE_SPEC doesn't mention either preview or GET-by-id endpoints — inconsistent across the spec set.
- Says "Production (committed, working code) ... Carrier submission pipeline (... built for Twilio, needs remapping to Sinch)" — accurately reflects `/src`.

### 4.6 PRICING_MODEL.md

Dated v6.0 2026-04-08. Live and canonical at `/docs/PRICING_MODEL.md`.
- Still says `rk_sandbox_` prefix (line 42: "Sandbox API key (`rk_sandbox_` prefix) — instant on signup") — conflicts with D-349.
- Lists "Inbound message forwarding (replies from verified number)" as a sandbox feature — no corresponding code in `/api`, only in `/src` (Twilio).
- Lists "Opt-out testing (STOP/START keyword handling)" as sandbox — only implemented in `/src/app/api/webhooks/inbound/[registrationId]/route.ts`, not `/api`.

---

## 5. Weirdness Log

Each entry: **what**, **where**, **best guess at explanation** (or "unexplained"), **severity**.

### 5.1 Verification wizard → workspace handoff broken
**Where:** `/prototype/app/apps/[appId]/page.tsx` line 175; no hydration from `lib/wizard-storage.ts → relaykit_wizard.vertical` into `state.selectedCategory`.
**Explanation:** the workspace was built before the wizard's vertical picker, or was built assuming the category would be set via direct `/sms/[category]` entry (which uses `setCategory()`). Wizard uses a separate storage key and never cross-writes.
**Severity:** medium — blocks any non-Appointments vertical from being demonstrated end-to-end.

### 5.2 SDK_BUILD_PLAN entirely stale
**Where:** `SDK_BUILD_PLAN.md`.
**Explanation:** SDK shipped between plan-author time and now, and the plan was never updated. The Status table at line 11–22 lists essentially everything as "NOT STARTED" despite dist/, tests, tgz all being present.
**Severity:** medium — new contributors will follow the plan and duplicate work.

### 5.3 SDK `SendResult` shape divergence
**Where:** `sdk/src/types.ts` vs `SDK_BUILD_PLAN.md` §8.
**Explanation:** unknown — shipped shape predates or diverges from plan. `/api` response at `api/src/routes/messages.ts` also doesn't return `success` boolean.
**Severity:** low-medium — contract drift between SDK-consumer expectations and actual response.

### 5.4 CLAUDE.md vs wizard storage key
**Where:** `CLAUDE.md` line 96 says "Wizard uses sessionStorage key `relaykit_intake`"; `prototype/lib/wizard-storage.ts` line 5 declares `WIZARD_STORAGE_KEY = "relaykit_wizard"`. Top-nav.tsx line ~79 also references `relaykit_intake` in a comment.
**Explanation:** key was renamed at some point, CLAUDE.md wasn't updated.
**Severity:** low — CC operating from CLAUDE.md could look for the wrong key.

### 5.5 Unpushed-commits drift in index vs handoff
**Where:** `REPO_INDEX.md` says "Unpushed local commits: 28"; `CC_HANDOFF.md` says "31 commits on top of Session 35's 5b0ced3".
**Explanation:** one wasn't updated after the final PM-review commits of Session 36.
**Severity:** low — PM orientation will be off.

### 5.6 PRICING_MODEL date drift in index
**Where:** `REPO_INDEX.md` table lists `PRICING_MODEL.md | 2026-03-15`. Actual file header says "Version 6.0 — April 8, 2026".
**Explanation:** the file was updated v5→v6 but REPO_INDEX wasn't refreshed.
**Severity:** low.

### 5.7 `rk_sandbox_` / `rk_test_` widespread drift
**Where (40+ files):** `PROTOTYPE_SPEC.md`, `DECISIONS.md`, `WORKSPACE_DESIGN_SPEC.md`, `SDK_BUILD_PLAN.md` itself, `docs/PRICING_MODEL.md`, `docs/PRD_SETTINGS_v2_3.md`, multiple `/prototype` screens (`get-started/page.tsx`, `settings/page.tsx`, `components/setup-instructions.tsx`), multiple `/src` files (`api/sandbox-key/route.ts`, `components/dashboard/sandbox-api-key-card.tsx`, `components/dashboard/live-api-key-card.tsx`), `/api/src/__tests__/*.ts`, `/api/src/routes/signup.ts`, `/api/supabase/migrations/001_api_keys.sql`.
**Explanation:** D-349 was recorded (2026-04-17) but no sweep followed. SDK_BUILD_PLAN §9 explicitly acknowledges this follow-up is "not blocking SDK build".
**Severity:** medium — a decision was made but the codebase and docs have not caught up.

### 5.8 Raw-color violations in prototype
**Where:** `/prototype/app/sms/[category]/messages/page.tsx` lines 1255, 1558 (`text-gray-500`); `/prototype/app/apps/[appId]/page.tsx` lines 737, 914 (`bg-gray-50`); `/prototype/components/top-nav.tsx` lines 247, 249 (`bg-gray-200`, `text-gray-500`). CC_HANDOFF flagged only lines 242/379/951 in `/sms/[category]/messages/page.tsx` — violations exist beyond that file.
**Explanation:** drift accumulated; sweep never happened.
**Severity:** low — cosmetic, would need to be fixed before production port.

### 5.9 `messages` table schema mismatch between `/supabase` and `/api/supabase`
**Where:** `/supabase/migrations/20260306000000_messaging_proxy.sql` vs `/api/supabase/migrations/005_messages_table.sql`.
**Explanation:** the two backends treat the `messages` table differently — `/src` stores `body_hash` (privacy-preserving) + supports inbound, `/api` stores `composed_text` (full body) + supports quiet-hours queuing, outbound-only.
**Severity:** medium — two competing schemas for the same table name. Migration plan from `/src` to `/api` is undefined.

### 5.10 `magic-link-form.tsx` implements OTP, not magic link
**Where:** `/src/components/auth/magic-link-form.tsx`.
**Explanation:** commit `d5cbdfb` "switch auth from magic link to email OTP" changed the implementation without renaming the file. D-03 recorded magic-link auth; actual code does OTP. D-59 mentions OTP as the direction for `/src`. Decision may have shifted without a corresponding D-number.
**Severity:** low — component works, name misleads.

### 5.11 Inbound story is split-brain
**Where:** `/src` has full implementation; `/api`, `/sdk`, `/prototype` have none; `MESSAGE_PIPELINE_SPEC.md` does not scope it; `PRICING_MODEL.md` advertises it.
**Explanation:** `/src` (Twilio) ships inbound via a per-registration webhook URL. The new `/api` architecture hasn't yet planned where inbound lives. PRICING_MODEL was written during or before `/src`-era, before MESSAGE_PIPELINE_SPEC existed.
**Severity:** **medium-to-high** — product promise versus implementation gap. Also a forward-looking blocker: if `/api` replaces `/src`, inbound needs a home.

### 5.12 Two supabase directories, no mapping
**Where:** `/supabase/` and `/api/supabase/`.
**Explanation:** `/supabase` is where `/src`'s Supabase project schema lives. `/api/supabase` is where the new backend's schema lives. These are likely the same Supabase project (unconfirmed without DB access) — in which case applying the `/api` migrations on top of `/src`'s would be a schema collision or merge; applying them to a separate project means `/api` runs against a different DB from `/src`.
**Severity:** **high** — this is the schema architecture question nobody has a written answer to.

### 5.13 Audit migration is destructive
**Where:** `/supabase/migrations/20260307200000_audit_fixes.sql` contains `DELETE FROM customers WHERE TRUE;` and similar. Header says "DESTRUCTIVE: Dev database only".
**Explanation:** author intended this file to be run only against dev, but the migrations directory is the single source of truth for schema — if a new environment bootstraps from these files, this destructive step will run.
**Severity:** medium — depends on whether migrations are being re-applied or only run once in the dev environment.

### 5.14 Twilio-named columns post-D-215
**Where:** `/supabase/migrations/20260302000000_twilio_submission_engine.sql` creates `twilio_api_log`, `twilio_subaccount_sid`, `twilio_brand_sid`, `twilio_campaign_sid`, etc. D-215 moved the carrier to Sinch.
**Explanation:** columns named after the carrier at time of creation. No rename migration.
**Severity:** low-medium — not breaking, but makes the Sinch transition a schema-rename task.

### 5.15 `/dev/intake` route live in production
**Where:** `/src/app/dev/intake/page.tsx`.
**Severity:** low-medium — should be gated.

### 5.16 AGENTS.md and Cursor rules: zero artifacts
**Where:** no `AGENTS.md` anywhere in the repo; no `.cursor/rules/` directory; no `.cursorrules` file. `STARTER_KIT_PROGRAM.md` §16 has the template, `AI_INTEGRATION_RESEARCH.md` §8 has a draft, but nothing is committed.
**Explanation:** the starter kit and AGENTS.md deployment are an explicitly post-launch backlog initiative.
**Severity:** low — matches the plan.

### 5.17 CLAUDE.md doesn't exist in `/prototype`, `/api`, `/sdk`, or `/src` subdirs
**Where:** only `/CLAUDE.md` at repo root.
**Explanation:** single source of truth for CC across all work. Fine — but if `/sdk` ships as a starter-embedded package, it might eventually need its own.
**Severity:** informational.

### 5.18 Dashboard version A/B state is stored but unread
**Where:** `session-context.tsx` stores `dashboardVersion: "a" | "b" | "c"`. No rendering code branches on it.
**Explanation:** likely abandoned A/B-test scaffolding from an earlier session.
**Severity:** low — dead state field.

### 5.19 `/apps/[appId]/auth/` page exists but is unreachable
**Where:** `/prototype/app/auth/page.tsx`.
**Severity:** low — possibly dead code.

### 5.20 No RLS policies in version control
**Where:** all migration files `ENABLE ROW LEVEL SECURITY` but define no `CREATE POLICY` statements.
**Explanation:** unknown — either policies live in the Supabase dashboard (outside VCS) or tables are service-role-only and unreadable by anon users.
**Severity:** medium — audit/security review would flag. Not verifiable without DB.

### 5.21 SDK `relaykit-0.1.0.tgz` pre-packed but not published
**Where:** `/sdk/relaykit-0.1.0.tgz`.
**Explanation:** prepped for `npm publish` but not yet pushed. SDK_BUILD_PLAN calls this "Step 6" and says version bumps start at `0.0.x`. Current version is 0.1.0.
**Severity:** low — ready-to-publish state.

### 5.22 VISION_IMPLEMENTATION_MEMO.md still present in archive
**Where:** `/docs/archive/VISION_IMPLEMENTATION_MEMO.md`.
**Explanation:** header says "consume and discard" — not discarded.
**Severity:** low — housekeeping.

### 5.23 No `.env.example` in `/api` or repo root
**Where:** nowhere. `/src` uses many env vars, `/api` uses `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`. PRICING_MODEL section 7 lists required Stripe env vars but no example file exists.
**Severity:** low-medium — onboarding friction, not correctness.

### 5.24 MARKETING_MESSAGES hardcoded to Appointments
**Where:** `/prototype/app/apps/[appId]/page.tsx`.
**Explanation:** only Appointments has marketing message data, so the list is category-gated with an Appointments hardcode.
**Severity:** low — aligned with "marketing hardcoded for Appointments only" note in CC_HANDOFF.

### 5.25 Compliance tab mock data in `/src`
**Where:** `/src/app/dashboard/compliance/page.tsx` (commit `77b1f57` "build compliance tab with mock data").
**Severity:** low — flagged-incomplete feature.

### 5.26 `hooks/` directory in `/src` mostly unused
**Where:** `/src/hooks/` (per agent report, "mostly unused").
**Severity:** low — possible dead directory.

---

## 6. Sinch Readiness

**What's ready:**
- Pipeline framework (`/api/src/pipeline/`) is the right shape for injection.
- `MessageContext` type has `carrierMessageId`, `status`, `failureReason` fields already.
- D-02 pattern (fetch-only) is well-established across both `/src/lib/twilio/client.ts` and `/api`.
- Session B spec (`MESSAGE_PIPELINE_SPEC.md` §B, ~200 LOC to implement) is self-contained and explicit.
- Test scaffolding (vitest, mocked fetch) is already in use in `/api`.

**What's not ready:**
- `createApp(lookup, consentStore)` signature has no `options` or `carrierSender` parameter — needs refactor to accept injection.
- `send` step is a pure `console.log` stub; must become `createSendStep(carrierSender?: CarrierSend)`.
- `log-delivery` step is a no-op; must write to `messages` table when Session B lands (needs a `SupabaseClient` injection or access to `/api/src/supabase/client.ts` singleton, plus running of migration 005).
- `MessageContext.queuedUntil` missing from type definition (blocks Session C prep but also relevant if Session B wants to distinguish queued rows).
- `/api/supabase/migrations/005_messages_table.sql` exists but is **not yet applied** to any database.
- `SINCH_SERVICE_PLAN_ID`, `SINCH_API_TOKEN`, `SINCH_NUMBER`, `SINCH_REGION` env vars unreferenced anywhere in code.
- No `.env.example` to document what needs to be set.

**What's completely absent:**
- No Sinch carrier module in either `/api` or `/src`.
- No Sinch inbound webhook receiver — inbound lives only in `/src`'s Twilio-specific endpoint `/api/webhooks/inbound/[registrationId]/route.ts`.
- No Sinch registration pipeline — `/src/lib/twilio/{brand,campaign,subaccount,vetting,phone-number}.ts` all Twilio-specific.
- No decision trail on how `/api` and `/src` relate during Sinch cutover: parallel deploys? `/src` feature-frozen? `/src` sunset?

**Effort estimate for Session B (per MESSAGE_PIPELINE_SPEC):** ~200–250 LOC production + ~100 LOC tests, plus migration 005 application, plus the `createApp` refactor. Self-contained per the spec.

**Session B ≠ Sinch readiness.** Session B only covers outbound delivery. Production Sinch migration also needs inbound handling, registration pipeline, and an answer to the `/src` vs `/api` co-existence question.

---

## 7. Recommendations for Next Session(s)

This audit recommends **no implementation work**. These are decisions and cleanups for Joel + PM to prioritize.

**Documentation reconciliation:**
1. Update `SDK_BUILD_PLAN.md` status table to match reality. Either: (a) rewrite as a post-ship plan covering README + AGENTS.md + publishing gates; or (b) mark superseded.
2. Reconcile SDK `SendResult` shape vs plan §8 vs `/api` response shape vs RELAYKIT_PRD_CONSOLIDATED §D-277 description. Pick one, update the others.
3. Fix `CLAUDE.md` wizard-storage-key reference (`relaykit_intake` → `relaykit_wizard`).
4. Fix `REPO_INDEX.md`: unpushed-commits count, PRICING_MODEL date, SDK status.
5. Update `RELAYKIT_PRD_CONSOLIDATED.md` decision count ("329+" → "357+"), and reconcile 5-endpoint list (`POST /v1/messages/preview` + `GET /v1/messages/:id`) against MESSAGE_PIPELINE_SPEC and SDK_BUILD_PLAN.
6. Add a deprecation header to `/docs/archive/PRD_04_TWILIO_SUBMISSION.md` and `/docs/archive/PRICING_MODEL.md`; delete `VISION_IMPLEMENTATION_MEMO.md` or add an "obsolete" note.

**Decisions needed (flagged, not made in this audit):**
7. **`rk_sandbox_` → `rk_test_` sweep.** D-349 is recorded but not applied. Decide: full sweep across code and docs as one session, or per-file as touched.
8. **Inbound architecture.** Where does inbound live in `/api`? Is it in-scope for Session B, a new Session (D?), or deferred? `PRICING_MODEL.md` advertises it; spec doesn't scope it; `/src` implements it Twilio-style.
9. **`/src` vs `/api` co-existence plan.** Two backends, two databases(?) with two different `messages` schemas. Parallel? Sunset date? Feature-freeze on `/src`?
10. **Verification (and all non-Appointments verticals) wiring.** Either build the workspace hydration fix (`state.selectedCategory ← wizard.vertical`) and accept that users land on a still-placeholder `/sms/*/messages` page, or ship Verification content first, or block the non-Appointments cards with a "coming soon" UI.
11. **`supabase/migrations/20260307200000_audit_fixes.sql`** destructive content — is this safe in version control? Should it be removed or moved out of the migrations directory?
12. **Twilio-named columns rename to carrier-agnostic.** Post-D-215 schema debt.
13. **RLS policies.** Where do they live? Commit to migrations or document the service-role-only posture.
14. **CLAUDE.md "magic-link auth" wording** (D-03) vs actual OTP implementation — is D-03 still operative, or is there a later decision that made OTP the canonical path? (Possibly D-59, possibly uncreated.)

**Low-priority cleanup:**
15. Rename `/src/components/auth/magic-link-form.tsx` → `email-otp-form.tsx`.
16. Gate or remove `/src/app/dev/intake`.
17. Remove unused `dashboardVersion` state field in `prototype/context/session-context.tsx`.
18. Investigate `/prototype/app/auth/page.tsx` — dead code?
19. Add `.env.example` files to `/api` and repo root.
20. Sweep raw-color violations in prototype (6 locations identified in §5.8 beyond the 3 in CC_HANDOFF).

---

## 8. Baseline Build Health

Run at audit time on `main` at commit `192cda4`:

| Project | Command | Result |
|---|---|---|
| `/api` | `npx tsc --noEmit` | ✅ exit 0 |
| `/sdk` | `npx tsc --noEmit` | ✅ exit 0 |
| `/prototype` | `npx tsc --noEmit` | ✅ exit 0 |
| `/api` tests | `npm test` (per agent report) | ✅ 12 files, 98 tests, all passing |
| `/sdk` tests | (per agent report) | ✅ vitest suite passing |
| `/prototype` lint | (no eslint config in `/prototype`) | N/A |

**Note:** `/src` and repo-root `tsc` were not run in this audit. `/src` lint/type baseline is not known as of this snapshot.

---

*End of audit.*
