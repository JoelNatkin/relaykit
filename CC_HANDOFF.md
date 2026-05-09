# CC_HANDOFF — Session 75 (home-page restructure to seven-section structure + Session-74 branch merge)

**Date:** 2026-05-09
**Session character:** Code session on production-facing surface (`/marketing-site`). Two pieces of work: (1) Joel-directed merge of `feat/configurator-section` to main (D-368 `--no-ff`, branch deleted local + remote post-merge, configurator visible on relaykit.ai post-deploy), (2) home-page restructure on a new branch `feat/home-page-restructure` from the prior nine-section layout to seven sections plus a closing CTA strip. One new D-number captures the architectural copy-claim shift from "a few days" (D-215 hedge) to "three days" / "about three days" (D-376) for carrier approval timing, reflecting Sinch's confirmed ~3-day SLA.
**Branch:** `feat/home-page-restructure` — pushed to origin, **DO NOT MERGE**. Awaiting Joel preview verification on the Vercel preview URL Vercel will post once the close-out commit pushes; PM merge approval after.

`Commits: 3 (--no-ff merge of feat/configurator-section + Session 75 feat + this close-out) | Files modified: 5 (branch feat) + 4 (close-out: PROTOTYPE_SPEC.md, REPO_INDEX.md, CC_HANDOFF.md, DECISIONS.md only if any further edit needed) | Decisions added: 1 (D-376) | External actions: 3 (push main, delete remote feat/configurator-section, push feat/home-page-restructure)`

---

## Commits this session (chronological order)

| # | Hash | Description |
|---|------|-------------|
| 1 | `dbfc58e` | Merge branch 'feat/configurator-section' (no-ff, into main; pushed to origin) |
| 2 | `8abb103` | feat(marketing): home-page restructure to 7 sections; D-376 supersedes D-215 |
| 3 | _(this close-out)_ | docs: Session 75 close — home-page restructure + Session-74 branch merge |

Commits 1–2 already pushed to remote (commit 1 to `origin/main`; commit 2 to `origin/feat/home-page-restructure`). The close-out commit will push at the end of this session. **`feat/home-page-restructure` will not be merged to main** — Joel verifies on the Vercel preview, PM approves merge in a later turn.

---

## What was completed

### 1. Merge of `feat/configurator-section` to main

Joel directed the merge of Session 74's branch in this turn. Pre-merge state: branch 17 commits ahead of main, 0 behind; main and branch in sync against origin. Merge executed with `--no-ff` per D-368 (preserves the feature-branch shape on main): merge commit `dbfc58e`. Main pushed to origin. Vercel deploy of main verified by polling relaykit.ai with cache-busted curl until "Configure your messages" appeared (~70s after push). Branch deleted local (`git branch -d feat/configurator-section`) and remote (`git push origin --delete feat/configurator-section`).

### 2. Home-page restructure on `feat/home-page-restructure` (1 feat commit)

Single feat commit `8abb103` (5 files +276/-327) replaces the prior nine-section home-page layout with seven sections + closing CTA strip:

- **Section 1 — Hero** (revised existing inline block in `marketing-site/app/page.tsx`): adds eyebrow "$49 + $19/mo. Three days to live." (small, weight 500, primary text color), AI-tool word-marks row using existing SVGs in `marketing-site/public/logos/` (Claude Code, Cursor, Windsurf, GitHub Copilot, Cline — `h-5 w-auto opacity-70`), and a static OTP visual (`marketing-site/components/hero-otp-visual.tsx`, six boxes 5/6/6/8 with focused-with-caret + empty boxes, disabled "Continue" button — mirrors `prototype/components/sign-in-modal.tsx` lines 210–224 styling). Layout shifts from centered single-column to two-column on desktop (`md:grid-cols-[3fr_2fr]`), stacked on mobile. Subhead drops "coding": "Two files. Your AI coding tool…" → "Two files. Your AI tool…" — the word-marks row directly below establishes context, so the qualifier is redundant.
- **Section 2 — Configurator** (subhead change only in `marketing-site/components/configurator-section.tsx` line 642): "OTP is included. You can change any of this later in your workspace." → "Verification codes included. You can change these later in your workspace."
- **Section 3 — Build it** (NEW, inline): H2 "Two files. Your AI tool.", subhead "Most of the integration is already done. The rest takes minutes." Two columns on desktop ("Starting fresh" left with starter-kit text labels [ShipFast, Supastarter, MakerKit, Vercel + Supabase] — text labels not SVGs since no logo assets exist for these brands; "Already built" right, text-only). Below the columns, small build-spec paragraph: "Your AI tool learns RelayKit through the build spec. Ask it where to wire opt-outs, or whether a message body will pass review — it'll know." Below that, a JS code block (plain `<pre>` with `bg-bg-secondary px-4 py-4 text-xs font-mono leading-relaxed text-text-secondary overflow-x-auto whitespace-pre`, no syntax-highlighting library — pattern from `prototype/components/catalog/message-action-modal.tsx` lines 83–85), captioned "That's the send." Bottom one-liner: "Tests are included. The build spec wires them in."
- **Section 4 — Test it for real** (NEW, inline): H2 "Test it for real.", subhead "Real SMS, real phones, before customers see anything." Two-column layout (`md:grid-cols-[3fr_2fr]`): left two paragraphs + italic closer ("When you go live, it's the same code path. No surprises."), right `marketing-site/components/preview-list-mock.tsx` (static replica of `prototype/components/test-phones-card.tsx` — three rows Joel verified / Sarah verified / Mike invited, non-functional "+ Invite someone" link in `text-text-brand-secondary`).
- **Section 5 — We handle the paperwork** (NEW, inline): H2 "We handle the paperwork.", body period-list of nouns ("Registration paperwork. The approval back-and-forth. The opt-in form your users see. STOP handling. Opt-out tracking. Delivery monitoring."), italic kicker "We read it so you don't have to." Centered, max-w-3xl.
- **Section 6 — Pricing** (rebuilt): collapses the two-card Free/Go-live layout to a single staged card (`max-w-[540px]`, `rounded-xl border border-border-primary p-8`): Stage 1 "Build for free" body / horizontal divider / Stage 2 "Go live for $49 + $19/mo" body. H2 changes from "Free to build. Pay when you go live." to "Free to build. $49 + $19/mo to go live." Below: fine-print row ("Marketing categories add $10/mo. Volume pricing above 5,000 messages.") and scope paragraph ("US and Canada at launch. We don't handle HIPAA, healthcare-regulated workflows, or enterprise procurement.").
- **Section 7 — Closing CTA strip** (NEW): H2 "Ready when you are.", subhead "Configure today. Live in three days. Refund if not approved.", "Get early access" button matching top-nav styling (border + `bg-bg-primary` + `text-text-secondary`) and destination (`/start/verify`).

Removed: "How it works" 3-step block (was lines 111–131); pricing context line (was lines 133–136); "Explore use cases" 8-card grid (was lines 138–162, id `categories`); "Why RelayKit?" 4-card grid (was lines 233–288, id `compliance`); comparison table "You shouldn't need a telecom degree…" (was lines 290–366); trailing "No contracts. Cancel anytime…" reassurance line (was lines 364–366). The configurator (D-375) demonstrates use cases interactively, making the static use-cases grid redundant; new Sections 3/5 cover what how-it-works / why-relaykit / comparison-table did, in tighter on-voice form.

### 3. D-376 recorded — three days for carrier approval claim

`D-376 — Three days for carrier approval claim` (Date: 2026-05-09). Marketing copy describing carrier approval time uses "three days" (or "about three days" in body register) rather than "a few days." Reflects Sinch's confirmed ~3-day SLA.

**Supersedes:** D-215.

D-215 hedged on timing because Sinch's SLA was unconfirmed when recorded. With Sinch's ~3-day approval validated through Phase 1 prep work and Sinch BDR conversations, the specific claim is supportable and lands harder than the hedge. If Sinch's SLA shifts materially in the future, copy gets re-evaluated and a follow-up decision recorded.

D-215 carries the supersession mark `⚠ Superseded by D-376: "a few days" replaced by "three days" once Sinch's ~3-day SLA was confirmed.` in the same commit as the copy change.

### 4. PROTOTYPE_SPEC.md updated

A new `### Home page (`/`) — seven-section structure` subsection added at the top of `## Production Marketing Site — relaykit.ai` (between the section intro paragraph and the existing Configurator Section subsection). Captures the seven sections in order, with copy strings, layout details, and references to the prototype source files for the OTP visual + Preview list mock. Configurator Section subsection's subhead string updated. Configurator Section status flipped from "Stable on `feat/configurator-section` (awaiting merge approval)" to "Stable (merged to main Session 75; further home-page sections built around it on `feat/home-page-restructure`)".

### 5. REPO_INDEX.md updated

Meta block bumped: Last updated → 2026-05-09 with Session 75 summary; Decision count D-375 → D-376 (291 active entries); Active branch flipped from `feat/configurator-section` (now merged + deleted) to `feat/home-page-restructure`; Unpushed-local-commits note refreshed for Session 75 close-out commit. `/marketing-site` subsection extended with a Session 75 changes block (new files + restructure summary); Session 74 additions reframed as "now on main" since the branch merged this session. New Session 75 entry appended to the change log.

---

## What's in progress

`feat/home-page-restructure` is **not** merged. Joel verifies the Vercel preview after this close-out commit pushes; PM gives the merge call. No mid-stream code work — the restructure is functionally complete on this branch.

---

## Quality checks passed

- `tsc --noEmit` clean.
- `eslint` clean (one fix during the build: removed a stale `@next/next/no-img-element` disable comment because the rule wasn't loaded in eslint config — same fix pattern that surfaced in Session 74 with `react-hooks/exhaustive-deps`).
- `next build` green — 8 static pages on this branch (`/_not-found`, `/`, `/acceptable-use`, `/privacy`, `/signup`, `/start/get-started`, `/start/verify`, `/terms`).
- Local dev boot clean (port 3000), `GET / 200` with all seven section markers verified via curl grep ("SMS for builders" / "Configure your messages" / "Two files. Your AI tool" / "Test it for real" / "We handle the paperwork" / "Free to build. $49" / "Ready when you are").
- Bundle: `/` route 109 kB → 103 kB (no new deps; restructure removed icon imports and the comparison-table block).
- DECISIONS ledger pre-flight scan at session start: Active count 290 latest D-375, Archive D-01–D-83. No new D-numbers since Session 74 close-out (the only commit on main since was `d16be46 docs(backlog): add marketing-site message catalog depth parity entry`, BACKLOG-only). Post-D-376-append: D-376 carries `Supersedes: D-215` after greping DECISIONS.md + DECISIONS_ARCHIVE.md for "approval timeline", "few days", "carrier review" — D-215 was the genuine conflict; D-17, D-199 already superseded; no other matches. D-215 marked in same commit per inline-supersession-enforcement workflow.

---

## Pending / carry-forward

1. **Joel preview verification + PM merge approval** for `feat/home-page-restructure`. Branch will not be merged until both clear. If Joel finds issues on the preview, additional iteration commits land on the same branch before merge.

2. **Earlier carry-forward items still applicable:**
   - Stage 2 (`docs/BRAND_DIRECTION.md`) — consumes the BRAND_AUDIT.md synthesis to produce the design system with point of view. Not yet started; large-scope session.
   - MD-number capture session — strategy-shaped session that walks the BRAND_AUDIT.md synthesis and decides which findings rise to MD-number status in MARKETING_STRATEGY.md.
   - Phase 1 downstream experiments still UNBLOCKED: Experiment 2b (live sample SMS over approved campaign), Experiment 4 (STOP/START/HELP), Experiment 3c (Simplified→Full brand upgrade). Joel-driven; high-leverage on product readiness.
   - Pumping Defense Wave 2 work deferred to Phase 5/8 design activation.
   - Broader threat-modeling workstream (BACKLOG Entry G) — launch-period deliverable, promotes `SECURITY_DRAFT.md` to canonical.
   - Migration 006 manual application (carry-forward from Session 58) — SQL committed but not applied to live shared Supabase.
   - Joel-actionable marketing items: affiliate signups (ShipFast 50%, Supastarter, Saaspegasus, Makerkit) + remaining tooling confirmation.
   - Dark-mode session — surface-wide pass; not tied to any one section.
   - Per-vertical hybrid pages, starting with Verification — `/verification` page carrying its own configurator slice + vertical-specific copy + integration code samples.
   - Real cropped screencaps for Section 4's Preview list panel (and possibly Section 3's interface affordances if revisited) — HTML/CSS mocks are v1 per the PM-approved plan; Joel may swap real screencaps later.
   - Brand SVG assets for the Section 3 starter-kit row (ShipFast, Supastarter, MakerKit, Vercel + Supabase) — text labels are v1; logo acquisition follow-up if Joel wants the visual fidelity.

---

## Retirement sweep findings

None — mid-phase close-out, no MASTER_PLAN phase boundary crossed (Phase 1 still active).

---

## Drift-watch findings

None — mid-phase close-out, drift-watch skipped per CLAUDE.md step 9.

---

## Gotchas for next session

1. **`feat/configurator-section` deleted local + remote.** All Session 74 work is now on main as of merge commit `dbfc58e`. Future references to "the configurator branch" are historical only — main is the source of truth.

2. **Two ESLint-rule "ghost" patterns now in repo history.** Sessions 74 and 75 both removed stale eslint-disable comments where the rule wasn't loaded (Session 74: `react-hooks/exhaustive-deps`; Session 75: `@next/next/no-img-element`). The marketing-site's `eslint.config.mjs` doesn't load Next.js's plugin, so disable comments referencing `@next/next/*` rules will fail. If a future iteration needs to suppress an `<img>`-related rule, either load the plugin first or skip the directive.

3. **No syntax-highlighting library in the marketing-site.** Section 3's code block uses plain `<pre>` with `bg-bg-secondary` styling — no Shiki/Prism/Highlight.js. If Joel later wants colored tokens in the code block (likely a polish ask, not a launch blocker), the lift is to add `shiki` (static-render, lightweight) and rebuild the code block as a server component. Not blocking for now.

4. **Static mocks for Preview list + (future) Ask Claude exist as separate components.** `marketing-site/components/preview-list-mock.tsx` carries a header comment naming `prototype/components/test-phones-card.tsx` as its parity source. The PM-approved plan also originally proposed a static Ask Claude callout mock, but PM amended the plan mid-loop to drop that and replace with an inline build-spec paragraph instead — no Ask Claude mock component exists. If a future iteration revives the panel, it would need a new `ask-claude-mock.tsx` mirroring `prototype/components/ask-claude-panel.tsx`.

5. **Starter-kit row in Section 3 uses text labels, not logos.** ShipFast / Supastarter / MakerKit / Vercel + Supabase are rendered as `font-medium text-text-tertiary` text in a flex-wrap row. No SVG assets exist for these brands in `marketing-site/public/logos/`. Joel may source them as a follow-up; if so, the swap is a flex-row of `<img>` tags matching the hero AI-tool word-marks pattern.

6. **D-376 "three days" claim is anchored to Sinch's confirmed SLA.** If Sinch's SLA shifts materially in the future, the copy needs re-evaluation and a follow-up decision recorded (see D-376 reasoning paragraph). Surfaces touched: hero eyebrow, closing CTA subhead, Section 6 stage-2 body. A future surface adding carrier-approval-timing copy should also use "three days" / "about three days" per D-376 — not "a few days" (the D-215 hedge).

7. **`.pm-review.md`, `api/node_modules/`, and a working-tree `.gitignore` modification (adding `.pm-handoff.md` to ignore) remain untracked / unstaged** — standing local-only artifacts, not staged this session. The `.gitignore` mod predates Session 75 (carried over from Session 74's working tree).

---

## Files modified this session

**Branch total (5 files, 1 feat commit `8abb103`):**

New (2):
- `marketing-site/components/hero-otp-visual.tsx`
- `marketing-site/components/preview-list-mock.tsx`

Modified (3):
- `marketing-site/app/page.tsx` (rewritten — restructure to seven sections + closing CTA)
- `marketing-site/components/configurator-section.tsx` (subhead string change at line 642)
- `DECISIONS.md` (+D-376; supersession mark on D-215)

**Close-out (this commit, 4 files):**
- `PROTOTYPE_SPEC.md` (+ "### Home page (`/`) — seven-section structure" subsection; configurator subhead string updated; configurator section status flipped post-merge)
- `REPO_INDEX.md` (Meta block + `/marketing-site` subsection + change-log entry)
- `CC_HANDOFF.md` (this file — overwrite)
- (DECISIONS.md not touched in close-out — D-376 already in feat commit `8abb103`.)

**Untracked-but-untouched (not staged):**
- `.pm-review.md` — local-only review artifact, not refreshed this session.
- `api/node_modules/` — standing untracked.

**Working-tree change carried over (not staged):**
- `.gitignore` — Session 74 carryover adding `.pm-handoff.md` to ignore. Not authored this session, not staged.

**Untouched this session:** `/prototype`, `/api`, `/sdk`, `/src`, `MASTER_PLAN.md`, `BACKLOG.md`, `CLAUDE.md`, `PM_PROJECT_INSTRUCTIONS.md`, `MARKETING_STRATEGY.md`, all of `/docs/`, audits, experiments. (PROTOTYPE_SPEC's prototype-side sections are unchanged; only the new "Home page seven-section structure" subsection + configurator subhead/status updates landed.)

---

## Suggested next session

1. **Wait for Joel preview verification + PM merge call** on `feat/home-page-restructure`. If feedback comes back with issues, iterate on the same branch before merge. If feedback is clean, PM directs merge to main.

2. **Per-vertical hybrid pages, starting with Verification** — `/verification` page carrying its own configurator slice + vertical-specific copy + integration code samples. Phase 6 alignment.

3. **Dark mode session** — surface-wide pass; lower-leverage but bounded scope.

4. **Stage 2 (`BRAND_DIRECTION.md`)** — when Joel routes back to the brand line. Consumes BRAND_AUDIT.md synthesis to produce the design system with point of view.

5. **Phase 1 downstream experiments** — Experiments 2b / 4 / 3c remain UNBLOCKED, all procedures drafted. Joel-driven; high-leverage on product-readiness side.

6. **Real screencaps + brand SVGs follow-up** — Section 4 Preview list real cropped screencap (currently HTML/CSS mock); Section 3 starter-kit logos (currently text labels). Both are deferred polish, low-risk swaps.

---

Home-page restructure to seven-section structure wrapped on `feat/home-page-restructure`. Branch is pushed and ready for Joel preview verification once the Vercel preview URL posts on the close-out commit. **Do not merge until PM directs.** `feat/configurator-section` merged to main this session; configurator visible on relaykit.ai post-deploy.
