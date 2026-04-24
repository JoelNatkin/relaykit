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

**Status:** BLOCKED — requires a delivery-capable sender. Unregistered 10DLC traffic from Experiment 1 does not reach the recipient phone, so there is no message to reply to and no inbound MO to capture. Unblocks when Experiments 3 + 4 produce a registered brand + campaign.

**Goal:** capture the payload Sinch POSTs to the Service Plan callback URL when a recipient replies (mobile-originated, MO) to a message. This is the Phase 4 inbound-handler contract.

### Procedure
_To be drafted after Experiments 3 + 4 land and a registered sender exists. Reuses the webhook receiver from 2a; adds: send a real deliverable message to your phone → reply → capture the resulting MO callback. Likely also captures a success-side delivery-report callback, which complements 2a's failure-side capture._

### Status: BLOCKED on Experiments 3 + 4.
