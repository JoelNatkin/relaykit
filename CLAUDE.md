# CLAUDE.md — RelayKit

## Project
SMS compliance + delivery service for indie developers. Prototype-first development; production code ports from `/prototype` (port 3001) to `/src` (port 3000) once screens stabilize. Current pricing: $49 registration + $19/mo (or $29/mo with marketing).

## Stack
- Next.js 15 App Router, TypeScript strict, kebab-case filenames
- Tailwind v4.1 + Untitled UI design system (`@untitledui/icons`)
- Supabase (Postgres + Auth, magic-link only)
- Stripe Checkout, Cloudflare Pages

## Design system rules
- Always use Untitled UI semantic tokens (`text-primary`, `bg-brand-solid`, `border-secondary`, `fg-error-primary`, etc.)
- NEVER use raw Tailwind colors (`text-gray-900`, `bg-blue-700`, `border-gray-200`)
- `react-aria-components` imports must be aliased with `Aria*` prefix
- No Next.js `Link` for navigation in UI — use `<Button href=... color="link-color">`
- Icon gotcha: `ShieldCheck` does not exist — use `ShieldTick`
- Full token tables and component APIs: `docs/UNTITLED_UI_REFERENCE.md`

## Architecture rules
- All carrier API calls use `fetch()` — no Twilio/Sinch SDK (D-02)
- Auth is magic-link only (D-03, D-59) — no passwords
- Template engine is string interpolation — no LLM generation for compliance artifacts
- Secrets only in env vars — never in code, never committed

## Code style
- Server components by default; client components only when required
- Server actions for form submissions
- Supabase SSR helpers for auth
- TypeScript strict mode — no `any` without a justifying comment

## Quality gates (every commit)
- `tsc --noEmit` clean
- `eslint` clean
- No `any` types without a justifying comment
- No disabled lint rules without a justifying comment
- No swallowed errors — explicit handling or explicit re-throw

## DECISIONS vs PROTOTYPE_SPEC

**DECISIONS.md** — product, architecture, pricing, or UX-model choices. The test: would another teammate need to know *why* we went this way, and would reversing it require rethinking the approach?

**PROTOTYPE_SPEC.md** — screen-level implementation details. Current look, behavior, layout, microcopy.

**Shortcut test:** If the change is "move X below Y" / "change size to Z" / "fix link" / "rewrite this one label" — it's PROTOTYPE_SPEC. If it changes what the product does or how it works conceptually, it's a decision.

When in doubt: PROTOTYPE_SPEC. A cluttered DECISIONS.md buries real decisions.

## Session start
When you see `DECISIONS CHECK`, read these three files and confirm each:
1. DECISIONS.md — active decision count + archived range noted
2. CC_HANDOFF.md — summary of previous session
3. PROTOTYPE_SPEC.md — acknowledged

Do not load DECISIONS_ARCHIVE.md unless Joel points to a specific D-number in that file.

## Recording decisions
When Joel confirms a direction that passes the shortcut test, append to DECISIONS.md immediately — never batch to session close-out:

> **D-[next number] — [Title]** (Date: YYYY-MM-DD)
> [Decision text + reason]

If what you're about to build contradicts a decision:

> ⚠ DECISION CONFLICT: contradicts D-[number]. Confirm override before I continue.

## Session close-out
1. `tsc --noEmit` and `eslint` clean on all modified directories
2. Commit working code
3. Append any unrecorded decisions to DECISIONS.md (apply the shortcut test to each candidate)
4. Update PROTOTYPE_SPEC.md for any screens that changed
5. Overwrite CC_HANDOFF.md with: commits this session, completed work, in-progress work, quality checks passed, gotchas, files modified, suggested next tasks
6. Do NOT push — PM review happens first

## Copy rule
Before writing ANY user-facing string (labels, errors, emails, tooltips, toasts, modals), read `docs/VOICE_AND_PRODUCT_PRINCIPLES_v2.md` in full and apply the vocabulary table, framing-shift table, emotional-states map, and one-sentence principle. No exceptions for "minor" strings.

## Hard platform constraints
- Never claim guaranteed compliance outcomes. Prohibited: "ensures compliance," "guarantees approval," "fully compliant," "stay compliant automatically"
- Never write specific day counts for carrier review. Use "a few days" (D-215)
- Healthcare/HIPAA: decline at intake (D-18). No BAA, no PHI through the proxy
- Marketing capability = second campaign registration, never an "upgrade" (D-15, D-37, D-89)
- V1 ships single-project. Do not build project-switching UI, project list, or `/dashboard/[projectId]` routes

## Carrier limits to surface in UI
- TCR: 3 lifetime brand verifications per phone number — advisory before sole-prop OTP submission
- TCR: 5 Standard Brands max per EIN — warn before a 6th registration submission

## Prototype discipline
- `/prototype` is the UI source of truth — production ports from prototype, not PRDs
- Prototype code is production-quality in everything except backend: real component names, real data shapes, real route structures, semantic color tokens, final copy
- State switcher dropdowns are allowed (development tools, not user-facing). Style: `text-quaternary text-xs`, right-aligned
- Before modifying any screen, read its section in PROTOTYPE_SPEC.md. If code and spec disagree, code wins — flag the discrepancy

## Implementation gotchas
- Wizard uses sessionStorage key `relaykit_intake` — preserve in all wizard work
- sessionStorage reads happen in `useEffect`, not `useState` initializers (SSR hydration)
- `.next` cache corruption is recurring: stop dev server → `rm -rf .next` → restart

## Key docs (load on demand, not at session start)
- `docs/RELAYKIT_PRD_CONSOLIDATED.md` — product narrative, what's built, what's next
- `docs/PRICING_MODEL.md` — tier definitions, costs, pricing logic
- `docs/VOICE_AND_PRODUCT_PRINCIPLES_v2.md` — mandatory before user-facing copy
- `docs/UNTITLED_UI_REFERENCE.md` — full design system reference
- `docs/WORKSPACE_DESIGN_SPEC.md` — target architecture for the post-signup workspace
- `BACKLOG.md` — parked ideas, never build from without explicit promotion

## BACKLOG protocol
If Joel mentions an idea outside the current task, suggest adding it to BACKLOG.md. Never build anything from BACKLOG.md without explicit promotion to the current session.