# Repo Audit Sweeps

> **Purpose:** Defines the periodic audit sweep process — what it covers, how CC produces findings, how PM and Joel triage. Findings outputs live in this directory as date-stamped files.
>
> Not for: actual audit findings (those live in `audits/SWEEP_YYYY-MM-DD.md` files), one-off audit deliverables (those live alongside; this README only governs the recurring sweep process).

## What an audit sweep is

A scoped, periodic pass across the repo's canonical docs to catch drift, contradictions, and accumulated inconsistencies before they require larger cleanup waves. CC runs the sweep in a single plan-mode session; output is a findings list, never auto-fix.

The reason this exists: as the repo grows, drift accumulates silently. Manual catching becomes less tractable. A periodic sweep is the maintenance layer that prevents multi-hour bundled cleanups from becoming necessary.

## Audit categories

Each sweep picks 1–3 categories to focus on. Not all at once. Categories can grow over time as new drift patterns emerge.

1. **Cross-doc fact consistency.** Canonical facts (pricing numbers, phase count, customer values, decision counts) mentioned in multiple docs — flag actual contradictions, not phrasing variations.

2. **Scope header conformance.** Does each canonical doc's actual content match its scope header's Purpose claim? Has anything snuck in that the header says is "Not for"? Or has the header drifted from what the doc actually contains?

3. **Single-source-rule compliance.** Are canonical facts being restated where they should only be referenced? (Pricing facts outside PRICING_MODEL, phase definitions outside MASTER_PLAN, etc.)

4. **Stale references.** File paths, doc names, D-numbers, dates, version refs that drifted because their referent moved, got renamed, or no longer exists.

5. **Phase scope drift.** Has recent session work crept into phases other than the active one? Are CC_HANDOFF outcomes still serving the active MASTER_PLAN phase?

6. **Methodology cross-reference.** PM_PROJECT_INSTRUCTIONS vs CLAUDE.md alignment on shared rules. Have either drifted from the other?

## Output format

Each sweep produces a single file: `audits/SWEEP_YYYY-MM-DD.md` (date the sweep ran).

Findings inside follow this structure per item:

- **Category** (which audit category surfaced this)
- **Severity** — one of:
  - **Real contradiction** — docs disagree on a fact; needs fix.
  - **Soft drift** — phrasing inconsistency or partial pattern divergence; fix optional.
  - **Probably fine** — flagged for completeness, but the drift filter likely says leave alone.
- **What was found** — concrete description with file + line/section reference
- **Suggested action** — fix here, fix there, or no action

## Drift filter (applied to every finding)

"Would a careful builder make a wrong decision because of this?"

- If yes → real contradiction, fix it.
- If no → soft drift or probably-fine. Log, don't necessarily act.

This is the protection against audit-as-ceremony. Most findings should land in the second bucket.

## Process flow

1. **PM + Joel scope the sweep.** Pick 1–3 categories. Define the bounds. PM may flag specific known concern areas.
2. **CC runs the sweep** in a plan-mode session. Reads canonical docs and any docs the categories touch. Produces the findings file in `/audits/`.
3. **PM + Joel triage** the findings file. Decide which findings warrant fix-waves vs leave-alone vs queue-for-later.
4. **Fix waves** (if warranted) are scoped as their own CC sessions — separate from the audit itself. The audit doesn't auto-fix.

## Trigger guidance

Joel's call. No auto-schedule.

Reasonable times to consider running one:
- At phase boundaries
- Every ~10 substantive sessions
- When "a lot feels like it's shifted"
- After a large change wave (lean MASTER_PLAN rewrite, naming concept renames, major scope shifts)

Not after every session — that's what CLAUDE.md's drift-watch close-out step already covers. Audit sweeps are the deeper periodic layer.

## Risks to watch

- **Audit-as-procrastination.** Sweeps can become a way to feel productive without shipping product. Treat each sweep's output as triage list, not to-do list. Most findings should be log-and-leave.
- **False-positive accumulation.** CC may flag context-appropriate phrasing variations as drift. The drift filter exists to discard these. If a category keeps generating false positives, refine the category's definition or drop it.
- **Auditing the canon for the sake of it.** If a sweep produces no real contradictions across 2–3 consecutive runs, that's data — extend the cadence or rotate to different categories.
