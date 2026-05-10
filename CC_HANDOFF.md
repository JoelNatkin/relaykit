# CC_HANDOFF — Session 76 (dark-mode pass on `feat/dark-mode`)

**Date:** 2026-05-09
**Session character:** Code session on production-facing surface (`/marketing-site`). Dark-mode pass resumed mid-stream after a VS Code restart — branch was at `c844609` with 5 setup commits already pushed. Three polish commits added this session, one new D-number recorded (D-378), close-out staged but not pushed pending PM review.
**Branch:** `feat/dark-mode` — pushed to origin through `82c126c`, **DO NOT MERGE**. Awaiting Joel preview verification at the latest Vercel preview URL (rebuilt on each push, latest from commit `82c126c`) and PM merge approval. **DO NOT PUSH this close-out commit** — PM review happens first per session-end direction.

`Commits: 9 across the branch (5 prior setup + 3 polish + 1 close-out — pending) | Files modified: 6 unique across the branch + 4 doc files this close-out | Decisions added: 1 (D-378) | External actions: 3 pushes to origin/feat/dark-mode (one per polish commit; close-out push held)`

---

## Commits this session (chronological order)

| # | Hash | Description |
|---|------|-------------|
| 1 | `1164c8b` | feat(marketing): add dark-mode token block to globals.css *(prior session — pushed pre-Session-76)* |
| 2 | `62cf4ee` | feat(marketing): inline FOUC-prevention script + suppressHydrationWarning *(prior session)* |
| 3 | `c10d549` | feat(marketing): useTheme hook + lint coverage for lib/ *(prior session)* |
| 4 | `5baa47e` | feat(marketing): dark-mode toggle in TopNav *(prior session)* |
| 5 | `c844609` | fix(marketing): paint body in bg-bg-primary so dark mode covers full page *(prior session)* |
| 6 | `98641b2` | feat(marketing): swap text-white → text-text-white on brand-solid CTAs *(this session)* |
| 7 | `37e28f5` | feat(marketing): wordmark _neg variants on hero AI_TOOLS *(this session)* |
| 8 | `82c126c` | feat(marketing): introduce bg-code-surface token; swap home `<pre>` off bg-primary-solid *(this session)* |
| 9 | _(this close-out)_ | docs: Session 76 close — dark-mode pass + D-378 |

Commits 1–8 already pushed to origin. The final close-out commit will **not push at session end** — PM review happens before push per session-end direction.

---

## What was completed

### 1. Resumed mid-stream after VS Code restart

Branch was already at `c844609` with 5 setup commits pushed (token block, FOUC script, useTheme + lint, toggle, body bg). Joel restated the plan: three polish commits + spot-check + close-out, all on `feat/dark-mode`.

### 2. Commit 6 — `text-white` → `text-text-white` sweep (`98641b2`)

Two raw `text-white` literals on `bg-bg-brand-solid` buttons swapped to the Untitled UI semantic token `text-text-white`:
- `marketing-site/components/configurator-section.tsx:901` — CTA "Start building with SMS →"
- `marketing-site/components/configurator/message-edit-card.tsx:431` — Save button

Matches the tooltip pattern in the same files (lines 445 + 284 already used `text-text-white`) and the project rule: never use raw Tailwind colors. `text-text-white` resolves to white in both themes — semantically the same, conceptually the right token.

### 3. Commit 7 — wordmark `_neg` variants on hero AI_TOOLS (`37e28f5`)

Adds optional `negSrc` field to the `AI_TOOLS` const in `marketing-site/app/page.tsx`:
- **Cline / Cursor / Windsurf** wire up the `_neg.svg` Joel placed in `marketing-site/public/logos/tool_logos_wordmarks/`. Render branches via dual `<Image>` elements wrapped in `<span className="contents">` (preserves the parent flex layout). Pattern: `block dark:hidden` for `_pos`, `hidden dark:inline-block` for `_neg`, `aria-hidden` on the duplicate so screen readers don't announce both.
- **Claude / Copilot** have no `_neg` asset yet. Stay on the CSS filter workaround `brightness-0 dark:invert`. TODO comment on the const flags Joel-action to source `claude_neg.svg` and `Copilot_neg.svg` so all five can drop to the dual-Image swap.

Filter math for the workaround branch: Tailwind composes filters as `brightness(0) invert(1)`. `brightness(0)` crushes RGB to (0, 0, 0); `invert(1)` flips to (255, 255, 255). Net: black in light, white in dark. `dark:brightness-100` is unnecessary because brightness comes before invert in Tailwind's filter declaration order.

### 4. Commit 8 — `bg-code-surface` semantic token (`82c126c`)

Adds `--color-bg-code-surface` defined as `gray-950` in BOTH the light `@theme` block and the `.dark` block of `marketing-site/app/globals.css`. Swaps the home-page CodeSample's `<pre>` from `bg-bg-primary-solid` to `bg-bg-code-surface`. Code surface stays inverted (dark surface, light text) in both themes — code samples don't flip with the page.

The two-token separation (`bg-primary-solid` vs `bg-code-surface`) was the key architectural call: configurator tooltips (lines 445 + 284) keep `bg-bg-primary-solid` because tooltips ARE intended to flip per the Untitled UI tooltip pattern; the code block needs the OPPOSITE behavior. One token can't serve both.

### 5. Decision recorded — D-378

**D-378 — Dark mode mechanism, code-surface token, brand shift conventions** (Date: 2026-05-09)

Vanilla React + CSS dark mode (no `next-themes`). `.dark` class on `<html>`, `localStorage` key `relaykit-theme`, `prefers-color-scheme` first-visit default, FOUC prevented by inline pre-hydration script + `suppressHydrationWarning`. Per-origin storage scope; `app.relaykit.ai` future surfaces manage their own theme. New `--color-bg-code-surface` semantic token distinct from `--color-bg-primary-solid` so the code surface stays inverted regardless of page theme. Brand shift conventions in dark: `bg-brand-solid` flips `brand-600 → brand-500`, brand text tokens shift to `brand-300/400` family for adequate contrast.

**Supersedes:** none. **Reasoning:** `next-themes` adds a runtime dep + provider boundary for ~60 lines of behavior. Two-token separation gives tooltips and code blocks each the right behavior. Per-origin storage scope is intentional given `app.relaykit.ai` will be a separate Next.js app.

### 6. PROTOTYPE_SPEC.md updated

Home-page subsection patches for D-378:
- Hero wordmark paragraph rewritten to cover the `negSrc` dual-render mechanism + CSS-invert workaround for Claude/Copilot
- Section 3 code-block paragraph rewritten to use `bg-bg-code-surface` (was `bg-bg-primary-solid`) with the rationale embedded
- New dedicated dark-mode paragraph at the end of the home-page subsection enumerating mechanism + all 8 dark-mode commit hashes

### 7. REPO_INDEX.md updated

Meta block refresh (Last updated, Decision count D-377 → D-378, Active branch, Unpushed commits). Change log gains the Session 76 entry as line 298.

---

## What's in progress

`feat/dark-mode` is **NOT MERGED**. Joel verifies the latest Vercel preview (rebuilt on each push, latest from commit `82c126c`); PM gives the merge call. No mid-stream code work — the dark-mode pass is functionally complete on this branch as of the bg-code-surface commit, modulo Joel-sourced `_neg` SVGs for Claude / Copilot (TODO comment in code).

---

## Quality checks passed

- `tsc --noEmit` clean per commit
- `eslint` clean per commit (project's `eslint .` script). One eslint warning `File ignored because no matching configuration was supplied` on `app/globals.css` is non-blocking — eslint config doesn't cover .css files
- Local dev boot clean (port **3002** — note: marketing-site dev runs on 3002, not 3000 like prototype)
- `GET /` + `/signup` + `/start/get-started` + `/start/verify` + `/privacy` + `/terms` + `/acceptable-use` all 200 in dark mode
- Dual-render verified: `curl -s http://localhost:3002/ | grep -o "(Cursor|windsurf|Cline)_(pos|neg)"` returns all six expected URLs
- Bundle: not re-measured this session (changes are token additions + className edits + dual-Image; no new deps; net size impact small)
- DECISIONS ledger pre-flight scan: clean. D-378 supersedes none. No orphan supersession references. No format-compliance flags.

---

## Pending / carry-forward

1. **Joel preview verification + PM merge approval** for `feat/dark-mode`. Branch will not be merged until both clear. If feedback requires further iteration, additional commits land on the same branch before merge.

2. **Three `text-white` literals on form pages** — surfaced during pre-commit-8 raw-color spot-check, NOT migrated this branch (out of scope per session plan):
   - `marketing-site/app/signup/page.tsx:15` — submit button
   - `marketing-site/app/start/get-started/get-started-form.tsx:55` — submit button (`disabled:opacity-60`)
   - `marketing-site/app/start/verify/verify-form.tsx:44` — submit button (`disabled:opacity-60`)
   
   Same pattern as commit 5's two fixes. Trivial follow-up branch — five-line sweep + tsc + lint + push.

3. **Claude / Copilot `_neg.svg` assets** — TODO comment on `marketing-site/app/page.tsx` AI_TOOLS const flags Joel-action. Once placed in `marketing-site/public/logos/tool_logos_wordmarks/`, drop the CSS-invert workaround and add `negSrc` for those two entries. Keeps the filter trick out of the codebase entirely.

4. **`feat/home-page-restructure` from Session 75** — still unmerged at `5e9e6b8`, still awaiting Joel preview + PM merge call. Untouched this session.

5. **Apply D-377 to the prototype configurator** (`prototype/components/configurator-section.tsx`). Carry-forward from Session 75 — marketing-side has Verification toggleable + "Verification only" preset + empty state; prototype still locks Verification on. Separate dedicated session/commit.

6. **Phase 1 downstream experiments still UNBLOCKED.** Experiment 2b (live sample SMS over the approved campaign), Experiment 3c (Simplified→Full brand upgrade), Experiment 4 (STOP/START/HELP reply handling). All procedures drafted.

7. **Earlier carry-forward items still applicable:**
   - Stage 2 (`docs/BRAND_DIRECTION.md`) — consumes BRAND_AUDIT.md synthesis to produce the design system with point of view. Not yet started; large-scope session.
   - MD-number capture session — strategy-shaped session that walks the BRAND_AUDIT.md synthesis and decides which findings rise to MD-number status in MARKETING_STRATEGY.md.
   - Pumping Defense Wave 2 work deferred to Phase 5/8 design activation.
   - Broader threat-modeling workstream (BACKLOG entry) — launch-period deliverable, promotes `SECURITY_DRAFT.md` to canonical.
   - Migration 006 manual application — SQL committed but not applied to live shared Supabase.
   - Joel-actionable marketing items: affiliate signups (ShipFast 50%, Supastarter, Saaspegasus, MakerKit) + remaining tooling confirmation.
   - Per-vertical hybrid pages, starting with Verification — `/verification` page carrying its own configurator slice + vertical-specific copy + integration code samples.
   - Real cropped screencaps for Section 4's Preview list panel — HTML/CSS mock is v1; Joel may swap real screencaps later.
   - Brand SVG assets for the Section 3 starter-kit row (ShipFast, Supastarter, MakerKit, Vercel + Supabase) — text labels are v1.

---

## Retirement sweep findings

None — mid-phase close-out, no MASTER_PLAN phase boundary crossed (Phase 1 still active).

---

## Drift-watch findings

None — mid-phase close-out, drift-watch skipped per CLAUDE.md step 9.

---

## Gotchas for next session

1. **DO NOT push this close-out commit until PM approves.** Per session-end direction. Once PM reads CC_HANDOFF and approves, push to origin.

2. **DO NOT merge `feat/dark-mode` until Joel reviews the latest preview and PM approves the merge.** Branch is feature-complete as of `82c126c`; further iteration on the same branch is acceptable if preview review surfaces issues.

3. **Two unmerged branches in flight.** `feat/home-page-restructure` (Session 75) is still at `5e9e6b8` awaiting Joel preview + PM merge call. `feat/dark-mode` (this session) is at `82c126c` (pre-close-out) awaiting same. Sequence the merges deliberately — `feat/dark-mode` was branched off `c844609`, which is itself ahead of main; check the merge-order interaction before merging.

4. **Marketing-site dev runs on port 3002, not 3000.** Prototype is 3000. The `npm run dev` script in `marketing-site/package.json` pins `-p 3002`. If you see `EADDRINUSE: address already in use :::3002` on boot, kill the existing listener (`lsof -ti:3002 | xargs kill -9`) and restart.

5. **Filter math for Claude/Copilot wordmarks is order-sensitive.** Tailwind composes filters in declaration order, with brightness BEFORE invert. The composed filter chain `brightness(0) invert(1)` works precisely because brightness runs first (crushes to black), then invert flips to white. If a future contributor adds `dark:brightness-100` thinking it "completes" the pattern, the filter chain becomes `brightness(0) invert(1) brightness(1)` which is still white but adds noise. If they swap declaration order accidentally, the result becomes `invert(1) brightness(0)` which is just black in both modes. Leave the pattern as `brightness-0 dark:invert`.

6. **Dual-Image rendering for `_neg`-equipped wordmarks ships TWO SVGs per logo to the browser.** One is always hidden via `dark:` variant. Cost: ~3 extra small-SVG fetches in dark mode. Acceptable trade-off for avoiding a hydration boundary on the static hero. If those SVGs grow large or if the count grows, reconsider the approach — moving to a client component with `useTheme` would render only the active variant.

7. **`bg-bg-code-surface` is a deliberate two-token separation from `bg-bg-primary-solid`.** Both resolve to `gray-950` in light mode. Tooltips use `bg-bg-primary-solid` (intended to flip to `gray-900` in dark per Untitled UI tooltip pattern); code surfaces use `bg-bg-code-surface` (theme-invariant gray-950). If a future contributor "consolidates" the two tokens, either tooltips lose their dark-mode shift or code blocks gain an unwanted shift. Hold the separation.

8. **Storage key `relaykit-theme` is per-origin.** `app.relaykit.ai` (future surface) will manage its own theme persistence and may diverge — D-378 is explicit about this. Don't try to share the key cross-origin without a custom domain auth dance.

9. **`.pm-review.md`, `api/node_modules/`, and a working-tree `.gitignore` modification (adds `.pm-handoff.md` to ignore)** remain untracked / unstaged — standing local-only artifacts, not staged this session. The `.gitignore` mod predates Session 75.

---

## Files modified this session

**Branch total this session (4 unique files, 3 commits):**

Modified:
- `marketing-site/app/page.tsx` (commit 7: AI_TOOLS gains `negSrc` field + dual-Image render branch + TODO comment; commit 8: home-page CodeSample `<pre>` className `bg-bg-primary-solid` → `bg-bg-code-surface`)
- `marketing-site/components/configurator-section.tsx` (commit 6: `text-white` → `text-text-white` on CTA button line 901)
- `marketing-site/components/configurator/message-edit-card.tsx` (commit 6: `text-white` → `text-text-white` on Save button line 431)
- `marketing-site/app/globals.css` (commit 8: `--color-bg-code-surface` declared in both `@theme` and `.dark` blocks as `gray-950`)

**Branch total across all 8 commits (this session + prior 5):** 6 unique files — the four above plus `marketing-site/app/layout.tsx` and `marketing-site/components/top-nav.tsx` (touched by prior setup commits; not modified this session) and `marketing-site/lib/use-theme.ts` and `marketing-site/eslint.config.mjs` (introduced by prior setup commits).

**Doc updates this final close-out (4):**
- `DECISIONS.md` (+D-378 with `Supersedes: none`)
- `PROTOTYPE_SPEC.md` (home-page subsection — hero wordmark dual-render paragraph, Section 3 code-block paragraph, new dedicated dark-mode paragraph)
- `REPO_INDEX.md` (Meta block refresh + decision_count D-377 → D-378 + change-log Session 76 entry)
- `CC_HANDOFF.md` (this file — overwrite)

**Untracked-but-untouched (not staged):**
- `.pm-review.md` — local-only review artifact, not refreshed this session
- `api/node_modules/` — standing untracked

**Working-tree change carried over (not staged):**
- `.gitignore` — Session 74 carryover adding `.pm-handoff.md` to ignore. Not authored this session, not staged.

**Untouched this session:** `/prototype`, `/api`, `/sdk`, `/src`, `MASTER_PLAN.md`, `MARKETING_STRATEGY.md`, all of `/docs/`, audits, experiments. `feat/home-page-restructure` from Session 75 untouched.

---

## Suggested next session

Aligned with the active master plan phase (**Phase 1 — Sinch Proving Ground**, still active per MASTER_PLAN v1.6) and the unmerged branch state:

1. **Wait for Joel preview verification + PM merge call** on `feat/dark-mode` AND `feat/home-page-restructure`. Sequence the two merges deliberately. If feedback comes back with issues on either, iterate on the same branch before merge.

2. **Three `text-white` form-page literals follow-up** — small dedicated branch mirroring commit 5's pattern. Five-line sweep + tsc + lint + push. Could fit alongside another small task.

3. **Apply D-377 to the prototype configurator** — separate dedicated session per BACKLOG item. Mirrors Session 75's marketing-side D-377 work into `prototype/components/configurator-section.tsx`, syncs PROTOTYPE_SPEC's prototype-side configurator entry. Small-scope session.

4. **Phase 1 downstream experiments** — Experiments 2b / 3c / 4 remain UNBLOCKED. All procedures drafted. Joel-driven; high-leverage on product-readiness side.

5. **Per-vertical hybrid pages, starting with Verification** — `/verification` page carrying its own configurator slice + vertical-specific copy + integration code samples. Phase 6 alignment; not Phase 1 work, but a natural follow-on once the home-page restructure merges.

6. **Stage 2 (`BRAND_DIRECTION.md`)** — when Joel routes back to the brand line. Consumes BRAND_AUDIT.md synthesis to produce the design system with point of view.

---

Dark-mode pass wrapped on `feat/dark-mode`. Branch is pushed through `82c126c` and ready for Joel preview verification at the latest Vercel preview URL Vercel posted on the bg-code-surface commit. **Do not merge until PM directs.** **Do not push this close-out commit until PM reads + approves.** D-378 recorded with `Supersedes: none`. Three follow-up `text-white` form-page literals captured in carry-forward; Claude/Copilot `_neg` SVG sourcing flagged as Joel-action via TODO comment in code.
