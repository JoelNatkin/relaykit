## Remote online notarization (RON)

**Vertical:** Professional services
**Bucket:** Conditional
**URL slug:** /for/remote-notarization

### What this builder is making
A platform that lets a notary public verify a remote signer's identity and notarize documents over a live audio-video session, then deliver a sealed, audit-trailed document — the white-label / API-embedded RON stack behind real-estate eClosings, legal forms, and on-demand notary marketplaces (BlueNotary, Proof, NotaryCam, OneNotary class). The session bundles document upload, identity proofing (credential/ID-scan analysis plus knowledge-based authentication), the recorded video ceremony, e-signing, the notary's electronic seal, and a journaled record. The notary's commissioning state governs what's legal, so the builder is operating a regulated workflow, not just a video-call app.

### Why they need SMS
The single highest-stakes moment is "your notary is on the video call now, join" — a signing appointment is time-boxed, the notary is live and waiting, and a signer who's left email open in another tab will no-show a paid, scheduled session. SMS also carries the legitimate identity OTP that confirms phone ownership during identity proofing, and the "your notarized document is ready" delivery that closes the transaction. These are not marketing touches; each one either completes or forfeits a billable notarization.

### Message categories
1. appointments — RON sessions are scheduled, live, time-boxed appointments; the join/reminder/no-show cycle is the core revenue-protecting flow.
2. verification — true phone-ownership OTP during identity proofing (2FA carve-out), the one place a code is legitimately texted to the signer.
3. account-events — billing for the session fee (card declined on a paid notarization).
4. customer-support — ticketing when a session fails (ID rejected, KBA failed, recording dropped).
Excluded: order-updates (no physical shipment/fulfillment lifecycle), marketing (RON is transactional/on-demand; promo texting a notarization audience is both off-purpose and SHAFT-irrelevant — separate consent and EIN gate, not a fit here), community (no member/community layer), team-alerts (internal ops, not signer-facing), waitlist (sessions are scheduled, not queued).

### Workflows

**Session scheduled**
Confirms the signer's notarization appointment once a slot is booked.
Sequence:
1. appointments:confirmation — "Notarization confirmed" — confirms the signer's RON session with the named notary at the booked time, sent at booking.
Variable aliases:
- provider_name: "Notary Dana Reyes"
- appointment_time: "Thu Jun 25, 2:00 PM ET"

**Session reminder (day before)**
Reduces no-shows for a session booked in advance.
Sequence:
1. appointments:reminder-distant — "Notarization tomorrow" — reminds the signer their session is tomorrow, with a reschedule link, sent ~24h prior.
Variable aliases:
- provider_name: "Notary Dana Reyes"

**Pre-session readiness prompt**
Tells the signer to have their government ID and a quiet, well-lit space ready before the ceremony — a RON-specific failure mode (no ID on hand = session aborted).
Sequence:
1. GAP:prep-your-id-before-session — "Have your photo ID ready" — sent a few hours before the session, reminds the signer to have an unexpired government ID and stable connection ready.
Variable aliases:
- appointment_time: "today at 2:00 PM ET"

**Session starting now**
Pulls the signer into the live video ceremony at start time, the highest-no-show moment.
Sequence:
1. appointments:reminder-proximate — "Your notary is ready" — tells the signer the session starts in about an hour / is starting, with the join link, sent shortly before start.
Variable aliases:
- provider_name: "Notary Dana Reyes"

**Join now / notary waiting**
The notary is live on the call and the signer hasn't joined — a same-minute nudge to salvage the booked session.
Sequence:
1. GAP:notary-waiting-join-now — "Your notary is on the call" — sent when the notary has started the session and the signer is absent, with the join link.
Variable aliases:
- join_link is the live session URL

**Identity proofing OTP**
Confirms the signer controls the phone number as part of multi-factor identity verification (the legitimate 2FA use).
Sequence:
1. verification:verification-code — "Identity code" — sends the one-time code the signer enters to prove phone ownership during identity proofing. (No STOP/HELP in body, per 2FA carve-out.)
Variable aliases:
- business_name: the RON platform / notary brand

**Reschedule confirmation**
Confirms a moved session so the signer has the new time on their phone.
Sequence:
1. appointments:reschedule-confirmation — "Notarization rescheduled" — confirms the new session time with the notary, sent on reschedule.
Variable aliases:
- provider_name: "Notary Dana Reyes"

**Cancellation confirmation**
Confirms a cancelled session and offers to rebook.
Sequence:
1. appointments:cancellation-confirmation — "Notarization cancelled" — confirms cancellation with a rebook link.
Variable aliases:
- provider_name: "Notary Dana Reyes"

**No-show follow-up**
Recovers a forfeited session by prompting a rebook.
Sequence:
1. appointments:no-show-follow-up — "We missed you" — invites the signer to rebook the missed notarization.
Variable aliases:
- provider_name: "Notary Dana Reyes"

**Document ready**
Delivers the completed, sealed notarized document — the transaction-closing message.
Sequence:
1. GAP:notarized-document-ready — "Your notarized document is ready" — sent when the seal is applied and the record is finalized, with the secure download link.

**Identity verification failed**
Tells a signer who failed KBA or credential analysis what to do next, so a stalled session converts instead of churning.
Sequence:
1. customer-support:ticket-received — "Verification issue logged" — confirms a support ticket when identity proofing fails and the signer is blocked.
2. customer-support:resolution-notification — "Verification issue resolved" — confirms when the issue is cleared so they can rebook.

**Session fee declined**
Recovers payment on a paid notarization when the card fails.
Sequence:
1. account-events:payment-failed — "Payment didn't go through" — flags the declined card with an update link so the session/document isn't held.

### Message gaps

**GAP:prep-your-id-before-session**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** Pre-session readiness reminder (display alias "Have your photo ID ready")
- **Why:** A RON session aborts if the signer lacks an unexpired government ID and stable A/V at start — a prep prompt is specific to identity-proofed video ceremonies, not generic appointments.

**GAP:notary-waiting-join-now**
- **Classification:** Universal miss
- **Proposed corpus home:** appointments:join-now
- **Proposed universal name:** Provider is waiting — join now
- **Why:** Live-session services (RON, telehealth, tutoring) need a same-minute "the provider is on the call, join" nudge distinct from the hour-out proximate reminder.
- **Draft variants:**
  - Standard: `{{workspace_name}}: your notary is on the call and ready. Join your session now: {{join_link}} Reply STOP to opt out.`
  - Friendly: `Your notary is on the video call waiting for you. Join here: {{join_link}} Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: notary is waiting. Join: {{join_link}} STOP to opt out.`
- **New variables:** `{{join_link}}` — live audio-video session URL, ~30 chars (shortened), source: platform session record, example "ron.app/s/9f2a".

**GAP:notarized-document-ready**
- **Classification:** Universal miss
- **Proposed corpus home:** appointments:deliverable-ready (or a shared "completed deliverable" message)
- **Proposed universal name:** Your completed document is ready
- **Why:** Service workflows that produce a final downloadable artifact (notarized doc, signed contract, report) need a "your deliverable is ready" delivery message; the corpus has no completion-delivery message outside the order-shipment lifecycle.
- **Draft variants:**
  - Standard: `{{workspace_name}}: your notarized document is ready. Download it securely here: {{document_link}} Reply STOP to opt out.`
  - Friendly: `Your notarized document is all set. Grab your secure copy here: {{document_link}} Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: notarized doc ready. {{document_link}} STOP to opt out.`
- **New variables:** `{{document_link}}` — secure download URL for the sealed document, ~30 chars (shortened), source: completed notarization record, example "ron.app/d/7k1c".

### Content constraints
- RON is authorized state-by-state; the notary's commissioning state governs legality, registration, identity-proofing method, and journaling/recording rules. California's permanent statute is not effective until 2030. The developer is solely responsible for operating only where their notaries are authorized — RelayKit does not validate RON eligibility.
- Interstate validity rests on the interstate-recognition doctrine; the messaging layer makes no claim about whether a given notarization will be accepted in the signer's or document's destination state. Never imply RelayKit confers legal validity or compliance.
- The phone OTP is the only code that may be texted, and only as genuine phone-ownership/identity proofing → verification:verification-code (2FA carve-out, no STOP/HELP). Do not text KBA answers, ID images, or any identity-proofing content in the message body.
- No notarized document content, signer PII, or document images in any SMS body — link out to an authenticated, secure destination only.
- All non-OTP signer messages are transactional appointment/account notifications: keep "Reply STOP to opt out." in body; no promotional content, no review-bait dressed as completion.
- A2P 10DLC registration applies; appointment/verification/account-events flows map to ACCOUNT_NOTIFICATION / 2FA / CUSTOMER_CARE use cases, not MARKETING.

### Disambiguation
This is the remote, audio-video, identity-proofed notarization workflow — distinct from in-person mobile notary services (`/for/notary-services`, Clear), where a notary physically travels to the signer and the SMS flow is pure scheduling/ETA with no identity-proofing or KBA layer. It is also distinct from generic e-signature SaaS (DocuSign-style), where there is no commissioned notary, no live ceremony, and no state-by-state notarial authorization — an e-sign tool that does not perform notarization should not borrow RON's identity-proofing framing. What tips RON into Conditional rather than Clear is the state-by-state authorization variance and the regulated identity-proofing/recording requirements: the builder must operate only where their notaries are commissioned, and the platform must not imply legal validity. The one place that looks like generic 2FA but is load-bearing here: the identity OTP is part of a regulated identity-proofing flow, so it must be a true phone-ownership code (verification:verification-code), never a repurposed marketing or link-confirmation text.

### Sources
https://www.proof.com/blog/get-to-know-the-top-10-remote-online-notarization-platforms-in-2025
https://bluenotary.us/
https://bluenotaryonline.com/integrations
https://pronotary.com/
https://support.proof.com/hc/en-us/articles/4405266275223-Send-a-notarization-request-via-email-or-SMS
https://www.onespan.com/blog/validate-signer-identity-remote-online-notarization
https://www.notarycam.com/services/remote-online-notarization/
https://www.proplogix.com/blog/identity-proofing-for-remote-online-notarization/
https://www.proplogix.com/blog/how-does-remote-online-notarization-work/
https://onenotary.com/
https://www.proof.com/blog/is-remote-online-notarization-legal-in-all-states
https://www.crimsonseal.com/remote-online-notarization-regulations-by-state/
https://notarylive.com/blog/does-my-state-allow-remote-online-notarization
https://remotenotary.com/is-online-notarization-legal-2026/
https://www.esignglobal.com/blog/credential-analysis-remote-notarization
https://blog.enotaryoncall.com/what-is-kba-verification-in-remote-online-notarization-and-why-is-it-secure/
https://messageiq.io/blogs/10dlc-registration-sms-compliance/
https://www.securedsigning.com/support/notary-ron-introduction-script/
https://onenotary.freshdesk.com/support/solutions/articles/66000428515-id-verification-and-credential-analysis
