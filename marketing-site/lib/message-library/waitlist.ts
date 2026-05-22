import type { Category, Variable } from "./types";
import { SHARED_VARIABLES } from "./shared-variables";

/**
 * Waitlist variable catalog: `workspace_name` from the shared set, plus five
 * category-specific tokens. Per the sender-frame rule, `workspace_name` is the
 * sender frame in every body.
 *
 * The category is workflow-shaped (research §2): a six-step waitlist lifecycle
 * (joined → position update → almost up → your turn → grace expiring → missed).
 * Every message carries its lifecycle position in `groupNote` (documentation-
 * only this wave per D-408; reserved for the future workspace UX).
 *
 * No token is typeConstrained — every value is plain GSM-7 text and counts
 * against the D-402 single-segment budget. `claim_link` and `rejoin_link`
 * point at the developer's own surfaces on their own domain — RelayKit does
 * not shorten or host them. `queue_position` is a free-form position string
 * ("#4", "next"); `wait_estimate` is a bare duration ("15 minutes", "a week");
 * `grace_window` is how long the open spot stays claimable ("48 hours").
 */
const WAITLIST_VARIABLES: Variable[] = [
  SHARED_VARIABLES.workspace_name,
  {
    name: "queue_position",
    description:
      "The user's place in line, expressed as a short free-form string ('#4', 'next'). Budgeted for the good shape — a number or a one-word position, not a sentence.",
    budgetChars: 8,
    source: "SDK call payload",
    example: "#4",
  },
  {
    name: "wait_estimate",
    description:
      "Bare duration until the user's turn ('15 minutes', 'a week', '2 days'). Just the duration — the body supplies the framing.",
    budgetChars: 14,
    source: "SDK call payload",
    example: "15 minutes",
  },
  {
    name: "claim_link",
    description:
      "Link the user follows to claim the open spot, on the developer's own domain. RelayKit does not shorten or host this URL.",
    budgetChars: 26,
    source: "SDK call payload",
    example: "yourapp.com/claim",
  },
  {
    name: "grace_window",
    description:
      "How long the open spot stays claimable before it lapses ('48 hours', '10 minutes'). Drives the grace-expiring message's explicit timing.",
    budgetChars: 12,
    source: "SDK call payload",
    example: "48 hours",
  },
  {
    name: "rejoin_link",
    description:
      "Link the user follows to rejoin the waitlist after a missed spot, on the developer's own domain. RelayKit does not shorten or host this URL.",
    budgetChars: 26,
    source: "SDK call payload",
    example: "yourapp.com/waitlist",
  },
];

export const WAITLIST: Category = {
  id: "waitlist",
  name: "Waitlist",
  description:
    "Position updates, availability openings, off-list invitations.",
  tcrMapping: "ACCOUNT_NOTIFICATION",
  variables: WAITLIST_VARIABLES,
  compliance: {
    rules: [
      "No credentials in the body (D-393) — waitlist messages carry position, timing, and claim links only, never license keys, API keys, or passwords.",
      "No promotional content (D-399, corpus-wide) — no offers, discounts, or upsell CTAs in any body. The waitlist trigger speaks for itself.",
      "Single GSM-7 segment (D-402) — every body stays under 160 characters at worst-case token substitution; all bodies are ASCII-only.",
      "Includes {{workspace_name}} as the sender frame in every body so the recipient knows who is texting.",
      "Honors STOP/HELP — every body carries the standard STOP opt-out language ('Reply STOP to opt out.', shortened to 'STOP to opt out.' in Brief variants), matching the transactional-category corpus precedent (appointments, customer-support). This is not the Verification 2FA carve-out.",
      "Rejoin CTA carve-out (D-395) — the missed message may carry a single light 'rejoin?' link and no offers; full re-engagement routes through a Marketing campaign, never a Waitlist message.",
    ],
  },
  messages: [
    {
      id: "joined",
      name: "Joined",
      tooltip: "Sent when the user joins the waitlist.",
      description:
        "Confirms waitlist registration and sets the expectation that the next contact arrives by text. The first message — it is the promise that sets the tone for the rest of the workflow.",
      groupNote:
        "Waitlist lifecycle - step 1 of 6: sent when the user opts in via web form, in-app prompt, or SMS keyword.",
      variables: ["workspace_name"],
      variants: [
        {
          tone: "Standard",
          body: "You're on the {{workspace_name}} waitlist. We'll text you when it's your turn. Reply STOP to opt out.",
          charCount: 113,
        },
        {
          tone: "Friendly",
          body: "You're on the list for {{workspace_name}}. We'll text the moment your spot opens up. Reply STOP to opt out.",
          charCount: 119,
        },
        {
          tone: "Brief",
          body: "On the {{workspace_name}} waitlist. We'll text when it's your turn. STOP to opt out.",
          charCount: 96,
        },
      ],
    },
    {
      id: "position-update",
      name: "Position update",
      tooltip: "Sent when the user moves up the queue.",
      description:
        "Tells the user their place in line has moved. An optional stage — more common in capacity-recovery flows than in pre-launch flows, which often skip straight to admission.",
      groupNote:
        "Waitlist lifecycle - step 2 of 6: sent when throughput moves the user up the queue.",
      variables: ["workspace_name", "queue_position"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}} waitlist update: you're now {{queue_position}}. We'll text you when you're up. Reply STOP to opt out.",
          charCount: 122,
        },
        {
          tone: "Friendly",
          body: "Your spot on the {{workspace_name}} waitlist just moved up. You're {{queue_position}} now. Reply STOP to opt out.",
          charCount: 115,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}} waitlist: you're {{queue_position}}. STOP to opt out.",
          charCount: 74,
        },
      ],
    },
    {
      id: "almost-up",
      name: "Almost up",
      tooltip: "Sent when the user's turn is approaching.",
      description:
        "Heads-up that the user's turn is coming, with a time estimate so they can be ready. Time cues are load-bearing — specificity changes recipient behavior.",
      groupNote:
        "Waitlist lifecycle - step 3 of 6: sent when a time-window or position threshold signals the user is near the front.",
      variables: ["workspace_name", "wait_estimate"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}} waitlist: you're up in about {{wait_estimate}}. Keep an eye on your phone. Reply STOP to opt out.",
          charCount: 125,
        },
        {
          tone: "Friendly",
          body: "Almost your turn on {{workspace_name}}. We'll text you in about {{wait_estimate}} when your spot is ready. Reply STOP to opt out.",
          charCount: 138,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: you're up in about {{wait_estimate}}. STOP to opt out.",
          charCount: 83,
        },
      ],
    },
    {
      id: "your-turn",
      name: "Your turn",
      tooltip: "Sent when the user's spot opens.",
      description:
        "The moment the user is being served — capacity has opened or the admission threshold has been crossed. Carries the action link to claim the open spot.",
      groupNote:
        "Waitlist lifecycle - step 4 of 6: sent when capacity opens or the admission threshold is crossed.",
      variables: ["workspace_name", "claim_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}} is ready for you. Claim your spot: {{claim_link}} Reply STOP to opt out.",
          charCount: 115,
        },
        {
          tone: "Friendly",
          body: "Your turn on {{workspace_name}}. Claim your spot here: {{claim_link}} Reply STOP to opt out.",
          charCount: 116,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: you're up. {{claim_link}} STOP to opt out.",
          charCount: 86,
        },
      ],
    },
    {
      id: "grace-expiring",
      name: "Grace expiring",
      tooltip: "Sent when the open spot is about to lapse.",
      description:
        "Last-chance reminder that the open spot is still claimable, with explicit expiration timing. A meaningful share of conversions happen in this stage.",
      groupNote:
        "Waitlist lifecycle - step 5 of 6: sent when the user has not claimed within the configured grace window.",
      variables: ["workspace_name", "grace_window", "claim_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: your spot is still open for {{grace_window}}. Claim it: {{claim_link}} Reply STOP to opt out.",
          charCount: 133,
        },
        {
          tone: "Friendly",
          body: "Your {{workspace_name}} spot is waiting. It's yours for the next {{grace_window}}: {{claim_link}} Reply STOP to opt out.",
          charCount: 140,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: {{grace_window}} left to claim. {{claim_link}} STOP to opt out.",
          charCount: 103,
        },
      ],
    },
    {
      id: "missed",
      name: "Missed",
      tooltip: "Sent when the spot lapses without action.",
      description:
        "Notifies the user their spot lapsed without punishing them, carrying a single light rejoin link and no promotional content (D-395). Full re-engagement routes through a Marketing campaign.",
      groupNote:
        "Waitlist lifecycle - step 6 of 6: sent when the grace window closes without action.",
      variables: ["workspace_name", "rejoin_link"],
      variants: [
        {
          tone: "Standard",
          body: "Your {{workspace_name}} spot expired. Want back on the list? {{rejoin_link}} Reply STOP to opt out.",
          charCount: 122,
        },
        {
          tone: "Friendly",
          body: "Looks like your {{workspace_name}} spot timed out. You can rejoin anytime: {{rejoin_link}} Reply STOP to opt out.",
          charCount: 136,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}} spot expired. Rejoin: {{rejoin_link}} STOP to opt out.",
          charCount: 96,
        },
      ],
    },
  ],
};
