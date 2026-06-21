import type { Category, Variable } from "./types";
import { SHARED_VARIABLES } from "./shared-variables";

/**
 * Customer support variable catalog: `workspace_name` and `customer_name` from
 * the shared set, plus five category-specific tokens. Per D-398,
 * `workspace_name` is the sender frame in every body — multi-workspace
 * customers (e.g. agency contractors active in several client workspaces) need
 * disambiguation about which workspace a ticket belongs to.
 *
 * The category is hybrid in shape (research §1): a five-step ticket lifecycle
 * (ticket-received → agent-assigned → agent-response → resolution-notification
 * → csat-follow-up) plus three discrete support messages that don't sit in the
 * lifecycle (proactive-outreach, service-status-alert,
 * account-issue-notification). The lifecycle messages carry their position in
 * `groupNote` (documentation-only this wave per D-408; reserved for the future
 * workspace UX).
 *
 * No token is typeConstrained — every value is plain GSM-7 text and counts
 * against the D-402 single-segment budget. `ticket_link` and `csat_link` point
 * at the developer's own ticket / feedback surfaces on their own domain;
 * RelayKit does not shorten or host them. `agent_name` is used only where
 * attribution is honest — templates never fabricate a human name (research §5).
 */
const CUSTOMER_SUPPORT_VARIABLES: Variable[] = [
  SHARED_VARIABLES.workspace_name,
  SHARED_VARIABLES.customer_name,
  {
    name: "ticket_number",
    description:
      "Support ticket reference from the developer's ticketing system. Defaults to 'ticket' vocabulary; the developer's system may label it case or conversation.",
    budgetChars: 6,
    source: "SDK call payload",
    example: "T-4821",
  },
  {
    name: "agent_name",
    description:
      "Name of the support agent handling the ticket. Used only where attribution is honest — never a fabricated human name; automated responders are attributed honestly or omitted (research §5).",
    budgetChars: 12,
    source: "SDK call payload",
    example: "Jordan",
  },
  {
    name: "ticket_link",
    description:
      "Link to the ticket or conversation view on the developer's own domain. RelayKit does not shorten or host this URL.",
    budgetChars: 24,
    source: "SDK call payload",
    example: "yourapp.com/t/4821",
  },
  {
    name: "csat_link",
    description:
      "Link to the satisfaction-rating form on the developer's own domain. RelayKit does not shorten or host this URL.",
    budgetChars: 24,
    source: "SDK call payload",
    example: "yourapp.com/csat/4821",
  },
  {
    name: "eta",
    description:
      "Short estimated time to resolution for a service issue ('30 min', 'by 5pm'). Longer formats would not fit the budget.",
    budgetChars: 12,
    source: "SDK call payload",
    example: "30 min",
  },
];

export const CUSTOMER_SUPPORT: Category = {
  id: "customer-support",
  name: "Customer support",
  description: "Ticket updates, resolution notices, satisfaction follow-ups.",
  tcrMapping: "CUSTOMER_CARE",
  variables: CUSTOMER_SUPPORT_VARIABLES,
  compliance: {
    rules: [
      "Includes {{workspace_name}} as the sender frame in every body (D-398). Multi-workspace customers — e.g. agency contractors active in several client workspaces — need disambiguation about which workspace a ticket belongs to.",
      "TCR CUSTOMER_CARE mapping — Standard Class, auto-approved at TCR; lower scrutiny than Marketing.",
      "Honors STOP/HELP — standard transactional opt-out applies to every body. This is not the Verification 2FA carve-out; Customer support recipients retain full opt-out rights.",
      "No credentials in the body (D-393, corpus-wide). Messages link to authenticated ticket views; no keys or tokens inline.",
      "No promotional content — support-shaped operational messages only (D-399, corpus-wide). A resolution notice never pivots to an upsell.",
      "Messages stay reply-friendly — Customer Care is the natural home for inbound MO (a customer reply extends the ticket). Inbound infrastructure is Phase 4 scope; bodies should anticipate it.",
    ],
  },
  messages: [
    {
      id: "ticket-received",
      name: "Ticket received",
      tooltip: "Sent when a support request is logged.",
      description:
        "Confirms receipt of a support request and sets a response-time expectation.",
      groupNote:
        "Ticket lifecycle - step 1 of 5: sent immediately after a support request is logged in the developer's system.",
      variables: ["workspace_name", "ticket_number"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}} support: ticket {{ticket_number}} received. We'll reply soon. Reply STOP to opt out.",
          charCount: 104,
        },
        {
          tone: "Friendly",
          body: "Got your message - {{workspace_name}} support is on it. Ticket {{ticket_number}}. We'll be in touch soon. Reply STOP to opt out.",
          charCount: 129,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: ticket {{ticket_number}} received. Reply soon. STOP to opt out.",
          charCount: 84,
        },
      ],
    },
    {
      id: "agent-assigned",
      name: "Agent assigned",
      tooltip: "Sent when a ticket is routed to a specific agent.",
      description:
        "Notifies the customer that their ticket was routed to a specific support agent. Named-routing systems only; skipped by anonymous-support and AI-bot-handled flows.",
      groupNote:
        "Ticket lifecycle - step 2 of 5: sent when a support request is routed to a specific agent (named-routing systems only).",
      variables: ["workspace_name", "agent_name", "ticket_number"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}} support: {{agent_name}} is handling ticket {{ticket_number}}. Reply STOP to opt out.",
          charCount: 102,
        },
        {
          tone: "Friendly",
          body: "Good news - {{agent_name}} has picked up your ticket {{ticket_number}} at {{workspace_name}}. Reply STOP to opt out.",
          charCount: 115,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: {{agent_name}} has ticket {{ticket_number}}. STOP to opt out.",
          charCount: 80,
        },
      ],
    },
    {
      id: "agent-response",
      name: "Agent response",
      tooltip: "Sent when an agent replies to the ticket.",
      description:
        "Notifies the customer that the ticket has a reply, with a link to the conversation. The most-opened message in the support sequence.",
      groupNote:
        "Ticket lifecycle - step 3 of 5: sent when a support agent (human or AI) replies to the ticket.",
      variables: ["workspace_name", "ticket_number", "ticket_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}} support: ticket {{ticket_number}} has a reply. View: {{ticket_link}} Reply STOP to opt out.",
          charCount: 120,
        },
        {
          tone: "Friendly",
          body: "Your ticket {{ticket_number}} got a reply from {{workspace_name}} support. Read it here: {{ticket_link}} Reply STOP to opt out.",
          charCount: 137,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: reply on {{ticket_number}}. {{ticket_link}} STOP to opt out.",
          charCount: 90,
        },
      ],
    },
    {
      id: "resolution-notification",
      name: "Resolution notification",
      tooltip: "Sent when a ticket is marked resolved or closed.",
      description:
        "Confirms a ticket is resolved and offers a path to reopen it.",
      groupNote:
        "Ticket lifecycle - step 4 of 5: sent when a ticket is marked resolved or closed in the developer's system.",
      variables: ["workspace_name", "ticket_number", "ticket_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}} support: ticket {{ticket_number}} is resolved. Still need help? {{ticket_link}} Reply STOP to opt out.",
          charCount: 131,
        },
        {
          tone: "Friendly",
          body: "Ticket {{ticket_number}} is resolved. Still off? Reopen here: {{ticket_link}} Thanks for your patience - {{workspace_name}}. Reply STOP to opt out.",
          charCount: 157,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: {{ticket_number}} resolved. Reopen: {{ticket_link}} STOP to opt out.",
          charCount: 98,
        },
      ],
    },
    {
      id: "csat-follow-up",
      name: "CSAT follow-up",
      tooltip: "Sent after ticket resolution to collect a rating.",
      description:
        "Asks for a satisfaction rating after a ticket is resolved, with a link to the feedback form.",
      groupNote:
        "Ticket lifecycle - step 5 of 5: sent T+1h to T+24h after ticket resolution; T+1h is the common indie-SaaS default.",
      variables: ["workspace_name", "ticket_number", "csat_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}} support: how did we do on ticket {{ticket_number}}? Rate here: {{csat_link}} Reply STOP to opt out.",
          charCount: 130,
        },
        {
          tone: "Friendly",
          body: "How did {{workspace_name}} support do on ticket {{ticket_number}}? Rate us here: {{csat_link}} Reply STOP to opt out.",
          charCount: 129,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: rate ticket {{ticket_number}}? {{csat_link}} STOP to opt out.",
          charCount: 93,
        },
      ],
    },
    {
      id: "proactive-outreach",
      name: "Proactive outreach",
      tooltip: "Sent when the developer's system detects user friction.",
      description:
        "A support touch triggered when the developer's system detects user friction — failed actions, abandoned flows, stuck states. Support-shaped concern, not promotional re-engagement (D-399).",
      groupNote:
        "Discrete support message - not part of the ticket lifecycle; triggered by friction detection.",
      variables: ["workspace_name", "customer_name"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}} support: looks like you hit a snag. Want a hand? Reply here and we'll help. Reply STOP to opt out.",
          charCount: 129,
        },
        {
          tone: "Friendly",
          body: "Hi {{customer_name}}, we noticed you got stuck. {{workspace_name}} support is happy to help - just reply. Reply STOP to opt out.",
          charCount: 153,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: stuck on something? Reply and we'll help. STOP to opt out.",
          charCount: 90,
        },
      ],
    },
    {
      id: "service-status-alert",
      name: "Service status alert",
      tooltip: "Sent to affected users during a service issue.",
      description:
        "Outage, incident, or degraded-service notice sent to affected users, with an ETA when available. Lives in Customer support, not Account events (D-396).",
      groupNote:
        "Discrete support message - not part of the ticket lifecycle; sent to affected users during a service issue.",
      variables: ["workspace_name", "eta"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: we're aware of a service issue and working on it. ETA {{eta}}. Updates to follow. Reply STOP to opt out.",
          charCount: 141,
        },
        {
          tone: "Friendly",
          body: "Heads up - {{workspace_name}} has a service issue, and we're on it. ETA {{eta}}. We'll tell you when it clears. Reply STOP to opt out.",
          charCount: 151,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: service issue, working on it. ETA {{eta}}. STOP to opt out.",
          charCount: 96,
        },
      ],
    },
    {
      id: "account-issue-notification",
      name: "Account issue resolved",
      tooltip: "Sent when an account issue is found and resolved.",
      description:
        "Notifies the customer that an issue on their account was found and fixed, with no action required. Distinct from ticket-driven resolution — no ticket existed. Refund-issued messages live in Account events (D-391), not here.",
      groupNote:
        "Discrete support message - not part of the ticket lifecycle; a resolved-by-us account notice with no required user action.",
      variables: ["workspace_name"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: we found and fixed an issue on your account. No action needed. Questions? Reply here. Reply STOP to opt out.",
          charCount: 140,
        },
        {
          tone: "Friendly",
          body: "{{workspace_name}}: we found an issue on your account and fixed it. Nothing for you to do. Questions? Reply here. Reply STOP to opt out.",
          charCount: 148,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: account issue fixed. No action needed. STOP to opt out.",
          charCount: 87,
        },
      ],
    },
    {
      id: "request-received",
      name: "Request received",
      tooltip:
        "Sent to acknowledge an inbound inquiry, lead, or application before a ticket number is assigned.",
      description:
        "An inbound-acknowledgment for lead-gen and intake flows — 'we got your request, we'll be in touch.' Fires before a ticket number exists, unlike ticket-received.",
      variables: ["workspace_name"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: We got your request and will reach out shortly. Reply STOP to opt out.",
          charCount: 102,
        },
        {
          tone: "Friendly",
          body: "Thanks for reaching out to {{workspace_name}} - we got it and will be in touch soon. Reply STOP to opt out.",
          charCount: 119,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: request received, we'll be in touch. STOP to opt out.",
          charCount: 85,
        },
      ],
    },
  ],
};
