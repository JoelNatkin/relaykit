# CC_HANDOFF — Corpus expansion (Documents category + 23 messages + 2 refinements) (2026-06-21)

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.

**Status: branch `feat/corpus-expansion` — 8 commits, UNMERGED, NOT pushed.** PM reviews the Vercel preview before merge. Working tree clean except untracked `.claude/settings.local.json` (do not commit).

---

## What this branch does (production-facing: `marketing-site/lib/message-library/`)
First production-quality corpus expansion driven by the sub-vertical research program's `UNIVERSAL_MISS_REPORT.md`. Adds a new category + 28 new messages + 2 metadata refinements, with `docs/RELAYKIT_MESSAGE_CORPUS.md` kept in lockstep.

| Commit | What |
|--------|------|
| `1ceaf32` | **New `documents.ts` category** (Documents, TCR ACCOUNT_NOTIFICATION) — 5 msgs: document-needed, signature-requested, signature-received, documents-received, item-ready. `index.ts` wired: import + export + inserted in `CATEGORIES` after ACCOUNT_EVENTS, before MARKETING. |
| `c3ac633` | **account-events +12 msgs** (payment-due-reminder, payment-received, invoice-ready, payment-past-due, deadline-reminder, status-update, new-message-waiting, payout-sent, payout-failed, balance-low, streak-ending, recurring-reminder) + 11 new vars + new `action_link` token in this category. |
| `ad02c74` | **order-updates +3 msgs** (order-ready-for-pickup, quote-ready, delivery-attempt-failed) + new `action_link` token. |
| `78e63ce` | **customer-support +1** (request-received). |
| `f8868fa` | **appointments +4 msgs** (on-the-way, service-complete, time-to-rebook, pre-visit-form-request) + new `eta`, `form_link` tokens. |
| `45acb80` | **team-alerts +3 msgs** (incident-resolved, task-assigned, task-reminder) + new `item_name`, `due_time` tokens. |
| `39dd1e5` | **Refinements** — appointments:confirmation `provider_name` documented optional (venue/reservation/no-provider); team-alerts:system-alert tooltip/description + `system_name`/`alert_type` var descriptions generalized beyond infra. Bodies unchanged. |
| `a344e6a` | **`docs/RELAYKIT_MESSAGE_CORPUS.md`** — Documents section (alphabetical, between Customer support and Marketing) + all 28 new messages in their category sections + both refinement notes. |

## Verification (all green)
- `tsc --noEmit` clean; `eslint lib/message-library/` clean.
- Programmatic check (all 261 variants, 10 categories): **0 problems** — every body's worst-case (sum of token `budgetChars` + literal) ≤160 and example-resolved ≤160; no orphan tokens. Caught + fixed one `charCount` typo (documents:item-ready Brief 122→105).
- Corpus-doc sync: **261/261** code bodies present verbatim in `RELAYKIT_MESSAGE_CORPUS.md`, zero drift.
- All message bodies are ASCII/GSM-7 clean (no em-dashes — see deviation below).

## ⚠ Deviations flagged for PM (also in `.pm-review.md`)
1. **Em-dashes → ASCII hyphens in BODIES.** Spec Friendly bodies used `—`; em-dash isn't GSM-7 and would trip `compliance.ts`'s "not SMS-safe" blocker on these new corpus messages + force UCS-2. Normalized to `" - "` (same length → charCounts unchanged); matches existing corpus convention. Descriptions/tooltips keep em-dashes (not sent).
2. **Subheader counts vs itemized.** STEP 2 header said "14" but listed 12; STEP 4 said "4" but listed 3. Itemized lists sum to 28 = overview's "28 across 6 categories", so I added exactly the itemized set (account-events +12, order-updates +3). **Commit messages use the dictated strings verbatim** — so commit `c3ac633` says "14 messages" though 12 landed, and `ad02c74` says "4 messages" though 3 landed. PM may want those two messages amended for accuracy (would require history rewrite on the unpushed branch).
3. **task-reminder Friendly = 159 worst-case** (set `due_time` budgetChars=19, within spec "~20", to stay strictly <160). A few others are tight (intake-form Friendly 157, delivery-attempt-failed Friendly 158) — all <160, all valid single segments.
4. **No `/messages/documents` landing page** — `lib/landing/categories.ts` keeps its own independent 9-entry `CATEGORY_LANDINGS` registry (not derived from `CATEGORIES`), so adding the 10th category surfaces it in the **configurator** (intended) without creating/breaking a landing route. Not requested.

## Next steps
- PM reviews the Vercel preview of `feat/corpus-expansion` → approve merge (or request the commit-message count fix in #2).
- The Documents category will appear as a 10th category in the `/messages` configurator and the home Messages browser once merged — worth a visual check on the preview (pill row wrapping, default-unchecked behavior).
- Remaining `UNIVERSAL_MISS_REPORT.md` items not built this round: the "Documents vs account-events" home was resolved by creating the category; the report's demoted/2-sub patterns and the `system-alert`/`confirmation` *refinements-only* items are addressed. Future corpus rounds could revisit the report's New-Category note if PM wants billing split out of account-events.

## Branch state
- `feat/corpus-expansion` (HEAD `a344e6a`) off `main`. **8 commits, not pushed.**
- `main` itself is **~21 commits ahead of `origin/main`** from earlier this session (Civic & Public Sector sub-vertical research batches 1–3 + `UNIVERSAL_MISS_REPORT.md`) plus the prior post-S143 research families — all doc-only, all awaiting PM approval to push. None pushed.
- Stale undeleted branches remain (optional cleanup), unchanged from S143.

## Untracked carryover — DO NOT COMMIT
- `.claude/settings.local.json` (untracked); `.pm-review.md` (gitignored, regenerated this stop at HEAD `a344e6a`).
