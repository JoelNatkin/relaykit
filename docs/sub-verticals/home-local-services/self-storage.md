## Storage facilities (self-storage SaaS)
**Vertical:** Home & local services
**Bucket:** Clear
**URL slug:** /for/self-storage

### What this builder is making
Software that runs self-storage facilities: online reservations and move-in, month-to-month lease and rent billing, gate/door access-code provisioning, and the delinquency-to-lien collections workflow that storage operators are legally required to follow. The builder tracks unit inventory and availability, tenant balances and due dates, autopay status, and gate-access state (granted/restricted) per unit. SMS sits in tenant communications — move-in instructions, recurring rent reminders, past-due collections, and access-code delivery — typically integrated with a gate controller (PTI, Sentinel, DaVinci) and a payment processor.

### Why they need SMS
A storage tenant signs once and then rarely logs in; when a card expires or a payment lapses, an emailed past-due notice goes unread and the account marches toward lien and auction — a text gets opened in minutes and recovers the payment before access is cut. SMS also carries the move-in gate PIN the instant a lease is signed online, so a self-serve tenant can drive up and get into their unit with no staff present. The whole self-storage business model is unattended and recurring-billing-driven, which is exactly where a 99%-open channel converts reminders into paid rent.

### Message categories
1. account-events — rent is a recurring subscription-like charge; payment-failed, card-expiry, and autopay/lifecycle alerts are the churn-and-lien-critical core of storage comms
2. order-updates — the rent-cycle and reservation/move-in lifecycle (reservation confirmed, move-in ready, gate code issued, autopay receipt) map to status-update messaging
3. appointments — move-in appointments and move-out walkthroughs get confirmation/reminder treatment
4. marketing — promotions for first-month-free, referral, and unit-availability re-marketing (EIN-gated, separate consent)
Excluded: verification (facility gate/access codes are operational unit-entry codes, NOT phone-ownership 2FA — they are NOT the verification category; 2FA verification only applies if the software also texts a login code to prove phone ownership at tenant-portal signup, which is a distinct, narrow use), community (no member community), team-alerts (facility-staff ops alerts are possible but peripheral; not a primary tenant-facing job), customer-support (storage support is low-volume and rarely ticketed; folded into account/order comms), waitlist (unit waitlists exist but are thin; covered as a GAP below rather than a primary category), customer-support partially.

### Workflows

**Reservation to move-in**
Walks a new tenant from online reservation through a confirmed move-in with their gate code in hand.
Sequence:
1. order-updates:order-confirmed — "Reservation confirmed" — sent when a unit is reserved online; confirms the unit and hold/move-in date. STRETCH:order-updates:order-confirmed (frames "order" as a reservation; "arrives" framing must become the move-in date).
2. appointments:confirmation — "Move-in confirmed" — sent when a move-in date/time is set, naming the facility and date.
3. GAP:gate-access-code-issued — "Gate code" — sent the moment the lease is signed, delivering the operational gate/unit access PIN so the tenant can enter.
4. appointments:reminder-distant — "Move-in reminder" — sent the day before the scheduled move-in with any documents-to-bring note.

Variable aliases:
- provider_name: "Sunrise Self Storage" (the facility, not a person)
- appointment_time: "Sat Jun 21, 10am move-in window"

**Reservation expiry**
Recovers or releases a hold that the tenant never converted to a move-in.
Sequence:
1. waitlist:grace-expiring — "Reservation expiring" — sent when an unconverted reservation hold is about to lapse, with a link to complete move-in. STRETCH:waitlist:grace-expiring (it's a hold-expiry, not a queue spot; "claim" framing fits but copy should say "complete your reservation").
2. waitlist:missed — "Reservation expired" — sent when the hold lapses, inviting the tenant to re-reserve. STRETCH:waitlist:missed.

**Recurring rent reminder**
Nudges the tenant ahead of the monthly rent due date to keep autopay/manual payments on time.
Sequence:
1. GAP:rent-due-reminder — "Rent due" — sent a few days before the monthly due date with the balance and a pay link.

**Card expiry / payment method update**
Prevents a declined autopay charge before it happens.
Sequence:
1. GAP:card-expiring — "Card expiring" — sent before the stored card expires, with a link to update payment so autopay doesn't fail.

**Payment failed**
Catches a declined rent charge and recovers it before the account ages into delinquency.
Sequence:
1. account-events:payment-failed — "Payment declined" — sent when the rent charge is declined, with the card last-4 and an update/pay link.

**Delinquency to lien**
Runs the legally-required past-due escalation that protects lien compliance and recovers rent before auction.
Sequence:
1. GAP:rent-past-due — "Past due" — sent when rent is overdue, with the outstanding balance and a pay link.
2. GAP:gate-access-restricted — "Access restricted" — sent when overstatus triggers gate lockout; tenant can't enter until they pay.
3. GAP:lien-notice — "Lien notice" — sent as the account approaches lien status, directing the tenant to the formal notice / pay-to-cure link.
4. GAP:auction-scheduled — "Auction scheduled" — sent when the unit is scheduled for auction sale, with a final pay-to-redeem link and deadline.

**Access restored on payment**
Confirms the tenant their gate access is back the instant a past-due balance is cleared.
Sequence:
1. GAP:gate-access-restored — "Access restored" — sent when payment clears and the gate controller re-enables the tenant's code.

**Move-out and feedback**
Closes out a vacating tenant and collects a facility review.
Sequence:
1. appointments:post-appointment — "Move-out feedback" — sent after move-out, thanking the tenant and linking a feedback form. STRETCH:appointments:post-appointment ("provider_name" becomes the facility; no clinician framing).

**Contact details check-in**
Keeps tenant contact info current mid-tenancy so collections notices actually reach them.
Sequence:
1. GAP:contact-details-verify — "Update your details" — sent partway through a long tenancy asking the tenant to confirm phone/contact info is current.

**Unit availability notification**
Tells a waiting tenant their desired unit size is now available to rent.
Sequence:
1. GAP:unit-available — "Unit available" — sent when a previously-full unit size opens up, inviting the waiting tenant to reserve.

### Message gaps

**GAP:gate-access-code-issued**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** Access code issued (display alias: "Gate code")
- **Why:** Delivers an operational facility/unit entry PIN at lease signing — distinct from 2FA verification and from order status; specific to physical-access verticals.

**GAP:gate-access-restricted**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** Access restricted (display alias: "Access restricted")
- **Why:** Tells a delinquent tenant their physical gate access is suspended — a storage/access-control-specific consequence with no order or account-events equivalent.

**GAP:gate-access-restored**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** Access restored (display alias: "Access restored")
- **Why:** Confirms physical access is re-enabled after a delinquent balance clears; gate-controller-specific.

**GAP:lien-notice**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** Lien notice (display alias: "Lien notice")
- **Why:** A legally-defined self-storage collections step (statutory lien process) with no generic corpus analog.

**GAP:auction-scheduled**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** Auction scheduled (display alias: "Auction scheduled")
- **Why:** The terminal self-storage lien step (unit sale); storage-law-specific, no corpus home.

**GAP:rent-due-reminder**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:payment-upcoming
- **Proposed universal name:** Upcoming payment reminder
- **Why:** A pre-due recurring-charge reminder is common across subscription/recurring-billing builders, not just storage, and the corpus has no pre-due payment nudge.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Rent of {{amount_due}} is due {{due_date}}. Pay or check autopay here: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Heads up - your {{workspace_name}} rent of {{amount_due}} is due {{due_date}}. Pay here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{amount_due}} rent due {{due_date}}. Pay: {{account_link}} STOP to opt out.`
- **New variables:** `{{amount_due}}` — outstanding/upcoming balance, ~8 chars, source: billing record, example "$129.00". `{{due_date}}` — payment due date, ~12 chars, source: lease billing cycle, example "Jun 28".

**GAP:card-expiring**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:card-expiring
- **Proposed universal name:** Card expiring soon
- **Why:** Any recurring-billing builder needs a pre-emptive card-expiry nudge; corpus only has post-decline payment-failed.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Card ending {{card_last4}} expires soon. Update it to keep autopay active: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} card ending {{card_last4}} is about to expire. Update it here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Card {{card_last4}} expiring. Update: {{account_link}} STOP to opt out.`

**GAP:rent-past-due**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:payment-past-due
- **Proposed universal name:** Payment past due
- **Why:** A post-due balance-overdue notice (distinct from a single declined-charge event) is broadly useful; corpus payment-failed covers the decline, not the ongoing delinquency.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your balance of {{amount_due}} is past due. Pay now to avoid fees: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} balance of {{amount_due}} is past due. Take care of it here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{amount_due}} past due. Pay: {{account_link}} STOP to opt out.`
- **New variables:** `{{amount_due}}` — as above.

**GAP:contact-details-verify**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:contact-details-verify
- **Proposed universal name:** Confirm your contact details
- **Why:** Long-relationship builders need a periodic "are your details current?" nudge; corpus has none.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Please confirm your contact details are current so you don't miss account notices: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Quick check from {{workspace_name}} - are your contact details still current? Confirm here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Confirm your contact details: {{account_link}} STOP to opt out.`

**GAP:unit-available**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** Unit available (display alias: "Unit available")
- **Why:** A specific unit-size-opened notification to a waiting storage tenant; the waitlist category's "Your turn" is generic and link-to-claim, but the storage framing (unit size, facility) is vertical-specific.

**STRETCH:order-updates:order-confirmed**
- **Classification:** Stretch
- **Proposed corpus home:** order-updates:order-confirmed — fits the "confirmed + when" shape, but "Order N confirmed, arrives {{estimated_delivery}}" must reframe to a reservation with a move-in date rather than a shipped order.
- **Proposed universal name:** Order confirmed (reused as "Reservation confirmed")
- **Why:** A reservation is a confirmation event but carries no order number or delivery date.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Reservation for {{unit_label}} confirmed. Move in by {{move_in_by}}. We'll text your gate code. Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} reservation for {{unit_label}} is set - move in by {{move_in_by}}, gate code to follow. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{unit_label}} reserved. Move in by {{move_in_by}}. STOP to opt out.`
- **New variables:** `{{unit_label}}` — unit number/size, ~10 chars, source: inventory record, example "5x10 #214". `{{move_in_by}}` — hold expiry/move-in deadline, ~12 chars, source: reservation hold, example "Jun 24".

**STRETCH:waitlist:grace-expiring**
- **Classification:** Stretch
- **Proposed corpus home:** waitlist:grace-expiring — the grace-window mechanic fits a reservation hold, but copy must say "complete your reservation" not "claim your spot."
- **Proposed universal name:** Grace expiring (reused as "Reservation expiring")
- **Why:** A reservation hold is a grace window, but the tenant is completing a booking, not claiming a queue position.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your reservation is held for {{grace_window}}. Complete your move-in: {{claim_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} reservation is held for the next {{grace_window}}. Finish here: {{claim_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{grace_window}} left to complete reservation. {{claim_link}} STOP to opt out.`

**STRETCH:appointments:post-appointment**
- **Classification:** Stretch
- **Proposed corpus home:** appointments:post-appointment — fits a post-move-out feedback ask, but `{{provider_name}}` becomes the facility and there's no clinician/visit framing.
- **Proposed universal name:** Post-appointment (reused as "Move-out feedback")
- **Why:** A move-out is the end of a tenancy, not a visit with a provider, but the feedback-collection shape matches.

### Content constraints
- Standard carrier rules apply. Gate/unit access codes are operational facility entry credentials, NOT phone-ownership 2FA — do not route them through the verification (2FA) category or claim the 2FA TCR carve-out for them; treat them as account/order-style notifications that carry STOP language.
- Lien-notice and auction SMS are reminders/pointers, not the legal notice itself — statutory lien notice still requires the email/certified-mail/USPS channel the law specifies; SMS must not be presented as satisfying the legal notice requirement.
- Past-due, lien, and auction messages are transactional account notifications, not marketing — keep them factual (balance, pay link, deadline), no promotional or offer content.
- Only first-month-free / referral / availability re-marketing belongs in the marketing category (separate explicit consent, EIN-gated); never blend a promo into a collections or access message.
- Access codes and payment links in body are fine; never put full card numbers or account credentials in the body.

### Disambiguation
Self-storage software neighbors property-management / landlord-tenant SaaS and equipment-rental SaaS. What keeps it Clear is that storage is short-cycle, self-serve, recurring-billing tenant communication — reminders, collections, access codes — rather than the regulated long-lease residential tenant relationship. The trap that looks allowed but isn't: routing gate/unit access codes as 2FA verification messages to grab the no-STOP carve-out — these are operational access credentials, not phone-ownership proof, so they are not 2FA and must carry STOP. The other trap is treating an SMS lien/auction reminder as the statutory legal notice; it is a pointer to the notice, and the law's required channel is separate. A move into Conditional would come only if the software handled regulated residential housing notices (eviction, fair-housing-governed tenancy), which storage operators do not.

### Sources
https://www.storman.com/sms-for-self-storage-facilities/
https://www.selfstoragemanager.com/contents/Paymentsalerts.aspx
https://www.storagecommander.com/features/self-storage-sms
https://www.sitelink.com/marketplace/sms
https://www.sitelink.com/marketplace/tenant-notifications
https://www.sitelink.com/marketplace/tenant-notifications/storage-collections
https://www.sitelink.com/marketplace/gate-access
https://www.storable.com/products/collections/
https://www.storable.com/resources/self-storage-automation-improves-self-storage-business/
https://www.spiderdoor.com/self-storage-collection-software/
https://www.sparefoot.com/blog/understanding-the-self-storage-lien-process
https://www.davincisolutions.com/automated-self-storage-access
https://www.modernstoragemedia.com/blog-post/self-storage-operators-use-text-messaging-to-communicate-more-reliably-lower-delinquencies
https://www.infobip.com/blog/tcpa-compliance-sms
