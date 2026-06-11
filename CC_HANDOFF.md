# CC_HANDOFF — post-launch polish: hero rework + home/messages refinement (branch `feat/post-launch-polish`, Session 130, 2026-06-11)

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.
>
> **NOTE — MERGED to `main`.** `feat/post-launch-polish` was PM-reviewed, approved, and merged to `main` via no-ff merge **`abef727`** (pushed `73e2878..abef727`, 2026-06-11); Vercel production deploy follows the push. The branch is left in place (not deleted). The full-branch diff was prepped to `.pm-review.md` for the cumulative review before merge.

**Session metrics:** Commits: 23 on `feat/post-launch-polish` (`f1309e3` → `6532c53`) + the go-live merge `abef727` + this handoff refresh | Files modified: hero.tsx, hero-configurator-graphic.tsx, step-strip.tsx, messages-quickstart.tsx, app/page.tsx, app/messages/page.tsx, configurator-section.tsx, top-nav.tsx, bottom-email-capture.tsx, final-cta.tsx, how-it-works.tsx, paperwork.tsx, ai-section.tsx, pricing.tsx; **deleted** components/home/category-rotor.tsx | Decisions added: 0 (all copy/visual — no product alternative resolved) | External actions: branch push per commit, Vercel preview per commit, **production deploy on the merge push**.

**Status: 🟢 `feat/post-launch-polish` MERGED to `main` (go-live), `abef727` — production deploy on push.** Final quality gate on the branch passed before merge (`tsc --noEmit` clean, `eslint .` clean, `npm run build` succeeded on a fresh `.next`). **Confirm the Vercel production build lands green at relaykit.ai before treating the polish as live.** Ran on the relaxed per-commit cadence (trivial/visually-verifiable auto-shipped after build+push; `.pm-review.md` rounds for the copy work + the cumulative pre-merge review).

---

## What shipped this session (themes)

- **Hero rebuilt (the bulk of the session).** New H1 "The easiest way to add text messaging to your app." (natural wrap, `text-5xl sm:text-6xl lg:text-[64px]`, `leading-[0.95]`); subhead "Ready-made texts that cut no-shows, support tickets, and missed codes." with a sm+ `<br>`; **CategoryRotor deleted** (file removed). The hero eyebrow was later removed entirely (see eyebrow theme) with the H1 at `mt-8`.
- **Hero mock = self-contained, INTERACTIVE, state-isolated card** (`hero-configurator-graphic.tsx`). No longer the "static" graphic the prior handoff/REPO_INDEX describe: it owns local view state only (active category + manual flag), **no configurator/elig hooks, no localStorage**. Fixed `h-[480px] overflow-hidden rounded-[22px]` clips itself (3rd message card cut at the bottom; no gradient/mask). 9-category 188px rail (real `aria-pressed` buttons), 500px messages column cropped at the card's right edge (deliberate peek), `size-5` checkboxes, true configurator surfaces (dropped the `surface-flat` flatten — rail `bg-surface-inset`, cards `bg-surface-raised`, matching the real tool). **6s auto-advance** through the rail with a ~280ms fade swap; click → manual mode (stops auto-advance); `prefers-reduced-motion` disables both. A warm-gray ambient glow (`rgb(149 134 117)`, not gold) sits behind it.
- **Responsive: the mock never hides.** Side-by-side `min-[940px]:grid-cols-[minmax(400px,1fr)_minmax(360px,420px)]`, gutter `gap-x-12` → `gap-x-20` at `min-[1100px]`; below 940px it **stacks** (card centered, `max-w-[560px]`) to mobile. The mock top aligns to the H1's first-line cap height (`min-[940px]:pt-10` — replaced the fixed 180px-below-appbar offset).
- **Headings wave.** Recognition H2 → "The rules show up after you start building." (+ a subhead); how-it-works H2 → "What it takes to go live." / subhead "We handle the carrier side."; paperwork card titles → "Registration handled" / "Messages compliant" / "Opt-ins & opt-outs covered".
- **Eyebrow "THE ___" system + hero eyebrow removed.** All 9 section eyebrows: The problem / The process / The messages / The paperwork / The build / The test / The price / The start / The steps. Hero eyebrow removed entirely. (Source strings sentence-case; `Eyebrow` renders uppercase.)
- **Recognition → single full-width requirements accordion.** Deleted the "The feature" card (and the `EXPECTED` array); "The requirements" is now one full-width card. Native `<details name="requirements">` exclusive accordion (zero JS, one open at a time), chevron rotates via `group-open`. Six **sourced expander bodies** (registration / carrier review / consent / compliance website / STOP+HELP / message restrictions), each split into two paragraphs (requirement, then the RelayKit sentence) capped at `max-w-[460px]`. The in-card "The requirements" mono label was removed (section H2 carries it). Copy is canon-clean — "a few days" for RelayKit approval (D-215), no guaranteed-approval/compliance phrasing.
- **Configurator retitle.** The real tool header "Write your messages" → **"Choose your messages"** (one canonical source in `configurator-section.tsx`; renders on the home embed + `/messages`; hero mock matches).
- **`/messages` quick-start carded.** Added a `variant` prop to the shared `StepStrip` — `open` (home How-it-works, unchanged) vs `card` (each step boxed, `gap-7`/28px gutter). Quick-start H2 → "It takes just a few minutes."
- **`/messages` misc.** Hero H1 now all white (dropped the `text-text-headline-muted` span on "Ready to copy."); waitlist inline link made unbreakable (`whitespace-nowrap`) + subhead `max-w-[520px]`; `#join` waitlist section + the now/later body in lockstep with the home final-CTA.
- **Nav logo** `text-base` → `text-lg` (both nav instances).

## ⚠ Doc reconciliation owed — NOW DUE (post-merge; the polish is on `main`)

Both pre-merge blockers are cleared — the final-CTA copy landed (`26b9b00` / refined to an inline gold `/messages` link + dropped redundant button in `6532c53`), and the cumulative PM review passed (merge `abef727`). What remains is the **deferred doc-reconciliation pass, now the next task** — the home spec/index describe pre-polish reality and the merge made them stale on `main`:

- **PROTOTYPE_SPEC home-spec pass** — the §"Home page (`/`)" section still describes pre-polish reality. Needs: the hero rework (new H1 "The easiest way to add text messaging to your app.", **no eyebrow**, **interactive self-clipping mock** `hero-configurator-graphic.tsx` replacing the old `PhoneMock`/`category-rotor.tsx` rotor — the standing "Hero rotor note" should be **removed**, the rotor file is deleted, responsive stack), the eyebrow "THE ___" series, the Recognition **full-width requirements accordion** + sourced expander copy (replacing the two-card "expected days / got weeks" model), the **"Choose your messages"** retitle, the **carded** `/messages` quick-start (`StepStrip` `variant="card"`), and the final-CTA simplification (inline gold `/messages` link, no PrimaryCta).
- **REPO_INDEX "marketing home (v10)" rows** — `hero.tsx` (still describes the old "Easier" two-tone H1 + `CategoryRotor` + static graphic), `app/page.tsx` (Recognition/eyebrow), `step-strip.tsx` ("render identically" — now has a `card` variant), `how-it-works.tsx`, `final-cta.tsx` are stale and need bringing to shipped reality.
- **D-429 still stale** (carried from design-refresh) — the `/messages` quick-start is a permanent, now *carded* section, not the dismissible four-step strip D-429 records; the ledger is **PM-gated** (amend/supersede is PM's call), and PROTOTYPE_SPEC §"Quick-start strip" reconciles once PM rules.

## Visual tunables awaiting Joel's eyeball (preview)

- **Mock-to-H1 cap-height alignment** (`hero.tsx min-[940px]:pt-10`) — verify at 1440/1200 the card top and H1 first line read as one line; derived, not measured.
- **Hero H1 top spacing** (`mt-8`, replacing the removed eyebrow block).
- **`/messages` waitlist link landing** (`max-w-[520px]`; the link can't split now via `whitespace-nowrap` — width just shapes where it lands).
- **Full-width requirements rows** — chevron now sits far-right of a wide row; confirm it reads intentional.

## Carry-forwards (still open from prior handoff)

- **`globals.css` light→dark dead-token collapse** — deferred per D-430.
- **Blog `we-put-our-best-tool-in-front-of-everyone.mdx`** still uses user-facing "configurator" (5×) — needs a voice rewrite (`relaykit-writing-prose`), not find-replace.
- **Canonize the relaxed per-commit PM-review rule** in PM_PROJECT_INSTRUCTIONS + CLAUDE.md.
- **Pre-launch head-scratchers:** `workspace_name` vs `business_name` token inconsistency; "a few days" (D-215) vs the 10–15 business-day reality; `ai-section.tsx` code date "Fri, Jun 6" is a Saturday (→ Jun 5); "Acme Engineering" vs "Acme" in `variables-callout.tsx`.
- **Pre-existing:** delete `joel+golive-smoke@gmail.com` (`interest_tag = golive-smoke-test`) from `early_access_subscribers` (Joel); OG unfurl cache-bust (`/?v=2`) verify; TFN-path-killed MASTER_PLAN canon close; Claude.ai UI custom-instructions paste-sync.

## Branch state

**`feat/post-launch-polish` MERGED to `main`** via no-ff merge `abef727` (branch HEAD `6532c53`). `main` is the live production branch. `feat/post-launch-polish` + `feat/design-refresh` + `feat/marketing-home` are all merged-not-deleted (optional cleanup). No other active branches.

## Untracked carryover — DO NOT COMMIT
- Only `.claude/settings.local.json` remains untracked.

## Next steps
- **Confirm the production deploy** — watch the Vercel build off the `main` push (`abef727`) land green at relaykit.ai; the polish is "live" only once it does.
- **Doc-reconciliation pass (now due, see above)** — the PROTOTYPE_SPEC home-spec pass + REPO_INDEX "marketing home" rows + the PM-gated D-429 staleness call. This is the immediate next task now that the polish is on `main`.
- **Phase 2 — Session B (Sinch outbound delivery)** per MASTER_PLAN remains the parallel substantive product pickup.
