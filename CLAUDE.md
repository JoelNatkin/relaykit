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

Substance-ownership across docs follows the One Source Rule (PM_PROJECT_INSTRUCTIONS.md "Docs Hygiene"); when amending CLAUDE.md, check whether the concept also appears in PM_PROJECT_INSTRUCTIONS.md or DECISIONS.md's header primer and update cross-references in the same commit. Carry-forward visibility rules for PM_HANDOFF live in PM_PROJECT_INSTRUCTIONS.md Session Management.

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
3. Append any unrecorded decisions to DECISIONS.md using canonical format with filled-in Supersedes field. Apply all seven gate tests per PM_PROJECT_INSTRUCTIONS.md. Supersession notes on older decisions land in the same commit.
4. Update PROTOTYPE_SPEC.md for any screens that changed
5. Update PRODUCT_SUMMARY.md if this session changed what a customer would experience differently (new screens, new flows, removed features, changed customer journey, new architectural commitments that affect what the customer sees or does). Bump "Last reviewed" date. Criteria for substantive vs. non-substantive change live in the PRODUCT_SUMMARY.md maintenance section below.
6. Update MASTER_PLAN.md if PM flagged a plan change (bump version if substantive)
7. Run retirement sweep if close-out crosses a phase boundary (findings only — no edits)
8. Update REPO_INDEX.md: Meta block (last_updated, decision_count if applicable, new/removed files, active plan pointer); `/docs` table (`Last touched` entries for any docs modified this session). Also bump in-file `Updated` headers on any modified docs that carry them (e.g., `PM_PROJECT_INSTRUCTIONS.md` carries one; `MASTER_PLAN.md` only bumps on version changes).
9. Overwrite CC_HANDOFF.md. Include near the top a quantitative session metrics line: `Commits: N | Files modified: N | Decisions added: N | External actions: N`. Counting convention: include the close-out commit itself in Commits and Files-modified. Body: commits, completed work, in-progress work, quality checks passed, retirement sweep findings (if applicable), drift-watch findings (if applicable), gotchas, files modified, unmerged feature branches with their current state and what they're waiting on, suggested next tasks.
10. **Drift watch (phase-boundary close-outs only).** For each canonical doc listed in REPO_INDEX's 'Canonical sources by topic' index, emit a one-line verdict in CC_HANDOFF's 'Drift watch' section: `fresh` (doc's last commit ≥ subject-area commit), `stale: subject moved YYYY-MM-DD, doc last touched YYYY-MM-DD` (flag for PM), or `n/a — no subject movement this phase`. Subject-area reference points: MASTER_PLAN.md, CC_HANDOFF.md, current-phase artifacts, any doc this phase modified. Also verify the canonical-sources index covers every doc listed in REPO_INDEX's docs tables and every topic touched this phase has an entry — flag missing entries. Findings only — no edits. Mid-phase close-outs skip. Pairs with retirement sweep at step 7.
11. Do NOT push — PM review first

### Branching for production-facing work

When work touches a production-facing surface (`/marketing-site` today, future `/app` and `/dashboard`), create a feature branch before starting. Naming: `feat/short-name`, `fix/short-name`, `docs/short-name`, `chore/short-name`. Commit on the branch, push to remote, do not merge to main. PM and Joel review the resulting Vercel preview before approving merge.

Trivial changes (typos, comment-only edits, doc reorgs not touching user-facing copy) may go directly to main. When in doubt, branch.

Branch hygiene: at session close-out, surface any unmerged feature branches in CC_HANDOFF so they don't get lost. Do not delete branches until merged.

## PM review cadence (.pm-review.md)
After each local commit but before pushing, write `git show HEAD` (or full files if PM-relevant) to `.pm-review.md` at the repo root, overwriting existing content. The file is gitignored — never commit it. Joel pastes its content into the PM chat for review; PM approves push or directs amends. On amend, refresh `.pm-review.md` with the new HEAD. The file represents only the most recent commit awaiting review. See `PM_PROJECT_INSTRUCTIONS.md` "PM Review Cadence" for full procedure.

## Copy rule
Before writing ANY user-facing string (labels, errors, emails, tooltips, toasts, modals), read `docs/VOICE_AND_PRODUCT_PRINCIPLES_v2.md` in full and apply the vocabulary table, framing-shift table, emotional-states map, and one-sentence principle. No exceptions for "minor" strings.

## Marketing strategy doc
Marketing decisions and plays live in `docs/MARKETING_STRATEGY.md`, not DECISIONS.md. Decision sequence is MD-1, MD-2, etc. — independent from D-numbered product decisions. Same gate-test rigor (PM_PROJECT_INSTRUCTIONS.md seven gate tests). Archive at `docs/MARKETING_STRATEGY_ARCHIVE.md`. Product/marketing seam rule: mostly-product decisions live in MASTER_PLAN/DECISIONS with marketing cross-reference; mostly-marketing decisions live in MARKETING_STRATEGY with product cross-reference. Load on demand only — not read at session start.

## Wave-based integration discipline
PM may direct multi-commit waves spanning multiple canonical docs. CC executes each commit independently per its scoped prompt; each commit is atomic and PM-approved before push. See PM_PROJECT_INSTRUCTIONS.md "Waves" for shape and cadence. Retirement sweep does not run mid-wave; sweep candidacy is determined at phase-boundary close-outs only.

## Prose-sweep verification

When verifying leak terms have been removed from prose docs (legal copy, marketing copy, voice-driven cleanups), use multiline-safe grep:

```bash
tr '\n' ' ' < file | tr -s ' ' | grep -oE "(pattern1|pattern2|...).{0,80}"
```

JSX prose wraps long sentences across lines with leading indent; single-line grep misses split phrases. Multiline-safe grep collapses newlines first, so the grep sees the phrase as a single string. Default for end-of-prose-sweep verification. Concrete miss this catches: "compliance artifacts" leak in `marketing-site/app/privacy/page.tsx` survived three single-line greps in Session 56.

For verification of *added* content in commit specs (rather than *removed* terms), prefer "at least N occurrences" over exact integer counts. Exact counts are brittle when surrounding edits add unrelated mentions of the same term; "at least N" still catches the substantive question (did the new content land?) without requiring perfect knowledge of pre-existing occurrences. The Session 70 pumping-defense wave adopted this pattern across all 5 content commits and ran cleanly; the Session 77 methodology reconciliation wave continued it.

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

## PRODUCT_SUMMARY.md maintenance
`docs/PRODUCT_SUMMARY.md` is the PM-facing customer-experience reference, intended to be loaded into PM browser-chat contexts. Update it when product behavior changes substantively — new screens, new flows, removed features, changed customer journey, new architectural commitments that affect what the customer sees or does. Do NOT update for copy tweaks, layout adjustments, or implementation refactors (those remain a PROTOTYPE_SPEC.md concern). At session close-out, ask: "did this session change what a customer would experience differently?" If yes, update PRODUCT_SUMMARY.md alongside PROTOTYPE_SPEC.md and bump its "Last reviewed" date. If no, leave it alone. The doc lives at ~500 lines max; if a new substantive change pushes it over, prune lower-value content rather than expand the ceiling.

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