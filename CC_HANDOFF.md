# CC_HANDOFF.md — Session Handoff
**Date:** 2026-03-22 (Settings page rebuild, state switcher rename, prefix fixes)
**Branch:** main

---

## Commits This Session

```
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

### Pre-work Fixes
1. **`sk_sandbox_` → `rk_sandbox_`** — All API key prefixes in `sample-data.ts` updated. Also fixed `sk_live_` → `rk_live_`.
2. **TS errors in settings/page.tsx** — Added explicit `<string>` type to 4 `useState` calls that had literal types from `as const` SAMPLE data.
3. **`bg-bg-error-solid_hover` token** — Doesn't exist in theme. Replaced with `hover:bg-[var(--color-error-700)]`.

### State Switcher Rename
4. **"Changes Requested" → "Extended Review"** (D-202) — Display label only, internal value remains `changes_requested`. Indicator dot changed from red to amber to match reframing (not an error, normal process).

### Settings Page Full Rebuild
5. **Full lifecycle state differentiation** — Page now renders differently across all 5 registration states (Default, Pending, Extended Review, Approved, Rejected).
6. **5 sections:** SMS Compliance Alerts → Account Info → Registration → API Keys → Billing.
7. **SMS alerts toggle off by default** (D-201) — Opt-in SMS escalation, email always on.
8. **Account info varies by state** (D-210) — Default shows email + personal phone only. Pending onward adds read-only business name + category.
9. **Registration section** — State-specific content: Pending (in review + timeline), Extended Review (carrier handling it), Approved (active + details), Rejected (debrief box + refund confirmation).
10. **API keys** — Sandbox key always visible with copy + regenerate. Live key (Approved only) masked, no copy, regenerate as recovery. Confirmation modals for both.
11. **Billing reflects D-193 fee split** — $49 paid in Pending, $49 refunded in Rejected, $19/mo in Approved with cancel flow.
12. **Removed sections:** Developer tools (D-203, moves to Messages tab), Portability (D-204, backlogged).

### Decisions & Docs
13. **D-193 through D-200** — 8 decisions from pre-session brainstorming (fee split, entity change, beta pricing, production build strategy, Sinch evaluation, usability testing).
14. **D-201 through D-210** — 10 decisions from Settings rebuild.
15. **PROTOTYPE_SPEC.md** — Settings section completely rewritten.
16. **BACKLOG.md** — Sinch migration plan added under Infrastructure & Operations.

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
The `?layout=default` variant of the public messages page was synced last session with the same toolbar, slideout, and right column changes as StepsLayout.

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

15. **DECISIONS.md now has 210 decisions** (D-01 through D-210).

16. **Settings page `ConfirmModal` is local** — Reusable modal extracted within settings page (cancel plan, regen sandbox key, regen live key). Could be promoted to shared component if other pages need it.

17. **Settings alert phone Edit is a no-op** — Placeholder button. In production, would navigate to account-level settings.

18. **Overview page still says "Changes requested"** — The D-202 rename (Extended Review) was applied to layout.tsx status indicator and state switcher. Overview page Section 2 content for `changes_requested` state may still use old terminology — verify and align in a future session.

---

## Files Modified This Session

```
prototype/app/apps/[appId]/settings/page.tsx   # Major: full lifecycle rebuild
prototype/app/apps/[appId]/layout.tsx          # State switcher label + dot color
prototype/components/dashboard/sample-data.ts  # sk→rk prefix, sk_live→rk_live
DECISIONS.md                                   # D-193–D-210 appended
PROTOTYPE_SPEC.md                              # Settings section rewritten
BACKLOG.md                                     # Sinch migration plan added
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
