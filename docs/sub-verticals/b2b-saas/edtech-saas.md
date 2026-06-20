## Education / EdTech operational SaaS (K-12 and higher-ed admin tooling)
**Vertical:** B2B SaaS & developer tooling
**Bucket:** Clear
**URL slug:** /for/edtech-saas

### What this builder is making
An operational platform that schools, districts, or universities use to run day-to-day administration — attendance tracking, parent-teacher conference scheduling, lunch-account and tuition billing, enrollment and registration workflows, and staff/emergency coordination. The builder's customer is the institution (a K-12 school or higher-ed registrar/admin office); the message recipients are parents/guardians of minors or adult students. This is back-office plumbing that fires event-driven texts when a student is marked absent, a payment fails, a conference is booked, or a registration hold posts.

### Why they need SMS
The moment is time-sensitive and adult-facing: a child is marked absent at 9am, an early dismissal is called, or a registration window opens. The consequence of a missed email is concrete — an unaccounted-for student, a missed conference, a lapsed enrollment, an unpaid tuition balance that blocks registration. SMS wins because parents respond to texts within minutes where email sits unread, and because attendance and dismissal alerts are exactly the urgent, single-action messages a phone surfaces and an inbox buries.

### Message categories
1. appointments — parent-teacher conference and advising-meeting booking, reminders, reschedules, and no-show follow-up are a literal appointment lifecycle; the highest-frequency scheduled-comms workflow.
2. account-events — lunch-account low balance, tuition payment failure, and registration-hold/suspension alerts are billing-and-lifecycle events with the same churn-critical urgency.
3. waitlist — course enrollment caps, registration windows, and seat openings map cleanly onto the queue-position-to-claim lifecycle.
4. team-alerts — staff shift scheduling (subs, duty rosters) plus the emergency/closure broadcast surface that schools depend on for safety alerts.
5. verification — parent-portal and student-portal sign-in codes, 2FA, and account recovery.
6. customer-support — IT/help-desk ticketing for district-issued devices and portal access.
Excluded: order-updates (no physical fulfillment/shipping in school admin), marketing (institutional comms are informational/transactional; promotional EIN-gated content is out of scope and consent-fraught for minors), community (member-onboarding/social-feed model doesn't match institutional parent comms — closest concepts already covered by appointments/team-alerts).

### Workflows

**Parent-teacher conference scheduling**
Books, reminds, and follows up on a parent-teacher conference or higher-ed advising meeting.
Sequence:
1. appointments:confirmation — "Conference booked" — fires when the parent/student reserves a slot.
2. appointments:reminder-distant — "Conference tomorrow" — day-before nudge with reschedule link.
3. appointments:reminder-proximate — "Conference in 1 hour" — same-day prompt.
4. appointments:reschedule-confirmation — "Conference moved" — confirms a changed slot.
5. appointments:cancellation-confirmation — "Conference cancelled" — confirms cancellation with rebook link.
6. appointments:no-show-follow-up — "Missed your conference" — rebook prompt after a no-show.
7. appointments:post-appointment — "Conference feedback" — optional feedback collection.
Variable aliases (only where default feels wrong):
- provider_name: "Ms. Rivera (Grade 4)"
- appointment_time: "Thu Mar 12, 4:30pm"

**Attendance / absence alert** (GAP — see below)
Notifies a parent/guardian the moment a student is marked absent or tardy.
Sequence:
1. GAP:student-absence-alert — "Absence alert" — fires on same-day absent/tardy marking, prompting the parent to confirm or correct.
Variable aliases (only where default feels wrong):
- student_name: "Maya"

**Early dismissal / campus emergency** (STRETCH — see below)
Broadcasts a time-critical schedule change or safety alert to all affected families/students.
Sequence:
1. STRETCH:team-alerts:system-alert — "School alert" — severity-cued broadcast for early dismissal, weather closure, or campus emergency.
Variable aliases (only where default feels wrong):
- severity: "URGENT"
- alert_type: "Early dismissal 1:00pm"
- system_name: "Lincoln Elementary"

**Lunch-account & tuition billing**
Keeps a parent or student account funded and in good standing.
Sequence:
1. account-events:payment-failed — "Tuition payment declined" — card-on-file decline for tuition or lunch auto-reload.
2. account-events:subscription-confirmed — "Payment confirmed" — confirms a successful payment or plan change.
3. account-events:account-suspended — "Registration hold" — flags a balance hold blocking registration, with next-steps link.
Variable aliases (only where default feels wrong):
- workspace_name: "Lincoln Elementary"

**Course enrollment & registration window**
Moves a student from a closed/waitlisted course to a claimed seat.
Sequence:
1. waitlist:joined — "On the course waitlist" — confirms waitlist entry for a full section.
2. waitlist:position-update — "Waitlist moved up" — queue position change.
3. waitlist:almost-up — "Seat opening soon" — approaching-turn nudge.
4. waitlist:your-turn — "Seat available" — registration window/seat open, claim link.
5. waitlist:grace-expiring — "Claim your seat" — grace-window reminder before the seat lapses.
6. waitlist:missed — "Seat released" — seat lapsed, rejoin option.
Variable aliases (only where default feels wrong):
- workspace_name: "Registrar's Office"
- queue_position: "3rd in line"

**Staff scheduling**
Assigns and reminds staff (substitutes, duty rosters, proctors) of shifts.
Sequence:
1. team-alerts:shift-scheduled — "Shift assigned" — duty/sub shift assigned.
2. team-alerts:shift-reminder — "Shift reminder" — ahead-of-start nudge.
3. team-alerts:shift-change — "Shift changed" — swapped or moved shift.
4. team-alerts:shift-cancellation — "Shift cancelled" — shift cancelled.
5. team-alerts:shift-start — "Shift starting" — start-of-shift check-in.
Variable aliases (only where default feels wrong):
- role: "Lunch duty"
- location: "Cafeteria"

**Portal account access**
Proves phone ownership and protects parent/student portal accounts.
Sequence:
1. verification:verification-code — "Portal verification code" — phone verification at portal signup.
2. verification:login-code — "Sign-in code" — SMS second factor at login.
3. verification:recovery-code — "Recovery code" — locked-out account recovery.
Variable aliases (only where default feels wrong):
- business_name: "ParentPortal"

**Help-desk ticketing**
Tracks an IT/admin support request (device, login, records) to resolution.
Sequence:
1. customer-support:ticket-received — "Ticket received" — support request logged.
2. customer-support:agent-assigned — "Agent assigned" — routed to staff.
3. customer-support:agent-response — "Ticket reply" — staff reply posted.
4. customer-support:resolution-notification — "Ticket resolved" — marked resolved.
5. customer-support:csat-follow-up — "Rate support" — satisfaction follow-up.

### Message gaps

**GAP:student-absence-alert**
- **Classification:** Vertical-specific
- **Proposed corpus home:** account-events:student-absence-alert (or a sub-vertical registry layer if kept education-only)
- **Proposed universal name:** Absence alert | "Student absence alert"
- **Why:** Same-day absence notification to a guardian is the single defining, highest-volume school message and has no analog in the corpus (it is neither an appointment nor a billing event).
- **Draft variants:**
  - Standard: `{{workspace_name}}: {{student_name}} was marked absent today. Confirm or report an error here: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: we marked {{student_name}} absent today. If that's wrong, let us know here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{student_name}} marked absent today. {{account_link}} STOP to opt out.`
- **New variables:** student_name ("Maya")

**STRETCH:team-alerts:system-alert**
- **Classification:** Stretch
- **Proposed corpus home:** stretch: team-alerts:system-alert reused for early-dismissal/closure/emergency broadcast — fit gap is framing (infra `{{system_name}}`/`{{alert_type}}` reads as ops tooling, not a school broadcasting a dismissal time to thousands of parents; severity vocabulary and the "details link" pattern are right but the noun frame must be reskinned for a campus-wide family audience).
- **Proposed universal name:** School alert | "Campus alert"
- **Why:** Early dismissal, weather closure, and campus-safety alerts are core school messages but bend the incident-pager frame meaningfully rather than fitting it cleanly.
- **Draft variants:**
  - Standard: `{{workspace_name}} {{severity}}: {{alert_type}}. Details: {{action_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}} heads up, {{severity}}: {{alert_type}}. More here: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}} {{severity}}: {{alert_type}}. {{action_link}} STOP to opt out.`

### Content constraints
- K-12 messages go to parents/guardians of minors: consent must be captured from the legal guardian, not the student. Capture guardian opt-in with timestamp, relationship, exact opt-in language, and student-identifier linkage.
- Registered 10DLC use-case must match the consent actually obtained; a number provided for attendance alerts cannot be repurposed for promotional/fundraising blasts without separate explicit consent (and minors make marketing consent especially fraught — keep institutional comms strictly informational/transactional).
- Emergency/safety alerts (closures, hazards, threats) are TCPA-exempt when the number is already on file — but RelayKit still appends STOP per category rules; do not rely on the exemption to skip opt-out handling.
- Non-profit institutions are technically TCPA-exempt, but carrier 10DLC filtering still applies regardless — register the brand and use case as normal.
- Never make promotional offers or fundraising the default channel content for a minor's guardian line.

### Disambiguation
This is OPERATIONAL school-admin and parent-comms tooling — attendance, conferences, billing, enrollment, staff scheduling, emergency broadcast — distinct from cohort-based, creator-led learning platforms (course-selling, lesson drips, student-community engagement). The line sits at who the institution is and what the message does: here the sender is a school/registrar firing event-driven administrative texts to guardians and adult students, not an instructor nurturing a paid learning cohort. The minor/parent-consent dimension tips this firmly toward transactional categories (appointments, account-events, waitlist, team-alerts, verification) and away from the community and marketing categories that suit creator-led learning. A higher-ed registrar texting adult students is closer to standard B2B SaaS account comms; a K-12 platform texting guardians inherits the stricter guardian-consent posture above. Both are served by the same corpus categories — the consent layer, not the message bodies, is what differs.

### Sources
https://www.parentsquare.com/
https://www.schoolstatus.com/blog/top-school-home-communication-platforms
https://www.parentsquare.com/platform/mass-notifications/
https://www.dialmycalls.com/school-notification
https://www.schoolmessenger.com/attendance-notification
https://www.textmagic.com/blog/sms-solutions-schools/
https://www.signalvine.com/
https://moderncampus.com/products/conversational-text-messaging-message.html
https://www.edvisorly.com/university-insights/higher-education-sms-texting-softwares
https://simpletexting.com/blog/school-sms-text-messages-to-parents/
https://clerk.chat/sms-templates/school/
https://trumpia.com/blog/21-university-text-messaging-ideas-that-maximizes-higher-education/
https://www.truedialog.com/resources/blog/higher-education-text-messaging-everything-you-need-to-know-about-tcpa-consent-laws/
https://mytcrplus.com/solutions/education-edtech-messaging-compliance/
https://www.termsfeed.com/blog/a2p-10dlc-compliance/
