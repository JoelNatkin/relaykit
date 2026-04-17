# CC_HANDOFF.md — Session Handoff
**Date:** 2026-04-17 (Session 33 — orchestration setup complete)
**Branch:** main (0 unpushed commits — everything synced to origin)

---

## Commits This Session

```
7ee837d  chore: introduce REPO_INDEX + PM instructions; pare CLAUDE.md; archive validation log
```

(Intra-session interstitial commits from earlier in the day — `9f924fe` PM-review fixes and `c5c91dd` docs — were scoped to the prior session's work and are already on `origin/main`.)

A close-out commit will follow this file with message `docs: session close-out — orchestration setup complete`.

---

## What Was Completed

### Orchestration setup
- **`REPO_INDEX.md` (new, 134 lines)** — canonical single-source-of-truth for repo state. Three-tier file orchestration for browser chat uploads (project knowledge / every-chat / on-demand). Meta block with `last_updated`, `decision_count`, `pm_instructions_synced` flag, active branch, and `unpushed_local_commits` counter. Canonical doc tables for root and `/docs`, subdirectory purpose index, build spec status table, sync obligations protocol for CC/PM/Joel, change log.
- **`PM_PROJECT_INSTRUCTIONS.md` (new, 529 lines)** — canonical in-repo copy of the PM instructions pasted into the Claude.ai UI. Joel confirmed the paste completed, so `REPO_INDEX.pm_instructions_synced = true`.
- **`CLAUDE.md` (rewrite, 335 → 109 lines)** — pared to standing rules only: design system, architecture, code style, quality gates, DECISIONS/PROTOTYPE_SPEC shortcut test, session start/close-out, copy rule, hard platform constraints, TCR limits, prototype discipline, implementation gotchas, key docs, BACKLOG protocol. Historical context and Twilio-specific hand-holding moved out.
- **`BUILD_SPEC_VALIDATION_LOG.md` → `docs/archive/BUILD_SPEC_VALIDATION_LOG.md`** — the 25-round experiment log is superseded historical reference; moved out of root (git tracked as 100% rename).

### PM review fixes (committed earlier, now on origin)
- `9f924fe` — voice copy (removed "carrier registrations wound down" infrastructure language from `/account` delete copy in both modal and danger-zone card), semantic color tokens on the avatar dropdown (replaced raw `border-gray-200` / `bg-white` / `hover:bg-gray-50` with `border-border-secondary` / `bg-bg-primary` / `hover:bg-bg-primary_hover`), and an explanatory comment above the `react-hooks/exhaustive-deps` disable in `apps/[appId]/page.tsx` (`setField` is a stable context ref).

---

## Quality Checks Passed

- `git diff c5c91dd..HEAD` is markdown-only — no TS/ESLint targets introduced this session.
- Earlier in the day, the `9f924fe` fix commit passed `tsc --noEmit` and a clean `next build` from `/prototype` (verified at commit time).
- `REPO_INDEX` + `CC_HANDOFF` updates are metadata only.

---

## In Progress / Partially Done

Nothing. All work for this session is landed and pushed.

Carried forward from previous sessions (still open, unchanged):
- Signup backend stubbed (D-59)
- EIN verification backend stubbed (D-302/D-303)
- Phone OTP stubbed (D-46)
- Marketing messages hardcoded for Appointments only
- Ask Claude panel chat composer is a non-functional stub
- Testers invite flow stubbed
- Registered state metrics are mock data
- Marketing-only registration tracker transitions are prototype dropdowns
- Settings Notifications toggle has no backend wiring
- Cancel plan + Regenerate live key modals are close-modal no-ops
- `/account` actions all brand-link no-ops (email "Change", Stripe "Manage billing", delete account)
- Workspace message row redesign (`IN PROGRESS` in REPO_INDEX build spec table — shared grid + `/account` shipped Session 32–33; next evolution pending direction)

---

## Gotchas for Next Session

1. **`REPO_INDEX.md` is now the canonical repo state.** Read it first at every chat start — it carries the decision count, `pm_instructions_synced` flag, unpushed commit counter, and the tiered upload list for browser chats. CC maintains it at every close-out per the Sync obligations section of that file.
2. **Close-out checklist now includes REPO_INDEX.** At every close-out: bump `last_updated`, update the decision count if new decisions landed, reset `unpushed_local_commits` to 0 after push, add/remove canonical file rows, update the build spec status table. Miss this and the PM's browser chat context drifts.
3. **PM instructions flag is a handshake.** If PM edits `PM_PROJECT_INSTRUCTIONS.md`, they flip the flag to `false` and ask Joel to re-paste into Claude.ai UI. Joel then tells CC at next close-out to flip back to `true`. Don't flip the flag unprompted.
4. **`docs/archive/` is the graveyard.** Anything moved there is superseded and CC should not read without explicit pointer. Resist the urge to re-read `BUILD_SPEC_VALIDATION_LOG.md` unless Joel cites it directly.
5. **CLAUDE.md is now ~109 lines.** If standing rules evolve, update CLAUDE.md — don't re-bloat it. The pared structure is a deliberate reset.
6. **`api/node_modules/` remains untracked** and intentionally not in `.gitignore` at the `api/` layer. Don't `git add -A` without checking.

---

## Files Modified This Session

```
CLAUDE.md                                                        # 335 → 109 lines (pared to standing rules)
PM_PROJECT_INSTRUCTIONS.md                                       # NEW — canonical PM instructions (529 lines)
REPO_INDEX.md                                                    # NEW — canonical repo state + orchestration index
BUILD_SPEC_VALIDATION_LOG.md → docs/archive/BUILD_SPEC_VALIDATION_LOG.md  # Moved (100% rename)
CC_HANDOFF.md                                                    # This file (overwritten)
```

---

## What's Next (suggested order)

1. **Priority 1 — Workspace message row evolution.** Build spec status in `REPO_INDEX` lists this as `IN PROGRESS` following the shared grid + `/account` work shipped Sessions 32–33. Next step is the message-row redesign per WORKSPACE_DESIGN_SPEC.md targets. Start a brainstorming pass to lock the interaction model before code.
2. **Priority 2 — Stale pricing sweep.** The pricing model has moved to `$49 registration + $19/mo (or $29/mo with marketing)` (reflected in the pared CLAUDE.md). Sweep the prototype, PRDs, and marketing copy for any residual `$199`, `$149`, or other superseded price points and reconcile against `docs/PRICING_MODEL.md` as the authority.
3. Extract shared `APP_NAMES` into `lib/app-names.ts` (overdue — 4 duplicate copies across `dashboard-layout`, `register`, `settings`, `account`).
4. Session-aware "Back to {appName}" on `/account` (currently hardcoded to GlowStudio).
5. Ask Claude panel backend (streaming AI route).
6. Wire signup / phone OTP / EIN verification to real backends (D-59, D-46, D-302/D-303).
7. Error-state design pass across all interaction failures before copy lock.
