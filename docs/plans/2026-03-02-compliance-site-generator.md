# Compliance Site Generator Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Generate 4 static HTML pages (index, privacy, terms, sms) from template engine output for carrier compliance review.

**Architecture:** Pure string interpolation. `generateComplianceSite()` takes `GeneratedArtifacts` + `IntakeData`, runs markdown-to-HTML on privacy/terms, assembles 4 pages using a shared HTML shell with inlined CSS. An API route at `/api/preview-site` serves generated pages for local preview. No external dependencies.

**Tech Stack:** TypeScript, string templates, lightweight custom markdown→HTML converter (no library — output format is fixed/known)

---

### Task 1: CSS Styles Module

**Files:**
- Create: `src/lib/compliance-site/styles.ts`

**Step 1: Create the CSS string constant**

CSS implements the PRD Section 4 design tokens: Inter font stack, 720px max-width, neutral color palette, responsive nav, form styles for the SMS page. Single exported constant `COMPLIANCE_CSS`.

```typescript
// src/lib/compliance-site/styles.ts
export const COMPLIANCE_CSS = `
  /* Reset */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --color-text: #1a1a1a;
    --color-text-secondary: #6b7280;
    --color-bg: #ffffff;
    --color-bg-subtle: #f9fafb;
    --color-border: #e5e7eb;
    --color-link: #2563eb;
    --color-link-hover: #1d4ed8;
    --color-button: #111827;
    --color-button-text: #ffffff;
    --color-button-disabled: #9ca3af;
    --color-error: #dc2626;
    --color-success: #059669;
    --max-width: 720px;
  }

  body {
    font-family: var(--font-family);
    font-size: 16px;
    line-height: 1.6;
    color: var(--color-text);
    background: var(--color-bg);
    -webkit-font-smoothing: antialiased;
  }

  /* Nav */
  nav {
    border-bottom: 1px solid var(--color-border);
    background: var(--color-bg);
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .nav-inner {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 24px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .nav-brand {
    font-weight: 600;
    font-size: 18px;
    color: var(--color-text);
    text-decoration: none;
  }
  .nav-links { display: flex; gap: 24px; }
  .nav-links a {
    font-size: 14px;
    color: var(--color-text-secondary);
    text-decoration: none;
    transition: color 0.15s;
  }
  .nav-links a:hover { color: var(--color-text); }
  .nav-links a.active { color: var(--color-text); font-weight: 500; }

  /* Main */
  main {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 48px 24px 64px;
  }

  /* Typography */
  h1 { font-size: 32px; font-weight: 700; line-height: 1.2; margin-bottom: 16px; }
  h2 { font-size: 24px; font-weight: 600; line-height: 1.3; margin-top: 32px; margin-bottom: 12px; }
  h3 { font-size: 20px; font-weight: 600; line-height: 1.3; margin-top: 24px; margin-bottom: 8px; }
  p { margin-bottom: 16px; }
  .subtitle { font-size: 18px; color: var(--color-text-secondary); margin-bottom: 32px; }
  .meta { font-size: 14px; color: var(--color-text-secondary); margin-bottom: 32px; }

  /* Links */
  a { color: var(--color-link); }
  a:hover { color: var(--color-link-hover); }

  /* Lists */
  ul, ol { margin-bottom: 16px; padding-left: 24px; }
  li { margin-bottom: 8px; }

  /* Contact section */
  .contact { margin-top: 48px; }
  .contact p { margin-bottom: 8px; }

  /* Form (sms page) */
  .form-group { margin-bottom: 20px; }
  .form-group label { display: block; font-size: 14px; font-weight: 500; margin-bottom: 6px; }
  .form-group input[type="tel"] {
    width: 100%;
    padding: 10px 14px;
    font-size: 16px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    outline: none;
    transition: border-color 0.15s;
  }
  .form-group input[type="tel"]:focus { border-color: var(--color-link); }
  .checkbox-group label {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-weight: 400;
    cursor: pointer;
  }
  .checkbox-group input[type="checkbox"] {
    margin-top: 4px;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
  .checkbox-group span { font-size: 14px; color: var(--color-text-secondary); line-height: 1.5; }
  .checkbox-group span a { color: var(--color-link); text-decoration: underline; }

  button[type="submit"] {
    display: inline-flex;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: 500;
    color: var(--color-button-text);
    background: var(--color-button);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: opacity 0.15s;
  }
  button[type="submit"]:hover { opacity: 0.9; }
  button[type="submit"]:disabled {
    background: var(--color-button-disabled);
    cursor: not-allowed;
  }

  .fine-print { font-size: 12px; color: var(--color-text-secondary); margin-top: 16px; }

  #success-message {
    padding: 24px;
    background: var(--color-bg-subtle);
    border-radius: 8px;
    text-align: center;
  }
  #success-message p { color: var(--color-success); font-weight: 500; }

  /* Footer */
  footer {
    border-top: 1px solid var(--color-border);
    margin-top: auto;
  }
  .footer-inner {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: var(--color-text-secondary);
  }
  .powered-by a { color: var(--color-text-secondary); text-decoration: none; }
  .powered-by a:hover { color: var(--color-text); }

  /* Responsive */
  @media (max-width: 640px) {
    .nav-inner { padding: 0 16px; }
    .nav-links { gap: 16px; }
    .nav-links a { font-size: 13px; }
    main { padding: 32px 16px 48px; }
    h1 { font-size: 26px; }
    h2 { font-size: 20px; }
    .footer-inner { flex-direction: column; gap: 8px; text-align: center; }
  }
`;
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Compiles successfully

**Step 3: Commit**

```
feat(compliance-site): add CSS styles module
```

---

### Task 2: Markdown-to-HTML Converter

**Files:**
- Create: `src/lib/compliance-site/markdown.ts`

**Step 1: Write a lightweight markdown→HTML converter**

The template engine outputs a known, limited subset of markdown: `#`/`##`/`###` headings, `**bold**`, `-` bullet lists, and paragraphs. No need for a full markdown parser.

```typescript
// src/lib/compliance-site/markdown.ts

/**
 * Convert the template engine's markdown output to HTML.
 * Handles only the subset used by our templates:
 * - # / ## / ### headings
 * - **bold** text
 * - - bullet lists
 * - blank-line-separated paragraphs
 */
export function markdownToHtml(md: string): string {
  const lines = md.split("\n");
  const output: string[] = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty line — close any open list
    if (trimmed === "") {
      if (inList) {
        output.push("</ul>");
        inList = false;
      }
      continue;
    }

    // Headings (skip H1 since page template provides it)
    if (trimmed.startsWith("### ")) {
      if (inList) { output.push("</ul>"); inList = false; }
      output.push(`<h3>${applyInline(trimmed.slice(4))}</h3>`);
      continue;
    }
    if (trimmed.startsWith("## ")) {
      if (inList) { output.push("</ul>"); inList = false; }
      output.push(`<h2>${applyInline(trimmed.slice(3))}</h2>`);
      continue;
    }
    if (trimmed.startsWith("# ")) {
      if (inList) { output.push("</ul>"); inList = false; }
      // Skip top-level heading — page template already renders <h1>
      continue;
    }

    // Bullet list items
    if (trimmed.startsWith("- ")) {
      if (!inList) {
        output.push("<ul>");
        inList = true;
      }
      output.push(`<li>${applyInline(trimmed.slice(2))}</li>`);
      continue;
    }

    // Paragraph
    if (inList) { output.push("</ul>"); inList = false; }
    output.push(`<p>${applyInline(trimmed)}</p>`);
  }

  if (inList) output.push("</ul>");
  return output.join("\n");
}

/** Apply inline formatting: **bold** */
function applyInline(text: string): string {
  return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

/** Escape HTML entities in text content */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Compiles successfully

**Step 3: Commit**

```
feat(compliance-site): add markdown-to-HTML converter
```

---

### Task 3: HTML Base Shell

**Files:**
- Create: `src/lib/compliance-site/html-base.ts`

**Step 1: Create the shared HTML wrapper**

Every page uses the same nav, footer, and inlined CSS. The `renderPage()` function wraps page-specific content.

```typescript
// src/lib/compliance-site/html-base.ts
import { COMPLIANCE_CSS } from "./styles";

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
  <title>${escapeAttr(title)} — ${escapeAttr(businessName)}</title>
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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(text: string): string {
  return escapeHtml(text).replace(/"/g, "&quot;");
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Compiles successfully

**Step 3: Commit**

```
feat(compliance-site): add HTML base shell with nav and footer
```

---

### Task 4: Page Content Renderers (home, privacy, terms, sms)

**Files:**
- Create: `src/lib/compliance-site/pages/home.ts`
- Create: `src/lib/compliance-site/pages/privacy.ts`
- Create: `src/lib/compliance-site/pages/terms.ts`
- Create: `src/lib/compliance-site/pages/sms.ts`

**Step 1: Home page**

```typescript
// src/lib/compliance-site/pages/home.ts
import type { TemplateVariables } from "@/lib/templates/types";
import { renderPage } from "../html-base";

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

function esc(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
```

**Step 2: Privacy policy page**

```typescript
// src/lib/compliance-site/pages/privacy.ts
import type { TemplateVariables } from "@/lib/templates/types";
import { renderPage } from "../html-base";
import { markdownToHtml } from "../markdown";

export function renderPrivacyPage(vars: TemplateVariables, privacyPolicyMarkdown: string): string {
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

function esc(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
```

**Step 3: Terms of service page**

```typescript
// src/lib/compliance-site/pages/terms.ts
import type { TemplateVariables } from "@/lib/templates/types";
import { renderPage } from "../html-base";
import { markdownToHtml } from "../markdown";

export function renderTermsPage(vars: TemplateVariables, termsMarkdown: string): string {
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

function esc(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
```

**Step 4: SMS opt-in page**

This page has the interactive form with checkbox → button enable, phone formatting, and form submission message. Minimal inline JS per PRD.

```typescript
// src/lib/compliance-site/pages/sms.ts
import type { TemplateVariables } from "@/lib/templates/types";
import type { OptInPageContent } from "@/lib/templates/types";
import { renderPage } from "../html-base";

export function renderSmsPage(
  vars: TemplateVariables,
  optIn: OptInPageContent,
): string {
  // Build consent text with clickable links to /privacy and /terms
  const consentHtml = esc(optIn.consent_checkbox_text)
    .replace(/privacy policy/gi, '<a href="/privacy">Privacy Policy</a>')
    .replace(/terms of service/gi, '<a href="/terms">Terms of Service</a>');

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

function esc(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
```

**Step 5: Verify build**

Run: `npm run build`
Expected: Compiles successfully

**Step 6: Commit**

```
feat(compliance-site): add page renderers for home, privacy, terms, sms
```

---

### Task 5: Main Generator Entry Point

**Files:**
- Create: `src/lib/compliance-site/generator.ts`

**Step 1: Write the main generator function**

Takes `IntakeData`, runs template engine, returns map of filename → HTML.

```typescript
// src/lib/compliance-site/generator.ts
import type { IntakeData } from "@/lib/templates/types";
import { generateArtifacts } from "@/lib/templates";
import { deriveVariables } from "@/lib/templates/variables";
import { renderHomePage } from "./pages/home";
import { renderPrivacyPage } from "./pages/privacy";
import { renderTermsPage } from "./pages/terms";
import { renderSmsPage } from "./pages/sms";

export interface ComplianceSiteOutput {
  slug: string;
  pages: Record<string, string>;
}

export function generateComplianceSite(intake: IntakeData): ComplianceSiteOutput {
  const artifacts = generateArtifacts(intake);
  const vars = deriveVariables(intake);

  return {
    slug: artifacts.compliance_site_slug,
    pages: {
      "index.html": renderHomePage(vars),
      "privacy.html": renderPrivacyPage(vars, artifacts.privacy_policy),
      "terms.html": renderTermsPage(vars, artifacts.terms_of_service),
      "sms.html": renderSmsPage(vars, artifacts.opt_in_page_content),
    },
  };
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Compiles successfully

**Step 3: Commit**

```
feat(compliance-site): add main generator entry point
```

---

### Task 6: Preview API Route

**Files:**
- Create: `src/app/api/preview-site/route.ts`

**Step 1: Create the preview API route**

Accepts query params `use_case` + business details, generates a site, and serves a single page based on `page` param. Defaults to index.

```typescript
// src/app/api/preview-site/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateComplianceSite } from "@/lib/compliance-site/generator";
import type { IntakeData } from "@/lib/templates/types";
import type { UseCaseId } from "@/lib/intake/use-case-data";

const VALID_PAGES = ["index.html", "privacy.html", "terms.html", "sms.html"];

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  // Required params
  const useCase = sp.get("use_case") as UseCaseId | null;
  const businessName = sp.get("business_name");

  if (!useCase || !businessName) {
    return NextResponse.json(
      { error: "Missing required params: use_case, business_name" },
      { status: 400 },
    );
  }

  const intake: IntakeData = {
    use_case: useCase,
    business_name: businessName,
    business_description: sp.get("business_description") ?? `${businessName} provides services to customers.`,
    email: sp.get("email") ?? "hello@example.com",
    phone: sp.get("phone") ?? "5551234567",
    contact_name: sp.get("contact_name") ?? "Owner",
    address_line1: sp.get("address_line1") ?? "123 Main St",
    address_city: sp.get("address_city") ?? "San Francisco",
    address_state: sp.get("address_state") ?? "CA",
    address_zip: sp.get("address_zip") ?? "94102",
    website_url: sp.get("website_url") ?? null,
    service_type: sp.get("service_type") ?? null,
    product_type: sp.get("product_type") ?? null,
    app_name: sp.get("app_name") ?? null,
    community_name: sp.get("community_name") ?? null,
    venue_type: sp.get("venue_type") ?? null,
    has_ein: sp.get("has_ein") === "true",
    ein: sp.get("ein") ?? null,
    business_type: sp.get("business_type") ?? null,
  };

  const site = generateComplianceSite(intake);

  // Which page to serve
  let page = sp.get("page") ?? "index.html";
  if (!page.endsWith(".html")) page += ".html";
  if (!VALID_PAGES.includes(page)) page = "index.html";

  const html = site.pages[page];

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Compiles successfully, new route `/api/preview-site` appears in route list

**Step 3: Manual smoke test**

Run: `npm run dev` then open browser to:
- `http://localhost:3000/api/preview-site?use_case=appointments&business_name=PetBook&business_description=A+booking+platform+for+pet+groomers&email=hello@petbook.com&service_type=pet+grooming`
- Append `&page=privacy` for the privacy page
- Append `&page=terms` for the terms page
- Append `&page=sms` for the SMS opt-in page

Verify:
- All 4 pages render with correct business name in nav
- Nav links work (switching between pages preserves query params — they won't in preview, that's fine)
- Privacy policy contains the mandatory mobile data non-sharing clause
- SMS page has unchecked checkbox, disabled button, phone formatting works
- Pages are responsive (check at mobile viewport)

**Step 4: Commit**

```
feat(compliance-site): add preview API route for local testing
```

---

### Task 7: Final Build Verification

**Step 1: Run production build**

Run: `npm run build`
Expected: All routes compile, no TypeScript errors

**Step 2: Commit all work if any unstaged changes remain**

```
feat: PRD_03 compliance site generator — HTML generation and local preview
```
