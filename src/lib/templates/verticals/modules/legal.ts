export const legal = {
  id: "legal",
  title: "Industry Rules — Legal Services",
  content: `## Industry Rules — Legal Services

### Attorney-client privilege:
- Standard SMS is not a privileged communication channel
- Never include case details, legal strategy, or confidential information
- Never reference specific charges, allegations, or legal matters
- Never mention opposing parties by name

### Safe message patterns:
- "Your consultation is scheduled for [date] at [time]."
- "We have an update on your matter. Please call our office at [phone]."
- "Your documents are ready for review. Visit our office or check your portal."
- "Reminder: your filing deadline is [date]. Call us if you have questions."

### Unsafe patterns — BLOCK these:
- "Update on your divorce proceedings..."
- "The court has scheduled your DUI hearing for..."
- "Your immigration application status has changed..."
- "Opposing counsel has responded to..."
- Any reference to specific case types, charges, or legal matters

### Billing:
- Never send invoices or specific billing amounts via SMS
- "Your invoice is ready. View it at [secure portal URL]."
- NOT: "Your balance of $3,500 is due on..."

### Court date reminders:
- Include date, time, and location only
- Never reference the case type or charge
- "{business_name}: Court date reminder — [date] at [time], [courthouse name], Room [number]. Arrive 30 minutes early."`,
} as const;
