# CC_HANDOFF — Session 87 (salvage + bulk archive + post-archive reconcile)

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out. Includes commits, completed work, in-progress, gotchas, files modified, unmerged branches, suggested next tasks.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader, not as a session memoir.

**Date:** 2026-05-14
**Branch:** `main` — all session commits on `origin/main` except this close-out commit at push time. No unmerged feature branches.

`Commits: 5 | Files modified: 36 | Decisions added: 0 | External actions: 5`

---

## Session character

Three coordinated operations in /prototype/, then post-state doc reconcile.

1. **Salvage** — extracted the playbook workflow diagram and the opt-in form sample off the public messages page (slated for archive) and onto the category landing page (`/sms/[category]`), which is becoming a hybrid docs/info page. New shared component at `prototype/components/playbook-flow.tsx` consumed by both pages.
2. **Audit** — read-only inventory of all 85 files in /prototype/, produced `audits/prototype-inventory-2026-05-13.md` for PM + Joel triage. Identified 22 archive candidates.
3. **Bulk archive** — moved 21 dead/out-of-scope files to `prototype/archive/` mirroring source paths (the 22nd candidate, `app/page.tsx` route `/`, retained because removing it would break wordmark and breadcrumb links across the surviving tree). Three surviving-tree edits resolved blockers: Compliance nav removed from top-nav, opt-in pill removed from proto-nav-helper, dead CTAs removed from /sms/[category] page. `prototype/archive/README.md` documents the operation; `prototype/tsconfig.json` excludes `archive` so tsc doesn't traverse archived files with severed import paths.
4. **Post-archive reconcile** — PROTOTYPE_SPEC trimmed 1079 → 848 lines (removed Public Messages Page, Compliance Page, Overview/marketing-modal phantom, Opt-in Form Preview, Admin Dashboard, /registration-test sections; rebuilt File Map; cleaned Known Issues). PRODUCT_SUMMARY §3 intro + §3.1–§3.4 reconciled to current state. BACKLOG: 3 net additions plus annotation merge into the existing eslint entry.

Session also opened with a tiny doc-sync wave: CLAUDE.md `Session start` section condensed (trigger renamed `DECISIONS CHECK` → `Session open`); PM_PROJECT_INSTRUCTIONS.md gained the matching opening-prompt section.

## Commits this session

- `2d666cd` docs: collapse session-start protocol to single source in CLAUDE.md, PM_INSTRUCTIONS points
- `d387f35` feat(prototype): move playbook + opt-in form sample to category landing page (salvage)
- `439f941` chore(prototype): archive 21 dead/out-of-scope files to prototype/archive/ (bulk archive; landed on `chore/prototype-archive-bulk-1`, fast-forwarded to main)
- `db14644` docs(close-out): Session 87 — PROTOTYPE_SPEC + PRODUCT_SUMMARY + BACKLOG reconcile to post-archive state (substantive close-out; amended once after PM review to merge the ESLint BACKLOG entry into the existing Session-60 entry)
- (this close-out) docs(close-out): Session 87 mechanical — REPO_INDEX + CC_HANDOFF + audit file

## Files modified

36 unique files across the session:

- **New (3):** `prototype/components/playbook-flow.tsx`, `prototype/archive/README.md`, `audits/prototype-inventory-2026-05-13.md`
- **Archived (21):** see `prototype/archive/README.md` for the full grouped list
- **Substantive edits to surviving tree:** `prototype/app/sms/[category]/page.tsx`, `prototype/components/top-nav.tsx`, `prototype/components/proto-nav-helper.tsx`, `prototype/tsconfig.json`
- **Doc + governance:** `CLAUDE.md`, `PM_PROJECT_INSTRUCTIONS.md`, `PROTOTYPE_SPEC.md`, `docs/PRODUCT_SUMMARY.md`, `BACKLOG.md`, `REPO_INDEX.md`, `CC_HANDOFF.md`
- **Source file edited then archived:** `prototype/app/sms/[category]/messages/page.tsx` (inline playbook code removed during salvage, then file moved to archive)

## DECISIONS ledger

Pre-flight scan at session start: 301 active, latest D-386, archive D-01–D-83. Scan clean. **No new D-numbers this session** — all seven gate tests applied to both the salvage operation (implements D-217 + D-224) and the bulk archive (implements existing scope decisions documented in `prototype/archive/README.md`). PM confirmation matches.

## Quality gates

- `npx tsc --noEmit` clean on /prototype throughout the session (one mid-session fix: `prototype/tsconfig.json` updated to exclude `archive` so tsc doesn't traverse archived files with severed import paths).
- ESLint: not run on /prototype — no config exists there. The gap is now a tracked BACKLOG item (Infrastructure & Operations, "Configure eslint in /prototype", Session 60 origin with Session 87 resurfacing note). Other workspaces (`/marketing-site`, `/sdk`, `/api`) have configs.
- HTTP smoke tests on the archive verified all 18 KEEP routes return 200 and all 11 archived routes return 404.

## Retirement sweep + drift watch

Phase 1 — Sinch Proving Ground active at session start, still active. No phase boundary crossed; sweep and drift watch skipped per CLAUDE.md mid-phase rules.

## Gotchas for next session

1. **Pre-existing `/apps/[appId]/overview` drift** — `prototype/components/proto-nav-helper.tsx` references the route at lines 18, 21, 24, 27, 28 (post-archive line numbers), but `prototype/app/apps/[appId]/overview/page.tsx` never existed on disk. PROTOTYPE_SPEC's Overview section was likewise phantom and got removed in the substantive close-out commit. Cleanup is in BACKLOG (Infrastructure & Operations) — requires understanding the state-switcher mechanism the nav helper is jumping between; "overview" may be a stale name for the workspace home at `/apps/[appId]`.
2. **Marketing home retention** — `prototype/app/page.tsx` (route `/`) was on the audit's archive list but retained because it's load-bearing for the surviving tree (wordmark + breadcrumb links). BACKLOG item tracks future consolidation with `/marketing-site/`.
3. **tsconfig exclude needed during archive** — without `"archive"` in `exclude`, tsc traverses moved files whose relative imports now point at non-existent paths. Future archive operations: add to exclude before running tsc.
4. **Dev server stale-cache trap** — encountered during salvage verification: an existing dev-server process (3-day uptime) returned HTTP 500 after I cleared `.next` underneath it. Kill before clearing `.next`, then start fresh.
5. **Multiline commit messages with `git commit -m "$(cat <<'EOF' ... EOF)"`** failed once on what looked like quoting drift. Switched to `git commit -F <file>` and it worked first try — that's the safer pattern for any commit message with literal `'` or special characters.

## Carry-forward queue

Active workstreams (not closed this session):
- PM_PROJECT_INSTRUCTIONS.md still 469 / 400-line ceiling (improved from 869 in Session 86; trim audit queued)
- CLAUDE.md still over 200-line ceiling after the session-start collapse (Session 86 was 222; latest collapse trimmed a few lines but not enough — recheck and trim audit)
- Phase 1 downstream experiments first-pickup (2b inbound MO shape, 3c brand upgrade, 4 STOP/START/HELP)
- Phase 2a remaining 8 categories' research per D-384
- Stage 2 `BRAND_DIRECTION.md` authoring + MD-number capture from `BRAND_AUDIT.md`
- Pumping Defense Wave 2 implementation
- Migration 006 manual application
- Broader threat-modeling workstream

New from this session (in BACKLOG):
- /overview drift in proto-nav-helper.tsx
- Marketing home consolidation (consolidate or retire when prototype/marketing-site split resolves)
- /marketing-site/ inventory audit (deferred until after marketing retrenchment lands)
- ESLint config on /prototype (merged annotation on existing entry)

## Unmerged branches

None. `chore/prototype-archive-bulk-1` was created for the archive operation, fast-forwarded into main, pushed, and the local branch deleted (no remote was created).

## Suggested next session

Three plausible threads:

1. **Phase 1 downstream experiments first-pickup** — closest to the active phase. Experiments 2b (inbound MO), 3c (brand upgrade), 4 (STOP/START/HELP) are all unblocked and waiting. Picking up the most concrete one would advance Phase 1 toward close.
2. **Stage 2 `BRAND_DIRECTION.md` authoring** — Stage 1 audit synthesis in `docs/BRAND_AUDIT.md` is the input; Stage 2 needs an authoring session to produce direction + MD-numbered decisions.
3. **/marketing-site/ inventory audit** — same shape as the prototype inventory just produced. Only pick this up after the pending marketing retrenchment lands, else the audit goes stale immediately.

If PM redirects: PM_INSTRUCTIONS / CLAUDE.md trim audit wave is also queued and low-coordination.
