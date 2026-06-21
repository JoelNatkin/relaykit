## Newsletter / email creator tools (paid subscriptions)
**Vertical:** Creator economy & community
**Bucket:** Clear
**URL slug:** /for/newsletter-creators

### What this builder is making
A Substack-for-X publishing platform where independent writers run a paid newsletter as a business — free and paid tiers, recurring Stripe subscriptions, gated posts, and a member roster they own. The software tracks the subscriber lifecycle (signup, free→paid upgrade, renewal, card decline, downgrade, cancellation) and the publishing cadence (a new issue going out to the list). Email is the publishing channel; the builder's job is keeping paying members subscribed and reading.

### Why they need SMS
When a paying subscriber's card silently declines at renewal, the recovery email lands in a promotions folder and the member churns without ever knowing — a text reaches them and saves the recurring revenue. SMS also wins the moment a flagship issue drops: an inbox is crowded and a paid post can sit unopened for days, where a one-line "new issue is live" nudge pulls the subscriber straight back to the content they're paying for. The consequence in both cases is direct dollar loss, which is why SMS earns its place despite never being the publishing channel.

### Message categories
1. account-events — payment failure, renewal, trial, and sign-in are the churn-critical, revenue-saving moments; this is the spine of the sub-vertical.
2. marketing — free→paid conversion nudges and lapsed-subscriber win-back are the growth engine of a paid newsletter (EIN-gated, separate consent).
3. verification — phone-ownership proof at signup for accounts that add SMS as a factor.
4. waitlist — relevant only for invite-gated or capped paid tiers (a minority of creators), so secondary at best.

Excluded: appointments (no scheduling/booking surface in a newsletter business), order-updates (no physical or shipped goods — a subscription is access, not an order to fulfill), customer-support (most indie newsletters route reader questions through email/comments, not a ticketed SMS support desk), community (the corpus community category is event/onboarding-channel-centric with a `{{community_name}}` frame; a newsletter's "community" is its subscriber list, served by account-events + the new-issue drive-back, not by live-event reminders), team-alerts (no operational/on-call surface).

### Workflows

**Failed-payment recovery (dunning)**
Saves a paying subscriber whose renewal charge was declined before access lapses.
Sequence:
1. account-events:payment-failed — "Your newsletter" — sent when the renewal card is declined; "card ending X was declined, update payment to keep your subscription active" with a link to the billing page.
2. account-events:subscription-confirmed — "Your newsletter" — sent once the subscriber updates the card and the charge clears; confirms the subscription is active again.
Variable aliases (only where the default would feel wrong):
- account_link: "https://read.yournewsletter.com/account/billing"

**Trial-to-paid conversion**
Converts a free-trial reader into a paying subscriber before the trial lapses.
Sequence:
1. account-events:trial-ending — "Your newsletter" — sent a few days before the free trial ends; "your trial ends in {{days_remaining}} days, choose a plan to keep reading."
2. account-events:subscription-confirmed — "Your newsletter" — sent when they pick a paid plan; confirms the subscription and the details.

**New issue published (drive-back)**
Pulls subscribers back to a just-published issue that would otherwise sit unopened in a crowded inbox.
Sequence:
1. GAP:new-content-published — "Your newsletter" — sent the moment a new issue/post goes live; one line naming the issue with a read link.
Variable aliases (only where the default would feel wrong):
- (none)

**Free-to-paid upgrade nudge**
Moves an engaged free subscriber onto a paid tier — the core monetization move of a paid newsletter.
Sequence:
1. marketing:promotional-offer — "Your newsletter" — sent during a launch or upgrade window; "founding-member rate / paid tier is open, claim it" with an upgrade link.
Variable aliases (only where the default would feel wrong):
- business_name: "The Daily Draft"
- offer: "Founding-member rate ends Friday"
- offer_link: "https://read.yournewsletter.com/upgrade"

**Lapsed-subscriber win-back**
Re-engages a reader whose paid subscription cancelled or who has gone quiet, to recover the relationship.
Sequence:
1. marketing:re-engagement — "Your newsletter" — sent to a lapsed/cancelled subscriber; "it's been a while, here's what you've missed" with a link to recent issues.
Variable aliases (only where the default would feel wrong):
- business_name: "The Daily Draft"

**Subscription change confirmation**
Gives a member a durable receipt when they renew, switch tiers, or cancel.
Sequence:
1. account-events:subscription-confirmed — "Your newsletter" — sent on any renewal, plan change, or cancellation; confirms the change and links to account details.

**Phone verification at signup**
Proves phone ownership when a subscriber opts to secure their account with SMS.
Sequence:
1. verification:verification-code — "Your newsletter" — sent at signup or when adding a phone; one-time code, no STOP/HELP (2FA carve-out).

**New-device sign-in alert**
Flags account access from an unrecognized device so the member can secure a paid account.
Sequence:
1. account-events:new-device-sign-in — "Your newsletter" — sent when the account is accessed from a new device; "not you? secure your account."

### Message gaps

**GAP:new-content-published**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:content-published (a publish-event lifecycle notification — applies to any publishing/content platform, not just newsletters)
- **Proposed universal name:** New content published
- **Why:** Every content/publishing platform has a "your thing is live, go read it" moment, and the corpus has no transactional notification for fresh content going live — marketing:product-launch is promo-gated and frames content as a product, which is the wrong consent lane and the wrong frame for a paid subscriber's regular issue.
- **Draft variants:**
  - Standard: `{{workspace_name}}: New issue is live - {{content_title}}. Read it here: {{content_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} just dropped a new issue: {{content_title}}. Read it: {{content_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: New issue - {{content_title}}. {{content_link}} STOP to opt out.`
- **New variables:** `{{content_title}}` — title of the published issue/post, budget ~40 chars, source: the publishing platform's post record, example: "The case for slow media". `{{content_link}}` — link to the published issue, budget ~30 chars (shortened), source: the post's public URL, example: "https://read.yn.com/p/slow".

### Content constraints
- Account, billing, and publish-notification messages are transactional (TCR ACCOUNT_NOTIFICATION) and need express consent plus working STOP/HELP.
- Free→paid upgrade and win-back messages are promotional (TCR MARKETING) — they require separate express written marketing consent and are EIN-gated; do not send them on transactional consent alone.
- Keep the publish "drive-back" notification factual (issue title + link). The moment it carries an offer or sales pitch it becomes marketing and moves consent lanes.
- Standard carrier rules otherwise apply; no vertical-specific carrier restrictions beyond the marketing/transactional consent split.

### Disambiguation
This sub-vertical is Clear because it is account-and-billing lifecycle messaging for a SaaS-like subscription — the same shape as any recurring-revenue tool. The line to watch is the publishing channel itself: piping issue *content* over SMS (a true SMS newsletter) is a different, marketing-heavy product with bulk-broadcast consent burdens, and is not what this builder is doing — here SMS only links back to content hosted elsewhere. It tips toward Conditional only if the creator's niche is itself regulated (a paid newsletter covering cannabis, sports-betting picks, or financial/securities advice can drag SHAFT-C or financial-promotion scrutiny into otherwise-clean account messages). A neighboring sub-vertical, paid community/membership platforms, leans on the corpus community category (events, onboarding) where newsletter creators lean on account-events.

### Sources
https://www.beehiiv.com/blog/substack-vs-ghost
https://publishinghouse.org/newsletter-platforms-compared-beehiiv-substack-ghost-and-convertkit/
https://support.substack.com/hc/en-us/articles/360037463732-What-happens-when-a-subscriber-s-payment-fails-on-my-Substack
https://www.beehiiv.com/support/article/39165102555927-troubleshooting-paid-subscription-issues
https://ghost.org/help/setup-members/
https://substack.com/features
https://simpletexting.com/blog/text-message-newsletter/
https://www.activecampaign.com/recipes/send-sms-text-messages-to-new-newsletter-blog-and-email-subscribers
https://www.beehiiv.com/blog/how-to-turn-free-readers-into-paying-subscribers-the-complete-guide
https://help.twilio.com/articles/4408675845019-SMS-Compliance-and-A2P-10DLC-in-the-US
https://www.termsfeed.com/blog/a2p-10dlc-compliance/
