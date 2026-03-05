import type { UseCaseId } from "@/lib/intake/use-case-data";
import { USE_CASE_LABELS, USE_CASE_FREQUENCIES } from "@/lib/templates/types";
import {
  APPROVED_MESSAGE_TYPES,
  NOT_APPROVED_CONTENT,
} from "@/lib/templates/message-templates";
import {
  detectVerticals,
  assembleGuidelines,
} from "@/lib/templates/verticals";

export interface SandboxGuidelinesInput {
  useCase: UseCaseId;
  businessName?: string;
  businessDescription?: string;
}

export function generateSandboxGuidelines(
  input: SandboxGuidelinesInput,
): string {
  const useCaseLabel = USE_CASE_LABELS[input.useCase];
  const businessName = input.businessName || "Your Business";
  const frequency = USE_CASE_FREQUENCIES[input.useCase];
  const approved = APPROVED_MESSAGE_TYPES[input.useCase];
  const notApproved = NOT_APPROVED_CONTENT[input.useCase];

  const baseGuidelines = `# SMS Guidelines for ${businessName}
## Your Use Case: ${useCaseLabel}

These are the compliance rules for your use case. Your AI coding tool should
reference this file when writing or modifying any SMS-related code.

## Approved message types

${approved}

## Not approved for this use case

${notApproved}

## Message frequency

${frequency}

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
${frequency}. Don't send more frequently than recipients expect. Unexpected
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

## Consent collection requirements

When collecting SMS consent, your opt-in form must include ALL of the following:

1. **Program description** — what messages the recipient will receive
2. **Message frequency** — how often they'll receive messages
3. **"Message and data rates may apply"** — carrier cost disclosure
4. **Opt-out instructions** — "Reply STOP to unsubscribe"
5. **Link to privacy policy** — add a link to your privacy policy
6. **Link to terms of service** — add a link to your terms of service
7. **Checkbox must be unchecked by default** — consent must be affirmative
8. **Cannot be bundled** — SMS consent cannot be a condition of purchase or
   service

---

## Quick reference

**Can I send a message that's not in my approved list?**
Stay within your approved message types. If you need to send different types
of messages, you may need a separate campaign registration.

**What happens if a recipient replies STOP?**
RelayKit automatically unsubscribes them. Your app receives the event via
webhook but does not need to manage opt-outs.

**Can I send messages at any time?**
RelayKit enforces quiet hours (9 PM – 9 AM recipient local time). Messages
sent during quiet hours return a quiet_hours_violation error. Queue them for
the next morning.

**What if my message gets blocked?**
Check the error code. content_prohibited means the message content was flagged.
Review the error detail and adjust the message text.

---

## Getting help

Visit your RelayKit dashboard for message testing, plan management, and
registration status.
`;

  // Inject vertical-specific modules if business description is provided
  if (input.businessDescription) {
    const verticals = detectVerticals(null, input.businessDescription);
    if (verticals.length > 0) {
      return assembleGuidelines(baseGuidelines, verticals);
    }
  }

  return baseGuidelines;
}
