# CC_PROCEDURES — RelayKit
### Updated: June 12, 2026

> Procedures CC executes at a specific trigger, offloaded from CLAUDE.md to keep it resident-light. CLAUDE.md carries the hard-gate that sends you here; this file carries the steps. Substance that belongs to PM (gate tests, wave shape/cadence, handoff carry-forward) stays in PM_PROJECT_INSTRUCTIONS.md — referenced, not copied (One Source Rule).
>
> Each `## §Section` below is the target of a `## Procedure gates` line in CLAUDE.md. Don't act on a gated trigger without reading its section here.

---

## §Ledger

CC owns the integrity of DECISIONS.md and DECISIONS_ARCHIVE.md on disk. PM gates what becomes a decision; CC handles grep, supersession marks, archive moves, and format compliance. The canonical entry format lives at the top of DECISIONS.md.

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

### Drift watch (phase-boundary close-outs only)
For each canonical doc listed in REPO_INDEX's 'Canonical sources by topic' index, emit a one-line verdict in CC_HANDOFF's 'Drift watch' section: `fresh` (doc's last commit ≥ subject-area commit), `stale: subject moved YYYY-MM-DD, doc last touched YYYY-MM-DD` (flag for PM), or `n/a — no subject movement this phase`. Subject-area reference points: MASTER_PLAN.md, CC_HANDOFF.md, current-phase artifacts, any doc this phase modified. Also verify the canonical-sources index covers every doc listed in REPO_INDEX's docs tables and every topic touched this phase has an entry — flag missing entries. Findings only — no edits. Mid-phase close-outs skip. Pairs with the retirement sweep above.

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

---

## §Explorations

CC maintains four cross-doc surfaces when explorations change state. PM gates entry; CC executes on disk.

**When an exploration is created** (PM says "scaffold as an exploration"):
- Create `/explorations/[name].md` with status header `Status: exploring` and the substance PM provides
- Add row to REPO_INDEX "Active explorations" section: `| [name] | exploring | /explorations/[name].md | [one-sentence description] |`
- If UI-related: add pointer to relevant section in PROTOTYPE_SPEC.md
- If customer-experience-related: add pointer to relevant section in PRODUCT_SUMMARY.md

**When status changes to paused:**
- Update file header: `Status: paused (YYYY-MM-DD) — [brief context]`
- Update REPO_INDEX row status column

**When status changes to killed:**
- Update file header: `Status: killed (YYYY-MM-DD) — [brief reason]`
- Remove row from REPO_INDEX "Active explorations" section
- Remove pointers from PROTOTYPE_SPEC and PRODUCT_SUMMARY (file remains in /explorations/ as graveyard record)

**When status changes to promoted:**
- A D-number lands in DECISIONS.md per the seven gate tests in PM_PROJECT_INSTRUCTIONS.md
- Update file header: `Status: promoted to D-XXX (YYYY-MM-DD)`
- Remove row from REPO_INDEX "Active explorations" section
- Promote content into canonical docs (PROTOTYPE_SPEC if UI, PRODUCT_SUMMARY if customer-experience, etc.) per the substance of the decision; remove the prior pointer
- File remains in /explorations/ as historical record of why the canonical decision looks the way it does

---

## §Close-out

**Canon is maintained ambient — during the session, as the work happens, not saved for close-out:** append decisions to DECISIONS.md the moment one is made (seven gate tests, Supersedes filled, supersession notes same commit); update PROTOTYPE_SPEC.md when a screen changes and PRODUCT_SUMMARY.md when customer-facing behavior changes (bump its "Last reviewed"); bump REPO_INDEX.md Meta + `/docs` rows when files or pointers move (and in-file `Updated` headers on docs that carry them); update CC_HANDOFF.md per the **Per-commit handoff** rule below (in the same commit as substantive work); update MASTER_PLAN.md when PM flags a plan change. Commit working code in atomic, descriptively-messaged commits as you go. Close-out then just verifies and ships:

1. Quality gates (skip for doc-only sessions): `tsc --noEmit` + `eslint` clean on modified dirs; `/api` tests green if touched.
2. Verify canon is current — DECISIONS, PROTOTYPE_SPEC, PRODUCT_SUMMARY, REPO_INDEX, CC_HANDOFF all reflect this session; close any gap now and finalize the CC_HANDOFF metrics line + suggested next tasks.
3. Phase-boundary close-outs only: run the retirement sweep + drift watch (see §Ledger) → findings into CC_HANDOFF, no disk edits.
4. Do NOT push — PM review first (or push per the review bar).

### Per-commit handoff — CC_HANDOFF.md is never stale between close-outs

Any commit that lands **substantive work** — a new component/surface, copy or content of substance, a published blog post, a decision, or an architectural / design-token change — updates `CC_HANDOFF.md` **in the same commit**, authored by CC from its own diff: what landed, current `main` intent, in-flight branches, corrected carryovers, next steps. Keep the metrics line current (`Commits: N | Files modified: N | Decisions added: N | External actions: N`). This binds the cases that used to bypass any handoff update — **straight-to-main commits and branch pushes** (on a branch the update lives on the branch and reconciles at merge) — not just wave/close-out boundaries. **Skip only trivial one-line copy/spacing fixes.** Close-out remains the fuller reconcile; refreshing only then is the failure mode (Session 127: frozen through nine commits, so a mid-build crash or rotation inherits a blind handoff). PM-side counterpart: PM_PROJECT_INSTRUCTIONS.md handoff-discipline.

---

## §PRODUCT_SUMMARY

`docs/PRODUCT_SUMMARY.md` is the PM-facing customer-experience reference, intended to be loaded into PM browser-chat contexts. Update it when product behavior changes substantively — new screens, new flows, removed features, changed customer journey, new architectural commitments that affect what the customer sees or does. Do NOT update for copy tweaks, layout adjustments, or implementation refactors (those remain a PROTOTYPE_SPEC.md concern). At session close-out, ask: "did this session change what a customer would experience differently?" If yes, update PRODUCT_SUMMARY.md alongside PROTOTYPE_SPEC.md and bump its "Last reviewed" date. If no, leave it alone. The doc lives at ~500 lines max; if a new substantive change pushes it over, prune lower-value content rather than expand the ceiling.

---

## §Prose-sweep

When verifying leak terms have been removed from prose docs (legal copy, marketing copy, voice-driven cleanups), use multiline-safe grep:

```bash
tr '\n' ' ' < file | tr -s ' ' | grep -oE "(pattern1|pattern2|...).{0,80}"
```

JSX prose wraps long sentences across lines with leading indent; single-line grep misses split phrases. Multiline-safe grep collapses newlines first, so the grep sees the phrase as a single string. Default for end-of-prose-sweep verification. Concrete miss this catches: "compliance artifacts" leak in `marketing-site/app/privacy/page.tsx` survived three single-line greps in Session 56.

For verification of *added* content in commit specs (rather than *removed* terms), prefer "at least N occurrences" over exact integer counts. Exact counts are brittle when surrounding edits add unrelated mentions of the same term; "at least N" still catches the substantive question (did the new content land?) without requiring perfect knowledge of pre-existing occurrences. The Session 70 pumping-defense wave adopted this pattern across all 5 content commits and ran cleanly; the Session 77 methodology reconciliation wave continued it.

---

## §Marketing

Marketing decisions and plays live in `docs/MARKETING_STRATEGY.md`, not DECISIONS.md. Decision sequence is MD-1, MD-2, etc. — independent from D-numbered product decisions. Same gate-test rigor (PM_PROJECT_INSTRUCTIONS.md seven gate tests). Archive at `docs/MARKETING_STRATEGY_ARCHIVE.md`. Product/marketing seam rule: mostly-product decisions live in MASTER_PLAN/DECISIONS with marketing cross-reference; mostly-marketing decisions live in MARKETING_STRATEGY with product cross-reference. Load on demand only — not read at session start.
