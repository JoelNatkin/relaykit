## Court / judicial system communications
**Vertical:** Civic & public sector
**Bucket:** Not yet
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.
**URL slug:** /for/court-communications

### What this builder is making
A court-communication SaaS — used by courts, clerks' offices, public defenders, and pretrial-services programs — that ingests case data (defendants/litigants, hearings, filing deadlines, payment obligations) from a case-management system and fires automated notifications. The core product is appearance reminders ahead of a scheduled hearing, supplemented by filing-deadline alerts, fine/fee payment reminders, jury notices, and case-status updates. It is a notification layer bolted onto judicial recordkeeping, not a legal-practice or document-drafting tool.

### Why they need SMS
The defining moment is a defendant who forgets a court date: a failure-to-appear (FTA) triggers a bench warrant, possible arrest, and added charges — a costly outcome for the person and the court. SMS wins because the population reached often lacks reliable email or mail but carries a phone, and a timed reminder lands where it is read. The evidence base is strong: text reminders have cut FTAs by 20–26% in controlled studies and over 50% in some Uptrust jurisdictions, making this one of the best-documented SMS-impact cases in any vertical.

### Message categories
1. appointments — appearance reminders are the product's spine; hearing confirmation, distant/proximate reminders, reschedule, cancellation, and post-hearing follow-up map cleanly onto the appointment lifecycle.
2. account-events — fine/fee payment-failed and obligation alerts map to billing-style lifecycle messages; payment reminders are a documented second use case.
3. team-alerts — emergency court-closure / weather alerts to affected parties map to system-alert-style broadcasts.

Excluded: marketing (no promotional content in a justice context, ever), order-updates (no physical fulfillment), waitlist (no queue model), verification (no consumer 2FA), community (no membership model), customer-support (no ticketing relationship).

### Workflows

**Appearance reminder cadence**
The core workflow — a stepped sequence of reminders ahead of a scheduled hearing to prevent FTA.
Sequence:
1. [appointments:confirmation] — "Hearing scheduled" — sent when a hearing is set, stating the case, date, and courtroom.
2. [appointments:reminder-distant] — "Hearing reminder" — sent ~7 days (and optionally 30 days) before the date.
3. [appointments:reminder-proximate] — "Hearing tomorrow / today" — sent ~24h and again ~4h before the hearing.
Variable aliases (only where default would feel wrong):
- provider_name: "Dept. 12, Hon. A. Rivera" (the courtroom/department, not a clinician)
- appointment_time: "Tue Jun 23, 8:30 AM"
- cancel_link: (omit — defendants cannot self-cancel a hearing; see GAP below)

**Hearing reschedule / continuance**
A hearing is moved (continuance) or vacated; the party must be told the new date or that no appearance is needed.
Sequence:
1. [appointments:reschedule-confirmation] — "Hearing continued" — sent when a hearing is moved to a new date.
2. [appointments:cancellation-confirmation] — "Hearing vacated" — sent when a hearing is cancelled/vacated. STRETCH: the corpus body offers a "rebook anytime" link, which is wrong for a court hearing.

**Missed-appearance follow-up**
A scheduled party did not appear; some programs send a same-day outreach before a warrant is finalized.
Sequence:
1. [appointments:no-show-follow-up] — "Missed hearing" — sent after a missed appearance. STRETCH: corpus body says "we missed you, want to rebook?" — a court cannot offer rebooking and must use neutral, non-coercive framing.

**Filing-deadline alert**
A litigant or self-represented party has a filing or response deadline approaching.
Sequence:
1. GAP:filing-deadline-reminder — "Filing deadline" — sent at intervals before a court-imposed filing/response deadline.

**Fine / fee payment reminder**
A defendant owes court-ordered fines or fees with a due date; reminders reduce delinquency and added penalties.
Sequence:
1. GAP:payment-due-reminder — "Payment due" — sent ahead of a payment due date with the amount and a payment link.
2. [account-events:payment-failed] — "Payment didn't go through" — sent if an online payment is declined. STRETCH: corpus body frames around a subscription card-on-file; court context is a one-time obligation.

**Case-status update**
A case event (ruling, disposition, document available) the party should know about.
Sequence:
1. GAP:case-status-update — "Case update" — sent when a notable case event occurs, pointing to a portal.

**Jury duty notification**
A randomly selected resident is summoned, given a reporting date, or told status changed.
Sequence:
1. GAP:jury-summons — "Jury summons" — sent on selection, with the questionnaire/portal link.
2. [appointments:reminder-distant] — "Report reminder" — reminder ahead of the assigned reporting date.

**Court-closure / emergency alert**
A weather or security event closes the court; affected parties are told not to appear.
Sequence:
1. [team-alerts:system-alert] — "Court closure" — broadcast to parties with hearings on the affected day. STRETCH: team-alerts is built for internal ops staff, not external public recipients.

### Message gaps

**GAP:filing-deadline-reminder**
- **Classification:** Vertical-specific
- **Proposed corpus home:** appointments:filing-deadline-reminder (deadline is a date obligation without an in-person slot)
- **Proposed universal name:** "Deadline reminder"
- **Why:** a court-imposed filing/response deadline has no appointment-time analog in the corpus.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your filing deadline for case {{case_number}} is {{deadline_date}}. Details: {{action_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: A reminder that case {{case_number}} has a filing deadline on {{deadline_date}}. Details: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Case {{case_number}} filing deadline {{deadline_date}}. {{action_link}} STOP to opt out.`
- **New variables:** case_number ("CR-2026-004812"), deadline_date ("Jul 1")
- **Status:** FUTURE

**GAP:payment-due-reminder**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:payment-due-reminder (corpus has payment-failed but no proactive "amount due by date" reminder)
- **Proposed universal name:** "Payment due reminder"
- **Why:** a scheduled-amount-due-by-date reminder is broadly useful and absent from the corpus.
- **Draft variants:**
  - Standard: `{{workspace_name}}: A payment of {{amount_due}} is due {{due_date}}. Pay or view details: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: A reminder that {{amount_due}} is due {{due_date}}. You can pay here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{amount_due}} due {{due_date}}. Pay: {{account_link}} STOP to opt out.`
- **New variables:** amount_due ("$185.00"), due_date ("Jun 30")
- **Status:** FUTURE

**GAP:case-status-update**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (too judicial-specific for a universal category)
- **Proposed universal name (display alias):** "Case update"
- **Why:** a neutral "a case event occurred, view the portal" message has no corpus home outside support ticketing.
- **Status:** FUTURE

**GAP:jury-summons**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name (display alias):** "Jury summons"
- **Why:** jury selection is unique to courts and has no general-purpose analog.
- **Status:** FUTURE

**STRETCH:appointments:cancellation-confirmation**
- **Classification:** Stretch
- **Proposed corpus home:** appointments:cancellation-confirmation with a justice-context body variant (drop "rebook anytime")
- **Proposed universal name:** "Hearing vacated"
- **Why:** the corpus body invites rebooking, which is invalid for a vacated court hearing.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your hearing for case {{case_number}} on {{appointment_time}} is vacated. No appearance needed. Details: {{action_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: Update on case {{case_number}}: your {{appointment_time}} hearing is vacated, no appearance needed. {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Case {{case_number}} hearing vacated. No appearance needed. STOP to opt out.`
- **Status:** FUTURE

**STRETCH:appointments:no-show-follow-up**
- **Classification:** Stretch
- **Proposed corpus home:** appointments:no-show-follow-up with a neutral justice-context variant
- **Proposed universal name:** "Missed hearing notice"
- **Why:** corpus "want to rebook?" framing is wrong; court framing must be neutral and non-coercive, pointing to next steps without threat.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Our records show a missed hearing for case {{case_number}}. Please review next steps: {{action_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: It looks like case {{case_number}} had a missed hearing. Here's what to do next: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Case {{case_number}} missed hearing. Next steps: {{action_link}} STOP to opt out.`
- **Status:** FUTURE

**STRETCH:team-alerts:system-alert**
- **Classification:** Stretch
- **Proposed corpus home:** team-alerts:system-alert reframed as an external party-facing closure broadcast
- **Proposed universal name:** "Court closure alert"
- **Why:** team-alerts targets internal ops staff with severity cues; a court-closure broadcast goes to external public recipients and needs plain, non-severity framing.
- **Draft variants:**
  - Standard: `{{workspace_name}}: The court is closed {{closure_date}} due to {{closure_reason}}. Do not appear; you'll be notified of new dates. Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: Heads up — the court is closed {{closure_date}} ({{closure_reason}}). Please don't come in; new dates to follow. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Court closed {{closure_date}}, {{closure_reason}}. Do not appear. STOP to opt out.`
- **New variables:** closure_date ("Jun 23"), closure_reason ("severe weather")
- **Status:** FUTURE

**STRETCH:account-events:payment-failed**
- **Classification:** Stretch
- **Proposed corpus home:** account-events:payment-failed with a one-time-obligation body variant (no card-on-file framing)
- **Proposed universal name:** "Court payment failed"
- **Why:** corpus body assumes a subscription card on file; court fines are one-time obligations.
- **Draft variants:**
  - Standard: `{{workspace_name}}: A payment for case {{case_number}} did not go through. Try again here: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: A payment for case {{case_number}} didn't go through. You can retry here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Case {{case_number}} payment failed. Retry: {{account_link}} STOP to opt out.`
- **Status:** FUTURE

### Content constraints
- Government-entity TCR registration is a distinct pathway: the brand entity type must be "Government" with an EIN that matches a government entity, which routes a different vetting flow than a Standard Brand and is the reason this bucket is Not yet. RelayKit's onboarding is built for the standard private-entity registration path.
- No carrier exemption for justice/government use: carriers and CTIA require explicit opt-in and honored opt-out for each campaign use case — political, emergency, and government messaging are not exempt from consent rules.
- Consent in a justice context is nuanced: defendants and litigants are not voluntary commercial subscribers, so opt-in collection and the right to opt out (STOP) must be handled carefully and may interact with how the court captures contact consent at intake.
- Framing must be strictly neutral and non-coercive: no threats, no implied penalties as leverage; reminders state facts and next steps only (the evidence base favors informational + plan-making framing, not warnings).
- No promotional content of any kind; no legal advice; messages point to official portals/links rather than asserting case outcomes.
- DCA/carrier campaign vetting adds review time and can require manual review for sensitive content — surface "a few days" framing, never specific day counts.

### Disambiguation
This is "Not yet" purely because of the registration pathway, not the value: court-date SMS is one of the most evidence-backed use cases anywhere, but it requires the government-entity TCR brand type (EIN matching a government entity), a vetting flow RelayKit does not yet support. It is distinct from legal-practice tools serving the private bar (law-firm client intake, matter updates, consultation reminders — a Standard-Brand path that could land in Clear/Conditional) and from legal-aid nonprofits (501(c)(3) entity type, again different from government). The deferral is customer-pull dependent: it tips to Conditional once RelayKit builds and validates a government-entity onboarding path and confirms carrier acceptance of court-notification campaigns, ideally pulled by a real court/public-defender customer rather than built speculatively.

### Sources
https://ecourtdate.com/
https://ecourtdate.com/court-reminders
https://ecourtdate.com/messages
https://ecourtdate.com/message-templates
https://ecourtdate.com/use-cases
https://www.txcourts.gov/programs-services/court-reminder-program/
https://equivant-pretrial.com/solutions/court-date-reminders/
https://textgov.com/pre-trial-text-reminder-service/
https://www.captira.com/pages/probation-court-reminder-software
https://www.science.org/doi/full/10.1126/sciadv.adx7483
https://www.abajournal.com/lawscribbler/article/text_messages_can_keep_people_out_of_jail
https://www.ideas42.org/wp-content/uploads/2023/05/national-guide-improving-court-appearance.pdf
https://insider.govtech.com/california/news/late-for-court-uptrust-pushes-text-reminders-to-four-more-counties.html
https://mytcrplus.com/tcr-registration-process-how-brand-registration-campaign-vetting-and-carrier-approval-actually-work/
https://help.twilio.com/articles/4408675845019-SMS-Compliance-and-A2P-10DLC-in-the-US
https://www.10dlc.org/en/home/A2PConsent
