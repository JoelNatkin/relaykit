## Restaurants (single-location operations)
**Vertical:** Retail & hospitality
**Bucket:** Clear
**URL slug:** /for/restaurants

### What this builder is making
A reservation, waitlist, and order-management tool for one independent restaurant — a Resy-for-the-little-guy that captures table bookings, runs a virtual walk-in waitlist with QR/text check-in, and tracks pickup/takeout orders through to ready. The host stand uses it to seat parties, page waiting guests, and confirm covers; the kitchen and counter use it to mark orders prepared. It is the front-of-house operating layer for a single location, distinct from a chain's centralized multi-venue reservation network.

### Why they need SMS
The single most expensive moment is the no-show reservation and the abandoned waitlist party: a guest who drifts to the bar next door and misses the page leaves a table empty on a Friday at 7pm. SMS wins because a waiting diner is not at a kiosk and will not refresh an app — the buzzer-replacement page ("your table is ready") only works if it lands on the phone in their pocket within seconds. Reservation reminders the day before recover the ~36% of no-shows who say they simply forgot.

### Message categories
1. waitlist — the core walk-in "you're up / table ready" page loop, the highest-volume use on a busy night
2. appointments — reservations behave exactly like appointments: confirmation, day-before and proximate reminders, reschedule, cancellation, no-show follow-up
3. order-updates — pickup/takeout order lifecycle, primarily order-ready and order-confirmed for counter-service and to-go
4. team-alerts — host/server shift scheduling, reminders, and call-out shift-change pings
Excluded: account-events (no consumer billing/subscription relationship with diners), community (no membership/community layer), customer-support (ticketing is not the FOH model — guest questions ride two-way reply on transactional threads), verification (no high-assurance login/2FA need for diners), marketing (real but EIN-gated second registration — see Disambiguation; not a primary transactional category)

### Workflows

**Walk-in waitlist page loop**
Turns the physical buzzer and the crowded waiting area into a phone page so guests can wander and still be seated on time.
Sequence:
1. waitlist:joined — "Waitlist" — sent when the party joins via QR scan, host stand, or text-in; confirms they're on the list
2. waitlist:position-update — "Waitlist" — sent as parties ahead are seated; "you're now 2 parties away"
3. waitlist:almost-up — "Waitlist" — sent when the table is nearly ready; "about 5 min, head back"
4. waitlist:your-turn — "Table ready" — the core page: "your table is ready, please see the host"
5. waitlist:grace-expiring — "Table ready" — sent when the held table is about to be released; "we'll hold your table for 5 more min"
6. waitlist:missed — "Waitlist" — sent when the party doesn't return and the table is released; offers to rejoin
Variable aliases:
- queue_position: "2 parties ahead"
- wait_estimate: "about 5 minutes"
- grace_window: "5 minutes"
- claim_link: GAP — the page is "see the host," not a link (see Message gaps)

**Reservation confirmation and reminder**
Locks in a booked table and recovers the forgetful no-show with a day-before nudge.
Sequence:
1. appointments:confirmation — "Reservation" — sent when the booking is made; "your table for 4 is confirmed for Fri 7:00 PM"
2. appointments:reminder-distant — "Reservation reminder" — sent the day before; includes a cancel link to free the table early
3. appointments:reminder-proximate — "Reservation reminder" — sent ~1-2 hours before; "your table is in about an hour"
Variable aliases:
- provider_name: GAP — a restaurant table has no "provider"; the reservation is with the restaurant itself (see Message gaps / STRETCH)
- appointment_time: "Fri 7:00 PM, party of 4"
- cancel_link: "tap to release your table"

**Reservation change and cancellation**
Keeps the book accurate when a guest moves or drops a booking, freeing the table for walk-ins.
Sequence:
1. appointments:reschedule-confirmation — "Reservation" — sent when the booking time/party changes; "moved to Sat 8:00 PM"
2. appointments:cancellation-confirmation — "Reservation" — sent on cancel; offers to rebook
Variable aliases:
- appointment_time: "Sat 8:00 PM, party of 4"
- reschedule_link: "tap to rebook"

**No-show recovery**
Re-engages a party that didn't show, recovering the relationship rather than the cover.
Sequence:
1. appointments:no-show-follow-up — "Reservation" — sent after a missed booking; "we missed you — want to rebook?"
Variable aliases:
- provider_name: STRETCH — see Message gaps; "we missed you today" reads fine without a provider name

**Pickup / takeout order ready**
The counter-service and to-go loop: tells a guest their food is bagged and waiting so it doesn't sit under the heat lamp.
Sequence:
1. order-updates:order-confirmed — "Order" — sent when the to-go/pickup order is placed and paid; "order #1042 received"
2. order-updates:order-processing — "Order" — optional; "your order is being prepared"
3. GAP:order-ready-for-pickup — "Order ready" — sent when the order is bagged and ready at the counter (see Message gaps)
Variable aliases:
- order_number: "#1042"
- estimated_delivery: "ready in ~15 min"

**Post-visit feedback / review request**
Captures a rating while the meal is fresh, generated from reservation or order data.
Sequence:
1. appointments:post-appointment — "Feedback" — sent after the visit; "thanks for dining with us — how was it?"
Variable aliases:
- provider_name: STRETCH — see Message gaps; phrase as "thanks for dining with us" rather than naming a provider
- feedback_link: "tap to leave a quick review"

**Staff shift scheduling and call-out coverage**
Keeps hosts, servers, and line cooks on the same page about who works when, and fills a gap fast when someone calls out.
Sequence:
1. team-alerts:shift-scheduled — "Schedule" — sent when a shift is posted; "you're on Fri 5-11 PM as server"
2. team-alerts:shift-reminder — "Schedule" — sent the morning of or hour before; "your shift starts at 5 PM"
3. team-alerts:shift-change — "Schedule" — sent when a shift is swapped or moved
4. team-alerts:shift-cancellation — "Schedule" — sent when a shift is cut (slow night) or a call-out frees a slot
Variable aliases:
- location: "the host stand" / "line"
- role: "server" / "host" / "line cook"
- shift_time: "5:00-11:00 PM"

### Message gaps

**GAP:order-ready-for-pickup**
- **Classification:** Universal miss
- **Proposed corpus home:** order-updates:order-ready-for-pickup
- **Proposed universal name:** Order ready for pickup
- **Why:** the order-updates lifecycle covers shipping/delivery but has no in-store/counter "your order is ready to collect now" state, which is the central event for takeout, BOPIS retail, pharmacy, and quick-service food
- **Draft variants:**
  - Standard: `{{workspace_name}}: Order {{order_number}} is ready for pickup. Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} order {{order_number}} is ready — come grab it whenever you like. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Order {{order_number}} ready for pickup. STOP to opt out.`

**STRETCH:appointments:confirmation** (and the appointments reminder/no-show/post family)
- **Classification:** Stretch
- **Proposed corpus home:** appointments:confirmation — the fit gap is the `{{provider_name}}` variable, which assumes a named practitioner; a restaurant reservation is with the venue, not a person
- **Proposed universal name:** Appointment confirmation (used as "Reservation confirmation" alias here)
- **Why:** every appointments body that interpolates `{{provider_name}}` reads awkwardly for a table booking ("your appointment with [name]"); the variable should be droppable or aliased to the venue
- **Draft variants:**
  - Standard: `{{workspace_name}}: your table for {{appointment_time}} is confirmed. Reply STOP to opt out.`
  - Friendly: `You're booked! Your table is set for {{appointment_time}}. See you then. Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: table confirmed, {{appointment_time}}. STOP to opt out.`

**GAP:waitlist-table-ready-no-link**
- **Classification:** Stretch
- **Proposed corpus home:** waitlist:your-turn — the fit gap is the required `{{claim_link}}`; a restaurant table page is "see the host," not a tappable claim URL
- **Proposed universal name:** Your turn (used as "Table ready" alias here)
- **Why:** waitlist:your-turn forces a claim link, but a walk-in is claimed in person at the host stand, so the link variable is empty/awkward
- **Draft variants:**
  - Standard: `{{workspace_name}}: your table is ready. Please see the host within {{grace_window}}. Reply STOP to opt out.`
  - Friendly: `Your table at {{workspace_name}} is ready! Come on back and see the host. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: table ready. See the host. STOP to opt out.`

### Content constraints
- Standard carrier rules apply to all transactional categories (reservations, waitlist, order-ready, staff alerts) — these ride implied/transactional consent from the booking or check-in.
- Any promotional content (specials, happy-hour, "we miss you" win-back, loyalty offers) is a separate marketing category requiring explicit written opt-in and a second EIN-gated campaign registration — never folded into a reservation or table-ready thread.
- SHAFT-C applies to marketing: a restaurant with a bar cannot promote alcohol offers via SMS marketing (the "A" in SHAFT). Transactional reservation/table messages that merely mention the venue are fine; promotional drink specials are not.
- Two-way reply (guest texts "running 10 late," staff texts "can't make my shift") is permitted on the transactional thread under implied consent — surface it as a feature, not a separate opt-in.
- Honor STOP immediately on every category; staff shift opt-out must not silently drop a worker from scheduling pages without a fallback channel.

### Disambiguation
Single-location independents differ sharply from multi-location chain ops: a chain runs a centralized reservation network across venues, needs per-location sender identity and location routing in every message, and registers SMS under a large parent EIN with higher throughput — that is a different, heavier registration story and arguably a different bucket. This entry is for the one restaurant whose host stand, kitchen, and book all live in a single workspace. The pattern looks identical to generic appointments software, but tips toward this sub-vertical's aliases the moment "provider" disappears (a table has no practitioner) and the waitlist page replaces a calendar slot. What looks allowed but isn't: bundling a "while you wait, here's 10% off dessert" line into the table-ready page — that converts a transactional waitlist message into marketing and breaks the waitlist category's no-promotional-content rule (D-395) plus the EIN-gated marketing consent requirement.

### Sources
https://www.tablesready.com/
https://www.tablesready.com/restaurant-waitlist-reservations-system/
https://www.tablesready.com/quick-service-restaurants/
https://www.waitlist.me/
https://www.waitwhile.com/
https://restaurant.eatapp.co/waitlist
https://sevenrooms.com/blog/improving-restaurant-waitlist-management/
https://scanqueue.com/solutions/restaurants
https://www.text-em-all.com/blog/sms-for-restaurants
https://www.tablein.com/blog/restaurant-sms-types
https://www.tablein.com/blog/automated-sms-restaurant-table-booking-process
https://textellent.com/blog/the-ultimate-guide-to-business-texting-for-restaurants/
https://support.opentable.com/s/article/Guest-SMS-Messaging
https://emitrr.com/blog/restaurant-sms-templates/
https://activeprospect.com/blog/tcpa-text-messages/
https://www.infobip.com/blog/tcpa-compliance-sms
https://www.text-em-all.com/blog/sms-compliance-checklist-for-tcpa-safe-business-messaging
