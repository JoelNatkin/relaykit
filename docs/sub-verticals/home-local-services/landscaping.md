## Landscaping / lawn care
**Vertical:** Home & local services
**Bucket:** Clear
**URL slug:** /for/landscaping

### What this builder is making
Field-service and route-management software for lawn-care and landscaping operators — the tool a solo mower or a multi-crew company uses to schedule recurring visits, build and optimize daily routes, dispatch crews, and bill per-visit or by subscription (think Jobber, Yardbook, Aspire, Arborgold, RealGreen). It tracks clients with recurring service plans (weekly mowing, monthly maintenance, seasonal clean-ups), per-property job details, crew assignments, and route order for the day. The builder's customers are crew owners; the people receiving texts are the homeowners and property managers on the route.

### Why they need SMS
Lawn service is route-driven and weather-dependent: a crew running 30 yards a day rolls up to gated, dog-occupied, or "please mow before the party" properties on a window the homeowner can't predict, and rain pushes the whole route by a day. A "we're 30 minutes out" or "rain pushed you to Thursday" text is the difference between a clean job and a locked gate, an unhappy client, or a wasted truck roll — and homeowners outdoors or at work won't see email in time. SMS hits the 3-minute open window that email and voicemail miss, exactly when access and timing are still changeable.

### Message categories
1. appointments — the spine of the product: recurring-visit reminders, on-the-way arrival, reschedules, and weather-driven date changes are the highest-volume, highest-value texts
2. order-updates — repurposed as job-status: service-complete and "crew finished, here's what we did" notifications close the loop on each visit
3. customer-support — quote/estimate follow-up, post-job touch-up requests, and issue handling
4. account-events — billing for the recurring subscription side: failed card on an auto-billed plan, plan confirmation
5. marketing — seasonal upsell and re-engagement (EIN-gated, separate consent): spring clean-up, mulch/aeration offers, win-back of lapsed clients
6. waitlist — secondary: route-capacity waitlists for new-client requests in a full service area
Excluded: community (no member-community construct), team-alerts (crew-internal dispatch exists but is the builder's own ops, not a RelayKit customer-messaging surface in V1 framing), verification (phone-ownership 2FA is generic signup, not a landscaping-specific job).

### Workflows

**Recurring visit reminder**
Tells a homeowner their scheduled mow/maintenance visit is coming so the gate is unlocked and the yard is clear.
Sequence:
1. appointments:reminder-distant — "Lawn Service" — sent the day before the scheduled route visit; "you're on tomorrow's route"
2. appointments:reminder-proximate — "Lawn Service" — sent ~30-60 min before the crew arrives (on-the-way); "crew arriving soon"

Variable aliases:
- provider_name: "your crew" (or the crew/team name, e.g. "Crew 2")
- appointment_time: "tomorrow morning" / "around 9am"

**Crew on the way**
The real-time arrival ping so the homeowner unlocks the gate, secures the dog, or moves cars.
Sequence:
1. GAP:crew-en-route — "Lawn Service" — sent when the crew is dispatched to or departs for the property; gives a live arrival window

**Weather / route reschedule**
Rain or ground saturation pushes the route; this moves the client's visit and prevents a wasted "where were you?" call.
Sequence:
1. appointments:reschedule-confirmation — "Lawn Service" — sent when the visit is moved to a new day; "rain pushed you to Thursday"

Variable aliases:
- appointment_time: "Thursday morning"
- provider_name: "your crew"

**Service complete**
Confirms the visit happened and what was done — the close-the-loop message after the crew leaves, especially when the homeowner wasn't home.
Sequence:
1. GAP:job-complete — "Lawn Service" — sent when the crew marks the job done; "we finished your yard today"
2. appointments:post-appointment — "Lawn Service" — optional follow-up for feedback/review after a completed visit

**Estimate / quote follow-up**
Chases a pending estimate so a warm lead converts before it goes cold.
Sequence:
1. customer-support:ticket-received — "Lawn Service" — STRETCH: sent when a quote request comes in to confirm it was received
2. GAP:estimate-ready — "Lawn Service" — sent when the estimate is prepared and ready to view/approve

**Post-job touch-up / issue**
Handles a "you missed a strip" or "gate left open" report after a visit.
Sequence:
1. customer-support:ticket-received — "Lawn Service" — confirms the touch-up request is logged
2. customer-support:resolution-notification — "Lawn Service" — confirms the crew returned or resolved it

**Recurring-plan billing**
Keeps an auto-billed maintenance subscription from silently lapsing on a dead card.
Sequence:
1. account-events:payment-failed — "Lawn Service" — sent when the saved card for the recurring plan is declined
2. account-events:subscription-confirmed — "Lawn Service" — sent when the plan is renewed, paused for winter, or changed

**New-client route waitlist**
Manages demand when a service area or route is at capacity and new requests have to queue.
Sequence:
1. waitlist:joined — "Lawn Service" — sent when a new-property request joins the route waitlist for a full area
2. waitlist:your-turn — "Lawn Service" — sent when route capacity opens and the property can be onboarded

**Seasonal upsell (marketing, separate consent)**
Promotes seasonal add-ons (spring clean-up, mulch, aeration, leaf removal) to opted-in clients.
Sequence:
1. marketing:promotional-offer — "Green Lawn Co" — sent when a seasonal service window opens; "spring clean-ups are booking now"

Variable aliases:
- offer: "spring clean-up & bed refresh, $X off"

**Lapsed-client win-back (marketing, separate consent)**
Re-engages a client who skipped last season.
Sequence:
1. marketing:re-engagement — "Green Lawn Co" — sent ahead of the season to a client who didn't renew; "ready to start mowing again?"

### Message gaps

**GAP:crew-en-route**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (close to appointments:reminder-proximate, but framed as a live "crew is on the road to you now" dispatch ping rather than a fixed-time reminder)
- **Proposed universal name:** Crew on the way (display alias)
- **Why:** route-based field service needs a real-time arrival window keyed to dispatch, not a fixed appointment clock

**GAP:job-complete**
- **Classification:** Universal miss
- **Proposed corpus home:** order-updates:job-complete (job-status sibling to order-delivered, for service rather than parcel)
- **Proposed universal name:** Job complete
- **Why:** any visit-based service (landscaping, cleaning, pest, pool) needs a "we finished, here's the recap" close-out that order-delivered doesn't quite fit
- **Draft variants:**
  - Standard: `{{workspace_name}}: We finished your service at {{location}} today. Details: {{action_link}} Reply STOP to opt out.`
  - Friendly: `All done at {{location}} today - thanks! See what we did: {{action_link}} Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: Service done at {{location}}. {{action_link}} STOP to opt out.`

**GAP:estimate-ready**
- **Classification:** Universal miss
- **Proposed corpus home:** customer-support:estimate-ready (or account-events sibling; quote/estimate lifecycle is common to all quote-based trades)
- **Proposed universal name:** Estimate ready
- **Why:** quote-driven trades need a "your estimate is ready to view/approve" message with no real corpus home today
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your estimate is ready. Review and approve here: {{action_link}} Reply STOP to opt out.`
  - Friendly: `Good news - your {{workspace_name}} estimate is ready. Take a look and approve here: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Estimate ready. Review: {{action_link}} STOP to opt out.`

**STRETCH:customer-support:ticket-received**
- **Classification:** Stretch
- **Proposed corpus home:** customer-support:ticket-received — fit gap: a "quote request received" acknowledgment reads as a support ticket, but landscaping has no ticket_number and the frame is sales-intake, not support
- **Proposed universal name:** Ticket received (used as quote-request acknowledgment)
- **Why:** corpus message works for "we got your request" but the {{ticket_number}} variable feels wrong for an estimate inquiry
- **Draft variants:**
  - Standard: `{{workspace_name}}: We received your request for {{service_name}}. We'll be in touch with an estimate soon. Reply STOP to opt out.`
  - Friendly: `Thanks for reaching out to {{workspace_name}} about {{service_name}} - we'll get you an estimate soon. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Got your {{service_name}} request. Estimate coming. STOP to opt out.`
- **New variables:** `{{service_name}}` — the landscaping service requested (e.g. "mowing", "spring clean-up"); budget ~24 chars; source: the builder's service catalog; example: "weekly mowing"

### Content constraints
- Standard carrier rules apply; no vertical-specific carrier restrictions for lawn-care transactional traffic.
- Express opt-in consent required before any automated texts; recurring-visit reminders and crew-arrival pings are transactional but still require consent at intake.
- Seasonal-upsell and win-back traffic is promotional — must run under the marketing category with separate explicit consent, EIN-gated, and a distinct opt-out.
- Keep service-day texts factual (timing, status, access); do not blend promotional add-ons into a transactional reminder or it reclassifies as marketing.
- "We're on the way" and "rain delay" texts are time-sensitive and must respect quiet-hours rules like any other A2P traffic.

### Disambiguation
Landscaping/lawn care sits beside other route-based home services (cleaning, pest control, pool service, snow removal, junk removal) — all share the recurring-visit + crew-on-the-way + service-complete spine, so workflows here largely transfer. What keeps it Clear is that the customer relationship is a straightforward consumer service with standard transactional messaging; nothing pushes it toward Conditional unless the builder layers in regulated chemical-application disclosures or starts brokering financing (lending content), neither of which is core. Watch the marketing line: "your lawn looks great, want aeration too?" feels like a friendly service note but is promotional and must move to the consent-gated marketing lane. Pure crew-internal dispatch (who's on which route) is the builder's own ops tooling, not RelayKit customer messaging, even though it superficially resembles team-alerts.

### Sources
https://www.getjobber.com/industries/lawn-care-software/
https://www.workyard.com/compare/lawn-care-scheduling-software
https://zentive.io/lawn-care/software/scheduling/
https://www.youraspire.com/blog/best-landscaping-route-planning-apps
https://textus.com/texting-guides/sms-templates-for-landscaping-lawn-care
https://build-folio.com/resources/landscaping-sms-templates/
https://textspot.io/industries/landscaping/
https://arborgold.com/blog/software-feature-highlights/texting-software-for-lawn-tree-care-businesses/
https://fieldplexus.com/blog/text-message-compliance-lawn-care
https://textellent.com/blog/landscaping-sms-marketing/
