## Appliance repair

**Vertical:** Home & local services
**Bucket:** Clear
**URL slug:** /for/appliance-repair

### What this builder is making
A scheduling, dispatch, and job-tracking tool for appliance repair shops — the operator who fixes washers, dryers, refrigerators, ovens, and dishwashers in the customer's home. The software books service calls into arrival windows, routes a technician, tracks the job through a diagnose-then-order-parts-then-return lifecycle, and bills the homeowner. The defining feature versus other trades is the parts-wait gap: many jobs pause mid-repair while a part is ordered, so the job spans two visits days apart.

### Why they need SMS
A homeowner who took a half-day off work to sit in a 2-4 PM window will leave a one-star review the moment they feel forgotten — and the longest, most anxious gap is the silent week between "we ordered the part" and "we're coming back." SMS is the only channel a technician on a ladder can fire with one tap and the only one a homeowner reliably reads within minutes, which is what makes mid-job estimate approval ("here's the failed compressor and the cost — approve to proceed") actually work. Email arrives too late to save the appointment; the call goes to voicemail.

### Message categories
1. appointments — every job is a scheduled in-home visit with an arrival window, confirmation, reminder, reschedule, and a second visit when parts arrive; this is the spine.
2. customer-support — diagnosis results, mid-job authorization, parts-ordered / parts-arrived status, and "job complete" are status updates on an open service request, which maps to the ticket lifecycle.
3. account-events — invoice-due and payment-failed alerts after the job is billed.
4. marketing — seasonal maintenance reminders and service-plan promos (EIN-gated, separate consent).
Excluded: order-updates (no physical product shipped to the customer — parts ship to the shop, not the homeowner; the "status" they care about is the repair job, handled by customer-support), waitlist (no queue-for-a-spot model; jobs are booked into windows, not waitlisted), community (no membership/community surface), team-alerts (technician-facing dispatch coordination is plausible but not the builder's customer-facing job; out of scope here), verification (no consumer login/2FA surface in a repair-shop tool).

### Workflows

**Service call booked**
Confirms the in-home appointment the moment it's scheduled, so the homeowner has the window in writing.
Sequence:
1. appointments:confirmation — "{{workspace_name}} (the repair shop)" — confirms the technician and arrival window right after booking.

Variable aliases:
- provider_name: "tech Mike"
- appointment_time: "Tue 2-4 PM"

**Appointment reminder**
Cuts no-shows on jobs booked days out by reminding the day before and giving a reschedule path.
Sequence:
1. appointments:reminder-distant — "{{workspace_name}}" — day-before reminder of tomorrow's window with a cancel/reschedule link.
2. appointments:reminder-proximate — "{{workspace_name}}" — about an hour out, "your appointment is in 1 hour."

Variable aliases:
- appointment_time: "Tue 2-4 PM"

**Technician on the way**
Closes the anxiety gap inside the window by telling the homeowner the tech is actively en route.
Sequence:
1. GAP:tech-en-route — "{{workspace_name}}" — sent when the technician departs the prior job: "your tech is on the way, ETA ~25 min."

**Diagnosis and mid-job estimate approval**
Lets the technician get paid authorization to proceed without leaving the kitchen — the workflow that makes or breaks appliance repair margins.
Sequence:
1. customer-support:agent-response — "{{workspace_name}}" — after diagnosis, "we found the issue — here's your repair estimate. View and approve: {{ticket_link}}" (STRETCH: reframes a generic "ticket has a reply" into an estimate-ready notice).
2. GAP:estimate-approved — "{{workspace_name}}" — confirms the homeowner approved and the repair will proceed.

Variable aliases:
- ticket_number: "job #4821"
- agent_name: "tech Mike"

**Parts ordered → parts arrived → return visit**
Carries the homeowner through the multi-day parts wait that defines this trade, then rebooks the second visit.
Sequence:
1. GAP:parts-ordered — "{{workspace_name}}" — "the part for your {{appliance}} is ordered, ETA {{eta}}. We'll text when it's in."
2. GAP:parts-arrived — "{{workspace_name}}" — "your part is in — let's schedule the repair: {{reschedule_link}}."
3. appointments:reschedule-confirmation — "{{workspace_name}}" — confirms the second-visit window once rebooked.

Variable aliases:
- appointment_time: "Thu 9-11 AM"
- provider_name: "tech Mike"

**Repair complete**
Tells the homeowner the job is done and the appliance is fixed, closing the open service request.
Sequence:
1. customer-support:resolution-notification — "{{workspace_name}}" — "your repair is complete. Anything still off? {{ticket_link}}."

Variable aliases:
- ticket_number: "job #4821"

**Invoice and payment**
Collects on the completed job and recovers a failed card.
Sequence:
1. GAP:invoice-due — "{{workspace_name}}" — "your invoice for job {{ticket_number}} is ready: {{account_link}}."
2. account-events:payment-failed — "{{workspace_name}}" — if the card on file is declined, prompt to update payment.

**Review request**
Captures the satisfied-customer review that drives local-search ranking for repair shops.
Sequence:
1. customer-support:csat-follow-up — "{{workspace_name}}" — "how did we do on job {{ticket_number}}? Rate here: {{csat_link}}."

Variable aliases:
- ticket_number: "job #4821"

**No-show recovery**
Rebooks a homeowner who missed the window.
Sequence:
1. appointments:no-show-follow-up — "{{workspace_name}}" — "we missed you today — want to rebook? {{reschedule_link}}."

Variable aliases:
- provider_name: "tech Mike"

**Seasonal maintenance reminder** (marketing — separate consent, EIN-gated)
Brings back past customers for preventive service (dryer-vent cleaning, fridge-coil service) on a seasonal cadence.
Sequence:
1. marketing:promotional-offer — "{{business_name}}" — "time for your seasonal appliance tune-up: {{offer_link}}."

### Message gaps

**GAP:tech-en-route**
- **Classification:** Universal miss
- **Proposed corpus home:** appointments:on-the-way
- **Proposed universal name:** On the way
- **Why:** Field/in-home service across every trade needs a departure ping; the appointments category has confirmation and reminders but no en-route message.
- **Draft variants:**
  - Standard: `{{workspace_name}}: {{provider_name}} is on the way, ETA about {{eta}}. Reply STOP to opt out.`
  - Friendly: `Heads up - {{provider_name}} is headed your way now, ETA about {{eta}}. Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: {{provider_name}} on the way, ETA {{eta}}. STOP to opt out.`
- **New variables:** `{{eta}}` — estimated time to arrival, budget ~12 chars, source: dispatch/routing, example "25 min".

**GAP:parts-ordered**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (appliance-repair status alias)
- **Proposed universal name:** Parts ordered (display alias)
- **Why:** The diagnose-order-return parts gap is specific to repair trades and has no general-purpose corpus analog.

**GAP:parts-arrived**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (appliance-repair status alias)
- **Proposed universal name:** Parts arrived (display alias)
- **Why:** Pairs with parts-ordered to bridge the multi-day wait and trigger the return-visit rebooking; trade-specific.

**GAP:estimate-approved**
- **Classification:** Universal miss
- **Proposed corpus home:** customer-support:approval-confirmed
- **Proposed universal name:** Approval confirmed
- **Why:** Any service business taking mid-job or quote authorization by text needs a confirmation that the customer approved and work proceeds; no corpus message covers it.
- **Draft variants:**
  - Standard: `{{workspace_name}}: thanks - your approval on {{ticket_number}} is confirmed. We'll proceed with the repair. Reply STOP to opt out.`
  - Friendly: `Got your approval on {{ticket_number}} - we'll get to work on the repair. Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: approval on {{ticket_number}} confirmed. Proceeding. STOP to opt out.`

**GAP:invoice-due**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:invoice-ready
- **Proposed universal name:** Invoice ready
- **Why:** Service and B2B builders bill after work is done and need a "your invoice is ready / amount due" notice distinct from a failed-payment alert; account-events has payment-failed but no invoice-issued message.
- **Draft variants:**
  - Standard: `{{workspace_name}}: your invoice for {{ticket_number}} is ready, {{amount_due}}. View and pay: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} invoice for {{ticket_number}} is ready ({{amount_due}}). Pay here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: invoice {{ticket_number}} ready, {{amount_due}}. {{account_link}} STOP to opt out.`
- **New variables:** `{{amount_due}}` — invoice total owed, budget ~8 chars, source: billing system, example "$240".

**STRETCH:customer-support:agent-response**
- **Classification:** Stretch
- **Proposed corpus home:** customer-support:agent-response — fits as "your open job has an update to view," but the appliance-repair use is specifically "here is your repair estimate, approve to proceed," which carries a decision/authorization weight the generic "a reply is waiting" body doesn't signal.
- **Proposed universal name:** Agent response (corpus name retained)
- **Why:** The link-out-to-view pattern matches, but the estimate-approval intent is a stretch on the plain "reply waiting" framing.
- **Draft variants:**
  - Standard: `{{workspace_name}}: your repair estimate for {{ticket_number}} is ready. Review and approve: {{ticket_link}} Reply STOP to opt out.`
  - Friendly: `Your estimate for {{ticket_number}} from {{workspace_name}} is ready - review and approve here: {{ticket_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: estimate for {{ticket_number}} ready. Approve: {{ticket_link}} STOP to opt out.`

### Content constraints
- Standard carrier rules apply; appointment, status, and billing messages are transactional and ride the homeowner's opt-in from the booking form or service call.
- Seasonal maintenance and service-plan promos are marketing — require separate explicit marketing consent, EIN-gated, and may not piggyback on the transactional service-update consent.
- Every transactional body carries "Reply STOP to opt out." (Brief: "STOP to opt out.").
- No promotional or upsell content inside service-update messages (keep status texts to status).
- 10DLC registration is required; since Feb 2025 carriers block 100% of unregistered A2P traffic.

### Disambiguation
Appliance repair sits next to general handyman/HVAC/plumbing trades under home & local services, and the dispatch-and-arrival-window spine is shared across all of them — so the same appointments + on-the-way + review-request workflows port directly. What distinguishes appliance repair is the parts-wait lifecycle (diagnose → order → return), which makes the parts-ordered/parts-arrived status pair and mid-job estimate approval load-bearing here in a way they aren't for a one-visit plumbing snake. The line that would tip this from Clear toward Conditional is warranty or manufacturer-authorized work: a shop texting on behalf of a brand (Whirlpool, GE) under a service contract may carry consent and sender-identity nuance, but for an independent shop texting its own opted-in customers, it stays Clear. Note that "parts arrived, let's schedule" looks like an order-updates shipping message but is not — nothing ships to the homeowner, so it belongs in the appointment/service-status lane, not order-updates.

### Sources
https://www.workiz.com/industries/appliance-repair/
https://www.servicefusion.com/appliance-repair-software
https://orderry.com/appliance-repair-software/
https://www.getjobber.com/industries/appliance-repair-software/
https://orcatec.com/industries/appliance-repair
https://blog.salescaptain.com/business-texting-for-appliance-repair-companies-2025/
https://blog.salescaptain.com/two-way-texting-for-appliance-repair-companies/
https://fixyflow.com/for/appliance-repair
https://appliancemarketingpros.com/blog/appliance-repair-workflow-automation/
https://textdrip.com/blog/sms-reliable-channel-home-repair-maintenance-updates
https://resultcalls.com/blog/how-to-use-appliance-repair-sms-marketing
https://calljolt.com/blog/home-services/a2p-10dlc-compliance-guide-contractors
https://help.twilio.com/articles/4408675845019-SMS-Compliance-and-A2P-10DLC-in-the-US
