# CC_HANDOFF — Session 64

**Date:** 2026-05-01
**Session character:** Marketing strategy domain scaffolding. Doc-only, six atomic commits, no push at end (PM review first). New canonical doc `docs/MARKETING_STRATEGY.md` (audience-organized plays + 8 MD-numbered marketing decisions + tool stack + channels) and companion archive `docs/MARKETING_STRATEGY_ARCHIVE.md` (4 deprecated approaches with deprecation triggers and revisit conditions). DECISIONS.md gains a one-line pointer; CLAUDE.md gains a short pointer-section establishing the product/marketing seam rule; REPO_INDEX adds two doc-table rows + a new Marketing bucket in the canonical-sources index. Marketing decisions get their own MD-numbered ledger sequence inside MARKETING_STRATEGY.md, separate from D-numbered product decisions. Same seven-gate-test rigor; different file. No D-numbers added. No external actions.
**Branch:** main (clean except expected untracked `api/node_modules/`)

`Commits: 6 | Files modified: 6 | Decisions added: 0 D-numbers, 8 MD-numbers seeded | External actions: 0`

(6 atomic commits this session including this close-out. 6 files modified including CC_HANDOFF.md per Session 63 convention: docs/MARKETING_STRATEGY.md, docs/MARKETING_STRATEGY_ARCHIVE.md, DECISIONS.md, REPO_INDEX.md, CLAUDE.md, CC_HANDOFF.md. PM bypass-mode amendments to follow this commit — see "Post-close-out amendments" section below.)

---

## Commits this session (in order)

| # | Hash | Description |
|---|------|-------------|
| 1 | `dfa339c` | docs(marketing): create MARKETING_STRATEGY.md as canonical marketing doc |
| 2 | `fadf128` | docs(marketing): create MARKETING_STRATEGY_ARCHIVE.md with 4 deprecated approaches |
| 3 | `d9f9772` | docs(decisions): pointer to MARKETING_STRATEGY for marketing decisions |
| 4 | `c1ffd62` | docs(index): add MARKETING_STRATEGY canonical docs to index |
| 5 | `5a21699` | docs(claude): note MARKETING_STRATEGY doc + product/marketing seam rule |
| 6 | (this commit) | docs(handoff): Session 64 close — MARKETING_STRATEGY canonical doc seeded |

All six commits unpushed at Session 64 close — pending PM approval before push.

---

## Session summary

### Commit 1 — docs/MARKETING_STRATEGY.md (`dfa339c`, +186, file created)

Canonical marketing strategy doc, Tier 3 (load on demand only, not read at session start). Sections:

- **North Star** — Audience-narrow ("indie hackers and small-team founders shipping with starter kits") use-case-broad (every SMS use case those apps need) positioning. Distribution-before-growth thesis (72% of indie failures are distribution, not product). Founder-led until $5K MRR or 50–100 customers; pre-revenue marketing spend ceiling $0–$500/mo; time and content investment unlimited.
- **Unfair advantages** — Founder authenticity, compliance abstraction as the genuine product differentiator, AI as force multiplier (Stripe 2024 Indie Founder Report data), build-in-public posture (Levels / Lou / Barry pattern).
- **Audience-organized plays** — Three audiences with prioritized plays + trigger conditions:
  - **Primary** indie hackers shipping with starter kits — 7 plays ranked by leverage: starter-kit integration program (Resend playbook, sequenced KolbySisk → ShipFast → Supastarter → Makerkit → Vercel), reference content as both integration guide and SEO landing, IH/HN presence, affiliate-program participation, long-tail OTP/verification SEO, beta cohort recruitment vertical-diverse, X/dev-Twitter presence.
  - **Secondary** AI-tool-first builders (Cursor / Claude Code / Windsurf) — AGENTS.md as marketing artifact, AI-tool comparison content, demos.
  - **Tertiary watch** no-code vibe coders (Lovable / Bolt / Replit) — Phase 5+ exploration with connector-shaped delivery model; Lovable Twilio connector cited as the unoccupied gap.
- **Plays in Active Sequence** — Operational view: Pre-launch (lead bookmarking, affiliate signups, integration template, low-intensity X) → Launch wave (Show HN, IH launch, manual outreach, maintainer DMs, first /guides/ live) → Growth wave (one starter guide/week, affiliate activation, 1–2 SEO articles/week, beta testimonials, daily X) → Scale signal (re-evaluate hiring against the channels-converting-and-Joel-is-bottleneck rule).
- **Marketing Decisions on Record** — 8 MD-numbered decisions, MD-1 through MD-7 active and MD-8 deferred. Each entry: what was decided + what was rejected + trigger to revisit. Same seven-gate-test rigor as DECISIONS.md.
  - **MD-1** Audience-narrow, use-case-broad positioning. Rejects "RelayKit for OTP" (too narrow) and "RelayKit for everyone who needs SMS" (too broad).
  - **MD-2** Founder-led marketing until $5K MRR or 50–100 customers. Rejects pre-revenue marketer hire / agency / paid ads at scale.
  - **MD-3** Build-in-public posture with revenue transparency. Rejects opaque marketing / partial transparency.
  - **MD-4** Starter-kit embedding strategy, not first-party starter. Rejects build-our-own-starter (already deprecated, see archive A-1).
  - **MD-5** Affiliate-program participation as revenue side-channel. Rejects hide affiliate / refuse on principle / build own affiliate program pre-launch.
  - **MD-6** Community presence, not cold email or paid acquisition, until $5K MRR. Rejects outbound email at scale and paid acquisition.
  - **MD-7** "Verification included" as the marketing pillar. Pillar wording confirmed PM Session 62 / VERIFICATION_SPEC §12. Rejects "free OTP" pricing / OTP-only positioning.
  - **MD-8** DEFERRED — Pricing transparency stance. Default to value-stated-as-facts pricing; richer transparency move parked. Trigger to resolve: competitor undercut OR Joel's proactive call.
- **Tools and Force Multipliers** — AI roles (PM Claude / Claude Code / ChatGPT / v0 / Perplexity / Cursor / Claude Code in IDE); content quality discipline (human-facing = founder-voiced, machine-facing = AI-heavy with founder review; AI-detection by recipients is real in 2026 and cuts reply rates dramatically); SaaS tooling one-of-each (Plausible/Fathom, Resend, Posthog, Cal.com, Senja/Testimonial.to, GitHub); mentor reading list (Levels / Lou / Wilke / Barry / Dinh / Metsa).
- **Channels** — Per-channel snapshot: relaykit.ai (homepage live, /start/verify live, /guides/ planned), GitHub repo (README + AGENTS.md as marketing artifacts), X (low-intensity now, daily post-launch), HN (Show HN planned), IH (passive now, active post-SDK), Reddit, starter-kit communities, AI-tool Discords, email list (not yet collected).
- **What We're Explicitly Not Doing** — paid ads pre-revenue, hiring pre-revenue, first-party starter, cold email blasts, healthcare ICP (D-18), enterprise sales motion, conference sponsorship, press/journalist outreach.

Voice: declarative, factual, no marketing language about marketing, no hedging. Matches VERIFICATION_SPEC.md and PRODUCT_SUMMARY.md.

### Commit 2 — docs/MARKETING_STRATEGY_ARCHIVE.md (`fadf128`, +31, file created)

Companion archive parallel to DECISIONS_ARCHIVE.md. Four starting deprecated approaches:

- **A-1** Build first-party starter kit — deprecated April 2026 after Resend playbook research. Revisit only if every major starter rejects partnership AND a verticalized starter would clearly outperform horizontal alternatives.
- **A-2** "Your AI tool builds it" as primary differentiator — deprecated April 2026 in honesty pass; AI integration speed is table stakes by 2026, not a differentiator. Genuine differentiators are pre-written compliant messages and handled carrier registration. Revisit if AI-tool integration becomes structurally harder or a competitor counter-positions.
- **A-3** $199 setup fee with two-payment split — deprecated April 2026 by D-320 ($49 single payment). Revisit if margin pressure from carrier-registration cost increases.
- **A-4** "OTP, free forever" marketing pillar — deprecated April–May 2026; pricing math made true-free OTP unsustainable for a bootstrapped product. Resolved as "Verification included" (MD-7). Revisit if funded competitor positions on free OTP, or delivery costs collapse.

Format per entry: Approach name, Decided, Deprecated, Trigger for deprecation, What would trigger a revisit.

### Commit 3 — DECISIONS.md marketing pointer (`d9f9772`, +8)

New `## Marketing decisions` section inserted between the canonical entry-format / supersession block and the `## Archived Decision Index` heading. Section explains:

- Marketing decisions live in `docs/MARKETING_STRATEGY.md` under "Marketing Decisions on Record" (MD-numbers, separate sequence).
- Same gate-test rigor; different file. Keeps marketing prose readable as a coherent strategy document rather than fragmenting it across two ledgers.
- Product/marketing seam rule: lives in MASTER_PLAN/DECISIONS if mostly product, lives in MARKETING_STRATEGY if mostly marketing, with a cross-reference in the other file.
- The MD-numbered entries themselves do not appear in DECISIONS.md.

### Commit 4 — REPO_INDEX.md additions (`c1ffd62`, +12/-4)

Three updates:

- **`## Canonical docs (`/docs`)` table** — Two new rows (last touched 2026-05-01): `MARKETING_STRATEGY.md` (full purpose line covering scope + Tier 3 status + MD-numbering note) and `MARKETING_STRATEGY_ARCHIVE.md` (purpose line covering 4 starting entries + format).
- **`## Canonical sources by topic` index** — New `### Marketing` bucket inserted between Engineering and Process/governance, with two entries (strategy + archive).
- **Meta block bumps** — Last updated → 2026-05-01 with Session 64 summary; Decision count unchanged at D-371 (next D-372) with new MD-counter sub-line `MD-8 (next available: MD-9), 8 MD-numbered decisions seeded this session (MD-1..MD-7 active, MD-8 deferred), separate sequence from D-numbers, lives in docs/MARKETING_STRATEGY.md`; Master plan last updated unchanged at 2026-05-01 v1.4 with note `No MASTER_PLAN edits Session 64 (marketing-strategy scaffolding is parallel to product plan, not a Phase amendment)`; Unpushed local commits → 6 with all six Session 64 commit references.
- **Session 64 change-log entry** — Appended chronologically after Session 63 covering all six commits with hashes and substance.

### Commit 5 — CLAUDE.md marketing-strategy-doc section (`5a21699`, +3)

New `## Marketing strategy doc` section inserted between `## Copy rule` and `## Prose-sweep verification`. Three lines (one paragraph):

> Marketing decisions and plays live in `docs/MARKETING_STRATEGY.md`, not DECISIONS.md. Decision sequence is MD-1, MD-2, etc. — independent from D-numbered product decisions. Same gate-test rigor (PM_PROJECT_INSTRUCTIONS.md seven gate tests). Archive at `docs/MARKETING_STRATEGY_ARCHIVE.md`. Product/marketing seam rule: mostly-product decisions live in MASTER_PLAN/DECISIONS with marketing cross-reference; mostly-marketing decisions live in MARKETING_STRATEGY with product cross-reference. Load on demand only — not read at session start.

CLAUDE.md size 177 → 180 lines, well under the 200-line ceiling per file-size discipline rule.

### Commit 6 — close-out (this commit)

CC_HANDOFF.md overwritten with this Session 64 handoff including the quantitative session-metrics line. **No retirement sweep** — Phase 1 hasn't crossed a phase boundary; mid-phase close-out per CLAUDE.md step 6 rule. **No drift-watch findings block** — the marketing-strategy domain is being scaffolded for the first time this session; there are no upstream subjects for the new docs to drift behind, and no existing canonical-source documents were touched in subject-area-changing ways. Future sessions that touch marketing strategy substantively will run drift-watch as normal.

---

## Quality checks passed

- Doc-only session — `tsc --noEmit` / `eslint` / `vitest` not required per CLAUDE.md close-out gates.
- No D-numbers added. Seven-gate-test rigor applied implicitly to MD-1..MD-8 in their authoring (each names a rejected alternative + a trigger to revisit, satisfying the alternative test that's the seventh gate per PM_PROJECT_INSTRUCTIONS.md).
- Pre-flight DECISIONS ledger scan run at session start: Active count 286 (latest D-371), Archive D-01–D-83. No new decisions since previous session — but the scan **flagged D-368 Reasoning/Affects orphaned at end of file** (see "Surface for PM" below).
- Pre-flight git state at session start: HEAD == `30813df` == `origin/main` (Session 63 commits all pushed). Working tree clean except untracked `api/node_modules/`.
- File-size discipline: CLAUDE.md 177 → 180 lines, well under 200-line ceiling.

---

## Pending items going into next session

**New active queue (Joel's hands, not mine):**

1. **Joel: sign up for affiliate programs.** ShipFast (50% on first purchase), Supastarter, Saaspegasus, Makerkit. Capture affiliate IDs in MARKETING_STRATEGY.md "Channels" section under each starter (or "Tools and Force Multipliers / SaaS tooling" — wherever fits). Trivial pre-launch action, no dependencies. Per MD-5.
2. **Joel: confirm tooling choices** — Plausible/Fathom for analytics, Resend for email, or push back if a different tool fits better. Per MARKETING_STRATEGY.md "Tools and Force Multipliers / SaaS tooling — one of each, no proliferation" section. Once confirmed, the chosen tool gets affirmed in the doc.

**PM-side scheduling items:**

3. **PM: marketing-strategy review pass after Phase 1 downstream closes.** When 3c / 4 / 2b complete, schedule a review of the active sequence (Pre-launch / Launch / Growth / Scale) to see if experiments revealed something that should adjust the play ordering or trigger conditions.
4. **PM: MD-8 (pricing transparency) deferred — resolve when triggered.** Either a competitor undercuts on price and we want to surface our cost structure as defense, OR Joel wants to make the case proactively as differentiation. No action required until either trigger.

**Carry-forward from prior sessions (still applicable):**

5. **Phase 1 downstream queue UNBLOCKED 2026-05-01.** Experiments 2b (live sample SMS over approved campaign), 3c (campaign upgrade flow), 4 (STOP/START/HELP behavior). Suggested order from Session 63: 2b first (validates API → carrier → handset), then 4 (consent state machine), then 3c (Phase 5 input but not blocking). PM directs ordering.
6. **Migration 006 manual application.** SQL committed at `api/supabase/migrations/006_signups.sql` since Session 58 but not yet applied to live shared Supabase. Joel needs to apply via Supabase dashboard SQL editor or `supabase db push`.
7. **Sinch reseller designation Phase 5 architecture decision.** BACKLOG entry filed Session 62 reseller round (`22276f3`). Decision is architecture-level, not implementation; surface during Phase 5 kickoff.
8. **LEGAL_DOC_DEFERRED_CLAIMS.md forward-looking note.** Phase 6 ship will likely trigger restoration of OTP-related capability language in legal docs. Not current work; surface at the Phase 6 close-out.
9. **Session B kickoff prerequisites still pending** (carry-forward from prior sessions, surfaced: 2026-04-25 Session 51, originating Sessions 50–52):
   - **Spec catch-up at MESSAGE_PIPELINE_SPEC.md** for status-enum intermediate state (Exp 2a), callback-receiver scope (MASTER_PLAN §6 L151), webhook signature-verification design without HMAC, XMS vs OAuth2 token disambiguation, ULID `carrier_message_id` format.
   - **Four Sinch API/dashboard inconsistencies** open for Sinch BDR (Elizabeth Garner) verification at kickoff.
   - **Resubmission API parity question** added Session 60.
   - **Approval-state observability question** added Session 63.
10. **Carry-forward (post-Phase-1 unblock):** BACKLOG aging review (Session C carryover, surfaced: 2026-04-27 Session 56).
11. **`feat/start-verify-and-get-started` branch retention** (surfaced: 2026-04-29 Session 58). On local + remote per D-368 branch hygiene rule. Do not delete until clearly settled.

---

## Resolved this session

None. Session 64 was a scaffolding session — no prior pending items closed, but new active queue items 1–2 (Joel's affiliate-program signups + tooling confirmation) are now unblocked and Joel-actionable.

---

## Post-close-out amendments

Per PM bypass-mode direction received after the initial six commits landed, two corrective items + one preventative item are landing as amendments to this Session 64 close. The CC_HANDOFF metrics line correction (item B from PM's amendment direction) is being applied via `git commit --amend --no-edit` to this close-out commit (which is currently HEAD); the other two amendments land as new commits following this one.

1. **Amendment B (this commit, applied via `--amend`):** Corrected metrics line from prompt-specified `Commits: 7 (including this close-out) | Files modified: 5` to actual landed `Commits: 6 | Files modified: 6` (including CC_HANDOFF per Session 63 convention).
2. **Amendment A (next commit):** Repair of D-368 Reasoning/Affects orphan from Session 62 split. D-368's Reasoning + Affects fields had been stranded as the last two lines of DECISIONS.md after D-371's Affects line — most likely Session 62's D-369 insertion (`83b3166`) split D-368's body when appending. Pre-flight ledger scan this session caught it. Multiline-safe-grep verification confirmed the orphaned text matches D-368's content exactly (preview-gate language, `/marketing-site` + `/app` + `/dashboard` + `PM_PROJECT_INSTRUCTIONS.md` + `CLAUDE.md` Affects), and that no other Session 62 entry (D-369/D-370/D-371) was similarly fragmented. Repair commit: `docs(decisions): repair D-368 Reasoning/Affects orphan from Session 62 split`. New commit, not a Session 62 amend, since Session 62's commits are already on origin/main per PM direction.
3. **Amendment C (commit after A):** Add metrics-counting convention to CLAUDE.md step 8 of "Session close-out" — explicit guidance that the close-out commit itself is included in `Commits` and `Files modified` counts. Prevents the recurrence of the metrics-line discrepancy that prompted this amendment cycle. Commit: `docs(claude): document session metrics counting convention`. Verifies CLAUDE.md stays under 200-line ceiling after addition.

After amendments A and C land, all eight commits (the six initial + the two PM-directed amendments + this close-out commit's amend) get pushed to origin/main per PM direction.

---

## Surface for PM

1. **MD-numbering live and active.** MD-1 through MD-8 seeded this session in MARKETING_STRATEGY.md. Next available MD-number: MD-9. PM tracks MD-counter in REPO_INDEX Meta block alongside D-counter going forward. CLAUDE.md gained the pointer to MARKETING_STRATEGY in Commit 5; future sessions reading CLAUDE.md will see the seam rule.

2. **No drift-watch this session.** The marketing-strategy domain is being scaffolded for the first time; there are no upstream subjects for MARKETING_STRATEGY.md to drift behind, and no existing canonical-source documents were touched in subject-area-changing ways. Future sessions that substantively touch marketing strategy (new MD-numbered decisions, new plays, new audiences, new tooling additions) will run drift-watch as normal.

3. **Session 62 split was not isolated to D-368 — verified.** Multiline-safe grep against D-369/D-370/D-371 (the three entries appended in Session 62 commit `83b3166`) confirmed each has its own properly-attached Supersedes/Reasoning/Affects fields. D-368 was the only victim of the split. Amendment A's repair is sufficient; no broader Session 62 corrective sweep needed.

---

## Files modified this session

**Repo files (committed) — six total per Session 63 convention (close-out included in count):**
- `docs/MARKETING_STRATEGY.md` (Commit 1 — new file, +186)
- `docs/MARKETING_STRATEGY_ARCHIVE.md` (Commit 2 — new file, +31)
- `DECISIONS.md` (Commit 3 — +8) — additional repair commit landing as Amendment A: D-368 Reasoning/Affects orphan reattached.
- `REPO_INDEX.md` (Commit 4 — +12/-4)
- `CLAUDE.md` (Commit 5 — +3) — additional commit landing as Amendment C: metrics-counting convention added to step 8.
- `CC_HANDOFF.md` (Commit 6 — this commit, overwritten + amended via Amendment B)

**Untouched this session:** `/prototype`, `/api`, `/sdk`, `/src`, `/marketing-site`, `MASTER_PLAN.md`, `PROTOTYPE_SPEC.md`, all docs under `/docs` except the two new marketing files, `BACKLOG.md`, audits, experiments.

---

## Suggested next task on chat resume

**Either** Phase 1 downstream work (Experiment 2b — live sample SMS over approved campaign — is the highest-leverage next experimental work, since it validates the API → carrier → handset send path that silent-drops in Experiments 1/1b/2a never confirmed) **or** marketing-side action items 1–2 above (Joel's affiliate-program signups + tooling confirmation, both Joel-actionable and trivial to land). PM directs.

---

## Other carry-forward (post-Phase-1 unblock)

- BACKLOG aging review (Session C carryover, still open, surfaced: 2026-04-27 Session 56)

No gotchas; no quality checks needed for this close-out (doc-only).
