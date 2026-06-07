# CC_HANDOFF — Marketing-home rebuild (Session 127)

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
> This session it is kept current at every wave/commit boundary (not saved for close-out), because the work is a long multi-round build on an unmerged branch and the session has already hit one transient error — the next CC must not be blind to it.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.

**Session metrics:** Commits: 12 (11 on `feat/marketing-home` incl. this close-out + 1 on `main` `2688820`) | Files modified: ~26 distinct (mostly `marketing-site/`; + CLAUDE.md on main) | Decisions added: 2 (D-427, D-428) | External actions: push ×8 (branch + 4 review rounds + handoff refresh + main + this close-out), Vercel previews polled per branch push

**Status:** Building the new marketing home on branch **`feat/marketing-home`** (off `main`). **NOT merged.** A live Vercel preview is under PM/Joel review; we are iterating on review feedback. Do **not** merge until PM approves the preview. **`main` advanced by `2688820`** ("docs: harden CC_HANDOFF wave-boundary update rule in CLAUDE.md") — a standalone methodology-doc edit committed directly to main, unrelated to the home build; this branch is behind main by that one commit. No conflict expected at merge (the branch never touched CLAUDE.md).

**Latest preview (HEAD `43d3c2b`):** `https://relaykit-marketing-site-gvzi2mj24-joelnatkins-projects.vercel.app` (401 to anonymous = Vercel preview protection — open signed into Vercel). Each push gets a fresh preview URL; fetch the current one via `gh api repos/JoelNatkin/relaykit/deployments?sha=$(git rev-parse HEAD)` → latest deployment → `/statuses` → `environment_url`.

---

## What this build is

`/` is rebuilt from the `relaykit-home-v10.html` design artifact (copy taken **verbatim**) in the real stack. The full message configurator (the free standalone tool) moved to **`/messages`**; the home shows the **real** configurator in a clipped window (see top gotcha). One new chromatic accent — **Metallic Gold `#E0B010`** — was introduced over the D-405 monochrome base, the first chromatic accent since D-405. Dark mode is now the **site-wide default**.

## Commits this session (top = newest)

- `43d3c2b` — **fix (review 4):** mobile + light-mode. Mobile peek height 560→640; mobile full-page modals (categories + edit-values) portal to `document.body`; BUILD section `min-w-0` (mobile overflow); hero phone screen forced dark in light mode; variables-callout token text → mode-aware.
- `506a2c0` — **fix (review 3):** BUILD even 50/50; peek top offset 150→64px (clean top); gold scoped to **category** checkbox only (message-level neutral); variables template in cards; bigger headline / narrower body.
- `baa5982` — **fix (review 2):** **deleted the hand-built `configurator-peek.tsx`**; home now embeds the REAL `<ConfiguratorSection/>` clipped. Recognition arrows green; how-it-works/preview-invite/pricing-STAGE gold.
- `47563c6` — **fix (review 1):** widened the gold accent system (D-427 rewritten in place); made the peek strip + variables callout use the real corpus.
- `2da38af` — **Wave 4 (docs):** MASTER_PLAN one-liner for the marketing-home deliverable + REPO_INDEX meta bump (decision count 343 / branch state).
- `6401d28` — **Wave 3:** full v10 home (`components/home/*` sections) + configurator peek + real SDK snippet.
- `4c4c8c0` — **Wave 2 (D-428):** route split — `/` stub + new `/messages`; nav/footer Messages links; dark default site-wide.
- `15a42c1` — **Wave 1 (D-427):** gold token in `globals.css` + 3 configurator gold sites + message-card spacing 12→16px.
- `684df6d` — **Wave 0:** byte-identical extraction of `MessageReadCard` + `tone-pill` from `configurator-section.tsx`.

(Everything below `684df6d` is Session 125 / `main`.)

## Decisions added

- **D-427** — Metallic-gold accent system over the D-405 monochrome base. **Supersedes: none** (amendment). D-405 marked `⚠ Amended by D-427` in the same commit. NOTE: title/wording were **already widened** from the original "four sites" to "accent system" in `47563c6` — see accent-system gotcha for the one remaining enumeration gap.
- **D-428** — Marketing home at `/`; configurator tool at `/messages`. **Supersedes: D-379 (partial)** — narrows D-379's "home is the full product, not a teaser" placement claim. D-379 marked `⚠ Partially superseded by D-428` in the same commit. (PM-approved the partial-supersession call mid-session.)

## Top gotcha for the next CC

**The configurator PEEK on the home must be the REAL `<ConfiguratorSection/>`** — the exact component `/messages` renders — embedded in a fixed-height (`h-[640px]`) `overflow-hidden` window in `app/page.tsx`, offset up (`-mt-[64px]`, trims the configurator's deterministic 80px `pt-20`) so it opens cleanly on the tool. It is NOT a recreation of the v10 HTML mockup. **Rebuilding it as a mockup was attempted and rejected across ~3 review rounds** — do not regress to a hand-built peek. The window is one instance, fully interactive, and shares `relaykit_configurator` / `relaykit_elig` localStorage with `/messages` (deliberate — continuity of intent, MASTER_PLAN #7; routes never co-mount).

## Accent system (gold expanded past D-427's original "four sites")

Gold now marks, via tokens (`--color-gold` etc., no raw hex outside `globals.css`): primary CTAs, the peek "Open the configurator →" link, **category** checkbox (not message-level), selected tone pill, section eyebrow dots, how-it-works progress bars, "RelayKit handles them." resolve line, paperwork featured-icon backgrounds (tint), pricing-includes checkmarks, AI code-snippet identifier highlight, preview-list "Invited" dot, and pricing **STAGE 1/2 labels**. Plus D-405 **semantic** colors carry status/meaning: **green** (Delivered / Verified), **red** (recognition friction markers). D-427 already describes the system, BUT its enumeration was written before the round-3 STAGE-labels addition — **owed: add the pricing STAGE labels to D-427's enumeration** (minor; the decision is otherwise current).

## In progress / done-awaiting-verification

Round-4 fixes are all **committed in `43d3c2b`** and built clean; they await PM confirmation on the preview:
- Mobile peek height 560→640px — **done.**
- Mobile category-modal chrome rendering at the bottom — **done** (fixed by portaling both mobile modals to `body`; was peek-specific, `/messages` was unaffected).
- BUILD section mobile horizontal overflow — **done** (`min-w-0` on grid columns so the code block scrolls internally).
- Light-mode hero phone screen rendering white — **done** (scoped `dark` class on the screen element; frame still follows page).
- Light-mode variables-callout token text unreadable — **done** (`text-text-white` → `text-text-primary`).

Open question raised to PM, not blocking: whether **PROVE** section wants vertical top-alignment (its grid is already 50/50 by width).

## Pending / next steps

- **Wave 4 is already done** (`2da38af`): MASTER_PLAN one-liner + REPO_INDEX meta bump. The per-wave verification list (tsc / eslint / build / hex no-leak grep) has been run green on every wave + review round.
- **Next:** await PM/Joel preview approval → **merge `feat/marketing-home` to `main`** (do not merge unprompted). `main` is 1 commit ahead (`2688820`, a CLAUDE.md methodology edit) — a normal merge/rebase incorporates it cleanly; no conflict (the branch never touched CLAUDE.md).
- **Owed at merge** (deferred so they describe the final, stabilized state): PROTOTYPE_SPEC home/routing rewrite + the accent-system note; PRODUCT_SUMMARY (the `/` vs `/messages` split changes customer experience); the fuller REPO_INDEX file-inventory for `components/home/*` + `/messages`; and adding STAGE labels to D-427's enumeration.
- **Deferred to a separate wave (NOT this build):** the voice/docs wave — VOICE_v2 revision landing, writing-skill reconciliation, and the Twilio/Sinch/Telnyx trust-line carve-out documentation. The home ships the verbatim trust line now.
- **Pre-deploy blocker (carried):** Supabase migration `api/supabase/migrations/009_early_access_interest_tag.sql` must be applied via the SQL Editor before the next production deploy (the home final-CTA + elig waitlist inserts use `/api/early-access`).

## Locked / standing rules for this build

- **Home copy is verbatim** from the v10 artifact. If a line conflicts with canon (pricing / D-215 day-counts), STOP and flag — do not self-edit. (Pricing + "a few days" were pre-checked clean.)
- **AI code snippet uses the REAL SDK signature** (`new RelayKit()` / `appointments.sendConfirmation(phone, { date, time })`), not the artifact's invented `import { relaykit }` form.
- **Gold via tokens only** — `grep -rE "E0B010|13120E" marketing-site/` must return only the `globals.css` token defs (+ the unrelated brand-950 `#13120E` comment).

## Files modified / added this session

New: `marketing-site/app/messages/page.tsx`; `components/home/{hero,category-rotor,how-it-works,paperwork,pricing,final-cta,ai-section,variables-callout,section-ui}.tsx`; `components/configurator/{message-read-card.tsx,tone-pill.ts}`. Rewritten: `app/page.tsx`. Modified: `app/globals.css` (gold tokens), `app/layout.tsx` + `lib/use-theme.ts` (dark default), `components/configurator-section.tsx`, `components/configurator/category-list.tsx`, `components/configurator/{mobile-categories-modal,edit-values-modal}.tsx` (portal), `components/{top-nav,footer,bottom-email-capture,preview-list-mock}.tsx`. Deleted: `components/configurator-peek.tsx` (the rejected mockup). Canon (this branch): `DECISIONS.md`, `MASTER_PLAN.md`, `REPO_INDEX.md`, `CC_HANDOFF.md`. Separately on `main` (not this branch): `CLAUDE.md` — commit `2688820`.

## Untracked carryovers — DO NOT COMMIT

Two untracked files are pre-existing carryovers from another branch, **not** marketing-home work; they have stayed untracked through every commit this session and must continue to:
- `marketing-site/content/posts/the-feature-serious-scheduling-apps-build.mdx`
- `.claude/settings.local.json`

## PM review mechanic

`.pm-review.md` (gitignored) holds `git show HEAD` of the latest commit for PM's "gg". It is refreshed after every commit this session.

## Unmerged feature branches

- **`feat/marketing-home`** (local + remote, pushed, in sync) — this build. Unmerged, under preview review. Only this branch + `main` exist.
