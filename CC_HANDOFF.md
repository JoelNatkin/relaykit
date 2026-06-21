# CC_HANDOFF — Session 145: sub-vertical registry + WorkflowsSection wired into developer-tools (2026-06-21)

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.

**Status: on branch `feat/sub-vertical-registry` — five CC commits + a merge of `main`, NOT pushed (awaiting PM `gg`).** (Commit 5 — `fix: align developer-tools section order with category landing template`: pure JSX reorder in `page.tsx` moving `NumbersSection` + `Recognition` to after `Pricing` (before `FinalCta`), matching `app/messages/[category]/page.tsx`; no imports/logic change, tsc+eslint clean.)** `.pm-review.md` holds `git show HEAD`. No new D-numbers (additive Phase 1C work; registry data is PM-authored). Decision count unchanged (352 active, latest D-437). Active product phase unchanged: Phase 2 — Session B. This branch is **Phase 1C / A1–A3** work: the registry data + the Workflows display layer, now wired into the (noindex) `/for/developer-tools` page as the pattern A2 will generalize.

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

**Commit 3 — `fix: global token fallback table in WorkflowsSection + gold active toggle`**
- **`components/home/workflows-section.tsx`.** Added a module-level **`FALLBACKS`** table (display values for ~23 corpus tokens) as a final substitution pass after `workspace_name`/`business_name` + per-step `variableAliases` — so an unresolved `{{token}}` never renders literally (resolves flag #3, incl. `{{account_link}}`). `resolveStepBody` now returns `{ body, values }` (the values it injected, gated on token presence); a new **`renderBody`** bolds those values via a longest-first regex split into `<strong className="font-medium text-text-primary">`.
- **`app/for/developer-tools/messages-workflows-section.tsx`.** View toggle selected pill → **gold** (`border-bg-gold bg-bg-gold text-text-on-gold`, matching the category pills) per PM direction (resolves flag #4). Comment updated.
- tsc + eslint clean (no build — no new files/routes).

**Commit 4 — `feat: collapsible workflow cards, 3-col grid, larger dots, visible connectors`** (`workflows-section.tsx` + a 1-line toggle-spacing edit in `messages-workflows-section.tsx`)
- WorkflowsSection is now `"use client"`. Cards are **collapsed by default** (step names only) and expand **independently** (per-card `useState<Set<string>>`) to reveal step bodies; chevron (`ChevronDown`) rotates 180°. Grid → `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`. Step dots `size-[7px]`; connectors `bg-border-secondary` (more visible); expanded step body `text-[13px] leading-relaxed`. Workflows now render **sorted by step count desc** (copy, never mutating the prop).
- `messages-workflows-section.tsx`: added `mb-4` to the toggle container (item 6).
- tsc + eslint clean.

## ⚠ PM-review flags (in `.pm-review.md`)
0. **Commit 4 literal-instruction notes:** (a) kept `gap-3.5` on the grid — the spec's "to" class string omitted a gap, but dropping it would butt the cards together; (b) the dot got `pt-[2px]` as instructed, but on a border-box `size-[7px]` circle that padding has ~no visual effect — eyeball the dot/type centering on the preview; (c) `mb-4` was added to the toggle though the controls row already carries `mt-8`, so the gap grows rather than becoming exactly 16px — added verbatim per item 6.
1. **`messages-section.tsx` chromeless prop is a 3rd file beyond the original "two files only" scope** — PM-approved in-session (the clean way to avoid a duplicate heading/controls/`id="configurator"`).
2. **`#c9a84c` gold dot** (WorkflowsSection step rail) is still raw hex, not a token (`bg-bg-gold`). Live on the noindex preview. Tokenize if desired. *(The toggle now uses the `bg-bg-gold` token — only the step dots remain raw.)*
3. ✅ **Resolved (Commit 3)** — `{{account_link}}` and other unaliased tokens now render real display values via the `FALLBACKS` table.
4. ✅ **Resolved (Commit 3)** — view toggle selected-state is now gold (PM-directed).
5. **`DEVTOOLS_VARIABLES_EXAMPLE`** is an unused export in `sections.tsx` (VariablesSection no longer rendered here). Left in place (out of scope); remove when convenient.
6. **`FALLBACKS` display values** are CC-chosen sensible defaults (e.g. `code` → `480913`, `eta` → `30 min`, `severity` → `CRITICAL`) — PM may want to review the copy. Bolding keys off the *substituted value strings*, so a value that also appears as literal body text could over-bold (low risk; "keep it simple" per task).
7. Earlier flags still standing: 2 corpusIds corrected on insert (`new-device-signin`, `account-issue-notification`); unused `VariantTone` import dropped from `sub-verticals.ts`.

## Next task — Phase 1C continues
- **A2 (engineering):** generalize `/for/developer-tools` into the dynamic `app/for/[slug]/page.tsx` over the registry; resolve flags #2/#3 before lifting noindex; build `/messages/documents`.
- **A3 expansion:** author more `SUB_VERTICAL_LANDINGS` entries (PM authors from `docs/sub-verticals/`; CC writes the registry — never Airtable, D-421 AIRGAP).

## Branch state
`feat/sub-vertical-registry` (branched from `main` Session 144 close-out). **Five CC commits** (`4b20ac0` registry → `d5125f3` wiring → `f599905` fallbacks+gold → `4380ed8` collapsible cards → `a45f1e4` section reorder) + one merge of `main` (the copy update), all pushed to `origin`. **UNMERGED — awaiting PM preview sign-off.** When this merges to main, `main`'s copy update + the MASTER_PLAN A4 commit (below) are already there → clean (branch never touched those files). Other stale `feat/*` / `sketch/*` branches unchanged.

## Close-out (Session 145, mid-phase)
- **Metrics:** Commits: 5 on branch + 2 direct-to-main (`27b16c8` dev-tools copy, `1047bcd` MASTER_PLAN A4) + 1 merge | Files: 8 (3 new: `sub-verticals.ts`, `workflows-section.tsx`, `messages-workflows-section.tsx`; edited: `messages-section.tsx`, dev-tools `page.tsx`/`sections.tsx`, `MASTER_PLAN.md`, `CC_HANDOFF.md`) | Decisions added: 0 | External actions: 0 (git pushes only).
- **Quality gates:** `tsc --noEmit` + eslint clean across all session-touched files; `/api` untouched.
- **Decisions:** none added — the work implements existing **D-436/D-437** + Phase 1C; registry data is PM-authored. Ledger unchanged (352 active, latest D-437); pre-flight scan was clean at session open.
- **MASTER_PLAN A4** (PM-authored, found uncommitted in the branch tree) was committed **direct to main** (`1047bcd`, pushed) per PM call — a planning doc with no preview value, ungated by the branch review.
- **Phase boundary:** none (Phase 1C is a parallel stream; active product phase still Phase 2 Session B) → **retirement sweep + drift watch skipped** (mid-phase).
- **Canon owed AT MERGE** (surface is unmerged + noindex + still iterating — not "stabilized," so not written now): (1) **PROTOTYPE_SPEC** — a `/for/developer-tools` section (MessagesWorkflowsSection toggle, collapsible WorkflowsSection cards) + the new `MessagesSection` `chromeless`/controlled-`tone` props; (2) **REPO_INDEX** — Meta lead + doc/file rows for the 3 new files + branch state. **PRODUCT_SUMMARY:** n/a (no production customer-facing change — page is noindex/unmerged).
- **Standing PM-review flags** (in `.pm-review.md`): WorkflowsSection step dot still raw `#c9a84c`; FALLBACKS display values CC-chosen; `messages-section.tsx` chromeless prop = PM-approved 3rd file; `DEVTOOLS_VARIABLES_EXAMPLE` now an unused export in `sections.tsx`; Commit-4 literal-instruction notes (grid `gap-3.5` kept, dot `pt-[2px]` ≈ no-op, toggle `mb-4` stacks with `mt-8`).

## Untracked — DO NOT COMMIT
- `.claude/settings.local.json` (untracked); `.pm-review.md` (gitignored, holds `git show HEAD`).
