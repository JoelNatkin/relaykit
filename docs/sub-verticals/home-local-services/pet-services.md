## Pet services (grooming, walking, boarding, training)
**Vertical:** Home & local services
**Bucket:** Clear
**URL slug:** /for/pet-services

### What this builder is making
Appointment-led pet-care software for groomers, dog walkers, pet sitters, boarding/daycare facilities, and trainers — booking, client/pet profiles (breed, coat, behavior notes), staff scheduling, POS, and automated client messaging (Pawfinity, MoeGo, Gingr, Time To Pet, PetExec, Kennel Connection, ProPet, plus Rover/Wag-style marketplace clones). The software tracks recurring service intervals, check-in/check-out state, on-site visit events, and vaccination records, firing notifications at each. SMS is the operator's primary client channel because pet parents are away from a desk when the moment matters.

### Why they need SMS
A groomer's whole day is blown by one no-show in a slot they can't backfill, and a boarding facility can't release a dog until the parent physically arrives — both turn on a message the parent reads in minutes, not an email seen that evening. SMS hits 90-98% open rates where email sits at 20-30%, cutting grooming no-shows from ~18% to 5-7% and lifting rebooking 20-30%. The "your dog is ready for pickup" and "walker is on the way" moments are inherently mobile, time-boxed, and useless if missed.

### Message categories
1. appointments — booking-led business; confirmations, reminders, reschedules, no-show follow-ups, post-visit feedback are the operational core
2. account-events — payment/balance reminders, late-pickup fees, membership renewals are churn- and revenue-critical
3. customer-support — two-way client inbox for visit questions and issues during a stay
4. marketing — EIN-gated promos, seasonal/holiday boarding pushes, loyalty offers (separate consent)
5. waitlist — popular groomers and full daycare days run cancellation waitlists
Excluded: order-updates (no physical product fulfillment/tracking), team-alerts (staff scheduling exists but is internal ops, not a client-facing SMS surface in this entry's scope), community (no member-community construct), verification (phone-ownership 2FA is a generic auth concern, not a pet-services workflow)

### Workflows

**Booking confirmation + reminder**
Locks in the appointment and protects the slot against no-shows.
Sequence:
1. appointments:confirmation — "Grooming confirmed" — fires the moment the parent books, naming groomer/walker and time
2. appointments:reminder-distant — "Appointment tomorrow" — day-before nudge with cancel link to free the slot early if needed
3. appointments:reminder-proximate — "In about an hour" — same-day pre-arrival nudge (drop-off prep)

Variable aliases:
- provider_name: "Sarah (groomer)"
- appointment_time: "Sat 10:00 AM"

**Reschedule / cancellation**
Keeps the calendar accurate and recovers the freed slot.
Sequence:
1. appointments:reschedule-confirmation — "Moved your appointment" — confirms the new time and groomer
2. appointments:cancellation-confirmation — "Appointment cancelled" — confirms cancellation with a rebook link

**No-show recovery**
Re-engages a parent who missed and recovers lost revenue.
Sequence:
1. appointments:no-show-follow-up — "We missed you today" — offers to rebook with the same provider

**Post-visit feedback**
Captures a rating while the visit is fresh (review/reputation engine).
Sequence:
1. appointments:post-appointment — "Thanks for visiting" — feedback link after the groom/visit

**Grooming recall / rebook reminder**
Drives repeat business on the breed-specific grooming interval (the single highest-ROI pet-services SMS).
Sequence:
1. GAP:rebook-recall — "Time to rebook" — fires N weeks after last groom: "It's been 8 weeks since Bailey's last groom — ready to rebook?"

Variable aliases:
- pet_name: "Bailey"

**Walk / sitting visit lifecycle**
The mobile-service trust loop: parent knows the walker arrived, the walk happened, and how it went.
Sequence:
1. GAP:on-my-way — "Walker on the way" — sent when the walker departs for the visit
2. GAP:service-started — "Walk started" — arrival/start ping, often with live GPS link
3. GAP:visit-report — "Walk complete" — completion with photo/notes/map report link

Variable aliases:
- provider_name: "Marcus (walker)"

**Boarding / daycare check-in → ready-for-pickup**
Coordinates drop-off and the pickup the facility can't initiate without the parent present.
Sequence:
1. appointments:confirmation — "Stay confirmed" — STRETCH:appointments:confirmation — confirms the boarding reservation (corpus body is appointment-framed; "stay" / date range needs reframing)
2. GAP:checked-in — "Checked in" — drop-off confirmation: pet is settled in
3. GAP:ready-for-pickup — "Ready for pickup" — the load-bearing message: pet is ready, please come collect
4. appointments:post-appointment — "How was the stay?" — feedback link after checkout

Variable aliases:
- provider_name: "Happy Tails Boarding"

**Daycare / boarding report card**
The loyalty moment — a photo/notes recap that makes the parent's day.
Sequence:
1. GAP:visit-report — "Today's report card" — recap link after a daycare day or boarding stay

**Vaccination expiry reminder**
Keeps the facility compliant and safe; blocks booking friction at the door.
Sequence:
1. GAP:vaccination-expiry — "Vaccination due" — fires before a pet's required vaccination lapses

Variable aliases:
- pet_name: "Bailey"

**Training class enrollment + session reminders**
Fills recurring classes and reduces missed sessions.
Sequence:
1. appointments:confirmation — "Enrolled in class" — STRETCH:appointments:confirmation — confirms enrollment in a class series (recurring-class framing differs from single appointment)
2. appointments:reminder-distant — "Class tomorrow" — pre-session reminder with location/parking
3. GAP:rebook-recall — "Re-enroll before the course ends" — re-enrollment nudge before the series finishes

**Balance / payment + late-fee reminders**
Recovers outstanding balances and communicates late-pickup fees transparently.
Sequence:
1. account-events:payment-failed — "Payment didn't go through" — card-on-file declined for a service charge
2. GAP:balance-due — "Balance due" — outstanding balance or late-pickup-fee notice with pay link

**Membership renewal**
Retains daycare/membership subscribers before lapse.
Sequence:
1. account-events:trial-ending — "Membership ending soon" — STRETCH:account-events:trial-ending — renewal nudge (corpus body says "trial"; membership-renewal framing differs)
2. account-events:subscription-confirmed — "Membership renewed" — confirms the renewal went through

**Cancellation waitlist**
Backfills a freed groomer slot or full daycare day from a waiting list.
Sequence:
1. waitlist:joined — "On the waitlist" — confirms the parent is queued for an earlier/opening slot
2. waitlist:your-turn — "A slot opened" — earlier slot available, claim it
3. waitlist:grace-expiring — "Slot still open" — claim window closing before it passes to the next parent

**Seasonal / holiday promotion (marketing)**
EIN-gated push for holiday boarding, slow-season grooming discounts, loyalty perks.
Sequence:
1. marketing:promotional-offer — "Holiday boarding offer" — separate-consent promo with offer link

### Message gaps

**GAP:rebook-recall**
- **Classification:** Universal miss
- **Proposed corpus home:** appointments:rebook-recall
- **Proposed universal name:** Rebook reminder
- **Why:** recurring-service businesses (grooming, lashes, lawn care, training series) all need an interval-based "time to come back" nudge the corpus lacks
- **Draft variants:**
  - Standard: `{{workspace_name}}: it's time to rebook {{pet_name}}. Pick a time here: {{reschedule_link}} Reply STOP to opt out.`
  - Friendly: `{{pet_name}} is due for a visit! Book a new time here: {{reschedule_link}} Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: time to rebook {{pet_name}}. {{reschedule_link}} STOP to opt out.`
- **New variables:** `{{pet_name}}` — the pet's name, budget ~16 chars, source: pet profile, example: "Bailey"

**GAP:on-my-way**
- **Classification:** Universal miss
- **Proposed corpus home:** appointments:on-my-way
- **Proposed universal name:** Provider en route
- **Why:** any mobile/at-home service (walking, sitting, mobile grooming, home cleaning, repair) needs an "on the way" ping; corpus has no en-route message
- **Draft variants:**
  - Standard: `{{workspace_name}}: {{provider_name}} is on the way and should arrive around {{eta}}. Reply STOP to opt out.`
  - Friendly: `Heads up - {{provider_name}} is heading your way, arriving about {{eta}}. Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: {{provider_name}} on the way, ~{{eta}}. STOP to opt out.`

**GAP:service-started**
- **Classification:** Universal miss
- **Proposed corpus home:** appointments:service-started
- **Proposed universal name:** Service started
- **Why:** on-site services (walk, visit, in-home job) send an arrival/start ping, often with a live-tracking link; corpus stops at reminders and has no in-progress event
- **Draft variants:**
  - Standard: `{{workspace_name}}: {{provider_name}} has started {{pet_name}}'s visit. Follow along: {{action_link}} Reply STOP to opt out.`
  - Friendly: `{{provider_name}} just started {{pet_name}}'s visit - follow along here: {{action_link}} Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: {{pet_name}}'s visit started. {{action_link}} STOP to opt out.`
- **New variables:** `{{pet_name}}` — see above

**GAP:visit-report**
- **Classification:** Universal miss
- **Proposed corpus home:** appointments:visit-report
- **Proposed universal name:** Visit summary
- **Why:** completed on-site services deliver an after-action recap (report card, walk map, photos); distinct from post-appointment feedback (which asks the customer for input rather than delivering a record)
- **Draft variants:**
  - Standard: `{{workspace_name}}: {{pet_name}}'s visit is done. See the report and photos here: {{action_link}} Reply STOP to opt out.`
  - Friendly: `All done with {{pet_name}}! Here's today's report and photos: {{action_link}} Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: {{pet_name}}'s report is ready. {{action_link}} STOP to opt out.`
- **New variables:** `{{pet_name}}` — see above

**GAP:checked-in**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** Checked in (display alias)
- **Why:** drop-off confirmation for boarding/daycare is specific to facility-stay services

**GAP:ready-for-pickup**
- **Classification:** Universal miss
- **Proposed corpus home:** appointments:ready-for-pickup
- **Proposed universal name:** Ready for pickup
- **Why:** any drop-and-collect service (boarding, daycare, repair shop, dry cleaner, vet day-stay) needs a "ready to collect" message; corpus has none
- **Draft variants:**
  - Standard: `{{workspace_name}}: {{pet_name}} is ready for pickup. See you soon. Reply STOP to opt out.`
  - Friendly: `{{pet_name}} is all set and ready to go home! Come on by. Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: {{pet_name}} is ready for pickup. STOP to opt out.`
- **New variables:** `{{pet_name}}` — see above

**GAP:vaccination-expiry**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** Vaccination due (display alias)
- **Why:** vaccination-record expiry is specific to facilities that gate entry on pet health records; carries health-adjacent framing better kept out of the universal corpus

**GAP:balance-due**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:balance-due
- **Proposed universal name:** Balance due
- **Why:** an outstanding-balance / overage / fee reminder for an active account is distinct from a failed card charge; broadly useful across services and SaaS
- **Draft variants:**
  - Standard: `{{workspace_name}}: you have a balance of {{amount}} due. Pay here: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Quick note from {{workspace_name}} - there's a {{amount}} balance on your account. Pay here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{amount}} balance due. {{account_link}} STOP to opt out.`
- **New variables:** `{{amount}}` — formatted balance owed, budget ~10 chars, source: invoice/POS, example: "$45.00"

**STRETCH:appointments:confirmation**
- **Classification:** Stretch
- **Proposed corpus home:** appointments:confirmation — fit gap: body is framed as a single dated appointment with a provider; boarding "stays" span a date range and training "enrollments" are recurring class series, so {{appointment_time}} reads wrong for both
- **Proposed universal name:** Confirmation
- **Why:** usable as-is for date-range stays and class series only with reframed time/scope language

**STRETCH:account-events:trial-ending**
- **Classification:** Stretch
- **Proposed corpus home:** account-events:trial-ending — fit gap: body literally says "trial," but the pet-services use is a paid daycare/boarding membership renewal, not a trial conversion
- **Proposed universal name:** Renewal reminder
- **Why:** the timing/intent (lapse-prevention nudge) matches, but "trial" wording is wrong for an established membership

### Content constraints
- Standard A2P 10DLC registration required; campaign use case must match content sent (register "appointments/account notifications," do not send promos on it)
- Explicit opt-in before any SMS; honor STOP/UNSUBSCRIBE/CANCEL/END/QUIT immediately with auto-confirm
- Marketing (promos, seasonal pushes, loyalty offers) requires separate explicit consent and is EIN-gated; keep it off the transactional campaign
- No promotional content in transactional bodies (report cards, reminders, pickup alerts stay informational)
- Vaccination-expiry and any pet-health framing must stay logistical ("vaccination due," "records on file") — do not drift into medical advice or condition detail (keeps this Clear, not veterinary)

### Disambiguation
This entry covers appointment-led pet *care* — grooming, walking, sitting, boarding, daycare, and training — where messages are logistical (when, where, ready, rebook). It is distinct from veterinary clinics and pet-health platforms, which handle diagnoses, prescriptions, lab results, and treatment plans; those carry medical-information considerations and are a separate sub-vertical, out of scope here. The line tips Clear→Conditional the moment content stops being logistics and starts conveying health status: "your dog's bloodwork is back" or medication-dosing instructions belong to the vet entry, while "vaccination on file expires soon" stays logistical and Clear. Mobile/marketplace operators (Rover/Wag clones) sit inside this entry, but if a platform adds in-app payment disputes or background-check identity flows, those touch separate verification/payments concerns. When a grooming or boarding business also resells retail product with shipping, that fulfillment piece is order-updates territory, not this entry.

### Sources
https://www.gingrapp.com/blog/texting-pet-parents-how-sms-updates-build-trust-and-save-time
https://www.gingrapp.com/dog-training-software
https://www.pawfinity.com/
https://tryteddy.com/
https://www.timetopet.com/dog-walking-software
https://www.spotdogwalkers.com/
https://doggylogs.com/
https://www.propetware.com/text-messaging-sms/
https://cloudhelp.kennelconnection.com/report-cards/
https://kennelconnection.com/blog/mass-sms-ideas-for-pet-care-businesses/
https://blog.groomsoft.com/reducing-grooming-no-shows-with-text-message-appointment-reminders/
https://fluffflow.com/pet-grooming-sms
https://www.etisia.com/dog-grooming-appointment-sms-reminders
https://www.spokk.io/pet-boarding-and-daycare/sms-automation
https://www.petuniapets.com/en/blog/sms-consent-a2p-10dlc-pet-business-software
https://help.twilio.com/articles/4408675845019-SMS-Compliance-and-A2P-10DLC-in-the-US
https://bookthatin.com/blog/dog-training-class-bookings/
