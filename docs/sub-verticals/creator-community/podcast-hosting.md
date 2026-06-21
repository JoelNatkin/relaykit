## Podcast hosting / podcaster tools
**Vertical:** Creator economy & community
**Bucket:** Clear
**URL slug:** /for/podcast-hosting

### What this builder is making
A platform that hosts a podcaster's audio, generates the RSS feed distributed to Apple/Spotify, and gives the creator a dashboard of downloads, episode analytics, and audience growth — the Transistor/Buzzsprout/Captivate shape. Increasingly these tools also run the creator's direct listener relationship: a "text the show" number for Q&A and episode reminders (the Subtext/Textiful model) and paid private feeds where supporters subscribe monthly for ad-free or members-only episodes (the Supercast model). So the builder is part hosting/analytics backend, part listener CRM, part subscription-billing engine.

### Why they need SMS
The moment a new episode drops is when SMS wins: email gets ~20% open rates while a "new episode is live, here's the link" text gets opened in minutes and converts to an immediate listen, which is the single metric that grows a show. SMS is also the only channel where a listener can text a question back into the show and where a paid private-feed subscriber actually notices a card-declined message before their access lapses. Push notifications live inside one app's walled garden; the creator's own number reaches every listener regardless of where they listen.

### Message categories
1. account-events — paid private-feed subscriptions are the monetization core; failed payments, renewals, and trial-to-paid conversion are churn-critical and email-invisible.
2. community — the listener relationship is a community: new-episode drops, milestone celebrations, member onboarding, and live Q&A/recording reminders all map here under the show's own name.
3. marketing — promotional cross-promotion, merch, live-show ticket pushes, and lapsed-listener win-back; EIN-gated, separate consent.
4. verification — phone-ownership proof at "text POD to join" signup and step-up confirmation before a billing change on a paid feed.
5. waitlist — limited private cohorts (course feeds, beta/early-access supporter tiers) run a queue.

Excluded: appointments (no provider-booking model — recording-session reminders are rare and fit community live-event reminders), customer-support (a help desk exists but the two-way "text the show" loop is engagement, not ticketing; small builders rarely run a ticket lifecycle here), order-updates (no physical fulfillment in the core product — merch, if any, belongs to a separate store), team-alerts (single-creator/small-team product, not an infra-ops surface).

### Workflows

**New episode drop**
Tells opted-in listeners the moment a new episode publishes, driving the immediate listen that grows download numbers.
Sequence:
1. community:community-announcement — "New episode live" — fires when an episode publishes, with the title and a direct play link.
Variable aliases:
- community_name: "The Daily Drop"
- announcement_link: "https://pod.link/dailydrop/ep142"

**Listener text-to-join onboarding**
Converts a listener who texted the show's keyword into a confirmed, welcomed SMS subscriber.
Sequence:
1. verification:verification-code — "Confirm your number" — sent when someone texts the show keyword, proving phone ownership before adding them.
2. community:welcome — "Welcome to the show texts" — sent once confirmed, sets expectation of episode alerts and Q&A.
3. community:first-action — "Text us a question" — 24-48h later, invites the listener to reply with a question for a future episode.
Variable aliases:
- community_name: "The Daily Drop"

**Live recording / Q&A reminder**
Drives tune-in for a live-recorded episode or AMA where listener questions are read on air.
Sequence:
1. community:event-invitation — "Live recording" — when a live session is scheduled, with RSVP.
2. community:live-event-reminder — "We go live soon" — shortly before, with the join link.
Variable aliases:
- community_name: "The Daily Drop"
- event_name: "Live AMA recording"

**Listener milestone**
Celebrates a listener's relationship with the show (episodes listened, anniversary, streak) to deepen loyalty.
Sequence:
1. community:member-milestone — "You hit a milestone" — when a listener crosses a tracked threshold.
Variable aliases:
- community_name: "The Daily Drop"
- milestone: "100 episodes listened"

**Paid private-feed conversion**
Moves a free listener trying a paid feed into a paying supporter before the trial closes.
Sequence:
1. account-events:trial-ending — "Trial ending" — a few days before the free trial of the members feed ends.
2. account-events:subscription-confirmed — "Subscription confirmed" — when they pick a plan and the membership activates.

**Private-feed billing recovery**
Recovers a lapsing paid subscriber before their private-feed access is cut, protecting recurring revenue.
Sequence:
1. account-events:payment-failed — "Payment failed" — when the supporter's card is declined.
2. account-events:subscription-confirmed — "Subscription confirmed" — once they update payment and the renewal clears.
3. account-events:account-suspended — "Access paused" — if the card is never fixed and members-only access is revoked.

**Billing change confirmation (step-up)**
Confirms the supporter authorizes a sensitive billing change on their membership.
Sequence:
1. verification:confirmation-code — "Confirm change" — before a payment-method or plan-ownership change on the paid feed.

**Members-feed onboarding**
Orients a new paid supporter so they actually find and consume the members-only content they're paying for.
Sequence:
1. community:welcome — "Welcome, supporter" — immediately on first successful payment.
2. community:resource-pointer — "Add your private feed" — 1-2 days later, the link/guide to add the private RSS feed to their podcast app.
3. community:week-1-check-in — "One week in" — 7 days later, checks they got the feed working.
Variable aliases:
- community_name: "The Daily Drop"
- resource_link: "https://members.dailydrop.fm/setup"

**Limited cohort waitlist**
Manages a queue for a capped private cohort — a course feed or limited early-supporter tier.
Sequence:
1. waitlist:joined — "On the list" — when a listener joins the cohort waitlist.
2. waitlist:almost-up — "Almost your turn" — as a spot nears opening.
3. waitlist:your-turn — "Your spot's open" — when a seat opens, with the claim link.
4. waitlist:grace-expiring — "Spot still open" — if they haven't claimed yet.
5. waitlist:missed — "Spot expired" — if the window lapses, with a rejoin link.

**Lapsed-listener win-back** (marketing — separate consent)
Re-engages a listener who stopped opening episode texts or whose membership lapsed.
Sequence:
1. marketing:re-engagement — "It's been a while" — recaps what they've missed, with a link back.
Variable aliases:
- business_name: "The Daily Drop"

**Show promotion / cross-promo** (marketing — separate consent)
Pushes a sponsored window, merch drop, live-show tickets, or a new spin-off show to the opted-in marketing audience.
Sequence:
1. marketing:promotional-offer — "Offer" — for merch/ticket/discount windows.
2. marketing:product-launch — "New show live" — when a spin-off show or new feed launches.
Variable aliases:
- business_name: "The Daily Drop"

### Message gaps
None. Every workflow maps cleanly to existing corpus messages. The "new episode drop" moment is consent-sensitive — see Content constraints — but functionally it is a community announcement, not a new message type, so no GAP or STRETCH is declared.

### Content constraints
- The "new episode is live" alert is the borderline send: when listeners opted in specifically to be told about new episodes, it is a transactional community announcement under the show's own name. The instant that same number is used to push merch, sponsors, ticket sales, or third-party promotion, it is marketing — route those through the marketing category, which is EIN-gated and requires separate explicit consent.
- "Text POD to join" / keyword opt-in must carry the opt-in disclosure and a privacy statement at the point of collection; never import or buy listener phone lists.
- Every transactional message carries the show's brand name and working STOP/HELP; honor STOP immediately.
- Verification sends (keyword-confirm, billing step-up) carry no STOP/HELP language (2FA carve-out).
- Marketing/promotional sends require prior express written consent, are EIN-gated, and are SHAFT-C prohibited (no sex/hate/alcohol/firearms/tobacco/cannabis) — relevant for true-crime, comedy, or adult-themed shows whose episode-promo copy can drift into restricted content.
- Standard A2P 10DLC registration via The Campaign Registry applies; unregistered traffic is carrier-blocked.

### Disambiguation
A pure hosting/RSS tool with no listener-texting and no paid feeds is still Clear but thin — its only real SMS surface is the new-episode community announcement; the category richness here comes from the listener-CRM and paid-membership layers. The tip from "transactional community" to "marketing consent required" is content, not cadence: the same new-episode number stays transactional only while every send is genuinely a show update the listener subscribed to, and crosses into marketing the moment a sponsor, merch, or ticket pitch rides along — that is the most common compliance trap for this vertical. A neighboring sub-vertical is general creator/newsletter platforms (Substack-style), which share the membership-billing and re-engagement workflows but lack the episode-drop and text-the-show loops; another is paid-community/membership tools (Memberful, Patreon-style), which overlap heavily on account-events and onboarding but center a forum/community rather than a feed. Note the new-episode alert specifically: it is transactional only under a clean episode-alerts opt-in, which is why it sits in community, not marketing — flag the consent posture to any builder who wants to bundle promotion into it.

### Sources
https://transistor.fm/
https://transistor.fm/features/private-podcasts/
https://transistor.fm/paid-private-podcast/
https://www.buzzsprout.com/blog/private-podcasting
https://www.captivate.fm/podcast-growth/analytics/podcast-analytics-and-stats
https://podsqueeze.com/blog/best-podcast-hosting-platforms/
https://info.joinsubtext.com/blog/how-to-use-sms-to-create-a-more-interactive-podcast-experience
https://simonowens.substack.com/p/how-subtext-enables-creators-to-send
https://textiful.com/podcasts
https://www.sonikit.com/blog/articles/how-podcasters-are-using-sms-to-increase-listeners-and-engagement
https://www.thepodcasthost.com/promotion/text-message-marketing/
https://zapier.com/apps/podcastco/integrations/textiful/270306/message-your-textiful-audience-with-new-podcast-episodes-on-podcastco
https://memberful.com/blog/supercast-alternatives
https://secondlinethemes.com/podcast-paid-subscribers-supercast/
https://help.twilio.com/articles/4408675845019-SMS-Compliance-and-A2P-10DLC-in-the-US
https://www.infobip.com/blog/tcpa-compliance-sms
https://podcasters.apple.com/measure
