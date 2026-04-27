# Docs Audit — 2026-04-27
**Snapshot:** 21 canonical docs (13 root + 8 in `/docs/`) audited against MASTER_PLAN v1.2, D-365 latest, Phase 1 mid-flight (Experiment 3b PENDING_REVIEW). Audited via 21 parallel subagents, one per doc, against a fixed six-section rubric (path/lines, last substantive update, canonical content, cross-doc overlap, drift, verdict).

> **What this is:** A read-only findings report. No doc edits, no canonical-source index added to REPO_INDEX.md, no CLAUDE.md edit, no D-numbers produced. Verdicts are proposed for PM + Joel triage; nothing is executed by this audit. Cleanup is a separate, gated session per verdict slice.
>
> **Pre-condition note:** Many root canonical docs show "Last touched: 2026-04-21" in REPO_INDEX.md L36–52, but `git log` indicates real last-touch dates of 2026-04-26 for at least 7 of them (DECISIONS.md, CC_HANDOFF.md, PROTOTYPE_SPEC.md, PM_PROJECT_INSTRUCTIONS.md, CLAUDE.md, BACKLOG.md, REPO_INDEX.md itself). REPO_INDEX's own "Last touched" column is the audit's primary input, and it's stale. The findings below adjust against actual git timestamps where it matters.
>
> **Out of scope:** /audits/ (dated convention), /experiments/ (active working area), /docs/archive/, /docs/plans/, /docs/superpowers/, code dirs, README.md (38-line pointer-only doc).

## Summary

| Verdict | Count |
|---|---|
| ARCHIVE | 1 |
| SCOPE-CLARIFY | 1 |
| CONSOLIDATE INTO | 0 |
| KEEP + UPDATE | 13 |
| RETIRE WHEN {milestone} | 1 |
| KEEP AS-IS | 5 |
| **Total** | **21** |

## Summary table (verdict-ordered)

| # | Doc | Verdict | One-line reason |
|---|---|---|---|
| 1 | docs/STARTER_KIT_PROGRAM.md | **ARCHIVE** | Strategic premise (first-party starters) explicitly retired by MASTER_PLAN §13 + §16; lacks deprecation header; risks future-session misread |
| 2 | docs/PRD_SETTINGS_v2_3.md | **SCOPE-CLARIFY** | Screen-level UI specs duplicated in PROTOTYPE_SPEC; should retain rejection-behavior model + notification triggers + account-vs-app architecture only |
| 3 | WORKSPACE_DESIGN_SPEC.md | KEEP + UPDATE | Substantive update needed: header date stamp 19 days behind reality; "Phase 3.7 NEXT" describes shipped work; route table contradicts D-345; key-decisions list ends at D-333 |
| 4 | MESSAGE_PIPELINE_SPEC.md | KEEP + UPDATE | Session B "GATED on Phase 1" prose overtaken by 4–5 days of recorded findings; status-enum needs intermediate state per Exp 2a; callback receiver scope missing |
| 5 | docs/UNTITLED_UI_REFERENCE.md | KEEP + UPDATE | Largely unmodified upstream Untitled UI import — documents Vite/`src/`-rooted project, advertises component APIs not used in `/prototype`, ~30 tokens not wired in globals.css |
| 6 | PROTOTYPE_SPEC.md | KEEP + UPDATE | Header date stale (Apr 19 vs. actual 2026-04-26); D-239 alerts described as live despite D-364 deferral; L74 stale "$150 go-live fee" copy citing superseded D-216 |
| 7 | REPO_INDEX.md | KEEP + UPDATE | Self-audit: 9 stale "Last touched" rows; L140 still uses old Experiment 4+5 numbering; Meta paragraphs bloated into session-narrative |
| 8 | MASTER_PLAN.md | KEEP + UPDATE | §1 "State of Things (April 20, 2026)" pre-dates Phase 1 active state; L236 still says "Experiments 3 and 4"; L468 footer still says "v1.0"; L131 Exp 1 prose contradicted by silent-drop finding |
| 9 | BACKLOG.md | KEEP + UPDATE | ~7 entries aged into in-scope phases; multiple §16-out-of-scope duplicates without pointers; L3 header date 19 days stale |
| 10 | docs/PRODUCT_SUMMARY.md | KEEP + UPDATE | §13 restates pricing numbers (One Source Rule violation); §3/§4/§5/§6 edge into PROTOTYPE_SPEC's lane; §14 kill-list reproduces VOICE_AND_PRODUCT_PRINCIPLES content |
| 11 | DECISIONS.md | KEEP + UPDATE | D-350–D-362 (13 decisions) lack now-required `**Supersedes:**` field; prior 2026-04-24 audit's §A-1 + §C-2 items remain open |
| 12 | DECISIONS_ARCHIVE.md | KEEP + UPDATE | Residual missing inline supersession annotations: D-27 (price), D-60, D-61, D-82; D-61 ↔ D-83 reciprocal annotation missing |
| 13 | docs/PRICING_MODEL.md | KEEP + UPDATE | Internally healthy at v6.0; cross-doc drift is the issue (PROTOTYPE_SPEC L74 + PRODUCT_SUMMARY L206–212); stale "replaces PRD_01" framing in L5/L265 |
| 14 | PM_PROJECT_INSTRUCTIONS.md | KEEP + UPDATE | Header date 2 days behind last commit; "magic link auth" phrasing not aligned with CLAUDE.md's passwordless-email clarifier; Tier 2 list disagrees with REPO_INDEX |
| 15 | SDK_BUILD_PLAN.md | KEEP + UPDATE | Internal §1 cross-references say §5b/§5c/§5d (actual headers are §4b/§4c/§4d); D-360 + D-361 missing from §6 table; cursor rules + per-builder guides scope unclear |
| 16 | docs/AI_INTEGRATION_RESEARCH.md | **RETIRE WHEN Phase 8 closes** | Currently load-bearing rationale source for Phase 8; §8 first-party starter plan explicitly retired by MASTER_PLAN Phase 9; archive once Phase 8 ships operational artifacts |
| 17 | CLAUDE.md | KEEP AS-IS | Current, internally consistent, correctly partitioned vs. PM_PROJECT_INSTRUCTIONS; one cross-doc flag is REPO_INDEX's gap, not CLAUDE.md's |
| 18 | SRC_SUNSET.md | KEEP AS-IS | `/src` freeze holds, capability map remains accurate, no Phase 2–5 rebuild has shipped to require Status flips; retirement trigger distant (Phase 5 close) |
| 19 | CC_HANDOFF.md | KEEP AS-IS | Ephemeral by design; format meets CLAUDE.md L112–121 spec and exceeds it usefully; One Source Rule respected |
| 20 | docs/CARRIER_BRAND_REGISTRATION_FIELDS.md | KEEP AS-IS | Single-commit doc accurately scoped to Exp 3a Simplified-tier capture; FULL-tier addition correctly deferred to 3c execution |
| 21 | docs/VOICE_AND_PRODUCT_PRINCIPLES_v2.md | KEEP AS-IS | Doc itself is in good shape; the one drift is *outbound* (CLAUDE.md L124 "Copy rule" describes v1.1 structure not v2 structure) |

---

## Per-doc full findings

### 1. docs/STARTER_KIT_PROGRAM.md — ARCHIVE

**Path + lines:** `docs/STARTER_KIT_PROGRAM.md` — 461.

**Last substantive update:** `2026-04-17 18:56:40` (substantive — added §§12–19). Prior commit 2026-04-03 (creation). Two commits ever. Self-described status: `BACKLOG — Post-Launch Initiative`. Predates Phase 0 close (Session 41, 2026-04-21) and the v1.2 MASTER_PLAN amendment. Stale by strategy reversal, not just by calendar.

**Canonical content:** Strategy and build plan for first-party RelayKit-built open-source starter kits (per-vertical Next.js scaffolds with Supabase + Stripe + RelayKit pre-integrated, distributed on `github.com/relaykit/starter-{vertical}`).

**Overlap:**
- **MASTER_PLAN.md §13 (Phase 9):** Direct topic conflict. MASTER_PLAN §13 names Phase 9 "Starter Kit **Integration** Validation" and explicitly states "We don't build our own starters (the previous plan). We integrate into existing ones." MASTER_PLAN §16 lists "Starter kits we build ourselves — superseded by third-party starter integration strategy" as out of scope.
- **REPO_INDEX.md L64:** already labels this doc "superseded by MASTER_PLAN Phase 9" — supersession is acknowledged at index level but not yet reflected inside the doc.
- **AI_INTEGRATION_RESEARCH.md:** heavy overlap on AGENTS.md template, `lib/relaykit/` module pattern, validation-gate concept. AI_INTEGRATION_RESEARCH §"Relationship to STARTER_KIT_PROGRAM.md" L447–453 directly references and partially modifies this doc.
- **SDK_BUILD_PLAN.md §6:** `lib/relaykit/client.ts` + `notifications.ts` pattern duplicated. One Source Rule candidate (SDK pattern should live in SDK_BUILD_PLAN).

**Drift:**
- §5 pricing template ($49 + $150 go-live + $19/mo) **directly contradicts current pricing per D-365/D-320** ($49 single payment, no $150 split). Same drift in §11. Concrete factual error in publishable copy template.
- §4 cites D-216 (partially superseded by D-320 on dollar-amounts dimension).
- §4 "SDK (validated, D-265–D-278)" — D-266 superseded D-265.
- §7 + §11 reference "consolidated PRD" Priorities 1–3; `RELAYKIT_PRD_CONSOLIDATED.md` archived 2026-04-21. Pointer broken.
- §4 references PRD_02; §9 references PRD_07 + PRD_10 — all retired with consolidated PRD.
- §12 "Supabase (Postgres + Auth, magic-link)" — voice/precision drift (D-59 reframes as passwordless email).
- **Whole-doc framing drift:** §1 + §3 describe the strategy MASTER_PLAN §16 has explicitly retired. Reader landing on this doc cold would believe RelayKit is building 5–10 of its own starter repos.
- **No deprecation header.** Unlike `RELAYKIT_PRD_CONSOLIDATED.md` and `CURRENT_STATE_AUDIT.md` (both archived with two-line blockquote deprecation headers per Session 42 pattern).

**Verdict:** **ARCHIVE NOW.** Not "RETIRE WHEN Phase 9" — when Phase 9 activates, the active spec is MASTER_PLAN §13 + AI_INTEGRATION_RESEARCH.md, not this doc. Recommended action mirrors the Session 42 pattern: `git mv docs/STARTER_KIT_PROGRAM.md docs/archive/STARTER_KIT_PROGRAM.md`, prepend a two-line deprecation blockquote citing retirement date + reason + "See instead" pointers to MASTER_PLAN §13 and AI_INTEGRATION_RESEARCH.md. Salvage targets pre-archive: §16 AGENTS.md template (move to SDK_BUILD_PLAN.md §6 or a new starter-integration spec when Phase 9 nears), §12 stack-choice rationale. Minimum action if full archive is too aggressive: add the missing two-line deprecation blockquote at the top **now** — REPO_INDEX-only annotation is not load-bearing enough to keep §5 pricing block from being read as live guidance.

---

### 2. docs/PRD_SETTINGS_v2_3.md — SCOPE-CLARIFY

**Path + lines:** `docs/PRD_SETTINGS_v2_3.md` — 591.

**Last substantive update:** `2026-04-16 08:49:46` (substantive — V2.3 Account Settings + avatar dropdown delta). Single commit on the file (older versions overwritten in place rather than archived; no `PRD_SETTINGS_v2_2.md` etc. in `docs/archive/`).

**Canonical content (mixed):**
- **Genuinely unique:** §5 Rejection Behavior model (Scenario A process-failure vs. Scenario B AUP-violation, refund policy, error-code mapping) — not present in PROTOTYPE_SPEC, WORKSPACE_DESIGN_SPEC, or MASTER_PLAN.
- **Genuinely unique:** §8 Account Settings page architecture (more than D-347's one-paragraph entry).
- **Marginally unique:** §4.5 Notification triggers matrix — operational reading of D-348.
- **Duplicated in PROTOTYPE_SPEC:** Sections 2, 4 (UI bodies), 8 (layout), 11 (section-order matrix).

**Overlap (heavy with PROTOTYPE_SPEC):**
- PROTOTYPE_SPEC L589–668 re-specifies layout, navigation, page heading, all five sections — already in PRD §2 + §4.
- PROTOTYPE_SPEC L671–684 re-specifies entire `/account` page — already in PRD §8.
- PROTOTYPE_SPEC L21 restates PRD §2 with explicit pointer "(PRD_SETTINGS v2.3 §2; implements D-347)."
- PROTOTYPE_SPEC L686–688 restates PRD §4.5 layout.
- WORKSPACE_DESIGN_SPEC L77/L86/L92/L253/L305–317 — upstream-architectural; modest overlap.
- PRICING_MODEL: PRD §4.4 surfaces pricing facts — One Source Rule violation (PRICING_MODEL is canonical).

**Drift:**
- **H1 wording divergence.** PRD §2 says "Settings"; PROTOTYPE_SPEC L595 says "App settings"; code (`prototype/app/apps/[appId]/settings/page.tsx:271`) reads "App settings". PRD is stale — code wins per CLAUDE.md.
- D-347 reference span: header claims alignment "through D-348"; current ledger is D-365.
- §4.4 marketing pricing not numerically rechecked against PRICING_MODEL.md v6.0.
- Open Question #6 (Ask Claude panel) likely obsolete — pattern now standardized in PROTOTYPE_SPEC.
- §12 Component Structure describes a future production port that has not yet happened.
- "Interim note" in §4.1 that V2.3 changelog claimed to have removed is still present.

**Verdict:** **SCOPE-CLARIFY** — partial consolidation pass. Specific actions for PM:
1. Strip §2 layout, §4 section UI specs, §8 layout/card UI specs — replace with one-line pointers to PROTOTYPE_SPEC sections.
2. Resolve H1 mismatch (code wins).
3. Delete residual "Interim note" in §4.1.
4. Refresh "alignment" header from "through D-348" to current ledger.
5. Decide whether §12 production component-structure is still useful.
6. Resolve Open Question #6.

ARCHIVE not justified — §5 rejection-behavior model is referenced as authoritative by PROTOTYPE_SPEC L637 and would orphan that reference.

---

### 3. WORKSPACE_DESIGN_SPEC.md — KEEP + UPDATE (substantive)

**Path + lines:** `WORKSPACE_DESIGN_SPEC.md` — 482.

**Last substantive update:** Last meaningful content addition `2026-04-10` (right rail state matrix). Last substantive overhaul `2026-04-07 (Session 25)`. Most recent commit `2026-04-21` was a touch (rk_test_ flip). Self-stamp at L3 still reads "Updated: April 7, 2026 (Session 25)". MASTER_PLAN §10 Phase 6 (April 20, 2026) treats wizard→workspace as broken for non-Appointments verticals; this doc has not been updated against that framing.

**Canonical content:** Architectural intent for the wizard-to-workspace flow: registration-state machine (six states), three layout systems, route-behavior table by state, page-structure evolution by state, and the decision rationale chain D-279/D-293/D-300+. Owns the *why and where* of the workspace; not the pixels.

**Overlap:**
- **PROTOTYPE_SPEC.md (heavy, partial drift):** Steps 1–10 (L106–L243) include screen-by-screen prose with route, heading text, body copy, input placeholders, button widths, prototype state cyclers, sessionStorage keys, and pixel widths. All screen-level UI spec, which the One Source Rule assigns exclusively to PROTOTYPE_SPEC. PROTOTYPE_SPEC L148 explicitly defers wizard layout architecture here — pointer correct in direction but the source doc still restates screens.
- **PRD_SETTINGS_v2_3.md:** Settings stub L305–L323 sketches Building / Post-Registration. PRD_SETTINGS is canonical (591 lines). Add a one-line pointer.
- **PRODUCT_SUMMARY.md (clean):** Audience separation holds.
- **DECISIONS.md:** Heavy reference (lines 332–368). Most are correctly summarized one-liners.

**Drift (specific):**
- L3 date stamp "Updated: April 7, 2026 (Session 25)" — file has been touched twice since (Apr 10 right-rail matrix, Apr 21 rk_test_ flip).
- **L249** — "current prototype still has the tabbed Overview/Messages/Settings structure" is now false (PROTOTYPE_SPEC L247 — single-page workspace shipped per D-332).
- **L411** — "Phase 3.7: Single-Page Workspace Build (NEXT)" describes work PROTOTYPE_SPEC describes as done.
- **L398/L402/L404/L406/L408** — phase status tags use Session 25 timestamps; later sessions not reflected.
- **L332–L368 "Key Decisions Referenced" list ends at D-333 (pending).** Decision ledger is at D-365. Decisions central to current workspace (D-335/D-337/D-338/D-339/D-340/D-342/D-343/D-344/D-345/D-347/D-349/D-351/D-353) are absent. D-330–D-333 still annotated "(pending)" though D-332 is now active and load-bearing.
- **L77/L78/L86/L87/L93** — workspace route is `/apps/[appId]/messages`. D-345 made workspace root `/apps/[appId]` with `/messages` retained only as backward-compat redirect. Route table contradicts D-345.
- **L252** — "Top bar: ... Settings (icon/link) | Sign out". PROTOTYPE_SPEC L352 specifies a gear icon (icon-only) plus avatar dropdown (Sign out lives in dropdown, not top bar).
- **L414** — Phase 3.9 "Wire Wizard Data Into Messages" is what MASTER_PLAN §10 Phase 6 calls "vertical hydration"; framed as 9th internal sub-phase of Phase 3 with no link to canonical phase plan.

**Verdict:** **KEEP + UPDATE** — substantive update needed, not a rewrite. Architectural skeleton is still correct in shape and load-bearing. Five concrete drifts to address: (a) header date + Session stamp, (b) reconcile "Phase 3.7 NEXT" with shipped reality, (c) workspace-root route per D-345, (d) extend Key Decisions list past D-333, (e) link internal "Phase 3.9" to MASTER_PLAN §10 Phase 6 "Vertical Hydration". Separately: prune L106–L243 step-by-step screen prose down to architectural anchors and let PROTOTYPE_SPEC own screen text per One Source Rule (~140 lines of screen-level UI duplicated).

---

### 4. MESSAGE_PIPELINE_SPEC.md — KEEP + UPDATE (substantive)

**Path + lines:** `MESSAGE_PIPELINE_SPEC.md` — 338.

**Last substantive update:** `2026-04-21 12:31` — "Group C: Consent API + Session B gating". Only two commits ever. Spec last edited 2026-04-21; `experiments/sinch/experiments-log.md` has been touched 5+ times since with substantive findings (2026-04-24 Exp 2a, 2026-04-25 Exp 3a, 2026-04-26 ×3 Exp 3b/2b/3c). Spec stale w.r.t. its own gating claim.

**Canonical content:** Build spec for `/api` message-delivery pipeline — pipeline architecture, Session A foundation, Consent API surface, Session B/C build prompts. Per One Source Rule, "Pipeline behavior → MESSAGE_PIPELINE_SPEC.md only."

**Overlap:**
- **Status-enum overlap with SDK_BUILD_PLAN.md:** Spec L50 declares `'queued' | 'sent' | 'delivered' | 'failed'` for `MessageContext.status`. SDK_BUILD_PLAN §8 declares `SendResult.status` as `'sent' | 'queued' | 'blocked' | 'failed'` (D-362). **Disagreement on two values.** Spec has `'delivered'` SDK doesn't; SDK has `'blocked'` (consent/opt-out terminal) spec doesn't.
- **Endpoint surface overlap with SDK_BUILD_PLAN.md §9:** Both enumerate `POST /v1/messages`, `POST /v1/consent`, `GET/DELETE /v1/consent/:phone`. SDK_BUILD_PLAN additionally lists `GET /v1/messages/:id` which spec does not mention.

**Drift (specific, ranked):**

A. **"Session B GATED" prose where findings have arrived (PRIMARY):**
- L17, L158–160 ("GATED — Phase 1 experiments first"). Reality: Exp 1 + 2a have produced exactly the recorded shapes the gate condition demands. Latency captured (Exp 1: 240ms send-path ack; Exp 2a: 1.769s callback delay). Failure modes captured (silent-drop @ carrier on unregistered traffic; HTTP 403 `missing_callback_url`; callback `statuses[].code: 310`).

B. **Status-enum semantics need revising per Exp 1 silent-drop finding (CRITICAL):**
- L50, L95: 4-value enum has no intermediate state between `'sent'` and `'delivered'`.
- Exp 1 (experiments-log L60, L65–66): unregistered 10DLC silently drops despite 201 from Sinch.
- Exp 2a (experiments-log L201): explicitly states `'sent'` should mean "submitted to carrier" at api-request time; terminal states from callback; intermediate "submitted, awaiting callback" state required.

C. **Missing references / coverage:**
- **Delivery-report callback receiver is not in the spec at all.** MASTER_PLAN §6 L151 commits Phase 2 to porting the Exp 2a Worker into `/api`. CC_HANDOFF L140 explicitly notes this as kickoff catch-up.
- **No mention of webhook signature verification** (experiments-log L199 flagged: "No signature / HMAC header on the callback").
- **Auth shape under-specified.** Spec L200 specifies `Authorization: Bearer {apiToken}`. Exp 1 (experiments-log L54, L64) clarifies this must be the legacy XMS API token, NOT the OAuth2 Project Access Key. Spec doesn't disambiguate.
- **`carrier_message_id` ID format.** Exp 1 finding: ULID (26 chars), not UUID. Spec table L97 says only `TEXT`.

D. **Session C status drift:** Spec L18 says "NOT STARTED". REPO_INDEX L141 + MASTER_PLAN §6 L174 both say DEFERRED to post-launch.

E. **EIN verification "Future additions" drift:** Spec L323–327 says "Blocked on Sinch registration flow details." Partially resolved as of Phase 1 — Exp 3a findings + `docs/CARRIER_BRAND_REGISTRATION_FIELDS.md` now document the field surface.

F. **Phase numbering reference:** Spec L17 + L160 cite "MASTER_PLAN §5" as the gate authority — correct for the experiments, but should also reference §6 (Phase 2 in-scope work).

G. **D-362 not referenced** despite directly governing the SDK side of the pipeline boundary.

**Verdict:** **KEEP + UPDATE.** Spec is structurally sound, correctly scoped under One Source Rule, accurate for Session A and Consent API (both COMPLETE), uses live D-numbers. Entire Session B section reflects pre-Phase-1 hypothesis state overtaken by 4–5 days of recorded experimental findings: status-enum needs intermediate state, callback-receiver scope missing entirely, Sinch auth-token disambiguation missing, ULID format guidance missing, signature-verification design missing. Session C status drifts from REPO_INDEX/MASTER_PLAN. Substantive Session B revision pass needed before CC executes the Session B kickoff prompt at L242.

---

### 5. docs/UNTITLED_UI_REFERENCE.md — KEEP + UPDATE (substantive)

**Path + lines:** `docs/UNTITLED_UI_REFERENCE.md` — 816.

**Last substantive update:** `2026-03-31` (touch only — repo-cleanup batch). File appears imported as upstream Untitled UI documentation and not substantively edited for RelayKit fit since. REPO_INDEX L63 marks "(stable)".

**Canonical content:** Tier 1 design-system reference (semantic-color token tables L706–816, component API reference L341–688, `Aria*` aliasing convention).

**Overlap (clean at headline level):**
- CLAUDE.md L15–21 restates four headline rules with explicit pointer "Full token tables and component APIs: `docs/UNTITLED_UI_REFERENCE.md`."
- PROTOTYPE_SPEC.md L54 same pattern.

**Drift (substantive):**

a. **Documents a project that doesn't exist in this repo.** L8–13 describe React 19.1.1 + Vite + port 5173. Repo runs Next.js 15 + port 3001. L65–71, L73–91 describe upstream Untitled UI starter rooted at `src/`. **L317–325** point at `src/utils/cx.ts`, `src/styles/theme.css`, `src/styles/typography.css`, `src/hooks/`, `src/providers/theme.tsx`, `src/providers/router-provider.tsx` — none of these paths exist in `/prototype` or `/api`.

b. **Component APIs document imports the codebase doesn't use.** L348/L385–386/L429–430/L487/L522/L551–552/L594/L639 advertise imports like `import { Button } from "@/components/base/buttons/button"`. None of these directories exist in `/prototype/components/`. PROTOTYPE_SPEC.md L54 explicitly states "No Untitled UI base components imported in prototype." Entire L339–688 documents an API the project does not consume.

c. **Token tables list tokens not wired in `globals.css`.** Prototype's `globals.css` (167 lines, 61 semantic-color definitions) is a strict subset of doc L710–816. Examples NOT defined: `text-primary_on-brand`, `text-secondary_on-brand`, `text-tertiary_on-brand`, `text-quaternary_on-brand`, `text-brand-secondary_hover`, `text-placeholder_subtle`, `border-secondary_alt`, `border-brand_alt`, `bg-active`, `bg-overlay`, `bg-tertiary`, `bg-quaternary`, `bg-secondary_alt`, `bg-secondary_subtle`, `bg-secondary_hover`, `bg-disabled_subtle`, `bg-brand-primary_alt`, `bg-brand-section`, `fg-secondary_hover`, `fg-tertiary_hover`, `fg-quaternary_hover`, `fg-brand-primary_alt`. Using any silently fails.

d. **Icon library scoping.** L196–244 mentions `@untitledui/icons` AND `@untitledui/file-icons` and `@untitledui-pro/icons` (4,600 icons, "Requires PRO access"). RelayKit only uses `@untitledui/icons`. Documenting Pro/file-icons invites license-violating imports.

e. **`ShieldCheck`/`ShieldTick` gotcha is missing.** CLAUDE.md L20 and PROTOTYPE_SPEC.md L54 both surface this gotcha; canonical reference doc does not (zero `ShieldTick`/`ShieldCheck` mentions).

**Verdict:** **KEEP + UPDATE.** Substantively stale — needs a RelayKit-fit pass. Headline conventions accurate; doc is largely unmodified upstream import. PROTOTYPE_SPEC L54 already pre-corrected the most important fact, but canonical reference itself still implies the opposite. Recommended one-pass edit: (a) replace L73–91 project-structure block + L313–325 file-paths with RelayKit's actual layout, (b) preface L339–688 with banner clarifying upstream-reference status, (c) trim/annotate L706–816 token tables to flag wired-vs-upstream-only, (d) add `ShieldCheck`→`ShieldTick` gotcha to a "RelayKit-specific gotchas" section.

---

### 6. PROTOTYPE_SPEC.md — KEEP + UPDATE

**Path + lines:** `PROTOTYPE_SPEC.md` — 968.

**Last substantive update:** `2026-04-26 08:27` — "D-365 + PROTOTYPE_SPEC for /start/verify consent disclosure". Substantive — extended `/start/verify` Step 4 (line 205) with locked D-365 consent-disclosure copy. **L3 "Last updated: April 19, 2026" header is internally inconsistent with its own body** (L205 references D-365 from 2026-04-26).

**Canonical content:** Per One Source Rule, canonical home for screen-level UI specs for `/prototype` — what each screen looks like, behaves, and the glue code (file paths, sessionStorage keys, component file references, layout rules, state matrices).

**Overlap:**
- **WORKSPACE_DESIGN_SPEC.md:** Both describe `/start/*` wizard, `/apps/[appId]` shell, layout split, messages/setup/get-started screens. WORKSPACE owns *architecture*; PROTOTYPE_SPEC owns *mechanics*. Boundary mostly clean; PROTOTYPE_SPEC L148 defers wizard layout architecture correctly.
- **docs/PRODUCT_SUMMARY.md:** PRODUCT_SUMMARY narrates outcome and behavior; PROTOTYPE_SPEC is the implementation contract. CLAUDE.md L120–124 explicitly distinguishes them. Boundary clean by design.
- **docs/PRD_SETTINGS_v2_3.md:** PROTOTYPE_SPEC §Settings (L589–693) restates section-by-section contents. L591 + L673 explicitly point at PRD as source. Some duplicated facts; PROTOTYPE_SPEC correctly framed as "aligned with" rather than restating.

**Drift:**
- **L3 stale header.** April 19 → should be April 26 (D-365 edit).
- **L591/L673 PRD_SETTINGS reference.** Says "aligned with PRD_SETTINGS v2.3, updated 2026-04-16." REPO_INDEX L61 shows 2026-04-15.
- **L322 D-239 reference.** Compliance alerts UI described as active; D-239 reframed by D-364 (Session 48, 2026-04-24, "SMS compliance alert feature deferred until evidence of need"). Concrete drift.
- **L74 (cross-doc drift surfaced via PRICING_MODEL audit):** Specifies "$150 go-live fee" bridge line on Home page pricing card, citing D-216. **D-216 superseded by D-320** (DECISIONS L682). PROTOTYPE_SPEC L968 even has self-aware "~~Pricing inconsistency~~ Resolved" entry citing D-320, but L74 wasn't updated.
- **L696–831 Admin Dashboard (D-234).** 135-line section describing screens not covered in MASTER_PLAN's ten phases. Scope-flag drift.
- **L800–820 mock dates** ("Submitted 3/17/2026", "Approved Mar 10, 2026") baked into spec; likely diverged from current prototype mocks.
- **L956–968 Known Issues table.** Multiple rows reference UX areas D-364 deferred. Stale framing.
- **L578 PRD_02 reference.** Stale archive reference.
- **No `/src` references** — clean on D-358.
- **No old Experiment numbering** — clean on v1.2 amendment.
- **Lines 185–191 `/start/details` "Stable (appointments vertical only)"** accurate but should cross-reference Phase 6.

**Verdict:** **KEEP + UPDATE.** Spec is canonically correct for screen-level mechanics, has clean boundaries with WORKSPACE/PRODUCT_SUMMARY/PRD_SETTINGS, reflects current decision ledger across ~250 D-citations. Required reconciliation: (a) update L3 header date to 2026-04-26, (b) annotate L322 D-239 alerts block to reflect D-364 deferral, (c) **fix L74 stale "$150 go-live fee" copy citing superseded D-216 — replace with current $49 single-payment pricing**, (d) refresh L956–968 Known Issues, (e) decide whether Admin Dashboard section L696–831 belongs given launch-plan scope.

---

### 7. REPO_INDEX.md — KEEP + UPDATE (self-audit)

**Path + lines:** `REPO_INDEX.md` — 215.

**Last substantive update:** `2026-04-26 21:48` — Session 54 close-out. Prior `2026-04-26 21:38` — reconciliation pass to v1.2 numbering (4 items, not 5). Recent commits substantive — match same-day MASTER_PLAN v1.2 amendment.

**Canonical content:** Tier classification for browser-chat uploads (Tier 1/2/3), inventory of canonical docs (root + `/docs`) with one-line purpose statements, subdirectory map, build-spec status table, active master-plan-phase pointer, sync obligations, chronological session change-log.

**Overlap:**
- **MASTER_PLAN.md:** §"Active plan pointer" L150–157 restates Phase 1's four-experiment scope in detail. **Canonical owner:** MASTER_PLAN. REPO_INDEX should hold a one-line pointer.
- **CC_HANDOFF.md:** §Meta L9 is a 700+ word session-narrative paragraph effectively duplicating CC_HANDOFF "What Was Completed". **Canonical owner:** CC_HANDOFF. Meta should be metadata only.
- **DECISIONS.md:** Meta L10 + §"Decision count verification" (L172) restate math-discrepancy resolution. **Canonical owner:** DECISIONS.md.
- **MESSAGE_PIPELINE_SPEC.md:** §"Build spec status" L140 restates Session B gating reasoning + Exp 2a/3a/3b findings in paragraph form. **Canonical owner:** MESSAGE_PIPELINE_SPEC + experiments-log.
- **experiments-log.md:** Subdirectory section (L130) restates experiment status, fixtures, findings.

**Drift (self-audit table verification — primary input for the broader audit):**

Table at L36–52 ("Canonical docs (repo root)"):
- L38 README.md `2026-04-21` — git matches. OK.
- L39 REPO_INDEX.md `2026-04-21` — actual `2026-04-26`. **STALE.**
- L40 MASTER_PLAN.md `2026-04-26` — git matches. OK.
- L41 PM_PROJECT_INSTRUCTIONS.md `2026-04-21` — actual `2026-04-26`. **STALE.**
- L42 CLAUDE.md `2026-04-21` — actual `2026-04-26`. **STALE.**
- L43 DECISIONS.md `2026-04-21` — actual `2026-04-26`. **STALE.**
- L44 DECISIONS_ARCHIVE.md `(stable)` — actually last touched 2026-04-25. Mildly stale.
- L45 PROTOTYPE_SPEC.md `2026-04-21` — actual `2026-04-26`. **STALE.**
- L46 WORKSPACE_DESIGN_SPEC.md `2026-04-21` — git matches. OK.
- L47 MESSAGE_PIPELINE_SPEC.md `2026-04-21` — git matches. OK.
- L48 SDK_BUILD_PLAN.md `2026-04-21` — git matches. OK.
- L49 SRC_SUNSET.md `2026-04-21` — git matches. OK.
- L50 CC_HANDOFF.md `2026-04-21` — actual `2026-04-26`. **STALE** (especially load-bearing — rotates every session).
- L51 BACKLOG.md `2026-04-10` — actual `2026-04-26`. **STALE by 16 days.**
- L52 audits/DECISIONS_AUDIT_2026-04-24.md — OK.

Table at L60–67 ("Canonical docs (`/docs`)"):
- L60 PRICING_MODEL.md `2026-04-21 (v6.0)` — touch matches; v6.0 substantive date is 2026-04-08. Mildly misleading.
- L61 PRD_SETTINGS_v2_3.md `2026-04-15` — actual `2026-04-16`. Mildly stale.
- L62/L63 stable — OK.
- L64 STARTER_KIT_PROGRAM.md `2026-04-17` — git matches. OK.
- L65 AI_INTEGRATION_RESEARCH.md `2026-04-15` — actual `2026-04-17`. Mildly stale.
- L66 CARRIER_BRAND_REGISTRATION_FIELDS.md `2026-04-25` — git matches. OK.
- L67 PRODUCT_SUMMARY.md `2026-04-26` — git matches. OK.

Other drift:
- **L172 §"Decision count verification"** carries stale conditional ("not verified Session 52, worth checking at next decisions sweep") — Session 54 actually resolved this; should reflect resolution.
- **L154** describes Experiment 1 as "not yet run" — appears consistent with Session 54 facts.
- **No `/src` as active references** — D-358 sunset correctly reflected at L108–110.
- **L140 §"Build spec status" still mentions "Experiments 4 (additional registration scope if needed) + 5 (STOP/START/HELP)"** using **old** numbering. Under v1.2, Experiment 4 IS STOP/START/HELP and there is no Experiment 5. Drift the v1.2 reconciliation pass missed.
- **Meta narrative bloat:** L9, L10, L11, L13 are run-on paragraphs (L9 alone ~700 words). Structural drift from doc's own stated purpose.

**Verdict:** **KEEP + UPDATE.** Required fixes:
1. Refresh "Last touched" dates in canonical-docs tables (L39, L41, L42, L43, L45, L50, L51, L61, L65).
2. Fix L140 to use v1.2 numbering.
3. Update L172 to reflect Session 54 resolution.
4. Compress Meta paragraphs L9, L10, L11, L13 from session-narrative to scannable metadata.
5. Consider trimming §"Build spec status" prose duplication of experiment findings.
6. PM judgment call: §"Change log" L184+ has accumulated 30+ entries; consider archiving pre-Session-50 entries.

---

### 8. MASTER_PLAN.md — KEEP + UPDATE

**Path + lines:** `MASTER_PLAN.md` — 468.

**Last substantive update:** `2026-04-26 21:34` — v1.2 reconciliation pass. Substantive (v1.1→v1.2 amendment landed 2026-04-26 with three reconciliation passes).

**Canonical content:** North Star, ten-phase build sequence, per-phase scope/non-scope/demo-moments, parallel-track rules, "What Is Not In This Plan" out-of-scope list. Per One Source Rule, "North Star, phases, out-of-scope → MASTER_PLAN.md only."

**Overlap:**
- **PRICING_MODEL.md:** L17, L25, L65 paraphrase North Star pricing. Mild overlap; PRICING_MODEL canonical.
- **MESSAGE_PIPELINE_SPEC.md:** §6 (Phase 2) describes Session B in detail (L147–179). Several sentences (DI of Sinch sender, fixture sourcing, signature-verification scope) reach into pipeline-spec territory.
- **SRC_SUNSET.md:** §1 prose at L41 describes sunset rationale; SRC_SUNSET owns the capability map. Phase 0 deliverable list at L101–109 names SRC_SUNSET correctly.
- **experiments/sinch/experiments-log.md:** §5 (L131–137) summarizes four experiments at high level. Some duplication of intent acceptable as plan-level summary.
- **CC_HANDOFF.md:** Phase status. CC_HANDOFF canonical for current-state.

**v1.2 internal consistency check (PASS):**
- L3 version header "Version 1.2 — April 26, 2026" ✓
- L5 changelog entry correct ✓
- §5 (L121–143) "The four experiments" + four numbered items + 3a/3b/3c sub-experiments ✓
- L142 elapsed-time estimate matches v1.2 numbering ✓
- §6 (Phase 2 prose) ✓
- §8 (Phase 4 prose) — L207 + L213 fixes held ✓
- §17 (L426) — fix held ✓

**Genuine drift surfaced:**

1. **L33 "State of Things (April 20, 2026)" — STALE (highest-value fix).** Section dates itself to April 20, references "Session 37 audit (archived Session 42)". Doesn't reflect Phase 1 active state with experiments 1, 1b, 2a, 3a complete and 3b submitted/awaiting approval. CC_HANDOFF.md "Current State" captures this; §1 hasn't been updated since Session 37.

2. **L468 footer `*End of master plan v1.0*`.** STALE. Version header at L3 is v1.2. Missed in both v1.0→v1.1 and v1.1→v1.2 amendments.

3. **§3 phase summary list (L75–85) labels Phase 4 as "Inbound message handling"** with phrase "Build Sinch webhook receiver in `/api`, handle STOP/START/HELP". §6 (Phase 2) and §8 (Phase 4) prose now establish receiver itself is built in Phase 2; Phase 4 only adds MO-specific handling.

4. **L131 (Experiment 1 in §5):** "Joel's phone receives the message; we keep the screenshot." — Exp 1 actually found that Joel's phone did NOT receive the message (silent carrier drop on unregistered 10DLC, experiments-log L60). Reads as confidently-wrong prediction.

5. **§17 L434:** "Already a known risk addressed by REPO_INDEX, **PM_HANDOFF**, session-start audit discipline." There is no PM_HANDOFF.md; canonical handoff is CC_HANDOFF.md.

6. **L236 (Phase 5):** "Sinch registration APIs (shape captured in Phase 1 Experiments 3 and 4)." Under v1.2, registration shape is Experiment 3 (3a/3b/3c) alone; Experiment 4 is STOP/START/HELP. **Fourth out-of-§5 reference to old numbering** that slipped through Session 54's reconciliation passes.

**Verdict:** **KEEP + UPDATE** with these specific fixes:
1. **Refresh §1 "State of Things"** to reflect Phase 1 active state (highest-value single fix).
2. **Fix L236:** "Phase 1 Experiments 3 and 4" → "Phase 1 Experiment 3 (3a/3b/3c)".
3. **Fix L468 footer:** `v1.0` → `v1.2`.
4. **Reconcile L131** Exp 1 prose with the silent-drop finding.
5. **Tighten §3 Phase 4 one-liner** to match §8.
6. **Fix §17 L434:** "PM_HANDOFF" → "CC_HANDOFF".

Bundling into a v1.2.1 reconcile-pass commit appropriate.

---

### 9. BACKLOG.md — KEEP + UPDATE

**Path + lines:** `BACKLOG.md` — 305 (header L3 says "April 7, 2026"; latest commit 2026-04-26 — header drift).

**Last substantive update:** `2026-04-26 14:43` — vertical-to-use-case mapping + customer registration form design round (substantive). Active 10-commit cadence; not dormant.

**Canonical content:** Parking lot for ideas, deferred features, rejected proposals — items not committed; CC must not build from without explicit promotion. Only canonical source of the **Rejected** table (L260–276).

**Overlap (One Source Rule lens):**
- **vs. MASTER_PLAN.md §16 "What Is Not In This Plan":** §16 enumerates 13 explicitly-out-of-scope-for-launch items. At least 7 have direct counterparts in BACKLOG: "Multi-project dashboard (PRD_11)" (L56), "Platform/multi-tenant tier (PRD_10)" (L58), "BYO Twilio tier (Model 2)" (L38), "Marketing campaign registration flow" (L40), "App Doctor — AI support" (L90), "CSV export from dashboard" (L226), "Multi-user / team access" (L116). Duplications, not pointers.
- **Legitimate distinction:** §16 owns "out-of-scope for launch" (definitive PM commitment). BACKLOG should own (a) ideas not yet evaluated, (b) deferred-with-design-detail items exceeding §16's terse line, (c) the **Rejected** table (uniquely BACKLOG's), (d) post-Phase-N nice-to-haves.
- **vs. PROTOTYPE_SPEC.md:** Several entries describe screen-level UI details (L78, L42).
- **vs. DECISIONS.md:** L60 in-place note "Moved to D-346" is right pattern; L114 strikethrough-with-note duplicates the same pointer.

**Drift (specific):**

Items aged into in-scope (per current MASTER_PLAN phases):
- **L118 "Sinch migration implementation"** — IS the master plan now (Phases 1–5).
- **L132 "Message pipeline refactor (pre-Sinch)"** — Phase 2 work.
- **L134 "Messages table for delivery tracking and metering"** — launch-blocking per Phase 2/3.
- **L120 "Dev/prod environment split"** — Phase 7 implicitly requires.
- **L168 "Platform ToS and AUP — Beta blocker"** — Phase 10.
- **L20 "Privacy/legal compliance baseline"** — Phase 10.
- **L82 "Sandbox API endpoint"** — already working; entry is now a status note.

Items aged into irrelevance / superseded:
- **L114 strikethrough rate-limiting entry** — done (D-346 + April 3 implementation).
- **L40 "Marketing campaign registration flow"** — D-304/D-305 referenced; what remains parked vs. decided is unclear.
- **L82 sandbox endpoint:** parenthetical "Carrier send is a console.log stub until Sinch account confirms" stale — Sinch confirmed (D-215), Phase 1 running.
- **L210 "Two-tab marketing page"** — explicitly self-described as "dropped"; belongs in Rejected table or removed.

Items in tension with /src sunset (D-358):
- **L124 "Migrate pre-reg API key auth from listUsers() scan"** references current /src code (D-55). With /src sunsetting, framing is wrong.

Header-vs-content drift:
- **L3 self-declared "Last updated: April 7, 2026"** is wrong by ~3 weeks.

Cross-doc:
- **L144 "Pre-Phase-2 DECISIONS.md audit"** — done (DECISIONS_AUDIT_2026-04-24.md).

**Verdict:** **KEEP + UPDATE.** Useful but drifting; needs structural prune, not rewrite. Doc is right shape and actively used. Concrete drift addressable: (a) duplications with §16 → pointers, (b) ~7 entries aged into in-scope phases retired with phase pointers, (c) L3 header bumped or removed, (d) completed items moved to "Done" tail or struck. Mirrors the April 3 grooming pattern.

---

### 10. docs/PRODUCT_SUMMARY.md — KEEP + UPDATE

**Path + lines:** `docs/PRODUCT_SUMMARY.md` — 259 (well under 500-line ceiling).

**Last substantive update:** `2026-04-26 14:09` — single commit, file created Session 52. "Last reviewed: 2026-04-26" matches. Sessions 53 + 54 ran since (both doc-only, neither materially changed customer experience).

**Canonical content:** PM-facing customer-experience narrative — what a real customer sees, does, and feels at every product surface, intended to be loaded into PM browser-chat contexts when conversation will touch customer-facing surfaces.

**Overlap (One Source Rule):**
- **PROTOTYPE_SPEC.md (heaviest overlap):** §3/§4/§5/§6/§7/§8/§9/§11 describe layouts, button placements, dimensions ("540px column", "400px column"), state-switcher behaviors, exact CTA strings. §3 marketing-pages enumeration is most extreme case.
- **PRICING_MODEL.md:** §13 *restates* pricing numbers ($49, $19/mo, $29/mo, 500 included, $8/500 overage, 20k/day cap). **Clear One Source Rule violation.** L206–212 anchor list reads as parallel canonical source.
- **VOICE_AND_PRODUCT_PRINCIPLES_v2.md:** §14 quotes three-tier voice principles + paraphrases kill list. Smaller violation.
- **MASTER_PLAN.md §16:** §15 echoes §16; pointer cited at L242, bullets paraphrased rather than verbatim — closer to acceptable.
- **DECISIONS.md:** Heavy decision-anchor citations throughout; all verified to exist.

**Drift:**
- §3 marketing pages — L24 acknowledges marketing is "scheduled for retrenchment." Honest framing; signals near-future major rewrite needed.
- §7 registration TBD (L106) — current. Mentions Experiments 3a/3b matching v1.2 numbering.
- Experiment numbering — clean against v1.2.
- /src references — none. Clean.
- D-numbers cited — all verified.
- Customer-journey claims — match current prototype.
- §7 D-311 reference at L106 — flagging for verification (campaign vs. brand simultaneity claim may want reconciling against 3b's actual flow).
- Pricing restatement — no factual drift YET (PRICING_MODEL v6.0 numbers match) but exactly the drift-prone duplication pattern One Source Rule was created to prevent.

**Verdict:** **KEEP + UPDATE.** Useful but contains One Source Rule violations. Recommend PM-driven trim pass: (a) replace §13 number-restatement with one-line pointer to PRICING_MODEL.md plus surface enumeration, (b) trim §3/§6 from layout enumeration to customer-experience prose, (c) replace §14 kill-list with paraphrase + pointer. Last-reviewed date and overall drift status are healthy — structural cleanup, not content emergency.

---

### 11. DECISIONS.md — KEEP + UPDATE

**Path + lines:** `DECISIONS.md` — 1407. Active D-number count: **280** (`grep -oE "^\*\*D-[0-9]+" | sort -u | wc -l`). Latest: **D-365**. Numbering: D-84 through D-365 active; D-01–D-83 indexed (full text in DECISIONS_ARCHIVE.md). Known holes: D-155 (clean numbering skip) + D-156 (orphan forward reference, cleaned in `6fc6a9d`). 282 − 2 = 280 reconciles.

**Last substantive update:** `2026-04-26 21:17` — D-156 dangling reference cleanup (substantive). 2026-04-26 08:27 D-365 added. 2026-04-24 D-363 + D-364 + reciprocal marks. Active maintenance cadence.

**Canonical content:** With DECISIONS_ARCHIVE.md, the canonical decision history of RelayKit. Per One Source Rule, "Decision history → DECISIONS.md / DECISIONS_ARCHIVE.md only."

**Overlap (clean):**
- MESSAGE_PIPELINE_SPEC: zero `per D-###` references and no decision restatement. Clean.
- WORKSPACE_DESIGN_SPEC: zero matches. Clean.
- PROTOTYPE_SPEC: uses correct `per D-###` reference pattern. Clean.
- SDK_BUILD_PLAN: §6 decisions list (L114–115) and §13 changelog (L440, L449) summarize D-277 and D-362 in one-line form. Borderline; not full restatement; permitted orientation device.
- MASTER_PLAN: §1 "State of Things" summarizes /src sunset rationale without naming D-358 inline. Narrative form appropriate.

**Verdict on §4:** No One Source Rule violations found.

**Drift:**

5a. Changes since 2026-04-24 audit:
- D-363 (2026-04-24): supersedes D-101; resolves prior audit's E-1. Format-compliant.
- D-364 (2026-04-24): supersedes D-239 + D-201; resolves prior audit's E-2. Format-compliant.
- D-365 (2026-04-25): supersedes none; consent-language elements at phone-collection surfaces. Format-compliant.
- D-156 dangling-reference cleanup verified (zero hits).

5b. **Format compliance of recent decisions:**
- **D-350–D-357 (8 decisions, 2026-04-17 to 2026-04-19) lack inline Supersedes field.** Predate "decisions process v2" header (2026-04-24).
- **D-358–D-361 (4 decisions, 2026-04-20) also lack Supersedes field.** Different sub-format.
- **D-362 (2026-04-21):** body says "No supersession of D-277 required; D-362 is purely additive" but no explicit `**Supersedes:** none` line. Borderline.
- **D-363, D-364, D-365:** all compliant.

**New finding:** D-350–D-362 (13 decisions) format-non-compliant on Supersedes field. Predate formalization but requirement now retroactively in force per CLAUDE.md.

5c. References to /src as active: no active claims found. Sunset consistently honored.

5d. Other observations: prior audit's §A-1 (D-89/D-15/D-37/D-294 marketing-campaign chain), §C-2 (D-286 JSON-registry-status flag), Appendix item 3 (D-241→D-211 reciprocal annotation) all remain open.

**Verdict:** **KEEP + UPDATE.** Open items: (1) D-350–D-362 backfill Supersedes field (mechanical, likely all "none"), (2) prior audit's §A-1 and §C-2 remain pending PM disposition. Recommended pointer: add one-line note to DECISIONS.md or REPO_INDEX referencing audits/DECISIONS_AUDIT_2026-04-24.md as live punch-list of open items.

---

### 12. DECISIONS_ARCHIVE.md — KEEP + UPDATE

**Path + lines:** `DECISIONS_ARCHIVE.md` — 409. 83 decisions (D-01 through D-83).

**Last substantive update:** `2026-04-25` (D-18 contextual annotation re: Sinch's HEALTHCARE vertical at L104). Prior `2026-04-24` (Session 48 audit cleanup — 9 inline `⚠ Superseded/Reframed/Orphaned` annotations now present). The archive is, by nature, append-frozen for D-01–D-83 entries — only annotations on existing entries should land here. No new D-numbers added (correct).

**Canonical content:** Full text of D-01 through D-83 — original Twilio-era + early prototype pre-payment-flow decision history.

**Overlap (One Source Rule check — no violation found):**
- DECISIONS.md "Archived Decision Index (D-01–D-83)" section is summary-only — explicitly designed as navigation aid, not content duplicate.
- Drift-prone overlap: the index can drift from archive's inline annotations. **Spot-check finding:** DECISIONS.md index entry for D-47 (L100) says only "Messages tab read-only..." with no orphan note, but archive at L269 carries `⚠ Orphaned: plan-builder UI fully retired per D-280 + D-279 + D-332`. Inline annotation correct; index summary stale.

**Drift:**

(a) **Missing inline annotations — substantially resolved.** April 24 audit identified D-15, D-16, D-17, D-19, D-37, D-42 (§B-3 through §B-7), and orphan clusters D-02/D-26 (§C-1) and D-40/D-41/D-47/D-64/D-72/D-79 (§C-2/§C-3) as missing. All now carry inline marks (verified).

**Residual gaps from April 24 audit's archive-touching findings:**
- **D-82** (TCR submission variety): DECISIONS.md index L135 notes "(count superseded by D-90)"; archive L404–405 has no inline annotation. Mirror of D-42 issue.
- **D-83** (corrects D-61): D-61 itself at L324 has no inline note pointing to D-83 or D-70. Reciprocal annotation missing.
- **D-60** (inline editing): index L113 says "(superseded by D-69)"; archive L320–322 has no inline annotation.
- **D-61** (locked compliance elements): index L114 says "(superseded by D-70 for prefix)"; archive L324–326 has no inline annotation.

(b) **Archive subjects treated as live elsewhere:**
- **D-27 ($199 setup)** was reset by D-320 (now $49) but D-27 itself has no inline `⚠ Superseded by D-320` mark. Reader navigating directly to D-27 would see wrong figure. **New finding** not in prior audit. Worth flagging.

**No active doc relies on a now-superseded archived decision** in a way that would mislead implementation.

**Verdict:** **KEEP + UPDATE.** April 24 audit's archive-touching findings ~85% executed. Residual cleanup small and well-scoped: inline-annotate D-27 (price), D-60, D-61, D-82 to match what DECISIONS.md index already says, plus D-61 ↔ D-83 reciprocal. The DECISIONS.md "Archived Decision Index" itself drifts faster than the archive (D-47 mismatch noted) but that's an active-doc concern.

---

### 13. docs/PRICING_MODEL.md — KEEP + UPDATE

**Path + lines:** `docs/PRICING_MODEL.md` — 560.

**Last substantive update:** `2026-04-21` was a touch (rk_test_ flip). Last substantive: implicitly via D-334 (April 8). Header reads "Version 6.0 — April 8, 2026" with v6.0 changelog citing D-320, D-321, D-334.

**Canonical content:** Per One Source Rule explicitly: "Pricing facts → PRICING_MODEL.md only. Other docs may point at it; they may not restate numbers." Tier definitions, Stripe configuration, subscription lifecycle, unit economics/LTV.

**Overlap:**

Permitted paragraph-level paraphrases (in scope of README exception):
- README.md L3: "live messaging costs $49 to register and $19/month thereafter" — single-sentence orientation. Within exception.
- CLAUDE.md L7: "Current pricing: $49 registration + $19/mo (or $29/mo with marketing)." — single-sentence summary. Agrees with PRICING_MODEL.
- MASTER_PLAN.md L17, L25: paraphrases tied to North Star. Within exception.

**Likely violations of One Source Rule (restatement, not paraphrase):**
- **docs/PRODUCT_SUMMARY.md L206–212** — explicit "Pricing facts" bullet block restating: "$49 one-time", "$19/mo / $29/mo", "Marketing campaign bundled", "500 messages/month / $8 per 500", "20k/day abuse ceiling." Multi-fact restatement, not one-line paraphrase. Should be replaced with single-sentence paraphrase + pointer.
- **PRODUCT_SUMMARY.md L138** — restates $19→$29/mo transition.
- **PROTOTYPE_SPEC.md L74 (most serious violation):** specifies "$150 go-live fee" bridge line on Home page pricing card, citing **D-216**. **D-216 is superseded by D-320** (DECISIONS L682: "no split pricing; $49 flat"). PROTOTYPE_SPEC L968 even has self-aware "~~Pricing inconsistency~~ Resolved" entry citing D-320 — so resolution table claims it's done while actual home-page spec at L74 still describes old structure.

**Drift (internal to PRICING_MODEL.md):**
- **L5 references retired PRDs** as "replaces": "PROJECT_OVERVIEW.md, PRD_01 Section 5, and PRD_07 Sections 2 & 4." RELAYKIT_PRD_CONSOLIDATED.md and Twilio-era PRDs archived Session 42. Stale orientation header.
- **L265 heading** "STRIPE IMPLEMENTATION (Replaces PRD_01 Section 5)" — same issue.
- **L275** uses URL placeholder `relaykit.ai/apps/{appId}/messages`; §1 conversion path L77 uses `relaykit.ai/dashboard?session_id=` (BYO). BYO `dashboard` path may be stale, low-impact.
- **L539–548 `CREATE TABLE message_usage` block still uses `customer_id UUID REFERENCES customers(id)`.** §"NOTE-D-299" at L530 says new tables should use `project_id`. Internal inconsistency — implementation-time hazard.
- **No /src references** — clean.
- **D-numbers cited:** D-15, D-37, D-89, D-193, D-194, D-216, D-271, D-279, D-293, D-294, D-296, D-298, D-299, D-300, D-302, D-303, D-304, D-305, D-320, D-321, D-334, D-346, D-349 — all exist. CHANGE LOG entries v4.0 (L13) cite superseded D-193/D-194/D-216 but in historical context (acceptable as history). Current operative section (DECISION SUMMARY §2) cites only current/active.

**Verdict:** **KEEP + UPDATE.** Two real findings external to this doc: (1) **PROTOTYPE_SPEC.md L74 stale "$150 go-live fee" copy citing superseded D-216** — drift in sibling doc, produces customer-visible miscommunication; one-line edit there. (2) **PRODUCT_SUMMARY.md L206–212 restates pricing facts** — collapse to paraphrase + pointer. Internal cleanup not urgent: stale L5/L265 "replaces PRD_01" headers, L539–548 `customer_id`-vs-D-299 internal inconsistency.

---

### 14. PM_PROJECT_INSTRUCTIONS.md — KEEP + UPDATE (mild)

**Path + lines:** `PM_PROJECT_INSTRUCTIONS.md` — 758 (committed HEAD). Working tree shows `M` with +1 line — Joel's pre-existing draft, untouched by recent CC sessions.

**Last substantive update:** `2026-04-26 16:00:27` — "add simplest-fix-first reminder + PRODUCT_SUMMARY Tier 2 requirement". Substantive — adds simplest-fix-first standing reminder (L661) and elevates PRODUCT_SUMMARY.md into Tier 2 uploads (L44) + proactive-use Standing Reminder (L649). **Doc-header date L3 says "Updated: April 24, 2026" — two days behind the most recent substantive commit.** Healthy ownership cadence (9 touches since 2026-04-17).

**Canonical content:** PM/Architect role definition + entire PM-side operating playbook for guiding Joel through CC sessions: PM responsibilities, three-tier file orchestration, Joel's shorthand triggers, session opening/close-out prompt templates, decision gating (six tests), file-request discipline, CC mode signaling, doc-only vs. code-touching cadence, response brevity rules, standing reminders.

**Overlap (with CLAUDE.md, most relevant):**
- **DECISIONS workflow.** PM doc §"DECISIONS System" (L246–339) and CLAUDE.md §"DECISIONS ledger stewardship" both cover gate tests, supersession discipline, archive threshold, retirement sweep. Boundary clean **in principle** — PM doc is policy ("PM gates entry"); CLAUDE.md is operational ("CC owns disk hygiene"). Six gate tests appear in full in PM doc L269–275 and are referenced (not duplicated) in CLAUDE.md, which is the right asymmetry.
- **Session opening/close-out prompts.** PM doc L377–416 holds canonical CC-paste prompts; CLAUDE.md "Session start"/"Session close-out" hold CC's checklist. Two halves of same conversation, properly split.
- **Quality gates.** PM doc L173–179 + CLAUDE.md "Quality gates (every commit)" mostly aligned; PM doc adds Prettier and build-verification gate, CLAUDE.md does not mention Prettier. Minor drift.
- **Copy/Voice rule.** PM doc L596 + CLAUDE.md "Copy rule". PM doc is meta-statement; CLAUDE.md is operational. Acceptable.

**With REPO_INDEX.md:**
- File listings PM doc L227–243 ("Key repo files") restate REPO_INDEX's canonical-docs table. Minor One Source Rule pressure.

**With MASTER_PLAN.md:**
- "What RelayKit Is (Current State)" L128–141 paraphrases MASTER_PLAN §0 + §1 + PRICING_MODEL. Pricing pointed-at (acceptable per One Source Rule's explicit exception).

**Drift (ranked by severity):**

1. **Header date stale (L3: "Updated: April 24, 2026").** Most recent substantive commit 2026-04-26.
2. **Tier 2 enumeration mismatch.** L39–46 list five Tier 2 files (REPO_INDEX, MASTER_PLAN, CC_HANDOFF, PRODUCT_SUMMARY, PM_HANDOFF). REPO_INDEX.md L17–28 lists only four (REPO_INDEX, MASTER_PLAN, CC_HANDOFF, PM_HANDOFF) — **PRODUCT_SUMMARY.md missing from REPO_INDEX's Tier 2 block** even though PM_PROJECT_INSTRUCTIONS.md adds it (2026-04-26 commit). REPO_INDEX's gap, not this doc's, but two docs disagree on canonical Tier 2 membership.
3. **`pm_instructions_synced` flag references.** L178 (REPO_INDEX change-log entry from 2026-04-19) and PM doc §"PM instructions sync" (L50–54) describe sync-flag concept, but PM doc itself says "No tracking flag, no async state" (L52). Cross-doc tension.
4. **Phase wording lightly trails MASTER_PLAN v1.2** — but PM doc has no phase-by-phase enumeration of Experiments, so v1.2 renumbering does NOT create stale references. Clean.
5. **Decision references.** L554–577 enumerates "Key Technical Decisions (Already Made)" — citations through D-362. **D-363, D-364, D-365 not in this list.** Curation question (the list is pinned-decisions, not complete log), but PM doc's Key Decisions block has not been refreshed since ~Session 39.
6. **"Magic link auth" phrasing (L567).** Reads "Magic link auth — no passwords (D-03, D-59)." CLAUDE.md L35 explicitly clarifies: "Auth is passwordless email — 'Magic-link' in D-03 is shorthand for the passwordless-email family, not a click-link mechanism." PM doc still uses looser framing without same clarifier.

**Verdict:** **KEEP + UPDATE (mild).** Doc is actively maintained, structurally sound, substantively current with post-Session-47 reality. Real drift: (a) header date stale by two days, (b) magic-link phrasing not aligned with CLAUDE.md's passwordless-email clarifier, (c) Key Technical Decisions block missing D-363/D-364/D-365 (curation question), (d) cross-doc Tier 2 disagreement with REPO_INDEX (REPO_INDEX's gap). 5-minute pass at next close-out closes the gaps.

---

### 15. SDK_BUILD_PLAN.md — KEEP + UPDATE (minor)

**Path + lines:** `SDK_BUILD_PLAN.md` — 461.

**Last substantive update:** `2026-04-21 15:41` — light touch (rk_sandbox_→rk_test_ flip per D-349, REPO_INDEX explicitly notes "No version bump"). Last substantive: `2026-04-17` — "Group D — SDK_BUILD_PLAN rewrite (v0.1.0 retrospective + Phase 8 spec)". Three commits total. 9 days substantively unchanged.

**Canonical content:** Per One Source Rule: "SDK architecture → SDK_BUILD_PLAN.md only." Canonical retrospective of what shipped in `relaykit@0.1.0` (8 namespaces, 30 methods, class-based init, dual ESM/CJS via tsup, `SendResult` shape, graceful-vs-strict failure mode, top-level consent functions) **and** canonical forward-looking spec for Phase 8 deliverables.

**Overlap:**

With docs/AI_INTEGRATION_RESEARCH.md (largest):
- SDK_BUILD_PLAN §4b specifies 13-section README; AI_INTEGRATION_RESEARCH is upstream research. MASTER_PLAN §12 calls AI_INTEGRATION_RESEARCH "the spec for this phase".
- §4c handles AGENTS.md template at *spec* level; AI_INTEGRATION_RESEARCH §"AGENTS.md content (draft sketch)" holds actual draft.
- Clean handoff, not duplication. SDK_BUILD_PLAN §4c references AI_INTEGRATION_RESEARCH §8 by pointer rather than restating.

With MESSAGE_PIPELINE_SPEC.md (endpoint overlap):
- §4b §9 lists `POST /v1/messages`, `POST/GET/DELETE /v1/consent/:phone`, `GET /v1/messages/:id`. SDK_BUILD_PLAN §4b §9 lists `GET /v1/messages/:id` for delivery-status checks; **not in MESSAGE_PIPELINE_SPEC's Consent API section grep.** Worth verifying whether MESSAGE_PIPELINE_SPEC documents the message-status endpoint.

With docs/STARTER_KIT_PROGRAM.md (Phase 8 vs Phase 9):
- §5 ("Module pattern recommendation") explicitly scopes itself: "ships in Phase 9 starter-kit integration work". Boundary clean.

**Drift:**

- **SDK status alignment — clean.** v0.1.0 correctly portrayed as **shipped (not planned)** while remaining deliverables explicitly pending.
- **Phase alignment with MASTER_PLAN §12 — minor gap.** §12 lists Phase 8 outputs as: published npm package, 13-section README, AGENTS.md template, **cursor rules, per-builder integration guides (Lovable, Bolt, Replit, v0)**, Explore-Plan-Code-Verify workflow doc. SDK_BUILD_PLAN §4 covers npm publish, README, AGENTS.md, integration prompt — but **does not mention `.cursor/rules/` or per-builder integration guides.** Mild gap; may be implicitly delegating to AI_INTEGRATION_RESEARCH but doesn't say so.
- **rk_sandbox_ → rk_test_ sweep — clean.**
- **D-numbers cited:** D-266, D-272, D-273, D-274, D-276, D-277, D-278, D-296, D-306, D-307, D-308, D-330, D-349, D-351, D-360, D-361, D-362. **D-360 (cross-vertical OTP) and D-361 (reviewRequest) appear in §4b prose but NOT in §6 reference table.** Minor format inconsistency.
- **Old Experiment numbering / /src references — clean.**
- **Sunset / superseded content — clean.**
- **Internal section cross-references:** §4c/§5 use §5 and §6 references but actual headers are `## 5. Module pattern recommendation` and `## 6. Decisions referenced` — internal consistent. **§5d referenced in §1 but integration prompt lives at §4d (not §5d).** Same with §1's "§5b" and "§5c" for README and AGENTS.md (at §4b and §4c). **Real internal-cross-reference bug** — likely leftover from pre-Session-39 numbering.

**Verdict:** **KEEP + UPDATE (minor).** Doc well-positioned, cleanly scoped, free of significant drift, reflects shipped reality accurately. Surgical fixes: (a) fix internal §1 cross-references (§5b/§5c/§5d → §4b/§4c/§4d), (b) add D-360 + D-361 to §6 decisions-referenced table, (c) decide on cursor rules + per-builder guides scope (delegate via pointer or expand §4), (d) verify `GET /v1/messages/:id` in MESSAGE_PIPELINE_SPEC.

---

### 16. docs/AI_INTEGRATION_RESEARCH.md — RETIRE WHEN Phase 8 closes

**Path + lines:** `docs/AI_INTEGRATION_RESEARCH.md` — 526.

**Last substantive update:** `2026-04-17 11:10` — only commit. Single-write document. Nine days old at audit time. Self-described as research evidence ("not yet scheduled for PRD drafting"). Currently still informing Phase 8 work; Phase 8 has not yet executed.

**Canonical content:** Evidence base and reasoning for RelayKit's AI-integration posture — adoption of AGENTS.md, ETH Zurich finding against auto-generation, 1,500–3,000 line active-scope ceiling, Resend reference implementation comparison, per-tool behavioral profiles (Claude Code/Cursor/Windsurf/Codex), originally-proposed first-party starter kit plan since retired.

**Overlap:**
- **MASTER_PLAN.md §12 (Phase 8):** restates AGENTS.md/cursor rules/SDK README outline/per-builder guides/Explore→Plan→Code→Verify deliverables. Master plan = operational pointer; research doc = rationale source. Currently coexisting cleanly via reference.
- **SDK_BUILD_PLAN.md §4c:** describes AGENTS.md snippet template characteristics, points back at this §8 as draft template. **Drift risk:** SDK_BUILD_PLAN restates under-60-lines + human-curated rules.
- **STARTER_KIT_PROGRAM.md §16 (L399):** also points at §8 for AGENTS.md draft. Two operational docs both inheriting from §8.
- **§8 starter-kit-plan (L306–453)** — the most overlap-laden section. Proposes RelayKit shipping its *own* "appointments-starter". MASTER_PLAN Phase 9 (L344) explicitly retired this strategy.

**Drift:**

- **Tool-version claims (L273–286)** April-15-2026 snapshots of fast-moving products: "1M token beta on Opus 4.6", "GPT-5.3, Claude 4.5, Gemini 3, Composer", "Cloud agents 10 parallel workers", "Context window effectively 70K-120K". As of current session, running model identifies as Opus 4.7 (1M context). §7 table 11 days stale on a domain that turns over monthly.
- **§8 starter-kit plan vs. MASTER_PLAN Phase 9 retirement (LARGEST DRIFT):** Reads as forward plan ("Ship the appointments vertical first"). MASTER_PLAN reversed this. Reader with no other context will conclude RelayKit is building first-party starter.
- **STARTER_KIT_PROGRAM.md is also marked "superseded"** in REPO_INDEX (L64) but still cited from this research §8.
- **ETH Zurich citation (L84–92):** 2025 study; doc honestly hedges as "one paper, not consensus" (L32). Not drift, but 3%/20% figures propagated into MASTER_PLAN reasoning without that hedge.
- **D-numbers:** doc references zero. No ledger-drift on that axis.
- **Self-described status:** L525 still labels "*Research document — not yet scheduled for PRD drafting*". PRD work has effectively been absorbed into MASTER_PLAN §12 + SDK_BUILD_PLAN §4. Closing line technically incorrect now.

**Verdict:** **RETIRE WHEN Phase 8 closes.** Currently load-bearing as rationale source for Phase 8 deliverables; referenced from two operational docs. Once Phase 8 ships operational AGENTS.md template, SDK README, per-builder guides, this research becomes archival. At that point: move to `docs/archive/` with deprecation header citing Phase 8 close. Until then, leave in place but: (a) flag §8 as superseded by MASTER_PLAN Phase 9 with inline header (since that section actively misleads if read standalone), (b) consider trimming or annotating §7 tool-behavioral table to note its April-2026 vintage.

---

### 17. CLAUDE.md — KEEP AS-IS

**Path + lines:** `CLAUDE.md` — 158 (within self-imposed 200-line ceiling; above ~120 target by 38 lines). DECISIONS stewardship section (L42–99 = ~58 lines) is largest single contributor.

**Last substantive update:** `2026-04-26 16:00:24` — "add PRODUCT_SUMMARY maintenance instructions to CLAUDE.md" (substantive). Prior 2026-04-24 decisions process v2; 2026-04-21 file-size discipline + wizard-key spot-fix.

**Canonical content:** CC's standing operating instructions: stack/architecture rules, design-system rules, quality gates, DECISIONS ledger stewardship operational procedures, session-start and session-close protocols, CC-facing copy/platform/prototype guardrails. Operational counterpart to PM_PROJECT_INSTRUCTIONS.md (policy-facing).

**Overlap (PM_PROJECT_INSTRUCTIONS.md, primary):**
- **DECISIONS stewardship.** Two docs correctly split: PM doc L246–339 = policy (six gate tests, division of labor, archive threshold, retirement-sweep cadence, when to prompt). CLAUDE.md L42–99 = operational (pre-flight ledger scan, inline supersession enforcement steps, retirement-sweep block format, conflict-flag format).
- **Cross-references consistent:** CLAUDE.md L44: "Full rules in PM_PROJECT_INSTRUCTIONS.md"; PM doc L255: "rules for CC's stewardship live in CLAUDE.md"; PM doc L305: "CC surfaces candidates automatically at phase-boundary close-outs (see CLAUDE.md)." Load-bearing operational copy lives in CLAUDE.md as expected.
- **Six gate tests** referenced by name in CLAUDE.md L115 without listing — correct one-source behavior.

**With REPO_INDEX.md:**
- **REPO_INDEX.md L42 lists CLAUDE.md as last touched `2026-04-21`** with description ending "Session 42: removed retired RELAYKIT_PRD_CONSOLIDATED.md pointer". This is **stale** — CLAUDE.md actually touched 2026-04-24 (decisions v2) and 2026-04-26 (PRODUCT_SUMMARY maintenance). Session 52/53/54 changes reflected in REPO_INDEX changelog entries but canonical-docs table row not bumped.
- "Key docs" pointer list (L151–156, 5 bullets) overlaps with REPO_INDEX's canonical-docs tables but is curated subset for CC's load-on-demand triage. Acceptable.

**No drift between two stewardship copies** — describe complementary aspects, not same aspect twice.

**Drift (within CLAUDE.md itself):**
- **L7 pricing claim** — "$49 registration + $19/mo (or $29/mo with marketing)." Reconciles cleanly against PRICING_MODEL.md v6.0 (D-320, D-321, D-334). Not drift.
- **L7 `/src` sunset** — "`/src` is sunset per D-358." D-358 real (DECISIONS L1345). Directory still physically exists at `/Users/macbookpro/relaykit/src` (sunset-in-progress per Phases 2–5), so "sunset" as policy correct.
- **L20 icon gotcha** — `ShieldCheck` → `ShieldTick`. No staleness evidence.
- **L56 Archive range** — D-01–D-83 consistent with DECISIONS.md L9/L35 and PM doc L233–234.
- **L102–106 session-start file list** — matches PM doc L378's session-opening prompt exactly.
- **L131 single-project guardrail** — consistent with MASTER_PLAN Phases 6/10.
- **L134–135 carrier limits** — domain-specific; nothing contradicts.
- **L147 wizard sessionStorage key** — `relaykit_wizard` and path `prototype/lib/wizard-storage.ts` verified.
- **No old Experiment numbering references** — CLAUDE.md doesn't mention experiments at all.
- **L128 D-215 reference** — real, active.
- **L130 D-15, D-37, D-89** — all present; D-15 and D-37 carry "⚠ Superseded by D-294" annotations but substantive claim ("marketing capability = second campaign registration, never an upgrade") reaffirmed by D-89 and D-294, citation cluster remains correct.
- **Minor stylistic drift:** L143 starts PRODUCT_SUMMARY.md maintenance section with single-sentence-prose paragraph that's longest in the file (~290 words on one logical line). Pushes against file-size-discipline ethos at L4.
- **L124 "Copy rule" terminology mismatch** (surfaced by VOICE_AND_PRODUCT_PRINCIPLES audit): "vocabulary table, framing-shift table, emotional-states map, and one-sentence principle" — VOICE_AND_PRODUCT_PRINCIPLES_v2 has none of those four labels. Vestigial v1.1 vocabulary. **Concrete drift target.**

**Verdict:** **KEEP AS-IS** with one cross-doc reconciliation flag. CLAUDE.md is current, internally consistent, correctly partitioned against PM_PROJECT_INSTRUCTIONS.md. All cited D-numbers, file paths, sessionStorage keys, pricing facts verify. Action items: (a) **REPO_INDEX.md L42 row stale (REPO_INDEX's gap, not CLAUDE.md's),** (b) **L124 "Copy rule" wording references v1.1 table names** (one-line fix in CLAUDE.md, no edits to v2 itself).

---

### 18. SRC_SUNSET.md — KEEP AS-IS

**Path + lines:** `SRC_SUNSET.md` — 119.

**Last substantive update:** Single substantive update: creation commit `2026-04-21 16:16:55` (Session 41, Phase 0 Group F). Most recent commit `2026-04-21 18:05:30` was a touch (path update for archived companion doc). 5 days stale as of audit time, but staleness is structural (no rebuild has shipped to flip a Status cell).

**Canonical content:** Single mapping of every surviving `/src` capability to the MASTER_PLAN phase that rebuilds it on `/api` + Sinch, including excluded/not-rebuilt rows and five Open-F-N unresolved scoping questions. Per One Source Rule, `/src` sunset mapping lives **only** here.

**Overlap (minimal and appropriate):**
- MASTER_PLAN.md mentions `/src` 13 times (narrative, not capability map).
- DECISIONS.md D-358 holds the sunset decision (authority); SRC_SUNSET holds the per-route map.
- `docs/archive/CURRENT_STATE_AUDIT.md §2.1` named in SRC_SUNSET L5 as source-of-truth `/src` inventory — companion, not duplicate.
- REPO_INDEX.md describes the doc's existence; no capability-map duplication.
- CC_HANDOFF.md L153 only restates freeze status. No overlap.

No One Source Rule violations.

**Drift:**
- `/src` integrity: `git log --since="2026-04-21" -- /src/` returns nothing — freeze holds. CC_HANDOFF L153 confirms. `ls /src/` still shows expected eight subdirectories. No Status cell needs flipping.
- Phase progress: no Phase 2–5 rebuild has shipped. Every Phase 2/3/4/5 row's "Status / open questions" cell still correctly forward-looking.
- **Open-F-1 has new evidence (mild drift):** Session 50 captured Exp 2a findings that materially inform Open-F-1 — Sinch delivery-report callbacks arrive in ~1.7s, carry no signature header. Session 50 handoff explicitly notes signature-verification question as "Successor question to original Open-F-1." SRC_SUNSET.md L97 still poses Open-F-1 in original Phase 0 phrasing. Not correctness bug — Open-F-N items resolve at target-phase kickoff per design.
- L5 path: verified correct after Session 42 archive move.
- L6 "Last updated" header: `2026-04-21 (Session 41 — Phase 0 Group F)`. Accurate for substantive content.

**Verdict:** **KEEP AS-IS** — load-bearing reference, no edits needed now. Doc doing exactly what it was scoped to do: sat untouched while `/src` stayed frozen, capability map remained accurate, no Phase 2–5 rebuild has shipped to require a Status flip. Single mild drift signal (Open-F-1 has new Exp 2a evidence) is **not** a SRC_SUNSET edit trigger — it's a Phase 2 Session B kickoff input.

**Retirement trigger:** distant. Per L109–115, doc retires when (a) Phase 5 demo passes, (b) every non-excluded row's Status reads "Rebuilt" with a SHA, (c) all five Open-F-N items resolved. Realistically months out. Expected next substantive edit: Phase 2 Session B kickoff, when outbound-send-pipeline row's Status flips and Open-F-1 resolves.

---

### 19. CC_HANDOFF.md — KEEP AS-IS

**Path + lines:** `CC_HANDOFF.md` — 232.

**Last substantive update:** `2026-04-26 21:48` — "session 54 close-out". Doc dated `2026-04-26 (Session 54 — doc-only)` at L2. Commit log shows clean cadence of one close-out per session (Sessions 47–54 visible, each rewriting this file).

**Canonical content:** By spec (CLAUDE.md L120), canonical session-to-session handoff artifact — captures prior session's commits, completed work, in-progress work, quality checks, retirement-sweep findings, gotchas, files modified, suggested next tasks. **By design ephemeral**: each close-out overwrites in full.

**Audit lens (per special note):** Does the format/discipline still serve, not whether content is current.

**Overlap:**
- Phase 1 experiment status (L86–102) restates state in MASTER_PLAN.md §5/§8 and REPO_INDEX.md "Active plan pointer." **Not a One-Source-Rule violation** — explicitly time-stamped session state, not redefinition of canonical fact.
- DECISIONS counts (L102, L113) restate active count 280 and archive range. Same reasoning — session-time snapshot. Acceptable.
- Commit list (L9–16) duplicates `git log` content but in more readable form with descriptions of why each commit happened. Genuinely additive value.
- **No drift-prone duplication of canonical facts** — pricing, SDK architecture, scope boundaries, screen specs not restated. Doc respects One Source Rule.

**Drift (format-vs-spec):**

| Spec requirement (CLAUDE.md L112–121) | Present? |
|---|---|
| Commits | Yes (L7–18) |
| Completed work | Yes (L24–81) |
| In-progress work | Yes (L117–119) |
| Quality checks passed | Yes (L106–113) |
| Retirement sweep findings (if applicable) | N/A — Session 54 not phase-boundary; correctly omitted |
| Gotchas | Yes (L137–153) |
| Files modified | Yes (L157–202) |
| Suggested next tasks | Yes (L206–228) |

Additional content beyond spec (high value):
- **Pre-flight session-start reality check** (L20) — git HEAD reconciliation.
- **Current State** (L84–103) — explicit phase + experiment status snapshot.
- **Pending (post-Session-54)** (L123–133) — distinct from "Suggested Next Tasks" (queued vs. PM-discretion).
- **Closing summary paragraph** (L232) — recap.

**No drift between spec and product.** Discipline stable across sessions. Spec uses word "Overwrite" (L120); doc itself references this at L189.

**Verdict:** **KEEP AS-IS.** Ephemeral by design — overwritten in full at each close-out. "Is content current" is N/A by construction. Format/discipline test is right lens; doc passes. Every CLAUDE.md L112–121 section present (or correctly omitted), One-Source-Rule respected, additions beyond spec add resumability value without drift surface. No action recommended.

---

### 20. docs/CARRIER_BRAND_REGISTRATION_FIELDS.md — KEEP AS-IS

**Path + lines:** `docs/CARRIER_BRAND_REGISTRATION_FIELDS.md` — 116.

**Last substantive update:** `2026-04-25 13:33` — "land brand-registration fields reference" (substantive, only commit). Created Session 51 (Experiment 3a execution day).

**Canonical content:** Sinch/TCR brand-registration field reference: Bundle / Company / Financial / Contact field tables, `brandEntityType` 3-value enum (load-bearing for Phase 5), partial `brandVerticalType` 22-value mapping, brand state-machine 5-vs-7 API/dashboard mismatch, field-level constraints. Canonical translation surface between Sinch's API/dashboard and RelayKit's customer-facing wizard.

**Overlap (low/clean):**
- **PROTOTYPE_SPEC.md** §"Registration Form" (L836–851) describes customer-facing form's UI behavior. Does NOT enumerate Sinch-side field set this doc owns. Complementary; PROTOTYPE_SPEC owns "what RelayKit collects in UI"; this doc owns "what Sinch ultimately needs."
- **experiments-log.md (Exp 3a):** significant intentional overlap, properly attributed. 3a's Findings (L256–269) reference this doc five times by name. Sinch findings live in experiments-log; **interpretation/structuring** lives here. Clean One-Source compliance.
- **REPO_INDEX.md L66 + L130** restate doc's headline facts. Acceptable as repo-index orientation.
- **BACKLOG.md** references "BACKLOG entry on Sole Proprietor segment gap," etc. Pointers correct.

**Drift:**
- **Session 51 / Experiment 3a content integration: complete.** CC_HANDOFF L214 describes doc as "gained content Session 51 around 3a." That content is in fact integrated.
- **Session 54 flag still pending, by design.** CC_HANDOFF flags doc for "FULL-collected-fields update at execution time" of Exp 3c. Exp 3c BLOCKED on 3b approval. §"Field structure" Simplified-only by design; FULL delta surfaces only when 3c runs. Correct deferred-update posture.
- **L112–116 footer** "Phase 5 (Registration Pipeline on Sinch, MASTER_PLAN §9)" matches v1.2 §9 exactly.
- **Experiment numbering: clean.** Doc only references "Experiment 3a" — unchanged across v1.2 amendment.
- **D-number references:** Only D-18 cited (L78), correctly located in DECISIONS_ARCHIVE L101.
- **Minor One-Source-Rule rough edge:** L78's HEALTHCARE/D-18 sentence repeats verbatim what experiments-log.md L268 says, what CC_HANDOFF says, and what is now annotated on D-18 directly. Three or four homes for same one-sentence claim. Candidate for "lives in D-18 annotation only, others point" pruning.
- **Forward-looking gaps (not drift):** 21 of 22 `brandVerticalType` mappings TBD; 4 unmapped Bundle-state↔dashboard-state rows; `IdentityStatus` intermediate transitions not captured. All explicitly tagged.

**Verdict:** **KEEP AS-IS.** Single-commit doc accurately scoped to Exp 3a Simplified-tier capture, with deferred-update flag for 3c execution clearly tracked in CC_HANDOFF. No drift against MASTER_PLAN v1.2 numbering, no deprecated D-numbers, clean One-Source compliance (one minor HEALTHCARE/D-18 redundancy across 3–4 locations). All TBDs honest forward-looking gaps. No action required pre-3c; FULL-tier addition + `brandVerticalType` table fill should land alongside Exp 3c findings commit.

---

### 21. docs/VOICE_AND_PRODUCT_PRINCIPLES_v2.md — KEEP AS-IS

**Path + lines:** `docs/VOICE_AND_PRODUCT_PRINCIPLES_v2.md` — 209. Sibling archive at `docs/archive/V4_EXPERIENCE_PRINCIPLES_v1.1.md` (predecessor properly retired).

**Last substantive update:** Single commit (substantive — initial v2 creation): `2026-04-03 09:54:52` — "track voice principles v2, archive v1.1, add starter kit program". Document header internally dated **April 2, 2026**, labeled **Version 2.0**. **No edit since v2 cutover** (~3 weeks ago, predates entire Phase 1 experimental arc). v2 header explicitly states "Replaces: V4_EXPERIENCE_PRINCIPLES_v1.1.md. That document is retired. Remove references to it in CLAUDE.md and other project files." — retirement instruction satisfied. REPO_INDEX classifies as `(stable)`.

**Canonical content:** Canonical source for RelayKit's writing voice (Product Voice + Demand Voice), three-tier information hierarchy (show / few-words / full-explanation), Kill List of banned vocabulary, one-sentence rule for in-product explanations. Mandatory reading per CLAUDE.md "Copy rule" before any user-facing string. MASTER_PLAN §2: "the voice principles are not negotiable."

**Overlap:**
- **PRODUCT_SUMMARY.md L234 paraphrases three-tier model and partial kill-list** ("kill list bans '10DLC', 'campaign', 'TCR', 'compliance'..."). Paraphrase-with-anchor (points at v2 by filename), permitted "paraphrase and point" pattern. **Acceptable.**
- **PRODUCT_SUMMARY.md L236** restates platform copy constraints from CLAUDE.md/DECISIONS — v2 doesn't state them. No conflict.
- **CLAUDE.md L31 ("Copy rule")** points at v2 — see drift below.
- **PROTOTYPE_SPEC.md** does not duplicate voice rules in prose; applies them per-screen. No restatement violation.
- **DECISIONS.md** references "Voice Principles v2.0" in D-365's reasoning as binding for consent-disclosure copy. Reference-not-restatement. Acceptable.
- **No marketing-page or landing-copy doc currently exists** that would risk drift against Demand Voice section.

Verdict on overlap: **clean under One Source Rule.**

**Drift (5 items, ranked):**

1. **CLAUDE.md "Copy rule" terminology mismatch (high — actively misleading CC).** CLAUDE.md L124 instructs CC to apply "**the vocabulary table, framing-shift table, emotional-states map, and one-sentence principle**." v2 has **none of those four labels**. v2 has: *Examples* table (§2), *Kill List* with two tables (§6 — compliance jargon + tone killers), *information hierarchy* (§5), *one-sentence rule* (§2). "Framing-shift table" and "emotional-states map" appear to be vestigial v1.1 vocabulary retired in v2 rewrite but never updated in CLAUDE.md. CC reading CLAUDE.md will look for tables that do not exist.
2. **Pricing example in §2 Examples table.** L42 shows `Marketing adds $10/month` — verified consistent with current PRICING_MODEL ($49 + $19/mo base, or $29/mo with marketing = $10 delta). **No drift here on close read** — flagged because pricing is known drift hotspot.
3. **No reference to D-365's consent disclosure language (low — by design, but worth noting).** D-365 commits to four-element consent disclosure on every phone-collection surface, with exact wording mutable per Voice Principles. v2's Examples table doesn't include consent-disclosure exemplar. Gap, not contradiction. Worth adding if PM intends consent disclosures as recurring copy artifact.
4. **Voice violations in DECISIONS caught and remediated** by 2026-04-24 audit (D-105 used "10DLC"; D-157 used "leverage"). Both fixed Session 48. Voice doc itself correctly identifying both in §6 Kill List. **No drift in v2** — confirms kill list is operative.
5. **No D-numbers cited in v2 (low — by design).** Foundational principle document, not decision ledger. Not drift.

**Verdict:** **KEEP AS-IS** with one targeted CLAUDE.md edit. Doc itself in good shape — internally consistent, properly retiring predecessor, correctly cited by MASTER_PLAN §2 and PRODUCT_SUMMARY §234, actively enforced. The drift is **outbound**: CLAUDE.md L124's "Copy rule" describes v1.1's structure instead of v2's. **One-line fix in CLAUDE.md, no edits to v2.** Optional follow-up: add consent-disclosure row to §2 Examples table to anchor D-365's mutable wording in canonical copy.

---

## Cross-doc overlap matrix

Built by deduplicating overlaps surfaced across all 21 agent reports. Each row notes the recommended canonical owner per One Source Rule, plus confidence (clear / PM-judgment-needed).

| # | Overlapping content | Docs involved | Canonical owner per One Source Rule | Confidence |
|---|---|---|---|---|
| 1 | Pricing facts ($49, $19/mo, $29/mo, $8/500, etc.) | PRICING_MODEL.md ✓; PRODUCT_SUMMARY.md L206–212 (restates); PROTOTYPE_SPEC.md L74 (stale "$150 go-live" citing superseded D-216); STARTER_KIT_PROGRAM.md §5+§11 (stale split); CLAUDE.md L7 (paraphrase, OK); README.md L3 (paraphrase, OK); MASTER_PLAN.md L17/L25 (paraphrase, OK); PRD_SETTINGS_v2_3 §4.4 (restates) | PRICING_MODEL.md (per One Source Rule explicit) | Clear |
| 2 | DECISIONS workflow / six gate tests | PM_PROJECT_INSTRUCTIONS.md L246–339 (policy); CLAUDE.md L42–99 (operational) | Split correctly: PM doc = policy, CLAUDE.md = operational | Clear (no action) |
| 3 | Active plan pointer / Phase 1 experiment status | MASTER_PLAN.md §5 ✓; REPO_INDEX.md L150–157 (restates in detail); CC_HANDOFF.md L86–102 (session-state snapshot, acceptable) | MASTER_PLAN for canonical phase status; REPO_INDEX should hold one-line pointer; CC_HANDOFF acceptable as ephemeral session-state | Clear |
| 4 | Screen-level UI specs (settings, wizard, workspace) | PROTOTYPE_SPEC.md ✓; WORKSPACE_DESIGN_SPEC.md L106–243 (~140 lines screen prose); PRD_SETTINGS_v2_3 §2/§4/§8/§11 (heavy duplication); PRODUCT_SUMMARY.md §3/§4/§5/§6 (drifts into lane) | PROTOTYPE_SPEC.md (per One Source Rule) | Clear |
| 5 | Post-signup workspace architecture | WORKSPACE_DESIGN_SPEC.md ✓; PROTOTYPE_SPEC.md L247+ (mechanics); PRD_SETTINGS_v2_3 §8 (settings architecture) | WORKSPACE_DESIGN_SPEC.md for architecture; PRD_SETTINGS for account-vs-app split; PROTOTYPE_SPEC for mechanics | Clear |
| 6 | AGENTS.md template / SDK README outline | AI_INTEGRATION_RESEARCH.md §8 (draft template); SDK_BUILD_PLAN.md §4c (spec-level); STARTER_KIT_PROGRAM.md §16 (also points at §8) | AI_INTEGRATION_RESEARCH §8 until Phase 8 ships; then SDK_BUILD_PLAN.md §4c becomes operational owner | PM-judgment-needed (Phase 8 gating) |
| 7 | First-party starter kit plan | STARTER_KIT_PROGRAM.md (entire doc); AI_INTEGRATION_RESEARCH.md §8 (proposes ship the appointments starter) | **Both retired** by MASTER_PLAN §13 + §16 (third-party integration strategy). No canonical owner; archive STARTER_KIT_PROGRAM, deprecation-flag AI_INTEGRATION_RESEARCH §8 | Clear |
| 8 | Pipeline status enum / SendResult shape | MESSAGE_PIPELINE_SPEC.md L50/L95 ('queued'\|'sent'\|'delivered'\|'failed'); SDK_BUILD_PLAN.md §8 ('sent'\|'queued'\|'blocked'\|'failed' per D-362) | MESSAGE_PIPELINE_SPEC for pipeline internal state (per One Source Rule "pipeline behavior"); SDK_BUILD_PLAN for SDK return shape (per One Source Rule "SDK architecture") — but they must reconcile per Phase 2 Session B kickoff (new D-number expected) | PM-judgment-needed |
| 9 | API endpoint surface | MESSAGE_PIPELINE_SPEC.md (canonical); SDK_BUILD_PLAN.md §4b §9 (restates + adds `GET /v1/messages/:id`) | MESSAGE_PIPELINE_SPEC.md (per One Source Rule). SDK_BUILD_PLAN §4b §9 should be README-section spec, not authoritative pipeline contract | Clear |
| 10 | Out-of-scope items (multi-project, BYO, platform tier, etc.) | MASTER_PLAN.md §16 ✓; BACKLOG.md L20/L38/L40/L56/L58/L90/L116/L168/L226 (~7 duplications) | MASTER_PLAN §16 owns "out-of-scope for launch"; BACKLOG owns parked-but-unevaluated, deferred-with-design-detail, Rejected table | Clear |
| 11 | DECISIONS active vs. archive cross-references | DECISIONS.md "Archived Decision Index" L35–137 (summary); DECISIONS_ARCHIVE.md (full text + inline annotations) | Inline annotation in archive is canonical; index is convenience. D-47 mismatch noted (index lacks orphan note archive has) | Clear |
| 12 | Voice principles / kill list | VOICE_AND_PRODUCT_PRINCIPLES_v2.md ✓; PRODUCT_SUMMARY.md §14 (paraphrase + partial kill list); CLAUDE.md "Copy rule" L31 (pointer); CLAUDE.md L124 (drifted terminology — references v1.1 structure) | VOICE_AND_PRODUCT_PRINCIPLES_v2.md (per One Source Rule). CLAUDE.md L124 needs one-line fix to match v2 structure | Clear |
| 13 | Customer experience / journey narrative | PRODUCT_SUMMARY.md ✓ (PM-facing); PROTOTYPE_SPEC.md (mechanics); MASTER_PLAN.md §0 North Star (high-level) | PRODUCT_SUMMARY.md owns customer-experience narrative; trim its drift into screen-spec territory | Clear |
| 14 | Design system tokens + component APIs | UNTITLED_UI_REFERENCE.md ✓ (canonical); CLAUDE.md "Design system rules" L15–21 (4 headline rules with pointer); PROTOTYPE_SPEC.md L54 (4 headline rules with pointer); ShieldCheck/ShieldTick gotcha (in CLAUDE.md + PROTOTYPE_SPEC, missing from canonical owner) | UNTITLED_UI_REFERENCE.md owns full content; should add gotcha so headline-pointers don't have to | Clear |
| 15 | /src sunset rationale + capability map | SRC_SUNSET.md ✓ (per One Source Rule explicit); MASTER_PLAN.md §1 + Phase 0 narrative (acceptable plan-level rationale); DECISIONS.md D-358 (decision authority) | Split correctly: D-358 = decision; SRC_SUNSET = capability map; MASTER_PLAN = narrative | Clear (no action) |
| 16 | Carrier brand-registration fields | docs/CARRIER_BRAND_REGISTRATION_FIELDS.md ✓; experiments-log.md (live findings, attributes back); D-18 inline annotation (HEALTHCARE/Sinch context) | CARRIER_BRAND_REGISTRATION_FIELDS.md owns structured field reference; HEALTHCARE/D-18 sentence repeats across 3–4 locations — candidate for "lives in D-18 only, others point" | Clear |
| 17 | Session-to-session handoff format | CC_HANDOFF.md ✓; CLAUDE.md L112–121 (spec) | CC_HANDOFF.md = artifact, CLAUDE.md = spec. Format meets and exceeds spec usefully | Clear (no action) |
| 18 | Tier 2 file membership | PM_PROJECT_INSTRUCTIONS.md L39–46 (lists 5 incl. PRODUCT_SUMMARY); REPO_INDEX.md L17–28 (lists 4, missing PRODUCT_SUMMARY) | PM_PROJECT_INSTRUCTIONS.md is the policy doc; REPO_INDEX.md needs to be brought into agreement | Clear (REPO_INDEX edit) |
| 19 | "Last touched" dates for canonical docs | REPO_INDEX.md (canonical); 9 rows stale vs. git log | REPO_INDEX.md (drift-prone surface; needs auto-refresh discipline) | Clear |

---

## Proposed canonical-source index for REPO_INDEX.md

A new section to add to REPO_INDEX.md, mapping topic → canonical doc. Format mirrors the One Source Rule's bulleted list (PM_PROJECT_INSTRUCTIONS.md L65–71) so it slots cleanly into REPO_INDEX. Each line is the canonical home for the topic; other docs may paraphrase and point but may not restate.

**Draft for PM review (do NOT add to REPO_INDEX.md without approval):**

```markdown
## Canonical sources by topic

This index maps each major topic to its single canonical doc. Per the One Source Rule
(PM_PROJECT_INSTRUCTIONS.md "Docs Hygiene"), every fact lives in exactly one canonical doc;
other docs reference it, never restate it. Use this index to decide where a new fact lives,
or where to look when surfaces disagree.

### Product
- Pricing facts (numbers, refund policy, tier definitions) → docs/PRICING_MODEL.md
- Phases / scope / out-of-scope / North Star / risks → MASTER_PLAN.md
- Customer-experience narrative (PM-facing reference) → docs/PRODUCT_SUMMARY.md
- Voice / copy principles / kill list → docs/VOICE_AND_PRODUCT_PRINCIPLES_v2.md
- Parked ideas / Rejected table → BACKLOG.md

### UI / Design
- Screen-level UI specs (every prototype screen) → PROTOTYPE_SPEC.md
- Post-signup workspace architecture (state machine, layout systems) → WORKSPACE_DESIGN_SPEC.md
- Settings PRD (rejection-behavior model, notification triggers, account-vs-app split) → docs/PRD_SETTINGS_v2_3.md
- Design system tokens + component APIs → docs/UNTITLED_UI_REFERENCE.md

### Engineering
- Message pipeline behavior (`/api`) → MESSAGE_PIPELINE_SPEC.md
- SDK architecture / publication plan → SDK_BUILD_PLAN.md
- /src sunset capability map → SRC_SUNSET.md
- Carrier registration field knowledge (Sinch/TCR fields) → docs/CARRIER_BRAND_REGISTRATION_FIELDS.md
- AI-integration developer-tool research (Phase 8 rationale) → docs/AI_INTEGRATION_RESEARCH.md
  (RETIRES when Phase 8 closes)

### Process / governance
- Decision history (active D-84+) → DECISIONS.md
- Decision history (archived D-01–D-83) → DECISIONS_ARCHIVE.md
- PM standing instructions (synced to Claude.ai UI) → PM_PROJECT_INSTRUCTIONS.md
- CC standing instructions (operational, on-disk) → CLAUDE.md
- Repo doc inventory + active plan pointer → REPO_INDEX.md (this file)
- Session-to-session handoff (ephemeral, overwritten each session) → CC_HANDOFF.md

### Notes on the README exception
The repo-root README.md may paraphrase one-sentence summaries from any of these (e.g.,
"$49 to register and $19/month thereafter") for orientation, but may not restate full
rules. CLAUDE.md inherits the same exception for orientation summaries. When in doubt,
paraphrase and point.

### When this index drifts
If PM or CC discovers two docs that both claim canonical ownership of the same topic,
flag for PM judgment per the One Source Rule. Update this index and the canonical doc
together; never silently override.
```

**Coverage check:** All 21 audited docs appear in this index as canonical owner of at least one topic. No doc orphaned. STARTER_KIT_PROGRAM.md and the README.md exception are addressed inline.

**Insertion point in REPO_INDEX.md:** After §"Canonical docs (`/docs`)" table (current L67) and before §"Tier 3 — Reference Materials" or §"Subdirectory map" — wherever PM judges most discoverable.

---

## Proposed drift-detection cadence (CLAUDE.md addition)

Exact wording to add to CLAUDE.md "Session close-out" numbered list, inserted between current step 8 (overwrite CC_HANDOFF.md) and current step 9 (Do NOT push). Current step 9 renumbers to 10.

**Draft for PM review (do NOT add to CLAUDE.md without approval):**

```markdown
9. **Phase-boundary close-outs only — drift watch.** For each canonical doc listed in the
   REPO_INDEX.md "Canonical sources by topic" index, compare the doc's last substantive
   commit date against the most recent substantive change date in its subject area. Subject-
   area reference points: MASTER_PLAN.md (phases/scope), CC_HANDOFF.md (current state),
   experiments/sinch/experiments-log.md (Phase 1 findings), and any phase-specific artifact
   the close-out touched. Flag any doc whose subject has moved more recently than the doc
   itself in CC_HANDOFF's "Drift watch" section. Findings only — no doc edits as part of
   the sweep. Mid-phase close-outs skip this step. Pairs with the retirement sweep at step 6.
```

**Rationale:** Phase-boundary-only matches the existing retirement-sweep pattern at step 6 (mid-phase close-outs skip both, keeping cadence cost low). The "subject-area reference points" framing handles the common case (MASTER_PLAN moves, downstream docs go stale) without requiring the cadence to enumerate every possible drift surface. "Findings only" preserves the "PM gates corrections" discipline that runs through the rest of CLAUDE.md.

**Voice check against existing CLAUDE.md L112–121 numbered list:**
- "Apply all six gate tests per PM_PROJECT_INSTRUCTIONS.md" (L115) — imperative, references-other-doc pattern. Match.
- "Run retirement sweep if close-out crosses a phase boundary (findings only — no edits)" (L118) — phase-boundary-conditional, "findings only" parenthetical. Match.
- Word count: ~95 words. Comparable to the longest existing step (step 8, ~50 words). Slightly longer but justified by the multi-input nature.

**Insertion point:** After line 119 (current step 8 end), before line 120 (current step 9 "Do NOT push"). Current step 9 → step 10.

**File-size discipline check:** CLAUDE.md is currently 158 lines. Self-imposed ceiling 200, target ~120. Adding ~6 lines pushes to 164 — still within ceiling but creeps further from target. PM may want to compensate by trimming elsewhere.

---

## Closing note

This audit is read-only findings. No doc edits, no D-numbers, no canonical-source index added to REPO_INDEX.md, no CLAUDE.md edit.

**Suggested triage cadence for PM:**

1. **Low-hanging fruit (~30 min each):** PROTOTYPE_SPEC L74 stale "$150 go-live" copy fix; CLAUDE.md L124 "Copy rule" terminology refresh; REPO_INDEX.md "Last touched" date refresh; MASTER_PLAN.md v1.2.1 reconcile-pass commit (L33 §1 state refresh + L131 + L236 + L468 + §17 L434).
2. **Strategic clarity (1 session):** STARTER_KIT_PROGRAM.md archive move with deprecation header; AI_INTEGRATION_RESEARCH.md §8 inline deprecation flag; PRD_SETTINGS_v2_3.md scope-clarify pass.
3. **Substantive doc revisions (1 session each):** MESSAGE_PIPELINE_SPEC.md Session B revision against experiments-log; WORKSPACE_DESIGN_SPEC.md update (header + Phase 3.7 + D-345 route + Key Decisions extension); UNTITLED_UI_REFERENCE.md RelayKit-fit pass.
4. **Process artifacts (gated on PM approval):** Add canonical-source index to REPO_INDEX.md; add drift-detection cadence to CLAUDE.md L120 (slot 9, push current 9 → 10).
5. **Open from prior audit (rolled forward):** DECISIONS_AUDIT_2026-04-24.md §A-1 (D-89/D-15/D-37/D-294 chain), §C-2 (D-286 JSON-registry), Appendix item 3 (D-241→D-211 reciprocal); plus this audit's residual archive annotations (D-27, D-60, D-61, D-82, D-83 reciprocal); plus D-350–D-362 backfill of `**Supersedes:**` field.

Each verdict slice can become its own focused cleanup session. Cleanup is not part of this audit.

*End of audit. 21 docs reviewed, 1 ARCHIVE, 1 SCOPE-CLARIFY, 13 KEEP + UPDATE, 1 RETIRE WHEN, 5 KEEP AS-IS.*
