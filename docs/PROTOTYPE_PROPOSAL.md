# RelayKit UX Prototype — Design Proposal
## Harvested from the Mar 8, 2026 Brainstorming Session
### For code-based prototyping in a separate `/prototype` directory

---

> **⚠️ PROTOTYPE ONLY — DO NOT TOUCH PRODUCTION CODE**
>
> Everything in this document is for a **throwaway UI prototype** that lives in `/prototype` at the repo root. It has its own `package.json`, runs on **port 3001**, and has **zero connection** to the production app in `src/`. No database, no Supabase, no Stripe, no Twilio, no auth. Pure UI with hardcoded data and Framer Motion. Nothing in `src/`, `app/`, `lib/`, `components/`, or `supabase/` should be read, modified, or imported.

---

## What Changed

The brainstorming session produced a fundamentally different UX from what PRD_06 currently describes. The dashboard as built has too many cards, messages in two places, permanent elements that should be transient, and no pre-signup experience. What follows is the settled direction across ~30 exchanges of iteration, organized for a code prototype.

---

## 1. THE FLOW (Settled Narrative)
*Prototype: all of this is hardcoded UI in `/prototype`. No real auth, no real data.*

A developer finds RelayKit — through search, a category page, or the homepage. They click a use case (say, Verification Codes) and land on a **category landing page** with SEO-quality content about that use case. A button says "Start building →" with "No signup required" beneath it.

They click. A short **personalization step** asks one or two questions — "What's your app called?" and optionally their website. The questions are specific to the use case they picked. This takes ten seconds.

The **plan builder** slides in. Every message card already says "Your Acme verification code is {code}" — personalized with what they just typed. A **live consent form preview** on the left shows what their users will agree to, updating in real time as they toggle messages. A **compliance checklist** sits between the form and the cards, showing green checks, neutral dashes (for OTP exceptions), and red X's if something's missing.

They toggle messages, edit wording, watch everything update. When they're ready, they notice a build spec has appeared in the **docs area** — a tabbed page with Build Spec, SMS Guidelines, and API Reference. They can read it, hand it to their AI coding tool, or keep going.

When they want to call the API, that's when **signup happens** — email, magic link. Their app name pre-fills from what they already typed. Everything they built (use case, messages, build spec) saves to their account. They get a sandbox API key.

They build, test, iterate. When ready, they click **Go Live**. A modal handles phone verification. The intake wizard collects business details — their messages are already there. They pay. "Most developers never get here. You did."

A **labeled progress stepper** shows registration status. They're invited to get **SMS notifications** about progress. When approved, the compliance tab appears, docs update to production editions, they swap keys.

At any point they can go back — change use case, change messages, browse other categories. Their name persists across everything via session storage. Browsing the orders category shows "Your Acme order has shipped" already waiting.

---

## 2. SCREEN-BY-SCREEN INVENTORY
*Prototype: each screen is a route under `/prototype`. Fake state, fake data, real animations.*

### Screen 1: Category Chooser

The existing use case tiles (8 + "Just exploring"), but now each tile opens a **modal on click** instead of immediately selecting. The modal is 3–4 lines confirming "is this me?" with a "This is me → Continue" button.

**Modal content per category (settled):**

- **Verification codes** — Login codes, signup verification, password resets, and multi-factor auth. Every message is triggered by your user — they request it, your app sends it. Highest-trust SMS category with carriers. *Covers: OTP · 2FA · phone verification · password reset · device alerts*
- **Appointment reminders** — Booking confirmations, reminders, rescheduling and cancellation notices. Messages about appointments they already booked. *Covers: confirmations · reminders · rescheduling · cancellations · no-show follow-ups*
- **Order & delivery updates** — Order confirmations, shipping and tracking updates, delivery notifications. *Covers: order confirmed · shipped · out for delivery · delivered · returns · pickup ready*
- **Customer support** — Ticket acknowledgments, status updates, resolution notices, two-way conversations. *Covers: ticket received · status updates · resolved · follow-ups · escalation notices*
- **Marketing & promos** — Promotional offers, announcements, sales, loyalty rewards. Unlike others, these go to opted-in recipients, not in response to user action. Carriers scrutinize more closely. *Covers: promotions · announcements · sales · loyalty · back-in-stock*
- **Team & internal alerts** — Shift reminders, schedule changes, system alerts. Sent to your own team, not customers. *Covers: shift notifications · meeting reminders · system alerts · policy updates · task assignments*
- **Community & groups** — Event announcements, membership notifications, community news. *Covers: events · community news · membership updates · group alerts · RSVP*
- **Waitlist & reservations** — "Your table is ready" alerts, waitlist updates, reservation confirmations. *Covers: waitlist updates · table/spot ready · reservations · availability alerts*

### Screen 2: Personalization Step

A light interstitial between category confirmation and the plan builder. Could be a second state of the category modal or a brief standalone screen. **Not a form — a question.**

Fields are **use-case-specific** (settled per category):

| Category | Fields | Why |
|----------|--------|-----|
| Verification | App name, Website (optional) | OTP messages use app name |
| Appointments | Business name, Service type, Website (optional) | "Your dental appointment" vs "Your appointment" |
| Orders | Business name, Product type, Website (optional) | "Your electronics order" vs "Your order" |
| Support | Business name, Website (optional) | — |
| Marketing | Business name, What you sell/offer, Website (optional) | — |
| Internal | Company name, Website (optional) | — |
| Community | Organization name, Website (optional) | — |
| Waitlist | Business name, Venue type, Website (optional) | "Your table is ready" vs "Your spot is ready" |

**Key behaviors:**
- Each field has a one-line benefit explanation as its label context. Not "used to populate {app_name}" but "This appears in every text your users receive."
- Placeholder text (gray ghost) shows format: *e.g. Acme*, *e.g. dental, hair salon*
- **No pre-populated sample data** — that undercuts the personalization magic
- **Entire step is skippable** — "Skip for now →" goes straight to plan builder with template variables showing
- Data **persists across categories** via session storage — type "Acme" once, switch to a different category, it's already there. Only new category-specific fields appear.
- Data **persists if they navigate back** — returning to this screen shows what they entered

### Screen 3: Plan Builder with Consent Preview

This is the centerpiece. **Single-column layout** (squeezed together, not side-by-side as in current PRD_06). Left context area + right message cards → combined into one flowing view.

**Three components working together:**

#### A. Live Consent Form Preview
A realistic-looking embedded form (browser-frame or phone-frame) showing what the developer's users will see. Updates in real time:

- App/business name from personalization step
- Bullet list of enabled message types
- Opt-out language ("Reply STOP to any message to opt out")
- Privacy Policy / Terms links
- Checkbox: "I agree to receive text messages from {app_name}"

**When expansion messages are toggled on**, a second consent section appears with a separate checkbox: "I agree to receive marketing messages from {app_name}." This is the single most important teaching moment — the developer *sees* why expansion needs a separate registration.

#### B. Compliance Checklist
A deterministic (not AI) checklist between the consent preview and message cards. Tracks known required elements per message:

| Element | Form location | Message location | Check logic |
|---------|--------------|-----------------|-------------|
| Business/app name | Form header | {app_name} variable | Variable present |
| Opt-out keyword | "Reply STOP..." | "Reply STOP to opt out" | String match for STOP |
| Message type coverage | Each bullet | Each enabled card | Card on = bullet on form |
| Separate consent | Second checkbox | ⭐ badge | Expansion enabled = checkbox appears |

**Visual behaviors:**
- ✅ Green check — requirement met
- ❌ Red X — requirement missing (e.g., STOP removed from a message that needs it)
- ➖ Neutral dash — not required for this message type (e.g., OTP doesn't need STOP)
- 🟡 Yellow — separate consent needed (expansion message toggled)

**Color-coding links the form to the messages:** STOP on the consent form is the same color as STOP in the message cards. App name matches {app_name} variable. The developer sees the chain visually.

If someone edits a message and removes STOP, the checklist flips to red in real time. No modal, no warning — just the visible broken link. They fix it themselves.

#### C. Message Cards (Three Tiers — Renamed)

The tiers were renamed from the PRD_06 originals. Settled naming:

| PRD_06 name | New name | Section header | Subtext |
|-------------|----------|---------------|---------|
| Included in your registration | **Core messages** | CORE MESSAGES | On by default — most apps need these |
| Also available with your registration | **Also covered** | ALSO COVERED | Your registration includes these — turn on what you need |
| Requires additional campaign | **⭐ Needs additional registration** | ⭐ NEEDS ADDITIONAL REGISTRATION | We register a separate campaign alongside yours |

**"Core" gives developer identity, "Also covered" is a relief signal, "Needs additional registration" is honest without jargon.**

**Each card shows:**
- Toggle (on/off)
- Message name (human-readable, not monofont)
- Message preview (personalized with app name, realistic fake code like 283947, not {code})
- Trigger description in plain English ("When user requests login OTP")
- Edit button
- For ⭐ messages: one-line note about what happens ("We register a separate campaign alongside yours")

#### D. "Preview as" Input
A persistent input at the top of the plan builder: **Preview as: [your app name]**. If they filled in the personalization step, it's pre-populated. If they skipped, they can type here and everything updates. This is the fallback personalization mechanism.

**Runtime variables** ({code}, {date}, {time}) render as realistic placeholders — random 6-digit number, real-looking date/time — with a subtle visual distinction (light background highlight) so the developer knows "my app fills this in."

### Screen 4: Category Landing Page (SEO/Content Page)

Doubles as both a search-landing page and the post-tile-selection content page. **Minimal copy — the brainstorming explicitly cut the initial draft in half.**

Settled structure (using Verification as the example):

**Headline:** Add verification codes to your app

**Subhead:** Login codes, signup verification, password resets, 2FA. Your users request a code, your app sends it. RelayKit handles the carrier registration so your codes get delivered, not filtered.

**CTA:** Start building → / No signup required.

**Section: What your registration covers** — Bulleted list of message types. One line: "All user-initiated, all high-trust with carriers."

**Section: What it doesn't cover** — Anything user didn't ask for. "If you need those later, we register an additional campaign alongside yours. You don't need to decide now."

**Section: How it works** — One-line flow: Pick messages → generate build spec → hand to AI tool → test in sandbox → register when ready → swap key.

**Closing CTA:** Start building →

### Screen 5: Docs Page (Tabbed Reading Experience)

Documents moved **out of modals** and onto a dedicated page with tabs. Clean typography, good line length, table of contents sidebar for longer docs.

**Tabs:** Build Spec · SMS Guidelines · API Reference

**Key behaviors:**
- Real reading experience, not a modal preview
- Documents are personalized from the profile/session data (before registration)
- After registration, documents show frozen/canon versions
- **Register CTA in the top nav bar** (not a sticky bottom bar — settled as "that's a skeezy pattern")
- Cross-discovery: developer on API Reference notices Build Spec tab, clicks out of curiosity

### Screen 6: Signup (At API Key Request)

Signup happens when the developer requests their sandbox API key — **not at entry.** Everything before this is open, no auth wall.

**Trigger:** Developer clicks "Get your API key" (or similar) after building their plan.

**Fields:** Email + magic link. App name pre-fills from session. Everything they built (use case, messages, edits) saves to their account at this moment.

**Post-signup:** They get their `rk_sandbox_` key and continue building. The dashboard is now persistent.

### Screen 7: Post-Registration Dashboard

After registration, the dashboard evolves:

**Tab structure:**
- Before registration: **Overview** only (plan builder, docs link)
- After registration: **Overview + Compliance** (compliance tab appears — settled that it shouldn't show earlier)

**Messages live in ONE place** — the plan builder section on Overview. Before registration it's interactive. After registration it becomes read-only with compliance status indicators on each card. **No separate Messages tab.** (This was the explicit "messages in two places feels junky and redundant" decision.)

**Registration status:** A **labeled progress stepper** with narrative at each step (what's completed, what's happening, what's next, keep-building prompt per D-32). Plus an **invitation to receive SMS notifications** about registration progress.

**Phone verification:** A **modal**, not a permanent card. Appears contextually when needed (e.g., at Go Live), disappears when done.

**API reference / build spec links:** Moved to the docs page with tabs. Not cards on the dashboard.

---

## 3. CROSS-CUTTING BEHAVIORS
*Prototype: session storage and React state only. No database persistence.*

### Personalization Persistence
- Session storage carries app name, website, service type across all pages
- Switching categories retains shared fields (name, website), only shows new category-specific fields
- Category landing pages render with personalized message examples
- Browsing the Orders category shows "Your Acme order has shipped" if name was entered on Verification
- This is a **first-class experience** — the entire site responds to one input

### Profile → Document Pipeline
- Before registration: profile edits update all documents live (build spec, consent preview, message cards)
- After registration: canon messages are frozen. Profile changes trigger a notification: "Your profile says X but your registration is under Y. Want to update?"
- Documents in the docs tab are living references, not one-time artifacts

### Animation Philosophy (Settled)
The prototype should feel "elegant, smooth, modern, fast, and considered." Specific direction:
- Cards gently animate in (staggered fade/slide)
- Text transitions smoothly when personalization data changes
- Tile selection → modal → personalization → plan builder flows as one continuous motion, not page-load-page-load
- Consent form updates are animated (new bullets slide in, second checkbox appears smoothly)
- Checklist state changes are immediate but visually clear (color transitions, not jarring swaps)
- **Framer Motion** for React components

### Navigation Model
- Top nav with project name/use case on left, tab navigation center, "Register →" CTA top right
- No sticky bottom bars
- Back navigation preserves all state
- The whole pre-signup experience feels like one continuous wizard that's also freely navigable

---

## 4. WHAT WAS EXPLICITLY REJECTED

| Idea | Why rejected |
|------|-------------|
| Sticky bottom bar CTA | "Skeezy pattern" — triggers banner blindness, interferes with reading experience |
| Pre-populated sample data (e.g., "Business XYZ") | Creates "clear and overwrite" friction instead of "type your thing" |
| Chatbot for profile creation | Too much engineering for what a few well-designed fields accomplish; developers are skeptical of chatbots |
| AI-powered compliance recommendations | Deterministic pattern matching is instant, predictable, and visually chainable; AI saying "consider adding STOP" is a suggestion, the red X is a visible broken link |
| Framing personalization fields as "sample data" | Undercuts the personalization magic — it should feel real, not provisional |
| Messages tab as a separate destination | Redundant with plan builder; messages live in one place that evolves with lifecycle |
| Compliance tab before registration | Creates anxiety or feels like empty furniture; earns its place only when there's live traffic |
| Phone verification as a permanent dashboard card | One-time action shouldn't take permanent space; modal appears when needed, disappears when done |
| API quick start as a dashboard card | It's documentation; belongs on the docs page with tabs |
| Upfront signup wall | Delays investment; signup at API key request means they've already built something |

---

## 5. DECISIONS TO RECORD

These should be appended to DECISIONS.md when the build resumes:

| # | Decision |
|---|----------|
| D-56 | Message tier naming: "Core messages" / "Also covered" / "⭐ Needs additional registration" — replaces PRD_06 "Included in your registration" / "Also available" / "Requires additional campaign" |
| D-57 | Category tiles open a confirmation modal (3–4 lines + "This is me") instead of immediately selecting |
| D-58 | Personalization step between category selection and plan builder — use-case-specific fields, entirely skippable, data persists across categories via session storage |
| D-59 | Live consent form preview on plan builder — updates in real time as messages are toggled, second checkbox appears for expansion messages |
| D-60 | Deterministic compliance checklist (not AI) — tracks business name, opt-out keyword, message type coverage, separate consent. Color-coded to link form elements to message elements |
| D-61 | No signup wall — everything before API key request is open. Signup happens at "Get your API key" moment |
| D-62 | Documents (build spec, SMS guidelines, API reference) live on a tabbed docs page with real reading experience — not modals, not dashboard cards |
| D-63 | Register CTA in top nav bar, not sticky bottom bar |
| D-64 | Messages exist in ONE place — plan builder on Overview. No separate Messages tab. Section evolves from interactive (pre-registration) to read-only with compliance indicators (post-registration) |
| D-65 | Compliance tab appears only after registration |
| D-66 | Phone verification is a contextual modal, not a permanent dashboard card |
| D-67 | Message previews use realistic placeholders (283947, not {code}) with subtle visual distinction; "Preview as" input at top of plan builder |
| D-68 | App/business name persists across all category pages and previews via session storage — browsing any category shows personalized messages |
| D-69 | Profile edits update documents live before registration; after registration, canon messages are frozen with change detection |
| D-70 | Labeled progress stepper for registration status + SMS notification opt-in for progress updates |

---

## 6. PROTOTYPE STRUCTURE

### Approach
Separate `/prototype` directory at repo root. Lightweight Next.js app — pages only, no database, no API, no auth. Hardcoded data, fake state, Framer Motion for animations. Runs on a different port from the real app.

### Routes to Build

```
/prototype/                         → Category chooser (8 tiles + exploring)
/prototype/c/verification           → Category landing page (verification)
/prototype/c/verification/setup     → Personalization step
/prototype/c/verification/plan      → Plan builder with consent preview + checklist
/prototype/docs                     → Docs page with tabs (build spec, guidelines, API ref)
/prototype/signup                   → Signup at API key request
/prototype/dashboard                → Post-signup dashboard (overview)
/prototype/dashboard/registered     → Post-registration state (with compliance tab, stepper)
```

### What the Prototype Must Prove
1. The zero-signup-wall experience works — category → personalization → plan builder → docs, all without auth
2. Personalization persistence across categories is magical (type once, see everywhere)
3. The consent form preview teaches expansion registration without explanation
4. The compliance checklist makes broken links visible without lectures
5. Messages in one place (plan builder) doesn't lose functionality vs. two places
6. The animation language makes the flow feel like one continuous motion
7. The docs page with tabs is a better reading experience than modals or cards

### Hardcoded Data Needed
- Full verification codes template set (from PRD_02 template engine)
- At least one other category (appointments) for cross-category personalization demo
- Fake build spec content
- Fake SMS guidelines content
- Fake API reference content

---

## 7. WHAT TO TELL CC

When ready to start prototyping, the CC prompt is:

```
DECISIONS CHECK — Read DECISIONS.md before proceeding.

Read this file: docs/PROTOTYPE_PROPOSAL.md

CRITICAL: This is a UI-only prototype. DO NOT touch anything in src/, app/, 
lib/, components/, or supabase/. DO NOT import from the production app. 
DO NOT connect to Supabase, Stripe, or Twilio. The prototype is completely 
isolated from the production codebase.

Scaffold a /prototype directory at the repo root as a standalone Next.js app 
with Framer Motion. Its own package.json, its own node_modules, runs on 
port 3001. No database, no auth, no API calls — pure UI with hardcoded data 
and React state.

Start with the category chooser and plan builder screens for verification codes. 
Build the consent form preview and compliance checklist as the first priority — 
these are the UX innovations we need to prove.

Give me a build plan with numbered tasks before writing any code.
```

---

## 8. RELATIONSHIP TO EXISTING PRDs

This prototype will validate UX changes that, once confirmed, require updates to:

- **PRD_06** — Dashboard structure, tab model, message location, progressive disclosure stages, plan builder layout
- **PRD_07** — Category landing pages become a real product surface, not just a marketing page; SEO content per use case
- **PRD_01 Addendum** — Signup timing changes affect how the intake wizard is entered
- **PRD_05** — Docs page with tabs changes how deliverables are surfaced

The prototype is the visual spec. Once it feels right, we update the PRDs and build for real. The existing production components (template engine, Twilio pipeline, compliance site generator) don't change — we're rearranging how they're presented, not what they do.
