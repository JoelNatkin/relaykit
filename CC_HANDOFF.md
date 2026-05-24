# CC_HANDOFF — Session 111 — Experiment 3c complete + Phase 1 Sinch Proving Ground complete + permission allowlist migration

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.

**Date:** 2026-05-24
**Branches:** `main` only — five commits direct on main this session, all unpushed entering close-out. No feature branches. Two distinct work strands: (1) early-session PM-direction housekeeping — CC permissions allowlist migration + two PM_PROJECT_INSTRUCTIONS edits (one tightening "Talking to Joel" guidance, one adding approval-heads-up guidance for permission-gated verbs); (2) Experiment 3c execution end-to-end + close-out. First session running under the allowlist permission regime (replacing the prior `bypassPermissions` default).

`Commits: 5 | Files modified: 8 unique | Decisions added: 0 | External actions: 1 ($44 Aegis vetting charge to Sinch account for the live brand FULL upgrade — Joel-side dashboard action, balance debit 80.87 → 36.87 USD)`

---

## Session character

Phase 1 Experiment 3c (brand SIMPLIFIED → FULL upgrade) execution against the live RelayKit brand `BTTC6XS` and the approved 3b campaign `CU4IUD0`. Real money, real upgrade — not throwaway. Pre-flight verification ran in three rounds against a baseline assembled from existing experimental records (3a brand state, 2b/4 campaign state, Session 49 callback receiver), with snapshot completeness gated on Joel screenshot capture of the Brand/Bundle detail views to satisfy the experimental-evidence standard (no inferred cells). Procedure executed exactly through the planned step list with two genuinely-Joel-gated stop points: the step 1(c) drift gate before step 2 navigation, and the step 3(d) hard stop before any submission. Both gates passed cleanly with PM and Joel sign-off before the click.

The 3c outcome was substantially simpler than the Phase 5 hypothesis had assumed: **no form, no documents, one-click paid re-vetting at $44 Aegis vetting, ~60 seconds elapsed** (16:13 submission → 16:14 Approved). Brand ID `BTTC6XS` and Bundle ID `01kq2jqyhjynvr2wcpp0bbppgr` both persisted unchanged across the upgrade — in-place mutation on the same entity, no new brand minted. IdentityStatus moved `VERIFIED` → `VETTED_VERIFIED` (a new state value not previously recorded; same `BRAND_IDENTITY_STATUS_UPDATE` webhook event type). Bundle state `UPGRADE` (previously unmapped per `docs/CARRIER_BRAND_REGISTRATION_FIELDS.md`) confirmed as the upgrade-in-progress dashboard label with event text `"Upgrading to FULL REGISTRATION."`. Existing campaign continuity confirmed: `CU4IUD0` still Active post-upgrade, all four carriers still REGISTERED, number `+12013619609` association preserved — but **existing-campaign throughput tiers did NOT move** (T-Mobile still LOW tier, daily cap 2000, AT&T 75 msg/min). Whether a new campaign created under the now-FULL brand gets better tiers is an open Phase 5 question.

The pre-flight watch-item — brand Company name field stale at `VAULTED PRESS LLC` (corrected for the campaign during 3b resubmission but not for the brand bundle; SC SOS public record now shows `RelayKit LLC`) — resolved post-upgrade: **Sinch FULL re-vetting returned VETTED_VERIFIED without touching, flagging, or correcting the stale field.** RelayKit cannot rely on the FULL upgrade step to catch identity drift; a separate RelayKit operational follow-up to correct the bundle name via `Update brand` is queued outside this experiment.

PM-review cadence applied to the 3c substantive commit via in-chat surface (four-block review request → Joel's four targeted edits → re-surface → confirmation), then committed at `61f2477`. Close-out commit follows the mechanical-skip-review bar per Joel's explicit direction this session.

## Commits — chronological

1. `2ff3c78` — **`chore: switch CC permissions from bypass to allowlist`.** Replaces `.claude/settings.json` `defaultMode: bypassPermissions` with `defaultMode: default` plus explicit `allow` / `ask` / `deny` lists. Allow covers read-only inspection (Read/Glob/Grep), routine Bash (ls, cat, head, etc.), most git read paths (status/diff/log/show), and supporting tooling (npm/npx/tsc/eslint). Ask gates the sensitive surface — curl, `.env*` reads/writes, secrets-path reads/writes, `git push`/`checkout`/`reset`, `rm`/`rmdir`, `.env*` body reads. Deny gates the destructive surface (`git push --force*`). 1 file / +65 / −1. PM-approved before commit.

2. `a815a3b` — **`docs: tighten Talking to Joel guidance in PM instructions`.** Rewrites the single PM-behavior paragraph in `PM_PROJECT_INSTRUCTIONS.md` (§PM behavior). New version leads with the answer in sentence one, defaults to 1-3 sentences, allows a reasoning sentence only when it changes which option Joel picks, prohibits show-the-work explanations, and reaffirms that CC prompts (not chat) carry the complete-and-precise framing. 1 file / +1 / −1. PM-directed verbatim, mechanical edit.

3. `fe35037` — **`docs: add approval heads-up guidance to PM instructions`.** Adds a single bullet to `PM_PROJECT_INSTRUCTIONS.md` §Operational tips — when a CC prompt will trigger permission approvals on the gated verbs (`git push`, `checkout` / `reset` / `restore`, `rm`, `.env` / secrets, `curl`), the PM lists them in a heads-up block above the prompt with explicit approve / do-not-approve disposition per verb. 1 file / +1 / −0. PM-directed verbatim, mechanical edit.

4. `61f2477` — **`experiments(sinch): 3c — brand SIMPLIFIED → FULL upgrade captured`.** New fixture `experiments/sinch/fixtures/exp-03c-brand-upgrade.json` (286 lines — `pre_upgrade_snapshot`, `upgrade_path`, `upgrade_form_field_deltas` empty per "no form" finding, `cost_disclosures[]` with all four layers agreeing at $44, `submission`, `state_transitions` quoting the four bundle event-log entries, `webhook_events`, `webhook_receiver_observations`, `timing`, `post_upgrade_continuity` including the `company_name_drift_disposition` block, `full_unlocks`, `open_questions[]` x 3 for Phase 5, `notes[]` x 3 with the balance-drift + redacted phone + wrangler-skip rationale). `experiments/sinch/experiments-log.md`: §Experiment 3c status flipped BLOCKED → COMPLETE (both top and bottom Status lines); Procedure / Expected artifacts / Success criteria left as-written per the 2b precedent; new subsections appended — Findings (10 bullets), Implications for Phase 2 Session B kickoff (one paragraph noting `BRAND_IDENTITY_STATUS_UPDATE` observed dashboard-internally with API-consumer callback exposure unconfirmed as of 2026-05-24 — Phase 2 Session B BDR question), Implications for Phase 5 (5 numbered items including the path-dependent $50 cumulative Sinch-cost framing), Implications for Phase 4 (none), Leaves open (4 items). `docs/CARRIER_BRAND_REGISTRATION_FIELDS.md`: §IdentityStatus rewritten as a two-row table (Simplified `VERIFIED` + Full `VETTED_VERIFIED`, both via `BRAND_IDENTITY_STATUS_UPDATE`); §Bundle state table updated to confirm `UPGRADE` → `Upgrade` mapping from 3c with the explanatory event text, `REJECTED` → `Rejected` mapping upgraded from "unconfirmed" to observed per the 3b cycle, cumulative-inconsistency count corrected from "three" (3a-era stale) to "four" (3a/3b cycle accurate); new top-level `## FULL upgrade path` section documenting the one-click paid re-vetting finding + the path-dependent $50 cumulative Sinch-cost framing. 3 files / +353 / −9. PM-approved in-chat via four-block review surface before commit; one round of edits applied (address canonicalization to `5196 Celtic Dr`, OCR-note removal from fixture `notes[]`, $50 cost reframe from per-customer to path-dependent in both files, marketing-copy line cut from Findings timing bullet, BRAND_IDENTITY_STATUS_UPDATE framing sharpened for Phase 2 Session B implications).

5. **This commit — close-out.** MASTER_PLAN.md §Active focus rewritten for Phase 2 Session B with Phase 1 complete declared; REPO_INDEX.md Meta block (last_updated, active phase, branch state — five Session 111 commits enumerated; decision count unchanged at 330 active), canonical docs tables (rows for MASTER_PLAN/REPO_INDEX/CC_HANDOFF/CARRIER_BRAND_REGISTRATION_FIELDS updated with Session 111 last-touched annotations), `/experiments` subdirectories entry rewritten for Phase 1 complete with exp-03c fixture pointer; CC_HANDOFF.md overwritten with the retirement-sweep + drift-watch findings blocks included since this close-out crosses the Phase 1 → Phase 2 boundary. Mechanical, skip review per Joel direction.

## Quality checks

- No tsc/eslint — `/experiments`, `/docs`, root canonical docs all doc-only or throwaway-code-rules-apply per `experiments/sinch/experiments-log.md` rules; close-out is doc-only.
- Pre-flight verification: every data point in `exp-03c-brand-upgrade.json` either screenshot-evidence-backed or explicitly Joel-confirmed per the experimental-evidence standard (memory: "Every experimental data point evidence-backed or explicitly Joel-confirmed — no inferred cells"). Phone-number field redacted in the dashboard display capture (`<redacted-illegible-in-capture>`); not material for the experiment.
- Brand bundle Event log captured the four-event 3c upgrade sequence with full timestamps and verbatim event-text quotation (1 Upgrade event, 1 Approved+IdentityStatus event, 2 Approved+brand-update events).
- Cost disclosure cross-check: dialog disclosure `$44 Aegis vetting` matched balance debit `80.87 → 36.87 USD = $44.00` exactly. All four cost-disclosure layers agree; no new pricing inconsistency.
- Wrangler-tail capture not exercised — per 3a precedent, `BRAND_IDENTITY_STATUS_UPDATE` fires dashboard-internally but is not exposed to API-consumer callback URLs (poll-only per Sinch 10DLC API docs). 3c does not retest this; reaffirmed as Phase 2 Session B BDR territory.

## Decisions

None. Experimental findings recorded as findings, not decisions, per the proving-ground rules. No D-number movement this session.

D-counts unchanged: 330 active, latest D-415; archive D-01–D-83.

## Exploration-doc disposition

No exploration doc movement this session.

## Retirement sweep — Phase 1 close

Phase 1 (Sinch Proving Ground) is the closing phase at this boundary.

Scanned: scope-incomplete — see note below. Approximate D-number range added during Phase 1 elapsed time: D-358 (Phase 0 closing) onward through D-415, but the vast majority of those entries pertain to other workstreams (configurator authoring layer, message library Wave 2 authoring, marketing-site facelift, copy & framing cleanups) that ran in parallel with Phase 1's elapsed time. Phase 1 itself produced **zero D-numbered decisions** — direct Phase 1 outputs are findings recorded in `experiments/sinch/experiments-log.md`, never decisions, per the proving-ground rules first established in Session 110.

Findings:

- **No retirement candidates surfaced from Phase 1's own outputs** — Phase 1 produced findings, not decisions, so there is nothing to supersede, archive, or annotate from this phase's substance directly.
- **Active file size: 330 decisions (latest D-415).** Archive threshold per CLAUDE.md sketched as "~100" — the active file is well above that line. Prior archive cuts (D-01–D-83) happened at clear retirement milestones, not at numeric thresholds; established practice favors substance-driven sweeps over count-driven ones.
- **Specific content-level supersession / archive / orphan candidates require a content scan** of `DECISIONS.md` that was not feasible this session — the file is 285KB and exceeds the single-Read size limit per CLAUDE.md (a chunked-Read scan was not attempted given the close-out scope).
- **Recommendation:** before substantive Phase 2 code work begins, run a focused retirement-sweep session — chunked Reads of `DECISIONS.md`, scan for stale-language patterns flagged in the existing carry-forwards (D-378's stale parenthetical, D-380 drift, D-389/D-391/D-392/D-395/D-401 positional-language cleanup), and surface specific archive candidates for PM review. The Phase 1 → Phase 2 boundary close-out registers the sweep obligation without dispatching it.

No disk changes made — awaiting PM review.

## Drift watch — Phase 1 close

One-line verdict per canonical doc in REPO_INDEX `Canonical sources by topic`:

**Product:**
- `docs/PRICING_MODEL.md` — fresh: no pricing subject movement this phase
- `MASTER_PLAN.md` — fresh: updated this close-out
- `docs/PRODUCT_SUMMARY.md` — fresh: last touched Session 107, no customer-experience movement this phase
- `docs/VOICE_AND_PRODUCT_PRINCIPLES_v2.md` — fresh: no voice/copy subject movement this phase
- `BACKLOG.md` — fresh: last touched Session 107, no parked-ideas movement this phase

**UI / Design:**
- `PROTOTYPE_SPEC.md` — fresh: last touched Session 107, no screen-level UI movement this phase
- `WORKSPACE_DESIGN_SPEC.md` — fresh: no workspace subject movement
- `docs/PRD_SETTINGS_v2_3.md` — fresh: no settings subject movement
- `docs/UNTITLED_UI_REFERENCE.md` — fresh: no design-system subject movement
- `docs/BRAND_AUDIT.md` — fresh: no Stage-2 brand work this phase

**Engineering:**
- `MESSAGE_PIPELINE_SPEC.md` — **stale: subject moved 2026-05-24** (Phase 1 findings unblock Session B kickoff — ULID message IDs from Experiment 1, success+failure DR shapes from 2a/2b/4, MO shape from 2b, terminal-status parser shape from 2b/4, no-HMAC finding across the inbound surface from 2a/2b/4 — none reflected in spec). **Doc last touched 2026-05-13.** **Flag for PM:** a Session B kickoff prep round should reconcile the spec against the proving-ground findings before substantive Phase 2 work begins. (This is the most consequential drift surfaced by this watch.)
- `SDK_BUILD_PLAN.md` — fresh: no SDK subject movement this phase (Phase 8 territory)
- `SRC_SUNSET.md` — fresh: no /src work this phase
- `docs/CARRIER_BRAND_REGISTRATION_FIELDS.md` — fresh: updated this session for 3c findings
- `experiments/sinch/experiments-log.md` — fresh: updated this session for 3c findings
- `docs/VERIFICATION_SPEC.md` — fresh: no verification subject movement this phase (Phase 6 territory)
- `docs/MESSAGE_AUTHORING_GUIDE.md` — fresh: last touched Session 103, no authoring-guide movement this phase
- `docs/AI_INTEGRATION_RESEARCH.md` — fresh: no Phase 8 subject movement this phase

**Marketing:**
- `docs/MARKETING_STRATEGY.md` — fresh: no MD-numbered movement this phase
- `docs/MARKETING_STRATEGY_ARCHIVE.md` — fresh

**Process / governance:**
- `DECISIONS.md` — fresh: last touched Session 106, no new decisions this session
- `DECISIONS_ARCHIVE.md` — fresh
- `PM_PROJECT_INSTRUCTIONS.md` — fresh: updated this session (commits `a815a3b` + `fe35037`)
- `CLAUDE.md` — fresh: no CC standing-instruction movement this phase
- `REPO_INDEX.md` — fresh: updated this close-out
- `CC_HANDOFF.md` — fresh: overwritten this close-out

Coverage check: canonical-sources index covers every topic this phase touched (brand registration → `CARRIER_BRAND_REGISTRATION_FIELDS.md`, Sinch experiments → `experiments/sinch/experiments-log.md`, plus all other canonical surfaces). No missing entries.

No disk changes made — awaiting PM review on the MESSAGE_PIPELINE_SPEC drift flag.

## Carry-forward watch items

### NEW from Experiment 3c — flag explicitly for PM

**(a) MESSAGE_PIPELINE_SPEC drift flagged by this session's drift watch.** Phase 2 Session B builds against `MESSAGE_PIPELINE_SPEC.md`, but the spec hasn't been touched since 2026-05-13 — predating the success-side DR capture (2b), the MO shape capture (2b), the STOP/HELP/START keyword behavior (4), and now the brand-upgrade in-place semantics (3c). Session B kickoff prep should include a spec reconciliation round: enumerate the Phase 1 findings that change the spec's contract, update the spec, surface for PM review. This is a prep-round task, not a build-round task.

**(b) BDR conversation queue grows by one question.** Add to the Elizabeth Garner conversation queue: **does the `BRAND_IDENTITY_STATUS_UPDATE` event reach API-consumer callback URLs in 2026, or is it still poll-only per the Sinch 10DLC API docs?** This sits alongside the four cumulative API/dashboard inconsistencies (state machine 5-vs-7, Simplified pricing $10-vs-$6, webhook policy poll-only-vs-dashboard-internal-firing observed in 3a, campaign monthly-fee $1.50/$0 disclosure inconsistency from 3b) and the Experiment 4 questions (Sinch internal opt-out tracking, per-campaign auto-response config). Single batched BDR conversation, not one per question.

**(c) Phase 5 design questions added from 3c open_questions.** New-campaign tier movement under FULL brand (existing campaign tiers didn't move; whether a new campaign created under the now-FULL brand gets better tiers requires submitting a new test campaign); use-case-level unlocks under FULL (campaign-creation wizard inspection stopped at step 1; step 3 use-case selector not reached); Sole Proprietor `brandEntityType` check under FULL (almost certainly negative per the API enum's structural absence, but a one-screenshot capture in a future session would close the question for free); `VETTED_VERIFIED` vs `VERIFIED` intermediate states (whether other IdentityStatus values exist during the brief Upgrade-in-progress window was not observable from the dashboard event log; may be observable via 10DLC API polling in a future experiment).

**(d) Brand bundle Company name correction.** Operational follow-up: update brand `BTTC6XS` Company name field from `VAULTED PRESS LLC` to `RelayKit LLC` via Sinch dashboard's `Update brand` affordance. Not experimental, not part of 3c's findings — just an item to clear before Phase 5 wizard work makes the stale name customer-visible.

### Surviving from Session 110 (no change this session unless flagged)

- **(a) Phase 4 consent-ledger architectural commitment** — still applies, scoped to Phase 4 when Phase 4 starts. Recorded as a Phase 4 design input, not a D-number.
- **(b) BDR question for Elizabeth Garner — Sinch internal opt-out tracking + per-campaign auto-response config** — still applies; merges into the cumulative BDR conversation queue (see new item (b) above).
- **Phase 2 Session B inputs (low-stakes)** — six success-side DRs added by Experiment 4 (no new variants beyond 2b's success-side); no HMAC on any Sinch XMS callback (finding now spans 2a + 2b + 4 = 3 MOs + 7 DRs; single-sample egress IP `54.173.29.238` triple-confirmed). Phase 2 Session B's signature-verification design must lean on IP allowlist / mTLS / secret path segment / dashboard feature.
- **MO→outbound correlation: NONE on the wire.** Phase 4 architectural choice — (a) treat MOs as standalone events routed by `to`-number only, or (b) derive threading via (`from`, `to`, recent-time-window) lookup.
- **MASTER_PLAN "Launch focus" refresh** — still overdue from Session 108. The "Active focus" section was rewritten this session (Phase 1 → Phase 2 Session B); the separate "Launch focus" section was not touched. Two different sections — refresh still pending.
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

1. **Five direct-on-main commits accumulated this session, all unpushed entering close-out:** `2ff3c78` (settings allowlist), `a815a3b` (Talking to Joel tightening), `fe35037` (approval heads-up guidance), `61f2477` (Experiment 3c substantive), and the close-out commit. Joel's push decision pending across the batch. Per CLAUDE.md step 11 the standing rule is "do NOT push — PM review first"; substantive commits typically push only after PM approval, close-out commits push under the mechanical-skip-review bar.

2. **CC permissions are now allowlist-based** per `2ff3c78`. `bypassPermissions` mode retired. This session is the first one running under the new regime. If a future session hits unexpected permission prompts on a tool that should be auto-allowed, check the `allow` patterns in `.claude/settings.json`. The `deny` list currently covers only destructive git operations (`git push --force*` / `git push -f*`); `ask` gates the sensitive surface (curl, `.env*`, secrets, `rm`, `git push` / `checkout` / `reset`, `cat .env*`).

3. **Phase 2 Session B kickoff is now unblocked.** Before any substantive Phase 2 code work, run a kickoff prep round: (a) **MESSAGE_PIPELINE_SPEC reconciliation** against the Phase 1 findings (ULID IDs, DR shapes, MO shape, terminal-status parser, no-HMAC envelope — see Drift watch above for the full list); (b) **batched BDR conversation** with Elizabeth Garner covering the four cumulative API/dashboard inconsistencies + the Experiment 3c BRAND_IDENTITY_STATUS_UPDATE callback-exposure question + the Experiment 4 opt-out tracking + per-campaign auto-response config; (c) **confirm the MO correlation architectural choice** is Phase 4's call, not Session B's; (d) **confirm webhook signature-verification design approach** (IP allowlist vs mTLS vs secret path vs dashboard feature).

4. **Sinch `BRAND_IDENTITY_STATUS_UPDATE` is the brand-lifecycle event type.** Same event type fires for Simplified registration (3a) and Full upgrade (3c); IdentityStatus values are the discriminator (`VERIFIED` for Simplified, `VETTED_VERIFIED` for Full). No upgrade-specific event type exists at the dashboard event-log layer. If Phase 5 wizard wants to surface "your brand is being upgraded" UI on its own surface, it needs to derive the discriminator from polling state, not from a dedicated upgrade event.

5. **Sinch FULL re-vetting does NOT enforce company-name/public-record consistency.** Brand bundle's stale `VAULTED PRESS LLC` field survived FULL re-vetting that returned `VETTED_VERIFIED`, despite RelayKit LLC being current per SC SOS. Phase 5 wizard design implication: RelayKit's customer-side identity-validation pre-flight (state SOS lookup before brand submission per `docs/CARRIER_BRAND_REGISTRATION_FIELDS.md` §Resubmission process) remains the only identity-drift safety net. The FULL upgrade step does not catch it.

6. **Path-dependent Sinch-cost framing** — a Simplified-only customer costs RelayKit $6; a customer who upgrades to Full costs RelayKit $50 cumulative ($6 + $44). The customer-facing $49 registration fee covers Simplified-only customers comfortably; it is underwater only on the upgrade path. Pricing model needs an upgrade-tier surcharge designed in (specific number TBD by pricing decision, not this experiment).

7. **Campaign-creation wizard is an 8-step flow.** Captured order: Select numbers → Select brand → Select use case → Supporting Documentation Upload → Campaign overview → Message flow and sample messages → Additional information → Review and finish. Useful when Phase 5 wizard design references the upstream Sinch flow shape.

### Surviving gotchas from prior sessions (no change this session)

- **Wrangler tail invocation pattern across 2a/2b/4:** `cd experiments/sinch/webhook-receiver && nohup npx wrangler@latest tail --format json > /tmp/wrangler-N.log 2>&1 & echo $! > /tmp/wrangler-N.pid`. Useful any time Phase 2/4 wants to inspect inbound webhook payloads.
- **Sinch's `mo_text` is the unified MO discriminator** across plain replies (2b) AND STOP/HELP/START keywords (4). Phase 4 dispatcher branches by `type` first, then keyword-matches the body for `mo_text` events.
- **Sinch dashboard surfaces no customer-facing opt-out view.** If you need to inspect opt-out state, options are: (a) the experiment fixtures themselves; (b) BDR conversation; (c) RelayKit's own consent ledger (Phase 4 work).
- **Receiver behavior held up unchanged across 2a / 2b / 4.** Worker source `experiments/sinch/webhook-receiver/src/index.js` (18 lines, Session 49 scaffold) needs no modification for further inbound-touching experiments.
- **`STATE_VERSION 3→4` silent drop** (Session 106 carry).
- **`isCompliant` = "no blockers"** (D-415).
- **Tiptap `categoryVariables` is context-driven** (Session 107).
- **`MessageOverride` retirement is complete** (Session 107).
- **`.pm-review.md` is gitignored** (Session 109).
- **Untracked carry-forward files**: `.agents/`, `AGENTS.md`, `docs/POST_TOPICS.md`, `api/node_modules/`.

## Files modified this session

8 unique:

- `.claude/settings.json` — commit `2ff3c78`: bypassPermissions → allow/ask/deny lists.
- `PM_PROJECT_INSTRUCTIONS.md` — commits `a815a3b` + `fe35037`: §PM behavior "Talking to Joel" paragraph rewritten; §Operational tips bullet added for permission-approval heads-up guidance.
- `experiments/sinch/experiments-log.md` — commit `61f2477`: §Experiment 3c status flipped BLOCKED → COMPLETE (both top and bottom Status lines); Findings + Implications (Phase 2 Session B + Phase 5 + Phase 4 = none) + Leaves open subsections appended.
- `experiments/sinch/fixtures/exp-03c-brand-upgrade.json` — commit `61f2477`: new file (286 lines). 3c bidirectional capture per the Phase 5 schema spec.
- `docs/CARRIER_BRAND_REGISTRATION_FIELDS.md` — commit `61f2477`: §IdentityStatus rewritten as two-row table; §Bundle state table updated for `UPGRADE` → `Upgrade` mapping confirmation and `REJECTED` → `Rejected` upgrade-from-unconfirmed-to-observed, cumulative inconsistency count corrected from "three" (3a-era stale) to "four" (3a/3b cycle accurate); new top-level `## FULL upgrade path` section.
- `MASTER_PLAN.md` — close-out commit: §Active focus rewritten Phase 1 → Phase 2 Session B.
- `REPO_INDEX.md` — close-out commit: Meta block (last_updated + active phase + branch state — five Session 111 commits enumerated; decision count unchanged at 330); canonical docs table rows for MASTER_PLAN/REPO_INDEX/CC_HANDOFF/CARRIER_BRAND_REGISTRATION_FIELDS updated; `/experiments` subdirectory entry rewritten for Phase 1 complete + exp-03c fixture pointer.
- `CC_HANDOFF.md` — this file, overwritten.

## Unmerged branches

None. All commits on `main`.

## Suggested next session

1. **Phase 2 Session B kickoff prep** — see Gotcha 3. Pre-work before substantive Phase 2 code work: spec reconciliation against Phase 1 findings, batched BDR conversation, MO correlation architectural-choice confirmation, signature-verification design approach. Not the build itself — the prep round that unblocks the build. **Most consequential next pickup; named in MASTER_PLAN Active focus.**

2. **Push pending commits** — five unpushed direct-on-main commits accumulated this session (settings allowlist + 2× PM_PROJECT_INSTRUCTIONS edits + 3c substantive + close-out). Per CLAUDE.md step 11, push is gated on PM review. The substantive 3c commit was PM-approved in-chat before commit; the three early-session commits were Joel-directed mechanical edits; the close-out commit follows the mechanical-skip-review bar per Joel's direction this session. Joel's push call.

3. **MASTER_PLAN "Launch focus" refresh** — separately scoped from §Active focus; carry-forward from Session 108. Active focus updated this session; Launch focus untouched. Different sections.

4. **Brand bundle Company name correction** — RelayKit operational follow-up: update brand `BTTC6XS` Company name field from `VAULTED PRESS LLC` to `RelayKit LLC` via Sinch dashboard `Update brand`. Not experimental; out of scope for 3c but worth queueing before Phase 5 wizard work makes the stale name customer-visible.

5. **Focused DECISIONS retirement sweep session** — recommended per Retirement sweep findings above. Chunked Reads of `DECISIONS.md`, scan for stale-language carry-forwards (D-378, D-380, D-389/D-391/D-392/D-395/D-401), surface specific archive candidates for PM review. Closes the Phase 1 → Phase 2 boundary's full sweep obligation.

Doc carry-forwards from prior sessions still viable as fillers or a parallel doc session.
