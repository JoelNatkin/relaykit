import type { IntakeData } from "@/lib/templates/types";
import { generateArtifacts, deriveVariables } from "@/lib/templates";
import { renderHomePage } from "./pages/home";
import { renderPrivacyPage } from "./pages/privacy";
import { renderTermsPage } from "./pages/terms";
import { renderSmsPage } from "./pages/sms";

export interface ComplianceSiteOutput {
  slug: string;
  pages: Record<string, string>;
}

export function generateComplianceSite(
  intake: IntakeData,
): ComplianceSiteOutput {
  const artifacts = generateArtifacts(intake);
  const vars = deriveVariables(intake);

  return {
    slug: artifacts.compliance_site_slug,
    pages: {
      "index.html": renderHomePage(vars),
      "privacy.html": renderPrivacyPage(vars, artifacts.privacy_policy),
      "terms.html": renderTermsPage(vars, artifacts.terms_of_service),
      "sms.html": renderSmsPage(vars, artifacts.opt_in_page_content),
      "robots.txt": "User-agent: *\nAllow: /\n",
    },
  };
}
