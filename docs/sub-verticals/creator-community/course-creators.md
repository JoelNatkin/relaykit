## Course creator / cohort-based learning platforms

**Vertical:** Creator economy & community
**Bucket:** Clear
**URL slug:** /for/course-creators

### What this builder is making
A platform or app where an independent educator runs a paid online course — increasingly a cohort-based course (CBC) with a fixed start date, scheduled live sessions, dripped lessons, and assignment deadlines, in the lineage of Maven, Kajabi cohorts, Teachable, and Skool. The builder tracks enrollments, payments, cohort calendars, live-session schedules, lesson progress, and submission deadlines, and ties learner activity to a sequence of nudges that keep a cohort moving together. This is the live-delivery, time-boxed end of course tooling — distinct from a static self-paced video library where nothing is scheduled.

### Why they need SMS
The single most expensive failure in a cohort course is a paying learner missing the live session — recordings exist, but a no-show two weeks running is a churn-and-refund risk, and email open rates can't carry a "starts in 1 hour" alert reliably. SMS lands the cohort-start and session-start reminders in the minutes that decide whether someone shows up, and catches assignment deadlines before they lapse. Because learners are adults who paid and self-enrolled, consent is clean and the alerts are exactly the time-sensitive logistics they signed up to receive.

### Message categories
1. community — the core of cohort delivery: live-session reminders, cohort kickoff, announcements, and member onboarding map directly onto this category's event-reminder and onboarding-sequence shapes (sender frame `{{community_name}}` fits a named course/cohort).
2. account-events — enrollment runs on subscriptions and one-time payments; failed cards and trial/access expiry are churn-critical and get missed in email.
3. appointments — for course creators who layer 1:1 coaching calls or office hours onto the cohort, the confirmation/reminder/reschedule cycle applies cleanly.
4. marketing — enrollment-window opens, course launches, and re-engagement of past students; secondary because it is consent-gated and EIN-gated, not core delivery.
5. waitlist — cohort seats are capped and enrollment windows close, so a "next cohort" waitlist with seat-opening alerts is a real, recurring job.
6. verification — phone verification at signup is plausible but rarely central for a course product.
Excluded: order-updates (no physical fulfillment — there is no package to ship/deliver/return), team-alerts (no on-call/infra/shift surface for a solo educator's learners), customer-support (course questions are handled in-community or async, not via a ticketed support desk with agent routing — if a creator does run a help desk the generic category covers it, but it is not vertical-characteristic).

### Workflows

**Cohort kickoff sequence**
Gets every enrolled learner to the first live session on day one of a cohort.
Sequence:
1. community:welcome — "You're enrolled" — fires the moment enrollment completes; welcomes them to the cohort by name.
2. community:resource-pointer — "Course orientation" — a few days before start, points to the syllabus / orientation guide and how to join.
3. GAP:cohort-starts-soon — "Cohort starts tomorrow" — day-before kickoff alert naming start date/time.
4. community:live-event-reminder — "Live session starting" — shortly before the first session begins, with the join link.
Variable aliases:
- community_name: "Ship30 Cohort 14"
- event_name: "Week 1 Live Session"
- resource_link: "the course orientation guide"

**Recurring live-session reminders**
Keeps weekly attendance high across the run of the cohort.
Sequence:
1. community:event-invitation — "This week's session" — when the week's live session is posted/scheduled, with RSVP.
2. community:live-event-reminder — "Session starting soon" — shortly before each session, with the join link.

**Assignment deadline nudge**
Keeps learners on pace so they don't fall behind the cohort.
Sequence:
1. GAP:assignment-due — "Assignment due" — sent ahead of a submission deadline, naming the assignment and due time, with a submit link.

**1:1 coaching / office-hours call**
Handles scheduled calls that creators layer on top of group delivery.
Sequence:
1. appointments:confirmation — "Coaching call booked" — when a learner books a call with the instructor.
2. appointments:reminder-distant — "Call tomorrow" — day before.
3. appointments:reminder-proximate — "Call in 1 hour" — about an hour before.
4. appointments:reschedule-confirmation — "Call moved" — when either side reschedules.
Variable aliases:
- provider_name: "Sahil (instructor)"

**Enrollment & billing lifecycle**
Protects revenue across the paid relationship.
Sequence:
1. account-events:subscription-confirmed — "Enrollment confirmed" — when payment / plan goes through.
2. account-events:payment-failed — "Payment didn't go through" — on a declined card, before access is cut.
3. account-events:trial-ending — "Free preview ending" — a few days before a trial/preview window closes.
4. account-events:account-suspended — "Access paused" — when non-payment suspends course access.

**Next-cohort waitlist**
Converts demand for a sold-out or closed cohort into the next enrollment.
Sequence:
1. waitlist:joined — "On the waitlist" — when someone joins the list for a full/closed cohort.
2. waitlist:your-turn — "A seat opened" — when a seat frees up or the next cohort opens, with a claim link.
3. waitlist:grace-expiring — "Seat still open" — when the held seat is about to lapse.
4. waitlist:missed — "Seat expired" — if they don't claim in time, with a rejoin link.

**Course community engagement**
Keeps the surrounding community active between sessions.
Sequence:
1. community:first-action — "Introduce yourself" — 24-48h after joining the cohort space.
2. community:community-announcement — "New in the cohort" — when there's course news (guest speaker, schedule change).
3. community:week-1-check-in — "One week in" — check-in 7 days in.
4. community:member-milestone — "Module complete" — when a learner hits a progress milestone.
Variable aliases:
- milestone: "Module 3 complete"

**Enrollment-window marketing** (consent + EIN gated)
Fills the next cohort from an opted-in audience.
Sequence:
1. marketing:promotional-offer — "Enrollment open" — when the enrollment window / early-bird opens.
2. marketing:event-invitation — "Free workshop" — invite to a free intro workshop or webinar feeding the funnel.
3. marketing:re-engagement — "Come back for the next cohort" — to past students who lapsed.
Variable aliases:
- business_name: "Write of Passage"
- offer: "Cohort 5 enrollment is open"

### Message gaps

**GAP:cohort-starts-soon**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (display alias over a community-category event reminder)
- **Proposed universal name:** "Cohort starts tomorrow" (display alias)
- **Why:** a cohort has one defining day-before-kickoff moment distinct from a recurring per-session reminder; community:live-event-reminder covers the session-start beat but reads as "starting now," not "starts tomorrow."

**GAP:assignment-due**
- **Classification:** Universal miss
- **Proposed corpus home:** community:assignment-due
- **Proposed universal name:** "Deadline reminder"
- **Why:** deadline-with-action-link nudges are common across cohort courses, bootcamps, grant/application tools, and submission platforms, and no current corpus message carries a due-date + submit-link shape.
- **Draft variants:**
  - Standard: `{{community_name}}: {{assignment_name}} is due {{due_time}}. Submit here: {{submit_link}} Reply STOP to opt out.`
  - Friendly: `Heads up from {{community_name}} - {{assignment_name}} is due {{due_time}}. Submit: {{submit_link}} Reply STOP to opt out.`
  - Brief: `{{community_name}}: {{assignment_name}} due {{due_time}}. {{submit_link}} STOP to opt out.`
- **New variables:** `{{assignment_name}}` — name of the assignment/deliverable, budget ~28 chars, source: course assignment record, example: "Project 2 draft". `{{due_time}}` — due date/time, budget ~20 chars, source: deadline field, example: "Fri 5pm ET". `{{submit_link}}` — submission URL, budget ~24 chars, source: course platform, example: a short submit link.

### Content constraints
- Adult, self-enrolled learners: consent is clean and these are recipient-requested logistics; standard transactional consent + "Reply STOP to opt out." on every body suffices for cohort/session/deadline alerts.
- Enrollment-window and re-engagement sends are promotional → marketing category only, requiring separate explicit marketing consent and EIN-gated registration. Do not fold "enroll now" pitches into delivery-category reminders.
- Carriers apply heightened filtering to messaging that reads as promotional student recruitment; keep delivery alerts factual and logistics-only, and route any sales language through the marketing lane.
- This sub-vertical is adult continuing/professional education — NOT K-12 or higher-ed administration. If a builder's learners include minors (under-18), guardian-consent and FERPA complications push it out of the clean "Clear" path; that is the EdTech operational-SaaS neighbor, not this.
- No SHAFT-C content in marketing bodies.

### Disambiguation
The nearest neighbor is EdTech operational SaaS for K-12 and higher-ed (SIS, LMS admin, school-parent messaging like Remind) — that world carries minor-consent, guardian-authorization, and FERPA weight that keeps it out of this clean lane; course creators serve adults who self-enroll and self-consent. The other neighbor is the generic creator community / membership platform: a course differs by being time-boxed and scheduled (cohort start, live sessions, deadlines), which is why the community category's event and onboarding messages do most of the work here rather than pure social-feed updates. A self-paced, never-scheduled video library is the third neighbor and is far thinner on SMS — with nothing time-sensitive to alert, only billing (account-events) really applies. What tips this from Clear toward Conditional is the presence of minors in the learner base or any blurring of enrollment-marketing into delivery messages.

### Sources
https://www.mihaelcacic.com/best/best-cohort-based-course-platforms/
https://sellcoursesonline.com/cohort-based-course-platforms
https://www.group.app/blog/cohort-learning-platforms/
https://www.kajabi.com/blog/kajabi-vs-teachable-2026
https://www.mightynetworks.com/resources/maven-alternatives
https://dememarketing.com/skool-review-en-2/
https://www.superphone.io/blog/sms-campaign-ideas-for-course-launches
https://textus.com/texting-guides/sms-templates-for-training-certification-providers
https://www.textline.com/blog/sms-templates-for-schools
https://mytcrplus.com/solutions/education-edtech-messaging-compliance/
https://help.twilio.com/articles/4408675845019-SMS-Compliance-and-A2P-10DLC-in-the-US
https://www.10dlc.org/en/home/A2PConsent
