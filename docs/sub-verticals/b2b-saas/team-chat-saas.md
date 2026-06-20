## Internal communications / team chat tools
**Vertical:** B2B SaaS & developer tooling
**Bucket:** Clear
**URL slug:** /for/team-chat-saas

### What this builder is making
A "Slack-for-X" workspace messaging product — channels, direct messages, mentions, and threads scoped to a company, often tuned to a niche (deskless retail/manufacturing crews, agencies, healthcare ops, or a vertical community). The core job is moving messages between members reliably, including members who are off-app or deskless. Revenue is per-seat SaaS, so an unread message that never gets seen is both a product failure and a churn signal.

### Why they need SMS
The make-or-break moment is the message someone needs to see while they're away from the app — an @mention asking for a decision, an urgent channel broadcast, or a DM that's been sitting unread for hours. Email digests and push notifications fail exactly where it matters: 83% of deskless workers lack regular email access, and push is silenced or undelivered on locked phones. SMS wins because it lands on any phone with a ~98% open rate and is read within minutes, making it the only fallback channel that actually closes the loop.

### Message categories
1. account-events — workspace/seat lifecycle (new-device sign-in, seat/billing changes) is churn-critical and maps cleanly to existing bodies.
2. team-alerts — the system-alert / escalation / broadcast pattern is the closest existing home for urgent channel pings and "needs attention" pulls, though chat mentions need reframing (see Stretch).
3. verification — phone-ownership at signup and step-up confirmations are standard for any workspace tool.
4. community — for the "Slack-for-community" variant, the announcement/event/onboarding ladder applies directly.
5. customer-support — only as the builder's own product-support channel, not core to the chat workflow.
Excluded: appointments (no booking model), order-updates (no commerce), marketing (separate consent; internal comms is transactional), waitlist (no queue gating in a workspace tool).

### Workflows

**Mention / DM catch-up**
Pull an away member back to a message that needs them.
Sequence:
1. verification:verification-code — "Verify your phone" — confirm the number before any catch-up SMS is sent.
2. GAP:mention-notification — "You were mentioned" — someone @mentioned you in a channel and you're away.
3. GAP:unread-dm-notification — "Unread direct message" — a DM has gone unread past a threshold.
Variable aliases (only where default feels wrong):
- workspace_name: "Acme HQ" (the company's chat workspace, not RelayKit)

**Urgent channel broadcast**
Reach every member of a channel — including deskless ones — when a message can't wait.
Sequence:
1. team-alerts:system-alert — "Channel broadcast" — severity-cued push of an urgent post to affected members.
2. team-alerts:escalation-ping — "Needs acknowledgement" — ACK-required broadcast that escalates if unread.
Variable aliases (only where default feels wrong):
- severity: "Urgent"
- alert_type: "Company-wide notice"
- system_name: "#ops-critical"

**Workspace invite & onboarding**
Get a new member from invite to first message.
Sequence:
1. GAP:workspace-invite — "You're invited" — an admin invited this person to join the workspace.
2. verification:verification-code — "Verify your phone" — confirm the number at join.
3. account-events:new-device-sign-in — "New sign-in" — flag access from a new device.
Variable aliases (only where default feels wrong):
- workspace_name: "Acme HQ"

**Seat & billing lifecycle**
Keep the workspace admin and members ahead of access-affecting changes.
Sequence:
1. account-events:trial-ending — "Trial ending" — workspace trial is about to lapse.
2. account-events:payment-failed — "Payment failed" — card declined; seats at risk.
3. account-events:subscription-confirmed — "Plan updated" — seat/plan change went through.
4. account-events:account-suspended — "Workspace suspended" — access cut for non-payment or policy.

### Message gaps

**GAP:mention-notification**
- **Classification:** Vertical-specific
- **Proposed corpus home:** team-alerts:mention-notification (or a future `chat` category if the vertical grows)
- **Proposed universal name:** You were mentioned in a channel | "You were mentioned"
- **Why:** The defining event of a chat tool — an @mention pulling an away member back — has no corpus message; team-alerts:system-alert reads as infra, not a human ping.
- **Draft variants:**
  - Standard: `{{workspace_name}}: {{sender_name}} mentioned you in {{channel_name}}. Read it: {{thread_link}} Reply STOP to opt out.`
  - Friendly: `{{sender_name}} just mentioned you in {{channel_name}} on {{workspace_name}}. Take a look: {{thread_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{sender_name}} mentioned you in {{channel_name}}. {{thread_link}} STOP to opt out.`
- **New variables:** {{sender_name}}, {{channel_name}}, {{thread_link}}

**GAP:unread-dm-notification**
- **Classification:** Vertical-specific
- **Proposed corpus home:** team-alerts:unread-dm-notification (or future `chat` category)
- **Proposed universal name:** You have an unread direct message | "Unread direct message"
- **Why:** A 1:1 DM left unread past a threshold is the second core away-member catch-up trigger and has no corpus equivalent.
- **Draft variants:**
  - Standard: `{{workspace_name}}: {{sender_name}} sent you a direct message. Read it: {{thread_link}} Reply STOP to opt out.`
  - Friendly: `You have an unread message from {{sender_name}} on {{workspace_name}}. Here it is: {{thread_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: DM from {{sender_name}}. {{thread_link}} STOP to opt out.`
- **New variables:** {{sender_name}}, {{thread_link}}

**GAP:workspace-invite**
- **Classification:** Vertical-specific
- **Proposed corpus home:** account-events:workspace-invite
- **Proposed universal name:** You've been invited to a workspace | "You're invited"
- **Why:** The join-via-SMS-invite flow is the front door for a deskless-first chat tool and has no corpus message; community:welcome fires after joining, not as the invite itself.
- **Draft variants:**
  - Standard: `{{workspace_name}}: {{inviter_name}} invited you to join the team. Accept here: {{invite_link}} Reply STOP to opt out.`
  - Friendly: `{{inviter_name}} invited you to {{workspace_name}}. Join the team here: {{invite_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{inviter_name}} invited you. Join: {{invite_link}} STOP to opt out.`
- **New variables:** {{inviter_name}}, {{invite_link}}

**STRETCH:team-alerts:system-alert**
- **Classification:** Stretch
- **Proposed corpus home:** stretch: team-alerts:system-alert used as an urgent channel broadcast — fits the severity-cued shape but its variables ({{alert_type}}, {{system_name}}) frame a monitoring incident, not a human post in a named channel.
- **Proposed universal name:** Urgent channel broadcast | "Channel broadcast"
- **Why:** Works for "a message can't wait" pushes only by overloading infra-alert variables; a chat-native broadcast message would read more naturally.

### Content constraints
- Standard A2P 10DLC carrier rules apply. No vertical-specific carrier restrictions.
- Internal/employee messaging still requires per-recipient consent and STOP/HELP handling on the 10DLC number — employment does not substitute for opt-in.
- Keep these bodies transactional. Routing chat-notification volume through a MARKETING campaign is a registration mismatch; map to ACCOUNT_NOTIFICATION.
- Sender frame is the customer's workspace name ({{workspace_name}}), never "RelayKit," so the recipient recognizes their own team.

### Disambiguation
This entry is the builder making a team chat / internal-comms SaaS, where RelayKit powers the notification edge (mention, DM, invite, broadcast) that pulls away members back to the app. It is distinct from team-alerts as a category, which serves ops/on-call incident tooling — overlap is real for urgent broadcasts but the chat builder's primary value is human-to-human messages, not machine-to-human system alerts. It is also distinct from the "Slack-for-community" variant: when the workspace is a paid/member community rather than a company, the community category (announcements, events, onboarding ladder) applies instead of account-events seat lifecycle.

### Sources
https://www.joinblink.com/intelligence/10-slack-alternatives-in-2025
https://zapier.com/blog/slack-alternatives/
https://www.zoom.com/en/blog/slack-alternatives/
https://slack.com/team-chat
https://www.yourco.io/resources/employee-texting-platform
https://www.udext.com/blog/top-staff-communication-apps
https://www.changeengine.com/articles/the-12-best-frontline-communication-tools-for-2025
https://sinch.com/engage/use-cases/internal-sms/
https://www.hubengage.com/platform/employee-text-messaging/
https://www.alert-software.com/sms-notifications
https://clerk.chat/blog/teams-notifications/
https://www.yakchat.com/posts/yakchat-sms-notifications-in-microsoft-teams
https://help.twilio.com/articles/4408675845019-SMS-Compliance-and-A2P-10DLC-in-the-US
https://sakari.io/blog/meeting-10dlc-compliance-with-opt-ins
