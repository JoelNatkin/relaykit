# CC_HANDOFF — Session 136 close-out: home reorder + new "The numbers" section (2026-06-15)

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.

**Session metrics:** Commits: 1 (branch build + docs, this close-out) on `feat/home-reorder`. Files: 1 new component (`numbers-section.tsx`), `app/page.tsx` (reorder), PROTOTYPE_SPEC, REPO_INDEX, CC_HANDOFF. Decisions added: 0 (no D-number — see below). Quality gates: tsc ✅ / eslint ✅ / clean build ✅. Mid-phase (active phase stays Phase 2 — Session B; marketing-surface work). Branch **unmerged, pushed** — pending PM review of the Vercel preview.

**Status: 🟡 Built + pushed to branch, awaiting PM review.** Production-facing surface → feature branch per CLAUDE.md; do **not** self-merge. PM + Joel review the Vercel preview before merge to `main`.

---

## What landed this session

Reordered the relaykit.ai home to lead with the product and demote the heavy compliance accordion, and added a new email-vs-SMS stat section.

**A) Reorder (`app/page.tsx`, pure JSX move — no section component modified, no `id` renamed):**
New order — Hero · StatusBand · `#configurator` (Messages) · `#variables` · **`#numbers` (NEW)** · `#rules` (Paperwork) · `#how` (How-it-works) · `#build` · `#test` · `#why` (Recognition/"The problem" accordion) · `#pricing` · `#join`. The six-row compliance accordion moved from position 3 → 10 so the page opens on Messages → Variables → Numbers, not friction. Verified the prerendered id sequence matches.

**B) `numbers-section.tsx` (new, presentational-static server component):**
- Eyebrow "The numbers", H2 "People read their texts.", a generic intro (genericized from the dev-tools mockup's account-email framing to any app's messages).
- Four `bg-surface-inset` stat cards, each a Text row over an Email row: **Gets opened** 98% / ~20% · **Time to first open** ~90 sec / ~90 min · **Gets a reply** ~45% / ~6% · **Reaches the inbox** ~98% / ~84%.
- Bars: Text green (`bg-fg-success-primary`), Email red (`bg-fg-error-primary`) — PM-chosen semantic coding. **Length is favorable-performance normalized** (the stronger channel always gets the longer bar; email's slow 90-min time-to-open is a *short* red bar, not a long one), not literal magnitude.
- Sourced footnote citing 2025–26 SMS aggregates + Validity's 2025 deliverability report, with the open-rate measurement caveat.

## Stats / integrity notes (for the next reader)
- Every stat web-verified and sourced per VPP §3. The mockup's **"Lands in spam — up to 85%" was unsupported** (real email spam ≈6.7% global / ≈14% worst-case Microsoft; inbox placement ≈83.5%, Validity 2025) — corrected to the sourced **"Reaches the inbox — ~98% / ~84%."**
- Measured per VPP §4 (email is a channel, not a competitor) — factual comparison, not a combative dunk. The headline stays plain.

## Decision-ledger note
**No D-number.** The reorder is a layout move (PROTOTYPE_SPEC, not a decision); `NumbersSection` was built to the approved plan. One thing surfaced for PM: §4 says competitor *comparison pages* live in docs, not the primary flow — but this is a **channel** justification (email isn't a competitor), so it's a measured fit. If PM wants the "email-vs-SMS comparison belongs on the home" choice recorded, that's a quick D-number — flag it.

## Verification done
- `npx tsc --noEmit` → 0; `npx eslint components/home/numbers-section.tsx app/page.tsx` → 0.
- `rm -rf .next && npm run build` → "✓ Compiled successfully", exit 0.
- Prerendered home id sequence = configurator → variables → numbers → rules → how → build → test → why → pricing → join (Hero/StatusBand have no id). Numbers copy + stats present.

## Carry-forwards (flagged, not done here)
- **Eyeball the Variables → Numbers → Paperwork seam** on the preview (three card-style sections back-to-back) and confirm the demoted accordion reads right at the back.
- **Standing (pre-existing):** dead token `--color-text-headline-muted` (globals.css:78); `globals.css` light→dark dead-token collapse (D-430); blog "configurator" voice rewrite; delete `joel+golive-smoke@gmail.com` from `early_access_subscribers`; OG unfurl cache-bust verify; migration `009_early_access_interest_tag.sql` apply-before-deploy; Claude.ai UI custom-instructions paste-sync.
- **Dev-tools mockup orphaned CSS** (`.vinput`/`.vlabel`/`.vfield`, `.vmsg2`, and now the unused `.vtones`/`.vtone`) — fold-back sweep.
- **Sole-prop `/prototype` + `/src` UI session** (from Session 134) — stale "register you as a sole proprietor" copy + `has_ein="no"` flow-gating + the PRODUCT_SUMMARY §8 line-120 D-18→D-433 citation split; still owed.

## Branch state
**Open: `feat/home-reorder`** (unmerged, pushed). `main` is current at `96a6812` (Session 135's variables work). Do not self-merge — PM reviews the Vercel preview. The five older marketing branches remain merged-not-deleted.

## Untracked carryover — DO NOT COMMIT
- Only `.claude/settings.local.json` remains untracked.

## Next steps
- **PM review of the Vercel preview** for `feat/home-reorder`; merge to `main` on approval.
- **Phase 2 — Session B (Sinch outbound delivery)** per MASTER_PLAN — the substantive product pickup.
