# CC_HANDOFF — Session 133 close-out: CC governance refactor (CLAUDE.md trim → CC_PROCEDURES.md) (2026-06-12)

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.

**Session metrics:** Commits: 1 (held for PM `gg`, NOT pushed) | Files modified: 4 (CLAUDE.md, REPO_INDEX.md, CC_HANDOFF.md, + new docs/CC_PROCEDURES.md) | Decisions added: 0 | External actions: 0. **Doc-only session.** Mid-phase (active phase stays Phase 2 — Session B).

**Status: 🟡 Committed locally, HELD for PM `gg` review — do NOT push until approved.** This session continued a run of doc-governance work (Sessions 132–133); the substantive product pickup remains Phase 2 — Session B.

---

## What landed this session (one local commit, not pushed)

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
**No open feature branches.** This session's commit is local on `main`, **unpushed** — held for PM `gg`.

## Untracked carryover — DO NOT COMMIT
- Only `.claude/settings.local.json` remains untracked.

## Next steps
- **PM `gg`** → review `.pm-review.md` → approve push of the governance-refactor commit.
- **Phase 2 — Session B (Sinch outbound delivery)** per MASTER_PLAN — the substantive product pickup.
