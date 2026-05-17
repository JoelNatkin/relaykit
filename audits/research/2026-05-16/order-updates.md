# Order updates — Lead-Magnet Research
**Date:** 2026-05-16
**TCR mapping:** DELIVERY_NOTIFICATION
**Classification:** workflow
**Authored by:** PM (Session 91)

## 1. Industry pattern observations

Order updates is the most mature SMS use case after Appointments — e-commerce platforms have shipped delivery-notification SMS for over a decade and the patterns are well-codified. The challenge for indie SaaS is that the audience splits: indie founders building hybrid products (Stripe + physical SKUs + Shopify), creator-economy platforms with digital downloads (Gumroad, Lemon Squeezy-shaped), and pure-software indie SaaS where "orders" maps to subscription events more than shipping.

For indie SaaS proper, real Order updates use cases: course-creator platforms confirming purchases and granting access, digital download services, indie e-comm built on Stripe + custom storefront, subscription box services with physical fulfillment, print-on-demand services, hardware + software bundles, and any indie SaaS with a one-time-purchase digital good (templates, presets, fonts, themes).

Reference apps observed: Shopify's native SMS (industry baseline, heavy carrier-link integration), Postscript (Shopify-focused SMS marketing + transactional), Klaviyo's order-update template library, Shippo and EasyPost (delivery-logistics SaaS for shippers), Gumroad and Lemon Squeezy (digital-heavy, mostly email but pattern reference), AfterShip (delivery tracking, multi-carrier integration). Stripe's webhook event taxonomy is the cleanest reference for subscription-adjacent order shapes — though those events lean toward the Account events / Subscription lifecycle category under investigation, not Order updates proper.

The split between physical-shipped orders and digital-delivered orders is meaningful enough to affect which stages apply per user.

## 2. Stages identified

Seven workflow stages cover the order-update lifecycle. Stage applicability varies by digital-only vs physical-shipped vs hybrid:

1. **Order confirmation** (default on, all order types) — triggerCue: *Sent immediately after order is placed and payment confirmed.* The "your order is locked in" moment. Includes order number, total, and access path or shipping ETA.

2. **Processing** (optional, physical-shipped) — triggerCue: *Sent when order moves from received to in-preparation in the developer's system.* Often skipped in indie SaaS — high-volume retailers use it to set expectations during fulfillment lag.

3. **Shipping confirmation** (default on, physical-shipped) — triggerCue: *Sent when order ships from warehouse or fulfillment partner.* Includes tracking number and tracking link. Most-opened message in the physical-order sequence.

4. **Out for delivery** (optional, physical-shipped) — triggerCue: *Sent when carrier marks package out-for-delivery on delivery day.* Carriers often send their own version; the indie SaaS version is duplicative unless it adds value (delivery instructions, photo confirmation expectation).

5. **Delivered** (default on, physical-shipped) — triggerCue: *Sent when carrier marks package delivered.* Closes the shipping arc. Often paired with action prompt ("Issue with your order? [link]").

6. **Return initiated** (conditional, all order types) — triggerCue: *Sent when customer initiates a return through the developer's system.* Confirms return receipt and refund-pending status.

7. **Refund processed** (conditional, all order types) — triggerCue: *Sent when refund is processed back to original payment method.* Closes the return arc.

**Digital-only orders** typically subscribe to stages 1 and 7 only (plus 6 if returns/refunds apply). **Physical-shipped orders** typically subscribe to 1, 3, 5 minimum, with 2, 4, 6, 7 as add-ons. **Hybrid orders** use all that apply. The lead-magnet checkbox UX scales cleanly across these shapes.

Delivery exception ("address unrecognized," "delivery attempted but failed") was considered as stage 8 — flagged in §6 as a possible add. Currently most indie SaaS defers this to carrier-direct notifications.

## 3. Voice patterns observed

Order update SMS reads as **functional, status-anchored, action-clear**. Shorter than Appointments — typically 50-120 characters. The status word and the action link are the message; everything else is supporting context.

Confirmation cues: "confirmed," "received," "in." Avoid: "we have received your order request" (corporate, slow).

Shipping cues: "shipped," "on the way," "out for delivery." Tracking links are non-negotiable in shipping confirmations — the link IS the value of the message.

Delivery cues: "delivered." Short, declarative. Optional action prompt ("issue? reply or [link]") if the developer wants to capture exceptions.

Return/refund cues: "return started," "refund processed," "refunded to [card type]." Specific beats vague — recipients want to know the money's actually moving.

Variables: `{{order_number}}` (always), `{{tracking_number}}` and `{{tracking_link}}` (shipping/out-for-delivery/delivered), `{{customer_name}}` or `{{first_name}}` (optional), `{{estimated_delivery}}` (confirmation/shipping), `{{return_link}}` (delivered), `{{order_total}}` (refund). Product names usually omitted — too long for SMS, privacy-sensitive for multi-item orders.

Personalization moderate. Order number and tracking link always; everything else conditional.

## 4. B2B vs B2C variations

B2B order SMS is rare in indie SaaS contexts — procurement workflows run through email. Exceptions: time-critical shipments (overnight, perishable, regulated goods), executive purchases requiring expedited tracking. Tone slightly more formal; carrier-tracking link expected.

B2C order SMS is the dominant pattern — standard across consumer e-commerce. Frequency higher (1-3 messages per order common), variable use heavier, tone warmer.

Indie SaaS launch audience splits: course creators and digital-product sellers lean B2C; B2B SaaS with hardware components (analytics dongles, IoT-adjacent) lean B2B. Default templates should target B2C with B2B-friendly variants noted at message authoring.

## 5. Compliance constraints / TCR considerations

- **TCR DELIVERY_NOTIFICATION mapping.** Standard Class — auto-approved at TCR for Brand Tier LOW per experiment 3a baseline. Lowest carrier scrutiny among the categories we'll register.
- **STOP language required.** Every message. Standard requirement.
- **Quiet hours apply with reasonable interpretation.** Recipient-triggered events (your order shipped) acceptable at any time per common industry practice; proactive reminders should respect 8am-9pm.
- **No promotional content in delivery notifications.** "Your order shipped. Save 10% on your next order!" converts to mixed content and risks the campaign classification. Cross-sell prompts belong in Marketing (separate campaign).
- **Carrier-tracking links acceptable.** UPS/USPS/FedEx tracking URLs are well-known to carriers and don't increase suspicion. Public URL shorteners (Bit.ly) still discouraged.
- **Address/PII in SMS.** Shipping addresses generally omitted from SMS (too long, too sensitive). Confirmation messages should reference order number, not address.

## 6. Open questions / followups

- **Subscription "orders" vs one-time orders.** Stripe-driven recurring subscription notifications ("your subscription renewed," "payment failed") feel adjacent but probably belong in the Account events / Subscription lifecycle category we're researching as an open question. Confirm split: Order updates = one-time purchases, Account events = recurring subscription lifecycle.
- **License key / download access delivery for digital products.** "Your license key: ABCDEF" is order-adjacent (tied to a purchase event) but verification-adjacent (a code the user inputs). Probably belongs in Order confirmation as a variant ("Your purchase is confirmed. Download/access: [link]"), not as a separate Verification sub. Flag for confirmation.
- **Multi-item orders shipping separately.** Behavior varies — some retailers send one SMS per shipment, others consolidate. Lead magnet should support both patterns via parameterization rather than picking one. Flag for messaging guidance.
- **Delivery exceptions.** Failed delivery, address unrecognized, weather-delayed. Most indie SaaS defers these to carrier-direct notifications rather than wrapping. Add as stage 8 or skip at launch? My lean: skip at launch, add post-launch if customer demand surfaces.
- **Refund partial vs full.** "Refunded $X of $Y" vs "Refunded $Y in full." Lead magnet should parameterize the refund amount and let the developer choose phrasing. Flag for variable-shape confirmation.

## 7. Notable references

- Shopify SMS templates (industry baseline for delivery notifications)
- Postscript template library — Shopify-focused but pattern coverage broad
- Klaviyo order-update template library
- Shippo and EasyPost SMS templates — logistics-SaaS reference
- Stripe webhook event types (`payment_intent.succeeded`, `charge.refunded`) — trigger reference
- AfterShip multi-carrier delivery tracking — pattern reference for tracking-link integration
- TCR DELIVERY_NOTIFICATION category specifications
