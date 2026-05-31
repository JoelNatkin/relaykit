# CC_HANDOFF — configurator-reframe promotion (IN PROGRESS, paused mid-promotion)

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.

**Status:** Configurator-reframe promotion committed in waves on a feature branch, **NOT pushed, NOT merged**. Paused intentionally — a configurator rework comes first next session, then Wave E close-out. This was a **light close-out**: no D-numbers, no PROTOTYPE_SPEC / PRODUCT_SUMMARY / REPO_INDEX updates (all deferred to Wave E).

---

## Branch state

- Branch **`feat/configurator-reframe`**, cut from **`main@0c48931`** (Session 122 close-out). **Not pushed, not merged. `main` is unchanged.**
- Commit stack (oldest→newest), each an atomic wave with its own `.pm-review.md` approval:
  - `c8675bb` — **Wave A**: front-of-page free-tool reframe (hero strip, appbar strip, bottom inline email capture).
  - `d38c917` — **Wave B**: `ContentRule.customerSummary?` type field + `getRuleSummaries` helper (type-only; no `verticals.ts` edits).
  - `4ba8bcb` — **Wave C**: verdict-card rules-only + Not-yet message-area treatment + 18-export orphan strip.
  - `203ce2d` — **Wave D**: dropdown reframe + configurator integration (**incl. STATE_VERSION 1→2** in use-elig-state).
  - `59f95c6` — **polish**: unify form/modal primary-button token to `bg-bg-brand-cta` + elig-request-modal body copy.
- Mechanic used (clean, doc-trap-safe): branched off main, brought only the UI files per wave via `git checkout sketch/configurator-reframe -- <paths>`; main's Session 122 docs never touched. The original `sketch/configurator-reframe` (tip `a482a73`) remains as the WIP historical record.
- Tree clean on the branch. Working-tree carry-forwards only (NOT part of any wave): `M .claude/settings.json`, `M PM_PROJECT_INSTRUCTIONS.md`, untracked `.agents/`, `AGENTS.md`, `api/node_modules/`, `docs/POST_TOPICS.md`. `.pm-review.md` is gitignored.

## Done (in the branch)

- **Front-of-page reframe** (A): free-tool hero subhead, PRE-LAUNCH tag + pricing line dropped, AI-logo row moved to §3, "Shipping Summer 2026" header, §3–§5 copy refresh, two-column "Join the list." block with inline `BottomEmailCapture` (POST /api/early-access, ctaSource "bottom", no modal), top-nav "Get early access" + `useWaitlist` removed.
- **customerSummary data-layer plumbing** (B): optional `ContentRule.customerSummary?: string` (unpopulated) + `getRuleSummaries(subVerticalSlug)` in `lib/constraints/lookup.ts` + barrel export. `verticals.ts` intentionally NOT hand-edited (connector-generated, D-421).
- **Verdict-card rules-only** (C): `elig-verdict-card` renders only for 🟡 Conditional and only when `getRuleSummaries` is non-empty (suppressed otherwise — no heading-only tease). Empty everywhere this promotion (customerSummary unpopulated). All other tiers render nothing.
- **Not-yet message-area treatment** (C): `elig-empty-state` repurposed — for ⚫/🟠 it occupies the message area with a boundary line ("RelayKit can't send this category yet.") + "Request category" → `elig-request-modal` (new; interest_tag via `eligInterestTag`). Dead not-our-lane/surveillance branches dropped. **NOTE: this treatment is being reworked next session — see PENDING (a).**
- **Orphan strip** (C): removed 18 unused exports from `elig-copy.ts` (each verified 0 external importers repo-wide before removal). Kept the per-category exports, `CONDITIONAL_NOTE_LINE`, `NOT_YET_BOUNDARY_LINE`, `eligInterestTag`, and `NOT_YET_MULTI_TENANT_LINE` (dormant).
- **Dropdown reframe + integration** (D): D1 multi-tenant dropdown removed (now D2 industry + D3 sub-vertical); Not-our-lane sub-verticals disabled + grouped under "Not supported" (data-driven off bucket); D3 `clearable=false`; business-name input moved above the dropdowns; mid-page "Copy messages" CTA now calls `handleCopy` (was `openModal`) + reflects copied state; `STATE_VERSION 1→2` on `relaykit_elig` (clears stale 🔴/multi-tenant picks on load; message customizations under `relaykit_configurator` untouched).
- **Button-token unify** (polish): elig-request-modal Close + `BottomEmailCapture` → `bg-bg-brand-cta` (matches the WaitlistModal submit token + the mid-page CTA). Visually a no-op today (brand-solid and brand-cta resolve identically) — consistency only.
- **openModal orphan grep**: only caller is `early-access-button.tsx`, and `EarlyAccessButton` has **zero importers** (Wave A removed both usages) → the waitlist modal is effectively orphaned (its only opener is dead code). Left mounted; teardown is a post-merge follow-up.
- Quality: marketing-site `tsc --noEmit` + `eslint` clean on every wave. Dev server clean-restart verified `/` renders 200 (the earlier 500 was stale `.next` cache).

## PENDING — do NOT start unprompted

**(a) Configurator rework (NEXT — plan-mode it first).** The current Not-yet treatment is **wrong** and will be reworked:
   - 🟡 Conditional AND 🟠/⚫ Not-yet should show the **full message stream** PLUS a 3-bullet rules card PLUS a bottom line "RelayKit doesn't offer this category. Request it."
   - Only **🔴 Not-our-lane** stays unselectable.
   - This means reworking `isMessageAreaDisabled` to **🔴-only** (today it disables 🟠/⚫/🔴 and replaces the stream with the empty-state — that is the wrong treatment for 🟠/⚫), plus `elig-verdict-card`, `elig-empty-state`, and the message-stream gating in `configurator-section`.
   - Plan-mode this before touching code.

**(b) Rule bullets move rule-level → Sub-vertical-level.** Wave B put `customerSummary` on `ContentRule` (rule-level). The rework wants the bullets as a **Sub-verticals field, exactly 3 per card**; repoint `getRuleSummaries` accordingly. Content is authored in Airtable by PM and **relayed to CC as text — CC never reads Airtable.**

**(c) CPaaS-adjacent rebucketed 🟠→🔴 in Airtable** — needs to flow into `lib/constraints/verticals.ts` on the **next connector regeneration** (PM-run).

**(d) Wave E close-out (ONLY after the rework):** the deferred doc set (PROTOTYPE_SPEC, PRODUCT_SUMMARY, REPO_INDEX) + **two D-numbers** [(1) multi-tenant eligibility path removed from the UI / machinery dormant; (2) customer-facing rule-summary convention — Airtable-authored Sub-vertical field, connector→verticals.ts, rendered by RulesCard, suppressed when absent] (seven gate tests; grep + mark supersessions same commit) + **PRE_LAUNCH_DEVIATIONS.md cleanup** (the reframe removed the PRE-LAUNCH hero tag, pricing line, and the mid-page/bottom/top-nav early-access CTAs — reconcile those entries) + **REPO_INDEX connector-note fix**.

**(e) Migration 009** (`009_early_access_interest_tag.sql`, the nullable `interest_tag` column) — Joel applies via Supabase SQL Editor **before production**, or the elig "Request category" inserts fail. `BottomEmailCapture` (no interestTag) is unaffected.

**(f) Post-merge:** waitlist-modal teardown — `WaitlistProvider` + `WaitlistModal` (layout-mounted) + `EarlyAccessButton` + `waitlist-context` + the configurator `setSummary` publish (all reachable-dead after the reframe).

## Gotcha

- **Keep `multiTenant` in the `EligState` type (dormant)** — `eligInterestTag` reads `state.multiTenant`, so removing it from the type breaks the build. The field/setter/`MultiTenantValue` type/`deriveVerdict` branch are all kept intact with DORMANT comments; no UI sets it now. Retained for a future multi-tenant return.

## Retirement sweep / Drift watch

N/A — mid-phase, light close-out (Phase 2 Session B not yet kicked off).

## Suggested next session

Plan-mode the configurator rework (pending items **a** + **b**). Everything else stays parked until the rework lands; Wave E and merge come after.
