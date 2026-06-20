## Customer support / helpdesk SaaS
**Vertical:** B2B SaaS & developer tooling
**Bucket:** Clear
**URL slug:** /for/customer-support-saas

### What this builder is making
A helpdesk/ticketing platform — an "Intercom-for-X" shared inbox that turns inbound customer messages (email, chat, social, SMS) into trackable tickets with routing, agent assignment, and a knowledge base. The product moves each ticket through a lifecycle (received → assigned → replied → resolved) and layers on satisfaction surveys, proactive in-app outreach, and service-status broadcasts. Buyers range from established suites (Zendesk, Intercom, Help Scout, Front) to indie shared-inbox tools serving small SaaS and ecommerce teams.

### Why they need SMS
The moment that matters is the agent reply on a ticket the customer opened hours ago and stopped watching — email open rates sit near 20% while SMS clears ~98%, so an emailed "your ticket has a reply" is the message that silently rots until the customer re-opens a duplicate ticket. A text closes that loop in seconds, which is why helpdesks already wire SMS triggers into ticket status changes. SMS also wins for time-critical proactive cases — a service outage or an account issue — where the customer isn't sitting in the inbox and email lands too late.

### Message categories
1. customer-support — the builder's own product surface; the full ticket lifecycle (received → assigned → reply → resolved → CSAT), plus proactive outreach, service-status, and account-issue messages are the spine of every helpdesk.
2. account-events — many helpdesk SaaS also bill the end customer or run trials; payment-failed, trial-ending, suspended, and new-device alerts are churn-critical and get missed in email.
3. verification — phone-ownership proof at signup and step-up confirmation for sensitive account actions, standard for any tool gating logins.
4. marketing — separate, EIN-gated, consent-distinct lane for product-launch and re-engagement to opted-in users; never blended with the ticket-care campaign.
Excluded: appointments (helpdesks don't book provider time slots), order-updates (no fulfillment/shipping), team-alerts (about operating the helpdesk internally, not customer-facing), community (no membership/onboarding surface), waitlist (no queued-spot mechanic).

### Workflows

**Ticket lifecycle**
Keep a customer informed from the moment they file a ticket to the satisfaction rating after it closes.
Sequence:
1. customer-support:ticket-received — "Ticket received" — confirm the request is logged with a ticket number.
2. customer-support:agent-assigned — "Agent assigned" — name the agent now owning it.
3. customer-support:agent-response — "Agent replied" — alert that a reply is waiting, link to view.
4. customer-support:resolution-notification — "Ticket resolved" — mark resolved with a reopen path.
5. customer-support:csat-follow-up — "Rate your support" — collect a satisfaction rating post-close.
Variable aliases (only where default would feel wrong):
- ticket_link: "https://help.acme.app/t/48213"

**Proactive friction outreach**
Reach a customer the system detects is stuck before they file a frustrated ticket.
Sequence:
1. customer-support:proactive-outreach — "We noticed you got stuck" — offer help, invite a reply.

**Service incident broadcast**
Tell affected users about a live outage and confirm when it clears.
Sequence:
1. customer-support:service-status-alert — "Service issue" — acknowledge the issue with an ETA.
2. customer-support:account-issue-resolved — "Issue fixed" — confirm resolution, no action needed.
Variable aliases (only where default would feel wrong):
- eta: "around 3pm ET"

**Billing & lifecycle save**
Catch churn-critical billing and access events the customer would otherwise miss in email.
Sequence:
1. account-events:payment-failed — "Payment failed" — card declined, prompt an update.
2. account-events:trial-ending — "Trial ending" — days remaining, prompt plan choice.
3. account-events:subscription-confirmed — "Subscription updated" — confirm a renewal or change.
4. account-events:account-suspended — "Account suspended" — explain and link next steps.

**Account security**
Prove phone ownership at signup and confirm sensitive account changes.
Sequence:
1. verification:verification-code — "Verification code" — phone-ownership code at signup.
2. account-events:new-device-sign-in — "New sign-in" — flag access from a new device.
3. verification:confirmation-code — "Confirmation code" — step-up before a sensitive change.

### Message gaps
No universal misses or stretches surfaced — the corpus customer-support category was clearly authored for exactly this builder and covers the full ticket lifecycle, proactive outreach, service-status, and account-issue paths without reframing. Account-events, verification, and marketing messages drop in at their plain meaning.

### Content constraints
- Ticket-lifecycle, proactive, and service-status messages register under TCR CUSTOMER_CARE; do not blend promotional content into this campaign — that requires the separate EIN-gated MARKETING campaign with distinct consent.
- Every transactional body must carry the brand/sender frame and honor STOP/HELP keywords (verification 2FA bodies are the carve-out — no STOP/HELP).
- Message content must match the registered use case; a CUSTOMER_CARE campaign sending promos is a carrier violation that risks filtering or suspension.
- A published privacy policy covering how phone numbers and messaging data are handled is checked at campaign vetting.
- Proactive outreach and service broadcasts still require prior opt-in — "support" framing does not exempt a message from consent rules.

### Disambiguation
This is the helpdesk software builder — the team selling the ticketing/inbox tool — not the support team of an unrelated company. Their RelayKit messages are sent on behalf of their own end customers about that customer's tickets, so the sender frame is {{workspace_name}} (the helpdesk's brand or its customer's workspace), not a community or storefront name. Distinguish from team-alerts, which covers the helpdesk's internal on-call and incident pings rather than customer-facing ticket updates. Also distinct from order-updates: a helpdesk reports on tickets and account state, never shipments or fulfillment.

### Sources
https://www.zendesk.com/service/help-desk-software/ticketing-system/
https://www.helpscout.com/compare/intercom/
https://support.zendesk.com/hc/en-us/articles/4408885601178-Automating-SMS-support-with-ticket-triggers-that-send-texts
https://support.zendesk.com/hc/en-us/articles/4408835524506-Workflow-How-to-send-a-text-to-customers-on-a-ticket-that-originated-in-a-non-SMS-channel
https://simpletexting.com/blog/sms-ticketing-software/
https://www.jitbit.com/saas-helpdesk/sms-helpdesk/
https://support.talkdesk.com/hc/en-us/articles/7865499246491-Talkdesk-Feedback-Setting-up-an-SMS-Survey
https://support.zendesk.com/hc/en-us/articles/4408886173338-About-the-CSAT-Customer-Satisfaction-user-experience-for-email-and-messaging
https://www.textrequest.com/insights/10dlc
https://www.termsfeed.com/blog/a2p-10dlc-compliance/
