# Airtable schema — RelayKit Constraints base

> **Purpose:** Canonical reference for the RelayKit Constraints Airtable base — table structure, field definitions, select options, IDs for connector access. Updated when schema changes (rare).
>
> Not for: row content (lives in Airtable), view definitions (lives in Airtable UI), constraint policy reasoning (lives in `/explorations/vertical-constraints.md`), Rules content source (lives in `vertical-constraints.md` §4).

Base: **RelayKit Constraints**
Base ID: `appxThB8UWmNulAMt`
Built: 2026-05-27, Session 116
Connector: Airtable MCP (Anthropic)

## Status

Schema built. Default "Table 1" deleted. **No rows populated yet.** **Views not built yet.** Both paused pending the vertical-buckets research workstream (Session 117+).

## Tables

### Verticals (`tblh8a9saKuRBdApk`)
Top-level business categories. ~20 rows expected.

| Field | Type | Notes |
|---|---|---|
| Name | singleLineText | Primary. e.g., "Financial services" |
| Slug | singleLineText | URL-safe. e.g., "financial-services" |
| TCR vertical mapping | singleLineText | TCR vertical name if it maps cleanly. Reference only. |
| Notes | multilineText | Vertical-level reasoning |
| Sub-verticals | multipleRecordLinks (auto, reverse of Sub-verticals.Parent vertical) | |

### Sub-verticals (`tblsTgbqncUJLtIqb`)
Working table. ~80-150 rows expected. Most go fast; constrained ones get depth.

| Field | Type | Notes |
|---|---|---|
| Name | singleLineText | Primary. e.g., "Banking & budgeting apps" |
| Parent vertical | multipleRecordLinks → Verticals | |
| Bucket | singleSelect | 5 options with colors: 🔴 Barred at launch / 🟠 Vetting-required (indeterminate) / 🟡 In-scope, with content rules / 🟢 In-scope, no content rules / ⚫ Declined at launch |
| Bucket reason | singleSelect | 6 options: Carrier prohibition (statutory) / Vetting burden (case-by-case) / TCR Special category / BAA gating (legal call) / Customer-pull dependent / Standard eligibility |
| Constraint source | singleSelect | 6 options: Industry-wide regulatory / Industry-wide standard / RelayKit-specific, permanent / RelayKit-specific, deferred / RelayKit-specific, case-by-case / Not applicable |
| Routing trigger | checkbox | Does this surface in conditional secondary dropdown in widget? |
| Status | singleSelect | 6 workflow states: Not started / Bucket assigned / Rules drafted / Primer drafted / In configurator / Shipped |
| Priority | singleSelect | High / Medium / Low. For vetting backlog sorting only. |
| Preemptive notice | multilineText | One-line notice for high-stakes constrained sub-verticals only |
| Notes | multilineText | Reasoning, edge cases |
| Content rules | multipleRecordLinks (auto, reverse of Rules.Applies to) | |
| Card rule bullets | multilineText | Customer-facing rule bullets for the elig rules card (D-423). Authored in customer voice (not the enforcement Prohibition text); convention is 3 bullets per row, one per line. Populated on the 65 selectable (Conditional / Not-yet) sub-verticals; left empty for Clear and Not-our-lane. Lands in `/lib/constraints/verticals.ts` as `SubVertical.cardRuleBullets: string[]` via wholesale connector regeneration; `getRuleSummaries(slug)` reads it. Supersedes the prior rule-level `Rules` → `customerSummary` plumbing. |

### Rules (`tblDq3Yqi8Wx5EyYc`)
Content-rule library. Initial 15-25 rows from `vertical-constraints.md` §4. Grows as primer-authoring sessions add to it.

| Field | Type | Notes |
|---|---|---|
| Rule name | singleLineText | Primary. e.g., "No guaranteed outcomes (legal)" |
| Prohibition | multilineText | The "don't do this" half |
| Tone-sensitive | checkbox | If unchecked, only Safe rewrite (plain) is canonical |
| Safe rewrite (plain) | multilineText | Default rewrite |
| Safe rewrite (warm) | multilineText | Populated only when Tone-sensitive checked |
| Safe rewrite (brief) | multilineText | Populated only when Tone-sensitive checked |
| Severity | singleSelect | Enforced (configurator refuses to save) / Advisory (primer-only) |
| Applies to | multipleRecordLinks → Sub-verticals | One rule = one sub-vertical. Duplicate rows when same prohibition applies to multiple sub-verticals so rewrites can differ. |
| Source | singleLineText | e.g., "vertical-constraints.md §4a". Audit trail. |
| Notes | multilineText | Edge cases, examples |

## Connector limitations encountered

1. **No rollup field type.** Spec called for `Verticals.Routing sub-verticals count` (rollup counting Routing-trigger=true on linked Sub-verticals). Connector supports formula only, not rollup. Field omitted; add manually in Airtable UI if needed (2-minute task).
2. **No view creation.** Connector creates tables and fields but only the default Grid view. The 11 planned views (7 Sub-verticals, 3 Rules, 1 Verticals) must be built in Airtable UI. ~30-60 seconds each, ~10 minutes total.
3. **No delete-table.** "Table 1" had to be deleted manually in UI (done).

## Planned views (not yet built)

**Sub-verticals:**
1. Working view — group by Parent vertical, sort by Name
2. Launch-ready — filter Bucket in {In-scope, with content rules; In-scope, no content rules}, group by Parent vertical
3. Vetting backlog, prioritized — filter Bucket = Vetting-required, sort by Priority then Parent vertical, group by Bucket reason
4. Needs primer authoring — filter Bucket = "In-scope, with content rules" AND Status not in {Primer drafted, In configurator, Shipped}
5. Needs rules drafted — filter Bucket = "In-scope, with content rules" AND Status = "Bucket assigned"
6. Barred at launch — filter Bucket = "Barred at launch", group by Bucket reason
7. Per-vertical drill-down — group by Parent vertical, sort by Name

**Rules:**
1. By sub-vertical — group by Applies to
2. By severity — group by Severity
3. Authored, source-traced — sort by Source

**Verticals:**
1. All verticals — default, sort by Name

## Three already-authored sub-verticals for Rules population

Source: `/explorations/vertical-constraints.md`
- §4a — Legal (practice tools): ~8-10 rules
- §4b — Fintech (banking, budgeting, payments): ~6-8 rules
- §4c — Healthcare (administrative): ~5-7 rules

Total expected: ~20 rows in Rules table after lift.

These can be populated via connector as soon as the parent sub-vertical rows exist (i.e., after vertical-buckets research is loaded into Sub-verticals).

## Population sequence (revised from initial spec)

1. Vertical-buckets research workstream (Session 117+) produces full verticals + sub-verticals list with bucket / constraint source / routing trigger / bucket reason / notes per row.
2. Joel reviews research output, marks up disagreements, possibly second pass.
3. PM bulk-populates Verticals via connector.
4. PM bulk-populates Sub-verticals via connector (parent links, bucket, constraint source, routing trigger, bucket reason, notes — Status set to "Bucket assigned" for all).
5. PM populates Rules via connector for the three already-authored sub-verticals.
6. Joel builds the 11 views in Airtable UI.
7. Joel does Priority pass on vetting backlog rows.
