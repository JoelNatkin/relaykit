# REPO_INDEX.md

> **Purpose:** Single source of truth for repo state — what files exist, what each is for, current-state pointers (active phase, decision count, master plan version, branch state, active explorations).
>
> Not for: session narratives, change-log entries, decision rationale, doc-by-doc audit trails, multi-paragraph context. Those live in git log, CC_HANDOFF, DECISIONS, or each canonical doc's own scope header.

## Meta

- Last updated: 2026-05-24
- Active phase: Phase 1 — Sinch Proving Ground (per MASTER_PLAN.md); pre-launch checklist complete; experiments 2b (inbound MO shape) and 4 (STOP/START/HELP) both complete (2026-05-24); experiment 3c (Simplified→Full brand upgrade) is the last remaining Phase 1 experiment before Phase 2 Session B kickoff
- Decision count: 330 active, latest D-415; D-01–D-83 archived. Marketing decisions: latest MD-20.
- Branch state: `main` only — no unmerged feature branches. Session 110 pushed one experiments commit direct on main (`8abc4c3` — Experiment 4 STOP/START/HELP capture, originally `ca83174` pre-amend); this close-out commit follows the mechanical-skip-review bar per Session 109 precedent.
- Active explorations: 1 — golden-path-gtm (strategy sketch; exploring). The configurator-authoring exploration remains at `/explorations/configurator-authoring.md` with its Session 106 promotion header intact — its Resolved §1–§5 are all shipped (Session 106 + the Session 107 fast-follows that built on them); Resolved §2 (configurator → workspace handoff) still awaits a workspace session.

## Active explorations

Sandbox space for product, strategy, and design ideas being prototyped before canonical commitment. See `/explorations/README.md` and `PM_PROJECT_INSTRUCTIONS.md` "Explorations (sandbox before canon)" for the workflow.

| Name | Status | Path | Description |
|------|--------|------|-------------|
| golden-path-gtm | exploring | `/explorations/golden-path-gtm.md` | Golden-path-led GTM strategy sketch — starter kits as the on-ramp — recast as one bet + three positioning calls (launch redefinition, verification posture, marketing posture). Supersedes the prior sla-led-gtm sketch. Not canon. |

## Canonical docs (root)

| File | Last touched | Purpose |
|------|-------------|---------|
| `README.md` | 2026-04-21 | Repo-root orientation; one-sentence pointers to canonical docs. |
| `REPO_INDEX.md` | 2026-05-24 (Session 110 close-out — Experiment 4 status flipped; new exp-04 fixture pointer; CC_HANDOFF row refreshed) | This file: doc inventory, current-state pointers, canonical-sources index. |
| `MASTER_PLAN.md` | 2026-05-24 (Session 108 — pre-launch checklist marked complete; Active focus rewritten for Phase 1 experiments 2b/3c/4 with Phase 2 Session B kickoff behind. No version bump — status correction only.) | Vision and roadmap — North Star, launch focus, ranked customer values, working principles, pre-launch checklist, phase list, active focus, out-of-scope. |
| `PM_PROJECT_INSTRUCTIONS.md` | 2026-05-22 (Session 103 — PM-behavior section compressed) | Canonical PM/Architect instructions (synced to Claude.ai UI). |
| `CLAUDE.md` | 2026-05-13 | CC standing instructions (session-start reads, code style, ledger stewardship, close-out). |
| `DECISIONS.md` | 2026-05-23 (Session 106 — D-415 added for the configurator compliance severity model. Session 105 added D-414 + D-379/D-381 `Note:` annotations; Session 104 added D-413.) | Active product decisions D-84+. |
| `DECISIONS_ARCHIVE.md` | 2026-05-13 | Archived decisions D-01–D-83. |
| `REPO_INDEX_CHANGE_LOG_ARCHIVE.md` | 2026-04-27 | Archived REPO_INDEX change-log entries (Sessions 1–49 era). |
| `PROTOTYPE_SPEC.md` | 2026-05-24 (Session 107 — §Configurator updated for "Variables"/"Insert variable" renames + chevron + double-click-to-edit behavior with both identity-token and non-identity branches; new subsection "Global mobile-input rule" covering the @media font-size 16px rule) | Screen-level UI specs for `/prototype` and stabilized marketing-site surfaces. |
| `WORKSPACE_DESIGN_SPEC.md` | 2026-05-13 | Post-signup workspace architecture (state machine, layout systems). |
| `MESSAGE_PIPELINE_SPEC.md` | 2026-05-13 | `/api` message pipeline (Session A complete, Session B addressed by Phase 2, Session C deferred). |
| `SDK_BUILD_PLAN.md` | 2026-05-13 | `/sdk` retrospective + Phase 8 delivery spec (README, AGENTS.md, npm publish). |
| `SRC_SUNSET.md` | 2026-05-13 | `/src` capability-to-phase map per D-358; retires when Phase 5 closes. |
| `CC_HANDOFF.md` | 2026-05-24 (Session 110 close-out — Experiment 4 STOP/START/HELP captured; Phase 4 consent-ledger architectural commitment surfaced; BDR question for Elizabeth Garner on Sinch internal opt-out tracking; 3c is the last remaining Phase 1 experiment) | Previous CC session state (transient, overwritten each close-out). |
| `BACKLOG.md` | 2026-05-24 (Session 107 — double-click variable entry retired as shipped; slash-command-for-variable-insertion entry added.) | Parked ideas; never build without explicit promotion. |

## Canonical docs (`/docs`)

| File | Last touched | Purpose |
|------|-------------|---------|
| `PRICING_MODEL.md` | 2026-05-13 | Tier definitions, costs, pricing logic. Canonical source for pricing facts. |
| `PRD_SETTINGS_v2_3.md` | 2026-05-13 | Settings business logic (rejection behavior, refund policy, error codes, notification triggers, account-vs-app field split). |
| `VOICE_AND_PRODUCT_PRINCIPLES_v2.md` | 2026-04-03 | Copy rules, vocabulary/framing tables, emotional-states map (Tier 1 project knowledge). |
| `UNTITLED_UI_REFERENCE.md` | 2026-04-27 | Design system tokens + component APIs (Tier 1 project knowledge). |
| `AI_INTEGRATION_RESEARCH.md` | 2026-04-17 | AGENTS.md / cursor-rules research informing Phase 8; retires when Phase 8 closes. |
| `CARRIER_BRAND_REGISTRATION_FIELDS.md` | 2026-04-30 | Sinch/TCR brand registration field reference (Experiment 3a capture). |
| `PRODUCT_SUMMARY.md` | 2026-05-24 (Session 107 — §3 configurator paragraph picks up the Variables rename + the double-click-jumps-to-where-the-variable-is-edited affordance) | Customer-experience-oriented summary of RelayKit (CC-maintained, PM-facing reference). |
| `LEGAL_DOC_DEFERRED_CLAIMS.md` | 2026-04-28 | Tracking doc for claims removed from `/marketing-site` legal docs pending feature ship, with restoration triggers. |
| `PRE_LAUNCH_DEVIATIONS.md` | 2026-05-21 (Session 101 — entry #3 "After:" aligned to the new post-strip live string) | Tracking doc for marketing-site pre-launch-posture copy/UI deviations, with per-entry pre-launch-only vs permanent classification and restoration triggers. |
| `VERIFICATION_SPEC.md` | 2026-05-13 | Canonical OTP/verification feature surface (server, SDK, dashboard, onboarding); drives D-369/D-370/D-371. |
| `MARKETING_STRATEGY.md` | 2026-05-16 | Marketing strategy: plays, MD-numbered decisions, channels, tools, sequencing. |
| `MARKETING_STRATEGY_ARCHIVE.md` | 2026-05-01 | Deprecated marketing approaches with deprecation triggers and revisit conditions. |
| `MESSAGE_AUTHORING_GUIDE.md` | 2026-05-22 (Session 103 — §7 STOP posture sharpened per D-412) | Canonical procedure for authoring a message-library category — method, message-shape rules, tone variants, technical disciplines, compliance baseline. |
| `TESTING_GUIDE_DRAFT.md` | 2026-05-01 | DRAFT — Phase 8 guide for AI tools building integration test/debug surfaces inside customer apps. |
| `VERTICAL_TAXONOMY_DRAFT.md` | 2026-05-17 (v0.4) | DRAFT — vertical-taxonomy thinking from Experiments 3a/3b; Phase 5 design prerequisite. |
| `BRAND_AUDIT.md` | 2026-05-07 | Stage 1 brand audit synthesis from 24 SaaS sites; informs Stage 2 brand direction. |
| `BRAND_AUDIT_LENS.md` | 2026-05-05 | Stage 1 operating mode for brand audit walks; retires when Stage 2 consumes outputs. |
| `SECURITY_DRAFT.md` | 2026-05-03 | DRAFT — canonical security posture, threat surface inventory, pumping defense detail (§3). |

## Canonical sources by topic

This index maps each major topic to its single canonical doc. Per the One Source Rule (PM_PROJECT_INSTRUCTIONS.md "Docs Hygiene"), every fact lives in exactly one canonical doc; other docs reference it, never restate it. Use this index to decide where a new fact lives, or where to look when surfaces disagree.

### Product
- Pricing facts (numbers, refund policy, tier definitions) → `docs/PRICING_MODEL.md`
- Phases / scope / out-of-scope / North Star → `MASTER_PLAN.md`
- Customer-experience narrative (PM-facing reference) → `docs/PRODUCT_SUMMARY.md`
- Voice / copy principles / kill list → `docs/VOICE_AND_PRODUCT_PRINCIPLES_v2.md`
- Parked ideas / Rejected table → `BACKLOG.md`

### UI / Design
- Screen-level UI specs (every prototype screen) → `PROTOTYPE_SPEC.md`
- Post-signup workspace architecture (state machine, layout systems) → `WORKSPACE_DESIGN_SPEC.md`
- Settings business logic (rejection-behavior model, refund policy, error-code mapping, notification triggers, account-vs-app field split) → `docs/PRD_SETTINGS_v2_3.md`
- Design system tokens + component APIs → `docs/UNTITLED_UI_REFERENCE.md`
- Brand audit (Stage 1 synthesis informing Stage 2 design direction + marketing-site facelift) → `docs/BRAND_AUDIT.md`

### Engineering
- Message pipeline behavior (`/api`) → `MESSAGE_PIPELINE_SPEC.md`
- SDK architecture / publication plan → `SDK_BUILD_PLAN.md`
- `/src` sunset capability map → `SRC_SUNSET.md`
- Carrier registration field knowledge (Sinch/TCR fields) → `docs/CARRIER_BRAND_REGISTRATION_FIELDS.md`
- Sinch experiment findings (recorded request/response shapes, timings, callback payloads) → `experiments/sinch/experiments-log.md`
- OTP/verification feature surface (server endpoint, SDK contract, dashboard panel, onboarding integration) → `docs/VERIFICATION_SPEC.md`
- Message-library authoring procedure (method, tone variants, technical disciplines, compliance baseline) → `docs/MESSAGE_AUTHORING_GUIDE.md`
- AI-integration developer-tool research (Phase 8 rationale) → `docs/AI_INTEGRATION_RESEARCH.md` (RETIRES when Phase 8 closes)

### Marketing
- Marketing strategy, plays, decisions (MD-numbered), channels, tools → `docs/MARKETING_STRATEGY.md`
- Deprecated marketing approaches (with deprecation triggers + revisit conditions) → `docs/MARKETING_STRATEGY_ARCHIVE.md`

### Process / governance
- Decision history (active D-84+) → `DECISIONS.md`
- Decision history (archived D-01–D-83) → `DECISIONS_ARCHIVE.md`
- PM standing instructions (synced to Claude.ai UI) → `PM_PROJECT_INSTRUCTIONS.md`
- CC standing instructions (operational, on-disk) → `CLAUDE.md`
- Repo doc inventory + active plan pointer → `REPO_INDEX.md` (this file)
- Session-to-session handoff (ephemeral, overwritten each session) → `CC_HANDOFF.md`

### Notes on the README exception
The repo-root `README.md` may paraphrase one-sentence summaries from any of these (e.g., "$49 to register and $19/month thereafter") for orientation, but may not restate full rules. `CLAUDE.md` inherits the same exception for orientation summaries. When in doubt, paraphrase and point.

### When this index drifts
If PM or CC discovers two docs that both claim canonical ownership of the same topic, flag for PM judgment per the One Source Rule. Update this index and the canonical doc together; never silently override.

## marketing-site blog (new — Session 89)

V1 blog scaffold per D-387 (in-repo MDX) and D-388 (cluster-primary taxonomy), built on branch `feat/blog-scaffold` (merged to main Session 90). Files added to the `marketing-site/` app:

| Path | Purpose |
|------|---------|
| `app/blog/page.tsx` | Chronological blog index. |
| `app/blog/[slug]/page.tsx` | Individual post page (SSG; OG/Twitter/canonical metadata + JSON-LD). |
| `app/blog/cluster/[name]/page.tsx` | Per-cluster index page (11 clusters). |
| `app/blog/feed.xml/route.ts` | RSS 2.0 feed. |
| `app/sitemap.ts` | Sitemap — static routes + blog posts + cluster pages (new file). |
| `app/robots.ts` | robots.txt with sitemap pointer (new file). |
| `lib/blog/types.ts` | Frontmatter + post TypeScript types. |
| `lib/blog/clusters.ts` | Cluster + lane registries — single source of truth for taxonomy. |
| `lib/blog/site.ts` | Site constants (`SITE_URL`, blog title/description/author, OG default). |
| `lib/blog/posts.ts` | MDX loader — reads/parses/validates frontmatter, computes reading time. |
| `lib/blog/format.ts` | Shared date formatter. |
| `lib/blog/mdx-components.tsx` | MDX element → styled component map (hand-rolled prose). |
| `components/blog/*` | `mdx-content`, `prose`, `post-header`, `post-card`, `cluster-badge`, `lane-badge`, `json-ld`. |
| `content/posts/*.mdx` | Blog posts (1 published: `adding-text-messages-to-your-app-shouldnt-take-a-month.mdx`). |
| `public/blog-og-default.png` | Static brand-default OG image. |

Modified: `app/layout.tsx` (added `metadataBase`); `components/footer.tsx` (Blog link, "Resources" column); `package.json` (new deps: `next-mdx-remote` v6, `gray-matter`, `reading-time`, `remark-gfm`, `remark-smartypants`, `rehype-pretty-code`, `shiki`, `feed`); `.env.example` (`NEXT_PUBLIC_SITE_URL`).

## Early-access waitlist (new — Session 90)

Early-access waitlist per MD-20 (DIY on Supabase + Resend over a hosted vendor), built on branch `feat/waitlist-modal` (merged to main). The three "Get early access" CTAs open an in-page modal; signups persist to Supabase and trigger a Resend welcome email. Files added:

| Path | Purpose |
|------|---------|
| `api/supabase/migrations/007_early_access_subscribers.sql` | `early_access_subscribers` table (applied via Supabase SQL Editor). |
| `marketing-site/app/api/early-access/route.ts` | POST — validate email, idempotent insert, welcome email for new signups. |
| `marketing-site/app/api/unsubscribe/route.ts` | GET — flips `unsubscribed_at` by token; permanent surface (list hygiene). |
| `marketing-site/lib/email/welcome.ts` | Welcome-email template builder (plain-text + HTML). |
| `marketing-site/lib/email/send.ts` | Resend wrapper; never throws. |
| `marketing-site/context/waitlist-context.tsx` | Modal open/close state + configurator-selection summary; provider at layout level. |
| `marketing-site/components/waitlist-modal.tsx` | The waitlist modal (Untitled UI; idle/loading/success/error). |
| `marketing-site/components/early-access-button.tsx` | Client button so server components can open the modal. |

Modified: `app/layout.tsx` (WaitlistProvider + modal mount); `app/page.tsx`, `components/top-nav.tsx`, `components/configurator-section.tsx` (CTAs rewired to the modal; configurator publishes its selection summary up); `package.json` (`resend` dep); `.env.example` (`RESEND_API_KEY`). Pre-launch posture deviations tracked in `docs/PRE_LAUNCH_DEVIATIONS.md`. The modal was design-polished Session 91 (`feat/waitlist-modal-design`) — founder voice, category pills, simplified success state.

## message-library (Session 91 scaffold; Session 94 Verification authoring; Session 95 configurator integration; Session 99 Account events authoring; Session 100 Order updates authoring + flat-message collapse, D-408; Session 101 Team alerts authoring; Session 102 Customer support + Appointments authoring; Session 103 Waitlist + Community + Marketing authoring — all 9 categories now live — + transactional in-body STOP fix, D-412)

Wave 2 message-library — a typed corpus of SMS message templates organized by category. Scaffolded Session 91 on `feat/message-library-scaffold`; Session 94 extended the schema corpus-wide (tone variants, per-category variable catalogs, compliance blocks) and authored Verification on `feat/verification-message-authoring` (merged to main). Session 95 (`feat/configurator-one-corpus`) added a category `description` field, made the home-page configurator consume the corpus directly (see "configurator" section below). Session 99 (`feat/account-events-authoring`) authored Account events and added the `account_link` variable. Session 100 (`feat/order-updates-authoring`) authored Order updates (then a `WorkflowCategory` with 7 stages); the same session then (`feat/flat-message-model`) collapsed the type system to a single flat-message model per **D-408** — the three-classification model (discrete / workflow / hybrid, with `Sub` and `Stage` wrappers) is deleted; every `Category` now has a flat `messages: Message[]` field directly. Sub.description and Stage.description carry verbatim into `Message.description`; Stage.triggerCue carries into `Message.groupNote` with lifecycle position prefixed (e.g. `"Order lifecycle — step 3 of 7: …"`). Both new fields are documentation-only this wave — the configurator does not render them; future workspace UX consumes them. Session 101 (`feat/team-alerts-authoring`) authored Team alerts as the 4th live category. Session 102 authored Customer support (`feat/customer-support-authoring`) and Appointments (`feat/appointments-authoring`) as the 5th and 6th live categories. Session 103 authored Waitlist, Community, and Marketing — **all nine categories are now populated and live**. Session 103 also added in-body STOP opt-out language to the three transactional categories that had shipped without it (account-events, order-updates, team-alerts) per **D-412**.

| Path | Purpose |
|------|---------|
| `marketing-site/lib/message-library/types.ts` | Type system — `TCRMapping` / `VariantTone` / `VariableSource` unions; `Variable`, `MessageVariant`, `Message`, `CategoryCompliance` interfaces; single flat `Category` interface with `messages: Message[]` (D-408 — no `Sub` / `Stage` wrappers, no classification discriminant). `Message` carries optional `tooltip` (operational hover), `description` (editorial, documentation-only this wave), and `groupNote` (sequence position, documentation-only this wave). |
| `marketing-site/lib/message-library/shared-variables.ts` | Cross-corpus variable catalog (`SHARED_VARIABLES` — business_name, workspace_name, customer_name, first_name); categories import the entries they use. |
| `marketing-site/lib/message-library/verification.ts` | Verification category — **populated** (Session 94, flat-collapsed Session 100): 4 messages / 12 tone variants, 3-variable catalog, 5-rule compliance block. Each message's `description` field carries the former Sub.description text verbatim. |
| `marketing-site/lib/message-library/account-events.ts` | Account events category — **populated** (Session 99, flat-collapsed Session 100): 5 messages / 15 tone variants, 5-variable catalog (workspace_name + account_link + card_last4 + days_remaining + device_context), 6-rule compliance block. account_link is the developer's own account/billing URL on their own domain (RelayKit does not shorten or host it); budgetChars 19, example "yourapp.com/billing" — static developer-domain placeholder. Each message's `description` field carries former Sub.description text verbatim. All 15 bodies carry in-body STOP opt-out (D-412, Session 103); max charCount 155/160. |
| `marketing-site/lib/message-library/order-updates.ts` | Order updates category — **populated** (Session 100): 7 messages in lifecycle order (Order confirmed → Order processing → Order shipped → Out for delivery → Order delivered → Return started → Refund processed) / 21 tone variants, 7-variable catalog (workspace_name + 6 SDK-payload tokens), 6-rule compliance block. `tracking_link` accepts well-known carrier-domain URLs (UPS/USPS/FedEx) and discourages public shorteners; `return_link` is the developer's own returns UI on their own domain — RelayKit does not shorten or host. All 21 bodies are ASCII-only and carry in-body STOP opt-out (D-412, Session 103 — order-updates also gained its STOP compliance rule); max charCount 160/160 at worst-case substitution. Each message carries `groupNote` with its lifecycle position + former Stage.triggerCue text (e.g. `"Order lifecycle — step 3 of 7: sent when order ships from warehouse or fulfillment partner."`). Governs against D-393/D-394/D-398/D-399/D-402/D-408/D-412. |
| `marketing-site/lib/message-library/team-alerts.ts` | Team alerts category — **populated** (Session 101): 9 messages in two-group order — 5 shift-lifecycle (shift-scheduled → shift-reminder → shift-change → shift-cancellation → shift-start) + 4 alert-event (system-alert, escalation-ping, on-call-page, service-level-alert) / 27 tone variants, 10-variable catalog (workspace_name + 9 specific: shift_date, shift_time, location, role, severity, alert_type, system_name, incident_id, action_link, escalation_to), 6-rule compliance block. `incident_id` and `action_link` are `typeConstrained: true`; `severity` has no default value (P0/P1, SEV1, Critical/High, Red/Yellow all valid per Session 93 §6). All 27 bodies ASCII-only and carry in-body STOP opt-out (D-412, Session 103); max charCount 144/160. Shift-lifecycle messages carry `Message.groupNote` with **straight hyphens** ("Shift lifecycle - step N of 5: …") rather than the em-dashes used in order-updates.ts — Session 101 PM ruling, with order-updates.ts em-dash alignment carry-forward bundling with the D-389/D-391/D-392/D-395/D-401 stale-language cleanup. Governs against D-393/D-398/D-399/D-402/D-408/D-412. |
| `marketing-site/lib/message-library/customer-support.ts` | Customer support category — **populated** (Session 102): 8 messages (5-step ticket lifecycle + 3 discrete support messages) / 24 tone variants, 7-token catalog (workspace_name + customer_name shared; ticket_number + agent_name + ticket_link + csat_link + eta), 6-rule compliance block, `tcrMapping: "CUSTOMER_CARE"`. customer_name is catalogued as a shared reference but used by no body. Max charCount 141/160 worst-case. All bodies ASCII-clean. Governs against D-393/D-398/D-399/D-408. |
| `marketing-site/lib/message-library/appointments.ts` | Appointments category — **populated** (Session 102): 7 messages in lifecycle order / 21 tone variants, 7-token catalog (workspace_name + customer_name shared; appointment_time + provider_name + reschedule_link + cancel_link + feedback_link), 6-rule compliance block, `tcrMapping: "ACCOUNT_NOTIFICATION"`. customer_name catalogued but used by no body. Max charCount 156/160 worst-case. All bodies ASCII-clean. Governs against D-392/D-398/D-399/D-402/D-408. |
| `marketing-site/lib/message-library/waitlist.ts` | Waitlist category — **populated** (Session 103): 6 messages in lifecycle order / 18 tone variants, 6-token catalog (workspace_name shared + queue_position, wait_estimate, claim_link, grace_window, rejoin_link), 6-rule compliance block, `tcrMapping: "ACCOUNT_NOTIFICATION"`. In-body STOP opt-out; all bodies ASCII-clean. Governs against D-393/D-398/D-399/D-402/D-408. |
| `marketing-site/lib/message-library/community.ts` | Community category — **populated** (Session 103): 9 messages (5 discrete + a 4-step onboarding sequence) / 27 tone variants, 9-token category-local catalog (`community_name` is the sender frame — locally defined, not from shared-variables; D-398's workspace_name frame does not apply), 5-rule compliance block, `tcrMapping: "ACCOUNT_NOTIFICATION"`. In-body STOP opt-out; all bodies ASCII-clean. Governs against D-393/D-398/D-399/D-402/D-408. |
| `marketing-site/lib/message-library/marketing.ts` | Marketing category — **populated** (Session 103): 4 messages / 12 tone variants, 9-token catalog (business_name shared + 8 specific), 8-rule compliance block (the largest; the sole D-399 promotional-content exception), `tcrMapping: "MARKETING"`. STOP-only in-body opt-out, never HELP-in-body (D-410); all bodies ASCII-clean. Governs against D-393/D-399/D-402/D-408/D-410. |
| `marketing-site/lib/message-library/index.ts` | Barrel — re-exports the type system, `SHARED_VARIABLES`, render helpers, the 9 category consts, the ordered `CATEGORIES` list, and `categorySubs`/`isAuthored`. |
| `marketing-site/lib/message-library/render.ts` | Corpus-native `{{token}}` rendering — `interpolateBody`, `extractTokens`, `flattenBody`, `resolveVariableExample`. |
| `audits/research/2026-05-16/[category].md` | 9 per-category lead-magnet research files (PM-authored; §6-resolved Session 93). |

## configurator one-corpus rewrite (Session 95)

The home-page configurator (`marketing-site/components/configurator-section.tsx`) rewritten on `feat/configurator-one-corpus` to consume the message-library corpus directly — the inline `VERTICALS` array retired. Verification renders live with expandable sub-checkboxes; the 8 unauthored categories render disabled "Coming soon"; visitor selections persist in `localStorage` (`relaykit_configurator`); 6 PostHog conversion events instrumented. The card editor stack (`marketing-site/lib/editor/`) was migrated from single-brace `{key}` to the corpus `{{double-brace}}` syntax. PM decision in planning: visitor "+ Add message" custom messages kept (with a required Name field, matching the workspace authoring shape).

| Path | Purpose |
|------|---------|
| `marketing-site/lib/configurator/use-configurator-state.ts` | `ConfiguratorState` + actions + `localStorage` persistence (key `relaykit_configurator`, version-gated, debounced). |
| `marketing-site/lib/configurator/compliance.ts` | Corpus-aware best-effort compliance (single-segment length, GSM-7 charset, Marketing opt-out). |
| `marketing-site/lib/configurator/session-context.tsx` | Holds the live `businessName` for variable previews. |
| `marketing-site/components/configurator/message-edit-card.tsx` | Corpus message edit card — tone pills, "Insert variable" picker, severity-tiered compliance row, double-click-routes-to-Variables-form chip behavior. Saves a `MessageEditDecision` (`{ kind: "tone" \| "custom" }`) via `setMessageEdit` per D-414; the prior `MessageOverride` shape was retired Session 106. |
| `marketing-site/components/configurator/custom-message-card.tsx` | Visitor custom-message authoring card (Name + body + Variable picker). |
| `marketing-site/components/configurator/{tooltip,coming-soon-badge}.tsx` | Leaf UI — `Tooltip` (instant hover open as of Session 98; `?` icon triggers + centered body) and the "Coming soon" badge. (`preset-dropdown.tsx` deleted Session 103 per D-411 with the Recommended-combinations dropdown removal.) |

## configurator mobile categories pattern (Session 98 — D-407)

Below `md:` (768px) the home configurator's categories panel collapses to a tappable summary row that opens a full-page mobile modal containing the full panel UI. Desktop unchanged via a shared `CategoryList` component. Built on branch `feat/mobile-categories-modal` (merged to main).

| Path | Purpose |
|------|---------|
| `marketing-site/components/configurator/category-list.tsx` | Shared presentational panel content — the "Categories" heading + 9 category cards. Consumed by both the desktop categories card and the mobile full-page modal so the surfaces stay byte-identical. Carries the `ConfiguratorCheckbox` helper. (The preset-dropdown JSX + `PRESETS` constant were removed Session 103 per D-411.) |
| `marketing-site/components/configurator/mobile-categories-summary.tsx` | Collapsed-state summary row (mobile only, `md:hidden`). "Categories" label + count-based summary text ("Select categories" / one name / two names / "Name1, Name2 +N more") + "Edit ›" affordance. Whole row is a 64px+ button that opens the modal. |
| `marketing-site/components/configurator/mobile-categories-modal.tsx` | Full-page mobile modal (`md:hidden`). Sticky header (44px X close, ESC support, body-scroll lock) + scrollable body rendering `<CategoryList>`. Body-scrolls (not shell-scrolls) layout pattern so the sticky header pins. Instant-apply — every toggle calls the same setter the desktop panel uses; modal stays open across selections. |

## configurator authoring layer (Session 106 — D-414 + D-415; Session 107 fast-follows)

The configurator becomes a lightweight authoring tool: per-category variable editing ("Variables" form — renamed from "Edit values" in Session 107 — desktop expander + mobile full-page modal), char-warning on read cards when a rendered message exceeds a single SMS segment, per-category and global reset kebabs that restore defaults, and a severity-tiered compliance model that gates Save on real carrier-compliance blockers while letting length warnings through. State lives in `categoryValues[catId]` with four buckets per category — `variables`, `customBodies`, `addedMessages`, `messageTones` (Resolved §1 of `/explorations/configurator-authoring.md`, now promoted). `STATE_VERSION` bumped 3 → 4 — pre-existing v3 state drops silently per the D-409 mergeStored precedent.

Session 107 added two affordance refinements and one CC_HANDOFF-watch-item resolution: the in-message "+ Variable" picker (Plus icon + "Variable" label) becomes "Insert variable" (label + trailing `ChevronDown`, no Plus icon — verb in the label, chevron is the menu-opens-here marker); double-clicking any variable chip in a preview jumps the visitor to where that variable is edited (top-of-page businessName input for identity tokens per D-413, Variables form with that input focused for non-identity tokens); Tiptap chip preview text refreshes reactively as the visitor types in the Variables form, via a new `CategoryVariablesContext` instead of frozen-at-mount extension options.

| Path | Purpose |
|------|---------|
| `marketing-site/components/configurator/edit-values-form.tsx` | Shared presentational "Variables" form — one labelled input per non-identity variable in the category's catalog (identity tokens filtered via `isIdentityToken` exported from `render.ts`), a "Used in: …" hint listing message names that reference each variable. Live onChange writes through `setCategoryVariable`. Consumed by both the desktop inline expander and the mobile full-page modal. Optional `focusVariableName` / `onFocusDelivered` props (Session 107) drive the double-click affordance — the effect focuses the matching input by id (`edit-values-{categoryId}-{variableName}`), positions the caret at the end, and signals upstream to clear the focus state. |
| `marketing-site/components/configurator/edit-values-modal.tsx` | Full-page mobile wrapper mirroring `MobileCategoriesModal` — sticky header (X close, ESC) + body-scroll lock + body-scrolls layout. Carries a JS-level `matchMedia("(max-width: 767.98px)")` viewport gate so the scroll-lock effect doesn't fire on desktop (where the desktop inline expander owns the surface) — `display: none` from `md:hidden` does not stop React effects. Passes `focusVariableName` / `onFocusDelivered` through to the form (Session 107). |
| `marketing-site/components/configurator/char-warning-icon.tsx` | AlertTriangle icon in `text-fg-warning-secondary` with a Tooltip ("Over 160 characters. This counts as 2 messages." — Session 107 copy update). Renders on read cards (both MessageReadCard and CustomMessageCard's read branch) between the message title and the edit pencil when `compliance.isOverSegmentLength` is true. Non-blocking — purely informational. |
| `marketing-site/components/configurator/kebab-menu.tsx` | Reusable DotsVertical overflow menu — same dropdown idioms as the Insert variable picker (outside-click + ESC close, `role=menu` items). Items pattern supports optional `destructive: true` rendering in `text-text-error-primary`. Used for the global "Reset all to defaults" (next to Copy) and per-category "Reset to defaults" (next to each Variables trigger); both render in normal `text-text-secondary` (D-415 reset framing — the action restores defaults, not destroys). |
| `marketing-site/lib/editor/category-variables-context.ts` | NEW (Session 107). React context module carrying per-category authored variable values to Tiptap NodeViews. Replaces the prior path through `VariableNode`'s extension options, which was a static snapshot at editor mount. `MessageEditor` wraps `<EditorContent>` in the Provider; `VariableNodeView` reads via `useContext` and re-renders reactively on value changes — no editor remount, no flicker, no focus loss. Resolves the Session 106 CC_HANDOFF watch item (Tiptap categoryVariables freezing at mount). |

State + compliance surface this commit also reshaped:
- `marketing-site/lib/configurator/use-configurator-state.ts` — `STATE_VERSION 4`; `ConfiguratorState.categoryValues: Record<string, CategoryValues>`; new actions `setMessageEdit` (replaces `setMessageOverride` — discriminated `{ kind: "tone" | "custom" }` decision), `setCategoryVariable`, `clearCategory`, `clearAll`. `AddedMessage` replaces `CustomMessage` as the type for visitor-authored messages, stored in `categoryValues[catId].addedMessages: AddedMessage[]` (array preserved per pressure-test §4b). `MessageOverride` / `OverrideTone` / `MessageState.override` / `CategoryState.customMessages` retired.
- `marketing-site/lib/configurator/compliance.ts` — `ComplianceResult.issues: ComplianceIssue[]` where each issue carries `severity: "blocker" | "warning"` (D-415). `isCompliant` re-defined as "no blockers". `isOverSegmentLength: boolean` surfaced separately for the read-card warning gate.
- `marketing-site/lib/message-library/render.ts` — `resolveVariableExample` / `interpolateBody` / `flattenBody` accept an options arg `{ businessName?, categoryVariables? }`. Resolution order: identity token → `categoryVariables` → corpus default. New exported `isIdentityToken(name)` helper.
- `marketing-site/lib/editor/{variable-node,variable-node-view,message-editor}` — Session 107 refactor: `categoryVariables` moved off `VariableNode.configure(...)` and onto the new `CategoryVariablesContext`; `VariableNode.options` gains `onVariableDoubleClick(name)` which the NodeView wires through `onDoubleClick` (preventDefault + stopPropagation); `MessageEditor` accepts the callback as a prop and exposes it through a mutable ref so the extension always reaches the latest closure without rebuilding the extensions array.

Session 107 also added a global mobile-input rule at `marketing-site/app/globals.css` (single `@media (max-width: 767.98px)` block forcing `font-size: 16px !important` on inputs/textareas/selects to kill iOS auto-zoom). Replaces the per-input `text-base` patch that was previously on the waitlist email input — single source of behavior for the entire marketing site.

## Subdirectories

- `/docs/archive` — superseded PRDs and old strategy
- `/audits` — audit sweep outputs; process defined in `audits/audits-README.md`. Current outputs: `audits/prototype-inventory-2026-05-13.md` (read-only inventory of /prototype/ that drove the Session 87 archive operation). `audits/research/2026-05-16/` holds the 9 per-category lead-magnet research files for the Wave 2 message-library workstream (templates scaffolded Session 91; research content + §6 RESOLVED/DEFERRED/D-link resolutions populated 2026-05-17, Session 93).
- `/explorations` — sandbox files (see Active explorations above)
- `/experiments` — Phase 1 Sinch proving-ground throwaway code. Findings + fixtures captured in `experiments/sinch/experiments-log.md`. Status as of 2026-05-24: Experiments 1/1b/2a/3a/3b/2b/4 complete; 3c (brand SIMPLIFIED→FULL upgrade) is the last remaining Phase 1 experiment. 2b added fixture `experiments/sinch/fixtures/exp-02b-mo-inbound.json` (bidirectional MO + DR capture, 217 lines); Experiment 4 added fixture `experiments/sinch/fixtures/exp-04-keyword-handling.json` (5-round STOP/HELP/START capture: 3 MOs + 6 success-side DRs, 593 lines)
- `/prototype/archive` — files removed from the active prototype on 2026-05-13 (Session 87 bulk archive); source paths mirrored; see `prototype/archive/README.md` for the un-archive procedure
