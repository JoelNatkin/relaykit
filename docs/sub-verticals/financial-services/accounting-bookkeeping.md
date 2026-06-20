## Accounting / bookkeeping SaaS (B2B sold to SMBs)
**Vertical:** Financial services
**Bucket:** Clear
**URL slug:** /for/accounting-bookkeeping

### What this builder is making
A QuickBooks/Xero/Wave/FreshBooks-style accounting and bookkeeping SaaS for SMBs, freelancers, and creators: invoicing, expense tracking, bank-feed reconciliation, financial reports, and recurring-billing/AR automation. The builder sells B2B; the SMS recipients split two ways — the SMB's own customers (invoice delivery, payment-due and overdue reminders, payment-received receipts) and the SMB owner themselves (account, billing, and security alerts on their own subscription). It is operational and transactional, not promotional.

### Why they need SMS
The moment an invoice goes out — or a due date passes — every day of silence is a day of unpaid receivables and cashflow strain for the SMB. SMS reads in seconds where invoice emails sit unopened in spam or a crowded inbox, so a texted reminder with a payment link is the single highest-leverage nudge a bookkeeping tool can offer. The payment-received receipt and the failed-card alert close the loop and protect the SMB owner's own subscription.

### Message categories
1. account-events — the SMB owner's own subscription lifecycle (payment failed on their card, trial ending, renewal/plan-change confirmed); these are the churn-critical alerts the builder sends to their direct paying customer.
2. order-updates — closest structural fit for the SMB's invoice/AR lifecycle: confirmation, status, and refund/payment-back all map onto invoice-sent / paid / refunded, though "invoice" framing is a stretch (see gaps).
3. verification — phone-ownership at the SMB owner's signup, plus step-up confirmation before a sensitive action (changing payout/bank details).
4. customer-support — ticket and service-status alerts to the SMB owner using the accounting product.
Excluded: marketing (transactional B2B tool — promotional offers require separate EIN-gated consent and are not the use case), appointments (no scheduling), community (no community surface), team-alerts (no on-call/incident model), waitlist (no queue).

### Workflows

**Owner subscription lifecycle (the builder's own paying SMB)**
Keep the SMB owner's accounting subscription active and informed.
Sequence:
1. account-events:payment-failed — "Card declined" — the SMB owner's card for the accounting tool is declined; prompt to update before suspension.
2. account-events:trial-ending — "Trial ending" — sent a few days before the owner's trial lapses.
3. account-events:subscription-confirmed — "Subscription updated" — renewal, upgrade, or plan change goes through.
4. account-events:new-device-sign-in — "New sign-in" — owner's account accessed from a new device.
Variable aliases (only where default feels wrong): none — `{{workspace_name}}` is the accounting product's name.

**Invoice-to-payment AR cycle (the SMB's customers)**
Get the SMB's invoices delivered, paid, and receipted over SMS.
Sequence:
1. GAP:invoice-sent — "Invoice ready" — invoice issued to the SMB's customer with a pay link (see gaps; nearest stretch is order-updates:order-confirmed).
2. GAP:payment-due-reminder — "Payment due soon" — a few days before the due date (see gaps).
3. GAP:invoice-overdue — "Invoice overdue" — due date has passed, payment outstanding (see gaps).
4. order-updates:refund-processed — "Payment received" — STRETCH: the corpus refund-processed body frames money returning to a card; reuse it as the paid/receipt confirmation only by heavy reframing (see gaps), or use a dedicated GAP:payment-received.
Variable aliases (only where default feels wrong):
- workspace_name: "Acme Bookkeeping" (the SMB's own business name as it appears to its customers, not the accounting-SaaS brand)
- order_number: "INV-2041"
- estimated_delivery: "Jun 30" (repurposed as the invoice due date if order-updates is used as the carrier)

**Owner identity & sensitive-change confirmation**
Prove phone ownership and gate changes to payout/bank details.
Sequence:
1. verification:verification-code — "Verification code" — SMB owner verifies phone at signup. (No STOP/HELP — 2FA carve-out.)
2. verification:confirmation-code — "Confirmation code" — step-up before changing bank/payout details or a sensitive financial setting. (No STOP/HELP.)
Variable aliases (only where default feels wrong): none.

**Owner support & service status**
Keep the SMB owner informed when their accounting tool has an issue or an open ticket.
Sequence:
1. customer-support:ticket-received — "Ticket received" — owner logs a support request.
2. customer-support:agent-response — "Reply on your ticket" — agent replies.
3. customer-support:service-status-alert — "Service issue" — the accounting platform has an outage affecting the owner (e.g., bank-feed sync down).
Variable aliases (only where default feels wrong): none.

### Message gaps

**GAP:invoice-sent**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (invoice-delivery alias over order-updates:order-confirmed)
- **Proposed universal name:** Invoice ready / invoice delivered
- **Why:** an issued-invoice-with-pay-link notice is the entry point of the AR cycle and has no clean corpus message; order-confirmed assumes a paid order, the inverse of an unpaid invoice.

**GAP:payment-due-reminder**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:payment-due-reminder (new) or order-updates registry alias
- **Proposed universal name:** Payment due soon
- **Why:** a pre-due-date nudge with a pay link is common across invoicing, subscriptions, and any AR flow, and nothing in the corpus sends "you owe X, due soon."
- **Draft variants:**
  - Standard: `{{workspace_name}}: Invoice {{invoice_number}} for {{amount_due}} is due {{due_date}}. Pay here: {{pay_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: a quick heads up - invoice {{invoice_number}} ({{amount_due}}) is due {{due_date}}. Pay: {{pay_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Invoice {{invoice_number}} {{amount_due}} due {{due_date}}. {{pay_link}} STOP to opt out.`
- **New variables:** `invoice_number`, `amount_due`, `due_date`, `pay_link`

**GAP:invoice-overdue**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:invoice-overdue (new) or order-updates registry alias
- **Proposed universal name:** Invoice overdue
- **Why:** the past-due reminder is the highest-value message in the cycle and the corpus has no "payment is late" notice; must stay factual to avoid debt-collection language.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Invoice {{invoice_number}} for {{amount_due}} was due {{due_date}} and is now overdue. Pay: {{pay_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: invoice {{invoice_number}} ({{amount_due}}) is past its {{due_date}} due date. You can pay here: {{pay_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Invoice {{invoice_number}} {{amount_due}} overdue. Pay: {{pay_link}} STOP to opt out.`
- **New variables:** `invoice_number`, `amount_due`, `due_date`, `pay_link`

**STRETCH:order-updates:refund-processed**
- **Classification:** Stretch
- **Proposed corpus home:** stretch corpus msg order-updates:refund-processed; fit gap is direction — refund frames money leaving the SMB back to a card, whereas a payment-received receipt frames money arriving to the SMB. A dedicated GAP:payment-received is cleaner.
- **Proposed universal name:** Payment received / receipt
- **Why:** the paid confirmation closes the AR loop and no corpus message says "we received your payment."
- **Draft variants:**
  - Standard: `{{workspace_name}}: Payment of {{amount_paid}} received for invoice {{invoice_number}}. Thanks! Receipt: {{receipt_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: got it - {{amount_paid}} received for invoice {{invoice_number}}. Receipt here: {{receipt_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{amount_paid}} received, invoice {{invoice_number}}. Receipt: {{receipt_link}} STOP to opt out.`
- **New variables:** `amount_paid`, `invoice_number`, `receipt_link`

### Content constraints
- Standard carrier rules apply; this is transactional B2B/AR messaging, not regulated lending or debt-relief content.
- Consent nuance: the SMB owner consents on their own subscription alerts, but the SMB's customers are a second downstream audience — the builder must ensure each SMB collects opt-in from its own customers before texting invoice reminders to them.
- Avoid debt-collection language on overdue messages: state the fact (amount, due date, "overdue") and a pay link only. No threats, no "final notice," no implied legal/credit consequences — that language can reclassify the campaign and draw carrier/FDCPA scrutiny.
- Keep dollar amounts factual and reasonable in the body; pair every amount with a pay/receipt link rather than payment instructions in-line.
- Marketing/promotional content (discounts, "sign up for X plan") must not ride on these transactional flows — that needs separate marketing consent and is EIN-gated.

### Disambiguation
This is the accounting tool, not the bank: a consumer banking or payments app holding customer balances and moving money is Conditional (heightened financial scrutiny, fraud-alert framing), whereas a bookkeeping SaaS recording and invoicing is standard-eligible transactional messaging. The moment the product extends credit — invoice financing, "pay later," merchant cash advance against receivables — it crosses into lending and changes bucket; pure record-keeping and AR reminders do not. It also differs from generic B2B SaaS billing in that the SMS audience is two-layered: the builder texts the SMB owner (their own customer), and the SMB owner's invoice flows text that SMB's customers. Debt-relief, credit-repair, and payday-loan adjacencies are prohibited categories and are not this sub-vertical.

### Sources
https://quickbooks.intuit.com/accounting/invoicing/
https://www.freshbooks.com/
https://www.xero.com/us/accounting-software/send-invoices/
https://www.paidnice.com/sms-payment-reminders
https://www.paidnice.com/email-sms-reminders
https://www.recur360.com/features/collections/automated-reminders-and-notifications/
https://txtsync.com/finance/
https://www.chaserhq.com/blog/how-sms-payment-reminders-can-help-get-your-business-get-paid-faster-and-improve-your-accounts-receivables
https://textus.com/sms-benchmarks/sms-benchmarks-for-accounting-bookkeeping
https://squareup.com/us/en/invoices
https://www.10dlc.org/en/home/A2PConsent
https://www.infobip.com/blog/tcpa-compliance-sms
