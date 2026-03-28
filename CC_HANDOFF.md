# CC_HANDOFF.md — Session Handoff
**Date:** 2026-03-28 (D-239 alerts, marketing modal, D-245–D-264, Experience Principles v1.1)
**Branch:** main

---

## Commits This Session

```
65cd7a8  fix: marketing modal polish — pricing specifics, benefit framing, consent layout, pill selector for messages
9fc8416  feat: marketing messages modal with lifecycle states, replaces page route (D-245-D-254)
10332b3  feat: marketing messages info page with lifecycle states, update banner and Messages CTAs (D-245-D-254)
6e96960  fix: compliance empty state — line break between sentences
32e4112  fix: restore compliance empty state headings
fb66e35  fix: D-239 wizard alerts card — align with step content, fix vertical spacing
65b7c2d  fix: compliance empty state — single line copy, remove redundant heading
54d33cd  fix: D-239 wizard alerts card — progress line, remove Skip, update copy
79ef249  fix: D-239 wizard inline alerts enable card between steps 1 and 2
2321de9  feat: alerts on/off state switcher for Overview prototype testing
f94c810  feat: D-239 compliance alerts toggle surfaced on Overview — wizard, header, empty state
```

Plus one docs commit (this session close-out).

---

## What We Completed

### D-239 — Compliance Alerts Toggle on Overview
Three placements surfacing the SMS alerts toggle:
1. **Wizard inline card** — Between steps 1 and 2 after phone verification. Light purple card with bell icon, "Enable" button. Vertical progress line flows through the card continuously. Shows when `alertsEnabled` is false.
2. **Compliance header row** — Right-aligned on "Message compliance" heading. Green dot + "On" when enabled, amber dot + clickable "Off" when disabled. Visible in Default and Approved states.
3. **Compliance empty state** — Below shield icon. Alerts on: heading + two-line body with alerts confirmation. Alerts off: heading + single line + "Enable alerts" purple link.

**Alerts state switcher** added to layout (Overview tab only) for prototype testing: "Alerts on" / "Alerts off".

Session context updated with `alertsEnabled: boolean` (default `true`) and `hasEIN: boolean` (default `true`).

### Marketing Messages Modal (D-245–D-254)
Full-screen modal component replacing the page route `/apps/[appId]/marketing`:
- **Hero** gray band with headline, subhead, prominent "Add marketing" CTA
- **Pricing** clean typography: $29 one-time / +$10/mo 250 messages / $15 per 1,000 after
- **Message previews** with interactive style pills (Brand-first / Action-first / Context-first) and 3-column cards (Discount offer, Re-engagement, Review request) with personalized GlowStudio/Salon values
- **How it works** three numbered steps in horizontal row
- **Consent** bullet list at max-w-500px centered
- **Bottom CTA** repeat

Three lifecycle states via switcher: Info, In review (registration stepper replaces hero CTA), Active (centered confirmation).

Opened from: Overview banner "Learn more" and Messages tab marketing section CTA.

### Overview Banner Vocabulary Update (D-254)
"Want to send promotional messages?" changed to "Want to send marketing messages?". "Start marketing registration" changed to "Learn more". Link replaced with button opening marketing modal.

### Messages Tab Marketing Section Update (D-254)
Simplified from inline message cards to: heading + one-line copy + "Learn more" button opening marketing modal. Added `Link` import, then replaced with button for modal.

### Decisions Recorded (D-245–D-264)
20 new decisions covering marketing expansion architecture, pricing, consent infrastructure, vocabulary rules, deliverable strategy, and UX principles. All appended to DECISIONS.md with dates and affects lines.

### Experience Principles v1.1
New file `docs/V4_EXPERIENCE_PRINCIPLES_v1.1.md` created outside CC session with:
- Words We Use: "Marketing messages", "Your AI tool builds it", "We handle the rest"
- Words We Avoid: "Campaign" (customer-facing), "Promotional/promos", "Two files" (marketing)
- New section: The Unequivocal Claims Principle (D-263)
- Framing Shift table: 2 new rows (consent, marketing registration)
- Emotional States table: marketing expansion row

Note: The original `V4_-_RELAYKIT_EXPERIENCE_PRINCIPLES.md` still exists. The v1.1 file is untracked. CLAUDE.md references point to the original filename. Joel should decide whether to replace or keep both.

### BACKLOG.md Updated
7 Likely items added (UX simplicity audit, FAQ sections, "two files" removal, category landing vocab update, marketing pills on category landing, build spec testing, sandbox API). 3 Maybe items added. MIXED campaign type added to Rejected table.

### PROTOTYPE_SPEC.md Updated
- App Layout Shell: alerts switcher documented
- Overview non-approved: D-239 three placements documented
- Overview Approved: marketing banner copy/link, alerts empty state, marketing modal documented
- Messages tab: marketing section CTA updated

---

## In Progress / Partially Done

### Experience Principles File Rename
`V4_EXPERIENCE_PRINCIPLES_v1.1.md` exists as untracked file with D-254/D-257/D-263 updates. Original file still tracked. CLAUDE.md references point to original. Needs Joel decision on file strategy.

### Category Landing Vocabulary (D-254)
"Need marketing messages too?" section on category landing still uses "campaign" and "promotional" language. Backlogged for update.

### "Two Files" Copy Removal (D-257)
Home page hero, category landing, messages page hero, How it Works modal still reference "two files". Backlogged for update.

### Overview Compliance Attention Section (D-243)
Decision recorded but not yet built. Customer-facing ledger showing adjusted/blocked messages.

### How It Works Modal Pricing
Still needs $49/$150 bridge line audit.

---

## Gotchas for Next Session

1. **Delete `.next` before every dev server start.** Always: `rm -rf prototype/.next` then restart. Port 3001.

2. **DECISIONS.md is a two-file system.** Active decisions (D-84–D-264) in DECISIONS.md. Archived (D-01–D-83) in DECISIONS_ARCHIVE.md.

3. **Experience Principles has two files.** Original at `docs/V4_-_RELAYKIT_EXPERIENCE_PRINCIPLES.md` (tracked, CLAUDE.md references it). Updated v1.1 at `docs/V4_EXPERIENCE_PRINCIPLES_v1.1.md` (untracked). Resolve before writing new copy.

4. **Marketing modal is a component, not a page route.** `prototype/components/marketing-modal.tsx`. Opened via state in both `approved-dashboard.tsx` and `messages/page.tsx`. The page route `/apps/[appId]/marketing` was deleted.

5. **`alertsEnabled` defaults to `true`.** Switcher shows "Alerts on" by default. To test the wizard inline card, switch to "Alerts off" and complete step 1.

6. **`hasEIN` defaults to `true`.** Gates marketing UI visibility (D-247). Currently only used conceptually — marketing modal doesn't check it yet. The deleted page route had the gate; modal doesn't.

7. **Messages page has TWO render paths.** StepsLayout (default) and fallback (`?layout=default`). Both need changes when modifying messages page.

8. **Three-part pricing: $49 / $150 / $19/mo.** Marketing add-on: $29 one-time + $10/mo.

9. **Sign-in modal z-index is 100/101.** Marketing modal is z-50 (same as How it Works modal).

10. **Layout forces logged-in state.** App layout `useEffect` calls `setLoggedIn(true)` on mount.

11. **Uncommitted files from outside this session:** `.claude/settings.json`, `prototype/components/registration/review-confirm.tsx`, `prototype/images/` directory. These predate this session.

---

## Files Modified This Session

```
# D-239 Compliance alerts toggle
prototype/app/apps/[appId]/overview/page.tsx           # Wizard inline card, header indicator, empty state
prototype/app/apps/[appId]/overview/approved-dashboard.tsx  # Header indicator, empty state, marketing banner/modal
prototype/app/apps/[appId]/layout.tsx                   # Alerts state switcher
prototype/context/session-context.tsx                   # alertsEnabled, hasEIN added

# Marketing modal
prototype/components/marketing-modal.tsx                # NEW — full-screen marketing messages modal
prototype/app/apps/[appId]/marketing/page.tsx           # DELETED — replaced by modal
prototype/app/apps/[appId]/messages/page.tsx            # Marketing section CTA → modal, Link import added/removed

# Decisions & docs
DECISIONS.md                                            # D-245–D-264 appended (D-255–D-264 were pre-existing)
docs/V4_EXPERIENCE_PRINCIPLES_v1.1.md                   # UNTRACKED — created outside session
BACKLOG.md                                              # 10 new items, date updated
PROTOTYPE_SPEC.md                                       # D-239, marketing modal, alerts documented
CC_HANDOFF.md                                           # This file (overwritten)
```

---

## What's Next (suggested order)

1. **Experience Principles file resolution** — Decide on v1.0 vs v1.1, update CLAUDE.md references
2. **Category landing vocabulary audit (D-254)** — Remove "campaign"/"promotional" language
3. **"Two files" copy removal (D-257)** — Update home, category landing, messages hero, How it Works modal
4. **Overview compliance attention section (D-243)** — Customer-facing ledger with edit/dismiss actions
5. **How It Works modal pricing audit** — Verify $49/$150 bridge line in modal pricing cards
6. **UX simplicity audit (D-262)** — Fresh session, naive eyes, every page evaluated
7. **Build spec empirical testing (D-260)** — Write real build spec, test with AI tools
