export const saas = {
  id: "saas",
  title: "Best Practices — SaaS & Software Product Messaging",
  content: `## Best Practices — SaaS & Software Product Messaging

### Verification/OTP (most common SaaS use case):
- Codes should be 6 digits, clearly formatted
- "Your {app_name} code is: 847293. Expires in 10 minutes."
- Never include a link in OTP messages (phishing risk — carriers may filter)
- Never include the word "password" in OTP messages

### Account notifications:
- Login alerts: "New login to your {app_name} account from [location]. If this wasn't you, secure your account at [URL]."
- Password reset: "Your {app_name} password has been changed. If you didn't do this, contact support immediately."
- Plan changes: Redirect to email or portal — don't include billing details

### Feature adoption (if registered for marketing/mixed):
- Product tips work well: "Pro tip: Did you know you can [feature] in {app_name}? Try it out: [URL]"
- Keep to 1-2 per month maximum — more triggers unsubscribes for SaaS
- Tie to something the user has done: "You just hit 100 [items]! Unlock advanced features: [URL]"

### Outage/incident notifications:
- Be direct and factual
- "{app_name}: We're experiencing issues with [feature]. Our team is on it. Updates at [status page URL]."
- Follow up when resolved: "{app_name}: [Feature] is back up. Sorry for the interruption."
- Incident messages should go to all users, not just opted-in marketing list (if their registration covers this — check use case)

### Onboarding:
- Welcome message after signup (if they opted in during registration):
  "Welcome to {app_name}! Get started: [URL]. Reply HELP anytime."
- Keep the onboarding sequence to 2-3 messages over the first week maximum`,
} as const;
