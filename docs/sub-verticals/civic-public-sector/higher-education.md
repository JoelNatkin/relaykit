## Higher-education administration
**Vertical:** Civic & public sector
**Bucket:** Clear
**URL slug:** /for/higher-education

### What this builder is making
A platform that runs the administrative side of a college or university — the student information system layer where registration windows, financial-aid status, account holds, advising appointments, and class-schedule changes are tracked and acted on. The day-to-day job is moving enrolled students through deadline-driven workflows (register, pay tuition, accept aid, clear a hold, show up to advising) and pushing operational notices when something on the institution's side changes. This is campus-administrative tooling for currently-enrolled students and staff — not a K-12 admin product, not a course-creator/MOOC platform, and not the LMS where coursework lives.

### Why they need SMS
A financial-aid acceptance window or a registration-priority slot has a hard date, and a student who misses it loses the award or the seat — but the notice was buried in an unread campus email account. SMS reaches the student on the device they actually check, in time to act, which is the difference between a cleared hold and a dropped semester. The institution also has genuinely urgent operational moments — a class cancelled an hour before it meets, a payment hold freezing registration — where email latency is unacceptable.

### Message categories
1. account-events — the spine of campus admin: tuition payment failures, account holds/suspensions, aid-status lifecycle. These are the churn-critical, deadline-bound notices SMS exists for here.
2. appointments — academic advising, financial-aid counseling, and orientation are all booked appointments with no-show problems; the full confirm/remind/reschedule lifecycle applies directly.
3. waitlist — course waitlists are a near-perfect structural match: students hold a queue position for a closed section and must claim a seat in a grace window when it opens.
4. team-alerts — campus emergency alerts and time-critical operational notices (class cancellation, building closure, system outage) map to the severity-cued alert pattern, sent to affected segments.
5. customer-support — student-services help desks (IT, registrar, bursar, aid office) run ticketed support; the lifecycle and status-alert messages fit.
6. verification — passwordless sign-in and step-up confirmation for the student portal where aid and payment changes happen.
7. community — campus-event reminders and new-student onboarding sequences have a real but secondary place.

Excluded: order-updates (no physical fulfillment in campus administration — bookstore shipping would be a separate retail product, not this builder). marketing (prospective-student recruitment is a distinct admissions-marketing motion; an enrolled-student admin platform sends informational/transactional notices, and the nonprofit TCPA posture depends on staying non-commercial — see Content constraints).

### Workflows

**Tuition payment due and failure**
Drives on-time tuition payment and recovers failed charges before a hold lands.
Sequence:
1. account-events:payment-failed — "Bursar / Student Accounts" — sent when an auto-payment or card on file is declined; update payment to avoid a hold.
2. account-events:account-suspended — "Bursar / Student Accounts" — sent when nonpayment triggers a registration/transcript hold; details and how to clear it.
3. account-events:subscription-confirmed — "Bursar / Student Accounts" — STRETCH: confirms the balance is paid and the hold is lifted.
Variable aliases:
- account_link: "{{portal_link}}" (the bursar/student-account page)

**Financial-aid lifecycle**
Moves a student through aid award, the acceptance deadline, and verification before disbursement.
Sequence:
1. account-events:subscription-confirmed — "Financial Aid" — STRETCH: sent when the aid package is finalized and ready to view in the portal.
2. account-events:payment-failed — "Financial Aid" — STRETCH: GAP:document-needed — sent when verification documents (e.g., FAFSA verification) are missing before a deadline.
3. account-events:trial-ending — "Financial Aid" — STRETCH: GAP:deadline-reminder — sent a few days before the aid-acceptance window closes.
Variable aliases:
- account_link: "{{aid_portal_link}}"
- days_remaining: "3" (days until the acceptance window closes)

**Registration window and priority enrollment**
Tells a student when their registration window opens and nudges before it closes.
Sequence:
1. account-events:trial-ending — "{{school_name}} Registrar" — STRETCH: GAP:deadline-reminder — sent when the student's priority-registration window opens and when it is about to close.
2. account-events:account-suspended — "{{school_name}} Registrar" — sent if a hold is blocking registration, with the office to contact.
Variable aliases:
- account_link: "{{registration_link}}"

**Course waitlist**
Holds a student's place in a closed section and lets them claim a seat when one frees up.
Sequence:
1. waitlist:joined — "{{school_name}} Registrar" — confirms the student is on the waitlist for a closed section.
2. waitlist:position-update — "{{school_name}} Registrar" — sent as the student moves up the queue.
3. waitlist:almost-up — "{{school_name}} Registrar" — sent when a seat is likely to open soon.
4. waitlist:your-turn — "{{school_name}} Registrar" — a seat opened; claim it in the portal.
5. waitlist:grace-expiring — "{{school_name}} Registrar" — the open seat lapses soon; claim now.
6. waitlist:missed — "{{school_name}} Registrar" — the seat lapsed; rejoin the list.
Variable aliases:
- claim_link: "{{registration_link}}"
- queue_position: "#4 for BIOL 201"

**Academic advising appointment**
Runs the book/remind/reschedule loop for a required or optional advising meeting.
Sequence:
1. appointments:confirmation — "{{school_name}} Advising" — confirms the advising appointment.
2. appointments:reminder-distant — "{{school_name}} Advising" — day-before reminder.
3. appointments:reminder-proximate — "{{school_name}} Advising" — about an hour before.
4. appointments:reschedule-confirmation — "{{school_name}} Advising" — when moved.
5. appointments:cancellation-confirmation — "{{school_name}} Advising" — when cancelled.
6. appointments:no-show-follow-up — "{{school_name}} Advising" — after a missed appointment, rebook.
Variable aliases:
- provider_name: "your advisor, Dr. Patel"
- appointment_time: "Tue Mar 4, 2:00 PM"

**Financial-aid / bursar counseling appointment**
Same booked-appointment loop for a sit-down with an aid or bursar counselor.
Sequence:
1. appointments:confirmation — "Financial Aid" — confirms the counseling appointment.
2. appointments:reminder-distant — "Financial Aid" — day-before reminder.
3. appointments:no-show-follow-up — "Financial Aid" — rebook after a miss.
Variable aliases:
- provider_name: "a financial-aid counselor"

**Class cancellation and schedule change**
Tells enrolled students fast when a meeting is cancelled, relocated, or rescheduled.
Sequence:
1. team-alerts:system-alert — "{{school_name}}" — STRETCH: sent when a class is cancelled or a room/time changes; severity-cued, links to details.
Variable aliases:
- severity: "Notice"
- alert_type: "BIOL 201 cancelled today"
- system_name: "your schedule"

**Campus emergency alert**
Pushes a safety-critical alert to affected students and staff immediately.
Sequence:
1. team-alerts:on-call-page — "{{school_name}} Alert" — STRETCH: shortest urgent form for active-threat or severe-weather alerts with a safety-instructions link.
2. team-alerts:service-status-alert — "{{school_name}} Alert" — informational follow-up / all-clear.
Variable aliases:
- severity: "EMERGENCY"
- system_name: "Main Campus"

**Student-services help desk (IT / registrar / bursar / aid)**
Ticketed support lifecycle for a student-facing service office.
Sequence:
1. customer-support:ticket-received — "{{school_name}} IT Help" — request logged.
2. customer-support:agent-assigned — "{{school_name}} IT Help" — a staff member is handling it.
3. customer-support:agent-response — "{{school_name}} IT Help" — there's a reply.
4. customer-support:resolution-notification — "{{school_name}} IT Help" — resolved.
5. customer-support:csat-follow-up — "{{school_name}} IT Help" — rate the help.

**Service status / portal outage**
Tells affected students when a campus system is down and when it recovers.
Sequence:
1. customer-support:service-status-alert — "{{school_name}} IT" — registration/portal/payment system is down, with an ETA.
2. customer-support:account-issue-resolved — "{{school_name}} IT" — issue fixed, no action needed.

**Portal sign-in and step-up confirmation**
Authenticates the student portal and confirms sensitive account changes.
Sequence:
1. verification:login-code — "{{school_name}}" — SMS second factor at sign-in.
2. verification:confirmation-code — "{{school_name}}" — before a sensitive change (banking for refunds, payment method).
Variable aliases:
- expiry_minutes: "10"

**New-student onboarding**
Walks an admitted/enrolled student through first steps after they commit.
Sequence:
1. community:welcome — "{{school_name}}" — STRETCH: welcome after enrollment is confirmed.
2. community:first-action — "{{school_name}}" — STRETCH: nudge a concrete first step (complete orientation tasks).
3. community:resource-pointer — "{{school_name}}" — STRETCH: point to the new-student orientation guide.
Variable aliases:
- community_name: "{{school_name}}"
- resource_link: "{{orientation_link}}"

**Campus event reminder**
Reminds opted-in students about an orientation session, info session, or campus event.
Sequence:
1. community:event-invitation — "{{school_name}}" — new event posted, RSVP.
2. community:live-event-reminder — "{{school_name}}" — shortly before it starts.
Variable aliases:
- community_name: "{{school_name}}"

### Message gaps

**GAP:document-needed**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:document-needed
- **Proposed universal name:** Document needed
- **Why:** "you owe us a document before a deadline or your application/account stalls" is a common admin pattern (aid verification, KYC, onboarding) with no clean corpus fit — payment-failed is about money, not paperwork.
- **Draft variants:**
  - Standard: `{{workspace_name}}: We need a document to finish your file. Upload by {{due_date}}: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: One thing left - we need a document from you by {{due_date}}. Upload here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Document needed by {{due_date}}. Upload: {{account_link}} STOP to opt out.`
- **New variables:** `{{due_date}}` — the deadline to submit the document, budget ~12 chars, source: the due date on the requirement, example: "Mar 4".

**GAP:deadline-reminder**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:deadline-reminder
- **Proposed universal name:** Deadline reminder
- **Why:** a generic "this action window closes soon, act now" notice (registration window, aid-acceptance window, enrollment deadline) recurs across verticals; trial-ending is the closest but is billing-framed and reads wrong for non-billing deadlines.
- **Draft variants:**
  - Standard: `{{workspace_name}}: {{deadline_item}} closes {{due_date}}. Take action here: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: heads up - {{deadline_item}} closes {{due_date}}. Don't miss it: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{deadline_item}} closes {{due_date}}. {{account_link}} STOP to opt out.`
- **New variables:** `{{deadline_item}}` — the thing with a deadline, budget ~28 chars, source: the workflow context, example: "Aid acceptance". `{{due_date}}` — the deadline, budget ~12 chars, example: "Mar 4".

**STRETCH:account-events:subscription-confirmed**
- **Classification:** Stretch
- **Proposed corpus home:** account-events:subscription-confirmed — fit gap: the corpus message is literally about a subscription change; here it carries "aid finalized" / "hold cleared," so the body's "subscription" framing must be reframed to a neutral "your status is updated."
- **Proposed universal name:** Status confirmed
- **Why:** aid-finalized and hold-lifted are status confirmations, not subscription events.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your status is updated and confirmed. View the details: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: All set - your status is updated. See the details here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Status updated. Details: {{account_link}} STOP to opt out.`

**STRETCH:account-events:trial-ending**
- **Classification:** Stretch
- **Proposed corpus home:** account-events:trial-ending — fit gap: corpus body is "your trial ends, choose a plan"; the higher-ed use is "your registration/aid window closes, act now." Better served by the proposed deadline-reminder GAP above; flagged here because builders will reach for trial-ending first and it reads as billing.
- **Proposed universal name:** Deadline reminder (see GAP:deadline-reminder)
- **Why:** the window-closing semantics match but the billing copy does not.
- **Draft variants:** (see GAP:deadline-reminder)

**STRETCH:account-events:payment-failed**
- **Classification:** Stretch
- **Proposed corpus home:** account-events:payment-failed — fit gap: used in the aid workflow to mean "missing verification documents," which is paperwork, not a declined card. Properly served by GAP:document-needed; flagged because the "action required before a deadline or your file stalls" shape leads builders to it.
- **Proposed universal name:** Document needed (see GAP:document-needed)
- **Why:** action-required-or-it-stalls shape matches; the payment framing does not.
- **Draft variants:** (see GAP:document-needed)

**STRETCH:team-alerts:system-alert / team-alerts:on-call-page**
- **Classification:** Stretch
- **Proposed corpus home:** team-alerts:system-alert and team-alerts:on-call-page — fit gap: these are IT/ops-incident messages ({{system_name}}, ACK/escalation, "down"). Campus class-cancellation and emergency alerts reuse the severity-cued structure but address students/the public, not an on-call engineer, so {{system_name}}/{{escalation_to}} aliasing carries the reframe rather than a body rewrite.
- **Proposed universal name:** keep system-alert / on-call-page; surface campus-alert aliases at the sub-vertical registry layer
- **Why:** the severity-cued urgent-broadcast pattern fits; the operational-incident audience does not.
- **Draft variants:** (covered by existing corpus bodies via the variable aliases noted in the workflows)

**STRETCH:community:welcome / community:first-action / community:resource-pointer**
- **Classification:** Stretch
- **Proposed corpus home:** community:welcome / first-action / resource-pointer — fit gap: corpus copy references a "community" and "intros channel"; new-student onboarding is institutional (orientation tasks, the orientation guide), so {{community_name}} aliases to the school and the body's community framing reads slightly off.
- **Proposed universal name:** keep as-is; alias {{community_name}} to {{school_name}} at the sub-vertical registry layer
- **Why:** the staged onboarding cadence fits; the community-membership framing is a mild mismatch for an institution.
- **Draft variants:** (covered by existing corpus bodies via aliases)

### Content constraints
- Standard carrier rules apply. No vertical-specific carrier prohibitions for transactional/informational campus messages.
- Keep enrolled-student admin messages informational, not commercial: prospective-student recruitment and promotional offers belong in a separate marketing campaign with explicit marketing consent (EIN-gated). Mixing recruitment promos into the admin sender risks the nonprofit TCPA posture and SHAFT-C/marketing rules.
- TCPA applies to students, parents, faculty, and staff alike; collect consent in a context tied to the messages (e.g., the number given at enrollment/portal signup). Most nonprofit institutions are partly TCPA-exempt for informational/educational content, and that exemption extends to a for-profit sending vendor — but best practice is to honor STOP/HELP and consent anyway.
- Do not put grades, account balances, aid amounts, disciplinary details, or other FERPA-protected specifics in the message body; link to the authenticated portal instead. (Body should say "your aid is ready," never the dollar figure.)
- 10DLC registration is required for automated/recurring sends from US local numbers regardless of institution size or volume.
- Verification messages use the 2FA carve-out (no STOP/HELP in body); every other category keeps STOP.

### Disambiguation
The nearest neighbor is K-12 / EdTech operational SaaS — the line is the audience and the workflows: this builder serves currently-enrolled adult students through registration/aid/billing/advising, while K-12 admin centers on parents, attendance, and guardians. It is also distinct from course-creator and MOOC platforms (lesson drips, cohort engagement, instructor marketing — a creator/community motion, not institutional administration) and from the LMS where coursework and grades live. The thing that tips this Clear sub-vertical toward Conditional is content, not category: pull PHI through a campus health/counseling integration and HIPAA declines at intake (D-18), or let recruitment promos ride the admin number and it becomes a marketing-consent problem. Stay on informational enrolled-student notices with FERPA specifics behind the portal link and eligibility is standard.

### Sources
https://www.workday.com/en-us/topics/hr/higher-education-software.html
https://www.classe365.com/blog/top-10-best-sis-software-for-universities/
https://empowersis.com/higher-education-student-information-systems-software/
https://emitrr.com/blog/sms-for-universities/
https://moderncampus.com/products/conversational-text-messaging-message.html
https://www.truedialog.com/industry/higher-education/
https://sinch.com/engage/resources/business-messaging/sms-for-admissions/
https://callhub.io/blog/education/texting-college-students/
https://moderncampus.com/blog/10-higher-ed-tex-messaging-best-practices-key-dos-and-donts.html
https://www.regroup.com/industries/education/higher-ed/
https://www.truedialog.com/resources/blog/campus-emergency-alert-system/
https://www.truedialog.com/resources/blog/higher-education-text-messaging-everything-you-need-to-know-about-tcpa-consent-laws/
https://mainstay.com/blog/texting-and-privacy-laws-what-schools-must-know-when-texting-students/
https://www.text-em-all.com/blog/text-message-privacy-laws-what-schools-need-to-know/
https://cla-advising.mtsu.edu/appointment/
