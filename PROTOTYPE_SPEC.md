# PROTOTYPE_SPEC.md — RelayKit
## Screen-Level Prototype Specifications
### Last updated: March 25, 2026

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

**Hero:** Gray band (`bg-bg-tertiary`). H1 + subhead ("Two files. Your AI coding tool. A working SMS feature.") + AI tool logo row (6 tools, white circle backgrounds) + two CTA buttons ("Why RelayKit?" with white bg, "Pick your use case" purple). (D-219)

**How it works:** Three-step grid (Pick / Hand it to your AI / Go live). Followed by centered pricing context line.

**Pricing:** Two cards — "Free" ($0 forever, 4 features at text-base) and "Go live" ($199 to register + $19/mo, 6 features including split detail). No per-card buttons. Single centered "Start building free →" CTA below both. Volume pricing note. (D-216, D-220)

**Why RelayKit / Problem framing / Footer:** Unchanged from prior session. Reassurance line ("No contracts. Cancel anytime. Your code stays yours.") before footer. Inline footer with scroll-to-section links.

### Category Landing — `/sms/[category]`
**File:** `prototype/app/sms/[category]/page.tsx`
**Status:** Stable (appointments only)

**Subhead:** "Your AI coding tool builds the integration. RelayKit handles the carriers." (updated from prior copy)

**Pricing context line:** Between "See all appointment messages" CTA and "What you get" section: "Free sandbox. No credit card. $199 + $19/mo when you're ready to go live."

**What you get cards (updated D-220):** Messages that get approved / A build spec your AI tool reads / Registration you don't touch / Compliance that runs itself. Section wrapped in full-width gray band (`bg-bg-secondary`, viewport-width CSS trick). Cards have `bg-bg-primary` to pop against gray.

Below-hero message preview section with three style pills (Brand-first / Action-first / Context-first) and three sample message cards. Variable values render in `font-medium text-text-brand-tertiary`. Trigger lines use "Sent when..." format. Demonstrates anti-cookie-cutter strategy (D-91, D-106).

**Registration scope section (D-230, D-231):** Between "What you get" gray band and the "Preview the full message library" CTA band. Section eyebrow "Your registration" (brand purple, centered) + heading "What's included from day one." Two sub-sections (no bounding boxes, content breathes):
- "What your registration covers" — green `CheckCircle` items pulled from `USE_CASES[category].included`. Body text capped at `max-w-[600px]`.
- "Need marketing messages too?" — body text explaining separate registration + two example message cards (Promotional offer, Feedback request) using the same `interpolate()` + brand-purple variable styling as hero previews. EIN note: "Note: adding a marketing campaign requires an EIN. Sole proprietor registrations are limited to one campaign."

**Why registration matters FAQ:** Two cards (down from three): "Why can't I just register myself?" and "What happens after I'm approved?" Body text capped at `max-w-[600px]`.

### Public Messages Page — `/sms/[category]/messages`
**File:** `prototype/app/sms/[category]/messages/page.tsx`
**Status:** Stable

**This is the most important page in the product.** It's where strangers become users. The download happens here.

**Hero:** Gray band (`bg-bg-tertiary`). Appointments pill + H1 ("Appointment messages, ready to send.") with subhead grouped below ("Everything your AI coding tool needs to add SMS — in two files."). Desktop CTA right-aligned with "Free to build and test. No lock-in." below. Mobile CTA full-width after logos. Logo row (6 tools, 48px circles with `border-[#999999]`). Pricing context below logos: "Free sandbox, no credit card. $199 + $19/mo when you're ready to go live." with line break before "You'll get two files and a sandbox API key." "How it works" link (Expand06 icon, brand purple semibold) opens full-page modal (D-218).

**Playbook summary (D-217, D-224):** Between hero and messages. `bg-bg-secondary` band. Heading "Your complete appointment SMS system" + horizontal flow with 6 numbered nodes (24px filled purple circles, white numbers, CSS hover tooltips) connected by arrows. Labels left-aligned, max-width ~90px. Vertical stepper on mobile. Tagline "One prompt. Your AI tool builds the whole flow." Data in `PLAYBOOK_FLOWS` keyed by category. Node order: 1 Booking confirmed, 2 Reminder sent, 3 Pre-visit sent, 4 Reschedule handled, 5 No-show followed up, 6 Cancellation handled (D-223).

**Layout:** StepsLayout is the default (D-113). Two-column grid (`lg:grid-cols-[1fr_376px]`) — messages on left (`max-w-[500px]`), opt-in on right. Old layout preserved at `?layout=default`.

**Post-download AI prompts band (D-182):** Appears between playbook and messages after user dismisses the "just the files" confirmation modal (`hasDownloaded` state flag). Contains AI prompt cards and interactive tool selector. Only triggered by "just the files" path.

**Left column — Messages:**
- "Messages" h2 + body copy: "Every message is pre-written for your use case and formatted for carriers. Copy them, adapt them, or let your AI tool use them as a starting point."
- Style variant pills (Brand-first / Action-first / Context-first / Marketing with ArrowDown icon) — `flex-wrap` with `whitespace-nowrap` for mobile wrapping. Marketing pill scrolls to marketing section.
- Toolbar row (`mb-3`): Left: "Personalize" (brand purple semibold, Sliders04 icon — opens slideout). Right: "Show template"/"Show preview" toggle + "Copy all". (D-185)
- Default view: template mode — variables render as brand-purple inline text (D-187). Clicking "Show preview" with empty personalization opens slideout (D-188).
- 6 numbered `CatalogCard` components (D-223) — brand purple number to left of title, no checkboxes (D-171), "Modify with AI ›" expander per card (D-174). Order: 1 Booking confirmation, 2 Appointment reminder, 3 Pre-visit instructions, 4 Reschedule notice, 5 No-show follow-up, 6 Cancellation notice.
- "Need marketing messages too?" marketing callout

**Personalization slideout (D-184):** Unchanged from prior session.

**Right column (sticky, `lg:top-20`):**
- "Opt-in form" (`text-lg font-semibold`) + body: "Carriers require an opt-in form before you can send messages. RelayKit generates and maintains yours."
- `CatalogOptIn` (preview only, no copy — D-173). Placeholder fields: "Enter name", "Enter phone" (D-190).

**Logo circles:** White backgrounds (`bg-white`) on hero logo row (D-227).

**"Learn more about RelayKit →"** link below marketing section, before footer.

**How it works modal (D-218):** Full-page overlay (z-50, bg-white, overflow-y-auto). Sticky close button. Content: H1 "How it works" (text-3xl/4xl), subhead, "What you get" 4-card grid, pricing section in gray band (Free + Go live cards, $199 headline per D-216), "Why registration matters" FAQ, "Back to messages" CTA.

**Download modal:** Unchanged from prior session.

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

**Layout structure (D-221):** Outer wrapper is full-width (no max-w constraint). App identity in `mx-auto max-w-5xl px-6`. Tab bar: full-width `border-b` wrapper with tabs inside `mx-auto max-w-5xl px-6`. Page content in `mx-auto max-w-5xl px-6 pt-6 pb-16`. This allows child pages to break out to full viewport width (e.g., Messages tab playbook gray band).

**Tab bar hidden on registration flow:** When pathname includes `/register`, the tab bar is hidden entirely. Registration is a focused flow with its own "← Back to Overview" navigation.

**Logged-in state forced:** Layout calls `setLoggedIn(true)` on mount via `useEffect`, ensuring top nav shows "Your Apps" and "Sign out" instead of logged-out version.

---

### Overview — `/apps/[appId]/overview`
**File:** `prototype/app/apps/[appId]/overview/page.tsx` + `approved-dashboard.tsx`
**Status:** Stable across all states (restructured D-233)

Conditional render: `isApproved ? <ApprovedDashboard /> : <SandboxDashboard />`

#### Non-Approved States (Default, Pending, Changes Requested, Rejected)

**Layout:** Two-column grid `md:grid-cols-[1fr_320px]` with `gap-6 md:gap-10`. Left column max-width 560px. Stacks on mobile below `md:` breakpoint.

**Left column — Sandbox compliance card + Build steps:**

**Sandbox compliance card (D-233):** `rounded-xl border` card at top of left column, visible in all non-approved states. Matches Approved dashboard card style:
- "COMPLIANCE" heading (`uppercase tracking-wide text-text-tertiary`)
- Large metric: "100%" green (all clear) or "97.2%" amber (has issues)
- "compliance rate" label
- All clear: green dot + "All clear"
- Has issues: two alert rows with red/amber dots + "Fix →" links opening detail modal (`bg-black/50` backdrop)
- "36 messages sent in sandbox" in small gray text
- Prototype state switcher (All clear / Has issues) wired to session context `complianceView`

**"Build your SMS feature" expander:** Single section with chevron toggle (no checkbox — removed). Heading row only, no badge. Content at `pl-4 pt-3` for breathing room from heading and left edge.

**Onboarding steps (4 steps):**
1. Verify phone — framed as "Where should test messages go?" (D-96)
2. Send test message from dashboard UI
3. Send message from own code — pre-filled Node.js script, collapsed by default. Copy button copies full script. Troubleshooting in collapsible expander (D-127). Completion button: "I got the message ✓" (D-128).
4. Build full SMS feature using downloaded files with AI coding tool

Steps unlock sequentially. Each completed step shows "Redo" link (D-133). Phone number changes in Step 1 trigger amber warnings on Steps 2 and 3.

**Right column — registration sidebar card:**
Calm, persistent reminder — not a sales pitch. `rounded-xl bg-bg-tertiary p-6 md:sticky md:top-20`. No border. Content:
- Heading: "Ready to go live?" (`text-lg font-semibold`)
- Body: "Carrier registration takes a few days. Start now so you're live when your app is ready."
- Pricing: "$49 to submit, $150 + $19/mo after approval" (`text-sm font-semibold`)
- Refund: "Not approved? Full refund." (`text-sm text-text-tertiary`)
- CTA: "Start registration →" — medium purple button (`px-4 py-2.5`), links to `/apps/[appId]/register`
- Pending/Changes Requested/Rejected states: sidebar transforms to status tracker with vertical stepper (unchanged from prior spec)

**Sections removed (D-233):** "Register your app" expander and "Monitor your compliance" expander removed from left column. Registration pitch lives in sidebar. Compliance visibility handled by sandbox compliance card.

#### Approved State — Operational Dashboard (D-150)
Unchanged from prior spec. Full-width 3×2 card grid, no right sidebar.

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

**Playbook summary (D-217, D-222, D-224):** Full-width gray band (`bg-bg-secondary`, `py-8`) immediately below tab bar — no gap. Contains `PlaybookSummary` component with `controlsSlot` prop. Layout top-to-bottom: heading ("Your complete appointment SMS system"), "AI tool setup ∨ | Download RelayKit" right-aligned on own line, 6-node numbered flow visualization (same as public page — 24px filled purple circles, white numbers, CSS tooltips, left-aligned labels), tagline. Content within `mx-auto max-w-5xl px-6`.

**AI tool setup panel** — toggled by the "AI tool setup" button (chevron rotates 180° when open). `isToolOpen` state in page component. Renders `<ToolPanel />` inside the gray band: 6-tool logo row (Code02 for "Other", D-192) + per-tool instruction + copyable command. Collapsed by default (D-160).

**Personalization slideout (D-184):** Unchanged — right-side overlay panel, identical to public page.

**Two-column layout** (`lg:grid-cols-[1fr_376px]`, `pt-6`) — messages left (`max-w-[500px]`), opt-in right:

*Left column — Messages:*
- "Messages" h2 + body copy: "Copy, adapt, or have your AI tool riff. RelayKit keeps them compliant."
- Style variant pills (Brand-first / Action-first / Context-first / Marketing with ArrowDown icon) — `flex-wrap` with `whitespace-nowrap`. Marketing pill scrolls to `#marketing-section`.
- Toolbar row (`mb-3`): Left: "Personalize" (brand purple semibold, Sliders04 icon). Right: "Show template"/"Show preview" toggle + "Copy all".
- Default view: template mode — variables render as brand-purple inline text (D-187).
- 6 numbered `CatalogCard` components (D-223) — brand purple number to left of title, no checkboxes (D-171), "Modify with AI ›" expander per card (D-174). Same order as public page.
- "Need marketing messages too?" marketing callout

*Right column (sticky, `lg:top-20`):*
- "Opt-in form" (`text-lg font-semibold`) + body: "Carriers require an opt-in form before you can send messages. RelayKit generates and maintains yours."
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
**Status:** Stable — full lifecycle state differentiation across all 5 states

**Layout:** 600px max-width, centered. Five card sections stack vertically (`space-y-6`). Sections appear/disappear based on `registrationState` from session context. All body text is 14px (`text-sm`). Section headers are 18px (`text-lg font-semibold`) — matching Messages tab headers. All action buttons/links right-aligned (`flex justify-end`).

**Phone label convention (D-207):** "Personal phone" (developer's own number), "Your SMS number" (dedicated campaign number, Approved only), "Sandbox phone" (not on Settings — Messages tab concept). Never bare "Phone."

---

#### Section 1: SMS Compliance Alerts (all states)
Toggle switch, **off by default** (D-201). Section header style (`text-lg font-semibold`): "SMS compliance alerts." `flex items-start justify-between gap-10` between text and toggle for minimum 40px spacing. Toggle off-state uses `gray-300` (`rgb(213 215 218)`) for visibility against white card background. Sub-copy: "Get a text when live messages are blocked or your content drifts from your registered use case. You'll always get email alerts." When on: "Alerts go to +1 (512) 555-0147" with "Edit" link (no-op — will link to account settings in production). When off: alert phone line hidden.

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
- No Plan row — pricing lives in Billing only (D-212)
- "View compliance site →" link (brand color, right-aligned, no-op)

**Rejected (D-206, D-214):**
- Status: red dot + "Not approved"
- Submitted → date, Reviewed → date
- "What was submitted" subsection: Business name, EIN (masked last 4: "••-•••4567"), Business address, Use case — all read-only
- Debrief box (`bg-bg-error-primary`, rounded, padded): bold "What happened" + mock rejection reason with actionable fix
- "$49 registration fee has been refunded" in `text-success-primary`
- "Start a new registration →" link (brand color, right-aligned, no-op)
- "Your sandbox is still active — your code and test environment aren't going anywhere."

#### Section 4: API Keys (all states — D-205, D-211)
Heading: "API keys." Sub-copy: "Your AI coding tool reads this key from your RelayKit files."

**Sandbox key (always visible — D-211):**
- Label: "SANDBOX" + green "Active" badge
- Monospace field: `rk_sandbox_rL7x9Kp2mWqYvBn4` + copy button
- No Regenerate link — sandbox keys are low-security, always visible and copyable

**Live key (Approved only — D-205):**
- Divider between sandbox and live
- Label: "LIVE" + green "Active" badge
- Masked field: `rk_live_••••••••••••••••••••` + copy button (visually disabled: `opacity-30 cursor-not-allowed disabled`, no click action when key is masked — activates after regeneration when new key is briefly visible)
- "Regenerate" link (right-aligned) → confirmation modal (destructive, warns key shown once and old key immediately invalidated)
- Muted note: "Live key is shown once when generated. Use Regenerate if you need a new one."

#### Section 5: Billing (all states — D-208, D-213)

- **Default:** Plan → "Sandbox — Free", muted "No credit card required."
- **Pending / Extended Review:** Registration fee → "$49 paid · date", Plan → "Sandbox — Free", "View account billing →" link (right-aligned)
- **Approved:** Plan → "$19/mo", Includes → "500 messages, then $15 per additional 1,000" (D-213), Next billing → date, "Manage billing →" link (right-aligned, would open Stripe Portal), separator, "Cancel plan" text link (right-aligned, text-tertiary, hover:text-error-primary). Cancel modal: "Cancel your plan" heading, sandbox continuity copy (D-153), "Keep plan" (grey) + "Cancel plan" (red). No guilt copy, no survey.
- **Rejected:** Registration fee → "$49 refunded · date", Plan → "Sandbox — Free"

#### Sections REMOVED
- **Developer tools** — Cut from Settings. Sandbox phone and "Send test message" move to Messages tab (D-203).
- **Portability ("Moving on?")** — Cut. Backlogged (D-204).

---

## Screens Not Yet Built

### Registration Form — `/apps/[appId]/register`
**File:** `prototype/app/apps/[appId]/register/page.tsx`
**Status:** Stable
**Decision refs:** D-225, D-233

Focused registration flow — tab bar hidden, "← Back to Overview" navigation. Left-aligned, `max-w-[640px]`.

**Header:** "Register your app" h2 + subhead: "We use these details to register your app with carriers. The more accurate this is, the faster you get approved."

**Info callout:** `bg-indigo-50` with info icon. Two sentences about carriers comparing registration against actual messages. No bold warnings.

**Form:** `BusinessDetailsForm` component with `useCase="appointments"`. Email pre-filled with `dev@glowstudio.com`. Prototype state switcher (Empty / Pre-filled) at top right — pre-filled uses full GlowStudio mock data. Form remounts via `key` prop when switching.

**Continue button:** Always active (never disabled). On click: if valid, stores form data in sessionStorage and navigates to review. If invalid, touches all fields (showing inline errors) and scrolls to top. Uses `touchAllRef` callback from form component.

**Copy refinements:** Business name placeholder "Your app or brand name", description example "Manages appointments and sends reminders for a hair salon", EIN helper "Must match the business name and address associated with this EIN", phone label "US mobile phone number", sole prop address label "Business address (sole proprietors can use a home address)" inline. Custom SVG chevrons on all select elements (`appearance-none` + background-image).

### Registration Review — `/apps/[appId]/register/review`
**File:** `prototype/app/apps/[appId]/register/review/page.tsx`
**Status:** Stable

Tab bar hidden. "← Back to business details" navigation. Reads form data from sessionStorage.

**Two-column layout:** Left: "Your details" card with business info rows + Edit button (navigates back to form). Right: compact "What happens next" card — three numbered steps (submit to carriers, get live key + number, swap sandbox for live).

**Bottom:** Pricing breakdown: "Registration submission $49 / Due today $49". Below: "After approval, pay $150 + $19/mo to activate your live API key and dedicated phone number. 500 messages included monthly. Additional messages $15 per 1,000. Not approved? Full refund." Monitoring consent checkbox. CTA: "Start my registration — $49".

### Compliance Modal Revision
**Status:** `[NEEDS REVISION]`

Current "Content blocked" modal has "Fix it with AI" section with copyable prompt — this is wrong (could generate messages outside registered set, causing drift). Replace with plain text guidance: two paths (remove promotional language, or register marketing campaign). Intelligence lives in SMS_GUIDELINES.md, not dashboard-generated prompts.

### Registration Components — `/registration-test`
**Files:** `prototype/components/catalog/registration-scope.tsx`, `prototype/components/registration/business-details-form.tsx`, `prototype/components/registration/review-confirm.tsx`
**Test route:** `prototype/app/registration-test/page.tsx`
**Status:** `[INTEGRATED INTO REGISTRATION FLOW]`
**Decision refs:** D-225

Components now integrated into `/apps/[appId]/register` and `/apps/[appId]/register/review` routes. Test route at `/registration-test` still available for standalone testing.

**Supporting libs:** `prototype/lib/intake/` — use-case-data.ts, validation.ts (Government added to business types), campaign-type.ts, industry-gating.ts, templates.ts. Pure logic, no component deps.

---

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
│   │       ├── layout.tsx                # App shell (name, pill, tabs, state switchers, logged-in force)
│   │       ├── page.tsx                  # Redirects to /overview
│   │       ├── overview/
│   │       │   ├── page.tsx              # Sandbox dashboard (compliance card + build steps + sidebar)
│   │       │   └── approved-dashboard.tsx # Full 3×2 card grid (Approved state)
│   │       ├── messages/page.tsx         # [IN PROGRESS] — state-based rendering needed
│   │       ├── register/
│   │       │   ├── page.tsx              # Registration form (BusinessDetailsForm)
│   │       │   └── review/page.tsx       # Review & confirm (ReviewConfirm)
│   │       └── settings/page.tsx         # 600px, 5 sections, full lifecycle state differentiation
│   ├── sms/[category]/
│   │   ├── page.tsx                      # Category landing (appointments)
│   │   └── messages/page.tsx             # Public messages page (steps layout default)
│   ├── registration-test/page.tsx         # Test route for imported registration components
│   └── c/[categoryId]/                   # ORPHANED — legacy catalog routes, safe to delete
├── components/
│   ├── top-nav.tsx                       # Context-aware nav (D-118)
│   ├── footer.tsx                        # Shared footer (D-121)
│   ├── category-modal.tsx                # Category picker
│   ├── catalog/                          # Message cards, opt-in form, registration-scope.tsx
│   ├── registration/                     # Imported registration components (D-225)
│   │   ├── business-details-form.tsx     # Full business details form with Zod validation
│   │   └── review-confirm.tsx            # Review & confirm with pricing modal
│   └── dashboard/                        # ORPHANED — old A/B/C variants, safe to delete
├── public/logos/                          # SVG logos for tool selector
├── context/session-context.tsx           # State management (+ registrationState, complianceView)
├── lib/
│   ├── catalog-helpers.ts                # Template interpolation
│   └── intake/                           # Imported intake logic (D-225)
│       ├── use-case-data.ts              # 9 use case definitions
│       ├── validation.ts                 # Zod schemas, formatters, field definitions
│       ├── campaign-type.ts              # Campaign type determination
│       ├── industry-gating.ts            # 3-tier industry detection
│       └── templates.ts                  # Campaign description + sample message generation
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
| Registration form pre-fill: "Pre-filled" state may not auto-validate EIN path fields | Touch-all ref validates on click, but initial mount may not trigger | Register page |
| Pricing inconsistency: public pages may still show $199 in some places | Need audit of all pricing references | D-193, D-196 |
