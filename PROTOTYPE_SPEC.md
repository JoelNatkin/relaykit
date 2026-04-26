# PROTOTYPE_SPEC.md — RelayKit
## Screen-Level Prototype Specifications
### Last updated: April 19, 2026

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

**Logged-in (app) nav:** RelayKit wordmark (left) → "Your Apps" (plain text link to `/apps`, left-aligned after wordmark) → avatar button (right, 32px round `bg-gray-200` with `User01` icon). Clicking the avatar opens a dropdown menu aligned to the right edge: **Account settings** (→ `/account`) and **Sign out** (toggles state + navigates to `/`). Menu closes on outside click. The freestanding "Sign out" text link was removed — sign out lives exclusively in the avatar dropdown. No Prototype badge, no pill styling. (PRD_SETTINGS v2.3 §2; implements D-347.)

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

**How it works pricing context:** "Free to build and test. $49 to register, then $19/mo."

**Pricing:** Two cards — "Free" ($0 forever, 4 features at text-base) and "Go live" ($49 to register + $19/mo headline, bridge line: "$150 go-live fee" in semibold text-text-primary + "after approval. Full refund if not approved." in regular weight, 6 feature bullets including "No credit card to start building" and "Every message scanned — issues caught and fixed before they reach carriers" (D-241)). No per-card buttons. Single centered "Start building free →" CTA below both. Volume pricing note. (D-216, D-220)

**Why RelayKit / Problem framing / Footer:** Unchanged from prior session. Reassurance line ("No contracts. Cancel anytime. Your code stays yours.") before footer. Inline footer with scroll-to-section links.

### Category Landing — `/sms/[category]`
**File:** `prototype/app/sms/[category]/page.tsx`
**Status:** Stable (appointments only)

**Breadcrumb:** Home / Appointments (see Global Patterns > Breadcrumbs). No Appointments pill badge in hero — breadcrumb handles category identification.

**Subhead:** "Your AI coding tool builds the integration. RelayKit handles the carriers." (updated from prior copy)

**Pricing context line:** Below "See all appointment messages →" CTA link with `mt-5`. Styled: `text-base text-center text-text-tertiary`. "$49" and "$19/mo" in `font-semibold text-text-primary`. Full text: "Free sandbox. No credit card. $49 to register, $19/mo after approval."

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

**Hero:** Gray band (`bg-bg-tertiary`, `pt-6 pb-12`). H1 ("Appointment messages, ready to send.") with subhead grouped below ("Everything your AI coding tool needs to add SMS — in two files."). Desktop CTA right-aligned with "Free to build and test. No lock-in." below. Mobile CTA full-width after logos. Logo row (6 tools, 48px circles with `border-[#999999]`). Pricing context below logos: "Free sandbox, no credit card. $49 to register, $19/mo after approval." with line break before "You'll get two files and a sandbox API key." "How it works" link (Expand06 icon, brand purple semibold) opens full-page modal (D-218).

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

**How it works modal (D-218):** Full-page overlay (z-50, bg-white, overflow-y-auto). Sticky close button. Content: H1 "How it works" (text-3xl/4xl), subhead, "What you get" 4-card grid, pricing section in gray band (Free + Go live cards, $49 + $19/mo per D-320 pricing), "Why registration matters" FAQ, "Back to messages" CTA.

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
- URL input (autoFocus, placeholder "glowstudio.com"). Continue always enabled (field is optional). "Skip" link centered below the Continue button (`mt-3`, via `afterContinue` slot on WizardStepShell). Skip clears the stored website and advances.

### Step 3c — Context — `/start/context`
**File:** `prototype/app/start/context/page.tsx`
**Status:** Stable
- Heading: "Anything else we should know?" Body: "This helps us tailor your messages. You can always adjust later."
- 4-row textarea (optional). Continue always enabled. "Skip" link centered below the Continue button (`mt-3`, via `afterContinue` slot). Advances to `/start/verify`.

### Step 4 — Phone verification — `/start/verify`
**File:** `prototype/app/start/verify/page.tsx`
**Status:** Stable (visual match with email verify)
- **Max width:** 400px (via `maxWidth` prop on WizardStepShell). Matches email verify page width.
- Heading: "Verify your phone number" Body: "Your phone is your test device for messages."
- **Three states:**
  - `input` / `sending`: `+1` prefix pill + phone input (live-formats digits to `(555) 123-4567`) + inline purple "Send code" button (disabled until 10 digits). On tap: 1.5s stub → `code` state. Below the input row: carrier-defensible consent disclosure (`text-xs text-text-tertiary leading-snug`, `mt-3`) — exact wording locked in D-365: "We'll text you a verification code. By verifying, you agree to receive test messages at this number when you trigger them. Standard rates apply. Reply STOP anytime, HELP for help." Disclosure hides on `code` / `done` states (carried by the same conditional wrapper).
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

**Logged-in home page (D-94).** Grid of project cards. Each card: app name, category pill, status pill (Sandbox/Registered/Live), created date. Cards link to the workspace root `/apps/[appId]` (D-345). "+ New project" button in the page header links to `/start` (wizard entry — D-345 session).

### App Layout Shell — `/apps/[appId]/layout.tsx`
**File:** `prototype/app/apps/[appId]/layout.tsx`
**Status:** Stable

**Two layout wrappers, one route tree.** Layout.tsx checks `registrationState` and renders either the **Wizard Layout** (Onboarding state) or the **Dashboard Layout** (all other states). Route redirects handle invalid state/page combos automatically.

#### Wizard Layout (Onboarding state)
**File:** `prototype/components/wizard-layout.tsx`

Minimal, focused layout for the pre-signup wizard flow.

**Top nav (rendered by TopNav, wizard-aware):** RelayKit wordmark + "Appointments" pill (left) → state switcher dropdown + onboarding nav dropdown (right). No "Your Apps" link, no Use Cases/Compliance links, no Sign out. TopNav detects the wizard context via pathname + registrationState — regex matches `^/apps/[appId](/(ready|signup(/verify)?|get-started))?$` — workspace root or any wizard subroute (D-345). Sign out is hidden on all wizard-state pages.
**Onboarding nav dropdown:** Native `<select>` (`text-xs text-text-quaternary`) to the right of the state switcher. Label "Onboarding" (disabled default option). 11 numbered options covering the full wizard flow from vertical picker through get-started. Resets to label after navigation. Also appears on `/start/*` routes (right side of wordmark-only nav). Only visible when `registrationState === "onboarding"`.
**Continue button:** Absolutely positioned top-right (`absolute top-6 right-6`) so it doesn't push the content column down. Hidden when no `continueButton` is present.
**Back link:** Inside the centered content column (`mb-6`), left-aligned with headline and body text. Hidden when `backHref` is absent.
**Page config in `getPageConfig()`:** Messages has `/start/verify` Back + `/ready` Continue + `continueLabel: "Continue"` (D-328) + dualContinue=true; ready has `/messages` Back + no header Continue (page owns its own CTA); signup paths return `backHref: null, continueHref: null` (pages manage their own inline Back links).
**Continue button customization:** Pages can override the header Continue button by consuming `WizardContinueContext` from `wizard-layout.tsx` and registering `{ onClick, disabled }`. WizardLayout renders: override button > static continueHref Link > nothing.
**Centered content:** `max-w-[540px] mx-auto` container.
**Bottom Continue:** When `dualContinue` is true (messages only, D-318), WizardLayout renders a second full-width Continue spanning the 540px content column below the content. Uses the same `continueLabel` as the header Continue.
**Not shown in wizard layout:** app name (h1), tabs, status indicator dot.

#### Dashboard Layout (Building, Pending, Registered, Extended Review, Rejected)
**File:** `prototype/components/dashboard-layout.tsx`

Full dashboard with app identity bar. No tab bar — Messages is the sole workspace page, Settings is a child page accessed via gear icon (D-332).

**Header:** App name (h1) + category pill (purple) → state switcher dropdown (right) → EIN prototype switcher ("With EIN" / "No EIN", writes to wizard sessionStorage `ein` field, dispatches `relaykit-ein-change` event) → status indicator dot+label (right of switcher, `ml-10` gap).
**Status indicator:** Colored dot (8×8 `rounded-full`) + status text. States: green (#12B76A) "Your app is live" (Registered), amber (#F79009) "Registration in review" (Pending) / "Extended review" (Changes Requested), red (#F04438) "Registration rejected" (Rejected). Building state shows no status indicator.
**Content:** `mx-auto max-w-5xl px-6 pt-6 pb-16`.

#### State Switcher (both layouts)
Six states: Onboarding, Building, Pending, Extended Review, Registered, Rejected (D-324, D-325). `text-xs text-text-quaternary`. Switching from Onboarding to any other: wizard → dashboard, redirect if on overview/settings stays valid, wizard-only pages (ready/signup) get the transition redirect. Switching to Onboarding: dashboard → wizard, redirect if on overview/settings → messages.

#### Route Redirects
- **`/opt-in`:** Always redirects to `/messages` regardless of state.
- **`/overview`:** Always redirects to `/messages` regardless of state (D-332 — no tab bar, Messages is the workspace).
- **Onboarding (wizard):** `/settings` redirects to `/messages`. Valid wizard pages under `/apps/[appId]/`: `/messages`, `/ready`, `/signup`, `/signup/verify`.
- **Non-onboarding (dashboard):** `/signup`, `/signup/verify`, and `/ready` redirect to `/messages` (they are wizard-only). `/messages` and `/settings` are valid.
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
`rounded-xl bg-gray-50 p-6 md:sticky md:top-20`, `md:w-[300px]`. Content varies by state:
- **Building state — Card A (D-326, D-335, D-337):** "Ready to go live?" heading. With EIN: "Registration takes a few days." body, campaign radios ("Just [vertical]" default $19/mo, "Add marketing messages too" $29/mo with helper text showing dynamic vertical name), pricing, "Start registration →" CTA. No EIN: body includes "An EIN lets us enable optional marketing messages. [Add EIN.]" inline link. Clicking "Add EIN." swaps to Card B.
- **Building state — Card B (D-337):** "Add your EIN" heading, EIN explanation body, "Business tax ID (EIN)" label, input + grey "Verify" button, stub switcher (Default/Verified/Failed), two-phase spinner stub (Verifying → Checking sources), business identity confirmation card, "This is my business" checkbox, "Try a different EIN" tertiary text link below checkbox (clears EIN state and reopens input), Cancel + Save buttons (right-aligned together). Cancel returns to Card A. Save writes EIN to sessionStorage, dispatches `relaykit-ein-change` event, returns to Card A with radios. Failed state shows light red error box. 200ms crossfade between Card A and Card B. Shared component: `prototype/components/ein-inline-verify.tsx`. Same "Try a different EIN" link is also present on the onboarding business page (`/start/business`) verified state.
- **Pending state (D-338, D-339, D-340):** Registration status tracker card + (optional) marketing upsell card below a divider. Tracker shows "Registration status" heading with info tooltip icon (InfoCircle, tooltip text: "Registration usually takes 2–3 days per message type."). Per-type rows: bold type name on top (`text-text-primary font-semibold`), "Submitted 3/17/2026" below (`text-xs text-text-tertiary mt-0.5`), "In review" badge right-aligned (`bg-bg-brand-secondary text-text-brand-secondary mt-1` for vertical centering with name). Row gap: `space-y-2`. Marketing row appears when marketing was added at signup (has EIN) OR after upsell confirmation. Default shows Appointments row only. Pending tracker has no dropdown — everything is always "In review" in this state. Below the tracker, if marketing isn't added yet, a divider (`border-t border-border-secondary pt-4`) + marketing upsell card: "Add marketing messages" heading, benefit copy ("Promote new services, announce specials, and bring past clients back."), "$29/mo instead of $19/mo." bold pricing line, CTA button ("Add your EIN →" no-EIN / "Add marketing messages →" with-EIN). Upsell CTA paths: no-EIN → `EinInlineVerify` card swap (entire card replaced) → on save → pricing confirmation step → Confirm → upsell disappears + Marketing row added to tracker. With-EIN → pricing confirmation step directly. Pricing confirmation card: "Confirm marketing messages" heading, "Your plan updates from $19/mo to $29/mo. Registration typically takes a few days." body, "Marketing messages share your 500 included messages." detail, Cancel (tertiary left) + Confirm (primary right, 20px gap, `justify-end`).
- **Extended Review:** "Registration status" heading, purple "Under review" pill, submitted/updated dates, longer-than-expected copy.
- **Rejected:** "Registration status" heading, red "Not approved" pill, "$49 refunded" in green, divider, "What happened" section, mailto link. No retry button.
- **Registered (D-338, D-339, D-340):** Right rail shows one of three things depending on marketing status: (1) Marketing upsell card when marketing not added yet — same shape as Pending upsell card, including EIN card swap for no-EIN and pricing confirmation step. After Confirm, transitions to (2). (2) Marketing-only registration tracker after upsell confirmation — same card pattern as Pending tracker but only one row: "Marketing" / "Submitted 3/17/2026" / "In review" badge. No Appointments row because transactional is already live. Prototype dropdown on card (top-right): "In review" / "Registered" — cycles the badge state. "Registered" state: heading changes to "Your messages are live!" (no tooltip), badge becomes green "Registered", right-aligned primary Close button appears. Close permanently dismisses the card. (3) Nothing — grey card wrapper `null` when marketing registered and tracker dismissed.

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

### Messages Page — `/apps/[appId]` (D-345)
**File:** `prototype/app/apps/[appId]/page.tsx`, `prototype/components/catalog/catalog-card.tsx`
**Status:** REDESIGNED — Phase 2 card redesign + wizard skeleton (WORKSPACE_DESIGN_SPEC.md)

The workspace lives at the `/apps/[appId]` root (D-345). `/apps/[appId]/messages` still exists as a backward-compat server redirect. All internal links point to the root route.

---

#### Layout

**Full-width layout (D-317):** No opt-in column. Messages get the full viewport. Opt-in form is a separate wizard step at `/apps/[appId]/opt-in`.

**Onboarding mode (Onboarding state — rendered inside WizardLayout, D-328):**
- Back (inside content column) navigates to `/start/verify`. Continue absolutely positioned top-right, labeled **"Continue"**.
- Heading: H1 "Here's what your app will send" (`text-2xl font-bold`).
- Body: "Each message is tailored to your business. Edit messages any time. Your app always sends the latest version." (`text-sm text-text-tertiary`).
- **"What about marketing messages?"** link below body text (`text-sm text-text-brand-secondary`, no underline, matching EIN link style on `/start/business`). Click toggles tooltip (dark bg, white text, `rounded-lg bg-[#333333]`). EIN-aware: reads wizard sessionStorage — if EIN provided: "You're all set to add marketing messages after you create your account. We'll walk you through it."; if no EIN: "Marketing messages require a business tax ID (EIN). You can add one anytime in settings."
- Message cards fill the wizard container. **No send icons** — `hideSend={true}` on CatalogCard (D-328).
- Bottom "Continue": full-width purple button spanning the 540px content column, rendered by WizardLayout (D-318 — dual Continue).

**Dashboard mode (Building/Pending/Registered/Extended Review/Rejected — rendered inside DashboardLayout):**

- **DashboardLayout header row** (app identity bar): `GlowStudio` heading + `Appointments` pill on the left. Right side (via `ml-auto`): prototype state-switcher dropdowns → EIN switcher → StatusIndicator (conditional, see below) → Settings gear link (`ml-6`, workspace page only). Settings link is **icon-only** (`Settings01` gear, no text label; `aria-label="App settings"` for a11y) — the text label moved to the Settings page H1. Settings visibility gated on `pathname === /apps/${appId}` (exact root match — D-345). The Instructions toggle is no longer in the header — it was moved into the messages section header row next to Ask Claude (see below). `useSetupToggle` state still lives in DashboardLayout and is provided via `SetupToggleContext` so the workspace page can render both the toggle control and the SetupInstructions panel against the same flag. Toggle thumb uses `translate-x-[16px]` in the enabled state so there's 2px right padding matching the 2px left (`ml-0.5`) when disabled.
- **Workspace tagline row:** Immediately below the header row on the messages page only (gated on `isMessagesPage`): `<p>` tagline reading "Your SMS workspace. Build and test your feature, go live when you're ready" (`text-sm text-gray-500`, sits inside the `max-w-5xl` content column, `pt-4 -mb-1`). Not shown on Settings or other app sub-pages.
- **StatusIndicator (D-344):** Yellow dot + "Test mode" for Building/Pending/Extended Review/Rejected. Green dot + "Live" for Registered. Null for Onboarding. Conditional wrapper (`registrationState !== "onboarding"`) so no empty `ml-10` div when null.
- **Messages section header** (`mt-2 mb-4 flex w-full items-center`): `<h2>Messages</h2>` on the left. On the right (via `ml-auto flex items-center gap-6`): the **Instructions** toggle (renamed from "Setup instructions") immediately left of the "Ask Claude" button (`Stars02` icon + text, tertiary purple). 24px gap between toggle and button. Clicking Ask Claude opens the panel (D-343); toggling Instructions reveals/hides the SetupInstructions panel in the left column. The `mt-2` gives a small breather below the workspace tagline row.
- **Metrics grid (Registered only):** `grid grid-cols-1 min-[860px]:grid-cols-3 gap-6 mb-6` — single column below 860px, straight to 3 columns at 860px (no intermediate 2-column step). 24px (`gap-6`) between cards matches the messages grid below so columns align pixel-for-pixel. Three cards: Delivery (98.4% + trend), Recipients (284 + trend), Usage & billing (347/500 + progress bar + `"Plan: $19/mo · 500 included"` at same size/weight as the trend lines). Stat-detail lines ("1,812 delivered · 22 failed · 8 pending", "12 opt-outs · 38 inbound replies", "153 messages remaining this period") removed.
- **Setup instructions** (`prototype/components/setup-instructions.tsx`): Toggle-controlled container with "Start building" heading and 3 numbered instruction cards. Default ON in Building, OFF in other states. Per-state toggle persisted in sessionStorage. Rendered inside the left column **above** the message cards in both layouts (moved from above the metrics grid in the Registered state so all post-onboarding states render it in the same slot). The Start building panel itself caps at `min-[860px]:max-w-[540px]`. Card 3's helper text reads: "Paste this prompt into your AI tool to start building. Once your app is sending, use the cards below to test delivery and Ask Claude to debug issues."
- **Message cards:** The `messageList` wrapper is uncapped — message cards now flow to the full width of the 2-col grid cell. Individual card root still applies `min-[860px]:max-w-[540px]` when `monitorMode` is true — uncapped below 860px, 540px above. No send icons (removed). Removing the wrapper cap was what made the messages+rail grid share widths with the metrics grid above it.

**Two-column layout (all post-onboarding states):**
- When Ask Claude panel is closed: `grid grid-cols-1 min-[860px]:grid-cols-3 gap-6`. Left column (messages): `min-w-0 min-[860px]:col-span-2`. Right column (third grid col): `order-first min-[860px]:order-last min-[860px]:sticky min-[860px]:top-20 space-y-4` stacks state-specific card(s) above the Preview list card (D-342). The 860px breakpoint + 24px (`gap-6`) gutter are used consistently across the metrics grid (Registered only) and the card/rail grid so the two rows align pixel-for-pixel as a single shared 3-column grid. Messages column no longer applies its own `max-w-[540px]` wrapper — it fills the two-col cell.
- When Ask Claude panel is open (D-343): `grid grid-cols-1 md:grid-cols-2 md:gap-10`. Equal 50/50 columns. Metrics hidden (Registered). Right rail replaced by inline Ask Claude panel (desktop: `md:flex`, sticky; mobile `<md`: full-width fixed overlay).
- **Ask Claude panel top alignment:** A zero-height `<div ref={messageTopRef} />` sits at the very top of the left column (above SetupInstructions, above messageList) so `getBoundingClientRect().top` measures the grid row's top. If the ref were placed below SetupInstructions, `topOffset` would shift when the Start building card toggles on and the panel's `height: calc(100vh - topOffset - 2.5rem)` would collapse to a thin strip.

**Right rail — Preview list card (D-342):** Always visible in all post-onboarding states, below any state-specific card. Card root uses `rounded-xl border border-border-secondary p-6` — same stroke and radius as message cards, no grey background. Title: `Preview list`; subtext: `Your safe audience for sending test messages, before and after launch.` Shows up to 5 people. Each row: name (bold) + status dot ("Verified" green / "Invited" gray) + full phone number on second line + kebab menu (Edit + Delete, self-entry has Edit only). Inline invite form collapses on success. When `phones.length >= MAX_TEST_PHONES`, the `+ Invite someone` button renders disabled with group-hover tooltip `Preview list is full. Remove someone to invite another person.` Names synced with CatalogCard/CustomMessageCard `testRecipients` prop for the monitor expansion's Test send dropdown. Code-level identifiers (`TestPhone`, `MAX_TEST_PHONES`, `testRecipients`, `test-phones-card.tsx`, etc.) intentionally stay as `tester`/`test` per PM_PROJECT_INSTRUCTIONS user-facing-vs-internal split — the boundary layer translates.

**Building state right rail:** Registration card (D-335, D-337) + Preview list card below.

**Pending state right rail (D-338, D-339):** Per-type registration status tracker + optional marketing upsell card + Preview list card below.
- **Marketing in Pending (D-336, D-340):** Marketing messages in list when confirmed. `showMarketingMessages` covers both signup and upsell paths.

**Extended Review state right rail (extends D-339):** Per-type registration status tracker (identical structure to Pending — "Registration status" heading with the same info tooltip, `{verticalName}` row with "In review" purple pill, Marketing row with "In review" pill when `hasMarketingRegistered`). Below the tracker rows, an extra explanatory line: "This is taking longer than usual. We'll email you at [jen@glowstudio.com](mailto:jen@glowstudio.com) when there's an update." (email is a brand-secondary mailto link). Marketing upsell card below the divider works the same as Pending — gated on `!upsellConfirmed`, reuses the same `upsellEinExpanded` / `upsellConfirmStep` take-over states. Preview list card below.

**Rejected state right rail (extends D-339):** Per-type tracker with red "Not approved" pills (`bg-bg-error-secondary text-text-error-primary`). Heading: "Registration status" (no info tooltip — nothing to explain about timing). `{verticalName}` row always; Marketing row when `hasMarketingRegistered` (also "Not approved"). Below the tracker, two paragraphs: (1) reason line — `"The business name on file didn't match your EIN records."`, (2) warmer support line — `"We know this is frustrating. Reply to your confirmation email or reach out at support@relaykit.ai and we'll sort it out."` with `support@relaykit.ai` as an inline brand-secondary mailto link. No "What happened" subheading, no "$49 refunded" line, no marketing upsell. Preview list card below.

**Registered state right rail (D-338):** Three delivery metrics cards above the two-column layout. Right rail: marketing upsell OR marketing-only tracker OR nothing (after dismissed) + Preview list card below.

**Dashboard status indicator (yellow/green dot next to the app-identity bar):** Renders `null` in Onboarding. In Registered state, shows green dot + `Live`. In every other post-onboarding state (Building / Pending / Extended Review / Rejected), shows yellow dot + `Test messages only`. StatusIndicator component in `components/dashboard-layout.tsx`.

**Dev affordances in the state-switcher dropdown:** `DashboardLayout` state `<select>` appends (below Onboarding / Building / Pending / Extended Review / Registered / Rejected) a disabled em-dash row + sentinel `Edit business details` option. Sentinel opens `EditBusinessDetailsModal` — prototype-only dev utility that sets `state.appName` and `state.serviceType` inline via `useSession().setField`. Service type is a `<select>` populated per-vertical via `SERVICE_TYPES_BY_VERTICAL` (12 options for appointments; text-input fallback otherwise); a free-text value not in the preset list is prepended as the first option so the select round-trips cleanly. Modal title carries a muted `(prototype only)` suffix so a reviewer can't mistake it for product UI. Gated on `registrationState !== "onboarding"` — the wizard sets these values during onboarding and a workspace shortcut would compete with the flow.

**Dev affordance in the onboarding step dropdown (top-nav, wizard only):** Appended below the 11 step options is a disabled em-dash row + sentinel `Reset` option. Reset calls `sessionStorage.clear() + localStorage.clear()` in a try/catch (Safari private mode throws) then `window.location.href = "/start"` for a hard reload into step 1 — clean React remount, clean storage, default state.

---

#### Ask Claude Panel (D-343)

**File:** `prototype/components/ask-claude-panel.tsx`

Opens from the "Ask Claude" button in the messages section header (no focused message) or from the "Ask Claude" link inside a card's monitor expansion footer (focused on that message name). Replaces the right rail and (in Registered state) hides the metrics cards.

- **Desktop (≥768px):** Inline grid cell in a `grid-cols-2 gap-10` layout. `self-start sticky`, height `calc(100vh - ${topOffset}px - 2.5rem)` via inline style. `topOffset` measured via a zero-height ref div above the first message card, clamped to min 80px. `rounded-xl border border-border-secondary bg-bg-primary shadow-sm`.
- **Mobile (<768px):** `fixed inset-x-0 top-14 bottom-0 z-10 bg-bg-primary`. Full-width overlay flush against the top nav (h-14 = 56px). Body scroll locked via `document.body.style.overflow = "hidden"` in a `useEffect` gated on `matchMedia("(max-width: 767px)")`.
- **Layout:** `flex flex-col`. Header (`px-6 pt-6 pb-4`): "Ask Claude" h2 + XClose button. Scroll body (`flex-1 overflow-y-auto px-6`): optional "Focused on: [name]" line + welcome text ("I know your messages and your business…"). Pinned footer (`px-6 pt-4 pb-6 border-t`): chat composer — `rounded-lg border border-border-secondary` wrapping a 3-row textarea (no icon prefix, placeholder "Ask anything about your messages...") + toolbar row with Plus attach button (left, `text-fg-tertiary`) and Stars02 send button (right, `text-text-brand-secondary`). All non-functional stubs.

**Page-level controls removed (Phase 2a):**
- Global style pill bar — gone, pills live inside card edit state
- Personalize button + slideout — gone
- Show template / Show preview toggle — gone
- Copy all — gone
- Opt-in right column — gone (D-317, moved to own page)

---

#### CatalogCard — Default State (collapsed)

Each card shows the full message text, not truncated. Card root has `min-[860px]:max-w-[540px]` when `monitorMode` is true (dashboard cards); no max-width for wizard/public marketing cards.

- **Title row:** Message name (bold) + info icon (i) inline with 1.5 gap after title. Right side: Activity icon (17px, `text-fg-quaternary`, tooltip "Test & debug") + pencil edit icon (15px, `text-fg-quaternary`, tooltip "Edit message"), separated by `gap-1` + `p-1` on each button = 12px visible spacing. Activity icon only renders when `monitorMode` is true. Both icons use 300ms hover-delay tooltips (via `setTimeout` refs, cleared on click to prevent stuck state on icon unmount). In monitor mode, the icon row collapses to `<span>` (non-interactive) Activity icon + "Test & debug" label only. In edit mode, same pattern with pencil icon + "Edit" label.
- **Tooltips:** Info icon, pencil, and Activity buttons all use a custom dark tooltip: `rounded-lg bg-[#333333] px-3 py-2 text-xs text-white shadow-lg leading-relaxed pointer-events-none`, positioned above the button (`bottom-full mb-1`). Info tooltip anchors left; pencil and Activity tooltips anchor right.
- **Message text:** Full message below title. Variables highlighted in brand color. Always shows interpolated preview. Clicking text enters edit state.
- **Status line** (below message text, `monitorMode` only): When `lastSent` prop is provided — small colored dot (green delivered / red failed / yellow pending) + relative timestamp via `timeAgo()` formatter. When `lastSent` is null, nothing renders (card looks identical to pre-monitor-mode).
- **Marketing badge:** Shown on marketing-tier messages, same as before.
- **Card spacing:** `space-y-5` (20px) between cards.
- **Single-card editing/monitoring:** At most one card can be in edit state and at most one in monitor state. `CatalogCard` accepts controlled props for both (`isEditing`/`onEditRequest`, `isMonitoring`/`onMonitorRequest`). The messages page manages cross-card mutual exclusivity: opening edit on any card clears monitor on all cards and vice versa. Opening the Ask Claude panel clears both.

---

#### CatalogCard — Edit State (D-341; implementation D-350, D-353, D-354)

Triggered by pencil icon click or by clicking into the message text.

- **Title row:** Name + info icon unchanged. Right side shows pencil icon + "Edit" text label (`text-sm text-fg-quaternary`), non-interactive (visual indicator only). Activity icon hidden.
- **Editor (Tiptap, D-354):** Replaces the former textarea. Single-line contentEditable backed by Tiptap v3 (`prototype/lib/editor/message-editor.tsx`) with a custom `VariableNode` atom (`prototype/lib/editor/variable-node.ts`). Body font, single line only (Enter key suppressed). Disabled during AI/Fix loading via opacity + cursor-not-allowed wrapper. Container: `w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 shadow-xs focus-within:border-border-brand`. Internal state: the editor holds a `{var_key}` template and emits template strings via `onChange`; `docToTemplate` / `templateToContent` helpers in `prototype/lib/editor/template-serde.ts` round-trip between the editor and the stored format.
- **Variable tokens (D-350):** Each variable renders as an atomic, indivisibly-selectable node. Resolved preview values shown inline (e.g. `{date}` → "Mar 15, 2026"), never raw `{var_name}` template syntax.
  - **At rest:** color-only — `text-text-brand-secondary` + `cursor-pointer` via `VARIABLE_TOKEN_CLASSES` (`prototype/lib/variable-token.ts`). No background, no radius, no weight. Applied identically in edit mode and read-only preview so the two surfaces match.
  - **Hover:** flat horizontal band behind glyphs — `bg-bg-brand-primary` with `pt-[3px] pb-[3px]` and `-mt-[3px] -mb-[3px]` negative-margin counterweight so surrounding text flow never shifts.
  - **Selected** (ProseMirror node selection): same flat band, darker shade — `bg-bg-brand-secondary` with identical padding pattern. No ring.
  - **Drag disabled** at three layers: `contentEditable={false}` + `draggable={false}` + `onDragStart preventDefault` + CSS `[-webkit-user-drag:none]` on the NodeView span; editor-level `handleDrop` returns true and `handleDOMEvents.dragstart` preventDefaults. Dragging a token does nothing. Token manipulation = backspace (when selected) + insert affordance.
- **`+ Variable` insert affordance (D-353):** Tertiary purple text button with a Plus icon in the tone-pills row, flex-pushed to the far right. Styled to match the Ask Claude tertiary-brand pattern: `text-text-brand-secondary hover:text-text-brand-secondary_hover`, no background. Click opens a popover listing the variables scoped to the current message's `variables` array (from `data/messages.ts`). Rows match the top-nav dropdown scale: `text-sm px-3 py-2`, label left (`text-text-secondary`), preview sample right (`VARIABLE_TOKEN_CLASSES` purple). Width is content-driven via `whitespace-nowrap` — no forced minimum, no wrapping. Click a row → atomic token inserted at cursor; popover closes. Escape or outside click also closes.
- **Tone pills row** (order left-to-right): Standard / Friendly / Brief / Custom / `[flex spacer]` / `+ Variable`. Custom is grouped with the canned variants since it's a tone state (user-authored). Every control in this row uses `onMouseDown preventDefault` so clicks don't blur the editor — required for ProseMirror's click-to-select on tokens to stay live across tone swaps. Removing these preventDefaults reintroduces the regression where post-swap token clicks do nothing.
- **Compliance feedback** (below editor, above pills): opt-out check + required-variable check. Error labels pull directly from the same label source as the `+ Variable` dropdown (`getExampleValues(categoryId).label`), so the two can never drift. Formatting: `Needs X` (one), `Needs X and Y` (two), `Needs X, Y, and Z` (three+). 2s debounced reveal on first-time non-compliant; compliant states hide the hint immediately. The check runs only when the user produces new text — explicit calls from `handleTextChange`, `handleAiSubmit`, and the Custom-pill branch of `handlePillClick`. First open on an untouched message shows no errors, and compliance state never updates as a reactive side effect of edit-mode transitions.
- **Fix button** (formerly "Restore"): appears alongside the compliance hints. Restores the last canned pill's clean template. 1.5s simulated async ("Fixing…"), then the editor content is re-seeded via Tiptap `setContent({ emitUpdate: false })` and compliance state is set clean directly — no re-check runs. Post-Fix is definitionally compliant by UX contract. Single click fully clears errors; a second click is never required.
- **Edit controls panel** (`mt-3 space-y-3`): pill + insert row (above) + AI help input (Stars02 icon, tone-aware placeholder) + Save/Cancel buttons.
- **Save / Cancel buttons:** Right-aligned. Save primary purple, Cancel tertiary text-only. Save disabled while non-compliant or during AI/Fix loading.

---

#### CatalogCard — Monitor State (D-341)

Triggered by Activity icon click. Mutually exclusive with edit mode.

- **Title row:** Name + info icon unchanged. Right side shows Activity icon (17px) + "Test & debug" text label (`text-sm text-fg-quaternary`), non-interactive (visual indicator only). Pencil icon hidden.
- **Message text:** Read-only, same as default state. Clicking text does NOT enter edit mode while monitoring.
- **Status line:** Same as default state (dot + relative timestamp if `lastSent` is set).
- **Recent activity** (`mt-6` below status line): "RECENT ACTIVITY" label (`text-xs font-medium text-text-tertiary uppercase tracking-wide`). Below: a list of recent test sends with `divide-y divide-border-secondary`. Each entry: recipient name (left, `text-sm text-text-secondary`) + status dot + "Delivered/Failed/Pending" + relative timestamp (right, `text-sm text-text-tertiary`). Failed entries have an indented error detail line (`text-xs text-text-tertiary`). Empty state: "No activity yet. This message hasn't been sent by your app." centered.
- **Footer row** (`mt-6 flex items-center justify-between gap-4`): Left side — "Ask Claude" (tertiary purple, calls `onAskClaude` prop with message name) + "Test send" (tertiary purple, 1.5s "Sending…" disabled state, fade-out "✓ Sent to [name]" confirmation via `testSentFade` keyframe; hover tooltip "Sends from RelayKit to someone on your preview list. Not from your app." so the source of the test message is unambiguous) + recipient dropdown (plain text, `text-text-primary font-normal`, synced with Preview list card names via `testRecipients` prop). Right side — "Close" primary purple button (calls `exitMonitor`).
- **Mock data:** First 3 core messages have delivered `lastSent` (3m, 22m, 2h ago) with 3–4 activity entries. 4th message has a failed `lastSent` (yesterday) with carrier error detail. Remaining messages have null (no status line, no activity).

---

#### Per-state message card behavior
Message card content, editing, and monitoring behavior is identical across all post-onboarding states. Registration state affects page layout (two-column vs single-column, right rail content, metrics cards) but not individual card rendering. Registered state uses `REGISTERED_VALUES` for personalization (GlowStudio, glowstudio.com, etc.).

---

#### Custom messages on the workspace Messages page (D-351 revised, D-353)

**Files:** `prototype/components/catalog/custom-message-card.tsx`, `prototype/components/catalog/message-action-modal.tsx`, `prototype/lib/slug.ts`; wired into `prototype/app/apps/[appId]/page.tsx` for all post-onboarding states. Not rendered in wizard (onboarding) state.

- **`+ Add message` button** at the top of the message stack (above any marketing cards and built-ins). Full-width `rounded-xl border border-dashed border-border-secondary bg-bg-primary px-4 py-3`, purple tertiary text (`text-text-brand-secondary`) with a `Plus` icon. Click inserts a blank `CustomMessage` at index 0 of `state.customMessages` via `addCustomMessage(categoryId)` and puts the new row directly into edit state (authoring surface IS the row — no dialog, no modal). The row is tagged as "freshly added" via page-level `freshlyAddedCustomId` state so its editable name input auto-focuses on first open.
- **Custom edit state** (`CustomMessageCard` — sibling of `CatalogCard`, NOT a variant via prop flag):
  - **Editable name input** replaces the static title. Placeholder `New message`. Auto-focused on first open of a freshly-added row (ref callback).
  - **Body editor** — same `MessageEditor` (Tiptap) used by built-ins. Starts empty on a new row.
  - **No tone pills** — custom is its own thing (D-351 revised + design call).
  - **`+ Variable` affordance** identical to the built-in version but scoped to the namespace default (intersection of variables across all built-in methods in the category, per D-353's custom-message fallback branch in `getVariableScope`).
  - **Ask AI input** — `Stars02` icon, stubbed backend (1.5s `setTimeout` appending `(rewritten: …)`). Placeholder is body-state-aware: empty body → `Ask AI: write me a message`; non-empty body → `Ask AI: polish my edit`; loading → `Rewriting…`.
  - **No info icon** (ⓘ) — customs never show one, in edit or default.
  - **Compliance (D-356)** runs two rules:
    - **business_name:** the raw template must contain the category's primary business-name variable token (`{app_name}` for appointments/verification, `{business_name}` for orders/support/marketing/internal/waitlist/exploring, `{community_name}` for community — resolved via `getPrimaryBusinessVariable(categoryId)`). Error: `Needs business name`. Fix prepends `{businessKey}: ` to the trimmed-start template.
    - **opt_out:** interpolated text must contain STOP + an exit word (opt-out / opt‑out / unsubscribe). Error: `Needs opt-out language`. Fix appends `Reply STOP to opt out.` with smart punctuation spacing (` ` if ending punctuation, `. ` otherwise).
    - Each error renders on its own right-aligned row beneath the editor with its own Fix button (1.5s simulated async, matching built-in pattern). Hint reveal is 2s debounced on user typing; post-Fix re-checks bypass the debounce and surface remaining issues immediately. Check runs only from `handleTextChange`, `handleAiSubmit`, and post-Fix callbacks — explicit-call only, no reactive `useEffect`.
  - **Fresh row pre-population (D-356):** on `+ Add`, the template initializes to `{businessKey}: [your message here] Reply STOP to opt out.` — compliant by default, with the literal bracketed placeholder sitting between the chip and the opt-out phrase. Tiptap's default initial selection (position 0) lands the cursor before `{businessKey}` when the user tabs from Name into the body.
  - **Lock-while-authoring (D-357):** while this row has `slug === ""` (never saved) and `isEditing === true`, every other row on the page and the `+ Add` / Ask Claude buttons are disabled with tooltip `Save or cancel the current message first.` The authoring row itself stays fully interactive. `hasUnsavedCustomOpen` / `unsavedCustomId` derived in the parent `/apps/[appId]/page.tsx`; `locked` prop threaded through `CatalogCard` and `CustomMessageCard` to gate their pencil/activity/preview.
  - **Save / Cancel** right-aligned. Save disabled while non-compliant, AI loading, Fix loading, name empty, or body empty (`editTemplate.trim() === ""`). Cancel on a never-saved row discards the row from session state outright via `onDiscard` (no zombie "Untitled message" left behind); Cancel on a saved row just exits edit.
- **Slug assignment on first Save (D-351 revised):** `saveCustomMessage` in `session-context.tsx` calls `generateSlug(name, existingSlugsExcludingSelf)` from `lib/slug.ts` (kebab-case from name, `-2`/`-3`/… numeric suffix on collision). Immutable after first save — subsequent saves preserve `slug`. Collision set includes archived slugs; deleted slugs are freed.
- **Saved custom row** (non-archived, collapsed):
  - **Title row:** name (`text-sm font-semibold text-text-primary truncate`) + slug (`text-xs text-text-quaternary ml-2 font-mono`, inline after the name) on the left; kebab + activity + pencil (`DotsVertical`, `Activity`, pencil — 17px each) on the right. No info icon. Monitor mode on saved customs mirrors the built-in expansion (empty activity list, Test send with Preview list dropdown, Ask Claude, Close).
  - **Preview:** click anywhere on the preview or pencil to re-enter edit state. Empty template (first save with only a name) renders `No message yet.` italic `text-text-quaternary`.
  - **Kebab menu** (`DotsVertical`): single item `Archive`. Opens via outside-click/Escape-closable popover pattern (matches `+ Variable`).
- **Archive confirmation modal** (shared `MessageActionModal`):
  - Title: `Archive this message?`
  - Body: `Archived messages stay live. To stop sends, remove this message from your code:`
  - Code block: `relaykit.<namespace>.sendCustom('<slug>', ...)` — namespace reads from the archived message's `categoryId`, slug from its `slug`.
  - Buttons: `Cancel` / `Archive` (primary purple).
- **Archived messages:**
  - Filtered out of the active message stack.
  - Rendered in a disclosure section at the bottom of the message list: `Archived (N)` toggle with `ChevronRight` collapsed / `ChevronDown` expanded, tertiary-tone (`text-sm font-semibold text-text-tertiary`). Collapsed by default; toggle state lives in component state (not session state) so a fresh session always starts collapsed.
  - Expanded: cards render through `CustomMessageCard` with `readOnly` prop — pencil icon hidden, preview is non-clickable, kebab remains functional. No visual demotion (no opacity, no tertiary text colors) — the `Archived (N)` disclosure is a strong enough indicator on its own, and dimming the content made archived rows harder to read without adding information.
  - Kebab on archived rows shows `Restore` + `Delete permanently` (the Archive item is not rendered; the three options are mutually exclusive in practice via the `onArchiveRequest` / `onRestoreRequest` / `onDeleteRequest` prop triplet on `CustomMessageCard`).
  - `Restore` flips `archived` back to `false` inline — no modal (cheap, reversible action).
  - `Delete permanently` opens `MessageActionModal` with destructive tone:
    - Title: `Delete this message?`
    - Body: `This removes the message permanently. If your code still calls it, sends will fail.`
    - Code block: same `relaykit.<namespace>.sendCustom('<slug>', ...)` shape.
    - Buttons: `Cancel` / `Delete` (`bg-bg-error-solid`).
  - Deletion removes the message from `state.customMessages` entirely; the slug is freed (consistent with the "sends will fail" warning framing).
- **Archive is display-only in session state** — archived customs aren't actually sent from the prototype, but the mental model surfaced to the developer is "sends would still work in production until you remove the code". That's why the Archive modal tells the developer to remove the call site themselves.

---

### Opt-in Form Preview — `/apps/[appId]/opt-in`
**File:** `prototype/app/apps/[appId]/opt-in/page.tsx`
**Status:** REMOVED from wizard flow (D-317 tabled). All access redirects to `/messages` via AppLayout. The page file is retained — the component returns `null` and the original implementation is preserved inside a reference comment for future redesign. The `CatalogOptIn` component (`prototype/components/catalog/catalog-opt-in.tsx`) is still used by the public marketing pages.

### Ready-to-build Confirmation — `/apps/[appId]/ready`
**File:** `prototype/app/apps/[appId]/ready/page.tsx`
**Status:** Stable — wizard step between messages and signup

Conversion moment. Sits between the messages workspace ("Continue" button) and the signup page. Only valid in Onboarding (wizard) state; non-wizard states redirect to `/messages`.

**Layout:** Rendered inside WizardLayout's 540px content column. WizardLayout config: Back → `/messages` (inside content column), no header Continue, no dual — the page owns its own "Create account" CTA.
- Heading: "SMS that just works" (`text-2xl font-bold text-text-primary`) (D-329)
- Body: "Create your account and we'll generate everything your tool needs to build." (`text-sm text-text-tertiary`) (D-329)
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

First of two signup pages. Only valid in Onboarding (wizard) state; non-wizard states redirect to `/messages`.

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
- 6 OTP digit boxes (full-width `min-w-0 flex-1 h-14 rounded-xl border`, `gap-4`). Auto-advance on input, paste support, backspace navigation. Auto-submits on 6th digit.
- Full-width purple "Confirm" button (always enabled, no disabled styling).
- **60s resend cooldown** below button (centered): "Resend code in XXs" counting down (`text-sm text-text-quaternary`) → clickable "Resend code" at 0 (`text-sm text-text-tertiary`). Timer starts on page load, resets on click.
- On success (any 6 digits in prototype): navigates to `/apps/[appId]/get-started`. Does NOT change registrationState — stays Onboarding (D-322).

### Get Started — `/apps/[appId]/get-started` (D-322)
**File:** `prototype/app/apps/[appId]/get-started/page.tsx`
**Status:** Stable — final onboarding screen, state transition boundary

The last screen before the dashboard. Developer has verified their email and lands here. This is the state transition boundary: everything before is Onboarding, clicking out transitions to Building (D-325).

**Layout:** Standalone — no WizardLayout, no DashboardLayout. AppLayout renders `<>{children}</>` for this path. Content column 500px (`mx-auto max-w-[500px] px-6 py-12 pb-16`). Top nav shows wordmark + Appointments pill + onboarding dropdown, no Sign out.

- Heading: "Start building" (`text-2xl font-bold`)
- Body: "Everything your AI tool needs to build your SMS feature." (`text-sm text-text-tertiary`)
- **Tool logo farm** (`mt-4 mb-5`): 6 left-aligned logos (40px circles, `border border-[#c4c4c4] bg-white p-1`) with `gap-3`: Claude Code, Cursor, Windsurf, GitHub Copilot, Cline, Other (Code02 icon fallback). Same SVG assets as home page hero at smaller scale.
- **Three numbered cards** (`space-y-4`): Each has rounded-xl border with label (top-left) + copy button (top-right, `Copy01` icon → `Check` for 2s) + helper text (`text-xs text-text-quaternary`) + content block (`bg-bg-secondary rounded-lg`):
  1. "1. Install RelayKit" / "Run this in your project's terminal." / `npm install relaykit`
  2. "2. Add your API key" / "Paste this prompt into your AI tool to add the key." / `Add this API key to my .env file: RELAYKIT_API_KEY=rk_test_7Kx9mP2vL4qR8nJ5`
  3. "3. Add SMS to your app" / "Paste this prompt into your AI tool to start building." / hardcoded Club Woman prompt (production will generate from wizard data)
- **CTA** (`mt-8`): Full-width purple "View on dashboard" button. On click: `setRegistrationState("building")` + navigate to `/apps/[appId]/messages`.

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
**Status:** Stable — aligned with PRD_SETTINGS v2.3, updated 2026-04-16.

**Navigation:** "← Back to {appName}" link (e.g., "← Back to GlowStudio") at top of page. Links to `/apps/[appId]` workspace root (D-345). App name resolved via inline `APP_NAMES` map.

**Page heading:** `<h1>App settings</h1>` (`text-2xl font-semibold`, `mb-6`) below back link. The "App" qualifier disambiguates from Account settings at `/account` (the DashboardLayout top-bar Settings gear is now icon-only; the label now lives on this H1).

**Layout:** 600px max-width, centered. Card sections stack vertically (`space-y-6`). Sections and rows appear/disappear based on `registrationState` (from session context) and `hasEIN` (from wizard sessionStorage, listens to `relaykit-ein-change`). All body text 14px (`text-sm`); section headers 18px (`text-lg font-semibold`); action links right-aligned.

**Account-level fields not here (D-347):** No Email or Personal phone on Settings — those are account-level, destined for an account settings page behind the top-nav avatar dropdown.

**Phone label convention (D-207):** "Your SMS number" (dedicated campaign number, Registered only). Test phone lives on the workspace Preview list card (D-342), not here.

---

#### Section 1: Business info (all states)

Card heading: "Business info."

- **Building (editable):** Business name (editable via inline `EditableField`, Save/Cancel right-aligned in `justify-end gap-3`); Category (read-only, "Appointment reminders"); EIN row (editable — see EIN row pattern).
- **Post-registration (Pending, Extended Review, Registered, Rejected):** Business name (read-only, no sub-text); Category (read-only); EIN row (read-only — see EIN row pattern).

**EIN row pattern (shared via `EinRow` component, consistent across every state):**
- `hasEIN = true`:
  - Building → "••••••4567" + "Edit" link (brand color, no-op)
  - All other states → "••••••4567" read-only
- `hasEIN = false` (every state): "Not on file" + "Add" link (brand color, no-op)

#### Section 2: Registration (not visible in Building)

**Pending:**
- Status: amber dot + "In review"
- Submitted → date
- No estimated-review row, no sub-copy

**Extended Review** (internally `changes_requested` — D-202):
- Status: amber dot + "In review" (same label as Pending — developer sees only the delay, not a different status)
- Submitted → date
- Sub-copy: "This is taking longer than usual. We'll email you at jen@glowstudio.com when there's an update."

**Registered:**
- Status: green dot + "Active"
- Your SMS number → +1 (555) 867-5309 (mock)
- Approved → date
- No Campaign ID row (carrier infrastructure, not surfaced)
- "View compliance site →" link (brand color, right-aligned, no-op)

**Rejected (aligned with PRD §5):**
- Status: red dot + "Not approved"
- Submitted → date, Reviewed → date
- Paragraph: "Your registration wasn't approved. The business information provided didn't match public records."
- Paragraph: "Contact us at support@relaykit.ai if you believe this is an error." (email is `mailto:` link)
- No "What was submitted" reference block, no debrief box, no refund line, no "Start a new registration" link

#### Section 3: API keys (all states)

Card heading: "API keys." No sub-copy.

**Test key (all states):**
- Uppercase label "TEST" + green "Active" badge
- Monospace field: `rk_test_rL7x9Kp2mWqYvBn4` + copy button
- No Regenerate — test keys are low-security and re-displayable

**Live key (Registered only):**
- Divider above
- Uppercase label "LIVE" + green "Active" badge
- Masked `rk_live_••••••••••••••••••••` + disabled copy button (`opacity-30 cursor-not-allowed`)
- "Regenerate" link (right-aligned, brand) → `ConfirmModal` titled "Regenerate live key" with destructive confirm
- Helper: "Live key is shown once when generated. Use Regenerate if you need a new one."

#### Section 4: Billing (all states)

- **Building:** Plan → "Test mode — Free"; muted "No credit card required."
- **Pending / Extended Review:** Registration fee → "$49 paid · Mar 10, 2026"; "View account billing →" link (right-aligned). No Plan row.
- **Registered:** Plan → "$19/mo"; Includes → "500 messages, then $8 per additional 500"; Next billing → date; "Manage billing →" link; divider; "Cancel plan" text link (right-aligned, `text-tertiary hover:text-error-primary`).
- **Rejected:** Registration fee → "$49 refunded · date"; Plan → "Test mode — Free".

**Cancel plan modal:** Custom inline modal (not shared `ConfirmModal`). `bg-black/50` backdrop. Body: "Your plan will stay active through April 14, 2026. After that, live messaging stops but your test environment stays available — your code, your API key, and your test setup aren't going anywhere." Input labeled "Type CANCEL to confirm" (placeholder "CANCEL"). Buttons: "Keep plan" (grey) / "Cancel plan" (red, disabled until input strictly equals "CANCEL").

---

### Account Settings — `/account`
**File:** `prototype/app/account/page.tsx`
**Status:** Scaffolded — holds the account-level fields carved out by D-347. Implements PRD_SETTINGS v2.3 §8. All actions are brand-link no-ops for the prototype.

**Entry point:** Avatar dropdown in the top nav → "Account settings." The dropdown is the only way to reach this page; it's not linked from per-app Settings.

**Layout:** 600px max-width, centered. Back link ("← Back to {appName}", currently hardcoded to GlowStudio) → `<h1>Account settings</h1>` (`text-2xl font-semibold`, `mb-6`). Sections stack as cards (`rounded-xl border border-border-secondary bg-bg-primary p-5`, `space-y-6`).

- **Login card:** Heading "Login" + row "Email" / `jen@glowstudio.com`. Right-aligned "Change" brand link (no-op). No auth phone row — RelayKit uses email-only magic-link auth (D-03/D-59), per PRD v2.3 correction.
- **Payment method card:** Heading "Payment method" + row "Card on file" / "Visa ending in 4242". Right-aligned "Manage billing →" brand link (no-op).
- **Danger zone:** Red-bordered card (`border-red-200`). Heading "Delete account" (red). Paragraph: "This will permanently delete your account, all apps, and all data. Active subscriptions will be canceled and carrier registrations wound down. This cannot be undone." Right-aligned tertiary-text "Delete account" link that opens a modal.
- **Delete confirmation modal:** `bg-black/50` backdrop, `max-w-md` card. Same descriptive paragraph, input "Type DELETE to confirm" (placeholder "DELETE"), Cancel (outline) / "Delete account" button (red, disabled until input strictly equals "DELETE"). Confirming is currently a close-modal no-op.

**Not-yet-built on this page:** Real avatar upload, multi-app account picker (today's prototype shows just GlowStudio), password/2FA (magic-link only so N/A), export-my-data flow.

#### Section 5: Notifications (all states)

Card heading: "Notifications." Sub-copy: "Get a text when something needs your attention." Toggle switch (same visual pattern as Instructions toggle), **off by default**. When on: reveals "Texts go to +1 (512) 555-0147" with a "Change" brand link (no-op). When off: destination line hidden.

#### Modals

Shared `ConfirmModal` helper used for the live-key Regenerate modal. Backdrop `bg-black/50`. The Cancel plan modal is custom inline because it needs a text input gate.

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

5. **Billing** — Two-column grid: Plan, Registration fee ("$49 paid [date]"), Monthly rate ($19/mo or $0), Payment status (green "Current" / red "Past due" / gray "N/A"), Current period, Messages this period, Overage.

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

**Bottom:** Pricing breakdown: "Registration submission $49 / Due today $49". Below: "After approval, $19/mo for your live API key and dedicated phone number. 500 messages included monthly. Additional messages $8 per 500. Not approved? Full refund." Monitoring consent checkbox. CTA: "Start my registration — $49".

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
│   ├── account/page.tsx                  # Account settings (account-level, D-347)
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
| ~~Pricing inconsistency~~ | Resolved — all pricing updated to D-320 ($49 flat) / D-321 ($8/500 overage). No go-live fee. | D-320, D-321 |
