## Personal investing / brokerage
**Vertical:** Financial services
**Bucket:** Not yet, maybe not ever
**URL slug:** /for/personal-investing
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.

### What this builder is making
A consumer-facing brokerage or trading app — commission-free stock/ETF trading, options, or crypto — where retail users fund an account, place orders, and watch positions, often built on a broker-as-a-service API like Alpaca, Public, or Tradier rather than self-clearing. The software tracks order state (placed, filled, partially filled, cancelled), account balances and buying power, margin/maintenance levels, deposits and withdrawals, and price thresholds on watched assets. Operationally it is a real-time event machine: market moves and order executions generate time-sensitive events that the user must see immediately to act on money.

### Why they need SMS
When an order fills, a margin maintenance call triggers, or a watched asset crosses a stop threshold, the user has minutes — sometimes seconds — to react before the market moves against them, and a push notification on a silenced or offline phone is silently missed. SMS is the one channel that lands on the lock screen of a phone the user already has, with no app foregrounded and no reliance on push being enabled. The consequence of a missed margin-call notice is forced liquidation of positions; the consequence of a missed fill is acting on a stale mental model of the portfolio.

### Message categories
1. account-events — funding, security, and account-lifecycle events (deposits cleared, new-device sign-in, suspension) are the churn- and trust-critical core of a brokerage relationship.
2. verification — 2FA, login codes, and step-up confirmation before withdrawals/payment changes are baseline for any app touching money.
3. team-alerts — repurposed as the closest corpus home for real-time order-fill and margin-call event pings (severity-cued, action-linked), though the fit is imperfect (see STRETCH below).
4. customer-support — ticket lifecycle and service-status alerts during outages, which for a trading app (where downtime means users can't exit positions) are unusually high-stakes.
Excluded: appointments (no scheduled-provider bookings in self-directed investing), order-updates (physical-goods shipping lifecycle; "order" here means a securities order, not a parcel — false friend), community (no member-community product surface), marketing (promotional financial content is exactly what carriers filter for this vertical — explicitly out), waitlist (early-access waitlists exist for some launches but are not a core operational workflow; if used, the generic waitlist category covers it without vertical reframing).

### Workflows

**Phone verification at signup**
Proves phone ownership during KYC-gated account opening.
Sequence:
1. verification:verification-code — "Verification code" — one-time code at signup, no STOP/HELP per 2FA carve-out.
Variable aliases:
- (none needed)

**Step-up confirmation before a sensitive action**
Confirms identity before a withdrawal, bank-link change, or beneficiary/ownership change — the highest-fraud-risk actions in a brokerage.
Sequence:
1. verification:confirmation-code — "Confirmation code" — code required before the money-moving action commits.

**Login second factor**
SMS as the second factor on account sign-in.
Sequence:
1. verification:login-code — "Login code" — code on each flagged login.

**Account recovery**
Restores access to a locked-out account.
Sequence:
1. verification:recovery-code — "Recovery code" — code to regain access.

**New-device sign-in alert**
Warns the user when their brokerage account is accessed from an unrecognized device — a primary fraud signal for accounts holding money.
Sequence:
1. account-events:new-device-sign-in — "New sign-in alert" — flags the device, links to secure the account.

**Deposit cleared / funds available**
Tells the user their ACH deposit has settled and buying power is live — the moment they can start trading.
Sequence:
1. GAP:funds-available — "Funds available" — deposit cleared, buying power updated.
Variable aliases:
- (uses new variable {{amount}}, see gap)

**Withdrawal confirmed**
Confirms a withdrawal to the user's linked bank has been initiated/sent — a money-out event users want positive confirmation of.
Sequence:
1. account-events:subscription-confirmed — "Transaction confirmed" — STRETCH; "subscription change is confirmed" copy does not fit a cash withdrawal (see STRETCH below).

**Account suspended / restricted**
Notifies the user their account has been restricted (e.g., compliance hold, pattern-day-trader restriction, failed funding) and what to do.
Sequence:
1. account-events:account-suspended — "Account restricted" — suspension/restriction notice with next-steps link.

**Order filled / execution alert**
The defining real-time event: an order the user placed has executed, fully or partially.
Sequence:
1. GAP:order-executed — "Order filled" — buy/sell executed at a price, links to the position.
Variable aliases:
- (uses new variables {{order_action}}, {{symbol}}, see gap)

**Margin maintenance call**
Warns the user their account has fallen below maintenance margin and they must deposit or positions will be liquidated — the highest-consequence single message in the vertical.
Sequence:
1. team-alerts:escalation-ping — "Margin call" — STRETCH; ACK-or-escalate framing is wrong for a deposit-or-liquidate deadline (see STRETCH below).
Variable aliases:
- severity: "Action required"
- system_name: "your account"

**Price threshold alert**
Notifies the user a watched asset crossed a price they set — the most common opt-in alert in every trading app surveyed.
Sequence:
1. team-alerts:system-alert — "Price alert" — STRETCH; system/anomaly framing does not fit a user-configured market-price crossing (see STRETCH below).
Variable aliases:
- severity: "Alert"
- alert_type: "price crossed your target"
- system_name: "the symbol"

**Service-status alert during an outage**
Tells affected users the platform has a known issue and an ETA — acute for trading because users can't exit positions during downtime.
Sequence:
1. customer-support:service-status-alert — "Service status alert" — known issue + ETA + follow-up promise.

**Support ticket lifecycle**
Keeps a user informed on a support request (e.g., a disputed transaction or funding problem).
Sequence:
1. customer-support:ticket-received — "Ticket received" — request logged.
2. customer-support:agent-response — "Agent replied" — reply ready to view.
3. customer-support:resolution-notification — "Resolved" — ticket closed, reopen link.

### Message gaps

**GAP:funds-available**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** Funds available (display alias "Deposit cleared")
- **Why:** A settled-deposit / buying-power-now-live event has no corpus equivalent; account-events covers payment failures and lifecycle, not money-in clearing.
- **Status:** FUTURE — do not add to corpus until bucket changes.

**GAP:order-executed**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** Order filled (display alias "Trade executed")
- **Why:** Securities-order execution is the defining event of this vertical and has no corpus message; order-updates concerns physical-parcel shipping, not trade fills.
- **Status:** FUTURE — do not add to corpus until bucket changes.

**STRETCH:account-events:subscription-confirmed**
- **Classification:** Stretch
- **Proposed corpus home:** account-events:subscription-confirmed — fits a generic "transaction confirmed" need but its body ("Your subscription change is confirmed") names a subscription, which is wrong for a cash withdrawal to a bank account.
- **Proposed universal name:** Transaction confirmed
- **Why:** Reusable shell for a money-movement confirmation, but copy reframing is heavy enough to flag rather than map silently.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your withdrawal of {{amount}} is confirmed and on its way to your bank. Details: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} withdrawal of {{amount}} is on its way to your bank. See details: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Withdrawal of {{amount}} confirmed. {{account_link}} STOP to opt out.`
- **New variables:** `{{amount}}` — money amount with currency symbol, budget ~10 chars, source: the withdrawal/transaction record, example "$1,200.00".
- **Status:** FUTURE — do not add to corpus until bucket changes.

**STRETCH:team-alerts:escalation-ping**
- **Classification:** Stretch
- **Proposed corpus home:** team-alerts:escalation-ping — closest by shape (urgent, deadline-bearing, action-linked) but the ACK/auto-escalate-to-a-teammate model is for ops on-call, not a consumer who must deposit funds or be liquidated.
- **Proposed universal name:** Margin call (action-required deadline alert)
- **Why:** A deposit-or-liquidate deadline needs an urgent action-linked alert; reusing the escalation shell requires stripping the ACK/escalation semantics, which is a heavy reframe.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Margin call on your account. Deposit {{amount}} by {{deadline}} or positions may be sold: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: Your account is below margin. Add {{amount}} by {{deadline}} to avoid a sell-off: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Margin call. Deposit {{amount}} by {{deadline}}: {{account_link}} STOP to opt out.`
- **New variables:** `{{amount}}` — see above. `{{deadline}}` — date/time the deposit is due, budget ~12 chars, source: the margin-call record, example "Fri 9am ET".
- **Status:** FUTURE — do not add to corpus until bucket changes.

**STRETCH:team-alerts:system-alert**
- **Classification:** Stretch
- **Proposed corpus home:** team-alerts:system-alert — a severity-cued threshold notification is structurally close to a price-threshold crossing, but system-alert frames an infrastructure anomaly, not a user-configured market-price target.
- **Proposed universal name:** Price alert (threshold crossed)
- **Why:** Price-threshold alerts are the most common opt-in message in the vertical; the system-alert shell almost fits but its "anomaly on a system" framing reads wrong to a retail investor.
- **Draft variants:**
  - Standard: `{{workspace_name}}: {{symbol}} crossed {{price_target}}, now {{current_price}}. View: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: heads up, {{symbol}} just hit {{price_target}} (now {{current_price}}): {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{symbol}} crossed {{price_target}}, now {{current_price}}. STOP to opt out.`
- **New variables:** `{{symbol}}` — ticker/asset symbol, budget ~6 chars, source: the watch/alert config, example "AAPL". `{{price_target}}` — the threshold price, budget ~9 chars, source: alert config, example "$190.00". `{{current_price}}` — last price at trigger, budget ~9 chars, source: market data, example "$190.42".
- **Status:** FUTURE — do not add to corpus until bucket changes.

### Content constraints
- TCR "Special" use-case territory: stock-trading and crypto platforms are repeatedly named in carrier forbidden/high-risk financial-content lists; expect elevated scrutiny, lower trust scores, and a real chance of campaign rejection regardless of message quality. This is the core reason the sub-vertical sits in "Not yet, maybe not ever."
- No investment advice, no "buy/sell now" or "act fast" urging, no signals, no price predictions, no implied recommendations — these stray into FINRA-adjacent territory and into the speculative-investment promotional content carriers filter.
- No promotional/marketing content (deposit bonuses, referral cash, "trade free for 30 days") — promotional financial offers are exactly the category carriers block hardest for this vertical; the marketing category should be treated as off-limits here.
- Transactional only: confirmations of actions the user took (orders, deposits, withdrawals) and alerts the user explicitly configured (price thresholds) — never unsolicited market commentary.
- Verification 2FA messages carry no STOP/HELP (carve-out); all other categories carry STOP. No credentials, balances beyond what the user needs, or PII in the body — link out to the authenticated account instead.
- Crypto-specific messaging draws additional carrier suspicion (crypto named separately as high-risk); a crypto-only app is the hardest variant to get approved.

### Disambiguation
The nearest served-adjacent neighbor is **neobanking / personal finance** (budgeting, balance, and bill-pay alerts), which is far less restricted because it lacks the securities-trading and speculative-investment dimension — a dev who thinks "it's just transaction alerts" may not realize the trading layer is what flips them into the Special bucket. A second neighbor is **fintech notifications generally** (e.g., a payroll or expense app): account-events and verification messages look identical on the wire, but the moment the product places securities or crypto orders, carrier treatment changes. The decisive tipping factor is whether the app executes trades or holds investment positions; if it does, it lands in Special territory even if every message is purely transactional. Devs frequently assume that because their messages are factual confirmations (not advice), they're clearly allowed — but carrier filtering for this vertical keys on the platform category, not just message content, so clean transactional copy does not by itself unlock approval.

### Sources
https://alpaca.markets/
https://alpaca.markets/broker
https://public.com/api
https://public.com/api/docs
https://investingintheweb.com/brokers/best-api-brokers/
https://robinhood.com/us/en/support/articles/price-alerts/
https://robinhood.com/us/en/support/articles/options-alerts/
https://www.interactivebrokers.com/campus/trading-lessons/messages-sound-manager/
https://www.ibkrguides.com/traderworkstation/set-trade-alerts.htm
https://www2.advisorchannel.com/wc/channel/jsp/sp3help/content/fwchlpalertsmanagerworkflowrequiredactions.htm
https://mobile-text-alerts.com/articles/sms-crypto
https://cryptocurrencyalerting.com/
https://www.reachtheapp.com/articles/docs-reach-line-forbidden-content-for-a2p-10dlc-messaging
https://wise-agent-crm.groovehq.com/help/forbidden-text-messages
https://conduit.ai/blog/what-is-a2p-10dlc-and-why-your-business-text-messages-are-getting-blocked
https://mytcrplus.com/solutions/financial-services-and-fintech/
https://www.beconversive.com/blog/text-messaging-sms-compliance-laws
