## Salons / spas / personal grooming
**Vertical:** Retail & hospitality
**Bucket:** Clear
**URL slug:** /for/salons-spas

### What this builder is making
A booking-and-management app for appointment-driven grooming businesses — hair salons, nail bars, barbershops, day spas, lash/brow studios, waxing, massage — modeled on Vagaro, Fresha, GlossGenius, or Booksy. It tracks clients, stylists/providers, service menus, online bookings, deposits, and a busy chair-utilization calendar where an empty slot is lost revenue. The product lives or dies on filling and protecting appointments: confirmations, reminders, no-show recovery, waitlist backfill, and rebooking.

### Why they need SMS
A no-show on a 90-minute color appointment is an unrecoverable hour of a stylist's day, and these clients book weeks out and reply to texts far faster than email. SMS reminders cut no-shows materially (operators cite double-digit attendance gains), and when a slot does open, the only channel fast enough to backfill it from the waitlist before the time passes is text. SMS also drives the post-visit review and the rebook that turns a one-time client into a standing 6-week cadence.

### Message categories
1. appointments — booking, reminder, reschedule, cancel, no-show recovery, and post-visit feedback are the entire operational spine of this builder
2. waitlist — cancellation-backfill ("a slot opened, claim it") is a core revenue-recovery loop for fully-booked stylists
3. marketing — promo/re-engagement texts are common but EIN-gated and second-campaign (slow rebookers, seasonal offers); secondary, opt-in only
Excluded: order-updates (no physical fulfillment), team-alerts (staff scheduling exists but is a separate staff-comms surface, not the client product), verification (booking apps rarely SMS-2FA clients), account-events (no client billing/subscription lifecycle), community (not a community product), customer-support (handled in-chair/by phone, not ticketed)

### Workflows

**Booking confirmation**
Confirms a just-made appointment so the client trusts it landed and knows when to show.
Sequence:
1. appointments:confirmation — "Booking confirmed" — sent immediately on booking, names the stylist and time

**Standard reminder ladder**
The core no-show-prevention sequence — a day-before nudge and an hour-before nudge with an easy out.
Sequence:
1. appointments:reminder-distant — "Day-before reminder" — sent ~24h out, with a reschedule/cancel link so a client who can't make it frees the chair early
2. appointments:reminder-proximate — "Same-day reminder" — sent ~1h out, final nudge to show up on time

**Reschedule confirmation**
Closes the loop when a client moves their appointment so they trust the new time.
Sequence:
1. appointments:reschedule-confirmation — "Reschedule confirmed" — sent when the booking moves, restates new stylist and time

**Cancellation + rebook**
Acknowledges a cancellation while immediately offering the path back into the book.
Sequence:
1. appointments:cancellation-confirmation — "Cancellation confirmed" — confirms the cancel and offers a rebook link in the same message

**No-show recovery**
Recovers revenue from a missed slot by inviting the client straight back to rebook.
Sequence:
1. appointments:no-show-follow-up — "We missed you" — sent shortly after the missed time, warm rebook invite (the no-show fee itself is applied in-app, not in this text)

**Post-visit feedback / review request**
Turns a completed service into a review and a retention signal.
Sequence:
1. appointments:post-appointment — "How was your visit?" — sent within a day or two, links to a feedback/review form

**Waitlist cancellation backfill**
Fills a freshly-opened slot from the waitlist before the time lapses — the highest-value SMS loop for a fully-booked stylist.
Sequence:
1. waitlist:your-turn — "A slot opened" — sent the moment a cancellation frees a slot the client was waiting on; links to claim it
2. waitlist:grace-expiring — "Claim window closing" — sent if the client hasn't claimed; the slot is only held briefly before moving to the next person
3. waitlist:missed — "Slot filled" — sent if the window lapses, offers to stay/rejoin the list
Variable aliases (only where the default example would feel wrong for this sub-vertical):
- claim_link: "book.glowstudio.com/claim/4f2"

**General waitlist (fully-booked stylist)**
Manages a standing waitlist for a popular stylist or peak time, independent of a same-day cancellation.
Sequence:
1. waitlist:joined — "You're on the list" — sent when the client joins the waitlist for a stylist/time
2. waitlist:almost-up — "You're up soon" — sent as their turn approaches
3. waitlist:your-turn — "A slot opened" — sent when bookable, links to claim

**Deposit / pay-to-confirm**  GAP:deposit-required
The booking isn't held until the client pays a deposit — a near-universal no-show defense in this sub-vertical that the corpus appointments confirmation doesn't cover.
Sequence:
1. GAP:deposit-required — "Pay to confirm your booking" — sent at booking, links to pay a deposit; the slot is only held once paid
2. appointments:confirmation — "Booking confirmed" — sent once the deposit clears

**Seasonal / re-engagement offer (opt-in)**
Brings lapsed clients back on the chair cadence with a promo — marketing-consented only.
Sequence:
1. marketing:re-engagement — "It's been a while" — sent to a client past their usual rebook window
2. marketing:promotional-offer — "Seasonal offer" — sent to opted-in clients for a sale window
Variable aliases:
- business_name: "Glow Studio"

### Message gaps

**GAP:deposit-required**
- **Classification:** Universal miss
- **Proposed corpus home:** appointments:deposit-required (sits before confirmation in the appointments lifecycle)
- **Proposed universal name:** Deposit required
- **Why:** deposit/pay-to-confirm is the dominant no-show defense across salon/spa booking tools and recurs in restaurants, tattoo, and any high-cost-of-no-show appointment vertical — broadly reusable, not salon-only
- **Draft variants:**
  - Standard: `{{workspace_name}}: please pay a deposit to confirm your appointment with {{provider_name}}, {{appointment_time}}: {{deposit_link}} Reply STOP to opt out.`
  - Friendly: `Almost booked! Pay your deposit to lock in {{provider_name}} at {{appointment_time}}: {{deposit_link}} Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: pay deposit to confirm {{appointment_time}}: {{deposit_link}} STOP to opt out.`
- **New variables:** `{{deposit_link}}` — secure link to pay the booking deposit, budget ~24 chars, source: the builder's payment/checkout system, example: `book.glowstudio.com/dep/4f2`

### Content constraints
- Standard A2P 10DLC carrier rules apply: TCR registration required, opt-out keywords honored, STOP language in every transactional body.
- Cosmetic/grooming services carry no PHI or medical-content rules — confirmations and reminders may freely name the service (e.g. "balayage," "deep-tissue massage") and the provider.
- Promotional/seasonal texts require separate explicit marketing consent and run under a second (MARKETING) campaign — not the transactional appointments campaign.
- No SHAFT-C content in promos (some spa promos drift toward wellness/CBD claims — keep those out of the message body).
- Deposit/no-show-fee texts may reference the charge but should link out to pay; don't embed card or payment credentials in the body.

### Disambiguation
This sub-vertical shares the exact appointment/no-show pattern with **healthcare-admin** (booking → reminder → no-show recovery → rebook), but it carries NO PHI or medical-content rules because the service is cosmetic/grooming, not medical — naming the service and provider in plain text is fine here and is not fine there. The line tips when the business is a **med-spa** offering medical/aesthetic procedures (Botox, fillers, laser, anything under medical oversight): once a licensed medical provider and clinical records are involved, the practice can become a HIPAA covered entity and the booking texts inherit the healthcare considerations — that builder should be routed toward the healthcare guidance, not this one. Pure aesthetic services (facials, waxing, massage, nails, hair) stay Clear. Also distinct from **home-local-services** booking (mobile/at-a-customer's-address jobs) and from restaurant **reservations**, which share confirmation/reminder shape but lack the stylist-provider and rebook-cadence specifics.

### Sources
https://thesalonbusiness.com/best-salon-software/
https://www.fresha.com/for-business/salon
https://www.zenoti.com/thecheckin/best-salon-software-for-small-salons
https://glossgenius.com/blog/appointment-booking-apps
https://www.zenoti.com/thecheckin/sms-salon-spa-medspa-messages
https://www.eztexting.com/industries/salons-spas
https://sakari.io/blog/salon-sms-marketing-the-complete-playbook-from-appointment-reminders-to-rebook-automation
https://blog.miosalon.com/text-messages-automate-on-your-salon-software/
https://capacity.com/salon-sms-software/
https://glossgenius.com/blog/salon-deposit-policy
https://www.schedulicity.com/essentials/blog/deposits-for-hair-appointment-service/
https://biz.booksy.com/en-us/blog/no-show-policy-tips
https://www.10dlc.org/en/home/A2PConsent
https://textdrip.com/sms-for-salon-spa
https://www.zenoti.com/thecheckin/hipaa-compliance-medspas
https://fjlawgroup.com/news/med-spa-compliance-hipaa-considerations/
https://www.consentz.com/do-botox-and-filler-clinics-need-to-be-hipaa-compliant/
