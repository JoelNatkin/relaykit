import type { Category, Variable } from "./types";
import { SHARED_VARIABLES } from "./shared-variables";

/**
 * Documents variable catalog: `workspace_name` from the shared set (the D-398
 * default sender frame for this category), plus the document-action links and
 * the deliverable label.
 *
 * `account_link` and `action_link` point at the developer's own authenticated
 * document surfaces on their own domain (upload, sign, download) — RelayKit
 * does not shorten or host them (same shape as `account_link` in Account
 * events). `item_label` names the generated deliverable ("notarized document",
 * "translation", "meal plan", "ticket") and is the one load-bearing free-text
 * token in the Item-ready message.
 *
 * The category is a paperwork lifecycle (research / Universal-miss report):
 * document-needed → signature-requested → signature-received /
 * documents-received → item-ready. Messages are flat (D-408); no token is
 * typeConstrained — every value is plain GSM-7 text and counts against the
 * D-402 single-segment budget.
 */
const DOCUMENTS_VARIABLES: Variable[] = [
  SHARED_VARIABLES.workspace_name,
  {
    name: "account_link",
    description:
      "Link to the developer's own document surface on their own domain (upload, review, or sign). RelayKit does not shorten or host this URL.",
    budgetChars: 19,
    source: "SDK call payload",
    example: "yourapp.com/upload",
  },
  {
    name: "action_link",
    description:
      "Link to the ready deliverable on the developer's own domain (download or access). RelayKit does not shorten or host this URL.",
    budgetChars: 24,
    source: "SDK call payload",
    example: "yourapp.com/files/8821",
  },
  {
    name: "item_label",
    description:
      "Plain-English name of the ready deliverable ('notarized document', 'translation', 'meal plan', 'ticket').",
    budgetChars: 24,
    source: "SDK call payload",
    example: "notarized document",
  },
];

export const DOCUMENTS: Category = {
  id: "documents",
  name: "Documents",
  description:
    "Document requests, signature workflows, and deliverable-ready notices — the paperwork lifecycle from request to completion.",
  tcrMapping: "ACCOUNT_NOTIFICATION",
  variables: DOCUMENTS_VARIABLES,
  compliance: {
    rules: [
      "Includes {{workspace_name}} as the sender frame in every body (D-398).",
      "No promotional content — no offers, no discount codes, no upsell pitches (D-399, corpus-wide). The document action speaks for itself.",
      "No credentials in the body (D-393, corpus-wide). Messages link to the developer's authenticated document surfaces; no document contents or keys inline.",
      "Honors STOP/HELP — standard transactional opt-out applies (no 2FA carve-out here).",
      "Single GSM-7 segment after worst-case-realistic variable substitution (D-402).",
      "Upload, sign, and download links point at the developer's own domain — RelayKit does not shorten or host them.",
    ],
  },
  messages: [
    {
      id: "document-needed",
      name: "Document needed",
      tooltip: "Sent when the recipient needs to supply a document to continue.",
      description:
        "Asks the recipient to supply a required document before a workflow can continue — the blocker-clearing request that opens the paperwork lifecycle.",
      variables: ["workspace_name", "account_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: We need a document from you to continue. Upload it here: {{account_link}} Reply STOP to opt out.",
          charCount: 131,
        },
        {
          tone: "Friendly",
          body: "{{workspace_name}}: One thing left - we need a document from you. Upload it here: {{account_link}} Reply STOP to opt out.",
          charCount: 136,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: Document needed. Upload: {{account_link}} STOP to opt out.",
          charCount: 93,
        },
      ],
    },
    {
      id: "signature-requested",
      name: "Signature requested",
      tooltip: "Sent when a document is ready for the recipient's e-signature.",
      description:
        "Notifies the recipient that a document is ready for their e-signature, with a link to review and sign.",
      variables: ["workspace_name", "account_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: A document is ready for your signature. Review and sign: {{account_link}} Reply STOP to opt out.",
          charCount: 131,
        },
        {
          tone: "Friendly",
          body: "{{workspace_name}}: you have a document ready to sign - it only takes a minute: {{account_link}} Reply STOP to opt out.",
          charCount: 134,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: Document ready to sign: {{account_link}} STOP to opt out.",
          charCount: 92,
        },
      ],
    },
    {
      id: "signature-reminder",
      name: "Signature reminder",
      tooltip: "Sent when a document is still unsigned after the initial request.",
      description:
        "A single follow-up to a recipient who received a signature request but hasn't signed yet — the non-responder nudge that recovers most stalled documents.",
      variables: ["workspace_name", "account_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: A document is still waiting for your signature. Sign here: {{account_link}} Reply STOP to opt out.",
          charCount: 114,
        },
        {
          tone: "Friendly",
          body: "{{workspace_name}}: just a reminder, a document still needs your signature. It only takes a minute: {{account_link}} Reply STOP to opt out.",
          charCount: 135,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: Document still needs signing: {{account_link}} STOP to opt out.",
          charCount: 76,
        },
      ],
    },
    {
      id: "signature-received",
      name: "Signature received",
      tooltip: "Sent when all required signatures are in and the document is executed.",
      description:
        "Confirms the recipient's signature is in and the document is executed — closes the signing loop.",
      variables: ["workspace_name"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: We received your signed document. Nothing more needed for now. Reply STOP to opt out.",
          charCount: 117,
        },
        {
          tone: "Friendly",
          body: "{{workspace_name}}: got it - your document is signed and in. Thanks! Reply STOP to opt out.",
          charCount: 103,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: Signed document received. STOP to opt out.",
          charCount: 74,
        },
      ],
    },
    {
      id: "documents-received",
      name: "Documents received",
      tooltip:
        "Sent when the recipient's submitted documents have been received and logged.",
      description:
        "Acknowledges that the recipient's submitted documents were received and logged, with next steps to follow. Pairs with Document needed.",
      variables: ["workspace_name"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: Your documents have been received. We'll be in touch with next steps. Reply STOP to opt out.",
          charCount: 124,
        },
        {
          tone: "Friendly",
          body: "{{workspace_name}}: got your documents - we'll review them and reach out soon. Reply STOP to opt out.",
          charCount: 113,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: Documents received. Next steps coming. STOP to opt out.",
          charCount: 87,
        },
      ],
    },
    {
      id: "item-ready",
      name: "Item ready",
      tooltip:
        "Sent when a digital deliverable is generated and ready to access.",
      description:
        "Notifies the recipient that a generated digital deliverable — document, file, plan, or ticket — is ready to access or download.",
      variables: ["workspace_name", "item_label", "action_link"],
      variants: [
        {
          tone: "Standard",
          body: "{{workspace_name}}: Your {{item_label}} is ready. Access it here: {{action_link}} Reply STOP to opt out.",
          charCount: 135,
        },
        {
          tone: "Friendly",
          body: "Your {{workspace_name}} {{item_label}} is ready: {{action_link}} Reply STOP to opt out.",
          charCount: 118,
        },
        {
          tone: "Brief",
          body: "{{workspace_name}}: {{item_label}} ready: {{action_link}} STOP to opt out.",
          charCount: 105,
        },
      ],
    },
  ],
};
