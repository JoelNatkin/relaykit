# CC_HANDOFF — design-refresh: dark-only + now/later framing (branch `feat/design-refresh`, Session 129, 2026-06-10)

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.
>
> **NOTE — this is the BRANCH copy.** It reflects `feat/design-refresh`; the `main` copy is separately current. The two reconcile when this branch merges.

**Session metrics:** Commits: 33 on `feat/design-refresh` this session (`f28b762` → `dcfaeff`) + this close-out | Files modified: hero.tsx, category-rotor.tsx, step-strip.tsx (new), how-it-works.tsx, messages-quickstart.tsx, app/page.tsx, app/messages/page.tsx, top-nav.tsx, layout.tsx, globals.css, final-cta.tsx, paperwork.tsx, pricing.tsx, preview-list-mock.tsx, ai-section.tsx, variables-callout.tsx, configurator-section.tsx, mobile-categories-summary.tsx; deleted lib/use-theme.ts | Decisions added: 1 (**D-430**, supersedes D-378 partial) | External actions: branch push per commit, Vercel preview per commit (one missed webhook on `ff327285` re-fired via empty commit `a8fb613`).

**Status: 🟡 `feat/design-refresh` is UNMERGED, on Vercel preview, ACTIVE TWEAKING MODE — merge pending final visual sign-off.** HEAD `dcfaeff` (this close-out commit on top), in sync with `origin/feat/design-refresh`. `main` is live in production (Session 128 merge); this branch has not picked up `main`'s post-branch commits — they reconcile at merge.

---

## What shipped this session (themes)

- **Single dark theme (D-430).** Light mode removed: `lib/use-theme.ts` deleted, `app/layout.tsx` server-renders `<html className="dark">` (no FOUC script — `.dark` sets `color-scheme: dark`), theme toggle + `ThemeIcon` removed from `top-nav.tsx` (desktop + mobile). `globals.css` light tokens remain as dead base (collapse deferred). Supersedes D-378's switchable mechanism (D-378 marked).
- **Hero rebuild finish.** Full-width two-tone H1 ("…for your app. **Easier**" via `--color-text-headline-muted`, retuned `#958675`→`#756C61`→`#8B8174`); eyebrow "Free message templates — live now"; `lg:min-h-[820px]` to trim dead space; rotor reworked to a one-pass `FRAMES` list that stops on "Every text your app sends." (NOT CATEGORIES-sourced — see PROTOTYPE_SPEC "Hero rotor note").
- **Shared `<StepStrip/>`** (`components/step-strip.tsx`) — home How-it-works (now **three** steps PLAN→BUILD→LAUNCH) and the `/messages` quick-start render identically (60px gaps, line-on-top, uppercase labels).
- **Now/later coherence.** `StatusBand` band on the home (between Hero + Recognition); `/messages` hero live-now framing + top gold "Join the waitlist" `PrimaryCta` + a bottom `#join` waitlist section; final-CTA body sharpened.
- **`/messages` quick-start: dismissible card → permanent home-style section** (static server component; no dismiss/localStorage/X). ⚠ This makes **D-429 stale** (see flags).
- **Surface dry-out** — home cards to single `surface-card`/`surface-inset` tokens (dropped dead `bg-bg-primary … dark:bg-bg-secondary` pairs); full-bleed home configurator window; mobile categories selector restyle.
- **Terminology** — user-facing "configurator" → "messages" (component/file/PostHog/state names + `#configurator` anchor kept).

## ⚠ CC-surfaced flags (PM decision needed — NOT fixed)

1. **D-429 is now stale.** It records the `/messages` quick-start as a *dismissible four-step* strip; this session made it a *permanent three-step* section. Not a phase boundary, so no retirement sweep was run, and the decision ledger is PM-gated — **no ledger change made.** PM to decide: amend/supersede D-429, and then PROTOTYPE_SPEC line ~104 (still describes the dismissible four-step strip) gets reconciled with it.
2. **Broader PROTOTYPE_SPEC home-spec reconciliation PENDING.** This close-out updated only the dark-theme section + added the rotor note. Still stale from the design refresh: three-step How-it-works, configurator→messages terminology in the §"Home page" list, two-tone H1s, `StatusBand`, hero static graphic (vs `PhoneMock`), `/messages` permanent quick-start + `#join`. Needs a scoped PROTOTYPE_SPEC pass.
3. **Full-bleed window horizontal-scrollbar risk.** The home configurator window uses `mx-[calc(50%-50vw)]`; `100vw` includes the scrollbar width on Windows/Linux (persistent scrollbars), so a ~15px horizontal scrollbar can appear. No `overflow-x` guard exists on `<html>/<body>/<main>`. Fix on tap: add `overflow-x-hidden` to `<body>`. Likely invisible on macOS overlay scrollbars (so it won't show on Joel's preview).

## OPEN next session (per PM)

- ~~**(a)** `/messages` hero subhead orphan — widen `max-w-[520px]` → `[580px]`.~~ **DONE** (next-session commit, branch HEAD): subhead is now `max-w-[580px]`.
- ~~**(b)** `/messages` `#join` `<p>` body wording.~~ **DONE** (same commit): both `/messages` `#join` and home `final-cta.tsx` bodies now read "You can start with the messages today. When RelayKit launches, we'll take care of registration, opt-outs, delivery, and the carrier requirements behind the scenes." — the two now/later bodies stay in sync. Same commit also relabelled the `BottomEmailCapture` button "Join the list" → "Join the waitlist" (shared component — lands on both home final-CTA and `/messages` `#join`).

## Carry-forwards

- **`globals.css` light→dark dead-token collapse** — deferred per D-430 (light token values still present as dead base; collapse to a single set is its own task).
- **Blog `we-put-our-best-tool-in-front-of-everyone.mdx`** still uses user-facing "configurator" (5×, as a named concept) — left out of the mechanical terminology sweep; needs a voice rewrite (`relaykit-writing-prose`), not a find-replace.
- **Canonize the relaxed per-commit PM-review rule** in PM_PROJECT_INSTRUCTIONS + CLAUDE.md: trivial / fully-specified / visually-verifiable → auto-ship after build+push; logic / shared-component / multi-file / structural → keep PM review (write `.pm-review.md`, wait). This session ran on that cadence informally.

### Pre-launch head-scratcher backlog (surfaced this session)
- **`workspace_name` vs `business_name`** token inconsistency in `lib/message-library` — affects the live tool *and* copied templates; pick a canonical token + sweep.
- **"a few days" approval (D-215)** vs the 10–15 business-day reality — revisit the copy/claim.
- **`ai-section.tsx` code date "Fri, Jun 6"** is actually a Saturday → should be Jun 5.
- **"Acme Engineering" vs "Acme"** inconsistency across `variables-callout.tsx` rows.

### Pre-existing carry-forwards (not design-refresh)
- Delete `joel+golive-smoke@gmail.com` (`interest_tag = golive-smoke-test`) from `early_access_subscribers` (Joel).
- OG unfurl cache-bust (`/?v=2`) — verify.
- TFN-path-killed MASTER_PLAN canon close.
- Claude.ai UI custom-instructions paste-sync.

## Untracked carryover — DO NOT COMMIT
- Only `.claude/settings.local.json` remains untracked.

## Next steps
- Resume `/messages` polish ((a)+(b) above) on the preview → once visuals lock, do the PROTOTYPE_SPEC home-spec reconciliation pass + resolve the D-429 staleness with PM → merge `feat/design-refresh` to `main`.
- **Phase 2 — Session B (Sinch outbound delivery)** per MASTER_PLAN remains the parallel substantive product pickup.
