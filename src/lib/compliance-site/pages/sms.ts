import type { TemplateVariables, OptInPageContent } from "@/lib/templates/types";
import { renderPage } from "../html-base";
import { escapeAttr as esc } from "../escape";

export function renderSmsPage(
  vars: TemplateVariables,
  optIn: OptInPageContent,
): string {
  // Build consent text with clickable links to /privacy and /terms
  // Template engine output includes parenthetical URLs like "Privacy Policy (https://...)"
  // Strip those and replace with local hrefs
  const consentHtml = esc(optIn.consent_checkbox_text)
    .replace(/Privacy Policy\s*\([^)]*\)/gi, '<a href="/privacy">Privacy Policy</a>')
    .replace(/Terms of Service\s*\([^)]*\)/gi, '<a href="/terms">Terms of Service</a>');

  const content = `
    <h1>${esc(optIn.heading)}</h1>
    <p class="subtitle">${esc(optIn.subhead)}</p>

    <form id="sms-form" onsubmit="return handleSubmit(event)">
      <div class="form-group">
        <label for="phone">Mobile phone number</label>
        <input type="tel" id="phone" name="phone" placeholder="(555) 123-4567" required>
      </div>

      <div class="form-group checkbox-group">
        <label>
          <input type="checkbox" id="consent" name="consent" onchange="toggleSubmit()">
          <span>${consentHtml}</span>
        </label>
      </div>

      <button type="submit" id="submit-btn" disabled>Subscribe</button>

      <p class="fine-print">${esc(optIn.fine_print)}</p>
    </form>

    <div id="success-message" style="display:none;">
      <p>Thank you! You've been subscribed to ${esc(vars.use_case_label)} from ${esc(vars.business_name)}.</p>
    </div>`;

  const scripts = `<script>
function toggleSubmit() {
  document.getElementById('submit-btn').disabled =
    !document.getElementById('consent').checked;
}

function handleSubmit(e) {
  e.preventDefault();
  document.getElementById('sms-form').style.display = 'none';
  document.getElementById('success-message').style.display = 'block';
  return false;
}

document.getElementById('phone').addEventListener('input', function(e) {
  var v = e.target.value.replace(/\\D/g, '').substring(0, 10);
  if (v.length >= 6) v = '(' + v.substring(0,3) + ') ' + v.substring(3,6) + '-' + v.substring(6);
  else if (v.length >= 3) v = '(' + v.substring(0,3) + ') ' + v.substring(3);
  e.target.value = v;
});
</script>`;

  return renderPage({
    title: "SMS Updates",
    description: `Subscribe to ${vars.use_case_label} from ${vars.business_name}`,
    businessName: vars.business_name,
    currentYear: vars.current_year,
    activePage: "sms",
    content,
    scripts,
  });
}
