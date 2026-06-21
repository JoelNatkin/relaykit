## Public-school district communications
**Vertical:** Civic & public sector
**Bucket:** Clear
**URL slug:** /for/school-districts

### What this builder is making
A district- or school-wide communications platform that pushes attendance alerts, schedule and closure changes, emergency notifications, and event reminders to parents, guardians, and students across SMS, voice, app, and email. It sits on top of the district's student information system, grouping contacts by school, grade, classroom, route, or program so staff can broadcast to everyone or target a slice. The job is reaching 99%+ of families on time-sensitive items, not classroom instruction or EdTech operations.

### Why they need SMS
When a child is marked absent at the morning attendance deadline, or buses are running late, or a campus goes into lockdown, the district has minutes to reach a parent who will never open an email in time. SMS hits 98%+ open rates and is read within minutes, which is the difference between a parent calling back about an unexplained absence and a safety alert that lands after dismissal. For closures, weather delays, and emergencies, text is the only channel fast and reliable enough to be the system of record.

### Message categories
1. account-events — primary; closures, lockdowns, weather delays, and attendance alerts are the urgent broadcast core (mapped via STRETCH, see gaps)
2. appointments — parent-teacher conferences and IEP meetings are real bookings with confirmations and reminders
3. community — announcements, event invitations, and event reminders cover the everyday district/school newsletter and event traffic
4. marketing — EIN-gated, opt-in district fundraising, enrollment drives, and bond/levy awareness (rare; separate consent)
Excluded: order-updates (no physical fulfillment), team-alerts (staff/operational, not parent-facing — though a district could use it separately for staff), customer-support (no ticketing relationship with parents), verification (district portals exist but the SMS-2FA job belongs to the SIS vendor, not this builder), waitlist (enrollment waitlists possible but not the core communications job).

### Workflows

**Daily attendance alert**
Sent when a student is marked absent and the parent hasn't called in by the attendance deadline.
Sequence:
1. STRETCH:account-events:account-suspended — "Absence alert" — notifies the parent their child is marked absent and asks them to confirm or explain — see Message gaps for the dedicated GAP this should become
Variable aliases:
- workspace_name: "Lincoln Elementary"

**Emergency / safety alert**
Sent district- or campus-wide during a lockdown, evacuation, or safety incident requiring immediate awareness.
Sequence:
1. GAP:emergency-alert — "Emergency alert" — broadcasts the incident and the single instruction (shelter, reunification site, await update) — no corpus message carries this; see Message gaps
Variable aliases:
- workspace_name: "Riverside USD"

**Closure & delay notice**
Sent when school is canceled, delayed, or released early for weather or an operational reason.
Sequence:
1. GAP:closure-notice — "Closure / delay" — states the change, the affected schools, and the new schedule — see Message gaps
Variable aliases:
- workspace_name: "Riverside USD"

**Schedule / transportation change**
Sent when a bus route is delayed, a pickup point moves, or a day's schedule shifts.
Sequence:
1. GAP:schedule-change — "Schedule change" — tells the affected families what changed and the new time/location — see Message gaps
Variable aliases:
- workspace_name: "Riverside USD Transportation"

**Parent-teacher conference / IEP meeting**
A scheduled meeting between a guardian and school staff, booked and reminded like any appointment.
Sequence:
1. appointments:confirmation — "Conference confirmed" — confirms the meeting time with the teacher/staff member when it is booked
2. appointments:reminder-distant — "Conference tomorrow" — reminds the day before
3. appointments:reminder-proximate — "Conference soon" — reminds about an hour out
4. appointments:reschedule-confirmation — "Conference rescheduled" — confirms a moved time
5. appointments:cancellation-confirmation — "Conference canceled" — confirms a cancellation with a rebook link
6. appointments:no-show-follow-up — "Missed conference" — offers to rebook after a missed meeting
Variable aliases:
- provider_name: "Ms. Alvarez"
- appointment_time: "Thu 4:30pm"

**District / school announcement**
General non-urgent news: newsletters, policy updates, recognition, fee or device-return reminders.
Sequence:
1. community:community-announcement — "District announcement" — points families to district or school news
2. community:moderation-update — "Action needed" — used when an announcement needs a parent to act (form, fee, device return)
Variable aliases:
- community_name: "Lincoln Elementary"

**School event lifecycle**
Open houses, athletics, picture day, testing windows, and performances.
Sequence:
1. community:event-invitation — "Event posted" — announces the event with RSVP when first posted
2. community:live-event-reminder — "Event today" — reminds shortly before it begins, with a join/details link
Variable aliases:
- community_name: "Lincoln Elementary"
- event_name: "Fall Open House"

**Enrollment / fundraising outreach (opt-in, EIN-gated)**
Separate marketing-consent campaigns for enrollment drives, foundation fundraising, or bond/levy awareness.
Sequence:
1. marketing:event-invitation — "Enrollment event" — invites an opted-in audience to an enrollment or community event
2. marketing:re-engagement — "Re-enroll reminder" — nudges families who lapsed on enrollment or a program
Variable aliases:
- business_name: "Riverside Schools Foundation"

### Message gaps

**GAP:emergency-alert**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** Emergency alert
- **Why:** safety/lockdown/evacuation broadcasts are the defining school-district SMS job and no corpus message carries an urgent incident-with-single-instruction frame
- **Draft variants:** (vertical-specific — skipped)

**GAP:closure-notice**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** Closure / delay notice
- **Why:** weather/operational closures and delays are a top-three district use case with no order/appointment/community message that fits a "schedule canceled or shifted, here's the new plan" broadcast
- **Draft variants:** (vertical-specific — skipped)

**GAP:schedule-change**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** Schedule / transportation change
- **Why:** bus delays and same-day schedule shifts are a routine targeted broadcast distinct from a personal appointment reschedule
- **Draft variants:** (vertical-specific — skipped)

**STRETCH:account-events:account-suspended**
- **Classification:** Stretch
- **Proposed corpus home:** account-events:account-suspended is the nearest structural fit (state-change notice + link to details/next steps), but the absence-alert job — "your child is marked absent, confirm or explain" — has a different recipient relationship and a confirm-back action the suspended-account body does not express
- **Proposed universal name:** Absence alert
- **Why:** the daily attendance alert is the single highest-volume district SMS and the corpus has no parent-of-a-third-party notification; the suspended-account frame is reused only because no closer message exists
- **Draft variants:** (Stretch)
  - Standard: `{{workspace_name}}: {{student_name}} is marked absent today. Please confirm or explain: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: we have {{student_name}} marked absent today. Let us know what's up: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{student_name}} marked absent. Confirm: {{account_link}} STOP to opt out.`
- **New variables:** `{{student_name}}` — the absent student's first name as shown to the guardian, budget ~14 chars, source: SIS roster, example "Maya"

### Content constraints
- Standard carrier rules apply (10DLC registration; clear STOP opt-out; sender self-identification in every body).
- Consent triangulation: the guardian consents but messages concern a third party (the student). Capture explicit opt-in from the contact on file; do not assume student consent flows from enrollment.
- Minor recipients: when texting students directly (not guardians), treat them as a sensitive audience — keep to operational/safety content, no marketing.
- FERPA: do not put protected education records in the body — no grades, disciplinary detail, IEP content, balances owed, or health information. Carry a name plus a link to an authenticated portal for anything record-level.
- Emergency-notification context: safety and closure alerts are time-critical broadcasts; districts should provision throughput accordingly, but this is a delivery-capacity concern, not a content carve-out — STOP/opt-out still applies to transactional school messaging.
- Marketing (enrollment/fundraising) is EIN-gated, requires separate explicit consent, and is the only category permitted promotional content; SHAFT-C prohibited.

### Disambiguation
This sub-vertical is the ParentSquare/Remind/SchoolMessenger-style parent-and-student communications layer — attendance, closures, emergencies, events, conferences — not EdTech operational SaaS (LMS, grading, SIS) where SMS would be 2FA or seat-based product alerts. It is distinct from the team-alerts staff-operations job: the recipient here is a family member, not an employee, and the content is school-life rather than incident/on-call. It is also distinct from higher-ed campus alerting, which centers on the student as the direct adult recipient rather than the guardian-of-a-minor relationship that drives K-12 consent and content rules.

### Sources
https://www.parentsquare.com/
https://www.parentsquare.com/platform/mass-notifications/
https://www.parentsquare.com/mass-communications/
https://www.remind.com/
https://www.schoolmessenger.com/attendance-notification
https://www.dialmycalls.com/school-notification
https://www.regroup.com/industries/education/k-12/
https://www.text-em-all.com/industries/text-messaging-service-for-schools
https://www.text-em-all.com/closing-and-delays-text-alerts
https://www.fcps.edu/family-resources/family-communication-resources/fcps-text-messaging-parents-and-students
https://www.text-em-all.com/blog/text-message-privacy-laws-what-schools-need-to-know
https://mytcrplus.com/solutions/education-edtech-messaging-compliance/
https://studentprivacy.ed.gov/ferpa
https://trumpia.com/blog/how-to-send-text-messages-for-school-closings-and-delays/
