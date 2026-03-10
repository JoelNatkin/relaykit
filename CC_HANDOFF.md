# CC_HANDOFF.md — Session Handoff
**Date:** 2026-03-10 (session 8 — always-editable cards rewrite + styling refinements)
**Branch:** main

---

## Commits This Session

```
035beb5  feat: always-editable message cards with variable pills, palette, and save-time validation
b9355cf  fix: inline variable styling (bold purple text), palette pill Figma specs, trigger tooltip
```

---

## What We Completed

### 1. Full message card rewrite (message-card.tsx)
- **Always-editable cards** — No Edit button, no modal, no mode toggle. Message body uses `contentEditable` div. Save/Cancel buttons appear only after content changes (dirty state tracking). Clicking outside without changes does nothing.
- **Variable pills (inline)** — All dynamic values (`{app_name}`, `{date}`, `{time}`, `{code}`, `{service_type}`, `{website_url}`, `{customer_name}`) render as bold brand-purple text (`font-semibold text-[#7C3AED]`) at the same font size as surrounding text. No background, no border — just colored bold text showing interpolated preview values. Cursor skips over them (contentEditable="false" spans), backspace deletes whole variable.
- **Variable palette** — When contentEditable has focus, a row of insertable variable buttons appears below the message. Purple-tinted Figma styling: `bg-[#F9F5FF] border-[#E9D7FE] text-[#6941C6] rounded-md`. `onMouseDown` + `preventDefault` prevents blur during insertion. Variables are category-specific and fixed (defined in `CATEGORY_VARIABLES`).
- **Locked STOP suffix** — "Reply STOP to opt out." on every message, non-editable (`select-none pointer-events-none`), STOP is bold. Part of the same visual container.
- **Business name validation** — `{app_name}` is a regular movable variable (not locked). Save blocked if missing: red border, error text, "Insert business name" quick-fix link, save button disabled.
- **Trigger tooltip** — Trigger text moved from below card to an info icon (ⓘ) in the top-right of the card header. Hover shows trigger in a dark tooltip. Custom messages can edit trigger text inside the tooltip.
- **Add message card** — "+ Add message" button at bottom of each tier group. Custom messages get "Custom" badge (neutral gray), editable title, and Delete button.

### 2. Session context updates (session-context.tsx)
- Added `customMessages: CustomMessage[]` to `SessionState`
- Added `addCustomMessage()`, `deleteCustomMessage()`, `updateCustomMessage()` handlers

### 3. Message tier updates (message-tier.tsx)
- Now accepts `categoryId` prop (passed through to MessageCard)
- Renders custom messages alongside data messages
- Renders AddMessageCard at the bottom of every tier group

### 4. Plan page update (plan/page.tsx)
- Passes `categoryId={category.id}` to all `<MessageTier>` instances

### 5. Dead code removal
- Deleted `compliance-checklist.tsx` (per D-68)

### 6. Decisions D-69 through D-72 appended to DECISIONS.md

---

## What's In Progress / Not Yet Built

- Message data for remaining 6 categories (orders, support, marketing, internal, community, waitlist)
- Per-card compliance warnings (not started)
- Drag-and-drop message reordering (not planned for v1)
- Category landing pages, docs page, signup screen, post-registration dashboard

---

## Gotchas for Next Session

1. **Run prototype with:** `cd prototype && npm run dev` — port 3001.

2. **Delete .next before restarting** if you see webpack cache errors: `rm -rf prototype/.next`

3. **ContentEditable is DOM-authoritative** — The message editor uses `contentEditable` with `<span contentEditable="false" data-var="key">` for variable markers. Serialization walks the DOM (`domToTemplate()`). Don't try to make it a controlled React component.

4. **Pill preview sync** — When `state.appName` etc. change, a `useEffect` updates variable text content via `querySelectorAll('[data-var]')` without rebuilding the DOM. Preserves cursor position and edits.

5. **Inline variables vs palette pills have different styling** — Inline: bold purple text, no background (`INLINE_VAR_CLASSES`). Palette: purple-tinted pills with border per Figma specs. These are intentionally different.

6. **Do not add React hooks to plan/page.tsx** — Early return after `useEffect` means adding hooks before it causes runtime errors.

7. **Framer Motion fully removed** — Not in `package.json`. Do not re-add.

8. **Client component redirect pattern** — `plan/page.tsx` and `setup/page.tsx` use `useEffect` + `router.replace()`, not `redirect()`.

9. **Data only for 2 categories** — `verification` (8 messages) and `appointments` (6 messages). Others redirect to `/choose`.

10. **No Untitled UI components in prototype** — Plain Tailwind with semantic color tokens + hex values for badges/pills.

11. **SessionStorage key:** `relaykit_prototype` — separate from production's `relaykit_intake`.

12. **DECISIONS.md now has 72 decisions** (D-01 through D-72).

---

## Files Modified But Not Yet Committed

```
CC_HANDOFF.md  (this file — commit after review)
```

---

## Active Build Context

Prototype message card component is fully rewritten with always-editable contentEditable editing, bold-purple inline variables, purple palette pills, save-time business name validation, locked STOP suffix, trigger tooltip, and custom message support. Implements D-60 through D-65 (superseding intermediate states from session 6).

Active PRDs per CLAUDE.md: PRD_06 (dashboard), PRD_01 (intake), PRD_03 (compliance site), PRD_05 (deliverable). Phase 2 PRDs remain out of scope.
