import type { Category, Variable } from "./types";
import { SHARED_VARIABLES } from "./shared-variables";

/**
 * Account events variable catalog: `workspace_name` from the shared set (the
 * D-398 default sender frame for this category), plus account-context tokens
 * and `account_link`.
 *
 * `account_link` is the developer's own account/billing URL on their own
 * domain, set once in workspace settings — workspace-settings-sourced like
 * `business_name`, not a per-send free-text token. RelayKit does not shorten
 * or host it. budgetChars:19 fits a `yourapp.com/billing`-shape default; see
 * BACKLOG notes on configurator-derived examples and D-402 segment math.
 */
const ACCOUNT_EVENTS_VARIABLES: Variable[] = [
  SHARED_VARIABLES.workspace_name,
  {
    name: "account_link",
    description:
      "Link to the developer's own account/billing UI on their own domain (billing, security, account settings). Set once in workspace settings. RelayKit does not shorten or host this URL.",
    budgetChars: 19,
    source: "workspace settings",
    example: "yourapp.com/billing",
  },
  {
    name: "card_last4",
    description:
      "Last four digits of the payment card — a numeric string. Passed by the SDK from the billing event.",
    budgetChars: 4,
    source: "SDK call payload",
    example: "4242",
    typeConstrained: true,
  },
  {
    name: "days_remaining",
    description:
      "Whole days until a trial ends or a renewal charges — a numeric string.",
    budgetChars: 2,
    source: "SDK call payload",
    example: "3",
  },
  {
    name: "device_context",
    description:
      "Short human-readable device or location label for a sign-in event.",
    budgetChars: 24,
    source: "SDK call payload",
    example: "Chrome on Mac, Denver",
  },
  {
    name: "action_link",
    description:
      "Link to the in-app action surface on the developer's own domain (streak, habit, or activity). RelayKit does not shorten or host this URL.",
    budgetChars: 24,
    source: "SDK call payload",
    example: "yourapp.com/today",
  },
  {
    name: "amount_due",
    description:
      "Amount owed, formatted with currency by the developer ('$129.00'). Passed by the SDK from the billing event.",
    budgetChars: 8,
    source: "SDK call payload",
    example: "$129.00",
  },
  {
    name: "amount_paid",
    description:
      "Amount received, formatted with currency by the developer ('$240.00'). Passed by the SDK from the payment event.",
    budgetChars: 8,
    source: "SDK call payload",
    example: "$240.00",
  },
  {
    name: "due_date",
    description:
      "Short due date in SMS form ('Jun 28'). A long date string works but reads worse in SMS and shrinks the room for other tokens under D-402.",
    budgetChars: 12,
    source: "SDK call payload",
    example: "Jun 28",
  },
  {
    name: "invoice_number",
    description:
      "The developer's own invoice identifier — passed by the SDK from the billing event. RelayKit does not generate or format it.",
    budgetChars: 10,
    source: "SDK call payload",
    example: "INV-2043",
  },
  {
    name: "deadline_item",
    description:
      "Short name of the thing with a non-payment deadline ('Aid acceptance', 'Q3 filing'). The load-bearing token in the deadline reminder.",
    budgetChars: 28,
    source: "SDK call payload",
    example: "Aid acceptance",
  },
  {
    name: "item_label",
    description:
      "Short label for what changed in a status update ('application', 'case', 'return', 'project').",
    budgetChars: 20,
    source: "SDK call payload",
    example: "application",
  },
  {
    name: "amount",
    description:
      "Payout / transfer amount, formatted with currency by the developer ('$450'). Passed by the SDK from the payout event.",
    budgetChars: 10,
    source: "SDK call payload",
    example: "$450",
  },
  {
    name: "destination",
    description:
      "Short label for where a payout is going ('bank account', 'pay card'). Not an account number — no PII in the body (D-393).",
    budgetChars: 14,
    source: "SDK call payload",
    example: "bank account",
  },
  {
    name: "streak_count",
    description:
      "The gamified streak length as the developer phrases it ('12-day', '30'). Passed by the SDK from the streak event.",
    budgetChars: 10,
    source: "SDK call payload",
    example: "12-day",
  },
  {
    name: "habit_name",
    description:
      "Short name of the habit, routine, or daily action being nudged ('your morning run').",
    budgetChars: 24,
    source: "SDK call payload",
    example: "your morning run",
  },
];

export const ACCOUNT_EVENTS: Category = {
  id: "account-events",
  name: "Account events",
  description:
    "Billing, security, and lifecycle alerts — the churn-critical messages that get missed in email.",
  tcrMapping: "ACCOUNT_NOTIFICATION",
  variables: ACCOUNT_EVENTS_VARIABLES,
  compliance: {
    rules: [
      "Includes {{workspace_name}} as the sender frame in every body (D-398).",
      "No promotional content — no offers, no discount codes, no upgrade pitches (D-399, corpus-wide). The trigger speaks for itself.",
      "No credentials in the body (D-393, corpus-wide).",
      "Honors STOP/HELP — standard transactional opt-out applies (no 2FA carve-out here).",
      "Single GSM-7 segment after worst-case-realistic variable substitution (D-402). {{account_link}} budgetChars assumes a short developer-domain shape (e.g. yourapp.com/billing).",
      "Security messages link only to the developer's authenticated UI, never to inline credential entry — phishing SMS mimics this shape.",
    ],
  },
  messages: [
    {
      id: "payment-failed",
      name: "Payment failed",
      tooltip: "Sent when a customer's card is declined.",
      description:
        "Card declined, charge failed, or payment method expired — the most urgent account event. The user must act or service interrupts.",
      variables: ["workspace_name", "card_last4", "account_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: Card ending {{card_last4}} was declined. Update payment to keep your account active: {{account_link}} Reply STOP to opt out.",
          charCount: 149,
        },
        {
          tone: "Friendly",
          body: "Your {{workspace_name}} payment didn't go through (card ending {{card_last4}}). Update it here to stay active: {{account_link}} Reply STOP to opt out.",
          charCount: 155,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: Card {{card_last4}} declined. Update payment: {{account_link}} STOP to opt out.",
          charCount: 104,
        },
      ],
    },
    {
      id: "trial-ending",
      name: "Trial ending",
      tooltip: "Sent a few days before a trial ends.",
      description:
        "Trial ending, annual renewal approaching, or a free-tier limit close — action-required but less urgent than a failed payment.",
      variables: ["workspace_name", "days_remaining", "account_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: Your trial ends in {{days_remaining}} days. Choose a plan to keep your account: {{account_link}} Reply STOP to opt out.",
          charCount: 138,
        },
        {
          tone: "Friendly",
          body: "Your {{workspace_name}} trial ends in {{days_remaining}} days. Pick a plan here to keep going: {{account_link}} Reply STOP to opt out.",
          charCount: 133,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: Trial ends in {{days_remaining}} days. Choose a plan: {{account_link}} STOP to opt out.",
          charCount: 106,
        },
      ],
    },
    {
      id: "subscription-confirmed",
      name: "Subscription confirmed",
      tooltip: "Sent when a renewal, plan change, or cancellation goes through.",
      description:
        "Renewal succeeded, plan changed, subscription canceled, or refund issued — a state change confirmed. No action required.",
      variables: ["workspace_name", "account_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: Your subscription change is confirmed. View the details in your account: {{account_link}} Reply STOP to opt out.",
          charCount: 147,
        },
        {
          tone: "Friendly",
          body: "Your {{workspace_name}} subscription is all set. See the details here whenever you like: {{account_link}} Reply STOP to opt out.",
          charCount: 143,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: Subscription updated. Details: {{account_link}} STOP to opt out.",
          charCount: 99,
        },
      ],
    },
    {
      id: "new-device-signin",
      name: "New device sign-in",
      tooltip: "Sent when an account is accessed from a new device.",
      description:
        "New device sign-in, password change, or suspicious activity — time-sensitive, so the user can catch a compromise.",
      variables: ["workspace_name", "device_context", "account_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: New sign-in from {{device_context}}. Not you? Secure your account: {{account_link}} Reply STOP to opt out.",
          charCount: 147,
        },
        {
          tone: "Friendly",
          body: "Your {{workspace_name}} account was just accessed from {{device_context}}. Not you? Secure it: {{account_link}} Reply STOP to opt out.",
          charCount: 155,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: New sign-in, {{device_context}}. Not you? {{account_link}} STOP to opt out.",
          charCount: 116,
        },
      ],
    },
    {
      id: "account-suspended",
      name: "Account suspended",
      tooltip: "Sent when an account is suspended.",
      description:
        "Account suspended, restored, closed, or access revoked — low frequency, high importance when it fires.",
      variables: ["workspace_name", "account_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: Your account has been suspended. Review the details and next steps here: {{account_link}} Reply STOP to opt out.",
          charCount: 147,
        },
        {
          tone: "Friendly",
          body: "Your {{workspace_name}} account has been suspended. Here's what happened and what to do next: {{account_link}} Reply STOP to opt out.",
          charCount: 148,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: Account suspended. Details and next steps: {{account_link}} STOP to opt out.",
          charCount: 111,
        },
      ],
    },
    {
      id: "payment-due-reminder",
      name: "Payment due reminder",
      tooltip: "Sent proactively before a payment is due.",
      description:
        "A forward-looking 'amount X is due by date Y' nudge — distinct from the reactive payment-failed decline.",
      variables: ["workspace_name", "amount_due", "due_date", "account_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: {{amount_due}} is due {{due_date}}. Pay or review: {{account_link}} Reply STOP to opt out.",
          charCount: 119,
        },
        {
          tone: "Friendly",
          body: "Heads up from {{workspace_name}}: {{amount_due}} is due {{due_date}}. Pay here: {{account_link}} Reply STOP to opt out.",
          charCount: 128,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: {{amount_due}} due {{due_date}}. {{account_link}} STOP to opt out.",
          charCount: 95,
        },
      ],
    },
    {
      id: "payment-received",
      name: "Payment received",
      tooltip: "Sent when a payment or donation is successfully received.",
      description:
        "Confirms money arrived — a receipt / thank-you. Covers donation and gift receipts as the nonprofit flavor of the same message.",
      variables: ["workspace_name", "amount_paid", "account_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: Payment of {{amount_paid}} received. Thank you. Receipt: {{account_link}} Reply STOP to opt out.",
          charCount: 124,
        },
        {
          tone: "Friendly",
          body: "Thanks! {{workspace_name}} received your {{amount_paid}} payment. Receipt: {{account_link}} Reply STOP to opt out.",
          charCount: 122,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: {{amount_paid}} received. Receipt: {{account_link}} STOP to opt out.",
          charCount: 96,
        },
      ],
    },
    {
      id: "invoice-ready",
      name: "Invoice ready",
      tooltip: "Sent when a new invoice is issued and ready to view and pay.",
      description:
        "The first-issuance 'your invoice is ready, view and pay' event — distinct from the payment-due reminder.",
      variables: ["workspace_name", "invoice_number", "amount_due", "account_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: Invoice {{invoice_number}} for {{amount_due}} is ready. View and pay: {{account_link}} Reply STOP to opt out.",
          charCount: 130,
        },
        {
          tone: "Friendly",
          body: "Your {{workspace_name}} invoice {{invoice_number}} ({{amount_due}}) is ready. Pay here: {{account_link}} Reply STOP to opt out.",
          charCount: 128,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: Invoice {{invoice_number}}, {{amount_due}}. {{account_link}} STOP to opt out.",
          charCount: 98,
        },
      ],
    },
    {
      id: "payment-past-due",
      name: "Payment past due",
      tooltip: "Sent when a payment has not been received after the due date.",
      description:
        "The overdue escalation — factual only, no threats or fee-escalation language (FDCPA-adjacent). Closes the billing lifecycle.",
      variables: ["workspace_name", "amount_due", "account_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: {{amount_due}} is now past due. Pay or review your balance: {{account_link}} Reply STOP to opt out.",
          charCount: 128,
        },
        {
          tone: "Friendly",
          body: "{{workspace_name}}: your balance of {{amount_due}} is past due. You can take care of it here: {{account_link}} Reply STOP to opt out.",
          charCount: 142,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: {{amount_due}} past due. Pay: {{account_link}} STOP to opt out.",
          charCount: 92,
        },
      ],
    },
    {
      id: "deadline-reminder",
      name: "Deadline reminder",
      tooltip:
        "Sent when a non-payment action window is approaching its close.",
      description:
        "A non-payment 'action window closes on date Y' nudge — filings, registrations, enrollments, signing deadlines. Not a booked-appointment reminder.",
      variables: ["workspace_name", "deadline_item", "due_date", "account_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: {{deadline_item}} closes {{due_date}}. Take action here: {{account_link}} Reply STOP to opt out.",
          charCount: 142,
        },
        {
          tone: "Friendly",
          body: "{{workspace_name}}: heads up - {{deadline_item}} closes {{due_date}}. Don't miss it: {{account_link}} Reply STOP to opt out.",
          charCount: 150,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: {{deadline_item}} closes {{due_date}}. {{account_link}} STOP to opt out.",
          charCount: 118,
        },
      ],
    },
    {
      id: "status-update",
      name: "Status update",
      tooltip: "Sent when an application, case, return, or project status changes.",
      description:
        "A generic 'your application / case / return / project status changed — view details' message.",
      variables: ["workspace_name", "item_label", "account_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: There's an update on your {{item_label}}. View the details: {{account_link}} Reply STOP to opt out.",
          charCount: 140,
        },
        {
          tone: "Friendly",
          body: "{{workspace_name}}: your {{item_label}} just moved forward - take a look: {{account_link}} Reply STOP to opt out.",
          charCount: 134,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: {{item_label}} updated. Details: {{account_link}} STOP to opt out.",
          charCount: 107,
        },
      ],
    },
    {
      id: "new-message-waiting",
      name: "New message waiting",
      tooltip: "Sent when a new message is waiting in a secure inbox or client portal.",
      description:
        "'You have a new message — open the app/portal to read it.' For consumer inboxes and professional client portals where the body stays out of band.",
      variables: ["workspace_name", "account_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: You have a new message. Read and reply here: {{account_link}} Reply STOP to opt out.",
          charCount: 119,
        },
        {
          tone: "Friendly",
          body: "{{workspace_name}}: you've got a new message waiting. Read it here: {{account_link}} Reply STOP to opt out.",
          charCount: 122,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: New message. {{account_link}} STOP to opt out.",
          charCount: 81,
        },
      ],
    },
    {
      id: "payout-sent",
      name: "Payout sent",
      tooltip: "Sent when an earned payout, withdrawal, or transfer leaves the platform.",
      description:
        "Outbound money movement — a payout / withdrawal / transfer leaving the platform to the recipient's destination. Distinct from a refund reversal.",
      variables: ["workspace_name", "amount", "destination", "account_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: Your {{amount}} is on its way to your {{destination}}. Details: {{account_link}} Reply STOP to opt out.",
          charCount: 137,
        },
        {
          tone: "Friendly",
          body: "{{workspace_name}}: {{amount}} is on the way to your {{destination}}. Reply STOP to opt out.",
          charCount: 103,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: {{amount}} sent to your {{destination}}. STOP to opt out.",
          charCount: 88,
        },
      ],
    },
    {
      id: "payout-failed",
      name: "Payout failed",
      tooltip: "Sent when an outbound payout or transfer cannot be completed.",
      description:
        "The outbound counterpart to payment-failed — 'we couldn't send your payout, fix your details to get paid.' Not an inbound card decline.",
      variables: ["workspace_name", "account_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: We couldn't send your payout. Check your details: {{account_link}} Reply STOP to opt out.",
          charCount: 124,
        },
        {
          tone: "Friendly",
          body: "{{workspace_name}}: your payout didn't go through. Update your details here: {{account_link}} Reply STOP to opt out.",
          charCount: 131,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: Payout failed. Fix details: {{account_link}} STOP to opt out.",
          charCount: 96,
        },
      ],
    },
    {
      id: "balance-low",
      name: "Balance low",
      tooltip: "Sent when a prepaid balance, credit pack, or usage quota is running low.",
      description:
        "A 'your prepaid balance / credit pack / usage quota is running low — top up' nudge.",
      variables: ["workspace_name", "account_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: Your balance is running low. Top up to stay active: {{account_link}} Reply STOP to opt out.",
          charCount: 126,
        },
        {
          tone: "Friendly",
          body: "Heads up from {{workspace_name}} - your balance is getting low. Top up here: {{account_link}} Reply STOP to opt out.",
          charCount: 131,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: Balance low. Top up: {{account_link}} STOP to opt out.",
          charCount: 89,
        },
      ],
    },
    {
      id: "streak-ending",
      name: "Streak ending",
      tooltip: "Sent when a gamified streak is about to break.",
      description:
        "A gamified 'your N-day streak ends soon — keep it going' nudge.",
      variables: ["workspace_name", "streak_count", "action_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: your {{streak_count}} streak ends soon. Keep it going: {{action_link}} Reply STOP to opt out.",
          charCount: 128,
        },
        {
          tone: "Friendly",
          body: "{{workspace_name}}: don't lose your {{streak_count}} streak - one quick check-in keeps it alive: {{action_link}} Reply STOP to opt out.",
          charCount: 150,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: {{streak_count}} streak ends soon. {{action_link}} STOP to opt out.",
          charCount: 102,
        },
      ],
    },
    {
      id: "recurring-reminder",
      name: "Recurring reminder",
      tooltip:
        "Sent on a recurring schedule to prompt a habit, routine, or daily action.",
      description:
        "A scheduled nudge to prompt a habit, routine, or daily action ('time for your morning run').",
      variables: ["workspace_name", "habit_name", "action_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: time for {{habit_name}}. Mark it done: {{action_link}} Reply STOP to opt out.",
          charCount: 128,
        },
        {
          tone: "Friendly",
          body: "{{workspace_name}} nudge: {{habit_name}} is due today. Knock it out: {{action_link}} Reply STOP to opt out.",
          charCount: 138,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: {{habit_name}} due. {{action_link}} STOP to opt out.",
          charCount: 103,
        },
      ],
    },
  ],
};
