export const realEstate = {
  id: "real_estate",
  title: "Best Practices — Real Estate Messaging",
  content: `## Best Practices — Real Estate Messaging

### Showing/viewing reminders:
- Include property address (this helps buyers with multiple viewings)
- "{business_name}: Showing reminder — [address] tomorrow at [time]. Reply C to confirm."

### New listing alerts (if registered for marketing/mixed):
- Personalization is key — match to buyer's stated preferences if possible
- "New listing in [neighborhood]: [beds]bd/[baths]ba, $[price]. Photos at [URL]. Reply for details."
- Limit to 2-3 listing alerts per week maximum — more triggers unsubscribes

### Open house reminders:
- Send morning-of: "Open house today! [address], [time range]. See you there."

### Transaction updates:
- Keep milestone updates brief
- "Great news — your offer on [address] was accepted! Let's discuss next steps. Call me at [phone]."
- For sensitive financial details (inspection results, appraisal values, negotiation terms), redirect to phone or email

### Lead follow-up:
- Website inquiry follow-up should be within 5 minutes
- "{business_name}: Thanks for your interest in [address/neighborhood]. I'm [agent name]. Call me at [phone] or reply to set up a showing."
- If no response after 2 follow-ups, stop. Do not continue texting cold leads.`,
} as const;
