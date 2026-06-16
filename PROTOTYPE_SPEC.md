# PROTOTYPE_SPEC.md — RelayKit

> **Purpose:** Screen-level specifications for every UI surface across all RelayKit prototyping work — both the `/prototype/` app (modeling `app.relaykit.ai`, the post-signup workspace) and the `/marketing-site/` app (production marketing at `relaykit.ai`). CC writes and maintains as prototyping evolves.
>
> Not for: backend implementation (MESSAGE_PIPELINE_SPEC, SDK_BUILD_PLAN), customer-experience narrative (PRODUCT_SUMMARY), decisions that resolve alternatives (DECISIONS). If code disagrees with spec, code wins — flag the discrepancy.

## Screen-Level Prototype Specifications
### Last updated: June 16, 2026

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

### Home page (`/`) — v10 marketing home (Session 127; D-427/D-428; reworked Sessions 129–131; reordered + "The numbers" section added Session 135)

The home is a **marketing page**, not the configurator tool. It is composed from one component per section under `marketing-site/components/home/*`; `app/page.tsx` is a server component (`MarketingHome`) that also carries three inline section components — `Recognition`, `StatusBand`, and `Test`. The free message configurator — the standalone authoring tool — lives at its own route, **`/messages`** (D-428; see "Configurator tool page — `/messages`" below); the home embeds the *same real* `<ConfiguratorSection/>` in a clipped window rather than forking it. **Dark mode is the site-wide default and is not user-switchable** (D-430). A single **metallic-gold accent** (`#E0B010`, D-427) sits over the D-405 monochrome base — primary CTAs, eyebrow dots, the `StepStrip` progress bars + gold forward links, the hero mock's selected-category checkbox + Copy CTA, paperwork featured-icon tints, the code-snippet identifier highlight, pricing Stage labels + ticks, and the Preview-list "Invited" dot; green/red carry status/friction *meaning* per D-405. All gold flows through tokens (`--color-gold`, `bg-bg-gold`, `text-gold`, `text-on-gold`, etc.); no raw hex outside `globals.css`.

**Eyebrow system ("The ___").** Every section opens with an `<Eyebrow>` (`components/home/section-ui.tsx`; gold dot) whose label is a uniform **"The {noun}"** — The problem / The process / The messages / The variables / The numbers / The paperwork / The build / The test / The price / The start. The **hero carries no eyebrow**. (This replaces the prior mixed eyebrow phrasings — "Why RelayKit", "How it works", "What we handle", etc.)

Each section is a full-bleed `<section>` constrained to `max-w-5xl px-6`, separated by `border-t border-border-secondary`, padded `py-20 sm:py-28` (the StatusBand is the one slim exception, `py-8`). Sections in order:

1. **Hero** (`hero.tsx`) — **no eyebrow**; H1 "The easiest way to add text messaging to your app." (`text-balance`, scaling up to `lg:text-[64px]`); subhead "Ready-made texts that cut no-shows, support tickets, and missed codes."; a gold `PrimaryCta` "See the messages →" (→ `/messages`) + a `GhostCta` "Join the list" (→ `#join`); a trust line ("Free to build & test · No credit card · US & Canada"). Right column: the **interactive self-clipping `<HeroConfiguratorGraphic/>`** (`hero-configurator-graphic.tsx`) — a fixed-height (`h-[480px]`), `overflow-hidden`, uniformly-bordered configurator card that auto-advances its active category every 4s with a ~280ms fade, pausable via a bottom pause/play toggle, honoring `prefers-reduced-motion`. It is **state-isolated**: it owns only local view state, calls no configurator/elig hooks, and never touches localStorage (so it can't clobber the real embedded configurator or `/messages`); it reuses the real `<MessageReadCard>` so message styling/content track automatically, while its left rail is hand-built (must be hand-synced if the category set or checkbox styling changes). Behind the card: a masked dot-grid texture (`DOT_GRID_STYLE`) and a soft ambient glow (`HERO_GLOW_STYLE`, brand warm-gray rgb 149 134 117 — **not** gold). The old `PhoneMock` + `category-rotor.tsx` are **deleted** (no text rotor remains; see the removed-rotor note at the end of this section).
2. **StatusBand** (`StatusBand()` in `app/page.tsx`, no `id`) — a slim centered band (`py-8`) between Hero and the paperwork section: "Our free message templates are live." over a tertiary "Sending arrives Summer 2026."
3. **Paperwork** (`id="rules"`, `paperwork.tsx`) — eyebrow "The paperwork", H2 "You build the feature. We handle the bureaucracy.", three cards (Registration handled / Messages compliant / Opt-ins & opt-outs covered) with gold-tint (`bg-bg-gold/15`) featured-icon backgrounds. Each card carries a red plain-language **problem line** (`text-fg-error-secondary`, `font-medium`) between the title and the body — the friction the card resolves ("Getting approved on your own can take weeks." / "Send the wrong kind of message and carriers block it — silently." / "Miss a single STOP and the fines add up fast.").
4. **The messages** (`id="configurator"`, `messages-section.tsx`, **D-435**) — eyebrow "The messages", H2 "Messages for every job.", bridge "From login codes to event invites, every message your app sends is ready to use." A lightweight **category-pills message browser** (client component) — **replaced the prior clipped `<ConfiguratorSection/>` embed** (D-435 partially supersedes D-428; the old peek + its "Copy the templates… Twilio, Sinch, Telnyx…" trust paragraph are gone from the home). **Category selector:** 9 categories, single-select — **desktop (`md`+): two pill rows (4 + 5)** in order Account events · Order updates · Appointments · Verification / Customer support · Team alerts · Waitlist · Community · Marketing; **mobile (below `md`): a single horizontal-scrolling pill row** (`flex-nowrap overflow-x-auto`, scrollbar hidden, slightly larger pills `px-4 py-2.5 text-sm`) — not a native select. Default = Account events; selected pill = gold (`bg-bg-gold text-text-on-gold`), others muted. **Controls row** (breakpoint `md`): a business-name input (placeholder "Your business name") carrying a **clear (X) button** at its right edge whenever it's non-empty (clears via `setBusinessName("")`, `pr-10` keeps text off it) + the tone control. **Desktop (`md`+):** input at `md:w-80` + the three tone **pills** Standard/Friendly/Brief; selected tone = **monochromatic neutral** (`bg-border-primary text-text-primary`, NOT gold — gold is reserved for category selection). **Mobile (below `md`):** one row — name input (`grow-[2]`) beside a tone **`<select>`** (`grow`; same Standard/Friendly/Brief, same `tone` state via `setTone`), `gap-3`. Stack: category → 32px → controls → 16px → cards. **Cards:** 2-col grid (`bg-surface-card`) of the selected category's real corpus messages in the active tone, rendered via `interpolateBody` — gold pip + `Message.name` title + body with **every `{{token}}` value bolded** (`font-medium text-text-primary`: business name AND all others); literal copy + the "Reply STOP to opt out." tail stay plain; the business name shows **"Acme"** until the visitor types (presentation only, never written to the store). **Fixed-height dot-paginated carousel:** 6 cards/page (2 cols × 3 rows, `h-[394px]` + `overflow-hidden` at `md:`; stacked auto-height below `md`); centered page dots shown **only when >1 page** (click + swipe to advance), **no bottom gradient**. **"Open Messages →"** gold link bottom-right → `/messages`. Business name binds to the shared `useConfiguratorState` store (`state.businessName` / `setBusinessName`) so the home and `/messages` stay in sync (continuity of intent, MASTER_PLAN #7); tone is local `useState`, not persisted. `/messages` + `ConfiguratorSection` are untouched.
5. **The variables** (`id="variables"`, `variables-section.tsx`, **D-434**) — eyebrow "The variables", H2 "Make the messages yours, without breaking them.", bridge (two sentences with a desktop-only line break between them — "Preview every message, edit the wording, or add your own fields." / "The parts that keep you compliant stay locked."), then a 1-col→2-col (`md:`, 32px gutter) grid of two **presentational-static** cards illustrating the authoring experience (no live editor, no state, server component): **"Preview with your data"** (body "Enter a value once and it shows in every message."; a label-less active field showing `Jordan Lee` with a lighter `border-fg-quaternary` active border, over a Confirmation message-editor mock with the `Jordan Lee` value gold-tinted, a right-aligned dimmed Insert-variable + dimmed Save; **no tone pills**) and **"Customize any message"** (the same editor mock with `summitfitness.com/reschedule` gold-tinted + a right-aligned **open** "Insert variable" menu — right-anchored `w-[calc(100%-16px)]`, `overflow-hidden`, **four** variable rows (`workspace_name` / `provider_name` / `reschedule_link` / `appointment_time`) with the `reschedule_link` row selected under a decorative mouse cursor; **no scrollbar**, value text truncates with ellipsis on narrow widths). Card body copy clears `mb-10` to the field/editor below; gold-tint highlight is `bg-bg-gold/25`; the illustrative gold insertion caret was removed. Geometry ported from the dev-tools landing mockup (then simplified — caret, field label row, scrollbar, and rows 5–7 dropped); replaced the prior `VariablesCallout` / "See exactly what customers will receive." block. Renders between `#configurator` and `#build`.
6. **Build** (`id="build"`, `ai-section.tsx`) — eyebrow "The build", H2 "Give your AI tool a build spec, not a pile of docs.", body, an AI-tool wordmark row (Claude Code, Cursor, Windsurf, GitHub Copilot, Cline, Codex — dark/light asset swap via `negSrc` or a `brightness-0 dark:invert` fallback), and "Slots into ShipFast, Supastarter, MakerKit, and Vercel + Supabase." Right column: a `CodeCard` carrying the **real SDK signature** (`new RelayKit()` / `appointments.sendConfirmation(...)`), gold identifier highlights, caption "That's the send." Grid is `items-start`; both columns `min-w-0` so the code block scrolls internally on mobile.
7. **Prove** (`id="test"`, `Test()` in `app/page.tsx`) — eyebrow "The test", H2 "Run test messages through real phones.", two paragraphs; the `preview-list-mock.tsx` (Joel / Sarah verified, Mike invited) sits in the left grid column, copy at right. Grid `items-start`. **Mobile (below `lg`): copy comes first, the mock below it** — the mock is wrapped in `order-last lg:order-first` and the text div carries `order-first lg:order-last`, so the section leads with words on mobile while the desktop two-column order (mock left, text right) is unchanged.
8. **How it works** (`id="how"`, `how-it-works.tsx`) — eyebrow "The process", H2 "What it takes to go live.", subhead "No telecom expertise required. We handle the carrier side.", then a **three-step** `<StepStrip>` (open variant): 01 · PLAN **Choose your messages** (gold link "Browse the messages →" → `/messages`) → 02 · BUILD **Build and test** → 03 · LAUNCH **Go live**, each carrying a cumulative gold progress bar (`w-1/3` → `w-2/3` → `w-full`). (Was a four-step grid.)
9. **The numbers** (`id="numbers"`, `numbers-section.tsx`) — eyebrow "The numbers", H2 "When a message can't wait, send a text.", intro ("The messages an app sends — login codes, order updates, reminders — only do their job when someone sees them. Here's how text and email compare."), then a 1-col→2-col (`md:`) grid of four **presentational-static** stat cards comparing Text vs Email (`bg-surface-inset`): **Gets opened** (98% / ~20%) · **Time to first open** (~90 sec / ~90 min) · **Gets a reply** (~45% / ~6%) · **Gets through** (~98% / ~84%). Each card shows a Text row (green `bg-fg-success-primary` bar, emphasized `text-2xl` value) over an Email row (red `bg-fg-error-primary` bar, muted `text-[19px]` value). **Bar length encodes favorable performance** (the stronger channel always gets the longer bar — email's slow 90-min open is a *short* red bar, not a long one), not literal magnitude. A sourced footnote (`text-fg-quaternary`) cites 2025–26 SMS aggregates + Validity's 2025 email deliverability report and notes the open-rate measurement caveat. Stats are real/sourced per VPP §3; the mockup's unsupported "Lands in spam — up to 85%" was corrected to the sourced deliverability pair (card labelled "Gets through"). A measured email-vs-SMS channel comparison (not a competitor dunk), per VPP §4. Renders between `#how` and `#why`.
10. **Recognition** (`id="why"`, `Recognition()` in `app/page.tsx`) — eyebrow "The problem", H2 "The rules show up after you start building.", subhead. Then a **single full-width requirements accordion** (one `bg-surface-card` card holding six native `<details name="requirements">` rows — one open at a time): Registration / Carrier review / Consent requirements / Build a compliance website / STOP and HELP handling / Message restrictions. Each summary row is an error-red dot + title + a `ChevronDown` that rotates on open; the open body (capped `max-w-[460px]` for line length) carries the requirement explanation plus a closing "RelayKit …" relay line. (Replaces the prior two-card "You expected days" / "You got weeks" model.) **Demoted to position 10 (Session 136 reorder) — was the third section; the home now opens on Paperwork → Messages → Variables → Build/Test before the compliance accordion, keeping the heavy six-row accordion near the back for engaged readers.**
11. **Pricing** (`id="pricing"`, `pricing.tsx`) — eyebrow "The price", H2 "Simple pricing." Left: a single card with two stacked stages, each labelled by a **gold mono "Stage 1" / "Stage 2"** label (D-427) — "Build for free" (set up, add the code, test with real phones, no credit card) / "Go live for $49 + $19/mo" (we file your registration; approval takes a few days; 500 messages included per month, then $8 per additional 500; full refund if not approved). Right: "What $19/mo includes." — five gold-tick rows (500 messages a month, your own sending number, delivery/opt-outs/quiet hours, a hosted compliance site, carrier rule-change tracking) + fine print (marketing +$10/mo, volume pricing above 5,000, US & Canada at launch, no HIPAA / healthcare / enterprise). Copy is canon-clean against PRICING_MODEL and uses "a few days" (D-215/D-376) — no day count.
12. **Final CTA** (`id="join"`, `final-cta.tsx`) — eyebrow "The start", H2 "The messages are ready now. **Sending arrives Summer 2026.**" (second sentence tertiary-toned; the `<br>` is `hidden sm:block`), body with an inline gold "start with the messages today" link (→ `/messages`), then a `BottomEmailCapture` (`ctaSource="home-final"`) that posts to `/api/early-access`. (Simplified Session 130 — the prior "Open the configurator →" `PrimaryCta` + "Or get an email…" caption were dropped in favor of the inline gold link.)

**Removed: the hero text rotor.** Earlier specs documented a `category-rotor.tsx` text rotor in the hero. That component is **deleted** — the hero's rotating element is now the `<HeroConfiguratorGraphic/>` category mock (section 1 above), which cycles the *configurator* through categories rather than animating a headline phrase. There is no `FRAMES` list and no headline rotor to preserve.

### Configurator tool page — `/messages` (D-428)

`marketing-site/app/messages/page.tsx` (server component) is the free standalone configurator — a product in its own right (MD-21). Structure top-to-bottom: a thin demand-voice header (H1 "Text messages for your app. Ready to copy." — the `<br>` is `hidden sm:block`; subhead "Free and live right now. Pick your messages and copy them into your code today — RelayKit's own sending launches Summer 2026 — **join the waitlist**." where the closing words are a gold `#join` anchor with `whitespace-nowrap` so the link never splits), then the permanent **quick-start strip** (`MessagesQuickstart`), then the real `<ConfiguratorSection/>`, then a closing **`#join` waitlist section**. The `#join` section (`border-t border-border-secondary`, centered, `mt-20`) carries H2 "Sending arrives Summer 2026", a body paragraph, and a `BottomEmailCapture` (`ctaSource="messages-final"`). The outer wrapper is a bare `<div>` — the `#join` section owns the bottom padding (the old `pb-20 sm:pb-28` on the wrapper was dropped).

**Quick-start strip** (`components/messages-quickstart.tsx`, **D-432** — supersedes D-429) — a **permanent, three-step, carded** orientation section for `/messages` only; a static server component (no `"use client"`, no dismiss control, no state, no localStorage). It mirrors the home How-it-works section exactly (`max-w-5xl`, top **and** bottom hairline `border-t border-b border-border-secondary`, `max-w-2xl` heading) — eyebrow "The steps" + H2 "It takes just a few minutes." — and renders the shared `<StepStrip variant="card">`: 01 · Details **Add your business** → 02 · Select **Pick your messages** → 03 · Personalize **Make it yours**, each step boxed in its own `bg-surface-card rounded-2xl` card (the `card` variant) with a cumulative gold progress bar (`w-1/3` → `w-2/3` → `w-full`). It is deliberately **page-level, NOT inside `ConfiguratorSection`** — so it never leaks into the home's embedded clipped peek. (Replaces D-429's dismissible four-step strip; the `relaykit_quickstart_dismissed` localStorage key and all dismiss read/write code are gone.)

**Shared `StepStrip`** (`components/step-strip.tsx`) — server component exporting the `Step` type and `StepStrip({ steps, className, variant })`. `variant="open"` (default) is the bare home How-it-works look (progress line on top, mono-uppercase label, title, body, optional gold link; airy 60px gutter); `variant="card"` wraps each identical inner step in a bordered `bg-surface-card` box at a tighter 28px gutter. Consumed by `home/how-it-works.tsx` (open) and `messages-quickstart.tsx` (card), so the two surfaces stay in lockstep without rendering byte-identically.

### Top nav — marketing-site (`top-nav.tsx`)

`"use client"`; fixed bar, RelayKit wordmark (left, → `/`). Right group at `sm`+: the primary links **Messages / Pricing / Blog** (no theme toggle — the site is dark-only per D-430, below). Below `sm`, those hide and a right-aligned **hamburger** (`Menu01` / `X`, 44px tap target, `aria-expanded`) opens a full-screen **mobile menu** — a `role="dialog"` portal to `<body>` mirroring the configurator modal idioms (ESC-to-close, body-scroll lock, sticky header with wordmark + X, body-scrolls layout) with focus moved into the panel on open and restored to the hamburger on close. The menu stacks the same links (each closes the menu on tap). Legal/Resources stay in the footer.

**Single dark theme (D-430, supersedes D-378's switchable mechanism; branch `feat/design-refresh`).** The marketing site is **dark-only and not user-switchable** — light mode was removed. `app/layout.tsx` server-renders `<html className="dark">` (with `suppressHydrationWarning`); the `.dark` block in `globals.css` sets `color-scheme: dark`, so there is no FOUC and no pre-hydration theme script. There is **no theme toggle** (removed from the desktop bar and the mobile menu), no `useTheme` hook (`lib/use-theme.ts` deleted), and no `relaykit-theme` localStorage. The body stays painted `bg-bg-primary`. `globals.css` retains the light token values as **dead base** — collapsing them to a single set is a deferred follow-up task. *(Historical: D-378 originally shipped a vanilla-React light/dark toggle with `prefers-color-scheme` default + an inline FOUC script; D-430 removed all of that. D-378's `bg-code-surface` token survives D-430 but its home usage moved to `bg-surface-card` this session.)*

**Brand system (D-405, branch `feat/warm-monochrome-brand`, merged to main Session 97).** The marketing site runs one monochromatic warm-neutral palette — Untitled UI's "Gray Warm" scale (`--color-brand-*` in `marketing-site/app/globals.css`; `--color-gray-*` mirrors it), with `brand-950` customized to `#13120E` for a deeper dark-mode page. There is no chromatic accent: value (lightness), not hue, carries surfaces, text, borders, and the lifted/actionable elements — the "Get early access" CTA and selected tone pills — which use `brand-800` in both modes with white text, hover one step. Checked checkboxes are **not** in that group (D-405 amendment): the configurator checkbox is a custom `appearance-none` box — `bg-bg-primary` / `dark:bg-bg-secondary` fill + 1px `border-border-primary`, with a hand-rendered check glyph on top — category-row boxes `size-5`, sub-row boxes `size-4`, fill identical across checked/unchecked. Variable highlights in message previews use `text-variable` (a quiet neutral step) with a dedicated `bg-variable-highlight` token behind the edit-state token. Semantic colors (error / warning / success) are untouched; the RelayKit wordmark is neutral-scale text. Supersedes the prior purple accent system.

**Dark-mode surface lift.** In dark mode, content-grouping container surfaces lift one step above the page: message cards, the pricing card, the Preview-list card, and the code block use `bg-secondary` (`brand-900`) against the `bg-primary` (`brand-950`) page. Interactive fields (text inputs, message-editor wells) and secondary/outlined buttons stay flush — they take their parent's surface rather than their own lift. The Categories panel deliberately stays flush (`bg-primary`) as the controller. The primary CTA stays on `brand-800` — its contrast against the lifted surfaces carries the hierarchy. The lift is dark-mode-only; light mode is unchanged (cards and panels stay `bg-primary`, bordered).

### Configurator Section — `/messages` (and embedded clipped on the home `/`, D-428)
**File:** `marketing-site/components/configurator-section.tsx`
**Status:** Stable (one-corpus rewrite, Session 95, branch `feat/configurator-one-corpus`). The inline `VERTICALS` array is retired — the configurator now renders directly from the typed message-library corpus (`marketing-site/lib/message-library/`).

Pre-signup mockup that lets a visitor scope which messages they would ship and personalize them with their own business name. Section structure top-to-bottom:

1. **Header** — H2 "Write your messages" (`text-2xl`, `mb-6` to the body; the former "Templates configured for your app." subtitle was removed Session 128). Section's outer wrapper uses `bg-bg-primary pt-20`; on the home the embedded window trims this via `-mt-[56px]` so it opens cleanly on the header (no bottom padding).
2. **Two-panel grid** — `md:grid-cols-[300px_1fr]`, `gap-8`. Below `md:` (768px) the left cell renders the mobile collapsed pattern (D-407 — see "Mobile categories pattern" below); at `md:` and above the existing left = Categories card / right = Messages column layout is unchanged.

**Data source + persistence.** The configurator imports the 9 corpus categories via `@/lib/message-library` and renders from them. All selection/edit state lives in `useConfiguratorState()` (`marketing-site/lib/configurator/use-configurator-state.ts`), persisted across sessions to `localStorage` key `relaykit_configurator` (`version: 3`, debounced ~200ms, version-gated drop, fail-silent; persisted state merges over a fresh corpus seed with id intersection). Version 3 bump landed with D-409's default-state cascade (Session 101); V2 (D-408 flat-message collapse) and earlier persisted state drop silently to a fresh seed.

**Default state + toggle cascade (D-409).** Page-load seeds the default category (`DEFAULT_CHECKED_CATEGORY` = "verification") with every message checked; every other category and every other category's messages start unchecked. Toggling any category ON cascades `checked=true` to every message in it; toggling OFF cascades `checked=false`. The prior `DEFAULT_CHECKED_MESSAGES` per-message default list is deleted; the seed derives from `DEFAULT_CHECKED_CATEGORY` alone. Tone overrides and visitor custom messages survive the cascade.

**Authored categories.** A category is authored when it has non-empty `messages`, `variables`, and `compliance.rules` (`isAuthored()` in the barrel). As of Session 103 **all nine categories are authored and live** — Verification, Appointments, Order updates, Customer support, Team alerts, Account events, Waitlist, Community, Marketing. `CategoryList`'s disabled "Coming soon" render branch remains in code for any future unauthored category but no category currently hits it. Per D-408, every category is a flat list of messages — no `subs`, `stages`, or `classification` distinguishes them at the corpus or render level.

**Left panel — Categories card:**
- "Categories" h3 at top. (The former "$19/mo" pricing-clarity note was removed Session 96 — the section subhead already carries the inclusion message. The "Recommended combinations" preset dropdown that previously sat under the h3 was removed Session 103 per D-411: it offered one redundant preset — "Verification only", which only duplicated the page-load default — plus five disabled vertical presets, and carried no product behavior per D-385. The `preset-dropdown.tsx` component was deleted.)
- Categories list, one row per corpus category, in this order: Verification / Appointments / Order updates / Customer support / Team alerts / Community / Waitlist / Account events / Marketing. (Marketing was moved to last position Session 101.) **All nine categories are authored:** each row has an active checkbox; collapsed shows the category description; expanded (checked) hides the description and reveals indented per-message checkboxes (D-408 — one row per `Category.messages` entry, uniform across categories). The disabled-checkbox + inline "Coming soon" badge (`ComingSoonBadge` — `bg-bg-secondary` / `text-text-tertiary`) render path remains in `CategoryList` for any future unauthored category but is currently unused.
- **Per-message checkboxes** (shown when an authored category is checked, indented `pl-7`): one row per `Category.messages` entry, in the order the corpus declares. The categories panel iterates `category.messages` uniformly across all authored categories (D-408 flat-message model — no sub/stage wrapper). Each row is an entire-row click target (toggles the message via `role="button"` + `onMessageToggle`, Enter/Space keyboard support). When a message carries a `tooltip` (operational hover, "Sent when…" register), a small `HelpCircle` `?` icon renders to the right of the label inside an `items-center gap-1.5` inner wrapper — same pattern as the message-card title. Hovering the `?` icon shows the tooltip body centered horizontally over the icon, instantly (no open delay); the icon itself has an invisible 44px tap target via `size-11` wrapper with `-m-[15px]` to preserve the 14px layout footprint; clicking the `?` icon `stopPropagation`s so it doesn't also toggle the row. Hovering the bare label text does **not** trigger the tooltip — the `?` is the only trigger.

  Per-category notes (data shape only; rendering shape is uniform):
  - **Verification** — 4 messages in order (Verification code / Confirmation code / Recovery code / Login code). Page-load default per D-409: all 4 messages checked alongside the category (Verification is `DEFAULT_CHECKED_CATEGORY`). The `login-code` tooltip carries an SMS-2FA security advisory appended Session 101 ("...SMS is still commonly used for primary 2FA, but it is less secure than authenticator apps that use temporary one time passwords (TOTP) or passkeys. Consider using one of them instead.").
  - **Account events** — 5 messages in order (Payment failed / Trial ending / Subscription confirmed / New device sign-in / Account suspended). Ships unchecked at category level; toggling the category on cascades `checked=true` to all 5 messages per D-409. Introduces `account_link` — a workspace-settings-sourced variable for the developer's own account/billing URL on their own domain (RelayKit does not shorten or host it). The configurator renders `yourapp.com/billing` (budgetChars 19) as a static developer-domain placeholder. Per Session 99 PM ruling, `account_link` is captured here (not in DECISIONS): no named alternative was resolved and the variable isn't load-bearing until link handling is technically settled. Forward work in BACKLOG ("Configurator — derive `account_link` example from the business-name input").
  - **Order updates** — 7 messages in lifecycle order (Order confirmed / Order processing / Order shipped / Out for delivery / Order delivered / Return started / Refund processed). Ships unchecked at category level; toggling on cascades to all 7 messages per D-409. Introduces six SDK-payload-sourced variables: `order_number` (developer identifier), `tracking_link` (carrier-domain URL — UPS/USPS/FedEx well-known to carriers; public shorteners discouraged), `estimated_delivery` (short day-name or relative phrase), `return_link` (developer's own returns UI; RelayKit does not shorten or host), `refund_amount` (partial-refund phrasing), `card_type` (human-readable card label, never a card number — no PII per D-393). Each message also carries a documentation-only `Message.groupNote` field with its lifecycle position + former triggerCue text (e.g. `"Order lifecycle — step 3 of 7: sent when order ships from warehouse or fulfillment partner."`); nothing in the configurator renders this today (D-408), reserved for the future workspace UX that surfaces sequence to developers. `Message.description` similarly carries former Sub/Stage description text verbatim, also documentation-only this wave.
  - **Team alerts** — 9 messages in two-group order: 5 shift-lifecycle (Shift scheduled / Shift reminder / Shift change / Shift cancellation / Shift start) + 4 alert-event (System alert / Escalation ping / On-call page / Service-level alert). Ships unchecked at category level; toggling on cascades to all 9 messages per D-409. 10-variable catalog: `workspace_name` (shared, D-398 sender frame) + 9 specific (`shift_date`, `shift_time`, `location`, `role`, `severity`, `alert_type`, `system_name`, `incident_id`, `action_link`, `escalation_to`). `incident_id` and `action_link` are `typeConstrained: true` (exempt from D-402 GSM-7 character rule — type contract enforces shape); `severity` has no default value (P0/P1, SEV1, Critical/High, Red/Yellow all valid per Session 93 research-file §6 resolution). 6-rule compliance block; `tcrMapping: "ACCOUNT_NOTIFICATION"`. Shift-lifecycle messages carry `Message.groupNote` with straight hyphens ("Shift lifecycle - step N of 5: …") rather than the em-dashes used in Order updates' equivalent field — see the Session 101 carry-forward on order-updates.ts em-dash alignment.
  - **Customer support** — 8 messages: a 5-step ticket lifecycle (Ticket received / Agent assigned / Agent response / Resolution notification / CSAT follow-up) + 3 discrete support messages (Proactive outreach / Service status alert / Account issue resolved). Ships unchecked at category level; toggling on cascades to all 8 messages per D-409. 7-token catalog: `workspace_name` + `customer_name` (both shared) + 5 specific (`ticket_number`, `agent_name`, `ticket_link`, `csat_link`, `eta`). `customer_name` is catalogued as a shared reference but used by no body as authored. 6-rule compliance block; `tcrMapping: "CUSTOMER_CARE"`. Lifecycle messages carry `Message.groupNote` with straight hyphens ("Ticket lifecycle - step N of 5: …"). Authored Session 102.
  - **Appointments** — 7 messages in lifecycle order (Confirmation / Reminder - distant / Reminder - proximate / Reschedule confirmation / Cancellation confirmation / No-show follow-up / Post-appointment). Ships unchecked at category level; toggling on cascades to all 7 messages per D-409. 7-token catalog: `workspace_name` + `customer_name` (both shared) + 5 specific (`appointment_time`, `provider_name`, `reschedule_link`, `cancel_link`, `feedback_link`). `customer_name` is catalogued as a shared reference but used by no body as authored. 6-rule compliance block; `tcrMapping: "ACCOUNT_NOTIFICATION"`. Each message carries `Message.groupNote` with straight hyphens ("Appointment lifecycle - step N of 7: …"). Authored Session 102.
  - **Waitlist** — 6 messages in lifecycle order (Joined / Position update / Almost up / Your turn / Grace expiring / Missed). Ships unchecked at category level; toggling on cascades to all 6 messages per D-409. 6-token catalog: `workspace_name` (shared, sender frame) + 5 specific (`queue_position`, `wait_estimate`, `claim_link`, `grace_window`, `rejoin_link`). 6-rule compliance block; `tcrMapping: "ACCOUNT_NOTIFICATION"`. Each message carries `Message.groupNote` with straight hyphens ("Waitlist lifecycle - step N of 6: …"). Authored Session 103.
  - **Community** — 9 messages: 5 discrete (Live event reminder / Event invitation / Moderation update / Member milestone / Community announcement) + a 4-step onboarding sequence (Welcome / First action / Resource pointer / Week 1 check-in). Ships unchecked at category level; toggling on cascades to all 9 messages per D-409. 9-token catalog, all category-specific and locally defined — `community_name` is the sender frame (not drawn from `shared-variables.ts`: members recognize a community by its own name, not the parent business; D-398's `workspace_name` frame does not apply). 5-rule compliance block; `tcrMapping: "ACCOUNT_NOTIFICATION"`. Onboarding messages carry `Message.groupNote` with straight hyphens ("Community onboarding - step N of 4: …"); discrete messages carry a trigger description there instead. Authored Session 103.
  - **Marketing** — 4 messages (Promotional offer / Product launch / Re-engagement / Event invitation) — the intentionally smallest category. Ships unchecked at category level; toggling on cascades to all 4 messages per D-409. 9-token catalog: `business_name` (shared, sender frame) + 8 specific. 8-rule compliance block — the largest of any category, and the sole category that permits promotional content (the designated D-399 exception); `tcrMapping: "MARKETING"`. Bodies carry STOP-only opt-out language, never HELP-in-body (D-410). Discrete-disconnected — each `Message.groupNote` is a trigger description, not a step-N. Authored Session 103.
- **When zero categories are checked**, the right-pane message area shows a centered dashed-border placeholder: "Select a category to see your messages." (`text-sm text-text-tertiary`).

**Mobile categories pattern (≤md:, D-407).** Below the `md:` breakpoint, the Categories card is replaced by a one-row tappable summary (`MobileCategoriesSummary` — `marketing-site/components/configurator/mobile-categories-summary.tsx`): "Categories" label on top, count-based summary text below ("Select categories" placeholder when nothing is checked; one name; two names; "Name1, Name2 +N more" for three or more), "Edit ›" affordance on the right. Tapping the row opens `MobileCategoriesModal` (`mobile-categories-modal.tsx`) — a full-page mobile modal with a sticky "Categories" header (X close, 44px tap target, ESC key support) and a scrollable body rendering the same panel content via the shared `CategoryList` component (`category-list.tsx`). Tapping any checkbox inside the modal applies instantly (calls the same setters the desktop panel uses); the modal stays open. The mobile summary and the desktop card both consume `CategoryList`, so the two surfaces stay byte-identical. The mobile modal uses a body-scrolls (`flex-1 overflow-y-auto`), not shell-scrolls, layout pattern — required for the sticky header to pin while the body scrolls. Responsive split: `md:hidden` on the mobile block, `hidden md:block` on the desktop card; no `useMediaQuery`.

**Right panel — Messages column:**
- **Top row**: page-level tone pills (Standard / Friendly / Brief, `rounded-full`); a tertiary text + `Copy01` icon Copy button; a `KebabMenu` (DotsVertical, `aria-label="Configurator options"`) with a single "Reset all to defaults" item that calls `clearAll` — wipes every category's authored content (the four `categoryValues` buckets) plus the top-of-page businessName input; page tone (preview filter) and category-checked state (scoping) are preserved. The item renders in normal `text-text-secondary` (not destructive) — the action restores known-good defaults; it is not a loss. Copy emits, per visible message in the active tone, a combined block — title, description, a personalized example, and the raw `{{token}}` template — plain-text and markdown-friendly, blocks separated by `---`; custom messages are included (title from the Name field, no description line). Per-message edits (hand-edited bodies + pinned tones) flow through the Copy path; the example block reflects the visitor's authored variable values. (D-404, D-414, D-415)
- **"Your business name" input**: single text input that drives the three identity tokens (`business_name`, `workspace_name`, `community_name`) per D-413. Live, no separate save. Carries a React ref (`businessNameInputRef`) so the double-click-on-identity-token affordance (see "Double-click to edit" below) can scroll-into-view + focus this input directly. The earlier speculative "conditional rendering for every visitor identity token (`business_name`, `website`, `business_type`, `service_type`)" framing is retired — the configurator authoring layer (D-414) handles every non-identity variable inside the per-category Variables form below; identity tokens stay on this single top-of-page input where they always have.
- **Category groups** (`space-y-7`): one per checked category. Each group's heading row carries a `text-base font-semibold` title at left, plus a shrink-0 cluster at right with two affordances: a "Variables" text button (trailing `ChevronDown` / `ChevronUp` to signal expander state) and a `KebabMenu` (`aria-label="{Category name} options"`) with a single "Reset to defaults" item that calls `clearCategory(categoryId)` — wipes that one category's four `categoryValues` buckets without touching other categories or the businessName input. The affordance was labelled "Edit values" before the Session 107 rename. (D-414, D-415)
- **Per-category "Variables" form**: desktop opens an inline expander (`hidden md:block`) above the messages in that category group, so previews stay visible while editing. The form renders one labelled input per editable variable in the category's catalog (identity tokens — `business_name` / `workspace_name` / `community_name` — are filtered out per D-413 via the `isIdentityToken` helper exported from `marketing-site/lib/message-library/render.ts`). Below each input, a `text-xs text-text-tertiary` line lists the message names whose variants reference that variable ("Used in: Order shipped, Out for delivery"). Placeholder is the variable's corpus example; an empty input falls through to the corpus default. Every keystroke writes through `setCategoryVariable(categoryId, variableName, value)` and updates every preview in the category live — read-card text, edit-card editor chips, the Insert variable dropdown's preview values. Empty value omits the entry from state to keep persisted state minimal. The form also accepts optional `focusVariableName` / `onFocusDelivered` props (Session 107) — when set, an effect focuses the matching input by its deterministic id (`edit-values-{categoryId}-{variableName}`), positions the caret at the end of any existing value, then invokes `onFocusDelivered` to clear the upstream signal. This is the focus side of the double-click affordance (below). (D-414)
- **Mobile Variables modal** (`<md:`): the same Variables form is rendered inside a full-page mobile modal (`EditValuesModal`, mirroring the `MobileCategoriesModal` pattern at `marketing-site/components/configurator/mobile-categories-modal.tsx` — sticky header with X close + ESC + body-scroll lock, body-scrolls layout). Same `editValuesCategoryId` state drives both surfaces; `focusVariableName` / `onFocusDelivered` pass through to the form. The modal carries a JS-level viewport check (`matchMedia("(max-width: 767.98px)")`) — `display: none` from `md:hidden` does not stop React effects, so without the JS guard the modal's scroll-lock would fire on desktop too and silently lock page scroll behind an invisible modal. matchMedia stays in sync with Tailwind's `md:` (768px) and reacts to viewport resize. (D-414; see also CC_HANDOFF watch item — `MobileCategoriesModal` carries the same latent pattern, fixable on the next session that touches it.)
- **Message read-cards** (corpus messages): rounded-xl border, shadow-xs. Name at top with a `HelpCircle` info-icon tooltip beside it; an optional `CharWarningIcon` (AlertTriangle, `text-fg-warning-secondary`, tooltip "Over 160 characters. This counts as 2 messages.") between the name area and the edit pencil, shown when the rendered post-substitution body exceeds a single SMS segment; edit pencil at right. Body below renders via `interpolateBody` (passed `{ businessName, categoryVariables }`) with `{{token}}` variables as inline spans; `break-words` on the preview `<p>` wraps long unbroken values inside the card. The char-warning is non-blocking — purely informational; the visitor can still copy and use the message. Behavior is gated on `compliance.isOverSegmentLength` from `checkCompliance` (the `isOverSegmentLength` field is surfaced separately from `issues` precisely so the read-card warning can fire on length alone without walking the issues list). One card per checked message. Variable spans inside the rendered body are clickable (`cursor-pointer`) and carry a double-click handler — see "Double-click to edit" below. (D-414, D-415)
- **Custom message cards** (`CustomMessageCard`): visitor-authored messages, rendered after the corpus cards in each category. Read mode shows the name as title and the interpolated body (same `break-words` + char-warning treatment as corpus read-cards); edit mode gates Save on a non-empty name + body + a passing compliance check (`isCompliant` now means "no blockers" — see D-415).
- **"+ Add message"** appears at the bottom of each checked authored category's stack — a full-width bordered button (`Plus` icon). Click opens an inline `CustomMessageCard` authoring draft.
- **Bottom CTA block**: a full-width 60px (`h-15`) brand "Copy messages" button (`handleCopy` — same action as the inline Copy in the tone row), reflecting "Copied" on success. The Session 122 free-tool reframe replaced the prior "Get early access" waitlist CTA here; the Session 123 rework removed the disabled-bucket hiding — the CTA renders for every reachable bucket (the message area is never disabled, D-425). Directly below it sits the **point-of-use disclaimer** (`text-xs text-text-tertiary`, `mt-3`): "Not legal advice — you're responsible for consent and compliance. See our Terms." ("Terms" → `/terms`, Next `<Link>`; D-424).

### Configurator Elig section — `/` (home, right column, above tone pills)
**Files:** `marketing-site/components/configurator/elig-section.tsx`, `elig-dropdown.tsx`, `elig-verdict-card.tsx`, `elig-per-category-card.tsx`; `marketing-site/lib/configurator/use-elig-state.ts`, `elig-copy.ts`. (`elig-empty-state.tsx` deleted in the Session 123 rework.)
**Status:** Reworked Session 123 (D-423/D-424/D-425/D-426; commits `759e4c1` + `aad2f7c` + `42f906b`). This subsection reconciles two deferred passes at once — the Session 122 free-tool reframe (Waves A–D) and the Session 123 rework — superseding the Session 121 Wave-1–3 structural build it replaced. Built per `/explorations/vertical-constraints.md` §9, D-422, and MD-21. Examples expander content and per-vertical primer pages remain out of scope per §9.8 (sniff-test-gated, customer-pull-driven).

Customer-facing eligibility surface that answers the §1 two-question model ("can my business use RelayKit?" + "can I send this text?") via two label-less dropdowns and shapes a rules card accordingly. **The configurator is a free authoring tool: the message area is never disabled or replaced for any reachable bucket (D-425).** Reads from `/lib/constraints/` (8 verticals, 137 sub-verticals, 12 content rules). Sits in the upper-right of the configurator section, above the message tone pills; on mobile (below `md:`) it sits between the mobile categories summary and the tone pills.

**State + persistence.** State lives in `useEligState()` (`marketing-site/lib/configurator/use-elig-state.ts`), persisted to `localStorage.relaykit_elig` (`version: 2`, debounced ~200ms, version-gated drop, fail-silent). **Lazy-create rule:** no localStorage write fires until the visitor's first interaction — the key does not exist for untouched visitors. Persisted shape: `{ version, multiTenant, verticalSlug, subVerticalSlug, bucket, verdict: { tier, copy }, updatedAt }` — `multiTenant` retained dormant (D-426); durable handoff to the future onboarding wizard per MASTER_PLAN principle #7 (continuity of intent).

**Verdict derivation.** Pure function in the hook: (1) `multiTenant === "multi"` → ⚫ Not yet — **DORMANT branch (D-426): the multi-tenant entry point (D1 dropdown) is removed, so this is unreachable from the UI; the branch is retained for a future multi-tenant return**; (2) `verticalSlug + subVerticalSlug` both set → `lookupEligibility`'s bucket mapped to tier (`Clear`→`clear`, `Conditional`→`conditional`, `Not yet, maybe not ever`→`not-yet-maybe-not`, `Not yet`→`not-yet`, `Not our lane`→`not-our-lane`); (3) `verticalSlug` set + vertical has zero `routingTrigger: true` rows → verdict resolves at D2 from the single shared bucket (currently unreachable in data — every vertical has at least one routing-trigger row — but kept for data robustness); (4) else `null` (placeholder / free-use mode).

**Two dropdowns (§9.2; D1 multi-tenant removed per D-426):**

1. **D2 vertical** — placeholder *"What industry does your app serve?"*; options from `VERTICALS` (8 verticals).
2. **D3 sub-vertical (conditional)** — surfaces only when the picked vertical has any `routingTrigger: true` sub-vertical. **Options include ALL sub-verticals of that vertical.** 🔴 Not-our-lane sub-verticals render **disabled/unselectable**, sorted to the bottom under a "Not supported" group header (`disabledGroupLabel`); membership is data-driven off `bucket === "Not our lane"`, so the Session 123 CPaaS-adjacent 🟠→🔴 flip (commit `aad2f7c`) joined that group with no code change. This dropdown is the **only** place 🔴 is gated — selecting a disabled item is a no-op that leaves the message area untouched (D-425). `clearable={false}`. Dynamic placeholder via `eligD3Placeholder(vertical)` — default `"What kind of {vertical-name-lowercased}?"` with hand-edited overrides for 5 awkward vertical names (home-local-services → "home or local services"; retail-hospitality → "retail or hospitality"; creator-community → "creator or community work"; b2b-saas → "B2B SaaS or developer tooling"; civic-public-sector → "civic or public-sector work"). Default state (placeholders) = free-use mode; the messages section works as the free authoring tool regardless.

**Reset affordance.** Inline `×` (XClose icon) appears at the D2 dropdown's right edge when a value is selected (D3 is `clearable={false}`). Changing D2 also clears D3 (sub only makes sense within a vertical).

**Rules card under the dropdowns (`elig-verdict-card.tsx` → `RulesCard`).** A single quiet "i" card, not a five-branch per-bucket switch. Renders **only** when the sub-vertical carries customer-facing bullets — `getRuleSummaries(subVerticalSlug)` returns the sub-vertical-level `cardRuleBullets` (D-423). Tier behavior:

- **🟢 Clear** — nothing (the message stream is the confirmation). `cardRuleBullets` empty by design.
- **🟡 Conditional** — card: `InfoCircle` icon (`text-fg-quaternary`) + heading `CONDITIONAL_NOTE_LINE` ("Your industry has a few rules.") + the 3 bullets (`•` markers, `text-text-tertiary`). Bullets only — no footer.
- **🟠 Not yet, maybe not ever / ⚫ Not yet** — same card + bullets, **plus a footer**: a thin top divider (`border-t border-border-secondary`), then an `AlertTriangle` icon (`text-text-tertiary`, matching the adjacent text) + `NOT_OFFERED_LEAD_LINE` ("RelayKit doesn't send this category.") + a **"Request it."** link (`text-text-primary`, underlined). The footer is trigger-only — its link calls an `onRequest` callback threaded from `configurator-section` to open the existing `EligRequestModal` (POSTs `/api/early-access` with `interestTag` via `eligInterestTag(state)`: `vetting:{slug}` for 🟠, `capacity:{slug}` for ⚫). The modal's markup + open/close state live in `configurator-section`, not the card.
- **🔴 Not our lane** — nothing (unselectable at the dropdown; card never renders for it).

The card is suppressed entirely when `cardRuleBullets` is empty — no heading-only tease. Bullets are empty until the Airtable "Card rule bullets" column lands via connector regeneration; commit `aad2f7c` filled all 65 selectable sub-verticals.

**Brand-system note.** §9.3's literal "blue / orange info card" is expressed via a neutral surface + semantic icon colors per the post-D-405 monochrome palette — quaternary "i" for the rules, a tertiary `AlertTriangle` for the Not-yet footer (matched to its lead text, not warning-toned).

**Point-of-use disclaimer (D-424).** Under the bottom "Copy messages" CTA, shown for every selectable category: "Not legal advice — you're responsible for consent and compliance. See our Terms." ("Terms" → `/terms`, Next `<Link>`). Product-side expression of `LEGAL_EXPOSURE_REMEDIATION.md` §3.1.

**Per-category cards (Wave 3, §9.5).** When the verdict is 🟡, render `<EligPerCategoryCard>` under each affected category's header in the message stream (between the heading row and the optional Variables expander). `isCategoryAffected(subVerticalSlug, categoryId)` walks the sub-vertical's `contentRules`; if any rule's `categoriesAffected` (Session 120 schema field) is absent it applies to all eligible categories, if present it gates by category slug. **Verification carve-out:** `VERIFICATION_CATEGORY_ID` (`"verification"`) is hardcoded out — Verification is content-neutral by nature and never receives a per-category card regardless of vertical. Three §9.5 anchored lines keyed by sub-vertical slug (legal/banking/healthcare-admin); generic `GENERIC_PER_CATEGORY` fallback reserved for future data evolution. The card surfaces a collapsed line + a non-functional `Examples [▾]` affordance — expander content deferred per §9.8 (sniff-test-gated, customer-pull-driven). Production-current behavior: only the 3 anchored 🟡 sub-verticals trigger per-category cards (the only sub-verticals with populated `contentRules` today); the remaining 🟡 sub-verticals render the rules card from `cardRuleBullets` but no per-category cards.

**interest_tag plumbing.** `/api/early-access` accepts an `interestTag` field (string, trimmed, nullable) and writes it to the new nullable `interest_tag` column on `early_access_subscribers`. Migration `009_early_access_interest_tag.sql` adds the column + partial index — **must be applied via Supabase SQL Editor before next production deploy** or inline elig waitlist inserts will fail. Existing signups (without `interest_tag`) continue to work.

### Configurator edit-card — Tiptap-based message editor
**File:** `marketing-site/components/configurator/message-edit-card.tsx`
**Status:** Stable (corpus rewrite Session 95; severity model + decision API Session 106 / D-414 / D-415; chip-refresh + double-click Session 107)

Click the pencil on a corpus read-card → it swaps to the edit card.

Top-to-bottom:
- **Header row**: message name at left (with a `HelpCircle` info-icon tooltip beside it); "Edit" label + pencil icon at right.
- **Editor body** (Tiptap `MessageEditor`, `marketing-site/lib/editor/`): consumes the corpus `{{double-brace}}` body format; variable tokens render as atomic chips (D-350); the chip preview values resolve through `resolveVariableExample({ businessName, categoryVariables })` so authored Variables-form entries reflect inline as the visitor types (D-414). Enter suppressed (single-line SMS). Chip preview text refreshes reactively as the visitor edits values in the Variables form — `categoryVariables` is surfaced to the NodeView via `CategoryVariablesContext` (`marketing-site/lib/editor/category-variables-context.ts`), not Tiptap extension options, so each NodeView re-renders on context change with no editor remount, no flicker, no focus loss (Session 107). Each chip carries an `onDoubleClick` handler that fires `onVariableDoubleClick(node.attrs.key)`; the callback is plumbed via the extension's options through a mutable ref so it tracks the latest prop without rebuilding the extensions array.
- **Compliance row** (right-aligned): one line per issue from `checkCompliance`, color-coded by severity (D-415) — warnings in `text-text-warning-primary` (currently: over-segment length, "Over 160 characters. This counts as 2 messages."), blockers in `text-text-error-primary` (currently: non-GSM-7 characters, missing STOP/opt-out on Marketing-shaped categories). Save is disabled while any blocker is present (`!compliance.isCompliant` where `isCompliant` means "no blockers"); warnings alone do not disable Save — they're surfaced for the visitor's awareness but the configurator is the lenient authoring stage. No "Fix" button — clicking a tone pill restores a known-good canned variant.
- **Tone-pill row + "Insert variable" popover**: one pill per tone the message offers (`message.variants`); a dashed "Custom" pill appears once the body is hand-edited. The right-aligned "Insert variable" trigger (label + trailing `ChevronDown` `size-3.5`, no Plus icon — the chevron signals "opens a menu," sister to the "Variables" header affordance) opens a dropdown listing the category's `Variable[]` catalog; each row shows the token name + its preview value (also resolver-aware so authored Variables entries appear here); click inserts an atomic chip. The affordance was labelled "+ Variable" (Plus icon + "Variable") before Session 107.
- **Save / Cancel** at right.

**Edit-decision model (D-414):** the page-level tone pills drive every message without an explicit per-message edit. Saving an edit card commits a `MessageEditDecision` via `setMessageEdit(catId, msgId, decision)`: `{ kind: "tone", tone }` for a variant pick (writes `categoryValues[catId].messageTones[msgId]`, clears any prior customBodies entry) or `{ kind: "custom", body }` for a hand-edit (writes `categoryValues[catId].customBodies[msgId]`, clears any prior messageTones entry). Once a message carries either entry, the page-level tone toggle no longer drives it. Both buckets persist in `localStorage`. The retired `MessageOverride` shape no longer exists.

### Configurator custom-message card
**File:** `marketing-site/components/configurator/custom-message-card.tsx`
**Status:** New (Session 95)

Visitor-authored custom messages — kept and carried forward into the visitor's workspace at signup. Matches the workspace authoring shape (`prototype/components/catalog/custom-message-card.tsx`): a **required "Name" field**, a "Message" body editor (Tiptap), and an Insert variable picker (label + trailing `ChevronDown`, post-Session-107 rename from "+ Variable"). Read mode shows the name as title + interpolated body, with the same double-click-on-variable affordance as the corpus read-card; edit mode gates Save on a non-empty name + body + a passing compliance check. A saved card's edit mode also offers "Remove". Out of scope here: monitor/test, kebab/archive, AI rewrite, slugs. The custom message shape is `{ localId, name, body }`. The Name field placeholder is category-aware (`CUSTOM_NAME_PLACEHOLDERS` in `configurator-section.tsx`): Verification "e.g. Login alert" · Marketing "e.g. Holiday hours" · Appointments "e.g. Reschedule notice" · Order updates "e.g. Backorder notice" · Customer support "e.g. After-hours auto-reply" · Team alerts "e.g. Deploy started" · Community "e.g. Event reminder" · Waitlist "e.g. Position update" · Account events "e.g. Password changed".

### Configurator data conventions

- **Corpus is the single source.** Message content, variables, and compliance rules live in `marketing-site/lib/message-library/`. The configurator never restates them.
- **Message-card title tooltips.** Every corpus message card (read and edit) surfaces a `HelpCircle` `?` icon beside the title with an invisible 44px tap area (`size-11` wrapper, `-m-[15px]` to preserve 14px layout footprint); hovering it shows the message's optional `tooltip` field from the corpus (`Tooltip`, opens instantly). The tooltip body uses `bg-bg-primary-solid` (one shade lifted in both modes — light `brand-900`, dark `brand-800` — so the dark-mode tooltip separates visibly from `bg-bg-secondary` card surfaces) and centers horizontally over the trigger (`left-1/2 -translate-x-1/2`). Custom-message cards carry no tooltip — there is no corpus source.
- **Bodies use `{{double-brace}}` variable syntax.** `marketing-site/lib/message-library/render.ts` provides `interpolateBody` / `extractTokens` / `flattenBody`, all accepting a `{ businessName?, categoryVariables? }` options arg. Resolution order: identity tokens (`business_name` / `workspace_name` / `community_name`, collapsed per D-413) → the visitor's `businessName` input; non-identity tokens → `categoryVariables[name]` if the visitor has set one via the Variables form, otherwise the variable's catalogued `example` (D-414).
- **Tones** are `VariantTone` — "Standard" / "Friendly" / "Brief". A message carries one `MessageVariant` per tone.
- **Compliance** is best-effort (`compliance.ts`): single GSM-7 segment, GSM-7 charset on author-controlled literal text, opt-out language for Marketing-shaped categories. Verification carries no STOP requirement (2FA carve-out). Issues are tagged with `severity: "blocker" | "warning"` (D-415) — `isCompliant` means "no blockers"; length-over-160 is a warning (visitor can save), non-GSM-7 and missing STOP are blockers (Save disabled). A future workspace consumer that wants every issue to block can read `issues.length === 0` instead.
- **Double-click to edit (Session 107).** Double-clicking any variable chip — whether in a corpus read-card, a custom-message read-card, or inside the Tiptap edit-card editor — lands the visitor on where that variable is edited. One handler in `configurator-section.tsx` (`handleVariableDoubleClick(categoryId, variableName)`) branches on `isIdentityToken(variableName)`: identity tokens (`business_name` / `workspace_name` / `community_name`, per D-413) trigger `scrollIntoView({ block: "center" }) + focus()` on the top-of-page businessName input ref; non-identity tokens set both `editValuesCategoryId` (opens the Variables surface — desktop expander or mobile modal per viewport) and a decoupled `focusVariableOnOpen` state that the Variables form's focus-delivery effect reads to focus the matching input by its `edit-values-{catId}-{name}` id and call `onFocusDelivered` to clear the upstream signal. Read-card variable spans swallow single-click via `stopPropagation` so the parent edit-handler doesn't open the edit card on the first half of a double-click sequence; the only way to open the edit card from a chip is via the surrounding body text or the pencil. The Tiptap NodeView's double-click handler calls `preventDefault + stopPropagation` and resolves the callback through a mutable ref so the closure stays current despite Tiptap's frozen extensions array.

### Global mobile-input rule (Session 107)

`marketing-site/app/globals.css` carries a single `@media (max-width: 767.98px)` rule forcing `font-size: 16px !important` on every `input`, `textarea`, and `select` element below the `md:` breakpoint. iOS Safari/Chrome auto-zooms on focus when the computed font-size is < 16px; the rule kills that zoom site-wide without touching desktop visuals. `!important` is intentional — Tailwind text-size utilities (`text-sm`, `text-xs`) would otherwise win on specificity. Replaced the prior per-input `text-base` patch on the waitlist email input, which is now removed (single source for the behavior).

**PostHog instrumentation.** Eight snake_case conversion events fire client-side: `configurator_category_toggled`, `configurator_sub_toggled`, `configurator_message_customized` (once per message per session, on first override), `configurator_custom_message_added`, `configurator_copy_clicked`, `early_access_clicked` (fired inside the waitlist context's `openModal`, carrying the configurator snapshot + CTA source), `early_access_submitted` (waitlist form submission succeeds — same payload shape as `early_access_clicked`, so opened→submitted funnels join on `source`), and `early_access_submission_failed` (submission fails — payload carries `source` + `failure_reason`: `network` / `validation` / `server` / `unknown`). No PII in any payload.

### Waitlist modal — `marketing-site/components/waitlist-modal.tsx`
**Status:** Shipped Session 90 (`feat/waitlist-modal`); design-polished Session 91 (`feat/waitlist-modal-design`, merged to main). Pre-launch posture surface — reverts when onboarding ships (`docs/PRE_LAUNCH_DEVIATIONS.md` entry 7). Build decision: MD-20 (`docs/MARKETING_STRATEGY.md`).

In-page modal that captures an email for the early-access waitlist. Mounted once at the layout level (`app/layout.tsx`, inside `WaitlistProvider`); opened by all three "Get early access" CTAs (top-nav, configurator mid-page, closing strip), each passing a `cta_source` (`top-nav` / `mid-page` / `bottom`).

Structure (hand-rolled, mirrors `prototype/components/sign-in-modal.tsx`): backdrop `bg-black/50 z-[100]`, card `z-[101] max-w-[400px] rounded-2xl bg-bg-primary p-8`, X close button, Escape + backdrop close, body-scroll lock. Untitled UI tokens only. The modal reads in a founder voice — a first-person note from Joel, not a transactional form.

Single `status` state — `idle` / `loading` / `success` / `error`:
- **idle:** header "Get on the list"; a founder subhead ("Summer 2026 is the target. I'll send one email when it's live — no drip, no marketing churn."); a "— Joel, solo founder" signoff inline below the subhead; a "Live at launch:" label above a row of non-interactive category pills — one per configurator-selected category, read from `WaitlistContext`, defaulting to a single "Verification" pill on pages with no configurator; email input; "Join the list" submit. The form area carries `min-h-[320px]`; pills use the configurator's selected-tone-pill styling (`bg-bg-brand-secondary` tint, `px-3 py-1.5`).
- **loading:** spinner in the button, button disabled; backdrop/X/Escape gated off.
- **success:** its own moment, not a collapsed form — header "You're in.", body "I'll send you an email when it ships.", then a full-width primary "Close" button. No pills, label, or signoff.
- **error:** inline message — "Something's not working on our end. Try again, or email joel@relaykit.ai and I'll add you manually." The email field stays visible so retry is one click.

The configurator publishes a lightweight selection summary up into `WaitlistContext` (`context/waitlist-context.tsx`) via an effect; the modal reads it. Submit POSTs `{ email, categories, tone, businessName, configuratorTouched, ctaSource }` to `POST /api/early-access`, which writes the `early_access_subscribers` Supabase table (migration `007`) and sends a Resend welcome email for new signups. `GET /api/unsubscribe?token=…` backs the welcome email's unsubscribe link.

### Blog — `/blog/*`

**Status:** V1 scaffold shipped Session 89 (branch `feat/blog-scaffold`, merged to main). In-repo MDX per D-387; cluster-primary taxonomy per D-388.

The blog is part of the `marketing-site/` app, not the prototype. Posts are MDX files at `marketing-site/content/posts/*.mdx`; rendering, RSS, sitemap, and SEO metadata live in `marketing-site/{lib,components,app}/blog/`. Three route surfaces plus a feed:

**Blog index — `/blog`.** Chronological list of published posts, newest first. Container `mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8` (matches the legal-doc layout). Header: H1 "RelayKit Blog" (`text-3xl font-semibold text-text-primary`) + a one-line tagline from the `BLOG_DESCRIPTION` constant. Body: a stack of post cards. Empty state: "No posts yet — check back soon."

**Post card** (`components/blog/post-card.tsx`, used by the index and cluster pages). Per post: a cluster badge + `·` separator + lane indicator row; H2 title linking to the post; description paragraph; a meta line (date · reading time). `border-b border-border-secondary` between cards.

**Post page — `/blog/[slug]`.** Reading-width column (`Prose` wrapper, `max-w-[68ch]`). Header: cluster badge + `·` + lane indicator, H1 title, meta line (date · reading time · "By Joel Natkin"). Body: MDX rendered through a hand-rolled component map (`lib/blog/mdx-components.tsx`) — the site has no `@tailwindcss/typography`, so every element (headings, lists, blockquote, table, links, code) is styled against semantic tokens. Code blocks: Shiki highlighting at build time (`github-dark` theme) on the theme-invariant `bg-bg-code-surface`. Smart quotes/dashes via `remark-smartypants`. Each post emits a JSON-LD `BlogPosting` block, OG/Twitter metadata, and a canonical link (`canonical_url` frontmatter if set, else self-canonical).

**Cluster index — `/blog/cluster/[name]`.** One page per cluster (11 clusters, slugs in `lib/blog/clusters.ts`). Same container as the blog index. Header: "Cluster" eyebrow (`text-text-brand-secondary`), H1 cluster name, cluster description. Body: post cards filtered to that cluster. Zero-post clusters render an empty state rather than 404, so cluster badge links never break. Unknown cluster slugs 404 (`dynamicParams = false`).

**RSS feed — `/blog/feed.xml`.** RSS 2.0 over published posts, generated statically.

**Cluster badge vs. lane indicator.** The cluster badge is a brand-tinted pill and is clickable (→ `/blog/cluster/[slug]`). The lane indicator is deliberately *not* a pill — it renders as plain `text-xs text-text-tertiary` text, separated from the cluster badge by a `·`. Lane filtering is out of V1 scope (D-388); the flat styling avoids implying a control that does not exist.

**Frontmatter schema** (`lib/blog/types.ts`): `title`, `slug` (must equal filename stem), `date` (ISO), `cluster` (one of 11), `lane` (demand/supply/retrospective/worldview), `status` (draft/ready/published), `description`, optional `canonical_url`, optional `og_image`. Only `status: published` posts appear anywhere in V1 — index, cluster pages, sitemap, RSS, and static params all filter to published; draft/ready posts 404 on direct URL.

**Discoverability.** Linked from the marketing-site footer ("Resources" column). Not in the top nav (V1 scope decision). Reachable also via sitemap and RSS.

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
