## Real-estate referral / lead-gen SMS
**Vertical:** Financial services
**Bucket:** Not yet
**URL slug:** /for/real-estate-lead-gen
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.

### What this builder is making
Real-estate lead-gen / referral software that captures buyer and seller leads off IDX/portal search, landing pages, and ad forms, then routes each lead to an agent and runs follow-up drip sequences. The core engine is a lead CRM (think Follow Up Boss, BoldTrail/kvCORE, BoomTown, Lofty, Real Geeks, iHomefinder) with behavioral tracking — saved searches, property re-visits, open-house RSVPs — driving routing rules and nurture cadence. Referral builders add a layer that hands a lead off to a partner agent and tracks the closing for a fee split.

### Why they need SMS
The instant a lead submits a listing inquiry or open-house form, the platform texts them and the assigned agent — speed-to-lead is the whole product, with the five-minute window the industry's conversion gold standard. A lead un-answered for ten minutes is effectively lost to the next agent, and SMS (90-98% open, read within minutes) is the only channel fast enough to win that window. It also carries showing reminders and agent-assignment hand-offs where email is too slow.

### Message categories
1. waitlist — closest structural fit for the lead lifecycle: assignment, follow-up nudges, and hand-off-ready states map onto queue/turn/claim mechanics, though the framing is a stretch (see gaps)
2. appointments — showing confirmations, day-before and hour-before reminders, reschedules, no-show rebooking on property tours
3. customer-support — agent-assigned and agent-response patterns map cleanly onto "your agent is {{agent_name}}" hand-offs and inbound-reply threads
4. account-events — only for the platform's own SaaS billing/security to the agent-subscriber, not buyer/seller-facing
Excluded: order-updates (no fulfillment), team-alerts (no ops/on-call layer buyer-facing), community (no membership), verification (phone-ownership only, not a lead channel), marketing (the exact promotional cold-lead pattern carriers block hardest — see constraints)

### Workflows
**Speed-to-lead instant follow-up**
Text a new lead within seconds of form submission and confirm an agent is assigned.
Sequence:
1. GAP:lead-received-instant — "New lead acknowledged" — fires on form submit, before any human touch (see gaps)
2. customer-support:agent-assigned — "Your agent" — names the assigned agent the moment routing completes
3. customer-support:agent-response — "Agent replied" — when the agent sends the first real reply, threads it to SMS
Variable aliases (only where default feels wrong):
- agent_name: "Dana Ruiz"
- ticket_number: "INQ-4821" (lead/inquiry reference, not a support ticket)

**Property showing / tour reminders**
Confirm a booked showing and reduce no-shows with timed reminders.
Sequence:
1. appointments:confirmation — "Showing confirmed" — when a tour is booked
2. appointments:reminder-distant — "Tour tomorrow" — day before
3. appointments:reminder-proximate — "Tour in 1 hour" — hour before
4. appointments:no-show-follow-up — "Missed showing — rebook?" — after a missed tour
Variable aliases (only where default feels wrong):
- provider_name: "your agent Dana Ruiz"
- appointment_time: "Sat 2:00 PM, 14 Oak St"

**Referral hand-off**
Hand a lead to a partner agent and keep the lead informed of who's now helping them.
Sequence:
1. GAP:lead-received-instant — "New lead acknowledged" — on referral capture
2. customer-support:agent-assigned — "Your agent" — names the partner agent receiving the referral
3. appointments:confirmation — "Showing confirmed" — once the partner books a first tour

### Message gaps
**GAP:lead-received-instant**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:lead-received (or a new lead-lifecycle category at the sub-vertical registry layer if lead-gen is served broadly)
- **Proposed universal name:** "Lead received — instant acknowledgment"
- **Why:** the speed-to-lead first-touch fires before any agent, ticket, or appointment exists — no current category covers a sub-second "we got your inquiry, a person is coming" acknowledgment
- **Draft variants:**
  - Standard: `{{workspace_name}}: Got your inquiry on {{property_ref}}. {{agent_name}} will reach out shortly. Reply STOP to opt out.`
  - Friendly: `Thanks for reaching out to {{workspace_name}} about {{property_ref}} — {{agent_name}} will be in touch very soon. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Inquiry received. {{agent_name}} will reach out soon. STOP to opt out.`
- **New variables:** property_ref ("14 Oak St")
- **Status:** FUTURE — do not add to corpus until bucket changes.

**STRETCH:waitlist:your-turn**
- **Classification:** Stretch
- **Proposed corpus home:** waitlist:your-turn reused as a lead "agent is ready for you / claim a time" nudge; fit gap is that a lead is not in a literal queue — there's no position, grace window, or scarcity, so the waitlist framing over-promises
- **Proposed universal name:** "Agent ready — claim a time" (display alias over the waitlist body)
- **Why:** the claim-a-spot mechanic is structurally close to "your agent has time — book a tour," but the queue semantics don't hold
- **Draft variants:**
  - Standard: `{{workspace_name}}: {{agent_name}} has time to show you {{property_ref}}. Pick a slot: {{claim_link}} Reply STOP to opt out.`
  - Friendly: `Good news — {{agent_name}} at {{workspace_name}} can show you {{property_ref}}. Grab a time: {{claim_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{agent_name}} can show {{property_ref}}. Book: {{claim_link}} STOP to opt out.`
- **New variables:** property_ref ("14 Oak St")
- **Status:** FUTURE — do not add to corpus until bucket changes.

### Content constraints
- Real-estate lead-gen is the single highest-abuse category in carrier A2P enforcement data — carriers filter, throttle, and block it more aggressively than any other vertical.
- The core abuse pattern is cold-lead and purchased-list texting: blasting buyers/sellers who never opted in. This is exactly what carrier filtering and post-2023 one-to-one TCPA consent rules exist to stop.
- Consent provenance is everything: every recipient must have a documented, demonstrable opt-in tied to this specific sender — shared/affiliate opt-ins and bought lists fail.
- Any buyer/seller-facing promotional or new-listing blast would route to the marketing category, which is precisely the traffic carriers block hardest here — keep first-touch strictly transactional (inquiry acknowledgment, agent assignment, showing logistics).
- TCPA statutory damages run $500–$1,500 per message with no cap — the cold-outreach blast model is a direct liability multiplier.
- This is deferred for RelayKit-specific reasons — the ops headcount and content/consent filtering needed to police it safely — not a regulatory ban. Legitimate consented agent-client messaging is fully lawful.

### Disambiguation
There are two very different activities under one label. Legitimate: an agent or platform texting a buyer/seller who explicitly submitted an inquiry on a listing and consented — transactional acknowledgment, agent assignment, showing reminders. Illegitimate: cold-lead and purchased-list blasting to people who never interacted with the sender, which is the dominant pattern in this space and the most-filtered traffic on the carrier network. The two are visually similar in a campaign but fundamentally different in consent provenance, and RelayKit can't yet tell them apart at scale without heavy review. What moves this from "Not yet" to served is RelayKit operational capacity — headcount and tooling to verify consent provenance and police abuse at intake — not any change in regulation; the legitimate slice is already lawful today.

### Sources
https://www.followupboss.com/features/texting
https://www.eztexting.com/industries/real-estate
https://carrot.com/features/sms/
https://www.txtimpact.com/blog/sms-automation-real-estate-lead-response
https://bestreviews.net/speed-to-lead-why-sms-closes-sales
https://moxiworks.com/blog/real-estate-lead-generation-companies/
https://www.ihomefinder.com/blog/agent-and-broker-resources/idx-lead-generation/
https://www.goforclose.com/guides/text-blasting-real-estate
https://textdrip.com/blog/sms-compliance-real-estate-agent
https://www.infobip.com/blog/tcpa-compliance-sms
https://mytcrplus.com/solutions/real-estate-messaging-compliance/
https://www.beconversive.com/blog/10dlc-simplified
