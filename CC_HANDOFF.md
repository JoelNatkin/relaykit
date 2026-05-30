# CC_HANDOFF — Session 121 — elig section structural build complete (Waves 1–3)

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.

**Date:** 2026-05-29
**Branches:** `main` only — no unmerged feature branches. `fix/marketing-home-polish` (merged Session 113) still exists locally + on origin pending Joel's cleanup call.

`Commits: 5 | Files modified: 15 | Decisions added: 0 | External actions: 4 pushes`

---

## Session character

The full structural build of the home configurator elig section per `/explorations/vertical-constraints.md` §9 and D-422 — completing step 7 of that exploration's §6 sequence. Three waves, four production commits + a PM-review revision, all reviewed via `.pm-review.md` and approved before push. No new D-numbers — the build implements existing D-422 + the §9 design verbatim; no alternative-rejection moments triggered. PROTOTYPE_SPEC, PRODUCT_SUMMARY, REPO_INDEX, and the exploration doc itself all updated this close-out to reflect the new surface.

The session arc spans across the broader elig section work that started Session 120 (groundwork: `73155cb` `ContentRule.categoriesAffected` schema field + pre-submission exploration tracked; `040f12a` Session 120 close-out). Session 121's four wave commits + the Wave 2 PM-review revision deliver the live UI consuming that schema and that data layer:

- **Wave 1 — `c9dddc4`** — three-dropdown skeleton + state hook with lazy-create `localStorage.relaykit_elig` rule (key absent until first interaction) + verdict derivation (multi-tenant short-circuit; `lookupEligibility` path; vertical-only-shared-bucket branch kept for data robustness though currently unreachable in production data) + `eligD3Placeholder` helper with 5 awkward-vertical overrides.
- **Wave 2 — `0150537`** — verdict cards across all five D-422 buckets (3 §9.4 anchored 🟡 cards + generic 🟡 fallback; 🟠/⚫ inline waitlist with `interest_tag` POST; 5 §9.6 🔴 anchored lines + surveillance two-tier carve-out + generic 🔴 fallback; multi-tenant-specific ⚫ copy) + disabled categories panel + empty-state placeholder + bottom CTA hide on 🔴 + migration 009 for the nullable `interest_tag` column.
- **Wave 2 revision — `5284d35`** — PM review revision: bottom CTA now hides on every disabled bucket (🟠/⚫/🔴), not just 🔴. `isMessageAreaDisabled` and `hideBottomCta` collapsed to the same boolean. Single-file, single-purpose revision commit.
- **Wave 3 — `297af90`** — per-category §9.5 cards under affected category headers on 🟡 verdicts + `categoriesAffected` gating + Verification carve-out + non-functional Examples chevron (§9.8 expander content deferred, sniff-test-gated).

## Pre-flight ledger scan (at session open)

```
DECISIONS ledger scan:
- Active count: 337 (latest D-422) — unchanged
- Archive range: D-01 through D-83
- New since last session: none
- Marketing decisions: latest MD-20 (unchanged)
- No flags
```

## Commits — elig arc (chronological, Sessions 120 + 121)

Sessions 120 commits (prerequisites, already in 120's CC_HANDOFF):
1. `73155cb` — `chore: ContentRule.categoriesAffected schema field + pre-submission exploration tracked` (Session 120 / "Session A" of the elig arc per Joel's framing).
2. `040f12a` — `chore(close-out): Session 120 — vertical-constraints rewrite + ContentRule.categoriesAffected groundwork`.

Session 121 commits (this session):
3. `c9dddc4` — `feat(marketing-site): Wave 1 elig section — three-dropdown skeleton + state + localStorage emission`. 4 files / +570.
4. `0150537` — `feat(marketing-site): Wave 2 elig section — verdict cards (5 buckets) + disabled categories + empty state + interest_tag waitlist`. 7 files / +711 / −105.
5. `5284d35` — `fix(marketing-site): hide elig bottom CTA on 🟠/⚫ too, not just 🔴`. 1 file / +12 / −9.
6. `297af90` — `feat(marketing-site): Wave 3 elig section — per-category cards on 🟡 verdicts (§9.5)`. 3 files / +130.
7. **This commit — close-out.** REPO_INDEX.md, PROTOTYPE_SPEC.md, docs/PRODUCT_SUMMARY.md, explorations/vertical-constraints.md, CC_HANDOFF.md (this file overwritten).

## Quality checks

- **tsc --noEmit clean on `marketing-site/`** — verified after each wave + at close-out.
- **eslint clean on `marketing-site/`** — verified after each wave + at close-out.
- **Per-commit `.pm-review.md` cadence** observed for all four production commits (Wave 1, Wave 2, Wave 2 revision, Wave 3). Each commit paused for PM review before push.
- **Dev server restart** done after each wave (kill port 3002, `rm -rf .next`, restart) per end-of-task workflow rule. Dev server running on `localhost:3002` at close-out — confirm before next session starts a fresh restart.
- **Doc-only close-out commit** skipped `.pm-review.md` per ceremony filter (Joel's directive — close-out doc updates are mechanical).

## Decisions

None added. The build implements existing D-422 + the §9 design verbatim — no alternative-rejection moments triggered.

## Exploration-doc disposition

- **`vertical-constraints`** — §6 step 7 (elig section UI build) now strike-through complete. The doc's Status header bumped to reflect Session 121 completion of step 7. Steps 5/6/8/9 outstanding (Airtable re-mapping + `industry-gating.ts` rework + per-vertical primer authoring + SMS 101 page). Doc stays at `Status: exploring` — promotion still gated on the remaining steps per §8.
- **`pre-submission-state-and-editability`** — unchanged this session.
- All other explorations unchanged.

## Retirement sweep

N/A — mid-phase close-out (Phase 1 closed Session 111; Phase 2 Session B not yet kicked off).

## Drift watch

N/A — mid-phase close-out.

## Gotchas for next session

### Critical for next deploy

1. **Migration 009 needs Supabase SQL Editor application before next production deploy.** `api/supabase/migrations/009_early_access_interest_tag.sql` adds a nullable `interest_tag` column + partial index to `early_access_subscribers`. Without it, the elig section's 🟠/⚫ inline waitlist inserts will fail (the route handler now writes the column unconditionally). Existing signups (without `interest_tag`) continue to work because the column is nullable. Apply via the Supabase SQL Editor; the file is the migration script, not yet applied.

### Wave 3 / data layer

2. **`categoriesAffected` gating is wired but inert.** Every rule in `lib/constraints/verticals.ts` omits the field today, so "absent ⇒ applies to all" is the universal branch. The 3 anchored 🟡 sub-verticals therefore surface per-category cards under every non-Verification checked category. Once PM populates `categoriesAffected` per rule (e.g. to scope a Banking rule to Account events only), the gating tightens automatically with no code change. Verification is hardcoded out at the rendering layer regardless of `categoriesAffected`.

3. **Vertical-only D2 resolution branch is dead today.** `useEligState`'s "verticalSlug set + no `routingTrigger: true` rows" branch never fires — every vertical in `verticals.ts` has at least one routing-trigger sub-vertical. Kept for data robustness; would activate if a vertical with all-`routingTrigger: false` rows ever lands. PM verified this pre-flight Session 121.

4. **D3 lists ALL sub-verticals of the picked vertical** (not just `routingTrigger: true` rows). PM confirmed Wave 1 review: routing-trigger flag determines whether D3 surfaces at all, not what verdicts the sub-verticals can produce. A 🟢 Clear sub-vertical selected via D3 (in a vertical with routing triggers) resolves to 🟢 verdict — that's intended behavior.

### UX choices PM should validate live

5. **Brand-system call:** §9.3's literal "blue info card" (🟡) and "orange info card" (🟠/⚫/🔴) expressed via neutral lifted surface (`bg-bg-secondary`) + semantic icon/text colors (success-secondary for 🟢/🟡; warning-secondary for 🟠/⚫/🔴). The post-D-405 monochrome palette has no chromatic accent except warning/error/success. PM approved with "if the visual weight reads too light once rendered, we revisit as polish."

6. **Beyond-strict-§9.3 UX decisions** (PM approved Wave 2):
   - Tone pills + Copy + kebab + business name input hidden on every disabled bucket (dead UI when no message stream renders).
   - Bottom CTA hidden on every disabled bucket (revised in `5284d35` — Wave 2 PM review).

### Surviving from prior sessions (no change this session)

7. **All Session 120 gotchas remain operational.** Highlights:
   - `BucketReason` union still carries D-418-era strings (cosmetic — describes *why a row sits in its bucket*, orthogonal to bucket strings).
   - `notes` free-text in `verticals.ts` carries D-418-era phrases ("barred at launch", "deferred", "vetting") — cosmetic, prose-not-typed.
   - `docs/AIRTABLE_SCHEMA.md` Bucket field options still list D-418 strings; live Airtable Constraints base (`appxThB8UWmNulAMt`) similarly carries D-418 singleSelect options. Both need re-mapping in PM-led step 5 of `/explorations/vertical-constraints.md` §6.
   - `prototype/lib/intake/industry-gating.ts` rework: compounded with bucket-model change (step 6 of `/explorations/vertical-constraints.md` §6).
   - `pre-submission-state-and-editability.md` exploration still active.
   - REPO_INDEX active-explorations description for `vertical-constraints` refreshed this close-out (drops the stale "four-bucket" carry-forward).

8. **All Session 118 / 117 / 116 / 115 / 114 / 113 / 112 / 111 gotchas remain operational** — see Session 120 CC_HANDOFF if needed. Highlights:
   - `MobileCategoriesModal` latent scroll-lock-on-desktop pattern (Session 107 carry-forward) unfixed.
   - `fix/marketing-home-polish` branch still exists locally + on origin post-Session-113 merge.
   - DECISIONS retirement sweep recommended before Phase 2 (Session 111 carry-forward).
   - D-389/D-391/D-392/D-395/D-401 stale positional-language cleanup; PostHog dashboard rename pass; PostHog vs Plausible/Fathom reconciliation in MARKETING_STRATEGY.
   - Tooltip touch-event handling; D-378 stale parenthetical + D-380 drift.
   - Per-message "revert to RelayKit's default" + slash-command-for-variable-insertion configurator fast-follows.
   - Untracked carry-forward files: `.agents/`, `AGENTS.md`, `docs/POST_TOPICS.md`, `api/node_modules/`.
   - `.pm-review.md` is gitignored.
   - `no-ein-sole-proprietor-path` exploration: Sinch support reply still pending (email sent 2026-05-25).
   - MASTER_PLAN pointer to CUSTOMER_ARCHETYPE_FOUNDATION §4 — open.
   - PRICING_MODEL.md / PRODUCT_SUMMARY.md pricing-phrasing refresh vs new marketing-site copy — open.
   - MESSAGE_PIPELINE_SPEC drift flagged Session 111; reconciliation deferred to Phase 2 Session B kickoff.
   - Punchy-style twin skill for `relaykit-writing-prose` anticipated, not yet authored.
   - BDR queue (Elizabeth Garner): four cumulative API/dashboard inconsistencies + Experiment 3c callback exposure + Experiment 4 opt-out tracking + per-campaign auto-response config.
   - D-49/D-18 carry no back-pointer to D-418/D-422 by PM direction.

## Files modified this session

15 unique:

**Wave 1 (`c9dddc4`):**
- `marketing-site/lib/configurator/use-elig-state.ts` (new)
- `marketing-site/components/configurator/elig-dropdown.tsx` (new)
- `marketing-site/components/configurator/elig-section.tsx` (new)
- `marketing-site/components/configurator-section.tsx` (modified — Wave 1 mount)

**Wave 2 (`0150537`):**
- `marketing-site/lib/configurator/elig-copy.ts` (new)
- `marketing-site/components/configurator/elig-verdict-card.tsx` (new)
- `marketing-site/components/configurator/elig-empty-state.tsx` (new)
- `marketing-site/components/configurator/elig-section.tsx` (modified — verdict card mount)
- `marketing-site/components/configurator-section.tsx` (modified — verdict gating)
- `marketing-site/app/api/early-access/route.ts` (modified — interest_tag accepted)
- `api/supabase/migrations/009_early_access_interest_tag.sql` (new)

**Wave 2 revision (`5284d35`):**
- `marketing-site/components/configurator-section.tsx` (modified — bottom CTA hide on all disabled buckets)

**Wave 3 (`297af90`):**
- `marketing-site/lib/configurator/elig-copy.ts` (modified — per-category copy + isCategoryAffected)
- `marketing-site/components/configurator/elig-per-category-card.tsx` (new)
- `marketing-site/components/configurator-section.tsx` (modified — per-category card mount)

**Close-out (this commit):**
- `REPO_INDEX.md` (Meta + Last touched rows + new "elig section (Session 121)" sub-section + `vertical-constraints` exploration row refresh)
- `PROTOTYPE_SPEC.md` (new "Configurator Elig section" sub-section + Last updated bump + Bottom CTA bullet annotation)
- `docs/PRODUCT_SUMMARY.md` (§3 paragraph adds elig surface + Last reviewed bump)
- `explorations/vertical-constraints.md` (Status header bump + §6 step 7 strike-through)
- `CC_HANDOFF.md` (this file, overwritten)

## In progress

None.

## Unmerged branches

None blocking. `fix/marketing-home-polish` exists locally + on origin (post-Session-113 merge); cleanup is Joel's call.

## Suggested next session

**Joel testing pass on the live elig section** at `localhost:3002` — walk the matrix: every vertical × sub-vertical combination, multi-tenant short-circuit, reset × on each dropdown, the three anchored 🟡 expanded prose (legal/banking/healthcare-admin), the six 🔴 lines (cannabis/firearms/vape/adult-content/adult-dating/surveillance), the generic 🟡 fallback (any non-anchored 🟡 sub-vertical), the inline waitlist on 🟠/⚫ (will fail on insert until migration 009 lands — note for testing), per-category cards under non-Verification categories on the anchored 🟡 trio, Verification carve-out confirmed (no per-category card on Verification anywhere). Notes from the testing pass may seed refinement work (copy tweaks, visual polish, edge-case fixes).

**Downstream elig-arc sessions** (any/all can pick up next per Joel's priority):
- **Step 5** — AIRTABLE_SCHEMA + live Airtable Constraints base bucket-option re-mapping to D-422 strings. PM-led via the Airtable connector.
- **Step 6** — `prototype/lib/intake/industry-gating.ts` rework decision (whether to rework in `/prototype` pre-sunset, or fold the gating logic into the elig section's verdict directly).
- **Step 8** — per-vertical primer authoring (legal / banking / healthcare-admin primers as customer pull demands; not all 25 🟡 sub-verticals speculatively).
- **Step 9** — SMS 101 public tier-3 page assembly once 1–8 exist.

**Migration 009 application** — Joel applies via the Supabase SQL Editor before next production deploy. The migration file is the script; one-time apply.

**Background carry-forwards** still viable as fillers in any session:
- REPO_INDEX active-explorations description for `vertical-constraints` already refreshed this close-out (drops "four-bucket" carry-forward).
- PRICING_MODEL.md / PRODUCT_SUMMARY.md pricing-phrasing refresh (Session 113 carry-forward).
- MASTER_PLAN pointer to CUSTOMER_ARCHETYPE_FOUNDATION §4 (Session 114 carry-forward).
- Focused DECISIONS retirement sweep session (Session 111 carry-forward).
- Watch for the Sinch support reply (Session 112 carry-forward).
- `fix/marketing-home-polish` branch cleanup — optional housekeeping.
- Phase 2 Session B kickoff prep round — independent thread per MASTER_PLAN §Active focus.
- Examples expander content for §9.5 per-category cards — deferred per §9.8, sniff-test-gated.
