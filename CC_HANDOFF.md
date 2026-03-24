# CC_HANDOFF.md — Session Handoff
**Date:** 2026-03-24 (DECISIONS.md split into two-file system, CLAUDE.md protocol update)
**Branch:** main

---

## Commits This Session

```
59810a2  docs: update CLAUDE.md DECISIONS protocol for two-file system
1951957  docs: split DECISIONS.md — archive D-01–D-83, add compact index
```

Previous session commits (already on main before this session):
```
5334cf1  docs: D-215–D-222, PROTOTYPE_SPEC updates, BACKLOG additions, CC_HANDOFF rewrite
4b2c3ed  docs: add playbook summary design spec
15ee010  fix: update timeline references — days not weeks across prototype
19a8dea  fix: app layout — full-width tab bar border, restructured containers
39b5c13  feat: app Messages page — playbook port, gray band, layout restructure
```

---

## What We Completed

### DECISIONS.md Two-File Split
- **DECISIONS_ARCHIVE.md** created (392 lines) — full text of D-01 through D-83 with all original section headers preserved
- **DECISIONS.md** reduced from 949 → 671 lines — compact one-line index of D-01–D-83 at the top, full text of D-84–D-222 below
- Header blockquote updated to reference the two-file system
- Archive file has its own header explaining that CC does NOT read it at session start

### CLAUDE.md Protocol Update
- Replaced the old "DECISIONS.md Protocol" section with new "DECISIONS Protocol" section
- Documents the two-file system, session start procedure, before-implementing checklist, conflict handling, new decision format, and session close-out steps
- Session close-out protocol now formally documented in CLAUDE.md

### No New Decisions
This was a docs-only session. No product, architecture, or UX decisions were made. Decision count remains at 222 (D-01 through D-222).

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

2. **DECISIONS.md is now a two-file system.** Active decisions (D-84–D-222) are in DECISIONS.md. Archived decisions (D-01–D-83) are in DECISIONS_ARCHIVE.md. CC reads only DECISIONS.md at session start. Archive is loaded on demand when Joel says "Check D-[number] in DECISIONS_ARCHIVE.md."

3. **`prototype/app/apps/[appId]/messages/page.tsx` has uncommitted changes** from before this session. These are pre-existing modifications — not from this session's work.

4. **Timeline references cleared in prototype** — Zero instances of "2–3 weeks" remain in `.tsx` files. CLAUDE.md platform constraints and internal docs still reference the old timeline (intentionally not updated).

5. **App layout restructured (D-221)** — Outer wrapper is full-width. App identity, tab bar content, and page content each have their own `mx-auto max-w-5xl px-6` container. Child pages can break out to full viewport width.

6. **Playbook gray band uses viewport trick** — `relative left-1/2 -ml-[50vw] w-screen` on the app Messages page. May cause horizontal scrollbar if `overflow-x: hidden` not set on parent.

7. **`controlsSlot` prop on PlaybookSummary** — Only used on app Messages page. Public page version doesn't pass it.

8. **AiCommandsGrid still defined** in app Messages page but no longer rendered. Could be cleaned up.

9. **How it works modal content is hardcoded** — What You Get cards, pricing cards, and FAQ are duplicated between modal and source pages.

10. **"Appointments" pill in layout.tsx is still hardcoded** — Needs to be dynamic for multi-category.

11. **Orphaned files still on disk** — `prototype/components/dashboard/` and `prototype/app/c/` are safe to delete.

12. **Overview page `changes_requested` copy may still say "Changes requested"** — D-202 rename (Extended Review) may need alignment.

13. **Settings alert phone Edit is a no-op** — Placeholder button.

14. **"What was submitted" in Rejected state uses mock data** — Business name, EIN, address, use case are hardcoded.

---

## Files Modified This Session

```
DECISIONS.md            # Restructured: header updated, D-01–D-83 replaced with compact index
DECISIONS_ARCHIVE.md    # New: full text of D-01–D-83
CLAUDE.md               # DECISIONS protocol section rewritten for two-file system
CC_HANDOFF.md           # This file (overwritten)
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
