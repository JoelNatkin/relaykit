# CC_HANDOFF — Session 99 — Account events authoring + account_link catalog fix

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.

**Date:** 2026-05-20
**Branches:** `main` only — all session work merged. No unmerged feature branches local or remote.

`Commits: 5 | Files modified: 4 | Decisions added: 0 | External actions: ~10 (git pushes + remote branch delete + Vercel auto-deploys)`

---

## Session character

A focused Wave 2 message-library session — author the second corpus category (Account events) end-to-end, then handle the one catalog-correctness fix that surfaced post-merge. Two PM iterations on the charCount discipline shaped the bulk of the session: the first authoring pass had charCounts computed against example-length substitution rather than budgetChars, so all 15 variants under-reported and one over-shot 160 at worst case; the second pass tightened `account_link` budget to match the URL's actual fixed length and recomputed honestly. A third small commit replaced the original "RelayKit issues a short URL" framing with the correct "developer's own domain" framing after PM corrected the catalog's premise. A small cleanup commit removed the now-stale link-shortening BACKLOG entry that had been added under the prior premise.

## Completed work (chronological)

- **Account events authored** (`82022ba` + merge `5fb64fc`) — `marketing-site/lib/message-library/account-events.ts` overwritten from stub to populated category: 5 subs (Payment failed, Trial / renewal upcoming, Subscription confirmation, Security event, Account status change), 5 messages, 15 tone variants (3 tones each), 5-variable catalog (`workspace_name` from shared + new `account_link`, `card_last4` (typeConstrained), `days_remaining`, `device_context`), 6-rule compliance block. Branched `feat/account-events-authoring` off `main` HEAD, written, PM-reviewed via `.pm-review.md`, pushed to origin, merged `--no-ff` to main, branch deleted local + remote.
- **BACKLOG note on link-shortening provisional budget** (`d7bcb64`) — Pri 3 entry capturing the (then) provisional `account_link` budgetChars:18 tied to a RelayKit-issued short URL. Pushed direct to main per the trivial-doc convention. (Later removed in `d3055c0` — see below.)
- **`account_link` catalog fix** (`d01eef4`) — PM corrected the premise: `account_link` is the developer's own account/billing URL on their own domain, not a RelayKit-issued short URL. Changes: `example "relaykit.to/a/x7k2"` → `"yourapp.com/billing"`; `budgetChars 18 → 19` (matches the example's literal length); description rewritten ("RelayKit does not shorten or host this URL"); file-top JSDoc reworded; D-402 compliance rule changed to reference "a short developer-domain shape" instead of "RelayKit's short-URL form"; all 15 charCounts recomputed +1 (each variant references `account_link` exactly once). New Pri 3 BACKLOG entry added: derive `account_link` example from the business-name input the way `workspace_name` does. Pushed direct to main.
- **Stale link-shortening BACKLOG entry removed** (`d3055c0`) — The entry added in `d7bcb64` was premised on RelayKit issuing a short URL — false after the catalog fix. Deleted; the surviving Pri 3 entry about configurator-derivation covers the real forward work. Pushed direct to main.

## In-progress work

None. Clean state.

## Quality checks

`tsc --noEmit` and `eslint .` clean on `marketing-site/` at every commit and at this close-out HEAD. The catalog change ran the type system and lint over the new variable catalog + 15 new variants without surfacing anything.

## Decisions

**No D-numbers added this session.** Account events authoring is execution against pre-resolved decisions (D-394, D-398, D-399, D-400, D-402 all govern the shape). PM explicit ruling on `account_link`: not a D-number — the variable resolves no named alternative this session and isn't load-bearing until link handling is technically settled. Captured in PROTOTYPE_SPEC §"Account events sub-checkboxes" instead.

Final D-numbers: 322 active, latest D-407. Archive unchanged (D-01–D-83).

## Gotchas for next session

1. **charCount worst-case discipline — the discipline that tripped the first authoring pass.** `MessageVariant.charCount` must be computed against `budgetChars`, not `example` length. The `types.ts` JSDoc on the field says it explicitly: "Worst-case-substituted GSM-7 length — body with each token at its `budgetChars` (D-402)." The first Account events authoring pass had charCounts off by ~13–35 chars on every variant because they were computed at example-length substitution. One variant exceeded 160 (D-402 violation) at the worst case. Verification mechanism: substitute every `{{token}}` with a placeholder of `budgetChars` length and count — a five-line node script. For any future category authoring, run this verification before commit. Reference impl at `/tmp/verify-charcounts.mjs` (transient — recreate per session).
2. **`account_link` is a workspace-settings variable, not visitor-identity.** When the configurator's conditional-input rendering work lands (BACKLOG: "Configurator conditional input rendering"), `account_link` does **not** want an input on the home configurator. It's a post-signup workspace setting, like `expiry_minutes`, not a visitor brand-identity token like `business_name`. The new BACKLOG entry "Configurator — derive `account_link` example from the business-name input" handles the example-rendering side without surfacing an input.
3. **`DEFAULT_CHECKED_SUBS` in `use-configurator-state.ts` only seeds Verification.** Account events ships authored but unchecked at category level; toggling it on does not auto-check any sub. The line-22 comment "the only authored category and its primary sub start checked" is now slightly stale (it's "the only default-checked authored category" — Account events is also authored but ships off). One-word documentation drift; not fixed this session; flag for the next category-authoring session if a broader category-default rethink is on the table.
4. **15 charCount edits use body-line context for uniqueness.** When the second authoring pass needed to bump every charCount by +1, three values (`123`) were shared across multiple variants. Each Edit carried the variant's body line above the `charCount: N,` line to disambiguate. Pattern works cleanly; reuse if a future budget shift requires re-bumping the corpus.
5. **PRODUCT_SUMMARY's "Last reviewed" was already 2026-05-20** from Session 98's close-out. Not re-bumped (date unchanged); the line-31 configurator description was updated to reflect 2 live categories. If a future same-day session needs a "this was re-reviewed today" marker, the convention to date is to leave the date alone and let the diff carry the signal.

## Files modified this session

**Code:**
- `marketing-site/lib/message-library/account-events.ts` (stub → fully authored; then catalog-fix pass on `account_link` + 15 charCount recomputes)

**Docs (session-work commits):**
- `BACKLOG.md` (Pri 3 link-shortening entry added in `d7bcb64`; Pri 3 configurator-derive-account_link entry added in `d01eef4`; stale link-shortening entry removed in `d3055c0`; "Last updated" bumped to May 20, 2026)

**Docs (close-out edits, this commit):**
- `PROTOTYPE_SPEC.md` (Configurator Section: "Authored vs Coming soon" updated to 2 authored / 7 unauthored; categories list bullet updated; new Account events sub-checkboxes bullet with `account_link` capture per PM ruling)
- `docs/PRODUCT_SUMMARY.md` (§3 configurator description: Verification + Account events live, 7 categories Coming soon)
- `REPO_INDEX.md` (meta last_updated bump; branch state rewritten for Session 99; `Last touched` columns updated on PROTOTYPE_SPEC, PRODUCT_SUMMARY, CC_HANDOFF, BACKLOG; message-library section header bumped to include Session 99, new account-events.ts row added, "remaining stubs" count 8→7)
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
- **New this session:** `use-configurator-state.ts:22` comment ("the only authored category") is slightly stale after Account events authoring. Trivial one-line fix if/when next configurator-touching work happens.
- **New this session:** Account events ships authored but with no default-checked sub. Worth a UX call on whether a category that's authored should auto-suggest a primary sub when the visitor enables it (pattern matches the Verification primary-sub seeding behavior). Out of scope this session.

## Suggested next session

1. **Author the next message-library category.** With Verification (Session 94) and Account events (Session 99) shipped, the remaining 7 are Marketing, Appointments, Order updates, Customer support, Team alerts, Community, Waitlist. The choice is PM's; the research files for all 7 are populated at `audits/research/2026-05-16/[category].md` with §6 resolved. Pre-authoring checklist for any pick: read the research file, confirm the category's classification (discrete vs workflow vs hybrid) in the stub, settle the variable catalog (cross-corpus + category-specific), draft the compliance rules, then author subs/messages/variants honoring the budgetChars-based charCount discipline (gotcha #1 above).
2. **First Indie Hackers post.** Still on the pre-launch checklist per MASTER_PLAN.md §"Pre-launch checklist." Carry-forward from Sessions 97 + 98.
3. **Configurator-derive-`account_link`-example work** (the BACKLOG Pri 3 just added this session). Render-layer change in session-context + render that mirrors how `business_name` flows. Modest scope; opens the door to deriving other workspace-settings tokens analogously.
