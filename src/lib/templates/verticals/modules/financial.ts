export const financial = {
  id: "financial",
  title: "Industry Rules — Financial Services",
  content: `## Industry Rules — Financial Services

### Sensitive financial data — NEVER include in any message:
- Account numbers (even partial)
- Account balances or transaction amounts
- SSN, EIN, or tax ID numbers
- Credit scores
- Investment performance or portfolio values
- Loan amounts or interest rates
- Insurance policy numbers or claim amounts

### Safe message patterns:
- "Reminder: your appointment is [date] at [time]."
- "You have a new document in your secure portal. Log in at [URL] to view."
- "Tax deadline reminder: [deadline]. Call us at [phone] if you need assistance."
- "Your quarterly review is coming up. Call [phone] to schedule."

### Regulatory considerations:
- SEC and FINRA have record-keeping requirements for electronic communications
- If the business is a registered investment advisor or broker-dealer, they may need to archive all SMS communications — advise them to implement message logging
- Never include specific investment recommendations or financial advice in SMS
- Never reference specific securities, funds, or investment products

### Tax/accounting specific:
- Deadline reminders are the highest-value message type
- "Reminder: Q1 estimated taxes are due April 15. Contact us if you need help."
- Document request messages should be generic:
  "We need a few documents to complete your return. Check your portal for the list."
- NOT: "Please send your W-2 from [employer] and your 1099-DIV from [brokerage]"`,
} as const;
