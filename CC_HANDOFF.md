# CC_HANDOFF — Session 100 — Order updates authoring + flat-message-model collapse (D-408)

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.

**Date:** 2026-05-21 (close-out); session work spanned 2026-05-20 → 2026-05-21
**Branches:** `main` only — all session work merged. No unmerged feature branches local or remote.

`Commits: 9 | Files modified: 22 | Decisions added: 1 (D-408) | External actions: ~15 (branch pushes ×2, main pushes ×4, remote branch deletes ×2, Vercel auto-deploys, an aborted local-only branch deleted without push)`

---

## Session character

A two-wave session. Wave 1 authored Order updates as the third message-library category and the corpus's first `WorkflowCategory` (7 stages × 1 message × 3 tone variants, 7-variable catalog, 6-rule compliance). The original Session 100 close-out shipped — and then surfaced a known issue: Order updates was authored but **rendered no message cards on the configurator**. An aborted fix branch (`fix/configurator-renders-workflow-categories`, `cbad0f3`, never pushed) patched the renderer to dispatch across all three classifications; PM judgment: the patch entrenched the wrong model. Wave 2 followed: collapse the type system to a single flat-message shape per **D-408**, dissolving the bug structurally. The flat model has every `Category` carrying a `messages: Message[]` field directly; `Sub`, `Stage`, `Classification`, `DiscreteCategory`, `WorkflowCategory`, and `HybridCategory` are deleted. Sub.description and Stage.description carry verbatim into `Message.description`; Stage.triggerCue carries into `Message.groupNote` with lifecycle position prefixed. Both new fields are documentation-only — nothing renders them this wave; future workspace UX consumes them. Visual verification confirmed all 7 Order updates cards render when checked.

## Completed work (chronological)

- **Order updates authored** (`b2a756e` + merge `76b7dfb`) — `marketing-site/lib/message-library/order-updates.ts` stub → populated as `WorkflowCategory`: 7 stages (Order confirmation → Processing → Shipping confirmation → Out for delivery → Delivered → Return initiated → Refund processed), 7 messages, 21 tone variants, 7-variable catalog (`workspace_name` from shared + six SDK-payload tokens), 6-rule compliance block. triggerCues verbatim from `audits/research/2026-05-16/order-updates.md` §2. All 21 bodies ASCII-only — three Friendly variants had em dashes in PM's spec, replaced with comma-space per PM ruling. Max charCount 137/160 worst-case. Branch pushed, merged `--no-ff`, deleted local + remote.
- **Original Session 100 close-out** (`937558a`) — PROTOTYPE_SPEC, PRODUCT_SUMMARY, REPO_INDEX, CC_HANDOFF reflect 3 authored / 6 unauthored configurator state. Pushed.
- **Known-issue amendment to CC_HANDOFF** (`c4ed576`) — Order updates authored but not rendering on the configurator. Bug fix flagged as immediate next task, same session. Pushed direct to main per the trivial-doc convention.
- **Aborted fix branch** (`cbad0f3`, branch `fix/configurator-renders-workflow-categories`) — patched `categorySubs` to dispatch across all three classifications, added `tooltip?` narrowing in `category-list.tsx`. tsc + eslint clean, runtime-verified via temporary debug route. PM read the diff in `.pm-review.md` and judged it entrenches the wrong model. Branch deleted local; never pushed; commit now unreachable.
- **D-408 + D-400 supersession** (`1992ab4`) — DECISIONS.md: D-408 appended in canonical format; D-400's body gets `⚠ Superseded by D-408: …` annotation in the same commit. Five superficially impacted decisions (D-389/391/392/395/401) flagged in commit body as a future prose-cleanup; bodies left untouched per CLAUDE.md "Over-marking is as bad as under-marking."
- **Code wave: flat-message collapse** (`585de75`) — atomic refactor across 17 files. `types.ts` deletes the three-class union + Sub/Stage; adds `Message.description` + `Message.groupNote` (both documentation-only). All 9 category files reshape from `subs`/`stages` to `messages`. `index.ts` deletes `categorySubs`; `isAuthored` simplifies. State: `SubState` deleted; `CategoryState.subs` → `CategoryState.messages`; `STATE_VERSION` 1→2; `DEFAULT_CHECKED_SUBS` → `DEFAULT_CHECKED_MESSAGES`; `toggleSub` → `toggleMessage`; `setMessageOverride` drops the `subId` parameter. Configurator components rewire to the single `category.messages` loop. PostHog event-property renames: `subs_selected` → `messages_selected`, `configurator_sub_toggled` → `configurator_message_toggled`, `sub_id` → `message_id` (also dropped from `configurator_message_customized`).
- **Docs wave: reflect flat model** (`bfd497e`) — PROTOTYPE_SPEC Configurator Section: three live-category bullets collapse into one shape note ("Per-message checkboxes"); state-version note bumps to 2; "Authored vs Coming soon" framing rewritten. PRODUCT_SUMMARY §3 lists actual Message.names. REPO_INDEX meta + message-library section header rewrite (drop three-classification framing); types.ts row + authored-category rows updated.
- **Wave merge** (`794f32c`) — `feat/flat-message-model` merged `--no-ff` to main, pushed, branch deleted local + remote.
- **Visual verification** — Local-only edit to `DEFAULT_CHECKED_CATEGORY` + `DEFAULT_CHECKED_MESSAGES` pre-checked Order updates and all 7 of its messages. SSR home page returned all 7 message-card titles (each name 2× — once in panel checkbox row, once as card title) and body fragments confirmed `interpolateBody` ran on every card. Edit reverted via `git checkout` before the end-of-task dev-server restart — no extra commit.
- **This close-out commit** — CC_HANDOFF overwrite, REPO_INDEX meta bumps to 2026-05-21, PRODUCT_SUMMARY Last reviewed → 2026-05-21.

## In-progress work

None. Clean state.

## Quality checks

`tsc --noEmit` and `eslint .` clean on `marketing-site/` at this close-out HEAD (re-run after merge, both empty output). Runtime verified via SSR curl of the home page with Order updates pre-checked — all 7 message cards rendered correctly with interpolation.

## Decisions

**One D-number added this session: D-408** — Message-library categories drop classification; every category is a flat list of messages. Supersedes: D-400. D-400's body annotated `⚠ Superseded by D-408: …` in the same commit per CLAUDE.md.

Final D-numbers: **323 active, latest D-408**. Archive unchanged (D-01–D-83).

## Gotchas for next session

1. **Session 100 Known issue: DISSOLVED.** Order updates renders all 7 message cards when checked (verified via SSR with a temporary `DEFAULT_CHECKED_MESSAGES` edit). The bug existed only because the renderer had to dispatch across three classifications; the flat-message model removes the dispatch entirely. No carry-forward required for the render bug itself — the dissolution is the intended outcome of D-408.
2. **PostHog event-key rename — manual dashboard update needed.** Old keys retired: `subs_selected` (property), `configurator_sub_toggled` (event), `sub_id` (property on `configurator_sub_toggled` + `configurator_message_customized`). New keys: `messages_selected`, `configurator_message_toggled`, `message_id`. Funnels, insights, and dashboards built on the old keys read empty starting at `794f32c`. **This is a real operations carry-forward — needs a hand-pass in PostHog's UI; no code involved.**
3. **Corpus-wide ASCII-only authoring rule (Session 100 Wave 1 hygiene).** Message bodies are ASCII-only — no em dashes, en dashes, smart/curly quotes, ellipsis character, or other non-GSM-7-basic characters. Any one of them forces UCS-2 encoding and collapses the segment limit from 160 to 70 chars, breaking D-402. Verification script pattern at `/tmp/verify-charcounts.mjs` (transient — recreate per session) reports a GSM-7 column and exits non-zero on violation. Reuse for any future category authoring.
4. **charCount worst-case discipline (Session 99 carry).** `MessageVariant.charCount` must be computed against `budgetChars`, not `example` length — substitute every `{{token}}` with a placeholder of `budgetChars` characters and count. Pre-write verification + post-write regex re-extraction caught zero drift across the Order updates 21 variants.
5. **Stale Sub-N / Stage-N / "hybrid" positional language in five decisions.** D-389 ("Sub 1 signup OTP"), D-391 ("Account events Sub 3"), D-392 ("Appointments Stage 7"), D-395 ("Waitlist Stage 6"), D-401 ("hybrid classification"). Each decision's substance survives D-408 intact; only the wrapper-shape vocabulary is stale. Per CLAUDE.md "Over-marking is as bad as under-marking" + the one-sentence conflict test, none is superseded; their bodies are not edited. **Flagged as a future prose-cleanup pass when convenient — carry-forward.**
6. **`DEFAULT_CHECKED_MESSAGES` rename candidacy.** The constant now keys message IDs (was sub IDs). Works as-is. Tightening the name (e.g. `DEFAULT_CHECKED_MESSAGE_IDS`) is optional cleanup — carry-forward.
7. **Order updates' `Message.groupNote` and `Message.description` text exists but renders nowhere.** Both fields are documentation-only this wave (D-408). The future workspace UX that surfaces lifecycle ordering to developers consumes them. Don't be surprised by the data being unused at runtime — that's by design.

## Files modified this session

22 unique files across the full session arc:

**Code (16):**
- `marketing-site/lib/message-library/types.ts`, `index.ts`, `verification.ts`, `account-events.ts`, `order-updates.ts`, `appointments.ts`, `customer-support.ts`, `marketing.ts`, `team-alerts.ts`, `community.ts`, `waitlist.ts`
- `marketing-site/lib/configurator/use-configurator-state.ts`
- `marketing-site/components/configurator-section.tsx`
- `marketing-site/components/configurator/category-list.tsx`
- `marketing-site/components/configurator/mobile-categories-modal.tsx`
- `marketing-site/components/waitlist-modal.tsx`
- `marketing-site/context/waitlist-context.tsx`

**Docs (6):**
- `DECISIONS.md` (D-408 + D-400 annotation)
- `PROTOTYPE_SPEC.md` (Order updates Wave 1 then flat-model rewrite)
- `docs/PRODUCT_SUMMARY.md` (§3 configurator description, Last reviewed bumps)
- `REPO_INDEX.md` (meta + branch state + message-library section)
- `CC_HANDOFF.md` (overwritten three times this session)

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
- Authored-but-unchecked category-default behavior — Account events and Order updates both ship authored but with no default-checked message. Whether an authored category should auto-suggest a primary message when toggled on is still a UX call (Session 99 carry-forward; now affects three authored categories, since Verification's `verification-code` is the only message in `DEFAULT_CHECKED_MESSAGES`).
- **New this session:** PostHog event-key rename — manual update of existing dashboards on the old `subs_*` / `*_sub_*` keys (see gotcha #2).
- **New this session:** Prose-cleanup of stale Sub-N / Stage-N / "hybrid" language in D-389, D-391, D-392, D-395, D-401 (see gotcha #5).
- **New this session:** `DEFAULT_CHECKED_MESSAGES` rename candidacy (see gotcha #6).

## Suggested next session

1. **Author Team alerts** — next category in the authoring sequence (PM direction: not Marketing — Marketing is sequenced last because of its distinct compliance profile). PM-led authoring: PM resolves the classification-equivalent shape (now just "what messages does this category contain"), aligns the variable catalog, drafts compliance rules, and authors the bodies; CC then writes the file honoring the corpus-wide ASCII-only rule (gotcha #3) and the charCount discipline (gotcha #4). Team alerts' research file at `audits/research/2026-05-16/team-alerts.md` with §6 resolved.
2. **First Indie Hackers post.** Still on the pre-launch checklist per MASTER_PLAN.md §"Pre-launch checklist." Carry-forward from Sessions 97 / 98 / 99 / 100.
3. **PostHog dashboard rename pass** (gotcha #2) — a hand-pass through existing PostHog funnels and insights to update the retired event-key names. Decoupled from any code change.
4. **Stale-prose cleanup of D-389/391/392/395/401** (gotcha #5) — a small DECISIONS.md prose-only commit reworking the positional Sub-N / Stage-N / "hybrid" language. Decoupled from any other work.
