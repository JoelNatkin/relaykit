# CC_HANDOFF.md — Session Handoff
**Date:** 2026-03-25 (category page scope, Overview restructure, registration form flow, review simplification, pricing updates)
**Branch:** main

---

## Commits This Session

```
9182d1d  feat: category page registration scope, Overview restructure (compliance card, simplified sidebar), registration form flow, review page simplification, pricing updates, copy refinements across all pages
```

---

## What We Completed

### Decisions D-228–D-233 Recorded
- D-228: Flow diagram strategy per category (diagram vs. sentence-only)
- D-229: Orders flow diagram shape (linear + branch tags)
- D-230: RegistrationScope on category landing pages (display-only, not wizard)
- D-231: RegistrationScope renders as two sections (covers + marketing), no negative framing
- D-232: Twilio-only registration service rejected
- D-233: Overview restructure — sandbox compliance card, simplified sidebar, sections removed

### Category Landing Page — Registration Scope (D-230, D-231)
- New "Your registration" section with eyebrow + "What's included from day one" heading
- Block 1: "What your registration covers" — green check items from `USE_CASES[category].included`
- Block 2: "Need marketing messages too?" — no negative framing, two example message cards (promotional offer, feedback request) with brand-purple variable styling
- EIN/sole prop note added: "Note: adding a marketing campaign requires an EIN."
- "What you get" section wrapped in full-width gray band (viewport-width CSS trick)
- FAQ section reduced from 3 to 2 cards, body text capped at 600px
- FAQ copy updated: "Why can't I just register myself?" and "What happens after I'm approved?"

### Overview Page Restructure (D-233)
- **Removed** "Register your app" expander (all states)
- **Removed** "Monitor your compliance" expander (all states)
- **Added** sandbox compliance card above Build steps — shows compliance rate (100% green or 97.2% amber), active issues with Fix → links, alert detail modal with `bg-black/50` backdrop
- **Simplified** registration sidebar: "Ready to go live?" heading, one-sentence body, pricing "$49 to submit, $150 + $19/mo after approval", medium purple CTA button
- Sidebar card: `bg-bg-tertiary` (neutral gray), no border, `rounded-xl p-6`
- Grid changed from `lg:grid-cols-5` to `md:grid-cols-[1fr_320px]` — stacks at 768px not 1024px
- SectionHeading: checkbox removed, chevron-only toggle
- Left column capped at `max-w-[560px]`
- Content top padding reduced from 32px to 24px (`pt-6`)
- Mobile gap tightened from 48px to 24px

### Registration Form Flow — NEW
- **`/apps/[appId]/register`** — BusinessDetailsForm with left-aligned layout (`max-w-[640px]`), tab bar hidden
- **`/apps/[appId]/register/review`** — ReviewConfirm, tab bar hidden, reads from sessionStorage
- "Start registration" button on Overview links to `/apps/[appId]/register` (modal removed)
- Info callout with `bg-indigo-50` explaining carrier comparison
- Pre-fill state switcher (Empty / Pre-filled) with full GlowStudio mock data
- Continue button always active — touches all fields + scrolls to top on invalid click

### Registration Form Copy Refinements
- Business name placeholder: "Your app or brand name"
- Business name helper: "This should match or be clearly associated with your registered business name"
- Description label: "What does your app do?" — example: "Manages appointments and sends reminders for a hair salon"
- Character counter removed from business name (kept on description)
- EIN question: red asterisk added, helper text "independent developer" (not "hobbyist")
- Sole prop note: warns about one-campaign limit, suggests EIN for marketing
- Address label: "Business address (sole proprietors can use a home address)" inline
- Phone label: "US mobile phone number"
- Email helper: "We'll send your registration updates here"
- EIN helper: "Must match the business name and address associated with this EIN"
- Government added to business type options
- Custom SVG chevrons on all select elements (`appearance-none` + background-image)
- Phone helper: "We'll send a verification code to this number"

### Review Page Simplification
- Right column replaced: removed campaign description, sample messages, FAQ accordions, compliance site, what happens next, plan summary
- New right column: compact "What happens next" card — 3 numbered steps
- Pricing: $49 registration submission / $49 due today + post-approval details
- CTA: "Start my registration — $49"

### Cross-Page Updates
- EIN/sole prop marketing note added to all "Need marketing messages too?" sections (3 pages, 4 instances)
- "How it works" modal: 32px bottom padding added below CTA
- Flow diagram: mobile tooltips positioned right of circles (not above), labels vertically centered
- AI tool setup panel: larger heading (`text-lg`), more top margin and padding
- App layout: forces `isLoggedIn(true)` on mount

---

## In Progress / Partially Done

### Pricing Audit Needed
$49/$150 split pricing updated on Overview sidebar and review page. Other pages (home page, category landing, public messages "How it works" modal) may still show $199. Need full audit.

### Messages Tab — Approved State
Still not differentiated from Default. Planned per D-159.

### Approved Dashboard Redesign (D-233)
D-233 specifies replacing 6-card layout with message types table + 3 cards. Not built yet — separate task.

### Build Steps Collapsed State (D-233)
D-233 specifies Build steps expander collapses to "Sandbox setup complete" once all 4 steps done. Not built yet.

---

## Gotchas for Next Session

1. **Delete `.next` before every dev server start.** Always: `rm -rf prototype/.next` then restart. Port 3001.

2. **DECISIONS.md is a two-file system.** Active decisions (D-84–D-233) in DECISIONS.md. Archived (D-01–D-83) in DECISIONS_ARCHIVE.md.

3. **Registration form uses `touchAllRef` pattern.** Parent passes a `MutableRefObject<(() => void) | null>` — form populates it with a function that touches all fields and re-validates. Called on submit attempt when form is invalid.

4. **Registration form pre-fill uses `key` prop remount.** Switching Empty/Pre-filled changes the `key` on `BusinessDetailsForm`, forcing full unmount/remount with new `initialValues`.

5. **Tab bar hidden for `/register` routes.** Layout checks `pathname.includes("/register")` and conditionally hides tabs. App header (name, pill, status) stays visible.

6. **Layout forces logged-in state.** `useEffect` calls `setLoggedIn(true)` on mount. Top nav always shows "Your Apps" / "Sign out" in app context.

7. **Messages page gray band offset changed.** Layout `pt-8` → `pt-6`, so Messages page `-mt-8` → `-mt-6` to keep flush with tab bar.

8. **Registration components use plain HTML form elements.** No Untitled UI Input/Select. Custom SVG chevrons via `selectClass()` helper (`appearance-none` + background-image).

9. **Review page reads from sessionStorage key `relaykit_registration`.** If no data found, shows fallback with link back to form.

10. **Pricing is $49/$150 split (D-193).** Review page shows $49 due today. Overview sidebar shows "$49 to submit, $150 + $19/mo after approval". Other public pages may still show $199 — audit needed.

11. **Orphaned files still on disk** — `prototype/components/dashboard/` and `prototype/app/c/` are safe to delete.

12. **"Appointments" pill in layout.tsx is still hardcoded** — needs to be dynamic for multi-category.

---

## Files Modified This Session

```
# Decisions
DECISIONS.md                                              # D-228 through D-233

# Category landing page
prototype/app/sms/[category]/page.tsx                     # Registration scope section, FAQ update, gray band, copy

# Public messages page
prototype/app/sms/[category]/messages/page.tsx             # Marketing EIN note, flow diagram mobile fixes, modal padding

# App layout
prototype/app/apps/[appId]/layout.tsx                      # Tab bar hidden for /register, logged-in force, pt-6

# App messages page
prototype/app/apps/[appId]/messages/page.tsx               # Marketing EIN note, gray band -mt-6, tool panel spacing, flow mobile fixes

# Overview page
prototype/app/apps/[appId]/overview/page.tsx               # D-233 restructure — compliance card, simplified sidebar, sections removed

# Registration form flow (NEW)
prototype/app/apps/[appId]/register/page.tsx               # NEW — registration form page
prototype/app/apps/[appId]/register/review/page.tsx        # NEW — review & confirm page

# Registration components
prototype/components/registration/business-details-form.tsx # Copy refinements, touchAllRef, select chevrons, validation
prototype/components/registration/review-confirm.tsx        # Simplified right column, $49 pricing

# Validation
prototype/lib/intake/validation.ts                         # Government added to business types

# Session close-out
PROTOTYPE_SPEC.md                                          # Overview, category landing, registration flow, layout, file map
CC_HANDOFF.md                                              # This file (overwritten)
```

---

## What's Next (suggested order)

1. **Pricing audit** — search all files for "$199", "$218", "one-time setup" and update to $49/$150 split where appropriate
2. **Approved dashboard redesign** (D-233) — message types table + 3 cards
3. **Build steps collapsed state** — "Sandbox setup complete" row once all 4 steps done
4. **Messages tab Approved state** (D-159) — read-only personalization with registered values
5. **Flow diagrams for other categories** — orders (linear + branch tags), support, waitlist (D-228, D-229)
6. **Delete orphaned files** — `/c/` routes, `components/dashboard/`
7. **Make "Appointments" pill dynamic** in layout.tsx
8. **Align Overview `changes_requested` copy** with D-202 ("Extended Review")
