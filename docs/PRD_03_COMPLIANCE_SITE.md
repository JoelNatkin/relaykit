# PRD_03: COMPLIANCE SITE GENERATOR
## RelayKit — Auto-Generated Compliance Websites
### Version 1.0 — Feb 26, 2026

> **Dependencies:** Consumes generated artifacts from PRD_02 (Template Engine). The compliance site URL is submitted as the brand website in PRD_04 (Twilio Submission). The site must be live and accessible before the Twilio brand registration is submitted.

---

## 1. OVERVIEW

The compliance site generator takes the artifacts from PRD_02 and deploys a minimal, professional static website at `{slug}.{compliance_domain}`. This site exists to satisfy carrier review requirements during 10DLC registration. It must contain a privacy policy with the mandatory mobile data clause, terms of service with messaging disclosures, an SMS opt-in form with all required elements, and basic business information.

### Why this matters
Missing or non-compliant websites are the #1 cause of 10DLC registration rejections. Most vibe coders building their first app don't have a live website with a privacy policy, let alone one with carrier-specific language. This component eliminates that blocker entirely.

### What reviewers check
- Site is live and loads (no 404, no "coming soon")
- HTTPS enabled
- Privacy policy exists and contains mobile data non-sharing language
- Terms of service exist and reference messaging program
- Opt-in mechanism is visible with all required disclosure elements
- Business name on site matches brand registration
- Contact information is present
- No SHAFT-C content (Sex, Hate, Alcohol, Firearms, Tobacco, Cannabis)
- No broken links

### Design principles
- **Minimal but professional** — clean typography, adequate whitespace, no stock photos
- **Fast** — static HTML/CSS, no JavaScript frameworks, sub-1-second load
- **Looks like the customer's site, not RelayKit's** — no RelayKit branding anywhere visible
- **Mobile responsive** — reviewers may check on mobile
- Subtle "Powered by RelayKit" in footer — small, gray text, links to relaykit.com (this is our only marketing presence and can be removed if customer objects)

---

## 2. SITE STRUCTURE

### Pages
```
{slug}.{compliance_domain}/
├── index.html          # Home — business info + navigation
├── privacy.html        # Privacy policy (from PRD_02 Section 6)
├── terms.html          # Terms of service (from PRD_02 Section 7)
└── sms.html            # SMS opt-in page (from PRD_02 Section 8)
```

### URL examples
```
https://petbook.smsverified.com/
https://petbook.smsverified.com/privacy
https://petbook.smsverified.com/terms
https://petbook.smsverified.com/sms
```

### Navigation
Simple top nav bar on all pages:
```
{business_name}    |    Privacy Policy    |    Terms of Service    |    SMS Updates
```

---

## 3. PAGE SPECIFICATIONS

### 3.1 Home Page (index.html)

**Purpose:** Establish that this is a real business with real contact information.

**Content:**
```
[Nav bar]

{business_name}
{business_description}

Contact Us
Email: {contact_email}
Phone: {contact_phone}
Address: {address_full}

[Footer]
```

**Layout:**
- Business name as h1, large and centered
- Description as subtitle paragraph
- Contact info section below, left-aligned
- Clean, generous spacing
- No images required

### 3.2 Privacy Policy (privacy.html)

**Purpose:** Satisfy carrier requirement for a compliant privacy policy containing mandatory mobile data non-sharing language.

**Content:** Full privacy policy text from PRD_02 Section 6, rendered as formatted HTML.

**Layout:**
- Page title: "Privacy Policy"
- Effective date shown below title
- Body text with proper heading hierarchy (h2 for sections)
- Readable line length (max-width: 720px)

**Critical:** The mobile data non-sharing section must be present and visible. Do not collapse it, hide it in an accordion, or place it in a tooltip.

### 3.3 Terms of Service (terms.html)

**Purpose:** Satisfy carrier requirement for terms that reference the messaging program.

**Content:** Full terms of service text from PRD_02 Section 7, rendered as formatted HTML.

**Layout:** Same as privacy policy page.

### 3.4 SMS Opt-In Page (sms.html)

**Purpose:** Demonstrate a compliant opt-in mechanism to carrier reviewers. This is the most scrutinized page.

**Content (from PRD_02 Section 8):**

```html
<h1>{heading}</h1>
<p>{subhead}</p>

<form>
  <label for="phone">Mobile phone number</label>
  <input type="tel" id="phone" name="phone" placeholder="(555) 123-4567" />
  
  <label class="checkbox-label">
    <input type="checkbox" id="consent" name="consent" /> <!-- UNCHECKED -->
    <span>{consent_checkbox_text with clickable links to /privacy and /terms}</span>
  </label>
  
  <button type="submit" disabled>Subscribe</button>
  <!-- Button disabled until checkbox is checked -->
  
  <p class="fine-print">{fine_print}</p>
</form>
```

**Behavior:**
- Form submission does NOT actually work in v1. When submitted, show a message: "Thank you! You've been subscribed to {use_case_label} from {business_name}."
- This is a demonstration form for carrier review purposes. Actual opt-in handling will be part of the customer's own app.
- Submit button is disabled until the consent checkbox is checked (minimal JS)
- Phone number field has basic formatting (parentheses, dash) on input

**Critical compliance elements (all must be visible near the phone field):**
1. ✅ Brand name (`{business_name}`)
2. ✅ Message types (`{use_case_label}`)
3. ✅ Frequency (`{message_frequency}`)
4. ✅ "Message and data rates may apply"
5. ✅ HELP instructions
6. ✅ STOP instructions
7. ✅ Links to privacy policy and terms of service

**What reviewers will reject:**
- ❌ Pre-checked checkbox
- ❌ Consent language hidden in popup or tooltip
- ❌ Missing any of the 7 elements above
- ❌ Broken links to privacy or terms
- ❌ Phone field marked as required in a multi-purpose form (unless the form's sole purpose is SMS opt-in — which ours is, so required is acceptable here)

---

## 4. VISUAL DESIGN

### Design tokens (CSS variables)
```css
:root {
  /* Typography */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-size-base: 16px;
  --font-size-sm: 14px;
  --font-size-xs: 12px;
  --font-size-h1: 32px;
  --font-size-h2: 24px;
  --font-size-h3: 20px;
  --line-height: 1.6;
  
  /* Colors — neutral, professional, not branded */
  --color-text: #1a1a1a;
  --color-text-secondary: #6b7280;
  --color-bg: #ffffff;
  --color-bg-subtle: #f9fafb;
  --color-border: #e5e7eb;
  --color-link: #2563eb;
  --color-link-hover: #1d4ed8;
  --color-button: #111827;
  --color-button-text: #ffffff;
  --color-error: #dc2626;
  --color-success: #059669;
  
  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  
  /* Layout */
  --max-width: 720px;
  --nav-height: 64px;
}
```

### Typography
- Body: Inter 16px, line-height 1.6, color #1a1a1a
- H1: Inter 32px, font-weight 700
- H2: Inter 24px, font-weight 600
- Fine print: Inter 12px, color #6b7280
- Links: #2563eb, underline on hover

### Layout
- Max content width: 720px, centered
- Padding: 24px horizontal on mobile, 0 on desktop (content width handles it)
- Nav: full width, 64px height, business name left, links right
- Footer: full width, subtle top border, small text

### No external dependencies
- No Google Fonts CDN call (include Inter as base64 or use system fonts as fallback)
- No JavaScript frameworks
- No images (unless customer has a logo — future feature)
- Single CSS file inlined in each HTML page (or one shared stylesheet)
- Minimal JS only for: checkbox → button enable/disable, phone formatting, form submission message

---

## 5. DEPLOYMENT PIPELINE

### Architecture
```
Template Engine output (PRD_02)
          ↓
  HTML Generator (Node.js)
    - Renders 4 HTML pages from templates
    - Inlines CSS
    - Inserts all generated text content
          ↓
  Cloudflare Pages Deployment
    - Creates project via Cloudflare API (or uploads to existing project)
    - Custom domain: {slug}.{compliance_domain}
    - Auto-SSL enabled
          ↓
  Site live and accessible
          ↓
  URL stored in database → used in Twilio brand registration (PRD_04)
```

### Deployment method: Cloudflare Pages Direct Upload API

Use Cloudflare Pages Direct Upload to deploy static files without a git repo.

```typescript
// Pseudocode for deployment
async function deployComplianceSite(
  slug: string, 
  artifacts: GeneratedArtifacts,
  intake: IntakeData
): Promise<string> {
  
  // 1. Generate HTML files
  const pages = generateHtmlPages(artifacts, intake);
  // pages = { 'index.html': '...', 'privacy.html': '...', 'terms.html': '...', 'sms.html': '...' }
  
  // 2. Upload to Cloudflare Pages
  const projectName = `relay-${slug}`;
  
  // Create project if doesn't exist
  await cf.pages.projects.create({
    name: projectName,
    production_branch: 'main',
  });
  
  // Upload files as new deployment
  const deployment = await cf.pages.deployments.create({
    project_name: projectName,
    files: pages,
  });
  
  // 3. Set custom domain
  await cf.pages.domains.create({
    project_name: projectName,
    domain: `${slug}.${COMPLIANCE_DOMAIN}`,
  });
  
  // 4. Wait for deployment to be live (poll status)
  await waitForDeployment(deployment.id);
  
  // 5. Verify site is accessible
  const siteUrl = `https://${slug}.${COMPLIANCE_DOMAIN}`;
  await verifySiteIsLive(siteUrl);
  
  return siteUrl;
}
```

### DNS setup (one-time)
- Register compliance domain (e.g., `smsverified.com`)
- Add wildcard CNAME `*.smsverified.com` → Cloudflare Pages
- Or: use Cloudflare's custom domain feature per project

### Alternative: Vercel deployment
If Cloudflare Pages Direct Upload proves cumbersome, Vercel's API can also deploy static files with custom subdomains. The HTML generation step is identical — only the deployment target changes.

### Deployment timing
The compliance site MUST be live and returning 200 status before the Twilio brand registration is submitted. The orchestration sequence (PRD_04) must verify the site is accessible before proceeding.

---

## 6. HTML GENERATION

### Template approach
Four HTML template strings with placeholder variables. Variables are replaced with generated content from PRD_02. Each page is self-contained (CSS inlined or shared via `<link>`).

### Base HTML template (shared structure)
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{page_title} — {business_name}</title>
  <meta name="description" content="{page_description}">
  <style>
    /* All CSS inlined here — see Section 4 for design tokens */
    {css}
  </style>
</head>
<body>
  <nav>
    <div class="nav-inner">
      <a href="/" class="nav-brand">{business_name}</a>
      <div class="nav-links">
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
        <a href="/sms">SMS Updates</a>
      </div>
    </div>
  </nav>
  
  <main>
    {page_content}
  </main>
  
  <footer>
    <div class="footer-inner">
      <p>&copy; {current_year} {business_name}. All rights reserved.</p>
      <p class="powered-by">Powered by <a href="https://relaykit.com" rel="noopener">RelayKit</a></p>
    </div>
  </footer>

  {page_scripts}
</body>
</html>
```

### Page-specific content insertion

**index.html:**
```html
<h1>{business_name}</h1>
<p class="subtitle">{business_description}</p>

<section class="contact">
  <h2>Contact Us</h2>
  <p>Email: <a href="mailto:{contact_email}">{contact_email}</a></p>
  <p>Phone: {contact_phone}</p>
  <p>{address_full}</p>
</section>
```

**privacy.html:**
```html
<h1>Privacy Policy</h1>
<p class="meta">Effective Date: {current_date} | Last Updated: {current_date}</p>
{privacy_policy_as_html}
<!-- PRD_02 Section 6 markdown converted to HTML -->
```

**terms.html:**
```html
<h1>Terms of Service</h1>
<p class="meta">Effective Date: {current_date} | Last Updated: {current_date}</p>
{terms_of_service_as_html}
<!-- PRD_02 Section 7 markdown converted to HTML -->
```

**sms.html:**
```html
<h1>{opt_in_heading}</h1>
<p class="subtitle">{opt_in_subhead}</p>

<form id="sms-form" onsubmit="return handleSubmit(event)">
  <div class="form-group">
    <label for="phone">Mobile phone number</label>
    <input type="tel" id="phone" name="phone" 
           placeholder="(555) 123-4567" required>
  </div>
  
  <div class="form-group checkbox-group">
    <label>
      <input type="checkbox" id="consent" name="consent" 
             onchange="toggleSubmit()">
      <span>{consent_checkbox_text_with_links}</span>
    </label>
  </div>
  
  <button type="submit" id="submit-btn" disabled>Subscribe</button>
  
  <p class="fine-print">{fine_print}</p>
</form>

<div id="success-message" style="display:none;">
  <p>Thank you! You've been subscribed to {use_case_label} from {business_name}.</p>
</div>
```

**sms.html scripts:**
```html
<script>
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

// Basic phone formatting
document.getElementById('phone').addEventListener('input', function(e) {
  let v = e.target.value.replace(/\D/g, '').substring(0, 10);
  if (v.length >= 6) v = '(' + v.substring(0,3) + ') ' + v.substring(3,6) + '-' + v.substring(6);
  else if (v.length >= 3) v = '(' + v.substring(0,3) + ') ' + v.substring(3);
  e.target.value = v;
});
</script>
```

---

## 7. SITE VERIFICATION

Before proceeding to Twilio submission (PRD_04), the system must verify the compliance site passes basic checks.

### Automated verification checks
```typescript
async function verifySite(siteUrl: string): Promise<VerificationResult> {
  const checks = {
    // 1. Site loads
    home_200: await fetch(siteUrl).then(r => r.status === 200),
    
    // 2. All pages load
    privacy_200: await fetch(`${siteUrl}/privacy`).then(r => r.status === 200),
    terms_200: await fetch(`${siteUrl}/terms`).then(r => r.status === 200),
    sms_200: await fetch(`${siteUrl}/sms`).then(r => r.status === 200),
    
    // 3. HTTPS working
    is_https: siteUrl.startsWith('https://'),
    
    // 4. Privacy policy contains mandatory language
    privacy_has_mobile_clause: await fetch(`${siteUrl}/privacy`)
      .then(r => r.text())
      .then(t => t.includes('will not be shared with any third parties')),
    
    // 5. Opt-in page has checkbox
    sms_has_checkbox: await fetch(`${siteUrl}/sms`)
      .then(r => r.text())
      .then(t => t.includes('type="checkbox"')),
    
    // 6. No broken nav links (all relative links resolve)
    no_broken_links: true, // Verified implicitly by checks 1-4
  };
  
  const passed = Object.values(checks).every(v => v === true);
  return { passed, checks };
}
```

### If verification fails
1. Log the failure with details
2. Retry deployment once
3. If still failing, set registration status to `needs_attention` and alert Joel (manual intervention)
4. Do NOT proceed to Twilio submission with a broken site

---

## 8. SITE UPDATES

### When sites need updating
- Customer requests a change to their business description or contact info
- Template language is updated based on rejection feedback (affects all sites using that template version)
- Regulatory requirements change (new mandatory language)

### Update process
1. Re-run template engine with updated inputs
2. Re-generate HTML files
3. Deploy new version to same Cloudflare Pages project (overwrites previous)
4. Re-verify site

### Template versioning
Track which template version each site was generated from:
```sql
ALTER TABLE generated_artifacts ADD COLUMN template_version INTEGER DEFAULT 1;
```
When templates are updated, increment version. Dashboard (PRD_06) can flag customers on old template versions for bulk re-deployment if needed.

---

## 9. DATABASE ADDITIONS

```sql
-- Add to generated_artifacts table (defined in PROJECT_OVERVIEW)
ALTER TABLE generated_artifacts ADD COLUMN compliance_site_slug TEXT;
ALTER TABLE generated_artifacts ADD COLUMN compliance_site_deployed_at TIMESTAMPTZ;
ALTER TABLE generated_artifacts ADD COLUMN compliance_site_verified BOOLEAN DEFAULT false;
ALTER TABLE generated_artifacts ADD COLUMN template_version INTEGER DEFAULT 1;

-- Track deployment status
CREATE TABLE site_deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID REFERENCES registrations(id),
  slug TEXT NOT NULL,
  cloudflare_project_name TEXT,
  cloudflare_deployment_id TEXT,
  site_url TEXT NOT NULL,
  status TEXT NOT NULL, -- 'deploying', 'live', 'failed', 'updating'
  verification_result JSONB, -- results from verifySite()
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 10. COMPLIANCE DOMAIN DECISION

### Requirements
- Neutral domain that doesn't look like it belongs to RelayKit
- Short and professional
- Available for registration
- Suitable for wildcard subdomains

### Candidates (check availability during build)
1. `smsverified.com` — implies verification/trust
2. `appcompliance.com` — descriptive but long
3. `smspages.com` — short, descriptive
4. `msgsite.com` — very short
5. `textcompliance.com` — descriptive

### Decision: TBD — check domain availability during Day 1/2 and pick the best available option.

### Alternative approach
Instead of subdomains, use path-based routing on a single domain:
- `smsverified.com/petbook/`
- `smsverified.com/petbook/privacy`
- etc.

This avoids wildcard DNS but looks slightly less like the customer's own site. Subdomains are preferred if DNS setup is straightforward.

---

## 11. IMPLEMENTATION NOTES FOR CLAUDE CODE

### File structure
```
lib/
  compliance-site/
    generator.ts          # Main function: intake + artifacts → HTML files
    templates/
      base.ts             # Base HTML template with nav, footer
      home.ts             # Home page template
      privacy.ts          # Privacy policy page template
      terms.ts            # Terms page template  
      sms.ts              # Opt-in page template
      styles.ts           # CSS as a template string
    deploy.ts             # Cloudflare Pages deployment
    verify.ts             # Site verification checks
    slug.ts               # Slug generation and uniqueness check
```

### Key implementation details
- HTML generation is pure string interpolation — no server-side rendering framework needed
- Markdown-to-HTML conversion for privacy policy and terms: use a lightweight library like `marked` or hand-code the conversion since our templates have a fixed structure
- CSS should be inlined in each page's `<head>` for maximum reliability (no external stylesheet requests)
- Include Inter font as a system font stack fallback — don't load from Google Fonts CDN (avoids external dependency and potential load time issues during review)
- Each page should render in under 100ms and weigh under 50KB
- All links between pages should use relative paths (`/privacy`, `/terms`, `/sms`)
- The `robots.txt` should allow crawling (reviewers and automated tools may check)
- Include a basic `favicon.ico` (generic, not RelayKit branded) or omit — missing favicon won't cause rejection but generates console errors
