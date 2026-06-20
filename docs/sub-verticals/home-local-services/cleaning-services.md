## Cleaning services (residential + commercial)
**Vertical:** Home & local services
**Bucket:** Clear
**URL slug:** /for/cleaning-services

### What this builder is making
A booking-and-dispatch platform for residential maid services and commercial janitorial crews — the Housecall Pro / ZenMaid / Jobber / Setmore lane and the indie "Handy/Tidy clone" lane. The software manages one-time deep cleans and recurring (weekly/bi-weekly/monthly) plans, assigns crews to jobs on a drag-and-drop calendar, tracks job status from en-route to complete, and bills the client after. The customer is rarely home and almost never at a desk during the service window, so the whole relationship runs through their phone.

### Why they need SMS
The signature moment is arrival: a crew is standing at a locked door needing the gate code, lockbox PIN, or pet secured, and the client has 30 minutes' notice at most — email loses this every time. The second is the recurring cadence: a missed or unconfirmed clean means a no-access lockout, a wasted crew slot, and an unbilled day. SMS confirms the slot, lands the on-my-way alert in real time, and closes the loop with a completion-and-pay text the client opens within minutes.

### Message categories
1. appointments — booking confirmations, the two-stage reminder, reschedule/cancel, and post-clean feedback are the core customer loop
2. account-events — invoice-ready and payment-failed messages drive cash flow on completed jobs and recurring plans
3. team-alerts — crew scheduling, shift reminders, and same-day reassignments coordinate the field workforce
4. customer-support — service-issue and damage/escalation follow-up after a clean
5. marketing — seasonal deep-clean and add-on promos (EIN-gated, separate consent)
Excluded: order-updates (no physical shipment lifecycle), verification (signup 2FA is generic, not vertical-shaped), community (no member community), waitlist (cleaning books slots directly, no queue).

### Workflows

**Booking confirmation**
Locks in a newly booked clean so the slot is held and the client expects the crew.
Sequence:
1. appointments:confirmation — "your cleaning service" — confirms crew/team and the service window right after booking.

Variable aliases (only where the default example would feel wrong for this sub-vertical):
- provider_name: "the Sparkle Team" (the assigned crew, not a single provider)
- appointment_time: "Tue Jun 23, 9-11 AM" (cleaning is sold as an arrival window, not a single time)

**Recurring-clean reminder + access prompt**
The day-before / hour-before nudge that prevents the no-access lockout on a scheduled clean.
Sequence:
1. appointments:reminder-distant — "your cleaning service" — day-before reminder of tomorrow's window, with cancel/reschedule link.
2. GAP:arrival-on-the-way — "your cleaning service" — morning-of/30-min-out "crew is on the way" alert prompting the client to unlock, share the gate/lockbox code, and secure pets.
3. appointments:reminder-proximate — "your cleaning service" — optional ~1-hour-out reminder when no separate on-the-way alert is used.

**Job completion + handoff**
Closes out the visit and tells the client the home is done and re-secured.
Sequence:
1. GAP:job-complete — "your cleaning service" — "your clean is finished, door locked and alarm reset" completion notice.
2. appointments:post-appointment — "your cleaning service" — feedback request on how the clean went.

**Invoice + payment**
Bills the completed job and recovers a failed charge on a card-on-file or recurring plan.
Sequence:
1. GAP:invoice-ready — "your cleaning service" — invoice for today's clean is ready, with a secure pay link.
2. account-events:payment-failed — "your cleaning service" — card on file for the recurring plan was declined; update to keep service active.

**Reschedule**
Confirms a moved clean so both client and crew calendar stay in sync.
Sequence:
1. appointments:reschedule-confirmation — "your cleaning service" — confirms the new window and assigned crew.

**Cancellation**
Acknowledges a cancelled clean and keeps the rebook path open.
Sequence:
1. appointments:cancellation-confirmation — "your cleaning service" — confirms cancellation with a rebook link.

**No-access / no-show follow-up**
Recovers a clean the crew couldn't perform because they were locked out or the client missed the window.
Sequence:
1. appointments:no-show-follow-up — "your cleaning service" — "we couldn't get in today — want to rebook?" with rebook link.

**Crew shift dispatch**
Tells cleaners where and when they're working and pushes same-day route changes.
Sequence:
1. team-alerts:shift-scheduled — "[Cleaning co.] crew" — assigns the cleaner a date, time, site, and role.
2. team-alerts:shift-reminder — "[Cleaning co.] crew" — reminder ahead of shift start.
3. team-alerts:shift-change — "[Cleaning co.] crew" — same-day reassignment when a job is moved, swapped, or a site changes.

Variable aliases (only where the default example would feel wrong for this sub-vertical):
- location: "412 Oak St, Unit 3" (a client site/address, not a store or office)
- role: "Lead cleaner"

**Crew cancellation**
Pulls a cleaner off a clean that got cancelled so they don't drive to it.
Sequence:
1. team-alerts:shift-cancellation — "[Cleaning co.] crew" — the assigned clean was cancelled.

**Service-issue / damage follow-up**
Handles a problem flagged during or after a clean (breakage, missed area, complaint).
Sequence:
1. customer-support:proactive-outreach — "your cleaning service" — reach out when an issue is logged against the visit.
2. customer-support:account-issue-resolved — "your cleaning service" — confirms the issue (e.g., redo or breakage claim) was resolved.

**Seasonal / add-on promo**
Fills the calendar with deep cleans and upsells add-ons (carpet, fridge, move-out) to opted-in clients.
Sequence:
1. marketing:promotional-offer — "[Cleaning co.]" — seasonal deep-clean or add-on offer with a claim link.

### Message gaps

**GAP:arrival-on-the-way**
- **Classification:** Universal miss
- **Proposed corpus home:** appointments:on-the-way
- **Proposed universal name:** On the way
- **Why:** No corpus message covers "we're en route now, here's your ETA" — a near-universal need for any provider that travels to the customer (cleaning, field service, mobile health, delivery handoff).
- **Draft variants:**
  - Standard: `{{workspace_name}}: your crew is on the way, arriving about {{eta}}. Please unlock and secure pets. Reply STOP to opt out.`
  - Friendly: `Heads up - your {{workspace_name}} crew is en route, arriving about {{eta}}. Please unlock and secure pets. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: crew en route, ETA {{eta}}. Unlock and secure pets. STOP to opt out.`
- **New variables:** `{{eta}}` — estimated arrival time, ≤12 chars, source: dispatch/route engine, example: "10:15 AM".

**GAP:job-complete**
- **Classification:** Universal miss
- **Proposed corpus home:** appointments:service-complete
- **Proposed universal name:** Service complete
- **Why:** appointments:post-appointment asks for feedback but there's no "the work is done / premises re-secured" completion notice, which any on-site service needs before the feedback ask.
- **Draft variants:**
  - Standard: `{{workspace_name}}: your clean is finished and the home is locked up. We'd love your feedback: {{feedback_link}} Reply STOP to opt out.`
  - Friendly: `All done! Your {{workspace_name}} clean is finished and the home's locked up. Tell us how it went: {{feedback_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: clean finished, home locked up. Feedback: {{feedback_link}} STOP to opt out.`

**GAP:invoice-ready**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:invoice-ready
- **Proposed universal name:** Invoice ready
- **Why:** account-events covers payment-failed and subscription changes but has no "your invoice is ready, pay here" message — needed by any service that bills after the job rather than charging up front.
- **Draft variants:**
  - Standard: `{{workspace_name}}: your invoice for today's clean is ready. Pay securely here: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} invoice for today's clean is ready. Pay securely here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: invoice ready for today's clean. Pay: {{account_link}} STOP to opt out.`

### Content constraints
- Standard carrier rules apply; A2P 10DLC brand + per-use-case campaign registration required (transactional confirmations/reminders separate from marketing promos).
- Keep gate codes, lockbox PINs, and alarm codes OUT of message bodies — prompt the client to share access in-app or via reply, never echo a code in an outbound text.
- No payment card details in SMS; use a secure pay link (`{{account_link}}`) per carrier guidance.
- Marketing (seasonal/add-on promos) requires separate explicit marketing consent and is EIN-gated; transactional consent does not cover it.
- Crew/staff coordination messages go to employees, not consumers — still subject to opt-out, keep them in team-alerts framing.

### Disambiguation
Cleaning services sit cleanly in the Clear bucket: standard home-services eligibility, no regulated content. The neighbor to watch is move-out / restoration / specialty cleaning that bundles into a property-management or real-estate relationship — once messages reference lease terms, deposits, or tenant collections, that drifts toward the debt-collection and property-management rules and would warrant a Conditional second look. Janitorial work under a commercial contract (B2B recurring) is still Clear, but the recipient is a facilities manager, not a consumer, so apply team/business framing rather than the residential homeowner voice. Nothing here touches healthcare, finance, or SHAFT content, so the only thing that looks allowed but isn't is leaking an access code (gate/lockbox/alarm) into a message body.

### Sources
https://www.housecallpro.com/industries/maid-service-software/
https://www.getjobber.com/industries/cleaning-business-software/
https://www.zoho.com/bookings/industries/scheduling-app-for-cleaning-business.html
https://www.setmore.com/industries/cleaning-services
https://sakari.io/blog/sms-for-cleaning-services-transform-your-business-through-better-customer-communication
https://textus.com/texting-guides/texting-guide-for-cleaning-services
https://schedulingkit.com/appointment-reminders/cleaning-services
https://www.leadduo.io/en/templates/cleaning-appointment-reminders
https://www.apptoto.com/best-practices/home-service-text-reminder
https://help.twilio.com/articles/4408675845019-SMS-Compliance-and-A2P-10DLC-in-the-US
https://www.termsfeed.com/blog/a2p-10dlc-compliance/
