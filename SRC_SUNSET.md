# SRC_SUNSET.md — `/src` Capability-to-Phase Map

> **Authority:** D-358 (`/src` sunset — rebuild on `/api` + Sinch). MASTER_PLAN.md phases 2–5 drive the rebuilds.
> **Purpose:** Answer the question "where does `/src` capability X get rebuilt, and when?" for every capability surviving in the frozen legacy app.
> **Companion to:** MASTER_PLAN.md (scope per phase), docs/archive/CURRENT_STATE_AUDIT.md §2.1 (source-of-truth `/src` inventory).
> **Last updated:** 2026-04-21 (Session 41 — Phase 0 Group F)
> **Retires:** when Phase 5 demo passes and all non-excluded capabilities are marked "rebuilt." Moves to `docs/archive/` with a deprecation header citing MASTER_PLAN.md §9 completion.

---

## 1. Preamble

`/src` is the Twilio-era Next.js production app. It is in feature-freeze per D-358 — no modifications, no porting, no federation with `/api`. Capabilities live there only until MASTER_PLAN.md's phases 2–5 rebuild each one cleanly on `/api` + Sinch.

This doc is read at the start of any phase that touches a listed capability. It does not drive implementation — the owning phase's MASTER_PLAN section does. Its job is the mapping: which `/src` routes and modules retire, where the replacement lands, and which phase is on the hook.

When a row's rebuild ships, update its Status column with the commit SHA(s). When Phase 5 closes and no row reads anything other than "Rebuilt" or "Excluded," this file retires.

---

## 2. Capability map

Ordered by target phase (2 → 3 → 4 → 5), then by size within phase. Phase 0 entries appear at the end as completed cross-reference.

### Phase 2 — Session B outbound delivery

| Capability | `/src` source | Target `/api` location | Status / open questions |
|---|---|---|---|
| Outbound send pipeline | `/src/app/api/v1/messages/route.ts` + `/src/lib/proxy/*` + `/src/lib/twilio/client.ts` | `/api/src/routes/messages.ts` (exists) + `/api/src/pipeline/steps/send.ts` (stub today) + new `/api/src/carrier/sinch.ts` | Session A complete (validate/normalize/interpolate + log stubs). Session B replaces send-step stub with real Sinch call + real DB write, depends on Phase 1 Experiment 1 fixture. MASTER_PLAN §6. |
| Delivery status webhook | `/src/app/api/webhooks/status/[registrationId]/route.ts` | Likely `/api/src/routes/webhooks/status.ts` (new) or part of Session B carrier module. | **Open-F-1** (see §4). MASTER_PLAN §6 doesn't scope a status receiver explicitly. Phase 1 Experiment 1 should surface Sinch's delivery-status callback shape. |

### Phase 3 — Database reconciliation

| Capability | `/src` source | Target `/api` location | Status / open questions |
|---|---|---|---|
| Root `/supabase/` migrations | `/supabase/migrations/**` | Archived to `/docs/archive/supabase-twilio-era/` | Covered directly by MASTER_PLAN §7. Twilio-named columns (`twilio_sid` → `carrier_message_id`, etc.) renamed during the extension of `/api/supabase/migrations/005_messages_table.sql` (or a new 006). Destructive `20260307200000_audit_fixes.sql` already banner-guarded by Session 39 Group A #2; Phase 3 quarantines or removes it. |

### Phase 4 — Inbound message handling

| Capability | `/src` source | Target `/api` location | Status / open questions |
|---|---|---|---|
| Inbound message webhook | `/src/app/api/webhooks/inbound/[registrationId]/route.ts` | New `/api/src/routes/webhooks/inbound.ts` | MASTER_PLAN §8. Scoped: signature verification, registration lookup, consent-ledger update on STOP/START, developer-webhook forwarding, inbound storage. Depends on Phase 1 Experiment 2 (inbound payload) + Experiment 5 (carrier STOP behavior). |
| STOP/START/HELP handling | Inline logic inside `/src/app/api/webhooks/inbound/[registrationId]/route.ts` | Part of the Phase 4 inbound route + consent-store integration (`/api/src/supabase/consent-store.ts` exists from Session A Consent API) | MASTER_PLAN §8. Shape depends on Phase 1 Experiment 5 — if Sinch handles carrier-layer opt-outs natively, Phase 4 only updates the ledger from the notification; otherwise Phase 4 implements parsing + suppression. |
| Opt-out API | `/src/app/api/v1/opt-outs/route.ts` + `/src/app/api/v1/opt-outs/[phoneNumber]/route.ts` | Likely folded into existing `/api/src/routes/consent.ts` (shipped Session A — record/check/revoke) | Functional overlap with the shipped Consent API. Confirmed separate surface today on `/src`; candidate for Phase 4 consolidation into `/api` consent endpoints rather than a standalone rebuild. |
| Developer webhook CRUD | `/src/app/api/v1/webhooks/route.ts` + `/src/app/api/v1/webhooks/[webhookId]/route.ts` | New `/api/src/routes/webhooks/settings.ts` + a DB table for per-registration webhook URLs | **Open-F-2** (see §4). Phase 4 scopes *forwarding to* a developer webhook but not the CRUD to register/update/delete the URL. Candidate for Phase 4 (pairs with forwarding) or Phase 7 (dashboard/deployment). |

### Phase 5 — Registration pipeline + billing + auth

| Capability | `/src` source | Target `/api` location | Status / open questions |
|---|---|---|---|
| Carrier registration pipeline | `/src/app/api/otp/route.ts`, `/src/app/api/phone-verify/route.ts`, `/src/app/api/cron/poll-registrations/route.ts`, `/src/lib/twilio/{brand,campaign,messaging-service,phone-number,poll,vetting,subaccount}.ts` (7 files) | New `/api/src/registration/*` + new `/api/src/carrier/sinch-registration.ts`. UI wires `/prototype` registration flow to `/api` endpoints. | MASTER_PLAN §9. Brand + campaign submission, state transitions (Building → Pending → Registered), polling, UI wiring. Depends on Phase 1 Experiments 3 & 4. Sole-prop OTP (3-use lifetime per D-22) reuses or supersedes Twilio Verify path. |
| Account management | `/src/app/api/v1/account/route.ts` | New `/api/src/routes/account.ts` (likely Phase 5) or Phase 7 dashboard | Covered by MASTER_PLAN §9 UI-wiring bullet implicitly. Thin endpoint today in `/src`; rebuild scope clarified at Phase 5 kickoff. |
| Stripe webhooks | `/src/app/api/webhooks/stripe/route.ts` (225 LOC) | New `/api/src/routes/webhooks/stripe.ts` | MASTER_PLAN §9 Phase 5 registration context. Includes the two `/src` TODOs: payment-failed email + 7-day grace period, pause Messaging Service via carrier API. |
| Stripe checkout | `/src/app/api/checkout/route.ts` | New `/api/src/routes/checkout.ts` | **Open-F-3** (see §4). Phase 5 demo moment says "pays $49" — implies checkout lives there — but §9 scoping bullets don't enumerate it. |
| Auth system (passwordless email) | `/src/utils/supabase/{browser,server,middleware}.ts`, `/src/middleware.ts`, `/src/components/auth/magic-link-form.tsx` (OTP despite filename, per D-03 reconciliation) | Phase 5 auth rebuild — exact shape TBD (Hono middleware + Supabase Auth wiring) | **Open-F-4** (see §4). CLAUDE.md says "`/api` rebuild revisits auth mechanism in Phase 5"; MASTER_PLAN §9 does not enumerate auth. Mechanism stays passwordless-email family (D-03/D-59); D-03 reconciliation already closed in Session 38. |
| Dashboard UI | `/src/components/**` (176 files) + `/src/app/**` (non-API pages, 40 files) | `/prototype/*` screens become production, backed by `/api`. `/src` dashboard code is not ported line-for-line. | MASTER_PLAN §9 (registration UI wiring) + §10 (Phase 6 vertical hydration for the workspace shell). The port is `/prototype` → production with `/api` backend, not `/src` → anywhere. |
| Compliance monitoring | `/src/app/api/compliance/alerts/route.ts` + compliance tab in `/src/components/**` | New `/api/src/routes/compliance/*` + dashboard wiring | **Open-F-5** (see §4). Audit §5.25 flags the compliance tab in `/src` as mock-data — so "rebuild" is closer to "build for the first time." Phase 5 target per D-358; exact scope set at Phase 5 kickoff. |
| Compliance site preview | `/src/app/api/preview-site/route.ts` | Either `/api` or the compliance site (msgverified.com) build — depends on Phase 5's compliance-site decision. | MASTER_PLAN §9 notes msgverified.com is scoped "if Sinch's flow expects us to host this" — Phase 1 Experiment 3 informs. Candidate for Phase 5 or retirement if unused. |

### Phase 0 (already done)

| Capability | `/src` source | Target `/api` location | Status / open questions |
|---|---|---|---|
| Sandbox API key management | `/src/app/api/sandbox-key/route.ts` (mints `rk_sandbox_*`) | `/api/src/routes/signup.ts` (endpoint `POST /v1/signup/sandbox`) + `/api/src/supabase/key-lookup.ts` | **Rebuild:** shipped in `/api` Session A (pre-Phase 0). Bcrypt hash, rate limit 5/hr/IP, prefix lookup table, tests green. **Prefix flip per D-349:** Phase 0 Group E, 2026-04-21 (commits `136f2b5`/`7dcb02f`/`b093af0`) — generated prefix is now `rk_test_*`. |

### Excluded / not-rebuilt

| `/src` source | Reason |
|---|---|
| `/src/app/api/byo-waitlist/route.ts` | BYO Twilio is out of scope for launch per MASTER_PLAN §16. Retires with `/src`. Post-launch feature. |
| `/src/app/api/use-case/route.ts` | Intake-wizard use-case logic now lives in `/prototype/lib/intake/*`. `/prototype` is the UI source of truth per CLAUDE.md. No `/api` equivalent needed. |
| `/src/app/api/build-spec/route.ts`, `/src/app/api/deliverable/route.ts`, `/src/app/api/message-plan/route.ts` | Blueprint/prompt-generation endpoints from the pre-SDK authoring era. Superseded by the `/sdk` package + `/prototype` message authoring flow. No `/api` equivalent planned. |
| `/src/app/dev/intake` | Dev-only route visible in production — audit §5.15 weirdness, not a capability. Retires with `/src`. |
| `/src/app/auth/page.tsx` | Unreachable page per audit §5.19. Retires with `/src`. |
| `/src/hooks/**` | Mostly unused per audit §5.26. Retires with `/src`. |
| `/src/lib/twilio/**` (all 21 files) | Twilio-specific; superseded by Sinch per D-215. Concept-reference only during Phase 5 rebuild; no port. |
| AES-256-GCM encryption for Twilio subaccount tokens (`/src/lib/twilio/subaccount.ts`) | Utility retires naturally if Sinch doesn't use a subaccount model. Phase 1 reveals. If Sinch does require encrypted tenant credentials, rebuild in Phase 5; otherwise retires. |

---

## 3. What this is NOT

1. **Not a migration checklist.** No "steps to port `/src/x` to `/api/y`." Rebuilds happen in target phases using MASTER_PLAN's per-phase scoping.
2. **Not a code-porting guide.** `/src` code does not get ported line-for-line. Capabilities get rebuilt against Sinch with clean Hono/TS. Reading `/src` code for concept reference is fine; cargo-culting it isn't.
3. **Not a decision document.** No new decisions live here. D-358 is the sunset authority; MASTER_PLAN phases 2–5 are the rebuild authority. Unresolved mappings surface as **Open-F-N** for target-phase resolution, not D-entries.
4. **Not a status tracker.** MASTER_PLAN phase summaries and CC_HANDOFF carry status. This doc's Status column updates only when a row's rebuild ships.
5. **Not a replacement for MASTER_PLAN.** "What does Phase 4 build?" → MASTER_PLAN §8. "Which `/src` capabilities does Phase 4 replace?" → this doc.

---

## 4. Open questions (decision surface)

Five mappings where the target-phase scope in MASTER_PLAN.md doesn't yet specify the answer. Each resolves at the relevant phase kickoff — not in Phase 0 Group F.

| # | Capability | Question | Target-phase forum |
|---|---|---|---|
| **Open-F-1** | Delivery status webhook | Does Phase 2 Session B include Sinch's delivery-status callback receiver, or is it a separate sub-phase / Phase 4 companion? | Phase 2 Session B kickoff (post-Phase 1 Experiment 1). |
| **Open-F-2** | Developer webhook CRUD | Does Phase 4 include the CRUD endpoints for developers to register/update/delete webhook URLs, or does that defer to Phase 7 (dashboard/deployment)? | Phase 4 kickoff. |
| **Open-F-3** | Stripe checkout | Confirm Phase 5 owns Stripe checkout rebuild (currently implied by the "pays $49" demo moment but not enumerated in MASTER_PLAN §9 bullets). | Phase 5 kickoff. |
| **Open-F-4** | Auth system | Confirm Phase 5 scopes the auth rebuild. CLAUDE.md points there; MASTER_PLAN §9 does not enumerate it. | Phase 5 kickoff. |
| **Open-F-5** | Compliance monitoring | `/src` compliance tab is mock-data per audit §5.25 — confirm that "rebuild compliance monitoring" in MASTER_PLAN means "design + build for the first time," not "port existing." | Phase 5 kickoff. |

None of these block Phase 0 close-out. They surface here so target-phase planning sessions don't rediscover them cold.

---

## 5. Retirement

This doc retires when:

1. Phase 5 demo moment passes (a simulated new customer completes registration → go-live via Sinch).
2. Every non-excluded row's Status column reads "Rebuilt" with a commit SHA.
3. Open-F-1 through Open-F-5 are resolved with decisions recorded in DECISIONS.md (if appropriate) or closed inline by the owning phase's plan.

At that point, the file moves to `docs/archive/` with a deprecation header citing MASTER_PLAN.md §9 completion. Until then, it lives at repo root as a Phase 2–5 reference companion.

---

*End of SRC_SUNSET.md.*
