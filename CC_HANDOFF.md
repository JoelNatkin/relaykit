# CC_HANDOFF — configurator rework + Wave E close-out (Session 123)

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.

**Session metrics:** Commits: 5 this session | Files modified: 14 distinct | Decisions added: 4 (D-423–D-426) | External actions: 0 (nothing pushed)

**Status:** The held configurator rework (CC_HANDOFF pending a + b from the prior session) is **built, doc'd, and closed out** on `feat/configurator-reframe`. **NOT pushed, NOT merged.** `main` unchanged at `4c655d3`. Awaiting Joel's review + Vercel preview before merge.

---

## Branch state

`feat/configurator-reframe` — **11 commits ahead of `main`, UNPUSHED.** This session added the last 5 (top = newest):

- `2a65460` — **chore**: `.claude/settings.json` permissions tuning (deny `git reset --hard`/`git clean`; allow-broaden dev toolset + promote `rm`/`rmdir`/`git checkout`/`git reset` ask→allow). Discrete commit per the close-out spec. `settings.local.json` stays gitignored/personal — not committed.
- `6e77d63` — **docs**: Wave E close-out — D-423–D-426 + PROTOTYPE_SPEC/PRODUCT_SUMMARY/AIRTABLE_SCHEMA/PRE_LAUNCH_DEVIATIONS/REPO_INDEX reconciliation + `explorations/LEGAL_EXPOSURE_REMEDIATION.md` added.
- `42f906b` — **fix**: Not-yet "Request it" moved into the rules-card footer (divider + AlertTriangle + link → existing `EligRequestModal`); disclaimer shortened to fix a desktop orphan. (Amended twice during its session for the icon color → `text-text-tertiary`.)
- `aad2f7c` — **data**: `verticals.ts` wholesale connector regen — `cardRuleBullets` on all 65 selectable subs + CPaaS-adjacent 🟠→🔴.
- `759e4c1` — **feat**: the rework — message area never disabled, rules card for Conditional + both Not-yet, only 🔴 gated (at the dropdown), `cardRuleBullets` repoint, point-of-use disclaimer, `elig-empty-state.tsx` deleted.

The six commits below those (`1c3ec7c` … `c8675bb`) are the Session 122 Waves A–D reframe + the prior in-progress handoff, also unpushed. The earlier `sketch/configurator-reframe` (`a482a73`) remains as the WIP historical record (unmerged; Joel's cleanup call).

Working-tree carry-forwards (NOT part of any commit, left alone): `M PM_PROJECT_INSTRUCTIONS.md`, untracked `.agents/`, `AGENTS.md`, `api/node_modules/`, `docs/POST_TOPICS.md`. `.pm-review.md` gitignored.

## Done this session

- **Configurator rework (code, 3 commits).** Free authoring tool for every reachable bucket; message area never disabled; 🔴 unselectable at the sub-vertical dropdown only. Rules card (heading + 3 `cardRuleBullets`) for 🟡 Conditional + both 🟠/⚫ Not-yet; Not-yet adds a footer (divider + AlertTriangle + "RelayKit doesn't send this category. Request it." → `EligRequestModal`). Point-of-use disclaimer under the Copy CTA → `/terms`. Multi-tenant D1 dropdown removed, machinery dormant. `getRuleSummaries` repointed rule-level → sub-vertical `cardRuleBullets`; `ContentRule.customerSummary` removed. `verticals.ts` regenerated (65 subs filled, CPaaS flipped). Gates: tsc + eslint clean each commit; `.next` clean-restart, `GET / 200`.
- **Wave E doc close-out (2 commits).** D-423–D-426 recorded (7 gate tests; pre-flight scan; D-422 ⚠ Partially superseded by D-426 same commit). PROTOTYPE_SPEC elig section + PRODUCT_SUMMARY §3 rewritten to current truth. AIRTABLE_SCHEMA "Card rule bullets" column. PRE_LAUNCH_DEVIATIONS reconciled (1–6 superseded by the reframe, new permanent entry 11, live set narrowed to 7–9). REPO_INDEX meta + sub-sections + connector-note fix + new exploration row. settings.json committed separately.

## Decisions added (D-423–D-426)

- **D-423** — customer-facing rule bullets = sub-vertical `cardRuleBullets`, authored in Airtable ("Card rule bullets"), landed via wholesale connector-dump CC write. Extends/clarifies D-421 (wholesale dump ≠ hand-edit); supersedes Wave B's `customerSummary` (which was never a D-number, so no ledger mark needed).
- **D-424** — free-tool point-of-use disclaimer (LEGAL_EXPOSURE_REMEDIATION §3.1).
- **D-425** — free-authoring-tool gating: message area never disabled; only Not-our-lane gated, at the dropdown. Product-UX expression of MD-21.
- **D-426** — multi-tenant entry point removed from the elig UI; routing machinery retained dormant. **Partially supersedes D-422** (its "multi-tenant routes with the same UX" claim — D-422 marked).

## Parked / next (do NOT start unprompted)

- **(a) Migration `009_early_access_interest_tag.sql`** — Joel applies via Supabase SQL Editor **before production deploy**, or the elig "Request it" / inline waitlist inserts fail. `BottomEmailCapture` (no interestTag) unaffected.
- **(b) Browsewrap footer line** (LEGAL_EXPOSURE_REMEDIATION §3.2) — "By using this site you agree to our Terms…" below the `footer.tsx` copyright. Clean adjacent add; PM's call whether bundled or its own copy-only commit. (§3.4–§3.6 ToS/AUP/Privacy edits also parked.)
- **(c) Vercel preview + merge** — Joel reviews the preview, then merge `feat/configurator-reframe` → `main` and push. The whole 11-commit stack lands together.
- **(d) Post-merge teardown** — waitlist-modal machinery is reachable-dead after the reframe (`WaitlistProvider` + `WaitlistModal` in `layout.tsx`, `EarlyAccessButton`, `waitlist-context`, the configurator `setSummary` publish). PRE_LAUNCH_DEVIATIONS entries 7–9.
- **(e) AIRTABLE_SCHEMA Bucket-field drift** (pre-existing, NOT this session's) — the Sub-verticals `Bucket` row (line 36) still lists D-418's four-bucket emoji labels, not D-422's five-bucket strings. D-422's "Affects" flagged this as PM-driven; left untouched here. Flag for a PM connector pass.

## Gotchas

- **Edit-tool silent no-op (observed once).** The first `docs/AIRTABLE_SCHEMA.md` edit reported "updated successfully" but did NOT persist to disk (mtime unchanged, grep count 0). Caught it during the pre-commit consistency pass (file missing from `git status`), re-read, re-applied — second edit persisted. **Lesson: verify doc edits landed via `git status`/grep before committing, don't trust the success message alone.**
- **Bash `&&`/chained-grep short-circuit.** `grep -c` returns exit 1 on zero matches, which kills chained verification commands mid-run (truncates output). Use `{ …; } 2>&1; true` or per-line `$(grep -c …)` for multi-check verification blocks.
- **`cardRuleBullets` is dormant-until-data only in the sense that it's now populated** — the card renders live for all 65 selectable subs. If a future connector regen ships an empty file, the card self-suppresses (no heading-only tease) — by design.
- **`multiTenant` must stay in `EligState`** — `eligInterestTag` reads `state.multiTenant`; removing the field breaks the build (D-426 keeps it dormant, not deleted).

## Retirement sweep / Drift watch

N/A — mid-phase close-out (Phase 2 Session B not yet kicked off; no MASTER_PLAN phase boundary crossed this session).

## Suggested next session

Joel reviews the Vercel preview of `feat/configurator-reframe`; on approval, **apply migration 009**, merge to `main`, push. Then either the browsewrap/legal-doc follow-ups (LEGAL_EXPOSURE_REMEDIATION §3.2 + §3.4–§3.6) or pivot to the parked **Phase 2 — Session B (Sinch outbound delivery)** kickoff (spec reconciliation vs Phase 1 findings, batched BDR conversation, signature-verification design).
