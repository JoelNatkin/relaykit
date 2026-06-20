## Pharmacies / prescription apps
**Vertical:** Healthcare
**Bucket:** Not yet
**URL slug:** /for/pharmacies
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.

### What this builder is making
Software for retail, mail-order, or online pharmacies — pharmacy management systems, e-prescribing front-ends, and direct-to-patient Rx apps — that move a prescription through intake, fill/refill, and either ready-for-pickup or delivery. The high-frequency SMS moments are refill-due reminders (before the patient runs out), auto-refill confirmations, ready-for-pickup, and out-for-delivery, often layered with adherence nudges for chronic-medication patients. Because a prescription, and the fact that a person has one filled at a pharmacy, is Protected Health Information under most state and HHS interpretations, every message body is a PHI-relationship even when the text itself names nothing — which is the gating fact for this sub-vertical.

### Why they need SMS
The decisive moment is "your Rx is ready" or "your refill is due before you run out" — a time-boxed event the patient acts on (pick up, approve, expect a delivery) and email reliably buries. A missed refill is an adherence gap with direct clinical consequence; SMS refill reminders are documented to lift adherence among chronic-disease patients, which is exactly why pharmacies push them. SMS wins because it is immediate and read, but the body must stay PHI-hygienic — "your prescription is ready," a secure portal/pickup link, and never the drug name, strength, or condition.

### Message categories
1. order-updates — primary; refill lifecycle (ready, out-for-delivery, delivered) maps directly onto the order-status pattern, bodies kept PHI-hygienic
2. appointments — pharmacy services (vaccinations, consults, MTM appointments) ride the appointments lifecycle as-is
3. account-events — pharmacy-account lifecycle (payment/copay failure on file, account access) where no health detail is implied
4. verification — patient-portal 2FA and step-up confirmation; no PHI, standard carve-out
5. customer-support — pharmacist callback / question-thread handling
Excluded: marketing (promotional Rx/health offers are SHAFT-adjacent and HIPAA-marketing-restricted; refill reminders are transactional, not marketing), community (no community construct), team-alerts (internal, not patient-facing), waitlist (no queue construct in the Rx flow)

### Workflows
**Refill lifecycle (ready / delivery)**
Move a filled or refilled prescription from ready through pickup-or-delivery without ever naming the medication.
Sequence:
1. order-updates:order-confirmed — "Refill received" — sent when a refill request is accepted into the fill queue
2. order-updates:order-processing — "Being filled" — sent when the pharmacy begins filling
3. order-updates:order-shipped — "Ready / shipped" — ready-for-pickup or shipped-to-patient, with secure tracking/pickup link
4. order-updates:out-for-delivery — "Out for delivery" — mail-order/courier Rx out for delivery today
5. order-updates:order-delivered — "Picked up / delivered" — confirmation the Rx was collected or delivered
Variable aliases (only where default feels wrong):
- order_number: "Rx #4821"
- tracking_link: secure pickup/portal link (must be authenticated, not a public status page)
- estimated_delivery: "tomorrow"

**Refill-due / adherence reminder**
Tell the patient a refill is due before they run out — the highest-value pharmacy moment, and the one with no clean corpus home.
Sequence:
1. GAP:refill-due-reminder — "Refill due" — sent N days before the supply runs out, links to a secure refill-approval page
Variable aliases (only where default feels wrong):
- account_link: secure refill/portal link

**Pharmacy services (appointments)**
Handle vaccination, consult, and medication-therapy appointments at the pharmacy.
Sequence:
1. appointments:confirmation — "Appointment confirmed" — service booked
2. appointments:reminder-distant — "Tomorrow" — day-before reminder
3. appointments:reminder-proximate — "In 1 hour" — same-day reminder
4. appointments:no-show-follow-up — "Rebook" — missed-service follow-up
Variable aliases (only where default feels wrong):
- provider_name: "the pharmacy" (avoid implying a specialty that leaks condition)

**Patient-portal verification**
Prove phone ownership and gate sensitive account actions in the Rx app.
Sequence:
1. verification:verification-code — "Verification code" — portal signup / phone verification
2. verification:confirmation-code — "Confirmation code" — step-up before a sensitive account change

### Message gaps
**GAP:refill-due-reminder**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (pharmacy), or a future healthcare-scoped extension of order-updates
- **Proposed universal name:** Refill due (display alias)
- **Why:** the corpus has no "your recurring item is due before you run out" trigger; refill-due is the single highest-value pharmacy message and is a proactive countdown, not an order-status event
- **Status:** FUTURE — do not add to corpus until bucket changes.

**STRETCH:order-updates:order-confirmed**
- **Classification:** Stretch
- **Proposed corpus home:** order-updates:order-confirmed reused as the auto-refill enrollment/confirmation message; fit gap is that "order confirmed" frames a one-time purchase, while auto-refill is an enrollment into a recurring cycle the patient should be able to decline
- **Proposed universal name:** Auto-refill confirmed (display alias)
- **Why:** auto-refill enrollment needs a "we'll refill this automatically — manage here" message that the order-confirmed body approximates but does not cleanly express
- **Draft variants:**
  - Standard: `{{workspace_name}}: Auto-refill is on for your prescription. We'll let you know when it's ready. Manage: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} auto-refill is set up. We'll text you when each refill is ready. Manage anytime: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Auto-refill on. Manage: {{account_link}} STOP to opt out.`
- **Status:** FUTURE — do not add to corpus until bucket changes.

### Content constraints
- HIPAA/BAA gating is the headline: a prescription, and the fact a person fills one at a pharmacy, is PHI. RelayKit defers all PHI relationships until a BAA program exists (D-18) — decline at intake until the bucket moves.
- NEVER put the drug name, strength, dose, quantity, or condition in any body. Use "a prescription" / "your Rx" plus a secure, authenticated link.
- A clean body does not clear the gate: the pharmacy sender + prescription context is itself health data even when the text names nothing.
- Controlled-substance Rx warrants extra care; cannabis/dispensary traffic is carrier-banned outright (federally illegal) regardless of state legality — out of scope.
- Refill reminders are transactional, not marketing — keep them out of the marketing category and free of any promotional or cross-sell content; HIPAA's marketing rules are stricter for health context.
- Consent and opt-out apply; patient must have opted into SMS, STOP/HELP honored on all transactional bodies.
- Verification/2FA is the one carve-out (no PHI, no STOP/HELP in body) and is the only clearly safe pharmacy use even pre-BAA.

### Disambiguation
This sub-vertical sits behind the same BAA gate as clinical-care and mental-health: a HIPAA-covered pharmacy is deferred until RelayKit has a BAA program (D-18), regardless of how clean the message body is. Distinguish it from the veterinary Rx-refill flow (animal-health, Conditional, in batch 1), where the "patient" is a pet and the data is generally not human PHI, and from generic e-commerce order-updates, where a non-Rx retail order ("your vitamins shipped" from a general store) is fine. The trap a developer falls into: an "Rx ready" text looks identical to an order-status text and has a clean body, so it feels covered — but the pharmacy sender plus the prescription context makes it a PHI relationship, which is precisely what is deferred. If the same builder also ships a non-Rx retail line or a pure 2FA flow, those pieces can be served today; only the prescription-linked traffic is gated.

### Sources
https://emitrr.com/blog/prescription-refill-reminders/
https://emitrr.com/blog/sms-templates-for-pharmacy/
https://www.pharmacytimes.com/view/walgreens-introduces-mobile-text-alerts-for-prescription-refills
https://www.walgreens.com/topic/pharmacy/text-alerts.jsp
https://www.cvs.com/mobile-cvs/text
https://www.paubox.com/blog/improve-pharmacy-services-with-hipaa-compliant-text-message-reminders
https://www.paubox.com/blog/do-you-need-patient-opt-in-for-prescription-refill-reminders
https://luxsci.com/blog/hipaa-really-permit-reminding-patients-pick-prescriptions.html
https://messageflow.com/blog/sms-marketing-for-pharmacies/
https://mytcrplus.com/home/tcr-resources/industry-sms-compliance-playbooks/healthcare-sms-compliance-playbook/
