## Medical billing / RCM tools (B2B)
**Vertical:** Healthcare
**Bucket:** Conditional
**URL slug:** /for/medical-billing

### What this builder is making
B2B revenue-cycle-management and medical-billing SaaS that clinics and practices run to submit claims, work denials, post payments, manage A/R follow-up, and collect outstanding patient balances. The recipients split two ways: practice staff get workflow alerts (a claim was rejected, a denial needs an appeal, a payment posted) and patients get balance-due, statement-ready, and payment-plan reminders. Crucially, no PHI ever rides in the SMS — patient bodies say "a balance" / "your statement" plus a secure portal link, never a diagnosis, procedure, or condition.

### Why they need SMS
A patient balance has gone unpaid for weeks, or a payment-plan installment is due, or a denied claim is sitting in a worklist losing reimbursement window — and email and paper statements get ignored. Unpaid patient balances are the single largest source of revenue-cycle leakage, and over 30% of patients who get an SMS payment link pay within five minutes. SMS turns a statement nobody opens into a tap-to-pay link that clears the balance before it ages into write-off.

### Message categories
1. account-events — primary: patient-facing "statement ready / balance due / payment received" map cleanly to billing/lifecycle alerts (PHI-free bodies, portal link).
2. customer-support — billing-inquiry ticket lifecycle when a patient questions a charge; staff-routed back-and-forth.
3. team-alerts — staff-facing operational pings: a denial needs an appeal, a claim rejected, an A/R threshold breached.
4. verification — portal login / payment-confirmation codes for the patient payment portal.
Excluded: appointments (clinical scheduling is the declined EHR/telehealth surface, not billing), order-updates (no physical fulfillment), waitlist (no queue), community (no membership layer), marketing (promotional patient outreach is off-limits for medical debt; SHAFT-C and FDCPA risk).

### Workflows
**Patient balance collection**
Notify the patient a statement is ready and drive a PHI-free tap-to-pay to clear the balance before it ages.
Sequence:
1. account-events:payment-failed — "Statement ready" — STRETCH-reframed: sent when a new patient balance posts; "card declined" framing replaced by "a balance is ready to view" + portal link.
2. account-events:trial-ending — "Balance reminder" — STRETCH-reframed as a recurring nudge that a balance is still open; default trial wording does not fit.
3. account-events:subscription-confirmed — "Payment received" — confirmation a payment posted; reframed from subscription wording.
Variable aliases (only where default feels wrong):
- account_link: "your statement portal"
- workspace_name: "Riverside Family Practice"

**Payment-plan reminders**
Remind a patient an installment on their payment plan is due and link to pay.
Sequence:
1. account-events:payment-failed — "Installment due" — STRETCH-reframed: an upcoming/missed plan installment; PHI-free "a balance" framing.
2. account-events:subscription-confirmed — "Installment received" — confirms the installment posted.
Variable aliases (only where default feels wrong):
- account_link: "your payment plan"

**Billing-inquiry support**
Handle a patient question about a charge through a staff-routed ticket without naming the service.
Sequence:
1. customer-support:ticket-received — "Inquiry received" — patient's billing question logged.
2. customer-support:agent-response — "Billing reply" — staff replied; view in portal.
3. customer-support:resolution-notification — "Inquiry resolved" — charge question closed.

**Staff billing-workflow alerts**
Page the billing team when a claim or denial needs human attention so reimbursement isn't lost to the clock.
Sequence:
1. team-alerts:system-alert — "Claim rejected" — a clearinghouse rejection or scrub failure needs rework; no patient identifiers.
2. team-alerts:escalation-ping — "Denial needs appeal" — a denied claim with an approaching appeal deadline; reply ACK to claim.
3. team-alerts:service-level-alert — "A/R threshold breach" — aged-A/R or worklist backlog crossed a threshold.
Variable aliases (only where default feels wrong):
- system_name: "Aetna claims batch"
- alert_type: "claim rejection"

**Portal access**
Confirm patient identity at the payment portal without exposing account detail.
Sequence:
1. verification:login-code — "Portal login code" — 2FA into the patient payment portal (no STOP/HELP).
2. verification:confirmation-code — "Payment confirmation code" — step-up before a payment submits.

### Message gaps
**STRETCH:account-events:payment-failed**
- **Classification:** Stretch
- **Proposed corpus home:** stretch corpus msg `account-events:payment-failed`; fit gap is that "card declined" framing is wrong — the trigger is "a patient balance posted / statement is ready," not a failed charge.
- **Proposed universal name:** Statement ready / balance due
- **Why:** patient-balance collection is the core RCM SMS job and no corpus message frames a generic "you have a new balance, tap to pay" notice.
- **Draft variants:**
  - Standard: `{{workspace_name}}: You have a new statement ready to view. See the balance and pay securely here: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}} here - a new statement is ready for you. View the balance and pay anytime: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: New statement ready. View and pay: {{account_link}} STOP to opt out.`
- **New variables:** none

**GAP:payment-plan-installment-due**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (alias over account-events) — payment-plan installments are a billing-specific cadence
- **Proposed universal name:** Payment-plan installment due (display alias: "Installment due")
- **Why:** a recurring "your next plan installment is due" nudge has no clean corpus home; it is distinct from a one-off balance.

### Content constraints
- NO PHI, ever: never pair a patient name with a diagnosis, condition, procedure, or service in any body.
- Never combine an account/MRN number with a condition or service name.
- Patient-balance bodies say "a balance," "your statement," "your payment plan" + a secure portal link — never the amount tied to a named service, never the reason for the charge.
- Debt-collection-language caution: overdue medical balances can pull the sender (especially third-party billers) under FDCPA / Regulation F — avoid "debt," "collections," "final notice," and amount-owed demands in SMS; keep it a neutral statement-ready nudge to a portal.
- Staff-facing alerts avoid all patient identifiers — reference claim batches, payers, queues, ticket IDs, never patient names or conditions.
- Explicit opt-in for billing texts collected at intake or in the portal; every patient-facing body carries "Reply STOP to opt out" (verification codes carve out — no STOP/HELP).
- No promotional content to patients carrying medical debt — keep marketing entirely out of this surface.

### Disambiguation
This is the billing back-office of a practice — claims, denials, A/R, patient balances — not clinical care. RelayKit serves the RCM layer; it declines the EHR/telehealth surface (visit notes, lab results, care messaging, appointment-as-clinical-event), because those inevitably tie a person to a medical service. The Conditional + case-by-case posture is exactly this line: patient-facing balance collection is allowed only when bodies are strictly PHI-free ("a balance," "your statement," portal link); the moment a message ties a named person to a diagnosis, procedure, or named service, it crosses into clinical/PHI territory and is out. It also differs from generic accounting/AR tools in the financial-services family — the same "you have a balance" text is routine there, but the medical context raises the bar to no-PHI and FDCPA-aware wording.

### Sources
https://curogram.com/blog/smart-automation/medical-text-to-pay
https://curogram.com/blog/smart-automation/automated-patient-billing-sms
https://billflash.com/payment-services/hipaa-compliant-text-messaging/
https://billflash.com/payment-services/text-to-pay-for-healthcare-practices
https://mailmystatements.com/sms-patient-billing-is-text-to-pay-hipaa-compliant/
https://drchrono.com/blog/2025/03/what-is-text-to-pay-simplifying-payments-for-modern-healthcare-practices/
https://www.revenuewell.com/article/texting-patients-laws-best-practices
https://getsolum.com/glossary/tcpa-healthcare-texting-rules
https://www.federalregister.gov/documents/2024/10/04/2024-22962/debt-collection-practices-regulation-f-deceptive-and-unfair-collection-of-medical-debt
https://www.tratta.io/blog/medical-debt-collection-fdcpa-regulations
https://www.inboxhealth.com/
