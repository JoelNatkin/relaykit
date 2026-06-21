## Gambling / sportsbooks / casino apps
**Vertical:** Retail & hospitality
**Bucket:** Not yet maybe not ever
**URL slug:** /for/gambling
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.

### What this builder is making
A real-money gambling operator: an online sportsbook taking bets on live events, an iGaming casino app dealing slots/table games for cash, or a daily-fantasy/contest platform that settles wagers to a player wallet. The product holds a player account with a funded balance, runs deposit/withdrawal rails (cards, ACH, PayPal), and settles bets or game outcomes against that balance. Operation is licensed state-by-state and geofenced, so the same app is fully legal in one jurisdiction and a crime to operate in the next.

### Why they need SMS
The highest-stakes moment is account security and cash movement — a withdrawal request, a password reset, or a login from a new device on an account holding real money is exactly where SMS verification earns its place over email. Operators also lean on SMS for "your bet settled / you won" and "deposit cleared" balance events because players check phones, not inboxes, mid-event. The pull is strong, but the carrier channel is closed to the gambling-specific content (see Content constraints).

### Message categories
1. verification — phone-ownership, login step-up, and withdrawal confirmation codes; the 2FA carve-out is the *only* corpus content a gambling operator could plausibly run, and even it requires a licensed-operator TCR brand.
2. account-events — deposit cleared, withdrawal processed, new-device sign-in, account suspended (KYC/responsible-gaming holds); operationally real but carrier-filtered the moment bodies reference wagering.
Excluded: marketing (SHAFT-C blanket-prohibits gambling promotion — no offers, free bets, odds boosts, ever), order-updates (no physical fulfillment), appointments (no booking model), community (no real use case), customer-support (theoretically usable but inseparable from a prohibited brand), team-alerts (internal ops, not the betting use case), waitlist (no real use case).

### Workflows
**Phone verification at signup**
Proves phone ownership when a player opens a real-money account.
Sequence:
1. verification:verification-code — "Verification code" — sends the OTP at signup; expires in {{expiry_minutes}}.
Variable aliases (only where the default example would feel wrong):
- business_name: "BetForm"

**Login step-up (new device)**
Second factor when a money-holding account is accessed from an unrecognized device.
Sequence:
1. verification:login-code — "Login code" — SMS second factor at sign-in.
2. account-events:new-device-sign-in — "New device sign-in" — confirms the access and offers a secure-account link if it wasn't them.

**Withdrawal confirmation**
Step-up confirmation before cash leaves the player wallet — the single most security-sensitive action.
Sequence:
1. verification:confirmation-code — "Confirmation code" — required before a withdrawal is released.
2. STRETCH:account-events:subscription-confirmed — "Withdrawal sent" — confirms the payout is on its way. The corpus message is subscription-shaped; a withdrawal-sent confirmation is a distinct event (amount + payout method, not a plan change). See Message gaps.
Variable aliases (only where the default example would feel wrong):
- account_link: "your wallet"

**Account recovery**
Restores access to a locked-out, money-holding account.
Sequence:
1. verification:recovery-code — "Recovery code" — recovery OTP for a locked account.

**Deposit cleared**
Tells a player funds are available to bet with.
Sequence:
1. GAP:deposit-cleared — "Deposit cleared" — confirms a deposit posted to the wallet balance. No corpus message covers a funds-available balance credit. See Message gaps.

**Account hold / responsible-gaming or KYC suspension**
Notifies a player their account is restricted pending verification or a responsible-gaming limit.
Sequence:
1. account-events:account-suspended — "Account suspended" — states the hold and links to next steps (KYC docs, cool-off review).

### Message gaps
**STRETCH:account-events:subscription-confirmed**
- **Classification:** Stretch
- **Proposed corpus home:** account-events:subscription-confirmed — fit gap: it frames a subscription/plan change, but a withdrawal-sent event is a money-movement confirmation carrying an amount and a payout destination, not a plan state.
- **Proposed universal name:** Payout sent
- **Why:** withdrawals are the security-critical money-out event and deserve their own amount-bearing confirmation rather than a generic "change is confirmed."
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your withdrawal of {{payout_amount}} is on its way to your {{payout_method}}. Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} withdrawal of {{payout_amount}} is on the way to your {{payout_method}}. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{payout_amount}} sent to your {{payout_method}}. STOP to opt out.`
- **New variables:** {{payout_amount}}, {{payout_method}}
- **Status:** FUTURE

**GAP:deposit-cleared**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (deposit-to-wallet is a funded-account pattern shared by gambling/trading, not the general corpus)
- **Proposed universal name:** Deposit cleared (display alias)
- **Why:** a funds-available balance credit has no corpus equivalent; order-updates:refund-processed is the closest shape but is refund-framed, not a deposit credit.
- **Status:** FUTURE

### Content constraints
- SHAFT-C: the "C" in RelayKit's SHAFT-C shorthand is gambling/casino. Under CTIA messaging principles and TCR/MNO policy, gambling content is prohibited on all number types — long code (10DLC), toll-free, and short code alike. This is a carrier-channel prohibition, not just a TCPA-consent issue: there is no consent that makes prohibited content deliverable.
- Prohibited content includes odds, lines, bet slips, free bets, deposit-match offers, "you won," promotional re-engagement, and any wager-settlement detail in the body. Marketing-category gambling messaging is blanket-forbidden with no exception.
- TCR Special category: gambling is a "special use case," not a standard one. A licensed operator may attempt a special-category campaign, but it requires elevated MNO vetting, proof of licensure, and is restricted to jurisdictions where the operator is legal — and even approved campaigns are heavily filtered/blocked in practice. RelayKit is a shared-infrastructure proxy for indie developers; it cannot carry the per-operator licensing attestation each MNO demands.
- State-by-state legality variance: real-money gambling is legal in some states, illegal in others, and tribal/operator-licensed in still others. A single shared sending number cannot honor geofenced legality, so any wager content risks routing into a state where it is unlawful.
- Net effect: even the verification 2FA carve-out (allowed content) is unusable here because it must sit under a gambling-brand TCR registration that RelayKit's single-project, shared-infrastructure model cannot legitimately vet or isolate.

### Disambiguation
Even a fully licensed, legal-state regulated sportsbook hits the same wall: SHAFT-C is a carrier *content* prohibition layered on top of TCPA consent, so being legal in your state and having player opt-in does not make gambling traffic deliverable on the shared channel — it only opens the door to a heavily-vetted, heavily-filtered TCR Special campaign that a per-operator licensed brand must own. Distinguish this from fantasy-sports/contest-adjacent or sweepstakes products that avoid real-money wagering: those can sometimes register as standard or special use cases and are not categorically blocked, so a no-cash skill-contest builder is a different (potentially servable) animal. Distinguish too from age-gated **alcohol**, a Conditional sibling — alcohol is age-restricted and special-handled but not channel-prohibited, so it can be served with guardrails; gambling cannot. To move off Not-yet-maybe-not-ever, the gating change would be structural: RelayKit would need a per-operator licensed-brand TCR registration model with jurisdiction geofencing and MNO Special-category vetting it does not have today — i.e., a dedicated regulated-operator product line, not a corpus tweak. Until then, decline at intake.

### Sources
https://www.10dlc.org/en/shaft
https://help.twilio.com/articles/360045004974-Forbidden-Message-Categories-in-the-US-and-Canada-Short-Code-Toll-Free-and-Long-Code
https://www.numberverifier.com/post/the-harsh-reality-of-10dlc-forbidden-message-categories
https://textbolt.com/blog/10dlc-compliance/
https://justcall.io/blog/10dlc-compliance-guide.html
https://help.salesmessage.com/en/articles/6811688-prohibited-sms-use-cases
https://www.opensend.com/post/how-to-market-online-casino-and-sports-betting-gambling-brands
