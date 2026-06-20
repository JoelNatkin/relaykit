## Marketing / advertising agencies
**Vertical:** Professional services
**Bucket:** Clear
**URL slug:** /for/marketing-agencies

### What this builder is making
An agency operations or client-management tool — a CRM, project/campaign tracker, or client portal — that a marketing, advertising, creative, or PR agency uses to run client engagements end to end. It tracks deals, retainers, briefs, creative deliverables, campaign launches, approval cycles, performance reports, and invoices, with each client account having its own project pipeline and account manager. The builder's customer is the agency communicating with its own roster of clients about the work — not the agency blasting promos to a client's end consumers.

### Why they need SMS
The whole engagement stalls on one thing: a client who hasn't approved the ad set, signed the brief, or answered the launch-go question — and that approval email is buried under thirty others while a paid media spend window closes. SMS lands the approve/revise ask on the decision-maker's phone with a reply keyword that moves the project forward, turning a three-day email lag into a same-hour decision. It wins here because agency timelines are gated on client sign-off, the audience is a known book of business (not cold leads), and the cost of a missed window is real ad dollars or a blown launch date.

### Message categories
1. customer-support — ticket-style lifecycle maps cleanly to brief/approval/revision request handling; the agency's day-to-day is reply-driven client back-and-forth
2. appointments — strategy calls, kickoffs, and review meetings are the agency's scheduled touchpoints
3. account-events — retainer billing, invoice failures, and contract lifecycle are churn-critical and email-buried
4. team-alerts — internal "ready for QA / client call in 15" coordination among account managers and creatives
5. marketing — only for the agency's own promotion to prospects/leads (separate-consent, EIN-gated); never client-promo-on-behalf
Excluded: order-updates (no physical fulfillment in agency client work), waitlist (no queue/scarcity model in retainer engagements), verification (agencies log clients into portals via the portal builder's own auth, not a use case the agency-comms tool drives), community (agency-client is 1:1 account work, not a member community)

### Workflows

**Creative/campaign approval request**
Gets a blocking client sign-off on a deliverable so the project can advance.
Sequence:
1. customer-support:ticket-received — "RelayKit Agency" — "Your ad set for {{brand}} is ready for review. Reply APPROVE or REVISE." sent when a deliverable enters the review stage (STRETCH — see gaps)
2. customer-support:agent-response — "Approval reply logged" — confirms the client's keyword reply was captured and the brief moved forward
Variable aliases:
- ticket_number: "Brief #4471"

**Revision round follow-up**
Chases an outstanding revision decision when the review window is going stale.
Sequence:
1. customer-support:proactive-outreach — "Revision pending" — "Your changes on {{brand}} are still waiting on a yes/no. Reply here." nudge after 24h of no response
2. customer-support:resolution-notification — "Approved & in production" — sent when the deliverable is signed off and pushed to production

**Campaign launch notification**
Tells the client the moment their paid campaign actually goes live.
Sequence:
1. customer-support:service-status-alert — "Campaign live" — "Your {{campaign_name}} campaign is live as of {{appointment_time}}." sent at go-live (STRETCH — see gaps)

GAP:campaign-go-live-confirmation — see Message gaps for the cleaner dedicated draft.

**Strategy call / kickoff scheduling**
Confirms and reminds the client of a booked strategy, kickoff, or review call.
Sequence:
1. appointments:confirmation — "Call confirmed" — confirms the strategy call time with the account manager
2. appointments:reminder-distant — "Call tomorrow" — day-before reminder with a reschedule link
3. appointments:reminder-proximate — "Call in 1 hour" — final nudge before a high-stakes review call
Variable aliases:
- provider_name: "Dana (your account lead)"
- appointment_time: "Thu Jun 25, 2:00pm"

**Missed-call rebook**
Recovers a no-show on a client review or strategy call.
Sequence:
1. appointments:no-show-follow-up — "Missed our call" — "We missed you on the {{brand}} review. Want to rebook with Dana?" with reschedule link

**Post-engagement / report-ready follow-up**
Closes the loop after a milestone or monthly report and invites the next conversation.
Sequence:
1. appointments:post-appointment — "How'd the review go?" — feedback ask after a delivered report or QBR
2. customer-support:csat-follow-up — "Rate this engagement" — satisfaction pulse after a project milestone

**Retainer invoice / payment recovery**
Recovers a failed retainer payment before the account lapses.
Sequence:
1. account-events:payment-failed — "Card declined" — retainer card declined, update-payment link
2. account-events:subscription-confirmed — "Retainer renewed" — confirmation once the retainer payment or renewal goes through
Variable aliases:
- account_link: "your client portal"

**Contract / retainer lifecycle**
Warns the client before a retainer term ends and confirms renewal or change.
Sequence:
1. account-events:trial-ending — "Retainer ending soon" — heads-up that the current retainer term ends in {{days_remaining}} days
2. account-events:subscription-confirmed — "Retainer updated" — confirms the renewal, upgrade, or change
3. account-events:account-suspended — "Account paused" — sent if the engagement is paused for non-payment

**Portal access alert**
Flags a new sign-in to the client portal for account security.
Sequence:
1. account-events:new-device-sign-in — "New portal sign-in" — new-device access alert on the client portal account

**Internal team coordination**
Keeps account managers and creatives in sync on client-facing deadlines.
Sequence:
1. team-alerts:system-alert — "Ready for QA" — internal ping that a deliverable needs QA before client send
2. team-alerts:escalation-ping — "Client call unconfirmed" — ACK-required ping when a client hasn't confirmed an imminent call
Variable aliases:
- alert_type: "Deliverable ready for QA"
- system_name: "Brand X campaign"

**Agency self-promotion (own prospects only)**
The agency markets itself to its own opted-in lead list — distinct from client work.
Sequence:
1. marketing:promotional-offer — "{{business_name}}" — promo to the agency's own prospect list (separate marketing consent, EIN-gated; never client-promo-on-behalf)

### Message gaps

**STRETCH:customer-support:ticket-received**
- **Classification:** Stretch
- **Proposed corpus home:** customer-support:ticket-received — fit gap: the corpus body frames a *support ticket* ("we'll reply soon"), but the agency use is an *approval request* asking the client to act (reply APPROVE/REVISE). The lifecycle shape fits; the verb and direction of action differ.
- **Proposed universal name:** Approval request
- **Why:** agency approval cycles are the highest-value SMS moment and the ticket-received frame undersells the call-to-action
- **Draft variants:**
  - Standard: `{{workspace_name}}: {{brand}} deliverable is ready for your review. Reply APPROVE or REVISE: {{ticket_link}} Reply STOP to opt out.`
  - Friendly: `Your {{brand}} work is ready to review. Reply APPROVE to ship it or REVISE for changes: {{ticket_link}} Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: {{brand}} ready to review. APPROVE/REVISE: {{ticket_link}} STOP to opt out.`
- **New variables:** `{{brand}}` — the client brand/account the deliverable belongs to, ≤24 chars, source: project record client field, example: "Acme Coffee"

**STRETCH:customer-support:service-status-alert**
- **Classification:** Stretch
- **Proposed corpus home:** customer-support:service-status-alert — fit gap: corpus body is a *degradation/outage* notice ("we're aware of a service issue"), but the agency use is a *positive go-live* announcement. Same "status changed, here's the state" shape, opposite valence; see the dedicated GAP draft below.
- **Proposed universal name:** Campaign go-live confirmation
- **Why:** launch-live is a routine, anticipated agency moment that the outage-framed status alert reads wrong for
- **Draft variants:** (see GAP:campaign-go-live-confirmation below — same need, cleaner home)

**GAP:campaign-go-live-confirmation**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:campaign-launched (or a generic "go-live" account-event); the corpus has no positive "your thing is now live" transactional message outside the promotional marketing:product-launch
- **Proposed universal name:** Go-live confirmation
- **Why:** many builders (agencies, SaaS onboarding, scheduled-publish tools) need to confirm a thing went live transactionally, without the promotional marketing register
- **Draft variants:**
  - Standard: `{{workspace_name}}: {{campaign_name}} is now live as of {{go_live_time}}. View it here: {{action_link}} Reply STOP to opt out.`
  - Friendly: `Good news - your {{campaign_name}} is live as of {{go_live_time}}. Take a look: {{action_link}} Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: {{campaign_name}} is live. {{action_link}} STOP to opt out.`
- **New variables:** `{{campaign_name}}` — name of the campaign/launch going live, ≤32 chars, source: campaign record, example: "Summer Flight"; `{{go_live_time}}` — timestamp it went live, ≤24 chars, source: launch event, example: "today 9:00am"

### Content constraints
- Standard A2P 10DLC / TCR rules apply; transactional client-comms register fits ACCOUNT_NOTIFICATION and CUSTOMER_CARE campaign types.
- Approval, status, scheduling, and billing messages to the agency's own client roster ride transactional consent (number provided in the engagement relationship) — keep bodies factual, no offers.
- Any message promoting the agency's services, or any bulk/promotional send, must register as the MARKETING campaign type with separate documented opt-in consent — verbal opt-in is not sufficient for marketing.
- Do not route client-end-consumer promotional campaigns through this transactional lane; that is a different consent regime and a separate TCR registration (see Disambiguation).
- No credentials, no discount/offer content in transactional bodies; content must match the registered use case or it is a violation.

### Disambiguation
The load-bearing line is who the recipient is. Agency-to-its-own-client about projects, approvals, schedules, and invoices is transactional account-notification work and stays Clear. The neighbor that flips this to a different (and stricter) regime is marketing-as-a-channel: the agency sending promotional bulk SMS to a *client's* end consumers — that is end-consumer marketing, requires express written consent collected by/for that client, and is a separate MARKETING TCR campaign, not this builder's lane. It also borders generic "project management" and "professional services CRM" sub-verticals; what keeps it specifically agency is the approval-cycle and campaign-launch cadence tied to a client book of business. A workflow that looks transactional but isn't: texting a client's customer list with an offer "from the agency's number" — that is the promo regime even though the agency operates the tool.

### Sources
https://www.pipedrive.com/en/blog/best-project-management-software-for-marketing-agencies
https://functionfox.com/7-best-agency-crm-software-that-actually-boost-client-growth/
https://www.bigcontacts.com/blog/best-crm-for-agencies/
https://agencyanalytics.com/blog/agency-client-management-software
https://improvado.io/blog/best-agency-management-software-for-marketing-agencies
https://textus.com/texting-guides/texting-guide-for-marketing-agencies
https://textus.com/texting-guides/sms-templates-for-advertising-agencies
https://textmagic.com/sms-solutions/marketing-agencies
https://5day.io/blog/client-onboarding-checklist-for-marketing-agencies/
https://synpost.synup.com/client-onboarding-process-for-marketing-agencies/
https://help.twilio.com/articles/11847054539547-A2P-10DLC-Campaign-Approval-Requirements
https://sakari.io/blog/meeting-10dlc-compliance-with-opt-ins
https://getterms.io/blog/what-is-a2p-10dlc
