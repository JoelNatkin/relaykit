import type { Category, Variable } from "./types";
import { SHARED_VARIABLES } from "./shared-variables";

/**
 * Team alerts variable catalog: `workspace_name` from the shared set (the
 * D-398 default sender frame for this category — Team alerts recipients are
 * often not on the developer's own team, so workspace disambiguation is
 * load-bearing), plus nine category-specific tokens covering the two shapes
 * in this category — a shift lifecycle and discrete alert events.
 *
 * `severity` carries no default value. P0/P1, SEV1, Critical/High, and
 * Red/Yellow are all valid schemes; the developer passes whatever their team
 * already uses (Session 93 research-file §6 resolution). budgetChars:8 fits
 * any of those forms.
 *
 * `shift_date` budgets for short SMS form ("Sat 3/15"); a full ISO date does
 * not fit. `shift_time` budgets for a hyphen-separated short range
 * ("9am-2pm"). `location` is a short site label ("Store 42", "Downtown HQ"),
 * not a full street address.
 *
 * `incident_id` and `action_link` are typeConstrained — the SDK passes them
 * through and the type contract enforces shape, so they're exempt from the
 * D-402 GSM-7 character rule. `action_link` is the developer's own
 * incident-detail / check-in URL on their own domain; RelayKit does not
 * shorten or host it (same shape as `account_link` in Account events,
 * `return_link` in Order updates).
 *
 * Each shift-lifecycle message carries its lifecycle position in `groupNote`
 * (documentation-only this wave per D-408; reserved for the future workspace
 * UX). Lifecycle ordering is the message array order: shift-scheduled →
 * shift-reminder → shift-change → shift-cancellation → shift-start. The four
 * alert-event messages (system-alert, escalation-ping, on-call-page,
 * service-level-alert) are discrete triggers and don't sit in a lifecycle.
 */
const TEAM_ALERTS_VARIABLES: Variable[] = [
  SHARED_VARIABLES.workspace_name,
  {
    name: "shift_date",
    description:
      "Date of the shift in short SMS form (day-name + month/day, e.g. 'Sat 3/15'). A full ISO date does not fit the budget.",
    budgetChars: 8,
    source: "SDK call payload",
    example: "Sat 3/15",
  },
  {
    name: "shift_time",
    description:
      "Shift time range, hyphen-separated short form ('9am-2pm'). Longer time formats would not fit the budget.",
    budgetChars: 13,
    source: "SDK call payload",
    example: "9am-2pm",
  },
  {
    name: "location",
    description:
      "Short site label — the recognizable name of the place ('Store 42', 'Downtown HQ'), not a full street address.",
    budgetChars: 16,
    source: "SDK call payload",
    example: "Downtown HQ",
  },
  {
    name: "role",
    description:
      "The team member's role for this shift ('Server', 'Shift lead', 'Line cook').",
    budgetChars: 14,
    source: "SDK call payload",
    example: "Shift lead",
  },
  {
    name: "severity",
    description:
      "Severity tag the developer chooses — P0/P1, SEV1, Critical/High, and Red/Yellow are all valid. No default; the developer passes whatever scheme their team uses (Session 93 §6 resolution).",
    budgetChars: 8,
    source: "SDK call payload",
    example: "SEV1",
  },
  {
    name: "alert_type",
    description:
      "Short description of the alert condition ('CPU 95%', 'Disk full', 'Queue backed up').",
    budgetChars: 24,
    source: "SDK call payload",
    example: "Queue backed up",
  },
  {
    name: "system_name",
    description:
      "Name of the system, service, or component the alert is about ('api-gateway', 'orders-db', 'checkout-svc').",
    budgetChars: 16,
    source: "SDK call payload",
    example: "api-gateway",
  },
  {
    name: "incident_id",
    description:
      "Incident identifier from the developer's incident-tracking system. typeConstrained because it's a stable ID, not free text — the SDK passes it through.",
    budgetChars: 10,
    source: "SDK call payload",
    example: "INC-9042",
    typeConstrained: true,
  },
  {
    name: "action_link",
    description:
      "Link to the action surface — incident-detail page, check-in URL, or runbook on the developer's own domain. RelayKit does not shorten or host this URL. typeConstrained because it's an SDK-passed URL.",
    budgetChars: 24,
    source: "SDK call payload",
    example: "yourapp.com/inc/9042",
    typeConstrained: true,
  },
  {
    name: "escalation_to",
    description:
      "Name or rotation identifier for the next person on call ('Alice', 'on-call-secondary').",
    budgetChars: 14,
    source: "SDK call payload",
    example: "Alice",
  },
  {
    name: "item_name",
    description:
      "Title of the assigned task, lead, deal, or work item ('Task #248', 'Acme renewal').",
    budgetChars: 40,
    source: "SDK call payload",
    example: "Task #248",
  },
  {
    name: "due_time",
    description:
      "Short deadline for a task or deliverable ('tomorrow 5pm', 'Fri EOD'). Longer formats would not fit the budget.",
    budgetChars: 19,
    source: "SDK call payload",
    example: "tomorrow 5pm",
  },
];

export const TEAM_ALERTS: Category = {
  id: "team-alerts",
  name: "Team alerts",
  description:
    "Incident pings, on-call rotation, deploy notifications, threshold breaches.",
  tcrMapping: "ACCOUNT_NOTIFICATION",
  variables: TEAM_ALERTS_VARIABLES,
  compliance: {
    rules: [
      "Includes {{workspace_name}} as the sender frame in every body (D-398). Team alerts recipients are often not on the developer's own team, so workspace disambiguation is load-bearing.",
      "No promotional content — operational triggers only (D-399, corpus-wide).",
      "No credentials in the body (D-393, corpus-wide). Alerts link to authenticated detail views; no keys or tokens inline.",
      "Single GSM-7 segment after worst-case-realistic variable substitution (D-402). ASCII-only bodies; worst-case stays under 160.",
      "Honors STOP/HELP — standard transactional opt-out applies. Employees retain opt-out rights; this is not a Verification-style 2FA carve-out.",
      "Consent at hire — RelayKit encourages wiring consent capture into the customer's hiring flow; employment does not imply consent (TCPA).",
    ],
  },
  messages: [
    {
      id: "shift-scheduled",
      name: "Shift scheduled",
      tooltip: "Sent when a shift is assigned.",
      description:
        "Confirms a newly assigned shift with date, time, location, and role.",
      groupNote:
        "Shift lifecycle - step 1 of 5: sent when a shift is assigned.",
      variables: ["workspace_name", "shift_date", "shift_time", "location", "role"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: You're scheduled {{shift_date}} {{shift_time}} at {{location}} as {{role}}. Reply STOP to opt out.",
          charCount: 133,
        },
        {
          tone: "Friendly",
          body: "Your {{workspace_name}} schedule: {{shift_date}}, {{shift_time}} at {{location}}, {{role}}. See you then. Reply STOP to opt out.",
          charCount: 143,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: {{shift_date}} {{shift_time}}, {{location}}, {{role}}. STOP to opt out.",
          charCount: 106,
        },
      ],
    },
    {
      id: "shift-reminder",
      name: "Shift reminder",
      tooltip: "Sent ahead of shift start.",
      description:
        "Reminds a team member of an upcoming shift; send timing is trigger config.",
      groupNote:
        "Shift lifecycle - step 2 of 5: sent ahead of shift start; send timing is trigger config.",
      variables: ["workspace_name", "shift_date", "shift_time", "location"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: Reminder, you're on {{shift_date}} {{shift_time}} at {{location}}. Reply STOP to opt out.",
          charCount: 118,
        },
        {
          tone: "Friendly",
          body: "Your {{workspace_name}} shift is coming up: {{shift_date}}, {{shift_time}} at {{location}}. Reply STOP to opt out.",
          charCount: 123,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: Shift {{shift_date}} {{shift_time}}, {{location}}. STOP to opt out.",
          charCount: 96,
        },
      ],
    },
    {
      id: "shift-change",
      name: "Shift change",
      tooltip: "Sent when a shift is changed, swapped, or moved.",
      description:
        "Notifies a team member that a shift was changed, swapped, or moved.",
      groupNote:
        "Shift lifecycle - step 3 of 5: sent when a shift is changed, swapped, or moved.",
      variables: ["workspace_name", "shift_date", "shift_time", "location"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: Your shift changed. New: {{shift_date}} {{shift_time}} at {{location}}. Reply STOP to opt out.",
          charCount: 123,
        },
        {
          tone: "Friendly",
          body: "Heads up, your {{workspace_name}} shift moved to {{shift_date}}, {{shift_time}} at {{location}}. Reply STOP to opt out.",
          charCount: 128,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: Shift now {{shift_date}} {{shift_time}}, {{location}}. STOP to opt out.",
          charCount: 100,
        },
      ],
    },
    {
      id: "shift-cancellation",
      name: "Shift cancellation",
      tooltip: "Sent when a shift is cancelled.",
      description:
        "Notifies a team member that a shift was cancelled.",
      groupNote:
        "Shift lifecycle - step 4 of 5: sent when a shift is cancelled.",
      variables: ["workspace_name", "shift_date", "shift_time", "location"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: Your {{shift_date}} {{shift_time}} shift at {{location}} is cancelled. Reply STOP to opt out.",
          charCount: 122,
        },
        {
          tone: "Friendly",
          body: "Your {{workspace_name}} shift on {{shift_date}} at {{location}} has been cancelled. Reply STOP to opt out.",
          charCount: 116,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: {{shift_date}} {{shift_time}} shift cancelled. STOP to opt out.",
          charCount: 88,
        },
      ],
    },
    {
      id: "shift-start",
      name: "Shift start",
      tooltip: "Sent at shift start; check-in action optional.",
      description:
        "Marks shift start with an optional check-in action.",
      groupNote:
        "Shift lifecycle - step 5 of 5: sent at shift start; check-in action optional.",
      variables: ["workspace_name", "location", "action_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: Your shift at {{location}} starts now. Check in: {{action_link}} Reply STOP to opt out.",
          charCount: 132,
        },
        {
          tone: "Friendly",
          body: "Your {{workspace_name}} shift at {{location}} is starting. Check in here: {{action_link}} Reply STOP to opt out.",
          charCount: 137,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: Shift started. Check in: {{action_link}} STOP to opt out.",
          charCount: 98,
        },
      ],
    },
    {
      id: "system-alert",
      name: "System alert",
      tooltip: "Severity-cued threshold or anomaly notification.",
      description:
        "Severity-cued notification of a threshold breach, error spike, or anomaly.",
      groupNote:
        "Alert event - discrete trigger, not part of the shift sequence.",
      variables: ["workspace_name", "severity", "alert_type", "system_name", "action_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}} {{severity}}: {{alert_type}} on {{system_name}}. Details: {{action_link}} Reply STOP to opt out.",
          charCount: 143,
        },
        {
          tone: "Friendly",
          body: "{{workspace_name}} heads up, {{severity}}: {{alert_type}} on {{system_name}}. {{action_link}} Reply STOP to opt out.",
          charCount: 144,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}} {{severity}}: {{alert_type}}, {{system_name}}. {{action_link}} STOP to opt out.",
          charCount: 126,
        },
      ],
    },
    {
      id: "escalation-ping",
      name: "Escalation ping",
      tooltip: "Acknowledgment-required alert; escalates server-side if no ACK.",
      description:
        "Acknowledgment-required alert; escalates server-side if unacknowledged.",
      groupNote:
        "Alert event - discrete trigger; escalation logic is server-side, ACK reply handling is Phase 4.",
      variables: ["workspace_name", "severity", "system_name", "escalation_to", "action_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}} {{severity}}: {{system_name}} needs attention. Reply ACK or it goes to {{escalation_to}}. Reply STOP to opt out.",
          charCount: 137,
        },
        {
          tone: "Friendly",
          body: "{{workspace_name}}: {{severity}} on {{system_name}}, can you take it? Reply ACK to claim. Reply STOP to opt out.",
          charCount: 121,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}} {{severity}}: {{system_name}}. Reply ACK. {{action_link}} STOP to opt out.",
          charCount: 111,
        },
      ],
    },
    {
      id: "on-call-page",
      name: "On-call page",
      tooltip: "Urgent on-call notification; the shortest message in the category.",
      description:
        "Urgent on-call notification; the shortest message in the category.",
      groupNote:
        "Alert event - discrete trigger; shortest message in the category.",
      variables: ["workspace_name", "severity", "system_name", "action_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}} {{severity}}: {{system_name}} down. {{action_link}} Reply STOP to opt out.",
          charCount: 111,
        },
        {
          tone: "Friendly",
          body: "{{workspace_name}} {{severity}}: {{system_name}} needs you now. {{action_link}} Reply STOP to opt out.",
          charCount: 120,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}} {{severity}}: {{system_name}}. {{action_link}} STOP to opt out.",
          charCount: 100,
        },
      ],
    },
    {
      id: "service-level-alert",
      name: "Service-level alert",
      tooltip: "Informational SLA breach or maintenance notice.",
      description:
        "Informational SLA breach, downtime, or maintenance notice to a broad audience.",
      groupNote:
        "Alert event - discrete trigger; informational, broader audience than on-call.",
      variables: ["workspace_name", "system_name", "incident_id", "action_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: {{system_name}} SLA breach, incident {{incident_id}}. {{action_link}} Reply STOP to opt out.",
          charCount: 129,
        },
        {
          tone: "Friendly",
          body: "{{workspace_name}} notice: {{system_name}} is below its service level. {{action_link}} Reply STOP to opt out.",
          charCount: 131,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: {{system_name}} SLA breach. {{action_link}} STOP to opt out.",
          charCount: 102,
        },
      ],
    },
    {
      id: "incident-resolved",
      name: "Incident resolved",
      tooltip: "Sent when an incident, outage, or service disruption is resolved.",
      description:
        "The all-clear that closes an incident — team-alerts opens incidents (system-alert, on-call-page, escalation-ping) but never closed one.",
      variables: ["workspace_name", "system_name", "incident_id", "action_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: {{system_name}} incident {{incident_id}} resolved. {{action_link}} Reply STOP to opt out.",
          charCount: 126,
        },
        {
          tone: "Friendly",
          body: "{{workspace_name}}: all clear - {{system_name}} incident {{incident_id}} is resolved. {{action_link}} Reply STOP to opt out.",
          charCount: 141,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: {{system_name}} {{incident_id}} resolved. {{action_link}} STOP to opt out.",
          charCount: 111,
        },
      ],
    },
    {
      id: "task-assigned",
      name: "Task assigned",
      tooltip: "Sent when a task, lead, deal, or work item is assigned to a team member.",
      description:
        "A person-to-person work-item assignment notification — a task, lead, deal, or item routed to a specific team member.",
      variables: ["workspace_name", "item_name", "action_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: {{item_name}} was assigned to you. View: {{action_link}} Reply STOP to opt out.",
          charCount: 147,
        },
        {
          tone: "Friendly",
          body: "{{workspace_name}}: {{item_name}} is yours now - take a look: {{action_link}} Reply STOP to opt out.",
          charCount: 148,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: {{item_name}} assigned to you. {{action_link}} STOP to opt out.",
          charCount: 131,
        },
      ],
    },
    {
      id: "task-reminder",
      name: "Task reminder",
      tooltip:
        "Sent to remind a team member of an upcoming task or deliverable deadline.",
      description:
        "An upcoming-task deadline nudge to a team member. Distinguished from account-events:deadline-reminder by audience — an internal worker's task, not an external recipient's deadline.",
      variables: ["workspace_name", "item_name", "due_time", "action_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: {{item_name}} is due {{due_time}}. View: {{action_link}} Reply STOP to opt out.",
          charCount: 154,
        },
        {
          tone: "Friendly",
          body: "{{workspace_name}}: heads up - {{item_name}} is due {{due_time}}. {{action_link}} Reply STOP to opt out.",
          charCount: 159,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: {{item_name}} due {{due_time}}. {{action_link}} STOP to opt out.",
          charCount: 139,
        },
      ],
    },
  ],
};
