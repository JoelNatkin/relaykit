## Short-term rental management (Airbnb-host tooling)
**Vertical:** Retail & hospitality
**Bucket:** Clear
**URL slug:** /for/short-term-rentals

### What this builder is making
A property-management tool for an independent Airbnb/Vrbo host or small short-term-rental operator — a Guesty/Hospitable/Lodgify-for-the-little-guy that syncs reservations from OTAs, automates the guest message timeline (booking → pre-arrival → check-in → checkout → review), delivers door/lock access codes, and generates a cleaning turnover task on every checkout. It tracks reservations as dated stays against a property, holds per-property access codes and house instructions, and coordinates a cleaner roster between guests. It is the operating layer for a handful of whole-home rentals, distinct from a hotel PMS (rooms, front desk, nightly turnover) and from long-term residential property management (leases, rent, tenants).

### Why they need SMS
The single most expensive moment is the late-night "how do I get in?" — a guest standing in a dark driveway who never opened the pre-arrival email and can't find the lockbox code, generating a frantic call to the host and a one-star review. SMS wins because access codes and check-in instructions have to land on the phone the guest is holding at the door, not in an inbox they last checked before their flight. The same timeline-triggered reliability recovers checkout (secure-the-home reminders that protect the next turnover) and lifts review rates 20-30% with a same-day nudge while the stay is fresh.

### Message categories
1. appointments — the reservation/stay timeline (booking confirmation, pre-arrival reminder, post-stay review request) behaves like an appointment lifecycle against a dated stay
2. team-alerts — cleaner turnover dispatch: a checkout generates a cleaning task assigned to a housekeeper, with shift-style scheduled/reminder/change pings
3. account-events — the host's own SaaS billing/lifecycle with the tooling (payment failed, trial ending, subscription) — the builder's paying customer is the host
4. customer-support — two-way guest issue handling during the stay (broken wifi, AC out) rides the transactional thread; ticket lifecycle is light
Excluded: order-updates (no shipping/delivery commerce — a stay is not a parcel), community (no membership/community layer between one-time guests), waitlist (no queue-for-a-spot model — stays are booked dates, not a standby line), verification (a door/lock access code is operational, NOT 2FA — do not map it to verification:verification-code; the host tool has no high-assurance guest login), marketing (real repeat-guest/direct-booking win-back exists but is EIN-gated second registration — see Disambiguation, not a primary transactional category)

### Workflows

**Booking confirmation**
Acknowledges a confirmed reservation the moment it syncs from the OTA or direct-booking site, setting expectations for the stay.
Sequence:
1. appointments:confirmation — "Booking confirmation" — sent when a reservation is confirmed; "your stay at [property] is booked for [dates]"
Variable aliases:
- provider_name: STRETCH — a stay is with the property, not a named person (see Message gaps)
- appointment_time: "Jun 14-18, 3 PM check-in"

**Pre-arrival check-in instructions**
The most load-bearing message in the timeline: delivers everything the guest needs to arrive and get in — address, parking, door/lock code, wifi — 24-48h before and again the morning of check-in.
Sequence:
1. appointments:reminder-distant — "Pre-arrival" — sent 24-48h before; "check-in is [date] — here's how to find and enter the home"
2. GAP:check-in-instructions — "Check-in details" — the morning of arrival; address, parking, gate code, wifi (see Message gaps)
3. GAP:access-code-delivery — "Door code" — at/near check-in time; delivers the lockbox/smart-lock code (operational access, not 2FA) (see Message gaps)
Variable aliases:
- appointment_time: "today, 3 PM check-in"
- reschedule_link: "tap for full check-in guide"

**Checkout reminder and home-securing**
The evening before and morning of departure: reminds the guest of checkout time and the secure-the-home steps that protect the next turnover.
Sequence:
1. GAP:checkout-reminder — "Checkout" — evening before / morning of; "checkout is [time] — lock up, windows closed, key back in the box" (see Message gaps)
Variable aliases:
- appointment_time: "tomorrow, 11 AM checkout"

**Post-stay review request**
Captures a rating while the stay is fresh, lifting review rates with a same-day nudge after checkout.
Sequence:
1. appointments:post-appointment — "Review request" — sent the afternoon of checkout; "thanks for staying — we'd love your review"
Variable aliases:
- provider_name: STRETCH — phrase as "thanks for staying at [property]," no named provider (see Message gaps)
- feedback_link: "tap to leave a review"

**Mid-stay guest issue / two-way support**
Handles a problem during the stay (AC out, no hot water, wifi down) over the transactional thread the guest already has.
Sequence:
1. customer-support:proactive-outreach — "Host" — optional; "settling in OK? Reply if you need anything"
2. customer-support:ticket-received — "Host" — when the guest reports an issue; "got it — we're on it"
3. customer-support:resolution-notification — "Host" — when the fix is done; "all sorted — anything else?"
Variable aliases:
- ticket_number: "your request"
- agent_name: "your host" / property manager's name

**Cleaner turnover dispatch**
Turns every checkout into a cleaning job: assigns the turnover to a housekeeper with the property, window, and checklist, and pings on changes.
Sequence:
1. team-alerts:shift-scheduled — "Turnover" — when a checkout generates a cleaning task; "you're on [property], [date], 11 AM-3 PM window"
2. team-alerts:shift-reminder — "Turnover" — morning of; "turnover today at [property], guest out 11 AM"
3. team-alerts:shift-change — "Turnover" — when a same-day booking or late checkout moves the window
4. team-alerts:shift-cancellation — "Turnover" — when a booking cancels and the cleaning is no longer needed
Variable aliases:
- location: "[property address / unit name]"
- role: "cleaner" / "housekeeper"
- shift_time: "11 AM-3 PM turnover window"

**Turnover-complete owner notification**
Closes the loop for a managed-property owner: the cleaning is done and the home is guest-ready.
Sequence:
1. GAP:turnover-complete — "Turnover" — when the cleaner marks the task done; "[property] is cleaned and ready for the next guest" (see Message gaps)
Variable aliases:
- location: "[property name]"

**Host SaaS billing and lifecycle**
The builder's own subscription relationship with the host — the churn-critical messages missed in email.
Sequence:
1. account-events:payment-failed — "[Tool name]" — host's card declined; "update payment to keep your listings synced"
2. account-events:trial-ending — "[Tool name]" — trial winding down
3. account-events:subscription-confirmed — "[Tool name]" — renewal or plan change confirmed
Variable aliases:
- workspace_name: "[the host tool's name]"

### Message gaps

**GAP:check-in-instructions**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** Check-in details (display alias)
- **Why:** a bundled arrival-logistics message (address, parking, gate code, wifi) is specific to lodging/short-term-rental and has no general corpus equivalent

**GAP:access-code-delivery**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** Access code (display alias)
- **Why:** delivering an operational door/lockbox/smart-lock code is a lodging-access event, not 2FA and not an appointment — it has no corpus home and must not be mapped to verification:verification-code

**GAP:checkout-reminder**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** Checkout reminder (display alias)
- **Why:** a departure-time + secure-the-home reminder is a lodging-turnover event with no general appointments equivalent (it is not a reschedule, cancel, or feedback step)

**GAP:turnover-complete**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** Turnover complete (display alias)
- **Why:** "cleaning done, property guest-ready" is a property-ops status to the owner/manager, narrower than any team-alerts shift state

**STRETCH:appointments:confirmation** (and the appointments reminder/post-stay family)
- **Classification:** Stretch
- **Proposed corpus home:** appointments:confirmation — the fit gap is `{{provider_name}}` (assumes a named practitioner) and `{{appointment_time}}` (assumes a point in time); a stay is with a property across a date range
- **Proposed universal name:** Appointment confirmation (used as "Booking confirmation" alias here)
- **Why:** every appointments body interpolating `{{provider_name}}` reads awkwardly for a whole-home stay ("your appointment with [name]"), and a stay spans nights rather than a single slot
- **Draft variants:**
  - Standard: `{{workspace_name}}: your stay at {{property_name}} is confirmed for {{stay_dates}}. Reply STOP to opt out.`
  - Friendly: `You're booked! Your stay at {{property_name}} is set for {{stay_dates}}. See you soon. Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: stay confirmed, {{property_name}}, {{stay_dates}}. STOP to opt out.`
- **New variables:** `{{property_name}}` — the listing/home name or short address, budget ~24 chars, source: reservation record, example "Cedar Cabin"; `{{stay_dates}}` — the check-in to checkout range, budget ~18 chars, source: reservation record, example "Jun 14-18"

### Content constraints
- All guest messages (confirmation, pre-arrival, access code, checkout, review request) are transactional and ride implied consent from the booking — but consent context matters: an OTA (Airbnb/Booking.com/Vrbo) collected the guest's number in the OTA's own consent context, so the host is the A2P sender and bears the obligation to capture consent through its own channel before texting OTA-sourced guests directly.
- Carriers block 100% of unregistered A2P 10DLC traffic — the host (or the tooling on the host's behalf) needs a registered brand and campaign regardless of property count or volume; surface registration before first send.
- Access-code delivery is operational lodging access, NOT 2FA — it does not get the verification 2FA carve-out and must carry STOP/HELP language like any transactional message.
- The post-stay review request is transactional feedback, not promotion — keep it to "we'd love your review," never bundle a discount or direct-booking offer (that converts it to marketing).
- Repeat-guest win-back, off-platform direct-booking offers, and seasonal promotions are promotional content: separate explicit written opt-in, EIN-gated second campaign registration, SHAFT-C applies (no promoting a hot-tub "drinks included" package via SMS marketing).
- Two-way guest reply (guest texts "the heat's not working," host replies) is permitted on the transactional thread under implied consent — surface as a feature, not a separate opt-in. Honor STOP immediately per category; a cleaner who opts out of turnover pings must not be silently dropped from dispatch without a fallback.

### Disambiguation
Airbnb-host/property-manager tooling looks adjacent to a hotel PMS (the sibling entry) but differs in unit model and timeline: a hotel runs rooms with a front desk, same-day arrivals, and nightly housekeeping, while a short-term-rental operator runs whole homes with a multi-night stay, self-check-in via lockbox/smart-lock, and a between-guest turnover — the door-code-delivery and cleaner-dispatch workflows are the tell. It is sharply distinct from long-term residential property management (the tenant/rent family): that surface texts about lease renewals, rent-due reminders, maintenance requests, and rent-payment failures against months-long tenancies, not nightly stays — if the messages are about rent and leases, it is not this sub-vertical. What tips Clear→Conditional is scale and consent source: a large multi-property manager texting hundreds of OTA-sourced guests is a heavier registration story and leans on the OTA-consent-gap risk above. What looks allowed but isn't: treating the door/lock access code as a verification code to inherit the 2FA carve-out (it is operational access, keeps STOP/HELP), and folding a "book direct next time, 10% off" line into the checkout or review message (that is EIN-gated marketing, not transactional).

### Sources
https://www.lodgify.com/automation-tools/
https://www.lodgify.com/blog/vacation-rental-text-messaging/
https://www.guesty.com/blog/creating-automated-messages-with-guesty/
https://hospitable.com/automating-guest-communication-for-short-term-rentals
https://hospitable.com/str-message-flow
https://www.ownerrez.com/vacation-rental-sms-text-messaging
https://textus.com/texting-guides/sms-templates-for-vacation-rental-management
https://www.hostfully.com/blog/automated-messaging-vacation-rentals/
https://www.ruebarue.com/blog/text-messaging-vacation-rentals/
https://www.hostaway.com/blog/airbnb-guest-messaging-templates/
https://www.airbnb.com/help/article/2897
https://www.minut.com/blog/airbnb-message-templates
https://www.guesty.com/blog/automate-cleaning-strs/
https://turno.com/
https://www.breezeway.io/blog/vacation-rental-cleaning-practices
https://mytcrplus.com/10dlc-for-motels-guest-sms-compliance-and-registration-guide/
https://www.infobip.com/blog/tcpa-compliance-sms
https://help.twilio.com/articles/4408675845019-SMS-Compliance-and-A2P-10DLC-in-the-US
