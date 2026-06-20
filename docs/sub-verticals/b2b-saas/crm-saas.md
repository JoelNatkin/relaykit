## CRM / sales SaaS
**Vertical:** B2B SaaS & developer tooling
**Bucket:** Conditional
**URL slug:** /for/crm-saas

### What this builder is making
A "HubSpot-for-X" platform where sales teams track leads, contacts, and deals through a pipeline of stages — capturing inbound leads, assigning them to reps, logging activity, and pushing deals from new to closed-won/lost. The market spans broad horizontal CRMs (HubSpot, Pipedrive, Zoho, Salesforce Starter, Capsule) and vertical/indie niche CRMs that wrap the same pipeline model around one industry's data shape. The builder's job is moving a contact through a deal pipeline fast and keeping the rep and the prospect in sync at each stage transition.

### Why they need SMS
The moment that matters is the inbound lead landing: a lead contacted within 5 minutes is up to 21x more likely to enter the sales process, but the assigned rep is rarely watching the CRM tab when the form fires. An internal SMS that pings the rep the instant a lead is assigned — and escalates to a manager if no response logs in 15 minutes — wins because phone alerts beat email/in-app for sub-5-minute speed-to-lead, where every minute of delay is a measurable conversion loss.

### Message categories
1. team-alerts — primary; the speed-to-lead rep ping, deal-stage and deal-won internal alerts, and manager escalation are all internal team notifications, the highest-volume RelayKit-eligible traffic here
2. account-events — the CRM is itself a subscription SaaS; billing/trial/security alerts to the builder's own paying account-holders
3. verification — phone-ownership at rep signup and step-up confirmation for sensitive CRM actions (export, ownership transfer)
4. customer-support — ticket lifecycle when the CRM vendor supports its own users
5. appointments — demo/discovery-call confirmations and reminders the rep books with a consenting prospect
6. marketing — only via a separate EIN-gated campaign with explicit marketing consent; never the default path
Excluded: order-updates (no physical fulfillment), community (not a community product), waitlist (CRMs don't gate access by queue)

### Workflows

**Speed-to-lead rep alert**
Notify the assigned rep the instant a new lead lands so they make contact inside the 5-minute window.
Sequence:
1. team-alerts:system-alert — "New lead assigned" — fires the moment a lead is routed to a rep
2. team-alerts:escalation-ping — "Lead unworked — claim or it escalates" — ACK-required ping if no rep response logs
3. team-alerts:on-call-page — "Manager escalation" — urgent re-route to manager/backup rep after the grace window lapses
Variable aliases (only where default would feel wrong):
- severity: "Hot lead"
- system_name: "Acme Corp — inbound demo request"
- alert_type: "New lead assigned"
- escalation_to: "your sales manager"

**Deal-stage internal alert**
Tell the deal owner and manager when a deal advances, stalls, or needs approval.
Sequence:
1. team-alerts:system-alert — "Deal moved stage" — fires on stage change or a high-value deal going quiet
2. team-alerts:escalation-ping — "Approval needed" — ACK-required when a discount/deal needs manager sign-off
Variable aliases (only where default would feel wrong):
- severity: "Deal update"
- system_name: "Globex — $40k renewal"
- alert_type: "Moved to Negotiation"

**Deal-won internal alert**
Broadcast a closed-won deal to the rep and team.
Sequence:
1. team-alerts:system-alert — "Deal won" — fires when a deal moves to closed-won
Variable aliases (only where default would feel wrong):
- severity: "Closed won"
- system_name: "Initech — $12k/yr"
- alert_type: "Deal won"

**CRM account lifecycle**
Keep the builder's own paying customers (the sales teams) active and secure.
Sequence:
1. account-events:trial-ending — "Trial ending" — a few days before the CRM trial lapses
2. account-events:payment-failed — "Card declined" — when the seat-based subscription card fails
3. account-events:subscription-confirmed — "Plan updated" — on renewal, seat change, or cancellation
4. account-events:new-device-sign-in — "New sign-in" — security alert on new-device access to the CRM
5. account-events:account-suspended — "Account suspended" — on suspension for non-payment or policy

**Rep onboarding security**
Verify a new rep's phone and gate sensitive CRM actions.
Sequence:
1. verification:verification-code — "Verify your phone" — at rep signup
2. verification:login-code — "Sign-in code" — SMS second factor
3. verification:confirmation-code — "Confirm action" — before export, ownership transfer, or bulk delete

**Demo & discovery scheduling**
Confirm and remind on calls the rep books with a consenting prospect.
Sequence:
1. appointments:confirmation — "Demo confirmed" — when the prospect books
2. appointments:reminder-distant — "Demo tomorrow" — day-before nudge
3. appointments:reminder-proximate — "Demo in 1 hour" — hour-before nudge
4. appointments:no-show-follow-up — "Missed demo — rebook" — after a missed call
Variable aliases (only where default would feel wrong):
- provider_name: "your account exec"

**CRM vendor support**
Run the support ticket lifecycle for the CRM's own users.
Sequence:
1. customer-support:ticket-received — "Ticket logged"
2. customer-support:agent-response — "Reply on your ticket"
3. customer-support:resolution-notification — "Ticket resolved"
4. customer-support:csat-follow-up — "Rate our support"

### Message gaps

**STRETCH:team-alerts:system-alert**
- **Classification:** Stretch
- **Proposed corpus home:** stretch — system-alert carries the "New lead assigned / deal moved / deal won" payload, but it is framed as an infra/anomaly threshold breach (severity + alert_type + system_name on a system), and reframing it as a sales-pipeline event leans hard on variable aliasing; the fit gap is that a sales rep alert is an opportunity event, not a system-health event
- **Proposed universal name:** Pipeline event alert (display alias for sales)
- **Why:** the corpus has no sales-pipeline-native internal alert; system-alert is the closest structural match but reads as monitoring, not selling

**GAP:lead-reply-notification**
- **Classification:** Vertical-specific
- **Proposed corpus home:** team-alerts:lead-reply
- **Proposed universal name:** "Prospect replied" (display alias for sales)
- **Why:** a core speed-to-lead loop is notifying the rep when the prospect texts back; no corpus message covers an inbound-reply ping to an internal user

### Content constraints
- Customer-facing sales SMS to prospects requires prior express consent per recipient; cold-outreach/prospecting texts without consent are prohibited and routinely rejected at registration (industry-wide 10DLC standard) — this is the gate that makes the sub-vertical Conditional
- Generic campaign descriptions ("notifications," "customer updates") get rejected; the campaign use-case must be specific
- Internal team-alert traffic (rep-to-rep, rep-to-manager) is standard and low-risk — the recipients are the builder's own employees who consented as users
- Marketing/promotional sales blasts are a separate EIN-gated campaign with explicit marketing consent, never folded into the transactional/internal path
- "Reply STOP to opt out" required on every transactional/internal body; SHAFT-C content prohibited
- Unregistered A2P traffic on 10-digit numbers is carrier-blocked (AT&T, T-Mobile, Verizon) with no sender notification

### Disambiguation
This entry covers CRM/sales SaaS where the builder operates a pipeline product and the primary RelayKit fit is internal sales-team alerting plus the standard SaaS transactional layer — not a service business using a CRM to text its own customers. The customer-facing prospect-outreach layer is real but is the consent-gated, easily-mis-registered surface that drives the Conditional bucket; route those to marketing (consented) or appointments (booked, consenting) rather than treating prospect texting as a default transactional path. Where a vertical CRM also fulfills physical goods or runs a community, layer the relevant sub-vertical's workflows on top.

### Sources
https://www.salesforce.com/crm/crm-for-small-business/best-crm/
https://www.g2.com/categories/crm/small-business
https://capsulecrm.com/blog/saas-crm-for-small-business/
https://pipelinecrm.com/blog/how-call-sms-leads/
https://www.textline.com/blog/crm-sms-integration
https://www.ringy.com/articles/crm-with-text-messaging
https://www.gorattle.com/blog/salesforce-lead-assignment-notification-slack
https://www.momentum.io/notifications
https://aloware.com/blog/speed-to-lead
https://callingly.com/blog/the-5-minute-rule-why-300-more-leads-convert-when-you-call-within-5-minutes/
https://www.chilipiper.com/article/speed-to-lead-statistics
https://help.twilio.com/articles/4408675845019-SMS-Compliance-and-A2P-10DLC-in-the-US
https://justcall.io/blog/10dlc-compliance-guide.html
https://callhub.io/blog/compliance/10dlc-2025-registration-callhub/
