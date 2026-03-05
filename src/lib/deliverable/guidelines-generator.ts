// ---------------------------------------------------------------------------
// Unified SMS_GUIDELINES.md Generator — Sandbox + Production
// ---------------------------------------------------------------------------
// Selects template by edition, resolves fallback values, replaces placeholders,
// injects vertical modules when business description is provided.

import type { UseCaseId } from "@/lib/intake/use-case-data";
import type { CanonMessage } from "./canon-messages";
import { renderCanonMessagesSection } from "./canon-messages";
import { USE_CASE_LABELS, USE_CASE_FREQUENCIES } from "@/lib/templates/types";
import {
  APPROVED_MESSAGE_TYPES,
  NOT_APPROVED_CONTENT,
} from "@/lib/templates/message-templates";
import {
  detectVerticals,
  assembleGuidelines,
} from "@/lib/templates/verticals";
import { USE_CASE_TIPS } from "./use-case-tips";
import { SANDBOX_GUIDELINES_TEMPLATE } from "./guidelines-template-sandbox";
import { PRODUCTION_GUIDELINES_TEMPLATE } from "./guidelines-template-prod";

export interface GuidelinesInput {
  use_case: UseCaseId;
  business_name?: string;
  business_description?: string;
  phone_number?: string;
  registration_date?: string;
  canon_messages?: CanonMessage[];
  compliance_site_url?: string;
  approved_message_types?: string;
  not_approved_content?: string;
  message_frequency?: string;
  rate_limit_tier?: string;
}

export function generateGuidelines(
  input: GuidelinesInput,
  edition: "sandbox" | "production",
): string {
  // Select template
  const template =
    edition === "sandbox"
      ? SANDBOX_GUIDELINES_TEMPLATE
      : PRODUCTION_GUIDELINES_TEMPLATE;

  // Resolve fallback values
  const businessName = input.business_name || "Your Business";
  const useCaseLabel = USE_CASE_LABELS[input.use_case];
  const approvedMessageTypes =
    input.approved_message_types || APPROVED_MESSAGE_TYPES[input.use_case];
  const notApprovedContent =
    input.not_approved_content || NOT_APPROVED_CONTENT[input.use_case];
  const messageFrequency =
    input.message_frequency || USE_CASE_FREQUENCIES[input.use_case];
  const useCaseTip = USE_CASE_TIPS[input.use_case];

  // Replace common placeholders
  let rendered = template
    .replace(/{business_name}/g, businessName)
    .replace(/{use_case_label}/g, useCaseLabel)
    .replace(/{approved_message_types}/g, approvedMessageTypes)
    .replace(/{not_approved_content}/g, notApprovedContent)
    .replace(/{message_frequency}/g, messageFrequency)
    .replace(/{use_case_tip}/g, useCaseTip);

  // Production-only placeholders
  if (edition === "production") {
    const canonSection = input.canon_messages
      ? renderCanonMessagesSection(input.canon_messages)
      : "";
    rendered = rendered
      .replace(/{canon_messages_section}/g, canonSection)
      .replace(/{phone_number}/g, input.phone_number || "")
      .replace(/{registration_date}/g, input.registration_date || "")
      .replace(/{compliance_site_url}/g, input.compliance_site_url || "")
      .replace(/{rate_limit_tier}/g, input.rate_limit_tier || "");
  }

  // Inject vertical-specific modules if business description is provided
  if (input.business_description) {
    const verticals = detectVerticals(null, input.business_description);
    if (verticals.length > 0) {
      return assembleGuidelines(rendered, verticals);
    }
  }

  return rendered;
}
