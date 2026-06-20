## Moving services (direct ops)
**Vertical:** Home & local services
**Bucket:** Clear
**URL slug:** /for/moving-services

### What this builder is making
A dispatch-and-CRM platform for a direct moving company — the dispatch board, crew/truck assignment, job scheduling, online estimates, and digital invoicing that a single moving operator runs its own jobs through (Elromco, SmartMoving, Supermove, MoversTech, MoveitPro). The product tracks a job through a lifecycle (quote → booked → move day → en route → on site → completed → invoiced) and coordinates the operator's own crews (drivers, helpers) against trucks while keeping the customer informed about move-day timing. It is two-sided: it texts the homeowner about their move and the crew about their assignments.

### Why they need SMS
On move day the customer is standing in an empty apartment waiting for a crew, and the single moment that decides their morning is the en-route ETA — without it they call the office, and a crew that's an hour out reads as a no-show. SMS wins because the homeowner never installed the operator's app, an email is invisible in the arrival window, and the crew needs a reply-keyword channel (CONFIRM/ACK) that works from the truck. The deposit-to-confirm and balance-due moments also hinge on a text getting opened, since an unsigned estimate or unpaid balance silently kills the booking.

### Message categories
1. appointments — primary; the move is a scheduled job with confirmation, day-before/2-hour reminders, reschedules, and a post-move review ask — the highest-value customer lane
2. order-updates — move-day status lifecycle (en route → arriving → on site → completed), the WISMO-killing real-time updates the homeowner actually waits on
3. team-alerts — crew operational layer: job assignment, day-before crew reminder, shift/route changes, with ACK
4. account-events — deposit/balance payment failures on the booking, the churn-critical "card declined, booking at risk" moment
5. verification — crew app login and phone verification at onboarding
Excluded: marketing (the second-campaign promo lane — review-asks and offers must not ride the transactional booking number, keep separate; not workflow-shaping here), community (no member community), customer-support (inquiries are handled inline by the operator, not a ticket lifecycle product), waitlist (no queue/availability model for a one-off move)

### Workflows

**Quote to booking (customer)**
Move an issued estimate to a signed, deposit-paid booking before the customer shops a competitor.
Sequence:
1. GAP:estimate-sent — "Your moving estimate" — estimate issued, link to review and e-sign
2. GAP:estimate-follow-up — "Estimate still open" — follow-up a few hours/days later if unsigned
3. appointments:confirmation — "Move confirmed" — booking confirmed once signed/deposit paid, with move date
Variable aliases (only where default feels wrong):
- provider_name: "your crew lead"
- appointment_time: "Sat Jun 14, 8am"

**Move-day reminders (customer)**
Make sure the customer is ready and present when the crew arrives.
Sequence:
1. appointments:reminder-distant — "Move is tomorrow" — day-before reminder of the move date and window
2. appointments:reminder-proximate — "Crew arriving in ~1 hour" — same-day heads-up before the crew arrives
Variable aliases (only where default feels wrong):
- provider_name: "your moving crew"
- appointment_time: "tomorrow, 8-10am window"
- cancel_link: "reschedule your move"

**Move-day status (customer)**
Keep the homeowner informed from crew departure through job completion so they stop calling the office.
Sequence:
1. order-updates:order-confirmed — "Move day is here" — move-day job is confirmed for today with the arrival window
2. GAP:crew-en-route — "Crew en route" — crew departs for the origin address, optional truck-tracking link
3. GAP:crew-arriving — "Crew arriving soon" — crew is ~20 min out, final heads-up to be ready
4. order-updates:order-delivered — "Move complete" — job marked done at destination, link to invoice/issues
Variable aliases (only where default feels wrong):
- order_number: "Move #4471"
- estimated_delivery: "today, 8-10am"
- tracking_link: "track your crew"
- return_link: "report an issue"

**Reschedule / cancellation (customer)**
Confirm a moved or cancelled job so the customer isn't waiting on a crew that isn't coming.
Sequence:
1. appointments:reschedule-confirmation — "Move rescheduled" — new move date/window confirmed
2. appointments:cancellation-confirmation — "Move cancelled" — job cancelled, rebook link
Variable aliases (only where default feels wrong):
- provider_name: "your crew lead"
- appointment_time: "Sun Jun 15, 9am"
- reschedule_link: "pick a new move date"

**Deposit & balance (customer)**
Recover a failed deposit or final-balance charge before it silently cancels the booking.
Sequence:
1. account-events:payment-failed — "Deposit/payment declined" — card on the booking declined, booking at risk, update link
2. GAP:balance-due — "Balance due on move" — final balance owed after the job, link to pay
Variable aliases (only where default feels wrong):
- workspace_name: "the moving company name"
- account_link: "update payment / pay balance"

**Post-move review (customer)**
Turn a finished move into a public review while the experience is fresh.
Sequence:
1. appointments:post-appointment — "How did your move go?" — feedback/review request after the job completes
Variable aliases (only where default feels wrong):
- provider_name: "your crew"
- feedback_link: "leave a review"

**Crew assignment & coordination (crew)**
Assign jobs to a crew and confirm day-before and same-day changes with the operator's own movers.
Sequence:
1. GAP:crew-job-assignment — "New job assigned" — a move is assigned to a crew member, reply to confirm availability
2. team-alerts:shift-scheduled — "You're scheduled" — crew's move-day shift/start time published
3. team-alerts:shift-reminder — "Job tomorrow" — day-before (or X-days-before) crew reminder
4. team-alerts:shift-change — "Shift moved" — start time, truck, or job location changed
5. team-alerts:shift-cancellation — "Shift cancelled" — assigned job cancelled
Variable aliases (only where default feels wrong):
- location: "123 Oak St / Truck 4"
- role: "lead / helper"
- shift_date / shift_time: "Sat, 7:30am"

**Crew onboarding (crew)**
Verify a new mover's phone and let them into the crew app.
Sequence:
1. verification:verification-code — "Verify your phone" — crew verifies phone at app signup
2. verification:login-code — "Login code" — crew signs in to the crew app with SMS
Variable aliases (only where default feels wrong):
- business_name: "the crew app name"

### Message gaps

**GAP:estimate-sent**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (display alias of an appointments/quote-issued style message)
- **Proposed universal name:** "Your moving estimate"
- **Why:** the issued, e-signable estimate is the front of the moving funnel and no corpus message covers a quote/estimate-sent step

**GAP:estimate-follow-up**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (unsigned-quote nudge)
- **Proposed universal name:** "Estimate still open"
- **Why:** the "quote sent, not signed, nudge in a few hours" loop is a named moving-software automation distinct from any appointment reminder

**GAP:crew-en-route**
- **Classification:** Universal miss
- **Proposed corpus home:** order-updates:en-route
- **Proposed universal name:** Provider/crew en route — "Crew en route"
- **Why:** order-updates has out-for-delivery for parcels but no "service provider has departed for your address" step, which is the core service-business en-route moment
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your crew for {{order_number}} is en route, arriving {{estimated_delivery}}. Track: {{tracking_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} crew is on the way for {{order_number}}, arriving {{estimated_delivery}}. Track: {{tracking_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Crew en route, {{order_number}}, ~{{estimated_delivery}}. {{tracking_link}} STOP to opt out.`
- **New variables:** none (reuses order-updates `{{order_number}}`, `{{estimated_delivery}}`, `{{tracking_link}}`)

**GAP:crew-arriving**
- **Classification:** Universal miss
- **Proposed corpus home:** order-updates:arriving-soon
- **Proposed universal name:** Arriving soon / provider approaching — "Arriving soon"
- **Why:** the ~20-min "be ready" proximity ping is the single decision point for the customer being present, and no corpus message covers provider proximity
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your crew for {{order_number}} is arriving in about {{wait_estimate}}. Track: {{tracking_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} crew is almost there for {{order_number}}, about {{wait_estimate}} out. Track: {{tracking_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Crew {{wait_estimate}} out, {{order_number}}. {{tracking_link}} STOP to opt out.`
- **New variables:** none (reuses order-updates `{{order_number}}`, `{{tracking_link}}` and waitlist `{{wait_estimate}}`)

**GAP:balance-due**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:balance-due
- **Proposed universal name:** Balance due / invoice payable — "Balance due"
- **Why:** a post-job outstanding balance with a pay link is a distinct billing event from a failed card, and the corpus has payment-failed but no plain "amount owed, pay here"
- **Draft variants:**
  - Standard: `{{workspace_name}}: A balance of {{refund_amount}} is due on your account. Pay here: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} balance of {{refund_amount}} is ready to pay whenever you are: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Balance {{refund_amount}} due. Pay: {{account_link}} STOP to opt out.`
- **New variables:** none (reuses account-events `{{account_link}}` and order-updates `{{refund_amount}}` as the amount; a dedicated `{{amount_due}}` would be cleaner if added)

**GAP:crew-job-assignment**
- **Classification:** Vertical-specific
- **Proposed corpus home:** team-alerts:job-assignment (shared with field-service/dispatch verticals)
- **Proposed universal name:** Job assigned to worker — "New assignment"
- **Why:** assigning a move to a crew member with reply-to-confirm is the core dispatch action; team-alerts covers shifts and incidents but not a discrete job/work assignment
- **Draft variants:**
  - Standard: `{{workspace_name}}: New job {{shift_date}} {{shift_time}} at {{location}} as {{role}}. Reply YES to confirm. Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: You've got a new job, {{shift_date}} {{shift_time}} at {{location}}, {{role}}. Reply YES to confirm. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: New job {{shift_date}} {{shift_time}}, {{location}}, {{role}}. Reply YES. STOP to opt out.`
- **New variables:** none (reuses team-alerts `{{shift_date}}`, `{{shift_time}}`, `{{location}}`, `{{role}}`)

### Content constraints
- TCR use case is ACCOUNT_NOTIFICATION for the appointment/booking and crew lanes and DELIVERY_NOTIFICATION for the move-day status lane; both are registrable and neither requires marketing consent.
- Keep move-day status and reminder texts transactional — no discount codes, no "book your next move" upsell inside a status or reminder message; promo content reclassifies it as marketing and needs the separate marketing campaign + express opt-in.
- Review-asks: a post-move feedback link is transactional follow-up, but an offer-laden "leave a 5-star review for $X off" is promotional — keep incentivized review-asks on the marketing lane.
- Consent for the customer is transactional/implied when the phone number is given to book the move; marketing to that number still needs separate express written opt-in.
- Crew/1099 helpers still need a STOP path; treat contractor crews like external contacts for opt-out, not internal staff.
- "Crew arriving / track your crew + link" overlaps the most-impersonated arrival/delivery smishing pattern — favor branded/dedicated links over generic URL shorteners to protect deliverability.
- Standard carrier rules otherwise apply.

### Disambiguation
This is the direct moving operator's own dispatch/CRM platform — one company texting its own booked customers and its own crews about real, scheduled jobs. It must be kept distinct from moving brokerages and lead-generation/aggregator platforms, which buy and resell "moving leads" and blast cold outreach to people who never booked: that traffic carries a high-abuse profile (poor consent propagation, STOP not honored downstream, complaint and opt-out spikes) and would land in a different, far stricter bucket — not Clear. The tell that flips this sub-vertical from Clear to Conditional is the appearance of cold-lead or marketplace messaging: if the platform texts prospects it bought rather than customers who signed an estimate, it is a lead-gen abuse case, not direct ops. Also distinct from last-mile parcel logistics: the unit of work here is a crew visiting two fixed addresses on a scheduled day, so the customer lane is appointment-booking plus move-day status, not a parcel tracking number. Self-storage and junk-removal dispatch look similar operationally but are their own sub-verticals.

### Sources
https://blog.moveitpro.com/the-complete-guide-to-moving-company-dispatch-software-in-2025
https://www.elromco.com/features/dispatch
https://www.elromco.com/blog/crew-portal-shift-confirmation-and-route-optimization
https://moverstech.com/sms-messaging-tips-for-moving-companies/
https://moverstech.com/sms-whatsapp-chatbots-for-movers-how-to-reply-faster-and-book-more-jobs/
https://www.smartmoving.com/blog/best-practices-for-sending-sms-messages-during-a-move
https://www.smartmoving.com/impress-your-customers
https://www.smartmoving.com/smart-estimates
https://www.supermove.com/blog/the-best-automations-every-moving-company-should-set-up
https://completesms.com/blog/guide-to-sms-for-movers/
https://completesms.com/industries/moving-companies/
https://www.smartmoving.com/blog/sms-compliance-for-moving-companies
https://www.smartmoving.com/blog/all-about-10dlc-compliance
https://www.eztexting.com/industries/transportation
https://movegistics.com/complete-guide-to-crm-for-moving-companies/
