## Compliance / Legal-Ops / GRC tooling
**Vertical:** B2B SaaS & developer tooling
**Bucket:** Clear
**URL slug:** /for/compliance-grc-saas

### What this builder is making
A "Vanta-for-X" compliance-automation platform that continuously monitors a customer's infrastructure against frameworks like SOC 2, ISO 27001, and HIPAA, auto-collecting evidence and surfacing failing controls. It manages the human side too: employee security training, policy acceptance, device/MDM checks, access reviews, and reviewer/approver sign-offs on a cadence. The product's value is catching drift and chasing deadlines before an audit window closes.

### Why they need SMS
The moment is a control falling out of compliance or an access-review/approval deadline arriving — and email digests are exactly where these alerts go unread, which the GRC tools themselves cite as a structural gap. The consequence is a missed remediation window or a gap in a Type 2 audit period that can't be undone. SMS wins because control owners, on-call security staff, and approvers act on a buzz in seconds where an "overdue review digest" sits unopened for days.

### Message categories
1. team-alerts — primary: failing-control alerts, severity-cued anomalies, ACK-required approvals, and SLA/audit-window breaches are the product's core notification surface and map directly to this category.
2. customer-support — proactive outreach and service-status messaging fit when the platform itself flags friction or has an outage affecting compliance data sync.
3. account-events — billing/lifecycle/security alerts for the customer's own account on the GRC platform (sign-in, suspension, trial).
4. verification — phone-ownership and step-up confirmation at signup and before sensitive config changes.
Excluded: appointments (no scheduled provider visits), order-updates (no physical/digital goods shipping), marketing (separate consent lane, not workflow-driven), community (no member community), waitlist (no queued-access model).

### Workflows

**Failing control / drift alert**
Notify the responsible control owner the moment a continuous test detects a control out of compliance.
Sequence:
1. team-alerts:system-alert — "Control failing" — fires when an hourly/continuous test detects drift on a monitored control.
2. team-alerts:escalation-ping — "Owner ACK" — requires the control owner to claim remediation or it escalates server-side.
3. team-alerts:on-call-page — "Critical control down" — for high-severity controls (e.g., public S3 bucket, MFA disabled) needing immediate action.
Variable aliases (only where default feels wrong):
- severity: "Critical"
- alert_type: "Control failing"
- system_name: "MFA enforcement"
- escalation_to: "security lead"

**Reviewer / approval deadline**
Push approvers and control owners toward an access-review or control-approval deadline before it lapses.
Sequence:
1. team-alerts:service-level-alert — "Review due soon" — informational notice when an approval deadline enters its window (e.g., 14 days prior).
2. team-alerts:escalation-ping — "Approval needed" — ACK-required ping as the deadline approaches with no sign-off.
3. team-alerts:on-call-page — "Deadline today" — final urgent nudge on the day a review/approval lapses.
Variable aliases (only where default feels wrong):
- severity: "Action needed"
- system_name: "Q3 access review"

**Audit-window / SLA breach**
Alert the compliance owner when a control's evidence gap threatens the audit observation period.
Sequence:
1. team-alerts:service-level-alert — "Audit-window gap" — SLA-style breach tied to an incident/evidence reference.
2. team-alerts:escalation-ping — "Owner ACK" — claim the remediation before the observation window is compromised.
Variable aliases (only where default feels wrong):
- system_name: "SOC 2 evidence — change mgmt"
- incident_id: "GAP-4417"

**Employee compliance task**
Get an individual employee to complete an assigned security task (training, policy acceptance, device enrollment) on cadence.
Sequence:
1. GAP:employee-task-assigned — "Task assigned" — notify a person their security task is due.
2. GAP:employee-task-reminder — "Task overdue" — recurring (weekly/daily) nudge until completion.
Variable aliases (only where default feels wrong): none

**Platform account lifecycle**
Keep the customer's own GRC-platform account secure and active.
Sequence:
1. verification:verification-code — "Verify phone" — phone-ownership proof at signup.
2. account-events:new-device-sign-in — "New sign-in" — alert on access from a new device (security-conscious buyer).
3. account-events:trial-ending — "Trial ending" — lifecycle nudge before trial lapse.
4. verification:confirmation-code — "Confirm change" — step-up before sensitive config (e.g., framework or integration scope change).
Variable aliases (only where default feels wrong):
- device_context: "Chrome on a new Mac"

### Message gaps

**GAP:employee-task-assigned**
- **Classification:** Vertical-specific
- **Proposed corpus home:** team-alerts:task-assigned
- **Proposed universal name:** Compliance task assigned | "Task assigned"
- **Why:** GRC platforms assign per-person security tasks (training, policy acceptance, device enrollment) that no existing message frames as an individual to-do.
- **Draft variants:**
  - Standard: `{{workspace_name}}: You have a security task due {{due_date}}: {{task_name}}. Complete it: {{action_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: a quick security task for you - {{task_name}}, due {{due_date}}: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{task_name}} due {{due_date}}. {{action_link}} STOP to opt out.`
- **New variables:** task_name, due_date

**GAP:employee-task-reminder**
- **Classification:** Vertical-specific
- **Proposed corpus home:** team-alerts:task-reminder
- **Proposed universal name:** Compliance task overdue | "Task overdue"
- **Why:** The reminder cadence (weekly/daily nudges until a task is done) is a distinct recurring message, not a one-time assignment.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your security task {{task_name}} is still open. Finish it here: {{action_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: still need a minute for {{task_name}}? Wrap it up here: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{task_name}} still open. {{action_link}} STOP to opt out.`
- **New variables:** task_name

### Content constraints
- Standard carrier rules apply (A2P 10DLC, TCR ACCOUNT_NOTIFICATION for the alert traffic). No vertical-specific restrictions.
- Keep alert bodies factual and reference-based — link to the control/review rather than embedding evidence, credentials, or system internals.
- Employee-task and reviewer messages are operational (transactional), not marketing; route any product-promotion to the consent-gated marketing lane.

### Disambiguation
Distinct from legal practice tools (professional services) such as matter management, case/docketing, or e-billing software; this is GRC/security-compliance automation software (Vanta, Drata, Secureframe, Sprinto, Scytale) whose users are security/compliance owners and the employees they govern, not attorneys serving clients. It is also distinct from generic incident/observability tooling: the alerts here are framework-control and audit-deadline driven, not raw infrastructure telemetry. The shared SMS surface with team-alerts is real but the triggers are compliance-state changes, not operational outages alone.

### Sources
https://www.vanta.com/resources/best-grc-software-solutions-for-enterprises
https://drata.com/learn/compare/secureframe-vs-vanta-vs-drata
https://help.drata.com/en/articles/8564234-controls-notifications-for-required-approvals-and-control-updates
https://help.drata.com/en/articles/8564204-controls-required-approvals-stages-control-readiness-and-faq
https://help.vanta.com/en/articles/11345841-security-awareness-trainings
https://help.vanta.com/en/articles/11345363-getting-started-with-policies
https://www.vanta.com/products/personnel-access
https://help.vanta.com/en/articles/11345407-getting-started-with-the-vanta-device-monitor
https://www.trustcloud.ai/grc/navigating-soc-2-automation-a-modern-approach-to-continuous-compliance/
https://watchdogsecurity.io/soc2/evaluate-and-communicate-internal-control-deficiencies
https://mytcrplus.com/solutions/saas-sms-compliance/
