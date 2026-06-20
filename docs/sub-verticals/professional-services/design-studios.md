## Design studios / freelance design tools
**Vertical:** Professional services
**Bucket:** Clear
**URL slug:** /for/design-studios

### What this builder is making
A clientflow tool for independent designers and small studios that runs the engagement end to end: inquiry intake, proposal and contract sign-off, milestone-based project tracking, design review/approval rounds, and invoicing with payment collection. It models the canonical creative-services pipeline (inquiry → proposal → contract → deposit → project → revision rounds → delivery → final payment → offboarding), the same shape HoneyBook, Dubsado, Plutio, and Studio Designer build around. The client-facing surface is a portal where clients approve proposals, leave threaded feedback on mockups, sign contracts, and pay invoices.

### Why they need SMS
A proposal or invoice sitting unread in an inbox is the single biggest source of stalled cash flow for a solo designer, and email open rates make follow-up a guessing game. A text that the proposal is ready to sign, the deposit invoice is due, or the new mockup is up for review lands in seconds and gets acted on, which is exactly the moment money and momentum move. SMS wins because every step in this pipeline is a discrete client action with a deadline (sign, pay, review, approve) where a missed beat costs the freelancer days.

### Message categories
1. account-events — proposal/contract/invoice and deposit notifications are the churn-and-cashflow-critical events; payment-failed and billing alerts map here directly
2. appointments — discovery/kickoff calls and project review meetings are booked appointments with the standard confirm/remind/reschedule lifecycle
3. customer-support — revision requests and client questions route as a lightweight ticket lifecycle in studios that run a request-board model (ManyRequests pattern)
4. marketing — second-campaign territory only: portfolio drops, availability-reopened blasts, seasonal promos to past clients (EIN-gated, separate consent)
Excluded: order-updates (no physical fulfillment/shipping — delivery is a file handoff, covered by a GAP below), team-alerts (internal ops, not client-facing; a true solo builder has no team), community (no membership/community surface), verification (only if the portal adds phone-based login — possible but not core), waitlist (designers manage a project queue, but it is not surfaced to clients as a positioned waitlist)

### Workflows

**Proposal sent for signature**
Gets the proposal in front of the client and pushes them to sign so the project can start.
Sequence:
1. account-events:subscription-confirmed — "Proposal ready" — STRETCH: tells the client a proposal is ready to review and sign, with the portal link
2. account-events:trial-ending — "Proposal expiring" — STRETCH: nudge a few days before the proposal/quote validity window lapses
Variable aliases:
- account_link: "yourstudio.com/p/maple-rebrand"

**Contract ready to sign**
Moves an agreed proposal into a signed agreement so work can begin.
Sequence:
1. account-events:subscription-confirmed — "Contract ready" — STRETCH: contract is ready for e-signature; link to the portal

**Deposit / invoice due**
Collects the upfront deposit or a milestone invoice — the cashflow backbone of the studio.
Sequence:
1. GAP:invoice-sent — "Invoice ready" — new invoice is issued with amount and pay link
2. GAP:invoice-reminder — "Invoice reminder" — invoice approaching or past due, gentle nudge with pay link
3. account-events:payment-failed — "Payment failed" — a card-on-file or autopay charge was declined; update payment
4. GAP:payment-received — "Payment received" — confirms the payment landed and the project/milestone is unblocked

**Design ready for review**
Tells the client a new deliverable or revision is up so the feedback round can start.
Sequence:
1. GAP:deliverable-ready — "Ready for review" — a mockup/draft is posted in the portal for feedback
2. GAP:feedback-requested — "Feedback nudge" — reminder that a review is still awaiting the client's comments/approval
3. GAP:approval-confirmed — "Approved" — confirms the client signed off on the round and the project advances

**Files delivered**
Closes the project by handing off final assets and confirming delivery.
Sequence:
1. GAP:files-delivered — "Files delivered" — final files are available for download in the portal

**Kickoff / review call**
Schedules and protects the discovery call or milestone review meeting against no-shows.
Sequence:
1. appointments:confirmation — "Call confirmed" — confirms the booked discovery/kickoff/review call
2. appointments:reminder-distant — "Call tomorrow" — day-before reminder with reschedule link
3. appointments:reminder-proximate — "Call soon" — ~1 hour out
4. appointments:reschedule-confirmation — "Call moved" — confirms a new time
5. appointments:no-show-follow-up — "Missed call" — rebook after a missed call
Variable aliases:
- provider_name: "Dana (your designer)"

**Revision request handling**
Treats an inbound client revision request or question as a tracked thread so nothing gets lost (request-board studios).
Sequence:
1. customer-support:ticket-received — "Request logged" — confirms a revision/change request was received
2. customer-support:agent-response — "Reply ready" — the designer has responded in the thread
3. customer-support:resolution-notification — "Request done" — the revision is complete
4. customer-support:csat-follow-up — "How'd we do" — post-project satisfaction rating

**Billing lifecycle (studio's own subscription)**
The studio's own account/billing health on the SaaS tool — distinct from client invoicing.
Sequence:
1. account-events:payment-failed — "Card declined" — the studio's card for the tool was declined
2. account-events:trial-ending — "Trial ending" — the studio's trial is ending
3. account-events:new-device-sign-in — "New sign-in" — security alert on the studio's account

**Win-back / availability reopened** (marketing — second campaign, EIN-gated)
Re-engages past clients when the designer has new openings or a portfolio drop.
Sequence:
1. marketing:re-engagement — "Back in touch" — it's been a while, here's what's new / openings available
2. marketing:promotional-offer — "Booking special" — a seasonal or referral promo
Variable aliases:
- business_name: "Maple Studio"

### Message gaps

**GAP:invoice-sent**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:invoice-sent (or a future `billing` category)
- **Proposed universal name:** Invoice sent
- **Why:** invoicing/payment-collection is core to professional services and the corpus only has payment-failed, not a positive "invoice is ready, pay here" notice
- **Draft variants:**
  - Standard: `{{workspace_name}}: Invoice {{invoice_number}} for {{amount}} is ready. View and pay: {{invoice_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} invoice {{invoice_number}} ({{amount}}) is ready. Pay here: {{invoice_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Invoice {{invoice_number}}, {{amount}}. Pay: {{invoice_link}} STOP to opt out.`
- **New variables:** `{{invoice_number}}` — invoice reference, ~8 chars, source: invoicing record, example "INV-104"; `{{amount}}` — amount due with currency, ~8 chars, source: invoice total, example "$1,500"; `{{invoice_link}}` — portal pay link, ~20 chars, source: portal, example "yourstudio.com/i/104"

**GAP:invoice-reminder**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:invoice-reminder (or a future `billing` category)
- **Proposed universal name:** Invoice reminder
- **Why:** an unpaid invoice approaching/past due is the most common follow-up a freelancer sends and has no corpus message
- **Draft variants:**
  - Standard: `{{workspace_name}}: Invoice {{invoice_number}} for {{amount}} is due {{due_date}}. Pay here: {{invoice_link}} Reply STOP to opt out.`
  - Friendly: `A reminder from {{workspace_name}}: invoice {{invoice_number}} ({{amount}}) is due {{due_date}}. Pay: {{invoice_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Invoice {{invoice_number}} due {{due_date}}. Pay: {{invoice_link}} STOP to opt out.`
- **New variables:** `{{due_date}}` — due date, ~8 chars, source: invoice record, example "Jun 30" (reuses invoice_number/amount/invoice_link above)

**GAP:payment-received**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:payment-received (or a future `billing` category)
- **Proposed universal name:** Payment received
- **Why:** the positive counterpart to payment-failed; confirming a client payment landed is a standard, expected receipt and unblocks the project
- **Draft variants:**
  - Standard: `{{workspace_name}}: We received your payment of {{amount}} for invoice {{invoice_number}}. Thank you. Reply STOP to opt out.`
  - Friendly: `Thanks! {{workspace_name}} got your {{amount}} payment for invoice {{invoice_number}}. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Payment of {{amount}} received, invoice {{invoice_number}}. STOP to opt out.`
- **New variables:** none beyond amount/invoice_number above

**GAP:deliverable-ready**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (design-studios)
- **Proposed universal name:** Ready for review (display alias)
- **Why:** "a new mockup/draft is posted for client feedback" is specific to creative review cycles, not a universal transactional event

**GAP:feedback-requested**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (design-studios)
- **Proposed universal name:** Feedback nudge (display alias)
- **Why:** chasing a client for review comments mid-round is a creative-workflow-specific nudge

**GAP:approval-confirmed**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (design-studios)
- **Proposed universal name:** Approved (display alias)
- **Why:** sign-off on a design round is a creative-specific milestone, not a generic account event

**GAP:files-delivered**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (design-studios)
- **Proposed universal name:** Files delivered (display alias)
- **Why:** final-asset handoff is a file event unique to creative/digital delivery, distinct from order-updates physical shipping

**STRETCH:account-events:subscription-confirmed**
- **Classification:** Stretch
- **Proposed corpus home:** account-events:subscription-confirmed — fit gap: the body says "subscription change is confirmed," which reads as SaaS billing, not "your proposal/contract is ready to sign"
- **Proposed universal name:** Subscription confirmed
- **Why:** used here as a generic "a document is ready in your account" notice; a dedicated proposal-ready/contract-ready message would fit better
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your proposal is ready to review and sign: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} proposal is ready. Review and sign here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Proposal ready to sign: {{account_link}} STOP to opt out.`

**STRETCH:account-events:trial-ending**
- **Classification:** Stretch
- **Proposed corpus home:** account-events:trial-ending — fit gap: "trial ends in N days / choose a plan" framing doesn't match "your proposal/quote expires soon"
- **Proposed universal name:** Trial ending
- **Why:** reused for a proposal-validity-expiring nudge; semantically close (time-boxed window closing) but copy needs full reframe
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your proposal expires in {{days_remaining}} days. Sign here to lock it in: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} proposal expires in {{days_remaining}} days. Sign here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Proposal expires in {{days_remaining}} days. Sign: {{account_link}} STOP to opt out.`

### Content constraints
- Standard carrier rules apply; client-facing transactional traffic (proposals, invoices, project updates, review notices) registers cleanly as ACCOUNT_NOTIFICATION / CUSTOMER_CARE.
- Recipients are the studio's own clients with an existing business relationship — collect explicit opt-in at intake (portal signup / contract) and honor STOP/HELP on every body except the 2FA carve-out.
- Invoice/payment messages are transactional, not promotional — keep them factual (amount, reference, pay link); do not bundle upsells or "book your next project" CTAs into a payment notice.
- Win-back, availability-reopened, and portfolio-drop blasts are promotional: route through the second (marketing) campaign with separate consent, EIN-gated; do not send them on the transactional campaign.
- No SHAFT-C content (not a typical risk here, but applies to any marketing-lane send).

### Disambiguation
Design studios sit beside generic creative-CRM (HoneyBook/Dubsado serving photographers, planners, coaches) and marketing/web agencies; the workflows overlap heavily, so a builder skinning a generic clientflow tool for designers still maps to this entry. It stays Clear as long as messaging is the studio texting its own contracted clients about their own engagement. Two things tip it toward Conditional: (1) if the tool sends on behalf of many sub-accounts (an agency-of-agencies / white-label platform), that is a reseller/ISV pattern with its own brand-registration nuance; (2) if "files delivered" or "review ready" blasts go to scraped or purchased prospect lists rather than active clients, that is cold outreach and loses transactional standing. What looks allowed but isn't: framing a payment nudge as a chance to pitch a new package — the moment a transactional invoice text carries a promo, it belongs in the marketing lane.

### Sources
https://www.plutio.com/solutions/designers/client-management
https://www.plutio.com/solutions/designers/invoicing
https://www.clientary.com/proposal-software
https://www.clientary.com/industries/freelance-invoicing-and-project-management
https://www.studiodesigner.com/blog/win-client-experience-studio-designer/
https://www.studiodesigner.com/blog/share-design-business-documents/
https://www.wethos.co/creative-studio-software
https://www.wethos.co/message-templates
https://www.honeybook.com/blog/dubsado-vs-honeybook
https://clickup.com/blog/dubsado-vs-honeybook/
https://onesuite.io/blog/honeybook-vs-dubsado/
https://www.dakotadesigncompany.com/blog/honeybook-versus-dubsado-best-crm-for-interior-designers
https://picflow.com/blog/best-design-approval-software
https://manyrequests.com/blog/design-approval-software
https://www.agencyhandy.com/client-portal/best/design-agencies/
https://www.hellobonsai.com/proposal-template/freelance
https://www.textedly.com/blog/sms-invoice-templates
https://www.quo.com/blog/payment-reminder-message/
https://jetpackcrm.com/improving-client-follow-up-for-freelance-graphic-designers-with-crm/
https://www.glideapps.com/solutions/freelance-design-studios/workflow-automation-software
https://sakari.io/blog/meeting-10dlc-compliance-with-opt-ins
https://www.termsfeed.com/blog/a2p-10dlc-compliance/
https://help.gohighlevel.com/support/solutions/articles/48001229784-a2p-10dlc-campaign-approval-best-practices
