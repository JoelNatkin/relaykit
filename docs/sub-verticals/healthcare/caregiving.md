## Caregiving / home health coordination
**Vertical:** Healthcare
**Bucket:** Not yet, maybe not ever
**URL slug:** /for/caregiving
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.

### What this builder is making
Caregiver marketplaces (Care.com-class), home-health-aide agency scheduling platforms (AxisCare, CareSmartz360, Celayix), and family-caregiver coordination apps (Carely, CareZone) that match caregivers to clients/families, assign and remind shifts, capture visit check-in/out via Electronic Visit Verification (EVV), and keep families updated. The job is operational: fill open shifts, prevent no-shows, prove the visit happened, and tell the family the visit is done. It sits on the case-by-case line between healthcare-admin logistics (who shows up, when) and the cared-for person's actual health condition management (which this builder must keep out of the SMS body).

### Why they need SMS
The load-bearing moments are a caregiver shift reminder/assignment, an open-shift coverage ping when someone calls out, and a "your visit is complete" note to the family — caregivers live on their phones in cars and client homes with no app open, and families want a real-time signal without logging into a portal. A missed or unfilled shift means an elderly or dependent person is left without scheduled care, which is the highest-consequence failure in the category. SMS wins because the recipients (1099 caregivers, busy adult children) won't reliably check email or push, and the message is pure logistics — never the care-recipient's condition.

### Message categories
1. team-alerts — primary; caregiver-facing shift lifecycle (scheduled, reminder, change, cancellation, start/check-in) and open-shift coverage are the operational core
2. appointments — visit confirmations and reminders to the family/client framed as scheduled visits with a named caregiver
3. account-events — marketplace/agency account, billing, and security lifecycle for both caregivers and families
4. verification — phone-ownership at caregiver onboarding and family portal login (2FA carve-out)
5. waitlist — client intake queue when an agency has no immediate caregiver availability
Excluded: marketing (promotional consent is a separate burden and the care-recipient context makes promo tone inappropriate), order-updates (no physical fulfillment), community (no member community surface), customer-support (possible but secondary to the scheduling spine).

### Workflows
**Caregiver shift lifecycle**
Keep the assigned caregiver on time for every scheduled client visit.
Sequence:
1. team-alerts:shift-scheduled — "Visit assigned" — when a caregiver is matched to a client visit (date, time, location, role)
2. team-alerts:shift-reminder — "Visit reminder" — ahead of visit start
3. team-alerts:shift-change — "Visit changed" — when the visit is moved or swapped
4. team-alerts:shift-cancellation — "Visit cancelled" — when the client cancels or the visit is dropped
5. team-alerts:shift-start — "Check in" — at visit start, with EVV check-in action link
Variable aliases (only where default feels wrong):
- location: "14 Oak St (client home)"
- role: "Home health aide"

**Open-shift coverage**
Fill a shift fast when a caregiver calls out, so no client is left uncovered.
Sequence:
1. team-alerts:escalation-ping — "Open visit — can you cover?" — broadcast to best-fit available caregivers; ACK claims the shift
2. team-alerts:shift-scheduled — "Visit assigned" — confirmation to the caregiver who claimed it
Variable aliases (only where default feels wrong):
- severity: "Open shift"
- system_name: "Tue 2pm visit, 14 Oak St"
- escalation_to: "the on-call coordinator"

**Family visit coordination**
Tell the family which caregiver is coming and when, without exposing the care-recipient's condition.
Sequence:
1. appointments:confirmation — "Visit confirmed" — when a visit is booked, naming the caregiver
2. appointments:reminder-distant — "Visit tomorrow" — day before
3. appointments:reschedule-confirmation — "Visit moved" — when the visit time changes
Variable aliases (only where default feels wrong):
- provider_name: "Maria (home health aide)"

**Caregiver onboarding verification**
Prove the caregiver's phone at marketplace/agency signup before assigning visits.
Sequence:
1. verification:verification-code — "Verification code" — at caregiver phone signup (no STOP/HELP)

### Message gaps
**STRETCH:appointments:post-appointment**
- **Classification:** Stretch
- **Proposed corpus home:** appointments:post-appointment, reframed as a "visit complete" family note + EVV-confirmation signal
- **Proposed universal name:** Visit completed (display alias for family-facing post-visit note)
- **Why:** the family's most-wanted signal is "the visit happened and is done," which the corpus only covers as a feedback-collection post-appointment message — fit gap is that the family note should confirm completion and carry no feedback/condition framing
- **Draft variants:**
  - Standard: `{{workspace_name}}: today's visit with {{provider_name}} is complete. Details in your care portal: {{portal_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: {{provider_name}} has finished today's visit. See the details in your portal: {{portal_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: visit with {{provider_name}} complete. {{portal_link}} STOP to opt out.`
- **New variables:** portal_link
- **Status:** FUTURE — do not add to corpus until bucket changes.

**GAP:visit-check-in-confirmed (EVV clock-in receipt)**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (EVV is a healthcare-regulatory artifact, not a universal pattern)
- **Proposed universal name:** Check-in confirmed (display alias: Visit check-in recorded)
- **Why:** EVV requires a verifiable record of caregiver clock-in/out; an SMS receipt confirming the EVV check-in is logistics-specific to home-health and has no general-purpose home
- **Status:** FUTURE — do not add to corpus until bucket changes.

**GAP:caregiver-running-late (family ETA notice)**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** Caregiver delayed (display alias: Visit running late)
- **Why:** a "your caregiver is running ~20 min late" note to the family is a care-coordination-specific reassurance pattern with no clean corpus parent (closest is appointments reminders, but the trigger is a live delay, not a schedule)
- **Status:** FUTURE — do not add to corpus until bucket changes.

### Content constraints
- Case-by-case vetting is the headline: a home-health AGENCY can be a HIPAA covered entity or business associate — that gates it like clinical-care (BAA required, PHI handling), while a pure caregiver MARKETPLACE (Care.com-class) or a family-coordination app is closer to local-services/admin and team scheduling.
- Never put the cared-for person's health detail, diagnosis, condition, or care needs in any SMS body — shift/visit logistics and a portal link only.
- Caregiver, family member, and care-recipient are three distinct recipient types with distinct consent and content rules; do not mix their messages or assume one opted in for another.
- Each recipient must give explicit prior express consent (TCPA); marketplaces and agencies need separate opt-in per recipient, not a blanket account flag.
- EVV check-in/out is a Medicaid-driven regulatory record; SMS can carry a check-in action link or a completion receipt but is not itself the system of record.
- Verification/2FA messages carry the carve-out: no STOP/HELP language in the body.
- No promotional content rides on transactional caregiver/family notifications; marketing to families would require separate marketing consent and is a poor fit given the sensitivity.

### Disambiguation
The split lives inside this one sub-vertical. A HIPAA-covered home-health agency that schedules nurses and aides and documents clinical care is covered-entity territory and gets gated like clinical-care: a BAA is required and PHI must stay out of the channel. A babysitter/elder-care MARKETPLACE (Care.com-class) or a family-coordination app that only moves shift logistics and family updates is closer to local-services and generic team/workforce scheduling, where the body is plain logistics. Distinguish both from healthcare-admin, which is the provider's front office (the clinic that owns the patient relationship) rather than the in-home caregiver layer; and from generic shift/workforce scheduling, where there is no care-recipient and no sensitivity. The trap a dev falls into is "it's just shift reminders" — true for the caregiver-facing side, but the moment the platform is a home-health agency handling PHI, or the moment a body would name the care-recipient's condition, it crosses into covered-entity territory and out of scope.

### Sources
https://www.celayix.com/industries/home-health-care-staff-scheduling-software/
https://www.caresmartz360.com/features/home-care-scheduling-software/
https://www.caresmartz360.com/features/client-family-portal/
https://axiscare.com/features/client-and-family-portals/
https://caretap.net/blog/top-home-health-care-scheduling-software/
https://help.care.com/s/article/How-do-I-manage-my-email-and-text-message-notification-settings-for-families?language=en_US
https://www.care.com/about/new-care-caregiver/
https://www.neelacares.com/blog/family-caregiver-app-tools-examples-and-how-to-choose-the-right-one
https://caringvillage.com/2026/05/13/caregiver-apps-for-families/
https://www.qliqsoft.com/blog/what-hipaa-compliant-messaging-actually-means-for-home-health-agencies
https://www.accountablehq.com/post/hipaa-compliance-for-home-health-aides-rules-training-best-practices
https://www.hipaajournal.com/texting-violation-hipaa/
https://en.wikipedia.org/wiki/Electronic_visit_verification
https://www.termsfeed.com/blog/a2p-10dlc-compliance/
