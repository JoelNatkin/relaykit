export const fitness = {
  id: "fitness",
  title: "Best Practices — Gym, Studio & Fitness Messaging",
  content: `## Best Practices — Gym, Studio & Fitness Messaging

### Class/session reminders:
- Include the class name and instructor: "Yoga with Sarah, tomorrow at 7 AM"
- For limited-capacity classes, include waitlist position if applicable
- Send 2-3 hours before class, not 24 hours (fitness decisions are more spontaneous)

### Membership and billing:
- NEVER include specific dollar amounts or payment details in SMS
- "Your membership is up for renewal. Log in at {website} or call {phone} to review your options."
- NOT: "Your $49.99 monthly payment failed. Update your card..."

### Motivational messaging (if registered for Mixed/Marketing):
- Keep it brief and action-oriented
- "New HIIT class dropping this Saturday at 9 AM. Spots limited — book now!"
- Avoid health claims or weight loss language — carriers flag this
- Never reference specific body measurements, weight, or health outcomes

### Challenge/program messaging:
- Daily check-ins should be opt-in to a specific program, not the general SMS list
- "Day 12 of your 30-day challenge! Today's workout is posted in the app."
- Provide easy opt-out from the challenge without opting out of all messages (this requires separate tracking in your app)`,
} as const;
