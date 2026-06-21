## Emergency alerts / public safety notifications
**Vertical:** Civic & public sector
**Bucket:** Not yet, maybe not ever
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.
**URL slug:** /for/emergency-alerts

### What this builder is making
A public-safety or community-notification platform that lets a government agency, school, utility, or HOA push time-sensitive alerts — severe weather, evacuation, shelter-in-place, water-main breaks, road closures, all-clear — to residents who opted in by ZIP code or keyword. This is distinct from federal WEA: WEA/IPAWS is a FEMA-operated cell-broadcast system that pushes geo-targeted alerts to every handset in an area with no opt-in and no carrier A2P registration, while the product here runs over ordinary opt-in A2P SMS to a managed subscriber list (the "Nixle-for-X" shape). The builder maintains a subscriber roster, geo-zones, and reusable alert templates, and fires broadcasts when an incident is declared.

### Why they need SMS
When a flash-flood or evacuation order lands, the agency has minutes to reach residents before a decision becomes unsafe, and email and app push are too slow or too easily missed in that window. SMS hits the lock screen of a phone the resident already carries, with no app install, which is why opt-in alert programs route their highest-urgency tier to text. The consequence of a missed message here is not churn or a lost sale — it is a resident who didn't shelter or evacuate in time, which is exactly why the channel's reliability bar is set so high.

### Message categories
1. **team-alerts — system-alert / on-call-page** — the closest existing fit for a severity-cued incident broadcast (`{{severity}}`, an event type, an action link); the core "incident happened, here's what to do" message borrows this shape, but the audience is residents not staff, so it's a STRETCH (see gaps).
2. **community — community-announcement / welcome / live-event-reminder** — non-urgent civic updates (road closure scheduled, preparedness fair, sign-up confirmation) map cleanly onto community's informational tone and `{{community_name}}` sender frame.
3. **waitlist — joined** — only loosely, as a model for the opt-in confirmation pattern; the real subscription-confirmed alert is a GAP.

Excluded: marketing (no promotional content ever — public-safety messaging is the opposite of promotional), order-updates / appointments (no transactional commerce or booking), verification (no 2FA flow in a resident-alert product; opt-in keyword reply is consent, not a code), customer-support (residents aren't filing tickets against alerts).

### Workflows

**Subscriber opt-in / welcome**
Resident texts a ZIP or keyword to subscribe (or signs up on a web form); the program confirms enrollment and what they'll receive.
Sequence:
1. [community:welcome] — "Subscription confirmed" — confirms the resident is enrolled and which alert zone/types they'll get
2. [community:resource-pointer] — "How alerts work" — points to a page explaining alert tiers and how to update preferences

Variable aliases (only where default would feel wrong):
- community_name: "Sonoma County Alerts"
- resource_link: "alert preferences & FAQ page"

**Incident alert broadcast** *(highest-stakes workflow — the reason the bucket exists)*
When an incident is declared, the agency fires a single targeted broadcast to the affected geo-zone with the threat and the protective action.
Sequence:
1. [team-alerts:on-call-page] — "Emergency alert" — STRETCH: severity-cued threat + immediate protective instruction (evacuate / shelter / boil water) + info link; resident-facing, not staff on-call (see GAP:incident-alert-broadcast)

Variable aliases:
- severity: "EVACUATION ORDER" / "SHELTER IN PLACE" / "URGENT"
- system_name: would need to become an incident/location field, not a system — part of why this is a reframe

**Incident update / follow-up**
After the initial alert, the agency sends evolving guidance as the situation changes.
Sequence:
1. [community:community-announcement] — "Incident update" — STRETCH: changed conditions, revised instructions, link to latest (see GAP:incident-update)

**All-clear / resolution**
The agency signals the threat has passed and normal activity can resume.
Sequence:
1. [community:community-announcement] — "All clear" — GAP: the all-clear is a distinct message type ("situation resolved, safe to resume") with no clean corpus home (see GAP:all-clear)

**Preparedness / non-urgent reminder**
Scheduled, low-urgency civic notices: a planned road closure, hydrant flushing, a preparedness fair, or seasonal readiness prompts.
Sequence:
1. [community:live-event-reminder] — "Preparedness reminder" — reminder of a scheduled civic event or planned disruption
2. [community:community-announcement] — "Civic notice" — general non-urgent update

Variable aliases:
- event_name: "Wildfire Preparedness Fair"
- event_time: "Sat, Sep 12, 10am, City Hall"

### Message gaps

**GAP:incident-alert-broadcast**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (resident-facing incident alert); closest corpus relative is team-alerts:on-call-page / system-alert but audience and intent differ
- **Proposed universal name:** Incident alert (display alias "Emergency alert")
- **Why:** team-alerts is built for staff/on-call ACK-and-escalate flows, not a one-way life-safety broadcast to opted-in residents with a protective-action instruction
- **Draft variants:** (vertical-specific — skipped per format rules; drafted below as reference only because the protective-action framing is load-bearing)
  - Standard: `{{community_name}}: {{severity}} - {{instruction}} now. Info: {{info_link}} Reply STOP to opt out.`
- **New variables:** `instruction` ("Evacuate Zone 3" / "Shelter in place" / "Boil water before use")
- **Status:** FUTURE

**GAP:incident-update**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer; overlaps community:community-announcement but needs a sustained-incident, instruction-revising frame
- **Proposed universal name:** Incident update (display alias "Situation update")
- **Why:** community-announcement is for civic news, not for "conditions changed, here's your new instruction" mid-incident
- **Status:** FUTURE

**GAP:all-clear**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer; no corpus message expresses "threat resolved, resume normal activity"
- **Proposed universal name:** All clear
- **Why:** the resolution/all-clear is a recognized, distinct public-safety message type with no transactional-resolution analog in the corpus
- **Status:** FUTURE

**GAP:alert-subscription-confirmed**
- **Classification:** Universal miss
- **Proposed corpus home:** community:welcome covers the "you're in" beat, but a notification-program subscription confirm (which zone, which alert tiers) has no exact home; a dedicated subscription-confirmed message would generalize across any opt-in alert product
- **Proposed universal name:** Subscription confirmed
- **Why:** opt-in alert programs need to confirm enrollment scope (zone + tiers), which community:welcome's onboarding tone doesn't carry
- **Draft variants:**
  - Standard: `{{community_name}}: You're subscribed to {{alert_zone}} alerts. We'll text you when it matters. Reply STOP to opt out.`
  - Friendly: `You're signed up for {{community_name}} alerts in {{alert_zone}}. We'll only text when it counts. Reply STOP to opt out.`
  - Brief: `{{community_name}}: subscribed - {{alert_zone}} alerts on. STOP to opt out.`
- **New variables:** `alert_zone` ("ZIP 95401" / "North County")
- **Status:** FUTURE

**STRETCH:team-alerts:on-call-page**
- **Classification:** Stretch
- **Proposed corpus home:** team-alerts:on-call-page, reframed for resident audience (drop ACK/escalation, drop staff system framing)
- **Proposed universal name:** Incident alert (resident-facing)
- **Why:** the severity-first, shortest-in-category structure fits an urgent broadcast, but the on-call/ACK semantics are wrong for residents
- **Draft variants:**
  - Standard: `{{community_name}}: {{severity}} for {{alert_zone}}. {{instruction}} now. {{info_link}} Reply STOP to opt out.`
  - Friendly: `{{community_name}} {{severity}}: {{instruction}} in {{alert_zone}} now. Details: {{info_link}} Reply STOP to opt out.`
  - Brief: `{{community_name}} {{severity}}: {{instruction}}. {{info_link}} STOP to opt out.`
- **New variables:** `instruction`, `alert_zone`
- **Status:** FUTURE

### Content constraints
- WEA / IPAWS is out of scope: it is a FEMA-operated federal cell-broadcast system, not A2P SMS, and carries no carrier registration, no opt-in, and no per-message billing — RelayKit cannot and would not touch it.
- Opt-in emergency-notification SaaS runs over ordinary A2P 10DLC, but the relevant campaign type is TCR's EMERGENCY use case, which is restricted to government and healthcare/authority verticals and requires a special manual business review from T-Mobile — not a path an indie developer self-serves.
- Government-entity status (TCR "Government Entity: TRUE") unlocks the uncapped throughput/policy treatment that life-safety broadcasts depend on; without it, an alert program is throttled like ordinary A2P, which is unacceptable for time-critical reach.
- Consent is mandatory: residents must explicitly opt in (keyword, short code, or web form), and STOP must work — though public-safety "Urgent/Important" tiers are often the one tier subscribers cannot opt out of in vendor implementations, a nuance RelayKit's flat STOP model does not currently express.
- Life-safety messages carry an implicit reliability and latency expectation (priority routing, guaranteed delivery) that A2P long-code SMS does not contractually meet — a structural mismatch with RelayKit's product promise.
- No promotional content, ever; emergency messaging is the categorical opposite of marketing and is registered, vetted, and audited as such.

### Disambiguation
The defining split is WEA-vs-opt-in-A2P: federal Wireless Emergency Alerts ride FEMA's IPAWS over carrier cell broadcast and are entirely outside the A2P/10DLC world RelayKit operates in, so anything WEA-shaped is simply not a RelayKit product. The opt-in side (Nixle/Everbridge/Rave/CodeRED-style resident alerting) does run on A2P SMS, which is why it's even discussable — but it sits behind TCR's restricted EMERGENCY use case, requires verified government-entity status and a manual carrier review, and carries a life-safety reliability bar that ordinary long-code SMS doesn't meet. That combination (gov-entity gating plus reliability liability) is why the bucket is "not yet, maybe not ever" and customer-pull dependent: it's not a self-serve indie-developer shape. This is also distinct from 311/non-emergency civic service requests (a request-and-resolution flow, closer to customer-support) and from internal team-alerts (staff incident response with ACK/escalation, not resident broadcast).

### Sources
https://www.fema.gov/emergency-managers/practitioners/integrated-public-alert-warning-system/public/wireless-emergency-alerts
https://www.fcc.gov/consumers/guides/wireless-emergency-alerts
https://en.wikipedia.org/wiki/Wireless_Emergency_Alerts
https://www.everbridge.com/products/nixle/
https://nixle.com/emergency-notifications
https://supportcenter.nixle.com/hc/en-us/articles/19077392253211-Nixle-How-to-Subscribe-to-Nixle-Alerts
https://www.omnilert.com/blog/top-emergency-notification-systems-providers
https://www.gartner.com/reviews/market/emergency-mass-notification-services-solutions/compare/everbridge-vs-motorola-solutions-rave-mobile-safety
https://learn.microsoft.com/en-us/azure/communication-services/concepts/sms/ten-digit-long-code-guidelines
https://www.bandwidth.com/support/en/articles/12823087-10dlc-campaign-use-cases
https://www.bandwidth.com/support/en/articles/12823101-t-mobile-10dlc
https://www.quo.com/blog/the-campaign-registry/
https://www.text-em-all.com/blog/public-safety-sms-government-agencies-emergency-communication
https://www.omnilert.com/blog/emergency-alert-templates-severe-weather
https://socoemergency.org/get-ready/sign-up/
