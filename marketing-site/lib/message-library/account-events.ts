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
  ],
};
