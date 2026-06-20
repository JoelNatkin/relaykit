## Moving services brokerages / aggregators
**Vertical:** Home & local services
**Bucket:** Not yet maybe not ever
**URL slug:** /for/moving-brokerages
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.

### What this builder is making
A moving brokerage or lead aggregator runs an intake form ("get free moving quotes") that captures a consumer's move details, then sells or routes that lead to one or more FMCSA-registered carriers who actually own the trucks. The platform is a marketplace/CRM layer (Quote Runner, Moving.com, Network Leads-style products) — it brokers and arranges transportation but does not perform line-haul itself. Revenue comes from selling leads, per-call fees, or a booking cut, not from moving anyone's belongings.

### Why they need SMS
The moment a consumer submits the quote form, brokers race competitors to reach the lead first — SMS gets a response in seconds where email and voicemail stall, and "5+ movers calling within minutes" is the documented norm. Brokers also want to text booking confirmations, deposit requests, and assigned-carrier handoffs across the move window. SMS wins because the lead is time-perishable and the consumer is mid-decision.

### Message categories
1. appointments — booked-move confirmations, reschedules, survey scheduling for the consumer's own move (the only clean, consented transactional surface)
2. customer-support — move-day issue and status handling once a relationship exists
Excluded: marketing (promotional lead-bait is the prohibited core of this model — EIN-gated marketing cannot launder third-party lead routing), waitlist (no queue model), community (none), team-alerts (internal dispatch is the carrier's job, not the broker's surface), order-updates (no shipped-goods lifecycle the broker controls), account-events (no recurring billing relationship), verification (no first-party auth surface that survives the lead-resale problem)

### Workflows
**Booked-move confirmation (consented consumer only)**
Confirms a move the consumer actually booked through the broker, after explicit opt-in collected by the booking brand itself.
Sequence:
1. appointments:confirmation — "Move confirmed" — sent when the consumer's move date and assigned carrier are locked, naming the date/window
2. appointments:reminder-distant — "Move-day reminder" — day before the move, with a change/cancel path
Variable aliases (only where the default example would feel wrong):
- provider_name: "your assigned crew"
- appointment_time: "Sat Jul 12, 8–11am arrival window"

**Move reschedule**
Tells the consumer their move date moved (carrier reassignment, weather, capacity).
Sequence:
1. appointments:reschedule-confirmation — "Move rescheduled" — new date/window after a change
Variable aliases (only where the default example would feel wrong):
- appointment_time: "Mon Jul 14, 8–11am arrival window"

**Move-day support handoff**
Once a move is underway, lets the consumer reach a human about delays or issues.
Sequence:
1. customer-support:service-status-alert — "Crew running late" — proactive notice that the assigned crew is delayed, with an ETA
2. customer-support:ticket-received — "We're on it" — acknowledges a consumer-reported problem during the move
Variable aliases (only where the default example would feel wrong):
- eta: "around 1pm"

**In-home/virtual survey scheduling**
Schedules the pre-move estimate survey that produces the binding-vs-nonbinding quote.
Sequence:
1. appointments:confirmation — "Survey booked" — confirms the estimate survey time
2. appointments:reminder-proximate — "Survey in 1 hour" — proximate reminder before the estimator calls/arrives
Variable aliases (only where the default example would feel wrong):
- provider_name: "your move estimator"

### Message gaps
**GAP:deposit-request**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** "Deposit due" (display alias)
- **Why:** brokers commonly text a deposit-payment link, and this is precisely the field where bait-and-switch and non-refundable-deposit abuse concentrates — it must stay a flagged vertical-specific message, never a clean universal one
- **Status:** FUTURE

**GAP:assigned-carrier-handoff**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** "Carrier assigned" (display alias)
- **Why:** the broker hands the consumer off to a different legal entity (the carrier) than the one they consented to — this disclosure is the consent-chain break that makes the model hard to register, so it is documented, not corpus-promoted
- **Status:** FUTURE

**STRETCH:appointments:confirmation**
- **Classification:** Stretch
- **Proposed corpus home:** appointments:confirmation reused as the move/survey confirmation; fit gap is that "appointment with {{provider_name}}" frames a single provider, while a broker's "provider" is a separately-licensed carrier assigned after the fact, not the brand the consumer booked
- **Proposed universal name:** appointments:confirmation
- **Why:** the corpus confirmation works only if the booking brand and the servicing entity are the same; for a brokerage they are not, so reuse needs the carrier-assignment disclosure pulled in alongside
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your move is confirmed for {{appointment_time}}. Your assigned crew will be in touch. Reply STOP to opt out.`
  - Friendly: `You're booked with {{workspace_name}}! Move set for {{appointment_time}}, assigned crew to follow. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Move confirmed, {{appointment_time}}. STOP to opt out.`
- **Status:** FUTURE

### Content constraints
- **Why gated — consent-chain break.** The defining act of this model is collecting opt-in under the broker/aggregator brand and then routing or selling that lead to one or more separate carriers. TCR and carriers classify any campaign where an intermediary sits between the consumer's consent and the message sender as third-party lead generation, which is auto-denied. Consent cannot be bought, sold, or traded; lead lists cannot be shared. This sub-vertical's revenue model is the prohibited pattern, not an incidental risk.
- **Why gated — documented fraud profile.** FMCSA's Operation Protect Your Move explicitly names brokers that "purport to connect consumers to local movers but instead facilitate fraud." Consumer complaints more than doubled (3,030 in 2015 to 7,647 in 2022). The signature abuses are bait-and-switch lowball estimates, large non-refundable deposits (>45% of estimate is an FTC red flag), and "hostage loads" held for payment above 110% of a non-binding estimate. SMS is the front door to these tactics (speed-to-lead, deposit-link pressure), making the channel an active enforcement target.
- TCR Special category / industry-wide standard constraint applies: even a clean transactional use (booked-move confirmation) inherits the brand-level suspicion of the lead-gen revenue model. Brand vetting fails at the model, not the message.
- No promotional or quote-solicitation content. Any "get your free quote" / "compare movers" / "lowest price" framing is prohibited lead-bait — it is the exact content that draws denial.
- No deposit-collection links in surfaced templates. The deposit-request message is the highest-abuse field (non-refundable deposit fraud) and is documented as vertical-specific, not corpus-promoted.
- First-party only, if ever served: the only defensible path is a single carrier (not a broker) texting its own booked customers under its own brand and its own FMCSA carrier authority — at which point it is the Clear "Moving services (direct ops)" entry, not this one.
- Carrier-assignment disclosure required on any handoff: the consumer must be told the servicing entity differs from the booking brand, because the silent swap is the consent break.

### Disambiguation
A direct moving company — one FMCSA carrier authority, its own trucks and crews, texting customers it personally booked — is the Clear "Moving services (direct ops)" entry; that brand owns the consent it collected and services the move itself, so confirmations, reminders, and move-day support are first-party transactional traffic. This entry is the opposite shape: a brokerage or lead aggregator that captures the opt-in under its own marketing brand and then sells or routes the lead to one or more separately-licensed carriers it does not control. The consent chain breaks at the handoff — the brand the consumer agreed to is not the brand (or carrier) that ultimately moves them, which is precisely the third-party lead-generation pattern TCR auto-denies. Layered on top is the FMCSA-documented fraud profile (bait-and-switch estimates, non-refundable deposits, hostage loads) that puts brokers under active enforcement. The litmus test: if one legal entity holds the FMCSA carrier authority, books the customer, and moves the goods, it is Clear direct-ops; if the entity collecting the lead routes it to a different entity to perform the move, it is this gated entry.

### Sources
https://www.transportation.gov/briefing-room/fmcsa-launches-operation-protect-your-move-nationwide-crackdown-moving-scams
https://www.transportation.gov/briefing-room/fmcsa-continues-nationwide-crackdown-fraudulent-household-goods-movers-and-brokers
https://www.fmcsa.dot.gov/fmcsas-fraud-task-force-takes-enforcement-action-against-three-chicago-area-household-goods-moving
https://www.ecfr.gov/current/title-49/subtitle-B/chapter-III/subchapter-B/part-371
https://www.ecfr.gov/current/title-49/subtitle-B/chapter-III/subchapter-B/part-371/subpart-B
https://www.fmcsa.dot.gov/registration/types-operating-authority
https://www.thisoldhouse.com/moving/moving-brokers-vs-carriers
https://www.oig.dot.gov/investigations/household-goods-moving-fraud
https://www.fmcsa.dot.gov/consumer-protection/national-consumer-complaint-database-faqs
https://safewaymovinginc.com/how-to-spot-and-avoid-moving-broker-scams/
https://www.joycevanlines.com/are-moving-brokers-a-scam-what-you-need-to-know-before-you-book
https://www.10dlc.org/en/shaft
https://docs.aws.amazon.com/sms-voice/latest/userguide/registration-help-vertical-leadgen.html
https://messageiq.io/blog/10dlc-registration-sms-compliance/
https://support.callrail.com/hc/en-us/articles/18593904382221-Text-Message-Compliance-10DLC-regulations-and-guidelines
