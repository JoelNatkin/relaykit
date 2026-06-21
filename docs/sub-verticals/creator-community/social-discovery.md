## Social discovery / friendship apps (non-dating)

**Vertical:** Creator economy & community
**Bucket:** Not yet, maybe not ever
**URL slug:** /for/social-discovery
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.

### What this builder is making
A platform-friendship app that matches strangers into new platonic connections — Bumble BFF-style swiping, personality/MBTI compatibility (Boo, Friended), interest-and-activity matching, or small-group formation for real-world meetups (Timeleft dinners, Meetup-style recurring groups). The core loop is: profile + interests in → algorithmic or curated matches surfaced → mutual interest creates a connection → in-app chat → conversion to a real-world hangout or group event. Monetization is typically freemium subscription (boosts, unlimited matches, who-liked-you) plus event/dinner ticketing on the group-formation variants.

### Why they need SMS
The make-or-break moment is the new mutual match and the unanswered first message: friendship-app retention collapses when a match goes cold because the recipient never came back to the app to see it. A push notification dies on an uninstalled or muted app, but an SMS reaches a dormant user and pulls them back while the connection is still warm. SMS also carries the time-sensitive group-formation moments — "your dinner table is confirmed for tonight" — where a no-show ruins a curated 6-person event for everyone else.

### Message categories
1. account-events — new-match and new-message re-engagement is the retention spine; these are the lifecycle alerts that decide whether a connection survives. (Note: most match/message moments are GAPs, mapped below; account-events also covers billing/security for the freemium tier.)
2. community — group-formation apps (Timeleft, Meetup-style) run real events with RSVPs, reminders, and member onboarding that map cleanly to the community category.
3. waitlist — invite-gated and geo-gated launches ("we're not in your city yet") are common in this space; the waitlist lifecycle fits exactly.
4. verification — phone-ownership proof at signup is near-universal here and is the one category carriers least scrutinize for this vertical.
5. appointments — the curated-dinner / 1:1-meetup variants book real time slots that behave like appointments.

Excluded: order-updates (no physical fulfillment), team-alerts (no operational/on-call surface), customer-support (present but generic, not vertical-defining — folded out for ranking), marketing (promotional sends are EIN-gated and especially hazardous in a dating-adjacent Special category; a builder here should avoid the marketing lane entirely at launch).

### Workflows

**New mutual match**
Fires when two users both express interest and a connection is created — the single highest-value re-engagement moment.
Sequence:
1. GAP:new-match — "New match" — tells the user a new mutual connection is waiting and links them back in
Variable aliases (only where the default example would feel wrong):
- workspace_name: "Bunch"

**New message in a connection**
Fires when a matched user receives a chat message and hasn't opened the app.
Sequence:
1. GAP:new-message — "New message" — tells the user someone replied, without exposing the message body or sender's number

**Connection going cold (nudge)**
Fires when a match exists but neither party has messaged within a window — the app nudges before the connection lapses.
Sequence:
1. GAP:connection-nudge — "Connection nudge" — reminds the user a match is waiting on a first message
2. GAP:new-message — "New message" — if the other side breaks the ice, pulls the user back

**Phone verification at signup**
Standard phone-ownership check; gates account creation.
Sequence:
1. verification:verification-code — "Verification code" — one-time code at signup

**Login as second factor**
SMS step-up for returning users on a new device.
Sequence:
1. verification:login-code — "Login code" — sign-in code
2. account-events:new-device-sign-in — "New sign-in" — alerts the user if a sign-in wasn't them

**Invite-gated / geo-gated launch waitlist**
Many of these apps launch city-by-city or invite-only; users join a list and wait for their area or slot to open.
Sequence:
1. waitlist:joined — "Joined the list" — confirms they're on the list
2. waitlist:position-update — "Position update" — they moved up the queue
3. waitlist:almost-up — "Almost up" — their turn is approaching
4. waitlist:your-turn — "Your turn" — access opened, claim the spot
5. waitlist:grace-expiring — "Spot expiring" — the open spot is about to lapse
6. waitlist:missed — "Missed your spot" — lapsed without action, rejoin offer
Variable aliases (only where the default example would feel wrong):
- workspace_name: "Timeleft"

**Group / dinner formation and reminders**
For the small-group variants (curated dinners, recurring activity groups), members RSVP to an event and get reminders so the table fills.
Sequence:
1. community:event-invitation — "New event" — a new dinner/meetup is posted, RSVP
2. community:live-event-reminder — "Event reminder" — fires shortly before the event begins, with the join/location link
Variable aliases (only where the default example would feel wrong):
- community_name: "Timeleft Tuesdays"
- event_name: "Dinner with 5 strangers"

**Curated 1:1 / small-group booking (appointment variant)**
The matchmaking-style variants book a specific time slot with a specific group or partner.
Sequence:
1. appointments:confirmation — "Booking confirmed" — the slot is booked
2. appointments:reminder-distant — "Reminder (day before)" — day-before nudge
3. appointments:reminder-proximate — "Reminder (1 hour)" — hour-before nudge
4. appointments:no-show-follow-up — "No-show follow-up" — missed it, rebook offer
Variable aliases (only where the default example would feel wrong):
- provider_name: "your dinner group"

**New-member onboarding (community-side variant)**
For apps built around a standing community/group rather than 1:1 matching, the member onboarding ladder applies.
Sequence:
1. community:welcome — "Welcome" — sent on join
2. community:first-action — "First action" — nudge to introduce yourself / complete profile
3. community:resource-pointer — "Resource pointer" — how-it-works / safety guide
4. community:week-1-check-in — "Week 1 check-in" — how's it going after a week

**Freemium billing lifecycle**
Subscription churn-critical alerts for the paid tier.
Sequence:
1. account-events:trial-ending — "Trial ending" — trial about to end
2. account-events:payment-failed — "Payment failed" — card declined, update to keep premium
3. account-events:subscription-confirmed — "Subscription confirmed" — renewal/plan change confirmed

**Trust & safety enforcement**
Friendship/social-discovery apps moderate heavily; account actions need to reach the user.
Sequence:
1. account-events:account-suspended — "Account suspended" — account action taken, link to details/appeal
2. community:moderation-update — "Moderation update" — community-side safety/policy notice

### Message gaps

**GAP:new-match**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events
- **Proposed universal name:** New match / new connection
- **Why:** the defining re-engagement event for any matching product (friendship, social, marketplace) has no corpus message
- **Draft variants:**
  - Standard: `{{workspace_name}}: You have a new match. Open the app to see who: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Good news from {{workspace_name}} - you've got a new match waiting. See who: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: New match waiting. {{account_link}} STOP to opt out.`
- **Status:** FUTURE

**GAP:new-message**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events
- **Proposed universal name:** New message / unread message
- **Why:** "someone messaged you, come back" is a generic re-engagement need across social, marketplace, and community products and is absent from the corpus
- **Draft variants:**
  - Standard: `{{workspace_name}}: You have a new message. Read and reply here: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Someone messaged you on {{workspace_name}}. Read it here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: New message. {{account_link}} STOP to opt out.`
- **Status:** FUTURE

**GAP:connection-nudge**
- **Classification:** Vertical-specific
- **Proposed corpus home:** account-events (or community)
- **Proposed universal name:** Connection nudge (re-engage a stalled match)
- **Why:** the "you matched but never messaged" nudge is specific to two-sided social-discovery products and doesn't generalize cleanly to other verticals
- **Status:** FUTURE

### Content constraints
- TCR Special category. Social-discovery / friendship matching is treated by carriers as dating-adjacent; carrier systems do not distinguish friendship-discovery from romantic dating, so the campaign inherits the dating use-case scrutiny path.
- Special use cases require pre- or post-registration vetting/approval by MNOs (Mobile Network Operators) and can take up to several weeks beyond standard registration; throughput may be capped pending approval.
- Heightened enforcement risk: T-Mobile content-violation penalties run up to $10,000 per violation. Misclassifying as a Standard use case to dodge vetting risks blocking and fines.
- Never expose message bodies, sender phone numbers, or other users' identities in SMS — "new message" sends must be content-free pointers back into the app.
- No SHAFT-C content; nothing sexually suggestive even though the app is platonic — carriers cannot tell intent from content, so adult-adjacent phrasing draws blocks.
- Promotional/marketing sends are EIN-gated and require separate explicit consent; in a Special dating-adjacent category, a builder should avoid the marketing lane at launch entirely.
- Verification sends carry the 2FA carve-out: no STOP/HELP language in the body.
- Age-gating: many of these apps are 18+ or 17+; do not message numbers tied to unverified/underage accounts.

### Disambiguation
Distinguish from dating apps: the product matches people for platonic friendship, dinners, or activity groups, not romance — there is no romantic-intent signal in the UX. Distinguish from affinity communities (the Clear/Conditional community sub-verticals): an affinity community is a standing group with shared identity or purpose where members opt into a known group, whereas social-discovery surfaces strangers to each other algorithmically with no pre-existing relationship. The reason this sub-vertical sits in "Not yet, maybe not ever" despite the platonic framing is that carrier classification systems route on use-case shape, not stated intent: a swipe-match-chat loop between strangers is mechanically indistinguishable from a dating app, so it inherits the dating vertical's Special-category vetting, throughput caps, and elevated block risk. A builder cannot opt out of that scrutiny by declaring the app "friendship-only."

### Sources
https://www.introvrs.com/blog/bumble-bff-alternatives
https://techcrunch.com/2026/04/05/as-people-look-for-ways-to-make-new-friends-here-are-the-apps-promising-to-help/
https://huddlemeet.com/en/blog/friend-apps-comparison-2026
https://arewefriends.org/journal/best-friendship-apps-2026-compared
https://www.letsbunch.com/blog/best-social-apps-for-making-friends-2026/
https://www.meetup.com/blog/connections-meetups-powerful-new-friendship-tech/
https://help.meetup.com/hc/en-us/articles/40708711774221-What-notifications-Meetup-can-send
https://www.braze.com/resources/articles/meetup-activity-messaging
https://clevertap.com/blog/welcome-push-notifications-to-onboard-new-users/
https://www.truedialog.com/blog/standard-vs-special-10dlc-campaign-use-cases/
https://help.twilio.com/articles/11847054539547-A2P-10DLC-Campaign-Approval-Requirements
https://www.10dlc.org/tcr_quick_reference_guide.pdf
https://www.bandwidth.com/support/en/articles/12823087-10dlc-campaign-use-cases
https://textbolt.com/blog/10dlc-compliance/
https://help.match.com/hc/en-us/articles/27678657542299-SMS-Verification
