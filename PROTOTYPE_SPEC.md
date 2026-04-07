# PROTOTYPE_SPEC.md — RelayKit
## Screen-Level Prototype Specifications
### Last updated: April 7, 2026

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

## Wizard Entry Flow — `/start/*`

Six net-new pages that form the onboarding wizard (Steps 1–4 of WORKSPACE_DESIGN_SPEC.md). Standalone routes — live outside `/apps/` because the app identity does not exist yet. All `/start/*` pages render with a wordmark-only TopNav (no Sign in, no Your Apps, no Sign out). On `/start/*` routes after the picker, TopNav shows the selected vertical as a pill next to the wordmark (read from sessionStorage). The layout wrapper (`prototype/app/start/layout.tsx`) is a minimal min-h viewport wrapper.

### Shared components
- **`WizardStepShell`** (`prototype/components/wizard-step-shell.tsx`): centered `max-w-[540px]` column with top ← Back link (optional `backHref`), children, and full-width bottom Continue button. Continue is disabled when `canContinue=false`; `onBeforeContinue` fires to persist values before navigation; Back uses `router.push(backHref)`.
- **`wizard-storage`** (`prototype/lib/wizard-storage.ts`): sessionStorage helpers under key `relaykit_wizard`. `WizardData` fields: `vertical`, `businessName`, `industry`, `serviceType`, `website`, `context`, `verifiedPhone`, `ein`, `businessIdentity` (+ `VERTICAL_LABELS` id→label map).

### Step 1 — Vertical picker — `/start`
**File:** `prototype/app/start/page.tsx`
**Status:** Stable
- Full-height, flex-centered container. Heading: "What's the main reason your app sends texts?" (`text-2xl font-bold`, centered).
- 2-column grid (`sm:grid-cols-2`, `max-w-3xl`, `gap-4`) of 8 cards (Appointments, Verification codes, Order updates, Customer support, Marketing, Team alerts, Community, Waitlist). Each card: `@untitledui/icons` icon in `bg-bg-brand-secondary` rounded square, label (semibold), examples line (`text-text-tertiary`). Hover: `border-border-brand` + subtle shadow, icon container → `bg-bg-brand-primary`.
- Entire card is the click target — no "Explore →" CTA. Click saves `vertical` to sessionStorage and navigates to `/start/business`.

### Step 2 — Business name + EIN — `/start/business`
**File:** `prototype/app/start/business/page.tsx`
**Status:** Stable (includes EIN verification)
- Heading: "What's your business called?" Body: "You can change any of this later."
- **Business name input** (autoFocus, placeholder "Your business name"). Continue disabled until non-empty.
- **EIN section** below (D-302, D-303): Collapsed by default (transactional verticals) behind a brand-purple toggle link "I have a business tax ID (EIN)" with inline ⓘ info tooltip ("A 9-digit tax ID for your business. Entering one unlocks marketing messages and additional use cases."). Clicking expands the form via a `wizardFadeIn` keyframe (200ms). Expanded state shows the toggle replaced by a "Cancel" link (text-tertiary) inline after the "Business tax ID (EIN)" label — clicking collapses and clears all EIN state.
- **EIN input** (live-formatted `XX-XXXXXXX`) + inline purple "Verify" button (disabled until 9 digits). Verify triggers a two-phase stub: button reads "Verifying…" for 1s (primary lookup), then "Checking sources…" for 1.5s (AI deep dive), then resolves.
- **Verify states:**
  - `idle`: format error on blur if digits present but not 9 — "EIN should be 9 digits (XX-XXXXXXX)".
  - `verifying`: input disabled, button shows phase text.
  - `verified`: input+Verify row replaced by a bordered `bg-bg-secondary` card with legal name, address, entity type · state. Card top-right ✕ button dismisses (clears EIN, resets checkbox, refocuses input). Inside the card below a top border: "This is my business" checkbox with separate ⓘ tooltip ("Misrepresenting business identity will result in account termination.").
  - `failed` (transactional): single line — "We couldn't verify this EIN. You can try again or continue without it." Input + Verify button stay editable.
  - `failed` (marketing-primary): stricter copy + "Choose a different use case" link (navigates to `/start`).
- **Marketing-primary vertical:** section is expanded by default, no toggle trigger, no Cancel, no collapse. Helper line above label: "Marketing messages require a verified business identity." Continue stays disabled unless `einState === "verified"` AND checkbox checked.
- **Transactional Continue gating:** business name filled + not mid-verifying; if verified, also requires checkbox checked.
- **Prototype state cycler** (Default / Verified / Failed) — text-xs text-quaternary select in the label row when the EIN section is expanded. Seeds demo EIN values and jumps directly to the selected state.
- Unverified / failed EINs are never saved. Verified EINs + auto-populated identity persist to sessionStorage.

### Step 3 — Service context — `/start/details`
**File:** `prototype/app/start/details/page.tsx`
**Status:** Stable (appointments vertical only)
- Heading: "Tell us about your business" Body: "This helps us write messages that sound like they're from you."
- **Industry dropdown** (11 options: Salon & beauty, Dental, Medical, Fitness & wellness, Tutoring & education, Consulting, Auto service, Home services, Pet care, Photography, Other). Styled with `appearance-none` + custom SVG chevron background image + `pr-10` to match the registration form selects.
- **Service type text input** — appears after industry is selected via a `wizardFadeIn` keyframe animation (global in `globals.css`). Placeholder is industry-specific (e.g., Salon & beauty → "e.g., nail appointments, haircuts").
- Continue disabled until both fields have values.

### Step 3b — Website — `/start/website`
**File:** `prototype/app/start/website/page.tsx`
**Status:** Stable
- Heading: "Do you have a website?" Body: "We'll link to it in your messages so customers can find you online."
- URL input (autoFocus, placeholder "glowstudio.com"). Continue always enabled (field is optional). "Skip" link centered below the Continue button (`mt-3`, via `afterContinue` slot on WizardStepShell, D-329). Skip clears the stored website and advances.

### Step 3c — Context — `/start/context`
**File:** `prototype/app/start/context/page.tsx`
**Status:** Stable
- Heading: "Anything else we should know?" Body: "This helps us tailor your messages. You can always adjust later."
- 4-row textarea (optional). Continue always enabled. "Skip" link centered below the Continue button (`mt-3`, via `afterContinue` slot, D-329). Advances to `/start/verify`.

### Step 4 — Phone verification — `/start/verify`
**File:** `prototype/app/start/verify/page.tsx`
**Status:** Stable (D-331 — visual match with email verify)
- **Max width:** 400px (via `maxWidth` prop on WizardStepShell). Matches email verify page width.
- Heading: "Verify your phone number" Body: "Your phone is your test device for messages."
- **Three states:**
  - `input` / `sending`: `+1` prefix pill + phone input (live-formats digits to `(555) 123-4567`) + inline purple "Send code" button (disabled until 10 digits). On tap: 1.5s stub → `code` state.
  - `code`: "We sent a code to +1 (555) 123-4567. Use a different number" (inline link, same line). 6 OTP digit boxes (full-width `flex-1 min-w-0`, `gap-4`, `h-14` — matches email verify). Auto-advance, paste, backspace nav. Auto-submits on 6th digit. 60s resend cooldown below Continue button (via `afterContinue`): "Resend code in XXs" counting down → clickable "Resend code" at 0. Timer starts when code step begins, resets on click.
  - `done`: Green check + "Verified · +1 (555) 123-4567" card + "Change" link (resets to input state, clears stored phone).
- Continue disabled until verified. Advances to `/apps/glowstudio/messages` (hardcoded destination for prototype). Hydrates from sessionStorage on mount — returning via Back restores the Verified state.

### Prototype nav helper for /start
The `ProtoNavHelper` (bottom-left "Nav ↑" pill) is mounted globally and also includes jump links into the `/start/*` wizard pages for design review.

---

## Authenticated Pages

### Your Apps — `/apps`
**File:** `prototype/app/apps/page.tsx`
**Status:** Stable

**Logged-in home page (D-94).** Grid of project cards. Each card: app name, category pill, status pill (Sandbox/Registered/Live), created date. Cards link to `/apps/[appId]/overview`. "Add new app" triggers streamlined category selection (D-100) — no marketing persuasion, just pick → name → verify → download.

### App Layout Shell — `/apps/[appId]/layout.tsx`
**File:** `prototype/app/apps/[appId]/layout.tsx`
**Status:** Stable

**Two layout wrappers, one route tree.** Layout.tsx checks `registrationState` and renders either the **Wizard Layout** (Onboarding state) or the **Dashboard Layout** (all other states). Route redirects handle invalid state/page combos automatically.

#### Wizard Layout (Onboarding state)
**File:** `prototype/components/wizard-layout.tsx`

Minimal, focused layout for the pre-signup wizard flow.

**Top nav (rendered by TopNav, wizard-aware):** RelayKit wordmark + "Appointments" pill (left) → state switcher dropdown + onboarding nav dropdown (right). No "Your Apps" link, no Use Cases/Compliance links, no Sign out. TopNav detects the wizard context via pathname + registrationState — regex matches `/apps/[appId]/(messages|ready|signup(\/verify)?|get-started)$`. Sign out is hidden on all wizard-state pages.
**Onboarding nav dropdown:** Native `<select>` (`text-xs text-text-quaternary`) to the right of the state switcher. Label "Onboarding" (disabled default option). 11 numbered options covering the full wizard flow from vertical picker through get-started. Resets to label after navigation. Also appears on `/start/*` routes (right side of wordmark-only nav). Only visible when `registrationState === "onboarding"`.
**Continue button:** Absolutely positioned top-right (`absolute top-6 right-6`) so it doesn't push the content column down (D-330). Hidden when no `continueButton` is present.
**Back link:** Inside the centered content column (`mb-6`), left-aligned with headline and body text (D-330). Hidden when `backHref` is absent.
**Page config in `getPageConfig()`:** Messages has `/start/verify` Back (D-333) + `/ready` Continue + `continueLabel: "Continue"` (D-328) + dualContinue=true; ready has `/messages` Back + no header Continue (page owns its own CTA); signup paths return `backHref: null, continueHref: null` (pages manage their own inline Back links).
**Continue button customization:** Pages can override the header Continue button by consuming `WizardContinueContext` from `wizard-layout.tsx` and registering `{ onClick, disabled }`. WizardLayout renders: override button > static continueHref Link > nothing.
**Centered content:** `max-w-[540px] mx-auto` container.
**Bottom Continue:** When `dualContinue` is true (messages only, D-318), WizardLayout renders a second full-width Continue spanning the 540px content column below the content. Uses the same `continueLabel` as the header Continue.
**Not shown in wizard layout:** app name (h1), tabs, status indicator dot.

#### Dashboard Layout (Building, Pending, Registered, Extended Review, Rejected)
**File:** `prototype/components/dashboard-layout.tsx`

Full dashboard with app identity, tabs, and status.

**Header:** App name (h1) + category pill (purple) → state switcher dropdown (right) → status indicator dot+label (right of switcher, `ml-10` gap).
**Status indicator:** Colored dot (8×8 `rounded-full`) + status text. States: green (#12B76A) "Your app is live" (Registered), amber (#F79009) "Registration in review" (Pending) / "Extended review" (Changes Requested), red (#F04438) "Registration rejected" (Rejected). Building state shows no status indicator.
**Tab bar:** Overview, Messages, Settings. Active tab: `border-border-brand text-text-brand-secondary`. Hidden during registration flow (`/register`).
**Period selector:** "This month" dropdown in tab row, only when Registered + Overview.
**Content:** `mx-auto max-w-5xl px-6 pt-6 pb-16`.

#### State Switcher (both layouts)
Six states: Onboarding, Building, Pending, Extended Review, Registered, Rejected (D-324, D-325). `text-xs text-text-quaternary`. Switching from Onboarding to any other: wizard → dashboard, redirect if on overview/settings stays valid, wizard-only pages (ready/signup) get the transition redirect. Switching to Onboarding: dashboard → wizard, redirect if on overview/settings → messages.

#### Route Redirects
- **`/opt-in`:** Always redirects to `/messages` regardless of state. The opt-in step was removed from the wizard flow (D-317 tabled).
- **Onboarding (wizard):** `/overview` and `/settings` redirect to `/messages`. Valid wizard pages under `/apps/[appId]/`: `/messages`, `/ready`, `/signup`, `/signup/verify`.
- **Non-onboarding (dashboard):** `/signup`, `/signup/verify`, and `/ready` redirect to `/overview` (they are wizard-only). `/overview`, `/messages`, `/settings` are valid.
- **`/get-started`:** Excluded from both WizardLayout and redirect logic — renders standalone (no layout wrapper). Valid in Onboarding state. The page itself handles the state transition to Building (D-325).
- **Register flow:** No wrapper — content renders in bare `max-w-5xl` container.

#### Prototype Navigation Helper
**File:** `prototype/components/proto-nav-helper.tsx`
Floating "Nav ↑" pill (bottom-left, z-200). Expands to show jump links to every page in every state. Sets registration state and navigates in one click. Highlights current page/state. Only appears on `/apps/` routes. Strip when porting to production.

**Logged-in state forced:** Layout calls `setLoggedIn(true)` on mount via `useEffect`.

---

### Overview — `/apps/[appId]/overview`
**File:** `prototype/app/apps/[appId]/overview/page.tsx` + `approved-dashboard.tsx`
**Status:** Restructured (D-326, D-327) — accordion removed, Start building content across all non-Registered states

Conditional render: `isApproved ? <ApprovedDashboard /> : <two-column layout />`

#### Non-Registered States (Building, Pending, Extended Review, Rejected)
Note: Onboarding state redirects `/overview` → `/messages` — Overview is never rendered in Onboarding.

**Layout:** Two-column flex layout `flex-col md:flex-row gap-6 md:gap-16`. Left column `min-w-0 flex-1`. Right column `md:w-[280px] md:shrink-0`, `order-first md:order-last`. Stacks on mobile below `md:` breakpoint.

**Left column — Start building content (D-326, D-327):**
Same content across all non-Registered states. Replaces the former 4-step "Build your SMS feature" accordion.
- Heading: "Start building" (`text-2xl font-bold`)
- Body: "Everything your AI tool needs to build your SMS feature." (`text-sm text-text-tertiary`)
- **Tool logo farm** (`mt-4 mb-5`): 6 left-aligned logos (40px circles, `border border-[#c4c4c4] bg-white p-1`, `gap-3`): Claude Code, Cursor, Windsurf, GitHub Copilot, Cline, Other (Code02 icon fallback). Same assets as get-started page.
- **Three numbered cards** (`space-y-4`): Each `rounded-xl border border-border-secondary p-4` with label + CopyButton (Copy01 → Check 2s swap) + helper text (`text-xs text-text-quaternary`) + content block (`bg-bg-secondary rounded-lg px-3 py-2`):
  1. "1. Install RelayKit" / "Run this in your project's terminal." / `npm install relaykit`
  2. "2. Add your API key" / "Paste this prompt into your AI tool to add the key." / env text
  3. "3. Add SMS to your app" / "Paste this prompt into your AI tool to start building." / hardcoded Club Woman prompt

**Right column — registration sidebar card:**
`rounded-xl bg-gray-50 p-6 md:sticky md:top-20`. Content varies by state:
- **Building state (D-326):** "Ready to go live?" heading, body copy about carrier registration, "$49 registration + $19/mo" pricing, "Not approved? Full refund.", "Start registration →" CTA → `/apps/[appId]/register`.
- **Pending state:** Registration status tracker with vertical stepper (PENDING_STEPS).
- **Extended Review:** Status tracker with CHANGES_REQUESTED_STEPS.
- **Rejected:** Status tracker with REJECTED_STEPS + refund confirmation + "Start new registration" button (→ Building state).
- **Registered:** Completed status tracker with APPROVED_STEPS (not shown in two-column — Registered uses ApprovedDashboard).

#### Registered State — Operational Dashboard (D-150)

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

### Messages Page — `/apps/[appId]/messages`
**File:** `prototype/app/apps/[appId]/messages/page.tsx`, `prototype/components/catalog/catalog-card.tsx`
**Status:** REDESIGNED — Phase 2 card redesign + wizard skeleton (WORKSPACE_DESIGN_SPEC.md)

---

#### Layout

**Full-width layout (D-317):** No opt-in column. Messages get the full viewport. Opt-in form is a separate wizard step at `/apps/[appId]/opt-in`.

**Onboarding mode (Onboarding state — rendered inside WizardLayout, D-328):**
- Back (inside content column, D-330) navigates to `/start/verify` (D-333). Continue absolutely positioned top-right, labeled **"Continue"**.
- Heading: H1 "Here's what your app will send" (`text-2xl font-bold`).
- Body: "Each message is tailored to your business. Edit messages any time. Your app always sends the latest version." (`text-sm text-text-tertiary`).
- **"What about marketing messages?"** link below body text (`text-sm text-text-brand-secondary`, no underline, matching EIN link style on `/start/business`). Click toggles tooltip (dark bg, white text, `rounded-lg bg-[#333333]`). EIN-aware: reads wizard sessionStorage — if EIN provided: "You're all set to add marketing messages after you create your account. We'll walk you through it."; if no EIN: "Marketing messages require a business tax ID (EIN). You can add one anytime in settings to unlock them."
- Message cards fill the wizard container. **No send icons** — `hideSend={true}` on CatalogCard (D-328).
- Bottom "Continue": full-width purple button spanning the 540px content column, rendered by WizardLayout (D-318 — dual Continue).

**Dashboard mode (Building/Pending/Registered/Extended Review/Rejected — rendered inside DashboardLayout):**
- "Messages" heading (H2 `text-lg font-semibold`) left-aligned, no Continue buttons.
- Message cards constrained to `max-w-[540px]` within the `max-w-5xl` dashboard container.
- Send icons: `Phone01` from `@untitledui/icons` — no circle background. Standard dashboard treatment.

**Page-level controls removed (Phase 2a):**
- Global style pill bar — gone, pills live inside card edit state
- Personalize button + slideout — gone
- Show template / Show preview toggle — gone
- Copy all — gone
- Opt-in right column — gone (D-317, moved to own page)

---

#### CatalogCard — Default State

Each card shows the full message text, not truncated.

- **Title row:** Message name (bold) + info icon (i) inline with 1.5 gap after title + pencil edit button right-aligned. No card numbers. No template/preview toggle. No copy button. No "Modify with AI" in default state.
- **Tooltips:** Info icon, pencil, and phone buttons all use a custom dark tooltip matching styling: `rounded-lg bg-[#333333] px-3 py-2 text-xs text-white shadow-lg leading-relaxed pointer-events-none`, positioned above the button (`bottom-full mb-1`). Info tooltip anchors left; pencil and phone tooltips anchor right (`right-0`) to avoid overflowing the card.
- **Message text:** Full message below title. Variables highlighted in brand color (`text-text-brand-secondary`). Always shows interpolated preview with real values (GlowStudio, etc.), not raw template syntax. Clicking text enters edit state.
- **Send button:** Floats outside the card on the right side, vertically centered via `items-stretch` + `items-center` wrapper. Accepts optional `sendIcon` prop for context-specific icons and `hideSend` prop to remove entirely (D-328). Dashboard: `Phone01` icon (18px) with no circle background (`text-fg-tertiary hover:text-fg-secondary`). Onboarding wizard: hidden via `hideSend={true}`.
- **Marketing badge:** Shown on marketing-tier messages, same as before.
- **Card spacing:** `space-y-5` (20px) between cards.
- **Single-card editing:** Only one card can be in edit state at a time. `CatalogCard` accepts optional controlled props (`isEditing`, `onEditRequest`). When the parent provides them, clicking a new card's pencil closes any open edit — unsaved changes are discarded, no confirmation dialog. `savedText`/`savedPillId` persist across edit sessions. When props are absent, the card falls back to local state (used by the public messages page).

---

#### CatalogCard — Edit State

Triggered by edit button click or by clicking into the message text.

- **Title row:** Unchanged (name + info icon). Edit button hidden (already in edit mode).
- **Textarea:** Replaces static message text. Full-width, auto-height, body font (not monospace). Shows personalized values (GlowStudio, etc.), not raw `{var_name}` template syntax. 8px spacing (`mt-4`) between title row and textarea. Disabled during AI/Restore loading.
- **Send button:** Still available on the right during edit — developer can test changes before saving.
- **Compliance feedback** (below textarea, above pills): Runs on every keystroke via `useEffect` on editText. Non-compliant hint reveal is debounced 2s to avoid nagging mid-type. Once text becomes compliant, hint + Restore button hide immediately. Hint stack is right-aligned with 16px gap from the Restore button (`justify-end gap-4`); multiple issues stack vertically (`flex-col items-end`). Save is disabled while non-compliant or while AI/Restore loading.
  - **Opt-out check:** passes if text contains `STOP` (case-insensitive) AND one of `opt out` / `opt-out` / `unsubscribe`. Issue label: "Needs opt-out language".
  - **Variable deletion check:** for each `{var}` in `message.template`, substring-matches (case-insensitive) the interpolated demo value against the edited text. Missing variables are grouped via `VARIABLE_LABELS` (date/time/service_type → "appointment details", app_name → "business name", website_url → "website link", etc.). Issue label: "Needs {label}".
  - **Restore button:** clicking it replaces the entire textarea with the last canned pill's clean interpolated text (tracked via `lastCannedPillId`). This restores compliance wholesale rather than patching fragments (D-319). Button shows Spinner + "Restoring…" during 1.5s stubbed AI delay.
  - **Prototype stub** — production compliance is server-side with full TCPA/10DLC rule evaluation. Client-side checks are intentionally loose.
- **Edit controls panel** (bottom of card, no divider — `mt-3 space-y-3`):
  - **Style pills row:** Badge-styled (`rounded-full px-3.5 py-1.5`). Canned variants in left cluster: Standard, Friendly, Brief (labels display-only; ids still `standard` / `action-first` / `context-first` for data stability). Custom pill appears on the far right (`ml-auto`, dashed border) only after the developer has made a custom edit. Active: brand fill (`bg-bg-brand-secondary text-text-brand-secondary`). Canned pill taps swap textarea instantly — no preview, no Accept/Revert. Typing or AI help switches activePillId to Custom. `customTextBuffer` preserves custom text across pill clicks. Canned pill swaps are instant — pre-validated and zero-latency by design.
  - **AI help input:** Prefix Stars02 sparkle icon (brand color, swaps to Spinner while loading). Placeholder is contextual: canned pill active → "Ask AI: make it more casual"; Custom pill active → "Ask AI: polish my edit"; loading → "Rewriting…". Enter submits. 1.5s stubbed delay; on complete, textarea updates with rewritten text, activePillId → Custom. AI call is stubbed — no backend call yet.
- **Save / Cancel buttons:** Right-aligned at bottom of card. Save is primary purple, Cancel is tertiary text-only. Save disabled while non-compliant or during AI/Restore loading.

---

#### Pending / Changes Requested / Rejected states
All render the same Messages page content as Default/sandbox. Registration state doesn't change message card behavior.

#### Approved state
Same card redesign. Key differences:
- Registered values baked in (GlowStudio, glowstudio.com, etc.) — `REGISTERED_VALUES` constant sets personalization on mount.
- Messages header copy: "Your registered messages. Edit copy, add new messages, or adapt existing ones."
- No opt-in column (moved to own page). No Continue buttons in approved state.

---

### Opt-in Form Preview — `/apps/[appId]/opt-in`
**File:** `prototype/app/apps/[appId]/opt-in/page.tsx`
**Status:** REMOVED from wizard flow (D-317 tabled). All access redirects to `/messages` via AppLayout. The page file is retained — the component returns `null` and the original implementation is preserved inside a reference comment for future redesign. The `CatalogOptIn` component (`prototype/components/catalog/catalog-opt-in.tsx`) is still used by the public marketing pages.

### Ready-to-build Confirmation — `/apps/[appId]/ready`
**File:** `prototype/app/apps/[appId]/ready/page.tsx`
**Status:** Stable — wizard step between messages and signup

Conversion moment. Sits between the messages workspace ("Continue" button) and the signup page. Only valid in Onboarding (wizard) state; non-wizard states redirect to `/overview`.

**Layout:** Rendered inside WizardLayout's 540px content column. WizardLayout config: Back → `/messages` (inside content column, D-330), no header Continue, no dual — the page owns its own "Create account" CTA.
- Heading: "SMS that just works" (`text-2xl font-bold text-text-primary`) (D-332)
- Body: "Create your account and we'll generate everything your tool needs to build." (`text-sm text-text-tertiary`) (D-332)
- **Benefit list** (`ul` with `space-y-7`, `mt-10`): Five `CheckCircle` icons (success-green, `size-5`) + paragraph with bold lead sentence (`font-semibold text-text-primary`) followed by tertiary detail (`font-normal text-text-tertiary`):
  1. One prompt gets you started. — Paste it into your AI tool and it builds your SMS feature — tailored to your app, your customers, your messages.
  2. Test with real people, real phones. — Send messages to up to 5 people — your team, your co-founder, a client you're trying to impress.
  3. An expert in your corner. — Not a chatbot — a full AI assistant that knows your business, your messages, and how SMS works. It helps you troubleshoot and get your app just right.
  4. Change a message here, your app updates automatically. — No code changes, no prompts. Your app picks up the new version on the next send.
  5. You never think about compliance. — Opt-in forms, opt-out handling, message formatting — things that sink SMS features at other companies. We handle all of it.
- **Pricing block** (`mt-12`):
  - Line 1: "Free while you build and test." (`text-lg font-semibold text-text-primary`)
  - Line 2: "When you're ready for real delivery: **$49** registration + **$19/mo**." (`text-base text-text-tertiary`, dollar amounts `font-semibold text-text-primary`). See D-320.
  - Line 3: "500 messages included. Additional messages **$8** per 500." (`text-sm text-text-tertiary`, dollar amount `font-semibold text-text-primary`). See D-321.
- **CTA** (`mt-10`): Full-width purple button "Create account" → `/apps/[appId]/signup`.

### Signup — Email Entry — `/apps/[appId]/signup` (D-323)
**File:** `prototype/app/apps/[appId]/signup/page.tsx`
**Status:** Stable — email collection step

First of two signup pages. Only valid in Onboarding (wizard) state; non-wizard states redirect to `/overview`.

**Layout:** Inside WizardLayout but with no header Back or Continue (WizardLayout config returns `backHref: null, continueHref: null`). The header row is hidden entirely. Content column narrowed to 400px (`mx-auto max-w-[400px]` inside WizardLayout's 540px column).

- Inline `← Back` link above heading (same pattern as `/start/*` pages) → `/apps/[appId]/ready`
- Heading: "Create your account" (`text-2xl font-bold`)
- Body: "We'll send you a code to verify your email and sign in." (`text-sm text-text-tertiary`)
- Email input (`type="email"`, `autoFocus`, placeholder `you@company.com`)
- Full-width purple "Send code" button (same styling as Continue buttons on other wizard pages). Disabled until valid email.
- On click: shows "Sending…" disabled state for 1.5s, stores email in sessionStorage (`relaykit_signup_email`), navigates to `/apps/[appId]/signup/verify`.

### Signup — Email Verification — `/apps/[appId]/signup/verify` (D-323)
**File:** `prototype/app/apps/[appId]/signup/verify/page.tsx`
**Status:** Stable — OTP verification step

Second signup page. Only valid in Onboarding (wizard) state; non-onboarding states redirect to `/overview`.

**Layout:** Same as email entry — no WizardLayout header Back/Continue. Content column 400px.

- Inline `← Back` link above heading → `/apps/[appId]/signup`
- Heading: "Check your email" (`text-2xl font-bold`)
- Body: "We sent a code to {email}" (`text-sm text-text-tertiary`, email from sessionStorage in `font-medium text-text-secondary`)
- 6 OTP digit boxes (full-width `min-w-0 flex-1 h-14 rounded-xl border`, `gap-4`, D-334). Auto-advance on input, paste support, backspace navigation. Auto-submits on 6th digit.
- Full-width purple "Confirm" button (always enabled, no disabled styling).
- **60s resend cooldown** below button (centered, D-334): "Resend code in XXs" counting down (`text-sm text-text-quaternary`) → clickable "Resend code" at 0 (`text-sm text-text-tertiary`). Timer starts on page load, resets on click.
- On success (any 6 digits in prototype): navigates to `/apps/[appId]/get-started`. Does NOT change registrationState — stays Onboarding (D-322).

### Get Started — `/apps/[appId]/get-started` (D-322)
**File:** `prototype/app/apps/[appId]/get-started/page.tsx`
**Status:** Stable — final onboarding screen, state transition boundary

The last screen before the dashboard. Developer has verified their email and lands here. This is the state transition boundary: everything before is Onboarding, clicking out transitions to Building (D-325).

**Layout:** Standalone — no WizardLayout, no DashboardLayout. AppLayout renders `<>{children}</>` for this path. Content column 500px (`mx-auto max-w-[500px] px-6 py-12 pb-16`). Top nav shows wordmark + Appointments pill + onboarding dropdown, no Sign out.

- Heading: "Start building" (`text-2xl font-bold`)
- Body: "Everything your AI tool needs to build your SMS feature." (`text-sm text-text-tertiary`)
- **Tool logo farm** (`mt-4 mb-5`): 6 left-aligned logos (D-335) (40px circles, `border border-[#c4c4c4] bg-white p-1`) with `gap-3`: Claude Code, Cursor, Windsurf, GitHub Copilot, Cline, Other (Code02 icon fallback). Same SVG assets as home page hero at smaller scale.
- **Three numbered cards** (`space-y-4`): Each has rounded-xl border with label (top-left) + copy button (top-right, `Copy01` icon → `Check` for 2s) + helper text (`text-xs text-text-quaternary`) + content block (`bg-bg-secondary rounded-lg`):
  1. "1. Install RelayKit" / "Run this in your project's terminal." / `npm install relaykit`
  2. "2. Add your API key" / "Paste this prompt into your AI tool to add the key." / `Add this API key to my .env file: RELAYKIT_API_KEY=rk_sandbox_7Kx9mP2vL4qR8nJ5`
  3. "3. Add SMS to your app" / "Paste this prompt into your AI tool to start building." / hardcoded Club Woman prompt (production will generate from wizard data)
- **CTA** (`mt-8`): Full-width purple "View on dashboard" button. On click: `setRegistrationState("building")` + navigate to `/apps/[appId]/overview`.
- **Footer info** (`mt-4`, centered):
  - "We also sent this to your email." (`text-xs text-text-quaternary`)
  - "Need help? **Talk to our AI assistant →**" (`text-xs`, link `font-semibold text-text-brand-primary`). On click: `setRegistrationState("building")` + navigate to `/apps/[appId]/support`.

### Opt-in form component
**File:** `prototype/components/catalog/catalog-opt-in.tsx`
**Status:** Retained — used only by public marketing pages (not the wizard flow).
- Consent checkbox label is the singular category + business name only (e.g., "I agree to receive appointment text messages from GlowStudio."). `CATEGORY_CONSENT_WORD` map converts categoryId → singular consent word. Fine print carries the TCPA disclosure details. Matches PRD_02 opt-in language pattern.
- Checkbox labels and fine print use `leading-snug`.
- Sign-up CTA button uses `bg-[#98A2B3]` (hover `bg-[#7A808A]`) — a lighter mid-gray than the previous `bg-[#61656C]`.
- "Continue" button below opt-in form (`mt-8`). Same primary purple treatment as other wizard advances.
- Continue target: placeholder — signup page not built yet. Currently links back to messages.
- Stub note: "Signup page coming soon" in `text-xs text-text-quaternary` below Continue.

**Wizard chrome:** Same as messages page — no Sandbox indicator, no Settings gear. Layout `isWizardMode` detection covers `/opt-in` path.

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
│   │       ├── layout.tsx                # App shell — state-based layout switching (wizard vs dashboard)
│   │       ├── page.tsx                  # Redirects to /messages
│   │       ├── overview/
│   │       │   ├── page.tsx              # Sandbox dashboard (compliance card + build steps + sidebar)
│   │       │   └── approved-dashboard.tsx # Full 3×2 card grid (Approved state)
│   │       ├── messages/page.tsx         # Messages workspace — full width, dual Continue in wizard
│   │       ├── ready/page.tsx           # Ready-to-build confirmation — benefit list + pricing + CTA
│   │       ├── signup/
│   │       │   ├── page.tsx             # Signup email entry (400px, inline Back, Send code)
│   │       │   └── verify/page.tsx      # Signup OTP verification (400px, 6-digit boxes, Confirm)
│   │       ├── get-started/page.tsx     # Final onboarding — install/env/prompt cards, state transition (D-322)
│   │       ├── opt-in/page.tsx          # Opt-in form preview — returns null, redirects to /messages
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
│   ├── wizard-layout.tsx                 # Wizard layout wrapper (Default state)
│   ├── dashboard-layout.tsx              # Dashboard layout wrapper (non-Default states)
│   ├── proto-nav-helper.tsx              # Floating nav helper for design review (prototype only)
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
