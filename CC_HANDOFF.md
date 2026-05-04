# CC_HANDOFF — Session 71

**Date:** 2026-05-04
**Session character:** PostHog product-analytics install on `/marketing-site` shipped to production via the D-368 branch-and-preview workflow. First code-touching session since Session 60. Tightly-scoped: autocapture + manual `$pageview` tracking only, named events explicitly deferred to post-redesign. Two pieces of standing instrumentation infrastructure also landed out-of-band by Joel (F5Bot brand monitoring + `founder@relaykit.ai` Workspace alias) — no commits, just operational setup.
**Branch:** main (clean except expected untracked `api/node_modules/`, ad-hoc `.pm-review.md` left over from Session 70, and `.claude/scheduled_tasks.lock`)

`Commits: 3 (including this close-out) | Files modified: 8 | Decisions added: 0 | External actions: 0 (out-of-band Joel actions: 2 — F5Bot + founder@ alias)`

8 files modified across these three commits: `marketing-site/.env.example`, `marketing-site/app/layout.tsx`, `marketing-site/components/posthog-pageview.tsx` (new), `marketing-site/components/posthog-provider.tsx` (new), `marketing-site/package-lock.json`, `marketing-site/package.json` (Commit 1) + `REPO_INDEX.md` and `CC_HANDOFF.md` (Commit 3 close-out). Commit 2 is the merge — adds no further file changes beyond Commit 1's content.

---

## Commits this session (in order)

| # | Hash | Description |
|---|------|-------------|
| 1 | `bc2756b` | feat(marketing-site): install PostHog with autocapture + manual pageview tracking |
| 2 | `31c5212` | Merge feat/posthog-marketing-instrumentation: install PostHog with autocapture + manual pageview tracking |
| 3 | (this commit) | docs(handoff): Session 71 close — PostHog autocapture install on marketing-site |

Both code commits pushed mid-session and merged to main per D-368 workflow. Close-out commit pending PM approval before push.

---

## What was completed

**PostHog autocapture instrumentation live on `relaykit.ai` production** — landed via the D-368 branch-and-preview workflow:

1. **Branch + install + scaffolding** (`bc2756b`). Created branch `feat/posthog-marketing-instrumentation` from clean main. `npm install posthog-js` in `marketing-site/` added `posthog-js@^1.372.8` (single dependency — `posthog-js/react` is a subpath export of the same package, not a separate npm package). Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` + `NEXT_PUBLIC_POSTHOG_HOST` to `marketing-site/.env.example` with token redacted (`phc_xxx`) and host kept verbatim (`https://us.i.posthog.com` — US PostHog cloud host, not a secret). Created `marketing-site/.env.local` with live values; verified via `git check-ignore` that the file is ignored by `marketing-site/.gitignore`'s `.env*.local` rule before any `git add`. Two new client components scaffolded flat in `marketing-site/components/` to match the existing flat-`/components/` convention (`top-nav.tsx`, `footer.tsx` precedent — no `providers/` or `instrumentation/` subdir created since two files don't justify it, and Next.js reserves the top-level `instrumentation.ts` filename for server-side hooks): `posthog-provider.tsx` (client component; window-guarded `posthog.init` inside `useEffect` with idempotency check via `posthog.__loaded` typed-public field; `capture_pageview: false`, `capture_pageleave: true`, autocapture default-on; wraps children with `<PostHogProvider client={posthog}>` from `posthog-js/react`) + `posthog-pageview.tsx` (inner `PostHogPageView` reads `usePathname` + `useSearchParams` and calls `posthog.capture("$pageview", { $current_url })` in a `useEffect`; exports `<SuspendedPostHogPageView />` wrapping the inner component in `<Suspense fallback={null}>` since `useSearchParams` requires a Suspense ancestor in App Router). `marketing-site/app/layout.tsx` wraps body content with `<PostHogProvider>` and renders `<SuspendedPostHogPageView />` above `<TopNav />`; the layout itself stays a server component, the provider establishes the client boundary.

2. **Local quality gates + dev verification** (pre-commit). `npm run typecheck` clean, `npm run lint` clean, `npm run build` green (9 static pages — pre-existing multi-lockfile + missing-Next-ESLint-plugin warnings noted as unrelated). For local dev verification, killed a 5-day-stale `next-server` (PID 14403, etime 5-17:09:24) that was holding port 3002 per the user's auto-memory workflow rule "stop the dev server, delete .next, and restart" — `NEXT_PUBLIC_*` env vars are inlined at dev-server startup, so my new `.env.local` would never have been picked up by the old process. Fresh dev server on 3002 reported `Environments: .env.local` detected on startup; `/`, `/privacy`, `/terms` returned 200; inspected the compiled `app/layout.js` chunk and confirmed token (`phc_zS2…`), host (`us.i.posthog.com`), `posthog.init`, `$pageview`, `capture_pageview`, `capture_pageleave` all inlined as expected.

3. **Branch push + Vercel preview verification + merge to main** (`31c5212`). Pushed `feat/posthog-marketing-instrumentation` to origin; Vercel preview `relaykit-marketing-site-31fjs3lil-...` built Ready in 45s (gated by Vercel SSO — handled by Joel signing into his Vercel dashboard). Joel verified events landing in PostHog dashboard (pageviews, pageleaves, web vitals all firing) on the preview before approving merge. `git checkout main && git pull origin main` confirmed clean (no divergence) → `git merge --no-ff feat/posthog-marketing-instrumentation -m "Merge feat/posthog-marketing-instrumentation: install PostHog with autocapture + manual pageview tracking"` → `git push origin main`. Vercel auto-deployed production `relaykit-marketing-site-lgqhzw5ll-...` Ready in 45s. Production verification: `relaykit.ai` HTTP 200, served by Vercel; HTML references PostHog; production layout JS chunk `layout-63cd0117cb9416a9.js` (4.7KB minified) inlines `phc_zS2`, `us.i.posthog.com`, `capture_pageview`, `capture_pageleave`, and `$pageview` as expected. Feature branch deleted locally (`git branch -d`) and on remote (`git push origin --delete`) post-merge.

4. **Vercel env-var configuration** (Joel-side, post-merge). `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` + `NEXT_PUBLIC_POSTHOG_HOST` added to Vercel project across Production + Preview + Development scopes — production deploy now reads autocapture into the same PostHog project as the preview Joel verified events on.

5. **Standing instrumentation infrastructure (Joel-side, out-of-band):**
   - **F5Bot brand monitoring** — alerts configured for `RelayKit` (whole-word match — chosen to avoid noise from generic "relay kit" / hardware-relay-kit hits), `relaykit.ai` substring, and `msgverified` substring. Covers organic mentions across HN, Reddit, Lobsters, paste sites, broader public web. Standing operational tooling, no further setup needed.
   - **`founder@relaykit.ai` Google Workspace alias with send-as configured** — separates founder-voice outbound from the default operational sender. Standing operational infrastructure, no further setup needed.

---

## What's in progress

Nothing mid-stream from this session. PostHog install is complete and live; named events come post-redesign as planned.

---

## Quality checks passed

- `tsc --noEmit` clean on `marketing-site/` pre-merge.
- `eslint .` clean on `marketing-site/` pre-merge (project-local flat config).
- `npm run build` green pre-merge — 9 static pages generated, no compilation errors.
- Local dev verification: fresh dev server on 3002 with `.env.local` detected; `/`, `/privacy`, `/terms` all return 200.
- Compiled `layout.js` chunk inspection (dev): token + host + init + flags + capture call all inlined.
- Vercel preview build: ● Ready 45s.
- Vercel production build (post-merge): ● Ready 45s.
- Production verification via `curl + grep`: `relaykit.ai` 200, layout chunk `layout-63cd0117cb9416a9.js` inlines token/host/flags/capture call.
- Joel-side browser verification on preview: pageviews + pageleaves + web vitals all firing in the PostHog dashboard.
- Doc-only close-out commit (this commit) — `tsc` / `eslint` / `vitest` not required per CLAUDE.md close-out gates.
- Pre-flight DECISIONS ledger scan run at session start: Active count 289 (latest D-374), Archive D-01–D-83. D-373 + D-374 were new since Session 69, both properly formatted with Supersedes: none — no flags.
- Pre-flight git state at session start: HEAD == `6b5650a` == `origin/main`, `git rev-list --left-right --count HEAD...origin/main` returned `0 0`. Session 70's close-out commit was unpushed at Session 70 close per CC_HANDOFF, then pushed by Joel between Session 70 close and Session 71 open. Working tree clean except untracked `api/node_modules/` and `.pm-review.md` (Session 70 leftover, not touched this session).
- `.env.local` leak check: `git check-ignore marketing-site/.env.local` confirmed the file is gitignored by `marketing-site/.gitignore:6` (`.env*.local` rule); `git status` after staging confirmed `.env.local` was not in the diff. The token never entered `git add`.

---

## Out of scope this session and explicitly deferred

- **Named events** (e.g. `pricing_viewed`, `get_started_clicked`) — explicit non-goal today; will land after the marketing-site redesign so the events match the new IA, not the current pages.
- **Session replay** — not configured; no `session_recording` flag flipped.
- **Identify calls / user identification** — not implemented; the marketing site is anonymous-traffic-only at present.
- **Server-side capture (`posthog-node`)** — explicitly NOT installed.
- **Any changes to existing pages, copy, or components** outside the layout-wrapping integration.
- **Anything outside `marketing-site/`** — no `/api`, `/sdk`, `/prototype`, `/src` touched.

---

## Retirement sweep findings

None — mid-phase session, no MASTER_PLAN phase boundary crossed (Phase 1 still active; PostHog install is Phase 8 / marketing-side execution, not a phase advance).

---

## Drift-watch findings

None — mid-phase close-out, drift-watch skipped per CLAUDE.md step 9.

---

## Carry-forward / Surface for next session

1. **Build-in-public MD-numbers (channels, content posture, cadence)** — not yet recorded. Will land after first IH (Indie Hackers) post per "see what's sustainable before locking in" reasoning. PM-chat strategy work, no CC required at this stage.

2. **Customer-health monitoring slice** — open architectural question: does this get its own home (e.g. a new `docs/CUSTOMER_HEALTH_*` track) or extend BACKLOG Entry F (attack-pattern observation framework for first-50-customers window, added Session 70)? PM call. Resolves before Workstream 1 lands its first concrete artifact.

3. **Marketing site facelift** — next workstream, scoping pass not yet started. Its own session.

4. **Session 70 carry-forward items still applicable:**
   - Pumping Defense Wave 2 work (MESSAGE_PIPELINE_SPEC extension, AGENTS.md defensive-practices section, integration prompt template extension, per-builder guides, VERIFICATION_SPEC §6 generalization, TESTING_GUIDE 9th signal, PRICING_MODEL absorbed-cost note) deferred to Phase 5/8 design activation. Not a near-term work item.
   - Broader threat-modeling workstream (BACKLOG Entry G — RelayKit launch threat model, 4-6 hour structured exercise) — launch-period deliverable, can be picked up any time during the launch-prep window. Promotes `docs/SECURITY_DRAFT.md` from DRAFT to canonical.

5. **Session 69 carry-forward items still applicable:**
   - Phase 1 downstream queue (still UNBLOCKED 2026-05-01, awaiting first-pickup): Experiment 2b (live sample SMS over approved campaign — highest-leverage), Experiment 4 (STOP/START/HELP), Experiment 3c (campaign upgrade flow). All three have full procedures drafted.
   - TESTING_GUIDE_DRAFT.md prototype validation (BACKLOG entry from Session 67) — gates the embedded-dashboard architectural-posture parking and the marketing positioning entry.
   - Vertical taxonomy track (carry-forward from Session 68): three §4 directional pieces in `docs/VERTICAL_TAXONOMY_DRAFT.md`. Will resolve naturally when Phase 5 design activates.
   - Joel-actionable marketing items (carry-forward from Session 68): affiliate signups (ShipFast 50%, Supastarter, Saaspegasus, Makerkit) + tooling choices (Plausible/Fathom for analytics — note: PostHog now landed for the marketing site specifically, but a separate analytics tool may still be in scope for non-marketing surfaces; Resend for email).
   - Migration 006 manual application (carry-forward from prior sessions): SQL committed at `api/supabase/migrations/006_signups.sql` since Session 58 but not yet applied to live shared Supabase.
   - Session B kickoff prerequisites still pending: MESSAGE_PIPELINE_SPEC.md spec catch-up; five Sinch API/dashboard inconsistencies open for Sinch BDR (Elizabeth Garner) verification at kickoff (4 from Session 52 + multi-campaign Sinch ISV economics question added Session 69 via L118 extension); resubmission API parity question (Session 60); approval-state observability question (Session 63).

---

## Suggested next tasks

1. **Workstream 1 strategy/scoping** — build-in-public MD-numbers + customer-health monitoring home + first IH post. PM-chat work, doable without CC. Lightweight-but-load-bearing for the marketing posture going forward.

2. **Marketing site facelift** — its own session, scoping pass first. Will likely involve a new prototype iteration before any production code lands.

3. **Phase 1 downstream experiments (still highest-leverage):** Experiment 2b (live sample SMS over approved campaign), Experiment 4 (STOP/START/HELP), Experiment 3c (Simplified→Full brand upgrade). All three procedures drafted. Joel-driven; PM writes procedure refinements as needed.

4. **Joel-actionable marketing items (carry-forward):** affiliate signups, remaining tooling confirmation. Lightweight, blocks marketing-site reference content.

5. **Pumping Defense Wave 2 work** activates with Phase 5/8 design — not a near-term task.

6. **Broader threat-modeling workstream** (BACKLOG Entry G) — launch-period deliverable, can be picked up any time during the launch-prep window. Promotes SECURITY_DRAFT to canonical.

7. **Migration 006 manual application** (carry-forward from Session 58) — SQL committed but not applied to live shared Supabase.

---

## Files modified this session

**Repo files (committed across the three commits):**
- `marketing-site/package.json` (Commit 1, +1) — added `posthog-js@^1.372.8`
- `marketing-site/package-lock.json` (Commit 1, +433) — npm install side effect
- `marketing-site/.env.example` (Commit 1, +5) — appended PostHog env-var entries with token redacted
- `marketing-site/components/posthog-provider.tsx` (Commit 1, +21 — new file)
- `marketing-site/components/posthog-pageview.tsx` (Commit 1, +28 — new file)
- `marketing-site/app/layout.tsx` (Commit 1, +8/-3) — imports + body wrap
- `REPO_INDEX.md` (Commit 3, this commit — Meta block + change-log entry)
- `CC_HANDOFF.md` (Commit 3, this commit — overwritten)

**Untracked-but-untouched (not staged):**
- `marketing-site/.env.local` — created locally with live token, **gitignored**, never staged or committed
- `.pm-review.md` — Session 70 leftover at repo root, not touched this session
- `api/node_modules/` — standing untracked
- `.claude/scheduled_tasks.lock` — runtime artifact

**Untouched this session:** `/prototype`, `/api`, `/sdk`, `/src`, `MASTER_PLAN.md`, `DECISIONS.md`, `PROTOTYPE_SPEC.md`, `BACKLOG.md`, `CLAUDE.md`, `PM_PROJECT_INSTRUCTIONS.md`, `docs/MARKETING_STRATEGY.md`, `docs/SECURITY_DRAFT.md`, `docs/VERTICAL_TAXONOMY_DRAFT.md`, `docs/TESTING_GUIDE_DRAFT.md`, all other `/docs/`, audits, experiments.

---

## Carry-forward (post-Phase-1 unblock)

- BACKLOG aging review (Session C carryover, still open, surfaced 2026-04-27 Session 56)
- Draft-doc convention formalization (Session 67 + Session 68 + Session 70 surface item — three precedents now: TESTING_GUIDE_DRAFT, VERTICAL_TAXONOMY_DRAFT, SECURITY_DRAFT. Recommend formalizing the `FOO_DRAFT.md` filename + status-block + REPO_INDEX-Purpose-DRAFT-marker + canonical-rename-on-graduation pattern in PM_PROJECT_INSTRUCTIONS or CLAUDE.md.)
- LEGAL_DOC_DEFERRED_CLAIMS.md forward-looking note (Phase 6 ship will likely trigger restoration of OTP-related capability language in legal docs)

PostHog install was the entire scope of code touched this session. Quality gates passed pre-merge. PM review pending on this close-out before push.
