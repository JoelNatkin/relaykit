# CC_HANDOFF — Session 140: 9 message-category landing pages (dynamic route + registry + template); D-437 (2026-06-18)

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.

**Session metrics:** Commits: the feature shipped as `404c274` (`feat:` — route + registry + components) + a mechanical follow-up `4d71368` (`chore:` — sitemap + canon docs that a staging slip left out of `404c274`); both pushed | Decisions added: 1 (**D-437**) + 1 cross-ref on D-436 | `main` changes: 0 (all work on `feat/landing-developer-tools`, UNMERGED). Close-out gates: tsc ✅ / eslint ✅ / build ✅ (`marketing-site`, `.next` cleared). Branch: `feat/landing-developer-tools` (pushed). Mid-phase (active phase stays Phase 2 — Session B).

**Status: 🟡 On branch `feat/landing-developer-tools`, pushed. The full message-category landing system is built + verified but UNMERGED. Do NOT merge until PM approves the Vercel preview.**

### Follow-up — preview-review pass (2026-06-18, separate `feat:` commit)
Five preview-review refinements (no new D-number — data/copy/layout): (1) the 8 non-account-events `variablesExample` card2 bodies now highlight the **same** value as card1 + the menu (orders 1024, appointments 2:00 PM, verification 480913, support 318 + link `/tickets/318`, team-alerts checkout, waitlist 7:30, community 6:30, marketing "new plan") — they previously highlighted a mismatched second value; (2) `category-details.tsx` now packs **two independent flex columns** (left = Q1/Q3, right = Q2/Q4) instead of a 2-row grid, killing the dead gap a tall bullet-list card left beside a short one (desktop reading order stays Q1–Q4; **note:** on mobile the two columns stack as Q1,Q3,Q2,Q4 — intrinsic to the two-column approach; cards are independent Q&A); (3) `numbers-section.tsx` subhead got `max-w-md` to stop the "compare." orphan (shared component — also improves the home); (4) **category-template section order** moved Numbers + Problem to the tail (… Pricing → Messages(full) → Numbers → Problem → FinalCta → Farm) — category template only, home untouched; craft-doc compose order updated; (5) all 8 non-account-events `heroExamples` expanded to **4 each** so the hero mock rotates + the pause toggle returns (gated on `length > 1`). account-events unchanged. tsc/eslint/build clean; verified in prerendered HTML.

---

## What shipped — 9 message-category landing pages as one dynamic route + registry + template (D-437)

Generalized the Session-139 single account-events page into **all 9 message categories** from one template + a per-category data registry. Built per the PM-approved plan (`.pm/plans/plan-only-no-lucky-lovelace.md`); content from PM's data block (`.pm/category-data-block.md`).

- **`marketing-site/app/messages/[category]/page.tsx`** (new dynamic route) — `generateStaticParams` over the registry, `dynamicParams=false` (unknown slug 404s), per-category async `generateMetadata`, self-canonical to `/messages/{urlSlug}`. Composes B1 chrome + 2b data-fed (`MessagesSection` locked / `VariablesSection` / `NumbersSection`) + 2a authored (Hero/Moment/Details) + Farm, in the Session-139 order.
- **`marketing-site/lib/landing/categories.ts`** (new registry) — `CategoryLanding` type + 9 entries + `findCategoryLanding(urlSlug)` / `categorySlugs()`. **`urlSlug` (public) split from `lockedCategory` (corpus key):** equal for 7; **Orders** = `orders`/`order-updates`, **Customer support** = `support`/`customer-support`. No `/lib/constraints` import.
- **`marketing-site/components/landing/{category-hero,category-moment,category-details,category-farm,paperwork-fork}.tsx`** (new, prop-driven) — rendering lifted from the Session-139 account-events `sections.tsx`. `category-details` renders the rich Q&A (bold lead + optional bullet list). `category-farm` lists the other 8 category pages (real `/messages/{urlSlug}` targets) + 2 standing question links.
- **`marketing-site/components/landing/hero-notification-mock.tsx`** (generalized) — now takes `{ examples?: string[]; businessName? }`. Rotates + pause toggle when >1 example; single static notification (no toggle) when 1. Default = the original 5 account-events bodies, so the **untouched** `/for/developer-tools` hero (calls it prop-less) renders identically.
- **`marketing-site/app/sitemap.ts`** — category routes derived from the registry (`categorySlugs()`); `/for/developer-tools` kept; the hand-listed `/messages/account-events` dropped.
- **Deleted** `marketing-site/app/messages/account-events/{page,sections}.tsx` — the static Session-139 fork. The dynamic route now serves `/messages/account-events` (entry #1). Removal is required (a static file shadows the dynamic route).

**Account-events #1 migration is intentionally NOT byte-identical in text** — its Q&A + Moment text come from PM's data block (corrected/neutralized), not the fork. Only the 5 hero bodies, the `VariablesExample` object, and the section rendering were lifted from code. Parity is structural (verified below).

## Verification (all green)
- tsc ✅ / eslint ✅ / `next build` ✅ — 41 pages; `/messages/[category]` prerenders **9 static**.
- Canonicals: all 9 self-canonical to `https://relaykit.ai/messages/{urlSlug}` (never `/`); titles per registry.
- **Slug↔corpus split:** `/messages/orders` renders the order-updates corpus + "Order messages, ready to send."; `/messages/support` renders the customer-support corpus + "Support messages, ready to send." (proves `urlSlug`≠`lockedCategory` resolves correctly).
- Routing: `/messages/orders|support|account-events` + hub `/messages` → 200; `/messages/order-updates` (bare corpus id, not a public slug) + `/messages/nope` → 404 (`dynamicParams=false`).
- Sitemap: `/for/developer-tools` + all 9 `/messages/{urlSlug}` (incl. `/orders`, `/support`), no duplicate.
- `app/for/developer-tools/` byte-identical (`git diff --stat` empty).

## Canon — current
- **DECISIONS.md** — **D-437** appended (Supersedes none; extends D-436); **D-436** has a `Scoping (D-437)` cross-ref line (no superseded flag).
- **REPO_INDEX** — Meta lead + decision count (352/D-437) + branch state + DECISIONS/REPO_INDEX doc rows.
- **landing-page-craft.md** — new "Category-page type (D-437)" section; Status date → 2026-06-18.
- **PROTOTYPE_SPEC** — NOT updated (surface new + unmerged; spec the `/messages/{category}` surface when it stabilizes/merges, per the doc's rule — owed at merge).

## Carry-forwards (flagged, not done)
- **PROTOTYPE_SPEC** entry for the `/messages/{category}` category-page surface once it merges/stabilizes.
- **D-436's deferred dev-tools page** (`/for/developer-tools`) is still unmerged and untouched — its disposition (ship as the first `/for/{slug}` sub-vertical page, or fold away) is a separate PM call. The `/for/{slug}` sub-vertical recipe + its `landing-page-craft.md` ship-it skeleton stay operative per the D-436 scoping cross-ref.
- **Pre-existing (not introduced this session):** two `id="configurator"` per category page (locked + full `MessagesSection`) — the hero `#configurator` anchor jumps to the first/locked one; fixable only by touching the shared `MessagesSection` (out of scope here). H1s/Farm question-links carry the same v1 placeholders as the Session-139 page.
- **Still open from Session 138 — D-215 override** ("We get you approved in 2–3 days" on the home `#rules`): PM still owes a reconciliation. Unrelated to this branch.
- **Standing:** sole-prop `/prototype`+`/src` UI session (D-433); dead `--color-text-headline-muted` token + globals.css light→dark dead-token collapse; migration `009_early_access_interest_tag.sql` apply-before-deploy; blog "configurator" voice rewrite; older merged-not-deleted `feat/*` branches.

## Branch state
**`feat/landing-developer-tools`** — pushed, **unmerged**. Now hosts the category-page system (9 pages + registry + template) AND the deferred `/for/developer-tools` page. `main` untouched by this branch. No merge until PM approves the Vercel preview.

## Untracked carryover — DO NOT COMMIT
- Only `.claude/settings.local.json` remains untracked.

## Next steps
- **PM:** review the Vercel preview (all 9 `/messages/{category}` pages, esp. `/orders` + `/support` slug↔corpus split). On approval, decide merge + the `/for/developer-tools` disposition.
- When the surface merges/stabilizes: add the PROTOTYPE_SPEC `/messages/{category}` section.
- Unrelated standing item: **Phase 2 — Session B (Sinch outbound delivery)** per MASTER_PLAN remains the substantive product pickup.
