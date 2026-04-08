# CC_HANDOFF.md — Session Handoff
**Date:** 2026-04-08 (single-page workspace build, tab removal, right rail)
**Branch:** main

---

## Commits This Session (4)

```
7bb88db  docs: add DECISIONS vs PROTOTYPE_SPEC criteria to CLAUDE.md
514ef10  docs: fix stale decision numbers in WORKSPACE_DESIGN_SPEC.md (Joel push)
c5a3294  docs: update PRD — remove UI duplication, update pricing/carrier/marketing (Joel push)
591fec5  feat(prototype): single-page workspace — setup instructions, right rail, tab removal, metrics
```

---

## What Was Completed

### CLAUDE.md update
- Added "What belongs in DECISIONS.md vs PROTOTYPE_SPEC.md" subsection with decision/spec sorting criteria and shortcut test.
- Updated session close-out step 2 to reference the new criteria.

### Single-page workspace (D-332 implementation)
- **Tab bar removed** from `dashboard-layout.tsx`. No Overview/Messages/Settings tabs in any state.
- **Overview redirects to Messages** in all states (wizard and non-wizard). Route redirects updated in `layout.tsx`.
- **Settings as child page** — accessed via gear icon + "Settings" text link on Messages page. Settings page has "← Back to messages" link at top.

### Setup instructions on Messages page
- **New component:** `prototype/components/setup-instructions.tsx` — "Start building" heading, subhead, logo farm (6 tool logos), 3 vertically stacked instruction cards (Install, API key, Add SMS) with copy buttons. Grey `bg-bg-secondary` container.
- **Toggle control** — "Setup instructions" label + switch in top-right row. Default ON in Building, OFF in all other states. Per-state toggle persisted independently in sessionStorage (`relaykit_setup_instructions_[state]`).
- Visible in Building, Pending, Extended Review, Registered, and Rejected states.

### Right rail registration card
- **Building state:** Two-column layout. Left: setup instructions + messages. Right (280px, sticky): "Ready to go live?" card with "Registration takes a few days." body, campaign selection radios (D-335), pricing, CTA.
- **Campaign radios (D-335):** When EIN on file: "Just [vertical]" (default, $19/mo) and "Add marketing messages too" ($29/mo). Vertical label lowercased from sessionStorage. When no EIN: no radios, "$49 registration + $19/mo", small text "Add your EIN to unlock marketing messages."
- **Marketing tooltip** below card (Building only): "What about marketing messages?" purple link. EIN-aware tooltip content.
- **Pending state:** "Registration status" + purple "Under carrier review" pill + submitted date + email note.
- **Extended Review:** "Registration status" + purple "Under review" pill + submitted/updated dates + longer-than-expected copy.
- **Rejected:** "Registration status" + red "Not approved" pill + refund in green + "What happened" section + mailto link. No retry button.
- **Registered:** No right rail. Single-column layout.

### Delivery metrics (Registered state)
- Three metrics cards (Delivery 98.4%, Recipients 284, Usage & Billing 347/500) on Messages page. Same mock data as Overview approved-dashboard. Positioned below setup instructions toggle, above message cards.

### EIN prototype switcher
- Added to dashboard identity bar next to state switcher. "With EIN" / "No EIN" options. Writes to wizard sessionStorage `ein` field. Dispatches `relaykit-ein-change` custom event for cross-component reactivity.

### Decisions recorded
- D-334: Marketing campaign bundled in $49 registration fee.
- D-335: Registration CTA shows campaign selection when EIN on file.

### Docs updated (Joel-initiated, pushed to remote)
- WORKSPACE_DESIGN_SPEC.md: fixed stale decision numbers.
- RELAYKIT_PRD_CONSOLIDATED.md: removed UI duplication, updated pricing/carrier/marketing.
- PRICING_MODEL.md: updated to v6.0 with D-334 integration (was already current when checked).

---

## Quality Checks Passed

- `tsc --noEmit` — clean (prototype)
- `next build` — clean; all routes compile
- No ESLint config in prototype — tsc and build are the quality gates (unchanged baseline)

---

## In Progress / Partially Done (Carried Forward)

### Signup backend is stubbed
Email validation is a client-side regex shape check. Send code is a 1.5s `setTimeout` stub. OTP accepts any 6 digits. Real magic-link backend is D-59.

### EIN verification backend is stubbed
Two-phase spinner (`Verifying...` → `Checking sources...`) is visual-only. Real EIN lookup + auto-populate is D-302/D-303 backend work.

### `/start/verify` phone OTP is stubbed
Any 6 digits work. Real integration is Twilio Verify (D-46).

### Get-started and setup instruction content is hardcoded
Prompt text, API key, and business details are hardcoded for Club Woman / Appointments. Production will generate from wizard sessionStorage data + server-created project.

### Pricing references still stale in several places
D-320 ($49 flat) and D-321 ($8/500 overage) copy is in place on `/ready`, `/signup`, and the Building state registration card. Still stale in:
- `/apps/[appId]/register` and `/register/review`
- `/apps/[appId]/settings` billing section (still shows "$15 per additional 1,000" instead of "$8 per 500")
- `/sms/[category]/messages` public pricing lines
- `/` marketing home

### `/start/verify` destination is hardcoded
Currently navigates to `/apps/glowstudio/messages`. In production, this would hit signup first (or create a draft app, then route to its messages workspace).

### Overview page still exists but is unreachable
`/apps/[appId]/overview/page.tsx` and `approved-dashboard.tsx` still exist in the codebase. They are never rendered because the route always redirects to `/messages`. Can be deleted when ready — metrics cards have been migrated to Messages page.

---

## Gotchas for Next Session

1. **Delete `.next` before every prototype dev server start.** API server (port 3002) has no `.next`.
2. **No ESLint config** in prototype — tsc + `next build` are the quality gates.
3. **Tab bar is gone.** Dashboard layout no longer has tabs. Settings is accessed via gear icon on Messages page. Overview redirects to Messages. If any code references tab navigation, it's stale.
4. **EIN prototype switcher dispatches a custom event** (`relaykit-ein-change`). The Messages page listens for it to update `hasEin` state reactively. If you add new EIN-dependent UI elsewhere, add the same listener.
5. **Setup instructions toggle persists per-state** — key format `relaykit_setup_instructions_[state]`. Clearing sessionStorage resets all toggles to defaults (ON for Building, OFF for others).
6. **Campaign selection radios only appear with EIN.** Toggle the EIN switcher in the dashboard bar to test both views. The `includeMarketing` state resets to `false` on each render — it doesn't persist across page loads (by design — the choice lives in the registration form, not sessionStorage).
7. **Overview page files are orphaned.** `overview/page.tsx` and `approved-dashboard.tsx` are never rendered but still exist. The metrics cards were copied (not moved) to Messages page. Delete the Overview files when ready.
8. **`WizardLayout.getPageConfig` is pathname-driven.** Signup paths match via `pathname.includes("/signup")`. New wizard destinations under `/apps/[appId]/` need their own branch there.
9. **AppLayout has three special-case paths:** `isGetStarted` (standalone render), `isRegisterFlow` (bare max-w-5xl render), and everything else (WizardLayout or DashboardLayout).
10. **Signup email is in sessionStorage** under key `relaykit_signup_email`. The verify page reads it on mount. If someone navigates directly to `/signup/verify` without going through `/signup`, the email field will be blank.
11. **State transition boundary unchanged:** `registrationState` flips to "building" only on get-started page exits (D-322).
12. **Onboarding dropdown uses hardcoded `/apps/glowstudio/` paths.** Fine for prototype. Production would need dynamic appId.
13. **Variant IDs are stable** (`standard`, `action-first`, `context-first`) even though labels are Standard / Friendly / Brief. Don't rename the IDs.
14. **Public marketing page at `/sms/[category]/page.tsx`** has its own hardcoded variant data and pricing copy — separate from the in-app pills and from the D-320/D-321 pricing.
15. **Migrations 003 and 004 may not be applied to live DB.**
16. **Rate limiter is in-memory** — resets on server restart.

---

## Files Modified This Session

```
# Decisions, specs, docs
CLAUDE.md                                                # MODIFIED — DECISIONS vs PROTOTYPE_SPEC criteria added
DECISIONS.md                                             # MODIFIED — D-334, D-335 added
PROTOTYPE_SPEC.md                                        # MODIFIED — dashboard layout, messages page, settings, route redirects updated
WORKSPACE_DESIGN_SPEC.md                                 # MODIFIED — stale decision numbers fixed (Joel push)
docs/PRICING_MODEL.md                                    # MODIFIED — v6.0 with D-334 (Joel push)
docs/RELAYKIT_PRD_CONSOLIDATED.md                        # MODIFIED — UI duplication removed (Joel push)
CC_HANDOFF.md                                            # This file (overwritten)

# New components
prototype/components/setup-instructions.tsx              # NEW — setup instructions container + toggle + copy buttons

# Layout changes
prototype/components/dashboard-layout.tsx                # MODIFIED — tab bar removed, EIN switcher added
prototype/app/apps/[appId]/layout.tsx                    # MODIFIED — overview→messages redirect, route updates

# Page changes
prototype/app/apps/[appId]/messages/page.tsx             # MAJOR REWRITE — two-column layout, right rail, metrics, setup instructions, marketing tooltip
prototype/app/apps/[appId]/settings/page.tsx             # MODIFIED — back link added
```

---

## What's Next (suggested order)

1. **Delete orphaned Overview files** — `overview/page.tsx` and `approved-dashboard.tsx` are unreachable. Safe to remove.
2. **Fix stale pricing copy** (D-320/D-321): register + register/review pages, settings billing section ($8/500 not $15/1000), `/sms/[category]/messages` public pricing, marketing home.
3. **Wire wizard data into setup instructions** — generate install command, API key, and prompt from sessionStorage business name + messages instead of hardcoded Club Woman content.
4. **Wire signup to real magic-link backend** (D-59).
5. **Wire `/start/verify` phone OTP to Twilio Verify** (D-46).
6. **Wire EIN verification backend** (D-302, D-303).
7. **Extract `OtpInput`** to shared component — currently inlined in `/signup/verify`, `/start/verify`, and sign-in modal.
8. **Registration flow pages** — `/apps/[appId]/register` and `/register/review` need the new single-page workspace context (no tab bar, back-to-messages pattern).
9. **Error states design session** — walk through all interaction failures before locking in copy.
