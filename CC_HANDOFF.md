# CC_HANDOFF — Session 112 — Doc-only: PM Mode signaling rename, relaykit-writing-prose skill landed, no-EIN exploration scaffolded

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.

**Date:** 2026-05-25
**Branches:** `main` only — two commits direct on main this session, both unpushed entering close-out. No feature branches.

`Commits: 2 | Files modified: 7 | Decisions added: 0 | External actions: 1 (Sinch support email sent to onlineteam@sinch.com — Joel-side, queued the four TFN questions captured in /explorations/no-ein-sole-proprietor-path.md)`

---

## Session character

Doc-only session bridging Session 111's Phase 1 close-out and the eventual Phase 2 Session B kickoff. Three discrete pieces of work landed:

1. **PM instructions trimmed of bypass-mode language.** With CC permissions migrated to allowlist (Session 111's `2ff3c78`), §CC Mode Signaling in `PM_PROJECT_INSTRUCTIONS.md` still emitted `Mode: bypass` instructions that named a state no longer reachable. Renamed `Mode: bypass` → `Mode: normal`, stripped two "bypass permissions on" status-bar references, kept the existing dual-mode framing (committed early-session as `0257a6a`).

2. **`relaykit-writing-prose` skill version-controlled.** Previously lived only in the Claude.ai UI. Placed at `.claude/skills/relaykit-writing-prose/` (matching the existing `.claude/skills/tdd/` precedent, picked up immediately by Claude Code's skill auto-discovery) with a `references/exemplars.md` subfile carrying annotated worked-example posts. `## Claude Code skills` section added to REPO_INDEX retroactively documenting both this skill and the previously-undocumented tdd skill. The "punchy-style" twin skill is anticipated but not yet authored — current skill is scoped to traditional measured prose.

3. **No-EIN customer-path exploration scaffolded** at `/explorations/no-ein-sole-proprietor-path.md`. Captures the deeper finding from Joel's manual Sinch "New brand" form walk (2026-05-24, replaced the planned Experiment 5 — pre-planned then abandoned when the answer arrived directly): the EIN wall is TCR-wide, not Sinch-specific. This kills three of the four BACKLOG options for serving sole-prop customers (secondary carrier / RelayKit-as-CSP / umbrella brand all still route through TCR). Toll-free verification is the one live path. Sinch support email sent 2026-05-25 with four questions (real-world TFN approval rate, Business Registration Number alternatives, API-vs-form availability, throughput/deliverability vs. 10DLC); reply pending. BACKLOG `Sole Proprietor customer segment` entry got a one-line back-pointer to the exploration.

No code changes. No D-number lands — exploration is `Status: exploring`, not a committed decision. Per CLAUDE.md, decision-promotion happens when the Sinch reply resolves the build-cost and approval-rate questions.

## Commits — chronological

1. `0257a6a` — **`docs: rename Mode: bypass to Mode: normal in PM instructions`.** Three edits to §CC Mode Signaling in PM_PROJECT_INSTRUCTIONS.md: `Mode: bypass` → `Mode: normal` on the bullet, on the "When PM specifies" line, and in the Pitfalls bullet; "Status bar should already read 'bypass permissions on'" stripped from the bullet; "Bypass mode on genuinely new ambiguous work is risky" → "Normal mode...". 1 file / +3 / −3. PM-approved in plan mode before commit.

2. **This commit — close-out.** Seven-file batch: `.claude/skills/relaykit-writing-prose/SKILL.md` (new), `.claude/skills/relaykit-writing-prose/references/exemplars.md` (new), `/explorations/no-ein-sole-proprietor-path.md` (new), `BACKLOG.md` (one-line back-pointer appended to the Sole Proprietor entry), `REPO_INDEX.md` (new `## Claude Code skills` section retroactively listing tdd + relaykit-writing-prose; new row in Active explorations table for no-ein-sole-proprietor-path; Meta block bumped — last_updated, active explorations count + descriptions, branch state, decision-count parenthetical; canonical-docs table rows refreshed for REPO_INDEX/CC_HANDOFF/BACKLOG/PM_PROJECT_INSTRUCTIONS), `PM_PROJECT_INSTRUCTIONS.md` (in-file Updated header bumped May 22 → May 25), `CC_HANDOFF.md` (this file). Mechanical, skip review per Joel direction.

## Quality checks

- No tsc/eslint — doc-only session; CLAUDE.md doc-only-session rules apply (grep verification replaces build verification).
- Skill auto-discovery verified mid-session: the new `relaykit-writing-prose` skill appeared immediately in the Skill tool's available-skills list after the file writes, confirming `.claude/skills/` was the correct placement vs. Joel's initially-suggested `docs/skills/`.
- Three plan-mode plans walked this session (bypass-rename, Experiment 5 — later abandoned, skill placement). Experiment 5 plan was scoped + approved + then abandoned without execution when Joel surfaced he had already walked the form manually and found the answer. Plan file was deleted before the next plan re-used the filename slot.

## Decisions

None. Exploration is `Status: exploring`. Decision-promotion will happen when the Sinch support reply resolves the open questions (per the exploration file's "Where this goes next" section).

D-counts unchanged: 330 active, latest D-415; archive D-01–D-83.

## Exploration-doc disposition

**New:** `/explorations/no-ein-sole-proprietor-path.md` (Status: exploring). REPO_INDEX Active explorations table updated to include it. BACKLOG Sole Proprietor entry got a back-pointer.

**No PRODUCT_SUMMARY pointer added.** Judgment call surfaced for PM review: the exploration is about *which* customers RelayKit can serve, not the customer experience itself. No concrete customer-experience change is committed yet. When the exploration promotes (D-number or scope cut), PRODUCT_SUMMARY will get the pointer then.

**No PROTOTYPE_SPEC pointer added.** Not UI-related.

No other exploration-doc movement this session.

## Retirement sweep

N/A — mid-phase close-out (Phase 1 closed Session 111; Phase 2 hasn't started). CLAUDE.md gates sweep to phase-boundary close-outs only.

## Drift watch

N/A — mid-phase close-out, same reason as above.

## Carry-forward watch items

### NEW this session

**(a) Sinch support reply pending.** Email sent 2026-05-25 to `onlineteam@sinch.com`. Four questions covering toll-free verification sole-proprietor approval rate + Business Registration Number alternatives + API-vs-form availability + throughput/deliverability vs. 10DLC. When the reply lands, append to `/explorations/no-ein-sole-proprietor-path.md` — add a new "Reply received" subsection under the email block. Reply substance may promote the exploration to a D-number or MASTER_PLAN scope note.

**(b) Punchy-style twin skill is anticipated but not yet authored.** Current `relaykit-writing-prose` is scoped to the traditional measured-prose style; a separate skill for Joel's choppier Indie Hackers style is expected later. The `description` field on the current skill already mentions this, but the twin doesn't exist yet — no action this session.

**(c) PM_PROJECT_INSTRUCTIONS `Last touched` annotation in REPO_INDEX was stale entering this session.** Row had read `2026-05-22 (Session 103 — PM-behavior section compressed)`, missing the Session 111 commits `a815a3b` (Talking to Joel guidance) and `fe35037` (approval heads-up guidance). This close-out's refresh replaces the stale annotation with Session 112's edit; the Session 111 commits remain in git log but aren't separately captured in REPO_INDEX. Flag in case PM wants future close-outs to be more proactive about Last-touched maintenance.

### Surviving from Session 111 (no change this session unless flagged)

- **MESSAGE_PIPELINE_SPEC drift** flagged by Session 111's drift-watch — spec hasn't been touched since 2026-05-13; Phase 1 findings (ULID IDs, DR shapes, MO shape, terminal-status parser, no-HMAC) not yet reconciled in. Session B kickoff prep should include a spec reconciliation round.
- **Phase 2 Session B kickoff prep round** is the named next pickup per MASTER_PLAN: (a) spec reconciliation, (b) batched BDR conversation, (c) MO correlation architectural-choice confirmation, (d) signature-verification design approach.
- **Focused DECISIONS retirement sweep** recommended before Phase 2 work — Phase 1 → Phase 2 boundary sweep was scope-incomplete because DECISIONS.md exceeds the single-Read size; chunked-read scan deferred.
- **MASTER_PLAN "Launch focus" refresh** — separately scoped from §Active focus; carry-forward from Session 108. Active focus updated Session 111; Launch focus untouched.
- **Brand bundle Company name correction** — RelayKit operational follow-up: update brand `BTTC6XS` Company name field from `VAULTED PRESS LLC` to `RelayKit LLC` via Sinch dashboard `Update brand`. Joel-side.
- **Phase 4 consent-ledger architectural commitment** — scoped to Phase 4 when Phase 4 starts.
- **BDR queue (Elizabeth Garner)** — four cumulative API/dashboard inconsistencies + Experiment 3c `BRAND_IDENTITY_STATUS_UPDATE` callback exposure + Experiment 4 opt-out tracking + per-campaign auto-response config. Single batched conversation. (Separate from the Sinch support email this session — that went to `onlineteam@sinch.com`, not Elizabeth Garner.)
- **`MobileCategoriesModal` latent scroll-lock pattern** — same fix as the `EditValuesModal` viewport guard from Session 106; fixable on the next session that touches it.
- **D-389/D-391/D-392/D-395/D-401 stale positional-language cleanup** — pending dedicated session.
- **PostHog dashboard rename pass** — pending.
- **PostHog vs Plausible/Fathom reconciliation** in `docs/MARKETING_STRATEGY.md`.
- **Tooltip touch-event handling / `aria-describedby` / viewport-edge positioning** — pending.
- **D-378's stale parenthetical; D-380 drift carry-over** — pending.
- **`docs/POST_TOPICS.md` still untracked** — surviving carry-forward.
- **Per-message "revert to RelayKit's default" configurator fast-follow** — pending.
- **Slash-command-for-variable-insertion configurator fast-follow** — pending.

## Gotchas for next session

1. **The planned Experiment 5 (Sinch dashboard inspection) was scoped + approved in plan mode, then abandoned.** Joel walked the form manually and surfaced the deeper TCR-level finding directly. The plan file was deleted before execution; the question it would have answered is documented at `/explorations/no-ein-sole-proprietor-path.md`. Don't re-plan Experiment 5; the slot is closed.

2. **The `relaykit-writing-prose` skill is live and auto-discoverable.** If the user asks CC to draft external content (blog, Indie Hackers, marketing copy), the skill should fire. Skill convention is now: `.claude/skills/[name]/SKILL.md` + optional `references/`. Future skills follow this pattern.

3. **The no-EIN exploration is `Status: exploring`, not decided.** Do not propagate to MASTER_PLAN/DECISIONS/PRODUCT_SUMMARY until the Sinch reply lands and the exploration promotes via a deliberate session.

4. **REPO_INDEX `## Claude Code skills` section added.** Retroactively documents tdd. Future skill additions should append to that table.

### Surviving gotchas from prior sessions (no change this session)

All Session 111 gotchas remain operational — see git log for the prior CC_HANDOFF.

- **Sinch `BRAND_IDENTITY_STATUS_UPDATE` is the brand-lifecycle event type.**
- **Sinch FULL re-vetting does NOT enforce company-name/public-record consistency.**
- **Path-dependent Sinch-cost framing** — $6 Simplified-only customer vs. $50 cumulative upgrade-path customer; pricing-model upgrade-tier surcharge TBD.
- **Campaign-creation wizard is an 8-step flow.**
- **Wrangler tail invocation pattern across 2a/2b/4.**
- **Sinch's `mo_text` is the unified MO discriminator.**
- **Sinch dashboard surfaces no customer-facing opt-out view.**
- **Receiver behavior held up unchanged across 2a / 2b / 4** (Worker `experiments/sinch/webhook-receiver/src/index.js`).
- **`STATE_VERSION 3→4` silent drop.**
- **`isCompliant` = "no blockers"** (D-415).
- **Tiptap `categoryVariables` is context-driven** (Session 107).
- **`MessageOverride` retirement is complete** (Session 107).
- **`.pm-review.md` is gitignored** (Session 109).
- **Untracked carry-forward files**: `.agents/`, `AGENTS.md`, `docs/POST_TOPICS.md`, `api/node_modules/`.

## Files modified this session

7 unique:

- `PM_PROJECT_INSTRUCTIONS.md` — commit `0257a6a`: §CC Mode Signaling `Mode: bypass` → `Mode: normal` (three edits). Close-out commit: in-file Updated header bumped May 22 → May 25.
- `.claude/skills/relaykit-writing-prose/SKILL.md` — close-out commit: new file (lifted verbatim from the Claude.ai UI export).
- `.claude/skills/relaykit-writing-prose/references/exemplars.md` — close-out commit: new file (lifted verbatim).
- `/explorations/no-ein-sole-proprietor-path.md` — close-out commit: new file scaffolded with PM-authored substance and the verbatim Sinch support email body.
- `BACKLOG.md` — close-out commit: one-line back-pointer appended to the `Sole Proprietor customer segment` entry.
- `REPO_INDEX.md` — close-out commit: new `## Claude Code skills` section; Active explorations table row added; Meta block bumped; canonical-docs `Last touched` annotations refreshed for REPO_INDEX/CC_HANDOFF/BACKLOG/PM_PROJECT_INSTRUCTIONS.
- `CC_HANDOFF.md` — this file, overwritten.

## Unmerged branches

None. All commits on `main`.

## Suggested next session

1. **Phase 2 Session B kickoff prep** — the named next pickup per MASTER_PLAN, unchanged from Session 111's recommendation. Pre-work: spec reconciliation against Phase 1 findings, batched BDR conversation, MO correlation architectural-choice confirmation, signature-verification design approach.

2. **Push Session 112's pending commits** — `0257a6a` + the close-out. Joel's call.

3. **Watch for the Sinch support reply** — when it lands, append to `/explorations/no-ein-sole-proprietor-path.md`. May trigger exploration promotion (D-number or scope-cut decision).

4. **MASTER_PLAN "Launch focus" refresh** — separately scoped from §Active focus; carry-forward from Session 108.

5. **Focused DECISIONS retirement sweep session** — recommended per Session 111's retirement-sweep findings.

6. **Brand bundle Company name correction** — RelayKit operational follow-up; Joel-side dashboard work.

Doc carry-forwards from prior sessions still viable as fillers.
