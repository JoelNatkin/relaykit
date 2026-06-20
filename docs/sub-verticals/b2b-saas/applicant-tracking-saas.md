## Applicant tracking / recruiting platforms
**Vertical:** B2B SaaS & developer tooling
**Bucket:** Conditional
**URL slug:** /for/applicant-tracking-saas

### What this builder is making
A "Greenhouse-for-X" applicant tracking system: software that moves candidates through a defined hiring pipeline (applied → screened → interviewed → offer → hired/rejected), centralizing applications, interview scheduling, and recruiter-candidate communication. The builder's customers are employers and their recruiters, but the message recipients are job candidates. Distinct from recruiting-agency operations software — this is the SaaS platform that hosts the pipeline, not an agency's own outbound desk.

### Why they need SMS
The moment is a stage transition a candidate is anxiously waiting on — interview confirmed, interview tomorrow, "you're moving forward," offer extended. The consequence of missing it is a no-show interview or a stalled top candidate who takes another offer, which is the platform's core conversion metric (time-to-hire, interview no-show rate). SMS wins because candidates ignore recruiting email but reliably read texts, and interview reminders measurably cut no-shows.

### Message categories
1. appointments — interview scheduling is the workflow heart: confirmation, day-before and hour-before reminders, reschedule, cancellation, and no-show follow-up map directly onto interviews.
2. account-events — candidate-account lifecycle on the careers portal (new-device sign-in, suspended) and the verification-adjacent signup moment.
3. verification — phone-ownership proof when a candidate creates a portal account or claims an application.
4. waitlist — "talent pool"/silver-medalist queueing where a candidate is held for a future req; position/availability semantics fit loosely (Stretch territory).
Excluded: order-updates (no physical fulfillment), marketing (cold candidate outreach is exactly the prohibited pattern — EIN-gated promo consent does not cover recruiting solicitation; keep status texts transactional), community (no member-community surface), team-alerts (internal ops, not candidate-facing), customer-support (candidate is not a support ticket).

### Workflows

**Interview scheduling and reminders**
Get the candidate booked, confirmed, and present for a scheduled interview.
Sequence:
1. appointments:confirmation — "Interview confirmed" — sent when an interview slot is booked
2. appointments:reminder-distant — "Interview tomorrow" — day-before nudge with reschedule link
3. appointments:reminder-proximate — "Interview in 1 hour" — final no-show guard
4. appointments:reschedule-confirmation — "Interview moved" — when the slot changes
5. appointments:cancellation-confirmation — "Interview cancelled" — when the interview is called off
6. appointments:no-show-follow-up — "We missed you — rebook?" — recover a candidate who missed
7. appointments:post-appointment — "Thanks — feedback" — post-interview pulse (Stretch: candidate-experience survey, not provider feedback)
Variable aliases (only where default feels wrong):
- provider_name: "Maria Chen (Hiring Manager)" — the interviewer, not a clinician
- appointment_time: "Thu Jun 25, 2:00pm (video)"
- feedback_link: candidate-experience survey URL

**Application and pipeline status progression**
Keep the candidate informed as they move (or don't) through hiring stages.
Sequence:
1. GAP:application-received — "Application received" — acknowledge a submitted application
2. GAP:status-advanced — "You're moving forward" — candidate advanced to the next stage
3. GAP:action-needed — "Next step needed" — assessment/availability/documents requested with link
4. GAP:not-moving-forward — "Update on your application" — respectful rejection notice
Variable aliases (only where default feels wrong):
- (uses new variables below)

**Offer stage**
Surface the time-sensitive offer the moment it's extended.
Sequence:
1. GAP:offer-extended — "Offer ready" — notify candidate an offer is available to review/sign
Variable aliases:
- (uses new variables below)

**Candidate portal account**
Stand up and secure the candidate's careers-portal login.
Sequence:
1. verification:verification-code — "Verification code" — phone-ownership proof at portal signup
2. account-events:new-device-sign-in — "New sign-in" — portal accessed from a new device
Variable aliases (only where default feels wrong):
- workspace_name / business_name: the careers-site brand (e.g. "Acme Careers")

**Talent-pool hold** (Stretch)
Hold a strong-but-not-now candidate for a future opening.
Sequence:
1. waitlist:joined — "Added to talent pool" — Stretch: queue framing applied to candidate pool
2. waitlist:your-turn — "A matching role opened" — Stretch: spot-open framing applied to a new req
Variable aliases (only where default feels wrong):
- claim_link: link to the newly-opened requisition

### Message gaps

**GAP:application-received**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (recruiting status set)
- **Proposed universal name:** Application received | "Application received"
- **Why:** Acknowledging a submitted application has no corpus analog; order-confirmed is fulfillment-shaped, not candidacy-shaped.
- **Draft variants:**
  - Standard: `{{workspace_name}}: We received your application for {{job_title}}. We'll be in touch with next steps. Reply STOP to opt out.`
  - Friendly: `Thanks for applying to {{job_title}} at {{workspace_name}} — we've got your application and will be in touch. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Application received for {{job_title}}. STOP to opt out.`
- **New variables:** {{job_title}}

**GAP:status-advanced**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (recruiting status set)
- **Proposed universal name:** Moved to next stage | "You're moving forward"
- **Why:** A neutral stage-advance notification is the core ATS event and has no transactional corpus equivalent.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Good news on your {{job_title}} application — you're moving to {{next_stage}}. Details: {{status_link}} Reply STOP to opt out.`
  - Friendly: `Update from {{workspace_name}}: your {{job_title}} application is moving forward to {{next_stage}}. More here: {{status_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{job_title}} advanced to {{next_stage}}. {{status_link}} STOP to opt out.`
- **New variables:** {{next_stage}}, {{status_link}}

**GAP:action-needed**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (recruiting status set)
- **Proposed universal name:** Next step needed | "Action needed"
- **Why:** Candidate-side tasks (assessment, availability, documents) are a distinct prompt; no corpus message asks a recipient to complete a gated hiring step.
- **Draft variants:**
  - Standard: `{{workspace_name}}: One step left on your {{job_title}} application — {{action_needed}}. Complete it: {{status_link}} Reply STOP to opt out.`
  - Friendly: `Quick step on your {{job_title}} application at {{workspace_name}}: {{action_needed}}. Here: {{status_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{job_title}} needs {{action_needed}}. {{status_link}} STOP to opt out.`
- **New variables:** {{action_needed}}

**GAP:offer-extended**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (recruiting status set)
- **Proposed universal name:** Offer ready | "Offer ready"
- **Why:** The offer moment is the highest-stakes candidate notification and has no corpus home; it is not promotional and must stay transactional.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your offer for {{job_title}} is ready to review. See it here: {{status_link}} Reply STOP to opt out.`
  - Friendly: `Great news from {{workspace_name}} — your {{job_title}} offer is ready. Review it here: {{status_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{job_title}} offer ready. {{status_link}} STOP to opt out.`
- **New variables:** none

**GAP:not-moving-forward**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (recruiting status set)
- **Proposed universal name:** Not moving forward | "Application update"
- **Why:** A respectful rejection is a real, frequent candidate text with EEOC-adjacent language sensitivity; no neutral "closed without success" corpus message exists.
- **Draft variants:**
  - Standard: `{{workspace_name}}: An update on your {{job_title}} application — we won't be moving forward this time. Thank you for applying. Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: Thank you for your interest in {{job_title}}. We won't be moving forward, but we appreciate your time. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{job_title}} — not moving forward. Thank you. STOP to opt out.`
- **New variables:** none

**STRETCH:appointments:post-appointment**
- **Classification:** Stretch
- **Proposed corpus home:** stretch — appointments:post-appointment used for candidate-experience feedback; fit gap is "feedback on {{provider_name}}" frames the interviewer as a service provider rather than the process.
- **Proposed universal name:** Post-interview pulse | "How was your interview?"
- **Why:** Works for a candidate-experience survey but the provider-feedback framing reads oddly for an interview panel.

**STRETCH:waitlist:joined**
- **Classification:** Stretch
- **Proposed corpus home:** stretch — waitlist:joined reused for talent-pool/silver-medalist holds; fit gap is queue/"your turn" semantics imply a first-come ordering, whereas talent-pool selection is req-match-based, not positional.
- **Proposed universal name:** Added to talent pool | "Added to talent pool"
- **Why:** Captures the "held for later" moment but the positional-queue language misrepresents how candidates are actually pulled from a pool.

### Content constraints
- Candidate consent must be captured at application/career-page/event — not cold-acquired; cold recruiting texts violate CTIA/carrier policy and TCPA regardless of delivery method (autodialer rules still apply to recruiting even where DNC does not).
- TCPA exposure is $500–$1,500 per message with no cap; high-volume unconsented sends are the core risk.
- Use a separate, specific SMS opt-in checkbox ("I consent to SMS about job opportunities and interview scheduling") distinct from the application submit action.
- Register the 10DLC use case to match recruiting status/scheduling consent; status texts are transactional (ACCOUNT_NOTIFICATION-style), never MARKETING — do not route candidate solicitation through the marketing category.
- EEOC-adjacent language hygiene: rejection and status texts must stay neutral and non-discriminatory; no references to protected characteristics, no implied reasons.
- No aggressive outreach cadence — 2–4 candidate texts/week max before opt-outs spike; honor STOP immediately.
- Identify the employer/brand in every message and disclose message frequency at opt-in.

### Disambiguation
ATS software (this entry) is the SaaS product that hosts an employer's hiring pipeline; the builder's customer is the employer and the recipient is a candidate who applied to a known req, so consent is naturally captured at application. Recruiting-agency operations software is a different product shape: an agency's outbound desk works passive, often un-opted-in candidates, where cold-outreach and aggressive-cadence risk is much higher and a marketing-consent posture may creep in. The distinction matters for RelayKit because the ATS pattern is cleanly transactional (status + scheduling on consented applicants) and qualifies under standard eligibility, whereas agency outbound sourcing trends toward prohibited cold-solicitation patterns. Keep this entry scoped to applicant-tracking platforms where the candidate has affirmatively applied or opted in.

### Sources
https://www.greenhouse.com/
https://www.selectsoftwarereviews.com/buyer-guide/applicant-tracking-systems
https://www.selectsoftwarereviews.com/blog/lever-vs-greenhouse
https://textellent.com/blog/texting-platforms-for-recruiting/
https://gohire.com/text-recruiting-software/
https://goodtime.io/products/hire/text-recruiting/
https://www.textline.com/blog/text-recruiting-templates
https://emitrr.com/blog/recruiting-text-templates/
https://textus.com/blog/101-text-message-templates-for-sales-and-recruiting-professionals
https://gohire.com/text-recruiting-tcpa-compliance/
https://www.text-em-all.com/blog/cold-recruiting-texts-violation-blocked
https://www.sensehq.com/blog/candidate-text-messaging-best-practices-for-compliance-deliverability-and-engagement
https://mytcrplus.com/solutions/staffing-recruiting-messaging-compliance/
https://www.socialtalent.com/glossary/pipeline-stage
