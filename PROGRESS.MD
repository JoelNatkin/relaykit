# RelayKit Build Progress

## Completed
- [x] Project scaffolding (Untitled UI starter kit + Supabase/Stripe/Twilio deps)
- [x] Screen 1: Use Case Selection (`/start`) — 8 tiles, single select, Continue button
- [x] Screen 1b: Use Case Advisory (`/start/scope`) — included/not-included sections, expansion checkboxes (non-promo pre-checked), campaign type upgrade logic
- [x] Screen 2: Business Details (`/start/details`) — Zod validation, conditional EIN/business type fields, use-case-specific fields, inline validation on blur, context-aware error messages, dynamic placeholder examples
- [x] Screen 3: Review & Confirm (`/start/review`) — two-column layout, details summary card with edit link, generated preview with inline-editable campaign description and sample messages, template generator, compliance slug

## In Progress

## Up Next
- [ ] Stripe Checkout integration
- [ ] Database schema + Supabase migrations

## Current PRD
Building from: `docs/PRD_01_INTAKE_WIZARD.md`

## Session Resume Prompt
If starting a new session, use this prompt:
"Read CLAUDE.md, PROGRESS.md, and docs/PRD_01_INTAKE_WIZARD.md. Check the current codebase to understand what's been built. Resume from the 'In Progress' item in PROGRESS.md."