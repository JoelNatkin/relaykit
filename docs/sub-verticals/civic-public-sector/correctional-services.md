## Correctional / probation / parole communications
**Vertical:** Civic & public sector
**Bucket:** Not yet, maybe not ever
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.
**URL slug:** /for/correctional-services

### What this builder is making
Government-operated community-supervision software that tracks supervisees on probation, parole, or pretrial release — their assigned officers, mandated check-in cadence, court dates, treatment and condition requirements, and supervision-fee balances. The operator is a corrections agency, court services unit, or pretrial-services office, not a private business, and the recipient is a person under court-ordered supervision rather than a voluntary customer. The recurring operational job is getting supervisees to scheduled contacts and court appearances so that missed reporting does not escalate into a technical violation.

### Why they need SMS
The single most common supervision condition is regular reporting to an assigned officer, and failure to report is the leading category of technical violation — accounting for over a third of recorded violations in some states — that can return a person to custody. A supervisee who misses a check-in or court date because of a work shift, transit gap, or simple forgetfulness faces a consequence wildly out of proportion to the lapse, and email and mailed letters do not reach this population reliably. SMS reminders measurably cut missed appointments (studies report 20–29% reductions in failures to report and a 20% drop in bench warrants), making the channel uniquely effective at preventing avoidable reincarceration — which is exactly what makes the consent and coercion questions below so serious.

### Message categories
1. appointments — the core of supervision is the scheduled officer check-in and court date; reminders are the proven, highest-value use.
2. account-events — supervision-fee balance and account-status notices map loosely here, but the corpus billing frame is commercial, not governmental (see GAPs).
3. verification — phone-ownership proof when enrolling a supervisee number could apply, but enrollment is rarely self-service in this setting.

Excluded: marketing (no promotional content is ever appropriate to a supervised population — coercion and SHAFT concerns), community (no voluntary community membership), order-updates (no goods), team-alerts (internal-ops framing, not supervisee-facing), waitlist (no queue), customer-support (no support-ticket relationship). All listed categories are FUTURE-only regardless of fit.

### Workflows

**Check-in / reporting reminder**
Remind a supervisee of an upcoming mandatory reporting appointment with their officer.
Sequence:
1. [appointments:reminder-distant] — "Reporting reminder — tomorrow" — sent the day before the scheduled check-in; states the date/time, no condition or case detail
2. [appointments:reminder-proximate] — "Reporting reminder — today" — sent the morning of, as a same-day nudge before the reporting window
3. [appointments:no-show-follow-up] — "Missed reporting — contact your office" — STRETCH: the corpus body offers to "rebook," which misframes a missed mandatory check-in (see Message gaps)
Variable aliases (only where default would feel wrong):
- provider_name: "your supervising officer" (not a clinical "provider")
- reschedule_link / cancel_link: "your office's contact line" — a supervisee cannot self-cancel a mandatory check-in, so a cancel/reschedule action is wrong; the corpus links would have to be suppressed or repointed

**Court-date reminder**
Remind a supervisee or pretrial defendant of an upcoming court appearance.
Sequence:
1. [appointments:reminder-distant] — "Court date reminder" — sent several days ahead (real deployments send at ~10 days, 1 week, and 1 day)
2. [appointments:reminder-proximate] — "Court date — today" — same-day reminder ahead of the hearing time
Variable aliases (only where default would feel wrong):
- provider_name: omit — a court appearance has no "provider"; appointment_time alone carries it
- appointment_time: "Tue Jun 23, 9:00 AM, Dept. 4"

**Supervision-fee reminder**
Remind a supervisee of a supervision-fee payment due under their conditions.
Sequence:
1. GAP:fee-payment-reminder — "Payment reminder" — no corpus message frames a government fee due; appointments and account-events both misfit (see Message gaps)

**Document / condition-item request**
Prompt a supervisee to submit a required document (proof of employment, treatment attendance) tied to a condition.
Sequence:
1. GAP:document-request — "Document needed" — no corpus message covers a neutral "submit X by Y" request (see Message gaps)

**Status / case update**
Notify a supervisee of a change to their reporting schedule or officer assignment.
Sequence:
1. [appointments:reschedule-confirmation] — "Reporting time changed" — STRETCH: corpus body says "see you then," a hospitality frame wrong for a mandated change (see Message gaps)

### Message gaps

**GAP:fee-payment-reminder**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:payment-reminder (new) — distinct from the existing payment-failed, which assumes a stored card and a commercial subscription
- **Proposed universal name:** Payment reminder
- **Why:** many non-commercial operators (government fees, dues, invoices) need a neutral "amount due by date" reminder with no card-declined framing
- **Draft variants:**
  - Standard: `{{workspace_name}}: A payment of {{amount_due}} is due {{due_date}}. View your balance and pay here: {{payment_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: Reminder — {{amount_due}} is due {{due_date}}. You can view and pay here: {{payment_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{amount_due}} due {{due_date}}. Pay: {{payment_link}} STOP to opt out.`
- **New variables:** amount_due ("$45.00"), due_date ("Jun 30"), payment_link
- **Status:** FUTURE

**GAP:document-request**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:action-required (new) — a neutral "submit/complete X by Y" prompt usable far beyond corrections (verification docs, KYC uploads, form completion)
- **Proposed universal name:** Action required
- **Why:** no corpus message asks the recipient to submit something by a deadline without a billing or appointment frame
- **Draft variants:**
  - Standard: `{{workspace_name}}: An item is needed on your account. Submit it here by {{due_date}}: {{action_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: There's one item left to submit. You can add it here by {{due_date}}: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Action needed by {{due_date}}. {{action_link}} STOP to opt out.`
- **New variables:** action_link, due_date
- **Status:** FUTURE

**STRETCH:appointments:no-show-follow-up**
- **Classification:** Stretch
- **Proposed corpus home:** appointments:no-show-follow-up — fits the trigger (recipient missed a scheduled time) but the body's "want to rebook?" hospitality frame misrepresents a missed mandatory check-in, where the correct instruction is to contact the office, not self-rebook
- **Proposed universal name:** Missed appointment follow-up (display alias: "Missed reporting")
- **Why:** the existing rebook/feedback framing is wrong for a mandated, non-self-service appointment
- **Draft variants:**
  - Standard: `{{workspace_name}}: Our records show a missed appointment. Please contact your office: {{contact_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: It looks like an appointment was missed. Please get in touch with your office here: {{contact_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Missed appointment. Contact your office: {{contact_link}} STOP to opt out.`
- **New variables:** contact_link
- **Status:** FUTURE

**STRETCH:appointments:reschedule-confirmation**
- **Classification:** Stretch
- **Proposed corpus home:** appointments:reschedule-confirmation — fits the trigger (a scheduled time moved) but the "see you then" tone is a hospitality frame inappropriate for a mandated schedule change directed by an authority
- **Proposed universal name:** Reschedule confirmation (display alias: "Reporting time changed")
- **Why:** corpus body assumes a mutually agreed reschedule; here the change is directed, not negotiated
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your appointment time has changed to {{appointment_time}}. Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: Please note — your appointment is now {{appointment_time}}. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: New time: {{appointment_time}}. STOP to opt out.`
- **New variables:** none
- **Status:** FUTURE

### Content constraints
- Government-entity pathway: senders are public agencies, not the indie developers RelayKit serves; brand/campaign registration, agency procurement, and case-by-case vetting put every prospect outside the self-serve model — this case-by-case vetting burden is the stated deferral reason.
- Voluntariness / coercion: a person under supervision cannot freely consent the way an ordinary recipient can, and cannot freely opt out — refusing or sending STOP could be read as non-compliance with a condition. The corpus's STOP/opt-out semantics, which assume a genuinely voluntary relationship, are fundamentally fraught here and cannot be safely guaranteed.
- Third-party consent minefield: communications touching family or friends of incarcerated/supervised people are a documented abuse area (vendors have extracted "consent" to location tracking as the price of contact). RelayKit cannot verify that any such consent is free, so this audience is off-limits.
- No case specifics in body: never include charge, offense, condition detail, treatment type, or any stigmatizing language; bodies carry only neutral time/place/amount and a link, with sensitive detail behind authenticated links.
- No promotional content ever (no marketing category use); messages must stay strictly factual and non-coercive.
- Legal review required before any of the above ships; nothing here is approved for the product surface.

### Disambiguation
This is the most-deferred row in the civic vertical because three independent blockers stack: supervisees cannot give free consent or freely opt out (coercion), the family/friend audience is a third-party-consent minefield with documented abuse, and every prospect is a government entity requiring case-by-case legal and procurement vetting that defeats self-serve onboarding. It differs from general court communications (a neutral court-services notice to the public can be more defensible because the recipient is not under an authority's ongoing control) and from legal-aid or public-defender messaging (defense-side, recipient-aligned, voluntary — a different and softer consent posture). What would tip it: a dedicated legal review concluding that consent and opt-out can be made genuinely free for a supervised population, plus an agency-facing pathway distinct from RelayKit's indie self-serve model — absent both, it stays deferred indefinitely.

### Sources
https://www.correcttech.com/probation-parole-0-
https://correctionssoftware.com/
https://fieldware.com/supervision-management-software-for-pretrial-parole-and-probation
https://www.marquisware.com/
https://equivant-supervision.com/solutions/case-management/
https://www.journaltech.com/esupervision
https://www.scramsystems.com/solutions/community-corrections/
https://www.betagov.org/featured-trials/text-message-reminders.html
https://reason.org/policy-brief/text-message-reminders-reduce-parole-probation-violations/
https://marroninstitute.nyu.edu/blog/text
https://www.abajournal.com/lawscribbler/article/text_messages_can_keep_people_out_of_jail
https://thecrimereport.org/2022/02/11/how-a-two-way-text-messaging-system-keeps-people-out-of-jail/
https://www.northbaybusinessjournal.com/article/article/solano-county-employs-uptrust-court-date-text-reminders-to-cut-no-shows/
https://phys.org/news/2025-10-text-message-court-warrants-pretrial.html
https://doc.arkansas.gov/community-correction/division-of-community-correction-community-supervision-fees/
https://www.tn.gov/correction/community-supervision/how-to-pay-supervision-fees.html
https://www.aclu.org/news/privacy-technology/company-handles-prison-phone-calls-surveilling-people-who
https://www.prisonpolicy.org/blog/2017/04/24/securus-privacy/
https://epic.org/documents/epic-comments-on-securus-technologies-petition-for-prison-phone-services-alternative-pricing-scheme/
https://www.10dlc.org/en/home/A2PConsent
https://help.twilio.com/articles/4408675845019-SMS-Compliance-and-A2P-10DLC-in-the-US
