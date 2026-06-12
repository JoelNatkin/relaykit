# CLAUDE.md — RelayKit
### Updated: June 12, 2026

> **Purpose:** Standing instructions for CC — what to read at session start, how to write code, the rules and hard gates. Step-by-step procedures live in `docs/CC_PROCEDURES.md`; this file carries the gate that sends you there.
>
> Not for: PM-side methodology (PM_PROJECT_INSTRUCTIONS), product specifications (spec docs), session narrative, procedure detail (CC_PROCEDURES).

## File size discipline
Keep this file under 200 lines; target ~100. It holds rules and hard gates only. When adding guidance, also cut. Procedures (multi-step, trigger-keyed) belong in `docs/CC_PROCEDURES.md` behind a one-line gate here; other substance belongs in a focused spec doc (DECISIONS, PROTOTYPE_SPEC, MESSAGE_PIPELINE_SPEC) with a pointer here — not inline expansion.

## Project
SMS compliance + delivery service for indie developers. Prototype-first development; production code ports from `/prototype` to `/api` + future surfaces once screens stabilize. `/src` is sunset per D-358. Current pricing: $49 registration + $19/mo (or $29/mo with marketing).

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
- In-file Updated/Last-updated headers are enforced by `.githooks/pre-commit` — a doc edit without its header bump will not commit.

## DECISIONS ledger
CC owns the integrity of DECISIONS.md and DECISIONS_ARCHIVE.md on disk; PM gates what becomes a decision. Full rules in PM_PROJECT_INSTRUCTIONS.md "Docs Hygiene"; the canonical entry format lives at the top of DECISIONS.md; the on-disk procedures (pre-flight scan, supersession sequence, retirement sweep, drift watch) are in `CC_PROCEDURES.md §Ledger` (gated below). Substance-ownership across docs follows the One Source Rule — when amending CLAUDE.md, check whether the concept also lives in PM_PROJECT_INSTRUCTIONS.md or DECISIONS.md's header primer and update cross-references in the same commit.

## Copy rule
Before writing ANY user-facing string (labels, errors, emails, tooltips, toasts, modals), read `docs/VOICE_AND_PRODUCT_PRINCIPLES_v2.md`. **Product-surface** strings → apply §2 Product Voice + the §6 kill list (and the one-sentence rule). **Marketing / blog / community** → apply §3 Demand Voice (the Straight-Talking Principles, STP). No exceptions for "minor" strings.

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

## Session start
At session open, read these five files and confirm each:
1. REPO_INDEX.md — last-updated date, active phase, decision count
2. DECISIONS.md — active decision count + archived range
3. CC_HANDOFF.md — previous session summary
4. PROTOTYPE_SPEC.md — acknowledged
5. MASTER_PLAN.md — active phase

Then run the pre-flight ledger scan (`CC_PROCEDURES §Ledger`) and report findings. Do not load DECISIONS_ARCHIVE.md unless Joel points to a specific D-number OR you're greping for supersession candidates before appending a new decision.

## Branching for production-facing work
When work touches a production-facing surface (`/marketing-site` today, future `/app` and `/dashboard`), create a feature branch before starting. Naming: `feat/short-name`, `fix/short-name`, `docs/short-name`, `chore/short-name`. Commit on the branch, push to remote, do not merge to main. PM and Joel review the resulting Vercel preview before approving merge.

Trivial changes (typos, comment-only edits, doc reorgs not touching user-facing copy) may go directly to main. When in doubt, branch. Branch hygiene: at session close-out, surface any unmerged feature branches in CC_HANDOFF; do not delete branches until merged.

## PM review cadence (.pm-review.md)
HARD RULE: the last action of EVERY commit — and of any stop where review could be requested (branch push, pause, close-out) — is to overwrite `.pm-review.md` (gitignored, never committed). Never optional, regardless of review cadence; auto-shipped commits refresh it too, so "gg" always reads current. Header carries the HEAD hash it was generated at; if HEAD moves (amend, follow-up), regenerate before stopping. Content: `## Context` (1–5 lines — what the work is, open questions, deviations), `## Commits` (`git log --oneline` of the unreviewed range), `## Full diff` (`main...branch` for branch work; `<last-reviewed>..HEAD` for direct-to-main). Review cadence itself stays per `PM_PROJECT_INSTRUCTIONS.md` "PM Review Cadence": trivial/visually-verifiable auto-ships after build+push; logic/shared/multi-file/legal/ledger work gets PM gg — per-commit or cumulative as PM directs.

**Plan files:** plan-mode plans write to `.pm/plans/` (set via `plansDirectory` in `.claude/settings.json`) — repo-local and gitignored, so PM can read CC's plans natively via MCP.

**PM_HANDOFF channel.** When a PM prompt contains a delimited `PM_HANDOFF update` block, write its contents to `.pm/PM_HANDOFF.md` as given and do **not** stage it (`.pm/` is gitignored). CC transcribes PM's block to disk; CC does not author or edit PM_HANDOFF content — its substance and carry-forward rules are PM-owned (PM_PROJECT_INSTRUCTIONS.md Session Management).

## Procedure gates
Trigger-keyed procedures live in `docs/CC_PROCEDURES.md` (`§Section` names below). Each line is a gate: at the trigger, read the section and execute it — don't act on a gated trigger without it. Ordered as a session timeline:

1. **Session start** → after reading the five files, run the pre-flight ledger scan (`CC_PROCEDURES §Ledger`); surface flags before any task work, never silently fix.
2. **Appending a D-number** → read `CC_PROCEDURES §Ledger` and execute the supersession sequence (grep both ledgers → articulate each conflict in one sentence → fill **Supersedes** with real D-#s or "none" → mark older decisions `⚠ Superseded by` in the same commit). Never append without it. PM gates entry; CC never fixes the ledger without permission.
3. **Exploration state change (create / pause / kill / promote)** → execute `CC_PROCEDURES §Explorations` (file header + REPO_INDEX row + PROTOTYPE_SPEC/PRODUCT_SUMMARY pointers per state).
4. **Customer-experience behavior change** → update `docs/PRODUCT_SUMMARY.md` + bump its "Last reviewed" — criteria in `CC_PROCEDURES §PRODUCT_SUMMARY`.
5. **Verifying leak-term removal from prose** → use the multiline-safe grep in `CC_PROCEDURES §Prose-sweep` (single-line grep misses JSX-wrapped phrases).
6. **Marketing decision** → MD-numbered in `docs/MARKETING_STRATEGY.md`, never DECISIONS.md — see `CC_PROCEDURES §Marketing`.
7. **Multi-commit wave** → shape/cadence per `PM_PROJECT_INSTRUCTIONS.md "Waves"`; each commit atomic + PM-approved before push (retirement sweep never runs mid-wave — `§Ledger`).
8. **Every substantive commit** → update `CC_HANDOFF.md` in the same commit — `CC_PROCEDURES §Close-out` (per-commit handoff). Skip only trivial one-line copy/spacing.
9. **Every session close-out** → execute `CC_PROCEDURES §Close-out` (verify canon current; gates skip for doc-only).
10. **Phase-boundary close-out** → run the retirement sweep + drift watch (`CC_PROCEDURES §Ledger`); findings into CC_HANDOFF, no disk edits.

## Key docs (load on demand, not at session start)
- `docs/CC_PROCEDURES.md` — CC trigger-keyed procedures (ledger, explorations, close-out, prose-sweep, PRODUCT_SUMMARY, marketing)
- `docs/PRICING_MODEL.md` — tier definitions, costs, pricing logic
- `docs/VOICE_AND_PRODUCT_PRINCIPLES_v2.md` — mandatory before user-facing copy
- `docs/UNTITLED_UI_REFERENCE.md` — full design system reference
- `docs/WORKSPACE_DESIGN_SPEC.md` — target architecture for the post-signup workspace
- `docs/MESSAGE_AUTHORING_GUIDE.md` — canonical procedure for authoring a message-library category; CC reads before any category-authoring task
- `BACKLOG.md` — parked ideas, never build from without explicit promotion

## BACKLOG protocol
If Joel mentions an idea outside the current task, suggest adding it to BACKLOG.md. Never build anything from BACKLOG.md without explicit promotion to the current session.
