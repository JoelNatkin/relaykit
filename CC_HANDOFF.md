# CC_HANDOFF — Session 90 (pre-launch posture + early-access waitlist + close-out)

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out. Includes commits, completed work, in-progress, gotchas, files modified, unmerged branches, suggested next tasks.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader, not as a session memoir.

**Date:** 2026-05-16
**Branch:** `main` — all session work merged. The close-out commit is the only commit awaiting push at write time.

`Commits: 11 | Files modified: 29 | Decisions added: 0 D-numbers (MD-19, MD-20 added to MARKETING_STRATEGY) | External actions: ~14 git pushes`

(Metrics scope: `ba00a64..HEAD` — session-start HEAD through this close-out. `aa50cbd` in that range is the carried-over Session 89 close-out commit, committed by Joel early this session.)

---

## Session character

A long marketing-site session: finish the blog, stand up a pre-launch posture, and build the early-access waitlist. Sequence — blog landing-copy finalize + merge → pre-launch home posture (MD-19) → configurator + hero pricing clarity → early-access waitlist (plan-mode → build → review → merge) → a PM_PROJECT_INSTRUCTIONS process rule → this close-out. Five feature branches created and merged.

## Commits this session (`ba00a64..HEAD`)

1. `33e1ee0` content(blog): final landing description
2. `aa50cbd` docs(close-out): Session 89 — blog scaffold V1 close-out *(carried over from Session 89)*
3. `6b06be1` content(blog): revise landing description
4. `1e7a4ac` feat(marketing): pre-launch home posture
5. `a02d5d3` docs(marketing): MD-19 pre-launch marketing site posture
6. `7683c01` Merge branch 'feat/blog-scaffold'
7. `71d454d` feat(marketing): configurator pricing clarity
8. `baba7fe` feat(marketing): hero pricing clarity — free-to-build framing
9. `ffe5192` feat(marketing): early-access waitlist (modal + Supabase + Resend)
10. `2874483` docs(pm): add branch sequencing discipline to PM_PROJECT_INSTRUCTIONS
11. (this close-out) docs(close-out): Session 90 — PROTOTYPE_SPEC/PRODUCT_SUMMARY/REPO_INDEX/CC_HANDOFF

## Completed work

- **Blog finalized + merged.** Landing `BLOG_DESCRIPTION` settled ("Building with text messages is way too complicated. This is where we work it out."); `feat/blog-scaffold` merged to `main`.
- **Pre-launch home posture (MD-19).** Hero pre-launch tag, configurator subhead + pre-CTA reframed, mid-page CTA → "Get early access"; `docs/PRE_LAUNCH_DEVIATIONS.md` created to track every deviation with restoration triggers.
- **Configurator pricing clarity.** Permanent: "All categories included in $19/mo…" note under the Categories header + "(+$10/mo)" marker on the Marketing row.
- **Hero pricing clarity.** Hero pricing line → "Free to build. $49 + $19/mo to go live." Permanent — the "Hero pricing line" deviation entry was removed from PRE_LAUNCH_DEVIATIONS.md and entries renumbered.
- **Early-access waitlist (MD-20).** Supabase `early_access_subscribers` table (migration `007`), `POST /api/early-access` + `GET /api/unsubscribe`, Resend welcome email, `WaitlistContext` + `WaitlistModal`, all three "Get early access" CTAs rewired to the modal. Built plan-first (plan mode), PM-reviewed, rebased onto main, merged.
- **PM process rule.** `PM_PROJECT_INSTRUCTIONS.md` gained a "Branch sequencing" section (merge on approval; trivial copy edits skip the branch).

## In progress

Nothing open. The waitlist needs three operator steps before it works end-to-end (see Gotchas) but the code is complete and merged.

## Quality gates

- Every code-touching commit ran `tsc --noEmit` + `eslint` clean before commit; `next build` clean where a build artifact was produced.
- Waitlist branch re-verified on the rebased tree: `tsc` clean, `eslint` clean, `next build` clean (28 static pages; `/api/early-access` + `/api/unsubscribe` dynamic). API routes smoke-tested at :3002 — invalid email → 400, bad JSON → 400, valid email (no local Supabase env) → 500, unsubscribe → 200 HTML.
- This close-out is doc-only — no gates re-run.

## Retirement sweep + drift watch

Phase 1 (Sinch Proving Ground) active at session start and still active. No phase boundary crossed — retirement sweep + drift watch skipped per CLAUDE.md mid-phase rules.

## Gotchas for next session

1. **Waitlist needs three operator steps before it works live:** (a) verify `relaykit.ai` as a Resend sending domain; (b) set `RESEND_API_KEY` + `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` in `marketing-site/.env.local` (local) and Vercel (Production); (c) apply `api/supabase/migrations/007_early_access_subscribers.sql` via the Supabase SQL Editor. Until then the modal opens but submit returns the error state (route 500s without Supabase env). The full happy path (insert → welcome email → success) was NOT verifiable locally.
2. **Dev-server working-directory trap.** `npx next dev` started from the repo root instead of `marketing-site/` silently runs the root's Next (v16) against the wrong directory → `/blog` 404s and a version mismatch. Always `cd marketing-site` explicitly before dev/build. Multiple zombie `next` processes racing over `.next` also caused `routes-manifest.json` ENOENT crashes — `pkill -9 -f next` + verify the port is free before restart.
3. **Rebase auto-merge can mis-number.** Rebasing `feat/waitlist-modal` onto main produced no textual conflict on `PRE_LAUNCH_DEVIATIONS.md`, but the 3-way merge left entry headings non-sequential (gap at 5). A clean rebase ≠ a correct doc — always inspect merged structured docs after a rebase.
4. **`docs/POST_TOPICS.md` still untracked** — PM-authored content-planning doc, untracked since before Session 89. Not committed this session. PM decision pending on whether to add it to the repo.
5. **Pre-existing `next`/`postcss` npm audit advisories** persist (1 high, 1 moderate) — unrelated to this session's work; a `next` bump remains a separate PM call.

## Files modified

29 unique paths in `ba00a64..HEAD`. Highlights:
- **Waitlist (new):** `api/supabase/migrations/007_early_access_subscribers.sql`, `marketing-site/app/api/{early-access,unsubscribe}/route.ts`, `marketing-site/lib/email/{welcome,send}.ts`, `marketing-site/context/waitlist-context.tsx`, `marketing-site/components/{waitlist-modal,early-access-button}.tsx`.
- **Marketing-site modified:** `app/page.tsx`, `app/layout.tsx`, `components/{configurator-section,top-nav,footer}.tsx`, `lib/blog/site.ts`, `package.json`, `package-lock.json`, `.env.example`, blog content.
- **Docs:** `DECISIONS.md` (Session 89 carry-over), `MARKETING_STRATEGY.md` (MD-19, MD-20), `PRE_LAUNCH_DEVIATIONS.md` (created + revised), `PM_PROJECT_INSTRUCTIONS.md`, and close-out: `PROTOTYPE_SPEC.md`, `docs/PRODUCT_SUMMARY.md`, `REPO_INDEX.md`, `CC_HANDOFF.md`.

## Unmerged branches

**None.** Five branches were created and merged this session — `feat/blog-scaffold`, `feat/pre-launch-home`, `feat/configurator-pricing-clarity`, `feat/hero-pricing-clarity`, `feat/waitlist-modal`. All remain on `origin` and locally; they are safe to delete (merged into `main`).

## Carry-forward queue

- Waitlist operator steps (Resend domain, env vars, migration 007) — see Gotcha 1.
- `docs/POST_TOPICS.md` untracked — PM decision.
- `PM_PROJECT_INSTRUCTIONS.md` is 479 lines, over its 400-line ceiling — a trim audit is a separate PM-gated wave (the doc's own File-size-discipline rule), not a passive carry-forward.
- CLAUDE.md still over its 200-line ceiling (carry-forward).
- Pre-launch checklist (MASTER_PLAN): blog done; live-site tweaks substantially done (pre-launch posture, pricing clarity, waitlist). Next: configurator message refinement, then first Indie Hackers post — after which Phase 1 experiments resume.
- Phase 1 downstream experiments (2b inbound MO, 3c brand upgrade, 4 STOP/START/HELP) still gated behind the pre-launch checklist.

## Suggested next session

1. **Waitlist design polish** — a visual/UX pass on the waitlist modal on a new `feat/waitlist-modal-design` branch (the V1 modal is functional but styled only to Untitled UI defaults).
2. Verify the waitlist end-to-end once the three operator steps are done (welcome email, duplicate-email idempotency, unsubscribe flow).
3. Configurator message refinement (next pre-launch checklist item), then the first Indie Hackers post.
4. Branch cleanup — delete the five merged branches locally and on origin.
