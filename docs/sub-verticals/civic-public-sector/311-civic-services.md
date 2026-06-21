## 311 / non-emergency civic services
**Vertical:** Civic & public sector
**Bucket:** Conditional
**URL slug:** /for/311-civic-services

### What this builder is making
A SeeClickFix-style platform where residents report non-emergency issues — potholes, graffiti, missed trash pickup, broken streetlights, illegal dumping — and a municipality routes each report to the right department or crew, tracks it through resolution, and closes the loop with the resident. The core object is a service request (a case) with a category, location, status, assigned department/crew, and a resolution. The builder is a govtech vendor or a city's own engineering team running constituent-request management, not an emergency-dispatch or mass-notification system.

### Why they need SMS
The single biggest source of resident distrust in 311 is the silent black hole: a report goes in and nothing comes back, so people stop reporting and call council members instead. SMS closes that loop at the two moments residents actually care about — an acknowledgment with a tracking number at submission, and a resolution confirmation when the crew is done — at near-100% open rates on numbers that often have no email on file. Cities like Chicago (ChiTEXT) and DC (Text to 311) already run text-based request and status flows, so the pattern is proven and expected.

### Message categories
The 311 service-request lifecycle is structurally the customer-support ticket lifecycle in a government context: request received → routed to a department/crew → work in progress → resolved → satisfaction. Map accordingly.

1. **customer-support** — exact lifecycle fit: ticket-received = request acknowledged, agent-assigned = routed to department/crew, agent-response = status/info update, resolution-notification = issue fixed/closed, csat-follow-up = "how did we do," service-status-alert = service-area disruption broadcast, proactive-outreach = duplicate/needs-more-info nudge. This is the spine of the vertical.
2. **verification** — phone-ownership proof when a resident opts into SMS updates for a request (login-code/verification-code patterns); also gates anonymous-reporter contact.
3. **account-events** — only if the platform has resident accounts (saved reports, dashboards); new-device-sign-in / account-suspended are edge uses, mostly N/A for anonymous reporting.

Excluded: order-updates (no physical fulfillment/shipping), appointments (311 is asynchronous case work, not booked slots — inspection scheduling would be a STRETCH, see gaps), waitlist (no queue-position model residents track), community (not membership onboarding), team-alerts (internal crew dispatch is a separate operational surface, not constituent-facing), marketing (government non-emergency notification must never carry promotional content).

### Workflows

**Service-request acknowledgment**
Sent the moment a resident submits a report, returning the tracking number.
Sequence:
1. customer-support:ticket-received — "Request received" — "Request #{{ticket_number}} received. We'll text updates." sent on submission with the case ID the resident uses to check status.
Variable aliases:
- ticket_number: "request #4821"

**Routing to department / crew**
Sent when the request is assigned to the responsible department or field crew.
Sequence:
1. customer-support:agent-assigned — "Assigned to crew" — "Your request is now with {{agent_name}}" where agent_name names the department or crew, not a person.
Variable aliases:
- agent_name: "Streets & Sanitation" / "the Forestry crew"
- ticket_number: "request #4821"

**Status update / in progress**
Sent when there's meaningful movement — scheduled, in progress, needs more info.
Sequence:
1. customer-support:agent-response — "Status update" — points to the request detail view with the latest note.
2. customer-support:proactive-outreach — "More info needed" — used when staff can't act without a clarifying detail (exact location, photo); prompts the resident to reply.
Variable aliases:
- ticket_number: "request #4821"
- ticket_link: "your request status"

**Resolution confirmation**
Sent when the crew marks the issue fixed and the case is closed — the loop-closing moment.
Sequence:
1. customer-support:resolution-notification — "Request resolved" — "Request #{{ticket_number}} is resolved" with a reopen path if the issue persists.
Variable aliases:
- ticket_number: "request #4821"
- ticket_link: "reopen this request"

**Satisfaction follow-up**
Sent after closure to gauge whether the fix actually satisfied the resident.
Sequence:
1. customer-support:csat-follow-up — "Rate this resolution" — links to a one-tap rating for the closed request.
Variable aliases:
- ticket_number: "request #4821"
- csat_link: "rate the fix"

**Service-area disruption broadcast**
Sent to residents in an affected area about a non-emergency service disruption — water main work, route-wide trash delay, planned road closure.
Sequence:
1. customer-support:service-status-alert — "Service notice" — "Service disruption in your area, ETA {{eta}}" with updates to follow.
Variable aliases:
- eta: "Fri evening"

**SMS opt-in verification**
Sent when a resident chooses to receive text updates on a request, proving phone ownership.
Sequence:
1. verification:verification-code — "Verification code" — confirms the number before any case updates flow to it.

### Message gaps

**STRETCH:appointments:confirmation**
- **Classification:** Stretch
- **Proposed corpus home:** appointments:confirmation / reminder-proximate, reused for inspection or pickup scheduling tied to a request (bulk-item pickup, code inspection, tree removal)
- **Proposed universal name:** scheduled visit confirmation
- **Why:** some 311 categories resolve via a scheduled crew visit the resident must be present for, which is appointment-shaped, not pure async case work — but it's a minority of request types and the appointments corpus covers it without new copy
- **Draft variants:** (Stretch)
  - Standard: `{{workspace_name}}: Request #{{ticket_number}} — a crew is scheduled for {{appointment_time}}. Reply STOP to opt out.`
  - Friendly: `Good news — a crew will handle request #{{ticket_number}} on {{appointment_time}}. Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: #{{ticket_number}} crew visit {{appointment_time}}. STOP to opt out.`

**GAP:duplicate-request-merged**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (close cousin of customer-support:resolution-notification; distinct because no work was done — the case was folded into another)
- **Proposed universal name (display alias):** "merged with existing request"
- **Why:** duplicate reports of the same pothole/issue are pervasive in 311; residents need to know their report counted but was consolidated, not ignored, or trust erodes
- **New variables:** master_ticket_number ("the active request #")

### Content constraints
- Government-entity 10DLC registration applies: the operating municipality (or the govtech vendor on its behalf) registers a Standard Brand with TCR using its EIN; messaging maps to ACCOUNT_NOTIFICATION / CUSTOMER_CARE use cases, not the Emergency use case — this is explicitly NON-emergency civic service.
- Emergency alerting (911, evacuation, weather, mass notification) is a SEPARATE regulatory and operational regime (often WEA/IPAWS or dedicated emergency-notification platforms) and must not be conflated with or sent through the same 311 campaign.
- Constituent consent: residents must opt in to per-request SMS updates; the request-submission flow is the natural consent capture point. Every body carries "Reply STOP to opt out." There is no carrier exemption for government/political/non-emergency 10DLC traffic.
- No promotional content: government non-emergency messaging must stay strictly transactional — no campaigns, surveys-beyond-CSAT, or civic-engagement marketing in these flows.
- Use crew/department names (not individuals) in assignment messages; avoid exposing staff personal identity.
- Brand-name the sender in every body so a resident recognizes the city, not an unknown short/long code.

### Disambiguation
This sits Conditional, not Clear, because the parent vertical (civic/public sector) brushes against emergency alerting, which is a different consent and infrastructure regime — but a pure non-emergency 311 request platform is a standard ticket-lifecycle use case with ordinary eligibility, which is what tips it eligible. Distinguish it from emergency/mass-notification systems (911 dispatch, IPAWS/WEA, reverse-911) that broadcast life-safety alerts under separate rules and should not be onboarded as 311. It is also distinct from generic customer-support SaaS only by context and copy: the lifecycle objects are identical (case in, routed, resolved, rated), so the customer-support corpus carries it with crew/department aliasing. Neighboring sub-verticals: permitting/licensing (Accela-style, appointment- and document-heavy), public-records/FOIA request tracking (request-lifecycle but document-delivery-shaped), and utility-billing notifications (account-events-heavy).

### Sources
https://www.civicplus.com/seeclickfix-311-crm/
https://seeclickfix.com/
https://www.civicplus.com/blog/crm/what-is-a-311-and-citizen-request-management-solution/
https://www.creatio.com/glossary/311-software
https://www.accela.com/solutions/service-request/
https://www.govpilot.com/how-it-works
https://www.chicago.gov/city/en/depts/311/supp_info/chitext.html
https://ouc.dc.gov/service/text-311
https://www.minneapolismn.gov/contact-us/texting-311/
https://callhub.io/blog/compliance/10dlc-2025-registration-callhub/
https://www.campaignregistry.com/resources/
https://learn.microsoft.com/en-us/azure/communication-services/concepts/sms/ten-digit-long-code-guidelines
