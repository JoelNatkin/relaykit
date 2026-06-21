## E-commerce / online retail (general consumer goods)
**Vertical:** Retail & hospitality
**Bucket:** Clear
**URL slug:** /for/ecommerce

### What this builder is making
A direct-to-consumer online store selling physical consumer goods — apparel, home, beauty, accessories, gadgets — built on Shopify, WooCommerce, a custom storefront, or a Shopify-for-X niche platform. The system tracks orders through a fulfillment lifecycle (placed, paid, prepared, shipped, out for delivery, delivered) plus a returns/refunds path, and integrates carrier tracking and a payment processor. The builder needs to keep buyers informed at each handoff between their store, their warehouse/3PL, and the carrier.

### Why they need SMS
The moment a package ships or goes out for delivery is the highest-anxiety point in the purchase, and 36% of delivery attempts fail when nobody knows the package is coming — an email buried in a promotions tab does not move someone to be home. SMS hits ~98% open rates against email's 20-30%, so order-status texts get seen in time to matter, cutting "where is my order" support tickets and failed deliveries. The same channel turns a delivered-but-wrong order into a started return instead of a chargeback.

### Message categories
1. order-updates — primary; carries the full 7-step order lifecycle (confirm → process → ship → out for delivery → delivered → return → refund), the operational spine of every store
2. customer-support — secondary; "where is my order" and damaged-item tickets ride the support lifecycle
3. account-events — secondary; payment-failed recovers a card-declined order before it cancels
4. marketing — tertiary; abandoned-cart, win-back, back-in-stock, and promotional broadcasts live here under a separate explicit-consent + EIN-gated regime, never in transactional bodies
5. verification — tertiary; phone verification at account creation / guest-checkout phone capture
Excluded: appointments (no scheduled-service model in pure e-commerce), community (no membership/forum layer), team-alerts (internal ops tooling, not buyer-facing), waitlist (a store sells available inventory; out-of-stock interest is a marketing back-in-stock alert, not a queue)

### Workflows

**Order fulfillment lifecycle (full arc)**
Keeps the buyer informed from purchase to doorstep — the core promise of the channel.
Sequence:
1. order-updates:order-confirmed — "Order confirmed" — right after checkout completes and payment clears
2. order-updates:order-processing — "Order being prepared" — when the order moves into pick/pack at the warehouse or 3PL
3. order-updates:order-shipped — "Order shipped" — when the carrier accepts the package, carries the tracking link
4. order-updates:out-for-delivery — "Out for delivery" — morning of the delivery day, so someone is home
5. order-updates:order-delivered — "Delivered" — when the carrier marks delivered, with a path to start a return if something is wrong
Variable aliases:
- estimated_delivery: "Tue, Jun 23"

**Lean order-status arc (small-store default)**
The minimum a buyer expects when the store skips intermediate states.
Sequence:
1. order-updates:order-confirmed — "Order confirmed" — at checkout
2. order-updates:order-shipped — "Shipped" — at carrier acceptance, with tracking
3. order-updates:order-delivered — "Delivered" — at delivery scan

**Returns and refund**
Closes the loop after a buyer reports a problem with a delivered order.
Sequence:
1. order-updates:return-started — "Return started" — when the customer initiates a return and a label is issued
2. order-updates:refund-processed — "Refund processed" — when the refund posts back to the original card
Variable aliases:
- refund_amount: "$48.00"
- card_type: "Visa ending 4242"

**Card-declined recovery**
Saves an order that would otherwise auto-cancel when a payment fails (common on stored-card reorders / subscriptions).
Sequence:
1. account-events:payment-failed — "Payment failed" — when the processor declines the card, with a link to update payment before the order is dropped

**Where-is-my-order support**
Handles the inbound "I don't see my package" ticket the order arc is meant to prevent but never eliminates.
Sequence:
1. customer-support:ticket-received — "We got your message" — when the buyer opens a WISMO ticket
2. customer-support:agent-response — "Reply on your ticket" — when support answers
3. customer-support:resolution-notification — "Ticket resolved" — when the issue is closed
4. customer-support:csat-follow-up — "Rate your support" — after resolution

**Checkout phone verification**
Proves phone ownership at account creation or guest-checkout phone capture, before any order texts go out.
Sequence:
1. verification:verification-code — "Verification code" — when the buyer enters their number at signup/checkout

**Delivery-attempt failed**
Tells a buyer their package could not be delivered and what to do next — the single highest-value status the corpus does not cover.
Sequence:
1. GAP:delivery-attempt-failed — "Delivery missed" — when the carrier reports a failed delivery attempt, with a link to reschedule or arrange pickup

### Message gaps

**GAP:delivery-attempt-failed**
- **Classification:** Universal miss
- **Proposed corpus home:** order-updates:delivery-attempt-failed (between out-for-delivery and delivered)
- **Proposed universal name:** Delivery attempt failed
- **Why:** carriers fail a real share of attempts; the buyer must act (reschedule/pickup) and no corpus message covers a failed scan
- **Draft variants:**
  - Standard: `{{workspace_name}}: Order {{order_number}} delivery missed. Reschedule or arrange pickup: {{tracking_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} order {{order_number}} couldn't be delivered. Sort it here: {{tracking_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Order {{order_number}} delivery missed. {{tracking_link}} STOP to opt out.`

**GAP:back-in-stock-alert**
- **Classification:** Universal miss
- **Proposed corpus home:** marketing:back-in-stock (promotional category — explicit consent + EIN-gated)
- **Proposed universal name:** Back in stock
- **Why:** an opted-in shopper waiting on a restock is a recurring e-commerce send, but it is promotional intent and belongs in marketing, not order-updates
- **Draft variants:**
  - Standard: `{{business_name}}: {{product_name}} is back in stock. Get it here: {{product_link}} Reply STOP to opt out.`
  - Friendly: `Good news from {{business_name}} — {{product_name}} is back. Grab it: {{product_link}} Reply STOP to opt out.`
  - Brief: `{{business_name}}: {{product_name}} back in stock. {{product_link}} STOP to opt out.`
- **New variables:** `{{product_name}}` — the restocked item name, ~30 chars, store catalog, "the Linen Tote"; `{{product_link}}` — deep link to the product page, ~24 chars after shortening, store, "shop.co/p/tote"

**STRETCH:marketing:re-engagement**
- **Classification:** Stretch
- **Proposed corpus home:** marketing:re-engagement covers win-back broadly; the e-commerce abandoned-cart send (cart left at checkout, not a lapsed account) needs reframing toward a held cart rather than "what you've missed"
- **Proposed universal name:** Re-engagement (abandoned-cart display alias)
- **Why:** abandoned-cart is the canonical e-commerce marketing flow but the corpus re-engagement body frames a dormant account, not items sitting in an active cart
- **Draft variants:**
  - Standard: `{{business_name}}: You left items in your cart. Pick up where you left off: {{cart_link}} Reply STOP to opt out.`
  - Friendly: `{{business_name}}: Still thinking it over? Your cart is saved here: {{cart_link}} Reply STOP to opt out.`
  - Brief: `{{business_name}}: Items waiting in your cart. {{cart_link}} STOP to opt out.`
- **New variables:** `{{cart_link}}` — deep link back to the saved cart, ~24 chars after shortening, store session, "shop.co/c/x9k2"

### Content constraints
- Transactional order-status bodies (order-updates) carry NO cross-sell or upsell — the order-updates sender-frame rule. No "while you wait, shop our sale," no product recommendations, no discount codes inside a shipping or delivery text.
- Order-status messages register under TCR DELIVERY_NOTIFICATION and run on transactional consent (the buyer's order is the consent context). They are Clear.
- Any promotional send — abandoned-cart, back-in-stock, win-back, price drop, promo broadcast — is the marketing category: separate explicit marketing consent (distinct opt-in from the checkbox at checkout), EIN-gated, TCR MARKETING, SHAFT-C prohibited. A phone number captured for order updates does NOT carry consent to market to.
- Abandoned-cart sends face a carrier-enforced ceiling: limited to the cart event, sent within ~48h of abandonment, and the recipient must have separately opted in to marketing — not merely entered a number at checkout.
- No discount codes, prices, or offers in any transactional body; those reclassify a transactional message as promotional and break its eligibility.

### Disambiguation
Pure e-commerce is Clear because its spine is transactional order-status — the buyer's purchase is the consent context. The line that tips it toward the marketing regime (separate consent + EIN gating) is intent: the instant a body promotes (a code, an offer, a back-in-stock nudge, a "you left this in your cart"), it leaves order-updates for the marketing category, regardless of how operational it feels. Subscription-box and replenishment commerce look identical on the order arc but add a recurring-billing layer where account-events:payment-failed and subscription-confirmed carry more weight. Marketplaces (multi-seller) and food-delivery / Q-commerce share the shipping arc but add courier-location and multi-party flows that pure single-merchant e-commerce does not — treat those as neighboring sub-verticals. What looks allowed but is not: appending "20% off your next order" to a delivered or shipped text — operationally tempting, but it converts a Clear transactional message into a non-compliant promotional one sent without marketing consent.

### Sources
https://www.plivo.com/blog/ecommerce-sms-order-updates-templates/
https://www.blog.shippypro.com/en/shipping-notifications-for-ecommerce
https://help.shopify.com/en/manual/fulfillment/setup/notifications/sms-notifications
https://www.parcelpanel.com/blog/shipping-notifications/
https://smsmarketo.com/ecommerce-sms-notifications-guide/
https://help.klaviyo.com/hc/en-us/articles/4404189657755
https://www.bloomreach.com/en/blog/understanding-tcpa-and-ctia-compliance-for-sms-marketing-in-the-us
https://postscript.io/blog/one-faq-to-rule-them-all-50-tricky-sms-compliance-questions-answers
https://support.omnisend.com/en/articles/3781308-compliance-best-practices-in-sms-marketing
https://www.omnisend.com/blog/abandonment-sms/
