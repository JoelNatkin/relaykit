export const appointmentsGeneral = {
  id: "appointments_general",
  title: "Best Practices — Appointment Messaging",
  content: `## Best Practices — Appointment Messaging

### Optimal timing:
- Booking confirmation: immediately after booking
- Reminder: 24 hours before
- Optional day-of reminder: 2 hours before
- Follow-up: 1-2 hours after appointment (for review requests, if registered for this)

### Confirmation/reply patterns:
- Keep reply options simple: C to confirm, R to reschedule
- Always handle unexpected replies gracefully with a fallback message
- Include a phone number for complex requests (rescheduling to specific times can't be handled well via SMS)

### Cancellation messages:
- Confirm cancellation promptly
- Offer to rebook in the same message
- "{business_name}: Your appointment on [date] has been cancelled. To rebook, call us at [phone] or visit [website]."

### Waitlist notifications:
- Time-sensitive — send immediately when spot opens
- Include a deadline: "Reply YES within 30 minutes to claim this spot"
- Handle expiration: if no reply, move to next person on waitlist`,
} as const;
