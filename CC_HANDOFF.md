# CC_HANDOFF.md — Session Handoff
**Date:** 2026-03-17 (registration lifecycle states, compliance dashboard)
**Branch:** main

---

## Commits This Session

```
[pending]  feat: registration lifecycle states (pending/approved/changes-requested/rejected) + compliance dashboard
```

Previous session commits (already on main):
```
de1cdd6  feat: three-section overview (onboarding, registration, compliance), simplified right column, tab cleanup, breadcrumb removal, redo pattern
0ea7272  docs: D-114–D-121, session handoff for 2026-03-16
9043f1b  feat: two-column overview with guided onboarding steps, registration sidebar, route cleanup
```

---

## What We Completed

### Registration Lifecycle State Machine
Added a prototype state switcher (tiny `<select>` in the H1 row, text-tertiary text-sm) that cycles through five registration states: Default, Pending, Approved, Changes Requested, Rejected. Stored in session context (`registrationState`), persisted to sessionStorage.

Each state drives conditional rendering in Section 2 ("Register your app"), the right column card, and Section 3 ("Monitor your compliance").

### Registration Modal
"Start registration" button (Default state, right column) opens a centered modal:
- "Submit your registration" heading
- Narrative body about 2–3 week review
- "$199 one-time setup fee"
- "Confirm & pay $199" primary button → flips to Pending state
- "Cancel" text button

### Pending State
**Left column (Section 2):** Brand-colored "In review" badge on heading. Narrative paragraph (bold first sentence). Collapsible "What carriers review" with 4 items (business identity, website, messages, opt-in). "Keep building" sandbox nudge.

**Right column:** "Registration status" heading. Brand badge "Under carrier review". Bold "Submitted March 17, 2026" + timeline with email notification line ("We'll email you at jen@glowstudio.com"). 6-step vertical stepper (3 completed green, 1 active brand-colored, 2 upcoming grey). "Questions?" line + hello@relaykit.ai mailto link.

### Approved State
**Section 2 heading:** Checkbox checked, green "Approved" success badge, section collapsed by default.

**Section 2 content (expanded):** Confirmation narrative + detail block (phone number +1 (555) 867-5309, approval date March 31 2026, campaign ID C-XXXXXX).

**Right column:** Green "Approved" badge. All-green 6-step stepper (all completed). Step 4 shows "Approved Mar 31", step 5 shows phone number, step 6 shows "Mar 31". Compliance monitoring note. Monthly plan reference ($19/mo · 500 messages).

**Section 3:** Auto-expands. Checkbox checked, green "Active" badge. Transforms from informational 2x2 cards into a live compliance dashboard (see below).

### Changes Requested State
**Left column:** Brand badge "Changes requested". Bold lead + detail card (What was flagged / What we did / What happens next) with hardcoded prototype content about opt-in language adjustment. Keep-building nudge.

**Right column:** Brand badge "Changes requested". Dual dates ("Submitted March 17, 2026 · Updated March 24, 2026"). 7-step stepper (step 4 completed "Changes requested Mar 22", step 5 active "Resubmission under review", steps 6–7 upcoming). Questions + email.

### Rejected State
**Left column:** Red "Not approved" error badge. Debrief narrative (uncommon, refund issued). Detail card (What carriers flagged / What this means / Your options) with hardcoded use-case mismatch example. Sandbox reassurance.

**Right column:** Red "Not approved" error badge. Green "$199 refund issued March 28, 2026". 4-step stepper (truncated — no steps 5/6). Step 2 shows "$199 refunded" in green. Step 4 has red X icon "Not approved Mar 28". "Start new registration" button (resets to Default). Questions + email.

### Compliance Dashboard (Approved state, Section 3)
**Sub-switcher:** Second tiny dropdown in H1 row, only visible when main switcher is "Approved". Options: "All clear" / "Has alerts".

**Period selector:** Right-aligned dropdown (This week / Last 7 days / This month / Last 30 days). Display-only.

**Three stat cards:**
1. Messages: 1,842 count with clean/blocked/warned breakdown
2. Status: toggles between green "All clear" and amber "Warnings" based on sub-switcher
3. Last scanned: "4 min ago" + "Monitoring is active"

**All Clear mode:** Calm confirmation line + "View your registered messages →" + collapsible "How compliance works" (4 items) + "View full message log →"

**Has Alerts mode:** Stat card 2 flips to amber "Warnings" with "2 items need attention". Two alert cards:
- Alert 1 (red left border): "Content blocked" — promotional language in transactional message. Expandable details show the blocked message, what triggered it, and what to do.
- Alert 2 (amber left border): "Drift warning" — casual message doesn't match registered format. Same expandable pattern.
Both with "View details →" toggle and inline expansion (not modal).

### Badge Styling Overhaul
- Renamed `AmberBadge` → `BrandBadge` (bg-brand-secondary + text-brand-secondary). Used for "In review" and "Changes requested".
- Added `SuccessBadge` (bg-success-secondary + text-success-primary). Used for "Approved" and "Active".
- Added `ErrorBadge` (bg-error-secondary + text-error-primary). Used for "Not approved".
- Fixed "Appointments" pill: stronger `bg-bg-brand-secondary` background, taller `py-1` padding.
- All badges use `py-1` for consistent height.
- Stepper active step icon uses brand colors (not warning).

### Stepper Refactoring
- `RegistrationStepper` now takes a `steps` prop with 4 constant arrays: `PENDING_STEPS`, `APPROVED_STEPS`, `CHANGES_REQUESTED_STEPS`, `REJECTED_STEPS`.
- Added `"error"` status to stepper (red X icon, red label text).
- Added `detailClass` prop for custom detail text colors (e.g., green "$199 refunded").
- Stepper circles vertically centered with heading text via `leading-6`.
- Step 3 "View site →" link has `ml-2` spacing from label.

### Auto-Expand Logic
- Default: first incomplete section expands
- Pending/Changes Requested/Rejected + Section 1 complete: Section 1 collapses, Section 2 expands
- Approved: Sections 1 & 2 collapse, Section 3 expands
- useEffect responds to state switcher changes

### Small Fixes
- Step 3 label/link spacing (8px gap)
- Approved step 6 "Live" shows "Mar 31" date
- Pending narrative bold first sentence
- Email below "Questions?" line (hello@relaykit.ai, mailto, text-brand-primary)
- "Submitted March 17, 2026" font-semibold
- Pending timeline includes "We'll email you at jen@glowstudio.com" (mailto link)

---

## Gotchas for Next Session

1. **Delete `.next` before every dev server start.** Cache corruption is recurring. Always: stop → `rm -rf prototype/.next` → restart.

2. **Dev server runs on port 3001** — the `npm run dev` script in prototype uses `-p 3001`, not 3000.

3. **`@untitledui/icons` name check**: `ShieldCheck` does NOT exist — use `ShieldTick`. Always verify icon names before using them.

4. **Auth flow is fully mocked** — no Supabase. The "Sign in" toggle in the top nav flips `isLoggedIn` in session context. No real authentication.

5. **No Untitled UI base components in prototype** — plain Tailwind with semantic color tokens only.

6. **SessionStorage key**: `relaykit_prototype` (session context). **localStorage key**: `relaykit_personalize` (messages page personalization).

7. **DECISIONS.md has 137 decisions** (D-01 through D-137). No new decisions were added this session.

8. **D-104 gate still active**: PRDs must be updated to reflect D-84–D-103 before any production code is built from them.

9. **Section checkbox toggling is for prototyping only** — clicking checkboxes toggles section complete/incomplete state. This is not production behavior; real completion will come from server state.

10. **Prototype state switcher** is in the H1 row of layout.tsx — tiny `<select>` cycling Default/Pending/Approved/Changes Requested/Rejected. Compliance sub-switcher (All clear/Has alerts) only appears when Approved is selected.

11. **All registration lifecycle content is hardcoded** — dates (Mar 17 submitted, Mar 22 changes, Mar 24 resubmission, Mar 28 rejection, Mar 31 approval), phone number (+1 (555) 867-5309), email (jen@glowstudio.com), campaign ID (C-XXXXXX), alert messages, and compliance stats are all prototype strings.

12. **Compliance period selector is display-only** — changing it doesn't update stat numbers. Just present in layout.

13. **Alert card expansions are local state** (`alert1Open`, `alert2Open`) — not persisted to sessionStorage.

14. **"Start new registration" button** in Rejected state resets `registrationState` to "default" for prototyping.

15. **Dashboard A/B/C components still exist** in `components/dashboard/` but are not imported. The `/c/` legacy routes are also orphaned. Both can be deleted.

16. **"Learn more →" link** in Default state right column uses `href="#"` as placeholder.

17. **Appointments pill is hardcoded** in layout.tsx — will need to be dynamic when multi-category is supported.

18. **Onboarding step state is client-side only** — refreshing the page resets all progress. Persisting step completion (localStorage or server) is not yet implemented.

---

## Prototype File Map (updated)

```
prototype/
├── app/
│   ├── page.tsx                          # Marketing home
│   ├── compliance/page.tsx               # Public compliance page
│   ├── auth/page.tsx                     # Auth gate (mock)
│   ├── apps/
│   │   ├── page.tsx                      # Your Apps (project list)
│   │   └── [appId]/
│   │       ├── layout.tsx                # Per-app shell (app name + pill + tabs + state switchers)
│   │       ├── page.tsx                  # Redirects to /overview
│   │       ├── overview/page.tsx         # Three-section accordion with lifecycle states + compliance dashboard
│   │       ├── messages/page.tsx         # Renders public messages page component
│   │       ├── registration/page.tsx     # Placeholder
│   │       └── settings/page.tsx         # Settings tab
│   ├── sms/[category]/
│   │   ├── page.tsx                      # Category landing
│   │   └── messages/page.tsx             # Public messages page
│   └── c/[categoryId]/                   # Legacy catalog routes (orphaned)
├── components/
│   ├── top-nav.tsx                       # Context-aware nav
│   ├── footer.tsx                        # Shared footer
│   ├── category-modal.tsx                # Category picker
│   ├── catalog/                          # Message cards, opt-in form
│   └── dashboard/                        # ORPHANED — not imported
├── public/logos/                          # SVG logos for tool selector
├── context/session-context.tsx           # State management (+ registrationState, complianceView)
├── lib/catalog-helpers.ts                # Template interpolation
└── data/messages.ts                      # Message library
```

---

## What's Next

- Wire up registration tab/page with intake wizard flow
- Persist onboarding step completion (localStorage or server)
- Differentiate logged-in vs public messages page (D-120 deferred)
- Category landing pages beyond "appointments"
- Delete orphaned `/c/` routes and `components/dashboard/` files
- Production PRDs must be updated per D-104 before production code resumes
- "Learn more →" link needs a destination (marketing registration page)
- Make "Appointments" pill dynamic based on project category
- Build real compliance monitoring views (production, not prototype)
- Consider adding Rejected → re-registration flow with pre-filled data
