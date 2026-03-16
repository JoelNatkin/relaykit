# CC_HANDOFF.md — Session Handoff
**Date:** 2026-03-16 (overview onboarding, route cleanup, download modal, tool selector)
**Branch:** main

---

## Commits This Session

```
9043f1b  feat: two-column overview with guided onboarding steps, registration sidebar, route cleanup
5a04888  feat: Your Apps page, project layout shell, download modal, tool selector, messages page updates
```

Previous session commits (already on main):
```
720b2b0  feat: appointments category landing + public messages page with two layout variants
06b8685  feat: marketing home page and compliance page — full revision pass
1cc2545  docs: D-101–D-104, vision implementation memo
417d205  feat: settings tab — SMS alerts, account info, API keys, billing (D-98, D-99)
```

---

## What We Completed

### Tool Selector Overhaul (messages page, steps layout)
- Replaced placeholder SVG icons with real brand logos from `prototype/public/logos/`
- Logos: claude-logo.svg, cursor-logo.svg, windsurf-logo.svg, github-copilot-logo.svg, cline-logo.svg
- Selection state: 2px solid purple border on circle, no background fill. Unselected: 1px solid #999, 60% opacity.
- Per-tool instructions rewritten as two-line pattern: setup text + mono code block with copy button
- All six tools have a prompt now (including "Other")
- Section heading: "Follow the steps for your tool."

### Download Modal (4 states)
- **State 1 (default):** "Get more from RelayKit with an account" — two grouped benefit lists, email field, "Create Account & Download" CTA, "Just the files please" link
- **State 2 (code entry):** 6-digit OTP with individual digit boxes (auto-advance, backspace, paste support), "Confirm" button
- **State 3 (downloading, account path):** Green checkmark, "You're in. Downloading RelayKit..."
- **State 4 (files-only):** File download icon, "You're all set. Downloading now." with "Create an account later" soft re-invitation
- Modal: max-w-md, rounded-xl, X close, Escape close, bg-black/50 overlay

### Steps Layout Now Default
- `/sms/appointments/messages` (no param) → steps layout
- Old layout preserved at `?layout=default`

### Your Apps Page (`/apps`)
- Grid of project cards (one column mobile, two desktop)
- One hardcoded project: GlowStudio, Appointments, Sandbox, March 16 2026
- Cards link to `/apps/[appId]/overview`
- "+ New project" button (placeholder)

### Project Layout Shell (`/apps/[appId]/layout.tsx`)
- Breadcrumb: "Your Apps / {AppName}"
- Four tabs: Overview, Messages, Registration, Settings
- Purple underline on active tab
- No state toggle, no A/B/C switcher (removed)

### Overview Page — Guided Onboarding (`/apps/[appId]/overview`)
Two-column layout with 4-step sequential onboarding:

**Left column (3/5):**
- Step 1: "Where should test messages go?" — phone verification with OTP
- Step 2: "Send a test message" — dropdown picker (4 appointment messages), preview, "Send test" with animation → "Delivered"
- Step 3: "Now you send one" — Node.js code snippet with copy, "I sent it ✓" self-report
- Step 4: "Build your SMS feature" — 6-tool selector (same logos as messages page), per-tool instructions, "I built it ✓"
- Steps have locked/active/completed states, vertical timeline connector, sequential unlocking
- Completing all 4 → celebration: "You built it. It works. Now let's make it real."

**Right column (2/5):**
- Sticky registration card with subtle purple background
- 6 benefits with purple checkmarks
- Pricing: $199 setup + $19/mo, "Not approved? Full refund." (D-105)
- "Start registration →" primary CTA
- Progress bar: "Setup progress: N of 4 complete" with 4 dots

### Route Cleanup
- **Deleted:** `/dashboard-a`, `/dashboard-b`, `/dashboard-c`, `/choose`, `/apps/[appId]/compliance`
- **Top nav simplified:** Logged out = Home, Appointments, Messages, Sign in. Logged in = Your Apps, Sign out.
- **Auth flow:** radarlove → glowstudio, redirects to `/apps/glowstudio/overview`
- **Category modal:** `/c/{id}/setup` → `/sms/{id}/messages`
- **Category page:** "See all categories" → `/` (homepage)
- **App messages tab:** Reuses public messages page component (same content)
- **Shared footer:** `components/footer.tsx`, removed /about and /blog links, legal links → `#`

### Decisions Added
- **D-113** updated: Steps layout is now the default (not TBD)
- **D-114:** Download modal with account upsell and files-only path
- **D-115:** Tool selector uses real SVG logos
- **D-116:** Your Apps page and project layout shell
- **D-117:** Standalone dashboards A/B/C deleted
- **D-118:** Top nav simplified — no per-project links
- **D-119:** Overview page is guided onboarding, not a dashboard
- **D-120:** App messages tab reuses public messages page
- **D-121:** Shared footer component, dead links removed

---

## Gotchas for Next Session

1. **Delete `.next` before every dev server start.** Cache corruption is recurring. Always: stop → `rm -rf prototype/.next` → restart.

2. **Dev server runs on port 3001** — the `npm run dev` script in prototype uses `-p 3001`, not 3000. Port 3000 is the production app.

3. **`@untitledui/icons` name check**: `ShieldCheck` does NOT exist — use `ShieldTick`. Always verify icon names before using them.

4. **Auth flow is fully mocked** — no Supabase. The "Sign in" toggle in the top nav flips `isLoggedIn` in session context. The `/auth` page simulates a magic link flow. No real authentication.

5. **No Untitled UI base components in prototype** — plain Tailwind with semantic color tokens only.

6. **SessionStorage key**: `relaykit_prototype` (session context). **localStorage key**: `relaykit_personalize` (messages page personalization). These are separate storage mechanisms.

7. **DECISIONS.md now has 121 decisions** (D-01 through D-121).

8. **D-104 gate still active**: PRDs must be updated to reflect D-84–D-103 before any production code is built from them.

9. **Dashboard A/B/C components still exist** in `components/dashboard/` but are no longer imported by any page. They also reference `sample-data.ts` which still uses "RadarLove" naming. These are inert — can be deleted if we're sure we won't need them.

10. **The `/c/` routes still exist** (`/c/[categoryId]/setup`, `/plan`, `/messages`) — they're older catalog pages from early prototype work. Their `/choose` redirects were fixed to `/`, but the pages themselves are largely orphaned. Consider deleting if not needed.

11. **App messages tab renders the full public page** including hero, tool selector, and download modal. This is intentional per D-120 — differentiation deferred to a later session.

12. **Overview onboarding steps are client-side state only** — refreshing the page resets progress. Persisting step completion (e.g., localStorage or server) is not yet implemented.

13. **Registration and Settings tabs are placeholders** — Registration says "coming soon", Settings is the full existing settings page from the old dashboard.

14. **The compliance page at `/apps/[appId]/compliance` was deleted** — compliance monitoring will live on the Overview page or as part of Registration in a future session.

---

## Prototype File Map (updated)

```
prototype/
├── app/
│   ├── page.tsx                          # Marketing home
│   ├── compliance/page.tsx               # Public compliance page
│   ├── auth/page.tsx                     # Auth gate (5-step mock, redirects to glowstudio)
│   ├── apps/
│   │   ├── page.tsx                      # Your Apps (project list)
│   │   └── [appId]/
│   │       ├── layout.tsx                # Per-app shell (breadcrumb + 4 tabs)
│   │       ├── page.tsx                  # Redirects to /overview
│   │       ├── overview/page.tsx         # Guided onboarding (4 steps + registration sidebar)
│   │       ├── messages/page.tsx         # Renders public messages page component
│   │       ├── registration/page.tsx     # Placeholder
│   │       └── settings/page.tsx         # Settings tab (alerts, keys, billing)
│   ├── sms/[category]/
│   │   ├── page.tsx                      # Category landing (appointments has full content)
│   │   └── messages/page.tsx             # Public messages page (steps layout default)
│   ├── c/[categoryId]/                   # Legacy catalog routes (orphaned, consider deleting)
│   │   ├── setup/page.tsx
│   │   ├── plan/page.tsx
│   │   └── messages/page.tsx
│   └── ...
├── components/
│   ├── top-nav.tsx                       # Simplified context-aware nav
│   ├── footer.tsx                        # Shared footer component (NEW)
│   ├── category-modal.tsx                # Category picker modal (links to /sms/{id}/messages)
│   ├── catalog/catalog-card.tsx          # Message card with variant support
│   ├── catalog/catalog-opt-in.tsx        # Sample opt-in form
│   └── dashboard/                        # Dashboard A/B/C components (ORPHANED — not imported)
├── public/logos/                          # Real SVG logos for tool selector (NEW)
│   ├── claude-logo.svg
│   ├── cursor-logo.svg
│   ├── windsurf-logo.svg
│   ├── github-copilot-logo.svg
│   └── cline-logo.svg
├── context/session-context.tsx           # State management
├── lib/catalog-helpers.ts                # Template interpolation, copy formatting
└── data/messages.ts                      # Message library + variants
```

---

## What's Next

- Differentiate logged-in vs public messages page (D-120 deferred)
- Registration tab — intake wizard or guided flow for carrier registration
- Persist onboarding step completion (localStorage or server)
- Category landing pages beyond "appointments"
- Wire up auth gate on Download RelayKit CTA (currently opens modal)
- Consider deleting orphaned `/c/` routes and `components/dashboard/` files
- Production PRDs must be updated per D-104 before production code resumes
- ToS needs D-105 money-back guarantee language
