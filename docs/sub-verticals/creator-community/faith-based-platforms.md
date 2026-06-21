## Religious / faith-based community tools (platform SaaS)
**Vertical:** Creator economy & community
**Bucket:** Not yet, maybe not ever
**URL slug:** /for/faith-based-platforms
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.

### What this builder is making
A Planning Center-style church management platform: a modular SaaS where congregations keep a membership/people database, schedule services and events, run volunteer teams, accept online and text-to-give donations, manage groups, and follow up with first-time visitors. The product is the system of record for the congregation — attendance, giving history, group rosters, volunteer rotations, and pledge tracking all live inside it. Builders here resell or self-host the platform for one or many churches, dioceses, or ministry networks.

### Why they need SMS
The whole congregation has to know that this Sunday's service moved to a snow-day time or that the volunteer they scheduled never confirmed — and email gets ignored while a text is read within minutes. The specific failure mode: a worship volunteer who doesn't show because the reminder sat unread leaves a Sunday service understaffed, and a first-time visitor who gets no follow-up within 48 hours rarely returns. SMS wins because faith-org communication is overwhelmingly time-boxed (this service, this week's rehearsal, this giving cycle) and the audience skews toward members who do not check a portal.

### Message categories
1. community — service/event reminders, announcements, first-time-visitor onboarding, and milestones are the core of congregational outreach; `{{community_name}}` maps cleanly to the congregation's name.
2. team-alerts — volunteer scheduling (worship teams, greeters, nursery) is shift-shaped: assigned, reminded, swapped, cancelled, with reply-to-confirm semantics already present in the escalation/ACK pattern.
3. account-events — receipts and lifecycle for the donor/member's account on the platform (giving confirmation maps here as a transactional notification, not a category of its own).
4. verification — phone-ownership proof when a member registers or sets up text-to-give.
Excluded: marketing (giving *appeals* and fundraising drives are promotional/consent-gated and run into the TCR charity-exclusion problem — see Content constraints), order-updates (no physical fulfillment), appointments (pastoral 1:1 booking is a thin edge case, not a platform primitive), customer-support (platform-vendor support, not congregant-facing), waitlist (not a congregational pattern).

### Workflows

**Weekend service reminder**
Reminds the congregation of the upcoming service time and location.
Sequence:
1. community:live-event-reminder — "Service reminder" — sent the evening before or morning of, naming the service and time/location.
Variable aliases (only where the default example would feel wrong):
- event_name: "Sunday 10am service"
- join_link: "https://yourchurch.online/live" (livestream or directions)

**Event invitation & RSVP**
Invites members to a church event (small-group launch, retreat, potluck) and collects RSVP.
Sequence:
1. community:event-invitation — "Event invite" — posted when the event is published, with date and RSVP link.
2. community:live-event-reminder — "Event reminder" — sent shortly before the event begins.
Variable aliases:
- event_name: "Fall Retreat"

**Volunteer scheduling (worship/serving teams)**
Assigns, reminds, and adjusts volunteer slots for a service or ministry team, with reply-to-confirm.
Sequence:
1. team-alerts:shift-scheduled — "Serving slot scheduled" — sent when a volunteer is placed on a team for a date.
2. team-alerts:shift-reminder — "Serving reminder" — sent a day or two ahead of the serving date.
3. team-alerts:shift-change — "Serving slot changed" — sent when the slot is swapped or moved.
4. team-alerts:shift-cancellation — "Serving slot cancelled" — sent when the slot is dropped.
Variable aliases:
- role: "Worship - vocals"
- location: "Main Sanctuary"
- shift_time: "9:00am call time"

**Volunteer confirmation request**
Asks a scheduled volunteer to confirm or decline so leaders can backfill gaps.
Sequence:
1. team-alerts:escalation-ping — "Confirm your serving slot" — reuses the ACK/reply-to-claim pattern so a volunteer confirms a slot or it rolls to the next person. STRETCH: the corpus body is incident-framed ("needs attention"); a faith-org confirmation needs a serving-slot frame.
Variable aliases:
- severity: omit / not surfaced for faith use
- system_name: "Sunday worship team"

**New-member / first-time-visitor onboarding**
Welcomes a new member or first-time guest and nurtures them over the first week.
Sequence:
1. community:welcome — "Welcome" — sent immediately when a member is added or a guest checks in.
2. community:first-action — "First step" — 24-48h later, a concrete first step (intro, connect card).
3. community:resource-pointer — "Get oriented" — 3-5 days in, links the newcomer/welcome guide.
4. community:week-1-check-in — "First-week check-in" — 7 days in, a personal how's-it-going.
Variable aliases:
- resource_link: "https://yourchurch.org/im-new"

**Community announcement**
Pushes congregation-wide news that needs attention (building closure, leadership update, schedule change).
Sequence:
1. community:community-announcement — "Announcement" — sent when there's news to share.
2. community:moderation-update — "Important update" — sent when the news needs explicit member attention/action.

**Membership milestone**
Recognizes a member anniversary, baptism, or membership step.
Sequence:
1. community:member-milestone — "Milestone" — sent when the member reaches a tracked milestone.
Variable aliases:
- milestone: "1 year as a member"

**Giving receipt (text-to-give / online gift)**
Confirms a donation immediately after it processes — transactional, not an appeal.
Sequence:
1. GAP:giving-receipt — "Gift received" — sent right after a gift posts, confirming amount and linking the receipt/statement.
Variable aliases:
- (see gap below)

**Member account registration**
Verifies phone ownership when a member registers or enables text-to-give.
Sequence:
1. verification:verification-code — "Verification code" — sent when the member verifies their number.

**Prayer request acknowledgement & follow-up**
Acknowledges a submitted prayer request and follows up a few days later — the highest-trust pastoral-care moment.
Sequence:
1. GAP:prayer-request-ack — "Prayer request received" — sent when a member submits a prayer request, confirming it was received and is being prayed over.
2. community:week-1-check-in — "Care follow-up" — reused a few days later as the gentle how-are-you-doing follow-up. STRETCH on framing only; covered by the existing check-in body.

### Message gaps

**GAP:giving-receipt**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events
- **Proposed universal name:** Payment received / Gift received
- **Why:** every donation, purchase, or contribution platform needs a transactional receipt the moment money posts, and the corpus has no payment-success confirmation (only payment-*failed*).
- **Draft variants:**
  - Standard: `{{workspace_name}}: We received your gift of {{amount}}. Your receipt is here: {{receipt_link}} Reply STOP to opt out.`
  - Friendly: `Thank you — your {{amount}} gift to {{workspace_name}} came through. Receipt: {{receipt_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{amount}} gift received. Receipt: {{receipt_link}} STOP to opt out.`
- **New variables:** amount, receipt_link
- **Status:** FUTURE

**GAP:prayer-request-ack**
- **Classification:** Vertical-specific
- **Proposed corpus home:** community (faith-org extension only)
- **Proposed universal name:** (none — too faith-specific to generalize; pastoral-care acknowledgement has no clean universal analog)
- **Why:** the prayer-request lifecycle is unique to faith orgs and carries pastoral-trust weight that a generic "request received" body would flatten.
- **Status:** FUTURE

**STRETCH:team-alerts:escalation-ping**
- **Classification:** Stretch
- **Proposed corpus home:** team-alerts
- **Proposed universal name:** Confirmation request (reply-to-confirm assignment)
- **Why:** the ACK/reply-to-claim mechanic fits volunteer confirmation exactly, but the incident/severity framing ("needs attention," "{{severity}}") reads wrong for a serving slot.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Confirm your {{role}} slot on {{shift_date}}. Reply YES, or it goes to the next volunteer. Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: Can you serve as {{role}} on {{shift_date}}? Reply YES to confirm. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{role}} on {{shift_date}}? Reply YES. STOP to opt out.`
- **New variables:** none (reuses role, shift_date)
- **Status:** FUTURE

**STRETCH:community:week-1-check-in**
- **Classification:** Stretch
- **Proposed corpus home:** community
- **Proposed universal name:** Check-in / care follow-up
- **Why:** the existing first-week check-in body works verbatim as a prayer-request care follow-up; only the trigger context differs, so no new message is warranted — flagged to avoid double-counting the care moment as a separate GAP.
- **Draft variants:**
  - Standard: `{{community_name}}: just checking in — how are you doing this week? We're here if you need anything. Reply STOP to opt out.`
  - Friendly: `Thinking of you this week, {{community_name}} family. How are you doing? Reply STOP to opt out.`
  - Brief: `{{community_name}}: checking in — how are you doing? STOP to opt out.`
- **New variables:** none
- **Status:** FUTURE

### Content constraints
- TCR pathway is the blocking issue: the **Charity** use case explicitly **excludes religious organizations**, so a faith-org cannot register congregational messaging as Charity. Faith orgs typically register under a standard notification use case (or **Mixed**) — and carrier review of religious-content campaigns is a known special-category friction point with added manual scrutiny and longer timelines.
- Giving **receipts** are transactional (account-events / DELIVERY-style notification) and ride the congregation's standing relationship. Giving **appeals / fundraising drives** are promotional → marketing category, EIN-gated, separate explicit consent — and run straight into the Charity-exclusion problem above. Keep the two strictly separated.
- Volunteer scheduling maps to **team-alerts** (shift lifecycle + ACK), not community — it is operational coordination, not congregational broadcast.
- Prayer-request and pastoral-care content is **Special-category-sensitive** (reveals religious affiliation and, often, health/personal hardship). Treat as elevated-consent; never infer or share the substance of a request in an SMS body.
- All faith-org membership lists imply religious affiliation — a Special category under data-protection norms. Consent must be explicit and documented; no scraped or purchased congregation lists.
- Standard RelayKit rules still bind: single GSM-7 segment, "Reply STOP to opt out." on every transactional body (Verification carve-out: no STOP/HELP), no SHAFT-C, sender frame first.

### Disambiguation
A faith-based platform is not a generic membership/community SaaS: the giving/tithing ledger, volunteer-team rotation, and pastoral-care (prayer) workflows are first-class primitives that a Circle- or Mighty-Networks-style community tool does not model, and the audience is a geographically-bound congregation rather than an interest-based online community. It is also distinct from nonprofit fundraising platforms: a nonprofit's primary SMS motion is the donation *appeal* (marketing/consent-gated, Charity use case), whereas a faith org's primary motion is operational congregational notification (reminders, scheduling, onboarding) with giving receipts as a transactional byproduct. The TCR pathway is the reason this sits in "Not yet, maybe not ever": religious organizations are carved out of the Charity use case and land in standard/Mixed use cases where religious content draws Special-category carrier scrutiny — a registration path RelayKit does not currently shepherd. Until RelayKit can reliably guide a faith org through that pathway, the giving-appeal half of the market is effectively unservable, and even the transactional half carries elevated review risk.

### Sources
https://www.planningcenter.com/
https://www.planningcenter.com/integrations/confirmedchurch
https://www.planningcenter.com/blog/2023/08/new-automations-follow-up-with-first-time-givers
https://www.churchtrac.com/
https://www.chmeetings.com/
https://go.churchteams.com/
https://pushpay.com/blog/church-management-software-that-grows-giving-and-simplifies-volunteer-workflows/
https://help.textinchurch.com/en/articles/11125783-planning-center-text-to-give-guide
https://textinchurch.com/blog-posts/blog-how-to-automate-follow-up
https://textinchurch.com/how-it-works/messaging/automated-workflows
https://simpletexting.com/industry/text-messaging-tool-for-churches/
https://www.eztexting.com/industries/church
https://help.hustle.com/hc/en-us/articles/4408093215767-Which-TCR-campaign-use-case-should-I-choose
https://help.ecatholic.com/article/1555-what-is-a2p-10dlc-messaging
https://callhub.io/blog/compliance/10dlc-compliance/
https://www.campaignregistry.com/Assets/TCR-CSP-User-Manual_Doc_V6.pdf
https://www.501c3.org/501c3-purposes-defined-religious/
