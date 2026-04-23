# CC_HANDOFF.md — Session Handoff
**Date:** 2026-04-23 (Session 44 — Phase 1 Experiment 1 + 1b capture; doc-only, first Phase 1 finding landing in `/experiments/sinch/experiments-log.md`)
**Branch:** main (two unpushed commits local, pending PM approval; Session 43's commits + Joel's standalone PM-instructions edit all on `origin/main` at session start)

---

## Commits This Session

Two atomic commits on top of `bd5f425`. Neither pushed.

```
58e95a6    docs: session 44 — Experiment 1 + 1b capture (Phase 1)
[pending]  docs: session 44 close-out — CC_HANDOFF + REPO_INDEX + BACKLOG bumps
```

Session-start reality check: HEAD was `bd5f425` = `origin/main`. Joel pushed Session 43's two commits (`42b151d` + `7393029`) between sessions and also committed his own `PM_PROJECT_INSTRUCTIONS.md` edit (`bd5f425 docs: update PM instructions — docs hygiene, temporal drift, doc-only session guidance`). Zero unpushed at Session 44 start. Working tree clean except the intentional untracked `api/node_modules/`. `PM_PROJECT_INSTRUCTIONS.md` is NOT modified this session — Joel's Session 43-era working-tree edit is now committed and pushed as `bd5f425`; Session 44 did not touch that file.

---

## What Was Completed

Three deliverables in two atomic commits. All executing against Phase 1 of MASTER_PLAN — the Sinch proving-ground experiments. First real external-behavior finding lands this session.

### Deliverable 1 — Raw fixtures captured (2 new files, Commit 1)

- **`/experiments/sinch/fixtures/exp-01-outbound.json`** (33 lines) — full request/response capture from a successful XMS API send at 2026-04-23T17:24:48Z. Request: POST `https://us.sms.api.sinch.com/xms/v1/{servicePlanId}/batches` with `{ from: "+12013619609", to: ["+12066013506"], body: "..." }` and Bearer token auth. Response: HTTP 201 in 240ms with full Sinch batch object (`id` ULID `01KPXNYXGCX1GYDBJ9HF0Y9CCM`, `type: "mt_text"`, `canceled: false`, `delivery_report: "none"`, `expire_at` +72h, `flash_message: false`, etc.). `phone_received: false` recorded — key finding is the silent carrier-side drop on unregistered 10DLC.
- **`/experiments/sinch/fixtures/exp-01b-delivery-report-rejected.json`** (17 lines) — error-shape capture at 17:31:40Z. Same endpoint + auth; adding `delivery_report: "full"` to the request body returns HTTP 403 in 129ms with `{ code: "missing_callback_url", text: "Requesting delivery report without any callback URL." }`. Establishes Sinch's error-object shape (code + text, snake_case identifier + human message) — a separate dimension from the success-path shape.

Both fixtures follow the `{servicePlanId}` / `{SINCH_API_TOKEN}` placeholder convention so they're safe to commit. No live credentials in git.

### Deliverable 2 — `experiments-log.md` Findings filled in + Experiment 1b section added (1 file modified, Commit 1)

- **Experiment 1 Findings block** — the empty 7-bullet template Session 43 seeded is replaced with a 9-bullet captured-result block (phone number + cost, auth shape including the OAuth2-vs-XMS-token distinction, endpoint + region, request/response shapes, 201 status, 240ms latency, `phone_received: NO`, error-shape cross-reference to 1b) plus a 5-item Implications-for-Phase-2-Session-B subsection (auth choice is legacy XMS not OAuth2; silent carrier drops are baseline failure mode; ID is ULID not UUID; Sinch dashboard "Try the service" UI is broken and unusable for debugging; Open-F-1 delivery-status webhook scope gains real urgency). Status footer: `COMPLETE — captured 2026-04-23.`
- **Experiment 1b section** — new H2 block appended after Experiment 1. Status + Goal + Findings (4-item bullet list: 403 status, error shape, 129ms latency on rejection, implication that callback URL is prerequisite for ANY delivery-report capture) + `COMPLETE — captured 2026-04-23.` footer. Separate from Experiment 1 because it's a distinct characterization (rejection-path shape, not happy-path shape) and worth finding-level visibility for Phase 2 planning.

### Deliverable 3 — Experiment 2 stub added to `experiments-log.md` (same file, same commit)

- **Experiment 2 block** — new H2 block appended after Experiment 1b. Status: `not yet run`. Goal: stand up public webhook endpoint, configure as Service Plan callback URL, send with `delivery_report:full`, capture delivery-report payload Sinch posts to the callback; also tests inbound MO message handling (reply to the test send). Procedure section stubbed with `_To be drafted before running._` — PM writes the procedure before Joel runs the experiment, consistent with Experiment 1's model. Status footer: `NOT STARTED.`

Experiment 2 is the natural next Phase 1 step for two independent reasons: (a) Experiment 1b established that no delivery-report payload can be captured without a callback URL, and (b) inbound webhook capture was already the planned Experiment 2 scope from MASTER_PLAN §5. These two needs converge cleanly into a single experiment.

### Deliverable 4 — Close-out (Commit 2, this commit)

- **CC_HANDOFF.md** — overwritten (this file).
- **REPO_INDEX.md** — `Last updated` bumped to 2026-04-23 Session 44. `Unpushed local commits` updated (2 commits `58e95a6` + this close-out; Session 43's commits pushed between sessions). Subdirectories `/experiments/sinch/` entry notes fixtures directory now holds 2 captured fixtures. Change log Session 44 entry appended with all deliverables + key findings.
- **BACKLOG.md** — new entry under Infrastructure & Operations: pre-Phase-2 DECISIONS.md audit (review D-84 through D-362 for internal consistency, identify superseded/conflicting decisions, propose consolidation; 3–4 hours CC + 1–2 hours PM↔Joel resolution; run before Phase 2 Session B kickoff).

### DECISIONS.md

No new D-numbers. Experiment captures are observations, not architectural decisions. The implications flagged in Findings may surface D-numbers in later sessions (e.g., "carrier_message_id column accepts ULIDs" could become a schema decision during Phase 2 planning), but nothing that needs recording now.

### MASTER_PLAN.md, PROTOTYPE_SPEC.md, CLAUDE.md, all spec docs

Untouched Session 44. No scope shifts, no screen changes, no standing-instruction changes.

---

## Current State

**Phase 0 — CLOSED** (Session 41 Group F).

**Phase 1 — ACTIVE, Joel-driven.** Progress update:
- Experiment 1 (provision number + send one SMS, capture outbound shape): **COMPLETE** (2026-04-23). Fixture + Findings captured.
- Experiment 1b (delivery-report rejection shape): **COMPLETE** (2026-04-23). Fixture + Findings captured. Added as a bonus finding surfaced during Experiment 1 execution.
- Experiment 2 (inbound webhook + delivery report callback): **NOT STARTED**. Procedure stub seeded; PM writes the procedure before next Joel-driven run.
- Experiments 3, 4, 5: not started. Sequence dependencies still apply (brand registration + campaign registration run in real carrier-approval time; STOP/START/HELP can run after any registered campaign exists).

**Phase 2 Session B** — still GATED on Phase 1. Session B now has real fixtures (Experiment 1 success-path + Experiment 1b rejection-path) plus clear direction on auth choice, ID format, failure-detection strategy. Full unblock depends on Experiment 2 closing the delivery-report-payload-shape gap (Open-F-1 on delivery-status webhook scope converges here).

---

## Quality Checks Passed

- **Doc-only session.** No code touched. `tsc --noEmit` / `eslint` / `vitest` not required per CLAUDE.md close-out gates (which apply to modified code directories).
- **Fixture-file verification post-Commit 1:**
  ```
  $ git ls-files experiments/sinch/fixtures/
  experiments/sinch/fixtures/.gitkeep
  experiments/sinch/fixtures/exp-01-outbound.json
  experiments/sinch/fixtures/exp-01b-delivery-report-rejected.json
  ```
  Both new fixtures tracked.
- **Commit 1 stats via `git show --stat`:** 3 files changed, 97 insertions / 9 deletions (experiments-log.md +56/-9, exp-01-outbound.json +33, exp-01b-delivery-report-rejected.json +17).
- **Markdown visual scan** of `experiments-log.md` — 3 H2-level experiment blocks render correctly, `---` dividers separate them, status footers all formatted consistently.
- **`git status` post-Commit 1:** clean except untracked `api/node_modules/` (intentional).

---

## In Progress / Partially Done

None. Session 44 is a single-pass capture + close-out.

---

## Pending (post-Session-44)

1. **Push Session 44's two commits** (`58e95a6` + close-out) after PM approval.
2. **PM writes Experiment 2 procedure** before Joel runs it. Procedure needs to cover: public tunnel setup (ngrok or equivalent), Sinch Service Plan callback URL configuration, outbound send with `delivery_report:full`, capture payload shape, then inbound MO test (reply from Joel's phone) capturing that payload shape separately. Two fixture files expected: `exp-02-delivery-report.json` and `exp-02b-inbound-mo.json`.
3. **Phase 1 Experiments 3–5 (Joel-driven, PM writes procedures):** brand registration submission + timing, campaign registration submission + timing, STOP/START/HELP handling. Sequence dependencies apply — brand must be registered before campaign.
4. **Phase 2 Session B kickoff (post-Experiment 2):** Open-F-1 resolves here. Real fixtures now exist; Session B has everything it needs for outbound + delivery-report handling once Experiment 2 closes the callback-payload-shape gap.
5. **Pre-Phase-2 DECISIONS.md audit (new BACKLOG entry this session):** review D-84 through D-362 for internal consistency, superseded/conflicting decisions, propose consolidation. Run before Session B kickoff.

---

## Gotchas for Next Session

1. **`PM_PROJECT_INSTRUCTIONS.md` may have a new working-tree edit at Session 45 start.** Session 43's edit was committed and pushed as `bd5f425` between sessions. Session 44 did not touch the file. If next CC session opens with `M PM_PROJECT_INSTRUCTIONS.md` in working tree, that's a new Joel-side edit — do NOT stage or touch it per Session 40/41 discipline.

2. **Two unpushed commits on `main` at Session 44 close:** `58e95a6` (content) and this close-out. Both pending PM approval before push.

3. **`api/node_modules/` remains untracked intentionally.** Do not `git add -A`.

4. **`/src` freeze still holds per D-358.** Session 44 did not touch `/src`.

5. **Experiment 1 fixture placeholders:** `{servicePlanId}` and `{SINCH_API_TOKEN}` in `exp-01-outbound.json` are intentional — the fixture file is committed, so no live credentials may appear. When Phase 2 Session B writes tests against these fixtures, swap placeholders for env-var interpolation at test-fixture-load time.

6. **Sinch "Try the service" dashboard UI is broken.** Captured in Implications bullet 4. Do not recommend it as a debugging tool to anyone. Direct curl or the SDK is the only reliable send path. If a future session wants to validate a send without writing a script, copy the captured request from `exp-01-outbound.json` into a curl and run it — do not use the dashboard.

7. **The silent carrier-side drop is the most important Phase 2 design constraint.** An unregistered-traffic send produces HTTP 201 from Sinch with no warning, then dies at the carrier. Phase 2 cannot surface delivery failures from the send-path response alone — must wire delivery-report callbacks (which requires Phase 4 webhook infrastructure) to close the loop. This pushes the practical Phase 2/Phase 4 dependency harder than MASTER_PLAN §6/§8 implies. May surface a MASTER_PLAN amend request at Phase 2 kickoff.

8. **ULID vs UUID for `carrier_message_id`.** Sinch returns 26-char ULIDs (`01KPXNYXGCX1GYDBJ9HF0Y9CCM`). If the `/api/supabase/migrations/005_messages_table.sql` `carrier_message_id` column was typed as UUID, it will reject Sinch IDs. Phase 3 database-reconciliation session should verify column type; Phase 2 Session B should verify before applying migration 005.

9. **Legacy XMS API token vs OAuth2 Project Access Key.** Phase 2 Session B must use the legacy XMS Bearer token (from the Service Plan's REST API configuration), not the project-level OAuth2 access key. OAuth2 keys return 401 against XMS endpoints. If MESSAGE_PIPELINE_SPEC's drafted request/response contract assumed OAuth2 (draft state, pre-real-capture), update it to match the captured Experiment 1 shape.

10. **Experiment 2 sits at the intersection of inbound (Phase 4) and delivery-reports (Phase 2).** PM should be intentional about whether to capture both payloads in a single experiment run (efficient, but risks conflating two concerns) or split into 2a (delivery-report callback) + 2b (inbound MO). Recommendation: single run with two fixture files (`exp-02-delivery-report.json` + `exp-02b-inbound-mo.json`) — captures both shapes, keeps them logically separate, doesn't require two setup cycles.

---

## Files Modified This Session

### Modified (Commit 1 — content `58e95a6`)
```
experiments/sinch/experiments-log.md                # Findings filled in (9-bullet + 5-item Implications); Experiment 1b section added; Experiment 2 stub appended
```

### Created (Commit 1)
```
experiments/sinch/fixtures/exp-01-outbound.json                      # 33 lines — successful XMS send capture
experiments/sinch/fixtures/exp-01b-delivery-report-rejected.json     # 17 lines — delivery_report rejection capture
```

### Modified (Commit 2 — close-out, pending)
```
CC_HANDOFF.md                                       # close-out rewrite (this file)
REPO_INDEX.md                                       # meta bumps + Subdirectories update + Session 44 change-log entry
BACKLOG.md                                          # Infrastructure & Operations: pre-Phase-2 DECISIONS audit entry
```

### Deleted
```
(none)
```

### Untouched (intentionally)
```
PM_PROJECT_INSTRUCTIONS.md                          # Joel's prior edit committed as bd5f425; no Session 44 touch
MASTER_PLAN.md                                      # no scope shift this session; Experiment 1 findings don't amend the plan (yet)
DECISIONS.md                                        # no D-numbers this session
PROTOTYPE_SPEC.md, SDK_BUILD_PLAN.md, MESSAGE_PIPELINE_SPEC.md, SRC_SUNSET.md, PRICING_MODEL.md, CLAUDE.md   # no relevant touches
all /api, /sdk, /prototype, /src code               # doc-only session
```

---

## Suggested Next Tasks

**Immediate (Joel-side, no CC needed):**
1. Push the two Session 44 commits after PM approval.
2. Set up the Service Plan callback URL + public tunnel for Experiment 2 when PM has written the procedure.

**CC on standby for:**
- PM writing Experiment 2 procedure — CC would append to `experiments-log.md` (procedure section currently stubbed).
- Scaffolding a throwaway webhook receiver if Joel asks (Hono or minimal Node HTTP server is fine — lives in `/experiments/sinch/` per MASTER_PLAN §5 throwaway-code rule; not in `/api`).
- Phase 2 Session B planning prompt once Experiment 2 closes the callback-payload gap.
- Pre-Phase-2 DECISIONS.md audit when promoted from BACKLOG (3–4 hours CC time).

**Estimate:** Next CC session depends on which Phase 1 checkpoint surfaces first. If Joel is ready to run Experiment 2, PM writes the procedure before the next CC session (or CC appends a PM-provided procedure to the log and then waits). If Joel wants the DECISIONS audit before moving on, that's a standalone CC session.

---

*End of close-out. Session 44 Experiment 1 + 1b capture complete. First real Phase 1 finding is in the log: unregistered 10DLC traffic drops silently at the carrier with no API-response warning, which is the most important design constraint Phase 2 Session B has to handle.*
