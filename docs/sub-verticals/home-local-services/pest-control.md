## Pest control
**Vertical:** Home & local services
**Bucket:** Clear
**URL slug:** /for/pest-control

### What this builder is making
Field-service software for pest control and exterminator companies that schedules and routes technicians, tracks recurring treatment plans (monthly/quarterly/annual), and runs jobs from booking through invoice — the GorillaDesk / PestPac / Pocomos / Fieldster / FieldRoutes class of CRM, plus indie scheduling tools built on Housecall Pro and ServiceFusion. The system holds the customer's property, service history, recurring plan cadence, and per-visit job state (scheduled, en route, complete, invoiced). It drives notifications off job-status transitions and the recurring-treatment calendar.

### Why they need SMS
A treatment requires the customer to prep the home (empty cabinets, bag food, secure pets off treated surfaces) and to provide property access during a 2-4 hour service window — if that text is missed, the technician arrives to an unprepped, locked, or pet-occupied home and the visit is wasted at the company's cost. SMS is the only channel read in time to deliver the prep checklist 24-48h out, the "tech is 15 minutes away" arrival ping, and the day-before window reminder. Recurring plans also depend on a quarterly "your service is due" nudge that email routinely buries.

### Message categories
1. appointments — the spine: booking confirmation, day-before window reminder, en-route arrival, reschedule/cancel, no-show rebooking, and post-treatment follow-up all map onto the appointments lifecycle
2. order-updates — clean fit for the invoice/payment tail (refund processed); the treatment-complete "job done" status reads as a delivery/completion notification
3. account-events — payment-failed on auto-pay decline for recurring plans; the platform's own SaaS billing to the operator-subscriber
4. customer-support — two-way inbound replies, ticket-style follow-ups, service-status during a route delay
Excluded: community (no membership layer), team-alerts (technician dispatch is internal ops, not the customer-facing product RelayKit frames — could apply to crew dispatch but out of the consumer lane), verification (phone-ownership only, not a service channel), marketing (seasonal promos are lawful but EIN-gated and out of the transactional spine — see constraints), waitlist (no queue mechanic; recurring cadence is a calendar, not a position)

### Workflows

**Booking confirmation**
Confirms a newly scheduled treatment so the customer expects the technician.
Sequence:
1. appointments:confirmation — "Treatment confirmed" — when a one-time or recurring visit is booked
Variable aliases:
- provider_name: "your technician"
- appointment_time: "Tue Jun 23, 8am-12pm"

**Pre-service prep and reminder**
Gets the home ready and the access open before the technician arrives — the highest-leverage sequence for avoiding wasted visits.
Sequence:
1. GAP:service-prep-instructions — "Prep your home" — 24-48h out, the prep checklist (clear cabinets, secure pets, unlock gates)
2. appointments:reminder-distant — "Treatment tomorrow" — day before, with the service window and reschedule link
3. appointments:reminder-proximate — "Window starts in 1 hour" — start of the arrival window
Variable aliases:
- appointment_time: "tomorrow, 8am-12pm window"
- provider_name: "your technician"

**Technician en route**
Tells the customer the technician is on the way so someone is home and pets are secured.
Sequence:
1. STRETCH:appointments:reminder-proximate — "Tech on the way" — when the technician marks en route / is ~15 min out
Variable aliases:
- provider_name: "your technician Mike"
- appointment_time: "arriving ~2:45-3:00 PM"

**Treatment complete and feedback**
Closes the visit, sets the post-treatment safety window, and asks for a review.
Sequence:
1. order-updates:order-delivered — "Treatment complete" — when the technician marks the job done (job complete reads as a delivery/completion status)
2. appointments:post-appointment — "How did we do?" — review/feedback request after the visit
Variable aliases:
- order_number: "Visit #4821"
- provider_name: "your technician"
- feedback_link: "review link"

**Invoice and payment**
Carries the post-visit invoice tail for recurring auto-pay and one-time jobs.
Sequence:
1. account-events:payment-failed — "Card declined" — when a recurring auto-pay charge fails
2. order-updates:refund-processed — "Refund processed" — on a credit/refund for a missed or re-done visit
Variable aliases:
- workspace_name: "the company name"

**Reschedule and cancel**
Keeps the customer current when a visit moves or is dropped.
Sequence:
1. appointments:reschedule-confirmation — "Moved" — when a visit is rescheduled (weather, routing)
2. appointments:cancellation-confirmation — "Cancelled" — when a visit is cancelled, with a rebook link
3. appointments:no-show-follow-up — "We missed you" — when no one was home / no access, prompting a rebook

**Recurring service due**
Brings a quarterly/annual plan customer back for the next treatment — the renewal nudge email buries.
Sequence:
1. GAP:service-due-reminder — "Your treatment is due" — ~30 days / cadence interval out, with a booking link to confirm or reschedule
Variable aliases:
- appointment_time: "next month"

**Route-delay status**
Tells affected customers when a technician is running behind so they don't give up on the window.
Sequence:
1. customer-support:service-status-alert — "Running behind" — when a route slips and the window shifts
Variable aliases:
- eta: "by 4:30 PM"

### Message gaps

**GAP:service-prep-instructions**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (a field-service "prep before the visit" message; the prep content is pest-control-specific — cabinets, pets, treated surfaces — and doesn't generalize to the appointments category as written)
- **Proposed universal name:** "Pre-service prep instructions" (display alias)
- **Why:** no corpus message carries a pre-visit action checklist the customer must complete before the provider arrives; appointments reminders confirm a time but don't instruct preparation

**GAP:service-due-reminder**
- **Classification:** Universal miss
- **Proposed corpus home:** appointments:service-due (a recurring-cadence "time for your next visit, rebook" reminder — distinct from a confirmed-appointment reminder, since no appointment exists yet)
- **Proposed universal name:** "Recurring service due — rebook reminder"
- **Why:** recurring field-service, subscription-grooming, and maintenance-plan builders all need a "your next service is due, book it" nudge with no appointment yet on the calendar; appointments reminders assume a booking already exists and waitlist assumes a queue
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your next treatment is due {{appointment_time}}. Pick a time: {{reschedule_link}} Reply STOP to opt out.`
  - Friendly: `Time for your next {{workspace_name}} treatment ({{appointment_time}}). Grab a slot here: {{reschedule_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Next treatment due {{appointment_time}}. Book: {{reschedule_link}} STOP to opt out.`

**STRETCH:appointments:reminder-proximate**
- **Classification:** Stretch
- **Proposed corpus home:** appointments:reminder-proximate reused as the technician-en-route "on my way" ping; fit gap is that the corpus message frames the customer arriving to a provider ("your appointment is in 1 hour"), whereas pest control is the provider traveling to the customer's home with a tighter, live ETA
- **Proposed universal name:** "Provider en route — arrival ping" (display alias over the proximate-reminder body)
- **Why:** the structure (imminent-arrival heads-up with a time) is the same, but the directionality and the 15-minutes-out live ETA are field-service-specific and the default body reads slightly off
- **Draft variants:**
  - Standard: `{{workspace_name}}: {{provider_name}} is on the way, arriving {{appointment_time}}. Please secure pets. Reply STOP to opt out.`
  - Friendly: `Heads up - {{provider_name}} from {{workspace_name}} is en route, arriving {{appointment_time}}. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{provider_name}} en route, {{appointment_time}}. STOP to opt out.`

### Content constraints
- Standard carrier rules apply; pest control is a routine, eligible field-service use case with no vertical-specific carrier ban.
- Keep the transactional spine (confirmation, prep, reminder, en-route, complete, invoice, service-due) registered under appointment/account-notification use cases — content must match the registered campaign or it gets filtered.
- Seasonal promos ("mosquito season is here, 20% off") are lawful but are marketing: separate explicit consent, EIN-gated, registered as MARKETING, not folded into the transactional reminder stream.
- No pesticide/chemical-safety claims that read as medical advice; keep post-treatment safety to logistics ("keep pets off treated surfaces until dry") in the prep/complete messages.
- Honor STOP immediately on the service stream; a customer who opts out of reminders still needs a non-SMS fallback for prep instructions and access coordination.

### Disambiguation
Pest control sits with lawn care, pool service, HVAC, and cleaning under home & local services — all share the same booking → prep → en-route → complete → invoice → recurring-due spine, so a builder serving several of these wants the same workflows with different prep content. The line that stays Clear is the transactional service stream tied to a customer who booked or holds a recurring plan; it tips toward needing marketing consent the moment messaging becomes seasonal upsell, win-back of lapsed customers, or door-to-door lead follow-up to people who never booked. What looks allowed but isn't: blasting a purchased neighborhood list "your neighbors had a roach problem, want a quote?" is cold marketing to non-consenting recipients, not a service notification, and routes to the heavily-filtered marketing/lead lane regardless of how transactional the copy sounds.

### Sources
https://sakari.io/blog/sms-for-pest-control-services-how-to-use-text-messaging-to-boost-bookings-reduce-no-shows-and-improve-customer-satisfaction
https://sakari.io/templates/pest-control-reminder-text
https://www.textrequest.com/playbooks/pest-control
https://www.textrequest.com/industries/pest-control
https://blog.salescaptain.com/business-texting-for-pest-control-companies-2025/
https://blog.salescaptain.com/two-way-texting-for-pest-control-companies-2025/
https://gorilladesk.com/features/appointment-confirmations-reminders/
https://gorilladesk.com/industries/pest-control-software/
https://gorilladesk.com/learn/pest-control-review-strategies/
https://www.pestpac.com/features/customer-communication
https://pocomos.com/customer-connections/
https://www.fieldster.io/features/service-notifications
https://octopuspro.com/field-service-management/termite-pest-control-software/
https://aplosai.com/blog/pest-control-automation
https://skipcalls.com/resources/communication-checklist/pest-control
https://www.terminix.com/pest-control/how-to-prepare-for-pest-control/
https://drakepest.com/how-to-prepare-your-home-for-a-pest-control-treatment/
https://help.twilio.com/articles/4408675845019-SMS-Compliance-and-A2P-10DLC-in-the-US
