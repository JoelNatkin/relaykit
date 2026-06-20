## Locksmith / emergency services
**Vertical:** Home & local services
**Bucket:** Conditional
**URL slug:** /for/locksmith

### What this builder is making
Dispatch and job-management software for mobile locksmiths and adjacent emergency trades (lockouts, rekeys, lock installs, automotive key programming) — booking intake, technician assignment, en-route/arrival tracking, on-site quotes, completion receipts, and review follow-up. The software tracks a single job from call to close: who's assigned, the ETA, the quoted price, the work performed, and payment. A developer here is building for one verifiable local locksmith business texting its own booked customers, not a lead-routing marketplace.

### Why they need SMS
A lockout is a stranded, often roadside customer who will re-dial the next ad the moment the wait feels uncertain — and the locksmith trade carries enough scam history that the customer is also deciding whether to trust whoever shows up. A text that names the company, the technician, the van, and the license number turns a cold ETA into a verifiable arrival, which is exactly why dispatchers report cancellations dropping when proof leads the message. SMS wins because the customer is outside, phone in hand, with no app installed and no patience for email.

### Message categories
1. appointments — the live job is an appointment-shaped lifecycle: confirm, en-route reminder, arrival, reschedule, completion follow-up.
2. customer-support — intake acknowledgement, "can't locate you" escalation, and post-job issue handling map cleanly to ticket-style support messages.
3. account-events — payment-failed / receipt-adjacent billing on the card charged on-site.
4. marketing — second-campaign only, EIN-gated: rekey reminders and seasonal promos to opted-in past customers.
Excluded: order-updates (no shipped goods — service is performed on-site, not delivered), team-alerts (internal tech dispatch is possible but not the customer-facing job this builder ships), community (no community surface), verification (phone-ownership 2FA is generic, not vertical-shaping), waitlist (emergency dispatch is immediate, not queued).

### Workflows

**Emergency lockout dispatch (identity-first)**
Confirms a real, licensed technician is coming and gives the customer verifiable proof so they stop shopping competitors.
Sequence:
1. customer-support:ticket-received — "Request received" — sent the moment the lockout call/booking is logged, before a tech is assigned, so the stranded customer knows a real business has them.
2. GAP:dispatch-confirmation-identity — "Technician dispatched" — names company, technician, van/plate, and license number with an ETA window (not a guaranteed minute), sent on assignment.
3. appointments:reminder-proximate — "On the way" — brief en-route update as the tech closes in.
4. GAP:technician-arrived-verify — "At your door" — tech is on-site; tells the customer to check the ID badge before opening.
Variable aliases:
- provider_name: "your technician, Marcus"
- appointment_time: "between 6:15 and 6:35pm"

**On-site quote in writing**
Documents the price before any work begins — the FTC-grade defense against bait-and-switch complaints and the single most important anti-price-bait step.
Sequence:
1. GAP:job-quote-written — "Quote before we start" — itemized service call + lockout (+ any drilling surcharge) and a total, sent before work starts, asking the customer to confirm.
Variable aliases:
- (none — quote text is the message body itself)

**Job completion + receipt**
Closes the job with proof of work done and what was charged, on the card present.
Sequence:
1. GAP:job-complete-receipt — "Job done" — confirms work performed (e.g. lock opened, no damage), amount charged, and that a receipt is sent.
2. appointments:post-appointment — "How did we do" — feedback/review request after the job closes.
Variable aliases:
- provider_name: "Marcus"

**Scheduled rekey / lock install**
Non-emergency booked jobs (rekeys, install, automotive key programming) that behave like a normal appointment.
Sequence:
1. appointments:confirmation — "Booking confirmed" — date/time, technician, scope (number of locks), and quoted price on booking.
2. appointments:reminder-distant — "Tomorrow's appointment" — day-before reminder with reschedule link.
3. appointments:reminder-proximate — "Tech is 15 min out" — short arrival heads-up the day of.
4. appointments:post-appointment — "How did we do" — feedback request after completion.
Variable aliases:
- provider_name: "your technician"
- appointment_time: "tomorrow, 10am-12pm"

**Reschedule / cancellation**
Handles a customer or tech needing to move a scheduled job.
Sequence:
1. appointments:reschedule-confirmation — "Rescheduled" — new time confirmed.
2. appointments:cancellation-confirmation — "Cancelled" — cancellation confirmed with a rebook link.

**Can't-locate-customer escalation**
Recovers a job where the tech is at the address but the customer isn't reachable — prevents a wasted trip read as a no-show.
Sequence:
1. GAP:tech-onsite-cannot-locate — "We're at your address" — confirms the address, states a short wait window, and gives a callback number.
2. appointments:no-show-follow-up — "We missed you" — rebook offer if contact never lands.

**Long-job progress update**
Sets expectations on complex work (automotive key programming runs 1-4 hours) so the customer doesn't think the tech vanished.
Sequence:
1. GAP:job-in-progress-eta — "Still working, on track" — confirms the job is progressing, gives a duration estimate, and states the total is unchanged.
Variable aliases:
- (none)

**Payment-failed recovery**
Recovers a declined card on a completed job.
Sequence:
1. account-events:payment-failed — "Card declined" — the on-site/follow-up charge was declined; link to update payment.

**Rekey / maintenance re-engagement (marketing — second campaign, EIN-gated)**
Brings past customers back for proactive rekeys, smart-lock battery service, or seasonal work.
Sequence:
1. marketing:re-engagement — "It's been a while" — to opted-in past customers only.
2. marketing:promotional-offer — "Seasonal rekey offer" — promo to the opted-in marketing list.
Variable aliases:
- business_name: "Anvil Lock & Key"

### Message gaps

**GAP:dispatch-confirmation-identity**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (locksmith)
- **Proposed universal name:** Technician dispatched (identity + ETA window)
- **Why:** the trust-defining message is identity proof (company, tech, van/plate, license) leading the body — no generic appointment confirmation carries license/vehicle proof, and it must use an ETA window, never a guaranteed minute.

**GAP:technician-arrived-verify**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (locksmith)
- **Why:** "verify my badge before opening the door" is a locksmith-trust artifact with no analog in the corpus; the action is identity verification, not a link click.

**GAP:job-quote-written**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (locksmith)
- **Why:** an itemized pre-work price quote sent for the customer to confirm is the core anti-price-bait control for this Conditional vertical; nothing in the corpus carries a quote body.

**GAP:job-complete-receipt**
- **Classification:** Universal miss
- **Proposed corpus home:** appointments:job-complete-receipt
- **Proposed universal name:** Job complete with charge confirmation
- **Why:** on-site service trades (locksmith, plumber, mobile mechanic) all finish a job by confirming work done + amount charged + receipt, and the corpus post-appointment message only requests feedback.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Job complete. {{job_summary}}. {{amount_charged}} charged, receipt sent. Reply STOP to opt out.`
  - Friendly: `All done at {{workspace_name}} - {{job_summary}}. We charged {{amount_charged}} and sent your receipt. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Done. {{job_summary}}. {{amount_charged}} charged. STOP to opt out.`
- **New variables:** `{{job_summary}}` — one-line description of work performed, budget 40 chars, source dispatch record, example "lock opened, no damage". `{{amount_charged}}` — final charged amount, budget 8 chars, source payment record, example "$130".

**GAP:tech-onsite-cannot-locate**
- **Classification:** Universal miss
- **Proposed corpus home:** appointments:tech-onsite-cannot-locate
- **Proposed universal name:** On-site, can't reach you
- **Why:** any mobile/field-service trade needs an "I'm here but can't find you" message before it counts as a no-show; the corpus has no on-site-unreachable message.
- **Draft variants:**
  - Standard: `{{workspace_name}}: We're at {{location}} but can't reach you. Holding {{wait_window}}. Call us: {{callback_number}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}} here - we're at {{location}} and can't find you. We'll wait {{wait_window}}. Call: {{callback_number}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: At {{location}}, can't reach you. Call {{callback_number}}. STOP to opt out.`
- **New variables:** `{{wait_window}}` — how long the tech will wait, budget 12 chars, source dispatch policy, example "10 min". `{{callback_number}}` — direct callback number, budget 14 chars, source business profile, example "555-201-3344".

**GAP:job-in-progress-eta**
- **Classification:** Universal miss
- **Proposed corpus home:** appointments:job-in-progress
- **Proposed universal name:** Job in progress, on track
- **Why:** long on-site jobs (key programming, complex installs) need a reassurance ping that the work is progressing and the price is unchanged; the corpus has no mid-job status message.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Still working on your job, on track. About {{duration_estimate}} left. Total unchanged. Reply STOP to opt out.`
  - Friendly: `Update from {{workspace_name}}: your job's progressing well, about {{duration_estimate}} to go. Price is unchanged. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: On track, ~{{duration_estimate}} left. Total unchanged. STOP to opt out.`
- **New variables:** `{{duration_estimate}}` — remaining time estimate, budget 12 chars, source tech update, example "1 hour".

### Content constraints
- Eligibility is gated: the sender must be a single, verifiable, licensed local locksmith texting its own booked customers — not a lead aggregator, call-center funnel, or multi-business dispatch marketplace routing leads. Lead-generation and affiliate traffic is rejected over 10DLC outright.
- Never promise a guaranteed arrival time. Use an ETA window ("between 6:15 and 6:35pm", "about 20 min"), never a single guaranteed minute or "guaranteed in X minutes" language.
- No price-bait patterns. Do not advertise a low teaser price in SMS that turns into an on-site upcharge; the on-site quote must be itemized and sent before work begins, and the completion charge must match it.
- No credentials, license numbers, or partial card numbers used as a trust prop in promotional bodies — identity proof belongs in the transactional dispatch/arrival messages only.
- Marketing (rekey reminders, seasonal offers) is a separate second campaign registration, EIN-gated, opt-in only — never folded into the transactional dispatch flow and never framed as an "upgrade" to it.
- Brand registration must reflect the real licensed business name; mismatched or generic "locksmith near me" brand names invite carrier rejection in this elevated-scrutiny category.

### Disambiguation
General home-services trades (plumbing, HVAC, electrical) share the same en-route/arrival/quote/completion shape and most of the GAP messages generalize to them — but they don't carry the locksmith trade's elevated carrier scrutiny, so they tend toward Clear while locksmith stays Conditional on the lead-aggregator and price-bait tests. The line that tips locksmith from Clear to Conditional is the business model: a single verifiable shop texting its own customers is fine; a dispatch platform routing one inbound lead across many independent locksmiths is the lead-aggregator pattern carriers block. Roadside assistance and towing look adjacent and allowed but inherit the same fraud-category caution — identity-proof-first, ETA-window-only, no price bait. What looks allowed but isn't: a low "$19 lockout" teaser in the dispatch text, or "guaranteed arrival in 15 minutes" — both are exactly the bait patterns the carrier rules target.

### Sources
https://fixyflow.com/blog/locksmith-text-message-templates
https://www.workiz.com/industries/locksmiths/
https://www.fieldpulse.com/resources/blog/locksmith-software
https://www.fieldproxy.ai/blueprints/locksmith-sms-alerts
https://skipcalls.com/locksmith/can-skipcalls-auto-book-locksmith-jobs-car-lockouts-rekeys-lock-installs-and-sen
https://sacramentomobilelocksmithandcarkeys.com/sms-terms/
https://www.bandwidth.com/support/en/articles/12823092-10dlc-campaign-vetting-tips-and-tricks
https://voipdocs.io/sms-mms/10dlc-vetting-rejection-reasons
https://justcall.io/blog/10dlc-compliance-guide.html
