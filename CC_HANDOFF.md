# CC_HANDOFF.md — Session Handoff
**Date:** 2026-04-25 (Session 51 — Experiment 3a brand-registration findings capture + new docs reference + BACKLOG entries + D-18 archive annotation; doc-only)
**Branch:** main (4 unpushed — all pending PM approval before push; HEAD built on top of `5695870`)

---

## Commits This Session

Four atomic commits on top of `5695870` (Session 50 close-out, already on `origin/main`). None pushed this session.

```
[c1]    feat(experiments): capture Experiment 3a brand-registration findings + fixture
[c2]    docs(carrier): land brand-registration fields reference + revisions
[c3]    docs: BACKLOG entries A/B/C + D-18 contextual annotation
[c4]    docs: session 51 close-out — REPO_INDEX + CC_HANDOFF bumps
```

Pre-flight session-start reality check (per Session 47 fix-up lesson): HEAD == `5695870` == `origin/main` at session start. Both Session 50 commits (`e811523` + `5695870`) were pushed by Joel between Session 50 close and Session 51 start; `git rev-list --left-right --count HEAD...origin/main` at session start → `0 0`. Working tree at session start: clean except untracked `api/node_modules/` (intentional) and untracked `docs/CARRIER_BRAND_REGISTRATION_FIELDS.md` (Joel's working-tree draft from the chat — committed this session as part of Commit 2).

---

## What Was Completed

Joel ran the brand-registration leg of Experiment 3 via Sinch's dashboard between sessions: Brand `BTTC6XS` (Bundle `01kq2jqyhjynvr2wcpp0bbppgr`, Simplified path, Private Profit / `PRIVATE`, Information Technology Services / `TECHNOLOGY` vertical) submitted ~11:20 ET 2026-04-25 and approved ~11:21 ET — ~60 seconds end-to-end via a `BRAND_IDENTITY_STATUS_UPDATE` webhook event observed on the dashboard activity feed. CC captured the data, surfaced six findings worth recording for Phase 2 Session B + Phase 5 design, and landed all the doc work this session.

### Commit 1 — Experiment 3a/3b log + 3a fixture

- **`experiments/sinch/experiments-log.md`** — two new H2 sections appended after Experiment 2b, mirroring the 2a/2b precedent:
  - **Experiment 3a — Brand registration submission + timing** (Status: COMPLETE — captured 2026-04-25). Procedure subsection (replicable dashboard steps), Findings (10 bullets covering timing, brand created, IdentityStatus terminal value `VERIFIED`, Bundle state transitions `In review → Approved`, webhook event observed, Sole Prop API gap, state machine 5-vs-7 mismatch, Simplified pricing $10-vs-$6 inconsistency, vertical enum mapping, HEALTHCARE-D-18 annotation context, IRS name-change-letter grace window observation), Implications-for-Phase-2-Session-B (3 inconsistencies for Sinch BDR verification + signature-verification design follow-on), Implications-for-Phase-5-Registration-Pipeline (Sole Prop ICP routing decision, customer fee tiering, BYO TCR brand import).
  - **Experiment 3b — Campaign registration submission + timing** (Status: BLOCKED on procedure drafting). Stub block with goal, procedure-TBD note, status footer.

- **`experiments/sinch/fixtures/exp-03a-brand-registration.json`** (new, 33 lines) — adapted dashboard-capture schema with `submission` / `response` / `webhook_event` / `timing_seconds` / `captured_at` / `notes` keys (deviates from exp-02a's API-shaped `api_request` / `api_response` keys because 3a was dashboard-driven, not API-driven). Two distinct state-tracking concepts captured separately: `identity_status_observed: ["VERIFIED"]` (TCR-level brand identity, terminal value only) and `bundle_state_transitions: ["In review", "Approved"]` (Sinch lifecycle, full sequence visible). PII redacted with `{IRS_ON_FILE_ADDRESS}` + `{CONTACT_DETAILS}` placeholders; EIN value not stored. Validated JSON via `python3 -m json.tool`.

### Commit 2 — `docs/CARRIER_BRAND_REGISTRATION_FIELDS.md` doc landing + revision

Joel's working-tree draft (untracked at session start) committed after CC revisions:

- Header gains `**Sources:**` line citing Sinch dashboard 2026-04-25 session + Sinch 10DLC OpenAPI spec.
- §Bundle / Company / Contact field tables preserved verbatim from Joel's draft.
- §Financial details — Entity type row rewritten to API truth (3 enum values + dashboard labels + EIN-required column + no-Sole-Prop note); Corporate tax ID row updated to "required for all 3 supported entity types"; italicized history note added below the section per the strike + history-note hybrid approach (`_Note (2026-04-25): Earlier draft assumed Sole Proprietor was supported; Sinch's 10DLC API enum confirms it isn't. See BACKLOG entry on Sole Proprietor segment gap for product implications._`).
- New §`brandEntityType` enum (load-bearing) section — 3-value table + Phase 5 wizard-design implication.
- New §`brandVerticalType` enum mapping section — 22 values, 1 observed mapping (Information Technology Services → `TECHNOLOGY`), 21 TBD; HEALTHCARE-as-valid-API-vertical note pointing at D-18.
- New §Brand state machine section — two sub-sections (`IdentityStatus` TCR-level + `brandRegistrationStatus`/Bundle-state Sinch-level), 5-vs-7 dashboard-mapping table with explicit unknown cells, Sinch-BDR-verification flag.
- §Field constraints we learned the hard way — added 3 entries (Website-must-be-live, EIN-required-for-all-3-supported-types, IRS-records-grace-windows); rewrote No-EIN constraint to explicit "cannot onboard via Sinch's 10DLC API" with route options.
- §Field-to-wizard-step mapping — title and body retitled from Phase 7 → Phase 5 per the phasing clarification.

### Commit 3 — BACKLOG entries A/B/C + D-18 archive annotation

- **`BACKLOG.md`** — three new entries inserted in Likely → Product Features, before the Infrastructure & Operations subheading:
  - Customer brand registration path tiering (Simplified $13–28 margin vs Full $16–31 loss; three response options).
  - Sole Proprietor customer segment Sinch gap (three response options: cut from ICP / secondary carrier / TFN routing).
  - BYO existing TCR brand import (Sinch UI surfaces the path; TCR cross-CSP portability per CSP docs).
  - All three reference Phase 5 design context (Phase 7 in Joel's spec corrected to Phase 5 per MASTER_PLAN §9).

- **`DECISIONS_ARCHIVE.md`** — D-18 body annotated with one new italicized line: `_Note (2026-04-25): HEALTHCARE is a valid \`brandVerticalType\` value in Sinch's 10DLC API; this decline is a RelayKit policy choice, not a carrier-level constraint._` Appended after the existing `_Affects:_` line at L103. **Establishes the format precedent for non-supersession contextual annotations on archived (or active) decisions** — distinct from the existing `**⚠ Superseded by D-###:**` and `**⚠ Reframed by D-###:**` markers, which are supersession-class.

### Commit 4 — close-out (this commit)

REPO_INDEX.md + CC_HANDOFF.md bumped per Session 50 pattern. Verbose-diff change-log entry for Session 51 appended chronologically.

---

## Current State

**Phase 0 — CLOSED** (Session 41 Group F).

**Phase 1 — ACTIVE, Joel-driven.** Progress this session:
- Experiment 1: COMPLETE (Session 44).
- Experiment 1b: COMPLETE (Session 44).
- Experiment 2a: COMPLETE (Session 50).
- Experiment 2b: BLOCKED on Experiments 3 + 4.
- **Experiment 3a: COMPLETE (Session 51, 2026-04-25).** Brand `BTTC6XS` approved in ~60s via Sinch dashboard.
- **Experiment 3b: BLOCKED on procedure drafting.** Brand `BTTC6XS` available for the run.
- Experiments 4, 5: not started, procedures not yet drafted.

**Phase 2 Session B** — still GATED. Delivery-path axis fully unblocked by 2a's captured shapes; brand-registration axis unblocked by 3a. Remaining gates: campaign registration shapes (3b), STOP/START/HELP evidence (5), and the three new Session-51-surfaced API/dashboard inconsistencies for Sinch BDR verification at kickoff. Kickoff remains the correct boundary for the enum-semantics D-number + MESSAGE_PIPELINE_SPEC spec catch-up + signature-verification design decision.

**Phase 5 (Registration Pipeline on Sinch)** — design context now has concrete inputs from 3a: field reference doc landed (`docs/CARRIER_BRAND_REGISTRATION_FIELDS.md`), 3 BACKLOG-tracked product questions (tiering, Sole Prop routing, BYO brand import), state-machine + enum mappings to be filled in incrementally. Phase 5 design itself remains future work (waits on Phase 2 Session B completion per MASTER_PLAN §9).

**DECISIONS ledger** — unchanged from Session 50 close: active count D-364 (latest), archive range D-01 through D-83. Session 51 added no new D-numbers; D-18 received an inline contextual note in the archive (not a new decision, not a supersession). Sessions 49 + 50 + 51 added zero new D-numbers cumulatively.

---

## Quality Checks Passed

- **Doc-only session; no production code touched.** `tsc --noEmit` / `eslint` / `vitest` not required per CLAUDE.md close-out gates.
- **Fixture JSON validity:** `python3 -m json.tool experiments/sinch/fixtures/exp-03a-brand-registration.json > /dev/null` → exit 0.
- **Fixture credential / PII redaction:** `grep -c "{IRS_ON_FILE_ADDRESS}\|{CONTACT_DETAILS}" experiments/sinch/fixtures/exp-03a-brand-registration.json` → 3 (1 address placeholder, 1 contact placeholder, 1 reference in the notes field). No live EIN string in fixture; `ein_present: true` only.
- **Log status-footer integrity:** `grep -n "^### Status" experiments/sinch/experiments-log.md` → 6 status footers (1: COMPLETE 2026-04-23; 1b: COMPLETE 2026-04-23; 2a: COMPLETE 2026-04-24; 2b: BLOCKED on Experiments 3 + 4; 3a: COMPLETE 2026-04-25; 3b: BLOCKED on procedure drafting).
- **Phase phasing harmonization:** `grep -in "Phase 7" docs/CARRIER_BRAND_REGISTRATION_FIELDS.md` → 0 hits (all Phase 7 references in Joel's working-tree draft and the user-spec BACKLOG entries swapped to Phase 5 per MASTER_PLAN §9 prior to commit).
- **D-18 annotation format:** `grep -nE "^_Note \(2026-04-25\)" DECISIONS_ARCHIVE.md` → 1 line on D-18.
- **BACKLOG entries landed:** `grep -cE "Customer brand registration path tiering|Sole Proprietor customer segment|BYO existing TCR brand import" BACKLOG.md` → 3 (one per heading line).
- **API enum truth in registration-fields doc:** `grep -c "PUBLIC.*PRIVATE.*CHARITY_NON_PROFIT\|brandEntityType" docs/CARRIER_BRAND_REGISTRATION_FIELDS.md` → ≥3.

---

## In Progress / Partially Done

None. Session 51 executed cleanly — all data captured, fixture written, registration-fields doc landed, BACKLOG entries added, D-18 annotated, REPO_INDEX + CC_HANDOFF bumped.

---

## Pending (post-Session-51)

1. **Experiment 3b — campaign-registration leg.** PM drafts procedure → Joel runs (or CC scaffolds if API-driven). Brand `BTTC6XS` is live and available. Natural next Phase 1 step.

2. **Experiments 4 + 5 procedure drafting (PM-side work).**
   - Experiment 4 — additional registration scope if needed beyond 3a/3b.
   - Experiment 5 — STOP/START/HELP handling. Determines whether Sinch auto-handles opt-outs at carrier-layer (affects Phase 4 scope).

3. **Phase 2 Session B kickoff prep.** Gating items as of Session 51 close:
   - MESSAGE_PIPELINE_SPEC Session B spec catch-up (Session 46 boundary — lands at kickoff).
   - `messages.status` enum-semantics D-number (Session 46 boundary — lands at kickoff; concrete input from 2a still applies).
   - Webhook signature verification design decision (Session 50 finding — no HMAC header on XMS callbacks; alternatives are IP allowlist, mTLS, secret path segment, unenabled Sinch feature).
   - **Three Sinch API/dashboard inconsistencies (new this session — verify with Sinch BDR Elizabeth Garner before kickoff):** brand state machine (5 API vs 7 dashboard), Simplified pricing ($10 docs vs $6 charged), webhook policy (poll-only docs vs internal-fire observed during 3a).
   - Experiment 3b + 5 results (to fully unblock the registration + STOP/START/HELP axes).

4. **Phase 5 design context.** Three BACKLOG-tracked product questions seeded this session (path tiering, Sole Prop routing, BYO TCR brand import). Phase 5 design itself remains future work; entries are parking-lot per BACKLOG protocol.

5. **Pre-existing pending (carried from prior sessions):**
   - PM review of appendix-item D-241 → D-211 audit-wording question (Session 48 gotcha, still open).
   - PM review of D-101 pre-existing structural drift (Session 48 gotcha, still open).
   - PM review of DECISIONS.md index-summary harmonization with the new inline notes (Session 48 gotcha, still open).
   - Active plan pointer Experiment 1 line still says "not yet run" (stale since Session 44; Session 50 deferred; not in scope this session).

---

## Gotchas for Next Session

1. **Session 51 commits unpushed at close** (by PM instruction — CC never pushes without PM review). Next session's pre-flight check: `git rev-list --left-right --count HEAD...origin/main`. If Joel/PM pushed between sessions, expect `0 0`; if not, expect `4 0` with the four Session 51 commits still local. **Perform the reality check, don't assume** — especially: do not inherit HEAD claims from this handoff header without verifying against `git log origin/main` (Session 49's fix-up lesson).

2. **`api/node_modules/` remains untracked intentionally.** Do not `git add -A` or `git add .`; stage specific paths only.

3. **`docs/CARRIER_BRAND_REGISTRATION_FIELDS.md` is now committed**, no longer untracked. Joel's working-tree draft → CC revisions → Commit 2 of this session. Future edits land in regular session flow.

4. **Brand `BTTC6XS` is live.** It's RelayKit's actual Sinch brand registration. It's available for Experiment 3b campaign registration submission and for any future end-to-end testing. Do not delete or archive without explicit PM direction.

5. **Three Sinch API/dashboard inconsistencies are open questions** for Phase 2 Session B kickoff:
   - Brand state machine: 5 API states vs 7 dashboard states (extra Queue + Archived). Mapping table in `docs/CARRIER_BRAND_REGISTRATION_FIELDS.md` flags unknown cells.
   - Simplified registration pricing: $10 in API docs vs $6 charged on dashboard. To verify before pricing-model claims become customer-facing.
   - Webhook policy: API docs say "initial release will not include a webhook service, you will need to poll" — but `BRAND_IDENTITY_STATUS_UPDATE` fired internally during 3a's run. Either docs are stale, or webhooks fire to dashboard internally only.
   Each needs PM-side confirmation with Sinch BDR (Elizabeth Garner). Do not silently assume the API docs are authoritative — observed dashboard behavior contradicts them in all three cases.

6. **Two distinct state-tracking concepts at Sinch.** When working on Phase 5 wizard or Phase 2 Session B status logic, do not conflate them:
   - `IdentityStatus` — TCR-level brand identity field. Terminal value `VERIFIED` observed; intermediate transitions not visible from dashboard.
   - `brandRegistrationStatus` / Bundle state — Sinch's bundle-level lifecycle. Observed transition `In review → Approved`. API enum has 5 values; dashboard exposes 7.
   These are separate fields tracking separate concerns. Treat them independently in any data model.

7. **Sole Proprietor is not a Sinch 10DLC option.** API `brandEntityType` enum is exactly `PUBLIC | PRIVATE | CHARITY_NON_PROFIT`. The `docs/CARRIER_BRAND_REGISTRATION_FIELDS.md` doc and Phase 5 design discussions should treat no-EIN customers as a routing problem (TFN, secondary carrier, ICP cut), not a Sinch 10DLC entity-type-selection problem. BACKLOG entry on Sole Prop segment gap captures the design tradeoffs.

8. **D-18 contextual annotation format precedent.** The `_Note (YYYY-MM-DD): ..._` italicized line on D-18 is the first non-supersession contextual annotation in `DECISIONS_ARCHIVE.md`. Future contextual notes (on archived or active decisions) should follow this format unless a different precedent is explicitly chosen. Distinct from the existing `**⚠ Superseded by D-###:**` and `**⚠ Reframed by D-###:**` markers, which are supersession-class.

9. **`/src` freeze still holds per D-358.** Session 51 did not touch `/src`.

10. **Worker still deployed** at `sinch-webhook-receiver.joelnatkin.workers.dev` (per Session 49 scaffold + Joel's deployment between Sessions 49 and 50). Configured as Sinch Service Plan callback URL. Useful for Experiment 3b (campaign send-and-observe) and any future delivery-report capture.

---

## Files Modified This Session

### Modified + Created (Commit 1, pending PM approval)
```
experiments/sinch/experiments-log.md                          # +75 lines — appended 3a + 3b H2 blocks after 2b
experiments/sinch/fixtures/exp-03a-brand-registration.json    # new, 33 lines — Experiment 3a fixture (dashboard capture schema)
```

### Created (Commit 2, pending PM approval)
```
docs/CARRIER_BRAND_REGISTRATION_FIELDS.md                     # new — Joel's working-tree draft + CC revisions (Sole Prop strike + history note, brandEntityType enum section, brandVerticalType enum mapping section, Brand state machine section, refined constraints, Phase 5 retitling)
```

### Modified (Commit 3, pending PM approval)
```
BACKLOG.md            # +3 entries (Customer brand registration tiering, Sole Prop segment gap, BYO TCR brand import)
DECISIONS_ARCHIVE.md  # +1 line (D-18 contextual annotation: HEALTHCARE-is-valid-API-vertical / D-18-is-RelayKit-policy)
```

### Modified (Commit 4, pending PM approval)
```
REPO_INDEX.md         # Meta: Last updated + Decision count note + Unpushed commits; Canonical /docs table: + CARRIER_BRAND_REGISTRATION_FIELDS.md row; Subdirectories /experiments/sinch/ Session 51 rewrite (3a COMPLETE + 3b BLOCKED + 4 fixtures); Build spec status Session B amended with 3 inconsistencies; Active plan pointer Experiment 3 split to 3a/3b lines; Change log Session 51 entry
CC_HANDOFF.md         # Overwritten with Session 51 handoff
```

### Untouched (intentionally)
```
experiments/sinch/webhook-receiver/                           # Session 49 scaffold preserved — still the deployed Worker
experiments/sinch/fixtures/exp-01-outbound.json
experiments/sinch/fixtures/exp-01b-delivery-report-rejected.json
experiments/sinch/fixtures/exp-02a-delivery-report.json       # prior fixtures preserved
DECISIONS.md                                                  # No D-numbers this session; D-18 annotation lives in DECISIONS_ARCHIVE.md per location decision
MASTER_PLAN.md, PROTOTYPE_SPEC.md, MESSAGE_PIPELINE_SPEC.md,
SDK_BUILD_PLAN.md, SRC_SUNSET.md, PRICING_MODEL.md,
WORKSPACE_DESIGN_SPEC.md, CLAUDE.md,
PM_PROJECT_INSTRUCTIONS.md, README.md                          # Not in scope
/api, /sdk, /prototype, /src                                   # No code touches — doc-only session
audits/DECISIONS_AUDIT_2026-04-24.md                           # Per dated-report convention — never overwritten
```

---

## Suggested Next Tasks

**Natural next Phase 1 step:** Experiment 3b campaign-registration procedure drafting. PM hands over procedure content; CC drafts per the Session 45 2a pattern (~30 min); Joel runs against brand `BTTC6XS`. Same fast-registration timing measurement as 3a but for the campaign axis — campaign approval is what actually gates customer go-live per MASTER_PLAN §9.

**Alternative next step (PM discretion):** push the Session 51 stack to `origin/main` first if PM approves the four commits cleanly, then move into 3b drafting. Or pivot to Phase 2 Session B kickoff prep in parallel — the MESSAGE_PIPELINE_SPEC spec catch-up + enum-semantics D-number draft + signature-verification design exploration + Sinch-BDR conversation about the three inconsistencies can all start now.

**Joel-side (no CC needed):**
- Run a Sinch-BDR conversation to clarify the three Session-51-surfaced API/dashboard inconsistencies (state machine, Simplified pricing, webhook policy) before Phase 2 Session B kickoff.
- If PM has Experiment 3b procedure ready: run it (submit campaign for `TECHNOLOGY` vertical against brand `BTTC6XS`, measure approval time).

**Estimate:** Next findings-capture session (post-Experiment-3b) is ~30 min CC, same pattern as Sessions 50 + 51.

---

*End of close-out. Session 51 captured Experiment 3a end-to-end: brand `BTTC6XS` approved in ~60 seconds via Sinch dashboard, two distinct state-tracking concepts captured separately (`IdentityStatus: VERIFIED` at TCR level + `Bundle state: In review → Approved` at Sinch level), Sole Prop API gap surfaced, three API/dashboard inconsistencies flagged for Sinch-BDR verification before Phase 2 Session B kickoff. New `docs/CARRIER_BRAND_REGISTRATION_FIELDS.md` reference document landed (Joel's working-tree draft + CC revisions). Three BACKLOG entries added for Phase 5 design (path tiering, Sole Prop routing, BYO TCR brand import). D-18 received the first non-supersession contextual annotation in `DECISIONS_ARCHIVE.md` (precedent format: `_Note (YYYY-MM-DD): ..._`). No new D-numbers; Phase 2 Session B kickoff and Phase 5 design will spawn D-numbers from Session 51's findings at design time. Four commits unpushed pending PM approval.*
