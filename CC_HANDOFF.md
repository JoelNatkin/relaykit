# CC_HANDOFF — Session 88 (marketing-surface migration out of /prototype/)

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out. Includes commits, completed work, in-progress, gotchas, files modified, unmerged branches, suggested next tasks.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader, not as a session memoir.

**Date:** 2026-05-14
**Branch:** `main` after fast-forward merge of `chore/migrate-marketing-out-of-prototype` (5 lift commits + 1 close-out commit). No unmerged feature branches.

`Commits: 6 | Files modified: 15 | Decisions added: 0 | External actions: 4`

---

## Session character

Single migration lift with PM-aligned scope: marketing-shaped surfaces leave the prototype so it models `app.relaykit.ai` cleanly, and two prototype components useful for future Phase 2a category pages (D-384) get preserved on `/marketing-site/` as dormant code. Marketing-site does NOT gain category routes or a Use Cases dropdown in this lift — that work waits until Phase 2a delivers real per-category content. Plan-mode workflow: investigation → plan file → 5 ordered execution steps → verification → 5-commit history matching the steps → close-out.

The lift resolves the Session 87 retention caveat about the marketing home being load-bearing for wordmark/breadcrumb links: the new auth-aware `/` redirect and the top-nav cleanup repointed everything that depended on the old `/`. Top-nav reduced 277 → 200 lines; net prototype LOC down ~1,300 (archive) and up ~270 (new redirect + sign-in placeholder).

## Commits this session

1. `10f5d34` chore(marketing-site): preserve playbook-flow + catalog-opt-in for Phase 2a category pages
2. `8635043` chore(prototype): archive 4 marketing-surface files via git mv (4 100% renames)
3. `73acb8e` feat(prototype): add auth-aware / redirect and /sign-in placeholder
4. `bc9d463` refactor(prototype): clean top-nav post-archive; retarget sign-out + /apps guard to /sign-in
5. `5e2e8f9` docs(prototype): log 2026-05-14 marketing migration in archive/README.md
6. (this close-out) docs(close-out): Session 88 — PROTOTYPE_SPEC + PRODUCT_SUMMARY + REPO_INDEX + CC_HANDOFF reconcile post-migration

## Files modified

15 unique paths across the session:

- **Marketing-site additions (2):** `marketing-site/components/playbook-flow.tsx`, `marketing-site/components/catalog/catalog-opt-in.tsx` (dormant; inlined local `Message` type + dropped unused `website` prop on the catalog port).
- **Prototype archive moves (4 renames):** `prototype/app/page.tsx`, `prototype/app/sms/[category]/page.tsx`, `prototype/components/playbook-flow.tsx`, `prototype/components/catalog/catalog-opt-in.tsx` → `prototype/archive/...` (mirrored paths). Empty `/sms/[category]` and `/sms/` route directories also removed.
- **Prototype new routes (2):** `prototype/app/page.tsx` (auth-aware redirect, ~20 LOC) and `prototype/app/sign-in/page.tsx` (placeholder OTP landing, ~220 LOC).
- **Prototype rewires (2):** `prototype/components/top-nav.tsx` (Use Cases dropdown removed, Sign in modal trigger removed, wordmark simplified, sign-out target → `/sign-in`); `prototype/app/apps/page.tsx` (auth-guard target → `/sign-in`).
- **Doc + governance (5):** `prototype/archive/README.md` (new 2026-05-14 section), `PROTOTYPE_SPEC.md` (nav + sign-in + public-pages reshape + file map), `docs/PRODUCT_SUMMARY.md` (§3 reshape, Last reviewed bumped), `REPO_INDEX.md` (touched dates), `CC_HANDOFF.md` (this file).

## DECISIONS ledger

Pre-flight scan at session start: 301 active, latest D-386, archive D-01–D-83. Scan clean. **No new D-numbers this session** — the lift implements existing architectural commitments (D-368 production-facing branching, D-378 future surfaces under app.relaykit.ai, D-381 message-source-deferred, D-384 Phase 2a content authoring). PM confirmed no D-number needed for this scope.

## Quality gates

- `npx tsc --noEmit` clean on both `/marketing-site/` and `/prototype/` after every step. `.next` cache cleared between archive and verify per the standing rule (else cache stale-references the just-archived routes).
- `npx eslint .` clean on `/marketing-site/` (no prototype eslint config — pre-existing BACKLOG entry from Session 87; out of scope here).
- HTTP smoke (fresh dev servers on :3001 and :3002) matched the plan's expected table exactly:
  - Prototype: `/` 200 (redirect), `/sign-in` 200, `/apps` 200, `/sms/appointments` 404, `/sms/orders` 404, `/sms/anything` 404, `/start` 200, `/account` 200
  - Marketing-site: `/` 200, `/terms` 200, `/privacy` 200, `/acceptable-use` 200, `/signup` 200, `/start/get-started` 200, `/start/verify` 200, `/sms/appointments` 404 (confirms no scope creep), `/sign-in` 404 (confirms no scope creep)
- Link audit grep clean: only header-comment self-references to archived paths remain in active prototype tree.

## Retirement sweep + drift watch

Phase 1 — Sinch Proving Ground active at session start, still active. No phase boundary crossed; sweep and drift watch skipped per CLAUDE.md mid-phase rules.

## Gotchas for next session

1. **Two prototype components are now dormant code:** `prototype/components/sign-in-modal.tsx` (no importers — replaced by the standalone `/sign-in` route) and `prototype/components/footer.tsx` (no importers — target marketing pages all archived). Both are tagged "DORMANT" in PROTOTYPE_SPEC. The future auth refactor will retire `SignInModal`; `footer.tsx` may want a separate cleanup pass. No urgency — they don't break anything by sitting there.
2. **Pre-existing wizard-step drift in PROTOTYPE_SPEC §"Opt-in form component"** (around line 564): the section describes a Continue button + "Signup page coming soon" stub note that the actual `catalog-opt-in.tsx` doesn't have. This drift predates this session; only the `**File:**` and `**Status:**` lines were updated to reflect the move to marketing-site, leaving the stale detail intact. Worth a clean-up pass when the doc next gets touched.
3. **`/start/*` wordmark still targets `/`.** The `/start` nav uses its own override (line 121 of top-nav.tsx) with `<Link href="/">` for the wordmark. Post-lift, `/` redirects to `/sign-in` for logged-out users mid-onboarding — defensible (clicking the wordmark exits onboarding to sign in) but slightly unusual. Flagged in `prototype/archive/README.md` 2026-05-14 entry in case it gets revisited.
4. **Stale dev-server trap recurred.** Two old dev-server processes from a prior session were still bound to 3001/3002 (3-day uptime). Same shape as the Session 87 gotcha: `lsof -nP -iTCP:3001 -iTCP:3002 -sTCP:LISTEN` to find them, kill, then start fresh. Standing rule applies: kill + `rm -rf .next` + restart at end of every task.
5. **`git mv` with bracketed segment names** (`'prototype/app/sms/[category]/page.tsx'`) needs single-quoting to defeat shell globbing. Worked clean once quoted.

## Carry-forward queue

Active workstreams (not closed this session):
- PM_PROJECT_INSTRUCTIONS.md still 469 / 400-line ceiling (carry-forward from Session 86 → 87)
- CLAUDE.md still over 200-line ceiling (carry-forward)
- Phase 1 downstream experiments first-pickup (2b inbound MO, 3c brand upgrade, 4 STOP/START/HELP)
- Phase 2a per-category research per D-384 (8 categories — this lift's preserved components are for the eventual category pages this work feeds)
- Stage 2 `BRAND_DIRECTION.md` authoring + MD-number capture from `BRAND_AUDIT.md`
- Pumping Defense Wave 2 implementation
- Migration 006 manual application
- Broader threat-modeling workstream

New from this session (no BACKLOG entries added; surfaced for the next session):
- Future auth refactor will retire both `prototype/components/sign-in-modal.tsx` (dormant) and `prototype/app/sign-in/page.tsx` (placeholder); the two surfaces share content and should be unified there.
- `prototype/components/footer.tsx` is now dormant; minor cleanup candidate.
- The `/start/*` wordmark behavior (clicking exits onboarding to /sign-in) is defensible but worth revisiting if onboarding UX gets a polish pass.

## Unmerged branches

None. `chore/migrate-marketing-out-of-prototype` was created for this lift, accumulated 5 lift commits + 1 close-out commit, and was fast-forward merged into main. Local branch deleted post-merge.

## Suggested next session

Three plausible threads:

1. **Phase 1 downstream experiments first-pickup** — same recommendation as Session 87's carry-forward. Experiments 2b (inbound MO), 3c (brand upgrade), 4 (STOP/START/HELP) all unblocked. The closest to closing Phase 1.
2. **Stage 2 `BRAND_DIRECTION.md` authoring** — Stage 1 audit synthesis in `docs/BRAND_AUDIT.md` is the input; an authoring session would produce direction + MD-numbered decisions.
3. **Phase 2a content authoring kickoff** — the components preserved on marketing-site this session are for Phase 2a's eventual per-category pages. If the per-category research per D-384 is ready to enter authoring, this session sets up that downstream work.

If PM redirects: the PM_INSTRUCTIONS / CLAUDE.md trim audit wave remains queued and low-coordination, as does cleanup of the dormant `sign-in-modal.tsx` / `footer.tsx` files.
