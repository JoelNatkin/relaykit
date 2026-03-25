# CC_HANDOFF.md — Session Handoff
**Date:** 2026-03-25 (category page scope, Overview restructure, registration form flow, review simplification, pricing updates, admin dashboard)
**Branch:** main

---

## Commits This Session

```
9182d1d  feat: category page registration scope, Overview restructure (compliance card, simplified sidebar), registration form flow, review page simplification, pricing updates, copy refinements across all pages
3807f53  docs: session close-out — D-228–D-233, PROTOTYPE_SPEC updates, CC_HANDOFF rewrite
16a7063  feat: add manual review toggle and registration queue count to Control Room (D-235)
0650966  feat: admin dashboard scaffold — layout, control room, placeholder pages, D-234–D-236
3f03acc  feat: submission tracking, active filter, message type labels, AI pre-review on Registration Pipeline
55dcf16  feat: AI pre-review traffic light, terminal statuses (Declined/Abandoned) with email actions and refund tracking
38fecee  docs: expand D-236 — AI compliance layer with registration pre-review and novel message detection
18d283d  fix: realistic AI pre-review flags, right-aligned buttons with icons, numbered messages
5289993  fix: rationalize action buttons across Registration Pipeline — three patterns only
c958c26  feat: inline-editable business details on Awaiting Review and Rejected registrations
```

---

## What We Completed

### Decisions D-228–D-236 Recorded
- D-228: Flow diagram strategy per category
- D-229: Orders flow diagram shape
- D-230: RegistrationScope on category landing pages (display-only)
- D-231: RegistrationScope renders as two sections, no negative framing
- D-232: Twilio-only registration service rejected
- D-233: Overview page restructure — sandbox compliance card, simplified sidebar
- D-234: Admin dashboard in prototype
- D-235: Manual registration review mode
- D-236: AI compliance layer — registration pre-review + novel message detection (two modes)

### Category Landing Page Updates
- Registration scope section with "Your registration" eyebrow + "What's included from day one"
- Two sub-sections: green check items from use-case-data + "Need marketing messages too?" with example cards
- EIN/sole prop marketing note on all "Need marketing messages too?" sections (3 pages, 4 instances)
- "What you get" section in full-width gray band
- FAQ reduced to 2 cards with realistic copy, body text capped at 600px

### Overview Page Restructure (D-233)
- Removed "Register your app" and "Monitor your compliance" expanders
- Added sandbox compliance card (100% green / 97.2% amber with Fix → links + detail modal)
- Simplified registration sidebar: "Ready to go live?" with $49/$150 pricing
- Grid changed to `md:grid-cols-[1fr_320px]`, left column `max-w-[560px]`
- Checkbox removed from SectionHeading, chevron-only
- Layout forces `isLoggedIn(true)`, content `pt-6`

### Registration Form Flow (NEW)
- `/apps/[appId]/register` — BusinessDetailsForm, left-aligned, tab bar hidden
- `/apps/[appId]/register/review` — ReviewConfirm with compact "What happens next" card
- Info callout, pre-fill state switcher (Empty/Pre-filled), always-active Continue button with touchAllRef
- Extensive copy refinements across all form fields
- $49 pricing on review page, "Start my registration — $49" CTA

### Admin Dashboard (D-234) — NEW
- Dark sidebar layout (`bg-gray-900`, 240px) with 4 nav links + "View as customer" footer
- **Control Room:** 4 KPI cards (compliance, customers, registrations, revenue), attention queue (5-7 items), Normal/Crisis state switcher, manual review toggle (D-235)
- **Registration Pipeline:** Full operator workflow screen
  - Filter pills: Active (default), Awaiting Review, In Carrier Review, Extended Review, Rejected, Closed, All, Approved
  - 10 mock registrations across all statuses including Declined (CannaBliss) and Abandoned (SpamKing)
  - Expandable detail rows with business details, campaign info, sample messages
  - Inline-editable business fields (name, address, phone, email, website) on awaiting/rejected — blue dot "edited" indicator
  - AI pre-review traffic light: green (ready), amber (website 404), red (promotional language fix with Apply button)
  - Terminal statuses with resolution sections, refund tracking, expandable email previews
  - Rationalized action buttons: three patterns (fix & submit, email, close/resolve)
  - Submission attempt tracking ("2nd attempt", "3rd attempt")
  - Numbered message type labels
- Placeholder pages for Customers, Customer Detail, Revenue

### Cross-Page Updates
- Flow diagram mobile fixes (tooltip right-positioned, labels vertically centered)
- AI tool setup panel spacing and heading improvements
- "How it works" modal bottom padding
- Messages page gray band flush with tab bar
- All select elements have custom SVG chevrons
- Government added to business type options

---

## In Progress / Partially Done

### Pricing Audit Needed
$49/$150 split updated on Overview sidebar and review page. Public pages (home, category landing, "How it works" modal) may still show $199. Need full audit.

### Admin — Customer List and Customer Detail
Placeholder pages only. Customer detail should show: registration history, message volume, compliance status, billing, and a message log.

### Admin — Revenue & Metrics
Placeholder only. Should show: MRR trend, customer count growth, registration conversion rate, churn, overage revenue.

### Messages Tab — Approved State
Still not differentiated from Default. Planned per D-159.

### Approved Dashboard Redesign (D-233)
D-233 specifies replacing 6-card layout with message types table + 3 cards. Not built yet.

---

## Gotchas for Next Session

1. **Delete `.next` before every dev server start.** Always: `rm -rf prototype/.next` then restart. Port 3001.

2. **DECISIONS.md is a two-file system.** Active decisions (D-84–D-236) in DECISIONS.md. Archived (D-01–D-83) in DECISIONS_ARCHIVE.md.

3. **Admin routes have their own layout.** `/admin/*` uses `prototype/app/admin/layout.tsx` — dark sidebar, completely separate from customer app layout. No session context dependency.

4. **Registration Pipeline state is local to the page.** Editable descriptions, messages, and business fields are `useState` — no persistence. Refreshing the page resets all edits to mock data.

5. **AI pre-review `suggestedFix` is written to campaign description.** The "Apply fix" button calls `setDescription(reg.id, reg.aiPreReview.suggestedFix)` — it overwrites the textarea content. The FreshCuts fix replaces "same-day availability alerts" with "waitlist notifications for customers who opted into availability updates."

6. **Tab bar hidden for `/register` routes.** Layout checks `pathname.includes("/register")`. App header stays visible.

7. **Layout forces logged-in state.** `useEffect` calls `setLoggedIn(true)` on mount.

8. **Messages page gray band offset is `-mt-6`.** Matches layout `pt-6`. If layout padding changes, update the offset.

9. **Registration form `touchAllRef` pattern.** Parent passes `MutableRefObject<(() => void) | null>` — form populates with touch-all function. Called on Continue click when form invalid.

10. **Pricing is $49/$150 split (D-193).** Review: $49 due today. Overview sidebar: "$49 to submit, $150 + $19/mo after approval". Public pages need audit.

11. **Terminal registration statuses.** "Declined" = pre-submission (RelayKit rejected). "Abandoned" = post-submission (carrier rejected multiple times). Both show in "Closed" filter, excluded from "Active".

12. **Orphaned files still on disk** — `prototype/components/dashboard/` and `prototype/app/c/` safe to delete.

---

## Files Modified This Session

```
# Decisions
DECISIONS.md                                              # D-228 through D-236

# Category landing page
prototype/app/sms/[category]/page.tsx                     # Registration scope, FAQ, gray band, copy

# Public messages page
prototype/app/sms/[category]/messages/page.tsx             # Marketing EIN note, flow mobile fixes, modal padding

# App layout
prototype/app/apps/[appId]/layout.tsx                      # Tab bar hidden for /register, logged-in force, pt-6

# App messages page
prototype/app/apps/[appId]/messages/page.tsx               # Marketing EIN note, gray band, tool panel, flow fixes

# Overview page
prototype/app/apps/[appId]/overview/page.tsx               # D-233 restructure

# Registration form flow (NEW)
prototype/app/apps/[appId]/register/page.tsx               # NEW — registration form
prototype/app/apps/[appId]/register/review/page.tsx        # NEW — review & confirm

# Registration components
prototype/components/registration/business-details-form.tsx # Copy, touchAllRef, select chevrons, Government
prototype/components/registration/review-confirm.tsx        # Simplified right column, $49 pricing

# Validation
prototype/lib/intake/validation.ts                         # Government business type

# Admin dashboard (NEW)
prototype/app/admin/layout.tsx                             # NEW — dark sidebar layout
prototype/app/admin/page.tsx                               # NEW — Control Room
prototype/app/admin/registrations/page.tsx                 # NEW — Registration Pipeline (full workflow)
prototype/app/admin/customers/page.tsx                     # NEW — placeholder
prototype/app/admin/customers/[customerId]/page.tsx        # NEW — placeholder
prototype/app/admin/revenue/page.tsx                       # NEW — placeholder

# Session close-out
PROTOTYPE_SPEC.md                                          # Admin specs, overview, category, registration, layout, file map
CC_HANDOFF.md                                              # This file (overwritten)
```

---

## What's Next (suggested order)

1. **Pricing audit** — search all files for "$199", "$218", "one-time setup" and update to $49/$150 split
2. **Admin — Customer List** — table view with customer name, status, registration date, message volume, compliance rate, MRR contribution
3. **Admin — Customer Detail** — registration history, message log, compliance timeline, billing
4. **Admin — Revenue** — MRR trend chart, customer growth, registration funnel, churn
5. **Approved dashboard redesign** (D-233) — message types table + 3 summary cards
6. **Build steps collapsed state** — "Sandbox setup complete" row once all 4 steps done
7. **Messages tab Approved state** (D-159) — read-only personalization with registered values
8. **Flow diagrams for other categories** — orders, support, waitlist (D-228, D-229)
9. **Delete orphaned files** — `/c/` routes, `components/dashboard/`
