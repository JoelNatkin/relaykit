# UX Prototype Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a standalone UI prototype in `/prototype` proving the zero-signup-wall flow: category chooser → personalization → plan builder with live consent preview + compliance checklist. No database, no auth, no API calls — pure UI with hardcoded data, React state, sessionStorage, and Framer Motion.

**Architecture:** Standalone Next.js 14 app in `/prototype` with its own `package.json`, running on port 3001. All data is hardcoded in local TypeScript files. State flows through React context + sessionStorage for cross-page persistence. Framer Motion handles all transitions. Zero imports from the production `src/` directory.

**Tech Stack:** Next.js 14 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion

**Source doc:** `docs/PROTOTYPE_PROPOSAL.md` — read this before starting any task.

---

## Critical Constraints

1. **DO NOT** touch anything in `src/`, `app/`, `lib/`, `components/`, or `supabase/`
2. **DO NOT** import from the production app
3. **DO NOT** connect to Supabase, Stripe, or Twilio
4. All routes live under the Next.js app in `/prototype` (the app itself serves at localhost:3001)
5. Tailwind uses standalone config — does NOT share the production `theme.css`
6. No tests — this is a throwaway visual prototype

---

## Task 1: Scaffold the standalone Next.js app

**Files:**
- Create: `prototype/package.json`
- Create: `prototype/tsconfig.json`
- Create: `prototype/next.config.ts`
- Create: `prototype/tailwind.config.ts`
- Create: `prototype/postcss.config.js`
- Create: `prototype/app/globals.css`
- Create: `prototype/app/layout.tsx`
- Create: `prototype/app/page.tsx`

**Step 1: Create `prototype/package.json`**

```json
{
  "name": "relaykit-prototype",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "framer-motion": "^11.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.7.0",
    "tailwindcss": "^4.1.0",
    "@tailwindcss/postcss": "^4.1.0"
  }
}
```

**Step 2: Create `prototype/tsconfig.json`**

Standard Next.js tsconfig with `@/*` path alias pointing to `./`.

**Step 3: Create `prototype/next.config.ts`**

Minimal config — no rewrites, no env vars.

**Step 4: Create `prototype/postcss.config.js`**

```js
module.exports = { plugins: { "@tailwindcss/postcss": {} } };
```

**Step 5: Create `prototype/app/globals.css`**

Import Tailwind v4 via `@import "tailwindcss"`. Define a minimal brand color scale (purple, matching Untitled UI brand). Define semantic color aliases for the prototype only — `--color-brand-500`, `--color-brand-600`, etc. Keep it simple: 5-6 brand shades, gray scale from Tailwind defaults.

**Step 6: Create root layout and placeholder home page**

Root layout: html + body wrapper, import globals.css, sans-serif font.
Home page: redirect to `/choose` (category chooser).

**Step 7: Install dependencies and verify dev server starts**

```bash
cd prototype && npm install && npm run dev
```

Expected: Dev server running on http://localhost:3001, showing placeholder page.

**Step 8: Commit**

```
feat(prototype): scaffold standalone Next.js app on port 3001
```

---

## Task 2: Hardcoded data layer

**Files:**
- Create: `prototype/data/messages.ts`
- Create: `prototype/data/categories.ts`
- Create: `prototype/data/docs.ts`

**Step 1: Create category definitions in `prototype/data/categories.ts`**

Export a `Category` interface and `CATEGORIES` array. Each category has:
- `id`: string slug (e.g., `"verification"`, `"appointments"`)
- `label`: display name
- `icon`: emoji or icon name (use emoji for prototype simplicity)
- `description`: one-line description for tile
- `modalContent`: 3-4 line confirmation copy (from PROTOTYPE_PROPOSAL.md Section 2, Screen 1)
- `coversLine`: the "Covers: ..." line
- `personalizationFields`: array of `{ key, label, placeholder, required }` (from proposal Section 2, Screen 2 table)

Include all 8 categories + "Just exploring" from the proposal. Full modal content for all 8 categories is specified in the proposal.

**Step 2: Create message templates in `prototype/data/messages.ts`**

Export a `Message` interface and `MESSAGES` record keyed by category ID. For the prototype, include full message sets for two categories:

**Verification (5 base + 3 expansion):**

| ID | Name | Tier | Default On | Template | Trigger |
|----|------|------|-----------|----------|---------|
| `verification_login_code` | Login verification code | core | yes | `"{app_name} verification code: {code}. Expires in 10 minutes. If you didn't request this, ignore this message."` | When user requests login OTP |
| `verification_signup_code` | Signup verification | core | yes | `"{app_name}: Use code {code} to verify your phone number. Expires in 5 minutes."` | During account registration |
| `verification_password_reset` | Password reset code | also_covered | no | `"{app_name}: Your password reset code is {code}. Expires in 10 minutes. If you didn't request this, secure your account immediately."` | When user requests password reset |
| `verification_mfa_code` | Multi-factor auth code | also_covered | no | `"{app_name}: Your security code is {code}. Do not share this code. Expires in 5 minutes."` | When MFA is triggered |
| `verification_device_confirmation` | New device alert | also_covered | no | `"{app_name}: A new device signed in to your account. If this wasn't you, reset your password at {website_url}."` | New device login detected |
| `verification_security_tip` | Security tip | expansion | no | `"{app_name}: Security tip — enable two-factor authentication to protect your account. Set it up at {website_url}/settings. Reply STOP to opt out."` | After account creation |
| `verification_welcome` | Welcome message | expansion | no | `"{app_name}: Welcome! Your account is verified. Get started at {website_url}. Reply STOP to opt out."` | After successful verification |
| `verification_feature_announcement` | Feature announcement | expansion | no | `"{app_name}: New feature — you can now use passkeys for faster login. Learn more: {website_url}/blog. Reply STOP to unsubscribe."` | Manually sent |

**Appointments (4 base + 2 expansion) — for cross-category demo:**

| ID | Name | Tier | Default On | Template | Trigger |
|----|------|------|-----------|----------|---------|
| `appointments_confirmation` | Booking confirmation | core | yes | `"{business_name}: Your {service_type} appointment is confirmed for {date} at {time}. Reply STOP to opt out."` | When appointment booked |
| `appointments_reminder` | Appointment reminder | core | yes | `"{business_name}: Reminder — your {service_type} appointment is tomorrow at {time}. Reply STOP to opt out."` | 24h before appointment |
| `appointments_reschedule` | Reschedule notice | also_covered | no | `"{business_name}: Your {service_type} appointment has been rescheduled to {date} at {time}. Reply STOP to opt out."` | When appointment rescheduled |
| `appointments_cancellation` | Cancellation notice | also_covered | no | `"{business_name}: Your {service_type} appointment on {date} has been cancelled. To rebook, visit {website_url}. Reply STOP to opt out."` | When appointment cancelled |
| `appointments_promo` | Promotional offer | expansion | no | `"{business_name}: Book your next {service_type} appointment this week and get 15% off! Visit {website_url}. Reply STOP to unsubscribe."` | Manually sent |
| `appointments_feedback` | Feedback request | expansion | no | `"{business_name}: How was your {service_type} appointment? Rate your experience: {website_url}/review. Reply STOP to opt out."` | After appointment |

Each message also has:
- `requiresStop`: boolean (false for verification base messages per compliance rules, true for all others)
- `expansionType`: `"mixed"` | `"marketing"` | null

**Step 3: Create fake docs content in `prototype/data/docs.ts`**

Export three string constants: `BUILD_SPEC_CONTENT`, `SMS_GUIDELINES_CONTENT`, `API_REFERENCE_CONTENT`. Short realistic markdown-ish content (10-20 lines each). These render on the docs page later. Use `{app_name}` placeholders that get replaced at render time.

**Step 4: Commit**

```
feat(prototype): add hardcoded category, message, and docs data
```

---

## Task 3: Session context provider

**Files:**
- Create: `prototype/context/session-context.tsx`
- Modify: `prototype/app/layout.tsx` — wrap children in provider

**Step 1: Create `prototype/context/session-context.tsx`**

A React context + provider that manages:

```typescript
interface SessionState {
  // Personalization
  appName: string;          // "Preview as" name
  website: string;          // optional website
  serviceType: string;      // category-specific (appointments)
  productType: string;      // category-specific (orders)

  // Category selection
  selectedCategory: string | null;

  // Message plan — which messages are toggled on/off, keyed by message ID
  enabledMessages: Record<string, boolean>;

  // Message edits — custom text overrides, keyed by message ID
  messageEdits: Record<string, string>;
}
```

Provider reads initial state from `sessionStorage` key `"relaykit_prototype"` in a `useEffect` (SSR-safe). Every state update writes back to sessionStorage. Expose `setAppName()`, `setWebsite()`, `setServiceType()`, `setCategory()`, `toggleMessage()`, `editMessage()`, `resetMessages()` actions.

When `selectedCategory` changes and `enabledMessages` is empty for that category, initialize from the category's default-on messages.

**Step 2: Wrap layout in provider**

**Step 3: Commit**

```
feat(prototype): add session context with sessionStorage persistence
```

---

## Task 4: Shared layout — top nav bar

**Files:**
- Create: `prototype/components/top-nav.tsx`
- Modify: `prototype/app/layout.tsx` — add TopNav

**Step 1: Create `prototype/components/top-nav.tsx`**

Simple top nav bar:
- Left: "RelayKit" wordmark (text, not image) + category/project name from context (if set)
- Center: nothing yet (tab nav comes later)
- Right: "Register →" CTA button (does nothing in prototype, styled as primary brand button)

Styled with Tailwind. Fixed top, white background, bottom border.

**Step 2: Add to layout**

**Step 3: Commit**

```
feat(prototype): add top navigation bar
```

---

## Task 5: Category chooser screen

**Files:**
- Create: `prototype/app/choose/page.tsx`
- Create: `prototype/components/category-tile.tsx`
- Create: `prototype/components/category-modal.tsx`

**Step 1: Create `prototype/app/choose/page.tsx`**

Page heading: "What are you building?" with subtext "Pick your primary use case — you can always change this later."

Renders a 3×3 grid (last cell = "Just exploring") of `CategoryTile` components. Uses `CATEGORIES` from data layer.

**Step 2: Create `prototype/components/category-tile.tsx`**

Each tile shows:
- Emoji icon (top)
- Category label (bold)
- One-line description

On click: opens the confirmation modal for that category. Framer Motion: `whileHover` scale(1.02), `whileTap` scale(0.98).

Staggered entrance animation: tiles fade in + slide up with 50ms stagger using Framer Motion `variants` and `staggerChildren`.

**Step 3: Create `prototype/components/category-modal.tsx`**

Framer Motion `AnimatePresence` modal with backdrop. Content:
- Category emoji + name as header
- 3-4 line modal content from category data
- "Covers: ..." line in muted text
- "This is me → Continue" button (primary brand style)
- Close/back option

On "Continue": sets `selectedCategory` in context, navigates to `/c/[categoryId]/setup`.

Animation: backdrop fades in, modal slides up + fades in. Exit: reverse.

**Step 4: Commit**

```
feat(prototype): category chooser with confirmation modals
```

---

## Task 6: Personalization step screen

**Files:**
- Create: `prototype/app/c/[categoryId]/setup/page.tsx`

**Step 1: Create personalization page**

Reads `categoryId` from params. Looks up category from `CATEGORIES`. Shows category-specific fields from `personalizationFields`.

Layout:
- Category emoji + "Almost there" or similar light header
- Fields rendered dynamically from category config
- Each field has its label + one-line benefit explanation as helper text (from proposal: "This appears in every text your users receive")
- Placeholder text shows format examples (e.g., "Acme", "dental, hair salon")
- "Continue →" button navigates to `/c/[categoryId]/plan`
- "Skip for now →" link also navigates to plan (fields stay empty, templates show raw `{app_name}`)

Fields update session context on change. If context already has values (returning user or cross-category), pre-populate.

Framer Motion: fields stagger in. Entire card slides in from right.

**Step 2: Commit**

```
feat(prototype): personalization step with category-specific fields
```

---

## Task 7: Plan builder page — scaffold and "Preview as" input

**Files:**
- Create: `prototype/app/c/[categoryId]/plan/page.tsx`
- Create: `prototype/components/plan-builder/preview-as-input.tsx`

**Step 1: Create plan builder page scaffold**

Single-column layout. Sections (top to bottom):
1. "Preview as" input (this task)
2. Consent form preview (Task 8)
3. Compliance checklist (Task 9)
4. Message cards by tier (Task 10)

For now, render the "Preview as" input and placeholder divs for the other sections.

**Step 2: Create `PreviewAsInput` component**

Persistent input at the top: **"Preview as:"** label + text input. Pre-populated from `appName` in session context. On change, updates context (which updates all previews via reactivity).

Styled as a subtle inline input — not a full form field. Light underline or minimal border.

**Step 3: Commit**

```
feat(prototype): plan builder page scaffold with preview-as input
```

---

## Task 8: Live consent form preview

**Files:**
- Create: `prototype/components/plan-builder/consent-preview.tsx`
- Modify: `prototype/app/c/[categoryId]/plan/page.tsx` — wire in

**Step 1: Create `ConsentPreview` component**

A realistic-looking embedded form in a phone-frame or browser-frame wrapper. Shows what the developer's end-users will see.

Content (all reactive to context):
- Header: app/business name (from context, or `"{Your App}"` placeholder)
- Body text: "By checking this box, you agree to receive the following text messages from **{app_name}**:"
- Bullet list of enabled message types (only messages currently toggled on)
  - e.g., "• Login verification codes", "• Signup verification codes"
  - Bullets animate in/out as messages are toggled (Framer Motion `AnimatePresence` + `layout`)
- Opt-out language: "Reply STOP to any message to opt out" — styled in the same accent color used for STOP in message cards (visual chain per proposal)
- Privacy Policy / Terms links (placeholder `#` hrefs)
- Checkbox: "I agree to receive text messages from **{app_name}**"

**When any expansion message is toggled on**, a second section appears (animated):
- Divider
- "Marketing messages" sub-header
- Second checkbox: "I agree to receive marketing messages from **{app_name}**"
- This is the key teaching moment — the developer sees WHY expansion needs separate consent

Frame wrapper: rounded border, subtle shadow, "phone screen" aspect ratio or browser chrome mockup. Light gray background behind the form.

**Step 2: Wire into plan builder page**

**Step 3: Commit**

```
feat(prototype): live consent form preview with expansion teaching moment
```

---

## Task 9: Compliance checklist

**Files:**
- Create: `prototype/components/plan-builder/compliance-checklist.tsx`
- Modify: `prototype/app/c/[categoryId]/plan/page.tsx` — wire in

**Step 1: Create `ComplianceChecklist` component**

Deterministic checklist between consent preview and message cards. Reads from session context to compute status.

**Checklist items:**

| # | Element | Check logic | Status when met | Status when missing |
|---|---------|------------|-----------------|---------------------|
| 1 | Business/app name identified | `appName` is non-empty in context | ✅ green | ❌ red |
| 2 | Opt-out language present | All enabled non-OTP messages contain "STOP" (check `messageEdits` or default template) | ✅ green | ❌ red |
| 3 | Opt-out not required (OTP) | For verification base messages — these don't need STOP | ➖ neutral dash | n/a |
| 4 | Message type coverage | At least 1 message enabled | ✅ green | ❌ red |
| 5 | Separate consent for marketing | If any expansion message enabled → consent preview shows second checkbox | 🟡 yellow (advisory) | n/a (not shown if no expansion) |

Each row: status icon + element name + one-line explanation.

**Color-coding links the checklist to the consent form and message cards:**
- "STOP" text in checklist, consent form, and message cards all use the same accent color
- App name uses the same highlight color across all three

Framer Motion: status icon transitions (color fade, subtle scale pulse on change).

**Step 2: Wire into plan builder page**

**Step 3: Commit**

```
feat(prototype): deterministic compliance checklist with visual linking
```

---

## Task 10: Message cards (three tiers)

**Files:**
- Create: `prototype/components/plan-builder/message-card.tsx`
- Create: `prototype/components/plan-builder/message-tier.tsx`
- Create: `prototype/components/plan-builder/message-edit-modal.tsx`
- Modify: `prototype/app/c/[categoryId]/plan/page.tsx` — wire in

**Step 1: Create `MessageCard` component**

Each card shows:
- Toggle switch (on/off) — updates `enabledMessages` in context
- Message name (human-readable)
- Message preview — personalized with app name from context, runtime variables rendered as realistic placeholders:
  - `{code}` → random 6-digit number (e.g., "283947") with subtle highlight background
  - `{date}` → "Mar 15, 2026" with highlight
  - `{time}` → "2:30 PM" with highlight
  - `{app_name}` → actual app name from context (or `"{Your App}"`)
  - `{website_url}` → website from context (or `"yourapp.com"`)
- Trigger description in muted text: "When user requests login OTP"
- "Edit" button → opens edit modal
- For expansion (⭐) messages: one-line note below in amber/yellow: "We register a separate campaign alongside yours"

"STOP" keyword in message text is rendered in the same accent color used in consent preview and checklist.

Framer Motion: cards stagger in. Toggle animates. Expansion note slides in when expansion card is toggled on.

**Step 2: Create `MessageTier` component**

Groups cards under a tier header:
- **CORE MESSAGES** — subtext: "On by default — most apps need these"
- **ALSO COVERED** — subtext: "Your registration includes these — turn on what you need"
- **⭐ NEEDS ADDITIONAL REGISTRATION** — subtext: "We register a separate campaign alongside yours"

Uses Framer Motion `layout` for smooth reflows when cards toggle.

**Step 3: Create `MessageEditModal` component**

Simple modal with textarea pre-filled with message text. Save updates `messageEdits` in context. Cancel closes. Framer Motion entrance/exit.

If the user removes "STOP" from a message that requires it, the compliance checklist immediately flips to red — no warning modal, just the visible broken link.

**Step 4: Wire tiers into plan builder page**

Filter messages by category from `MESSAGES` data. Group by tier. Render three `MessageTier` sections.

**Step 5: Commit**

```
feat(prototype): three-tier message cards with edit, toggle, and live preview
```

---

## Task 11: Variable rendering utility

**Files:**
- Create: `prototype/lib/render-message.tsx`

**Step 1: Create `renderMessage()` utility**

Takes a template string and context values, returns React nodes (not a plain string) so that:
- `{app_name}` → bold text with app name
- `{code}` → `<span>` with highlight background + realistic random number
- `{date}`, `{time}` → `<span>` with highlight + realistic values
- `{website_url}` → text with website value
- `STOP` → `<span>` with accent color (matching consent preview + checklist)

This is used by both `MessageCard` and `ConsentPreview` to keep visual linking consistent.

**Step 2: Update MessageCard and ConsentPreview to use this utility**

**Step 3: Commit**

```
feat(prototype): variable rendering utility with visual linking
```

---

## Task 12: Cross-category personalization demo

**Files:**
- Modify: `prototype/app/c/[categoryId]/setup/page.tsx` — show pre-filled shared fields
- Modify: `prototype/context/session-context.tsx` — ensure shared fields persist across categories

**Step 1: Verify cross-category persistence**

Navigate: choose Verification → enter "Acme" as app name → go back → choose Appointments → personalization step should show "Acme" pre-filled in "Business name" field.

This should work automatically via sessionStorage persistence. The key behavior: `appName` maps to whatever the category calls it ("App name" for verification, "Business name" for appointments). The field key is the same (`appName`) — only the label changes per category.

Ensure `resetMessages()` is called when category changes so the correct default-on messages load.

**Step 2: Verify plan builder shows personalized messages**

On the appointments plan builder, messages should say "Your Acme appointment..." if "Acme" was entered during verification setup.

**Step 3: Commit**

```
feat(prototype): verify cross-category personalization persistence
```

---

## Task 13: Polish and animation pass

**Files:**
- All components created in Tasks 5–11

**Step 1: Page transition animations**

Add `motion.div` wrappers on each page with enter/exit transitions:
- Category chooser → modal: modal overlays
- Modal "Continue" → setup: slide left transition
- Setup "Continue" → plan builder: slide left transition
- Back navigation: slide right

Use Framer Motion `AnimatePresence` with `mode="wait"` in the layout for page transitions.

**Step 2: Micro-interactions audit**

- Consent preview bullets: `AnimatePresence` + `motion.li` with height animation
- Checklist status icons: color transition + subtle scale pulse
- Message card toggles: smooth slide
- "Preview as" input: text in previews crossfades on change (use `motion.span` with `key={appName}`)

**Step 3: Commit**

```
feat(prototype): animation polish pass
```

---

## Deferred Tasks (build after core is validated)

These are listed in the proposal but are lower priority than the consent preview + checklist proof-of-concept:

- **Task D1: Category landing page** (`/c/[categoryId]/page.tsx`) — SEO-style content page with personalized examples
- **Task D2: Docs page** (`/docs/page.tsx`) — tabbed reading experience (Build Spec / SMS Guidelines / API Reference)
- **Task D3: Signup screen** (`/signup/page.tsx`) — email input at "Get your API key" moment
- **Task D4: Post-registration dashboard** (`/dashboard/page.tsx` + `/dashboard/registered/page.tsx`) — overview with read-only plan builder, compliance tab, progress stepper
- **Task D5: Remaining 6 categories** — message data + personalization fields for orders, support, marketing, internal, community, waitlist

---

## Execution Order Summary

| Task | What | Priority |
|------|------|----------|
| 1 | Scaffold Next.js app | Foundation |
| 2 | Hardcoded data layer | Foundation |
| 3 | Session context provider | Foundation |
| 4 | Top nav bar | Foundation |
| 5 | Category chooser + modals | Core screen |
| 6 | Personalization step | Core screen |
| 7 | Plan builder scaffold + preview-as | Core screen |
| 8 | Consent form preview | **Priority — UX innovation #1** |
| 9 | Compliance checklist | **Priority — UX innovation #2** |
| 10 | Message cards (three tiers) | Core screen |
| 11 | Variable rendering utility | Polish |
| 12 | Cross-category demo | Validation |
| 13 | Animation polish | Polish |

Tasks 1–4 are sequential (each depends on the prior). Tasks 5–6 are sequential. Tasks 7–11 are sequential (building the plan builder piece by piece). Tasks 12–13 are validation/polish.
