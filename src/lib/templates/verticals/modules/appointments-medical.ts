export const appointmentsMedical = {
  id: "appointments_medical",
  title: "Best Practices — Medical Appointment Messaging",
  content: `## Best Practices — Medical Appointment Messaging

### Optimal reminder timing:
- Primary reminder: 24 hours before appointment
- Optional second reminder: 2 hours before appointment
- Confirmation request: at time of booking
- No-show follow-up: 1-2 hours after missed appointment time

### Confirmation flow pattern:
Outbound: "{business_name}: Reminder — your appointment is tomorrow, [date] at [time]. Reply C to confirm or R to reschedule."

Inbound "C": "{business_name}: Confirmed! See you tomorrow at [time]. Please arrive 15 minutes early."

Inbound "R": "{business_name}: To reschedule, please call us at [phone] during business hours."

Inbound other: "{business_name}: Sorry, we didn't understand that. Reply C to confirm or R to reschedule your appointment."

### No-show handling:
- Send one follow-up message only — do not repeatedly message no-shows
- Tone should be helpful, not punitive
- "We missed you today. Call us at [phone] to reschedule when you're ready."
- Never reference cancellation fees or penalties via SMS

### Recall/recare reminders (annual checkups, cleanings, etc.):
- Send during business hours only (9 AM - 5 PM)
- Limit to one reminder per recall event
- If no response after 1 message, do not follow up via SMS — use other channels
- "Hi! It's been a while since your last visit. Call [phone] to schedule your next appointment with {business_name}."`,
} as const;
