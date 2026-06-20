## Healthcare administrative (scheduling, intake, billing — non-clinical)
**Vertical:** Healthcare
**Bucket:** Conditional
**URL slug:** /for/healthcare-admin

### What this builder is making
Practice-management and front-office software for dental offices, PT clinics, and small medical practices — the operational layer that books appointments, sends pre-visit intake/consent forms, runs reminders, and collects outstanding balances (Dentrix Ascend, tab32, NexHealth, Empower EMR, Curogram are representative). The recipients are patients; the job is logistics, not care. Every body stays strictly administrative — appointment timing, a form link, a balance — with no clinical detail of any kind.

### Why they need SMS
A missed appointment is a dead revenue slot the practice can't refill — PT clinics cite roughly $200 per no-show and tens of thousands lost annually — and an unsubmitted intake form means the visit starts late or gets bumped. SMS lands where it matters: patients check texts dozens of times a day, confirm or reschedule by reply, and ~32% pay a balance within minutes of a payment-link text. Email and voicemail simply don't get opened in the window that changes the outcome.

### Message categories
1. appointments — the core job: confirmations, day-before and hour-before reminders, reschedules, cancellations, no-show rebooks, post-visit feedback
2. account-events — balance-due / payment-failed style billing nudges to a secure pay or portal link
3. verification — phone-ownership at patient-portal signup and step-up confirmation for payment/record-access actions
4. customer-support — front-desk back-and-forth on a logged request (billing question, form trouble)
Excluded: marketing (PHI-adjacent promo to patients invites consent and SHAFT scrutiny; recall/reactivation campaigns are a separate explicit-consent EIN-gated motion, not in scope here), order-updates (no physical fulfillment), team-alerts (staff-facing, not patient-facing), community, waitlist (cancellation-fill waitlists exist but are a thin edge, not a primary motion).

### Workflows

**Appointment reminder cycle**
Cut no-shows by confirming the booking and nudging the patient as the visit approaches.
Sequence:
1. appointments:confirmation — "Appointment confirmed" — fires when the visit is booked
2. appointments:reminder-distant — "Day-before reminder" — ~24h out, with cancel/reschedule link
3. appointments:reminder-proximate — "Same-day reminder" — ~1h out
4. appointments:reschedule-confirmation — "Rescheduled" — when the patient or office moves the slot
5. appointments:cancellation-confirmation — "Cancelled" — on cancellation, with a rebook link
6. appointments:no-show-follow-up — "We missed you" — after a missed visit, prompting rebook
7. appointments:post-appointment — "Visit feedback" — after the visit, to a feedback link
Variable aliases (only where default feels wrong):
- provider_name: "Dr. Reyes"
- appointment_time: "Tue Jun 23, 2:00 PM"

**Pre-visit intake**
Get intake and consent forms completed before the patient arrives so the visit starts on time.
Sequence:
1. appointments:confirmation — "Appointment confirmed" — booking confirmed
2. GAP:intake-form-request — "Forms to complete" — sends the patient a link to outstanding intake/consent forms ahead of the visit (see Message gaps)
3. appointments:reminder-distant — "Day-before reminder" — day-before nudge, doubling as a forms-not-done prompt
Variable aliases (only where default feels wrong):
- (none)

**Balance collection**
Recover post-visit balances by texting a link to a secure payment/portal page.
Sequence:
1. STRETCH:account-events:payment-failed — "Balance due" — notifies the patient a balance is outstanding and links to a secure pay page (corpus message is card-decline framed; see Message gaps)
2. verification:confirmation-code — "Payment confirmation code" — step-up code before a sensitive payment action, no STOP/HELP in body
3. customer-support:ticket-received — "Billing question logged" — if the patient replies with a question, acknowledge the request
Variable aliases (only where default feels wrong):
- account_link: "your secure pay page"

**Patient portal access**
Prove phone ownership at portal signup and gate sensitive record/payment actions.
Sequence:
1. verification:verification-code — "Portal signup code" — phone-ownership proof at portal registration
2. verification:login-code — "Portal login code" — SMS second factor at sign-in
3. verification:recovery-code — "Account recovery code" — locked-out portal recovery
Variable aliases (only where default feels wrong):
- (none)

### Message gaps

**GAP:intake-form-request**
- **Classification:** Universal miss
- **Proposed corpus home:** appointments:intake-form-request
- **Proposed universal name:** "Pre-visit form request"
- **Why:** sending a patient a link to complete required forms before an appointment is a distinct, cross-vertical pre-visit trigger the corpus doesn't cover (it also serves onboarding/legal intake broadly).
- **Draft variants:**
  - Standard: `{{workspace_name}}: please complete your forms before your visit {{appointment_time}}: {{form_link}} Reply STOP to opt out.`
  - Friendly: `Before we see you {{appointment_time}}, please fill out your forms here: {{form_link}} Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: complete your forms before {{appointment_time}}: {{form_link}} STOP to opt out.`
- **New variables:** form_link

**STRETCH:account-events:payment-failed**
- **Classification:** Stretch
- **Proposed corpus home:** stretch onto account-events:payment-failed; fit gap is that the corpus message is framed around a declined card on file ("Card ending X was declined"), whereas a patient balance is a positive amount owed after a visit with no card on file — different trigger, different framing.
- **Proposed universal name:** "Balance due" (display alias over a patient-balance message)
- **Why:** post-visit balance collection is a primary motion, and the nearest corpus message assumes a subscription card decline rather than an itemized amount owed.
- **Draft variants:**
  - Standard: `{{workspace_name}}: you have a balance of {{balance_amount}}. Pay securely here: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: there's a balance of {{balance_amount}} on your account. Pay it securely here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: balance {{balance_amount}} due. Pay: {{account_link}} STOP to opt out.`
- **New variables:** balance_amount

### Content constraints
- No PHI in the body: no diagnosis, no condition, no treatment or procedure detail, no medication names, no test/lab/imaging results.
- Reminders stay generic: "your appointment," never "your root canal" or "your physical therapy for your back."
- Avoid inferable specifics: a department or specialty name in the body can imply a condition (e.g. an oncology dept reference) — keep the sender frame to the practice's general name.
- Anything sensitive goes behind a link: route forms, statements/EOBs, and results to a secure portal or HIPAA-safe payment page, never into the SMS body.
- Get patient consent before texting; the first message must carry "Reply STOP to opt out" (verification 2FA codes carry the standard 2FA carve-out — no STOP/HELP).
- Billing messages must not pair an identifiable name with any condition or service description; keep them to "a balance" and an amount.
- Expect heightened carrier/TCR scrutiny on healthcare campaigns — medical terminology raises spam-filter and vetting flags, which is another reason bodies stay administrative and term-free.

### Disambiguation
This stays Conditional only as long as every body is pure logistics — date, time, a generic provider name, a link, an amount. The moment an SMS body carries a symptom, a result, a diagnosis, or any treatment content, it crosses into clinical-care territory, which RelayKit declines at intake (D-18: no PHI through the proxy, no BAA). That line separates it from telehealth and clinical messaging platforms (which move care content and need a BAA) — those are out. It also differs from wellness/fitness apps, which carry no PHI and sit in Clear, and from veterinary practice software, which has the same admin shape but no HIPAA exposure because the patient is an animal.

### Sources
https://www.nexhealth.com/features/forms
https://help.nexhealth.com/en/articles/10046578-how-do-i-send-forms-automatically
https://help.nexhealth.com/en/articles/10046646-how-do-i-set-up-appointment-reminders
https://www.empoweremr.com/products/appointment-reminders
https://zandahealth.com/us/features/sms-and-email-communication/
https://hellonote.com/reduce-patient-cancellations-auto-reminders/
https://tab32.com/
https://www.patientxpress.us/
https://curogram.com/text-to-pay
https://curogram.com/blog/smart-automation/automated-patient-billing-sms
https://www.rectanglehealth.com/platform/bridge-payments-and-financing/text-to-pay/
https://drchrono.com/blog/2025/03/what-is-text-to-pay-simplifying-payments-for-modern-healthcare-practices/
https://www.apptoto.com/industries/hipaa
https://www.messagedesk.com/blog/hipaa-compliant-texting
https://www.fqhc.org/blog/2022/11/21/4-rules-for-sending-hipaa-compliant-text-message-appointment-reminders
https://trumpia.com/blog/are-text-message-appointment-reminders-hipaa-compliant/
https://www.doctible.com/blog/changes-to-10dlc-2023-what-healthcare-practices-need-to-know
https://mytcrplus.com/solutions/healthcare-sms-compliance/
