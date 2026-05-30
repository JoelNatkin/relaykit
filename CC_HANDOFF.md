# CC_HANDOFF — Session 122 — MD-21 free-tool reframe recorded; configurator reframe sketched (WIP, unpromoted)

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS / MARKETING_STRATEGY), product behavior (PRODUCT_SUMMARY). Write for the next reader.

**Date:** 2026-05-30
**Branches:** `main` at `4c655d3` (pushed). **Active WIP branch: `sketch/configurator-reframe`** at `a482a73` (NOT pushed, NOT merged). `fix/marketing-home-polish` (merged Session 113) still exists locally + on origin pending Joel's cleanup call.

`Commits: 3 (1 sketch WIP a482a73 + 1 doc on main 4c655d3 + 1 close-out on main) | Files modified: 13 | Decisions added: 0 D-numbers (MD-21 recorded in MARKETING_STRATEGY.md) | External actions: 2 pushes (main only; sketch deliberately unpushed)`

---

## Session character

A **doc + sketch session** — no production code shipped to `main`. Two distinct workstreams:

1. **The reframe decision was recorded** on `main` (doc commit `4c655d3`, pushed): MD-21 in `docs/MARKETING_STRATEGY.md`, MD-19 superseded, MASTER_PLAN launch-focus sentence added.
2. **The reframe itself was built as a throwaway sketch** on `sketch/configurator-reframe` across ~15 rapid react-and-iterate passes, then committed as a single WIP checkpoint (`a482a73`). **It is deliberately unfinished and unpromoted.** Next session restructures it into clean, reviewable commits and runs it through PM review before any merge to `main`.

Close-out scoped accordingly: skipped tsc/eslint/vitest (no prod code on main; the sketch is WIP and not being validated yet), no PROTOTYPE_SPEC / PRODUCT_SUMMARY updates (the documented UI on `main` hasn't changed — those update when the sketch lands).

## Commits this session

- **`a482a73`** (on `sketch/configurator-reframe`, NOT pushed) — `wip: configurator reframe sketch — Session 122 (checkpoint before doc edits)`. 9 files / +642 / −368. All under `marketing-site/`. Scoped to `marketing-site/` deliberately — the pre-existing untracked carry-forwards (`.agents/`, `AGENTS.md`, `api/node_modules/`, `docs/POST_TOPICS.md`) and the `.claude/settings.json` modification were kept OUT of the checkpoint (`api/node_modules/` is untracked-not-ignored and must never be committed).
- **`4c655d3`** (on `main`, pushed) — `docs: record MD-21 (free-tool reframe), supersede MD-19, MASTER_PLAN launch-focus clarification`. 2 files / +19 / −1.
- **This commit — close-out** (on `main`) — `CC_HANDOFF.md` (overwritten), `REPO_INDEX.md` (Meta + 4 Last-touched rows).

## Pre-flight ledger scan (at session open)

```
DECISIONS ledger scan:
- Active count: 337 (latest D-422) — unchanged
- Archive range: D-01 through D-83
- New since last session: none
- Marketing decisions: latest MD-21 (Session 122 — was MD-20)
- No flags
```

No new D-numbers Session 122. The marketing reframe correctly landed as **MD-21 in MARKETING_STRATEGY.md** (marketing-decision sequence), NOT in DECISIONS.md — do not duplicate it there. MD-19 carries its `⚠ Superseded by MD-21` mark (added in the same commit `4c655d3`).

## What the sketch contains (high level — `sketch/configurator-reframe` @ `a482a73`)

The Session 122 configurator reframe, operationalizing MD-21. All changes are in `marketing-site/`:

- **Hero reframe** — subhead → "Compliant text messages for your app. Free to use."; deleted the PRE-LAUNCH eyebrow + the "Free to build. $49 + $19/mo to go live." line; removed the "Get early access" button from the top appbar (dark-mode toggle kept); moved the AI-tool logo row out of the hero down into the "Hand it to your AI tool." section.
- **Configurator bucket-behavior changes** (verdict surface only — buckets/dropdowns/message rendering logic untouched):
  - 🟢 Clear — renders no verdict element at all (messages below are the confirmation).
  - 🟡 Conditional — lightweight "rules card" (info icon + "Your industry has a few rules." + flat bullets) in the message-card shell, replacing the old expander.
  - ⚫ Not yet + 🟠 Not yet, maybe not ever — share ONE treatment: the rules card + a plain (uncolored) warning-icon boundary line "RelayKit can't send this category yet." + a "Request category" link opening a modal (new `elig-request-modal.tsx`, mirrors the waitlist modal pattern). The old orange "Coming soon" card + inline email were removed.
  - 🔴 Not our lane — those sub-verticals are now **unselectable**: greyed + grouped at the bottom of the sub-vertical dropdown under a "Not supported" divider/header. The old orange not-our-lane verdict card was retired (removed).
- **Bottom-section restructure** — added an H1 "Shipping Summer 2026" header above the lower content block; the closing CTA became a two-column section with an inline email capture (new `bottom-email-capture.tsx`) headed "Join the list." (left column; right column empty).
- **CTA changes** — configurator bottom CTA relabeled "Get early access" → "Copy messages"; appbar CTA removed; bottom inline "Join the list".

Files in the sketch: `app/page.tsx`, `components/configurator-section.tsx`, `components/top-nav.tsx`, `components/configurator/{elig-dropdown,elig-section,elig-verdict-card}.tsx`, `lib/configurator/elig-copy.ts` (modified); `components/bottom-email-capture.tsx`, `components/configurator/elig-request-modal.tsx` (new).

## Known-incomplete items in the sketch (must be resolved during promotion)

1. **`.claude/settings.json` permissions allowlist now in place.** A permissions allowlist was added to settings this session (the file is currently modified in the working tree on both branches — it's a local/harness config, intentionally NOT committed to the sketch). It will be read at next session start. If the modification should be committed somewhere, decide where.
2. **Mocked Pharmacies bullets.** The ⚫/🟠 rules-card bullets are hardcoded in `elig-copy.ts` (`NOT_YET_BULLETS`), keyed to `pharmacies-prescription-apps` and a clearly-commented placeholder for `health-condition-management`. Not data-driven; real per-vertical copy TBD.
3. **Empty right column** in the "Join the list" bottom section — intentional placeholder for now.
4. **Real messages not authored** for the Review-needed (🟠) / Not-yet (⚫) buckets — their message area is intentionally left empty this pass (production will show full messages for all buckets except values-barred). Only the card/line/modal shell was built.
5. **"Copy messages" CTA still opens the waitlist modal.** Only the label changed this pass (`openModal("mid-page")` is unchanged) — so the button says "Copy messages" but currently opens the early-access modal rather than copying. Rewire during promotion (either to the real copy action or the existing top-of-stream Copy behavior).
6. **The not-our-lane parent gating is now dead-but-present.** `isMessageAreaDisabled` in `configurator-section.tsx` still lists `not-our-lane`; since those subs can't be selected, the tier is unreachable from fresh interaction. Harmless; clean up during promotion if desired.
7. **Bucket terminology mismatch to watch:** the PM prompts called Pharmacies the "Not yet, maybe not ever" bucket, but in the data Pharmacies is bucket `"Not yet"` (⚫). The sketch wires the shared treatment to BOTH tiers, so both render identically regardless — but keep the data truth in mind when authoring copy.

## Sketch promotion plan (next session)

Restructure `a482a73` into clean, atomic, reviewable commits (hero / configurator-verdict / bottom-section / CTA, roughly), run `tsc --noEmit` + `eslint` on `marketing-site/` (the sketch was lint-clean per pass but verify the squashed state), resolve the known-incomplete items above (or explicitly defer each), then PM review of the Vercel preview before merge to `main`. On promotion, update PROTOTYPE_SPEC.md (configurator verdict surface + hero + bottom section) and PRODUCT_SUMMARY.md (customer-experience change), and update `docs/PRE_LAUNCH_DEVIATIONS.md` to reflect the superseded MD-19 posture (per MD-21's "Operationalized by").

## Quality checks

- **Skipped tsc/eslint/vitest at close-out** per session scope (doc-only commit to main; sketch is WIP, not validated yet). NOTE: each sketch pass was individually verified `tsc`/`eslint` clean on `marketing-site/` during the session, but the squashed checkpoint state has not been re-validated — do that at promotion.
- Doc-only close-out commit; no `.pm-review.md` ceremony (mechanical close-out doc updates per the established filter).

## Retirement sweep / Drift watch

N/A — mid-phase close-out (Phase 2 Session B not yet kicked off).

## Gotchas / carry-forwards (still operational)

- **Migration 009** (`api/supabase/migrations/009_early_access_interest_tag.sql`) still needs Supabase SQL Editor application before the next production deploy of the marketing site — the elig 🟠/⚫ inline waitlist `interest_tag` insert (Session 121) depends on it. Still unapplied. (The sketch's new `elig-request-modal` POST also writes `interestTag`, so this remains relevant on promotion.)
- Untracked carry-forward files persist in the working tree: `.agents/`, `AGENTS.md`, `api/node_modules/` (untracked-not-ignored — never commit), `docs/POST_TOPICS.md`. `.claude/settings.json` modified (see item 1).
- `.pm-review.md` is gitignored.
- All Session 121/120/118 carry-forwards remain (see prior handoff history if needed): `BucketReason`/`notes` D-418-era strings in `verticals.ts` (cosmetic); `AIRTABLE_SCHEMA.md` + live Airtable base bucket options need D-422 re-mapping (step 5); `industry-gating.ts` rework (step 6); per-vertical primers (step 8); SMS-101 page (step 9); `MobileCategoriesModal` desktop scroll-lock latent pattern; `no-ein-sole-proprietor-path` Sinch support reply still pending; MESSAGE_PIPELINE_SPEC drift deferred to Phase 2 Session B kickoff; punchy-style twin prose skill not yet authored; BDR queue (Elizabeth Garner) items.

## Suggested next session

1. **Promote the configurator reframe sketch** — the primary follow-up. Restructure `a482a73` into clean commits, resolve/defer the known-incomplete items, PM review the Vercel preview, then merge to `main`. Update PROTOTYPE_SPEC + PRODUCT_SUMMARY + PRE_LAUNCH_DEVIATIONS on landing.
2. **Apply migration 009** (Joel, via Supabase SQL Editor) before any production deploy of the marketing site.
3. Background carry-forwards remain available as fillers (Airtable re-map / `industry-gating.ts` rework / per-vertical primers / SMS-101 page; DECISIONS retirement sweep before Phase 2; Sinch support reply watch; `fix/marketing-home-polish` branch cleanup).
4. **Phase 2 Session B kickoff prep** — independent thread per MASTER_PLAN §Active focus.
