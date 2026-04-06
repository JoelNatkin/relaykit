# CC_HANDOFF.md — Session Handoff
**Date:** 2026-04-06 (Signup split, get-started page, ready/pricing updates)
**Branch:** main

---

## Commits This Session (2)

```
1cc46c8  docs: update PROTOTYPE_SPEC and DECISIONS for signup split + get-started
81efc75  feat(prototype): signup split, get-started page, ready/pricing updates
```

---

## What Was Completed

### Signup split into two pages (D-323)
Split the monolithic signup page into two focused screens:
- **`/apps/[appId]/signup`** — Email entry only. 400px column. Inline `← Back` to `/ready` (no WizardLayout header Back/Continue). Full-width purple "Send code" button. 1.5s sending stub. Stores email in sessionStorage (`relaykit_signup_email`), navigates to `/signup/verify`.
- **`/apps/[appId]/signup/verify`** — OTP verification. 400px column. Inline `← Back` to `/signup`. "Check your email" heading + email from sessionStorage. 6-digit OTP boxes (`w-12 h-14`, centered, `gap-4`). Full-width "Confirm" button (always purple, no disabled state). "Resend code" link. Any 6 digits → navigate to `/get-started`. Does NOT change registrationState.

### Get-started page — `/apps/[appId]/get-started` (D-322)
New final onboarding screen. State transition boundary — everything before is Default, clicking out transitions to Pending.

**Layout:** Standalone (no WizardLayout, no DashboardLayout). 500px column. Top nav: wordmark + Appointments pill + onboarding dropdown, no Sign out.

**Content:**
- "Start building" heading + "Everything your AI tool needs to build your SMS feature."
- Tool logo farm: 6 centered logos (40px circles, `border-[#c4c4c4]`, `p-1`) — Claude Code, Cursor, Windsurf, GitHub Copilot, Cline, Other. Same SVG assets as home page hero.
- Three numbered cards with copy buttons (top-right, `Copy01` → `Check` 2s swap):
  1. "Install RelayKit" — `npm install relaykit`
  2. "Add your API key" — full prompt text for AI tool
  3. "Add SMS to your app" — hardcoded Club Woman prompt
- Full-width purple "View on dashboard" → `setRegistrationState("pending")` + navigate to `/overview`.
- Footer: "We also sent this to your email." + "Need help? Talk to our AI assistant →" (also transitions state).

### Ready page updates
- Updated all 5 benefit item copy (new detail text).
- Added overage pricing line: "500 messages included. Additional messages **$8** per 500." (`text-sm`).

### WizardLayout changes
- Header Back/Continue row hidden entirely when both `backHref` and `continueButton` are absent (signup pages).
- Signup paths (`pathname.includes("/signup")`) return `backHref: null, continueHref: null` — pages manage their own inline Back links.
- `WizardContinueContext` no longer used by signup (removed from signup page).

### TopNav changes
- **Sign out hidden** on all wizard-state pages (when `isLoggedIn && isWizardNav`).
- **Onboarding nav dropdown** added — native `<select>`, `text-xs text-text-quaternary`, 11 numbered options covering the full wizard flow. Shows on `/start/*` routes (right side of nav) and `/apps/*` wizard routes (right of state switcher). Only visible when `registrationState === "default"`.
- Wizard regex extended to match `/signup/verify` and `/get-started`.

### AppLayout changes
- `isSignup` detection broadened to `pathname.includes("/signup")` to cover `/signup/verify`.
- `isGetStarted` added — excluded from WizardLayout wrapping and redirect logic. Renders standalone (`<>{children}</>`).

### Decisions added
- **D-320** — Registration fee $49 flat (from previous session, already recorded).
- **D-321** — Overage pricing: $8 per 500 additional messages.
- **D-322** — Get-started page is the state transition boundary.
- **D-323** — Signup split into email entry + OTP verification.

---

## Quality Checks Passed

- `tsc --noEmit` — clean (prototype)
- `next build` — clean; signup/verify and get-started routes dynamic-rendered, all `/start/*` routes static.
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

### Pricing references still stale in several places
D-320 ($49 flat) and D-321 ($8/500 overage) copy is in place on `/ready` and `/signup`. Still stale in:
- `/apps/[appId]/overview` registration card
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
   All render centered content columns but at different widths (540px for wizard, 400px for signup, 500px for get-started).
4. **TopNav has three distinct modes** plus the onboarding dropdown:
   - `/start` and `/start/*` → wordmark-only + onboarding dropdown (right side).
   - `/apps/*` wizard routes + `registrationState === "default"` → wordmark + Appointments pill + state switcher + onboarding dropdown. No Sign out.
   - Everything else → full marketing or dashboard nav.
   Adding new wizard pages means updating the TopNav wizard regex.
5. **`WizardLayout.getPageConfig` is pathname-driven.** Signup paths match via `pathname.includes("/signup")`. New wizard destinations under `/apps/[appId]/` need their own branch there.
6. **AppLayout has three special-case paths:** `isGetStarted` (standalone render), `isRegisterFlow` (bare max-w-5xl render), and everything else (WizardLayout or DashboardLayout).
7. **Signup email is in sessionStorage** under key `relaykit_signup_email`. The verify page reads it on mount. If someone navigates directly to `/signup/verify` without going through `/signup`, the email field will be blank.
8. **State transition happens on get-started exits only.** OTP verify does NOT set `registrationState`. Both "View on dashboard" and "Talk to our AI assistant" on get-started call `setRegistrationState("pending")` before navigating.
9. **Onboarding dropdown uses hardcoded `/apps/glowstudio/` paths.** This is fine for prototype. Production would need dynamic appId.
10. **Variant IDs are stable** (`standard`, `action-first`, `context-first`) even though labels are Standard / Friendly / Brief. Don't rename the IDs.
11. **`/apps/[appId]/opt-in/page.tsx`** is intentionally returning `null` — don't delete. The reference comment preserves the original implementation for future redesign.
12. **Public marketing page at `/sms/[category]/page.tsx`** has its own hardcoded variant data and pricing copy — separate from the in-app pills and from the new D-320/D-321 pricing.
13. **Migrations 003 and 004 may not be applied to live DB.**
14. **Rate limiter is in-memory** — resets on server restart.

---

## Files Modified This Session

```
# Decisions & specs
DECISIONS.md                                              # MODIFIED — D-321, D-322, D-323 added
PROTOTYPE_SPEC.md                                         # MODIFIED — signup split, get-started, ready updates
CC_HANDOFF.md                                             # This file (overwritten)

# New pages
prototype/app/apps/[appId]/signup/verify/page.tsx         # NEW — OTP verification (split from signup)
prototype/app/apps/[appId]/get-started/page.tsx           # NEW — final onboarding, state transition boundary

# Modified pages
prototype/app/apps/[appId]/signup/page.tsx                # REWRITTEN — email-only, inline Back, 400px
prototype/app/apps/[appId]/ready/page.tsx                 # MODIFIED — new benefit copy, overage pricing line
prototype/app/apps/[appId]/layout.tsx                     # MODIFIED — get-started standalone, signup/verify routing

# Shared components
prototype/components/wizard-layout.tsx                    # MODIFIED — hidden header row, signup config
prototype/components/top-nav.tsx                          # MODIFIED — Sign out hidden, onboarding dropdown,
                                                          #            wizard regex extended
```

---

## What's Next (suggested order)

1. **Fix stale pricing copy across prototype** (D-320/D-321). Touch points: overview registration card, register + register/review pages, settings billing section, `/sms/[category]/messages` public messages page, marketing home.
2. **Wire signup to real magic-link backend** (D-59) — replace the email regex + OTP stub.
3. **Wire `/start/verify` phone OTP to Twilio Verify** (D-46) — real send code + verification.
4. **Wire the EIN verification backend** (D-302, D-303) — replace the two-phase stub with real lookup + business-identity auto-populate.
5. **Generate get-started content from wizard data** — install command, API key from created project, prompt from sessionStorage business name + messages.
6. **Extract `OtpInput`** to a shared component — currently inlined in `/signup/verify` and `/apps/[appId]/overview`. Sign-in modal has its own variant. Low-risk cleanup.
7. **`/start/verify` destination** — decide whether it routes to signup first, or creates a draft app and routes to its messages workspace.
8. **Error states design session** (per WORKSPACE_DESIGN_SPEC) — walk through all interaction failures before locking in copy.
