# PROTOTYPE_SPEC.md — RelayKit

> **Purpose:** Screen-level specifications for every UI surface across all RelayKit prototyping work — both the `/prototype/` app (modeling `app.relaykit.ai`, the post-signup workspace) and the `/marketing-site/` app (production marketing at `relaykit.ai`). CC writes and maintains as prototyping evolves.
>
> Not for: backend implementation (MESSAGE_PIPELINE_SPEC, SDK_BUILD_PLAN), customer-experience narrative (PRODUCT_SUMMARY), decisions that resolve alternatives (DECISIONS). If code disagrees with spec, code wins — flag the discrepancy.

## Screen-Level Prototype Specifications
### Last updated: May 14, 2026

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

**Logged-out nav:** RelayKit wordmark (left) only. No Use Cases dropdown, no Compliance link, no Sign in button. Post-2026-05-14 marketing-surface migration, no logged-out user reaches a page rendering the full top-nav from inside the prototype: `/` redirects, `/sms/*` is archived, `/start/*` uses a wordmark-only override nav, `/apps` requires auth. The only surviving logged-out destination is `/sign-in` (see below) where the layout TopNav renders with wordmark only. (D-118, last touched 2026-05-14.)

**Logged-in (app) nav:** RelayKit wordmark (left, always `href="/apps"`) → "Your Apps" (plain text link to `/apps`, left-aligned after wordmark) → avatar button (right, 32px round `bg-gray-200` with `User01` icon). Clicking the avatar opens a dropdown menu aligned to the right edge: **Account settings** (→ `/account`) and **Sign out** (`setLoggedIn(false)` + `router.push("/sign-in")`). Menu closes on outside click. The freestanding "Sign out" text link was removed — sign out lives exclusively in the avatar dropdown. No Prototype badge, no pill styling. (PRD_SETTINGS v2.3 §2; implements D-347; sign-out target updated 2026-05-14.)

Per-project tabs live exclusively in the app layout shell, not in top nav. (D-118)

**Breadcrumbs:** No surviving prototype route uses breadcrumbs. Category landing, public messages page, and `/compliance` — all of which previously carried "Home / …" breadcrumbs — were archived (Session 87 + 2026-05-14 marketing-surface migration). Breadcrumbs may return when category pages eventually land on the marketing-site per Phase 2a content authoring (D-384).

### Sign-In Modal (DORMANT, post 2026-05-14)
**File:** `prototype/components/sign-in-modal.tsx`. Dormant — no active importer. The `/sign-in` route (see Pre-Auth Surfaces below) is the source of truth for the email→OTP flow; the future auth refactor will retire both together.

### State Switchers (Prototype Only)

Every page that has multiple lifecycle states includes small dropdown selectors (`text-xs text-text-quaternary`) for switching between states during development. Positioned LEFT of the status indicator (colored dot + label) with 40px gap (`ml-10`) between last switcher and status indicator. Native browser chevrons (no custom icons). These are prototype controls — production state comes from server data. Retain throughout prototype work; strip when porting to production.

### Footer (DORMANT, post 2026-05-14)
**File:** `prototype/components/footer.tsx`. Dormant — no active importer (target marketing pages all archived). Canonical production footer lives at `marketing-site/components/footer.tsx`.

### Auth

The placeholder `/sign-in` route provides the email → OTP flow (see `/sign-in` page below). "Sign out" in top nav calls `setLoggedIn(false)` + `router.push("/sign-in")`. The `/apps` route guard redirects unauthenticated visits to `/sign-in`. Production uses email OTP (D-59); the future auth refactor will replace the placeholder.

### Design System

Plain Tailwind with Untitled UI semantic color tokens. No Untitled UI base components imported in prototype. All semantic colors (`text-primary`, `bg-secondary`, `border-brand`, etc.) per CLAUDE.md design system rules. Icons from `@untitledui/icons`. Note: `ShieldCheck` does not exist — use `ShieldTick`.

### Data

All data is mocked. Session context provides state management. localStorage key: `relaykit_personalize` (messages page personalization). sessionStorage key: `relaykit_prototype` (session context).

---

## Pre-Auth Surfaces

Post 2026-05-14 marketing-surface migration, the prototype models `app.relaykit.ai` and contains no marketing pages. Only two routes are reachable without an authenticated session: the root redirect and the placeholder sign-in landing. Marketing-shaped surfaces — the old marketing home, the `/sms/[category]` category landing, the `/compliance` page — were all archived; archived copies live under `prototype/archive/` with mirrored source paths.

### Root redirect — `/`
**File:** `prototype/app/page.tsx`
**Status:** Stable (placeholder).

Thin client component. Reads `state.isLoggedIn` from `useSession()`, then in `useEffect` calls `router.replace("/apps")` for logged-in users and `router.replace("/sign-in")` otherwise. Renders `null` during the redirect tick. The route exists primarily to give the session-context-driven redirect a single source-of-truth landing; future hardening (Supabase server-side auth) will reshape this.

### Sign-In Landing — `/sign-in`
**File:** `prototype/app/sign-in/page.tsx`
**Status:** Stable (placeholder).

Standalone two-step email → OTP page. Reuses the form content from `prototype/components/sign-in-modal.tsx` (now dormant), wrapped in a standalone page layout — centered card on `bg-bg-primary` with `rounded-2xl p-8 shadow-xl`, max-width 400px, vertically centered inside `min-h-[calc(100vh-3.5rem)]` (viewport minus top-nav height), no backdrop, no XClose. The page renders inside the standard root layout, so the top-nav appears above it — for a logged-out user, that nav shows wordmark only.

**Step 1 (Email):** Mail01 icon (brand secondary) → "Sign in to RelayKit" h2 → email input → "Send code" button. 500ms "Sending..." disabled state on submit before advancing.

**Step 2 (OTP):** Mail01 icon (success secondary) → "Check your email" h2 with submitted email echoed back → 6-digit OTP input row (auto-advance, paste support, backspace navigates back) → resend-code countdown ("Resend code in 0:30" → clickable "Resend code" at 0) → "Use a different email" back-link → "(Prototype: any 6 digits will work)" hint. Auto-submit on 6 complete digits: `setLoggedIn(true)` + `router.push("/apps")`.

Pending the future auth refactor (Supabase social providers, UI redesign), which will retire this placeholder along with the dormant `SignInModal`.

---

## Production Marketing Site — `relaykit.ai`

The production marketing site is a separate Next.js app at `marketing-site/` (deployed to Vercel per D-366; branch-and-preview workflow per D-368). It is not the prototype. Sections below cover surfaces that have stabilized on the production marketing surface; layout/visual specs live here, architectural commitments live in DECISIONS.

### Home page (`/`) — six-section structure (after iteration cycle on `feat/home-page-restructure`)

The home page composes six sections plus a closing CTA strip, in this order. Inter-section vertical rhythm is uniform 100px (`mt-[100px]` on each section, `pt-[100px]` for the configurator's section-top padding, `mb-[100px]` for the closing CTA's bottom). The hero's `pt-16` is page-top padding, not inter-section.

1. **Hero** — left-aligned, single column inside the existing `max-w-5xl` wrapper. H1 "SMS for builders", subhead "Two files. Your AI tool. A working SMS feature." (drop "coding" — the wordmark row below establishes context), eyebrow "$49 + $19/mo. Three days to live." (small, weight 500, primary text), and an AI-tool wordmark row (Claude Code, Cursor, Windsurf, GitHub Copilot, Cline) using SVGs in `marketing-site/public/logos/tool_logos_wordmarks/` (`{claude_pos, Cursor_pos, windsurf_pos, Copilot_pos, Cline_pos}.svg` — case preserved as Joel placed them). Per-logo `heightClass` tunes visual weight: Cursor `h-[22px]` (icon + wordmark, slightly taller), Cline / claude `h-[18px]` (pure wordmarks), Copilot `h-[20px]`, windsurf `h-[44px]` (compensates for ~33% canvas occupancy in its viewBox padding). Light mode: all logos render with `brightness-0` for uniform black. **Dark mode (D-378):** AI_TOOLS carries an optional `negSrc` field. Cline / Cursor / Windsurf have `_neg.svg` variants in `marketing-site/public/logos/tool_logos_wordmarks/` and dual-render via `<span className="contents">` wrapping a pair of `<Image>` elements (`block dark:hidden` for `_pos`, `hidden dark:inline-block` for `_neg`, `aria-hidden` on the duplicate). Claude / Copilot have no `_neg` asset yet (TODO comment on the const flags Joel-action) and use the CSS filter workaround `brightness-0 dark:invert` — Tailwind composes filters as `brightness(0) invert(1)`, which crushes to black then flips to white. Row spacing: `gap-x-10 gap-y-3`. The earlier OTP visual element is removed; `hero-otp-visual.tsx` was deleted.
2. **Configurator** — see Configurator Section below. CTA reads "Start building with SMS →" and bottom-aligns with the categories panel — see that subsection's Bottom CTA block for divergence-from-prototype detail.
3. **Build it** — eyebrow "Configure > Build" (`text-xs font-semibold uppercase tracking-wide text-text-primary`), H2 "Two files. Your AI tool." (no subhead). Two-column 50/50 grid (`md:grid-cols-2 gap-12`). Left column: two short prose paragraphs with path discrimination embedded in the openers — "Starting fresh. RelayKit slots into the starter kits you use — ShipFast, Supastarter, MakerKit, Vercel + Supabase." and "Already built. Hand the build spec to your AI tool, point it at where you handle auth, and let it wire up the rest." Right column: a styled `<pre>` code block on `bg-bg-code-surface` (D-378 — gray-950, theme-invariant; distinct from `bg-bg-primary-solid` which flips to gray-900 in dark mode) with hand-tokenized syntax highlighting using Untitled UI semantic tokens (`text-fg-brand-secondary` for keywords, `text-fg-success-secondary` for string literals, `text-fg-warning-secondary` for identifiers and object keys; default text `text-text-white`). `text-sm font-mono`, `px-6 py-6`, `rounded-xl`. The code surface stays inverted (dark surface, light text) in both themes — code samples don't flip with the page. Caption "That's the send." in `text-xs text-text-tertiary` directly below.
4. **Test it for real** — eyebrow "Build > Test", H2 "Real SMS, before customers see anything." (single H2 absorbs the prior subhead element; closer "When you go live, it's the same code path. No surprises." also dropped). Two-column 50/50 grid (`md:grid-cols-2 gap-12 items-start`). Left column: two body-copy h3 subheads ("Preview list" / "Testing utilities") each followed by a tight paragraph. Right column: `marketing-site/components/preview-list-mock.tsx` (static replica of `prototype/components/test-phones-card.tsx` — three rows: Joel verified / Sarah verified / Mike invited, plus a non-functional "+ Invite someone" link in `text-text-brand-secondary`). The left-col "Preview list" h3 sits at the same y-line as the top of the mock card on the right, deliberately rhyming with the mock's own internal "Preview list" h3.
5. **Pricing + Paperwork (combined)** — eyebrow "Test > Go live" (single eyebrow above both columns, spans full section width). Two-column 50/50 grid (`md:grid-cols-2 gap-12 items-start`). **Left column: pricing.** H2 "Simple pricing." (the eyebrow "Simple pricing" promotes to H2; the prior pricing H2 "Free to build. $49 + $19/mo to go live." retired). Single staged card (no max-width — sizes to its column, `rounded-xl border border-border-primary p-8`): Stage 1 "Build for free" body / `<hr className="my-6 border-border-secondary" />` divider / Stage 2 "Go live for $49 + $19/mo" body. Below the card: fine-print row ("Marketing categories add $10/mo. Volume pricing above 5,000 messages.") then scope paragraph ("US and Canada at launch. We don't handle HIPAA, healthcare-regulated workflows, or enterprise procurement."). **Right column: paperwork.** H2 "We handle the paperwork.", body period-list of nouns ("Registration paperwork. The approval back-and-forth. The opt-in form your users see. STOP handling. Opt-out tracking. Delivery monitoring."), italic kicker "We read it so you don't have to."
6. **Closing CTA strip** — left-aligned (no `text-center`). H2 "Ready when you are.", subhead "Configure today. Live in three days. Refund if not approved.", "Get early access" CTA matching top-nav styling (border + `bg-bg-primary` + `text-text-secondary`) and destination (`/start/verify`). `mb-[100px]` to the footer.

D-376 records the "three days" / "about three days" copy convention for carrier approval, superseding D-215. The hero eyebrow and closing CTA subhead use "three days"; pricing card Stage 2 body uses "Approval takes about three days."

Sections retired during the original Session 75 home-page restructure (commit `8abb103`): the prior "How it works" 3-step block, a small pricing context line, an 8-card "Explore use cases" grid, a 4-card "Why RelayKit?" compliance grid, and the "You shouldn't need a telecom degree…" comparison table. The configurator demonstrates use cases interactively (D-375); Sections 3/5 cover the work the retired blocks did, in tighter on-voice form.

Iteration commits on `feat/home-page-restructure` after the original restructure (chronological): `f655ce9` next/image for hero logos + semantic div for inert Continue; `ca46678` wordmark logos + drop hero OTP + drop "Included" pill on Verification; `38538e1` left-align home + balance logos + merge paperwork+pricing; `1ae01f0` windsurf logo height fix for SVG padding; `ff2b0ac` Verification toggleable + D-377; `e709760` D-377 close-out (REPO_INDEX bump + CC_HANDOFF carry-forward); `ceb8abf` Section 3 cut to single H2 + two-paragraph body + dark code block; `5204b54` Section 4 absorbs subhead into H2 + two h3+body pairs; `4d5272e` swap pricing/paperwork columns; `af3e0e3` CTA copy "Start building with SMS →" + bottom-align CTA block; `a00da51` uniform 100px inter-section spacing; `5e9e6b8` lifecycle eyebrows on Sections 3/4/5+6.

**Dark mode (D-378, branch `feat/dark-mode`).** The marketing site supports light/dark mode via vanilla React + CSS — no `next-themes` dependency. Mechanism: `.dark` class on `<html>`, theme persisted to `localStorage` key `relaykit-theme`, first-visit default from `prefers-color-scheme`, FOUC prevented by an inline pre-hydration script in `app/layout.tsx` paired with `suppressHydrationWarning`. The `useTheme` hook (`marketing-site/lib/use-theme.ts`) returns `{ theme, toggle }` with a null-during-mount state so the toggle button can render a non-breaking placeholder rather than guess server-side. Top-nav exposes the toggle (label "Light mode" / "Dark mode" depending on current state). The body is painted `bg-bg-primary` so sections without their own background pick up the theme (UA canvas-dark would otherwise diverge from `bg-primary` by ~8 RGB units). New semantic token `bg-bg-code-surface` is defined as `gray-950` in both themes, used by the Section 3 code block. Brand-color shifts in dark per D-378: `bg-brand-solid` flips `brand-600 → brand-500`, brand text tokens shift up to `brand-300/400` for adequate contrast on dark surfaces. Dark-mode iteration commits: `1164c8b` token block in globals.css; `62cf4ee` inline FOUC script + `suppressHydrationWarning`; `c10d549` useTheme hook + lint coverage for `lib/`; `5baa47e` dark-mode toggle in TopNav; `c844609` body painted `bg-bg-primary`; `98641b2` `text-white → text-text-white` on configurator + edit-card brand-solid CTAs; `37e28f5` wordmark `_neg` variants; `82c126c` `bg-bg-code-surface` token + home `<pre>` swap.

### Configurator Section — `/` (home, second section after hero)
**File:** `marketing-site/components/configurator-section.tsx`
**Status:** Stable (merged to main Session 75; further home-page sections built around it on `feat/home-page-restructure`)

Pre-signup mockup that lets a visitor scope which messages they would ship and personalize them with their own business name and website. Section structure top-to-bottom:

1. **Header** — H2 "Configure your messages" (`text-2xl`), subhead "All messages included. You can change these later in your workspace." 60px gap from the bottom of the hero subhead. Section's outer wrapper uses `pt-[100px] pb-16 sm:pb-20` (was `pt-15 pb-16 sm:pb-20`) per the home-page uniform 100px inter-section rule.
2. **Two-panel grid** — `md:grid-cols-[3fr_7fr]`, `gap-8`. No `items-start`: cells stretch to the row's max content height so the right-column CTA can bottom-align with the categories panel (see Bottom CTA block below). Left = Categories card (rounded-xl border, `md:min-w-60`); right = Messages column (borderless, `md:max-w-[540px]`, `flex flex-col` to support `mt-auto` on the CTA).

**Left panel — Categories card:**
- "Categories" h3 at top.
- "Recommended combinations" labeled `<select>` (native, `appearance-none` + ChevronDown overlay). Options in dropdown order: Verification only / SaaS / Personal services / Real estate / Fitness / E-commerce / Custom, then a disabled `──────────` separator option, then "None". **Default on page-load: "Verification only" (D-377).** Picking a combination pre-checks that combination's defaults. Manual category toggling re-derives the dropdown via `resolvePackId(selected)`: empty selection → "None"; selection that exactly matches a preset's defaults → that preset's id; anything else → "Custom". "None" means truly nothing checked (was previously `["verification"]` when Verification was locked on).
- 12px space below the dropdown (`pb-3` on the header section; was `pb-6` pre-Session-75-iteration).
- Categories list, one row per vertical (Verification / Appointments / Order updates / Customer support / Marketing / Team alerts / Community / Waitlist). Each row: checkbox + title + description (always visible, drawn verbatim from the prototype's onboarding `categories.ts`). **All categories including Verification are toggleable (D-377)** — no "Included" pill, no `disabled` props on the checkbox or button. Marketing's row, when selected, shows a "Requires EIN. Adds a few days to registration." note. Rows use `border-b border-border-secondary py-5`. **When zero categories are selected**, the right-pane message-preview area shows a centered placeholder with a dashed border: "Pick a category to see message previews." (`text-sm text-text-tertiary`).

**Right panel — Messages column (borderless, content flows in the section directly):**
- **Top row**: tone pills (Standard / Friendly / Brief — left, `rounded-full`) + Copy button (right, tertiary — text + Copy01 icon, no border, no bg). Justify-between, wraps on mobile.
- **Personalize inputs** below the top row, 16px gap. Two side-by-side text inputs (`sm:grid-cols-2` when both shown, single column otherwise): "Your business name" placeholder, "yourwebsite.com" placeholder. The website input only renders when at least one currently-rendered body in the selected verticals contains the `{website}` token.
- 32px gap below the inputs (`mt-8`) before the first vertical group title.
- **Vertical groups**: 28px between groups (`space-y-7`). Each group has a title (`text-base font-semibold` — matches "Categories" h3 in the left panel) above the message stack.
- **Message read-cards**: rounded-xl border, shadow-xs. Title row at top with name + InfoIcon tooltip (hover/focus shows trigger description in a dark tooltip overlay) + edit pencil at right. 4px below the title row (`mt-1`) the body renders via `interpolateTemplate` — variable tokens render as brand-purple inline spans (D-356 / D-350 styling, no editor chips in read state). No separate hardcoded "Acme:" prefix; the colon is part of the template's leading clause `{business_name}: …`.
- **"+ Add message"** appears at the bottom of each group's stack as a full-width button with a solid `border-border-secondary` border, `Plus` icon + "Add message" label, brand-secondary text. Click expands an inline editor in place of the button. While one add-editor is open, every other group's "+ Add message" button is disabled with `cursor-not-allowed disabled:opacity-60`.
- **Bottom CTA block** (below the last vertical's "+ Add message" button): one-sentence supporting text "Next: a few quick questions, then you build with your AI tool while we register you. Three days to your first real text." (`text-sm text-text-secondary`), then a full-width 60px (`h-15`) brand-purple primary button "Start building with SMS →" (arrow part of the label). Routes to `/signup`. **Marketing-side divergence:** the wrapper uses `mt-auto pt-8` (not `mt-8`) inside a `flex flex-col` right-column container; the outer grid drops `items-start` so cells stretch to the row's max content height. Net effect: when the categories list is taller than the message preview list, the CTA stays bottom-aligned with the bottom edge of the categories panel rather than sitting flush against the message list. Button copy on the marketing surface reads "Start building with SMS →" rather than "Save to my workspace →" — these are the **two marketing-side divergences from the prototype**, which keeps the prior `mt-8` spacing and the prior "Save to my workspace →" copy. Future edits to either side must consciously decide whether to mirror or hold the divergence.

### Configurator edit-card — Tiptap-based message editor
**File:** `marketing-site/components/configurator/message-edit-card.tsx`
**Status:** Stable (merged to main Session 75)

Click pencil on a message read-card → it swaps to the edit card. Card replicates the dashboard's edit-mode (`prototype/components/catalog/catalog-card.tsx` lines 591–884) minus AI input, monitor mode, and badges. Per D-375, the editor is replicated, not extracted.

Top-to-bottom:
- **Header row**: name + InfoIcon tooltip (same as read-card) at left; "Edit" label + pencil icon at far right (replaces the action icons of the read-card).
- **Editor body** (Tiptap, ported `MessageEditor` consumes the `{key}` template format): variable tokens render as atomic, indivisibly-selectable purple chips per D-350. Cursor cannot land inside a chip; backspace deletes the whole chip. Enter is suppressed (single-line SMS).
- **Compliance + Fix row** (right-aligned, only shown after the compliance check has been failing for ≥2s): one `text-text-error-primary` line per missing piece ("Needs Business name", "Needs opt-out language"), and a "Fix" button (border-primary, hover bg-secondary). Click Fix → 1500ms simulated loading state ("Fixing…" + spinner), then template restores to the last canned tone-pill's variant (D-356-style restoration), Save re-enables.
- **Tone-pill row + + Variable popover** (single flex-wrap row):
  - Tone pills (Standard / Friendly / Brief, left): rounded-full, brand-secondary fill when active, border-secondary outline when not. Click a canned pill → the body resets to that variant's template; if the user was on Custom, the prior text is buffered.
  - "Custom" pill auto-appears (with dashed border) once the body diverges from any canned variant. Click → restores the buffered custom text.
  - "+ Variable" button (right of pills, `ml-auto`): tertiary brand-secondary text + Plus icon. Click toggles a popover anchored to the button. Popover lists the message's `variables` array; each row shows label (left) + preview value (right, brand-purple). Click a row → inserts the variable as an atomic chip at the editor's caret. Outside-click and Escape close the popover.
- **Save / Cancel** at far right. Save is `bg-bg-brand-solid`, disabled while compliance fails OR Fix is loading. Cancel is text-only, discards the local edit state and returns to the read card.

**Per-message tone override model:**
- The Messages-column top row's tone pills set the **global** default for every message that does not have a per-message override.
- When the user opens an edit card and clicks a different tone pill, that becomes the **per-message** override. It persists for that message only, across global tone changes.
- Custom-pill state means the user edited the body text away from any canned variant. On Save with the Custom pill active, the edited body is stored as a per-message custom; the per-message tone override is left untouched.
- On Cancel, no parent state changes.
- Custom (user-added via "+ Add message") messages have no canned variants and therefore no tone-pill row — the edit card shows the editor + "+ Variable" + Save/Cancel only.

### Configurator data conventions

**Stub message templates** (each of the 18 stubs in `configurator-section.tsx` carries three variants — Standard / Friendly / Brief):
- **Standard variant** always begins with `{business_name}: ` (literal colon + space after the variable). The colon is part of the template, not a hardcoded JSX prefix. This applies across all 18 Standard variants regardless of vertical. Read-state renders "{business_name}" as a brand-purple chip.
- **Friendly / Brief** variants keep `{business_name}` somewhere in the body (compliance still requires it) but the surrounding sentence shape is free to differ — Friendly tends warmer with exclamations, Brief trims to essentials.
- **Variables** are declared per stub message in a `variables: string[]` array. Compliance + the "+ Variable" popover both read from this list. Variable preview values come from `marketing-site/lib/configurator/example-values.ts`, keyed by `verticalId`. The `business_name` and `website` values resolve from the user's input (with "Acme" / "acme.com" fallbacks); other keys (code, day, time, order_id, etc.) are static stub values.
- **`requiresStop`** is `true` for every vertical except Verification. Verification messages explicitly omit "Reply STOP to opt out" — STOP would cancel the codes the user actively wants.

**"+ Add message" prefill** (Tiptap pre-fills the editor with this template, with `{business_name}` rendered as a chip and the rest as plain text):
- Non-Verification verticals: `{business_name}: [your message here] Reply STOP to opt out.`
- Verification: `{business_name}: [your message here]` (no STOP).

The placeholder `[your message here]` is plain text the user replaces. Starting state is compliant — the variable is present and (where required) STOP language is present — so Save is enabled the moment real content replaces the placeholder.

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

**Top nav (rendered by TopNav, wizard-aware):** RelayKit wordmark + "Appointments" pill (left) → state switcher dropdown + onboarding nav dropdown (right). No "Your Apps" link, no Sign out. TopNav detects the wizard context via pathname + registrationState — regex matches `^/apps/[appId](/(ready|signup(/verify)?|get-started))?$` — workspace root or any wizard subroute (D-345). Sign out is hidden on all wizard-state pages.
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
- **Custom messages are exposed in onboarding.** The `+ Add message` row at the top of the stack, the active custom cards, and the `Archived (N)` disclosure all render in wizard mode using the same `CustomMessageCard` and session-state machinery as the post-signup workspace. Customs persist across the state-switcher boundary because both modes share the same `state.customMessages` array. **Continue with an in-progress unsaved custom silently discards it** — the page registers a `WizardContinueContext` override that calls `deleteCustomMessage(unsavedCustomId)` then routes to `/apps/[appId]/ready`, mirroring the hydration zombie-cleanup in `session-context.tsx`. No new copy.
- Bottom "Continue": full-width purple button spanning the 540px content column, rendered by WizardLayout (D-318 — dual Continue). Honors the same `WizardContinueContext` override as the top-right Continue so the click semantics are consistent across both CTAs.

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

**Files:** `prototype/components/catalog/custom-message-card.tsx`, `prototype/components/catalog/message-action-modal.tsx`, `prototype/lib/slug.ts`; wired into `prototype/app/apps/[appId]/page.tsx` for **both** wizard (onboarding) and post-onboarding states. Customs created during onboarding survive the state-switcher into the workspace via the shared `relaykit_prototype` sessionStorage; an in-progress unsaved custom is silently discarded if the user clicks Continue (see "Onboarding mode" above).

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

### Verification panel (Messages page)

Placement: above the Messages list on the workspace page. Distinct visual treatment from message cards — this is a panel for the Verification feature included with every vertical (D-360, D-369), not a message in the per-vertical catalog.

Contents at launch:
- Editable verification template (compliance gates per D-371; canonical message body and rules in VERIFICATION_SPEC §7)
- Test-send affordance — round-trip with code entry, restricted to RelayKit-account-holder verified phones during beta
- Recent Activity rows, capped at 5 (matches other message cards)

Out of scope at launch (parked in BACKLOG):
- "View all" clickthrough to full message log
- TTL / code-length config UI (locked at 6 digits / 10 min per D-360)
- Rate-limit config UI (support-escalated at launch per VERIFICATION_SPEC §6)
- Verification-specific debug mode toggle (existing message-type debug mode applies)

Onboarding wizard: no Verification panel. Verification renders identically to other verticals' message lists in wizard view. The activation moment is the onboarding round-trip OTP test (VERIFICATION_SPEC §9), not a settings panel.

Compliance gates extend existing message-editor logic (`/prototype/lib/editor/`) with one new required-and-immutable placeholder: `{code}` for verification templates. All other gates (opt-out, character cap) inherit unchanged.

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

### Opt-in form component (MOVED, post 2026-05-14)
**File:** `marketing-site/components/catalog/catalog-opt-in.tsx` (was `prototype/components/catalog/catalog-opt-in.tsx`; archived prototype copy at `prototype/archive/components/catalog/catalog-opt-in.tsx`).
**Status:** Dormant on marketing-site, awaiting Phase 2a (D-384) category-page consumption. Renders: form preview with name + phone inputs, category-named consent checkbox (e.g., "I agree to receive appointment text messages from {appName}."), optional separate marketing-consent checkbox (when message set has marketing-tier entries), TCPA fine print, "Sign up for messages" CTA. `CATEGORY_CONSENT_WORD` map keyed by `categoryId`; matches PRD_02 opt-in language pattern.

### Playbook diagram component (MOVED, post 2026-05-14)
**File:** `marketing-site/components/playbook-flow.tsx` (was `prototype/components/playbook-flow.tsx`; archived prototype copy at `prototype/archive/components/playbook-flow.tsx`).
**Status:** Dormant on marketing-site, awaiting Phase 2a (D-384) category-page consumption. Exports `PlaybookSummary` (component) and `PLAYBOOK_FLOWS` (data object). Renders a horizontal flow of 6 numbered nodes connected by arrows, each with hover tooltip; vertical stepper on mobile. Heading + tagline above. Returns `null` for categories not in `PLAYBOOK_FLOWS`. Only `appointments` is populated today (6 steps: Booking confirmed → Reminder sent → Pre-visit sent → Reschedule handled → No-show followed up → Cancellation handled, per D-223); additional categories arrive with Phase 2a content authoring.

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

---

## Open design items

### Compliance Modal Revision
**Status:** `[NEEDS REVISION]`

Current "Content blocked" modal has "Fix it with AI" section with copyable prompt — this is wrong (could generate messages outside registered set, causing drift). Replace with plain text guidance: two paths (remove promotional language, or register marketing campaign). Intelligence lives in SMS_GUIDELINES.md, not dashboard-generated prompts.

### Download Confirmation Flow
**Status:** `[NEEDS DESIGN]`

"You're in. Downloading RelayKit..." modal should guide users to Overview. Either auto-redirect or explicit "Go to Overview →" link. Users need to land in the build flow.

**CORRECTION (March 19, 2026):** Initial download always happens on the Messages page, not Overview. Overview and Settings pages don't exist until after download (project creation happens at download time). The confirmation flow should orient the user toward their new project's Overview page.

---

## File Map

Reflects active `/prototype/` after the May 2026 archive waves (2026-05-13 bulk archive + 2026-05-14 marketing-surface migration). Archived files preserved at `prototype/archive/` (mirrored paths); see `prototype/archive/README.md` for the full archived inventory and un-archive procedure.

```
prototype/
├── app/
│   ├── page.tsx                          # Root redirect (auth-aware: → /apps or /sign-in)
│   ├── sign-in/page.tsx                  # Placeholder sign-in landing (email → OTP; reuses sign-in-modal content)
│   ├── layout.tsx                        # Root layout — SessionProvider + TopNav + ProtoNavHelper
│   ├── globals.css                       # Tailwind v4 theme + Untitled UI semantic tokens
│   ├── account/page.tsx                  # Account settings (account-level, D-347)
│   ├── apps/
│   │   ├── page.tsx                      # Your Apps (project list)
│   │   └── [appId]/
│   │       ├── layout.tsx                # App shell — state-based layout switching (wizard vs dashboard)
│   │       ├── page.tsx                  # Workspace home (catalog + custom messages + monitor) — D-345
│   │       ├── ready/page.tsx            # Ready-to-build confirmation
│   │       ├── signup/
│   │       │   ├── page.tsx              # Signup email entry
│   │       │   └── verify/page.tsx       # Signup OTP verification
│   │       ├── get-started/page.tsx      # Final onboarding (D-322)
│   │       ├── register/
│   │       │   ├── page.tsx              # Registration form
│   │       │   └── review/page.tsx       # Review & confirm
│   │       └── settings/page.tsx         # 600px settings page
│   └── start/                            # Onboarding wizard (5 steps)
│       ├── layout.tsx
│       ├── page.tsx
│       ├── business/page.tsx
│       ├── context/page.tsx
│       ├── details/page.tsx
│       ├── verify/page.tsx
│       └── website/page.tsx
├── archive/                              # Files removed in two waves: 2026-05-13 bulk archive + 2026-05-14 marketing-surface migration (see archive/README.md)
├── components/
│   ├── top-nav.tsx                       # Context-aware nav (D-118)
│   ├── wizard-layout.tsx                 # Wizard layout wrapper
│   ├── wizard-step-shell.tsx             # Generic wizard step wrapper
│   ├── dashboard-layout.tsx              # Dashboard layout wrapper
│   ├── proto-nav-helper.tsx              # Dev nav helper (prototype only)
│   ├── sign-in-modal.tsx                 # Email → OTP modal (D-347) — DORMANT after 2026-05-14 (no importer; auth refactor will retire it)
│   ├── footer.tsx                        # Shared footer (D-121) — DORMANT after 2026-05-14 (target marketing pages archived)
│   ├── ask-claude-panel.tsx              # AskClaude slideout
│   ├── copy-button.tsx                   # Reusable copy-to-clipboard button
│   ├── edit-business-details-modal.tsx   # Dev/prototype-only biz-name + service-type editor
│   ├── ein-inline-verify.tsx             # Inline EIN entry / verify widget
│   ├── setup-instructions.tsx            # Setup-instructions block + setup-toggle hook
│   ├── test-phones-card.tsx              # Verified-test-phones management card
│   ├── catalog/
│   │   ├── catalog-card.tsx              # Per-message catalog card (editor + activity)
│   │   ├── custom-message-card.tsx       # Custom-message card variant
│   │   └── message-action-modal.tsx      # Generic action modal
│   └── registration/
│       ├── business-details-form.tsx     # Zod-validated business-details form
│       └── review-confirm.tsx            # Registration review/confirm component
├── context/
│   ├── session-context.tsx               # SessionProvider (logged-in, app state, custom messages)
│   └── setup-toggle-context.tsx          # Setup-instructions visibility toggle
├── data/messages.ts                      # Message catalog (MESSAGES, CATEGORY_VARIANTS, Message type)
├── lib/
│   ├── catalog-helpers.ts                # Catalog interpolation / example values
│   ├── slug.ts                           # Collision-safe slug generation (D-351)
│   ├── variable-scope.ts                 # Per-method variable-scope derivation (D-353)
│   ├── variable-token.ts                 # VARIABLE_TOKEN_CLASSES (D-350)
│   ├── wizard-storage.ts                 # sessionStorage helpers (key: relaykit_wizard)
│   ├── editor/                           # Tiptap editor stack
│   │   ├── message-editor.tsx
│   │   ├── template-serde.ts
│   │   ├── variable-node.ts
│   │   └── variable-node-view.tsx
│   └── intake/                           # Onboarding intake logic
│       ├── use-case-data.ts
│       ├── validation.ts
│       ├── industry-gating.ts
│       └── templates.ts
├── public/logos/                         # SVG logos
├── middleware.ts                         # Edge middleware (strips cookies on localhost)
└── (next-env.d.ts, next.config.ts, package.json, tsconfig.json — config files)
```

---

## Known Issues & Inconsistencies

| Issue | Status | Ref |
|-------|--------|-----|
| `.next` cache corruption recurring | Workaround: delete before every restart | CC_HANDOFF gotcha #1 |
| D-17 override: Experience Principles line 88 says "5–7 days" | Needs doc fix | D-17 |
| "Appointments" pill hardcoded in layout.tsx | Needs dynamic category | CC_HANDOFF gotcha |
| Compliance modal "Fix it with AI" generates risky prompts | Needs revision | PM_HANDOFF item 2 |
| Bar thickness 8px consistency across row 2 cards | May need verification | PM_HANDOFF |
| Registration form pre-fill: "Pre-filled" state may not auto-validate EIN path fields | Touch-all ref validates on click, but initial mount may not trigger | Register page |
| `proto-nav-helper.tsx` references `/apps/[appId]/overview` — phantom route, file never existed on disk | Cleanup deferred per BACKLOG; survived both archive waves | Audits 2026-05-13 + 2026-05-14 |
