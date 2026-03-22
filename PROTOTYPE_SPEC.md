# PROTOTYPE_SPEC.md — RelayKit
## Screen-Level Prototype Specifications
### Last updated: March 20, 2026

> **How this file works:**
> - This document captures what each prototype screen looks like, how it behaves, and why — at a level of detail that lets CC rebuild any screen from this spec alone.
> - It is the bridge between prototype code (the UI source of truth) and production builds.
> - Updated as screens stabilize, not after every tweak. If a screen is actively being reworked, mark it `[IN PROGRESS]`.
> - DECISIONS.md captures *what* was decided and *why*. This file captures *what it looks like* and *how it works*.
> - CC should read relevant sections of this file before building or modifying any screen.
> - When porting to production, CC builds from this spec + the prototype code, not from PRDs.

---

## Global Patterns

### Navigation

**Logged-out top nav:** Home | Appointments | Messages | Sign in
**Logged-in top nav:** Your Apps | Sign out
Per-project tabs live exclusively in the app layout shell, not in top nav. (D-118)

### State Switchers (Prototype Only)

Every page that has multiple lifecycle states includes a small dropdown selector (text-tertiary, text-sm) for switching between states during development. These are prototype controls — production state comes from server data. Retain these throughout prototype work; strip when porting to production.

### Auth

Fully mocked in prototype. "Sign in" toggle in top nav flips `isLoggedIn` in session context. No Supabase integration. Production uses email OTP (D-59).

### Design System

Plain Tailwind with Untitled UI semantic color tokens. No Untitled UI base components imported in prototype. All semantic colors (`text-primary`, `bg-secondary`, `border-brand`, etc.) per CLAUDE.md design system rules. Icons from `@untitledui/icons`. Note: `ShieldCheck` does not exist — use `ShieldTick`.

### Data

All data is mocked. Session context provides state management. localStorage key: `relaykit_personalize` (messages page personalization). sessionStorage key: `relaykit_prototype` (session context).

---

## Public Pages (No Auth Required)

### Marketing Home — `/`
**File:** `prototype/app/page.tsx`
**Status:** Stable

Standard marketing landing page. Has its own inline footer (not the shared Footer component) with scroll-to-section links.

### Category Landing — `/sms/[category]`
**File:** `prototype/app/sms/[category]/page.tsx`
**Status:** Stable (appointments only)

Below-hero message preview section with three style pills (Brand-first / Action-first / Context-first) and three sample message cards. Variable values render in `font-medium text-text-brand-tertiary`. Trigger lines use "Sent when..." format. Demonstrates anti-cookie-cutter strategy (D-91, D-106).

### Public Messages Page — `/sms/[category]/messages`
**File:** `prototype/app/sms/[category]/messages/page.tsx`
**Status:** Stable

**This is the most important page in the product.** It's where strangers become users. The download happens here.

**Hero:** Integrated variant — CTA woven inline into subhead. References "two files" not "Blueprint" (D-109). Single CTA: "Download RelayKit" (D-108). At the bottom of the grey hero band: static logo row — 6 tool logos (Claude Code, Cursor, Windsurf, GitHub Copilot, Cline, Other with Code02 icon) in 48px circles (`w-12 h-12`), names below. No interaction — credibility signal only. (D-180, D-192)

**Layout:** StepsLayout is the default (D-113). Two-column grid (`lg:grid-cols-[1fr_300px]`) — messages on left, opt-in on right (D-175). Old layout preserved at `?layout=default` (same structure).

**Post-download AI prompts band (D-182):** Appears between hero and messages content after user dismisses the "just the files" confirmation modal (`hasDownloaded` state flag). Contains:
- Header row: "AI prompts" h2 left, "AI tool setup | Download RelayKit" brand-colored semibold links right
- Body: "Quick commands for your AI tool with RelayKit loaded in your project."
- 4 AI prompt cards (same as logged-in Messages tab): Compliance review, Write a message, Add a message type, Check opt-in copy
- Interactive tool selector below cards: 6 logos with selection state (purple border), per-tool instructions, copyable prompt snippet
- Only triggered by "just the files" path — "Create Account & Download" users go to Overview

**Left column — Messages:**
- "Messages" h2 + body copy: "Copy, adapt, or have your AI tool riff. RelayKit keeps them compliant."
- Style variant pills (Brand-first / Action-first / Context-first) with "Marketing messages" right-aligned (brand purple, ArrowDown icon, smooth-scrolls to marketing section). `mb-5` spacing below pills row. (D-185)
- Toolbar row (`mb-3`): Left: "Personalize" (brand purple semibold, Sliders04 icon — opens slideout). Right: "Show template"/"Show preview" toggle + "Copy all". (D-185)
- Default view: template mode — variables render as brand-purple inline text, not monospace (D-187). Clicking "Show preview" with empty personalization opens slideout (D-188).
- `CatalogCard` components — no checkboxes (D-171), "Modify with AI ›" expander per card (D-174), per-card preview toggle also opens slideout when empty (D-188)
- "Need marketing messages too?" marketing callout (`id="marketing-section-steps"`/`marketing-section-default`): white card backgrounds, copy: "Promos and offers require a separate registration. Get your first registration approved, then add marketing from your dashboard." (D-191)

**Personalization slideout (D-184):** Right-side overlay panel, slides from right. Title: "Personalize messages", body: "See how messages look with your details." Three fields: "App / business name" (placeholder "Enter business name"), "Website URL" (non-editable `https://` prefix, placeholder "Enter URL"), "Service type" (placeholder "Enter service type"). Fields start empty. Values persist to localStorage, update messages + opt-in live. (D-189)

**Right column (sticky, `lg:top-20`):**
- "Opt-in form" (`text-lg font-semibold` — peer-level with Messages h2, D-186) + body: "Carriers require an opt-in form before you can send messages. RelayKit generates and maintains yours."
- `CatalogOptIn` (preview only, no copy — D-173). Placeholder fields: "Enter name", "Enter phone" (D-190).

**Download modal:** Opens on "Download RelayKit" click. Two paths (D-114):
1. "Sign up & download" — email → 6-digit OTP → downloading confirmation. Benefits: sandbox access, personalized files, dashboard.
2. "Just the files, no account" — redesigned confirmation modal (D-181, D-183): green checkmark + "Your files are downloading" header, interactive tool selector with selection state and per-tool instructions, "Done" primary CTA (brand purple, full width), "You can find this again under Tool setup" muted note. Modal widens to `max-w-lg`.

**Shared footer:** Uses shared `Footer` component (D-121).

### Compliance Page — `/compliance`
**File:** `prototype/app/compliance/page.tsx`
**Status:** Placeholder

Public-facing compliance information page. Not yet fully designed.

---

## Authenticated Pages

### Your Apps — `/apps`
**File:** `prototype/app/apps/page.tsx`
**Status:** Stable

**Logged-in home page (D-94).** Grid of project cards. Each card: app name, category pill, status pill (Sandbox/Registered/Live), created date. Cards link to `/apps/[appId]/overview`. "Add new app" triggers streamlined category selection (D-100) — no marketing persuasion, just pick → name → verify → download.

### App Layout Shell — `/apps/[appId]/layout.tsx`
**File:** `prototype/app/apps/[appId]/layout.tsx`
**Status:** Stable

**Three tabs only: Overview, Messages, Settings.** (D-126 — Registration tab removed.)

**Header:** App name (h1) + category pill (purple, `bg-bg-brand-secondary text-text-brand-secondary`) on same line (D-134). No breadcrumb. No page-level h1 titles on individual pages — tab label serves as page identification (D-167).

**Contextual status indicator (D-176):** Right-aligned on the header row. Colored dot (8×8 `rounded-full`) + status text (`text-sm text-text-secondary`). States: green (#12B76A) "Your app is live" (approved), amber (#F79009) "Registration in review" (pending), red (#F04438) "Changes requested" / "Registration rejected", grey (#98A2B3) "Sandbox" (default). Visible on all tabs.

**State switcher:** Small dropdown after status indicator, right-aligned (D-138). Five states: Default, Pending, Approved, Changes Requested, Rejected.

**Compliance sub-switcher:** Second dropdown, only visible in Approved state (D-146). Options: "All clear" / "Has alerts."

**Period selector:** "This month" dropdown, right-aligned with `ml-auto` in tab row. Only visible when Approved + on Overview page. State lives in layout.tsx — display-only, doesn't change data. (D-150)

---

### Overview — `/apps/[appId]/overview`
**File:** `prototype/app/apps/[appId]/overview/page.tsx` + `approved-dashboard.tsx`
**Status:** Stable across all states

Conditional render: `isApproved ? <ApprovedDashboard /> : <ThreeSectionAccordion />`

#### Non-Approved States (Default, Pending, Changes Requested, Rejected)

**Layout:** Two-column. Left: three-section accordion. Right: persistent sidebar card.

**Three sections (D-132):**
1. **"Build your SMS feature"** — 4-step guided onboarding (D-119)
2. **"Register your app"** — Registration narrative + pitch (D-136)
3. **"Monitor your compliance"** — Placeholder cards (D-137)

Each section has checkbox heading — unchecked when incomplete, checked when done. First incomplete section auto-expands. Completing Section 1 auto-collapses it and auto-expands Section 2.

**Onboarding steps (Section 1):**
1. Verify phone — framed as "What number should we text?" (D-96)
2. Send test message from dashboard UI
3. Send message from own code — pre-filled Node.js script, collapsed by default showing first 4 lines (D-124). Copy button always copies full script. `to` pre-filled from Step 1, `body` from Step 2. Troubleshooting in collapsible expander (D-127). Completion button: "I got the message ✓" (D-128).
4. Build full SMS feature using downloaded files with AI coding tool

Steps unlock sequentially. Each completed step shows "Redo" link (D-133). Phone number changes in Step 1 trigger amber warnings on Steps 2 and 3.

**Right column — persistent registration action card (D-135):**
"Register your app" heading, intro paragraph, "Learn more →" link (placeholder), "Start registration →" primary CTA, pricing ($199 setup + $19/mo), refund guarantee (D-105), "We handle everything" checklist (4 items), "Takes just a few minutes" checklist (3 items). All purple checkmarks.

#### Default State
Standard three-section accordion. Section 1 expanded, others collapsed.

#### Pending State (D-140, D-141)
Section 2 replaces info cards with narrative: bold "Your registration is submitted," paragraph, "What carriers review" collapsed expandable (4 items), keep-building nudge. Badge: brand-colored "In review" — not amber/warning.
Right column transforms to status tracker: "Registration status" heading, badge, submitted date, timeline estimate with email notification, 6-step vertical stepper (submitted → payment → compliance site → carrier review → phone number → live), support contact (hello@relaykit.ai).

#### Changes Requested State (D-144)
Brand colors, not error colors. Resubmission is normal (~20-30%). Stepper gains "Resubmission under review" step. Left column: detail card (what flagged, what we did, what happens next).

#### Rejected State (D-145)
Badge: red "Not approved." Stepper shortened to 4 steps (red X on step 4). Refund line in green (`text-success-primary`) — "$199 refund issued." Detail card: what flagged, what this means, options. "Start new registration" loops to Default.

#### Approved State — Operational Dashboard (D-150)

**Layout:** Full-width 3×2 card grid. No right sidebar.

**Row 1 — KPI cards:**
- **Delivery:** 98.4% big number, delivered/failed/pending dot-separated stats, trend line
- **Recipients:** 284 big number, opt-outs/replies dot-separated, trend line (format matches Delivery)
- **Compliance:** 99.4% rate. Two modes:
  - "All clear": green, dot + "All clear", clean/blocked/warned breakdown
  - "Has alerts": amber, two alert summary rows with "Fix →" / "View →" links opening detail modal

**Row 2 — Detail/Chart cards:**
- **Usage & Billing:** 347/500 big number, progress bar (h-3), remaining count. Simplified: "Plan: $19/mo · 500 included"
- **Message Types:** Horizontal bar chart, 4 appointment types. Bar thickness matches progress bar.
- **Sending Patterns:** 24-bar hourly chart, quiet hours in amber. Label: "Peak: 2–4 PM · Quiet: 9 PM–9 AM"

**Alert detail modal:** Flagged message in code block, what triggered it, what to do, copyable AI prompt for fixing.

**Marketing upsell banner:** Between row 1 and row 2. Contained message bar (border, info icon, heading + body, brand link, dismiss X). Only visible when "Has alerts" compliance view selected. Dismissible per session.

---

### Messages Tab — `/apps/[appId]/messages`
**File:** `prototype/app/apps/[appId]/messages/page.tsx`
**Status:** Default state STABLE; registration lifecycle states not yet differentiated

**Signed up, pre-download:** `[NOT YET DESIGNED]` — Initial download happens on the public Messages page. Overview and Settings don't exist until project is created at download time (D-162).

---

#### Default state — post-download, pre-registration (STABLE)

**AI prompts section header row** (`flex items-center justify-between`):
- Left: `<h2>AI prompts</h2>` (`text-lg font-semibold text-text-primary`)
- Right: "AI tool setup" (with rotating chevron, `text-sm font-medium text-text-tertiary`) + pipe separator (`|`) + "Download RelayKit" — `gap-4` (D-177)
- Body copy: "Quick commands for your AI tool with RelayKit loaded in your project."

**AI prompts — 4-card grid** (`grid-cols-2 lg:grid-cols-4 gap-3 mb-8`):
- Cards: `rounded-lg border border-border-secondary bg-bg-primary p-4`
- Each card: 32×32 purple icon square (`h-8 w-8 bg-bg-brand-secondary rounded-lg`, icon `size-4`) + `text-sm font-semibold` heading + italic prompt text (`text-sm text-text-tertiary italic`) + clipboard copy button with tooltip "Copy prompt" (top-right, flips to green checkmark)
- Cards: ShieldTick / "Compliance review" — Edit03 / "Write a message" — MessagePlusSquare / "Add a message type" — ClipboardCheck / "Check opt-in copy"

**AI tool setup panel** — toggled by the "AI tool setup" button (chevron rotates 180° when open). `isToolOpen` state in page component. Renders `<ToolPanel />` below the card grid: 6-tool logo row (Code02 for "Other", D-192) + per-tool instruction + copyable command. Collapsed by default (D-160).

**Personalization slideout (D-184):** Right-side overlay panel, identical to public page. Title: "Personalize messages", body: "See how messages look with your details." Three fields with generic placeholders, URL field with `https://` prefix (D-189). Triggered by "Personalize" button in toolbar.

**Two-column layout** (`lg:grid-cols-[1fr_300px]`) — messages left, opt-in right (D-175):

*Left column — Messages:*
- "Messages" h2 + body copy: "Copy, adapt, or have your AI tool riff. RelayKit keeps them compliant."
- Style variant pills (Brand-first / Action-first / Context-first) with "Marketing messages" right-aligned (brand purple, ArrowDown icon, smooth-scrolls to `#marketing-section`). `mt-4 mb-5` spacing. (D-185)
- Toolbar row (`mb-3`): Left: "Personalize" (brand purple semibold, Sliders04 icon — opens slideout). Right: "Show template"/"Show preview" toggle + "Copy all". (D-185)
- Default view: template mode — variables render as brand-purple inline text, not monospace (D-187). Clicking "Show preview" with empty personalization opens slideout (D-188).
- `CatalogCard` components — no checkboxes (D-171), "Modify with AI ›" expander per card (D-174), per-card preview toggle also opens slideout when empty (D-188)
- "Need marketing messages too?" marketing callout (`id="marketing-section"`): grey section bg, white card backgrounds. Copy: "Promos and offers require a separate registration. Get your first registration approved, then add marketing from your dashboard." (D-191)

*Right column (sticky, `lg:top-20`):*
- "Opt-in form" (`text-lg font-semibold` — peer-level with Messages h2, D-186) + body: "Carriers require an opt-in form before you can send messages. RelayKit generates and maintains yours."
- `CatalogOptIn` (preview only, no copy — D-173). Placeholder fields: "Enter name", "Enter phone" (D-190).

**All 5 registration states render the same content.** (D-170)

---

#### Pending / Changes Requested / Rejected states
All three states render the Default layout. Registration state doesn't change Messages tab content pre-approval (D-170).

#### Approved state
`[NOT YET DIFFERENTIATED]` — Currently renders Default layout. Planned per D-159:
- Personalization fields read-only, showing registered values
- AI commands still available
- No "registered" badges on individual message cards

---

### Settings — `/apps/[appId]/settings`
**File:** `prototype/app/apps/[appId]/settings/page.tsx`
**Status:** Stable — full lifecycle state differentiation

**Layout:** 600px max-width, centered. Five card sections stack vertically. Sections appear/disappear based on `registrationState` from session context.

**Phone label convention (D-207):** "Personal phone" (developer's own number), "Your SMS number" (dedicated campaign number, Approved only), "Sandbox phone" (not on Settings — Messages tab concept). Never bare "Phone."

---

#### Section 1: SMS Compliance Alerts (all states)
Toggle switch, **off by default** (D-201). Heading: "SMS compliance alerts." Sub-copy: "Get a text when live messages are blocked or your content drifts from your registered use case. You'll always get email alerts." When on: "Alerts go to +1 (512) 555-0147" with "Edit" link (no-op — will link to account settings in production). When off: alert phone line hidden.

#### Section 2: Account Info (all states, fields vary — D-210)
`EditableField` component with one-field-at-a-time editing pattern (`editingField` shared state).

- **Default:** Email (editable), Personal phone (editable). No business name or category.
- **Pending / Extended Review / Approved / Rejected:** Business name (read-only, sub-text "Set during registration" — D-209), Email (editable), Personal phone (editable), Category (read-only, e.g., "Appointment reminders").

#### Section 3: Registration (Pending, Extended Review, Approved, Rejected only — not Default)

**Pending:**
- Status: amber dot + "In review"
- Submitted → date
- Estimated review → "2–3 weeks"
- Sub-copy: "Your sandbox is fully active while you wait."

**Extended Review** (internally `changes_requested` — D-202):
- Status: amber dot + "Extended review"
- Submitted → date
- Sub-copy: "The carrier asked for additional information about your registration. We're handling it — no action needed from you. We'll reach out if we need anything."

**Approved:**
- Status: green dot + "Active"
- Your SMS number → +1 (555) 867-5309 (mock)
- Approved → date
- Campaign ID → C-XXXXXX (mock)
- Plan → $19/mo
- "View compliance site →" link (brand color, no-op)

**Rejected (D-206):**
- Status: red dot + "Not approved"
- Submitted → date, Reviewed → date
- Debrief box (`bg-bg-error-primary`, rounded, padded): bold "What happened" + mock rejection reason
- "$49 registration fee has been refunded" in `text-success-primary`
- "Start a new registration →" link (brand color, no-op)
- "Your sandbox is still active — your code and test environment aren't going anywhere."

#### Section 4: API Keys (all states — D-205)
Heading: "API keys." Sub-copy: "Your AI coding tool reads this key from your RelayKit files."

**Sandbox key (always visible):**
- Label: "SANDBOX" + green "Active" badge
- Monospace field: `rk_sandbox_rL7x9Kp2mWqYvBn4` + copy button
- "Regenerate" link → confirmation modal (destructive)

**Live key (Approved only):**
- Divider between sandbox and live
- Label: "LIVE" + green "Active" badge
- Masked field: `rk_live_••••••••••••••••••••` — no copy button
- "Regenerate" link → confirmation modal (destructive, warns key shown once)
- Muted note: "Live key is shown once when generated. Use Regenerate if you need a new one."

#### Section 5: Billing (all states — D-208)

- **Default:** Plan → "Sandbox — Free", muted "No credit card required."
- **Pending / Extended Review:** Registration fee → "$49 paid · date", Plan → "Sandbox — Free", "View account billing →" link
- **Approved:** Plan → "$19/mo", Next billing → date, "Manage billing →" link (would open Stripe Portal), separator, "Cancel plan" text link (text-tertiary, hover:text-error-primary). Cancel modal: "Cancel your plan" heading, sandbox continuity copy (D-153), "Keep plan" (grey) + "Cancel plan" (red). No guilt copy, no survey.
- **Rejected:** Registration fee → "$49 refunded · date", Plan → "Sandbox — Free"

#### Sections REMOVED
- **Developer tools** — Cut from Settings. Sandbox phone and "Send test message" move to Messages tab (D-203).
- **Portability ("Moving on?")** — Cut. Backlogged (D-204).

---

## Screens Not Yet Built

### Registration Form with Live Preview
**Status:** `[NOT BUILT]`
**Decision refs:** D-156, D-161

Side-by-side layout: form fields on left, live message preview on right. Preview updates as developer types business name, URL, service type. Open question: how much of the form lives on this screen vs. spread across wizard steps.

### Compliance Modal Revision
**Status:** `[NEEDS REVISION]`

Current "Content blocked" modal has "Fix it with AI" section with copyable prompt — this is wrong (could generate messages outside registered set, causing drift). Replace with plain text guidance: two paths (remove promotional language, or register marketing campaign). Intelligence lives in SMS_GUIDELINES.md, not dashboard-generated prompts.

### Download Confirmation Flow
**Status:** `[NEEDS DESIGN]`

"You're in. Downloading RelayKit..." modal should guide users to Overview. Either auto-redirect or explicit "Go to Overview →" link. Users need to land in the build flow.

**CORRECTION (March 19, 2026):** Initial download always happens on the Messages page, not Overview. Overview and Settings pages don't exist until after download (project creation happens at download time). The confirmation flow should orient the user toward their new project's Overview page.

---

## File Map

```
prototype/
├── app/
│   ├── page.tsx                          # Marketing home
│   ├── compliance/page.tsx               # Public compliance page
│   ├── auth/page.tsx                     # Auth gate (mock)
│   ├── apps/
│   │   ├── page.tsx                      # Your Apps (project list)
│   │   └── [appId]/
│   │       ├── layout.tsx                # App shell (name, pill, tabs, state switchers, period selector)
│   │       ├── page.tsx                  # Redirects to /overview
│   │       ├── overview/
│   │       │   ├── page.tsx              # Conditional: approved dashboard OR three-section accordion
│   │       │   └── approved-dashboard.tsx # Full 3×2 card grid (Approved state)
│   │       ├── messages/page.tsx         # [IN PROGRESS] — state-based rendering needed
│   │       └── settings/page.tsx         # 600px, 5 sections, full lifecycle state differentiation
│   ├── sms/[category]/
│   │   ├── page.tsx                      # Category landing (appointments)
│   │   └── messages/page.tsx             # Public messages page (steps layout default)
│   └── c/[categoryId]/                   # ORPHANED — legacy catalog routes, safe to delete
├── components/
│   ├── top-nav.tsx                       # Context-aware nav (D-118)
│   ├── footer.tsx                        # Shared footer (D-121)
│   ├── category-modal.tsx                # Category picker
│   ├── catalog/                          # Message cards, opt-in form
│   └── dashboard/                        # ORPHANED — old A/B/C variants, safe to delete
├── public/logos/                          # SVG logos for tool selector
├── context/session-context.tsx           # State management (+ registrationState, complianceView)
├── lib/catalog-helpers.ts                # Template interpolation
└── data/messages.ts                      # Message library
```

---

## Known Issues & Inconsistencies

| Issue | Status | Ref |
|-------|--------|-----|
| `.next` cache corruption recurring | Workaround: delete before every restart | CC_HANDOFF gotcha #1 |
| D-17 override: Experience Principles line 88 says "5–7 days" | Needs doc fix | D-17 |
| Orphaned `/c/` routes and `components/dashboard/` files on disk | Safe to delete | CC_HANDOFF |
| "Appointments" pill hardcoded in layout.tsx | Needs dynamic category | CC_HANDOFF gotcha |
| Compliance modal "Fix it with AI" generates risky prompts | Needs revision | PM_HANDOFF item 2 |
| Bar thickness 8px consistency across row 2 cards | May need verification | PM_HANDOFF |
| Overview page `changes_requested` copy may still say "Changes requested" | Needs alignment with D-202 | CC_HANDOFF gotcha #18 |
