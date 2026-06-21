## Public transit / mass transit operational
**Vertical:** Civic & public sector
**Bucket:** Clear
**URL slug:** /for/public-transit

### What this builder is making
Transit-tech software that runs rider-facing operations for an agency or operator — either fixed-route service (buses, light rail) pushing GTFS-realtime service alerts, delays, and detours to riders who subscribe by route or stop, or demand-response service (paratransit, microtransit, on-demand shuttles) that books individual trips and dispatches vehicles to specific pickups. The platform tracks routes, trips, vehicle locations, ETAs, and (on the demand-response side) per-rider bookings and pickup windows. SMS is the channel for everything time-sensitive: alerts to subscribed riders and trip status to booked passengers.

### Why they need SMS
A paratransit rider waiting at the curb needs to know the vehicle is ten minutes out, and many riders are seniors or people with disabilities who do not run a transit app in the foreground — a text reaches them where push and email do not. On the fixed-route side, a detour or major delay is only useful if it lands before the rider leaves for the stop, and "standard text messaging charges may apply" alerts are the format riders already expect from agencies. SMS wins because transit notifications are urgent, glanceable, and go to a population that skews toward plain phones over apps.

### Message categories
1. appointments — the closest corpus fit for booked demand-response trips: a trip is a scheduled time-and-place event with confirmation, day-before reminder, imminent reminder, reschedule, cancellation, and no-show follow-up (paratransit's defining problem)
2. customer-support — service-status-alert is the spine of fixed-route disruption communication (delays, detours, stop closures, service issues), plus account-issue-resolved patterns for booking corrections
3. waitlist — demand-response systems run rider standby/queue when a trip slot opens; joined → almost-up → your-turn maps to standby-trip flows
4. account-events — rider-account lifecycle (registration, eligibility, suspension for repeated no-shows is common in ADA paratransit)
5. verification — phone-ownership at rider signup for the agency app/booking line
Excluded: order-updates (no physical goods/parcels), team-alerts (driver/dispatcher ops, not rider-facing — out of scope for this rider-facing builder), community (no membership/social layer), marketing (agencies run civic notice, not promotional SMS — and marketing is EIN-gated/separate consent)

### Workflows

**Demand-response trip lifecycle (paratransit / microtransit booking)**
The booked-trip flow from reservation through pickup, the core of paratransit and on-demand transit communication.
Sequence:
1. appointments:confirmation — "Trip booked" — sent when a trip reservation is accepted, states the scheduled pickup time and place
2. appointments:reminder-distant — "Trip reminder (day before)" — sent the night before; paratransit reminders the day before sharply reduce no-shows and let riders cancel early
3. appointments:reminder-proximate — "Pickup soon" — sent shortly before the pickup window opens so the rider is ready at the curb
4. GAP:vehicle-arriving — "Vehicle arriving" — the ~10-minutes-out / "5 minutes away" arrival ping is the single most-cited paratransit text and has no clean corpus message
5. appointments:no-show-follow-up — "We missed you" — sent after a missed pickup; relevant because repeated no-shows carry eligibility consequences in ADA paratransit
Variable aliases (only where default would feel wrong):
- provider_name: "your driver" (or omit — paratransit trips are not tied to a named provider)
- appointment_time: "8:15 AM, 120 Main St pickup"
- reschedule_link: "rebook your trip"

**Trip reschedule / cancellation**
A booked rider changes or cancels a trip, by phone, app, or reply.
Sequence:
1. appointments:reschedule-confirmation — "Trip rescheduled" — confirms the new pickup time and place
2. appointments:cancellation-confirmation — "Trip cancelled" — confirms a cancelled trip; dispatchers need riders to cancel rather than no-show
Variable aliases (only where default would feel wrong):
- appointment_time: "tomorrow, 2:30 PM pickup"

**Fixed-route service disruption alert**
A rider subscribed to a route or stop is notified of a delay, detour, or closure — the GTFS-realtime alert use case.
Sequence:
1. customer-support:service-status-alert — "Service alert" — sent to riders subscribed to the affected route/stop when a delay over the agency threshold, detour, or stop closure is published
2. customer-support:account-issue-resolved — "Service restored" — sent when the disruption clears (reframe: "issue on your account" → "service on your route")
Variable aliases (only where default would feel wrong):
- eta: "service resumes ~6:15 PM"

**Standby / waitlisted trip (demand-response capacity)**
A requested trip slot is full and the rider waits for an opening — common in capacity-constrained microtransit and same-day paratransit.
Sequence:
1. waitlist:joined — "On the standby list" — confirms the rider is queued for a trip slot
2. waitlist:almost-up — "A trip slot may open soon" — sent as capacity approaches
3. waitlist:your-turn — "Trip slot available" — sent when a slot opens, with a claim/confirm link
4. waitlist:grace-expiring — "Claim your trip slot" — sent when the offered slot is about to be released
5. waitlist:missed — "Slot released" — sent when the slot lapses unclaimed, with a rejoin option
Variable aliases (only where default would feel wrong):
- wait_estimate: "the next pickup window"
- claim_link: "confirm your trip"

**Rider onboarding / account**
A new rider registers for the agency's booking app or alert subscriptions.
Sequence:
1. verification:verification-code — "Verification code" — phone-ownership check at signup
2. account-events:subscription-confirmed — "Alerts confirmed" — confirms route/stop alert subscription is active (reframe: subscription = alert subscription, not billing)
3. account-events:account-suspended — "Account suspended" — sent when a rider account is suspended (repeated no-shows trigger eligibility suspension in ADA paratransit)
Variable aliases (only where default would feel wrong):
- account_link: "manage your alerts"

### Message gaps

**GAP:vehicle-arriving**
- **Classification:** Vertical-specific
- **Proposed corpus home:** appointments:vehicle-arriving (or sub-vertical registry layer alias on a proximate-arrival message)
- **Proposed universal name:** "Vehicle arriving" (display alias)
- **Why:** the "~10 minutes out / 5 minutes away" arrival ping is the defining paratransit/microtransit text and no corpus message carries live vehicle-arrival semantics — reminder-proximate is time-before-appointment, not vehicle-proximity
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your ride is about {{arrival_estimate}} away from {{pickup_location}}. Please be ready. Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: Heads up - your ride is about {{arrival_estimate}} out from {{pickup_location}}. See you soon! Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Ride ~{{arrival_estimate}} from {{pickup_location}}. Be ready. STOP to opt out.`
- **New variables:** `arrival_estimate` ("10 min"), `pickup_location` ("120 Main St")

**STRETCH:customer-support:account-issue-resolved**
- **Classification:** Stretch
- **Proposed corpus home:** customer-support:account-issue-resolved, used as a "service restored" notice
- **Proposed universal name:** "Service restored"
- **Why:** the corpus message frames a fixed account problem; transit reuses it to signal a route/service disruption has cleared, which is a meaningful reframe of the subject
- **Draft variants:**
  - Standard: `{{workspace_name}}: Service on {{route_name}} is back to normal. Thanks for your patience. Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: Good news - {{route_name}} is running normally again. Thanks for hanging in there. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{route_name}} back to normal. STOP to opt out.`
- **New variables:** `route_name` ("Route 12")

### Content constraints
- Standard carrier rules apply. No vertical-specific content restrictions for operational rider notifications.
- Rider alert subscriptions and trip-booking notifications are transactional/operational (TCR ACCOUNT_NOTIFICATION-class) — keep promotional content out; agency civic/promotional messaging would need separate marketing consent and is EIN-gated.
- Honor explicit opt-in per route/stop subscription and per-rider booking consent; STOP/HELP must work on every operational message.
- Government/agency senders should register the operating entity's brand accurately; many high-volume agencies use short codes, but 10DLC applies to the operational/booking traffic in scope here.

### Disambiguation
This sub-vertical is the rider-facing operational layer of public/mass transit — agencies and the transit-tech platforms that serve them (TransLoc, Via, Spare, Ecolane, TripSpark, Passio, Swiftly). It is distinct from ride-hail/rideshare consumer marketplaces (Uber/Lyft-style), which are private peer-matched services with their own driver/passenger messaging patterns and are not public transit. It also overlaps with, but is not, logistics/fleet software: transit moves people on routes and booked trips, not parcels — anything parcel/shipment-shaped belongs in order-updates and a logistics sub-vertical. Driver- and dispatcher-facing operations (shift dispatch, on-call) live in team-alerts and a separate operational/workforce sub-vertical; this entry covers only the rider side.

### Sources
https://blog.optibus.com/service-alerts-build-rider-trust
https://www.goswift.ly/blog/introducing-swiftlys-rider-alerts
https://transitfare.com/transit-alerts
https://www.sharemobility.com/solutions/public-transit
https://transloc.com/solutions/on-demand-microtransit/
https://spare.com/solutions/microtransit
https://ridewithvia.com/resources/3-questions-to-ask-before-investing-in-new-paratransit-software
https://www.tripspark.com/paratransit-demand-response-software/notifications/
https://www.ecolane.com/blog/how-to-choose-your-next-paratransit-scheduling-software-provider
https://www.rideco.com/paratransit/reservations
https://www.westchestercountyny.gov/all-press-releases/westchester-county-paratransit-service-to-transition-to-rider-smart-phone-app-bee-line-paratransit
https://www.rtcsnv.com/ways-to-travel/paratransit-accessibility/paratransit-trip-planning/
https://dredf.org/ADAtg/noshow.shtml
https://www.ridemetro.org/alerts/text-and-email-alerts-newsletters
https://www.metrotransit.org/rider-alerts
https://www.twilio.com/docs/messaging/compliance/a2p-10dlc
