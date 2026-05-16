/**
 * Welcome email for new early-access subscribers.
 *
 * Pure template builder — no Resend dependency, so it stays trivially
 * testable. The caller (POST /api/early-access) passes a fully-formed
 * absolute `unsubscribeUrl`; this module does no URL assembly.
 *
 * Plain-text and HTML versions are built from the same copy. The HTML uses
 * inline styles with neutral literal colors — email clients run no Tailwind,
 * so Untitled UI tokens cannot apply here.
 */

export interface WelcomeEmailInput {
  /** Human-readable category titles, e.g. ["Verification", "Appointments"]. */
  categories: string[];
  /** Fully-formed absolute unsubscribe URL. */
  unsubscribeUrl: string;
}

export interface WelcomeEmail {
  subject: string;
  text: string;
  html: string;
}

const SUBJECT = "You're on the list";

/** Inline paragraph style for the HTML body. */
const P = "margin:0 0 16px;";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildWelcomeEmail({
  categories,
  unsubscribeUrl,
}: WelcomeEmailInput): WelcomeEmail {
  const hasCategories = categories.length > 0;
  const categoryList = categories.join(", ");

  return {
    subject: SUBJECT,
    text: buildText(hasCategories, categoryList, unsubscribeUrl),
    html: buildHtml(hasCategories, categoryList, unsubscribeUrl),
  };
}

function buildText(
  hasCategories: boolean,
  categoryList: string,
  unsubscribeUrl: string,
): string {
  const paragraphs = [
    "Hey,",
    "Thanks for getting on the early access list.",
    "You'll hear from me when RelayKit ships — summer 2026. I'll send a heads-up a week or two ahead so you can plan around it, and another when you can actually sign up.",
  ];
  // Omit the interests paragraph entirely when no categories were captured —
  // never substitute an empty {{categories}} into the sentence.
  if (hasCategories) {
    paragraphs.push(
      `I noted you're interested in ${categoryList}. When we ship, the email will lead with what's live for those first.`,
    );
  }
  paragraphs.push("Joel");
  return `${paragraphs.join("\n\n")}\n\n—\nUnsubscribe: ${unsubscribeUrl}`;
}

function buildHtml(
  hasCategories: boolean,
  categoryList: string,
  unsubscribeUrl: string,
): string {
  const interests = hasCategories
    ? `<p style="${P}">I noted you're interested in ${escapeHtml(categoryList)}. When we ship, the email will lead with what's live for those first.</p>`
    : "";
  const safeUrl = escapeHtml(unsubscribeUrl);
  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#ffffff;">
<div style="max-width:520px;margin:0 auto;padding:32px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1a1a1a;">
<p style="${P}">Hey,</p>
<p style="${P}">Thanks for getting on the early access list.</p>
<p style="${P}">You'll hear from me when RelayKit ships — summer 2026. I'll send a heads-up a week or two ahead so you can plan around it, and another when you can actually sign up.</p>
${interests}
<p style="${P}">Joel</p>
<p style="margin:24px 0 0;color:#8a8a8a;font-size:13px;">—<br />Unsubscribe: <a href="${safeUrl}" style="color:#8a8a8a;">${safeUrl}</a></p>
</div>
</body>
</html>`;
}
