## Ticket resale / secondary marketplace
**Vertical:** Retail & hospitality
**Bucket:** Conditional
**URL slug:** /for/ticket-resale

### What this builder is making
A two-sided secondary marketplace where fans list tickets they already hold (sports, concerts, theater) and other fans buy them, with the platform handling escrow, mobile-transfer or barcode delivery, and seller payout after the event. The software tracks listings, comparable-price data, sale events, transfer deadlines, delivery confirmation, and post-event payout to the seller's bank. It is a StubHub/SeatGeek/TickPick-style resale exchange, not the primary box office that issues original inventory.

### Why they need SMS
A seller who has just sold has a hard transfer deadline measured in hours, and missing it cancels the order and penalizes the seller — email buried in a promotions folder is exactly how that deadline gets missed. The buyer, often deciding last-minute on mobile, needs the "your tickets are ready" delivery confirmation in hand before walking into the venue. SMS is the only channel fast and reliable enough to close the gap between sale, transfer, and entry.

### Message categories
1. order-updates — primary; buyer-side purchase, delivery, and payout lifecycle is the core transactional spine
2. account-events — secondary; payout-method failures, suspicious sign-ins, and seller-account holds are churn- and fraud-critical
3. verification — secondary; phone-ownership at signup and step-up confirmation before ownership transfer / payout-detail change
4. customer-support — tertiary; disputes (ticket invalid at gate, transfer not received) are high-stakes and ticket-keyed
Excluded: appointments (no booking/scheduling model), marketing (CONDITIONAL bucket forbids promotional/urgency framing — see constraints), community (no membership/community layer), team-alerts (not an ops/on-call product), waitlist (resale is buy-now inventory, not a queued-allocation product)

### Workflows

**Buyer purchase confirmed**
Confirms the secondary-market sale to the buyer the moment payment clears, before any transfer has happened.
Sequence:
1. order-updates:order-confirmed — "Order confirmed" — purchase placed and paid; seller is being asked to transfer; sets the expectation that delivery follows
Variable aliases:
- estimated_delivery: "by transfer before the event"

**Buyer ticket delivered / ready**
Tells the buyer their tickets have actually landed in their account or app — the moment that lets them enter the venue.
Sequence:
1. order-updates:out-for-delivery — "Tickets transferring" — seller has initiated the mobile transfer / barcode release; buyer should accept it
2. order-updates:order-delivered — "Tickets ready" — tickets are confirmed in the buyer's account and ready to scan at the gate
Variable aliases:
- order_number: "order 8842"
- tracking_link: the accept-transfer / view-tickets link

**Seller listing live**
Confirms to the seller that their tickets are posted and active on the marketplace.
Sequence:
1. order-updates:order-confirmed — "Listing live" — STRETCH; tells the seller their listing is active and visible to buyers
Variable aliases:
- order_number: "listing 5521"
- estimated_delivery: omit / "active now"

**Seller sold — transfer required (deadline-critical)**
The single most important seller message: tickets sold, and the seller must transfer them by a hard deadline or the sale cancels.
Sequence:
1. GAP:ticket-sold-transfer-required — "Tickets sold" — tickets sold; transfer them by the stated deadline to complete the sale and get paid
2. GAP:transfer-deadline-approaching — "Transfer due soon" — reminder fired as the transfer deadline nears and the seller hasn't confirmed
Variable aliases:
- order_number: "sale 5521"

**Seller transfer confirmed**
Acknowledges that the seller's transfer was received, closing the seller's anxiety loop.
Sequence:
1. order-updates:order-delivered — "Transfer received" — STRETCH; confirms the platform received the transfer and the sale is complete
Variable aliases:
- order_number: "sale 5521"
- return_link: support link if the transfer shows a problem

**Seller payout**
Confirms the post-event payout has been released to the seller's bank.
Sequence:
1. order-updates:refund-processed — "Payout sent" — STRETCH; payout for the sold order released to the seller's bank/account
Variable aliases:
- refund_amount: "$240 payout"
- card_type: "bank account"
- order_number: "sale 5521"

**Payout method failed**
Recovers a payout that bounced because the seller's bank/tax details are wrong or missing.
Sequence:
1. account-events:payment-failed — "Payout failed" — STRETCH; payout couldn't be sent; seller must fix bank/TIN details to get paid
Variable aliases:
- card_last4: "account ...4821"
- account_link: payout-settings link

**Buyer refund / order canceled**
Handles the case where the seller failed to deliver and the buyer's order is refunded.
Sequence:
1. order-updates:refund-processed — "Refund processed" — order couldn't be fulfilled; refund returned to the buyer's card
Variable aliases:
- refund_amount: "$185"

**Phone verification at signup**
Proves phone ownership when a buyer or seller registers — baseline fraud control on a marketplace.
Sequence:
1. verification:verification-code — "Verification code" — one-time code at signup

**Step-up confirmation before transfer / payout-detail change**
Confirms a sensitive action — releasing tickets to a buyer or changing payout bank details — with a one-time code.
Sequence:
1. verification:confirmation-code — "Confirmation code" — code required before ownership transfer or payout-method change

**New device sign-in**
Flags account access from an unrecognized device — account-takeover is a live fraud vector when tickets and payouts are at stake.
Sequence:
1. account-events:new-device-sign-in — "New sign-in" — new-device access; secure the account if it wasn't you

**Account hold / suspended**
Notifies a seller their account is suspended (e.g., flagged listing, verification failure, dispute).
Sequence:
1. account-events:account-suspended — "Account on hold" — account suspended; review details and next steps

**Dispute / ticket-issue support thread**
Drives the high-stakes case where a ticket is invalid at the gate or a transfer never arrived.
Sequence:
1. customer-support:ticket-received — "Issue logged" — dispute/support request logged with a reference number
2. customer-support:agent-response — "Reply on your issue" — an agent has responded to the dispute
3. customer-support:resolution-notification — "Issue resolved" — dispute resolved (refund, redelivery, or replacement)
Variable aliases:
- ticket_number: "case 3310" (avoid "ticket" — collides with event tickets)

### Message gaps

**GAP:ticket-sold-transfer-required**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (display alias of order-updates lifecycle; the deadline-to-act seller obligation has no clean corpus parent)
- **Proposed universal name:** Tickets sold — transfer required
- **Why:** the seller's hard, sale-canceling deadline to deliver is the defining moment of this vertical and no corpus message carries a "you must act by {{deadline}} or the sale voids" frame
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your tickets sold. Transfer them by {{transfer_deadline}} to complete the sale: {{action_link}} Reply STOP to opt out.`
  - Friendly: `Good news - your tickets sold. Transfer by {{transfer_deadline}} to finish the sale: {{action_link}} Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: Sold. Transfer by {{transfer_deadline}}: {{action_link}} STOP to opt out.`
- **New variables:** `{{transfer_deadline}}` — the hard cutoff timestamp by which the seller must transfer; budget ~22 chars; source: order/sale record; example: "today 6pm ET". `{{action_link}}` — already in corpus (team-alerts).

**GAP:transfer-deadline-approaching**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (reminder paired with the sold message above)
- **Proposed universal name:** Transfer deadline approaching
- **Why:** a missed transfer cancels the sale and penalizes the seller, so the nudge before the deadline is a distinct, high-value message
- **Draft variants:**
  - Standard: `{{workspace_name}}: Reminder - transfer your sold tickets by {{transfer_deadline}} or the sale cancels: {{action_link}} Reply STOP to opt out.`
  - Friendly: `Quick reminder - your sold tickets need transferring by {{transfer_deadline}}: {{action_link}} Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: Transfer by {{transfer_deadline}} or sale cancels: {{action_link}} STOP to opt out.`
- **New variables:** `{{transfer_deadline}}` — as above. `{{action_link}}` — corpus.

**STRETCH:order-updates:order-confirmed**
- **Classification:** Stretch
- **Proposed corpus home:** order-updates:order-confirmed — fits "Listing live" only loosely: corpus body says "Arrives {{estimated_delivery}}. We'll text you when it ships," which is buyer-fulfillment language, not "your listing is now active and visible to buyers"
- **Proposed universal name:** Order confirmed (aliased to "Listing live")
- **Why:** the seller-listing-active event reuses the confirmation shape but the shipping/arrival framing reads wrong for a listing going live
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your listing {{order_number}} is live and visible to buyers. Manage it here: {{tracking_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} listing {{order_number}} is live - buyers can see it now. Manage it: {{tracking_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Listing {{order_number}} is live. {{tracking_link}} STOP to opt out.`

**STRETCH:order-updates:order-delivered**
- **Classification:** Stretch
- **Proposed corpus home:** order-updates:order-delivered — used twice (buyer "Tickets ready" fits cleanly; seller "Transfer received" stretches, since the corpus body's "Something wrong? Start here" return framing doesn't match a seller-side transfer acknowledgment)
- **Proposed universal name:** Order delivered (aliased to "Transfer received")
- **Why:** the seller needs confirmation the platform received their transfer; the corpus delivered-with-return-link body is buyer-shaped
- **Draft variants:**
  - Standard: `{{workspace_name}}: We received your transfer for sale {{order_number}}. The sale is complete. Reply STOP to opt out.`
  - Friendly: `Your transfer for {{workspace_name}} sale {{order_number}} came through - the sale is complete. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Transfer received, sale {{order_number}} complete. STOP to opt out.`

**STRETCH:order-updates:refund-processed**
- **Classification:** Stretch
- **Proposed corpus home:** order-updates:refund-processed — fits "Payout sent" by repurposing the refund frame; "refund" reads as money back to a buyer, not a seller payout, so the body needs reframing to "payout"
- **Proposed universal name:** Refund processed (aliased to "Payout sent")
- **Why:** seller payout is mechanically a money-out event the refund message shape covers, but the buyer-refund wording would confuse a seller
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your payout of {{refund_amount}} for sale {{order_number}} was sent to your {{card_type}}. Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} payout of {{refund_amount}} for sale {{order_number}} is on its way to your {{card_type}}. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{refund_amount}} payout sent for {{order_number}} to your {{card_type}}. STOP to opt out.`

**STRETCH:account-events:payment-failed**
- **Classification:** Stretch
- **Proposed corpus home:** account-events:payment-failed — fits "Payout failed" inverted: corpus body is a charge declined ("keep your account active"), here it's a payout that couldn't be sent ("fix your bank/tax details to get paid")
- **Proposed universal name:** Payment failed (aliased to "Payout failed")
- **Why:** a bounced payout is a money-movement failure the corpus payment-failed shape covers, but the inbound-charge framing is wrong direction
- **Draft variants:**
  - Standard: `{{workspace_name}}: We couldn't send your payout - check your bank details to get paid: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} payout didn't go through. Update your bank details here to get paid: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Payout failed. Update bank details: {{account_link}} STOP to opt out.`

### Content constraints
- This is a CONDITIONAL vertical: secondary-market resale is registrable for transactional messaging, but message bodies draw scalping/deceptive-pricing scrutiny and must stay strictly factual and transactional.
- No artificial-scarcity or urgency manipulation in any body: prohibit "only 2 left," "selling fast," "last chance," "prices rising," "buy now before it's gone." A genuine, factual transfer deadline ({{transfer_deadline}}) tied to a real seller obligation is allowed; manufactured purchase urgency is not.
- No misleading pricing framing: no "below face," "cheapest seats," "best deal," or struck-through/"was $X" comparisons in SMS. Price figures, if shown, must be all-in (every mandatory fee included) per the FTC Rule on Unfair or Deceptive Fees (effective May 12, 2025) — partial/drip pricing in a message body is a deceptive-fee exposure.
- No promotional content at all in the transactional categories used here (order-updates, account-events). Any genuinely promotional resale message would require separate marketing consent and EIN-gating — and even then the no-urgency/no-deceptive-pricing rules apply; recommend keeping this vertical transactional-only.
- BOTS Act exposure is upstream of messaging but reputationally adjacent: do not let message copy imply bulk/bot-assisted listing or purchase-limit circumvention.
- Disambiguate the word "ticket": support-thread bodies use a case/reference alias (ticket_number aliased to "case") to avoid colliding with the event tickets being sold.
- Standard transactional hygiene still applies: "Reply STOP to opt out." (Brief: "STOP to opt out.") on every body in every category except Verification.

### Disambiguation
The Clear sibling is PRIMARY event ticketing — an organizer, venue, or box office selling its own original inventory; that builder has full latitude for on-sale announcements and event reminders because they control the inventory and there is no resale markup to scrutinize. Secondary resale tips into Conditional precisely because a third party is reselling someone else's tickets, which is the activity BOTS Act / FTC deceptive-pricing enforcement targets — so the same "tickets on sale, grab them" copy that is fine for a primary organizer becomes a scalping/urgency red flag here. A peer-to-peer "transfer the ticket you can't use to a friend at face" tool looks adjacent but is not a marketplace and avoids most pricing scrutiny; a season-ticket-holder exchange run by the team itself sits closer to primary. What looks allowed but isn't: discount/"below face" framing and scarcity nudges feel like ordinary retail marketing but are the exact patterns flagged as deceptive in the secondary market — keep this vertical to factual sale/transfer/payout confirmations only.

### Sources
https://newsroom.stubhub.com/2026/03/30/understanding-ticketing-how-platforms-like-stubhub-work/
https://en.wikipedia.org/wiki/StubHub
https://www.sharetribe.com/create/how-to-build-marketplace-for-event-tickets/
https://support.stubhub.com/articles/61000276591-get-paid-for-sold-tickets
https://support.stubhub.com/articles/61000276597-ticket-delivery-deadlines
https://support.seatgeek.com/hc/en-us/articles/360007201314-How-do-I-sell-tickets-on-the-SeatGeek-Marketplace
https://www.tickpick.com/sell-tickets/
https://help.ticketmaster.com/hc/en-us/articles/9781090147985-Third-Party-Resale-Tickets-Everything-You-Need-to-Know
https://ticketflipping.com/blog/selling-on-stubhub-the-complete-beginners-guide-for-2026/
https://www.ftc.gov/business-guidance/blog/2025/04/bots-act-compliance-time-refresher
https://www.insideprivacy.com/consumer-protection/ftc-sues-live-nation-and-ticketmaster-for-deceptive-pricing-tactics/
https://www.wiley.law/alert-Executive-Order-on-Ticket-Resale-Market-Calls-for-Greater-FTC-Enforcement
https://www.whitehouse.gov/fact-sheets/2025/03/fact-sheet-president-donald-j-trump-will-end-price-gouging-by-middlemen-in-the-entertainment-industry/
