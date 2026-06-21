## Grocery / specialty food retail
**Vertical:** Retail & hospitality
**Bucket:** Clear
**URL slug:** /for/grocery-retail

### What this builder is making
An online ordering and fulfillment system for a grocer or specialty food retailer — an independent grocery store, butcher, fishmonger, bakery, ethnic market, or co-op — running on a white-label grocery platform (Mercato, Local Express, Freshop, GrazeCart, Growcer) or a custom storefront. The system tracks each order through a perishable-aware fulfillment lifecycle (placed, shopper picking, substitutions resolved, ready/out for delivery, handed off) where in-stock reality is discovered only while a human picks the order, so out-of-stock substitution decisions and a curbside/in-store pickup handoff are first-class events, not edge cases. The builder must coordinate three live parties — the customer, the in-store picker/shopper, and a pickup window or delivery driver — within a same-day, time-boxed slot.

### Why they need SMS
The substitution decision is the moment everything hinges on: the picker is standing in the aisle, the customer's item is out of stock, and a reply is needed in the next minute or the order ships wrong or short — an email is useless at that speed, but a text gets a "yes swap it" back in seconds. The pickup handoff has the same urgency: groceries are ready and perishable, the customer is told to text when they arrive, and SMS is the only channel that works two-way from a parking lot. SMS open and reply rates (~98% open, near-immediate) are what make a same-day slot with a 90-second substitution window operationally possible at all.

### Message categories
1. order-updates — primary; the placed → picking → ready/out-for-delivery → handed-off arc is the operational spine, mapped onto the corpus order lifecycle
2. customer-support — secondary; "where's my order," wrong/missing item, and damaged-perishable tickets ride the support lifecycle
3. account-events — tertiary; payment-failed recovers a card decline before a same-day order is dropped
4. marketing — tertiary; weekly-ad, restock, and promo broadcasts live here under separate explicit consent + EIN gating, never inside an order body
5. verification — tertiary; phone verification at account creation, and the phone is the channel itself, so ownership matters
Excluded: appointments (no provider-booked time slots — a delivery window is an order-update, not a booked appointment), community (no membership/forum layer in a grocer storefront), team-alerts (the picker/driver coordination is internal ops tooling, a separate builder concern, not customer-facing), waitlist (a slot-full or item-restock signal is a marketing back-in-stock send, not a position queue)

### Workflows

**Pickup order lifecycle (curbside / in-store)**
Carries a click-and-collect order from checkout to the customer's car — the core same-day grocery job.
Sequence:
1. order-updates:order-confirmed — "Order confirmed" — right after checkout, naming the pickup window
2. order-updates:order-processing — "We're shopping your order" — when a picker starts pulling items off shelves
3. GAP:substitution-approval — "Approve a swap?" — when a picked item is out of stock and the customer must approve a replacement or decline before checkout (often repeated per item)
4. GAP:order-ready-for-pickup — "Order ready for pickup" — when the bagged order is staged and the customer can come collect it
5. GAP:pickup-arrival-ack — "We see you, bringing it out" — sent after the customer texts to say they've arrived, confirming staff are walking it to the car
Variable aliases (only where the default example would feel wrong for this sub-vertical):
- estimated_delivery: "today, 4-5pm"

**Delivery order lifecycle (driver to door)**
Carries a same-day delivery order from checkout to the doorstep with a live delivery window.
Sequence:
1. order-updates:order-confirmed — "Order confirmed" — at checkout, naming the delivery window
2. order-updates:order-processing — "We're shopping your order" — when a picker starts the order
3. GAP:substitution-approval — "Approve a swap?" — per out-of-stock item, before the order leaves the store
4. order-updates:out-for-delivery — "Out for delivery" — when the driver leaves with the order, carries the live-tracking link and window
5. order-updates:order-delivered — "Delivered" — when the driver completes the drop, with a path to flag a problem
Variable aliases:
- estimated_delivery: "today, 1-3pm"
- tracking_link: "track.localmkt.co/x9"

**Substitution resolution (item exception loop)**
The defining grocery flow — resolves an out-of-stock item while the picker is mid-shop, before the order is finalized.
Sequence:
1. GAP:substitution-approval — "Approve a swap?" — picker hits an out-of-stock item, texts the proposed replacement, customer replies to approve, decline, or refund
2. GAP:substitution-confirmed — "Swap applied" — confirms the resolved replacement (and any price/total change) once the customer responds

**Card-declined recovery**
Saves a same-day order that would otherwise auto-cancel when payment fails at capture.
Sequence:
1. account-events:payment-failed — "Payment failed" — when the processor declines the card, with a link to update payment before the slot is lost

**Wrong / missing item support**
Handles the post-handoff "you forgot my milk" or "this is bruised" ticket — high-frequency in grocery because picking is manual and perishable.
Sequence:
1. customer-support:ticket-received — "We got your message" — when the customer reports a missing or bad item
2. customer-support:agent-response — "Reply on your ticket" — when staff respond, often with a refund or redelivery
3. customer-support:resolution-notification — "Sorted" — when the issue is closed
4. customer-support:csat-follow-up — "Rate your experience" — after resolution

**Account phone verification**
Proves phone ownership at signup, before any order or substitution texts go out — the phone is the operational channel, so this is load-bearing.
Sequence:
1. verification:verification-code — "Verification code" — when the customer enters their number at account creation

**Weekly ad / restock broadcast (marketing-gated)**
The opted-in promotional lane — weekly circular, "your usual is back," seasonal offers — kept strictly out of order bodies.
Sequence:
1. marketing:promotional-offer — "This week's deals" — to a separately opted-in, EIN-gated marketing audience
Variable aliases:
- offer: "Weekend produce sale — 20% off"
- offer_link: "localmkt.co/ad"

### Message gaps

**GAP:substitution-approval**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (grocery/specialty food — the only verticals where fulfillment requires real-time item-level customer approval mid-pick)
- **Proposed universal name (display alias):** Approve a substitution
- **Why:** out-of-stock-while-picking is the defining grocery exception and no corpus order-updates message asks the customer to approve a replacement before the order is finalized

**GAP:substitution-confirmed**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (grocery/specialty food)
- **Proposed universal name (display alias):** Substitution applied
- **Why:** the second half of the substitution loop — confirming the resolved swap and any total change — has no corpus equivalent

**GAP:order-ready-for-pickup**
- **Classification:** Universal miss
- **Proposed corpus home:** order-updates:ready-for-pickup (a BOPIS/click-and-collect terminal state parallel to out-for-delivery, used by any retailer offering pickup)
- **Proposed universal name:** Ready for pickup
- **Why:** click-and-collect is a mainstream fulfillment mode across retail, and the corpus order arc jumps from processing straight to shipping/delivery with no "come collect it" state
- **Draft variants:**
  - Standard: `{{workspace_name}}: Order {{order_number}} is ready for pickup. Reply HERE when you arrive and we'll bring it out. Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} order {{order_number}} is bagged and ready. Text HERE when you pull up. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Order {{order_number}} ready for pickup. Reply HERE on arrival. STOP to opt out.`

**GAP:pickup-arrival-ack**
- **Classification:** Universal miss
- **Proposed corpus home:** order-updates:pickup-arrival-ack (the inbound-triggered reply that completes the BOPIS handoff)
- **Proposed universal name:** Arrival acknowledged
- **Why:** the two-way curbside pattern (customer texts HERE, store confirms it's coming out) is standard across pickup retail and has no corpus message for the store's acknowledgment leg
- **Draft variants:**
  - Standard: `{{workspace_name}}: Got it — order {{order_number}} is on its way out to you now. Reply STOP to opt out.`
  - Friendly: `We see you! Bringing {{workspace_name}} order {{order_number}} right out. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Order {{order_number}} coming out now. STOP to opt out.`

### Content constraints
- Order-status and substitution bodies (order-updates) carry NO cross-sell or upsell — no "add to your order," no featured item, no discount code inside a picking, ready, or delivery text.
- Order-status messages register under TCR DELIVERY_NOTIFICATION on transactional consent (the customer's order is the consent context). They are Clear.
- The substitution loop is interactive (the customer replies to approve/decline). Two-way transactional consent applies; the inbound reply is part of the order context, not a new opt-in.
- Alcohol fulfillment (beer/wine/spirits delivery or pickup) is SHAFT-restricted: a transactional order-status text about an alcohol order is allowable, but any promotional alcohol content requires 21+ age-gating and falls under the marketing regime — keep alcohol promos out of the transactional lane entirely.
- Any promotional send — weekly ad, restock alert, loyalty offer, "your usual is back" — is the marketing category: separate explicit marketing consent (distinct from the order opt-in), EIN-gated, TCR MARKETING, SHAFT-C prohibited. A number captured for order/substitution texts does NOT carry marketing consent.
- No prices, discount codes, or offers in any transactional body; a substitution-confirmed note may state a total change as a fact, but must not promote.

### Disambiguation
Grocery/specialty food retail is Clear because its spine is transactional order-status, and the substitution loop — though distinctive — is still order-context two-way messaging, not marketing. The feature that separates it from general e-commerce is that fulfillment is human and perishable: stock is verified only at pick time, so substitution-approval and a pickup/curbside handoff are core events e-commerce never has, while shipping/carrier-tracking arcs matter less. It neighbors restaurants (prepared-food, table/order-ready pings) and food-delivery / Q-commerce (courier-location, multi-party flows) — the tell is whether the order is shopped from shelf inventory (grocery) versus made-to-order (restaurant). What looks allowed but is not: dropping "this week's deals" or a loyalty code into a ready-for-pickup or delivered text — operationally tempting at a grocer, but it converts a Clear transactional message into a promotional one sent without marketing consent and, for alcohol, without age-gating.

### Sources
https://www.shipt.com/delivery/grocery-delivery
https://www.routific.com/blog/grocery-delivery-software
https://www.itretail.com/blog/grocery-e-commerce-software-providers
https://www.heymarket.com/blog/how-to-use-sms-for-curbside-and-in-store-pickup/
https://www.heymarket.com/blog/15-sms-templates-for-curbside-pickup/
https://www.itretail.com/blog/curbside-pickup-for-grocery-store
https://www.smarter.com/lifestyle/ordering-walmart-grocery-delivery-service-workflow-fees-policies
https://customers.twilio.com/en-us/instacart
https://www.instacart.com/help/section/360007902871/360059155111
https://www.textedly.com/blog/sms-text-delivery-service-order-update-templates
https://blog.protexting.com/2024/12/sms-marketing-for-groceries-stores/
https://www.bloomreach.com/en/blog/understanding-tcpa-and-ctia-compliance-for-sms-marketing-in-the-us
