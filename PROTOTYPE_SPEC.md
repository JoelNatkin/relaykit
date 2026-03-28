# PROTOTYPE_SPEC.md — RelayKit
## Screen-Level Prototype Specifications
### Last updated: March 27, 2026

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

**Logged-out (marketing) nav:** RelayKit wordmark (left) → Use Cases (dropdown: Appointments → `/sms/appointments`) → Compliance (`/compliance`) → Sign in (right, opens sign-in modal). No Prototype badge. (D-118, updated March 27 2026)

**Logged-in (app) nav:** RelayKit wordmark (left) → "Your Apps" (plain text link to `/apps`, left-aligned after wordmark) → Sign out (right, toggles state + navigates to `/`). No Prototype badge, no pill styling.

Per-project tabs live exclusively in the app layout shell, not in top nav. (D-118)

**Breadcrumbs:** All marketing/public pages except Home have breadcrumbs. Styled: `text-sm text-text-tertiary`, " / " separator, last item is current page (not a link). 24px below nav (`mt-6`). Placement:
- Category landing (`/sms/appointments`): Home / Appointments — above hero, inside page content area.
- Messages page (`/sms/appointments/messages`): Home / Appointments / Messages — inside gray hero band as first element, `pt-6 pb-12` on band.
- Compliance (`/compliance`): Home / Compliance — above hero, inside page content area.

### Sign-In Modal

**File:** `prototype/components/sign-in-modal.tsx`
Two-step modal triggered by "Sign in" in top nav. Semi-transparent backdrop (`bg-black/50`). Max-width 400px. XClose button top-right. Escape key and backdrop click close without signing in. Body scroll locked when open.

**Step 1 (Email):** Mail01 icon (brand secondary), "Sign in to RelayKit" h2, "Enter your email and we'll send you a code." body, email input, "Send code" button. Button shows "Sending..." disabled state for 500ms before advancing.

**Step 2 (OTP):** Mail01 icon (success secondary), "Check your email" h2, shows submitted email. 6-digit OTP input boxes (auto-advance, paste support, backspace navigates back). Extra 16px margin above and below input row. "Resend code in 0:30" countdown → clickable "Resend code" when timer hits zero. "Use a different email" link returns to Step 1. Auto-submit when all 6 digits entered → `setLoggedIn(true)` + `router.push("/apps")`. Prototype hint: "(Prototype: any 6 digits will work)".

### State Switchers (Prototype Only)

Every page that has multiple lifecycle states includes small dropdown selectors (`text-xs text-text-quaternary`) for switching between states during development. Positioned LEFT of the status indicator (colored dot + label) with 40px gap (`ml-10`) between last switcher and status indicator. Native browser chevrons (no custom icons). These are prototype controls — production state comes from server data. Retain throughout prototype work; strip when porting to production.

### Footer

**File:** `prototype/components/footer.tsx`
Present on all marketing pages: Home, Category Landing, Messages, Compliance. Two-column grid: Product (How it works, Use cases, Compliance — clickable links) and Legal (Terms, Privacy, Acceptable Use — plain `<span>` text, not clickable, no pages exist yet). Copyright: "© 2026 RelayKit LLC" (D-195).

### Auth

Sign-in modal provides email → OTP flow (see Sign-In Modal above). "Sign out" in top nav calls `setLoggedIn(false)` + `router.push("/")`. Production uses email OTP (D-59).

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

**How it works pricing context:** "Free to build and test. $49 to register, $150 after approval, then $19/mo."

**Pricing:** Two cards — "Free" ($0 forever, 4 features at text-base) and "Go live" ($49 to register + $19/mo headline, bridge line: "$150 go-live fee" in semibold text-text-primary + "after approval. Full refund if not approved." in regular weight, 6 feature bullets including "No credit card to start building" and "Every message scanned — issues caught and fixed before they reach carriers" (D-241)). No per-card buttons. Single centered "Start building free →" CTA below both. Volume pricing note. (D-216, D-220)

**Why RelayKit / Problem framing / Footer:** Unchanged from prior session. Reassurance line ("No contracts. Cancel anytime. Your code stays yours.") before footer. Inline footer with scroll-to-section links.

### Category Landing — `/sms/[category]`
**File:** `prototype/app/sms/[category]/page.tsx`
**Status:** Stable (appointments only)

**Breadcrumb:** Home / Appointments (see Global Patterns > Breadcrumbs). No Appointments pill badge in hero — breadcrumb handles category identification.

**Subhead:** "Your AI coding tool builds the integration. RelayKit handles the carriers." (updated from prior copy)

**Pricing context line:** Below "See all appointment messages →" CTA link with `mt-5`. Styled: `text-base text-center text-text-tertiary`. "$49", "$150", and "$19/mo" in `font-semibold text-text-primary`. Full text: "Free sandbox. No credit card. $49 to register, $150 + $19/mo after approval."

**What you get cards (updated D-220, D-241):** Messages that get approved / A build spec your AI tool reads / Registration you don't touch / Compliance that runs itself. Section is a true full-width gray band (`bg-bg-secondary`) — outer page container is `py-16` with no max-width, content sections use `mx-auto max-w-4xl px-6`. Cards have `bg-bg-primary` to pop against gray. "Compliance that runs itself" card has extended description: original text + "Issues caught are fixed automatically — you get a heads-up, not an emergency." (D-241)

Below-hero message preview section with three style pills (Brand-first / Action-first / Context-first) and three sample message cards. Variable values render in `font-medium text-text-brand-tertiary`. Trigger lines use "Sent when..." format. Demonstrates anti-cookie-cutter strategy (D-91, D-106).

**Registration scope section (D-230, D-231):** Between "What you get" gray band and the "Preview the full message library" CTA band. Section eyebrow "Your registration" (brand purple, centered) + heading "What's included from day one." Two sub-sections (no bounding boxes, content breathes):
- "What your registration covers" — green `CheckCircle` items pulled from `USE_CASES[category].included`. Body text capped at `max-w-[600px]`.
- "Need marketing messages too?" — body text explaining separate registration + two example message cards (Promotional offer, Feedback request) using the same `interpolate()` + brand-purple variable styling as hero previews. EIN note: "Note: adding a marketing campaign requires an EIN. Sole proprietor registrations are limited to one campaign."

**Why registration matters FAQ:** Two cards (down from three): "Why can't I just register myself?" and "What happens after I'm approved?" Body text capped at `max-w-[600px]`.

### Public Messages Page — `/sms/[category]/messages`
**File:** `prototype/app/sms/[category]/messages/page.tsx`
**Status:** Stable

**This is the most important page in the product.** It's where strangers become users. The download happens here.

**Breadcrumb:** Home / Appointments / Messages — inside gray hero band as first element (see Global Patterns > Breadcrumbs). No Appointments pill badge — breadcrumb handles category identification.

**Hero:** Gray band (`bg-bg-tertiary`, `pt-6 pb-12`). H1 ("Appointment messages, ready to send.") with subhead grouped below ("Everything your AI coding tool needs to add SMS — in two files."). Desktop CTA right-aligned with "Free to build and test. No lock-in." below. Mobile CTA full-width after logos. Logo row (6 tools, 48px circles with `border-[#999999]`). Pricing context below logos: "Free sandbox, no credit card. $49 to register, $150 + $19/mo after approval." with line break before "You'll get two files and a sandbox API key." "How it works" link (Expand06 icon, brand purple semibold) opens full-page modal (D-218).

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

**How it works modal (D-218):** Full-page overlay (z-50, bg-white, overflow-y-auto). Sticky close button. Content: H1 "How it works" (text-3xl/4xl), subhead, "What you get" 4-card grid, pricing section in gray band (Free + Go live cards, $49 headline + $150 bridge line per pricing audit), "Why registration matters" FAQ, "Back to messages" CTA.

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

**Alerts switcher (D-239):** Third dropdown, only visible on Overview tab. Options: "Alerts on" (default) / "Alerts off". Controls `alertsEnabled` in session context. Used to test all three D-239 placements without going through the wizard.

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

**D-239 Compliance alerts toggle — three placements:**

*Placement 1 — Wizard inline card:* Between steps 1 and 2, only when step 1 is complete AND `alertsEnabled` is false. Light purple card (`bg-bg-brand-secondary`) with bell icon. Copy: "We'll text you if a message would get flagged by carriers — before it causes problems." Single "Enable" button (no Skip). Card uses the same flex+connector layout as stepper steps so the vertical progress line flows through it continuously. Enable sets `alertsEnabled=true`, shows 3-second confirmation ("Alerts on — we'll text [phone]"), then auto-dismisses.

*Placement 2 — Compliance header row:* Right-aligned on the "Message compliance" h2 row, between heading and the all clear/has issues dropdown. Alerts on: green 8x8 dot + "SMS alerts: On" (`text-sm text-tertiary`). Alerts off: amber 8x8 dot + "SMS alerts: Off" (`text-sm text-warning-primary`, clickable — sets `alertsEnabled=true`). Visible in Default and Approved states only (not Pending/Review).

*Placement 3 — Compliance empty state:* Below the shield icon. Alerts on: heading "Messages look good" + "No compliance issues. [br] We'll text you if anything changes." Alerts off: heading "Messages look good" + "No compliance issues." + "Want a text when we catch something? Enable alerts" (purple text link).

**Right column — registration sidebar card:**
Calm, persistent reminder — not a sales pitch. `rounded-xl bg-bg-tertiary p-6 md:sticky md:top-20`. No border. Content:
- Heading: "Ready to go live?" (`text-lg font-semibold`)
- Body: "Carrier registration takes a few days. Start now so you're live when your app is ready." + second paragraph (text-tertiary): "After approval, every message is scanned before delivery. Issues are fixed automatically." (D-241)
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

**Marketing upsell banner (D-254):** Between row 1 and compliance section. Contained message bar (border, info icon, heading + body, brand link, dismiss X). Only visible when "Has alerts" compliance view selected. Dismissible per session. Copy: "Want to send marketing messages?" + "Add marketing alongside your appointment reminders." + "Learn more →" button opens marketing modal.

**D-239 Compliance alerts on Approved empty state:** Same pattern as sandbox. Alerts on: heading "You're live and sending" + "Delivery is healthy. [br] We'll text you if anything changes." Alerts off: heading "You're live and sending" + "Delivery is healthy." + "Want a text when we catch something? Enable alerts" link. Alerts status indicator also shown on compliance header row (same as sandbox Placement 2).

**Marketing modal:** Full-screen overlay (z-50, bg-white, overflow-y-auto). Sticky header with state switcher (Info/In review/Active) + X close. Opened from Overview banner "Learn more →" and Messages tab marketing CTA. Content in Info state: gray hero band with headline/subhead/purple CTA at top → white pricing ($29 one-time / +$10/mo) → gray "Messages you'll unlock" band with style pills (Brand-first/Action-first/Context-first) and 3-column message cards (Discount offer, Re-engagement, Review request with personalized values) → white "How it works" numbered steps (1-2-3) → gray "How consent works" bullet list (max-w-500px centered) → white bottom CTA repeat. In review: hero CTA replaced by registration stepper card. Active: centered confirmation "Marketing messages are live" + link to Messages tab.

**File:** `prototype/components/marketing-modal.tsx`

---

### Messages Tab — `/apps/[appId]/messages`
**File:** `prototype/app/apps/[appId]/messages/page.tsx`
**Status:** Default state STABLE; Approved state DIFFERENTIATED (D-159)

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
- "Need marketing messages too?" marketing callout — updated copy: "Discount offers, re-engagement, birthday messages — add marketing alongside your appointment reminders." + "Learn more →" button opens marketing modal (D-254).

*Right column (sticky, `lg:top-20`):*
- "Opt-in form" (`text-lg font-semibold`) + body: "Carriers require an opt-in form before you can send messages. RelayKit generates and maintains yours."
- `CatalogOptIn` (preview only, no copy — D-173). Placeholder fields: "Enter name", "Enter phone" (D-190).

**All 5 registration states render the same content.** (D-170)

---

#### Pending / Changes Requested / Rejected states
All three states render the Default layout. Registration state doesn't change Messages tab content pre-approval (D-170).

#### Approved state (D-159, D-244)

**Differentiated from Default.** Key changes:
- **No Personalize button or slideout.** Personalization is locked after registration.
- **No metadata line.** Developer already knows their registration details from Overview/Settings.
- **Toolbar row:** Show template / Copy all controls LEFT-aligned (`flex items-center gap-5`), no `justify-between`. No Personalize button.
- **Registered values baked in:** Messages render in preview mode with registered values (GlowStudio, glowstudio.com, Beauty & wellness appointments) from `REGISTERED_VALUES` constant. `useEffect` forces preview mode and sets registered values on mount when `isApproved`.
- **Messages header copy:** "You're live. These are your registered messages — add new ones, adapt existing ones, or have your AI tool riff on them. Compliance scanning keeps everything clean."
- **Opt-in copy:** "Your registered opt-in form. RelayKit keeps it current with your compliance site."
- **Download button:** "Re-download RelayKit" (instead of "Download RelayKit").
- **Compliance status line:** Between playbook band and two-column layout. `pt-4 pb-2`, flex row. ShieldTick icon (`size-4 text-fg-success-primary`) + "All messages scanned before delivery. **2 issues caught and fixed this month.**" (mock data). Text-tertiary base, count in `text-text-secondary font-medium`. (D-241)
- AI commands, variant pills, message cards, marketing callout all unchanged from Default.
- No "registered" badges on individual message cards.

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

## Admin Dashboard (D-234)

Operator/admin dashboard at `/admin` — separate from customer-facing app. Same design system but distinct layout and context. All mock data, no backend.

### Admin Layout — `/admin/layout.tsx`
**File:** `prototype/app/admin/layout.tsx`
**Status:** Stable

**Sidebar:** 240px fixed width, `bg-gray-900` dark background, white text. Shield icon + "RelayKit Admin" header with border-b separator. Four nav links with active state highlighting (bg-gray-800): Control Room, Registrations, Customers, Revenue. "View as customer →" footer link to `/apps`.

**Main content:** `flex-1` with `bg-bg-primary`, `max-w-6xl px-8 py-8` inner container.

### Control Room — `/admin`
**File:** `prototype/app/admin/page.tsx`
**Status:** Stable

**Header:** "Control Room" h1 + subtitle. State switcher (Normal / Crisis) top-right. Manual review toggle (D-235) — purple toggle switch, defaults to Manual (on), shows "(reviewing before submission)" when active. Independent from state switcher.

**4 KPI cards** in responsive grid (`sm:grid-cols-2 lg:grid-cols-4`):
- **Platform Compliance:** Large % in green/amber, clean/blocked/warned breakdown, trend line
- **Active Customers:** Count, approved/sandbox/new breakdown
- **Registrations:** Pipeline count. Manual review on: shows "X awaiting your review" in brand purple + carrier review + submitted today. Manual review off: standard pipeline counts.
- **Revenue:** MRR figure, subscriptions/overage breakdown, trend

**State switcher modes:**
- Normal: 99.1% compliance, 23 customers, 4-5 pipeline, $2,847 MRR
- Crisis: 94.2% compliance (amber), 2 suspended customers, 7-9 pipeline, $2,614 MRR, downward trends in red

**Attention queue (D-238, D-242):** Below KPI cards. Monitoring feed with expandable inline detail. Severity dots (red/orange/yellow), customer name, issue description, timestamps. Compliance items show tier badge (Minor/Escalated/Suspended) and expand on click (one at a time). Non-compliance items (carrier suspension, registration rejection, payment) are static rows.

**Expanded compliance detail:**
- Tier badge (Minor = `text-text-tertiary`, Escalated = `text-text-warning-primary`, Suspended = `text-text-error-primary`)
- Context grid: message type, "Rewriting since [date] (N messages)" — no redundant Customer field
- Escalated: deadline countdown ("Day N of 30 — message suspends [date]"), original vs rewritten side by side, notification history
- Suspended: "Blocked since [date] — awaiting customer fix", blocked message only (no rewrite), notification history
- Minor: original vs rewritten side by side, no countdown
- Operator buttons (right-aligned): Dismiss, Change severity dropdown (Minor/Escalated/Suspended), Unsuspend (Suspended only)

**Queue items:** Normal mode: 6 items (1 Escalated PetPals, 1 Minor GlowStudio demo, 4 non-compliance). Crisis mode: 7 items (adds Suspended UrbanBites, promotes GlowStudio to Escalated). State switcher resets expanded state.

### Registration Pipeline — `/admin/registrations`
**File:** `prototype/app/admin/registrations/page.tsx`
**Status:** Stable

**Header:** "Registration Pipeline" h1 + subtitle.

**Filter pills:** Active (default, excludes Approved + Closed), Awaiting Review, In Carrier Review, Extended Review, Rejected, Closed (Declined + Abandoned), All, Approved. Count badges on each. Active pill: `bg-gray-900 text-white`.

**List view:** Each registration is a clickable row with: customer name + app name, time in status, use case pill (brand purple), status pill (color-coded), action link, expand chevron.

**Status colors:**
- Awaiting review: `bg-blue-100 text-blue-700`
- In carrier review: `bg-gray-100 text-gray-600`
- Approved: `bg-green-100 text-green-700`
- Rejected: `bg-red-100 text-red-700`
- Extended review: `bg-amber-100 text-amber-700`
- Declined / Abandoned: `bg-gray-200 text-gray-700`

**Submission tracking:** `attempt` field. Status pill shows "(2nd attempt)", "(3rd attempt)" suffix.

**10 mock registrations:** GlowStudio (awaiting, clean), TechRepair (awaiting, amber flag), FreshCuts (rejected 2nd attempt, red flag), PetPals (in review), YogaFlow (extended review), BookWorm (in review), QuickFix Auto (approved), MealPrep Pro (approved), CannaBliss (declined — cannabis gating), SpamKing (abandoned 3rd attempt — spam).

**Expanded detail — two-column grid:**
Left: Business Details. Editable fields (awaiting/rejected): name, address, phone, email, website — transparent inline inputs with bottom border on focus, blue dot indicator when modified. Read-only always: type, EIN.
Right: Campaign section — use case, message type pills, editable campaign description textarea (awaiting/rejected), compliance site link.

**AI pre-review (D-236) — traffic light system** (awaiting/rejected only):
- **Green:** Single line — green circle check + "Ready for submission". No box. (GlowStudio)
- **Amber:** Left-border callout (`border-l-amber-400 bg-amber-50`). Warning icon + one sentence. "✉ Email customer" button right-aligned. (TechRepair: website 404)
- **Red:** Left-border callout (`border-l-red-400 bg-red-50`). Alert icon + one sentence. Gray quoted block with AI suggested fix. "✉ Email customer" (secondary) + "✦ Apply fix" (primary, writes fix to description textarea) right-aligned. (FreshCuts: "same-day availability" flagged as promotional, suggests reframing as waitlist-triggered)

**Carrier rejection reason:** Red callout (`bg-red-50 border border-red-200`) above AI pre-review for rejected registrations.

**Sample messages:** Numbered labels ("1. Booking confirmation", "2. Appointment reminder"). Editable textareas on awaiting/rejected, read-only bubbles on other states.

**Action buttons (right-aligned, three patterns):**
- Awaiting review (green AI): "Submit to carrier" (primary) only
- Awaiting review (amber AI): "✉ Email customer" only (in AI callout)
- Rejected: "Resubmit to carrier" (primary) only — email is in AI callout above
- Extended review: "✉ Email customer" + "✉ Email carrier" (both secondary with mail icons)

**Terminal statuses (Declined/Abandoned):**
- Resolution section: gray callout with reason + refund status ("$49 refunded" in green, or "Process refund →" button)
- Email action section: expandable email preview with subject/body, "Send email" / "Cancel" buttons. Decline email: direct, respectful, specific reason. Closure email: we-tried tone, carrier feedback summary. "Not yet sent" indicator.

### Customer List — `/admin/customers`
**File:** `prototype/app/admin/customers/page.tsx`
**Status:** Stable
**Decision refs:** D-234

Table view of all customers — Joel's "see all customers at a glance" screen. Light background content area (matches Control Room and Registration Pipeline).

**Header:** "Customers" h1 + "{N} customers" subtitle count.

**Filter pills:** All (default), Sandbox, Pending, Active, Churned. Active pill: `bg-gray-900 text-white`. Inactive: `bg-gray-100 text-text-secondary`. Count shown after label. Same visual pattern as Registration Pipeline filters.

**Table:** Rounded border container (`border-gray-200`), `bg-gray-50` header row. 9 columns: Customer (name bold + app name secondary), Status (badge: gray sandbox, amber pending, green active, red churned), Use case, Registered (formatted date), Messages (this month, with locale formatting), Compliance (color-coded: green ≥95%, amber 80-94%, red <80%, gray dash for 0), Plan (Free / Go Live), MRR (dollar amount, dash for $0), Last activity (relative time).

**Sorting:** All columns sortable by click. Default: last activity descending (newest first). Active sort shows arrow indicator (↑/↓). Numeric columns default to descending, text columns to ascending.

**Row interaction:** Click navigates to `/admin/customers/[customerId]` via `useRouter`. Hover state: `bg-gray-50`.

**Responsive:** Compliance and MRR columns hidden below `lg` breakpoint.

**Mock data:** 12 customers. Reuses businesses from Registration Pipeline (GlowStudio, TechRepair Pro, FreshCuts, PetPals, CannaBliss, SpamKing, YogaFlow) plus new entries (Bella's Nail Studio, QuickFix Plumbing, FitZone Gym, Downtown Deli, UrbanBites). Statuses: 8 active, 1 pending, 1 sandbox, 2 churned.

### Customer Detail — `/admin/customers/[customerId]`
**File:** `prototype/app/admin/customers/[customerId]/page.tsx`
**Status:** Stable
**Decision refs:** D-234, D-193 (pricing)

Single-customer deep-dive — everything about one customer on one page. Max-width 900px. Light background.

**Back navigation:** "← Back to Customers" link at top → `/admin/customers`.

**Page header:** Customer name (h1) + app name (secondary). Right-aligned: use case category pill (`bg-gray-100`) + status badge (same colors as Customer List).

**Six vertically-stacked sections (in this order):**

1. **Registration Summary** — Two-column grid: business name, EIN (masked XX-XXX format), business type, website, phone, email. Below: registration status with date. "View in Registration Pipeline →" link (purple) shows for pending/review states only. Campaign description (if registered). Message type pills (`bg-gray-100 rounded-full`).

2. **Message Volume — Last 30 Days** — Four stat cards in a row: Sent (with daily avg sub-text), Delivered, Failed, Blocked (with "compliance" sub-text). Cards: `border-gray-200 rounded-lg p-4`. Empty state: "No messages sent yet."

3. **Compliance** — Large percentage with color coding + "compliance rate" label. Right side: flagged count with severity or "No compliance issues" (green). Empty state for sandbox/pending: "No messages sent yet — compliance tracking will begin after approval."

4. **Attention Items** — Severity-coded items matching Control Room format (colored dot + issue text + time + action link). Items in `bg-gray-50 rounded-lg` rows. Empty state: "No attention items — this customer is in good standing." (green text).

5. **Billing** — Two-column grid: Plan, Registration fee ("$49 paid [date]"), Go-live fee ("$150 paid [date]" for active, "$150 due on approval" for pending, "N/A" for sandbox), Monthly rate ($19/mo or $0), Payment status (green "Current" / red "Past due" / gray "N/A"), Current period, Messages this period, Overage.

6. **Recent Messages** — 20-row table (longest section, at bottom). Columns: Time, Recipient (masked •••-••-XXXX), Type, Preview (truncated ~60 chars), Status (colored dot: green delivered, red failed, yellow pending), Flag (only shows for non-clean: amber "warned", red "blocked" badges). Empty state: "No messages sent yet."

**Mock data mapping:** cust-1 → GlowStudio (active, high volume, 2 warned messages), cust-2 → TechRepair Pro (active, 1 blocked message, 1 attention item), cust-3 → FreshCuts (pending, no messages), cust-5 → QuickFix Plumbing (sandbox, empty). Unknown IDs fall back to GlowStudio.

### Placeholder Pages
- `/admin/revenue` — "Revenue & Metrics — coming soon"

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
│   ├── admin/
│   │   ├── layout.tsx                    # Admin sidebar layout (dark, 240px)
│   │   ├── page.tsx                      # Control Room (KPI cards + attention queue)
│   │   ├── registrations/page.tsx        # Registration Pipeline (list + expandable detail)
│   │   ├── customers/page.tsx            # Customer List (table, filters, sorting)
│   │   ├── customers/[customerId]/page.tsx # Customer Detail (6 sections, mock data by ID)
│   │   └── revenue/page.tsx              # Revenue & Metrics (placeholder)
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
| ~~Pricing inconsistency~~ | Resolved — $199 references updated to $49/$150 split across all prototype files (pricing audit, Mar 26 session). Only orphaned `shared.tsx` retains $199. | D-193, D-196 |
