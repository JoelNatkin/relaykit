## Clinical research / patient recruitment
**Vertical:** Healthcare
**Bucket:** Not yet, maybe not ever
**URL slug:** /for/clinical-research
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.

### What this builder is making
Clinical-trial recruitment and participant-management software — disease-agnostic decentralized/hybrid trial platforms (Castor, Curebase, Medable, Jeeva, Cloudbyz) that source and pre-screen candidates, run eConsent, schedule site or virtual visits, and send retention/adherence nudges across long studies. SMS lives at the screening invitation, the visit reminder, the eConsent/ePRO-due nudge, and the re-engagement prompt — every touch is IRB-governed and HIPAA-adjacent. That governance is the gating: recruitment text associates a real person with a medical study, so it sits under TCR's special/high-scrutiny class, not the ordinary notification lane.

### Why they need SMS
The two acute moments are the screening invitation ("you may qualify") and the visit/survey reminder that keeps an enrolled participant in the study. Under-enrollment and mid-study dropout are the two things that kill a trial outright, and SMS is the only channel with the open-rate and immediacy to move both. But the recruitment leg is the sensitive part: it is the start of the consent process in FDA's eyes, and a careless body text can leak a person's suspected condition.

### Message categories
1. appointments — visit reminders/confirmations are the highest-volume, lowest-risk leg (enrolled, consented participants) and map almost cleanly to the corpus
2. waitlist — pre-screening queue and "spot in the study opened" maps to position/your-turn lifecycle without naming a condition
3. account-events — participant-portal lifecycle (eConsent signed, account active) is genuinely transactional
4. verification — portal/eConsent 2FA is the cleanest carve-out, no health framing at all
5. customer-support — study-coordinator help desk for enrolled participants
Excluded: marketing (recruitment is NOT marketing — it is IRB-approved consent-process outreach, and promotional framing of a trial is prohibited), community, order-updates, team-alerts (study-staff ops are internal, not the participant relationship this entry covers)

### Workflows

**Visit reminder (enrolled participant)**
Keep a consented participant attending scheduled site or televisits so the trial retains them.
Sequence:
1. appointments:confirmation — "Visit confirmed" — sent when a study visit is booked
2. appointments:reminder-distant — "Visit tomorrow" — day-before retention nudge
3. appointments:reminder-proximate — "Visit in 1 hour" — same-day, reduces no-shows
4. appointments:reschedule-confirmation — "Visit moved" — when a visit window shifts
5. appointments:no-show-follow-up — "We missed you" — re-engage a participant who missed a visit (dropout-prevention)
Variable aliases (only where default feels wrong):
- provider_name: "Dr. Ramos / Site 04 coordinator"
- appointment_time: "Tue Jul 7, 9:00 AM"

**ePRO / survey-due nudge (enrolled participant)**
Prompt a participant to complete a scheduled patient-reported outcome or eDiary entry on time so data isn't lost.
Sequence:
1. appointments:post-appointment — "Survey due" — STRETCH; corpus aliases this to a feedback_link, repurposed as the ePRO/eDiary link
Variable aliases (only where default feels wrong):
- feedback_link: "your study survey link"

**Study help desk (enrolled participant)**
Let a consented participant reach the study coordinator without naming clinical detail over SMS.
Sequence:
1. customer-support:ticket-received — "Request received" — participant question logged
2. customer-support:agent-response — "Coordinator replied" — points to the portal, no clinical content in body
3. customer-support:resolution-notification — "Resolved" — closes the loop
Variable aliases (only where default feels wrong):
- ticket_number: "ref 2041"

**Pre-screening queue**
Hold a candidate who pre-qualified but is waiting on a slot, without disclosing the targeted condition.
Sequence:
1. waitlist:joined — "On the study list" — candidate added to screening queue
2. waitlist:position-update — "List update" — neutral movement
3. waitlist:your-turn — "A slot opened" — invites the next step (screening call), no condition named
Variable aliases (only where default feels wrong):
- claim_link: "your screening scheduling link"

### Message gaps

**GAP:study-recruitment-screening-invitation**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (recruitment outreach is IRB-text-governed and must never be a generic corpus message)
- **Proposed universal name:** Study screening invitation (display alias)
- **Why:** the cold-ish "you may qualify for a study" outreach has no safe generic corpus home — its body text is dictated verbatim by an IRB-approved script, not by a template engine
- **Status:** FUTURE — do not add to corpus until bucket changes.

**GAP:econsent-due-reminder**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:document-action-required (new) or appointments adjacent
- **Proposed universal name:** Action required — document pending
- **Why:** "a document is waiting for your signature/action" is a generic transactional pattern (eConsent here, but also contracts, waivers, terms acceptance) the corpus lacks
- **Draft variants:**
  - Standard: `{{workspace_name}}: A document is ready for your signature. Review and sign here: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} document is ready to sign whenever you are: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Document ready to sign: {{account_link}} STOP to opt out.`
- **New variables:** none
- **Status:** FUTURE — do not add to corpus until bucket changes.

**STRETCH:appointments:post-appointment**
- **Classification:** Stretch
- **Proposed corpus home:** appointments:post-appointment, repurposed from a post-visit feedback prompt to a scheduled ePRO/eDiary-due nudge
- **Proposed universal name:** Survey due (display alias of the post-appointment feedback message)
- **Why:** corpus message is framed as "thanks for your visit, give feedback"; an ePRO nudge is a recurring scheduled-data prompt, not a one-time post-visit thank-you, so the fit is partial
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your scheduled survey is ready. Complete it here: {{feedback_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: time for your next survey — it only takes a moment: {{feedback_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Survey ready: {{feedback_link}} STOP to opt out.`
- **New variables:** none
- **Status:** FUTURE — do not add to corpus until bucket changes.

### Content constraints
- Clinical/recruitment SMS falls under TCR's special / high-scrutiny class — carriers vet health-recruitment campaigns far harder than ordinary notifications, and approval is the gating reason this sub-vertical stays in "Not yet."
- Recruitment outreach is IRB-governed: every recruitment SMS body is part of the IRB-approved advertising/consent text and must be submitted to and approved by the IRB before sending — the template engine cannot author it.
- FDA treats recruitment advertising as the start of the informed-consent process; SMS content must be consistent with the consent document and limited to what a prospect needs to gauge interest and eligibility.
- Never name the targeted condition/diagnosis in a cold or screening text — associating a phone number's owner with a specific disease is a privacy harm and an enforcement trigger.
- TCPA: recruitment outreach is non-emergency marketing-class contact requiring prior express written consent; the post-appointment/visit-reminder healthcare exemption only covers participants who have already enrolled.
- HIPAA-adjacent: keep clinical detail out of SMS bodies; link to a portal behind auth rather than stating health information in the message.
- Verification/2FA carve-out applies to participant-portal and eConsent login codes — no STOP/HELP, no health framing.

### Disambiguation
Three different things wear the word "clinical" and only the middle one is this entry. Clinical-care messaging (a provider texting its own patients) is covered-entity, BAA-required HIPAA territory and is declined at intake per D-18. Trial recruitment and participant management (this entry) is TCR-special + IRB-governed: the recruiting org is usually a CRO or sponsor, not the patient's treating provider, and the outreach is consent-process advertising rather than care. Generic survey/feedback or research-panel SaaS that has nothing to do with a regulated medical trial is ordinary B2B and would sit in a Clear bucket. Within this entry the recruitment-outreach leg is the riskiest — a "you may qualify for a study about X" text is cold-ish health outreach, not a normal marketing blast — while visit reminders and ePRO nudges to already-enrolled, consented participants are tamer but still IRB-governed. The trap a dev falls into: assuming a screening text is just another marketing send, when it is the single most scrutinized message type in the whole workflow.

### Sources
https://www.castoredc.com/econsent/
https://jeevatrials.com/eclinical-platform/patient-recruitment-software/
https://www.cloudbyz.com/products/decentralized_clinical_trial
https://www.curebase.ai/patient-engagement/
https://intuitionlabs.ai/articles/decentralized-clinical-trials-platforms-software-guide
https://www.crucialdatasolutions.com/econsent/
https://www.fda.gov/media/88915/download
https://research.weill.cornell.edu/compliance/human-subjects-research/institutional-review-board/research-team-resources/irb-review
https://www.advarra.com/blog/sponsors-guide-to-irb-approval-part-iii-building-irb-ready-informed-consent/
https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10848401/
https://www.healthcareittoday.com/2023/09/14/navigating-the-new-a2p-10dlc-regulations-in-healthcare-a-guide-for-healthcare-text-messaging/
https://callhub.io/blog/compliance/10dlc-2025-registration-callhub/
https://www.apptoto.com/best-practices/fcc-tcpa-consent-appointment-reminders
