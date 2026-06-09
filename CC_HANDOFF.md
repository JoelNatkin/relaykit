# CC_HANDOFF — main current + in-flight design-refresh (2026-06-09)

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.

**Status: 🟢 `main` is live in production at relaykit.ai (HEAD `068c2e5`, in sync with origin).** The marketing-home + `/messages` configurator workstream is shipped; since then, post-launch copy/spacing tweaks and two blog posts landed straight to `main`. One design increment is **in flight on a branch (NOT merged)** — see below. No held canon.

---

## Landed on `main` since `b6fcfb5` (2026-06-08, all live)

- `b0996d0` — **variables-callout** top margin `mt-10` → `mt-16` (64px above "See exactly what customers will receive.").
- `7f5d88c` then `b50ac8a` — **recognition card labels** reframed to time-slippage, final copy **"You expected days" / "You got weeks"** (PROTOTYPE_SPEC "Why RelayKit" quote synced).
- `f0aa1ef` + merge `0cf3ece` + `503b2d6` — **blog post merged:** "We Put Our Best Tool in Front of Everyone" (`worldview` / `worldview`).
- `1d5c1a8` + `068c2e5` — **blog post straight to `main`:** "The Feature That Serious Scheduling Apps Eventually Build" (`vertical-patterns` / `demand`, dated 2026-06-04). This **replaced and deleted** the old untracked draft `the-feature-serious-scheduling-apps-build.mdx` — the new slug is `the-feature-that-serious-scheduling-apps-eventually-build.mdx`.
- **REPO_INDEX blog count is now 3 published.**

## In flight — `feat/design-refresh` (branch HEAD `34f3b26`, pushed, NOT merged)

Design-refresh **increment 1** (visual + one presentation-state only; elig/cascade/AIRGAP untouched):
- New **`--color-surface-*` 4-tier warm-neutral depth ladder** in `globals.css`. Dark values: **page `#16130F` (the OPEN TUNING VALUE)** < card `#1D1914` < inset `#221D17` < raised `#28221B`. No chromatic accent (extends D-405). Provisionally not a D-number.
- **Configurator containment/depth restyle:** the whole tool in one lifted card (header row + "Free · no account" pill + divider); 4 legible tiers (page < card < inset panels < message cards as the emphasized `surface-raised` + shadow objects).
- **Collapsing setup zone:** business name + industry + sub-industry in a quiet inset block that collapses to a "[Business] · [specialty]" summary + Edit once a selection completes — a **local `setupEditing` flag, presentation-only**; the elig cascade, `relaykit_elig` shape, lazy-create, and the constraints data/AIRGAP are untouched (summary derived via read-only `findVertical`/`findSubVertical`).

On the Vercel preview, **awaiting Joel's eyeball:** page-bg warmth (tune the one `--color-surface-page` line); the **home-peek framing** (the configurator is a shared component, so the new card renders inside the home's clipped peek window); and whether the **rules/verdict card should stay persistent** rather than collapse with the setup. **PROTOTYPE_SPEC update is pending the branch's close-out** (CC-owned).

## Untracked carryover — DO NOT COMMIT

The **only** remaining untracked carryover is **`.claude/settings.local.json`**. (The old `the-feature-serious-scheduling-apps-build.mdx` draft is no longer a do-not-commit file — it was published under the new slug and the old draft deleted.)

## Branch state

`main` is the live production branch (HEAD `068c2e5`, in sync). **`feat/design-refresh`** in flight (pushed, on preview, unmerged). `feat/marketing-home` is merged but not deleted (optional cleanup). No other active branches.

## Cleanup item (carried — Joel)

The go-live smoke-test row in `early_access_subscribers` — email `joel+golive-smoke@gmail.com`, `ctaSource`/`interest_tag` = `golive-smoke-test` — is still pending deletion.

## Next steps

- **Finish design-refresh increment 1:** tune per Joel's preview feedback (page-bg warmth first) → merge → close-out (PROTOTYPE_SPEC note + REPO_INDEX surface-token inventory; D-number only if PM locks the warm direction).
- Then the **hero + other home elements** are later increments on the design-refresh branch, bringing the new surface tokens forward.
- **Phase 2 — Session B (Sinch outbound delivery)** per MASTER_PLAN remains the parallel substantive product pickup.
