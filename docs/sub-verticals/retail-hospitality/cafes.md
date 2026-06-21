## Cafés / coffee shops (single location)
**Vertical:** Retail & hospitality
**Bucket:** Clear
**URL slug:** /for/cafes

### What this builder is making
A mobile order-ahead and loyalty layer for one independent café — a Square-for-coffee app where regulars pre-order a latte to skip the line, earn stamps or points toward a free drink, and pick up at the counter. It sits on top of a Square (or similar) POS and kitchen display, tracking each mobile/counter order from placed → in-prep → ready, and running a points/punch-card loyalty program with milestones and rewards. It is the order-and-rewards operating layer for a single coffee bar, not a multi-location chain's centralized app or a generic restaurant reservation book.

### Why they need SMS
The workhorse moment is "your order is ready at the counter": a customer who ordered ahead is on the sidewalk or in line elsewhere, and a drink going cold under the pickup shelf is wasted product and a slow line. SMS wins because a coffee customer is not staring at the app after they tap "order" — the ready-ping has to land on the lock screen in the 90 seconds it takes to pull a shot, where a push notification on a rarely-opened branded app will not. Loyalty milestone texts ("you're one stamp from a free coffee") pull the daily-habit customer back through the door, and at coffee frequency they only work if they land instantly, not in an ignored email.

### Message categories
1. order-updates — the order-ready pickup loop is the highest-volume, highest-value use: every mobile/counter order ends in a "ready" ping
2. community — loyalty milestone and rewards-earned notifications map to the member-milestone / welcome family (the loyalty program is the "community" of regulars)
3. marketing — daily-special, seasonal-drink, and "free coffee waiting" promotional blasts; real but EIN-gated and consent-separated from transactional pickup messages
Excluded: appointments (a café is walk-up/order-ahead, not booked time slots), waitlist (no reservation queue — order-ahead is order-updates, not a position-in-line page), account-events (no consumer subscription/billing relationship — the café isn't billing the customer monthly), customer-support (no ticketing model — questions ride two-way reply on the order thread), team-alerts (real for barista scheduling but secondary — see Disambiguation), verification (no high-assurance login/2FA need for a coffee order)

### Workflows

**Mobile / counter order pickup loop**
The core job: tells a customer who ordered ahead that their drink is being made and, critically, that it's ready on the pickup shelf so it doesn't go cold.
Sequence:
1. order-updates:order-confirmed — "Order" — sent when the mobile/counter order is placed and paid; "order #312 received, ready in ~8 min"
2. order-updates:order-processing — "Order" — optional; "your order is being made now"
3. GAP:order-ready-for-pickup — "Order ready" — the workhorse: sent when the drink hits the pickup shelf; "your order is ready at the counter" (see Message gaps)
Variable aliases:
- order_number: "#312"
- estimated_delivery: "ready in ~8 min"

**Loyalty milestone / reward earned**
Pulls the daily-habit regular back in by telling them a free drink is near or unlocked — the retention engine of the café app.
Sequence:
1. community:member-milestone — "Rewards" — sent when the customer reaches a stamp/point milestone; "you're 1 stamp from a free coffee" or "you've earned a free drink" (STRETCH — see Message gaps)
Variable aliases:
- community_name: the café's own name (e.g. "Ember Coffee Rewards")
- milestone: "9 of 10 stamps" / "a free 12oz drink"

**Loyalty enrollment welcome**
Confirms a new member is enrolled in the rewards program and sets expectations for what they'll get texted about.
Sequence:
1. community:welcome — "Rewards" — sent when a customer joins the loyalty program; "you're in — we'll text you when a reward is ready"
Variable aliases:
- community_name: "Ember Coffee Rewards"

**Reward expiring reminder**
Nudges a member whose earned reward or points are about to lapse, recovering a redemption (and a visit) before it's lost.
Sequence:
1. GAP:reward-expiring — "Rewards" — sent before a free-drink credit or points balance expires; "your free coffee expires Sunday — come grab it" (see Message gaps)
Variable aliases:
- community_name: "Ember Coffee Rewards"

**Daily special / seasonal drink promotion**
Drives traffic on a slow morning by texting an opted-in audience about today's special or a new seasonal drink. Promotional — separate consent, separate registration.
Sequence:
1. marketing:promotional-offer — "Offer" — sent when a special opens; "today only: $1 off any cold brew"
2. marketing:product-launch — "New" — sent when a seasonal drink launches; "the pumpkin oat latte is back"
Variable aliases:
- business_name: "Ember Coffee"
- offer: "$1 off any cold brew today"
- launch_name: "the pumpkin oat latte"

**Lapsed-regular win-back**
Re-engages a regular who hasn't been in for a while — a promotional message, EIN-gated.
Sequence:
1. marketing:re-engagement — "Offer" — sent to a lapsed customer; "we miss you — here's a free drip coffee on your next visit"
Variable aliases:
- business_name: "Ember Coffee"

**Barista shift scheduling**
Keeps a small barista crew aligned on who opens, who closes, and fills a gap fast when someone calls out. Secondary but real for a single café.
Sequence:
1. team-alerts:shift-scheduled — "Schedule" — sent when a shift is posted; "you open Sat 6 AM–2 PM"
2. team-alerts:shift-reminder — "Schedule" — sent the night before or morning of
3. team-alerts:shift-change — "Schedule" — sent when a shift is swapped or a call-out frees a slot
Variable aliases:
- location: "the bar" / "register"
- role: "barista" / "opener"
- shift_time: "6:00 AM–2:00 PM"

### Message gaps

**GAP:order-ready-for-pickup**
- **Classification:** Universal miss
- **Proposed corpus home:** order-updates:order-ready-for-pickup
- **Proposed universal name:** Order ready for pickup
- **Why:** the order-updates lifecycle covers shipping/delivery but has no in-store/counter "your order is ready to collect now" state, which is the central event for café order-ahead, takeout, BOPIS retail, and pharmacy pickup
- **Draft variants:**
  - Standard: `{{workspace_name}}: Order {{order_number}} is ready for pickup at the counter. Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} order {{order_number}} is ready — come grab it while it's hot. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Order {{order_number}} ready for pickup. STOP to opt out.`

**STRETCH:community:member-milestone**
- **Classification:** Stretch
- **Proposed corpus home:** community:member-milestone — the fit gap is framing: the corpus body is "you've reached {{milestone}} in the community," which reads as tenure/engagement, whereas a café loyalty milestone is a reward-progress count ("1 stamp from a free coffee") that should sit cleanly transactional, not community-flavored
- **Proposed universal name:** Member milestone (used as "Rewards" / loyalty-progress alias here)
- **Why:** loyalty progress and reward-earned is the retention workhorse for cafés but the corpus milestone body assumes a social/community milestone, not a points-toward-reward count
- **Draft variants:**
  - Standard: `{{community_name}}: you've reached {{milestone}} toward your next reward. Reply STOP to opt out.`
  - Friendly: `Nice — you're at {{milestone}} toward a free drink at {{community_name}}. Reply STOP to opt out.`
  - Brief: `{{community_name}}: {{milestone}} toward your reward. STOP to opt out.`

**GAP:reward-expiring**
- **Classification:** Universal miss
- **Proposed corpus home:** community:reward-expiring (or a loyalty sub-family)
- **Proposed universal name:** Reward expiring
- **Why:** earned rewards and points balances commonly expire, and a "use it before it lapses" nudge is a distinct transactional event with no corpus home — the community category covers milestones and announcements but not a time-boxed reward that's about to disappear
- **Draft variants:**
  - Standard: `{{community_name}}: your reward expires {{expiry_date}}. Redeem it on your next visit. Reply STOP to opt out.`
  - Friendly: `Heads up — your free drink at {{community_name}} expires {{expiry_date}}. Come grab it! Reply STOP to opt out.`
  - Brief: `{{community_name}}: reward expires {{expiry_date}}. STOP to opt out.`
- **New variables:** `{{expiry_date}}` — date or day the reward lapses, budget ~10 chars, source loyalty program record, example "Sunday" or "Jun 30".

### Content constraints
- Standard carrier rules apply. The order-ready pickup loop rides implied/transactional consent from the order placement; transactional loyalty notifications (milestone reached, reward earned, reward expiring) ride the loyalty-program enrollment consent.
- Promotional content — daily specials, seasonal-drink launches, "$1 off," win-back offers — is a separate marketing category requiring explicit written opt-in and a second EIN-gated campaign registration. Never fold a special into an order-ready or milestone thread.
- Tie the marketing opt-in to the loyalty program itself ("get a text when you're close to a free coffee"), not generic marketing — but keep that promotional stream consent-separated from the transactional order/loyalty pings.
- Keep promotional frequency low: coffee is a daily-habit purchase, so 2–3 marketing texts per month is the practical ceiling before opt-outs spike. (Frequency is a deliverability/retention concern, not a hard carrier rule — surface as guidance.)
- SHAFT-C applies to the marketing category: a café that also sells beer/wine cannot promote alcohol offers via SMS marketing (the "A" in SHAFT). Transactional order/loyalty messages are unaffected.
- Two-way reply (customer texts "make it oat milk," staff confirms) is permitted on the transactional order thread under implied consent — surface as a feature, not a separate opt-in.
- Honor STOP immediately on every category; a barista opting out of shift pings must not be silently dropped from scheduling without a fallback channel.

### Disambiguation
A single-location café differs from a multi-location coffee chain: a chain runs a centralized branded app across stores, needs per-location sender identity and store routing in every order-ready ping, and registers SMS under a larger parent EIN with higher throughput — a heavier registration story. This entry is for the one coffee bar whose POS, kitchen display, and rewards program all live in a single workspace. The café also looks like generic Restaurants software, but tips clearly toward this sub-vertical the moment the waitlist/reservation book disappears (cafés are order-ahead, not table-booked) and the order-ready pickup loop plus a stamp/points loyalty program become the whole job. The trap that looks allowed but isn't: bundling "and here's 20% off a pastry" onto the order-ready text — that converts a transactional pickup message into marketing and breaks both the transactional/promotional consent separation and the EIN-gated marketing registration requirement. Same trap on the loyalty-milestone text: "1 stamp away — buy 2 today and double up" is promotional and must move to the marketing stream.

### Sources
https://www.tryperdiem.com/
https://www.tryperdiem.com/square-mobile-app
https://www.tryperdiem.com/post/coffee-shops-using-square-pos-make-an-app-to-compete-with-starbucks
https://www.tryperdiem.com/post/a-comparison-of-the-top-7-restaurant-loyalty-apps-on-square-marketplace
https://www.espressly.co/blog-post/mobile-apps-for-coffee-shops-with-square-loyalty/
https://www.getcraver.com/blog/square-integrations-coffee-shops/
https://streetfightmag.com/2021/01/05/5-mobile-ordering-platforms-for-independent-coffee-shops/
https://www.stampme.com/cafes-and-restaurants
https://www.loyaltylive.io/blog/coffee-shop-loyalty-app/
https://www.incentivio.com/blog-news-restaurant-industry/leveraging-text-messaging-to-boost-your-coffee-shops-efficiency-and-revenue
https://www.milagrocorp.com/news/why-trendy-coffee-shops-use-sms-retention-to-encourage-repeat-visits/
https://www.falkonsms.com/post/sms-marketing-for-coffee-shops
https://regulr.ai/for/coffee-shops/sms-marketing
https://www.preferredpatron.com/blog/2026/04/30/tcpa-sms-compliance-loyalty-programs-mistakes/
https://www.qsrmagazine.com/outside-insights/restaurant-considerations-when-texting-customer-loyalty-base
https://activeprospect.com/blog/tcpa-text-messages/
