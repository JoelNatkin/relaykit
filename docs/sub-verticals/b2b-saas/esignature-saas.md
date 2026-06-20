## E-signature / document workflow SaaS
**Vertical:** B2B SaaS & developer tooling
**Bucket:** Clear
**URL slug:** /for/esignature-saas

### What this builder is making
A "DocuSign-for-X" platform — embeddable e-signature and document-workflow software that lets a sender upload a document, assign one or more signers, and route it for legally-binding electronic signature. The product tracks each document's lifecycle (sent, viewed, signed by each party, completed, declined, expired) and often layers in SMS OTP signer authentication for identity assurance. Buyers are developers and product teams embedding signing into their own apps via API (PandaDoc, BoldSign, SignNow, DocuSeal), plus standalone signing tools (DocuSign, Zoho Sign, Adobe Acrobat Sign).

### Why they need SMS
The instant a document is routed for signature, it competes with a buried email inbox — and an unsigned contract stalls the deal, the onboarding, or the close behind it. SMS wins because signers prefer text 2.5x over email for important documents, the signing link opens directly in a mobile browser, and a single nudge text reliably revives a request that email reminders can't. The signing link, the expiration warning, and the OTP access code are all time-sensitive, single-action moments — exactly what SMS delivers and email loses.

### Message categories
1. account-events — the document-signing lifecycle (request sent, reminder, completed, expiring) maps cleanest onto transactional account/document-status notifications; this is the primary workflow surface.
2. verification — SMS OTP / access-code signer authentication is a first-class, widely-shipped feature (DocuSign, Zoho Sign, BoldSign, Nitro) and maps directly to the 2FA carve-out category.
3. team-alerts — sender-side "signer X just signed" / "all parties complete" notifications to the document owner fit team/status pings.
4. customer-support — signing-help and document-question follow-ups exist but are generic, not vertical-defining.

Excluded: appointments (no scheduling/provider-visit model), order-updates (no physical fulfillment), marketing (signing is transactional; promo is out of workflow), community, waitlist (no queue/membership model).

### Workflows

**Signature request and completion**
Move a document from "sent for signature" through reminders to fully executed.
Sequence:
1. account-events:subscription-confirmed — "Document ready to sign" — STRETCH: sent-for-signature is the entry moment but no corpus message frames "a document is waiting for your signature with a link."
2. account-events:trial-ending — "Signing reminder" — STRETCH: the day-before / pending-signature nudge needs a reminder-with-link frame, not a trial frame.
3. account-events:subscription-confirmed — "Signature recorded" — STRETCH: per-signer "you've signed" confirmation reuses a generic "change confirmed" frame loosely.
4. account-events:subscription-confirmed — "Document complete" — STRETCH: all-parties-executed final confirmation; same loose reuse.

Variable aliases (only where default feels wrong):
- workspace_name: "Acme Legal" (the signing platform / sender brand)
- account_link: "the signing link" (resolves to the document sign URL)

**Signer authentication (SMS OTP / access code)**
Prove the signer's phone ownership before the signature is legally applied.
Sequence:
1. verification:confirmation-code — "Access code to sign" — the OTP entered to apply a legally-binding signature is a sensitive-action confirmation, the closest existing fit.

Variable aliases (only where default feels wrong):
- business_name: "Acme Legal"

**Document expiration**
Warn the signer before an unsigned request lapses, then notify on lapse.
Sequence:
1. account-events:trial-ending — "Document expiring" — STRETCH: "expires in N days, sign now" reuses the trial-ending countdown frame; semantically near but the noun is wrong.

Variable aliases (only where default feels wrong):
- days_remaining: "2"
- account_link: "the signing link"

**Sender-side signing notifications**
Tell the document owner as each party signs and when execution completes.
Sequence:
1. team-alerts:system-alert — "Signer completed" — STRETCH: "{{signer}} just signed {{document}}" reuses a system-anomaly alert frame; status-ping shape fits, vocabulary doesn't.

### Message gaps

**GAP:signature-requested**
- **Classification:** Vertical-specific
- **Proposed corpus home:** account-events:signature-requested (or a sub-vertical registry layer if too narrow for the shared corpus)
- **Proposed universal name:** Document sent for signature | "Ready to sign"
- **Why:** The defining moment of the vertical — a document is waiting for the recipient's signature with a one-tap link — has no clean corpus home; reusing subscription-confirmed is a misframe.
- **Draft variants:**
  - Standard: `{{workspace_name}}: A document is ready for your signature. Review and sign here: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}} has a document waiting for your signature. Review and sign here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Document ready to sign. {{account_link}} STOP to opt out.`

**GAP:signature-reminder**
- **Classification:** Vertical-specific
- **Proposed corpus home:** account-events:signature-reminder (or sub-vertical registry layer)
- **Proposed universal name:** Unsigned-document reminder | "Still needs your signature"
- **Why:** The single nudge that revives a stalled request is the core reason this vertical adopts SMS; no corpus reminder fits an unsigned document with a link.
- **Draft variants:**
  - Standard: `{{workspace_name}}: A document is still waiting for your signature. Sign here: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: Just a reminder, a document still needs your signature. Sign here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Document still needs signing. {{account_link}} STOP to opt out.`

**GAP:signature-completed**
- **Classification:** Vertical-specific
- **Proposed corpus home:** account-events:signature-completed (or sub-vertical registry layer)
- **Proposed universal name:** Document fully executed | "All signed"
- **Why:** "Everyone has signed, your copy is ready" is a distinct closing moment that subscription-confirmed only loosely covers.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your document is fully signed. View the final copy here: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: All parties have signed, your document is complete. View it here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Document fully signed. View: {{account_link}} STOP to opt out.`

**STRETCH:verification:confirmation-code**
- **Classification:** Stretch
- **Proposed corpus home:** stretch: confirmation-code covers the sensitive-action OTP, but its frame is "code before a sensitive account action," not "code to legally apply your signature" — fit gap is the signing-specific framing, not the mechanism.
- **Proposed universal name:** Signing access code | "Code to sign"
- **Why:** SMS OTP signer authentication is a shipped, near-universal e-signature feature and deserves explicit signing framing rather than borrowing the account-action confirmation copy.
- **Draft variants:**
  - Standard: `{{business_name}}: Your code to sign is {{code}}. Expires in {{expiry_minutes}} minutes.`
  - Friendly: `Your {{business_name}} signing code is {{code}}, good for {{expiry_minutes}} minutes.`
  - Brief: `{{business_name}}: Signing code {{code}}`

### Content constraints
- Register the lifecycle messages under TCR ACCOUNT_NOTIFICATION; the OTP/access-code flow under the 2FA carve-out (no STOP/HELP in OTP body).
- No promotional content in any signing-lifecycle message — these are transactional document-status texts, EIN/marketing consent rules do not apply and must not be borrowed.
- Standard A2P 10DLC brand + campaign registration applies; sample messages in the campaign must match the signing use case. Since Feb 2025 all major US carriers block unregistered A2P 10DLC traffic outright.
- Signing links are time-sensitive and recipient-specific — keep one document, one link, one action per message; never bundle multiple signer links into one text.
- No legal-outcome claims (no "legally guaranteed," "court-proof"); state the action, not the assurance.

### Disambiguation
This sub-vertical is the platform that sends documents for signature, not the law firm or business that happens to use one — the RelayKit customer is the e-signature SaaS itself (its workspace_name is the sender brand the signer sees). It is distinct from contract-lifecycle-management (CLM) and document-generation tools where signing is one feature among many; here signing and its status lifecycle are the product. Note also the signer-side vs. sender-side split: most volume is signer-facing (request, reminder, OTP, completion), but a secondary sender-facing stream ("your recipient signed") maps to team-alerts, not account-events.

### Sources
https://learn.g2.com/best-esignature-software
https://www.useanvil.com/blog/digital-transformation/best-docusign-api-alternatives-2026/
https://www.turbodocx.com/blog/best-esignature-apis-2026
https://www.pandadoc.com/blog/digital-signature-workflow/
https://www.docusign.com/blog/esignature-sms-delivery
https://boldsign.com/blogs/request-esignature-via-sms-text-messages/
https://boldsign.com/blogs/enhance-your-esignature-workflow-with-customized-sms-notification-using-boldsign-api/
https://boldsign.com/sign-documents-through-sms/
https://www.zoho.com/sign/features-and-benefits/esign-sms-signing.html
https://www.esignglobal.com/blog/use-sms-otp-verify-signer-identity-authentication-methods
https://boldsign.com/blogs/signer-authentication-methods-boldsign/
https://help.twilio.com/articles/4408675845019-SMS-Compliance-and-A2P-10DLC-in-the-US
