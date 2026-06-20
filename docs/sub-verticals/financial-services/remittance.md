## Money-transfer remittance (cross-border)
**Vertical:** Financial services
**Bucket:** Not yet, maybe not ever
**URL slug:** /for/remittance
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.

### What this builder is making
A Wise/Remitly/WorldRemit-style cross-border money transfer app where a sender funds a transfer in one country and a recipient — usually in another country — collects it as a bank deposit, mobile wallet credit, or cash pickup. The transfer moves through a status lifecycle: funded → in progress → ready for collection → collected. Cash-pickup and wallet payouts hinge on a reference number or PIN that the recipient must present to claim funds.

### Why they need SMS
The single highest-stakes moment is "funds ready for collection" — the recipient cannot get their money without the reference number, and that recipient is frequently an international number with no app installed and email they don't check. A missed or delayed text means a wasted trip to a payout agent or money that sits uncollected. SMS wins because it reaches a non-app recipient instantly on the one channel they reliably read, in a context where the message body (the reference code) is the literal key to the cash.

### Message categories
1. order-updates — the transfer lifecycle (funded → in progress → ready → collected) maps almost exactly onto the order-status lifecycle; status transitions are the core job.
2. verification — confirmation codes gate sensitive sender-side actions (funding, payee changes, withdrawals); the 2FA carve-out fits.
3. account-events — sender-side billing, suspension, and security-relevant lifecycle alerts.
4. customer-support — transfers stall (compliance holds, failed payouts); ticket lifecycle and proactive outreach apply.
Excluded: marketing (promotional content collides head-on with the MSB/Special-category carrier scrutiny this vertical already attracts), appointments (no scheduling model), community, team-alerts, waitlist (no queue model).

### Workflows

**Transfer lifecycle (sender-facing)**
Keep the sender informed from funding through collection.
Sequence:
1. order-updates:order-confirmed — "Transfer received" — sent when the sender's funding is captured and the transfer is created
2. order-updates:order-processing — "Transfer in progress" — sent while the transfer is being processed toward the payout rail
3. order-updates:out-for-delivery — "Funds ready for collection" — sent when the payout is available; sender-side confirmation that the recipient can now collect
4. order-updates:order-delivered — "Funds collected" — sent when the recipient has collected/the deposit settles
Variable aliases (only where default feels wrong):
- order_number: "transfer ref TX-4821"
- estimated_delivery: "today" / "within 1 hour"
- tracking_link: "status link"

**Recipient pickup notification (recipient-facing — the critical path)**
Tell the recipient their money is ready and give them the code to claim it.
Sequence:
1. GAP:recipient-funds-ready — "Funds ready for pickup" — sent to the recipient (often an international number) the moment funds are collectable, carrying the reference/PIN they must present at the payout agent
Variable aliases (only where default feels wrong):
- workspace_name: "the sender's service name, e.g. SwiftSend"

**Stalled transfer (support)**
Handle a transfer held for compliance review or a failed payout.
Sequence:
1. customer-support:service-status-alert — "Transfer delayed" — sent when a transfer is held (e.g. compliance/AML review) with an ETA
2. customer-support:proactive-outreach — "Action needed on your transfer" — sent when the sender must supply more info to release the transfer
3. customer-support:account-issue-resolved — "Transfer released" — sent when the hold clears and the transfer resumes

**Sensitive-action confirmation (sender-facing)**
Confirm high-risk account actions before they execute.
Sequence:
1. verification:confirmation-code — "Confirm this transfer" — sent before funding a large transfer, changing a payee, or withdrawing

### Message gaps

**GAP:recipient-funds-ready**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (recipient-directed payout notification carrying a claim code; distinct from the sender-directed order-updates lifecycle)
- **Proposed universal name:** Funds ready for pickup
- **Why:** the recipient — not the account holder — is the audience, and the message body must carry a claim reference/PIN, which no existing order-updates message does
- **Draft variants:**
  - Standard: `{{workspace_name}}: Money is ready for you to collect. Reference {{pickup_ref}}. Bring photo ID to claim. Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: Your money's ready to collect. Show ref {{pickup_ref}} and a photo ID at any agent. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Money ready. Ref {{pickup_ref}}. Bring photo ID. STOP to opt out.`
- **New variables:** `{{pickup_ref}}` — the cash-pickup reference number or PIN the recipient presents to collect
- **Status:** FUTURE — do not add to corpus until bucket changes.

**STRETCH:order-updates:out-for-delivery**
- **Classification:** Stretch
- **Proposed corpus home:** stretch corpus msg `order-updates:out-for-delivery` — fits the sender-side "funds now available" beat but the metaphor (a package out for delivery) reads oddly for money the recipient must actively go collect; acceptable for the sender notification, wrong for the recipient one (which is why GAP:recipient-funds-ready exists separately)
- **Proposed universal name:** Funds available
- **Why:** "out for delivery" implies passive arrival; a cash-pickup payout requires the recipient to act, so the corpus body's framing is a reframe rather than a clean fit
- **Draft variants:**
  - Standard: `{{workspace_name}}: Transfer {{order_number}} funds are now available for your recipient to collect. Track: {{tracking_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: Good news, transfer {{order_number}} is ready for your recipient to collect. Track: {{tracking_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Transfer {{order_number}} ready to collect. {{tracking_link}} STOP to opt out.`
- **Status:** FUTURE — do not add to corpus until bucket changes.

### Content constraints
- Money transmission is FinCEN MSB territory: senders must register as an MSB and comply with BSA/AML/KYC. This is a regulated-money use case carriers treat with heightened scrutiny.
- TCR classifies money-transfer/financial traffic toward Special use cases — subject to vetting and pre/post-registration MNO approval, not the immediate path Standard use cases get.
- Country allowlist friction: recipients are international, but RelayKit's own country allow-list governs which destinations it will route to — many remittance corridors (and the highest-volume ones) may sit outside it.
- International-number deliverability is the core technical risk: foreign MNOs apply their own A2P registration, content (URL/link blocking in some jurisdictions), and filtering rules; the recipient pickup message is the highest-stakes message yet the least controllable for delivery.
- Never put credentials or a code in promotional framing; the pickup reference is operational, not marketing — keep marketing content entirely out of this vertical.
- Avoid claiming guaranteed or instant delivery of either the money or the message.

### Disambiguation
Distinct from domestic peer-to-peer payment apps (Venmo/Cash App style): the defining traits here are cross-border payout rails, an international recipient who is often not an account holder, and a claim-code-bearing pickup notification. Distinct from neobank/wallet apps where money stays inside one account ecosystem — remittance's whole job is moving value out to a third party in another country. Also distinct from B2B cross-border payouts (payroll/marketplace disbursement), which target known business payees rather than ad-hoc consumer recipients at cash agents. If the build keeps funds inside a single closed wallet with no external cash/bank payout, it is not this sub-vertical.

### Sources
https://www.remitly.com/us/en/landing/cash-pickup
https://www.remitly.com/blog/money-transfer/cash-pickup-made-easy/
https://www.worldremit.com/en-us/philippines/cash-pickup
https://www.worldremit.com/en/faq/cash-pickup
https://majority.com/en/help/article/i-sent-money-via-cash-pickup-what-do-i-do-if-the-recipient-didnt-receive-a-reference-code-by-sms
https://www.westernunion.com/us/en/what-is-mtcn.html
https://www.aspora.com/blog/how-to-track-your-money-transfer-in-real-time
https://www.fincen.gov/resources/statutes-regulations/administrative-rulings/definition-money-services-business-money
https://www.fincen.gov/fact-sheet-msb-registration-rule
https://stripe.com/resources/more/what-is-a-money-transmitter
https://support.sendhub.com/hc/en-us/articles/4409175825300-10DLC-Campaign-Use-Cases
https://help.gohighlevel.com/support/solutions/articles/48001240411-action-required-international-sms-compliance-updates-uk-turkey
https://www.quicksms.com/sms-filtering-deliverability-index
