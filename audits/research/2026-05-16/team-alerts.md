# Team alerts — Lead-Magnet Research
**Date:** 2026-05-16
**TCR mapping:** ACCOUNT_NOTIFICATION
**Classification:** hybrid (settled by this research — was TBD in scaffold)
**Authored by:** PM (Session 91)

## 1. Industry pattern observations

Team alerts is the most B2B-leaning category we'll ship — internal-to-organization messaging that splits cleanly into two patterns: shift-management workflows for frontline workforce platforms, and alert-event sends for ops/devops/IT incident response. Each pattern is well-established in its own corner of the SaaS world (Homebase, Deputy, 7shifts on the workforce side; PagerDuty, Opsgenie, Better Stack on the ops side), but they share an audience: B2B SaaS founders building tools that fan out coordinated messages to a customer's employees.

The hybrid classification falls out naturally — shift management is workflow-shaped (a shift has a lifecycle: scheduled → reminded → started → ended → conditional changes), while alert events are discrete (each alert is a single triggered send). Forcing either pattern to swallow the other distorts the messages.

Reference apps observed: Homebase and When I Work for shift-management SMS in service businesses, 7shifts for restaurant-specific scheduling, Deputy and Sling for retail/hospitality workforce; PagerDuty and Opsgenie for traditional on-call alerting, Better Stack (Better Uptime) for indie-friendly incident alerting, Splunk On-Call (formerly VictorOps) for enterprise SRE, Pagerly for newer indie alternatives. The workforce-side SMS patterns are well-codified and time/location-anchored; the ops-side patterns are severity-anchored and short.

A pressure-test on launch audience: indie SaaS founders building B2B workforce-management apps exist but aren't the majority of our launch target. Founders building general-purpose SaaS with internal team-alert features (incident dashboards, scheduled-job notifications) are more common. This affects sub priority — alert-event subs likely serve more launch users than shift workflows, but both belong in scope.

## 2.a Stages identified (shift lifecycle)

Six workflow stages cover the shift-management lifecycle. Default-on coverage varies by service-industry vs. office-team use:

1. **Shift scheduled** (default on) — triggerCue: *Sent immediately after a shift is assigned to a team member in the developer's system.* The "you're on the schedule" moment. Includes date, time, location/role.

2. **Shift reminder — distant** (default on) — triggerCue: *Sent T-24h before shift_start.* Lead-time reminder. Useful for irregular schedules; less so for fixed-schedule teams.

3. **Shift reminder — proximate** (default on) — triggerCue: *Sent T-1h before shift_start.* Final nudge. Reduces no-shows in frontline service contexts.

4. **Shift change / swap notification** (conditional) — triggerCue: *Sent when a shift is changed, swapped with another team member, or moved.* Confirms the new state and resets reminders.

5. **Shift cancellation** (conditional) — triggerCue: *Sent when a shift is cancelled.* Includes reason context (slow day, system-driven, manager-requested) when developer's system provides it.

6. **Shift start / check-in prompt** (optional) — triggerCue: *Sent at shift_start with optional check-in action.* Useful for systems with clock-in workflows; skipped otherwise.

## 2.b Subs identified (alert events)

Four discrete subs cover alert-event sends:

1. **System alert** — Threshold-breach, error-rate spike, queue backed-up, anomaly detected. Severity-cued. Most common alert sub. Sent to designated recipients (single user or group rotation).

2. **Escalation ping** — Acknowledgment-required alert that escalates if not acknowledged. The message itself is one send; the escalation logic is server-side. Voice cue: urgency + explicit ack path ("Reply ACK if you've got this").

3. **On-call page** — Urgent attention required. Shortest message of the category — typically 50-90 characters. Severity and link, nothing else.

4. **Service-level alert** — SLA breach, downtime detected, scheduled-maintenance reminder. Distinct from on-call (which is action-required) — service-level alerts are informational to a broader audience.

## 3. Voice patterns observed

Team alerts SMS reads as **direct, role-anchored, urgent-when-warranted**. Recipients are employees expecting work-related communication, not consumers. Tone is functional, not warm.

For shift messages: matter-of-fact, time-specific, location-specific when relevant. "You're scheduled for Saturday 9am-2pm at the Main St location" beats "Hey there! Just a friendly reminder about your upcoming shift this weekend!"

For alert events: severity-cued, brief, link to details. "P1: API error rate >5% in us-east. [link]" beats "We've detected an issue you should know about."

Length: 50-90 characters for alerts (urgency = brevity), 80-140 characters for shift coordination (more context).

Variables: `{{shift_date}}` and `{{shift_time}}`, `{{location}}` and `{{role}}` (multi-location/role), `{{alert_type}}` and `{{severity}}`, `{{system_name}}` (which service is alerting), `{{incident_id}}`, `{{action_link}}` (acknowledge / resolve / view details), `{{escalation_to}}` (next person in rotation, for escalation pings). **Per D-398: all Team alerts templates also include `{{workspace_name}}` token** — multi-workspace ops teams need disambiguation about which environment/customer the alert is for.

**Severity vocabulary (per Session 93 review):** parameterize with no default suggestion. P0/P1/P2 vs Critical/High/Medium/Low vs SEV1/SEV2 vs colored (Red/Yellow/Green) all coexist in the wild — developer's team has its own vocabulary, and forcing one creates friction.

Personalization in this category is operational, not warm. Names appear less often than role/system/incident identifiers.

Anti-patterns:
- Forced warmth in alert messages ("Hi! 👋 Just letting you know...")
- Vague severity ("Something's up with the system")
- Missing action path (alert with no link, ack path, or context)
- Emojis in P0/P1 alerts (undermines urgency cue)

## 4. B2B vs B2C variations

This category is overwhelmingly B2B. The recipient is an employee, contractor, or on-call team member, not a customer.

Two flavors within B2B:

- **Frontline workforce** (restaurants, retail, healthcare, hospitality, services) — Shift-management heavy. Time- and location-anchored. Recipients often paid hourly, working irregular schedules. SMS is the primary channel because employees don't always have work email.
- **Knowledge workforce** (devops, security, IT, engineering, ops teams) — Alert-driven. Severity-anchored. Recipients have email and Slack but SMS is the urgency-channel (Slack snoozes, SMS interrupts).

Lead magnet should cover both flavors. The configurator's existing sub list ("Shift reminders, system alerts, escalation pings, on-call notifications") spans both already.

## 5. Compliance constraints / TCR considerations

- **TCR ACCOUNT_NOTIFICATION mapping.** Same TCR slot as Appointments, Community, Waitlist — illustrates the 4→1 collapse pattern from the compliance model. Standard Class, auto-approved.
- **Consent path is the harder problem.** Employee opt-in to work-related SMS at hire time, ideally documented in employment paperwork or HRIS system. RelayKit's compliance posture should encourage customers to wire consent capture into their hiring flow, not assume employment-implies-consent (it doesn't, per TCPA).
- **STOP language required.** Even for employee-facing alerts. Employees retain the right to opt out — but opting out of on-call alerts may have employment implications managed by the customer, not by RelayKit.
- **Quiet hours: contextual.** Frontline shift reminders respect 8am-9pm. On-call alerts (recipient is on the rotation) acceptable at any time per industry practice. Severity cue matters.
- **No promotional content** (D-399). Standard corpus-wide rule. Mixed-content risk if a shift reminder includes "Sign up for our employee perks program!"
- **Fan-out behavior.** Group escalation and rotation logic happens server-side; outbound messages are still per-recipient. No special TCR treatment needed.

## 6. Open questions / followups

- **Severity vocabulary** — **RESOLVED.** Parameterize with no default suggestion. Captured in §3 above.
- **Acknowledgment-required patterns** — "Reply ACK to acknowledge" is common in on-call. The outbound message is one send; the inbound ack handling is Phase 4 (inbound MO) scope. Messaging should anticipate the reply shape but the round-trip isn't in this category's launch scope. **DEFERRED** to Phase 4.
- **Group escalation fan-out behavior** — When an alert fans out to multiple recipients (full rotation, all on-call), the messages are individual but the orchestration is server-side. **DEFERRED** to RelayKit code-path documentation (out of message-library scope).
- **Audience priority** — **RESOLVED.** Team alerts is narrower than Verification, Marketing, Appointments, Orders for indie SaaS launch audience. Include in launch lead magnet for category completeness, but expect lower engagement than the consumer-facing categories. No exclusion warranted.
- **Internal-to-own-team use case** — **RESOLVED.** Indie SaaS founder paging their own 3-person team when production breaks is a legitimate but small use case. Same messages serve it as serve B2B customers' teams. Document but don't differentiate.

## 7. Notable references

- PagerDuty SMS notification templates — on-call industry baseline
- Opsgenie message patterns — enterprise SRE reference
- Better Stack (Better Uptime) — indie-friendly alert SaaS reference
- Homebase and When I Work — small-business workforce SMS templates
- 7shifts — restaurant-specific scheduling reference
- Splunk On-Call (formerly VictorOps) — enterprise pattern coverage
- Deputy and Sling — retail/hospitality workforce SMS
- TCR ACCOUNT_NOTIFICATION category specifications
