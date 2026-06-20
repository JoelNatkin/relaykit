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

---

## Appointments
`id: appointments` · TCR: ACCOUNT_NOTIFICATION
Confirmations, reminders, reschedules, cancellations, no-show follow-ups.
Sender frame: `{{workspace_name}}` in every body.

### Confirmation
Sent when a booking is confirmed.
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
Severity-cued threshold or anomaly notification.
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
