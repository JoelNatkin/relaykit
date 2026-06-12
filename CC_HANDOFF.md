# CC_HANDOFF — Session 133 close-out: CC governance refactor (CLAUDE.md trim → CC_PROCEDURES.md) (2026-06-12)

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.

**Session metrics (full session):** Commits: 10 to `main` (all pushed, HEAD `d6b1d7e`) | Files created/modified: ~12 (incl. new `docs/CC_PROCEDURES.md`, `.githooks/pre-commit`, `docs/writing/`×2) | Decisions added: 1 (**D-432**) | External actions: 10 pushes to `origin/main` + `core.hooksPath` activation. **Doc-only session — no code touched, quality gates skipped.** Mid-phase (active phase stays Phase 2 — Session B → retirement sweep + drift watch skipped).

**Status: 🟢 All pushed — `main` in sync with `origin/main` at `d6b1d7e`.** A long doc-governance session (PM-labeled 132→133); the substantive product pickup remains Phase 2 — Session B.

---

## Full session arc (10 commits, all on `main`)

`ad647d1` home-spec reconciliation + **D-432** (quick-start permanent, supersedes D-429) · `1d7ec3d` golden-path-gtm Makerkit kit decision (PM-authored exploration) · `e6d13a1` capability-first playbook archived to `docs/writing/` · `887a5de`+`1204d91` **VPP v2.1** (§3 Demand Voice → Straight-Talking Principles) · `f4ab6a4` **date-header pre-commit hook** (`.githooks/`, `core.hooksPath` set) + PM_PROJECT_INSTRUCTIONS dates · `96b25aa` `.pm-review.md` refresh canonized as a per-commit hard rule · `0c84e1c` **CLAUDE.md trim → `docs/CC_PROCEDURES.md`** (headline, below) · `903586c` voice pointer v2.0→v2.1 · `d6b1d7e` marketing runbook + `docs/writing/` REPO_INDEX rows.

## What landed — headline: the governance refactor (`0c84e1c`)

CLAUDE.md trim audit per the PM-approved plan (`.pm/plans/mode-plan-claude-md-trim-async-lovelace.md`):

1. **CLAUDE.md trimmed 231 → 122 lines** — now resident **rules and hard gates only**. Kept: Project, Stack, Design system, Architecture, Code style, Quality gates, Hard platform constraints, Carrier limits, Prototype discipline, Implementation gotchas, Session start, Branching (promoted to its own `##`), PM-review hard rule (+ Plan files + PM_HANDOFF), Copy rule, Key docs, BACKLOG, File-size discipline (target → ~100). Added an in-file `### Updated: June 12, 2026` header (CLAUDE.md is now under the date-header hook).
2. **New `docs/CC_PROCEDURES.md` (139 lines)** — procedures relocated **verbatim**, sectioned by trigger: `§Ledger` (pre-flight scan, supersession 5-step, retirement sweep, drift watch, guardrails, conflict-flag), `§Explorations` (state machine), `§Close-out` (ambient-canon + steps + per-commit handoff), `§PRODUCT_SUMMARY`, `§Prose-sweep`, `§Marketing`. One mechanical internal-ref fix: `§Close-out` step 3 now says "(see §Ledger)".
3. **`## Procedure gates` block in CLAUDE.md** — one imperative gate per moved section, ordered as a **session timeline** (1 session-start → 10 phase-boundary close-out). Wave discipline collapsed to a gate pointing at `PM_PROJECT_INSTRUCTIONS "Waves"` (One Source — no CC_PROCEDURES copy).
4. **Copy-rule fixed** — dropped the dead "vocabulary table / framing-shift table / emotional-states map" refs; now points to VPP v2.1 §2 Product Voice + §6 kill list (product) and §3 STP (marketing/blog/community).
5. **REPO_INDEX** — new `CC_PROCEDURES.md` row in the `/docs` table; CLAUDE.md row bumped; Process/governance topic-index line added; Meta lead prepended with the Session 133 note.

## Verification done
- `wc -l`: CLAUDE.md 122, CC_PROCEDURES.md 139. No content lost (distinctive phrases — "One-sentence test", "Canon is maintained ambient", "scaffold as an exploration", "did this session change what a customer", "MD-1, MD-2" — all present in CC_PROCEDURES, absent from CLAUDE.md except the prose-sweep gate line).
- All six `CC_PROCEDURES §X` gates resolve to real `## §X` headings; Wave gate's `PM_PROJECT_INSTRUCTIONS "Waves"` exists.
- Copy-rule stale refs: 0. Date-header hook: passed on commit (CLAUDE.md + CC_PROCEDURES.md both dated June 12; REPO_INDEX "- Last updated" is a list item, not hook-matched).

## Carry-forwards (standard backlog)
- **Per-clone hook activation** — `.githooks` only enforces after `git config core.hooksPath .githooks` is run in each clone (documented in the hook header; no repo-tracked auto-set).
- **Dead token** `--color-text-headline-muted` (globals.css line 78) — unconsumed since the Session 130 two-tone-H1 removal; safe to delete in a future marketing-site code change.
- ~~REPO_INDEX rows for docs/writing/~~ **DONE** — `## Writing reference (docs/writing/)` subsection added (MARKETING_RUNBOOK.md + CAPABILITY_FIRST_BLOG_PLAYBOOK.md). No MD-number (archived/operational reference, not strategy canon).
- **`globals.css` light→dark dead-token collapse** (D-430); blog "configurator" voice rewrite; pre-launch head-scratchers (workspace_name vs business_name; "a few days" vs 10–15 business days; ai-section "Fri, Jun 6"→Jun 5; Acme Engineering vs Acme).
- **Pre-existing:** delete `joel+golive-smoke@gmail.com` from `early_access_subscribers`; OG unfurl cache-bust verify; TFN-path-killed MASTER_PLAN canon close; Claude.ai UI custom-instructions paste-sync.

## Branch state
**No open feature branches.** All 10 commits are on `main` and pushed; `main` is in sync with `origin/main` at `d6b1d7e`. The five older marketing branches remain merged-not-deleted (optional cleanup).

## Untracked carryover — DO NOT COMMIT
- Only `.claude/settings.local.json` remains untracked.

## Next steps
- **Phase 2 — Session B (Sinch outbound delivery)** per MASTER_PLAN — the substantive product pickup, and the next session's real work.
- Optional doc tidy-ups (carry-forwards above): dead-token deletions, blog "configurator" voice rewrite, pre-launch head-scratchers.
