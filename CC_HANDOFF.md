# CC_HANDOFF.md — Session Handoff
**Date:** 2026-04-13/14 (Extended Review + Rejected redesign, 860px breakpoint, card polish, messages promoted to /apps/[appId] root)
**Branch:** main (14 commits ahead of origin/main — NOT YET PUSHED, awaiting PM review)

---

## Commits This Session (13)

```
71827cc  fix(prototype): fix register page back link to workspace root
094a0a7  refactor(prototype): promote messages page to /apps/[appId] root route
0ac4a5e  fix(prototype): restore Ask Claude panel desktop layout after Start Building card move
de47356  feat(prototype): wire New project button to onboarding flow
9bea989  fix(prototype): Registered state — Start building inside left column under Messages header
e7eaa58  fix(prototype): card width and styling polish — Testers border, Start building + messages cards 540px cap, setup move, toggle thumb padding
3c73003  fix(prototype): simplify Usage card — remove remaining count, align plan line with trend text
ca1aa5a  fix(prototype): remove grey background from Testers card
02e229a  fix(prototype): metrics grid 3-col at 860px breakpoint
f91d1cb  fix(prototype): lower metrics grid collapse breakpoint to 860px
4e30863  fix(prototype): warmer Rejected card copy with specific reason
be3b7e9  refactor(prototype): redesign Extended Review and Rejected cards to per-type tracker layout
d7e1411  docs(backlog): add open-source SMS compliance linter
```

(Previous session close-out commit was `0661de3`, pushed to origin after. This session's commits are all since then and are unpushed.)

---

## What Was Completed

### Route promotion — messages page at `/apps/[appId]` root (D-345)
- Moved `prototype/app/apps/[appId]/messages/page.tsx` → `prototype/app/apps/[appId]/page.tsx`. The root of the app is now the workspace.
- Replaced `/messages/page.tsx` with a server-side `redirect(/apps/${appId})` for backward-compat.
- Updated every internal navigation: AppLayout's 6 `router.replace` calls, Your Apps card link (also dropped a pass-through to /overview → goes direct), auth post-download push, wizard Continue → workspace, get-started "View on dashboard", Settings back link, wizard-layout backHref for /ready, start/verify continueHref, top-nav dev state switcher + `isAppRoute` regex (now `^\/apps\/[^/]+(\/(ready|signup(\/verify)?|get-started))?$`), proto-nav-helper dev nav items, Register page back link.
- DashboardLayout's `isMessagesPage` check: was `pathname.endsWith("/messages")` → now `pathname === /apps/${appId}` (exact match so /settings doesn't inherit the header setup toggle + Settings link).
- Register page back link label: was `Back to Overview` → now the app name (e.g., `GlowStudio`) via an inline `APP_NAMES` map mirroring DashboardLayout's pattern.

### Extended Review + Rejected right rail redesign (extends D-339)
- Extended Review now uses the same per-type tracker card as Pending. Implemented by expanding the existing `isPending` branch guard to `(isPending || isChangesRequested)` so both states share the tracker structure + marketing upsell take-over flow. Added a conditional explanatory line below the tracker rows (gated on `isChangesRequested`): "This is taking longer than usual. We'll email you at jen@glowstudio.com when there's an update."
- Rejected rewritten from scratch: "Registration status" heading (no info tooltip), tracker rows with red "Not approved" pills (`bg-bg-error-secondary text-text-error-primary`), reason line "The business name on file didn't match your EIN records.", warmer support line "We know this is frustrating. Reply to your confirmation email or reach out at support@relaykit.ai and we'll sort it out." Removed the old bulk "Not approved" pill, "$49 refunded" line, "What happened" subheading, and "We're looking into what went wrong" paragraph.

### Responsive breakpoint consolidation at 860px
- Metrics grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` → `grid-cols-1 min-[860px]:grid-cols-3` (skips the 2-col intermediate step).
- Card/rail grid (both Registered and generic layouts): `lg:grid-cols-3` → `min-[860px]:grid-cols-3`. Paired modifiers (`col-span-2`, `order-last`, `sticky`, `top-20`) also updated to `min-[860px]:` so the layout doesn't break between 860–1024px.
- Start building card: `min-[860px]:max-w-[540px]` on the inner panel.
- Message cards: `messageList` wrapper + per-card `monitorMode` cap both set to `min-[860px]:max-w-[540px]` (replacing prior 680px / 500px caps).

### Card styling polish
- Testers card: `rounded-xl border border-border-secondary p-6` (matches message card stroke + radius), grey background removed so the grey treatment is reserved for state-specific cards above.
- Metrics Usage & billing: removed "153 messages remaining this period" line; "Plan: $19/mo · 500 included" restyled from `mt-2 text-xs text-text-tertiary` to `mt-3 text-sm text-text-secondary` (same size/position as the trend lines, neutral color).
- Metrics Delivery + Recipients: stat-detail lines ("1,812 delivered · 22 failed · 8 pending", "12 opt-outs · 38 inbound replies") removed.
- SetupToggle thumb: `translate-x-[18px]` → `translate-x-[16px]` so the enabled state has 2px right padding matching the 2px left (`ml-0.5`) when disabled.

### Start building card placement
- Moved from above the metrics grid (Registered) or above `messageList` (generic) into a consistent slot: inside the left column, above the message cards, in both Registered and generic layouts.
- Card 3 helper text extended: "Paste this prompt into your AI tool to start building. Once your app is sending, use the cards below to test delivery and Ask Claude to debug issues."

### Ask Claude panel top-alignment fix
- Root cause: after moving SetupInstructions inside the left column, the `messageTopRef` sat BELOW it. When Start building was toggled on, `getBoundingClientRect().top` returned a big Y value, making `topOffset` large and collapsing the panel to a thin nub.
- Fix: moved the ref ABOVE SetupInstructions in both layouts so it measures the grid row top, not the position after the setup card.

### New project button
- Your Apps `+ New project` button swapped from `onClick={alert}` to `<Link href="/start">` (wizard entry).

### Docs
- **BACKLOG.md** — added new top-level section "Open-Source SMS Compliance Linter" (Core deterministic validators + AI layer + structured ruleset + distribution + upgrade path + post-launch timing).

---

## Quality Checks Passed

- `tsc --noEmit` — clean (prototype)
- `next build` — clean (run multiple times during session, including after the route promotion)
- No ESLint config in prototype — tsc and build are the quality gates (unchanged baseline)

---

## In Progress / Partially Done (Carried Forward)

### All backend stubs from previous sessions still apply
- Signup backend stubbed (D-59 pending)
- EIN verification backend stubbed (D-302/D-303)
- Phone OTP stubbed (D-46)
- Get-started content hardcoded
- Marketing messages hardcoded for Appointments vertical only
- Ask Claude panel chat composer is a non-functional stub
- Monitor expansion Quick send is visual-only
- Testers invite flow stubbed (1.5s "Sending…" but no real OTP)
- Registered state metrics are mock data
- Marketing-only registration tracker transitions are prototype dropdowns

### New this session
- `/apps/[appId]/messages` is now only a redirect — any new app-scoped pages should be subroutes of `/apps/[appId]/`, the workspace itself stays at root. This constrains future route design.
- Extended Review now reuses Pending's state variables (`upsellEinExpanded`, `upsellConfirmStep`, `upsellConfirmed`). If we later want different upsell behavior in Extended Review, we'll need to introduce separate state.

---

## Gotchas for Next Session

1. **`.next` + `node_modules` nuke is the escalation** for the persistent @untitledui vendor chunk error. Straight `.next` wipes sometimes aren't enough — if you see it, `rm -rf .next node_modules && npm install`.
2. **The prototype is in `/prototype`, not the root.** Always `cd prototype` first.
3. **No ESLint config** in prototype — tsc + `next build` are the quality gates.
4. **The workspace route is `/apps/[appId]` (D-345).** `/apps/[appId]/messages` still exists as a server redirect to the root. All internal links must point to the root; any new link to `/messages` is a regression.
5. **`isMessagesPage` uses exact equality** (`pathname === /apps/${appId}`), not `endsWith`. `/settings` and other subroutes should NOT match.
6. **`messageTopRef` is the FIRST child of the left column** in both layouts. Above `<SetupInstructions>`. If you move it below Setup, the Ask Claude panel's height calc breaks when the Start building card is toggled on — the topOffset balloons and the panel collapses to a thin strip.
7. **Extended Review shares Pending's tracker JSX** via the `(isPending || isChangesRequested)` outer guard. The only Extended-Review-specific content is a conditional `<p>` with the "taking longer than usual" email note. If you need divergent logic, split the branches again.
8. **860px is the responsive threshold** for both the metrics grid and the card/rail grid. Every paired modifier (`col-span-2`, `order-last`, `sticky`, `top-20`) uses `min-[860px]:`. If you change the breakpoint, update all 5 spots together or the layout breaks between states.
9. **testPhones state is in the workspace page**, not a global store. It gets threaded to CatalogCard via `testRecipients` and to TestPhonesCard directly.
10. **Ask Claude panel renders TWO wrappers** (mobile fixed overlay + desktop inline) sharing the same `content` fragment. Both mount; CSS `hidden` / `md:hidden` toggles visibility.
11. **CatalogCard has three expansion states:** edit, monitor, collapsed. They're mutually exclusive. The Activity icon label ("Test & debug") is a non-interactive `<span>`; only the monitor footer's Close button exits monitor mode.
12. **Body scroll lock** on the mobile Ask Claude overlay (`document.body.style.overflow = "hidden"`) is only applied when `matchMedia("(max-width: 767px)")` matches at mount. Viewport resize while open keeps the lock.
13. **Variant IDs are stable** (`standard`, `action-first`, `context-first`) even though labels are Standard/Friendly/Brief.
14. **Never push this branch without PM review.** 14 unpushed commits as of close-out.
15. **Register page uses its own inline `APP_NAMES` map** mirroring DashboardLayout's. If we add more apps beyond GlowStudio, factor this into a shared helper to avoid drift.

---

## Files Modified This Session

```
# Decisions, specs, docs
DECISIONS.md                                             # MODIFIED — D-345 added (workspace at /apps/[appId] root)
PROTOTYPE_SPEC.md                                        # MODIFIED — Messages page header, dashboard layout + breakpoints, Testers styling, Rejected copy, CatalogCard max-width, top-nav regex
BACKLOG.md                                               # MODIFIED — Open-Source SMS Compliance Linter section added
CC_HANDOFF.md                                            # This file (overwritten)

# Route promotion (file move)
prototype/app/apps/[appId]/page.tsx                      # WAS a redirect stub, NOW the workspace page (moved from /messages/page.tsx)
prototype/app/apps/[appId]/messages/page.tsx             # WAS the workspace page, NOW a redirect to /apps/[appId]

# Page changes
prototype/app/apps/page.tsx                              # MODIFIED — New project Link + card href to /apps/${app.id}
prototype/app/apps/[appId]/layout.tsx                    # MODIFIED — 6 router.replace targets (/messages → root)
prototype/app/apps/[appId]/get-started/page.tsx          # MODIFIED — handleTransition target
prototype/app/apps/[appId]/settings/page.tsx             # MODIFIED — back link href
prototype/app/apps/[appId]/register/page.tsx             # MODIFIED — back link href + label (Back to Overview → app name)
prototype/app/auth/page.tsx                              # MODIFIED — post-download push to /apps/glowstudio
prototype/app/start/verify/page.tsx                      # MODIFIED — continueHref

# Component changes
prototype/components/dashboard-layout.tsx                # MODIFIED — isMessagesPage check switched to exact equality
prototype/components/top-nav.tsx                         # MODIFIED — isAppRoute regex + dev state switcher option value
prototype/components/wizard-layout.tsx                   # MODIFIED — backHref for /ready
prototype/components/proto-nav-helper.tsx                # MODIFIED — 4 Messages nav item hrefs
prototype/components/setup-instructions.tsx              # MODIFIED — max-w-[540px] cap, toggle thumb padding, card 3 helper text
prototype/components/test-phones-card.tsx                # MODIFIED — rounded-xl border, grey bg removed
prototype/components/catalog/catalog-card.tsx            # MODIFIED — per-card max-w cap changed to min-[860px]:max-w-[540px]
```

---

## What's Next (suggested order)

1. **Wire Ask Claude panel to real AI** — connect the chat composer to the Anthropic SDK. UI is done; needs backend route + streaming response display.
2. **Wire wizard data into setup instructions** — generate install command, API key, and prompt from sessionStorage business name + messages instead of hardcoded Club Woman content.
3. **Marketing messages for other verticals** — only Appointments has marketing message data. Add sets for Verification, Orders, Support, etc.
4. **Test all right rail state matrix permutations** — use the matrix in WORKSPACE_DESIGN_SPEC.md as a QA checklist before porting to production.
5. **Wire signup to real magic-link backend** (D-59).
6. **Wire `/start/verify` phone OTP to Twilio Verify** (D-46).
7. **Wire EIN verification backend** (D-302, D-303).
8. **Extract `OtpInput`** to shared component — currently inlined in `/signup/verify`, `/start/verify`, and sign-in modal.
9. **Registration flow pages** — `/apps/[appId]/register` and `/register/review` need the new single-page workspace context (no tab bar, back-to-workspace pattern — already updated the back link, but double-check the review screen).
10. **Error states design session** — walk through all interaction failures before locking in copy.
11. **Extract shared `APP_NAMES` map** — currently duplicated in dashboard-layout.tsx and register/page.tsx. Will get worse when beta launches with multiple apps.
