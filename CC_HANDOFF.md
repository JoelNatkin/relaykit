# CC_HANDOFF — design-refresh increment 1 (branch `feat/design-refresh`, 2026-06-09)

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.
>
> **NOTE — this is the BRANCH copy.** It reflects `feat/design-refresh` state; the `main` copy is separately current (refreshed `5d169e0`). The two reconcile when this branch merges.

**Session metrics:** Commits: 2 on `feat/design-refresh` (`34f3b26` increment 1 + this handoff refresh) | Files modified: 8 (globals.css + 6 configurator components + this CC_HANDOFF) | Decisions added: 0 (warm-palette shift is provisionally not a D-number — extends D-405) | External actions: branch push ×2, Vercel preview building

**Status: 🟡 `feat/design-refresh` is UNMERGED, on Vercel preview, awaiting Joel's crit.** Branch HEAD `34f3b26`. Branched from `main` at `068c2e5`; **`main` has since advanced to `2e8624d`** (today's two methodology commits: `23f5be5` CLAUDE.md per-commit-handoff rule, `2e8624d` PM_PROJECT_INSTRUCTIONS PM-side handoff channel) **plus the `main` CC_HANDOFF refresh `5d169e0`** — none of which are on this branch yet; they reconcile at merge. `main` itself is live in production at relaykit.ai.

---

## On the branch — design-refresh increment 1 (`34f3b26`)

Visual + one presentation-state only; **elig / cascade / AIRGAP untouched** (verified: no `lib/constraints/*`, `use-elig-state`, or `use-configurator-state` in the diff).

- **Tokens (`globals.css`):** new `--color-surface-*` **4-tier warm-neutral depth ladder**. Dark values: **page `#16130F` < card `#1D1914` < inset `#221D17` < raised `#28221B`**; light aliases the brand scale. No chromatic accent (extends D-405). `surface-page` is the OPEN TUNING VALUE (one line, commented).
- **Configurator restyle (`configurator-section.tsx` + 5 components):** the whole tool wrapped in **one contained card** (stronger outer border + soft shadow, ~22px radius) with a header row ("Write your messages" + a quiet "Free · no account" pill) and divider; **4 depth tiers** (page < card < inset panels < message cards); **message cards are the lifted `surface-raised` + shadow objects**; the **setup zone** (business name + industry + sub-industry) moved into a quiet **inset block** that **collapses to a "[Business] · [specialty]" summary + Edit** via a local `setupEditing` flag (presentation-only — summary derived from read-only `findVertical`/`findSubVertical`; `relaykit_elig` shape, lazy-create, and the cascade untouched).

## Open tune items — NEXT session's work (awaiting Joel's preview crit)

1. **Page-bg warmth** — tune `--color-surface-page` (currently `#16130F`); Joel's unsure if too dark/cool. One-line change.
2. **Home peek** — the configurator is a shared component, so the new contained card renders **inside the home's clipped peek window** (`/`) — may look cramped/double-framed. Eyeball + decide.
3. **Rules/verdict card** — currently **collapses WITH the setup**; **PM lean is to keep it persistent** (it's the D-422 eligibility surface). Likely rework to render the rules card outside the collapse.

## Pending at branch close-out

- **PROTOTYPE_SPEC** — add the surface-token ladder + configurator-restyle note (extends D-405; **not a D-number** unless PM locks the warm direction as a stance). Deferred to close-out so it describes the stabilized result.

## Untracked carryover — DO NOT COMMIT

Only `.claude/settings.local.json` remains untracked.

## Carried cleanup (Joel)

The go-live smoke-test row in `early_access_subscribers` — `joel+golive-smoke@gmail.com`, `interest_tag` = `golive-smoke-test` — still pending deletion.

## Next steps

- **Resume the configurator crit on the preview** → tune per Joel's feedback (page-bg first, then home-peek framing + rules-card persistence) → **merge `feat/design-refresh` to `main`** (picks up `main`'s `5d169e0`/`23f5be5`/`2e8624d`) → close-out (PROTOTYPE_SPEC note + REPO_INDEX surface-token inventory).
- Later increments on this branch: **hero + other home elements** bring the new surface tokens forward.
- **Phase 2 — Session B (Sinch outbound delivery)** per MASTER_PLAN remains the parallel substantive product pickup.
