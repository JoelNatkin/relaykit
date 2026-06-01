# CC_HANDOFF — PM workflow methodology waves (Session 125)

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.

**Session metrics:** Commits: 3 (incl. this close-out) | Files modified: 6 distinct | Decisions added: 0 | External actions: 2 (push ×2)

**Status:** Doc-only PM-methodology session. Two PM-driven waves landed the MCP-era workflow shifts into canon (CLAUDE.md + PM_PROJECT_INSTRUCTIONS.md), plus the `.pm/` infrastructure (gitignored PM worktable + plan-file redirect). No product code touched; no new decisions. `main` pushed and in sync.

---

## Commits this session (top = newest)

- **(this close-out commit)** — **docs**: Session 125 CC_HANDOFF overwrite.
- `bc5f17e` — **docs**: MCP-era workflow wave. Message describes the *deferred* wave (shifts 2 & 8 + plansDirectory + tier-label cleanup), but the commit **also contains the earlier 6-shift PM-doc revision** — see gotcha. Net across the file set: −18 lines (deferred portion); PM doc overall 487→466.
- `d35064e` — **chore**: gitignore `.pm/` for PM browser-chat handoff artifacts (`.pm/PM_HANDOFF.md`, `.pm/AUDIT_NOTES.md`, `.pm/plans/`).

(Everything below `d35064e` is Session 124 — `89380a0` and earlier.)

## Done this session

Two waves, both PM-gated, reflecting PM's new live filesystem-MCP read access to the repo:

1. **PM_PROJECT_INSTRUCTIONS revision** (6 of 8 MCP-era shifts + 3 principles). Applied shifts **1** (PM_HANDOFF = live on-disk ambient worktable), **3** (read-on-demand via MCP; killed the Tier-1/2/3 upload ritual), **4** (three-mode Audits section), **5** (three-user ownership), **6** (no-guessing), **7** (librarianship-first). Principles folded in: three-user ownership, no-guessing, librarianship. Inverted "File Requests: Ask, Don't Assume" → "File Access: PM Ranges". One-source cuts ("What RelayKit Is" + "The Codebase" → pointers). Net −16 lines (487→470). **This wave was uncommitted at the time and rode into `bc5f17e`.**

2. **Paired CLAUDE.md + PM wave** (`bc5f17e`) — the deferred shifts:
   - **Shift 2** — PM reads `.pm-review.md` from disk via MCP on Joel's **"gg"** (go get); CC's write behavior unchanged. Updated both Review-Cadence sections + added a "gg" shorthand row.
   - **Shift 8** — CC close-out shrunk to **ambient-maintenance + verify/ship**. Canon (DECISIONS, PROTOTYPE_SPEC, PRODUCT_SUMMARY, REPO_INDEX, CC_HANDOFF) is now maintained *as the work happens*, not written at session end. Drift-watch definition relocated to its own subsection beside Retirement sweep.
   - **Item A** — `plansDirectory: "./.pm/plans"` in `.claude/settings.json` so plan-mode plans land repo-local + gitignored (PM-readable via MCP). Documented in CLAUDE.md. `.pm/plans/` created.
   - **Item B** — REPO_INDEX stale `(Tier 1 project knowledge)` → `(Claude.ai project knowledge)` ×2 (dead tier model). The briefed "line-17 Tier-2 block" did not exist; corrected to the real minimal fix.
   - Net −18 lines across the 4 files.
3. **`.pm/` infrastructure** — directory created + gitignored (`d35064e`); `.pm/PM_HANDOFF.md` is now PM's live worktable (PM-authored, gitignored).

## In progress / not started

- None mid-flight. All committed and pushed.

## Quality checks

- `tsc --noEmit` / `eslint`: **skipped (doc-only session)** — no `.ts/.tsx` touched.
- Cross-doc consistency verified via grep: no "paste into PM chat" survives in either canon doc; "gg" present in all three target spots; shift-8 anchors present in both; drift-watch preserved (not orphaned); `settings.json` valid JSON with `permissions` intact.

## Decisions added

None. Workflow methodology, not product — nothing resolved a product alternative (fails the seven gate tests). The shifts change how PM/CC operate, not what RelayKit ships.

## Gotchas

- **`bc5f17e` bundles two waves; its message names only one.** The earlier 6-shift PM-doc revision was reported "not committed, ready for review," then sat uncommitted in the working tree and was swept into `bc5f17e` when the deferred wave was staged (`git add PM_PROJECT_INSTRUCTIONS.md` caught both). The commit is already pushed, so the message wasn't amended (would need force-push). If you grep history: `bc5f17e`'s PM-doc diff is 487→466 (both waves), not just the deferred ~20 lines.
- **The "gg" disk-read mechanic is now live.** `.pm-review.md` currently holds `git show` of `bc5f17e` (approved + pushed). This session was its proof-of-concept; the paste rotation is retired.
- **Two trims owed (both pre-existing, neither blocking):** CLAUDE.md 224 vs its 200 ceiling (this wave net +1, structural for list rendering — separate trim audit owed per CLAUDE.md's own rule); PM_PROJECT_INSTRUCTIONS 466 vs its 400 ceiling (dedicated trim wave still owed).
- **`api/node_modules/` still untracked + not gitignored** (root `.gitignore` uses anchored `/node_modules`). One-line fix: unanchored `node_modules/`. Carried in `.pm/PM_HANDOFF.md`; deferred to Joel.

## Files modified this session

`.gitignore`, `.claude/settings.json`, `CLAUDE.md`, `PM_PROJECT_INSTRUCTIONS.md`, `REPO_INDEX.md`, `CC_HANDOFF.md`. (Plus gitignored, untracked: `.pm/PM_HANDOFF.md`, `.pm/plans/`, `.pm-review.md`.)

## Unmerged feature branches

None. Only `main` (local + remote), in sync.

## Suggested next tasks

**Priority list lives in `.pm/PM_HANDOFF.md`** — PM just refreshed it (session-open reads, current state, what's-next, carry-forwards). Read that first. Headline items it carries: Sinch TFN email + no-EIN/sole-prop plumbing; blog posts; legal follow-ups (`LEGAL_EXPOSURE_REMEDIATION.md` §3.2 + §3.4–§3.6); marketing page polish; compliance-toggle exploration (scaffold to `/explorations/` first); and the two doc trims above. The substantive build pickup remains **Phase 2 — Session B (Sinch outbound delivery)**.
