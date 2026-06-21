## Audience-growth / follower-management tools
**Vertical:** Creator economy & community
**Bucket:** Clear
**URL slug:** /for/audience-growth

### What this builder is making
A creator CRM / analytics tool that ingests a creator's own audience data across platforms (Instagram, YouTube, TikTok, X, Twitch, Patreon) and surfaces follower growth trends, engagement rates, milestone tracking, and threshold-based alerts on a single dashboard. The market ranges from lightweight follower trackers (CreatorFlow, Circleboom) and real-time alert tools (UpGrow engagement-spike alerts, New Follower Alert, Streamlabs/Twitch alert sets) to full reporting suites with scheduled digests and custom metric thresholds (Agorapulse, Sprout Social, SumAll, SocialStats). The product's job is to tell the creator what is happening to their audience — not to message that audience.

### Why they need SMS
A follower spike, a viral surge, or a sustained drop happens in a window measured in hours, and a creator who only checks an email digest the next morning misses the moment to capitalize or react. SMS reaches the creator on the device they actually carry and wins because the alert's entire value is timeliness — a "you just crossed 100K" or "mentions up 400% in the last hour" buzzing now is worth far more than the same line in tomorrow's inbox. The recipient is always the creator-user (the tool's own account holder), never their audience.

### Message categories
1. team-alerts — the core of the product: threshold breaches, anomaly detection (spikes, drops, mention surges), and goal/milestone alerts fired to the creator-user are exactly the "threshold breach / system alert" shape this category holds.
2. account-events — the tool is a SaaS; billing, trial-ending, plan, and security alerts for the creator's own subscription are churn-critical and belong here.
3. verification — phone-ownership proof at signup and step-up confirmation for connecting/disconnecting a high-value social account.
Excluded: appointments (no scheduling surface — this is passive monitoring), order-updates (no physical/digital fulfillment), customer-support (a possible add-on but not core to the audience-growth job; not modeled here), marketing (outbound promo to the creator's audience is explicitly out of scope and would be a separate registration), community (corpus community messages address a community's *members*; here the audience is the single creator-user, not a member base), waitlist (no queue/availability mechanic in the product).

### Workflows

**Audience milestone reached**
Tells the creator the instant a vanity/round-number threshold (followers, subscribers, total views) is crossed so they can celebrate or post in the moment.
Sequence:
1. GAP:audience-milestone — "Milestone alert" — fires when the tracked metric crosses a configured round number (e.g. 100K followers); includes the metric and value.

**Real-time spike / viral surge alert**
Flags an abnormal positive acceleration (follower velocity, engagement spike, mention surge) so the creator can ride momentum while it lasts.
Sequence:
1. STRETCH:team-alerts:system-alert — "Growth alert" — fires when a metric's rate of change crosses an anomaly threshold; severity-cued.
Variable aliases:
- severity: "Spike"
- alert_type: "Follower velocity +400%/hr"
- system_name: "Instagram @handle"

**Sustained drop / decline alert**
Warns the creator when a metric falls abnormally (mass unfollow, engagement collapse, demonetization-style cliff) so they can investigate.
Sequence:
1. team-alerts:system-alert — "Decline alert" — fires when a downward anomaly crosses threshold; severity-cued.
Variable aliases:
- severity: "Alert"
- alert_type: "Net followers -2.1K in 24h"
- system_name: "TikTok @handle"

**Custom goal / threshold breach**
Notifies the creator when a self-set goal metric (e.g. "tell me at 50K subscribers" or "engagement rate under 2%") is hit.
Sequence:
1. STRETCH:team-alerts:system-alert — "Goal alert" — fires when a user-configured threshold is crossed in either direction.
Variable aliases:
- severity: "Goal"
- alert_type: "Subscribers reached 50,000"
- system_name: "YouTube channel"

**Scheduled growth digest**
Delivers the recurring (daily/weekly) audience summary by text for creators who want the headline numbers without opening the dashboard.
Sequence:
1. GAP:audience-digest — "Weekly recap" — recurring summary of net growth and top movement over the period.

**Connected-account health alert**
Tells the creator when a linked social account stops syncing or loses authorization, so data doesn't silently go stale.
Sequence:
1. team-alerts:system-alert — "Sync alert" — fires when an account integration breaks or token expires.
Variable aliases:
- severity: "Sync error"
- alert_type: "Reconnect needed"
- system_name: "X @handle"

**Account onboarding (tool signup)**
Proves phone ownership when the creator signs up for the tool.
Sequence:
1. verification:verification-code — "Verification code" — sent at signup to confirm the creator's phone.

**Sensitive account-connection confirmation**
Confirms a high-stakes change to the creator's own tool account — connecting/disconnecting a monetized channel or changing the destination for alerts.
Sequence:
1. verification:confirmation-code — "Confirmation code" — step-up code before the sensitive action commits.

**Billing & subscription lifecycle (the tool's own SaaS)**
Keeps the creator's paid subscription to the tool active and recoverable.
Sequence:
1. account-events:trial-ending — "Trial ending" — a few days before the trial lapses.
2. account-events:payment-failed — "Payment failed" — card declined on renewal.
3. account-events:subscription-confirmed — "Subscription confirmed" — renewal or plan change goes through.

**Account security (the tool's own account)**
Protects the creator's tool login.
Sequence:
1. account-events:new-device-sign-in — "New sign-in" — login from an unrecognized device.

### Message gaps

**GAP:audience-milestone**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** Milestone alert (display alias for the audience-growth registry)
- **Why:** a positive vanity-milestone alert to the account owner is distinct from team-alerts' negative/severity framing and from community's member-facing milestone; no clean universal exists.

**GAP:audience-digest**
- **Classification:** Universal miss
- **Proposed corpus home:** team-alerts:scheduled-digest
- **Proposed universal name:** Scheduled digest
- **Why:** recurring summary alerts (metrics roll-up, report-ready) are a common monitoring pattern with no corpus message today.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your {{period}} recap is ready - {{summary}}. View: {{action_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} {{period}} recap: {{summary}}. See the full breakdown: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{period}} recap - {{summary}}. {{action_link}} STOP to opt out.`
- **New variables:** `{{period}}` — the digest interval, budget 8 chars, source: user's configured cadence, example "weekly". `{{summary}}` — one-line headline metric, budget 40 chars, source: aggregated period data, example "+3.2K followers, 5.1% eng".

**STRETCH:team-alerts:system-alert**
- **Classification:** Stretch
- **Proposed corpus home:** team-alerts:system-alert — fit gap: the message is framed as a severity-cued *problem* notification (`{{severity}}: {{alert_type}} on {{system_name}}`), which carries a negative connotation that reads oddly for a celebratory spike/surge or a hit growth *goal*. It works mechanically (threshold breach + action link) but the tone leans incident-response rather than good-news growth.
- **Proposed universal name:** System alert
- **Why:** spike, goal, and threshold alerts are genuinely threshold-breach events; only the positive tone strains the existing severity frame.
- **Draft variants:**
  - Standard: `{{workspace_name}} {{severity}}: {{alert_type}} on {{system_name}}. Details: {{action_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}} heads up, {{severity}}: {{alert_type}} on {{system_name}}. {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}} {{severity}}: {{alert_type}}, {{system_name}}. {{action_link}} STOP to opt out.`

### Content constraints
- Recipient is the creator-user (the tool's own account holder). These are transactional/informational account alerts — prior express consent from the account holder is sufficient; no double opt-in required for the alert traffic itself.
- Do NOT use this surface to message the creator's audience/fans; outbound audience messaging is a separate use case and would require its own campaign registration and consent.
- Keep alert bodies factual — the metric and a link. No promotional content on the team-alerts / account-events surface.
- Register under ACCOUNT_NOTIFICATION (alerts, account events) and 2FA (verification) TCR use cases; all unregistered A2P 10DLC traffic is blocked at the carrier as of Feb 2025.
- Standard STOP/HELP opt-out required on all alert and account-event bodies; verification bodies carry no STOP/HELP (2FA carve-out).
- Avoid scraping-tool framing in registration: some follower-tracking integrations violate platform ToS — the SMS layer should describe alerts on the creator's *own authorized* connected accounts.

### Disambiguation
The defining line is audience: this sub-vertical's SMS recipient is the single creator-user, so it stays Clear under ACCOUNT_NOTIFICATION. The moment a tool's SMS feature points outward — texting the creator's followers/fans (broadcast updates, DropSMS-style fan blasts, OnlyFans/Fansly mass messaging) — it becomes a different, far more scrutinized use case (often SHAFT-adjacent for adult-creator platforms) and would not ride on this registration. A neighbor that *looks* similar is community / membership tools, but corpus community messages speak to a community's members; here there is no member base being addressed, only the account owner. What seems allowed but isn't: bundling an "engage your new followers automatically" outbound feature into the same campaign — that is audience messaging wearing an analytics label and must be separated.

### Sources
https://creatorflow.so/tools/instagram-follower-milestone-tracker
https://www.upgrow.com/blog/real-time-alerts-viral-content
https://thesocialcat.com/glossary/new-follower-alert
https://agencyanalytics.com/features/alerts
https://www.influencer-hero.com/blogs/top-influencer-crm-software
https://influenceflow.io/resources/creator-crm-tools-and-automation-the-complete-2026-guide-for-building-your-creator-business/
https://circleboom.com/live-twitter-follower-counter
https://streamlabs.com/stream-widgets/alert-box
https://buffer.com/resources/best-social-media-analytics-tools/
https://www.agorapulse.com/features/social-media-reporting/
https://sakari.io/blog/meeting-10dlc-compliance-with-opt-ins
https://www.infobip.com/blog/what-is-a2p-10dlc
