# CC_HANDOFF — Session 145: sub-vertical registry + WorkflowsSection wired into developer-tools (2026-06-21)

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.

**Status: on branch `feat/sub-vertical-registry` — two CC commits + a merge of `main`, NOT pushed (awaiting PM `gg`).** `.pm-review.md` holds `git show HEAD`. No new D-numbers (additive Phase 1C work; registry data is PM-authored). Decision count unchanged (352 active, latest D-437). Active product phase unchanged: Phase 2 — Session B. This branch is **Phase 1C / A1–A3** work: the registry data + the Workflows display layer, now wired into the (noindex) `/for/developer-tools` page as the pattern A2 will generalize.

---

## What this branch contains (in commit order)

**Commit 1 — `feat: sub-vertical registry types, developer-tools entry, WorkflowsSection component`**
- **`lib/landing/sub-verticals.ts` (new).** `WorkflowStep`/`Workflow`/`SubVerticalLanding` interfaces + `SUB_VERTICAL_LANDINGS` (one entry — **developer-tools**, 9 curated workflows) + `findSubVerticalLanding`/`subVerticalSlugs`. Workflows are a display layer over the universal corpus: each step points at a corpus message via `corpusId` (`"category-id:message-id"`) or carries `customVariants`; `variableAliases` give contextual placeholders.
- **`app/for/developer-tools/page.tsx` (edit).** Removed the broken `findSubVertical` import + unused `SUB`/`DATA_SLUG` resolve block.
- **`components/home/workflows-section.tsx` (new).** Presentational `WorkflowsSection({ workflows, businessName, tone })` — two-column stepped cards (corpus lookup + tone/alias substitution), MessagesSection card chrome.

**Merge — `main` merged in** to bring the developer-tools **copy update** (`27b16c8`, sections.tsx hero/Moment/Q&A/HeroNotificationMock examples) onto the branch so the preview is coherent.

**Commit 2 — `feat: wire WorkflowsSection into developer-tools page with Workflows / All messages toggle`**
- **`app/for/developer-tools/messages-workflows-section.tsx` (new, client).** Owns one heading + a **Workflows / All messages** segmented toggle (Workflows default) + the shared business-name + tone controls. Reads the entry from `findSubVerticalLanding("developer-tools")`. Workflows view → `<WorkflowsSection …>`; All messages view → `<MessagesSection chromeless tone … defaultCategory>`. Business name is the shared configurator store (drives both views automatically); tone is local and passed to both.
- **`components/home/messages-section.tsx` (edit).** Added a **`chromeless`** prop (renders only pills + cards — no `<section>`/`id`, no heading block, no controls) + a **controlled `tone`** prop (`activeTone = toneProp ?? internal`). Standalone/home behavior unchanged (both new props default off/undefined). This is the third file — **PM-approved in-session** (the only clean way to nest the browser under a shared heading without a duplicate `id="configurator"`, duplicate heading, and duplicate controls).
- **`app/for/developer-tools/page.tsx` (edit).** Replaced the standalone `<MessagesSection …>` + `<VariablesSection …>` pair with `<MessagesWorkflowsSection />`; dropped the now-unused `MessagesSection`/`VariablesSection`/`DEVTOOLS_VARIABLES_EXAMPLE` imports. (`DEVTOOLS_VARIABLES_EXAMPLE` is still exported from `sections.tsx`, now unused — see flags.)

**Verification:** tsc clean, eslint clean, `npm run build` green; `/for/developer-tools` prerenders **static** (4.71 kB).

## ⚠ PM-review flags (in `.pm-review.md`)
1. **Added a 3rd file (`messages-section.tsx`) beyond the "two files only" task scope** — PM-approved in-session via the chromeless-prop option (nesting the full self-contained MessagesSection would have duplicated heading/controls and the `id="configurator"`).
2. **`#c9a84c` gold dot is now LIVE** on `/for/developer-tools` (Workflows view) — still raw hex, not a token (`bg-bg-gold`). Page is noindex, but it's visible on the preview now. Tokenize if desired.
3. **`{{account_link}}` renders literally** in the two `quota-breach` workflow steps (Workflows view) — no alias for that token, per the registry/spec substitution rule. Visible on the preview now. Needs an alias (or a global account-link default) before this goes indexable.
4. **View toggle selected-state uses neutral** (`bg-border-primary`), not gold — gold is reserved for category selection (D-405/D-427). Flagging the choice.
5. **`DEVTOOLS_VARIABLES_EXAMPLE`** is now an unused export in `sections.tsx` (VariablesSection no longer rendered on this page). Left in place (out of task scope); remove when convenient.
6. Earlier flags still standing: 2 corpusIds were corrected on insert (`new-device-signin`, `account-issue-notification`); the unused `VariantTone` import was dropped from `sub-verticals.ts`.

## Next task — Phase 1C continues
- **A2 (engineering):** generalize `/for/developer-tools` into the dynamic `app/for/[slug]/page.tsx` over the registry; resolve flags #2/#3 before lifting noindex; build `/messages/documents`.
- **A3 expansion:** author more `SUB_VERTICAL_LANDINGS` entries (PM authors from `docs/sub-verticals/`; CC writes the registry — never Airtable, D-421 AIRGAP).

## Branch state
`feat/sub-vertical-registry` (branched from `main` Session 144 close-out). Two CC commits + one merge of `main` (the copy update), unpushed at write time. When this merges to main, `main`'s copy update is already there → clean. Other stale `feat/*` / `sketch/*` branches unchanged.

## Untracked — DO NOT COMMIT
- `.claude/settings.local.json` (untracked); `.pm-review.md` (gitignored, holds `git show HEAD`).
