# PRD_05: DELIVERABLE GENERATOR
## RelayKit — LLM-Consumable SMS Integration Package
### Version 3.0 — Mar 3, 2026

> **Dependencies:** Build spec generation requires message plan from dashboard (PRD_06). Post-registration deliverable triggered when registration reaches `complete` status (PRD_04). Requires API key from proxy system (PRD_09) and artifacts from PRD_02. Guidelines generator requires use case selection (minimum) or full registration data (maximum).
>
> **CHANGE LOG (v3.0):** Complete rewrite. Deliverable is no longer a single post-registration moment — it's a lifecycle with three documents that evolve across the developer's journey. Added: SMS_BUILD_SPEC.md (sandbox, pre-payment), sandbox edition of SMS_GUIDELINES.md, document relationship model. MESSAGING_SETUP.md and production SMS_GUIDELINES.md remain post-registration. BYO Twilio tier updated to reflect Model 2 (registration submitted to customer's own Twilio account).
>
> **What v2.0 described:** One deliverable moment — registration completes, developer gets MESSAGING_SETUP.md + SMS_GUIDELINES.md.
>
> **What v3.0 describes:** Three documents across two lifecycle stages: sandbox (build spec + sandbox guidelines) and production (MESSAGING_SETUP.md + production guidelines). The build spec is the primary conversion mechanism — developers invest real time building from it before paying anything.

---

## 1. OVERVIEW

RelayKit generates three markdown documents designed for AI coding assistants. Each document serves a specific moment in the developer's journey, and together they form a progression from "exploring" to "production-ready."

### The three documents

| Document | When generated | Purpose |
|----------|---------------|---------|
| **SMS_BUILD_SPEC.md** | Developer clicks "Generate build spec" on dashboard | AI coding tool reads this to build the entire SMS integration in sandbox |
| **MESSAGING_SETUP.md** | Registration reaches `complete` status | The build spec upgraded with production credentials, canon messages, and enforcement details |
| **SMS_GUIDELINES.md** | Two editions: sandbox (with build spec) and production (post-registration) | Compliance co-pilot — rules and boundaries the AI coding tool follows when writing or modifying SMS code |

### The developer's workflow

**Sandbox (before payment):**
1. Curate messages in the plan builder on the dashboard
2. Click "Generate build spec" → download SMS_BUILD_SPEC.md + SMS_GUIDELINES.md (sandbox edition)
3. Drop both files in project root
4. Tell AI coding tool: "Read SMS_BUILD_SPEC.md and build my SMS feature"
5. AI tool reads both files, builds the integration, developer tests in sandbox

**Production (after registration):**
1. Registration completes → dashboard shows MESSAGING_SETUP.md + SMS_GUIDELINES.md (production edition)
2. Developer downloads both files, replaces the sandbox versions in project root
3. Updates one environment variable: `RELAYKIT_API_KEY` from sandbox to live key
4. App works in production — code structure is identical

### Why the build spec matters strategically

The build spec is RelayKit's conversion mechanism. Before the developer pays anything, they have a document that:
- Captures SMS compliance domain knowledge they'd spend hours researching
- Contains their specific message templates (selected and edited in the plan builder)
- Is formatted for their AI coding tool to consume directly
- Teaches compliance patterns through the structure itself (opt-out language, quiet hours, error handling)

By the time they've built from the build spec and tested in sandbox, they've invested real time in the RelayKit integration. The $199 + $19/mo payment isn't "trust us and pay" — it's "your app is ready, pay to go live."

---

## 2. SMS_BUILD_SPEC.md (SANDBOX)

### When generated

Developer clicks "Generate build spec" on the dashboard after curating their message plan (PRD_06 Section 5). Both SMS_BUILD_SPEC.md and SMS_GUIDELINES.md (sandbox edition) are generated together and presented in a preview modal with download and copy-to-clipboard.

### What it contains

The build spec has five sections, each designed so an AI coding tool can parse it and produce working code:

**Section 1 — About this file.** Instructions for the developer: "Drop this and SMS_GUIDELINES.md in your project root, tell your AI coding tool to read it."

**Section 2 — Environment setup.** Sandbox API key and base URL as environment variables. No live credentials.

**Section 3 — What your app sends.** Each enabled message from the plan builder, with: category label, full template text, variable list, and trigger description ("When client books an appointment"). These are the developer's selected/edited templates — NOT canon messages (those don't exist until registration).

**Section 4 — What to build.** Five subsections:
1. `sendSMS()` utility function — POST to RelayKit API, auth header, JSON body, error handling
2. Message triggers — for each message: when to call sendSMS with which template
3. Inbound webhook handler — POST endpoint, JSON payload, keyword handling, reply routing
4. Opt-in form — consent requirements, required disclosures, privacy/terms links (generic template, not compliance site URL)
5. Error handling — specific error codes: `recipient_opted_out`, `content_prohibited`, `quiet_hours_violation`, `rate_limited`

**Section 5 — Compliance rules summary.** Condensed rules referencing SMS_GUIDELINES.md for full details.

### What it does NOT contain

- Live credentials or webhook secret
- Canon messages (those are finalized at registration, not during sandbox)
- Production-specific enforcement details
- Compliance site URL (doesn't exist yet)
- Message preview/validation endpoint (production feature)

### 2.1 Build spec template

```markdown
# SMS Build Spec for {app_name_or_use_case}
## Generated by RelayKit — {date}

## About this file
Drop this file and SMS_GUIDELINES.md in your project root. Tell your AI
coding tool: "Read SMS_BUILD_SPEC.md and build my SMS feature."

## Environment setup
Add to your .env file:

RELAYKIT_API_KEY={rk_sandbox_key}
RELAYKIT_API_URL=https://api.relaykit.dev/v1

Also add SMS_GUIDELINES.md to your project root. Your AI coding tool should
read it for compliance rules and boundaries.

## What your app sends

### {category_1}: {trigger_1}

{message_text_1}

Variables: {variable_list}
When to send: {trigger_description}

### {category_2}: {trigger_2}

{message_text_2}

Variables: {variable_list}
When to send: {trigger_description}

{repeat for all enabled messages}

## What to build

### 1. Utility function: sendSMS()
Create a reusable function that sends messages through the RelayKit API:
- POST to {RELAYKIT_API_URL}/messages
- Headers: Authorization: Bearer {RELAYKIT_API_KEY}, Content-Type: application/json
- Body: { "to": recipientPhone, "body": messageText }
- Handle errors: check response status, parse error codes (see SMS_GUIDELINES.md)

### 2. Message triggers
For each message above, create the trigger in your app:
{for each enabled message:}
- {trigger}: Call sendSMS() with the {category} template, replacing {variables} with actual values

### 3. Inbound webhook handler
Set up a POST endpoint to receive replies from your users:
- RelayKit sends JSON: { "type": "message.received", "data": { "from", "to", "body" } }
- Handle STOP/START keywords (RelayKit manages opt-outs automatically, but you receive the event)
- Process other replies based on your app logic
- Configure your webhook URL in your RelayKit dashboard

### 4. Opt-in form
Add an SMS consent form where users provide their phone number:
- Must include: program description, message frequency, "Message and data rates may apply"
- Must include: opt-out instructions ("Reply STOP to unsubscribe")
- Must include: link to privacy policy and terms of service
- See SMS_GUIDELINES.md Section "Consent Requirements" for full requirements

### 5. Error handling
RelayKit returns specific error codes for compliance violations:
- recipient_opted_out (422): Recipient has opted out. Do not retry.
- content_prohibited (422): Message contains prohibited content. See error detail.
- quiet_hours_violation (422): Outside allowed sending hours. Queue for morning.
- rate_limited (429): Too many requests. Implement backoff.

## Compliance rules (summary)
- Always include opt-out language (Reply STOP to unsubscribe)
- Always include your business name
- Don't send between 9 PM - 9 AM recipient's local time (RelayKit enforces this)
- Don't send to numbers that have opted out (RelayKit enforces this)
- See SMS_GUIDELINES.md for complete rules and boundaries
```

### 2.2 Generation logic

```typescript
interface MessagePlanEntry {
  template_id: string;
  category: string;
  original_template: string;
  edited_text: string | null;
  trigger: string;
  variables: string[];
  is_expansion: boolean;
  expansion_type: string | null;
  enabled: boolean;
}

interface BuildSpecCustomer {
  email: string;
  sandbox_api_key: string;
  use_case: string;
  business_name?: string;       // Optional at sandbox stage
  business_description?: string; // Optional — triggers vertical detection
}

function generateBuildSpec(
  messagePlan: MessagePlanEntry[],
  customer: BuildSpecCustomer
): { buildSpec: string; sandboxGuidelines: string } {
  const enabledMessages = messagePlan.filter(m => m.enabled);
  const appLabel = customer.business_name || USE_CASE_LABELS[customer.use_case];

  const messagesSection = enabledMessages.map(m => {
    const text = m.edited_text || m.original_template;
    return [
      `### ${m.category}: ${m.trigger}`,
      '',
      text,
      '',
      `Variables: ${m.variables.join(', ')}`,
      `When to send: ${m.trigger}`,
    ].join('\n');
  }).join('\n\n');

  const triggersSection = enabledMessages.map(m =>
    `- ${m.trigger}: Call sendSMS() with the ${m.category} template, replacing ${m.variables.join(', ')} with actual values`
  ).join('\n');

  const buildSpec = BUILD_SPEC_TEMPLATE
    .replace(/{app_name_or_use_case}/g, appLabel)
    .replace(/{date}/g, new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))
    .replace(/{rk_sandbox_key}/g, customer.sandbox_api_key)
    .replace(/{messages_section}/g, messagesSection)
    .replace(/{triggers_section}/g, triggersSection);

  const sandboxGuidelines = generateGuidelines(
    {
      use_case: customer.use_case,
      business_name: customer.business_name,
      business_description: customer.business_description,
    },
    'sandbox'
  );

  return { buildSpec, sandboxGuidelines };
}
```

This is deterministic string interpolation — same pattern as PRD_02's template engine. No AI generation. Consistency matters for compliance.

---

## 3. MESSAGING_SETUP.md (POST-REGISTRATION)

### When generated

Registration reaches `complete` status. This is the build spec upgraded with production specifics.

### What changes from the build spec

| Element | Build spec (sandbox) | MESSAGING_SETUP.md (production) |
|---------|---------------------|--------------------------------|
| **API key** | `rk_sandbox_...` | `rk_live_...` |
| **Webhook secret** | Not included | Included (`RELAYKIT_WEBHOOK_SECRET`) |
| **Messages** | Developer's selected/edited templates | Canon messages (finalized at registration) |
| **Opt-in form** | Generic template | Customized with compliance site URL |
| **Enforcement details** | Not included | "What RelayKit Handles Automatically" section |
| **Message preview** | Not included | `previewSMS()` function (POST /v1/messages/preview) |
| **Production settings** | Not included | Rate limits, trust score tier, phone number |

### Key design constraint

The code structure is IDENTICAL between the build spec and MESSAGING_SETUP.md. A developer who built from the build spec changes one environment variable (`RELAYKIT_API_KEY`) and their app works in production. MESSAGING_SETUP.md gives their AI coding tool the production context if adjustments are needed.

### Template content

The complete MESSAGING_SETUP.md template is defined in Section 3.1 above. PRD_09 Section 10 references this section for the canonical template.

Key elements from PRD_09:
- `RELAYKIT_API_KEY` and `RELAYKIT_WEBHOOK_SECRET` environment variables
- `sendSMS()` function using `fetch('https://api.relaykit.dev/v1/messages')`
- `previewSMS()` function using `fetch('https://api.relaykit.dev/v1/messages/preview')` for template validation
- Inbound webhook handler for RelayKit JSON event payloads
- "What RelayKit Handles Automatically" section explaining infrastructure-level compliance
- Opt-in form HTML customized with compliance site URL
- Quick integration guide for AI coding assistants
- SMS_GUIDELINES.md cross-reference

### 3.1 MESSAGING_SETUP.md Template

This is the canonical home for the MESSAGING_SETUP.md template. PRD_09 Section 10 references this section.

```markdown
# Messaging Setup for {business_name}
## Generated by RelayKit — {registration_date}

## About this file
This file upgrades your sandbox build spec with production credentials and your
finalized message templates. Your AI coding tool should read this alongside
SMS_GUIDELINES.md to complete the production upgrade.

If you built from SMS_BUILD_SPEC.md, the only required change is swapping your
API key environment variable. The code structure is identical.

## Environment setup
Update your .env file:

RELAYKIT_API_KEY={rk_live_key}
RELAYKIT_API_URL=https://api.relaykit.dev/v1
RELAYKIT_WEBHOOK_SECRET={webhook_secret}

Also update SMS_GUIDELINES.md in your project root with the production edition.

## Your registered messages (canon messages)

These messages are your registration baseline. Drift detection compares your
production messages against these templates. Stay within their scope.

{canon_messages_section}

## What to build (production additions)

### 1. Utility function: sendSMS() — unchanged from build spec
POST to {RELAYKIT_API_URL}/messages
- Headers: Authorization: Bearer {RELAYKIT_API_KEY}, Content-Type: application/json
- Body: { "to": recipientPhone, "body": messageText }
- Handle errors: check response status, parse error codes (see SMS_GUIDELINES.md)

### 2. Message triggers — unchanged from build spec
Your triggers from the build spec work identically in production. No code changes needed.

### 3. Message preview function: previewSMS()
Before deploying new message templates, validate them against your registration:
- POST to {RELAYKIT_API_URL}/messages/preview
- Headers: Authorization: Bearer {RELAYKIT_API_KEY}, Content-Type: application/json
- Body: { "body": messageText, "to": "+15551234567" }
- Response includes: verdict (pass/warning/fail), per-check results, suggestions
- Do NOT deploy templates that return warning or fail verdicts

### 4. Inbound webhook handler — updated for production
Set up a POST endpoint to receive replies and events:
- RelayKit sends JSON: { "type": "message.received", "data": { "from", "to", "body" } }
- Verify the webhook signature using RELAYKIT_WEBHOOK_SECRET:
  - Header: X-RelayKit-Signature: sha256=...
  - Compute HMAC-SHA256 of the request body using your webhook secret
  - Compare with the header value
- Handle STOP/START keywords (RelayKit manages opt-outs automatically, but you receive the event)
- Process other replies based on your app logic
- Configure your webhook URL in your RelayKit dashboard

### 5. Opt-in form — updated with compliance site
Add an SMS consent form where users provide their phone number:
- Must include: program description, message frequency, "Message and data rates may apply"
- Must include: opt-out instructions ("Reply STOP to unsubscribe")
- Must include: link to privacy policy: {compliance_site_url}/privacy
- Must include: link to terms of service: {compliance_site_url}/terms
- The checkbox MUST be unchecked by default

### 6. Error handling — unchanged from build spec
RelayKit returns specific error codes for compliance violations:
- recipient_opted_out (422): Recipient has opted out. Do not retry.
- content_prohibited (422): Message contains prohibited content. See error detail.
- quiet_hours_violation (422): Outside allowed sending hours. Queue for morning.
- rate_limited (429): Too many requests. Implement backoff.
- content_drift_detected (422): Message doesn't match registered use case. Review SMS_GUIDELINES.md.

## What RelayKit handles automatically

Your messages pass through RelayKit's compliance proxy before reaching carriers.
You do NOT need to build any of the following — they are handled at the
infrastructure level:

- **Opt-out enforcement:** Recipients who text STOP are automatically blocked.
  Your app receives the opt-out event via webhook but doesn't need to filter sends.
- **Quiet hours:** Messages sent between 9 PM and 9 AM recipient local time are
  blocked and return quiet_hours_violation. Queue for the next morning.
- **Content scanning:** SHAFT-C content (sex, hate, alcohol, firearms, tobacco,
  cannabis) is blocked before delivery. Per-industry allowlists prevent false
  positives for your business type.
- **Rate limiting:** Carrier-assigned throughput limits are enforced automatically.
  If you exceed them, you receive rate_limited with a Retry-After header.
- **Drift detection:** RelayKit samples production messages and compares them
  against your registered use case. If drift is detected, you receive an alert
  with a suggested compliant rewrite. See SMS_GUIDELINES.md for details.

## Your phone number
{phone_number}
This is the number registered to your approved campaign. Only send from this number.

## Production settings
- Rate limit tier: {rate_limit_tier}
- Registration date: {registration_date}
- Compliance site: {compliance_site_url}

## Compliance rules (summary)
- Always include opt-out language (Reply STOP to unsubscribe)
- Always include your business name
- Don't send between 9 PM - 9 AM recipient's local time (RelayKit enforces this)
- Don't send to numbers that have opted out (RelayKit enforces this)
- Stay within your registered use case (drift detection monitors this)
- See SMS_GUIDELINES.md for complete rules and boundaries
```

```typescript
interface DeliverableInput {
  business_name: string;
  use_case: string;
  email: string;
  tier: 'full_stack' | 'byo_twilio';

  // Full stack tier (PRD_09)
  relaykit_api_key?: string;
  webhook_secret?: string;

  // BYO Twilio tier
  account_sid?: string;
  auth_token?: string;
  messaging_service_sid?: string;

  // Common
  phone_number: string;
  use_case_label: string;
  message_frequency: string;
  compliance_site_url: string;
  canon_messages: CanonMessage[];      // Finalized at registration
  rate_limit_tier: string;             // From trust score
  registration_date: string;
}

interface CanonMessage {
  template_id: string;
  category: string;
  text: string;
  trigger: string;
  variables: string[];
  is_expansion: boolean;
}

function generateDeliverable(input: DeliverableInput): string {
  const template = input.tier === 'full_stack'
    ? RELAYKIT_API_TEMPLATE
    : BYO_TWILIO_TEMPLATE;

  return template
    .replace(/{business_name}/g, input.business_name)
    .replace(/{rk_live_key}/g, input.relaykit_api_key || '')
    .replace(/{webhook_secret}/g, input.webhook_secret || '')
    .replace(/{phone_number}/g, input.phone_number)
    .replace(/{compliance_site_url}/g, input.compliance_site_url)
    .replace(/{canon_messages_section}/g, renderCanonMessages(input.canon_messages))
    .replace(/{registration_date}/g, input.registration_date)
    // ... remaining variable replacements
}
```

---

## 4. SMS_GUIDELINES.md

Two editions of the same document — sandbox and production. Same structure, different content density.

### 4.1 Edition comparison

| Content | Sandbox Edition | Production Edition |
|---------|----------------|-------------------|
| Approved message types | Yes (from use case selection) | Yes (from registration scope) |
| Not-approved content | Yes (boundary examples) | Yes (with registration-specific scope) |
| Vertical modules | Yes (if business description triggers detection) | Yes (from registration vertical detection) |
| Consent requirements | Yes | Yes |
| Frequency guidance | Yes | Yes |
| Content quality rules | Yes | Yes |
| Near-the-line / over-the-line examples | Yes | Yes |
| Canon messages | No | Yes (finalized registered messages) |
| Live credentials reference | No | Yes |
| Production enforcement details | No | Yes (what gets blocked, what gets warned) |
| Drift detection rules | No | Yes |
| Compliance site URL | No | Yes |
| Error code reference | Generic | Production-specific with RelayKit enforcement details |

### 4.2 Sandbox edition

Generated at the same time as the build spec. Ships as a companion file — the developer drops BOTH files in their project root.

**Framing:** "These are the compliance rules for your use case." Not "these are your registered compliance requirements" — because they haven't registered yet.

**What it includes:**

The sandbox edition follows the same structure as the production SMS_GUIDELINES_TEMPLATE.md but with sandbox-appropriate content:

- **Your use case** (not "Your Registration") — use case label, approved message types, frequency guidance. No phone number, no registration date.
- **Hard Rules** — same five hard rules (opt-in, STOP handling, stay in scope, identify sender, opt-out instructions). Code examples reference RelayKit API, not Twilio.
- **Best Practices** — message frequency, message length, sending patterns, content quality. Same as production.
- **Consent Collection Requirements** — all eight required elements. Privacy/terms links use placeholder guidance ("Add links to your privacy policy and terms of service") instead of compliance site URL.
- **Quick Reference** — same scenario Q&A, with sandbox-appropriate answers (e.g., "Your use case is..." instead of "Your campaign is registered as...").
- **Getting Help** — dashboard link, no compliance site URL.

**What it excludes:**
- Canon messages section
- Production enforcement section ("What RelayKit Handles Automatically")
- Drift detection rules
- Compliance site URL references
- Message preview/validation guidance
- Live credentials

### 4.3 Production edition

Generated when registration reaches `complete` status. Replaces the sandbox edition. It's a superset — everything from sandbox PLUS production-specific content.

**Framing:** "These are your registered compliance requirements." This is the compliance contract.

**What it adds over sandbox:**

- **Your Registration** header — business name, registered use case, phone number, approved message types, approved frequency, registration date
- **Canon messages** — the finalized registered messages that become the baseline for drift detection
- **Validating New Messages** section — POST /v1/messages/preview guidance, verdicts (pass/warning/fail), instructions not to deploy templates that return warning or fail
- **What RelayKit Handles Automatically** — opt-out enforcement, quiet hours, content scanning, rate limiting explained as infrastructure-level features
- **Drift detection rules** — what constitutes drift from registered scope, what gets flagged, what gets blocked
- **Compliance site reference** — full URL for consent collection links
- **Production error handling** — RelayKit-specific error codes with enforcement context

### 4.4 Generation logic

```typescript
interface GuidelinesInput {
  use_case: string;
  business_name?: string;              // Optional in sandbox
  business_description?: string;       // Triggers vertical detection
  phone_number?: string;               // Production only
  registration_date?: string;          // Production only
  canon_messages?: CanonMessage[];     // Production only
  compliance_site_url?: string;        // Production only
  approved_message_types?: string;     // Production: from registration
  not_approved_content?: string;       // Production: registration-specific
  message_frequency?: string;
  rate_limit_tier?: string;            // Production only
}

function generateGuidelines(
  input: GuidelinesInput,
  edition: 'sandbox' | 'production'
): string {
  const baseContent = renderBaseGuidelines(input);
  const verticalModule = detectAndRenderVertical(input.business_description);

  if (edition === 'sandbox') {
    return SANDBOX_GUIDELINES_TEMPLATE
      .replace(/{use_case_label}/g, USE_CASE_LABELS[input.use_case])
      .replace(/{business_name}/g, input.business_name || 'Your Business')
      .replace(/{approved_message_types}/g, APPROVED_MESSAGE_TYPES[input.use_case])
      .replace(/{not_approved_content}/g, NOT_APPROVED_CONTENT[input.use_case])
      .replace(/{message_frequency}/g, input.message_frequency || USE_CASE_FREQUENCIES[input.use_case])
      .replace(/{vertical_module}/g, verticalModule)
      .replace(/{base_content}/g, baseContent);
  }

  return PRODUCTION_GUIDELINES_TEMPLATE
    .replace(/{business_name}/g, input.business_name!)
    .replace(/{use_case_label}/g, USE_CASE_LABELS[input.use_case])
    .replace(/{phone_number}/g, input.phone_number!)
    .replace(/{registration_date}/g, input.registration_date!)
    .replace(/{approved_message_types}/g, input.approved_message_types!)
    .replace(/{not_approved_content}/g, input.not_approved_content!)
    .replace(/{message_frequency}/g, input.message_frequency!)
    .replace(/{compliance_site_url}/g, input.compliance_site_url!)
    .replace(/{canon_messages_section}/g, renderCanonMessages(input.canon_messages!))
    .replace(/{vertical_module}/g, verticalModule)
    .replace(/{base_content}/g, baseContent);
}
```

The sandbox edition is NOT "production guidelines minus some sections." It's purpose-built for the sandbox context with different framing and different header structure. Two separate templates, shared base content sections.

---

## 5. BYO TWILIO TIER — Phase 2 (do not build)

> **Phase 2 — do not build.** This section describes BYO Twilio deliverable behavior for future reference. Do not implement `template-byo-twilio.ts` or any BYO-specific deliverable logic in v1.

For developers who already have a Twilio account. Registration is submitted to the customer's own Twilio account — RelayKit makes API calls with their credentials during registration, then they're self-sufficient.

### What they get

- Registration expertise (they don't know what carriers want)
- Compliance site generation and hosting (carriers check this)
- Carrier-approved campaign description and sample messages (PRD_02 template engine output)
- Message library for their use case (with copy icons for compliance-validated templates)
- SMS_GUIDELINES.md (production edition, same quality as full-stack customers)
- Privacy policy and terms of service generation

### BYO deliverable: MESSAGING_SETUP.md

Uses the direct-to-Twilio template. Key differences from full-stack:

| Element | Full-stack (RelayKit API) | BYO Twilio |
|---------|--------------------------|------------|
| **Credentials** | `RELAYKIT_API_KEY`, `RELAYKIT_WEBHOOK_SECRET` | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_MESSAGING_SERVICE_SID` |
| **Send function** | `fetch('https://api.relaykit.dev/v1/messages')` with JSON | `fetch('https://api.twilio.com/2010-04-01/...')` with form-data |
| **Inbound handler** | RelayKit JSON payload | TwiML form-data payload |
| **Compliance enforcement** | Infrastructure-level (proxy handles it) | Developer-level (guidelines are the guardrails) |
| **Preview endpoint** | POST /v1/messages/preview | Not available |
| **Message library** | In dashboard | In deliverable with copy icons |

### BYO template additions

```markdown
## Message Library

These messages are validated for your registered use case. Copy them
directly into your application code.

### {category_1}
{message_text} [📋 Copy]
Variables: {variable_list}
When to send: {trigger}

{repeat for all canon messages}
```

### Upsell section (bottom of BYO deliverable)

```markdown
## Want Automatic Compliance Protection?

Your current setup sends messages directly through your Twilio account. You're
responsible for opt-out handling, quiet hours, content compliance, and rate limiting.

RelayKit's managed API handles all of this automatically:
- Opt-out enforcement at the infrastructure level
- Quiet hours blocking (no code changes needed)
- Content scanning before delivery
- Rate limiting that protects your sender reputation

Switch with one key swap:
1. Log into your RelayKit dashboard
2. Click "Upgrade to RelayKit API"
3. Replace your Twilio credentials with your RelayKit API key
4. Same code structure, automatic compliance protection

Learn more: https://relaykit.com/dashboard
```

### BYO SMS_GUIDELINES.md

Production edition — identical quality to full-stack customers. The only differences:
- Error handling references Twilio error codes instead of RelayKit error codes
- No "What RelayKit Handles Automatically" section (because they don't have the proxy)
- Consent form links use compliance site URL (same — RelayKit hosts for both tiers)
- Emphasis that compliance enforcement is developer responsibility, not infrastructure

---

## 6. DOCUMENT LIFECYCLE

### Stage-by-stage document availability

| Lifecycle stage | Documents available | How delivered |
|----------------|--------------------|--------------| 
| **Sandbox** (pre-registration) | SMS_BUILD_SPEC.md + SMS_GUIDELINES.md (sandbox) | Dashboard download / copy-to-clipboard |
| **Registration in progress** | Sandbox documents remain available | No change |
| **Live** (registration complete) | MESSAGING_SETUP.md + SMS_GUIDELINES.md (production) | Dashboard download, email notification with link |

### Document replacement flow

When registration completes:
1. MESSAGING_SETUP.md becomes available on dashboard (Resources card, PRD_06 Stage 6)
2. SMS_GUIDELINES.md (production) replaces sandbox edition on dashboard
3. SMS_BUILD_SPEC.md remains available for reference but de-emphasized
4. Email notification sent with link to dashboard (credentials not in email)
5. Dashboard shows prominent "Key swap instructions: Update RELAYKIT_API_KEY in your .env. That's it."

### Canon messages vs build spec messages

This distinction is critical for drift detection (PRD_08):

- **Build spec messages** — the developer's selected/edited templates from the plan builder. These are working drafts used for sandbox development.
- **Canon messages** — finalized at registration. These become the compliance baseline. Drift detection measures production messages against canon messages, NOT against build spec drafts.

A developer may edit messages in the plan builder after generating a build spec. The build spec is regeneratable — clicking "Generate build spec" again produces an updated version. But canon messages are locked at registration and can only change through a re-registration process.

---

## 7. USE-CASE-SPECIFIC TIPS

Same per-use-case examples as v2.0, included in both build spec and MESSAGING_SETUP.md. Updated tips reference RelayKit's automatic enforcement:

| Use Case | Key Tip |
|----------|---------|
| `appointments` | "RelayKit enforces quiet hours automatically — schedule sends any time and the API will block if outside 9am–9pm for the recipient." |
| `orders` | "Delivery update frequency can spike during shipping — RelayKit's rate limiter accounts for transactional message patterns." |
| `verification` | "OTP messages don't require opt-out language per CTIA guidelines. RelayKit won't flag these." |
| `support` | "Two-way support conversations don't require opt-out language in every reply. First message in a new conversation should include it." |
| `marketing` | "Marketing messages are subject to quiet hours (enforced automatically by RelayKit). Every marketing message must include opt-out language." |
| `internal` | "Team messages follow the same compliance rules. Recipients must opt in, even if they're employees." |
| `community` | "Group messages to large lists should be staggered. RelayKit handles queuing automatically." |
| `waitlist` | "Waitlist confirmations are time-sensitive — RelayKit prioritizes these over non-urgent messages in the queue." |

BYO Twilio customers receive the same tips with adjusted language: "Implement quiet hours in your application" instead of "RelayKit enforces quiet hours automatically."

---

## 8. DELIVERY MECHANICS

### Dashboard delivery

- **Sandbox stage:** "Generate build spec" button on Overview tab produces SMS_BUILD_SPEC.md + SMS_GUIDELINES.md (sandbox). Preview modal with download button and copy-to-clipboard.
- **Live stage:** Resources card shows MESSAGING_SETUP.md download + SMS_GUIDELINES.md (production) download. API keys card shows live key with copy button.
- All documents regeneratable from source data at any time.

### Email delivery

- **Build spec generated:** No email (they're already on the dashboard).
- **Registration approved:** Email notification with link to dashboard. Credentials are NOT included in the email — developer must log in to access.

### Storage

Documents stored in Supabase Storage, keyed by customer ID and document type. Regeneratable from registration data — storage is a cache, not the source of truth.

```
deliverables/
  {customer_id}/
    build-spec.md           # Latest build spec
    guidelines-sandbox.md   # Sandbox guidelines
    messaging-setup.md      # Post-registration (null until complete)
    guidelines-production.md # Production guidelines (null until complete)
```

---

## 9. IMPLEMENTATION NOTES

### File structure

```
lib/
  deliverable/
    build-spec-generator.ts        # generateBuildSpec() — sandbox build spec
    build-spec-template.ts         # SMS_BUILD_SPEC.md template string
    sandbox-guidelines.ts          # Sandbox edition SMS_GUIDELINES.md generator
    generator.ts                   # generateDeliverable() — post-registration, tier selection
    template-relaykit.ts           # MESSAGING_SETUP.md template (RelayKit API)
    # Phase 2 files:
    # template-byo-twilio.ts       # MESSAGING_SETUP.md template (BYO Twilio) — do not create in v1
    guidelines-generator.ts        # generateGuidelines() — both editions
    guidelines-template-sandbox.ts # Sandbox guidelines template string
    guidelines-template-prod.ts    # Production guidelines template string
    use-case-examples.ts           # Per-use-case tips and message examples
    canon-messages.ts              # Canon message rendering for production docs
```

### Shared constants

Reuse from PRD_02's template engine:
- `USE_CASE_LABELS` — human-readable use case names
- `USE_CASE_FREQUENCIES` — default frequency descriptions
- `APPROVED_MESSAGE_TYPES` — per-use-case approved content maps
- `NOT_APPROVED_CONTENT` — per-use-case boundary examples

### Vertical detection

Same logic as PRD_02 and PRD_05_ADDENDUM_VERTICALS. If `business_description` is provided (optional in sandbox, required at registration), the vertical detection module selects the appropriate industry-specific compliance module from the 17 available modules. This module is injected into both sandbox and production editions of SMS_GUIDELINES.md.

---

## 10. TRAPS TO AVOID

These are documented as implementation guardrails for Claude Code sessions:

1. **The build spec is not an afterthought.** It's not "a preview of the real deliverable." It IS the primary deliverable for sandbox. Treat it with the same care and testing as MESSAGING_SETUP.md.

2. **No AI generation for any of these documents.** All three are deterministic string interpolation from templates + customer data. Same pattern as PRD_02. This is a compliance product — consistency matters more than creativity.

3. **Don't duplicate the MESSAGING_SETUP.md template.** The canonical template lives in PRD_05 Section 3.1. PRD_09 Section 10 references it. This PRD owns both the template content and the generation logic.

4. **Sandbox SMS_GUIDELINES.md is a separate generator.** It's not "production guidelines minus some sections." It's purpose-built for the sandbox context with different framing. Two separate templates sharing base content sections.

5. **Canon messages are NOT in the build spec.** The build spec has the developer's selected/edited templates from the plan builder. Canon messages only exist after registration finalizes them. This distinction matters for drift detection — canon messages become the baseline, not sandbox drafts.

6. **The code structure must be identical.** A developer who built from the build spec and switches to production should only change one environment variable. If the build spec's `sendSMS()` function signature differs from MESSAGING_SETUP.md's, the conversion promise is broken.

---

## 11. WHAT THIS PRD DOES NOT COVER

Handled by other PRDs, unchanged:

- **Message plan builder UI** (PRD_06 Section 4) — card layout, editing behavior, expansion toggles
- **Build spec preview UI** (PRD_06 Section 5) — modal, download button, copy-to-clipboard
- **Sandbox API behavior** (PRD_09) — message sending, compliance pipeline, Twilio forwarding
- **Registration pipeline** (PRD_04) — state machine, Twilio API calls, polling
- **Template engine** (PRD_02) — artifact generation logic for registration submissions
- **Compliance site** (PRD_03) — static site generation and deployment
- **Compliance monitoring** (PRD_08) — drift detection, inline enforcement rules
- **Vertical modules** (PRD_05_ADDENDUM) — 17 industry-specific compliance modules
- **Landing page** (PRD_07) — marketing site and conversion flow
- **Pricing and Stripe** (PRICING_MODEL_UPDATE.md) — billing, subscriptions, overages
