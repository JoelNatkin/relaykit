## Gyms / fitness studios (membership ops)
**Vertical:** Retail & hospitality
**Bucket:** Clear
**URL slug:** /for/gyms-fitness

### What this builder is making
A class-booking and membership-management platform for gyms, boutique studios (spin, yoga, pilates, CrossFit, barre), and independent trainers — the "Mindbody-for-X" shape: a schedule of classes with capacity, a waitlist, recurring membership/autopay billing, and check-in. The system tracks who booked which class, who's on the waitlist for a full session, whose card just failed at the monthly autopay run, and who hasn't checked in for weeks. SMS is wired into class reminders, waitlist spot-claiming, and dunning, with a separately-consented promotional lane for win-back and challenge campaigns.

### Why they need SMS
A spin class fills, a spot opens 90 minutes before start, and the first waitlisted member to claim it gets in — email is far too slow to catch that window, so the studio loses a paying seat and a member loses a class. The same urgency applies to class reminders (a no-show is an unfillable empty bike) and failed autopay (a silent decline becomes an involuntary churn at month-end). SMS gets read in minutes, which is exactly the latency these moments require.

### Message categories
1. appointments — class/session booking confirmations, reminders, and no-show follow-ups are the core transactional volume
2. waitlist — full-class spot-claiming with a hard grace window is a defining gym workflow, distinct from booking
3. account-events — membership autopay declines, renewals, and plan changes are churn-critical billing events
4. marketing — win-back, challenges, and promotional offers (separately consented, EIN-gated, TCPA-sensitive)
5. customer-support — member inquiries and account-issue resolution where a studio runs a help channel
Excluded: order-updates (no physical fulfillment in membership ops; retail/pro-shop is a different motion), team-alerts (staff/instructor scheduling is real but out of scope for the member-facing membership product — flag if builder also runs staff ops), community (studios have community energy, but member onboarding/event flows here are better served by appointments + marketing; revisit if a builder is primarily a fitness-community app), verification (phone verification at signup is plausible but generic, not gym-distinctive).

### Workflows

**Class booking confirmation**
Confirms a member's reserved spot in a specific class so they know it took.
Sequence:
1. appointments:confirmation — "Class booked" — sent on booking: "{{workspace_name}}: your class with {{provider_name}} is confirmed for {{appointment_time}}."
Variable aliases:
- provider_name: "Coach Mia / Vinyasa Flow" (instructor or class name, not a clinician)
- appointment_time: "Sat 9:00 AM"

**Class reminder (day before + hour before)**
Cuts no-shows on capacity-limited classes by nudging members ahead of the session, with a cancel path so the seat can recycle to the waitlist.
Sequence:
1. appointments:reminder-distant — "Class tomorrow" — day-before reminder with cancel link so a freed spot can go to the waitlist
2. appointments:reminder-proximate — "Class in 1 hour" — same-day nudge an hour out
Variable aliases:
- provider_name: "Coach Mia / 6pm Spin"
- cancel_link: "studio.app/cancel/..."

**Class cancellation / reschedule**
Handles a member dropping or moving a booked class and confirms the change.
Sequence:
1. appointments:cancellation-confirmation — "Class cancelled" — confirms the drop, offers rebook
2. appointments:reschedule-confirmation — "Class moved" — confirms a move to a new session time
Variable aliases:
- reschedule_link: "studio.app/book/..."

**No-show follow-up**
Re-engages a member who missed a booked class before the miss becomes a habit.
Sequence:
1. appointments:no-show-follow-up — "We missed you in class" — prompts a rebook with the instructor/class
Variable aliases:
- provider_name: "Coach Mia"
- reschedule_link: "studio.app/book/..."

**Post-class feedback**
Collects a quick rating after a session to surface instructor/class quality signal.
Sequence:
1. appointments:post-appointment — "How was class?" — feedback request after the session
Variable aliases:
- provider_name: "Coach Mia"
- feedback_link: "studio.app/rate/..."

**Waitlist spot-claim (full-class first-to-claim)**
The defining gym workflow: when a full class has a cancellation, the studio races the freed seat to waitlisted members and the first to claim within a grace window gets it.
Sequence:
1. waitlist:joined — "On the class waitlist" — confirms the member is queued for a full class
2. waitlist:position-update — "Waitlist: you moved up" — as others drop, position improves
3. waitlist:almost-up — "Almost your turn" — a seat is likely to open soon
4. waitlist:your-turn — "A spot opened — claim it" — a seat is free; claim now
5. waitlist:grace-expiring — "Spot still open for {{grace_window}}" — the claim window is closing; the seat recycles if unclaimed
6. waitlist:missed — "Spot filled — rejoin?" — the seat went to the next person; offer to rejoin the list
Variable aliases:
- queue_position: "#2 in line"
- wait_estimate: "the next class"
- grace_window: "10 minutes"
- claim_link: "studio.app/claim/..."
- rejoin_link: "studio.app/waitlist/..."

**Membership autopay decline (dunning)**
Catches a failed monthly membership charge before the silent decline becomes an involuntary cancellation at month-end.
Sequence:
1. account-events:payment-failed — "Membership payment didn't go through" — card declined, update payment to keep membership active
2. GAP:membership-paused-nonpayment — "Membership on hold" — if still unresolved, notify the member their membership is paused/suspended for non-payment (see Message gaps)
Variable aliases:
- card_last4: "4242"
- account_link: "studio.app/billing"

**Membership renewal / plan change confirmation**
Confirms a membership renewal, upgrade (e.g., 4x/mo to unlimited), downgrade, freeze, or cancellation went through.
Sequence:
1. account-events:subscription-confirmed — "Membership change confirmed" — renewal, plan change, freeze, or cancellation is set
Variable aliases:
- account_link: "studio.app/membership"

**Trial / intro-offer ending**
Nudges a member on a free trial or intro pack (common boutique acquisition motion) to convert before it lapses.
Sequence:
1. account-events:trial-ending — "Your intro offer ends soon" — trial/intro pack ends in {{days_remaining}} days, choose a membership
Variable aliases:
- days_remaining: "3"
- account_link: "studio.app/join"

**New device sign-in (account security)**
Flags a member-account login from a new device on the booking app.
Sequence:
1. account-events:new-device-sign-in — "New sign-in to your account" — security notice with secure-account link
Variable aliases:
- device_context: "a new phone, Austin TX"

**Membership win-back (lapsed member) — MARKETING, separate consent**
Promotional re-engagement of a member who cancelled or hasn't checked in for weeks — a comeback offer. Requires explicit marketing consent, distinct from booking/billing consent. TCPA-sensitive (see Content constraints).
Sequence:
1. marketing:re-engagement — "It's been a while — come back" — what's new / a comeback nudge to a lapsed member
Variable aliases:
- reengagement_link: "studio.app/comeback"
- business_name: "Iron Pulse Fitness"

**Promotional offer / challenge campaign — MARKETING, separate consent**
A sale window, membership promo, or studio challenge (e.g., 30-day challenge) sent to the opted-in marketing audience. Separate consent, EIN-gated, SHAFT-C clean.
Sequence:
1. marketing:promotional-offer — "Studio offer" — the offer and a claim link
2. marketing:event-invitation — "You're invited" — invite the opted-in audience to a studio event/challenge kickoff
Variable aliases:
- offer: "New Year unlimited, 20% off first 3 months"
- offer_link: "studio.app/offer"
- event_name: "30-Day Strength Challenge"

**Member support inquiry**
Where a studio runs a help channel, keeps members updated on an account question or issue.
Sequence:
1. customer-support:account-issue-resolved — "We fixed your account issue" — billing/booking issue found and fixed, no action needed
Variable aliases:
- workspace_name: "Iron Pulse Fitness"

### Message gaps

**GAP:membership-paused-nonpayment**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:membership-paused (sits alongside payment-failed and account-suspended; account-suspended exists but reads as a security/policy suspension, not a billing-hold escalation after a failed charge)
- **Proposed universal name:** Membership paused (non-payment)
- **Why:** dunning needs a distinct "we've paused you for non-payment, here's how to restore" step between the failed-charge alert and a full suspension; account-suspended doesn't carry the billing-restore framing
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your membership is paused for non-payment. Update your card to restore access: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} membership is on hold after a missed payment. Restore it here anytime: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Membership paused, payment needed. Restore: {{account_link}} STOP to opt out.`

### Content constraints
- Transactional lane (class booking/reminder/cancel, waitlist claim, membership billing/dunning, account security) is the Clear lane — operational consent at signup covers it; include "Reply STOP to opt out." in every body except 2FA carve-outs.
- Marketing lane (win-back, promos, challenges, transformation campaigns) requires SEPARATE, affirmative, purpose-specific marketing consent — never bundled with booking/billing consent. EIN-gated, SHAFT-C clean, second campaign registration (not an "upgrade").
- Gym/fitness is a heavily-litigated TCPA category: cases include Mack v. Orangetheory, Cline v. Ultimate Fitness, Steward v. Planet Fitness, and Life Time Fitness settlements ($10M-$15M range) — exposure is ~$1,500 per non-consented text. Surface this caution prominently on any marketing/win-back send.
- STOP suppression must be honored across all locations, instructors, and tools — a single un-suppressed path (e.g., a trainer texting from a personal phone) re-incurs per-text liability after opt-out.
- Imported/legacy member lists are high-risk for marketing sends: old records often lack provable marketing-consent artifacts — do not promote to imported lists without validated consent language.
- No promotional content in transactional bodies — keep dunning, reminders, and waitlist messages strictly operational (waitlist Missed message stays non-promotional per D-395).
- No health claims, no weight-loss/medical promises, no body-shaming in marketing bodies (SHAFT-C and brand-risk).

### Disambiguation
The transactional lane (class reminders, waitlist, membership autopay) is squarely Clear; what tips a send from Clear to Conditional is intent — the moment a message carries an offer, a comeback discount, or a challenge invite, it crosses into the marketing lane and inherits the separate-consent + TCPA-litigation burden. Neighboring sub-verticals: spa/salon/wellness-appointment booking is appointment-led but lacks the capacity-waitlist and recurring-membership-dunning shape that defines gyms; a pure fitness-content/community app (no booking, no billing) leans community + marketing and is a different bucket. "Win-back" looks like a natural extension of dunning but is NOT transactional — a lapsed-member comeback offer is promotional and must not ride the operational consent that covers the failed-payment alert. Staff/instructor shift scheduling is real adjacent volume but belongs to team-alerts and the staff-ops product, not the member-facing membership surface.

### Sources
https://www.mindbodyonline.com/business/education/product-waitlist-improvements
https://www.mindbodyonline.com/business/education/blog/fitness-wellness-businesses-master-sms-email-marketing
https://www.mindbodyonline.com/business/scheduling
https://support.mindbodyonline.com/s/article/How-to-opt-in-to-receive-auto-emails-reminders-and-notifications
https://sakari.io/blog/sms-marketing-for-gyms-member-retention-and-class-attendance-strategies-that-actually-work
https://sinch.com/engage/resources/sms-marketing/sms-templates-for-gyms-and-fitness-clubs/
https://www.textrequest.com/playbooks/fitness
https://www.eztexting.com/industries/fitness-gyms
https://optinfix.com/blog/gym-text-message-tcpa-compliance-2026-owners-guide
https://www.gymmaster.com/blog/failed-payment-reports/
https://help.perfectgym.com/hc/en-001/articles/39873890880017-Automation-Rule-Online-payment-completed-with-errors
https://gymdesk.com/blog/streamline-gym-billing-processes
https://llms.myaifrontdesk.com/fitness-studio-class-booking-integrations
