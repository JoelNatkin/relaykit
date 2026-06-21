## Influencer marketplaces / brand-creator matchmaking
**Vertical:** Creator economy & community
**Bucket:** Conditional
**URL slug:** /for/influencer-marketplaces

### What this builder is making
A two-sided platform where brands discover, invite, and contract creators for paid campaigns, and creators browse listings, apply or accept invites, submit content for approval, and get paid — the AspireIQ / GRIN / Upfluence / Collabstr / Statusphere shape, often verticalized (a marketplace just for beauty UGC, fitness micro-influencers, or a specific region). The platform tracks the campaign lifecycle on both sides: application → acceptance → content brief → draft submission → revision/approval → publish → performance → payout, usually with Stripe Connect escrow underneath. The builder runs both a brand-facing dashboard ("which creators are mid-revision, who's owed money") and a creator-facing flow ("you've been invited, your draft is due, you've been paid").

### Why they need SMS
The creator side is mobile-first and lives in their phone, not in a campaign-management inbox — a brand invite that sits unread for three days is a slot the brand fills with someone else, and a draft-due reminder that lands in email gets buried under brand pitches. The moments that move money — "you've been accepted," "revisions requested, due tomorrow," "payout sent" — are time-sensitive and high-consequence for a gig worker, and SMS is the channel a creator actually reacts to in minutes. Phone verification at creator signup is also table stakes for a marketplace that pays real money to real people.

### Message categories
1. customer-support — the campaign-status spine (invited, accepted, revisions requested, approved) is ticket-shaped two-way status between brand and creator; this is where most marketplace sends live, and several need new corpus homes.
2. account-events — payout sent, payment failed (brand's card for funding escrow), creator account suspended/verified — the money-and-lifecycle layer that drives creator trust and brand churn.
3. waitlist — campaign slots are capacity-limited; an invited creator has a claim window before the brand moves on, which maps cleanly onto the claim/grace/lapse lifecycle.
4. verification — phone-ownership proof at creator signup and step-up before payout-detail changes (bank/PayPal edits), a real fraud surface on a paying marketplace.
5. community — creator onboarding sequence (welcome, first action, week-1) when the platform nurtures a creator roster as a community.
6. appointments — only where the marketplace schedules live moments (brand-creator strategy calls, content shoot dates).
7. marketing — second registration only: re-engaging lapsed creators or announcing new high-value campaigns to an opted-in roster, never cold recruitment.
Excluded: order-updates (no physical-goods shipping lifecycle — product seeding exists but is a brand logistics edge case, not the platform's core send); team-alerts (no on-call/incident/shift surface inherent to a matchmaking marketplace — an internal ops team could use it but it isn't the product).

### Workflows

**Creator phone verification at signup**
Proves a new creator owns the number before they can be paid.
Sequence:
1. verification:verification-code — "{{business_name}} (the marketplace)" — sent when a creator enters their phone during onboarding; code, no STOP/HELP.

**Payout-detail change step-up**
Guards against account-takeover before money routing changes.
Sequence:
1. verification:confirmation-code — "{{business_name}}" — sent before a creator's bank/PayPal/payout method edit is saved.

**Campaign invite and acceptance**
Gets a hand-picked creator into a brand's campaign before the slot is filled by someone else.
Sequence:
1. STRETCH:waitlist:your-turn — "Campaign invite" — sent when a brand invites a specific creator; "{{workspace_name}}: {{brand}} invited you to {{campaign_name}}. Accept your spot: {{claim_link}}".
2. STRETCH:waitlist:grace-expiring — "Invite expiring" — sent when the invite window is about to lapse so the brand can reassign.
3. GAP:application-accepted — "Application accepted" — sent when a brand approves a creator who applied (the inverse of an invite: creator initiated, brand said yes).
Variable aliases (only where the default example would feel wrong):
- claim_link: "the invite-accept link"
- queue_position: not used here

**Application declined / not selected**
Closes the loop honestly when a creator applied but wasn't chosen, so the roster stays warm.
Sequence:
1. GAP:application-declined — "Application update" — sent when a brand passes on an applicant.

**Content brief and draft due**
Keeps an accepted creator on deadline so the brand's campaign ships on time.
Sequence:
1. GAP:brief-ready — "Campaign brief ready" — sent when the brief/contract is finalized and the creator can start.
2. GAP:deliverable-due — "Draft due" — sent ahead of the content-submission deadline.
3. GAP:deliverable-overdue — "Draft overdue" — sent when the deadline passes without a submission.

**Content review cycle**
Moves a submitted draft through brand approval — the core back-and-forth of the marketplace.
Sequence:
1. STRETCH:customer-support:agent-response — "Revisions requested" — sent when the brand asks for changes; "{{workspace_name}}: {{brand}} requested changes on {{campaign_name}}. View: {{ticket_link}}".
2. GAP:content-approved — "Content approved" — sent when the brand approves the draft for posting.
3. GAP:go-live-reminder — "Time to post" — sent when an approved creator needs to publish by the scheduled go-live.

**Payout lifecycle (creator side)**
Pays the creator and tells them the money moved — the single highest-trust SMS on the platform.
Sequence:
1. GAP:payout-sent — "Payout sent" — sent when a payment is released to the creator after approval/publish.
2. GAP:payout-failed — "Payout issue" — sent when a payout bounces (stale bank/PayPal details) and the creator must fix routing.

**Escrow funding (brand side)**
Keeps a campaign from stalling because the brand's funding card failed.
Sequence:
1. account-events:payment-failed — "Funding declined" — sent when the brand's card for funding campaign escrow is declined.
2. account-events:subscription-confirmed — "Plan updated" — sent when the brand changes its platform plan.

**Creator account security and lifecycle**
Protects and informs the creator's account.
Sequence:
1. account-events:new-device-sign-in — "New sign-in" — sent when the creator's account is accessed from a new device.
2. account-events:account-suspended — "Account suspended" — sent if a creator account is suspended for policy/fraud review.

**Creator onboarding nurture**
Activates a newly joined creator so they complete a profile and accept a first campaign.
Sequence:
1. community:welcome — "Welcome" — sent on join (sender frame is the marketplace's own name).
2. community:first-action — "Finish your profile" — sent 24-48h later, reframed toward completing a creator profile.
3. community:week-1-check-in — "One week in" — sent at day 7.
Variable aliases (only where the default example would feel wrong):
- community_name: "the marketplace name"

**Roster re-engagement (second registration / marketing)**
Wins back a lapsed creator or surfaces a standout campaign to an opted-in roster — marketing-consented only.
Sequence:
1. marketing:re-engagement — "We've missed you" — sent to a lapsed, marketing-opted-in creator.
2. marketing:promotional-offer — "New campaign for you" — sent only to creators who opted into marketing, never cold.

### Message gaps

**GAP:application-accepted**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (customer-support family — applicant-initiated approval)
- **Proposed universal name:** "Application accepted" (display alias)
- **Why:** an invite (platform/brand reaches out) and an application acceptance (creator reaches out, brand approves) are distinct moments; the waitlist your-turn stretch only covers the invite direction.

**GAP:application-declined**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (customer-support family)
- **Proposed universal name:** "Application update" (display alias)
- **Why:** closing the loop on a passed-over applicant is a real, frequent send with no corpus equivalent.

**GAP:brief-ready**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** "Campaign brief ready" (display alias)
- **Why:** the contract/brief handoff is the marketplace's "now you may start" signal, distinct from acceptance.

**GAP:deliverable-due**
- **Classification:** Universal miss
- **Proposed corpus home:** customer-support:deliverable-due (or a shared deadline-reminder primitive)
- **Proposed universal name:** "Deliverable due"
- **Why:** deadline-on-an-assigned-task reminders recur across gig/marketplace/agency verticals and have no corpus message.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your draft for {{campaign_name}} is due {{due_date}}. Submit: {{action_link}} Reply STOP to opt out.`
  - Friendly: `Heads up - your {{campaign_name}} draft is due {{due_date}}. Submit it here: {{action_link}} Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: {{campaign_name}} draft due {{due_date}}. {{action_link}} STOP to opt out.`
- **New variables:** `{{campaign_name}}` — the campaign the deliverable belongs to, budget ~28 chars, source: campaign record, example "Summer Skincare". `{{due_date}}` — deliverable deadline, budget ~16 chars, source: campaign schedule, example "Fri Jun 26".

**GAP:deliverable-overdue**
- **Classification:** Universal miss
- **Proposed corpus home:** customer-support:deliverable-overdue
- **Proposed universal name:** "Deliverable overdue"
- **Why:** the past-deadline nudge is operationally separate from the pre-deadline reminder and gates payout.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your {{campaign_name}} draft is overdue. Submit now to keep your spot: {{action_link}} Reply STOP to opt out.`
  - Friendly: `Your {{campaign_name}} draft is past due - submit soon to hold your spot: {{action_link}} Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: {{campaign_name}} draft overdue. {{action_link}} STOP to opt out.`

**GAP:content-approved**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** "Content approved" (display alias)
- **Why:** brand approval of a submitted draft is the marketplace's key "you're cleared to post / payout pending" state, with no corpus message.

**GAP:go-live-reminder**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** "Time to post" (display alias)
- **Why:** approved content frequently has a scheduled publish date the creator must hit; distinct from the draft deadline.

**GAP:payout-sent**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:payout-sent
- **Proposed universal name:** "Payout sent"
- **Why:** money-out-to-a-recipient (gig pay, affiliate payout, marketplace seller earnings) is a high-trust transactional moment with no corpus message; account-events only covers refunds/billing-in.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your payout of {{payout_amount}} for {{campaign_name}} was sent to your {{payout_method}}. Reply STOP to opt out.`
  - Friendly: `Good news - your {{payout_amount}} payout for {{campaign_name}} is on its way to your {{payout_method}}. Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: {{payout_amount}} payout sent to your {{payout_method}}. STOP to opt out.`
- **New variables:** `{{payout_amount}}` — amount paid to the creator, budget ~10 chars, source: payment record, example "$450". `{{payout_method}}` — destination, budget ~14 chars, source: creator payout settings, example "bank account". `{{campaign_name}}` — as above.

**GAP:payout-failed**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:payout-failed
- **Proposed universal name:** "Payout failed"
- **Why:** an outbound payment that bounces on stale routing details needs the recipient to act; no corpus message covers money-out failures (payment-failed is money-in/card-decline).
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your payout couldn't be sent - check your payout details: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} payout didn't go through. Update your payout details here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Payout failed. Fix details: {{account_link}} STOP to opt out.`

**STRETCH:waitlist:your-turn**
- **Classification:** Stretch
- **Proposed corpus home:** waitlist:your-turn — "your spot opened, claim it" fits the invite-with-a-claim-window shape, but the corpus copy implies the user was passively queued, whereas a campaign invite is an active brand pick of a specific creator. Acceptable reframe if the registry layer adds an invite-specific alias.
- **Proposed universal name:** "Campaign invite" (display alias for waitlist:your-turn)
- **Why:** a capacity-limited invite with a claim window is genuinely waitlist-shaped; only the "who initiated" framing differs.

**STRETCH:waitlist:grace-expiring**
- **Classification:** Stretch
- **Proposed corpus home:** waitlist:grace-expiring — "your spot is open for X longer" maps to an expiring invite, but again frames the recipient as a queued waiter rather than an invited creator.
- **Proposed universal name:** "Invite expiring" (display alias for waitlist:grace-expiring)
- **Why:** the expiring-claim-window mechanic is identical; framing is the only gap.

**STRETCH:customer-support:agent-response**
- **Classification:** Stretch
- **Proposed corpus home:** customer-support:agent-response — "your ticket has a reply, view it" structurally matches "the brand left revision notes, view them," but the corpus copy is support-ticket-framed, not campaign-feedback-framed.
- **Proposed universal name:** "Revisions requested" (display alias for customer-support:agent-response)
- **Why:** brand-to-creator revision notes are a threaded reply on a shared record — the same primitive as an agent reply — needing only a campaign-feedback alias.

### Content constraints
- Both sides must have a relationship with the platform before any send: a creator who signed up and opted in, or a brand whose account is active. No texting a creator the platform scraped or sourced externally.
- No unsolicited cold recruitment by SMS. "We found you on TikTok, want to join?" blasts to creators who never registered are prohibited regardless of how transactional the wording looks.
- Consent hygiene on BOTH sides: creators opt in (and can STOP) for campaign-status texts; brands opt in for their own account/funding texts. Track each side's consent separately — one side opting in does not consent the other.
- Marketing-toned sends (re-engagement, "new campaign for you" pushes) require separate explicit marketing consent and a second campaign registration (TCR: MARKETING, EIN-gated). Campaign-status texts to enrolled creators stay transactional.
- Phone verification at signup carries no STOP/HELP (2FA carve-out); everything else carries STOP.
- No SHAFT-C content; nothing about the brand's product category that drifts into promotion inside a transactional body.
- Payout-amount and payout-method belong in the body only at the level shown ("$450", "bank account") — no full account numbers or credentials.
- A2P 10DLC: each message-purpose campaign registers separately; transactional campaign-status traffic and marketing recruitment cannot share one registration.

### Disambiguation
The neighbor that tips this from Conditional toward Not-yet is a creator-recruitment / lead-gen tool whose whole job is cold outreach to creators who never signed up — that's the prohibited blast, and a platform built around it is not eligible. What keeps influencer marketplaces in Conditional rather than Clear is exactly the two-sided consent surface: a single opt-in on the brand side does not authorize texting creators, and vice versa, so the builder has to prove consent provenance per recipient per side. The line to watch is "transactional campaign-status to an enrolled, opted-in user" (acceptable: you applied, here's your acceptance) versus "discovery/recruitment to a sourced contact" (non-compliant: we found your profile, here's a pitch) — identical-looking copy, opposite consent posture. Affiliate/referral marketplaces and UGC-only seeding platforms are adjacent and follow the same rule; the moment any of them text a contact who is a prospect rather than a member, the send is cold outreach no matter how it's worded.

### Sources
https://www.aspire.io/
https://www.aspire.io/influencers
https://grin.co/product/influencer-payment-platform/
https://www.upfluence.com/creator-marketplace
https://www.joinstatus.com/
https://collabstr.com/alternatives/aspireIQ
https://impact.com/influencer/upgrade-influencer-campaigns-with-creator-v1-5/
https://help.impact.com/brand/what-would-you-like-to-learn-about/creator-program/recruit-creators/invite-creators-to-your-campaign
https://later.com/influencer-creator-program/
https://influenceflow.io/resources/influencer-content-approval-workflows-the-complete-2026-guide/
https://influencermarketinghub.com/content-approval-workflow-influencer-posts/
https://kb.influentials.com/en/articles/73500-payments
https://www.creatoriq.com/blog/influencer-payment-methods
https://influencerdb.net/influencer-marketing-insights/sms-marketing/
https://www.10dlc.org/en/home/A2PConsent
https://help.twilio.com/articles/4408675845019-SMS-Compliance-and-A2P-10DLC-in-the-US
https://www.apten.ai/blog/a2p-dlc-compliance-2026
https://www.termsfeed.com/blog/a2p-10dlc-compliance/
