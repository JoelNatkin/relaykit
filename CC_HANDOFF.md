# CC_HANDOFF.md — Session Handoff
**Date:** 2026-03-25 (admin Customer List + Customer Detail, compliance enforcement decisions, section reorder)
**Branch:** main

---

## Commits This Session

```
7e4663b  feat: admin Customer List page — table view with filters, sorting, mock data
f07da61  fix: Customer List content area — light background matching other admin pages
46e0639  feat: admin Customer Detail page — registration, compliance, messages, billing, attention items
5436443  fix: Customer Detail billing — add $150 go-live fee to reflect full pricing structure
62f4a43  fix: Customer Detail — reorder sections, add $150 go-live fee to billing
48222b1  docs: D-237–D-241 compliance enforcement model and copy strategy, backlog additions
```

---

## What We Completed

### Decisions D-237–D-241 Recorded
- D-237: Three-layer automated compliance enforcement model (proxy fixes → email digest → disengaged backstop)
- D-238: Control Room attention queue — inline expansion with enforcement state and operator overrides
- D-239: Compliance alerts toggle surfaced on Overview page (default on, strategic moments)
- D-240: Dashboard message editor for flagged messages only (repair tool, not authoring tool)
- D-241: Compliance protection copy touchpoints across customer journey (marketing, onboarding, post-approval)

### Admin — Customer List (`/admin/customers`)
- Replaced placeholder with full table view: 12 mock customers, 9 columns
- Filter pills: All, Sandbox, Pending, Active, Churned (matching Registration Pipeline visual pattern)
- All columns sortable (default: last activity descending)
- Row click navigates to Customer Detail
- Light background matching other admin pages (not dark)
- Responsive: compliance and MRR columns hidden below lg breakpoint
- Reuses businesses from Registration Pipeline mock data + new entries

### Admin — Customer Detail (`/admin/customers/[customerId]`)
- Replaced placeholder with six-section single-customer view (max-width 900px)
- Section order: Registration Summary → Message Volume → Compliance → Attention Items → Billing → Recent Messages
- Registration Summary: business details grid, status with date, pipeline link for pending, campaign description, message type pills
- Message Volume: 4 stat cards (sent/delivered/failed/blocked with daily avg)
- Compliance: large percentage with color coding, flagged count
- Attention Items: severity-coded items matching Control Room format
- Billing: full three-part pricing (D-193) — $49 registration fee, $150 go-live fee, $19/mo monthly
- Recent Messages: 20-row table with delivery status dots, compliance flag badges
- 4 customer profiles mapped: GlowStudio (cust-1), TechRepair Pro (cust-2), FreshCuts (cust-3), QuickFix Plumbing (cust-5). Unknown IDs fall back to GlowStudio.

### Backlog Additions
- "Message Management (Deferred)" section: full message library editor, marketing persona as dashboard user. Both explicitly deferred with reasoning.

---

## In Progress / Partially Done

### Pricing Audit Needed
$49/$150 split updated on Overview sidebar, review page, and Customer Detail billing. Public pages (home, category landing, "How it works" modal) may still show $199. Need full audit.

### Admin — Revenue & Metrics
Placeholder only. Should show: MRR trend chart, customer count growth, registration conversion rate, churn, overage revenue.

### Messages Tab — Approved State
Still not differentiated from Default. Planned per D-159.

### Approved Dashboard Redesign (D-233)
D-233 specifies replacing 6-card layout with message types table + 3 cards. Not built yet.

### Control Room Attention Queue — Inline Expansion (D-238)
Decision recorded but not yet implemented. Currently queue items are static rows. Need expandable detail with enforcement state, operator override buttons.

### Compliance Alerts Toggle on Overview (D-239)
Decision recorded but not yet implemented. Overview page needs compliance alerts status line and Settings toggle.

### Compliance Protection Copy (D-241)
Decision recorded. Copy touchpoints not yet added to category landing, home page, Overview sidebar, or Messages tab.

---

## Gotchas for Next Session

1. **Delete `.next` before every dev server start.** Always: `rm -rf prototype/.next` then restart. Port 3001.

2. **DECISIONS.md is a two-file system.** Active decisions (D-84–D-241) in DECISIONS.md. Archived (D-01–D-83) in DECISIONS_ARCHIVE.md.

3. **Admin routes have their own layout.** `/admin/*` uses `prototype/app/admin/layout.tsx` — dark sidebar, completely separate from customer app layout. No session context dependency.

4. **Customer List uses `useRouter` for row navigation, not Link.** `<tr>` elements can't be wrapped in `<a>` tags (invalid HTML). Rows use `onClick={() => router.push(...)}`.

5. **Customer Detail mock data keyed by route param.** Only cust-1, cust-2, cust-3, cust-5 have distinct profiles. All other IDs (including cust-4, cust-6 through cust-12) fall back to GlowStudio (cust-1). To add more distinct profiles, add entries to the `CUSTOMERS` record in the detail page.

6. **Customer Detail section order matters.** Joel explicitly ordered: Registration Summary → Message Volume → Compliance → Attention Items → Billing → Recent Messages. Recent Messages is last because it's the longest section.

7. **Three-part pricing: $49 / $150 / $19/mo.** Registration fee at submission, go-live fee after approval, monthly ongoing. Customer Detail billing section shows all three. Overview sidebar and review page also updated. Public pages need audit.

8. **Registration Pipeline state is local to the page.** Editable descriptions, messages, and business fields are `useState` — no persistence. Refreshing resets all edits.

9. **Tab bar hidden for `/register` routes.** Layout checks `pathname.includes("/register")`. App header stays visible.

10. **Layout forces logged-in state.** `useEffect` calls `setLoggedIn(true)` on mount.

11. **Terminal registration statuses.** "Declined" = pre-submission (RelayKit rejected). "Abandoned" = post-submission (carrier rejected multiple times). Both show in "Closed" filter, excluded from "Active".

12. **Orphaned files still on disk** — `prototype/components/dashboard/` and `prototype/app/c/` safe to delete.

13. **D-237–D-241 are strategy decisions, not yet built.** Three-layer enforcement, inline queue expansion, compliance alerts, flagged message editor, copy touchpoints — all recorded as decisions, none implemented in prototype yet.

---

## Files Modified This Session

```
# Admin Customer List (NEW)
prototype/app/admin/customers/page.tsx              # Full table view with filters, sorting, 12 mock customers

# Admin Customer Detail (REPLACED placeholder)
prototype/app/admin/customers/[customerId]/page.tsx  # 6-section detail page, 4 mapped customer profiles

# Decisions & Backlog
DECISIONS.md                                         # D-237 through D-241
BACKLOG.md                                           # Message Management (Deferred) section

# Session close-out
PROTOTYPE_SPEC.md                                    # Customer List + Customer Detail specs, file map update
CC_HANDOFF.md                                        # This file (overwritten)
```

---

## What's Next (suggested order)

1. **Pricing audit** — search all files for "$199", "$218", "one-time setup" and update to $49/$150 split
2. **Admin — Revenue & Metrics** — MRR trend, customer growth, registration funnel, churn
3. **Control Room attention queue inline expansion** (D-238) — expandable items with enforcement state and operator buttons
4. **Compliance protection copy** (D-241) — add one-liners to category landing, home page, Overview sidebar
5. **Approved dashboard redesign** (D-233) — message types table + 3 summary cards
6. **Messages tab Approved state** (D-159) — read-only personalization with registered values
7. **Compliance alerts toggle on Overview** (D-239) — status line on compliance card + Settings link
8. **Flow diagrams for other categories** — orders, support, waitlist (D-228, D-229)
9. **Delete orphaned files** — `/c/` routes, `components/dashboard/`
