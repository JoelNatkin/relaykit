# prototype/archive — RelayKit

Files removed from the active prototype across two dated waves. Preserved here as historical record. Source paths mirrored in this archive's directory structure so any file can be restored to its original location.

- **2026-05-13 — Bulk inventory archive.** Files removed following the prototype-inventory audit at [`audits/prototype-inventory-2026-05-13.md`](../../audits/prototype-inventory-2026-05-13.md). Detail in the body of this README below.
- **2026-05-14 — Marketing-surface migration.** Marketing-shaped surfaces moved out of the prototype so the prototype models `app.relaykit.ai` cleanly. Detail in the new section near the bottom of this README.

This directory lives outside the Next.js `app/` routing tree — archived route files do not compile as live routes from here.

## Un-archive procedure

```
git mv prototype/archive/<path> prototype/<path>
```

History is preserved across the move (git tracks the original `git mv` into this archive as a rename).

## What's in here, grouped by rationale

### Admin section (6 files) — operator tooling, out of launch scope

- `app/admin/layout.tsx`
- `app/admin/page.tsx`
- `app/admin/customers/page.tsx`
- `app/admin/customers/[customerId]/page.tsx`
- `app/admin/registrations/page.tsx`
- `app/admin/revenue/page.tsx`

### Old prototype marketing surfaces (2 files) — superseded by `/marketing-site/`

- `app/compliance/page.tsx`
- `app/sms/[category]/messages/page.tsx` — public messages page; playbook diagram and opt-in form sample were salvaged to the category landing page (`prototype/app/sms/[category]/page.tsx`) before this archive.

### Dead routes, redirects, stubs (4 files)

- `app/auth/page.tsx` — zero surviving callers; sign-in modal handles auth instead.
- `app/apps/[appId]/opt-in/page.tsx` — opt-in page was tabled per D-317; file was a redirect placeholder.
- `app/apps/[appId]/registration/page.tsx` — "Coming soon" stub.
- `app/apps/[appId]/messages/page.tsx` — back-compat redirect to `/apps/[appId]`; zero surviving callers as of archive date.

### `/registration-test` chain (3 files) — dev harness + orphan deps

- `app/registration-test/page.tsx` — standalone test harness for registration form components.
- `components/catalog/registration-scope.tsx` — only referenced by `/registration-test`.
- `lib/intake/campaign-type.ts` — only referenced by `registration-scope.tsx`.

### Plan-builder dead components (2 files) — both unreferenced

- `components/plan-builder/consent-preview.tsx`
- `components/plan-builder/preview-as-input.tsx`

### Unreferenced data + companions (4 files)

- `components/category-modal.tsx` — modal triggered from a category tile; no surviving caller.
- `components/category-tile.tsx` — no surviving caller.
- `data/categories.ts` — only consumed by the two components above; falls together.
- `data/docs.ts` — `BUILD_SPEC_CONTENT` template string; no surviving caller.

## Surviving-tree edits landed in the same commit

To resolve surviving references to archived routes, three small edits landed on the active tree alongside this archive move:

- `prototype/components/top-nav.tsx` — removed the Compliance nav item (its target `/compliance` is archived).
- `prototype/components/proto-nav-helper.tsx` — removed the "Opt-in (onboarding)" wizard nav pill (target route archived).
- `prototype/app/sms/[category]/page.tsx` — removed the "Browse messages" hero CTA and the "See all appointment messages" link below the style preview (target `/sms/[category]/messages` is archived; the salvage operation had already relocated the substantive content onto the landing page itself).

## What survived the audit

The active prototype retains the 16 user-facing routes plus their supporting tree. The marketing home (`prototype/app/page.tsx`, route `/`) was flagged by the 2026-05-13 audit as a candidate for archive but retained because removing it would break the wordmark and breadcrumb links from `top-nav.tsx` and `/sms/[category]/page.tsx`. **Resolution:** the 2026-05-14 marketing-surface migration (below) repointed those links and archived both files.

## Pre-existing drift noticed during the audit (not addressed by this archive)

`prototype/components/proto-nav-helper.tsx` and `docs/PROTOTYPE_SPEC.md` both reference `/apps/[appId]/overview`, but `prototype/app/apps/[appId]/overview/page.tsx` does not exist on disk. Flagged for a separate cleanup.

---

## 2026-05-14 — Marketing-surface migration

The prototype's marketing-shaped surfaces (the home page at `/` and the dynamic category landing at `/sms/[category]`) were retired so the prototype models its production role — `app.relaykit.ai`, the post-signup workspace — without doing double duty as a thin marketing site. Production marketing lives in the separate `/marketing-site/` Next.js app at `relaykit.ai`.

### Files archived (4)

- `app/page.tsx` — old 522-LOC marketing home. Replaced in the active tree by an auth-aware redirect (logged-in → `/apps`, logged-out → `/sign-in`).
- `app/sms/[category]/page.tsx` — dynamic category landing (438 LOC; appointments-only content with placeholder fallback for other categories).
- `components/playbook-flow.tsx` — `PlaybookSummary` + `PLAYBOOK_FLOWS` (114 LOC). The only consumer was the archived `/sms/[category]/page.tsx`. A copy of this file landed in `/marketing-site/components/playbook-flow.tsx` for future Phase 2a (D-384) consumption; dormant on the marketing-site side.
- `components/catalog/catalog-opt-in.tsx` — `CatalogOptIn` opt-in form sample (116 LOC). Same disposition: copied to `/marketing-site/components/catalog/catalog-opt-in.tsx` (dormant), with one small departure — the prototype's local `Message` type and an unused `website`/`displayUrl` pair were inlined / dropped so MS's stricter eslint stays clean.

### Surviving-tree edits landed in the same lift

- `prototype/components/top-nav.tsx` — removed the Use Cases dropdown (`USE_CASE_ITEMS`, `useCasesOpen` state, document-mousedown handler, dropdown JSX), removed the Sign in modal trigger + `SignInModal` import + `showSignIn` state + the `<SignInModal />` render, simplified the wordmark from conditional `href={isLoggedIn ? "/apps" : "/"}` to unconditional `href="/apps"`, and retargeted `handleSignOut` from `router.push("/")` to `router.push("/sign-in")`.
- `prototype/app/apps/page.tsx` — auth-guard redirect target `/sign-in` instead of `/`.
- `prototype/app/page.tsx` (new file at the formerly-archived path) — auth-aware redirect (logged-in → `/apps`, logged-out → `/sign-in`).
- `prototype/app/sign-in/page.tsx` (new route) — placeholder sign-in landing. Reuses the email→OTP form content from `prototype/components/sign-in-modal.tsx`, wrapped in a standalone page layout. Pending the future auth refactor (Supabase social providers, UI redesign) which will retire both the placeholder page and the dormant `SignInModal` component together.
- `prototype/components/sign-in-modal.tsx` — left in place untouched. Unimported after the lift; awaiting the auth refactor.

### What's *not* in this lift

- **No additions to marketing-site beyond the two preserved components.** No `/sms/` routes on the marketing-site, no Use Cases dropdown, no `/sign-in` route. Per PM/Joel alignment, full marketing-site category pages wait for Phase 2a content authoring (D-384) to deliver real per-category content; building category surfaces now would ship placeholders.
- **No auth refactor.** `/sign-in` is a placeholder. Supabase social providers, OTP UI redesign, and consolidation between `/sign-in` and the dormant `SignInModal` belong to a future workstream.
- **`/start/*` wizard surfaces unchanged.** The wordmark in the `/start` nav still targets `/`, which now redirects to `/sign-in` for logged-out users mid-onboarding. Defensible (exits onboarding to sign in) but slightly unusual; flagged here in case it gets revisited later.
