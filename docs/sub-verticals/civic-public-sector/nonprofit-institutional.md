## Nonprofit / charity / fundraising platforms (institutional, not SaaS)
**Vertical:** Civic & public sector
**Bucket:** Conditional
**URL slug:** /for/nonprofit-institutional

### What this builder is making
A single nonprofit (a 501(c)(3), church, school, or charity) running its own donor and supporter outreach — texting people who already gave, pledged, registered for an event, or signed up to volunteer. The org tracks donations, recurring gifts, multi-installment pledges, campaigns/giving days, and events in a donor CRM (Bloomerang, DonorPerfect, Neon, Givebutter, etc.), and wants SMS to fire off the back of those records. This is institutional outreach by one organization to its own list — not a SaaS vendor selling fundraising tooling to many nonprofits.

### Why they need SMS
A donor who pledges or starts a text-to-give but never completes leaves money on the table within hours; a same-day reminder text recovers gift fulfillment at rates email cannot touch (one cited figure: 84% lift), because texts are read in minutes while donation-confirmation email sits unopened. An immediate thank-you/receipt text closes the loop the moment a gift lands, building the trust that drives the next gift. On giving days and campaign deadlines the window is hours, and SMS is the only channel fast enough to move a supporter from intent to completed gift in that span.

### Message categories
1. order-updates — best structural fit for the donation lifecycle: gift received → receipt/confirmation → recurring-gift run. The donation receipt maps to order-confirmed semantics (a transaction completed). Several donation-specific messages still need GAP/STRETCH (see gaps).
2. account-events — recurring-gift lifecycle: card-declined on a monthly gift (payment-failed), recurring gift confirmed (subscription-confirmed). Maps cleanly to sustainer billing.
3. appointments — for event-based orgs: galas, volunteer shifts, tours, donor meetings get confirmation + reminder-distant + reminder-proximate.
4. community — supporter/member stewardship: announcements, milestones, event invitations and onboarding for a membership or recurring-donor program.
5. marketing — fundraising appeals and giving-day solicitations are promotional and EIN/consent-gated; the appeal itself, plus event-invitation to opted-in supporters, lives here.
6. team-alerts — internal staff/volunteer coordination only (shift-scheduled, shift-reminder) where the org coordinates its own volunteers.
7. verification — only if the donor portal requires phone verification or 2FA; peripheral.

Excluded: customer-support (a nonprofit's donor relations isn't a ticketed support desk — no ticket lifecycle), waitlist (no queue/spot-claim dynamic in donor giving).

### Workflows

**Donation receipt / thank-you**
Fires the moment a gift is recorded, confirming receipt and thanking the donor.
Sequence:
1. [order-updates:order-confirmed] — "Gift received" — STRETCH: confirms the donation landed in place of an order; needs a donation-receipt body (see gaps).
2. [community:member-milestone] — "Giving milestone" — optional later touch when a donor crosses a cumulative-giving or anniversary milestone.
Variable aliases:
- order_number: "your gift" (a donation reference, not an order number)
- estimated_delivery: (omit — no delivery in a donation)

**Incomplete / pledged gift recovery**
A donor texted in or started text-to-give but didn't complete; a same-day nudge recovers the gift.
Sequence:
1. GAP:pledge-reminder — "Finish your gift" — sent hours after an unfulfilled pledge or abandoned text-to-give, gently nudging completion.
2. GAP:pledge-reminder — "Pledge reminder" — for multi-installment pledges, a scheduled monthly/quarterly reminder of the next installment.

**Recurring (sustainer) gift lifecycle**
Manages a monthly/recurring donor's billing the same way a subscription is managed.
Sequence:
1. [account-events:subscription-confirmed] — "Recurring gift set up" — confirms a new recurring gift or a change to one.
2. [account-events:payment-failed] — "Card declined" — the recurring gift's card was declined; update to keep the gift active.
Variable aliases:
- account_link: "your giving page"

**Campaign / giving-day update**
Keeps supporters posted on a live campaign's progress and deadline.
Sequence:
1. GAP:campaign-thermometer — "Campaign update" — progress-to-goal update during a campaign or giving day ("we're at X of $Y goal").
2. [community:community-announcement] — "Org announcement" — impact stories, results, year-end recap to the supporter base.
3. [marketing:promotional-offer] — "Fundraising appeal" — the actual solicitation/ask (matching-gift window, deadline push). MARKETING category, EIN + marketing-consent gated.
Variable aliases:
- offer: "your gift is matched 2:1 until midnight"
- offer_link: "your giving page"

**Event lifecycle (gala / volunteer day / tour)**
Confirms and reminds supporters about an event they registered for.
Sequence:
1. [appointments:confirmation] — "You're registered" — confirms event registration.
2. [appointments:reminder-distant] — "Event tomorrow" — day-before reminder.
3. [appointments:reminder-proximate] — "Starting soon" — hour-before reminder.
4. [appointments:post-appointment] — "Thanks for coming" — post-event thank-you / feedback.
Variable aliases:
- provider_name: "the {{community_name}} team" or the event name
- appointment_time: "Sat 6pm, the Annual Gala"

**Event invitation (opted-in supporters)**
Invites the supporter base to an upcoming event.
Sequence:
1. [marketing:event-invitation] — "You're invited" — invite + RSVP to opted-in audience (promotional, marketing-gated), OR
2. [community:event-invitation] — "Community event" — for a membership/community where event notices are part of the relationship rather than a solicitation.

**Supporter onboarding (new recurring donor or member)**
Welcomes and orients a new sustaining donor or member.
Sequence:
1. [community:welcome] — "Welcome" — sent when they join the giving program/community.
2. [community:first-action] — "First step" — nudge toward a first engagement.
3. [community:resource-pointer] — "Get oriented" — point to an orientation/impact resource.
4. [community:week-1-check-in] — "One week in" — check-in after a week.

**Volunteer coordination (internal)**
Coordinates the org's own volunteers around shifts.
Sequence:
1. [team-alerts:shift-scheduled] — "You're scheduled" — volunteer shift assigned.
2. [team-alerts:shift-reminder] — "Shift reminder" — ahead of the shift.
3. [team-alerts:shift-change] / [team-alerts:shift-cancellation] — "Shift changed/cancelled" — as needed.

### Message gaps

**GAP:donation-receipt** (covered via STRETCH:order-updates:order-confirmed)
- **Classification:** Vertical-specific
- **Proposed corpus home:** order-updates:donation-confirmed (donation-specific sibling of order-confirmed), or sub-vertical registry layer
- **Proposed universal name:** Donation receipt
- **Why:** order-confirmed's body ("Arrives {{estimated_delivery}}, we'll text when it ships") is nonsensical for a gift; a donation needs a receipt-shaped body naming the org and amount.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Thanks! We received your gift of {{gift_amount}}. Your receipt: {{receipt_link}} Reply STOP to opt out.`
  - Friendly: `Thank you for your {{gift_amount}} gift to {{workspace_name}}. Your receipt is here: {{receipt_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Gift of {{gift_amount}} received. Receipt: {{receipt_link}} STOP to opt out.`
- **New variables:** gift_amount: "$50"; receipt_link: "your tax receipt"

**GAP:pledge-reminder**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (donation-lifecycle), or order-updates:pledge-reminder
- **Proposed universal name:** Pledge reminder
- **Why:** no corpus message covers a committed-but-unfulfilled gift nudge; waitlist/appointments don't fit a donation commitment.
- **Draft variants:**
  - Standard: `{{workspace_name}}: A reminder about your pledge of {{gift_amount}}. Complete it here when ready: {{gift_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: just a gentle reminder of your {{gift_amount}} pledge. You can finish it here: {{gift_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Pledge of {{gift_amount}} - finish here: {{gift_link}} STOP to opt out.`
- **New variables:** gift_amount: "$100"; gift_link: "your pledge page"

**GAP:campaign-thermometer**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (campaign-progress), distinct from community:community-announcement
- **Proposed universal name:** Campaign progress update
- **Why:** announcement bodies are generic ("something new"); a thermometer update carries goal/progress numbers and a deadline, and if it asks for a gift it crosses into MARKETING.
- **Draft variants:**
  - Standard: `{{workspace_name}}: We're at {{progress_amount}} of our {{goal_amount}} goal. Follow along: {{campaign_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: great news - we've reached {{progress_amount}} toward {{goal_amount}}. See the latest: {{campaign_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{progress_amount}} of {{goal_amount}} raised. {{campaign_link}} STOP to opt out.`
- **New variables:** progress_amount: "$8,200"; goal_amount: "$10,000"; campaign_link: "the campaign page"

**STRETCH:order-updates:order-confirmed**
- **Classification:** Stretch
- **Proposed corpus home:** order-updates:order-confirmed (fit gap: order/shipping framing vs. donation receipt)
- **Proposed universal name:** Donation receipt (see GAP:donation-receipt for the donation-shaped replacement)
- **Why:** order-confirmed's delivery framing breaks for a gift; usable only with order_number → "your gift" and estimated_delivery dropped.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your gift is confirmed. View your receipt: {{receipt_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: your gift is in - thank you. Your receipt is here: {{receipt_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Gift confirmed. Receipt: {{receipt_link}} STOP to opt out.`
- **New variables:** receipt_link: "your tax receipt"

### Content constraints
- No deceptive fundraising framing — never misrepresent the charitable purpose, imply government/third-party endorsement, use a confusingly-similar name, or make false statements about how funds are used (treated as consumer-protection/charitable-solicitation violations).
- Clearly identify the sending organization in every body (sender frame {{workspace_name}}); a recipient must know which charity is texting them. Required under TCPA and carrier rules.
- 10DLC registration is mandatory — 501(c)(3) status does NOT exempt a nonprofit; register a Brand (EIN, legal entity) and use the dedicated "Charity" / nonprofit campaign type. Verified 501(c)(3)s get reduced carrier fees but the same registration obligation. As of Feb 2025, unregistered traffic is blocked.
- Fundraising appeals/solicitations are MARKETING — they require separate explicit marketing consent and live in the marketing category (EIN-gated, SHAFT-C prohibited). Consent for receipts/transactional texts does NOT transfer to appeals.
- Transactional donation messages (receipts, pledge reminders, recurring-gift billing, event/registration confirmations) carry no ask/solicitation in the body.
- Charitable-solicitation registration: most states require the org to be registered to solicit residents before sending appeals; this is the org's legal obligation, surfaced as advisory, not enforced by RelayKit.
- All bodies single GSM-7 segment, "Reply STOP to opt out." at end (Brief: "STOP to opt out."); honor opt-outs.

### Disambiguation
This entry is one nonprofit texting its own donors and supporters — distinct from a nonprofit SaaS/fundraising platform vendor (Givebutter, DonorPerfect, Tatango as software companies), which would register as the messaging provider and is a different builder profile. The line that matters here is transactional vs. fundraising appeal: a donation receipt, recurring-gift billing alert, pledge reminder, or event-registration confirmation is transactional (ACCOUNT/DELIVERY notification), but the moment a message asks for money — a giving-day push, a matching-gift deadline, a "donate now" — it becomes MARKETING, requiring separate marketing consent and the EIN gate. Event-based work overlaps appointments (galas, tours, volunteer shifts) and community (membership/recurring-donor stewardship); internal volunteer scheduling overlaps team-alerts. Neighboring civic sub-verticals include political/advocacy campaigns (different consent and carrier campaign type) and faith/religious congregations — keep those separate from secular donor fundraising.

### Sources
https://www.donorperfect.com/fundraising-software/text-message-fundraising/
https://www.eztexting.com/industries/nonprofits
https://www.funraise.org/features/text-engagement
https://www.tatango.com/blog/nonprofit-sms/
https://www.rallycorp.com/blog/donation-by-text-service-how-nonprofits-can-turn-sms-into-reliable-giving
https://donorbox.org/nonprofit-blog/text-to-give-fundraising-guide
https://www.donorperfect.com/nonprofit-technology-blog/featured/pledge-reminders/
https://astragive.com/blog/a2p-10dlc-nonprofit-compliance
https://blog.charityengine.net/sms-regulations-nonprofits
https://help.givebutter.com/en/articles/5754390-how-to-register-a-10dlc-compliant-phone-number-for-engage-sms
https://www.fransis.ai/articles/10dlc-registration-nonprofits-guide
https://www.fransis.ai/blog/tcpa-compliance-for-text-messaging-what-nonprofits-and-healthcare-organizations-must-know-in-2026
https://ceriniandassociates.com/text-to-give-compliance-guide/
https://www.rallycorp.com/blog/tcpa-compliance-for-nonprofits-how-to-use-sms-effectively-without-breaking-rules
https://www.501c3.org/the-legalities-of-text-donations-compliance-and-regulations/
https://www.councilofnonprofits.org/running-nonprofit/fundraising-and-resource-development/charitable-solicitation-registration
