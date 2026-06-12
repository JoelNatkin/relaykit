# CC_HANDOFF — Session 131 close-out: all marketing branches merged & live; D-431 legal remediation (2026-06-11)

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.

**Session metrics:** Commits: ~14 across `main` + three branches (final-CTA copy/cleanup, configurator H2 ×2, `feat/hero-mock-tweaks` 2 + merge, `feat/legal-exposure` 5 + merge, plus the post-launch-polish go-live merge `abef727`) + this close-out | Decisions added: 1 (**D-431**) | External actions: 4 `--no-ff` merges to `main`, 4 green Vercel production deploys, branch pushes per commit. **`main` HEAD `b73f59d` — fully caught up, live at relaykit.ai.**

**Status: 🟢 All marketing work merged to `main` and live in production. No open feature branches.** Mid-phase close-out (active phase stays Phase 2 — Session B; marketing is artifacts, not a phase → no retirement sweep / drift watch).

---

## What landed this session (all live on `main`)

1. **`feat/post-launch-polish` → `main` (`abef727`).** Hero rebuilt (interactive self-clipping mock `hero-configurator-graphic.tsx`; **CategoryRotor deleted**), eyebrow "THE ___" system (hero eyebrow removed), Recognition **full-width requirements accordion** (sourced expander copy), **"Choose your messages"** retitle, **carded** `/messages` quick-start (`StepStrip variant="card"`), simplified final-CTA (inline gold `/messages` link, dropped the redundant PrimaryCta + caption). Final-CTA body rounded out to "build + test virtues, not just compliance" (landed pre-merge in lockstep across `final-cta.tsx` + `/messages` `#join`).
2. **`main` copy tweaks** (direct, copy-only): configurator "The messages" section H2 → **"Messages for every job."** + subhead.
3. **`feat/legal-exposure` → `main` (`473a626`).** **D-431** — site-wide browsewrap footer line + Terms "Website"/"Authoring Tool"/"Visitor" defs (folded into "Service") + acceptance-by-use + new Terms §4A (+ §11.5 survival) + AUP scope note + Privacy §1.6; "Last Updated" → June 11 on all three legal docs. Executes LEGAL_EXPOSURE_REMEDIATION §3.2 + §3.4–§3.6. **Supersedes none** (extends D-424). Verified live: `/terms` §4A + June 11 date + footer browsewrap render.
4. **`feat/hero-mock-tweaks` → `main` (`b73f59d`).** Hero mock **4s** auto-rotate (was 6s; comments fixed) + a 20px pause/play toggle at the bottom of the rail (`paused` state, gated behind `!reduced`). Verified live (toggle `aria-label` in served HTML).
5. **Exploration promoted/retired.** `legal-exposure-remediation` → **Status: promoted (D-424 + D-431)**; §3.3 resolved **no-action** (Joel's call — keep the present-tense "generates and hosts a compliance site" / compliance claims; they'll be true at launch and read as forthcoming within the "Sending arrives Summer 2026" frame; no narrowing, no MD-number). Row removed from REPO_INDEX Active explorations (5→4); file retained in `/explorations/` as historical record.

## ⚠ Next session — TOP item (focused task, not a tail-of-close-out job)

**PROTOTYPE_SPEC + REPO_INDEX "marketing home (v10)" doc-reconciliation — now DUE** (both contributing branches merged). The home spec/index still describe **pre-polish reality** and are stale on `main`:
- **PROTOTYPE_SPEC §"Home page (`/`)"** — needs: new hero (H1 "The easiest way to add text messaging to your app.", **no eyebrow**, **interactive self-clipping mock** `hero-configurator-graphic.tsx` replacing the old `PhoneMock`/rotor — the standing **"Hero rotor note" should be removed**, `category-rotor.tsx` is deleted), eyebrow "THE ___" series, Recognition **full-width requirements accordion** (replacing the two-card expected/got model) + sourced expander copy, **"Choose your messages"** retitle, **carded** `/messages` quick-start, final-CTA simplification (inline gold link, no PrimaryCta), and the "Messages for every job." configurator H2.
- **REPO_INDEX "marketing home (v10)" rows** — `hero.tsx`, `app/page.tsx`, `step-strip.tsx` ("render identically" → now has a `card` variant), `how-it-works.tsx`, `final-cta.tsx` all stale → bring to shipped reality.

## PM-owed (do NOT resolve in the ledger)

- **D-429 is stale** — records the `/messages` quick-start as a *dismissible four-step* strip; it's now a *permanent, carded* section. Ledger is PM-gated — PM decides amend/supersede, then PROTOTYPE_SPEC §"Quick-start strip" reconciles. Carry as PM-owed; CC made no ledger change.

## Carry-forwards (standard backlog)

- **`globals.css` light→dark dead-token collapse** — deferred per D-430 (light token values still present as dead base).
- **Blog `we-put-our-best-tool-in-front-of-everyone.mdx`** still uses user-facing "configurator" (5×, as a named concept) — needs a voice rewrite (`relaykit-writing-prose`), not find-replace.
- **Canonize the relaxed per-commit PM-review rule** in PM_PROJECT_INSTRUCTIONS + CLAUDE.md (ran on it informally all session).
- **Pre-launch head-scratchers:** `workspace_name` vs `business_name` token inconsistency; "a few days" (D-215) vs the 10–15 business-day reality; `ai-section.tsx` code date "Fri, Jun 6" is a Saturday (→ Jun 5); "Acme Engineering" vs "Acme" in `variables-callout.tsx`.
- **Pre-existing:** delete `joel+golive-smoke@gmail.com` (`interest_tag = golive-smoke-test`) from `early_access_subscribers` (Joel); OG unfurl cache-bust (`/?v=2`) verify; TFN-path-killed MASTER_PLAN canon close; Claude.ai UI custom-instructions paste-sync.

## Branch state

**No open feature branches.** `main` HEAD `b73f59d`, live. The five recent marketing branches (`feat/design-refresh`, `feat/post-launch-polish`, `feat/legal-exposure`, `feat/hero-mock-tweaks`, `feat/marketing-home`) are all merged-not-deleted (optional cleanup).

## Untracked carryover — DO NOT COMMIT
- Only `.claude/settings.local.json` remains untracked.

## Next steps
- **TOP: PROTOTYPE_SPEC + REPO_INDEX marketing-home reconciliation** (focused task above).
- Resolve **D-429** staleness with PM (PM-gated).
- **Phase 2 — Session B (Sinch outbound delivery)** per MASTER_PLAN remains the substantive product pickup.
