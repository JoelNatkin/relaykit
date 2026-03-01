export const automotive = {
  id: "automotive",
  title: "Best Practices — Automotive Services Messaging",
  content: `## Best Practices — Automotive Services Messaging

### Service appointment reminders:
- Include the vehicle if known: "Reminder — your oil change for your 2019 Honda Civic is tomorrow at 9 AM."
- Include estimated duration: "Service typically takes 45 minutes."

### Service completion:
- "Your vehicle is ready for pickup! We're open until 6 PM. Call [phone] with questions."
- Do NOT include pricing details in the message — handle that at pickup or via invoice

### Recall/maintenance reminders (if registered for marketing/mixed):
- "It's been 6 months since your last oil change. Schedule your next service at [website] or call [phone]."
- Seasonal reminders: "Winter is coming — schedule your tire change at [phone]."
- One reminder per maintenance cycle, do not repeat

### Inspection/diagnostic results:
- Do NOT send detailed diagnostic results via SMS
- "Your vehicle inspection is complete. We have some recommendations to discuss. Call us at [phone]."
- Redirect to in-person or phone discussion for any repair recommendations`,
} as const;
