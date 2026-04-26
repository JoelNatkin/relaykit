# /experiments/sinch — proving-ground log

Throwaway experiments to characterize Sinch's actual behavior before Phase 2
builds production code against it. Per MASTER_PLAN §5.

**Rules:**
- Code here is disposable. Write to learn, not to ship.
- Every experiment produces a log entry with captured request/response
  fixtures, timings, and observed behavior.
- Production code in `/api` consumes recorded shapes from this log,
  never assumptions.

---

## Experiment 1 — Provision number, send one SMS, capture outbound shape

**Status:** not yet run
**Goal:** characterize Sinch's outbound SMS API — request/response shape,
latency from API call to phone buzz, and any quirks. Output is the recorded
fixture Phase 2 Session B will build against.

### Procedure
1. Sign in to dashboard.sinch.com with project
   `6bf3a837-d11d-486c-81db-fa907adc4dd4`.
2. Provision a US long code. Record the number + any auth credentials
   (API token, service plan ID, etc.) in your password manager.
3. Create `send-one.mjs` — a minimal Node script that:
   - Uses `fetch()` only (no Sinch SDK, per D-02)
   - Reads credentials from env vars
   - Posts a single SMS to your phone with body
     `"RelayKit experiment 1 — {ISO timestamp}"`
   - Captures full request (URL, method, headers, body), full response
     (status, headers, body), and wall-clock timing
   - Writes captured data as formatted JSON to
     `/experiments/sinch/fixtures/exp-01-outbound.json`
4. Run the script. Confirm the phone receives the SMS.
5. Fill in **Findings** section below.

### Expected artifacts
- `/experiments/sinch/send-one.mjs` (throwaway)
- `/experiments/sinch/fixtures/exp-01-outbound.json` (captured request +
  response + timing)
- Findings section below, completed

### Success criteria
- SMS arrives on your phone within 60 seconds of API call
- Captured fixture includes the full Sinch response body (including message ID)
- Findings section reflects what actually happened, not what was expected

### Findings
_Captured 2026-04-23._

- **Phone number provisioned:** +12013619609 (10DLC local number, $1 setup + $1/month)
- **Auth shape:** Legacy XMS API token (Bearer token from SMS → Service APIs → REST configuration), NOT the project-level OAuth2 access key. The two systems are separate; OAuth2 keys returned 401 against the XMS endpoint.
- **Endpoint:** POST https://us.sms.api.sinch.com/xms/v1/{servicePlanId}/batches (US-region endpoint)
- **Request body shape:** { from, to: [string], body, delivery_report? }
- **Response status:** 201 Created on success
- **Response body shape:** { id (ULID), to[], from, canceled, body, type ("mt_text"), created_at, modified_at, delivery_report ("none" by default), expire_at, flash_message }
- **API latency (submission to ack):** ~240ms
- **Phone received SMS:** NO — unregistered 10DLC traffic was silently dropped at the carrier. API returned 201 with no warning.
- **Error shape (from Experiment 1b):** { code (snake_case identifier), text (human-readable) }. Returned with HTTP 403 when delivery_report:full is requested without a callback URL on the Service Plan.

### Implications for Phase 2 Session B build:
1. **Auth: use legacy XMS API token, not OAuth2 Project Access Key.** OAuth2 keys are scoped to Conversation API and other modern endpoints, not XMS. MESSAGE_PIPELINE_SPEC drafted contract should be updated to reflect this.
2. **Silent carrier-side drops are the baseline failure mode for unregistered traffic.** Phase 2 cannot detect carrier blocking from the API response — must implement explicit delivery_report callbacks (requires Phase 4 webhook infrastructure).
3. **ID format is ULID (26 chars).** /api messages table must accept ULIDs for the carrier_message_id column, not assume UUIDs.
4. **Sinch dashboard "Try the service" UI is broken** — it sends with to:[""] and reports success. Do not use as a debugging tool. Use direct curl or SDK.
5. **Open-F-1 (delivery-status webhook scope) gains real urgency** — without this, Phase 2 has no way to surface delivery failures to users.

### Status: COMPLETE — captured 2026-04-23.

---

## Experiment 1b — Delivery report request rejection

**Status:** complete (2026-04-23)
**Goal:** Characterize Sinch's behavior when delivery_report:full is requested. Output is the rejection-shape fixture.

### Findings
- API returned HTTP 403 (not 400 or 422) when delivery_report:full was requested without a Service Plan callback URL configured.
- Error shape: { code: "missing_callback_url", text: "Requesting delivery report without any callback URL." }
- Latency on rejection: 129ms (faster than success path — early validation).
- Implication: configuring a callback URL is a prerequisite for receiving any delivery report from Sinch. Defer full delivery-report capture to Experiment 2 (inbound/webhook setup).

### Status: COMPLETE — captured 2026-04-23.

---

## Experiment 2a — Delivery-report callback shape

**Status:** not yet run
**Goal:** capture the asynchronous callback payload Sinch POSTs to the Service Plan callback URL when a batch is sent with `delivery_report: "full"`. Output is the recorded fixture Phase 2 Session B will use to detect carrier-side drops (per Experiment 1 finding: unregistered 10DLC drops silently at the carrier — Phase 2 cannot detect this from the send-path response alone).

### Procedure

1. **Build the webhook receiver** at `/experiments/sinch/webhook-receiver/`:
   - `src/index.js`:
```js
     export default {
       async fetch(request) {
         const captured = {
           timestamp: new Date().toISOString(),
           method: request.method,
           path: new URL(request.url).pathname,
           headers: Object.fromEntries(request.headers.entries()),
           body: await safeBody(request),
         };
         console.log(JSON.stringify(captured, null, 2));
         return new Response('', { status: 200 });
       }
     };

     async function safeBody(req) {
       const text = await req.text();
       try { return JSON.parse(text); } catch { return text; }
     }
```
   - `wrangler.toml`:
```toml
     name = "sinch-webhook-receiver"
     main = "src/index.js"
     compatibility_date = "2026-04-01"
```
   - Deploy: `wrangler deploy` (wrangler is already configured from the relaykit.ai work). Record the resulting `.workers.dev` URL.

2. **Configure the Service Plan callback URL in Sinch:**
   - Dashboard → SMS → Service APIs → REST configuration (same panel where you retrieved the legacy XMS Bearer token in Experiment 1).
   - Set the callback URL to the deployed Worker URL.
   - Save. Confirm the dashboard reflects the new URL before proceeding.

3. **Send with `delivery_report: "full"`.** Open a second terminal and start `wrangler tail` against the deployed Worker so incoming callbacks stream live. Then trigger the same send as Experiment 1 but with the added field:
```
   POST https://us.sms.api.sinch.com/xms/v1/{servicePlanId}/batches
   Authorization: Bearer {SINCH_API_TOKEN}
   Content-Type: application/json

   {
     "from": "+12013619609",
     "to": ["+1<your phone>"],
     "body": "RelayKit experiment 2a — {ISO timestamp}",
     "delivery_report": "full"
   }
```
   Capture the immediate API response (expect 201, not Experiment 1b's 403, because the callback URL is now configured).

4. **Wait and observe the callback.** Two possible outcomes, both informative:
   - **Callback arrives** (typically within ~60 seconds, possibly several minutes): `wrangler tail` logs the POST from Sinch. Copy the full payload — method, path, headers, body — for the fixture. This gives Phase 2 Session B the canonical delivery-report shape.
   - **No callback within 10 minutes**: document the non-arrival and the elapsed time. Implication: unregistered 10DLC drops end-to-end silently — the MNO doesn't notify Sinch either — meaning Phase 2 needs a timeout-based "presumed failed" heuristic alongside callback-driven state, not just callback-driven state.

5. **Write fixture** to `/experiments/sinch/fixtures/exp-02a-delivery-report.json`:
```json
   {
     "api_request": { "url": "...", "method": "POST", "headers": { /* Bearer token as {SINCH_API_TOKEN} placeholder */ }, "body": { /* ... */ } },
     "api_response": { "status": 201, "headers": { /* ... */ }, "body": { /* ... */ } },
     "api_timing_ms": 0,
     "callback_received": true,
     "callback_request": { "method": "POST", "path": "/", "headers": { /* ... */ }, "body": { /* ... */ } },
     "callback_delay_ms": 0,
     "captured_at": "2026-04-23T...",
     "notes": "..."
   }
```
   Placeholders for all credentials — no live tokens in the fixture.

6. Fill in Findings section below.

### Expected artifacts
- `/experiments/sinch/webhook-receiver/src/index.js` + `wrangler.toml` (kept — per the One Source Rule, this code becomes a real Phase 2/4 prototype, not throwaway)
- `/experiments/sinch/fixtures/exp-02a-delivery-report.json`
- Findings below, completed

### Success criteria
- Service Plan callback URL configured; dashboard confirms
- Send returns 201 (no more `missing_callback_url` 403)
- Either a delivery-report callback captured OR a documented timeout with non-arrival measured
- Either outcome directly informs Phase 2 Session B's failure-detection strategy

### Findings

- **Callback URL configured:** Yes. Set via Sinch dashboard → SMS → Service APIs → REST configuration → Callback URLs → Default URL field. URL: `https://sinch-webhook-receiver.joelnatkin.workers.dev` (the Cloudflare Worker scaffolded Session 49 at `experiments/sinch/webhook-receiver/` and deployed via `wrangler deploy`). Dashboard confirmed "Active" status before the send.

- **Send response status / timing:** HTTP/2 201 — not Experiment 1b's 403, since the callback URL is now configured. Batch ID: `01KQ0KF3Z9EM2JZZ468HVYZ9PD` (ULID, matches Experiment 1's ID format). Precise send-path latency not measured this run (curl -i without timing flags); response returned immediately with no observable delay.

- **Callback received:** Yes.

- **Callback delay:** ~1.77 seconds (send at `2026-04-24T20:38:57.257Z`, callback arrived at `2026-04-24T20:38:59.026Z` — delta 1.769s / 1769ms). Noteworthy: the procedure estimated "typically within ~60 seconds, possibly several minutes" — actual behavior is near-realtime for the failure case. Phase 2 Session B should not design around multi-second latency as the normal case.

- **Callback payload shape (canonical for Phase 2 Session B):**
  - Top-level event discriminator: `type: "delivery_report_sms"` (string enum)
  - Correlation key: `batch_id` (ULID `01KQ0KF3Z9EM2JZZ468HVYZ9PD`) — matches the `id` from the send response
  - Status array: `statuses[]` with per-entry shape `{ code: number, count: number, recipients: string[], status: string }`
  - `statuses[].code: 310` — Sinch-specific carrier-layer numeric code (Phase 2 should catalog known codes as they surface)
  - `statuses[].status: "Failed"` — human-readable string enum
  - `statuses[].recipients[]` — phone numbers in **non-E.164 format (no leading `+`)**, differs from send-path request which required `+`. Phase 2 data-layer must normalize when correlating callback recipient to send-side record.
  - `total_message_count: 1` — useful for multi-recipient batches

- **Callback event types observed:** Only `delivery_report_sms` in this run. Phase 2 should treat `type` as the top-level discriminator and reserve other values (e.g., for MO messages per Experiment 2b, other lifecycle events Sinch may emit).

- **Transport signals on callback (user-agent, signature):** User-agent `Apache-HttpClient/5.5.1 (Java/21.0.5)` identifies Sinch's backend sender. Cloudflare proxy headers visible because the Worker sits behind Cloudflare (`cf-connecting-ip: 54.173.29.238`, `cf-ipcountry: US`). **No signature / HMAC header on the callback** — Phase 2 webhook signature verification cannot rely on a standard signed-header mechanism from Sinch for XMS delivery reports. If signature verification is required, alternative mechanisms are needed: IP allowlist of Sinch's egress ranges, mTLS, secret path segment, or a Sinch dashboard feature not enabled by default. **Flag as Phase 2 Session B kickoff discussion item** — successor question to the original Open-F-1 (delivery-status webhook scope from SRC_SUNSET).

- **Implication for silent-drop detection in Phase 2 Session B:** **Sinch DOES notify us of carrier failures via the delivery-report callback, within ~2 seconds.** This **overturns the Session 45 hypothesis** that "no callback within 10 minutes → MNO doesn't notify Sinch either." Phase 2's failure-detection strategy is simpler than anticipated: callback-driven terminal state (`Failed` / `Delivered` / intermediate statuses per Sinch's code catalog) is the **primary** mechanism. A timeout-based "presumed failed" fallback remains valuable as a safety net for the case where Sinch's own callback fails to arrive (Worker downtime, Sinch bug, transport failure), but is **secondary**, not primary. The `messages.status` enum revision already reserved for Phase 2 Session B kickoff (per MASTER_PLAN §6) now has concrete input: `'sent'` = "submitted to carrier" at api-request time; terminal states `'delivered'` / `'failed'` set from the callback; at least one intermediate "submitted, awaiting callback" state is required between them. Exact enum values + semantics land at kickoff.

### Status: COMPLETE — captured 2026-04-24.

---

## Experiment 2b — Inbound MO message shape

**Status:** BLOCKED — requires a delivery-capable sender (approved campaign + associated number). Unblocks the moment Experiment 3b campaign approves AND number `+12013619609` is associated to the approved campaign (per 3b finding, association is a separate post-approval step, not bundled into form submission).

**Goal:** capture the payload Sinch POSTs to the Service Plan callback URL when a recipient replies (mobile-originated, MO) to a message sent from a registered, deliverable RelayKit campaign. This is the Phase 4 inbound-handler contract — the exact wire shape the production receiver must dispatch on.

### Procedure
1. **Pre-flight.** Confirm campaign `01kq5ahkf08v64ymqnxsnme5bg` (or successor TCR Campaign ID) is in `APPROVED` state in the Sinch dashboard. Confirm number `+12013619609` appears in the campaign's "Numbers" section (i.e., association completed). If association has not happened automatically post-approval, perform it via the dashboard and capture the UI path + any visible request/response (this is currently un-documented — log whatever the dashboard exposes).
2. **Confirm Service Plan callback URL.** Sinch dashboard → Service Plan → callback URL should still point at `https://sinch-webhook-receiver.joelnatkin.workers.dev` (per Session 49 scaffold). If not, restore.
3. **Start the webhook receiver tail.** From a terminal: `wrangler tail --format pretty` against the deployed worker. Leave running.
4. **Send a deliverable test message.** Issue an outbound SMS via the Sinch XMS API (same shape as Experiment 1's `exp-01-outbound.json` request body, swapping in the now-registered service plan/number). Send the literal body `Phase 1 Experiment 2b — please reply with any text`. Capture the API request + response (status, latency, body).
5. **Confirm delivery on Joel's phone.** Wait up to 30 seconds. If the message does not arrive, the campaign is not actually delivery-capable yet — stop, document the failure mode, do not proceed.
6. **Capture the success-path delivery-report callback.** The webhook receiver should fire with a `delivery_report_sms` payload for the outbound. Record the full payload (this complements Experiment 2a's failure-side capture with a success-side fixture for Phase 2 test coverage).
7. **Reply from Joel's phone.** Send back a short plain-text reply: `MO test reply 2b — body capture`. (Avoid keywords STOP/START/HELP — those are Experiment 5's territory.)
8. **Capture the MO callback.** The webhook receiver should fire again with what is presumed to be a `mobile_originated` payload (or whatever discriminator value Sinch actually uses — the type field's MO value is itself one of the things this experiment establishes). Record the full payload.
9. **Repeat once with a longer body.** Send a second outbound, reply with a multi-segment-length body (e.g., 200+ characters with punctuation), capture the resulting MO payload. Establishes whether multi-segment MO arrives as one callback or N callbacks, and whether the body field is concatenated or split.
10. **Capture timing.** Note elapsed seconds between Joel's tap-send on the reply and the callback hitting the worker (rough — `wrangler tail` timestamps suffice). Phase 4 latency budgets depend on this order of magnitude.

### Expected artifacts
- `experiments/sinch/fixtures/exp-02b-mo-inbound.json` — bidirectional fixture mirroring 2a's schema. Top-level keys: `outbound_send` (api_request + api_response from step 4), `delivery_report_callback` (from step 6 — success-side complement to 2a), `mo_callback` (from step 8), `mo_callback_long_body` (from step 9), `timing` (send→delivery-report and reply→MO deltas), `captured_at`, `notes`.
- Append to this file's Experiment 2b section: full Findings + Implications subsections.
- Existing webhook receiver code (`experiments/sinch/webhook-receiver/`) requires no changes — it already logs all POSTs uniformly.

### Success criteria
- MO callback received and captured for at least one short-body and one long-body reply.
- Top-level type discriminator value documented (e.g., `mobile_originated`, `mo_text`, or whatever Sinch emits — confirms or invalidates the assumption in Experiment 2a's "reserve other values" finding).
- Body field shape documented (key name, encoding, segment behavior on long bodies).
- Sender/recipient field shapes documented (E.164 format? bare digits? prefixed?).
- Outbound message correlation key identified — what field on the MO payload, if any, ties it back to the original outbound that was replied to (message_id, conversation_id, thread, or none — affects Phase 4 dispatch logic).
- Signature/HMAC header present-or-absent confirmed (Experiment 2a found none on delivery reports — does the same hold for MO?).
- Success-side delivery-report callback shape captured to complement 2a's failure-side capture.

### Status: BLOCKED on 3b approval + number-to-campaign association completion (registration ID `01kq5ahkf08v64ymqnxsnme5bg`).

---

## Experiment 3a — Brand registration submission + timing

**Status:** complete (2026-04-25)
**Goal:** characterize Sinch's brand registration flow (form fields, state machine, timing, webhook events) and validate the fast-registration claim that anchors MASTER_PLAN §0 customer value #1.

### Procedure
1. Sign in to dashboard.sinch.com → 10DLC → Brands → Register new brand.
2. Select Simplified path. Choose entity type `Private Profit`.
3. Fill Company / Financial / Contact details (full field reference in `docs/CARRIER_BRAND_REGISTRATION_FIELDS.md`).
4. Submit; observe submission timestamp + Bundle ID assigned.
5. Watch the dashboard activity feed for `BRAND_IDENTITY_STATUS_UPDATE` webhook events and Brand ID assignment.
6. Record the approval timestamp, Bundle state transitions, and IdentityStatus values observed during the lifecycle.

### Findings
_Captured 2026-04-25._

- **Timing:** ~60 seconds end-to-end. Submission 11:20 ET → Bundle state `Approved` 11:21 ET (2026-04-25). Materially better than the "a few days" language in D-215 — but **one** data point on the Simplified path with all-correct inputs; not yet representative. Marketing should not retune copy against a 60s anchor without more samples.
- **Brand created:** Brand ID `BTTC6XS`, Bundle ID `01kq2jqyhjynvr2wcpp0bbppgr`, registration type Simplified, entity type Private Profit (API enum `PRIVATE`), vertical `TECHNOLOGY` (dashboard label "Information Technology Services").
- **IdentityStatus observed:** terminal value `VERIFIED` only; intermediate transitions not visible from the dashboard event log. (`IdentityStatus` is TCR-level brand identity; distinct from Sinch's bundle-level lifecycle.)
- **Bundle state transitions observed:** `In review` → `Approved`. (Sinch's bundle-level lifecycle; distinct from `IdentityStatus`. **Two state-tracking concepts exist at the Sinch level — see `docs/CARRIER_BRAND_REGISTRATION_FIELDS.md` §Brand state machine.**)
- **Webhook event observed:** `BRAND_IDENTITY_STATUS_UPDATE` fired during the lifecycle. Visible from the dashboard activity feed; raw payload not accessible to us through the dashboard UI. Notable: Sinch's API docs say "initial release will not include a webhook service, you will need to poll" — but the webhook fired internally during this run, so **either the docs are stale or webhooks fire to dashboard internally but aren't yet exposed to API consumers**. Confirm with Sinch BDR before Phase 2 Session B kickoff.
- **Sole Proprietor gap:** API `brandEntityType` enum is exactly `PUBLIC | PRIVATE | CHARITY_NON_PROFIT`. **There is no SOLE_PROPRIETOR option.** This is a real product gap for RelayKit's no-EIN ICP segment (vibe coders, hobbyists, indie devs without an EIN). See BACKLOG entry on Sole Proprietor segment gap.
- **State machine mismatch:** API exposes 5 brand states (`DRAFT`, `IN_PROGRESS`, `REJECTED`, `APPROVED`, `UPGRADE`); the dashboard shows 7 (adds Queue, Archived). To verify against Sinch API docs before Phase 2 Session B kickoff. (See `docs/CARRIER_BRAND_REGISTRATION_FIELDS.md` §Brand state machine.)
- **Pricing inconsistency:** API docs cite Simplified at $10; dashboard charged $6 for this run. To verify before pricing-model claims become customer-facing.
- **Vertical enum mapping:** dashboard display labels do not equal API enum values. Observed this run: "Information Technology Services" → `TECHNOLOGY`. Mapping table for all 22 verticals lives in `docs/CARRIER_BRAND_REGISTRATION_FIELDS.md`; remaining 21 entries TBD as future experiments observe them.
- **HEALTHCARE annotation on D-18:** HEALTHCARE is a valid `brandVerticalType` value at the Sinch API level. **D-18's healthcare decline is a RelayKit policy choice, not a carrier-level constraint.** D-18 annotated this session in `DECISIONS_ARCHIVE.md` with this context.
- **IRS name change letter:** Joel's IRS name change letter (sent 2026-04-24, the day before this run) was not yet processed by the IRS at submission time, but registration succeeded anyway. Implication for the wizard: legal-name verification may have grace periods or pre-processed cache windows we can't predict; do not assume IRS records update immediately when designing the customer wizard's name-mismatch handling.

### Implications for Phase 2 Session B kickoff:
1. **Three Sinch API/dashboard inconsistencies to verify before Session B:** the brand state machine (5 vs 7), Simplified pricing ($10 vs $6), and webhook policy (poll-only docs vs internal-fire observed). Each needs PM-side confirmation with Sinch BDR (Elizabeth Garner).
2. **Webhook signature verification design (already flagged from 2a, reaffirmed here):** if `BRAND_IDENTITY_STATUS_UPDATE` is exposed to API consumers in a future Sinch release, the signature-verification design from Session B's kickoff discussion will need to cover this event-type alongside `delivery_report_sms`.

### Implications for Phase 5 (Registration Pipeline) wizard design:
1. **Sole Prop ICP segment cannot onboard via Sinch's 10DLC API.** Phase 5 design must decide between TFN routing, secondary carrier for Sole Prop, or removing Sole Prop from ICP. See BACKLOG entry on Sole Prop segment gap.
2. **Customer registration fee tiering needs design.** $49 covers Simplified margin comfortably; loses money on Full path. See BACKLOG entry on customer brand registration path tiering.
3. **BYO existing TCR brand import is a real option.** Sinch's UI surfaces an import path; relevant for capturing churned customers from other CSPs. See BACKLOG entry on BYO TCR brand import.

### Status: COMPLETE — captured 2026-04-25.

---

## Experiment 3b — Campaign registration submission + timing

**Status:** SUBMITTED — awaiting approval (2026-04-26 12:39 ET).
**Goal:** measure Sinch's campaign-registration submission shape, the IdentityStatus / bundle-level state machine for campaigns, approval timing, and any webhook events fired during the campaign lifecycle. Output is the Phase 5 campaign-submission fixture and confirmation that the fast-registration claim extends to campaign-level approval (registration is only customer-go-live-ready after campaign approval per MASTER_PLAN §9).

### Procedure
1. Sign in to dashboard.sinch.com → 10DLC → Campaigns → Register new campaign.
2. Select brand `BTTC6XS` (RelayKit, approved via 3a).
3. Choose use case `LOW_VOLUME` (Low Volume Mixed) and four sub use cases: `2FA`, `Account Notification`, `Customer Care`, `Delivery Notification`.
4. Fill description, sample messages, opt-in flow documentation, embedded link/phone toggles, CTA, T&C link + body, Privacy link + body, additional comments. Skip the optional `Supporting Documentation Upload` step (skip affordance not displayed on the step but allowed at submit).
5. Select a number to associate (`+12013619609`); note: number selected in form but campaign detail post-submission shows "No Numbers" — association is a separate post-approval step.
6. Submit; observe registration ID assigned, status (`PENDING_REVIEW` or equivalent), and dashboard balance debit (or absence thereof).
7. Watch the dashboard activity feed for any `CAMPAIGN_*` webhook events and TCR Campaign ID assignment.
8. Record approval timestamp, status transitions, monthly-fee debit timing, throughput tier population.

### Findings
_Captured 2026-04-26 at submission time. Approval-time findings to be appended on status change._

- **Submission timing:** 2026-04-26 12:39 ET (16:39 UTC). Registration ID `01kq5ahkf08v64ymqnxsnme5bg` assigned at submission. TCR Campaign ID **not yet assigned** at submission time (`-` in dashboard).
- **Use case taxonomy:** `LOW_VOLUME` (Low Volume Mixed) — chose this over a single-use-case standard tier for the test campaign. Four sub use cases declared: `2FA`, `Account Notification`, `Customer Care`, `Delivery Notification`. Sinch's use-case taxonomy (~22 options at the dashboard level) does not map 1:1 to RelayKit's 8-vertical product taxonomy — see BACKLOG entry on RelayKit vertical-to-Sinch-use-case mapping.
- **Brand reuse:** Brand `BTTC6XS` (from 3a) used; no second brand registration needed. Brand displayed as both Brand Name and Brand ID in the campaign detail view (cosmetic redundancy, not a data issue).
- **Number selection vs association:** number `+12013619609` selected in the campaign form, but campaign detail post-submission shows "No Numbers" — number-to-campaign association is apparently a separate step that happens post-approval, not at form submission. To confirm on approval.
- **Monthly fee disclosure inconsistency:** Step 3 disclosure stated `$1.50/mo with 3-month minimum`; submission confirmation dialog stated `$1.50 recurring`; campaign detail post-submission shows **Monthly Fee: $0**. Three different values across the same flow. Account balance unchanged at $87.97 immediately post-submission (no debit observed). Likely the monthly fee debit triggers at approval, not submission — to confirm. Adds a fourth API/dashboard inconsistency for Session B kickoff verification with Sinch BDR.
- **Throughput tier disclosed:** AT&T `75 msg/min` (campaign-level); T-Mobile `2,000/day` (brand-level shared across all campaigns under the brand). Per-carrier throughput class is disclosed at submission time, not just at approval.
- **Submission UX findings:**
  - **Skip-allowed without skip affordance.** "Supporting Documentation Upload" step had no skip button or "skip optional step" affordance, but the form accepted submission with the section empty. Discoverable only by trying.
  - **Belt-and-suspenders Privacy/Terms.** Both link AND body fields for Privacy and Terms&Conditions populated separately. Sinch may use the link as the canonical reference and body as on-file backup, or vice versa, or both — not documented.
  - **`PP:` string in CTA display.** Review screen showed the Call-to-Action display field with `PP:` concatenated as a prefix. Unclear whether this is a display-layer artifact or an actual field merge happening server-side at submission. Flagged for verification post-approval.
  - **Brand displayed twice in campaign detail.** `BTTC6XS` shown as both Brand Name and Brand ID — cosmetic-only, no data issue.
  - **Sinch use cases (~22) vs RelayKit verticals (8) mismatch.** Translation table between Sinch's taxonomy and RelayKit's product taxonomy needs to be designed in Phase 5 (BACKLOG-tracked).

### Implications for Phase 2 Session B kickoff:
1. **Four Sinch API/dashboard inconsistencies now open** (was three after 3a; 3b adds the monthly-fee disclosure inconsistency). Each needs PM-side confirmation with Sinch BDR (Elizabeth Garner) before Session B kickoff.
2. **Webhook signature verification design (still open from 2a).** No `CAMPAIGN_*` webhooks observed at submission; if exposed at approval, they need to be on the same verification layer as `delivery_report_sms` and `BRAND_IDENTITY_STATUS_UPDATE`.
3. **Monthly-fee debit timing unknown.** $0 displayed monthly fee with $87.97 unchanged balance suggests fee triggers at approval, not submission — affects Phase 5 customer-billing event modeling.

### Implications for Phase 5 (Registration Pipeline) wizard design:
1. **RelayKit vertical → Sinch use case mapping is a real Phase 5 design task.** Sinch's ~22 use cases include some RelayKit doesn't currently expose (Charity, Higher Ed, K-12) and some likely out-of-scope for ICP (Political, Sweepstake, Polling, Fraud Alert). See BACKLOG entry.
2. **Customer registration form is due for a design round.** Field-by-field reality from 3a + 3b reveals what Sinch actually wants vs what the current `/apps/[appId]/register` form captures. See BACKLOG entry.
3. **Number-to-campaign association is a post-approval step.** Wizard UX for the "your campaign is approved, now pick a number" moment needs to be designed — the customer can't pick a number until the campaign approves.

### Status: SUBMITTED — awaiting approval. Registration ID `01kq5ahkf08v64ymqnxsnme5bg`.

---

## Experiment 5 — STOP / START / HELP reply handling

**Status:** BLOCKED — requires a delivery-capable sender (approved campaign + associated number). Same gating as Experiment 2b. Should run in the same sitting as 2b, immediately after, since the receiver is already tailing and the deliverable sender is already proven by 2b's step 5.

**Goal:** determine whether Sinch auto-handles 10DLC carrier-required reply keywords (STOP, START, HELP) at the carrier or platform layer, or whether RelayKit must implement parsing, ledger management, and outbound suppression itself. Outcome decides the scope of Phase 4's inbound consent-handling logic — minimal (Sinch handles; we update our ledger from notifications) versus full (we parse keywords, manage opt-out state, block subsequent sends).

### Procedure
Run only after Experiment 2b has confirmed the deliverable sender works and the basic MO payload shape is captured. The receiver should already be tailing.

**Part A — STOP behavior:**

1. **Send a fresh outbound** with body `Phase 1 Experiment 5A — keyword test, reply STOP`. Capture send-path request/response.
2. **Reply STOP** from Joel's phone (uppercase, no punctuation — the canonical form).
3. **Observe receiver.** Capture: any MO callback fired (presumably with body `STOP`), any system-generated callback type (e.g., a distinct `opt_out` or `subscription_change` event type), any auto-reply outbound that Sinch issued without our involvement (visible as either an additional callback we don't recognize or simply by Joel's phone receiving a confirmation SMS — note both).
4. **Joel notes any auto-reply text** received on his phone (verbatim — this is carrier-mandated copy and useful Phase 4 reference for what NOT to duplicate).
5. **Wait 60 seconds, then attempt a follow-up outbound** to the same number with body `Phase 1 Experiment 5A — follow-up after STOP`. Capture: API response status (does Sinch reject it pre-send with an error? accept it but silently drop carrier-side? accept and deliver?), any error code/body, whether Joel's phone receives the message.

**Part B — START behavior:**

6. **Reply START** from Joel's phone.
7. **Observe receiver** for any MO callback / opt-in event / auto-reply (capture verbatim if Sinch emits one).
8. **Wait 60 seconds, then send a fresh outbound** with body `Phase 1 Experiment 5B — re-opt-in confirmed`. Capture: API response, delivery to Joel's phone, delivery-report callback type and body.

**Part C — HELP behavior:**

9. **Send a fresh outbound** with body `Phase 1 Experiment 5C — help keyword test`. Capture send-path response.
10. **Reply HELP** from Joel's phone.
11. **Observe receiver** for the MO callback (presumably body `HELP`) plus any system-generated event or auto-reply Sinch issues.
12. **Joel notes any auto-reply text** received verbatim. HELP responses are carrier-mandated and typically include sender identification + opt-out instructions — this captures whether Sinch's default response satisfies that requirement or whether we'd need to author our own.

**Part D — case and variant sensitivity (one round, time-permitting):**

13. **Send another outbound.** Reply with `stop` (lowercase). Observe whether it triggers the same opt-out flow or is treated as a regular MO body. Same for `Stop`, ` STOP ` (with surrounding whitespace), `STOP NOW`. Capture per-variant behavior — is Sinch matching strict-uppercase-exact, case-insensitive-exact, contains, or token-match? This determines what RelayKit's parser (if needed at all) must handle.

### Expected artifacts
- `experiments/sinch/fixtures/exp-05-keyword-handling.json` — single fixture with sub-objects per part: `part_a_stop` (outbound send + MO callback + any opt-out event + follow-up outbound result), `part_b_start` (MO callback + post-START outbound result), `part_c_help` (outbound + MO callback + auto-reply text), `part_d_variants` (array of `{variant, mo_payload, blocked_status}`), `auto_replies_received_on_phone` (array of any system-issued auto-reply texts captured by Joel), `captured_at`, `notes`.
- Append to this file's Experiment 5 section: Findings + Implications subsections.
- No webhook receiver changes.

### Success criteria
For each of STOP, START, HELP, the experiment must produce a clear answer to:

- **Does Sinch surface the keyword to us via webhook?** (yes / no / yes-but-as-distinct-event-type)
- **Does Sinch auto-block subsequent outbound sends to that recipient post-STOP?** (API rejects pre-send / accepts then silently drops / no blocking)
- **Does Sinch issue a carrier-required auto-reply automatically?** (yes — capture verbatim text / no — RelayKit must)
- **Does case sensitivity / surrounding text matter?** (strict / lenient / unclear)
- **What's the canonical event-type discriminator (if any) for opt-out / opt-in events?** (lets Phase 4 dispatcher branch on event type, not parsed body)

Pass condition for the experiment as a whole: enough evidence to make the Phase 4 design decision between "thin consent layer (ledger updates from Sinch notifications)" and "thick consent layer (full keyword parsing + state management + outbound suppression)" without further investigation.

### Status: BLOCKED on 3b approval + number-to-campaign association completion (registration ID `01kq5ahkf08v64ymqnxsnme5bg`).
