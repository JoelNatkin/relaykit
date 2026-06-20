## Tax practice tools (preparer-facing, B2B)
**Vertical:** Financial services
**Bucket:** Clear
**URL slug:** /for/tax-practice

### What this builder is making
Preparer-facing practice-management software for CPA and tax-prep firms — client document-request portals, e-signature/8879 collection, return-status and workflow tracking, billing, and client messaging (Canopy, TaxDome, Karbon, Jetpack Workflow). The user is the tax professional; the SMS recipients are the firm's clients. It is distinct from consumer self-file tax software: this tool runs the firm's back office and client-facing collection, not a taxpayer's own filing.

### Why they need SMS
During the compressed filing season a single un-returned document request or unsigned 8879 stalls a whole return, and email open rates collapse under deadline pressure while texts are read within minutes. The firm needs the client to act on a specific moment — upload a missing W-2, e-sign before the filing deadline, review a finished return, confirm an appointment — and SMS is the only channel that reliably lands in time. Every message points the client back to the firm's authenticated portal; no tax data travels in the body.

### Message categories
1. customer-support — the document-request / info-collection loop that drives the engagement is the firm's core back-and-forth; ticket-lifecycle shapes map cleanly to "request open → client responded → resolved."
2. appointments — consultations, drop-off/pickup, and signing appointments are heavily texted; reminders cut tax-season no-shows.
3. account-events — return-ready-to-review and engagement-status notices are lifecycle pings on the client's account with the firm.
4. waitlist — extension queues / "we'll start your return when your turn comes" during peak overflow (lighter use).
5. verification — phone-ownership and step-up confirmation at portal signup (2FA carve-out).
Excluded: marketing (promotional season offers exist but belong to a separate EIN-gated marketing registration, not the transactional firm-client loop), order-updates (no shipped goods), team-alerts (preparer-internal ops, not client-facing), community (no community surface).

### Workflows

**Document collection / request loop**
Keep a return moving by requesting missing documents and nudging until they arrive.
Sequence:
1. customer-support:ticket-received — "Document request opened" — sent when the firm opens a request for missing items; points to the portal upload screen.
2. customer-support:proactive-outreach — "Item still needed" — sent when a requested document is overdue; nudges the client to upload.
3. customer-support:resolution-notification — "Documents received" — sent when the request is satisfied and the return can advance.
Variable aliases (only where default feels wrong):
- ticket_number: "request #R-1042"
- ticket_link: "your secure document portal"

**8879 / e-signature collection**
Get the engagement letter or Form 8879 e-signed before the filing deadline.
Sequence:
1. customer-support:agent-response — "Ready to sign" — sent when a document is queued for the client's e-signature; links to the portal signing screen. (See GAP below — e-sign-request is a closer fit than agent-response.)
2. customer-support:proactive-outreach — "Signature reminder" — sent when the document is still unsigned as the deadline nears.
3. customer-support:resolution-notification — "Signed, thank you" — sent once the signature is captured.
Variable aliases:
- ticket_link: "your signing portal"

**Return-status / ready-for-review**
Tell the client when their return reaches a milestone they need to act on.
Sequence:
1. account-events:subscription-confirmed — "Return ready for review" — repurposed lifecycle confirmation when the prepared return is posted for client review in the portal.
2. customer-support:agent-response — "Reviewer has a question" — sent when the preparer needs clarification before filing.
3. account-events:subscription-confirmed — "Filed / accepted" — sent when the return is e-filed and accepted. (See GAP — filing-status is a stretch on subscription-confirmed.)
Variable aliases:
- account_link: "your return in the portal"

**Appointment lifecycle (consult / drop-off / signing)**
Confirm and remind clients for in-person or virtual tax appointments.
Sequence:
1. appointments:confirmation — "Appointment confirmed" — sent when the client books a consult or signing slot.
2. appointments:reminder-distant — "Tomorrow's appointment" — day-before reminder, can cue documents to bring.
3. appointments:reminder-proximate — "Appointment in 1 hour" — same-day nudge.
4. appointments:no-show-follow-up — "We missed you" — rebook prompt after a missed slot.
Variable aliases:
- provider_name: "your preparer, Dana"

**Deadline / extension reminder**
Warn clients of an approaching filing or estimated-payment deadline so they act in time.
Sequence:
1. account-events:trial-ending — "Filing deadline approaching" — repurposed time-bounded reminder counting down to the deadline; links to the portal action needed. (See GAP — deadline-reminder is the proper home.)
Variable aliases:
- days_remaining: "6"
- account_link: "your portal to finish up"

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
- **New variables:** sign_link ("your secure signing portal")

**GAP:deadline reminder (filing / payment due date)**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:deadline-reminder (serves any deadline-bound engagement — filings, renewals, submissions)
- **Proposed universal name:** Deadline approaching
- **Why:** a countdown to a hard external due date with a required client action is broader than trial-ending and avoids stretching a billing message onto a compliance deadline.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your {{deadline_label}} is in {{days_remaining}} days. Finish here to stay on time: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: Just a heads up - your {{deadline_label}} is {{days_remaining}} days out. Wrap it up here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{deadline_label}} in {{days_remaining}} days: {{account_link}} STOP to opt out.`
- **New variables:** deadline_label ("filing deadline")

**STRETCH:account-events:subscription-confirmed** (used for "return ready for review" and "filed / accepted")
- **Classification:** Stretch
- **Proposed corpus home:** account-events:subscription-confirmed as a milestone/status notice; a dedicated account-events:status-update would fit the return-progressed event better.
- **Proposed universal name:** Status update
- **Why:** the corpus message frames a subscription/plan change, whereas the tax event is "your item reached a new stage" — the link and intent carry, but the framing is stretched.
- **Draft variants:**
  - Standard: `{{workspace_name}}: There's an update on your account. View the details here: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: Something's moved forward on your account - take a look: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Account update ready: {{account_link}} STOP to opt out.`

### Content constraints
- Standard carrier rules apply. Financial-services traffic is standard-eligible; no special carve-out.
- Capture explicit client consent at portal intake/onboarding; include opt-in language wherever the firm collects the client's mobile number.
- Keep SSNs, account numbers, refund amounts, and any tax-return detail out of the message body — link to the authenticated firm portal for anything sensitive.
- Document-request, e-sign, and return-review links must resolve to the authenticated portal, never an open document.
- All transactional bodies carry "Reply STOP to opt out." (Brief: "STOP to opt out."); verification/2FA bodies omit STOP/HELP per the carve-out.
- No promotional content (season discounts, referral pushes) in the transactional firm-client loop — that requires a separate marketing registration.

### Disambiguation
This is preparer-facing practice tooling (Clear, B2B): the builder sells software to a tax firm, and the firm texts its own clients about documents, signatures, deadlines, and appointments. It is not consumer self-file tax-prep software, where the taxpayer files their own return and the regulatory posture and IRS-handling burden sit with the consumer product (Conditional). It is also distinct from accounting/bookkeeping SaaS, which centers on ongoing ledgers and money movement rather than the seasonal return-collection engagement. In every case the recipient is the firm's client, but here the compliance posture and sending identity belong to the firm — not to a money-mover or a taxpayer-facing filer — which keeps it standard-eligible and Clear.

### Sources
https://www.getcanopy.com/
https://taxdome.com/sms
https://taxdome.com/blog/introducing-sms-text-messages-communication-in-taxdome
https://help.taxdome.com/article/146-electronic-signatures
https://www.getcanopy.com/smart-intake/
https://www.getcanopy.com/accounting-client-portal/
https://textellent.com/blog/sms-taxes/
https://www.natptax.com/news-insights/blog/drive-growth-with-sms-irs-compliant-and-tcpa-safe-texting-that-boosts-efficiency-and-client-satisfaction/
https://sinch.com/engage/use-cases/sms-for-tax-services/
https://www.buildyourfirm.com/articles/best-practices-for-text-messaging-sms-to-accounting-and-tax-clients
https://www.text-em-all.com/blog/text-message-marketing-for-tax-preparation-services-your-guide-to-a-smoother-tax-season
