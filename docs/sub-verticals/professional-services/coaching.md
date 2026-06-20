## Coaching / executive coaching (non-clinical)
**Vertical:** Professional services
**Bucket:** Clear
**URL slug:** /for/coaching

### What this builder is making
A coach-CRM or client-portal for solo coaches and small coaching practices — executive, business, life, career, and job-search coaching — that schedules 1:1 sessions, assigns action items and homework between sessions, and tracks progress against client-defined goals. The software books discovery calls and recurring sessions, sends reminders, collects intake and post-session reflections, and handles recurring billing for coaching packages. It is goal-and-accountability software (think CoachAccountable, Paperbell, Simply.Coach), not a clinical or behavioral-health record system.

### Why they need SMS
The whole value of coaching lives between sessions — a client who skips their committed action item by Wednesday has lost the week, and email reminders sit unopened. A two-way accountability text ("text me when it's done") closes the loop in the moment, and a session reminder the day before kills the no-shows that waste a coach's billable calendar. SMS wins because coaching is a relationship of nudges and check-ins, and a phone is the one channel a busy executive or active job-seeker actually reads in real time.

### Message categories
1. appointments — session confirmations, reminders, reschedules, no-show rebooking are the spine of a coaching practice
2. account-events — recurring package billing, failed cards, and subscription changes for monthly coaching retainers
3. community — group-coaching cohorts, live workshops, and member onboarding for coaches running a program or membership
4. customer-support — client questions about scheduling, billing, or portal access (lighter use, but present)
Excluded: order-updates (no physical fulfillment), team-alerts (no on-call/incident surface for a solo coach), waitlist (rarely a queue mechanic; discovery-call demand is handled by booking, not a waitlist), verification (portal login is passwordless email per platform norm; phone-ownership proof is not a coaching workflow), marketing (promotional blasts are the platform's separate EIN-gated campaign, not core to the coach-client relationship)

### Workflows

**Discovery-call follow-up**
Confirms and reminds a prospect of their free intro/discovery call so it actually happens — the top of every coaching funnel.
Sequence:
1. appointments:confirmation — "Discovery call confirmed" — sent when the prospect books, confirms time with the coach
2. appointments:reminder-distant — "Discovery call tomorrow" — day-before reminder with reschedule link
3. appointments:reminder-proximate — "Discovery call in 1 hour" — hour-before nudge
4. appointments:no-show-follow-up — "We missed you — rebook" — sent if the prospect missed, offers a new time
Variable aliases:
- provider_name: "Coach Dana"

**Recurring session lifecycle**
Keeps an active client's standing 1:1 sessions on the calendar and reduces the no-shows that burn billable slots.
Sequence:
1. appointments:confirmation — "Session confirmed" — sent when a session is booked or auto-scheduled
2. appointments:reminder-distant — "Session tomorrow" — day-before reminder
3. appointments:reminder-proximate — "Session in 1 hour" — hour-before nudge
4. appointments:reschedule-confirmation — "Session moved" — confirms a new time when client reschedules
5. appointments:cancellation-confirmation — "Session cancelled" — confirms cancellation, offers rebook
6. appointments:no-show-follow-up — "We missed you today" — rebook prompt after a missed session
Variable aliases:
- provider_name: "Coach Dana"

**Post-session reflection**
Captures the client's takeaways and feedback while the session is fresh — feeds the coach's notes and the next session's agenda.
Sequence:
1. appointments:post-appointment — "How did today's session land?" — sent after the session with a reflection/feedback link
Variable aliases:
- provider_name: "Coach Dana"
- feedback_link: "your reflection form"

**Between-session accountability check-in**
The core coaching loop — a mid-week two-way nudge asking the client to report progress on a committed action, the thing email can't do.
Sequence:
1. GAP:accountability-check-in — "Accountability check-in" — mid-week prompt asking the client to report on their committed action; invites a reply
Variable aliases:
- (none)

**Action-item / homework nudge**
Pushes a client toward a specific assigned task they've been avoiding before the next session arrives.
Sequence:
1. GAP:action-item-due — "Action item due" — reminds the client an assigned action/homework is coming due before next session
Variable aliases:
- (none)

**Milestone celebration**
Reinforces progress when a client hits a goal — a retention and motivation moment specific to coaching.
Sequence:
1. STRETCH:community:member-milestone — "Milestone reached" — congratulates the client on a goal hit; corpus body is community-framed and needs reframing to an individual coaching goal
Variable aliases:
- community_name: "{{workspace_name}}" (coaching practice name, not a community)
- milestone: "your 30-day commitment"

**Group-coaching / cohort sessions**
For coaches running a group program or mastermind cohort — reminds members of the live group call.
Sequence:
1. community:live-event-reminder — "Group call starts soon" — shortly before a live cohort session
2. community:event-invitation — "New group session scheduled" — when a new cohort call is posted, with RSVP
Variable aliases:
- community_name: "the {{workspace_name}} cohort"
- event_name: "this week's group call"

**Cohort / membership onboarding**
Walks a new member of a group-coaching program through their first week so they engage instead of going quiet.
Sequence:
1. community:welcome — "Welcome to the program" — immediately on joining the cohort
2. community:first-action — "Introduce yourself" — 24-48h, points to the intros channel
3. community:resource-pointer — "Your program guide" — 3-5 days, links the orientation/program materials
4. community:week-1-check-in — "One week in — how's it going?" — 7 days, opens a two-way check-in
Variable aliases:
- community_name: "the {{workspace_name}} program"

**Coaching-package billing**
Keeps a monthly coaching retainer or package subscription alive — a failed card silently ends the engagement otherwise.
Sequence:
1. account-events:payment-failed — "Card declined" — when the recurring package payment fails, links to update payment
2. account-events:subscription-confirmed — "Package renewed" — confirms a renewal, plan change, or cancellation
3. account-events:trial-ending — "Intro period ending" — a few days before a trial/intro-rate window ends
Variable aliases:
- (none)

**Client support touch**
Answers a client's scheduling, billing, or portal-access question raised through the practice.
Sequence:
1. customer-support:ticket-received — "We got your message" — acknowledges a client inquiry
2. customer-support:resolution-notification — "Sorted" — confirms the question is resolved
Variable aliases:
- (none)

### Message gaps

**GAP:accountability-check-in**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** Accountability check-in
- **Why:** the mid-week "report your progress and reply" loop is the defining coaching message and has no transactional-event analog in the corpus
- **Draft variants:** (skipped — vertical-specific)

**GAP:action-item-due**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** Action item due
- **Why:** an assigned-homework due nudge between sessions is specific to coaching's action-item model and isn't an appointment or account event
- **Draft variants:** (skipped — vertical-specific)

**STRETCH:community:member-milestone**
- **Classification:** Stretch
- **Proposed corpus home:** community:member-milestone — the message fits a one-clause "you reached {{milestone}}" frame, but its body and sender frame assume a community ("Thanks for being here," `{{community_name}}`) rather than a 1:1 coach-client goal
- **Proposed universal name:** Member milestone (alias here: "Goal milestone")
- **Why:** coaching celebrates individual goal completions, not community-tenure milestones, so the existing copy needs reframing away from community language
- **Draft variants:**
  - Standard: `{{workspace_name}}: you've reached {{milestone}}. Proud of the progress — let's keep it going. Reply STOP to opt out.`
  - Friendly: `Big one — you hit {{milestone}} with {{workspace_name}}. Really proud of you. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{milestone}} reached. Great work. STOP to opt out.`
- **New variables:** (none — reuses {{workspace_name}} and {{milestone}})

### Content constraints
- Standard A2P 10DLC rules apply: explicit opt-in before any message, STOP/HELP honored, sender-frame identification in every body.
- Keep every body in goal / appointment / accountability / progress framing. Never reference or imply treatment of a mental-health condition.
- Prohibited phrasing in any coaching body: anxiety, depression, eating disorder, addiction, trauma treatment, diagnosis, "manage your symptoms," "therapy," or any clinical-treatment language. This framing escalates the message OUT of the Clear bucket into healthcare/therapy territory (HIPAA-adjacent, declined at intake per RelayKit policy).
- No promotional content in transactional categories; promotional offers belong to the separate EIN-gated marketing campaign.
- No PHI in any body — coaches are not covered entities and must not be put in a position to transmit health data through the proxy.

### Disambiguation
This Clear bucket is strictly NON-clinical coaching — executive, business, career, life, and job-search. The escalation trigger is framing, not the coach's title: a "life coach" stays Clear while they text about goals, sessions, and accountability, but the moment a body references treating anxiety, depression, an eating disorder, or addiction, it crosses into therapy/behavioral-health (D-18 healthcare decline, HIPAA-adjacent) and leaves this bucket. Neighboring sub-verticals that look adjacent but route elsewhere: therapy/counseling practices and mental-health coaching (healthcare bucket); fitness/personal training (its own physical-health-adjacent vertical); and corporate L&D or HR platforms (B2B SaaS, not 1:1 client coaching). What looks allowed but isn't: a "stress and burnout coach" or "wellness coach" is fine in goal/recovery-habit framing, but the instant the copy promises symptom relief or treatment it is no longer eligible here.

### Sources
https://simply.coach/blog/crm-for-coaches-client-management/
https://www.nutshell.com/blog/best-crm-for-coaches
https://close.com/blog/crm-career-coaches
https://www.coachaccountable.com/features
https://www.lessannoyingcrm.com/industry/coaching
https://www.textmagic.com/blog/coaching-conversation-sms-templates/
https://schedulingkit.com/appointment-reminders/coaches
https://mobile-text-alerts.com/articles/sms-for-coaching-client-engagement
https://www.superphone.io/blog/sms-follow-up-templates-for-coaching
https://simply.coach/blog/career-coaching-software-platforms/
https://help.twilio.com/articles/4408675845019-SMS-Compliance-and-A2P-10DLC-in-the-US
https://hipaacomplianthosting.com/does-hipaa-apply-to-coaches-like-mental-health-coaches-life-coaches-etc/
https://www.blueprint.ai/blog/life-coach-vs-therapist-defining-boundaries-and-collaborative-opportunities-in-clinical-practice
https://www.goodtherapy.org/blog/Psychotherapy-vs-Coaching-Legal-Distinction
