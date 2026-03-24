# CC_HANDOFF.md — Session Handoff
**Date:** 2026-03-23 (Playbook summary, pricing redesign, copy/layout refinements across 4 pages)
**Branch:** main

---

## Commits This Session

```
4b2c3ed  docs: add playbook summary design spec
15ee010  fix: update timeline references — days not weeks across prototype
19a8dea  fix: app layout — full-width tab bar border, restructured containers
39b5c13  feat: app Messages page — playbook port, gray band, layout restructure
4a6840e  feat: Home page — logo farm, gray hero band, pricing card redesign
975634a  feat: public Messages page — playbook refinements, layout, pricing iterations
e94c27e  feat: Marketing category page — subhead, pricing context, What You Get card copy
0c3ebcb  feat: Home page — subhead copy, pricing context line, reassurance line
b334b79  feat: public Messages page — pricing context, copy updates, How it works modal, footer link
```

Previous session commits (already on main before this session):
```
8d2dd42  docs: D-211–D-214, PROTOTYPE_SPEC Settings rewrite, BACKLOG additions, CC_HANDOFF
7ec98f8  feat: add What was submitted subsection to Rejected registration state
c52fc4b  fix: remove Plan row from Registration, disable live key copy button when masked
78b2791  fix: add "additional" to billing includes copy
f431f31  fix: add Includes row to Approved billing section
```

---

## What We Completed

### Decisions (D-215–D-222)
- Sinch confirmed as carrier, timeline drops to days (D-215)
- Registration fee display: $199 headline with $49/$150 split in details (D-216)
- Playbook summary section on Messages pages (D-217)
- "How it works" full-page modal on public Messages page (D-218)
- Home page hero redesign: logo farm + gray band (D-219)
- Pricing cards renamed: Free + Go live (D-220)
- App layout full-width tab bar and gray playbook band (D-221)
- AI prompts replaced by playbook summary on app Messages page (D-222)

### Public Messages Page (StepsLayout)
1. **Playbook summary section** — "Your complete appointment SMS system" with horizontal flow visualization (hollow circles → arrows → filled end dot), vertical stepper on mobile. `PLAYBOOK_FLOWS` data keyed by category. `bg-bg-secondary` band between `bg-bg-tertiary` hero and white messages section.
2. **Hero restructured** — H1 + subhead grouped, desktop CTA right-aligned with "Free to build and test. No lock-in." below, mobile CTA full-width after logos. Pricing context under logos. "How it works" link (brand purple, Expand06 icon).
3. **How it works modal** — Full-page overlay with H1, What You Get cards, pricing section (gray band, Free + Go live cards), Why Registration Matters FAQ, Back to messages CTA.
4. **Messages section** — Subhead copy updated. Marketing pill (was standalone link). `max-w-[500px]` messages column. `1fr_376px` grid. `flex-wrap` pills.
5. **Footer link** — "Learn more about RelayKit →" before shared Footer.

### Home Page
1. **Hero gray band** (`bg-bg-tertiary`) with AI tool logo row (6 tools, white circle backgrounds)
2. **Subhead** → "Two files. Your AI coding tool. A working SMS feature."
3. **Pricing cards** — "Free" (was Sandbox) + "Go live" (was Live). $199 to register + $19/mo headline. Feature lines at `text-base`. Single "Start building free →" CTA. Per-card buttons removed.
4. **White backgrounds** on logo circles and Why RelayKit button
5. **Pricing context line** between How it works and Explore use cases
6. **Reassurance line** before footer

### Marketing Category Page
1. **Subhead** → "Your AI coding tool builds the integration. RelayKit handles the carriers."
2. **Pricing context line** between messages CTA and What You Get
3. **What You Get cards** — Rewritten: Messages that get approved / A build spec your AI tool reads / Registration you don't touch / Compliance that runs itself

### App Messages Page
1. **AI prompts section replaced** with PlaybookSummary component (same flow visualization)
2. **`controlsSlot` prop** — "AI tool setup | Download RelayKit" on own line between heading and flow
3. **Full-width gray band** (`bg-bg-secondary`, `py-10`) using viewport-width CSS trick
4. **Marketing pill**, `max-w-[500px]` messages column, `1fr_376px` grid

### App Layout
1. **Full-width tab bar border** — outer wrapper no longer constrains width
2. **No gap** between tab bar border and Messages tab gray band

### Timeline Updates
- All "2–3 weeks" / "10–15 business days" in prototype `.tsx` files → "a few days" / "days, not weeks" (6 instances across overview, settings, shared.tsx)

### Documentation
- **DECISIONS.md** — D-215 through D-222 (8 new decisions)
- **PROTOTYPE_SPEC.md** — Updated: Home page, Category Landing, Public Messages, App Messages, App Layout Shell
- **BACKLOG.md** — 4 new items: How it works modal V2, playbook per-category expansion, post-download playbook variant, two-tab marketing page (dropped)
- **Design spec** — `docs/superpowers/specs/2026-03-23-playbook-summary-design.md`

---

## In Progress / Partially Done

### Messages Tab — Approved State
Not yet differentiated. Still renders Default layout. Planned per D-159:
- Personalization fields read-only with registered values
- AI commands still available
- No "registered" badges on individual cards

### Messages Tab — Pre-download State
Not yet designed (D-162). The initial download happens on the public Messages page, not here.

### Playbook Flows — Other Categories
Only `appointments` has flow data in `PLAYBOOK_FLOWS`. Structure ready for verification, orders, support, etc. (Backlogged)

---

## Gotchas for Next Session

1. **Delete `.next` before every dev server start.** Always: `rm -rf prototype/.next` then restart. Port 3001.

2. **DECISIONS.md now has 222 decisions** (D-01 through D-222).

3. **Timeline references cleared in prototype** — Zero instances of "2–3 weeks" remain in `.tsx` files. CLAUDE.md platform constraints and internal docs still reference the old timeline (intentionally not updated this session).

4. **App layout restructured (D-221)** — Outer wrapper is full-width. App identity, tab bar content, and page content each have their own `mx-auto max-w-5xl px-6` container. Child pages can break out to full viewport width.

5. **Playbook gray band uses viewport trick** — `relative left-1/2 -ml-[50vw] w-screen` on the app Messages page. Works but may cause horizontal scrollbar issues if `overflow-x: hidden` is not set on a parent. Watch for this.

6. **`controlsSlot` prop on PlaybookSummary** — Only used on app Messages page. Public page version doesn't pass it. The prop is `React.ReactNode | undefined`.

7. **AiCommandsGrid still defined** in app Messages page but no longer rendered. Could be cleaned up. Retained in case it's needed elsewhere.

8. **How it works modal content is hardcoded** — What You Get cards, pricing cards, and FAQ are duplicated between the modal and their source pages. If pricing changes, update in both places.

9. **"Appointments" pill in layout.tsx is still hardcoded** — Needs to be dynamic for multi-category.

10. **Orphaned files still on disk** — `prototype/components/dashboard/` and `prototype/app/c/` are safe to delete.

11. **`expandedCardId` state exists in 3 places** — `AppMessagesPage`, `StepsLayout` (internal), and `PublicMessagesPage`. Each manages its own scope.

12. **`showPersonalize` state exists in 3 places** — same pattern as expandedCardId.

13. **Overview page `changes_requested` copy may still say "Changes requested"** — The D-202 rename (Extended Review) was applied to layout.tsx but Overview page content may need alignment.

14. **Settings alert phone Edit is a no-op** — Placeholder button.

15. **Live key copy button disabled state** — Uses `opacity-30 cursor-not-allowed disabled` on a plain button.

16. **"What was submitted" in Rejected state uses mock data** — Business name, EIN, address, use case are hardcoded.

---

## Files Modified This Session

```
prototype/app/sms/[category]/messages/page.tsx   # Major: playbook, hero, modal, layout, copy
prototype/app/page.tsx                           # Major: hero, logos, pricing cards
prototype/app/sms/[category]/page.tsx            # Copy: subhead, pricing, What You Get cards
prototype/app/apps/[appId]/messages/page.tsx     # Major: playbook port, gray band, layout
prototype/app/apps/[appId]/layout.tsx            # Layout: full-width tab bar, container restructure
prototype/app/apps/[appId]/overview/page.tsx     # Copy: timeline refs → days
prototype/app/apps/[appId]/settings/page.tsx     # Copy: timeline ref → days
prototype/components/dashboard/shared.tsx        # Copy: timeline ref removed
docs/superpowers/specs/2026-03-23-playbook-summary-design.md  # New: design spec
DECISIONS.md                                     # D-215–D-222 appended
PROTOTYPE_SPEC.md                                # Multiple sections updated
BACKLOG.md                                       # 4 new items
CC_HANDOFF.md                                    # This file
```

---

## What's Next (suggested order)

1. Differentiate Messages tab Approved state (read-only personalization per D-159)
2. Align Overview page "changes_requested" copy with D-202 ("Extended Review" language)
3. Add playbook flows for other categories (verification, orders, support)
4. Post-download playbook variant (expanded prompt, prerequisites, copy button)
5. Delete orphaned `/c/` routes and `components/dashboard/` files
6. Make "Appointments" pill dynamic in layout.tsx
7. Build /test usability instrument (D-200)
