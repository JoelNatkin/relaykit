## Payments / money movement (consumer)
**Vertical:** Financial services
**Bucket:** Conditional
**URL slug:** /for/payments

### What this builder is making
A consumer money-movement app — Venmo-for-X, P2P send/request, bill-splitting, or a payout/disbursement layer — where funds move between consumers and in/out of linked bank accounts and cards. The core objects are the transfer (sent, received, pending, completed, failed), the payment request (open, paid, declined), and the cash-out/payout to a bank or debit card. Builders here are wrapping a banking-as-a-service or processor rail (Stripe Treasury/Connect, Dwolla, Unit) rather than holding funds themselves.

### Why they need SMS
The decisive moments are money arriving, a payment request landing, and a cash-out succeeding or failing — each is time- and trust-sensitive, and a stalled or failed bank transfer leaves the user uncertain whether their money is gone. SMS wins because users check a text in seconds where a push notification is muted or an email is missed, and "you've been paid" / "your transfer failed" is exactly the kind of one-line, account-state fact that belongs on the lock screen. Sensitive actions (cash-out, changing the linked bank, large sends) also need a step-up confirmation code that the user reads off SMS in the moment.

### Message categories
1. account-events — primary; transfer-completed, transfer-failed, and payout notices are account-state/money-movement events, the churn- and trust-critical core of this vertical
2. verification — step-up confirmation codes before withdrawals, payment-method changes, and high-value sends (the Confirmation code message is purpose-built for this)
3. customer-support — frozen-account, disputed-transfer, and "we fixed an issue on your account" follow-ups, which are common in money apps
Excluded: marketing (transactional money flows must stay promo-free; any promo needs a separate EIN-gated consent), appointments (no scheduled-visit model), order-updates (no physical fulfillment), team-alerts (not internal ops), community (no membership layer), waitlist (no queue/access-grant model)

### Workflows

**Money received**
Tell the recipient money landed in their balance.
Sequence:
1. account-events:subscription-confirmed — "Money received" — sent the instant a P2P payment or request-payment clears into the user's balance, linking to the transaction
Variable aliases (only where default feels wrong):
- workspace_name: "Cashboard"
- account_link: "the transaction detail in the app"

**Payment request landed**
Tell a user someone is requesting money from them.
Sequence:
1. account-events:subscription-confirmed — "Payment request" — sent when another user opens a request against this user, linking to the pay/decline screen
Variable aliases (only where default feels wrong):
- account_link: "the open request in the app"

This is a STRETCH on subscription-confirmed — see Message gaps (GAP:payment-request and GAP:money-received).

**Cash-out / payout result**
Tell the user a bank/card transfer succeeded or failed.
Sequence:
1. account-events:subscription-confirmed — "Payout sent" — sent when a cash-out to a linked bank or debit card completes
2. account-events:payment-failed — "Transfer failed" — sent when a bank transfer or cash-out is rejected (bad routing number, daily limit, security flag), pointing the user to retry
Variable aliases (only where default feels wrong):
- card_last4: "the linked bank or card the transfer targeted"

**Sensitive-action step-up**
Confirm the person moving money or changing the bank link is the account holder.
Sequence:
1. verification:confirmation-code — "Confirm this action" — sent before a withdrawal, a linked-bank change, or a large send; user reads the code back to authorize (no STOP/HELP, 2FA carve-out)

**Account-state / risk hold**
Tell the user their account or a transfer is frozen and what to do.
Sequence:
1. account-events:account-suspended — "Account on hold" — sent when fraud/risk review freezes the account or a transfer
2. customer-support:account-issue-resolved — "Hold cleared" — sent when review clears and funds/access are restored
Variable aliases (only where default feels wrong):
- workspace_name: "Cashboard"

**New-device security**
Flag access from an unrecognized device on a money account.
Sequence:
1. account-events:new-device-sign-in — "New sign-in" — sent on access from a new device; "Not you?" path to secure the account

### Message gaps

**GAP:money-received**
- **Classification:** Vertical-specific
- **Proposed corpus home:** account-events:money-received
- **Proposed universal name:** Money received (display alias "You've been paid")
- **Why:** "money landed in your balance" is the single most-sent message in a P2P app and has no clean corpus home — subscription-confirmed is a billing-state event, not an incoming-funds event, so it's a forced reframe

**GAP:payment-request**
- **Classification:** Vertical-specific
- **Proposed corpus home:** account-events:payment-request
- **Proposed universal name:** Payment request received (display alias "Someone requested money")
- **Why:** an inbound request-for-money is a distinct P2P trigger with an accept/decline action that no transactional corpus message models

**STRETCH:account-events:payment-failed**
- **Classification:** Stretch
- **Proposed corpus home:** payment-failed reused for an outbound bank/cash-out transfer failure; fit gap is that the corpus body is framed around a declined card on a subscription ("Update payment to keep your account active"), not a failed withdrawal of the user's own funds to their bank
- **Proposed universal name:** Transfer failed (display alias "Cash-out failed")
- **Why:** the consequence and required action differ — the user needs to fix bank details or retry the transfer, not update a card to stay subscribed
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your transfer to {{card_last4}} failed. Check your details and retry: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} transfer to {{card_last4}} didn't go through. Check and retry here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Transfer to {{card_last4}} failed. Retry: {{account_link}} STOP to opt out.`

### Content constraints
- Money-transmitter/MSB-adjacent: financial-services A2P campaigns draw closer carrier scrutiny; register the brand's actual money-movement use case honestly and expect tighter review.
- Keep transactional money flows strictly promo-free — no "invite a friend, earn $10" riders in a transfer or payout text; promotional content needs a separate EIN-gated marketing campaign with its own consent.
- Carriers prohibit certain financial-product content outright (payday/short-term lending, debt relief, credit repair) — a consumer P2P app should steer clear of any wording that reads as those.
- Handle amounts carefully: show currency-formatted values, never expose full account/routing/card numbers (last-4 only), and never put a confirmation code or credential in a non-2FA body.
- Confirmation/step-up codes ride the Verification (2FA) lane — no STOP/HELP in those bodies — and must never double as a marketing or balance-update channel.
- Avoid implying a guaranteed transfer time; "most transfers are instant" plus a retry path is safer than a hard ETA.

### Disambiguation
This is consumer-to-consumer and consumer-to-own-bank movement on a domestic rail — distinct from cross-border remittance (a Special/Not-yet bucket, where FX, sanctions/OFAC screening, and per-corridor rules raise the bar). It is also not a full neobank/banking app (card issuing, interest-bearing balances, lending), which carries broader regulatory surface, nor earned-wage-access (employer-mediated advances against unearned pay, which attracts lending-style scrutiny). What tips a payments build stricter and out of Conditional: holding balances as a licensed money transmitter rather than passing funds through a BaaS partner, adding lending/credit features, or moving money across borders.

### Sources
https://www.consumerreports.org/money/digital-payments/peer-to-peer-payment-apps-comparison-a5999129619/
https://newsroom.paypal-corp.com/2024-10-09-Venmo-Introduces-the-Ability-to-Schedule-Payments-and-Requests
https://help.venmo.com/cs/articles/instant-bank-transfer-faq-vhel302
https://help.venmo.com/cs/articles/issues-with-a-bank-transfer-vhel114
https://help.venmo.com/cs/articles/temporarily-frozen-account-from-failed-payments-vhel296
https://www.infobip.com/blog/what-is-a2p-10dlc
https://help.activecampaign.com/hc/en-us/articles/4408445022108-A2P-10DLC-Fines-and-Penalties-for-Non-Compliant-Messaging-with-U-S-Telecom-Carriers
https://www.twilio.com/docs/messaging/compliance/a2p-10dlc
https://www.textrequest.com/insights/sms-payments-text-to-pay-ultimate-guide
