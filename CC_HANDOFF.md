# CC_HANDOFF.md — Session Handoff
**Date:** 2026-04-10 (marketing upsell in Pending/Registered, registration status tracker card, per-type badges)
**Branch:** main (23 commits ahead of origin/main — NOT YET PUSHED, awaiting PM review)

---

## Commits This Session (23)

```
9fbf007  docs: record D-338 through D-340 and update PROTOTYPE_SPEC for new right rail patterns
cffa34c  docs: add right rail state matrix to WORKSPACE_DESIGN_SPEC.md
5ac299d  fix(prototype): show marketing in-review row after upsell confirmation in Pending state
7d7ce57  feat(prototype): try different EIN link on both verification surfaces
b317045  refactor(prototype): registration status dropdown triggers state transitions to Registered
e746b76  fix(prototype): vertically center badges with name text on status rows
d5634a1  Revert "refactor(prototype): remove registration status dropdown from Pending state"
1017761  refactor(prototype): remove registration status dropdown from Pending state
1679524  feat(prototype): marketing-only registration status card in Registered state
f953b39  fix(prototype): wire EIN card swap on Registered state marketing upsell
c48a445  feat(prototype): marketing upsell card in Registered state
6de83b9  fix(prototype): registration status rows — date on second line, remove dot separator
a37baca  fix(prototype): consistent badge styles and confirmation copy
ef40b79  fix(prototype): registration status card polish — bold names, badge alignment, close behavior, filled badges
8e2b077  feat(prototype): registration status tracker card with per-type badges
5d3efb0  fix(prototype): right-align confirmation buttons with spacing
bf298f2  fix(prototype): focused confirmation view, headline, button order
e1c8ab4  fix(prototype): consolidate registration fee copy on upsell confirmation
9c6ab1f  fix(prototype): remove "Once approved" from marketing radio helper text
9aefc9f  fix(prototype): upsell confirmation cancel button and copy update
7add048  fix(prototype): simplify upsell card to bold pricing only
7f9e25a  fix(prototype): streamline marketing upsell card copy and layout
b947eb4  fix(prototype): remove marketing checkbox, fix upsell card spacing and pricing copy
```

(b947eb4 is the first commit of the session — bundled the initial "Marketing upsell card in Pending state" build with the immediate polish fixes. It was pushed to origin mid-session; the 21 commits after it are unpushed.)

---

## What Was Completed

### Marketing upsell card — Pending state (D-338)
- New upsell card in Pending state right rail, below the registration status tracker, separated by a divider (`border-t border-border-secondary pt-4`).
- **Scenario 1 (No EIN, no marketing):** "Add marketing messages" heading, benefit copy, "$29/mo instead of $19/mo." bold pricing, "Add your EIN →" CTA. Reuses `EinInlineVerify` card swap (entire card takes over). On save → pricing confirmation step.
- **Scenario 2 (With EIN, no marketing):** Same card, "Add marketing messages →" CTA. Click goes directly to pricing confirmation.
- **Scenario 3 (Registered with marketing at signup):** No upsell. Marketing messages already in list (D-336).
- **Pricing confirmation step:** "Confirm marketing messages" heading, "Your plan updates from $19/mo to $29/mo. Registration typically takes a few days." body, "Marketing messages share your 500 included messages." detail. Cancel (tertiary left) + Confirm (primary right, `justify-end gap-5`).
- After Confirm in Pending: upsell section + divider disappear, Marketing row added to registration status tracker, marketing messages appear in list.

### Registration status tracker card (D-339)
- Replaces old "Registration submitted" card with a per-message-type status tracker.
- **Heading:** "Registration status" with `InfoCircle` tooltip ("Registration usually takes 2–3 days per message type.")
- **Per-type rows:** Bold type name on top (`text-sm font-semibold text-text-primary`), "Submitted 3/17/2026" below (`text-xs text-text-tertiary mt-0.5`), status badge right-aligned with `mt-1` for vertical centering with name.
- **Badge styles:** "In review" = `bg-bg-brand-secondary text-text-brand-secondary` (matches Marketing catalog badge). "Registered" = `bg-bg-success-secondary text-text-success-primary`.
- **Pending state:** Always shows all rows as "In review" — no dropdown, no "Registered" variants. Appointments row always. Marketing row only when marketing was added (either at signup or via upsell).
- **Registered state completion:** When in the marketing-only tracker, the "Registered" dropdown option changes the heading to "Your messages are live!" (no tooltip icon), flips the badge to green, and adds a right-aligned primary Close button that permanently dismisses the card.

### Marketing upsell card — Registered state (D-338)
- Registered state converted from single-column to two-column layout (metrics at top, then message list + right rail).
- Right rail shows: (1) Marketing upsell card when marketing not added (same shape as Pending upsell, including EIN card swap), or (2) Marketing-only registration tracker after confirmation — one row only, no Appointments (already live), or (3) Nothing (after tracker dismissed).
- **Prototype dropdown on the marketing-only tracker:** "In review" / "Registered" toggles the single-row state and completion UX.

### Marketing messages in list extended (D-340)
- `showMarketingMessages` logic updated to cover both paths:
  ```
  (isPending && hasEin && upsellConfirmed) || (isApproved && hasEin && registeredUpsellConfirmed)
  ```
- Marketing messages appear in list immediately upon upsell confirmation (no waiting for approval) in both Pending and Registered.

### "Try a different EIN" link
- Tertiary text link below "This is my business" checkbox on both the inline `EinInlineVerify` component and the `/start/business` verified state.
- Click clears EIN state (`einState="idle"`), input value, and confirmedOwnership checkbox — reopens the EIN input.

### Copy polish and layout fixes
- Marketing radio helper text on Building state registration card: removed "Appointments messages go live first." (now just "You'll get access to marketing templates you can customize or write from scratch.")
- Registration status row layout: date moved to its own line below the bold type name, dot separator removed.
- Badge vertical centering: `mt-1` added to all status badges so they center-align with the bold name text.
- Confirmation step copy consolidated: "Registration typically takes a few days." replaces "Registration takes a few days; no fee." and the separate "No extra registration fee." line.
- Upsell card spacing, button positions, filled vs outlined badge variants all iterated and finalized.

### Documentation
- **D-338 through D-340** added to `DECISIONS.md`.
- **PROTOTYPE_SPEC.md** updated for the Pending right rail (registration status tracker + marketing upsell), Registered right rail (upsell + marketing-only tracker), marketing radio helper text, and "Try a different EIN" link.
- **WORKSPACE_DESIGN_SPEC.md** gained a new "## Right Rail State Matrix" section with tables for Pending and Registered states across all EIN/marketing permutations.

---

## Quality Checks Passed

- `tsc --noEmit` — clean (prototype)
- `next build` — clean (completed earlier in session)
- No ESLint config in prototype — tsc and build are the quality gates (unchanged baseline)

---

## In Progress / Partially Done (Carried Forward)

### All backend stubs from previous session still apply
- Signup backend is stubbed (D-59 pending)
- EIN verification backend is stubbed (D-302/D-303 pending)
- Phone OTP is stubbed (D-46 pending)
- Get-started content is hardcoded
- Marketing messages hardcoded for Appointments vertical only

### New this session
- Registered state marketing upsell "Add your EIN →" button now wired to card swap — functional in the prototype, but the two-phase verify is still a stub (inherited from `EinInlineVerify`).
- Registered state metrics (Delivery/Recipients/Usage & Billing) remain mock data.
- Marketing-only registration tracker's "In review → Registered" transition is a prototype dropdown — no timer, no real backend event.

---

## Gotchas for Next Session

1. **Delete `.next` before every prototype dev server start.** API server (port 3002) has no `.next`.
2. **The prototype is in `/prototype`, not the root.** Running `next dev` from root starts the production app on port 3001. Always `cd prototype` first.
3. **No ESLint config** in prototype — tsc + `next build` are the quality gates.
4. **Two-column layout in Registered state** is new. Previously Registered was single-column. If you touch the Registered state, the right rail is a three-way conditional (upsell card / marketing-only tracker / nothing).
5. **`showMarketingMessages` condition** controls whether the 4 Appointments marketing cards appear in the list. It covers both Pending and Registered upsell paths — don't regress this when editing message list logic.
6. **`hasMarketingRegistered` = `upsellConfirmed`.** The Pending tracker uses this to show/hide the Marketing row. In a future session with a proper data model, this should read from the registration record, not a transient state.
7. **Registered state has its own separate state vars:** `registeredUpsellEinExpanded`, `registeredUpsellConfirmStep`, `registeredUpsellConfirmed`, `regMktTrackerState`, `regMktTrackerDismissed`, `regMktTrackerTooltip`. Don't cross-wire these with the Pending variants.
8. **Marketing-only tracker dropdown** (`regMktTrackerState`) is prototype-only. Production will read from the registration record.
9. **Close button on "Your messages are live!"** sets `regMktTrackerDismissed` — the right rail becomes `null` entirely. Conditional at card wrapper level.
10. **`relaykit-ein-change` custom event** is dispatched from all three EIN save handlers (main, pending upsell, registered upsell). The Messages page and dashboard layout listen for it.
11. **Variant IDs are stable** (`standard`, `action-first`, `context-first`) even though labels are Standard/Friendly/Brief. Don't rename the IDs.
12. **Never push this branch without PM review.** 22 unpushed commits as of close-out.
13. **Migrations 003 and 004 may not be applied to live DB** (carried forward).
14. **Rate limiter is in-memory** — resets on server restart (carried forward).

---

## Files Modified This Session

```
# Decisions, specs, docs
DECISIONS.md                                             # MODIFIED — D-338, D-339, D-340 added
PROTOTYPE_SPEC.md                                        # MODIFIED — Pending/Registered right rail, marketing radio helper text, Try different EIN link
WORKSPACE_DESIGN_SPEC.md                                 # MODIFIED — Right Rail State Matrix section added
CC_HANDOFF.md                                            # This file (overwritten)

# Page changes
prototype/app/apps/[appId]/messages/page.tsx             # MAJOR — marketing upsell in Pending + Registered, registration status tracker card, per-type badges, marketing-only tracker in Registered
prototype/app/start/business/page.tsx                    # MODIFIED — "Try a different EIN" link on verified state

# Component changes
prototype/components/ein-inline-verify.tsx               # MODIFIED — "Try a different EIN" link on verified state
```

---

## What's Next (suggested order)

1. **Extended Review and Rejected card redesign** — these still use the old "Registration status" / pill pattern. Apply the per-type tracker pattern from D-339 for consistency.
2. **Wire wizard data into setup instructions** — generate install command, API key, and prompt from sessionStorage business name + messages instead of hardcoded Club Woman content.
3. **Marketing messages for other verticals** — currently only Appointments has marketing message data. Add sets for Verification, Orders, Support, etc.
4. **Test all right rail state matrix permutations** — use the matrix in WORKSPACE_DESIGN_SPEC.md as a QA checklist before porting to production.
5. **Wire signup to real magic-link backend** (D-59).
6. **Wire `/start/verify` phone OTP to Twilio Verify** (D-46).
7. **Wire EIN verification backend** (D-302, D-303).
8. **Extract `OtpInput`** to shared component — currently inlined in `/signup/verify`, `/start/verify`, and sign-in modal.
9. **Registration flow pages** — `/apps/[appId]/register` and `/register/review` need the new single-page workspace context (no tab bar, back-to-messages pattern).
10. **Error states design session** — walk through all interaction failures before locking in copy.
