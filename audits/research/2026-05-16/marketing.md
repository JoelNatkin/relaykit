# Marketing — Lead-Magnet Research
**Date:** 2026-05-16
**TCR mapping:** MARKETING
**Classification:** discrete
**Authored by:** PM (Session 91)

## 1. Industry pattern observations

Marketing SMS in indie SaaS is rarer than transactional SMS — most indie SaaS founders default to email for promotional reach. Specific moments tilt to SMS: product launches with an opted-in audience, limited-time pricing windows, re-engagement after silence, and event-driven sends (Black Friday, launch days, AMA invites).

The pattern is distinct from e-commerce marketing SMS (abandoned cart, daily blasts) — indie SaaS marketing SMS is event-bound, lower frequency, and ties to specific moments rather than ongoing campaigns. A creator launching a new course sends one SMS to their list. A SaaS founder announcing a price-locked tier sends one SMS over 48 hours. The volume is low; the timing matters.

Reference apps observed: ConvertKit/Kit (creator-focused), Beehiiv (newsletter SaaS), Substack (writer launches), Buffer (feature announcements mostly via Twitter, occasional SMS), Linear (email-only marketing), Vercel (email-only marketing), Notion (email-only marketing). Klaviyo's SMS templates are e-comm-shaped and don't translate cleanly. Indie SaaS marketing SMS borrows from creator-economy patterns more than from e-commerce.

## 2. Subs identified

Four discrete subs cover indie SaaS marketing SMS use cases:

1. **Promotional offer** — discount codes, sale windows, limited-time pricing, BOGO, seasonal campaigns (Black Friday, EOY, holidays). The most regulated and most abused sub. Voice must avoid manipulation cues (false urgency, fake scarcity). Birthday/anniversary marketing triggers fold into this sub per the §6 resolution below.

2. **Product launch** — new app debut, new product line, major feature release. One-time send to opted-in audience. Often paired with a launch-week sequence in email; SMS is the "the thing is live" moment.

3. **Re-engagement** — lapsed-user win-back, "we miss you," return-incentive offers. Sensitive — these recipients haven't engaged in months and SMS arrives uninvited. Highest opt-out risk of the four subs.

4. **Event invitation** — webinar invites, AMA announcements, launch-event RSVPs, beta-access invitations to audience members opted in for marketing. Includes time-sensitive registration windows.

Subscriber confirmation (welcome SMS after marketing opt-in) is intentionally not a separate sub — it ships paired with the first marketing send context, not as a standalone use case. Affiliate/referral SMS is intentionally not a Marketing sub — per D-390 it routes to Account events because the trigger is account-event-driven, not campaign-driven.

## 3. Voice patterns observed

Strong indie SaaS marketing SMS reads as **founder-direct** — short, factual, single clear action. Voice that works: "We just shipped Brand Studio. First 100 get 30% off — link inside." Voice that fails: "🔥🔥 BIGGEST DROP OF THE YEAR!!! Don't miss out!!!"

Length: typically 80-160 characters. Multi-segment SMS (>160) tolerated for product launches with context; less so for promotional offers.

Urgency cues: legitimate scarcity ("First 100 spots") works; false urgency ("Don't miss out!" without an actual deadline) erodes trust.

Personalization tokens used minimally — first name occasionally, never deep merge data. Indie SaaS marketing SMS isn't where heavy templating earns its keep.

Anti-patterns to flag for message authoring:
- ALL CAPS subject phrases
- Multiple exclamation points
- "BIGGEST" / "BEST EVER" / "DON'T MISS"
- Manufactured countdown language
- Emojis substituting for words

## 4. B2B vs B2C variations

Pure B2B SaaS rarely sends marketing SMS — buyer journeys run through email and LinkedIn. B2B exceptions: product-launch SMS to a tight audience, beta-invite SMS, customer-conference reminders.

B2C SaaS (consumer apps, creator tools, fitness, productivity) sends marketing SMS more freely. Direct-to-consumer apps are the heaviest users.

Indie SaaS founders span both, but our launch audience leans B2C and creator-economy more than enterprise-targeting B2B. Templates should default to B2C-shaped voice with B2B variations noted where the shape changes (e.g., re-engagement for B2B reads more "checking in on your account" than "we miss you").

## 5. Compliance constraints / TCR considerations

- **Separate campaign required.** Marketing registers as its own TCR campaign, distinct from transactional. EIN required for TCR Marketing registration. RelayKit gates Marketing behind EIN per existing D-numbers.
- **Explicit opt-in mandatory.** TCPA requires explicit consent for marketing SMS — transactional opt-in does NOT cover marketing. Two consent paths must be tracked separately in the consent ledger.
- **STOP language required in every marketing SMS.** "Reply STOP to opt out" or equivalent. Non-negotiable per carrier compliance scanning.
- **Frequency disclosure expected.** "Up to 4 msgs/month" or equivalent at opt-in time. Not required in every send but expected at consent moment.
- **SHAFT-C blocked.** Even with explicit consent, marketing SMS cannot contain sex, hate, alcohol (varies by state), firearms, tobacco, or controlled-substance content. Carriers scan and block.
- **Quiet hours.** Default 8am-9pm recipient local time. State laws vary; some require 9am start. RelayKit should ship with conservative default and document state-specific tightening.
- **Public URL shorteners discouraged.** Bit.ly and similar increase carrier suspicion. Branded short links (or full URLs) preferred.

Pricing implication: $10/mo over the transactional $19/mo per existing pricing model. **Note (Session 93):** the symmetric campaign model — Marketing-only customer pays $19/mo, not $29/mo — is captured as a Pri 1 BACKLOG entry pending pricing reframe work. Current copy "Marketing adds $10" is wrong-shaped for marketing-only customers; the underlying model is "$19 = one campaign; $10 = second campaign added."

## 6. Open questions / followups

- **Subscriber confirmation as its own sub** — **RESOLVED** (PM judgment, 2026-05-16). Folds with first marketing send. No separate sub.
- **Affiliate/referral SMS** — **RESOLVED per D-390.** Routes to Account events, not Marketing. Trigger is account-event-driven (a referral signup), not campaign-driven.
- **Birthday/anniversary marketing** — **RESOLVED** (PM judgment, 2026-05-16). Folds into Promotional offer sub.
- **One-time launches vs ongoing campaigns** — **RESOLVED** (PM judgment, 2026-05-16). Voice handles both shapes without special treatment.

## 7. Notable references

- TCR (The Campaign Registry) — Marketing campaign registration requirements + SHAFT-C definitions
- TCPA — Telephone Consumer Protection Act marketing consent rules
- CTIA Messaging Principles and Best Practices — carrier-level compliance baseline
- Klaviyo SMS template library — e-comm-shaped reference, useful for anti-patterns and what NOT to ship
- ConvertKit/Kit messaging guidelines — creator-economy SMS patterns
- Sinch Marketing campaign registration documentation — specific to our carrier
