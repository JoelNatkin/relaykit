# CC_HANDOFF — Session 101 — IH launch day: MESSAGE_AUTHORING_GUIDE + Team alerts + configurator default-state cascade (D-409) + launch-prep copy

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.

**Date:** 2026-05-21
**Branches:** `main` only — all session work merged. No unmerged feature branches local or remote.

`Commits: 8 | Files modified: 14 | Decisions added: 1 (D-409) | External actions: ~12 (branch pushes ×3, main pushes ×5, remote branch deletes ×3, Vercel auto-deploys, one gh CLI install in ~/.local/bin)`

---

## Session character

Indie Hackers launch day. Three feature waves on branches plus two direct-to-main copy commits, then this close-out. The thread:

1. **MESSAGE_AUTHORING_GUIDE** — new canonical doc at `docs/MESSAGE_AUTHORING_GUIDE.md` consolidating the scattered authoring procedure (ASCII-only rule, charCount-against-budgetChars discipline, tone variants, compliance baseline). PM-authored prose; CC verified each claim against the repo and resolved one discrepancy (§7 sender-frame bullet retargeted — D-398 only covers workspace_name in three categories, Verification uses business_name as its own rule).
2. **Team alerts authoring** — the 4th of 9 message-library categories. 9 messages (5 shift-lifecycle + 4 alert-event), 27 tone variants, 10-variable catalog, 6-rule compliance block, TCR ACCOUNT_NOTIFICATION. Max charCount 121/160 worst-case. All bodies ASCII-clean. Configurator picks Team alerts up automatically via `isAuthored()` — no separate wiring.
3. **Configurator launch-prep** — three coupled changes: (a) `toggleCategory` now cascades check-state to all messages; (b) page-load checks every message of the default category (Verification); (c) selectPreset mirrors the cascade. Plus three independent surface edits: Marketing moved to last in CATEGORIES order; login-code tooltip got an SMS-2FA security advisory appended; the "Pre-launch." prefix stripped from the line-600 paragraph. STATE_VERSION 2 → 3 to re-seed returning visitors. New decision **D-409** records the cascade rule and supersedes D-397 (Community milestone default-off).
4. **Homepage hero + section-3 copy** — two direct-to-main commits. Hero subhead "Two files. Your AI tool. A working SMS feature." → "Compliant SMS that drops into your stack, wired by your AI tool." Then a follow-up single-word strip ("wired in by" → "wired by"). Section-3 H2 "Two files. Your AI tool." → "Hand it to your AI tool."

The Indie Hackers launch landed mid-session against this configurator state: visitors hitting `relaykit.ai` see the new hero copy + 4 Verification message cards rendered in the preview pane by default.

## Completed work (chronological)

- **`9c1cd8f`** (`--no-ff` merge of `feat/message-authoring-guide`) — new `docs/MESSAGE_AUTHORING_GUIDE.md` + REPO_INDEX cross-references (file table + canonical-sources-by-topic) + CLAUDE.md key-docs pointer. §7 sender-frame bullet retargeted per A2 verification discrepancy.
- **`55760e5`** (`--no-ff` merge of `feat/team-alerts-authoring`) — `team-alerts.ts` populated (9 messages, 27 variants, 10-variable catalog, 6-rule compliance). charCount verification script at `/tmp/verify-team-alerts-charcounts.mjs` (transient).
- **`757ac8d`** (`--no-ff` merge of `feat/configurator-launch-prep`) — two atomic commits under the merge: `6cd7b54` (cascade + STATE_VERSION 3 + presetValue ripple) and `0afa0b0` (CATEGORIES reorder + login-code tooltip + Pre-launch prefix strip + PRE_LAUNCH_DEVIATIONS entry #3 update).
- **`4d78630`** (direct to main) — hero subhead + section-3 H2 copy edits.
- **`85d2ed2`** (direct to main) — hero subhead single-word strip ("wired in by" → "wired by").
- **This close-out commit(s)** — DECISIONS.md (D-409 + D-397 annotation) and the doc bundle (PROTOTYPE_SPEC + PRODUCT_SUMMARY + REPO_INDEX + this CC_HANDOFF).

## In-progress work

None. Clean state.

## Quality checks

`tsc --noEmit` and `eslint .` clean on `marketing-site/` at this close-out HEAD (re-run after each merge, all empty output). Runtime verified via SSR curl of the home page across the configurator-launch-prep commits:
- All 4 Verification messages render checked (3 matches each in SSR for `Verification code` / `Confirmation code` / `Recovery code`, 2 for `Login code` — body uses "Your login code is" not "Login code" literally).
- Marketing renders last in the category panel.
- Hero subhead reads "Compliant SMS that drops into your stack, wired by your AI tool."
- Section-3 H2 reads "Hand it to your AI tool."
- Line-600 paragraph no longer starts with "Pre-launch."

## Decisions

**One D-number added this session: D-409** — Configurator category toggle cascades to all messages; per-message defaults removed. Supersedes: D-397 (Community member milestone sub default-off — milestone now auto-checks alongside Community under the cascade rule). Extends D-377 (without superseding).

Final D-numbers: **324 active, latest D-409**. Archive unchanged (D-01–D-83).

## Gotchas for next session

1. **D-397's protective intent (milestone shouldn't auto-send to early-stage communities) is now inert** until Community is authored AND a per-message default mechanism returns. The BACKLOG Pri 1 entry "Opt-out risk tagging for message templates" is the named path forward. If/when Community authoring lands, PM should decide whether milestone needs a separate per-message default-off mechanism or whether the cascade-on-toggle behavior is acceptable.
2. **STATE_VERSION 3 drops V2 persisted state silently.** Returning visitors with persisted state from before this session re-seed under the new "all messages of default category checked" default on next load. No migration code; version-gated drop.
3. **The Tooltip component renders body content only on hover (client-side), not in SSR.** Visual verification of tooltip text via SSR HTML returns 0 matches — that's expected. Verify tooltip changes against the source file or via in-browser hover.
4. **Two atomic commits inside `feat/configurator-launch-prep`** preserved under the `--no-ff` merge: `6cd7b54` (state behavior) + `0afa0b0` (copy/reorder). The state-behavior commit is the one that earned D-409; the copy/reorder commit is three independent surface edits bundled.
5. **Homepage hero copy went through two iterations.** First commit `4d78630` introduced "Compliant SMS that drops into your stack, wired in by your AI tool." Second commit `85d2ed2` stripped the word "in" to "Compliant SMS that drops into your stack, wired by your AI tool." Current canonical text is the second.
6. **The "Recommended combinations" dropdown's five non-Verification presets remain inert** per D-385. Reconnaissance pass at session midpoint confirmed: no category mappings defined in code; the handler early-returns on every non-`verification-only` ID; `disabled: true` is hardcoded in the PRESETS const at `category-list.tsx:25–33`. Building these into functioning presets is a legitimate post-launch task once remaining categories are authored — see carry-forwards.

## Files modified this session

14 unique files across the full session arc:

**Code (5):**
- `marketing-site/lib/message-library/team-alerts.ts` (stub → populated)
- `marketing-site/lib/message-library/verification.ts` (login-code tooltip append)
- `marketing-site/lib/message-library/index.ts` (CATEGORIES order — Marketing to last)
- `marketing-site/lib/configurator/use-configurator-state.ts` (cascade + STATE_VERSION 3 + DEFAULT_CHECKED_MESSAGES removal)
- `marketing-site/components/configurator-section.tsx` (presetValue ripple + Pre-launch strip + hero/section-3 copy via app/page.tsx — actually app/page.tsx is the separate file)

**Code (additional, hero/section-3):**
- `marketing-site/app/page.tsx` (hero subhead + section-3 H2 — two commits)

**Docs (8):**
- `docs/MESSAGE_AUTHORING_GUIDE.md` (new canonical doc)
- `REPO_INDEX.md` (cross-references for the new guide + this close-out meta/table updates)
- `CLAUDE.md` (key-docs pointer to the new guide)
- `docs/PRE_LAUNCH_DEVIATIONS.md` (entry #3 After: aligned to post-strip live string)
- `DECISIONS.md` (D-409 + D-397 supersession annotation)
- `PROTOTYPE_SPEC.md` (Last updated bump + configurator default-state + Team alerts notes + Marketing-last + hero/section-3 copy + STATE_VERSION reference + authored-count update)
- `docs/PRODUCT_SUMMARY.md` (§3 Team alerts + new populated default + cascade behavior)
- `CC_HANDOFF.md` (this file — overwritten)

## Unmerged branches

None.

## Retirement sweep / drift watch

Skipped — mid-phase, Phase 1 (Sinch Proving Ground) still active per MASTER_PLAN.md §"Active focus", no phase boundary crossed this session.

## Carry-forward open items

Surviving from prior sessions:
- Tooltip touch-event handling (Session 98 carry-forward).
- Tooltip `aria-describedby` wiring (Session 98 carry-forward).
- Tooltip viewport-edge positioning at extreme breakpoints (Session 98 carry-forward).
- D-378's stale parenthetical (Session 98 carry-forward).
- D-380 drift carry-over — status unverified this session.
- PostHog vs Plausible/Fathom reconciliation in `docs/MARKETING_STRATEGY.md` (Session 97 carry-forward).
- `docs/POST_TOPICS.md` still untracked (long-running carry-forward).
- PostHog event-key rename — manual update of existing dashboards on the old `subs_*` / `*_sub_*` keys (Session 100 carry-forward).
- Prose-cleanup of stale Sub-N / Stage-N / "hybrid" language in D-389, D-391, D-392, D-395, D-401 (Session 100 carry-forward).

Resolved this session (no longer carry-forward):
- **Authored-but-unchecked category-default behavior** (S99/S100 carry-forward) — resolved by D-409 with the cascade rule.
- **`DEFAULT_CHECKED_MESSAGES` rename candidacy** (S100 carry-forward) — resolved by deletion entirely under D-409.

New this session:
- **gh CLI propagation gap.** gh CLI installed (`~/.local/bin/gh`, v2.92.0) and authenticated in the interactive shell, but credentials do not reach the Bash tool's non-interactive subshells. Resolution deferred — run `gh auth login` interactively outside a session to write `~/.config/gh/hosts.yml`. Until then, Vercel/check-run polling stays manual.
- **Recommended-combinations presets remain inert.** The five non-Verification presets (SaaS, Personal services, Real estate, Fitness, E-commerce) remain inert disabled labels with no category mappings per D-385. Building them into functioning presets — defining each preset's category set + wiring the handler — is a legitimate post-launch task once remaining categories are authored. Not started.
- **order-updates.ts em-dash alignment.** `order-updates.ts` `Message.groupNote`/`Message.description` fields use em-dashes; Team alerts uses straight hyphens per the MESSAGE_AUTHORING_GUIDE §6 "ASCII-clean too" rule + PM ruling. Optional prose-cleanup to align `order-updates.ts` to ASCII-clean — bundles naturally with the D-389/391/392/395/401 stale-language cleanup carry-forward.
- **Git commit author email shows literal curly quotes.** Stale git config artifact (`"joelnatkin@mac.com"` with smart quotes). Cosmetic; surfaced in commit metadata visible in `git log`. Fix with `git config user.email <straight-quotes>` when convenient.

## Suggested next session

1. **Author Customer support** — next category in the authoring sequence (or another remaining: Appointments, Community, Waitlist, Marketing). Marketing is sequenced last because of its distinct compliance profile (D-399 + STOP/HELP in body). The five `Coming soon` categories all have research files at `audits/research/2026-05-16/[name].md` with §6 resolved. Follow the MESSAGE_AUTHORING_GUIDE procedure (§3 authoring method, §6 technical disciplines).
2. **Post-launch monitoring.** First Indie Hackers post is launch-adjacent — track signups in PostHog and Supabase `early_access_subscribers`, watch the configurator's PostHog conversion events for the new "all 4 Verification messages checked by default" baseline.
3. **PostHog dashboard rename pass** (S100 carry-forward) — a hand-pass through existing PostHog funnels and insights to update the retired event-key names (`subs_*` / `*_sub_*` → `messages_*` / `*_message_*`). Decoupled from any code change.
4. **Stale-prose cleanup of D-389/391/392/395/401** (S100 carry-forward), now bundled with the **order-updates.ts em-dash alignment** (new this session) — single prose-only commit reworking positional Sub-N / Stage-N / "hybrid" language across those five decisions plus aligning order-updates.ts groupNote/description punctuation to ASCII-clean per MESSAGE_AUTHORING_GUIDE §6.
