## Financial advisor / wealth-management tools
**Vertical:** Financial services
**Bucket:** Not yet, maybe not ever
**URL slug:** /for/wealth-management
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.

### What this builder is making
CRM and practice-management software (Wealthbox, Redtail, and similar) for RIAs and independent financial advisors — managing client relationships, scheduling periodic reviews, routing documents for signature, and surfacing portfolio/statement updates through a client portal. The product is sold B2B to advisory firms, but the SMS recipients are the advisors' end clients. Operationally it sits on top of custodian feeds, planning tools, and a document vault, with the CRM as the system of record.

### Why they need SMS
The recurring moment is the annual/quarterly review meeting and the document waiting for a signature: a client who misses the review or lets a DocuSign sit costs the advisor a billing-quarter touchpoint or a stalled account action. Email open rates in financial services run 20-25% while SMS clears ~98% with sub-90-second response, so a reminder actually lands. SMS wins because these are time-boxed, action-required nudges to a known, opted-in client — not cold outreach.

### Message categories
1. appointments — review meetings and planning sessions are the spine of the advisor relationship; confirmations, reminders, reschedules all map cleanly.
2. account-events — statement-ready, document-ready-to-sign, and account-status alerts are the portal's churn-critical touchpoints.
3. verification — step-up confirmation codes before sensitive actions (withdrawals, beneficiary/payment changes) are a natural fit and 2FA-carve-out clean.
4. customer-support — client question threads and resolution notices when the advisor's service desk handles inbound.
Excluded: marketing (SEC/state-RIA marketing-rule and recordkeeping scrutiny make promotional SMS the highest-risk category — keep it out by default), order-updates (no fulfillment), team-alerts (no end-client analog), community, waitlist (no queue model in 1:1 advisory).

### Workflows
**Annual/quarterly review cycle**
Get the client to confirm and show up for the periodic review meeting.
Sequence:
1. appointments:confirmation — "Review confirmed" — sent when the advisor books the review in the CRM calendar.
2. appointments:reminder-distant — "Review tomorrow" — day-before nudge with reschedule link.
3. appointments:reminder-proximate — "Review in 1 hour" — same-day nudge.
4. appointments:reschedule-confirmation — "Review moved" — when the client reschedules.
5. appointments:no-show-follow-up — "Missed review — rebook" — after a missed slot.
6. appointments:post-appointment — "After your review" — optional feedback/next-steps pointer.
Variable aliases (only where default feels wrong):
- provider_name: "your advisor, Dana Reyes"

**Document ready to sign / action required**
Move a stalled document (signature, form, agreement renewal) to done.
Sequence:
1. account-events:subscription-confirmed — "Document ready" — repurposed as the "something is ready for you in your portal" notice with portal link. (See STRETCH below — fit is imperfect.)
2. account-events:account-suspended — "Action needed on your account" — repurposed for an account hold/restriction pending a required form. (Stretch — see gaps.)
Variable aliases:
- account_link: "your secure portal"

**Sensitive-action step-up confirmation**
Confirm the client authorized a high-risk account change before it executes.
Sequence:
1. verification:confirmation-code — "Confirm this change" — sent before a withdrawal, payment-method change, or beneficiary/ownership transfer.
(No STOP/HELP language — 2FA carve-out.)

**Client question / service thread**
Keep the client informed when they raise a question the firm's service desk handles.
Sequence:
1. customer-support:ticket-received — "We got your question" — on inbound logging.
2. customer-support:agent-response — "Your advisor replied" — when the advisor/team responds.
3. customer-support:resolution-notification — "Resolved" — on close.
Variable aliases:
- agent_name: "your advisor"

### Message gaps
**STRETCH:account-events:subscription-confirmed**
- **Classification:** Stretch
- **Proposed corpus home:** stretch corpus msg `account-events:subscription-confirmed`; fit gap is that it frames a billing/subscription change, while the advisor need is "a document or statement is ready in your portal" — no subscription concept exists in advisory.
- **Proposed universal name:** Document/statement ready (display alias for advisors: "Ready in your portal")
- **Why:** the single most common advisor portal nudge — document-ready-to-sign / statement-available — has no clean corpus home; subscription-confirmed is the nearest neutral "something updated, go look" shape.
- **Draft variants:**
  - Standard: `{{workspace_name}}: A new document is ready to review in your portal: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: Something's ready for you in your portal — take a look when you can: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: New document in your portal: {{account_link}} STOP to opt out.`
- **Status:** FUTURE — do not add to corpus until bucket changes.

**GAP:signature-required**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (advisor-specific; too narrow for a universal category)
- **Proposed universal name:** Signature requested (display alias: "Needs your signature")
- **Why:** a document specifically awaiting the client's e-signature is action-required in a way the generic "ready to review" message understates, and signature stalls are the top advisor friction point.
- **Draft variants:**
  - Standard: `{{workspace_name}}: A document needs your signature to move forward. Sign here: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: One quick thing — a document is waiting for your signature: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Signature needed: {{account_link}} STOP to opt out.`
- **Status:** FUTURE — do not add to corpus until bucket changes.

### Content constraints
- SEC/state-RIA recordkeeping (Advisers Act Rule 204-2) and FINRA Rule 4511/17a-4 require all business-related client texts be retained (5 years for RIAs; 3 for BDs), in unalterable/WORM form, searchable by sender/recipient/timestamp — RelayKit would have to be an archivable system of record, not fire-and-forget.
- FINRA Rule 3110 supervision: firms must let a supervisor review/flag advisor-client messages — supervision/oversight is an expected feature, not optional.
- No investment advice, recommendations, performance claims, or specific holdings in SMS — keep bodies to logistics (reminders, "ready in portal," confirm-this-action). Advice over SMS multiplies recordkeeping and suitability exposure.
- Gramm-Leach-Bliley: no nonpublic personal information (account numbers, balances, SSNs) in message bodies — link to the authenticated portal instead.
- Marketing/promotional SMS sits under the SEC marketing rule with full books-and-records capture — treat as off by default.
- This is a TCR Special use-case category; carrier registration scrutiny for financial services is elevated.

### Disambiguation
This looks like a generic CRM (Conditional in the B2B SaaS family), and the appointment/portal/support workflows are nearly identical — but the RIA regulatory layer is what tips it into "Not yet." Generic CRM texting carries TCPA/consent obligations; advisory texting adds SEC/FINRA recordkeeping, mandated supervision, and the marketing rule on top, none of which RelayKit currently satisfies as an archivable, supervisable system of record. The distinguishing test: if the sender is a registered investment adviser or broker-dealer and the messages are business communications, every text must be captured WORM-style and made reviewable — a different product surface than RelayKit ships today. Until RelayKit offers archiving/supervision (or integrates with an archiver like Smarsh/Redtail Speak), this stays out of the served set.

### Sources
https://www.wealthbox.com/integrations/greminders/
https://redtailtechnology.com/crm
https://redtailtechnology.com/speak
https://revisorgroup.com/top-ria-crm-software-for-financial-advisors/
https://smartasset.com/advisor-resources/text-messaging-compliance
https://www.intradyn.com/financial-advisors-text-message-archiving/
https://www.smarsh.com/blog/thought-leadership/adapting-to-change-text-message-archiving-for-financial-advisers
https://riacomptech.com/the-critical-role-of-text-message-archiving-in-modern-ria-compliance/
https://fmgsuite.com/insights/5-proven-ways-financial-advisors-can-use-texting-to-streamline-client-annual-reviews/
https://fmgsuite.com/insights/10-proven-text-message-templates-for-financial-advisors-that-drive-results/
https://www.greminders.com/solutions/financial-advisors
