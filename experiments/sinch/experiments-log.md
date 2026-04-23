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

## Experiment 2 — Inbound webhook + delivery report callback shape

**Status:** not yet run
**Goal:** Stand up a public webhook endpoint, configure as Service Plan callback URL, send with delivery_report:full, capture the actual delivery report payload Sinch posts to the callback. Also tests inbound MO message handling (reply to the test send).

### Procedure
_To be drafted before running._

### Status: NOT STARTED.
