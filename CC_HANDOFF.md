# CC_HANDOFF — Session 100 — Order updates authoring (first WorkflowCategory)

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.

**Date:** 2026-05-20
**Branches:** `main` only — all session work merged. No unmerged feature branches local or remote.

`Commits: 3 | Files modified: 5 | Decisions added: 0 | External actions: ~5 (branch push + main push + remote branch delete + Vercel auto-deploys)`

---

## Session character

A focused Wave 2 message-library session — author the third corpus category, Order updates, end-to-end. First `WorkflowCategory` authored (uses ordered `stages`, not `subs`). Plan-mode planning surfaced one substantive question — three Friendly variants had em dashes, which are not in the basic GSM-7 alphabet and would force UCS-2 encoding (collapsing the single-segment limit from 160 to 70). PM ruling: replace every " — " with ", "; raise the corpus-wide ASCII-only authoring rule as a hygiene gotcha (not a D-number). charCount discipline carried over cleanly from Session 99 — pre-write verification script (`/tmp/verify-charcounts.mjs`) ran 21/21 OK on the planned bodies, then again after the file was written via regex re-extraction.

## Completed work (chronological)

- **Order updates authored** (`b2a756e` + merge `76b7dfb`) — `marketing-site/lib/message-library/order-updates.ts` overwritten from stub to populated category: 7 stages (Order confirmation → Processing → Shipping confirmation → Out for delivery → Delivered → Return initiated → Refund processed), 7 messages, 21 tone variants (3 tones each), 7-variable catalog (`workspace_name` from shared + six SDK-payload tokens: `order_number`, `tracking_link`, `estimated_delivery`, `return_link`, `refund_amount`, `card_type`), 6-rule compliance block. `triggerCue` strings on each Stage match `audits/research/2026-05-16/order-updates.md` §2 verbatim. All 21 bodies ASCII-only — three Friendly variants (Stages 1, 2, 4) had em dashes in PM's spec, replaced with comma-space per PM ruling so the message stays in a single GSM-7 segment. charCount max 137/160 at worst-case `budgetChars` substitution. Branched `feat/order-updates-authoring` off `main` HEAD, written, PM-reviewed via `.pm-review.md`, pushed to origin, merged `--no-ff` to main, branch deleted local + remote.

## In-progress work

None. Clean state.

## Quality checks

`tsc --noEmit` clean and `eslint` clean on `marketing-site/` at the authoring commit and at this close-out HEAD. `/tmp/verify-charcounts.mjs` (transient) reports all 21 variants at 0 mismatches with 0 GSM-7 alphabet violations and max 137/160. A second regex-based re-extraction parsed `(body, charCount)` pairs directly from the written `.ts` file and re-ran the same substitution math — also 0 mismatches.

## Decisions

**No D-numbers added this session.** Order updates authoring is execution against pre-resolved decisions (D-393 no credentials in body, D-394 transactional split, D-398 workspace_name sender frame, D-399 no promotional content, D-402 single GSM-7 segment). PM explicit ruling on the corpus-wide ASCII-only authoring rule: **not a D-number** — it's a hygiene rule, not a resolved alternative. Captured below as a gotcha for next session.

Final D-numbers: 322 active, latest D-407. Archive unchanged (D-01–D-83).

## Gotchas for next session

1. **Corpus-wide ASCII-only authoring rule (new, this session).** Message bodies are ASCII-only — no em dashes (`—` U+2014), no en dashes (`–` U+2013), no smart/curly quotes (`'` `'` `"` `"`), no ellipsis character (`…`), and no other non-GSM-7-basic characters. Any one of them forces UCS-2 encoding and collapses the single-segment limit from 160 to 70 chars, breaking D-402. The verify-charcounts script (`/tmp/verify-charcounts.mjs`) now reports a per-variant GSM-7 column and exits non-zero on any violation — reuse the pattern for any future category-authoring session. The character set Verification (Session 94) and Account events (Session 99) used was ASCII-only by construction; this session was the first to deliberately catch a violation before commit.
2. **charCount worst-case discipline (carried from Session 99 gotcha #1, still load-bearing).** `MessageVariant.charCount` must be computed against `budgetChars`, not `example` length — substitute every `{{token}}` with a placeholder of `budgetChars` characters and count. A five-line node script catches drift. This session's authoring ran the verification before commit AND again after the file was written via regex re-extraction — 0/21 mismatches both passes. Reuse the pattern.
3. **Stage `name` vs message `name` diverge in three Order updates stages — watch item for the configurator IA pass.** Three stages carry a stage-name / message-name pair that aren't byte-identical: Stage "Order confirmation" → Message "Order confirmed"; Stage "Shipping confirmation" → Message "Order shipped"; Stage "Return initiated" → Message "Return started". Not a defect — the stage is the lifecycle label (it names a moment in the order arc), the message is the artifact (it names the SMS template the visitor sees and copies). The right-column message cards render the message name; the left-column stage rows render the stage name. The configurator's right column is also a flat message column today — every message card sits in one column with no stage/category group headings, so the visitor can't see the stage→message mapping at a glance. Both observations land in the same forward-work bucket: the configurator IA reconciliation pass needs to decide whether stage rows and message cards should converge on a single label, render in a grouped layout that surfaces the relationship, or stay independent with explicit cross-referencing. No action this session.
4. **`DEFAULT_CHECKED_SUBS` in `use-configurator-state.ts:22` only seeds Verification (carry-forward from Session 99 gotcha #3, still accurate).** Account events and now Order updates both ship authored but unchecked at the category level, and toggling either on does not auto-check any sub/stage. The line-22 comment ("the only authored category") is now more clearly stale after Order updates; a one-line update in the next configurator-touching session would resolve it.
5. **Workflow categories render through `categorySubs(category)`.** The configurator iterates `categorySubs(category)` in `configurator-section.tsx:432` — for a `WorkflowCategory`, the barrel's `categorySubs` returns the stages array; for a `DiscreteCategory`, it returns the subs array. The categories panel UI is identical (same row-click + `?`-icon tooltip pattern); only the corpus shape differs. If a future change ever needs to render stages differently from subs (e.g., showing `triggerCue` text or rendering an ordered numbering), `categorySubs` is the seam where the distinction would land.

## Files modified this session

**Code:**
- `marketing-site/lib/message-library/order-updates.ts` (stub → fully authored; 7 stages / 21 variants / 7-variable catalog / 6-rule compliance block)

**Docs (close-out edits, this commit):**
- `PROTOTYPE_SPEC.md` (Configurator Section: "Authored vs Coming soon" updated to 3 authored / 6 unauthored; categories list bullet updated to note stages-vs-subs UI parity; new Order updates stages bullet with the workflow-shape framing + six new variables described; "Last updated" bumped to May 20, 2026)
- `docs/PRODUCT_SUMMARY.md` (§3 configurator description: Verification + Account events + Order updates live, 6 categories Coming soon; "Last reviewed" stays 2026-05-20)
- `REPO_INDEX.md` (branch state rewritten for Session 100; `Last touched` columns updated on PROTOTYPE_SPEC, PRODUCT_SUMMARY, CC_HANDOFF; message-library section header bumped to include Session 100, new `order-updates.ts` row added, "remaining stubs" count 7→6)
- `CC_HANDOFF.md` (this file)

## Unmerged branches

None.

## Retirement sweep / drift watch

Skipped — mid-phase, Phase 1 (Sinch Proving Ground) still active per MASTER_PLAN.md §"Active focus", no phase boundary crossed this session.

## Carry-forward open items

- Tooltip touch-event handling (Session 98 carry-forward).
- Tooltip `aria-describedby` wiring (Session 98 carry-forward).
- Tooltip viewport-edge positioning at extreme breakpoints (Session 98 carry-forward).
- D-378's stale parenthetical (Session 98 carry-forward).
- D-380 drift carry-over — status unverified this session.
- PostHog vs Plausible/Fathom reconciliation in `docs/MARKETING_STRATEGY.md` (Session 97 carry-forward).
- `docs/POST_TOPICS.md` still untracked (long-running carry-forward).
- `use-configurator-state.ts:22` comment ("the only authored category") still stale after this session — trivial one-line fix at next configurator-touching work (Session 99 carry-forward; reinforced this session).
- Authored-but-unchecked category-default behavior — Account events and Order updates both ship authored but with no default-checked sub/stage. Whether a category that's authored should auto-suggest a primary sub/stage when the visitor enables it is a UX call still pending (Session 99 carry-forward; reinforced this session — now affects two categories).
- **New this session:** stage `name` vs message `name` divergence in three Order updates stages, alongside the flat-message-column concern — both are configurator IA reconciliation work (see gotcha #3 above).

## Suggested next session

1. **Author the next message-library category.** With Verification (Session 94), Account events (Session 99), and Order updates (Session 100) shipped, the remaining 6 are Marketing, Appointments, Customer support, Team alerts, Community, Waitlist. The choice is PM's; the research files for all 6 are populated at `audits/research/2026-05-16/[category].md` with §6 resolved. Pre-authoring checklist for any pick: read the research file, confirm the category's classification (discrete vs workflow vs hybrid) in the stub, settle the variable catalog (cross-corpus + category-specific), draft the compliance rules, then author subs/stages/messages/variants honoring the budgetChars-based charCount discipline (gotcha #2) AND the new corpus-wide ASCII-only rule (gotcha #1). Marketing is the obvious next pick — it's the second campaign-registration surface MASTER_PLAN names as co-equal at launch.
2. **First Indie Hackers post.** Still on the pre-launch checklist per MASTER_PLAN.md §"Pre-launch checklist." Carry-forward from Sessions 97 + 98 + 99.
3. **Configurator IA reconciliation pass.** With Order updates landing, the gap between stage names and message names — alongside the flat-message-column UI (every message in one column, no group headings) — is more visible than it was with Verification and Account events alone. A focused design pass (lay out the right column with stage/sub group headings, or unify the labeling, or both) is a reasonable next surface if PM wants to address it before authoring more categories.
