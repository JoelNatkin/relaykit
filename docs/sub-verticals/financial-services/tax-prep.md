## Tax prep / filing software (consumer)
**Vertical:** Financial services
**Bucket:** Conditional
**URL slug:** /for/tax-prep

### What this builder is making
A TurboTax-for-X consumer self-file product that walks a taxpayer through a guided return, imports W-2/1099 source documents, and e-files federal and state returns on their behalf. Because filing is brokered through the IRS and state agencies, the software owns the post-submission lifecycle — acceptance, rejection, and refund tracking — which the user cannot see directly. Demand is sharply seasonal, concentrated in the January-April filing window plus the October extension deadline.

### Why they need SMS
After e-file, the return sits in a 24-48h limbo where the IRS either accepts or rejects it, and a silent rejection means the taxpayer believes they filed when they didn't — a missed-deadline consequence with real penalties. A document-needed gap (missing 1099, mismatched ID) or an approaching deadline is time-boxed and high-stakes, and these users check the app only sporadically once they've hit "submit." SMS reaches them at the moment the status flips, when email gets buried and the in-app return is already closed.

### Message categories
1. account-events — the filing lifecycle (e-file accepted, rejected, action needed) is the churn-critical "did my thing go through" surface this category exists for
2. order-updates — the e-file submission maps cleanly onto a confirmed → processing → completed pipeline, the closest structural analog to "your filing was accepted / your refund issued"
3. verification — phone-ownership and step-up confirmation on a sensitive financial account at signup and before payment/bank-info changes
4. appointments — only if the product offers live expert/CPA review sessions (assisted tier); otherwise excluded
Excluded: marketing (promotional, EIN-gated, irrelevant to the transactional filing flow and risky against IRS-impersonation scrutiny), community (no member/social layer), team-alerts (no operational/on-call surface), waitlist (no queue), customer-support (only if a real ticketing surface exists; the core filing flow does not generate it).

### Workflows

**E-file submission lifecycle**
Keep the taxpayer informed from "submitted" through "accepted" so a silent rejection never goes unseen.
Sequence:
1. order-updates:order-confirmed — "Return submitted" — sent the moment e-file is transmitted; sets the 24-48h acceptance expectation
2. order-updates:order-processing — "At the IRS" — optional intermediate state while the return is pending agency response
3. account-events:subscription-confirmed — "Return accepted" — sent when the IRS/state accepts the return (the success terminal state)
4. account-events:account-suspended — "Return rejected — action needed" — STRETCH: sent on rejection; routes the user back in to fix and re-file
Variable aliases (only where default feels wrong):
- order_number: "your 2025 federal return"
- estimated_delivery: "24-48 hours"
- account_link: "your return"

**Refund tracking**
Tell the taxpayer when the refund moves, since they cannot see IRS internals from inside the app.
Sequence:
1. account-events:subscription-confirmed — "Refund approved" — sent when the agency approves the refund for disbursement
2. order-updates:refund-processed — "Refund sent" — sent when the refund is issued to the bank/card on file
Variable aliases (only where default feels wrong):
- refund_amount: "your federal refund"
- order_number: "your 2025 return"
- card_type: "bank account on file"

**Document collection**
Get a missing source document before it blocks the return.
Sequence:
1. GAP:document-needed — "Document needed" — sent when a required form (missing 1099, ID mismatch) blocks completion
Variable aliases (only where default feels wrong):
- account_link: "your return"

**Deadline reminders**
Nudge an unfinished return before the filing or extension deadline lapses.
Sequence:
1. account-events:trial-ending — "Deadline approaching" — STRETCH: repurposes the days-remaining countdown to warn that the filing deadline is near while the return is incomplete
Variable aliases (only where default feels wrong):
- days_remaining: "4"
- account_link: "your return"

**Signup & sensitive-change verification**
Prove phone ownership and gate sensitive changes on a financial account.
Sequence:
1. verification:verification-code — "Verification code" — at signup
2. verification:confirmation-code — "Confirmation code" — before changing the refund bank account or payment method
(No alias overrides — defaults fit.)

### Message gaps

**GAP:document-needed**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:document-needed
- **Proposed universal name:** Document needed
- **Why:** a pending-on-user "we need a file/form from you to proceed" state recurs across tax, lending, onboarding, and KYC flows and has no current corpus home
- **Draft variants:**
  - Standard: `{{workspace_name}}: We need a document to finish your return. Add it here: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: One thing left — we need a document to finish up. Add it here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Document needed to continue. {{account_link}} STOP to opt out.`

**STRETCH:account-events:account-suspended**
- **Classification:** Stretch
- **Proposed corpus home:** account-suspended covers the rejection terminal state, but its "suspended" framing is heavier than a fixable e-file rejection warrants; the real fit is a "return rejected — fixable, action needed" message
- **Proposed universal name:** Action required / submission rejected (display alias: "Return rejected")
- **Why:** a brokered submission bouncing back from a third party (IRS) for user correction is distinct from an account being suspended, but no closer corpus message exists
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your return was rejected and needs a quick fix. Review and re-file: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: Your return came back with a fixable issue. Sort it and re-file here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Return rejected — needs a fix. {{account_link}} STOP to opt out.`

**STRETCH:account-events:trial-ending**
- **Classification:** Stretch
- **Proposed corpus home:** trial-ending's days-remaining countdown structure maps onto a filing-deadline warning, but the "trial/plan" framing is a billing concept, not a regulatory deadline
- **Proposed universal name:** Deadline approaching (display alias: "Filing deadline approaching")
- **Why:** a hard external deadline on an unfinished task is structurally a countdown, but the corpus only has it framed as a subscription/trial event
- **Draft variants:**
  - Standard: `{{workspace_name}}: The filing deadline is in {{days_remaining}} days and your return isn't filed yet. Finish here: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: Just {{days_remaining}} days left to file and your return's still open. Wrap it up: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Deadline in {{days_remaining}} days, return unfiled. {{account_link}} STOP to opt out.`

### Content constraints
- Never state or imply a guaranteed refund amount; refund_amount references the user's own computed figure, never a promised sum.
- Never frame a body as if it comes from the IRS or any tax agency — the sender frame is always {{workspace_name}} (the software's own name). The IRS does not initiate contact by text, and taxpayers are primed to read agency-sounding texts as smishing.
- Keep SSN, ITIN, EIN, full account numbers, and other PII out of the body entirely.
- Deadline-urgency copy must read as a helpful product nudge, not a threat — no "act now or face penalties / arrest / account seizure" framing that mirrors scam patterns.
- Expect elevated carrier and aggregator scrutiny on tax/financial content; bodies should be plainly first-party and free of refund-bait phrasing ("claim your refund," "unclaimed refund").
- Refund and acceptance links point to the software's own return view, never to an "IRS verification" page.

### Disambiguation
This entry is the consumer self-file product, where the end taxpayer drives their own return and SMS goes to that filer about their own filing. It is distinct from preparer-facing tax-practice tooling — CRM and document-portal software used by CPAs and tax firms to manage many clients — which is a separate Clear B2B sub-vertical whose SMS targets clients on behalf of a practitioner and leans on customer-support and appointments categories. The tip toward stricter handling comes when the software adds an assisted/expert tier (live CPA review introduces appointments and a human-in-the-loop), holds bank/refund-disbursement details, or moves money — each raises financial carrier scrutiny and tightens the anti-impersonation and PII rules above.

### Sources
https://www.cnbc.com/select/best-tax-software/
https://thecollegeinvestor.com/23914/turbotax-alternatives/
https://www.nerdwallet.com/taxes/learn/taxact-vs-turbotax
https://turbotax.intuit.com/tax-tools/efile-status-lookup/
https://www.e-file.com/faq/accepted-rejected.php
https://sinch.com/engage/use-cases/sms-for-tax-services/
https://www.irs.gov/newsroom/dirty-dozen-tax-scams-for-2026-irs-reminds-taxpayers-to-watch-out-for-dangerous-threats
https://www.irs.gov/help/tax-scams
https://lifelock.norton.com/learn/fraud/irs-scam-text-message
