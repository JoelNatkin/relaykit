## Banking & budgeting apps (consumer)
**Vertical:** Financial services
**Bucket:** Conditional
**URL slug:** /for/banking-apps

### What this builder is making
Mint-style personal-finance apps that aggregate a user's bank, card, and loan accounts via an aggregator (Plaid/MX), auto-categorize spend, set per-category budgets, and track savings goals — with a notification layer that fires on balance, transaction, bill, and budget events. A subset are neobank wrappers: they sit on a BaaS bank (checking, debit card) and add the same budgeting overlay on top of money they actually hold. The builder is indie-scale (PocketGuard, Toshl, Kudzu, Beyond Budget, TimelyBills, MoneyPatrol class), shipping mostly push/email today and reaching for SMS as the channel users actually see.

### Why they need SMS
The moments that matter are time-sensitive and money-losing: balance about to go negative, a budget category just blown, a bill due tomorrow, a charge that looks wrong — and a buried push notification means an overdraft fee, a late fee, or a fraudulent charge that clears. SMS is the one channel a user reliably reads in the minutes that decide whether they move money or eat the fee. For the neobank-wrapper subset it also carries step-up confirmation on the user's own withdrawals and transfers.

### Message categories
1. account-events — primary; balance, bill, fee, and security-on-the-account alerts are the operational core, and several map closely to existing bodies.
2. verification — neobank-wrapper subset: 2FA at signup plus confirmation codes before withdrawals/transfers/payment-method changes.
3. waitlist — early-access launch ramp before public availability (very common for neobanks).
4. customer-support — ticket lifecycle once users have money problems to resolve.
Excluded: marketing (promotional, EIN-gated, separate consent — out of scope for the transactional alerting that defines this vertical), order-updates (no physical fulfillment), appointments (no booking model), team-alerts (consumer app, not ops/on-call), community (no member-community surface).

### Workflows

**Low-balance & overdraft watch**
Warn the user before the balance crosses a threshold they'll pay for.
Sequence:
1. GAP:low-balance-alert — "Low balance" — fires when an aggregated/held account drops below the user's set threshold (e.g. $100, $20).
2. GAP:overdraft-risk — "Overdraft risk" — fires when a pending charge would push the balance negative; the highest-urgency, fee-avoiding moment.

**Budget overage watch**
Tell the user the moment a spending category exceeds its cap.
Sequence:
1. GAP:budget-overage — "Budget alert" — fires when category spend hits or passes its budgeted limit (approaching-limit and over-limit are the same template, threshold varies).

**Bill & subscription reminders**
Get the user to pay before a due date costs them a late fee.
Sequence:
1. GAP:bill-due-reminder — "Bill due" — fires a few days before, and again on the day of, a tracked bill or recurring subscription charge.

**Transaction & fee alerts**
Surface money movement and bank fees as they happen.
Sequence:
1. GAP:large-transaction-alert — "Large transaction" — fires on a debit/charge above the user's set amount.
2. account-events:payment-failed — "Payment declined" — a card-on-file or scheduled payment is declined.
3. GAP:fee-charged — "Fee charged" — fires when an overdraft/maintenance/ATM fee posts.

**Suspicious-activity & security**
Flag account-security events fast enough for the user to act.
Sequence:
1. account-events:new-device-sign-in — "New sign-in" — app accessed from a new device.
2. GAP:suspicious-transaction — "Suspicious activity" — fires when a charge is flagged as possible fraud; user confirms or disputes.
3. account-events:account-suspended — "Account on hold" — account/card frozen pending review.
Variable aliases (only where default feels wrong):
- device_context: "a new device in Austin, TX"

**Account & subscription lifecycle (the app's own billing)**
Keep the user's RelayKit-app subscription healthy (the SaaS layer, not their bank).
Sequence:
1. account-events:trial-ending — "Trial ending" — premium-tier trial about to end.
2. account-events:subscription-confirmed — "Plan updated" — renewal, plan change, or cancellation processed.
3. account-events:payment-failed — "Card declined" — the app's own subscription card failed.

**Money-movement confirmation (neobank-wrapper subset)**
Confirm the user's own sensitive money actions with a code — no balances in body.
Sequence:
1. verification:confirmation-code — "Confirmation code" — before a withdrawal, transfer, or payment-method change.
2. verification:verification-code — "Verification code" — phone-ownership proof at signup.
(No STOP/HELP in these bodies — 2FA carve-out.)

**Early-access launch ramp**
Move users off a pre-launch waitlist into a funded account.
Sequence:
1. waitlist:joined — "You're on the list" — user joins the early-access list.
2. waitlist:almost-up — "Almost your turn" — spot approaching.
3. waitlist:your-turn — "You're in" — claim/onboard the account.

**Support lifecycle**
Resolve a money problem the user has flagged.
Sequence:
1. customer-support:ticket-received — "We got it" — support request logged.
2. customer-support:agent-response — "Reply on your ticket" — agent replied.
3. customer-support:resolution-notification — "Resolved" — ticket closed.

### Message gaps

**GAP:low-balance-alert**
- **Classification:** Vertical-specific
- **Proposed corpus home:** account-events:low-balance-alert
- **Proposed universal name:** Low balance alert
- **Why:** balance-threshold alerting is the defining budgeting/banking notification and has no corpus equivalent.

**GAP:overdraft-risk**
- **Classification:** Vertical-specific
- **Proposed corpus home:** account-events:overdraft-risk
- **Proposed universal name:** Overdraft risk alert
- **Why:** "this charge will overdraw you" is a distinct, higher-urgency moment than a static low-balance threshold.

**GAP:budget-overage**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (budgeting-specific)
- **Proposed universal name:** Budget alert (display alias)
- **Why:** category-cap breach is specific to budgeting apps and unlikely to generalize across the corpus.

**GAP:bill-due-reminder**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:bill-due-reminder
- **Proposed universal name:** Bill due reminder
- **Why:** "a bill/subscription is due in N days" recurs across fintech, utilities, insurance, and SaaS, yet the corpus has no due-date reminder.
- **Draft variants:**
  - Standard: `{{workspace_name}}: {{bill_name}} ({{bill_amount}}) is due {{due_date}}. Pay or review: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Heads up from {{workspace_name}}: your {{bill_name}} bill of {{bill_amount}} is due {{due_date}}. Details: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{bill_name}} {{bill_amount}} due {{due_date}}. {{account_link}} STOP to opt out.`
- **New variables:** `{{bill_name}}` — short label of the bill/subscription, ~24 chars, user's bill list, "Electric"; `{{bill_amount}}` — formatted amount, ~8 chars, billing record, "$84.20"; `{{due_date}}` — short date, ~12 chars, billing record, "Fri Jun 26".

**GAP:large-transaction-alert**
- **Classification:** Vertical-specific
- **Proposed corpus home:** account-events:large-transaction-alert
- **Proposed universal name:** Large transaction alert (display alias)
- **Why:** amount-threshold transaction alerting is core to banking/budgeting and absent from the corpus.

**GAP:fee-charged**
- **Classification:** Vertical-specific
- **Proposed corpus home:** account-events:fee-charged
- **Proposed universal name:** Fee charged alert
- **Why:** "a bank fee just posted" is a distinct, financial-services-specific account event.

**GAP:suspicious-transaction**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:suspicious-transaction
- **Proposed universal name:** Suspicious activity alert
- **Why:** fraud-flag-and-confirm is a near-universal account-security pattern (fintech, e-commerce, marketplaces) with no corpus message; `new-device-sign-in` covers logins, not transactions.
- **Draft variants:**
  - Standard: `{{workspace_name}}: We flagged a transaction on your account as unusual. Review it now: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}} here — a recent transaction looked unusual to us. Take a quick look: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Unusual transaction flagged. Review: {{account_link}} STOP to opt out.`

### Content constraints
- No guaranteed-return, "grow your money," or yield-promise language; no investment-advice framing of any kind.
- No projected savings figures or performance claims in alert bodies.
- Keep balances, full account numbers, full card numbers (use `{{card_last4}}` only), and exact transaction amounts out of the body where a link can carry them — financial PII in plaintext SMS draws carrier scrutiny and raises exposure on a shared device.
- Expect elevated carrier filtering on financial terms ("account," "verify," "urgent," "security alert," "fraud") due to smishing prevalence — frame factually, route detail to `{{account_link}}`, avoid alarm words.
- 2FA/confirmation codes (verification category) carry no STOP/HELP and no marketing; never bundle a code with any other content.
- No promotional or cross-sell content in any transactional body; promotions require the marketing category with separate consent.
- No payday-loan, credit-repair, or debt-collection framing — these draw additional carrier restriction and risk SHAFT-adjacent classification.

### Disambiguation
This stays Conditional as long as the app is descriptive: it reports on money, reminds, and confirms the user's own actions. It tips toward a stricter Special bucket the moment it adds trading or brokerage features (buy/sell securities, crypto), which makes it personal-investing and pulls in investment-advice and suitability scrutiny — the "no guaranteed returns / no advice framing" notes harden into eligibility blocks there. Distinguish from payments/P2P apps (Venmo/Cash App class): those center on moving money between people and lean on `order-updates`/receipt and `verification` patterns, whereas this vertical centers on aggregation, budgeting, and account-state alerting. A pure aggregator/budgeter that never holds funds is the cleanest Conditional case; a neobank wrapper that holds deposits adds the verification-heavy money-movement workflow but stays Conditional until it adds investing.

### Sources
https://pocketguard.com/alerts/
https://kudzumoney.com/features/spending-alerts/
https://www.beyondbudgetapp.com/accounts/alerts
https://toshl.com/blog/budget-notifications-that-help-you-stay-on-track/
https://www.bankrate.com/banking/checking/mobile-banking-account-alerts/
https://www.usnews.com/banking/articles/why-you-should-set-up-these-6-mobile-banking-alerts
https://www.sofi.com/learn/content/account-alerts-to-use/
https://stripe.com/resources/more/neobanks-101-what-they-are-how-they-work-and-whom-they-are-for
https://softjourn.com/insights/essential-features-for-neobanks
https://www.moneypatrol.com/moneytalk/budgeting/budgeting-apps-with-bill-reminders/
https://www.timelybills.app/
https://mytcrplus.com/solutions/financial-services-and-fintech/
https://www.10dlc.org/en/shaft
https://textbolt.com/blog/10dlc-compliance/
