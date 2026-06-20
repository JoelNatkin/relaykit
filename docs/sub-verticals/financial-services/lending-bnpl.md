## Lending / BNPL / credit
**Vertical:** Financial services
**Bucket:** Not yet, maybe not ever
**URL slug:** /for/lending-bnpl
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.

### What this builder is making
Software that originates and services consumer credit — the range spans Affirm/Klarna-style BNPL with installment plans at checkout, short-term and payday-adjacent lenders, and mortgage/auto/student-loan origination tooling that moves a borrower from application through underwriting, servicing, and collections. The platform tracks application status, credit-decision outcomes, disbursement, repayment schedules, autopay, due dates, and delinquency stages. Prime BNPL (interest-free installments, soft credit checks) and high-cost short-term lending sit at opposite ends of carrier risk, and a single category blurs them.

### Why they need SMS
A missed installment or autopay failure is the moment that decides whether a borrower stays current or rolls into delinquency, and email gets ignored while a "payment due Friday" text gets read. Borrowers screen calls but answer texts, so a reminder before the due date and an instant receipt after payment cut both late fees and collections cost. The same channel carries the 2FA and disbursement-confirmation moments where money is moving and the user needs proof now.

### Message categories
1. account-events — payment failed, autopay decline, and subscription/plan-confirmed map directly onto installment billing failures and schedule changes; the churn-critical, miss-in-email core.
2. verification — 2FA at signup and step-up confirmation before disbursement, payment-method change, or large draw; the one category carriers treat permissively even for high-risk lenders.
3. appointments — STRETCH frame for the payment-due reminder lifecycle (pre-due → grace → confirmation), the most-used real lending sequence, but no corpus payment-schedule category exists.
4. customer-support — ticket lifecycle and service-status for borrower questions on a draw or dispute.
Excluded: marketing (promotional credit offers are exactly what carriers prohibit for lending — D-15 EIN-gated marketing would compound, not solve, the risk), order-updates (no physical fulfillment), community, team-alerts, waitlist (no queue model), order-updates.

### Workflows
**Installment repayment cycle**
Keep a BNPL/loan borrower current across a payment schedule with reminders, failure recovery, and receipts.
Sequence:
1. account-events:subscription-confirmed — "Plan confirmed" — fires when an installment plan or loan is set up; confirms the schedule.
2. GAP:payment-due-reminder — "Payment due" — sent a few days before each installment date (see gap).
3. account-events:payment-failed — "Payment failed" — autopay or card decline on an installment; the recovery hinge.
4. GAP:payment-received — "Payment received" — instant receipt after a successful draw (see gap).
Variable aliases (only where default feels wrong):
- account_link: "manage plan"
- card_last4: "card on file"

**Disbursement & sensitive-action confirmation**
Prove ownership and confirm money movement at signup and at every sensitive draw.
Sequence:
1. verification:verification-code — "Verification code" — phone-ownership proof at application/signup.
2. verification:confirmation-code — "Confirmation code" — step-up before disbursement, payment-method change, or large draw.
3. account-events:subscription-confirmed — "Disbursement confirmed" — STRETCH; confirms funds disbursed / plan active.

**Account & access security**
Flag risky account access on an account that controls credit and bank links.
Sequence:
1. account-events:new-device-sign-in — "New sign-in" — access from a new device.
2. account-events:account-suspended — "Account on hold" — account frozen for risk/verification review.
3. verification:recovery-code — "Recovery code" — locked-out account recovery.

### Message gaps
**GAP:payment-due-reminder**
- **Classification:** Vertical-specific
- **Proposed corpus home:** account-events:payment-due-reminder (or a future "billing/payments" category serving lending, subscriptions, and invoicing alike)
- **Proposed universal name:** Payment due reminder
- **Why:** the single most-used legitimate lending SMS — a pre-due nudge — has no corpus home; trial-ending is the nearest analog but addresses lapse, not a recurring scheduled draw.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your payment of {{amount_due}} is due {{due_date}}. Pay or review: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: heads up, {{amount_due}} is due {{due_date}}. Pay or manage it here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{amount_due}} due {{due_date}}. {{account_link}} STOP to opt out.`
- **New variables:** `amount_due` ("$48.25"), `due_date` ("Fri Jun 26")
- **Status:** FUTURE — do not add to corpus until bucket changes.

**GAP:payment-received**
- **Classification:** Vertical-specific
- **Proposed corpus home:** account-events:payment-received (same future billing/payments category)
- **Proposed universal name:** Payment received
- **Why:** an instant post-payment receipt builds trust and reduces "did it go through?" support load; refund-processed is the inverse direction and order-scoped, so it doesn't fit a loan draw.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Payment of {{amount_paid}} received. {{remaining_balance}} remaining. Details: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: got your {{amount_paid}} payment, thank you. {{remaining_balance}} left: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{amount_paid}} received. {{remaining_balance}} left. STOP to opt out.`
- **New variables:** `amount_paid` ("$48.25"), `remaining_balance` ("$144.75")
- **Status:** FUTURE — do not add to corpus until bucket changes.

**STRETCH:account-events:account-suspended**
- **Classification:** Stretch
- **Proposed corpus home:** stretch corpus msg account-events:account-suspended; fit gap is the lending semantic of a credit/risk hold (review pending) versus a generic suspension.
- **Proposed universal name:** Account suspended (display alias "Account on hold")
- **Why:** lending uses a temporary risk/verification hold, not a terminal suspension; the existing body's "next steps" framing covers it without new copy.
- **Status:** FUTURE — do not add to corpus until bucket changes.

### Content constraints
- Payday loans and short-term high-interest / "high-risk" lending are prohibited on 10DLC, short code, and toll-free by CTIA/carrier policy — these sub-verticals are not registerable at standard tier.
- General debt collection and debt-relief/forgiveness messaging is disallowed; at least one carrier expressly prohibits debt-collection text campaigns. Payment-reminder/account-notification messages are permitted only when stripped of collection language and consented directly with the debt owner (no third-party pass-through).
- Direct-lender campaigns may be approved only if the message sender is the loan originator, opt-in is collected separately from the loan application, and borrower data is not shared with third parties.
- High-risk loan types, when allowed at all, are often limited to 2FA / account-notification traffic only — no marketing of loan products.
- Toll-free disallows auto, mortgage, and student loans outright; mortgage-origination tooling cannot lean on TFN as a fallback.
- TILA/UDAAP scrutiny on any APR, rate, fee, or "guaranteed approval" language in SMS bodies — keep terms out of the message; link to disclosures.
- TCPA: prior express written consent before automated texts; STOP opt-out in every body; send only 8am–9pm borrower-local.
- Reg F (collections): Mini-Miranda on initial contact and frequency caps — relevant the moment messaging crosses from reminder into collection.
- No more than one message per day per borrower; carriers and Reg F treat higher frequency as aggressive/harassing.

### Disambiguation
The bucket splits sharply inside this sub-vertical. Payday-adjacent and short-term high-interest lenders are categorically prohibited by carriers and should decline at intake regardless of how the workflow is framed. Prime BNPL (interest-free installments, soft credit check, originator-sent, consent separate from application) is the one segment that may be vettable as a direct-lender account-notification campaign — but the registration burden is real and approval is conditional, which is why the whole family sits in "Not yet, maybe not ever." Mortgage/auto/student-loan origination tooling is allowed on 10DLC as direct-lender but blocked on toll-free, so it cannot rely on the TFN fallback most early-stage senders lean on. Anything that touches debt collection, debt relief, or third-party debt data is a hard decline.

### Sources
https://www.scnsoft.com/payment/app-development/buy-now-pay-later
https://spd.tech/fintech-development/buy-now-pay-later-technology/
https://hesfintech.com/buy-now-pay-later-software/
https://nortridge.com/blog/what-are-the-benefits-of-having-an-sms-integration-in-your-loan-servicing-software/
https://ivytek.com/sms-text-messaging-in-loan-management/
https://verifacto.com/text-messaging-for-loan-collections-the-2026-operational-how-to-guide/
https://textus.com/industries/lending
https://help.loanpro.io/en_US/communications-suite-origination/integrate-interactive-sms
https://www.infobip.com/docs/essentials/usa-and-canada-compliance/us-messaging-use-cases
https://help.cloudtalk.io/en/articles/8001203-unsupported-sms-mms-use-cases-in-usa-and-canada
https://www.insidearm.com/news/00047056-least-one-carrier-now-expressly-prohibits/
https://mytcrplus.com/solutions/financial-services-and-fintech/
https://help.twilio.com/articles/4402972441243-Special-Use-Cases-for-A2P-10DLC
https://www.infobip.com/blog/tcpa-compliance-sms
