# CC_HANDOFF — Session 88 (marketing-surface migration + post-migration cleanup)

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out. Includes commits, completed work, in-progress, gotchas, files modified, unmerged branches, suggested next tasks.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader, not as a session memoir.

**Date:** 2026-05-14
**Branch:** `main` — all 9 commits pushed to `origin/main`. No unmerged feature branches; the migration's feature branch (`chore/migrate-marketing-out-of-prototype`) was fast-forward merged + local-deleted earlier in the session.

`Commits: 9 | Files modified: 16 | Decisions added: 0 | External actions: 7`

---

## Session character

Three coordinated waves on the same migration thread:

1. **Marketing-surface migration out of /prototype/.** PM-aligned scope: marketing-shaped surfaces (`/`, `/sms/[category]`) leave the prototype so it models `app.relaykit.ai` cleanly. Two prototype components (`playbook-flow.tsx`, `catalog/catalog-opt-in.tsx`) preserved on `/marketing-site/` as dormant code for future Phase 2a (D-384) consumption. Marketing-site does NOT gain category routes or a Use Cases dropdown in this lift — that work waits for Phase 2a content. The prototype's `/` becomes a thin auth-aware redirect; new placeholder `/sign-in` route reuses the email→OTP form content from the existing SignInModal. Plan-mode workflow: investigation → plan file → 5 ordered execution steps → verification → 5 commits matching the steps + 1 close-out commit.
2. **Read-only post-migration audit + drift cleanup.** Audited PROTOTYPE_SPEC and PRODUCT_SUMMARY against post-migration reality; the audit surfaced 9 substantive items + 3 cosmetic across both docs. Single-pass cleanup commit fixed all 15 items: §3 retitled in PRODUCT_SUMMARY, broken §3.4 cross-ref removed, "7-section" → "6-section" count corrected, stale "Marketing home" pricing description rewritten, asymmetric MOVED treatment between catalog-opt-in and playbook-flow resolved, "Screens Not Yet Built" header restructured (stable Registration Form/Review moved up under Authenticated Pages, in-design items live under new "Open design items" header), dormant SignInModal + Footer sections trimmed to one-line pointers.
3. **PM-authored mechanical addition to PM_PROJECT_INSTRUCTIONS.md.** New paragraph under "File Requests: Ask, Don't Assume" codifying that `conversation_search` is not a canonical source — past chats can be stale or contradictory; canonical sources are DECISIONS / REPO_INDEX / MASTER_PLAN / topic-specific docs.

The migration resolves the Session 87 retention caveat about the marketing home being load-bearing for wordmark/breadcrumb links: the new auth-aware `/` redirect and the top-nav cleanup repointed everything that depended on the old `/`. Top-nav reduced 277 → 200 lines.

## Commits this session

1. `10f5d34` chore(marketing-site): preserve playbook-flow + catalog-opt-in for Phase 2a category pages
2. `8635043` chore(prototype): archive 4 marketing-surface files via git mv (4 100% renames)
3. `73acb8e` feat(prototype): add auth-aware / redirect and /sign-in placeholder
4. `bc9d463` refactor(prototype): clean top-nav post-archive; retarget sign-out + /apps guard to /sign-in
5. `5e2e8f9` docs(prototype): log 2026-05-14 marketing migration in archive/README.md
6. `b5f2521` docs(close-out): Session 88 — PROTOTYPE_SPEC + PRODUCT_SUMMARY + REPO_INDEX + CC_HANDOFF reconcile post-migration
7. `56e252f` docs: post-migration cleanup — PROTOTYPE_SPEC + PRODUCT_SUMMARY drift fixes (15 audit items, single pass, PM-reviewed via .pm-review.md before push)
8. `99b79a6` docs(pm): codify conversation_search canonical-sources discipline
9. (this close-out) docs(close-out): Session 88 final — REPO_INDEX touched-date bump + CC_HANDOFF refresh after audit + drift cleanup + PM addition

## Files modified

16 unique paths across the session:

- **Marketing-site additions (2):** `marketing-site/components/playbook-flow.tsx`, `marketing-site/components/catalog/catalog-opt-in.tsx` (dormant; inlined local `Message` type + dropped unused `website` prop on the catalog port).
- **Prototype archive moves (4 renames):** `prototype/app/page.tsx`, `prototype/app/sms/[category]/page.tsx`, `prototype/components/playbook-flow.tsx`, `prototype/components/catalog/catalog-opt-in.tsx` → `prototype/archive/...` (mirrored paths). Empty `/sms/[category]` and `/sms/` route directories also removed.
- **Prototype new routes (2):** `prototype/app/page.tsx` (auth-aware redirect, ~20 LOC) and `prototype/app/sign-in/page.tsx` (placeholder OTP landing, ~220 LOC).
- **Prototype rewires (2):** `prototype/components/top-nav.tsx` (Use Cases dropdown removed, Sign in modal trigger removed, wordmark simplified, sign-out target → `/sign-in`); `prototype/app/apps/page.tsx` (auth-guard target → `/sign-in`).
- **Doc + governance (6):** `prototype/archive/README.md`, `PROTOTYPE_SPEC.md` (modified twice — close-out + drift cleanup), `docs/PRODUCT_SUMMARY.md` (modified twice), `REPO_INDEX.md` (modified twice), `CC_HANDOFF.md` (this file, overwritten twice), `PM_PROJECT_INSTRUCTIONS.md` (conversation_search discipline addition).

## DECISIONS ledger

Pre-flight scan at session start: 301 active, latest D-386, archive D-01–D-83. Scan clean. **No new D-numbers this session.** The migration implements existing architectural commitments (D-368 production-facing branching, D-378 future surfaces under app.relaykit.ai, D-381 message-source-deferred, D-384 Phase 2a content authoring); the PM_PROJECT_INSTRUCTIONS conversation_search addition is process-discipline that lives in PM_PROJECT_INSTRUCTIONS, not a product decision (fails the alternative test — no real rejected alternative). PM confirmed no D-numbers needed for any of the three waves.

## Quality gates

- `npx tsc --noEmit` clean on both `/marketing-site/` and `/prototype/` after every code-touching step. `.next` cache cleared between archive operations and verification per the standing rule.
- `npx eslint .` clean on `/marketing-site/` (no prototype eslint config — pre-existing BACKLOG entry from Session 87).
- HTTP smoke (fresh dev servers on :3001 and :3002) matched the migration plan's expected table exactly: prototype `/` and `/sign-in` 200, `/sms/*` 404; marketing-site unchanged + `/sms/*` and `/sign-in` 404 (confirms no scope creep).
- Link audit grep clean on active prototype tree post-migration (only header-comment self-references to archived paths remain).
- Drift cleanup commit was PM-reviewed via `.pm-review.md` before push; PM addition + this close-out are mechanical, no review per cadence.

## Retirement sweep + drift watch

Phase 1 — Sinch Proving Ground active at session start, still active. No phase boundary crossed; sweep + drift watch skipped per CLAUDE.md mid-phase rules.

## Gotchas for next session

1. **Two prototype components are dormant code:** `prototype/components/sign-in-modal.tsx` (no importers — replaced by the standalone `/sign-in` route) and `prototype/components/footer.tsx` (no importers — target marketing pages all archived). Both tagged DORMANT in PROTOTYPE_SPEC with one-line pointers; the future auth refactor will retire `SignInModal`; `footer.tsx` may want a separate cleanup pass.
2. **`/start/*` wordmark still targets `/`.** Post-lift, `/` redirects to `/sign-in` for logged-out users mid-onboarding — defensible (clicking the wordmark exits onboarding to sign in) but slightly unusual. Flagged in `prototype/archive/README.md` 2026-05-14 entry.
3. **Stale dev-server trap recurred.** Two old dev-server processes from a prior session were bound to 3001/3002 (3-day uptime). Use `lsof -nP -iTCP:3001 -iTCP:3002 -sTCP:LISTEN` to find them, kill, then start fresh. Standing rule: kill + `rm -rf .next` + restart at end of every task.
4. **`git mv` with bracketed segment names** (`'prototype/app/sms/[category]/page.tsx'`) needs single-quoting to defeat shell globbing.
5. **Pre-existing PROTOTYPE_SPEC drift around `prototype/components/proto-nav-helper.tsx` referencing `/apps/[appId]/overview`** (phantom route, file never existed on disk) survived both archive waves. Known Issues table entry tagged "Audits 2026-05-13 + 2026-05-14"; cleanup deferred per BACKLOG.

## Carry-forward queue

Active workstreams (not closed this session):
- PM_PROJECT_INSTRUCTIONS.md still 471 / 400-line ceiling (gained 2 lines from the conversation_search addition; trim audit queued)
- CLAUDE.md still over 200-line ceiling (carry-forward)
- Phase 1 downstream experiments first-pickup (2b inbound MO, 3c brand upgrade, 4 STOP/START/HELP)
- Phase 2a per-category research per D-384 (8 categories — this session's preserved components are for the eventual category pages this work feeds)
- Stage 2 `BRAND_DIRECTION.md` authoring + MD-number capture from `BRAND_AUDIT.md`
- Pumping Defense Wave 2 implementation
- Migration 006 manual application
- Broader threat-modeling workstream

New from this session (no BACKLOG entries added; surfaced for the next session):
- Future auth refactor will retire both `prototype/components/sign-in-modal.tsx` (dormant) and `prototype/app/sign-in/page.tsx` (placeholder); the two surfaces share content and should be unified there.
- `prototype/components/footer.tsx` is now dormant; minor cleanup candidate.
- The `/start/*` wordmark behavior (clicking exits onboarding to /sign-in) is defensible but worth revisiting if onboarding UX gets a polish pass.

## Unmerged branches

None. `chore/migrate-marketing-out-of-prototype` was created for the migration, accumulated 5 lift commits + 1 close-out commit, fast-forward merged into main, pushed, and local branch deleted. Subsequent commits (drift cleanup, PM addition, this close-out) landed directly on main.

## Suggested next session

Three plausible threads:

1. **Phase 1 downstream experiments first-pickup** — same recommendation as Session 87's carry-forward. Experiments 2b (inbound MO), 3c (brand upgrade), 4 (STOP/START/HELP) all unblocked. Closest to closing Phase 1.
2. **Stage 2 `BRAND_DIRECTION.md` authoring** — Stage 1 audit synthesis in `docs/BRAND_AUDIT.md` is the input; an authoring session would produce direction + MD-numbered decisions.
3. **Phase 2a content authoring kickoff** — the components preserved on marketing-site this session are for Phase 2a's eventual per-category pages. If per-category research per D-384 is ready to enter authoring, this session sets up that downstream work.

If PM redirects: the PM_INSTRUCTIONS / CLAUDE.md trim audit wave remains queued and low-coordination, as does cleanup of the dormant `sign-in-modal.tsx` / `footer.tsx` files.
