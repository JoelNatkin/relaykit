# CC_HANDOFF.md — Session Handoff
**Date:** 2026-04-11/12 (monitor expansion, Testers card, Ask Claude panel, header redesign)
**Branch:** main (55 commits ahead of origin/main — NOT YET PUSHED, awaiting PM review)

---

## Commits This Session (32)

```
b368ac0  fix(prototype): mobile Claude overlay flush with nav, lock body scroll
49e9dad  fix(prototype): equal-width Claude panel and messages, overlay below 768px
9abbdc8  fix(prototype): remove hover/click from monitor label, increase icon gap
faa3c08  feat(prototype): icon + text label in title row for active card mode
6d75309  fix(prototype): Ask Claude panel top-aligns with message cards
921e030  fix(prototype): testers subtitle wording
b8ad8be  refactor(prototype): Ask Claude input as textarea with toolbar row
740f727  fix(prototype): Ask Claude panel viewport-aware height with always-visible input
d7e05b1  feat(prototype): full-height Ask Claude panel with pinned input
adbe364  fix(prototype): shorter Ask Claude welcome text
6a1d956  fix(prototype): Ask Claude panel — remove context card, complete border, remove header icon
3dfb50b  feat(prototype): Ask Claude panel with context summary and message focus
ff6d3fa  fix(prototype): testers subtitle — sign up language
3223092  refactor(prototype): simplify header status to test mode / live
2668f64  fix(prototype): shorter Testers card subtitle
b898226  fix(prototype): rename test phones to Testers, send test to quick send
fe81d85  fix(prototype): right-align header row controls and Ask Claude button
99dfa0d  refactor(prototype): move setup instructions and settings to header row
686c41d  feat(prototype): messages section header with Ask Claude button
224db2b  feat(prototype): test phones — full numbers, kebab menu with edit/delete, button alignment
d23202e  feat(prototype): test phones card in right rail with inline invite flow
342609f  fix(prototype): swap send test and dropdown order, plain dropdown text
4685ac9  fix(prototype): monitor button row — left-aligned actions, right-aligned close
4f2319c  feat(prototype): send test dropdown + ask claude in monitor expansion, remove close button
7f3d6ed  fix(prototype): right rail width matches metrics column, activity spacing, icon gap
1cb3962  fix(prototype): remove divider above recent activity, add 16px spacing
bb65378  fix(prototype): monitor card spacing, max-width 500px, primary Close button
b86c5c6  fix(prototype): monitor expansion layout — divider, buttons, icon sizing
e87cb28  fix(prototype): monitor expansion shows message text, icon order/size, dividers, tooltip behavior
29838ce  feat(prototype): add monitor/test expansion mode to message cards
a593d36  fix(prototype): set message card column to 680px max-width
26dd8d4  refactor(prototype): remove floating send icon and set 40px message-to-rail gap
```

(Previous session ended at `1346f3a`. 23 commits from that session remain unpushed too — 55 total.)

---

## What Was Completed

### Monitor/test expansion on message cards (D-341)
- New expansion mode on CatalogCard alongside the existing edit mode. Activity icon (17px) + pencil icon in the title row, with hover-delay tooltips (300ms via setTimeout refs, cleared on click to prevent stuck state).
- **Default state:** both icons visible with `gap-1` (12px visual), no text labels.
- **Monitor expanded:** Activity icon + "Test & debug" label (non-interactive). Read-only message text stays visible. Below: "RECENT ACTIVITY" section with delivery status list (divide-y dividers), then footer row with "Ask Claude" (wired to Ask Claude panel) + "Quick send" (1.5s stub) + recipient dropdown (synced with Testers card) on left, "Close" primary button on right.
- **Edit expanded:** pencil icon + "Edit" label (non-interactive). Activity hidden. Edit controls unchanged from prior session.
- Mock data: first 3 messages delivered, 4th failed with carrier error, rest null.
- Card root has `max-w-[500px]` when `monitorMode=true` (dashboard cards only).
- Status line (lastSent) below message text when monitorMode + data present.

### Testers card in right rail (D-342)
- New `prototype/components/test-phones-card.tsx` component.
- Appears in ALL post-onboarding states, below any state-specific right rail card. Always visible.
- Heading: "Testers". Subtitle: "Up to 5 people can sign up and receive messages from your app in test mode."
- Each row: name (bold) + verified/invited status dot + full phone number on second line + kebab menu (DotsVertical) with Edit and Delete. Self entry (Joel) has Edit only. Hover-X removed in favor of kebab menu.
- Edit: inline form (pre-filled name + phone), Save/Cancel right-aligned.
- Invite: "+ Invite someone" link → inline form (name + phone), 1.5s "Sending…" stub, collapses on success. Hidden at 5 entries.
- State lives in messages page (`testPhones`), with `handleRemoveTestPhone`, `handleInviteTestPhone`, `handleEditTestPhone` handlers.
- Names synced to CatalogCard via `testRecipients` prop → monitor expansion's Quick send dropdown. `useEffect` resets `selectedRecipient` if removed from list.

### Ask Claude panel (D-343)
- New `prototype/components/ask-claude-panel.tsx` component.
- Opens from "Ask Claude" button in messages section header (unfocused) or from monitor expansion's "Ask Claude" footer link (focused on message name, closes monitor).
- **Desktop (≥768px):** inline grid cell in a 50/50 two-column grid (`grid-cols-2 gap-10`). Sticky, top-aligned with first message card (measured via `messageTopRef` + `getBoundingClientRect`). Height `calc(100vh - topOffset - 2.5rem)`. Rounded-xl border, shadow-sm.
- **Mobile (<768px):** fixed full-width overlay (`top-14` flush with nav bottom, `bottom-0`). Body scroll locked via `document.body.style.overflow = "hidden"` (gated on `matchMedia < 767px`).
- Content: "Ask Claude" h2 + XClose → flex-1 scroll body (optional "Focused on: [name]" + welcome text) → pinned footer with chat composer (3-row textarea + Plus attach + Stars02 send toolbar). All non-functional stubs.
- When open: right rail + metrics cards (Registered) hidden. When closed: layout restored.

### Header row redesign
- **Status indicator simplified (D-344):** yellow "Test mode" for all pre-live states, green "Live" for Registered. Onboarding = null.
- **Setup instructions toggle + Settings link moved** to DashboardLayout header row (messages page only, gated on `pathname.endsWith("/messages")`). State shared via `SetupToggleContext` (new file `prototype/context/setup-toggle-context.tsx`).
- **Messages section header:** "Messages" h2 on left + "Ask Claude" button (Stars02 icon + text) on right. Appears in all post-onboarding states.

### Card layout cleanup
- Floating send icon removed from CatalogCard (hideSend, sendIcon, onSend props deleted, Phone01 import dropped).
- Two-column layout uses `grid grid-cols-1 lg:grid-cols-3 gap-4` matching the metrics grid for right rail width alignment.
- `messageList` max-width raised from 540px to 680px.

### Documentation
- **D-341 through D-344** added to `DECISIONS.md`.
- **PROTOTYPE_SPEC.md** updated: CatalogCard default/edit/monitor states rewritten, Dashboard mode layout section rewritten with Testers card, Ask Claude panel, header row, right rail structure.

---

## Quality Checks Passed

- `tsc --noEmit` — clean (prototype)
- `next build` — clean (run multiple times during session)
- No ESLint config in prototype — tsc and build are the quality gates (unchanged baseline)

---

## In Progress / Partially Done (Carried Forward)

### All backend stubs from previous sessions still apply
- Signup backend is stubbed (D-59 pending)
- EIN verification backend is stubbed (D-302/D-303 pending)
- Phone OTP is stubbed (D-46 pending)
- Get-started content is hardcoded
- Marketing messages hardcoded for Appointments vertical only

### New this session
- Ask Claude panel is a non-functional stub — typing in the textarea and pressing Enter does nothing. The Plus (attach) and Stars02 (send) toolbar buttons are stubbed with preventDefault.
- Quick send in monitor expansion is a visual stub — 1.5s "Sending…" + fade-out confirmation, but doesn't actually send a message or add an activity entry.
- Testers card's invite flow is a stub — 1.5s "Sending…" but no real OTP/verification.
- Monitor activity list uses mock data (module-level MOCK_LAST_SENT/MOCK_ACTIVITY keyed by message index).
- Registered state metrics remain mock data.
- Marketing-only registration tracker state transitions are prototype dropdowns.

---

## Gotchas for Next Session

1. **Delete `.next` AND `node_modules` before every prototype dev server start if you see @untitledui vendor chunk errors.** The `.next` cache was persistently corrupted this session — `rm -rf .next` alone sometimes didn't fix it; `rm -rf node_modules && npm install` was needed. API server (port 3002) has no `.next`.
2. **The prototype is in `/prototype`, not the root.** Running `next dev` from root starts the production app. Always `cd prototype` first.
3. **No ESLint config** in prototype — tsc + `next build` are the quality gates.
4. **`testPhones` state is in the messages page**, not a global store. Adding/removing testers via the Testers card + reading names in the CatalogCard monitor dropdown both go through props threaded from the same `useState` array.
5. **`messageTopRef`** is a zero-height div placed right above `{messageList}` in both Registered and generic layouts. It's read by `getBoundingClientRect().top` when the Ask Claude panel opens to set the desktop panel's `top` offset. Don't move it.
6. **SetupToggle state** is now in a React context (`SetupToggleContext`) provided by DashboardLayout. The messages page reads `visible` from the context via `useSetupToggleState()`. The toggle itself renders in DashboardLayout's header row (messages page only).
7. **Ask Claude panel renders TWO wrappers** (mobile + desktop) sharing the same JSX `content` fragment. Both are always mounted; CSS `hidden`/`md:hidden` toggles visibility. The mobile wrapper uses `fixed` positioning; the desktop uses `sticky` inside the grid.
8. **CatalogCard has three expansion states:** edit (controlled by `editingMessageId`), monitor (controlled by `monitoringMessageId`), and neither (collapsed). `openAskClaude()` clears both. The Activity icon's label ("Test & debug") is a non-interactive `<span>`, NOT a button — clicking it does nothing. The monitor's Close button is the only way to exit monitor mode.
9. **Body scroll lock** on the mobile Ask Claude overlay (`document.body.style.overflow = "hidden"`) is only applied when `matchMedia("(max-width: 767px)")` matches at mount time. If the user resizes the browser while the panel is open, the lock persists. Acceptable for prototype.
10. **Variant IDs are stable** (`standard`, `action-first`, `context-first`) even though labels are Standard/Friendly/Brief. Don't rename the IDs.
11. **Never push this branch without PM review.** 55 unpushed commits as of close-out.
12. **Migrations 003 and 004 may not be applied to live DB** (carried forward).
13. **Rate limiter is in-memory** — resets on server restart (carried forward).
14. **`testSentFade` keyframe** in `globals.css` powers the Quick send confirmation fade: 3s total, 10% fade-in, 80% hold, 100% fade-out. Paired with a 3s setTimeout that unmounts the element.

---

## Files Modified This Session

```
# Decisions, specs, docs
DECISIONS.md                                             # MODIFIED — D-341 through D-344 added
PROTOTYPE_SPEC.md                                        # MODIFIED — CatalogCard states rewritten, Dashboard layout rewritten, Ask Claude panel + Testers card sections added
CC_HANDOFF.md                                            # This file (overwritten)

# New files
prototype/components/ask-claude-panel.tsx                # NEW — Ask Claude panel component
prototype/components/test-phones-card.tsx                # NEW — Testers card component
prototype/context/setup-toggle-context.tsx               # NEW — SetupToggle React context (provider + hook)

# Page changes
prototype/app/apps/[appId]/messages/page.tsx             # MAJOR — monitor expansion, Testers card, Ask Claude panel, section header, layout swap (grid↔flex), test-phone state, context wiring
prototype/app/globals.css                                # MODIFIED — testSentFade keyframe added

# Component changes
prototype/components/catalog/catalog-card.tsx            # MAJOR — monitor expansion mode, Activity icon, status line, mode labels, onAskClaude/testRecipients props, send icon removal
prototype/components/dashboard-layout.tsx                # MODIFIED — StatusIndicator simplified, SetupToggle + Settings moved to header, SetupToggleProvider, usePathname
```

---

## What's Next (suggested order)

1. **Wire Ask Claude panel to real AI** — connect the chat composer to Claude API (Anthropic SDK). The panel already has the UI; needs a backend route + streaming response display.
2. **Extended Review and Rejected card redesign** — these still use the old "Registration status" / pill pattern. Apply the per-type tracker pattern from D-339 for consistency.
3. **Wire wizard data into setup instructions** — generate install command, API key, and prompt from sessionStorage business name + messages instead of hardcoded Club Woman content.
4. **Marketing messages for other verticals** — currently only Appointments has marketing message data. Add sets for Verification, Orders, Support, etc.
5. **Test all right rail state matrix permutations** — use the matrix in WORKSPACE_DESIGN_SPEC.md as a QA checklist before porting to production.
6. **Wire signup to real magic-link backend** (D-59).
7. **Wire `/start/verify` phone OTP to Twilio Verify** (D-46).
8. **Wire EIN verification backend** (D-302, D-303).
9. **Extract `OtpInput`** to shared component — currently inlined in `/signup/verify`, `/start/verify`, and sign-in modal.
10. **Registration flow pages** — `/apps/[appId]/register` and `/register/review` need the new single-page workspace context (no tab bar, back-to-messages pattern).
11. **Error states design session** — walk through all interaction failures before locking in copy.
