## Faith-based institutional administration (church, mosque, synagogue ops)
**Vertical:** Civic & public sector
**Bucket:** Conditional
**URL slug:** /for/faith-institutions

### What this builder is making
Operational software for a single congregation — a church, mosque, or synagogue — that tracks members and households, giving and pledges, service/event schedules, small groups, and volunteer (serving-team) rotations, in the mold of Planning Center, Breeze ChMS, Pushpay/Tithe.ly, or ShulCloud. The communication layer fans out from this member database: segmented announcements to the whole congregation or to specific groups (worship team, group leaders, new visitors), service and event reminders, giving acknowledgments, and visitor/care follow-up. The market spans faith traditions but the operational shape is constant — one institution, a roster of opted-in members, and recurring gatherings that drive most of the messaging.

### Why they need SMS
The make-or-break moment is the gathering: a serving-team member who forgets a Sunday/Friday/Shabbat slot leaves a gap nobody fills, and a visitor who gave their number on a connect card goes cold if follow-up waits for an email nobody opens. SMS carries the reminder and the welcome because it is read in minutes where congregational email sits at roughly 20% open. The consequence is concrete: an unfilled volunteer slot, a lost first-time guest, an event the room is empty for.

### Message categories
1. community — the spine: congregation announcements, service/event reminders and invitations, member milestones, and the visitor onboarding sequence, all under the congregation's own name as sender frame
2. appointments — for scheduled one-to-one slots a single congregation runs: pastoral/clergy meetings, baptism/conversion classes, counseling, facility/room bookings
3. team-alerts — volunteer/serving-team scheduling reframed: shift-scheduled/reminder/change/cancellation map cleanly onto serving rotations (greeters, worship, childcare, ushers)
4. marketing — only when a giving appeal or fundraising campaign goes out; promotional/solicitation content, separately consented and EIN-gated
5. account-events — thin: portal/member-account lifecycle (e.g. a member-login workspace), rarely the congregation's main use

Excluded: order-updates (no commerce/shipping), customer-support (no ticketing helpdesk), waitlist (congregations don't queue members; ticketed-event seat limits are an edge case better served by event-invitation), verification (only if the ChMS itself sends 2FA — that's the software vendor's campaign, not the congregation's).

### Workflows

**Congregation-wide announcement**
A single broadcast to the whole roster — schedule change, weather closure, leadership news.
Sequence:
1. community:community-announcement — "Announcement" — sent when there's congregation news to share, links to details
Variable aliases:
- community_name: "Grace Community Church"
- announcement_link: "the bulletin page"

**Service / weekly gathering reminder**
Reminds opted-in members ahead of the regular service or gathering.
Sequence:
1. community:event-invitation — "This week's service" — posted with the upcoming gathering, time, RSVP/details link
2. community:live-event-reminder — "Starting soon" — sent shortly before service or a livestreamed gathering begins, with the join/stream link
Variable aliases:
- event_name: "Sunday Worship" / "Jummah Prayer" / "Shabbat Service"
- join_link: "the livestream link"

**Special event lifecycle (retreat, holiday service, fundraiser gala)**
Drives RSVPs and attendance for a one-off event.
Sequence:
1. community:event-invitation — "You're invited" — announces the event with date and RSVP link
2. community:live-event-reminder — "Today" — sent shortly before the event with join/location details
Variable aliases:
- event_name: "Easter Service" / "Eid Celebration" / "High Holy Days"

**Visitor / new-member onboarding**
The connect-card follow-up sequence — the highest-value SMS workflow for a congregation.
Sequence:
1. community:welcome — "Welcome" — sent immediately when a visitor opts in via connect card
2. community:first-action — "A first step" — 24-48h later, points to a natural next step (intro, newcomer's class)
3. community:resource-pointer — "Getting oriented" — 3-5 days in, links an orientation/welcome guide
4. community:week-1-check-in — "How's it going?" — 7 days in, a personal check-in
Variable aliases:
- resource_link: "the welcome guide"

**Member milestone / care touch**
Marks a meaningful moment — membership anniversary, baptism, a milestone in a group.
Sequence:
1. community:member-milestone — "A milestone" — sent when a member reaches a congregation milestone
Variable aliases:
- milestone: "one year with us"

**Volunteer / serving-team scheduling**
Assigns and reminds serving-team members of their rotation slots; the team-alerts shift lifecycle reframed for ministry serving.
Sequence:
1. team-alerts:shift-scheduled — "You're serving" — sent when a serving slot is assigned (date, time, location, role)
2. team-alerts:shift-reminder — "Serving reminder" — ahead of the serving slot
3. team-alerts:shift-change — "Your slot moved" — when a slot is swapped or rescheduled
4. team-alerts:shift-cancellation — "Slot cancelled" — when a slot is dropped
Variable aliases:
- location: "Kids Wing" / "Main Sanctuary"
- role: "Greeter" / "Worship Vocals" / "Childcare"
- workspace_name: "Grace Community Church"

**Pastoral / clergy one-to-one scheduling**
For scheduled individual meetings a congregation books — counseling, baptism prep, conversion classes.
Sequence:
1. appointments:confirmation — "Meeting confirmed" — when the meeting is booked
2. appointments:reminder-distant — "Tomorrow" — day before
3. appointments:reminder-proximate — "In about an hour" — shortly before
4. appointments:reschedule-confirmation — "Rescheduled" — when moved
5. appointments:cancellation-confirmation — "Cancelled" — when cancelled
Variable aliases:
- provider_name: "Pastor Lee" / "Rabbi Cohen" / "Imam Hassan"

**Giving acknowledgment**
Thanks a member for a gift right after it posts — transactional, not an appeal.
Sequence:
1. GAP:giving-acknowledgment — "Gift received" — sent when a donation/tithe is recorded, confirms receipt without solicitation
Variable aliases:
- (see Message gaps)

**Giving appeal / fundraising campaign**
A solicitation to give — year-end campaign, building fund, special drive. This is MARKETING.
Sequence:
1. marketing:promotional-offer — "Give now" — opens the appeal with a giving link (separately consented audience only)
2. marketing:event-invitation — "Fundraiser" — invites to a fundraising event
Variable aliases:
- business_name: "Grace Community Church"
- offer: "Year-End Giving Campaign"
- offer_link: "the giving page"

**Prayer-request / care follow-up**
Acknowledges a submitted prayer request or care need and closes the loop.
Sequence:
1. community:moderation-update — "We're with you" — STRETCH; acknowledges a submitted request needing attention
2. community:week-1-check-in — "Checking in" — a follow-up care touch some days later
Variable aliases:
- update_link: "your prayer request"

### Message gaps

**GAP:giving-acknowledgment**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (a faith/nonprofit donation-receipt message; no clean corpus home — order-updates is commerce-shaped, account-events is billing-lifecycle-shaped)
- **Proposed universal name:** Donation acknowledgment ("Gift received")
- **Why:** a tithe/donation confirmation is transactional thanks-for-giving, distinct from a commerce receipt or a marketing appeal, and recurs across faith and nonprofit verticals
- **Draft variants:**
  - Standard: `{{community_name}}: We received your gift of {{gift_amount}}. Thank you for your generosity. Receipt: {{receipt_link}} Reply STOP to opt out.`
  - Friendly: `Thank you for your gift of {{gift_amount}} to {{community_name}}. Your receipt is here: {{receipt_link}} Reply STOP to opt out.`
  - Brief: `{{community_name}}: Gift of {{gift_amount}} received. Receipt: {{receipt_link}} STOP to opt out.`
- **New variables:** gift_amount ("$100"), receipt_link ("your giving statement")

**STRETCH:community:moderation-update**
- **Classification:** Stretch
- **Proposed corpus home:** community:moderation-update — fit gap: corpus copy frames it as "the community needs member attention" (a moderation/admin nudge), whereas a prayer-request acknowledgment is a one-to-one pastoral care touch. The structure (an update needing attention, linked) carries, but the tone is institutional rather than personal.
- **Proposed universal name:** "We're with you" (display alias for the care-acknowledgment use)
- **Why:** congregations have no dedicated care/prayer message; moderation-update is the nearest neutral acknowledgment frame
- **Draft variants:** (Stretch — reuses corpus body; no new draft required)

### Content constraints
- No dedicated "faith-based" TCR special use case exists. A congregation that is a registered 501(c)(3) routes through the Charity / 501(c)(3) Nonprofit special use case, which is vettable — external-partner verification of nonprofit status runs automatically at brand registration during 10DLC onboarding. This is the "pathway" the bucket rests on: vettable, but contingent on legitimate nonprofit registration. This is the source of the Conditional bucket.
- A congregation not registered as a 501(c)(3) (e.g. an unincorporated assembly, or one operating under a separate legal form) cannot claim the charity special use case and falls to standard use cases — lower trust score, lower throughput, higher per-message cost. Surface this distinction at onboarding.
- Nonprofits and churches are NOT broadly exempt from TCPA for SMS. Fundraising and solicitation texts are treated as marketing and require the marketing path (separate explicit consent, EIN-gated) — never send a giving appeal on a transactional community campaign.
- Giving appeals = MARKETING category. Giving acknowledgments (receipt-after-the-fact) are transactional and stay in community / the proposed donation-acknowledgment message. Keep the two strictly separated.
- Charitable-solicitation framing: a gift confirmation must not embed an ask for more; the moment a body invites further giving it crosses into the marketing path.
- All bodies carry "Reply STOP to opt out." and honor STOP/QUIT/CANCEL/END/UNSUBSCRIBE immediately (community is ACCOUNT_NOTIFICATION TCR; marketing is MARKETING TCR).
- Build SMS opt-in as an explicit, separate field on connect cards, donation forms, event registrations, and volunteer sign-ups — not bundled with the phone-number field.
- IRS written-acknowledgment rules (single cash gift ≥ $250) are a documentation requirement met by the receipt/statement link, not by SMS body content — SMS points to the record, it is not the record.

### Disambiguation
The Conditional bucket here turns entirely on the TCR Special category: a faith institution is messageable on RelayKit when it can clear the Charity / 501(c)(3) Nonprofit special use case vetting, and is not when it can't — so the gate is the congregation's nonprofit registration, not its theology. This distinguishes faith institutions from a generic community or SaaS workspace, which register as standard use cases with no charitable vetting and no donation/solicitation dimension. The bright line within the vertical is giving: an automated thank-you for a gift already made is transactional and rides the community frame, while any appeal, drive, or "please give" rides MARKETING with its own consent and EIN gate — confusing the two is the single most common compliance error in this space. The nearest neighbor is the broader nonprofit-institutional sub-vertical (secular 501(c)(3) charities), which shares the exact same special-use-case pathway and the same appeal-vs-acknowledgment split; faith institutions are a labeled instance of it, differing in sender frame ({{community_name}} = the congregation) and in the service/serving-team rhythm that drives message volume.

### Sources
https://www.planningcenter.com/
https://www.planningcenter.com/use-cases/chms
https://www.planningcenter.com/services
https://www.planningcenter.com/integrations/confirmedchurch
https://textinchurch.com/
https://textinchurch.com/messaging
https://textinchurch.com/blog-posts/the-ultimate-planning-center-texting-guide-for-churches
https://clearstream.io/
https://callhub.io/blog/church-congregation/church-texting-service/
https://www.eztexting.com/resources/church-connection-cards
https://www.funraise.org/blog/text-to-give-for-churches-the-only-tithe-guide-you-need
https://pushpay.com/product/chms-software/
https://www.shulhub.net/
https://www.shulhub.net/blog/ultimate-guide-best-synagogue-text-message-software/
https://shulware.com/shulcloud
https://support.twilio.com/hc/en-us/articles/4402972441243-Special-Use-Cases-for-A2P-10DLC
https://support.salesmate.io/hc/en-us/articles/22683068350105-Special-Use-Cases-for-A2P-10DLC
https://www.twilio.com/docs/messaging/compliance/a2p-10dlc/onboarding-for-government-and-non-profit-agencies
https://www.rallycorp.com/blog/telephone-consumer-protection-act-text-messages-a-practical-guide-for-nonprofits-in-2025
https://www.501c3.org/the-legalities-of-text-donations-compliance-and-regulations/
https://perlmanandperlman.com/texting-for-good-not-trouble-a-legal-guide-for-nonprofits/
https://www.tatango.com/blog/tcpa-nonprofit-exemption/
