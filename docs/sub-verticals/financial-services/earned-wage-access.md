## Earned wage access / on-demand pay
**Vertical:** Financial services
**Bucket:** Not yet, maybe not ever
**URL slug:** /for/earned-wage-access
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.

### What this builder is making
A DailyPay/Earnin/Branch-style earned-wage-access app that integrates with employer payroll or timekeeping to track wages an hourly worker has earned but not yet been paid. The worker watches an "available balance" accrue across the pay period, draws an advance (instant for a fee, or free next-day) against earned-but-unpaid wages, and the platform settles via payroll deduction or remainder pay on payday. Optional expedited-transfer fees and voluntary tips are the revenue model, with no underwriting and no recourse against the worker.

### Why they need SMS
The two decisive moments — "your transfer landed" and "your balance refreshed after last shift" — happen when a cash-strapped worker is actively deciding whether they can cover something right now, and a delayed email loses the moment. Repayment/deduction confirmations on payday close the loop on an event with real financial consequence. The audience is hourly and frequently app-light, often checking balance by text rather than opening an app — DailyPay literally runs a "text Balance to a shortcode" flow — so SMS is the native channel, not a fallback.

### Message categories
1. account-events — primary; balance refresh, transfer settled, and payday repayment are all transactional account-state changes
2. verification — withdrawal/transfer is a sensitive money-movement action; confirmation codes gate it
3. customer-support — funding delays, failed transfers, and account holds are high-anxiety support moments for this audience
Excluded: order-updates (no physical fulfillment), appointments (no scheduling), waitlist (no queue), community (no membership layer), team-alerts (worker-facing, not ops), marketing (would require separate consent and EIN gating; the whole point of this bucket is to keep promo/tip-upsell language out of transactional flows)

### Workflows

**Earnings available**
Tell the worker their drawable balance changed after a shift posted.
Sequence:
1. account-events:subscription-confirmed — "Balance updated" — STRETCH: corpus message frames a subscription change; here it frames "your available earnings refreshed, $X drawable now." Real fit is a GAP (see below).
Variable aliases (only where default feels wrong):
- workspace_name: "DailyPay"
- account_link: "your balance"

**Advance / cash-out**
Confirm a worker's withdrawal request and that money is on the way.
Sequence:
1. verification:confirmation-code — "Confirm transfer" — code gates the cash-out before funds move (no STOP/HELP)
2. account-events (GAP: transfer-initiated) — "Transfer started" — sent when the draw is accepted, ETA stated
3. account-events (GAP: transfer-settled) — "Money landed" — sent when funds hit the linked account or pay card
Variable aliases:
- workspace_name: "Branch"

**Payday settlement**
Confirm the payroll deduction / remainder pay that closes out the advances.
Sequence:
1. account-events (GAP: repayment-settled) — "Payday settled" — sent on payday when the deduction or remainder pay clears
Variable aliases:
- workspace_name: "Earnin"

**Funding trouble**
Surface a failed or delayed transfer fast, since the worker was counting on the money.
Sequence:
1. customer-support:service-status-alert — "Transfer delayed" — funding issue with an ETA
2. customer-support:account-issue-resolved — "Transfer fixed" — resolution, no action needed

### Message gaps

**GAP:earnings-available**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (EWA-specific "available balance changed" event)
- **Proposed universal name:** Balance updated (display alias: "Earnings available")
- **Why:** the core recurring EWA event — drawable balance refreshing after a shift posts — has no clean corpus home; subscription-confirmed is a stretch
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your available balance updated to {{available_amount}} after your latest shift. Transfer: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Good news from {{workspace_name}}: {{available_amount}} of your pay is ready to transfer. {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{available_amount}} available now. {{account_link}} STOP to opt out.`
- **New variables:** `available_amount` ("$84.50")
- **Status:** FUTURE — do not add to corpus until bucket changes.

**GAP:transfer-settled**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:transfer-settled
- **Proposed universal name:** Transfer complete
- **Why:** "money moved and landed" is a generic fintech account event with no current corpus entry (account-events covers billing/security/lifecycle, not money-in)
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your transfer of {{transfer_amount}} landed in your {{destination}}. View details: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: {{transfer_amount}} just arrived in your {{destination}}. All set. {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{transfer_amount}} landed in your {{destination}}. STOP to opt out.`
- **New variables:** `transfer_amount` ("$50.00"), `destination` ("bank account" / "pay card")
- **Status:** FUTURE — do not add to corpus until bucket changes.

**GAP:transfer-initiated**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:transfer-initiated
- **Proposed universal name:** Transfer started
- **Why:** the "we received your request, funds are on the way, ETA X" state precedes settlement and is distinct from it; absent from corpus
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your transfer of {{transfer_amount}} is on the way to your {{destination}}. ETA {{eta}}. Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: {{transfer_amount}} is on its way to your {{destination}}, ETA {{eta}}. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{transfer_amount}} sent to your {{destination}}. ETA {{eta}}. STOP to opt out.`
- **New variables:** `transfer_amount`, `destination`, reuses `eta`
- **Status:** FUTURE — do not add to corpus until bucket changes.

**GAP:repayment-settled**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (EWA payday settlement)
- **Proposed universal name:** Payday settled (display alias: "Repayment complete")
- **Why:** payday-deduction / remainder-pay confirmation is specific to the EWA settlement model and has no corpus analogue
- **Draft variants:**
  - Standard: `{{workspace_name}}: Payday settled. {{repaid_amount}} in advances was deducted; {{remainder_amount}} paid as usual. Details: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: You're squared up for payday. {{repaid_amount}} covered your advances, {{remainder_amount}} paid out. {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Payday settled. {{repaid_amount}} deducted, {{remainder_amount}} paid. STOP to opt out.`
- **New variables:** `repaid_amount` ("$120.00"), `remainder_amount` ("$340.00")
- **Status:** FUTURE — do not add to corpus until bucket changes.

### Content constraints
- Classification sits unsettled between lending and payroll; a TCR campaign should not be filed as a generic loan/lending use case without confirming current carrier treatment, because that framing can attract stricter scrutiny or blocking.
- Keep tip and expedited-fee language out of transactional message bodies entirely. Fee/tip framing in EWA is UDAAP-adjacent; the CFPB's Dec 2025 advisory treats voluntary tips and expedited fees as non-finance-charges only when genuinely optional — implying or pressuring either in an SMS invites deceptive-practice exposure.
- No promotional or upsell content in any transactional EWA message (would also require separate marketing consent and EIN gating). "Tip us," "upgrade for instant," and similar belong nowhere near these flows.
- Never frame an advance as a "loan," "credit," or imply interest/repayment obligation with recourse — the non-credit posture depends on access being limited to already-earned wages with no recourse against the worker.
- Money-movement actions (cash-out, changing the linked destination) should be gated by a verification confirmation code; that message uses the 2FA carve-out (no STOP/HELP).
- State-law patchwork: several states regulate EWA directly; message content claiming "no fees" or specific availability should be reviewed against the operating state set before sending at scale.

### Disambiguation
EWA is easy to conflate with three nearby things that carry different carrier and regulatory baggage: payday/short-term lending (true credit, heavily scrutinized), payroll/HCM notifications (clearly transactional, low scrutiny), and general fintech money-movement (banking app transfers). The TCR classification is genuinely unsettled and hinges on the same question regulators wrestle with — whether the product is "credit." What would settle it: the repayment method (employer-integrated payroll deduction with no recourse points toward payroll/non-credit, per the CFPB's Dec 2025 advisory; direct-to-consumer models that debit the worker's own account look more loan-like) and whether the platform is employer-integrated versus a standalone consumer app. Until a carrier articulates a settled EWA campaign type, file conservatively and document the non-credit posture (earned-only, no underwriting, no recourse) in the campaign description.

### Sources
https://www.dailypay.com/earned-wage-access/
https://help.dailypay.com/hc/en-us/articles/360020722394-Can-I-get-notified-when-my-available-earnings-update
https://help.dailypay.com/hc/en-us/articles/115008800468-What-are-available-earnings
https://www.earnin.com/blog/everything-you-need-to-know-about-earned-wage-access
https://payactiv.com/earned-wage-access/
https://branchapp.com/use-cases/earned-wage-access
https://www.federalregister.gov/documents/2025/12/23/2025-23735/truth-in-lending-regulation-z-non-application-to-earned-wage-access-products
https://www.goodwinlaw.com/en/insights/blogs/2026/01/cfpb-brings-clarity-to-earned-wage-access-products
https://www.mofo.com/resources/insights/260107-cfpb-reestablishes-position-that-certain-earned-wage
https://www.paymentsdive.com/news/some-ewa-products-arent-loans-cfpb-consumer-protection-paycheck/808587/
https://en.wikipedia.org/wiki/Earned_wage_access
https://www.nerdwallet.com/article/loans/personal-loans/what-is-earned-wage-access
