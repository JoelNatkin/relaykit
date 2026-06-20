## Trade services dispatch (HVAC, plumbing, electrical)
**Vertical:** Home & local services
**Bucket:** Clear
**URL slug:** /for/trade-services

### What this builder is making
A field-service management (FSM) platform — a "ServiceTitan-for-X" — that runs the day of a trade contractor: a dispatch board that assigns jobs to techs, a tech mobile app with on-my-way / on-site / done state changes, and a customer record tied to a service address. The system tracks appointment windows (often 2–4 hours wide), technician GPS location and ETA, job status, invoices, payments, and recurring maintenance agreements. The builder serves HVAC, plumbing, and electrical shops where the core unit of work is dispatching a tech to a home and closing out the visit with an invoice and a review.

### Why they need SMS
The single worst moment in trade services is the customer sitting through a four-hour arrival window not knowing if anyone is coming — that uncertainty drives the cancellation calls and the one-star "no-show" reviews. SMS wins because the customer is home waiting and not watching email, and a "your tech is 20 minutes out" text turns a dead window into a heads-up to unlock the gate or crate the dog. The same channel closes the loop the office cares about: invoice-ready and pay-by-text the moment the tech marks the job done, while the visit is still fresh.

### Message categories
1. appointments — the booking, the arrival window, the reminder, and the reschedule are the spine of every dispatch day; no-show reduction is the headline ROI.
2. order-updates — the dispatch status chain (en route / ETA / on-site / job complete / invoice / paid) maps cleanly onto the order lifecycle shape; "the order" is "the job."
3. account-events — recurring maintenance-agreement billing and renewals; failed card on an autopay membership is churn-critical.
4. customer-support — post-visit issue follow-up and "we found a problem" outreach between scheduled visits.
5. marketing — seasonal tune-up promos and membership upsell, EIN-gated and consent-separated.
Excluded: community (no member-community construct), team-alerts (techs are dispatched, not paged for incidents — covered by the FSM's own internal app, not RelayKit's customer-facing scope), verification (phone capture happens at booking, not a standalone 2FA product surface), waitlist (jobs are scheduled into windows, not queued for an opening).

### Workflows

**Booking confirmation + window**
Locks in the appointment the moment a job is scheduled and tells the customer the arrival window.
Sequence:
1. appointments:confirmation — "Cool Air HVAC" — confirms the job is booked for the chosen date/window right after scheduling.
2. appointments:reminder-distant — "Cool Air HVAC" — day-before reminder with the window and a reschedule link.
3. appointments:reminder-proximate — "Cool Air HVAC" — morning-of or hour-before nudge that the visit is today.

Variable aliases:
- provider_name: "your technician" (the tech name is often not known until dispatch; a generic provider frame reads correctly)
- appointment_time: "tomorrow, 8am–12pm" (trade windows are ranges, not point times)

**Dispatch arrival chain**
The headline workflow: keeps the waiting customer informed from dispatch through arrival so the four-hour window stops feeling like a black box.
Sequence:
1. order-updates:order-processing — "Cool Air HVAC" — STRETCH: tech is assigned and dispatched, the job is "in preparation" framed as "your technician is scheduled / on the way to you."
2. GAP:tech-en-route-eta — "Cool Air HVAC" — fired when the tech leaves the prior job / enters the geofence, with a live ETA ("your tech is about 20 min away").
3. GAP:tech-arrived — "Cool Air HVAC" — fired when the tech reaches the address ("your technician is here").

Variable aliases:
- estimated_delivery: "about 20 minutes" (ETA to arrival, not a delivery date)

**Job complete + invoice + pay-by-text**
Closes the visit out while the customer is still on-site fresh: marks the work done, delivers the invoice, and collects payment.
Sequence:
1. order-updates:order-delivered — "Cool Air HVAC" — STRETCH: job marked complete by the tech; reframed from "delivered" to "your service is complete."
2. GAP:invoice-ready-pay — "Cool Air HVAC" — invoice is ready, with a pay-by-text link.
3. order-updates:refund-processed — "Cool Air HVAC" — only if a partial refund/credit is issued after the visit.

**Payment reminder (open invoice)**
Recovers unpaid invoices with a non-promotional nudge at set intervals after the job.
Sequence:
1. GAP:invoice-payment-reminder — "Cool Air HVAC" — polite reminder that invoice {{order_number}} is still open, with the pay link, sent at 7/14/30-day intervals.

**Reschedule / cancellation**
Handles the customer or dispatcher moving the job, keeping the record and the customer in sync.
Sequence:
1. appointments:reschedule-confirmation — "Cool Air HVAC" — confirms the new date/window.
2. appointments:cancellation-confirmation — "Cool Air HVAC" — confirms a cancelled visit with a rebook link.
3. appointments:no-show-follow-up — "Cool Air HVAC" — sent when no one was home / tech couldn't access the property, offering a rebook.

Variable aliases:
- provider_name: "your technician"

**Post-visit review request**
Captures a review while the finished work is fresh — the reputation engine of every trade shop.
Sequence:
1. appointments:post-appointment — "Cool Air HVAC" — thanks the customer for the visit and links a feedback/review form, sent shortly after job complete.

Variable aliases:
- provider_name: "your technician"
- feedback_link: review-platform link (Google/site review)

**Recurring maintenance reminder**
Drives the seasonal tune-up and the membership service that is the recurring-revenue backbone of HVAC and plumbing shops.
Sequence:
1. appointments:reminder-distant — "Cool Air HVAC" — STRETCH: proactive "time for your seasonal tune-up" outreach when the maintenance window opens, reusing the distant-reminder shape for a not-yet-booked visit with a schedule link.

Variable aliases:
- appointment_time: "this fall" (a window to book within, not a fixed time)

**Maintenance membership billing**
Keeps the recurring service agreement (monthly/annual autopay) alive — the churn-critical money workflow.
Sequence:
1. account-events:payment-failed — "Cool Air HVAC" — membership autopay card declined; update payment to keep the agreement active.
2. account-events:subscription-confirmed — "Cool Air HVAC" — membership renewal / plan change confirmed.

**Between-visit issue outreach**
Lets the shop reach a customer proactively when a tech flags a follow-up problem or a part comes in.
Sequence:
1. customer-support:proactive-outreach — "Cool Air HVAC" — reaches the customer about a noted issue or a needed follow-up.
2. customer-support:account-issue-resolved — "Cool Air HVAC" — confirms the follow-up item was handled.

**Seasonal promo (marketing-consented only)**
The one promotional lane: seasonal discounts and membership upsell to customers who gave separate marketing consent.
Sequence:
1. marketing:promotional-offer — "Cool Air HVAC" — seasonal tune-up discount or membership offer.
2. marketing:event-invitation — "Cool Air HVAC" — open-house / financing-event style invite (rare, but valid).

### Message gaps

**GAP:tech-en-route-eta**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (dispatch-status alias over the order-updates lifecycle; ETA-to-a-person, not a parcel)
- **Proposed universal name:** Technician en route (display alias)
- **Why:** the four-hour-window arrival ETA is the defining trade-services SMS moment and the order-updates shipping messages assume a carrier/parcel frame, not a person driving to a home.

**GAP:tech-arrived**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (dispatch-status alias)
- **Proposed universal name:** Technician arrived (display alias)
- **Why:** "your tech is here" is a distinct, valued state change between en route and job complete with no clean parcel-lifecycle equivalent.

**GAP:invoice-ready-pay**
- **Classification:** Universal miss
- **Proposed corpus home:** order-updates:invoice-ready (new lifecycle message) or account-events:invoice-ready
- **Proposed universal name:** Invoice ready / pay by text
- **Why:** service businesses bill after the work, not before — the corpus has refund and order-confirmed but no "here's your invoice, pay it" message, which any pay-by-text builder needs.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Invoice {{order_number}} for {{amount}} is ready. Pay here: {{invoice_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} invoice {{order_number}} ({{amount}}) is ready. Pay it here whenever you like: {{invoice_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Invoice {{order_number}}, {{amount}}. Pay: {{invoice_link}} STOP to opt out.`
- **New variables:** `{{amount}}` — invoice total as a currency string, budget ~8 chars, source = FSM invoice record, example "$420.00". `{{invoice_link}}` — short link to the hosted invoice/pay page, budget ~24 chars, source = FSM, example "rlk.to/inv9".

**GAP:invoice-payment-reminder**
- **Classification:** Universal miss
- **Proposed corpus home:** order-updates:payment-reminder (new) or account-events:payment-reminder
- **Proposed universal name:** Open invoice reminder
- **Why:** dunning on a one-off invoice (distinct from a failed subscription card) is a near-universal service-business need the corpus doesn't cover.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Invoice {{order_number}} for {{amount}} is still open. Pay here: {{invoice_link}} Reply STOP to opt out.`
  - Friendly: `A reminder from {{workspace_name}}: invoice {{order_number}} ({{amount}}) is still unpaid. Pay here: {{invoice_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Invoice {{order_number}} ({{amount}}) open. Pay: {{invoice_link}} STOP to opt out.`
- **New variables:** `{{amount}}` and `{{invoice_link}}` — as defined under GAP:invoice-ready-pay.

**STRETCH:order-updates:order-processing**
- **Classification:** Stretch
- **Proposed corpus home:** order-updates:order-processing — fit gap: "being prepared" reads as warehouse pick-pack, not "a technician is assigned and heading to you."
- **Proposed universal name:** Order processing
- **Why:** usable as the "tech dispatched" beat but the parcel-prep framing needs reskinning to a dispatch frame.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your technician for job {{order_number}} is on the way. We'll text an ETA shortly. Reply STOP to opt out.`
  - Friendly: `Good news — your {{workspace_name}} technician is heading to you for job {{order_number}}. ETA coming up. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Tech en route for {{order_number}}. ETA soon. STOP to opt out.`

**STRETCH:order-updates:order-delivered**
- **Classification:** Stretch
- **Proposed corpus home:** order-updates:order-delivered — fit gap: "delivered" plus a return link is parcel language; the service equivalent is "work complete," and the trailing action is feedback/pay, not a return.
- **Proposed universal name:** Order delivered
- **Why:** marks job completion well structurally, but the return-link CTA and "delivered" verb misfit a service visit.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your service for job {{order_number}} is complete. Anything off? Reply here. Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} service (job {{order_number}}) is all done. If anything's not right, just reply. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Job {{order_number}} complete. Issue? Reply. STOP to opt out.`

**STRETCH:appointments:reminder-distant**
- **Classification:** Stretch
- **Proposed corpus home:** appointments:reminder-distant — fit gap: it assumes an already-booked appointment ("tomorrow"); the maintenance-reminder use is a not-yet-booked nudge to schedule a seasonal visit.
- **Proposed universal name:** Reminder - distant
- **Why:** reusable for proactive tune-up outreach but the copy presumes a confirmed time rather than prompting the customer to book one.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Time for your seasonal tune-up. Book a visit here: {{reschedule_link}} Reply STOP to opt out.`
  - Friendly: `It's tune-up season at {{workspace_name}} — book your visit here whenever works: {{reschedule_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Tune-up time. Book: {{reschedule_link}} STOP to opt out.`

### Content constraints
- Standard carrier rules apply; the transactional dispatch/appointment/invoice messages register cleanly as ACCOUNT_NOTIFICATION / DELIVERY_NOTIFICATION use cases.
- Seasonal tune-up promos and membership-upsell offers are promotional — separate MARKETING campaign, separate explicit consent, EIN-gated; do not fold them into the appointment-reminder campaign or carriers will flag the mismatch.
- Honor STOP immediately on the transactional stream too; a customer who opts out cannot be re-texted even with "on the way" alerts.
- No guaranteed-outcome or warranty language in bodies (platform constraint); state status, not promises.
- Keep pay links to hosted invoice pages — no card or payment credentials in the message body.

### Disambiguation
Trade services dispatch is the GPS-dispatch, arrival-window end of home services: the tech drives to the home and the ETA/arrival chain is the core value, which is what keeps it firmly Clear. Neighboring sub-verticals shift the center of gravity — cleaning/lawn/pool field services share the dispatch shape but lean lighter on invoicing; salon/spa and home-based personal services are appointment-only with no dispatch or arrival-ETA leg, so they belong to a booking-centric profile, not this one. What tips a neighbor from Clear toward Conditional is any blended consumer-lending or financing-offer messaging (HVAC system financing is common) — financing solicitations carry lending-disclosure and consent weight beyond plain seasonal promos. Watch the inverse trap: a shop's "free estimate" or "we're in your neighborhood, book now" blasts look like ordinary reminders but are prospecting marketing and must ride the consented marketing campaign, not the transactional dispatch stream.

### Sources
https://www.servicetitan.com/features/dispatch-software
https://www.servicetitan.com/industries/hvac-software/dispatching
https://www.servicetitan.com/comparison/servicetitan-vs-housecall-pro
https://www.workiz.com/
https://www.servicefusion.com/blog/what-is-gps-fleet-tracking-for-field-service-management
https://servicefusion.zendesk.com/hc/en-us/articles/360029970811-On-The-Way-Notifications-with-ETA-Location-Sharing-Options
https://gpstrackit.com/blog/technician-arrival-times-as-superpower/
https://www.fieldequip.com/technician-tracking-101-how-real-time-location-visibility-transforms-field-service-operations
https://www.servicetitan.com/blog/plumbing-invoice-app
https://www.servicetitan.com/blog/hvac-invoicing-tips
https://www.getjobber.com/industries/hvac-invoicing-software/
https://help.housecallpro.com/en/articles/2463437-service-plan-template-for-hvac
https://textdrip.com/blog/hvac-sms-templates-bookings-reminders
https://build-folio.com/resources/hvac-sms-templates/
https://www.myshowup.app/sms-reminders-for-hvac/
https://calljolt.com/blog/home-services/a2p-10dlc-compliance-guide-contractors
https://heavysettech.zendesk.com/hc/en-us/articles/39255219254931-How-to-Set-Up-A2P-10DLC-Compliance-for-Home-Services-Using-a-Local-Number
https://messageiq.io/blog/10dlc-registration-sms-compliance/
