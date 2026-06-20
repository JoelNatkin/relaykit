## Nutrition / meal planning (non-clinical)
**Vertical:** Healthcare
**Bucket:** Clear
**URL slug:** /for/nutrition-meal-planning

### What this builder is making
A MyFitnessPal/Lose It/MacroFactor-style consumer app for food and calorie logging, macro tracking, meal planning with recipes, and auto-generated grocery lists — sold as a subscription (typically a free tier plus $5–15/mo premium with a trial). Some add light coaching: a human or AI coach who sends weekly plans and periodic check-ins, plus habit nudges like water, streaks, and "log your dinner." It is general-wellness and non-clinical — habit-and-goal nutrition for the general public, not medical-nutrition-therapy for a diagnosed condition.

### Why they need SMS
The whole product depends on the user logging consistently, and the highest-churn moment is the skipped meal log — a user who stops logging stops opening the app and lapses within days. A timed "log your lunch" nudge, a "your weekly plan is ready" ping, or a coach check-in lands far more reliably as SMS than as a push notification the user has muted or an email they never open. SMS wins here because the action is time-sensitive (log it now, while you remember) and the cost of a missed nudge is a broken streak and a churned subscriber.

### Message categories
1. account-events — primary; subscription, trial, and billing lifecycle is churn-critical for a paid app
2. appointments — recurring logging/check-in reminders and coach sessions map cleanly to the reminder cadence
3. customer-support — ticket lifecycle and proactive friction outreach for a support-bearing app
4. verification — phone-ownership at signup and 2FA
5. marketing — promo/launch only with separate consent (EIN-gated)
Excluded: order-updates (no physical fulfillment in a logging/planning app — meal-KIT delivery is a separate vertical), team-alerts (no operational/on-call surface), community (no member community layer in the core product), waitlist (no queue/scarcity mechanic).

### Workflows

**Subscription & billing lifecycle**
Keep a paid subscriber active through trial, renewal, and payment failure.
Sequence:
1. account-events:trial-ending — "Trial ending" — sent a few days before the free trial converts
2. account-events:payment-failed — "Payment failed" — sent when the card on file is declined
3. account-events:subscription-confirmed — "Subscription confirmed" — sent when a plan starts, changes, or cancels
Variable aliases (only where default feels wrong): none

**Meal-log reminder cadence**
Nudge the user to log a meal before they forget and break the streak.
Sequence:
1. appointments:reminder-proximate — "Time to log lunch" — sent at the user's chosen meal time as a "log it now" nudge
2. GAP:streak-at-risk — "Streak about to break" — sent late in the day when no meals have been logged (see gaps)
Variable aliases (only where default feels wrong):
- provider_name: "your meal log"
- appointment_time: "12:30 PM"

**Weekly plan & grocery list ready**
Tell the user their new meal plan and shopping list are available.
Sequence:
1. GAP:plan-ready — "Your weekly plan is ready" — sent when a new meal plan / grocery list is generated (see gaps)
Variable aliases (only where default feels wrong): none

**Coach check-in**
Run a coach's periodic accountability touch with the client.
Sequence:
1. appointments:confirmation — "Coaching session confirmed" — sent when a coaching call/session is booked
2. appointments:reminder-distant — "Check-in tomorrow" — day-before reminder for the session
3. customer-support:proactive-outreach — "Coach checking in" — sent when the coach (or the app's friction detection) reaches out between sessions
Variable aliases (only where default feels wrong):
- provider_name: "Coach Maya"

**Signup & account security**
Verify the phone at signup and protect the account.
Sequence:
1. verification:verification-code — "Verification code" — phone-ownership proof at signup
2. account-events:new-device-sign-in — "New device sign-in" — sent on access from an unrecognized device
Variable aliases (only where default feels wrong): none

**Support lifecycle**
Move a logged support request to resolution.
Sequence:
1. customer-support:ticket-received — "Ticket received" — request logged
2. customer-support:resolution-notification — "Ticket resolved" — request closed
3. customer-support:csat-follow-up — "Rate our support" — satisfaction follow-up
Variable aliases (only where default feels wrong): none

### Message gaps

**GAP:streak-at-risk**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:streak-at-risk (or appointments registry layer)
- **Proposed universal name:** Streak at risk
- **Why:** habit/streak apps across fitness, language, and nutrition all need a "your streak is about to break" save-the-streak nudge, and no corpus message frames an at-risk recurring habit
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your {{streak_count}}-day streak is about to break. Log today to keep it going: {{action_link}} Reply STOP to opt out.`
  - Friendly: `Don't lose your {{streak_count}}-day streak on {{workspace_name}}! Log a meal today to keep it alive: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{streak_count}}-day streak at risk. Log today: {{action_link}} STOP to opt out.`
- **New variables:** streak_count: "12"

**GAP:plan-ready**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:resource-ready (or appointments registry layer)
- **Proposed universal name:** Resource ready
- **Why:** many apps generate a periodic artifact (meal plan, report, grocery list, summary) and need to tell the user it's available, which no corpus message covers
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your {{resource_name}} is ready. View it here: {{resource_link}} Reply STOP to opt out.`
  - Friendly: `Your new {{resource_name}} from {{workspace_name}} is ready to view: {{resource_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{resource_name}} ready. {{resource_link}} STOP to opt out.`
- **New variables:** resource_name: "weekly meal plan", resource_link: "{{resource_link}}"

### Content constraints
- Standard carrier rules apply — this is a standard-eligibility A2P use case while the product stays general-wellness.
- Keep nudges and coach check-ins framed as transactional account activity (log reminders, plan-ready, session reminders); they ride on the user's account relationship and need no marketing consent.
- Any promotional content — upgrade offers, "go premium," referral pushes — is marketing: route through the marketing category, EIN-gated, with separate explicit consent.
- Avoid guaranteed-outcome claims ("lose 10 lbs," "guaranteed results") in message bodies — outcome promises invite scrutiny and undercut the transactional framing.
- Escalation triggers (move toward Conditional/clinical): medical-nutrition-therapy framing (managing diabetes, renal, or other diagnosed-condition diets), weight-loss-drug (GLP-1) or supplement promotion, or condition-specific clinical coaching.

### Disambiguation
General-wellness nutrition — calorie/macro logging, meal planning, recipes, habit nudges for the general public — is Clear and standard-eligible. It separates from clinical medical-nutrition-therapy (a registered dietitian managing a diagnosed condition's diet, or condition-specific meal protocols for diabetes/renal/cardiac), which reads as healthcare condition management and tips toward Conditional/clinical scrutiny. It also separates from wellness/fitness habit tracking (a workout-and-steps app, even if it mentions food in passing) and, critically, from meal-KIT delivery e-commerce (HelloFresh-style), which ships physical product and is order-updates-led rather than reminder-led. The trap a developer falls into: assuming "it's just nutrition tips" stays Clear when the content is actually condition-specific diet coaching — once the messaging manages a named medical condition, it stops being general wellness and reads clinical.

### Sources
https://support.myfitnesspal.com/hc/en-us/articles/360032622391-Can-you-send-me-a-reminder-if-I-forget-to-log-a-meal
https://www.noom.com/blog/myfitnesspal-vs-loseit-vs-noom/
https://nutrola.app/en/blog/myfitnesspal-vs-noom-vs-lose-it-2026
https://apps.apple.com/us/app/meal-reminder-mealnow/id1510192428
https://www.mysubscriptionaddiction.com/meal-planning-service-apps
https://truecoach.co/blog/top-5-online-nutrition-coaching-platforms-for-coaches/
https://www.trainerize.com/nutrition-coaching/
https://wellness.alibaba.com/nutrition/is-macrofactor-app-free-pricing-trial-guide
https://fortune.com/article/best-nutrition-apps/
