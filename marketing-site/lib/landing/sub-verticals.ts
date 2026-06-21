import type { CategoryQA } from "@/lib/landing/categories";

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
];

const BY_SLUG = new Map(SUB_VERTICAL_LANDINGS.map((e) => [e.urlSlug, e]));

export function findSubVerticalLanding(urlSlug: string): SubVerticalLanding | null {
  return BY_SLUG.get(urlSlug) ?? null;
}

export function subVerticalSlugs(): string[] {
  return SUB_VERTICAL_LANDINGS.map((e) => e.urlSlug);
}
