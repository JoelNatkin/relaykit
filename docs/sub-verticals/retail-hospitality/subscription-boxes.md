## Subscription boxes / recurring physical goods
**Vertical:** Retail & hospitality
**Bucket:** Clear
**URL slug:** /for/subscription-boxes

### What this builder is making
A subscription-box business that charges a customer on a recurring cycle (monthly, quarterly) and ships a curated physical box each cycle — coffee, snacks, beauty, pet, hobby kits — typically running on a Cratejoy-style all-in-one platform or a Shopify subscription app like Recharge, Subbly, or Awtomic. The software tracks two intertwined arcs: the recurring billing cycle (upcoming charge, card on file, dunning, renewal, plan changes) and the per-cycle fulfillment arc (charge succeeds, box assembled, ships, delivered). The builder lives and dies by involuntary churn — a declined card that goes unnoticed silently ends a subscriber.

### Why they need SMS
Two moments decide a subscriber's lifetime value, and both get buried in email: the upcoming-order window where they can still skip, swap, or customize before the cutoff, and the failed-charge moment where a stale card silently cancels them. A dunning email sits unread in promotions while the retry window closes and the subscriber churns involuntarily — an SMS that the card declined gets opened in minutes and the box gets saved. SMS wins because both moments are time-boxed and high-consequence: miss the cutoff and the wrong box ships; miss the retry and the subscriber is gone.

### Message categories
1. account-events — recurring billing is the churn-critical lane: failed charge / dunning, renewal confirmation, plan changes. This is where subscribers are saved or lost.
2. order-updates — the per-cycle fulfillment arc (charge succeeds → assembled → shipped → out for delivery → delivered) runs every single cycle for every subscriber.
Excluded: appointments (no scheduled in-person service), community (no member community layer), customer-support (a support inbox exists but is not the builder's defining SMS need — order-updates and account-events carry the load), team-alerts (internal ops, not subscriber-facing), waitlist (only relevant to limited-edition drops, an edge case not the core model), marketing (promotional cross-sell/upsell is explicitly out of the transactional order-updates lane and requires separate EIN-gated marketing consent — available but not a core transactional category).

### Workflows

**Upcoming order / pre-cutoff reminder**
Tells a subscriber their next box charges and ships soon, while there's still time to skip, swap, or customize before the cutoff — the single biggest lever on satisfaction and voluntary churn.
Sequence:
1. GAP:upcoming-cycle-reminder — "Your box ships soon" — sent ~3 days before the charge/cutoff: your next {{workspace_name}} box renews on {{renewal_date}}; skip or customize before then.

**Subscription confirmed / first cycle started**
Confirms the recurring subscription is active right after signup, so the subscriber knows the plan is running.
Sequence:
1. account-events:subscription-confirmed — "Subscription active" — sent when the recurring subscription is created or a plan change goes through.

**Per-cycle fulfillment arc**
The shipping lifecycle that repeats every billing cycle — the status updates subscribers actually want, keeping them confident the box is on its way.
Sequence:
1. order-updates:order-confirmed — "This month's box is confirmed" — sent when the cycle charge succeeds and the box order is created.
2. order-updates:order-processing — "Your box is being packed" — sent when the box moves into curation/assembly.
3. order-updates:order-shipped — "Your box shipped" — sent when the box ships, with tracking.
4. order-updates:out-for-delivery — "Out for delivery today" — sent when the carrier marks it out for delivery.
5. order-updates:order-delivered — "Your box was delivered" — sent on delivery, with a path to report an issue.
Variable aliases (only where the default example would feel wrong for this sub-vertical):
- order_number: "the cycle/box order, e.g. June 2026 box"
- estimated_delivery: "Jun 18"

**Failed charge / dunning**
The churn-critical save: the recurring card declined and the subscription will lapse unless the subscriber updates payment within the retry window.
Sequence:
1. account-events:payment-failed — "Your box payment didn't go through" — sent when the recurring charge is declined; links to update the card before retries exhaust.
Variable aliases (only where the default example would feel wrong for this sub-vertical):
- account_link: "the manage-subscription / update-payment page"

**Renewal / plan change confirmation**
Confirms a renewal, an upgrade/downgrade, a frequency change, or a cancellation went through.
Sequence:
1. account-events:subscription-confirmed — "Your subscription change is confirmed" — sent when a renewal, plan change, or cancellation processes.

**Trial / intro-offer ending**
For boxes that lead with a free or discounted first month, nudges the subscriber before the intro rolls into full recurring price.
Sequence:
1. account-events:trial-ending — "Your intro period ends soon" — sent a few days before the intro/trial converts to a paid recurring plan.

**Return / damaged box resolution**
Handles a damaged or wrong box — the subscriber starts a return/replacement and tracks it.
Sequence:
1. order-updates:order-delivered — "Your box was delivered" — delivery notice already carries the "something wrong?" path.
2. order-updates:return-started — "Your replacement/return is started" — sent when a return or replacement is opened.
3. order-updates:refund-processed — "Your refund is processed" — sent when a refund returns to the card, if applicable.

### Message gaps

**GAP:upcoming-cycle-reminder**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:upcoming-renewal (the pre-charge, pre-cutoff reminder for any recurring-billing product — distinct from trial-ending, which fires at trial conversion, and from subscription-confirmed, which fires after the fact)
- **Proposed universal name:** Upcoming renewal
- **Why:** every recurring-billing builder needs a "you're about to be charged / renewed, here's the window to change it" pre-event nudge, and no corpus message fires before a scheduled recurring charge.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your next box renews {{renewal_date}}. Skip or change it before then: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Heads up - your {{workspace_name}} box renews {{renewal_date}}. Want to skip or swap? Do it here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Box renews {{renewal_date}}. Skip/change: {{account_link}} STOP to opt out.`
- **New variables:** `{{renewal_date}}` — the date the next recurring charge/cycle processes; ~10 chars; source: subscription billing schedule; example: "Jun 18".

### Content constraints
- Standard carrier rules apply. The per-cycle fulfillment and recurring-billing messages are transactional (DELIVERY_NOTIFICATION and ACCOUNT_NOTIFICATION TCR use cases) — keep them factual, no promotional content.
- No cross-sell or upsell inside order-updates bodies (corpus rule for the category) — a subscription-box builder will be tempted to upsell add-ons in the shipping text; that belongs in a separate EIN-gated marketing campaign with its own consent, never in the transactional shipping lane.
- The upcoming-renewal/cutoff reminder must stay informational ("renews on X, change it here") — framing it as a promotional "don't miss out, restock now" message reclassifies it as marketing.
- Recurring billing and shipping consent does not grant marketing consent: promotional offers, win-back/re-engagement, and product-launch texts require separate explicit marketing consent (EIN-gated, SHAFT-C prohibited).

### Disambiguation
Neighbors: general e-commerce / DTC retail (one-off orders) and SaaS subscriptions (recurring billing, no shipment). Subscription boxes are the intersection — a recurring charge AND a recurring physical shipment — which is why both account-events and order-updates carry real weight here, where a pure-retail builder leans only on order-updates and a pure-SaaS builder leans only on account-events. What stays Clear: the transactional billing and shipping arc. What would tip toward marketing consent (not the transactional bucket): "you've been gone, here's 20% to come back" win-back texts, add-on/upsell promos, and limited-edition-drop announcements — these look like routine subscriber comms but are promotional and need their own marketing registration. A subscription-box win-back is the classic trap: a "your subscription cancelled, jump back on" confirmation is transactional, but the same message with an incentive is marketing.

### Sources
https://www.subbly.co/blog/4-alternatives-to-cratejoy-subbly/
https://www.capterra.com/p/173276/Cratejoy/
https://getrecharge.com/blog/how-to-automate-text-messages-to-boost-ltv-and-reduce-churn/
https://support.getrecharge.com/hc/en-us/articles/360008683314-Creating-a-cut-off-window
https://docs.awtomic.com/docs/how-to-enable-sms-text-subscription-notifications-with-awtomatic-subscriptions
https://support.yotpo.com/docs/sending-subscription-notifications-via-sms
https://www.omnisend.com/blog/text-subscription/
https://help.twilio.com/articles/4408675845019-SMS-Compliance-and-A2P-10DLC-in-the-US
https://www.infobip.com/blog/tcpa-compliance-sms
