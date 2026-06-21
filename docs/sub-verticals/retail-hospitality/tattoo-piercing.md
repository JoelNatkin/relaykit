## Tattoo / piercing studios
**Vertical:** Retail & hospitality
**Bucket:** Clear
**URL slug:** /for/tattoo-piercing

### What this builder is making
A studio-management and booking app for tattoo and piercing shops — modeled on Misfit, Porter, TattooClient, Tattoogenda, Bookedin, or the tattoo flavor of GlossGenius/WellnessLiving — that tracks artists, clients, multi-hour session slots, deposits, digital consent waivers, and pre-care/aftercare delivery. It runs on long, high-value appointments where a single empty 4–6 hour slot is a large unrecoverable loss, so the product centers on deposit-to-hold booking, no-show defense, and getting forms and care instructions to the client at the right moment. It shares the salon/spa appointment spine but adds two distinctive document lanes — consent/waiver delivery before the session and aftercare/healing guidance after it.

### Why they need SMS
A tattoo client who ghosts a 5-hour slot booked weeks out leaves a hole no walk-in can fill, and these clients book through Instagram DMs and reply to texts far faster than email. SMS is the only channel reliable enough to land the deposit-to-confirm link, the day-before-and-hour-before reminder ladder, and the signed-waiver-before-you-arrive nudge that keeps the chair productive. It also carries the aftercare instructions the moment the session ends and the touch-up/healing-check rebook weeks later — both moments where a missed email means a worse outcome and a lost return visit.

### Message categories
1. appointments — booking, reminder ladder, reschedule, cancel, no-show recovery, and post-visit feedback are the entire operational spine
2. waitlist — backfilling a freshly-opened multi-hour slot from an artist's waitlist is a high-value revenue-recovery loop
3. marketing — flash/guest-spot/flash-day promos are common but EIN-gated, second-campaign, opt-in only; secondary
Excluded: order-updates (no physical fulfillment), team-alerts (artist scheduling is a separate staff-comms surface, not the client product), verification (booking apps rarely SMS-2FA clients), account-events (no client billing/subscription lifecycle), community (not a community product), customer-support (handled in-shop/by DM, not ticketed)

### Workflows

**Deposit / pay-to-confirm**  GAP:deposit-required
A tattoo booking isn't held until the (usually non-refundable) deposit clears — the dominant no-show defense in this sub-vertical, not covered by the corpus confirmation.
Sequence:
1. GAP:deposit-required — "Pay your deposit to hold the slot" — sent at booking, links to pay the deposit; the slot is only held once paid
2. appointments:confirmation — "Booking confirmed" — sent once the deposit clears, names the artist and time
Variable aliases (only where the default example would feel wrong for this sub-vertical):
- provider_name: "Mara (artist)"

**Booking confirmation**
Confirms a just-made appointment so the client trusts the slot landed and knows when to show.
Sequence:
1. appointments:confirmation — "Booking confirmed" — sent immediately on booking (or once deposit clears), names the artist and session time

**Consent / waiver form delivery**  GAP:form-delivery
Gets the digital consent waiver to the client to review and e-sign before they arrive, so chair time isn't spent on paperwork — a defining pre-session lane for this sub-vertical.
Sequence:
1. GAP:form-delivery — "Sign your consent form before your session" — sent after booking confirms, links to the digital waiver to complete and sign

**Pre-care prep instructions**  GAP:pre-care-instructions
Tells the client how to prepare (eat, hydrate, sleep, no alcohol/sunburn) so the session goes well — a tattoo-specific prep lane with no corpus equivalent.
Sequence:
1. GAP:pre-care-instructions — "How to prep for your session" — sent ~24–48h before the appointment, links to pre-care guidance

**Standard reminder ladder**
The core no-show-prevention sequence for a multi-hour slot — a day-before nudge and an hour-before nudge with an easy out.
Sequence:
1. appointments:reminder-distant — "Day-before reminder" — sent ~24h out, with a reschedule/cancel link so a client who can't make it frees the slot early
2. appointments:reminder-proximate — "Same-day reminder" — sent ~1h out, final nudge to show up on time

**Reschedule confirmation**
Closes the loop when a client moves their session so they trust the new time.
Sequence:
1. appointments:reschedule-confirmation — "Reschedule confirmed" — sent when the booking moves, restates new artist and time

**Cancellation + rebook**
Acknowledges a cancellation while immediately offering the path back into the book.
Sequence:
1. appointments:cancellation-confirmation — "Cancellation confirmed" — confirms the cancel and offers a rebook link in the same message (the deposit-forfeit policy is handled in-app, not in this text)

**No-show recovery**
Recovers from a missed multi-hour slot by inviting the client straight back to rebook.
Sequence:
1. appointments:no-show-follow-up — "We missed you" — sent shortly after the missed time, warm rebook invite

**Aftercare instructions delivery**  GAP:aftercare-instructions
Sends healing/care guidance the moment the session ends so the tattoo or piercing heals well — the defining post-session lane for this sub-vertical. General care guidance, not medical/PHI content.
Sequence:
1. GAP:aftercare-instructions — "Your aftercare instructions" — sent right after the session, links to wash/moisturize/avoid-sun-and-pools care guidance

**Post-visit feedback / review request**
Turns a completed session into a review and a retention signal.
Sequence:
1. appointments:post-appointment — "How did it go?" — sent within a day or two, links to a feedback/review form

**Healing check / touch-up rebook**
Weeks after the session, checks how the piece healed and books the free/discounted touch-up before it falls off the client's radar — a tattoo-specific retention loop.
Sequence:
1. STRETCH:appointments:post-appointment — "Healing check-in" — sent ~3–4 weeks out, but reframed from a feedback request to a "how's it healing? book your touch-up" rebook nudge
2. appointments:confirmation — "Touch-up confirmed" — sent when the touch-up is booked

**Waitlist cancellation backfill**
Fills a freshly-opened multi-hour slot from an artist's waitlist before the time lapses — the highest-value SMS loop for a booked-out artist.
Sequence:
1. waitlist:your-turn — "A slot opened" — sent the moment a cancellation frees a slot the client was waiting on; links to claim it
2. waitlist:grace-expiring — "Claim window closing" — sent if unclaimed; the slot is held only briefly before moving to the next person
3. waitlist:missed — "Slot filled" — sent if the window lapses, offers to stay/rejoin the list

**General waitlist (booked-out artist)**
Manages a standing waitlist for a popular artist or guest-spot dates, independent of a same-day cancellation.
Sequence:
1. waitlist:joined — "You're on the list" — sent when the client joins the waitlist for an artist/date
2. waitlist:almost-up — "You're up soon" — sent as their turn approaches
3. waitlist:your-turn — "A slot opened" — sent when bookable, links to claim

**Flash-day / guest-spot offer (opt-in)**
Brings opted-in clients to a flash sale, guest-artist visit, or open-books announcement — marketing-consented only.
Sequence:
1. marketing:promotional-offer — "Flash day / open books" — sent to opted-in clients for a flash or open-books window
2. marketing:re-engagement — "It's been a while" — sent to a lapsed client to bring them back for new work
Variable aliases:
- business_name: "Ironside Tattoo"
- offer: "Friday the 13th flash, $50 minis"

### Message gaps

**GAP:form-delivery**
- **Classification:** Universal miss
- **Proposed corpus home:** appointments:form-delivery (sits after confirmation, before the reminder ladder, in the appointments lifecycle)
- **Proposed universal name:** Form to complete
- **Why:** pre-appointment intake/consent/waiver e-sign delivery recurs across tattoo, healthcare, salons, and any vertical that needs a signed form before the visit — broadly reusable, not tattoo-only
- **Draft variants:**
  - Standard: `{{workspace_name}}: please complete and sign your form before your appointment {{appointment_time}}: {{form_link}} Reply STOP to opt out.`
  - Friendly: `Before we see you {{appointment_time}}, please sign your form here: {{form_link}} Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: sign your form before {{appointment_time}}: {{form_link}} STOP to opt out.`
- **New variables:** `{{form_link}}` — secure link to the digital consent/intake/waiver form to review and e-sign, budget ~24 chars, source: the builder's forms/waiver system, example: `ironside.ink/form/4f2`

**GAP:pre-care-instructions**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** Prep instructions (display alias: "How to prep for your session")
- **Why:** pre-session prep guidance (eat, hydrate, no alcohol/sunburn) is specific to tattoo/piercing and a few procedure-prep verticals, not a universal appointment message

**GAP:aftercare-instructions**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** Aftercare instructions (display alias: "Your aftercare instructions")
- **Why:** post-session healing/care guidance is specific to tattoo/piercing (and adjacent body-work) verticals; it is general care guidance, not medical/PHI content, and has no universal corpus home

**GAP:deposit-required**
- **Classification:** Universal miss
- **Proposed corpus home:** appointments:deposit-required (sits before confirmation in the appointments lifecycle)
- **Proposed universal name:** Deposit required
- **Why:** deposit/pay-to-confirm is the dominant no-show defense across tattoo, salon/spa, restaurants, and any high-cost-of-no-show appointment vertical — broadly reusable (also flagged from salons-spas)
- **Draft variants:**
  - Standard: `{{workspace_name}}: please pay a deposit to confirm your appointment with {{provider_name}}, {{appointment_time}}: {{deposit_link}} Reply STOP to opt out.`
  - Friendly: `Almost booked! Pay your deposit to lock in {{provider_name}} at {{appointment_time}}: {{deposit_link}} Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: pay deposit to confirm {{appointment_time}}: {{deposit_link}} STOP to opt out.`
- **New variables:** `{{deposit_link}}` — secure link to pay the booking deposit, budget ~24 chars, source: the builder's payment/checkout system, example: `ironside.ink/dep/4f2`

**STRETCH:appointments:post-appointment**
- **Classification:** Stretch
- **Proposed corpus home:** appointments:post-appointment — fit gap: the corpus body is a feedback/review request; the healing-check use reframes it as a "how's it healing? book your touch-up" rebook nudge weeks out, so the body needs significant reframing toward rebooking rather than feedback
- **Proposed universal name:** Post-appointment follow-up
- **Why:** the timing (3–4 weeks) and intent (touch-up rebook, not same-week feedback) diverge from the corpus message's purpose
- **Draft variants:**
  - Standard: `{{workspace_name}}: how's your piece healing? When you're ready, book your touch-up here: {{reschedule_link}} Reply STOP to opt out.`
  - Friendly: `Hope your new piece is healing great! Ready for a touch-up? Book here: {{reschedule_link}} Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: healing ok? Book your touch-up: {{reschedule_link}} STOP to opt out.`

### Content constraints
- Standard A2P 10DLC carrier rules apply: TCR brand + campaign registration required, opt-out keywords honored, STOP language in every transactional body.
- Tattoo/piercing services carry no PHI or HIPAA medical-content rules — confirmations, reminders, and aftercare may freely name the artist and the work in plain text.
- Aftercare and pre-care texts are general care guidance only — keep them factual (wash, moisturize, avoid sun/pools, hydrate); do not frame as medical advice or diagnosis.
- Consent/waiver and deposit texts should link out to the form or payment page — never embed signature, card, or payment credentials in the body.
- Promotional flash/guest-spot/open-books texts require separate explicit marketing consent and run under a second (MARKETING) campaign — not the transactional appointments campaign.
- No SHAFT-C content in promos: keep tobacco/vape, alcohol, and any drug references out of message bodies even when the shop's culture or a flash-day event involves them.

### Disambiguation
This sub-vertical shares the exact appointment/no-show spine with **salons-spas** (deposit → confirm → reminder ladder → no-show recovery → rebook) and the deposit-required gap is common to both; the tattoo-specific additions are the consent/waiver form-delivery lane, the pre-care prep lane, and the aftercare/healing-check lane around a much longer, higher-deposit session. It looks adjacent to **healthcare** because it involves a consent form and "aftercare," but it stays Clear: there is no licensed medical provider, no clinical record, no PHI — aftercare here is general body-art care guidance, not medical advice, so naming the work and the artist in plain text is fine. The line would only tip toward healthcare considerations if the studio added genuinely medical procedures under clinical oversight (e.g. a tattoo-removal clinic doing laser under a physician), which is a different builder. Also distinct from **home-local-services** booking (jobs at a customer's address) and from restaurant reservations, which share the confirmation/reminder shape but lack the artist-provider, deposit-to-hold, and healing-cycle specifics.

### Sources
https://www.venue.ink/blog/how-tattoo-scheduling-software-can-transform-your-tattoo-studios-day-to-day
https://echodial.io/tattoo-piercing-studio-scheduling-software
https://www.wellnessliving.com/tattoo/software/
https://tattoogenda.com/tattoo-software/tattoo-crm/
https://tattoogenda.com/tattoo-software/sms-appointment-reminders/
https://glossgenius.com/customers/tattoo-studio-software
https://glossgenius.com/customers/tattoo-piercing-artist
https://misfit.tattoo/
https://misfit.tattoo/tattoo-consent-forms/
https://bookedin.com/blog/tattoo-booking-form-vs-consent-form/
https://tattoostudiopro.com/tattoo-booking-app/
https://tattoostudiopro.com/sms-reminders/
https://starta.one/features/sms-notifications/tattoo
https://starta.one/features/custom-sms/tattoo
https://www.goreminders.com/tattoo-text-reminder-templates
https://tattooclient.com/messages-and-dm/
https://www.getporter.io/blog/best-scheduling-apps-for-tattoo-artists
https://ewaiverpro.com/tattoo/
https://waivermaster.com/tattoo-waiver-piercing-waiver-tattoo-studio-waiver-aftercare.html
https://www.10dlc.org/en/shaft
https://www.10dlc.org/en/home/A2PConsent
