# CC_HANDOFF.md — Session Handoff
**Date:** 2026-03-23 (Settings page rebuild with full lifecycle state differentiation)
**Branch:** main

---

## Commits This Session

```
7ec98f8  feat: add What was submitted subsection to Rejected registration state
c52fc4b  fix: remove Plan row from Registration, disable live key copy button when masked
78b2791  fix: add "additional" to billing includes copy
f431f31  fix: add Includes row to Approved billing section
6e2801d  fix: add copy button to live API key field
3ce0b70  fix: remove Regenerate link from sandbox API key section
7bba1db  fix: darken toggle off-state from gray-100 to gray-300 for visibility
b7e70b2  fix: right-align all action buttons and links on Settings tab
262da3c  fix: SMS compliance alerts heading to section header style
8482511  fix: bump Settings type to 14px body, 18px section headers, add toggle gap
b304173  docs: D-201–D-210, rewrite PROTOTYPE_SPEC Settings section, CC_HANDOFF update
ebf2586  feat: rebuild Settings page with full lifecycle state differentiation
05b4946  fix: rename Changes Requested to Extended Review in state switcher
2b72335  fix: sk→rk sandbox prefix, TS errors, error token in settings
f17afae  docs: append D-193 through D-200, add Sinch migration to BACKLOG
```

Previous session commits (already on main before this session):
```
f33ecc8  docs: session hygiene — D-183–D-192, rewrite PROTOTYPE_SPEC for Messages pages, CC_HANDOFF update
894cc87  fix: use Untitled UI code-02 icon for Other tool logo
9c00d0c  fix: marketing section heading and body copy
0bc45c6  fix: generic placeholder text in opt-in form preview
fe3c369  fix: generic placeholder text in personalization fields, add https:// prefix to URL field
```

---

## What We Completed

### Pre-session Decisions (D-193–D-200)
- Registration fee split $49/$150 (D-193), customer-initiated second payment (D-194), RelayKit LLC entity change (D-195), beta pricing $49 flat (D-196), beta access requires user testing (D-197), production build strategy (D-198), Sinch evaluation pending (D-199), usability test instrument (D-200)

### Pre-work Fixes
1. **`sk_sandbox_` → `rk_sandbox_`** and **`sk_live_` → `rk_live_`** — All API key prefixes in `sample-data.ts` updated
2. **TS errors in settings/page.tsx** — Added explicit `<string>` type to 4 `useState` calls (literal types from `as const` SAMPLE data)
3. **`bg-bg-error-solid_hover` token** — Doesn't exist in theme. Replaced with `hover:bg-[var(--color-error-700)]`

### State Switcher Rename (D-202)
4. **"Changes Requested" → "Extended Review"** — Display label only, internal value remains `changes_requested`. Indicator dot changed from red to amber.

### Settings Page Full Rebuild (D-201–D-214)
5. **Full lifecycle state differentiation** across all 5 registration states (Default, Pending, Extended Review, Approved, Rejected)
6. **5 sections:** SMS Compliance Alerts → Account Info → Registration → API Keys → Billing
7. **Typography:** 14px body text (`text-sm`), 18px section headers (`text-lg font-semibold`) matching Messages tab
8. **All action buttons/links right-aligned** (`flex justify-end`)
9. **SMS alerts toggle off by default** (D-201), off-state uses `gray-300` for visibility
10. **Account info varies by state** (D-210) — Default: email + personal phone. Pending onward: adds read-only business name + category
11. **Registration section** — Pending (in review + timeline), Extended Review (carrier handling), Approved (active + details, no Plan row — D-212), Rejected (What was submitted + debrief box — D-206, D-214)
12. **API keys** — Sandbox: always visible, copy button, no Regenerate (D-211). Live (Approved only): masked, copy button disabled (`opacity-30 cursor-not-allowed`), Regenerate with confirmation modal (D-205)
13. **Billing reflects D-193 fee split** — $49 paid in Pending, $49 refunded in Rejected, $19/mo + Includes row (D-213) + cancel flow in Approved
14. **Removed sections:** Developer tools (D-203, moves to Messages tab), Portability (D-204, backlogged)

### Documentation
15. **DECISIONS.md** — D-193–D-214 (22 new decisions)
16. **PROTOTYPE_SPEC.md** — Settings section fully rewritten
17. **BACKLOG.md** — 6 new items: Sinch migration plan, rejected state field expansion, privacy/legal baseline, developer tools on Messages tab, account-level settings, high-volume pricing tier
18. **CC_HANDOFF.md** — This file

---

## In Progress / Partially Done

### Messages Tab — Approved State
Not yet differentiated. Still renders Default layout. Planned per D-159:
- Personalization fields read-only with registered values
- AI commands still available
- No "registered" badges on individual cards

### Messages Tab — Pre-download State
Not yet designed (D-162). The initial download happens on the public Messages page, not here. This tab doesn't exist until a project is created.

### Default layout (`?layout=default`) — Synced
The `?layout=default` variant of the public messages page was synced in a prior session with the same toolbar, slideout, and right column changes as StepsLayout.

---

## Gotchas for Next Session

1. **Delete `.next` before every dev server start.** Always: `rm -rf prototype/.next` then restart. Port 3001.

2. **Messages tab `categoryId`** derives from `state.selectedCategory`, falling back to `"appointments"`. Fine for prototype — production reads from actual app record.

3. **`isToolOpen` state is in `AppMessagesPage`** — toggle button and panel in same component. `ToolPanel` manages its own internal state.

4. **No Untitled UI base components in prototype** — plain Tailwind + semantic color tokens only.

5. **`ShieldCheck` does NOT exist** in `@untitledui/icons` — use `ShieldTick`.

6. **"Appointments" pill in layout.tsx is hardcoded** — needs to be dynamic for multi-category.

7. **`expandedCardId` state exists in 3 places** — `AppMessagesPage`, `StepsLayout` (internal), and `PublicMessagesPage`. Each manages its own "only one expanded at a time" scope independently.

8. **Marketing section scroll targets** — Three different `id` attributes: `marketing-section` (apps page), `marketing-section-steps` (sms StepsLayout), `marketing-section-default` (sms default layout).

9. **`hasDownloaded` state is component-level** — Post-download AI prompts band on public messages page resets on navigation/refresh. Production should persist this.

10. **`InteractiveToolSelector` used in 2 places** — Inside files-only confirmation modal AND post-download AI prompts band. Both are independent instances.

11. **`showPersonalize` state exists in 3 places** — `AppMessagesPage`, `StepsLayout`, and `PublicMessagesPage` default layout. Each manages its own slideout instance.

12. **Default view mode is `"template"`** — Both pages initialize to template view, then auto-switch to preview on mount if localStorage has personalization data.

13. **`onRequestPersonalize` callback on CatalogCard** — Optional prop. Per-card preview toggle opens slideout when personalization is empty. Both pages pass `() => setShowPersonalize(true)`.

14. **Orphaned files still on disk** — `prototype/components/dashboard/` and `prototype/app/c/` are safe to delete.

15. **DECISIONS.md now has 214 decisions** (D-01 through D-214).

16. **Settings page `ConfirmModal` is local** — Reusable modal extracted within settings page (cancel plan, regen live key). Could be promoted to shared component if other pages need it.

17. **Settings alert phone Edit is a no-op** — Placeholder button. In production, would navigate to account-level settings.

18. **Overview page still says "Changes requested"** — The D-202 rename (Extended Review) was applied to layout.tsx status indicator and state switcher. Overview page Section 2 content for `changes_requested` state may still use old terminology — verify and align in a future session.

19. **Live key copy button disabled state** — Uses `opacity-30 cursor-not-allowed disabled` on a plain button with inline SVG. When live key regeneration is implemented, swap to active `CopyButton` component with the real key value.

20. **"What was submitted" in Rejected state uses mock data** — Business name, EIN, address, use case are hardcoded. Production will read from the registration record.

---

## Files Modified This Session

```
prototype/app/apps/[appId]/settings/page.tsx   # Major: full lifecycle rebuild, typography, layout
prototype/app/apps/[appId]/layout.tsx          # State switcher label + dot color
prototype/components/dashboard/sample-data.ts  # sk→rk prefix, sk_live→rk_live
DECISIONS.md                                   # D-193–D-214 appended
PROTOTYPE_SPEC.md                              # Settings section fully rewritten
BACKLOG.md                                     # 6 new items added
CC_HANDOFF.md                                  # This file
```

---

## What's Next (suggested order)

1. Differentiate Messages tab Approved state (read-only personalization per D-159)
2. Align Overview page "changes_requested" copy with D-202 ("Extended Review" language)
3. Design "Signed up, pre-download" Messages page state (D-162 — critical conversion moment)
4. Registration form with live message preview (D-161)
5. Delete orphaned `/c/` routes and `components/dashboard/` files
6. Make "Appointments" pill dynamic in layout.tsx
7. Build /test usability instrument (D-200)
