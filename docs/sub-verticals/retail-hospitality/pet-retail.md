## Pet retail / specialty pet goods
**Vertical:** Retail & hospitality
**Bucket:** Clear
**URL slug:** /for/pet-retail

### What this builder is making
A direct-to-consumer pet goods store — food, treats, supplements, litter, toys, accessories — usually built on a "Chewy-for-X" auto-ship model where the core revenue is recurring replenishment rather than one-off carts. The software tracks orders, shipments, and a subscription engine that re-bills and re-ships food on the customer's consumption cycle (every 4–8 weeks). The recurring nature means the operationally important moments are split between order fulfillment and subscription billing.

### Why they need SMS
The make-or-break moment is the auto-ship reminder before a renewal: the customer has a 24-hour window to skip, change quantity, or reschedule before the card is charged and the bag ships, and a missed reminder means an unwanted shipment, a refund, and a churn risk. Email reminders for this get buried, but a text lands while the customer can still act. SMS also wins on the failed-renewal-payment recovery, where a lapsed card silently breaks the auto-ship and the pet runs out of food before anyone notices.

### Message categories
1. order-updates — auto-ship and one-off orders both run the full confirm→ship→deliver lifecycle; this is the primary surface
2. account-events — recurring subscription billing: renewal confirmations, failed-payment recovery, plan changes — the churn-critical layer for an auto-ship business
3. marketing — promotional offers and new-product launches, EIN-gated and consent-separate; secondary, real but not core
Excluded: appointments (no booking model — services are a separate vertical), verification (possible at signup but not characteristic of the vertical), team-alerts (internal ops, not customer-facing here), community (no community product), waitlist (occasional for limited-drop/restock but not characteristic), customer-support (real but generic; not a defining workflow for this sub-vertical)

### Workflows

**One-off order fulfillment**
Moves a single non-subscription purchase from checkout to doorstep — the standard retail lifecycle.
Sequence:
1. order-updates:order-confirmed — "Order confirmed" — order placed and paid, ETA given
2. order-updates:order-shipped — "Shipped" — carrier handoff with tracking link
3. order-updates:out-for-delivery — "Out for delivery" — package arriving today
4. order-updates:order-delivered — "Delivered" — left at door, return path if wrong

**Auto-ship renewal cycle**
The core recurring-revenue loop: warn before the charge, confirm the charge, then fulfill the replenishment shipment.
Sequence:
1. GAP:autoship-reminder — "Your refill ships soon" — sent ~5 days before the renewal charge with skip/change link, inside the editable window
2. account-events:subscription-confirmed — "Auto-ship renewed" — renewal charge went through, this cycle's shipment is locked in
3. order-updates:order-shipped — "Shipped" — replenishment bag on the way with tracking
4. order-updates:out-for-delivery — "Out for delivery" — arriving today
5. order-updates:order-delivered — "Delivered" — completed
Variable aliases:
- estimated_delivery: "Tue, before you run out"

**Auto-ship payment recovery**
Catches a failed renewal charge before the auto-ship silently breaks and the pet runs out of food.
Sequence:
1. account-events:payment-failed — "Card declined" — renewal charge failed, update payment to keep the auto-ship active
2. account-events:subscription-confirmed — "Back on track" — payment updated, renewal reprocessed and shipment resumed

**Subscription change confirmation**
Confirms when a customer edits cadence, quantity, swaps a product, or pauses — reassurance that the change took before the next charge.
Sequence:
1. account-events:subscription-confirmed — "Auto-ship updated" — cadence/quantity/pause change is saved, details in account

**Return / refund**
Handles a wrong, damaged, or refused item after delivery.
Sequence:
1. order-updates:return-started — "Return started" — return logged, status link
2. order-updates:refund-processed — "Refund processed" — money back to card

**Promotional offer** (marketing — EIN-gated, separate consent)
Drives repeat purchase with a sale or bundle to an opted-in marketing audience.
Sequence:
1. marketing:promotional-offer — "Offer" — sale window or bundle with claim link

**New product launch** (marketing — EIN-gated, separate consent)
Announces a new food line, flavor, or accessory to opted-in subscribers.
Sequence:
1. marketing:product-launch — "Now in stock" — new product live with link

**Restock / back-in-stock waitlist**
For limited-drop or frequently-out-of-stock SKUs, notifies a customer when their item returns. Occasional, not characteristic — included for completeness.
Sequence:
1. waitlist:your-turn — "Back in stock" — the item the customer waited on is available, claim link
Variable aliases:
- claim_link: "store.example/restock"

### Message gaps

**GAP:autoship-reminder**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:renewal-reminder
- **Proposed universal name:** Renewal reminder
- **Why:** subscription/auto-ship businesses universally need a pre-charge nudge inside the edit window, and no corpus message covers the "renews soon, change before we bill" moment — trial-ending is the nearest but is trial-specific, and subscription-confirmed fires after the charge
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your auto-ship renews {{renewal_date}}. Skip or change before then: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Heads up - your {{workspace_name}} auto-ship renews {{renewal_date}}. Want to skip or change it? {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Auto-ship renews {{renewal_date}}. Change: {{account_link}} STOP to opt out.`
- **New variables:** `{{renewal_date}}` — date the next auto-ship charge/ship runs, budget ~10 chars, source: subscription engine, example: "Jun 25"

### Content constraints
- Standard carrier rules apply for order-updates and account-events bodies.
- CBD pet products (oils, calming treats): SHAFT-C / cannabis carrier sensitivity applies — keep CBD out of marketing SMS bodies; carriers may filter or block. Mention is a real risk for stores carrying a CBD line.
- Pet pharmacy / prescription items (flea-and-tick Rx, vet meds): medical-adjacent content is out of scope for this entry — do not put prescription, dosage, or health-claim language in bodies. A store selling Rx products should treat those notifications as a separate, pharmacy-governed concern.
- Marketing category only: EIN-gated, requires separate explicit marketing consent, no promotional content in transactional (order-updates / account-events) bodies.

### Disambiguation
Pet retail here means selling physical goods — the auto-ship e-commerce business. It is distinct from pet services (grooming, boarding, walking, daycare), which run a booking/appointments model and belong to a separate Home & Local Services entry; if the builder's core object is an appointment rather than an order, it is not this sub-vertical. It is also distinct from veterinary and pet-health software, where medical content, prescriptions, and health records put it out of scope entirely. A store stays Clear as long as it messages about orders and billing; it tips toward Conditional only when it leans into a CBD product line in marketing SMS or sells prescription items, both of which import content restrictions from outside plain retail. The "Chewy-for-X" framing (subscription replenishment of consumables) is the reliable tell that you are in this entry rather than services or health.

### Sources
https://www.petsmart.com/learning-center/autoship/how-petsmart-autoship-works
https://www.petsmart.com/help/your-order-H0003d.html
https://www.petsupermarket.com/autoship-and-save-faq.html
https://help.smallpetselect.com/en-US/auto-ship-and-save-faqs-388735
https://www.chewy.com/b/autoship-save-15682
https://www.petco.com/s/autoship
https://www.petco.com/content/petco/PetcoStore/en_US/pet-services/terms-of-use/sms-terms-conditions.html
https://www.zigpoll.com/content/what-are-some-effective-sms-marketing-automation-strategies-to-increase-repeat-purchases-of-pet-food-and-accessories-through-my-ecommerce-store
https://www.eztexting.com/industries/pet-care
https://blog.textedly.com/sms-text-delivery-service-order-update-templates
https://www.fda.gov/animal-veterinary/fda-regulation-animal-drugs
