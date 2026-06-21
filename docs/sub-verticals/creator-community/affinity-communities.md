## Online community for affinity groups (hobby, professional, support)
**Vertical:** Creator economy & community
**Bucket:** Clear
**URL slug:** /for/affinity-communities

### What this builder is making
A self-hosted or SaaS-built space where people who share an interest — a hobby, a profession, or a life circumstance — gather around topic channels, threaded discussion, live events, and shared resources, in the Discord-for-X / Slack-for-communities / Discourse mold. Membership is usually free and topic-led rather than a paid course or membership product, so the builder's job is filling channels, running events, and keeping members coming back, not collecting subscriptions. Engagement and event attendance are the whole game; the builder lives or dies by whether members show up.

### Why they need SMS
The single highest-stakes moment is a live event (AMA, call, meetup, watch-party) starting in ten minutes while the RSVP'd member has app notifications muted and email unopened — a 98% SMS open rate against ~20% email is the difference between a full room and an empty one. New members also go cold in the first week if nothing pulls them back in, and a moderation or safety update only works if it actually reaches people. SMS wins because community apps are exactly the apps people silence, and a text lands on the lock screen regardless.

### Message categories
1. community — the native home for this builder: event reminders, invitations, onboarding sequence, milestones, announcements, and moderation updates all live here
2. account-events — relevant only when the community runs on a paid tier or has account-security surface (new-device sign-in, suspension); secondary because most affinity groups are free
3. verification — phone-ownership proof at signup or step-up for moderator/admin actions; thin but real
Excluded: appointments (no 1:1 provider booking model — group events live in community), order-updates (no physical/digital goods fulfillment), customer-support (a community has moderators, not a ticketed support desk — member issues surface as moderation, not CSAT tickets), marketing (free topic-led groups don't run EIN-gated promotional campaigns; event invites stay transactional in community), team-alerts (no on-call/incident/shift surface), waitlist (open-join communities don't queue; invite-only access is rare enough to not anchor the entry)

### Workflows

**Live event reminder**
Gets RSVP'd members into the room when an event is about to start.
Sequence:
1. community:event-invitation — "New event posted" — when a new event goes on the calendar, with an RSVP link
2. community:live-event-reminder — "Event starting soon" — shortly before the event begins, with the join link
Variable aliases:
- event_name: "Tuesday AMA with the maintainers"

**Member onboarding (4-step)**
Turns a brand-new join into an active, oriented member over the first week.
Sequence:
1. community:welcome — "Welcome" — immediately on join
2. community:first-action — "Introduce yourself" — 24-48h after join, nudging the intros channel
3. community:resource-pointer — "Orientation guide" — 3-5 days in, with the guide link
4. community:week-1-check-in — "One week in" — 7 days after join, a how's-it-going touch
Variable aliases:
- community_name: "r/woodworking Discord" / "PyData Slack"

**Community announcement**
Pushes important community news to members who've muted in-app and email.
Sequence:
1. community:community-announcement — "Community news" — when there's something new to share, with a link

**Moderation / safety update**
Reaches members when the community needs their attention — rule change, incident, action required.
Sequence:
1. community:moderation-update — "Important update" — when members need to act or be informed, with a details link

**Member milestone**
Recognizes a member reaching a community milestone to reinforce belonging and retention.
Sequence:
1. community:member-milestone — "Milestone reached" — on hitting an anniversary, post count, or streak
Variable aliases:
- milestone: "your first year in the community"

**Signup phone verification**
Proves phone ownership at join for communities that gate membership behind a verified number.
Sequence:
1. verification:verification-code — "Verification code" — when a member enters their phone at signup

**Moderator step-up confirmation**
Confirms a sensitive moderator/admin action (ban, role grant, ownership transfer) with a one-time code.
Sequence:
1. verification:confirmation-code — "Confirmation code" — before the privileged action commits

### Message gaps
None. Every workflow maps cleanly to existing corpus messages — the community category was built for exactly this surface, and verification covers the two auth moments. No GAP or STRETCH flagged.

### Content constraints
- Standard A2P 10DLC / TCR rules apply: explicit prior opt-in to SMS specifically (a member providing a number or having a prior relationship is NOT consent), honor STOP/UNSUBSCRIBE, support HELP.
- Event invites and announcements stay transactional/relational — do not let them drift into promotional copy (offers, discounts, "upgrade"), which would push the send into the MARKETING use case and its EIN-gated, separate-consent regime.
- Verification-category sends (signup code, step-up code) carry NO STOP/HELP language per the 2FA carve-out.
- Support-style group communities (recovery, mental health, sensitive affinity): keep bodies content-light — point to a link, never put member status or sensitive context in the SMS body, and respect that a number on a lock screen may be seen by others.
- No SHAFT-C content in any body.

### Disambiguation
The sharpest line is against Circle / Mighty Networks paid-membership platforms: those are billing-heavy (trial-ending, payment-failed, subscription-confirmed dominate via account-events), whereas free affinity groups skew almost entirely to community-category event/onboarding/moderation sends. If the builder charges a recurring membership fee, the entry tilts toward account-events and starts to resemble the membership-platform sub-vertical. It stays Clear as long as event invites and announcements remain transactional/relational; the moment the builder wants to text discounts, sponsor promos, or "come back, here's 20% off," that's a MARKETING send needing separate consent and EIN gating — a common trap because it feels like "just another announcement." Note also that group events here are one-to-many community events, not 1:1 appointment bookings, so they belong in community, not appointments, even though the reminder cadence looks similar.

### Sources
https://circle.so/blog/discord-alternatives
https://www.mightynetworks.com/resources/discord-alternatives
https://whop.com/blog/online-community-software/
https://www.higherlogic.com/blog/online-community-software/
https://faq.mightynetworks.com/en/articles/3825330-what-kind-of-notifications-will-i-receive-as-a-member-of-a-mighty-network
https://faq.mightynetworks.com/en/articles/3825291-how-do-i-create-a-text-chat-event
https://zapier.com/apps/mightynetworks/integrations/sms
https://www.text-em-all.com/use-cases/event-text-messaging
https://activitymessenger.com/blog/automate-sms-text-reminders-before-your-events/
https://www.dialmycalls.com/emergency-notification/community-notification-system
https://mobile-text-alerts.com/articles/internal-sms
https://support.callrail.com/hc/en-us/articles/18593904382221-Text-Message-Compliance-10DLC-regulations-and-guidelines
https://www.10dlc.org/en/home/A2PConsent
https://help.twilio.com/articles/4408675845019-SMS-Compliance-and-A2P-10DLC-in-the-US
