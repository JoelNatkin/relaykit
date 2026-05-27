# CC_HANDOFF — Session 115 — golden-path launch redefinition (D-416/417) + vertical-constraints exploration (D-418/419/420)

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.

**Date:** 2026-05-27
**Branches:** `main` only — no unmerged feature branches. `fix/marketing-home-polish` (merged Session 113) still exists locally + on origin pending Joel's cleanup call.

`Commits: 3 | Files modified: 7 | Decisions added: 5 | External actions: 3 (three pushes to origin/main)`

---

## Session character

Doc-only session covering two distinct PM threads (Product Thread 115):

1. **Golden-path GTM launch-definition work** — D-416 redefines "launch" as the live integrated product on a curated set of starter kits, not the 9-category corpus. D-417 lifts brand identity above any single capability (neither verification nor marketing is the brand). MASTER_PLAN §Launch focus rewritten in the same commit. Two-co-equal-capabilities framing retired.

2. **Vertical-constraints work** — `/explorations/vertical-constraints.md` created at full primer depth, capturing the four-bucket eligibility model, sub-vertical routing principle, and content rules for legal / fintech-eligible / healthcare-administrative. D-418/D-419/D-420 land its decisions. Sub-vertical routing resolves two of `CUSTOMER_ARCHETYPE_FOUNDATION` §4's fast-follows (BAA revisit, lending/collections advisory layer) — those are now sub-vertical routing calls, not content-qualification calls.

Three commits, all pushed: `76f3ecb` (D-416/417 + MASTER_PLAN), `3a43be5` (vertical-constraints + D-418/419/420; amended once to fold the duplicate TCR Special BACKLOG entry into the existing line-159 entry in-place per One Source Rule), and this close-out.

## Pre-flight ledger scan

```
DECISIONS ledger scan:
- Active count: 335 (latest D-420)
- Archive range: D-01 through D-83
- New this session: D-416, D-417, D-418, D-419, D-420 — all carry Supersedes: none
- All five passed seven gate tests
- Marketing decisions: latest MD-20 (unchanged this session)
- No flags
```

## Commits — chronological

1. **`76f3ecb` — `docs: D-416 + D-417 — launch redefined, no single-capability brand identity`.** 4 files / +33 / −5.
   - DECISIONS.md: D-416 (launch = live integrated product, not corpus) + D-417 (brand sits above verification + marketing; neither is identity). Canonical full-bodied format.
   - MASTER_PLAN.md §Launch focus paragraph rewritten verbatim per PM text. Lean-rewrite's no-version-line posture preserved (no version bump, no changelog).
   - docs/CUSTOMER_ARCHETYPE_FOUNDATION.md line 175: stale `D-130` reference corrected to `D-49` (the actual three-tier industry-gating decision, archived; D-130 in DECISIONS.md is unrelated sidebar-card decision).
   - REPO_INDEX.md: decision count 330 → 332, latest D-417; Last touched refreshes.

2. **`3a43be5` — `docs: vertical-constraints exploration + D-418/419/420 (eligibility model, content-rule layer, BACKLOG markers)`.** 4 files / +235 / −8. (Original `b43e639` amended once to fold the duplicate TCR Special BACKLOG entry into the existing line-159 entry in-place per One Source Rule; D-418 Affects field + REPO_INDEX BACKLOG-row annotation updated to match the merge reality. Pre-push, so the amend is safe.)
   - `explorations/vertical-constraints.md` (new) — Status: exploring; primer-depth preservation of Product Thread 115 work: two-question model (§1), four-bucket eligibility (§2), sub-vertical routing (§3), full content rules for legal/fintech-eligible/healthcare-administrative + restaurants note (§4), `industry-gating.ts` stale state (§5), eight-step sequenced promotion path (§6), relationships to existing docs (§7), promotion criteria (§8).
   - DECISIONS.md: D-418 (four-bucket eligibility + sub-vertical routing; refines D-49 + D-18 without retiring them per Supersedes: none methodology) + D-419 (per-vertical content-rule layer — prohibitions paired with safe rewrites; configurator condensation + per-vertical primers; single enforcement source = future repo data file) + D-420 (BACKLOG "committed" / "indeterminate" marker methodology).
   - BACKLOG.md: two items appended at end of Likely > Product Features — Multi-tenant support (committed) + Clinical healthcare enablement (indeterminate). Existing line-159 "Special TCR categories — out of scope at launch" entry updated in-place with (indeterminate) marker + D-418 bucket framing + cross-reference to the new exploration. Last updated header bumped 2026-05-24 → 2026-05-27.
   - REPO_INDEX.md: decision count 332 → 335, latest D-420; exploration count 2 → 3; new vertical-constraints row in Active explorations table; Last touched refreshes.

3. **This commit — close-out.** Two files: REPO_INDEX.md (CC_HANDOFF + REPO_INDEX self Last-touched rows refreshed) + CC_HANDOFF.md (this file, overwritten). Pushed directly per PM direction ("Skip review — mechanical close-out").

## Quality checks

- **No code touched** — skipped tsc / eslint / build gates per PM direction.
- All five new D-numbers passed seven gate tests; all carry `Supersedes: none`; supersession-discipline call documented below.
- REPO_INDEX final state verified: decision count 335 active, latest D-420; D-01–D-83 archived; three explorations (golden-path-gtm + no-ein-sole-proprietor-path + vertical-constraints), all `exploring`.

## Supersession-discipline call (D-49 / D-18)

D-418's body explicitly states "refines D-49 (industry tiers) and D-18 (healthcare decline) without retiring them; both remain valid as the underlying carrier/policy reasoning" in the Supersedes field. The Note: annotation pattern (prior precedent: D-413 → D-398, D-414 → D-379/D-381) was deliberately NOT applied to D-49 / D-18 — per PM direction this session: "Leave D-49 and D-18 as-is. They aren't superseded; D-418 builds on them, doesn't amend them. The Note: pattern doesn't apply here." The relationship is captured in D-418's body only. Future readers grep-finding D-49 or D-18 will not see a back-pointer; the forward direction (D-418 → D-49/D-18) is the only encoded link.

## Decisions

Five added this session: D-416, D-417, D-418, D-419, D-420 — all in canonical full-bodied format (Decided / Decision / Why / Rejected alternative / Supersedes / Affects), all `Supersedes: none`. Detailed entries in DECISIONS.md.

D-counts: 335 active, latest D-420; archive D-01–D-83.

## Exploration-doc disposition

One new exploration created this session: `/explorations/vertical-constraints.md` (status: exploring). Existing two explorations unchanged:
- `golden-path-gtm` — exploring (no movement this session; D-416/417 advance the launch-definition piece but the broader GTM sketch remains)
- `no-ein-sole-proprietor-path` — exploring (no movement this session; Sinch support reply still pending)

Promotion path for `vertical-constraints.md` is its own §6 sequenced 8-step plan — see "Suggested next sessions" below.

## Retirement sweep

N/A — mid-phase close-out (Phase 1 closed Session 111; Phase 2 Session B has not started substantive code work; no phase boundary crossed). CLAUDE.md gates sweep to phase-boundary close-outs only.

## Drift watch

N/A — mid-phase close-out, same reason as above.

## Carry-forward watch items

### NEW this session

**(a) `/explorations/vertical-constraints.md` §6 is now the canonical follow-up roadmap for the vertical-constraints workstream.** Eight steps in strict order, gated on each prior step. Step 1 (this session) is done. Step 2 (Airtable build) is the named next pickup on this workstream.

**(b) `CUSTOMER_ARCHETYPE_FOUNDATION` §4 needs a pointer to `/explorations/vertical-constraints.md`** when the repo constraint data file lands (per the exploration's §7). Don't restate — pointer only. PM-side edit per the doc's "PM proposes changes" maintenance posture.

**(c) `prototype/lib/intake/industry-gating.ts` is now KNOWN stale against the four-bucket model.** Sub-vertical-routing rework is sequence step 4 in the exploration's §6 — gated on the repo constraint data file existing first (step 3). Do not rework this file before the data file lands.

**(d) The `(committed)` / `(indeterminate)` BACKLOG marker convention exists now (D-420) but is sparsely applied** — only three items carry markers as of this commit (Special TCR categories, Multi-tenant support, Clinical healthcare enablement). PM may at some future session direct a marker sweep across existing BACKLOG items; not committed this session.

**(e) D-49 / D-18 carry no back-pointer to D-418.** Per PM direction (see "Supersession-discipline call" above). Future readers grep-finding the older entries will not see the refinement; the forward link is in D-418's body only. Flag for the next reader who's surprised by it.

**(f) The vertical-constraints exploration resolves two `CUSTOMER_ARCHETYPE_FOUNDATION` §4 fast-follows** — the BAA-revisit becomes the administrative-vs-clinical sub-vertical routing call (D-418); the "content-specific advisory layer for lending/collections" becomes sub-vertical routing to the vetting-required bucket (D-418), not content qualification (D-419). Both are now sub-vertical routing calls, not new content rules. The CUSTOMER_ARCHETYPE_FOUNDATION §4 text itself doesn't yet name this resolution — folds in alongside the §7 pointer above when the data file lands.

**(g) BACKLOG.md amend pattern this session.** When PM directs a new BACKLOG item that re-frames an existing one (this session's TCR Special vetting capability case), default to in-place merge — One Source Rule — rather than appending a duplicate. The initial append-as-separate-entry was reverted via commit amend; the merge pattern is now the lesson.

### Surviving from Session 114 (no change this session unless flagged)

**(h) MASTER_PLAN pointer to CUSTOMER_ARCHETYPE_FOUNDATION §4 still awaits PM action.** CC declined to self-edit MASTER_PLAN per its scope-header edit-mode rule ("Joel and PM edit; CC reads only"). Carry-forward from Session 114. The proposed copy and placement from Session 114's CC_HANDOFF still apply. **Note:** MASTER_PLAN §Launch focus was rewritten this session by PM direction (via D-416/417), so PM is editing MASTER_PLAN in this thread; the §4 pointer ask is independent and still open.

**(i) Canonical-sources-by-topic index in REPO_INDEX does not yet have a CUSTOMER_ARCHETYPE_FOUNDATION entry.** Carry-forward from Session 114. Also worth a CUSTOMER_ARCHETYPE_FOUNDATION entry now alongside a new vertical-constraints exploration entry, though explorations don't typically land in the canonical-sources-by-topic index. Not blocking.

**(j) PRODUCT_SUMMARY.md pricing-phrasing refresh** (L208 + L216 alignment with new marketing-site copy) — carry-forward from Session 113. Not addressed; flag for next code-touching close-out per Joel's note.

**(k) PRICING_MODEL.md phrasing verification** vs new site copy — carry-forward from Session 113.

**(l) Sinch support reply pending** — email sent 2026-05-25; awaiting reply. Carry-forward from Session 112.

**(m) Punchy-style twin skill** anticipated but not yet authored.

**(n) MESSAGE_PIPELINE_SPEC drift** flagged by Session 111 — spec reconciliation deferred to Phase 2 Session B kickoff prep.

**(o) Phase 2 Session B kickoff prep round** is the named next pickup per MASTER_PLAN §Active focus.

**(p) Focused DECISIONS retirement sweep** recommended before Phase 2 work — carry-forward from Session 111.

**(q) MASTER_PLAN "Launch focus" refresh** carry-forward from Session 108 — partially overlapped by D-416/D-417 this session, which rewrote the §Launch focus paragraph itself; whether the original Session 108 ask is now resolved or still has open scope is a PM call.

**(r) Brand bundle Company name correction** — Joel-side Sinch dashboard work.

**(s) Phase 4 consent-ledger architectural commitment** — scoped to Phase 4.

**(t) BDR queue (Elizabeth Garner)** — four cumulative API/dashboard inconsistencies + Experiment 3c callback exposure + Experiment 4 opt-out tracking + per-campaign auto-response config.

**(u) `MobileCategoriesModal` latent scroll-lock pattern** — same fix as `EditValuesModal` viewport guard. Fix on the next session that touches it.

**(v) D-389/D-391/D-392/D-395/D-401 stale positional-language cleanup**.

**(w) PostHog dashboard rename pass**.

**(x) PostHog vs Plausible/Fathom reconciliation** in `docs/MARKETING_STRATEGY.md`.

**(y) Tooltip touch-event handling / `aria-describedby` / viewport-edge positioning**.

**(z) D-378's stale parenthetical; D-380 drift carry-over**.

**(aa) `docs/POST_TOPICS.md` still untracked** — surviving carry-forward.

**(bb) Per-message "revert to RelayKit's default" configurator fast-follow**.

**(cc) Slash-command-for-variable-insertion configurator fast-follow**.

**(dd) `fix/marketing-home-polish` branch still exists locally + on origin** post-Session-113 merge. Joel's cleanup call.

## Gotchas for next session

1. **D-420's marker methodology is new and lightly applied.** If you author a BACKLOG entry that maps clearly to "committed" or "indeterminate," include the marker. Unmarked is the documented default for "undetermined-priority parking-lot."

2. **The `/explorations/vertical-constraints.md` §6 sequence is strict-order.** Don't rework `industry-gating.ts` (step 4) before the repo constraint data file lands (step 3). Don't author per-vertical primers (step 5) before that. The dependency chain is documented in §6 for a reason.

3. **D-49 and D-18 are the foundational decisions D-418 refines, not supersedes.** A grep for "industry gating" or "healthcare hard decline" hits D-49 / D-18 in DECISIONS_ARCHIVE.md without any back-pointer to D-418 — that's by PM direction. Look forward from those entries to find D-418's refinement.

4. **MASTER_PLAN's no-version-line posture is deliberate** (lean rewrite excised versioning; PM confirmed Session 115 to keep it that way). When amending MASTER_PLAN, do not re-introduce a Version line; trace changes through the commit message and DECISIONS instead.

5. **The vertical-constraints exploration is authored at primer depth.** Content rules in §4 are deeper than what the configurator will surface and deeper than what the SMS 101 page will carry on its face. Condensation happens at sequence steps 6 (configurator copy) and 7 (widget build) — primer-depth source survives in the exploration and the per-vertical primer docs.

6. **`industry-gating.ts` rework will need a four-bucket data shape** (barred / declined / vetting-required / in-scope) plus sub-vertical routing — not a flat regex list. Schema spec is the exploration's §3 + §4. Don't reuse the current flat shape.

### Surviving gotchas from prior sessions (no change this session)

All Session 114's gotchas remain operational — see git log for the prior CC_HANDOFF. Notable:
- **Untracked carry-forward files**: `.agents/`, `AGENTS.md`, `docs/POST_TOPICS.md`, `api/node_modules/`.
- **`.pm-review.md` is gitignored**.
- **`relaykit-writing-prose` skill is live and auto-discoverable**.
- **No-EIN exploration is `Status: exploring`**.
- **STATE_VERSION 3→4 silent drop**, **`isCompliant` = "no blockers"** (D-415), **Tiptap `categoryVariables` is context-driven** (Session 107).
- **iOS zoom fix** lives at globals.css `@media (max-width: 767.98px)` — don't re-introduce per-input `text-base` patches.
- **`tighten-wordmark-viewboxes.mjs`** script bails loudly on transforms / `<use>` refs / render-tree non-path geometry.

## Files modified this session

7 unique:

- `DECISIONS.md` — commits `76f3ecb` (D-416 + D-417 appended) + `3a43be5` (D-418 + D-419 + D-420 appended; D-418 Affects updated post-amend).
- `MASTER_PLAN.md` — commit `76f3ecb` (§Launch focus paragraph rewritten).
- `docs/CUSTOMER_ARCHETYPE_FOUNDATION.md` — commit `76f3ecb` (line 175 D-130 → D-49 typo fix).
- `BACKLOG.md` — commit `3a43be5` (two new entries + one in-place update + `Last updated` header bump).
- `explorations/vertical-constraints.md` — commit `3a43be5` (new file, primer-depth, status: exploring).
- `REPO_INDEX.md` — all three commits (Meta + table rows refreshed each commit).
- `CC_HANDOFF.md` — this file, overwritten in close-out commit.

## Unmerged branches

None blocking. `fix/marketing-home-polish` exists locally + on origin (post-Session-113 merge); cleanup is Joel's call.

## Suggested next session

The vertical-constraints §6 sequence is now the largest organized workstream. PM choice of pickup, but the natural order is:

1. **Airtable build** (vertical-constraints §6 step 2) — Joel-led, PM specs the schema. Pre-built views designed around how Joel uses it. Two-level structure (vertical → sub-vertical as linked records). Most verticals fill in fast as "eligible, no content rules"; the constrained ones get §4 depth.

2. **Repo constraint data file** (§6 step 3) — CC builds the schema, Joel hand-transfers from Airtable. Gates `industry-gating.ts` rework and the configurator condensation pass.

3. **`industry-gating.ts` rework** (§6 step 4) — CC, gated on the data file. Replace flat regex with sub-vertical-routing-aware structure.

4. **Per-vertical primer authoring** (§6 step 5) — Joel + PM session, full-depth guides expanded from exploration §4.

5. **Configurator copy authoring** (§6 step 6) — condensed in-context rules sourced from the primers.

6. **Widget build on `relaykit.ai`** (§6 step 7) — CC build; conditional sub-vertical secondary dropdown + eligibility verdict + content-rule preview.

7. **SMS 101 page** (§6 step 8) — public tier-3 page; assembly once 1–7 exist.

Other live carry-forwards from prior sessions still viable as fillers:

- **PRICING_MODEL.md / PRODUCT_SUMMARY.md refresh** to align with the Session-113 marketing-site copy changes — low priority, single-focus session.
- **Phase 2 Session B kickoff prep** — the named next pickup per MASTER_PLAN §Active focus.
- **MASTER_PLAN pointer to CUSTOMER_ARCHETYPE_FOUNDATION §4** — Joel/PM-side carry-forward from Session 114.
- **Watch for the Sinch support reply** — Session 112 carry-forward.
- **Focused DECISIONS retirement sweep session** — per Session 111's findings.
- **Brand bundle Company name correction** — Joel-side dashboard work.
- **`fix/marketing-home-polish` branch cleanup** — optional housekeeping.
