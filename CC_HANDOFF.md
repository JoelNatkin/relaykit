# CC_HANDOFF.md — Session Handoff
**Date:** 2026-03-20 (Messages page polish, layout restructure, AI prompts expander)
**Branch:** main

---

## Commits This Session

```
[pending]  feat: Messages page polish — layout swap, AI prompts expander, status indicator, copy/marketing redesign
```

Previous session commits (already on main):
```
7f5f599  feat: finalize section body copy on Messages pages, text-secondary color
156722a  fix: close missing inner div in AI prompts header, fix orphaned /c/ route props
5fb1d07  feat: rename Personalize → Preview your messages, add section body copy
9fb6bfa  feat: remove checkboxes/copy-selected, tighten opt-in disclosure copy (D-171, D-172)
```

---

## What We Completed

### Messages Tab — Major Restructure

Full polish pass on `/apps/[appId]/messages`. Changes from top to bottom:

1. **Page title removed** — No h1 on any of the three pages (Overview, Messages, Settings). Tab label is the page identifier (D-167).

2. **Status indicator in layout** — Right-aligned on the GlowStudio + Appointments row. Colored dot + label for all 5 registration states (D-176). Visible on every tab.

3. **AI prompts header** — "AI tool setup" and "Download RelayKit" (renamed from "Re-download") moved inline with the "AI prompts" h2. Pipe separator (`|`) between them. Both tertiary text style (D-177). Body copy: "Quick commands for your AI tool with RelayKit loaded in your project."

4. **AI command cards** — Icon background shrunk from 40×40 to 32×32 (`h-8 w-8`, icon `size-4`). Copy button has tooltip "Copy prompt."

5. **Layout swap** — Messages column moved to the left (`1fr`). Preview/opt-in moved to the right (`300px`, sticky). Right column headers use `text-sm font-semibold` (14px) — visually subordinate (D-175).

6. **Messages section toolbar** — Icon-only buttons replaced with icon + text label: "Show template"/"Show preview" and "Copy all". `text-text-tertiary`, `gap-5`. No tooltips (D-178).

7. **Variant pills** — `mt-4 mb-5` spacing. "Need marketing messages?" link in brand purple semibold with chevron-down icon, smooth-scrolls to marketing section.

8. **CatalogCard changes:**
   - "Modify with AI ›" expander replaces single prompt nudge footer (D-174). Brand purple semibold text. Only one expanded at a time.
   - AI prompt copy = interpolated message (in quotes) + prompt. Per-prompt tooltip.
   - View toggle + copy button have tooltips on the card header.
   - Variables styled `font-normal text-text-brand-secondary` (D-179).
   - Message card titles `text-sm` (matching AI command card headings).

9. **Marketing section** — New copy: "Promos and offers require a separate registration. Get your app live first, then add marketing from your dashboard." Badge removed. Cards: white bg, no opacity, `border-border-secondary`.

10. **Opt-in form** — Preview only, all copy functionality stripped (D-173). "Opt-in form preview" header. Body: "Required by carriers. RelayKit keeps yours updated." Placeholder name "Alex Rivera."

11. **Right column** — "Preview your messages" header. Body: "See how messages look with your details."

### Public Messages Page — Synced

`/sms/[category]/messages` StepsLayout and default layout both synced with post-download tab:
- Same column swap (messages left, preview/opt-in right, `1fr / 300px`)
- Same text-labeled toolbar buttons and body copy
- Same "Modify with AI" expander (already wired from CatalogCard component)
- Same opt-in form (preview only, from shared component)
- Same marketing section copy and card styling
- "Personalize" renamed to "Preview your messages" in StepsLayout
- Hero, tool selector, and download modal untouched

### Other Changes

- **Overview + Settings** — h1 page titles removed
- **BACKLOG.md** — 8 items added (4 Likely, 4 Maybe) from Joel's notes
- **DECISIONS.md** — D-173 through D-179 appended
- **PROTOTYPE_SPEC.md** — Messages Tab and Public Messages Page sections rewritten; App Layout Shell updated for status indicator

---

## In Progress / Partially Done

### Messages Tab — Approved State
Not yet differentiated. Still renders Default layout. Planned per D-159:
- Personalization fields read-only with registered values
- AI commands still available
- No "registered" badges on individual cards

### Messages Tab — Pre-download State
Not yet designed (D-162). The initial download happens on the public Messages page, not here. This tab doesn't exist until a project is created.

---

## Gotchas for Next Session

1. **Delete `.next` before every dev server start.** Always: `rm -rf prototype/.next` then restart. Port 3001.

2. **Messages tab `categoryId`** derives from `state.selectedCategory`, falling back to `"appointments"`. Fine for prototype — production reads from actual app record.

3. **`isToolOpen` state is in `AppMessagesPage`** — toggle button and panel in same component. `ToolPanel` manages its own internal state.

4. **No Untitled UI base components in prototype** — plain Tailwind + semantic color tokens only.

5. **`ShieldCheck` does NOT exist** in `@untitledui/icons` — use `ShieldTick`.

6. **4 pre-existing TS errors in `settings/page.tsx`** (string→literal type mismatches from a prior session). Not blocking.

7. **`bg-bg-error-solid` in settings cancel modal** — may not be defined in theme. Verify visually.

8. **Orphaned files still on disk** — `prototype/components/dashboard/` and `prototype/app/c/` are safe to delete.

9. **"Appointments" pill in layout.tsx is hardcoded** — needs to be dynamic for multi-category.

10. **DECISIONS.md now has 179 decisions** (D-01 through D-179).

11. **`expandedCardId` state exists in 3 places** — `AppMessagesPage`, `StepsLayout` (internal), and `PublicMessagesPage`. Each manages its own "only one expanded at a time" scope independently.

12. **Marketing section scroll targets** — Three different `id` attributes: `marketing-section` (apps page), `marketing-section-steps` (sms StepsLayout), `marketing-section-default` (sms default layout). Needed because the same page file has two layout branches.

---

## Files Modified This Session

```
prototype/app/apps/[appId]/layout.tsx           # Status indicator, h1 retained, state switchers grouped
prototype/app/apps/[appId]/messages/page.tsx     # Full restructure — layout swap, toolbar, AI prompts row
prototype/app/apps/[appId]/overview/page.tsx     # h1 page title removed
prototype/app/apps/[appId]/settings/page.tsx     # h1 page title removed
prototype/app/sms/[category]/messages/page.tsx   # Synced with post-download — layout swap, toolbar, copy
prototype/components/catalog/catalog-card.tsx     # Modify with AI expander, variable styling, tooltips, title size
prototype/components/catalog/catalog-opt-in.tsx   # Preview only — all copy functionality stripped
prototype/lib/catalog-helpers.ts                 # AI_PROMPTS_BY_ID map + getAiPrompts export
BACKLOG.md                                       # 8 items added
DECISIONS.md                                     # D-173–D-179 appended
PROTOTYPE_SPEC.md                                # Messages Tab + Public Messages Page rewritten, layout header updated
CC_HANDOFF.md                                    # This file
```

---

## What's Next (suggested order)

1. Differentiate Messages tab Approved state (read-only personalization per D-159)
2. Design "Signed up, pre-download" Messages page state (D-162 — critical conversion moment)
3. Download confirmation flow — orient users toward Overview after download
4. Registration form with live message preview (D-161)
5. SMS_GUIDELINES.md opt-in section (BACKLOG Likely item — critical for "RelayKit keeps yours updated" promise)
6. Delete orphaned `/c/` routes and `components/dashboard/` files
7. Make "Appointments" pill dynamic in layout.tsx
