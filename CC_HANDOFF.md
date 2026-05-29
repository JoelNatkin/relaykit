# CC_HANDOFF — Session 119 — continuity-of-intent + D-421/D-422 + D-422 bucket-string rename

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.

**Date:** 2026-05-28
**Branches:** `main` only — no unmerged feature branches. `fix/marketing-home-polish` (merged Session 113) still exists locally + on origin pending Joel's cleanup call.

`Commits: 4 | Files modified: 7 | Decisions added: 2 | External actions: 4 (one push per commit)`

---

## Session character

A three-commit doc/data wave executing the front-edge of the elig-section build sequence. (1) MASTER_PLAN gains a new Working principle #7 "Continuity of intent" naming the public-surface → onboarding → registration data-carry promise as a load-bearing principle, paired with a matching PM-behavior bullet; (2) D-421 + D-422 land in DECISIONS, with the supersession rule kicking in mid-prompt — PM had marked `Supersedes: none` on D-422 but the grep surfaced D-418 as a genuine target, flagged, Joel re-routed to `Supersedes: D-418` and D-418 took its supersession mark in the same commit; (3) plan-mode + auto-mode executed step 1 of `/explorations/vertical-constraints.md` §6 — a mechanical rename of the `Bucket` union in `/lib/constraints/types.ts` and all 137 `bucket:` fields in `verticals.ts` to the D-422 five-bucket model. The `Declined at launch` split turned out fully deterministic from `constraintSource` (every Declined row carried `RelayKit-specific, deferred` → `Not yet`); no row required PM judgment. Each commit was pushed solo without a `.pm-review.md` cycle per Joel's standing directive this session.

The supersession catch is the substantive process moment — the system worked as designed (CLAUDE.md grep-before-append discipline flagged a conflict PM hadn't anticipated, before damage), and Joel accepted the redirect cleanly.

## Pre-flight ledger scan

```
DECISIONS ledger scan:
- Active count: 337 (latest D-422)  — was 335 at session start
- Archive range: D-01 through D-83
- New this session: D-421, D-422
- Marketing decisions: latest MD-20 (unchanged)
- Supersession marks landed: D-418 ⚠ Superseded by D-422 (same commit as D-422)
- No flags
```

## Commits — chronological

1. **`5d026f4` — `docs: add continuity-of-intent principle to MASTER_PLAN and PM instructions`.** 3 files / +4 / −1.
   - `MASTER_PLAN.md` — appended Working principle #7 "Continuity of intent" (long form — naming the public-surface → onboarding → registration data-carry promise, the scrutiny-shifts-not-data invariant, and the "never re-enter / never wave through" lines).
   - `PM_PROJECT_INSTRUCTIONS.md` — appended a one-line **Continuity of intent** bullet under §Standing Reminders > §PM behavior covering the same idea operationally ("design every public surface as the first step of registration, not a separate thing").
   - `REPO_INDEX.md` — MASTER_PLAN.md Last touched row bumped (Session 118 framing at the time — fixed to Session 119 in this close-out commit).

2. **`328c2cc` — `docs: record D-421 (/lib/constraints/ convention) and D-422 (elig section, five-bucket model)`.** 2 files / +29 / −1.
   - `DECISIONS.md` — D-421 (`/lib/constraints/` established as top-level shared-libs convention; Supersedes: none, with explicit notes that D-375's workspace-tooling rejection and D-381's deferred messages-storage architecture are unaffected) + D-422 (Eligibility section / "elig" replaces widget framing; five-bucket model; Supersedes: D-418) + the supersession mark `⚠ Superseded by D-422` appended to D-418's body.
   - `REPO_INDEX.md` — decision count 335 → 337, latest D-420 → D-422, with a Session 118-framed parenthetical (fixed to Session 119 in this close-out).

3. **`786dc10` — `chore: update Bucket strings in /lib/constraints/ to D-422 five-bucket model`.** 2 files / +142 / −142.
   - `lib/constraints/types.ts` — `Bucket` union swapped from the D-418 five strings (`Barred at launch` / `Vetting-required (indeterminate)` / `In-scope, with content rules` / `In-scope, no content rules` / `Declined at launch`) to the D-422 five (`Clear` / `Conditional` / `Not yet, maybe not ever` / `Not yet` / `Not our lane`).
   - `lib/constraints/verticals.ts` — all 137 `bucket:` fields updated. Final breakdown: 64 Clear · 25 Conditional · 35 "Not yet, maybe not ever" · 6 "Not yet" · 7 "Not our lane". Plan file: `/Users/macbookpro/.claude/plans/step-1-of-the-fluffy-gray.md`.

4. **This commit — close-out.** Three files: `REPO_INDEX.md` (Meta last_updated 2026-05-28 Session 118 → 119; decision-count parenthetical Session 118 → 119 with the D-421/D-422 decided-line cosmetic-mismatch flag added; Last touched columns for REPO_INDEX-self + MASTER_PLAN + PM_PROJECT_INSTRUCTIONS + DECISIONS + CC_HANDOFF bumped to Session 119), `PM_PROJECT_INSTRUCTIONS.md` (in-file Updated header bumped May 25 → May 28), `CC_HANDOFF.md` (this file, overwritten).

## Quality checks

- **tsc clean on `/lib/constraints/`** (filter for `^lib/constraints` in tsc output to skip pre-existing root-tsconfig noise from the marketing-site `@/*` alias collision). Verified inline before commit 3 — zero errors on filter.
- **Sanity grep on `verticals.ts`** — 0 old strings remaining, 137 new strings, per-bucket breakdown 64/25/35/6/7 = 137 ✓.
- **eslint / vitest skipped** — Joel's standing direction for `/lib/constraints/`-touching commits in this sequence.
- **No copy gate** — no user-facing strings added.

## Decisions

Two added: **D-421** and **D-422**. Both follow the canonical Decision / Why / Rejected alternative / Supersedes / Affects shape. D-418 took its supersession mark in the same commit as D-422.

**Cosmetic flag.** D-421 and D-422 both carry `**Decided:** 2026-05-28 (Session 118)` in their decided-line. This close-out demarcates Session 119, so by the session-counting convention the decided-line is one short. The decision bodies are immutable; the mismatch is cosmetic-only — it refers to the same calendar day, same workstream, across the prior 7f97955 close-out checkpoint. Flagged in the REPO_INDEX decision-count parenthetical so future readers don't read it as drift.

## Exploration-doc disposition

No exploration created, status-changed, or promoted this session. All four explorations remain `exploring`:
- `golden-path-gtm`
- `no-ein-sole-proprietor-path`
- `vertical-constraints` — its §6 step 3 (schema landing, prior session) and the new step 1 of the elig-section sequence (this session — `Bucket` rename) both shipped; the doc itself still describes the D-418 four-bucket model, awaiting the step-2 rewrite (PM-led, next session)
- `vertical-buckets-research`

REPO_INDEX's Active-explorations row for `vertical-constraints` (row 23) still says "Four-bucket eligibility model" — accurate to the doc's current state. Refreshes when the doc rewrite lands in step 2.

## Retirement sweep

N/A — mid-phase close-out (Phase 1 closed Session 111; Phase 2 Session B not yet kicked off). CLAUDE.md gates sweep to phase-boundary close-outs only.

## Drift watch

N/A — mid-phase close-out.

## Gotchas for next session

1. **`BucketReason` union still carries D-418-era strings.** `Carrier prohibition (statutory)`, `BAA gating (legal call)`, `Customer-pull dependent`, `TCR Special category`, `Vetting burden (case-by-case)`, `Standard eligibility` survive verbatim from D-418. Intentional — the `bucketReason` field describes *why a row sits in its bucket*, orthogonal to the bucket-string rename. A future commit that re-aligns reason strings to D-422 language is fine but not required; the current union is accurate row-level reasoning.

2. **`notes` free-text in `verticals.ts` carries cosmetic D-418-era phrases.** Words like "barred at launch", "deferred", "vetting" appear in row notes describing the rationale or context. These are prose, not typed fields; they're cosmetic drift, not contradictions. A separate notes-prose sweep can clean them if PM wants. Not done in step-1 commit on purpose.

3. **`/explorations/vertical-constraints.md` still describes the D-418 four-bucket model.** Step 2 of the elig-section sequence rewrites it (PM-led). Until then, the exploration doc and the constraint data diverge — code is the source of truth, doc is stale. REPO_INDEX's Active-explorations description column for the doc reflects the doc's current state; refreshes with the rewrite.

4. **`docs/AIRTABLE_SCHEMA.md` Bucket field options still list D-418 strings.** The live Airtable Constraints base (`appxThB8UWmNulAMt`) similarly carries D-418 strings in its singleSelect options. Both need re-mapping in a PM-led step 3 commit (paired — the doc reflects the live base). Until that lands, the schema doc and the committed `types.ts` Bucket union diverge.

5. **`prototype/lib/intake/industry-gating.ts` is now further stale.** Step 4 of the elig-section sequence per `/explorations/vertical-constraints.md` §6. The pre-existing staleness (flat 6-vertical model vs sub-vertical routing) compounds with the new bucket-model change; rework consumes both at once.

6. **Plan file `/Users/macbookpro/.claude/plans/step-1-of-the-fluffy-gray.md`** is the planning-time snapshot for the step-1 rename. Committed code is authoritative; the plan file is a historical artifact and may eventually be cleaned up alongside other `.claude/plans/` snapshots.

7. **`BucketReason` may need additions, not just renames, in a future commit.** D-422's "Not yet" bucket (capacity-deferred) accepts rows with bucket reasons across BAA gating, Customer-pull dependent, and Vetting burden — none of which are bucket-specific. If PM later wants per-bucket reason taxonomies tightened, that's a separate design pass.

### Surviving from prior sessions (no change this session)

8. **REPO_INDEX Active-explorations narrative for `vertical-constraints`** in the Meta block also says "four-bucket eligibility model" — same staleness as #3 above; same fix path (step-2 doc rewrite triggers refresh).

9. **All Session 118 / 117 / 116 gotchas remain operational** — see prior CC_HANDOFF if needed (the schema-landing version was the prior file content). Highlights:
   - `lib/constraints/verticals.ts` is populated (8 verticals · 137 sub-verticals · 12 content rules) per the PM connector-generated commit `7221164` that landed between the Session 118 close-out (7f97955) and this session's open.
   - `tsc --noEmit` at repo root produces unrelated marketing-site errors — filter for `^lib/constraints` when verifying.
   - Severity and Bucket union strings come from the live Airtable base, not from AIRTABLE_SCHEMA.md drift. Re-query the schema via `get_table_schema` before tweaking.
   - `MobileCategoriesModal` latent scroll-lock-on-desktop pattern (Session 107 carry-forward) unfixed.
   - `fix/marketing-home-polish` branch still exists locally + on origin post-Session-113 merge; cleanup Joel's call.
   - DECISIONS retirement sweep recommended before Phase 2 (Session 111 carry-forward).
   - D-49/D-18 carry no back-pointer to D-418 by PM direction (now also no back-pointer to D-422; same posture).
   - D-389/D-391/D-392/D-395/D-401 stale positional-language cleanup; PostHog dashboard rename pass; PostHog vs Plausible/Fathom reconciliation in MARKETING_STRATEGY; tooltip touch-event handling; D-378 stale parenthetical + D-380 drift; per-message "revert to RelayKit's default" + slash-command-for-variable-insertion configurator fast-follows; `docs/POST_TOPICS.md` untracked. Bundle of small Session 113/115 carry-forwards.
   - Punchy-style twin skill for `relaykit-writing-prose` anticipated, not yet authored.
   - BDR queue (Elizabeth Garner): four cumulative API/dashboard inconsistencies + Experiment 3c callback exposure + Experiment 4 opt-out tracking + per-campaign auto-response config.
   - Untracked carry-forward files: `.agents/`, `AGENTS.md`, `docs/POST_TOPICS.md`, `api/node_modules/`.
   - `.pm-review.md` is gitignored.
   - `no-ein-sole-proprietor-path` exploration: Sinch support reply still pending (email sent 2026-05-25).
   - MASTER_PLAN pointer to CUSTOMER_ARCHETYPE_FOUNDATION §4 — open.
   - PRICING_MODEL.md / PRODUCT_SUMMARY.md pricing-phrasing refresh vs new marketing-site copy — open.
   - MESSAGE_PIPELINE_SPEC drift flagged Session 111; reconciliation deferred to Phase 2 Session B kickoff.
   - STATE_VERSION 3→4 silent drop on the configurator; `isCompliant` = "no blockers" per D-415; iOS zoom fix at `marketing-site/app/globals.css`; `vertical-buckets-research.md` bucket values not committed policy (Airtable is the editable source — now superseded posture-wise by the D-422 model, but the source-of-truth pointer is unchanged).

## Files modified this session

7 unique:

- `MASTER_PLAN.md` — commit `5d026f4` (Working principle #7 appended).
- `PM_PROJECT_INSTRUCTIONS.md` — commit `5d026f4` (Continuity of intent bullet under §PM behavior) + this close-out (in-file Updated header May 25 → May 28).
- `REPO_INDEX.md` — commit `5d026f4` (MASTER_PLAN row Last touched) + commit `328c2cc` (decision count 335 → 337, latest D-422) + this close-out (Meta last_updated session bump to 119; decision-count parenthetical session framing; Last touched bumps on REPO_INDEX self + MASTER_PLAN + PM_PROJECT_INSTRUCTIONS + DECISIONS + CC_HANDOFF).
- `DECISIONS.md` — commit `328c2cc` (D-421 + D-422 appended; D-418 ⚠ Superseded by D-422 line appended to D-418 body).
- `lib/constraints/types.ts` — commit `786dc10` (Bucket union swap).
- `lib/constraints/verticals.ts` — commit `786dc10` (137 `bucket:` field rewrites).
- `CC_HANDOFF.md` — this file, overwritten in the close-out commit.

## Unmerged branches

None blocking. `fix/marketing-home-polish` exists locally + on origin (post-Session-113 merge); cleanup is Joel's call.

## Suggested next session

**Elig-section build sequence — steps 2–5** per `/explorations/vertical-constraints.md` §6:

- **Step 2 (PM-led)** — rewrite `/explorations/vertical-constraints.md` for the D-422 five-bucket model: rename "widget" → "Eligibility section" / "elig" throughout; rewrite the bucket section to describe the five buckets in D-422 language with per-bucket UX shape and verdict-copy patterns; add the multi-tenant routing note for the "Not yet" bucket. Triggers REPO_INDEX Active-explorations description refresh.
- **Step 3 (paired)** — `docs/AIRTABLE_SCHEMA.md` Bucket field options re-mapped to D-422 strings + live Airtable base (`appxThB8UWmNulAMt`) Bucket singleSelect options updated via the Airtable MCP connector. PM-driven on the live base; CC-driven on the schema doc.
- **Step 4 (CC)** — `prototype/lib/intake/industry-gating.ts` rework. The pre-existing staleness (flat 6-vertical model vs sub-vertical routing per D-418) plus the new bucket-model change consume in one pass. Single callsite (`prototype/components/registration/business-details-form.tsx`); migration surface is contained. Sketch lives in `/Users/macbookpro/.claude/plans/plan-mode-task-design-the-zippy-sutherland.md` under "industry-gating.ts rework sketch" — adapt the tier-derivation to the new five-bucket model (Clear/Conditional → no/advisory gate; "Not yet, maybe not ever" / "Not yet" → waitlist-shape gate; "Not our lane" → hard decline).
- **Step 5 (CC)** — Eligibility section UI build on the marketing-site. Per-bucket verdict copy + per-bucket UX shape (Clear → continue; Conditional → continue with content-rules preview; Not yet, maybe not ever → vetting-waitlist join; Not yet → capacity-waitlist join; Not our lane → final decline with explanation).

**Background carry-forwards** still viable as fillers in any session:

- PRICING_MODEL.md / PRODUCT_SUMMARY.md pricing-phrasing refresh (Session 113 carry-forward).
- MASTER_PLAN pointer to CUSTOMER_ARCHETYPE_FOUNDATION §4 (Session 114 carry-forward).
- Focused DECISIONS retirement sweep session (Session 111 carry-forward).
- Watch for the Sinch support reply (Session 112 carry-forward).
- `fix/marketing-home-polish` branch cleanup — optional housekeeping.
- Phase 2 Session B kickoff prep round — independent thread per MASTER_PLAN §Active focus.
