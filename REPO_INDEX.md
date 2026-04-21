# REPO_INDEX.md

> **Purpose:** Single source of truth for repo state. PM reads this at every browser chat start to orient without guessing. CC maintains it at every close-out.

---

## Meta

- **Last updated:** 2026-04-21 (Session 40 close-out — Phase 0 Group E complete; three atomic commits pushed mid-session after PM approval)
- **Decision count:** D-362 (next available: D-363). No new D-numbers this session; D-285 gained an appended partial-supersession note citing D-349 (not a new decision).
- **Master plan last updated:** 2026-04-21 (v1.0 — L100 past-tensed with Group E completion annotation; L366 Phase 10 bullet deleted. No version bump — both changes are subtask clarifications, not scope changes per PM direction.)
- **Active CC session branch:** main
- **Unpushed local commits:** 1 unpushed (this close-out). All three Group E commits (`136f2b5`, `7dcb02f`, `b093af0`) pushed to `origin/main` mid-session after PM approval; push pointer `d6a2c7a..b093af0`. Close-out push pending PM approval.

---

## Tier classification for browser chat uploads

**Tier 1 — Claude.ai project knowledge (permanent, rare updates):**
- `docs/VOICE_AND_PRODUCT_PRINCIPLES_v2.md`
- `docs/UNTITLED_UI_REFERENCE.md`

**Tier 2 — Upload at every browser chat start:**
- `REPO_INDEX.md` (this file)
- `MASTER_PLAN.md`
- `CC_HANDOFF.md`
- `PM_HANDOFF.md` (only if rotating chats)

**Tier 3 — Upload on demand when topic comes up:**
- Everything else below

---

## Canonical docs (repo root)

| File | Last touched | Purpose |
|------|-------------|---------|
| `REPO_INDEX.md` | 2026-04-21 | This file |
| `MASTER_PLAN.md` | 2026-04-20 | Holistic 10-phase launch plan, North Star, customer values ranking, out-of-scope list, risks (v1.0) |
| `PM_PROJECT_INSTRUCTIONS.md` | 2026-04-21 | Canonical PM instructions (synced to Claude.ai UI) |
| `CLAUDE.md` | 2026-04-21 | CC standing instructions (111 lines; file-size discipline added Session 39 — keep under 200, target ~80) |
| `DECISIONS.md` | 2026-04-21 | Active decisions D-84+, index of D-01–D-83 |
| `DECISIONS_ARCHIVE.md` | (stable) | Full text of D-01–D-83 |
| `PROTOTYPE_SPEC.md` | 2026-04-21 | Screen specs for `/prototype`. Session 40 Group E: example API key in Get-Started step flipped to `rk_test_` per D-349. |
| `WORKSPACE_DESIGN_SPEC.md` | 2026-04-21 | Post-signup workspace architecture. Session 40 Group E: example API key flipped to `rk_test_` per D-349. |
| `MESSAGE_PIPELINE_SPEC.md` | 2026-04-21 | `/api` pipeline — Session A + Consent API (complete), Session B (gated on Phase 1), Session C (not started) |
| `SDK_BUILD_PLAN.md` | 2026-04-21 | `/sdk` retrospective (v0.1.0 shipped) + Phase 8 delivery spec (README, AGENTS.md, npm publish). Rewritten Session 39 (Phase 0 Group D); Session 40 Group E flipped §status-table and §7 follow-up from Pending to Complete. |
| `CURRENT_STATE_AUDIT.md` | 2026-04-21 | Session 37 audit — repo inventory, spec drift, weirdness log, Sinch readiness, recommendations. Session 40 Group E: resolution banner appended to §5.7; §1/§2/§4/§7 preserved as frozen snapshot. |
| `CC_HANDOFF.md` | 2026-04-21 | Previous CC session state |
| `BACKLOG.md` | 2026-04-10 | Parked ideas, never build without promotion |
| `README.md` | (stable) | Repo readme |

---

## Canonical docs (`/docs`)

| File | Last touched | Purpose |
|------|-------------|---------|
| `RELAYKIT_PRD_CONSOLIDATED.md` | 2026-04-21 | Product narrative, what's built, what's next |
| `PRICING_MODEL.md` | 2026-04-21 (v6.0) | Tier definitions, costs, pricing logic. Session 40 Group E: `rk_sandbox_`→`rk_test_` prefix flip in the sandbox-key-included bullet. No version bump — D-349 application, not a pricing-logic change. |
| `PRD_SETTINGS_v2_3.md` | 2026-04-15 | Settings page spec |
| `VOICE_AND_PRODUCT_PRINCIPLES_v2.md` | (stable) | Copy rules (Tier 1 in project knowledge) |
| `UNTITLED_UI_REFERENCE.md` | (stable) | Design system reference (Tier 1 in project knowledge) |
| `STARTER_KIT_PROGRAM.md` | 2026-04-17 | Starter kit strategy — superseded by MASTER_PLAN Phase 9 (third-party integration over building our own) |
| `AI_INTEGRATION_RESEARCH.md` | 2026-04-15 | AGENTS.md, Resend analog, tool prompts |

---

## Subdirectories

### `/docs/archive` (superseded, not operational)

Historical PRDs, vision docs, old strategy. CC does not read these unless Joel directs to a specific one.

Notable contents: `BUILD_SPEC_VALIDATION_LOG.md` (25 experiment rounds), Twilio-era PRDs (01–09), early vision docs, superseded design references.

Deprecation headers added Session 38: `PRD_04_TWILIO_SUBMISSION.md` (cites D-358), `PRICING_MODEL.md` (superseded by v6.0). `VISION_IMPLEMENTATION_MEMO.md` deleted Session 38 per its own "consume and discard" header — D-104's reference to it is now accompanied by a supersession note pointing to D-358.

### `/docs/plans`

Old UX prototype plans. Currently contains `2026-03-08-ux-prototype.md`. Superseded by current prototype + PROTOTYPE_SPEC; keeping for history only.

### `/docs/superpowers`

CC's internal artifacts from the `superpowers` skill (claude-plugins-official). CC-managed. PM does not touch. Current design docs under `/specs`: `2026-04-17-message-editor-tiptap-design.md` (Tiptap editor architecture, D-354).

### `/prototype`

Active prototype UI (port 3001). Source of truth for UI.

Notable subtrees added Session 35:
- `lib/editor/` — Tiptap editor scaffolding (`message-editor.tsx`, `variable-node.ts`, `variable-node-view.tsx`, `template-serde.ts`)
- `lib/variable-token.ts` — shared color-only class for variable rendering across editor + previews
- `lib/variable-scope.ts` — per-message variable scope helper (D-353)

New files Session 36 (custom message CRUD — D-351 revised):
- `lib/slug.ts` — kebab-case slug generator with numeric-suffix collision handling
- `components/catalog/custom-message-card.tsx` — sibling of `CatalogCard`, authoring + monitor UI for custom messages
- `components/catalog/message-action-modal.tsx` — parameterized modal reused by Archive + Delete permanently
- `components/edit-business-details-modal.tsx` — prototype-only dev modal for swapping `appName` / `serviceType` from the state-switcher dropdown

Removed Session 35 (dead code):
- `components/plan-builder/message-card.tsx`
- `components/plan-builder/message-tier.tsx`

### `/src`

**Sunset per D-358 (2026-04-20).** Legacy Twilio-era production codebase, frozen — no modifications. Capabilities being rebuilt on `/api` + Sinch across MASTER_PLAN Phases 2–5. Excluded from the Phase 0 Group E `rk_sandbox_`→`rk_test_` sweep by PM direction (consistent with freeze). Sunset map document (`SRC_SUNSET.md`) deferred from Session 38 to Group F in a later session.

### `/sdk`

RelayKit npm package. v0.1.0 packed as `.tgz` at `/sdk/relaykit-0.1.0.tgz`, not yet published to npm. 8 namespaces, 30 methods (class-based `new RelayKit()` init, zero-config `process.env`), dual ESM/CJS via tsup, 235-line test suite green. Canonical `SendResult` shape pinned by D-362. SDK_BUILD_PLAN.md rewritten Session 39 to match shipped reality. Missing: README, AGENTS.md, published release — scoped to MASTER_PLAN Phase 8.

### `/api`

Message delivery backend (Hono + Sinch-shaped). Session A shipped. Consent API shipped and now documented as COMPLETE in MESSAGE_PIPELINE_SPEC (promoted from "Future additions" Session 38). Session B status GATED — start depends on Phase 1 Sinch experiments producing recorded request/response shapes. `/api/supabase/migrations/005_messages_table.sql` exists but not yet applied. A `consent-check` pipeline step is planned but not yet wired — belongs with Session B (send wiring) or a dedicated Session D; not currently in any MASTER_PLAN phase's scope.

### `/supabase`

Root-level migrations directory — `/src`-era, Twilio-shaped. **Slated for archive in Phase 3** (database reconciliation). Contains destructive audit migration flagged in audit §5.13. `/api/supabase/` will become the single source of truth.

### `/experiments/` (planned, not yet created)

Will house Phase 1 Sinch proving-ground experiments. Throwaway code + `experiments-log.md` with captured response shapes, measured timings, webhook payloads.

---

## Build spec status

| Spec | Status | Implementation |
|------|--------|----------------|
| MESSAGE_PIPELINE_SPEC Session A | COMPLETE | `/api/src/pipeline/` — normalize, interpolate, send stub, log stub. |
| MESSAGE_PIPELINE_SPEC Consent API | COMPLETE | Documented as shipped in MESSAGE_PIPELINE_SPEC Session 38. Endpoints `record / check / revoke` live in `/api/src/routes/consent.ts`; tests green. `consent-check` pipeline step planned but not yet wired. |
| MESSAGE_PIPELINE_SPEC Session B | GATED | Sinch account unblocked 2026-04-20. Start requires Phase 1 Sinch experiment findings (MASTER_PLAN §5). Drafted request/response contract treated as hypothesis pending real recorded shapes. |
| MESSAGE_PIPELINE_SPEC Session C | DEFERRED | Quiet hours / queueing deferred to post-launch unless real customer need emerges. |
| SDK_BUILD_PLAN | CURRENT (delivery pending) | Rewritten Session 39 as retrospective (v0.1.0 shipped: 8 namespaces, 30 methods, tsup dual-format, test suite green, canonical `SendResult` shape pinned by D-362) + Phase 8 delivery spec (npm publish, 13-section README, AGENTS.md template, integration prompt). |
| Workspace message row evolution | IN PROGRESS | Shared grid + /account shipped Session 32–33; Tiptap editor + atomic variable tokens shipped Session 35 (D-350, D-353, D-354). Custom message CRUD shipped Session 36 (D-351 revised) — `+ Add`, edit/slug/save, Archive + Delete modals, archived disclosure, monitor mode on saved customs, pre-populated compliant body with business-name chip (D-356), lock-while-authoring (D-357). Next: D-352 (content-based marketing classification) and D-355 (variable grammar rendering). |
| Vertical hydration (wizard → workspace) | NOT STARTED | Audit §3 documents broken handoff. Covered by MASTER_PLAN Phase 6. Only Appointments reachable end-to-end; 7 other verticals are fully populated data but unreachable. |

---

## Active plan pointer

**Active master plan phase:** Phase 0 (doc reconciliation + architectural decisions) — **ACTIVE**. Phase 1 (Sinch proving-ground experiments) runs in parallel now that Phase 0 decisions are in hand (D-358, D-359, D-360, D-361 recorded).

**Phase 0 progress (per Session 38 plan `phase-0-doc-reconciliation-work-temporal-brook.md` + Session 39 Group D refinement `group-d-sdk-build-plan-md-modular-hanrahan.md`):**
- **Groups A/B/C — COMPLETE (Session 38).** See 2026-04-21 Session 38 change log entry.
- **Group A #2 residual — COMPLETE (Session 39, `35a279a`).** `-- DEV ONLY — DO NOT RUN IN PROD` banner landed on `/supabase/migrations/20260307200000_audit_fixes.sql`.
- **Group D — COMPLETE (Session 39, `a202b7d` + D-362 `165f30a`).** SDK_BUILD_PLAN rewritten as v0.1.0 retrospective plus Phase 8 delivery spec. D-362 recorded pinning the shipped `SendResult` shape as canonical (purely additive, no supersession of D-277). R1/R2/R3 folded into prose (no `⚠ CONFLICT` markers); R4 voice/pricing re-read of §5 integration prompt found clean, noted inline as 2026-04-21 voice check.
- **Group E — COMPLETE (Session 40, 2026-04-21):** `rk_sandbox_`→`rk_test_` sweep applied across `/api` code + tests + user-facing copy + reference/spec docs in three atomic commits (E1/E2/E3). `tsc --noEmit` clean on `/api`, `/sdk`, `/prototype`; `/api` vitest 98/98 green. `/src` and archive docs intentionally excluded per D-358 freeze and historical-preservation rule.
- **Group F — PENDING (standalone next session per PM resolution):** `SRC_SUNSET.md` (`/src` capability → MASTER_PLAN phase map: registration pipeline, inbound handling, Stripe webhooks, dashboard, sandbox key management, compliance monitoring → target phases 2/3/4/5 on `/api`). ~30 min estimated. Deferred to standalone session (not piggybacked on Group E) per Joel's resolution #6 in the Group E plan review. Closes Phase 0 when complete.

**Phase 1 scope:** Sinch proving-ground experiments in `/experiments/` (provision number → send real SMS → inbound webhook → registration API surface). Throwaway code + `experiments-log.md`.

---

## Decision count verification

Verify `D-362` against DECISIONS.md at chat start. If drifted, update this file.

---

## Sync obligations

- **CC at every close-out:** bump `Last updated`, `Decision count`, add/remove files, update build spec status, update `Master plan last updated` if MASTER_PLAN.md was edited, verify `PM instructions synced` flag if Joel confirmed a paste.
- **PM when proposing MASTER_PLAN changes:** write to `MASTER_PLAN.md`, bump `Master plan last updated` date, note version bump in MASTER_PLAN's own header if substantive. No Claude.ai UI sync required — master plan lives only in repo.

---

## Change log

- **2026-04-17:** Initial REPO_INDEX created. Introduces tiered file orchestration, sync tracking between repo and Claude.ai UI project instructions, canonical file listings at root and `/docs`.
- **2026-04-17 (Session 34):** Added `MESSAGE_PIPELINE_SPEC.md` and `SDK_BUILD_PLAN.md` at repo root; expanded `docs/STARTER_KIT_PROGRAM.md` with sections 12–19; recorded D-349 through D-353; build spec status for SDK flipped to "Spec ready".
- **2026-04-18 (Session 35):** Tiptap v3 wired into the workspace message editor with atomic `VariableNode` atoms (D-350) and a `+ Variable` insert affordance scoped per-message (D-353). Library choice recorded as D-354. Added `prototype/lib/editor/` + `prototype/lib/variable-{token,scope}.ts`; deleted unused `plan-builder/message-{card,tier}.tsx`. Design doc at `docs/superpowers/specs/2026-04-17-message-editor-tiptap-design.md`. PROTOTYPE_SPEC Edit-State section rewritten.
- **2026-04-18 (Session 35 close-out):** Error-state bug resolution. Root cause was Tiptap's `Editor.setEditable` emitting the `update` event unconditionally with stale doc content. Two prior fix attempts (`cf09e61` `hasUserEdited` gate; `55a87e5` explicit-call compliance refactor) treated symptoms on the CatalogCard side and did not resolve. Final fix `858866d`: `editor.setEditable(!disabled, false)` in `message-editor.tsx`. The `55a87e5` architecture is retained as still correct. Design doc §15 added with the Tiptap usage rule + call-site audit. All 12 session commits pushed to `origin/main`.
- 2026-04-18: D-351 revised — generic SDK method with slug supersedes prior manual-send-only formulation.
- 2026-04-18 (Session 36 start): D-355 recorded — variable grammar: canonical base form for common nouns + context-aware rendering; proper nouns stored and rendered as-is.
- **2026-04-19 (Session 36):** Custom message CRUD shipped end-to-end. `+ Add` inserts a pre-populated compliant row at the top of the stack with business-name chip + placeholder + opt-out phrase (D-356). Saved rows match built-in visual language — name + slug inline, kebab + activity + pencil chrome, monitor expansion with Test send / Ask Claude / Close. Archive + Delete permanently flows via shared `MessageActionModal`; Archived (N) disclosure at the bottom; archived rows render full-contrast (PM pushback on muted styling) and are read-only. Compliance gained a second rule for business-name with its own Fix button (D-356). Lock-while-authoring supersedes auto-discard: sibling affordances disabled with "Save or cancel the current message first." tooltip while a never-saved custom is open (D-357). User-facing "Testers" → "Preview list" copy rename (code identifiers untouched). Dashboard status indicator yellow-state "Test mode" → "Test messages only". Monitor-footer "Quick send" → "Test send" with source-of-message tooltip. Added Reset action to onboarding dropdown + Edit business details dev modal on the state-switcher dropdown. Tooltip token regression fix — Session 35's semantic-token migration referenced `--color-bg-primary-solid` without defining it; added both `bg-primary-solid` and `bg-secondary-solid` to `globals.css` @theme.
- 2026-04-19: D-356 + D-357 recorded. PM_PROJECT_INSTRUCTIONS updated with response-brevity and step-by-step instruction guidelines; paste confirmed, `pm_instructions_synced` stays `true`.
- **2026-04-20 (Session 37 — audit-only, no build work):** `CURRENT_STATE_AUDIT.md` added at repo root. Documents per-directory inventory (`/src`, `/api`, `/sdk`, `/prototype`, `/supabase`, `/api/supabase`, `/docs`, `/docs/archive`), spec-to-reality gaps for MESSAGE_PIPELINE_SPEC / SDK_BUILD_PLAN / PROTOTYPE_SPEC / WORKSPACE_DESIGN_SPEC / RELAYKIT_PRD_CONSOLIDATED / PRICING_MODEL, end-to-end trace for the Verification-codes vertical (wizard→workspace handoff is broken; data is complete but unreachable), 26-item weirdness log, Sinch readiness review, and recommendations list. No decisions bumped, no sync flags flipped. `tsc --noEmit` clean on `/api`, `/sdk`, `/prototype` at audit time; `/api` tests 98/98 green. See audit §5 for drift summary (`rk_sandbox_`/`rk_test_` sweep deferred, two backends + two supabase dirs, inbound split-brain, SDK_BUILD_PLAN stale, CLAUDE.md key-name drift).
- **2026-04-20 (same chat, post-audit):** Sinch account unblocked — $100 charged, phone number can be provisioned. Session B status flipped BLOCKED → UNBLOCKED (pending Phase 1 experiments). Scoping conversations held for OTP/Verification, review requests, two-way messaging; verification card observed in prototype triggered reconsideration and discovery that Verification is a fully-populated vertical with broken wizard→workspace wiring (per audit §3). `MASTER_PLAN.md` v1.0 created at repo root — holistic 10-phase launch plan with North Star, ranked customer values (fast registration added as top value — the Sinch differentiator), working principles, explicit out-of-scope list, risks. Added as Tier 2 upload. New `Master plan last updated` field added to Meta. `/experiments/` directory planned for Phase 1. Two D-numbers flagged as needed but not yet recorded (D-358 `/src` sunset, D-359 MASTER_PLAN adoption) — to be recorded in next CC session once PM↔Joel decisions are finalized.
- **2026-04-20 (Session 37 close-out):** D-358 (`/src` sunset — rebuild registration/inbound/dashboard/billing on `/api` + Sinch, no Twilio preservation), D-359 (MASTER_PLAN.md v1.0 adopted as canonical), D-360 (OTP/Verification as both cross-vertical auth primitive AND dedicated vertical), D-361 (review-request templates ship at launch as vertical-internal additions using developer-supplied review URLs) all recorded. Active plan pointer updated to reflect Phase 0 active / Phase 1 unblocked in parallel. `PM_PROJECT_INSTRUCTIONS.md` substantially rewritten (273 lines of diff, +/- across the file). `tsc --noEmit` clean on `/api`, `/sdk`, `/prototype` at close-out. No code changes — docs-only session following the audit.
- **2026-04-21:** `PM_PROJECT_INSTRUCTIONS.md` — File Requests + CC Mode Signaling sections added (committed standalone as PM-side work, not Phase 0 doc reconciliation).
- **2026-04-21 (Session 38 — Phase 0 Groups A–C, partial):** Phase 0 doc-reconciliation plan drafted at `~/.claude/plans/phase-0-doc-reconciliation-work-temporal-brook.md` (10 groups scoped A–G, dependencies, session-rotation points, effort estimates). Group A PM clarifications resolved — D-03 "magic-link" retained as shorthand for Supabase's passwordless-email family (no new decision); migration banner approved but not yet executed (flagged as Group A #2 residual); `/src` excluded from Group E sweep per freeze; VISION_IMPLEMENTATION_MEMO approved for deletion. Group B shipped five spot fixes across five files — CLAUDE.md wizard key (`relaykit_intake`→`relaykit_wizard`) and auth-mechanism clarification, PRD decision count `329+`→`361+`, deprecation headers on `docs/archive/PRD_04_TWILIO_SUBMISSION.md` and `docs/archive/PRICING_MODEL.md`, deletion of `docs/archive/VISION_IMPLEMENTATION_MEMO.md`. Two follow-up commits after Group B: PRD endpoint list expanded from five to six shipped `/api` endpoints (adds `POST /v1/signup/sandbox`), and D-104 supersession note appended citing D-358. Group C shipped Consent API promotion to `[COMPLETE]` section in MESSAGE_PIPELINE_SPEC, Session B flipped `BLOCKED`→`GATED` on Phase 1 experiments, Future/Consent subsection removed. No new D-numbers (all work was documentation catching up to reality). Flagged for tracking: `consent-check` pipeline step belongs in Phase 2 but isn't scoped there; migration runtime-application status is a Phase 3 question; Group A #2 migration banner is a residual. PM-side commit: `PM_PROJECT_INSTRUCTIONS.md` gains File Requests + CC Mode Signaling sections. `tsc --noEmit` + `eslint` clean on `/api` and `/sdk`; `tsc --noEmit` clean on `/prototype`. Five Phase 0 commits + one PM instructions commit (`66f2872`, `cb25bd1`, `54918a6`, `0e4f56e`, `939d83e`). Groups D (SDK_BUILD_PLAN rewrite), E (`rk_sandbox_` sweep), F (`SRC_SUNSET.md`) pending for subsequent CC sessions.
- **2026-04-21 (Session 39 — Phase 0 Group A #2 + Group D, plus bookkeeping):** Opened with bookkeeping scar repair — CC_HANDOFF header and gotcha 7, plus REPO_INDEX meta line, corrected from stale "NOT pushed" language after confirming `HEAD == origin/main` from Session 38 (`079c77d`). Group A #2 residual shipped standalone — `-- DEV ONLY — DO NOT RUN IN PROD` banner on `/supabase/migrations/20260307200000_audit_fixes.sql` (`35a279a`). Group D (SDK_BUILD_PLAN rewrite) executed in plan mode — plan at `~/.claude/plans/group-d-sdk-build-plan-md-modular-hanrahan.md` approved with resolutions to four reconciliation points (R1 SendResult shape, R2 init pattern, R3 missing D-numbers, R4 integration-prompt drift). D-362 recorded pinning the shipped `SendResult` shape `{ id, status, reason? }` as canonical — standalone commit before the rewrite, purely additive after determining D-277 describes semantics not shape (`165f30a`; originally `ecc0590`, amended to fix §7→§6 cross-reference in the Affects line, re-parented as `165f30a`). Full SDK_BUILD_PLAN rewrite (`a202b7d`; originally `b6f886f`, re-parented after the D-362 amend) replaces the forward-looking "NOT STARTED" narrative with a v0.1.0 retrospective (shipped surface, tsup build, tests, shipped-behaviors reference) plus a Phase 8 delivery section (npm publish, 13-section README spec, AGENTS.md template, integration prompt). Every example updated to use the shipped `new RelayKit()` pattern; every SendResult reference updated to the canonical shape. §6 Guided vs Quick Start UI spec deleted entirely (not relocated). §1 Steps 1–5 folded into retrospective; §1 Step 6 moved to Phase 8 section. R3 added D-306, D-307, D-308, D-351, D-362 to the decisions list (plus D-360, D-361 cited in the README §6 surface description — slightly broader than plan's expected 15; PM may trim). R4 voice/pricing re-read of §5 integration prompt found clean (no pricing claims, no prohibited compliance-guarantee language, clean imperative tone); noted inline as a 2026-04-21 voice check. File landed at 461 lines vs plan's 280–320 target — dense, not bloated (§2 retrospective + retained 13-section README spec); PM may direct trim pass. CLAUDE.md size-discipline section added at top — keep under 200 lines, target ~80 (`bf4be60`; CLAUDE.md now 111 lines). `tsc --noEmit` clean on `/api`, `/sdk`, `/prototype` at close-out; no code touched this session. Session 39 commits: `079c77d`, `35a279a`, `165f30a`, `a202b7d`, `bf4be60`, plus this close-out commit — all pushed to `origin/main` on top of Session 38's tip (`838525e`). Active plan pointer updated to reflect Groups A #2 + D complete; Groups E (`rk_sandbox_` sweep) and F (`SRC_SUNSET.md`) remain pending.
- **2026-04-21 (Session 40 — Phase 0 Group E):** `rk_sandbox_`→`rk_test_` sweep executed in plan mode; plan at `~/.claude/plans/group-e-rk-sandbox-rk-test-sharded-widget.md` with six open questions resolved by PM before execution (D-285 appended supersession note; archive docs skipped; superpowers plan artifact treated as archive; three atomic commits E1/E2/E3; MASTER_PLAN L366 deleted outright; Group F standalone session next). Re-verified inventory: 40 matches across repo excluding build-artifact dirs; 10 in top-level `/src` (frozen per D-358) excluded; 30 in-scope; +1 drift from plan's 29 estimate (the superpowers plan artifact, treated as archive). **E1** (`136f2b5`, 9 files, 29/-29): prefix generator at `api/src/routes/signup.ts:17` flipped (real behavior change — `/v1/signup/sandbox` now mints `rk_test_*`); `api/src/__tests__/signup.test.ts` regex assertions flipped in lockstep; 6 other /api test files + 1 migration comment. **E2** (`7dcb02f`, 4 files, 4/-4): `prototype/components/setup-instructions.tsx`, `prototype/app/apps/[appId]/get-started/page.tsx`, `docs/PRICING_MODEL.md` (prefix only — `Sandbox API key` noun phrase preserved), `WORKSPACE_DESIGN_SPEC.md` example key. **E3** (`b093af0`, 6 files, 8/-6): D-285 gained `_⚠ Partial supersession: user-facing prefix is now rk_test_ per D-349._` appended between body and `_Affects:_` footer; MASTER_PLAN.md §4 L100 past-tensed with completion annotation; MASTER_PLAN.md §14 former L366 Phase 10 bullet deleted; SDK_BUILD_PLAN.md §status-table L27 and §7 L457 flipped to past-tense/Complete; PROTOTYPE_SPEC.md §571 example key flipped; CURRENT_STATE_AUDIT.md §5.7 gained a `**Resolved:**` banner (body preserved as frozen snapshot); REPO_INDEX.md L150 Group E bullet flipped PENDING→COMPLETE. **Historical text preserved intentionally:** D-349 body at DECISIONS.md L1222/L1224 (the decision text *explains* the rename), CURRENT_STATE_AUDIT §1/§2/§4/§7 snapshots, REPO_INDEX L108 + L180/L184/L185 session-log entries, all `/src/**` and `docs/archive/**` + `docs/superpowers/plans/**` references. Verification grep returned zero unexpected drift. Quality gates: `tsc --noEmit` clean on `/api`, `/sdk`, `/prototype` (re-ran after E1 and pre-close); `/api` vitest 98/98 green (matches Session 37 baseline); `eslint` clean on all three packages at close-out. All three Group E commits pushed to `origin/main` mid-session after PM approval (`d6a2c7a..b093af0`). CC_HANDOFF.md and this REPO_INDEX update land as a single close-out commit, push pending PM approval. Group F (`SRC_SUNSET.md`) deferred to a standalone next session per PM resolution #6. No new D-numbers.
