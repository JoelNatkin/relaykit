## Cybersecurity / threat detection / SIEM
**Vertical:** B2B SaaS & developer tooling
**Bucket:** Clear
**URL slug:** /for/cybersecurity-saas

### What this builder is making
A security platform that ingests logs, telemetry, and signals across a customer's infrastructure, then correlates them into prioritized threat detections and incidents — "Datadog for security." Think Cloud SIEM, next-gen SIEM, EDR, or a SOAR/detection-engineering layer that turns raw events (failed logins, anomalous source IPs, ransomware signatures) into actionable alerts. The buyer is a SOC analyst, security engineer, or on-call responder who must triage and contain within minutes.

### Why they need SMS
The moment is a critical detection firing at 3am — a brute-force burst, a privilege-escalation anomaly, a SLA-breaching outage — when the responder is away from their dashboard. The consequence is dwell time: every unacknowledged minute is a window an attacker keeps. SMS wins because it reaches the on-call engineer when push is muted and email is unread, and the inbound ACK reply lets them claim or escalate the incident from a locked phone.

### Message categories
1. team-alerts — primary and near-total fit; severity-cued detections, ACK-or-escalate paging, on-call wake-ups, and SLA/incident notices are the entire job here
2. account-events — secondary; new-device sign-in maps to a suspicious-auth alert the platform may surface to the affected account holder, not just the SOC
Excluded: appointments (no scheduled-visit model), community (no member base), customer-support (the platform is the alerter, not a help desk for end users), marketing (promotional, separate consent — out of scope for incident ops), order-updates (no commerce), verification (the platform may use 2FA but that's its own auth, not this workflow), waitlist (no queue)

### Workflows

**Detection fired → triage**
Notify the on-call analyst the instant a correlation rule or detection crosses threshold, with enough context to start investigating from the phone.
Sequence:
1. team-alerts:system-alert — "Detection fired" — severity-cued ping naming the alert type and affected system
2. team-alerts:on-call-page — "Critical detection" — shortest urgent form when severity is highest and a system is confirmed down/compromised
Variable aliases (only where default feels wrong):
- alert_type: "Brute-force, 40 failed logins from 203.0.113.9"
- system_name: "prod-auth-gateway"
- severity: "P1"

**Escalate-or-acknowledge (rotation handoff)**
Require an explicit ACK from the primary responder or auto-escalate to the next person in the rotation, so no critical detection sits unowned.
Sequence:
1. team-alerts:escalation-ping — "Needs ACK" — acknowledgment-required alert that escalates server-side on no reply
Variable aliases (only where default feels wrong):
- escalation_to: "secondary on-call"
- system_name: "ransomware signature on fileserver-02"

**SLA / incident lifecycle**
Track a formal incident against its service-level commitment and notify the team of the breach and the incident record.
Sequence:
1. team-alerts:service-level-alert — "SLA breach" — informational notice tying the breached system to an incident ID
2. GAP:incident-resolved — "All clear" — closes the loop when the incident is contained/resolved
Variable aliases (only where default feels wrong):
- incident_id: "INC-4471"
- system_name: "edge-waf cluster"

### Message gaps

**GAP:incident-resolved**
- **Classification:** Universal miss
- **Proposed corpus home:** team-alerts:incident-resolved
- **Proposed universal name:** Incident resolved / all-clear notice [display alias: "All clear"]
- **Why:** The whole team-alerts category opens incidents (alert, escalate, page, SLA breach) but never closes one — every ops/SecOps lifecycle needs an explicit resolution ping so responders know to stand down
- **Draft variants:**
  - Standard: `{{workspace_name}}: {{system_name}} incident {{incident_id}} resolved. {{action_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: all clear - {{system_name}} incident {{incident_id}} is resolved. {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{system_name}} {{incident_id}} resolved. {{action_link}} STOP to opt out.`
- **New variables:** none (reuses workspace_name, system_name, incident_id, action_link)

### Content constraints
- Standard carrier rules apply; no vertical-specific carrier restrictions.
- Internal-team alerting is still A2P — carriers treat security/ops alerts the same as any business message, so registration and STOP handling apply (per the team-alerts ACCOUNT_NOTIFICATION TCR use case).
- Recipients are consented staff/operators on a duty roster, not the public — opt-in is the employment/on-call relationship, but STOP must still be honored (verification's 2FA carve-out does not extend here).
- Never put credentials, tokens, raw secrets, or full PII payloads in the body; link to the console (action_link) for detail.

### Disambiguation
This is overt enterprise security operations: the platform alerts a customer's own SOC team and account holders about threats to that customer's infrastructure, with the recipients being consented operators on a known duty roster. That is categorically distinct from surveillance, stalkerware, or spyware, where a third party is covertly notified about a person who has not consented and is unaware of the monitoring. The dividing line is the consent regime — here every recipient is a defined operator or the affected account's own owner receiving alerts they expect, not a covert watcher tracking an unwitting subject. The new-device/suspicious-auth message (account-events) reinforces this: it goes to the legitimate account holder to protect them, the opposite of surveillance.

### Sources
https://www.crowdstrike.com/en-us/platform/next-gen-siem/
https://finance.yahoo.com/markets/stocks/articles/datadog-bets-ai-security-analyst-140328814.html
https://www.paloaltonetworks.com/cyberpedia/siem-tools-comparison
https://support.pagerduty.com/main/docs/sms-notifications
https://support.pagerduty.com/main/docs/notification-content-and-behavior
https://sinch.com/engage/use-cases/sms-for-it-notifications/
https://signl4.com/industries/secops-siem-alerting
https://searchinform.com/articles/cybersecurity/measures/siem/management/automation/
https://www.networkershome.com/fundamentals/siem-soc/alert-triage-investigation-workflow/
https://www.txtimpact.com/blog/a2p-10dlc-registration-guide
