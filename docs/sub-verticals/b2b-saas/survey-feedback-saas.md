## Survey / feedback collection SaaS
**Vertical:** B2B SaaS & developer tooling
**Bucket:** Clear
**URL slug:** /for/survey-feedback-saas

### What this builder is making
A "Typeform-for-X" platform that lets businesses author surveys, polls, NPS/CSAT/CES forms, and feedback widgets, then distribute them to an audience and collect structured responses. The product's core job is getting a survey link in front of a consented respondent at the right moment (post-purchase, post-support, post-onboarding, periodic pulse) and chasing non-responders until the response rate is acceptable. Representative products: Typeform, SurveyMonkey, Qualtrics, Delighted, SurveySparrow, Zonka Feedback.

### Why they need SMS
The moment is the response-rate window: a survey invitation emailed lands in an inbox that may never open, while a texted link gets read in minutes and reaches respondents whose email the business doesn't even have. Low response rates are the existential failure mode of every feedback program — a survey nobody answers is worthless data. SMS wins because it is the only channel that reliably reaches the respondent at the moment of fresh experience (right after the ticket, the purchase, the visit) and supports a single timed reminder that recovers the silent majority.

### Message categories
1. **customer-support** — the CSAT follow-up is the canonical survey-pull message: a rating request fired at a lifecycle event with a link, exactly the survey-invitation shape these platforms send.
2. **appointments** — the post-appointment feedback message is the second survey-trigger pattern (post-event feedback request with link), reusable as a generic experience survey.
3. **account-events** — the builder is itself a SaaS; billing, trial, and security lifecycle messages serve the platform's own customer relationship (the survey-builder's account holders), not respondents.
4. **verification** — phone-ownership proof at the survey-builder's own signup.
Excluded: marketing (survey-pull is transactional consent, not promotional — see Disambiguation; a survey link is never a promotional push), order-updates (no physical fulfillment), team-alerts (no incident/on-call surface), community (no member community), waitlist (no queue).

### Workflows

**Trigger-based survey invitation**
Fire a survey link the moment a tracked lifecycle event completes (ticket closed, order delivered, visit ended, onboarding milestone hit).
Sequence:
1. customer-support:csat-follow-up — "Survey invitation" — texts the survey/rating link at the trigger event
Variable aliases (only where default feels wrong):
- ticket_number: "your recent visit" / "order #4821" (the experience being rated, not always a ticket)
- csat_link: "survey.acme.co/r/8fa2"

**Post-experience feedback request**
Collect open feedback after a discrete experience rather than a support ticket.
Sequence:
1. appointments:post-appointment — "Feedback request" — texts the feedback link after the experience
Variable aliases (only where default feels wrong):
- provider_name: "our team" / "your session"
- feedback_link: "survey.acme.co/f/2b91"

**Non-responder reminder**
A single timed nudge (typically 24-48h) to respondents who received the invitation but have not yet answered — the response-rate recovery step every platform automates.
Sequence:
1. GAP:survey-reminder — "Survey reminder" — re-sends the link to non-responders once
Variable aliases (only where default feels wrong):
- survey_link: "survey.acme.co/r/8fa2"

### Message gaps

**GAP:survey-reminder**
- **Classification:** Vertical-specific
- **Proposed corpus home:** customer-support:survey-reminder (or a dedicated feedback category if one is later added)
- **Proposed universal name:** survey reminder | "Survey reminder"
- **Why:** the single non-responder nudge is the defining survey-platform workflow and the corpus has no "you haven't answered yet" re-send; CSAT follow-up is the first-touch, not the reminder.
- **Draft variants:**
  - Standard: `{{workspace_name}}: a quick reminder - we'd still value your feedback. It takes a minute: {{survey_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: still hoping to hear from you. Your feedback only takes a minute: {{survey_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: your feedback, 1 min: {{survey_link}} STOP to opt out.`
- **New variables:** survey_link (the survey/form URL; distinct from csat_link and feedback_link only in naming)

**STRETCH:customer-support:csat-follow-up**
- **Classification:** Stretch
- **Proposed corpus home:** stretch: csat-follow-up reused as a generic survey invitation; fit gap is framing — it is hard-scoped to "ticket {{ticket_number}}" and "rate here," which reads as support-CSAT, not a neutral survey/poll/NPS invite for non-support contexts.
- **Proposed universal name:** survey invitation | "Survey invitation"
- **Why:** survey platforms send invitations off many triggers (purchase, onboarding, periodic pulse), not just resolved tickets; the ticket framing forces awkward variable aliasing.
- **Draft variants:**
  - Standard: `{{workspace_name}}: you've got a short survey waiting - it takes about a minute: {{survey_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: we'd love your input. A quick survey, about a minute: {{survey_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: quick survey, 1 min: {{survey_link}} STOP to opt out.`
- **New variables:** survey_link

### Content constraints
- Survey-pull from a consented audience is transactional/informational, not marketing — but only while the message stays purely a feedback request.
- A survey invitation that carries any incentive ("answer and get 20% off") reclassifies as promotional, requiring marketing-grade prior express written consent and an EIN-gated MARKETING campaign — keep incentives out of these bodies.
- No promotional content, no offers, no cross-sell in any survey body; the link must point to the survey/form, not a storefront.
- Single timed reminder is industry norm; repeated nudges to non-responders read as harassment and invite opt-outs.
- Standard carrier rules otherwise apply (STOP/HELP, 10DLC registration).

### Disambiguation
Survey-pull is collecting feedback from an audience that has consented to the relationship (a customer, a respondent who opted in to be surveyed) and is treated as transactional — it informs the business, it does not sell to the recipient. This is distinct from marketing-automation push-engagement, where the message exists to drive a purchase or re-activation. The line to the marketing category is crossed the moment the survey carries an incentive, a promotion, or doubles as a re-engagement campaign: at that point it needs the higher prior-express-written-consent standard and the EIN-gated MARKETING TCR use case, not the transactional consent that covers a plain feedback request. Practically: a bare "tell us how we did, here's the link" stays in customer-support/account-notification territory; "tell us how we did and here's 20% off" is marketing.

### Sources
https://www.questionpro.com/sms-survey-software.html
https://www.qualtrics.com/support/survey-platform/distributions-module/mobile-distributions/sms-surveys/
https://www.surveymonkey.com/product/features/sms-surveys/
https://www.zonkafeedback.com/blog/best-sms-survey-software
https://delighted.com/blog/introducing-web-and-sms
https://www.surveymonkey.com/curiosity/automate-sms-survey-invites-salesforce-integration/
https://www.theysaid.io/blog/best-surveymonkey-alternatives
https://www.infobip.com/blog/tcpa-compliance-sms
https://www.salesmessage.com/blog/sms-marketing-compliance
https://textbolt.com/blog/10dlc-compliance/
