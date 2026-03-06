# PRD_09: MESSAGING PROXY & DEVELOPER SANDBOX
## RelayKit — Compliant SMS API with Instant Developer Onboarding
### Version 1.0 — Mar 1, 2026

> **Dependencies:** Requires registration infrastructure from PRD_04 (Twilio Submission). Replaces direct-to-Twilio deliverable from PRD_05. Extends compliance monitoring from PRD_08 (moves critical checks from async to inline). Dashboard additions (PRD_06) required for API key management and usage display.

---

## 1. OVERVIEW

RelayKit's messaging proxy sits between the customer's application and Twilio's messaging API. Every outbound message passes through RelayKit's compliance layer before reaching the carrier, and every inbound message passes through RelayKit before reaching the customer's webhook. This architecture enables preventive compliance enforcement — violations are blocked before delivery, not detected after the fact.

The developer sandbox provides an instant, fully functional API environment that mirrors production behavior without requiring 10DLC registration. Developers sign up, get an API key, and start building immediately. The sandbox runs the same compliance checks as production and delivers real messages to the developer's own verified phone number.

### Why the proxy exists (three reasons)

**1. Platform protection.** As the ISV, RelayKit is liable for all traffic on its Twilio account. PRD_08's async monitoring detects violations after messages are delivered — the carrier has already seen the violation. The proxy blocks violations before they reach Twilio. This is the difference between a security camera and a bouncer.

**2. Revenue alignment.** With every message flowing through RelayKit, usage-based billing is native. No polling Twilio logs, no trusting customer-reported volumes. Metering is a byproduct of routing.

**3. Customer stickiness.** Developers integrate against RelayKit's API, not Twilio's. The sandbox creates integration lock-in before any money changes hands. Switching to a competitor after building and testing against RelayKit's endpoint means rewriting working code.

### What does NOT change
- PRD_03 (Compliance Site Generator) — unchanged
- PRD_05_ADDENDUM (Vertical Modules) — unchanged

> **Note:** PRD_01 now has a dashboard-flow addendum (PRD_01_ADDENDUM_DASHBOARD_FLOW.md). PRD_02 requires content expansion for the message plan builder (5–8 base + 3–4 expansion messages per use case). SMS_GUIDELINES_TEMPLATE requires updates for tier-conditional Twilio/RelayKit references. These are documented in their respective PRDs.

---

## 2. DEVELOPER SANDBOX

### Signup and instant access
1. Developer visits relaykit.com, clicks "Start building free"
2. Enters email address
3. Receives magic link (Supabase Auth)
4. Clicks link → lands on sandbox dashboard with API key ready

No payment. No registration. No business details. Just an email and an API key.

### Sandbox API key format
```
rk_sandbox_{random_32_chars}
```
Production keys (post-registration):
```
rk_live_{random_32_chars}
```

All keys are prefixed to prevent accidental use in wrong environment (following Stripe's pattern).

### Sandbox capabilities

**Outbound messages:**
- Developer sends via `POST /v1/messages` with sandbox key
- Message passes through the full compliance pipeline (same checks as production)
- If checks pass: message is delivered to the developer's verified phone number via a shared Twilio sandbox number
- If checks fail: message is rejected with the same error response production would return
- Developer sees exactly how compliance enforcement works during development

**Inbound messages:**
- Developer replies to the sandbox number from their verified phone
- RelayKit receives the inbound via Twilio webhook
- RelayKit forwards to the developer's configured webhook URL
- Developer tests their full inbound handling logic (reply parsing, keyword routing)

**Opt-out handling:**
- Developer texts STOP to sandbox number → added to sandbox opt-out list
- Subsequent sends to that number are blocked with `recipient_opted_out` error
- Developer texts START → removed from opt-out list, sends resume
- Full opt-out lifecycle testable without a live campaign

### Sandbox constraints
- Outbound delivery limited to one verified phone number (developer's own)
- 100 messages per day (prevents abuse of shared sandbox number)
- No MMS support in sandbox
- Shared sandbox number (not a dedicated number)
- Sandbox messages include a `[SANDBOX]` prefix to distinguish from production
- No guaranteed delivery SLA (shared infrastructure)

### Verified phone number
During sandbox setup, the developer provides their phone number and receives a 6-digit verification code. This becomes the only number the sandbox can deliver to. The developer can change their verified number from the dashboard (re-verification required).

```typescript
// POST /v1/sandbox/verify
{
  "phone_number": "+15551234567"
}
// → Sends 6-digit code to phone

// POST /v1/sandbox/verify/confirm
{
  "phone_number": "+15551234567",
  "code": "847293"
}
// → Marks number as verified, sandbox is now active
```

### Sandbox-to-registration bridge

The sandbox tracks developer behavior to inform and de-risk registration:

**Engagement signals (trigger registration nudge):**

> See PRD_06 v3 Section 2 for the authoritative definition of engagement signal UX behavior and stage transitions.

- Sent >20 sandbox messages
- Configured a webhook URL
- Tested opt-out flow (sent STOP + START)
- Active on 3+ distinct days

When engagement signals are met, the dashboard shows: "Looks like you're getting close. Start your registration now so it's ready when you are — registration typically takes 2–3 weeks."

**Pre-qualification from sandbox data:**
- Message content patterns reveal actual use case (confirms or corrects intake selection)
- Compliance check pass/fail rate predicts registration approval odds
- Opt-out handling behavior demonstrates developer sophistication
- This data can be surfaced during intake: "Based on your sandbox activity, your registration looks strong"

### Going live
When registration is approved:
1. System generates a `rk_live_` API key
2. Dashboard shows both keys side by side with clear labels
3. Developer swaps the key in their `.env` file
4. Same API, same endpoint, same code — messages now route through live Twilio subaccount
5. Sandbox key remains active for continued testing

---

## 3. API SPECIFICATION

### Base URL
```
https://api.relaykit.dev/v1
```

### Authentication
Bearer token in Authorization header:
```
Authorization: Bearer rk_live_abc123...
```

### Endpoints

#### Send Message
```
POST /v1/messages
```

**Request:**
```json
{
  "to": "+15551234567",
  "body": "Your order #1234 has shipped! Reply STOP to opt out.",
  "idempotency_key": "order-1234-shipped"
}
```

**Success response (202 Accepted):**
```json
{
  "id": "msg_abc123",
  "object": "message",
  "to": "+15551234567",
  "body": "Your order #1234 has shipped! Reply STOP to opt out.",
  "from": "+15559876543",
  "status": "queued",
  "compliance": {
    "checks_passed": true,
    "warnings": []
  },
  "livemode": true,
  "created_at": "2026-03-01T15:30:00Z"
}
```

**Compliance rejection response (422 Unprocessable Entity):**
```json
{
  "error": {
    "type": "compliance_error",
    "code": "recipient_opted_out",
    "message": "Recipient has opted out of messages. Sending to opted-out recipients violates carrier rules and TCPA regulations.",
    "doc_url": "https://docs.relaykit.dev/errors/recipient-opted-out",
    "request_id": "req_xyz789"
  }
}
```

**Error codes:**
| Code | HTTP Status | Meaning |
|------|-------------|---------|
| `recipient_opted_out` | 422 | Recipient has sent STOP |
| `marketing_consent_required` | 422 | MIXED tier: recipient has not given explicit marketing consent for this message type |
| `quiet_hours_violation` | 422 | Outside 9 AM – 9 PM recipient local time |
| `content_prohibited` | 422 | SHAFT-C content detected |
| `rate_limit_exceeded` | 429 | Carrier throughput limit reached |
| `content_drift_detected` | 422 | Message doesn't match registered use case |
| `missing_opt_out_language` | 422 | First message to recipient lacks opt-out instructions |
| `sandbox_unverified_recipient` | 422 | Sandbox: recipient is not the verified number |
| `daily_limit_exceeded` | 429 | Sandbox: 100/day limit reached |
| `invalid_api_key` | 401 | Key missing, malformed, or revoked |
| `registration_not_complete` | 403 | Live key used but registration still pending |

#### Get Message
```
GET /v1/messages/{message_id}
```

Returns message object with current delivery status (queued, sent, delivered, failed, undelivered).

#### List Messages
```
GET /v1/messages?limit=25&after=msg_abc123
```

Paginated list of messages for the authenticated customer. Cursor-based pagination.

#### Check Opt-Out Status
```
GET /v1/opt-outs/{phone_number}
```

Returns whether a phone number is currently opted out.

#### Preview Message (Compliance Check)
```
POST /v1/messages/preview
```

Validates a message against the customer's registration context and compliance rules without sending it. Returns a detailed verdict with per-check results, warnings, and rewrite suggestions.

**Request:**
```json
{
  "body": "Don't forget your appointment! And we're running a 20% off special!",
  "to": "+15551234567"
}
```

**Response:**
```json
{
  "verdict": "warning",
  "checks": {
    "opt_out_language": true,
    "business_name": false,
    "shaft_c": true,
    "quiet_hours": true,
    "use_case_alignment": false
  },
  "warnings": [
    {
      "code": "content_drift_detected",
      "message": "This message contains promotional content ('20% off') but your campaign is registered for Customer Care.",
      "severity": "high"
    },
    {
      "code": "missing_business_name",
      "message": "Messages should begin with your business name for sender identification.",
      "severity": "medium"
    }
  ],
  "suggestions": [
    "Remove the promotional offer to stay within your approved use case.",
    "Compliant alternative: 'Bright Smile Dental: Reminder — your appointment is tomorrow at 2:00 PM. Reply C to confirm. Reply STOP to opt out.'"
  ]
}
```

Runs all inline compliance checks plus a Claude API call for semantic use case analysis. Rate limited: 60 previews/minute per API key. Works in both sandbox and live environments. ~$0.005-0.01 per preview (Claude API cost).

#### List Opt-Outs
```
GET /v1/opt-outs?limit=50
```

Paginated list of all opted-out phone numbers.

#### Register External Opt-Out
```
POST /v1/opt-outs
```
```json
{
  "phone_number": "+15551234567",
  "source": "web_form"
}
```

Allows developers to register opt-outs from non-SMS channels (email, web form, phone call). **Required by April 2025 TCPA amendments** — any reasonable means of opt-out must be honored within 10 business days, including opt-outs received via email, web form, or phone. Developers must call this endpoint whenever any channel receives a revocation request, not just when a STOP keyword is received. The `SMS_GUIDELINES.md` compliance co-pilot instructs AI coding tools to implement this pattern.

`source` values: `'web_form'`, `'email'`, `'phone_call'`, `'api'`, `'natural_language'`

Optional `raw_text` field: preserve the original opt-out language if natural language (e.g., `"raw_text": "Please leave me alone"`) — stored in `sms_opt_outs.raw_opt_out_text` for audit purposes.

#### Register Marketing Consent
```
POST /v1/consents
```
```json
{
  "phone_number": "+15551234567",
  "consent_type": "marketing",
  "source": "web_form"
}
```

MIXED tier only. Registers explicit marketing consent for a recipient. Must be called when a recipient checks the marketing opt-in checkbox on the developer's form. The compliance site's opt-in form calls this endpoint on submission. Without a `marketing` consent record, the proxy blocks marketing messages to this recipient with `marketing_consent_required` (422).

`consent_type`: `'transactional'` | `'marketing'`
`source`: `'web_form'`, `'api'`, `'keyword'`, `'import'`

**Success response (201 Created):**
```json
{
  "phone_number": "+15551234567",
  "consent_type": "marketing",
  "consented_at": "2026-03-04T15:30:00Z"
}
```

**Revoke consent:**
```
DELETE /v1/consents/{phone_number}?consent_type=marketing
```
Sets `revoked_at` timestamp — proxy will block marketing messages to this recipient until new consent is registered.

#### Create Webhook
```
POST /v1/webhooks
```
```json
{
  "url": "https://myapp.com/api/sms/inbound",
  "events": ["message.received", "message.status", "opt_out.created"]
}
```

#### List Webhooks
```
GET /v1/webhooks
```

#### Delete Webhook
```
DELETE /v1/webhooks/{webhook_id}
```

#### Get Account Info
```
GET /v1/account
```

Returns account status, registration state, usage stats, rate limits.

---

## 4. COMPLIANCE PIPELINE

### Architecture
```
Customer App
    ↓
POST /v1/messages (RelayKit Edge)
    ↓
[1. Auth — verify API key, check account status]        ~2ms
    ↓
[2. Opt-out check — Redis lookup]                       ~3ms
    ↓
[3. Rate limit — Redis token bucket]                    ~2ms
    ↓
[4. Content scan — regex + keyword matching]            ~3ms
    ↓
[5. Quiet hours — recipient timezone lookup]            ~2ms
    ↓
[6. Marketing consent check — MIXED tier only]          ~3ms
    (classify message as marketing/transactional,
     if marketing: lookup recipient_consents table,
     block with marketing_consent_required if no consent)
    ↓
[PASS] → Forward to Twilio Subaccount API              ~250ms
[FAIL] → Return error response with actionable code     ~0ms

    ↓ (async, after Twilio accepts)
[6. Log message metadata to Supabase]
[7. Increment usage counter]
[8. Fire webhook events to customer]
```

**Target overhead: <15ms** on top of Twilio's latency. Total send time ~265ms.

### Inline checks (synchronous, block on failure)

These checks run before every message is forwarded to Twilio. They map to the highest-risk rules from PRD_08:

| Check | PRD_08 Rule | Why inline |
|-------|-------------|------------|
| Opt-out lookup | BM-03 | $500–$1,500 TCPA fine per message |
| SHAFT-C content | BM-04 | Carrier campaign suspension |
| Quiet hours | BM-05 | State-level legal violations |
| Rate limiting | (new) | Carrier throttling / number blacklisting |
| Empty message | BM-07 | Carrier rejection |
| URL blocklist | BM-08 | Carrier filtering |

### Async checks (non-blocking, alert-based)

These checks run after the message is accepted but don't block delivery. They remain alert-based per PRD_08:

| Check | PRD_08 Rule | Why async |
|-------|-------------|-----------|
| Business name present | BM-01 | Warning, not a violation |
| Opt-out language in first message | BM-02 | Important but not carrier-enforceable |
| Message frequency | BM-06 | Pattern detection over time |
| Semantic drift detection | BM-09 | Claude API latency (~500ms), sampled not every message |

### Opt-out management

**Primary (inline):** RelayKit maintains its own opt-out database per customer. Lookups hit Redis first (SET per customer with O(1) SISMEMBER), with Supabase Postgres as source of truth.

**Secondary (defense-in-depth):** Twilio's Messaging Service also maintains opt-out lists. If RelayKit's check misses and Twilio blocks (error 21610), the proxy catches the Twilio error and adds the number to RelayKit's list retroactively.

**Inbound STOP handling:**
1. End user texts STOP to customer's number
2. Twilio receives, fires webhook to RelayKit
3. RelayKit adds number to Redis + Supabase opt-out table
4. RelayKit fires `opt_out.created` webhook to customer's app
5. Twilio's built-in handler also sends standard opt-out confirmation

**External opt-out API:**
Per April 2025 TCPA amendments, consumers can opt out via "any reasonable manner." The `POST /v1/opt-outs` endpoint lets developers register opt-outs from web forms, emails, phone calls, etc.

### Rate limiting

Token bucket algorithm implemented via atomic Redis Lua scripts.

**Four tiers:**
1. **Per-API-key** (abuse prevention): 60 requests/minute
2. **Per-customer** (carrier allocation): matches carrier-assigned MPS based on trust score
3. **Per-sender-number** (individual number throughput): carrier MPS per number
4. **Global** (protect RelayKit's parent Twilio account): hard ceiling across all customers

**When rate limit exceeded:** Return HTTP 429 with `Retry-After` header. Customer's code retries automatically (standard HTTP client behavior).

**Trust score to rate limit mapping:**
| Trust Score | T-Mobile Daily Cap | Total MPS | Per-Number MPS |
|-------------|-------------------|-----------|----------------|
| Sole Proprietor | 1,000 | 2.25 | 1 |
| 1–49 | 10,000 | 12 | 4 |
| 50–74 | 40,000 | 120 | 40 |
| 75–100 | 200,000 | 225 | 75 |

### Content scanning

**Inline (regex, <3ms):**
- SHAFT-C keyword detection (reuses PRD_08's `scanForShaftC()`)
- URL blocklist matching
- Empty/whitespace-only body detection
- Known phishing pattern matching

**Important:** Keyword scanning will produce false positives (e.g., a wine bar mentioning "wine tasting" triggers alcohol keyword). The proxy handles this with a per-customer allowlist built from their registered use case and business type. Healthcare businesses get medical terms allowlisted. Restaurants get food/beverage terms allowlisted. The allowlist is generated automatically during registration based on PRD_05_ADDENDUM vertical detection.

---

## 5. INBOUND MESSAGE HANDLING

### Flow
```
End user sends SMS → Carrier → Twilio → RelayKit webhook → Compliance checks → Customer webhook
```

### Webhook forwarding
When an inbound message arrives:
1. Twilio fires webhook to `POST /api/webhooks/inbound/{registrationId}`
2. RelayKit parses the message
3. If STOP/START/HELP keyword: process opt-out/in (Section 4 above), still forward to customer
4. Transform to RelayKit's webhook payload format
5. POST to customer's configured webhook URL
6. If customer webhook fails: retry 3 times with exponential backoff (1s, 4s, 16s)
7. After 3 failures: log to dead letter queue, surface in dashboard

### Customer webhook payload
```json
{
  "id": "evt_abc123",
  "object": "event",
  "type": "message.received",
  "data": {
    "id": "msg_inbound_xyz",
    "from": "+15551234567",
    "to": "+15559876543",
    "body": "YES confirm my appointment",
    "received_at": "2026-03-01T15:30:00Z"
  },
  "livemode": true
}
```

### Webhook signature verification
Each webhook includes a signature header for customer-side verification:
```
X-RelayKit-Signature: sha256=abc123...
```
Computed as HMAC-SHA256 of the request body using the customer's webhook secret.

---

## 6. TWILIO INTEGRATION

### Subaccount architecture

The proxy requires Twilio subaccounts (Architecture #1). Each customer gets their own subaccount, providing:
- Isolated credentials (subaccount SID + auth token)
- Isolated opt-out lists at Twilio's level
- Isolated compliance enforcement — if one customer is flagged, Twilio can act on that subaccount without affecting others
- Clean usage reporting per customer

> **NOTE:** This supersedes the Architecture #4 decision from the original PROJECT_OVERVIEW. The proxy's need for per-customer isolation makes subaccounts a v1 requirement, not a scale migration. PRD_04's submission engine creates subaccounts as part of registration.

### Message forwarding
```typescript
async function forwardToTwilio(
  message: ValidatedMessage,
  customer: Customer
): Promise<TwilioResponse> {
  const subaccountSid = customer.twilio_subaccount_sid;
  const subaccountAuth = decrypt(customer.twilio_subaccount_auth);

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${subaccountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${subaccountSid}:${subaccountAuth}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: message.to,
        MessagingServiceSid: customer.twilio_messaging_service_sid,
        Body: message.body,
        StatusCallback: `${RELAYKIT_WEBHOOK_BASE}/api/webhooks/status/${customer.registration_id}`,
      }),
    }
  );

  return response.json();
}
```

### Messaging Service webhook configuration
During registration (PRD_04), configure the Messaging Service webhooks to point to RelayKit:
```
Inbound URL: https://api.relaykit.dev/webhooks/inbound/{registrationId}
Status Callback: https://api.relaykit.dev/webhooks/status/{registrationId}
```

---

## 7. INFRASTRUCTURE

### API layer
- **Next.js Edge Runtime** on Vercel for lowest latency and global distribution
- Edge functions handle auth, compliance checks, and Twilio forwarding
- Async operations (logging, webhooks, usage metering) via `waitUntil()`

### Data stores
- **Upstash Redis** (serverless): Opt-out caches, rate limit counters, API key lookup cache
- **Supabase PostgreSQL**: Messages, opt-outs (source of truth), customers, API keys, webhook configurations, usage records

### Webhook delivery
- Immediate delivery attempt on message receipt
- 3 retries with exponential backoff on failure
- Dead letter queue for permanently failed deliveries
- Dashboard shows failed webhook deliveries with retry button

### Environment variables (add to .env)
```
RELAYKIT_API_DOMAIN=api.relaykit.dev
UPSTASH_REDIS_URL=...
UPSTASH_REDIS_TOKEN=...
WEBHOOK_SIGNING_SECRET=...
SANDBOX_TWILIO_NUMBER=+1555...
SANDBOX_DAILY_LIMIT=100
```

---

## 8. DATABASE ADDITIONS

```sql
-- API keys
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  key_hash TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  environment TEXT NOT NULL,       -- 'sandbox' or 'live'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ
  -- Phase 2: will add nullable tenant_id FK
);

CREATE INDEX idx_api_keys_hash ON api_keys(key_hash) WHERE is_active = true;

-- Webhook configurations
CREATE TABLE webhook_endpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  url TEXT NOT NULL,
  events TEXT[] NOT NULL,
  secret TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Message log (proxy-managed)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  external_id TEXT NOT NULL,
  twilio_sid TEXT,
  direction TEXT NOT NULL,
  to_number TEXT NOT NULL,
  from_number TEXT NOT NULL,
  body_hash TEXT,
  status TEXT NOT NULL,
  compliance_result JSONB,
  environment TEXT NOT NULL,
  idempotency_key TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_customer ON messages(customer_id, created_at DESC);
CREATE INDEX idx_messages_idempotency ON messages(customer_id, idempotency_key)
  WHERE idempotency_key IS NOT NULL;

-- Sandbox verified numbers
CREATE TABLE sandbox_verified_numbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  phone_number TEXT NOT NULL,
  verified_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id)
);

-- Webhook delivery log
CREATE TABLE webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_endpoint_id UUID REFERENCES webhook_endpoints(id),
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  response_status INTEGER,
  attempts INTEGER DEFAULT 0,
  last_attempt_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add to customers table
-- NOTE: twilio_subaccount_sid and twilio_subaccount_auth are also specified in PRD_04 Section 5.
-- CC should deduplicate in migrations — define once, use IF NOT EXISTS.
ALTER TABLE customers ADD COLUMN twilio_subaccount_sid TEXT;
ALTER TABLE customers ADD COLUMN twilio_subaccount_auth TEXT;  -- encrypted via Supabase Vault
ALTER TABLE customers ADD COLUMN sandbox_active BOOLEAN DEFAULT false;
ALTER TABLE customers ADD COLUMN live_active BOOLEAN DEFAULT false;
```

---

## 9. PHASED IMPLEMENTATION

### Phase 1 — Ship with launch (Days 1–3 of proxy work)

**Sandbox:**
- Sandbox signup flow (email → magic link → API key)
- Sandbox phone verification
- Sandbox send endpoint (outbound to verified number only)
- Sandbox inbound webhook forwarding
- Sandbox opt-out handling (STOP/START)
- 100/day limit enforcement

**Proxy (thin pass-through):**
- API key authentication
- Opt-out checking (Redis lookup, inline block)
- SHAFT-C keyword scanning (inline block)
- Forward to Twilio subaccount
- Message logging
- Usage metering (increment counter per message)
- Basic webhook forwarding for inbound

**Dashboard additions:**

See PRD_06 v3 Sections 2 and 16 for dashboard component specs. The proxy adds these data points to the dashboard:
- Sandbox API key display
- Live API key display (post-registration)
- Verified phone number management
- Basic usage counter (messages sent today / this billing period)

### Phase 2 — Weeks 2–3 post-launch

- Rate limiting (full token bucket with trust-score-aware MPS)
- Quiet hours enforcement (inline block)
- Per-customer content allowlists based on vertical detection
- URL blocklist scanning
- Baseline drift detection (Claude-powered sampled message analysis against registration context — all customers)
- Message preview endpoint (`POST /v1/messages/preview` — validates templates with compliance check + rewrite suggestions)
- Webhook retry with exponential backoff + dead letter queue
- Message status tracking (delivery receipts from Twilio)
- Dashboard: message log viewer, webhook delivery status
- Registration nudge based on engagement signals

### Phase 3 — Month 2+

- Drift escalation automation (throttle → pause for persistent drift)
- Advanced rate limiting with queue mode (BullMQ — messages queued when limit exceeded, sent when capacity available)
- Real-time usage dashboard via Supabase Realtime
- Idempotency key support
- Webhook event filtering
- Test mode for live keys (send to verified number only, don't count toward billing)

---

## 10. PRD_05 DELIVERABLE CHANGES

The deliverable shifts from direct-to-Twilio credentials to RelayKit API access. **The canonical MESSAGING_SETUP.md template lives in PRD_05_DELIVERABLE.md Section 3.1 — that is the single authoritative source. Do not define or redefine the template here.**

Key changes:
- Environment variables: `RELAYKIT_API_KEY` replaces `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_MESSAGING_SERVICE_SID`
- Send function: `fetch('https://api.relaykit.dev/v1/messages')` replaces `fetch('https://api.twilio.com/...')`
- Inbound webhook: RelayKit JSON payload replaces Twilio form-data payload
- Error handling: RelayKit error codes (e.g., `recipient_opted_out`) replace Twilio error codes
- New section: "What RelayKit Handles Automatically" — explains that opt-out enforcement, quiet hours, content scanning, and rate limiting are infrastructure-level, not developer-level

The `SMS_GUIDELINES.md` compliance co-pilot is unchanged. It still guides the AI coding assistant on what to send and when — the proxy handles how it gets delivered safely.

---

## 11. BYO TWILIO (REGISTRATION-ONLY TIER) — Phase 2 (do not build)

> **Phase 2 — do not build.** This section describes BYO Twilio registration-only behavior for future reference. Do not implement BYO-specific proxy logic, deliverable templates, or conversion flows in v1.

For developers who already have a Twilio account, RelayKit offers registration as a standalone service. This tier uses the existing PRD_01–04 pipeline but delivers direct-to-Twilio credentials (see PRD_05 v3 Section 5 for BYO deliverable specs) instead of RelayKit API keys.

**What they get:** Registration, compliance site, all artifacts, Twilio submission, rejection handling, integration kit with their own Twilio credentials.

**What they don't get:** Proxy, compliance enforcement, opt-out management, rate limiting, usage metering.

**Conversion path:** Dashboard shows persistent upsell: "Want compliance protection? Switch to RelayKit's API — same code, one key swap." Migration involves creating a subaccount under RelayKit's ISV, porting the phone number, and swapping the API key.

**Implementation:** The deliverable generator (PRD_05) maintains both templates — RelayKit API (default) and direct-to-Twilio (BYO tier). The template selection is based on the customer's tier, set during checkout.

---

## 12. IMPLEMENTATION NOTES FOR CLAUDE CODE

### File structure
```
app/
  api/
    v1/
      messages/
        route.ts              # POST (send), GET (list)
        [messageId]/
          route.ts            # GET (status)
      opt-outs/
        route.ts              # GET (list), POST (register external opt-out — all channels)
        [phoneNumber]/
          route.ts            # GET (check status)
      consents/
        route.ts              # POST (register marketing consent), GET (check status)
        [phoneNumber]/
          route.ts            # DELETE (revoke consent)
      webhooks/
        route.ts              # POST (create), GET (list)
        [webhookId]/
          route.ts            # DELETE
      account/
        route.ts              # GET (account info)
      sandbox/
        verify/
          route.ts            # POST (send code)
          confirm/
            route.ts          # POST (confirm code)
    webhooks/
      inbound/
        [registrationId]/
          route.ts            # Twilio inbound webhook receiver
      status/
        [registrationId]/
          route.ts            # Twilio status callback receiver

lib/
  proxy/
    auth.ts                   # API key verification
    compliance-pipeline.ts    # Orchestrates all inline checks
    forward.ts                # Twilio API forwarding
    rate-limiter.ts           # Redis token bucket
    opt-out.ts                # Redis + Postgres opt-out management
    content-scanner.ts        # SHAFT-C + URL blocklist (reuses PRD_08 logic)
    quiet-hours.ts            # Timezone-aware quiet hours check
    webhook-forwarder.ts      # Customer webhook delivery + retry
    message-logger.ts         # Async message logging
    usage-meter.ts            # Usage counter increment
  sandbox/
    manager.ts                # Sandbox lifecycle (create, verify, send)
    limits.ts                 # Daily limit enforcement
  api-keys/
    generate.ts               # Key generation (rk_sandbox_ / rk_live_)
    verify.ts                 # Key hash lookup
```

### Key dependencies
- `@upstash/redis` — Serverless Redis for opt-out cache + rate limiting
- Existing Twilio infrastructure from PRD_04
- Existing compliance scanning from PRD_08 (reuse `scanForShaftC`, `checkUrlBlocklist`)
- Supabase client for database operations

### Testing
- Sandbox mode IS the test mode — developers use it during development
- For RelayKit's own testing: use Twilio's test credentials for the sandbox number
- Integration tests: send via sandbox, verify delivery, verify compliance rejections
- Load testing: verify <15ms compliance pipeline overhead at 100 concurrent requests
