# RelayKit Workspace Design Spec
## From wizard to workspace — the new developer experience
### Updated: April 5, 2026 (Session 23)

---

## What This Document Is

This is the design spec for reshaping the RelayKit prototype from a dashboard-first experience into a wizard-to-workspace flow. CC should read this alongside DECISIONS.md, PROTOTYPE_SPEC.md, and VOICE_AND_PRODUCT_PRINCIPLES_v2.md before building.

This is a phased rebuild. Not everything ships in one session. Each phase is independently useful.

---

## Design Principles

1. **One flow, one direction, one destination.** The developer arrives, sets up, and lands on their messages. No tabs to choose between. No "where do I start?" moment.
2. **Messages are the product.** Every screen exists to get the developer to their messages or to help them use their messages.
3. **The page grows with the developer.** First visit is minimal. Features appear as the developer's progress makes them relevant. No empty states for things they haven't done yet.
4. **We don't presume to know their app.** RelayKit knows messages and compliance. The developer's AI tool knows their codebase. We stay in our lane.
5. **Setup becomes Settings.** The data collected during onboarding is the same data that lives in Settings. The context changes, not the data.
6. **Never explain our process.** Intake questions ask. Message previews show. The summary confirms. No teaching the developer about compliance, registration pipelines, or carrier mechanics during onboarding. The product thesis is that they don't have to think about this stuff — the UI must prove that thesis, not undermine it.
7. **Everything is scoped to the app, not the account.** Business identity, EIN, categories, messages, API keys, demo list — all per-app. A developer account can have multiple apps (PRD_11), each with its own workspace. Design nothing that assumes one app per account.

---

## Prototype Architecture

### Two Layout Systems

The wizard flow spans two route trees with two layout systems that produce the same visual result (540px centered column, minimal chrome):

**`/start/*` pages** use `WizardStepShell` (per-page component) inside `prototype/app/start/layout.tsx`:
- Top nav: RelayKit wordmark only (no Sign in, no Sign out, no Your Apps)
- Vertical pill appears next to wordmark on all `/start/*` pages after the picker (read from sessionStorage)
- Back/Continue provided by WizardStepShell — each page passes `backHref`, `continueHref`, `canContinue`, `onBeforeContinue`
- Content: centered in `max-w-[540px]` container

**`/apps/[appId]/*` wizard pages** use `WizardLayout` (shared wrapper via AppLayout state check):
- Top nav: RelayKit wordmark → Appointments pill → state switcher dropdown → Sign out
- Below nav: ← Back and Continue on the same row, aligned with nav edges
- Content: centered in `max-w-[540px]` container
- `WizardContinueContext` lets pages override header Continue with custom `{onClick, disabled}`
- `getPageConfig(pathname, appId)` drives Back/Continue targets per page

**Route behavior by state:**

Default (wizard):
- `/apps/[appId]/messages` → wizard messages page
- `/apps/[appId]/ready` → benefit-led pre-signup page
- `/apps/[appId]/signup` → email + OTP account creation
- `/apps/[appId]/opt-in` → redirects to `/messages` (removed from flow, page returns null)
- `/apps/[appId]/overview` → redirects to `/messages`
- `/apps/[appId]/settings` → redirects to `/messages`

Pending / Extended Review / Rejected:
- `/apps/[appId]/overview` → existing Overview page
- `/apps/[appId]/messages` → existing Messages tab
- `/apps/[appId]/settings` → existing Settings page
- `/apps/[appId]/ready` → redirects to `/overview`
- `/apps/[appId]/signup` → redirects to `/overview`

Approved:
- `/apps/[appId]/overview` → approved Overview (metrics cards)
- `/apps/[appId]/messages` → existing Messages tab
- `/apps/[appId]/settings` → existing Settings page

**ProtoNavHelper:** Floating bottom-left "Nav ↑" pill for non-linear design review. Expands to jump links for every page in every state. Prototype-only, strip on port.

**TopNav has three distinct modes** (pathname regex + conditionals):
- `/start` and `/start/*` → wordmark-only, with vertical pill on `/start/*`
- `/apps/*/messages|ready|signup` + `registrationState === "default"` → wordmark + Appointments pill + state switcher + Sign out
- Everything else → full marketing or dashboard nav

---

## The Flow

### Step 1: Vertical Picker ✅ BUILT

**Route:** `/start`

**Heading:** "What's the main reason your app sends texts?"

**Eight cards** in 2-column grid (single column mobile):
- **Appointments** — Confirmations, reminders, reschedules, cancellations, no-show follow-ups
- **Verification codes** — Login OTPs, signup codes, password resets, MFA, new device alerts
- **Order updates** — Shipping confirmations, delivery alerts, return status, refund notices
- **Customer support** — Ticket updates, resolution notices, satisfaction follow-ups
- **Marketing** — Promos, re-engagement, product launches, seasonal campaigns
- **Team alerts** — Shift reminders, system alerts, escalation pings, on-call notifications
- **Community** — Event reminders, group updates, membership alerts, RSVP confirmations
- **Waitlist** — Spot available, queue position, reservation holds, invite codes

Cards are click targets — no CTA text, no "Explore →". Clicking saves `vertical` to sessionStorage and navigates to `/start/business`.

Nothing else on the screen. RelayKit wordmark only. No nav items, no sign-in link, no marketing copy. Pure focus.

### Step 2: Business Name + EIN ✅ BUILT

**Route:** `/start/business`

**Heading:** "What's your business called?"
**Body:** "You can change any of this later."

**Business name input:** Full width, placeholder "Your business name", autofocus. Continue disabled until filled.

**EIN section (expandable, optional for transactional primary):**
- Collapsed state: "I have a business tax ID (EIN)" as brand purple text link with ⓘ tooltip ("A 9-digit tax ID for your business. Entering one unlocks marketing messages and additional use cases.")
- Expanded state: link changes to "Cancel" (text-text-tertiary, right-aligned on same line as label) which collapses and clears. EIN input (XX-XXXXXXX format, auto-dash), "Verify" button inline right.
- **Verification:** Two-phase spinner — "Verifying..." (1s) → "Checking sources..." (1.5s). Simulates primary lookup + AI fallback.
- **Verified state:** Business identity card (name, address, entity type · state) with ✕ dismiss in top-right. Checkbox inside card: "This is my business" with ⓘ tooltip ("Misrepresenting business identity will result in account termination."). Continue disabled until checkbox checked.
- **Failed state:** "We couldn't verify this EIN. You can try again or continue without it." Continue stays enabled. EIN data not saved.
- **Format error:** "EIN should be 9 digits (XX-XXXXXXX)" — inline, on blur.
- **Marketing-primary:** EIN section expanded by default, no collapse option. Required — Continue disabled without verified EIN. Failed state: "We couldn't verify this EIN. Marketing messages require a verified business identity. You can switch to a different use case to get started, or try a different EIN."

**Prototype state cycler** (Default/Verified/Failed) for design review — strip on port.

Back → `/start`. Continue → `/start/details`.

### Step 3: Service Context ✅ BUILT

**Route:** `/start/details`

**Heading:** "Tell us about your business"
**Body:** "This helps us write messages that sound like they're from you."

**Two inputs, sequential (second appears after first is answered):**

Input 1 — Dropdown (native select, custom chevron via `appearance: none` + SVG background):
Label: "What kind of business?"
Options: Salon & beauty, Dental, Medical, Fitness & wellness, Tutoring & education, Consulting, Auto service, Home services, Pet care, Photography, Other

Input 2 — Text input (fades in after dropdown selection):
Label: "What do people book with you?"
Contextual placeholder based on dropdown (e.g., Salon → "e.g., nail appointments, haircuts"; Dental → "e.g., dental cleanings, checkups"; Other → "e.g., appointments, sessions")

Both required. Continue disabled until both filled.

Back → `/start/business`. Continue → `/start/website`.

### Step 4: Website ✅ BUILT

**Route:** `/start/website`

**Heading:** "Do you have a website?"
**Body:** "We'll link to it in your messages so customers can find you online."

**URL input:** Placeholder "glowstudio.com". Optional.
**Skip link** below input (text-text-tertiary) — advances without entering a URL.
Continue always enabled.

**Note:** If no website provided, messages that reference `{website_url}` omit that line entirely. The compliance site URL (`msgverified.com`) is never shown to end customers — it's infrastructure for carrier review only.

Back → `/start/details`. Continue → `/start/context`.

### Step 5: Context ✅ BUILT

**Route:** `/start/context`

**Heading:** "Anything else we should know?"
**Body:** "This helps us tailor your messages. You can always adjust later."

**Textarea:** 4 rows, no placeholder, optional. Label: "Notes for us"
**Skip link** below textarea.
Continue always enabled.

Feeds into AI summary (future Step 3 if built) and AI help context on messages page. Does not directly modify templates.

Back → `/start/website`. Continue → `/start/verify`.

### Step 6: Phone Verification ✅ BUILT

**Route:** `/start/verify`

**Heading:** "Verify your phone number"
**Body:** "Your phone is your test device for messages."

**Phone input state:** +1 prefix (non-editable), placeholder "(555) 123-4567". "Send code" button (compact purple, inline right). 1.5s stub delay → OTP state.

**OTP state:** "We sent a code to +1 (555) 123-4567". 6 digit boxes (auto-advance, paste, backspace). Any 6 digits work in prototype. "Use a different number" link → returns to phone input.

**Verified state:** Green checkmark + "Verified" + formatted phone. "Change" link (text-text-tertiary) → resets to phone input.

Continue disabled until verified.

Back → `/start/context`. Continue → `/apps/glowstudio/messages` (hardcoded for prototype).

### Step 7: Messages ✅ BUILT

**Route:** `/apps/[appId]/messages` (Default state)
**This is the most important screen in the product.**

The developer lands here and sees their complete message set for the vertical. All messages, pre-populated with their business context from intake. Every message has a send button.

**Body text (wizard mode only):** "These are your messages — ready to use. Edit any message to match your voice."

**Wizard header:** RelayKit + Appointments pill (top nav), ← Back + "Start building" (below nav). "Start building" appears at top AND bottom of the page — dual Continue (D-318). Bottom Continue is full-width purple in the 540px column.

**Message cards, edit state, style pills, AI help, compliance checks:** See PROTOTYPE_SPEC.md for full card anatomy. Key behaviors unchanged from Session 22.

Back → `/start/context`. "Start building" → `/apps/[appId]/ready`.

### Step 7.5: Opt-in Form Preview — REMOVED FROM FLOW

**Route:** `/apps/[appId]/opt-in` — page returns `null`, all traffic redirects to `/messages`.

Joel flagged this page as unsatisfying. Removed from wizard flow. File retained with original implementation in a reference comment. D-317 specifies opt-in form should be viewable post-onboarding on demand from messages page (modal or slideout). Design TBD.

### Step 8: Ready ✅ BUILT

**Route:** `/apps/[appId]/ready`

**Heading:** "Skip the hard part"
**Body:** "Create a free account and start building."

**Five benefit lines** with green CheckCircle icons. Bold lead sentence + tertiary detail. Generous spacing (space-y-7):

✓ **One prompt gets you started.** Your business details, your messages, ready to paste into your AI tool.

✓ **Test with real people, real phones.** Send to up to 5 people — your team, your co-founder, a client you want to impress.

✓ **An expert in your corner.** A full AI assistant that knows your business, your messages, and how SMS works.

✓ **Change a message here, your app updates automatically.** Edit copy on the website. No code changes, no redeployment.

✓ **You never think about compliance.** Opt-in forms, carrier rules, message formatting — all handled.

**Pricing:**
"Free while you build and test." — text-lg font-semibold
"When you're ready for real delivery: **$49** registration + **$19/mo**." — dollar amounts semibold (D-320)

**CTA:** Full-width purple "Create account" → `/apps/[appId]/signup`

No Continue button in WizardLayout header — the CTA button is the only forward action. Back → `/apps/[appId]/messages`.

### Step 9: Signup ✅ BUILT

**Route:** `/apps/[appId]/signup`

**Heading:** "Create your account"
**Body:** "Free while you build. $49 + $19/mo when you're ready for real delivery." (D-320)

**Email input:** Full width, placeholder "you@company.com", autofocus. "Send code" button (compact purple, right-aligned below input). 1.5s stub → OTP state.

**OTP state:** "We sent a code to you@company.com". 6 digit boxes (reuses sign-in modal pattern). Any 6 digits work. "Use a different email" link → returns to email input.

**Verified state:** Green checkmark + "Email verified" + email displayed. "Change" link to reset. Optional checkbox: "Send me product updates" (unchecked by default). Continue enables.

**Continue behavior:** Sets registrationState to "Pending", navigates to `/apps/glowstudio/overview`. Wizard chrome dissolves — DashboardLayout renders.

Continue controlled via `WizardContinueContext` (disabled until email verified). Back → `/apps/[appId]/ready`.

**Future:** Continue should route to `/apps/[appId]/get-started` (tool picker + API key + setup prompt) before dashboard. Not yet built.

### Step 10: Get Started — NOT YET BUILT

**Route:** `/apps/[appId]/get-started` (planned)

**Heading:** "Start building"
**Body:** "Paste this into your AI coding tool and it handles the rest."

**Tool picker:** "What do you build with?" — row of tool name cards (Claude Code, Cursor, Windsurf, GitHub Copilot, Cline, Other). One selected at a time. Brand purple border + light bg on selection.

**API key:** Readonly input showing stubbed key `rk_sandbox_abc123def456`. Copy button. "This is shown once. Save it somewhere safe."

**Setup prompt (appears after tool selection):** Code block with ready-to-paste prompt tailored by tool. Includes `npm install relaykit`, API key, business name, industry, use case, message list. Copy button.

**CTA:** Full-width purple "Go to your dashboard" — sets registrationState to "Pending", navigates to dashboard overview.

This is the momentum bridge — instead of dumping them on a dashboard, we hand them the exact next action.

---

## The Workspace (Post-Signup)

After signup, the wizard is done. The developer's workspace is the messages page.

### Navigation

**Top bar:** RelayKit logo | App name + vertical badge | Settings (icon/link) | Sign out

No tabs in sandbox. The messages page IS the app. Settings is accessible via icon/link in the top bar, not as a tab.

**After registration (pending/approved):** Add an "Overview" link. Overview shows registration status and, after approval, delivery metrics.

### Messages Page (Workspace)

Same layout as Step 7, minus wizard framing. All message cards, all editable, all sendable.

**Additions that appear over time (progressive disclosure):**

**After first SDK send detected:**
- "Demo phones" section appears below messages. Collapsed by default.
- Expandable to show: primary phone, "Add someone" button
- Adding a person: enter phone + name label, OTP verification, added to list
- Invite link: secondary action within the demo section
- Per-card send action shows recipient picker

**Test activity log:**
- Appears after first successful send
- Simple chronological list: message name, recipient, timestamp, delivery status
- SDK-triggered sends labeled: "From your app" badge
- Capped at last 20 entries

**Integration test checklist (appears after signup):**
Vertical-specific checklist mapping app actions to expected messages. Auto-completes when API detects corresponding sends. Disappears when all items checked.

### "Go Live" CTA

Banner or persistent element: "Ready for real delivery? Go live →"

Clicking opens a pre-filled registration confirmation (NOT a form — a review screen):
- Business name, type, EIN, address (pre-filled from intake/EIN lookup)
- Categories to register
- Messages per category
- Pricing: $49 one-time + $19/mo (one category) or $49 one-time + $29/mo (two categories) (D-320)

Only fields we don't already have are empty inputs. No pricing surprise. Full refund if rejected.

---

## Message Edit Lifecycle

**The website authors, the SDK delivers (D-279).**

**Message copy edits are zero-code.** Edit on the website → next send from the app uses the new copy automatically. Confirm after every save: "Saved. Your app will use this version on the next send."

**New messages don't require return trips.** The spec file tells the AI tool to build handlers for ALL messages from day one.

**We don't generate new prompts for the tool on return visits.** After changes, we show what changed and the function signatures. The developer tells their tool what to do.

**SMS_GUIDELINES.md updates via API.** When messages change or categories are added, the guidelines file updates automatically.

---

## Settings

### In Sandbox (pre-registration)

Settings is the intake data in editable form. Accessed from top bar icon/link.

**Sections:**
- **Your business:** Business name, service type, website, EIN (add or edit)
- **Categories:** Active categories. EIN on file → "Add another category." No EIN → "Add your EIN to unlock additional categories."
- **API key:** Sandbox key, copyable. "Your AI tool reads this from your .env file."
- **Your phone:** Primary verified number. "Change" to re-verify.

### After Registration

Settings grows:
- **Registration:** Status, timeline, campaign ID, compliance site link, SMS number
- **Billing:** Plan, usage, next billing date, manage billing link (Stripe portal)
- **API keys:** Sandbox key + live key (shown once at generation, masked after)
- **Danger zone:** Cancel plan, delete account

---

## Shared Wizard Infrastructure

**`prototype/app/start/layout.tsx`** — min-h viewport wrapper for all `/start/*` pages.

**`prototype/components/wizard-step-shell.tsx`** — reusable shell. Pages pass `backHref`, `continueHref`, `canContinue`, `onBeforeContinue`. Renders Back link + children + full-width Continue button.

**`prototype/lib/wizard-storage.ts`** — sessionStorage under `relaykit_wizard` key. `WizardData` fields: `vertical`, `businessName`, `industry`, `serviceType`, `website`, `context`, `verifiedPhone`, `ein`, `businessIdentity`. Exposes `VERTICAL_LABELS` for the nav pill.

**`wizardFadeIn` keyframe** in `globals.css` — shared by `/start/business` (EIN expand) and `/start/details` (service type reveal).

**`WizardContinueContext`** — lets `/apps/[appId]/*` pages register `{onClick, disabled}` to override WizardLayout's header Continue button. Register inside a `useEffect` and `return () => setOverride(null)` on unmount.

---

## Key Decisions Referenced

- D-279: Website authors, SDK delivers
- D-293: Compliance at authoring time, not send time
- D-294: Marketing auto-submits or activates on-demand
- D-295: No expansion modal
- D-296: SDK and API are equal paths
- D-300: Intake interview with Claude on backend
- D-301: Locked variable schemas per message type
- D-302: EIN required for any second campaign (amended — any second campaign, not just marketing)
- D-303: Business identity pre-validation from EIN lookup
- D-304: Symmetrical pricing — first campaign $19, second $29
- D-305: Marketing-only is valid standalone
- D-310: EIN and business identity are per-app, not per-account
- D-311: Multiple categories submit simultaneously at registration — no sequencing
- D-312: TCR allows up to 5 campaigns per brand; v1 supports max 2
- D-313: Pre-auth message send requires special endpoint or session token
- D-314: ~~Single $99 go-live fee~~ — superseded by D-320
- D-315: Price revealed at signup step
- D-316: Signup is a wizard step, not a separate decision moment
- D-317: Opt-in form removed from wizard flow. Post-onboarding viewable on demand (modal or slideout). Design TBD.
- D-318: Messages wizard step has Continue ("Start building") at top and bottom
- D-319: Compliance restore replaces full message with clean variant, not a partial patch
- D-320: Registration fee $49 flat. No split, no go-live fee. $19/mo unchanged. Supersedes D-314 and D-193/D-216.

---

## What This Replaces in the Current Prototype

**Removed (done):**
- Compliance alerts system (D-293)
- Marketing expansion modal (D-294, D-295)
- Global style pill bar, Personalize slideout, Show template, Copy all
- PlaybookSummary flow diagram, AI tool setup dropdown, ToolPanel
- Download/Re-download CTAs
- Card numbers, per-card copy/template toggle, "Modify with AI" accordion
- Opt-in form right column on messages page (D-317)
- "Current" pill + Accept/Revert preview flow
- Opt-in wizard step (removed from flow, page returns null)
- Old 4-step "Build your SMS feature" onboarding wizard

**Preserved:**
- Registration status timeline stepper — good design, stays in post-registration Overview
- Approved-state metrics cards (Delivery, Recipients, Usage & Billing) — stays in Overview
- Settings page structure for post-registration — grows from sandbox Settings

---

## Build Phases

### Phase 1: Workspace Reshape ✅ DONE
Messages-first workspace. Overview tab removed in sandbox. Tab bar hidden in Default state.

### Phase 2: Message Card Redesign ✅ DONE
New default/edit card states. Style pills (Standard/Friendly/Brief/Custom). AI help input with sparkle icon. Compliance checks with Restore. Single-card editing. Phone01 send icons in wizard.

### Phase 2.5: Error States Design Session (PM + Joel, no CC)
Walk through every interaction that can fail before locking in copy. Key interactions: EIN verification, phone OTP, AI rewrite, compliance, network errors, signup OTP.

### Phase 3: Wizard Flow ✅ DONE
Full wizard entry flow: vertical picker → business name + EIN → service context → website → context → phone verify → messages → ready → signup. Layout architecture, shared infrastructure, sessionStorage persistence, all verification states.

### Phase 3.5: Get Started Page (NEXT)
Tool picker, API key, setup prompt. The momentum bridge between signup and dashboard.

### Phase 3.6: Wire Wizard Data Into Messages
Read sessionStorage business name and service type, interpolate into message card templates. Currently messages show hardcoded demo data.

### Phase 4: Demo Functionality
Demo list management, per-session selection, recipient picker, invite link, test activity log.

### Phase 5: Go Live Flow
Pre-filled registration confirmation screen. Depends on EIN verification backend (D-302, D-303).

---

## Visual Design Strategy

Untitled UI is being used as a wireframe kit, not as the final visual identity. A dedicated visual design sprint will happen after the product shape stabilizes.

**What this means for CC:**
- Use Untitled UI components for structure and behavior
- Do not treat Untitled UI's visual style as the brand
- Prepare for a clean reskin — semantic color tokens, functional component names, thin remappable token layer
- Animations come last — no animations now except functional transitions

---

## Notes for CC

- Read VOICE_AND_PRODUCT_PRINCIPLES_v2.md before writing any user-facing copy
- Read UNTITLED_UI_REFERENCE.md for component patterns, color tokens, and icon usage
- The prototype uses Untitled UI components, Tailwind v4.1, React Aria foundations — use them
- Do not invent new color tokens or typography scales — use the existing system
- The aesthetic should be clean, confident, and minimal. Precision over flair.
- Every screen should feel like less than the current prototype, not more. We are subtracting.
- **No explaining our process in UI copy.** Questions ask. Previews show. If you're tempted to add an explanation, cut it.
- **Multi-tenant aware.** All state scoped to `appId`, not `userId`. URL structure: `/apps/[appId]/`.
- **The spec file builds everything.** All messages available from day one. The messages page is for reviewing, editing, and testing — not enabling.
- **TopNav wizard detection** uses pathname regex. `/start` and `/start/*` get wordmark-only. `/apps/*/messages|ready|signup` in Default state get wizard nav. New wizard pages need to update both patterns.
- **WizardLayout's getPageConfig** is pathname-driven. New wizard steps under `/apps/[appId]/` need entries (backHref, continueHref, continueLabel, dualContinue).
- **`/start/*` pages use WizardStepShell**, not WizardLayout. Different plumbing, same visual result.
- **Variant IDs are stable** (standard / action-first / context-first) even though labels changed. Don't rename the IDs.
- **Public marketing page** at `/sms/[category]/page.tsx` has its own variant data with old labels — separate from in-app pills.
- **OTP is inlined in 3 places** (`/start/verify`, `/apps/[appId]/signup`, sign-in modal). Extract to shared component when touching any of them.
