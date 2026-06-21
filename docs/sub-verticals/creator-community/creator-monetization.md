## Creator monetization tools (tip jars, paid DMs, fan-club tooling)
**Vertical:** Creator economy & community
**Bucket:** Clear
**URL slug:** /for/creator-monetization

### What this builder is making
A builder here ships a tip-jar, membership, or fan-club product where supporters pay a creator directly — one-time tips, recurring memberships with tiered benefits, paid DM/text access, or unlockable content (Ko-fi, Buy Me a Coffee, and Patreon-style membership tooling are the reference points). The product tracks supporters, payment events, subscription state, and per-tier perk fulfillment, with money flowing through Stripe or PayPal to the creator. The hard part is recurring billing health: failed cards, renewals, and lapses quietly drop paying supporters, and a parallel surface is the direct creator-to-fan channel (new drop, early access, exclusive post) that defines fan-club tooling.

### Why they need SMS
The moment that hurts is a silent failed renewal — a card declines, the email lands in spam, and a paying supporter churns to a free tier 30 days later without ever knowing (Patreon retries up to six times then downgrades). SMS wins because billing-action messages need to be seen in minutes, not whenever the supporter next opens email — and the same channel doubles as the high-open-rate fan drop alert that creators pay SMS platforms like Subtext for. A tip receipt or renewal confirmation by text is both a trust signal and a deliverability hedge on revenue the creator can't afford to lose.

### Message categories
1. account-events — billing lifecycle is the revenue spine: failed payment, renewal/cancel confirmation, trial-to-paid, suspension. These are the messages that directly prevent involuntary churn.
2. order-updates — one-time tips and content purchases are transactional confirmations (tip receipt, refund); the strongest payment-receipt fit in the corpus.
3. community — fan-club tooling is creator-to-supporter broadcast: new drop, member milestone, welcome onboarding for new supporters. Sender frame is the creator's own name, which fits `{{community_name}}`.
4. verification — phone-ownership at signup and step-up confirmation before payout/payment-method changes (sensitive-action carve-out).
5. marketing — only with separate explicit consent and EIN: promotional pushes for memberships or merch. Secondary because most creator pushes ride community (transactional) framing, and many indie creators are sole-prop without EIN.

Excluded: appointments (no scheduled-service booking model here), customer-support (a real support inbox exists but is not the defining SMS surface for a payment/fan-club product — ride account-events for billing issues), team-alerts (no internal ops/on-call surface), waitlist (no queued-access model; tier sales are immediate, not queued).

### Workflows

**Tip received**
Confirms a one-time tip landed and gives the supporter a receipt — the core tip-jar transaction.
Sequence:
1. order-updates:order-confirmed — "Tip received" — sent immediately after a one-time tip is paid, confirming the amount and a link to the receipt.
Variable aliases:
- order_number: "your tip"
- estimated_delivery: "your receipt"

**Failed renewal recovery**
Catches a declined recurring membership charge before the supporter is silently downgraded.
Sequence:
1. account-events:payment-failed — "Card declined" — sent when the recurring charge declines, prompting the supporter to update their card to keep their membership active.
2. account-events:subscription-confirmed — "Membership renewed" — sent once the updated card succeeds, confirming the membership is active again.

**Membership renewal confirmation**
Reassures a paying supporter their recurring membership renewed and the perks continue.
Sequence:
1. account-events:subscription-confirmed — "Membership renewed" — sent when a recurring renewal, tier change, or cancellation processes.

**Free-trial / intro tier conversion**
Nudges a supporter on a free or trial tier before it ends so paid access continues.
Sequence:
1. account-events:trial-ending — "Trial ending" — sent a few days before a free/intro tier lapses, prompting the supporter to choose a paid tier.
2. account-events:subscription-confirmed — "Membership started" — sent when they pick a paid tier.

**Refund processed**
Closes the loop when a creator refunds a tip or membership charge.
Sequence:
1. order-updates:refund-processed — "Refund sent" — sent when a refund is returned to the supporter's card.
Variable aliases:
- order_number: "your tip"

**New supporter onboarding**
Warms up a brand-new paying supporter so the first days of membership feel personal.
Sequence:
1. community:welcome — "Welcome from {{community_name}}" — sent the moment someone becomes a supporter.
2. community:resource-pointer — "Here's where your perks live" — sent a few days in, pointing to the supporter-only content or benefits hub.
3. community:week-1-check-in — "One week in" — sent at day 7 to check the supporter is finding their perks.

**Exclusive drop alert**
The fan-club broadcast: tells supporters a new exclusive post, video, or merch drop is live.
Sequence:
1. community:community-announcement — "New from {{community_name}}" — sent when a new supporter-only post or drop goes live.
Variable aliases:
- announcement_link: "the new post"

**Early access window**
Gives top-tier supporters a head start on merch, tickets, or a release before the public.
Sequence:
1. community:event-invitation — "Early access for supporters" — sent when an early-access window opens for a drop or release.
Variable aliases:
- event_name: "early access to the new merch drop"

**Supporter milestone**
Celebrates a recurring supporter's loyalty (e.g. 12 months) to reduce churn.
Sequence:
1. community:member-milestone — "{{milestone}} of support" — sent when a supporter hits a tenure or contribution milestone.
Variable aliases:
- milestone: "one year of support"

**Phone verification at signup**
Proves phone ownership when a supporter or creator adds SMS to their account.
Sequence:
1. verification:verification-code — "Verification code" — sent at signup to verify the phone number.

**Payout / payment-method step-up**
Confirms a sensitive money action — creator payout change, or supporter swapping the card on file.
Sequence:
1. verification:confirmation-code — "Confirmation code" — sent before a payout-method or payment-method change is saved.

**Account suspension notice**
Tells a creator their monetization account was suspended (e.g. payout/KYC or policy hold).
Sequence:
1. account-events:account-suspended — "Account suspended" — sent when the creator's account is suspended, with next steps.

### Message gaps
None. Every workflow maps to an existing corpus message; the tip-receipt and membership-renewal moments are covered by order-updates and account-events respectively, with variable aliases doing the contextual reframing rather than requiring new messages. No STRETCH was needed — the account-events and order-updates bodies read naturally for tips and recurring memberships without altering their core meaning.

### Content constraints
- Standard A2P 10DLC / TCR registration required (brand + campaign); unregistered 10DLC traffic is blocked outright by carriers.
- Transactional billing and fan-channel messages use ACCOUNT_NOTIFICATION / DELIVERY_NOTIFICATION campaign types; any promotional push (memberships, merch sales) requires the MARKETING campaign, separate explicit opt-in, and is EIN-gated — many indie/sole-prop creators won't qualify for marketing initially.
- SHAFT-C (sexual content) is prohibited regardless of consent: this is the bright line that separates in-scope creator monetization from adult-content platforms. No suggestive copy, no adult-tier promotion, no NSFW drop descriptions in message bodies.
- No credentials, payout amounts, or full payment details in message bodies beyond the corpus variables (e.g. card_last4, refund_amount); link out for sensitive detail.
- Verification-category messages carry no STOP/HELP language (2FA carve-out); all other categories must include the opt-out.

### Disambiguation
The nearest neighbor is adult-content creator platforms (OnlyFans-style), which share the tip/subscription mechanics but are out of scope and blocked by SHAFT-C — the tipping point is content, not business model: a non-adult tip jar is Clear, the same tooling pointed at adult content is prohibited at intake. Distinguish also from paid newsletter/membership-content platforms (Substack, beehiiv) whose primary surface is email/publishing rather than direct creator-to-fan SMS — those lean account-events + marketing and belong to a separate newsletter sub-vertical. Pure SMS fan-channel tools (Subtext, Community) overlap heavily on the community/marketing side but are less payment-driven; this entry assumes the payment + fan-club combination. Finally, watch the marketing line: a "new drop" alert to opted-in transactional supporters rides community, but a sale or discount on memberships/merch is MARKETING and pulls in the EIN gate and separate consent.

### Sources
https://alitu.com/creator/content-creation/patreon-vs-ko-fi-vs-buy-me-a-coffee/
https://fourthwall.com/blog/ko-fi-alternatives
https://www.beehiiv.com/blog/monetization-platforms-how-ko-fi-patreon-and-beehiiv-compare
https://help.ko-fi.com/hc/en-us/articles/360013140633-Supporter-payments-FAQ
https://help.ko-fi.com/hc/en-us/articles/360016956178-Direct-messages-on-Ko-fi
https://support.patreon.com/hc/en-us/articles/203913799-Failed-payment-help
https://support.patreon.com/hc/en-us/articles/204606115-How-to-manage-failed-payments-from-members
https://joinsubtext.com/v/creators
https://community.com/creators
https://simonowens.substack.com/p/how-subtext-enables-creators-to-send
https://messagemyfans.com/blog/sms-marketing-for-creators-complete-guide/
https://www.paidmembershipspro.com/checkout-notification-apps-text-slack/
https://www.10dlc.org/en/shaft
https://www.infobip.com/blog/what-is-a2p-10dlc
