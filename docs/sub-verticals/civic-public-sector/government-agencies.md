## Government agency communications (federal/state/local operational)
**Vertical:** Civic & public sector
**Bucket:** Not yet, maybe not ever
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.
**URL slug:** /for/government-agencies

### What this builder is making
A federal, state, local, tribal, or territorial agency running operational outreach to constituents — benefits enrollment and recertification (Medicaid, SNAP, WIC), license and permit renewals, in-person service appointments, application status updates, and required-document requests. The software is the agency's case or program system of record (or a bolt-on like Granicus GovDelivery, Notify.gov, OpenGov, or a Tyler/NIC platform) that knows each constituent's case status and deadline. SMS is the channel layered on top to reach people who miss email and mailed notices.

### Why they need SMS
The moment is a recertification or renewal deadline a constituent can easily miss — and missing it means losing health coverage or benefits, which costs both the family and the agency (re-enrollment churn is expensive to administer). Mailed notices and email go unread; a text lands. SMS wins because the message is short, time-boxed, and tied to a specific action the constituent must take before a fixed date.

### Message categories
1. appointments — in-person service appointments (benefits interviews, DMV, county office visits) are a core agency interaction with high no-show cost; confirmation + reminder map cleanly.
2. waitlist — service-window and callback queues (county office callbacks, program slots) fit the position/your-turn lifecycle when an agency manages a queue.
3. account-events — closest existing home for benefit-status and case-status changes (suspended/lapsed maps loosely to a benefit lapse), though the framing is a poor fit (see STRETCH).
4. customer-support — constituent service requests and case inquiries (status of an application, a submitted question) parallel the ticket lifecycle.
Excluded: marketing (agencies must stay neutral and non-promotional — promotional content is prohibited in constituent operational comms; SHAFT-C and EIN-gating are irrelevant here), order-updates (no physical fulfillment), team-alerts (internal ops, not constituent-facing — could apply to agency staff scheduling but out of scope for the constituent surface), verification (2FA exists in gov portals but is not the operational-comms story), community (membership/onboarding framing does not match a constituent relationship).

### Workflows

**Benefit recertification / renewal reminder**
Time-boxed reminders before a recertification or renewal deadline so the constituent acts before coverage lapses.
Sequence:
1. [appointments:reminder-distant] — "Renewal due soon" — sent well ahead of the deadline; tells the constituent a renewal/recertification is coming and points to the action. (STRETCH — appointment-reminder framing reused for a deadline, not a booked time.)
2. [appointments:reminder-proximate] — "Renewal due now" — sent close to the deadline as a last nudge. (STRETCH — same reuse.)
3. [account-events:account-suspended] — "Benefit lapsed" — sent only if the deadline passes without action; states the lapse and next steps to restore. (STRETCH — "account suspended" framing for a benefit lapse.)
The cleanest path is a dedicated benefit-status workflow — see GAP:benefit-status-update.

**Service appointment lifecycle**
In-person agency appointments (benefits interview, DMV, county office) confirmed and reminded to cut no-shows.
Sequence:
1. [appointments:confirmation] — "Appointment confirmed" — sent when an appointment is booked.
2. [appointments:reminder-distant] — "Appointment reminder" — sent the day before.
3. [appointments:reminder-proximate] — "Appointment reminder" — sent about an hour before.
4. [appointments:reschedule-confirmation] — "Appointment rescheduled" — sent if the time changes.
5. [appointments:no-show-follow-up] — "We missed you" — sent after a missed appointment to rebook.
Variable aliases (only where default would feel wrong):
- provider_name: "the County Benefits Office"
- workspace_name: "VA Benefits" (the agency/program name)

**Application status update**
Constituent who submitted an application gets told when its state changes.
Sequence:
1. [customer-support:ticket-received] — "Application received" — sent when an application is logged. (STRETCH — support-ticket framing for an application.)
2. [customer-support:agent-response] — "Update on your application" — sent when there is news to review.
3. [customer-support:resolution-notification] — "Application decided" — sent when the application is approved/closed. (STRETCH — "resolved" framing for an approval/denial.)
The cleaner path is a dedicated status workflow — see GAP:benefit-status-update and GAP:application-decision.

**Required-document request**
Agency needs a missing document (proof of income, ID, residency) before a deadline.
Sequence:
1. GAP:document-request — "Document needed" — sent when a case is missing a required document; states what is needed and the deadline.
2. [appointments:reminder-proximate] — "Document due soon" — reused as a deadline nudge if the document has not arrived. (STRETCH.)

**Constituent service request status**
Two-way service requests (pothole, code violation, utility concern) tracked to closure.
Sequence:
1. [customer-support:ticket-received] — "Request received" — sent when a service request is logged.
2. [customer-support:agent-assigned] — "Request assigned" — sent when routed to a department/handler.
3. [customer-support:resolution-notification] — "Request resolved" — sent when the request is closed.
Note: this overlaps heavily with the 311 (Conditional) row; for a general agency it is secondary to benefits/appointments.

**Emergency / public-service alert**
Time-critical public-safety notice (boil-water advisory, road closure, severe weather) to opted-in residents.
Sequence:
1. [customer-support:service-status-alert] — "Service alert" — sent when a public-service disruption or hazard is active. (STRETCH — vendor service-status framing reused for a civic alert; see STRETCH note.)

### Message gaps

**GAP:benefit-status-update**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (a civic/benefits status category, distinct from account-events)
- **Proposed universal name:** Benefit / case status update
- **Why:** a benefit or case changing state (active, lapsed, restored, recertified) is the central agency message and has no neutral corpus home — account-suspended carries punitive consumer-billing framing.
- **Status:** FUTURE

**GAP:document-request**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (civic case-action category)
- **Proposed universal name:** Required-document request
- **Why:** "we need a document from you by a date" is a distinct constituent action with no corpus equivalent — appointment reminders and support tickets both misframe it.
- **Status:** FUTURE

**GAP:application-decision**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (pairs with benefit-status-update)
- **Proposed universal name:** Application decision notice
- **Why:** an approval/denial/eligibility determination is a high-stakes neutral notice; customer-support:resolution-notification frames it as a closed ticket, which understates it.
- **Status:** FUTURE

**STRETCH:appointments:reminder-distant**
- **Classification:** Stretch
- **Proposed corpus home:** appointments:reminder-distant, reused for a renewal/recertification deadline rather than a booked appointment time
- **Proposed universal name:** Deadline reminder (distant)
- **Why:** the body references "your appointment is tomorrow," which does not fit a renewal deadline.
- **Draft variants:**
  - Standard: `{{workspace_name}}: reminder - your {{program_name}} renewal is due {{deadline}}. Renew here: {{action_link}} Reply STOP to opt out.`
  - Friendly: `A heads up from {{workspace_name}}: your {{program_name}} renewal is due {{deadline}}. Renew: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{program_name}} renewal due {{deadline}}. {{action_link}} STOP to opt out.`
- **New variables:** program_name ("Medicaid"), deadline ("Mar 31")
- **Status:** FUTURE

**STRETCH:account-events:account-suspended**
- **Classification:** Stretch
- **Proposed corpus home:** account-events:account-suspended, reused for a benefit lapse (better served by GAP:benefit-status-update)
- **Proposed universal name:** Benefit lapsed notice
- **Why:** "your account has been suspended" reads as a punitive consumer-billing action, not a neutral benefit-coverage lapse.
- **Draft variants:**
  - Standard: `{{workspace_name}}: your {{program_name}} coverage has lapsed. See how to restore it: {{action_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: your {{program_name}} coverage has lapsed. Here's how to get it back: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{program_name}} coverage lapsed. Restore: {{action_link}} STOP to opt out.`
- **New variables:** program_name ("Medicaid")
- **Status:** FUTURE

**STRETCH:customer-support:resolution-notification**
- **Classification:** Stretch
- **Proposed corpus home:** customer-support:resolution-notification, reused for an application decision (better served by GAP:application-decision)
- **Proposed universal name:** Application decision notice
- **Why:** "ticket is resolved" frames a benefits determination as a closed support case, understating a high-stakes decision.
- **Draft variants:**
  - Standard: `{{workspace_name}}: there's a decision on your {{program_name}} application. View it: {{action_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: your {{program_name}} application has a decision. See the details here: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{program_name}} application decision. {{action_link}} STOP to opt out.`
- **New variables:** program_name ("SNAP")
- **Status:** FUTURE

**STRETCH:customer-support:service-status-alert**
- **Classification:** Stretch
- **Proposed corpus home:** customer-support:service-status-alert, reused for a civic public-service alert (boil-water, road closure)
- **Proposed universal name:** Public-service alert
- **Why:** corpus body frames a vendor outage with an ETA; a civic safety alert needs neutral hazard/instruction framing, not a "we're working on it" SaaS tone.
- **Draft variants:**
  - Standard: `{{workspace_name}}: {{alert_summary}} affecting {{area}}. Details and what to do: {{action_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: heads up - {{alert_summary}} in {{area}}. Here's what to do: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{alert_summary}}, {{area}}. {{action_link}} STOP to opt out.`
- **New variables:** alert_summary ("boil-water advisory"), area ("the 02115 ZIP")
- **Status:** FUTURE

### Content constraints
- Government-entity SMS requires the TCR **Government** brand type — exclusively for verifiable agencies/entities of current government, distinct from Standard Brand and Charity (501(c)(3)) types. The brand's EIN/Tax ID, legal company name, and legal address must match government records to verify. RelayKit has not built this registration pathway, which is the reason this sub-vertical is deferred.
- Constituent consent and opt-in are central: federal practice (Notify.gov) layers a "credibility text" establishing the sender is trusted, always texts from the same number, and never asks for personal information over text — because constituents distrust unexpected texts as spam.
- Framing must stay neutral and non-coercive — no promotional content, no pressure tactics, no demands for personal/financial information over SMS. The marketing category and any promotional framing are categorically out of scope.
- Sensitive program data (Medicaid, SNAP, immigration, benefits eligibility) raises privacy exposure; messages point to a secure portal rather than carrying case detail in the body. (Healthcare/HIPAA already declined at intake per D-18 — benefits programs touching health coverage compound this.)
- Public benefits and many SLTT programs are federally funded; vendors in this space (Granicus, Notify.gov, Tyler/NIC) carry FedRAMP/ISO 27001 posture RelayKit does not currently claim.

### Disambiguation
This row is "Not yet, maybe not ever" specifically because government-entity SMS depends on the TCR Government brand-registration pathway, which RelayKit has not built — the EIN/brand verification flow assumes a Standard Brand, not a government entity, so a real agency cannot register today even though the use case is legitimate and high-value. It differs from the 311 civic-services row (Conditional): 311 can ride a municipality's existing vendor or a contractor's Standard Brand for narrow service-request status, whereas full operational agency comms (benefits, eligibility, renewals) sit squarely under the Government brand type. It differs from court communications and legal-aid (both "Not yet"): those are blocked on content/consent and surface-readiness rather than on a missing brand-registration pathway. What would tip this to served: RelayKit building and verifying the TCR Government brand pathway and demonstrating the privacy/security posture (consent handling, secure-portal linking) agencies expect — and, given the federal-vendor incumbents, genuine customer pull from a small agency or program that wants RelayKit specifically.

### Sources
https://www.gsa.gov/blog/2024/12/17/making-government-text-messaging-more-effective-with-notifygov
https://10x.gsa.gov/news/notify/
https://beta.notify.gov/about/why-text-messaging
https://www.gsa.gov/blog/2023/12/14/gsa-launches-pilot-partnerships-to-help-people-get-benefits-through-text-messaging
https://www.nextgov.com/digital-government/2023/12/gsa-launches-text-message-service-government-programs-four-localities-and-states/392815/
https://granicus.com/resource/six-essential-types-of-sms-for-government-communications/
https://granicus.com/product/govdelivery/
https://www.govtech.com/biz/granicus-two-way-messaging-aims-for-interactive-government
https://www.fransis.ai/blog/government-sms-communication-how-agencies-use-text-messaging-for-citizen-engagement
https://www.plivo.com/blog/how-government-agencies-can-leverage-sms/
https://opengov.com/products/government-app-library/constituent-relationship-management/
https://www.10dlc.org/tcr_quick_reference_guide.pdf
https://www.fransis.ai/articles/10dlc-registration-guide-2026
https://www.campaignregistry.com/resources/
