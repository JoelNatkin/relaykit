## Clinical care / patient-facing (covered entities)
**Vertical:** Healthcare
**Bucket:** Not yet
**URL slug:** /for/clinical-care
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.

### What this builder is making
Telehealth platforms, EHR/patient-portal systems, and patient-engagement layers run by HIPAA covered entities (clinics, group practices, virtual-care startups) that manage the clinical visit lifecycle — booking, video visits, secure care-team messaging, and delivery of lab/imaging results and test-ready notifications. The software tracks patients, encounters, orders, results, and care plans, and fires notifications when a result posts, a visit approaches, or a clinician sends a message. SMS sits at the doorstep: it tells the patient something is waiting and routes them to an authenticated portal — the recipients are patients and the surrounding relationship is clinical, which is exactly the gating.

### Why they need SMS
The single highest-value moment is "your results are ready" or "your care team sent you a message" — a notification that, unread, leaves a patient anxious or a treatment delayed, where email open rates are too low and portal logins too infrequent to rely on. SMS wins because >90% of texts are read within minutes, collapsing the gap between a result posting and the patient acting on it. The SMS body stays PHI-hygienic — "results ready, log in" plus a portal link, never the actual value — but the use case lives entirely inside a covered-entity/PHI relationship, which is what defers it.

### Message categories
1. appointments — visit confirmations and reminders are the highest-volume clinical-care traffic; no-show reduction is the headline ROI
2. account-events — secure-message-waiting and portal/account notices map here as PHI-hygienic "something is waiting, log in" pings
3. verification — patient-portal 2FA and login codes (2FA carve-out, no PHI)
4. customer-support — patient/technical support around portal access and billing questions
Excluded: marketing (promotional health messaging to patients is SHAFT/consent-fraught and out of scope for clinical-care), order-updates (no e-commerce fulfillment), waitlist (clinic waitlists are real but logistics-only — belongs to healthcare-admin), community, team-alerts (internal/clinician-facing, not patient-facing clinical content)

### Workflows

**Results-ready notification**
Tell a patient that a lab or imaging result has posted, without naming the result, and route them to the authenticated portal.
Sequence:
1. GAP:results-ready — "Results ready" — fires when a result posts to the patient record; body says ready + portal link only, never the value
2. account-events:new-device-sign-in — "Portal sign-in" — only if the portal login itself triggers a new-device security notice
Variable aliases (only where default feels wrong):
- account_link: "your secure portal link"

**Visit lifecycle**
Confirm, remind, and follow up on a clinical visit (in-person or telehealth) with PHI-hygienic bodies.
Sequence:
1. appointments:confirmation — "Visit confirmed" — when a visit is booked
2. appointments:reminder-distant — "Visit reminder (day before)" — day before; avoid naming visit type/specialty (minimum necessary)
3. appointments:reminder-proximate — "Visit reminder (1 hour)" — about an hour before; for telehealth, the action link is the video-join link
4. appointments:no-show-follow-up — "Missed visit" — after a missed visit, offer rebooking
5. appointments:post-appointment — "Visit feedback" — after the visit, collect feedback (generic, no clinical detail)
Variable aliases (only where default feels wrong):
- provider_name: "Dr. Lee" (clinician, not a sales rep)
- cancel_link / reschedule_link: "your portal"

**Care-team message waiting**
Notify a patient that their clinician or care team has sent them a secure message to read in the portal.
Sequence:
1. GAP:secure-message-waiting — "New message from your care team" — fires when a clinician posts a secure message; body says a message is waiting + portal link, never the content
Variable aliases (only where default feels wrong):
- account_link: "your secure portal link"

**Portal access and 2FA**
Verify the patient at portal login and confirm sensitive account actions.
Sequence:
1. verification:verification-code — "Portal verification code" — phone verification at portal enrollment
2. verification:login-code — "Portal login code" — SMS second factor at sign-in
3. verification:confirmation-code — "Confirm action" — before a sensitive account change (e.g., contact-info update)

### Message gaps

**GAP:results-ready**
- **Classification:** Vertical-specific
- **Proposed corpus home:** account-events:results-ready (or a healthcare sub-vertical registry layer if account-events stays consumer-generic)
- **Proposed universal name:** Results ready (display alias for clinical-care; generically "Document ready to view")
- **Why:** the single most valuable clinical-care SMS has no corpus equivalent — appointments and account-events cover visits and billing but not "a clinical result has posted, log in to view"
- **Status:** FUTURE — do not add to corpus until bucket changes.

**GAP:secure-message-waiting**
- **Classification:** Vertical-specific
- **Proposed corpus home:** account-events:message-waiting (sub-vertical registry layer)
- **Proposed universal name:** New secure message (display alias "New message from your care team")
- **Why:** care-team-to-patient messaging is core to telehealth/EHR portals and has no corpus home; customer-support:agent-response is the wrong frame (support ticket, not clinician care message)
- **Status:** FUTURE — do not add to corpus until bucket changes.

**STRETCH:appointments:reminder-proximate**
- **Classification:** Stretch
- **Proposed corpus home:** appointments:reminder-proximate reused with a telehealth display alias; fit gap is the action link semantics (video-join vs cancel)
- **Proposed universal name:** Telehealth visit starting (display alias)
- **Why:** the proximate reminder fits, but a telehealth visit needs a one-tap video-join link rather than a cancel link, which the default body doesn't foreground
- **Draft variants:**
  - Standard: `{{workspace_name}}: your video visit with {{provider_name}} starts in 1 hour. Join: {{join_link}} Reply STOP to opt out.`
  - Friendly: `Almost time — {{provider_name}} sees you by video in about an hour. Join here: {{join_link}} Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: video visit in 1 hour, {{provider_name}}. {{join_link}} STOP to opt out.`
- **New variables:** join_link ("your video-visit link")
- **Status:** FUTURE — do not add to corpus until bucket changes.

### Content constraints
- HIPAA/BAA gating is the headline: clinical-care SMS rides inside a covered-entity/PHI relationship, and RelayKit has no BAA program today (D-18: no BAA, no PHI through the proxy) — defer the entire sub-vertical until a BAA path exists.
- Even once served: never put a diagnosis, result value, medication name, specialty, or visit type in the body — "minimum necessary" applies to every word.
- Pattern is always "something is ready/waiting" + authenticated portal link; the clinical content lives only behind portal login.
- Covered-entity must hold documented patient consent for SMS as a channel, distinct from TCPA opt-in; reconfirm periodically; honor STOP.
- 2FA/login codes are a clean carve-out (no PHI, no STOP/HELP) and could ship even under tighter gating.
- TCR: healthcare campaigns face elevated carrier scrutiny — message samples must be PHI-free and consent must be independently documented or the campaign is rejected.

### Disambiguation
The line against healthcare-admin (Conditional, non-clinical logistics only): the instant the SMS relationship is a covered-entity clinical one — delivering results, care-team messages, or any PHI-adjacent notification — it needs a BAA and is deferred here, whereas pure scheduling/billing logistics with no clinical content can live in the admin lane. The trap a developer falls into: "your results are ready" or "your care team messaged you" feels safe because the body names no result, but it is inside PHI territory the moment it concerns a patient's clinical care, and that is what gates it, not the literal string. Mental-health/behavioral-health platforms and pharmacies share the same BAA gating but are tracked as separate entries because their content sensitivities (psychotherapy notes, controlled-substance fills) differ. Until RelayKit stands up a BAA program, treat anything in this sub-vertical as out of scope regardless of how PHI-hygienic the individual message body looks.

### Sources
https://curogram.com/blog/hipaa-compliant-lab-result-sharing
https://www.updox.com/blog/benefits-of-text-messaging-in-healthcare/
https://www.hipaajournal.com/hipaa-compliant-appointment-reminders/
https://www.fqhc.org/blog/2022/11/21/4-rules-for-sending-hipaa-compliant-text-message-appointment-reminders
https://www.twilio.com/en-us/hipaa
https://help.twilio.com/articles/360059959413-Building-HIPAA-Compliant-Messaging-Applications-with-Twilio
https://www.accountablehq.com/post/is-twilio-hipaa-compliant-baa-covered-services-and-how-to-use-twilio-with-phi
https://www.athenahealth.com/solutions/telehealth-services
https://www.doctible.com/blog/changes-to-10dlc-2023-what-healthcare-practices-need-to-know
https://mytcrplus.com/10dlc-for-pt-clinics-sms-compliance-hipaa-and-patient-messaging-registration/
https://www.dialoghealth.com/post/hipaa-compliant-texting
