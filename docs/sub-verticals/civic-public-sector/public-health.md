## Public health / community health communications (non-clinical)
**Vertical:** Civic & public sector
**Bucket:** Conditional
**URL slug:** /for/public-health

### What this builder is making
Software for county and municipal health departments and community health programs that schedules vaccination/screening clinics, runs outreach campaigns, and coordinates public-health events (health fairs, flu drives, mobile-unit stops) without holding clinical records. The audience is residents and program enrollees the department is trying to reach — often at-risk or underserved populations who rely on a phone rather than email or a portal. It is an administrative and outreach layer (clinic logistics, event RSVPs, program enrollment, public-health announcements), explicitly non-clinical: no diagnoses, no treatment instructions, no PHI.

### Why they need SMS
When a free flu clinic opens Saturday or a screening van will be at a specific block tomorrow, the people who most need to know are the least likely to check email or a web portal — SMS reaches them where attention already is. A missed vaccination window or a no-show at a limited-slot screening means a preventable gap in coverage and wasted public funding. Text is the one channel with near-universal reach across underserved populations, which is exactly the equity gap public-health outreach exists to close.

### Message categories
1. appointments — clinic/screening slots booked by residents need confirmation and reminder cadence (the no-show problem these programs are funded to solve).
2. community — health-event announcements, clinic-day invitations, and program-onboarding sequences map cleanly onto community event/announcement/onboarding messages.
3. account-events — program enrollment confirmation and status changes (sender-framed by the department, non-clinical).
4. waitlist — limited-slot clinics and screening drives run waitlists; position/your-turn/grace fit directly.
5. verification — phone-ownership proof when a resident enrolls or claims a slot online.

Excluded: order-updates (no physical fulfillment), marketing (public-health messaging is factual/non-promotional and must not be EIN-gated promotional content — see constraints), customer-support (no ticketed support desk in the outreach model), team-alerts (internal ops, not resident-facing — though a CHW-staffing build could use it; out of scope for the resident-facing outreach product).

### Workflows

**Clinic / screening appointment reminder cadence**
A resident books a slot at a vaccination or screening clinic and gets confirmation plus reminders to cut no-shows.
Sequence:
1. appointments:confirmation — "Clinic slot confirmed" — confirms the booked clinic time and location right after booking.
2. appointments:reminder-distant — "Reminder: clinic tomorrow" — sent the day before with a cancel/reschedule path so the slot can be reused.
3. appointments:reminder-proximate — "Clinic in ~1 hour" — sent shortly before the slot.
4. appointments:no-show-follow-up — "We missed you — rebook" — sent after a missed slot to recover the visit.
5. appointments:post-appointment — "Clinic feedback" — optional post-visit feedback link (non-clinical experience survey only).
Variable aliases:
- provider_name: "the clinic team" (clinics are program-run, not a named individual provider)
- feedback_link: "the clinic experience survey"

**Public-health event / clinic-day announcement**
The department announces an open clinic day, health fair, or mobile-unit stop to its opted-in resident list.
Sequence:
1. community:event-invitation — "Free clinic day" — announces the event/clinic with date and RSVP link.
2. community:live-event-reminder — "Clinic starts soon" — sent shortly before the event with the location/join link.
Variable aliases:
- community_name: "[County] Public Health"
- event_name: "Free Flu Shot Clinic"
- join_link: "the clinic location & details"

**Screening-program enrollment + onboarding**
A resident enrolls in an ongoing screening or wellness program and is onboarded over the first week.
Sequence:
1. account-events:subscription-confirmed — "You're enrolled" — confirms enrollment in the program (STRETCH — see gaps; account-events frames this as a paid subscription).
2. community:welcome — "Welcome to the program" — immediate welcome.
3. community:first-action — "First step" — points to a first action (e.g. complete an intake form — non-clinical).
4. community:resource-pointer — "Program guide" — links a plain-language orientation/resource guide.
5. community:week-1-check-in — "One week in" — light check-in after a week.
Variable aliases:
- community_name: "[County] Wellness Program"

**Limited-slot clinic waitlist**
A high-demand clinic (limited vaccine supply, few screening slots) runs a waitlist and releases spots as they open.
Sequence:
1. waitlist:joined — "On the waitlist" — confirms the resident is on the list.
2. waitlist:position-update — "Moved up" — sent as they advance.
3. waitlist:almost-up — "Almost your turn" — heads-up that a slot is near.
4. waitlist:your-turn — "Claim your slot" — slot opened, claim link.
5. waitlist:grace-expiring — "Slot expiring" — claim window closing.
6. waitlist:missed — "Slot expired — rejoin" — slot lapsed, rejoin path.
Variable aliases:
- workspace_name: "[County] Public Health"

**Public-health campaign announcement**
A standing factual announcement to the opted-in list (new program available, clinic schedule change, public-health information update — non-clinical).
Sequence:
1. community:community-announcement — "Public health update" — links a factual announcement (e.g. new clinic schedule, where to get a free screening).
Variable aliases:
- community_name: "[County] Public Health"
- announcement_link: "the announcement details"

**Online enrollment / slot-claim verification**
A resident enrolling or claiming a slot online proves phone ownership.
Sequence:
1. verification:verification-code — "Verification code" — one-time code at enrollment/slot-claim.

### Message gaps

**STRETCH:account-events:subscription-confirmed**
- **Classification:** Stretch
- **Proposed corpus home:** account-events:subscription-confirmed (reused for program enrollment confirmation) — fit gap: the corpus copy frames it as a paid "subscription change," which reads wrong for a free public-health program.
- **Proposed universal name:** Enrollment confirmed
- **Why:** Public-health program enrollment is a lifecycle confirmation, but nothing in the corpus carries a non-billing "you're enrolled" message.
- **Draft variants:**
  - Standard: `{{workspace_name}}: You're enrolled in {{program_name}}. View details and next steps here: {{account_link}} Reply STOP to opt out.`
  - Friendly: `You're enrolled in {{program_name}} with {{workspace_name}}. Details and next steps here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Enrolled in {{program_name}}. Details: {{account_link}} STOP to opt out.`
- **New variables:** program_name: "the Wellness Program"

**GAP:clinic-day-walk-in-no-appointment**
- **Classification:** Vertical-specific
- **Proposed corpus home:** community:event-invitation / community:live-event-reminder (covers it for walk-in clinics with no individual booking).
- **Proposed universal name:** display alias "Clinic day" / "Clinic starts soon"
- **Why:** Many public-health clinics are walk-in (no per-resident slot), so the announcement messages, not the appointment messages, carry the workflow — already covered by community, flagged so the builder doesn't reach for appointments.

### Content constraints
- No scare tactics — factual public-health messaging only; no fear-based framing or alarming language to drive action.
- Non-clinical only — no PHI, no diagnoses, no test results, no treatment or medication instructions through the proxy (HIPAA boundary — RelayKit declines clinical messaging at intake, D-18).
- No promotional content — public-health outreach is informational, not marketing; do not route it through the EIN-gated MARKETING category or attach offers/upsells.
- Explicit prior opt-in per CTIA/TCPA; consent is per-program and per-sender, cannot be shared across departments or sold; honor STOP/UNSUBSCRIBE immediately.
- "Reply STOP to opt out." in every non-verification body; verification keeps the 2FA carve-out (no STOP/HELP).
- A2P 10DLC / TCR registration required; SHAFT-restricted content does not arise in factual public-health messaging and must not.
- Single GSM-7 segment, <160 chars; sender-framed by the department in every body so residents recognize the source.

### Disambiguation
The line is whether the message carries clinical content or PHI. Non-clinical public-health outreach — "a free flu clinic is open Saturday," "you're on the screening waitlist," "your clinic slot is confirmed" — is in bounds (Conditional, standard eligibility): it coordinates logistics and announces public information without naming a condition, result, or treatment. The moment a message conveys a diagnosis, test result, medication, or any individually identifiable health information, it crosses into clinical/healthcare-with-PHI, which RelayKit declines at intake (D-18 — no BAA, no PHI through the proxy). The neighboring healthcare-administrative sub-vertical (private clinics, EHR-attached patient comms) is a separate, harder boundary; this entry is specifically the public/community-health outreach layer run by health departments and community programs. What tips it out of bounds: per-resident health specifics, treatment guidance, or anything that would require a BAA — at which point it is no longer this sub-vertical.

### Sources
https://propellant.media/how-government-public-health-campaigns-can-use-email-and-sms-marketing-to-drive-community-engagement/
https://www.nwcphp.org/docs/sms-toolkit/index.htm
https://publichealth.harriscountytx.gov/Divisions-Offices/Offices/Office-of-Communication-Education-Engagement/Outreach
https://www.phdmc.org/programs-a-to-z/community-health-outreach
https://seminole.floridahealth.gov/programs-and-services/clinical-and-nutrition-services/community-integrated-mobile-health-services/mobile-health-unit-outreach.html
https://www.text-em-all.com/use-cases/vaccine-flu-shot-reminder
https://mpulse.com/solutions/social-needs/
https://www.groundgame.health/
https://www.dhs.wisconsin.gov/publications/p02501.pdf
https://thresholdcommunications.com/ctia-sms-messaging-guidelines/
https://www.infobip.com/blog/tcpa-compliance-sms
