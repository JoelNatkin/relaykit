// ---------------------------------------------------------------------------
// SMS_GUIDELINES.md — Production Edition Template
// ---------------------------------------------------------------------------
// Placeholder-based template for production guidelines. Used by guidelines-generator.ts.
// Framing: "your registered compliance requirements" — NOT sandbox's "rules for your use case."
//
// Placeholders:
//   {business_name}          — customer business name
//   {use_case_label}         — registered use case (e.g. "Order Notifications")
//   {phone_number}           — assigned 10DLC phone number
//   {registration_date}      — date campaign was approved
//   {approved_message_types} — bullet list of approved message types
//   {not_approved_content}   — bullet list of content NOT approved
//   {message_frequency}      — approved message frequency description
//   {canon_messages_section} — registered message templates (canon messages)
//   {compliance_site_url}    — URL of hosted compliance site
//   {rate_limit_tier}        — carrier-assigned rate/throughput tier
//   {use_case_tip}           — contextual tip for the customer's use case

export const PRODUCTION_GUIDELINES_TEMPLATE = `# SMS Guidelines for {business_name}
## Your Registration: {use_case_label}

These are your registered compliance requirements. Your AI coding tool should
reference this file when writing or modifying any SMS-related code.

- **Phone number:** {phone_number}
- **Approved message types:** {approved_message_types}
- **Approved frequency:** {message_frequency}
- **Registration date:** {registration_date}

---

## Your registered messages

These messages are your registration baseline. Drift detection compares your
production messages against these templates. Stay within their scope.

{canon_messages_section}

---

## Approved message types

{approved_message_types}

## Not approved for this registration

{not_approved_content}

## Message frequency

{message_frequency}

---

## Hard rules

These rules apply to every message your app sends. Violations can result in
carrier filtering, number suspension, or campaign rejection.

### 1. Opt-in required
Every recipient must give explicit consent before receiving messages. Consent
must be captured via a form that includes program description, frequency,
"Message and data rates may apply," and opt-out instructions.

### 2. STOP handling
Every message must include opt-out instructions. When a recipient texts STOP,
they must be unsubscribed immediately. RelayKit handles this automatically —
your app receives the opt-out event but does not need to filter sends.

### 3. Stay in scope
Only send messages that match your approved message types above. Messages
outside your registered use case will be flagged or blocked.

### 4. Identify the sender
Every message must include your business name so recipients know who is
texting them.

### 5. Include opt-out instructions
Every message must contain language like "Reply STOP to unsubscribe" or
equivalent. This is carrier-mandated.

---

## Best practices

### Message frequency
{message_frequency}. Don't send more frequently than recipients expect. Unexpected
messages drive opt-outs and complaints.

### Message length
Keep messages under 160 characters when possible. Longer messages are split
into multiple segments, which increases cost and can affect delivery.

### Sending patterns
- Don't send between 9 PM and 9 AM in the recipient's local time zone.
  RelayKit enforces quiet hours automatically.
- Avoid sending large bursts. Stagger sends over time when messaging many
  recipients.
- Transactional messages (confirmations, reminders) should be sent promptly
  after the triggering event.

### Content quality
- Use proper grammar and spelling.
- Don't use ALL CAPS excessively.
- Don't use URL shorteners (carriers flag these). Use full URLs.
- Don't include phone numbers in message text.

---

## Validating new messages

Before deploying new message templates, validate them against your registration:
- POST to \${RELAYKIT_API_URL}/messages/preview
- Headers: Authorization: Bearer \${RELAYKIT_API_KEY}, Content-Type: application/json
- Body: { "body": messageText, "to": "+15551234567" }
- Response includes: verdict (pass/warning/fail), per-check results, suggestions
- Do NOT deploy templates that return warning or fail verdicts

---

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
- **Rate limiting:** Your throughput tier is {rate_limit_tier}. Carrier-assigned
  throughput limits are enforced automatically. If you exceed them, you receive
  rate_limited with a Retry-After header.
- **Drift detection:** RelayKit samples production messages and compares them
  against your registered use case. If drift is detected, you receive an alert
  with a suggested compliant rewrite. See below for details.

---

## Drift detection

RelayKit monitors your production messages for drift from your registered scope.

**What constitutes drift:**
- Message content outside your approved message types
- Significant deviation from your registered message templates
- Introduction of content categories not in your registration

**What gets flagged (warning):**
- Minor wording changes that maintain the same intent
- Adding variables not in the original template
- You receive a drift alert with a suggested compliant rewrite

**What gets blocked (violation):**
- Messages that fall entirely outside your registered use case
- SHAFT-C content (sex, hate, alcohol, firearms, tobacco, cannabis)
- Messages missing required compliance elements (business name, opt-out)

---

## Consent collection requirements

When collecting SMS consent, your opt-in form must include ALL of the following:

1. **Program description** — what messages the recipient will receive
2. **Message frequency** — how often they'll receive messages
3. **"Message and data rates may apply"** — carrier cost disclosure
4. **Opt-out instructions** — "Reply STOP to unsubscribe"
5. **Link to privacy policy** — {compliance_site_url}/privacy
6. **Link to terms of service** — {compliance_site_url}/terms
7. **Checkbox must be unchecked by default** — consent must be affirmative
8. **Cannot be bundled** — SMS consent cannot be a condition of purchase or
   service

---

## Error handling

RelayKit returns specific error codes for compliance violations:
- recipient_opted_out (422): Recipient has opted out. Do not retry.
- content_prohibited (422): Message contains prohibited content. See error detail.
- quiet_hours_violation (422): Outside allowed sending hours. Queue for morning.
- rate_limited (429): Too many requests. Implement backoff.
- content_drift_detected (422): Message doesn't match registered use case. Review your registered messages above.

---

## Quick reference

**Can I send a message that's not in my registered list?**
Your campaign is registered as {use_case_label}. Stay within your approved
message types. Messages outside your registered scope may trigger drift
detection. If you need to send different types, contact RelayKit about
registering an additional campaign.

**What happens if a recipient replies STOP?**
RelayKit automatically unsubscribes them. Your app receives the event via
webhook but does not need to manage opt-outs.

**Can I send messages at any time?**
RelayKit enforces quiet hours (9 PM – 9 AM recipient local time). Messages
sent during quiet hours return a quiet_hours_violation error. Queue them for
the next morning.

**What if my message gets blocked?**
Check the error code. content_drift_detected means the message drifted from
your registration. content_prohibited means the content was flagged for a
compliance rule violation. Review the error detail and adjust the message text.

---

### Tip for your use case

{use_case_tip}

---

## Getting help

Visit your RelayKit dashboard for message testing, plan management, and
registration details.

Your compliance site: {compliance_site_url}
`;
