## Crypto / Web3 wallets, exchanges, DeFi
**Vertical:** Financial services
**Bucket:** Not yet, maybe not ever
**URL slug:** /for/crypto-web3
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.

### What this builder is making
A custodial exchange (Coinbase/Kraken-style) holding user funds and processing fiat-to-crypto trades, a non-custodial wallet or wallet-tracker app monitoring on-chain addresses the user controls, or a DeFi/yield interface (lending, staking, LP positions) where users borrow against collateral and face liquidation. These are three distinct risk profiles: an exchange touches money transmission and KYC, a wallet is read-only address monitoring, and a DeFi product surfaces position-health and liquidation events with no custody at all. All of them sit under one builder mental model — "I move or watch user crypto and need to tell people when something time-critical happens."

### Why they need SMS
The defining moment is a withdrawal request or a liquidation threshold crossing: minutes decide whether funds leave the account or a collateralized position gets force-closed at a loss. Push and email are routinely missed or delayed, and an unconfirmed withdrawal or an unseen health-factor warning is irreversible money lost. SMS is the one channel that reliably interrupts in time — which is also why SIM-swap risk makes it a fraught choice carriers scrutinize heavily.

### Message categories
1. verification — 2FA at signup, login second factor, and step-up confirmation before withdrawals/transfers are the core compliant crypto use (TCR 2FA carve-out is the one lane carriers reliably allow).
2. account-events — security-critical lifecycle: new-device sign-in, account suspension, KYC/funding state changes that gate access to funds.
3. team-alerts — repurposed for on-chain threshold/anomaly alerts (liquidation-approaching, large outbound transfer, position health) where severity-cued one-liners fit the job.
Excluded: marketing (promotional crypto content is blanket-prohibited under TCR Special; never registrable), order-updates (no physical fulfillment), appointments / waitlist / community / customer-support (not the core money-movement workflow; customer-support could appear but is incidental, not vertical-defining).

### Workflows

**Withdrawal / transfer step-up confirmation**
Confirm the user authorized an outbound movement of funds before it executes.
Sequence:
1. verification:confirmation-code — "Withdrawal confirmation code" — sent when a withdrawal, transfer, or external-address whitelist change is requested; no STOP/HELP (2FA carve-out).
Variable aliases (only where default would feel wrong):
- code: "418293"
- expiry_minutes: "10"

**Account access verification**
Prove phone ownership at signup and gate logins with a second factor.
Sequence:
1. verification:verification-code — "Signup verification code" — sent when a new user verifies their phone at registration.
2. verification:login-code — "Login code" — sent when SMS is used as the second factor on sign-in.
Variable aliases:
- code: "552014"

**Account recovery**
Get a locked-out user back into an account holding funds.
Sequence:
1. verification:recovery-code — "Account recovery code" — sent during the locked-out recovery flow.

**Security-event alerting**
Tell the account holder the moment something happens that could mean compromise.
Sequence:
1. account-events:new-device-sign-in — "New sign-in alert" — sent when the account is accessed from an unrecognized device/location.
2. account-events:account-suspended — "Account frozen" — sent when funding/withdrawals are frozen pending review (fraud flag, KYC hold).
Variable aliases:
- device_context: "a new device in Lisbon, PT"

**On-chain position / liquidation alerting (DeFi)**
Warn a borrower or LP that a collateralized position is approaching a forced-close threshold.
Sequence:
1. team-alerts:system-alert — "Position health alert" — sent when a monitored position's health factor crosses a warning threshold; severity-cued.
2. team-alerts:on-call-page — "Liquidation imminent" — shortest message, sent when liquidation is imminent and immediate action is needed.
Variable aliases:
- severity: "WARNING"
- alert_type: "health factor 1.08"
- system_name: "Aave position"
- action_link: "the position dashboard link"

### Message gaps

**GAP:large-transaction-alert**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** "Large transfer alert" (display alias: "Large withdrawal detected")
- **Why:** a passive "this just happened on your account" notice for an unusually large outbound transfer is distinct from a step-up code (which is pre-authorization) and from a new-device alert (which is access, not amount); no corpus message frames a completed-amount security notice.
- **Status:** FUTURE — do not add to corpus until bucket changes.

**STRETCH:team-alerts:system-alert**
- **Classification:** Stretch
- **Proposed corpus home:** team-alerts:system-alert reused as the DeFi position-health alert; fit gap is framing — system-alert is built for ops/infra incidents (`{{workspace_name}} {{severity}}: {{alert_type}} on {{system_name}}`), and bending it to a consumer's own wallet position reads as internal-tooling language, not a personal-finance warning to an end user.
- **Proposed universal name:** "Position health alert"
- **Why:** the consequence (forced liquidation) and the severity-cued one-line shape match, but the sender frame and audience (the account holder, not an on-call engineer) don't.
- **Draft variants:**
  - Standard: `{{workspace_name}}: heads up - your {{position_name}} health is {{health_factor}}, near liquidation. Act: {{action_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: your {{position_name}} is getting close to liquidation ({{health_factor}}). Take a look: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{position_name}} near liquidation, {{health_factor}}. {{action_link}} STOP to opt out.`
- **New variables:** position_name ("your Aave loan"), health_factor ("1.08")
- **Status:** FUTURE — do not add to corpus until bucket changes.

### Content constraints
- TCR Special category: crypto is flagged at brand registration; the provider must vet the brand before any campaign, and several content types are blanket-prohibited regardless of clean content or valid opt-in.
- Promotional / marketing crypto content is prohibited — no price-pump messages, no "buy now," no token offers, no airdrop promos. The entire marketing category is off-limits for this vertical.
- Transactional only: 2FA/verification codes and security-critical account notifications are the realistic lane, and even these require provider pre-approval.
- Never put a credential, seed phrase, private key, recovery phrase, or wallet address fragment in a message body.
- No dollar/token amounts framed as gains, returns, APY, or yield promises — these read as investment solicitation and trip SHAFT-adjacent and high-risk-financial filters.
- SIM-swap exposure: SMS 2FA is the most-exploited crypto attack vector; any future product copy should not present SMS as the strongest security option, and step-up codes should carry short expiries.
- Verification 2FA bodies carry no STOP/HELP (carve-out); all non-2FA bodies must carry the opt-out.

### Disambiguation
This entry covers products that move, custody, or monitor crypto assets — exchanges, wallets, DeFi/yield interfaces. It does not cover crypto-adjacent businesses that merely accept crypto as a payment method (those follow their own primary vertical, e.g. e-commerce). It also excludes NFT marketplaces where the SMS job is order/drop status rather than fund movement — closer to order-updates than to this financial-services profile. The dividing line is whether the time-critical SMS event is a fund-movement or position-health event with irreversible financial consequence.

### Sources
https://cryptocurrencyalerting.com/alerts/sms
https://cryptocurrencyalerting.com/guide/free-sms-bitcoin-alerts.html
https://cryptocurrencyalerting.com/guide/defi-token-monitoring.html
https://help.coinbase.com/en/coinbase/getting-started/verify-my-account/sms-text-2-step-verification
https://support.kraken.com/articles/360000911763-how-does-two-factor-authentication-2fa-for-funding-deposits-withdrawals-work-
https://coindailies.com/news/coinbase-withdrawal-code-sms-security-steps/
https://www.bitget.com/amp/academy/2fa-crypto-exchanges-9
https://textbolt.com/blog/10dlc-compliance/
https://legalclarity.org/10dlc-compliance-requirements-fees-and-penalties/
https://www.10dlc.org/en/shaft
https://www.twilio.com/docs/messaging/compliance/a2p-10dlc
https://www.zing.dev/news-and-views/securing-your-platform-twilio-verify-for-fintech-leaders
https://defi-monitor.com/blog/defi-liquidation-alerts-stop-losing-money-to-preventable-liquidations/
https://defi.org/notifications/
https://www.orbs.com/Introducing-Open-DeFi-Notification-Protocol/
