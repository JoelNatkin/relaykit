# CC_HANDOFF — Session 84 (lean-out wave + `/explorations/` scaffold)

**Date:** 2026-05-12
**Branch:** `main` — Session 84 commits all on `origin/main` after PM approval at session close; no unmerged feature branches outstanding.

`Commits: 5 | Files modified: 5 | Decisions added: 0 | External actions: 4`

---

## Session character

Doc-only on `main`. Methodology lean-out wave: trimmed three canonical docs (REPO_INDEX Meta block, CC_HANDOFF, PM_PROJECT_INSTRUCTIONS.md) to leaner shapes; scaffolded `/explorations/` as the new sandbox surface between BACKLOG (parking lot) and DECISIONS (committed); added CC-side Explorations tracking mechanics to CLAUDE.md. Three new Standing Reminders promoted into PM_PROJECT_INSTRUCTIONS.md from this session's lessons: state-not-hash in REPO_INDEX Meta fields, methodology rules in numbered checklists, state-verification at session start when handoff disagrees with state-tracking docs. Substantive detail lives in the touched files and in commit history `419021b..HEAD`.

## Files modified

- `REPO_INDEX.md` — Meta block trim, then Active explorations section + `/explorations/` Subdirectories entry; Session 84 close-out bumps + change-log entry (`419021b`, this close-out)
- `CC_HANDOFF.md` — lean-shape rewrite Session 83 (`7abd4bb`); Session 84 overwrite this commit
- `PM_PROJECT_INSTRUCTIONS.md` — major trim 869 → 573 + new Blast Radius / Explorations / Waves sections + three new Standing Reminders (`9f43824`)
- `CLAUDE.md` — "Waves" cross-reference rename (`9f43824`); CC-side Explorations tracking section added (`f7557f1`, 191 → 217 lines)
- `explorations/README.md` — new file, status-header convention + cross-doc tracking pointers (`9f43824`)

## Pending PM review / broken

Close-out commit (this one) awaiting PM approval before push. Quality gates skipped per doc-only scope.

## Suggested next session

**Wave 2 — "pack" → "Recommended combinations" terminology retirement across canonical docs** stays the next workstream (carried over from Session 83's suggested-next). PM_HANDOFF for Wave 2 was authored in browser chat during Session 83; Joel pastes at next session start. Touches MASTER_PLAN, MARKETING_STRATEGY, DECISIONS (via D-372 supersession), VERTICAL_TAXONOMY_DRAFT, PRODUCT_SUMMARY. Expected shape: ~5–6 substantive content commits + close-out; per-commit `.pm-review.md` cadence + wave-based integration discipline (now codified as the new "Waves" section in PM_PROJECT_INSTRUCTIONS.md).

## Carry-forward queue (available if Wave 2 stalls)

- **PM_PROJECT_INSTRUCTIONS.md still over its 400-line ceiling** (573 vs 400). Trim audit gap narrowed substantially this session but didn't hit target; user accepted as natural floor given load-bearing content preserved per Session 83 resolutions. Future trim pass possible if file feels heavy in practice.
- **CLAUDE.md over its 200-line ceiling** (217 vs 200) — new ceiling violation this session from Explorations tracking addition. Queued trim audit.
- Embedded close-out prompt vs CLAUDE.md numbered-checklist divergence (stale L120/L121/L138 refs in PM_PROJECT_INSTRUCTIONS.md after Session 83's CLAUDE.md edits; simplified-subset reconciliation question).
- DECISIONS.md format anomaly normalization sweep — six entries (D-153, D-154, D-358, D-359, D-360, D-361) use `:` instead of em-dash.
- Three `text-white` form-page literals sweep — `app/signup/page.tsx:15`, `app/start/get-started/get-started-form.tsx:55`, `app/start/verify/verify-form.tsx:44` (Session 76 carry).
- Phase 1 downstream experiments first-pickup — 2b inbound MO / 3c Simplified→Full brand upgrade / 4 STOP/START/HELP reply handling.
- Phase 2a remaining 8 categories' research per D-384 — Marketing likely next per IH-launch priority.
- Stage 2 BRAND_DIRECTION.md authoring + MD-number capture from BRAND_AUDIT.md.
- Pumping Defense Wave 2 implementation.
- Migration 006 manual application.
- Broader threat-modeling workstream.

## Gotchas for next session

1. **First-session check on the new lean methodology.** Three new Standing Reminders landed in PM_PROJECT_INSTRUCTIONS.md from this session's lessons (state-not-hash, numbered-checklist-not-prose, state-verification at start). The Waves section explicitly says "wait for a pattern to recur across 2+ sessions before formalizing it" — these three were promoted on first observation, partial violation of the new pattern-promotion rule, but user-directed and accepted. Watch whether they prove load-bearing in Sessions 85+ or whether any feel like noise.
2. **PM_PROJECT_INSTRUCTIONS.md and CLAUDE.md both over their ceilings** (573 vs 400, 217 vs 200). Both queued as carry-forward trim audits. The ceilings are forward-looking guardrails, not retroactive.
3. **`/explorations/` is empty.** First exploration lands when PM scaffolds. CC mechanics for creating, pausing, killing, promoting are in CLAUDE.md "Explorations tracking" (L103+); PM-side rules in PM_PROJECT_INSTRUCTIONS.md "Explorations (sandbox before canon)".
4. **Joel: update Claude.ai UI copy of PM_PROJECT_INSTRUCTIONS to match the repo** (now at 573 lines after the major trim). Per PM_PROJECT_INSTRUCTIONS.md "PM instructions sync" — edit-repo-and-paste-into-UI-in-same-motion.
