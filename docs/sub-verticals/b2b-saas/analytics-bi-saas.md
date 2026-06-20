## Analytics / business intelligence SaaS
**Vertical:** B2B SaaS & developer tooling
**Bucket:** Clear
**URL slug:** /for/analytics-bi-saas

### What this builder is making
A "Mixpanel-for-X" platform that ingests product, revenue, or operational events and turns them into dashboards, funnels, cohorts, and metric reports for its own B2B customers. The core engine watches numbers continuously: it computes thresholds, runs anomaly detection (spikes and drops against a learned baseline), monitors event-volume health for broken instrumentation, and renders scheduled digests on a daily/weekly/monthly cadence. The product's value is being the first to know a number moved — which is exactly what SMS is built to deliver.

### Why they need SMS
The moment is a metric breaching its threshold or a tracked event going silent (broken instrumentation, a conversion funnel collapsing, signups flatlining) — and the operator is away from the dashboard and not refreshing email. The consequence is a revenue or product regression that compounds for hours before anyone notices, the opposite of what an analytics tool promises. SMS wins because a threshold breach or anomaly is a "look now" event with a read rate email and Slack can't match, and digests/goal-hit pings ride the same trusted channel.

### Message categories
1. team-alerts — primary; threshold breaches, anomaly spikes/drops, and instrumentation-health pings are exactly the severity-cued operational alerts this category exists for.
2. account-events — the analytics product's own billing/lifecycle messaging to its paying customers (trial ending, payment failed) — churn-critical and orthogonal to the analytics workflows.
3. verification — phone-ownership at signup and step-up confirmation for sensitive dashboard/data-export actions.
4. marketing — second-campaign, EIN-gated; product-launch and feature announcements to opted-in users, never mixed into alert traffic.
Excluded: appointments (no scheduling surface), order-updates (no physical fulfillment), community (no member community), customer-support (possible but not core to the analytics workflow), waitlist (not a queue product).

### Workflows

**Threshold and anomaly alerting**
Notify the operator the instant a tracked metric crosses a configured threshold or deviates from its anomaly baseline.
Sequence:
1. team-alerts:system-alert — "Metric alert" — severity-cued ping naming the metric and dashboard that breached.
2. team-alerts:on-call-page — "Critical metric drop" — urgent variant when a revenue/conversion metric collapses and someone must look now.
3. team-alerts:escalation-ping — "Unacknowledged alert" — re-fires to a backup recipient if the first owner doesn't ACK.
Variable aliases (only where default feels wrong):
- system_name: "Signup conversion funnel"
- alert_type: "Below threshold: 2.1% vs 4.0% floor"
- severity: "Warning"
- action_link: "the dashboard view link"

**Instrumentation / data-volume health**
Warn the operator when event volume drops abnormally, signaling broken tracking rather than a real business change. (See GAP below — current system-alert covers this only as a Stretch.)
Sequence:
1. team-alerts:system-alert — "Tracking health alert" — flags an abnormal event-volume drop on a monitored event.
2. team-alerts:service-level-alert — "Data pipeline notice" — informational variant for an ingestion lag or SLA breach on data freshness.
Variable aliases (only where default feels wrong):
- alert_type: "Event volume down 92% in 1h"
- system_name: "checkout_completed event"

**Scheduled metric digest**
Deliver a recurring summary of headline numbers on a daily/weekly/monthly cadence. (No clean corpus home — see GAP.)
Sequence:
1. GAP:scheduled-report-ready — "Your weekly report" — a digest-ready ping pointing to the rendered report.

**Goal / milestone reached**
Tell the operator when a tracked metric hits a target they set (MRR milestone, signup goal, campaign target). (See GAP.)
Sequence:
1. GAP:goal-reached — "Goal reached" — celebratory-but-factual ping that a configured target was met.

**Product account lifecycle**
The analytics product's own billing and security messaging to its paying customers.
Sequence:
1. account-events:trial-ending — "Trial ending" — a few days before the analytics plan's trial lapses.
2. account-events:payment-failed — "Payment failed" — card declined on the analytics subscription.
3. account-events:new-device-sign-in — "New sign-in" — dashboard accessed from a new device.

**Signup and step-up verification**
Prove phone ownership at signup and gate sensitive data actions.
Sequence:
1. verification:verification-code — "Verification code" — phone-ownership proof at signup.
2. verification:confirmation-code — "Confirmation code" — step-up before a data export or workspace ownership change.

### Message gaps

**GAP:scheduled-report-ready**
- **Classification:** Vertical-specific
- **Proposed corpus home:** team-alerts:report-ready
- **Proposed universal name:** Scheduled report ready | "Your report"
- **Why:** recurring digest delivery is a first-class analytics workflow with no existing fit — system-alert is anomaly/severity-framed, not a routine "here's your report" ping.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your {{report_name}} is ready. View it here: {{action_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} {{report_name}} just landed. Take a look: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{report_name}} ready. {{action_link}} STOP to opt out.`
- **New variables:** report_name ("Weekly metrics digest")

**GAP:goal-reached**
- **Classification:** Vertical-specific
- **Proposed corpus home:** team-alerts:goal-reached
- **Proposed universal name:** Goal reached | "Goal reached"
- **Why:** a configured target being hit is a positive-direction trigger with no home — system-alert and on-call-page both frame the negative/problem direction.
- **Draft variants:**
  - Standard: `{{workspace_name}}: {{metric_name}} hit your target of {{goal_value}}. See the details: {{action_link}} Reply STOP to opt out.`
  - Friendly: `Good news from {{workspace_name}}: {{metric_name}} just reached {{goal_value}}. Take a look: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{metric_name}} hit {{goal_value}}. {{action_link}} STOP to opt out.`
- **New variables:** metric_name ("Monthly recurring revenue"), goal_value ("$10k MRR")

**STRETCH:team-alerts:system-alert**
- **Classification:** Stretch
- **Proposed corpus home:** stretch: system-alert covers the threshold/anomaly job well, but its `system_name`/`alert_type` framing reads as infrastructure ("on {{system_name}}"), and the instrumentation-health case (event volume dropped = broken tracking, not an outage) is a meaningfully different intent that the template doesn't signal cleanly.
- **Proposed universal name:** System alert | "Metric alert"
- **Why:** business-metric and instrumentation-health alerts reuse the infra-shaped template adequately but not naturally.

### Content constraints
- Standard carrier rules apply; all alert/digest traffic registers under ACCOUNT_NOTIFICATION (team-alerts), MARKETING only for the opted-in product/feature-launch lane.
- No promotional or upgrade-prompt language in alert, digest, or goal-reached bodies — PLG conversion CTAs in operational SMS trigger marketing reclassification and deliverability degradation (carrier content-matching).
- Message content must match the registered campaign use case; alert bodies that drift toward sales copy risk carrier filtering or campaign suspension.
- Verification bodies carry no STOP/HELP language (2FA TCR carve-out).
- Recipients are typically the builder's own team/operators or paying users — consent is captured at signup/alert-subscription; marketing-lane messages require separate explicit consent and are EIN-gated.

### Disambiguation
This sub-vertical is the analytics/BI platform itself (Mixpanel-for-X), not a general B2B SaaS app that merely happens to send operational alerts. The defining trait is that its core product is metric computation and thresholding — the SMS is the alerting surface of an analytics engine, so team-alerts dominates over the account-events/verification mix a generic SaaS would lean on. It also differs from a pure incident/on-call tool (PagerDuty-style): the triggers here are business and product metrics (conversion, MRR, signups, event volume) and scheduled digests, not just infrastructure outages, which is why scheduled-report-ready and goal-reached gaps surface that an ops-only category never needs.

### Sources
https://amplitude.com/compare/best-product-analytics-tools
https://openpanel.dev/articles/mixpanel-alternatives
https://posthog.com/docs/alerts.md
https://docs.mixpanel.com/docs/features/alerts
https://docs.mixpanel.com/docs/data-governance/data-volume-monitoring
https://mixpanel.com/blog/anomaly-detection-custom-alerts-root-cause-analysis/
https://amplitude.com/docs/analytics/insights
https://business.adobe.com/products/analytics/intelligent-alerts.html
https://www.omtera.com/en/blog/mixpanel-notifications-alerts
https://agencyanalytics.com/features/alerts
https://help.twilio.com/articles/4408675845019-SMS-Compliance-and-A2P-10DLC-in-the-US
https://www.infobip.com/blog/what-is-a2p-10dlc
https://mytcrplus.com/solutions/saas-sms-compliance/
