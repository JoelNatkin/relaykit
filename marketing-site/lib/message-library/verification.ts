import type { Category, Variable } from "./types";
import { SHARED_VARIABLES } from "./shared-variables";

/**
 * Verification variable catalog: `business_name` from the shared set, plus the
 * two Verification-specific tokens. `code` is type-constrained (RelayKit
 * generates it, the SDK passes it, the developer never types it) and so is
 * exempt from the D-402 GSM-7 character rule.
 */
const VERIFICATION_VARIABLES: Variable[] = [
  SHARED_VARIABLES.business_name,
  {
    name: "code",
    description:
      "The OTP itself — a 6-digit numeric string. RelayKit generates it; the SDK passes it; the developer never types it.",
    budgetChars: 6,
    source: "SDK call payload",
    example: "482910",
    typeConstrained: true,
  },
  {
    name: "expiry_minutes",
    description:
      "Code expiry in minutes — a numeric string. Default 10, configurable in workspace settings.",
    budgetChars: 2,
    source: "workspace settings",
    example: "10",
  },
];

export const VERIFICATION: Category = {
  id: "verification",
  name: "Verification",
  description:
    "Phone-ownership proof at signup, step-up confirmations, account recovery, and 2FA.",
  tcrMapping: "2FA",
  variables: VERIFICATION_VARIABLES,
  compliance: {
    rules: [
      "No STOP/HELP language in the message body (2FA TCR carve-out; research §5).",
      "No promotional content (D-399, corpus-wide).",
      "No credentials in the body (D-393, corpus-wide; codes are not credentials).",
      "Single GSM-7 segment after worst-case-realistic variable substitution (D-402).",
      "Variable {{code}} is RelayKit-generated and type-constrained.",
    ],
  },
  messages: [
    {
      id: "verification-code",
      name: "Verification code",
      tooltip: "Sent when a user verifies their phone at signup.",
      description:
        "One-time phone-ownership proof at account creation — the most-shipped SMS-verification use case in indie SaaS.",
      variables: ["business_name", "code", "expiry_minutes"],
      variants: [
        {
          tone: "Standard",
          body: "{{business_name}}: Verification code: {{code}}. Expires in {{expiry_minutes}} minutes.",
          charCount: 76,
        },
        {
          tone: "Friendly",
          body: "Your {{business_name}} code is {{code}}, good for {{expiry_minutes}} minutes.",
          charCount: 67,
        },
        {
          tone: "Brief",
          body: "{{business_name}}: {{code}}",
          charCount: 33,
        },
      ],
    },
    {
      id: "confirmation-code",
      name: "Confirmation code",
      tooltip:
        "Sent before a sensitive action — withdrawal, payment change, ownership transfer.",
      description:
        "Explicit phone-channel confirmation before a high-stakes action (withdrawal, payment-detail change, ownership transfer, account deletion).",
      variables: ["business_name", "code", "expiry_minutes"],
      variants: [
        {
          tone: "Standard",
          body: "{{business_name}}: Confirmation code: {{code}}. Expires in {{expiry_minutes}} minutes.",
          charCount: 76,
        },
        {
          tone: "Friendly",
          body: "Your {{business_name}} confirmation code is {{code}}, good for {{expiry_minutes}} minutes.",
          charCount: 80,
        },
        {
          tone: "Brief",
          body: "{{business_name}}: Confirmation code {{code}}",
          charCount: 51,
        },
      ],
    },
    {
      id: "recovery-code",
      name: "Recovery code",
      tooltip: "Sent when a user recovers an account they're locked out of.",
      description:
        "Out-of-band recovery channel when the end-user has lost access to their primary auth method. SMS as lockout fallback, not primary auth.",
      variables: ["business_name", "code", "expiry_minutes"],
      variants: [
        {
          tone: "Standard",
          body: "{{business_name}}: Recovery code: {{code}}. Expires in {{expiry_minutes}} minutes.",
          charCount: 72,
        },
        {
          tone: "Friendly",
          body: "Your {{business_name}} recovery code is {{code}}, good for {{expiry_minutes}} minutes.",
          charCount: 76,
        },
        {
          tone: "Brief",
          body: "{{business_name}}: Recovery code {{code}}",
          charCount: 47,
        },
      ],
    },
    {
      id: "login-code",
      name: "Login code",
      tooltip: "Sent when a user logs in with SMS as a second factor.",
      description:
        "SMS as a second factor at login. Advisory framing (SMS is the least-secure second factor) surfaces in the configurator, never in the message body.",
      variables: ["business_name", "code", "expiry_minutes"],
      variants: [
        {
          tone: "Standard",
          body: "{{business_name}}: Your login code is {{code}}. Expires in {{expiry_minutes}} minutes.",
          charCount: 76,
        },
        {
          tone: "Friendly",
          body: "Your {{business_name}} sign-in code is {{code}}, good for {{expiry_minutes}} minutes.",
          charCount: 75,
        },
        {
          tone: "Brief",
          body: "{{business_name}}: Sign-in code {{code}}",
          charCount: 46,
        },
      ],
    },
  ],
};
