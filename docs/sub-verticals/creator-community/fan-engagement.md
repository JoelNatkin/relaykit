## Fan engagement / fan club platforms

**Vertical:** Creator economy & community
**Bucket:** Clear
**URL slug:** /for/fan-engagement

### What this builder is making
A platform — white-labeled fan club app or a creator's own "drop" CRM — where an artist, athlete, or creator owns a direct relationship with their superfans instead of renting it from a social algorithm. The builder tracks fan subscribers, membership tiers and perks, gated content (early video, behind-the-scenes, voice memos), and time-sensitive "drops": new releases, presale ticket windows, and limited merch. This is the TopFan / FanCircles / Audiorista / Laylo / Subtext shape — the core loop is creator drops something → fans get pinged → fans show up first, with optional paid-tier billing underneath.

### Why they need SMS
The whole product is timing: a presale code, a 200-unit merch run, or a release-day stream only converts if the fan acts in the first minutes, and email open rates (and Instagram's ~2-5% organic reach) miss that window. SMS gets a 98% open read in seconds, which is why creators report it driving on-sale days and sellouts that social posts couldn't. The consequence of missing the alert is concrete: the fan who never saw the drop forgets why they joined, and the tickets/merch they wanted are gone.

### Message categories
1. community — the home for the recurring fan-facing sends: drops, exclusive-content alerts, live-event reminders, fan milestones, and onboarding. The sender frame is the creator's own community name, which matches how fans experience these clubs.
2. account-events — paid fan clubs run recurring billing; failed-charge and renewal alerts are the churn-critical sends underneath the perk feed.
3. waitlist — presale and limited-drop access lines run as a queue (RSVP → your turn → grace window), the literal mechanic Laylo built its presale flow around.
4. verification — phone-ownership proof at signup, since the fan's number is the whole asset and the opt-in must be real.
5. marketing — promotional pushes (public sale, win-back of a lapsed member) exist but run as a separate EIN-gated, explicit-consent campaign, never from the transactional line.

Excluded: appointments (no scheduled 1:1 provider bookings in a fan-club shape — that's a coaching/commissions tip), order-updates (creators rarely run the shipping/returns lifecycle themselves; merch fulfilment is usually a third party), customer-support (a ticketing lifecycle isn't the fan-club value loop), team-alerts (no internal incident/on-call surface for fans).

### Workflows

**Exclusive content drop**
Pings paying or subscribed fans the moment new gated content publishes, while attention is live.
Sequence:
1. GAP:new-content-drop — "New from {{community_name}}" — fires when the creator publishes a members-only video, voice memo, or behind-the-scenes post, with a link to view it.
Variable aliases:
- community_name: "Ava Reyes Fan Club"

**Time-sensitive drop / limited merch**
Drives fans to a release-day or limited-run drop where speed decides whether they get it.
Sequence:
1. community:community-announcement — "Drop alert" — announces the live drop (single, merch run, collectible) with the link the second it goes live.
Variable aliases:
- community_name: "Ava Reyes Fan Club"
- announcement_link: "the drop page link"

**Presale / early access window**
Gives club members first access to tickets before the public on-sale — the marquee fan-club perk, run as a queue.
Sequence:
1. waitlist:joined — "You're in line" — confirms the fan is registered for the presale and will be texted when their window opens.
2. waitlist:almost-up — "Presale opens soon" — fires shortly before their access window.
3. waitlist:your-turn — "Your presale access is live" — sends the city/show-specific claim link when the window opens.
4. waitlist:grace-expiring — "Presale closing" — warns the code/spot is about to lapse.
5. waitlist:missed — "Presale window closed" — offers a rejoin/notify path if they didn't act in time.
Variable aliases:
- workspace_name: "Ava Reyes Fan Club"
- claim_link: "your presale ticket link"

**Live event / stream reminder**
Gets fans into a live moment (concert livestream, Q&A, listening party) at start time.
Sequence:
1. community:event-invitation — "New event" — posts the upcoming live event with an RSVP link when it's announced.
2. community:live-event-reminder — "Starting soon" — pings the RSVP'd fans right before the stream/event begins with the join link.
Variable aliases:
- community_name: "Ava Reyes Fan Club"

**Tour / on-sale announcement**
Tells fans a tour or event run was announced so they can register for their city's on-sale.
Sequence:
1. community:event-invitation — "Tour just announced" — announces the dates with an RSVP/notify-me link per city.
2. community:live-event-reminder — "On-sale today" — reminds RSVP'd fans when general tickets for their city go live.
Variable aliases:
- community_name: "Ava Reyes Fan Club"
- event_name: "the {{event_name}} tour"

**Fan milestone**
Recognizes a fan's loyalty — anniversary, top-fan status, streak — to deepen the bond.
Sequence:
1. community:member-milestone — "You hit a milestone" — fires when a fan reaches a club milestone (1 year, top-100 fan, streak).
Variable aliases:
- community_name: "Ava Reyes Fan Club"
- milestone: "1 year in the club"

**New member onboarding**
Walks a brand-new fan from signup into the club's perks so they don't go cold.
Sequence:
1. community:welcome — "Welcome to the club" — sent the moment they join.
2. community:first-action — "Get started" — 24-48h later, nudges a first action (claim a perk, set city preferences).
3. community:resource-pointer — "Find your way around" — 3-5 days in, points to where the gated content and perks live.
4. community:week-1-check-in — "One week in" — 7 days in, checks how it's going.
Variable aliases:
- community_name: "Ava Reyes Fan Club"

**Club update needing attention**
Reaches members when something in the club changes and they need to know.
Sequence:
1. community:moderation-update — "Club update" — fires when there's a change members must see (perk change, schedule shift, policy note).
Variable aliases:
- community_name: "Ava Reyes Fan Club"

**Membership billing lifecycle**
Keeps a paid fan club from silently churning when a card fails or a renewal lands.
Sequence:
1. account-events:trial-ending — "Trial ending" — a few days before a free-trial club membership converts to paid.
2. account-events:payment-failed — "Card declined" — fires when the recurring membership charge fails, with an update link.
3. account-events:subscription-confirmed — "Membership renewed" — confirms a renewal, tier change, or cancellation.
Variable aliases:
- workspace_name: "Ava Reyes Fan Club"

**Signup phone verification**
Proves the fan owns the number — the entire asset of the club — at signup.
Sequence:
1. verification:verification-code — "Your code" — sends the one-time code when the fan verifies their phone.
Variable aliases:
- business_name: "Ava Reyes Fan Club"

### Message gaps

**GAP:new-content-drop**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (a "new gated content published" alert shared with patronage platforms; community:community-announcement is the nearest cousin but reads as general club news, not "the exclusive thing you subscribed for just dropped")
- **Proposed universal name:** New content posted (display alias: "New from {{community_name}}")
- **Why:** The exclusive-content-drop ping is the core value-delivery event of a fan club and has no clean corpus home — community:community-announcement under-fits the paid-perk delivery moment, and marketing:product-launch is the wrong category (promotional, EIN-gated) for a transactional content-access alert to people who already follow/pay. (Shared with the patronage-platforms entry — same registry-layer message, not a new proposal.)

### Content constraints
- Exclusive-content-drop and drop-alert sends are transactional notices to fans who opted in to that creator's program — keep them factual ("new content is up, here's the link"); do not slip in "upgrade your tier" or promo, which reclassifies them as marketing and breaks the transactional campaign registration.
- Public sales, broad win-back, and any promotional push require separate explicit marketing consent and run as a second EIN-gated MARKETING campaign — never sent from the transactional line.
- Consent must be obtained directly from the fan for this creator's program specifically; a phone number captured for one purpose can't be reused, and consent can't be bought, sold, or traded. The opt-in context (drop alerts vs. billing vs. presale) should be clear at signup.
- Verification messages carry no STOP/HELP language (2FA carve-out).
- SHAFT-C content is prohibited regardless of category — relevant here because fan/creator content varies widely; the message body must stay clean even when the creator's gated content is edgy.
- 10DLC/TCR registration is required; unregistered creator traffic is blocked by carriers, and the high RSVP-keyword volume of fan-club signups makes a clean documented opt-in flow load-bearing.

### Disambiguation
Fan engagement sits right next to patronage platforms (Patreon/Ko-fi): if the product's core is a creator's recurring paid content feed with billing as the spine, that's the patronage shape; fan engagement leans harder on time-sensitive drops, presales, and live events, which is why waitlist and the drop-alert moment matter more here. It also borders affinity/membership communities — if the value is the member-to-member space rather than the creator's drops and perks, community onboarding dominates and the drop alert fades. The tip from Clear toward caution is content type: non-adult fan clubs are Clear, but the moment the platform's purpose is adult/sexual content it is out of scope — SHAFT-C is prohibited in the corpus regardless of wording, so an adult-creator fan platform is not a candidate even though the drop/presale mechanics look identical.

### Sources
https://www.topfan.com/
https://www.fancircles.com/
https://www.fancircles.com/fan-club-subscriptions/
https://www.audiorista.com/app-builder-tool-for/celebrity-fan-club-app
https://www.choicely.com/solutions/fan-engagement-platform
https://laylo.com/
https://laylo.com/features/text-messages
https://laylo.com/blog/how-festivals-and-events-use-laylo-to-dominate-ticket-sales
https://laylo.com/music
https://joinsubtext.com/v/creators
https://community.com/creators
https://messagemyfans.com/blog/sms-marketing-for-creators-complete-guide/
https://groupie.io/blog/sms-marketing-for-musicians/
https://www.scrile.com/blog/fan-club-membership
https://www.infobip.com/blog/tcpa-compliance-sms
https://www.slicktext.com/sms-compliance
https://help.twilio.com/articles/4408675845019-SMS-Compliance-and-A2P-10DLC-in-the-US
