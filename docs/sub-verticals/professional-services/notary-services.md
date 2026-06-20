## Notary services / mobile notaries (in-person)
**Vertical:** Professional services
**Bucket:** Clear
**URL slug:** /for/notary-services

### What this builder is making
Scheduling and dispatch software for mobile notaries and loan signing agents — solo operators or small signing services who travel to a signer's home, office, or hospital to witness and notarize documents. The software books appointments (direct general-notary jobs and loan-signing assignments from title/escrow companies), captures the signing address and document package, and tracks the job from booking through completion. It is appointment-led and location-led: every job has a confirmed time, a place the notary drives to, and a signer who must be present with ID.

### Why they need SMS
The signer is at a physical address waiting, and the single most expensive failure is a no-show or a wrong-address trip — a wasted drive plus a missed closing window that can blow a real-estate funding deadline. SMS is the only channel that reliably reaches a borrower minutes before the notary pulls up, confirms they're home with their ID ready, and says "I'm 10 minutes out." Email is too slow and unread in the car; a phone call interrupts and often goes to voicemail, while a text confirms presence without stopping the drive.

### Message categories
1. appointments — the core: confirmations, day-before and en-route reminders, reschedules, no-show follow-ups for every signing
2. account-events — booking-deposit / signing-fee payment failures and receipts for direct-pay general-notary clients
3. verification — phone-ownership proof at booking; identity-step-up is done in person, not over SMS
Excluded: order-updates (no physical goods shipped — the document courier handoff is internal, not a customer parcel), team-alerts (solo operators have no on-call rotation; multi-notary dispatch is a GAP, see below), community (no member community), waitlist (capacity is the notary's calendar, not a queue), customer-support (no ticketed support desk), marketing (allowed via second registration but not core to the dispatch job)

### Workflows

**Direct booking confirmation**
Locks in a general-notary appointment the moment a signer books, so both sides have the time and place in writing.
Sequence:
1. appointments:confirmation — "Booking confirmed" — confirms the signing is set for the time, naming the notary
2. verification:verification-code — "Verify your number" — only when the booking flow needs to prove phone ownership before holding the slot

**Day-before signing reminder**
Cuts no-shows by reminding the signer the night before and giving them a way to move it.
Sequence:
1. appointments:reminder-distant — "Signing tomorrow" — reminds them the signing is tomorrow with a reschedule/cancel link

**En-route / arrival ping**
Tells the signer the notary is on the way so they're home, awake, and have ID and any witnesses ready before the knock.
Sequence:
1. appointments:reminder-proximate — "Notary on the way" — STRETCH: the corpus body says "your appointment is in 1 hour" from the signer's frame; here the notary is the one traveling and the real message is "I'm en route / 10 min out." See Message gaps.
2. GAP:document-prep-checklist — "Have these ready" — optional pre-arrival note: have your government ID and any witnesses present. See Message gaps.

**Reschedule confirmation**
Confirms a moved signing in writing when the signer or the title company shifts the time.
Sequence:
1. appointments:reschedule-confirmation — "Signing moved" — confirms the new signing time with the notary's name

**Cancellation confirmation**
Closes the loop when a signing is called off and invites a rebook.
Sequence:
1. appointments:cancellation-confirmation — "Signing cancelled" — confirms the cancellation and offers a rebook link

**No-show follow-up**
Recovers a wasted trip by getting the signer to rebook after they weren't home or weren't ready.
Sequence:
1. appointments:no-show-follow-up — "We missed you" — notes the missed signing and offers to rebook

**Post-signing completion**
Tells the signer the job is done and, for general-notary clients, asks for feedback that fuels reviews.
Sequence:
1. GAP:signing-complete — "Signing complete" — confirms the documents were notarized and the package is on its way to the title company / courier. See Message gaps.
2. appointments:post-appointment — "How did it go?" — asks the direct-pay client for feedback after the signing

**Booking payment recovery (direct-pay clients)**
Recovers a failed signing-fee or deposit charge for notaries who collect payment directly rather than billing a title company.
Sequence:
1. account-events:payment-failed — "Payment didn't go through" — card on the booking was declined; update it to hold the appointment

Variable aliases (used across the workflows above where the default example would read wrong for a notary):
- provider_name: "your notary, Dana"
- appointment_time: "Thu 2:00 PM, your home address"
- feedback_link: "your Google review link"

### Message gaps

**STRETCH:appointments:reminder-proximate**
- **Classification:** Stretch
- **Proposed corpus home:** appointments:reminder-proximate (the existing proximate reminder) — fit gap: the corpus frames the proximate reminder from the signer's point of view ("your appointment is in 1 hour"), but in mobile notary the defining fact is that the *provider is traveling to the signer*, so the natural message is "I'm en route, ~10 min out." The existing message works as a time reminder but loses the en-route signal that is the whole point here.
- **Proposed universal name:** Provider en route
- **Why:** the traveling-provider arrival ping is the highest-value notary text and the proximate reminder doesn't carry the "on my way" meaning
- **Draft variants:**
  - Standard: `{{workspace_name}}: your notary {{provider_name}} is on the way, about {{eta}} out. Please have your ID ready. Reply STOP to opt out.`
  - Friendly: `On my way! {{provider_name}} will be there in about {{eta}}. Have your ID handy. Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: {{provider_name}} en route, ~{{eta}} out. STOP to opt out.`
- **New variables:** `{{eta}}` — minutes until the notary arrives, budget ~8 chars, source: live drive-time estimate, example: "10 min"

**GAP:document-prep-checklist**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (notary services)
- **Proposed universal name:** Have these ready (display alias)
- **Why:** a signing fails if the signer lacks valid ID or required witnesses, so a pre-arrival readiness nudge is specific to in-person notarization

**GAP:signing-complete**
- **Classification:** Universal miss
- **Proposed corpus home:** appointments:service-complete
- **Proposed universal name:** Service complete
- **Why:** many appointment-led, travel-to-client trades (notary, mobile mechanic, home inspector) need a "the job is done" confirmation that post-appointment feedback request doesn't cover
- **Draft variants:**
  - Standard: `{{workspace_name}}: your signing with {{provider_name}} is complete and your documents are on the way. Reply STOP to opt out.`
  - Friendly: `All done! {{provider_name}} finished your signing and the package is on its way. Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: signing complete, documents sent. STOP to opt out.`

### Content constraints
- Standard carrier rules apply; mobile notary signing/confirmation texts are routine transactional appointment messages (TCR ACCOUNT_NOTIFICATION) and carry no vertical-specific carrier restrictions.
- Never put document contents, signer SSNs, loan/account numbers, or notarial certificate details in the body — these are sensitive and unnecessary; link to a secure source instead.
- Keep notary-public credential/commission numbers out of the message body.
- Direct-pay fee-collection texts that quote a price are still transactional (the booking receipt), not marketing; any standalone promotional blast (discounts, "book your next signing") requires the separate marketing registration and explicit marketing consent.
- Quiet-hours and state consent rules apply as with any appointment business; honor STOP on every body except verification codes.

### Disambiguation
This row is IN-PERSON mobile notary work: the notary physically travels to the signer, so the workflows live in the appointment/dispatch lane (book → confirm → en route → complete). Do not conflate it with Remote Online Notarization (RON), where the signing happens over video and the signer is verified electronically — RON carries state-by-state authorization variance (not every state permits it, and platform/identity-proofing rules differ), which makes RON its own consideration outside this Clear bucket; an RON-only platform should not inherit these travel-and-arrival workflows. A neighboring sub-vertical is the loan-signing *marketplace/signing service* (e.g. dispatch to a network of notaries) — that adds a team-alerts dispatch layer (assigning a job to a notary, accept/decline) that the solo-notary case here doesn't need. What looks allowed but isn't: texting loan or borrower account details "to be helpful" — that signing-package data is sensitive and belongs behind a link, not in the SMS body.

### Sources
https://closewise.com/how-notary-scheduling-software-saves-time-for-loan-signing-agents/
https://www.snapdocs.com/notaries
https://www.snapdocs.com/scheduling-platform-for-signing-services
https://notarystyle.com/blog/best-mobile-notary-scheduling-and-booking-software
https://arrively.app/blog/best-scheduling-apps-for-mobile-notaries
http://blog.123notary.com/?p=24992
https://www.closewise.com/top-5-notary-signing-agent-platforms/
https://closewise.com/prepare-for-first-loan-signing/
https://www.superiornotaryservices.com/services/mobile-notary-loan-signing/
https://www.apptoto.com/best-practices/sms-appointment-reminders
https://www.textrequest.com/insights/sms-appointment-reminders-ultimate-guide
https://telnyx.com/resources/sms-compliance
https://textbolt.com/blog/10dlc-compliance/
https://www.infobip.com/blog/tcpa-compliance-sms
