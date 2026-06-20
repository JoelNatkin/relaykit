## Marketing automation / email-marketing SaaS
**Vertical:** B2B SaaS & developer tooling
**Bucket:** Conditional
**URL slug:** /for/marketing-automation-saas

### What this builder is making
A "Mailchimp-for-X" platform: software that lets its own customers build, send, and automate email and SMS campaigns to *their* audiences — subscriber lists, segments, drip sequences, broadcasts. Examples span horizontal ESPs (general email/SMS marketing tools), niche creator-list tools (newsletter platforms for writers, coaches, course-sellers), and e-commerce-flavored campaign builders. The defining shape is two-sided: the developer runs a sending platform, and every customer is themselves a sender.

### Why they need SMS
When a customer's account crosses a deliverability cliff — bounce spike, sending suspension, sending-quota exhaustion mid-broadcast — the developer needs to reach that customer in seconds, because a suspended account means stalled campaigns and a churn risk that an email (sent through the very system that's degraded) may never surface. SMS wins because the alert is operationally urgent and the email channel is exactly the thing in doubt. The developer's *own* billing, trial, login, and account-health texts are standard transactional B2B SaaS messaging — the kind RelayKit serves cleanly.

### Message categories
1. account-events — primary: the developer-to-customer relationship is a paid SaaS subscription; payment, trial, and lifecycle texts are the load-bearing churn-critical sends.
2. team-alerts — deliverability degradation, sending-suspension, and bounce-spike alerts are threshold/anomaly pings the customer must act on fast.
3. verification — phone-ownership at signup plus step-up confirmation before sensitive actions (sender-domain changes, large-broadcast sends, payment-method changes).
4. customer-support — ticket lifecycle when a customer hits a sending block or compliance hold and opens a case.
5. waitlist — relevant only for closed-beta / invite-gated launches; many of these products gate early access.
Excluded: appointments (no scheduling surface), order-updates (no physical fulfillment), community (no member-community layer in the core product), marketing (the developer's *own* promo-to-customers is possible but the second-layer end-customer marketing — see Disambiguation — is where TCPA risk concentrates and is out of RelayKit's served scope).

### Workflows

**Subscription lifecycle (developer → customer)**
Keep the paying customer's account active across billing and plan events.
Sequence:
1. account-events:trial-ending — "Trial ending" — sent a few days before the free plan converts.
2. account-events:payment-failed — "Payment failed" — card declined on renewal; account at risk of pause.
3. account-events:subscription-confirmed — "Subscription confirmed" — renewal, upgrade to a higher send tier, or downgrade goes through.
4. account-events:account-suspended — "Account suspended" — non-payment or policy hold suspends sending.
Variable aliases (only where default feels wrong):
- account_link: "your billing page"

**Account security (developer → customer)**
Protect the customer's sending account, which controls their entire audience list.
Sequence:
1. verification:verification-code — "Verification code" — phone-ownership proof at signup.
2. account-events:new-device-sign-in — "New sign-in" — login from an unrecognized device.
3. verification:confirmation-code — "Confirmation code" — step-up before a sensitive action (sender-domain change, payment-method edit, large broadcast).

**Deliverability / sending-health alerts (developer → customer)**
Warn the customer the moment their sending is degrading or blocked.
Sequence:
1. team-alerts:system-alert — "Sending alert" — bounce-rate or complaint-rate threshold crossed on the customer's account.
2. team-alerts:service-level-alert — "Sending paused" — account-level send suspension triggered by the protection system.
3. GAP:sending-quota-reached — "Send limit reached" — customer hit their plan's monthly/segment send cap mid-flight.
Variable aliases (only where default feels wrong):
- system_name: "your account"
- severity: "Warning"
- action_link: "your account health page"

**Support escalation (developer → customer)**
Move a blocked customer through a support case when sending is held.
Sequence:
1. customer-support:ticket-received — "Ticket received" — customer opens a case on a sending block.
2. customer-support:agent-response — "Reply ready" — support responds with next steps.
3. customer-support:resolution-notification — "Resolved" — hold lifted, sending restored.

### Message gaps

**GAP:sending-quota-reached**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (a usage/quota-threshold message; close to team-alerts but it's a plan-limit event, not an incident)
- **Proposed universal name:** plain English: "you've reached your sending limit" | display alias: "Send limit reached"
- **Why:** quota exhaustion mid-broadcast is the highest-frequency operational alert for a sending platform and isn't an incident-style team-alert.
- **Draft variants:**
  - Standard: `{{workspace_name}}: You've reached your {{plan_limit}} send limit. Upgrade to keep sending: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Heads up - your {{workspace_name}} account hit its {{plan_limit}} send limit. Upgrade to keep going: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{plan_limit}} send limit reached. Upgrade: {{account_link}} STOP to opt out.`
- **New variables:** `{{plan_limit}}` (e.g. "10,000/mo")

**STRETCH:team-alerts:service-level-alert**
- **Classification:** Stretch
- **Proposed corpus home:** stretch: message fits an SLA/maintenance breach frame; here it's repurposed as a "your sending is paused" customer-facing block notice, which reads as infra-ops rather than account-state.
- **Proposed universal name:** plain English: "your sending has been paused" | display alias: "Sending paused"
- **Why:** the existing copy ("SLA breach, incident {{incident_id}}") is internal-ops phrasing; a customer whose account got auto-suspended needs account-state language, not incident-ID language.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Sending on your account is paused after a deliverability issue. Review and restore: {{action_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} sending is paused after a deliverability flag. Here's how to restore it: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Sending paused. Review: {{action_link}} STOP to opt out.`

### Content constraints
- Since Feb 1, 2025, carriers block 100% of unregistered A2P 10DLC traffic — the developer must register a brand + campaign for its own operational SMS regardless of volume.
- The developer's own operational alerts (billing, sending-health, security) are transactional/ACCOUNT_NOTIFICATION — keep them factual; account-state alerts that prompt a paid upgrade drift toward promotional and draw stricter carrier filtering, so frame upgrade prompts as account-continuity, not offers.
- Honor opt-outs from any reasonable method, not only "STOP" (FCC, April 2025), with removal required promptly — relevant to the developer's own send list.
- TCPA liability does not transfer to a vendor: the developer remains liable for its own operational sends; eligibility here covers only that first layer.

### Disambiguation
The served surface is the developer's *own* operational SMS to its paying customers — billing, security, deliverability alerts — which is ordinary transactional B2B SaaS messaging and is Clear. The Conditional flag is the second layer: messages the developer's *customers* send to *their* audiences through the platform are marketing campaigns at scale, concentrating TCPA/PEWC exposure across thousands of downstream senders the developer doesn't control. RelayKit serves the platform's first-party operational messaging, not the multi-tenant campaign-sending layer; a builder asking RelayKit to power end-customer broadcast SMS is outside served scope and should register campaigns per-customer through a CPaaS sub-account model. Standard eligibility applies to the operational layer; the campaign-sending layer is the reason this sub-vertical is Conditional rather than Clear.

### Sources
https://mailchimp.com/solutions/sms-marketing-tools/
https://www.brevo.com/
https://www.attentive.com/blog/sms-and-email-marketing
https://mytcrplus.com/solutions/saas-sms-compliance/
https://sakari.io/blog/meeting-10dlc-compliance-with-opt-ins
https://messageiq.io/blogs/avoid-costly-fines-a-guide-to-tcpa-and-can-spam-for-sms-marketing/
https://activeprospect.com/blog/tcpa-text-messages/
https://www.text-em-all.com/blog/sms-compliance-checklist-for-tcpa-safe-business-messaging
https://knowledge.hubspot.com/marketing-email/why-is-my-email-suspended
https://help.brevo.com/hc/en-us/articles/8603145402514-Best-practices-for-SMS-deliverability
https://textus.com/blog/sms-for-saas
