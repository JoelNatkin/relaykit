## Property management (rental ops)
**Vertical:** Professional services
**Bucket:** Conditional
**URL slug:** /for/property-management

### What this builder is making
Software that runs residential rental operations for landlords and property managers — the range spans Buildium/AppFolio/Yardi-style portfolio platforms down to indie tools like RentRedi and TurboTenant, covering listing and applicant screening, lease e-signing, rent collection and autopay, maintenance/work-order ticketing, and tenant-portal messaging. The platform tracks rent due dates and ledger balances, maintenance request status, lease terms and renewal windows, inspections, showings, and move-in/move-out logistics. The job is to move a renter from prospect through application, lease, occupancy, and renewal while keeping rent current and units maintained.

### Why they need SMS
A planned maintenance visit or an entry notice is worthless if the tenant doesn't see it before the technician arrives, and a rent-due nudge sent 3-5 days early is the single lever that drops late payments by a third — email gets ignored, a text gets read. The leasing funnel is equally time-sensitive: a prospect who doesn't get a showing-time confirmation or a self-tour access code in minutes books with the competing unit instead. SMS wins because every one of these moments has a same-day or same-hour consequence and a renter who screens calls but answers texts.

### Message categories
1. appointments — showings, maintenance/repair visits, and inspections are the operational core: schedule, confirm, remind, reschedule, no-show. The most-used real workflow family.
2. account-events — rent-due reminders, autopay/payment failures, and lease/renewal confirmations are the churn-and-arrears-critical billing lane (rent-due and rent-received are GAPs).
3. customer-support — maintenance work-order ticket lifecycle maps cleanly onto ticket-received → assigned → response → resolved; service-status for building-wide outages.
4. community — building-wide announcements, resident events, and emergency-adjacent notices (water shutoff, pest control) for multi-unit properties.
5. verification — phone-ownership proof at tenant/applicant signup and step-up before a payment-method change.
Excluded: marketing (promotional listing blasts to a rented-out tenant base are not the need; prospect re-engagement is closer to appointments follow-up), order-updates (no physical-goods fulfillment; package-received is a GAP, not order-shipped), team-alerts (internal staff/vendor ops, not the tenant-facing surface this serves), waitlist (unit availability rarely runs a true position-queue model — STRETCH at best).

### Workflows

**Rent-due reminder cycle**
Keep a tenant current across the monthly rent cycle with a pre-due nudge, a receipt, and autopay-failure recovery — the lever that drops late payments.
Sequence:
1. GAP:rent-due-reminder — "Rent due" — sent 3-5 days before the due date with the amount and pay link (see gap).
2. GAP:rent-received — "Rent received" — instant receipt after a successful payment posts (see gap).
3. account-events:payment-failed — "Autopay failed" — card decline on autopay rent; the recovery hinge.
Variable aliases:
- account_link: "tenant portal"
- card_last4: "card on file"

**Rent past-due notice (arrears lane — gated)**
Notify a tenant that rent is past due, factually, with the balance and how to pay — no late-fee threat, no collection framing.
Sequence:
1. GAP:rent-past-due — "Rent past due" — factual past-due balance + pay link only, after the grace window lapses (see gap; this is the FDCPA-adjacent lane).
Variable aliases:
- account_link: "pay rent"

**Maintenance work-order lifecycle**
Take a tenant repair request from logged to resolved with status updates, reusing the support ticket lifecycle.
Sequence:
1. customer-support:ticket-received — "Request received" — fires when a tenant submits a maintenance request; confirms it's logged.
2. customer-support:agent-assigned — "Tech assigned" — a technician/vendor is assigned to the work order.
3. customer-support:agent-response — "Update on your request" — vendor adds a note or asks a question.
4. customer-support:resolution-notification — "Repair completed" — work order closed; reopen link if still broken.
Variable aliases:
- ticket_number: "request #"
- agent_name: "your technician"
- ticket_link: "view request"

**Maintenance / repair visit scheduling**
Confirm a tenant is home (or has granted entry) for a scheduled repair visit and handle reschedules.
Sequence:
1. appointments:confirmation — "Visit scheduled" — confirms the repair-visit date/time after it's booked.
2. appointments:reminder-distant — "Visit tomorrow" — day-before reminder with a reschedule link.
3. appointments:reminder-proximate — "Tech arriving soon" — about an hour out.
4. appointments:reschedule-confirmation — "Visit moved" — when the tenant or vendor moves it.
5. appointments:no-show-follow-up — "Missed visit" — tech couldn't get access; rebook.
Variable aliases:
- provider_name: "the technician"
- appointment_time: "Thu 2-4pm"
- reschedule_link: "reschedule"

**Property showing / self-tour**
Confirm a prospect's showing time or deliver a timed self-tour access code, and follow up after.
Sequence:
1. appointments:confirmation — "Showing confirmed" — confirms the tour time with the leasing agent.
2. appointments:reminder-proximate — "Tour in 1 hour" — proximate reminder before the showing.
3. GAP:access-code-delivery — "Your access code" — timed self-tour lockbox/smart-lock code at the tour window (see gap).
4. appointments:no-show-follow-up — "Missed your tour" — prospect didn't show; rebook.
5. appointments:post-appointment — "How was the tour?" — STRETCH; post-tour follow-up to re-engage the prospect (corpus body is feedback-framed; a leasing nudge stretches it).
Variable aliases:
- provider_name: "your leasing agent"
- feedback_link: "still interested? apply"

**Inspection notice**
Give legally-required advance entry notice for a routine inspection and confirm access.
Sequence:
1. appointments:confirmation — "Inspection scheduled" — entry notice with date/time.
2. appointments:reminder-distant — "Inspection tomorrow" — day-before reminder.
3. appointments:reschedule-confirmation — "Inspection moved" — on reschedule.
Variable aliases:
- provider_name: "your property manager"

**Lease lifecycle & renewal**
Confirm a signed lease and prompt the renewal decision before the window closes.
Sequence:
1. account-events:subscription-confirmed — "Lease signed" — STRETCH; confirms the lease/renewal is executed (subscription framing stretched to a lease term).
2. GAP:lease-renewal-reminder — "Renewal due" — renewal-decision prompt a few weeks before lease end (see gap).
Variable aliases:
- account_link: "view lease"

**Move-in / move-out coordination**
Hand off keys, access, and inspection logistics at the start and end of tenancy.
Sequence:
1. appointments:confirmation — "Move-in scheduled" — confirms the move-in day/time and key-pickup window.
2. GAP:access-code-delivery — "Your entry code" — unit/building access code on move-in day (see gap).
3. appointments:confirmation — "Move-out walkthrough" — schedules the move-out inspection.
4. account-events:subscription-confirmed — "Deposit returned" — STRETCH; confirms the deposit refund (no corpus deposit/refund-to-tenant message; refund-processed is order-scoped).
Variable aliases:
- appointment_time: "Sat 10am"

**Building announcements & emergency notices**
Push building-wide operational news and urgent alerts to all tenants of a property.
Sequence:
1. community:community-announcement — "Building notice" — pest control, parking, amenity, or policy update.
2. community:event-invitation — "Resident event" — community event for the building.
3. GAP:building-emergency-alert — "Urgent: building issue" — water shutoff, outage, or leak alert needing fast acknowledgment (see gap).
Variable aliases:
- community_name: "your building"
- announcement_link: "details"

**Package received**
Tell a tenant a package has arrived at the leasing office or parcel room.
Sequence:
1. GAP:package-received — "Package waiting" — notifies a tenant a parcel is held for pickup (see gap).

**Account & access security**
Verify a tenant/applicant at signup and confirm sensitive changes on the portal.
Sequence:
1. verification:verification-code — "Verification code" — phone-ownership proof at tenant/applicant signup.
2. verification:confirmation-code — "Confirmation code" — step-up before a payment-method or autopay change.
3. account-events:new-device-sign-in — "New sign-in" — portal access from a new device.

### Message gaps

**GAP:rent-due-reminder**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:payment-due-reminder (a future billing/payments category serving rent, lending, subscriptions, and invoicing alike)
- **Proposed universal name:** Payment due reminder
- **Why:** the most-used legitimate property-management text — a pre-due rent nudge — has no corpus home; trial-ending addresses lapse, not a recurring scheduled charge.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Rent of {{amount_due}} is due {{due_date}}. Pay or review: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: friendly reminder, {{amount_due}} rent is due {{due_date}}. Pay here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{amount_due}} rent due {{due_date}}. {{account_link}} STOP to opt out.`
- **New variables:** `{{amount_due}}` — amount owed, ~7 chars, source: rent ledger, example "$1,200"; `{{due_date}}` — due date, ~10 chars, source: lease schedule, example "Jul 1"

**GAP:rent-received**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:payment-received (same future billing/payments category)
- **Proposed universal name:** Payment received
- **Why:** an instant rent receipt cuts "did it post?" support load; refund-processed is the inverse direction and order-scoped, so it doesn't fit a rent payment.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Rent payment of {{amount_paid}} received. Thank you. Receipt: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: got your {{amount_paid}} rent payment, thank you. Receipt: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{amount_paid}} rent received. {{account_link}} STOP to opt out.`
- **New variables:** `{{amount_paid}}` — amount paid, ~7 chars, source: payment record, example "$1,200"

**GAP:rent-past-due**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:payment-past-due (same future billing/payments category) — the FDCPA-adjacent variant; factual-only by design.
- **Proposed universal name:** Payment past due
- **Why:** an arrears notice is a distinct, higher-risk message from a pre-due reminder and needs its own factual, threat-free template; nothing in the corpus covers a past-due balance.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Rent of {{amount_due}} is now past due. View balance or pay: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: your rent of {{amount_due}} is past due. You can pay or review here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{amount_due}} rent past due. Pay: {{account_link}} STOP to opt out.`
- **New variables:** reuses `{{amount_due}}` from rent-due-reminder.

**GAP:access-code-delivery**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (property-management) — a timed lockbox/smart-lock code for self-tours and move-in is too narrow for the universal corpus.
- **Proposed universal name:** Access code (display alias "Your access code")
- **Why:** self-tours and key-free move-in both hinge on delivering a timed entry code by text at the access window; no corpus message carries a one-time physical-access code (verification codes are account 2FA, not door access).
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your access code for {{property_address}} is {{access_code}}, valid {{access_window}}. Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: here's your code for {{property_address}}: {{access_code}}, good {{access_window}}. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: code {{access_code}} for {{property_address}}, {{access_window}}. STOP to opt out.`
- **New variables:** `{{access_code}}` — entry code, ~6 chars, source: lock/lockbox, example "4827"; `{{property_address}}` — unit address, ~20 chars, source: listing, example "12 Oak St #3"; `{{access_window}}` — valid window, ~12 chars, source: tour booking, example "2-4pm today"

**GAP:lease-renewal-reminder**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (property-management) — a lease-renewal-decision prompt is specific to tenancy terms.
- **Proposed universal name:** Renewal reminder (display alias "Lease renewal")
- **Why:** the renewal-decision window is a load-bearing property-management moment with no corpus analog; subscription-confirmed only fires after a decision, not as the prompt.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your lease at {{property_address}} ends {{lease_end_date}}. Renew or ask questions: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: your lease at {{property_address}} is up {{lease_end_date}}. Renew or chat here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: lease ends {{lease_end_date}}. Renew: {{account_link}} STOP to opt out.`
- **New variables:** `{{lease_end_date}}` — lease end date, ~10 chars, source: lease record, example "Aug 31"; reuses `{{property_address}}`.

**GAP:building-emergency-alert**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (property-management) — a building-wide urgent operational alert is property-specific; community:moderation-update is the nearest universal analog but it's online-community-framed.
- **Proposed universal name:** Emergency alert (display alias "Urgent building notice")
- **Why:** water shutoffs, leaks, and outages need a fast, acknowledgeable broadcast to every unit; the community announcement message is non-urgent and the team-alerts category is staff-facing.
- **Draft variants:**
  - Standard: `{{community_name}}: Urgent - {{alert_detail}} at {{property_address}}. Details: {{update_link}} Reply STOP to opt out.`
  - Friendly: `{{community_name}}: heads up - {{alert_detail}} at {{property_address}}. More: {{update_link}} Reply STOP to opt out.`
  - Brief: `{{community_name}}: urgent - {{alert_detail}}. {{update_link}} STOP to opt out.`
- **New variables:** `{{alert_detail}}` — what's happening, ~30 chars, source: manager input, example "water shut off 1-3pm"; reuses `{{property_address}}`, `{{update_link}}`.

**GAP:package-received**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (property-management) — a parcel-held-for-pickup notice is building-ops-specific; order-shipped/order-delivered are sender-fulfillment messages, not a third-party hold.
- **Proposed universal name:** Package received (display alias "Package waiting")
- **Why:** parcel-room/leasing-office package alerts are a common multifamily SMS; no corpus message covers "a package is being held for you to pick up."
- **Draft variants:**
  - Standard: `{{workspace_name}}: A package arrived for you at {{property_address}}. Pick it up at the office. Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: a package is waiting for you at the {{property_address}} office. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: package waiting at the office. STOP to opt out.`
- **New variables:** reuses `{{property_address}}`.

**STRETCH:appointments:post-appointment**
- **Classification:** Stretch
- **Proposed corpus home:** stretch corpus msg appointments:post-appointment; fit gap is a leasing-prospect re-engagement nudge versus a post-visit feedback request.
- **Proposed universal name:** Post-appointment (display alias "How was the tour?")
- **Why:** the post-tour follow-up wants to convert interest to an application, not collect feedback; the body's feedback frame can carry it but isn't a clean fit.

**STRETCH:account-events:subscription-confirmed**
- **Classification:** Stretch
- **Proposed corpus home:** stretch corpus msg account-events:subscription-confirmed; fit gap is a lease/renewal-executed or deposit-returned semantic versus a SaaS subscription change.
- **Proposed universal name:** Subscription confirmed (display alias "Lease signed" / "Deposit returned")
- **Why:** a signed lease and a returned deposit are confirmation moments the generic body covers loosely, but neither is a subscription event.

### Content constraints
- Rent reminders, receipts, maintenance scheduling, inspection/entry notices, access codes, package alerts, and lease-renewal prompts are clean transactional tenant comms — no special gate beyond standard TCPA consent + STOP.
- Past-due / arrears messages are the gated lane: factual amount + how-to-pay only. No late-fee-threat language, no implied legal threats (eviction, court, credit-reporting warnings), no harassment.
- No debt-collection framing or "Mini-Miranda"-style collection notices in routine landlord arrears texts; if a third-party collector or agent sends on the owner's behalf, full FDCPA/Reg F applies (that is a harder bucket — see disambiguation).
- Respect time-of-day on any arrears/past-due send: 8am-9pm tenant-local, conservatively, even though first-party landlords aren't strictly bound by the FDCPA window — state mini-FDCPA statutes and TCPA exposure make it the safe default.
- Privacy hygiene on past-due texts: avoid exposing sensitive financial detail beyond the amount and pay link; assume lock-screen previews are visible to others.
- No promotional content in operational tenant bodies; listing/marketing blasts to non-consented prospects are a separate marketing-consent question and excluded here.
- One message per day per tenant on the arrears lane; higher frequency reads as aggressive under Reg F / mini-FDCPA norms.

### Disambiguation
What tips this sub-vertical from Clear to Conditional is one lane only: rent arrears / past-due collection messaging. Even when the landlord collects its own debt — and first-party creditors are exempt from the federal FDCPA — state mini-FDCPA statutes (e.g., California's Rosenthal Act) and TCPA exposure reach past-due texts, so a careless "pay or we file for eviction" message creates real liability. Routine operational tenant comms (maintenance scheduled, inspection/entry notice, package received, lease-renewal reminder, access codes, rent-due nudge, rent receipt) are clean transactional and carry no special gate; the condition attaches specifically to the past-due / collection lane, which must stay factual (amount + pay link), threat-free, and time-of-day respectful. Distinguish from HOA/community-association messaging (assessment dues and governance, a different consent and content profile) and especially from third-party debt-collection agencies or any agent collecting back rent on the owner's behalf — the moment a non-owner sends arrears texts, full FDCPA/Reg F applies and that is a harder bucket than this one.

### Sources
https://www.textline.com/industries/property-management
https://www.eztexting.com/industries/property-management
https://www.dialmycalls.com/property-management
https://www.text-em-all.com/property-management-texting-service
https://textus.com/texting-guides/sms-templates-for-property-management-companies
https://dexatel.com/blog/property-management-sms-templates/
https://www.turbotenant.com/rent-collection/rent-reminder/
https://rentredi.com/
https://www.buildium.com/blog/tenant-portal-app-easy-for-rent-payments-and-maintenance/
https://clerk.chat/industries/property-management/
https://kompatoai.com/debt-collector-text-regulations/
https://www.text-em-all.com/sms-compliance
https://www.prodigaltech.com/ltblogs/debt-collector-text-regulations
https://www.indybizlaw.com/landlord-tenant-matters/the-fdcpa-collection-rent-or-damages-from-a-tenant
https://washingtonlandlordtenant.info/the-fair-debt-collections-practices-act-and-property-managers/
https://www.bylcollections.com/blog/is-a-property-manager-also-a-debt-collector
