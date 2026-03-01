export const restaurant = {
  id: "restaurant",
  title: "Best Practices — Restaurant Messaging",
  content: `## Best Practices — Restaurant Messaging

### Reservation reminders:
- Send 2-4 hours before reservation (not 24 hours — dining plans change)
- Include party size for confirmation: "Table for 4 tonight at 7:30 PM"
- Simple reply confirmation: "Reply C to confirm or X to cancel"

### Waitlist:
- Time-sensitivity is everything — send immediately when table is ready
- Include a deadline: "Your table is ready! Please arrive within 15 minutes."
- Follow up once if no response after 5 minutes:
  "Still joining us? Your table will be released in 10 minutes if we don't hear back."
- After release: "We've given your table to the next guest. Reply YES to rejoin the waitlist."

### Order notifications (if applicable):
- Pickup orders: "Your order is ready for pickup!"
- Delivery: "Your order is on its way! Estimated arrival: [time]"
- Include order number if relevant

### Promotional messaging (if registered):
- Daily specials work well: "Tonight's special: Pan-seared salmon, $22. Reserve your table at {website}."
- Keep it short and appetizing — one dish or one offer per message
- Lunch promotions should go out by 10:30 AM
- Dinner promotions should go out by 3:00 PM
- Never send food promotions after 8 PM

### Feedback:
- If registered for feedback/review requests:
  "Thanks for dining with us tonight! How was your experience? Reply 1-5."
- Send within 1 hour of estimated dining completion
- One follow-up maximum if no response — don't nag`,
} as const;
