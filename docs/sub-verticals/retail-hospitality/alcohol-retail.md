## Alcohol delivery / alcohol retail
**Vertical:** Retail & hospitality
**Bucket:** Conditional
**URL slug:** /for/alcohol-retail

### What this builder is making
A "Drizly-for-X" platform that takes a beer/wine/spirits order from an age-verified buyer, routes it to a licensed local retailer or the retailer's own storefront, and dispatches a driver who must physically check a 21+ government ID (and often capture a signature) at the door before handing over the order. The software runs the order arc from placed → accepting → out-for-delivery → ID-checked → delivered, gating the whole flow behind a digital age check at signup and an in-person ID check at delivery. Think on-demand liquor marketplaces, DtC winery/distillery shippers, and white-label liquor-store delivery apps where every order carries a legal age and signature requirement the platform is liable for.

### Why they need SMS
The delivery only completes if a 21+ person is physically at the door with a matching government ID, so the "your driver is arriving — have your ID ready" text is the difference between a completed handoff and a failed, restocked, refunded delivery the retailer eats. A customer who isn't home or can't produce ID forces the driver to return the alcohol, which is costly and a compliance exposure, and a text is the only channel that reliably catches them in the arrival window. SMS wins because the buyer won't watch an in-app map but will glance at a text, and the ID-ready prompt has to land in the few minutes before the driver knocks.

### Message categories
1. order-updates — primary; the alcohol order arc (confirmed → out for delivery → arriving with ID prompt → delivered) is the spine of the product and is the permissible transactional lane for SHAFT-A traffic
2. customer-support — secondary; failed-delivery / ID-mismatch / restock follow-ups and "where's my order" friction are real and unavoidable in this vertical
3. verification — tertiary; phone-ownership proof at signup pairs with the age gate, though age verification itself is not an SMS code
Excluded: marketing (alcohol promotion is SHAFT-C restricted — requires a separate age-gated, EIN-registered campaign with explicit consent; never the transactional product), appointments (no booked provider time slots — delivery is on-demand), waitlist (no queue-for-a-spot mechanic), community, team-alerts (driver dispatch exists but is not the builder's surfaced need here), account-events (billing lives in the platform, not the order surface)

### Workflows

**Customer order arc (with ID-at-door prompt)**
Keeps the buyer informed from checkout to doorstep and lands the legally-required "have your ID ready" prompt in the arrival window.
Sequence:
1. order-updates:order-confirmed — "Order confirmed" — fires at checkout/payment to an already age-verified buyer; confirms the order and ETA
2. order-updates:order-processing — "Your store is preparing your order" — fires when the licensed retailer accepts and stages the order
3. order-updates:out-for-delivery — "Out for delivery" — fires when the driver leaves the store with the order
4. GAP:arriving-id-ready — "Driver is ~5 min away — have your 21+ ID ready" — fires on geofence/proximity; the compliance-critical arrival prompt
5. order-updates:order-delivered — "Delivered" — fires on driver-confirmed, ID-checked dropoff
Variable aliases (only where the default example would feel wrong for this sub-vertical):
- estimated_delivery: "in about 45 min"
- order_number: "#BV-2291"

**Delivery delay heads-up**
Sets expectations when a driver is running late so the buyer stays home and available for the ID check rather than escalating.
Sequence:
1. customer-support:service-status-alert — "Your delivery is running late" — fires when ETA slips past threshold; gives a new ETA
Variable aliases:
- eta: "about 20 more min"

**Failed delivery / ID mismatch**
Handles the legally-mandatory non-handoff — no ID, underage recipient, intoxicated recipient, or no one home — before it becomes a dispute.
Sequence:
1. GAP:delivery-attempt-failed — "We couldn't complete your delivery — ID couldn't be verified" — fires when the driver cannot legally hand off the order
2. customer-support:account-issue-resolved — "Your order was returned and refunded" — fires when the order is restocked and the refund/credit is processed
Variable aliases:
- order_number: "#BV-2291"

**Refund / restock confirmation**
Closes the loop on the money when an order is returned or cancelled.
Sequence:
1. order-updates:refund-processed — "Refund processed" — fires when the refund lands back on the buyer's card

**Order issue / wrong item**
Catches a damaged-bottle or wrong-product report before it becomes a chargeback.
Sequence:
1. customer-support:ticket-received — "We got your report on order {order_number}" — fires when the buyer flags a problem
2. customer-support:resolution-notification — "Your issue is sorted" — fires when the retailer issues a replacement or refund

**Post-delivery feedback**
Captures a rating shortly after a completed handoff.
Sequence:
1. customer-support:csat-follow-up — "How was your delivery?" — fires shortly after delivered status

**Signup phone verification**
Proves phone ownership at account creation, alongside (not in place of) the date-of-birth age gate.
Sequence:
1. verification:verification-code — "Verification code" — fires when the buyer verifies their phone at signup

### Message gaps

**GAP:arriving-id-ready**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** Arriving — have ID ready (display alias)
- **Why:** the proximity prompt here carries a legally-required ID-check instruction specific to age-restricted delivery, narrower than a generic "arriving soon" beat

**GAP:delivery-attempt-failed**
- **Classification:** Universal miss
- **Proposed corpus home:** order-updates:delivery-failed
- **Proposed universal name:** Delivery attempt failed
- **Why:** a "we couldn't complete the handoff" beat (no one home, refused, ID-blocked) recurs across alcohol, signature-required parcel, and high-value delivery and has no corpus home between out-for-delivery and delivered
- **Draft variants:**
  - Standard: `{{workspace_name}}: We couldn't complete delivery of order {{order_number}}. ID couldn't be verified. We'll be in touch. Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} order {{order_number}} couldn't be handed off — ID couldn't be verified. We'll follow up. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Delivery of {{order_number}} failed, ID not verified. STOP to opt out.`

### Content constraints
- Conditional gating is SHAFT-A (alcohol). The permissible lane is strictly transactional order-status to an existing, already age-verified customer: order confirmed, processing, out for delivery, arriving-with-ID-prompt, delivered, refund, delivery-failed. Keep workflows inside this lane.
- No promotional or marketing alcohol content in any transactional body — no "20% off wine," no featured-bottle, no "order again and save." The transactional carve-out collapses the moment an offer is appended.
- ANY alcohol marketing requires a separate, EIN-registered MARKETING campaign behind a proper age gate (full date of birth MM/DD/YYYY collected — a yes/no "are you 21?" is not acceptable) plus explicit marketing consent. Never send alcohol promotion to an unverified number.
- Transactional opt-in and marketing opt-in must be separate consent populations; do not carry a transactional-only number into a promotional send.
- Carriers actively scrutinize SHAFT traffic and can filter or shut down senders without legal process — keep the registered campaign's described use case matched to actual sending, and keep age-gate evidence on file.
- The ID-ready arrival prompt is operationally and legally important but is informational, not promotional — it stays in the transactional lane.
- Some SMS platforms refuse alcohol senders outright even with age-gating in place; surface that this build registers as a SHAFT-A use case, not a general retail one.

### Disambiguation
The close neighbor is general grocery/e-commerce order-updates, which shares the same order arc but carries no SHAFT gate — alcohol tips to Conditional purely because of the age-restricted product, even though the transactional messages themselves look identical. The other neighbor is food delivery, which has the same last-mile "arriving soon" beat but no ID-check requirement, so its arrival text is a convenience prompt where the alcohol one is a compliance instruction. What looks allowed but isn't: treating an age-verified buyer's transactional consent as license to send them a wine promo — alcohol promotion is SHAFT-C restricted and needs its own age-gated, EIN-registered campaign with explicit marketing consent regardless of any prior order relationship. A grocery delivery build that happens to carry beer/wine as one category inherits the SHAFT-A constraint the moment those SKUs are promoted, even if the rest of the catalog is unrestricted.

### Sources
https://help.listrak.com/en/articles/10131930-mobile-u-s-shaft-compliance-guide
https://simpletexting.com/sms-compliance/prohibited-content-shaft/
https://ottertext.com/s-h-a-f-t-brands-and-sms-the-truth/
https://www.klaviyo.com/glossary/what-is-shaft
https://eliteextra.com/5-advanced-dispatch-features-that-help-streamline-alcohol-deliveries/
https://sovos.com/blog/ship/what-if-no-one-is-home-to-sign-for-an-alcohol-delivery/
https://sovos.com/blog/ship/direct-to-consumer-dtc-shipping-essentials-age-verification/
https://withpersona.com/blog/age-verification-online-alcohol-retailers
https://www.avalara.com/us/en/learn/whitepapers/getting-it-right-the-4-steps-to-age-verification-for-direct-shippers.html
https://help.doordash.com/en-us/consumers/article/how-is-my-age-verified-for-alcohol-orders
https://dtdriver.deliverthat.com/hc/en-us/articles/22080767399060-Alcohol-Delivery-Verifying-ID-and-Ensuring-Safe-Delivery
https://cyalcohol.com/article/do-i-have-to-sign-for-alcohol-delivery
