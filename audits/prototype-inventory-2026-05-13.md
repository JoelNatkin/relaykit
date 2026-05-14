# Prototype inventory — 2026-05-13

Read-only inventory of `/prototype/`. No analysis or recommendation — pure triage material for PM + Joel walkthrough.

**Excludes:** `node_modules/`, `.next/`, hidden dirs, and image assets (note: `prototype/public/` exists but contains only image assets).

## Section 1 — Tree view

```
prototype/app/account/page.tsx
prototype/app/admin/customers/[customerId]/page.tsx
prototype/app/admin/customers/page.tsx
prototype/app/admin/layout.tsx
prototype/app/admin/page.tsx
prototype/app/admin/registrations/page.tsx
prototype/app/admin/revenue/page.tsx
prototype/app/apps/[appId]/get-started/page.tsx
prototype/app/apps/[appId]/layout.tsx
prototype/app/apps/[appId]/messages/page.tsx
prototype/app/apps/[appId]/opt-in/page.tsx
prototype/app/apps/[appId]/page.tsx
prototype/app/apps/[appId]/ready/page.tsx
prototype/app/apps/[appId]/register/page.tsx
prototype/app/apps/[appId]/register/review/page.tsx
prototype/app/apps/[appId]/registration/page.tsx
prototype/app/apps/[appId]/settings/page.tsx
prototype/app/apps/[appId]/signup/page.tsx
prototype/app/apps/[appId]/signup/verify/page.tsx
prototype/app/apps/page.tsx
prototype/app/auth/page.tsx
prototype/app/compliance/page.tsx
prototype/app/globals.css
prototype/app/layout.tsx
prototype/app/page.tsx
prototype/app/registration-test/page.tsx
prototype/app/sms/[category]/messages/page.tsx
prototype/app/sms/[category]/page.tsx
prototype/app/start/business/page.tsx
prototype/app/start/context/page.tsx
prototype/app/start/details/page.tsx
prototype/app/start/layout.tsx
prototype/app/start/page.tsx
prototype/app/start/verify/page.tsx
prototype/app/start/website/page.tsx
prototype/components/ask-claude-panel.tsx
prototype/components/catalog/catalog-card.tsx
prototype/components/catalog/catalog-opt-in.tsx
prototype/components/catalog/custom-message-card.tsx
prototype/components/catalog/message-action-modal.tsx
prototype/components/catalog/registration-scope.tsx
prototype/components/category-modal.tsx
prototype/components/category-tile.tsx
prototype/components/copy-button.tsx
prototype/components/dashboard-layout.tsx
prototype/components/edit-business-details-modal.tsx
prototype/components/ein-inline-verify.tsx
prototype/components/footer.tsx
prototype/components/plan-builder/consent-preview.tsx
prototype/components/plan-builder/preview-as-input.tsx
prototype/components/playbook-flow.tsx
prototype/components/proto-nav-helper.tsx
prototype/components/registration/business-details-form.tsx
prototype/components/registration/review-confirm.tsx
prototype/components/setup-instructions.tsx
prototype/components/sign-in-modal.tsx
prototype/components/test-phones-card.tsx
prototype/components/top-nav.tsx
prototype/components/wizard-layout.tsx
prototype/components/wizard-step-shell.tsx
prototype/context/session-context.tsx
prototype/context/setup-toggle-context.tsx
prototype/data/categories.ts
prototype/data/docs.ts
prototype/data/messages.ts
prototype/lib/catalog-helpers.ts
prototype/lib/editor/message-editor.tsx
prototype/lib/editor/template-serde.ts
prototype/lib/editor/variable-node-view.tsx
prototype/lib/editor/variable-node.ts
prototype/lib/intake/campaign-type.ts
prototype/lib/intake/industry-gating.ts
prototype/lib/intake/templates.ts
prototype/lib/intake/use-case-data.ts
prototype/lib/intake/validation.ts
prototype/lib/slug.ts
prototype/lib/variable-scope.ts
prototype/lib/variable-token.ts
prototype/lib/wizard-storage.ts
prototype/middleware.ts
prototype/next-env.d.ts
prototype/next.config.ts
prototype/package-lock.json
prototype/package.json
prototype/tsconfig.json
```


## Section 2 — File table

| Path | Type | Last touched | Refers to / Referenced by | In SPEC? | Purpose |
|------|------|--------------|---------------------------|----------|---------|
| `prototype/app/account/page.tsx` | page | 2026-04-17 | ROUTE: /account | yes | Account settings page (logged-in). |
| `prototype/app/admin/customers/[customerId]/page.tsx` | page | 2026-04-08 | ROUTE: /admin/customers/[customerId] | yes | Admin per-customer detail view. |
| `prototype/app/admin/customers/page.tsx` | page | 2026-03-25 | ROUTE: /admin/customers | yes | Admin customers list / table. |
| `prototype/app/admin/layout.tsx` | layout | 2026-03-25 | ROUTE: /admin | yes | Admin section layout with side nav. |
| `prototype/app/admin/page.tsx` | page | 2026-03-25 | ROUTE: /admin | yes | Admin Control Room overview dashboard. |
| `prototype/app/admin/registrations/page.tsx` | page | 2026-03-25 | ROUTE: /admin/registrations | yes | Admin registrations list / pipeline. |
| `prototype/app/admin/revenue/page.tsx` | page | 2026-03-25 | ROUTE: /admin/revenue | no | Admin revenue stub ('Coming soon'). |
| `prototype/app/apps/[appId]/get-started/page.tsx` | page | 2026-04-21 | ROUTE: /apps/[appId]/get-started | yes | Per-app get-started page with copy-able snippets. |
| `prototype/app/apps/[appId]/layout.tsx` | layout | 2026-04-14 | ROUTE: /apps/[appId] | yes | Per-app layout: chooses Wizard vs Dashboard shell by state. |
| `prototype/app/apps/[appId]/messages/page.tsx` | page | 2026-04-14 | ROUTE: /apps/[appId]/messages | no | Back-compat redirect: /apps/[appId]/messages -> /apps/[appId]. |
| `prototype/app/apps/[appId]/opt-in/page.tsx` | page | 2026-04-05 | ROUTE: /apps/[appId]/opt-in | yes | Tabled opt-in page (D-317) — redirects to /messages. |
| `prototype/app/apps/[appId]/page.tsx` | page | 2026-04-30 | ROUTE: /apps/[appId] | yes | Per-app workspace home (catalog + custom messages + monitor). |
| `prototype/app/apps/[appId]/ready/page.tsx` | page | 2026-04-06 | ROUTE: /apps/[appId]/ready | yes | Per-app post-onboarding 'ready' confirmation screen. |
| `prototype/app/apps/[appId]/register/page.tsx` | page | 2026-04-14 | ROUTE: /apps/[appId]/register | yes | Per-app carrier-registration form. |
| `prototype/app/apps/[appId]/register/review/page.tsx` | page | 2026-03-25 | ROUTE: /apps/[appId]/register/review | yes | Per-app registration review/confirm step. |
| `prototype/app/apps/[appId]/registration/page.tsx` | page | 2026-03-16 | ROUTE: /apps/[appId]/registration | no | Per-app registration status stub ('Coming soon'). |
| `prototype/app/apps/[appId]/settings/page.tsx` | page | 2026-04-16 | ROUTE: /apps/[appId]/settings | yes | Per-app settings page. |
| `prototype/app/apps/[appId]/signup/page.tsx` | page | 2026-04-06 | ROUTE: /apps/[appId]/signup | yes | Per-app signup (email entry). |
| `prototype/app/apps/[appId]/signup/verify/page.tsx` | page | 2026-04-06 | ROUTE: /apps/[appId]/signup/verify | yes | Per-app signup OTP verify step. |
| `prototype/app/apps/page.tsx` | page | 2026-04-14 | ROUTE: /apps | yes | Apps list page (logged-in landing). |
| `prototype/app/auth/page.tsx` | page | 2026-04-14 | ROUTE: /auth | no | Auth gate: email → magic-link → app-name → phone → download. |
| `prototype/app/compliance/page.tsx` | page | 2026-03-27 | ROUTE: /compliance | yes | Public compliance page (marketing-site). |
| `prototype/app/globals.css` | other | 2026-04-19 | imported by app/layout.tsx (CSS) | yes | Tailwind v4 theme + Untitled UI semantic color tokens. |
| `prototype/app/layout.tsx` | layout | 2026-04-04 | ROUTE: / | no | Root layout: SessionProvider + TopNav + ProtoNavHelper. |
| `prototype/app/page.tsx` | page | 2026-04-08 | ROUTE: / | yes | Public marketing-site home page. |
| `prototype/app/registration-test/page.tsx` | page | 2026-03-24 | ROUTE: /registration-test | yes | Standalone harness to test registration form components. |
| `prototype/app/sms/[category]/messages/page.tsx` | page | 2026-05-13 | ROUTE: /sms/[category]/messages | yes | Per-category public messages page (slated for archive). |
| `prototype/app/sms/[category]/page.tsx` | page | 2026-05-13 | ROUTE: /sms/[category] | yes | Per-category public landing page (hybrid docs/info). |
| `prototype/app/start/business/page.tsx` | page | 2026-04-09 | ROUTE: /start/business | yes | Onboarding step: business details, EIN entry. |
| `prototype/app/start/context/page.tsx` | page | 2026-04-06 | ROUTE: /start/context | yes | Onboarding step: business context / description. |
| `prototype/app/start/details/page.tsx` | page | 2026-04-05 | ROUTE: /start/details | yes | Onboarding step: industry + use-case fields. |
| `prototype/app/start/layout.tsx` | layout | 2026-04-05 | ROUTE: /start | yes | Onboarding wizard section layout. |
| `prototype/app/start/page.tsx` | page | 2026-04-05 | ROUTE: /start | yes | Onboarding wizard entry (category picker). |
| `prototype/app/start/verify/page.tsx` | page | 2026-04-26 | ROUTE: /start/verify | yes | Onboarding step: phone verify (OTP). |
| `prototype/app/start/website/page.tsx` | page | 2026-04-06 | ROUTE: /start/website | yes | Onboarding step: website URL. |
| `prototype/components/ask-claude-panel.tsx` | component | 2026-04-12 | /apps/[appId] | yes | AskClaude slideout panel ('focused on' message support). |
| `prototype/components/catalog/catalog-card.tsx` | component | 2026-04-19 | /apps/[appId], /sms/[category]/messages | yes | Per-message catalog card (editor + activity). |
| `prototype/components/catalog/catalog-opt-in.tsx` | component | 2026-04-05 | /apps/[appId]/opt-in, /sms/[category]/messages, /sms/[category] | yes | Opt-in form sample (consent label + fine print). |
| `prototype/components/catalog/custom-message-card.tsx` | component | 2026-04-19 | /apps/[appId] | yes | Custom-message variant of CatalogCard. |
| `prototype/components/catalog/message-action-modal.tsx` | component | 2026-04-19 | /apps/[appId] | yes | Generic modal for message-card actions (default + destructive). |
| `prototype/components/catalog/registration-scope.tsx` | component | 2026-03-24 | /registration-test | yes | Use-case scope UI block (included / expansion lists). |
| `prototype/components/category-modal.tsx` | component | 2026-03-16 | (unreferenced) | yes | Modal launched from a category tile (marketing-site). |
| `prototype/components/category-tile.tsx` | component | 2026-03-09 | (unreferenced) | no | Single category card used on home / start. |
| `prototype/components/copy-button.tsx` | component | 2026-03-27 | /apps/[appId]/settings | yes | Reusable copy-to-clipboard button (icon swap on success). |
| `prototype/components/dashboard-layout.tsx` | component | 2026-04-19 | /apps/[appId] | yes | Logged-in workspace layout shell (post-registration). |
| `prototype/components/edit-business-details-modal.tsx` | component | 2026-04-19 | components/dashboard-layout.tsx | no | Prototype-only dev modal: change biz-name + service-type live. |
| `prototype/components/ein-inline-verify.tsx` | component | 2026-04-09 | /apps/[appId] | yes | Inline EIN entry / verify widget. |
| `prototype/components/footer.tsx` | component | 2026-03-27 | /compliance, /sms/[category]/messages, /sms/[category] | yes | Marketing-site footer (Product + Legal links). |
| `prototype/components/plan-builder/consent-preview.tsx` | component | 2026-03-09 | (unreferenced) | no | Consent-text preview block (plan-builder feature). |
| `prototype/components/plan-builder/preview-as-input.tsx` | component | 2026-03-09 | (unreferenced) | no | 'Preview as' input for the plan-builder. |
| `prototype/components/playbook-flow.tsx` | component | 2026-05-13 | /sms/[category]/messages, /sms/[category] | no | Shared PlaybookSummary workflow diagram (extracted Session 87). |
| `prototype/components/proto-nav-helper.tsx` | component | 2026-04-14 | / | yes | Dev-only nav helper: jump to registration-state shortcuts. |
| `prototype/components/registration/business-details-form.tsx` | component | 2026-03-25 | /apps/[appId]/register, /registration-test | yes | Shared business-details form (Zod-validated). |
| `prototype/components/registration/review-confirm.tsx` | component | 2026-04-08 | /apps/[appId]/register/review, /registration-test | yes | Registration review / confirm step component. |
| `prototype/components/setup-instructions.tsx` | component | 2026-04-21 | /apps/[appId], components/dashboard-layout.tsx | yes | Setup-instructions block + setup-toggle hook export. |
| `prototype/components/sign-in-modal.tsx` | component | 2026-03-27 | components/top-nav.tsx | yes | Sign-in modal (email → OTP, two-step). |
| `prototype/components/test-phones-card.tsx` | component | 2026-04-19 | /apps/[appId] | yes | Verified-test-phones management card. |
| `prototype/components/top-nav.tsx` | component | 2026-04-19 | / | yes | Top navigation bar (logged-out + logged-in variants). |
| `prototype/components/wizard-layout.tsx` | component | 2026-04-30 | /apps/[appId] | yes | Wizard layout shell (back/continue navigation context). |
| `prototype/components/wizard-step-shell.tsx` | component | 2026-04-06 | /start/business, /start/context, /start/details, +2 more | yes | Generic wrapper for each wizard step (back + continue). |
| `prototype/context/session-context.tsx` | context | 2026-04-19 | /apps/[appId]/get-started, /apps/[appId], /apps/[appId]/opt-in, +19 more | yes | SessionProvider: logged-in state, app state, custom messages. |
| `prototype/context/setup-toggle-context.tsx` | context | 2026-04-11 | /apps/[appId], components/dashboard-layout.tsx | no | Context for setup-instructions visibility toggle. |
| `prototype/data/categories.ts` | data | 2026-03-09 | components/category-modal.tsx, components/category-tile.tsx | yes | Category metadata (id, label, icon, description). |
| `prototype/data/docs.ts` | data | 2026-03-08 | (unreferenced) | no | BUILD_SPEC_CONTENT — long-form build-spec doc template string. |
| `prototype/data/messages.ts` | data | 2026-04-18 | /apps/[appId]/opt-in, /apps/[appId], /sms/[category]/messages, +7 more | yes | Message catalog data (MESSAGES, CATEGORY_VARIANTS, Message type). |
| `prototype/lib/catalog-helpers.ts` | lib | 2026-04-19 | /sms/[category]/messages, catalog/catalog-card.tsx, catalog/custom-message-card.tsx, +3 more | yes | Catalog interpolation / example-values helpers. |
| `prototype/lib/editor/message-editor.tsx` | lib | 2026-04-18 | catalog/catalog-card.tsx, catalog/custom-message-card.tsx | yes | Tiptap-based message editor component. |
| `prototype/lib/editor/template-serde.ts` | lib | 2026-04-18 | editor/message-editor.tsx | yes | Template string ↔ Tiptap doc serializer. |
| `prototype/lib/editor/variable-node-view.tsx` | lib | 2026-04-18 | editor/variable-node.ts | no | Tiptap NodeView for variable-token rendering. |
| `prototype/lib/editor/variable-node.ts` | lib | 2026-04-18 | editor/message-editor.tsx, editor/variable-node-view.tsx | yes | Tiptap Node definition for variable tokens. |
| `prototype/lib/intake/campaign-type.ts` | lib | 2026-03-24 | catalog/registration-scope.tsx | yes | Use-case → TCR campaign-type defaults. |
| `prototype/lib/intake/industry-gating.ts` | lib | 2026-03-24 | registration/business-details-form.tsx | yes | Industry-tier gating (advisory / decline). |
| `prototype/lib/intake/templates.ts` | lib | 2026-03-24 | registration/review-confirm.tsx | no | Template generation for carrier registration submissions. |
| `prototype/lib/intake/use-case-data.ts` | lib | 2026-03-24 | /apps/[appId]/register, /apps/[appId]/register/review, /registration-test, +7 more | no | USE_CASES definitions (included + expansion scope). |
| `prototype/lib/intake/validation.ts` | lib | 2026-03-25 | /apps/[appId]/register, /registration-test, registration/business-details-form.tsx, +1 more | no | Zod schemas for business-details validation. |
| `prototype/lib/slug.ts` | lib | 2026-04-19 | context/session-context.tsx | yes | generateSlug — collision-safe slug for custom messages (D-351). |
| `prototype/lib/variable-scope.ts` | lib | 2026-04-18 | catalog/catalog-card.tsx, catalog/custom-message-card.tsx | no | getVariableScope — per-method insertable-variable derivation (D-353). |
| `prototype/lib/variable-token.ts` | lib | 2026-04-18 | /sms/[category]/messages, /sms/[category], catalog/catalog-card.tsx, +2 more | yes | VARIABLE_TOKEN_CLASSES — shared styling for variable-token glyphs (D-350). |
| `prototype/lib/wizard-storage.ts` | lib | 2026-04-05 | /apps/[appId], /apps/[appId]/settings, /start/business, +7 more | yes | sessionStorage helpers for wizard data (key: relaykit_wizard). |
| `prototype/middleware.ts` | other | 2026-03-09 | (Next.js edge-middleware entry point) | no | Edge middleware: strips cookies to avoid 431 on localhost. |
| `prototype/next-env.d.ts` | config | — (untracked) | — | no | Next.js auto-generated type references. |
| `prototype/next.config.ts` | config | 2026-03-08 | — | no | Next.js config (empty). |
| `prototype/package-lock.json` | config | 2026-04-18 | — | no | npm lockfile. |
| `prototype/package.json` | config | 2026-04-18 | — | no | npm manifest; scripts: dev (port 3001), build. |
| `prototype/tsconfig.json` | config | 2026-03-08 | — | no | TypeScript config (strict, @/* path alias). |


## Section 3 — Counts

- Total files: 85
- In SPEC: 62
- (unreferenced) components / lib / data / context: 5  (potential orphans worth flagging)
