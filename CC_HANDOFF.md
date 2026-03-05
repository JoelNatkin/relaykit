# CC_HANDOFF.md — Dashboard Path + Industry Gating Complete

## Status

**PRD_01 Addendum (Dashboard Path) + D-49 Industry Gating: COMPLETE (all 7 tasks).**

Path 2 (dashboard → intake wizard) is fully wired: Screen 1 skip, Screen 1b confirmatory mode, Screen 2 email pre-fill, Screen 3 dashboard-curated messages (read-only), checkout payload includes `source` + `selected_messages`, sessionStorage cleanup on payment success.

Three-tier industry gating on Screen 2: Tier 1 advisory (legal, financial, restaurants), Tier 2 hard decline + waitlist (healthcare), Tier 3 hard decline (cannabis, firearms).

**Previous builds: PRD_05 Deliverable Generator COMPLETE. PRD_06 Dashboard COMPLETE.**

## This Session's Commits (oldest → newest)

| Hash | Task | Description |
|------|------|-------------|
| `5f23b6e` | 1 | Three-tier industry gating config + detection (D-49) |
| `0a53675` | 2 | Industry gate alert UI on Screen 2 business details |
| `fd924fc` | 3 | Path 2 redirect — skip Screen 1 from dashboard |
| `1df36e8` | 4 | Screen 1b confirmatory mode for dashboard path |
| `9c370c3` | 5 | Screen 2 email pre-fill + path forwarding |
| `1fd2b03` | 6 | Screen 3 dashboard messages + read-only preview |
| `4760124` | 7 | sessionStorage cleanup on payment redirect |

## Files Created This Session

```
src/lib/intake/industry-gating.ts              # detectIndustryGate() — three-tier keyword detection
src/components/intake/industry-gate-alert.tsx   # IndustryGateAlert — tier-specific UI cards
src/components/dashboard/intake-cleanup.tsx     # IntakeCleanup — clears sessionStorage post-payment
```

## Files Modified This Session

```
src/app/start/page.tsx                          # Path 2 redirect to /start/scope
src/app/start/scope/page.tsx                    # Confirmatory copy, pre-populated expansions, back→dashboard
src/app/start/details/page.tsx                  # Email pre-fill, path=dashboard forwarding
src/app/start/review/page.tsx                   # Dashboard messages, source/selected_messages in checkout
src/components/intake/business-details-form.tsx # Industry gate detection + alert rendering
src/components/intake/review-preview-card.tsx   # dashboardMessages prop, D-17 timing fix
src/app/dashboard/layout.tsx                    # IntakeCleanup component mounted in Suspense
```

## Files Modified but Not Yet Committed

```
DECISIONS.md    — D-51 appended (RelayKit platform ToS/AUP required before beta)
CC_HANDOFF.md   — this file
```

## Decisions Made This Session

- **D-51 — RelayKit platform ToS/AUP required before beta.** Separate from per-customer ToS (PRD_02). Must cover: prohibited use categories (cannabis, firearms, healthcare without BAA, SHAFT-C), right to suspend/terminate, right to block messages inline, no refund on setup fee for policy violations. Beta blocker. Affects: new docs, PRD_01 checkout screen (acceptance checkbox), landing page footer.

## Gotchas for Next Session

1. **`path=dashboard` URL param is the Path 2 signal** — threaded through all 4 wizard screens via URL params. If you rename it, update `/start/page.tsx`, `/start/scope/page.tsx`, `/start/details/page.tsx`, and `/start/review/page.tsx`.

2. **Industry gate detection runs on every keystroke** in `business_description` and `service_type` fields. The regex matching is fast, but if performance becomes a concern, add debounce in `updateField()` inside `business-details-form.tsx`.

3. **Industry gate blocks `onValid()` for tier 2/3** — the form's Continue button is disabled via the existing `onInvalid()` callback. Gate check runs before Zod validation in `updateField()`, so a blocked industry prevents the form from ever reporting valid.

4. **Tier 2 waitlist CTA is a mailto link** (`hello@relaykit.co`). Replace with a proper waitlist form when one exists.

5. **D-17 fix applied** — `review-preview-card.tsx` "What happens next" section now says "2–3 weeks" (was incorrectly "3–10 days"). This was a pre-existing violation found and fixed during this build.

6. **`DashboardToIntakeData` type and helpers already existed** at `src/lib/dashboard/dashboard-to-intake.ts` — built during PRD_06. Functions: `buildIntakeData()`, `saveDashboardIntakeData()`, `getDashboardIntakeData()`, `clearDashboardIntakeData()`.

7. **Screen 3 checkout payload** now includes `source: 'cold' | 'dashboard'` and optional `selected_messages` + `preferred_area_code`. The `/api/checkout` route currently ignores unknown fields (no strict validation). When you build the checkout handler properly, add these to the request schema.

8. **Area code selector (PRD_01 Addendum Section 4.4) is NOT built yet.** The addendum specifies a simple "That's perfect / Different area code" UI on Screen 3 for both paths. `preferred_area_code` is already passed through in the checkout payload from dashboard data, but the UI component doesn't exist.

9. **D-51 (platform ToS/AUP) is a beta blocker.** The checkout screen needs a ToS acceptance checkbox before going live. Not built — decision only.

10. **Untracked files:** `docs/plans/2026-03-05-deliverable-generator.md` — previous session's working plan, not committed.

## Carried Forward from Prior Sessions

- **`sandboxMessageCount` hardcoded to 0** in `layout.tsx`. Needs PRD_09.
- **Post-registration `phoneVerified` hardcoded to `false`** — only pre-registration branch reads metadata.
- **Compliance site link is `href="#"` placeholder** in `compliance/page.tsx`.
- **Compliance `hasAlerts` always false** — no drift detection until PRD_08.
- **Email templates not wired to sending** — `src/lib/emails/templates.ts` returns `{ subject, body }`. Need provider.
- **D-44 pattern is load-bearing** — pre-registration user metadata used by: use-case selector, message plan builder, build spec generator, sandbox API key, phone verification.
- **`TWILIO_VERIFY_SID` env var required** for phone verification.
- **Button uses `onClick` not `onPress`** — Untitled UI extends HTML button.
- **3 API routes still missing** (`/api/live-key`, `/api/usage`, `/api/registration-details`) — need PRD_09 infrastructure.
- **sendSMS() signature is load-bearing across two templates** — `build-spec-template.ts` and `template-relaykit.ts` must stay identical (PRD_05 Trap #6).
