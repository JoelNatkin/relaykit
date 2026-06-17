# CC_HANDOFF — Session 139: first sub-vertical landing page (Developer tools) (2026-06-16)

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.

**Session metrics:** Commits: 9 (4 build + 5 polish/feat/copy) | Decisions added: 1 (**D-436**). **Note — one deliberate SHARED-component copy edit:** `numbers-section.tsx` intro shortened ("Messages from an app only work when someone sees them. Here's how text and email compare.", no em dash) — this updates **both `/` and every landing**; verified both render it. (Every other landing change is composed around the verbatim home components; this is the one intentional change to a shared component.) | Branch: `feat/landing-developer-tools` (**UNMERGED — pushed for Vercel preview**). Built the first production React sub-vertical landing page (`/for/developer-tools`) by reusing the live home components, per the PM-approved plan (`.pm/plans/plan-only-no-unified-lantern.md`). Quality gates clean every code commit: tsc ✅ / eslint ✅ (`marketing-site`) / build ✅ (`.next` cleared). No `/api` changes. Mid-phase (active phase stays Phase 2 — Session B).

**Status: 🟡 On branch, pushed, awaiting PM review on the Vercel preview. Do NOT merge to `main` until approved.**

---

## What shipped (4 commits on `feat/landing-developer-tools`)

1. **`d904b0d` docs** — **D-436** appended (sub-vertical landing-page architecture: home-component chrome + per-sub sections, self-canonical, short `/for/{slug}` URLs decoupled from the `/lib/constraints` data slug; **Supersedes none** — extends D-379, consistent with D-428/D-435). Added the "Ship-it page skeleton (component map)" section + locked order to `landing-page-craft.md` (Status → 2026-06-16). REPO_INDEX decision count 350→351.
2. **`a7aa47b` refactor** — extracted the three inline home sections (`StatusBand`, `Recognition`, `Test`→`Prove`) from `app/page.tsx` into `components/home/{status-band,recognition,prove}.tsx`. Pure move + re-import; home renders identically.
3. **`20d6e34` refactor** — optional sub-data props: `VariablesSection` gains `example` (+ `DEFAULT_EXAMPLE`); `MessagesSection` gains `lockedCategory`/`eyebrow`/`heading`/`bridge` (lockedCategory hides the pill rows). Both default to current home behavior — home unchanged.
4. **`feat` (this commit)** — the page. `app/for/developer-tools/{page.tsx,sections.tsx}` + `components/landing/hero-notification-mock.tsx` (animated cross-fade, `prefers-reduced-motion`-aware, pause toggle). Self-canonical metadata; sitemap entry (`LANDING_ROUTES`). Build verified: `/for/developer-tools` prerenders **static**; `<link rel="canonical">` = `https://relaykit.ai/for/developer-tools` (never `/`); Messages pills hidden (locked to account-events); Variables shows the account-events example.

5. **`style` polish** (post-review fixes, two commits) — hero phone frame realistic portrait (`h-[560px]` after a 620→560 trim); pause toggle made quiet (smaller `size-5`, `text-text-quaternary` + `opacity-60`, brightens on hover); dev-tools hero eyebrow drops the leading "For " → "Developer tools & API platforms" (home eyebrow untouched); Moment "Paid in minutes" bubble `w-fit` so it hugs its text; Moment columns top-aligned (`items-start`). **Details/Q&A pass:** three question headings shortened (Q4 → "What if we don't have a user's phone number?"), Q4 answer trimmed to 2 sentences (VOICE §3), and each Q&A is now its own `bg-surface-card` card in an `items-start` grid (cards size to own content, no forced equal heights). **Funnel/Fork/Farm link model applied:** body funnel CTAs kept ONLY at Hero / Messages ("Open messages →") / Closing CTA; Rest's forward link removed; a landing-owned **Fork** ("What registration actually involves →", v1 → `/messages`, intended `/10dlc-registration`) composed AFTER the verbatim `<Paperwork/>`; the "Related" rack replaced by a quiet footer **Farm** below the Closing CTA (other business types + parent-vertical + common-questions, all → `/messages` v1 with intended-target comments). No shared home component touched — home byte-identical. Link model recorded in `landing-page-craft.md` (Status → 2026-06-17). tsc/eslint/build clean.

## Decisions made in build that need PM eyes on the preview
- **HowItWorks (`#how`) placement.** The approved 15-row order table inadvertently omitted "How it works" even though bucket-1 lists it as reused chrome AND the hero "How it works" ghost CTA targets `#how`. To avoid a dead anchor, `HowItWorks` is rendered in the process cluster (Test → **How** → Price), mirroring the home's Test→How adjacency. **PM: confirm placement (or drop the CTA) on the preview.**
- **Variables moved up** to immediately after Messages (open-question resolution from the plan) — now that it carries a sub-matched account-events example, the home-order adjacency (Messages→Variables) is restored.
- **Footer Farm + Fork links** route to `/messages` for v1 (intended targets noted inline: `/for/{sibling}`, the b2b-saas hub, `/10dlc-registration`, consent/opt-outs) — wire real targets as those pages ship.
- **H1 is a placeholder draft** ("User account text messaging for your app.") — flagged for refinement on the preview.

## Canon — current
- **DECISIONS.md** — D-436 appended. **REPO_INDEX** — decision count 351/D-436 + Meta lead (Session 139). **landing-page-craft.md** — ship-it skeleton + locked order recorded.
- **PROTOTYPE_SPEC** — NOT updated this session (the surface is new and unmerged; spec the `/for/{slug}` surface when it stabilizes/merges, per the doc's "updated as screens stabilize" rule).

## Carry-forwards (flagged, not done)
- **D-436 follow-ups:** a formal `urlSlug` field on the constraints `SubVertical` shape + a dynamic `/for/[sub]` registry land with the 2nd/3rd page (v1 keeps the short slug as a page-level constant). Sibling `/for/*` pages (Identity/SSO, Helpdesk, E-commerce) + the b2b-saas vertical hub + the `/10dlc-registration` and consent/opt-outs concept pages — the footer Farm + Paperwork Fork point at `/messages` until they ship.
- **PROTOTYPE_SPEC** entry for the `/for/{slug}` surface once it merges/stabilizes.
- **Still open from Session 138 — D-215 override** ("We get you approved in 2–3 days" live on the home `#rules`): PM still owes a reconciliation (D-number / PRE_LAUNCH_DEVIATIONS entry / revert). Unrelated to this branch but unresolved.
- **Standing (pre-existing):** sole-prop `/prototype` + `/src` UI session (D-433 copy + `has_ein="no"` flow-gating); dead `--color-text-headline-muted` token + globals.css light→dark dead-token collapse; migration `009_early_access_interest_tag.sql` apply-before-deploy; blog "configurator" voice rewrite; older merged-not-deleted `feat/*` branches — optional local cleanup.

## Branch state
**`feat/landing-developer-tools`** — 4 commits, pushed to `origin`, **unmerged**. PM/Joel review the Vercel preview before merge. `main` untouched this session.

## Untracked carryover — DO NOT COMMIT
- Only `.claude/settings.local.json` remains untracked.

## Next steps
- **PM:** review `/for/developer-tools` on the Vercel preview — confirm the HowItWorks placement, the H1 draft, and the authored copy (Moment / Details Q&A / Rest); check the animated hero (cross-fade + `prefers-reduced-motion`). Approve → merge `feat/landing-developer-tools`.
- Then: 2nd sub-vertical page (proves the pattern → triggers the `urlSlug` field + dynamic registry), or **Phase 2 — Session B (Sinch outbound delivery)** per MASTER_PLAN.
