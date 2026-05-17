# Customer support — Lead-Magnet Research
**Date:** 2026-05-16
**TCR mapping:** CUSTOMER_CARE
**Classification:** hybrid
**Authored by:** PM (Session 91)

## 1. Industry pattern observations

Customer support SMS in indie SaaS is the lowest-volume category we'll ship — most indie founders use email or in-app chat (Intercom, Crisp, Plain, Help Scout) and reserve SMS for high-urgency moments. But the patterns that exist are well-shaped: ticket-driven workflows for incoming-issue-resolution loops, and proactive/exceptional discrete messages for friction detection and service alerts. The hybrid classification is real — neither pure workflow nor pure discrete captures it.

The ticket-lifecycle shape is consistent across support platforms: receipt → assignment (optional) → response → resolution → CSAT. Variations matter at the system level (some platforms route to named agents, others stay anonymous; some send response notifications, others rely on the platform's own UI). For indie SaaS, the simplified path — receipt, response, resolution — is the most common subscription.

Separately, indie SaaS support sends discrete proactive messages that don't fit the ticket lifecycle: "we noticed you're stuck," "service status alert," "account issue resolved on our end." These read as Customer Care semantically (support-shaped, addressing customer experience), even though no ticket exists. Hence hybrid.

Reference apps observed: Intercom (in-app + SMS handoff for critical alerts), Help Scout (email-primary with SMS for ticket events), Front (multi-channel, SMS adjacent), Plain (indie-friendly newcomer with developer-API patterns), Crisp (chat-first, occasional SMS), Chatwoot (open source). ChatGPT-powered support bots increasingly common — affects agent attribution language. Most indie SaaS support SMS today appears for account-recovery, payment-failure, and outage-impact cases rather than routine ticket flow.

## 2.a Stages identified (ticket lifecycle)

Five workflow stages cover the typical support-ticket lifecycle:

1. **Ticket received** (default on) — triggerCue: *Sent immediately after a support request is logged in the developer's system.* Confirms receipt and sets response-time expectation. Includes ticket number for reference.

2. **Agent assigned** (optional) — triggerCue: *Sent when a support request is routed to a specific agent (named routing systems only).* Skipped by anonymous-support platforms and AI-bot-handled flows.

3. **Agent response** (default on) — triggerCue: *Sent when a support agent (human or AI) replies to the ticket.* Includes link to conversation. Most-opened message in the support sequence.

4. **Resolution notification** (default on) — triggerCue: *Sent when a ticket is marked resolved or closed in the developer's system.* Confirms closure and offers reopening path.

5. **CSAT follow-up** (optional) — triggerCue: *Sent T+1h to T+24h after ticket resolution.* Rating affordance with link to feedback form. Timing varies by platform; T+1h is the most common indie-SaaS default.

## 2.b Subs identified (discrete escape hatches)

Three discrete subs cover non-ticket support messages:

1. **Proactive outreach** — When the developer's system detects user friction (failed actions, abandoned flows, stuck states) and triggers a support touch. Voice: brief, helpful, no pressure. Distinct from Marketing re-engagement — this is support-shaped concern, not promotional.

2. **Service status alert** — Outage notifications, incident updates, degraded-service warnings. Sent to affected users (not the full list). Includes ETA when available. Flagged in §6 — could conceivably live under Account events if those become a separate category, but lives here today because it's customer-care-shaped per TCR.

3. **Account issue notification** — "Your account had [payment / authentication / data] issue we resolved." Resolved-by-us messages with no required user action. Distinct from ticket-driven resolution (no ticket existed).

## 3. Voice patterns observed

Support SMS reads as **personal, responsive, action-clear**. Different register from Appointments or Order updates — there's an implied human element (an agent is on it, a person is concerned). Even AI-bot responses borrow this register.

Confirmation cues: "got it," "we're on this," "received."
Response cues: "replied," "here's the answer," "view conversation."
Resolution cues: "resolved," "fixed," "closed."
Proactive cues: "noticed," "checking in," "want help?"

Length: typical 60-140 characters. Resolution and CSAT slightly longer for the action link.

Variables: `{{ticket_number}}` or `{{case_id}}` (always), `{{agent_name}}` (when assigned), `{{customer_name}}` or `{{first_name}}` (optional), `{{ticket_link}}` or `{{conversation_link}}` (responses and resolutions), `{{csat_link}}` (CSAT), `{{eta}}` (service status alerts).

Personalization moderate. Ticket number always; agent name when accurate (don't fabricate); customer name optional.

Anti-patterns:
- Fake agent names ("Ashley" when no Ashley exists) — erodes trust
- Generic "we" without context ("We resolved your issue") — recipient wants to know who/what
- Promotional pivots in resolution ("Your ticket resolved! Try Premium 30% off") — converts to mixed content
- Vague status alerts without ETA ("We're working on it" with no timeline)

## 4. B2B vs B2C variations

B2B support SMS: low volume, high urgency. Account managers often involved. SMS reserved for issues that block work (system down, account locked, billing issue). Tone slightly more formal; reference to "your account" or "your team" common.

B2C support SMS: higher volume in retail/wellness/consumer apps; rare in pure-SaaS. Tone warmer, more personable, agent-name attribution more common.

Indie SaaS support SMS use cases: locked-account recovery, payment-failure notifications, critical service alerts, proactive friction detection. Many indie founders are themselves the support person — voice should accommodate "I" attribution as well as "we."

## 5. Compliance constraints / TCR considerations

- **TCR CUSTOMER_CARE mapping.** Standard Class — auto-approved at TCR. Lower scrutiny than Marketing.
- **STOP language required.** Every message. Standard requirement.
- **Quiet hours apply with interpretation.** Recipient-triggered events (response to a ticket they opened) acceptable at any time per common practice. Proactive outreach and service alerts should respect 8am-9pm.
- **Two-way conversations encouraged.** Customer Care is the natural home for inbound MO — customers replying to support SMS extends the ticket. Inbound infrastructure is Phase 4 scope but the messaging shape should anticipate it.
- **No promotional content in support messages.** "Your ticket is resolved! Save 30% on Premium." → mixed content, separate Marketing campaign required.
- **Agent names must be accurate.** Fabricated names risk trust and may run into truth-in-advertising concerns. AI-bot responses should be honest about being automated (or at minimum not claim a fake human identity).

## 6. Open questions / followups

- **AI agents vs human agents.** When the responder is a bot, can the SMS say "an agent replied"? Voice and honesty question. My lean: yes if the user knows the support is AI-assisted (in-app disclosure exists). Avoid fake human names. Flag for messaging guidance.
- **Ticket vs case vs conversation language.** Different platforms use different terms (Zendesk = ticket, Front = conversation, Plain = thread). Lead magnet should pick a default for messages — "ticket" is the most recognized — and parameterize for systems that use other terms.
- **CSAT follow-up timing.** T+1h is the most common indie-SaaS default. T+24h is the more conservative call (resolution feels real after a day). Flag for stage-timing guidance.
- **Service status alerts: Customer Care or Account events?** If Account events / Subscription lifecycle becomes a category, service alerts have a possible home there (they're not ticket-driven). For launch, keep in Customer support since they're support-shaped per TCR and the user doesn't differentiate. Revisit post-launch.
- **Reply-to-SMS for ticket continuation.** Customer Care is the natural home for inbound MO (customer replies to a support SMS, that becomes ticket continuation). Phase 4 scope, but messaging shape should anticipate it — keep messages reply-friendly ("reply if you need more help" rather than "do not reply").

## 7. Notable references

- Intercom SMS notification templates
- Help Scout integration guides — ticket-event SMS patterns
- Plain transactional messaging guidelines — developer-API indie-SaaS reference
- Crisp SMS templates — chat-first platform reference
- Zendesk SMS use cases — enterprise reference for pattern coverage
- Chatwoot (open source) — indie-deployable reference
- TCR CUSTOMER_CARE category specifications
- CTIA two-way messaging principles — inbound MO compliance baseline
