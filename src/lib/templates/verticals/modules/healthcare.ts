export const healthcare = {
  id: "healthcare",
  title: "Industry Rules — Healthcare",
  content: `## Industry Rules — Healthcare

This app serves a healthcare business. Federal privacy law (HIPAA) restricts what can be communicated via standard SMS. These rules are hard constraints — violating them exposes the business to regulatory fines.

### Protected Health Information (PHI) — NEVER include in any message:
- Specific treatments, procedures, or diagnoses
- Medication names or dosages
- Lab results, test outcomes, or imaging references
- Provider names combined with treatment context
- Insurance details, claim numbers, or billing tied to health services
- Any information that connects a specific person to a health condition

### Safe message patterns for healthcare:
- "Your appointment is [date] at [time]" — no procedure mentioned
- "Please arrive 15 minutes early for your visit" — generic
- "We have an update for you. Please call our office at [number]" — redirects to secure channel
- "Your appointment has been rescheduled to [date]" — no reason given
- "It's time to schedule your next visit. Call us at [number]" — no specifics

### Unsafe patterns — BLOCK these if the developer tries to implement them:
- Including procedure names: "your root canal", "your cleaning", "your screening"
- Including provider specialties in context: "Dr. Smith in Psychiatry"
- Sending test/lab results: "your results are ready", "your blood work shows..."
- Referencing medications: "time to refill your [medication]"
- Referencing diagnosis: "regarding your [condition]"

### When the developer asks to include health details in a message:
Explain that standard SMS is not HIPAA-compliant and suggest:
1. Send a generic notification via SMS ("You have a new message from {business_name}")
2. Direct the patient to a secure portal for the actual health information
3. Use the SMS as a prompt to call the office

### Recommended message timing for healthcare:
- Appointment reminders: 24 hours before (not 48 — cancellation rates increase at longer windows)
- No-show follow-up: 1 hour after missed appointment
- Recall reminders (annual checkup, etc.): during business hours only
- Never send health-related messages before 8 AM or after 7 PM`,
} as const;
