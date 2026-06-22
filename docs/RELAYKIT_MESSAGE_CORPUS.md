# RelayKit Message Corpus

Source of truth: `marketing-site/lib/message-library/` — one file per category.
**If CC changes any message name or body, update this file in the same commit.**

Variables appear as `{{variable_name}}`. All messages are single GSM-7 segment (≤160 chars after worst-case substitution). All transactional categories include "Reply STOP to opt out." (Brief: "STOP to opt out.") except Verification (2FA carve-out — no STOP/HELP in body).

---

## Account events
`id: account-events` · TCR: ACCOUNT_NOTIFICATION
Billing, security, and lifecycle alerts — the churn-critical messages that get missed in email.
Sender frame: `{{workspace_name}}` in every body.

### Payment failed
Sent when a customer's card is declined.
- **Standard:** `{{workspace_name}}: Card ending {{card_last4}} was declined. Update payment to keep your account active: {{account_link}} Reply STOP to opt out.`
- **Friendly:** `Your {{workspace_name}} payment didn't go through (card ending {{card_last4}}). Update it here to stay active: {{account_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: Card {{card_last4}} declined. Update payment: {{account_link}} STOP to opt out.`

### Trial ending
Sent a few days before a trial ends.
- **Standard:** `{{workspace_name}}: Your trial ends in {{days_remaining}} days. Choose a plan to keep your account: {{account_link}} Reply STOP to opt out.`
- **Friendly:** `Your {{workspace_name}} trial ends in {{days_remaining}} days. Pick a plan here to keep going: {{account_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: Trial ends in {{days_remaining}} days. Choose a plan: {{account_link}} STOP to opt out.`

### Subscription confirmed
Sent when a renewal, plan change, or cancellation goes through.
- **Standard:** `{{workspace_name}}: Your subscription change is confirmed. View the details in your account: {{account_link}} Reply STOP to opt out.`
- **Friendly:** `Your {{workspace_name}} subscription is all set. See the details here whenever you like: {{account_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: Subscription updated. Details: {{account_link}} STOP to opt out.`

### New device sign-in
Sent when an account is accessed from a new device.
- **Standard:** `{{workspace_name}}: New sign-in from {{device_context}}. Not you? Secure your account: {{account_link}} Reply STOP to opt out.`
- **Friendly:** `Your {{workspace_name}} account was just accessed from {{device_context}}. Not you? Secure it: {{account_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: New sign-in, {{device_context}}. Not you? {{account_link}} STOP to opt out.`

### Account suspended
Sent when an account is suspended.
- **Standard:** `{{workspace_name}}: Your account has been suspended. Review the details and next steps here: {{account_link}} Reply STOP to opt out.`
- **Friendly:** `Your {{workspace_name}} account has been suspended. Here's what happened and what to do next: {{account_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: Account suspended. Details and next steps: {{account_link}} STOP to opt out.`

### Payment due reminder
Sent proactively before a payment is due.
- **Standard:** `{{workspace_name}}: {{amount_due}} is due {{due_date}}. Pay or review: {{account_link}} Reply STOP to opt out.`
- **Friendly:** `Heads up from {{workspace_name}}: {{amount_due}} is due {{due_date}}. Pay here: {{account_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: {{amount_due}} due {{due_date}}. {{account_link}} STOP to opt out.`

### Payment received
Sent when a payment or donation is successfully received.
- **Standard:** `{{workspace_name}}: Payment of {{amount_paid}} received. Thank you. Receipt: {{account_link}} Reply STOP to opt out.`
- **Friendly:** `Thanks! {{workspace_name}} received your {{amount_paid}} payment. Receipt: {{account_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: {{amount_paid}} received. Receipt: {{account_link}} STOP to opt out.`

### Invoice ready
Sent when a new invoice is issued and ready to view and pay.
- **Standard:** `{{workspace_name}}: Invoice {{invoice_number}} for {{amount_due}} is ready. View and pay: {{account_link}} Reply STOP to opt out.`
- **Friendly:** `Your {{workspace_name}} invoice {{invoice_number}} ({{amount_due}}) is ready. Pay here: {{account_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: Invoice {{invoice_number}}, {{amount_due}}. {{account_link}} STOP to opt out.`

### Payment past due
Sent when a payment has not been received after the due date. Factual only — no threats, no fee-escalation language.
- **Standard:** `{{workspace_name}}: {{amount_due}} is now past due. Pay or review your balance: {{account_link}} Reply STOP to opt out.`
- **Friendly:** `{{workspace_name}}: your balance of {{amount_due}} is past due. You can take care of it here: {{account_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: {{amount_due}} past due. Pay: {{account_link}} STOP to opt out.`

### Deadline reminder
Sent when a non-payment action window (filing, registration, enrollment, signing) is approaching its close.
- **Standard:** `{{workspace_name}}: {{deadline_item}} closes {{due_date}}. Take action here: {{account_link}} Reply STOP to opt out.`
- **Friendly:** `{{workspace_name}}: heads up - {{deadline_item}} closes {{due_date}}. Don't miss it: {{account_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: {{deadline_item}} closes {{due_date}}. {{account_link}} STOP to opt out.`

### Status update
Sent when an application, case, return, or project status changes.
- **Standard:** `{{workspace_name}}: There's an update on your {{item_label}}. View the details: {{account_link}} Reply STOP to opt out.`
- **Friendly:** `{{workspace_name}}: your {{item_label}} just moved forward - take a look: {{account_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: {{item_label}} updated. Details: {{account_link}} STOP to opt out.`

### New message waiting
Sent when a new message is waiting in a secure inbox or client portal.
- **Standard:** `{{workspace_name}}: You have a new message. Read and reply here: {{account_link}} Reply STOP to opt out.`
- **Friendly:** `{{workspace_name}}: you've got a new message waiting. Read it here: {{account_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: New message. {{account_link}} STOP to opt out.`

### Payout sent
Sent when an earned payout, withdrawal, or transfer leaves the platform.
- **Standard:** `{{workspace_name}}: Your {{amount}} is on its way to your {{destination}}. Details: {{account_link}} Reply STOP to opt out.`
- **Friendly:** `{{workspace_name}}: {{amount}} is on the way to your {{destination}}. Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: {{amount}} sent to your {{destination}}. STOP to opt out.`

### Payout failed
Sent when an outbound payout or transfer cannot be completed.
- **Standard:** `{{workspace_name}}: We couldn't send your payout. Check your details: {{account_link}} Reply STOP to opt out.`
- **Friendly:** `{{workspace_name}}: your payout didn't go through. Update your details here: {{account_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: Payout failed. Fix details: {{account_link}} STOP to opt out.`

### Balance low
Sent when a prepaid balance, credit pack, or usage quota is running low.
- **Standard:** `{{workspace_name}}: Your balance is running low. Top up to stay active: {{account_link}} Reply STOP to opt out.`
- **Friendly:** `Heads up from {{workspace_name}} - your balance is getting low. Top up here: {{account_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: Balance low. Top up: {{account_link}} STOP to opt out.`

### Streak ending
Sent when a gamified streak is about to break.
- **Standard:** `{{workspace_name}}: your {{streak_count}} streak ends soon. Keep it going: {{action_link}} Reply STOP to opt out.`
- **Friendly:** `{{workspace_name}}: don't lose your {{streak_count}} streak - one quick check-in keeps it alive: {{action_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: {{streak_count}} streak ends soon. {{action_link}} STOP to opt out.`

### Recurring reminder
Sent on a recurring schedule to prompt a habit, routine, or daily action.
- **Standard:** `{{workspace_name}}: time for {{habit_name}}. Mark it done: {{action_link}} Reply STOP to opt out.`
- **Friendly:** `{{workspace_name}} nudge: {{habit_name}} is due today. Knock it out: {{action_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: {{habit_name}} due. {{action_link}} STOP to opt out.`

---

## Appointments
`id: appointments` · TCR: ACCOUNT_NOTIFICATION
Confirmations, reminders, reschedules, cancellations, no-show follow-ups.
Sender frame: `{{workspace_name}}` in every body.

### Confirmation
Sent when a booking is confirmed. `{{provider_name}}` is optional — for venue bookings, reservations, and date-range stays with no named provider, omit it and the confirmation reads as a booking with the workspace itself.
- **Standard:** `{{workspace_name}}: your appointment with {{provider_name}} is confirmed for {{appointment_time}}. Reply STOP to opt out.`
- **Friendly:** `You're booked! {{provider_name}} will see you {{appointment_time}}. We'll send a reminder. Reply STOP to opt out. - {{workspace_name}}`
- **Brief:** `{{workspace_name}}: confirmed with {{provider_name}}, {{appointment_time}}. STOP to opt out.`

### Reminder - distant
Sent the day before the appointment.
- **Standard:** `{{workspace_name}}: reminder - your appointment is tomorrow, {{appointment_time}}. Cancel: {{cancel_link}} Reply STOP to opt out.`
- **Friendly:** `See you tomorrow! {{provider_name}} at {{appointment_time}}. Change or cancel: {{reschedule_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: tomorrow with {{provider_name}}, {{appointment_time}}. STOP to opt out.`

### Reminder - proximate
Sent about an hour before the appointment.
- **Standard:** `{{workspace_name}}: your appointment is in 1 hour, {{appointment_time}}. Cancel: {{cancel_link}} Reply STOP to opt out.`
- **Friendly:** `Almost time - {{provider_name}} sees you in about an hour, {{appointment_time}}. Reply STOP to opt out. - {{workspace_name}}`
- **Brief:** `{{workspace_name}}: in 1 hour - {{provider_name}}, {{appointment_time}}. STOP to opt out.`

### Reschedule confirmation
Sent when an appointment is rescheduled.
- **Standard:** `{{workspace_name}}: your appointment is rescheduled to {{appointment_time}} with {{provider_name}}. Reply STOP to opt out.`
- **Friendly:** `Got it - you're now set for {{appointment_time}} with {{provider_name}}. See you then! Reply STOP to opt out. - {{workspace_name}}`
- **Brief:** `{{workspace_name}}: moved to {{appointment_time}}, {{provider_name}}. STOP to opt out.`

### Cancellation confirmation
Sent when an appointment is cancelled.
- **Standard:** `{{workspace_name}}: your appointment with {{provider_name}} is cancelled. Rebook anytime: {{reschedule_link}} Reply STOP to opt out.`
- **Friendly:** `Your appointment is cancelled - no problem. Want to rebook? {{reschedule_link}} Reply STOP to opt out. - {{workspace_name}}`
- **Brief:** `{{workspace_name}}: cancelled. Rebook: {{reschedule_link}} STOP to opt out.`

### No-show follow-up
Sent after a missed appointment.
- **Standard:** `{{workspace_name}}: we missed you today. Want to rebook with {{provider_name}}? {{reschedule_link}} Reply STOP to opt out.`
- **Friendly:** `Sorry we missed you! Happy to find a new time - rebook here: {{reschedule_link}} Reply STOP to opt out. - {{workspace_name}}`
- **Brief:** `{{workspace_name}}: missed you. Rebook: {{reschedule_link}} STOP to opt out.`

### Post-appointment
Sent after the appointment to collect feedback.
- **Standard:** `{{workspace_name}}: thanks for seeing {{provider_name}} today. We'd love your feedback: {{feedback_link}} Reply STOP to opt out.`
- **Friendly:** `Thanks for coming in today! How did it go with {{provider_name}}? Tell us: {{feedback_link}} Reply STOP to opt out. - {{workspace_name}}`
- **Brief:** `{{workspace_name}}: thanks for visiting. Feedback: {{feedback_link}} STOP to opt out.`

### On the way
Sent when a mobile provider, technician, or driver is en route to the customer.
- **Standard:** `{{workspace_name}}: {{provider_name}} is on the way, ETA about {{eta}}. Reply STOP to opt out.`
- **Friendly:** `Heads up - {{provider_name}} is headed your way, ETA about {{eta}}. Reply STOP to opt out. - {{workspace_name}}`
- **Brief:** `{{workspace_name}}: {{provider_name}} on the way, ETA {{eta}}. STOP to opt out.`

### Service complete
Sent when an on-site job or service visit is finished.
- **Standard:** `{{workspace_name}}: your service is complete. Details: {{feedback_link}} Reply STOP to opt out.`
- **Friendly:** `All done! Your {{workspace_name}} service is complete. Tell us how it went: {{feedback_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: service complete. {{feedback_link}} STOP to opt out.`

### Time to rebook
Sent when a recurring service is due and no appointment has been booked yet.
- **Standard:** `{{workspace_name}}: Your next visit is due. Pick a time: {{reschedule_link}} Reply STOP to opt out.`
- **Friendly:** `Time for your next {{workspace_name}} visit. Grab a slot here: {{reschedule_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: Next visit due. Book: {{reschedule_link}} STOP to opt out.`

### Pre-visit form request
Sent ahead of an appointment when intake, consent, or check-in forms need to be completed.
- **Standard:** `{{workspace_name}}: please complete your forms before your visit {{appointment_time}}: {{form_link}} Reply STOP to opt out.`
- **Friendly:** `Before we see you {{appointment_time}}, please fill out your forms here: {{form_link}} Reply STOP to opt out. - {{workspace_name}}`
- **Brief:** `{{workspace_name}}: complete your forms before {{appointment_time}}: {{form_link}} STOP to opt out.`

---

## Community
`id: community` · TCR: ACCOUNT_NOTIFICATION
Event reminders, community updates, milestones, and member onboarding.
Sender frame: `{{community_name}}` (the community's own name, not workspace_name).

### Live event reminder
Sent shortly before a live community event begins.
- **Standard:** `{{community_name}}: {{event_name}} starts {{event_time}}. Join: {{join_link}} Reply STOP to opt out.`
- **Friendly:** `Your {{community_name}} community has {{event_name}} starting {{event_time}}: {{join_link}} Reply STOP to opt out.`
- **Brief:** `{{community_name}}: {{event_name}} {{event_time}}. {{join_link}} STOP to opt out.`

### Event invitation
Sent when a new community event is posted.
- **Standard:** `{{community_name}}: new event - {{event_name}} on {{event_time}}. RSVP: {{rsvp_link}} Reply STOP to opt out.`
- **Friendly:** `Your {{community_name}} has a new event - {{event_name}}, {{event_time}}. RSVP: {{rsvp_link}} Reply STOP to opt out.`
- **Brief:** `{{community_name}} event: {{event_name}}, {{event_time}}. RSVP: {{rsvp_link}} STOP to opt out.`

### Moderation update
Sent when the community needs member attention.
- **Standard:** `{{community_name}}: an important update for the community. Details here: {{update_link}} Reply STOP to opt out.`
- **Friendly:** `Your {{community_name}} community has an update that needs your attention: {{update_link}} Reply STOP to opt out.`
- **Brief:** `{{community_name}}: important community update. {{update_link}} STOP to opt out.`

### Member milestone
Sent when a member reaches a community milestone.
- **Standard:** `{{community_name}}: you've reached {{milestone}} in the community. Thanks for being here. Reply STOP to opt out.`
- **Friendly:** `Your time in {{community_name}} just hit a milestone - {{milestone}}. Glad you're part of it. Reply STOP to opt out.`
- **Brief:** `{{community_name}}: {{milestone}} reached. Thanks for being here. STOP to opt out.`

### Community announcement
Sent when there's community news to share.
- **Standard:** `{{community_name}}: there's something new in the community. Take a look: {{announcement_link}} Reply STOP to opt out.`
- **Friendly:** `Your {{community_name}} community has something new to share: {{announcement_link}} Reply STOP to opt out.`
- **Brief:** `{{community_name}}: something new in the community. {{announcement_link}} STOP to opt out.`

### Welcome
Sent immediately when a member joins. (Onboarding step 1 of 4)
- **Standard:** `{{community_name}}: you're in. Welcome to the community - glad to have you here. Reply STOP to opt out.`
- **Friendly:** `Welcome to your new community, {{community_name}}. We're really glad you joined. Reply STOP to opt out.`
- **Brief:** `Welcome to {{community_name}}. Glad you're here. STOP to opt out.`

### First action
Sent 24-48h after a member joins. (Onboarding step 2 of 4)
- **Standard:** `{{community_name}}: settling in? A good first step is to introduce yourself in the intros channel. Reply STOP to opt out.`
- **Friendly:** `Your {{community_name}} community is waiting - introduce yourself in the intros channel. Reply STOP to opt out.`
- **Brief:** `{{community_name}}: introduce yourself in the intros channel when you get a chance. STOP to opt out.`

### Resource pointer
Sent 3-5 days after a member joins. (Onboarding step 3 of 4)
- **Standard:** `{{community_name}}: here's the orientation guide to help you find your way around: {{resource_link}} Reply STOP to opt out.`
- **Friendly:** `Still finding your way around {{community_name}}? The orientation guide helps: {{resource_link}} Reply STOP to opt out.`
- **Brief:** `{{community_name}}: your orientation guide is here. {{resource_link}} STOP to opt out.`

### Week 1 check-in
Sent 7 days after a member joins. (Onboarding step 4 of 4)
- **Standard:** `{{community_name}}: you've been part of the community for a week now. How's it going so far? Reply STOP to opt out.`
- **Friendly:** `Your first week in {{community_name}} is done - how's it going so far? Reply STOP to opt out.`
- **Brief:** `{{community_name}}: one week in. How's it going? STOP to opt out.`

---

## Customer support
`id: customer-support` · TCR: CUSTOMER_CARE
Ticket updates, resolution notices, satisfaction follow-ups.
Sender frame: `{{workspace_name}}` in every body.

### Ticket received
Sent when a support request is logged. (Ticket lifecycle step 1 of 5)
- **Standard:** `{{workspace_name}} support: ticket {{ticket_number}} received. We'll reply soon. Reply STOP to opt out.`
- **Friendly:** `Got your message - {{workspace_name}} support is on it. Ticket {{ticket_number}}. We'll be in touch soon. Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: ticket {{ticket_number}} received. Reply soon. STOP to opt out.`

### Agent assigned
Sent when a ticket is routed to a specific agent. (Ticket lifecycle step 2 of 5)
- **Standard:** `{{workspace_name}} support: {{agent_name}} is handling ticket {{ticket_number}}. Reply STOP to opt out.`
- **Friendly:** `Good news - {{agent_name}} has picked up your ticket {{ticket_number}} at {{workspace_name}}. Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: {{agent_name}} has ticket {{ticket_number}}. STOP to opt out.`

### Agent response
Sent when an agent replies to the ticket. (Ticket lifecycle step 3 of 5)
- **Standard:** `{{workspace_name}} support: ticket {{ticket_number}} has a reply. View: {{ticket_link}} Reply STOP to opt out.`
- **Friendly:** `Your ticket {{ticket_number}} got a reply from {{workspace_name}} support. Read it here: {{ticket_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: reply on {{ticket_number}}. {{ticket_link}} STOP to opt out.`

### Resolution notification
Sent when a ticket is marked resolved or closed. (Ticket lifecycle step 4 of 5)
- **Standard:** `{{workspace_name}} support: ticket {{ticket_number}} is resolved. Still need help? {{ticket_link}} Reply STOP to opt out.`
- **Friendly:** `Ticket {{ticket_number}} is resolved. Still off? Reopen here: {{ticket_link}} Thanks for your patience - {{workspace_name}}. Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: {{ticket_number}} resolved. Reopen: {{ticket_link}} STOP to opt out.`

### CSAT follow-up
Sent after ticket resolution to collect a rating. (Ticket lifecycle step 5 of 5)
- **Standard:** `{{workspace_name}} support: how did we do on ticket {{ticket_number}}? Rate here: {{csat_link}} Reply STOP to opt out.`
- **Friendly:** `How did {{workspace_name}} support do on ticket {{ticket_number}}? Rate us here: {{csat_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: rate ticket {{ticket_number}}? {{csat_link}} STOP to opt out.`

### Proactive outreach
Sent when the developer's system detects user friction.
- **Standard:** `{{workspace_name}} support: looks like you hit a snag. Want a hand? Reply here and we'll help. Reply STOP to opt out.`
- **Friendly:** `Hi {{customer_name}}, we noticed you got stuck. {{workspace_name}} support is happy to help - just reply. Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: stuck on something? Reply and we'll help. STOP to opt out.`

### Service status alert
Sent to affected users during a service issue.
- **Standard:** `{{workspace_name}}: we're aware of a service issue and working on it. ETA {{eta}}. Updates to follow. Reply STOP to opt out.`
- **Friendly:** `Heads up - {{workspace_name}} has a service issue, and we're on it. ETA {{eta}}. We'll tell you when it clears. Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: service issue, working on it. ETA {{eta}}. STOP to opt out.`

### Account issue resolved
Sent when an account issue is found and resolved.
- **Standard:** `{{workspace_name}}: we found and fixed an issue on your account. No action needed. Questions? Reply here. Reply STOP to opt out.`
- **Friendly:** `{{workspace_name}}: we found an issue on your account and fixed it. Nothing for you to do. Questions? Reply here. Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: account issue fixed. No action needed. STOP to opt out.`

### Request received
Sent to acknowledge an inbound inquiry, lead, or application before a ticket number is assigned.
- **Standard:** `{{workspace_name}}: We got your request and will reach out shortly. Reply STOP to opt out.`
- **Friendly:** `Thanks for reaching out to {{workspace_name}} - we got it and will be in touch soon. Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: request received, we'll be in touch. STOP to opt out.`

---

## Documents
`id: documents` · TCR: ACCOUNT_NOTIFICATION
Document requests, signature workflows, and deliverable-ready notices — the paperwork lifecycle from request to completion.
Sender frame: `{{workspace_name}}` in every body.

### Document needed
Sent when the recipient needs to supply a document to continue.
- **Standard:** `{{workspace_name}}: We need a document from you to continue. Upload it here: {{account_link}} Reply STOP to opt out.`
- **Friendly:** `{{workspace_name}}: One thing left - we need a document from you. Upload it here: {{account_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: Document needed. Upload: {{account_link}} STOP to opt out.`

### Signature requested
Sent when a document is ready for the recipient's e-signature.
- **Standard:** `{{workspace_name}}: A document is ready for your signature. Review and sign: {{account_link}} Reply STOP to opt out.`
- **Friendly:** `{{workspace_name}}: you have a document ready to sign - it only takes a minute: {{account_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: Document ready to sign: {{account_link}} STOP to opt out.`

### Signature reminder
Sent when a document is still unsigned after the initial request.
- **Standard:** `{{workspace_name}}: A document is still waiting for your signature. Sign here: {{account_link}} Reply STOP to opt out.`
- **Friendly:** `{{workspace_name}}: just a reminder, a document still needs your signature. It only takes a minute: {{account_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: Document still needs signing: {{account_link}} STOP to opt out.`

### Signature received
Sent when all required signatures are in and the document is executed.
- **Standard:** `{{workspace_name}}: We received your signed document. Nothing more needed for now. Reply STOP to opt out.`
- **Friendly:** `{{workspace_name}}: got it - your document is signed and in. Thanks! Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: Signed document received. STOP to opt out.`

### Documents received
Sent when the recipient's submitted documents have been received and logged.
- **Standard:** `{{workspace_name}}: Your documents have been received. We'll be in touch with next steps. Reply STOP to opt out.`
- **Friendly:** `{{workspace_name}}: got your documents - we'll review them and reach out soon. Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: Documents received. Next steps coming. STOP to opt out.`

### Item ready
Sent when a digital deliverable (document, file, plan, ticket) is generated and ready to access.
- **Standard:** `{{workspace_name}}: Your {{item_label}} is ready. Access it here: {{action_link}} Reply STOP to opt out.`
- **Friendly:** `Your {{workspace_name}} {{item_label}} is ready: {{action_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: {{item_label}} ready: {{action_link}} STOP to opt out.`

---

## Marketing
`id: marketing` · TCR: MARKETING
Promotional offers, product launches, re-engagement, and event invitations.
**Only category that carries promotional content.** Requires separate explicit marketing consent. EIN-gated. SHAFT-C prohibited.
Sender frame: `{{business_name}}` in every body.

### Promotional offer
Sent when a promotional offer or sale window opens.
- **Standard:** `{{business_name}}: {{offer}}. Claim it here: {{offer_link}} Reply STOP to opt out.`
- **Friendly:** `Your {{business_name}} offer: {{offer}}. Grab it here: {{offer_link}} Reply STOP to opt out.`
- **Brief:** `{{business_name}}: {{offer}}. {{offer_link}} STOP to opt out.`

### Product launch
Sent when a new product or feature goes live.
- **Standard:** `{{business_name}}: {{launch_name}} is live. Take a look: {{launch_link}} Reply STOP to opt out.`
- **Friendly:** `Your {{business_name}} update: {{launch_name}} just launched. See it here: {{launch_link}} Reply STOP to opt out.`
- **Brief:** `{{business_name}}: {{launch_name}}, now live. {{launch_link}} STOP to opt out.`

### Re-engagement
Sent to win back a lapsed user.
- **Standard:** `{{business_name}}: it's been a while. Here's what you've missed: {{reengagement_link}} Reply STOP to opt out.`
- **Friendly:** `Your {{business_name}} account has been quiet - here's what's new since you left: {{reengagement_link}} Reply STOP to opt out.`
- **Brief:** `{{business_name}}: it's been a while. What's new: {{reengagement_link}} STOP to opt out.`

### Event invitation
Sent to invite an opted-in audience to an event.
- **Standard:** `{{business_name}}: {{event_name}} is coming up {{event_time}}. RSVP here: {{rsvp_link}} Reply STOP to opt out.`
- **Friendly:** `Your invite from {{business_name}}: {{event_name}}, {{event_time}}. RSVP: {{rsvp_link}} Reply STOP to opt out.`
- **Brief:** `{{business_name}}: {{event_name}}, {{event_time}}. RSVP: {{rsvp_link}} STOP to opt out.`

---

## Order updates
`id: order-updates` · TCR: DELIVERY_NOTIFICATION
Confirmations, shipping, delivery, and returns — the order-status messages customers actually want.
Sender frame: `{{workspace_name}}` in every body. No cross-sell or upsell in any body.

### Order confirmed
Sent right after an order is placed and paid. (Order lifecycle step 1 of 7)
- **Standard:** `{{workspace_name}}: Order {{order_number}} confirmed. Arrives {{estimated_delivery}}. We'll text you when it ships. Reply STOP to opt out.`
- **Friendly:** `Your {{workspace_name}} order {{order_number}} is in. Arriving {{estimated_delivery}}, we'll let you know when it's on the way. Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: Order {{order_number}} confirmed. Arrives {{estimated_delivery}}. STOP to opt out.`

### Order processing
Sent when an order moves into preparation. (Order lifecycle step 2 of 7)
- **Standard:** `{{workspace_name}}: Order {{order_number}} is being prepared. We'll text you when it ships. Reply STOP to opt out.`
- **Friendly:** `Good news, your {{workspace_name}} order {{order_number}} is being put together now. Shipping update coming soon. Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: Order {{order_number}} in preparation. STOP to opt out.`

### Order shipped
Sent when an order ships, with the tracking link. (Order lifecycle step 3 of 7)
- **Standard:** `{{workspace_name}}: Order {{order_number}} has shipped. Track it: {{tracking_link}}. Arrives {{estimated_delivery}}. Reply STOP to opt out.`
- **Friendly:** `Your {{workspace_name}} order {{order_number}} is on the way. Follow it here: {{tracking_link}}. Should arrive {{estimated_delivery}}. Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: Order {{order_number}} shipped. Track: {{tracking_link}} STOP to opt out.`

### Out for delivery
Sent when a package is out for delivery. (Order lifecycle step 4 of 7)
- **Standard:** `{{workspace_name}}: Order {{order_number}} is out for delivery today. Track it: {{tracking_link}} Reply STOP to opt out.`
- **Friendly:** `Your {{workspace_name}} order {{order_number}} is out for delivery, it should reach you today. Track: {{tracking_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: Order {{order_number}} out for delivery. {{tracking_link}} STOP to opt out.`

### Order delivered
Sent when a package is marked delivered. (Order lifecycle step 5 of 7)
- **Standard:** `{{workspace_name}}: Order {{order_number}} was delivered. Something wrong? Start here: {{return_link}} Reply STOP to opt out.`
- **Friendly:** `Your {{workspace_name}} order {{order_number}} has been delivered. If anything's off, you can sort it here: {{return_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: Order {{order_number}} delivered. Issue? {{return_link}} STOP to opt out.`

### Return started
Sent when a customer starts a return. (Order lifecycle step 6 of 7)
- **Standard:** `{{workspace_name}}: Your return for order {{order_number}} is started. Track its status: {{return_link}} Reply STOP to opt out.`
- **Friendly:** `We've started the return for your {{workspace_name}} order {{order_number}}. Check its status anytime: {{return_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: Return started for order {{order_number}}. Status: {{return_link}} STOP to opt out.`

### Refund processed
Sent when a refund is returned to the customer's card. (Order lifecycle step 7 of 7)
- **Standard:** `{{workspace_name}}: Refund of {{refund_amount}} for order {{order_number}} is processed to your {{card_type}}. Reply STOP to opt out.`
- **Friendly:** `Your {{workspace_name}} refund of {{refund_amount}} for order {{order_number}} is on its way back to your {{card_type}}. Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: {{refund_amount}} refunded for order {{order_number}} to your {{card_type}}. STOP to opt out.`

### Order ready for pickup
Sent when a BOPIS, click-and-collect, or counter order is ready to collect.
- **Standard:** `{{workspace_name}}: Order {{order_number}} is ready for pickup. Reply STOP to opt out.`
- **Friendly:** `Your {{workspace_name}} order {{order_number}} is ready - come grab it. Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: Order {{order_number}} ready for pickup. STOP to opt out.`

### Quote ready
Sent when an estimate or quote is ready to review and approve.
- **Standard:** `{{workspace_name}}: Your quote is ready. Review and approve here: {{action_link}} Reply STOP to opt out.`
- **Friendly:** `Good news - your {{workspace_name}} quote is ready. Take a look and approve: {{action_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: Quote ready. Review: {{action_link}} STOP to opt out.`

### Delivery attempt failed
Sent when a delivery attempt could not be completed.
- **Standard:** `{{workspace_name}}: We couldn't deliver order {{order_number}} today. Reschedule here: {{action_link}} Reply STOP to opt out.`
- **Friendly:** `Your {{workspace_name}} order {{order_number}} couldn't be delivered today. Let's find another time: {{action_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: Order {{order_number}} delivery failed. Reschedule: {{action_link}} STOP to opt out.`

---

## Team alerts
`id: team-alerts` · TCR: ACCOUNT_NOTIFICATION
Incident pings, on-call rotation, deploy notifications, threshold breaches.
Sender frame: `{{workspace_name}}` in every body.

### Shift scheduled
Sent when a shift is assigned. (Shift lifecycle step 1 of 5)
- **Standard:** `{{workspace_name}}: You're scheduled {{shift_date}} {{shift_time}} at {{location}} as {{role}}. Reply STOP to opt out.`
- **Friendly:** `Your {{workspace_name}} schedule: {{shift_date}}, {{shift_time}} at {{location}}, {{role}}. See you then. Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: {{shift_date}} {{shift_time}}, {{location}}, {{role}}. STOP to opt out.`

### Shift reminder
Sent ahead of shift start. (Shift lifecycle step 2 of 5)
- **Standard:** `{{workspace_name}}: Reminder, you're on {{shift_date}} {{shift_time}} at {{location}}. Reply STOP to opt out.`
- **Friendly:** `Your {{workspace_name}} shift is coming up: {{shift_date}}, {{shift_time}} at {{location}}. Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: Shift {{shift_date}} {{shift_time}}, {{location}}. STOP to opt out.`

### Shift change
Sent when a shift is changed, swapped, or moved. (Shift lifecycle step 3 of 5)
- **Standard:** `{{workspace_name}}: Your shift changed. New: {{shift_date}} {{shift_time}} at {{location}}. Reply STOP to opt out.`
- **Friendly:** `Heads up, your {{workspace_name}} shift moved to {{shift_date}}, {{shift_time}} at {{location}}. Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: Shift now {{shift_date}} {{shift_time}}, {{location}}. STOP to opt out.`

### Shift cancellation
Sent when a shift is cancelled. (Shift lifecycle step 4 of 5)
- **Standard:** `{{workspace_name}}: Your {{shift_date}} {{shift_time}} shift at {{location}} is cancelled. Reply STOP to opt out.`
- **Friendly:** `Your {{workspace_name}} shift on {{shift_date}} at {{location}} has been cancelled. Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: {{shift_date}} {{shift_time}} shift cancelled. STOP to opt out.`

### Shift start
Sent at shift start; check-in action optional. (Shift lifecycle step 5 of 5)
- **Standard:** `{{workspace_name}}: Your shift at {{location}} starts now. Check in: {{action_link}} Reply STOP to opt out.`
- **Friendly:** `Your {{workspace_name}} shift at {{location}} is starting. Check in here: {{action_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: Shift started. Check in: {{action_link}} STOP to opt out.`

### System alert
Severity-cued threshold or anomaly notification. Not limited to infrastructure — the same shape carries business-metric thresholds, price-target hits, device-state changes, and pipeline thresholds; `{{system_name}}` and `{{alert_type}}` name whatever is being watched.
- **Standard:** `{{workspace_name}} {{severity}}: {{alert_type}} on {{system_name}}. Details: {{action_link}} Reply STOP to opt out.`
- **Friendly:** `{{workspace_name}} heads up, {{severity}}: {{alert_type}} on {{system_name}}. {{action_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}} {{severity}}: {{alert_type}}, {{system_name}}. {{action_link}} STOP to opt out.`

### Escalation ping
Acknowledgment-required alert; escalates server-side if no ACK.
- **Standard:** `{{workspace_name}} {{severity}}: {{system_name}} needs attention. Reply ACK or it goes to {{escalation_to}}. Reply STOP to opt out.`
- **Friendly:** `{{workspace_name}}: {{severity}} on {{system_name}}, can you take it? Reply ACK to claim. Reply STOP to opt out.`
- **Brief:** `{{workspace_name}} {{severity}}: {{system_name}}. Reply ACK. {{action_link}} STOP to opt out.`

### On-call page
Urgent on-call notification; shortest message in the category.
- **Standard:** `{{workspace_name}} {{severity}}: {{system_name}} down. {{action_link}} Reply STOP to opt out.`
- **Friendly:** `{{workspace_name}} {{severity}}: {{system_name}} needs you now. {{action_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}} {{severity}}: {{system_name}}. {{action_link}} STOP to opt out.`

### Service-level alert
Informational SLA breach or maintenance notice.
- **Standard:** `{{workspace_name}}: {{system_name}} SLA breach, incident {{incident_id}}. {{action_link}} Reply STOP to opt out.`
- **Friendly:** `{{workspace_name}} notice: {{system_name}} is below its service level. {{action_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: {{system_name}} SLA breach. {{action_link}} STOP to opt out.`

### Incident resolved
Sent when an incident, outage, or service disruption is resolved.
- **Standard:** `{{workspace_name}}: {{system_name}} incident {{incident_id}} resolved. {{action_link}} Reply STOP to opt out.`
- **Friendly:** `{{workspace_name}}: all clear - {{system_name}} incident {{incident_id}} is resolved. {{action_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: {{system_name}} {{incident_id}} resolved. {{action_link}} STOP to opt out.`

### Task assigned
Sent when a task, lead, deal, or work item is assigned to a team member.
- **Standard:** `{{workspace_name}}: {{item_name}} was assigned to you. View: {{action_link}} Reply STOP to opt out.`
- **Friendly:** `{{workspace_name}}: {{item_name}} is yours now - take a look: {{action_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: {{item_name}} assigned to you. {{action_link}} STOP to opt out.`

### Task reminder
Sent to remind a team member of an upcoming task or deliverable deadline.
- **Standard:** `{{workspace_name}}: {{item_name}} is due {{due_time}}. View: {{action_link}} Reply STOP to opt out.`
- **Friendly:** `{{workspace_name}}: heads up - {{item_name}} is due {{due_time}}. {{action_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: {{item_name}} due {{due_time}}. {{action_link}} STOP to opt out.`

---

## Verification
`id: verification` · TCR: 2FA
Phone-ownership proof at signup, step-up confirmations, account recovery, and 2FA.
**No STOP/HELP language in body** (2FA TCR carve-out).
Sender frame: `{{business_name}}` in every body.

### Verification code
Sent when a user verifies their phone at signup.
- **Standard:** `{{business_name}}: Verification code: {{code}}. Expires in {{expiry_minutes}} minutes.`
- **Friendly:** `Your {{business_name}} code is {{code}}, good for {{expiry_minutes}} minutes.`
- **Brief:** `{{business_name}}: {{code}}`

### Confirmation code
Sent before a sensitive action — withdrawal, payment change, ownership transfer.
- **Standard:** `{{business_name}}: Confirmation code: {{code}}. Expires in {{expiry_minutes}} minutes.`
- **Friendly:** `Your {{business_name}} confirmation code is {{code}}, good for {{expiry_minutes}} minutes.`
- **Brief:** `{{business_name}}: Confirmation code {{code}}`

### Recovery code
Sent when a user recovers an account they're locked out of.
- **Standard:** `{{business_name}}: Recovery code: {{code}}. Expires in {{expiry_minutes}} minutes.`
- **Friendly:** `Your {{business_name}} recovery code is {{code}}, good for {{expiry_minutes}} minutes.`
- **Brief:** `{{business_name}}: Recovery code {{code}}`

### Login code
Sent when a user logs in with SMS as a second factor.
- **Standard:** `{{business_name}}: Your login code is {{code}}. Expires in {{expiry_minutes}} minutes.`
- **Friendly:** `Your {{business_name}} sign-in code is {{code}}, good for {{expiry_minutes}} minutes.`
- **Brief:** `{{business_name}}: Sign-in code {{code}}`

---

## Waitlist
`id: waitlist` · TCR: ACCOUNT_NOTIFICATION
Position updates, availability openings, off-list invitations.
Sender frame: `{{workspace_name}}` in every body. No promotional content in any body — including the Missed message (D-395).

### Joined
Sent when the user joins the waitlist. (Waitlist lifecycle step 1 of 6)
- **Standard:** `You're on the {{workspace_name}} waitlist. We'll text you when it's your turn. Reply STOP to opt out.`
- **Friendly:** `You're on the list for {{workspace_name}}. We'll text the moment your spot opens up. Reply STOP to opt out.`
- **Brief:** `On the {{workspace_name}} waitlist. We'll text when it's your turn. STOP to opt out.`

### Position update
Sent when the user moves up the queue. (Waitlist lifecycle step 2 of 6)
- **Standard:** `{{workspace_name}} waitlist update: you're now {{queue_position}}. We'll text you when you're up. Reply STOP to opt out.`
- **Friendly:** `Your spot on the {{workspace_name}} waitlist just moved up. You're {{queue_position}} now. Reply STOP to opt out.`
- **Brief:** `{{workspace_name}} waitlist: you're {{queue_position}}. STOP to opt out.`

### Almost up
Sent when the user's turn is approaching. (Waitlist lifecycle step 3 of 6)
- **Standard:** `{{workspace_name}} waitlist: you're up in about {{wait_estimate}}. Keep an eye on your phone. Reply STOP to opt out.`
- **Friendly:** `Almost your turn on {{workspace_name}}. We'll text you in about {{wait_estimate}} when your spot is ready. Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: you're up in about {{wait_estimate}}. STOP to opt out.`

### Your turn
Sent when the user's spot opens. (Waitlist lifecycle step 4 of 6)
- **Standard:** `{{workspace_name}} is ready for you. Claim your spot: {{claim_link}} Reply STOP to opt out.`
- **Friendly:** `Your turn on {{workspace_name}}. Claim your spot here: {{claim_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: you're up. {{claim_link}} STOP to opt out.`

### Grace expiring
Sent when the open spot is about to lapse. (Waitlist lifecycle step 5 of 6)
- **Standard:** `{{workspace_name}}: your spot is still open for {{grace_window}}. Claim it: {{claim_link}} Reply STOP to opt out.`
- **Friendly:** `Your {{workspace_name}} spot is waiting. It's yours for the next {{grace_window}}: {{claim_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}}: {{grace_window}} left to claim. {{claim_link}} STOP to opt out.`

### Missed
Sent when the spot lapses without action. (Waitlist lifecycle step 6 of 6)
- **Standard:** `Your {{workspace_name}} spot expired. Want back on the list? {{rejoin_link}} Reply STOP to opt out.`
- **Friendly:** `Looks like your {{workspace_name}} spot timed out. You can rejoin anytime: {{rejoin_link}} Reply STOP to opt out.`
- **Brief:** `{{workspace_name}} spot expired. Rejoin: {{rejoin_link}} STOP to opt out.`
