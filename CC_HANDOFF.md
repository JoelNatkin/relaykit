# CC_HANDOFF.md — Session Handoff
**Date:** 2026-03-11 (session 11 — catalog page visual polish + marketing divider)
**Branch:** main

---

## Commits This Session

```
(pending)  feat: catalog page polish — marketing divider, input sizing, card layout, icon toolbar
```

Previous session commits (still on main):
```
06a7542  docs: session 10 handoff + D-74 through D-79 (catalog UX decisions)
69701a7  feat: catalog page UX overhaul — sentence builder, opt-in, tooltips, copy system
20963ca  docs: session 9 handoff + D-73 (catalog flat layout decision)
aa9971f  fix: hide opt-in until selection, remove duplicate consent text
66c86a2  fix: two-column layout, title, tooltip, checkbox, copy block for catalog
014ffc0  feat: message catalog page with opt-in preview and copy system
a55cc0a  feat: read-only message catalog — helpers, card component, nav link
```

---

## What We Completed This Session

### 1. Marketing section divider (D-80)
Catalog page now splits messages into transactional (tier !== "expansion") and marketing (tier === "expansion") groups. A section divider appears above marketing cards with "Marketing & promotion messages", "+$10/mo", and subtext. Pattern pulled from plan page's `MessageTier` component.

### 2. Icon-only toolbar (D-81)
Replaced "Preview | Template" bordered pill toggle and split copy button with icon-only buttons: Code/Eye toggle + clipboard+chevron copy dropdown. Icons sit inline with "Your messages" h2. Scroll-triggered border uses IntersectionObserver + sentinel div.

### 3. Sentence builder improvements
- "Preview:" label styled bold/dark to match input text (font-semibold text-text-primary)
- Inputs use hidden `<span>` measurement for accurate shrink-to-fit width (D-82)
- Input border color changed to `border-[#D0D5DD]`, font size bumped to `text-lg`
- Padding: `paddingLeft: 2px, paddingRight: 4px`, min width 80px

### 4. Card layout refinements
- Message title bumped from `text-sm` to `text-base` (D-84)
- Checkbox moved from left of title to far right, after all icon buttons, with `ml-2` gap (D-83)
- Header-to-body spacing reduced from `mt-3` to `mt-1`
- Prompt nudge in background strip: `border-t bg-bg-secondary rounded-b-xl` with negative margins (D-85)

### 5. Opt-in card cleanup (D-86)
- Copy button changed from top bar with border-b to absolute-positioned icon at top-right
- Legal links changed from `<a>` tags to `<span>` showing actual URLs
- Prompt nudge top padding reduced

### 6. Category icon styling
- Circle: `w-10 h-10 rounded-full bg-[#F9F5FF]` with `style={{ padding: '4px 12px' }}`
- Icon: `w-5 h-5 text-[#7C3AED]`

### 7. Template interpolation fix (D-87)
- `service_type` default changed from `"appointment"` to `""` to prevent "appointment appointment"
- Copy block output uses `.replace(/  +/g, " ")` to collapse double spaces

### 8. Column alignment fix
- Grid matches plan page: `md:grid-cols-[45fr_55fr]` with `gap-10`
- Removed `md:pb-3` from right column sticky header to align first card with opt-in card
- Left column: `md:self-start md:sticky md:top-20`

### 9. Tooltip sizing
- Added `min-w-[220px]` alongside existing `max-w-[280px]` for better aspect ratio

### 10. New decisions D-80 through D-87
Appended 8 new decisions to DECISIONS.md covering all catalog UX changes.

---

## What's In Progress / Not Yet Built

- Message data for remaining 6 categories (orders, support, marketing, internal, community, waitlist) — these redirect to `/choose`
- Category landing pages, docs page, signup screen, post-registration dashboard
- Per-card compliance warnings
- Remaining tooltip text and prompt nudges for categories beyond verification + appointments (fallback works fine)

---

## Gotchas for Next Session

1. **Run prototype with:** `cd prototype && npm run dev` — port 3001.

2. **Delete .next before restarting** if you see webpack cache errors or stale UI: `rm -rf prototype/.next`

3. **Two separate card components exist:**
   - `prototype/components/plan-builder/message-card.tsx` — interactive, contentEditable (plan page)
   - `prototype/components/catalog/catalog-card.tsx` — read-only (catalog page)
   Do not merge or cross-import between them.

4. **Hardcoded hex values in catalog components** — Several colors use hardcoded hex instead of semantic tokens because tokens resolve incorrectly in the prototype:
   - Tooltip: `bg-[#333333]` with `text-white`
   - Checkbox checked: `bg-[#7C3AED] border-[#7C3AED]`
   - Marketing badge: `bg-[#F9F5FF] border-[#E9D7FE] text-[#7C3AED]`
   - Category icon circle: `bg-[#F9F5FF]`, icon: `text-[#7C3AED]`
   - Input border: `border-[#D0D5DD]`

5. **Catalog card tooltip overflow** — Card has `overflow-visible` and tooltip uses `z-[100]` + `pointer-events-none`. Don't add `overflow-hidden` to cards.

6. **Per-card view toggle logic** — `localViewMode` is `null` by default (follows global). First click sets opposite of global. Second click clears to null.

7. **Sentence builder input sizing** — Uses hidden `<span>` with matching font properties to measure text width. `offsetWidth + 8px` for padding. Min width 80px. Falls back to minWidth when value is empty.

8. **ContentEditable is DOM-authoritative (plan builder only)** — Don't touch plan page cards.

9. **Framer Motion fully removed** — Not in `package.json`. Do not re-add.

10. **Client component redirect pattern** — Both `plan/page.tsx` and `messages/page.tsx` use `useEffect` + `router.replace()`, not `redirect()`.

11. **Data only for 2 categories** — `verification` (8 messages) and `appointments` (6 messages).

12. **No Untitled UI components in prototype** — Plain Tailwind with semantic color tokens + hex values.

13. **SessionStorage key:** `relaykit_prototype` — separate from production's `relaykit_intake`.

14. **DECISIONS.md now has 87 decisions** (D-01 through D-87).

15. **Plan page must stay untouched** — verified with `git diff` after every session. The catalog page and plan page are completely independent.

16. **Catalog messages split into two groups** — `coreMessages` (tier !== "expansion") rendered first, then `expansionMessages` (tier === "expansion") below the marketing divider. The divider only renders when expansion messages exist.

17. **Checkbox is far-right on cards** — After copy icon with `ml-2` (8px) gap. Order: [title+badge] ... [code] [info] [copy] [gap] [checkbox].

---

## Active Build Context

Two prototype page types exist:
- **Plan page** (`/c/[category]/plan`) — interactive plan builder with always-editable contentEditable cards, variable pills, palette, save-time validation, locked STOP suffix, custom message support
- **Catalog page** (`/c/[category]/messages`) — read-only message catalog with marketing section divider, icon-only toolbar, shrink-to-fit sentence builder, educational tooltips, copy combo dropdown, always-visible opt-in preview, checkbox at far right

Active PRDs per CLAUDE.md: PRD_06 (dashboard), PRD_01 (intake), PRD_03 (compliance site), PRD_05 (deliverable). Phase 2 PRDs remain out of scope.
