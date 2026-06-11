# CC_HANDOFF — post-launch polish: hero rework + home/messages refinement (branch `feat/post-launch-polish`, Session 130, 2026-06-11)

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.
>
> **NOTE — BRANCH copy.** Reflects `feat/post-launch-polish` (UNMERGED, on Vercel preview). `main` is live in production — the **design-refresh go-live merge happened earlier this session** (`feat/design-refresh` → `main`, `73e2878`); the prior handoff covered that. This session then branched `feat/post-launch-polish` off `main` and did the polish below.

**Session metrics:** Commits: 21 on `feat/post-launch-polish` (`f1309e3` → `26b9b00`) + this close-out | Files modified: hero.tsx, hero-configurator-graphic.tsx, step-strip.tsx, messages-quickstart.tsx, app/page.tsx, app/messages/page.tsx, configurator-section.tsx, top-nav.tsx, bottom-email-capture.tsx, final-cta.tsx, how-it-works.tsx, paperwork.tsx, ai-section.tsx, pricing.tsx; **deleted** components/home/category-rotor.tsx | Decisions added: 0 (all copy/visual — no product alternative resolved) | External actions: branch push per commit, Vercel preview per commit; **no merge**.

**Status: 🟡 `feat/post-launch-polish` UNMERGED, on Vercel preview — awaiting cumulative PM review (gg) of the full branch diff before merge to `main`.** HEAD `26b9b00`, in sync with `origin/feat/post-launch-polish`. Branched from `main` after the go-live merge (which is live at relaykit.ai). Ran on the relaxed per-commit cadence (trivial/visually-verifiable auto-shipped after build+push; a couple of `.pm-review.md` rounds early on).

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

## ⚠ Pending before merge to `main`

1. **Cumulative PM review (gg) of the full branch diff** — 20 commits accrued on the preview without a single bundled review. PM should review `git diff main...feat/post-launch-polish` before merge.
2. ~~**Final-CTA body copy revision**~~ — **LANDED** (`26b9b00`, 2026-06-11). The body now reads "You can start with the messages today. When sending launches, your AI tool wires up the integration, you test on real phones, and registration and opt-outs stay handled behind the scenes." — rounds out the prior compliance-only second sentence with the AI-build-spec + real-phone-testing virtues. Applied to **`components/home/final-cta.tsx` AND `app/messages/page.tsx` `#join` in lockstep** (verbatim pair, both verified identical). Awaiting Joel's preview eyeball, but no longer a merge blocker.

## Doc reconciliation owed at merge (deferred — NOT done this session)

- **PROTOTYPE_SPEC** — already-pending home-spec reconciliation (from design-refresh) is now **bigger**: the hero rework (new H1, no eyebrow, interactive self-clipping mock, responsive stack), the eyebrow "THE ___" series, the Recognition full-width accordion + expander copy, the "Choose your messages" retitle, and the carded `/messages` quick-start all need to land in the spec.
- **REPO_INDEX "marketing home (v10)" rows** — `hero.tsx` (still describes the old "Easier" two-tone H1 + `CategoryRotor` + static graphic), `app/page.tsx` (Recognition/eyebrow), `step-strip.tsx` ("render identically" — now has a `card` variant), `how-it-works.tsx` are stale. This close-out only removed the deleted **`category-rotor.tsx`** row (file-removal touch); the rest is a merge-time pass.
- **D-429 still stale** (carried from design-refresh) — the `/messages` quick-start is a permanent section, now also *carded*; ledger is PM-gated.

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

**`feat/post-launch-polish` UNMERGED** (HEAD `4de442c`, pushed, on preview). Branched from `main` after the go-live merge. `main` is the live production branch (design-refresh merged this session, `73e2878`). `feat/design-refresh` + `feat/marketing-home` are merged-not-deleted (optional cleanup). No other active branches.

## Untracked carryover — DO NOT COMMIT
- Only `.claude/settings.local.json` remains untracked.

## Next steps
- **PM cumulative review (gg)** of `feat/post-launch-polish` → resolve the final-CTA body copy (Joel picks; apply to final-cta.tsx + `/messages` `#join` together) → merge to `main` → at merge, do the PROTOTYPE_SPEC + REPO_INDEX "marketing home" reconciliation pass.
- **Phase 2 — Session B (Sinch outbound delivery)** per MASTER_PLAN remains the parallel substantive product pickup.
