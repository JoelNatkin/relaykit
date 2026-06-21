## Patreon-style recurring patronage (non-adult)
**Vertical:** Creator economy & community
**Bucket:** Clear
**URL slug:** /for/patronage-platforms

### What this builder is making
A platform (or self-hosted membership site) where fans support a creator with one-time tips or recurring monthly pledges in exchange for tiered perks — exclusive posts, early access, members-only feeds, livestreams, and digital downloads. The builder tracks supporters, pledge tiers, recurring billing through Stripe/PayPal, content drops gated by tier, and per-creator earnings against funding goals. This is the Patreon / Ko-fi / Buy Me a Coffee / Memberful shape: the core loop is creator publishes → supporters pay → supporters consume gated content, with churn-critical billing underneath it.

### Why they need SMS
The two moments that decide a creator's income are a fresh content drop (a supporter who never sees the post forgets why they pay) and a failed recurring charge (Patreon converts a member to free after ~30 days of declines — that's silent churn the supporter never meant). Email notifications for both are buried — open rates on "new post" emails are low and dunning emails land in spam exactly when a card expires. SMS lands the content alert while attention is live and recovers the failed payment before the membership lapses, which is the difference between a renewed pledge and a lost patron.

### Message categories
1. account-events — billing is the churn-critical spine: payment confirmations, failed-charge recovery, and tier changes are where SMS protects revenue.
2. community — the patronage relationship is a community of supporters: new-supporter welcome, funding-goal milestones, and members-only live events all live here.
3. marketing — creators run launch/relaunch pushes and win-back to lapsed supporters, but only as a separately-consented second campaign.
4. verification — phone-ownership at signup and step-up confirmation before a payment-method change.
Excluded: appointments (no scheduled 1:1 bookings in the patronage model — that's a commissions/coaching shape), order-updates (no physical fulfillment in the core membership loop), customer-support (present on the platform but not the creator-to-supporter SMS relationship being sold), team-alerts (no operational/on-call surface), waitlist (memberships are open-enrollment, not gated by queue).

### Workflows

**New supporter onboarding**
Welcomes a fan the moment they pledge and points them at the gated content they just unlocked.
Sequence:
1. community:welcome — "Welcome from the creator" — fires immediately on first successful pledge, confirms they're in and glad to have them.
2. community:resource-pointer — "Where your perks live" — 1-2 days later, points to the members-only feed / how to access gated posts.
Variable aliases:
- community_name: "Jane's Studio" (the creator's page/handle, not the platform name)
- resource_link: "your members feed"

**Content drop alert**
Tells paying supporters the instant new gated content they pay for goes live — the signature patronage moment.
Sequence:
1. GAP:new-content-drop — "New post is up" — fires when the creator publishes a members-only post/video/download, with a link to view it.
Variable aliases:
- community_name: "Jane's Studio"

**Recurring payment confirmed**
Reassures the supporter their monthly pledge processed and their tier is active for another cycle.
Sequence:
1. account-events:subscription-confirmed — "Pledge renewed" — fires on a successful recurring charge or a confirmed plan/tier change.
Variable aliases:
- workspace_name: "Jane's Studio"
- account_link: "your membership"

**Failed-charge recovery (dunning)**
Recovers a lapsing supporter before the card decline silently downgrades them to free — the highest-value SMS in the category.
Sequence:
1. account-events:payment-failed — "Card declined, pledge at risk" — fires on the first decline, asks them to update their card to keep their membership active.
2. account-events:account-suspended — "Membership paused" — fires after retries are exhausted (Patreon downgrades after ~30 days), tells them the membership lapsed and how to restore it.
Variable aliases:
- workspace_name: "Jane's Studio"
- card_last4: "4242"
- account_link: "update your card"

**Tier change confirmation**
Confirms an upgrade or downgrade so the supporter knows the new perk level (and new price) is locked in.
Sequence:
1. account-events:subscription-confirmed — "Tier updated" — fires when a supporter switches tiers; the pending/effective-next-cycle detail lives behind account_link.
Variable aliases:
- workspace_name: "Jane's Studio"
- account_link: "your tier details"

**Funding-goal milestone**
Celebrates a shared win when the creator's page hits a supporter count or monthly funding goal — deepens the patron relationship.
Sequence:
1. community:member-milestone — "We hit the goal" — fires when a funding/supporter goal is reached, thanks supporters for getting there.
Variable aliases:
- community_name: "Jane's Studio"
- milestone: "our 500-supporter goal"

**Members-only live event**
Drives attendance to a livestream, Q&A, or premiere that's a perk of paying.
Sequence:
1. community:event-invitation — "Members-only stream announced" — when the event is scheduled, with an RSVP/save link.
2. community:live-event-reminder — "Starting soon" — shortly before it begins, with the join link.
Variable aliases:
- community_name: "Jane's Studio"
- event_name: "the members Q&A"

**Supporter win-back** (marketing — separate consent, EIN-gated)
Re-engages a former supporter whose pledge lapsed, with what they've missed.
Sequence:
1. marketing:re-engagement — "Come back, here's what's new" — sent to lapsed, separately-opted-in supporters.
Variable aliases:
- business_name: "Jane's Studio"
- reengagement_link: "what you've missed"

**Phone verification & payment step-up**
Proves phone ownership at signup and confirms a sensitive payment-method change.
Sequence:
1. verification:verification-code — "Signup code" — at account creation.
2. verification:confirmation-code — "Confirm payment change" — before a card/payout change takes effect.
Variable aliases:
- business_name: "Jane's Studio"

### Message gaps

**GAP:new-content-drop**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (a "new gated content published" alert specific to creator/patronage platforms; community:community-announcement is the nearest cousin but is framed as general community news, not "the thing you pay for just dropped")
- **Proposed universal name:** New content posted (display alias: "New post is up")
- **Why:** The content-drop notification is the core value-delivery event of patronage and has no clean corpus home — community:community-announcement under-fits because it reads as housekeeping news, not the paid-perk delivery moment, and marketing:product-launch is wrong category (promotional, EIN-gated) for a transactional content-access alert to people who already pay.

### Content constraints
- New-content-drop alerts are transactional notices to paying members about content they've subscribed to — keep them factual ("new post is up, view it here"); do not slip in promo or "upgrade your tier" upsell, which reclassifies the message as marketing and breaks the transactional campaign registration.
- Recurring-billing nature must be clear at the opt-in/consent point; the SMS program describing pledge/billing alerts is the consent context for those texts.
- Win-back and any promotional push require separate explicit marketing consent and run as a second (EIN-gated, MARKETING) campaign — never sent from the transactional campaign.
- Verification messages carry no STOP/HELP language (2FA carve-out).
- SHAFT-C content is prohibited regardless of category — relevant because creator content varies widely; the message body itself must stay clean even if the creator's gated content is edgy.

### Disambiguation
Patronage sits next to commissions/coaching platforms and to general paid communities, and the tip decides bucket and category mix. If the creator is selling scheduled 1:1 work (art commissions with deadlines, coaching calls), that's an appointments-heavy shape, not this one. If the product is a standalone paid community (Circle, Mighty Networks) where the value is the member space rather than a creator's content feed, community becomes primary over account-events. The hard line for this entry is adult content: Patreon/Ko-fi-style non-adult patronage is Clear, but the moment the platform's purpose is adult/sexual content the use case is out of scope — SHAFT-C is prohibited in the corpus regardless of how a message is worded, so an adult-creator patronage platform is not a candidate for these workflows even though the billing mechanics look identical.

### Sources
https://buddyboss.com/blog/best-patreon-alternatives/
https://circle.so/blog/patreon-alternatives
https://www.podia.com/patreon-alternative
https://ko-fi.com/
https://buymeacoffee.com/
https://alitu.com/creator/content-creation/patreon-vs-ko-fi-vs-buy-me-a-coffee/
https://fourthwall.com/blog/8-best-membership-site-platforms-for-creators
https://support.patreon.com/hc/en-us/articles/204606115-How-to-manage-failed-payments-from-members
https://support.patreon.com/hc/en-us/articles/203913799-Failed-payment-help
https://support.patreon.com/hc/en-us/articles/360000126286-How-to-change-your-tier-a-guide-for-members
https://support.patreon.com/hc/en-us/articles/24095168189325-Managing-fan-engagement-with-notifications
https://support.patreon.com/hc/en-us/articles/115002958403-Launch-Checklist-Everything-You-Need-to-Know-Before-You-Hit-Publish
https://www.paidmembershipspro.com/checkout-notification-apps-text-slack/
https://wp-sms-pro.com/product/wp-sms-membership-integrations/
https://help.twilio.com/articles/4408675845019-SMS-Compliance-and-A2P-10DLC-in-the-US
https://www.infobip.com/blog/tcpa-compliance-sms
