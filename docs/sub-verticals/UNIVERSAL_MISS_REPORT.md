# Universal Miss Report
> Generated: 2026-06-20
> Input: all sub-vertical research files under /docs/sub-verticals/ (8 families, ~120 entries; excludes README.md and RESEARCH_PROCESS.md)
> Purpose: input for corpus expansion session

## Summary
- Total Universal miss entries found: 146 (plus 136 Stretch entries reviewed; significant-reframe Stretches folded into patterns per the classification rule)
- Unique patterns after deduplication: 46
- Recommended corpus additions: 26 (21 high-confidence by volume + 5 PM-pre-identified verified below)
- Refinements to existing messages (not new messages): 2
- New category candidates: 1 (Documents & e-signature — PM decision)
- Demoted to Vertical-specific: 19 patterns

**Headline finding:** the single largest cross-family gap is a **billing / accounts-receivable lifecycle** that no current category covers end to end — *invoice issued → payment due → past due → payment received* — flagged by ~25 distinct sub-verticals across home-local-services, professional-services, financial-services, civic, retail, and healthcare-admin. A close second is a **documents & e-signature lifecycle** (*document needed → signature requested → signature completed → item ready*) flagged across legal, accounting, tax, real-estate, healthcare-admin, government, and higher-ed. Both fit `account-events` by scope ("Billing, security, and lifecycle alerts") but each is cohesive enough that PM may prefer a dedicated category — see New Category Candidates.

---

## CORPUS ADDITIONS

### account-events:payment-due
**Proposed universal name:** Payment due reminder
**Flagged by:** 17 sub-verticals — correctional-services, court-communications, accounting-bookkeeping, banking-apps, consulting, architecture-engineering, design-studios, property-management (rent-due), self-storage (rent-due), trade-services, pet-retail (auto-ship), subscription-boxes (renewal), healthcare-admin (balance), medical-billing (statement/balance), virtual-clinic-admin (pre-visit balance), moving-services (balance), pet-services (balance)
**Rationale:** A proactive "amount X is due by date Y, here's how to pay" nudge — rent, invoices, bills, membership/subscription renewals, and outstanding balances all collapse to this one pattern; the corpus only has `payment-failed` (a reactive card decline), not a forward-looking due reminder.
**Draft variants:**
- Standard: `{{workspace_name}}: {{amount_due}} is due {{due_date}}. Pay or review: {{account_link}} Reply STOP to opt out.`
- Friendly: `Heads up from {{workspace_name}}: {{amount_due}} is due {{due_date}}. Pay here: {{account_link}} Reply STOP to opt out.`
- Brief: `{{workspace_name}}: {{amount_due}} due {{due_date}}. {{account_link}} STOP to opt out.`
**New variables:** `{{amount_due}}` — amount owed with currency, ~8 chars, source: billing record, example "$129.00"; `{{due_date}}` — due date, ~12 chars, source: billing schedule, example "Jun 28"
**CC action:** Add to `marketing-site/lib/message-library/account-events.ts`

### account-events:payment-received
**Proposed universal name:** Payment received
**Flagged by:** 11 sub-verticals — accounting-bookkeeping, architecture-engineering, consulting, cpa-practice, design-studios, legal-practice, property-management (rent received), junk-removal, faith-based-platforms (giving receipt), nonprofit-institutional (donation receipt), nonprofit-platforms (gift receipt)
**Rationale:** A money-arrived receipt/thank-you is missing entirely; sub-verticals are forced to mis-use `order-updates:refund-processed` (wrong direction) or `order-confirmed` (e-commerce framing). Donation/gift receipts are the nonprofit/faith flavor of the same message.
**Draft variants:**
- Standard: `{{workspace_name}}: Payment of {{amount_paid}} received. Thank you. Receipt: {{account_link}} Reply STOP to opt out.`
- Friendly: `Thanks! {{workspace_name}} received your {{amount_paid}} payment. Receipt: {{account_link}} Reply STOP to opt out.`
- Brief: `{{workspace_name}}: {{amount_paid}} received. Receipt: {{account_link}} STOP to opt out.`
**New variables:** `{{amount_paid}}` — amount received with currency, ~8 chars, source: payment record, example "$240.00"
**CC action:** Add to `marketing-site/lib/message-library/account-events.ts`

### account-events:invoice-issued
**Proposed universal name:** Invoice ready
**Flagged by:** 8 sub-verticals — appliance-repair, cleaning-services, home-improvement, trade-services, architecture-engineering, cpa-practice, design-studios, legal-practice
**Rationale:** The first-issuance "your invoice is ready, view and pay" event — distinct from the due-date reminder above — is a universal step for every service business that bills after the work.
**Draft variants:**
- Standard: `{{workspace_name}}: Invoice {{invoice_number}} for {{amount_due}} is ready. View and pay: {{account_link}} Reply STOP to opt out.`
- Friendly: `Your {{workspace_name}} invoice {{invoice_number}} ({{amount_due}}) is ready. Pay here: {{account_link}} Reply STOP to opt out.`
- Brief: `{{workspace_name}}: Invoice {{invoice_number}}, {{amount_due}}. {{account_link}} STOP to opt out.`
**New variables:** `{{invoice_number}}` — invoice identifier, ~10 chars, source: billing system, example "INV-2043"; `{{amount_due}}` (shared with payment-due)
**CC action:** Add to `marketing-site/lib/message-library/account-events.ts`

### account-events:payment-past-due
**Proposed universal name:** Payment past due
**Flagged by:** 4 sub-verticals — accounting-bookkeeping, consulting, property-management, self-storage
**Rationale:** The overdue escalation step; must be factual-only (FDCPA-adjacent) — point to portal/balance, no threat language. Closes the billing lifecycle (issued → due → past due → received).
**Draft variants:**
- Standard: `{{workspace_name}}: {{amount_due}} is now past due. Pay or review your balance: {{account_link}} Reply STOP to opt out.`
- Friendly: `{{workspace_name}}: your balance of {{amount_due}} is past due. You can take care of it here: {{account_link}} Reply STOP to opt out.`
- Brief: `{{workspace_name}}: {{amount_due}} past due. Pay: {{account_link}} STOP to opt out.`
**New variables:** `{{amount_due}}` (shared)
**CC action:** Add to `marketing-site/lib/message-library/account-events.ts`

### account-events:document-needed
**Proposed universal name:** Document needed
**Flagged by:** 8 sub-verticals — correctional-services, legal-aid, higher-education, veterans-services, tax-prep, health-insurance, legal-practice, real-estate-ops
**Rationale:** "We need a document/upload from you to continue" is a universal blocker-clearing message across any verification, intake, or case-progress flow; no corpus message asks the recipient to *supply* something.
**Draft variants:**
- Standard: `{{workspace_name}}: We need a document from you to continue. Upload it here: {{account_link}} Reply STOP to opt out.`
- Friendly: `{{workspace_name}}: One thing left — we need a document from you. Upload it here: {{account_link}} Reply STOP to opt out.`
- Brief: `{{workspace_name}}: Document needed. Upload: {{account_link}} STOP to opt out.`
**New variables:** none (reuses `{{account_link}}`)
**CC action:** Add to `marketing-site/lib/message-library/account-events.ts` (or a new Documents category — see New Category Candidates)

### account-events:signature-requested
**Proposed universal name:** Signature requested
**Flagged by:** 6 sub-verticals — consulting, cpa-practice, legal-practice, tax-practice-ops, tax-practice (financial-services), clinical-research
**Rationale:** "A document is ready for your e-signature" is the defining transactional message for every engagement-letter / proposal / contract / consent workflow; distinct from the verification OTP carve-out.
**Draft variants:**
- Standard: `{{workspace_name}}: A document is ready for your signature. Review and sign: {{account_link}} Reply STOP to opt out.`
- Friendly: `{{workspace_name}}: you have a document ready to sign — it only takes a minute: {{account_link}} Reply STOP to opt out.`
- Brief: `{{workspace_name}}: Document ready to sign: {{account_link}} STOP to opt out.`
**New variables:** none
**CC action:** Add to `marketing-site/lib/message-library/account-events.ts` (or a new Documents category)

### account-events:signature-completed
**Proposed universal name:** Signature received
**Flagged by:** 3 sub-verticals — consulting, cpa-practice, legal-practice
**Rationale:** The "your signature is in, agreement is live" confirmation that closes the signing loop; pairs with signature-requested.
**Draft variants:**
- Standard: `{{workspace_name}}: We received your signed document. Nothing more needed for now. Reply STOP to opt out.`
- Friendly: `{{workspace_name}}: got it — your document is signed and in. Thanks! Reply STOP to opt out.`
- Brief: `{{workspace_name}}: Signed document received. STOP to opt out.`
**New variables:** none
**CC action:** Add to `marketing-site/lib/message-library/account-events.ts` (or a new Documents category)

### account-events:deadline-reminder
**Proposed universal name:** Deadline reminder
**Flagged by:** 10 sub-verticals — higher-education, voter-registration, government-agencies, tax-practice (financial-services), tax-practice-ops, cpa-practice, real-estate-ops, legal-practice, health-insurance, tax-prep
**Rationale:** A non-payment "action window X closes on date Y" nudge (registration cutoffs, filing deadlines, enrollment windows, signature deadlines). Sub-verticals are mis-using `appointments:reminder-distant` (assumes a booked slot + cancel link) or `account-events:trial-ending` (billing framing). Optional distant/proximate pair like the appointments reminders.
**Draft variants:**
- Standard: `{{workspace_name}}: {{deadline_item}} closes {{due_date}}. Take action here: {{account_link}} Reply STOP to opt out.`
- Friendly: `{{workspace_name}}: heads up — {{deadline_item}} closes {{due_date}}. Don't miss it: {{account_link}} Reply STOP to opt out.`
- Brief: `{{workspace_name}}: {{deadline_item}} closes {{due_date}}. {{account_link}} STOP to opt out.`
**New variables:** `{{deadline_item}}` — the thing with a deadline, ~28 chars, source: workflow context, example "Aid acceptance" / "Q3 filing"; `{{due_date}}` (shared)
**CC action:** Add to `marketing-site/lib/message-library/account-events.ts`

### account-events:status-update
**Proposed universal name:** Status update
**Flagged by:** 10 sub-verticals — higher-education, voter-registration, veterans-services, government-agencies, recruiting-staffing, tax-practice-ops, tax-practice (financial-services), real-estate-ops, consulting (project milestone), solar-installation (milestone)
**Rationale:** A generic "your application / case / return / project status changed — view details" message; sub-verticals stretch `subscription-confirmed` and `customer-support:resolution-notification` to cover it. Covers application decisions and project-milestone updates as flavors.
**Draft variants:**
- Standard: `{{workspace_name}}: There's an update on your {{item_label}}. View the details: {{account_link}} Reply STOP to opt out.`
- Friendly: `{{workspace_name}}: your {{item_label}} just moved forward — take a look: {{account_link}} Reply STOP to opt out.`
- Brief: `{{workspace_name}}: {{item_label}} updated. Details: {{account_link}} STOP to opt out.`
**New variables:** `{{item_label}}` — what changed, ~20 chars, source: workflow context, example "application" / "case" / "return" / "project"
**CC action:** Add to `marketing-site/lib/message-library/account-events.ts`

### account-events:new-message
**Proposed universal name:** New message waiting
**Flagged by:** 7 sub-verticals — dating-apps, social-discovery, mental-health (secure message), cpa-practice (portal message), legal-practice (portal message), private-investigation (portal message), health-condition-management (coach replied)
**Rationale:** "You have a new message — open the app/portal to read it" is universal across consumer apps with inboxes and professional client portals (where the body must stay out-of-band for privilege/confidentiality). Sub-verticals stretch `customer-support:agent-response` (ticket framing).
**Draft variants:**
- Standard: `{{workspace_name}}: You have a new message. Read and reply here: {{account_link}} Reply STOP to opt out.`
- Friendly: `{{workspace_name}}: you've got a new message waiting. Read it here: {{account_link}} Reply STOP to opt out.`
- Brief: `{{workspace_name}}: New message. {{account_link}} STOP to opt out.`
**New variables:** none
**CC action:** Add to `marketing-site/lib/message-library/account-events.ts`

### account-events:payout-sent
**Proposed universal name:** Payout sent / Transfer complete
**Flagged by:** 7 sub-verticals — earned-wage-access, payments, personal-investing (withdrawal), remittance (funds available), gambling (payout), influencer-marketplaces (payout), ticket-resale (seller payout)
**Rationale:** Outbound money movement — a payout/withdrawal/transfer leaving the platform to the user's destination — has no home; sub-verticals invert `payment-failed`/`refund-processed`/`subscription-confirmed`. Distinct from `order-updates:refund-processed` (a reversal, not an earned payout).
**Draft variants:**
- Standard: `{{workspace_name}}: Your {{amount}} is on its way to your {{destination}}. Details: {{account_link}} Reply STOP to opt out.`
- Friendly: `{{workspace_name}}: {{amount}} is on the way to your {{destination}}. Reply STOP to opt out.`
- Brief: `{{workspace_name}}: {{amount}} sent to your {{destination}}. STOP to opt out.`
**New variables:** `{{amount}}` — amount with currency, ~10 chars, source: payout record, example "$450"; `{{destination}}` — where it landed, ~14 chars, source: payout settings, example "bank account"
**CC action:** Add to `marketing-site/lib/message-library/account-events.ts`

### account-events:payout-failed
**Proposed universal name:** Payout failed
**Flagged by:** 3 sub-verticals — payments, influencer-marketplaces, ticket-resale
**Rationale:** The outbound counterpart to payment-failed — "we couldn't send your payout, fix your details to get paid"; distinct from an inbound card decline.
**Draft variants:**
- Standard: `{{workspace_name}}: We couldn't send your payout. Check your details: {{account_link}} Reply STOP to opt out.`
- Friendly: `{{workspace_name}}: your payout didn't go through. Update your details here: {{account_link}} Reply STOP to opt out.`
- Brief: `{{workspace_name}}: Payout failed. Fix details: {{account_link}} STOP to opt out.`
**New variables:** none
**CC action:** Add to `marketing-site/lib/message-library/account-events.ts`

### appointments:en-route
**Proposed universal name:** On the way (provider en route)
**Flagged by:** 9 sub-verticals — appliance-repair, cleaning-services, home-improvement, moving-services, pest-control, pet-services, solar-installation, notary-services, trade-services (+ food-delivery "driver approaching" as a proximate variant)
**Rationale:** For every mobile/field service, "your provider is on the way, ETA X" is the single most-requested SMS; the corpus only models the customer traveling *to* a provider (reminder-proximate), never the provider traveling to the customer. A tighter "arriving soon" proximate variant (food-delivery, moving) belongs in the same message.
**Draft variants:**
- Standard: `{{workspace_name}}: {{provider_name}} is on the way, ETA about {{eta}}. Reply STOP to opt out.`
- Friendly: `Heads up — {{provider_name}} is headed your way, ETA about {{eta}}. Reply STOP to opt out. - {{workspace_name}}`
- Brief: `{{workspace_name}}: {{provider_name}} on the way, ETA {{eta}}. STOP to opt out.`
**New variables:** `{{eta}}` — estimated time to arrival, ~12 chars, source: dispatch/routing, example "25 min"
**CC action:** Add to `marketing-site/lib/message-library/appointments.ts`

### appointments:service-complete
**Proposed universal name:** Service complete
**Flagged by:** 8 sub-verticals — cleaning-services, junk-removal, landscaping, pool-spa, locksmith, trade-services, notary-services, caregiving
**Rationale:** "The job is done" is a universal field-service terminal state (often carrying a recap/feedback/receipt link); the corpus has `order-delivered` for parcels but nothing for completed on-site work.
**Draft variants:**
- Standard: `{{workspace_name}}: your service is complete. Details: {{feedback_link}} Reply STOP to opt out.`
- Friendly: `All done! Your {{workspace_name}} service is complete. Tell us how it went: {{feedback_link}} Reply STOP to opt out.`
- Brief: `{{workspace_name}}: service complete. {{feedback_link}} STOP to opt out.`
**New variables:** none (reuses `{{feedback_link}}`)
**CC action:** Add to `marketing-site/lib/message-library/appointments.ts`

### appointments:rebook-reminder
**Proposed universal name:** Time to rebook / Service due
**Flagged by:** 4 sub-verticals — pest-control, pet-services, trade-services (seasonal tune-up), veterinary (service due)
**Rationale:** A recurring-cadence "you're due for your next visit — book a time" nudge where *no appointment exists yet*; distinct from a confirmed-appointment reminder.
**Draft variants:**
- Standard: `{{workspace_name}}: Your next visit is due. Pick a time: {{reschedule_link}} Reply STOP to opt out.`
- Friendly: `Time for your next {{workspace_name}} visit. Grab a slot here: {{reschedule_link}} Reply STOP to opt out.`
- Brief: `{{workspace_name}}: Next visit due. Book: {{reschedule_link}} STOP to opt out.`
**New variables:** none (reuses `{{reschedule_link}}`)
**CC action:** Add to `marketing-site/lib/message-library/appointments.ts`

### appointments:intake-form-request
**Proposed universal name:** Pre-visit form request
**Flagged by:** 3 sub-verticals — healthcare-admin, tattoo-piercing (waiver), hotels (pre-arrival check-in)  *(also PM-pre-identified — see Known High-Confidence)*
**Rationale:** "Complete your forms before your visit" is a universal pre-appointment step for any intake/waiver/check-in flow.
**Draft variants:**
- Standard: `{{workspace_name}}: please complete your forms before your visit {{appointment_time}}: {{form_link}} Reply STOP to opt out.`
- Friendly: `Before we see you {{appointment_time}}, please fill out your forms here: {{form_link}} Reply STOP to opt out. - {{workspace_name}}`
- Brief: `{{workspace_name}}: complete your forms before {{appointment_time}}: {{form_link}} STOP to opt out.`
**New variables:** `{{form_link}}` — link to the intake/waiver form, ~24 chars, source: forms system, example "clinic.co/f/8821"
**CC action:** Add to `marketing-site/lib/message-library/appointments.ts`

### order-updates:order-ready-for-pickup
**Proposed universal name:** Order ready for pickup
**Flagged by:** 6 sub-verticals — cafes, food-delivery, grocery-retail, restaurant-chains, restaurants (+ pet-services "ready for pickup")
**Rationale:** BOPIS / click-and-collect / counter-pickup is a universal terminal state for any retailer or service offering pickup; the corpus models shipping/delivery but never "it's ready, come get it."
**Draft variants:**
- Standard: `{{workspace_name}}: Order {{order_number}} is ready for pickup. Reply STOP to opt out.`
- Friendly: `Your {{workspace_name}} order {{order_number}} is ready — come grab it. Reply STOP to opt out.`
- Brief: `{{workspace_name}}: Order {{order_number}} ready for pickup. STOP to opt out.`
**New variables:** none (reuses `{{order_number}}`)
**CC action:** Add to `marketing-site/lib/message-library/order-updates.ts`

### order-updates:quote-ready
**Proposed universal name:** Quote / estimate ready
**Flagged by:** 5 sub-verticals — junk-removal, landscaping, pool-spa, appliance-repair, translation-services
**Rationale:** A pre-confirmation "your quote is ready to review and approve" step common to every quote-driven service; no corpus message covers the estimate stage before an order/booking is confirmed.
**Draft variants:**
- Standard: `{{workspace_name}}: Your quote is ready. Review and approve here: {{action_link}} Reply STOP to opt out.`
- Friendly: `Good news — your {{workspace_name}} quote is ready. Take a look and approve: {{action_link}} Reply STOP to opt out.`
- Brief: `{{workspace_name}}: Quote ready. Review: {{action_link}} STOP to opt out.`
**New variables:** none (reuses `{{action_link}}`)
**CC action:** Add to `marketing-site/lib/message-library/order-updates.ts`

### customer-support:request-received
**Proposed universal name:** Request received
**Flagged by:** 7 sub-verticals — junk-removal (quote req), landscaping (quote req), pool-spa (repair req), real-estate-lead-gen (inquiry), legal-practice (intake), solar-lead-gen (first touch), recruiting-staffing (application received)
**Rationale:** An inbound-acknowledgment ("we got your request/inquiry/application, we'll be in touch") for lead-gen and intake flows; `customer-support:ticket-received` exists but is hard-scoped to a support ticket number.
**Draft variants:**
- Standard: `{{workspace_name}}: We got your request and will reach out shortly. Reply STOP to opt out.`
- Friendly: `Thanks for reaching out to {{workspace_name}} — we got it and will be in touch soon. Reply STOP to opt out.`
- Brief: `{{workspace_name}}: request received, we'll be in touch. STOP to opt out.`
**New variables:** none
**CC action:** Add to `marketing-site/lib/message-library/customer-support.ts`

### team-alerts:incident-resolved
**Proposed universal name:** Incident resolved / all-clear
**Flagged by:** 3 sub-verticals — cybersecurity, public-transit (service restored), emergency-alerts (all-clear)  *(also PM-pre-identified — see Known High-Confidence)*
**Rationale:** `team-alerts` opens incidents (system-alert, on-call-page, escalation-ping) but never closes one; the "all clear, it's resolved" message is a universal miss for any incident/outage/disruption workflow.
**Draft variants:**
- Standard: `{{workspace_name}}: {{system_name}} incident {{incident_id}} resolved. {{action_link}} Reply STOP to opt out.`
- Friendly: `{{workspace_name}}: all clear — {{system_name}} incident {{incident_id}} is resolved. {{action_link}} Reply STOP to opt out.`
- Brief: `{{workspace_name}}: {{system_name}} {{incident_id}} resolved. {{action_link}} STOP to opt out.`
**New variables:** none (reuses `{{system_name}}`, `{{incident_id}}`, `{{action_link}}`)
**CC action:** Add to `marketing-site/lib/message-library/team-alerts.ts`

### order-updates:item-ready
**Proposed universal name:** Item ready / deliverable ready
**Flagged by:** 4 sub-verticals — remote-notarization (notarized doc), translation-services (file ready), nutrition-meal-planning (plan ready), event-ticketing (ticket issued)
**Rationale:** "The thing you were waiting for is generated and ready to access/download" — a digital-deliverable terminal state distinct from physical shipping; spans documents, files, generated plans, and access credentials.
**Draft variants:**
- Standard: `{{workspace_name}}: Your {{item_label}} is ready. Access it here: {{action_link}} Reply STOP to opt out.`
- Friendly: `Your {{workspace_name}} {{item_label}} is ready: {{action_link}} Reply STOP to opt out.`
- Brief: `{{workspace_name}}: {{item_label}} ready: {{action_link}} STOP to opt out.`
**New variables:** `{{item_label}}` — what's ready, ~24 chars, source: workflow context, example "notarized document" / "translation" / "meal plan" / "ticket"
**CC action:** Add to `marketing-site/lib/message-library/order-updates.ts`

---

## REFINEMENTS TO EXISTING MESSAGES
*Not new messages — generalizations of an existing corpus message that many sub-verticals had to STRETCH. Listed here so the corpus-expansion session can decide refine-vs-add.*

### appointments:confirmation — make `{{provider_name}}` optional (venue / reservation)
**Flagged by:** 7 sub-verticals — hotels, restaurant-chains, restaurants, short-term-rentals, moving-brokerages, pet-services (boarding date-range), event-ticketing
**Why:** The confirmation body hard-assumes a named human provider; venue bookings, reservations, and date-range stays have no provider, forcing an awkward alias. Recommend a provider-optional variant (and a date-range-friendly time field).

### team-alerts:system-alert — generalize beyond infrastructure (metric / price / device / position)
**Flagged by:** 6 sub-verticals — analytics-bi (metric), crm (pipeline), audience-growth (growth threshold), crypto-web3 (position health), personal-investing (price target), medical-devices (device offline)
**Why:** `system-alert`'s `{{system_name}}` / `{{alert_type}}` vocabulary reads as ops/infra; a large set of consumer- and business-facing "a thing you watch crossed a threshold" alerts reuse it with a framing mismatch. Recommend a neutral threshold-alert variant or relaxed variable framing.

---

## NEW CATEGORY CANDIDATES

### Documents & e-signature
**Flagged by:** 11+ sub-verticals across the document lifecycle — legal-practice, cpa-practice, consulting, tax-practice/tax-practice-ops, design-studios, real-estate-ops, healthcare-admin, clinical-research, higher-education, veterans-services, correctional-services, government-agencies
**Why new category:** The cluster `document-needed` → `signature-requested` → `signature-completed` → `documents-received` → `item-ready` (signed doc back) is a cohesive paperwork lifecycle that recurs across the entire professional-services and civic families. It fits `account-events` by scope ("lifecycle alerts"), but it is large and self-contained enough that a dedicated **Documents** category (TCR `ACCOUNT_NOTIFICATION`) may model it more cleanly than overloading account-events. The individual messages are listed above under CORPUS ADDITIONS with a provisional `account-events` home.
**PM decision needed:** yes — fold into `account-events`, or stand up a dedicated `documents` category. (Secondary, lower-confidence: a **Billing / AR** category for invoice-issued / payment-due / past-due / payment-received — but those fit `account-events`'s stated billing scope well, so the recommendation is to keep them in account-events.)

---

## KNOWN HIGH-CONFIDENCE ADDITIONS
PM-pre-identified during batch review. Each verified against the grep findings below; included in CORPUS ADDITIONS above where volume independently confirms (✓✓), or here with its grep support where thinner (✓).

- **account-events:payment-due** — ✓✓ confirmed, 17 sub-verticals (above).
- **account-events:payment-received** — ✓✓ confirmed, 11 sub-verticals (above).
- **team-alerts:incident-resolved** — ✓✓ confirmed, 3 sub-verticals (above).
- **appointments:intake-form-request** — ✓✓ confirmed, 3 sub-verticals (above).
- **account-events:balance-low** (prepaid credits / balance running low) — ✓ thin. Strong grep hit: architecture-engineering (retainer-balance-low); adjacent: crypto-web3 (position health), personal-investing (margin call). Recommend add on PM confidence.
  - Standard: `{{workspace_name}}: Your balance is running low. Top up to stay active: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Heads up from {{workspace_name}} — your balance is getting low. Top up here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Balance low. Top up: {{account_link}} STOP to opt out.`
- **account-events:streak-ending** (gamified streak about to break) — ✓ 2 sub-verticals: nutrition-meal-planning, wellness-fitness.
  - Standard: `{{workspace_name}}: your {{streak_count}} streak ends soon. Keep it going: {{action_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: don't lose your {{streak_count}} streak — one quick check-in keeps it alive: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{streak_count}} streak ends soon. {{action_link}} STOP to opt out.`
  - New variables: `{{streak_count}}` — the streak length, ~10 chars, example "12-day"
- **account-events:recurring-reminder** (habit / routine nudge) — ✓ 2 sub-verticals: wellness-fitness, health-condition-management (daily check-in/log nudge).
  - Standard: `{{workspace_name}}: time for {{habit_name}}. Mark it done: {{action_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}} nudge: {{habit_name}} is due today. Knock it out: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{habit_name}} due. {{action_link}} STOP to opt out.`
  - New variables: `{{habit_name}}` — the habit/task, ~24 chars, example "your morning run"
- **team-alerts:task-assigned** (person-to-person work item assignment) — ✓ 2 sub-verticals: project-management, crm (lead/deal assigned).
  - Standard: `{{workspace_name}}: {{item_name}} was assigned to you. View: {{action_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: {{item_name}} is yours now — take a look: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{item_name}} assigned to you. {{action_link}} STOP to opt out.`
  - New variables: `{{item_name}}` — the task/item title, ~40 chars, example "Task #248"
- **team-alerts:task-reminder** (upcoming task deadline nudge) — ✓ 2 sub-verticals: project-management (due soon), influencer-marketplaces (deliverable-due). Closely related to the `account-events:deadline-reminder` addition; distinguish on audience (internal worker task vs. external recipient deadline).
  - Standard: `{{workspace_name}}: {{item_name}} is due {{due_time}}. View: {{action_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: heads up — {{item_name}} is due {{due_time}}. {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{item_name}} due {{due_time}}. {{action_link}} STOP to opt out.`
  - New variables: `{{item_name}}` (shared); `{{due_time}}` — deadline, ~20 chars, example "tomorrow 5pm"

---

## DEMOTED TO VERTICAL-SPECIFIC
Patterns initially flagged Universal miss / Stretch but reclassified after deduplication (1–2 sub-verticals, or require vertical context to name). No corpus action; they live at the sub-vertical registry layer. Several are clean lifecycle siblings worth revisiting if more sub-verticals surface them (noted).

| Pattern | Original sub-vertical(s) | Reason demoted |
|---|---|---|
| delivery-attempt-failed | alcohol-retail, ecommerce | 2 subs; clean order-updates sibling — revisit if a 3rd surfaces |
| documents-received | health-insurance, legal-practice | 2 subs; companion to document-needed (fold if that lands) |
| curbside arrival ack / "I'm here" | grocery-retail, restaurant-chains | 2 subs; inbound-triggered BOPIS-specific |
| deposit-required | salons-spas, tattoo-piercing | 2 subs; appointments sibling (pre-confirmation) |
| live-session join-now | remote-notarization, clinical-care | 2 subs; "provider is waiting, join" |
| open-shift / claim-a-shift | recruiting-staffing, faith-based-platforms | 2 subs; team-alerts reply-to-claim sibling |
| new-match / new-connection | dating-apps, social-discovery | dating/social-only; folds into new-message for most |
| reward-expiring / loyalty progress | cafes | 1 sub; loyalty is marketing-adjacent |
| back-in-stock | ecommerce | 1 sub; promotional (marketing category) |
| abandoned-cart | ecommerce | 1 sub; reframe of marketing:re-engagement |
| order-delayed / running late | restaurant-chains | 1 sub |
| suspicious-transaction / fraud flag | banking-apps | 1 sub; security-adjacent to new-device-sign-in |
| card-expiring | self-storage | 1 sub |
| confirm-contact-details | self-storage | 1 sub |
| device-low-battery / device-offline | medical-devices | 1 sub (IoT was vertical-specific) |
| visit-skipped / couldn't-service | pool-spa | 1 sub; route-service sibling of service-complete |
| job-in-progress / on-site-can't-reach | locksmith | 1 sub each |
| service-started / visit-report | pet-services | 1 sub each |
| offer-extended / onboarding-step | recruiting-staffing | 1 sub each; recruiting-specific |

---

## Appendix — dedup method
Records were extracted per-family by 8 parallel sub-agents (one per family), each pulling every `Universal miss` and `Stretch`-classified gap with its proposed home, universal name, draft variants, and a generic semantic `pattern_tag`. Records were then grouped globally by semantic pattern (not by name — e.g. rent-due / invoice-due / membership-renewal-due / balance-due all collapse to *payment-due*). For each pattern: counted distinct sub-verticals, picked the most-generic universal name and most-specific corpus home, and selected the cleanest corpus-consistent draft variants. Classification thresholds: 3+ distinct sub-verticals + nameable without a vertical + fits an existing category → corpus addition; significant-reframe Stretches folded into the matching pattern; 1–2 subs or vertical-context-required → demoted. PM-pre-identified items were verified against the grep findings and surfaced in the Known High-Confidence section.
