## Architecture / engineering firms
**Vertical:** Professional services
**Bucket:** Clear
**URL slug:** /for/architecture-engineering

### What this builder is making
Firm-management and CRM tooling for architecture and engineering (A&E) practices — software in the lineage of Deltek Vantagepoint, Unanet, BQE CORE, and Monograph that ties together the project pipeline, phase-based delivery, time tracking, and milestone-driven invoicing. The builder's app tracks projects through design phases (schematic, design development, construction documents), coordinates subconsultants, schedules site visits and reviews, and drives billing off phase deliverables. It serves the principal, the project architect/PM, and their clients (owners, owner's reps, developers) as the people who need to be kept in the loop.

### Why they need SMS
A&E billing is milestone-based and contracts typically demand payment within 7–10 days of invoice — an invoice or approval request that sits unseen in an email inbox directly delays the firm's cash flow. When a site visit, submittal review, or client sign-off meeting moves, the principal and the client both need to know now, not when they next check email. SMS gets opened in minutes, so it wins exactly at the moments where a slow read costs the firm money or stalls a phase.

### Message categories
1. account-events — invoice/payment-failed and billing-lifecycle alerts are the cash-flow-critical messages A&E firms most need read
2. appointments — site visits, client review meetings, and walk-throughs are scheduled, rescheduled, and reminded constantly
3. customer-support — RFI / submittal / change-order threads behave exactly like a ticket lifecycle for the project team
4. team-alerts — internal deadline and deliverable-due pings to staff and subconsultants
5. verification — phone-ownership proof when clients/staff are invited into the firm's portal
Excluded: order-updates (no physical fulfillment/shipping), community (no membership community model), waitlist (no queue/availability model), marketing (firm growth is relationship-led BD, not opt-in promotional blasts; if a firm ever runs an event-invite campaign it would be a separate EIN-gated registration, not core)

### Workflows

**Site visit / field observation scheduling**
Keeps the client and owner's rep aligned on when the architect will be on site, which is billable and easy to no-show.
Sequence:
1. appointments:confirmation — "Site visit confirmed" — confirms the scheduled site visit/field observation with the named architect and time
2. appointments:reminder-distant — "Site visit tomorrow" — day-before reminder with a reschedule link
3. appointments:reminder-proximate — "Site visit in 1 hour" — hour-before nudge before the architect heads out
4. appointments:reschedule-confirmation — "Site visit moved" — confirms a moved visit (weather/access delays are common)
5. appointments:cancellation-confirmation — "Site visit cancelled" — confirms cancellation with a rebook link
6. appointments:no-show-follow-up — "We missed the visit" — follow-up when the client/site contact wasn't available
Variable aliases:
- provider_name: "Maria Chen, AIA"
- appointment_time: "Thu Jun 25, 9:00 AM, 410 Pine St site"

**Client review / design presentation meeting**
Drives attendance at phase-gate review meetings where sign-off unblocks the next phase.
Sequence:
1. appointments:confirmation — "Review meeting confirmed" — confirms the schematic/DD review with the project architect
2. appointments:reminder-distant — "Review tomorrow" — day-before reminder
3. appointments:post-appointment — "Thanks for the review" — post-meeting feedback/sign-off prompt
Variable aliases:
- provider_name: "the project team"
- feedback_link: "the sign-off form"

**Milestone invoice issued**
The core cash-flow workflow: tells the client a phase invoice is ready so the 7–10 day clock isn't lost to an unread email. (Uses a GAP message — see Message gaps.)
Sequence:
1. GAP:invoice-ready — "Invoice ready" — notifies the client a milestone invoice has been issued, with a view/pay link
2. GAP:invoice-reminder — "Invoice due soon" — reminder a few days before the payment deadline
3. GAP:payment-received — "Payment received" — confirms receipt and clears the thread

**Payment failed / overdue**
Recovers a failed card or lapsed payment on a retainer or autopay arrangement.
Sequence:
1. account-events:payment-failed — "Payment didn't go through" — card declined on a retainer/autopay invoice, with an update link
Variable aliases:
- card_last4: "the card on file"
- account_link: "your invoice portal"

**Retainer / subscription lifecycle**
Keeps clients on retainer agreements informed of renewals and changes.
Sequence:
1. account-events:subscription-confirmed — "Retainer updated" — confirms a retainer renewal or change
2. account-events:trial-ending — "Retainer balance low" — STRETCH: heads-up that a retainer balance is running down (see Message gaps)

**RFI / submittal / change-order thread**
Treats a client- or contractor-facing request (RFI, submittal review, change order) as a tracked lifecycle so nothing stalls a phase.
Sequence:
1. customer-support:ticket-received — "RFI logged" — confirms an RFI/submittal was received with its number
2. customer-support:agent-assigned — "Assigned to your PM" — names the architect/engineer handling it
3. customer-support:agent-response — "Reply on your RFI" — a response was posted, with a link to view
4. customer-support:resolution-notification — "RFI closed" — the item is resolved/approved
5. customer-support:csat-follow-up — "How did we do?" — optional satisfaction prompt on the resolved item
Variable aliases:
- ticket_number: "RFI-014"
- agent_name: "your project engineer"

**Proactive client outreach**
Lets the PM reach out when a deliverable or decision is blocking the client.
Sequence:
1. customer-support:proactive-outreach — "Need a decision from you" — flags that the firm is waiting on the client and invites a reply

**Deliverable / deadline staff alert**
Internal: pings staff and subconsultants on deadline and deliverable-due events.
Sequence:
1. team-alerts:system-alert — "Deliverable due" — severity-cued alert that a phase deliverable or permit-set deadline is approaching
2. team-alerts:escalation-ping — "Deadline at risk — ACK" — escalates to the principal if no acknowledgment
Variable aliases:
- severity: "DUE SOON"
- alert_type: "CD set deadline"
- system_name: "Riverside project"

**Portal access verification**
Verifies a client's or staff member's phone when they're invited into the firm portal.
Sequence:
1. verification:verification-code — "Verification code" — phone-ownership proof at portal signup
2. verification:login-code — "Login code" — SMS second factor on subsequent sign-ins

### Message gaps

**GAP:invoice-ready**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:invoice-issued
- **Proposed universal name:** Invoice issued
- **Why:** billing-driven businesses need to tell a customer an invoice is ready and payable, and no current account-events message covers issuance (only failure)
- **Draft variants:**
  - Standard: `{{workspace_name}}: Invoice {{invoice_number}} for {{amount_due}} is ready. View and pay: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} invoice {{invoice_number}} ({{amount_due}}) is ready. View and pay here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Invoice {{invoice_number}}, {{amount_due}} ready. {{account_link}} STOP to opt out.`
- **New variables:** `{{invoice_number}}` — the invoice identifier, ~10 chars, from the billing system, example "INV-2043"; `{{amount_due}}` — formatted amount owed, ~8 chars, from the billing system, example "$4,200"

**GAP:invoice-reminder**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:invoice-due-reminder
- **Proposed universal name:** Invoice due reminder
- **Why:** the read-critical moment for A&E is the few days before a contractual payment deadline, and no corpus message nudges an outstanding invoice
- **Draft variants:**
  - Standard: `{{workspace_name}}: Invoice {{invoice_number}} ({{amount_due}}) is due {{due_date}}. View and pay: {{account_link}} Reply STOP to opt out.`
  - Friendly: `A reminder from {{workspace_name}}: invoice {{invoice_number}} for {{amount_due}} is due {{due_date}}. Pay here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Invoice {{invoice_number}} due {{due_date}}. {{account_link}} STOP to opt out.`
- **New variables:** `{{due_date}}` — invoice due date, ~10 chars, from the billing system, example "Jun 30"

**GAP:payment-received**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:payment-received
- **Proposed universal name:** Payment received
- **Why:** the natural close to the invoice thread — confirming receipt — has no corpus home and applies to any billed-service business
- **Draft variants:**
  - Standard: `{{workspace_name}}: Payment of {{amount_due}} for invoice {{invoice_number}} received. Thank you. Reply STOP to opt out.`
  - Friendly: `Thanks! {{workspace_name}} received your {{amount_due}} payment for invoice {{invoice_number}}. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{amount_due}} received for {{invoice_number}}. Thank you. STOP to opt out.`

**STRETCH:account-events:trial-ending**
- **Classification:** Stretch
- **Proposed corpus home:** account-events:trial-ending — fits the "balance/time running out, take action" shape but its body is trial-and-plan framed, not retainer-balance framed
- **Proposed universal name:** Retainer balance low (display alias of Trial ending)
- **Why:** A&E retainers draw down a prepaid balance rather than expire a trial, so the days-remaining/choose-a-plan copy reads wrong
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your retainer balance is running low. Top up to keep work moving: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Heads up from {{workspace_name}} — your retainer balance is getting low. Top up here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Retainer balance low. Top up: {{account_link}} STOP to opt out.`

### Content constraints
- Transactional A&E messaging (invoices, site-visit reminders, RFI/submittal updates, deadline alerts) registers under ACCOUNT_NOTIFICATION / CUSTOMER_CARE use cases — standard carrier rules apply, no vertical-specific SHAFT restrictions.
- Consent is still required even though recipients are clients/contractors, not consumers — collect opt-in (typically at portal signup or in the engagement agreement) before texting; B2B does not exempt A&E from 10DLC opt-in rules.
- Keep promotional content (event invites, firm BD blasts) out of the transactional campaign — it would require a separate MARKETING registration on its own number.
- No credentials, dollar-detail beyond amount/invoice number, or project-confidential design data in message bodies; link to the portal instead.

### Disambiguation
The nearest neighbor is general construction / contractor management (Procore, builder GCs), which is more crew- and jobsite-coordination heavy and leans on team-alerts and field-worker dispatch; A&E here is the design-and-billing professional-services side, so its center of gravity is client-facing invoicing and appointments, not crew SMS. It also neighbors generic professional-services billing (law, accounting) — the workflows are nearly identical, and what keeps A&E firmly Clear is that all core messaging is transactional project/billing notification with clear opt-in, never cold outreach. The trap that tips a firm toward Conditional is BD/marketing: scraping a list of past RFP contacts or developers and texting them about the firm's new capabilities is unsolicited promotional messaging and must not ride the transactional campaign. Site-visit and review-meeting reminders look like ordinary appointment texts and are fine; only the promotional pivot changes the bucket.

### Sources
https://www.cmap.io/blog/crm-for-architects
https://treblehook.com/blog/what-is-crm-for-architecture-and-engineering-firms/
https://www.flowcase.com/blog/15-best-project-management-systems-for-aec-firms
https://www.deltek.com/en/architecture-and-engineering/architecture-software/crm
https://www.deltek.com/en/erp/vantagepoint/crm-and-pipeline-management
https://www.stambaughness.com/blog/7-reasons-aec-firms-choose-deltek-vantagepoint-crm-growth/
https://monograph.com/features/invoices
https://monograph.com/blog/guide-to-invoicing-for-architects
https://blog.bqe.com/invoicing-success-for-architects-strategies-for-accurate-billing-and-timely-payments
https://www.deltek.com/en/architecture-and-engineering/invoicing-architects
https://architecturalfees.com/invoicing-on-architectural-projects/
https://sakari.io/industries/sms-marketing-construction
https://www.textline.com/industries/construction
https://www.workast.com/blog/what-are-the-best-practices-for-using-sms-in-project-management/
https://sakari.io/blog/meeting-10dlc-compliance-with-opt-ins
https://www.txtimpact.com/blog/a2p-10dlc-registration-guide
https://notifyre.com/us/blog/10dlc-compliance
