# CC_HANDOFF.md — Session Handoff
**Date:** 2026-04-15/16 (Account settings + avatar dropdown; shared messages/metrics grid)
**Branch:** main (2 commits ahead of origin/main — not pushed per Joel's request, PM review first)

---

## Commits This Session (2)

```
9418ba0  feat(prototype): avatar dropdown + /account page + shared messages/metrics grid
<this>   docs: session close-out — 2026-04-15/16 (grid alignment, avatar dropdown, /account scaffold)
```

Everything else from the previous session (through `cee3f95`) is already in `origin/main` — the two unpushed commits are everything this session produced plus this handoff.

---

## What Was Completed

### Shared messages/metrics grid on the workspace page
`prototype/app/apps/[appId]/page.tsx` — the message cards and the right rail now sit on the same 3-column grid as the Registered-state metrics row above them.
- Messages column: `col-span-2` (no change structurally, but the `min-[860px]:max-w-[540px]` wrapper on `messageList` is removed, so cards fill the two-col cell).
- Right rail: 1 column in that same grid (existing behavior preserved).
- Gap: both the metrics grid and the messages grid use `gap-6` (24px). The metrics grid was bumped from `gap-4` → `gap-6` so the two grids align pixel-for-pixel.
- Applies in both Registered and non-Registered post-onboarding states (both grid blocks got the `gap-6` update).
- Untouched: the Ask Claude two-column (`md:grid-cols-2 md:gap-10`) layout — that's an override, not part of the shared grid.

### Avatar dropdown replaces freestanding "Sign out" link
`prototype/components/top-nav.tsx` — the right side of the logged-in (app) top nav is now a 32px round avatar button (`User01` icon, `bg-gray-200`). Clicking opens a dropdown menu with two items:
- **Account settings** → links to `/account`
- **Sign out** → existing `handleSignOut` flow

Outside-click closes the menu. The unauthenticated "Sign in" text link behavior is unchanged. This is how D-347's "account-vs-app-level field split" gets its entry point.

### `/account` page scaffold
`prototype/app/account/page.tsx` (new, 129 lines). 600px centered column, cards stack `space-y-6`. Implements PRD_SETTINGS v2.3 §8:
- **Login** card — Email row + "Change" brand link (no-op). No auth phone row (v2.3 corrects the model to email-only magic-link auth per D-03/D-59).
- **Payment method** card — "Visa ending in 4242" + "Manage billing →" link (no-op).
- **Danger zone** card (red-bordered) — "Delete account" description + tertiary-text trigger.
- **Delete confirmation modal** — `bg-black/50` backdrop, typed-DELETE gate, Cancel / "Delete account" (red, disabled until input equals "DELETE"). Confirming is a close-modal no-op.

### DashboardLayout tweaks
`prototype/components/dashboard-layout.tsx`:
- Settings top-bar link is **icon-only** now (`Settings01` gear, no text label; `aria-label="App settings"` for a11y). The text moved to the Settings page H1.
- New **workspace tagline row** on the messages page only (`isMessagesPage` gate): a small `<p>` reading "Your SMS workspace. Build and test your feature, go live when you're ready" sits between the app identity bar and the page content (`text-sm text-gray-500`, `pt-4 -mb-1`, inside the same `max-w-5xl` column).

### Settings page H1 → "App settings"
`prototype/app/apps/[appId]/settings/page.tsx` — single-line change: H1 now reads "App settings" so it's clearly distinct from Account settings at `/account`.

### PRD_SETTINGS v2.3 supersedes v2.2
`docs/PRD_SETTINGS_v2_3.md` replaces `docs/PRD_SETTINGS_v2.2.md` (git tracks as rename, 75% similarity). v2.3 adds the Account Settings §8 spec (resolves an open question from v2.2) and corrects the phone model — RelayKit is email-only magic-link auth, no auth phone.

### PROTOTYPE_SPEC updates
- Global **Navigation** section — logged-in nav rewritten to describe the avatar dropdown.
- **Messages Page** — DashboardLayout header row updated for icon-only settings + new workspace tagline row; messages section header's `mt-2` noted; grid description rewritten (shared 3-col, `gap-6`, messages column uncapped); setup-instructions / metrics descriptions cleaned up.
- **Settings** — H1 changed to "App settings", PRD version bumped to v2.3.
- **New Account Settings** section (between Settings and Admin Dashboard).
- **File map** — `app/account/page.tsx` added.
- **Last updated** → April 16, 2026.

---

## Quality Checks Passed

- `tsc --noEmit` — clean (prototype)
- `next build` — full production build clean; 19/19 static pages generated; `/account` route compiles (1.35 kB)

---

## Decisions Applied / Not Appended

All five candidate changes this session were evaluated against the DECISIONS vs PROTOTYPE_SPEC test and landed in PROTOTYPE_SPEC only — none rose to a new active decision:
1. Shared messages/metrics grid — layout tweak.
2. Workspace tagline copy — UI microcopy.
3. Icon-only Settings gear — visual polish.
4. Settings H1 "App settings" — label disambiguation.
5. Avatar dropdown + `/account` scaffold — **implements** D-347 (account-vs-app field split), not a new decision. Reversing would contradict D-347 directly.

DECISIONS.md is unchanged (last entries still D-346, D-347, D-348).

---

## In Progress / Partially Done (Carried Forward)

### Already carried from previous session (still open)
- Signup backend stubbed (D-59)
- EIN verification backend stubbed (D-302/D-303)
- Phone OTP stubbed (D-46)
- Marketing messages hardcoded for Appointments only
- Ask Claude panel chat composer is a non-functional stub
- Testers invite flow stubbed
- Registered state metrics are mock data
- Marketing-only registration tracker transitions are prototype dropdowns
- Settings Notifications toggle has no backend wiring
- Cancel plan modal's destructive confirm is a close-modal no-op
- Live key Regenerate modal is a no-op
- Settings Add/Edit EIN and Notifications "Change" links are brand-styled no-ops

### New-ish this session
- `/account` is a UI scaffold — no backend. "Change" email, "Manage billing →", and "Delete account" are all no-ops. Delete modal's typed-DELETE gate is enforced on the button's disabled state only; confirming closes the modal without acting.
- Avatar dropdown is not persisted anywhere — clicking Account settings or Sign out relies on existing `useSession` flow; the menu itself is purely local `useState`.
- `/account` hardcodes app name to "GlowStudio" via its own local `APP_NAMES` map — adds to the existing duplication across `dashboard-layout.tsx`, `register/page.tsx`, and `settings/page.tsx` (now 4 copies). Extract to `lib/app-names.ts` is overdue.

---

## Gotchas for Next Session

1. **Two local commits are not pushed.** `9418ba0` (feature work) and the handoff commit. Joel explicitly said "Do NOT push — PM review happens first." Don't `git push` without confirmation.
2. **Avatar dropdown only renders for `isLoggedIn && !isWizardNav`.** During wizard flows (`/start/*`) the nav still shows a plain "Sign out" path via the pre-existing `isWizardNav` branches in `top-nav.tsx`. If wizard UX changes, check both the dropdown branch and the existing wizard branches aren't out of sync.
3. **`/account` hardcodes GlowStudio.** There's no session-context hookup for which app you came from — the "Back to {appName}" link always says "Back to GlowStudio" and jumps to `/apps/glowstudio`. When multi-app lands, route through session state or a referrer param.
4. **Delete-account typed gate is on the button, not the input handler.** If you port this to production with backend wiring, validate on submit too — the `disabled` attribute is a UX affordance, not a security check.
5. **Shared 3-col grid spans both messages and metrics.** If you ever adjust breakpoints, gutters, or column counts, update **both** grids in `page.tsx` together (and the metrics grid if you're in Registered) or they'll drift out of alignment. Lines around 459, 498, 674 in `page.tsx`.
6. **PRD_SETTINGS_v2.2.md is gone.** Git tracked it as a rename to v2_3.md. Anyone with a stale working copy pointing to v2.2 needs to refresh.
7. **`.next` + `node_modules` nuke is still the escalation** for the @untitledui vendor chunk error. Straight `.next` wipes usually work; if not, `rm -rf .next node_modules && npm install`.
8. **Prototype is in `/prototype`, not the root.** Always `cd prototype` first.
9. **`api/node_modules/` is untracked and should stay that way.** It's not in a .gitignore at the `api/` layer — don't `git add -A` without checking.

---

## Files Modified This Session

```
# Docs
PROTOTYPE_SPEC.md                                     # Navigation, Messages Page, Settings, new Account Settings section, file map, last-updated
CC_HANDOFF.md                                         # This file (overwritten)
docs/PRD_SETTINGS_v2.2.md → docs/PRD_SETTINGS_v2_3.md # Rename + content update (v2.3 adds Account Settings §8, corrects phone model)

# Prototype code
prototype/app/apps/[appId]/page.tsx                   # Shared 3-col grid with metrics; gap-6; messageList max-width removed; messages-section-header mt-2
prototype/app/apps/[appId]/settings/page.tsx          # H1 "Settings" → "App settings"
prototype/app/account/page.tsx                        # NEW — Login / Payment method / Danger zone + typed-DELETE confirm modal
prototype/components/dashboard-layout.tsx             # Icon-only Settings top-bar link; new workspace tagline row (messages page only)
prototype/components/top-nav.tsx                      # Avatar dropdown (Account settings + Sign out) replaces freestanding Sign out link
```

`api/node_modules/` is untracked and intentionally uncommitted.

---

## What's Next (suggested order)

1. **Wire `/account` to real data** — email comes from auth, card from Stripe, "Change" opens magic-link flow, "Manage billing →" deep-links to Stripe customer portal, "Delete account" calls a destructive API.
2. **Extract shared `APP_NAMES`** into `lib/app-names.ts` — now 4 duplicate copies (dashboard-layout, register, settings, account). Getting worse each session.
3. **Session-aware Back link on `/account`** — remember which app the user came from and route "Back to {appName}" accordingly.
4. **Wire Settings actions to real state** — notifications toggle → `projects.sms_notifications_enabled`; Cancel plan → Stripe subscription cancel-at-period-end; Regenerate live key → hash rotation; Edit EIN / Add EIN → open EIN verification flow in a modal.
5. **Registered "Add EIN" flow** — tapping Add should open the EIN verification flow and, on success, unlock the marketing upsell (same trigger the messages page already uses).
6. **Ask Claude panel backend** — UI done; streaming AI backend + route needed.
7. **Wire wizard data into setup instructions** — generate install command, API key, and prompt from sessionStorage business name + messages.
8. **Marketing messages for other verticals** — only Appointments has data.
9. **Wire signup to real magic-link backend** (D-59).
10. **Wire `/start/verify` phone OTP to Twilio Verify** (D-46).
11. **Wire EIN verification backend** (D-302, D-303).
12. **Error states design session** — walk through all interaction failures before locking in copy.
