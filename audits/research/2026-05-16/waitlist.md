# Waitlist — Lead-Magnet Research
**Date:** 2026-05-16
**TCR mapping:** ACCOUNT_NOTIFICATION
**Classification:** workflow
**Authored by:** PM (Session 92)

## 1. Industry pattern observations

Waitlist SMS spans two distinct shapes that both fit the workflow classification:

- **Capacity-recovery waitlists** — restaurants ("your table is ready"), healthcare, salons and barbers, urgent care, walk-in services. Someone joined a list because they couldn't be served immediately. The text arrives when capacity opens.
- **Pre-launch waitlists** — beta access, early-access product launches, course enrollments, limited-availability releases, sold-out cohort signups. Someone joined because the product wasn't yet available. The text arrives when it ships or when they're admitted to the cohort.

Both share the same workflow shape: join → wait → ready → grace window → expire/missed → optional re-engagement. Cue density differs — capacity-recovery flows run minutes-to-hours; pre-launch flows run weeks-to-months — but the stage sequence holds.

Reference apps observed:
- Restaurant/venue waitlist: NextMe, Yelp Waitlist, Toast TablesReady, OpenTable Waitlist
- Healthcare/salon: Zocdoc waitlist, Vagaro, GlossGenius, Mindbody
- Beta/early-access SaaS: Replit Agent beta, V0 waitlist, Vercel previews, Linear's earlier early-access flow, RelayKit's own early-access waitlist (Session 90)
- Cohort/event: Maven (courses), Lu.ma (sold-out events), Cabal, Eventbrite/SeatGeek seat-release waitlists

The pre-launch SaaS pattern is by far the most relevant for RelayKit's launch audience (indie SaaS founders building waitlists for their own apps). Restaurant/healthcare patterns inform the workflow shape but vocabulary tilts SaaS.

## 2. Stages identified

Six stages cover both shapes cleanly. Each has a clear trigger cue.

1. **Joined waitlist** (trigger: user opts in via web form, in-app prompt, or SMS keyword) — confirmation of registration, position context if known, expectation-setting for next contact. Critical first-message: it's the promise that sets tone for the rest of the workflow. Skipping it breaks trust.

2. **Position update** (trigger: throughput moves the user up — optional stage, more common in capacity-recovery than pre-launch) — "you're #4," "you're next." Pre-launch flows often skip this and go straight to admission.

3. **Almost up** (trigger: time-window or position-threshold — "you're up in ~15 minutes" / "your beta access is ready next week") — heads-up that action is coming. Capacity-recovery sends this minutes out; pre-launch sends this days or hours out.

4. **Your turn** (trigger: capacity opens or admission threshold crossed) — the moment the user is being served. Includes an action token: link to claim, code to redeem, or instruction to respond.

5. **Grace window expiring** (trigger: user hasn't responded within configured window — e.g., 10 min for restaurants, 48 hours for beta) — last chance, explicit expiration timing. A meaningful share of conversions on capacity-recovery waitlists happen in this stage; under-leveraged in pre-launch flows.

6. **Missed / expired** (trigger: grace window closed without action) — notification of lapse, optional re-join CTA, optional refund or reschedule path. Tone matters: the missed message should not punish the user.

Optional re-engagement (post-missed, pre-launch flows) is intentionally not a 7th stage — it ships under Marketing as Re-engagement, not under Waitlist. Flagged in §6.

## 3. Voice patterns observed

Strong waitlist SMS reads as **active and present-tense** — never make the user calculate. "Your table is ready now. Head to the host stand within 10 minutes." Not "Your table has become available — please proceed to confirm within the configured grace period."

The first message sets the entire workflow tone: founder-direct works ("You're on the list. I'll text you when your TestFlight invite is ready."); generic transactional fails ("You have been added to the waitlist for [BUSINESS NAME]. We will contact you when a position becomes available.").

Length: stages 1, 4, 5 trend short (50-100 chars). Stages 2, 3 can run longer (100-160) when position context aids the decision.

Time cues are load-bearing — "ready now," "ready in 15 min," "within 48 hours" all dramatically change user behavior vs. unqualified "your turn is coming up." Specificity is the differentiator.

Personalization tokens: business name always, position number when known, action link when applicable. First name occasionally; deep merge data never (waitlist context doesn't benefit from more variables).

## 4. B2B vs B2C variations

Capacity-recovery waitlists are almost exclusively B2C — the user is a consumer waiting for service at a venue. Vocabulary is direct, action-oriented, time-tight.

Pre-launch SaaS waitlists span both — B2C consumer apps (Replit Agent, V0) and B2B SaaS (Linear AI features, new Vercel products). Voice register doesn't shift much across B2B/B2C in pre-launch shape since both audiences are sophisticated users opted in to receive product updates. The tonal difference is more founder-direct (indie/B2C) vs. company-voice (larger B2B) than B2B-vs-B2C per se.

Cohort waitlists (course/event) sit in a third register — community-flavored, often using "you're in!" language and including community-context links. Maven and Lu.ma do this well.

## 5. Compliance constraints / TCR considerations

ACCOUNT_NOTIFICATION as the TCR mapping is the right fit. Waitlist messages are transactional in the strict sense — the user requested to be notified, and the messages confirm or progress that request.

Carrier-side considerations:

- **STOP/START/HELP** is mandatory across all stages. Universal compliance requirement.
- **Opt-in moment** matters: the join-waitlist action is the opt-in. Wording at the join surface needs to disclose SMS notifications will follow. Standard double-opt-in is not generally required for waitlist (single-opt-in suffices when join-action is the consent), but RelayKit should make this configurable.
- **Frequency disclosure**: capacity-recovery flows can be minutes apart in busy venues. Higher-volume waitlists may trip frequency-perception thresholds at carriers. Most indie SaaS waitlists send 3-6 messages over the workflow lifecycle — well below problematic thresholds.
- **Grace-window timing** is a UX concern, not a compliance one — carriers don't enforce a minimum window. RelayKit's default timing recommendations ship as part of message authoring (stages 4→5 default windows per shape).

Critical line-hold: pre-launch waitlists must not drift into Marketing. "Your beta is ready" is ACCOUNT_NOTIFICATION; "BTW have you tried our other product?" appended is MARKETING and breaks the campaign mapping. Voice must stay tight.

## 6. Open questions / followups

- **Re-engagement stage placement.** Currently flagged as Marketing/Re-engagement after the missed stage. Should it remain there, or does a "rejoin waitlist?" CTA in the missed message belong inside Waitlist? Lean: keep it light inside Waitlist (single CTA, no marketing flavor), full re-engagement campaign lives under Marketing.
- **Position-update frequency cap.** No clear industry standard. Restaurants tend to send 0 position updates between join and ready; beta waitlists sometimes send weekly. RelayKit should ship a default cap (≤1 per week?) to prevent over-messaging.
- **Capacity-recovery vs. pre-launch as separate sub-workflows.** Both fit the workflow classification but have meaningfully different stage timing and message density. Worth considering whether the configurator surfaces these as two presets within Waitlist rather than one generic flow.
- **Cohort/event subset.** Cohort waitlists (course launches, event RSVPs) sit between capacity-recovery and pre-launch. Either folds into pre-launch with notes, or warrants explicit treatment.
- **"Your turn" action-token universality.** Most waitlists need a link or code in stage 4. Some (restaurants) just need "come to the host stand." The schema should allow both shapes — required action token field on stage 4 with a "physical-presence" type for venue waitlists.

## 7. Notable references

- NextMe waitlist text examples (capacity-recovery, restaurant)
- Lu.ma waitlist patterns (cohort/event)
- Maven course enrollment flow
- V0 / Replit Agent / Vercel beta waitlist patterns (pre-launch SaaS)
- RelayKit's own current early-access waitlist (Session 90; in-house reference for indie SaaS pattern)
- TCR ACCOUNT_NOTIFICATION definition and approved use cases
