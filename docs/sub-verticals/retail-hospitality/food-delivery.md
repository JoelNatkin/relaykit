## Food delivery / ghost kitchens
**Vertical:** Retail & hospitality
**Bucket:** Clear
**URL slug:** /for/food-delivery

### What this builder is making
A platform that takes a prepared-food order, routes it through a kitchen (often a multi-brand ghost/cloud kitchen running several virtual concepts from one location), and dispatches a driver to deliver it hot to the customer's door. The software aggregates orders from one or more channels, drives a kitchen display / prep queue, and assigns and tracks delivery drivers in real time. Think "DoorDash-for-X" operators and cloud-kitchen ops tools where the order moves through placed → preparing → ready → out-for-delivery → delivered on a tight, perishable timeline.

### Why they need SMS
Hot food has a 10-15 minute window where it's good and after which it's a complaint, so the "driver is 5 minutes away — please be at the door" text is the difference between a handoff and a cold meal left on a porch. The customer won't sit watching an in-app map, but they will glance at a text, and a missed handoff means a remake, a refund, or a one-star review. On the workforce side, a driver who doesn't see a dispatch within seconds means the order sits under a heat lamp losing the same window.

### Message categories
1. order-updates — primary; the customer order arc (confirmed → preparing → out for delivery → delivered) is the spine of the product
2. team-alerts — secondary; the driver/staff dispatch lane (shift scheduling plus per-run dispatch and pickup-ready pings) maps here
3. customer-support — tertiary; "where's my order" friction and refund/remake follow-ups are real but lower-volume
Excluded: appointments (no booked time slots — delivery is on-demand, not scheduled provider visits), waitlist (no queue-for-a-spot mechanic), community, verification (driver phone verification possible but not a core builder need to surface), marketing (promos exist but are a separate registered campaign, not the transactional product), account-events (billing lives in the platform, not the order surface)

### Workflows

**Customer order arc**
Keeps the diner informed from checkout to doorstep — the core "where's my food" loop.
Sequence:
1. order-updates:order-confirmed — "Order confirmed" — fires at checkout/payment; confirms the order and gives an ETA
2. order-updates:order-processing — "Kitchen is preparing your order" — fires when the kitchen accepts and starts prep
3. GAP:order-ready-for-pickup — "Order's ready, driver is picking it up" — fires when the food is bagged and staged for the driver (no corpus message for the pickup-ready beat)
4. order-updates:out-for-delivery — "Out for delivery" — fires when the driver leaves the kitchen with the order
5. GAP:driver-approaching — "Driver is ~5 min away, please be ready" — fires on geofence/proximity; the perishable-window handoff text
6. order-updates:order-delivered — "Delivered" — fires on driver-confirmed dropoff
Variable aliases (only where the default example would feel wrong for this sub-vertical):
- estimated_delivery: "in about 35 min"
- order_number: "#A7F2"

**Delivery delay heads-up**
Sets expectations when a driver is running late so the customer doesn't escalate to support.
Sequence:
1. customer-support:service-status-alert — "Your delivery is running late" — fires when ETA slips past threshold; gives a new ETA
Variable aliases:
- eta: "about 15 more min"

**Order issue / remake**
Handles the dropped, missing-item, or wrong-order case before it becomes a chargeback.
Sequence:
1. customer-support:ticket-received — "We got your report on order {order_number}" — fires when the customer flags a problem
2. customer-support:resolution-notification — "Your remake/refund is sorted" — fires when the kitchen issues a remake or refund

**Post-delivery feedback**
Captures a rating while the meal is fresh in mind.
Sequence:
1. customer-support:csat-follow-up — "How was your delivery?" — fires shortly after delivered status

**Driver shift scheduling**
Tells gig/staff drivers when and where they're working.
Sequence:
1. team-alerts:shift-scheduled — "You're on the schedule" — fires when a driver shift is assigned
2. team-alerts:shift-reminder — "Shift reminder" — fires ahead of shift start
3. team-alerts:shift-start — "Your shift is starting — check in" — fires at shift start with a check-in action
Variable aliases:
- location: "Downtown kitchen"
- role: "Delivery driver"

**Driver shift change / cancellation**
Keeps drivers current when the roster shifts.
Sequence:
1. team-alerts:shift-change — "Your shift moved" — fires on a swap or reschedule
2. team-alerts:shift-cancellation — "Your shift is cancelled" — fires when a shift is dropped

**Per-run driver dispatch**
The operational core of the workforce lane — hands a specific delivery to a specific driver and tells them where to pick it up.
Sequence:
1. GAP:driver-run-assigned — "New delivery assigned — pickup at {location}" — fires when an order is routed to a driver
2. GAP:driver-pickup-ready — "Order {order_number} is bagged and ready for pickup" — fires when the kitchen stages the food for an already-assigned driver
Variable aliases:
- location: "Midtown kitchen"

### Message gaps

**GAP:order-ready-for-pickup**
- **Classification:** Universal miss
- **Proposed corpus home:** order-updates:order-ready
- **Proposed universal name:** Order ready
- **Why:** the "food is staged / ready for handoff" beat sits between processing and out-for-delivery and recurs across food, pickup-retail, and curbside
- **Draft variants:**
  - Standard: `{{workspace_name}}: Order {{order_number}} is ready and being picked up for delivery now. Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} order {{order_number}} is ready and heading out the door soon. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Order {{order_number}} ready, picking up now. STOP to opt out.`

**GAP:driver-approaching**
- **Classification:** Universal miss
- **Proposed corpus home:** order-updates:arriving-soon
- **Proposed universal name:** Arriving soon
- **Why:** the proximity / "be at the door" handoff text is the single highest-value food-delivery message and recurs in any last-mile delivery
- **Draft variants:**
  - Standard: `{{workspace_name}}: Order {{order_number}} is about {{eta}} away. Please be ready to receive it. Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} order {{order_number}} is about {{eta}} away — head to the door. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Order {{order_number}} ~{{eta}} away. Be ready. STOP to opt out.`

**GAP:driver-run-assigned**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** New delivery assigned (display alias)
- **Why:** a per-run dispatch to a driver is narrower than team-alerts' shift-lifecycle framing and specific to last-mile delivery operations

**GAP:driver-pickup-ready**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** Pickup ready for driver (display alias)
- **Why:** the kitchen-to-assigned-driver "food's bagged" ping is an internal dispatch beat with no general-purpose corpus home

### Content constraints
- Standard carrier rules apply. No vertical-specific content restrictions on the transactional lane.
- Keep the order arc strictly transactional — no "add a drink?" upsell or promo in order-updates bodies (corpus already forbids cross-sell here).
- Any promotional food offers ("$5 off your next order") must run as a separate registered MARKETING campaign with its own consent — not appended to order or dispatch texts.
- Driver dispatch texts are operational/staff messaging; treat the workforce audience as a distinct consent population from customers.

### Disambiguation
The neighbor to watch is general e-commerce/parcel order-updates: that arc tops out at "out for delivery" over a multi-day window, whereas food delivery compresses the same arc into 30-45 minutes and adds two live last-mile beats (ready-for-pickup, driver-approaching) that parcel shipping doesn't need. It also borders restaurant reservations/booking software — but that's an appointments shape (scheduled time slots, reminders), not the on-demand order shape here, so don't pull appointments in. What looks allowed but isn't: bundling a promo into the delivery confirmation — the moment a transactional order text carries an offer it becomes marketing and needs separate consent and an EIN-gated campaign. Bucket stays Clear as long as the build is order status plus dispatch; it would tip toward Conditional only if the core product were promotional blast texting to a diner list.

### Sources
https://www.oracle.com/food-beverage/ghost-kitchens/
https://www.xenia.team/articles/ghost-kitchen-software
https://onehubpos.com/blog/essential-tools-to-manage-ghost-kitchens-in-2024
https://www.upperinc.com/blog/delivery-notification-sms-templates/
https://www.upperinc.com/customer-notification/for-food-delivery/
https://simpletexting.com/blog/send-a-text-message-when-customers-food-is-ready/
https://smartroutes.io/blogs/delivery-notifications/
https://onro.io/delivery-notification/
https://www.deliverect.com/en-us/dispatch
https://emitrr.com/blog/text-messaging-for-dispatch-and-logistics/
https://mytcrplus.com/home/tcr-resources/industry-sms-compliance-playbooks/hospitality-travel-messaging-compliance-playbook/
https://textbolt.com/blog/10dlc-compliance/
