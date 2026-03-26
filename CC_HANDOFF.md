# CC_HANDOFF.md — Session Handoff
**Date:** 2026-03-26 (pricing audit, category landing layout, Control Room inline expansion, D-242–D-243)
**Branch:** main

---

## Commits This Session

```
e7af45d  fix: pricing audit — update $199 references to $49/$150 split across prototype
fdc03e0  fix: category landing — pricing line repositioned with weight, full-width What You Get section
d6c4298  feat: Control Room inline expansion — AI-driven severity tiers, expandable queue items, D-242
9aa22e8  docs: D-243 Overview compliance attention section — customer-facing ledger
```

---

## What We Completed

### Pricing Audit — $199 → $49/$150 Split
- Searched all prototype files for "$199", "$218", "one-time setup", "one-time fee", "setup fee"
- Updated 11 occurrences across 4 files:
  - Home page (`page.tsx`): how-it-works context line, Go Live pricing card headline ($49 + $19/mo), bridge line ("$150 go-live fee after approval. Full refund if not approved."), replaced $49/$150 bullet with "No credit card to start building"
  - Category landing (`sms/[category]/page.tsx`): hero pricing context line
  - Messages page (`sms/[category]/messages/page.tsx`): stranger-state hero, Go Live pricing card (identical to home page)
  - Overview page (`apps/[appId]/overview/page.tsx`): 3 timeline steps "Payment confirmed / $199 one-time setup" → "Registration fee paid / $49", rejected timeline "$199 refunded" → "$49 refunded", rejected refund message
- Verified all existing $49/$150 references use correct terminology ("registration fee", "go-live fee")
- Only remaining $199: orphaned `components/dashboard/shared.tsx` (flagged for deletion)

### Go Live Pricing Card Redesign (Home + Messages)
- Headline: $49 to register + $19/mo
- Bridge line: "$150 go-live fee" (font-semibold text-text-primary) + "after approval. Full refund if not approved." (regular weight text-text-tertiary)
- Bullet swap: removed "$49 to register. $150 only after you're approved." → "No credit card to start building"

### Category Landing Layout
- Pricing context line moved below "See all appointment messages →" link with mt-5
- Styled with $49/$150/$19mo in font-semibold text-text-primary
- "What you get" gray band now truly full-width: outer container changed from `max-w-4xl overflow-x-hidden px-6` to bare `py-16`, content sections wrapped in `mx-auto max-w-4xl px-6`, gray band sits at root level

### Control Room Inline Expansion (D-238, D-242)
- Replaced static attention queue rows with expandable items
- New data model: `tier` (minor/escalated/suspended) replaces `layer` (1/2/3) per D-242
- Compliance items expand on click (one at a time), non-compliance items are static
- Expanded detail shows:
  - Tier badge (Minor/Escalated/Suspended with severity colors)
  - Context: message type, "Rewriting since [date] (N messages)" — no redundant Customer field
  - Minor: original vs rewritten side by side
  - Escalated: deadline countdown ("Day N of 30 — message suspends [date]"), original vs rewritten, notification history
  - Suspended: "Blocked since [date] — awaiting customer fix", blocked message only, notification history
  - Operator buttons: Dismiss, Change severity dropdown, Unsuspend (Suspended only)
- Normal mode: PetPals (Escalated day 12/30), GlowStudio (Minor demo), 4 non-compliance items
- Crisis mode adds: UrbanBites (Suspended, blocked immediately), promotes GlowStudio to Escalated

### Decisions D-242–D-243 Recorded
- D-242: AI-driven compliance enforcement — three severity tiers (Minor/Escalated/Suspended), all AI-classified, fully automated. Operator queue is monitoring feed with override capability. Supersedes operator-centric parts of D-237.
- D-243: Overview compliance attention section — customer-facing ledger. Same data as Control Room, customer-appropriate framing and editing controls. Decision only, not built.

---

## In Progress / Partially Done

### Messages Tab — Approved State
Still not differentiated from Default. Planned per D-159.

### Approved Dashboard Redesign (D-233)
D-233 specifies replacing 6-card layout with message types table + 3 cards. Not built yet.

### Overview Compliance Attention Section (D-243)
Decision recorded. Not yet built. Customer-facing ledger showing adjusted/blocked messages with edit and "Fixed in code" actions.

### Compliance Protection Copy (D-241)
Decision recorded. Copy touchpoints not yet added to category landing, home page, Overview sidebar, or Messages tab.

### Compliance Alerts Toggle on Overview (D-239)
Decision recorded but not yet implemented.

### Admin — Revenue & Metrics
Placeholder only. Should show: MRR trend chart, customer count growth, registration conversion rate, churn, overage revenue.

### How It Works Modal Pricing
The modal on the Messages page still uses the old pricing card structure internally — needs the same $49/$150 bridge line treatment as the main pricing cards. (The spec reference was updated but the modal code was not audited.)

---

## Gotchas for Next Session

1. **Delete `.next` before every dev server start.** Always: `rm -rf prototype/.next` then restart. Port 3001.

2. **DECISIONS.md is a two-file system.** Active decisions (D-84–D-243) in DECISIONS.md. Archived (D-01–D-83) in DECISIONS_ARCHIVE.md.

3. **Admin routes have their own layout.** `/admin/*` uses `prototype/app/admin/layout.tsx` — dark sidebar, completely separate from customer app layout. No session context dependency.

4. **Category landing outer container changed.** Now `<div className="py-16">` (full-width) with content sections wrapped in `<div className="mx-auto max-w-4xl px-6">`. The "What you get" gray band sits between these wrappers at root level. No more `overflow-x-hidden` or viewport-width CSS hack.

5. **Control Room expandedId resets on mode switch.** State switcher onChange calls both `setMode()` and `setExpandedId(null)`.

6. **Control Room tier data model.** `tier: "minor" | "escalated" | "suspended" | null`. Non-compliance items (carrier suspension, registration rejection, payment failure) have `tier: null` and are not expandable.

7. **UrbanBites Suspended item has `rewrittenMessage: null as unknown as string`.** This is intentional — suspended messages don't get rewritten, they're blocked. The expanded detail checks `tier === "suspended"` to show blocked message only.

8. **Three-part pricing: $49 / $150 / $19/mo.** Registration fee at submission, go-live fee after approval, monthly ongoing. Confirmed correct across all prototype files except orphaned `shared.tsx` and possibly the How It Works modal internals.

9. **Orphaned files still on disk** — `prototype/components/dashboard/` and `prototype/app/c/` safe to delete. `shared.tsx` in that directory still has $199.

10. **Terminal registration statuses.** "Declined" = pre-submission (RelayKit rejected). "Abandoned" = post-submission (carrier rejected multiple times). Both show in "Closed" filter, excluded from "Active".

11. **Registration Pipeline state is local to the page.** Editable descriptions, messages, and business fields are `useState` — no persistence. Refreshing resets all edits.

12. **Tab bar hidden for `/register` routes.** Layout checks `pathname.includes("/register")`. App header stays visible.

13. **Layout forces logged-in state.** `useEffect` calls `setLoggedIn(true)` on mount.

---

## Files Modified This Session

```
# Pricing audit
prototype/app/page.tsx                              # Go Live card + how-it-works context line
prototype/app/sms/[category]/page.tsx               # Pricing line styling + full-width What You Get
prototype/app/sms/[category]/messages/page.tsx       # Go Live card + stranger hero pricing
prototype/app/apps/[appId]/overview/page.tsx         # Timeline steps + rejected refund

# Control Room
prototype/app/admin/page.tsx                         # Inline expansion, D-242 tier model, expandable queue

# Decisions
DECISIONS.md                                         # D-242, D-243

# Session close-out
PROTOTYPE_SPEC.md                                    # Pricing updates, Control Room expansion spec, category landing layout
CC_HANDOFF.md                                        # This file (overwritten)
```

---

## What's Next (suggested order)

1. **Overview compliance attention section** (D-243) — customer-facing ledger with edit/dismiss actions, tier-based styling
2. **Approved dashboard redesign** (D-233) — message types table + 3 summary cards
3. **Messages tab Approved state** (D-159) — read-only personalization with registered values
4. **Compliance protection copy** (D-241) — add one-liners to category landing, home page, Overview sidebar
5. **Compliance alerts toggle on Overview** (D-239) — status line on compliance card + Settings link
6. **How It Works modal pricing audit** — verify $49/$150 bridge line in modal pricing cards
7. **Admin — Revenue & Metrics** — MRR trend, customer growth, registration funnel, churn
8. **Delete orphaned files** — `/c/` routes, `components/dashboard/`
