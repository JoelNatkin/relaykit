## Insurance (consumer-facing)
**Vertical:** Financial services
**Bucket:** Not yet, maybe not ever
**URL slug:** /for/insurance
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.

### What this builder is making
A Lemonade-style insurtech or digital policy-management app that runs the full quote → bind → policy → claims lifecycle in software, often with instant-quote and instant-payout automation. The product holds active policies, bills recurring premiums, accepts claims through an app, and pushes status to policyholders. The operational core is keeping a paying policyholder informed at every state change: payment due, policy active or lapsing, claim moving through review, payout sent.

### Why they need SMS
The two failure moments are a lapsing policy and a stalled claim — a missed premium means coverage silently disappears right before the policyholder needs it, and a claim with no status update is the single biggest driver of anxiety and support load. SMS wins because these are time-boxed, consequence-heavy events where an unread email equals lost coverage or a panicked phone call. A premium-due nudge that gets opened in seconds prevents an involuntary lapse that email routinely fails to stop.

### Message categories
1. account-events — primary: premium payment failures, policy lapse warnings, and renewal/billing lifecycle are the churn-critical, coverage-critical messages this builder lives on.
2. order-updates — claim lifecycle maps cleanly onto a multi-step status pipeline (filed → reviewing → approved → paid), the corpus's best structural fit for claim tracking.
3. verification — phone-ownership at signup and step-up confirmation before sensitive actions (payout destination change, beneficiary edits) are core to a money-moving app.
4. appointments — adjuster inspections, agent calls, and medical/property assessments are scheduled events.
5. customer-support — claim questions and account issues generate ticket-style support threads.

Excluded: marketing (separate EIN-gated consent; promotional insurance offers carry heightened AT&T financial-services scrutiny and are out of scope for a transactional posture), community (no community surface), team-alerts (internal ops, not policyholder-facing), waitlist (no queue model in policy issuance).

### Workflows

**Premium billing and lapse prevention**
Keep an active policy paid and warn before coverage drops.
Sequence:
1. account-events:payment-failed — "Premium payment failed" — card on file declined for a recurring premium; coverage at risk if unresolved.
2. account-events:trial-ending — "Renewal coming up" — sent a few days before the policy term renews, prompting plan/payment confirmation.
3. account-events:subscription-confirmed — "Renewal confirmed" — renewal, plan change, or cancellation processed.
4. account-events:account-suspended — "Coverage lapsed" — premium unresolved past grace; policy suspended, with next steps to reinstate.
Variable aliases (only where default feels wrong):
- workspace_name: "Acme Insurance"
- account_link: "policy portal link"
- days_remaining: "days until renewal"

**Claim status pipeline**
Move a policyholder through the claim from filing to payout without a single silent gap.
Sequence:
1. order-updates:order-confirmed — "Claim received" — claim filed; reference number assigned, expected review window set. (See STRETCH below — "order/arrives" framing needs alias work.)
2. order-updates:order-processing — "Claim under review" — claim moved into adjuster/AI review.
3. order-updates:order-delivered — "Claim decision" — claim approved/closed with next-step link. (STRETCH — see Message gaps.)
4. order-updates:refund-processed — "Payout sent" — approved claim funds released to the policyholder's account.
Variable aliases (only where default feels wrong):
- order_number: "claim number"
- estimated_delivery: "expected review date"
- refund_amount: "payout amount"
- card_type: "bank account"
- return_link: "claim detail link"

**Identity and sensitive-action confirmation**
Prove phone ownership at signup and gate money-moving changes.
Sequence:
1. verification:verification-code — "Verification code" — phone verification at signup.
2. verification:confirmation-code — "Confirmation code" — step-up before changing payout destination, beneficiary, or coverage.
3. verification:recovery-code — "Recovery code" — locked-out account recovery.

**Assessment scheduling**
Coordinate adjuster inspections and agent calls tied to a claim or new policy.
Sequence:
1. appointments:confirmation — "Inspection confirmed" — adjuster/inspection booked.
2. appointments:reminder-distant — "Inspection tomorrow" — day-before reminder.
3. appointments:reminder-proximate — "Inspection in 1 hour" — proximate reminder.
4. appointments:no-show-follow-up — "Missed inspection" — rebook after a missed assessment.
Variable aliases (only where default feels wrong):
- provider_name: "adjuster name"

### Message gaps

**STRETCH:order-updates:order-delivered**
- **Classification:** Stretch
- **Proposed corpus home:** order-updates:order-delivered, used as the claim-decision message; fit gap is that a claim can be denied, while "delivered" only models a positive terminal state, and the "Something wrong? start a return" framing inverts the meaning for a denied claim.
- **Proposed universal name:** Claim decision (display alias of the delivered/terminal-status message)
- **Why:** the corpus has no neutral "decision rendered, outcome may be approve or deny" status message.
- **Draft variants:**
  - Standard: `{{workspace_name}}: A decision on claim {{claim_number}} is ready. View the details and next steps here: {{claim_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: We've reached a decision on claim {{claim_number}}. See the details here: {{claim_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Decision ready on claim {{claim_number}}: {{claim_link}} STOP to opt out.`
- **New variables:** claim_number, claim_link (reuse account-events/order patterns; named for the claim domain)
- **Status:** FUTURE — do not add to corpus until bucket changes.

**GAP:document-or-info-request**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (claims commonly stall on a missing photo, police report, or proof-of-loss document)
- **Proposed universal name:** Document needed (display alias)
- **Why:** claims and underwriting frequently block on an outstanding policyholder document, a request-for-action state the corpus does not model.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Claim {{claim_number}} needs a document to continue. Upload it here: {{upload_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: We need one more document to move claim {{claim_number}} forward. Add it here: {{upload_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Claim {{claim_number}} needs a document: {{upload_link}} STOP to opt out.`
- **New variables:** claim_number, upload_link
- **Status:** FUTURE — do not add to corpus until bucket changes.

### Content constraints
- Insurance is a TCR Special / heightened-review category within financial services; AT&T applies stricter content policies to financial-services messaging — sample messages must avoid misleading or high-pressure language.
- Claim details, policy numbers, payout amounts, and coverage status are sensitive — keep bodies to a reference number plus a link to an authenticated portal; never put claim outcomes, dollar amounts of coverage, or PII beyond a masked account in the SMS body.
- Verizon strictly enforces opt-out: every non-2FA body must carry STOP. T-Mobile applies content filtering and per-message caps even to registered senders.
- Per-campaign consent is mandatory — a transactional opt-in (claims/billing) does not authorize marketing; bundling enrollments gets the campaign rejected.
- No quote/lead-generation or promotional premium offers under a transactional registration — those are marketing-category and EIN-gated.
- Honor the platform rule against guaranteed-outcome language; never imply a claim "will be approved" or coverage is "guaranteed."

### Disambiguation
This is held at "Not yet" purely on regulatory posture, not on product fit — the workflows map onto existing corpus categories more cleanly than most served sub-verticals, and the demand (lapse prevention, claim status) is strong and SMS-native. The conservative stance reflects that insurance is a carrier Special use case with heightened financial-services scrutiny and per-state rules, where a botched registration risks campaign rejection rather than mere filtering. It is a strong candidate for promotion to Conditional if a confirmed carrier pathway exists for a transactional-only insurance campaign (billing, claim status, verification, scheduling) that registers cleanly and excludes lead-gen/marketing. What would tip it: confirmation that a Special-use-case insurance brand+campaign can be registered through RelayKit's proxy with the transactional scope above, plus a documented consent and content posture that AT&T/T-Mobile/Verizon accept. Until then, treat all entries here as future reference only.

### Sources
https://www.lemonade.com/terms-of-service
https://www.lemonade.com/pet/explained/how-to-use-the-lemonade-app/
https://messente.com/blog/sms-insurance
https://sinch.com/engage/industries/insurance/
https://textus.com/industries/insurance
https://www.falkonsms.com/post/compliant-sms-strategy-for-insurance
https://hiremav.com/blog/a2p-10dlc-for-insurance-agencies-what-you-need-to-know-carrier-by-carrier
https://help.twilio.com/articles/11847054539547-A2P-10DLC-Campaign-Approval-Requirements
https://mytcrplus.com/home/tcr-resources/a2p-10dlc-tcpa-carrier-policy-updates/
