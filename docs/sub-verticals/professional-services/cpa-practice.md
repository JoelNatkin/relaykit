## Accounting / CPA practice tools (B2B)
**Vertical:** Professional services
**Bucket:** Clear
**URL slug:** /for/cpa-practice

### What this builder is making
A practice-management platform for accounting and tax firms — TaxDome / Canopy / Karbon / Firm360 / Uku style, plus lighter tools for solo bookkeepers — bundling a client portal, document collection, e-signature, engagement/workflow automation, invoicing, and secure messaging. The SMS recipient is the firm's own client (a taxpayer or small-business owner the firm serves), not the firm's billing customer: the builder sells the tool to the firm, and the firm uses it to chase documents, confirm appointments, and push deadline and payment nudges to its clients. It is the firm communicating with its own book of clients — operational and transactional, never the firm marketing for new leads.

### Why they need SMS
During tax season a firm is blocked on hundreds of clients who haven't sent a W-2, a 1099, or an e-signature, and every day a portal request sits unread in email is a day the return can't be filed before the deadline. A texted "you have a document request" or "your return is ready to sign" reads in seconds where the portal-notification email is lost, and SMS is the only channel fast enough to land an extension-cutoff or estimated-payment-due reminder while the client can still act. The reschedule and "ready to sign" nudges keep the firm's workflow moving instead of stalling on client silence.

### Message categories
1. appointments — closest structural fit for the firm's deadline / document-due / "ready to sign" / consultation-reminder cadence; the workflow's core nudges are date-anchored client prompts.
2. account-events — the firm-client lifecycle inside the portal (e-sign requested, document request opened, invoice issued, portal access) plus the firm's own subscription to the platform builder.
3. verification — phone-ownership at client portal signup and step-up before a sensitive portal action; 2FA SMS backup is a documented feature of these tools.
4. customer-support — secure-message-reply and ticket-style notifications when a client messages the firm through the portal.
Excluded: marketing (the firm's outbound new-client/lead promotion is a separate EIN-gated consent surface, not the transactional portal flow), order-updates (no physical fulfillment; invoice/payment maps better to account-events + a gap), community (no community surface), team-alerts (no on-call/incident model for the firm's clients), waitlist (no queue).

### Workflows

**Document collection (tax-season chase)**
Get the W-2s, 1099s, and source documents the firm is blocked on, before the filing deadline.
Sequence:
1. GAP:document-requested — "Documents needed" — the firm opens a document request in the portal; client is texted that items are needed with a portal link (see gaps).
2. appointments:reminder-distant — "Documents due tomorrow" — STRETCH: the deadline-tomorrow nudge re-framed from an appointment-tomorrow reminder; a date-anchored "documents due {{appointment_time}}" prompt (see gaps).
3. appointments:reminder-proximate — "Deadline today" — final same-day push before the firm's internal cutoff or the filing deadline.
4. GAP:documents-received — "Documents received" — confirmation the uploaded items landed, closing the loop so the client stops resending (see gaps).
Variable aliases (only where default feels wrong):
- workspace_name: "Harbor Tax & Advisory" (the firm's name as the client knows it, not the platform brand)
- appointment_time: "Apr 15" (a deadline date, not a clock time)
- cancel_link: "" (no cancel action — suppress; this is a deadline, not a booking)

**E-signature / approval request**
Get the engagement letter, e-file authorization, or return signed so the firm can file.
Sequence:
1. GAP:signature-requested — "Ready to sign" — the firm sends a document for e-signature; client is texted with the portal link (see gaps).
2. appointments:reminder-distant — "Signature due tomorrow" — STRETCH: deadline-tomorrow reframing for an unsigned document approaching the filing cutoff (see gaps).
3. GAP:signature-completed — "Signature received" — confirmation the document was signed, so the firm's job advances (see gaps).
Variable aliases (only where default feels wrong):
- workspace_name: "Harbor Tax & Advisory"
- appointment_time: "Apr 12"

**Filing & deadline reminders**
Keep clients ahead of estimated-payment dates, extension cutoffs, and filing deadlines.
Sequence:
1. appointments:reminder-distant — "Deadline approaching" — STRETCH: the day-before reminder reframed to a filing/estimated-payment deadline rather than a booked appointment (see gaps).
2. appointments:reminder-proximate — "Deadline today" — same-day final reminder before the cutoff.
Variable aliases (only where default feels wrong):
- workspace_name: "Harbor Tax & Advisory"
- appointment_time: "Sep 15 (Q3 estimate)"
- cancel_link: "" (no cancel action — suppress)

**Consultation / meeting lifecycle**
Confirm and remind for the firm's client meetings — tax-planning calls, year-end reviews, intake consultations.
Sequence:
1. appointments:confirmation — "Meeting confirmed" — a client books or the firm schedules a consultation.
2. appointments:reminder-distant — "Meeting tomorrow" — day-before reminder with reschedule link.
3. appointments:reminder-proximate — "Meeting in 1 hour" — same-day proximate reminder.
4. appointments:reschedule-confirmation — "Meeting moved" — confirms a new time when the client reschedules.
5. appointments:cancellation-confirmation — "Meeting cancelled" — confirms cancellation, offers to rebook.
6. appointments:no-show-follow-up — "We missed you" — after a missed meeting, prompt to rebook.
Variable aliases (only where default feels wrong):
- workspace_name: "Harbor Tax & Advisory"
- provider_name: "Dana, CPA" (the preparer or partner, not a clinician)

**Invoice / payment notice**
Tell the client an invoice is ready and confirm payment, without putting balances in the message.
Sequence:
1. GAP:invoice-issued — "Invoice ready" — the firm issues an invoice in the portal; client is texted with a portal link to view and pay (see gaps).
2. GAP:payment-received — "Payment received" — confirmation the payment posted, with a receipt link (see gaps).
Variable aliases (only where default feels wrong):
- workspace_name: "Harbor Tax & Advisory"

**Portal message & support notification**
Tell the client the firm replied to them in the secure portal, without exposing content over SMS.
Sequence:
1. customer-support:agent-response — "New message" — STRETCH: the firm replied to the client in the secure portal; reframe "ticket" as a portal message and link to the portal thread (see gaps).
2. customer-support:proactive-outreach — "Need anything?" — firm reaches out when a client stalls mid-engagement.
Variable aliases (only where default feels wrong):
- workspace_name: "Harbor Tax & Advisory"
- ticket_number: "your file" (firms use client/engagement names, not ticket numbers)

**Client portal identity**
Prove phone ownership at portal signup and gate sensitive portal actions.
Sequence:
1. verification:verification-code — "Verification code" — client verifies phone at portal signup or 2FA-backup login. (No STOP/HELP — 2FA carve-out.)
2. verification:confirmation-code — "Confirmation code" — step-up before a sensitive portal action (changing payout/ACH details, granting access). (No STOP/HELP.)
Variable aliases (only where default feels wrong):
- business_name: "Harbor Tax & Advisory"

**Firm's own platform subscription (the builder's paying customer)**
Keep the firm's subscription to the practice-management platform active.
Sequence:
1. account-events:payment-failed — "Card declined" — the firm's card for the platform is declined.
2. account-events:trial-ending — "Trial ending" — a few days before the firm's trial lapses.
3. account-events:subscription-confirmed — "Subscription updated" — renewal or plan change goes through.
4. account-events:new-device-sign-in — "New sign-in" — firm staff account accessed from a new device.
Variable aliases (only where default feels wrong): none — `{{workspace_name}}` here is the platform's own brand.

### Message gaps

**GAP:document-requested**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (document-request alias; nearest corpus carrier is appointments cadence with a portal link)
- **Proposed universal name:** Documents needed / document request opened
- **Why:** the open-document-request notice is the entry point of the tax-season chase and no corpus message says "your firm needs items from you, here's the portal."

**GAP:documents-received**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (document-received confirmation)
- **Proposed universal name:** Documents received
- **Why:** the upload-landed confirmation stops clients resending and closes the request loop; no corpus message confirms inbound document receipt.

**GAP:signature-requested**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:signature-requested (new) or sub-vertical registry alias
- **Proposed universal name:** Ready to sign / signature requested
- **Why:** e-signature requests are a near-universal portal/SaaS action (contracts, engagement letters, authorizations) and nothing in the corpus says "a document is waiting for your signature."
- **Draft variants:**
  - Standard: `{{workspace_name}}: A document is ready for your e-signature. Review and sign here: {{action_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: you have a document ready to sign - it only takes a minute: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Document ready to sign: {{action_link}} STOP to opt out.`
- **New variables:** none — reuses `{{action_link}}`.

**GAP:signature-completed**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:signature-completed (new) or sub-vertical registry alias
- **Proposed universal name:** Signature received
- **Why:** the signed-confirmation advances the firm's workflow and reassures the client; no corpus message confirms a completed e-signature.
- **Draft variants:**
  - Standard: `{{workspace_name}}: We received your signed document. Nothing more needed for now. Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: got it - your document is signed and in. Thanks! Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Signed document received. STOP to opt out.`
- **New variables:** none.

**GAP:invoice-issued**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:invoice-issued (new) or sub-vertical registry alias
- **Proposed universal name:** Invoice ready
- **Why:** an issued-invoice-with-portal-link notice is common across professional-services billing and the corpus has no "your invoice is ready to view and pay" message that isn't tied to a shipped order.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your invoice is ready. View and pay in your portal: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: a new invoice is ready in your portal - view or pay here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Invoice ready. View/pay: {{account_link}} STOP to opt out.`
- **New variables:** none — reuses `{{account_link}}`.

**GAP:payment-received**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:payment-received (new) or sub-vertical registry alias
- **Proposed universal name:** Payment received / receipt
- **Why:** the paid confirmation closes the billing loop; no corpus message says "we received your payment" (order-updates:refund-processed frames money leaving, the inverse).
- **Draft variants:**
  - Standard: `{{workspace_name}}: Payment received, thank you. Your receipt is in the portal: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: got your payment - thanks! Receipt's in your portal: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Payment received. Receipt: {{account_link}} STOP to opt out.`
- **New variables:** none — reuses `{{account_link}}`. (No amount in body by constraint.)

**STRETCH:appointments:reminder-distant**
- **Classification:** Stretch
- **Proposed corpus home:** stretch corpus msg appointments:reminder-distant; fit gap is that it frames a booked appointment ("your appointment is tomorrow") whereas the firm needs a deadline reminder ("documents/signature due tomorrow"). Reusable by aliasing `{{appointment_time}}` to a date and suppressing the cancel link, but a dedicated deadline-reminder message would be cleaner.
- **Proposed universal name:** Deadline reminder (day before)
- **Why:** the day-before nudge is the firm's highest-value message and the only corpus carrier is appointment-shaped.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Reminder - your {{deadline_label}} is due tomorrow, {{appointment_time}}. Details: {{action_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: quick reminder - your {{deadline_label}} is due tomorrow ({{appointment_time}}): {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{deadline_label}} due tomorrow, {{appointment_time}}. {{action_link}} STOP to opt out.`
- **New variables:** `{{deadline_label}}` — what's due (e.g., "documents", "e-signature", "Q3 estimate"), budget ~20 chars, source firm/workflow config, example "documents".

**STRETCH:customer-support:agent-response**
- **Classification:** Stretch
- **Proposed corpus home:** stretch corpus msg customer-support:agent-response; fit gap is that "ticket {{ticket_number}}" framing reads as a support desk, not a CPA firm's secure portal thread. Reusable by aliasing `{{ticket_number}}` to "your file" / engagement name, but the ticket vocabulary is a mismatch.
- **Proposed universal name:** New portal message
- **Why:** firms reply to clients inside the secure portal and need to notify "you have a reply" without putting content over SMS; the corpus's only inbound-reply notice is ticket-shaped.
- **Draft variants:**
  - Standard: `{{workspace_name}}: You have a new message in your portal. Read it here: {{ticket_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: you've got a new message from us in the portal: {{ticket_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: New portal message. {{ticket_link}} STOP to opt out.`
- **New variables:** none — reuses `{{ticket_link}}` as the portal-thread link.

### Content constraints
- Never put SSNs/EINs, bank/account numbers, balances, refund amounts, or tax-form data in the message body. SMS is a notification-and-link channel only; the sensitive content stays behind the portal link. This is the load-bearing rule for this sub-vertical.
- Deadline, document-request, and "ready to sign" comms are factual transactional and standard-eligible — keep them factual (what's needed, by when, portal link), with no promotional content.
- Invoice/payment notices link to the portal to view and pay; do not state the dollar balance in the body, and avoid debt-collection language on anything past-due (state the fact and link only — no "final notice," no implied legal/credit consequences).
- The firm's outbound new-client marketing ("book early for tax season," promotions) is a separate surface requiring explicit marketing consent, EIN-gated — it must not ride on the transactional portal flows.
- Consent is two-layered: the firm consents on its own platform-subscription alerts, but each client must opt in before the firm texts them; the builder should make per-client opt-in capture part of portal onboarding.

### Disambiguation
This is practice-management tooling — the firm communicating with its own clients — not consumer-facing bookkeeping SaaS sold to SMBs (that sibling, /for/accounting-bookkeeping, texts the SMB's own customers about invoices and the SMB owner about their subscription). The line that keeps this Clear is that every message is a factual notification pointing to a secure portal; the moment a body carries an SSN, an account/routing number, a balance, or tax-form data it stops being a safe transactional text and becomes a data-exposure and carrier problem, regardless of the firm's intent. Tax-season deadline and document-request comms are squarely transactional and allowed; what tips toward Conditional or prohibited is promotional outreach (lead-gen, "refer a friend" offers — needs marketing consent) and any drift toward tax-resolution/debt-relief or credit-repair messaging, which are scrutinized categories. Solo-bookkeeper practice tools that manage a book of clients belong here; a self-serve bookkeeping app a business uses on itself belongs in /for/accounting-bookkeeping.

### Sources
https://taxdome.com/
https://taxdome.com/client-portal
https://taxdome.com/secure-messages
https://taxdome.com/en-ca/document-management
https://financial-cents.com/resources/articles/taxdome-vs-canopy/
https://karbonhq.com/
https://www.myfirm360.com/guides/top-accounting-practice-management-software-guide/
https://getuku.com/articles/best-accounting-practice-management-software/
https://www.xenett.com/blog/cpa-firm-practice-management-software
https://www.cpacharge.com/resources/blog/best-accounting-practice-management-software/
https://sinch.com/engage/resources/business-messaging/sms-for-accounting/
https://sinch.com/engage/use-cases/sms-for-tax-services/
https://textellent.com/business-texting-for-accounting-and-tax-professionals/
https://textellent.com/blog/sms-taxes/
https://textellent.com/blog/sms-marketing-for-tax-professionals/
https://textbetter.com/accounting-texting/
https://appointmentreminder.com/industry/appointment-reminders-for-accountants-tax-pros-cpas/
https://www.cpasitesolutions.com/cpa-websites/2025/09/two-way-messaging-automation/
https://www.natptax.com/news-insights/blog/drive-growth-with-sms-irs-compliant-and-tcpa-safe-texting-that-boosts-efficiency-and-client-satisfaction/
https://www.infobip.com/blog/tcpa-compliance-sms
