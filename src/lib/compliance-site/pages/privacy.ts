import type { TemplateVariables } from "@/lib/templates/types";
import { renderPage } from "../html-base";
import { markdownToHtml } from "../markdown";
import { escapeAttr as esc } from "../escape";

export function renderPrivacyPage(
  vars: TemplateVariables,
  privacyPolicyMarkdown: string,
): string {
  const bodyHtml = markdownToHtml(privacyPolicyMarkdown);

  const content = `
    <h1>Privacy Policy</h1>
    <p class="meta">Effective Date: ${esc(vars.current_date)} | Last Updated: ${esc(vars.current_date)}</p>
    ${bodyHtml}`;

  return renderPage({
    title: "Privacy Policy",
    description: `Privacy Policy for ${vars.business_name}`,
    businessName: vars.business_name,
    currentYear: vars.current_year,
    activePage: "privacy",
    content,
  });
}
