## Dating / matchmaking apps
**Vertical:** Creator economy & community
**Bucket:** Not yet, maybe not ever
**URL slug:** /for/dating-apps
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.

### What this builder is making
A dating or matchmaking product where users build a profile, get paired (by an algorithm or a human matchmaker), and message inside an in-app inbox — spanning swipe-style consumer apps (SkaDate-style scripts, white-label builders) and matchmaker CRMs (SmartMatchApp-style) that schedule dates and collect post-date feedback. The core objects are the profile, the match, the conversation thread, and the scheduled date. Engagement lives and dies on bringing a user back the moment a match or message arrives.

### Why they need SMS
A new match or first reply is only valuable inside a short window — when a match responds hours later, the reply lands as a notification and the recipient checks the app within roughly 30 minutes, so a dead push notification means a dead conversation. Push fails silently when notifications are disabled or the app is uninstalled, while SMS reaches the user's lock screen regardless, making it the recovery channel for re-engagement and phone-verification at signup. For matchmaker CRMs, SMS is the channel that gets a scheduled date confirmed and a post-date feedback survey answered.

### Message categories
1. verification — phone-ownership proof at signup is near-universal in dating; carriers scrutinize the vertical hard, and 2FA-category traffic is the cleanest, least-filtered lane available to a dating sender.
2. account-events — new-match and new-message alerts that pull a user back, plus the security signals (new device sign-in) that matter heavily in a vertical full of impersonation and account-takeover.
3. waitlist — invite-only and "apply to join" dating products (curated/exclusive apps, matchmaker intake) run literal waitlists with position and "your turn" notifications.
4. appointments — matchmaker CRMs schedule actual dates and meetings; confirmation, reminder, reschedule, and post-date feedback map cleanly onto the appointment lifecycle.
5. community — events apps and singles-community products run live mixers and member onboarding.
Excluded: order-updates (no physical fulfillment), team-alerts (no internal ops/on-call surface for end users), customer-support (possible but secondary; not a defining dating workflow), marketing (promotional SMS in the dating vertical is the single highest-risk traffic carriers police — SHAFT-adjacent, spam-prone — and is effectively off the table for this sub-vertical).

### Workflows

**Phone verification at signup**
Proves the new user controls the phone number, the table-stakes anti-fraud gate in a vertical where roughly 1 in 10 profiles is a scammer.
Sequence:
1. verification:verification-code — "Your dating app code" — one-time code sent the moment the user enters their number during onboarding.
Variable aliases:
- business_name: "Sparkline" (the app's brand name)

**Step-up confirmation for sensitive changes**
Re-verifies the user before a phone-number change, email change, or account-recovery action — the actions an account-takeover attacker would attempt.
Sequence:
1. verification:confirmation-code — "Your dating app" — code required before a sensitive profile/security change commits.
2. verification:recovery-code — "Your dating app" — code sent when a locked-out user recovers their account.

**New match alert**
Brings the user back at the highest-intent moment — a mutual match just formed and both parties are most likely to engage now.
Sequence:
1. STRETCH:account-events:new-device-sign-in — "Sparkline" — repurposed as a "you have a new match" pull-back; corpus has no match/connection event. Flagged in Message gaps as a GAP, not used as a stretch (see below).

Note: the new-match moment is documented as **GAP:new-match-alert**, not a stretch of any existing corpus message — there is no account-events message whose meaning is adjacent enough to reframe.

**New message alert**
Recovers a stalled conversation when a match replies and the recipient's push is off or missed.
Sequence:
1. GAP:new-message-alert — "Sparkline" — sent when a match sends a message and no in-app read has occurred within a window.

**New-device security alert**
Warns the user when the account is accessed from an unrecognized device — high-value in dating because of impersonation and stalking risk.
Sequence:
1. account-events:new-device-sign-in — "Sparkline" — sent on sign-in from an unrecognized device, with a secure-account link.

**Lifecycle and billing**
Keeps a paying subscriber active — premium tiers (boosts, unlimited likes, see-who-liked-you) are the dating revenue model.
Sequence:
1. account-events:payment-failed — "Sparkline" — card declined on a premium renewal.
2. account-events:trial-ending — "Sparkline" — premium trial ends in a few days.
3. account-events:subscription-confirmed — "Sparkline" — renewal or plan change confirmed.
4. account-events:account-suspended — "Sparkline" — account suspended (e.g. after a safety/abuse report).

**Invite-only / curated access waitlist**
Runs the "apply and wait for your turn" flow that exclusive and curated dating apps and matchmaker intake use to gate membership.
Sequence:
1. waitlist:joined — "Sparkline" — confirms the applicant is on the list.
2. waitlist:position-update — "Sparkline" — they moved up the queue.
3. waitlist:almost-up — "Sparkline" — their turn is approaching.
4. waitlist:your-turn — "Sparkline" — a spot opened; claim it.
5. waitlist:grace-expiring — "Sparkline" — the open spot is about to lapse.
6. waitlist:missed — "Sparkline" — spot lapsed; rejoin option.

**Matchmaker date scheduling (CRM)**
The human-matchmaker workflow: a matchmaker arranges a date between two clients and drives confirmation and reminders through SMS.
Sequence:
1. appointments:confirmation — "Sparkline Matchmaking" — the arranged date is confirmed.
2. appointments:reminder-distant — "Sparkline Matchmaking" — reminder the day before the date.
3. appointments:reminder-proximate — "Sparkline Matchmaking" — reminder about an hour before.
4. appointments:reschedule-confirmation — "Sparkline Matchmaking" — date moved to a new time.
5. appointments:cancellation-confirmation — "Sparkline Matchmaking" — date cancelled, rebook option.
6. appointments:no-show-follow-up — "Sparkline Matchmaking" — one party didn't show; rebook prompt.
7. appointments:post-appointment — "Sparkline Matchmaking" — post-date feedback survey, the matchmaker's core data source.
Variable aliases:
- provider_name: "your match" (the other client, not a service provider)
- feedback_link: link to the post-date feedback survey

**Singles event / mixer**
The community-event side of dating: in-person mixers, speed-dating nights, singles-community onboarding.
Sequence:
1. community:event-invitation — "Sparkline Singles" — new mixer posted, RSVP.
2. community:live-event-reminder — "Sparkline Singles" — the mixer starts shortly, join/arrive link.
3. community:welcome — "Sparkline Singles" — welcome on joining the singles community.
Variable aliases:
- community_name: "Sparkline Singles"

**Re-engagement of a lapsed user**
Pulls back a user who has gone quiet — but in dating this collides with the marketing-category restriction; see content constraints.
Sequence:
1. GAP:dormant-activity-recap — "Sparkline" — transactional "you have activity waiting" pull-back that does NOT carry promotional framing (the marketing-category re-engagement message is too risky for this vertical).

### Message gaps

**GAP:new-match-alert**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** "New match" (display alias for dating)
- **Why:** the single most important dating notification — a mutual connection just formed — has no corpus equivalent; it is specific enough to dating/social that it belongs in a sub-vertical layer rather than core corpus.
- **Status:** FUTURE

**GAP:new-message-alert**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:new-message-alert
- **Proposed universal name:** "New message"
- **Why:** "someone messaged you, come back" is a generic in-app-inbox pull-back that recurs across dating, marketplaces, social, and community products — not dating-specific.
- **Draft variants:**
  - Standard: `{{workspace_name}}: You have a new message. Open the app to read and reply: {{message_link}} Reply STOP to opt out.`
  - Friendly: `You've got a new message on {{workspace_name}}. Read it here: {{message_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: New message. {{message_link}} STOP to opt out.`
- **New variables:** `{{message_link}}` — deep link to the conversation thread, budget ~24 chars, source: app inbox URL, example: "spk.ly/m/8tq"
- **Status:** FUTURE

**GAP:dormant-activity-recap**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:dormant-activity-recap
- **Proposed universal name:** "Activity waiting"
- **Why:** a transactional "there's account activity waiting for you" recap is a generic lifecycle pull-back that lets a sender re-engage a lapsed user without the marketing-category framing that dating cannot safely send.
- **Draft variants:**
  - Standard: `{{workspace_name}}: You have new activity waiting on your account. Take a look: {{account_link}} Reply STOP to opt out.`
  - Friendly: `It's been a while — you have activity waiting on {{workspace_name}}: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Activity waiting. {{account_link}} STOP to opt out.`
- **Status:** FUTURE

### Content constraints
- Dating is among the highest spam-abuse profiles in A2P messaging; carriers apply severe scrutiny to dating-vertical traffic, and registration/throughput is harder to obtain than for ordinary account-notification senders.
- TCR Special-category exposure: the dating vertical draws heightened carrier review and filtering. A dating campaign must register its use case precisely; any mismatch between the registered use case and actual message content is a top rejection reason. Treat dating registration as high-risk and assume carrier review of sample messages.
- SHAFT-C (sexually-oriented content) is auto-rejected and ineligible for resubmission. No adult, explicit, or suggestive content in any body — including match descriptions, profile snippets, or message previews. Never echo user-authored message content into an SMS body; send a neutral "you have a new message" pointer instead.
- Marketing-category SMS in dating is effectively off the table — promotional dating SMS is exactly the traffic carriers police hardest. Keep all sends transactional (verification, match/message events, security, billing, scheduling). Re-engagement must be framed as transactional activity, never as a promotion or offer.
- Verification bodies carry NO STOP/HELP language (2FA carve-out) and NO credentials beyond the one-time code; never include profile data in a verification message.
- Consent must be separate and unchecked-by-default; opt-in cannot be bundled into terms of service, and a privacy statement ("We do not share your data with third parties for marketing purposes") is expected at registration.
- No PII about other users in any body — do not include a match's name, age, location, or photo. Use neutral framing ("you have a new match") to avoid both filtering and safety/stalking risk.

### Disambiguation
This sits next to general "creator community" and "events" products, which are served, but dating is gated specifically because of its TCR Special-category abuse profile, not because the workflows are unusual — verification, match/message alerts, and date scheduling are individually clean. What looks allowed but isn't: even purely transactional dating traffic inherits the vertical's elevated scrutiny, so a sender cannot assume the same easy registration path as a SaaS account-notification campaign. Adjacent "singles event/mixer" community workflows are the least risky slice and most resemble the served events sub-vertical, but they still ride on a dating-classified brand. A pure matchmaker CRM (human matchmaker, business clients, appointment-style scheduling) is the closest to acceptable transactional use, yet still registers under the dating vertical's heightened-review regime.

### Sources
https://smartmatchapp.com/en/
https://smartmatchapp.com/dating/
https://smartmatchapp.com/features/
https://www.skadate.com/
https://getstream.io/blog/dating-app-features/
https://medium.com/dateworking/push-notifications-the-key-to-turning-your-matches-into-dates-455176f09d34
https://bird.com/blog/dating-apps-triggered-email-match
https://www.twilio.com/en-us/blog/match-com-anonymous-calling-text-messaging-html
https://help.match.com/hc/en-us/articles/7341373823771-Messages-How-to-Chat-with-Your-Matches
https://help.twilio.com/articles/4402972441243-Special-Use-Cases-for-A2P-10DLC
https://help.twilio.com/articles/15778026827291-Why-Was-My-A2P-10DLC-Campaign-Registration-Rejected-
https://verifysms.app/blog/protect-privacy-dating-apps/
https://www.textverified.com/verifications
