## HR / HRIS / payroll-adjacent SaaS
**Vertical:** B2B SaaS & developer tooling
**Bucket:** Conditional
**URL slug:** /for/hr-hris-saas

### What this builder is making
A "Gusto-for-X" HR platform — an HRIS, payroll engine, or workforce-management tool that stores employee records and runs the lifecycle events around them: onboarding, time-off, payroll runs, benefits enrollment, and scheduling. Buyers are SMBs with hourly or deskless staff who don't live in email, so the product's value depends on reaching employees the moment an HR event fires. The builder is a developer wiring SMS into HRIS triggers, not an HR department texting by hand.

### Why they need SMS
The breakpoint is the gap between an HR event firing (offer countersigned, timesheet due, PTO approved, enrollment window open) and the employee acting on it — deskless and hourly workers miss email entirely, producing Day-1 no-shows, late timesheets, and lapsed enrollments. The consequence is operational: an unsigned I-9 blocks payroll, a missed timesheet delays a paycheck, an unfilled shift is uncovered. SMS wins because it reaches a phone the employee carries on the floor, with a 98% open rate where the HR inbox sits unread.

### Message categories
1. team-alerts — primary: scheduling and shift lifecycle (assign, remind, change, cancel, start) is the workhorse for the hourly/deskless workforce these tools serve, mapping one-to-one onto the corpus shift lifecycle.
2. account-events — payroll, billing, and lifecycle alerts (timesheet/payroll deadlines, account/security) are churn- and pay-critical and get missed in email.
3. verification — phone-ownership proof at onboarding and step-up confirmation for sensitive actions like direct-deposit changes (2FA carve-out).
4. customer-support — employee HR-helpdesk tickets and proactive outreach map onto the ticket lifecycle when the platform offers an HR-support desk.
Excluded: marketing (no promotional content to employees; SHAFT-C/EIN-gated marketing consent is the wrong frame for internal HR comms), order-updates (no physical fulfillment), appointments (provider-booking model doesn't fit recurring HR events), community (member-community framing doesn't fit an employer-employee relationship), waitlist (no queue-for-a-spot model).

### Workflows

**New-hire onboarding sequence**
Drive a new hire from countersigned offer through first-day readiness so unsigned paperwork never blocks payroll.
Sequence:
1. verification:verification-code — "Verify your number" — confirm the new hire's phone at onboarding start.
2. GAP:onboarding-task-due — "Action needed: paperwork" — prompt I-9 / W-4 / direct-deposit completion with a portal link.
3. GAP:onboarding-task-due — "Reminder: paperwork" — escalating reminder as the start date nears.
4. team-alerts:shift-scheduled — "First shift scheduled" — deliver Day-1 date, time, location, role.
5. team-alerts:shift-reminder — "First-day reminder" — remind ahead of Day-1 start.
Variable aliases (only where default feels wrong):
- {{action_link}}: "your onboarding checklist"
- {{role}}: "your first day"

**Payroll & timesheet cycle**
Keep the pay cycle on time by chasing timesheet submission and confirming pay events without exposing pay amounts.
Sequence:
1. GAP:timesheet-deadline — "Timesheet due" — remind employee to submit before the payroll cutoff.
2. GAP:payroll-run-notice — "Payday confirmed" — confirm a pay run processed, no amount in body.
Variable aliases (only where default feels wrong):
- {{workspace_name}}: "Acme Payroll"

**Scheduling & shift lifecycle**
Assign, remind, change, and start shifts for an hourly workforce to cut no-shows and cover gaps.
Sequence:
1. team-alerts:shift-scheduled — "Shift assigned" — deliver date, time, location, role.
2. team-alerts:shift-reminder — "Shift reminder" — remind ahead of shift start.
3. team-alerts:shift-change — "Shift changed" — notify a swap, move, or reassignment.
4. team-alerts:shift-cancellation — "Shift cancelled" — notify a cancelled shift.
5. team-alerts:shift-start — "Shift starting / check in" — prompt clock-in at start.

**Time-off (PTO) request lifecycle**
Move a PTO request from submitted to a decision the employee can plan around.
Sequence:
1. GAP:timeoff-status — "Time-off request: received" — acknowledge a submitted request.
2. GAP:timeoff-status — "Time-off request: decision" — confirm approved or declined with dates.
Variable aliases (only where default feels wrong):
- (none)

**Benefits open-enrollment window**
Drive enrollment completion before the window closes across an announcement-to-deadline sequence.
Sequence:
1. GAP:enrollment-window — "Enrollment open" — announce the window with a portal link.
2. GAP:enrollment-window — "Enrollment reminder" — mid-window and 48-hour reminders.
3. GAP:enrollment-window — "Enrollment closes today" — day-of deadline nudge.
Variable aliases (only where default feels wrong):
- {{action_link}}: "your benefits portal"

**Sensitive-change confirmation**
Confirm a high-risk account change (direct-deposit edit, banking update) before it takes effect.
Sequence:
1. verification:confirmation-code — "Confirm this change" — step-up code before a direct-deposit or banking change.

**Account & security alerts**
Keep employees informed on account access and lifecycle events on their self-service profile.
Sequence:
1. account-events:new-device-sign-in — "New sign-in" — flag a new-device login to the employee portal.
2. account-events:account-suspended — "Account access change" — notify a deactivated/suspended profile.

**Employee HR-helpdesk (when platform offers a support desk)**
Run an employee HR question through the standard ticket lifecycle.
Sequence:
1. customer-support:ticket-received — "HR request received" — acknowledge a logged HR question.
2. customer-support:agent-assigned — "HR rep assigned" — route to a specific HR rep.
3. customer-support:agent-response — "HR reply" — notify a reply is waiting.
4. customer-support:resolution-notification — "Request resolved" — close the request.

### Message gaps

**GAP:onboarding-task-due**
- **Classification:** Vertical-specific
- **Proposed corpus home:** account-events:onboarding-task-due
- **Proposed universal name:** Required action pending / "Action needed"
- **Why:** the onboarding paperwork chase (I-9, W-4, direct-deposit, policy ack) is the core HR-event that blocks payroll and has no corpus equivalent — it is a deadline-bound task prompt, not a billing or shift message.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Action needed - {{task_name}} is due by {{due_date}}. Complete it here: {{action_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: quick one - please finish {{task_name}} by {{due_date}}: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{task_name}} due {{due_date}}. {{action_link}} STOP to opt out.`
- **New variables:** {{task_name}}, {{due_date}}

**GAP:timesheet-deadline**
- **Classification:** Vertical-specific
- **Proposed corpus home:** account-events:timesheet-deadline
- **Proposed universal name:** Submission deadline reminder / "Timesheet due"
- **Why:** a missed timesheet delays a paycheck; this recurring cutoff reminder has no home in shift or billing categories.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your timesheet is due by {{due_date}}. Submit it here to be paid on time: {{action_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: timesheet time - submit by {{due_date}} so payroll runs on time: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Timesheet due {{due_date}}. {{action_link}} STOP to opt out.`
- **New variables:** {{due_date}}

**GAP:payroll-run-notice**
- **Classification:** Vertical-specific
- **Proposed corpus home:** account-events:payroll-run-notice
- **Proposed universal name:** Payday confirmation / "Payday confirmed"
- **Why:** confirming a pay run processed is a distinct, high-value HR event, and the constraint forbids putting an amount in the body — so it cannot reuse refund/subscription messages.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your {{pay_date}} pay has been processed. View your pay stub: {{action_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: payday - your {{pay_date}} pay is processed. See your stub here: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{pay_date}} pay processed. Stub: {{action_link}} STOP to opt out.`
- **New variables:** {{pay_date}}

**GAP:timeoff-status**
- **Classification:** Vertical-specific
- **Proposed corpus home:** account-events:timeoff-status
- **Proposed universal name:** Time-off request update / "Time-off update"
- **Why:** PTO request acknowledgment and approve/decline is a defining HRIS event with no analog in any corpus category.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your time-off request for {{date_range}} is {{request_status}}. Details: {{action_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: update on your time off ({{date_range}}) - it's {{request_status}}: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Time off {{date_range}} {{request_status}}. {{action_link}} STOP to opt out.`
- **New variables:** {{date_range}}, {{request_status}}

**GAP:enrollment-window**
- **Classification:** Vertical-specific
- **Proposed corpus home:** account-events:enrollment-window
- **Proposed universal name:** Enrollment window reminder / "Enrollment open"
- **Why:** benefits open-enrollment is a deadline-bound, recurring HR event with measurable completion lift from SMS, and has no corpus equivalent; it is informational (link to portal), not promotional.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Benefits enrollment is open through {{deadline}}. Enroll here: {{action_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: open enrollment is on - choose your benefits by {{deadline}}: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Enrollment closes {{deadline}}. Enroll: {{action_link}} STOP to opt out.`
- **New variables:** {{deadline}}

### Content constraints
- No salary or compensation figures in the SMS body — payday and pay-run notices confirm the event and link to a stub; they never state an amount.
- No termination, discipline, layoff, demotion, or adverse-action notices via SMS — these require documented, non-SMS channels; route to email/portal only.
- EEOC-adjacent hygiene for recruiting/onboarding flows — no protected-class references (age, race, disability, family status); keep onboarding texts to logistics and task prompts.
- TCPA applies even to employees — work-related automated texts still require opt-in (captured in onboarding paperwork or portal), with honored STOP on every transactional body.
- Quiet-hours discipline: send within 8am–9pm local; defer non-urgent HR notices outside that window.
- No PHI in benefits/enrollment texts — link to the portal; never name a condition, plan detail, or claim in the body (avoids HIPAA-adjacent exposure).
- No direct-deposit or banking numbers in the body — confirm the change happened, gate the change itself behind a verification:confirmation-code.

### Disambiguation
This sub-vertical is the SaaS platform that employers buy to run HR — the HRIS/payroll/scheduling product itself — not a staffing agency, a recruiting-marketing tool, or an internal HR department texting by hand. It overlaps with general team-alerts (scheduling) but is broader: the payroll, onboarding-paperwork, PTO, and benefits events are its defining surface and are what generate the gaps above. Distinguish it from "appointment-based" verticals (no provider-booking model) and from "marketing-to-customers" verticals (audience is the employer's own staff, internal and non-promotional, so the marketing category and its consent regime do not apply).

### Sources
https://www.hubengage.com/employee-communications/sms-for-hr/
https://textus.com/blog/workforce-management-strategy-sms-examples
https://www.yourco.io/blog/shift-scheduling-via-text-message
https://www.yourco.io/blog/pre-onboaring-sms-sequence
https://www.udext.com/blog/sms-solutions-manufacturing-teams-hris-integration
https://www.udext.com/blog/employee-text-messaging-types-usage
https://gohire.com/text-messaging-for-hr/
https://gohire.com/text-recruiting-for-employee-onboarding/
https://gohire.com/text-recruiting-tcpa-compliance/
https://www.txtimpact.com/blog/text-messaging-for-employees
https://www.contactmonkey.com/blog/sms-compliance-guide
https://www.text-em-all.com/sms-compliance
https://www.text-em-all.com/blog/sms-compliance-for-staffing-agency
https://flimp.net/can-you-mass-text-employees-rules-and-regulations-tcpa/
https://gusto.com/resources/best-hris-systems
https://www.rippling.com/blog/bamboohr-competitors
https://www.joinhomebase.com/blog/best-hr-software
