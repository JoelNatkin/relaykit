# CLAUDE.md — RelayKit

## File size discipline
Keep this file under 200 lines; target ~120. When adding guidance, also cut. If you can't cut enough to stay under the ceiling, the new guidance probably belongs in a focused spec doc (DECISIONS, PROTOTYPE_SPEC, MESSAGE_PIPELINE_SPEC) with a one-line pointer here instead of inline expansion.

## Project
SMS compliance + delivery service for indie developers. Prototype-first development; production code ports from `/prototype` (port 3001) to `/api` + future surfaces once screens stabilize. `/src` is sunset per D-358. Current pricing: $49 registration + $19/mo (or $29/mo with marketing).

## Stack
- Next.js 15 App Router, TypeScript strict, kebab-case filenames
- Tailwind v4.1 + Untitled UI design system (`@untitledui/icons`)
- Supabase (Postgres + Auth, passwordless email only — see D-03/D-59)
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
- Auth is passwordless email (D-03, D-59) — no passwords. "Magic-link" in D-03 is shorthand for the passwordless-email family, not a click-link mechanism
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

## DECISIONS ledger stewardship

CC owns the integrity of DECISIONS.md and DECISIONS_ARCHIVE.md on disk. PM gates what becomes a decision; CC handles grep, supersession marks, archive moves, and format compliance. Full rules in PM_PROJECT_INSTRUCTIONS.md; the canonical entry format lives at the top of DECISIONS.md.

### Pre-flight ledger scan (every session start)
After reading DECISIONS.md as part of the opening prompt, scan decisions added since the previous session (use CC_HANDOFF's commit log to identify them) and flag:
- Any new decisions missing the **Supersedes** field (required — "none" is valid, omission is not)
- Supersession annotations referencing D-numbers that don't exist in either file
- New decisions whose language duplicates (not extends) a pre-existing active decision

Report in the opening confirmation:
```
DECISIONS ledger scan:
- Active count: D-### (latest)
- Archive range: D-01 through D-83
- New since last session: D-###, D-### (none flagged) OR (flags: ...)
```

Surface flags before any task work. Do not silently fix — PM decides.

### Inline supersession enforcement (appending a new decision)
When PM directs a new D-number, follow this sequence without skipping:
1. **Grep first.** Grep DECISIONS.md and DECISIONS_ARCHIVE.md for terms central to the new decision (title nouns, feature names, the specific subject).
2. **Identify plausible conflicts.** Decisions that make a claim the new one overturns, OR describe the subject under a model the new one replaces.
3. **Articulate or confirm.** State each conflict in one sentence. If you can't, it's not real — drop it. If you can, it's a genuine supersession target.
4. **Fill Supersedes.** Populate the field with real D-numbers OR the explicit string "none" after the grep completes. Never blank. Never "none" without having greped.
5. **Mark older decisions in the same commit.** For each D-number in Supersedes, append `⚠ Superseded by D-###: [one-line explanation]` to the older decision's body. Same commit — not deferred.

If step 3 surfaces a genuine conflict PM didn't anticipate, **stop and flag before appending**: "Proposed D-### conflicts with D-### in ways PM may not have intended. [One-sentence description.] Should I proceed, revise, or escalate?"

**One-sentence test is the guardrail against over-marking.** Tangential relevance isn't conflict. Evolution isn't supersession unless the earlier approach is no longer operative. When in doubt, Supersedes: none is correct.

### Retirement sweep (phase-boundary close-outs only)
When a close-out coincides with a MASTER_PLAN phase transition (phase completes, new phase active, or REPO_INDEX `Active plan pointer` changes), include a sweep section in CC_HANDOFF:
```
## Retirement sweep — Phase [N] close
Scanned: D-### through D-### (added during Phase [N])
Findings:
- D-###: proposed supersession note — [reason]
- D-###: proposed archive move — fully superseded + no active reference
- D-###: proposed orphan annotation — approach no longer in scope per MASTER_PLAN §16
- Active file size: N decisions (archive threshold: ~100)

No disk changes made — awaiting PM review.
```
Sweep produces findings only. No edits to DECISIONS.md or DECISIONS_ARCHIVE.md during close-out. Mid-phase close-outs skip the sweep.

### Guardrails
- Never fix without permission. Surface flags; PM directs corrections.
- Grep both DECISIONS.md and DECISIONS_ARCHIVE.md — archived entries are authoritative unless superseded.
- Format compliance is non-negotiable. Missing Supersedes is a process failure, not a stylistic preference.
- Over-marking is as bad as under-marking. The one-sentence conflict test prevents false positives.

### Conflict flag format
If you're about to build something that contradicts a decision:
```
⚠ DECISION CONFLICT: contradicts D-[number]. Confirm override before I continue.
```

## Session start
When you see `DECISIONS CHECK`, read these four files and confirm each:
1. DECISIONS.md — active decision count + archived range noted
2. CC_HANDOFF.md — summary of previous session
3. PROTOTYPE_SPEC.md — acknowledged
4. MASTER_PLAN.md — active phase noted

Then run the pre-flight ledger scan (above) and report findings.

Do not load DECISIONS_ARCHIVE.md unless Joel points to a specific D-number OR you're greping for supersession candidates before appending a new decision.

## Session close-out
1. `tsc --noEmit` and `eslint` clean on all modified directories (skip for doc-only sessions)
2. Commit working code (atomic commits, descriptive messages)
3. Append any unrecorded decisions to DECISIONS.md using canonical format with filled-in Supersedes field. Apply all six gate tests per PM_PROJECT_INSTRUCTIONS.md. Supersession notes on older decisions land in the same commit.
4. Update PROTOTYPE_SPEC.md for any screens that changed
5. Update MASTER_PLAN.md if PM flagged a plan change (bump version if substantive)
6. Run retirement sweep if close-out crosses a phase boundary (findings only — no edits)
7. Update REPO_INDEX.md (last_updated, decision_count, new/removed files, active plan pointer)
8. Overwrite CC_HANDOFF.md with: commits, completed work, in-progress work, quality checks passed, retirement sweep findings (if applicable), gotchas, files modified, suggested next tasks
9. Do NOT push — PM review first

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
- Wizard uses sessionStorage key `relaykit_wizard` — preserve in all wizard work (see `prototype/lib/wizard-storage.ts`)
- sessionStorage reads happen in `useEffect`, not `useState` initializers (SSR hydration)
- `.next` cache corruption is recurring: stop dev server → `rm -rf .next` → restart

## Key docs (load on demand, not at session start)
- `docs/PRICING_MODEL.md` — tier definitions, costs, pricing logic
- `docs/VOICE_AND_PRODUCT_PRINCIPLES_v2.md` — mandatory before user-facing copy
- `docs/UNTITLED_UI_REFERENCE.md` — full design system reference
- `docs/WORKSPACE_DESIGN_SPEC.md` — target architecture for the post-signup workspace
- `BACKLOG.md` — parked ideas, never build from without explicit promotion

## BACKLOG protocol
If Joel mentions an idea outside the current task, suggest adding it to BACKLOG.md. Never build anything from BACKLOG.md without explicit promotion to the current session.