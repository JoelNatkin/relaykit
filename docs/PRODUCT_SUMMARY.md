# RelayKit Product Summary

> **Purpose:** Customer-experience-oriented summary of RelayKit — what a customer actually experiences end to end. CC translates PROTOTYPE_SPEC into this; PM reads, doesn't edit.
>
> Not for: implementation details (spec docs), screen-level UI (PROTOTYPE_SPEC), decision rationale (DECISIONS).

## PM-facing customer experience reference

> **Maintenance note:** Updated when product behavior changes substantively — new screens, new flows, removed features. Not updated for copy or layout tweaks (those remain a `PROTOTYPE_SPEC.md` concern). `PROTOTYPE_SPEC.md` is the implementation-detail source of truth; this file is the evergreen PM-facing reference.
>
> **Last reviewed:** 2026-05-14

---

## 1. What RelayKit is

RelayKit is an SMS compliance and delivery service for indie developers. The customer is a developer building an application that needs to send transactional text messages — appointment reminders, verification codes, order updates, support replies, internal alerts. The customer integrates RelayKit by handing their AI coding tool an SDK, an `AGENTS.md`, and a small set of pre-written messages. RelayKit handles carrier registration, opt-out enforcement, message scanning, and delivery. The customer never reads a paragraph about 10DLC, TCR, or carrier rules in the product. They pay $49 to register, $19/month for service (or $29/month if they add marketing messages), and get a full refund if carriers reject their registration.

---

## 2. Customer journey

The customer arrives at `relaykit.ai` (the marketing site), engages the configurator on the home page to pick categories and preview/customize messages with their own business name and website, and clicks through to start onboarding. Onboarding is a six-step wizard that captures vertical, business name (and optional EIN), industry/service type, website, free-text context, and a verified phone number. After phone verification, the customer reviews what they're about to build, creates an account (email + OTP), and lands on a Get-Started screen that hands their AI coding tool a pre-populated prompt. Clicking through transitions the workspace from Onboarding to Building. From Building, the customer can submit registration ($49 fee charged at submit), which moves the workspace to Pending. Approval ("a few days" — never quoted in days) transitions to Registered, where the customer's app is live and the workspace shows delivery metrics, message editing, custom-message authoring, an Ask-Claude assistant, and a marketing-message upsell. Settings and billing live as child pages reachable from a gear icon and the top-nav avatar.

---

## 3. Pre-auth surfaces + marketing-site reference

> **Architecture note (post 2026-05-14):** All public marketing surfaces live on the separate `/marketing-site/` Next.js app at `relaykit.ai`. The `/prototype/` app — which models `app.relaykit.ai` (the post-signup workspace) — no longer renders any marketing pages. The prototype's pre-existing marketing home (`/`), `/sms/[category]` category landing, public messages page, and `/compliance` explainer were all archived across two waves (2026-05-13 bulk archive + 2026-05-14 marketing-surface migration). See `prototype/archive/README.md` for the inventory.

The customer-experience side of the marketing surface — what visitors see at relaykit.ai before they engage — is described against the marketing-site implementation in `PROTOTYPE_SPEC.md` §"Production Marketing Site — relaykit.ai". The condensed shape: a 6-section home page (hero, configurator, build it, test it for real, pricing + paperwork, closing CTA), legal docs (Terms, Privacy, Acceptable Use), a waitlist signup flow (`/start/verify` + `/start/get-started`), and a "we'll be ready soon" `/signup` placeholder. The configurator on the home page is the central conversion surface — customers pick categories and tones, see their messages render live, and click through to the waitlist flow.

### 3.1 Sign-in landing — `/sign-in` (prototype, placeholder)

The only prototype-side route reachable without an authenticated session (besides the root redirect, which sends visitors to `/apps` or `/sign-in` based on auth state). A standalone email → OTP form ported from the now-dormant SignInModal, wrapped in a centered card layout. Placeholder pending the future auth refactor (Supabase social providers, UI redesign), which will replace both this page and the dormant modal. Production behavior — the actual sign-in surface a customer reaches at `app.relaykit.ai/sign-in` — will be shaped by that refactor, not this placeholder.

### 3.2 Archive pointers (historical)

- **Marketing home** — archived 2026-05-14 from `prototype/app/page.tsx`. Replaced in-place by the auth-aware root redirect. Anchors retained for history: D-219, D-216, D-220, D-241.
- **Use-case landing — `/sms/[category]`** — archived 2026-05-14. Anchors: D-217, D-224 (playbook diagram, since moved to `marketing-site/components/playbook-flow.tsx` as preservation per Phase 2a / D-384); D-230, D-231, D-91, D-106 (rest of the page).
- **Public message library — `/sms/[category]/messages`** — archived 2026-05-13. Anchors: D-217, D-223, D-224 (playbook); D-184, D-185 (personalize); D-187, D-188 (template/preview); D-182 (post-download band).
- **Compliance explainer — `/compliance`** — archived 2026-05-13. Canonical customer-facing compliance content lives on `marketing-site/`. The per-customer "msgverified.com" compliance site referenced in MASTER_PLAN §14 remains a Phase 10 deliverable — see §10 below.

---

## 4. Onboarding wizard — `/start/*`

Six steps. Lives outside `/apps/` because the app identity does not exist yet. TopNav is wordmark-only on the picker; a vertical pill appears next to the wordmark on subsequent steps. Layout is a centered 540px column with optional ← Back link and a full-width bottom Continue button. State persists in `sessionStorage` under key `relaykit_wizard`.

**Step 1 — Vertical picker (`/start`).** "What's the main reason your app sends texts?" 2×4 grid of cards: Appointments, Verification codes, Order updates, Customer support, Marketing, Team alerts, Community, Waitlist. Whole card is the click target.

**Step 2 — Business name + EIN (`/start/business`).** "What's your business called?" Business name input (autoFocus). EIN section below: collapsed by default for transactional verticals (toggle "I have a business tax ID (EIN)"); expanded by default for marketing-primary. EIN input live-formats `XX-XXXXXXX`. Verify button runs a two-phase stub ("Verifying…" → "Checking sources…"). On success, an identity card appears (legal name, address, entity type · state) with a "This is my business" checkbox. Anchors: D-302, D-303.

**Step 3 — Service context (`/start/details`).** "Tell us about your business." Industry dropdown (11 options) → service-type input (placeholder is industry-specific). Appointments only; other verticals will route differently as they hydrate. **TBD:** Step 3 routing for non-Appointments verticals is implied but not yet specified.

**Step 3b — Website (`/start/website`).** "Do you have a website?" Optional URL input. Skip link below Continue advances without saving.

**Step 3c — Context (`/start/context`).** "Anything else we should know?" Optional 4-row textarea. Skip link below Continue advances.

**Step 4 — Phone verification (`/start/verify`).** "Verify your phone number." 400px column. `+1` prefix pill + phone input + Send code button. Below the input, in small gray type, the carrier-defensible consent disclosure (D-365 — required four elements: that providing the number is consent, sender identification, rates disclaimer, STOP/HELP keywords). On send, advances to a 6-digit OTP entry with 60-second resend cooldown and "Use a different number" link. On verification, shows a green check + "Verified · +1 (555) 123-4567" + Change link. Continue advances to `/apps/glowstudio/messages` (hardcoded in prototype).

What RelayKit auto-provides vs. what the customer enters: vertical (customer picks); business name (customer enters); EIN + business identity (auto-populated on verification, customer confirms); industry + service type (customer picks/types); website (customer types or skips); context (customer types or skips); phone number (customer enters and verifies). Vertical-to-carrier-use-case mapping is internal and never surfaced.

---

## 5. Account creation

The wizard ends in three short steps that establish the customer's account and trigger the workspace state transition.

**Messages-page review (`/apps/[appId]/messages` in Onboarding state).** The same workspace URL renders in wizard-layout while `registrationState === "onboarding"`: 540px column, no right rail, no metrics, message cards in template-preview mode (no Send icons, no edit affordance), heading "Here's what your app will send.", dual Continue buttons (header top-right + below content). Anchors: D-328, D-318, D-317, D-345.

**Ready (`/apps/[appId]/ready`).** "You're set" review screen. Five `CheckCircle` benefit bullets, pricing breakdown ("Free now, then $49 + $19/mo after approval"), single "Create account" CTA. Anchors: D-329.

**Signup (`/apps/[appId]/signup` → `/signup/verify`).** 400px column. Email input → "Send code" → 6-digit OTP entry. Auto-submits on the sixth digit. Inline ← Back link instead of a header back/continue. Signing up does not change `registrationState`; the customer is still in Onboarding. Anchors: D-323.

**Get Started (`/apps/[appId]/get-started`).** Standalone page (no layout wrapper). "Start building" with three numbered cards (npm install / API key / AI prompt), tool logo row, "View on dashboard" CTA. Clicking the CTA fires `setRegistrationState("building")` and routes to the workspace root. The pre-populated AI prompt is built from wizard data per D-331 (replaces the prior SMS_GUIDELINES.md concept). Anchors: D-322, D-325, D-331.

**Round-trip OTP test (activation moment).** As part of the get-started flow, the customer receives a verification SMS at their RelayKit-account verified phone, enters the code, and sees a green-check confirmation ("Verification works. You're ready to integrate."). This is the proves-it-works loop before any other integration work — the activation milestone in the onboarding funnel. Beta-restricted to RelayKit-account-holder verified phones. Full path in VERIFICATION_SPEC §9. Anchors: D-369, D-370.

---

## 6. Workspace — pre-registration (Building state)

Workspace root is `/apps/[appId]` and renders the Messages page (D-345, D-332). No tab bar — Settings is a child page reached via a gear icon in the header. The status indicator dot is hidden in Building (no "live" semantics yet).

What the customer sees on the Messages page: the Verification panel above the message stack (see §9), the six built-in message cards for their vertical (read-only by default; pencil affordance enters inline edit), an Instructions panel (toggleable, off by default in non-onboarding states), an Ask Claude button (panel collapses inline; overlay on mobile), and a right rail. Right rail in Building: a registration CTA card ("Start registration →") and a Preview list card (up to 5 test phones with Edit/Delete; Invite form collapses on success; disabled when full).

What the customer does: edits messages (Tiptap editor, tone pills Standard/Friendly/Brief/Custom, "+ Variable" popover, compliance hints, `Fix` button); adds custom messages via "+ Add message" (slug auto-generated kebab-case from name with collision suffix); test-sends to preview-list recipients (Activity icon opens Test & debug panel — D-341); asks Claude for help. Anchors: D-326 (Building two-column overview), D-341, D-342, D-343, D-350 / D-353 / D-354 (variable tokens), D-351 (custom messages), D-356 (custom compliance rules), D-357 (lock-while-authoring).

---

## 7. Registration submission

The Building-state right-rail "Start registration →" card opens a standalone flow at `/apps/[appId]/register`. It is not part of the wizard.

**Form (`/apps/[appId]/register`).** 640px left-aligned column. "Register your app." Info callout explaining what the carrier match looks for. `BusinessDetailsForm` with Zod validation: business name, description, EIN, address, phone, email, etc. Email is pre-filled. Continue is always active; on click, validates all fields or scrolls to top with inline errors. Form data persists in sessionStorage. Prototype state cycler (Empty / Pre-filled). Anchors: D-225.

**Review (`/apps/[appId]/register/review`).** Two-column. Left: "Your details" card with an Edit link back to the form. Right: "What happens next" card (3 steps). Pricing summary ($49 one-time). Monitoring-consent checkbox. Final "Start my registration — $49" CTA. On submit, the workspace transitions to Pending. Anchors: D-233.

What the customer does: fills the form, reviews, checks the consent box, clicks the CTA, and pays $49 once. RelayKit submits the brand and (if applicable) the campaign to Sinch; multiple categories submit simultaneously per D-311. **TBD:** Registration is confirmed to submit via Sinch API at production. The customer-facing form itself has not been reviewed in many sessions and is due for a design round — particularly in light of learnings from running Experiments 3a (brand registration) and 3b (campaign registration) directly through the Sinch dashboard. Form structure, field set, and step decomposition are subject to revision based on the field-by-field reality of Sinch's actual brand and campaign submission shapes.

---

## 8. Workspace — Pending / Extended Review / Rejected

The dashboard layout is the same as Registered (header with app name + category pill, status indicator dot, Messages page in the center) but the right rail and the status text vary.

**Pending.** Status: amber dot + "Registration in review." Right rail shows a per-message-type registration tracker (Appointments + optional Marketing rows with submitted-date and status badges) and an optional marketing-upsell card (if EIN present and marketing not already added). Marketing messages remain visible and editable in Pending state per D-336. Anchors: D-338, D-339, D-340.

**Extended Review.** Status: amber dot + "Extended review." Same right-rail content as Pending. The label is intentional per D-202 — "Extended review" frames resubmission as a normal continuation, not a failure. **TBD:** What the customer hears (email? in-app banner?) when carriers ask follow-up questions during Extended Review. Email integration is Phase 10 work; in-app banner copy not yet specified.

**Rejected.** Status: red dot + "Registration rejected." Right rail shows rejection details and remediation guidance ("Carriers flagged your business description. Here's what to fix."). Plan tier shows "Test mode — Free" with "$49 refunded · [date]" line. The customer can edit and resubmit; sole-prop registrations and HEALTHCARE-vertical attempts are declined upstream (D-18) before reaching Rejected.

Across all three states: customer keeps editing messages, can still use Ask Claude, and can still test-send to preview-list phones.

---

## 9. Workspace — post-approval (Registered state)

Status: green dot + "Your app is live." This is the operational dashboard.

**KPI row (only in Registered).** Three cards across the top of the Messages page: Delivery % (with breakdown drill-down modal), Recipients count, Compliance % (or "All clear" / "Has alerts" — see §10).

**Verification panel.** Above the Messages list. Distinct visual treatment from message cards — this is a panel for the included Verification feature, not a message in the per-vertical catalog. Present across Building, Pending, Extended Review, Rejected, and Registered states (no panel during the Onboarding wizard). Editable verification template with `{code}` required-and-immutable plus the existing canon-template compliance gates. Test-send affordance with round-trip code entry, beta-restricted to RelayKit-account-holder verified phones. Recent Activity rows capped at 5 (matches other message cards). The panel is the dashboard expression of "verification included with every vertical." Full panel scope, customizability rules, and out-of-launch-scope items in VERIFICATION_SPEC §7 + §8. Anchors: D-360, D-369, D-370, D-371.

**Messages.** Same six built-in cards as Building, plus any custom messages the customer has authored. Each card has two states: Monitor (read-only — current copy + recent test-send activity list + Test send / Ask Claude footer) and Edit (Tiptap editor, tone pills, variable popover, compliance hints, `Fix` button, Save/Cancel). Activity icon opens the Test & debug panel; clicking the body text doesn't enter Edit mode (deliberate — keeps the read state stable).

**Custom messages.** "+ Add message" creates a new card with a generated slug (kebab-case from name, numeric collision suffix). Customer authors body inline. Per-card kebab menu: Archive / Restore / Delete permanently. Archived messages live in a disclosure section at the bottom ("Archived (N)"). Anchors: D-280 (custom messages concept), D-351 (UI), D-356 (custom compliance rules).

**Ask Claude panel.** Sticky inline panel (desktop) or fixed overlay (mobile). Two modes: unfocused (general questions about the workspace) and card-focused (scoped to a specific message — "How do I make this less formal?", "Is this likely to be flagged?"). Anchors: D-343.

**Right rail.** Optional marketing-upsell card (if marketing not yet activated and EIN present), OR a marketing-registration tracker (if marketing is in-review/registered), OR nothing (if the customer dismissed and doesn't qualify). Below: Preview list card (same up-to-5-phones component as Building).

**Marketing upsell modal (D-254).** Full-screen overlay. Sticky header. Three state tabs (Info / In review / Active). Hero band, three message previews with Brand-first/Action-first/Context-first pills, numbered how-it-works, consent bullets, CTA to activate. Pricing: bumps service from $19/mo to $29/mo when marketing is added; no additional registration fee, since the original $49 covered both campaigns (D-320, D-334).

Anchors for this surface: D-150, D-345, D-332 (single-page workspace), D-339, D-340, D-254, D-344.

---

## 10. Compliance experience

Compliance is felt across two surfaces: the workspace KPI card (Registered only) and the message-edit hints (every state).

**Compliance KPI card (Registered).** Two faces: "All clear" (green dot, big % number, clean/blocked/warned breakdown) or "Has alerts" (amber dot, two summary rows with Fix / View action links). Clicking the card opens a full-screen detail modal with the flagged message preview, what triggered the flag, what to do, and a copyable AI prompt. Anchors: D-241, D-239.

**Message-edit hints (every state).** Inline indicators while editing (business-name presence, opt-out language presence, `STOP` / `HELP` keyword handling). The `Fix` button restores compliant default copy with a 1.5s async animation. Non-compliant messages cannot be saved (D-293 — compliance is enforced at authoring time, so non-compliant messages never reach production).

**Compliance modal block-state.** When a message would be saved with content that violates a rule, a block-state modal explains what's wrong and how to fix it. **TBD:** The current "Fix it with AI" prompt is marked NEEDS REVISION in PROTOTYPE_SPEC (lines 863–866) — it's being replaced with plain-text guidance per the kill-list voice rules. Pending design.

**Quiet hours and opt-out.** Enforced at the proxy layer, not in the customer's code. Marketing messages are blocked outside 8 AM–9 PM local time per D-309. Customer-authored opt-out copy remains required in message bodies (per the four-element disclosure pattern at point of phone collection, D-365).

**Per-customer compliance site (msgverified.com).** **TBD:** Phase 10 deliverable per MASTER_PLAN §14. Each registered customer would have a dedicated public compliance landing (privacy policy, terms, opt-in/out language, contact). Not yet built; Phase 10 work. Distinct from the canonical marketing-site compliance content at relaykit.ai (the prototype's old `/compliance` page is archived per §3.2 archive pointers).

---

## 11. How compliance is enforced across the customer journey

Compliance enforcement is not a single mechanism — it's three distinct mechanisms operating in three phases of the customer journey, anchored by separate decisions.

**Phase 1 — Pre-registration (sandbox / Building state).** Exploration phase. Customer authors and tests broadly; the constraint is structural, not content-based — sandbox sends route only to verified phones per D-298. No carrier scope committed yet. Marketing namespace is fully usable in sandbox per D-294 even before registration.

**Phase 2 — Registration (the locking moment).** RelayKit derives the TCR campaign shape from the customer's category selections and submits to Sinch. Multiple categories submit simultaneously per D-311 (no sequencing). Marketing auto-submits if used in sandbox, on-demand otherwise per D-294 — either way, marketing is always a separate TCR campaign per D-333. The submitted scope locks at this moment and becomes the operative compliance scope for everything that follows.

**Phase 3 — Post-registration (workspace authoring time).** Compliance enforcement collapses to the moment a message is saved per D-293; non-compliant messages cannot be saved, so they cannot reach production. Custom messages are classified by content at authoring time (not user self-selection) per D-352. Off-scope content routes to expansion, not refusal — when a customer's authored message reads as marketing on a transactional-only registration, the workspace surfaces "register a marketing campaign?" rather than blocking. Carrier-level drift detection (continuous AI-matching of live traffic against registered samples) catches what the workspace misses, but the design intent is that authoring-time classification keeps everything inside scope before the carrier classifier sees it.

---

## 12. App Settings — `/apps/[appId]/settings`

Reached via the gear icon in the workspace header (workspace page only — D-332). 600px max-width centered. Five collapsible card sections. Field-edit semantics gate on `registrationState`.

**Business info.** Read-only post-registration; editable in Building (name, category, EIN). EIN row (`EinRow`) shows masked digits with Edit/Add link or "Not on file" prompt.

**Registration.** State-aware card. Building: registration CTA. Pending / Extended Review: per-type tracker (Appointments + Marketing if applicable). Registered: status dot + approval date + assigned SMS number (D-207). Rejected: rejection details + resubmit affordance.

**API keys.** Test key (`rk_test_*` per D-349) always visible with copy button — sandbox keys are deliberately not regeneratable. Live key (`rk_live_*`) masked unless newly generated; Regenerate link opens a confirmation modal. Anchors: D-285, D-291, D-292.

**Billing.** See §14.

**Cancel plan.** Inline link at the bottom (text-tertiary, hover red). Opens a custom modal with a "Type CANCEL" text-input gate. Body copy: "Your plan will stay active through [date]. After that, live messaging stops but test environment stays available — your code, API key, and test setup aren't going anywhere." Cancel-plan button red, disabled until the input matches `CANCEL`. **TBD:** Implementation semantics behind the copy (does live messaging stop at end-of-period? does the test env survive across multi-month gaps?) — the copy is authoritative for now; backend behavior to confirm.

---

## 13. Account Settings — `/account`

Reached via the avatar dropdown in top nav. 600px column. Card-format sections. State-independent (consistent across all logged-in users). The "← Back to GlowStudio" link is hardcoded for the prototype.

**Login.** Email read-only + Change link. No phone for auth (D-59 — passwordless email only). The "Change" affordance for email is a no-op stub.

**Payment method.** Card on file (Visa ending in 4242 in the prototype) + "Manage billing" link. Link is a no-op pending Stripe portal handoff.

**Notifications.** Toggle + conditional reveal of a destination phone field. Off by default. Anchors: D-348 (email is the baseline notification channel); D-364 (real-time SMS compliance alerts deferred — not at launch).

**Delete account.** Red warning paragraph + Delete link. Delete opens a confirmation modal with a "Type DELETE" text-input gate.

**TBD:** Stripe billing portal handoff — the actual portal experience (what fields, what flows) isn't spec'd anywhere; Phase 10 work.

---

## 14. Billing

Pricing surfaces appear in five places, all stating the same facts.

**Marketing site (`relaykit.ai`) home page.** Single staged pricing card with two stages separated by a divider — Stage 1 "Build for free", Stage 2 "Go live for $49 + $19/mo." Below: fine print "Marketing categories add $10/mo. Volume pricing above 5,000 messages." Scope paragraph notes US/Canada at launch, no HIPAA/healthcare/enterprise. Right-column "We handle the paperwork." H2 + period-list of nouns + italic kicker "We read it so you don't have to."

**Ready page (account creation review).** Inline summary: free during build/test; $49 + $19/mo after approval.

**App Settings → Billing section.** State-aware. Building: "Plan: Test mode — Free / No credit card required." Pending or later: "$49 paid · [date]" line. Registered: "$19/mo / 500 messages included, then $8/500 / Next billing: [date] / Manage billing →" + divider + "Cancel plan" link. Rejected: "$49 refunded · [date]" + "Plan: Test mode — Free."

**Account Settings → Payment method.** Card on file + Manage billing link.

Pricing facts (numbers, refund policy, tier definitions) live in `docs/PRICING_MODEL.md` per REPO_INDEX "Canonical sources by topic" — this doc points, never restates. Decision anchors: D-298 (free-tier verified-only sends), D-304 (symmetrical pricing transactional/marketing), D-320 (single flat registration fee), D-321 (overage pricing policy), D-334 (marketing campaign bundled in registration fee), D-346 (rate-limit ceiling).

Stripe is the payment processor (managed-only at launch — no BYO carrier billing per MASTER_PLAN §16).

---

## 15. Key product principles

These are the principles that shape what the product feels like to the customer. The framing decisions below are some of the ones that most heavily shape product behavior — not a canonical list.

**RelayKit provides messages; the customer doesn't author them.** The six per-vertical built-in messages are pre-written, pre-approved, and ready to copy. Custom messages exist (D-280, D-351) but they're additive — not the default path. Onboarding is "pick a vertical and we hand you what to send," not "describe what you want to send and we generate it."

**Intake interrogates, doesn't offer free text.** The wizard asks specific questions (vertical, business name, EIN, industry, service type, website, context, phone) and does the inference internally (vertical → carrier use-case mapping, EIN → business identity, industry+service → message tone). The customer never sees TCR, 10DLC, or campaign-type vocabulary in the UI.

**Compliance is prevention, not policing (D-293).** Non-compliant messages cannot be saved at authoring time. There is no runtime block, no surprise rejection downstream, no compliance audit log surfaced to the customer. Authoring is the only gate.

**Website authors; SDK delivers (D-279, plus the SDK's zero-config init D-278).** Customers edit messages on the RelayKit website. Their AI coding tool installs the SDK and reads `RELAYKIT_API_KEY` and `BUSINESS_NAME` from env. Sending is a one-line call. The customer's app does not own message templates.

**The AI coding tool is the implementation target.** RelayKit's primary integration surface is the developer's AI tool (Claude Code, Cursor, Windsurf, etc.). `AGENTS.md` and the Get-Started page's pre-populated prompt (D-331) are how the customer crosses from "I have a sandbox" to "I have a working integration." Support is not the AI-tool's job — implementation is. Anchors: D-93 (positioning lock).

**The intake interview personalises the prompt (D-300).** The prompt the customer's AI tool receives at Get-Started is built from wizard data — not a generic template. This is what makes "first-try success" plausible.

**Voice across the product (per `docs/VOICE_AND_PRODUCT_PRINCIPLES_v2.md`).** Three tiers: (1) Show, don't tell — interface communicates without words; (2) A few words — one-sentence factual explanations when the interface alone is ambiguous; (3) Full explanation — documentation and FAQ for people who go looking. Tier 3 content never surfaces in Tier 1 or Tier 2 unless the customer asks. The kill list bans "10DLC", "campaign", "TCR", "compliance" (as a standalone noun), "promotional", "required", "failed", "violation", "you must", "seamlessly", "leverage", "robust", "empower", and others.

**What RelayKit will not say.** Never claim guaranteed compliance outcomes ("ensures compliance", "guarantees approval", "fully compliant"). Never quote specific day counts for carrier review (use "a few days" — D-215). Never frame marketing as an upgrade — it's a second campaign registration, never a tier (D-15, D-37, D-89, plus D-254 vocabulary). Never describe friction RelayKit has eliminated by referring to the old way (applies to product surfaces; marketing voice may handle contrast differently going forward).

---

## 16. What's not in the product (launch)

Per MASTER_PLAN §16 and supporting decisions:

- **Multi-project / project-switching UI.** V1 ships single-project per account.
- **BYO Twilio / Sinch.** Managed-only at launch (D-26 and CLAUDE.md hard constraint).
- **Marketing as a tier "upgrade".** Marketing is a second campaign registration, never an "upgrade" or "plan tier" (D-15, D-37, D-89).
- **Healthcare / HIPAA.** Declined at intake — RelayKit holds no BAA and routes no PHI through the proxy (D-18).
- **Sole-prop marketing.** Marketing requires EIN; sole proprietors cannot register marketing campaigns. This is a carrier constraint surfaced honestly, not a RelayKit policy choice.
- **MMS / media attachments.** Not at launch.
- **RCS, WhatsApp, voice.** Not at launch.
- **Drip sequences / multi-message workflows.** Not at launch.
- **Full two-way inbox product.** Phase 10 ships a basic viewer for inbound replies, not a compose-search-templates-assignment-roles inbox.
- **Sentiment-branched review requests.** Deferred pending an ethics decision (D-361).
- **Multi-user roles / team accounts.** Not at launch.
- **Platform tier (SaaS platforms registering tenants).** Post-launch only.
- **Link tracking / branded short links.** Post-launch.
- **Compliance audit log export.** Post-launch enterprise feature.
- **Real-time SMS compliance alerts to the developer's phone.** Deferred — D-364 — preventive model makes runtime alerts unnecessary by design unless evidence demands them.
- **Custom-built starter kits.** Out-of-scope for launch, captured in BACKLOG as a maybe for far-future consideration; current launch strategy is third-party starter integration (Phase 9).
