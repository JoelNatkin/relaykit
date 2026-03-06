# PRD_08: COMPLIANCE MONITORING SERVICE
## RelayKit — Automated Message Compliance Enforcement & Drift Detection
### Version 2.0 — Mar 1, 2026

> **Dependencies:** Requires messaging proxy infrastructure from PRD_09. Consumes registration data from PRD_01/PRD_02. Surfaces alerts through dashboard (PRD_06) and email. Informed by SMS_GUIDELINES.md (PRD_05).
>
> **CHANGE LOG (v2.0):** Critical checks (BM-03, BM-04, BM-05, BM-07, BM-08) moved from async scanning to inline proxy enforcement — violations are now blocked before delivery, not detected after. Semantic drift detection included for all customers as baseline infrastructure protection. Compliance Shield paid tier removed. Message preview endpoint added for proactive template validation.

---

## 1. OVERVIEW

Every message sent through RelayKit's proxy is checked for compliance before reaching carriers. As the ISV, we are liable for all traffic on our platform — if one customer sends noncompliant content, our account gets flagged, our trust score drops, and all customers suffer. Compliance enforcement isn't a nice-to-have; it's infrastructure protection.

This PRD defines three layers:
1. **Inline enforcement (proxy, all customers):** Critical compliance checks that block violations before messages reach Twilio. Runs synchronously in the proxy pipeline (PRD_09 Section 4).
2. **Async monitoring (all customers):** Pattern-based warnings and semantic drift detection that run after message delivery. Generates alerts and recommendations.
3. **Message preview (all customers):** Proactive endpoint that lets developers validate message templates against their registration before deploying them.

There is no paid compliance tier. Every customer gets full protection. Compliance enforcement is a platform integrity requirement, not an upsell.

### Relationship to the messaging proxy (PRD_09)

PRD_08 was originally designed for async monitoring via Twilio status callbacks. With the messaging proxy, the highest-risk checks move to inline enforcement — violations are blocked before delivery in the proxy compliance pipeline.

The remaining checks continue to run asynchronously after message delivery, surfacing warnings and recommendations. Drift detection runs on sampled messages using Claude API analysis.

See PRD_09 Section 4 for the inline compliance pipeline architecture and latency targets.

### Why monitoring is non-optional
If we give customers the choice to opt out, we create more liability, not less. A customer who opts out and then sends noncompliant traffic puts our entire platform at risk, and we chose to be blind to it. Every messaging platform monitors outbound content as a condition of service. We are no different.

### Consent framework
Monitoring consent is collected at three touchpoints:
1. **Terms of Service** — Legal foundation. All customers agree that RelayKit processes outbound message content for compliance enforcement and platform integrity.
2. **Onboarding acknowledgment** — Active consent during checkout. Clear, non-buried language with a required checkbox.
3. **Dashboard visibility** — Customers can see their compliance status and any alerts at any time. Transparency, not secrecy.

---

## 2. INLINE ENFORCEMENT (PROXY PIPELINE)

These checks run synchronously in the proxy before every message is forwarded to Twilio. Violations are blocked and the developer receives an error response with an actionable error code. The message never reaches the carrier.

Implementation is in the proxy compliance pipeline (PRD_09). This section defines the rules; PRD_09 defines the execution architecture.

| Rule ID | Check | Action on Failure |
|---------|-------|-------------------|
| `BM-03` | Recipient has previously opted out | Block — return `recipient_opted_out` (422) |
| `BM-04` | SHAFT-C content keywords detected | Block — return `content_prohibited` (422) |
| `BM-05` | Message sent outside quiet hours (9 PM – 9 AM recipient local time) | Block — return `quiet_hours_violation` (422) |
| `BM-07` | Message is empty or whitespace only | Block — return `content_prohibited` (422) |
| `BM-08` | Message contains URL on known blocklist | Block — return `content_prohibited` (422) |
| `BM-10` | Marketing message sent to recipient without explicit marketing consent (MIXED tier only) | Block — return `marketing_consent_required` (422) |

### BM-10: Marketing consent enforcement (MIXED tier)

For customers registered under MIXED campaign type (`registration_tier = 'mixed'`), the proxy must check recipient-level marketing consent before delivering any message classified as marketing content.

**Marketing message classification:** A message is classified as marketing if it contains promotional indicators (discount codes, percentage-off language, sale/offer/deal language, seasonal promotion language). The proxy applies a lightweight regex classification before the consent lookup — if unclassifiable, it defaults to allowing the message and flagging for async review.

**Consent lookup:** At send time, query `recipient_consents` table:
```typescript
// BM-10: Marketing consent check (MIXED tier only)
if (registration.registration_tier === 'mixed' && classifyAsMarketing(messageBody)) {
  const consent = await getMarketingConsent(registration.customer_id, to);
  if (!consent || !consent.consented_at) {
    return block('marketing_consent_required', 
      'Recipient has not given explicit marketing consent. ' +
      'Collect marketing opt-in before sending promotional messages. ' +
      'See POST /v1/consents to register consent.');
  }
}
```

**`recipient_consents` table** (add to schema Section 8):
```sql
CREATE TABLE recipient_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  phone_number TEXT NOT NULL,
  consent_type TEXT NOT NULL CHECK (consent_type IN ('transactional', 'marketing')),
  consented_at TIMESTAMPTZ NOT NULL,
  source TEXT NOT NULL, -- 'web_form', 'api', 'keyword', 'import'
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, phone_number, consent_type)
);

CREATE INDEX idx_recipient_consents_lookup 
  ON recipient_consents(customer_id, phone_number, consent_type)
  WHERE revoked_at IS NULL;
```

**`POST /v1/consents` endpoint** (add to PRD_09 API spec):
Developers call this when a recipient checks the marketing opt-in box on their form. The compliance site's opt-in form should call this endpoint on submission.
```json
POST /v1/consents
{
  "phone_number": "+15551234567",
  "consent_type": "marketing",
  "source": "web_form"
}
```

**Dashboard alert copy for BM-10 violations:**
Consent violations are distinct from content drift — they are not drift events. Dashboard alert type: `consent_violation` (not `drift`). Alert copy:
> *"A marketing message was blocked — {phone_number} hasn't given marketing consent. Collect explicit marketing opt-in before sending promotions to this recipient."*

This is urgent, not informational. Use red/destructive styling, not amber.

### Why these are inline
- **BM-03 (opt-out):** $500–$1,500 TCPA fine per message. Zero tolerance.
- **BM-04 (SHAFT-C):** Carrier campaign suspension. Immediate ISV account risk.
- **BM-05 (quiet hours):** State-level legal violations (Florida, Oklahoma, Washington, etc.).
- **BM-07 (empty):** Carrier rejection and wasted throughput.
- **BM-08 (URL blocklist):** Carrier filtering and trust score degradation.

### SHAFT-C keyword detection

```typescript
const SHAFTC_PATTERNS: Record<string, RegExp[]> = {
  sex: [/\bsex\b/i, /\bxxx\b/i, /\badult\b/i, /\bnude/i, /\berotic/i, /\bescort/i],
  hate: [/\bhate\b/i, /\bracis[tm]/i, /\bsupremac/i, /\bnazi/i],
  alcohol: [/\balcohol\b/i, /\bbeer\b/i, /\bwine\b/i, /\bliquor\b/i, /\bspirits\b/i, /\bcocktail/i],
  firearms: [/\bgun[s]?\b/i, /\bfirearm/i, /\bammunition\b/i, /\bammo\b/i, /\brifle/i, /\bpistol/i],
  tobacco: [/\btobacco\b/i, /\bcigar/i, /\bvape/i, /\bnicotine/i, /\be.?cig/i],
  cannabis: [/\bcannabis\b/i, /\bmarijuana\b/i, /\bweed\b/i, /\bthc\b/i, /\bcbd\b/i, /\bdispensary/i, /\bedible/i],
};

function scanForShaftC(body: string): { detected: boolean; category?: string } {
  for (const [category, patterns] of Object.entries(SHAFTC_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(body)) {
        return { detected: true, category };
      }
    }
  }
  return { detected: false };
}
```

> **False positives:** A wine bar sending "wine tasting tonight" triggers the alcohol pattern. The proxy handles this with per-customer content allowlists generated during registration based on business type and vertical detection (PRD_05_ADDENDUM). Healthcare businesses get medical terms allowlisted. Restaurants get food/beverage terms allowlisted.

---

## 3. ASYNC MONITORING (ALL CUSTOMERS, POST-DELIVERY)

These checks run after message delivery via the proxy's async pipeline (`waitUntil()` in Edge Runtime). They generate warnings and recommendations but do not block messages.

| Rule ID | Check | Severity | Action |
|---------|-------|----------|--------|
| `BM-01` | Message contains business name | Warning | Alert customer |
| `BM-02` | First message to new recipient includes opt-out language | Warning | Alert customer |
| `BM-06` | Message frequency exceeds declared rate for this recipient | Warning | Alert customer |
| `BM-09` | Semantic drift from registered use case (sampled, Claude-powered) | Warning/Critical | Alert customer with rewrite suggestions |

### BM-01 through BM-06 implementation

```typescript
async function runAsyncChecks(
  messageBody: string,
  to: string,
  registration: Registration
): Promise<ComplianceCheck[]> {
  // Registration object must include these fields (denormalized on registrations table):
  //   .business_name, .use_case_label, .effective_campaign_type,
  //   .approved_message_types, .not_approved_content, .message_frequency,
  //   .canon_messages (CanonMessage[] — see PROJECT_OVERVIEW canon messages schema)
  // These are snapshotted onto registrations at registration time.
  const checks: ComplianceCheck[] = [];
  
  // BM-01: Business name present
  checks.push({
    rule_id: 'BM-01',
    passed: messageBody.toLowerCase().includes(registration.business_name.toLowerCase()),
    severity: 'warning',
    details: 'Message should include business name for sender identification.',
  });
  
  // BM-02: Opt-out language in first message to recipient
  const isFirstMessage = await isFirstMessageToRecipient(registration.id, to);
  if (isFirstMessage) {
    const hasOptOut = /stop|opt.?out|unsubscribe|cancel/i.test(messageBody);
    checks.push({
      rule_id: 'BM-02',
      passed: hasOptOut,
      severity: 'warning',
      details: 'First message to a new recipient should include opt-out instructions.',
    });
  }
  
  // BM-06: Frequency check
  const messageCount = await getRecentMessageCount(registration.id, to, '7d');
  const frequencyLimit = getWeeklyLimit(registration.effective_campaign_type);
  checks.push({
    rule_id: 'BM-06',
    passed: messageCount < frequencyLimit,
    severity: 'warning',
    details: `${messageCount + 1} messages to this recipient in 7 days (declared: ${registration.message_frequency}).`,
  });
  
  return checks;
}
```

### BM-09: Semantic drift detection (baseline, all customers)

Drift detection uses Claude to compare message content against the customer's registered use case and detect when they're drifting outside their approval. This is included for all paying customers — it protects RelayKit's ISV account.

**Campaign-aware drift routing (critical for MIXED tier customers):**

Before running drift analysis, the proxy must classify the message and route it to the correct canon set. A customer with both a transactional and a marketing campaign has two separate registered contexts.

```typescript
async function routeDriftAnalysis(
  messageBody: string,
  to: string,
  registration: Registration
): Promise<DriftAnalysis> {
  // For MIXED tier: classify message first, then compare against correct canon
  if (registration.registration_tier === 'mixed') {
    const isMarketing = classifyAsMarketing(messageBody);
    
    if (isMarketing) {
      // Compare against marketing canon messages
      return analyzeMessageCompliance(messageBody, registration, 'marketing');
    } else {
      // Compare against transactional canon messages
      return analyzeMessageCompliance(messageBody, registration, 'transactional');
    }
  }
  
  // Transactional-only: single canon set
  return analyzeMessageCompliance(messageBody, registration, 'transactional');
}
```

**Consent violation vs. drift — different handling paths:**
- A marketing message to a recipient without marketing consent → `BM-10` consent violation (blocked inline, not a drift event)
- A marketing message to a consented recipient that doesn't match the marketing canon → `BM-09` drift (async warning)
- A transactional message with promotional content → `BM-09` drift (customer is sending content outside their transactional registration)

Never classify a consent violation as drift — they are distinct failure modes with different customer actions required.

```typescript
async function analyzeMessageCompliance(
  messageBody: string,
  registration: Registration,
  campaignContext: 'transactional' | 'marketing'
): Promise<DriftAnalysis> {
  // Select the correct canon messages for this campaign context
  const canonMessages = registration.canon_messages.filter(
    m => m.campaign_context === campaignContext
  );
  
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    system: `You are a US A2P 10DLC compliance analyst. Your job is to determine 
if a text message is consistent with a registered campaign use case.

The business "${registration.business_name}" is registered for: 
${registration.use_case_label}

Campaign context being evaluated: ${campaignContext}
Approved message types: ${registration.approved_message_types}
Not approved: ${registration.not_approved_content}
Canon messages (registered examples):
${canonMessages.map(m => `- "${m.text}"`).join('\n')}

Analyze the message and respond with JSON only:
{
  "consistent": true/false,
  "confidence": 0.0-1.0,
  "reason": "brief explanation",
  "risk_level": "none" | "low" | "medium" | "high",
  "suggested_rewrite": "a compliant alternative if inconsistent, null if consistent"
}`,
    messages: [{
      role: 'user',
      content: `Analyze this message for use case compliance:\n\n"${messageBody}"`,
    }],
  });
  
  return JSON.parse(response.content[0].text);
}
```

**Sampling strategy:**
- First 7 days of a new customer: analyze every message (learning period)
- After 7 days: sample 1 in 10 messages
- If a sampled message flags as drift: increase to 1 in 3 for 48 hours
- If drift is confirmed: analyze every message until resolved

**Drift alert with rewrite suggestions:**
When drift is detected, the alert includes a Claude-generated compliant alternative:

```
Subject: ⚠ Your messages drifted from your registration — {business_name}

We detected content outside your registered use case:

Your message: "Don't forget your appointment! And we're running a 20% off 
whitening special this month!"

Issue: This message contains promotional content ("20% off") but your campaign 
is registered for Customer Care (appointment reminders). Promotional offers 
require a Marketing campaign registration.

Suggested compliant version: "{business_name}: Reminder — your appointment 
is tomorrow at 2:00 PM. Reply C to confirm or R to reschedule. Reply STOP 
to opt out."

Why this matters: Sending content outside your registered use case can trigger 
carrier campaign suspension, which would prevent all your messages from 
being delivered.
```

**Escalation path:**
1. First drift detection → alert customer with rewrite suggestion
2. 3+ drift detections in 7 days → prominent dashboard warning + email to customer
3. 10+ drift detections in 30 days → throttle sending (reduced rate limit) + admin alert
4. Continued drift after throttle → pause sending + require customer acknowledgment to resume

**Cost estimate:** Claude Sonnet at ~$3/million input tokens. Average message ~50 tokens + system prompt ~200 tokens = ~250 tokens per analysis. At 1-in-10 sampling for a customer sending 100 messages/day = 10 analyses/day = ~$0.0075/day per customer (~$0.23/month). Well within $19/month margin.

### When to escalate to admin (Joel)
- Any inline-blocked violation (BM-03 through BM-08) that repeats 5+ times in 24 hours from the same customer
- Confirmed semantic drift (BM-09) after customer has been alerted
- Same customer triggers 3+ warnings in 24 hours
- SHAFT-C detection on more than 2 messages from the same customer

---

## 4. MESSAGE PREVIEW ENDPOINT

A proactive compliance check that lets developers validate message templates before deploying them. See PRD_09 Section 3 for the API specification.

```
POST /v1/messages/preview
```

### How it works
1. Runs the same inline compliance checks as the send endpoint (BM-03 through BM-08)
2. Additionally runs a Claude API call comparing the message body against the customer's registered use case, campaign description, and approved message types
3. Returns detailed verdict with per-check results, warnings, and actionable suggestions including compliant rewrite alternatives
4. Does NOT send the message — preview only
5. Works in both sandbox and live environments
6. Rate limited: 60 previews/minute per API key

### Response format

```json
{
  "verdict": "pass" | "warning" | "fail",
  "checks": {
    "opt_out_language": true,
    "business_name": true,
    "shaft_c": true,
    "quiet_hours": true,
    "use_case_alignment": true
  },
  "warnings": [
    {
      "code": "content_drift_detected",
      "message": "This message contains promotional content but your campaign is registered for Customer Care.",
      "severity": "high"
    }
  ],
  "suggestions": [
    "Remove the promotional offer to stay within your approved use case.",
    "Compliant alternative: '{business_name}: Reminder — your appointment is tomorrow at 2:00 PM. Reply C to confirm. Reply STOP to opt out.'"
  ]
}
```

### Integration with deliverable
The `previewSMS()` function is defined in MESSAGING_SETUP.md (canonical template: PRD_05_DELIVERABLE.md Section 3.1). SMS_GUIDELINES.md instructs the AI coding assistant to validate new message templates via the preview endpoint before deploying them.

### Cost
~$0.005-0.01 per preview (Claude API call). Developers use this for template validation, not per-message. A developer with 5 message templates previews them once each — $0.05 total.

---

## 5. SENSITIVE INDUSTRY HANDLING

### Detection

During intake (PRD_01 Screen 2), scan `business_description` and `service_type` for sensitive industry keywords:

```typescript
const SENSITIVE_INDUSTRIES: Record<string, {
  keywords: RegExp[];
  label: string;
  guidance: string;
  template_adjustments: string[];
}> = {
  healthcare: {
    keywords: [
      /\b(medical|health|doctor|physician|dentist|dental|clinic|therapy|therapist|counselor|psychiatr|psycholog|hospital|urgent care|pharmacy|chiropractic|optometr|pediatric|dermatolog|orthoped|physical therapy|mental health|wellness center|nursing|midwife|obgyn|ob.?gyn|veterinar)\b/i
    ],
    label: 'Healthcare',
    guidance: `**Important: SMS and Patient Privacy**
    
Standard SMS is not HIPAA-compliant. Text messages travel through carrier networks in plaintext and cannot be encrypted end-to-end. As a healthcare provider, you must never include protected health information (PHI) in text messages sent through this service.

**What counts as PHI in a text message:**
- Specific treatments, procedures, or diagnoses
- Test results or lab work references
- Provider names combined with treatment context
- Insurance or billing details tied to health services
- Any information that connects a specific person to a health condition or treatment

**Safe message examples:**
✓ "{business_name}: You have an appointment tomorrow at 2:00 PM. Reply C to confirm."
✓ "{business_name}: Reminder — please arrive 15 minutes early for your visit."

**Unsafe message examples:**
✗ "{business_name}: Reminder about your periodontal cleaning tomorrow."
✗ "{business_name}: Your lab results are ready. Please call to discuss."`,
    template_adjustments: [
      'Sample messages use generic appointment language only — no treatment references',
      'Opt-in form includes healthcare-specific disclaimer',
      'SMS_GUIDELINES.md includes PHI-specific hard rules',
    ],
  },
  
  legal: {
    keywords: [
      /\b(law firm|attorney|lawyer|legal|paralegal|law office|counsel|litigation|family law|criminal defense|immigration law|estate planning|bankruptcy)\b/i
    ],
    label: 'Legal Services',
    guidance: `**Important: SMS and Attorney-Client Privilege**
    
Text messages sent through this service are not protected by attorney-client privilege in the same way as secure communications. Never include case-specific details, legal strategy, or confidential client information in SMS messages.

**Safe message examples:**
✓ "{business_name}: Reminder — your consultation is tomorrow at 3:00 PM."
✓ "{business_name}: We have an update on your matter. Please call our office."

**Unsafe message examples:**
✗ "{business_name}: Update on your custody case — the judge has ruled..."
✗ Any message that references specific legal matters, charges, or case details`,
    template_adjustments: [
      'Sample messages use generic appointment/notification language',
      'SMS_GUIDELINES.md includes privilege-specific guidance',
    ],
  },
  
  financial: {
    keywords: [
      /\b(financial advis|investment|wealth management|accounting|tax prep|mortgage|lending|loan|credit union|banking|insurance agent|broker|fiduciary|cpa |certified public accountant)\b/i
    ],
    label: 'Financial Services',
    guidance: `**Important: SMS and Financial Data**
    
Never include specific financial information in text messages — account numbers, balances, transaction amounts, SSNs, or investment performance figures.

**Safe message examples:**
✓ "{business_name}: Reminder — your appointment is tomorrow at 10:00 AM."
✓ "{business_name}: We have an update for you. Please log in to your portal or call our office."

**Unsafe message examples:**
✗ "{business_name}: Your account balance is $12,450.23."
✗ Any message containing account numbers, SSNs, or specific financial figures`,
    template_adjustments: [
      'Sample messages never reference specific financial data',
      'SMS_GUIDELINES.md includes financial data handling rules',
    ],
  },
};
```

### Where guidance appears

1. **Intake Screen 2 (PRD_01):** Expandable callout card with amber border when sensitive industry detected. Not blocking.
2. **Review Screen (PRD_01 Screen 3):** Generated sample messages already adjusted to use safe language.
3. **SMS_GUIDELINES.md (PRD_05):** Industry-specific hard rules appended.
4. **Inline proxy scanning:** For healthcare customers, add PHI pattern detection:

```typescript
// PHI detection (healthcare customers only) — inline block
const PHI_PATTERNS: RegExp[] = [
  /\b(diagnosis|diagnosed|prescription|medication|treatment|procedure|surgery|therapy session|lab results|test results|blood work|x.?ray|mri|scan results|insurance claim|copay|deductible)\b/i,
  /\b(refill|dosage|symptom|condition|disorder|disease|infection|injury|recovery|prognosis)\b/i,
];
```

### Template adjustments for sensitive industries

When a sensitive industry is detected, the template engine (PRD_02) adjusts:
- **Sample messages:** Replace industry-specific details with generic language
- **Campaign description:** Adds language noting messages will not contain sensitive personal information
- **Opt-in form:** For healthcare, adds disclaimer about message content limitations

---

## 6. ONBOARDING CONSENT FLOW

### Terms of Service addition (PRD_02 — Terms template)

```markdown
## Message Monitoring

{business_name} uses RelayKit as its SMS messaging platform. As part of providing 
this service, RelayKit enforces compliance on outbound messages before delivery and 
monitors messaging patterns for carrier compliance requirements. This includes 
automated scanning for prohibited content, opt-out enforcement, quiet hours 
compliance, and messaging pattern analysis. RelayKit does not sell or share message 
content with third parties. For more information, see RelayKit's privacy policy at 
https://relaykit.com/privacy.
```

### Checkout acknowledgment (PRD_01 — Screen 4 (Checkout))

```
☐ I understand that RelayKit enforces compliance on outbound messages to protect 
  my phone number from carrier suspension and maintain platform integrity for 
  all users.
```

---

## 7. ALERT SYSTEM

### Alert channels
- **Dashboard (PRD_06):** Compliance alerts appear as cards in the compliance section
- **Email:** Immediate email for critical violations and drift detection, daily digest for warnings
- **Admin (Joel):** Slack/email notification for critical patterns across any customer

### Alert templates

**Drift detection alert — immediate email:**
```
Subject: ⚠ Your messages drifted from your registration — {business_name}

We detected content outside your registered use case:

Your message: "{truncated_message_preview}..."

Issue: {drift_explanation}

Suggested compliant version: "{suggested_rewrite}"

Why this matters: Sending content outside your registered use case can trigger 
carrier campaign suspension, which would prevent all your messages from 
being delivered.

What to do: Update your message templates to stay within your registered use 
case ({use_case_label}). Use the message preview endpoint to validate 
templates before deploying them.

View details: https://relaykit.com/dashboard

— RelayKit
```

**Inline block notification — immediate email (for repeated blocks):**
```
Subject: ⚠ Messages blocked — {business_name}

{count} messages were blocked by compliance enforcement today:

{violation_summary}

These messages were prevented from reaching carriers, so no fines or 
penalties apply. But repeated blocks may indicate a code issue that 
needs attention.

View details: https://relaykit.com/dashboard

— RelayKit
```

**Warning — daily digest:**
```
Subject: SMS compliance summary — {business_name} — {date}

{count} compliance suggestions for your messages today:

{warning_list}

These are recommendations, not violations. Following them improves your 
deliverability and reduces the risk of carrier filtering.

View details: https://relaykit.com/dashboard

— RelayKit
```

---

## 8. DATABASE

```sql
-- Message compliance scan results (async checks)
CREATE TABLE message_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID REFERENCES registrations(id),
  message_sid TEXT NOT NULL,
  recipient_phone TEXT NOT NULL, -- stored hashed or last-4 only
  overall_status TEXT NOT NULL, -- 'clean', 'warning', 'violation'
  checks JSONB NOT NULL,
  drift_analysis JSONB, -- Claude drift analysis result (null if not sampled)
  scanned_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_message_scans_reg_status 
  ON message_scans(registration_id, overall_status, scanned_at DESC);

-- Compliance alerts sent to customers
CREATE TABLE compliance_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID REFERENCES registrations(id),
  alert_type TEXT NOT NULL, -- 'critical', 'warning', 'info', 'drift'
  channel TEXT NOT NULL, -- 'email', 'dashboard', 'admin'
  subject TEXT,
  body TEXT,
  suggested_rewrite TEXT, -- Claude-generated compliant alternative
  acknowledged BOOLEAN DEFAULT false,
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Opt-out tracking
-- TCPA Amendment (effective April 2025): Any reasonable means of opt-out must be honored,
-- not just STOP keyword. "Leave me alone," "Don't text me," "Stop messaging me" all qualify.
-- Cross-channel revocation: opt-outs via email or web form also apply to SMS.
-- Businesses have 10 business days to process revocations. A single clarification text
-- is permitted within 5 minutes of receiving a revocation request.
-- The POST /v1/opt-outs endpoint (PRD_09) is the mechanism for developers to register
-- opt-outs from non-SMS channels. Developers MUST be instructed to call it when any
-- channel receives an opt-out request — see SMS_GUIDELINES_TEMPLATE.md for the AI
-- coding assistant instruction language.
CREATE TABLE sms_opt_outs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  registration_id UUID REFERENCES registrations(id),  -- nullable, populated for production opt-outs
  phone_number TEXT NOT NULL,
  opted_out_at TIMESTAMPTZ DEFAULT NOW(),
  opted_back_in_at TIMESTAMPTZ,
  source TEXT NOT NULL, -- 'STOP_keyword', 'START_keyword', 'api', 'web_form', 'email', 'phone_call', 'natural_language'
  raw_opt_out_text TEXT, -- preserve original opt-out message if natural language (e.g., "leave me alone")
  UNIQUE(customer_id, phone_number)
);

-- Message frequency tracking
CREATE TABLE message_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID REFERENCES registrations(id),
  recipient_phone TEXT NOT NULL,
  message_sid TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_message_log_freq 
  ON message_log(registration_id, recipient_phone, sent_at DESC);

-- Sensitive industry flag on customer record
ALTER TABLE customers ADD COLUMN sensitive_industry TEXT;
ALTER TABLE customers ADD COLUMN sensitive_industry_acknowledged BOOLEAN DEFAULT false;

-- Marketing consent tracking (MIXED tier)
-- See Section 2 BM-10 for full spec and API endpoint definition.
-- Populated via POST /v1/consents (PRD_09) when developers call it on marketing opt-in.
CREATE TABLE recipient_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  phone_number TEXT NOT NULL,
  consent_type TEXT NOT NULL CHECK (consent_type IN ('transactional', 'marketing')),
  consented_at TIMESTAMPTZ NOT NULL,
  source TEXT NOT NULL, -- 'web_form', 'api', 'keyword', 'import'
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, phone_number, consent_type)
);

CREATE INDEX idx_recipient_consents_lookup
  ON recipient_consents(customer_id, phone_number, consent_type)
  WHERE revoked_at IS NULL;
```

---

## 9. PRIVACY CONSIDERATIONS

### What we store
- **Message metadata:** SID, recipient (hashed or last-4), timestamp, scan result
- **Message content:** NOT stored long-term. Scanned in the proxy pipeline, results stored, content discarded.
- **For drift analysis:** Message content is sent to Claude API for analysis but not stored by us. Claude API does not retain inputs per Anthropic's data policy.

### What we never do
- Sell or share message content with third parties
- Use message content for marketing or advertising purposes
- Store full message bodies beyond the scanning window
- Share compliance data with anyone other than the customer and RelayKit admin

### RelayKit privacy policy must include
- Clear description of inline compliance enforcement and async monitoring
- What data is collected and retained
- How message content is processed (inline scanning, AI drift analysis)
- Data retention periods (90 days for message log, 1 year for scan results)
- Customer's right to access their compliance data

---

## 10. DASHBOARD ADDITIONS (PRD_06)

> **Note:** The compliance UI lives inside the Compliance tab (`/dashboard/compliance`) defined in PRD_06 v3. Compliance content only appears at Stage 6 (Live). The components are: `ComplianceStatus.tsx`, `CanonMessagesRef.tsx`, and `DriftAlertCard.tsx` — see PRD_06 v3 Section 16 for the definitive component list.

### Compliance status card (ComplianceStatus component, Compliance tab)
```
┌──────────────────────────────────────────────┐
│  Compliance Status                    [Good ✓]│
│                                               │
│  Messages this period: {total_count}          │
│  Clean: {clean_count} · Blocked: {blocked}    │
│  Warnings: {warning_count}                    │
│                                               │
│  {if drift_detected:}                         │
│  ⚠ Some messages are drifting outside your    │
│  registered use case. See suggestions below.  │
│  [View details]                               │
│                                               │
│  {if blocks > 0:}                             │
│  {blocked} messages were blocked by           │
│  compliance enforcement. [View details]       │
└──────────────────────────────────────────────┘
```

---

## 11. IMPLEMENTATION TIMELINE

**Ship with v1 (Phase 1):**
- Sensitive industry detection during intake
- Industry-specific guidance on advisory screen
- Adjusted templates for sensitive industries
- Terms of Service monitoring consent language
- Checkout monitoring acknowledgment checkbox
- SMS_GUIDELINES.md industry-specific sections
- Inline enforcement in proxy (BM-03, BM-04, BM-05, BM-07, BM-08)

**Phase 2 (Weeks 2-3 post-launch):**
- Async monitoring (BM-01, BM-02, BM-06)
- Semantic drift detection with Claude (BM-09) — baseline for all customers
- Message preview endpoint with Claude-powered use case analysis
- Compliance alerts (email + dashboard)
- Per-customer SHAFT-C allowlists based on vertical detection
- Admin alert system

**Phase 3 (Month 2+):**
- PHI detection for healthcare customers (inline)
- Drift escalation automation (throttle → pause)
- Compliance site monitoring (all customers)
- Historical compliance trend data

---

## 12. IMPLEMENTATION NOTES FOR CLAUDE CODE

### File structure
```
lib/
  compliance/
    scanner.ts              # Async check orchestrator (BM-01, BM-02, BM-06)
    shaft-c.ts              # SHAFT-C keyword detection (shared by proxy + async)
    industry-detector.ts    # Sensitive industry keyword matching
    industry-guidance.ts    # Guidance text per industry
    opt-out-tracker.ts      # Track STOP/START keywords
    frequency-tracker.ts    # Message frequency monitoring
    drift-analyzer.ts       # Claude API integration for drift detection
    preview.ts              # Message preview endpoint logic
    allowlists.ts           # Per-customer SHAFT-C content allowlists

app/
  api/
    v1/
      messages/
        preview/
          route.ts          # POST — message preview with compliance check
    compliance/
      alerts/
        route.ts            # GET — customer's compliance alerts

components/
  dashboard/
    ComplianceStatus.tsx     # Compliance status on dashboard (Compliance tab)
    CanonMessagesRef.tsx     # Canon messages read-only reference
    DriftAlertCard.tsx       # Drift detection warning with rewrite suggestion
```

### Key dependencies
- Anthropic SDK (`@anthropic-ai/sdk`) — for drift analysis and message preview
- Existing proxy compliance pipeline (PRD_09) — shares SHAFT-C scanner, opt-out checker
- Supabase client for database operations
