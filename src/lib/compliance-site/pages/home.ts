import type { TemplateVariables } from "@/lib/templates/types";
import { renderPage } from "../html-base";
import { escapeAttr as esc } from "../escape";

export function renderHomePage(vars: TemplateVariables): string {
  const content = `
    <h1>${esc(vars.business_name)}</h1>
    <p class="subtitle">${esc(vars.business_description)}</p>

    <section class="contact">
      <h2>Contact Us</h2>
      <p>Email: <a href="mailto:${esc(vars.contact_email)}">${esc(vars.contact_email)}</a></p>
      <p>Phone: ${esc(vars.contact_phone)}</p>
      <p>${esc(vars.address_full)}</p>
    </section>`;

  return renderPage({
    title: vars.business_name,
    description: vars.business_description,
    businessName: vars.business_name,
    currentYear: vars.current_year,
    activePage: "home",
    content,
  });
}
