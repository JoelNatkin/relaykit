# CC_HANDOFF.md — Session Handoff
**Date:** 2026-03-19 (Messages tab Default state)
**Branch:** main

---

## Commits This Session

```
20304e8  feat: Messages tab Default state — AI prompts, tool setup, re-download, preview personalization
3346223  docs: add BACKLOG.md, PROTOTYPE_SPEC.md, update CLAUDE.md with prototype quality standards, record D-162–D-166
```

---

## What We Completed

### Messages Tab — Default State (post-download, pre-registration)

`/apps/[appId]/messages` now renders an app-specific component (`AppMessagesPage`) for logged-in users instead of the public messages page. The public page at `/sms/[category]/messages` is completely untouched.

**Layout from top to bottom:**

1. **AI prompts header row** — `<h2>AI prompts</h2>` on the left. On the right: "AI tool setup" tertiary text toggle (no border, no bg, `text-text-tertiary`) + "Re-download RelayKit" primary CTA (`bg-bg-brand-solid`).

2. **AI prompts card grid** — 4-card grid (`grid-cols-2 lg:grid-cols-4`). Cards match Overview Register/Compliance card style (`rounded-lg border border-border-secondary bg-bg-primary p-4`). Each has a 40×40 purple icon square, `text-sm font-semibold` heading, and italic prompt text (not mono — D-168). Copy button top-right, flips to green checkmark. Four prompts: "Review my messages for compliance" (ShieldTick), "Write a message that lets us tell users [goal]" (Edit03), "Add a new message type for [purpose]" (MessagePlusSquare), "Check my opt-in form for compliance" (ClipboardCheck).

3. **AI tool setup panel** — toggled by the "AI tool setup" button. `isToolOpen` state lives in the page component. Renders `<ToolPanel />` below the card grid. Same 6-tool logo row + per-tool command + copy button as public page. Collapsed by default (D-160).

4. **Two-column layout** (`lg:grid-cols-[300px_1fr]`):
   - Left (sticky): "Personalize" h2 + 3 inputs + "Preview only — your downloaded files use template variables." note (`text-xs text-text-quaternary`) + "Sample opt-in form" h2 + `<CatalogOptIn>`
   - Right: "Messages" h2 + copy toolbar + variant pills + `<CatalogCard>` list + marketing callout

5. **All 5 registration states render the same content.** Pending/Changes Requested/Rejected stay identical to Default (D-170). Approved differentiation is the next step (D-159).

**No "Last downloaded" date** — removed as unnecessary (D-169).

### DECISIONS.md
Appended D-167 through D-170.

### PROTOTYPE_SPEC.md
Messages Tab section rewritten from a stub to a full spec — includes exact layout anatomy, card details, pending items, and per-state differentiation plan.

---

## In Progress / Partially Done

### Messages Tab — Approved State
Not yet differentiated. Currently renders identical to Default. Planned per D-159:
- Personalization fields read-only, showing registered values (`business_name` from registration record)
- AI commands still available
- No "registered" badges on individual message cards (full creative freedom within registered use case)

### Body Copy — Not Written
Two `[PENDING]` items flagged in PROTOTYPE_SPEC.md:
- Framing copy under "AI prompts" heading (e.g. "Copy these into your AI coding tool with your RelayKit files loaded.")
- Framing copy above tool setup panel when expanded (e.g. "First time? Follow the steps for your tool.")

---

## Gotchas for Next Session

1. **Delete `.next` before every dev server start.** Always: `rm -rf prototype/.next` then restart. Port 3001.

2. **Messages tab `categoryId`** derives from `state.selectedCategory`, falling back to `"appointments"`. Fine for prototype — will need to read from the actual app record in production.

3. **`isToolOpen` state is in `AppMessagesPage`** — the toggle button and the panel it controls are in the same component. The `ToolPanel` component is self-contained (manages `selectedTool` and `promptCopied` internally); only the open/close state lives above it.

4. **No Untitled UI base components in prototype** — plain Tailwind + semantic color tokens only. No `import { Button } from "@/components/base/..."`.

5. **`ShieldCheck` does NOT exist** in `@untitledui/icons` — use `ShieldTick`. Always verify icon names.

6. **4 pre-existing TS errors in `settings/page.tsx`** (string→literal type mismatches from a prior session). Not introduced this session, not blocking.

7. **`bg-bg-error-solid` in settings cancel modal** — may not be defined in the current Untitled UI theme. Verify visually.

8. **Orphaned files still on disk** — `prototype/components/dashboard/` (old A/B/C variants) and `prototype/app/c/` (legacy catalog routes) are safe to delete but haven't been.

9. **"Appointments" pill in layout.tsx is hardcoded** — needs to be dynamic when multi-category is supported.

10. **DECISIONS.md now has 170 decisions** (D-01 through D-170).

11. **D-104 gate still active** — PRDs must be updated to reflect D-84–D-103 before production code is built from them. Prototype work is exempt (D-163), but production builds need updated PRDs first.

---

## Files Modified This Session

```
prototype/app/apps/[appId]/messages/page.tsx   # Fully rewritten — AppMessagesPage
PROTOTYPE_SPEC.md                               # Messages Tab section rewritten
DECISIONS.md                                    # D-167–D-170 appended
CC_HANDOFF.md                                   # This file
```

---

## What's Next (suggested order)

1. Write body copy for AI prompts section header and tool setup panel intro
2. Differentiate Messages tab Approved state (read-only personalization per D-159)
3. Design "Signed up, pre-download" state of Messages page (D-162 — most critical conversion moment)
4. Download confirmation flow — orient users toward Overview after download (PROTOTYPE_SPEC "Screens Not Yet Built")
5. Registration form with live message preview (D-161)
6. Delete orphaned `/c/` routes and `components/dashboard/` files
7. Make "Appointments" pill dynamic in layout.tsx

---

## Prototype File Map

```
prototype/
├── app/
│   ├── page.tsx                          # Marketing home
│   ├── compliance/page.tsx               # Public compliance page
│   ├── auth/page.tsx                     # Auth gate (mock)
│   ├── apps/
│   │   ├── page.tsx                      # Your Apps (project list)
│   │   └── [appId]/
│   │       ├── layout.tsx                # App shell (name, pill, tabs, state switchers, period selector)
│   │       ├── page.tsx                  # Redirects to /overview
│   │       ├── overview/
│   │       │   ├── page.tsx              # Conditional: approved dashboard OR three-section accordion
│   │       │   └── approved-dashboard.tsx # Full 3×2 card grid (Approved state)
│   │       ├── messages/page.tsx         # AppMessagesPage — Default state stable
│   │       └── settings/page.tsx         # 600px, inline editing, cancellation, portability
│   ├── sms/[category]/
│   │   ├── page.tsx                      # Category landing (appointments)
│   │   └── messages/page.tsx             # Public messages page — UNTOUCHED
│   └── c/[categoryId]/                   # ORPHANED — safe to delete
├── components/
│   ├── top-nav.tsx                       # Context-aware nav
│   ├── footer.tsx                        # Shared footer
│   ├── category-modal.tsx                # Category picker
│   ├── catalog/                          # CatalogCard, CatalogOptIn
│   └── dashboard/                        # ORPHANED — old A/B/C variants, safe to delete
├── public/logos/                          # SVG logos for tool selector
├── context/session-context.tsx           # State management
├── lib/catalog-helpers.ts                # Template interpolation
└── data/messages.ts                      # Message library
```
