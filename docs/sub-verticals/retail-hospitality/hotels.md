## Hotels / boutique accommodations
**Vertical:** Retail & hospitality
**Bucket:** Clear
**URL slug:** /for/hotels

### What this builder is making
A property-management and guest-messaging system for one independent or boutique hotel — a Cloudbeds-for-the-little-guy that holds the reservation book, runs the front desk, and automates the guest journey from booking through pre-arrival, check-in, the stay, check-out, and post-stay. It triggers messages off PMS reservation status (confirmed, pre-arrival window, room ready, checked in, checked out) and turns the hotel's number into a two-way concierge line for towel/maintenance/late-checkout requests routed to housekeeping and the desk. It is the front-of-house operating layer for a single property with its own front desk and room inventory — not a multi-property chain's central reservation network, and not a remote Airbnb-style host managing scattered units.

### Why they need SMS
The most expensive failure points are the missed arrival and the room that comes ready while the guest is wandering the lobby with luggage: a guest who never sees the "your room is ready / here's your mobile key" email is standing at a desk that could have been skipped, and a pre-arrival check-in link buried in inbox spam means a manual queue at 3pm. SMS wins because arrival, room-ready, and concierge moments are all phone-in-hand, time-sensitive, and answer-expected — a guest mid-travel reads a text in seconds and texts back "extra towels, room 412" but will never open the app. Check-out reminders and post-stay review requests land while the experience is fresh, when an email would sit unopened until the guest is home.

### Message categories
1. appointments — the reservation→pre-arrival→check-in→check-out→post-stay arc maps directly onto confirmation, reminder, reschedule, cancellation, and post-appointment (the spine of the guest journey)
2. customer-support — the two-way concierge line: guest texts a request (towels, maintenance, late checkout), a task is created, status flows back; ticket lifecycle fits service requests
3. account-events — folio/payment events: card-on-file declined for incidentals or a no-show charge, deposit confirmation
4. team-alerts — front-desk and housekeeping shift scheduling, reminders, and call-out coverage
Excluded: waitlist (a hotel oversells or walklists at the rate level, but there is no consumer-facing "you're up" queue page like a restaurant table — room assignment is desk-side), community (no membership/community layer for a single property's guests), verification (no high-assurance guest login/2FA; booking lookup is by confirmation number, not SMS OTP), marketing (real but EIN-gated second registration — see Disambiguation; promotional rate offers and loyalty blasts are not a primary transactional category)

### Workflows

**Reservation confirmation**
Locks in a booked stay the moment it's made and gives the guest a record they can act on.
Sequence:
1. appointments:confirmation — "Booking confirmed" — sent when the reservation is booked/paid; "your stay at [hotel], [dates], is confirmed"
Variable aliases:
- provider_name: STRETCH — a hotel stay is with the property, not a named practitioner; phrase as the hotel (see Message gaps)
- appointment_time: "Fri Jun 26 – Sun Jun 28, King room"

**Pre-arrival check-in invitation**
Pulls the guest into online check-in before they reach the lobby so arrival is a key handoff, not a form-filling queue.
Sequence:
1. GAP:pre-arrival-check-in — "Check-in" — sent in the pre-arrival window (e.g. 24-48h before); invites the guest to complete online check-in and shares arrival info (parking, check-in hours), with a link (see Message gaps)
2. appointments:reminder-distant — "Arrival reminder" — sent the day before arrival; "see you tomorrow — check-in from 3pm"
Variable aliases:
- appointment_time: "tomorrow, check-in from 3:00 PM"
- cancel_link: "tap to view your booking or cancel"

**Room ready / mobile key delivery**
The arrival-day page: tells a guest their room is ready and hands them the digital key so they can skip the desk.
Sequence:
1. GAP:room-ready — "Room ready" — sent when housekeeping releases the room; "room 412 is ready — tap for your mobile key" (see Message gaps)
Variable aliases:
- (room number and key link carried by GAP variables — see Message gaps)

**Concierge / in-stay service request loop**
Turns the hotel number into a two-way concierge: guest texts a request, it becomes a task for housekeeping/maintenance/desk, and status flows back.
Sequence:
1. customer-support:ticket-received — "Request received" — sent when the guest's texted request is logged; "got it — extra towels to 412 on the way"
2. customer-support:agent-assigned — "Request assigned" — optional; "housekeeping is handling your request"
3. customer-support:resolution-notification — "Request done" — sent when the task is completed; "towels delivered — anything else?"
Variable aliases:
- ticket_number: "request #88"
- agent_name: "housekeeping" / "the front desk"
- ticket_link: "tap to view or add to your request"

**Proactive in-stay outreach**
Catches a delay or friction before it becomes a complaint — e.g. the room isn't ready at the standard time.
Sequence:
1. customer-support:proactive-outreach — "From the front desk" — sent when the desk wants to get ahead of an issue; "your room needs ~30 more min — enjoy a drink at the bar, on us, we'll text the moment it's ready"
Variable aliases:
- customer_name: "[guest first name]"

**Check-out reminder and folio close**
Reminds the guest of check-out time and closes the stay cleanly.
Sequence:
1. GAP:check-out-reminder — "Check-out" — sent the morning of departure; "check-out is at 11am — let us know if you need a late checkout" (see Message gaps)
2. appointments:cancellation-confirmation — "Booking" — repurposed only if a stay is cut short / cancelled; offers to rebook
Variable aliases:
- appointment_time: "11:00 AM today"

**Reschedule / cancellation**
Keeps the book accurate when a guest moves dates or drops a booking, freeing inventory.
Sequence:
1. appointments:reschedule-confirmation — "Booking updated" — sent when dates change; "moved to Jul 3 – Jul 5"
2. appointments:cancellation-confirmation — "Booking cancelled" — sent on cancel; offers to rebook
Variable aliases:
- appointment_time: "Jul 3 – Jul 5, King room"
- reschedule_link: "tap to rebook"

**Post-stay feedback / review request**
Captures a rating and a review while the stay is fresh, generated from the checked-out reservation.
Sequence:
1. appointments:post-appointment — "How was your stay?" — sent after check-out; "thanks for staying with us — how was it?"
Variable aliases:
- provider_name: STRETCH — no provider; phrase as "thanks for staying with us" (see Message gaps)
- feedback_link: "tap to leave a quick review"

**Failed payment / no-show charge**
Recovers a declined card on file before the incidental, deposit, or no-show charge fails silently.
Sequence:
1. account-events:payment-failed — "Payment" — sent when the card on file is declined for incidentals, deposit, or a no-show fee; "card ending 4242 was declined — update to keep your booking active"
Variable aliases:
- card_last4: "4242"
- account_link: "tap to update your card"

**Front-desk and housekeeping shift scheduling**
Keeps desk agents and housekeeping on the same page about who works when, and fills a gap fast when someone calls out.
Sequence:
1. team-alerts:shift-scheduled — "Schedule" — sent when a shift is posted; "you're on Fri 7am-3pm, front desk"
2. team-alerts:shift-reminder — "Schedule" — sent the morning of or hour before
3. team-alerts:shift-change — "Schedule" — sent when a shift is swapped or moved
4. team-alerts:shift-cancellation — "Schedule" — sent when a shift is cut or a call-out frees a slot
Variable aliases:
- location: "front desk" / "housekeeping"
- role: "desk agent" / "housekeeper"
- shift_time: "7:00 AM-3:00 PM"

### Message gaps

**GAP:room-ready**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (a hotel-specific "your room is ready, here's your key" event with no general-purpose corpus analog — the appointments family has no "the resource you booked is now physically available" state)
- **Proposed universal name:** Room ready (display alias here; registry-layer, hotel-scoped)
- **Why:** the single most distinctive hotel SMS moment — room-ready + mobile-key delivery — has no corpus message; it is not a confirmation, reminder, or order-status event
- *(Vertical-specific: draft variants skipped per format. Registry would carry `{{room_number}}` and a key/check-in link.)*

**GAP:check-out-reminder**
- **Classification:** Universal miss
- **Proposed corpus home:** appointments:check-out-reminder (a "your booked time is ending — here's what to do" reminder; parallels reminder-proximate but fires at the tail of an engagement, not before it)
- **Proposed universal name:** Check-out reminder
- **Why:** appointments reminders all fire before an appointment; multi-day or time-boxed engagements (hotel stay, equipment rental, co-working day pass, locker rental) need a symmetric end-of-engagement reminder, which the corpus lacks
- **Draft variants:**
  - Standard: `{{workspace_name}}: Check-out is at {{checkout_time}}. Need a late checkout? Just reply. Reply STOP to opt out.`
  - Friendly: `Hope you had a great stay! Check-out is at {{checkout_time}} — reply if you'd like a later time. Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: Check-out at {{checkout_time}}. Reply for late checkout. STOP to opt out.`
- **New variables:** `{{checkout_time}}` — the time check-out is due, budget ~12 chars, source: reservation record, example: "11:00 AM"

**GAP:pre-arrival-check-in**
- **Classification:** Universal miss
- **Proposed corpus home:** appointments:pre-arrival-check-in (a pre-engagement "complete check-in / intake before you arrive" prompt with a link)
- **Proposed universal name:** Pre-arrival check-in
- **Why:** online/contactless check-in before arrival is universal to hotels, clinics, car rental, and event admission; the corpus reminder messages nudge attendance but none prompt completing an intake/check-in step ahead of time
- **Draft variants:**
  - Standard: `{{workspace_name}}: Check in online before you arrive to skip the desk: {{checkin_link}} Reply STOP to opt out.`
  - Friendly: `Looking forward to your stay! Check in online now to skip the front desk: {{checkin_link}} Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: Check in online: {{checkin_link}} STOP to opt out.`
- **New variables:** `{{checkin_link}}` — link to the online check-in flow, budget ~24 chars, source: PMS check-in URL, example: "hotel.co/ci/8821"

**STRETCH:appointments:confirmation** (and the appointments reminder / post-appointment family)
- **Classification:** Stretch
- **Proposed corpus home:** appointments:confirmation — the fit gap is `{{provider_name}}`, which assumes a named practitioner; a hotel stay is with the property, not a person
- **Proposed universal name:** Appointment confirmation (used as "Booking confirmed" / "How was your stay?" aliases here)
- **Why:** every appointments body that interpolates `{{provider_name}}` reads awkwardly for a room booking ("your appointment with [name]"); the variable should be droppable or aliased to the property
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your stay on {{appointment_time}} is confirmed. Reply STOP to opt out.`
  - Friendly: `You're booked! Your stay is set for {{appointment_time}}. See you then. Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: Stay confirmed, {{appointment_time}}. STOP to opt out.`

### Content constraints
- Standard carrier rules apply to all transactional categories (reservations, room-ready, concierge requests, folio/payment, staff alerts) — these ride implied/transactional consent captured at booking.
- Reservation and service-update SMS are account-notification class: permitted with clear disclosure at booking (checkbox acceptable). Loyalty-program and post-visit promotional messaging require a separate explicit opt-in and a second EIN-gated marketing campaign registration — never folded into a booking or room-ready thread.
- SHAFT-C applies to marketing: a hotel with a bar or minibar cannot promote alcohol offers via SMS marketing. Transactional messages that merely mention the bar ("enjoy a drink while you wait") are fine; promotional drink/happy-hour blasts are not.
- Two-way reply (guest texts "extra towels," "running late," staff texts "can't make my shift") is permitted on the transactional concierge thread under implied consent — surface it as a feature, not a separate opt-in.
- Honor STOP/opt-out immediately and across the property (and any sister properties sharing a guest database) — opt-out via "any reasonable method," not only the STOP keyword. A staff shift opt-out must not silently drop a worker from scheduling pages without a fallback channel.

### Disambiguation
The sibling entry is short-term-rental / vacation-rental (Airbnb-host) management, and the line is operational, not legal. A hotel runs a front desk, owned room inventory, housekeeping, and a PMS — its SMS centers on room-ready/mobile-key, desk-routed concierge tasks, and check-out timing for guests physically on a managed property. An STR host manages scattered units remotely with no front desk: their SMS centers on self-check-in instructions, lockbox/door codes, house rules, cleaner coordination, and channel-manager (Airbnb/VRBO/Booking.com) reservation sync — and OTA platforms often relay guest messaging through their own channels, which complicates direct-SMS consent. Both look like "appointments + concierge," but tip toward hotel the moment a front desk, room-ready handoff, and on-site housekeeping tasks appear; tip toward STR when door codes and OTA sync replace a desk. What looks allowed but isn't: bundling a "book your next stay, 15% off" line into the post-stay review request or check-out reminder — that converts a transactional message into marketing and breaks the account-notification consent basis plus the EIN-gated marketing registration requirement. Multi-property chains are a heavier, separate story (per-property sender identity, central reservation routing, large parent-EIN registration) and arguably a different bucket; this entry is the single independent or boutique property.

### Sources
https://www.cloudbeds.com/hotel-guest/messaging/
https://www.cloudbeds.com/hotel-guest/upsell/
https://duve.com/customized-upsells-platform-for-hotels/
https://www.helloshift.com/guest-messaging
https://webrezpro.com/how-to-implement-guest-messaging-at-your-hotel/
https://www.thinkreservations.com/resources/articles/thinkmessengers-innovative-guest-engagement-tool
https://www.caterbook.com/features/guest-messaging/
https://www.fueltravel.com/blog/15-triggered-messages-your-hotel-should-be-sending-to-your-guests/
https://emitrr.com/blog/sms-templates-for-hotels/
https://www.quo.com/blog/sms-templates-for-hotels-hospitality/
https://www.text-em-all.com/blog/sms-for-hospitality-hotels-guest-communication
https://www.visitoai.com/en/blog/hotel-guest-messaging-systems-a-practical-guide
https://clerk.chat/sms-templates/hotels/
https://suiteop.com/blog/best-operations-software-boutique-hotels
https://hoteltechinsight.com/2025/12/10/boutique-hotel-technology-guide-2025/
https://mytcrplus.com/home/tcr-resources/industry-sms-compliance-playbooks/hospitality-travel-messaging-compliance-playbook/
https://www.infobip.com/blog/tcpa-compliance-sms
https://activeprospect.com/blog/tcpa-text-messages/
