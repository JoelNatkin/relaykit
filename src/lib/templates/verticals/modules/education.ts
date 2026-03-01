export const education = {
  id: "education",
  title: "Best Practices — Education & Tutoring Messaging",
  content: `## Best Practices — Education & Tutoring Messaging

### Class/session reminders:
- Include what to bring or prepare if relevant
- "{business_name}: Reminder — [student name]'s [class] is tomorrow at [time]. Please bring [materials]."
- For minor students, messages go to parents — always address the parent

### Schedule changes:
- Proactive communication for cancellations
- "{business_name}: [Class] on [date] has been cancelled due to [reason]. Makeup class is scheduled for [date]."

### Progress updates:
- Keep generic in SMS — detailed progress should go through a portal or email
- "{business_name}: [Student]'s progress report is ready. View at [portal URL]."
- NOT: "[Student] scored 72% on their math assessment" (grades are sensitive)

### Payment reminders:
- Keep generic: "Your [month] tuition is due. View your account at [portal URL]."
- NEVER include specific amounts in SMS

### Minors:
- If the service involves minors, all messages must be sent to the parent/guardian
- Never send messages directly to a minor's phone number
- The opt-in consent must come from the parent/guardian, not the student`,
} as const;
