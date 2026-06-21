## Housing assistance / public-housing administration
**Vertical:** Civic & public sector
**Bucket:** Conditional
**URL slug:** /for/housing-assistance

### What this builder is making
A tool used by a public housing authority (PHA) or affordable-housing administrator to manage Section 8 / Housing Choice Voucher and public-housing caseloads — applicant waitlists, annual and interim recertifications, HQS inspection scheduling, voucher status, and work orders. The software tracks deadlines that govern whether a household keeps its subsidy, and routes applicants and participants between mailed notices, a tenant portal, and the housing specialist's office. Communication is the operational core: most benefit losses come not from violations but from a missed deadline or an unanswered notice.

### Why they need SMS
A participant who misses a recertification deadline or a scheduled HQS inspection can lose their voucher, and mailed notices and email routinely go unseen by the households most at risk. SMS reaches the phone in hand at the moment a document is due or an inspector is arriving, turning a silent missed-deadline termination into a reply or a portal visit. The consequence is severe and the audience is exactly the population least reliably reached by mail, so the channel that lands is the one that protects the benefit.

### Message categories
1. appointments — inspection and recertification interview scheduling, the highest-stakes timed events in the caseload (HQS appointments booked ~2 weeks out)
2. waitlist — applicant pool management is a defining PHA function: position updates and "your name is up, respond to keep your spot" notices
3. account-events — voucher/subsidy lifecycle status (suspended, reinstated) maps here as the participant's "account," pointing to office/portal not delivering the determination in-body
4. customer-support — case inquiries, document-received confirmations, service-status (office closure) alerts
5. team-alerts — internal staff/inspector scheduling and emergency staff notifications
Excluded: order-updates (no goods/fulfillment), marketing (PHAs do not sell; promotional content is off-mission and FDCPA-adjacent risk), community (no member-community model), verification (portal login MFA is possible but incidental, not a vertical workflow).

### Workflows

**Annual recertification deadline run**
The recurring re-examination cycle that decides whether a household keeps its subsidy; the central deadline-driven workflow.
Sequence:
1. GAP:recertification-packet-due — "Recertification packet due" — first notice that the annual re-exam packet/documents are due by a date, with a portal/office pointer
2. GAP:recertification-deadline-reminder — "Recertification reminder" — reminder a few days before the deadline that documents are still needed
3. appointments:confirmation — "Interview confirmed" — confirms the scheduled recertification interview date/time
4. appointments:reminder-distant — "Interview tomorrow" — day-before reminder of the interview
5. appointments:no-show-follow-up — "Missed interview" — sent after a missed interview, pointing to the office to reschedule (no termination language in-body)
Variable aliases (only where default would feel wrong):
- provider_name: "your housing specialist"
- feedback_link: (n/a — not used in this workflow)

**HQS inspection scheduling**
Housing Quality Standards inspections are booked roughly two weeks ahead and a missed inspection stalls the subsidy.
Sequence:
1. GAP:inspection-scheduled — "Inspection scheduled" — notice that an HQS inspection is set for a date/window
2. appointments:reminder-distant — "Inspection tomorrow" — day-before reminder to ensure access
3. appointments:reminder-proximate — "Inspection today" — same-day reminder that the inspector arrives in the window
4. appointments:reschedule-confirmation — "Inspection rescheduled" — confirms a new inspection date when changed
5. appointments:no-show-follow-up — "Missed inspection" — sent when access wasn't provided, pointing to the office to rebook
Variable aliases (only where default would feel wrong):
- provider_name: "the inspector"
- appointment_time: "Tue Jun 23, 9am-12pm"

**Applicant waitlist administration**
Voucher and public-housing waitlists can run years; keeping applicants responsive at the top of the list is a core function.
Sequence:
1. waitlist:joined — "Added to the waitlist" — confirms placement on the list
2. waitlist:position-update — "Waitlist position" — periodic position update
3. waitlist:almost-up — "Your name is coming up" — heads-up that selection is near, watch for the official packet
4. waitlist:your-turn — "Update your waitlist info" — name has reached the top; respond/confirm interest via portal or office to hold the spot
5. waitlist:grace-expiring — "Respond to keep your spot" — the response window is closing; respond by the date to stay on the list
6. waitlist:missed — "Removed from the waitlist" — the window lapsed; how to reapply when the list reopens
Variable aliases (only where default would feel wrong):
- claim_link: "{{portal_link}}"
- queue_position: "#142 on the list"

**Document and case status updates**
Keeps a participant informed that paperwork landed and where to go for anything sensitive.
Sequence:
1. customer-support:ticket-received — "Documents received" — confirms submitted documents/inquiry were received
2. customer-support:agent-assigned — "Your housing specialist" — names the specialist handling the case
3. customer-support:resolution-notification — "Review complete" — the review/case step is complete; details via portal or office
Variable aliases (only where default would feel wrong):
- ticket_number: "case {{case_number}}"
- agent_name: "your housing specialist"
- ticket_link: "{{portal_link}}"

**Voucher / subsidy status notice**
A neutral pointer when the subsidy status changes — never the determination itself in-body.
Sequence:
1. GAP:voucher-status-update — "Action needed on your voucher" — a status change or required action exists; review details at the office or portal (no eviction/termination wording in the text)
Variable aliases (only where default would feel wrong):
- account_link: "{{portal_link}}"

**Office and emergency notices**
Service-status and safety alerts to affected households.
Sequence:
1. customer-support:service-status-alert — "Office closure" — office closed (weather, holiday) and when it reopens
2. customer-support:proactive-outreach — "We noticed a missing item" — gentle nudge when a required item appears outstanding, inviting a reply/visit
Variable aliases (only where default would feel wrong):
- eta: "reopens Mon 8am"

**Staff and inspector scheduling**
Internal coordination of inspectors and front-line staff.
Sequence:
1. team-alerts:shift-scheduled — "You're scheduled" — staff/inspector assignment
2. team-alerts:shift-reminder — "Shift reminder" — ahead of the shift
3. team-alerts:system-alert — "Staff alert" — office-wide operational notice (closure, emergency)

### Message gaps

**GAP:recertification-packet-due**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (display alias over account-events or appointments framing)
- **Proposed universal name:** "Document deadline notice" / display alias "Recertification packet due"
- **Why:** the annual re-exam is the defining PHA deadline and no corpus message frames "documents due by a date, go to portal/office"
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your annual recertification packet is due {{due_date}}. Details and forms: {{portal_link}} or call our office. Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: time for your annual recertification. Packet due {{due_date}} - find it here: {{portal_link}} or call us. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: recert packet due {{due_date}}. {{portal_link}} STOP to opt out.`
- **New variables:** due_date, portal_link

**GAP:recertification-deadline-reminder**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** "Deadline reminder" / display alias "Recertification reminder"
- **Why:** a pre-deadline nudge is what actually prevents the missed-deadline subsidy loss; no corpus reminder fits a document deadline
- **Draft variants:**
  - Standard: `{{workspace_name}}: reminder - your recertification documents are due {{due_date}}. Submit or ask us: {{portal_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: a quick reminder, recert documents are due {{due_date}}. Need help? {{portal_link}} or call us. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: recert docs due {{due_date}}. {{portal_link}} STOP to opt out.`
- **New variables:** due_date, portal_link

**GAP:inspection-scheduled**
- **Classification:** Vertical-specific
- **Proposed corpus home:** appointments (display alias; behaves like a confirmation but originates with the authority, not a booking)
- **Proposed universal name:** display alias "Inspection scheduled"
- **Why:** HQS inspections are authority-initiated, not tenant-booked, so confirmation copy ("your appointment is confirmed") misframes it
- **Draft variants:**
  - Standard: `{{workspace_name}}: an HQS inspection is scheduled for {{appointment_time}}. Please ensure access. Questions: {{portal_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: your home inspection is set for {{appointment_time}}. Please be available or arrange access: {{portal_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: inspection {{appointment_time}}. Ensure access. {{portal_link}} STOP to opt out.`
- **New variables:** portal_link

**GAP:voucher-status-update**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (neutral pointer; intentionally never carries the determination)
- **Proposed universal name:** "Status notice — action needed" / display alias "Voucher action needed"
- **Why:** subsidy status changes are sensitive and FDCPA/fair-housing-adjacent; the only safe SMS is a neutral pointer to office/portal, which no corpus message provides
- **Draft variants:**
  - Standard: `{{workspace_name}}: there's an update on your voucher that needs your attention. Please review: {{portal_link}} or call our office. Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: we have an update about your voucher. Please check the portal or call us: {{portal_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: voucher update needs attention. {{portal_link}} or call us. STOP to opt out.`
- **New variables:** portal_link

### Content constraints
- No eviction-threat language: never state or imply termination, lease violation, court, or loss of subsidy in the SMS body — point to the office or portal for any determination
- FDCPA-adjacent hygiene: treat any past-due rent/balance message as a debt communication — send only 8am-9pm local, never imply legal consequences, never disclose a debt or amount in a message a third party could see
- Eviction notices cannot be delivered by SMS: federal rule requires written notice; texts and emails are not legally sufficient — never use SMS as the notice channel for eviction-related disclosures
- Point to office/portal for all sensitive updates: voucher status, recertification determinations, income/eligibility, and termination matters live behind authenticated portal or in-office, never in the message body
- Fair-housing / national-origin: SMS-only communication can disadvantage limited-English-proficiency households, who are protected under the Fair Housing Act — provide equivalent access (multilingual messages, portal, staff) and never make English a condition
- No promotional content: PHAs are not selling; keep every message transactional and on-mission
- No PII in body: no SSN, full address, income figures, case determinations, or balances in the text
- One sentence of action per message; sender frame first; "Reply STOP to opt out." at the end of every non-2FA body

### Disambiguation
This is Conditional rather than Clear because the communications sit one step from two restricted neighbors and stay eligible only by avoiding their framing. Against property management, the line is the subsidy: a PHA administers a public benefit with HUD deadlines, so its messages carry termination stakes that a private landlord's lease reminders do not — which is exactly why eviction-threat wording must stay out of the channel. Against debt collection, any past-due-rent message is FDCPA-adjacent (8am-9pm windows, no third-party disclosure, no implied legal consequence), and eviction notices can't be served by SMS at all. Against municipal utilities and general civic notices, the difference is the protected-population overlay — fair-housing and limited-English-proficiency obligations mean SMS must be one accessible channel among several, not the sole or conditional one. Keep status and determination content behind the office/portal pointer and the workflows stay clean.

### Sources
https://emphasyspha.com/housing-programs/
https://www.softwareadvice.com/property/affordable-housing-software-comparison/
https://nanmckay.com/hcv-and-public-housing/rent-reasonableness-and-waitlist-software
https://www.dialmycalls.com/housing-authorities
https://www.dialmycalls.com/property-management/property-inspection-alerts
https://www.nyc.gov/site/nycha/section-8/HQS-inspections.page
https://www.scchousingauthority.org/section-8/for-participants/existing-tenants/re-examinations/
https://www.hud.gov/sites/dfiles/Housing/documents/Section-8-Renewal-Guidebook.pdf
https://www.nyc.gov/site/nycha/section-8/tenants-faq.page
https://www.consumerfinance.gov/housing/housing-insecurity/help-for-renters/your-tenant-debt-collection-rights/
https://library.nclc.org/article/effective-may-3-new-federal-debt-collection-rule-eviction-practices-0
https://www.nolo.com/legal-encyclopedia/fdcpa-how-and-when-debt-collectors-can-contact-you.html
https://www.consumerfinance.gov/rules-policy/regulations/1006/6/
https://nlihc.org/resource/hud-issues-limited-english-proficiency-fair-housing-guidance
https://www.hud.gov/sites/dfiles/PIH/documents/HCV_Guidebook-Chapter_Fair-Housing_April-2025.pdf
