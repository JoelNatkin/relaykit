export const mentalHealth = {
  id: "mental_health",
  title: "Industry Rules — Mental Health & Behavioral Health",
  content: `## Industry Rules — Mental Health & Behavioral Health

In addition to standard healthcare rules above, mental health services require extra sensitivity in messaging.

### Additional restrictions:
- Never reference the type of provider (therapist, counselor, psychiatrist) in messages
- Never mention session type (individual therapy, group therapy, couples counseling)
- Never reference mental health conditions, medications, or treatment approaches
- Be aware that even confirming someone has an appointment at a known mental health practice could be a privacy concern

### Recommended approach:
- Use the most generic language possible
- "Reminder: you have an appointment tomorrow at 3:00 PM"
- Do NOT include the practice name if the practice name itself reveals the nature of services (e.g., "Anxiety & Depression Center" — use a neutral name or initials)
- If the business name reveals the specialty, discuss with the developer whether to use an abbreviated or neutral form in messages

### Two-way messaging caution:
- If building reply functionality, never store inbound message content that might contain mental health disclosures in an unencrypted database
- Route any substantive patient replies to a secure channel immediately
- Automated replies should be generic: "Thank you for your message. Our office will be in touch during business hours."`,
} as const;
