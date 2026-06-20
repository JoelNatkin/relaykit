## Wellness / fitness / habit tracking (non-clinical)
**Vertical:** Healthcare
**Bucket:** Clear
**URL slug:** /for/wellness-fitness

### What this builder is making
Consumer apps that log an activity and keep people coming back to it: Strava-style trackers, habit-streak apps, meditation/mindfulness reminder apps, and structured workout-program apps. The mechanics are the same across the category — log the action, set a goal or streak, fire a nudge when it's due, and run challenges or member groups for accountability. Non-clinical and consumer-facing: no diagnosis, no treatment, no medical outcome claims.

### Why they need SMS
The whole product hinges on showing up daily, and the single moment that decides retention is the one where a streak is about to break or a habit window is closing. Push notifications are the obvious tool, but habitual users go push-blind fast and the most engaged people (the ones with long streaks worth protecting) are exactly the ones who've muted the app. SMS lands in the one channel they still read, which is why a lapsed-streak text saves the user a generic in-app banner can't reach.

### Message categories
1. account-events — streak/habit lifecycle nudges and milestone confirmations map cleanest here (lifecycle alerts that get missed in-app); the daily-nudge engine is the product's core SMS use, sitting in a registry layer over this category
2. appointments — scheduled workout/session/class reminders reuse the reminder cadence (distant + proximate) almost verbatim
3. community — challenge groups, member milestones, and accountability-circle onboarding
4. account-events — trial/subscription churn messages for the paid tiers most of these apps run

Excluded: order-updates (no physical fulfillment), team-alerts (no on-call/incident surface), customer-support (present generically but not category-defining), waitlist (no queueing), verification (signup 2FA only, not category-defining), marketing (promo lives behind separate consent, not the transactional core).

### Workflows

**Daily habit nudge**
Remind a user to do their tracked habit while the day's window is still open.
Sequence:
1. account-events:trial-ending — "Habit reminder" — STRETCH; the nearest corpus body is a time-pressured "act before the window closes" alert, but there is no true recurring-habit-nudge message. See gap below.
Variable aliases (only where default feels wrong):
- (none — covered by the gap draft)

**Streak save**
Catch a user before an active streak breaks so they don't lose the chain.
Sequence:
1. account-events:trial-ending — "Streak ending" — STRETCH; "ends in X, act to keep it" maps in spirit but the corpus body is trial-specific. See gap below.
Variable aliases:
- days_remaining: "ends tonight"

**Scheduled workout / session reminder**
Remind a user of a planned workout, class, or coached session.
Sequence:
1. appointments:reminder-distant — "Tomorrow's workout" — day-before reminder for a scheduled session
2. appointments:reminder-proximate — "Starting soon" — about an hour before
3. appointments:no-show-follow-up — "Missed your workout" — after a skipped session, offer to reschedule
4. appointments:post-appointment — "How'd it go?" — post-session feedback / log prompt
Variable aliases:
- provider_name: "your coach" (or "Vinyasa Flow" for a class)
- appointment_time: "6:00 AM"
- reschedule_link: link to reschedule the session

**Challenge group**
Run a time-boxed challenge with a group of members and keep them moving through it.
Sequence:
1. community:welcome — "You're in the challenge" — sent when a member joins the challenge
2. community:live-event-reminder — "Challenge starts" — shortly before the challenge kicks off
3. community:member-milestone — "Milestone hit" — when a participant clears a challenge checkpoint (day 10, halfway, finish)
4. community:community-announcement — "Challenge update" — leaderboard moves and group news
Variable aliases:
- community_name: "30-Day Strength Challenge"
- milestone: "the halfway mark"
- event_name: "the 30-Day Challenge"

**Member onboarding (accountability circle)**
Walk a new member into the habit of using the app's social/accountability layer.
Sequence:
1. community:welcome — "Welcome" — on join
2. community:first-action — "Log your first day" — 24-48h in
3. community:resource-pointer — "Getting-started guide" — 3-5 days in
4. community:week-1-check-in — "One week in" — day 7
Variable aliases:
- community_name: the app or circle name

**Plan churn (paid tiers)**
Keep paying subscribers from lapsing on the freemium-to-paid apps that dominate this category.
Sequence:
1. account-events:trial-ending — "Trial ending" — a few days before trial end
2. account-events:payment-failed — "Payment failed" — on a declined renewal
3. account-events:subscription-confirmed — "Subscription confirmed" — on renewal or plan change
Variable aliases:
- (defaults fit)

### Message gaps

**GAP:recurring-habit-nudge**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:habit-reminder (with a sub-vertical registry layer driving the daily recurrence schedule)
- **Proposed universal name:** Recurring reminder
- **Why:** the corpus has no message for "your recurring thing is due now" — the single most-sent message type in this category and reusable across many verticals (medication-free wellness, practice routines, daily logging).
- **Draft variants:**
  - Standard: `{{workspace_name}}: time for {{habit_name}}. Mark it done: {{action_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}} nudge: {{habit_name}} is due today. Knock it out: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{habit_name}} due. {{action_link}} STOP to opt out.`
- **New variables:** habit_name ("your morning run"), action_link

**GAP:streak-about-to-break**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:streak-ending
- **Proposed universal name:** Streak ending
- **Why:** the highest-leverage retention message in the category — distinct from a generic reminder because it carries the loss-aversion frame (an existing streak count at risk), and it generalizes to any gamified product (learning apps, loyalty).
- **Draft variants:**
  - Standard: `{{workspace_name}}: your {{streak_count}} streak ends tonight. Keep it going: {{action_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: don't lose your {{streak_count}} streak. One quick check-in keeps it alive: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{streak_count}} streak ends tonight. {{action_link}} STOP to opt out.`
- **New variables:** streak_count ("12-day"), action_link

**GAP:goal-progress-update**
- **Classification:** Vertical-specific
- **Proposed corpus home:** account-events:goal-update (sub-vertical registry layer)
- **Proposed universal name:** Goal progress (display alias: "Goal update")
- **Why:** weekly "you're X% to your goal" recaps are common to trackers but too fitness-flavored to be a clean universal; SKIP draft variants per vertical-specific rule.

### Content constraints
- Standard carrier rules apply for the transactional core (habit nudges, streak saves, scheduled-session reminders, milestone confirmations) — these are user-requested lifecycle alerts and register as ACCOUNT_NOTIFICATION.
- Avoid medical or health-outcome claims in message bodies — no "cure," "treat," "lose 20 lbs guaranteed," "lower your blood pressure." Outcome claims read as healthcare to TCR review and escalate scrutiny even for a non-clinical app; keep nudges about the action ("time for your run"), not the result.
- Recurring reminders need clear consent at opt-in plus a stated frequency expectation (daily nudges are high-volume by design); honor STOP per message.
- Daily habit nudges, streak saves, and session reminders are transactional. Challenge promotion, win-back blasts, and "join our new program" sends are marketing — they need separate explicit marketing consent and live in the marketing category (EIN-gated, separate registration), never folded into the transactional nudge stream.

### Disambiguation
This stays Clear precisely because it's consumer self-improvement with no clinical layer: logging a workout or a meditation streak involves no diagnosis, no treatment plan, and no PHI flowing through the proxy. The moment an app adds condition management — diabetes coaching, blood-pressure programs, medication adherence for a prescribed therapy — or makes a health-outcome claim, it tips toward clinical and out of Clear (and RelayKit declines healthcare/HIPAA at intake per platform policy). It is distinct from nutrition and meal-planning apps (overlapping but food-logging-centric) and from healthcare-admin and clinical telehealth, which carry appointments tied to a provider relationship and protected data. Keep the messaging about the user's chosen activity and its streak, not about a medical condition or a guaranteed result, and it sits cleanly in standard-eligibility territory.

### Sources
https://reclaim.ai/blog/habit-tracker-apps
https://theliven.com/blog/wellbeing/dopamine-management/best-habit-tracker-apps-to-build-your-routines
https://habitchat.gumroad.com/l/dscsdv
https://support.strava.com/hc/en-us/articles/36553427481997-Streaks-on-Strava
https://orangesoft.co/blog/strategies-to-increase-fitness-app-engagement-and-retention
https://www.strivecompetitions.com/30-day-workout-challenge
https://www.challengeacceptedapp.com/
https://nexiobit.com/a2p-10dlc-for-medical-spas/
https://textbolt.com/blog/10dlc-compliance/
