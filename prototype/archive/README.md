# prototype/archive — RelayKit

Files removed from the active prototype on 2026-05-13 following the prototype-inventory audit at [`audits/prototype-inventory-2026-05-13.md`](../../audits/prototype-inventory-2026-05-13.md). Preserved here as historical record. Source paths mirrored in this archive's directory structure so any file can be restored to its original location.

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

The active prototype retains the 16 user-facing routes plus their supporting tree. The marketing home (`prototype/app/page.tsx`, route `/`) was flagged by the audit as a candidate for archive but retained because removing it would break the wordmark and breadcrumb links from `top-nav.tsx` and `/sms/[category]/page.tsx`. Replace or repoint those links first before any future archive of the marketing home.

## Pre-existing drift noticed during the audit (not addressed by this archive)

`prototype/components/proto-nav-helper.tsx` and `docs/PROTOTYPE_SPEC.md` both reference `/apps/[appId]/overview`, but `prototype/app/apps/[appId]/overview/page.tsx` does not exist on disk. Flagged for a separate cleanup.
