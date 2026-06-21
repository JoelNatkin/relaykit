## Nonprofit / charity / fundraising platforms (SaaS)
**Vertical:** Creator economy & community
**Bucket:** Conditional
**URL slug:** /for/nonprofit-platforms

### What this builder is making
A SaaS platform that nonprofits use to collect donations, run campaigns, and manage supporters — donation forms with one-time and recurring gifts, peer-to-peer and event fundraising pages, ticketed galas and auctions, and a donor CRM that tracks every gift, pledge, and contact. The Givebutter/Donorbox/Funraise shape: a vertical that sits between payments, events, and supporter relationship management for organizations that don't have a development department. The product's job is to move a supporter from intent to a completed gift and then keep them stewarded over time.

### Why they need SMS
The decisive fundraising moment is short-lived: a donor texts a keyword at a gala, hears an appeal during a year-end push, or signs up to volunteer — and the platform has seconds to deliver a checkout link, a receipt, or a shift reminder before attention moves on. Email loses that window (it sits unopened), and a missed receipt or unconfirmed recurring gift is a direct loss of donor trust and revenue. SMS wins because the receipt-after-gift, the day-before event reminder, and the failed-recurring-card alert all need to land in minutes, where 99% open rates and three-minute read times actually move the dollar.

### Message categories
1. account-events — recurring-gift confirmations and failed-card recovery are the churn-critical, revenue-protecting transactional messages; a lapsed monthly donor from a declined card is pure recoverable loss.
2. appointments — volunteer shift confirmations and reminders are the platform's highest-volume operational SMS; no-show volunteers are a real cost for events and programs.
3. community — campaign updates, milestone/goal announcements, and donor stewardship ("you helped us reach X") are the relationship layer that keeps supporters giving again.
4. marketing — fundraising appeals and asks are core to the vertical but are promotional, EIN-gated, and separately consent-gated; secondary because of the consent wall, not low value.
5. order-updates — donation/ticket/auction-win receipts map to the confirmation step; transactional and expected.
6. verification — phone-ownership at donor signup and step-up confirmation before changing a recurring gift or payout.
7. waitlist — event/gala capacity waitlists and limited-spot volunteer slots.
Excluded: customer-support (donor-facing help desks exist but are not where this platform's SMS value concentrates — handled by the campaign-update and stewardship flows instead), team-alerts (internal ops infrastructure, not a job this fundraising platform is built to do).

### Workflows

**Text-to-give checkout and receipt**
Turns a texted keyword at an event or in an appeal into a completed, receipted gift — the core fundraising loop.
Sequence:
1. verification:verification-code — "Donor phone verification" — confirms the texting number when a first-time donor texts the campaign keyword (no STOP/HELP, 2FA carve-out)
2. order-updates:order-confirmed — "Gift received" — STRETCH: confirms the donation went through and points to the receipt; reframes "order/arrives/ships" to a donation receipt
3. community:member-milestone — "Donor thank-you" — STRETCH: the immediate thank-you / stewardship beat after a first gift
Variable aliases (only where the default example would feel wrong):
- order_number: "your gift"
- milestone: "your first gift"

**Recurring gift lifecycle**
Keeps monthly/sustaining donors active and recovers gifts that fail silently — the highest-leverage retention flow.
Sequence:
1. account-events:subscription-confirmed — "Recurring gift confirmed" — sent when a donor starts, changes, or cancels a monthly/sustaining gift
2. account-events:payment-failed — "Recurring gift card declined" — sent when the recurring card is declined, with a link to update payment so the gift isn't lost
Variable aliases (only where the default example would feel wrong):
- account_link: "your giving settings"

**Donation tax receipt / year-end summary**
Delivers the transactional record a donor needs for tax substantiation.
Sequence:
1. order-updates:refund-processed — "Refund processed" — STRETCH: only when a gift is refunded/reversed; confirms the amount returned
2. GAP:annual-giving-summary — "Year-end giving summary" — links the donor to their annual tax-deductible giving total
Variable aliases (only where the default example would feel wrong):
- refund_amount: "$50"

**Volunteer shift coordination**
Confirms and reminds volunteers so events and programs are staffed — the platform's highest-volume operational SMS.
Sequence:
1. appointments:confirmation — "Volunteer shift confirmed" — sent when a volunteer signs up for a shift
2. appointments:reminder-distant — "Shift tomorrow" — day-before reminder with a reschedule link
3. appointments:reminder-proximate — "Shift in 1 hour" — same-day reminder before the shift
4. appointments:no-show-follow-up — "Missed shift follow-up" — re-engages a volunteer who didn't show, offers to rebook
Variable aliases (only where the default example would feel wrong):
- provider_name: "the volunteer team"
- appointment_time: "Sat 9:00 AM, food bank"

**Volunteer shift change / cancellation**
Keeps volunteers current when a shift moves or is cancelled.
Sequence:
1. appointments:reschedule-confirmation — "Shift rescheduled" — sent when a volunteer shift moves
2. appointments:cancellation-confirmation — "Shift cancelled" — sent when a shift is cancelled, with a rebook link

**Fundraising event reminders (gala / 5K / drive)**
Drives attendance and donations at a scheduled fundraising event for supporters who registered.
Sequence:
1. community:event-invitation — "Event invitation" — sent when a fundraising event is posted, with RSVP link
2. community:live-event-reminder — "Event starting soon" — sent shortly before the event begins, with a join/check-in link
Variable aliases (only where the default example would feel wrong):
- community_name: "the organization's name"
- event_name: "the Spring Gala"

**Event ticket / auction win confirmation**
Confirms a paid ticket purchase or won auction item — transactional acknowledgment of money exchanged.
Sequence:
1. order-updates:order-confirmed — "Ticket/auction confirmation" — STRETCH: confirms a paid gala ticket or auction win and points to details; reframes shipping language
Variable aliases (only where the default example would feel wrong):
- order_number: "your ticket"
- estimated_delivery: "event day"

**Event capacity waitlist**
Manages limited-seat galas or capped volunteer slots when demand exceeds supply.
Sequence:
1. waitlist:joined — "Added to waitlist" — sent when a supporter joins a full event's waitlist
2. waitlist:almost-up — "Spot opening soon" — sent as a spot approaches
3. waitlist:your-turn — "Spot available" — sent when a seat opens, with a claim link
4. waitlist:missed — "Spot expired" — sent if the spot lapses unclaimed, with a rejoin link
Variable aliases (only where the default example would feel wrong):
- workspace_name: "the organization's name"

**Campaign progress and goal updates**
Keeps opted-in supporters invested across a multi-day campaign (year-end, Giving Tuesday, capital campaign).
Sequence:
1. community:community-announcement — "Campaign update" — sent when there's campaign news (matching gift unlocked, new phase), with a link
2. community:member-milestone — "Goal reached" — STRETCH: sent when the campaign hits a goal/milestone, crediting the supporter
Variable aliases (only where the default example would feel wrong):
- community_name: "the organization's name"
- milestone: "our $50,000 goal"

**Donor onboarding / stewardship**
Welcomes and orients a first-time donor or new monthly sustainer to build the relationship past the first gift.
Sequence:
1. community:welcome — "Welcome new supporter" — sent right after a first gift or signup
2. community:resource-pointer — "Where your gift goes" — STRETCH: points to an impact/orientation page a few days later; reframes "orientation guide" to a where-your-gift-goes page
3. community:week-1-check-in — "Check-in" — a light touch a week in
Variable aliases (only where the default example would feel wrong):
- community_name: "the organization's name"
- resource_link: "the impact report link"

**Fundraising appeal (promotional)**
The direct ask — a campaign appeal to an audience that gave separate marketing consent. EIN-gated, marketing category.
Sequence:
1. marketing:promotional-offer — "Fundraising appeal" — STRETCH: the donation ask with a giving link; "offer/claim" framing must be reworded to an appeal, and all impact claims must be non-guaranteed
2. marketing:event-invitation — "Fundraiser invitation" — promotional invite to a fundraising event for an opted-in list
Variable aliases (only where the default example would feel wrong):
- business_name: "the organization's name"
- offer: "Double your gift today — every dollar matched"

### Message gaps

**STRETCH:order-updates:order-confirmed**
- **Classification:** Stretch
- **Proposed corpus home:** order-updates "Order confirmed" — fit gap is the e-commerce framing ("order," "arrives," "we'll text you when it ships") that reads wrong for a donation, ticket, or auction win
- **Proposed universal name:** Gift received / Payment confirmed
- **Why:** a donation/ticket receipt is the same transactional confirm-after-payment moment but the order-status vocabulary doesn't fit a charitable gift
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your gift of {{refund_amount}} is received. Thank you. Receipt: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Thank you for your gift to {{workspace_name}}. Your receipt is here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Gift received. Receipt: {{account_link}} STOP to opt out.`
- **New variables:** none (reuses refund_amount as the gift amount and account_link as the receipt link; a dedicated gift_amount/receipt_link pair would be cleaner if the registry adds it)

**STRETCH:community:member-milestone**
- **Classification:** Stretch
- **Proposed corpus home:** community "Member milestone" — fit gap is that the corpus message is a member-tenure milestone, not a gift thank-you or a campaign-goal credit
- **Proposed universal name:** Thank-you / Milestone reached
- **Why:** the post-gift thank-you and the "we hit our goal, thanks to you" beat are the same stewardship-recognition moment but need donation/campaign framing rather than membership-tenure framing
- **Draft variants:**
  - Standard: `{{community_name}}: Thanks to you, we reached {{milestone}}. Thank you for your support. Reply STOP to opt out.`
  - Friendly: `Because of supporters like you, {{community_name}} reached {{milestone}}. Thank you. Reply STOP to opt out.`
  - Brief: `{{community_name}}: We reached {{milestone}}. Thank you. STOP to opt out.`

**STRETCH:order-updates:refund-processed**
- **Classification:** Stretch
- **Proposed corpus home:** order-updates "Refund processed" — fits a refunded/reversed gift directly; minor "card_type/order_number" framing carries over fine
- **Proposed universal name:** Refund processed
- **Why:** refunded or reversed donations are a real (if low-volume) transactional event nonprofits must confirm
- **Draft variants:**
  - Standard: `{{workspace_name}}: A refund of {{refund_amount}} for your gift is processed to your {{card_type}}. Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: Your {{refund_amount}} gift refund is on its way back to your {{card_type}}. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{refund_amount}} refunded to your {{card_type}}. STOP to opt out.`

**GAP:annual-giving-summary**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** Year-end giving summary (display alias)
- **Why:** an annual tax-deductible giving total is a nonprofit-specific transactional artifact donors need for tax filing, with no analog in the generic corpus

**STRETCH:community:resource-pointer**
- **Classification:** Stretch
- **Proposed corpus home:** community "Resource pointer" — fit gap is "orientation guide" framing vs. a donor impact/where-your-gift-goes page
- **Proposed universal name:** Resource pointer / Impact pointer
- **Why:** the few-days-after onboarding nudge fits, but the resource a donor wants is an impact report, not a community orientation guide
- **Draft variants:**
  - Standard: `{{community_name}}: See how your gift makes a difference: {{resource_link}} Reply STOP to opt out.`
  - Friendly: `Curious where your gift to {{community_name}} goes? Here's the impact report: {{resource_link}} Reply STOP to opt out.`
  - Brief: `{{community_name}}: Where your gift goes: {{resource_link}} STOP to opt out.`

**STRETCH:marketing:promotional-offer**
- **Classification:** Stretch
- **Proposed corpus home:** marketing "Promotional offer" — fit gap is the sales "offer/claim it" vocabulary, which must become a fundraising appeal without deceptive urgency or guaranteed-impact claims
- **Proposed universal name:** Fundraising appeal
- **Why:** the direct donation ask is promotional and consent-gated like any offer, but the language must read as a charitable appeal, identify the org, and avoid guaranteed-outcome claims
- **Draft variants:**
  - Standard: `{{business_name}}: {{offer}}. Give here: {{offer_link}} Reply STOP to opt out.`
  - Friendly: `{{business_name}}: {{offer}}. You can help here: {{offer_link}} Reply STOP to opt out.`
  - Brief: `{{business_name}}: {{offer}}. Give: {{offer_link}} STOP to opt out.`

### Content constraints
- Transactional vs. promotional split is the core gate: donation receipts, recurring-gift confirmations, failed-card alerts, ticket/volunteer confirmations, and event reminders for registrants are transactional (ACCOUNT_NOTIFICATION / DELIVERY_NOTIFICATION). Fundraising appeals and asks are promotional — marketing category, EIN-gated, separate explicit consent.
- A texted keyword (text-to-give) is an opt-in only for the transactional reply (checkout link + receipt). It is NOT consent to add the donor to a newsletter or appeal list. Mixing the two is the most common way nonprofits get into TCPA trouble.
- The organization must clearly identify itself in every message body (sender frame: the org's own name). No anonymous or ambiguous-sender appeals.
- No deceptive fundraising framing: no false urgency, no implied personal relationship, no impersonation, no misrepresenting what the gift funds.
- No guaranteed-impact claims ("your $20 feeds a child for a month" stated as a guarantee). Impact language must be illustrative, not promised — consistent with the platform's no-guaranteed-outcomes rule.
- 501(c)(3) status does NOT exempt from A2P 10DLC. Brand + campaign registration is required; verified nonprofits get reduced carrier fees and a dedicated TCR Nonprofit use case, but registration is mandatory.
- SHAFT-C content prohibited in the marketing/appeal category, as with all promotional sends.
- Honor STOP/HELP on all transactional and promotional sends (verification codes are the only carve-out — no STOP/HELP in 2FA bodies).

### Disambiguation
The neighbor that tips Clear-to-Conditional is the appeal: a platform sending only receipts, recurring-gift confirmations, and registrant event reminders is essentially a Clear transactional sender, but the moment it sends the donation ask the entire entry becomes Conditional — that send is promotional, EIN-gated, and consent-gated, and it carries the deceptive-framing and guaranteed-impact rules. What looks allowed but isn't: replying to a text-to-give donor with a fundraising appeal or newsletter signup because "they texted us first" — the keyword consents only to the transactional checkout-and-receipt reply, not to ongoing solicitation. Distinguish this sub-vertical from generic community platforms (Creator-economy memberships, which sell access not tax-deductible gifts) and from political/advocacy texting (P2P political messaging has its own carrier treatment and is a separate vertical). The litmus test for a compliant send: would it survive if the donor read it as "is this organization clearly identifying itself, telling me the truth about my gift, and only contacting me for what I agreed to?"

### Sources
https://givebutter.com/
https://givebutter.com/plus/texting
https://help.givebutter.com/en/articles/5754390-how-to-register-a-10dlc-compliant-phone-number-for-engage-sms
https://donorbox.org/givebutter-vs-donorbox
https://www.funraise.org/features/text-engagement
https://www.bonterratech.com/blog/text-to-donate
https://www.tatango.com/blog/nonprofit-sms/
https://www.tatango.com/blog/text-to-give-platforms/
https://www.rallycorp.com/blog/donation-by-text-service-how-nonprofits-can-turn-sms-into-reliable-giving
https://astragive.com/blog/a2p-10dlc-nonprofit-compliance
https://www.fransis.ai/blog/tcpa-compliance-for-text-messaging-what-nonprofits-and-healthcare-organizations-must-know-in-2026
https://blog.charityengine.net/sms-regulations-nonprofits
https://perlmanandperlman.com/texting-for-good-not-trouble-a-legal-guide-for-nonprofits/
https://www.501c3.org/the-legalities-of-text-donations-compliance-and-regulations/
https://www.eztexting.com/industries/nonprofits
https://www.crowd101.com/peer-to-peer-texting/
