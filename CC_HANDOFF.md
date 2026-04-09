# CC_HANDOFF.md — Session Handoff
**Date:** 2026-04-09 (pricing sweep, inline EIN verification, marketing messages in Pending, registration card redesign)
**Branch:** main

---

## Commits This Session (28)

```
e3a402a  docs: update PROTOTYPE_SPEC.md for April 9 session
9c580f8  docs: record D-337 — inline EIN verification on registration card
08c05a9  fix(prototype): pending card date format and size
f196c52  fix(prototype): pending card copy, remove duplicate marketing badge
b6ef577  fix(prototype): warm Pending state registration card, remove carrier jargon
b270839  feat(prototype): marketing messages in Pending state with badge (D-336)
e0e744c  docs: record D-336 — marketing messages visible in Pending state
7703f6e  fix(prototype): marketing radio helper text with dynamic vertical name
21a5d20  feat(prototype): marketing radio helper text on registration card
1f67b76  fix(prototype): get-started page remove stale copy, fix dashboard link
94fd8e3  feat(prototype): EIN failed state on inline card, consistent error styling on both pages
8691616  fix(prototype): combine pricing detail and EIN copy into single paragraph
4665bc8  fix(prototype): move EIN copy below pricing detail
1cbd907  fix(prototype): registration card EIN copy tweaks
22167a9  fix(prototype): EIN verify card copy, cancel positioning, disabled state contrast
230eeac  fix(prototype): registration card EIN body copy
530cbd9  refactor(prototype): simplify EIN verification to card swap pattern
7310480  fix(prototype): inline EIN link into registration card body text
80c0ab0  fix(prototype): registration card width, remove refund line, hide pricing during EIN flow
93076a0  fix(prototype): registration card layout, pricing detail, overflow fixes, transition timing
a0621ef  fix(prototype): EIN verification transition, link copy, remove redundant marketing tooltip
bdbf1de  feat(prototype): inline EIN verification on building state registration card
0eba0b8  fix(prototype): update pricing to D-320/D-321 in admin customer detail
a97e351  fix(prototype): update pricing to D-320/D-321 on public category and messages pages
7b67d12  fix(prototype): update pricing to D-320/D-321 on marketing home page
a3cd2fa  fix(prototype): update pricing to D-320/D-321 in settings billing
613a04e  fix(prototype): update pricing to D-320/D-321 in registration review
8a0fcf0  refactor(prototype): delete orphaned overview page and approved-dashboard component
```

---

## What Was Completed

### Orphaned overview files deleted
- `overview/page.tsx` and `approved-dashboard.tsx` removed (471 lines). Overview route already redirects to Messages. No remaining imports.

### Pricing sweep (D-320/D-321)
All stale pricing references updated across the entire prototype:
- **review-confirm.tsx**: Removed $150 go-live fee, updated overage to $8/500
- **settings/page.tsx**: "$15 per additional 1,000" → "$8 per additional 500"
- **home page (page.tsx)**: Removed $150 from context line and Go Live card, updated overage
- **category landing + messages pages**: Removed $150, updated overage
- **admin customer detail**: Removed `goLiveFee` field entirely from interface, mock data, and display
- **PROTOTYPE_SPEC.md**: All pricing references updated to match D-320/D-321

### Inline EIN verification on registration card (D-337)
- **New shared component:** `ein-inline-verify.tsx` — EIN input, two-phase spinner stub (Verifying → Checking sources), business identity confirmation, "This is my business" checkbox, Cancel/Save bottom row, stub mode switcher (Default/Verified/Failed), failed state with light red error box
- **Card swap pattern:** Registration card swaps between Card A (registration) and Card B (EIN verification) with 200ms crossfade. No multi-step animations.
- **Card A (no-EIN):** "Ready to go live?" heading, "Registration takes a few days." body, pricing block with inline "Add EIN." link, CTA
- **Card A (with-EIN):** Same heading/body, campaign selection radios with marketing helper text, adjusted pricing ($29/mo), CTA
- **Card B:** "Add your EIN" heading, EIN explanation, input + grey Verify button, identity card, checkbox, Cancel + Save (right-aligned)
- Card width increased from 280px to 300px
- "Not approved? Full refund." line removed
- Pricing and CTA hidden while Card B is displayed
- Marketing radio helper text: "[Vertical] messages go live first. Once approved, you'll get access to marketing templates you can customize or write from scratch."

### Kill-list cleanup
- Removed "unlock" from 3 user-facing strings (messages page tooltips, business page EIN tooltip)
- Replaced with direct descriptions per Voice & Product Principles v2.0

### Marketing messages in Pending state (D-336)
- 4 marketing message cards (New service announcement, Seasonal promotion, Re-engagement, Loyalty reward) shown above transactional messages in Pending state when EIN is on file
- Purple filled "Marketing" badge on each card (added `badge` prop to CatalogCard)
- Duplicate badge fix: built-in outlined badge suppressed when `badge` prop is provided

### Pending state registration card redesign
- Removed "Under carrier review" pill (carrier is on kill list)
- New warm copy: "Registration submitted" heading, "We'll email you when you're live — usually 2–3 days.", "Submitted 3/17/2026" bold date
- No status badge, no jargon

### Get-started page fixes
- Removed "We also sent this to your email."
- Removed "Need help? Talk to our AI assistant →"
- Fixed "View on dashboard" link: `/overview` → `/messages`

### EIN error state consistency
- Both onboarding business page and inline EIN card now use light red `bg-bg-error-secondary` styling for failed verification
- Same copy on both: "We couldn't verify this EIN. You can try again or continue without it."

### Decisions recorded
- D-336: Marketing messages visible and editable in Pending state after registration
- D-337: Inline EIN verification on Building state registration card

---

## Quality Checks Passed

- `tsc --noEmit` — clean (prototype)
- `next build` — clean; all routes compile
- No ESLint config in prototype — tsc and build are the quality gates (unchanged baseline)

---

## In Progress / Partially Done (Carried Forward)

### Signup backend is stubbed
Email validation is a client-side regex shape check. Send code is a 1.5s `setTimeout` stub. OTP accepts any 6 digits. Real magic-link backend is D-59.

### EIN verification backend is stubbed
Two-phase spinner (`Verifying...` → `Checking sources...`) is visual-only. Real EIN lookup + auto-populate is D-302/D-303 backend work.

### `/start/verify` phone OTP is stubbed
Any 6 digits work. Real integration is Twilio Verify (D-46).

### Get-started and setup instruction content is hardcoded
Prompt text, API key, and business details are hardcoded for Club Woman / Appointments. Production will generate from wizard sessionStorage data + server-created project.

### `/start/verify` destination is hardcoded
Currently navigates to `/apps/glowstudio/messages`. In production, this would hit signup first (or create a draft app, then route to its messages workspace).

### Marketing messages are hardcoded for Appointments vertical
The 4 marketing messages in MARKETING_MESSAGES are GlowStudio/Appointments-specific. Other verticals would need their own marketing message sets. Currently only shown in Pending state with EIN.

---

## Gotchas for Next Session

1. **Delete `.next` before every prototype dev server start.** API server (port 3002) has no `.next`.
2. **No ESLint config** in prototype — tsc + `next build` are the quality gates.
3. **Tab bar is gone.** Dashboard layout no longer has tabs. Settings is accessed via gear icon on Messages page. Overview route redirects to Messages.
4. **EIN prototype switcher dispatches a custom event** (`relaykit-ein-change`). The Messages page and dashboard layout listen for it. If you add new EIN-dependent UI elsewhere, add the same listener.
5. **Card swap pattern for EIN verification.** `einExpanded` state toggles between Card A (registration) and Card B (EIN verification). The `EinInlineVerify` component has its own stub mode switcher for testing Default/Verified/Failed outcomes.
6. **Campaign selection radios only appear with EIN.** Toggle the EIN switcher in the dashboard bar to test both views.
7. **Marketing messages only appear in Pending state with EIN.** `showMarketingMessages = isPending && hasEin`. Toggle EIN switcher + state switcher to test.
8. **CatalogCard `badge` prop suppresses built-in marketing badge.** When `badge` is provided, the card's own outlined Marketing badge (based on `expansionType`) is hidden to prevent duplicates.
9. **`WizardLayout.getPageConfig` is pathname-driven.** Signup paths match via `pathname.includes("/signup")`. New wizard destinations under `/apps/[appId]/` need their own branch there.
10. **AppLayout has three special-case paths:** `isGetStarted` (standalone render), `isRegisterFlow` (bare max-w-5xl render), and everything else (WizardLayout or DashboardLayout).
11. **Signup email is in sessionStorage** under key `relaykit_signup_email`. The verify page reads it on mount.
12. **State transition boundary unchanged:** `registrationState` flips to "building" only on get-started page exits (D-322).
13. **Onboarding dropdown uses hardcoded `/apps/glowstudio/` paths.** Fine for prototype. Production would need dynamic appId.
14. **Variant IDs are stable** (`standard`, `action-first`, `context-first`) even though labels are Standard / Friendly / Brief. Don't rename the IDs.
15. **Public marketing page at `/sms/[category]/page.tsx`** has its own hardcoded variant data and pricing copy — separate from the in-app pills.
16. **Migrations 003 and 004 may not be applied to live DB.**
17. **Rate limiter is in-memory** — resets on server restart.

---

## Files Modified This Session

```
# Decisions, specs, docs
DECISIONS.md                                             # MODIFIED — D-336, D-337 added
PROTOTYPE_SPEC.md                                        # MODIFIED — registration card, pending state, pricing, get-started updates
CC_HANDOFF.md                                            # This file (overwritten)

# Deleted files
prototype/app/apps/[appId]/overview/page.tsx             # DELETED — orphaned
prototype/app/apps/[appId]/overview/approved-dashboard.tsx # DELETED — orphaned

# New components
prototype/components/ein-inline-verify.tsx               # NEW — shared EIN verification component

# Component changes
prototype/components/catalog/catalog-card.tsx            # MODIFIED — badge prop added
prototype/components/registration/review-confirm.tsx     # MODIFIED — pricing update

# Page changes
prototype/app/apps/[appId]/messages/page.tsx             # MAJOR — inline EIN, marketing messages, pending card, pricing
prototype/app/apps/[appId]/settings/page.tsx             # MODIFIED — pricing update
prototype/app/apps/[appId]/get-started/page.tsx          # MODIFIED — remove stale copy, fix link
prototype/app/page.tsx                                   # MODIFIED — pricing update
prototype/app/sms/[category]/page.tsx                    # MODIFIED — pricing update
prototype/app/sms/[category]/messages/page.tsx           # MODIFIED — pricing update
prototype/app/admin/customers/[customerId]/page.tsx      # MODIFIED — remove goLiveFee
prototype/app/start/business/page.tsx                    # MODIFIED — error styling, kill-list fix

# Styles
prototype/app/globals.css                                # MODIFIED — einCardFade keyframe (replaced einRadiosIn)
```

---

## What's Next (suggested order)

1. **Marketing messages for other verticals** — currently only Appointments has marketing message data. Add sets for Verification, Orders, Support, etc.
2. **Wire wizard data into setup instructions** — generate install command, API key, and prompt from sessionStorage business name + messages instead of hardcoded Club Woman content.
3. **Extended Review and Rejected card redesign** — these still use the old "Registration status" / pill pattern. Consider the same warm copy approach as Pending.
4. **Wire signup to real magic-link backend** (D-59).
5. **Wire `/start/verify` phone OTP to Twilio Verify** (D-46).
6. **Wire EIN verification backend** (D-302, D-303).
7. **Extract `OtpInput`** to shared component — currently inlined in `/signup/verify`, `/start/verify`, and sign-in modal.
8. **Registration flow pages** — `/apps/[appId]/register` and `/register/review` need the new single-page workspace context (no tab bar, back-to-messages pattern).
9. **Error states design session** — walk through all interaction failures before locking in copy.
