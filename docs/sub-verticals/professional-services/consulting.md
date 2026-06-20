## Business / management consultants
**Vertical:** Professional services
**Bucket:** Clear
**URL slug:** /for/consulting

### What this builder is making
A consultant-practice CRM and client-operations tool — SuiteDash/Plutio/Simply.Coach/Clientary-style — that runs a solo consultant's or boutique firm's book of business: a contact/pipeline CRM, discovery-call and session scheduling, proposal/SOW generation with e-sign sign-off, a branded client portal, time-and-project tracking, and invoicing/AR. The SMS recipients split two ways — the consultant's own clients (call reminders, proposal-ready and sign-off nudges, milestone/status updates, invoice and payment notices) and the consultant themselves (their own subscription, billing, and security alerts). It is operational and relationship-driven, not promotional.

### Why they need SMS
A booked discovery call or working session is the unit of revenue for a consultant, and a no-show is a billable hour lost that rarely refills — a texted reminder reads in seconds where a calendar email is buried, which is why scheduling tools for advisors lean on it for a documented 6x ROI against no-shows. Past the call, the two moments that stall a consulting engagement are an unsigned proposal sitting in an inbox and an overdue invoice on a 30-day net; an SMS nudge with a direct link is the highest-leverage way to unblock both. SMS wins here because the consultant's relationship is high-touch and one-to-one — a text feels like the consultant reaching out, not a marketing blast.

### Message categories
1. appointments — discovery calls, strategy sessions, and recurring check-ins are the revenue core; confirmation + 24h/1h reminders + reschedule are the most-used flow in the practice.
2. account-events — the consultant's own subscription lifecycle on the CRM (card declined, trial ending, renewal/plan change confirmed) — the churn-critical alerts the builder sends to their own paying customer.
3. customer-support — portal/ticket and service-status alerts to the consultant using the product.
4. verification — phone-ownership at the consultant's signup, plus step-up before a sensitive change (payout/bank details, e-sign on a high-value SOW).
Excluded: order-updates (no physical fulfillment — invoice/AR notices are gaps below, not a shipping lifecycle), community (no community surface in a 1:1 consulting practice), team-alerts (no on-call/incident or shift model — small firms, not ops teams), marketing (transactional relationship tool; promotional outreach needs separate EIN-gated consent and is not the use case), waitlist (no queue/availability-opening model).

### Workflows

**Discovery call & session scheduling (the consultant's clients)**
Get booked calls confirmed and showing up — the practice's revenue core.
Sequence:
1. appointments:confirmation — "Call confirmed" — discovery call or session booked with the consultant.
2. appointments:reminder-distant — "Tomorrow's call" — sent the day before the call.
3. appointments:reminder-proximate — "Call in 1 hour" — sent about an hour before; the highest no-show-prevention message.
4. appointments:reschedule-confirmation — "Call moved" — client or consultant reschedules.
5. appointments:cancellation-confirmation — "Call cancelled" — with a rebook link.
6. appointments:no-show-follow-up — "We missed you" — after a missed call, prompt to rebook.
7. appointments:post-appointment — "How was the session?" — post-session feedback / next-step nudge.
Variable aliases (only where default feels wrong):
- provider_name: "Jordan Lee" (the consultant, not a clinical "provider")
- appointment_time: "Thu Jun 25, 2:00 PM"
- workspace_name: "Lee Strategy Group" (the consultant's own practice name as the client sees it, not the CRM brand)

**Proposal & SOW sign-off (the consultant's clients)**
Move a sent proposal to a signed engagement before it goes cold.
Sequence:
1. GAP:proposal-ready — "Proposal ready" — proposal/SOW issued to the client with a portal link to review (see gaps).
2. GAP:signature-requested — "Signature needed" — e-sign requested on the SOW; reminder to sign (see gaps).
3. GAP:document-signed — "Proposal signed" — confirmation the SOW is countersigned and the engagement is live (see gaps).
Variable aliases (only where default feels wrong):
- workspace_name: "Lee Strategy Group"

**Engagement milestones & status (the consultant's clients)**
Keep the client informed as deliverables and phases land — the portal-notification job.
Sequence:
1. GAP:milestone-update — "Phase update" — a project phase, deliverable, or milestone is completed/published to the portal (see gaps).
2. customer-support:proactive-outreach — "Checking in" — STRETCH: reused as a relationship check-in when the consultant's system flags a stalled engagement (see gaps).
Variable aliases (only where default feels wrong):
- workspace_name: "Lee Strategy Group"
- customer_name: "Priya"

**Invoice-to-payment AR cycle (the consultant's clients)**
Get the consultant's invoices delivered, paid, and receipted on net terms.
Sequence:
1. GAP:invoice-sent — "Invoice ready" — invoice issued to the client with a pay link (see gaps).
2. GAP:payment-due-reminder — "Payment due soon" — a few days before the due date (see gaps).
3. GAP:invoice-overdue — "Invoice overdue" — due date passed, payment outstanding (see gaps).
4. GAP:payment-received — "Payment received" — paid confirmation / receipt (see gaps).
Variable aliases (only where default feels wrong):
- workspace_name: "Lee Strategy Group"

**Consultant subscription lifecycle (the builder's own paying customer)**
Keep the consultant's CRM subscription active and informed.
Sequence:
1. account-events:payment-failed — "Card declined" — the consultant's card for the CRM is declined; prompt to update before suspension.
2. account-events:trial-ending — "Trial ending" — sent a few days before the consultant's trial lapses.
3. account-events:subscription-confirmed — "Subscription updated" — renewal, upgrade, or plan change goes through.
4. account-events:new-device-sign-in — "New sign-in" — consultant's account accessed from a new device.
Variable aliases (only where default feels wrong): none — `{{workspace_name}}` here is the CRM product's name.

**Consultant identity & sensitive-change confirmation**
Prove phone ownership and gate changes to payout/banking and high-value e-sign.
Sequence:
1. verification:verification-code — "Verification code" — consultant verifies phone at signup. (No STOP/HELP — 2FA carve-out.)
2. verification:confirmation-code — "Confirmation code" — step-up before changing payout/bank details or countersigning a high-value SOW. (No STOP/HELP.)
Variable aliases (only where default feels wrong): none.

**Consultant support & service status**
Keep the consultant informed when the CRM has an issue or an open ticket.
Sequence:
1. customer-support:ticket-received — "Ticket received" — consultant logs a support request.
2. customer-support:agent-response — "Reply on your ticket" — agent replies.
3. customer-support:service-status-alert — "Service issue" — the CRM has an outage affecting the consultant (e.g., portal or e-sign down).
Variable aliases (only where default feels wrong): none.

### Message gaps

**GAP:proposal-ready**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (proposal-delivery alias)
- **Proposed universal name:** Proposal ready / document ready to review
- **Why:** an issued-proposal-with-portal-link notice is the entry point of the sign-off flow and has no clean corpus message; appointments and account-events both miss it.

**GAP:signature-requested**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:signature-requested (new) or a documents registry alias
- **Proposed universal name:** Signature needed
- **Why:** an e-sign request/reminder on a contract, SOW, or agreement recurs across consulting, legal, real estate, and any engagement that opens on a signed document, and nothing in the corpus prompts "please sign."
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your proposal is ready to sign. Review and sign here: {{sign_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: your proposal is ready - have a look and sign when you can: {{sign_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Proposal ready to sign. {{sign_link}} STOP to opt out.`
- **New variables:** `{{sign_link}}` — URL to the e-sign/review page, ~24 chars (shortened), source: the CRM's portal/e-sign module, example: "lsg.co/sign/8f2".

**GAP:document-signed**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:document-signed (new) or a documents registry alias
- **Proposed universal name:** Document signed / agreement live
- **Why:** the countersigned-and-live confirmation closes the sign-off loop and the corpus has no "your agreement is signed" notice; it doubles as the kickoff signal that an engagement has started.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your proposal is signed and your engagement is live. Details: {{portal_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: all signed - we're officially underway. See the details here: {{portal_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Proposal signed, engagement live. {{portal_link}} STOP to opt out.`
- **New variables:** `{{portal_link}}` — URL to the client portal, ~24 chars (shortened), source: the CRM's portal module, example: "lsg.co/p/8f2".

**GAP:milestone-update**
- **Classification:** Universal miss
- **Proposed corpus home:** customer-support or a project registry alias (milestone-update)
- **Proposed universal name:** Project / phase update
- **Why:** a "phase X is done / deliverable published" status push is the core portal-notification job for consulting, agencies, and any project-based service, and the corpus has no project-progress message (order-updates is fulfillment-only).
- **Draft variants:**
  - Standard: `{{workspace_name}}: Update on your project - {{milestone}} is complete. View it here: {{portal_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: good progress - {{milestone}} is done. Take a look: {{portal_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{milestone}} complete. {{portal_link}} STOP to opt out.`
- **New variables:** `{{milestone}}` — short phase/deliverable label, ~28 chars, source: the project module, example: "Phase 1 research". `{{portal_link}}` — as above.

**GAP:invoice-sent**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (invoice-delivery alias)
- **Proposed universal name:** Invoice ready / invoice delivered
- **Why:** an issued-invoice-with-pay-link notice is the entry point of the AR cycle and has no clean corpus message; order-updates assumes a fulfilled physical order, not a service invoice.

**GAP:payment-due-reminder**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:payment-due-reminder (new) or an AR registry alias
- **Proposed universal name:** Payment due soon
- **Why:** a pre-due-date nudge with a pay link is common across invoicing, retainers, and any AR flow, and nothing in the corpus sends "you owe X, due soon."
- **Draft variants:**
  - Standard: `{{workspace_name}}: Invoice {{invoice_number}} for {{amount_due}} is due {{due_date}}. Pay here: {{pay_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: a quick heads up - invoice {{invoice_number}} ({{amount_due}}) is due {{due_date}}. Pay: {{pay_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Invoice {{invoice_number}} {{amount_due}} due {{due_date}}. {{pay_link}} STOP to opt out.`
- **New variables:** `{{invoice_number}}` — e.g. "INV-2041"; `{{amount_due}}` — e.g. "$2,500"; `{{due_date}}` — e.g. "Jun 30"; `{{pay_link}}` — pay page URL, ~24 chars, example: "lsg.co/pay/8f2".

**GAP:invoice-overdue**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:invoice-overdue (new) or an AR registry alias
- **Proposed universal name:** Invoice overdue
- **Why:** the past-due reminder is the highest-value AR message and the corpus has no "payment is late" notice; must stay factual to avoid debt-collection framing.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Invoice {{invoice_number}} for {{amount_due}} was due {{due_date}} and is now overdue. Pay: {{pay_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: invoice {{invoice_number}} ({{amount_due}}) is past its {{due_date}} due date. Pay here: {{pay_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Invoice {{invoice_number}} {{amount_due}} overdue. Pay: {{pay_link}} STOP to opt out.`
- **New variables:** `{{invoice_number}}`, `{{amount_due}}`, `{{due_date}}`, `{{pay_link}}` — as above.

**GAP:payment-received**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:payment-received (new) or an AR registry alias
- **Proposed universal name:** Payment received / receipt
- **Why:** the paid confirmation closes the AR loop and no corpus message says "we received your payment" (order-updates:refund-processed frames money leaving back to a card — the inverse direction).
- **Draft variants:**
  - Standard: `{{workspace_name}}: Payment of {{amount_paid}} received for invoice {{invoice_number}}. Thanks! Receipt: {{receipt_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: got it - {{amount_paid}} received for invoice {{invoice_number}}. Receipt: {{receipt_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{amount_paid}} received, invoice {{invoice_number}}. Receipt: {{receipt_link}} STOP to opt out.`
- **New variables:** `{{amount_paid}}` — e.g. "$2,500"; `{{invoice_number}}` — as above; `{{receipt_link}}` — receipt URL, ~24 chars, example: "lsg.co/r/8f2".

**STRETCH:customer-support:proactive-outreach**
- **Classification:** Stretch
- **Proposed corpus home:** stretch corpus msg customer-support:proactive-outreach; fit gap is framing — the corpus body is a support "you hit a snag, want a hand?" message, whereas a consulting check-in is a relationship-warming "how's it going on the engagement?" nudge, not a friction signal.
- **Proposed universal name:** Engagement check-in
- **Why:** consultants nurture stalled or mid-engagement clients with a light personal check-in, and the closest corpus message is support-friction framed rather than relationship framed.
- **Draft variants:**
  - Standard: `{{workspace_name}}: just checking in on how things are going. Anything you need? Reply here. Reply STOP to opt out.`
  - Friendly: `Hi {{customer_name}}, {{workspace_name}} here - checking in on how the engagement's going. Reply anytime. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: checking in - anything you need? Reply here. STOP to opt out.`
- **New variables:** none.

### Content constraints
- Standard carrier rules apply; this is transactional, relationship-based professional-services messaging — no vertical-specific regulatory regime.
- Consent is two-layered: the consultant opts in on their own CRM-subscription alerts, but the consultant's clients are a second downstream audience — the builder must ensure each consultant collects opt-in from their own clients before texting them reminders, proposals, or invoices.
- Avoid debt-collection language on overdue invoices: state the fact (amount, due date, "overdue") plus a pay link only. No "final notice," no threats, no implied legal/credit consequences — that can reclassify the campaign and draw carrier/FDCPA scrutiny.
- Keep proposal, milestone, and invoice bodies factual and link-driven; no SOW pricing negotiation, contract terms, or confidential client detail in the SMS body — link to the portal.
- Promotional content (newsletters, "book a paid workshop," discounts on retainers) must not ride on these transactional flows — that is separate, EIN-gated marketing consent.

### Disambiguation
This is the consulting-practice operations tool, not the consultant's marketing channel: transactional client comms (call reminders, proposal/invoice notices, engagement status) are Clear, but the same builder pivoting to bulk outreach, newsletter blasts, or "book a discovery call" cold campaigns crosses into marketing and needs separate consent. It neighbors accounting/bookkeeping SaaS (which shares the invoice/AR gaps but centers ledgers, not engagements) and generic project-management SaaS (which shares milestone notices but lacks the proposal/sign-off and 1:1 advisor-scheduling spine). The tip from Clear toward Conditional is regulated advice content: a financial advisor or investment consultant sending market/portfolio guidance over SMS picks up securities-communication scrutiny, whereas a management or strategy consultant sending operational engagement notices does not. What looks allowed but isn't: appending a "refer a colleague for $X off" line to an invoice reminder — that quietly converts a transactional message into marketing.

### Sources
https://suitedash.com/best-crm-for-consultants/
https://www.consultingsuccess.com/crms-for-consultants
https://simply.coach/blog/best-crm-software-consultants/
https://monday.com/blog/crm-and-sales/crm-for-consultants/
https://www.plutio.com/solutions/consultants/client-management
https://www.clientary.com/proposal-software
https://www.psohub.com/blog/client-portal-for-project-management
https://www.greminders.com/
https://acuityscheduling.com/learn/appointment-reminders-guide
https://www.apptoto.com/
https://mailchimp.com/resources/sms-appointment-reminder/
https://help.twilio.com/articles/4408675845019-SMS-Compliance-and-A2P-10DLC-in-the-US
https://sakari.io/blog/meeting-10dlc-compliance-with-opt-ins
