# CC_HANDOFF — Session 110 — Experiment 4 STOP/START/HELP complete + Phase 4 consent-ledger commitment

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.

**Date:** 2026-05-24
**Branches:** `main` only — two commits direct on main. `8abc4c3` (Experiment 4 capture, amended from `ca83174` mid-session per PM direction to elevate Round 5 phone-receipt to explicit Joel-confirmation) pushed after PM approval; this close-out commit pushes per the mechanical-skip-review bar. No feature branches. Second 2026-05-24 session — Session 109 (earlier today) was Experiment 2b; this one (Session 110) ran Experiment 4.

`Commits: 2 | Files modified: 4 unique | Decisions added: 0 | External actions: 8 (2 git pushes + 6 outbound SMS via Sinch XMS API)`

---

## Session character

Phase 1 Experiment 4 (STOP/START/HELP keyword handling) execution end-to-end. Same receiver pattern as Sessions 49 / 109; same wrangler-tail-to-/tmp/wrangler-N.log pattern; same env-only fetch() send-script pattern, rescaffolded from scratch per Session 109 Gotcha 1. Pre-flight verified by Joel in the Sinch dashboard (campaign `CU4IUD0` APPROVED, `+12013619609` Active with all carriers REGISTERED, Service Plan callback URL on the workers.dev receiver). Joel could not locate any opt-out / unsubscribed-numbers view in the Sinch dashboard — a Phase 4 finding in itself, not a procedural blocker. Pre-test opt-out state for the target number was verified evidence-backed-clean by auditing every body in `exp-02b-mo-inbound.json` (no STOP-class keyword anywhere; 2b is the only prior experiment to touch `+12066013506`).

Five rounds executed end-to-end: Round 1 setup outbound + DR; Round 2 STOP MO; Round 3 post-STOP blocked-outbound verification (the load-bearing round — Joel phone-confirmed end-to-end delivery, proving Sinch is a fully transparent passthrough on STOP); Round 4 HELP MO + post-HELP non-toggle verification; Round 5 START MO + post-START verification. Every round's keyword-MO type discriminator was `mo_text` (same as 2b's plain-text MOs); body was the literal uppercase keyword; no auto-response was synthesized by Sinch on any of the three keywords for campaign CU4IUD0; every Joel-side action was paste-confirmed in the same turn. Round 5's post-START verification was initially captured with the phone receipt inferred from Sinch's Delivered DR rather than Joel-confirmed on device; PM direction at amend-time elevated it to the same explicit-confirmation standard as Rounds 3 and 4 — Experiment 4 now has zero inferred data points.

PM-review cadence applied to the substantive commit. Throwaway `send-keyword-test.mjs` deleted at experiment close per Session 109 hygiene precedent. Wrangler tail process killed. `/tmp/wrangler-4.log` retained on disk for the rest of the session (raw record, not in repo, not committed).

## Commits — chronological

1. `8abc4c3` — **`experiments(sinch): 4 — STOP/START/HELP keyword handling captured`.** Originally landed as `ca83174` mid-session; amended (per PM direction) to elevate Round 5 post-START phone receipt from inferred to Joel-confirmed in both `exp-04-keyword-handling.json` and `experiments-log.md`. New file `experiments/sinch/fixtures/exp-04-keyword-handling.json` (593 lines — 5 rounds bidirectional, pre-test opt-out state block, timing table with DR + MO envelopes, events breakdown, 6-item notes block). `experiments/sinch/experiments-log.md`: renamed the prior "Experiment 5" draft section (lines 447–497 in the pre-commit file) to Experiment 4; replaced four-part-draft Procedure with five-round executed procedure; appended full Findings + Implications for Phase 4 (architectural commitment) + Implications for Phase 2 Session B + Leaves Open subsection; forward-linked the two 2b cross-references (line 220 procedure note, line 301 implications) and the 3b cycle's downstream-unblocks line; surviving "Experiment 5" mentions are intentional historical-record breadcrumbs ("formerly Experiment 5 in v1.1") for git-archaeology. 2 files / +690 / −36. PM-approved before push (both pre-amend and post-amend).

2. **This commit — close-out.** Doc-only sweep: REPO_INDEX meta active-phase line updated (Experiments 2b and 4 complete; 3c is the last Phase 1 experiment); branch state line refreshed (Session 110 commits); `/experiments` subdirectories entry updated with exp-04 fixture pointer and Experiment 4 status; REPO_INDEX.md and CC_HANDOFF.md rows in canonical docs table updated for Session 110; CC_HANDOFF overwritten. Mechanical, skip review per PM direction.

## Quality checks

- No tsc/eslint — `/experiments` is throwaway code per `experiments/sinch/experiments-log.md` rules; close-out is doc-only.
- Receiver liveness verified end-to-end via tail capture of 10 events (1 connectivity probe + 6 DR callbacks + 3 MO callbacks). Probe POST returned 200 in 109ms warm. DR callbacks arrived 1.945–3.456s post-send response across the 6 rounds. MO callbacks arrived 342–560ms post-Sinch-received across the 3 rounds.
- Sinch dashboard pre-flight Joel-side: campaign `CU4IUD0` APPROVED, `+12013619609` Active with all carriers REGISTERED — confirmed before any send. Opt-out / unsubscribed-numbers view not surfaced anywhere in the dashboard (flagged for BDR — see Carry-forward).
- Pre-test opt-out state verified clean via 2b fixture body audit (evidence-backed, not assumed). Every body sent to/from `+12066013506` in 2b is recorded; no STOP-class keyword in any body.
- Send-script env-only behavior verified before the first send (CLI-only body input; fail-fast on missing env; Bearer token redacted to `{SINCH_API_TOKEN}` in captured output).

## Decisions

None. Experiment findings recorded as findings, not decisions, per the proving-ground rules. The Phase 4 architectural commitment that Experiment 4 surfaced (RelayKit owns the consent / opt-out ledger and enforces STOP / HELP-class semantics end-to-end) is explicitly flagged below as a Phase 4 design input, not recorded as a D-number per PM direction at finding-time.

D-counts unchanged: 330 active, latest D-415; archive D-01–D-83.

## Exploration-doc disposition

No exploration doc movement this session.

## Retirement sweep / drift watch

Both skipped — mid-phase (Phase 1 Sinch Proving Ground still active; 3c remains).

## Carry-forward watch items

### NEW from Experiment 4 — flag explicitly for PM / Phase 4 design

**(a) Phase 4 consent-ledger architectural commitment — RelayKit owns opt-out enforcement end to end.** Recorded as a Phase 4 design input (NOT a D-number, per PM direction). Full statement in `experiments/sinch/experiments-log.md` §Experiment 4 → Implications for Phase 4. The summary:

- **Sinch is a fully transparent passthrough on STOP / HELP / START for campaign CU4IUD0.** Round 3 proved end-to-end: API returned HTTP 201, DR callback reported `Delivered` (code 0), and Joel's phone received the post-STOP outbound. Same observed for post-HELP and post-START. No API-layer block, no DR-layer failure, no carrier-layer silent drop.
- **Keyword MOs arrive as `type: "mo_text"` with the literal uppercase keyword in `body`** — same discriminator as plain replies; no distinct event type, no flag field, no nested indicator.
- **Sinch does not synthesize auto-responses** for any of the three keywords on this campaign (waited 2 minutes per round; nothing reached Joel's phone).
- **No opt-out view is surfaced to the customer in the Sinch dashboard** anywhere Joel could find.

The architectural shape (specified in §Experiment 4): keyword detection on `body` for `mo_text` events; consent ledger `(customer_id, phone_number, status, last_changed_at, last_changed_by_event_id)` with status enum `subscribed | opted_out | help_requested`; outbound suppression as a pre-send check against the ledger; auto-response synthesis owned by RelayKit per carrier guidelines; event-source preservation for auditability. This becomes a Phase 4 work item when Phase 4 starts.

**(b) BDR question for Elizabeth Garner — does Sinch track opt-outs internally at all, and is there a non-public API endpoint?** Joel could not locate any opt-out / unsubscribed-numbers view in the Sinch dashboard; the public XMS API surface we've exercised exposes no opt-out query endpoint. Two scenarios:

- Sinch tracks opt-outs internally but doesn't surface them to the customer (in which case there may be a non-public API or partner-tier endpoint we don't know about).
- Sinch doesn't track opt-outs at all and the entire compliance posture is the customer's responsibility.

Either resolves to the same Phase 4 commitment (RelayKit owns its own ledger regardless) — but the answer affects what RelayKit can claim externally and whether there's a defense-in-depth signal worth subscribing to. Also implicates the per-campaign auto-response configuration question — whether Sinch's dashboard exposes a "Sinch handles STOP auto-response" toggle that was off by default for CU4IUD0, or never offers it. Single question to ask BDR; two clarifications to come back with.

### NEW from Experiment 4 — Phase 2 Session B inputs (low-stakes)

- **Six more success-side `delivery_report_sms` callbacks captured.** Shape unchanged from 2b; no new variants surfaced. Phase 2's terminal-status parser remains a single-branch function on `statuses[].status` (no Phase 2-design input change from this experiment beyond confirming the parser is stable).
- **No HMAC on any Sinch XMS callback — finding now spans 2a + 2b + 4** (3 MOs + 6 success-side DRs added by 4). Phase 2 Session B's signature-verification design must lean on IP allowlist / mTLS / secret path segment / dashboard feature. The single-sample Sinch egress IP `54.173.29.238` (AWS Ashburn, ASN 14618) is now triple-confirmed; capture the full Sinch egress range from BDR before locking in.

### Surviving from Session 109 (no change this session)

- **MO→outbound correlation: NONE on the wire.** Phase 4 architectural choice — (a) treat MOs as standalone events routed by `to`-number only, or (b) derive threading via (`from`, `to`, recent-time-window) lookup. 2b's finding stands; Experiment 4 adds no new wire-level correlation signal (all 3 MOs were unsolicited keyword replies, not in a thread context).
- **MASTER_PLAN "Launch focus" refresh** — most overdue carry-forward.
- **`MobileCategoriesModal` latent scroll-lock pattern.**
- **D-389/D-391/D-392/D-395/D-401 stale positional-language cleanup.**
- **PostHog dashboard rename pass.**
- **PostHog vs Plausible/Fathom reconciliation** in `docs/MARKETING_STRATEGY.md`.
- **Tooltip touch-event handling / `aria-describedby` / viewport-edge positioning.**
- **D-378's stale parenthetical; D-380 drift carry-over.**
- **`docs/POST_TOPICS.md` still untracked.**
- **Per-message "revert to RelayKit's default" configurator fast-follow.**
- **Slash-command-for-variable-insertion configurator fast-follow.**

## Gotchas for next session

1. **Throwaway `send-keyword-test.mjs` was deleted post-Experiment 4** (same hygiene as Session 109's `send-mo-test.mjs`). Experiment 3c does not need it — 3c is dashboard-only (brand SIMPLIFIED→FULL upgrade flow); no API sends.
2. **`.env.experiment-4.local`** is on Joel's disk and gitignored (via `.env*.local`). Useful template for any future outbound-driven experiment — rename and the existing rule still matches. Experiment 3c will not need it.
3. **Wrangler tail invocation pattern that worked (third confirmation).** `cd experiments/sinch/webhook-receiver && nohup npx wrangler@latest tail --format json > /tmp/wrangler-N.log 2>&1 & echo $! > /tmp/wrangler-N.pid`. JSON-per-event output flushes line-by-line; readable mid-stream via `tail -c N /tmp/wrangler-N.log`. The captured PID is the wrapper bash process; the actual wrangler node process is a child (use `pgrep -P` to find). Kill with `kill $(pgrep -P $(cat /tmp/wrangler-N.pid))` then `kill $(cat /tmp/wrangler-N.pid)`. Wrangler is authenticated to `joelnatkin@mac.com`'s Cloudflare account with `workers_tail (read)` scope. Experiment 3c does not need wrangler tail (dashboard-only).
4. **Sinch's `mo_text` type is the unified MO discriminator** across plain replies (2b) AND STOP/HELP/START keywords (4). Phase 4 dispatcher branches by `type` first, then keyword-matches the body for `mo_text` events. No per-keyword type discriminator at the Sinch wire layer.
5. **Sinch dashboard surfaces no customer-facing opt-out view.** If you need to inspect opt-out state, options are: (a) the experiment fixtures themselves (authoritative for the test number); (b) BDR conversation (carry-forward (b) above); (c) building RelayKit's own consent ledger (Phase 4 work).
6. **Receiver behavior held up unchanged across 2a / 2b / 4.** Worker source `experiments/sinch/webhook-receiver/src/index.js` (18 lines, Session 49 scaffold) needs no modification for further inbound-touching experiments. Sinch Service Plan Default Callback URL still set to the worker's `.workers.dev` URL.

### Surviving from prior sessions (no change this session)

- **`STATE_VERSION 3→4` silent drop continues** (Session 106 → 110 carry-forward).
- **`isCompliant` = "no blockers"** (D-415).
- **Tiptap `categoryVariables` is context-driven** (Session 107).
- **`MessageOverride` retirement is complete** (Session 107).
- **`.pm-review.md` is gitignored** (Session 109).
- **Untracked carry-forward files**: `.agents/`, `AGENTS.md`, `docs/POST_TOPICS.md`, `api/node_modules/`.

## Files modified this session

4 unique:

- `experiments/sinch/experiments-log.md` — §Experiment 5 draft (lines 447–497 pre-commit) renamed and rewritten in place as §Experiment 4 with executed Procedure + full Findings + Implications for Phase 4 + Implications for Phase 2 Session B + Leaves Open + Status: COMPLETE; three cross-reference forward-links updated (lines 220, 301, 631).
- `experiments/sinch/fixtures/exp-04-keyword-handling.json` — new file (593 lines). 5-round bidirectional fixture mirroring 2b's schema, expanded for STOP/HELP/START keyword rounds plus pre-test opt-out state block and 6-item notes block. Bearer tokens redacted to `{SINCH_API_TOKEN}`.
- `REPO_INDEX.md` — meta active-phase line updated (Experiments 2b + 4 complete; 3c is the last Phase 1 experiment); branch state line refreshed for Session 110; `/experiments` subdirectories entry expanded with exp-04 fixture pointer; canonical docs table rows for REPO_INDEX.md and CC_HANDOFF.md updated for Session 110.
- `CC_HANDOFF.md` — this file, overwritten.

(Removed from disk, never tracked: `experiments/sinch/send-keyword-test.mjs` — throwaway send script per the Session 109 hygiene precedent.)

## Unmerged branches

None. All commits on `main`.

## Suggested next session

1. **Phase 1 Experiment 3c — Brand SIMPLIFIED → FULL upgrade.** The last remaining Phase 1 experiment. Captures upgrade-path findings (cost, retained brand ID, FULL approval timing, what FULL unlocks, UI vs API path) for Phase 5 wizard design. Existing procedure draft in `experiments/sinch/experiments-log.md` §Experiment 3c. Dashboard-only — no wrangler tail, no env file, no throwaway send script. Cost is real ($50 rumored, to verify).
2. **Phase 2 Session B kickoff** — sits behind 3c per MASTER_PLAN. Substantially de-risked by 2a + 2b + 4: success-side and failure-side DR shapes both characterized; MO shape characterized (including for keyword MOs); no HMAC across the inbound surface; no segment reassembly needed; one-function-on-status terminal parser. The MO-correlation question and the consent-ledger commitment are both Phase 4 — they don't block Session B.
3. **BDR conversation with Elizabeth Garner** — combine the four cumulative inconsistencies from 2a/3a/3b with the new Experiment 4 questions (opt-out internal tracking + per-campaign auto-response config). Single batched conversation, not one per question.
4. **MASTER_PLAN "Launch focus" refresh** — separately scoped; most overdue carry-forward from Session 108.

Doc carry-forwards from Session 103/105/106/107/109 still viable as fillers or a parallel doc session.
