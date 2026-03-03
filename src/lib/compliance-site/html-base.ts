import { COMPLIANCE_CSS } from "./styles";
import { escapeHtml, escapeAttr } from "./escape";

interface PageOptions {
  title: string;
  description: string;
  businessName: string;
  currentYear: string;
  activePage: "home" | "privacy" | "terms" | "sms";
  content: string;
  scripts?: string;
}

export function renderPage(opts: PageOptions): string {
  const { title, description, businessName, currentYear, activePage, content, scripts } = opts;

  const navLinks = [
    { href: "/privacy", label: "Privacy Policy", id: "privacy" as const },
    { href: "/terms", label: "Terms of Service", id: "terms" as const },
    { href: "/sms", label: "SMS Updates", id: "sms" as const },
  ];

  const navHtml = navLinks
    .map((link) => {
      const cls = link.id === activePage ? ' class="active"' : "";
      return `<a href="${link.href}"${cls}>${link.label}</a>`;
    })
    .join("\n        ");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeAttr(title)} \u2014 ${escapeAttr(businessName)}</title>
  <meta name="description" content="${escapeAttr(description)}">
  <style>${COMPLIANCE_CSS}</style>
</head>
<body>
  <nav>
    <div class="nav-inner">
      <a href="/" class="nav-brand">${escapeHtml(businessName)}</a>
      <div class="nav-links">
        ${navHtml}
      </div>
    </div>
  </nav>

  <main>
    ${content}
  </main>

  <footer>
    <div class="footer-inner">
      <p>&copy; ${escapeHtml(currentYear)} ${escapeHtml(businessName)}. All rights reserved.</p>
      <p class="powered-by">Powered by <a href="https://relaykit.com" rel="noopener">RelayKit</a></p>
    </div>
  </footer>
${scripts ? `\n  ${scripts}\n` : ""}
</body>
</html>`;
}
