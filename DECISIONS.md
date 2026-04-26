# DECISIONS.md — RelayKit
## Authoritative Decision Log

> **How this file works:**
> - CC reads this at the start of every session (triggered by `DECISIONS CHECK` command)
> - CC checks relevant entries before implementing anything that touches them
> - When a new decision is made, CC appends it immediately (not at session end)
> - When a direction contradicts an existing entry, CC stops and flags it: "⚠ DECISION CONFLICT: This contradicts D-[number]. Confirm override before I continue."
> - Archived decisions (D-01–D-83) are in DECISIONS_ARCHIVE.md — still authoritative, just not loaded every session

---

Every new decision uses this template. Supersedes is required — write "none" if nothing is superseded. Skipping the field is a process failure.
**D-### — Title** (Date: YYYY-MM-DD)
[One paragraph stating the decision in declarative voice. What was chosen, and what that means concretely.]
**Supersedes:** D-###, D-### (or "none")
**Reasoning:** [One paragraph — only if non-obvious. Skip for straightforward choices.]
**Affects:** [Concrete files, systems, or docs the decision touches.]
Six gate tests — a proposed decision must pass ALL six

Shortcut test. Can the change be fully expressed as "move X below Y" or "change size to Z"? → PROTOTYPE_SPEC, not a decision.
Implementation-of-decision test. Does an existing D-number already cover the conceptual choice? → PROTOTYPE_SPEC or no action.
String-level copy test. Is this pill text, body copy, button label, or microcopy? → PROTOTYPE_SPEC, not a decision.
Code-only rename test. Does this only change internal code identifiers without touching user-visible scope? → Refactor, no D-number.
Six-month test. Would a future contributor or CC session need this recorded to understand why the code looks the way it does? If no → skip the D-number.
Scope test. Does this change what we're launching or in what order? → MASTER_PLAN amendment, not a decision.

Supersession rule (the critical one)
When a new decision replaces an older one, the older one gets marked in the same commit — not later, not at the next sweep. The mark is a single line appended to the older decision's body:
⚠ Superseded by D-###: [brief explanation of what changed]
Full stewardship rules — pre-flight scan, inline supersession enforcement, retirement sweep — live in CLAUDE.md. Full PM-side rules live in PM_PROJECT_INSTRUCTIONS.md.

---

## Archived Decision Index (D-01–D-83)

Full text in DECISIONS_ARCHIVE.md. One-line summaries for quick reference:

**Architecture (D-01–D-09)**
- D-01: Subaccounts per customer (ISV model)
- D-02: No Twilio SDK — fetch() only
- D-03: Magic link auth, no passwords
- D-04: Deterministic templates — no AI for compliance artifacts
- D-05: Compliance sites on Cloudflare Pages, neutral domain
- D-06: All traffic through RelayKit proxy
- D-07: MESSAGING_SETUP.md canonical in PRD_05 §3.1
- D-08: resolveMessageContext() pattern for Phase 2
- D-09: Business-identity fields authoritative on registrations, not customers

**Data Model (D-10–D-14)**
- D-10: No UNIQUE on message_plans.customer_id
- D-11: Nullable project_id columns for Phase 2
- D-12: business_industry nullable on customers
- D-13: Canon messages stored as JSONB on registrations
- D-14: recipient_consents table for MIXED marketing consent

**Registration & Compliance (D-15–D-26)**
- D-15: Campaign registration static after approval — expansion = second campaign ⚠ Superseded by D-294: marketing auto-submits at registration (if used in sandbox) or on-demand, not as a separate expansion step.
- D-16: MIXED tier registered from day one (⚠ superseded by D-89)
- D-17: Review timing 2–3 weeks (⚠ superseded by D-215 — now "a few days")
- D-18: Healthcare/HIPAA hard decline
- D-19: Compliance monitoring non-optional for all (reframed by D-293: at authoring time, not send time)
- D-20: $15 re-vetting fee absorbed by RelayKit
- D-21: Rejection surfaces as debrief, not error
- D-22: Sole prop OTP 3-use lifetime limit
- D-23: EIN 5-brand limit detection (Phase 2)
- D-24: Multi-channel opt-out required (April 2025 TCPA)
- D-25: Authentication+ 2.0 brand auth state
- D-26: BYO Twilio is Model 2 (Phase 2)

**Pricing (D-27–D-30)**
- D-27: $199 setup + $19/mo transactional + $29/mo mixed
- D-28: Sandbox permanently free
- D-29: Compliance Shield paid tier removed
- D-30: Multi-project billing per project (Phase 2)

**UX & Copy (D-31–D-39)**
- D-31: Experience Principles mandatory before writing copy
- D-32: Pending states always have narrative
- D-33: Approval moment copy — do not genericize
- D-34: Read-only campaign content in review screen
- D-35: Three-tier message library structure
- D-36: Canon = "registered messages" in UI
- D-37: Expansion = "second campaign," never "upgrade" ⚠ Superseded by D-294.
- D-38: Never guarantee compliance outcomes
- D-39: Field annotations one sentence max

**Deliverables (D-40–D-42)**
- D-40: Three-document lifecycle model
- D-41: Build spec is primary sandbox deliverable
- D-42: generateArtifacts() selects 3 for TCR (⚠ superseded by D-90 — now 5)

**Phase 2 Scope (D-43)**
- D-43: Phase 2 items explicitly out of scope for v1

**Production Build Decisions (D-44–D-83)**
- D-44: Pre-reg use case in Supabase user metadata
- D-45: Sandbox API keys plaintext in metadata
- D-46: Sandbox phone verification via Twilio Verify
- D-47: Messages tab read-only; plan builder on Overview only
- D-48: Email templates deterministic, no provider wired
- D-49: Three-tier industry gating before beta
- D-50: MESSAGING_SETUP.md uses credential placeholders
- D-51: Platform ToS/AUP required before beta
- D-52: Phase 1 proxy Postgres-only, no Redis
- D-53: Opt-out table keyed on user_id
- D-54: Sandbox inbound webhook uses 'sandbox' sentinel
- D-55: Pre-reg API key auth uses listUsers() scan
- D-56: Compliance site domain msgverified.com
- D-57: Intake form data never in URL params
- D-58: Single auth page at /login
- D-59: Auth uses email OTP, not magic links
- D-60: Message cards inline editing (superseded by D-69)
- D-61: Locked compliance elements (superseded by D-70 for prefix)
- D-62: Variable pills show interpolated preview
- D-63: Fixed variable palette per category
- D-64: Custom messages via Add card
- D-65: Trigger line "Triggers when..." format
- D-66: "Available" replaces "Included" badge
- D-67: Badge taxonomy Core / Available / Add-on
- D-68: Compliance checklist card removed
- D-69: Always-editable contentEditable pill editor
- D-70: Business name movable pill, validated on save
- D-71: Variable palette with category-specific fixed vars
- D-72: Custom messages via Add card (duplicate of D-64)
- D-73: Catalog flat with nature badges
- D-74: Plan builder reframed as read-only catalog
- D-75: All message types pre-populated
- D-76: Copy format includes preview and template
- D-77: Opt-in consent preview live and copyable
- D-78: SMS_GUIDELINES.md comprehensive for AI advisors
- D-79: Message composer/editor cut
- D-80: Catalog tone is browse-and-reference
- D-81: Sentence builder two fields only
- D-82: TCR submission variety strategy (count superseded by D-90)
- D-83: Catalog page display-only

---

## Active Decisions (D-84+)

**D-84 — "SMS Blueprint" replaces "Build Spec" in all customer-facing copy** (Date: 2026-03-13)
The developer-facing document is called the **SMS Blueprint**, personalized as `{app_name} SMS Blueprint` (e.g., "RadarLove SMS Blueprint"). File: `{app_slug}_sms_blueprint.md`. "Build spec" sounds like work for the developer; "Blueprint" frames it as a plan their AI executes. Internal code references (function names, variable names) may remain `build_spec` for now — this is a customer-facing naming decision. The guidelines file is similarly personalized: `{app_name} SMS Guidelines`.
_Affects: PRD_05, PRD_06, all customer-facing copy, download UI, email templates._

**D-85 — No plan builder — category selection is sufficient for registration scope** (Date: 2026-03-13)
**Supersedes plan builder concept in PRD_06. Extends D-74, D-75.** There is no message selection step, no enable/disable toggle, no curation UI at the RelayKit level. The developer picks a category; RelayKit determines campaign type, generates artifacts, and submits. All messages in the category library are available as reference. The intelligence about "which messages should I implement?" lives in the conversation between the developer and their AI coding tool, not in a RelayKit UI.
_Affects: PRD_06 (significant simplification), PRD_01, PRD_02, PRD_05._
⚠ Orphaned: plan-builder UI fully retired per D-280 + D-279 + D-332.

**D-86 — Full-library Blueprint — all messages for the category** (Date: 2026-03-13)
The SMS Blueprint includes every message type for the developer's category, not a curated subset. `generateBuildSpec()` (or equivalent) takes category + customer data and returns the full library rendered with their business details. No `messagePlan` with per-message enabled state. The AI coding tool sees the full landscape and helps the developer choose which to implement during the build conversation.
_Affects: PRD_05, PRD_06 build spec generator._

**D-87 — Blueprint includes "Before building, ask me" section** (Date: 2026-03-13)
Use-case-aware clarifying questions appear at the top of the Blueprint, before implementation instructions. The AI encounters them first and asks before writing code. Questions are use-case-specific: appointment apps get different questions than verification systems. Examples: "Do you have an existing database schema?" / "What framework handles scheduled jobs?" / "Where does the opt-in form live in your existing signup flow?" These question sets need to be authored per use case as PRD_05 content work.
_Affects: PRD_05 template structure._

**D-88 — Blueprint generates a complete reference implementation** (Date: 2026-03-13)
The Blueprint instructs the AI to produce a complete, working SMS feature — not a utility function, not a scaffold. All core messages for the category triggered correctly, with error handling, opt-in form, and compliance patterns baked in. The "Before building, ask me" pattern (D-87) is what makes the first-try claim credible.
_Affects: PRD_05 template content and framing._

**D-89 — Marketing is always a separate campaign — never MIXED on initial registration** (Date: 2026-03-13)
**Supersedes D-16.** Initial registration is always transactional-only. This is a strategy, not a limitation: a transactional-only submission tells a tight, coherent story to the TCR reviewer. Marketing capability is added via a second campaign registration when the developer is ready. `determineCampaignType()` should never return MIXED for initial registration. The $29/mo mixed price point only applies when the developer adds marketing later. "Add marketing campaign" — never "upgrade." Strengthens D-15 and D-37.
_Affects: PRD_01, PRD_02, PRD_04, PRD_06, PRICING_MODEL._
⚠ Superseded by D-294: registration submits both campaigns if developer used marketing in sandbox; otherwise transactional only, with on-demand marketing activation later.

**D-90 — 5 sample messages to TCR, all transactional for initial registration** (Date: 2026-03-13)
**Supersedes D-42 (was "exactly 3"). Updates D-82 (also referenced 3).** TCR accepts 2–5 samples; RelayKit always submits 5 (the maximum) because more samples give the reviewer a fuller picture. For transactional campaigns, all 5 samples are transactional messages from the category library. No marketing messages consume sample slots. Selection follows the anti-cookie-cutter strategy (D-91).
_Affects: PRD_02 generateArtifacts(), PRD_04 submission payload._

**D-91 — Anti-cookie-cutter strategy for TCR submissions and message display** (Date: 2026-03-13)
Two layers: (1) **Wording variation** — each category has 2–3 message variant sets with different word order and phrasing. Not every message starts with `{app_name}:`. A dental practice's reminder reads differently from a hair salon's. (2) **Selection rotation** — with 5–8 base messages per category, the 5 submitted to TCR rotate across registrations to avoid pattern detection. On the Messages page, pill selectors let the developer browse variant sets and mix-and-match. This is both a UX improvement and a registration approval strategy.
_Affects: PRD_02 template library (content authoring), Messages page prototype, PRD_04 selection algorithm._

**D-92 — Platform-specific setup instructions at Blueprint download moment** (Date: 2026-03-13)
Three steps max, one line per platform (Claude Code, Cursor, others). Lives on the Messages page near the Blueprint download CTA. Not a tutorial, not a video. Example — Claude Code: `Put both files in your project root. Then: "Read radarlove_sms_blueprint.md and build my messaging feature."`
_Affects: PRD_05 download UX, Messages page prototype._

**D-93 — Core positioning locked** (Date: 2026-03-13)
"Tell Claude Code to build your messaging feature. It might just work on the first try." All customer-facing copy points in this direction. RelayKit describes itself as the SMS context layer for AI coding tools. The Blueprint is the product. The API is the runtime.
_Affects: PRD_07 landing page, all marketing copy, onboarding copy._

**D-94 — "Your Apps" is the logged-in home page** (Date: 2026-03-13)
After login, the developer lands on "Your Apps" — a list of their apps with status per app (sandbox / building / registered / live). This page is also the launch point for new apps: "Add new app" → category selection (logged-in variant) → app name → phone verification → Blueprint download. Scales from 1 to N apps without redesign.
_Affects: PRD_06, PRD_11 (this partially implements the multi-project concept at a lightweight level)._

**D-95 — One app = one registration = one category = one Blueprint (1:1:1:1)** (Date: 2026-03-13)
Hard guardrails. Each app gets exactly one category, one registration, one Blueprint, one subaccount. A developer with two different apps makes two separate registrations. This keeps scope clean for TCR, prevents category confusion, and gives new users a clear mental model.
_Affects: PRD_06, PRD_04, "Your Apps" page design._

**D-96 — Email + phone verification required before Blueprint download** (Date: 2026-03-13)
Auth gate (sign in / sign up via magic link or email OTP per D-59) precedes Blueprint download. Email enables re-engagement ("You started building — ready to register?"). Sandbox phone number collected as "What number should we text?" — framed as development tooling, exciting not bureaucratic. This is separate from TCR business phone collected at registration. Strengthens the phone verification split established in D-46.
_Affects: Messages page auth gate, onboarding flow._

**D-97 — Per-app pages: Messages, Compliance, Settings — tabs appear after Blueprint download** (Date: 2026-03-13)
Before Blueprint download, the per-app experience is the Messages page only — no tab bar component, no Compliance, no Settings. After Blueprint download, the tab bar appears with Messages + Compliance + Settings. Tabs earn their place by becoming relevant. Compliance education lives on marketing/category landing pages, not in the app.
_Affects: Per-app layout component, prototype progressive disclosure._

**D-98 — Settings tab exists post-Blueprint-download only** (Date: 2026-03-13)
Contains: SMS compliance alerts toggle, account info (business name, email, phone, registration date), API key management (sandbox + live side by side, copy buttons, regenerate for sandbox only). Sub-copy on API keys: "Your AI coding tool will use this key automatically when it reads your SMS Blueprint."
_Affects: Per-app Settings page._

**D-99 — Billing lives per-app AND per-account** (Date: 2026-03-13)
Per-app Settings shows that app's plan, cost, and status (sandbox / active / paused). Parent-level account view shows total monthly spend across all apps, payment method, invoices, billing history. Per-app answers "what does this app cost me?" — parent answers "what does RelayKit cost me?"
_Affects: Settings tab billing section, "Your Apps" or account-level billing page._

**D-100 — Logged-in return flow uses lighter category selection** (Date: 2026-03-13)
When a logged-in developer creates a new app from "Your Apps," they see a streamlined category selection — not the full marketing category landing page. It assumes they already know what RelayKit is and skips the value prop/persuasion. Pick a use case → name the app → verify phone → get Blueprint. Auth already handled.
_Affects: "Your Apps" new app flow, category selection component (two faces: public/persuasive vs. logged-in/streamlined)._

**D-101 — Opt-in disclosure must enumerate implemented message types** AI documents must instruct on updating it. SMS_GUIDELINES.md includes an explicit instruction that opt-in disclosure language must be updated whenever the developer adds or removes a message type. The Blueprint's "Before building, ask me" section asks which message types are being implemented so the AI generates correct opt-in language from the start. The opt-in form is not a static block — it's a living disclosure tied to the developer's actual message set.
⚠ Superseded by D-363: generic language replaces enumeration.

**D-102 — App name vs. business name: two separate fields with different mutability rules** (Date: 2026-03-13)
app_name is a mutable display label on the app record. The developer can change it at any time across the full lifecycle. It's used in: "Your Apps" card labels, nav/header, Messages page sentence builder previews, Blueprint filename ({app_slug}_sms_blueprint.md), Blueprint message previews, and platform setup instruction copy. Changing it pre-registration is trivial — regenerate the Blueprint. Changing it post-registration updates the UI display but does not affect the registration, compliance site, canon messages, or TCR submission.
business_name is collected at registration time (intake wizard business details), stored on the registration record, and immutable after TCR submission. It's used in: TCR brand registration, campaign description, canon messages (the 5 submitted samples), compliance site content at {slug}.msgverified.com, opt-in disclosure language, and drift detection baseline. Changing it requires canceling and restarting registration.
Pre-registration, business_name doesn't exist yet. The Blueprint and Messages page use app_name everywhere. At registration, the developer confirms or provides their legal business name — it may match app_name or differ (e.g., app is "RadarLove", business is "Radar Love LLC"). This is fine — CTIA requires brand identification in messages but doesn't require an exact match to the legal entity name.
The {app_name} variable in message templates resolves to whichever name is contextually appropriate: app_name in sandbox/preview contexts, business_name in registration/compliance/canon contexts. The Blueprint's opt-in disclosure section uses business_name when available, falling back to app_name pre-registration.
Edge case: if a developer changes app_name after downloading their Blueprint, the old file on disk contains the old name. The download UI should note "Re-download if you've changed your app name" but this is not a blocking issue — the AI will use whatever name is in the file, and the developer can override it in conversation.
Affects: app record schema (app_name mutable field), registration record schema (business_name immutable after submission), Blueprint generator (name resolution logic), Messages page sentence builder, compliance site generator, TCR submission payload, drift detection baseline.

**D-103 — message_plans table kept but auto-populated with full category library** (Option B) (Date: 2026-03-13)
With the plan builder removed (D-85), the message_plans table's role changes. Rather than storing per-message selections, it stores the full category library automatically. When a developer selects a category, message_plans is populated with all messages for that category — all enabled, none edited. The messages JSONB array structure is preserved. The enabled and edited_text fields exist but carry no meaningful state at the RelayKit level. This preserves the schema for potential future features (post-registration message customization, usage tracking per message type) without requiring a migration. The Blueprint generator reads category + customer data directly rather than consuming plan builder output.
Alternative rejected: Option A (radical simplification removing JSONB array) — would require schema migration if we ever want per-message state back.
Affects: PRD_06, message_plans table, Blueprint generator input.

**D-104 — PRDs must be updated before production build steps resume** (Date: 2026-03-13)
D-84 through D-103 represent significant product direction changes that are NOT yet reflected in the PRD files. Before CC builds production code from any PRD, that PRD must be updated to reflect current decisions. The change map (from VISION_IMPLEMENTATION_MEMO.md in docs/) lists specific changes per PRD. Priority order matches the build order: PRD_06 before Step 2, PRD_05 before Step 3, PRD_02 before Step 3, PRD_01 + Addendum before Step 4, PRD_04 before Step 5, PRD_07 before Step 7. CC must not build from a PRD that contradicts D-84–D-103 — if it encounters a conflict, flag it per the standard DECISIONS conflict protocol.
Affects: All PRDs, build order timing, CC session planning.

_Update 2026-04-21: Superseded by D-358 (/src sunset). The VISION_IMPLEMENTATION_MEMO.md referenced here was deleted 2026-04-21 per its own "consume and discard" header. PRD evolution is now governed by MASTER_PLAN.md phase work._

**D-105 — Registration money-back guarantee** (Date: 2026-03-14)
If a customer's carrier registration is not approved, they receive a full refund of the $199 setup fee. This guarantee is displayed on the marketing home page. Scope: covers registration rejection only, not account suspension due to customer violations post-approval. Terms to be detailed in ToS.
Affects: Marketing home page, pricing display, ToS, Stripe refund logic (future).
⚠ Amount superseded by D-320 (now $49); intent preserved.

**D-106 — Category landing page has message style preview with variant toggle** (Date: 2026-03-15)
The `/sms/[category]` landing page includes a message preview section below the hero with three style pills (Brand-first / Action-first / Context-first) and three sample message cards (Booking confirmation, Appointment reminder, Cancellation notice). Each card shows the message text in the selected variant with interpolated preview values. Variable values render as `font-medium text-text-brand-tertiary` (subtle purple, medium weight) to distinguish from static text without competing with card titles. Trigger lines use "Sent when..." format, not "Triggers when...". This section demonstrates the anti-cookie-cutter strategy (D-91) on the marketing page.
_Affects: `prototype/app/sms/[category]/page.tsx`._

**D-107 — Public messages page at /sms/[category]/messages replaces placeholder** (Date: 2026-03-15)
The `/sms/[category]/messages` page is a full public-facing marketing page with the complete message library, style variant pills, `CatalogCard` components with checkboxes/copy/prompt nudges, and a `CatalogOptIn` form — all reusing components from the existing `/c/[category]/messages` catalog page. Styled as a marketing page (same nav, footer, typography as Home and `/sms/[category]`), not as an in-app dashboard. The existing `/c/[category]/messages` page remains unchanged.
_Affects: `prototype/app/sms/[category]/messages/page.tsx`._

**D-108 — "Download RelayKit" is the single primary CTA, not two separate buttons** (Date: 2026-03-15)
The messages page uses a single entry point — "Download RelayKit" — not separate "Download Blueprint" and "Start building with RelayKit" buttons. One door, not two. The download action triggers an auth gate (sign in to download). This applies to both the default layout and the steps layout. The CTA text does not include the word "Blueprint" — it's "Download RelayKit" or "Download RelayKit for [Category]".
_Affects: `prototype/app/sms/[category]/messages/page.tsx`, all CTA copy on the messages page._

**D-109 — Messages page subhead references "two files", not "Blueprint"** (Date: 2026-03-15)
The messages page subhead and CTA copy avoid the word "Blueprint" and instead reference the deliverable as "two files your AI coding tool reads to build and maintain your messaging feature." This is more concrete and less branded. The integrated hero variant (selected as the default) weaves the CTA inline into the subhead paragraph.
_Affects: Messages page hero copy._

**D-110 — Tool selector with per-tool setup instructions** (Date: 2026-03-15)
The `?layout=steps` version of the messages page includes a tool selector section between the hero and the main content. Six tools: Claude Code, Cursor, Windsurf, GitHub Copilot, Cline, and Other. Each shows a recognizable SVG icon (48px circle) and 2-3 lines of per-tool setup instructions. The prompt/command text renders in a light inline code style (`font-mono bg-bg-secondary`) with a clipboard copy button. Claude Code is selected by default. The section has no card wrapper — sits directly on the page. This implements D-92 (platform-specific setup instructions) in a more interactive format.
_Affects: `prototype/app/sms/[category]/messages/page.tsx` (steps layout)._

**D-111 — Personalization via localStorage, not session-only** (Date: 2026-03-15)
The messages page stores personalization data (app name, website URL, service type) in `localStorage` under the key `relaykit_personalize`, not just `sessionStorage`. This survives page refreshes and return visits. The data syncs to the session context on mount and updates message cards, opt-in form, and CTA copy in real time. In the default layout, personalization is accessed via a slideout panel triggered by a "Personalize" button. In the steps layout, personalization fields are always visible in the left column.
_Affects: `prototype/app/sms/[category]/messages/page.tsx`._

**D-112 — Marketing messages separated from core messages on public page** (Date: 2026-03-15)
On the public messages page, expansion/marketing messages (Promotional offer, Feedback request) are removed from the main message list and displayed in a separate "Need promotional messages too?" callout section. The callout explains that marketing requires a separate carrier registration (reinforcing D-89). Marketing message cards render at 70% opacity with `border-border-tertiary` and an "Available with marketing registration" badge. This is consistent with D-89's position that initial registration is always transactional-only.
_Affects: `prototype/app/sms/[category]/messages/page.tsx`._

**D-113 — Steps layout is the default messages page** (Date: 2026-03-16, updated from 2026-03-15)
The steps layout is now the default for the public messages page at `/sms/[category]/messages`. The old layout (right-heavy, messages left + opt-in right) is preserved at `?layout=default` for comparison. The steps layout includes the tool selector (D-110), personalization on the left, and messages on the right. Both layouts share the same data, components, and localStorage persistence. Decision finalized — steps layout won.
_Affects: `prototype/app/sms/[category]/messages/page.tsx`._

**D-114 — Download modal with account upsell and files-only path** (Date: 2026-03-16)
The "Download RelayKit" button on the messages page opens a modal with two paths: (1) Create an account (email → 6-digit OTP → downloading confirmation) which gives them sandbox access, personalized files, and a dashboard; (2) "Just the files please" which triggers an immediate download and shows a soft re-invitation ("Your sandbox is free whenever you're ready"). The modal headline is "Get more from RelayKit with an account" with two grouped benefit lists: what the files give you (3 items) and what an account adds (5 items). The OTP input uses 6 individual digit boxes matching the production PinInput component styling.
_Affects: `prototype/app/sms/[category]/messages/page.tsx`._

**D-115 — Tool selector uses real SVG logos** (Date: 2026-03-16)
The tool selector section uses official SVG logos from `prototype/public/logos/` for Claude Code, Cursor, Windsurf, GitHub Copilot, and Cline. "Other" uses a generic code brackets icon. Logos render at full color at all times — unselected at 60% opacity, selected at 100% with a 2px solid purple border on the circle. No background fill on either state.
_Affects: `prototype/app/sms/[category]/messages/page.tsx`, `prototype/public/logos/`._

**D-116 — Your Apps page and project layout shell** (Date: 2026-03-16)
Logged-in users land at `/apps` showing their projects as cards in a grid. Each card shows app name, category pill, status pill (Sandbox/Registered/Live), and created date. Cards link to `/apps/[appId]/overview`. The per-project layout has a breadcrumb ("Your Apps / {AppName}") and four tabs: Overview, Messages, Registration, Settings. No state toggle or A/B/C switcher — those were prototype controls, now removed.
_Affects: `prototype/app/apps/page.tsx`, `prototype/app/apps/[appId]/layout.tsx`._

**D-117 — Standalone dashboards A/B/C deleted** (Date: 2026-03-16)
The standalone `/dashboard-a`, `/dashboard-b`, `/dashboard-c` routes and the `/choose` category picker page were deleted. Dashboard A/B/C were alternatives (per D-feedback); the per-project layout at `/apps/[appId]/` replaces them. The A/B/C components still exist in `components/dashboard/` but are not imported by any page. The top nav no longer shows Dash A/B/C links.
_Affects: Deleted `prototype/app/dashboard-a/`, `dashboard-b/`, `dashboard-c/`, `choose/`. Modified `prototype/components/top-nav.tsx`._

**D-118 — Top nav simplified: no per-project links** (Date: 2026-03-16)
Logged-out nav shows: Home, Appointments, Messages, Sign in. Logged-in nav shows: Your Apps, Sign out. Per-project tabs (Overview, Messages, Settings) live exclusively in the app layout tab bar, not in the top nav. No A/B/C version switcher or state toggle in the top nav.
_Affects: `prototype/components/top-nav.tsx`._

**D-119 — Overview page is guided onboarding, not a dashboard** (Date: 2026-03-16)
The Overview page at `/apps/[appId]/overview` is a two-column guided onboarding flow with 4 sequential steps: (1) Verify phone, (2) Send test message from dashboard, (3) Send message from code, (4) Build SMS feature with AI tool. Steps are always visible with locked/active/completed states and a vertical timeline connector. The right column is a persistent registration pitch card with benefits, pricing ($199 + $19/mo), D-105 refund guarantee, progress bar, and "Start registration" CTA. Steps unlock sequentially. Completing all 4 triggers a celebration message with registration CTA.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-120 — App messages tab reuses public messages page** (Date: 2026-03-16)
The Messages tab at `/apps/[appId]/messages` renders the same component as the public messages page at `/sms/[category]/messages`. It imports and renders `PublicMessagesPage` directly. The component falls back to "appointments" when no category URL param is present. This ensures identical content in both contexts. Differentiation between logged-in and public versions is deferred to a later session.
_Affects: `prototype/app/apps/[appId]/messages/page.tsx`._

**D-121 — Shared footer component, dead links removed** (Date: 2026-03-16)
Footer extracted to a shared `Footer` component at `prototype/components/footer.tsx`. The "Company" section (About, Blog) was removed — those pages don't exist. Legal links (Terms, Privacy, Acceptable Use) point to `#` as placeholders. The footer is used on the messages page (both layouts) and compliance page. The homepage retains its own inline footer with scroll-to-section links.
_Affects: `prototype/components/footer.tsx`, multiple pages._

## New This Session

**D-122 — Tab order: Overview, Registration, Messages, Settings** (Date: 2026-03-16)
The app layout tab bar order is Overview → Registration → Messages → Settings. Registration moves to second position (previously third after Messages) because it's the natural next step after onboarding and should be visually adjacent to the Overview tab where users are guided.
_Affects: `prototype/app/apps/[appId]/layout.tsx`._

**D-123 — Registration sidebar on Overview is a minimal pointer, not a sales pitch** (Date: 2026-03-16)
The registration card in the Overview page right column was stripped back to: heading ("Go live with real users"), one line of context about 2–3 week timeline, pricing ($199 setup + $19/mo), refund guarantee, and a "Learn more →" tertiary link to the Registration tab. Removed: six benefit checkmarks, primary "Start registration" CTA button, progress bar with dots. The card is a quiet persistent reminder — the onboarding steps on the left own all primary actions.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`. Supersedes the sidebar portion of D-119._

**D-124 — Step 3 code block collapsed by default with expander** (Date: 2026-03-16)
The "Now you send one" code block in the Overview onboarding shows only the first 4 lines (fetch URL, method, auth header) by default. A "Show full script" toggle reveals the rest. The copy button always copies the full script regardless of collapsed state. The `to` number is pre-filled with the user's verified phone from Step 1, and the `body` is pre-filled with the message selected in Step 2.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-125 — Step 3 troubleshooting directs users to their AI coding tool** (Date: 2026-03-16)
Instead of inline Node.js troubleshooting text ("When your terminal prints 'queued'..."), Step 3 shows: "Having trouble? Copy this into your AI coding tool:" followed by a copyable prompt block. This keeps RelayKit's voice consistent — we're a tool for vibe coders, so debugging help comes from their AI tool, not from us.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-126 — Registration tab removed — Overview absorbs registration at each lifecycle stage** (Date: 2026-03-16)
The Registration tab is removed from the app layout tab bar. Tabs are now: Overview, Messages, Settings (three tabs only). Registration content lives on the Overview page — the Go live sidebar card during onboarding, and the celebration CTA after completing all steps. As the product matures, Overview will surface registration status contextually rather than as a separate tab. Supersedes D-122.
_Affects: `prototype/app/apps/[appId]/layout.tsx`._

**D-127 — Troubleshooting in onboarding uses progressive disclosure** (Date: 2026-03-16)
Troubleshooting blocks in onboarding steps are wrapped in collapsible expanders, collapsed by default. The trigger is a simple clickable text link (e.g., "Having trouble?"). This keeps the primary flow clean while making help discoverable. The pattern is extensible — additional troubleshooting options can be added inside the expander later.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-128 — Step 3 completion button says "I got the message" not "I sent it"** (Date: 2026-03-16)
The self-report button in Step 3 changed from "I sent it ✓" to "I got the message ✓". The user's action is sending a script from their terminal, but the confirmation they care about is receiving the SMS on their phone. The button text should match the outcome, not the action.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-129 — Completed onboarding collapses to single row with "Review steps" expander** (Date: 2026-03-16)
When all 4 onboarding steps are complete, the step-by-step timeline is replaced with a single collapsed row: green checkmark + "Sandbox setup complete" + "Review steps" toggle. Expanding shows the four completed step labels. This frees the page for registration content without losing access to the onboarding summary.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-130 — Sidebar card disappears post-onboarding — registration pitch takes full width** (Date: 2026-03-16)
The two-column layout (steps + sidebar card) is replaced with a full-width layout once onboarding completes. The "Go live with real users" sidebar card is removed. Registration pitch content becomes the main content area below the collapsed onboarding row. Supersedes D-123 for the completed state.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-131 — Registration pitch structure: hook → two-column → timeline → pricing → CTA → note** (Date: 2026-03-16)
The post-onboarding registration pitch follows a fixed structure: (1) hook line about sandbox vs. real users, (2) two asymmetric cards — "What we handle" (5 items) vs. "What you provide" (3 items, intentionally shorter), (3) horizontal timeline strip (You 5min → We submit → Carriers review 2–3 weeks → You're live), (4) pricing ($199 + $19/mo) with refund guarantee, (5) primary "Start registration" CTA, (6) no-pressure note about sandbox working indefinitely. The visual asymmetry between the two cards is deliberate — it communicates that the developer's burden is light.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-132 — Three-section accordion: Build / Register / Monitor** (Date: 2026-03-16)
The Overview page uses three collapsible sections: "Build your SMS feature" (4-step onboarding wizard), "Register your app" (registration narrative + pitch), "Monitor your compliance" (placeholder for post-approval). Each section has a checkbox heading — unchecked when incomplete, checked when done. The first incomplete section auto-expands on page load; all others are collapsed. Any section can be expanded at any time. Completing Section 1 auto-collapses it and auto-expands Section 2. Supersedes D-129 (collapsed onboarding row) and D-130 (sidebar disappears post-onboarding). The right-column sidebar card now persists across all states.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-133 — Per-step "Redo" links on completed onboarding steps** (Date: 2026-03-17)
Each completed onboarding step shows a "Redo" link on the right side of its collapsed summary row. Clicking "Redo" reopens the step to its interactive state without resetting any other step's completion. Completing the step again returns it to completed state. Step 1's old "Change" button (which reset all steps) is replaced by the non-destructive "Redo" pattern. Phone number changes in Step 1 trigger inline amber warning bars on completed Steps 2 and 3 (e.g., "Your verified number changed. Redo to send a test to +1 [new number]."). Warnings clear when the affected step is redone and completed with the new number. Step 4 is not affected by phone changes.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-134 — Breadcrumb removed, app name above tabs** (Date: 2026-03-17)
The "Your Apps / GlowStudio" breadcrumb is removed from the app layout — redundant since "Your Apps" is in the top nav and projects are one level deep. The app name (`h1`) now sits above the tab bar. Hierarchy: app identity → tabs → tab content. The "Appointments" category pill sits next to the app name in the layout with purple brand styling (`bg-bg-brand-section_subtle text-text-brand-secondary`).
_Affects: `prototype/app/apps/[appId]/layout.tsx`, `prototype/app/apps/[appId]/overview/page.tsx`._

**D-135 — Right column card is persistent registration action card** (Date: 2026-03-17)
The right column card contains all registration action content: "Register your app" heading, intro paragraph, "Learn more →" link (placeholder href), "Start registration →" primary CTA, pricing ($199 setup + $19/mo with message volume details), refund guarantee, "We handle everything" checklist (4 items), and "Takes just a few minutes" checklist (3 items). All checklists use purple checkmarks. The card is persistent across all section states. The left column sections contain only narrative/educational content — no pricing, CTAs, or checklists.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-136 — Registration section uses 2x2 card grid with icon squares** (Date: 2026-03-17)
The "Register your app" section content uses a structured layout: heading + intro paragraph, then a 2x2 card grid. Each card has an @untitledui/icons icon inside a purple rounded-square (`rounded-lg bg-bg-brand-secondary`), a bold heading, and body text. Cards: (1) MessageXCircle — "Without it, messages don't arrive", (2) ClipboardCheck — "The process is a hassle", (3) ShieldTick — "We handle the whole thing", (4) BellRinging03 — "You stay protected after approval". Timeline strip removed. No-pressure note shortened.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-137 — Compliance section uses same 2x2 card grid pattern** (Date: 2026-03-17)
The "Monitor your compliance" section uses the same card grid pattern as the registration section. Cards: (1) MessageCheckCircle — "Every message checked before sending", (2) SlashCircle01 — "Opt-outs handled for you", (3) SearchRefraction — "We notice when things drift", (4) AlertTriangle — "You'll know when something needs attention". Footer: "Compliance monitoring activates after carrier registration."
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-138 — Prototype state switcher for registration lifecycle** (Date: 2026-03-17)
Overview page has a small state selector (text-tertiary text-sm) right-aligned in the H1 row. Four states: Default, Pending, Approved, Rejected. Plus a "Changes Requested" state. Drives conditional rendering in Section 2, right column card, and Section 2 heading badge. For prototyping only — production state comes from server.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`, `prototype/app/apps/[appId]/layout.tsx`._

**D-139 — Registration trigger is a simple confirmation modal** (Date: 2026-03-17)
"Start registration" opens a centered modal: heading, one-line description, price, "Confirm & pay $199" primary button, "Cancel" secondary. Clicking confirm flips page to Pending state. No real payment flow in prototype.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-140 — Pending state: Section 2 replaces info cards with narrative + expandable** (Date: 2026-03-17)
When registration is submitted, Section 2's 2x2 info cards are replaced with: bold first sentence ("Your registration is submitted."), narrative paragraph, directly-attached "What carriers review" collapsed expandable (4 items: business identity, website/digital presence, message content/use case, opt-in/consent flow), and a text-tertiary keep-building nudge. Badge: brand-colored "In review" (not amber/warning — pending is normal, not alarming).
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-141 — Pending state: right column transforms to status tracker** (Date: 2026-03-17)
Registration pitch card completely replaced with: "Registration status" heading, status badge, submitted date (font-semibold), timeline estimate with email notification ("We'll email you at jen@glowstudio.com"), 6-step vertical stepper (submitted → payment → compliance site → carrier review → phone number → live), and support contact (hello@relaykit.ai). All pricing, checklists, and CTAs removed.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-142 — Approved state: Section 2 shows confirmation narrative + key details** (Date: 2026-03-17)
Approved Section 2 content: confirmation narrative paragraph, phone number, approval date, campaign ID. No info cards, no expandable. Checkbox checked, green "Approved" badge. Section collapsed by default.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-143 — Approved state: right column shows completed stepper + monthly plan** (Date: 2026-03-17)
All 6 stepper steps green. Below stepper: "Your messages are now delivered through carriers" line + monthly plan reference ($19/mo, 500 included, $15 per additional 1,000).
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-144 — Changes Requested state uses brand colors, not error colors** (Date: 2026-03-17)
Resubmission is a normal part of the process (~20-30% of submissions), not a failure. Badge and indicators use brand colors, not red/amber. Stepper grows by one step: "Resubmission under review" inserted as active step after completed "Carrier review." Left column shows detail card: what was flagged, what we did, what happens next.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-145 — Rejected state uses red sparingly, leads with refund confirmation** (Date: 2026-03-17)
Badge: red "Not approved." Stepper shortened to 4 steps (ends at carrier review with red X). Refund line in green (text-success-primary) — "$199 refund issued." Left column: detail card with what was flagged, what this means, your options. "Start new registration" button loops back to Default. Red only on badge and step 4 indicator.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-146 — Compliance sub-switcher for Approved state** (Date: 2026-03-17)
Second tiny dropdown next to the state switcher, only visible in Approved state. Options: "All clear" / "Has alerts." Drives Section 3 content between green mode (status confirmation) and alert mode (action needed).
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-147 — Compliance alerts use left-border accent cards, not full report anatomy** (Date: 2026-03-17)
Alert cards are visually simple: colored left border (red for blocks, amber for warnings), one-line description, one-line reassurance, "View details →" expand. Expanded state shows: the actual message (mono code block), what triggered it, and an AI coding tool prompt to fix it (copyable). No multi-section report layout.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-148 — Compliance alert "What to do" includes copyable AI tool prompts** (Date: 2026-03-17)
Instead of plain-text instructions, compliance alerts provide a copyable prompt the developer can paste into their AI coding tool to fix the issue. Consistent with RelayKit's positioning as a tool for AI-assisted developers.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-149 — Canon messages not duplicated on compliance section — link to Messages tab instead** (Date: 2026-03-17)
Post-approval compliance section links to "View your registered messages →" (Messages tab) rather than displaying a second copy of canon messages. Avoids duplication. Messages tab is the single home for message reference.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-150 — Approved state Overview will become a full operational dashboard** (Date: 2026-03-17)
In Approved state, the three-section accordion is replaced with a proper dashboard layout. Phase 1 cards: usage & billing (with block-based overage math), delivery performance, compliance status, recipient overview, sending patterns (hourly chart), message type breakdown. Phase 2 additions: API health, usage forecasting, delivery drill-down, period comparisons, opt-out analysis, use-case-specific cards, CSV export, real-time updates. Registration details move to Settings tab.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-151 — No partial refund for mid-review cancellation** (Date: 2026-03-17)
Registration cancellation during carrier review is not a designed flow. The promise is "$199. Not approved? Full refund." Mid-review cancellations handled manually case-by-case at founder discretion. No UI for cancellation/partial refund. Revisit post-beta if cancellation requests become a pattern.
_Affects: Pricing model, no UI impact._

**D-152 — Pre-registration support contact not shown — avoid premature support volume** (Date: 2026-03-17)
hello@relaykit.ai and support contact only appear after the developer has paid and is in the registration pipeline. Pre-registration questions will be handled by a help/FAQ page behind the "Learn more →" placeholder link. Keeps CTA focus clean and support volume manageable at beta scale.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`._

**D-153: Cancellation policy**
Plan runs through end of current billing period, then live sending stops, sandbox continues indefinitely. No proration.

**D-154: Registration/number portability**
Offered as a self-service export (registration data) and assisted transfer (phone number via Twilio porting). Surfaced in Settings, not hidden.

**D-157 — Messages page AI command shortlist** (Date: 2026-03-18)
Messages page post-download includes a shortlist of common AI commands developers can copy and use with their AI coding tool and RelayKit files loaded. Examples: "Review my messages for compliance" (use along the way and before registering), "Write a message that lets us tell users [goal]" (expand messages and stay compliant). These commands use the AI tool + SMS_GUIDELINES.md as the compliance authoring and verification layer. No built-in composer in v1.
_Affects: Messages page (post-download state), SMS_GUIDELINES.md deliverable._

**D-158 — Sandbox compliance analysis and pre-registration review** (Date: 2026-03-18)
Sandbox compliance analysis runs during development — same checks as production but non-blocking. Warnings are clearable by the developer after they've addressed the issue. Pre-registration includes a checklist step where the developer runs an AI-powered review of all their messages (a function built into the RelayKit files) and confirms completion via checkbox before proceeding.
_Affects: Sandbox compliance flow, registration intake wizard, RelayKit deliverable files._

**D-159 — Creative freedom within registered use case** (Date: 2026-03-18)
All three message style variants (Brand-first, Action-first, Context-first) are freely usable post-registration. TCR sample messages demonstrate the range; APPROVED_MESSAGE_TYPES covers the category broadly. Compliance enforcement is structural (app name prefix, opt-out suffix) and categorical (no marketing through transactional, no prohibited content). Developers have full creative freedom within their registered use case category. Small changes, additional messages, and personalization are expected and allowed.
_Affects: Compliance enforcement logic, experience principles copy, registration documentation._

**D-160 — Tool selector collapsed by default on signed-up Messages page** (Date: 2026-03-18)
Tool selector on the signed-up Messages page is kept but collapsed by default under "AI tool setup instructions" header with chevron. Supports re-referencing the command and future tool changes without dominating the page.
_Affects: Messages page (post-download/logged-in state)._

**D-161 — Registration intake live message preview** (Date: 2026-03-18)
Registration intake form includes a live message preview (side by side with form fields) showing how the developer's business name, URL, and service type appear in actual messages. Preview updates as they type. Refines D-156 with specific layout direction.
_Affects: Registration intake wizard UI._

**D-162 — Initial download happens on Messages page, not Overview** (Date: 2026-03-19)
The initial RelayKit download always happens on the public Messages page (`/sms/[category]/messages`). Overview and Settings pages don't exist until after download — they are created as part of the project that gets created at download/signup time. Flow: stranger → Messages page → "Download RelayKit" → auth gate → download → project created → directed to `/apps/[appId]/overview`. The Messages page is both the public marketing page and the conversion/download point. This is the correct flow — the download confirmation should orient users toward their new project's Overview, not keep them on Messages.
_Affects: Messages page states, download confirmation flow, project creation logic, PROTOTYPE_SPEC.md._
**⚠ Updated by D-279:** With SDK as delivery mechanism, the "download" concept changes. The Messages page becomes the message authoring/editing surface. The "download" is now `npm install relaykit` + a sandbox API key shown in the dashboard. SMS_GUIDELINES.md may still be downloadable (D-283) but is secondary to the SDK. The flow becomes: stranger → Messages page → auth gate → sandbox API key issued → `npm install relaykit` → build.

**D-163 — Prototype is the UI source of truth for production** (Date: 2026-03-19)
The prototype at `/prototype` (port 3001) is the authoritative source for all UI decisions. Production code will be ported from prototype screens, not built from PRDs. PRDs are historical context. When porting to production, CC builds from prototype code + PROTOTYPE_SPEC.md + DECISIONS.md. D-104 (PRD update gate) is superseded for screens being ported directly from prototype code.
_Affects: Build process, CC session workflow, all future production builds._

**D-164 — Registration tab confirmed removed — three tabs only** (Date: 2026-03-19)
App layout has exactly three tabs: Overview, Messages, Settings. Registration tab was removed in D-126 but not recorded as a standalone removal decision. Registration content lives on the Overview page — sidebar card during onboarding, celebration CTA after completing steps, lifecycle states for pending/approved/rejected. Formalizes what D-126 established.
_Affects: `prototype/app/apps/[appId]/layout.tsx`._

**D-165 — PROTOTYPE_SPEC.md captures screen-level decisions** (Date: 2026-03-19)
A new file, PROTOTYPE_SPEC.md, documents what each screen looks like, how it behaves, and what data it shows — at a level of detail that lets CC rebuild any screen from the spec alone. Updated as screens stabilize. DECISIONS.md captures what/why; PROTOTYPE_SPEC.md captures what-it-looks-like/how-it-works. CC reads relevant sections before building or modifying screens.
_Affects: CC workflow, all prototype and production builds._

**D-166 — BACKLOG.md captures deferred ideas and Phase 2 features** (Date: 2026-03-19)
A new file, BACKLOG.md, is a parking lot for ideas, deferred work, and future features. Two tiers: "Likely" (will probably happen) and "Maybe" (interesting but unvalidated). Items move to DECISIONS.md when they become real decisions. CC never builds from BACKLOG.md unless Joel explicitly promotes an item.
_Affects: Session workflow, idea capture process._

**D-167 — Messages tab uses h2 section headers throughout** (Date: 2026-03-19)
Section headers on the app Messages tab ("AI prompts", "Personalize", "Sample opt-in form", "Messages") all use `text-lg font-semibold text-text-primary` — the same h2 style used on the Overview page sections. The tab label in the layout shell serves as the page title; there is no separate page-level h1/h2 for "Messages" at the top. This creates visual parity between the Messages tab and Overview tab section anatomy.
_Affects: `prototype/app/apps/[appId]/messages/page.tsx`._

**D-168 — AI prompts cards use italic text, not monospace** (Date: 2026-03-19)
The copyable prompt text on AI command cards is styled `text-sm text-text-tertiary italic` — not monospace. Monospace signals "code to run in a terminal." These prompts are conversational instructions for an AI tool, not shell commands. Italic distinguishes them as quotable language without the terminal connotation. The tool setup panel (per-tool setup commands) retains monospace since those are actual shell/tool commands.
_Affects: `prototype/app/apps/[appId]/messages/page.tsx`._

**D-169 — "Last downloaded" date removed from Messages tab** (Date: 2026-03-19)
The "Last downloaded Mar 15, 2026" note beneath the Re-download button was removed. It added visual noise without actionable value — developers know when they last downloaded; what they need is the button. Removed to keep the header row clean.
_Affects: `prototype/app/apps/[appId]/messages/page.tsx`._

**D-170 — Messages tab registration states: Pending/Changes Requested/Rejected stay identical to Default** (Date: 2026-03-19)
The Pending, Changes Requested, and Rejected registration states render the same content as the Default state on the Messages tab. Registration state doesn't change what messages are available or how the developer interacts with them pre-approval. Only the Approved state will be differentiated (read-only personalization showing registered values per D-159). This is intentional, not an oversight.
_Affects: `prototype/app/apps/[appId]/messages/page.tsx`._

## New This Session

**D-171 — Checkboxes and copy-selected removed from message cards** (Date: 2026-03-19)
Checkboxes are removed from every message card on both the public messages page (`/sms/[category]/messages`) and the post-download Messages tab (`/apps/[appId]/messages`). The "copy selected" dropdown is removed; the copy toolbar now has a single clipboard button that copies all core messages. The opt-in form (`CatalogOptIn`) always lists all message types for the category by default — no selection mechanism. The `selectedIds` prop is removed from `CatalogCard` and `CatalogOptIn`. Opt-in alignment with implemented messages is handled by `SMS_GUIDELINES.md`, not by UI selection. Note: Joel's task specified "D-167" but that number was assigned last session; this is D-171.
_Affects: `prototype/components/catalog/catalog-card.tsx`, `prototype/components/catalog/catalog-opt-in.tsx`, `prototype/app/sms/[category]/messages/page.tsx`, `prototype/app/apps/[appId]/messages/page.tsx`._

**D-172 — Opt-in disclosure copy tightened** (Date: 2026-03-19)
The disclosure paragraph below the consent checkbox is replaced with industry-standard abbreviated copy: "By opting in, you agree to receive automated texts from {app_name}. Consent is not a condition of purchase. Msg frequency varies. Msg & data rates may apply. Text STOP to opt out, HELP for help." Privacy and Terms URLs are rendered as inline links ("Privacy · Terms") appended to the fine print paragraph — not spelled-out full URLs. Duplicate spelled-out URL lines below the fine print are removed. The links use the personalized domain (`{website_url}/privacy`, `{website_url}/terms`). Note: Joel's task specified "D-168" but that number was assigned last session; this is D-172.
_Affects: `prototype/components/catalog/catalog-opt-in.tsx`._

**D-173 — Opt-in form is preview-only with no copy functionality** (Date: 2026-03-20)
The opt-in form (`CatalogOptIn`) is a visual preview only — no copy button, no clipboard icon, no AI prompt nudge footer. The form shows Name, Phone, consent checkbox, disclosure text, Privacy · Terms links, and "Sign up for messages" button as a non-interactive preview. The opt-in language developers need is delivered through `SMS_GUIDELINES.md` in their downloaded RelayKit files, not through copy-paste from the UI. This removes the false expectation that copying opt-in HTML from the preview constitutes compliance.
_Affects: `prototype/components/catalog/catalog-opt-in.tsx`._

**D-174 — "Modify with AI" expander replaces single AI prompt line on message cards** (Date: 2026-03-20)
Each message card's single AI prompt nudge footer is replaced with a collapsible "Modify with AI ›" expander. Collapsed: brand-purple semibold text link with chevron. Expanded: 3 per-message-ID copyable prompts (stacked, `text-text-secondary italic`). Only one card can be expanded at a time — expanding one collapses any other (parent-managed `expandedCardId` state). Copy button per prompt copies the interpolated message text (in quotes) plus the prompt, separated by a blank line — teaching the pattern of pasting context + instruction to an AI tool. Per-prompt tooltip on hover: "Copies message + prompt for your AI tool." Prompts are stored in `catalog-helpers.ts` in `AI_PROMPTS_BY_ID` with per-message-ID entries and a generic fallback.
_Affects: `prototype/components/catalog/catalog-card.tsx`, `prototype/lib/catalog-helpers.ts`, both message page files._

**D-175 — Messages column on left, preview/opt-in on right in two-column layout** (Date: 2026-03-20)
Both the post-download Messages tab and the public messages page (StepsLayout) use a `1fr / 300px` grid with messages on the left (flexible) and preview/opt-in on the right (sticky, 300px). This reverses the previous layout which had personalization on the left. The right column headers ("Preview your messages", "Opt-in form preview") use `text-sm font-semibold` (14px) — visually subordinate to the Messages section headers. The Messages section gets the full-width main column because it's the primary content.
_Affects: `prototype/app/apps/[appId]/messages/page.tsx`, `prototype/app/sms/[category]/messages/page.tsx`._

**D-176 — Contextual status indicator in app layout header** (Date: 2026-03-20)
The app identity row (GlowStudio + Appointments badge) includes a right-aligned contextual status indicator with colored dot + label. States: green "Your app is live" (approved), amber "Registration in review" (pending), red "Changes requested" / "Registration rejected", grey "Sandbox" (default). Visible on all three tabs. State switcher dropdowns remain to the right of the status indicator for prototype use.
_Affects: `prototype/app/apps/[appId]/layout.tsx`._

**D-177 — "AI tool setup" and "Download RelayKit" inline with AI prompts heading** (Date: 2026-03-20)
"AI tool setup" and "Download RelayKit" buttons are right-aligned on the same row as the "AI prompts" h2 heading, separated by a vertical pipe (`|`) in `text-text-quaternary`. Both styled as tertiary text links (`text-sm font-medium text-text-tertiary`). No separate page-level title row — the tab label serves as page identification per D-167.
_Affects: `prototype/app/apps/[appId]/messages/page.tsx`._

**D-178 — Messages section toolbar uses text-labeled buttons** (Date: 2026-03-20)
The Messages section header toolbar buttons include both icon and text label: "Show template" / "Show preview" (with code/eye icon) and "Copy all" (with clipboard icon). Styled `text-sm text-text-tertiary`. No tooltips — labels are self-describing. Applied consistently on both the post-download Messages tab and public messages page.
_Affects: `prototype/app/apps/[appId]/messages/page.tsx`, `prototype/app/sms/[category]/messages/page.tsx`._

**D-179 — Message card variables styled as brand purple, regular weight** (Date: 2026-03-20)
Template variables in message card previews (e.g., business name, website) use `font-normal text-text-brand-secondary` — regular weight, brand purple color. This replaces the previous `font-semibold text-text-primary` styling. Variables are visually distinct from surrounding message text but don't overpower it.
_Affects: `prototype/components/catalog/catalog-card.tsx`._

**D-180 — Pre-download: static "Works with" logo row replaces interactive tool selector** (Date: 2026-03-20)
The interactive tool selector section (heading, subhead, logo row with selection state, per-tool instructions, prompt snippet) is removed from the pre-download public messages page. Replaced with a static "Works with" logo row at the bottom of the grey hero band. Same 6 logos (Claude Code, Cursor, Windsurf, GitHub Copilot, Cline, Other) at smaller size, no selection state, no hover, no interaction. This is a credibility signal, not a tool. **Supersedes D-110 for pre-download state.**
_Affects: `prototype/app/sms/[category]/messages/page.tsx`._

**D-181 — "Just the files" confirmation modal includes interactive tool selector** (Date: 2026-03-20)
The "files-only" confirmation modal (triggered by "Just the files please" in the download modal) is redesigned. New content: download confirmation message at top, interactive tool selector with selection state and per-tool instructions in the middle (same component as used on the logged-in Messages tab), "Create an account later" button and "Close" link at the bottom. Modal widens to `max-w-lg` for this step. This is where detailed per-tool setup instructions now live for the no-account download path.
_Affects: `prototype/app/sms/[category]/messages/page.tsx`._

**D-182 — Post-download AI prompts band on public messages page** (Date: 2026-03-20)
After dismissing the "just the files" confirmation modal (via "Close" or "Create an account later"), the public messages page enters a post-download state (`hasDownloaded` component flag). A new section appears between the hero and the messages content: "AI prompts" h2 header with "AI tool setup | Download RelayKit" brand-colored links on the right, body copy, 4 AI prompt cards (Compliance review, Write a message, Add a message type, Check opt-in copy — same as logged-in Messages tab), and the interactive tool selector with per-tool instructions below. Only the "just the files" path triggers this — the "Create Account & Download" path directs users to their Overview page. **Pre-download state remains the clean marketing page with static logos.**
_Affects: `prototype/app/sms/[category]/messages/page.tsx`._

**D-183 — "Just the files" modal: Done CTA replaces Close/Create account later** (Date: 2026-03-20)
The files-only confirmation modal uses a single "Done" primary CTA button (brand purple, full width) instead of the previous "Create an account later" secondary button + "Close" text link. Below the Done button: "You can find this again under Tool setup" in muted text. **Supersedes the button layout portion of D-181.**
_Affects: `prototype/app/sms/[category]/messages/page.tsx`._

**D-184 — Personalization fields moved to slideout panel on both messages pages** (Date: 2026-03-20)
The three personalization fields (App/business name, Website URL, Service type) are removed from the right column of both the logged-in Messages tab and the public messages page. They now live in a right-side slideout panel triggered by a "Personalize" button in the toolbar row. The slideout slides in from the right with an overlay backdrop, title "Personalize messages", body "See how messages look with your details.", and the three input fields. Values persist to localStorage and update messages + opt-in form live. The right column now contains only the opt-in form preview.
_Affects: `prototype/app/apps/[appId]/messages/page.tsx`, `prototype/app/sms/[category]/messages/page.tsx`._

**D-185 — Consolidated toolbar row below variant pills** (Date: 2026-03-20)
A single toolbar row sits between the variant pills (Brand-first, Action-first, Context-first) and the first message card. Left side: "Personalize" (brand purple semibold, Sliders04 icon). Right side: "Show template"/"Show preview" toggle + "Copy all". "Marketing messages" link (brand purple, ArrowDown icon) sits right-aligned on the pills row, not the toolbar row. "Show template" and "Copy all" are removed from the Messages h2 header area. Applied to both pages.
_Affects: `prototype/app/apps/[appId]/messages/page.tsx`, `prototype/app/sms/[category]/messages/page.tsx`._

**D-186 — Opt-in form header matches Messages h2 as peer-level sections** (Date: 2026-03-20)
The right column header changed from "Opt-in form preview" (`text-sm`) to "Opt-in form" (`text-lg font-semibold text-text-primary`) — same type style as the "Messages" h2 on the left. They read as peer-level section headers.
_Affects: `prototype/app/apps/[appId]/messages/page.tsx`, `prototype/app/sms/[category]/messages/page.tsx`._

**D-187 — Messages default to template view with styled variable pills** (Date: 2026-03-20)
Default view mode is "template" (not "preview"). Template messages use normal font (no monospace) with variable placeholders like `{app_name}` rendered inline in brand purple (`text-text-brand-secondary`). On mount, if localStorage has personalization data, auto-switches to preview mode. **Supersedes the previous default of preview mode.**
_Affects: `prototype/components/catalog/catalog-card.tsx`, `prototype/app/apps/[appId]/messages/page.tsx`, `prototype/app/sms/[category]/messages/page.tsx`._

**D-188 — Show preview with empty personalization opens slideout** (Date: 2026-03-20)
When personalization fields are all empty and the user clicks "Show preview" (global toolbar toggle) or a per-card preview toggle, the personalization slideout opens instead of showing a broken/empty preview. When partially filled, the toggle works normally — filled fields interpolate, empty fields stay as styled variable pills. CatalogCard accepts an `onRequestPersonalize` callback for this behavior.
_Affects: `prototype/components/catalog/catalog-card.tsx`, `prototype/app/apps/[appId]/messages/page.tsx`, `prototype/app/sms/[category]/messages/page.tsx`._

**D-189 — Personalization fields use generic placeholder text and https:// prefix** (Date: 2026-03-20)
Personalization slideout fields use generic placeholders: "Enter business name", "Enter URL", "Enter service type". The Website URL field has a non-editable "https://" prefix inside the field (`text-text-quaternary select-none`), visually part of the input but not editable. Fields start empty — no pre-filled values.
_Affects: `prototype/app/apps/[appId]/messages/page.tsx`, `prototype/app/sms/[category]/messages/page.tsx`._

**D-190 — Opt-in form preview uses generic placeholder text** (Date: 2026-03-20)
The opt-in form preview fields use "Enter name" and "Enter phone" instead of the previous "Alex Rivera" and "(555) 123-4567". These are non-editable display fields.
_Affects: `prototype/components/catalog/catalog-opt-in.tsx`._

**D-191 — Marketing section copy updated** (Date: 2026-03-20)
Marketing section heading changed from "Need promotional messages too?" to "Need marketing messages too?" Body copy changed from "...Get your app live first..." to "...Get your first registration approved, then add marketing from your dashboard."
_Affects: `prototype/app/apps/[appId]/messages/page.tsx`, `prototype/app/sms/[category]/messages/page.tsx`._

**D-192 — "Other" tool logo uses Untitled UI Code02 icon** (Date: 2026-03-20)
The "Other" fallback in the ToolLogo component uses the `Code02` icon from `@untitledui/icons` instead of an inline SVG code brackets icon. Applied to both pages (hero logo row, confirmation modal, post-download band, logged-in tool panel).
_Affects: `prototype/app/apps/[appId]/messages/page.tsx`, `prototype/app/sms/[category]/messages/page.tsx`._

**D-193 — Registration fee split: $49 on submission, $150 on approval** (Date: 2026-03-22)
Registration fee ($199 total) collected in two payments. $49 charged when developer submits registration (covers brand + campaign submission to TCR). $150 charged when carriers approve the campaign. User-facing framing: "$49 to start, $150 when you're cleared to send." Full $49 refund if campaign rejected. Second payment is customer-initiated, not auto-charged.
_Affects: Stripe integration, registration flow UI, pricing display, Settings billing section._
⚠ Superseded by D-320: registration pricing is $49 flat; prior split retired.

**D-194 — Customer-initiated second payment, not auto-charge** (Date: 2026-03-22)
The $150 approval payment is triggered by the developer, not automatically charged to a saved card. Developer receives notification of approval and completes payment themselves. Rationale: matches transparency positioning, avoids negative emotional sequence of charge before excitement lands, developers are allergic to feeling enrolled.
_Affects: Stripe integration, approval notification flow, dashboard payment UI._

**D-195 — Business entity change: RelayKit LLC** (Date: 2026-03-22)
Vaulted Press LLC is being replaced with a new LLC under the RelayKit name. Filed with SC Secretary of State. Twilio ISV account will need updating once complete.
_Affects: Twilio ISV account, Stripe account, compliance site footer, legal references._

**D-196 — Beta pricing: $49 flat, no second payment** (Date: 2026-03-22)
Beta users pay $49 total for registration (no $150 on approval). Framed as early access pricing. Beta users keep their registration at full pricing launch. Cap at 25–50 slots to create natural urgency and clean cutover.
_Affects: Stripe integration, registration flow, marketing copy._
⚠ Superseded by D-320: $49 flat is now baseline, no longer a beta-only price.

**D-197 — Beta access requires prototype user testing** (Date: 2026-03-22)
Developers earn beta access ($49 pricing) by completing a user test session on the prototype. Mix of unmoderated (majority, ~3:1 ratio) and moderated sessions. Target 8–12 total sessions. Recruitment: Reddit, HN, AI tool Discords, Indie Hackers, Twitter/X.
_Affects: Beta recruitment strategy, prototype publishing timeline._

**D-198 — Production build strategy: keep infrastructure, rebuild application layer from new PRDs** (Date: 2026-03-22)
Prototype decisions (D-84 through D-192+) changed the product enough that existing PRDs no longer describe what's being built. Infrastructure modules preserved without new PRDs: Twilio/Sinch pipeline (PRD_04), template engine (PRD_02), compliance site generator (PRD_03), database schema, Stripe webhooks. Application layer gets all-new PRDs written from prototype: Overview, Messages, Settings, Registration form, Intake wizard (dashboard path), Public messages page. Sequence: finish prototype → write PRDs one at a time → build from each immediately. D-104 gate clears naturally as new PRDs replace old ones.
_Affects: All production build planning, PRD lifecycle, D-104 gate resolution._

**D-199 — Sinch carrier layer evaluation (PENDING — do not build)** (Date: 2026-03-22)
Evaluating Sinch to replace Twilio as carrier for production SMS and 10DLC registration. Key advantage: standard use case campaigns auto-approved for qualified brands (3–5 days vs. Twilio's 10–15 business day queue). Three questions pending: ISV/reseller support via Registration API, real-world approval timeline, account tier requirements. If confirmed, migration is contained to PRD_04's six API modules. Template engine, compliance site, dashboard, all UI unaffected. DO NOT build anything against Sinch until this decision is confirmed.
_Affects: PRD_04, carrier integration, registration timeline promises (may supersede D-17 if confirmed)._
⚠ Orphaned by D-358: /src sunset.
⚠ Also resolved by D-215 (Sinch confirmed).

**D-200 — Self-guided usability test instrument in prototype** (Date: 2026-03-22)
Build a /test route in the prototype with lightweight instrumentation layer: task prompts, confidence checks (1–5 scale), page visit logging, completion tracking, debrief survey. Four test tasks: Discovery, Acquisition, Orientation, Activation. Results stored in Supabase or Google Sheet webhook. Run alongside 3–4 live Zoom calls. Prototype screens stay untouched — test wrapper provides instrumentation overlay. State switchers become testing assets for routing testers to specific lifecycle states.
_Affects: Prototype route structure, beta recruitment workflow._

**D-201 — SMS compliance alerts off by default, SMS is opt-in escalation** (Date: 2026-03-22)
SMS compliance alerts toggle is off by default on the Settings page. Email alerts are always on and cannot be disabled — they are the baseline notification channel. SMS is an opt-in escalation for developers who want faster notification. When enabled, shows the alert destination phone with an Edit link.
_Affects: Settings page, notification preferences, future notification infrastructure._
⚠ Superseded by D-364: feature deferred pending evidence of need.

**D-202 — Changes Requested renamed to Extended Review (user-facing label only)** (Date: 2026-03-22)
The user-facing label for the `changes_requested` registration state is "Extended review" — not "Changes requested." The internal `registrationState` value remains `changes_requested` in session context and all code. Rationale: "Changes requested" implies the developer did something wrong and must act. "Extended review" frames it as a normal part of the carrier process where RelayKit handles everything. Indicator dot changed from red to amber to match this reframing. Consistent with D-144's principle that resubmission uses brand/neutral colors, not error colors.
_Affects: `prototype/app/apps/[appId]/layout.tsx`, Settings page, Overview page (future copy alignment)._

**D-203 — Developer tools removed from Settings — moves to Messages tab** (Date: 2026-03-22)
The "Developer tools" section (sandbox phone number, "Send test message" action) is removed from the Settings page. These will move to the Messages tab in a future session where they are contextually relevant alongside the message catalog and AI prompts.
_Affects: Settings page, Messages tab (future)._

**D-204 — Portability removed from Settings — backlogged** (Date: 2026-03-22)
The "Moving on?" portability section (phone number transfer, registration data export) is removed from the Settings page. It will be added back if needed based on user feedback post-beta. Currently backlogged.
_Affects: Settings page, BACKLOG.md._

**D-205 — Live API key shown once, masked on Settings, regenerate as recovery path** (Date: 2026-03-22)
Live API keys are shown once at generation time, then masked on the Settings page as `rk_live_••••••••••••••••••••`. Copy button is present but visually disabled (reduced opacity, no hover, no click action) when key is masked — it activates only during the brief window after regeneration when the new key is visible. The "Regenerate" link is the recovery path: confirmation modal warns that the old key is immediately invalidated and the new key will be shown once. This matches standard API key security practices.
_Affects: Settings page, API key generation flow (future Stripe/production integration)._

**D-206 — Rejection state shows carrier-reason debrief with actionable fix** (Date: 2026-03-22)
The Rejected state on the Settings Registration section includes a "What was submitted" subsection (business name, EIN masked to last 4 digits, business address, use case — all read-only) followed by a debrief box (`bg-bg-error-primary`, rounded, padded) with "What happened" heading and plain-language explanation of what the carrier flagged, with an actionable fix. The submission data gives the developer context for understanding the rejection. This is the fixable rejection variant. An opaque/unfixable variant will be added later. Consistent with D-21 (rejection as debrief, not error) and Experience Principles (debrief, not failure notice).
_Affects: Settings page._

**D-207 — Phone labels disambiguated: Personal phone, Your SMS number, Sandbox phone** (Date: 2026-03-22)
Three distinct phone labels used across the product: "Personal phone" (developer's own number, used in Account info and alert destination), "Your SMS number" (dedicated campaign number, Approved Registration section), "Sandbox phone" (does not appear on Settings — Messages tab concept). Never use bare "Phone" as a label.
_Affects: Settings page, all pages displaying phone numbers._

**D-208 — Billing reflects D-193 split: $49 paid at submission, shown in Pending state** (Date: 2026-03-22)
The Billing section in Pending and Extended Review states shows "Registration fee: $49 paid" with the submission date. This reflects the D-193 fee split ($49 on submission, $150 on approval). In Rejected state, billing shows "$49 refunded" with the review date. Approved state shows the monthly plan rate only — the $150 approval payment is captured elsewhere in the approval flow.
_Affects: Settings page billing section._

**D-209 — Business name read-only after registration submission** (Date: 2026-03-22)
Business name becomes read-only on the Settings page from the moment registration is submitted (Pending state onward). Displayed with muted sub-text "Set during registration." No Edit link. This is because business_name is immutable after TCR submission (per D-102) — it's used in canon messages, compliance site, and carrier records.
_Affects: Settings page Account info section._

**D-210 — Account info fields vary by state: email+phone in Default, adds business name+category from Pending onward** (Date: 2026-03-22)
In Default state, Account info shows only Email (editable) and Personal phone (editable). From Pending onward, Business name (read-only) and Category (read-only) are added. This progressive disclosure matches the product reality: business name and category don't exist until registration is submitted.
_Affects: Settings page Account info section._

**D-211 — Sandbox API key has no regenerate — low-security, always visible and copyable** (Date: 2026-03-23)
Sandbox API keys do not have a Regenerate link on the Settings page. They are low-security (limited to verified phone, 100 messages/day) and always displayed in full with a copy button. This differs from live keys which have Regenerate as a recovery path. If sandbox key rotation is needed in production, it can be added later — for now, simplicity wins.
_Affects: Settings page API keys section._

**D-212 — Plan row removed from Registration section — pricing lives in Billing only** (Date: 2026-03-23)
The "Plan → $19/mo" row was removed from the Approved Registration section. Plan and pricing information lives exclusively in the Billing section to avoid duplication. Registration section shows only registration-specific data: status, SMS number, approval date, campaign ID.
_Affects: Settings page Registration section (Approved state)._

**D-213 — Billing Approved state shows Includes row with message volume details** (Date: 2026-03-23)
The Approved Billing section includes an "Includes" row between Plan and Next billing: "500 messages, then $15 per additional 1,000." This gives developers clear visibility into their usage economics without navigating to a separate billing page.
_Affects: Settings page Billing section (Approved state)._

**D-214 — Rejected state includes "What was submitted" section above debrief** (Date: 2026-03-23)
The Rejected Registration section shows a "What was submitted" subsection above the debrief box: Business name, EIN (masked — last 4 digits only, e.g., "••-•••4567"), Business address, and Use case. All read-only display fields. This gives the developer context for understanding the rejection reason directly below it. Fields may expand based on carrier error code mapping in the future (backlogged).
_Affects: Settings page Registration section (Rejected state)._

**D-215 — Sinch confirmed as carrier — approval timeline drops to days** (Date: 2026-03-23)
Sinch replaces Twilio as the carrier for 10DLC registration and SMS delivery. Standard use case campaigns are auto-approved for qualified brands in 3–5 days (vs. Twilio's 10–15 business day queue). All user-facing timeline references updated from "2–3 weeks" to "a few days" / "days, not weeks." **Supersedes D-17 and D-199.** Migration is contained to PRD_04's carrier API modules. Template engine, compliance site, dashboard, all UI unaffected.
_Affects: All user-facing timeline copy, PRD_04 carrier integration, registration flow expectations._

**D-216 — Registration fee display: $199 headline with $49/$150 split in details** (Date: 2026-03-23)
Pricing cards and user-facing copy show `$199 to register + $19/mo` as the headline price. The $49/$150 split (D-193) is explained in a feature bullet: "$49 to register. $150 only after you're approved. Full refund if not." This keeps the headline scannable while the bullet handles the nuance. **Extends D-193 with display guidance.**
_Affects: Home page pricing cards, How it works modal, marketing copy._
⚠ Superseded by D-320: no split pricing; $49 flat displayed as a single fee.

**D-217 — Playbook summary section on Messages pages** (Date: 2026-03-23)
Both the public Messages page and logged-in app Messages page include a "playbook summary" section showing the complete SMS system flow for the category. Appointments example: "Booking confirmed → Reminder sent → No response followed up → No-show rebooked → Cancellation handled." Flow labels describe system behavior, not message card titles. Horizontal on desktop (hollow circles, arrows, filled end dot), vertical stepper on mobile. Data keyed by category slug for easy extension. On the public page, sits between gray hero band (bg-bg-tertiary) and messages section with its own bg-bg-secondary band. On the app page, sits in a full-width gray band below the tab bar.
_Affects: `prototype/app/sms/[category]/messages/page.tsx`, `prototype/app/apps/[appId]/messages/page.tsx`._
**⚠ Updated by D-279:** Playbook summary remains but its role shifts. It describes the messaging system for the developer's use case (which messages, when they fire, what data they need) rather than being a gateway to file downloads. It's the "what you're building" context, not the "what you're downloading" context.

**D-218 — "How it works" full-page modal on public Messages page** (Date: 2026-03-23)
A "How it works" link (Expand06 icon, brand purple semibold) in the hero area opens a full-page modal overlay. Modal contains: H1 heading, subhead, "What you get" 4-card grid, pricing section (full-width gray band with Free + Go live cards), and "Why registration matters" FAQ. URL does not change. V1 renders summary content; V2 could render the full marketing category page. Modal has sticky close button and "Back to messages" CTA at bottom.
_Affects: `prototype/app/sms/[category]/messages/page.tsx`._

**D-219 — Home page hero redesign: logo farm + gray band** (Date: 2026-03-23)
Home page hero section wrapped in bg-bg-tertiary gray band. AI tool logo row (Claude Code, Cursor, Windsurf, GitHub Copilot, Cline, Other) added between subhead and CTA buttons. Logo circles have white background. "Why RelayKit?" button has white background to not blend with gray band. Subhead changed to "Two files. Your AI coding tool. A working SMS feature."
_Affects: `prototype/app/page.tsx`._

**D-220 — Pricing cards renamed: Free + Go live** (Date: 2026-03-23)
Home page pricing cards renamed from "Sandbox"/"Live" to "Free"/"Go live". Per-card CTA buttons removed; single centered "Start building free →" CTA below both cards. Feature line text bumped to text-base (16px) for scannability. Go live card uses D-216 pricing display. Free card feature list includes all 6 supported AI tools.
_Affects: `prototype/app/page.tsx`, How it works modal._

**D-221 — App layout full-width tab bar and gray playbook band** (Date: 2026-03-23)
App layout restructured: outer wrapper no longer constrains width. Tab bar border runs full page width edge to edge (tabs stay in max-w-5xl). On the Messages tab, playbook gray band extends full viewport width using CSS viewport trick. No gap between tab bar border and gray band. Content remains within max-w-5xl px-6 container throughout.
_Affects: `prototype/app/apps/[appId]/layout.tsx`, `prototype/app/apps/[appId]/messages/page.tsx`._

**D-222 — AI prompts section replaced by playbook summary on app Messages page** (Date: 2026-03-23)
The four AI prompt cards (Compliance review, Write a message, Add a message type, Check opt-in copy) are removed from the logged-in Messages tab. Replaced by the same PlaybookSummary component used on the public page. "AI tool setup" and "Download RelayKit" controls retained, positioned on their own right-aligned line between the heading and flow visualization via a controlsSlot prop. AiCommandsGrid component is now unused on this page.
_Affects: `prototype/app/apps/[appId]/messages/page.tsx`._

**D-223 — Appointment messages expanded to 6 base messages in chronological order** (Date: 2026-03-24)
The appointments category now includes 6 non-expansion messages (up from 4): Booking confirmation, Appointment reminder, Pre-visit instructions, Reschedule notice, No-show follow-up, Cancellation notice. Ordered chronologically through an appointment lifecycle. No-show follow-up and Pre-visit instructions added as `also_covered` tier. Each card displays a numbered index (1–6) in brand purple to the left of the card title.
_Affects: `prototype/data/messages.ts`, `prototype/components/catalog/catalog-card.tsx`, both Messages pages._

**D-224 — Flow diagram: 6 numbered nodes, all filled purple, with CSS tooltips** (Date: 2026-03-24)
Playbook flow diagrams on both Messages pages now show 6 numbered nodes matching the 6 message cards. All circles are 24px filled purple with white numbers (no hollow variant). Labels are left-aligned with max-width ~90px for natural wrapping. Native title attributes replaced with React hover-state CSS tooltips (white bg, shadow, 12px text, positioned above circle). Tooltips describe when each message is sent.
_Affects: `prototype/app/apps/[appId]/messages/page.tsx`, `prototype/app/sms/[category]/messages/page.tsx`._

**D-225 — Production intake wizard imported to prototype as registration components** (Date: 2026-03-24)
Three production intake wizard screens imported to prototype with all field logic, Zod validation, industry gating, and conditional states preserved. Untitled UI base components replaced with plain HTML + Tailwind. Supabase/Stripe removed (mock data, console.log). Components: RegistrationScope (scope advisory), BusinessDetailsForm (full business details form), ReviewConfirm (review & confirm with pricing modal). Supporting libs copied to `prototype/lib/intake/`. Test route at `/registration-test`.
_Affects: `prototype/components/catalog/registration-scope.tsx`, `prototype/components/registration/`, `prototype/lib/intake/`, `prototype/app/registration-test/`._

**D-226 — Dev bypass route for production intake wizard** (Date: 2026-03-24)
Middleware matcher updated to exclude `/dev/*` routes from Supabase session checks. Dev route at `/dev/intake` provides a hub page with sessionStorage seeding and direct links to all 4 wizard screens for visual review without auth.
_Affects: `src/middleware.ts`, `src/app/dev/intake/page.tsx`._

**D-227 — Public Messages page logo circles have white backgrounds** (Date: 2026-03-24)
Hero logo row circles on `/sms/[category]/messages` now have explicit `bg-white` to ensure visibility against the gray hero band.
_Affects: `prototype/app/sms/[category]/messages/page.tsx`._

**D-228 — Flow diagram strategy per category** (Date: 2026-03-24)
Diagrams (numbered nodes matching message cards) for: appointments (linear, done), orders (linear with branch tags), support (linear with branch tags), waitlist (compact 4-node linear). Sentence-only treatment (heading + message count + tagline, no diagram) for: verification, marketing, team alerts, community.
_Affects: `prototype/app/sms/[category]/messages/page.tsx`, `prototype/app/apps/[appId]/messages/page.tsx`, `prototype/data/messages.ts`._

**D-229 — Orders flow diagram shape** (Date: 2026-03-24)
Linear spine: Order placed → Confirmed → Shipped → Delivered → Return processed. Branch tags under "Shipped" node for "delay notified" and "pickup ready." Validates hub-and-spoke pattern before building remaining categories.
_Affects: Flow diagram data, Messages pages._

**D-230 — RegistrationScope on category landing pages** (Date: 2026-03-24)
The RegistrationScope content from the imported production intake wizard renders on public category landing pages as informational content, NOT as a registration wizard step. No expansion checkboxes — display-only mode. Placed between "Everything you need to start sending" and the "Preview the full message library" CTA band.
_Affects: `prototype/app/sms/[category]/page.tsx`._

**D-231 — RegistrationScope renders as two sections, not three** (Date: 2026-03-24)
On category landing pages, the three production RegistrationScope cards (covers / not included / expansions) collapse into two display sections: (1) "What your registration covers" with green check items as-is, and (2) "Need marketing messages too?" which replaces both "What's not included" and the expansion checkboxes. The marketing section shows a brief explanation that promos require a separate registration plus two example message cards (promotional offer, feedback request). No red X items, no checkboxes. Framing: "Get your first registration approved, then add marketing when you're ready." The negative "not included" framing is eliminated from all marketing-context pages.
_Affects: `prototype/app/sms/[category]/page.tsx`._

**D-232 — Twilio-only registration service rejected** (Date: 2026-03-24)
Decided not to build a standalone Twilio registration product. Intake wizard components remain for ISV registration flow only. RelayKit's value is the full stack (registration + proxy + compliance monitoring), not registration as an isolated service.
_Affects: Product strategy, no code changes._
⚠ Orphaned by D-358: /src sunset.

**D-233 — Overview page restructure — sandbox build dashboard** (Date: 2026-03-24)
Remove "Register your app" and "Monitor your compliance" expanders from the Overview page left column. Replace with a sandbox compliance card above the Build steps (visible once developer has sent at least one message). Card shows: messages sent count, compliance rate (green/amber/red), active issues with Fix/View links opening the existing compliance detail modal. Registration sidebar (right column) handles registration pitch. Build steps expander collapses to a single completed row once all 4 steps are done (follow-up task). Post-registration Approved state changes from 6 cards (3×2) to a full-width message types table plus 3 cards below (follow-up task). MESSAGE TYPES and SENDING PATTERNS cards replaced by the table.
_Affects: `prototype/app/apps/[appId]/overview/page.tsx`, `prototype/app/apps/[appId]/overview/approved-dashboard.tsx`._
⚠ Superseded by D-244.

**D-234 — Admin dashboard in prototype** (Date: 2026-03-25)
Operator/admin dashboard at `/admin` route with its own layout, separate from customer-facing app. Same design system (Tailwind, Untitled UI patterns) but distinct nav and context. Five screens: Control room (home), Registration pipeline, Customer list, Customer detail, Revenue/metrics. Built with mock data in prototype, same as all other prototype screens. This is the operational backend for RelayKit as a business — not customer-facing.
_Affects: `prototype/app/admin/`._

**D-235 — Manual registration review mode** (Date: 2026-03-25)
Admin toggle (system-wide, not per-customer) that controls whether registration submissions auto-submit to carrier or queue for manual operator review. Default at launch: manual. Operator sees the full generated campaign package (brand details, campaign description, 5 sample messages, compliance site URL) and can edit any field before submitting. Toggle lives in admin Control Room or a system settings area. When set to auto, submissions go directly to carrier API. When set to manual, they queue in the Registration Pipeline screen with "Review & Submit" action. Edge cases (industry gating triggers, unusual use cases) should always queue for manual review regardless of toggle state.
_Affects: Admin Control Room, Registration Pipeline screen, carrier submission flow._

**D-236 — AI compliance layer — novel message detection and registration pre-review** (Date: 2026-03-25)
Two modes:

MODE 1 — Registration pre-review (before operator queue): When a registration package is generated by the template engine, AI reviews AND fixes before it enters the manual review queue (D-235). AI autonomously fixes: vague campaign descriptions (rewrites using structured intake data), missing opt-out language in samples, incomplete message type coverage in descriptions. AI validates against external sources: business name against state registries, website exists and matches stated business, address is real (USPS validation), phone is valid US number, website content consistent with campaign description, no gated-industry signals missed by intake. AI surfaces to operator: validation failures it can't resolve, mismatches between website and stated use case, new businesses with minimal web presence, any flag requiring human judgment. By the time a registration reaches the operator queue, AI has already done everything a diligent reviewer would do. Operator reviews AI's work, not raw submissions.

MODE 2 — Novel message detection (live traffic): The deterministic compliance proxy (PRD_09) classifies every outbound message against the customer's registered template set by structural similarity. Messages matching known templates pass through with no additional check. Messages that do NOT match any known template are routed to AI evaluation. Three outcomes: (1) Within scope — delivers, template shape added to known set. (2) Borderline — delivers, flags in operator queue. (3) Out of scope — queued with "compliance review" API response, operator notified. AI cost scales with novelty, not volume.

Deterministic proxy remains the real-time gatekeeper for all objective checks (opt-out language, message type registration, opt-out list, rate limits). AI handles judgment calls that deterministic rules can't.
_Affects: PRD_09 compliance proxy architecture, admin registration pipeline, template engine output, admin attention queue, API response codes._

**D-237 — Three-layer automated compliance enforcement model** (Date: 2026-03-25)
Layer 1 (Proxy fixes): Mechanical issues (missing opt-out suffix, URL shorteners) fixed silently at proxy, indefinitely, no customer notification needed. AI-fixable issues (promotional language in transactional message, borderline content) rewritten at proxy with customer notified once via SMS (if compliance alerts enabled in Settings) + email showing original vs rewrite and what to update in their code. No deadline on rewrites — proxy override runs indefinitely at no meaningful cost.
Layer 2 (Customer informed): Periodic email digest reminds customer of active rewrites: "RelayKit is still rewriting N of your messages. Here's what to update when you get a chance." SMS compliance alerts are the primary real-time notification channel. Digest is the passive channel for non-urgent accumulated items.
Layer 3 (Disengaged customer backstop): Only activates when customer has SMS alerts off AND ignores emails AND same problematic pattern persists for extended period. Escalation sequence: final warning email with specific deadline → block the specific message type (other types unaffected) → suspend all sending (only for systemic/egregious patterns or external carrier flags). This layer almost never fires for good-faith customers. It protects the platform from customers who opted out of every lifeline offered to them.
_Affects: PRD_09 compliance proxy, PRD_08 compliance monitoring, admin Control Room, customer Settings, email notifications._
⚠ Superseded by D-293: runtime enforcement removed; authoring-time model.

**D-238 — Control Room attention queue — inline expansion with enforcement state** (Date: 2026-03-25)
Each queue item expands in place to show: flagged message content, recipient (masked), timestamp, what the compliance filter detected, current enforcement layer and state, time remaining until auto-escalation (Layer 3 only), and operator override buttons (Dismiss, Escalate, Suspend). No navigation to Customer Detail for daily resolution workflow — everything happens inline. Customer Detail remains for deep-dive context when needed (e.g., customer emails you).
_Affects: Admin Control Room page, attention queue component._

**D-239 — Compliance alerts toggle surfaced on Overview page** (Date: 2026-03-25)
After phone verification step during onboarding, prompt customer to enable SMS compliance alerts to their verified number. Also visible on post-approval compliance card as status line: "Compliance alerts: On — (555) 123-4567" or amber nudge if off. Settings remains the canonical home for the toggle, but Overview surfaces it at strategic moments. Default: on. Framing: "This is how RelayKit tells you when it caught something for you" — not "enable notifications."
_Affects: Overview page (compliance card, onboarding steps), Settings page, customer notifications._
⚠ Superseded by D-364: feature deferred pending evidence of need.

**D-240 — Dashboard message editor for flagged messages only** (Date: 2026-03-25)
When the proxy rewrites a flagged message (D-237 Layer 1), the customer's dashboard shows the original message, the AI rewrite that's currently active, and an editable text field where the customer can write their own replacement. Customer can: accept the AI rewrite (already running), write their own custom replacement (proxy swaps it in), or dismiss and update their code instead. Editor ONLY surfaces for messages the proxy has flagged — it is a repair tool, not a message authoring tool. The customer's app still controls all sending logic (when, who, triggers, variables). RelayKit only substitutes the string content at the proxy layer. This eliminates the code-redeploy friction for simple text fixes. Important boundary: do NOT surface an editor for all messages — that creates two sources of truth and slides toward message management platform territory.
_Affects: Customer dashboard (Messages tab or new Compliance section), PRD_09 proxy override mechanism, message data model._

**D-241 — Compliance protection copy touchpoints across customer journey** (Date: 2026-03-25)
Three strategic placement moments, all using Experience Principles tone:
1. Marketing pages (Category Landing "What You Get" section): One line — "Every message is checked before it reaches the carrier. If something looks off, RelayKit fixes it automatically and lets you know." Home page Go Live pricing card: add "Automated message protection" bullet.
2. Onboarding (Overview page pre-registration): Registration sidebar adds one line — "After approval, every message runs through RelayKit's compliance layer — issues are caught before carriers see them."
3. Post-approval (Messages tab Approved state): Below registered message types, concrete marketing examples showing what needs separate registration: "'Get 20% off your next visit!' or 'We miss you — book today for a free add-on' are marketing messages and need their own registration. Your current registration covers [appointment reminders, confirmations, etc.] only."
No enforcement ladder detail is ever exposed to the customer. Framing is always "RelayKit protects your messages" never compliance enforcement language.
_Affects: Category landing pages, home page pricing card, Overview page sidebar, Messages tab Approved state._

**D-242 — AI-driven compliance enforcement — revised model (supersedes operator-centric parts of D-237)** (Date: 2026-03-25)
Three severity tiers, all AI-classified, all automated. Operator queue is a monitoring feed, not a task list.
**Minor:** AI spots fixable issue. Proxy rewrites automatically. Customer gets informational notification: what was wrong, what we changed, where to fix it permanently (Overview editor or code). "No rush." Never appears in operator queue.
**Escalated:** AI judges message harmful enough that proxy fix shouldn't run indefinitely. Proxy rewrites AND customer gets notification with 30-day deadline. Sequence: initial alert → reminder at day 20 → final notice at day 27 → specific message type suspended at day 30. Only that message type is suspended, never all sending. Appears in operator queue for visibility but fires automatically.
**Suspended:** AI judges message dangerous enough to block immediately. Message does not send. Customer notified: what was blocked, why, how to fix it (Overview editor or code). No time limit on the fix — their other message types keep working. Appears in operator queue for visibility but fires automatically.
Operator can override any tier: dismiss, change severity, unsuspend. But default is fully automated.
Tone at every step: "We caught this, we handled it, here's how to fix it." Knowledgeable colleague, not compliance cop. Liberal timeframes — risk is on customer's reputation with their own users, not on RelayKit's carrier score.
_Affects: Admin Control Room, compliance proxy (PRD_09), customer notifications, Overview page editor (D-240), supersedes operator-centric parts of D-237._
⚠ Superseded by D-293: compliance enforcement moved to authoring time on the website. Runtime three-tier enforcement removed. Tone principle preserved.

**D-243 — Overview compliance attention section — customer-facing ledger** (Date: 2026-03-26)
The Overview page (post-approval and sandbox) includes a compliance attention section showing ALL messages the system has adjusted or blocked — minor, escalated, and suspended. This is the customer's ledger of what needs fixing.
Each item shows: message type, original message, what was changed (or that it was blocked), and a brief explanation tied to carrier rules (never RelayKit's opinion). Examples: "Carriers require opt-out language in every message", "Carrier filters flag promotional language in transactional campaigns", "This content type isn't permitted under your registered campaign." Explanations are one sentence, max two. Not grammar policing — carrier compliance.
Customer actions per item: (1) Edit message — opens D-240 inline editor, fix it right here. (2) "Fixed in code" — dismiss from ledger, flag clears when proxy confirms next clean message; if code still sends bad message, item reappears as new occurrence. (3) No action needed for minor items — proxy handles it, item stays in ledger for visibility but no urgency.
Visual treatment: Minor = neutral styling, no countdown, no warning colors, present but not alarming. Escalated = amber accent, countdown visible ("Update by [date] or this message will stop sending"). Suspended = red accent, "Blocked — edit to resume sending."
Sandbox behavior: same UI pattern, advisory framing. "If this were live, carriers would [consequence]. Fix it now so you're clean at launch." Nothing actually blocked in sandbox — all items are educational.
The attention section only shows messages that need action or acknowledgment. Clean messages don't appear. Dismissed items don't reappear unless the same issue recurs from code.
Harmony with admin: same underlying compliance record. What the operator sees in Control Room, the customer sees here with customer-appropriate framing and editing controls instead of operator overrides.
_Affects: Overview page (post-approval + sandbox), D-240 inline editor, compliance data model, Control Room (shared records)._
⚠ Superseded by D-293: runtime enforcement removed; authoring-time model.

**D-244 — Approved dashboard layout supersedes D-233** (Date: 2026-03-26)
The Approved Overview uses a 3-metric row (Delivery, Recipients, Usage & Billing) followed by a compliance attention section with per-message cards. This replaces the D-233 spec (message types table + 3 summary cards). The metric row + attention section layout is the canonical spec.
_Affects: Overview page (Approved state), D-233 (superseded)._
⚠ Superseded by D-293: runtime enforcement removed; authoring-time model.

**D-245 — Marketing expansion is always a second MARKETING campaign, never MIXED** (Date: 2026-03-27)
Marketing capability is added post-registration by registering a second MARKETING campaign on the existing subaccount. Initial registration is always the narrow transactional type for the category (e.g., CUSTOMER_CARE for appointments). The MIXED campaign type is never used — not at intake, not as an expansion. Mixed Campaign Addendum A2 (MIXED registration option at intake) is superseded by the Vision Implementation Memo direction. The proxy routes messages to the correct campaign transparently. Supersedes: Addendum A2.
_Affects: Intake wizard, registration pipeline, pricing tiers, proxy routing, V4 Addendum A2 (superseded)._

**D-246 — Marketing campaign pricing** (Date: 2026-03-27)
Second campaign registration fee: $29 flat (no go-live fee — brand already verified). Monthly: $10/mo for 250 marketing messages (separate pool from transactional). Overage pricing same rate as transactional. Total with marketing: $29/mo (base $19 + $10 marketing add-on).
_Affects: Pricing, Stripe checkout, billing dashboard, marketing registration flow._

**D-247 — Marketing campaign UI gated on EIN** (Date: 2026-03-27)
All marketing campaign UI (Overview banner, Messages section, info page) hidden for non-EIN users. Sole proprietor registrations are limited to one campaign. No marketing expansion path shown if no EIN on file.
_Affects: Overview page (marketing upsell), Messages tab, registration pipeline, customer data model._

**D-248 — Marketing consent handled by RelayKit infrastructure** (Date: 2026-03-27)
Marketing requires separate express written consent (TCPA/FCC). RelayKit handles this at the infrastructure level: compliance site opt-in form, deliverable files, and SMS_GUIDELINES.md all include marketing consent language and form markup, gated behind campaign scope. Developer does not write consent language or design consent forms.
_Affects: Compliance site generator (PRD_03), deliverable generator (PRD_05), SMS_GUIDELINES.md, template engine._

**D-249 — Marketing campaign unlocks existing content, no file swap** (Date: 2026-03-27)
When marketing campaign is approved, RelayKit expands the developer's campaign scope. Compliance site updates automatically (marketing consent checkbox activates). Deliverable files already contain marketing content gated behind scope — approval unlocks it. No new files to download, no repo changes needed. Developer's AI tool reads scope from config/API key and sees marketing is available. Same pattern as Tier 3 message unlocking.
_Affects: Compliance site generator, deliverable generator, API key scope, developer experience._

**D-250 — Marketing consent flag required on API calls** (Date: 2026-03-27)
Proxy requires marketing_consent: true flag on every marketing message API call. No flag = blocked. Developer's app tracks which recipients opted in to marketing via the RelayKit-generated consent form. RelayKit controls consent collection (form), developer controls consent state per recipient (their database), proxy enforces at send time.
_Affects: Messaging proxy (PRD_09), API schema, SMS_GUIDELINES.md, deliverable files._

**D-251 — Marketing expansion is second MARKETING campaign, never MIXED (reinforces D-245)** (Date: 2026-03-27)
Initial registration always narrow transactional type. Marketing added as second MARKETING campaign on same subaccount. Proxy routes messages to correct campaign transparently. Developer never sees two campaigns — RelayKit abstracts it completely.
_Affects: Registration pipeline, proxy routing, dashboard abstraction, D-245 (reinforced)._

**D-252 — Dual consent storage via consent API** (Date: 2026-03-27)
Developer's app collects consent using RelayKit-provided language and their own UI design. On consent collection, developer's app calls RelayKit consent API (POST /v1/consent) with recipient phone number and consent type (transactional/marketing). Both sides store the record — developer's database for app logic, RelayKit's database for proxy enforcement. Proxy checks RelayKit's consent ledger before delivering marketing messages. Opt-outs (STOP replies) already flow through RelayKit; consent API extends the same pattern to opt-ins. Supersedes the "developer-only storage" model in PRD_03. Consent API is a production infrastructure requirement, not a prototype item.
_Affects: Messaging proxy (PRD_09), API schema, consent data model, SMS_GUIDELINES.md, deliverable files, PRD_03 (superseded on consent storage)._

**D-253 — Consent API is V1 launch requirement** (Date: 2026-03-27)
The consent API (POST /v1/consent, DELETE /v1/consent) ships at launch, not as a post-launch addition. Proxy enforcement depends on it — marketing messages are blocked unless RelayKit's consent ledger shows marketing opt-in for that recipient. This is core infrastructure, not a nice-to-have. Builds on D-252.
_Affects: V1 launch scope, API infrastructure, messaging proxy, D-252 (dependency)._

**D-254 — Customer-facing vocabulary: "marketing messages", never "campaign" or "promotional"** (Date: 2026-03-27)
Customer-facing copy uses "marketing messages" and "marketing registration" (when referring to the carrier process). Never use "campaign" — it's carrier jargon that RelayKit abstracts away. Never use "promotional" or "promos" — dated language. Message type labels use descriptive names: "Discount offer", "Re-engagement", "Birthday message", "Review request". Internal docs and carrier-facing artifacts can still use "campaign" and "promotional" where technically required.
_Affects: All customer-facing copy, Experience Principles vocabulary table, message type labels, dashboard UI, marketing pages._

Append the following decisions to DECISIONS.md:

**D-255 — RelayKit provides full consent audit logging**
The consent API (D-252, D-253) stores legally defensible consent records: phone number, consent type (transactional/marketing), timestamp, consent language version shown, and collection method. Records retained for 4 years (TCPA requirement). Developer's only responsibility is calling POST /v1/consent when someone opts in — RelayKit handles storage, audit trail, and retention. Applies to both transactional and marketing consent. Eliminates consent record infrastructure as a developer responsibility. The compliance site opt-in form also feeds the same consent API.

**D-256 — Opt-in form built natively by developer's AI tool from RelayKit spec**
No embeds, no iframes. RelayKit's deliverable files include the complete opt-in form specification: TCPA-compliant consent language, form structure, required fields, and the POST /v1/consent API call. The developer's AI coding tool reads the spec and builds the form natively in their app's own framework and styling. RelayKit controls compliance (the spec dictates consent language, the API stores the record, the proxy enforces at send time). The form looks and feels native because it IS native — built by their tool, in their codebase, with their components.

**D-257 — Do not reference "two files" in marketing or public-facing copy**
The delivery mechanism (files dropped into AI coding tools) is not advertised. Marketing copy references the outcome ("your AI tool builds your SMS integration") not the method. The developer discovers the mechanism when they use the product. Applies to: home page, category landing, messages page hero, How it Works modal, and any future marketing surfaces.
⚠ Superseded by D-266 + D-279: SDK delivery model + website authoring surface.

**D-258 — Thin spec file in repo, intelligence behind the wall**
The deliverable file dropped into the developer's repo is small and focused — just enough for the AI tool to execute (messages, API endpoint, consent form spec, wiring instructions). Comprehensive content (full compliance guidelines, carrier rules, edge cases, message library, consent mechanics) lives on RelayKit's servers, accessible via dashboard or authenticated API. Keeps the repo clean, protects IP, enables continuous improvement without developer repo changes.
⚠ Superseded by D-266 + D-279: SDK delivery model + website authoring surface.

**D-259 — Living service architecture**
RelayKit improves for all customers simultaneously without developer action. Template updates, consent language changes, compliance rule refinements, and new message types flow through the API and proxy. The developer's code calls RelayKit's API; the intelligence behind it evolves continuously. The spec file in the repo is a thin pointer; the service behind it is alive.
⚠ Superseded by D-266 + D-279: SDK delivery model + website authoring surface.

**D-260 — Build spec is the highest-priority production deliverable**
The build spec (PRD_05 deliverable) that the developer's AI tool reads is the single most important artifact RelayKit produces. It must be tested empirically with real AI tools (Claude Code, Cursor, Windsurf, Copilot, Cline) before launch. Every failure mode becomes a spec improvement. The spec is a product to iterate, not a document to ship.
⚠ Superseded by D-266 + D-279: SDK delivery model + website authoring surface.

**D-261 — Build spec testing does not require carrier integration**
RelayKit's build spec can be tested and iterated using mock API endpoints and placeholder credentials. Real Sinch integration is not needed to validate whether AI tools can read the spec and produce working integration code. This unblocks the highest-priority validation work (D-260) immediately.
⚠ Superseded by D-266 + D-279: SDK delivery model + website authoring surface.

**D-262 — UX simplicity audit required before launch**
A dedicated review pass with naive eyes — no project context, just the prototype — evaluating every page for information density, jargon, and unnecessary complexity. Standard: would a developer who just wants to add SMS feel overwhelmed? Inline explanations that exist "just in case" move to FAQ sections. Main content should be confident, simple, unequivocal claims. Apple-level user friendliness is the bar.

**D-263 — Unequivocal claims principle**
Marketing copy makes confident, simple claims without asterisks. "We handle opt-in and opt-out." "We handle carrier registration." The less we hedge, the stronger the message. Detailed explanations belong in FAQs, not primary content flow. If a claim needs a paragraph to explain, the feature isn't simple enough yet or the claim needs reframing. Over-explaining creates the same problem as under-explaining.

**D-264 — Single deliverable file, not two**
The developer gets one file dropped into their repo. It contains everything the AI tool needs: messages, API endpoint, consent form spec, wiring instructions, and lean compliance guidance. Comprehensive reference material lives on RelayKit's servers. One file is simpler to explain, simpler to deliver, and eliminates the question of which file to read first. Supersedes any prior references to "two files" in PRDs and decisions.

**D-265 — Build spec validation confirms working module as delivery format** (Date: 2026-03-31)
25 rounds across 8 phases tested spec files, working modules, repo reports, no-trigger prompts, consent forms, and cross-vertical generalization. Working module is 58% faster than spec file with equivalent reliability, reducing AI tool decisions from ~15 to ~3. Spec file format retired as delivery mechanism. Full results in `docs/BUILD_SPEC_VALIDATION_LOG.md`.
_Affects: PRD_05, delivery model, SDK architecture._

**D-266 — SDK (`npm install relaykit`) is the production delivery form factor** (Date: 2026-03-31)
The working module experiments validated the pattern — the SDK is the polished version. Per-vertical namespaces with thin functions wrapping API calls. Intelligence lives on RelayKit's servers, not in the SDK. Validated in Round 12: CC scored 20/20, Windsurf scored 19/20. Both tools used `new RelayKit()` with zero-config and namespace pattern (`relaykit.appointments.sendConfirmation()`) without hesitation. Supersedes the "under active validation" status of the deliverable format in RELAYKIT_PRD_CONSOLIDATED.md.
_Affects: PRD_05, delivery model, production infrastructure, developer experience._

**D-267 — Repo report concept viable with Cursor hallucination mitigation** (Date: 2026-03-31)
CC and Windsurf produced accurate structured JSON codebase analysis. Cursor hallucinated a phone field 3 times across 3 attempts (read-level hallucination, not reasoning). Mitigation: website cross-references contradictions (e.g., phone_field set but collected=false → ask developer to confirm).
_Affects: Future onboarding UX, repo analysis tooling._

**D-268 — Function names carry intent — trigger descriptions are developer documentation, not AI instructions** (Date: 2026-03-31)
Round 7 (no-trigger) confirmed AI tools infer integration points from function names like `sendBookingConfirmation` without being told when to call them. Trigger descriptions remain in docs and on the website for developer understanding but are not needed in the SDK or deliverable files for AI tool comprehension.
_Affects: SDK design, PRD_05 content, SMS_GUIDELINES.md._

**D-269 — Consent + SMS two-module pattern validated** (Date: 2026-03-31)
Round 3 tested two files (consent + SMS), 6 tasks in one prompt. All three tools scored 18/18. Full integration loop: TCPA-compliant consent checkbox, conditional phone validation, consent API, and SMS sending. Proves the SDK can handle both consent and messaging in a single integration pass.
_Affects: SDK architecture, consent API design, PRD_05._

**D-270 — Windsurf .env fix: enable "Allow Cascade Access to Gitignore Files"** (Date: 2026-03-31)
Resolves all .env creation failures observed across experiments. Note in production setup instructions for Windsurf users.
_Affects: Setup documentation, developer onboarding._

**D-271 — Sinch account created** (Date: 2026-03-31)
Dashboard: dashboard.sinch.com. Project ID: `6bf3a837-d11d-486c-81db-fa907adc4dd4`. Trial account, $2.00 test credits, 22-day trial. Reseller status toggle found but errors on trial — likely needs upgrade. Project-based isolation model confirmed.
_Affects: Carrier integration, PRD_04 Sinch migration._

**D-272 — SDK ships dual format: ESM (default) + CJS fallback + TypeScript declarations** (Date: 2026-03-31)
Round 8 experiments showed all three AI tools had to create wrapper files to bridge CJS modules into TS/ESM apps. Dual publish via `tsup` eliminates this friction. AI tools import correctly with zero adapter code regardless of the target app's module system.
_Affects: SDK build pipeline, package.json configuration._

**D-273 — SDK uses per-vertical namespaces** (Date: 2026-03-31)
`relaykit.appointments.sendConfirmation()`, `relaykit.orders.sendShipping()`, etc. 8 namespaces matching PRD_02 use cases: appointments, orders, verification, support, marketing, internal, community, waitlist. Validated in Round 12 — both CC and Windsurf used the namespace pattern correctly on first attempt. Namespaces organize 40-64 functions across 8 verticals without losing the self-documenting quality that made experiment modules work.
_Affects: SDK source code, TypeScript declarations, developer documentation._

**D-274 — Consent functions are top-level on the client instance, not namespaced** (Date: 2026-03-31)
`relaykit.recordConsent()`, `relaykit.checkConsent()`, `relaykit.revokeConsent()`. Consent is cross-cutting (not a vertical), called in different code paths than messaging (registration forms vs. business logic handlers), and was a separate module file in the experiments. Builds on D-252, D-253.
_Affects: SDK source code, TypeScript declarations._

**D-275 — No namespace for the `exploring` use case** (Date: 2026-03-31)
Developers using `exploring` call `relaykit.send({ to, messageType, data })` directly. The exploring use case has no domain semantics for function names to carry. `relaykit.send()` is also the escape hatch for custom messages (D-280). When an exploring developer picks a real vertical, they naturally migrate from `relaykit.send()` to namespace functions.
_Affects: SDK source code, exploring use case documentation._

**D-276 — Single API endpoint for all message sends: `POST /v1/messages`** (Date: 2026-03-31)
SDK abstracts the URL — AI tools never see it. Server routes internally by `message_type` field. Adding verticals, changing compliance rules, or adjusting rate limits requires no SDK update. Five total API endpoints: `POST /v1/messages` (send), `POST /v1/consent` (record), `GET /v1/consent/:phone` (check), `DELETE /v1/consent/:phone` (revoke), `POST /v1/messages/preview` (validate before sending).
_Affects: API server design, SDK internal client, messaging proxy._

**D-277 — SDK defaults to graceful failure mode** (Date: 2026-03-31)
Missing phone → null + console warning. Missing API key → null + console warning. Network error → null + console warning. Compliance blocks → structured result: `{ id: null, status: 'blocked', reason: 'recipient_opted_out' }`. Optional strict mode (`new RelayKit({ strict: true })`) throws `RelayKitError` instead. Default graceful ensures SMS never crashes the developer's app.
_Affects: SDK source code, error handling documentation._

**D-278 — SDK uses zero-config initialization by default** (Date: 2026-03-31)
`new RelayKit()` reads `RELAYKIT_API_KEY` and `BUSINESS_NAME` from `process.env`. Explicit config available via `new RelayKit({ apiKey, businessName })`. Both CC and Windsurf used zero-config in Round 12, matching the .env pattern every AI tool naturally creates.
_Affects: SDK source code, setup documentation._

**D-279 — Website is the message authoring surface, not the delivery mechanism** (Date: 2026-03-31)
SDK (`npm install relaykit`) replaces file download as the delivery mechanism. The website remains the onboarding and personalization surface: developer picks use case, previews messages, edits if desired. Message content is saved server-side, tied to the developer's API key. The SDK sends semantic events (`relaykit.appointments.sendConfirmation(phone, { date, time })`); the server composes actual SMS from the developer's saved templates. The developer's codebase never contains message text. **Updates D-162 and D-217** — see annotations on those entries.
_Affects: Website UX, Messages page, PRD_05, PRD_06, download flow, developer experience._

**D-280 — Custom messages: developers author additional messages on the website beyond the curated library** (Date: 2026-03-31)
Developer gives the message a name, writes the text with `{variables}`, and it becomes callable via `relaykit.send({ to, messageType: 'custom_post_visit_thankyou', data })`. Custom messages go through the same compliance pre-review on the website at authoring time. Gives flexibility on top of the curated library without putting the compliance burden back on the developer. The curated library covers the 80% case; custom messages cover the 20%.
_Affects: Website Messages page, API server, message storage schema, compliance pre-review._

**D-281 — Message editing uses inline editing on the website with real-time compliance indicators** (Date: 2026-03-31)
Template engine provides defaults; developer refines. Edits saved server-side. Compliance checks run on save (prevention), not on send (cure). Indicators show: missing business name, missing opt-out language, SHAFT-C content flags. When the message hits the SDK pipeline, it's already clean. No drag-and-drop editor, no version history, no approval workflows for v1. Just: message cards, editable text, compliance check, save.
_Affects: Website Messages page, template engine, compliance pre-review._

**D-282 — Curated messages use namespace functions; custom messages use `relaykit.send()`** (Date: 2026-03-31)
The curated message library (per-use-case templates from PRD_02) maps to SDK namespace functions (`relaykit.appointments.sendConfirmation`). Custom messages map to `relaykit.send()` with a developer-defined `messageType` string. Same API endpoint underneath, same compliance checks, same proxy. Namespace functions are the blessed paths with maximum guardrails; `relaykit.send()` is the flexible path.
_Affects: SDK documentation, API server routing, message type resolution._

**D-283 — SMS_GUIDELINES.md remains a separate artifact from the SDK** (Date: 2026-03-31)
It sits in the developer's project root as a compliance co-pilot for AI coding tools. Whether it's downloaded from the website or generated by a CLI command (`npx relaykit init`) is deferred to PRD_05 production build. The SDK handles message sending; SMS_GUIDELINES.md handles compliance context for the AI tool writing the integration code.
_Affects: PRD_05, developer onboarding, setup documentation._

**D-284 — API server: Hono in /api, standalone deployment target** (Date: 2026-04-01)
The sandbox API endpoint runs as a standalone Hono server in /api at the repo root. Not inside the Next.js app — different deployment concerns (stateless, no SSR). Hono over Express for TypeScript-native design, clean middleware, and multi-runtime portability (Node/Bun/Workers). Not a Supabase Edge Function — the API server is core infrastructure and needs its own deployment target with full control over scaling and timeouts.
_Affects: API server architecture, deployment pipeline, /api directory._

**D-285 — API keys: hashed storage, environment-prefixed, shown once** (Date: 2026-04-01)
API keys use rk_sandbox_ (sandbox) and rk_live_ (production) prefixes. Keys are SHA-256 hashed before storage — the full key is shown exactly once at creation. Supabase table: api_keys with id, user_id, key_hash (indexed), key_prefix (first 12 chars for dashboard display), environment (sandbox/production), created_at, revoked_at. Validated via Authorization: Bearer header. No rate limiting in v1 (backlog).

_⚠ Partial supersession: user-facing prefix is now `rk_test_` per D-349._
_Affects: API server auth middleware, Supabase schema, dashboard Settings page._

**D-286 — Template lookup: static JSON registry for sandbox, Supabase for production** (Date: 2026-04-01)
Sandbox uses a static JSON template registry extracted from the /src template engine (PRD_02), loaded at API server startup. Contains template ID, vertical, event name, template string with interpolation slots, required data fields. Production adds Supabase lookup for user-specific registered/customized templates. The extraction creates a shared format both paths consume.
_Affects: API server template resolution, template engine extraction, Supabase schema._
⚠ Partially orphaned by D-266 + D-279; JSON registry path may survive in /api — confirm at Phase 2 kickoff.

**D-287 — API response contract: msg_ IDs, structured errors, standard HTTP codes** (Date: 2026-04-01)
Success: { id: "msg_...", status: "sent" | "queued", timestamp }. Failure: { error: { code, message } }. Error codes: invalid_api_key, template_not_found, invalid_data, send_failed. HTTP status: 200 sent, 202 queued, 400 bad request, 401 bad key, 422 template/data mismatch, 500 carrier failure. The msg_ prefix provides a correlation ID through to Sinch.
_Affects: API server response formatting, SDK response types, error handling._

**D-288 — Starter Kit Program: post-launch, builds after Priorities 1-3** (Date: 2026-04-01)
Open-source app starters (Supabase auth + Stripe billing + RelayKit SDK) are a developer acquisition channel, not a replacement for the SDK-first path. Cannot ship until npm install relaykit → sandbox API key → real text message works end-to-end. Build sequence: core foundation repo first, then Appointments vertical, then Orders vertical, then expand based on traction. Each new vertical is ~half a day. Timing: after sandbox signup flow (Priority 3), before major marketing push.
_Affects: Launch sequencing, developer marketing, GitHub presence._

**D-289 — Starters supersede message reference page as lead magnet** (Date: 2026-04-01)
The message reference page concept (existing backlog idea) is superseded by starters as the primary lead magnet. A starter puts a working app with compliant SMS in the developer's hands — higher conversion than a reference document. The message reference page remains viable as lightweight secondary content but is no longer the priority lead-gen asset.
_Affects: Marketing strategy, backlog prioritization._

**D-290 — Starters are not gated** (Date: 2026-04-01)
Fully open source on GitHub, no signup required to clone. Conversion happens when the developer wants to send real messages — same sandbox funnel as the SDK-first path. README includes plaintext pricing (consistent with D-216). No signup walls, no email gates.
_Affects: Starter Kit repos, README content, developer onboarding._

**D-291 — Sandbox API keys store raw_key for dashboard re-display** (Date: 2026-04-01)
Sandbox environment keys are always visible in the developer dashboard (Settings screen). Store both the SHA-256 hash (for auth lookup) and the plaintext key in a `raw_key` column on `api_keys`. Only populated when environment = 'sandbox'. Live keys are never stored in plaintext — only the hash. This aligns with the Settings PRD where sandbox keys are shown in full.
_Affects: api_keys Supabase schema, dashboard Settings page, API key creation flow._

**D-292 — Sandbox API keys allow NULL user_id, live keys require it** (Date: 2026-04-01)
api_keys.user_id is nullable with a CHECK constraint: NULL is allowed when environment = 'sandbox', NOT NULL required when environment = 'live'. The FK to customers(id) is preserved for live keys. Sandbox keys are anonymous until the developer authenticates, at which point user_id is updated to link the key to their customer record. This avoids polluting the customers table with placeholder rows.
_Affects: api_keys Supabase schema, signup handler, API key lifecycle._

**D-293 — Compliance enforcement collapses to authoring time; runtime enforcement removed** (Date: 2026-04-02)
All messages are authored or edited on the RelayKit website with real-time compliance checking. Non-compliant messages cannot be saved, therefore cannot reach production. The three-tier runtime enforcement system (D-242) — silent rewrite, escalated notification, suspended — is removed. The messaging proxy is a delivery engine (template lookup → interpolation → carrier send), not an enforcement engine. Dashboard compliance attention cards, operator queue, 30-day escalation timelines, and per-message-type suspension mechanics are removed. PRD_08 (compliance monitoring) is largely obsoleted — the only surviving concern is carrier rule changes, handled as a RelayKit internal ops process. Preserves D-242's tone principle: "knowledgeable colleague, not compliance cop" still governs website authoring feedback.
Supersedes: D-242 (three-tier enforcement). Reframes D-19 (compliance checking is non-optional at authoring time, not send time).
_Affects: Consolidated PRD, PRD_08, prototype compliance cards, messaging proxy design._

**D-294 — Marketing available from day one; smart registration, on-demand activation, $19/$29 monthly tiers** (Date: 2026-04-02)
Marketing namespace is visible and fully usable in sandbox from day one — not gated, not an upsell. No expansion modal, no "Add marketing" CTA.

Registration behavior: If the developer has used marketing messages in sandbox (detected from send history), both transactional and marketing campaigns auto-submit at registration. If they haven't, only transactional submits. Either way, the developer pays $199. RelayKit absorbs the ~$15 TCR campaign vetting fee for the marketing campaign.

On-demand activation: If a developer registered transactional-only and later enables marketing (first marketing send in production, or toggle in Messages page), RelayKit auto-submits the marketing campaign in the background. No extra registration fee, no modal, no checkout. Developer sees: "Marketing messages are being registered — usually a few days."

Monthly pricing: $19/month for transactional only. $29/month when marketing is active (transactional + marketing). Same 500-message combined pool. The $10/month increase covers additional carrier infrastructure (TCR campaign monthly fee). Upgrade from $19 → $29 happens automatically when the marketing campaign activates; developer is informed upfront on the pricing page and during registration. No separate $29 one-time marketing add-on fee — that's eliminated.

Stepping down: If a developer wants to stop marketing, they toggle it off in Settings. Takes effect next billing cycle. RelayKit suspends the marketing campaign with TCR (stops monthly carrier fee). Subscription drops to $19. Re-enabling later requires re-submitting the campaign (~$15 cost absorbed by RelayKit, few days for approval).

Constraint: Transactional is the base. Cannot have marketing without transactional. Cancellation cancels everything. ⚠ Amended by D-304 (symmetrical pricing) and D-305 (marketing standalone valid). The "transactional is the base" constraint is removed.

Supersedes: D-15 (expansion = second campaign — now: marketing auto-submits at registration if used in sandbox, or on-demand, not as a separate expansion step), D-37, D-89 (transactional-only first registration — now: both submit if developer signals intent via sandbox usage).
_Affects: Registration pipeline, pricing model, Stripe subscription management, consolidated PRD, prototype expansion modals/banners, sandbox send history tracking._

**D-295 — Remove marketing upsell cards from dashboard Overview and Messages pages** (Date: 2026-04-02)
Marketing promotional cards removed. Marketing is just another namespace in the message library — visible from sandbox onward, live after its campaign approval clears. No CTAs, no "coming soon" badges, no sales copy in the developer's dashboard.
_Affects: Prototype dashboard, consolidated PRD dashboard section._

**D-296 — One product, multiple entry points — SDK and raw API are equal paths** (Date: 2026-04-02)
The SDK (npm install relaykit) and the raw API (POST /v1/messages) deliver the same experience. The SDK is a developer convenience wrapper, not a separate product. Technical vibe coders use the SDK. No-code/low-code users (Lovable, Bolt, Replit) call the API directly or through platform connectors. Same backend, same templates, same compliance, same pricing. No feature flags, no conditional onboarding, no diverging dashboards.
_Affects: Marketing copy, documentation, onboarding flow._

**D-297 — No-code vibe coders are an unserved market; full product experience for all users** (Date: 2026-04-02)
Lovable, Bolt, and Replit all have Twilio integrations but none handle compliance. RelayKit's API endpoint is already the product for this audience. These users get the same website authoring surface as SDK users — curated message library plus custom message authoring with compliance checking. The website must be fail-proof for both technical and non-technical users. Minimize differentiation between audiences. Only difference is entry point: SDK vs direct API. This audience is served after SDK launch validates revenue.
_Affects: Marketing strategy, website UX, backlog prioritization._

**D-298 — Free tier sends to verified phones only; no shared-number sending to real end users** (Date: 2026-04-02)
Carrier research confirms every business needs its own registered brand and campaign. A shared RelayKit number sending on behalf of unregistered businesses is not compliant regardless of volume. 10DLC was created to end number-sharing. Free tier stays as-is: real API, real delivery, verified phones only. Upgrade to paid = send to real users.
_Affects: Pricing model, free tier framing, sandbox design._

**D-299 — Data model: use project_id as ownership key for new tables going forward** (Date: 2026-04-02)
New tables should use project-scoped ownership so multi-user, ownership transfer, and agency handoff all resolve to the same schema change later. API keys, message templates, registrations, demo lists, and billing conceptually belong to a project. A project currently has one user. When multi-user is needed, add a project_members join table. This is a principle for new tables, NOT a migration of existing tables. Existing api_keys table keeps user_id for now.
_Affects: New table schemas going forward._

**D-300 — Website intake interview replaces spec file prompt; our AI generates the context** (Date: 2026-04-03)
The old flow: developer downloads a spec file with a generic prompt, pastes it into their AI tool, AI tool asks business context questions. The new flow: the RelayKit website conducts an intake interview (powered by Claude on our backend), processes the answers, and generates a fully contextualized spec file. The developer's AI tool receives instructions, not questions. No copy-paste — the spec file is delivered via `npx relaykit init` or an API endpoint that the developer's project reads from. The intake asks business-specific questions per vertical (e.g., for appointments: business name, appointment types, booking lead time, cancellation policy). Answers feed into two outputs: (1) message templates are personalized with real business context in previews, and (2) the spec file includes structured business context so the AI tool builds with real data, not placeholders. This eliminates the Cursor hallucination problem from build spec experiments (guessing at data model fields) and fully resolves D-257 ("two files" — there are no files from the developer's perspective). The AI split is ~80/20 deterministic to Claude: branching question logic, template personalization, variable validation, keyword screening, and required element checks are all deterministic code. Claude handles judgment calls: edited message compliance evaluation, AI fix rewrites, custom message guidance, transactional-vs-marketing content classification. No-code users (Lovable, Bolt, Replit) get the same intake experience as SDK users — same website, same questions, same output (D-296).
Supersedes: the "prompt" section of the old Messages page download flow. Extends D-279 (website as authoring surface) upstream to also be the context-gathering surface.
_Affects: Website UX, spec file generation, SDK init command, build spec delivery, AI cost model, PRD consolidated._

**D-301 — Message variable schema: locked for curated messages, developer-defined for custom** (Date: 2026-04-03)
Curated messages (the per-vertical default library) have a fixed variable set per message type. Developers can edit copy, pick style variants, and change wording — but cannot add or remove variables. This means switching between pill variants is a pure UI action with zero integration impact, and editing a curated message cannot break the app's SDK calls. Custom messages (D-280) define their own variable schema as part of the authoring flow — the website generates the SDK call signature from the developer's variable definitions. This splits complexity: the simple path (curated) stays dead simple; the custom path owns its own complexity.
_Affects: Website message editing UX, SDK type generation, custom message authoring flow._

**D-302 — EIN required for marketing messages, verified at sandbox access** (Date: 2026-04-03)
Marketing messages require an EIN — this is a carrier constraint (sole props are limited to one transactional campaign and cannot register a second marketing campaign). When a developer wants to access marketing messages in the website authoring surface, they enter their EIN. RelayKit verifies the EIN and auto-populates business identity fields (legal name, address, entity type, state of registration) from authoritative sources. Developer confirms or corrects. This catches EIN/business-name mismatches before TCR submission — every prevented rejection saves ~$15 in vetting fees and protects RelayKit's ISV trust score. Transactional-only users are not affected — EIN is only required when marketing messages are accessed. Data sources to investigate: IRS Business Master File, state Secretary of State databases, commercial APIs (Middesk, Enigma) at ~$1-3 per lookup.
AMENDED: EIN is required for any second campaign of any type, not just marketing. Sole props without EIN are limited to one campaign of any type. A developer wanting appointments + orders needs an EIN just as much as one wanting appointments + marketing.
_Affects: Website intake flow, sandbox experience, registration pipeline, TCR submission quality._

**D-303 — Business identity pre-validation: auto-populate registration fields from EIN lookup** (Date: 2026-04-03)
When a developer enters their EIN (either for marketing access per D-302 or during registration), RelayKit performs a lookup to auto-populate: legal business name, business address, business type (sole prop/LLC/corp), and state of registration. These are the fields TCR checks during campaign vetting. The registration form becomes "confirm what we found" instead of "fill out 8 fields and hope they match." This pre-validation is a registration quality feature — it reduces first-time rejection rates, saves vetting fees, and protects the ISV trust score. The lookup cost ($1-3 per query for commercial APIs) has clear ROI against the $15 TCR vetting fee saved per prevented rejection.
_Affects: Registration pipeline, intake wizard, EIN verification flow, COGS._

**D-304 — Pricing is symmetrical: first campaign $19, second campaign $29, regardless of direction** (Date: 2026-04-03)
D-294 framed pricing as transactional = base, marketing = upgrade ($19 → $29). This is corrected: the pricing reflects the number of registered campaigns, not which type came first. Marketing-only is a valid standalone vertical at $19/month. Adding a second campaign in either direction (transactional adds marketing, OR marketing adds transactional) bumps to $29/month because RelayKit maintains two TCR campaigns and pays two sets of carrier fees. This is symmetrical and honest about what the cost represents.
Amends D-294: removes "Constraint: Transactional is the base. Cannot have marketing without transactional." Replaces with: "First campaign = $19/month. Second campaign = $29/month. Direction doesn't matter."
_Affects: Pricing model, Stripe subscription management, marketing copy, registration pipeline._

**D-305 — Marketing-only is a valid standalone use case; marketing does not require transactional** (Date: 2026-04-03)
Marketing is already a selectable vertical on the category landing page. A local boutique sending only promotions and sale announcements is a legitimate use case with no transactional events. Forcing a transactional campaign registration for a business that will never send transactional messages is unnecessary cost and complexity. Marketing-only registers one marketing campaign at $19/month. Requires EIN (D-302). If the developer later wants to add transactional messages (e.g., order confirmations), on-demand activation submits the transactional campaign and subscription adjusts to $29/month — same D-294 mechanics, reversed direction.
Amends D-294: removes the constraint that marketing requires transactional as a prerequisite.
_Affects: Registration pipeline, pricing model, category landing page, intake flow._

**D-306 — SDK sends namespace + event, not message_type** (Date: 2026-04-03)
The SDK request body changes from `{ to, message_type, data }` to `{ namespace, event, to, data }` to match the API server's validated contract (shared.ts). The flat `message_type` field (e.g. `appointments_booking_confirmation`) is removed. Each namespace function passes its namespace and event name directly. No migration needed — no production consumers exist yet.
_Affects: SDK client.ts, SDK namespace files, API routes/messages.ts._

**D-307 — SDK method names are the public API; registry keys align to them** (Date: 2026-04-03)
When SDK method names and registry event keys differ, the registry is renamed to match the SDK. The SDK was validated in 25 experiment rounds and represents what developers expect. Registry event keys are internal. Missing templates are added for all SDK-exposed methods so no method produces a 422. Extends D-306.
_Affects: API templates/registry.ts._

**D-308 — API error responses use { error: { code, message } } format; SDK reads from this structure** (Date: 2026-04-03)
The SDK's error parsing is updated to read `response.error.message` instead of top-level `reason`. The `SendResult.reason` field is populated from `error.message` on failure. The API error format is the source of truth. Extends D-287.
_Affects: SDK client.ts._

**D-309 — Quiet hours enforcement at the proxy level** (Date: 2026-04-03)
Marketing messages are blocked/queued outside 8 AM–9 PM recipient local time (determined by area code NPA-NXX lookup). Transactional messages are allowed through with an optional warning. This protects customers from TCPA quiet hours liability automatically. Implementation is proxy-level — developers never think about it. Queued messages are delivered when the recipient's quiet hours end.
_Affects: Messaging proxy, message queue, NPA-NXX timezone lookup._

**D-310 — EIN and business identity are per-app, not per-account** (Date: 2026-04-04)
Business identity (EIN, legal name, address, entity type) is scoped to the app, not the user account. A developer with two apps can have two different business identities. This supports the multi-app future (PRD_11) and matches the "everything scoped to app" design principle. URL structure uses /app/[appId]/.
_Affects: Data model, Settings page, registration pipeline, intake wizard._

**D-311 — Multiple categories submit simultaneously at registration — no sequencing** (Date: 2026-04-04)
When a developer has two categories (e.g., appointments + marketing), both submit as separate TCR campaigns in a single registration action. No "primary first, second later" sequencing. One submission, one fee, all campaigns reviewed together. Simplifies the go-live experience and matches the "one action" pricing model (D-314).
_Affects: Registration pipeline, go-live screen, TCR submission logic._

**D-312 — TCR allows up to 5 campaigns per brand; v1 supports max 2** (Date: 2026-04-04)
TCR's limit is 5 campaigns per registered brand. RelayKit v1 supports a maximum of 2 campaigns per app (one primary + one secondary). Additional campaigns beyond 2 are backlogged for future consideration. This keeps pricing simple (D-304) while leaving room to grow.
_Affects: Category selection UI, registration pipeline, future pricing tiers._

**D-313 — Pre-auth message send requires special endpoint or session token** (Date: 2026-04-04)
Before signup, the developer has a verified phone (Step 4) but no API key. Sending test messages from the website in this pre-auth state requires either a special unauthenticated endpoint scoped to the verified phone and session, or a temporary session token. The mechanism must prevent abuse while allowing the "send to my phone" hook moment before any commitment. Design TBD.
_Affects: API design, pre-auth messages page, rate limiting, abuse prevention._

**D-314 — Single $99 go-live fee replaces the two-fee split ($49 submission + $150 approval)** (Date: 2026-04-04)
The two-fee structure ($49 at submission, $150 at approval) mapped to internal process steps the developer shouldn't know about. The wizard-to-workspace flow presents "Go live" as a single action — pricing matches. $99 one-time + $19/mo ongoing. Full refund if registration is rejected. $99 stays in impulse range for indie developers while filtering uncommitted signups. The monthly subscription is the real revenue model; the setup fee is cost recovery and a quality filter.
Supersedes: D-193 ($49 at submission), D-216 ($150 at approval). Amends: D-196 (beta pricing — update to $99 flat, capped slots).
_Affects: Pricing model, Stripe configuration, go-live screen copy, PRICING_MODEL.md, marketing site._
⚠ Superseded by D-320: $49 flat fee, not $99.

**D-315 — Price revealed at signup step, not at go-live or on arrival** (Date: 2026-04-04)
Pricing is shown at the signup step (Step 6 in the wizard): "Free while you build. $99 + $19/mo when you're ready for real delivery." The developer has completed intake, seen their messages, and optionally sent a test — they understand the value before seeing the cost. No pricing on the arrival/landing frame (premature, they haven't felt the value). No deferring to go-live (surprise after hours of building). Signup itself is free. The line is informational, not a gate. The developer builds with full knowledge of the cost from signup onward.
_Affects: Signup screen copy, WORKSPACE_DESIGN_SPEC.md Step 6, marketing site pricing page._

**D-316 — Signup is a wizard step, not a separate decision moment** (Date: 2026-04-04)
Signup (Step 6) is triggered by a "Continue" button at the bottom of the messages step — same visual treatment as every other wizard advance. Not a modal. Not triggered by send-to-phone. Not a "Sign up" or "Create account" CTA. The developer scrolls down and hits the same kind of button they've been hitting since the vertical picker. This prevents the "committal CTA that people skip" problem — if signup feels like a gate, developers will avoid it and build without knowing the price. As a natural wizard step, they flow into it and see the pricing (D-315) before investing engineering time.
_Affects: Wizard flow UX, Step 6 design, WORKSPACE_DESIGN_SPEC.md._

**D-317 — Opt-in form is a wizard step between messages and signup, not on the messages page** (Date: 2026-04-04)
The opt-in form preview moves from the messages page right column to its own wizard step between messages and signup. Read-only, populated with developer's business name and message types from intake. "Continue" advances to signup. Messages page gets full viewport for message cards. Post-onboarding, the opt-in form is viewable on demand from the messages page (modal or slideout — design TBD). Supersedes the two-column layout with opt-in on the right.
_Affects: Messages page layout, wizard flow, opt-in form component._

**D-318 — Messages wizard step has Continue at top and bottom** (Date: 2026-04-04)
The messages page in wizard context has a Continue button in both the top header area and below the last message card. Only wizard step with dual Continue — the page is long enough that developers may not scroll. All other wizard steps use bottom-only.
_Affects: Messages page layout, wizard navigation pattern._

**D-319 — Compliance restore replaces full message with clean variant, not a partial patch** (Date: 2026-04-05)
When a developer's manual edit breaks compliance (missing or mangled opt-out language, missing business name, etc.), the "Restore" button replaces the entire message text with the clean version of whichever style variant was active before editing. This avoids trying to surgically fix fragments in messy text. The developer can continue editing from the restored clean version. The compliance check itself will be server-side in production — the prototype uses a client-side stub.
_Affects: Message card edit state, compliance check behavior, future server-side compliance engine._

**D-320 — Registration pricing: $49 flat fee** (Date: 2026-04-05)
Registration fee is $49, paid at submission. Single payment, no split, no go-live fee. Monthly subscription $19/mo unchanged. Per-message pricing unchanged. Volume play — lower barrier drives larger base. Supersedes D-314 ($99 flat fee) and the original D-193/D-216 ($49 submission + $150 go-live split).
_Affects: Signup step, pricing reveal copy, settings billing section, overview registration card, register/review page, marketing/pricing pages._

**D-321 — Overage pricing: $8 per 500 additional messages** (Date: 2026-04-05)
Overage billing is $8 per 500 additional messages beyond the 500 included in the $19/mo base subscription. Replaces the previous $15/1000 structure. Lower increment matches vibe coder usage patterns and reduces perceived waste. Effective rate ~$16/1000, nearly identical to previous pricing.
_Affects: Ready page pricing block, signup pricing reveal, settings billing section, marketing/pricing pages._

**D-322 — Get-started page is the state transition boundary** (Date: 2026-04-06)
The get-started page (`/apps/[appId]/get-started`) is the last onboarding screen. Everything before it (wizard, signup, verify) runs in Default state. The state transition to Pending happens only when the developer clicks "View on dashboard" or "Talk to our AI assistant" — not on OTP verification. This makes the get-started page a standalone screen (no WizardLayout, no DashboardLayout) that lives in Default state but is not a wizard page.
_Affects: AppLayout routing, session state management, get-started page, signup/verify navigation._

**D-323 — Signup split into email entry + OTP verification** (Date: 2026-04-06)
Signup is two separate pages: `/apps/[appId]/signup` (email entry + "Send code" CTA) and `/apps/[appId]/signup/verify` (OTP input + "Confirm" CTA). Both pages manage their own inline Back links (no WizardLayout header Back/Continue). 400px max-width content column on both. Email stored in sessionStorage (`relaykit_signup_email`) for cross-page persistence.
_Affects: Signup flow, WizardLayout config, AppLayout routing, TopNav wizard regex._

**D-324 — Registration state rename: Default → Onboarding, Approved → Registered** (Date: 2026-04-07)
Renamed `RegistrationState` enum values: `"default"` → `"onboarding"`, `"approved"` → `"registered"`. All conditionals, state switchers, and routing updated. Existing states Pending, Extended Review (`changes_requested`), Rejected unchanged. Semantic clarity — "default" was ambiguous, "approved" conflated carrier approval with the product state.
_Affects: session-context.tsx, top-nav.tsx, dashboard-layout.tsx, app layout, overview, messages, settings, signup/verify, get-started, proto-nav-helper._

**D-325 — New "Building" state between Onboarding and Pending** (Date: 2026-04-07)
Added `"building"` to `RegistrationState`. This is the post-signup, pre-registration dashboard state. Shows full dashboard layout (Overview/Messages/Settings tabs) like Pending. Get-started page transitions to Building (not Pending). State switcher order: Onboarding → Building → Pending → Extended Review → Registered → Rejected.
_Affects: session-context.tsx, all state switchers, get-started page, app layout routing._

**D-326 — Building state Overview: Start building content + registration card** (Date: 2026-04-07)
Building state Overview shows two-column layout. Left: "Start building" heading, subhead, tool logo farm (left-aligned), 3 copyable instruction cards (Install, API key, Add SMS). Right: registration card with "Ready to go live?" heading, "$49 registration + $19/mo" pricing, "Start registration →" CTA. Same left-column content also shown in Pending, Extended Review, and Rejected states.
_Affects: overview/page.tsx._

**D-327 — Remove "Build your SMS feature" accordion from Overview** (Date: 2026-04-07)
The 4-step accordion (verify phone → send test → send from code → build feature) was removed from Overview across all states. Replaced by the simpler Start building content (D-326). The accordion was stale — onboarding now handles setup through the wizard flow, and the get-started page provides the build instructions.
_Affects: overview/page.tsx (659 lines deleted)._

**D-328 — Messages page onboarding view divergence** (Date: 2026-04-07)
Messages page in Onboarding state is now visually distinct from the dashboard version: H1 "Here's what your app will send" (text-2xl font-bold), body "Each message is tailored to your business. Edit messages any time. Your app always sends the latest version.", CTA label "Continue" (not "Start building"), no send icons on message cards (`hideSend` prop on CatalogCard), "What about marketing messages?" tooltip (EIN-aware from wizard sessionStorage). Dashboard states keep H2 "Messages", send icons, no marketing tooltip.
_Affects: messages/page.tsx, catalog-card.tsx._

**D-329 — Ready page copy update** (Date: 2026-04-07)
Headline changed from "Skip the hard part" to "SMS that just works". Subhead changed to "Create your account and we'll generate everything your tool needs to build."
_Affects: ready/page.tsx._

**D-330 — SDK static for launch** (Date: 2026-04-07)
All vertical namespaces are exposed in the SDK regardless of which messages the developer has configured. Dynamic method discovery (only exposing configured namespaces) is backlog. The static approach validated cleanly in 25 rounds of build spec testing — AI tools use the namespace pattern correctly on first attempt without needing filtered exports.
_Affects: /sdk, future dynamic discovery work._

**D-331 — Generated AI tool prompt replaces SMS_GUIDELINES.md for get-started** (Date: 2026-04-07)
The get-started page generates a pre-populated prompt for the developer's AI coding tool, built from their wizard data (business name, vertical, configured messages). This replaces the earlier concept of a downloadable SMS_GUIDELINES.md file. The prompt is the onboarding artifact — not a reference doc.
_Affects: get-started/page.tsx, wizard sessionStorage data flow._

**D-332 — Single-page workspace: no tabs, Messages is the workspace** (Date: 2026-04-07)
The post-signup dashboard collapses into a single Messages-centric page. No tab bar. Overview route redirects to Messages. Setup cards appear at the top of Messages (dismissible). Registration CTA is a lightweight banner, not a structural column. Metrics appear at top after registration. Settings is a child page accessed via icon/link, not a tab. See WORKSPACE_DESIGN_SPEC.md for full specification.
_Affects: All post-signup routes, dashboard-layout.tsx, overview redirect, tab bar removal, settings routing._

**D-333 — One transactional + one marketing campaign per project** (Date: 2026-04-07)
Each project supports exactly one transactional campaign and one optional marketing campaign. No multiple transactional verticals within a single project — multi-vertical developers use multi-project support (PRD_11). Marketing requires EIN. Marketing-first flow requires EIN upfront and bundles transactional automatically.
_Affects: Registration model, campaign architecture, marketing expansion flow, PRD_11 scoping._

**D-334 — Marketing campaign bundled in $49 registration fee** (Date: 2026-04-08)
Registration fee ($49) covers both transactional and marketing campaigns. No additional registration charge for the second campaign. Marketing requires EIN (unchanged). Monthly subscription auto-adjusts from $19/mo to $29/mo when marketing activates (D-304). Both campaigns share a single message pool. Developer earns marketing access by providing EIN — the identity verification is the gate, not payment.
_Affects: Registration flow, pricing copy, marketing expansion CTA, PRICING_MODEL.md._

**D-335 — Registration CTA shows campaign selection when EIN on file** (Date: 2026-04-08)
The "Ready to go live?" registration card in Building state presents two radio options when an EIN is verified: "Just [vertical]" (default, $19/mo) and "Add marketing messages too" ($29/mo). When no EIN, no radio buttons — shows transactional-only pricing with "Add your EIN to unlock marketing messages." This is the pre-registration moment where the developer commits to campaign scope. The vertical name is read from sessionStorage and lowercased in the label.
_Affects: Messages page Building state, registration flow entry point, campaign selection UX._

**D-336 — Marketing messages visible and editable in Pending state after registration** (Date: 2026-04-09)
When a developer selects "Add marketing messages too" during registration, marketing messages appear in the messages list immediately in Pending state — not after approval. Developer can customize and refine marketing messages while waiting for transactional approval. Marketing messages display above transactional messages with a "Marketing" badge on each card. This transforms wait time into productive building time and validates the developer's $29/mo commitment.
_Affects: Messages page Pending state, message list ordering, marketing message visibility, badge component._

**D-337 — Inline EIN verification on Building state registration card** (Date: 2026-04-09)
Developers can add their EIN directly from the Building state registration card without navigating away. "Add EIN." link swaps the registration card to an EIN verification card (Card B) with input, two-phase verify stub, business identity confirmation, and Save/Cancel. On save, the card swaps back with campaign selection radios visible. Same EIN verification pattern (input + two-phase spinner + identity card) as the onboarding /start/business page, extracted to shared component ein-inline-verify.tsx.
_Affects: Messages page Building state, registration card, ein-inline-verify.tsx._

**D-338 — Marketing upsell card appears in all post-onboarding states** (Date: 2026-04-10)
The marketing upsell card is available across Building (via the registration card's campaign selection radios), Pending (right rail, below the registration status card), and Registered (right rail, standalone). Developers can add marketing at any point in their lifecycle — not just at initial registration. The upsell flow is consistent across states: default upsell → EIN verification card swap if no EIN → pricing confirmation step (Confirm marketing messages) → confirmed. After confirmation in Pending, the upsell section disappears and a Marketing row appears in the registration status card. After confirmation in Registered, the upsell is replaced by a marketing-only registration tracker.
_Affects: Messages page (Pending + Registered right rails), ein-inline-verify.tsx reuse, marketing upsell pattern._

**D-339 — Registration status tracker is a per-message-type card** (Date: 2026-04-10)
Registration status is shown as a card with one row per registered message type. Each row shows the bold type name on top, "Submitted [date]" below, and a status badge on the right ("In review" purple / "Registered" green). Badges use the same filled-secondary style as the Marketing catalog badge. The card heading is "Registration status" with an info tooltip ("Registration usually takes 2–3 days per message type."). When all tracked types are registered, the heading changes to "Your messages are live!" (no tooltip) and a right-aligned primary Close button permanently dismisses the card. In Registered state, the tracker shows only a Marketing row (no transactional row) because the transactional category is already live.
_Affects: Messages page (Pending + Registered right rails), registration status UI pattern._

**D-340 — Marketing messages show in list while marketing campaign is in review (extends D-336)** (Date: 2026-04-10)
D-336 established that marketing messages appear in the message list in Pending state when marketing is registered at signup. This extends to all upsell paths: when a developer confirms marketing via the upsell card in either Pending or Registered state, marketing messages appear in the list immediately while the campaign is under review. Developers don't wait for approval to see and edit their marketing messages. Combined with D-339's per-type tracker, the developer can see both the "in review" status and the editable messages simultaneously.
_Affects: Messages page (Pending + Registered state message list), marketing upsell flow, showMarketingMessages logic._

**D-341 — Monitor/test expansion mode on message cards** (Date: 2026-04-11)
Every message card has a second expansion mode alongside the existing edit mode. The Activity icon in the card title row opens a "Test & debug" panel showing recent send activity (mock data with delivery status, timestamps, carrier error details for failures), a recipient dropdown synced with the Testers card, a "Quick send" stub button, and a "Close" primary button. Edit and monitor are mutually exclusive — opening one closes the other. The expansion renders below the read-only message text (text stays visible in monitor mode, unlike edit mode which replaces it with a textarea). In collapsed state, both Activity and pencil icons show with no labels; in expanded state, only the active mode's icon + text label ("Test & debug" or "Edit") appears.
_Affects: CatalogCard component, messages page (monitor state management, controlled props)._

**D-342 — Testers card in the right rail** (Date: 2026-04-11)
A "Testers" card appears in the right rail of all post-onboarding states (Building, Pending, Extended Review, Registered, Rejected), below any existing right rail content. It shows up to 5 people who can receive messages in test mode. Each row displays name, full phone number, verified/invited status, and a kebab menu with Edit and Delete (the developer's own entry has Edit only, no Delete). An inline invite form (name + phone inputs, 1.5s "Sending…" stub, collapses on success) adds new entries as "Invited". The Testers card's names sync with the Quick send dropdown in the monitor expansion so both always show the same list.
_Affects: Messages page (right rail in all states), test-phones-card.tsx, CatalogCard testRecipients prop._

**D-343 — Ask Claude panel on the messages page** (Date: 2026-04-11)
An "Ask Claude" AI assistant panel opens from the messages section header (unfocused) or from inside a message card's monitor expansion (focused on that message name). When open, the panel replaces the right rail and metrics cards. At ≥768px: messages and panel sit in a 50/50 two-column grid with 40px gap. At <768px: the panel becomes a full-width overlay covering everything below the top nav, with body scroll locked. The panel has a sticky-bottom chat composer (textarea + Plus attach button + Stars02 send button) — non-functional stub. Closing via X restores the normal right rail layout.
_Affects: Messages page (layout swap, state), ask-claude-panel.tsx, CatalogCard onAskClaude prop, dashboard-layout.tsx (section header Ask Claude button)._

**D-344 — Header status simplified to "Test mode" / "Live" binary** (Date: 2026-04-11)
The status indicator in the app identity bar (DashboardLayout header row) now shows only two states: a yellow dot + "Test mode" for all pre-live states (Building, Pending, Extended Review, Rejected) and a green dot + "Live" for Registered. The previous per-state labels ("Registration in review", "Extended review", "Registration rejected", "Your app is live") are removed. Onboarding state shows no indicator (returns null).
_Affects: dashboard-layout.tsx StatusIndicator component._

**D-345 — Messages page is the workspace root at /apps/[appId]** (Date: 2026-04-14)
The messages page moves from `/apps/[appId]/messages` to `/apps/[appId]` — messages is the sole workspace and doesn't need a named segment. `/apps/[appId]/messages` now exists as a server-side `redirect()` stub for backward compatibility with any outstanding links. All internal navigations (wizard Continue → workspace, Your Apps card, Settings "Back to …", get-started "View on dashboard", post-auth push, proto nav helper, top nav dev state switcher) updated to the root route. DashboardLayout's `isMessagesPage` check — which controls whether the Setup instructions toggle + Settings link render in the header row — switched from `pathname.endsWith("/messages")` to `pathname === /apps/${appId}` (exact match so /settings and other subroutes don't inherit it). The Register page's back link label also updates from "Back to Overview" to the app name (e.g., "GlowStudio"). Reason: the "/messages" segment was noise — there's only one workspace page, and the /apps/[appId] root was already redirecting to it. Reversing this decision means restoring the extra segment everywhere. When adding new app-scoped pages (future Analytics, Billing, etc.), they should be subroutes of /apps/[appId]/; the workspace itself stays at root.
_Affects: app/apps/[appId]/page.tsx (workspace), app/apps/[appId]/messages/page.tsx (redirect), layout.tsx router.replace targets, dashboard-layout.tsx isMessagesPage check, top-nav.tsx isAppRoute regex + dev state switcher, wizard-layout.tsx backHref, proto-nav-helper.tsx nav items, apps/page.tsx card link, auth/page.tsx post-download push, get-started transition, settings back link, register back link._

**D-346 — Rate limiting is a launch requirement, not backlog** (Date: 2026-04-14)
The proxy must enforce per-developer rate limits before any live traffic flows. Without rate limits, a buggy loop in a developer's app could blast thousands of messages, burn through their cap, trigger carrier complaints, and damage the master carrier account's trust score. The 20,000/day abuse ceiling (PRICING_MODEL.md) is an emergency safety net, not a substitute for real rate limiting. Specific limits (per-second caps, per-recipient-per-day, queue-and-delay vs reject behavior) will be defined when building the API endpoint (Priority 5), but the commitment is: rate limiting ships at launch. No live traffic without it.
_Affects: API endpoint design (Priority 5), proxy pipeline (D-309), PRICING_MODEL.md abuse safeguard._

**D-347 — Account-level vs app-level field split on Settings** (Date: 2026-04-14)
Email and payment method are account-level — shared across all apps, managed on the account settings page (accessed via avatar dropdown in top nav, not on the per-app Settings page). Auth phone (used for login OTP) is account-level. The per-app test phone (used for receiving test messages) is already on the workspace via the Testers card — it is not a Settings field. Notification phone defaults to the auth phone but can be overridden per-app in the future. In the current prototype, Settings still shows email and personal phone because the account settings page doesn't exist yet — but production Settings should only show app-scoped fields: business name (read-only post-registration), category (read-only), registration status, API keys, billing, and notification toggle. Account-level fields move to the account page when it's built.
_Affects: Settings page (PRD_SETTINGS), account settings page (future), top nav (avatar dropdown), multi-project architecture (PRD_11)._

**D-348 — Notification triggers: what warrants a text vs email vs silent handling** (Date: 2026-04-14)
Text notifications (opt-in via Settings toggle): registration approved, registration rejected, payment failed (day 1 of grace period), account suspended (messaging stopped). Email notifications (always on, no toggle): registration submitted confirmation, registration approved (with detail), registration rejected (with reason and next steps), payment failed (days 1, 3, 6), account suspended, welcome/signup confirmation. Silent handling (no notification, no developer action needed): rate limiting (messages delayed, not dropped), quiet hours enforcement (messages queued for delivery after quiet hours end), opt-out received (proxy blocks future sends automatically), approaching message cap (dashboard indicator only — overage auto-scales per D-321). The test for a text: would the developer be upset tomorrow if they found out today and we didn't tell them? If no, it's email or dashboard only.
_Affects: Settings notifications section, email template system, proxy behavior, API response design._

**D-349 — API key prefix: `rk_test_` (user-facing), `environment = 'sandbox'` (DB/code)** (Date: 2026-04-17)

User-visible API key prefix for test-mode keys is `rk_test_`. Live keys are `rk_live_`. Internal column `environment` on `api_keys` and `messages` tables retains `'sandbox' | 'live'` enum values per the user-facing vs internal naming rule — the boundary layer translates at key generation time.

Reason: `rk_test_` is shorter, matches the current product voice ("test mode" in UI copy), and is already the prefix committed to in PRD_SETTINGS_v2.3. PRICING_MODEL.md and legacy PRD_04 previously referenced `rk_sandbox_` — those are stale and will be swept as a follow-up. DB `environment = 'sandbox'` stays because renaming a column is a code-only refactor with no operational payoff (per the code-only-renames-are-not-decisions rule).

Follow-up (not part of this decision): sweep `rk_sandbox_` references in PRICING_MODEL.md and any prototype strings. Scoped as a separate PROTOTYPE_SPEC / docs cleanup task.

**D-350 — Variables are atomic tokens in message edit mode** (Date: 2026-04-17)

In the message row edit mode, template variables (business name, vertical, recipient-specific fields like date and time) render as atomic, indivisibly-selectable tokens. Visual styling is color-only — the same purple text used in non-edit preview mode. No pills, brackets, or visual weight that interferes with reading the message as an end user would.

Mechanically: the user can place the cursor before or after a token, select it as a whole unit, or delete it entirely with backspace. They cannot place the cursor inside a token and corrupt it into static text. If a required variable is deleted, the existing red error state fires.

Reason: visibility and protection are separate problems. Purple color alone solves visibility — the edit mode just needs to inherit the treatment already used in preview. Protection is the real risk: date and time are per-recipient variables, and the current textarea lets a user silently turn "Mar 15, 2026" into literal text that sends to every recipient regardless of their actual appointment. Atomic tokens prevent that class of error without introducing a heavier UI.

Implementation requires a contentEditable editor (Tiptap, Lexical, or Slate). Library choice is a separate decision CC makes when this task becomes active.

**D-351 — Custom message delivery: generic SDK method with slug, plus manual Quick Send** (Date: 2026-04-17, revised 2026-04-18)
Custom messages created in the workspace get a stable, immutable slug at creation time. Each namespace exposes one generic SDK method — `relaykit.appointments.sendCustom(slug, { to, data })` and equivalents per namespace — that the developer (or their AI tool) wires into their app the same way they wire built-in methods like `sendConfirmation`. The developer supplies recipient phone numbers from their own customer database; RelayKit's server uses the slug to look up the user-authored template and composes the message at send time.
Manual Quick Send to verified Testers also works for custom messages, for previewing or one-off sends.
Reason: custom messages need to reach real customers to be useful. A salon owner creating a "Holiday hours" announcement needs to send it to their actual customer list, not their 5 verified Testers. The generic-method-with-slug pattern delivers this without per-message SDK regeneration or code generation pipelines. Slug-to-template routing is server-side; the SDK stays statically declared (D-330 preserved).

**D-352 — Custom messages classified by content at authoring time, not user self-selection** (Date: 2026-04-17)

When a user creates or edits a custom message, the system classifies it as transactional or marketing based on real-time content analysis at authoring time. The user does not self-classify. If marketing-class content is detected and the user does not have marketing messages enabled, Save is blocked with a clear explanation and a path to add marketing.

Reason: matches the existing principle that compliance enforcement collapses to authoring time (no non-compliant message can reach production). Asking users to self-classify invites mistakes and bad classifications that carriers would later reject. The system is already doing real-time compliance checking — campaign-class classification is the same primitive.

**D-353 — Variable insertion affordance in all message edit states** (Date: 2026-04-17)

Every message edit state (built-in and custom) includes a variable insertion affordance — a control that surfaces the variables available for that message and inserts them into the editor at cursor position as atomic tokens (per D-350).

Variable scope is method-specific: each SDK method's `data` shape determines what's insertable for that message type. `sendConfirmation` exposes name/date/time/business; `sendReminder` adds time-until. For custom messages, the available variable set defaults to the intersection of variables shared across all methods in the parent namespace.

Reason: D-350 prevents corruption of variables already in the editor, but a user still needs a way to ADD them — without an insert affordance, the only way to get a variable into a custom message is copy-paste. For built-in edits, the affordance also enables recovery: a user who deletes a variable then reconsiders can re-insert without abandoning their other edits via Restore. Method-specific scope matches the per-method data shape declared in the SDK and avoids the failure mode where a user inserts a variable the SDK call won't actually populate at send time.

**D-354 — Tiptap v3 chosen for message editor** (Date: 2026-04-18)

Tiptap v3 is the contentEditable library for the message editor (per D-350's requirement to use one of Tiptap, Lexical, or Slate). React 19 support, first-class atom node for variable tokens, strongest community examples for mention-pattern UIs. Lexical and Slate considered and rejected on ergonomics: Lexical's schema model is less mature for this specific case (plain-text body with inline atomic tokens), and Slate has the highest DIY footprint with the weakest maintenance story.

Dependencies added: `@tiptap/core`, `@tiptap/pm`, `@tiptap/react`, `@tiptap/extension-document`, `@tiptap/extension-paragraph`, `@tiptap/extension-text` (all v3.x). No `StarterKit` — SMS messages don't need headings, lists, or marks, so we wire only the three base nodes plus our custom `VariableNode`.

Design doc: `docs/superpowers/specs/2026-04-17-message-editor-tiptap-design.md`.

**D-355 — Variable grammar: canonical base form + context-aware rendering** (Date: 2026-04-18)

Status: Active

Decision: Variables fall into two categories based on content type, and the canonical-form rules apply only to common nouns.

Common nouns (e.g., service_type) store a single canonical form: lowercase, singular. The renderer handles capitalization and pluralization at render time.

Proper nouns (e.g., business_name, customer_name) store and render exactly as provided. No case transformation, no pluralization. :plural is a no-op on proper nouns.

Qualifier syntax: {variable} renders the stored form, auto-capitalized when it falls at sentence start (common nouns only — proper nouns are already cased). {variable:plural} renders the plural form for common nouns. Other qualifiers may be added later if concrete needs emerge.

Migration: Existing state.serviceType values normalize to canonical form. Templates referencing plural usage get :plural where appropriate. business_name and other proper-noun variables are unaffected.

Why not multiple stored forms per variable: Multiplies authoring surface and invites drift. Pushes grammatical choices onto every author instead of centralizing them in the renderer.

Scope at launch: English only. :plural is the only qualifier. No automatic article handling.

**D-356 — Custom messages require a business-name variable (compliance)** (Date: 2026-04-19)

Compliance enforcement on custom messages runs two rules: opt-out language (STOP + an exit word on the interpolated text, pre-existing) and presence of the category's business-name variable token on the raw template. Each rule surfaces as a separate red error row below the editor with its own Fix button. Save stays disabled until both pass.

The business-name variable is category-specific — `{app_name}` for appointments/verification, `{business_name}` for orders/support/marketing/internal/waitlist/exploring, `{community_name}` for community. Resolved at call time via `getPrimaryBusinessVariable(categoryId)` in `lib/catalog-helpers.ts` so the chosen key always exists in the category's registered variables and renders as a chip rather than falling through to plain text.

Reason: carrier compliance expects recipients to know the sender identity. Opt-out alone satisfies the exit path; business-name satisfies the identity disclosure. Requiring the variable TOKEN (not a literal name string) preserves deterministic template rendering (D-04) — the chip interpolates at send time against current session state, so renaming a business later re-interpolates without template rewrites. Fix prepends `{businessKey}: ` to the trimmed-start template.

Affects: `prototype/components/catalog/custom-message-card.tsx` (`checkCustomCompliance`, `handleFixBusinessName`), `prototype/context/session-context.tsx` (pre-populated template in `addCustomMessage`), `prototype/lib/catalog-helpers.ts` (new `getPrimaryBusinessVariable` helper).

**D-357 — Lock-while-authoring on never-saved custom rows** (Date: 2026-04-19)

While a never-saved custom message (empty slug) is in edit state, every affordance on the Messages page that would transition the edit context is disabled with a "Save or cancel the current message first." tooltip: the `+ Add message` button, every other row's pencil/preview/activity icons, and the page-level Ask Claude button. The authoring row itself stays fully interactive — Save, Cancel, Fix, + Variable, Ask AI, editor all active.

Reason: the first implementation of this protection auto-discarded the pending custom on navigation away (any `requestEdit` / `requestMonitor` / `openAskClaude` / `handleAddCustom` call while an unsaved custom was open). That silently dropped user work when the user didn't realize they'd triggered a transition (clicking another row's edit icon, a tone pill, a + Add). Silent discard violates the "never lose user work" principle. Disabling the triggers makes the state legible — grayed affordances + tooltip tell the user they need to commit or explicitly cancel before proceeding. The auto-discard helper was removed as dead code once the lock replaced it.

Alternatives rejected: auto-discard-on-navigation (tried, silently lost work); auto-save-on-navigation (violates the "never save something you didn't mean to save" norm for compliance-gated content); modal confirmation on every transition (nag-heavy for a flow the user will use repeatedly).

Affects: `prototype/app/apps/[appId]/page.tsx` (`hasUnsavedCustomOpen` derivation, defensive guards in `request*` / `handleAddCustom` / `openAskClaude`, disabled + tooltip on `+ Add` and Ask Claude buttons), `prototype/components/catalog/catalog-card.tsx` (`locked` prop, tooltip swap via existing `showEditTooltip` / `showMonitorTooltip` infra), `prototype/components/catalog/custom-message-card.tsx` (`locked` prop, new tooltip infra mirroring CatalogCard).

**D-358: Sunset /src codebase; rebuild on /api + Sinch**
The Twilio-era /src codebase is retired. Capabilities it currently provides (carrier registration pipeline, inbound message handling, Stripe billing webhooks, dashboard, sandbox key management, compliance monitoring) are being rebuilt on /api with Sinch across MASTER_PLAN Phases 2–5. /src will not be maintained, federated with /api, or preserved as a fallback.
Reasoning: /src is built around Twilio's registration timelines (weeks), which are incompatible with RelayKit's core positioning promise of fast registration (~3 days via Sinch). Federating would require maintaining two carrier integrations indefinitely; preserving /src as a fallback would compromise the speed claim the entire product is built on. The audit confirmed /api is the cleaner foundation and that rebuilding the missing capabilities is feasible phase by phase. Corner-cutting by keeping old Twilio code alive would create the exact kind of confusion and technical debt Joel has explicitly prioritized avoiding.
Consequences:

/src enters feature-freeze immediately. No modifications.
/supabase/ (root-level migrations) will be archived in Phase 3.
Registration, inbound, Stripe webhooks, dashboard get rebuilt on /api across Phases 2–5.
Twilio column naming in migrations gets renamed to carrier-agnostic equivalents during Phase 3.


**D-359: MASTER_PLAN.md adopted as canonical launch plan**
MASTER_PLAN.md v1.0 (dated 2026-04-20) is adopted as the canonical holistic plan guiding all work through launch. The ten-phase structure, North Star, ranked customer values, working principles, out-of-scope list (Section 16), and risk register (Section 17) are the reference for scope decisions, phase prioritization, and conflict resolution.
Reasoning: Without a single holistic plan, each chat operated on partial context and ad-hoc priorities, causing scope drift and duplicated planning work. The audit surfaced the magnitude of rebuilding cleanly on Sinch and the need for disciplined phase-by-phase proving-before-building. The master plan consolidates this into one document Joel can sniff-test and PM reads at every session start.
Consequences:

Every chat begins with reading MASTER_PLAN.md alongside REPO_INDEX and handoffs.
Active work references the active phase, not a parallel priority list.
Scope additions require either fitting an existing phase, being added to BACKLOG.md, or triggering a MASTER_PLAN amendment.
Section 16 (out-of-scope) is the scope-creep firewall.


**D-360: OTP / Verification available across all verticals as built-in auth primitive, AND as its own dedicated vertical**
The Verification use case remains selectable as a dedicated vertical for developers whose entire SMS use is auth-related (login OTP, signup code, password reset, MFA challenge, new device alert — the full auth message family). Additionally, every other vertical automatically includes a basic verification-code capability in its SDK namespace (e.g., relaykit.salon.verifyCode()), so developers whose app needs OTP alongside their business vertical don't have to register a second campaign or pick between categories.
Reasoning: Verification is already scoped as a vertical with templates, SDK methods, and UI card built. But OTP is also an auth primitive that most apps need alongside their business use case — forcing a salon developer to choose between "Salon" and "Verification" would be absurd and would conflict with D-333 (one transactional + one marketing per project). Carriers universally allow verification codes under any transactional registration, so no separate registration is required. Treating it as both a vertical and a built-in primitive matches how developers actually think about it: a dedicated auth app picks Verification; every other app gets OTP as a standard capability.
Consequences:

Phase 6 (vertical hydration) fixes Verification as a fully reachable vertical end-to-end.
Every non-verification vertical gets a verifyCode() method added to its SDK namespace (trivial additions; most data already exists).
OTP counts against monthly message allowance (no special pricing).
Default code length: 6 digits. Default TTL: 10 minutes. Rate limiting: to be set during implementation per Phase 2/Phase 6 work.


**D-361: Review request templates ship at launch as template additions within applicable verticals, using developer-supplied review URLs**
Review request messages are a template type added to verticals where post-service review collection is a natural pattern: salon, dental, home services, auto services, fitness/wellness, tutoring. They are not their own vertical. The review URL is a developer-supplied variable — RelayKit does not own the review destination or integrate with specific review platforms. Developers can pass Google Business Profile links, Yelp links, Podium links, Birdeye links, or their own landing pages; RelayKit just delivers the SMS. Review requests ship as transactional messages at launch. Sentiment branching (routing high-rating customers to public reviews and low-rating customers to private feedback — Podium's controversial feature) is explicitly not shipped at launch.
Reasoning: Review requests are a high-value, recognizable pattern for local-business verticals. Bundling them as template additions respects D-333 (one transactional + one marketing per project) — a salon can do appointment reminders AND review requests from the same registration. Keeping the review URL as an opaque developer-supplied variable avoids building review-collection infrastructure (which is its own product category) and positions RelayKit as complementary to existing review platforms rather than competitive. Transactional classification aligns with CTIA guidance that post-service review requests to existing customers are related to the completed transaction. Sentiment branching deferred because (a) it raises ethical questions around review gating, (b) it requires review-collection backend we don't have, and (c) the core value is captured by the well-timed SMS alone.
Consequences:

Each applicable vertical's SDK namespace gets a reviewRequest(...) method with customerName, reviewUrl, and other variable parameters.
Default canonical template: "Hi {customerName}, thanks for visiting {businessName} today! If you had a good experience, we'd really appreciate a quick Google review: {reviewUrl}" — editable on website with compliance checker.
Developer controls when to fire (no scheduling infrastructure built into RelayKit at launch).
Marketing docs and site copy position reviews as vertical-native capability, not a separate product.

**D-362 — SDK `SendResult` shape canonical** (Date: 2026-04-21)
The shipped `SendResult` type in `/sdk/src/types.ts` is canonical: `{ id: string | null; status: 'sent' | 'queued' | 'blocked' | 'failed'; reason?: string }`. In graceful mode (default per D-277), failure is encoded as `id: null` with `status: 'failed'` or `'blocked'` and a populated `reason`. In strict mode (opt-in per D-277), failures throw `RelayKitError` instead. This pins the shape that shipped in `relaykit@0.1.0` so SDK documentation, README examples, and the `/api` response contract all resolve to one structure.
Reasoning: SDK_BUILD_PLAN.md §8 previously described a different shape (`{ success: true, messageId, status }` for success; `{ success: false, error: { code, message } }` for failure) that never shipped. The shipped code has 30 namespace methods and a 235-line test suite built around the current shape, plus a packed `relaykit-0.1.0.tgz` artifact; rewriting the code to match the old spec would be a breaking change to a contract no external caller depends on yet, with no product benefit. D-277 already uses the shipped shape in its compliance-block example (`{ id: null, status: 'blocked', reason: 'recipient_opted_out' }`), so this decision is consonant with D-277 — it just makes the full shape explicit. No supersession of D-277 required; D-362 is purely additive.
_Affects: `/sdk` source (no change), SDK_BUILD_PLAN.md §6 decisions list, Phase 8 README / AGENTS.md spec, `/api` POST /v1/messages response contract._

**D-363 — Opt-in disclosure uses generic language, not enumerated message types** (Date: 2026-04-24)
Opt-in disclosure copy uses short generic language (e.g., "you agree to receive automated texts from {business}") rather than enumerating each implemented message type. The enumeration pattern originally proposed in D-101 proved unnecessary — generic language is the industry norm and carrier-acceptable. Disclosure is hidden from the Messages workspace and onboarding flow to reduce clutter; it surfaces in developer-facing documentation (SMS_GUIDELINES.md equivalent) using the same simple language.
**Supersedes:** D-101
**Affects:** Opt-in form component, developer-facing documentation, onboarding flow.

**D-364 — SMS compliance alert feature deferred until evidence of need** (Date: 2026-04-24)
The SMS compliance alerts feature (real-time text notifications when a flagged message is caught) is not built at launch. RelayKit's preventive model (compliance enforcement at authoring time per D-293) aims to eliminate runtime compliance problems entirely, making real-time SMS alerts unnecessary by design. If post-launch evidence shows compliance issues reaching production despite the preventive model, the feature gets revisited. Email notifications per D-348 remain the baseline channel.
**Supersedes:** D-239, D-201
**Reasoning:** D-293 collapsed all compliance enforcement to authoring time. A runtime-notification system only justifies itself if the preventive layer fails — building it preemptively contradicts the premise of D-293 and adds Settings-page complexity for a capability that may never fire. Defer until real-world signal demands it.
**Affects:** Settings page SMS alerts toggle, notification triggers (D-348), Overview page onboarding prompts.

**D-365 — Carrier-defensible consent language at point of phone collection** (Date: 2026-04-25)
The RelayKit prototype displays carrier-defensible SMS consent language at every surface that collects a phone number. The language must include four elements: (1) statement that providing the phone number constitutes consent to receive messages, (2) sender identification (RelayKit), (3) message/data rates disclaimer, (4) STOP and HELP keyword handling. Exact wording is a copy choice subject to Voice Principles v2.0 and lives in PROTOTYPE_SPEC; the four required elements are the architectural commitment. The current `/start/verify` screen displays: "We'll text you a verification code. By verifying, you agree to receive test messages at this number when you trigger them. Standard rates apply. Reply STOP anytime, HELP for help."
**Supersedes:** none
**Reasoning:** Carriers verify on-screen consent declarations during 10DLC campaign review. Without on-screen consent language, RelayKit's opt-in story to carriers depends entirely on the textual description in the campaign registration, which is a weaker compliance posture than declaring + showing. This decision is the RelayKit-as-sender parallel to D-172 and D-363's developer-as-sender CatalogOptIn disclosure lineage — same compliance principle ("show the consent language at the point of collection"), different sender, different surface. This decision applies forward to any future surface that collects a phone number — test phone add, end-recipient phone collection in customer apps via SDK, account recovery, etc. The exact wording is mutable per Voice Principles; the four required elements are not.
**Affects:** prototype/app/start/verify/page.tsx, future phone-collection surfaces, PROTOTYPE_SPEC.md, campaign registration opt-in declarations