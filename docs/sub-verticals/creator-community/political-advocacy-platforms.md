## Political / advocacy / cause-based organizing (platform SaaS)
**Vertical:** Creator economy & community
**Bucket:** Not yet, maybe not ever
**URL slug:** /for/political-advocacy-platforms
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.

### What this builder is making
This builder is shipping a multi-tenant organizing platform — an "Action Network-for-X" — where any nonprofit, union, trade association, or cause-based group can build a supporter list, fire action alerts, run petitions and pledge drives, manage events and volunteer shifts, and track advocate engagement against legislative targets. The product is the SaaS itself (NationBuilder, EveryAction, Impactive, CallHub, Muster, Quorum), not a single partisan campaign — the builder operates the infrastructure that hundreds of downstream organizations send through. SMS is one channel inside a broader engagement suite that already spans email blasts, keyword list-building, automated supporter journeys, and CRM integration.

### Why they need SMS
The defining moment is the time-critical mobilization: a bill hits the floor, a hearing is scheduled, a rally is tomorrow, and the supporter who never opens email needs to act in the next few hours. Email's open rate and latency lose that window outright, while SMS is read in minutes and lets a supporter reply a keyword to RSVP, pledge, or be patched to a legislator. The consequence of missing it is a measurable turnout shortfall on the one window that mattered.

### Message categories
1. community — the core surface: action alerts, event invitations/reminders, announcements, and supporter onboarding all map here, with `{{community_name}}` carrying the organization's own name.
2. waitlist — clean fit for event-capacity and limited-slot volunteer-shift queues (training cohorts, canvass slots, town-hall seats).
3. team-alerts — reused for volunteer shift scheduling/reminders for canvasses, phone banks, and event staffing.
4. verification — phone-ownership proof when a supporter joins via keyword or web form; no STOP/HELP body language.
Excluded: marketing (advocacy action alerts are operational/civic, not promotional EIN-gated marketing — and the platform's downstream orgs are largely nonprofits, not the marketing use case), order-updates (no commerce), customer-support (no ticketing surface), appointments (volunteer shifts route through team-alerts/waitlist, not provider-based booking), account-events (platform-tenant billing is out of scope for supporter-facing SMS).

### Workflows

**Action alert / rapid mobilization**
Time-critical call to act on a bill, hearing, or vote before a closing window.
Sequence:
1. community:community-announcement — "Action alert" — there's something the supporter must act on now; links to the action page (call your rep, sign, submit comment)
2. community:moderation-update — "Deadline reminder" — sent as the window narrows, pointing to the same action with the urgency raised
Variable aliases (only where the default example would feel wrong):
- announcement_link: "your rep's contact tool"
- update_link: "the action page"

**Petition / pledge drive via keyword**
Supporter texts a keyword to join a list, sign a petition, or take a pledge.
Sequence:
1. verification:verification-code — "Confirm to sign" — confirms phone ownership when a supporter opts in by keyword or web form (no STOP/HELP)
2. community:welcome — "You're signed on" — confirms the supporter is added and thanks them
3. GAP:petition-milestone-progress — supporter learns the petition crossed a signature threshold they helped reach

**Event mobilization (rally, town hall, day of action)**
Drive RSVPs and attendance for an in-person or virtual organizing event.
Sequence:
1. community:event-invitation — "Event invite" — new event posted, RSVP link
2. community:live-event-reminder — "Event reminder" — sent shortly before the event with the join/location link
3. waitlist:your-turn — "Seat opened" — for capacity-limited events, the supporter's held seat is now claimable
Variable aliases (only where the default example would feel wrong):
- event_name: "Statehouse Day of Action"

**Capacity-limited event / training queue**
Manage a waitlist for an oversubscribed training, briefing, or seated event.
Sequence:
1. waitlist:joined — "On the list" — supporter is queued for a full session
2. waitlist:position-update — "Moved up" — queue position advances
3. waitlist:your-turn — "Spot's open" — a seat opened; claim link
4. waitlist:grace-expiring — "Claim soon" — held spot is about to lapse
5. waitlist:missed — "Spot expired" — lapsed without action; rejoin link

**Volunteer shift coordination (canvass / phone bank)**
Schedule and remind volunteers for organizing shifts.
Sequence:
1. team-alerts:shift-scheduled — "Shift booked" — volunteer is scheduled for a canvass/phone-bank block
2. team-alerts:shift-reminder — "Shift reminder" — sent ahead of the shift
3. team-alerts:shift-change — "Shift moved" — time/location changed
4. team-alerts:shift-cancellation — "Shift cancelled" — shift called off
5. team-alerts:shift-start — "Shift starting" — check-in link at shift start
Variable aliases (only where the default example would feel wrong):
- location: "the field office"
- role: "Canvasser"

**Supporter onboarding**
Welcome and orient a newly joined supporter over the first week.
Sequence:
1. community:welcome — "Welcome" — sent immediately on join
2. community:first-action — "First step" — 24-48h later, a concrete first action
3. community:resource-pointer — "Get oriented" — 3-5 days in, orientation/resource link
4. community:week-1-check-in — "One week in" — 7 days in, check-in

**Organization announcement / engagement update**
General, non-urgent organizational news to the supporter base.
Sequence:
1. community:community-announcement — "Announcement" — news to share, with a link
2. community:member-milestone — "Milestone" — supporter recognized for an engagement milestone (actions taken, years involved)

### Message gaps

**GAP:petition-milestone-progress**
- **Classification:** Vertical-specific
- **Proposed corpus home:** community
- **Proposed universal name:** (none — vertical-specific)
- **Why:** signature/pledge-threshold progress ("we hit 10,000 signatures, you helped") is a momentum lever unique to petition/pledge organizing with no clean universal analog; member-milestone is about the individual, not the collective goal
- **Status:** FUTURE

### Content constraints
- Platform-level political SMS is gated behind the TCR Special category: the Political use case requires the Brand to be a verified 501(c)(3)/(4)/(5)/(6), or to complete a separate Political vet through Aegis Mobile or Campaign Verify (the only TCR-supported political vetting partners) — a distinct, slower pathway than a standard 10DLC brand registration.
- Partisan / electioneering content draws heightened carrier scrutiny; campaigns flagged with discrepancies see 15-30+ day delays, and processing slows further during peak election filing windows.
- A multi-tenant platform compounds the problem: it must operate a vetting pathway per downstream organization (or per campaign), not once for itself — carriers attribute content to the registered Brand/Campaign, so the platform cannot blanket-register all its tenants under one political vet.
- Prior express consent is required for autodialed political texts; STOP opt-out must be honored on every send.
- SHAFT-C content remains prohibited regardless of political status; advocacy framing does not exempt prohibited categories.
- Drafts here stay strictly factual/operational (event details, action links, shift logistics) — no partisan-advocacy persuasion copy in the SMS body, which keeps the message inside ACCOUNT_NOTIFICATION-style framing rather than the gated political content lane.

### Disambiguation
This entry is the platform SaaS — the vendor selling organizing infrastructure to many groups — not a single partisan campaign or PAC running its own get-out-the-vote program; the single-campaign partisan organizing case is a separate (and harder) profile. The nonprofit-advocacy overlap is real: many tenants are 501(c)(3)/(4) groups whose action alerts read as civic/operational, which is why community (not marketing) carries the load and why some tenants clear TCR on tax-exempt status alone. The hard gate is the political special use case: any tenant doing partisan electioneering, or any non-tax-exempt advocacy brand, must complete a Campaign Verify / Aegis Mobile political vet before sending — a pathway RelayKit does not currently operate, which is the core reason this sub-vertical sits in "Not yet, maybe not ever." A platform that resold RelayKit numbers to partisan campaigns would inherit that vetting obligation at scale, across every tenant.

### Sources
https://callhub.io/blog/advocacy/top-10-advocacy-software/
https://doublethedonation.com/advocacy-software/
https://www.capterra.com/advocacy-software/
https://www.impactive.io/solutions/peer-to-peer-texting
https://www.impactive.io/solutions/broadcast-texting
https://peerly.com/
https://www.getthru.io/p2p-thrutext
https://callhub.io/platform/peer-to-peer-texting/
https://actionnetwork.org/mobile-messaging/
https://help.actionnetwork.org/hc/en-us/articles/360042202532-Getting-started-with-mobile-messaging-and-call-campaigns
https://www.telgorithm.com/news/10dlc-faqs-for-political-software-companies
https://talkingpurple.com/political-campaign-verification-and-10dlc-registration-the-complete-2026-compliance-guide/
https://www.campaignregistry.com/Assets/TCR-CSP-User-Manual_Doc_V6.pdf
https://www.fcc.gov/consumers/guides/political-campaign-robocalls-and-robotexts-rules
https://callhub.io/blog/compliance/prohibited-messages-and-practices/
https://www.501c3.org/sms-compliance-basics/
https://www.eztexting.com/nonprofits/advocacy-text
https://callhub.io/text-messaging-nonprofit-advocacy
https://www.idealist.org/en/orgs/guide-mobilizing-volunteers-with-text-messages
https://theintercept.com/2021/04/20/att-tmobile-texting-10dlc-political-campaigns/
