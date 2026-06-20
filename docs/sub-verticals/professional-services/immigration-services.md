## Immigration services (visa/document prep, non-attorney)
**Vertical:** Professional services
**Bucket:** Not yet maybe not ever
**URL slug:** /for/immigration-services
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.

### What this builder is making
A non-attorney immigration services operation prepares and files immigration forms (I-130, I-485, N-400, etc.) on a client's behalf, performing clerical document assembly — typing client-supplied information onto USCIS forms, organizing supporting documents, and tracking receipt/case status — without being a licensed attorney or a DOJ/EOIR-accredited representative. The market spans state-registered, bonded "immigration consultants" (e.g. California BPC ch. 19.5 registrants), DOJ-recognized non-profit organizations using BIA-accredited representatives, and a large unregulated long tail that shades into "notario" operations. The software layer is a case-management / client-portal product (Clustdoc, Case Status, LollyLaw-style) that drives intake, document checklists, USCIS status tracking, and appointment scheduling.

### Why they need SMS
The defining moments are time-bound and government-driven: a USCIS receipt notice arrives, a biometrics or interview appointment is set, or a missing document blocks the filing — and a missed deadline can mean denial or removal, so the client must be reached reliably. SMS beats email because this audience is mobile-first, often multilingual, and frequently checks no inbox, while the consequence of a missed RFE or interview window is severe and irreversible. The hazard is that the exact same channel can carry messages that cross from clerical status updates into legal advice — which form to file, what to say at interview — which is UPL.

### Message categories
1. appointments — biometrics, interview, and in-office document-review scheduling and reminders (the cleanest consented surface, but with appointment_type framing risk)
2. customer-support — document-request and case-status status handling once a paid engagement exists
Excluded: marketing (promotional outreach to immigrant communities is the exact field where notario solicitation and FTC enforcement concentrate — EIN-gated marketing cannot launder it), verification (no first-party auth surface — the portal login is the software vendor's, not the consultant's brand), waitlist (no queue model), community (no membership community), team-alerts (internal staff ops, not a client surface), order-updates (no shipped-goods lifecycle), account-events (no recurring subscription-billing relationship with the immigrant client)

### Workflows
**Government appointment reminder (biometrics / interview)**
Reminds a client of a USCIS-scheduled biometrics or interview appointment so they do not miss a government deadline.
Sequence:
1. appointments:confirmation — "Appointment set" — sent when the USCIS biometrics/interview date is recorded, naming the date/time only
2. appointments:reminder-distant — "Appointment tomorrow" — day before, with a reschedule path
3. appointments:reminder-proximate — "Appointment soon" — proximate reminder before the appointment window
Variable aliases (only where the default example would feel wrong):
- provider_name: "USCIS (Application Support Center)"
- appointment_time: "Tue Jul 14, 9:00am"

**In-office document-review scheduling**
Schedules a sit-down where the client brings documents for the consultant to assemble onto forms.
Sequence:
1. appointments:confirmation — "Visit booked" — confirms the in-office document-prep session
2. appointments:reminder-distant — "Visit tomorrow" — day-before reminder with what-to-bring handled outside the body
3. appointments:no-show-follow-up — "We missed you" — rebooking nudge after a missed session
Variable aliases (only where the default example would feel wrong):
- provider_name: "your document preparer"

**Missing-document request (clerical only)**
Tells a client a specific document is missing so the file can be completed — strictly a request to supply an item, never advice on what the document should say.
Sequence:
1. GAP:document-needed — "Document needed" — names the missing item and where to upload it
2. customer-support:ticket-received — "Got your document" — acknowledges receipt once the client uploads
Variable aliases (only where the default example would feel wrong):
- ticket_number: "your file"

**Case-status update (clerical mirror of USCIS)**
Mirrors a government-generated status change (receipt issued, case received, decision posted) without interpreting it.
Sequence:
1. GAP:case-status-update — "Case status changed" — neutral notice that the USCIS case status moved, pointing to the portal
Variable aliases (only where the default example would feel wrong): none

**Reschedule / cancellation of an office visit**
Handles client-side or office-side changes to a document-prep appointment.
Sequence:
1. appointments:reschedule-confirmation — "Visit rescheduled" — new time for the in-office session
2. appointments:cancellation-confirmation — "Visit cancelled" — confirms a cancelled session with a rebook path

### Message gaps
**GAP:document-needed**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** "Document needed" (display alias)
- **Why:** the request must stay purely clerical ("we need item X"); the moment it advises which document satisfies a legal requirement it becomes UPL, so it is documented as a flagged vertical-specific message, not corpus-promoted
- **Status:** FUTURE

**GAP:case-status-update**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** "Case status changed" (display alias)
- **Why:** a non-attorney may relay that a government status changed but may not interpret what it means for the case — the line between mirroring and advising is the UPL exposure, so this is documented and vetted case-by-case, never a clean universal message
- **Status:** FUTURE

**STRETCH:appointments:confirmation**
- **Classification:** Stretch
- **Proposed corpus home:** appointments:confirmation reused for a government-set appointment; fit gap is that "appointment with {{provider_name}}" frames a provider the sender controls, while a biometrics/interview slot is set by USCIS, not the consultant — the consultant only relays it
- **Proposed universal name:** appointments:confirmation
- **Why:** the corpus confirmation assumes the sender owns the appointment; for a government appointment the sender is a clerical relay, so reuse needs the "this is a USCIS appointment, not ours" framing to avoid implying the consultant scheduled or controls it
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your USCIS appointment is set for {{appointment_time}}. Details in your file. Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: Your USCIS appointment is {{appointment_time}}. We'll remind you before. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: USCIS appointment {{appointment_time}}. STOP to opt out.`
- **Status:** FUTURE

### Content constraints
- **Why gated — UPL exposure on the message itself.** A non-attorney may perform only ministerial/clerical work: typing client-supplied data onto forms, relaying that a government status changed, requesting a named document. The moment a message advises which form to file, what to write, what a status "means" for the case, or how to answer at interview, it is unauthorized practice of law. The same SMS channel that carries a clean reminder can carry UPL, and the line is in the wording — which makes every body case-by-case, not template-safe.
- **Why gated — documented fraud profile and active enforcement.** "Notario fraud" is a chronic, named enforcement target: state AGs (e.g. CA OAG consumer alerts), the FTC (dedicated Immigration Services complaint code in Consumer Sentinel, multilingual PSAs), USCIS, and ICE all run programs against unauthorized immigration providers. The harm — financial loss, botched filings, deportation — and the pattern of bad actors renaming/relocating to dodge complaints make this a category where brand vetting must scrutinize who the sender actually is, not just the message.
- **Why gated — credential-status ambiguity.** Legitimate non-attorney providers (state-bonded consultants, DOJ-recognized non-profits with BIA-accredited reps) sit alongside an unregulated long tail with no clean external signal in a 10DLC brand registration. RelayKit cannot tell a bonded California registrant from a notario at the registration form, so the only defensible posture is case-by-case substance vetting.
- No legal-advice framing in any body: no "you should file…", "this means your case is…", "tell the officer…". Status messages mirror; they do not interpret.
- No credentials, no "notario," no "immigration expert / specialist," no implication of attorney status or government affiliation in the sender frame or body.
- No marketing/solicitation traffic to immigrant audiences — the prohibited core enforcement field. Marketing category stays excluded entirely.
- Multilingual reality (Spanish, Mandarin, etc.) raises segment/encoding and consent-clarity stakes; STOP/HELP handling must survive translation.
- If ever served: the only clean path is a state-bonded/registered consultant or a DOJ-recognized organization texting its own engaged clients, clerical content only, under its own verified brand — vetted individually.

### Disambiguation
On one side sits `/for/legal-practice` (Conditional): a licensed attorney or law firm — including immigration attorneys — operating under bar oversight, where giving legal advice over SMS is authorized practice, not UPL. That is a credentialed posture the registration can lean on. This entry is the opposite: a non-attorney, non-accredited operator who may perform only clerical document assembly, for whom the very same advisory message that is fine from a lawyer is unauthorized practice of law. On the other side sits generic document-prep / form-filling, which is clerical for forms that carry no legal-representation expectation; immigration is the field where clerical work is one sentence away from representing someone before a federal agency, which is why it cannot ride the generic document-prep posture. The UPL exposure — sharpened by named notario-fraud enforcement from state AGs, the FTC, USCIS, and ICE, and by the impossibility of distinguishing a bonded registrant from a bad actor at the registration form — is what puts non-attorney immigration services in a case-by-case "not yet, maybe not ever" vetting posture rather than a buildable bucket.

### Sources
https://www.americanbar.org/groups/public_interest/immigration/projects_initiatives/fightnotariofraud/avoiding-the-unauthorized-practice-of-immigration-law/
https://www.calbar.ca.gov/public/concerns-about-attorney/avoid-legal-services-fraud/avoid-fraud-immigration-consultants
https://www.calbar.ca.gov/public/concerns-about-attorney/avoid-legal-services-fraud/unauthorized-practice-law
https://law.justia.com/codes/california/code-bpc/division-8/chapter-19-5/section-22443-1/
https://law.justia.com/codes/california/code-bpc/division-8/chapter-19-5/section-22442-2
https://specialfilings.sos.ca.gov/icbs
https://www.justice.gov/eoir/recognition-and-accreditation-program
https://www.uscis.gov/scams-fraud-and-misconduct/avoid-scams/find-legal-services
https://oag.ca.gov/news/press-releases/attorney-general-bonta-issues-consumer-alert-notario-fraud-obtaining-immigration
https://www.ftc.gov/node/46761
https://www.ice.gov/news/releases/national-initiative-combat-immigration-services-scams
https://www.typeinvestigations.org/investigation/2025/12/04/fraudsters-target-immigrants-seeking-legal-help/
https://www.casestatus.com/practice-area/immigration
https://clustdoc.com/solutions/immigration-case-management-software/
https://lollylaw.com/
