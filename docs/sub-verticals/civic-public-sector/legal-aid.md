## Public defender / legal aid operational tooling
**Vertical:** Civic & public sector
**Bucket:** Not yet
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.
**URL slug:** /for/legal-aid

### What this builder is making
A case-management platform for grant- and government-funded civil legal aid offices and public defenders — software that runs eligibility screening and intake, tracks open matters, and manages calendars of hearings, court dates, and filing deadlines for low-income clients (LegalServer, Legal Files, Casebook, Clio's legal-aid configuration, JusticeHub-style client portals). Unlike a private-firm tool, it carries grant/funder reporting, income-eligibility logic, and a high-volume intake funnel where most applicants never become full representation matters. The communication layer exists to keep clients connected through long, multi-touch cases where a single missed date can end representation.

### Why they need SMS
A legal-aid client who misses an intake callback, a document deadline, or — most consequentially — a scheduled court hearing can lose representation entirely or, for a public-defender client, draw a bench warrant and pretrial incarceration (a Santa Clara County RCT cut bench warrants ~20% and pretrial jail time ~21% with 7/3/1-day text reminders). This population is reachable mainly by phone, often without stable email, housing, or data plans, so SMS is the one channel that lands at 98% open rates where email and mailed notices do not. The stakes — liberty, eviction, custody — make the reminder cadence operationally load-bearing rather than a convenience.

### Message categories
1. appointments — intake meetings, attorney consultations, and (critically) hearing/court-date reminders are the core high-stakes cadence; reminder-distant and reminder-proximate map directly onto multi-touch court-date reminders.
2. customer-support — intake-status and case-status updates behave like a ticket lifecycle (received → assigned to advocate → response → resolution/closure) more than any other corpus category.
3. waitlist — the eligibility/intake funnel is a queue: most applicants wait for a callback or a screening decision, mirroring joined → position-update → your-turn.
4. verification — phone-ownership proof at intake and portal login (verification-code, login-code).
5. account-events — portal account lifecycle (new-device-sign-in) for the client portal.

Excluded: marketing (legal aid does not run promotional/SHAFT-gated campaigns; MARKETING use case is inapplicable and EIN-gated against this entity type's intent), order-updates (no physical fulfillment), community (no membership/community surface), team-alerts (internal staff ops, not client-facing — out of scope for the client communication layer).

### Workflows

**Intake acknowledgment**
Sent when an applicant submits an intake/screening request so they know it was received and a screening decision is pending.
Sequence:
1. customer-support:ticket-received — "Intake received" — confirms the application landed and a screening callback is coming; ticket_number reframed as an intake/application reference.
Variable aliases (only where default would feel wrong):
- ticket_number: "your intake reference INT-4821"
- workspace_name: "Bay Area Legal Aid"

**Eligibility / intake status**
Sent as an applicant moves through income/conflict screening toward a representation decision.
Sequence:
1. waitlist:joined — "On the intake list" — applicant is in the screening queue awaiting review.
2. waitlist:position-update — "Intake status" — applicant moves forward in the screening queue.
3. customer-support:agent-assigned — "Advocate assigned" — a paralegal/attorney/advocate is now handling the matter; agent_name = advocate.
4. GAP:eligibility-decision — applicant is accepted for representation, referred out, or declined — no corpus message states an accept/decline outcome neutrally.

**Appointment reminder cadence (intake & consultations)**
Sent around scheduled in-office or phone meetings with an advocate.
Sequence:
1. appointments:confirmation — "Meeting confirmed" — confirms a scheduled intake or consultation; provider_name = advocate name.
2. appointments:reminder-distant — "Reminder: tomorrow" — day-before nudge.
3. appointments:reminder-proximate — "Reminder: soon" — ~1 hour before.
4. appointments:reschedule-confirmation — "Rescheduled" — when the meeting moves.
5. appointments:no-show-follow-up — "We missed you" — after a missed meeting, prompting a rebook.
Variable aliases (only where default would feel wrong):
- provider_name: "your advocate, Dana R."

**Hearing / court-date reminder**
The highest-stakes cadence — multi-touch reminders before a court appearance, the workflow with the strongest evidence base.
Sequence:
1. appointments:reminder-distant — "Court date: 7 days" — first reminder a week out (RCT cadence).
2. appointments:reminder-distant — "Court date: 3 days" — second reminder three days out.
3. appointments:reminder-proximate — "Court date: tomorrow / today" — final reminder the day before/morning of.
Variable aliases (only where default would feel wrong):
- appointment_time: "Dept 23, Hall of Justice, 8:30 AM Tue Jul 14"
- provider_name: "Judge / Dept 23"

Note: a court date is not an "appointment with a provider"; the appointments copy ("your appointment with {{provider_name}}") reframes awkwardly for a mandatory court appearance. Flagged as STRETCH below.

**Document-needed request**
Sent when the office needs a document (ID, pay stub, lease, prior order) from the client to advance the matter.
Sequence:
1. GAP:document-request — office requests a specific document by a date; no corpus message asks the recipient to supply/upload something.

**Case-status update**
Sent when there is meaningful movement on an open matter the client should know about.
Sequence:
1. customer-support:agent-response — "Case update" — there's an update/reply on the matter; ticket_link = portal matter view.
2. customer-support:proactive-outreach — "Checking in" — advocate reaches out when the matter needs the client's attention.

**Case closure**
Sent when a matter is resolved or closed.
Sequence:
1. customer-support:resolution-notification — "Case closed" — matter resolved/closed, with a pointer to reopen or follow up; ticket_number = matter reference.

### Message gaps

**GAP:eligibility-decision**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (legal-aid display alias over a customer-support-style notification)
- **Proposed universal name:** "Application decision"
- **Why:** an accept/refer/decline screening outcome has no neutral corpus equivalent and is the pivotal moment of the intake funnel.
- **Status:** FUTURE

**GAP:document-request**
- **Classification:** Universal miss
- **Proposed corpus home:** customer-support:document-request (a "we need something from you" notification, reusable across support, onboarding, and legal-aid)
- **Proposed universal name:** "Document requested"
- **Why:** no corpus message asks the recipient to provide/upload a document by a date — a common transactional need broader than legal aid.
- **Draft variants:**
  - Standard: `{{workspace_name}}: We need a document to move your case forward. Please upload it here: {{action_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: To keep things moving we need one document from you. Upload it here: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Document needed. Upload: {{action_link}} STOP to opt out.`
- **Status:** FUTURE

**STRETCH:appointments:reminder-distant**
- **Classification:** Stretch
- **Proposed corpus home:** appointments:reminder-distant / reminder-proximate, with a court-date fit gap (copy assumes an "appointment with a provider," not a mandatory court appearance)
- **Proposed universal name:** display alias "Court date reminder" over the existing reminder messages
- **Why:** the corpus reminder bodies frame a discretionary booking; a court date is mandatory, location-driven, and consequence-heavy, so the default phrasing reads wrong without a vertical alias.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Reminder - your court date is {{appointment_time}}. Bring your documents. Questions? {{cancel_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: Heads up - you have a court date {{appointment_time}}. Please plan to be there. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Court date {{appointment_time}}. Be there. STOP to opt out.`
- **Status:** FUTURE

### Content constraints
- Government/nonprofit-entity TCR pathway is the deferral reason: legal-aid orgs register as Government or Non-profit/Charity brand types (not standard company), a distinct vetting pathway and Trust-Score model RelayKit does not yet support end-to-end — same blocker as court communications.
- Client confidentiality: never put case specifics, charges, hearing outcomes, or PII in the SMS body; point to a secure portal/office. Attorney-client privilege and the confidential nature of the matter make body-level detail a non-starter.
- Consent: transactional/informational reminders need prior express consent (captured at intake when the client provides their number in context); all bodies carry "Reply STOP to opt out." No marketing/fundraising mixed into the client communication stream.
- A2P registration is mandatory — unregistered 10DLC traffic is carrier-blocked (effective Feb 1, 2025); TCPA exposure runs $500–$1,500 per message for unregistered/non-consented sends.
- No HIPAA/PHI through the proxy (D-18) — relevant where legal-aid matters touch health/benefits records.

### Disambiguation
This is distinct from private legal-practice tooling (a separate sub-vertical): legal aid is grant/government-funded, income-eligibility-gated, and runs a high-volume screening funnel where most applicants are never represented, versus a fee-billing private firm. It overlaps heavily with court communications but is the service provider's tooling, not the court's docket system — yet it inherits the same blocker: the government/nonprofit-entity TCR registration pathway RelayKit has deferred. The bucket is Not yet because that entity pathway, not any content restriction, gates entry; the workflows themselves (court-date reminders especially) are well-evidenced and high-value. It tips to Conditional once RelayKit supports Government/Charity brand registration and a confidentiality-safe configuration (portal-pointer bodies, no case detail), and the customer-pull materializes from legal-aid orgs rather than RelayKit pushing in.

### Sources
https://www.legalserver.org/civil-legal-aid/
https://www.legalserver.org/public-defender/
https://www.legalserver.org/features/communications/
https://www.clio.com/features/legal-aid-nonprofit-case-management-software/
https://www.legalfiles.com/product/legal-aid-case-management/
https://legalaidnc.org/justicehub/
https://justiceinnovation.law.stanford.edu/legal-aid-intake-screening-ai/
https://justiceinnovation.law.stanford.edu/projects/messenger/
https://impact.stanford.edu/article/simple-text-reminders-can-reduce-unnecessary-incarceration
https://www.nyu.edu/about/news-publications/news/2025/september/-text-message-reminders-for-court-appearances-reduce-warrants-an.html
https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12487872/
https://appointmentreminder.com/blog/legal-services-text-and-sms-templates-for-appointments/
https://callhub.io/blog/compliance/10dlc-2025-registration-callhub/
https://www.fransis.ai/articles/10dlc-registration-guide-2026
https://mytcrplus.com/tcr-registration-process-how-brand-registration-campaign-vetting-and-carrier-approval-actually-work/
https://www.campaignregistry.com/
