import type { Category, Variable } from "./types";
import { SHARED_VARIABLES } from "./shared-variables";

/**
 * Order updates variable catalog: `workspace_name` from the shared set (the
 * D-398 default sender frame for this category), plus six category-specific
 * tokens covering the order lifecycle.
 *
 * `tracking_link` accepts well-known carrier-tracking URLs (UPS/USPS/FedEx) —
 * carrier-direct domains are familiar to carriers and don't increase the
 * filtering risk that public URL shorteners introduce; per the research file
 * §5, public shorteners are discouraged. `return_link` is the developer's own
 * returns UI on their own domain — RelayKit does not shorten or host it
 * (same shape as `account_link` in Account events).
 *
 * `estimated_delivery` budgets for the short day-name / relative-phrase form
 * ("Thursday", "in 3 days") rather than a full date string; a long date is
 * allowed but reads worse in SMS and would shrink the room left for other
 * tokens under D-402's worst-case-segment math.
 *
 * `refund_amount` budgets for partial-refund phrasing ("$40 of $50"); a full
 * refund ("$50") will sit well inside the budget.
 *
 * `card_type` is a human-readable card label ("Visa credit", "Mastercard"),
 * never a card number — no PII in the body per D-393.
 *
 * Each message carries its lifecycle position in `groupNote` (documentation-
 * only this wave per D-408; reserved for the future workspace UX). Lifecycle
 * ordering is the message array order: order-confirmed → order-processing →
 * order-shipped → out-for-delivery → order-delivered → return-initiated →
 * refund-processed.
 */
const ORDER_UPDATES_VARIABLES: Variable[] = [
  SHARED_VARIABLES.workspace_name,
  {
    name: "order_number",
    description:
      "The developer's own order or purchase identifier — passed by the SDK from the order event. RelayKit does not generate or format it.",
    budgetChars: 14,
    source: "SDK call payload",
    example: "ORD-2026-90413",
  },
  {
    name: "tracking_link",
    description:
      "Carrier or developer tracking URL. Carrier-domain links (UPS/USPS/FedEx) are well-known to carriers; public URL shorteners are discouraged.",
    budgetChars: 19,
    source: "SDK call payload",
    example: "track.ups.com/x9k2",
  },
  {
    name: "estimated_delivery",
    description:
      "Short delivery estimate — a day name or relative phrase ('Thursday', 'in 3 days'). A long date string works but reads worse in SMS.",
    budgetChars: 9,
    source: "SDK call payload",
    example: "Thursday",
  },
  {
    name: "return_link",
    description:
      "Link to the developer's own returns UI on their own domain. RelayKit does not shorten or host this URL.",
    budgetChars: 19,
    source: "SDK call payload",
    example: "yourapp.com/returns",
  },
  {
    name: "refund_amount",
    description:
      "Refund amount as the developer chooses to phrase it — '$50' for a full refund, '$40 of $50' for a partial. budgetChars sizes for the partial phrasing.",
    budgetChars: 12,
    source: "SDK call payload",
    example: "$40 of $50",
  },
  {
    name: "card_type",
    description:
      "Human-readable card label the refund returned to ('Visa credit', 'Mastercard'). Not a card number — no PII in the body.",
    budgetChars: 10,
    source: "SDK call payload",
    example: "Visa credit",
  },
  {
    name: "action_link",
    description:
      "Link to the order action surface on the developer's own domain — quote review/approval, or delivery reschedule. RelayKit does not shorten or host this URL.",
    budgetChars: 24,
    source: "SDK call payload",
    example: "yourapp.com/orders",
  },
];

export const ORDER_UPDATES: Category = {
  id: "order-updates",
  name: "Order updates",
  description:
    "Confirmations, shipping, delivery, and returns — the order-status messages customers actually want.",
  tcrMapping: "DELIVERY_NOTIFICATION",
  variables: ORDER_UPDATES_VARIABLES,
  compliance: {
    rules: [
      "Includes {{workspace_name}} as the sender frame in every body (D-398).",
      "No promotional content — no offers, no discount codes, no cross-sell (D-399, corpus-wide). The order status speaks for itself.",
      "The Delivered stage carries no cross-sell or upsell CTA (D-399). An exception-capture prompt ('issue with your order?') is allowed; a promotional CTA is not.",
      "No credentials in the body (D-393, corpus-wide). Digital-product confirmations link to authenticated retrieval — license keys and API keys never appear in the body.",
      "Standard opt-out - every body carries the standard STOP opt-out language ('Reply STOP to opt out.', shortened to 'STOP to opt out.' in Brief variants), matching the transactional-category corpus precedent (D-412).",
      "Single GSM-7 segment after worst-case-realistic variable substitution (D-402).",
      "Carrier-tracking links are acceptable and well-known to carriers; public URL shorteners are discouraged.",
    ],
  },
  messages: [
    {
      id: "order-confirmed",
      name: "Order confirmed",
      tooltip: "Sent right after an order is placed and paid.",
      description:
        "Sent the moment an order is placed and payment clears — the 'your order is locked in' message.",
      groupNote:
        "Order lifecycle — step 1 of 7: sent immediately after order is placed and payment confirmed.",
      variables: ["workspace_name", "order_number", "estimated_delivery"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: Order {{order_number}} confirmed. Arrives {{estimated_delivery}}. We'll text you when it ships. Reply STOP to opt out.",
          charCount: 135,
        },
        {
          tone: "Friendly",
          body: "Your {{workspace_name}} order {{order_number}} is in. Arriving {{estimated_delivery}}, we'll let you know when it's on the way. Reply STOP to opt out.",
          charCount: 147,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: Order {{order_number}} confirmed. Arrives {{estimated_delivery}}. STOP to opt out.",
          charCount: 99,
        },
      ],
    },
    {
      id: "order-processing",
      name: "Order processing",
      tooltip: "Sent when an order moves into preparation.",
      description:
        "Sent when an order moves from received to in-preparation — used by sellers who want to set expectations during fulfillment lag.",
      groupNote:
        "Order lifecycle — step 2 of 7: sent when order moves from received to in-preparation in the developer's system.",
      variables: ["workspace_name", "order_number"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: Order {{order_number}} is being prepared. We'll text you when it ships. Reply STOP to opt out.",
          charCount: 124,
        },
        {
          tone: "Friendly",
          body: "Good news, your {{workspace_name}} order {{order_number}} is being put together now. Shipping update coming soon. Reply STOP to opt out.",
          charCount: 146,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: Order {{order_number}} in preparation. STOP to opt out.",
          charCount: 85,
        },
      ],
    },
    {
      id: "order-shipped",
      name: "Order shipped",
      tooltip: "Sent when an order ships, with the tracking link.",
      description:
        "Sent when an order ships — the most-opened message in the order sequence. The tracking link is the message.",
      groupNote:
        "Order lifecycle — step 3 of 7: sent when order ships from warehouse or fulfillment partner.",
      variables: [
        "workspace_name",
        "order_number",
        "tracking_link",
        "estimated_delivery",
      ],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: Order {{order_number}} has shipped. Track it: {{tracking_link}}. Arrives {{estimated_delivery}}. Reply STOP to opt out.",
          charCount: 138,
        },
        {
          tone: "Friendly",
          body: "Your {{workspace_name}} order {{order_number}} is on the way. Follow it here: {{tracking_link}}. Should arrive {{estimated_delivery}}. Reply STOP to opt out.",
          charCount: 156,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: Order {{order_number}} shipped. Track: {{tracking_link}} STOP to opt out.",
          charCount: 105,
        },
      ],
    },
    {
      id: "out-for-delivery",
      name: "Out for delivery",
      tooltip: "Sent when a package is out for delivery.",
      description:
        "Sent on delivery day when the carrier marks the package out for delivery.",
      groupNote:
        "Order lifecycle — step 4 of 7: sent when carrier marks package out-for-delivery on delivery day.",
      variables: ["workspace_name", "order_number", "tracking_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: Order {{order_number}} is out for delivery today. Track it: {{tracking_link}} Reply STOP to opt out.",
          charCount: 132,
        },
        {
          tone: "Friendly",
          body: "Your {{workspace_name}} order {{order_number}} is out for delivery, it should reach you today. Track: {{tracking_link}} Reply STOP to opt out.",
          charCount: 154,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: Order {{order_number}} out for delivery. {{tracking_link}} STOP to opt out.",
          charCount: 107,
        },
      ],
    },
    {
      id: "order-delivered",
      name: "Order delivered",
      tooltip: "Sent when a package is marked delivered.",
      description:
        "Sent when the carrier marks the package delivered — closes the shipping arc. No cross-sell (D-399).",
      groupNote:
        "Order lifecycle — step 5 of 7: sent when carrier marks package delivered.",
      variables: ["workspace_name", "order_number", "return_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: Order {{order_number}} was delivered. Something wrong? Start here: {{return_link}} Reply STOP to opt out.",
          charCount: 139,
        },
        {
          tone: "Friendly",
          body: "Your {{workspace_name}} order {{order_number}} has been delivered. If anything's off, you can sort it here: {{return_link}} Reply STOP to opt out.",
          charCount: 160,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: Order {{order_number}} delivered. Issue? {{return_link}} STOP to opt out.",
          charCount: 107,
        },
      ],
    },
    {
      id: "return-initiated",
      name: "Return started",
      tooltip: "Sent when a customer starts a return.",
      description:
        "Sent when a customer starts a return — confirms the return is logged and a refund is pending.",
      groupNote:
        "Order lifecycle — step 6 of 7: sent when customer initiates a return through the developer's system.",
      variables: ["workspace_name", "order_number", "return_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: Your return for order {{order_number}} is started. Track its status: {{return_link}} Reply STOP to opt out.",
          charCount: 141,
        },
        {
          tone: "Friendly",
          body: "We've started the return for your {{workspace_name}} order {{order_number}}. Check its status anytime: {{return_link}} Reply STOP to opt out.",
          charCount: 155,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: Return started for order {{order_number}}. Status: {{return_link}} STOP to opt out.",
          charCount: 117,
        },
      ],
    },
    {
      id: "refund-processed",
      name: "Refund processed",
      tooltip: "Sent when a refund is returned to the customer's card.",
      description:
        "Sent when a refund is returned to the original payment method — closes the return arc.",
      groupNote:
        "Order lifecycle — step 7 of 7: sent when refund is processed back to original payment method.",
      variables: [
        "workspace_name",
        "order_number",
        "refund_amount",
        "card_type",
      ],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: Refund of {{refund_amount}} for order {{order_number}} is processed to your {{card_type}}. Reply STOP to opt out.",
          charCount: 135,
        },
        {
          tone: "Friendly",
          body: "Your {{workspace_name}} refund of {{refund_amount}} for order {{order_number}} is on its way back to your {{card_type}}. Reply STOP to opt out.",
          charCount: 145,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: {{refund_amount}} refunded for order {{order_number}} to your {{card_type}}. STOP to opt out.",
          charCount: 115,
        },
      ],
    },
    {
      id: "order-ready-for-pickup",
      name: "Order ready for pickup",
      tooltip:
        "Sent when a BOPIS, click-and-collect, or counter order is ready to collect.",
      description:
        "A 'it's ready, come get it' terminal state for any retailer or service offering pickup — distinct from the shipping/delivery arc.",
      variables: ["workspace_name", "order_number"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: Order {{order_number}} is ready for pickup. Reply STOP to opt out.",
          charCount: 96,
        },
        {
          tone: "Friendly",
          body: "Your {{workspace_name}} order {{order_number}} is ready - come grab it. Reply STOP to opt out.",
          charCount: 104,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: Order {{order_number}} ready for pickup. STOP to opt out.",
          charCount: 87,
        },
      ],
    },
    {
      id: "quote-ready",
      name: "Quote ready",
      tooltip: "Sent when an estimate or quote is ready to review and approve.",
      description:
        "A pre-confirmation 'your quote is ready to review and approve' step common to every quote-driven order or service.",
      variables: ["workspace_name", "action_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: Your quote is ready. Review and approve here: {{action_link}} Reply STOP to opt out.",
          charCount: 125,
        },
        {
          tone: "Friendly",
          body: "Good news - your {{workspace_name}} quote is ready. Take a look and approve: {{action_link}} Reply STOP to opt out.",
          charCount: 136,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: Quote ready. Review: {{action_link}} STOP to opt out.",
          charCount: 94,
        },
      ],
    },
    {
      id: "delivery-attempt-failed",
      name: "Delivery attempt failed",
      tooltip: "Sent when a delivery attempt could not be completed.",
      description:
        "Sent when a delivery attempt could not be completed, with a path to reschedule — sits between out-for-delivery and delivered.",
      variables: ["workspace_name", "order_number", "action_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: We couldn't deliver order {{order_number}} today. Reschedule here: {{action_link}} Reply STOP to opt out.",
          charCount: 144,
        },
        {
          tone: "Friendly",
          body: "Your {{workspace_name}} order {{order_number}} couldn't be delivered today. Let's find another time: {{action_link}} Reply STOP to opt out.",
          charCount: 158,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: Order {{order_number}} delivery failed. Reschedule: {{action_link}} STOP to opt out.",
          charCount: 123,
        },
      ],
    },
  ],
};
