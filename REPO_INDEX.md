# REPO_INDEX.md

> **Purpose:** Single source of truth for repo state. PM reads this at every browser chat start to orient without guessing. CC maintains it at every close-out.

---

## Meta

- **Last updated:** 2026-04-20 (Session 37 close-out — audit + MASTER_PLAN v1.0 + D-358–D-361)
- **Decision count:** D-361 (next available: D-362)
- **Master plan last updated:** 2026-04-20 (v1.0 — initial, adopted as canonical per D-359)
- **Active CC session branch:** main
- **Unpushed local commits:** Session 36's 31 commits + Session 37's audit commit + Session 37 close-out doc commit — awaiting PM review approval

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
| `REPO_INDEX.md` | 2026-04-20 | This file |
| `MASTER_PLAN.md` | 2026-04-20 | Holistic 10-phase launch plan, North Star, customer values ranking, out-of-scope list, risks (v1.0) |
| `PM_PROJECT_INSTRUCTIONS.md` | 2026-04-19 | Canonical PM instructions (synced to Claude.ai UI) |
| `CLAUDE.md` | 2026-04-17 | CC standing instructions (pared to ~110 lines) |
| `DECISIONS.md` | 2026-04-19 | Active decisions D-84+, index of D-01–D-83 |
| `DECISIONS_ARCHIVE.md` | (stable) | Full text of D-01–D-83 |
| `PROTOTYPE_SPEC.md` | 2026-04-19 | Screen specs for `/prototype` |
| `WORKSPACE_DESIGN_SPEC.md` | 2026-03-28 | Post-signup workspace architecture |
| `MESSAGE_PIPELINE_SPEC.md` | 2026-04-17 | `/api` pipeline — Sessions A (done) / B / C |
| `SDK_BUILD_PLAN.md` | 2026-04-17 | `/sdk` build + README + AGENTS.md + integration prompt (see audit §4.2 — now stale, reconcile in Phase 0) |
| `CURRENT_STATE_AUDIT.md` | 2026-04-20 | Session 37 audit — repo inventory, spec drift, weirdness log, Sinch readiness, recommendations |
| `CC_HANDOFF.md` | 2026-04-20 | Previous CC session state |
| `BACKLOG.md` | 2026-04-10 | Parked ideas, never build without promotion |
| `README.md` | (stable) | Repo readme |

---

## Canonical docs (`/docs`)

| File | Last touched | Purpose |
|------|-------------|---------|
| `RELAYKIT_PRD_CONSOLIDATED.md` | 2026-04-15 | Product narrative, what's built, what's next |
| `PRICING_MODEL.md` | 2026-04-08 (v6.0) | Tier definitions, costs, pricing logic |
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

**Slated for sunset per MASTER_PLAN (pending D-358 recording in next CC session).** Legacy Twilio-era production codebase. Do not modify without explicit direction. Rebuild on `/api` + Sinch across Phases 2–5.

### `/sdk`

RelayKit npm package. **Shipped ahead of SDK_BUILD_PLAN — plan is stale (audit §4.2).** v0.1.0 packed as `.tgz`, not yet published to npm. 8 namespaces, 30 methods, dual ESM/CJS, tests green. Missing: README, AGENTS.md, published release (Phase 8).

### `/api`

Message delivery backend (Hono + Sinch-shaped). Session A shipped, consent API shipped ahead of spec. Session B blocked on Phase 1 Sinch experiments. `/api/supabase/migrations/005_messages_table.sql` exists but not yet applied.

### `/supabase`

Root-level migrations directory — `/src`-era, Twilio-shaped. **Slated for archive in Phase 3** (database reconciliation). Contains destructive audit migration flagged in audit §5.13. `/api/supabase/` will become the single source of truth.

### `/experiments/` (planned, not yet created)

Will house Phase 1 Sinch proving-ground experiments. Throwaway code + `experiments-log.md` with captured response shapes, measured timings, webhook payloads.

---

## Build spec status

| Spec | Status | Implementation |
|------|--------|----------------|
| MESSAGE_PIPELINE_SPEC Session A | COMPLETE | `/api/src/pipeline/` — normalize, interpolate, send stub, log stub. Consent API shipped ahead of spec. |
| MESSAGE_PIPELINE_SPEC Session B | BLOCKED → UNBLOCKED | Sinch account unblocked 2026-04-20. Depends on Phase 1 experiment results before build (MASTER_PLAN Phase 2). |
| MESSAGE_PIPELINE_SPEC Session C | DEFERRED | Quiet hours / queueing deferred to post-launch unless real customer need emerges. |
| SDK_BUILD_PLAN | STALE | SDK itself shipped. Remaining work (README, AGENTS.md, publication) covered by MASTER_PLAN Phase 8. Plan doc to be rewritten in Phase 0. |
| Workspace message row evolution | IN PROGRESS | Shared grid + /account shipped Session 32–33; Tiptap editor + atomic variable tokens shipped Session 35 (D-350, D-353, D-354). Custom message CRUD shipped Session 36 (D-351 revised) — `+ Add`, edit/slug/save, Archive + Delete modals, archived disclosure, monitor mode on saved customs, pre-populated compliant body with business-name chip (D-356), lock-while-authoring (D-357). Next: D-352 (content-based marketing classification) and D-355 (variable grammar rendering). |
| Vertical hydration (wizard → workspace) | NOT STARTED | Audit §3 documents broken handoff. Covered by MASTER_PLAN Phase 6. Only Appointments reachable end-to-end; 7 other verticals are fully populated data but unreachable. |

---

## Active plan pointer

**Active master plan phase:** Phase 0 (doc reconciliation + architectural decisions) — **ACTIVE**. Phase 1 (Sinch proving-ground experiments) runs in parallel now that Phase 0 decisions are in hand (D-358, D-359, D-360, D-361 recorded).

**Phase 0 scope:** rewrite SDK_BUILD_PLAN.md, reconcile spec drift surfaced by the audit (CLAUDE.md wizard key, RELAYKIT_PRD decision count + endpoint list, MESSAGE_PIPELINE_SPEC consent status, archive deprecations), apply `rk_sandbox_`→`rk_test_` sweep, document `/src` sunset per D-358.

**Phase 1 scope:** Sinch proving-ground experiments in `/experiments/` (provision number → send real SMS → inbound webhook → registration API surface). Throwaway code + `experiments-log.md`.

---

## Decision count verification

Verify `D-361` against DECISIONS.md at chat start. If drifted, update this file.

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
