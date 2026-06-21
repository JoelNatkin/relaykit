## Membership / community platforms (Circle/Mighty Networks style)
**Vertical:** Creator economy & community
**Bucket:** Clear
**URL slug:** /for/membership-communities

### What this builder is making
A SaaS platform that lets a creator, coach, or brand run a paid online community — organized into spaces/channels with discussion threads, courses, live events, a member directory, and gamification (milestones, streaks, challenges). The builder hosts many independent communities, each with its own name, members, content, and subscription billing handled through the platform. The core jobs are member onboarding, engagement (events, posts, milestones), moderation, and recurring membership payments.

### Why they need SMS
A community member who installed the app three weeks ago never opens it again, and a missed live event or a lapsed membership payment is silent churn the creator never sees coming. Push notifications get muted and onboarding emails get buried, but a text minutes before a live AMA starts, or a "your card was declined" the day the membership lapses, lands. SMS is the one channel that reliably pulls a quiet member back into the community at the exact moment engagement or revenue is at stake.

### Message categories
1. community — onboarding sequence, live event reminders, milestones, moderation, and announcements are the primary engagement and retention jobs the platform exists to drive.
2. account-events — paid memberships run on recurring subscriptions, so payment-failed, trial-ending, and renewal messages are churn-critical for the creator's revenue.
3. verification — phone-ownership proof at signup and SMS 2FA for member accounts.
Excluded: appointments (1:1 coaching booking is an adjacent tool, not the community platform's core — events are group, not appointment, shaped), order-updates (no physical fulfillment), customer-support (members get peer/creator help in-community, not a ticketing desk), marketing (promotional blasts to the creator's own list are a separate consent lane; the platform's member messaging is transactional engagement), team-alerts (no ops/on-call surface), waitlist (cohort/launch waitlists exist but are a thin edge case, not a platform-defining flow).

### Workflows

**New member onboarding**
Walks a brand-new member from joining through their first week so they actually activate instead of going dark.
Sequence:
1. community:welcome — "Welcome to the community" — sent the instant a member joins.
2. community:first-action — "Introduce yourself" — 24-48h later, nudges them to post in the intros channel.
3. community:resource-pointer — "Orientation guide" — 3-5 days in, points to the getting-started guide.
4. community:week-1-check-in — "One week in" — day 7, asks how it's going to surface drop-off.
Variable aliases:
- resource_link: "https://acme.community/start"

**Live event reminder**
Drives turnout to scheduled live events (AMAs, workshops, calls) — the moments push notifications routinely miss.
Sequence:
1. community:event-invitation — "New event - RSVP" — sent when a new event is posted to the calendar.
2. community:live-event-reminder — "Starts soon - join" — sent shortly before the event goes live, with the join link.
Variable aliases:
- event_name: "Live AMA with the founder"
- join_link: "https://acme.community/live"

**Member milestone**
Celebrates streaks, anniversaries, and participation milestones to reinforce belonging and retention.
Sequence:
1. community:member-milestone — "You've reached a milestone" — fires when a member hits a streak, post count, or membership anniversary.
Variable aliases:
- milestone: "your 30-day streak"

**Community announcement**
Pushes important non-event community news (new space, schedule change, content drop) to members who've gone quiet.
Sequence:
1. community:community-announcement — "Something new in the community" — sent when the creator publishes news.
Variable aliases:
- announcement_link: "https://acme.community/news"

**Moderation / attention required**
Flags a member when something needs their attention — a flagged post, a guideline reminder, a required acknowledgment.
Sequence:
1. community:moderation-update — "Important community update" — sent when the community needs a specific member's attention.
Variable aliases:
- update_link: "https://acme.community/notices"

**Membership payment recovery**
Recovers a lapsing paid membership before the member silently loses access and churns.
Sequence:
1. account-events:trial-ending — "Your trial ends soon" — a few days before a free trial converts, prompts plan selection.
2. account-events:payment-failed — "Card declined" — sent when the membership renewal card fails.
3. account-events:subscription-confirmed — "Subscription updated" — confirms once payment is fixed or a plan change goes through.
Variable aliases:
- account_link: "https://acme.community/billing"

**Membership account security**
Protects member accounts at signup and on suspicious access.
Sequence:
1. verification:verification-code — "Verification code" — proves phone ownership at signup.
2. account-events:new-device-sign-in — "New sign-in" — alerts the member to access from an unrecognized device.
Variable aliases:
- device_context: "a new device in Austin, TX"

**Member login (SMS 2FA)**
Lets members sign in with SMS as a second factor.
Sequence:
1. verification:login-code — "Sign-in code" — sent when a member logs in with SMS 2FA enabled.

### Message gaps
None. All workflow moments map cleanly to existing corpus messages.

### Content constraints
- Member engagement and onboarding messages register as ACCOUNT_NOTIFICATION (transactional), not MARKETING — keep them about the member's own activity, events, and account; no promotional offers in these bodies.
- Promotional blasts (sales on the membership, upsells, affiliate pushes) to the creator's broader list are a separate MARKETING campaign with its own explicit consent — do not mix them into the community/account-events lane.
- Sender frame for community messages is the community's own name ({{community_name}}), not the platform's name — the member opted into "Acme Community," not the SaaS.
- Standard A2P 10DLC applies: brand + campaign registration, published SMS terms with frequency/HELP/STOP disclosures, and proof of opt-in at the point a member adds their number.
- Verification messages carry no STOP/HELP language (2FA carve-out).

### Disambiguation
The platform builder (the SaaS, e.g. a Circle-for-X) is the RelayKit customer and the {{workspace_name}}/{{business_name}} for billing and verification; the individual hosted community is the {{community_name}} that appears in member-facing bodies — keep these distinct in every message. A pure online-course platform (LMS) leans toward course-progress and account-events messaging with a thinner community surface, while a true membership/community platform is engagement-first, which is why the community category dominates here. This stays Clear as long as messages are transactional member-activity notifications; it tips toward Conditional (separate marketing consent + EIN gate) the moment the builder wants to send promotional or win-back-with-an-offer texts to opted-in lists. A neighboring "creator newsletter/audience" tool that texts promotional content to a fan list is a marketing-first profile, not this transactional engagement profile.

### Sources
https://circle.so/compare/vs-mighty-networks
https://www.mightynetworks.com/resources/circle-vs-mighty-networks
https://linodash.com/community-platforms/
https://www.outseta.com/posts/best-membership-management-software
https://circle.so/blog/best-membership-platforms
https://www.uscreen.tv/blog/circle-vs-mighty-networks/
https://www.textline.com/blog/sms-workflows
https://zapier.com/automations/marketing/sms-marketing/transactional-sms/send-three-part-onboarding-sms-sequence-to-new-registrants
https://www.eztexting.com/features/workflows
https://www.infobip.com/blog/what-is-a2p-10dlc
https://help.twilio.com/articles/4408675845019-SMS-Compliance-and-A2P-10DLC-in-the-US
https://www.apten.ai/blog/a2p-dlc-compliance-2026
