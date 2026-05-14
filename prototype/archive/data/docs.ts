export const BUILD_SPEC_CONTENT = `# {app_name} — SMS Build Spec

## Registration Summary
- **Brand**: {app_name}
- **Campaign type**: Transactional
- **Registered phone number**: (555) 123-4567
- **Throughput**: 15 msg/sec (standard 10DLC)

## Registered Message Templates
Your approved templates are listed below. Each template includes placeholder tokens
that your application fills in at send time.

## Integration Checklist
1. Store your API key securely (environment variable, not source code)
2. Use the RelayKit SDK or call the REST API directly
3. Always pass the \`template_id\` when sending — the proxy validates against registered templates
4. Handle delivery receipts via webhook for reliable tracking
5. Implement exponential backoff on 429 rate-limit responses

## Rate Limits
- 15 messages per second (10DLC standard throughput)
- Burst up to 25/sec for 5 seconds, then throttled
- Daily cap: 100,000 messages (contact support to increase)
`;

export const SMS_GUIDELINES_CONTENT = `# {app_name} — SMS Guidelines

## Consent Requirements
- Obtain express written consent before sending any SMS
- Maintain opt-in records with timestamp, source, and consent language
- Honor STOP requests immediately — the proxy handles this automatically

## Message Content Rules
- Always identify {app_name} in the first line of every message
- Include opt-out language ("Reply STOP to opt out") on every marketing message
- Keep messages under 160 characters when possible to avoid multi-segment billing
- Never send between 9 PM and 8 AM in the recipient's local time zone

## Prohibited Content
- Marijuana / cannabis (even where state-legal)
- Gambling or betting
- Firearms or ammunition
- High-risk financial services (payday loans, crypto)
- SHAFT content (sex, hate, alcohol, firearms, tobacco)

## Compliance Contacts
- Carrier violations: support@relaykit.com
- Opt-out issues: compliance@relaykit.com
- TCPA questions: legal@relaykit.com
`;

export const API_REFERENCE_CONTENT = `# {app_name} — API Reference

## Base URL
\`\`\`
https://api.relaykit.com/v1
\`\`\`

## Authentication
Include your API key in the \`Authorization\` header:
\`\`\`
Authorization: Bearer rk_live_xxxxxxxxxxxx
\`\`\`

## Send Message
\`\`\`
POST /messages
Content-Type: application/json

{
  "to": "+15551234567",
  "template_id": "verification_login_code",
  "params": {
    "code": "482901"
  }
}
\`\`\`

**Response** (202 Accepted):
\`\`\`json
{
  "id": "msg_abc123",
  "status": "queued",
  "created_at": "2026-03-08T14:30:00Z"
}
\`\`\`

## Delivery Webhooks
Configure your webhook URL in the dashboard. Events:
- \`message.delivered\` — carrier confirmed delivery
- \`message.failed\` — delivery failed (includes error code)
- \`message.opted_out\` — recipient replied STOP
`;
