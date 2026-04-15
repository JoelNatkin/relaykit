# CC_HANDOFF.md — Session Handoff
**Date:** 2026-04-14/15 (Settings rebuild to PRD v2.2 + three new decisions)
**Branch:** main (0 commits ahead of origin/main — pushed through `2075aeb`)

---

## Commits This Session (10)

```
2075aeb  docs: update Settings PRD to v2.2
6fa3cf2  fix(prototype): Extended Review label, Notifications section, test key prefix, remove test key regen
5549f36  fix(prototype): move Instructions toggle next to Ask Claude, rename label
12029c8  fix(prototype): EIN row consistent across all Settings states
dd3fe1d  fix(prototype): EIN edit affordance, billing cleanup, cancel modal friction
32097d8  fix(prototype): EIN toggle on Settings, Rejected card rewrite
3ff72b2  fix(prototype): Settings copy and layout polish (Phase 2)
f7172b6  feat(prototype): Settings h1, back link, Business Info with EIN (Phase 1)
857a389  docs: record account/app field split (D-347) and notification triggers (D-348)
78bd013  docs: elevate rate limiting from backlog to launch requirement (D-346)
```

Pushed to `origin/main`. Previous session's 14 unpushed commits (through `fde7bad`) went out during this session.

---

## What Was Completed

### Three new decisions (D-346, D-347, D-348)
- **D-346:** Rate limiting is a launch requirement, not backlog. The matching BACKLOG.md entry ("Advanced rate limiting with queue mode") was replaced with a pointer line. Quiet hours enforcement (D-309) is already bundled into the "Message pipeline refactor (pre-Sinch)" backlog item and required before Sinch integration — confirmed twice this session, no change needed.
- **D-347:** Account-level vs app-level field split. Email, auth phone, payment method are account-level (future avatar-dropdown settings page). Per-app Settings only shows app-scoped fields.
- **D-348:** Notification triggers — text (opt-in via toggle) vs email (always on) vs silent handling (rate limits, quiet hours, opt-outs, approaching cap).

### Settings page — full rebuild to PRD_SETTINGS v2.2
Single file: `prototype/app/apps/[appId]/settings/page.tsx`. Every section reworked to match the current PRD.

- **Page chrome:** Back link now uses app name ("← Back to GlowStudio") via an inline `APP_NAMES` map mirroring the Register page. Added `<h1>Settings</h1>` below the back link.
- **Business info:** Renamed from "Account info". Visible in every state. Building is editable (business name via inline `EditableField` with right-aligned Save/Cancel buttons); all post-reg states are read-only. Email and Personal phone rows removed entirely (D-347).
- **EIN row (consolidated into `EinRow` component):** Reads `hasEIN` from wizard sessionStorage (`loadWizardData().ein`) and listens to the `relaykit-ein-change` event — same source the messages page and the dashboard-layout top-bar EIN switcher use. With EIN: shows `••••••4567` everywhere; adds an "Edit" link in Building only. Without EIN: shows "Not on file" + "Add" link in every state. Cleaner and uniform.
- **Registration section:**
  - Pending: Status ("In review") + Submitted only. Removed Estimated review row and the "sandbox is fully active" sub-copy.
  - Extended Review: Status label now "In review" (same as Pending per PRD §3) with sub-copy "This is taking longer than usual. We'll email you at jen@glowstudio.com when there's an update."
  - Registered: removed Campaign ID row (carrier infrastructure, not developer-facing).
  - Rejected: full rewrite per PRD §5. Two plain-text lines ("Your registration wasn't approved. The business information provided didn't match public records." + support mailto). Removed "What was submitted" reference block, red "What happened" debrief box, refund line, "Start a new registration" link, "your sandbox is still active" line.
- **API keys:** Removed sub-copy ("Your AI coding tool reads this key…"). "SANDBOX" label → "TEST". Mock key string `rk_sandbox_rL7x9Kp2mWqYvBn4` → `rk_test_rL7x9Kp2mWqYvBn4`. Removed the never-wired regenerate-test-key modal state + JSX — test keys are re-displayable and don't need Regenerate.
- **Billing:** Removed the Plan row in Pending/Extended Review (showing "Test mode — Free" while they've paid $49 was confusing). Collapsed the two identical branches into `(isPending || isExtendedReview)`. "Sandbox — Free" → "Test mode — Free" everywhere. Cancel modal rewrote to a custom inline modal (not shared ConfirmModal): `bg-black/50` backdrop, "Type CANCEL to confirm" text input, "Cancel plan" button disabled until input strictly equals "CANCEL".
- **Notifications (new):** Added Section 5 at the bottom of the page, all states. Heading + "Get a text when something needs your attention." sub-copy. Toggle switch (same visual pattern as the Instructions toggle), off by default. When on: "Texts go to +1 (512) 555-0147" + "Change" brand link.

### Instructions toggle relocation
Moved out of the DashboardLayout header row and into the messages section header, immediately left of the Ask Claude button with a 24px gap. Label renamed "Setup instructions" → "Instructions". `useSetupToggle` state stays in DashboardLayout and flows to the page via `SetupToggleContext` — only the rendered control moved.

### Docs
- **PRD_SETTINGS_v2.2.md** — new file, 501 lines, supersedes v2.1. Added by Joel and committed as `2075aeb`.
- **DECISIONS.md** — three new entries (D-346, D-347, D-348).
- **BACKLOG.md** — rate limiting entry replaced with pointer line.

---

## Quality Checks Passed

- `tsc --noEmit` — clean (prototype)
- `next build` — clean, full production build ran
- No ESLint config in prototype — tsc and `next build` remain the quality gates (unchanged baseline)

---

## In Progress / Partially Done (Carried Forward)

### Backend stubs — unchanged from previous sessions
- Signup backend stubbed (D-59)
- EIN verification backend stubbed (D-302/D-303)
- Phone OTP stubbed (D-46)
- Marketing messages hardcoded for Appointments only
- Ask Claude panel chat composer is a non-functional stub
- Testers invite flow stubbed (1.5s "Sending…", no real OTP)
- Registered state metrics are mock data
- Marketing-only registration tracker transitions are prototype dropdowns

### New-ish this session
- Settings Notifications toggle has no backend wiring — just local `useState`.
- Cancel plan modal's destructive confirm is a close-modal no-op in the prototype.
- Live key Regenerate modal is still a no-op.
- Settings "Add EIN" / "Edit EIN" / "Change" (notification destination) links are all brand-styled no-ops.
- Account settings page referenced by D-347 and PRD §7 doesn't exist yet. The avatar dropdown it implies also doesn't exist. Per-app Settings no longer shows email/phone even though that page isn't built — acceptable per D-347's interim note.

---

## Gotchas for Next Session

1. **EIN on Settings is read from wizard sessionStorage, not the session-context `hasEIN` boolean.** The dashboard-layout top-bar switcher writes `data.ein` via `saveWizardData` and fires the `relaykit-ein-change` event. Settings subscribes. If you swap to a different storage layer or context flag later, update both the messages page (`prototype/app/apps/[appId]/page.tsx:184-194`) and Settings (`prototype/app/apps/[appId]/settings/page.tsx:225-233`) together — they're in lockstep.
2. **`EinRow` is a single component used for every state.** Prop surface is `hasEIN` + `editable`. The "Not on file / Add" branch always renders when `hasEIN === false`. If a future state should hide the row instead, add a `hidden` prop rather than re-introducing per-state JSX.
3. **Cancel plan modal is custom, not `ConfirmModal`.** Kept separate because it needs the text-input gate. `ConfirmModal` is still used for the Regenerate Live Key modal. Don't fold them back together unless you add body children support to `ConfirmModal`.
4. **Shared `APP_NAMES` is duplicated** in `dashboard-layout.tsx`, `register/page.tsx`, and `settings/page.tsx`. Getting worse. Extract to `lib/app-names.ts` before beta launch when a second app joins.
5. **Extended Review internal state is still `changes_requested`** — the developer-facing label is now "In review" (same as Pending). If you touch the state machine, remember the user never sees "Extended review" anymore.
6. **Instructions toggle lives on the messages page row now**, not in the DashboardLayout header. `useSetupToggle` hook still initializes in DashboardLayout and provides context; only the rendered `<SetupToggle>` moved. `SetupToggle` is imported in `page.tsx` alongside `SetupInstructions`.
7. **Notifications section toggle has no persistence.** In-component `useState` only — state resets on reload. Fine for the prototype; production needs `projects.sms_notifications_enabled`.
8. **`.next` + `node_modules` nuke is still the escalation** for the @untitledui vendor chunk error. Straight `.next` wipes usually work; if not, `rm -rf .next node_modules && npm install`.
9. **Prototype is in `/prototype`, not the root.** Always `cd prototype` first.
10. **Branch is fully pushed.** Starting point for the next session is clean `origin/main`.

---

## Files Modified This Session

```
# Decisions + docs
DECISIONS.md                                             # D-346, D-347, D-348 appended
BACKLOG.md                                               # rate limiting entry → pointer line
docs/PRD_SETTINGS_v2.2.md                                # NEW — supersedes v2.1
PROTOTYPE_SPEC.md                                        # Settings section rewritten; header-row + messages-header toggle spec updated; Last updated → April 15, 2026
CC_HANDOFF.md                                            # This file (overwritten)

# Settings rebuild
prototype/app/apps/[appId]/settings/page.tsx             # Full rework — h1, back link, Business Info, EIN row, Registration per state, API keys, Billing, Cancel modal, Notifications

# Instructions toggle relocation
prototype/components/dashboard-layout.tsx                # Removed SetupToggle render from header; dropped import
prototype/components/setup-instructions.tsx              # Label "Setup instructions" → "Instructions"
prototype/app/apps/[appId]/page.tsx                      # SetupToggle rendered in messages section header with gap-6 before Ask Claude; import updated; toggle destructured from context
```

---

## What's Next (suggested order)

1. **Account settings page** — build the page referenced by D-347. Needs email, auth phone, payment method, sign out, delete account. Route probably `/account`; entry point is a new avatar dropdown in the top nav.
2. **Wire Settings actions to real state** — notifications toggle → `projects.sms_notifications_enabled`; Cancel plan → Stripe subscription cancel-at-period-end; Regenerate live key → hash rotation; Edit EIN / Add EIN → open the EIN verification flow in a modal (the wizard-component-as-modal pattern noted in PRD §4.1).
3. **Registered — no EIN "Add" flow** — tapping Add should open the EIN verification flow and, on success, unlock the marketing upsell (same trigger the messages page already uses).
4. **Wire Ask Claude panel to real AI** — UI done; backend route + streaming display needed.
5. **Wire wizard data into setup instructions** — generate install command, API key, and prompt from sessionStorage business name + messages instead of hardcoded Club Woman content.
6. **Marketing messages for other verticals** — only Appointments has data.
7. **Wire signup to real magic-link backend** (D-59).
8. **Wire `/start/verify` phone OTP to Twilio Verify** (D-46).
9. **Wire EIN verification backend** (D-302, D-303).
10. **Extract `OtpInput`** to a shared component.
11. **Extract shared `APP_NAMES`** — dashboard-layout, register, settings currently duplicate.
12. **Error states design session** — walk through all interaction failures before locking in copy.
