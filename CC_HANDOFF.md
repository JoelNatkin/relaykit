# CC_HANDOFF.md — Session Handoff
**Date:** 2026-03-24 (messages expansion, flow diagram overhaul, registration component import)
**Branch:** main

---

## Commits This Session

```
2d63a63  feat: import intake wizard components from production — scope advisory, business details form, review & confirm with all validation and field logic preserved
```

This single commit contains all session work (messages, flow diagram, logo fix, registration import, dev route).

---

## What We Completed

### Messages Expanded to 6 (D-223)
- Added "No-show follow-up" and "Pre-visit instructions" to appointments category in `messages.ts` (tier: `also_covered`, with all 3 style variants)
- Reordered to chronological appointment lifecycle: Booking confirmation → Appointment reminder → Pre-visit instructions → Reschedule notice → No-show follow-up → Cancellation notice
- Each card now displays a numbered index (1–6) in brand purple via new `cardNumber` prop on `CatalogCard`
- Both app and public Messages pages updated

### Flow Diagram Overhaul (D-224)
- 6 numbered nodes matching the 6 message cards, with matching tooltips
- All circles filled purple (24px) with white numbers — no hollow variant
- Labels left-aligned with max-width ~90px for natural two-line wrapping
- Native `title` attributes replaced with React hover-state CSS tooltips (white bg, shadow, positioned above circle)
- `FlowNode` component extracted for reuse in both pages
- `PLAYBOOK_FLOWS` data structure changed from `string[]` to `PlaybookStep[]` (label + tooltip)

### Production Intake Wizard Imported to Prototype (D-225)
Three production screens imported as standalone components:

**Import 1 — RegistrationScope** (`prototype/components/catalog/registration-scope.tsx`)
- Scope advisory section with green check / amber X items
- Expansion checkboxes with promo note
- Supports controlled (`selectedExpansions` + `onExpansionsChange` props) or uncontrolled state
- Dynamic per all 9 use cases

**Import 2 — BusinessDetailsForm** (`prototype/components/registration/business-details-form.tsx`)
- Full wholesale port with ALL field logic preserved
- Zod validation on blur, character counters, auto-formatting (phone/EIN/URL)
- EIN conditional path (sole prop note, business type, registered address)
- Industry gating with 3-tier inline alerts
- Use-case-specific fields (service_type, product_type, app_name, community_name, venue_type)
- Untitled UI base components (Input, TextArea, Select, RadioGroup) replaced with plain HTML + Tailwind

**Import 3 — ReviewConfirm** (`prototype/components/registration/review-confirm.tsx`)
- Two-column layout: details card (left) + submission preview (right)
- Generated campaign description + 3 sample messages
- FAQ accordion, compliance site preview, "What happens next", plan summary
- Pricing breakdown ($199 + $19/mo = $218)
- Monitoring consent checkbox + confirmation modal
- Stripe checkout replaced with console.log

**Supporting libs** copied to `prototype/lib/intake/`:
- `use-case-data.ts` — 9 use case definitions with icons, scope items, expansions
- `validation.ts` — Zod schema, formatters, US states, business type options, use-case field definitions
- `campaign-type.ts` — campaign type determination, promo expansion detection
- `industry-gating.ts` — 3-tier industry detection (cannabis/firearms/healthcare/legal/financial/restaurant)
- `templates.ts` — campaign description + sample message generation, compliance slug

**Test route** at `/registration-test` renders all three components in sequence with use case switcher.

### Dev Bypass Route (D-226)
- `src/middleware.ts` matcher updated to exclude `/dev/*` from Supabase session checks
- `/dev/intake` hub page with sessionStorage seeding and direct links to all 4 wizard screens

### Minor Fixes
- Public Messages page logo circles now have `bg-white` (D-227)
- Zod added to prototype `package.json` dependencies

---

## In Progress / Partially Done

### Registration Components — Visual Review Needed
Components are imported and compile clean, but Joel hasn't reviewed them visually yet. The plain HTML form elements may need styling refinements to match Untitled UI's exact look.

### Messages Tab — Approved State
Still not differentiated from Default. Planned per D-159: personalization fields read-only with registered values.

### Playbook Flows — Other Categories
Only `appointments` has flow data in `PLAYBOOK_FLOWS`. Structure ready for verification, orders, support, etc.

---

## Gotchas for Next Session

1. **Delete `.next` before every dev server start.** Always: `rm -rf prototype/.next` then restart. Port 3001.

2. **DECISIONS.md is a two-file system.** Active decisions (D-84–D-227) in DECISIONS.md. Archived (D-01–D-83) in DECISIONS_ARCHIVE.md.

3. **`PLAYBOOK_FLOWS` data shape changed.** Steps are now `{ label: string; tooltip: string }` objects, not plain strings. Both pages use the same `FlowNode` component for hover tooltips.

4. **CatalogCard has new `cardNumber` prop.** Optional — only passed on Messages pages. Renders brand purple number left of title.

5. **RegistrationScope supports controlled or uncontrolled mode.** Pass `selectedExpansions` + `onExpansionsChange` for controlled; omit for internal state.

6. **Registration components use plain HTML form elements.** No Untitled UI Input/Select/RadioGroup/Checkbox. Styling approximates Untitled UI but may need refinement.

7. **Industry gating is live in the prototype form.** Typing "dental", "cannabis", "law firm" etc. in the business description will trigger gate alerts. This is intentional — it's ported behavior.

8. **`/registration-test` is a dev-only route.** Not linked from nav. Switch use cases with the dropdown to see different field sets.

9. **`/dev/intake` route bypasses middleware.** The `dev/` prefix is excluded from the Supabase session matcher. Don't put production routes under `/dev/`.

10. **Prototype now depends on `zod`.** Added to `prototype/package.json`.

11. **6 messages now render on both Messages pages.** The `coreMessages` filter (`tier !== "expansion"`) picks up all 6 non-expansion messages automatically.

12. **Orphaned files still on disk** — `prototype/components/dashboard/` and `prototype/app/c/` are safe to delete.

13. **Overview page `changes_requested` copy may still say "Changes requested"** — D-202 rename (Extended Review) may need alignment.

14. **"Appointments" pill in layout.tsx is still hardcoded** — needs to be dynamic for multi-category.

---

## Files Modified This Session

```
# Messages & flow diagram
prototype/data/messages.ts                              # 2 new messages, reordered
prototype/components/catalog/catalog-card.tsx            # cardNumber prop
prototype/app/apps/[appId]/messages/page.tsx             # 6-node flow, numbered cards
prototype/app/sms/[category]/messages/page.tsx           # 6-node flow, numbered cards, logo bg-white

# Registration import
prototype/components/catalog/registration-scope.tsx      # NEW — scope advisory
prototype/components/registration/business-details-form.tsx  # NEW — business details form
prototype/components/registration/review-confirm.tsx     # NEW — review & confirm
prototype/lib/intake/use-case-data.ts                    # NEW — use case definitions
prototype/lib/intake/validation.ts                       # NEW — Zod schemas
prototype/lib/intake/campaign-type.ts                    # NEW — campaign type logic
prototype/lib/intake/industry-gating.ts                  # NEW — industry detection
prototype/lib/intake/templates.ts                        # NEW — template generation
prototype/app/registration-test/page.tsx                 # NEW — test route
prototype/package.json                                   # zod dependency added
prototype/package-lock.json                              # lockfile

# Production dev route
src/middleware.ts                                        # /dev/* excluded from matcher
src/app/dev/intake/page.tsx                              # NEW — dev intake hub

# Session close-out
DECISIONS.md                                             # D-223 through D-227
PROTOTYPE_SPEC.md                                        # Messages, flow diagram, registration specs
CC_HANDOFF.md                                            # This file (overwritten)
```

---

## What's Next (suggested order)

1. Visual review of registration components at `/registration-test` — adjust form styling if needed
2. Wire RegistrationScope into category landing pages (`/sms/[category]/page.tsx`)
3. Differentiate Messages tab Approved state (read-only personalization per D-159)
4. Align Overview page "changes_requested" copy with D-202 ("Extended Review" language)
5. Add playbook flows for other categories (verification, orders, support)
6. Delete orphaned `/c/` routes and `components/dashboard/` files
7. Make "Appointments" pill dynamic in layout.tsx
