# CC_HANDOFF — Session 132 close-out: home-spec doc reconciliation + D-432 (2026-06-12)

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.

**Session metrics:** Commits: 1 (doc-reconciliation + D-432, straight to `main`) | Files modified: 4 (DECISIONS.md, PROTOTYPE_SPEC.md, REPO_INDEX.md, CC_HANDOFF.md) | Decisions added: 1 (**D-432**) | External actions: 0. **Doc-only session** (no `tsc`/`eslint` — no code touched). Mid-phase close-out (active phase stays Phase 2 — Session B; no retirement sweep / drift watch).

**Status: 🟢 The Sessions 129–131 "owed" home-spec reconciliation is DONE.** Read the live components as source of truth, not the old handoff narratives. Held for PM `gg` review before push (see `.pm-review.md`).

---

## What landed this session (one commit, on `main`)

The owed doc-reconciliation from Sessions 129–131 — bringing the home + `/messages` specs/index current with what's live on `main`, plus the ledger record that licenses the quick-start change.

1. **D-432 recorded** (DECISIONS.md) — `/messages` quick-start is a **permanent three-step home-style section** rendered by the shared `StepStrip` (`variant="card"`), not a dismissible card. **Supersedes D-429** — D-429 marked `⚠ Superseded by D-432` in the same commit. (Resolves the PM-gated D-429 staleness flag carried from Sessions 129–131.)
2. **PROTOTYPE_SPEC home-spec reconciliation** — "Home page (`/`)" rewritten to live reality: no-eyebrow hero + interactive `HeroConfiguratorGraphic` (state-isolated, 4s auto-advance, pausable); the **"THE ___" eyebrow system**; new **StatusBand** section; Recognition **full-width requirements accordion**; **three-step** How-it-works; "Messages for every job." configurator H2; simplified final-CTA. The standing **"Hero rotor note" removed** (`category-rotor.tsx` is deleted). "Configurator tool page — `/messages`" + Quick-start rewritten to the permanent carded `StepStrip` section (D-432) + the `#join` waitlist section; a **shared `StepStrip` subsection** added. Last-updated → June 12.
3. **PROTOTYPE_SPEC top-nav fix** — the stale "theme toggle (left of the links)" line (contradicted the adjacent shipped D-430 paragraph) corrected to dark-only / no toggle. Adjacent-but-unlisted; flagged in `.pm-review.md`.
4. **REPO_INDEX reconciliation** — Meta lead + decision count (347 / D-432) + DECISIONS/PROTOTYPE_SPEC/self doc-rows + the entire **"marketing home (v10)"** section header/intro/rows (`hero.tsx`, `app/page.tsx`, `messages/page.tsx`, `how-it-works.tsx`, `step-strip.tsx`, `final-cta.tsx`, `messages-quickstart.tsx`) brought to shipped reality; the Sessions 129–131 "⚠ Owed next session" warning retired.

## Grep checks (findings only — no doc changes)

- **LVM / "Low Volume Mixed":** zero hits in `DECISIONS.md` / `DECISIONS_ARCHIVE.md`. All `docs/` hits are TCR-**registration** campaign typing in `VERTICAL_TAXONOMY_DRAFT.md` (+ an archived overview) — "Low Volume Mixed" is a carrier use-case category, unrelated to the "Messages for every job" every-category positioning. **No conflict.** PM's no-new-D/MD-number resolution holds (positioning = MASTER_PLAN value #6 + MD-1/MD-9).
- **`relaykit_quickstart_dismissed`:** zero readers anywhere. The live `MessagesQuickstart` is a static server component with no dismiss/localStorage code. **No dead code to remove** — only the docs described the old version (now fixed).

## Carry-forwards (standard backlog)

- **NEW — dead token:** `--color-text-headline-muted` (`marketing-site/app/globals.css` line 78) is now **unconsumed** — the Session 130 polish removed the two-tone H1s it fed. Safe to delete in a future marketing-site code change (out of scope for this doc-only session). Pairs with the `globals.css` light→dark dead-token collapse below.
- **`globals.css` light→dark dead-token collapse** — deferred per D-430 (light token values still present as dead base).
- **Blog `we-put-our-best-tool-in-front-of-everyone.mdx`** still uses user-facing "configurator" (5×, as a named concept) — needs a voice rewrite (`relaykit-writing-prose`), not find-replace.
- **Canonize the relaxed per-commit PM-review rule** in PM_PROJECT_INSTRUCTIONS + CLAUDE.md.
- **Pre-launch head-scratchers:** `workspace_name` vs `business_name` token inconsistency; "a few days" (D-215) vs the 10–15 business-day reality; `ai-section.tsx` code date "Fri, Jun 6" is a Saturday (→ Jun 5); "Acme Engineering" vs "Acme" in `variables-callout.tsx`.
- **Pre-existing:** delete `joel+golive-smoke@gmail.com` (`interest_tag = golive-smoke-test`) from `early_access_subscribers` (Joel); OG unfurl cache-bust (`/?v=2`) verify; TFN-path-killed MASTER_PLAN canon close; Claude.ai UI custom-instructions paste-sync.

## Branch state

**No open feature branches.** This session's doc-reconciliation commit lands on `main` (held for PM `gg` before push). The five recent marketing branches (`feat/design-refresh`, `feat/post-launch-polish`, `feat/legal-exposure`, `feat/hero-mock-tweaks`, `feat/marketing-home`) remain merged-not-deleted (optional cleanup).

## Untracked carryover — DO NOT COMMIT
- Only `.claude/settings.local.json` remains untracked.

## Next steps
- **Phase 2 — Session B (Sinch outbound delivery)** per MASTER_PLAN — the substantive product pickup.
- Optional: delete the dead `--color-text-headline-muted` token + the light→dark dead-token collapse (one small marketing-site code change).
