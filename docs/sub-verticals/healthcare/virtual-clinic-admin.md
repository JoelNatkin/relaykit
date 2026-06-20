## Virtual-first clinic admin (booking/intake, no clinical content in SMS)
**Vertical:** Healthcare
**Bucket:** Conditional
**URL slug:** /for/virtual-clinic-admin

### What this builder is making
Telehealth practice-operations software for direct-to-consumer virtual clinics and telehealth startups: online booking, text-based patient intake (no portal/app), eligibility and payment collection, and — the defining job — delivery of the secure video-visit link at appointment time. Unlike brick-and-mortar admin where the reminder points a patient to a physical location, here the "visit" is a time-limited link that opens an authenticated waiting room in the patient's browser, so link delivery itself is the product. SMS stays strictly operational — booking, reminders, link delivery, intake nudges, payment — and carries no clinical content.

### Why they need SMS
The defining moment is the join-now nudge in the minutes before a scheduled video visit: the patient gets an SMS, taps the link, and the camera opens — no portal login, no app download. If that link is buried in email or never seen, the patient simply doesn't show, and a virtual no-show is a fully wasted provider slot. SMS wins because it has a ~98% open rate read within minutes, which is exactly the window a time-of-visit link needs.

### Message categories
1. appointments — booking confirmation, the multi-touchpoint reminder cadence (24h / a few hours / proximate), reschedule, cancellation, no-show follow-up; the operational spine of a virtual visit
2. account-events — payment-failed and billing-lifecycle messages for subscription/membership virtual clinics
3. verification — phone-ownership proof at signup and step-up confirmation for sensitive account actions
Excluded: marketing (promotional content is out of scope for visit admin and would need separate consent + EIN gating; healthcare promo risks SHAFT-C scrutiny), order-updates (no physical fulfillment), team-alerts (patient-facing, not staff ops), community (no community layer), waitlist (most DTC telehealth books to a concrete slot, not a queue).

### Workflows
**Book-to-visit (the core virtual visit lifecycle)**
Get a booked patient confirmed, reminded, and onto the video link at the right minute.
Sequence:
1. appointments:confirmation — "Visit confirmed" — sent when the patient books the video slot
2. appointments:reminder-distant — "Day-before reminder" — sent ~24h out, with reschedule link
3. appointments:reminder-proximate — "Join-now link" — sent ~15 min before; carries the secure visit link to the authenticated waiting room
4. appointments:no-show-follow-up — "Missed visit, rebook" — sent if the patient never joins
Variable aliases (only where default feels wrong):
- provider_name: "Dr. Lee" (or "your care team" when no named provider)
- cancel_link / reschedule_link: "manage-visit link"

**Reschedule / cancel**
Keep the slot accurate when plans change.
Sequence:
1. appointments:reschedule-confirmation — "Visit moved" — sent when the patient picks a new time
2. appointments:cancellation-confirmation — "Visit cancelled" — sent on cancel, with rebook link

**Post-visit feedback**
Close the loop without touching clinical content.
Sequence:
1. appointments:post-appointment — "How did your visit go?" — generic feedback prompt, no reference to what was discussed

**Account & billing (membership/subscription clinics)**
Keep DTC virtual-clinic accounts active.
Sequence:
1. account-events:payment-failed — "Card declined" — card-on-file fails for a membership/visit charge
2. account-events:subscription-confirmed — "Plan updated" — renewal or plan change confirmed

**Signup & step-up verification**
Prove phone ownership and gate sensitive actions.
Sequence:
1. verification:verification-code — "Signup code" — phone verification at account creation
2. verification:confirmation-code — "Confirm change" — step-up before a payment-method or account change

### Message gaps
**GAP:intake-needed-before-visit**
- **Classification:** Vertical-specific
- **Proposed corpus home:** appointments:intake-required (or sub-vertical registry layer as an appointments variant)
- **Proposed universal name:** "Intake needed before visit" (display alias for telehealth)
- **Why:** virtual clinics must collect intake before the visit can proceed, and a pre-visit "complete your intake" nudge is a distinct trigger from a plain reminder — no current corpus message covers "an action is required before the appointment can happen."

**GAP:pre-visit-payment-or-balance**
- **Classification:** Universal miss
- **Proposed corpus home:** appointments:payment-due (or account-events:balance-due)
- **Proposed universal name:** "Payment or balance due before visit"
- **Why:** text-to-pay before a visit (copay/eligibility balance) is a real, recurring telehealth admin trigger with no corpus home — appointments has no payment-request message and account-events:payment-failed only covers a declined card-on-file, not a requested payment.
- **Draft variants:**
  - Standard: `{{workspace_name}}: A balance of {{amount}} is due before your visit. Pay here: {{payment_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: There's a {{amount}} balance to settle before your visit. Quick pay: {{payment_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{amount}} due before visit. Pay: {{payment_link}} STOP to opt out.`
- **New variables:** amount, payment_link

### Content constraints
- NO clinical content of any kind: appointment and link messages reference a generic "your visit" / "your appointment" — never symptoms, test names, results, diagnosis, medications, procedure, or the reason for the visit.
- The visit link must point to an authenticated waiting room (time-limited, expires after the visit), not an open video room — the SMS itself carries no credentials or session data.
- Provider/clinic naming must not imply a sensitive specialty; use a generic clinic name or "your care team" where the named provider would reveal the nature of care.
- The moment an SMS touches clinical content — a symptom-referencing note, a "follow-up on your results" message — it leaves admin territory and escalates to clinical care, which is declined.
- Documented patient consent before any SMS; honor STOP on every transactional message (verification 2FA excepted).
- Standard financial-message care: balance/payment texts state an amount and a link only — no insurance details, no service description.

### Disambiguation
Virtual-first clinic admin is defined by video-link delivery — the reminder's payload is a tap-to-join link to an authenticated waiting room, not directions to a physical address; that is what separates it from brick-and-mortar healthcare admin, where reminders point to a location. It is also distinct from clinical telehealth messaging (symptom check-ins, results follow-up, care-plan nudges), which is declined outright. The escalation line is bright: any clinical content — results, symptoms, or follow-up about a condition — flips the use case out of Conditional and into declined clinical-care territory. A developer commonly assumes a "follow-up on your test results" SMS is just another reminder; it is not — it is clinical content and is out of scope. Keep every message to the operational shell of the visit (when, link, pay, rebook) and it stays in bucket.

### Sources
https://curogram.com/blog/emr-integration/meditab-ims/text-link-telemedicine-no-app-download-video-visits
https://curogram.com/blog/emr-integration/tebra/tebra-patient-intake-form-text-message-no-portal-no-app-mobile-phone-complete-before
https://curogram.com/blog/emr-integration/tebra/tebra-patient-pay-balance-text-message-no-portal-no-login-sms-payment-link-two-taps
https://curogram.com/blog/reducing-no-shows-in-telemedicine-with-automated-text-reminders
https://www.healthviewx.com/virtual-clinic-app/
https://www.tebra.com/patient-experience/online-scheduling
https://vsee.com/
https://emitrr.com/blog/how-to-reduce-telehealth-no-shows/
https://www.accountablehq.com/post/are-appointment-reminders-hipaa-compliant-what-you-can-and-can-t-include
https://www.rovinghealth.com/articles/hipaa-compliant-text-messaging-medical-practices-rules
