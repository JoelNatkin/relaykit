import type { TemplateVariables } from "@/lib/templates/types";
import { renderPage } from "../html-base";
import { markdownToHtml } from "../markdown";
import { escapeAttr as esc } from "../escape";

export function renderTermsPage(
  vars: TemplateVariables,
  termsMarkdown: string,
): string {
  const bodyHtml = markdownToHtml(termsMarkdown);

  const content = `
    <h1>Terms of Service</h1>
    <p class="meta">Effective Date: ${esc(vars.current_date)} | Last Updated: ${esc(vars.current_date)}</p>
    ${bodyHtml}`;

  return renderPage({
    title: "Terms of Service",
    description: `Terms of Service for ${vars.business_name}`,
    businessName: vars.business_name,
    currentYear: vars.current_year,
    activePage: "terms",
    content,
  });
}
