## Health condition management (consumer, non-clinical framing)
**Vertical:** Healthcare
**Bucket:** Not yet, maybe not ever
**URL slug:** /for/health-condition-management
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.

### What this builder is making
Consumer apps that help a person manage one specific health condition — diabetes/glucose coaching (Lark, mySugr, Glucose Buddy, GluCoach), fertility and cycle tracking (Flo, Clue, Glow, Femometer), or chronic-condition support like hypertension/blood-pressure programs (Mango Health, Blood Pressure Companion). The core loop is the same across all three: the user logs data (a reading, a symptom, a daily entry), the app nudges them to keep logging and acting, and a coach or algorithm responds. The builder frames this as informational, consumer-wellness self-management — explicitly not diagnosis or treatment — but the app is organized around a named medical condition, and that association is the case-by-case risk.

### Why they need SMS
The whole program depends on a daily habit — a glucose log, a cycle entry, a BP reading, a coach reply — and the moment that habit lapses, the user stops getting value and churns off a condition program they signed up for help with. Push notifications get muted or the app gets deleted; SMS reaches the user where a one-tap reminder actually lands. The bodies must carry the nudge without ever naming the condition, because associating a phone number with diabetes or fertility is itself health data.

### Message categories
1. appointments — best fit for recurring check-in/log nudges and reschedules; reminder cadence maps cleanly to daily/scheduled logging prompts (condition stripped from body)
2. customer-support — coach replies and proactive outreach when the app detects a stalled streak map to ticket/agent and proactive-outreach shapes
3. account-events — billing, trial, and lifecycle for the subscription wrapper around the program
4. community — group cohorts and peer-support programs (challenges, milestones) common in these apps
5. verification — phone-ownership at signup; 2FA carve-out, no condition association
Excluded: marketing (promo requires separate EIN-gated consent and a condition app must keep nudges strictly transactional — see constraints), order-updates (no physical fulfillment in the core loop), team-alerts (no operational/on-call surface), waitlist (not the engagement model)

### Workflows

**Daily log / check-in nudge**
Reminds the user to record today's entry without naming what they're tracking.
Sequence:
1. appointments:reminder-proximate — "Time to log today" — fires at the user's chosen daily window; generic "time for your check-in" + link, no provider, no condition
2. appointments:reminder-distant — "Tomorrow's check-in" — optional day-ahead nudge for users on a scheduled (non-daily) cadence
3. customer-support:proactive-outreach — "Streak stalled" — fires when the app detects a missed window or a broken logging streak; offers a hand, names nothing
Variable aliases (only where default feels wrong):
- provider_name: omit — no provider in a self-log nudge; use generic "your check-in"

**Coach message thread**
Notifies the user their coach has replied and routes them into the authenticated app.
Sequence:
1. customer-support:agent-assigned — "Your coach is on it" — sent when a coach picks up the user's question
2. customer-support:agent-response — "Your coach replied" — sent when the coach replies; body is a notification only, the message content lives behind the link
3. customer-support:resolution-notification — "Wrapped up" — sent when a coaching thread is closed
Variable aliases (only where default feels wrong):
- agent_name: "your coach"
- ticket_number: omit where possible — a coaching thread shouldn't read like a support ticket

**Adherence / routine reminder**
Prompts the user toward the recurring action the program is built around (logging, a reading, a routine step) without describing it.
Sequence:
1. appointments:reminder-proximate — "Time for your reading" — generic action nudge at the scheduled moment; link into app
2. customer-support:proactive-outreach — "Falling behind?" — re-engagement when adherence drops, factual, condition-free
Variable aliases (only where default feels wrong):
- provider_name: omit

**Program lifecycle (subscription wrapper)**
Keeps the user's paid program active and billing healthy.
Sequence:
1. account-events:trial-ending — "Trial ending" — standard, no condition reference
2. account-events:payment-failed — "Card declined" — standard
3. account-events:subscription-confirmed — "You're set" — standard

**Phone verification at signup**
Proves phone ownership before the program starts.
Sequence:
1. verification:verification-code — "Your code" — 2FA carve-out; no STOP/HELP, no condition

### Message gaps

**GAP:condition-free-log-nudge**
- **Classification:** Universal miss
- **Proposed corpus home:** appointments:log-reminder (or sub-vertical registry layer as a display-alias over reminder-proximate)
- **Proposed universal name:** Log reminder / check-in nudge
- **Why:** appointments:reminder-proximate assumes a provider appointment with a person and time; a daily self-log nudge has neither and must scrub the condition — a recurring self-action reminder is a distinct, reusable shape across health, habit, and wellness apps
- **Draft variants:**
  - Standard: `{{workspace_name}}: time for today's check-in. Log it here: {{action_link}} Reply STOP to opt out.`
  - Friendly: `Quick one from {{workspace_name}} — time for today's check-in: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: time to check in. {{action_link}} STOP to opt out.`
- **New variables:** none — reuses action_link
- **Status:** FUTURE — do not add to corpus until bucket changes.

**STRETCH:customer-support:agent-response**
- **Classification:** Stretch
- **Proposed corpus home:** customer-support:agent-response, used as the coach-reply notifier
- **Proposed universal name:** Coach replied (display alias over agent-response)
- **Why:** agent-response is framed as a support-ticket reply with a ticket_number; a coaching message is the same notification shape (someone replied, content behind a link) but "ticket" reads wrong for a health-coaching relationship, so it fits the mechanic but not the register
- **Draft variants:**
  - Standard: `{{workspace_name}}: your coach replied. Read it here: {{action_link}} Reply STOP to opt out.`
  - Friendly: `Good news from {{workspace_name}} — your coach got back to you: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: your coach replied. {{action_link}} STOP to opt out.`
- **New variables:** none
- **Status:** FUTURE — do not add to corpus until bucket changes.

### Content constraints
- Vet every campaign in this sub-vertical case-by-case: informational/self-management framing is NOT diagnostic, but organizing an app around a named medical condition makes the audience-condition association sensitive on its own.
- Never name the condition in any body. Associating a phone number with diabetes, fertility, hypertension, or any condition is health data — keep nudges generic ("time for your check-in," "your coach replied") with the substance behind an authenticated link.
- No diagnostic claims, no medical advice, no health-outcome or result guarantees in any message.
- Carriers apply heightened scrutiny to medical terminology — prescription, lab, diagnosis, and condition words can trip fraud/phishing filters and cause blocking; keep bodies clinically empty.
- FTC Health Breach Notification Rule (in effect July 29, 2024) covers non-HIPAA consumer health apps — a breach of identifiable health info carries FTC/consumer notification duties; this is the dev's obligation but informs why we keep PHI out of the SMS channel entirely.
- This is consumer/non-covered, so no BAA and no PHI through the proxy — but that does not lower the case-by-case bar; the condition-association risk persists regardless of HIPAA status.
- Coaching and log nudges are transactional (account-notification shape); any promotional content requires separate explicit marketing consent and is EIN-gated — keep the two lanes apart.
- Verification 2FA carve-out: no STOP/HELP, no condition reference, code only.

### Disambiguation
A general habit, fitness, or wellness app — step counts, water intake, a generic streak tracker — is Clear: there's no medical condition organizing the product. The line is crossed the moment the app is built around managing a NAMED medical condition (diabetes, fertility, hypertension), at which point the audience itself carries health-data sensitivity even when every message is "just informational." This is also distinct from clinical-care apps, which are covered entities operating under HIPAA with a BAA gate and PHI handling; a consumer condition app is non-covered, but that means it lands in case-by-case vetting rather than a clean yes. The trap a dev falls into: "we only send tips and reminders, never diagnoses" — but the risk isn't the diagnosis, it's that the message links a person to the condition at all, which is why bodies must stay condition-free and every campaign gets individually reviewed.

### Sources
https://www.lark.com/resources/diabetes-coaching-app
https://glucoach.com/
https://diatribe.org/diabetes-technology/mobile-coaching-services
https://flo.health/
https://www.ccrmivf.com/news/11-best-period-tracker-apps-to-know-your-cycle-according-to-obgyns/
https://www.plannedparenthooddirect.org/spot-on-period-tracker
https://calciumhealth.com/mobile-health-apps-empowering-patients-with-chronic-conditions/
https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5957057/
https://www.ftc.gov/news-events/news/press-releases/2024/04/ftc-finalizes-changes-health-breach-notification-rule
https://www.ftc.gov/business-guidance/blog/2024/04/updated-ftc-health-breach-notification-rule-puts-new-provisions-place-protect-users-health-apps
https://www.alston.com/en/insights/publications/2024/08/ftc-updated-health-breach-notification-rule
https://mytcrplus.com/solutions/healthcare-telehealth-messaging-compliance/
https://www.hipaavault.com/resources/hipaa-compliant-hosting-insights/can-text-messages-be-hipaa-compliant/
https://voipdocs.io/sms-mms/10dlc-vetting-rejection-reasons
