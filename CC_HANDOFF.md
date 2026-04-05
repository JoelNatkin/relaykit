# CC_HANDOFF.md — Session Handoff
**Date:** 2026-04-05 (Wizard entry flow — /start intake + /ready + /signup)
**Branch:** main

---

## Commits This Session (26)

```
16f7fda  docs: update PROTOTYPE_SPEC for wizard entry flow and ready/signup
64cc8dc  style(prototype): trim ready page benefit text
16210f2  refactor(prototype): redesign ready page with benefit-led copy
d2fbf8c  feat(prototype): ready-to-build confirmation page at /apps/[appId]/ready
363175c  feat(prototype): signup wizard page at /apps/[appId]/signup
68595aa  fix(prototype): separate ownership tooltip from EIN label tooltip
7ae8493  style(prototype): EIN cancel button and checkbox into card
9b8ed35  feat(prototype): EIN toggle, checkbox confirmation, trimmed failure state
a2b1e24  docs: D-320 — registration fee reduced to $49 flat
be28c5f  refactor(prototype): EIN as expandable toggle on business name page
922e2d8  feat(prototype): add EIN verification to business name wizard step
6c4b1e9  feat(prototype): phone verification wizard step at /start/verify
ca2fb7f  refactor(prototype): remove opt-in from wizard flow
a2415b2  style(prototype): fix dropdown chevron on details wizard step
31f50a0  style(prototype): update business name placeholder and body text
e1001b2  feat(prototype): add bottom Continue button to wizard messages page
6c3c662  fix(prototype): messages wizard Back links to /start/context
5b84561  feat(prototype): show vertical pill on wizard pages after picker
17a3738  fix(prototype): vertical picker navigates to /start/business
26be57d  feat(prototype): context wizard step at /start/context
0e29dc9  feat(prototype): website wizard step at /start/website
e605240  feat(prototype): service context wizard step at /start/details
6fc4c24  feat(prototype): business name wizard step at /start/business
cc45062  feat(prototype): shared wizard layout and step shell for /start
7c47e6c  feat(prototype): add body text to wizard messages page
3835a8d  feat(prototype): vertical picker page at /start
```

---

## What Was Completed

### End-to-end wizard flow
The full onboarding path now exists from scratch through to registration-pending dashboard:

```
/start  →  /start/business  →  /start/details  →  /start/website  →  /start/context  →  /start/verify
       →  /apps/glowstudio/messages  →  /apps/glowstudio/ready  →  /apps/glowstudio/signup
       →  (setRegistrationState("pending"))  →  /apps/glowstudio/overview
```

Back works at every step. Continue gating enforced per step. sessionStorage (`relaykit_wizard`) persists answers across pages so Back-navigation restores prior state.

### `/start/*` wizard entry flow — 6 new pages
- **`/start`** — Vertical picker. 8 cards in 2-col grid (Appointments, Verification codes, Order updates, Customer support, Marketing, Team alerts, Community, Waitlist). Card is click target — no CTA text. Saves `vertical` and advances.
- **`/start/business`** — Business name + optional EIN verification. EIN is expandable (brand-purple toggle link → inline form), two-phase verify spinner (`Verifying…` 1s → `Checking sources…` 1.5s), verified state shows auto-populated identity card with ✕ dismiss and "This is my business" checkbox (with its own account-termination tooltip). Marketing-primary locks the form open and requires verified EIN. Prototype state cycler (Default/Verified/Failed) for design review.
- **`/start/details`** — Industry dropdown (11 options) + vertical-specific service-type placeholder. Service input fades in after industry selection.
- **`/start/website`** — Optional URL input + Skip link.
- **`/start/context`** — Optional 4-row textarea + Skip link.
- **`/start/verify`** — Phone verification. +1 prefix, live-formatted phone input, Send code (1.5s stub), 6-digit OTP (auto-advance, paste, backspace), verified state card with Change link.

### Shared wizard infrastructure
- **`prototype/app/start/layout.tsx`** — min-h viewport wrapper.
- **`prototype/components/wizard-step-shell.tsx`** — reusable shell with Back link + children + full-width Continue. Pages pass `backHref`, `continueHref`, `canContinue`, `onBeforeContinue`.
- **`prototype/lib/wizard-storage.ts`** — sessionStorage under `relaykit_wizard`. `WizardData` fields: `vertical`, `businessName`, `industry`, `serviceType`, `website`, `context`, `verifiedPhone`, `ein`, `businessIdentity`. Exposes `VERTICAL_LABELS` for the nav pill.
- **`wizardFadeIn` keyframe** promoted to `globals.css` so `/start/business` and `/start/details` can share it.
- **TopNav** extended — wordmark-only on all `/start` and `/start/*`; vertical pill renders from sessionStorage on `/start/*` (not on the picker); wizard regex on `/apps/*` extended to `messages|ready|signup`.

### `/apps/[appId]/ready` — new page
- Heading "Skip the hard part" + body "Create a free account and start building."
- 5 CheckCircle benefit lines (space-y-7): bold lead + tertiary detail. Covers one-prompt onboarding, real-phone testing, AI assistant, zero-code message edits, compliance handled.
- Pricing: "Free while you build and test." (text-lg semibold) + "$49 registration + $19/mo" delivery line (per D-320).
- Full-width purple "Create account" CTA → `/signup`.

### `/apps/[appId]/signup` — new page
- Heading "Create your account" + body "Free while you build. $49 + $19/mo when you're ready for real delivery."
- Three states: email + Send code → OTP (6 digit boxes, any 6 digits work) → verified card + "Send me product updates" checkbox.
- Continue in WizardLayout header, controlled via new `WizardContinueContext` (disabled until verified; on click: sets `registrationState="pending"` and navigates to `/overview`).

### WizardLayout changes
- **`continueLabel`** field on `WizardPageConfig` so messages Continue reads "Start building" instead of "Continue" (both top-right and full-width bottom).
- **`WizardContinueContext`** lets pages register `{onClick, disabled}` to override the header Continue button.
- `getPageConfig` flow: messages → /ready (`continueLabel: "Start building"`, dualContinue); /ready → no header Continue (owns own CTA); /signup → no static continueHref (uses context override).

### Opt-in removal
- `/apps/[appId]/opt-in/page.tsx` now returns `null`; original implementation preserved in a reference comment.
- AppLayout redirects all `/opt-in` traffic to `/messages` in every state.
- TopNav wizard regex dropped `opt-in`.
- WizardLayout no longer has an opt-in branch.

### Messages page (wizard mode) updates
- Body text added below the "Messages" heading: "These are your messages — ready to use. Edit any message to match your voice." (Default state only.)
- Continue text changed to **"Start building"**, navigates to `/ready`.
- Bottom Continue is now full-width purple in the 540px column (was right-aligned compact).
- Back goes to `/start/context`.

### Decisions added
- **D-320** — Registration fee $49 flat. Single payment, no split, no go-live fee. $19/mo subscription unchanged. Supersedes D-314 ($99 flat) and original D-193/D-216 split.

---

## Quality Checks Passed

- `tsc --noEmit` — clean (prototype)
- `next build` — clean; all new routes static-rendered (`/start`, `/start/business`, `/start/details`, `/start/website`, `/start/context`, `/start/verify`) or dynamic (`/apps/[appId]/ready`, `/apps/[appId]/signup`).
- No ESLint config in prototype — tsc and build are the quality gates (documented baseline, unchanged).

---

## In Progress / Partially Done (Carried Forward)

### Signup backend is stubbed
Email validation is a client-side regex shape check. Send code is a 1.5s `setTimeout` stub. OTP accepts any 6 digits. Real magic-link backend is D-59.

### EIN verification backend is stubbed
Two-phase spinner (`Verifying…` → `Checking sources…`) is visual-only. Real EIN lookup + auto-populate is D-302/D-303 backend work.

### `/start/verify` phone OTP is stubbed
Any 6 digits work. Real integration is Twilio Verify (D-46).

### Pricing references still stale in several places
D-320 reduced the fee to $49 but the older $99 / $49+$150 references still appear in:
- `/apps/[appId]/overview` registration card
- `/apps/[appId]/register` and `/register/review`
- `/apps/[appId]/settings` billing section
- `/sms/[category]/messages` public pricing lines (may still reference $49 + $150 split)
- `/` marketing home (uses D-193 $49+$150 era copy)

D-320 copy is in place on `/ready` and `/signup`.

### `/start/verify` destination is hardcoded
Currently navigates to `/apps/glowstudio/messages`. In production, this would hit signup first (or create a draft app, then route to its messages workspace).

---

## Gotchas for Next Session

1. **Delete `.next` before every prototype dev server start.** API server (port 3002) has no `.next`.
2. **No ESLint config** in prototype — tsc + `next build` are the quality gates.
3. **The full wizard flow uses TWO different layout systems:**
   - `/start/*` pages use `WizardStepShell` (per-page component) inside `prototype/app/start/layout.tsx`.
   - `/apps/[appId]/{messages,ready,signup}` pages use `WizardLayout` (shared wrapper via AppLayout state check).
   Both render a 540px centered content column, but the Back/Continue chrome is delivered differently. When editing navigation behavior, pay attention to which system you're in.
4. **TopNav has three distinct modes** (see the regex + conditionals at the top of `top-nav.tsx`):
   - `/start` and `/start/*` → wordmark-only, with vertical pill on `/start/*`.
   - `/apps/*/messages|ready|signup` + `registrationState === "default"` → wordmark + Appointments pill + state switcher + Sign out.
   - Everything else → full marketing or dashboard nav.
   Adding new wizard pages means updating both the `/start` detection (if outside /apps/) and the wizard-nav regex (if inside /apps/).
5. **`WizardLayout.getPageConfig` is pathname-driven.** New wizard destinations under `/apps/[appId]/` need their own branch there.
6. **`WizardContinueContext`** is only meaningful to pages rendered under `WizardLayout`. It lets a page override the header Continue with `{onClick, disabled}`. Register inside a `useEffect` and `return () => setOverride(null)` on unmount.
7. **AppLayout safety redirects:**
   - `/opt-in` → `/messages` in every state.
   - `/ready` + `/signup` → `/overview` in non-wizard states.
   - `/overview` + `/settings` → `/messages` in wizard state.
   If you add a new wizard-only page under `/apps/[appId]/`, add the mirror redirect.
8. **Signup's state transition is racy-feeling but OK in practice.** On Continue, `setRegistrationState("pending")` fires synchronously with `router.push("/overview")`. React batches both. The AppLayout safety redirect from `/signup` → `/overview` in non-wizard state covers any transient render.
9. **Vertical pill on `/start/*`** reads from sessionStorage in a `useEffect`, so there's a brief flash where the wordmark renders without the pill on first paint. Prototype-acceptable.
10. **`wizardFadeIn` keyframe** lives in `globals.css`. Both `/start/business` (EIN expand) and `/start/details` (service type reveal) use it via inline `style={{ animation: "..." }}`. The duplicate styled-jsx global block in `/start/details` is redundant but harmless.
11. **EIN prototype state cycler** (Default/Verified/Failed) is a dev-only toggle — hide it when porting to production.
12. **Variant IDs are stable** (`standard`, `action-first`, `context-first`) even though labels are Standard / Friendly / Brief. Don't rename the IDs.
13. **`/apps/[appId]/opt-in/page.tsx`** is intentionally returning `null` — don't delete. The reference comment preserves the original implementation for future redesign.
14. **Public marketing page at `/sms/[category]/page.tsx`** has its own hardcoded variant data and pricing copy — separate from the in-app pills and from the new D-320 pricing.
15. **WORKSPACE_DESIGN_SPEC.md** has uncommitted changes that predate this session (staged before I started). Left untouched for PM review.
16. **Migrations 003 and 004 may not be applied to live DB.**
17. **Rate limiter is in-memory** — resets on server restart.

---

## Files Modified This Session

```
# Decisions & specs
DECISIONS.md                                              # MODIFIED — D-320 added
PROTOTYPE_SPEC.md                                         # MODIFIED — wizard entry flow + ready/signup sections
CC_HANDOFF.md                                             # This file (overwritten)

# Wizard entry flow (/start/*) — all NEW
prototype/app/start/layout.tsx                            # NEW — min-h wrapper
prototype/app/start/page.tsx                              # NEW — vertical picker
prototype/app/start/business/page.tsx                     # NEW — business name + EIN verification
prototype/app/start/details/page.tsx                      # NEW — industry + service type
prototype/app/start/website/page.tsx                      # NEW — optional URL
prototype/app/start/context/page.tsx                      # NEW — optional notes
prototype/app/start/verify/page.tsx                       # NEW — phone verification
prototype/components/wizard-step-shell.tsx                # NEW — shared wizard step wrapper
prototype/lib/wizard-storage.ts                           # NEW — sessionStorage helpers + VERTICAL_LABELS

# Wizard destination (/apps/[appId]/*)
prototype/app/apps/[appId]/ready/page.tsx                 # NEW — benefit-led pre-signup page
prototype/app/apps/[appId]/signup/page.tsx                # NEW — email + OTP + productUpdates
prototype/app/apps/[appId]/messages/page.tsx              # MODIFIED — wizard body text
prototype/app/apps/[appId]/opt-in/page.tsx                # MODIFIED — commented out, returns null
prototype/app/apps/[appId]/layout.tsx                     # MODIFIED — redirect /opt-in, /ready, /signup

# Shared components
prototype/components/wizard-layout.tsx                    # MODIFIED — continueLabel, WizardContinueContext,
                                                          #            /ready + /signup config, full-width
                                                          #            bottom Continue
prototype/components/top-nav.tsx                          # MODIFIED — /start wordmark-only, vertical pill,
                                                          #            wizard regex extended to ready|signup

# Global styles
prototype/app/globals.css                                 # MODIFIED — wizardFadeIn keyframe added
```

---

## What's Next (suggested order)

1. **Fix stale pricing copy across prototype** (D-320 — $49 flat + $19/mo). Touch points: overview registration card, register + register/review pages, settings billing section, `/sms/[category]/messages` public messages page, marketing home.
2. **Wire the EIN verification backend** (D-302, D-303) — replace the two-phase stub with real lookup + business-identity auto-populate.
3. **Wire signup to real magic-link backend** (D-59) — replace the email regex + OTP stub.
4. **Wire `/start/verify` phone OTP to Twilio Verify** (D-46) — real send code + verification.
5. **Phase 2.5: Error states design session** (per WORKSPACE_DESIGN_SPEC) — walk through all interaction failures (EIN verify, phone OTP, AI rewrite, compliance, network, signup OTP) before locking in copy.
6. **`/start/verify` destination** — decide whether it routes to signup first, or creates a draft app and routes to its messages workspace.
7. **Extract `OtpInput`** to a shared component — currently inlined in three places (`/start/verify`, `/apps/[appId]/signup`, `/apps/[appId]/overview`). Sign-in modal has its own variant. Low-risk cleanup.
8. **Ported production build** — when porting prototype screens to production, the new `/start/*` pages need their own production routes (the current `/start/*` routes are prototype-only since production `/` is the marketing page).
