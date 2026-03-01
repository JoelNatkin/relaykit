export type {
  IntakeData,
  TemplateVariables,
  GeneratedArtifacts,
  OptInPageContent,
} from "./types";
export {
  USE_CASE_LABELS,
  USE_CASE_FREQUENCIES,
  TCR_USE_CASES,
  TCR_DEFAULT_FLAGS,
} from "./types";
export { generateComplianceSlug, deriveVariables } from "./variables";

import type { IntakeData, GeneratedArtifacts } from "./types";
import { TCR_USE_CASES, TCR_DEFAULT_FLAGS } from "./types";
import { deriveVariables, generateComplianceSlug } from "./variables";
import { renderCampaignDescription } from "./campaign-descriptions";
import { renderSampleMessages } from "./sample-messages";
import { renderOptInDescription } from "./opt-in-descriptions";
import { renderPrivacyPolicy } from "./privacy-policy";
import { renderTermsOfService } from "./terms-of-service";
import { renderOptInPageContent } from "./opt-in-page";

export function generateArtifacts(intake: IntakeData): GeneratedArtifacts {
  const vars = deriveVariables(intake);
  const useCase = intake.use_case;

  return {
    campaign_description: renderCampaignDescription(useCase, vars),
    sample_messages: renderSampleMessages(useCase, vars),
    opt_in_description: renderOptInDescription(useCase, vars),
    privacy_policy: renderPrivacyPolicy(vars),
    terms_of_service: renderTermsOfService(vars),
    opt_in_page_content: renderOptInPageContent(useCase, vars),
    tcr_use_case: TCR_USE_CASES[useCase],
    tcr_flags: { ...TCR_DEFAULT_FLAGS },
    compliance_site_slug: generateComplianceSlug(intake.business_name),
  };
}
