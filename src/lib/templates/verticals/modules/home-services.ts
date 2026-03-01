export const homeServices = {
  id: "home_services",
  title: "Best Practices — Home Services Messaging",
  content: `## Best Practices — Home Services Messaging

### Appointment/service window:
- Home services often have windows, not exact times
- "Your [service type] appointment is tomorrow between [start] and [end]. Our tech will text you when they're 30 minutes away."
- Day-of "on the way" message is high value:
  "[tech name] is heading to your location. ETA: approximately [time]."

### Job completion:
- Follow up after service completion
- "Your [service] is complete! If you have any questions, call [phone]."
- Invoice should NOT be sent via SMS — redirect to email or portal

### Quote follow-up:
- If registered for follow-up messaging:
  "Following up on the [service] quote we sent on [date]. Ready to schedule? Reply YES or call [phone]."
- One follow-up only. Don't chase.

### Emergency/urgent service:
- Emergency dispatch confirmation is high-priority
- "Emergency [service] confirmed. [tech name] is on the way. ETA: [time]. Call [phone] if you need to reach us."
- Keep the customer updated if ETA changes

### Seasonal reminders (if registered for marketing/mixed):
- "Time for your annual [service] checkup! Schedule at [website] or call [phone]."
- Time these appropriately (HVAC maintenance before summer/winter, gutter cleaning in fall, etc.)`,
} as const;
