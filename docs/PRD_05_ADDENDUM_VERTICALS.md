# PRD_05 ADDENDUM: VERTICAL-SPECIFIC AI INSTRUCTIONS
## RelayKit — Industry-Customized Guidance for AI Coding Assistants
### Version 1.0 — Feb 26, 2026

> **Context:** This addendum extends SMS_GUIDELINES.md (PRD_05) with industry-specific 
> modules. When a sensitive or recognized industry is detected during intake, the 
> corresponding module is appended to the customer's SMS_GUIDELINES.md file. The AI 
> coding assistant gets operational knowledge specific to how SMS works in that vertical.

---

## 1. DETECTION AND ASSEMBLY

### How it works
During intake (PRD_01), we detect the customer's industry from two sources:
1. `service_type` field (e.g., "dental", "physical therapy", "tax preparation")
2. `business_description` field (free text, scanned for keywords)

When a vertical is detected, the corresponding module below is appended to SMS_GUIDELINES.md as an additional section. Multiple modules can apply (e.g., a medical spa might trigger both healthcare and appointment-booking guidance).

If no specific vertical is detected, only the base SMS_GUIDELINES.md ships (which is already comprehensive for general use).

### Detection categories

```typescript
interface VerticalDetection {
  vertical: string;
  confidence: 'high' | 'medium'; // high = exact keyword match, medium = fuzzy/contextual
  modules: string[]; // which guideline modules to include
}

const VERTICAL_MAP: Record<string, {
  keywords: RegExp[];
  modules: string[];
}> = {
  dental: {
    keywords: [/\bdent(al|ist|istry)\b/i, /\borthodont/i, /\bendodont/i, /\boral surgery/i],
    modules: ['healthcare', 'appointments_medical'],
  },
  medical_general: {
    keywords: [/\b(doctor|physician|medical|clinic|primary care|family medicine|internal medicine|urgent care)\b/i],
    modules: ['healthcare', 'appointments_medical'],
  },
  mental_health: {
    keywords: [/\b(therap(y|ist)|counsel(or|ing)|psychiatr|psycholog|mental health|behavioral health|social work)\b/i],
    modules: ['healthcare', 'mental_health', 'appointments_medical'],
  },
  physical_therapy: {
    keywords: [/\b(physical therapy|physiotherapy|pt clinic|rehab|rehabilitation|chiropractic|chiropractor)\b/i],
    modules: ['healthcare', 'appointments_medical'],
  },
  veterinary: {
    keywords: [/\b(veterinar|vet clinic|animal hospital|pet hospital)\b/i],
    modules: ['veterinary', 'appointments_general'],
  },
  salon_spa: {
    keywords: [/\b(salon|barber|hair|spa|massage|esthetician|nail|beauty|med.?spa|medspa|wax)\b/i],
    modules: ['appointments_general', 'beauty_wellness'],
  },
  fitness: {
    keywords: [/\b(gym|fitness|personal train|yoga|pilates|crossfit|martial art|boxing|studio|boot.?camp)\b/i],
    modules: ['appointments_general', 'fitness'],
  },
  legal: {
    keywords: [/\b(law firm|attorney|lawyer|legal|paralegal|law office|counsel|litigation)\b/i],
    modules: ['legal'],
  },
  financial: {
    keywords: [/\b(financial advis|investment|wealth management|accounting|tax prep|mortgage|lending|insurance agent|cpa|bookkeep)\b/i],
    modules: ['financial'],
  },
  restaurant: {
    keywords: [/\b(restaurant|cafe|bistro|diner|eatery|bar |pub |grill|pizzeria|bakery|catering|food truck)\b/i],
    modules: ['restaurant'],
  },
  real_estate: {
    keywords: [/\b(real estate|realtor|property management|broker|leasing|apartment|rental|landlord)\b/i],
    modules: ['real_estate'],
  },
  home_services: {
    keywords: [/\b(plumb|electric(al|ian)|hvac|roofing|landscap|cleaning service|maid|handyman|pest control|locksmith|painting|contractor|remodel)\b/i],
    modules: ['home_services', 'appointments_general'],
  },
  automotive: {
    keywords: [/\b(auto repair|mechanic|auto shop|car wash|detailing|tire |body shop|oil change|dealership)\b/i],
    modules: ['automotive', 'appointments_general'],
  },
  ecommerce: {
    keywords: [/\b(ecommerce|e.?commerce|online store|shopify|woocommerce|online shop|drop.?ship|subscription box)\b/i],
    modules: ['ecommerce'],
  },
  saas: {
    keywords: [/\b(saas|software|app|platform|tool|api|dashboard|web app|mobile app)\b/i],
    modules: ['saas'],
  },
  education: {
    keywords: [/\b(tutor|school|academy|learning center|education|teaching|instructor|training center|driving school|music school|dance school)\b/i],
    modules: ['education', 'appointments_general'],
  },
  nonprofit: {
    keywords: [/\b(nonprofit|non.?profit|charity|foundation|501.?c|ministry|church|temple|mosque|synagogue|congregation)\b/i],
    modules: ['nonprofit'],
  },
};
```

---

## 2. VERTICAL MODULES

Each module is a markdown section appended to SMS_GUIDELINES.md. Written *to the AI coding assistant* as operational guidance.

---

### MODULE: healthcare

```markdown
## Industry Rules — Healthcare

This app serves a healthcare business. Federal privacy law (HIPAA) restricts what 
can be communicated via standard SMS. These rules are hard constraints — violating 
them exposes the business to regulatory fines.

### Protected Health Information (PHI) — NEVER include in any message:
- Specific treatments, procedures, or diagnoses
- Medication names or dosages
- Lab results, test outcomes, or imaging references
- Provider names combined with treatment context
- Insurance details, claim numbers, or billing tied to health services
- Any information that connects a specific person to a health condition

### Safe message patterns for healthcare:
- "Your appointment is [date] at [time]" — no procedure mentioned
- "Please arrive 15 minutes early for your visit" — generic
- "We have an update for you. Please call our office at [number]" — redirects to secure channel
- "Your appointment has been rescheduled to [date]" — no reason given
- "It's time to schedule your next visit. Call us at [number]" — no specifics

### Unsafe patterns — BLOCK these if the developer tries to implement them:
- Including procedure names: "your root canal", "your cleaning", "your screening"
- Including provider specialties in context: "Dr. Smith in Psychiatry"
- Sending test/lab results: "your results are ready", "your blood work shows..."
- Referencing medications: "time to refill your [medication]"
- Referencing diagnosis: "regarding your [condition]"

### When the developer asks to include health details in a message:
Explain that standard SMS is not HIPAA-compliant and suggest:
1. Send a generic notification via SMS ("You have a new message from {business_name}")
2. Direct the patient to a secure portal for the actual health information
3. Use the SMS as a prompt to call the office

### Recommended message timing for healthcare:
- Appointment reminders: 24 hours before (not 48 — cancellation rates increase at longer windows)
- No-show follow-up: 1 hour after missed appointment
- Recall reminders (annual checkup, etc.): during business hours only
- Never send health-related messages before 8 AM or after 7 PM
```

---

### MODULE: mental_health

```markdown
## Industry Rules — Mental Health & Behavioral Health

In addition to standard healthcare rules above, mental health services require 
extra sensitivity in messaging.

### Additional restrictions:
- Never reference the type of provider (therapist, counselor, psychiatrist) in messages
- Never mention session type (individual therapy, group therapy, couples counseling)
- Never reference mental health conditions, medications, or treatment approaches
- Be aware that even confirming someone has an appointment at a known mental health 
  practice could be a privacy concern

### Recommended approach:
- Use the most generic language possible
- "Reminder: you have an appointment tomorrow at 3:00 PM"
- Do NOT include the practice name if the practice name itself reveals the nature 
  of services (e.g., "Anxiety & Depression Center" — use a neutral name or initials)
- If the business name reveals the specialty, discuss with the developer whether 
  to use an abbreviated or neutral form in messages

### Two-way messaging caution:
- If building reply functionality, never store inbound message content that might 
  contain mental health disclosures in an unencrypted database
- Route any substantive patient replies to a secure channel immediately
- Automated replies should be generic: "Thank you for your message. Our office 
  will be in touch during business hours."
```

---

### MODULE: appointments_medical

```markdown
## Best Practices — Medical Appointment Messaging

### Optimal reminder timing:
- Primary reminder: 24 hours before appointment
- Optional second reminder: 2 hours before appointment
- Confirmation request: at time of booking
- No-show follow-up: 1-2 hours after missed appointment time

### Confirmation flow pattern:
```
Outbound: "{business_name}: Reminder — your appointment is tomorrow, [date] at [time]. 
Reply C to confirm or R to reschedule."

Inbound "C": "{business_name}: Confirmed! See you tomorrow at [time]. 
Please arrive 15 minutes early."

Inbound "R": "{business_name}: To reschedule, please call us at [phone] 
during business hours."

Inbound other: "{business_name}: Sorry, we didn't understand that. 
Reply C to confirm or R to reschedule your appointment."
```

### No-show handling:
- Send one follow-up message only — do not repeatedly message no-shows
- Tone should be helpful, not punitive
- "We missed you today. Call us at [phone] to reschedule when you're ready."
- Never reference cancellation fees or penalties via SMS

### Recall/recare reminders (annual checkups, cleanings, etc.):
- Send during business hours only (9 AM - 5 PM)
- Limit to one reminder per recall event
- If no response after 1 message, do not follow up via SMS — use other channels
- "Hi! It's been a while since your last visit. Call [phone] to schedule 
  your next appointment with {business_name}."
```

---

### MODULE: appointments_general

```markdown
## Best Practices — Appointment Messaging

### Optimal timing:
- Booking confirmation: immediately after booking
- Reminder: 24 hours before
- Optional day-of reminder: 2 hours before
- Follow-up: 1-2 hours after appointment (for review requests, if registered for this)

### Confirmation/reply patterns:
- Keep reply options simple: C to confirm, R to reschedule
- Always handle unexpected replies gracefully with a fallback message
- Include a phone number for complex requests (rescheduling to specific times 
  can't be handled well via SMS)

### Cancellation messages:
- Confirm cancellation promptly
- Offer to rebook in the same message
- "{business_name}: Your appointment on [date] has been cancelled. 
  To rebook, call us at [phone] or visit [website]."

### Waitlist notifications:
- Time-sensitive — send immediately when spot opens
- Include a deadline: "Reply YES within 30 minutes to claim this spot"
- Handle expiration: if no reply, move to next person on waitlist
```

---

### MODULE: veterinary

```markdown
## Best Practices — Veterinary Practice Messaging

### Unique considerations:
- Include the pet's name when available — it personalizes the message and helps 
  multi-pet owners identify which appointment
- "{business_name}: Reminder — Max's appointment is tomorrow at 10:00 AM."
- Vaccination and preventive care reminders are highly effective via SMS
- Unlike human healthcare, mentioning the type of visit is generally acceptable
  ("Max's annual checkup", "Bella's dental cleaning")

### Recommended message patterns:
- Appointment reminder: "{business_name}: {pet_name}'s appointment is tomorrow 
  at {time}. Reply C to confirm."
- Vaccination due: "{business_name}: {pet_name} is due for vaccinations. 
  Call {phone} to schedule."
- Prescription ready: "{business_name}: {pet_name}'s medication is ready 
  for pickup."
- Post-visit follow-up: "{business_name}: How is {pet_name} doing after 
  the visit? Call us at {phone} if you have concerns."

### Note on terminology:
- Pet health information is NOT subject to HIPAA
- You CAN reference specific treatments, medications, and conditions for animals
- The sensitivity rules from the healthcare module do NOT apply to veterinary practices
```

---

### MODULE: beauty_wellness

```markdown
## Best Practices — Salon, Spa & Beauty Messaging

### Effective message patterns:
- Appointment reminders with service name are fine and helpful
  "{business_name}: Reminder — your haircut with [stylist] is tomorrow at 2 PM."
- Rebooking prompts work well in this vertical
  "{business_name}: It's been 6 weeks since your last color. Ready to rebook? 
  Call {phone} or book at {website}."

### Stylist/provider preferences:
- Include the provider's first name when available — clients book with specific people
- If a provider is out sick, the cancellation message should mention it:
  "Your appointment with [stylist] on [date] needs to be rescheduled. 
  Call us at {phone} for a new time."

### Promotional messaging (if registered for Mixed/Marketing):
- Seasonal promotions perform well: "Summer color special — 20% off highlights 
  this month!"
- Last-minute availability: "Opening today at 3 PM! Book a blowout for $35. 
  Reply BOOK or call {phone}."
- Always include opt-out language on every promotional message

### No-show policy:
- One gentle follow-up is acceptable
- Never mention cancellation fees via text — handle that by phone
```

---

### MODULE: fitness

```markdown
## Best Practices — Gym, Studio & Fitness Messaging

### Class/session reminders:
- Include the class name and instructor: "Yoga with Sarah, tomorrow at 7 AM"
- For limited-capacity classes, include waitlist position if applicable
- Send 2-3 hours before class, not 24 hours (fitness decisions are more spontaneous)

### Membership and billing:
- NEVER include specific dollar amounts or payment details in SMS
- "Your membership is up for renewal. Log in at {website} or call {phone} 
  to review your options."
- NOT: "Your $49.99 monthly payment failed. Update your card..."

### Motivational messaging (if registered for Mixed/Marketing):
- Keep it brief and action-oriented
- "New HIIT class dropping this Saturday at 9 AM. Spots limited — book now!"
- Avoid health claims or weight loss language — carriers flag this
- Never reference specific body measurements, weight, or health outcomes

### Challenge/program messaging:
- Daily check-ins should be opt-in to a specific program, not the general SMS list
- "Day 12 of your 30-day challenge! Today's workout is posted in the app."
- Provide easy opt-out from the challenge without opting out of all messages
  (this requires separate tracking in your app)
```

---

### MODULE: legal

```markdown
## Industry Rules — Legal Services

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
- "{business_name}: Court date reminder — [date] at [time], [courthouse name], 
  Room [number]. Arrive 30 minutes early."
```

---

### MODULE: financial

```markdown
## Industry Rules — Financial Services

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
- If the business is a registered investment advisor or broker-dealer, they may 
  need to archive all SMS communications — advise them to implement message logging
- Never include specific investment recommendations or financial advice in SMS
- Never reference specific securities, funds, or investment products

### Tax/accounting specific:
- Deadline reminders are the highest-value message type
- "Reminder: Q1 estimated taxes are due April 15. Contact us if you need help."
- Document request messages should be generic:
  "We need a few documents to complete your return. Check your portal for the list."
- NOT: "Please send your W-2 from [employer] and your 1099-DIV from [brokerage]"
```

---

### MODULE: restaurant

```markdown
## Best Practices — Restaurant Messaging

### Reservation reminders:
- Send 2-4 hours before reservation (not 24 hours — dining plans change)
- Include party size for confirmation: "Table for 4 tonight at 7:30 PM"
- Simple reply confirmation: "Reply C to confirm or X to cancel"

### Waitlist:
- Time-sensitivity is everything — send immediately when table is ready
- Include a deadline: "Your table is ready! Please arrive within 15 minutes."
- Follow up once if no response after 5 minutes:
  "Still joining us? Your table will be released in 10 minutes if we don't hear back."
- After release: "We've given your table to the next guest. Reply YES to rejoin 
  the waitlist."

### Order notifications (if applicable):
- Pickup orders: "Your order is ready for pickup!"
- Delivery: "Your order is on its way! Estimated arrival: [time]"
- Include order number if relevant

### Promotional messaging (if registered):
- Daily specials work well: "Tonight's special: Pan-seared salmon, $22. 
  Reserve your table at {website}."
- Keep it short and appetizing — one dish or one offer per message
- Lunch promotions should go out by 10:30 AM
- Dinner promotions should go out by 3:00 PM
- Never send food promotions after 8 PM

### Feedback:
- If registered for feedback/review requests:
  "Thanks for dining with us tonight! How was your experience? Reply 1-5."
- Send within 1 hour of estimated dining completion
- One follow-up maximum if no response — don't nag
```

---

### MODULE: real_estate

```markdown
## Best Practices — Real Estate Messaging

### Showing/viewing reminders:
- Include property address (this helps buyers with multiple viewings)
- "{business_name}: Showing reminder — [address] tomorrow at [time]. 
  Reply C to confirm."

### New listing alerts (if registered for marketing/mixed):
- Personalization is key — match to buyer's stated preferences if possible
- "New listing in [neighborhood]: [beds]bd/[baths]ba, $[price]. 
  Photos at [URL]. Reply for details."
- Limit to 2-3 listing alerts per week maximum — more triggers unsubscribes

### Open house reminders:
- Send morning-of: "Open house today! [address], [time range]. See you there."

### Transaction updates:
- Keep milestone updates brief
- "Great news — your offer on [address] was accepted! Let's discuss next steps. 
  Call me at [phone]."
- For sensitive financial details (inspection results, appraisal values, 
  negotiation terms), redirect to phone or email

### Lead follow-up:
- Website inquiry follow-up should be within 5 minutes
- "{business_name}: Thanks for your interest in [address/neighborhood]. 
  I'm [agent name]. Call me at [phone] or reply to set up a showing."
- If no response after 2 follow-ups, stop. Do not continue texting cold leads.
```

---

### MODULE: home_services

```markdown
## Best Practices — Home Services Messaging

### Appointment/service window:
- Home services often have windows, not exact times
- "Your [service type] appointment is tomorrow between [start] and [end]. 
  Our tech will text you when they're 30 minutes away."
- Day-of "on the way" message is high value:
  "[tech name] is heading to your location. ETA: approximately [time]."

### Job completion:
- Follow up after service completion
- "Your [service] is complete! If you have any questions, call [phone]."
- Invoice should NOT be sent via SMS — redirect to email or portal

### Quote follow-up:
- If registered for follow-up messaging:
  "Following up on the [service] quote we sent on [date]. 
  Ready to schedule? Reply YES or call [phone]."
- One follow-up only. Don't chase.

### Emergency/urgent service:
- Emergency dispatch confirmation is high-priority
- "Emergency [service] confirmed. [tech name] is on the way. ETA: [time]. 
  Call [phone] if you need to reach us."
- Keep the customer updated if ETA changes

### Seasonal reminders (if registered for marketing/mixed):
- "Time for your annual [service] checkup! Schedule at [website] or call [phone]."
- Time these appropriately (HVAC maintenance before summer/winter, 
  gutter cleaning in fall, etc.)
```

---

### MODULE: ecommerce

```markdown
## Best Practices — E-Commerce Messaging

### Order lifecycle:
- Confirmation: immediately after purchase
  "Order confirmed! #{order_number}. We'll text you when it ships."
- Shipped: when tracking is available
  "{business_name}: Your order has shipped! Track at [URL]"
- Delivered: on delivery confirmation
  "{business_name}: Your order was delivered! Questions? Reply to this text."
- Delivery issue: proactive notification
  "{business_name}: Delivery update — your package has been delayed. 
  New estimated delivery: [date]. Track at [URL]."

### Cart abandonment (if registered for marketing):
- Send within 1-2 hours of abandonment
- One reminder only — never send multiple cart reminders
- "{business_name}: You left something in your cart! Complete your order: [URL]. 
  Reply STOP to opt out."
- NEVER include the specific item names or prices — just drive them to the cart

### Promotional messaging:
- Keep offers simple: one CTA per message
- Include a direct link to the offer
- Flash sales create urgency: "24-hour flash sale! 30% off everything. Shop now: [URL]"
- Back-in-stock alerts (if subscribers opted in specifically):
  "The [product category] you wanted is back! Shop now: [URL]"

### Shipping delay communication:
- Be proactive — tell them before they ask
- Be honest about timelines
- Offer a solution or compensation when possible
```

---

### MODULE: saas

```markdown
## Best Practices — SaaS & Software Product Messaging

### Verification/OTP (most common SaaS use case):
- Codes should be 6 digits, clearly formatted
- "Your {app_name} code is: 847293. Expires in 10 minutes."
- Never include a link in OTP messages (phishing risk — carriers may filter)
- Never include the word "password" in OTP messages

### Account notifications:
- Login alerts: "New login to your {app_name} account from [location]. 
  If this wasn't you, secure your account at [URL]."
- Password reset: "Your {app_name} password has been changed. 
  If you didn't do this, contact support immediately."
- Plan changes: Redirect to email or portal — don't include billing details

### Feature adoption (if registered for marketing/mixed):
- Product tips work well: "Pro tip: Did you know you can [feature] in {app_name}? 
  Try it out: [URL]"
- Keep to 1-2 per month maximum — more triggers unsubscribes for SaaS
- Tie to something the user has done: "You just hit 100 [items]! 
  Unlock advanced features: [URL]"

### Outage/incident notifications:
- Be direct and factual
- "{app_name}: We're experiencing issues with [feature]. Our team is on it. 
  Updates at [status page URL]."
- Follow up when resolved: "{app_name}: [Feature] is back up. 
  Sorry for the interruption."
- Incident messages should go to all users, not just opted-in marketing list
  (if their registration covers this — check use case)

### Onboarding:
- Welcome message after signup (if they opted in during registration):
  "Welcome to {app_name}! Get started: [URL]. Reply HELP anytime."
- Keep the onboarding sequence to 2-3 messages over the first week maximum
```

---

### MODULE: education

```markdown
## Best Practices — Education & Tutoring Messaging

### Class/session reminders:
- Include what to bring or prepare if relevant
- "{business_name}: Reminder — [student name]'s [class] is tomorrow at [time]. 
  Please bring [materials]."
- For minor students, messages go to parents — always address the parent

### Schedule changes:
- Proactive communication for cancellations
- "{business_name}: [Class] on [date] has been cancelled due to [reason]. 
  Makeup class is scheduled for [date]."

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
- The opt-in consent must come from the parent/guardian, not the student
```

---

### MODULE: nonprofit

```markdown
## Best Practices — Nonprofit & Community Organization Messaging

### Event announcements:
- "{business_name}: [Event name] is this Saturday at [time]! [Location]. 
  RSVP: reply YES. Details: [URL]"
- Include clear logistics — these audiences need to plan around volunteering

### Donation/fundraising (if registered for marketing/mixed):
- Carriers heavily scrutinize fundraising messages — keep them straightforward
- "{business_name}: Help us reach our goal! Donate today: [URL]. 
  Every dollar counts. Reply STOP to opt out."
- NEVER create false urgency ("LAST CHANCE" is a spam signal)
- NEVER imply matching funds or third-party contributions unless verifiable
- Always include opt-out language on every fundraising message
- Limit fundraising texts to 2-3 per month maximum

### Volunteer coordination:
- Shift reminders and schedule updates are the highest-value messages
- "{business_name}: Volunteer reminder — [event] tomorrow at [time]. 
  [Location]. Reply C to confirm."
- Last-minute needs: "We need 3 more volunteers for tomorrow's [event]. 
  Can you help? Reply YES."

### Advocacy/awareness (use with caution):
- Do NOT send political messaging unless registered for Political special use case
- General awareness is fine: "March is [Awareness Month]. Learn more at [URL]."
- NEVER ask recipients to contact elected officials via SMS — this triggers 
  political messaging flags
```

---

## 3. ASSEMBLY LOGIC

```typescript
interface VerticalModule {
  id: string;
  title: string;
  content: string; // The markdown content from above
}

function assembleGuidelines(
  baseGuidelines: string,     // SMS_GUIDELINES.md template
  detectedVerticals: VerticalDetection[]
): string {
  // Deduplicate modules across detected verticals
  const moduleIds = new Set<string>();
  for (const v of detectedVerticals) {
    for (const m of v.modules) {
      moduleIds.add(m);
    }
  }
  
  // Order modules: industry rules first, then best practices
  const RULE_MODULES = ['healthcare', 'mental_health', 'legal', 'financial'];
  const orderedModules = [...moduleIds].sort((a, b) => {
    const aIsRule = RULE_MODULES.includes(a) ? 0 : 1;
    const bIsRule = RULE_MODULES.includes(b) ? 0 : 1;
    return aIsRule - bIsRule;
  });
  
  // Append each module to the base guidelines
  let assembled = baseGuidelines;
  
  for (const moduleId of orderedModules) {
    const module = VERTICAL_MODULES[moduleId];
    assembled += '\n\n---\n\n' + module.content;
  }
  
  assembled += `\n\n---\n\n*Vertical-specific guidance generated by RelayKit based on ` +
    `detected industry: ${detectedVerticals.map(v => v.vertical).join(', ')}. ` +
    `These guidelines supplement the base compliance rules above.*`;
  
  return assembled;
}
```

---

## 4. IMPLEMENTATION NOTES

### File structure additions
```
lib/
  deliverable/
    verticals/
      index.ts              # Detection logic and assembly
      modules/
        healthcare.ts       # Healthcare module content
        mental-health.ts    # Mental health additional rules
        appointments-medical.ts
        appointments-general.ts
        veterinary.ts
        beauty-wellness.ts
        fitness.ts
        legal.ts
        financial.ts
        restaurant.ts
        real-estate.ts
        home-services.ts
        ecommerce.ts
        saas.ts
        education.ts
        nonprofit.ts
```

### Testing
Each vertical module should be tested by:
1. Generating a complete SMS_GUIDELINES.md with the module appended
2. Feeding it to Claude as context alongside a set of test prompts
3. Verifying the AI correctly applies the industry-specific rules
4. Example test: "Add a feature to send prescription refill reminders" with healthcare 
   module → AI should refuse and explain PHI concerns

### Iteration
These modules will be refined based on:
- Rejection patterns from specific industries (via PRD_02's template_submissions tracking)
- Customer feedback about guidelines that were too restrictive or not restrictive enough
- New carrier regulations or industry-specific compliance changes
- Real-world edge cases discovered through compliance monitoring (PRD_08)

### Future modules to add based on customer demand:
- Insurance agencies
- Property management (distinct from real estate)
- Construction/general contracting
- Event venues and wedding industry
- Pet services (grooming, boarding, walking)
- Transportation/logistics
- Travel and hospitality
