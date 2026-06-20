## Legal practice tools (law-firm CRM, client intake, case management)
**Vertical:** Professional services
**Bucket:** Conditional
**URL slug:** /for/legal-practice

### What this builder is making
A practice-management or legal-CRM platform for law firms — Clio / MyCase / PracticePanther / Filevine / CosmoLex / Lawmatics / Law Ruler style — bundling client intake and lead conversion, matter/case management, a client portal, document collection and e-signature, calendaring and court-date docketing, time-billing and invoicing, and secure client messaging. The SMS recipient is the firm's own contact — a prospective client who submitted an intake form, or an existing client tied to an open matter — not the firm's billing customer: the builder sells the tool to the firm, and the firm uses it to confirm consultations, remind clients of court dates and appointments, chase documents and signatures, and push invoice notices. It is the firm communicating with its own leads and clients about logistics and status — transactional and operational, never advice and never outcome promises.

### Why they need SMS
A missed court date is a default judgment, a bench warrant, or a malpractice exposure, and the email reminder of a hearing two weeks out is the one a client never opens — a texted "you have a hearing tomorrow, here are the details" reads in seconds and is the channel firms trust for the consequence that cannot be undone. On the intake side, a personal-injury or family-law lead who fills out a form at midnight goes cold within minutes, and the firm that texts an acknowledgment first wins the matter; SMS is the only channel fast enough to catch the lead before a competitor does. The document-chase and "ready to sign" nudges keep the matter moving instead of stalling on client silence.

### Message categories
1. appointments — closest structural fit for the firm's consultation / court-date / deadline / "ready to sign" cadence; the core nudges are date-anchored client prompts (hearings, depositions, signing appointments, filing deadlines).
2. account-events — the firm-client lifecycle inside the portal and matter (intake received, e-sign requested, document request opened, invoice issued, portal access) plus the firm's own subscription to the platform builder.
3. verification — phone-ownership at client portal signup and step-up before a sensitive portal action; 2FA SMS is a documented feature of these tools.
4. customer-support — secure-message-reply and ticket-style notifications when a client messages the firm through the portal about an open matter.
Excluded: marketing (the firm's outbound lead-generation/solicitation is a separate EIN-gated consent surface and is bar-regulated solicitation — never the transactional portal flow), order-updates (no physical fulfillment; invoice/payment maps to account-events + a gap), community (no community surface), team-alerts (no on-call/incident model for the firm's clients), waitlist (no queue).

### Workflows

**Intake acknowledgment & lead follow-up**
Catch a new lead the instant they submit the intake form, before the matter goes cold or to a competitor.
Sequence:
1. GAP:intake-received — "We got your request" — sent within seconds of an intake-form submission, acknowledging receipt and naming a next step (a call or portal link), no case facts in the body.
2. appointments:confirmation — "Consultation confirmed" — when the lead books or is scheduled for an initial consultation.
Variable aliases (only where default feels wrong):
- workspace_name: "Harbor Law Group" (the firm's name as the client knows it, not the platform brand)
- provider_name: "Atty. Rivera" (the attorney or intake coordinator)

**Consultation / meeting lifecycle**
Confirm and remind for the firm's client meetings — initial consultations, strategy calls, depositions prep, signing appointments.
Sequence:
1. appointments:confirmation — "Consultation confirmed" — a client books or the firm schedules a meeting.
2. appointments:reminder-distant — "Meeting tomorrow" — day-before reminder with reschedule link.
3. appointments:reminder-proximate — "Meeting in 1 hour" — same-day proximate reminder.
4. appointments:reschedule-confirmation — "Meeting moved" — confirms a new time when the client reschedules.
5. appointments:cancellation-confirmation — "Meeting cancelled" — confirms cancellation, offers to rebook.
6. appointments:no-show-follow-up — "We missed you" — after a missed meeting, prompt to rebook.
Variable aliases (only where default feels wrong):
- workspace_name: "Harbor Law Group"
- provider_name: "Atty. Rivera" (the attorney, not a clinician)

**Court-date / hearing reminders**
Keep clients ahead of hearings, depositions, mediations, and filing deadlines — the highest-consequence nudge in the category.
Sequence:
1. appointments:reminder-distant — "Court date approaching" — STRETCH: the day-before reminder reframed to a hearing/court appearance rather than a booked appointment; neutral "your matter has a court date {{appointment_time}}" framing, portal link for details (see gaps).
2. appointments:reminder-proximate — "Court date tomorrow / today" — same-day or day-before final reminder before the appearance.
Variable aliases (only where default feels wrong):
- workspace_name: "Harbor Law Group"
- appointment_time: "Tue Jun 23, 9:00 AM" (a court date and time)
- cancel_link: "" (no cancel action — a court date is not a cancellable booking; suppress)

**Filing & deadline reminders**
Keep clients ahead of statute-of-limitations dates, response deadlines, and document-due dates the firm needs from the client.
Sequence:
1. appointments:reminder-distant — "Deadline approaching" — STRETCH: the day-before reminder reframed to a filing/response deadline rather than a booked appointment (see gaps).
2. appointments:reminder-proximate — "Deadline today" — same-day final reminder before the cutoff.
Variable aliases (only where default feels wrong):
- workspace_name: "Harbor Law Group"
- appointment_time: "Jul 1"
- cancel_link: "" (no cancel action — suppress)

**Document collection (matter chase)**
Get the records, IDs, signed releases, and source documents the firm is blocked on to move the matter forward.
Sequence:
1. GAP:document-requested — "Documents needed" — the firm opens a document request in the portal; client is texted that items are needed with a portal link (see gaps).
2. appointments:reminder-distant — "Documents due tomorrow" — STRETCH: a date-anchored "documents due {{appointment_time}}" prompt reframed from an appointment-tomorrow reminder (see gaps).
3. GAP:documents-received — "Documents received" — confirmation the uploaded items landed, closing the loop so the client stops resending (see gaps).
Variable aliases (only where default feels wrong):
- workspace_name: "Harbor Law Group"
- appointment_time: "Jun 30" (a due date, not a clock time)
- cancel_link: "" (no cancel action — suppress)

**E-signature / approval request**
Get the retainer/engagement letter, release, or settlement document signed so the matter can advance.
Sequence:
1. GAP:signature-requested — "Ready to sign" — the firm sends a document for e-signature; client is texted with the portal link, neutral framing, no document substance (see gaps).
2. appointments:reminder-distant — "Signature due tomorrow" — STRETCH: deadline-tomorrow reframing for an unsigned document approaching a cutoff (see gaps).
3. GAP:signature-completed — "Signature received" — confirmation the document was signed, so the matter advances (see gaps).
Variable aliases (only where default feels wrong):
- workspace_name: "Harbor Law Group"
- appointment_time: "Jun 28"

**Invoice / payment notice**
Tell the client an invoice or trust-replenishment request is ready and confirm payment, without putting balances or matter details in the message.
Sequence:
1. GAP:invoice-issued — "Invoice ready" — the firm issues an invoice in the portal; client is texted with a portal link to view and pay, no amount in body (see gaps).
2. GAP:payment-received — "Payment received" — confirmation the payment posted, with a receipt/portal link (see gaps).
Variable aliases (only where default feels wrong):
- workspace_name: "Harbor Law Group"

**Account / portal lifecycle**
Stand up and secure the client's portal access for the matter.
Sequence:
1. account-events:new-device-sign-in — "New sign-in" — security alert when the client portal is accessed from a new device.
2. account-events:account-suspended — "Portal access paused" — STRETCH: portal access revoked/paused (e.g., matter closed or access suspended); the generic suspended body fits but "account" reads oddly for a client portal vs. a SaaS account (see gaps).
Variable aliases (only where default feels wrong):
- workspace_name: "Harbor Law Group"

**Portal phone verification**
Prove phone ownership at client-portal signup and step up before sensitive portal actions.
Sequence:
1. verification:verification-code — "Verification code" — phone-ownership proof when the client first sets up portal access.
2. verification:confirmation-code — "Confirmation code" — step-up before a sensitive portal action (e.g., signing or a payment change).
Variable aliases (only where default feels wrong):
- business_name: "Harbor Law Group"

**Secure-message reply notification**
Tell a client their attorney or paralegal replied inside the portal, so they read it there rather than expecting case detail by text.
Sequence:
1. customer-support:agent-response — "New message in your portal" — STRETCH: a reply landed on the client's matter thread; reframe "ticket" to "message" and route the client to the portal, never carrying the message substance in SMS (see gaps).
Variable aliases (only where default feels wrong):
- workspace_name: "Harbor Law Group"
- ticket_number: "" (no ticket numbering — suppress; use "your matter" framing)

### Message gaps

**GAP:intake-received**
- **Classification:** Universal miss
- **Proposed corpus home:** customer-support:intake-received (or account-events:request-received) — a "we received your request" acknowledgment is missing across many intake/lead verticals (legal, CPA, agencies).
- **Proposed universal name:** Request received
- **Why:** the first transactional touch after a lead or client submits a form has no clean corpus home today.
- **Draft variants:**
  - Standard: `{{workspace_name}}: We got your request and will reach out shortly. View details: {{portal_link}} Reply STOP to opt out.`
  - Friendly: `Thanks for reaching out to {{workspace_name}} - we got it and will be in touch soon. {{portal_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: request received, we'll be in touch. {{portal_link}} STOP to opt out.`
- **New variables:** `{{portal_link}}` — link to the firm's client portal / status page, budget ~24 chars, source: firm portal URL, example: "hbrlaw.co/p/9f2".

**GAP:document-requested**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:document-requested
- **Proposed universal name:** Document requested
- **Why:** "we need documents from you, here's the portal link" is a near-universal portal/professional-services flow with no corpus message.
- **Draft variants:**
  - Standard: `{{workspace_name}}: We need some documents from you to move forward. Upload here: {{portal_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}} here - we need a few documents from you. Upload them anytime: {{portal_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: documents needed. Upload: {{portal_link}} STOP to opt out.`
- **New variables:** `{{portal_link}}` — as above.

**GAP:documents-received**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:documents-received
- **Proposed universal name:** Documents received
- **Why:** the close-the-loop confirmation after an upload prevents resending and has no corpus home.
- **Draft variants:**
  - Standard: `{{workspace_name}}: We received your documents. Nothing more needed for now. View: {{portal_link}} Reply STOP to opt out.`
  - Friendly: `Got your documents at {{workspace_name}} - thanks. Nothing else needed right now. {{portal_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: documents received. {{portal_link}} STOP to opt out.`
- **New variables:** `{{portal_link}}` — as above.

**GAP:signature-requested**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:signature-requested
- **Proposed universal name:** Signature requested
- **Why:** "a document is ready for your e-signature" is a core portal/e-sign flow with no corpus message.
- **Draft variants:**
  - Standard: `{{workspace_name}}: A document is ready for your signature. Review and sign: {{portal_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}} here - a document is ready for you to sign. Review it here: {{portal_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: ready to sign. {{portal_link}} STOP to opt out.`
- **New variables:** `{{portal_link}}` — as above.

**GAP:signature-completed**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:signature-completed
- **Proposed universal name:** Signature completed
- **Why:** confirming a signature landed advances the matter and has no corpus home.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your signature was received. Thanks - we'll take it from here. {{portal_link}} Reply STOP to opt out.`
  - Friendly: `Got your signature at {{workspace_name}} - all set. We'll take it from here. {{portal_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: signature received. {{portal_link}} STOP to opt out.`
- **New variables:** `{{portal_link}}` — as above.

**GAP:invoice-issued**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:invoice-issued
- **Proposed universal name:** Invoice issued
- **Why:** "an invoice is ready, view/pay in the portal" is a universal billing flow; order-updates is fulfillment-shaped and doesn't fit a service invoice.
- **Draft variants:**
  - Standard: `{{workspace_name}}: A new invoice is ready. View and pay here: {{portal_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}} here - your latest invoice is ready to view and pay: {{portal_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: invoice ready. View/pay: {{portal_link}} STOP to opt out.`
- **New variables:** `{{portal_link}}` — as above.

**GAP:payment-received**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:payment-received
- **Proposed universal name:** Payment received
- **Why:** a receipt/confirmation after a client payment has no corpus home (payment-failed exists; the success path does not).
- **Draft variants:**
  - Standard: `{{workspace_name}}: We received your payment - thank you. Receipt: {{portal_link}} Reply STOP to opt out.`
  - Friendly: `Thanks - {{workspace_name}} received your payment. Your receipt is here: {{portal_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: payment received. Receipt: {{portal_link}} STOP to opt out.`
- **New variables:** `{{portal_link}}` — as above.

**STRETCH:appointments:reminder-distant**
- **Classification:** Stretch
- **Proposed corpus home:** appointments:reminder-distant — fit gap: the corpus body is "your appointment is tomorrow" with a cancel link; court dates, filing deadlines, and document-due dates are not cancellable appointments, so the cancel/reschedule link and "appointment" noun must be suppressed or reworded.
- **Proposed universal name:** Reminder - distant (court date / deadline alias)
- **Why:** reused verbatim it implies a booking the client can cancel; a hearing or statutory deadline cannot be cancelled by reply.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Reminder - your matter has a court date {{appointment_time}}. Details: {{portal_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}} reminder - there's a court date on your matter {{appointment_time}}. Details: {{portal_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: court date {{appointment_time}}. Details: {{portal_link}} STOP to opt out.`
- **New variables:** `{{portal_link}}` — as above.

**STRETCH:account-events:account-suspended**
- **Classification:** Stretch
- **Proposed corpus home:** account-events:account-suspended — fit gap: "your account has been suspended" reads as a billing/SaaS suspension; for a client portal it's matter-closed or access-paused, and the alarming "suspended" tone is wrong for a client whose matter simply ended.
- **Proposed universal name:** Account suspended (portal-access alias)
- **Why:** the generic suspended copy implies the client did something wrong; portal access lapses are routine matter lifecycle.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Access to your portal has been paused. Questions? Reply here. {{portal_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}} here - your portal access is paused for now. Questions? Just reply. {{portal_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: portal access paused. Questions? Reply. STOP to opt out.`
- **New variables:** `{{portal_link}}` — as above.

**STRETCH:customer-support:agent-response**
- **Classification:** Stretch
- **Proposed corpus home:** customer-support:agent-response — fit gap: the corpus body is ticket-shaped ("ticket {{ticket_number}} has a reply"); a law firm's client communication is a matter thread, not a support ticket, so "ticket" framing is wrong and the message substance must stay in the portal for privilege.
- **Proposed universal name:** Agent response (portal-message alias)
- **Why:** "ticket" mis-frames attorney-client communication, and SMS must carry zero message content — only a pointer to the portal.
- **Draft variants:**
  - Standard: `{{workspace_name}}: You have a new message about your matter. Read it here: {{portal_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}} here - there's a new message on your matter waiting in the portal: {{portal_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: new message on your matter. {{portal_link}} STOP to opt out.`
- **New variables:** `{{portal_link}}` — as above.

### Content constraints
- No outcome guarantees or implications: never "we'll win," "you'll get X," "your case is strong," "we'll get you compensation," "charges dropped." Bar Rule 7.1 (false/misleading communications) and the platform's own no-guarantee rule both bar it.
- No legal advice in the body: SMS must be logistics/status only ("you have a court date," "documents needed"), never "you should accept," "do not talk to," or anything a client could act on as counsel.
- Attorney-client privilege hygiene: no case facts, charges, claims, settlement figures, dollar amounts, party names, allegations, or matter type in the body. Use neutral "your matter / your case" framing plus a portal link; the substance lives behind the link.
- No balances or amounts in invoice/payment texts — "an invoice is ready," not "you owe $4,200."
- Transactional consent only: court-date and appointment reminders, intake acknowledgments, document/signature requests, and invoice notices ride transactional consent (typically authorized in the engagement/retainer agreement). Lead-generation/solicitation texting to people who have not engaged the firm is bar-regulated solicitation and EIN-gated marketing — a separate consent surface, out of the transactional lane.
- Every transactional body carries "Reply STOP to opt out." (Brief: "STOP to opt out."); verification bodies use the 2FA carve-out (no STOP/HELP).
- Standard SMS is not encrypted and surfaces on lock screens and shared plans — another reason content stays neutral and the detail stays in the portal.
- Single GSM-7 segment, sender frame first, no credentials/bar numbers/disclaimer cruft in body.

### Disambiguation
This entry covers general-practice firms (family, PI, estate, business, criminal-defense logistics) where the messages are matter-logistics and intake acknowledgments — the clean transactional lane. Two neighboring sub-verticals are harder and should not be lumped in. Immigration document-prep / "legal forms" tools that are not law firms carry UPL (unauthorized-practice-of-law) exposure: their messaging can drift into advice-shaped "your form is approved / your status is X" content, and they lack the attorney-client engagement that anchors transactional consent — a harder bucket, not this one. Debt-collection law firms are governed by the FDCPA on top of bar rules: collection texts to consumers carry their own consent, disclosure ("this is an attempt to collect a debt"), time-of-day, and frequency rules, and a generic invoice-reminder template does not satisfy them — treat as a distinct, gated case. What looks allowed but isn't: a "good news on your case!" or "we recovered $X for you" celebratory text reads friendly but is an outcome implication and a privilege/advertising violation — keep even good news to "there's an update on your matter: {{portal_link}}."

### Sources
https://www.clio.com/features/law-firm-communications/
https://www.clio.com/blog/lawyer-texting/
https://www.clio.com/app-directory/sms-for-legal/
https://www.clio.com/blog/lawyer-advertising-rules/
https://www.heymarket.com/law-firms/
https://www.kenect.com/solution/legal
https://www.falkonsms.com/industries/law-firms-sms-marketing
https://textellent.com/blog/text-messaging-for-lawyers/
https://textbetter.com/legal-texting/
https://caretlegal.com/blog/secure-texting-for-law-firms/
https://www.okbar.org/lpt_articles/text-message-reminders-an-important-tech-tool-for-lawyers/
https://notifyre.com/us/online-sms/law
https://www.lawmatics.com/
https://www.lawruler.com/client-intake-software/
https://www.lawmatics.com/blog/6-marketing-rules-your-law-firm-cant-afford-to-break
https://talkroute.com/what-is-10dlc-and-what-law-firms-need-to-know-about-business-texting/
https://talkroute.com/business-texting-texas-law-firms-rules-for-10dlc-compliance/
https://www.lawpay.com/about/blog/create-effective-legal-invoice/
https://www.bill4time.com/blog/how-to-send-effective-invoice-reminders-at-your-law-firm/
https://www.cosmolex.com/features/secure-file-sharing-electronic-signature/
https://www.enjuris.com/personal-injury-law/lawyer-advertising-rules-regulations/
