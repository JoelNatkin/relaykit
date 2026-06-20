## Tax practice tools (preparer-facing, B2B)
**Vertical:** Professional services
**Bucket:** Clear
**URL slug:** /for/tax-practice-ops

### What this builder is making
Preparer-facing practice-operations software that runs a tax or CPA firm's back office: pipeline/workflow tracking that moves each return through stages, client document-request and intake portals, 8879 / engagement-letter e-signature collection, appointment scheduling, and billing (TaxDome, Canopy, Karbon, Jetpack Workflow, Financial Cents). The user is the firm and its staff; the SMS recipients are the firm's clients. It is distinct from consumer self-file tax software — this tool standardizes the firm's recurring work and client-facing collection, not a taxpayer's own return.

### Why they need SMS
During filing season one un-returned document or one unsigned 8879 stalls an entire return in the pipeline, and email open rates collapse under deadline pressure while a text is read within minutes. The firm needs the client to act on a precise moment — upload a missing W-2, e-sign before the deadline, review a finished return, confirm a drop-off appointment — and SMS is the only channel that reliably lands in time to keep the stage moving. Every message points back to the firm's authenticated portal; no SSN, refund figure, or return detail travels in the body.

### Message categories
1. customer-support — the document-request / info-collection loop is the firm's core client back-and-forth; ticket-lifecycle shapes map cleanly to "request open → client responded → resolved."
2. appointments — consults, drop-off/pickup, and signing slots are heavily texted; reminders cut tax-season no-shows.
3. account-events — return-progressed-a-stage and ready-to-review notices are lifecycle pings on the client's engagement with the firm.
4. verification — phone-ownership and step-up confirmation at portal signup (2FA carve-out).
5. waitlist — peak-overflow queue ("we'll start your return when your turn comes") and extension batching (lighter use).
Excluded: marketing (season offers and referral pushes exist but belong to a separate EIN-gated marketing registration, not the transactional firm-client loop), order-updates (no shipped goods), team-alerts (preparer-internal pipeline ops, not client-facing), community (no community surface).

### Workflows

**Document collection / request loop**
Keep a return moving by requesting missing items and nudging until they arrive.
Sequence:
1. customer-support:ticket-received — "Document request opened" — sent when the firm opens a request for missing items; points to the portal upload screen.
2. customer-support:proactive-outreach — "Item still needed" — sent when a requested document is overdue; nudges the client to upload.
3. customer-support:resolution-notification — "Documents received" — sent when the request is satisfied and the return can advance to the next stage.
Variable aliases (only where default feels wrong):
- ticket_number: "request #R-1042"
- ticket_link: "your secure document portal"

**8879 / e-signature collection**
Get the engagement letter or Form 8879 e-signed before the filing deadline.
Sequence:
1. GAP:e-signature request — "Ready to sign" — sent when a document is queued for the client's e-signature; links to the portal signing screen.
2. customer-support:proactive-outreach — "Signature reminder" — sent when the document is still unsigned as the deadline nears.
3. customer-support:resolution-notification — "Signed, thank you" — sent once the signature is captured and the return can proceed.
Variable aliases:
- ticket_link: "your signing portal"

**Return-pipeline status / ready-for-review**
Tell the client when their return reaches a stage they need to act on.
Sequence:
1. STRETCH:account-events:subscription-confirmed — "Return ready for review" — repurposed lifecycle confirmation when the prepared return is posted for client review in the portal.
2. customer-support:agent-response — "Reviewer has a question" — sent when the preparer needs clarification before filing; links to the portal thread.
3. STRETCH:account-events:subscription-confirmed — "Filed and accepted" — sent when the return is e-filed and the IRS accepts it.
Variable aliases:
- account_link: "your return in the portal"

**Appointment lifecycle (consult / drop-off / signing)**
Confirm and remind clients for in-person or virtual tax appointments.
Sequence:
1. appointments:confirmation — "Appointment confirmed" — sent when the client books a consult, drop-off, or signing slot.
2. appointments:reminder-distant — "Tomorrow's appointment" — day-before reminder; can cue documents to bring.
3. appointments:reminder-proximate — "Appointment in 1 hour" — same-day nudge.
4. appointments:no-show-follow-up — "We missed you" — rebook prompt after a missed slot.
Variable aliases:
- provider_name: "your preparer, Dana"

**Deadline / extension reminder**
Warn clients of an approaching filing or estimated-payment deadline so they act in time.
Sequence:
1. GAP:deadline reminder — "Filing deadline approaching" — countdown to the hard external due date; links to the portal action still needed.
Variable aliases:
- account_link: "your portal to finish up"

**Engagement onboarding / portal access**
Bring a new client onto the firm's portal and prove the phone before sending anything sensitive.
Sequence:
1. verification:verification-code — "Verify your number" — phone-ownership proof at portal signup (no STOP/HELP, 2FA carve-out).
2. customer-support:ticket-received — "Welcome — first documents needed" — opens the season's first document request once the client is in.
Variable aliases:
- ticket_link: "your firm portal"

**Peak-season intake queue**
Manage overflow when the firm batches new returns or extensions during the crunch.
Sequence:
1. waitlist:joined — "You're in the queue" — sent when the client's return is queued behind the firm's current load.
2. waitlist:almost-up — "We're starting your return soon" — sent as the firm reaches the client's turn.
3. waitlist:your-turn — "We're starting — action needed" — sent when work begins and the client must supply remaining items.
Variable aliases:
- queue_position: "next in line"
- claim_link: "your document portal"

### Message gaps

**GAP:e-signature request (8879 / engagement letter ready to sign)**
- **Classification:** Universal miss
- **Proposed corpus home:** customer-support:e-sign-request (also serves legal, real-estate, lending, healthcare intake)
- **Proposed universal name:** Signature requested
- **Why:** "a specific document is waiting for your e-signature" is a distinct, cross-vertical transactional event that agent-response only approximates.
- **Draft variants:**
  - Standard: `{{workspace_name}}: A document is ready for your signature. Sign securely here: {{sign_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}} here - one document needs your e-signature. Sign it securely: {{sign_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Document ready to sign: {{sign_link}} STOP to opt out.`
- **New variables:** `{{sign_link}}` — authenticated portal signing URL, budget ~24 chars, source: firm's e-sign provider, example: "your secure signing portal"

**GAP:deadline reminder (filing / payment due date)**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:deadline-reminder (serves any deadline-bound engagement — filings, renewals, submissions)
- **Proposed universal name:** Deadline approaching
- **Why:** a countdown to a hard external due date with a required client action is broader than trial-ending and avoids stretching a billing message onto a compliance deadline.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your {{deadline_label}} is in {{days_remaining}} days. Finish here to stay on time: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: Heads up - your {{deadline_label}} is {{days_remaining}} days out. Wrap it up here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{deadline_label}} in {{days_remaining}} days: {{account_link}} STOP to opt out.`
- **New variables:** `{{deadline_label}}` — name of the due date, budget ~18 chars, source: firm pipeline/deadline field, example: "filing deadline"

**STRETCH:account-events:subscription-confirmed** (used for "return ready for review" and "filed and accepted")
- **Classification:** Stretch
- **Proposed corpus home:** account-events:subscription-confirmed as a milestone/status notice; a dedicated account-events:status-update would fit the return-progressed event better.
- **Proposed universal name:** Status update
- **Why:** the corpus message frames a subscription/plan change, whereas the tax event is "your return reached a new stage" — the link and intent carry, but the framing is stretched.
- **Draft variants:**
  - Standard: `{{workspace_name}}: There's an update on your return. View the details here: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: Your return just moved forward - take a look: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Return update ready: {{account_link}} STOP to opt out.`

### Content constraints
- Standard carrier rules apply. Preparer-facing transactional traffic is standard-eligible; no special carve-out.
- Capture explicit client consent at portal intake/onboarding; include opt-in language wherever the firm collects the client's mobile number (TCPA express consent for transactional; express written consent for any promotional send).
- Keep SSNs, refund amounts, account numbers, and any tax-return detail out of the message body — link to the authenticated firm portal for anything sensitive.
- Document-request, e-sign, and return-review links must resolve to the authenticated portal, never an open document.
- All transactional bodies carry "Reply STOP to opt out." (Brief: "STOP to opt out."); verification/2FA bodies omit STOP/HELP per the carve-out.
- No promotional content (season discounts, referral pushes) in the transactional firm-client loop — that requires a separate EIN-gated marketing registration.

### Disambiguation
This is preparer-facing practice tooling (Clear, B2B): the builder sells software to a tax firm, and the firm texts its own clients about documents, signatures, deadlines, appointments, and where each return sits in the pipeline. It is not consumer self-file tax-prep software (TurboTax-style DIY), where the taxpayer files their own return and the IRS-handling and regulatory burden sit with the consumer product — that neighboring sub-vertical is Conditional. It also differs from accounting/bookkeeping SaaS, which centers on ongoing ledgers and money movement rather than the seasonal return-collection engagement. What tips Clear→Conditional here is the body content, not the audience: factual document-request and deadline-reminder comms stay transactional, but the moment a message carries a refund amount, an SSN, or any return figure it stops being a portal nudge and becomes regulated financial detail that must never travel over SMS. The recipient is always the firm's client, and the sending identity and compliance posture belong to the firm — not to a taxpayer-facing filer — which keeps it standard-eligible.

### Sources
https://taxdome.com/sms
https://taxdome.com/
https://taxdome.com/workflow
https://taxdome.com/client-portal
https://taxdome.com/blog/best-tax-practice-management-software
https://www.getcanopy.com/
https://www.finlens.app/blogs/tax-workflow-automation-cpa-firms-multiple-clients
https://financial-cents.com/resources/articles/tax-workflow-software/
https://textellent.com/blog/sms-taxes/
https://textellent.com/blog/benefits-of-sms-during-tax-season/
https://www.natptax.com/news-insights/blog/drive-growth-with-sms-irs-compliant-and-tcpa-safe-texting-that-boosts-efficiency-and-client-satisfaction/
https://sinch.com/engage/use-cases/sms-for-tax-services/
https://www.text-em-all.com/blog/text-message-marketing-for-tax-preparation-services-your-guide-to-a-smoother-tax-season
https://www.eztexting.com/industries/tax
