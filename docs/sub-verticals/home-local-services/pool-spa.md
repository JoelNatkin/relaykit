## Pool / spa maintenance
**Vertical:** Home & local services
**Bucket:** Clear
**URL slug:** /for/pool-spa

### What this builder is making
Field-service and route-management software for pool and spa service companies — the tool a solo route owner or a multi-tech outfit uses to build weekly service routes, schedule recurring cleaning/chemical visits, dispatch techs, log chemical readings and dosages at each stop, and bill per-visit or by monthly plan (think Skimmer, Paythepoolman, Orderry, ServiceTitan, Upper, EZ Pool Biller). It tracks customers on recurring service plans (weekly cleaning, chemical balancing, equipment checks), per-pool body-of-water details, route order for the day, and the proof-of-service report (chemical readings, photos, checklist) sent after each stop. The builder's customers are pool-service owners; the people receiving texts are the homeowners and property managers (HOA, apartment, hotel) on the route.

### Why they need SMS
Pool service is route-based and access-dependent: a tech runs 20-30 stops a day, rolling up to gated yards, locked equipment pads, and "the dog's out back" properties on a window the homeowner can't predict, and the customer usually isn't home for the 15-minute visit. A "we're 30 minutes out, please unlock the gate" text saves the truck roll, and a service-complete recap with chemical readings is the proof-of-service that prevents a "did you even come?" dispute. SMS hits the few-minute open window that email misses, exactly when access is still fixable and the visit is fresh — and the seasonal open/close text is how a route owner re-books the whole list each spring and fall.

### Message categories
1. appointments — the spine of the product: recurring-visit reminders, on-the-way arrival, reschedules, and weather-driven date changes are the highest-volume, highest-value texts
2. order-updates — repurposed as job-status: service-complete with chemical readings / the digital "proof-of-service" recap closes the loop on each stop the homeowner wasn't there for
3. customer-support — quote/estimate follow-up for repairs and equipment, plus issue handling (cloudy water, equipment fault) after a visit
4. account-events — billing for the recurring monthly plan: failed card on auto-billed service, plan confirmation, seasonal pause
5. marketing — seasonal open/close and upsell (EIN-gated, separate consent): spring opening, fall winterization, filter/equipment specials, win-back of lapsed routes
6. waitlist — secondary: route-capacity waitlists for new-customer requests in a full service area
Excluded: community (no member-community construct), team-alerts (tech-internal dispatch exists but is the builder's own ops, not a RelayKit customer-messaging surface in V1 framing), verification (phone-ownership 2FA is generic signup, not a pool-service-specific job).

### Workflows

**Recurring visit reminder**
Tells a homeowner their scheduled cleaning/chemical visit is coming so the gate is unlocked and the area is clear.
Sequence:
1. appointments:reminder-distant — "Pool Service" — sent the day before the scheduled route stop; "you're on tomorrow's route"
2. appointments:reminder-proximate — "Pool Service" — sent ~30-60 min before the tech arrives (on-the-way); "tech arriving soon, please unlock the gate"

Variable aliases:
- provider_name: "your tech" (or the tech/route name, e.g. "Route 2")
- appointment_time: "tomorrow morning" / "around 9am"

**Tech on the way**
The real-time arrival ping so the homeowner unlocks the gate, secures the dog, or moves cars before the tech reaches the pool.
Sequence:
1. GAP:crew-en-route — "Pool Service" — sent when the tech is dispatched to or departs for the property; gives a live arrival window

**Weather / route reschedule**
Storms, freeze, or a full route push the stop; this moves the customer's visit and prevents a wasted "where were you?" call.
Sequence:
1. appointments:reschedule-confirmation — "Pool Service" — sent when the visit is moved to a new day; "storms pushed you to Thursday"

Variable aliases:
- appointment_time: "Thursday morning"
- provider_name: "your tech"

**Service complete / proof-of-service**
Confirms the stop happened and shares the chemical readings, photos, and checklist — the close-the-loop "digital door hanger" the industry runs on, since the homeowner is almost never present for the visit.
Sequence:
1. GAP:job-complete — "Pool Service" — sent when the tech marks the stop done; "we serviced your pool today, here's the report with readings"
2. appointments:post-appointment — "Pool Service" — optional follow-up for feedback/review after a completed visit

**Skipped-stop notice**
Tells the customer the tech reached the property but couldn't service (locked gate, blocked access, dog out) so they fix it before the next route day.
Sequence:
1. GAP:visit-skipped — "Pool Service" — sent when the tech marks the stop unserviceable; "couldn't reach your pool today — gate was locked"

Variable aliases:
- location: "your pool"

**Repair / equipment estimate follow-up**
Chases a pending estimate for a pump, heater, or liner repair so a warm lead converts before it goes cold.
Sequence:
1. customer-support:ticket-received — "Pool Service" — STRETCH: sent when a repair/quote request comes in to confirm it was received
2. GAP:estimate-ready — "Pool Service" — sent when the estimate is prepared and ready to view/approve

**Post-visit issue (cloudy water / equipment fault)**
Handles a "water's still green" or "pump is loud" report after a visit.
Sequence:
1. customer-support:ticket-received — "Pool Service" — confirms the issue report is logged
2. customer-support:resolution-notification — "Pool Service" — confirms the tech returned or resolved it

**Recurring-plan billing**
Keeps an auto-billed monthly service plan from silently lapsing on a dead card, including the seasonal pause.
Sequence:
1. account-events:payment-failed — "Pool Service" — sent when the saved card for the recurring plan is declined
2. account-events:subscription-confirmed — "Pool Service" — sent when the plan is renewed, paused for winter, or changed

**New-customer route waitlist**
Manages demand when a service area or route is at capacity and new requests have to queue.
Sequence:
1. waitlist:joined — "Pool Service" — sent when a new-property request joins the route waitlist for a full area
2. waitlist:your-turn — "Pool Service" — sent when route capacity opens and the property can be onboarded

**Seasonal opening / closing (marketing, separate consent)**
The defining seasonal blast: re-books the whole route each spring (opening) and fall (winterization), the ritual that converts customers to annual agreements.
Sequence:
1. marketing:promotional-offer — "Blue Wave Pools" — sent when the opening/closing window opens; "pool openings are booking now — reply to claim your slot"

Variable aliases:
- offer: "spring pool opening, $X off — booking now"

**Seasonal upsell (marketing, separate consent)**
Promotes add-ons (filter cleans, equipment inspection, liner replacement, salt cell service) to opted-in customers.
Sequence:
1. marketing:promotional-offer — "Blue Wave Pools" — sent when an add-on service window opens; "filter cleans are 20% off this month"

Variable aliases:
- offer: "filter clean & equipment check, $X off"

**Lapsed-customer win-back (marketing, separate consent)**
Re-engages a route that didn't renew last season.
Sequence:
1. marketing:re-engagement — "Blue Wave Pools" — sent ahead of the season to a customer who didn't renew; "ready to get your pool back online?"

### Message gaps

**GAP:crew-en-route**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (close to appointments:reminder-proximate, but framed as a live "tech is on the road to you now" dispatch ping rather than a fixed-time reminder)
- **Proposed universal name:** Tech on the way (display alias)
- **Why:** route-based field service needs a real-time arrival window keyed to dispatch, not a fixed appointment clock

**GAP:job-complete**
- **Classification:** Universal miss
- **Proposed corpus home:** order-updates:job-complete (job-status sibling to order-delivered, for service rather than parcel; carries the proof-of-service / readings recap link)
- **Proposed universal name:** Job complete
- **Why:** any visit-based service (pool, landscaping, cleaning, pest) needs a "we finished, here's the recap" close-out — for pool service this is the chemical-readings proof-of-service that order-delivered doesn't fit
- **Draft variants:**
  - Standard: `{{workspace_name}}: We serviced {{location}} today. View readings and report: {{action_link}} Reply STOP to opt out.`
  - Friendly: `All done at {{location}} today! See your readings and report: {{action_link}} Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: Service done at {{location}}. Report: {{action_link}} STOP to opt out.`

**GAP:visit-skipped**
- **Classification:** Universal miss
- **Proposed corpus home:** order-updates:visit-skipped (job-status sibling to job-complete for the "we came but couldn't service" outcome common to all route-based field service)
- **Proposed universal name:** Visit skipped
- **Why:** route services routinely reach a property and can't perform the stop (locked gate, blocked access), and the customer needs a factual "couldn't service today, here's why" with no corpus home today
- **Draft variants:**
  - Standard: `{{workspace_name}}: We reached {{location}} today but couldn't service it: {{skip_reason}}. We'll try next route. Reply STOP to opt out.`
  - Friendly: `We stopped by {{location}} today but couldn't get in: {{skip_reason}}. We'll catch you next route. Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: Couldn't service {{location}}: {{skip_reason}}. STOP to opt out.`
- **New variables:** `{{skip_reason}}` — why the stop couldn't be serviced (e.g. "gate locked", "dog out", "pump off"); budget ~24 chars; source: the tech's skip-reason field in the app; example: "gate locked"

**GAP:estimate-ready**
- **Classification:** Universal miss
- **Proposed corpus home:** customer-support:estimate-ready (or account-events sibling; quote/estimate lifecycle is common to all quote-based trades, including pool repair/equipment)
- **Proposed universal name:** Estimate ready
- **Why:** repair-quote-driven trades need a "your estimate is ready to view/approve" message with no real corpus home today
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your estimate is ready. Review and approve here: {{action_link}} Reply STOP to opt out.`
  - Friendly: `Good news - your {{workspace_name}} estimate is ready. Take a look and approve here: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Estimate ready. Review: {{action_link}} STOP to opt out.`

**STRETCH:customer-support:ticket-received**
- **Classification:** Stretch
- **Proposed corpus home:** customer-support:ticket-received — fit gap: a "repair/quote request received" acknowledgment reads as a support ticket, but pool service has no ticket_number and the frame is repair-intake, not support
- **Proposed universal name:** Ticket received (used as repair-request acknowledgment)
- **Why:** corpus message works for "we got your request" but the {{ticket_number}} variable feels wrong for a repair/equipment inquiry
- **Draft variants:**
  - Standard: `{{workspace_name}}: We received your request for {{service_name}}. We'll be in touch with an estimate soon. Reply STOP to opt out.`
  - Friendly: `Thanks for reaching out to {{workspace_name}} about {{service_name}} - we'll get you an estimate soon. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Got your {{service_name}} request. Estimate coming. STOP to opt out.`
- **New variables:** `{{service_name}}` — the pool service requested (e.g. "pump repair", "pool opening"); budget ~24 chars; source: the builder's service catalog; example: "heater repair"

### Content constraints
- Standard carrier rules apply; no vertical-specific carrier restrictions for pool-service transactional traffic.
- Express opt-in consent required before any automated texts; recurring-visit reminders, on-the-way pings, and proof-of-service recaps are transactional but still require consent at intake (typically the booking form opt-in checkbox).
- Seasonal open/close blasts, upsell, and win-back traffic is promotional — must run under the marketing category with separate explicit consent, EIN-gated, and a distinct opt-out, even when sent to existing customers.
- Keep service-day and proof-of-service texts factual (timing, access, readings, status); do not blend promotional add-ons ("want a filter clean too?") into a transactional reminder or it reclassifies as marketing.
- "We're on the way," "skipped your stop," and "storm delay" texts are time-sensitive and must respect quiet-hours rules like any other A2P traffic.

### Disambiguation
Pool/spa maintenance sits beside the other route-based home services (landscaping, cleaning, pest control, snow removal) and shares the same recurring-visit + tech-on-the-way + service-complete spine, so those workflows transfer almost directly; what's distinctive is the chemical-readings proof-of-service recap and the spring-open/fall-close seasonal ritual. What keeps it Clear is a straightforward consumer/property-manager service relationship with standard transactional messaging — nothing pushes it toward Conditional unless the builder starts brokering equipment financing (lending content) or layers in regulated chemical-handling disclosures, neither of which is core. Watch the marketing line carefully here, because the seasonal open/close blast is the single most valuable message a pool route owner sends and it is unambiguously promotional — it must run in the consent-gated marketing lane, not slipped into the transactional reminder stream. Pure tech-internal dispatch and route assignment is the builder's own ops tooling, not RelayKit customer messaging, even though it resembles team-alerts.

### Sources
https://zeorouteplanner.com/pool-service-route-scheduling-software-complete-guide-2026/
https://orderry.com/pool-service-software/
https://schedulingkit.com/hub/scheduling/best-pool-service-scheduling-software
https://www.upperinc.com/businesses/pool-service-maintenance-routing-software/
https://www.servicetitan.com/industries/pool-service-software
https://www.paythepoolman.com/
https://www.getskimmer.com/product/technicians
https://www.getskimmer.com/product/clients
https://help.getskimmer.com/article/193-record-chemical-readings-and-dosages-for-a-work-order-app
https://www.goreminders.com/pool-services-text-reminders
https://www.smallscreenproducer.com/why-pool-spa-companies-need-customer-text-messaging/
https://blog.salescaptain.com/two-way-texting-for-pool-service-companies-2025/
https://www.bitesms.com/sms-marketing-tips/pool-cleaners
https://ezpoolbiller.com/how-to-create-a-sms-campaigns-plan-for-your-pool-company/
https://pool-routes-for-sale.com/how-to-use-text-message-marketing-in-pool-services/
https://help.twilio.com/articles/4408675845019-SMS-Compliance-and-A2P-10DLC-in-the-US
https://heavysettech.zendesk.com/hc/en-us/articles/39255219254931-How-to-Set-Up-A2P-10DLC-Compliance-for-Home-Services-Using-a-Local-Number
