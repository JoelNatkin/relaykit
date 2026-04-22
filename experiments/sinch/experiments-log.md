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
_To be filled in after run._

- Phone number provisioned:
- Auth shape (header name, credential format):
- Request URL + method:
- Time from API call to phone buzz:
- Response shape highlights (message ID field name, status field, surprises):
- Gotchas or divergences:
- Implications for Phase 2 Session B build:
