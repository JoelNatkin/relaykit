## Solar lead-generation
**Vertical:** Home & local services
**Bucket:** Not yet
**URL slug:** /for/solar-lead-gen
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.

### What this builder is making
Software and call-center operations that source, score, and sell residential solar prospects to installers — funnel sites, paid-ad capture forms, lead aggregators, and dialer/CRM stacks (ReadyMode, GoHighLevel-style) that route "interested homeowner" records to closers. The product is the lead itself: a phone number qualified on homeownership, roof suitability, geography, and utility bill, often resold across multiple installers. Revenue is per-lead or per-appointment, which structurally rewards volume outreach over relationship.

### Why they need SMS
The window between a homeowner filling a form (or appearing on a purchased list) and a competitor calling is minutes, so lead-gen ops text immediately to claim attention and book an appointment. SMS also drives the appointment-confirmation and reminder leg once a homeowner has agreed to a consult. The same speed-to-lead pressure that makes SMS valuable here is exactly what produces the cold, non-consented blasts that draw enforcement.

### Message categories
1. appointments — confirmations and reminders for booked solar consults are the one genuinely transactional, opted-in surface
2. verification — phone-ownership proof on a capture form before any outreach
Excluded: marketing (promotional solar offers to non-opted-in or purchased lists are the core abuse vector — the reason this is deferred), order-updates (no fulfillment), team-alerts (internal-only, not the lead-gen value prop), waitlist (no queue), community (none), customer-support (no post-sale support relationship at the lead layer), account-events (no recurring billed account with the homeowner)

### Workflows

**Booked-consult confirmation**
After a homeowner agrees to a solar consultation, confirm the slot — the legitimate, opted-in transactional path.
Sequence:
1. appointments:confirmation — "Consult confirmed" — sent when the homeowner books, naming the rep and time.
2. appointments:reminder-distant — "Day-before reminder" — sent the day before the in-home or virtual consult.
3. appointments:reminder-proximate — "1-hour reminder" — sent about an hour before the rep arrives or calls.
Variable aliases (only where the default example would feel wrong):
- provider_name: "your solar consultant Marcus"
- appointment_time: "Thu 4:00 PM at your home"

**Consult reschedule / cancel**
Handle homeowner-initiated changes to a booked consult.
Sequence:
1. appointments:reschedule-confirmation — "Consult moved" — sent when the homeowner picks a new time.
2. appointments:cancellation-confirmation — "Consult cancelled" — sent on cancellation with a rebook link.
3. appointments:no-show-follow-up — "Missed consult rebook" — sent after a missed consult to offer a new time.

**Capture-form phone verification**
Prove the homeowner actually controls the number they submitted, before any outreach — a guardrail that distinguishes consented from purchased records.
Sequence:
1. verification:verification-code — "Confirm your number" — sent when a homeowner submits the quote form, gating outreach on a verified opt-in.

### Message gaps

**GAP:speed-to-lead first-touch (consented)**
- **Classification:** Universal miss
- **Proposed corpus home:** appointments:lead-first-touch
- **Proposed universal name:** First-touch reply
- **Why:** A consented homeowner who just requested a quote needs an immediate "we got your request, here's a time" touch before any appointment exists — distinct from confirmation, which presumes a booked slot.
- **Draft variants:**
  - Standard: `{{workspace_name}}: thanks for your quote request. Reply here to grab a consult time that works for you. Reply STOP to opt out.`
  - Friendly: `Thanks for asking {{workspace_name}} about solar! Reply here and we'll find a consult time that works. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: got your quote request. Reply to pick a consult time. STOP to opt out.`
- **Status:** FUTURE

### Content constraints
- Deferral is RelayKit-specific and customer-pull dependent: the abuse profile is severe enough that onboarding this sub-vertical safely requires vetting and ops capacity RelayKit does not yet have. Defer until a real customer pull justifies building that capacity.
- High-abuse cold-outreach profile: the business model rewards texting purchased lists and form leads that never opted in to *this sender* — the exact pattern TCR/carriers treat as prohibited (purchased/third-party lists are explicitly banned; opt-in must be to the specific business).
- TCPA exposure is documented and large: Momentum Solar settled solar-robocall/text class actions for $20–30M; TCPA suits surged ~95% YoY with solar lead-gen a named offender. Per-message statutory damages run $500–$1,500.
- Industry norm is heavy vetting infrastructure (AI call review, consent-record capture, lead provenance audits) precisely because the baseline outreach is high-risk — a solo RelayKit customer would not carry that apparatus.
- Marketing-category solar offers to non-opted-in homeowners are out of scope entirely; only booked-consult appointments and form-verified opt-ins are defensible, and even those depend on clean provenance RelayKit cannot currently verify.
- Carrier secondary vetting / Trust Score throttling will penalize this traffic profile; low deliverability would make the product feel broken even where messages are technically permitted.

### Disambiguation
The Clear "Solar installation dispatch" entry serves an installer's *existing, opted-in customers* — scheduling crews, confirming install dates, post-install service — a transactional relationship with a homeowner who already bought. This deferred entry is the opposite end of the funnel: cold LEAD-GENERATION outreach to homeowners on purchased or paid-ad lists who have not opted in to the sender, where the "lead" is resold across competitors and texted at volume. The dividing line is consent provenance and relationship stage, not industry: install/service ops for a signed customer is Clear; speed-to-lead blasting of prospects is this Not-yet entry. This mirrors the real-estate referral-SMS abuse pattern, where consented client transaction texts are fine but cold agent-referral outreach to scraped/purchased contacts drew the same carrier and TCPA scrutiny. Only the narrow opted-in slice (a homeowner who explicitly booked a consult or verified their number) could ever migrate toward Clear/Conditional.

### Sources
https://natlawreview.com/article/govern-yourself-accordingly-solar-lead-companys-tough-guy-routine-appears-backfire
https://www.classaction.org/news/up-to-30m-momentum-solar-settlement-ends-class-action-lawsuits-over-alleged-robocalls
https://www.leadshook.com/blog/tcpa-lead-generation/
https://activeprospect.com/blog/tcpa-violations/
https://www.corporatecomplianceinsights.com/how-2025-redefined-telemarketing-compliance/
https://support.callrail.com/hc/en-us/articles/18593904382221-Text-Message-Compliance-10DLC-regulations-and-guidelines
https://help.gohighlevel.com/support/solutions/articles/48001229784-a2p-10dlc-campaign-approval-best-practices
https://www.bandwidth.com/support/en/articles/12823092-10dlc-campaign-vetting-tips-and-tricks
https://readymode.com/solar-lead-generation-follow-ups/
https://www.boomsourcing.com/industries/solar/
