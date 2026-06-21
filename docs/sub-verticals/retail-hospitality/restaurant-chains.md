## Restaurant chains / multi-location ops
**Vertical:** Retail & hospitality
**Bucket:** Clear
**URL slug:** /for/restaurant-chains

### What this builder is making
A multi-location restaurant operations platform — online ordering, pickup/curbside, a centralized loyalty program, and reservation/waitlist tooling that runs across many venues under one parent brand (the Toast/Olo/Vibes shape, not a single host stand). Each location keeps its own order queue, table book, and staff roster, but loyalty enrollment, promotional broadcasts, and customer profiles are centralized so a guest is "one customer" across every store. The builder routes every customer message to the right location's sender identity and routes staff messages to the right venue's schedule.

### Why they need SMS
The order-ahead pickup window is the make-or-break moment: a QSR or fast-casual guest who placed a mobile order needs the "your order is ready" text the instant it hits the counter, or it sits under the heat lamp and the next order backs up. SMS wins because a guest waiting curbside or wandering a food hall will not refresh an app, and the 90%-in-three-seconds read speed is what keeps a multi-location pickup line moving. Centralized loyalty adds a second reason — a 51x-ROI promotional broadcast that a chain can segment by location, which only lands as SMS.

### Message categories
1. order-updates — the order-ahead / pickup / curbside lifecycle, the highest-volume transactional use across every QSR and fast-casual location
2. marketing — centralized loyalty rewards and location-segmented promotional broadcasts; the defining addition vs. the single-location sibling (separate consent, EIN-gated under the parent brand)
3. appointments — reservations behave as appointments at full-service locations: confirmation, day-before and proximate reminders, reschedule, cancellation, no-show
4. waitlist — the walk-in "table ready" page loop at sit-down locations on a busy night
5. team-alerts — per-location staff shift scheduling, reminders, and call-out coverage pings
Excluded: account-events (no consumer billing/subscription relationship with diners), community (loyalty membership is a marketing/rewards relationship, not a community feed), customer-support (guest questions ride two-way reply on the transactional thread, not a ticketing model), verification (no high-assurance login/2FA need for diners)

### Workflows

**Order-ahead pickup and curbside loop**
The core multi-location transactional loop: tells a mobile-order guest when food is being made and the instant it's ready at their specific location, so it doesn't sit under the heat lamp.
Sequence:
1. order-updates:order-confirmed — "Order" — sent when the online/app order is placed and paid; "order #1042 confirmed at [location], ready ~6:15 PM"
2. order-updates:order-processing — "Order" — optional; "your order is being prepared"
3. GAP:order-ready-for-pickup — "Order ready" — sent when the order is bagged at the counter; the central event for QSR/curbside
4. GAP:guest-arrival-checkin — "Arrived?" — sent on curbside orders asking the guest to reply with their car/space so staff can run it out
Variable aliases:
- order_number: "#1042"
- estimated_delivery: "ready ~6:15 PM at Downtown"
- workspace_name: "Joe's — Downtown" (per-location sender frame, not the parent brand alone)

**Order delay / problem notice**
Keeps a waiting guest informed when a location's kitchen falls behind or an item is 86'd, preventing an angry no-pickup.
Sequence:
1. GAP:order-delayed — "Order update" — sent when prep runs long; "running ~10 min behind, sorry"
Variable aliases:
- order_number: "#1042"

**Reservation confirmation and reminder (full-service locations)**
Locks in a booked table at a sit-down location and recovers the forgetful no-show with a day-before nudge.
Sequence:
1. appointments:confirmation — "Reservation" — sent when the booking is made; "your table for 4 at [location] is confirmed for Fri 7:00 PM"
2. appointments:reminder-distant — "Reservation reminder" — sent the day before; includes a cancel link to free the table early
3. appointments:reminder-proximate — "Reservation reminder" — sent ~1-2 hours before; "your table is in about an hour"
Variable aliases:
- provider_name: STRETCH — a table booking is with the venue/location, not a named provider (see Message gaps)
- appointment_time: "Fri 7:00 PM, party of 4, Downtown"
- cancel_link: "tap to release your table"

**Reservation change and cancellation**
Keeps each location's book accurate when a guest moves or drops a booking, freeing the table for walk-ins.
Sequence:
1. appointments:reschedule-confirmation — "Reservation" — sent when the booking time/party changes; "moved to Sat 8:00 PM at Downtown"
2. appointments:cancellation-confirmation — "Reservation" — sent on cancel; offers to rebook
Variable aliases:
- appointment_time: "Sat 8:00 PM, party of 4, Downtown"
- reschedule_link: "tap to rebook"

**No-show recovery**
Re-engages a party that didn't show at a location, recovering the relationship rather than the cover.
Sequence:
1. appointments:no-show-follow-up — "Reservation" — sent after a missed booking; "we missed you — want to rebook?"
Variable aliases:
- provider_name: STRETCH — "we missed you today" reads fine without a provider name (see Message gaps)

**Post-visit feedback / review request**
Captures a rating tied to the specific location while the meal is fresh, generated from order or reservation data.
Sequence:
1. appointments:post-appointment — "Feedback" — sent after the visit; "thanks for dining at [location] — how was it?"
Variable aliases:
- provider_name: STRETCH — phrase as "thanks for dining with us" rather than naming a provider (see Message gaps)
- feedback_link: "tap to leave a quick review"

**Walk-in waitlist page loop (sit-down locations)**
Turns the crowded waiting area at a busy sit-down location into a phone page so guests can wander and still be seated on time.
Sequence:
1. waitlist:joined — "Waitlist" — sent when the party joins via QR scan, host stand, or text-in
2. waitlist:position-update — "Waitlist" — "you're now 2 parties away"
3. waitlist:almost-up — "Waitlist" — "about 5 min, head back"
4. waitlist:your-turn — "Table ready" — the page: "your table is ready, see the host"
5. waitlist:grace-expiring — "Table ready" — "we'll hold your table for 5 more min"
6. waitlist:missed — "Waitlist" — sent when the party doesn't return; offers to rejoin
Variable aliases:
- queue_position: "2 parties ahead"
- wait_estimate: "about 5 minutes"
- grace_window: "5 minutes"
- workspace_name: "Joe's — Downtown" (per-location sender frame)

**Loyalty reward earned / available (MARKETING)**
The centralized loyalty lane: tells an enrolled member a reward is available so they redeem it — promotional content, separate consent, EIN-gated under the parent brand.
Sequence:
1. marketing:promotional-offer — "Rewards" — sent when a member earns or unlocks a reward; "free entrée unlocked — redeem at any location"
Variable aliases:
- business_name: "Joe's Rewards" (parent-brand loyalty frame)
- offer: "free entrée — you've earned it"
- offer_link: "redeem in the app"

**Location-segmented promotional broadcast (MARKETING)**
The chain's central marketing engine: a flash sale or LTO sent only to members near a given location, the highest-value reason a multi-location brand wants SMS.
Sequence:
1. marketing:promotional-offer — "Offer" — "Downtown only: 2-for-1 tacos today 4-7 PM"
2. marketing:product-launch — "New" — sent when a new menu item or LTO drops chain-wide
3. marketing:re-engagement — "We miss you" — win-back to a member who hasn't ordered in 60 days
Variable aliases:
- business_name: "Joe's" (parent brand)
- offer: "2-for-1 tacos, Downtown, today 4-7 PM"
- launch_name: "the new Birria Bowl"

**Staff shift scheduling and call-out coverage (per location)**
Keeps each venue's hosts, servers, and line cooks aligned on who works when, and fills a gap fast when someone calls out — routed to the right location's roster.
Sequence:
1. team-alerts:shift-scheduled — "Schedule" — "you're on Fri 5-11 PM at Downtown as server"
2. team-alerts:shift-reminder — "Schedule" — "your shift at Downtown starts at 5 PM"
3. team-alerts:shift-change — "Schedule" — sent when a shift is swapped or moved
4. team-alerts:shift-cancellation — "Schedule" — sent when a shift is cut or a call-out frees a slot
Variable aliases:
- location: "Downtown" / "Airport" (the actual venue, the variable's native use)
- role: "server" / "host" / "line cook"
- shift_time: "5:00-11:00 PM"

### Message gaps

**GAP:order-ready-for-pickup**
- **Classification:** Universal miss
- **Proposed corpus home:** order-updates:order-ready-for-pickup
- **Proposed universal name:** Order ready for pickup
- **Why:** the order-updates lifecycle covers shipping/delivery but has no in-store/counter "your order is ready to collect now" state, the central event for QSR pickup, curbside, BOPIS, and pharmacy
- **Draft variants:**
  - Standard: `{{workspace_name}}: Order {{order_number}} is ready for pickup. Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} order {{order_number}} is ready — come grab it whenever you like. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Order {{order_number}} ready for pickup. STOP to opt out.`

**GAP:guest-arrival-checkin**
- **Classification:** Universal miss
- **Proposed corpus home:** order-updates:arrival-checkin
- **Proposed universal name:** Arrival check-in
- **Why:** curbside and BOPIS need a two-way "you're here? reply with your spot/car" message so staff run the order out; nothing in order-updates prompts the guest to signal arrival
- **Draft variants:**
  - Standard: `{{workspace_name}}: Here for order {{order_number}}? Reply with your parking spot and we'll bring it out. Reply STOP to opt out.`
  - Friendly: `Picking up {{order_number}} at {{workspace_name}}? Reply with your spot or car and we'll run it out. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Order {{order_number}} — reply with your spot. STOP to opt out.`

**GAP:order-delayed**
- **Classification:** Universal miss
- **Proposed corpus home:** order-updates:order-delayed
- **Proposed universal name:** Order delayed
- **Why:** the order lifecycle has no "running behind" state; a delay notice is a core transactional courtesy for food pickup, retail, and delivery alike
- **Draft variants:**
  - Standard: `{{workspace_name}}: Order {{order_number}} is running about {{delay_estimate}} behind. Thanks for your patience. Reply STOP to opt out.`
  - Friendly: `Sorry — your {{workspace_name}} order {{order_number}} needs about {{delay_estimate}} more. We'll text when it's ready. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Order {{order_number}} ~{{delay_estimate}} behind. STOP to opt out.`
- **New variables:** `{{delay_estimate}}` — how far behind the order is running, budget ~10 chars, source: kitchen/prep system, example "10 min"

**STRETCH:appointments:confirmation** (and the appointments reminder/no-show/post family)
- **Classification:** Stretch
- **Proposed corpus home:** appointments:confirmation — the fit gap is the `{{provider_name}}` variable, which assumes a named practitioner; a chain reservation is with the venue/location, not a person
- **Proposed universal name:** Appointment confirmation (used as "Reservation confirmation" alias here)
- **Why:** every appointments body that interpolates `{{provider_name}}` reads awkwardly for a table booking; the variable should be droppable or aliased to the location name
- **Draft variants:**
  - Standard: `{{workspace_name}}: your table for {{appointment_time}} is confirmed. Reply STOP to opt out.`
  - Friendly: `You're booked! Your table is set for {{appointment_time}}. See you then. Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: table confirmed, {{appointment_time}}. STOP to opt out.`

### Content constraints
- Transactional order/pickup/curbside, reservation, waitlist, and staff messages ride implied/transactional consent from the order or check-in; per-location sender identity (`{{workspace_name}}` = "Brand — Location") must be in every body so the guest knows which store is texting.
- Loyalty rewards and promotional broadcasts are the marketing category — separate explicit written opt-in, separate EIN-gated campaign registration under the parent brand, never folded into an order-ready or reservation thread.
- One-to-one consent (FCC, late 2023): a loyalty opt-in collected at one location cannot be a blanket cross-affiliate or cross-brand consent; the consent is to the registered brand, captured per member.
- SHAFT-C applies to marketing: a chain with a bar cannot promote alcohol offers (happy-hour drink specials) via SMS marketing — the "A" in SHAFT. Transactional messages that merely name the venue are fine.
- Two-way reply (guest texts "running late" / replies with curbside spot; staff texts "can't make my shift") is permitted on the transactional thread under implied consent — surface it as a feature, not a separate opt-in.
- Honor STOP per-brand and immediately; a staff shift opt-out must not silently drop a worker from a location's scheduling pages without a fallback channel.

### Disambiguation
The single-location independents entry (`/for/restaurants`) is one restaurant whose host stand, kitchen, and book live in one workspace, and there the marketing/loyalty lane is a real-but-secondary aside. This entry is the multi-location sibling: the loyalty/promotional broadcast is a *primary* category, because a chain's whole reason to centralize is the segment-by-location rewards engine, and every message needs per-location sender identity and routing that a single venue never thinks about. The heavier registration story (a large parent EIN, higher throughput, the parent brand owning loyalty consent) makes the marketing lane operationally central rather than an afterthought. What looks allowed but isn't: treating the loyalty "reward earned" or "we miss you" message as transactional because it rides the same customer profile — it is promotional content (the marketing category), needs the separate EIN-gated consent, and cannot be bundled into a transactional order-ready or reservation thread. Tipping from this entry back toward the single-location one is simply the absence of centralized loyalty and per-location routing.

### Sources
https://www.slicktext.com/use-cases/restaurants
https://www.slicktext.com/blog/2026/01/best-restaurant-sms-marketing-services/
https://blog.simpleloyalty.com/restaurant-sms-marketing-software/
https://www.vibes.com/solutions/industries/restaurants
https://messageiq.io/blog/sms-marketing-for-restaurants/
https://www.zigpoll.com/content/how-can-i-implement-sms-marketing-automation-to-personalize-promotions-and-enhance-customer-engagement-across-all-my-restaurant-locations
https://www.textline.com/industries/restaurants
https://pos.toasttab.com/products/online-ordering
https://support.toasttab.com/en/article/Getting-Started-Toast-Loyalty
https://www.olo.com/
https://pos.toasttab.com/partners/directory/olo
https://www.tablesready.com/industry/curbside-pickup-order-ready-notification-app/
https://simpletexting.com/blog/curbside-pickup-software/
https://support.toasttab.com/en/article/Setting-Up-Curbside-Pickup-for-Online-Orders
https://modernrestaurantmanagement.com/heres-why-your-restaurant-should-use-sms-for-curbside-pickup/
https://www.infobip.com/blog/tcpa-compliance-sms
https://www.10dlc.org/en/home/A2PConsent
https://messageiq.io/blogs/avoid-costly-fines-a-guide-to-tcpa-and-can-spam-for-sms-marketing/
