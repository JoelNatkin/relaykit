# CC_HANDOFF — Session 118 — `/lib/constraints/` schema landing

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.

**Date:** 2026-05-28
**Branches:** `main` only — no unmerged feature branches. `fix/marketing-home-polish` (merged Session 113) still exists locally + on origin pending Joel's cleanup call.

`Commits: 2 | Files modified: 6 | Decisions added: 0 | External actions: 1 (one push to origin/main carrying both this session's commits)`

---

## Session character

Code-landing session in plan-mode. Joel directed a schema-only design pass for the repo constraint data file (`/explorations/vertical-constraints.md` §6 step 3, the single enforcement source of truth the configurator widget and the reworked `industry-gating.ts` will both read). Pattern: plan-mode → research (read the docs + the existing flat `industry-gating.ts` + the live Airtable base for ground-truth select-option strings) → plan file written + AskUserQuestion to resolve placement/scope → plan approved → auto-mode implementation → close-out.

Two substantive commits: the four-file schema landing (`66218be`), and this close-out.

The PM correction worth flagging up front: the plan file's "Joel hand-transfers" framing for populating `verticals.ts` is **superseded** — PM connector-generates the populated array from the Airtable Constraints base (`appxThB8UWmNulAMt`) via the Airtable MCP connector, not by hand. The committed `verticals.ts` comment + REPO_INDEX + this handoff all reflect the connector-generated framing; the planning artifact at `/Users/macbookpro/.claude/plans/plan-mode-task-design-the-zippy-sutherland.md` retains the older framing as a planning-time snapshot, not current truth.

## Pre-flight ledger scan

```
DECISIONS ledger scan:
- Active count: 335 (latest D-420) — unchanged this session
- Archive range: D-01 through D-83
- New this session: none
- Marketing decisions: latest MD-20 (unchanged)
- No flags
```

## Commits — chronological

1. **`66218be` — `feat: add constraint data file schema (types, empty data placeholder, lookup helpers)`.** 4 files / +172 / −0 (all new files).
   - `lib/constraints/types.ts` — `Bucket` / `BucketReason` / `ConstraintSource` / `Severity` union types (verbatim live-base option strings: `Bucket` strips the doc's emoji prefixes but keeps `"(indeterminate)"`; `Severity` strips parentheticals to bare `"Enforced"` / `"Advisory"`; other unions match the doc exactly); `ContentRule` / `SubVertical` / `Vertical` interfaces; `Status` and `Priority` Airtable fields intentionally omitted (authoring-workflow only).
   - `lib/constraints/verticals.ts` — `export const VERTICALS: ReadonlyArray<Vertical> = []`. Empty placeholder; comment notes PM-via-connector generation.
   - `lib/constraints/lookup.ts` — `lookupEligibility(verticalSlug, subVerticalSlug)` (the named eligibility consumer; sub-vertical required, not optional, because every vertical in the data has sub-verticals); `findVertical` / `findSubVertical` direct lookups; `getContentRules(subVerticalSlug)` returning `ContentRule[]` (empty array for most). Lazy-memoized `Map<slug, …>` indexes built on first call.
   - `lib/constraints/index.ts` — barrel re-export of all types, `VERTICALS`, the four lookup helpers, and the `EligibilityVerdict` type.

2. **This commit — close-out.** Two files: `REPO_INDEX.md` (Meta `Last updated` → 2026-05-28 / Session 118; `CC_HANDOFF.md` row in canonical-docs table refreshed off the Session 115 stale state flagged as Session 117 gotcha (a); new section "constraint data layer (Session 118)" added between the configurator-authoring-layer section and the Claude Code skills section, with the four-file table + design-choices recap) and `CC_HANDOFF.md` (this file, overwritten).

## Quality checks

- **`tsc --noEmit` clean on `/lib/constraints/`** — root tsconfig is strict and picks up `**/*.ts`. Filtering tsc output for `lib/constraints/` yields zero errors. (Other tsc output is pre-existing noise from the root tsconfig's `@/*` → `./src/*` alias colliding with marketing-site's own `@/*` → `./marketing-site/*` alias — untouched by this session.)
- **eslint / vitest skipped per Joel's direction** — only `/lib/constraints/` `.ts` files touched, and Joel said skip those gates outside that dir.
- **No copy gate** — no user-facing strings added; all four files are infrastructure with internal comments only.

## Decisions

None added this session. D-counts unchanged: 335 active, latest D-420; archive D-01–D-83.

### D-number candidates flagged for PM (not recorded unilaterally)

Per Joel's close-out direction, flagging two design choices made this session that may or may not warrant D-numbers — PM decides:

**Candidate A — `/lib/constraints/` as a new top-level shared directory.** This is the first shared-code surface between `/marketing-site` and `/prototype/api`; the repo has had no such convention before (each app carries its own `lib/`). Six-month test: a future contributor adding another piece of code consumed by both apps would benefit from knowing the convention exists and where it lives. Alternative-test: real alternatives were considered in the AskUserQuestion call (`marketing-site/lib/constraints/` vs new top-level `/lib/constraints/` vs `prototype/lib/constraints/`); top-level won on cleanest separation. **CC lean:** plausibly worth a D-number, or alternatively a one-line addition to CLAUDE.md noting the shared-libs convention. PM's call.

**Candidate B — Inline rule nesting on `SubVertical` (vs. separate keyed collection).** The plan explains the rationale: mirrors the Airtable "one rule = one sub-vertical, duplicate when shared" invariant; lookups trivialize; no dangling-ID class of bug. Alternative-test: real (separate `Record<RuleId, Rule>` was the considered alternative). Six-month test: a future CC session can discover the shape from `types.ts` in 10 seconds — the choice is self-documenting from the code, not load-bearing convention. **CC lean:** does not warrant a D-number. PM's call.

## Exploration-doc disposition

No exploration created, status-changed, or promoted this session. All four explorations remain at status `exploring`:
- `golden-path-gtm`
- `no-ein-sole-proprietor-path`
- `vertical-constraints` — the schema in this session implements this exploration's §6 step 3; not yet promoted
- `vertical-buckets-research`

Active explorations count unchanged at 4.

## Retirement sweep

N/A — mid-phase close-out (Phase 1 closed Session 111; Phase 2 Session B not yet kicked off). CLAUDE.md gates sweep to phase-boundary close-outs only.

## Drift watch

N/A — mid-phase close-out.

## Carry-forward watch items

### NEW this session

**(a) `lib/constraints/verticals.ts` is an empty placeholder awaiting connector-generated data.** PM session pulls the 8 verticals / 137 sub-verticals / 12 content-rule rows from Airtable base `appxThB8UWmNulAMt` via the Airtable MCP connector and populates the `VERTICALS` array. Slugs are kebab-case, hand-authored at generation time (sub-verticals lack a Slug field in Airtable today). Once the data is committed, `industry-gating.ts` rework becomes unblocked.

**(b) `industry-gating.ts` rework is the next CC pickup**, per `/explorations/vertical-constraints.md` §6 step 4. Gated on (a) above. Sketch lives in the plan file under "industry-gating.ts rework sketch": tier derivation from bucket (Barred → hard_decline_blocked; Declined / Vetting-required → hard_decline_waitlist; In-scope-with-rules → advisory; In-scope-no-rules → no gate); keyword regexes retire; flat healthcare-decline goes away; single callsite (`prototype/components/registration/business-details-form.tsx`) so migration surface is contained.

**(c) Two D-number candidates flagged for PM** (see Decisions section above): `/lib/constraints/` top-level placement, and inline-rule-nesting. CC lean documented; PM decides.

**(d) Plan file `/Users/macbookpro/.claude/plans/plan-mode-task-design-the-zippy-sutherland.md`** carries the "Joel hand-transfers" framing that PM superseded post-approval. Plan files are planning-time snapshots, not current-truth artifacts; the committed code and REPO_INDEX are authoritative on the connector-generated framing. Noting here so a future reader cross-referencing the plan doesn't propagate the older framing.

**(e) Routing-trigger semantics still ambiguous.** Schema carries `routingTrigger: boolean` as passthrough; the Airtable schema-doc text ("Does this sub-vertical surface in a conditional secondary dropdown in widget?") doesn't pin down what the per-row checkbox actually gates. Resolution waits on the widget build (§6 step 7). No design action needed in the data-population session.

### Surviving from Session 117 (no change this session unless noted)

**(f) REPO_INDEX's CC_HANDOFF row staleness from Session 117 gotcha (a) — RESOLVED this session.** The row now reflects Session 118.

**(g) Session 116's `338ddb8` AIRTABLE_SCHEMA commit + Session 117's `6b29fd8` vertical-buckets-research commit + Session 117's close-out commit pushed together on Session 117's push.** Already-resolved historical context, no action.

**(h) `vertical-buckets-research.md` bucket values are not committed policy** — the doc itself flags this; the Airtable base is the editable source. Schema-design this session inherits the same posture: union types are committed; row data is editable in Airtable until populated into `verticals.ts`.

### Surviving from earlier sessions (no change this session)

**(i) `/explorations/vertical-constraints.md` §6 sequence remains operative.** Step 3 (this session's schema landing) now sits in the repo; step 4 (industry-gating rework) is unblocked once data fills (a); step 5 (per-vertical primer authoring) and step 6 (configurator copy authoring) sequence after; step 7 (widget build) reads the data file.

**(j) `(committed)` / `(indeterminate)` BACKLOG marker convention** (D-420) — still sparsely applied; PM may direct a marker sweep later.

**(k) MASTER_PLAN pointer to CUSTOMER_ARCHETYPE_FOUNDATION §4** — Joel/PM-side carry-forward; still open.

**(l) PRICING_MODEL.md / PRODUCT_SUMMARY.md pricing-phrasing refresh** vs new marketing-site copy — carry-forward.

**(m) Sinch support reply pending** — email sent 2026-05-25; still awaiting reply.

**(n) Phase 2 Session B kickoff prep round** is the named alternative CC-side pickup per MASTER_PLAN §Active focus — independent of the constraint-data workstream. Either constraint-data populate → industry-gating rework OR Phase 2 Session B kickoff prep is the right next thing; PM decides which thread CC picks up first.

**(o) Punchy-style twin skill** for `relaykit-writing-prose` — anticipated, not yet authored.

**(p) MESSAGE_PIPELINE_SPEC drift** flagged Session 111 — reconciliation deferred to Phase 2 Session B kickoff.

**(q) BDR queue (Elizabeth Garner)** — four cumulative API/dashboard inconsistencies + Experiment 3c callback exposure + Experiment 4 opt-out tracking + per-campaign auto-response config.

**(r) `MobileCategoriesModal` latent scroll-lock pattern** — same fix as `EditValuesModal` viewport guard; fix on the next session that touches it.

**(s) `fix/marketing-home-polish` branch** still exists locally + on origin post-Session-113 merge. Joel's cleanup call.

**(t) DECISIONS retirement sweep recommended before Phase 2.** Session 111 carry-forward.

**(u) D-49/D-18 carry no back-pointer to D-418** by PM direction. Carry-forward.

**(v) D-389/D-391/D-392/D-395/D-401 stale positional-language cleanup; PostHog dashboard rename pass; PostHog vs Plausible/Fathom reconciliation in MARKETING_STRATEGY; tooltip touch-event handling; D-378 stale parenthetical + D-380 drift; per-message "revert to RelayKit's default" + slash-command-for-variable-insertion configurator fast-follows; `docs/POST_TOPICS.md` untracked.** Bundle of small Session 113/115 carry-forwards; no change this session.

## Gotchas for next session

1. **`verticals.ts` is empty.** Any CC code that imports `VERTICALS` or calls the lookups will return `null` / empty arrays until PM populates. Do not rely on data being there before PM's connector-generation session lands.

2. **`tsc --noEmit` at repo root produces unrelated marketing-site errors** from the root tsconfig's `@/*` → `./src/*` alias colliding with marketing-site's own alias. These are pre-existing and untouched by this session. When verifying `/lib/constraints/` typechecks, filter for `^lib/constraints` in the tsc output rather than reading the whole error list.

3. **Severity and Bucket union strings come from the live Airtable base, not from AIRTABLE_SCHEMA.md.** The doc has known drift: Bucket carries emoji prefixes in the doc that don't exist in the live base; Severity has parenthetical-extended labels in the doc that are bare in the live base. The committed `types.ts` strings match the live base. If AIRTABLE_SCHEMA.md is later updated to drop the drift, the union types should stay matched to whatever the live base actually carries — re-query the schema via `get_table_schema` before tweaking.

4. **`industry-gating.ts` rework requires the data to be in `verticals.ts` first.** Sequence matters; CC can scaffold the rework in advance but verifying the migration end-to-end needs populated data.

5. **No DECISIONS entry was added this session even though two design choices arguably warrant one.** PM has the flags (in this handoff's Decisions section); next session may see D-numbers landed or may not, depending on PM's call.

### Surviving gotchas from prior sessions (no change this session)

All Session 116 / 117 gotchas remain operational:
- **Untracked carry-forward files**: `.agents/`, `AGENTS.md`, `docs/POST_TOPICS.md`, `api/node_modules/`.
- **`.pm-review.md` is gitignored**.
- **No-EIN exploration is `Status: exploring`**.
- **STATE_VERSION 3→4 silent drop**, **`isCompliant` = "no blockers"** (D-415).
- **iOS zoom fix** lives at `marketing-site/app/globals.css` `@media (max-width: 767.98px)`.
- **`vertical-buckets-research.md`'s bucket values are not committed policy** — Airtable is the editable source.

## Files modified this session

6 unique (4 from the schema commit `66218be` + 2 from this close-out):

- `lib/constraints/types.ts` — commit `66218be` (new, 46 lines).
- `lib/constraints/verticals.ts` — commit `66218be` (new, 12 lines).
- `lib/constraints/lookup.ts` — commit `66218be` (new, 79 lines).
- `lib/constraints/index.ts` — commit `66218be` (new, 19 lines).
- `REPO_INDEX.md` — this close-out commit (Meta last_updated bump + CC_HANDOFF row refreshed + new "constraint data layer (Session 118)" section added).
- `CC_HANDOFF.md` — this file, overwritten in the close-out commit.

## Unmerged branches

None blocking. `fix/marketing-home-polish` exists locally + on origin (post-Session-113 merge); cleanup is Joel's call.

## Suggested next session

**For PM:** Airtable bulk-extract → `verticals.ts` populate via the Airtable MCP connector. Sequence: read Verticals table → read Sub-verticals table → join on parent vertical → read Rules table → join on `Applies to` → assemble nested TypeScript object literals → author kebab-case sub-vertical slugs at generation time → write to `lib/constraints/verticals.ts`. Tested by `tsc --noEmit` + a smoke-call against `lookupEligibility("financial-services", "banking-budgeting-apps")` returning a non-null verdict.

**For CC, after the data lands:** `industry-gating.ts` rework per `/explorations/vertical-constraints.md` §6 step 4. Sketched in the plan file under "industry-gating.ts rework sketch". Single callsite (`prototype/components/registration/business-details-form.tsx`); migration surface is contained.

**Background carry-forwards** still viable as fillers in any session:

- **PRICING_MODEL.md / PRODUCT_SUMMARY.md pricing-phrasing refresh** (Session 113 carry-forward).
- **MASTER_PLAN pointer to CUSTOMER_ARCHETYPE_FOUNDATION §4** (Session 114 carry-forward).
- **Focused DECISIONS retirement sweep session** (Session 111 carry-forward).
- **Watch for the Sinch support reply** (Session 112 carry-forward).
- **`fix/marketing-home-polish` branch cleanup** — optional housekeeping.
- **Phase 2 Session B kickoff prep round** — independent thread per MASTER_PLAN §Active focus.
