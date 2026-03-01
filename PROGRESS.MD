# RelayKit Build Progress

## Completed
- [x] Project scaffolding (Untitled UI starter kit + Supabase/Stripe/Twilio deps)
- [x] Screen 1: Use Case Selection (`/start`) — 8 tiles, single select, Continue button
- [x] Screen 1b: Use Case Advisory (`/start/scope`) — included/not-included sections, expansion checkboxes (non-promo pre-checked), campaign type upgrade logic
- [x] Screen 2: Business Details (`/start/details`) — Zod validation, conditional EIN/business type fields, use-case-specific fields, inline validation on blur, context-aware error messages, dynamic placeholder examples
- [x] Screen 3: Review & Confirm (`/start/review`) — two-column layout, details summary card with edit link, generated preview with inline-editable campaign description and sample messages, template generator, compliance slug
- [x] sessionStorage persistence fix — BusinessDetailsForm now handles late-arriving initialValues from useEffect hydration; review page waits for session load before showing error state; scope page moved saveIntakeSession out of render path into useEffect
- [x] Database schema — `supabase/migrations/20260301000000_stripe_checkout_schema.sql` applied to Supabase. Tables: `intake_sessions` (ephemeral checkout bridge, 24h TTL), `customers` (all intake fields + stripe_customer_id, stripe_subscription_id, subscription_status), `registrations` (10DLC lifecycle tracking with Twilio SIDs), `message_usage` (per-customer per-billing-period counters). Includes `update_updated_at()` trigger on all persistent tables.
- [x] Stripe Checkout route — `POST /api/checkout` (`src/app/api/checkout/route.ts`): Zod validation, duplicate email check, stores intake in `intake_sessions`, creates Stripe Checkout Session in `subscription` mode with one-time $199 setup fee + $19/mo recurring, `payment_method_collection: "always"`, metadata links back to intake session
- [x] Stripe Webhook route — `POST /api/webhooks/stripe` (`src/app/api/webhooks/stripe/route.ts`): signature verification, handles `checkout.session.completed` (creates customer + registration records, cleans up intake session), `invoice.payment_failed` (marks past_due), `customer.subscription.deleted` (marks churned). TODOs left for: artifact pipeline trigger, email notifications, Twilio messaging service pause.
- [x] Frontend checkout wiring — Review page modal "Everything looks good" button calls `/api/checkout`, shows loading spinner via `isLoading`/`showTextWhileLoading`, displays inline error on failure, redirects to Stripe hosted checkout on success
- [x] Server client helpers — `src/lib/stripe.ts` (Stripe SDK factory), `src/lib/supabase.ts` (Supabase service-role client factory)
- [x] Environment setup — Stripe price IDs in .env (`STRIPE_SETUP_PRICE_ID`, `STRIPE_MONTHLY_PRICE_ID`), Supabase URL + keys in .env, `supabase/.temp/` added to .gitignore
- [x] Template engine (PRD_02) — `src/lib/templates/`: deterministic string interpolation engine generating 6 compliance artifacts from intake data. `generateArtifacts(intake)` returns campaign_description, sample_messages (3), opt_in_description, privacy_policy, terms_of_service, opt_in_page_content (structured), plus tcr_use_case, tcr_flags, and compliance_site_slug. Templates use PRD_02 verbatim text for all 8 use cases. Existing stub at `src/lib/intake/templates.ts` refactored to re-export from engine while keeping `generateTemplates()` with {{placeholder}} sample messages for review page preview.
- [x] Vertical detection (PRD_05 Addendum) — `src/lib/templates/verticals/`: 17 industry keyword matchers in `detectVerticals()`, 17 vertical module files (healthcare, mental_health, legal, financial, veterinary, automotive, etc.), `assembleGuidelines()` for appending industry-specific guidance to SMS_GUIDELINES.md. Rule modules (healthcare, mental_health, legal, financial) sort first.

## In Progress

## Up Next
- [ ] Stripe end-to-end test (add `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` to .env, run `stripe listen --forward-to localhost:3000/api/webhooks/stripe`)
- [ ] Wire template engine into webhook pipeline (call `generateArtifacts()` in `checkout.session.completed` handler)
- [ ] Compliance site generator (PRD_03)
- [ ] Twilio submission engine (PRD_04)
- [ ] Deliverable generator (PRD_05) — SMS_GUIDELINES.md with vertical modules
- [ ] Dashboard page (`/dashboard`) — post-payment landing (PRD_06)
- [ ] Confirmation email setup

## Must Not Break
- **sessionStorage persistence**: All wizard screens use sessionStorage key `"relaykit_intake"` for cross-screen state. Reads MUST happen in `useEffect` (not `useState` initializers) to avoid SSR hydration mismatches. See CLAUDE.md "Critical Implementation Notes" and the `// CRITICAL` comment at the top of each wizard page file. The root cause of the prior break was that `BusinessDetailsForm` ignored late-arriving `initialValues` props — this is now handled by a dedicated `useEffect` with an `appliedInitials` guard.
- **Template engine public API**: `generateArtifacts(intake: IntakeData)` in `src/lib/templates/index.ts` is the canonical entry point for artifact generation. `generateTemplates()` in `src/lib/intake/templates.ts` is for review page preview only (uses {{placeholder}} sample messages). Do not merge these — they serve different purposes.

## Current PRD
Building from: `docs/PRD_02_TEMPLATE_ENGINE.md` + `docs/PRD_05_ADDENDUM_VERTICALS.md`

## Session Resume Prompt
If starting a new session, use this prompt:
"Read CLAUDE.md, PROGRESS.md, and docs/PRICING_MODEL_UPDATE.md. Check the current codebase to understand what's been built. Resume from the 'In Progress' item in PROGRESS.md."
