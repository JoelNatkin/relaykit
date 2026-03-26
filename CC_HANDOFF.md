# CC_HANDOFF.md — Session Handoff
**Date:** 2026-03-26 (compliance protection copy touchpoints, D-241)
**Branch:** main

---

## Commits This Session

```
a296043  feat: compliance protection copy touchpoints (D-241)
```

---

## What We Completed

### Compliance Protection Copy Touchpoints (D-241)
Added brief compliance protection messaging to four locations across the prototype. Tone: "we handle this for you" — concrete, confident, no fear.

1. **Category landing** (`sms/[category]/page.tsx`): "Compliance that runs itself" card — appended second line: "Issues caught are fixed automatically — you get a heads-up, not an emergency."
2. **Home page** (`page.tsx`): Go Live pricing card bullet changed from "Compliance monitoring and drift detection included" → "Every message scanned — issues caught and fixed before they reach carriers"
3. **Overview sidebar** (`apps/[appId]/overview/page.tsx`): Default registration pitch — added line below existing body: "After approval, every message is scanned before delivery. Issues are fixed automatically." (text-tertiary, lighter weight)
4. **Messages tab** (`apps/[appId]/messages/page.tsx`): Compliance status line between playbook band and two-column layout. ShieldTick icon (success green) + "All messages scanned before delivery. **2 issues caught and fixed this month.**"

All four pages verified compiling on port 3001.

---

## In Progress / Partially Done

### Overview Compliance Attention Section (D-243)
Decision recorded. Not yet built. Customer-facing ledger showing adjusted/blocked messages with edit and "Fixed in code" actions. Was the next planned task this session — spec is ready, implementation not started.

### Messages Tab — Approved State
Still not differentiated from Default. Compliance status line added (above), but full Approved state per D-159 not built.

### Approved Dashboard Redesign (D-233)
D-233 specifies replacing 6-card layout with message types table + 3 cards. Not built yet.

### Compliance Alerts Toggle on Overview (D-239)
Decision recorded but not yet implemented.

### Admin — Revenue & Metrics
Placeholder only. Should show: MRR trend chart, customer count growth, registration conversion rate, churn, overage revenue.

### How It Works Modal Pricing
The modal on the Messages page still uses the old pricing card structure internally — needs the same $49/$150 bridge line treatment as the main pricing cards.

---

## Gotchas for Next Session

1. **Delete `.next` before every dev server start.** Always: `rm -rf prototype/.next` then restart. Port 3001.

2. **DECISIONS.md is a two-file system.** Active decisions (D-84–D-243) in DECISIONS.md. Archived (D-01–D-83) in DECISIONS_ARCHIVE.md.

3. **Admin routes have their own layout.** `/admin/*` uses `prototype/app/admin/layout.tsx` — dark sidebar, completely separate from customer app layout. No session context dependency.

4. **Category landing outer container changed.** Now `<div className="py-16">` (full-width) with content sections wrapped in `<div className="mx-auto max-w-4xl px-6">`. The "What you get" gray band sits between these wrappers at root level.

5. **Control Room expandedId resets on mode switch.** State switcher onChange calls both `setMode()` and `setExpandedId(null)`.

6. **Control Room tier data model.** `tier: "minor" | "escalated" | "suspended" | null`. Non-compliance items have `tier: null` and are not expandable.

7. **UrbanBites Suspended item has `rewrittenMessage: null as unknown as string`.** Intentional — suspended messages are blocked, not rewritten.

8. **Three-part pricing: $49 / $150 / $19/mo.** Registration fee at submission, go-live fee after approval, monthly ongoing. Confirmed correct across all prototype files except orphaned `shared.tsx` and possibly the How It Works modal internals.

9. **Orphaned files still on disk** — `prototype/components/dashboard/` and `prototype/app/c/` safe to delete. `shared.tsx` in that directory still has $199.

10. **Terminal registration statuses.** "Declined" = pre-submission (RelayKit rejected). "Abandoned" = post-submission (carrier rejected multiple times). Both show in "Closed" filter, excluded from "Active".

11. **Registration Pipeline state is local to the page.** Editable descriptions, messages, and business fields are `useState` — no persistence. Refreshing resets all edits.

12. **Tab bar hidden for `/register` routes.** Layout checks `pathname.includes("/register")`. App header stays visible.

13. **Layout forces logged-in state.** `useEffect` calls `setLoggedIn(true)` on mount.

14. **Messages tab compliance status line uses ShieldTick.** Already imported. Mock data: "2 issues caught and fixed this month." Positioned between playbook band and two-column layout with `pt-4 pb-2`.

---

## Files Modified This Session

```
# Compliance protection copy (D-241)
prototype/app/sms/[category]/page.tsx         # "Compliance that runs itself" card second line
prototype/app/page.tsx                        # Go Live bullet — concrete scanning copy
prototype/app/apps/[appId]/overview/page.tsx  # Default sidebar — compliance benefit line
prototype/app/apps/[appId]/messages/page.tsx  # Compliance status line with ShieldTick

# Session close-out
PROTOTYPE_SPEC.md                             # D-241 copy updates across 4 screens
CC_HANDOFF.md                                 # This file (overwritten)
```

---

## What's Next (suggested order)

1. **Overview compliance attention section** (D-243) — customer-facing ledger with edit/dismiss actions, tier-based styling, sandbox advisory mode
2. **Approved dashboard redesign** (D-233) — message types table + 3 summary cards
3. **Messages tab Approved state** (D-159) — read-only personalization with registered values
4. **Compliance alerts toggle on Overview** (D-239) — status line on compliance card + Settings link
5. **How It Works modal pricing audit** — verify $49/$150 bridge line in modal pricing cards
6. **Admin — Revenue & Metrics** — MRR trend, customer growth, registration funnel, churn
7. **Delete orphaned files** — `/c/` routes, `components/dashboard/`
