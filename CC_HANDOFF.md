# CC_HANDOFF — Session 109 — Experiment 2b complete + .pm-review.md gitignore hygiene

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.

**Date:** 2026-05-24
**Branches:** `main` only — three commits direct on main; first two pushed mid-session after PM approval, this close-out pushes per the mechanical-skip-review bar. No feature branches. Second session on 2026-05-24 — Session 108 (earlier today) was the MASTER_PLAN status correction; this one ran Experiment 2b.

`Commits: 3 | Files modified: 5 unique | Decisions added: 0 | External actions: 3 git pushes + 2 outbound SMS via Sinch XMS API`

---

## Session character

Phase 1 Experiment 2b execution end-to-end. Pre-flight verified by Joel in the Sinch dashboard (campaign `CU4IUD0` APPROVED, `+12013619609` Active with all carriers REGISTERED). Receiver was the unchanged Cloudflare Worker from Session 49 (`https://sinch-webhook-receiver.joelnatkin.workers.dev/`) — probed live with `curl` before sends, captured all callbacks in `wrangler tail` (JSON-per-event format streaming to `/tmp/wrangler-2b.log`). Two outbound sends + two MO replies (short body, then ~290-char body forcing UCS-2 multi-segment). All five events (1 connectivity probe + 2 DRs + 2 MOs) captured cleanly. Throwaway send script (`experiments/sinch/send-mo-test.mjs`) followed the Exp-1 `send-one.mjs` precedent — env-only credentials, no hardcoded secrets, Authorization redacted to `{SINCH_API_TOKEN}` in captured output, deleted from disk in the hygiene commit. PM-review cadence applied to both code-bearing commits.

## Commits — chronological

1. `17777c9` — **`experiments(sinch): 2b — inbound MO message shape captured`.** New file `experiments/sinch/fixtures/exp-02b-mo-inbound.json` (217 lines — bidirectional fixture: 2 rounds × {outbound_send + delivery_report_callback + mo_callback}, plus timing + notes). `experiments/sinch/experiments-log.md` §Experiment 2b: top-level Status flipped from `BLOCKED on 3b approval...` to `complete (2026-05-24)`; closing Status flipped from `BLOCKED on 3b approval...` to `COMPLETE — captured 2026-05-24.`; full Findings (transport signals, payload shapes, timing summary) + Implications for Phase 2 Session B and Phase 4 added in between. 2 files / +284 / −2. PM-approved before push.

2. `77d32c4` — **`chore: gitignore .pm-review.md; drop throwaway send-mo-test.mjs`.** `.gitignore` +3 lines (`.pm-review.md` rule + section comment). `send-mo-test.mjs` removed from disk (was never tracked — Exp-1 send-one.mjs precedent). CLAUDE.md's "PM review cadence" claim that `.pm-review.md` is gitignored is now true. 1 file / +3 / 0. PM-approved before push.

3. **This commit — close-out.** Doc-only sweep: REPO_INDEX meta active-phase line updated (2b complete, 3c/4 remain); `/experiments` subdirectories entry expanded with 2b fixture pointer + current experiment status; CC_HANDOFF.md row in docs table updated for Session 109; CC_HANDOFF overwritten. Mechanical, skip review per PM direction.

## Quality checks

- No tsc/eslint — experiments dir is throwaway code per `experiments/sinch/experiments-log.md` rules; close-out itself is doc-only.
- Receiver liveness verified end-to-end via tail capture of all 5 events (1 connectivity probe + 2 delivery reports + 2 MOs). Probe POST returned in 65ms warm; DR callbacks arrived 2.5–3.3s post-send; MO callbacks arrived 683–821ms post-Sinch-receive.
- Sinch dashboard pre-flight Joel-side: campaign CU4IUD0 APPROVED, +12013619609 Active with all carriers REGISTERED — confirmed before any send.
- Send script env-only behavior verified before the first send (missing-env probe exited 1 with clear message; no defaults, no hardcoded credentials, no network call on env failure).

## Decisions

None. Experiment findings are recorded as findings, not decisions, per the `experiments/sinch/experiments-log.md` proving-ground rules. The architectural choice 2b surfaced (MO-to-outbound correlation strategy — see Carry-forward below) is explicitly flagged for PM and Phase 4 design, not recorded unilaterally.

D-counts unchanged: 330 active, latest D-415; archive D-01–D-83.

## Exploration-doc disposition

No exploration doc movement this session.

## Retirement sweep / drift watch

Both skipped — mid-phase (Phase 1 Sinch Proving Ground still active).

## Carry-forward watch items

### NEW from 2b — flag for PM / Phase 4 design

**MO callbacks carry no correlation field back to the outbound `batch_id`.** No `reply_to`, no thread, no conversation ID on the wire from Sinch. Phase 4's design must pick one of:

- **(a)** Treat MOs as standalone events routed to the owning customer by `to`-number only — no conversation threading.
- **(b)** Derive conversation threading via (`from`, `to`, recent-time-window) lookup against recent outbound history.

Either is defensible. The decision belongs to Phase 4 design, not this experiment. 2b records the finding only; full context in `experiments/sinch/experiments-log.md` §Experiment 2b Findings + Implications for Phase 4 (1)–(5).

### NEW from 2b — Phase 2 Session B kickoff input

- **No HMAC / signature / shared-secret header on any Sinch XMS callback (DR or MO).** 2a flagged this for DR; 2b confirms it for the full inbound surface. Phase 2 Session B's webhook-signature-verification design must rely on IP allowlist (sample observed: `54.173.29.238`, AWS Ashburn, ASN 14618 — capture the full Sinch egress range from BDR before locking in), mTLS, secret path segment, or a Sinch dashboard feature not enabled by default.
- **Success-side `delivery_report_sms` shape matches 2a's failure-side exactly.** Phase 2's terminal-status parser is one function branching on `statuses[].status` enum (`Delivered` / `Failed` / future values catalogued as they surface). No shape divergence between terminal states.

### Potential MASTER_PLAN drift (NOT flagged for fix this session)

MASTER_PLAN "Active focus" still lists 2b alongside 3c/4 as remaining experiments. With 2b complete, the line is slightly stale but not wrong. A future doc-touch session can pick it up; not a status correction at this session's scope and Joel did not flag it for update.

### Surviving from Session 108 (no change this session)

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

1. **Throwaway `send-mo-test.mjs` was deleted post-2b.** Experiment 4 (STOP/START/HELP) — and any other outbound-driven experiment — must rescaffold a similar script. Pattern from this session: minimal `fetch()` script reading `SINCH_API_TOKEN` / `SINCH_SERVICE_PLAN_ID` / `SINCH_FROM_NUMBER` / target-phone from env only; emits captured JSON with Bearer token redacted to `{SINCH_API_TOKEN}`. Fail-fast if any env var missing — no defaults, no hardcoded credentials.
2. **`.env.experiment-2b.local`** is on Joel's disk and gitignored (via `.env*.local`) — useful template for Exp 4's env file (rename to `.env.experiment-4.local` and the existing rule still matches).
3. **`.pm-review.md` is now gitignored** from this session forward. CLAUDE.md "PM review cadence" claim is now true. (Previously: file was untracked but at risk from any broad `git add .`.)
4. **Wrangler tail invocation pattern that worked.** `cd experiments/sinch/webhook-receiver && nohup npx wrangler@latest tail --format json > /tmp/wrangler-N.log 2>&1 & echo $! > /tmp/wrangler-N.pid`. JSON-per-event output flushes line-by-line; readable mid-stream via `tail -c 14000 /tmp/wrangler-N.log`. Kill with `kill $(cat /tmp/wrangler-N.pid)`. Wrangler is authenticated to `joelnatkin@mac.com`'s Cloudflare account with `workers_tail (read)` scope.
5. **Sinch egress IP sample for allowlist design:** `54.173.29.238` (AWS Ashburn, ASN 14618). Single sample only — capture the full Sinch egress range from BDR before locking down Phase 2 Session B's signature-verification design.
6. **2b receiver behavior held up unchanged.** Worker source `experiments/sinch/webhook-receiver/src/index.js` (18 lines, Session 49 scaffold) needs no modification for further inbound experiments. Sinch Service Plan Default Callback URL is set to the worker's `.workers.dev` URL.

### Surviving from prior sessions (no change this session)

- **`STATE_VERSION 3→4` silent drop continues** (Session 106 → 108 carry-forward).
- **`isCompliant` = "no blockers"** (D-415).
- **Tiptap `categoryVariables` is context-driven** (Session 107).
- **`MessageOverride` retirement is complete** (Session 107).
- **Untracked carry-forward files**: `.agents/`, `AGENTS.md`, `docs/POST_TOPICS.md`, `api/node_modules/`. (`.pm-review.md` was previously on this list; now removed — gitignored as of this session.)

## Files modified this session

5 unique:

- `experiments/sinch/experiments-log.md` — §Experiment 2b: top-level Status flipped (line 209); closing Status flipped (line 304); ~95 lines of Findings + Implications added between them.
- `experiments/sinch/fixtures/exp-02b-mo-inbound.json` — new file (217 lines). Bidirectional fixture mirroring `exp-02a-delivery-report.json`'s schema, expanded for two rounds (short + long body) plus the MO callback shape.
- `.gitignore` — `.pm-review.md` rule added with section comment (3 lines).
- `REPO_INDEX.md` — meta active-phase line updated (2b complete, 3c/4 remain); `/experiments` subdirectories entry expanded with 2b fixture pointer + experiment-status summary; CC_HANDOFF.md row in docs table updated for Session 109.
- `CC_HANDOFF.md` — this file, overwritten.

(Removed from disk, never tracked: `experiments/sinch/send-mo-test.mjs` — throwaway send script per Exp-1 precedent.)

## Unmerged branches

None. All commits on `main`.

## Suggested next session

1. **Phase 1 Experiment 3c — Brand SIMPLIFIED → FULL upgrade.** Captures the upgrade-path findings for Phase 5 wizard design. Status was BLOCKED on 3b approval; now unblocked. Existing procedure draft in `experiments/sinch/experiments-log.md` §Experiment 3c.
2. **Phase 1 Experiment 4 — STOP / START / HELP reply handling.** Natural follow-on to 2b: reuses the same receiver, the same outbound send pattern (rescaffold script per Gotcha 1), the same env-file pattern. Captures the keyword-discriminator MO payload (whether STOP-class events arrive as `type: "mo_text"` or a separate type value), Sinch-side opt-out enforcement, and any auto-response Sinch may inject.
3. **Phase 2 Session B kickoff** — sits behind Exp 4 per MASTER_PLAN. 2b substantially de-risked Session B's failure-detection and inbound-handler design (one DR parser for both terminal states; no segment reassembly; no HMAC).
4. **MASTER_PLAN "Launch focus" refresh** — separately scoped; most overdue carry-forward from Session 108.

Doc carry-forwards from Session 103/105/106/107 still viable as fillers or a parallel doc session.
