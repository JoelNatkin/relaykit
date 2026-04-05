# CC_HANDOFF.md — Session Handoff
**Date:** 2026-04-05 (Wizard/dashboard split, message card polish, compliance rework, opt-in page redesign)
**Branch:** main

---

## Commits This Session (24)

```
04f1abf  decisions: amend D-317 — add post-onboarding opt-in form clause
65b9317  refactor(prototype): split layout into wizard and dashboard wrappers
88e4ca8  feat(prototype): wizard messages page — centered heading, Phone01 icons, dual Continue
aa52b03  feat(prototype): opt-in page centered layout for wizard context
a04813c  feat(prototype): add floating nav helper for design review
df47de4  docs: update PROTOTYPE_SPEC.md and WORKSPACE_DESIGN_SPEC.md for layout reorganization
63453e2  fix(prototype): consolidate wizard header into single top nav bar
1d2d3e2  fix(prototype): wizard Back/Continue align with nav bar edges
642341f  fix(prototype): redesign message card style pills, realign compliance error
e22f421  feat(prototype): add Stars02 prefix icon to AI help input in card edit
f865576  feat(prototype): rename pills + add AI/Fix loading states
82051a6  feat(prototype): single-card editing for message list
694a085  feat(prototype): add title tooltips to card pencil and phone buttons
36ed4d1  style(prototype): match info tooltip styling on pencil and phone buttons
2043d15  style(prototype): contextual placeholder for AI help input
cfa282a  feat(prototype): rename Fix to Restore, restore full canned pill text
3fc88dd  decisions: D-319 Restore replaces full message with clean variant
7b073c7  feat(prototype): expand compliance checks to variable deletion, stackable hints
7b10596  feat(prototype): looser compliance checks + immediate clear on fix
0bad194  style(prototype): simplify opt-in consent checkbox text
255b743  style(prototype): reframe opt-in page heading + max-w 400px on form
2aa0f28  style(prototype): opt-in page polish
8344eef  style(prototype): opt-in page copy — Message opt-in heading + consent records line
bd1a002  style(prototype): center opt-in content column (heading + text + form)
```

---

## What Was Completed

### Layout architecture — wizard / dashboard split
- Two layout wrappers, one route tree. `layout.tsx` reads registrationState and renders either `WizardLayout` or `DashboardLayout`.
- **WizardLayout** (Default state): full-width Back/Continue row aligned with nav edges (`px-6`), centered `max-w-[540px]` content container, optional full-width bottom Continue for dualContinue pages. Back/Continue targets come from `getPageConfig(pathname, appId)`.
- **DashboardLayout** (Pending/Approved/Extended Review/Rejected): preserves existing app identity bar, tabs, status indicator, with state switcher moved to top right.
- **TopNav wizard-aware:** on sandbox `/apps/*/(messages|opt-in)` routes it renders RelayKit + Appointments pill (left) and state switcher + Sign out (right). No "Your Apps" link. No duplicate Sign out.
- **Route redirects:** wizard mode forbids overview/settings → `/messages`; dashboard mode forbids opt-in → `/messages`; state switcher changes trigger redirects.
- **ProtoNavHelper** (`prototype/components/proto-nav-helper.tsx`): floating bottom-left "Nav ↑" pill. Expands to show jump links to every page in every state — sets registrationState and navigates in one click. Prototype-only, strip on port.

### Messages page + CatalogCard
- **Single-card editing** — `CatalogCard` supports controlled `isEditing` + `onEditRequest` props. Parent (messages page) tracks `editingMessageId`; clicking a new pencil closes the previous edit, unsaved text discarded, no confirmation. `savedText`/`savedPillId` persist across sessions. Fallback to local state when uncontrolled (public messages page).
- **Style pills redesigned:** Removed "Current" pill + Accept/Revert preview flow. New order: Standard / Friendly / Brief / (Custom on far right, dashed border, `ml-auto`). Canned pill taps swap textarea instantly, no preview. Typing → Custom auto-highlights, `customTextBuffer` preserves custom content across pill clicks. Custom pill hidden until custom content exists.
- **Pill labels renamed** (ids unchanged for data stability): Brand-first → Standard, Action-first → Friendly, Context-first → Brief. Variant text rewritten across all 6 appointment messages: Standard = original template, Friendly = warmer/conversational, Brief = shortest compliant.
- **AI help input:** Stars02 sparkle prefix icon (brand color). Contextual placeholder: canned active → "Ask AI: make it more casual"; Custom active → "Ask AI: polish my edit"; loading → "Rewriting…". Enter submits. 1.5s stub setTimeout, then rewrite + activePillId → Custom. Textarea disabled during load.
- **Fix → Restore** (D-319): Button renamed, behavior changed. Clicking Restore replaces the entire textarea with the clean interpolated text of `lastCannedPillId` (the last canned pill before switching to Custom). Restores compliance wholesale rather than patching fragments. 1.5s stub delay.
- **Compliance rework:**
  - Opt-out check: now requires BOTH `STOP` (case-insensitive) AND one of `opt out`/`opt-out`/`unsubscribe`.
  - Variable deletion check: for each `{var}` in message.template, substring-matches (case-insensitive) interpolated demo value. Missing variables grouped via `VARIABLE_LABELS` map (date/time/service_type → "appointment details", etc.).
  - Error text: "Missing opt-out language" → "Needs opt-out language" (neutral framing).
  - `ComplianceResult.issues: string[]` — multiple hints stack vertically right-aligned with single Restore button.
  - Check runs on every editText change via useEffect. Non-compliant reveal debounced 2s; compliant hides hint immediately.
- **Send icons context-aware:** `sendIcon` prop. Wizard uses `Phone01` (no circle). Dashboard keeps paper airplane in `bg-bg-secondary` circle.
- **Custom tooltips** on pencil and phone buttons, matching info tooltip styling (`rounded-lg bg-[#333333] px-3 py-2 text-xs text-white shadow-lg`). Anchored right to avoid overflow.

### Opt-in page
- Heading: "Message opt-in"
- Context: "Opt-in, opt-out, and consent records — all handled for you."
- Content wrapped in `max-w-[400px] mx-auto` — heading, context, form share a single centered 400px column.
- Continue button moved to WizardLayout top header row (single Continue, not dual). "Signup page coming soon" caption removed. Continue loops to `/messages` as placeholder.
- **CatalogOptIn polish:** consent checkbox simplified to category + business name (e.g., "I agree to receive appointment text messages from GlowStudio.") via `CATEGORY_CONSENT_WORD` map. Checkbox + fine print tightened to `leading-snug`. CTA button lightened to `bg-[#98A2B3]` (hover `bg-[#7A808A]`).

### Decisions
- D-317 amended — added post-onboarding opt-in viewability clause.
- D-319 recorded — Restore replaces full message with clean variant, not a partial patch.

---

## Quality Checks Passed

- `tsc --noEmit` — clean (prototype)
- `next build` — clean (prototype)
- All routes return 200: /, /apps/glowstudio/messages, /apps/glowstudio/opt-in, /apps/glowstudio/overview, /apps/glowstudio/settings, /sms/appointments/messages
- No ESLint config in prototype — tsc and build are the quality gates (documented baseline).

---

## In Progress / Partially Done (Carried Forward)

### AI help backend (stubbed)
The AI help input and Restore button both use 1.5s setTimeout stubs. Real Claude API integration is D-300.

### Signup page (Step 6)
Opt-in Continue loops back to `/messages` as a placeholder. Real signup page needs email + OTP + pricing reveal ($99 + $19/mo per D-314, D-315).

### Sinch carrier integration
POST /v1/messages still logs to console instead of sending via Sinch. Unchanged from prior session.

### Custom messages
`namespace: "custom", event: "send"` returns 422 "not yet supported". Placeholder for D-280.

### Style pill AI pre-validation
Pill swaps render variant text directly. Per WORKSPACE_DESIGN_SPEC.md, pill changes should be AI pre-validated before showing. Current code comment notes: "Pill variants are pre-validated. If AI validation is added later, pre-compute on edit open and cache so taps remain zero-latency."

---

## Gotchas for Next Session

1. **Delete `.next` before every dev server start** (prototype). API server has no `.next`.
2. **API server runs on port 3002.** Prototype is port 3001.
3. **No ESLint config in prototype.** tsc and build are the quality gates.
4. **Variant IDs are stable** (standard / action-first / context-first) even though labels changed to Standard / Friendly / Brief. Data model and public messages page rely on the ids.
5. **Public messages page uses local edit state** — it doesn't pass `isEditing`/`onEditRequest` to CatalogCard, so multiple cards could open simultaneously there. That's intentional for the marketing page.
6. **Public marketing page at `/sms/[category]/page.tsx`** has its own hardcoded variant data with old labels ("Brand-first / Action-first / Context-first"). Not updated this session — it's separate marketing copy from the in-app pills.
7. **Opt-in page Continue loops to `/messages`** as a placeholder. Signup page needs to exist before Continue points somewhere real.
8. **TopNav wizard detection** uses a pathname regex `/\/apps\/[^/]+\/(messages|opt-in)$/`. If new wizard-mode pages are added, extend the regex.
9. **WizardLayout's getPageConfig** is pathname-driven. New wizard steps need entries added there (backHref, continueHref, dualContinue).
10. **Compliance check is a client-side stub.** Code comment notes "Prototype stub — production compliance is server-side with full TCPA/10DLC rule evaluation."
11. **VARIABLE_LABELS map** in catalog-card.tsx groups variables into human labels. New categories will need entries added or the fallback (`key.replace(/_/g, " ")`) will show raw variable names.
12. **Rate limiter is in-memory.** Resets on server restart.
13. **Migrations 003 and 004 may not be applied to live DB.**
14. **Pricing references across prototype are stale** (D-314 changed to $99 — overview registration card, register/review page, settings billing section still show old $49/$150 pricing).
15. **WORKSPACE_DESIGN_SPEC.md** was updated last session to remove "(PENDING)" markers on D-310–D-318. D-319 hasn't been added there yet.

---

## Files Modified This Session

```
# Decisions & specs
DECISIONS.md                                            # MODIFIED — D-317 amended, D-319 added
PROTOTYPE_SPEC.md                                       # MODIFIED — Messages, CatalogCard, Opt-in, WizardLayout sections
CC_HANDOFF.md                                           # This file (overwritten)

# Prototype — layout architecture
prototype/app/apps/[appId]/layout.tsx                   # REWRITTEN — state-based layout switching + redirects
prototype/components/wizard-layout.tsx                  # NEW — wizard layout wrapper
prototype/components/dashboard-layout.tsx               # NEW — dashboard layout wrapper
prototype/components/top-nav.tsx                        # MODIFIED — wizard-aware nav rendering
prototype/components/proto-nav-helper.tsx               # NEW — floating nav helper for design review
prototype/app/layout.tsx                                # MODIFIED — mount ProtoNavHelper

# Prototype — messages page + catalog card
prototype/app/apps/[appId]/messages/page.tsx            # REWRITTEN — wizard/dashboard context, single-card editing state
prototype/components/catalog/catalog-card.tsx           # REWRITTEN — pills, compliance, AI/Restore loading, tooltips, controlled edit state
prototype/data/messages.ts                              # MODIFIED — pill labels renamed, variant text rewritten
prototype/lib/catalog-helpers.ts                        # (unchanged, but extractVariables + getExampleValues now imported by catalog-card)

# Prototype — opt-in page
prototype/app/apps/[appId]/opt-in/page.tsx              # REWRITTEN — new heading, context, centered 400px column
prototype/components/catalog/catalog-opt-in.tsx         # MODIFIED — simplified checkbox, tightened spacing, lighter button
```

---

## What's Next (suggested order)

1. **Phase 2.5: Error states design session** — per WORKSPACE_DESIGN_SPEC.md, walk through every interaction that can fail (EIN verification, phone OTP, AI rewrite, compliance, network errors) before building the wizard flow.
2. **Signup page (Step 6)** — email + OTP + pricing reveal. Opt-in Continue currently loops to /messages as placeholder.
3. **Phase 3: `/start` wizard flow** — vertical picker, intake questions, AI summary, phone verification. Net-new pages that feed into the existing messages workspace.
4. **Wire the AI help stub to Claude** (D-300) — backend call for rewrites.
5. **Wire Restore to real server-side compliance** (D-319) — production check with full TCPA/10DLC rules.
6. **Fix stale pricing across prototype** (D-314 — $99 flat fee) — overview registration card, register/review page, settings billing section.
7. **Append D-319 reference** to WORKSPACE_DESIGN_SPEC.md alongside D-310–D-318.
8. **Sinch carrier integration** — replace console.log stub in POST /v1/messages.
