# CC_HANDOFF — Session 145: sub-vertical registry + WorkflowsSection scaffolding (2026-06-21)

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.

**Status: on branch `feat/sub-vertical-registry`, ONE commit, NOT pushed — awaiting PM `gg`.** Per the task spec, `.pm-review.md` holds `git show HEAD`; do not push until PM approves the Vercel preview. No new D-numbers (additive Phase 1C scaffolding; registry data is PM-authored). Decision count unchanged (352 active, latest D-437). Active product phase unchanged: Phase 2 — Session B. This is **Phase 1C / A3 (workflow definitions)** groundwork — the first registry data + the component the A2 dynamic `/for/[slug]` route will consume.

---

## What this session did (one commit, three tasks)

`feat: sub-vertical registry types, developer-tools entry, WorkflowsSection component`

**1. `marketing-site/lib/landing/sub-verticals.ts` (new).** The sub-vertical landing registry: `WorkflowStep` / `Workflow` / `SubVerticalLanding` interfaces + `SUB_VERTICAL_LANDINGS` (one entry — **developer-tools**, PM-authored, with 9 curated workflows) + helpers `findSubVerticalLanding(urlSlug)` / `subVerticalSlugs()`. Workflows are a display layer over the universal corpus: each step either points at a corpus message via `corpusId` (`"category-id:message-id"`) or carries its own `customVariants`; `variableAliases` supply contextual placeholder text.

**2. `marketing-site/app/for/developer-tools/page.tsx` (edit).** Removed the broken `import { findSubVertical } from "../../../../lib/constraints"` (that module doesn't exist under `marketing-site/lib`) plus the unused `SUB` resolve block and the now-orphaned `DATA_SLUG` const. `SUB` was never consumed by any rendered component. `URL_SLUG` kept (canonical). Page still prerenders static — constraints-data resolution is deferred to the A2 dynamic route.

**3. `marketing-site/components/home/workflows-section.tsx` (new).** Presentational `WorkflowsSection({ workflows, businessName, tone })` — two-column stepped cards matching the home MessagesSection card chrome (`rounded-xl border-border-secondary bg-surface-card px-[18px] py-4`). Each step: gold dot + connector rail + step name + always-visible body. Body resolved from `CATEGORIES` by `corpusId` (or `customVariants[tone.toLowerCase()]`), then `{{workspace_name}}`→businessName (`"Acme"` fallback) + `variableAliases` substitutions. No expand/copy/GAP-badge; parent owns controls.

**Verification:** tsc clean, eslint clean, `npm run build` green (41 pages; `/for/developer-tools` static). All 20 non-null `corpusId`s validated against the corpus (0 MISS).

## ⚠ Deviations from the pasted spec / PM-review flags (in `.pm-review.md`)
1. **Two corpusIds corrected** (PM-approved this session — corpus is source-of-truth for IDs): `account-events:new-device-sign-in`→`new-device-signin`; `customer-support:account-issue-resolved`→`account-issue-notification`. The pasted registry pointed at non-existent messages.
2. **Dropped the unused `VariantTone` import** from `sub-verticals.ts` — the pasted interface block imported it but no interface references it (`customVariants` uses literal `standard/friendly/brief` keys); eslint-clean gate required removal. `WorkflowsSection` imports `VariantTone` independently where it IS used.
3. **`WorkflowsSection` gold dot uses raw `#c9a84c`** per the spec — deviates from the home's "gold flows through tokens" convention (`bg-bg-gold` = `#E0B010`). Confirm before the component is mounted by A2.
4. **Quota custom variants leave `{{account_link}}` literal** — the two `quota-breach` steps' `customVariants` reference `{{account_link}}` with no alias, so per the literal spec (substitute `workspace_name` + `variableAliases` only) it renders raw. Latent (component not yet routed); resolve before A2 mounts it.

## Next task — Phase 1C continues
- **A3 expansion:** author more sub-vertical entries into `SUB_VERTICAL_LANDINGS` (PM authors from the research library in `docs/sub-verticals/`; CC writes the registry — never Airtable, D-421 AIRGAP).
- **A2 (engineering):** generalize `/for/developer-tools` into the dynamic `app/for/[slug]/page.tsx` consuming this registry; that route is where `WorkflowsSection` gets mounted (and where flags #3/#4 above must be resolved). Also build `/messages/documents` category page.

## Branch state
`feat/sub-vertical-registry` (branched from `main` HEAD = Session 144 close-out). One commit, unpushed. Prior session's `feat/corpus-expansion` already merged + deleted. Other stale `feat/*` / `sketch/*` branches remain (optional cleanup), unchanged.

## Untracked — DO NOT COMMIT
- `.claude/settings.local.json` (untracked); `.pm-review.md` (gitignored, holds `git show HEAD`).
