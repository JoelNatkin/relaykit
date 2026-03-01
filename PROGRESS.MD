# RelayKit Build Progress

## Completed
- [x] Project scaffolding (Untitled UI starter kit + Supabase/Stripe/Twilio deps)
- [x] Screen 1: Use Case Selection (`/start`) — 8 tiles, single select, Continue button
- [x] Screen 1b: Use Case Advisory (`/start/scope`) — included/not-included sections, expansion checkboxes (non-promo pre-checked), campaign type upgrade logic
- [x] Screen 2: Business Details (`/start/details`) — Zod validation, conditional EIN/business type fields, use-case-specific fields, inline validation on blur, context-aware error messages, dynamic placeholder examples
- [x] Screen 3: Review & Confirm (`/start/review`) — two-column layout, details summary card with edit link, generated preview with inline-editable campaign description and sample messages, template generator, compliance slug
- [x] Database schema (`supabase/migrations/20260301000000_stripe_checkout_schema.sql`) — intake_sessions, customers, registrations, message_usage tables with triggers and indexes
- [x] Stripe Checkout integration — `POST /api/checkout` creates subscription-mode session ($199 setup + $19/mo), `POST /api/webhooks/stripe` handles checkout.session.completed, invoice.payment_failed, customer.subscription.deleted
- [x] Frontend checkout wiring — Review page "Everything looks good" button calls /api/checkout, loading state, error handling, redirect to Stripe
- [x] sessionStorage fix — restored cross-screen persistence broken by hydration fix, added implementation notes to CLAUDE.md

## In Progress

## Up Next
- [ ] Stripe webhook testing (add STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET to .env, test with Stripe CLI)
- [ ] Dashboard page (`/dashboard`) — post-payment landing (PRD_06)
- [ ] Template engine (PRD_02)
- [ ] Compliance site generator (PRD_03)
- [ ] Twilio submission engine (PRD_04)
- [ ] Confirmation email setup

## Current PRD
Building from: `docs/PRD_01_INTAKE_WIZARD.md` + `docs/PRICING_MODEL_UPDATE.md`

## Session Resume Prompt
If starting a new session, use this prompt:
"Read CLAUDE.md, PROGRESS.md, and docs/PRICING_MODEL_UPDATE.md. Check the current codebase to understand what's been built. Resume from the 'In Progress' item in PROGRESS.md."
