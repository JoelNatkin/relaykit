# CC_HANDOFF.md — Session Handoff
**Date:** 2026-04-20 (Session 37 close-out — audit + MASTER_PLAN v1.0 + D-358–D-361)
**Branch:** main (all commits local, **NOT** pushed — PM review happens first)

---

## Commits This Session

Two commits added on top of Session 36's `192cda4`:

```
04655c9  docs(audit): session 37 — CURRENT_STATE_AUDIT.md repo inventory
[pending] docs: session 37 close-out — MASTER_PLAN v1.0, D-358–D-361, PM instructions rewrite
```

---

## What Was Completed

### CURRENT_STATE_AUDIT.md (commit `04655c9`, earlier today)
Full repo inventory. ~480 lines covering every directory, spec-to-reality gaps, 26-item weirdness log, Sinch readiness, and recommendations. Five parallel investigation agents fed the synthesis. No code modified. Key findings:

- **Verification-vertical wizard→workspace handoff is broken.** `state.selectedCategory` never reads from `relaykit_wizard.vertical`. Every non-Appointments pick lands on Appointments content. Data is fully populated in `data/messages.ts` + `catalog-helpers.ts`; the landing pages `/sms/[non-appointments]/messages` are hardcoded placeholders.
- **Inbound handling is split-brain.** `/src` has Twilio webhook receiver + STOP processing + `messages.direction='inbound'`; `/api`, `/sdk`, `/prototype` have none; MESSAGE_PIPELINE_SPEC Sessions A/B/C don't scope it; PRICING_MODEL advertises it as sandbox.
- **Two parallel backends** (`/src` Next.js+Twilio deployed, `/api` Hono+Sinch-shaped not deployed) with two separate `supabase/migrations/` dirs and differently-shaped `messages` tables.
- **D-349 (`rk_sandbox_` → `rk_test_`) never swept.** 40+ files still use the old prefix.
- **SDK_BUILD_PLAN entirely stale.** `/sdk` already shipped as TypeScript-strict v0.1.0 dual-published package with `relaykit-0.1.0.tgz` pre-packed; plan still describes a JS mock needing conversion. `SendResult` shape diverges from plan; README missing.

### MASTER_PLAN.md v1.0
New canonical launch plan at repo root — 461 lines, 10 phases, North Star, ranked customer values (fast registration added as the Sinch differentiator), working principles, out-of-scope list (§16), risks (§17). Adopted per D-359.

### Four decisions recorded (D-358–D-361)
- **D-358: /src sunset.** Rebuild registration pipeline, inbound, dashboard, billing webhooks, sandbox key management, compliance monitoring on `/api` + Sinch across MASTER_PLAN Phases 2–5. `/src` will not be maintained, federated, or preserved as fallback.
- **D-359: MASTER_PLAN.md v1.0 adopted as canonical launch plan.** Reference for scope decisions, phase prioritization, conflict resolution. Each CC session reads at start alongside DECISIONS.md / CC_HANDOFF.md / PROTOTYPE_SPEC.md.
- **D-360: OTP/Verification available both as cross-vertical auth primitive AND as its own dedicated vertical.** Every vertical can use OTP methods regardless of primary use case; Verification remains a standalone vertical for developers whose app IS identity verification.
- **D-361: Review-request templates ship at launch as template additions within applicable verticals.** Developer supplies review URL at authoring time. Not a standalone vertical.

### REPO_INDEX.md updates
- Meta: `Last updated`, `Decision count` (D-357 → D-361), `Master plan last updated` bumped, unpushed-commits note updated.
- Canonical docs table: `MASTER_PLAN.md` and `CURRENT_STATE_AUDIT.md` added; `SDK_BUILD_PLAN.md` flagged stale; `STARTER_KIT_PROGRAM.md` noted superseded by Phase 9; `PRICING_MODEL.md` date corrected to v6.0 / 2026-04-08.
- Subdirectory descriptions rewritten for `/src` (sunset), `/sdk` (shipped-ahead), `/api` (Session B unblocked), `/supabase` (slated for archive), added `/experiments/` (planned).
- Build spec status table: Session B flipped BLOCKED → UNBLOCKED; Session C deferred; SDK_BUILD_PLAN marked stale; vertical hydration added as NOT STARTED (Phase 6).
- Active plan pointer: Phase 0 ACTIVE, Phase 1 unblocked and running in parallel. D-358/D-359 references removed from "not yet recorded" — they're recorded now.
- Change log: new Session 37 close-out entry.

### PM_PROJECT_INSTRUCTIONS.md rewrite
~273 lines of diff across the file. Paste into Claude.ai UI before next browser chat per existing sync protocol.

### /experiments/ directory
Planned but not yet created — will house Phase 1 Sinch proving-ground experiments + `experiments-log.md`.

---

## Current State

**Phase 0 (doc reconciliation + architectural decisions) — ACTIVE.** Four of the phase's decisions landed this session (D-358, D-359, D-360, D-361). Remaining Phase 0 work is doc-reconciliation cleanup (see suggested next tasks below).

**Phase 1 (Sinch proving-ground experiments) — UNBLOCKED, ready to begin in parallel.** Sinch account active, $100 credit, phone number ready to provision. Goal: prove the Sinch surface (send, inbound, registration) with throwaway code in `/experiments/` before touching production pipeline.

**Later phases (2–9):** Covered in `MASTER_PLAN.md`. Phase 2 is Session B / Sinch send wiring, gated on Phase 1 findings. Phases 3–5 rebuild what `/src` does (registration, inbound, dashboard) on `/api`. Phase 8 publishes the SDK (npm + README + AGENTS.md). Phase 9 is the starter-kit integration strategy.

---

## Quality Checks Passed

- **`tsc --noEmit` clean** on `/api`, `/sdk`, `/prototype` at close-out time.
- **ESLint:** not run — no `/prototype` eslint config (unchanged from prior sessions). `/api` and `/sdk` eslint not exercised this session (docs-only work).
- **No code modified** this session. All changes are to documentation files.

---

## In Progress / Partially Done

Carried forward (unchanged this session — most items now covered by MASTER_PLAN Phases 2–9):
- Signup backend stubbed (D-59)
- EIN verification backend stubbed (D-302/D-303)
- Phone OTP stubbed (D-46)
- Marketing messages hardcoded for Appointments only
- Ask Claude panel chat composer is a non-functional stub
- Preview list invite flow is a 1.5s `setTimeout` — no real SMS yet
- Registered state metrics are mock data
- Marketing-only registration tracker transitions are prototype dropdowns
- Settings Notifications toggle has no backend wiring
- Cancel plan + Regenerate live key modals are close-modal no-ops
- `/account` actions all brand-link no-ops

Deferred (from Session 36):
- **Archive modal redesign** — proposed copy confirmed, visual redesign still pending. Possibly folds into Phase 6 workspace polish.

---

## Gotchas for Next Session

1. **Session 36's 31 commits + Session 37's audit commit + Session 37's close-out commit are all still local.** Push is gated on PM approval after this close-out.

2. **MASTER_PLAN.md is now canonical.** CC must read at session start alongside DECISIONS.md, CC_HANDOFF.md, PROTOTYPE_SPEC.md. Per D-359 it is the reference for scope decisions, phase prioritization, and conflict resolution.

3. **/src is slated for sunset (D-358) — no modifications.** Capabilities are being rebuilt on `/api` + Sinch across Phases 2–5. Do not add features, fix bugs, or port files into `/src` unless Joel explicitly overrides.

4. **SDK_BUILD_PLAN.md is stale per audit §4.2.** Do not read it as a build source until Phase 0 reconciles it. Current SDK reality is documented in `CURRENT_STATE_AUDIT.md` §2.3 (shipped, v0.1.0, tsup-built, tests green, tgz packed, not yet published; missing README and AGENTS.md).

5. **`/api/supabase/migrations/005_messages_table.sql` is still unapplied.** Deferred to Phase 2 (Session B) per MESSAGE_PIPELINE_SPEC. Do not apply out-of-band.

6. **`/supabase/migrations/20260307200000_audit_fixes.sql` is destructive.** Contains `DELETE FROM customers WHERE TRUE;` — marked dev-only but lives in the migrations directory. Flagged in audit §5.13 for Phase 0 decision.

7. **Two `messages` table schemas exist** — root `/supabase/` (body_hash, direction CHECK inbound/outbound, Twilio-named) vs `/api/supabase/005_messages_table.sql` (composed_text, outbound-only, carrier-agnostic). Phase 3 (database reconciliation) resolves this.

8. **Verification-vertical workspace hydration is broken.** Audit §3 has the full trace. Data is complete; the fix is a small hydration in workspace init. Covered by MASTER_PLAN Phase 6. Until then, only Appointments is reachable end-to-end via the wizard.

9. **`rk_sandbox_` / `rk_test_` drift.** D-349 recorded 2026-04-17; still unswept across 40+ files. Phase 0 should include the sweep.

10. **PM_PROJECT_INSTRUCTIONS.md changed substantially** (~273 lines). If PM is starting a new Claude.ai browser chat, they need the updated paste.

11. **`api/node_modules/` is untracked intentionally.** Do not `git add -A`.

12. **`.next` cache recurring issue** — prototype dev server was stopped, `.next` deleted, and restarted as part of this close-out.

---

## Files Modified This Session

### Added
```
CURRENT_STATE_AUDIT.md                   # Session 37 audit (committed earlier in this session as 04655c9)
MASTER_PLAN.md                           # v1.0 canonical launch plan (D-359)
```

### Modified
```
DECISIONS.md                             # +D-358, +D-359, +D-360, +D-361
REPO_INDEX.md                            # Meta bump, new files registered, subdirs rewritten, change log
PM_PROJECT_INSTRUCTIONS.md               # Substantial rewrite (~273 lines of diff)
CC_HANDOFF.md                            # This file
```

### Deleted
None.

### Not modified (but flagged for Phase 0)
```
SDK_BUILD_PLAN.md                        # Stale — rewrite in Phase 0
CLAUDE.md                                # Wizard key drift (relaykit_intake → relaykit_wizard per audit §5.4)
docs/RELAYKIT_PRD_CONSOLIDATED.md        # "329+ decisions" should be 361+; endpoint list reconciliation
MESSAGE_PIPELINE_SPEC.md                 # Move consent API from Future to Shipped; note Phase 1 dependency for B
docs/PRICING_MODEL.md                    # Still references rk_sandbox_; inbound claim needs reconciling with Phase 3 plan
WORKSPACE_DESIGN_SPEC.md                 # Get-started step still shows rk_sandbox_*
docs/archive/PRD_04_TWILIO_SUBMISSION.md # Needs deprecation header per D-358
docs/archive/PRICING_MODEL.md            # Archive v3.0 needs deprecation header
docs/archive/VISION_IMPLEMENTATION_MEMO.md # "Consume and discard" — candidate for deletion
```

---

## Suggested Next Tasks (Phase 0 focused, with Phase 1 in parallel)

**Phase 0 — doc reconciliation:**

1. **Rewrite `SDK_BUILD_PLAN.md`** to reflect shipped state + remaining work. Current SDK is v0.1.0 TypeScript-strict dual-published; remaining work is README (13 sections per original plan §3), AGENTS.md template (per `docs/AI_INTEGRATION_RESEARCH.md` §8), and npm publication (MASTER_PLAN Phase 8). Reconcile `SendResult` shape drift while rewriting.

2. **Fix `CLAUDE.md` wizard storage key** — `relaykit_intake` → `relaykit_wizard` per audit §5.4. Also reconcile D-03 (magic-link wording) against actual OTP implementation in `/src`.

3. **Update `RELAYKIT_PRD_CONSOLIDATED.md`** — decision count "329+" → "361+"; endpoint list reconciliation (`POST /v1/messages/preview` + `GET /v1/messages/:id` claims vs MESSAGE_PIPELINE_SPEC vs `/api` reality).

4. **Update `MESSAGE_PIPELINE_SPEC.md`** — move consent API from Future to Shipped (it's done + tested); add note that Session B start depends on Phase 1 experiment findings; add `queuedUntil` to documented `MessageContext` or drop from future Session C plan.

5. **Archive deprecations** — add deprecation headers to `/docs/archive/PRD_04_TWILIO_SUBMISSION.md` (Twilio sunset per D-358) and `/docs/archive/PRICING_MODEL.md` (v3.0 superseded by v6.0). Consider deleting `VISION_IMPLEMENTATION_MEMO.md` per its own "consume and discard" header.

6. **`rk_sandbox_` → `rk_test_` sweep** across code + docs per D-349. 40+ files; audit §5.7 has the full list.

7. **Document `/src` sunset plan** somewhere visible — which `/src` capabilities feed which MASTER_PLAN phases. Could live in MASTER_PLAN itself or a new `SRC_SUNSET.md`.

**Phase 1 — Sinch experiments (in parallel):**

8. **Experiment 1:** provision a Sinch phone number and send a single SMS to Joel's phone. Capture every API response, header, latency in `/experiments/experiments-log.md`. Throwaway code; goal is to discover the Sinch surface shape, not write production code.

(Further experiments per MASTER_PLAN Phase 1.)

---

*End of close-out.*
