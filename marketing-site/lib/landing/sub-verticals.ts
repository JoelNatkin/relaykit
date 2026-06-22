import type { CategoryQA } from "@/lib/landing/categories";
import type { VariablesExample } from "@/components/home/variables-section";

// Sub-vertical landing registry (Phase 1C / A3). Each entry describes one
// `/for/{slug}` page: its SEO/hero copy, the Q&A set, the default configurator
// category, and the curated workflows that lead the page. Workflows are a pure
// display layer over the universal corpus (MASTER_PLAN Phase 1C) — a step either
// points at a corpus message via `corpusId` ("category-id:message-id") or carries
// its own `customVariants`; `variableAliases` supply contextual placeholder text.
// VariantTone here is the corpus tone enum ("Standard" | "Friendly" | "Brief").

export interface WorkflowStep {
  corpusId: string | null;
  displayName: string;
  customVariants?: {
    standard: string;
    friendly: string;
    brief: string;
  };
  variableAliases?: Record<string, string>;
}

export interface Workflow {
  id: string;
  displayName: string;
  description: string;
  steps: WorkflowStep[];
}

export interface SubVerticalLanding {
  urlSlug: string;
  dataSlug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  heroEyebrow: string;
  h1: string;
  heroBody: string;
  heroExamples: string[];
  moment: { body: string; exampleSms: string; exampleReply: string };
  qa: CategoryQA[];
  defaultCategory: string;
  workflows: Workflow[];
  variablesExample?: VariablesExample;
}

export const SUB_VERTICAL_LANDINGS: SubVerticalLanding[] = [
  {
    urlSlug: "developer-tools",
    dataSlug: "developer-tools-api-platforms-infrastructure-saas",
    name: "Developer tools",

    metaTitle: "SMS for developer tools & API platforms — RelayKit",
    metaDescription:
      "Add account-event text messages — payment failures, security alerts, trial endings — to your developer tool or API platform. Free to author and test; RelayKit handles registration, opt-outs, and carrier rules.",

    heroEyebrow: "Developer tools",
    h1: "Text messaging for developer tools apps.",
    heroBody:
      "Deploy alerts, quota warnings, payment failures — the messages that keep a production platform running.",
    heroExamples: [
      "prod deploy #4821 failed. Roll back or fix: yourapp.com/deploys/4821",
      "API calls at 80% of your monthly quota. Upgrade before requests start failing: yourapp.com/billing",
      "Card ending 4242 was declined. Update payment to keep your account active: yourapp.com/billing",
      "New sign-in from a new device in Berlin. Not you? Secure your account: yourapp.com/security",
    ],

    moment: {
      body: "A production deploy fails at 2am. The on-call engineer gets a text before the first customer opens a support ticket.",
      exampleSms: "BuildKit: CRITICAL — prod deploy #4821 failed. Roll back or fix: yourapp.com/deploys/4821",
      exampleReply: "Fixed before anyone noticed",
    },

    qa: [
      {
        q: "Can I send deploy alerts from a CI/CD pipeline directly, or does it need to go through my app's backend?",
        lead: "Either works — RelayKit is an API call, not a platform integration.",
        body: "You can call the RelayKit API from a GitHub Actions step, a build hook, or any webhook your pipeline fires. The message goes out the same way regardless of where the call originates. Most teams start with a direct pipeline call and move it behind their backend when they want delivery tracking or per-user routing.",
      },
      {
        q: "What's the difference between a system alert and an on-call page for deploy failures?",
        lead: "Urgency and what you expect the recipient to do.",
        body: "An on-call page fires when something is down and needs human attention now — it's the shortest message in the library and links straight to the incident. A system alert is for informational threshold events: quota at 80%, latency above baseline, a job that finished. Both use the same channel; the difference is the action you're asking for.",
      },
      {
        q: "Do verification texts for API key rotation need a STOP line?",
        lead: "No — step-up confirmation codes are 2FA traffic and carry the same carve-out as signup codes.",
        body: "The 2FA TCR exemption covers any code sent to verify a specific action, not just signup. Key rotation, ownership transfer, payment method changes — all qualify. No STOP language in the body.",
      },
      {
        q: "What's the right message for an API key rotation or ownership transfer?",
        lead: "A confirmation code sent to the account owner before the action completes.",
        body: "High-stakes actions — key rotation, billing-owner transfer, team permission changes — should require a step-up code. It's a one-time code sent to the verified number on the account, confirming the action before it goes through. Never put the key itself in the message body; link to the dashboard instead.",
      },
    ],

    defaultCategory: "team-alerts",

    workflows: [
      {
        id: "deploy-failure-alert",
        displayName: "Deploy / build failure alert",
        description: "Messages your on-call engineer the moment a production deploy or build fails.",
        steps: [
          {
            corpusId: "team-alerts:on-call-page",
            displayName: "Deploy failed",
            variableAliases: {
              system_name: "prod deploy #4821",
              alert_type: "build failed",
              severity: "CRITICAL",
            },
          },
          {
            corpusId: "team-alerts:escalation-ping",
            displayName: "Deploy ACK request",
            variableAliases: {
              system_name: "prod deploy #4821",
              severity: "CRITICAL",
            },
          },
          {
            corpusId: "team-alerts:system-alert",
            displayName: "Deploy recovered",
            variableAliases: {
              system_name: "prod deploy #4821",
              alert_type: "deploy recovered",
              severity: "INFO",
            },
          },
        ],
      },
      {
        id: "quota-breach",
        displayName: "API quota / rate-limit breach",
        description: "Warns before the cap is hit, then alerts when requests start failing.",
        steps: [
          {
            corpusId: null,
            displayName: "Quota warning",
            customVariants: {
              standard:
                "{{workspace_name}}: {{resource_name}} is at {{usage_percent}}% of your {{quota_period}} quota. Upgrade before requests start failing: {{account_link}} Reply STOP to opt out.",
              friendly:
                "Heads up from {{workspace_name}} — {{resource_name}} has hit {{usage_percent}}% of your {{quota_period}} quota. Upgrade here to avoid 429s: {{account_link}} Reply STOP to opt out.",
              brief:
                "{{workspace_name}}: {{resource_name}} at {{usage_percent}}% quota. Upgrade: {{account_link}} STOP to opt out.",
            },
            variableAliases: {
              resource_name: "API calls",
              usage_percent: "80",
              quota_period: "monthly",
            },
          },
          {
            corpusId: null,
            displayName: "Quota exceeded",
            customVariants: {
              standard:
                "{{workspace_name}}: {{resource_name}} quota exceeded. Requests are being rejected. Upgrade now to restore service: {{account_link}} Reply STOP to opt out.",
              friendly:
                "{{workspace_name}}: {{resource_name}} hit 100% — requests are failing now. Upgrade here to restore: {{account_link}} Reply STOP to opt out.",
              brief:
                "{{workspace_name}}: {{resource_name}} quota exceeded. Restore: {{account_link}} STOP to opt out.",
            },
            variableAliases: {
              resource_name: "API calls",
              usage_percent: "100",
              quota_period: "monthly",
            },
          },
        ],
      },
      {
        id: "service-status-incident",
        displayName: "Service-status incident",
        description: "Notifies affected accounts when the platform is down, and again when it clears.",
        steps: [
          {
            corpusId: "customer-support:service-status-alert",
            displayName: "Platform incident",
            variableAliases: {
              eta: "30 min",
            },
          },
          {
            corpusId: "customer-support:account-issue-notification",
            displayName: "Incident resolved",
          },
        ],
      },
      {
        id: "failed-payment-recovery",
        displayName: "Failed-payment recovery",
        description: "Catches a declined card before it suspends the account and takes down production workloads.",
        steps: [
          {
            corpusId: "account-events:payment-failed",
            displayName: "Card declined",
          },
          {
            corpusId: "account-events:account-suspended",
            displayName: "Account suspended",
          },
        ],
      },
      {
        id: "trial-subscription-lifecycle",
        displayName: "Trial / subscription lifecycle",
        description: "Nudges a trial toward conversion, then confirms when a plan is chosen.",
        steps: [
          {
            corpusId: "account-events:trial-ending",
            displayName: "Trial ending",
          },
          {
            corpusId: "account-events:subscription-confirmed",
            displayName: "Plan confirmed",
          },
        ],
      },
      {
        id: "security-signin-sensitive-action",
        displayName: "Security: new sign-in / sensitive action",
        description: "Alerts on new device access and gates destructive actions behind a confirmation code.",
        steps: [
          {
            corpusId: "account-events:new-device-signin",
            displayName: "New sign-in",
            variableAliases: {
              device_context: "a new device in Berlin",
            },
          },
          {
            corpusId: "verification:confirmation-code",
            displayName: "Action confirmation code",
          },
        ],
      },
      {
        id: "signup-verification",
        displayName: "Signup phone verification",
        description: "Proves phone ownership at account creation.",
        steps: [
          {
            corpusId: "verification:verification-code",
            displayName: "Signup code",
          },
        ],
      },
      {
        id: "closed-beta-waitlist",
        displayName: "Closed-beta / early-access waitlist",
        description: "Runs the gated-access funnel from joined, to access granted, to lapsed.",
        steps: [
          {
            corpusId: "waitlist:joined",
            displayName: "On the waitlist",
          },
          {
            corpusId: "waitlist:position-update",
            displayName: "Position update",
          },
          {
            corpusId: "waitlist:your-turn",
            displayName: "Access granted",
          },
          {
            corpusId: "waitlist:grace-expiring",
            displayName: "Claim expiring",
          },
          {
            corpusId: "waitlist:missed",
            displayName: "Access lapsed",
          },
        ],
      },
      {
        id: "support-ticket-lifecycle",
        displayName: "Support-ticket lifecycle",
        description: "Keeps a developer-customer informed on an open ticket without making them poll a portal.",
        steps: [
          {
            corpusId: "customer-support:ticket-received",
            displayName: "Ticket logged",
          },
          {
            corpusId: "customer-support:agent-response",
            displayName: "Ticket reply",
          },
          {
            corpusId: "customer-support:resolution-notification",
            displayName: "Ticket resolved",
          },
        ],
      },
    ],
  },
  {
    urlSlug: "customer-support-saas",
    dataSlug: "customer-support-helpdesk-saas",
    name: "Customer support SaaS",

    metaTitle: "SMS for customer support & helpdesk SaaS — RelayKit",
    metaDescription:
      "Add ticket-lifecycle text messages — logged, replied, resolved — to your helpdesk or shared-inbox product. Free to author and test; RelayKit handles registration, opt-outs, and carrier rules.",

    heroEyebrow: "Customer support SaaS",
    h1: "Text messaging for customer support apps.",
    heroBody:
      "Ticket updates, service alerts, billing saves — the messages that keep a support conversation moving.",
    heroExamples: [
      "Acme support: ticket #48213 has a reply from Jordan. View it: help.acme.app/t/48213",
      "Acme support: we're aware of a service issue and working on it. ETA around 3pm ET.",
      "Acme: card ending 4242 was declined. Update payment to keep your account active: acme.app/billing",
      "Acme support: ticket #48213 is resolved. Still need help? help.acme.app/t/48213",
    ],

    moment: {
      body: "A customer opens a ticket, gets a reply four hours later, and never sees it. The ticket sits unanswered, the customer files a duplicate, and the agent queue doubles. A text closes that loop in seconds.",
      exampleSms: "Acme support: ticket #48213 has a reply from Jordan. View it: help.acme.app/t/48213",
      exampleReply: "Just saw it, thanks",
    },

    qa: [
      {
        q: "How do I route inbound replies from a ticket-update text back into the ticketing system?",
        lead: "You set up a webhook in RelayKit that forwards inbound MO messages to your backend.",
        body: "When a customer replies to a ticket-update text, the reply hits RelayKit's inbound handler, which fires a webhook to your endpoint. From there:\n- Match the sender's phone number to an open ticket\n- Append the message as a customer reply in your normal agent queue\n- STOP replies are flagged opted-out by RelayKit before your webhook sees them",
      },
      {
        q: "Should the ticket-update texts come from the helpdesk platform's brand or from the end customer's workspace name?",
        lead: "From the end customer's workspace — the one who owns the ticket.",
        body: "The sender frame in each message should be the business the end customer opened a ticket with, not the name of your helpdesk software. If you're powering Acme's support inbox, the message says \"Acme support: ticket #48213 has a reply.\" This is also how the TCR registration works — the workspace registering with RelayKit is Acme, not your platform.",
      },
      {
        q: "Should the ticket-update text fire on every internal agent reassignment, or only on customer-visible updates?",
        lead: "Only on customer-visible updates — reassignments are internal routing, not customer events.",
        body: "Firing on every reassignment trains customers to ignore the thread. The right triggers are: ticket received, first substantive agent reply, and resolved. Agent-assigned is worth sending once if your product emphasizes named accountability — but only the first assignment, not every handoff. Internal escalations, queue moves, and tag changes never warrant a customer text.",
      },
      {
        q: "How many ticket-lifecycle texts is too many for a single ticket?",
        lead: "Four is the natural ceiling — logged, agent assigned, agent replied, resolved.",
        body: "Beyond four, customers start ignoring the thread or opting out. CSAT belongs in email, not a fifth text — by the time a ticket is resolved, a satisfaction rating via SMS feels like noise. If a ticket bounces between agents or takes multiple reply cycles, only send the \"agent replied\" text once per substantive update, not once per internal reassignment.",
      },
    ],

    defaultCategory: "customer-support",

    workflows: [
      {
        id: "ticket-lifecycle",
        displayName: "Ticket lifecycle",
        description: "Keeps a customer informed from open to close without making them check the portal.",
        steps: [
          {
            corpusId: "customer-support:ticket-received",
            displayName: "Ticket logged",
            variableAliases: {
              ticket_number: "48213",
            },
          },
          {
            corpusId: "customer-support:agent-assigned",
            displayName: "Agent assigned",
            variableAliases: {
              ticket_number: "48213",
              agent_name: "Jordan",
            },
          },
          {
            corpusId: "customer-support:agent-response",
            displayName: "Agent replied",
            variableAliases: {
              ticket_number: "48213",
              ticket_link: "help.acme.app/t/48213",
            },
          },
          {
            corpusId: "customer-support:resolution-notification",
            displayName: "Ticket resolved",
            variableAliases: {
              ticket_number: "48213",
              ticket_link: "help.acme.app/t/48213",
            },
          },
        ],
      },
      {
        id: "service-incident",
        displayName: "Service incident broadcast",
        description: "Tells affected users about a live outage and confirms when it clears.",
        steps: [
          {
            corpusId: "customer-support:service-status-alert",
            displayName: "Service issue",
            variableAliases: {
              eta: "around 3pm ET",
            },
          },
          {
            corpusId: "customer-support:account-issue-notification",
            displayName: "Issue resolved",
          },
        ],
      },
      {
        id: "billing-lifecycle-save",
        displayName: "Billing & lifecycle save",
        description: "Catches churn-critical billing events the customer would miss in email.",
        steps: [
          {
            corpusId: "account-events:payment-failed",
            displayName: "Card declined",
          },
          {
            corpusId: "account-events:trial-ending",
            displayName: "Trial ending",
          },
          {
            corpusId: "account-events:subscription-confirmed",
            displayName: "Plan confirmed",
          },
          {
            corpusId: "account-events:account-suspended",
            displayName: "Account suspended",
          },
        ],
      },
      {
        id: "account-security",
        displayName: "Account security",
        description: "Proves phone ownership at signup and gates sensitive account actions behind a confirmation code.",
        steps: [
          {
            corpusId: "verification:verification-code",
            displayName: "Signup code",
          },
          {
            corpusId: "verification:confirmation-code",
            displayName: "Action confirmation",
          },
        ],
      },
    ],
  },
  {
    urlSlug: "project-management-saas",
    dataSlug: "project-management-productivity-saas",
    name: "Project management SaaS",

    metaTitle: "SMS for project management & productivity SaaS — RelayKit",
    metaDescription:
      "Add task assignment, deadline, and mention texts to your project management app. Free to author and test; RelayKit handles registration, opt-outs, and carrier rules.",

    heroEyebrow: "Project management SaaS",
    h1: "Text messaging for project management apps.",
    heroBody:
      "Task assignments, deadline nudges, @-mentions — the texts that keep work moving when nobody's watching the app.",
    heroExamples: [
      "Acme Project Hub: Task #248: Ship onboarding flow was assigned to you. View: acme.app/t/248",
      "Acme Project Hub: heads up — Task: Finalize Q3 roadmap is due tomorrow 5pm. acme.app/t/312",
      "Acme Project Hub: Dana mentioned you on Task #248. Take a look: acme.app/t/248",
      "Acme Project Hub: card ending 4242 was declined. Update payment to keep your account active: acme.app/billing",
    ],

    moment: {
      body: "A task gets assigned at 4pm. The assignee is heads-down in a meeting. The in-app notification sits unread. The deadline slips on a Tuesday afternoon because nobody saw the ping. A text changes that.",
      exampleSms: "Acme Project Hub: Task #248: Ship onboarding flow was assigned to you. View: acme.app/t/248",
      exampleReply: "On it",
    },

    qa: [
      {
        q: "Should I send a text for every task status change, or only for certain events?",
        lead: "Only for events that require a specific person to act right now.",
        body: "A task moving from \"In Progress\" to \"In Review\" is useful to see in the app — it doesn't need to interrupt anyone's phone. Save SMS for the moments that matter: someone was just assigned work, their name was mentioned directly, or a deadline is hours away. If you text on every status change, people stop reading them.",
      },
      {
        q: "Who gets the text when a task is assigned?",
        lead: "The person the task was just given to — no one else by default.",
        body: "When someone gets assigned a task, they're the one who needs to know. Watchers and teammates don't need a text every time something moves — that's what the in-app feed is for. SMS is for the one person who has to act. A project manager might want an overdue escalation after a grace period, but make that something they opt into rather than a default.",
      },
      {
        q: "What's the difference between a \"due soon\" text and an \"overdue\" text?",
        lead: "One is a heads-up with time to act; the other is a direct statement that the deadline passed.",
        body: "For \"due soon,\" keep the tone informational — the owner still has time. For overdue, say it plainly: the deadline passed. Don't soften an overdue notice into \"coming up soon\" — that's confusing when the work is already late. Two separate messages, two separate triggers in your app.",
      },
      {
        q: "Can I trigger task texts from a webhook, or does it need more setup than that?",
        lead: "A webhook is fine — it's just an API call.",
        body: "Whenever your app fires an event (task assigned, deadline approaching), you make one API call to RelayKit with the recipient's number and the message. It can come from a webhook, a background job, or anywhere else in your code. Your AI tool can wire this up from a description of what you want to happen.",
      },
    ],

    defaultCategory: "team-alerts",

    workflows: [
      {
        id: "task-events",
        displayName: "Task events",
        description: "Keeps an owner in the loop when something changes on their work.",
        steps: [
          {
            corpusId: "team-alerts:task-assigned",
            displayName: "Task assigned",
            variableAliases: {
              item_name: "Task #248: Ship onboarding flow",
              action_link: "acme.app/t/248",
            },
          },
          {
            corpusId: "team-alerts:task-assigned",
            displayName: "You were mentioned",
            variableAliases: {
              item_name: "Task #248: Ship onboarding flow",
              action_link: "acme.app/t/248",
            },
          },
          {
            corpusId: "team-alerts:incident-resolved",
            displayName: "Blocker cleared",
            variableAliases: {
              system_name: "Task #312",
              incident_id: "blocker",
              action_link: "acme.app/t/312",
            },
          },
        ],
      },
      {
        id: "deadline-pressure",
        displayName: "Deadline pressure",
        description: "Nudges the owner as a task approaches or crosses its due date.",
        steps: [
          {
            corpusId: "team-alerts:task-reminder",
            displayName: "Due soon",
            variableAliases: {
              item_name: "Task: Finalize Q3 roadmap",
              due_time: "tomorrow 5pm",
              action_link: "acme.app/t/312",
            },
          },
          {
            corpusId: "team-alerts:service-level-alert",
            displayName: "Overdue",
            variableAliases: {
              system_name: "Task: Finalize Q3 roadmap",
              incident_id: "overdue",
              action_link: "acme.app/t/312",
            },
          },
        ],
      },
      {
        id: "subscription-lifecycle",
        displayName: "Subscription & account lifecycle",
        description: "Keeps the workspace owner ahead of billing and access events.",
        steps: [
          {
            corpusId: "account-events:trial-ending",
            displayName: "Trial ending",
          },
          {
            corpusId: "account-events:payment-failed",
            displayName: "Payment failed",
          },
          {
            corpusId: "account-events:subscription-confirmed",
            displayName: "Plan updated",
          },
          {
            corpusId: "account-events:account-suspended",
            displayName: "Account suspended",
          },
        ],
      },
      {
        id: "account-security",
        displayName: "Account security",
        description: "Proves phone ownership at signup and gates sensitive actions.",
        steps: [
          {
            corpusId: "verification:verification-code",
            displayName: "Verify phone",
          },
          {
            corpusId: "verification:login-code",
            displayName: "Login code",
          },
        ],
      },
    ],
  },
  {
    urlSlug: "identity-auth-saas",
    dataSlug: "identity-authentication-sso-saas",
    name: "Identity & auth SaaS",

    metaTitle: "SMS for identity, authentication & SSO SaaS — RelayKit",
    metaDescription:
      "Add phone verification, login codes, recovery codes, and step-up confirmation to your auth product. Free to author and test; RelayKit handles registration, opt-outs, and carrier rules.",

    heroEyebrow: "Identity & auth SaaS",
    h1: "Text messaging for authentication apps.",
    heroBody:
      "Verification codes, login codes, recovery codes, step-up confirmation — the texts your SDK sends so users can get in.",
    heroExamples: [
      "Acme: Verification code: 847291. Expires in 10 minutes.",
      "Acme: Your login code is 512847. Expires in 5 minutes.",
      "Acme: Recovery code: 204819. Expires in 10 minutes.",
      "Acme: Confirmation code: 937164. Expires in 10 minutes.",
    ],

    moment: {
      body: "The user submits their phone number and stares at a code field. The code has to land in seconds — not minutes. If it doesn't, they refresh, try again, or give up. SMS is the only channel fast enough to carry a time-boxed code to a phone the user is already holding.",
      exampleSms: "Acme: Your login code is 512847. Expires in 5 minutes.",
      exampleReply: "",
    },

    qa: [
      {
        q: "Which code type should I use for a password reset — recovery code or confirmation code?",
        lead: "Recovery code if the user is locked out; confirmation code if they're already logged in.",
        body: "Recovery code is for getting back into an account — the user can't sign in and needs an SMS code to regain access. Confirmation code is for a sensitive action an already-logged-in user is about to take, like changing their password or swapping an MFA device. The names in the message match what the user is experiencing, so pick the one that fits the moment.",
      },
      {
        q: "What name appears in the verification text — my product's name or something else?",
        lead: "Your product's name — whatever the recipient signed up for.",
        body: "The person receiving the code doesn't know what auth library you used to build your app. They signed up for your product, and that's what should appear in the text. You pass your app's name in when you send the message. If it says something unfamiliar, people assume it's spam.",
      },
      {
        q: "Do I need a STOP line in my verification texts?",
        lead: "No — verification codes are a special case that don't need opt-out language.",
        body: "One-time codes for signup, login, recovery, and sensitive-action confirmation are exempt from the \"Reply STOP to opt out\" requirement. Every other message type needs it — but not these. Don't add it to OTP messages; the absence of opt-out language is part of what tells carriers the message is genuinely a verification code.",
      },
      {
        q: "Do I need a separate setup for each type of verification code — signup, login, recovery?",
        lead: "No — one registration covers all of them.",
        body: "You register once with RelayKit under the verification use case. From there, you choose which message type fits each moment in your app: verification code for signup, login code for MFA, recovery code for account recovery, confirmation code for sensitive actions. They're all part of the same registration.",
      },
    ],

    defaultCategory: "verification",

    workflows: [
      {
        id: "phone-verification",
        displayName: "Phone verification at signup",
        description: "Proves a new user controls the number they entered.",
        steps: [
          {
            corpusId: "verification:verification-code",
            displayName: "Verification code",
            variableAliases: {
              business_name: "Acme",
              expiry_minutes: "10",
            },
          },
        ],
      },
      {
        id: "mfa-login",
        displayName: "SMS second factor (MFA)",
        description: "Delivers the step-up code when a returning user logs in with SMS 2FA enabled.",
        steps: [
          {
            corpusId: "verification:login-code",
            displayName: "Login code",
            variableAliases: {
              business_name: "Acme",
              expiry_minutes: "5",
            },
          },
        ],
      },
      {
        id: "step-up-confirmation",
        displayName: "Sensitive-action step-up",
        description: "Re-verifies the user before a high-risk action — password change, MFA device swap, billing update.",
        steps: [
          {
            corpusId: "verification:confirmation-code",
            displayName: "Confirmation code",
            variableAliases: {
              business_name: "Acme",
            },
          },
        ],
      },
      {
        id: "account-recovery",
        displayName: "Account recovery",
        description: "Lets a locked-out user back in via SMS.",
        steps: [
          {
            corpusId: "verification:recovery-code",
            displayName: "Recovery code",
            variableAliases: {
              business_name: "Acme",
              expiry_minutes: "10",
            },
          },
        ],
      },
      {
        id: "new-device-alert",
        displayName: "New-device security alert",
        description: "Flags unrecognized device access with a secure-it path.",
        steps: [
          {
            corpusId: "account-events:new-device-signin",
            displayName: "New sign-in",
            variableAliases: {
              device_context: "Chrome on Windows, Austin TX",
            },
          },
        ],
      },
    ],
  },
  {
    urlSlug: "team-chat-saas",
    dataSlug: "internal-communications-team-chat-saas",
    name: "Team chat SaaS",

    metaTitle: "SMS for team chat & internal communications SaaS — RelayKit",
    metaDescription:
      "Add mention notifications, DM catch-up, workspace invites, and urgent broadcasts to your team chat app. Free to author and test; RelayKit handles registration, opt-outs, and carrier rules.",

    heroEyebrow: "Team chat SaaS",
    h1: "Text messaging for team chat apps.",
    heroBody:
      "Mention notifications, unread DMs, workspace invites, urgent broadcasts — the texts that reach members when they're away from the app.",
    heroExamples: [
      "Teamflow: Dana mentioned you in #ops-critical. Take a look: teamflow.app/t/4821",
      "Teamflow: Jordan sent you a direct message. Here it is: teamflow.app/dm/Jordan",
      "Teamflow: Alex invited you to join the team. Join here: teamflow.app/join/abc123",
      "Teamflow Urgent: Company-wide notice in #ops-critical. teamflow.app/c/ops-critical",
    ],

    moment: {
      body: "Someone asks a question in the channel. The person who knows the answer is away from their desk. The thread sits unanswered for two hours. A text closes that loop in minutes — regardless of whether they have the app open.",
      exampleSms: "Teamflow: Dana mentioned you in #ops-critical. Take a look: teamflow.app/t/4821",
      exampleReply: "On it",
    },

    qa: [
      {
        q: "Should mention notifications go out the second someone is mentioned, or is there a delay?",
        lead: "A short delay is better — give people a chance to see it in the app first.",
        body: "If someone gets a text the instant they're mentioned, before they've had a chance to check the app, it feels like noise. Most apps wait 5–15 minutes: if the message hasn't been read by then, send the text. For urgent broadcasts where the sender marked something high-priority, immediate makes more sense. Build the delay as a setting users can adjust rather than a fixed value.",
      },
      {
        q: "What if someone gets both a mention and a DM while they're away — do they get two texts?",
        lead: "Better to send one and hold the second.",
        body: "Two texts in quick succession for the same away session is the fastest way to get someone to opt out. The simpler approach: once you've texted someone, don't text them again for the next 30–60 minutes unless something is marked urgent. One interruption that brings them back is the goal — not a thread of alerts waiting when they unlock their phone.",
      },
      {
        q: "Can I send texts to workspace members without asking them first?",
        lead: "No — you need their consent before sending.",
        body: "Being a member of a workspace doesn't automatically mean someone agreed to receive texts. The right place to capture that is during account creation or in notification preferences — a clear opt-in, not an assumption. This applies to everyone, including employees. Your AI tool can help you add a simple consent step if you don't have one yet.",
      },
      {
        q: "What name shows up as the sender in the text?",
        lead: "Your app's name — whatever your users would recognize.",
        body: "If you're building a team chat app called Teamflow, the text should say \"Teamflow\" — not \"RelayKit\" or anything else. Members recognize their product, not the infrastructure behind it. You pass your app's name in when you send the message. It's one field, and your AI tool will know where it goes.",
      },
    ],

    defaultCategory: "team-alerts",

    workflows: [
      {
        id: "mention-dm-catchup",
        displayName: "Mention & DM catch-up",
        description: "Pulls an away member back when someone needs them.",
        steps: [
          {
            corpusId: "team-alerts:task-assigned",
            displayName: "You were mentioned",
            variableAliases: {
              item_name: "#ops-critical",
              action_link: "teamflow.app/t/4821",
            },
          },
          {
            corpusId: "team-alerts:task-assigned",
            displayName: "Unread direct message",
            variableAliases: {
              item_name: "a direct message from Jordan",
              action_link: "teamflow.app/dm/Jordan",
            },
          },
        ],
      },
      {
        id: "workspace-invite",
        displayName: "Workspace invite",
        description: "Gets a new member from invite to verified.",
        steps: [
          {
            corpusId: "team-alerts:task-assigned",
            displayName: "You're invited",
            variableAliases: {
              item_name: "an invitation to join Teamflow",
              action_link: "teamflow.app/join/abc123",
            },
          },
          {
            corpusId: "verification:verification-code",
            displayName: "Verify your phone",
          },
        ],
      },
      {
        id: "urgent-broadcast",
        displayName: "Urgent channel broadcast",
        description: "Reaches all members including deskless ones when a message can't wait.",
        steps: [
          {
            corpusId: "team-alerts:system-alert",
            displayName: "Channel broadcast",
            variableAliases: {
              severity: "Urgent",
              alert_type: "Company-wide notice",
              system_name: "#ops-critical",
              action_link: "teamflow.app/c/ops-critical",
            },
          },
          {
            corpusId: "team-alerts:escalation-ping",
            displayName: "Needs acknowledgement",
            variableAliases: {
              system_name: "#ops-critical",
            },
          },
        ],
      },
      {
        id: "seat-billing-lifecycle",
        displayName: "Seat & billing lifecycle",
        description: "Keeps the workspace admin ahead of access-affecting changes.",
        steps: [
          {
            corpusId: "account-events:trial-ending",
            displayName: "Trial ending",
          },
          {
            corpusId: "account-events:payment-failed",
            displayName: "Payment failed",
          },
          {
            corpusId: "account-events:subscription-confirmed",
            displayName: "Plan updated",
          },
          {
            corpusId: "account-events:account-suspended",
            displayName: "Workspace suspended",
          },
        ],
      },
    ],
  },
  {
    urlSlug: "analytics-bi-saas",
    dataSlug: "analytics-business-intelligence-saas",
    name: "Analytics & BI SaaS",

    metaTitle: "SMS for analytics & business intelligence SaaS — RelayKit",
    metaDescription:
      "Add threshold alerts, anomaly pings, and scheduled digests to your analytics product. Free to author and test; RelayKit handles registration, opt-outs, and carrier rules.",

    heroEyebrow: "Analytics & BI SaaS",
    h1: "Text messaging for analytics apps.",
    heroBody:
      "Threshold alerts, anomaly pings, scheduled digests — the texts that tell you a number moved before you find out the hard way.",
    heroExamples: [
      "Acme Analytics Warning: Signup conversion below threshold: 2.1% vs 4.0% floor. acme.app/dash/signups",
      "Acme Analytics Warning: checkout_completed event volume down 92% in 1h. acme.app/dash/events",
      "Acme Analytics: your Weekly metrics digest is ready. Take a look: acme.app/reports/weekly",
      "Acme Analytics: card ending 4242 was declined. Update payment to stay active: acme.app/billing",
    ],

    moment: {
      body: "Your signup conversion rate drops from 4% to 2% at 11pm on a Tuesday. Nobody's watching the dashboard. The drop compounds for eight hours before someone opens a browser tab. A text at 11pm changes that.",
      exampleSms: "Acme Analytics Warning: Signup conversion below threshold: 2.1% vs 4.0% floor. acme.app/dash/signups",
      exampleReply: "On it",
    },

    qa: [
      {
        q: "What should I put in the alert text — the metric value, or just a link to the dashboard?",
        lead: "Both — the value in the message, the details behind the link.",
        body: "A text that just says \"metric alert\" and links somewhere isn't much use. Include the metric name and what happened: \"Signup conversion below 2.1% vs 4.0% floor.\" That's enough context to know whether to drop everything or wait until morning. Save the breakdown, the time series, and the comparison for the dashboard.",
      },
      {
        q: "How do I handle the difference between a real drop and just a slow hour?",
        lead: "Set the threshold against a rolling baseline, not a fixed number.",
        body: "A fixed floor fires all night on weekends. A rolling baseline — \"alert if 30% below the same hour last week\" — only fires when something is actually wrong. Most analytics tools that trigger events let you configure which kind of threshold fires the alert. Use that, and your texts will mean something when they arrive.",
      },
      {
        q: "Should a scheduled digest go out even if there's nothing unusual to report?",
        lead: "Yes — the cadence is part of the value.",
        body: "A weekly digest that only arrives when something's wrong isn't a digest, it's an alert. The value of a scheduled report is the habit: your users open it every Monday and know where they stand. Send it on schedule regardless of whether the numbers moved. If everything's flat and healthy, that's worth knowing too.",
      },
      {
        q: "When do I ask users if it's okay to text them?",
        lead: "Right when they give you their phone number for the first time.",
        body: "For an analytics app, that's usually when they create their account. That's when texting makes sense to them and the ask feels natural. RelayKit hosts an opt-in page for your app — your AI tool will know how to link to it from the right spot in your flow.",
      },
    ],

    defaultCategory: "team-alerts",

    workflows: [
      {
        id: "threshold-anomaly-alerting",
        displayName: "Threshold & anomaly alerting",
        description: "Notifies the operator the instant a metric crosses a threshold or deviates from its baseline.",
        steps: [
          {
            corpusId: "team-alerts:system-alert",
            displayName: "Metric alert",
            variableAliases: {
              severity: "Warning",
              system_name: "Signup conversion funnel",
              alert_type: "Below threshold: 2.1% vs 4.0% floor",
              action_link: "acme.app/dash/signups",
            },
          },
          {
            corpusId: "team-alerts:on-call-page",
            displayName: "Critical metric drop",
            variableAliases: {
              severity: "Critical",
              system_name: "Signup conversion funnel",
              action_link: "acme.app/dash/signups",
            },
          },
          {
            corpusId: "team-alerts:escalation-ping",
            displayName: "Unacknowledged alert",
            variableAliases: {
              severity: "Critical",
              system_name: "Signup conversion funnel",
              escalation_to: "your backup",
              action_link: "acme.app/dash/signups",
            },
          },
        ],
      },
      {
        id: "instrumentation-health",
        displayName: "Instrumentation health",
        description: "Warns when event volume drops abnormally — broken tracking, not a real business change.",
        steps: [
          {
            corpusId: "team-alerts:system-alert",
            displayName: "Tracking health alert",
            variableAliases: {
              severity: "Warning",
              alert_type: "Event volume down 92% in 1h",
              system_name: "checkout_completed event",
              action_link: "acme.app/dash/events",
            },
          },
          {
            corpusId: "team-alerts:service-level-alert",
            displayName: "Data pipeline notice",
            variableAliases: {
              system_name: "Data ingestion pipeline",
              incident_id: "LAG-001",
              action_link: "acme.app/dash/pipeline",
            },
          },
        ],
      },
      {
        id: "scheduled-digest",
        displayName: "Scheduled metric digest",
        description: "Delivers a recurring summary of headline numbers on a daily, weekly, or monthly cadence.",
        steps: [
          {
            corpusId: "team-alerts:task-assigned",
            displayName: "Your report is ready",
            variableAliases: {
              item_name: "Weekly metrics digest",
              action_link: "acme.app/reports/weekly",
            },
          },
        ],
      },
      {
        id: "account-lifecycle",
        displayName: "Account lifecycle",
        description: "Keeps the operator ahead of billing and access events on the analytics subscription.",
        steps: [
          {
            corpusId: "account-events:trial-ending",
            displayName: "Trial ending",
          },
          {
            corpusId: "account-events:payment-failed",
            displayName: "Payment failed",
          },
          {
            corpusId: "account-events:new-device-signin",
            displayName: "New sign-in",
          },
        ],
      },
    ],
  },
  {
    urlSlug: "crm-saas",
    dataSlug: "crm-sales-saas",
    name: "CRM & sales SaaS",

    metaTitle: "SMS for CRM & sales SaaS — RelayKit",
    metaDescription:
      "Add speed-to-lead rep alerts, deal updates, and demo reminders to your CRM. Free to author and test; RelayKit handles registration, opt-outs, and carrier rules.",

    heroEyebrow: "CRM & sales SaaS",
    h1: "Text messaging for CRM and sales apps.",
    heroBody:
      "Lead alerts, deal updates, demo reminders — the texts that keep reps moving and prospects showing up.",
    heroExamples: [
      "Acme CRM Hot lead: Globex Corp — inbound demo request. Claim it: acme.app/leads/4821",
      "Acme CRM Deal update: Globex Corp — $40k renewal moved to Negotiation. acme.app/deals/4821",
      "Acme CRM: your demo with Jordan is confirmed for tomorrow at 2pm. acme.app/cal/4821",
      "Acme CRM: card ending 4242 was declined. Update payment to keep your account active: acme.app/billing",
    ],

    moment: {
      body: "A hot lead submits a demo request at 2pm. The assigned rep is in back-to-back calls. The lead goes cold by 2:07. A text to the rep at 2:00 changes that.",
      exampleSms: "Acme CRM Hot lead: Globex Corp — inbound demo request. Claim it: acme.app/leads/4821",
      exampleReply: "On my way",
    },

    qa: [
      {
        q: "What's the most useful thing to text a sales rep when a new lead comes in?",
        lead: "The company name, what they asked about, and a link to the record — nothing else.",
        body: "A rep getting a lead ping while in a meeting needs to know in three seconds whether this is worth stepping out for. \"Globex Corp — inbound demo request\" plus a link does that. Don't include the lead's personal contact details in the text — that belongs in the CRM, behind the link, where it's logged.",
      },
      {
        q: "What happens if a rep doesn't respond to the lead alert?",
        lead: "You set up an escalation — the alert re-fires to a backup rep or manager after a time window.",
        body: "The rep replies to claim the lead; if nobody does within your configured window, the next ping goes to whoever you've set as the escalation contact. Your app handles the timer and the routing logic — RelayKit handles the sending. The escalation ping fires automatically once the window lapses.",
      },
      {
        q: "Should demo reminders go to the prospect or to the rep?",
        lead: "To the prospect — the rep already has it in their calendar.",
        body: "Demo reminders work because the prospect forgot, not the rep. Send the day-before and hour-before reminders to the prospect's number. The rep gets the new-lead alert and the no-show follow-up; the prospect gets the confirmation and reminders. Keep the two flows separate.",
      },
      {
        q: "Do I need to ask reps before texting them?",
        lead: "Yes — being part of your team doesn't automatically mean they agreed to receive texts.",
        body: "The right place to capture it is during account creation or their first login. RelayKit hosts an opt-in page for your app — your AI tool will know how to wire it in once you tell it where new reps set up their profile.",
      },
    ],

    defaultCategory: "team-alerts",

    workflows: [
      {
        id: "speed-to-lead",
        displayName: "Speed-to-lead rep alert",
        description: "Notifies the assigned rep the instant a lead lands and escalates if unworked.",
        steps: [
          {
            corpusId: "team-alerts:system-alert",
            displayName: "New lead assigned",
            variableAliases: {
              severity: "Hot lead",
              system_name: "Globex Corp — inbound demo request",
              alert_type: "New lead assigned",
              action_link: "acme.app/leads/4821",
            },
          },
          {
            corpusId: "team-alerts:escalation-ping",
            displayName: "Lead unworked",
            variableAliases: {
              severity: "Hot lead",
              system_name: "Globex Corp — inbound demo request",
              escalation_to: "your sales manager",
              action_link: "acme.app/leads/4821",
            },
          },
          {
            corpusId: "team-alerts:on-call-page",
            displayName: "Manager escalation",
            variableAliases: {
              severity: "Hot lead",
              system_name: "Globex Corp — inbound demo request",
              action_link: "acme.app/leads/4821",
            },
          },
        ],
      },
      {
        id: "deal-pipeline-alert",
        displayName: "Deal pipeline alert",
        description: "Keeps the deal owner informed when a deal moves or needs approval.",
        steps: [
          {
            corpusId: "team-alerts:system-alert",
            displayName: "Deal moved",
            variableAliases: {
              severity: "Deal update",
              system_name: "Globex — $40k renewal",
              alert_type: "Moved to Negotiation",
              action_link: "acme.app/deals/4821",
            },
          },
          {
            corpusId: "team-alerts:escalation-ping",
            displayName: "Approval needed",
            variableAliases: {
              severity: "Deal update",
              system_name: "Globex — $40k renewal",
              escalation_to: "your sales manager",
              action_link: "acme.app/deals/4821",
            },
          },
        ],
      },
      {
        id: "demo-scheduling",
        displayName: "Demo scheduling",
        description: "Confirms and reminds on calls the rep books with a consenting prospect.",
        steps: [
          {
            corpusId: "appointments:confirmation",
            displayName: "Demo confirmed",
            variableAliases: {
              provider_name: "your account exec",
            },
          },
          {
            corpusId: "appointments:reminder-distant",
            displayName: "Demo tomorrow",
            variableAliases: {
              provider_name: "your account exec",
            },
          },
          {
            corpusId: "appointments:reminder-proximate",
            displayName: "Demo in 1 hour",
            variableAliases: {
              provider_name: "your account exec",
            },
          },
          {
            corpusId: "appointments:no-show-follow-up",
            displayName: "Missed demo",
            variableAliases: {
              provider_name: "your account exec",
            },
          },
        ],
      },
      {
        id: "crm-account-lifecycle",
        displayName: "CRM account lifecycle",
        description: "Keeps the builder's paying customers ahead of billing and access events.",
        steps: [
          {
            corpusId: "account-events:trial-ending",
            displayName: "Trial ending",
          },
          {
            corpusId: "account-events:payment-failed",
            displayName: "Card declined",
          },
          {
            corpusId: "account-events:subscription-confirmed",
            displayName: "Plan updated",
          },
          {
            corpusId: "account-events:account-suspended",
            displayName: "Account suspended",
          },
        ],
      },
    ],
  },
  {
    urlSlug: "hr-hris-saas",
    dataSlug: "hr-hris-payroll-saas",
    name: "HR & HRIS SaaS",

    metaTitle: "SMS for HR, HRIS & workforce SaaS — RelayKit",
    metaDescription:
      "Add shift scheduling, timesheet reminders, and payday confirmations to your HR or workforce app. Free to author and test; RelayKit handles registration, opt-outs, and carrier rules.",

    heroEyebrow: "HR & HRIS SaaS",
    h1: "Text messaging for HR and workforce apps.",
    heroBody:
      "Shift assignments, timesheet reminders, payday confirmations — the texts that reach deskless employees who never see the email.",
    heroExamples: [
      "Acme HR: your timesheet is due by Thursday noon. Submit here to be paid on time: acme.app/timesheets",
      "Acme HR: You're scheduled Sat 3/15 9am-2pm at Downtown HQ as Shift lead. Reply STOP to opt out.",
      "Acme HR: your March 15 pay has been processed. View your pay stub: acme.app/paystubs",
      "Acme HR: your account was just accessed from Chrome on Windows. Not you? acme.app/security",
    ],

    moment: {
      body: "Payroll runs Friday. The cutoff for timesheets is Thursday noon. An employee on the floor hasn't submitted theirs. The email went unread. A text Wednesday afternoon closes that gap.",
      exampleSms: "Acme HR: your timesheet is due by Thursday noon. Submit here to be paid on time: acme.app/timesheets",
      exampleReply: "Just submitted it",
    },

    qa: [
      {
        q: "Do I need to ask employees before texting them?",
        lead: "Yes — being part of your team doesn't automatically mean they agreed to receive texts.",
        body: "The right place to capture it is during onboarding. RelayKit hosts an opt-in page for your app — your AI tool will know how to wire it in once you tell it where new employees set up their profile.",
      },
      {
        q: "Can I include an employee's pay amount in a payday text?",
        lead: "No — confirm the payment happened and link to the stub, but leave the number out.",
        body: "Pay amounts in a text create privacy exposure if the message is seen by someone other than the recipient. The right pattern is: \"Your March 15 pay has been processed — view your stub here.\" The amount lives behind the authenticated link, not in the message itself.",
      },
      {
        q: "What HR events should I text about, and which should stay in email?",
        lead: "Time-sensitive logistics belong in SMS; sensitive or formal communications belong in email.",
        body: "Shift assignments, timesheet reminders, payday confirmations, and check-in prompts are good SMS territory — they're time-sensitive, actionable, and low-stakes if seen by the wrong eyes. Terminations, disciplinary notices, and anything requiring a documented paper trail should stay in email or formal written channels.",
      },
      {
        q: "Should timesheet reminder texts go to all employees or only the ones who haven't submitted yet?",
        lead: "Only the ones who haven't submitted.",
        body: "Texting everyone when half the team already filed is the fastest way to train people to ignore HR texts. Filter on submission status before sending — only people with an open timesheet get the reminder. Your AI tool can add that filter once you tell it which field in your data tracks submission state.",
      },
    ],

    defaultCategory: "team-alerts",

    workflows: [
      {
        id: "shift-lifecycle",
        displayName: "Scheduling & shift lifecycle",
        description: "Assigns, reminds, updates, and starts shifts for an hourly workforce.",
        steps: [
          {
            corpusId: "team-alerts:shift-scheduled",
            displayName: "Shift assigned",
          },
          {
            corpusId: "team-alerts:shift-reminder",
            displayName: "Shift reminder",
          },
          {
            corpusId: "team-alerts:shift-change",
            displayName: "Shift changed",
          },
          {
            corpusId: "team-alerts:shift-start",
            displayName: "Shift starting",
          },
        ],
      },
      {
        id: "payroll-timesheet",
        displayName: "Payroll & timesheet",
        description: "Keeps the pay cycle on time by chasing submission and confirming pay events.",
        steps: [
          {
            corpusId: "team-alerts:task-reminder",
            displayName: "Timesheet due",
            variableAliases: {
              item_name: "your timesheet",
              due_time: "Thursday noon",
              action_link: "acme.app/timesheets",
            },
          },
          {
            corpusId: "account-events:subscription-confirmed",
            displayName: "Payday confirmed",
          },
        ],
      },
      {
        id: "sensitive-change-confirmation",
        displayName: "Sensitive-change confirmation",
        description: "Confirms a high-risk account change before it takes effect.",
        steps: [
          {
            corpusId: "verification:verification-code",
            displayName: "Verify your number",
          },
          {
            corpusId: "verification:confirmation-code",
            displayName: "Confirm this change",
          },
        ],
      },
      {
        id: "account-security",
        displayName: "Account & security alerts",
        description: "Keeps employees informed on account access and lifecycle events.",
        steps: [
          {
            corpusId: "account-events:new-device-signin",
            displayName: "New sign-in",
          },
          {
            corpusId: "account-events:account-suspended",
            displayName: "Account access change",
          },
        ],
      },
    ],
  },
  {
    urlSlug: "applicant-tracking-saas",
    dataSlug: "applicant-tracking-recruiting-saas",
    name: "Applicant tracking SaaS",

    metaTitle: "SMS for applicant tracking & recruiting SaaS — RelayKit",
    metaDescription:
      "Add interview confirmations, stage updates, and offer notifications to your ATS. Free to author and test; RelayKit handles registration, opt-outs, and carrier rules.",

    heroEyebrow: "Applicant tracking SaaS",
    h1: "Text messaging for applicant tracking apps.",
    heroBody:
      "Interview confirmations, stage updates, offer notifications — the texts that keep candidates engaged and interviews from going empty.",
    heroExamples: [
      "Acme Careers: We received your application for Senior Engineer. We'll be in touch with next steps. Reply STOP to opt out.",
      "Acme Careers: Good news on your Senior Engineer application — you're moving to Final Interview. Details: acme.app/apply/4821 Reply STOP to opt out.",
      "Acme Careers: your interview with Maria Chen (Hiring Manager) is confirmed for Thu Jun 25, 2:00pm (video). Reply STOP to opt out.",
      "Acme Careers: Your offer for Senior Engineer is ready to review. See it here: acme.app/offer/4821 Reply STOP to opt out.",
    ],

    moment: {
      body: "A top candidate gets an offer Friday afternoon. The email sits unread all weekend. The team that texted gets the yes.",
      exampleSms: "Acme Careers: Your offer for Senior Engineer is ready to review. See it here: acme.app/offer/4821 Reply STOP to opt out.",
      exampleReply: "Just signed it",
    },

    qa: [
      {
        q: "How many interview reminder texts is too many?",
        lead: "Two is the right number — day-before and an hour out.",
        body: "The day-before reminder gives the candidate time to reschedule if something came up. The hour-out reminder is the no-show guard. A third reminder, on the morning of, starts to feel like pressure rather than service — candidates who got two reminders and still no-showed probably aren't coming. Save the third touchpoint for the rebook flow, not another pre-interview ping.",
      },
      {
        q: "What do I text when a candidate doesn't move forward?",
        lead: "A short, neutral notice — and nothing else in that same message.",
        body: "Say that you won't be moving forward, thank them for their time, and stop. No explanation of the decision, no encouragement to check back for future roles — that slides toward language with legal exposure. Keep it factual and brief. If your platform re-engages declined candidates for future openings, that flow starts separately with its own consent.",
      },
      {
        q: "When do I ask candidates if it's okay to text them?",
        lead: "Right when they give you their phone number for the first time.",
        body: "For an ATS, that's usually during the application — when they fill out their contact info or create a candidate account. That's when texting makes sense to them and the ask feels natural. RelayKit hosts an opt-in page for your app — your AI tool will know how to link to it from the right spot in your flow.",
      },
    ],

    defaultCategory: "appointments",

    workflows: [
      {
        id: "interview-scheduling",
        displayName: "Interview scheduling",
        description: "Books, reminds, and follows up on a scheduled interview.",
        steps: [
          {
            corpusId: "appointments:confirmation",
            displayName: "Interview confirmed",
            variableAliases: {
              provider_name: "Maria Chen (Hiring Manager)",
              appointment_time: "Thu Jun 25, 2:00pm (video)",
            },
          },
          {
            corpusId: "appointments:reminder-distant",
            displayName: "Interview tomorrow",
            variableAliases: {
              provider_name: "Maria Chen (Hiring Manager)",
              appointment_time: "Thu Jun 25, 2:00pm (video)",
            },
          },
          {
            corpusId: "appointments:reminder-proximate",
            displayName: "Interview in 1 hour",
            variableAliases: {
              provider_name: "Maria Chen (Hiring Manager)",
              appointment_time: "Thu Jun 25, 2:00pm (video)",
            },
          },
          {
            corpusId: "appointments:reschedule-confirmation",
            displayName: "Interview moved",
            variableAliases: {
              provider_name: "Maria Chen (Hiring Manager)",
            },
          },
          {
            corpusId: "appointments:cancellation-confirmation",
            displayName: "Interview cancelled",
            variableAliases: {
              provider_name: "Maria Chen (Hiring Manager)",
            },
          },
          {
            corpusId: "appointments:no-show-follow-up",
            displayName: "We missed you",
            variableAliases: {
              provider_name: "Maria Chen (Hiring Manager)",
            },
          },
        ],
      },
      {
        id: "application-status",
        displayName: "Application status updates",
        description: "Keeps the candidate informed at every stage from application to offer.",
        steps: [
          {
            corpusId: null,
            displayName: "Application received",
            customVariants: {
              standard:
                "{{workspace_name}}: We received your application for {{job_title}}. We'll be in touch with next steps. Reply STOP to opt out.",
              friendly:
                "Thanks for applying to {{job_title}} at {{workspace_name}} — we've got your application and will be in touch. Reply STOP to opt out.",
              brief:
                "{{workspace_name}}: Application received for {{job_title}}. STOP to opt out.",
            },
            variableAliases: {
              job_title: "Senior Engineer",
            },
          },
          {
            corpusId: null,
            displayName: "You're moving forward",
            customVariants: {
              standard:
                "{{workspace_name}}: Good news on your {{job_title}} application — you're moving to {{next_stage}}. Details: {{status_link}} Reply STOP to opt out.",
              friendly:
                "Update from {{workspace_name}}: your {{job_title}} application is moving forward to {{next_stage}}. More here: {{status_link}} Reply STOP to opt out.",
              brief:
                "{{workspace_name}}: {{job_title}} advanced to {{next_stage}}. {{status_link}} STOP to opt out.",
            },
            variableAliases: {
              job_title: "Senior Engineer",
              next_stage: "Final Interview",
            },
          },
          {
            corpusId: null,
            displayName: "Next step needed",
            customVariants: {
              standard:
                "{{workspace_name}}: One step left on your {{job_title}} application — {{action_needed}}. Complete it: {{status_link}} Reply STOP to opt out.",
              friendly:
                "Quick step on your {{job_title}} application at {{workspace_name}}: {{action_needed}}. Here: {{status_link}} Reply STOP to opt out.",
              brief:
                "{{workspace_name}}: {{job_title}} needs {{action_needed}}. {{status_link}} STOP to opt out.",
            },
            variableAliases: {
              job_title: "Senior Engineer",
              action_needed: "complete the skills assessment",
            },
          },
          {
            corpusId: null,
            displayName: "Offer ready",
            customVariants: {
              standard:
                "{{workspace_name}}: Your offer for {{job_title}} is ready to review. See it here: {{status_link}} Reply STOP to opt out.",
              friendly:
                "Great news from {{workspace_name}} — your {{job_title}} offer is ready. Review it here: {{status_link}} Reply STOP to opt out.",
              brief:
                "{{workspace_name}}: {{job_title}} offer ready. {{status_link}} STOP to opt out.",
            },
            variableAliases: {
              job_title: "Senior Engineer",
            },
          },
          {
            corpusId: null,
            displayName: "Application update",
            customVariants: {
              standard:
                "{{workspace_name}}: An update on your {{job_title}} application — we won't be moving forward this time. Thank you for applying. Reply STOP to opt out.",
              friendly:
                "{{workspace_name}}: Thank you for your interest in {{job_title}}. We won't be moving forward, but we appreciate your time. Reply STOP to opt out.",
              brief:
                "{{workspace_name}}: {{job_title}} — not moving forward. Thank you. STOP to opt out.",
            },
            variableAliases: {
              job_title: "Senior Engineer",
            },
          },
        ],
      },
      {
        id: "candidate-portal-account",
        displayName: "Candidate portal account",
        description: "Verifies a new candidate's phone and alerts on new device access.",
        steps: [
          {
            corpusId: "verification:verification-code",
            displayName: "Verification code",
            variableAliases: {
              business_name: "Acme Careers",
            },
          },
          {
            corpusId: "account-events:new-device-signin",
            displayName: "New sign-in",
            variableAliases: {
              workspace_name: "Acme Careers",
            },
          },
        ],
      },
    ],
  },
  {
    urlSlug: "compliance-grc-saas",
    dataSlug: "compliance-grc-legal-ops-saas",
    name: "Compliance & GRC SaaS",

    metaTitle: "SMS for compliance & GRC SaaS — RelayKit",
    metaDescription:
      "Add failing-control alerts, reviewer deadline pings, and employee task reminders to your GRC platform. Free to author and test; RelayKit handles registration, opt-outs, and carrier rules.",

    heroEyebrow: "Compliance & GRC SaaS",
    h1: "Text messaging for compliance and GRC apps.",
    heroBody:
      "Failing controls, overdue reviews, security tasks — the texts that reach the right person before a compliance gap becomes an audit finding.",
    heroExamples: [
      "Acme GRC Critical: Control failing — MFA enforcement on prod-auth. Details: acme.app/controls/4821 Reply STOP to opt out.",
      "Acme GRC Action needed: Q3 access review approval is due in 3 days. Sign off: acme.app/reviews/4821 Reply STOP to opt out.",
      "Acme GRC: You have a security task due Fri Jun 27: Complete security awareness training. Complete it: acme.app/tasks/4821 Reply STOP to opt out.",
      "Acme GRC Critical: Control failing — MFA enforcement on prod-auth. Reply ACK to claim or it goes to security lead. Reply STOP to opt out.",
    ],

    moment: {
      body: "A control drifts out of compliance at 2am. The on-call security lead gets a text and remediates before the audit window closes.",
      exampleSms: "Acme GRC Critical: Control failing — MFA enforcement on prod-auth. Details: acme.app/controls/4821 Reply STOP to opt out.",
      exampleReply: "Fixed",
    },

    qa: [
      {
        q: "Who gets the alert when a control falls out of compliance — the control owner or the whole security team?",
        lead: "The control owner first, then escalate if they don't acknowledge.",
        body: "Most GRC platforms assign each control to a named owner — that person is responsible for remediating it. The first text goes to them. If they don't reply ACK within your configured window, the escalation ping fires to a security lead or manager. Broadcasting to the whole team before the owner has a chance to respond creates noise and diffuses accountability.",
      },
      {
        q: "What's the difference between an access review deadline text and a failing-control alert?",
        lead: "One is time-bound and scheduled; the other fires when continuous monitoring detects drift.",
        body: "An access review deadline has a known date — it's a calendar event with a text reminder. A failing-control alert fires the moment an automated check detects a control is out of compliance, which can happen any time. The remediation urgency is similar, but the trigger logic in your system is different. Build them as separate notification flows even if they go through the same channel.",
      },
      {
        q: "Do I need to ask employees before texting them security tasks?",
        lead: "Yes — being part of your organization doesn't automatically mean they agreed to receive texts.",
        body: "The right place to capture it is during onboarding or their first login to the compliance tool. RelayKit hosts an opt-in page for your app — your AI tool will know how to wire it in once you tell it where new employees set up their profile.",
      },
      {
        q: "How many reminders should I send for an overdue employee task before stopping?",
        lead: "Weekly nudges until complete, with a cap of three or four before escalating to a manager.",
        body: "Security tasks have a completion deadline that matters — policy acceptance, device enrollment, training — so you can't just stop after one miss. Weekly reminders work for most cadences. After three or four with no action, the right move is a manager escalation rather than another employee text. At that point the person knows about the task; the problem is motivation, not awareness.",
      },
    ],

    defaultCategory: "team-alerts",

    workflows: [
      {
        id: "failing-control-alert",
        displayName: "Failing control alert",
        description: "Notifies the control owner the moment a continuous test detects drift, then escalates if unacknowledged.",
        steps: [
          {
            corpusId: "team-alerts:system-alert",
            displayName: "Control failing",
            variableAliases: {
              severity: "Critical",
              alert_type: "Control failing",
              system_name: "MFA enforcement",
            },
          },
          {
            corpusId: "team-alerts:escalation-ping",
            displayName: "Owner ACK needed",
            variableAliases: {
              severity: "Critical",
              system_name: "MFA enforcement",
              escalation_to: "security lead",
            },
          },
          {
            corpusId: "team-alerts:on-call-page",
            displayName: "Critical control down",
            variableAliases: {
              severity: "Critical",
              system_name: "MFA enforcement",
            },
          },
        ],
      },
      {
        id: "reviewer-approval-deadline",
        displayName: "Reviewer / approval deadline",
        description: "Pushes approvers toward an access review or control-approval deadline before it lapses.",
        steps: [
          {
            corpusId: "team-alerts:service-level-alert",
            displayName: "Review due",
            variableAliases: {
              severity: "Action needed",
              system_name: "Q3 access review",
            },
          },
          {
            corpusId: "team-alerts:escalation-ping",
            displayName: "Approval needed",
            variableAliases: {
              severity: "Action needed",
              system_name: "Q3 access review",
            },
          },
          {
            corpusId: "team-alerts:on-call-page",
            displayName: "Deadline today",
            variableAliases: {
              severity: "Action needed",
              system_name: "Q3 access review",
            },
          },
        ],
      },
      {
        id: "employee-compliance-task",
        displayName: "Employee compliance task",
        description: "Assigns a security task to an individual and nudges until complete.",
        steps: [
          {
            corpusId: null,
            displayName: "Task assigned",
            customVariants: {
              standard:
                "{{workspace_name}}: You have a security task due {{due_date}}: {{task_name}}. Complete it: {{action_link}} Reply STOP to opt out.",
              friendly:
                "{{workspace_name}}: a quick security task for you - {{task_name}}, due {{due_date}}: {{action_link}} Reply STOP to opt out.",
              brief:
                "{{workspace_name}}: {{task_name}} due {{due_date}}. {{action_link}} STOP to opt out.",
            },
            variableAliases: {
              task_name: "Complete security awareness training",
              due_date: "Fri Jun 27",
            },
          },
          {
            corpusId: null,
            displayName: "Task overdue",
            customVariants: {
              standard:
                "{{workspace_name}}: Your security task {{task_name}} is still open. Finish it here: {{action_link}} Reply STOP to opt out.",
              friendly:
                "{{workspace_name}}: still need a minute for {{task_name}}? Wrap it up here: {{action_link}} Reply STOP to opt out.",
              brief:
                "{{workspace_name}}: {{task_name}} still open. {{action_link}} STOP to opt out.",
            },
            variableAliases: {
              task_name: "Complete security awareness training",
            },
          },
        ],
      },
      {
        id: "platform-account-lifecycle",
        displayName: "Platform account lifecycle",
        description: "Keeps the customer's own GRC-platform account secure and active.",
        steps: [
          {
            corpusId: "verification:verification-code",
            displayName: "Verify phone",
          },
          {
            corpusId: "account-events:new-device-signin",
            displayName: "New sign-in",
            variableAliases: {
              device_context: "Chrome on a new Mac",
            },
          },
          {
            corpusId: "account-events:trial-ending",
            displayName: "Trial ending",
          },
          {
            corpusId: "verification:confirmation-code",
            displayName: "Confirm change",
          },
        ],
      },
    ],
  },
  {
    urlSlug: "cybersecurity-saas",
    dataSlug: "cybersecurity-threat-detection-siem-saas",
    name: "Cybersecurity SaaS",

    metaTitle: "SMS for cybersecurity & threat detection SaaS — RelayKit",
    metaDescription:
      "Add detection alerts, escalation pings, and incident resolution texts to your security platform. Free to author and test; RelayKit handles registration, opt-outs, and carrier rules.",

    heroEyebrow: "Cybersecurity SaaS",
    h1: "Text messaging for cybersecurity and threat detection apps.",
    heroBody:
      "Detection alerts, escalation pings, incident resolution — the texts that reach an on-call engineer at 3am before dwell time compounds.",
    heroExamples: [
      "Acme Security P1: Brute-force, 40 failed logins from 203.0.113.9 on prod-auth-gateway. acme.app/incidents/4821 Reply STOP to opt out.",
      "Acme Security P1: ransomware signature on fileserver-02 needs attention. Reply ACK to claim or it goes to secondary on-call. Reply STOP to opt out.",
      "Acme Security: edge-waf cluster incident INC-4471 resolved. acme.app/incidents/4471 Reply STOP to opt out.",
      "Acme Security: prod-auth-gateway SLA breach, incident INC-4471. acme.app/incidents/4471 Reply STOP to opt out.",
    ],

    moment: {
      body: "A brute-force burst hits the auth gateway at 2:47am. The on-call engineer gets a text and locks the account before the attacker moves laterally.",
      exampleSms: "Acme Security P1: Brute-force, 40 failed logins from 203.0.113.9 on prod-auth-gateway. acme.app/incidents/4821 Reply STOP to opt out.",
      exampleReply: "ACK",
    },

    qa: [
      {
        q: "What's the right message when a detection fires — system alert or on-call text?",
        lead: "On-call text for anything that needs a human right now; system alert for everything else.",
        body: "An on-call text is the shortest, most urgent message in the set — it fires when a system is confirmed down or compromised and someone needs to act immediately. A system alert is for informational or mid-severity detections: a threshold crossed, an anomaly logged, a finding that needs review but isn't actively burning. Build your severity-to-message-type mapping before you wire up the notifications — P1/P2 and critical get the on-call text; everything else gets the system alert.",
      },
      {
        q: "How does the ACK escalation work — does the engineer reply to the text?",
        lead: "Yes — they reply ACK to claim the incident, and your backend handles the rest.",
        body: "When an escalation ping fires, the engineer replies ACK from their phone. Your backend receives that inbound reply and marks the incident claimed. If no ACK arrives within your configured window, your app fires the next alert to the secondary on-call. RelayKit delivers the inbound reply to your webhook — your app logic handles the claim and escalation timer.",
      },
      {
        q: "Should I include the raw detection details in the SMS body?",
        lead: "Include enough to act on, but link to the console for the rest.",
        body: "\u201940 failed logins from 203.0.113.9\u2019 in the body tells the engineer what they're looking at. A token, a raw log line, or a full payload in the body is wrong — both for message length and for credential exposure. The rule of thumb: enough context to make the first triage decision from a locked phone, then a link to the full incident record for everything else.",
      },
      {
        q: "Do I need to text an all-clear when an incident is resolved?",
        lead: "Yes — responders need to know when to stand down.",
        body: "Every alert that pulls someone into an incident needs a matching resolution notice. Without it, the responder doesn't know if they're still on watch or can go back to sleep. The resolution text is short: system name, incident ID, and a link to the post-mortem or closure record. It also creates a natural audit trail of when the incident was officially closed.",
      },
    ],

    defaultCategory: "team-alerts",

    workflows: [
      {
        id: "detection-triage",
        displayName: "Detection → triage",
        description: "Notifies the on-call analyst the instant a detection crosses threshold, with enough context to start investigating from the phone.",
        steps: [
          {
            corpusId: "team-alerts:system-alert",
            displayName: "Detection fired",
            variableAliases: {
              severity: "P1",
              alert_type: "Brute-force, 40 failed logins from 203.0.113.9",
              system_name: "prod-auth-gateway",
            },
          },
          {
            corpusId: "team-alerts:on-call-page",
            displayName: "Critical detection",
            variableAliases: {
              severity: "P1",
              system_name: "prod-auth-gateway",
            },
          },
        ],
      },
      {
        id: "escalate-or-acknowledge",
        displayName: "Escalate or acknowledge",
        description: "Requires an explicit ACK from the primary responder or auto-escalates to the next person in the rotation.",
        steps: [
          {
            corpusId: "team-alerts:escalation-ping",
            displayName: "Needs ACK",
            variableAliases: {
              severity: "P1",
              system_name: "ransomware signature on fileserver-02",
              escalation_to: "secondary on-call",
            },
          },
        ],
      },
      {
        id: "incident-lifecycle",
        displayName: "SLA / incident lifecycle",
        description: "Tracks a formal incident against its service-level commitment and closes the loop when resolved.",
        steps: [
          {
            corpusId: "team-alerts:service-level-alert",
            displayName: "SLA breach",
            variableAliases: {
              system_name: "edge-waf cluster",
              incident_id: "INC-4471",
            },
          },
          {
            corpusId: "team-alerts:incident-resolved",
            displayName: "All clear",
            variableAliases: {
              system_name: "edge-waf cluster",
              incident_id: "INC-4471",
            },
          },
        ],
      },
    ],
  },
  {
    urlSlug: "edtech-saas",
    dataSlug: "edtech-school-administration-saas",
    name: "EdTech & school admin SaaS",

    metaTitle: "SMS for EdTech & school administration SaaS — RelayKit",
    metaDescription:
      "Add absence alerts, conference reminders, and enrollment waitlist texts to your school admin platform. Free to author and test; RelayKit handles registration, opt-outs, and carrier rules.",

    heroEyebrow: "EdTech & school admin SaaS",
    h1: "Text messaging for EdTech and school administration apps.",
    heroBody:
      "Absence alerts, conference reminders, enrollment waitlists — the texts that keep parents in the loop and seats from going unclaimed.",
    heroExamples: [
      "Lincoln Elementary: Maya was marked absent today. If that's wrong, let us know here: school.app/attendance/4821 Reply STOP to opt out.",
      "Lincoln Elementary: reminder — your conference with Ms. Rivera (Grade 4) is tomorrow, Thu Mar 12, 4:30pm. Cancel: school.app/conf/4821 Reply STOP to opt out.",
      "Registrar's Office: A seat opened in ECON 201. Claim it here: school.app/enroll/4821 Reply STOP to opt out.",
      "Lincoln Elementary: Card ending 4242 was declined. Update payment to keep your account active: school.app/billing Reply STOP to opt out.",
    ],

    moment: {
      body: "A student is marked absent at 9am. The parent is already at work — the email arrives at lunch. A text arrives at 9:01.",
      exampleSms: "Lincoln Elementary: Maya was marked absent today. If that's wrong, let us know here: school.app/attendance/4821 Reply STOP to opt out.",
      exampleReply: "She's home sick today",
    },

    qa: [
      {
        q: "Should absence alerts go to both parents or just the primary contact?",
        lead: "Whichever guardian the school has on file as the primary SMS contact — not both by default.",
        body: "Sending to both parents doubles the volume and can create confusion when one already responded. Default to the primary contact on the enrollment record. If your platform supports a secondary contact, make that an opt-in preference the family configures — not a default. The goal is one clear response, not two simultaneous ones.",
      },
      {
        q: "How many conference reminders is too many?",
        lead: "Two. The day-before and an hour out.",
        body: "The day-before reminder gives the parent time to reschedule if something came up. The hour-out reminder is the no-show guard. A third reminder on the morning of starts to feel like pressure. If a parent no-shows, the rebook flow handles the follow-up — that's a separate message, not a third reminder.",
      },
      {
        q: "When do I ask parents if it's okay to text them?",
        lead: "Right when they create their account or fill in their contact info.",
        body: "For a school admin app, that's usually during enrollment or parent-portal setup — when they're already entering their phone number. That's when the ask feels natural. RelayKit hosts an opt-in page for your app — your AI tool will know how to link to it from the right spot in your flow.",
      },
      {
        q: "Should enrollment waitlist texts go to the student or the parent?",
        lead: "To whoever submitted the application — for K-12 that's always the parent.",
        body: "For K-12, the guardian handles enrollment, so all waitlist communications go to them. For higher ed, the student submitted the application and holds the consent, so texts go to the student directly. If your platform serves both, use the submitting contact's number rather than building two separate flows.",
      },
    ],

    defaultCategory: "appointments",

    workflows: [
      {
        id: "conference-scheduling",
        displayName: "Parent-teacher conference scheduling",
        description: "Books, reminds, and follows up on a parent-teacher conference or advising meeting.",
        steps: [
          {
            corpusId: "appointments:confirmation",
            displayName: "Conference booked",
            variableAliases: {
              provider_name: "Ms. Rivera (Grade 4)",
              appointment_time: "Thu Mar 12, 4:30pm",
            },
          },
          {
            corpusId: "appointments:reminder-distant",
            displayName: "Conference tomorrow",
            variableAliases: {
              provider_name: "Ms. Rivera (Grade 4)",
              appointment_time: "Thu Mar 12, 4:30pm",
            },
          },
          {
            corpusId: "appointments:reminder-proximate",
            displayName: "Conference in 1 hour",
            variableAliases: {
              provider_name: "Ms. Rivera (Grade 4)",
              appointment_time: "Thu Mar 12, 4:30pm",
            },
          },
          {
            corpusId: "appointments:reschedule-confirmation",
            displayName: "Conference moved",
            variableAliases: {
              provider_name: "Ms. Rivera (Grade 4)",
            },
          },
          {
            corpusId: "appointments:cancellation-confirmation",
            displayName: "Conference cancelled",
            variableAliases: {
              provider_name: "Ms. Rivera (Grade 4)",
            },
          },
          {
            corpusId: "appointments:no-show-follow-up",
            displayName: "Missed your conference",
            variableAliases: {
              provider_name: "Ms. Rivera (Grade 4)",
            },
          },
          {
            corpusId: "appointments:post-appointment",
            displayName: "Conference feedback",
            variableAliases: {
              provider_name: "Ms. Rivera (Grade 4)",
            },
          },
        ],
      },
      {
        id: "absence-alert",
        displayName: "Attendance / absence alert",
        description: "Notifies a parent the moment a student is marked absent or tardy.",
        steps: [
          {
            corpusId: null,
            displayName: "Absence alert",
            customVariants: {
              standard:
                "{{workspace_name}}: {{student_name}} was marked absent today. Confirm or report an error here: {{account_link}} Reply STOP to opt out.",
              friendly:
                "{{workspace_name}}: we marked {{student_name}} absent today. If that's wrong, let us know here: {{account_link}} Reply STOP to opt out.",
              brief:
                "{{workspace_name}}: {{student_name}} marked absent today. {{account_link}} STOP to opt out.",
            },
            variableAliases: {
              student_name: "Maya",
              workspace_name: "Lincoln Elementary",
            },
          },
        ],
      },
      {
        id: "enrollment-waitlist",
        displayName: "Course enrollment & waitlist",
        description: "Moves a student from a waitlisted course to a claimed seat.",
        steps: [
          {
            corpusId: "waitlist:joined",
            displayName: "On the waitlist",
            variableAliases: {
              workspace_name: "Registrar's Office",
            },
          },
          {
            corpusId: "waitlist:position-update",
            displayName: "Moved up",
            variableAliases: {
              workspace_name: "Registrar's Office",
            },
          },
          {
            corpusId: "waitlist:almost-up",
            displayName: "Seat opening soon",
            variableAliases: {
              workspace_name: "Registrar's Office",
            },
          },
          {
            corpusId: "waitlist:your-turn",
            displayName: "Seat available",
            variableAliases: {
              workspace_name: "Registrar's Office",
            },
          },
          {
            corpusId: "waitlist:grace-expiring",
            displayName: "Claim your seat",
            variableAliases: {
              workspace_name: "Registrar's Office",
            },
          },
          {
            corpusId: "waitlist:missed",
            displayName: "Seat released",
            variableAliases: {
              workspace_name: "Registrar's Office",
            },
          },
        ],
      },
      {
        id: "tuition-billing",
        displayName: "Lunch-account & tuition billing",
        description: "Keeps tuition collected and the family account active.",
        steps: [
          {
            corpusId: "account-events:payment-failed",
            displayName: "Payment declined",
            variableAliases: {
              workspace_name: "Lincoln Elementary",
            },
          },
          {
            corpusId: "account-events:subscription-confirmed",
            displayName: "Payment confirmed",
            variableAliases: {
              workspace_name: "Lincoln Elementary",
            },
          },
          {
            corpusId: "account-events:account-suspended",
            displayName: "Registration hold",
            variableAliases: {
              workspace_name: "Lincoln Elementary",
            },
          },
        ],
      },
      {
        id: "staff-scheduling",
        displayName: "Staff scheduling",
        description: "Assigns and reminds staff of shifts, duty rosters, and substitutions.",
        steps: [
          {
            corpusId: "team-alerts:shift-scheduled",
            displayName: "Shift assigned",
            variableAliases: {
              role: "Lunch duty",
              location: "Cafeteria",
            },
          },
          {
            corpusId: "team-alerts:shift-reminder",
            displayName: "Shift reminder",
            variableAliases: {
              location: "Cafeteria",
            },
          },
          {
            corpusId: "team-alerts:shift-change",
            displayName: "Shift changed",
            variableAliases: {
              location: "Cafeteria",
            },
          },
          {
            corpusId: "team-alerts:shift-cancellation",
            displayName: "Shift cancelled",
            variableAliases: {
              location: "Cafeteria",
            },
          },
          {
            corpusId: "team-alerts:shift-start",
            displayName: "Shift starting",
            variableAliases: {
              location: "Cafeteria",
            },
          },
        ],
      },
      {
        id: "portal-account-access",
        displayName: "Portal account access",
        description: "Proves phone ownership and protects parent and student portal accounts.",
        steps: [
          {
            corpusId: "verification:verification-code",
            displayName: "Verification code",
            variableAliases: {
              business_name: "ParentPortal",
            },
          },
          {
            corpusId: "verification:login-code",
            displayName: "Sign-in code",
            variableAliases: {
              business_name: "ParentPortal",
            },
          },
          {
            corpusId: "verification:recovery-code",
            displayName: "Recovery code",
            variableAliases: {
              business_name: "ParentPortal",
            },
          },
        ],
      },
    ],
  },
  {
    urlSlug: "esignature-saas",
    dataSlug: "esignature-document-workflow-saas",
    name: "E-signature SaaS",

    metaTitle: "SMS for e-signature & document workflow SaaS — RelayKit",
    metaDescription:
      "Add signature requests, signing reminders, and completion notices to your e-signature platform. Free to author and test; RelayKit handles registration, opt-outs, and carrier rules.",

    heroEyebrow: "E-signature SaaS",
    h1: "Text messaging for e-signature apps.",
    heroBody:
      "Signature requests, signing reminders, completion notices — the texts that get documents signed before the moment passes.",
    heroExamples: [
      "Acme Legal: A document is ready for your signature. Review and sign: acme.app/sign/4821 Reply STOP to opt out.",
      "Acme Legal: A document is still waiting for your signature. Sign here: acme.app/sign/4821 Reply STOP to opt out.",
      "Acme Legal: Your document is fully signed. View the final copy here: acme.app/docs/4821 Reply STOP to opt out.",
      "Acme Legal: Your signing code is 847291, good for 10 minutes.",
    ],

    moment: {
      body: "A contract goes out Friday afternoon with a link in the email — unopened all weekend. A text Monday morning gets it signed.",
      exampleSms: "Acme Legal: A document is ready for your signature. Review and sign: acme.app/sign/4821 Reply STOP to opt out.",
      exampleReply: "Just signed it",
    },

    qa: [
      {
        q: "Should the signing reminder go out the same day or wait a day or two?",
        lead: "Wait a day or two.",
        body: "Same-day feels like pressure, not service. Most signers who are going to act quickly do it within hours of the first text. The reminder is for people who genuinely forgot or got busy — giving it a day lets that group self-select before you follow up. One reminder is the norm; a second rarely recovers anyone and starts to feel like harassment.",
      },
      {
        q: "Does the signer need a code to open the document, or is the link enough?",
        lead: "A link is fine for most; add a code for anything with legal or financial stakes.",
        body: "For routine documents — NDAs, onboarding agreements, consent forms — a direct signing link is standard and expected. For anything that transfers rights, money, or liability, an SMS access code before the document opens adds a layer of identity assurance that holds up if the signature is ever challenged. Your platform probably already supports both modes; pick the one that fits the document's risk level.",
      },
      {
        q: "When do I ask signers if it's okay to text them?",
        lead: "When their phone number is collected.",
        body: "That's usually when the sender enters their details before routing the document — when the ask is natural and the signer understands why they might hear from you. RelayKit hosts an opt-in page for your app — your AI tool will know how to link to it from the right spot in your flow.",
      },
      {
        q: "Do I need to text the sender when their document is fully signed?",
        lead: "Yes — they're waiting on it.",
        body: "Email is where good news goes to be missed. A sender-side completion notice — short, factual, with a link to the executed copy — closes the loop immediately. It's a different recipient and a different flow from the signer-facing messages, but it's often the most valued text in the sequence.",
      },
    ],

    defaultCategory: "documents",

    workflows: [
      {
        id: "signature-request-completion",
        displayName: "Signature request and completion",
        description: "Moves a document from sent to signed, with one reminder for non-responders.",
        steps: [
          {
            corpusId: "documents:signature-requested",
            displayName: "Ready to sign",
            variableAliases: {
              workspace_name: "Acme Legal",
              account_link: "acme.app/sign/4821",
            },
          },
          {
            corpusId: "documents:signature-reminder",
            displayName: "Still needs your signature",
            variableAliases: {
              workspace_name: "Acme Legal",
              account_link: "acme.app/sign/4821",
            },
          },
          {
            corpusId: "documents:signature-received",
            displayName: "All signed",
            variableAliases: {
              workspace_name: "Acme Legal",
            },
          },
        ],
      },
      {
        id: "signer-authentication",
        displayName: "Signer authentication (SMS OTP)",
        description: "Proves the signer's phone ownership before a legally-binding signature is applied.",
        steps: [
          {
            corpusId: "verification:confirmation-code",
            displayName: "Access code to sign",
            variableAliases: {
              business_name: "Acme Legal",
            },
          },
        ],
      },
      {
        id: "document-expiration",
        displayName: "Document expiration",
        description: "Warns the signer before an unsigned request lapses.",
        steps: [
          {
            corpusId: "account-events:deadline-reminder",
            displayName: "Document expiring",
            variableAliases: {
              deadline_item: "NDA — Globex Corp",
              due_date: "Fri Jun 27",
              account_link: "acme.app/sign/4821",
            },
          },
        ],
      },
      {
        id: "sender-signing-notifications",
        displayName: "Sender-side signing notifications",
        description: "Tells the document owner as each party signs and when execution completes.",
        steps: [
          {
            corpusId: "team-alerts:system-alert",
            displayName: "Signer completed",
            variableAliases: {
              severity: "Update",
              alert_type: "Jordan just signed",
              system_name: "NDA — Globex Corp",
            },
          },
          {
            corpusId: "documents:signature-received",
            displayName: "All parties signed",
            variableAliases: {
              workspace_name: "Acme Legal",
            },
          },
        ],
      },
    ],
  },
  {
    urlSlug: "logistics-fleet-saas",
    dataSlug: "logistics-supply-chain-fleet-management-saas",
    name: "Logistics & fleet SaaS",

    metaTitle: "SMS for logistics & fleet management SaaS — RelayKit",
    metaDescription:
      "Add delivery status updates, driver dispatch alerts, and fleet maintenance texts to your logistics platform. Free to author and test; RelayKit handles registration, opt-outs, and carrier rules.",

    heroEyebrow: "Logistics & fleet SaaS",
    h1: "Text messaging for logistics and fleet management apps.",
    heroBody:
      "Delivery status updates, driver dispatch, fleet alerts — the texts that keep shipments moving and deliveries landing on the first attempt.",
    heroExamples: [
      "Acme Logistics: Delivery #4471 is arriving soon, about 20 min away. Track it: acme.app/track/4471 Reply STOP to opt out.",
      "Acme Logistics: Delivery #4471 was delivered. Issue? acme.app/orders/4471 Reply STOP to opt out.",
      "Acme Dispatch: New load #4471, pickup 6am at Dock 3. Reply ACK to accept. Reply STOP to opt out.",
      "Acme Fleet Maintenance: Service due on Truck 12. Details: acme.app/fleet/4471 Reply STOP to opt out.",
    ],

    moment: {
      body: "A delivery is 20 minutes out. The recipient misses app notifications. A text gets them to the door in time.",
      exampleSms: "Acme Logistics: Delivery #4471 is arriving soon, about 20 min away. Track it: acme.app/track/4471 Reply STOP to opt out.",
      exampleReply: "On my way down",
    },

    qa: [
      {
        q: "What triggers the \"arriving soon\" text — how does the app know when to send it?",
        lead: "Your platform fires it when the driver crosses a distance or stop-count threshold.",
        body: "Most logistics platforms expose either a geofence event (driver enters a radius around the destination) or a stops-remaining count (two stops away). Either gives you a reliable 15\u201330 minute heads-up window. Pick whichever your platform surfaces and wire the text to that event — your AI tool will know how to connect it.",
      },
      {
        q: "Should failed-delivery texts go to the recipient or to the dispatcher?",
        lead: "To the recipient — they're the one who needs to reschedule.",
        body: "When a delivery attempt fails, the recipient gets the text with a reschedule link. The dispatcher already knows from the driver's app. Keeping the two flows separate means the recipient gets actionable information and the dispatcher isn't bottlenecked on relaying it.",
      },
      {
        q: "When do I ask recipients if it's okay to text them?",
        lead: "When they provide their phone number at checkout or booking.",
        body: "That's the natural moment — they're already entering their contact details and a delivery text makes obvious sense to them. RelayKit hosts an opt-in page for your app — your AI tool will know how to link to it from the right spot in your flow.",
      },
      {
        q: "How many delivery status texts is too many?",
        lead: "Four is the natural ceiling for most deliveries.",
        body: "Confirmed, shipped, out for delivery, and delivered covers the lifecycle without noise. The arriving-soon text is worth adding for time-sensitive or attended deliveries — that makes five. Beyond that, recipients start ignoring the thread. Failed delivery and reschedule are a separate branch, not additional steps in the main flow.",
      },
    ],

    defaultCategory: "order-updates",

    workflows: [
      {
        id: "last-mile-delivery-status",
        displayName: "Last-mile delivery status",
        description: "Keeps the recipient informed from dispatch through delivery so they're present at arrival.",
        steps: [
          {
            corpusId: "order-updates:order-confirmed",
            displayName: "Delivery scheduled",
            variableAliases: {
              order_number: "Delivery #4471",
              estimated_delivery: "today, 2-4pm",
            },
          },
          {
            corpusId: "order-updates:order-shipped",
            displayName: "On the way",
            variableAliases: {
              order_number: "Delivery #4471",
              estimated_delivery: "today, 2-4pm",
            },
          },
          {
            corpusId: "order-updates:out-for-delivery",
            displayName: "Out for delivery",
            variableAliases: {
              order_number: "Delivery #4471",
            },
          },
          {
            corpusId: null,
            displayName: "Arriving soon",
            customVariants: {
              standard:
                "{{workspace_name}}: Order {{order_number}} is arriving soon, about {{wait_estimate}} away. Track it: {{tracking_link}} Reply STOP to opt out.",
              friendly:
                "Your {{workspace_name}} order {{order_number}} is almost there, about {{wait_estimate}} out. Track: {{tracking_link}} Reply STOP to opt out.",
              brief:
                "{{workspace_name}}: Order {{order_number}} arriving in {{wait_estimate}}. {{tracking_link}} STOP to opt out.",
            },
            variableAliases: {
              order_number: "Delivery #4471",
              wait_estimate: "20 min",
            },
          },
          {
            corpusId: "order-updates:order-delivered",
            displayName: "Delivered",
            variableAliases: {
              order_number: "Delivery #4471",
            },
          },
        ],
      },
      {
        id: "delivery-window-scheduling",
        displayName: "Delivery-window scheduling",
        description: "Lets the recipient lock and be reminded of a delivery appointment slot.",
        steps: [
          {
            corpusId: "appointments:confirmation",
            displayName: "Delivery window confirmed",
            variableAliases: {
              provider_name: "your courier",
              appointment_time: "Tue 2-4pm window",
            },
          },
          {
            corpusId: "appointments:reminder-distant",
            displayName: "Delivery tomorrow",
            variableAliases: {
              provider_name: "your courier",
              appointment_time: "Tue 2-4pm window",
            },
          },
          {
            corpusId: "appointments:reminder-proximate",
            displayName: "Delivery in 1 hour",
            variableAliases: {
              provider_name: "your courier",
              appointment_time: "Tue 2-4pm window",
            },
          },
          {
            corpusId: null,
            displayName: "Missed you — reschedule",
            customVariants: {
              standard:
                "{{workspace_name}}: We missed you on order {{order_number}}. Reschedule delivery here: {{reschedule_link}} Reply STOP to opt out.",
              friendly:
                "We tried to deliver your {{workspace_name}} order {{order_number}} but missed you. Pick a new time: {{reschedule_link}} Reply STOP to opt out.",
              brief:
                "{{workspace_name}}: Order {{order_number}} delivery missed. Reschedule: {{reschedule_link}} STOP to opt out.",
            },
            variableAliases: {
              order_number: "Delivery #4471",
            },
          },
        ],
      },
      {
        id: "dispatch-coordination",
        displayName: "Dispatch coordination",
        description: "Assigns work and confirms route or exception changes with drivers.",
        steps: [
          {
            corpusId: null,
            displayName: "New load assigned",
            customVariants: {
              standard:
                "{{workspace_name}}: New assignment {{system_name}}, pickup {{shift_time}} at {{location}}. Reply ACK to accept. Reply STOP to opt out.",
              friendly:
                "{{workspace_name}}: You've got a new load, {{system_name}}, pickup {{shift_time}} at {{location}}. Reply ACK to take it. Reply STOP to opt out.",
              brief:
                "{{workspace_name}}: New load {{system_name}}, {{shift_time}}, {{location}}. Reply ACK. STOP to opt out.",
            },
            variableAliases: {
              system_name: "Load #4471",
              shift_time: "6am",
              location: "Dock 3",
            },
          },
          {
            corpusId: "team-alerts:shift-scheduled",
            displayName: "Route scheduled",
            variableAliases: {
              system_name: "Load #4471",
              shift_time: "Mon, 6am",
              location: "Dock 3",
            },
          },
          {
            corpusId: "team-alerts:escalation-ping",
            displayName: "Delay — reply ACK",
            variableAliases: {
              severity: "Delay",
              system_name: "Load #4471",
              escalation_to: "dispatch",
            },
          },
          {
            corpusId: "team-alerts:system-alert",
            displayName: "Route change",
            variableAliases: {
              severity: "Update",
              alert_type: "Route disruption",
              system_name: "Load #4471",
            },
          },
        ],
      },
      {
        id: "fleet-maintenance-diagnostics",
        displayName: "Fleet maintenance & diagnostics",
        description: "Surfaces service-due and fault-code events to whoever keeps the vehicles running.",
        steps: [
          {
            corpusId: null,
            displayName: "Service due",
            customVariants: {
              standard:
                "{{workspace_name}} Maintenance: Service due on {{system_name}}, {{alert_type}}. Details: {{action_link}} Reply STOP to opt out.",
              friendly:
                "{{workspace_name}} heads up: {{system_name}} is due for service, {{alert_type}}. Details: {{action_link}} Reply STOP to opt out.",
              brief:
                "{{workspace_name}}: {{system_name}} service due, {{alert_type}}. {{action_link}} STOP to opt out.",
            },
            variableAliases: {
              system_name: "Truck 12",
              alert_type: "oil change due",
            },
          },
          {
            corpusId: null,
            displayName: "Fault code",
            customVariants: {
              standard:
                "{{workspace_name}} {{severity}}: Fault code on {{system_name}}, {{alert_type}}. Details: {{action_link}} Reply STOP to opt out.",
              friendly:
                "{{workspace_name}} {{severity}}: {{system_name}} reported a fault, {{alert_type}}. Details: {{action_link}} Reply STOP to opt out.",
              brief:
                "{{workspace_name}} {{severity}}: {{system_name}} fault, {{alert_type}}. {{action_link}} STOP to opt out.",
            },
            variableAliases: {
              severity: "Alert",
              system_name: "Truck 12",
              alert_type: "check engine",
            },
          },
          {
            corpusId: "team-alerts:system-alert",
            displayName: "Inspection defect",
            variableAliases: {
              severity: "Defect",
              alert_type: "DVIR defect logged",
              system_name: "Truck 12",
            },
          },
        ],
      },
      {
        id: "driver-onboarding",
        displayName: "Driver onboarding",
        description: "Verifies a new driver's phone and gets them into the dispatch app.",
        steps: [
          {
            corpusId: "verification:verification-code",
            displayName: "Verify your phone",
            variableAliases: {
              business_name: "the dispatch app",
            },
          },
          {
            corpusId: "verification:login-code",
            displayName: "Login code",
            variableAliases: {
              business_name: "the dispatch app",
            },
          },
        ],
      },
    ],
  },
];

const BY_SLUG = new Map(SUB_VERTICAL_LANDINGS.map((e) => [e.urlSlug, e]));

export function findSubVerticalLanding(urlSlug: string): SubVerticalLanding | null {
  return BY_SLUG.get(urlSlug) ?? null;
}

export function subVerticalSlugs(): string[] {
  return SUB_VERTICAL_LANDINGS.map((e) => e.urlSlug);
}
