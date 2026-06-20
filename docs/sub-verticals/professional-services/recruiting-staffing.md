## Recruiting / staffing agencies
**Vertical:** Professional services
**Bucket:** Conditional
**URL slug:** /for/recruiting-staffing

### What this builder is making
A recruiter CRM / staffing-ops tool — TextUs/Recruit CRM/Ceipal/Bullhorn-style — that runs an agency's candidate pipeline and placement workflow: a candidate database with stage tracking, interview scheduling against client requisitions, offer and onboarding-document handling, and (for temp/staffing desks) shift dispatch and assignment management. The SMS recipients are candidates and placed workers who have an existing relationship with the agency — applied, registered, or opted in — receiving interview logistics, application-status updates, offer/onboarding steps, and shift assignments. It is operational and logistics-driven, addressed only to people the agency already has consent from, not cold-sourced prospects.

### Why they need SMS
A scheduled interview or a same-day shift is the unit of revenue for a staffing desk, and a no-show is a placement lost and a client relationship dented that rarely refills cleanly — a texted reminder reads in seconds where an email is buried, and agencies report 30-50% time-to-fill reductions on high-volume roles when they move logistics to SMS. The other decisive moment is the urgent shift fill: when a temp drops out hours before a shift, a broadcast text to qualified, opted-in workers is the only channel fast enough to backfill before the client notices. SMS wins because candidates explicitly prefer text for transactional confirmations — they will reply to a time slot between meetings where they would let a recruiter's call go to voicemail.

### Message categories
1. appointments — interview scheduling (confirmation + day-before/day-of reminders + reschedule + no-show) is the highest-volume, highest-value candidate flow on the desk.
2. team-alerts — shift dispatch for temp/staffing placement (shift scheduled, reminder, change, cancellation, start/check-in) — placed workers managed as a shift-based workforce.
3. account-events — the recruiter's own subscription lifecycle on the CRM (card declined, trial ending, renewal confirmed) — the builder's own paying customer.
4. verification — phone-ownership at recruiter signup and candidate registration, plus step-up before a sensitive change.
5. customer-support — portal/ticket and service-status alerts to the recruiter using the product.
Excluded: order-updates (no physical fulfillment), community (no community surface in an agency-to-candidate model), waitlist (candidates aren't a queued availability list — pipeline stages are tracked in the CRM, not surfaced as queue-position texts), marketing (transactional logistics tool; promotional/recruiting-blast outreach needs separate EIN-gated consent and is the deferred-tier abuse profile this sub-vertical is explicitly gated against).

### Workflows

**Interview scheduling (candidates)**
Get candidates confirmed for and showing up to client interviews — the placement-critical flow.
Sequence:
1. appointments:confirmation — "Interview confirmed" — interview booked with the client/hiring manager; time and location.
2. appointments:reminder-distant — "Interview tomorrow" — sent the day before.
3. appointments:reminder-proximate — "Interview in 1 hour" — sent about an hour before; the highest no-show-prevention message.
4. appointments:reschedule-confirmation — "Interview moved" — candidate or client reschedules.
5. appointments:cancellation-confirmation — "Interview cancelled" — with a rebook link.
6. appointments:no-show-follow-up — "We missed you" — after a missed interview, prompt to rebook.
7. appointments:post-appointment — "How did it go?" — post-interview check-in / next-step nudge.
Variable aliases (only where default feels wrong):
- provider_name: "Acme Corp hiring team" (the client/interviewer, not a clinical "provider")
- appointment_time: "Thu Jun 25, 2:00 PM"
- workspace_name: "Bright Staffing" (the agency's own name as the candidate sees it, not the CRM brand)

**Application status updates (candidates)**
Keep candidates informed as they move through pipeline stages so they stay warm and don't drop out.
Sequence:
1. GAP:application-received — "Application received" — confirmation the agency received the candidate's application/registration (see gaps).
2. GAP:application-status-update — "Status update" — candidate advances a stage (shortlisted, submitted to client, under review) (see gaps).
3. GAP:application-not-moving-forward — "Update on your application" — candidate is not progressing for this role; neutral, EEOC-safe close (see gaps).
Variable aliases (only where default feels wrong):
- workspace_name: "Bright Staffing"

**Offer & onboarding (candidates)**
Move an accepted candidate from offer to a started placement without losing them in paperwork.
Sequence:
1. GAP:offer-extended — "Offer ready" — offer issued; link to review details (see gaps).
2. GAP:onboarding-step — "Onboarding step" — a document (tax form, I-9, handbook) or task needs completion before start (see gaps).
3. GAP:start-date-confirmed — "Start date set" — first-day logistics confirmed (date, time, location, who to ask for) (see gaps).
Variable aliases (only where default feels wrong):
- workspace_name: "Bright Staffing"

**Shift dispatch & assignment (placed temp/staffing workers)**
Assign, remind, and adjust shifts for a placed temp workforce — the staffing-desk operations spine.
Sequence:
1. team-alerts:shift-scheduled — "Shift assigned" — worker is assigned a shift at a client site.
2. team-alerts:shift-reminder — "Shift reminder" — ahead of shift start.
3. team-alerts:shift-change — "Shift changed" — time, location, or role moved.
4. team-alerts:shift-cancellation — "Shift cancelled" — client cancels the shift.
5. team-alerts:shift-start — "Shift starting / check in" — at shift start, optional check-in action.
Variable aliases (only where default feels wrong):
- workspace_name: "Bright Staffing"
- location: "Acme Corp warehouse, 400 5th Ave"
- role: "Forklift operator"

**Urgent shift fill (placed temp/staffing workers)**
Backfill a dropped shift fast by paging qualified, opted-in workers and confirming who can take it.
Sequence:
1. GAP:open-shift-offer — "Shift available" — an open/urgent shift is offered to eligible opted-in workers; reply to claim (see gaps).
2. team-alerts:shift-scheduled — "Shift confirmed" — the claiming worker is assigned the now-filled shift.
Variable aliases (only where default feels wrong):
- workspace_name: "Bright Staffing"
- location: "Acme Corp warehouse, 400 5th Ave"

**Recruiter subscription lifecycle (the builder's own paying customer)**
Keep the recruiter's CRM subscription active and informed.
Sequence:
1. account-events:payment-failed — "Card declined" — recruiter's card for the CRM is declined; prompt to update before suspension.
2. account-events:trial-ending — "Trial ending" — sent a few days before the recruiter's trial lapses.
3. account-events:subscription-confirmed — "Subscription updated" — renewal, upgrade, or plan change goes through.
4. account-events:new-device-sign-in — "New sign-in" — recruiter's account accessed from a new device.
Variable aliases (only where default feels wrong): none — `{{workspace_name}}` here is the CRM product's name.

**Recruiter & candidate identity verification**
Prove phone ownership at recruiter signup and candidate registration, and gate sensitive changes.
Sequence:
1. verification:verification-code — "Verification code" — recruiter verifies phone at signup, or candidate verifies phone at registration/opt-in. (No STOP/HELP — 2FA carve-out.)
2. verification:confirmation-code — "Confirmation code" — step-up before changing payout/bank or direct-deposit details. (No STOP/HELP.)
Variable aliases (only where default feels wrong): none.

**Recruiter support & service status**
Keep the recruiter informed when the CRM has an issue or an open ticket.
Sequence:
1. customer-support:ticket-received — "Ticket received" — recruiter logs a support request.
2. customer-support:agent-response — "Reply on your ticket" — agent replies.
3. customer-support:service-status-alert — "Service issue" — the CRM has an outage affecting the recruiter.
Variable aliases (only where default feels wrong): none.

### Message gaps

**GAP:application-received**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:application-received (new) or an applications registry alias
- **Proposed universal name:** Application received / submission confirmed
- **Why:** an "we got your application" acknowledgment is the entry point of every recruiting and intake pipeline, and the corpus has no submission-received notice (customer-support:ticket-received is support-framed, not application-framed).
- **Draft variants:**
  - Standard: `{{workspace_name}}: We received your application. We'll text you with next steps. Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: thanks - your application is in. We'll be in touch with next steps soon. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Application received. We'll be in touch. STOP to opt out.`
- **New variables:** none.

**GAP:application-status-update**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:application-status-update (new) or an applications registry alias
- **Proposed universal name:** Application status update
- **Why:** a stage-advance push ("you've been shortlisted / submitted to the client") is the core pipeline-notification job for recruiting and any application workflow, and no corpus message carries an application-stage change.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Update on your application - {{status}}. Details: {{status_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: good news on your application - {{status}}. More here: {{status_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Application update - {{status}}. {{status_link}} STOP to opt out.`
- **New variables:** `{{status}}` — short stage label, ~30 chars, source: the CRM pipeline stage, example: "submitted to client". `{{status_link}}` — candidate portal/status URL, ~24 chars (shortened), example: "bstf.co/s/8f2".

**GAP:application-not-moving-forward**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (status-close alias)
- **Proposed universal name:** Application closed / not progressing
- **Why:** a neutral "not moving forward for this role" close is recruiting-specific and must stay EEOC-safe (state outcome, no reason implicating a protected class); it has no clean corpus home and needs vertical-controlled wording rather than a universal draft.

**GAP:offer-extended**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:offer-extended (new) or an offers registry alias
- **Proposed universal name:** Offer ready / offer extended
- **Why:** an "your offer is ready to review" notice is shared by recruiting, lending, and any approval-to-acceptance flow, and the corpus has no offer-delivery message.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your offer is ready to review. View and respond here: {{offer_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: exciting - your offer is ready. Have a look and let us know: {{offer_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Offer ready. Review: {{offer_link}} STOP to opt out.`
- **New variables:** `{{offer_link}}` — offer-review page URL, ~24 chars (shortened), source: the CRM offer module, example: "bstf.co/o/8f2".

**GAP:onboarding-step**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:onboarding-step (new) or an onboarding registry alias
- **Proposed universal name:** Onboarding step / document needed
- **Why:** a "this paperwork/task is due before you start" nudge recurs across recruiting onboarding, account setup, and any multi-step activation, and the corpus has no pre-start task reminder.
- **Draft variants:**
  - Standard: `{{workspace_name}}: One step before your start - {{step}}. Complete it here: {{onboarding_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: almost set - just need {{step}} before day one. Here: {{onboarding_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: To-do before start - {{step}}. {{onboarding_link}} STOP to opt out.`
- **New variables:** `{{step}}` — short task label, ~28 chars, source: the onboarding checklist, example: "sign your I-9". `{{onboarding_link}}` — onboarding portal URL, ~24 chars, example: "bstf.co/on/8f2".

**GAP:start-date-confirmed**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (first-day-logistics alias)
- **Proposed universal name:** Start date / first-day details confirmed
- **Why:** a first-day logistics confirmation (date, time, site, who to ask for) is placement-specific and overlaps the appointments and team-alerts shapes without matching either; it belongs as a recruiting alias rather than a new universal message.

**GAP:open-shift-offer**
- **Classification:** Universal miss
- **Proposed corpus home:** team-alerts:open-shift-offer (new) or a shift registry alias
- **Proposed universal name:** Open shift available / claim a shift
- **Why:** an "open shift, reply to claim" broadcast is the urgent-fill backbone for staffing, gig, and shift-based workforces, and the corpus team-alerts shift lifecycle assigns and changes shifts but never offers an unclaimed one for pickup.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Open shift {{shift_date}} {{shift_time}} at {{location}}. Reply YES to claim. Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: a shift just opened - {{shift_date}} {{shift_time}}, {{location}}. Reply YES to grab it. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Open shift {{shift_date}} {{shift_time}}, {{location}}. Reply YES. STOP to opt out.`
- **New variables:** none (reuses `{{shift_date}}`, `{{shift_time}}`, `{{location}}` from team-alerts).

### Content constraints
- This is a CONDITIONAL bucket: SMS is allowed only to candidates and workers with an existing relationship who consented — applied, registered, or explicitly opted in. Cold-sourced prospects from purchased lists or scraped profiles are out of scope (aggressive-outreach / TCPA problem) and are the abuse pattern this sub-vertical is gated against.
- Implied or stale consent is insufficient: a years-old application does not authorize ongoing texts. The builder must scope messaging to active, recently-consented candidates and honor STOP immediately.
- Keep bodies to logistics only: interview scheduling, application status, offer/onboarding steps, and shift dispatch. No recruiting-blast or promotional content rides on these flows — that is separate, EIN-gated marketing consent.
- EEOC-sensitive content hygiene: no questions or statements implicating a protected class (age, race, sex, religion, national origin, disability, etc.). Status and rejection messages state the outcome and a link only — never a reason that could read as discriminatory.
- Respect quiet hours (8am-9pm recipient local time); high-volume shift broadcasts especially must not text outside that window.
- Candidates are a downstream audience: the builder must ensure each agency collects opt-in from its own candidates/workers before texting them, distinct from the recruiter's own CRM-subscription consent.

### Disambiguation
This is the agency-side recruiter CRM / staffing-ops tool texting its own consented candidates and placed workers, not an ATS sold to employers (that is B2B SaaS bought by hiring companies — a different vertical) and not a cold-recruiting outreach engine (bulk texting scraped or purchased prospect lists is the deferred-tier abuse profile this entry is explicitly gated against). The tip from Conditional to out-of-scope is the recipient relationship: an opted-in applicant getting an interview reminder is Clear-adjacent; the same tool blasting sourced LinkedIn profiles who never opted in crosses into prohibited cold outreach regardless of how transactional the body reads. It neighbors generic appointment-reminder and shift-scheduling SaaS, which share the appointments and team-alerts shapes but lack the consent-gated candidate-pipeline spine. What looks allowed but isn't: a "great candidates wanted, refer a friend for $X" line appended to a status update — that converts a transactional logistics message into a recruiting promotion and breaks the gating.

### Sources
https://textus.com/industries/staffing
https://recruitbpm.com/blog/text-recruiting-hacks-20-free-scripts-guide
https://www.heymarket.com/sms-for-recruitment/
https://recruitcrm.io/blogs/sms-staffing-guide/
https://gohire.com/text-messaging-for-staffing-agencies-the-complete-guide/
https://text-em-all.com/seasonal-staffing-playbook
https://www.textrequest.com/playbooks/staffing-and-recruiting
https://www.text-em-all.com/blog/sms-compliance-for-staffing-agency
https://completesms.com/industries/staffing-agency/
https://www.ceipal.com/recruitment-crm/text-recruiting
