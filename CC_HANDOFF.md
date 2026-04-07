# CC_HANDOFF.md — Session Handoff
**Date:** 2026-04-07 (wizard polish, state renames, Overview cleanup)
**Branch:** main

---

## Commits This Session (2)

```
66c08cd  feat(prototype): wizard flow tweaks, state renames, building state + pricing fix
5a6f14b  refactor(prototype): remove stale Overview accordion, show Start building across states
```

---

## What Was Completed

### Wizard flow polish
- **Skip links** on `/start/website` and `/start/context` moved from below input to below Continue button (centered, `mt-3`). `WizardStepShell` gained `afterContinue` slot.
- **Back button** on `/apps/[appId]/messages` and `/ready` moved inside the centered content column (was page-edge aligned). Continue button on messages is now absolutely positioned so it doesn't push content down.
- **Messages Back href** corrected: `/start/context` → `/start/verify` (matches actual wizard flow order).

### Messages page onboarding divergence (D-328)
- Onboarding: H1 "Here's what your app will send" (`text-2xl font-bold`), new body text, CTA label "Continue" (was "Start building"), no send icons on cards (`hideSend` prop on CatalogCard), "What about marketing messages?" tooltip (EIN-aware from wizard sessionStorage).
- Dashboard: H2 "Messages", send icons (Phone01), no marketing tooltip.

### Phone verify page match (D-331)
- `/start/verify` now matches `/apps/[appId]/signup/verify`: 400px max width (`maxWidth` prop on WizardStepShell), full-width OTP boxes (flex-1, gap-4, h-14), 60s resend cooldown, "Use a different number" inline, prototype hint removed.

### Signup verify polish (D-334)
- Full-width OTP boxes (flex-1, gap-4). 60s resend cooldown ("Resend code in XXs" → clickable at 0).

### Ready page copy (D-332)
- "Skip the hard part" → "SMS that just works"
- "Create a free account and start building." → "Create your account and we'll generate everything your tool needs to build."

### Get-started tweaks (D-335)
- Tool logo farm left-aligned (was centered), spacing adjusted (mt-6→mt-4, mb-2→mb-5).

### State renames (D-324, D-325)
- `"default"` → `"onboarding"`, `"approved"` → `"registered"` across all files.
- New `"building"` state: post-signup, pre-registration. Shows dashboard layout (tabs). Get-started transitions to Building. State switcher order: Onboarding → Building → Pending → Extended Review → Registered → Rejected.

### Overview cleanup (D-326, D-327)
- **Removed** the 4-step "Build your SMS feature" accordion (verify phone, send test, send from code, build feature) — 659 lines of dead code deleted.
- **All non-Registered states** (Building, Pending, Extended Review, Rejected) now show "Start building" left column: heading, subhead, tool logo farm, 3 copyable instruction cards. Right column unchanged (registration card / status tracker per state).
- Building state registration card pricing: "$49 registration + $19/mo".
- Registered state: ApprovedDashboard unchanged.

### Decisions recorded
D-324 through D-335 (12 new decisions).

---

## Quality Checks Passed

- `tsc --noEmit` — clean (prototype)
- `next build` — clean; all routes compile.
- No ESLint config in prototype — tsc and build are the quality gates (documented baseline, unchanged).

---

## In Progress / Partially Done (Carried Forward)

### Signup backend is stubbed
Email validation is a client-side regex shape check. Send code is a 1.5s `setTimeout` stub. OTP accepts any 6 digits. Real magic-link backend is D-59.

### EIN verification backend is stubbed
Two-phase spinner (`Verifying…` → `Checking sources…`) is visual-only. Real EIN lookup + auto-populate is D-302/D-303 backend work.

### `/start/verify` phone OTP is stubbed
Any 6 digits work. Real integration is Twilio Verify (D-46).

### Get-started content is hardcoded
Prompt text, API key, and business details are hardcoded for Club Woman / Appointments. Production will generate from wizard sessionStorage data + server-created project.

### Overview "Start building" content is hardcoded
Same 3 instruction cards as get-started page. Production will generate from project data.

### Pricing references still stale in several places
D-320 ($49 flat) and D-321 ($8/500 overage) copy is in place on `/ready` and `/signup`. Still stale in:
- `/apps/[appId]/register` and `/register/review`
- `/apps/[appId]/settings` billing section
- `/sms/[category]/messages` public pricing lines
- `/` marketing home

### `/start/verify` destination is hardcoded
Currently navigates to `/apps/glowstudio/messages`. In production, this would hit signup first (or create a draft app, then route to its messages workspace).

---

## Gotchas for Next Session

1. **Delete `.next` before every prototype dev server start.** API server (port 3002) has no `.next`.
2. **No ESLint config** in prototype — tsc + `next build` are the quality gates.
3. **The full wizard flow uses TWO different layout systems:**
   - `/start/*` pages use `WizardStepShell` (per-page component) inside `prototype/app/start/layout.tsx`.
   - `/apps/[appId]/{messages,ready}` pages use `WizardLayout` (shared wrapper via AppLayout state check).
   - `/apps/[appId]/signup` and `/signup/verify` are inside WizardLayout but with no header chrome (backHref: null, continueHref: null → header row hidden). They render their own inline Back links.
   - `/apps/[appId]/get-started` is **standalone** — AppLayout renders `<>{children}</>`, no layout wrapper at all.
   All render centered content columns but at different widths (540px for wizard, 400px for signup/phone-verify, 500px for get-started).
4. **TopNav has three distinct modes** plus the onboarding dropdown:
   - `/start` and `/start/*` → wordmark-only + onboarding dropdown (right side).
   - `/apps/*` wizard routes + `registrationState === "onboarding"` → wordmark + Appointments pill + state switcher + onboarding dropdown. No Sign out.
   - Everything else → full marketing or dashboard nav.
   Adding new wizard pages means updating the TopNav wizard regex.
5. **`WizardLayout.getPageConfig` is pathname-driven.** Signup paths match via `pathname.includes("/signup")`. New wizard destinations under `/apps/[appId]/` need their own branch there.
6. **AppLayout has three special-case paths:** `isGetStarted` (standalone render), `isRegisterFlow` (bare max-w-5xl render), and everything else (WizardLayout or DashboardLayout).
7. **Signup email is in sessionStorage** under key `relaykit_signup_email`. The verify page reads it on mount. If someone navigates directly to `/signup/verify` without going through `/signup`, the email field will be blank.
8. **State transition happens on get-started exits only.** OTP verify does NOT set `registrationState`. Both "View on dashboard" and "Talk to our AI assistant" on get-started call `setRegistrationState("building")` before navigating.
9. **Onboarding dropdown uses hardcoded `/apps/glowstudio/` paths.** This is fine for prototype. Production would need dynamic appId.
10. **Variant IDs are stable** (`standard`, `action-first`, `context-first`) even though labels are Standard / Friendly / Brief. Don't rename the IDs.
11. **`/apps/[appId]/opt-in/page.tsx`** is intentionally returning `null` — don't delete. The reference comment preserves the original implementation for future redesign.
12. **Public marketing page at `/sms/[category]/page.tsx`** has its own hardcoded variant data and pricing copy — separate from the in-app pills and from the new D-320/D-321 pricing.
13. **Migrations 003 and 004 may not be applied to live DB.**
14. **Rate limiter is in-memory** — resets on server restart.
15. **State values changed this session:** `"default"` → `"onboarding"`, `"approved"` → `"registered"`. Any code referencing the old string values will break silently (no runtime error, just wrong state).
16. **`WizardStepShell` now has `afterContinue` and `maxWidth` props.** Only `/start/verify` uses `maxWidth="400px"`. Only website, context, and verify pages use `afterContinue`.
17. **CatalogCard gained `hideSend` prop.** When true, the send button area is fully removed from the DOM (not just hidden). Only the onboarding messages page sets it.
18. **Overview page lost ~659 lines** — the accordion components (StepCircle, StepConnector, SectionHeading, OtpInput, BlockCopyButton, etc.) were deleted. If they're needed elsewhere, recover from commit `66c08cd^` (the commit before the cleanup).

---

## Files Modified This Session

```
# Decisions & specs
DECISIONS.md                                              # MODIFIED — D-324–D-335 added
PROTOTYPE_SPEC.md                                         # MODIFIED — state renames, overview, messages, ready, verify updates
CC_HANDOFF.md                                             # This file (overwritten)

# Context / state
prototype/context/session-context.tsx                     # MODIFIED — RegistrationState type + default value

# Layout components
prototype/components/wizard-layout.tsx                    # MODIFIED — Back inside column, Continue absolute, back href fix, label
prototype/components/wizard-step-shell.tsx                # MODIFIED — afterContinue, maxWidth props
prototype/components/dashboard-layout.tsx                 # MODIFIED — state renames, Building state
prototype/components/top-nav.tsx                          # MODIFIED — state renames, onboarding check
prototype/components/proto-nav-helper.tsx                 # MODIFIED — state renames, building nav items
prototype/components/catalog/catalog-card.tsx             # MODIFIED — hideSend prop

# App layout
prototype/app/apps/[appId]/layout.tsx                    # MODIFIED — onboarding check

# Pages modified
prototype/app/apps/[appId]/overview/page.tsx             # MAJOR REWRITE — accordion removed, Start building content
prototype/app/apps/[appId]/messages/page.tsx              # MODIFIED — onboarding divergence, marketing tooltip
prototype/app/apps/[appId]/ready/page.tsx                 # MODIFIED — new headline/subhead copy
prototype/app/apps/[appId]/settings/page.tsx              # MODIFIED — state renames
prototype/app/apps/[appId]/signup/verify/page.tsx         # MODIFIED — full-width OTP, resend cooldown, state rename
prototype/app/apps/[appId]/get-started/page.tsx           # MODIFIED — building transition, logo alignment
prototype/app/start/website/page.tsx                      # MODIFIED — Skip below Continue
prototype/app/start/context/page.tsx                      # MODIFIED — Skip below Continue
prototype/app/start/verify/page.tsx                       # MODIFIED — 400px, full-width OTP, resend cooldown, inline "different number"
```

---

## What's Next (suggested order)

1. **Fix stale pricing copy across prototype** (D-320/D-321). Touch points: register + register/review pages, settings billing section, `/sms/[category]/messages` public messages page, marketing home.
2. **Building state Overview left column** — currently shows generic hardcoded content. Consider whether it should be personalized from wizard data or if it's fine as-is for prototype.
3. **Wire signup to real magic-link backend** (D-59) — replace the email regex + OTP stub.
4. **Wire `/start/verify` phone OTP to Twilio Verify** (D-46) — real send code + verification.
5. **Wire the EIN verification backend** (D-302, D-303) — replace the two-phase stub with real lookup + business-identity auto-populate.
6. **Generate get-started content from wizard data** — install command, API key from created project, prompt from sessionStorage business name + messages.
7. **Extract `OtpInput`** to a shared component — currently inlined in `/signup/verify` and `/start/verify`. Sign-in modal has its own variant. Low-risk cleanup.
8. **`/start/verify` destination** — decide whether it routes to signup first, or creates a draft app and routes to its messages workspace.
9. **Error states design session** (per WORKSPACE_DESIGN_SPEC) — walk through all interaction failures before locking in copy.
