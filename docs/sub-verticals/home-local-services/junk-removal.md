## Junk removal / hauling

**Vertical:** Home & local services
**Bucket:** Clear
**URL slug:** /for/junk-removal

### What this builder is making
On-demand dispatch and job-management software for junk-removal and hauling operators — the tool a 1-800-GOT-JUNK franchise, a College Hunks crew, or a solo box-truck hauler uses to take a booking, hold a same-day arrival window, route and dispatch a truck, quote a price on-site against truck space, complete the haul, and collect payment (think Workiz, Jobber, Housecall Pro, Docket, Servgrow). It tracks bookings tied to an address and an arrival window, crew/truck assignment, an on-site estimate the customer accepts or declines, and post-job payment plus review collection. The builder's customers are the haulers; the people receiving texts are the homeowners and property managers waiting for a truck.

### Why they need SMS
Junk removal is window-based, not appointment-exact: a customer is given a 2-3 hour arrival window and the signature touch across the whole industry is the "we're 25-30 minutes out" call or text so the customer can be home, clear the driveway, and point the crew at the pile. Miss that ping and the truck rolls up to an empty house — a wasted dispatch on a same-day job that can't be rerun, and a customer who books a competitor next time. SMS hits the few-minute window that email and voicemail miss, exactly when the customer still has time to get to the door.

### Message categories
1. appointments — the spine: booking confirmation, arrival-window reminder, the en-route "25 min out" ping, and reschedules are the highest-volume, highest-value texts
2. order-updates — repurposed as job-status: on-site quote ready, job complete, and payment/receipt close the loop on each haul
3. customer-support — quote-request follow-up for emailed/online estimates and post-job issue handling
4. account-events — payment-failed on a card-on-file charge after the job
5. marketing — seasonal and re-engagement (EIN-gated, separate consent): spring-cleanout offers, win-back of past customers
6. waitlist — secondary: same-day demand overflow when every truck is booked
Excluded: community (no member-community construct), team-alerts (truck/crew dispatch is the builder's own ops, not a RelayKit customer-messaging surface in V1 framing), verification (phone-ownership 2FA is generic signup, not a junk-removal-specific job).

### Workflows

**Booking confirmation**
Confirms a new junk-removal booking with the date and arrival window so the customer knows a truck is coming.
Sequence:
1. appointments:confirmation — "Junk Removal" — sent when the booking is placed; "your pickup is confirmed for {{appointment_time}}"

Variable aliases:
- provider_name: "your crew" (or the truck/team name)
- appointment_time: "Thursday, 12-3pm window"

**Arrival-window reminder**
Reminds the customer of their window the day before and morning-of so they're home and the items are accessible.
Sequence:
1. appointments:reminder-distant — "Junk Removal" — sent the day before; "your pickup window is tomorrow, 12-3pm"
2. appointments:reminder-proximate — "Junk Removal" — sent ~1 hour before the window opens; "your crew is coming within the hour"

Variable aliases:
- provider_name: "your crew"
- appointment_time: "12-3pm window"

**Truck on the way (signature ping)**
The industry-defining "we're 25-30 minutes out" text so the customer gets to the door and clears access.
Sequence:
1. GAP:crew-en-route — "Junk Removal" — sent when the truck is dispatched/departs for the address; gives a live "~25 min out" arrival window

**On-site quote**
After the crew eyeballs the load, the customer gets a firm truck-space price to accept or decline before work starts.
Sequence:
1. GAP:estimate-ready — "Junk Removal" — sent when the crew has assessed the pile and the on-site price is ready to approve
2. GAP:job-complete — "Junk Removal" — sent when the haul is done and the truck pulls away; "your junk is gone, here's the recap"

**Reschedule / window change**
A backed-up route or a customer conflict moves the pickup; this updates the window and prevents a missed-truck call.
Sequence:
1. appointments:reschedule-confirmation — "Junk Removal" — sent when the pickup is moved; "your pickup moved to Friday, 9-12 window"
2. appointments:cancellation-confirmation — "Junk Removal" — sent if the pickup is cancelled; offers rebook
3. appointments:no-show-follow-up — "Junk Removal" — sent if the crew arrived but couldn't access the items / no one was home; offers to rebook

Variable aliases:
- appointment_time: "Friday, 9-12 window"
- provider_name: "your crew"

**Payment & receipt**
Closes the job financially after the haul, since junk removal is pay-on-completion.
Sequence:
1. GAP:payment-receipt — "Junk Removal" — sent when payment is taken on-site; "payment received, here's your receipt"
2. account-events:payment-failed — "Junk Removal" — sent if a card-on-file charge for the completed haul is declined

**Review request**
Turns a finished haul into a 5-star review while the customer is still satisfied — a core feature of every junk-removal platform.
Sequence:
1. appointments:post-appointment — "Junk Removal" — sent shortly after the job; "thanks for the haul today, how'd we do?"

**Quote-request follow-up**
Chases an online/emailed estimate request so a warm lead books before it goes cold.
Sequence:
1. customer-support:ticket-received — "Junk Removal" — STRETCH: confirms a quote request came in
2. GAP:estimate-ready — "Junk Removal" — sent when the estimate is prepared and ready to view/book

**Post-job issue**
Handles a "you left a box behind" or damage report after the truck leaves.
Sequence:
1. customer-support:ticket-received — "Junk Removal" — confirms the issue is logged
2. customer-support:resolution-notification — "Junk Removal" — confirms the crew returned or resolved it

**Dumpster drop-off / pickup (haulers offering rentals)**
Many junk removers also rent roll-off/mobile dumpsters; this coordinates the drop and the pickup-when-full.
Sequence:
1. appointments:confirmation — "Dumpster Rental" — sent when the dumpster drop-off is scheduled
2. appointments:reminder-proximate — "Dumpster Rental" — sent ahead of the scheduled pickup; "we're picking up your dumpster today"

Variable aliases:
- appointment_time: "drop-off Monday AM"
- provider_name: "your driver"

**Same-day overflow waitlist**
Manages demand when every truck is booked and same-day requests have to queue.
Sequence:
1. waitlist:joined — "Junk Removal" — sent when a same-day request joins the overflow list because trucks are full
2. waitlist:your-turn — "Junk Removal" — sent when a truck frees up and the pickup can be slotted in

**Seasonal cleanout offer (marketing, separate consent)**
Promotes seasonal cleanout pushes (spring clean-out, post-move, estate clear-out) to opted-in past customers.
Sequence:
1. marketing:promotional-offer — "Haul Away Co" — sent when a seasonal window opens; "spring cleanout special, $X off your next haul"

Variable aliases:
- offer: "spring cleanout, $25 off a full truck"

**Past-customer win-back (marketing, separate consent)**
Re-engages a customer who hauled with them once and hasn't booked since.
Sequence:
1. marketing:re-engagement — "Haul Away Co" — sent to a lapsed past customer; "got more to clear out?"

### Message gaps

**GAP:crew-en-route**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (close to appointments:reminder-proximate, but framed as a live "truck is on the road to you now, ~25 min out" dispatch ping keyed to departure, not a fixed-time reminder)
- **Proposed universal name:** Crew on the way (display alias)
- **Why:** window-based on-demand dispatch needs a real-time "we're ~25 min out" ping keyed to truck departure — the signature junk-removal touch — not a fixed appointment clock

**GAP:job-complete**
- **Classification:** Universal miss
- **Proposed corpus home:** order-updates:job-complete (job-status sibling to order-delivered, for service rather than parcel)
- **Proposed universal name:** Job complete
- **Why:** any visit-based service (junk removal, landscaping, cleaning, pest) needs a "we finished, here's the recap" close-out that order-delivered doesn't quite fit
- **Draft variants:**
  - Standard: `{{workspace_name}}: We finished your pickup at {{location}} today. Details: {{action_link}} Reply STOP to opt out.`
  - Friendly: `All hauled away at {{location}} today - thanks! See the recap: {{action_link}} Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: Pickup done at {{location}}. {{action_link}} STOP to opt out.`

**GAP:estimate-ready**
- **Classification:** Universal miss
- **Proposed corpus home:** customer-support:estimate-ready (or account-events sibling; quote/estimate lifecycle is common to all quote-based trades, and here doubles as the on-site truck-space price approval)
- **Proposed universal name:** Estimate ready
- **Why:** quote-driven trades — and on-site-priced junk removal in particular — need a "your price is ready to view/approve" message with no real corpus home today
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your estimate is ready. Review and approve here: {{action_link}} Reply STOP to opt out.`
  - Friendly: `Good news - your {{workspace_name}} estimate is ready. Take a look and approve here: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Estimate ready. Review: {{action_link}} STOP to opt out.`

**GAP:payment-receipt**
- **Classification:** Universal miss
- **Proposed corpus home:** order-updates:payment-receipt (a paid/receipt sibling to refund-processed, for pay-on-completion services)
- **Proposed universal name:** Payment received
- **Why:** pay-on-completion services (junk removal, cleaning, mobile trades) need a "payment received, here's your receipt" confirmation; the corpus has refund-processed but no positive payment-received close-out
- **Draft variants:**
  - Standard: `{{workspace_name}}: Payment of {{refund_amount}} received for your pickup. Receipt: {{action_link}} Reply STOP to opt out.`
  - Friendly: `Thanks! We received your {{refund_amount}} payment. Here's your receipt: {{action_link}} Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: {{refund_amount}} payment received. Receipt: {{action_link}} STOP to opt out.`
- **New variables:** reuses `{{refund_amount}}` as a generic amount field (a dedicated `{{amount}}` would read cleaner — propose `{{amount}}` — the charged amount, e.g. "$285"; budget ~8 chars; source: the builder's invoice total; example: "$285").

**STRETCH:customer-support:ticket-received**
- **Classification:** Stretch
- **Proposed corpus home:** customer-support:ticket-received — fit gap: a "quote request received" acknowledgment reads as a support ticket, but junk removal has no ticket_number and the frame is sales-intake, not support
- **Proposed universal name:** Ticket received (used as quote-request acknowledgment)
- **Why:** corpus message works for "we got your request" but the {{ticket_number}} variable feels wrong for an estimate inquiry
- **Draft variants:**
  - Standard: `{{workspace_name}}: We got your junk-removal request. We'll text you an estimate soon. Reply STOP to opt out.`
  - Friendly: `Thanks for reaching out to {{workspace_name}} - we'll send a junk-removal estimate soon. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Got your request. Estimate coming. STOP to opt out.`

### Content constraints
- Standard carrier rules apply; no vertical-specific carrier restrictions for junk-removal transactional traffic.
- Express opt-in consent required before any automated texts; booking confirmations, window reminders, and the "on the way" ping are transactional but still require consent at booking.
- The "we're 25 min out" ping is time-sensitive but must still respect quiet-hours rules like any other A2P traffic.
- Seasonal-cleanout and win-back traffic is promotional — must run under the marketing category with separate explicit consent, EIN-gated, and a distinct opt-out.
- Keep job-day texts factual (window, status, price, payment); do not blend a promotional cleanout offer into a transactional reminder or it reclassifies as marketing.
- All 10DLC traffic must be sent from a TCR-registered number under a registered campaign — unregistered traffic is blocked outright by carriers.

### Disambiguation
Junk removal sits beside other route/dispatch home services (landscaping, cleaning, pest control, moving) and shares the booking + arrival-window + on-the-way + job-complete spine, so those workflows largely transfer. What keeps it Clear is a plain consumer service with standard transactional messaging — the only twist is the on-site quote, which is still an estimate-approval message, not regulated content. Watch two edges: the dumpster-rental side some haulers run is the same transactional shape (drop-off/pickup scheduling), not a separate regulated vertical; and "got more to clear out? $25 off" is promotional and must move to the consent-gated marketing lane even though it feels like a friendly post-job note. Pure truck/crew dispatch (which driver, which route) is the builder's own ops tooling, not RelayKit customer messaging, even though it resembles team-alerts.

### Sources
https://www.workiz.com/industries/junk-removal/
https://www.getjobber.com/industries/junk-removal-software/
https://www.housecallpro.com/industries/junk-removal-software/
https://www.servgrow.com/industry/junk-removal-software
https://www.yourdocket.com/junk-removal-software/
https://www.1800gotjunk.com/us_en/blog/pricing
https://www.thisoldhouse.com/moving/1-800-got-junk-review
https://dropcurb.com/blog/1800-got-junk-prices
https://www.infobip.com/blog/what-is-a2p-10dlc
https://junkitmobiledumpsters.org/terms
