## Home improvement / contractors / remodeling
**Vertical:** Home & local services
**Bucket:** Clear
**URL slug:** /for/home-improvement

### What this builder is making
A contractor operations platform — construction/remodeling CRM, field-service software, or job-management app (Buildertrend / Housecall Pro / Jobber-style) — sold to remodelers, general contractors, roofers, painters, and specialty trades. The product moves a job through a lifecycle (lead → estimate → scheduled → in-progress → inspection → complete → paid) and fires events off the schedule, the client portal, daily logs, change orders, and the invoicing module. It coordinates the contractor's own crew while keeping the homeowner informed about a project happening at their address.

### Why they need SMS
A homeowner has a crew arriving at their house, and the "we're on the way, ~30 min out" and "today's inspection is scheduled for 2pm" moments decide whether someone is home to grant access — a missed access window means a wasted truck roll and a re-scheduled trade day that cascades the whole project. SMS wins because the homeowner never logged into the client portal and won't see an email mid-day, while a delivered estimate sitting unanswered is the single biggest revenue leak a contractor has. Schedule changes, milestone progress, and inspection dates fire automatically from the job record, so a text is the only channel that reaches the homeowner at the moment the job state actually changes.

### Message categories
1. appointments — primary; the site-visit / estimate-walkthrough / trade-day lifecycle (confirm → day-before → en-route reminder → reschedule) is the highest-volume, access-critical traffic
2. order-updates — repurposed as the job-status lifecycle: estimate sent, work started, milestone reached, inspection scheduled, job complete — the progress spine the homeowner actually wants
3. account-events — invoice issued and payment-failed / deposit-due billing moments that gate whether the job proceeds
4. customer-support — homeowner question/punch-list ticket loop during and after the build
5. verification — homeowner and crew phone verification / portal login
Excluded: marketing (estimate and status texts are transactional; promo/"book your spring remodel" content reclassifies the lane and needs separate EIN-gated consent — keep it out of the transactional surface), team-alerts (real for crew dispatch but thin here — most builders coordinate crew in-app, and the homeowner-facing job is the product story), community (no member community), waitlist (no queue/availability model — backlog scheduling is an appointment, not a waitlist)

### Workflows

**Estimate / quote follow-up**
Get a delivered estimate over the line — the contractor's single biggest revenue leak is a quote that sits unanswered.
Sequence:
1. order-updates:order-confirmed — "Estimate sent" — the estimate/proposal is delivered with a link to review and approve
2. GAP:estimate-follow-up — "Still thinking it over?" — spaced nudge (day 3 / day 7) when the estimate is unviewed or unapproved
3. order-updates:order-processing — "Approved — we're scheduling you" — estimate approved, job moves into scheduling
Variable aliases (only where default feels wrong):
- order_number: "Estimate #1042"
- estimated_delivery: "your start window"
- tracking_link: "review & approve link"

**Site visit / estimate appointment**
Lock and protect a walkthrough or in-home estimate so the homeowner grants access.
Sequence:
1. appointments:confirmation — "Visit confirmed" — the site-visit / estimate walkthrough is booked
2. appointments:reminder-distant — "Tomorrow's visit" — day-before reminder with cancel/reschedule
3. appointments:reminder-proximate — "We're an hour out" — same-day heads-up before arrival
4. appointments:reschedule-confirmation — "Moved your visit" — confirms a new time when weather or crew shifts it
5. appointments:no-show-follow-up — "Missed you — rebook?" — re-engages after a missed access window
Variable aliases (only where default feels wrong):
- provider_name: "your project manager"
- appointment_time: "Tue, 2-4pm"
- reschedule_link: "pick a new time"

**Crew on-the-way (trade day)**
Tell the homeowner the crew is en route on a work day so someone's home to let them in.
Sequence:
1. appointments:confirmation — "Crew scheduled" — the work day / trade visit is confirmed on the calendar
2. GAP:technician-en-route — "Crew on the way" — crew dispatched, ETA sent the morning of the visit
Variable aliases (only where default feels wrong):
- provider_name: "your crew lead"
- appointment_time: "this morning"

**Project progress / milestones**
Keep the homeowner informed as the build advances so they don't chase the office for status.
Sequence:
1. order-updates:order-processing — "Work has started" — job kicks off, first phase underway
2. GAP:milestone-reached — "Milestone reached" — a named phase completes (demo done, rough-in passed, drywall up)
3. GAP:inspection-scheduled — "Inspection set" — a permit/code inspection is scheduled for a given day
4. order-updates:order-delivered — "Job complete" — work finished, walkthrough/punch-list link attached
Variable aliases (only where default feels wrong):
- order_number: "your project"
- estimated_delivery: "your completion date"
- return_link: "punch-list / report an issue"

**Change order approval**
Get a scope/price change acknowledged before the crew proceeds — the moment a job's budget actually moves.
Sequence:
1. GAP:change-order-approval — "Change order to approve" — a new scope/cost change is ready and blocks work until approved
2. order-updates:order-processing — "Approved — back to work" — change order signed, work resumes
Variable aliases (only where default feels wrong):
- order_number: "your project"

**Invoicing & payment**
Move deposits and progress/final invoices so the job stays funded and proceeds.
Sequence:
1. GAP:invoice-issued — "Invoice ready" — a deposit, progress, or final invoice is issued with a pay link
2. account-events:payment-failed — "Payment didn't go through" — a card-on-file or scheduled payment is declined
Variable aliases (only where default feels wrong):
- account_link: "pay your invoice"

**Punch-list / homeowner question loop**
Handle a homeowner's question or a post-completion warranty/punch-list item.
Sequence:
1. customer-support:ticket-received — "We got your request" — homeowner question or punch-list item logged
2. customer-support:agent-response — "Reply from your PM" — the project manager responds in the thread
3. customer-support:resolution-notification — "Item resolved" — the punch-list/warranty item is closed out
4. customer-support:csat-follow-up — "How did we do?" — satisfaction ask after resolution
Variable aliases (only where default feels wrong):
- agent_name: "your project manager"
- ticket_number: "request #88"

**Review request (post-completion)**
Capture a review while the finished project is fresh — referrals drive the contractor's pipeline.
Sequence:
1. appointments:post-appointment — "How'd the project go?" — feedback/review ask a day or two after job completion
Variable aliases (only where default feels wrong):
- provider_name: "the crew"
- feedback_link: "leave a review"

**Crew / portal access**
Verify a homeowner's or crew member's phone for the client portal or field app.
Sequence:
1. verification:verification-code — "Verify your phone" — phone verification at portal/app signup
2. verification:login-code — "Login code" — SMS second factor for portal/app sign-in
Variable aliases (only where default feels wrong):
- business_name: "the contractor's app name"

### Message gaps

**GAP:estimate-follow-up**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** "Estimate follow-up"
- **Why:** the unviewed/unapproved-quote nudge is the contractor's core revenue-recovery message and order-updates has no "still pending your action" follow-up step

**GAP:technician-en-route**
- **Classification:** Universal miss
- **Proposed corpus home:** appointments:en-route
- **Proposed universal name:** Provider en route / on the way — "Crew on the way"
- **Why:** the same-day "we're ~30 min out, be home to grant access" moment is universal to field/home services and the appointments category has reminders but no en-route/ETA step
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your crew is on the way, about {{wait_estimate}} out. See you soon at {{appointment_time}}. Reply STOP to opt out.`
  - Friendly: `Heads up - your {{workspace_name}} crew is on the way, about {{wait_estimate}} out. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: crew on the way, ~{{wait_estimate}} out. STOP to opt out.`
- **New variables:** none (`{{wait_estimate}}` reused from waitlist, `{{appointment_time}}` from appointments)

**GAP:milestone-reached**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** "Milestone reached"
- **Why:** a named project phase completing (demo done, rough-in passed, drywall up) is the distinctive multi-week-job progress beat and order-updates' lifecycle steps map to shipping, not construction phases

**GAP:inspection-scheduled**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** "Inspection scheduled"
- **Why:** a permit/code inspection date the contractor relays to the homeowner (often requiring site access) is specific to regulated trade work and has no corpus equivalent

**GAP:change-order-approval**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** "Change order to approve"
- **Why:** an approval-gated scope/cost change that blocks work until signed is unique to contract-based project work and is distinct from a generic "reply to confirm"

**GAP:invoice-issued**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:invoice-issued
- **Proposed universal name:** Invoice issued / payment due — "Invoice ready"
- **Why:** account-events covers payment-*failed* but has no "an invoice is ready, here's the pay link" message, which is the routine deposit/progress/final-payment trigger across services
- **Draft variants:**
  - Standard: `{{workspace_name}}: Invoice {{invoice_number}} for {{amount_due}} is ready. Pay here: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} invoice {{invoice_number}} ({{amount_due}}) is ready whenever you are: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Invoice {{invoice_number}}, {{amount_due}} due. Pay: {{account_link}} STOP to opt out.`
- **New variables:** `{{invoice_number}}` — invoice identifier, budget ~10 chars, source job/billing record, example "INV-1042"; `{{amount_due}}` — billed amount, budget ~8 chars, source invoice total, example "$2,400"

### Content constraints
- TCR use case is ACCOUNT_NOTIFICATION / appointment-reminder (Mixed) for the homeowner status + scheduling lane — registrable, no marketing consent required.
- Hard line: estimate, status, and invoice texts must stay transactional. No "book your spring remodel," seasonal discounts, or "refer a friend for $X" inside a status message — promo content reclassifies it as marketing and needs separate EIN-gated express written consent.
- Review-request asks are a soft edge: a single post-completion feedback text on transactional consent is standard practice, but framing it as a promotion or chaining incentivized-referral offers crosses into marketing.
- Consent is captured when the homeowner provides their number for the job (lead form, contract, portal signup); marketing to that list later still needs separate express opt-in.
- Crew/field-worker messaging needs its own STOP path; 1099 subcontractors are external contacts, not employees, and should be treated as a softer consent case than W-2 crew.
- "Invoice ready + pay link" and "estimate + approve link" are link-heavy patterns carriers scrutinize for smishing — favor branded/dedicated links over public URL shorteners.
- Standard carrier rules otherwise apply.

### Disambiguation
This is the contractor-facing job-management *platform* (remodeling CRM, field-service, project management), not a single contractor texting their own customers — the messages here are sent on behalf of many contractor businesses through one product. It sits at the Clear edge of Home & local services: a project moving through estimate → build → inspection → paid is plain transactional status, which keeps it Clear. What tips it toward Conditional is the marketing pull — contractors badly want "spring gutter special" and "we're in your neighborhood" blasts, and a builder who bakes promotional blasts into the same transactional flow inherits a consent and SHAFT problem. Inspections here are the contractor relaying a municipal inspection *date* to the homeowner (an appointment/access event), not the contractor↔building-department logistics, which never touch the homeowner's phone. Distinguish from generic e-commerce order-updates: the lifecycle is multi-week with named construction phases, change-order approvals, and progress billing rather than a single shipment.

### Sources
https://www.housecallpro.com/industries/construction-management-software-for-remodelers/
https://buildertrend.com/sales-process/construction-crm/
https://buildertrend.com/communication/construction-client-portal/
https://buildertrend.com/help-article/navigating-the-client-portal/
https://help.housecallpro.com/en/articles/8448657-using-the-customer-portal
https://www.housecallpro.com/features/customer-portal/
https://www.servicetitan.com/blog/best-construction-crm
https://build-folio.com/resources/contractor-sms-templates/
https://www.contractormag.com/management/best-practices/article/21283392/how-sms-marketing-works-for-home-services-and-construction
https://www.eztexting.com/industries/construction-home-services
https://www.goreminders.com/construction-contractor-roofing-appointment-reminders
https://www.roofingcontractor.com/articles/101101-why-texting-is-the-secret-weapon-for-roofing-contractors
https://textspot.io/industries/home-repair/
https://www.textline.com/industries/construction
https://sakari.io/industries/sms-marketing-construction
https://ddiy.co/use-cases-sms-marketing-construction/
https://calljolt.com/blog/home-services/a2p-10dlc-compliance-guide-contractors
https://help.twilio.com/articles/4408675845019-SMS-Compliance-and-A2P-10DLC-in-the-US
https://www.infobip.com/blog/tcpa-compliance-sms
https://www.cityofnsb.com/648/What-is-the-permit-inspection-process
