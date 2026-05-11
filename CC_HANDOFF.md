# CC_HANDOFF — Session 80 (Phase 2a kickoff — archive PRD digest task)

**Date:** 2026-05-11
**Session character:** Doc-only session executed on `main`. Phase 2a (research framework + per-category content authoring) opened with the first deliverable per PM brief — the archive PRD digest task — mining the prior project thinking captured in `/docs/archive` and `/src` before fresh Phase 2a research begins. Single content commit + this close-out.
**Branch:** `main`. Content commit `6cf5262` pushed to `origin/main` post-PM-approval mid-session. This close-out (Commit 2) is the only unpushed commit at session close, awaiting PM approval.

`Commits: 2 (content commit + this close-out) | Files modified: 3 (audits/PHASE_B_PRIOR_ART_DIGEST.md new file, REPO_INDEX.md, CC_HANDOFF.md) | Decisions added: 0 | External actions: 1 (push of 6cf5262 to origin/main post-PM-approval mid-session; push of this close-out queued pending PM approval at session close)`

---

## Commits this session (chronological order)

| # | Hash | Type | Description |
|---|------|------|-------------|
| 1 | `6cf5262` | Content | `docs(audits): add PHASE_B_PRIOR_ART_DIGEST — synthesis of /docs/archive PRDs + /src category scan` — new file `audits/PHASE_B_PRIOR_ART_DIGEST.md` (449 lines). Pushed to origin/main mid-session after PM `.pm-review.md` approval. |
| 2 | _(this close-out)_ | Close-out | `docs: Session 80 close-out — REPO_INDEX + CC_HANDOFF (Phase 2a kickoff)` *(pending PM approval at session close)* |

External actions this session: 1 — push of content commit `6cf5262` to origin/main individually after PM approval; push of this close-out pending.

---

## What was completed

### Archive PRD digest (per PM brief — first Phase 2a deliverable)

Read 11 priority `/docs/archive` PRDs in PM-supplied order plus a light `/src` scan, and produced `audits/PHASE_B_PRIOR_ART_DIGEST.md` (449 lines) synthesizing the prior thinking surface that informs Phase 2a per-category content authoring for the marketing-site home configurator.

**Sources read:**
- `RELAYKIT_PRD_CONSOLIDATED.md` (Apr 15, archived 2026-04-21) — full
- `PRD_02_TEMPLATE_ENGINE.md` v2.0 (Mar 3) — read first 800 lines covering §1–§11 + remaining 100 lines for constants and refinement process; **heaviest category-substance source**
- `PRD_07_LANDING_PAGE.md` v3.0 (Mar 3) — full
- `PRD_05_DELIVERABLE.md` v3.0 (Mar 3) — full
- `EXPLORATION_BRIEF_v2.md` (Mar 13) — full
- `PRD_09_MESSAGING_PROXY.md` v1.0 (Mar 1) — full
- `PROTOTYPE_PROPOSAL.md` (Mar 8) — full
- `RELAYKIT_PRODUCT_VISION.md` (Mar 12) — full
- `PRD_06_DASHBOARD.md` v3.0 (Mar 3) — sections 1–5 full + 6+ skimmed
- `PRD_01_INTAKE_WIZARD.md` (Feb 26) + `PRD_01_ADDENDUM_DASHBOARD_FLOW.md` (Mar 3) — both full
- `V4 - ADDENDUM_MIXED_CAMPAIGN_AND_PRICING.md` (Mar 4) — full

**`/src` scan (D-358 sunset, content remains authoritative for substance):**
- `lib/intake/use-case-data.ts` — full read (9 `UseCaseId` values, `USE_CASES` record with included/notIncluded scope and expansion options)
- `lib/intake/campaign-type.ts` — full read (`DEFAULT_CAMPAIGN_TYPES` map, `determineCampaignType` function, `PROMO_EXPANSION_IDS` set)
- `lib/intake/templates.ts` — full read (`CAMPAIGN_DESCRIPTIONS`, `SAMPLE_MESSAGES`, `SAMPLE_MESSAGE_LABELS` maps; double-brace `{{name}}` syntax)
- `lib/templates/message-templates.ts` — first 180 lines read (appointments full base + expansion sets + types/constants); 1230 lines total, structure inferred for remaining categories from PRD_02 mirror
- `lib/templates/verticals/modules/` — directory inventory (17 modules: appointments-general, appointments-medical, automotive, beauty-wellness, ecommerce, education, financial, fitness, healthcare, home-services, legal, mental-health, nonprofit, real-estate, restaurant, saas, veterinary — sizes 22–41 lines each); healthcare module read in full as exemplar of vertical-modifier shape (HIPAA-shaped industry rules with safe / unsafe patterns + recommended message timing)
- `lib/templates/verticals/detection.ts` — first 80 lines (vertical-detection regex map covering 11+ keyword patterns including dental, medical_general, mental_health, physical_therapy, veterinary, salon_spa, fitness, legal, financial, restaurant, real_estate)
- `lib/intake/industry-gating.ts` — header (three-tier gating: cannabis/firearms decline; healthcare/legal/financial/restaurant gated)

**Digest structure (449 lines):**
- Sources block (PRDs in priority order + `/src` files actually read)
- Scope statement
- Headline finding (the Higher Ed blank-slate vs prior 9-category-lineup-with-Exploring divergence — surfaced as the first thing PM reads)
- Per-category sections (9 categories in PM-supplied launch-posture-grid order: Verification / Appointments / Orders / Support / Marketing / Team alerts / Community / Waitlist / Higher Education) — each with prior thinking, sub-uses considered with citations, workflows + triggers, verbatim message drafts where they encode meaningful patterns, variable model, TCR mapping, and carry-forward verdict against current product reality (D-358 `/src` sunset, D-330 SDK static, D-333 marketing always separate, D-360 verification as cross-vertical primitive, D-372 three-layer model, D-375 marketing-site replicates Tiptap editor, D-377 verification toggleable + "Verification only" preset, D-379/D-380/D-381 ONE SET + 4 editable placeholders + canonical-source impl deferred)
- Cross-cutting patterns (common workflow shapes — sequential lifecycle / inbound-driven / cross-cutting primitive; variable interpolation problems surfaced including sender-name-token ambiguity, vertical-aware-noun ambiguity, capitalization/possessive gap, hardcoded literals, single-vs-double-brace syntax split; tone-variant treatments — Standard/Action-first/Context-first from EXPLORATION_BRIEF_v2 vs current Standard/Friendly/Brief; compliance posture per category)
- Meta section (stands the test of time / explicitly rejected with reasons / gaps Phase 2a research needs to fill)

Pushed to origin/main mid-session after PM `.pm-review.md` approval per the per-commit cadence codified Session 77.

---

## Findings flagged for next session (gotchas-or-decisions-pending)

The digest surfaced five Phase 2a inputs that need PM direction before per-category content authoring begins. Each has enough context here for the next chat's PM to engage without re-reading the full digest:

> ⚠ **Corrective note (2026-05-11):** findings #1, #2, #4 below carry framing drift corrected by D-382 + D-383 in MASTER_PLAN v1.8. See `audits/PHASE_B_PRIOR_ART_DIGEST.md` corrective header for per-finding correction. Findings #3 (token sprawl + brace-syntax split) and #5 (PRD_05 build-spec sunset) are layer-agnostic and remain useful. Original findings preserved below for session-history integrity.

### 1. Higher Education has zero prior thinking — blank-slate authoring needed

Every reviewed `/docs/archive` PRD, brief, vision doc, exploration brief, dashboard spec, intake-wizard spec, and proxy spec — plus `/src/lib/intake/use-case-data.ts`'s `UseCaseId` union — enumerates the same nine categories: Appointments, Orders, Verification, Support, Marketing, Internal/Team alerts, Community, Waitlist, **Exploring** (as the ninth, NOT Higher Education). The PM-supplied Phase 2a launch posture grid replaces Exploring with Higher Education, but no prior PRD specifies a template set, sub-uses, campaign-type mapping, opt-in disclosure, or compliance posture for Higher Ed. The closest prior-art adjacency is `/src/lib/templates/verticals/modules/education.ts` — but that exists as a *vertical-flavor modifier* (28 lines), not a top-level category. **Decision pending:** is Higher Ed a real intended launch-grid slot, a misnamed slot (e.g., for founder-facing alerts / student SaaS / similar), or a deferred entry per v1.7's sixth working principle? If real, Phase 2a needs to author from scratch (sub-uses, variable model, FERPA-shaped compliance overlay analogous to the healthcare module, TCR mapping). Highest-effort Phase 2a authoring task on the list — surface to PM before starting.

### 2. Indie SaaS audience-pack mismatch is bigger than MASTER_PLAN §17 admits

The nine-category lineup was authored Feb–Mar 2026; the launch repositioning to indie SaaS founders specifically landed May 3, 2026 (MASTER_PLAN v1.5, D-372). Several categories are heavily mis-shaped for the indie SaaS founder audience: Marketing's ecommerce sub-uses (back-in-stock / abandoned cart / loyalty rewards / weekly promo with `SAVE20` codes); Team Alerts' staff-shop framing (shift confirmations / meeting reminders / system maintenance — written for businesses with internal staff, not founders); Community's organizer framing (events / membership / RSVP — wrong audience entirely); Waitlist's restaurant/venue framing (`{venue_type}`, table-ready alerts, party_size). MASTER_PLAN §17 lists this risk as "Indie SaaS pack namespace gap" but treats it as a small SDK-namespace question. The digest surfaces it as a substantially larger problem affecting four of the nine categories. **Decision pending:** which of the nine categories ship at launch and which defer per v1.7's "tamp complexity smartly, feel flexible, scope honestly" principle? Strong candidates for honest deferral: Community, Waitlist; possibly Support (depending on whether indie SaaS founders ship ticketing systems at all). Strong candidates for re-shaping rather than direct port: Marketing (toward feature launches + subscription updates + founder-direct outreach, away from retail patterns); Team Alerts (toward founder-facing app monitoring, away from staff-shop).

### 3. Sender-name and vertical-aware-noun token sprawl + brace-syntax split

PRD_02 §2 enumerates 16 template variables. Three are sender-name aliases for the same conceptual slot: `{business_name}` (default), `{app_name}` (verification), `{community_name}` (community) — with `/src/lib/intake/templates.ts` falling back via `i.app_name ?? i.business_name` and `i.community_name ?? i.business_name`. Three more are vertical-aware-noun aliases collected as personalization-step fields: `{service_type}` (appointments — "dental"/"hair salon"), `{product_type}` (orders — "handmade jewelry"), `{venue_type}` (waitlist — "restaurant"/"barbershop"). And `/src` has divergent template syntax: single-brace `{business_name}` in `lib/templates/message-templates.ts` (the dashboard plan-builder library) vs double-brace `{{name}}` in `lib/intake/templates.ts` (the review-page TCR-preview surface). D-380 requires 4+ editable placeholder fields; D-381 defers the single-canonical-source implementation. **Decisions pending for Phase 2a:** consolidate to a single `{sender_name}` token (or similar) with per-category mapping? Consolidate to a single per-category vertical-aware-noun token (call it `{service_or_product}` with the category's prompt asking the right specific question)? Pick one template-syntax convention (single-brace recommended — it's the dashboard library's convention and is closer to the current message-templates.ts surface) before any per-category authoring begins, since the cost of choosing late is rewriting every authored stub.

### 4. D-360 verification-as-cross-vertical-primitive collides with the 9-category-grid framing

D-360 establishes verification as a feature included with every vertical (OTP-as-feature design); D-370 establishes symmetric `sendCode`+`checkCode` on every SDK namespace; D-369 establishes server-side validation infrastructure; D-371 establishes verification template customizability. Phase 6 (MASTER_PLAN §10) ships verification-as-feature at launch. But the PM-supplied launch-posture-grid lists Verification as a peer category alongside Appointments / Orders / etc., and D-377 records it as a toggleable category with a "Verification only" preset. **The dual role is unresolved at the configurator-card-content level.** Phase 2a needs to decide: when does Verification appear as its own card on the home configurator (and what does that card preview)? When is it a feature layered atop other categories (and how is that surfaced)? D-377's "Verification only" preset gestures at the answer but doesn't fully resolve. This is the most architectural-decision-laden category card in the 9.

### 5. Prior PRD_05 "build spec" architecture is fully sunset — survivors are the per-category one-liners

PRD_05's three-document lifecycle (SMS_BUILD_SPEC.md sandbox + SMS_GUIDELINES.md sandbox + production editions) is the deepest prior thinking on customer deliverables, and is entirely replaced by the SDK + AGENTS.md + per-builder-guides model per D-358 (`/src` sunset) + D-266 (SDK is delivery mechanism) + D-272–D-278 (SDK architecture) + D-331 (integration prompt model) + D-300 (website gathers context, AI tool executes). The "download two files, tell your AI to read them" framing in `RELAYKIT_PRODUCT_VISION.md` §2 + PRD_07 §3 + PRD_05 §1 is **fully superseded** — Phase 2a content authoring should not surface a "download build spec" affordance on the home configurator. What survives and carries forward: the per-category `APPROVED_MESSAGE_TYPES` + `NOT_APPROVED_CONTENT` constants (`/src/lib/templates/message-templates.ts` lines 29–69, mirrored in PRD_02 §10 line 833–860) and the per-use-case tips (`/src/lib/deliverable/use-case-tips.ts`). These are the cleanest reusable compliance artifacts in the archive. Phase 2a should bring them forward verbatim where the category survives, and treat them as the prior-art floor.

---

## Quality checks passed

- **Per-commit `.pm-review.md` cadence** (codified Session 77) followed for the content commit and (queued for) this close-out. The content commit's `git show HEAD` was written to `.pm-review.md` after commit; PM approved via the review file; push to `origin/main` followed individually.
- **No tsc/eslint/build run** — doc-only session per CLAUDE.md close-out gates (apply only to modified code directories under `/api`, `/sdk`, `/prototype`, `/marketing-site`).
- **Pre-flight DECISIONS ledger scan** clean at session start: Active count 296 (latest D-381), Archive D-01–D-83, no new decisions since previous session (Session 79). No flags. Carry-forward gotcha re: six DECISIONS.md format anomalies (D-153, D-154, D-358, D-359, D-360, D-361 use `:` instead of em-dash header form) unchanged.

---

## Retirement sweep findings

None — Phase B foundation is internal to the active Phase 1 (Sinch experiments) sub-stream per MASTER_PLAN v1.7. Not a MASTER_PLAN phase boundary. Mid-phase doc session, sweep skipped per CLAUDE.md phase-boundary-only cadence.

---

## Drift-watch findings

None — mid-phase, drift-watch skipped per CLAUDE.md step 9.

---

## Gotchas for next session

Findings #1–#5 above are the substantive items. Plus the carry-forward gotchas from Session 79:

1. **DECISIONS.md format anomalies still in flight** — six entries use `**D-N: Title**` (colon) instead of canonical `**D-N — Title**` (em-dash): D-153, D-154, D-358, D-359, D-360, D-361. Surfaced Session 77 pre-flight count grep, flagged for PM, not normalized this session (out of scope). Format normalization sweep appropriate before next ledger amendment if it touches any of these entries.

2. **Three `text-white` form-page literals carry-forward from Session 76** — `app/signup/page.tsx:15`, `app/start/get-started/get-started-form.tsx:55`, `app/start/verify/verify-form.tsx:44` (same `text-white` on `bg-bg-brand-solid` button pattern that Session 76 commit 5 replaced on configurator + edit-card). Trivial follow-up branch.

3. **`PM_PROJECT_INSTRUCTIONS.md` has unstaged in-flight edits in Joel's working tree** — untouched this session; not yet committed. Same status as Session 79 close.

4. **Verification's dual role (finding #4) is the highest-architectural-judgment item in Phase 2a.** Whoever runs the per-category content authoring should brief on it explicitly before touching the Verification card content.

---

## Files modified this session

**Across both commits (3 unique files):**

- `audits/PHASE_B_PRIOR_ART_DIGEST.md` (Commit 1: new file, +449 lines)
- `REPO_INDEX.md` (Commit 2: Meta block refresh — Last updated narrative + Active CC session branch + Unpushed local commits; new audits row added to canonical docs table for the digest; Last-touched bumps on REPO_INDEX + CC_HANDOFF rows; Session 80 change-log entry appended)
- `CC_HANDOFF.md` (Commit 2: full overwrite — this file)

**Untracked-but-untouched (not staged):**
- `.pm-review.md` — local-only review artifact, refreshed at every commit per PM Review Cadence; gitignored.
- `api/node_modules/` — standing untracked.

**Untouched this session:** `/prototype`, `/api`, `/sdk`, `/src`, DECISIONS.md, MASTER_PLAN.md, PROTOTYPE_SPEC.md, PRODUCT_SUMMARY.md, BACKLOG.md, MARKETING_STRATEGY.md, CLAUDE.md, PM_PROJECT_INSTRUCTIONS.md (Joel has in-flight unstaged edits in working tree but the file was not touched this session), all of `/docs/`, experiments.

---

## Suggested next session

**Path A (likely): continue Phase 2a per-category content authoring** in either the current browser chat (if Joel + PM choose to continue) or a fresh chat (if rotating). The digest is the substrate. The first decision in the next session is **finding #1's Higher Ed clarification** — confirm or revise the slot before authoring against it. If Higher Ed survives PM review, the second decision is **finding #2's per-category in-or-out-of-launch posture** (Community + Waitlist most likely deferral candidates). The third decision is **finding #3's template-syntax convention** — commit to single-brace or double-brace before any per-category content authoring begins, since the cost of choosing late is rewriting every authored stub. The fourth is **finding #4's Verification dual-role resolution** at the configurator-card-content level.

**Path B: PM may direct one of the carry-forward queue items** (also unblocked):
- DECISIONS.md format anomaly normalization sweep (six entries).
- Three `text-white` form-page literals sweep.
- Phase 1 downstream experiments first-pickup (2b inbound MO shape / 3c Simplified→Full brand upgrade / 4 STOP/START/HELP).
- Stage 2 BRAND_DIRECTION.md authoring + MD-number capture from BRAND_AUDIT.md.
- Pumping Defense Wave 2 implementation.
- Migration 006 manual application.
- Broader threat-modeling workstream.

Both paths are unblocked. PM chooses.

---

Session 80 wrapped: Phase 2a kickoff with the archive PRD digest task as the first deliverable; `audits/PHASE_B_PRIOR_ART_DIGEST.md` (449 lines) landed on main as commit `6cf5262`. This close-out is the only unpushed commit at session close. Zero outstanding feat branches. Phase 1 still active per MASTER_PLAN v1.7. Active D-count on main: 296 (latest D-381) — no D-numbers landed this session. Five Phase 2a inputs surfaced and flagged for the next chat to act on before per-category content authoring begins.
