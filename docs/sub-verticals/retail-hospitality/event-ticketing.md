## Event ticketing (primary sales — venues, organizers)

**Vertical:** Retail & hospitality
**Bucket:** Clear
**URL slug:** /for/event-ticketing

### What this builder is making
An Eventbrite-for-X primary ticketing platform that lets a venue, promoter, or independent organizer publish an event, sell its own tickets, take payment, and run the door — issuing each buyer a mobile ticket with a scannable QR code and checking attendees in at entry. It triggers messages off ticketing state (purchase confirmed, ticket issued/transferred, event approaching, doors/gates open, event changed or cancelled, checked in, event over) and segments by ticket tier (GA, VIP, will-call). It is the organizer's own sales-and-admission layer for its own events — not a secondary/resale marketplace where one fan sells to another, and not a marketing blast tool for "tickets on sale" demand generation.

### Why they need SMS
The expensive failure is the buyer who can't find their ticket at the gate: a QR code buried in an email thread means a stalled line, an angry attendee, and a door staffer manually looking up a name while a crowd backs up behind them. SMS wins because the ticket and the day-of entry instructions are needed phone-in-hand, in motion, in the exact minutes before doors — a text with the QR and gate is read in seconds where the confirmation email is unopened, and a 98%-open channel is the only reliable way to push a same-day venue change, weather hold, or "doors open now" to people already en route. Post-event, the survey lands while the experience is fresh instead of sitting in an inbox until the attendee is home.

### Message categories
1. order-updates — a ticket purchase is a paid order: confirmation, the issued/delivered "here's your ticket" event, transfers, and refunds map directly onto the order lifecycle (the transactional spine)
2. appointments — the event is a scheduled time the buyer committed to: distant/proximate reminders, reschedule, and post-event feedback fit the appointment arc
3. customer-support — buyer questions about a ticket, will-call, or a refund request route through ticket lifecycle; proactive outreach for day-of disruptions
4. account-events — payment failed on a card used for a ticket purchase or a payment-plan installment
Excluded: waitlist (a sold-out-show "notify me when more release" queue is plausible but secondary, and most primary platforms surface availability in-app rather than running a consumer "you're up" page — flag as edge, not primary), community (no membership/community layer between an organizer and one-off ticket buyers), verification (ticket purchase doesn't require SMS 2FA; entry is the QR, not an OTP), team-alerts (door/box-office staff scheduling is real but it's the venue's ops tooling, not the attendee-facing ticketing surface this entry covers), marketing ("tickets on sale / last chance / event invitation" promotional blasts are real and valuable but are the marketing category — separate explicit consent, EIN-gated, second registration — never folded into the transactional ticket thread; see Disambiguation)

### Workflows

**Ticket purchase confirmation**
Confirms a paid ticket order the instant it's bought and gives the buyer a record they can trust.
Sequence:
1. order-updates:order-confirmed — "Ticket confirmed" — sent right after purchase and payment; "your order for [event] is confirmed — we'll text your ticket"
Variable aliases:
- order_number: "order #TKT-4821"
- estimated_delivery: "Sat Jul 18, doors 7:00 PM"

**Ticket delivery (QR / mobile ticket)**
Puts the actual scannable ticket on the attendee's phone — the most distinctive ticketing SMS moment.
Sequence:
1. GAP:ticket-issued — "Your ticket" — sent when the mobile ticket/QR is ready (at purchase or release); carries the link to the scannable QR and seat/tier (see Message gaps)
Variable aliases:
- (ticket link and seat carried by GAP variables — see Message gaps)

**Ticket transfer**
Confirms a ticket was sent to or received from another person, so both parties and the door agree on who holds it.
Sequence:
1. GAP:ticket-transferred — "Ticket transferred" — sent to sender ("you sent your ticket to [name]") and recipient ("[name] sent you a ticket for [event]"), with the recipient's claim/QR link (see Message gaps)
Variable aliases:
- (recipient name and claim link carried by GAP variables — see Message gaps)

**Event reminder (distant)**
Nudges the buyer the day before so the ticket is found, calendars are checked, and no-shows drop.
Sequence:
1. appointments:reminder-distant — "Event tomorrow" — sent the day before; "[event] is tomorrow, doors 7pm — your ticket's in this thread"
Variable aliases:
- appointment_time: "tomorrow, doors 7:00 PM"
- provider_name: STRETCH — an event isn't a named practitioner; phrase as the event/venue (see Message gaps)
- cancel_link: "tap to view your ticket"

**Day-of entry instructions / doors open**
The single most-valued day-of message: tells the attendee when doors/gates open, which entrance, where to park, and re-surfaces the QR right before they need it.
Sequence:
1. GAP:doors-open — "Doors open" — sent same-day (a few hours before, or at doors); "doors open 7pm at Gate B — parking on Lot 4 — your ticket: [link]" (see Message gaps)
2. appointments:reminder-proximate — "Starting soon" — optional, ~1h before; "[event] starts in about an hour"
Variable aliases:
- appointment_time: "7:00 PM, Gate B"

**Event change / venue or time update**
Pushes a same-day or near-term change (new start time, gate, weather hold, venue move) to people already planning around the original.
Sequence:
1. customer-support:service-status-alert — "Event update" — sent when a detail changes; "heads up — tonight's start moved to 8pm, doors now 7pm. Same ticket."
Variable aliases:
- eta: "new start 8:00 PM"

**Event cancellation / postponement + refund**
Tells ticket holders an event is off or moved and resolves the money cleanly.
Sequence:
1. customer-support:service-status-alert — "Event cancelled" — sent when the event is cancelled or postponed; "[event] is cancelled — refunds processing automatically, no action needed"
2. order-updates:refund-processed — "Refund" — sent when the ticket refund hits the card; "[amount] refunded for order [#] to your [card]"
Variable aliases:
- refund_amount: "$45.00"
- order_number: "order #TKT-4821"

**Buyer support / will-call question**
Handles a ticket-holder question (can't find ticket, will-call pickup, name change) through the support lifecycle.
Sequence:
1. customer-support:ticket-received — "Support" — sent when a buyer's question is logged; "got your question about order [#] — we'll reply soon"
2. customer-support:agent-response — "Support reply" — sent when staff respond; "we replied — tap to read"
3. customer-support:resolution-notification — "Resolved" — sent when handled; "all set — still stuck? reopen here"
Variable aliases:
- ticket_number: "order #TKT-4821" (the support thread references the ticket order, not a help-desk number)
- ticket_link: "tap to view"

**Failed payment (purchase or payment plan)**
Recovers a declined card before a ticket order or a buy-now-pay-later installment fails silently and the seat is released.
Sequence:
1. account-events:payment-failed — "Payment" — sent when the card is declined at purchase or on a plan installment; "card ending 4242 was declined — update to keep your tickets"
Variable aliases:
- card_last4: "4242"
- account_link: "tap to update your card"

**Post-event feedback**
Captures a rating/survey while the event is fresh, generated from checked-in attendees.
Sequence:
1. appointments:post-appointment — "How was it?" — sent after the event ends; "thanks for coming to [event] — how was it?"
Variable aliases:
- provider_name: STRETCH — no provider; phrase as "thanks for coming to [event]" (see Message gaps)
- feedback_link: "tap to leave quick feedback"

### Message gaps

**GAP:ticket-issued**
- **Classification:** Universal miss
- **Proposed corpus home:** order-updates:item-ready (a "the thing you bought is now available to collect/access — here's how" event; parallels order-confirmed but delivers an access artifact rather than a shipping ETA)
- **Proposed universal name:** Item ready / access delivered
- **Why:** mobile-ticket/QR delivery is the defining ticketing message and has no corpus analog — order-confirmed promises arrival and order-shipped tracks a physical parcel, but neither hands over a scannable access credential (also covers digital pickup codes, locker codes, e-vouchers)
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your ticket for {{event_name}} is ready. Show this at entry: {{ticket_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} ticket for {{event_name}} is here — scan it at the door: {{ticket_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{event_name}} ticket ready: {{ticket_link}} STOP to opt out.`
- **New variables:** `{{event_name}}` — the event title, budget ~24 chars, source: event record, example: "Summer Fest"; `{{ticket_link}}` — link to the mobile ticket / QR, budget ~24 chars, source: ticketing URL, example: "tix.co/t/4821"

**GAP:doors-open**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (a ticketing-specific day-of "doors/gates open, here's your entrance, parking, and QR" event — not a confirmation, reminder, or order-status state; it bundles entry logistics that only exist for in-person ticketed admission)
- **Proposed universal name:** Doors open / entry instructions (display alias here; registry-layer, ticketing-scoped)
- **Why:** the highest-value day-of ticketing message — when and where to enter, plus the re-surfaced QR — has no general corpus home; appointments:reminder-proximate nudges timing but carries no gate/parking/entry payload
- *(Vertical-specific: draft variants skipped per format. Registry would carry `{{gate}}`, `{{parking_info}}`, `{{doors_time}}`, and the `{{ticket_link}}`.)*

**GAP:ticket-transferred**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (a ticketing-specific "ownership of this access credential moved to/from another person" event with a recipient claim link — no corpus message models reassigning a paid item to a third party)
- **Proposed universal name:** Ticket transferred (display alias here; registry-layer, ticketing-scoped)
- **Why:** peer ticket transfer (gift, group buy, plus-one) is core to primary ticketing and has no analog — order-updates assumes the buyer is the holder, with no transfer/reassignment state
- *(Vertical-specific: draft variants skipped per format. Registry would carry `{{recipient_name}}`, `{{event_name}}`, and a recipient `{{claim_link}}`.)*

**STRETCH:appointments:reminder-distant** (and the appointments reminder / post-appointment family)
- **Classification:** Stretch
- **Proposed corpus home:** appointments:reminder-distant — the fit gap is `{{provider_name}}`, which assumes a named practitioner; an event is attended at a venue, not with a person
- **Proposed universal name:** Appointment reminder (used as "Event tomorrow" / "How was it?" aliases here)
- **Why:** appointments bodies that interpolate `{{provider_name}}` read awkwardly for an event ("your appointment with [name] is tomorrow"); the variable should be droppable or aliased to the event/venue
- **Draft variants:**
  - Standard: `{{workspace_name}}: Reminder — {{event_name}} is tomorrow, {{appointment_time}}. Your ticket: {{cancel_link}} Reply STOP to opt out.`
  - Friendly: `See you tomorrow at {{event_name}}! Doors {{appointment_time}}. Ticket here: {{cancel_link}} Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: {{event_name}} tomorrow, {{appointment_time}}. STOP to opt out.`
- **New variables:** `{{event_name}}` — reused from GAP:ticket-issued (event title, ~24 chars, source: event record, example: "Summer Fest")

### Content constraints
- Standard carrier rules apply to all transactional categories (purchase confirmation, ticket delivery, transfers, reminders, doors/entry, event changes, cancellations/refunds, payment-failed, buyer support) — these ride implied/transactional consent captured at checkout.
- Ticket confirmation, delivery, and event-update SMS are order/account-notification class: permitted with clear disclosure at the point of purchase (checkbox at checkout acceptable). The buyer's phone number collected for ticket delivery may be used for that delivery and tied event logistics, not for promotion.
- Promotional "tickets on sale," "last chance," "early-bird," and general "event invitation" blasts are MARKETING: separate explicit opt-in, EIN-gated, second campaign registration, SHAFT-C applies — never folded into a transactional ticket or doors-open thread.
- SHAFT-C: a venue/festival with bars cannot promote alcohol via SMS marketing; a transactional doors-open message that mentions a bar location ("bar is on the east concourse") is fine, but happy-hour/drink promos are not. The same applies to cannabis-event or 18+/21+ content.
- Same-day event changes (time, gate, weather hold, cancellation) ride the transactional thread under implied consent and should be surfaced as a safety/logistics feature, not a separate opt-in.
- Honor STOP/opt-out immediately and across the organizer's account — but note opt-out applies to messaging consent, not the ticket itself; a buyer who texts STOP still holds a valid ticket and must be able to retrieve their QR by another channel (do not gate entry behind SMS).

### Disambiguation
The sibling entry is ticket RESALE / secondary marketplace (one fan listing a ticket for another to buy), and the distinction is load-bearing for the bucket. This entry is PRIMARY sales: the organizer or venue selling its own event's tickets to the buyer who attends — a clean transactional relationship (paid order → issued ticket → admission) that mirrors e-commerce and sits Clear. Resale tips toward Conditional because secondary-market traffic draws scalping-pattern and BOTS-Act/FTC scrutiny, involves high-volume listing/relisting notifications to strangers rather than a buyer's own confirmed order, and blurs the consent basis (the recipient of a "your listing sold" or "price-drop" text didn't transact with the platform the way a primary buyer did). What looks allowed but isn't: treating a "tickets just released / last chance to buy" or a "you went last year, come back" blast as part of the ticketing flow — that is marketing (separate consent, EIN-gated, SHAFT-C), and bundling it into a confirmation, reminder, or doors-open message converts a transactional message into promotional and breaks the order/account-notification consent basis. Door/box-office staff scheduling is the venue's own ops tooling (team-alerts), not the attendee-facing surface this entry describes.

### Sources
https://www.ticketspice.com/features/electronic-and-sms-text-message-ticket-delivery
https://www.ticketspice.com/blog/the-rise-of-sms-ticketing
https://help.ticketspice.com/en/articles/8689069-send-an-sms-text-message-blast-to-your-attendees
https://www.textrequest.com/templates/events-and-ticketing
https://textus.com/texting-guides/sms-templates-for-event-ticketing-companies
https://business.ticketmaster.com/solutions/event-day/
https://www.text-em-all.com/use-cases/event-text-messaging
https://www.crowdpass.co/sms-events
https://help.purplepass.com/hc/en-us/articles/22027699323287-What-does-the-ticketing-term-doors-open-mean
https://mailchimp.com/resources/text-messaging-events/
https://www.fielddrive.com/blog/qr-code-tickets
https://help.ticketmaster.com/hc/en-us/articles/9715656118161-I-transferred-a-ticket-to-someone-Can-I-get-a-refund
https://www.bigtickets.com/event-ticketing-platform/blog/event-cancellation-and-refund-guide/
https://www.ticketbud.com/blog/event-ticket-refunds-a-guide-for-event-organizers-and-attendees/
https://mytcrplus.com/10dlc-for-tour-operators-sms-registration-use-cases-and-guest-consent-rules/
https://www.infobip.com/blog/tcpa-compliance-sms
https://www.humansecurity.com/learn/blog/u-s-government-cracks-down-on-ticket-scalping/
https://www.simpletix.com/best-eventbrite-alternatives-2026/
https://www.ticketspice.com/blog/5-alternatives-to-eventbrite
