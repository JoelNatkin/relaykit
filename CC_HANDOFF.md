# CC_HANDOFF — Session 96 (configurator four-fixes)

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out. Includes commits, completed work, in-progress, gotchas, files modified, unmerged branches, suggested next tasks.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader, not as a session memoir.

**Date:** 2026-05-18
**Branch:** `feat/configurator-one-corpus` — 11 commits (Session 95 one-corpus wave + this Session 96 four-fixes commit), **pushed to origin**, **not merged**. Awaiting Joel's merge decision after a Vercel preview check.

`Commits: 1 | Files modified: 8 | Decisions added: 1 (D-404) | External actions: 1 (git push)`

---

## Session character

A single bundled commit landing four polish fixes on top of the Session 95 configurator rewrite, before Joel's Vercel preview check. Plan-mode-gated. Branch is `tsc` + `eslint` + `next build` clean.

## The four fixes

1. **Pricing fine-print removed** — the redundant "All categories included in $19/mo…" line is gone from the Categories panel; the section subhead already carries the inclusion message.
2. **Message-card title tooltips restored** (regression from the rewrite). New **optional `Message.tooltip`** field on the corpus schema (`types.ts`); the 4 Verification messages populated with PM-provided copy; a `HelpCircle` info icon + `Tooltip` renders beside the title on corpus read- and edit-cards. The 8 unauthored stubs needed no edits (field is optional).
3. **Sub-checkbox tooltip clipping fixed** — removed `overflow-hidden` from the Categories panel `<div>`; the tooltip (`z-100`, `pointer-events-none`) now floats freely instead of being clipped by the narrow panel.
4. **Copy button → combined output** — `handleCopy()` now emits, per visible message in the active tone, a block of title / description / `Example` / `Template`; the Template preserves `{{double_brace}}` tokens, the Example substitutes the typed business name (falls back to "Acme"); custom messages included; blocks separated by `---`. → **D-404**.

## Completed work / In progress

All four fixes complete and verified. Nothing open.

## Quality gates

`tsc --noEmit`, `eslint .`, and `next build` all clean on `marketing-site/`. No vitest in `marketing-site`; functional verification is the Vercel preview (checklist in the plan file).

## Decisions

**D-404 added** (active count now 319, latest D-404). Seven gate tests applied — all pass (rejected alternative: "Copy outputs only rendered bodies"). Grep surfaced archived **D-76** ("Copy format includes preview and template") as a plausible relative — judged **not a supersession**: D-76 governs the prototype catalog copy (a different surface, archived-era); D-404 governs the marketing-site configurator. `Supersedes: none`.

Next-session ledger scan: D-404 is the only new decision since Session 95.

## Retirement sweep + drift watch

Skipped — mid-phase, no phase boundary crossed. Phase 1 (Sinch Proving Ground) still active.

## Gotchas for next session

1. **Branch pushed, not merged.** `feat/configurator-one-corpus` (11 commits) is on origin. Next: Joel checks the Vercel preview, then merges to `main` + deletes the branch.
2. **Verify the tooltip-overflow fix visually.** Removing `overflow-hidden` from the Categories panel is correct, but confirm on the preview that the panel's `rounded-xl` corners still look clean and all four Verification sub tooltips render fully (incl. "Sensitive-action step-up").
3. **D-380 drift still unresolved** (carry-over from Session 95) — D-380 canonicalizes `website`/`business_type`/`service_type` as configurator placeholder fields; the rewrite dropped the `website` input. PM to decide an amendment/supersession note.

## Files modified this session

8 unique paths: `marketing-site/lib/message-library/types.ts`, `verification.ts`; `marketing-site/components/configurator/message-edit-card.tsx`; `marketing-site/components/configurator-section.tsx`; `DECISIONS.md`, `PROTOTYPE_SPEC.md`, `REPO_INDEX.md`, `CC_HANDOFF.md`.

`PRODUCT_SUMMARY.md` checked — **not updated**: it describes the configurator at journey level but not the Copy button; the four fixes are polish / copy / regression-restore, none substantive per the maintenance criteria.

## Unmerged branches

**`feat/configurator-one-corpus`** — 11 commits, build-green, pushed to origin, **not merged**. Waiting on: Joel's Vercel preview check, then merge to `main` + delete.

## Carry-forward queue

- **Merge `feat/configurator-one-corpus`** when Joel approves the Vercel preview.
- **D-380 amendment** — PM to reconcile D-380 with the configurator rewrite (`website` field dropped).
- **Four BACKLOG entries from Session 95** (configurator conditional input rendering; variable identity-vs-default schema distinction; variable grammar mechanics; placeholder values for non-name fields) — several tied to Marketing category authoring.
- **Message authoring — remaining 8 categories.** Verification done; Marketing next (`marketing-site/lib/message-library/marketing.ts` from `audits/research/2026-05-16/marketing.md`). The configurator picks up each category automatically once authored.
- **Waitlist operator steps** (carry-over) — verify `relaykit.ai` as a Resend sending domain; set `RESEND_API_KEY` + Supabase env vars; apply migration `007`.
- `docs/POST_TOPICS.md` still untracked — PM decision pending.
- `PM_PROJECT_INSTRUCTIONS.md` / `CLAUDE.md` over their line ceilings — separate PM-gated trim audits.

## Suggested next session

Either (a) review-and-merge `feat/configurator-one-corpus` once the Vercel preview is checked, or (b) open the next message-authoring category, **Marketing**.
