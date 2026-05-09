# CC_HANDOFF — Session 74 (configurator section build + dashboard edit-mode port)

**Date:** 2026-05-09
**Session character:** Code session on production-facing surface (`/marketing-site`). Built and iterated the home-page configurator section through ~14 YOLO design rounds, culminating in a port of the dashboard's full Tiptap-based edit-message experience (atomic variable chips, per-message tone pills, +Variable popover, protected-variable compliance gate, Fix button) into the marketing site. One new D-number captures the architectural decision to replicate the editor from `prototype/lib/editor/` into `marketing-site/lib/editor/` rather than extract it into a shared workspace package.
**Branch:** `feat/configurator-section` — pushed to origin, **DO NOT MERGE**. Awaiting Joel preview verification at https://relaykit-marketing-site-bijt8jc9h-joelnatkins-projects.vercel.app and PM merge approval.

`Commits: 16 (15 prior feat commits + this close-out) | Files modified: 16 (branch total) + 4 (close-out) | Decisions added: 1 (D-375) | External actions: 1 (push)`

---

## Commits this session (chronological order)

| # | Hash | Description |
|---|------|-------------|
| 1 | `c1c4ea6` | feat(marketing): add configurator section to home page |
| 2 | `c45861a` | feat(marketing): iterate configurator — dashboard message-card, +Add, conditional website |
| 3 | `0711c4c` | feat(marketing): configurator iteration — split panels, info tooltips, layout reorder |
| 4 | `ad17b2a` | feat(marketing): configurator iteration — pills into panels, secondary nav CTA |
| 5 | `e01a592` | feat(marketing): configurator iteration — recommended-combos dropdown, brand-color variables |
| 6 | `cc2018e` | feat(marketing): configurator iteration — relocate inputs into Messages card, restyle dropdown |
| 7 | `19efe8a` | feat(marketing): hero + configurator iteration — left-align hero, strip right-column panel chrome |
| 8 | `b27925a` | feat(marketing): configurator iteration — spacing, sizing, type pass |
| 9 | `83431f1` | feat(marketing): configurator iteration — type, components, copy, spacing |
| 10 | `929e515` | feat(marketing): configurator iteration — card hug, dropdown gap, inter-group gap |
| 11 | `a403570` | feat(marketing): home iteration — drop tool logo farm, retighten hero/configurator gap, trim subhead |
| 12 | `37e241e` | feat(marketing): hero/configurator gap 80px -> 60px |
| 13 | `2e7bb64` | feat(marketing): configurator iteration — bottom CTA block, drop top-row Get started |
| 14 | `35b6e48` | feat(marketing): configurator — add 'None' option to Recommended combinations dropdown |
| 15 | `8ab3757` | feat(marketing): port dashboard's edit-message experience into configurator |
| 16 | _(this close-out)_ | docs: Session 74 close — configurator section build + D-375 (Tiptap replicate-not-extract) |

Commits 1–15 already pushed to `origin/feat/configurator-section`. The close-out commit will be pushed at the end of this session. **Branch will not be merged to main** — Joel verifies on the Vercel preview, PM approves merge.

---

## What was completed

### 1. Configurator section on `/` (15 feat commits)

Built from scratch and iterated through ~14 YOLO design rounds. Final shape:

- **Two-column section** below the hero. Left: "Categories" card with a Recommended-combinations dropdown (six packs + a "None" option) that pre-selects vertical-category combinations; below the dropdown, a Business-name input and a conditional Website input. Right: borderless "Messages" column with a global tone selector (Standard / Friendly / Brief) and a Copy-to-clipboard button.
- **Read-state message cards** render the body via `interpolateTemplate({key} → preview)` — variables show in brand purple (`text-text-brand-secondary`); business name and website are live-bound to the user's input.
- **Edit mode (the major Iteration 14 work):** opens an inline edit card mirroring the dashboard's Building-state Messages list edit card from `prototype/components/catalog/catalog-card.tsx` lines 591–884, minus the AI input. Title + info icon at top; Tiptap editor body with atomic purple variable chips; per-message tone pills (Standard / Friendly / Brief, plus a Custom pill that auto-appears when the body diverges from any canned variant); "+ Variable" popover that inserts a chip at the caret; protected-variable compliance gate ("Needs Business name" / "Needs opt-out language" right-aligned with a Fix button that restores the last canned pill's template after a 1500ms simulated delay matching prototype). Save disabled while compliance fails or Fix loading.
- **18 stub message bodies rewritten** in `{key}` syntax (matches dashboard) with Standard / Friendly / Brief variants. Standard variants always start with `{business_name}: ` (literal colon + space — colon is part of the template, not a hardcoded JSX prefix). Read-state MessageReadCard renders the body directly (no separate "Acme:" prefix prepended in JSX).
- **Per-message tone state** separate from the global tone selector: global sets the default; per-message override (set in the edit card) applies only to that message and persists across global changes. State model: `globalTone` + `perMessageTone[key]` + `editedBodies[key]`. Effective resolution: if `editedBodies[key]` set → Custom; else `perMessageTone[key] ?? globalTone`.
- **New-message prefill** = `{business_name}: [your message here] Reply STOP to opt out.` (or without STOP for Verification — would cancel OTP); the variable is a chip, the rest is plain text; new messages start compliant.
- **Hero section trimmed** in parallel: `pt-16` no `pb`, left-aligned, no tools row, no Why RelayKit. Top-nav "Get early access" CTA flipped from primary to secondary so the configurator's "Save to my workspace →" stays the page's only primary CTA. New `/signup` placeholder route added so the CTA href has a target ("We'll be ready soon.").

### 2. D-375 recorded — Tiptap editor replicate-not-extract

`marketing-site/lib/editor/` (variable-token, variable-node, variable-node-view, template-serde, message-editor) is replicated from `prototype/lib/editor/` rather than extracted into a shared workspace package both apps import. Compliance and variable-scope helpers similarly duplicated under `marketing-site/lib/configurator/`. Replicate path chosen because the two apps are independent Next packages with no workspace/yarn-workspaces setup; extraction would require introducing a workspace config (too invasive for a marketing-surface YOLO iteration). Each ported file carries a header comment naming its prototype source and the parity expectation. Future divergence between dashboard and marketing-surface edit experiences must be deliberate and documented — drift is the failure mode this decision accepts in exchange for shipping speed.

Supersedes: none — additive architectural commitment, layers on top of D-354 (Tiptap chosen) without contradicting it.

### 3. PROTOTYPE_SPEC.md updated

New top-level section `## Production Marketing Site — relaykit.ai` added after the Compliance Page section. Captures stabilized marketing-site surfaces (currently: configurator section + edit card). Documents header row, editor body, compliance/Fix row, tone-pill row + Variable popover, Save/Cancel; per-message tone override model; configurator data conventions including Standard variant colon convention, Friendly/Brief variant divergence allowance, variables/requiresStop semantics, "+ Add message" prefill template.

### 4. REPO_INDEX.md updated

Meta block bumped (Last updated, decision count D-374 → D-375, active branch flipped to `feat/configurator-section`, unpushed local commits note); `/marketing-site` subsection extended with a Session 74 additions block enumerating new files; `DECISIONS.md` and `PROTOTYPE_SPEC.md` doc-table rows refreshed to 2026-05-09; new Session 74 change-log entry appended.

---

## What's in progress

Branch is **not** merged. Joel verifies the Vercel preview; PM gives the merge call. No mid-stream code work — the configurator section is functionally complete on this branch.

---

## Quality checks passed

- `tsc --noEmit` clean (one TS2345 narrowing fix during the port: `PillId` narrowing didn't survive into a closure, fixed by extracting to `const tone: ToneId = result.pillId` before the closure).
- `eslint` clean (one `@typescript-eslint/no-dynamic-delete` fix replacing `delete next[key]` with destructuring rest pattern; one stale `react-hooks/exhaustive-deps` disable comment removed because the rule wasn't loaded in eslint config).
- `next build` green — 12 static pages on this branch, including the new `/signup` placeholder. Bundle for `/` jumped 9.83 kB → 109 kB on this branch (Tiptap weight; expected per D-375).
- Local dev boot clean, `GET / 200`. End-of-task `.next` clean + dev-server restart per standing rule.
- DECISIONS ledger pre-flight scan at session start: clean (Active count 289 latest D-374, no missing Supersedes fields, no orphan supersession references). Post-D-375-append: D-375 carries `Supersedes: none` per inline-supersession-enforcement workflow (greped DECISIONS.md + DECISIONS_ARCHIVE.md for "Tiptap", "editor port", "shared package", "workspace" — no genuine conflicts; D-354 is layered-on-top, not superseded).

---

## Pending / carry-forward

1. **Joel preview verification + PM merge approval** for `feat/configurator-section`. Branch will not be merged until both clear. If Joel finds issues on the preview, additional iteration commits land on the same branch before merge.

2. **Home page architecture follow-on session** — beyond the configurator, the home page is still hero + configurator only. Suggested next sections per Joel's earlier framing: "Build it" (the developer-facing pitch), "The work we handle" (proxy-side capabilities surfaced as concrete reassurance, not feature list), "Pricing" (one-source-pointer to `docs/PRICING_MODEL.md`'s numbers), and a closing CTA strip. Each section would land as its own iteration cycle on a new branch.

3. **Dark mode session** — surface-wide pass; not tied to any one section. Lower-leverage than the home-page architecture work but discrete-scope.

4. **Per-vertical hybrid pages** — start with Verification (Phase 6 surface). Each vertical page would carry its own configurator slice + vertical-specific copy + integration code samples. Verification first because the OTP feature is the closest to ship per `docs/VERIFICATION_SPEC.md`.

5. **Earlier carry-forward items still applicable:**
   - Stage 2 (`docs/BRAND_DIRECTION.md`) — consumes the BRAND_AUDIT.md synthesis to produce the design system with point of view. Not yet started; large-scope session.
   - MD-number capture session — strategy-shaped session that walks the BRAND_AUDIT.md synthesis and decides which findings rise to MD-number status in MARKETING_STRATEGY.md.
   - Phase 1 downstream experiments still UNBLOCKED: Experiment 2b (live sample SMS over approved campaign), Experiment 4 (STOP/START/HELP), Experiment 3c (Simplified→Full brand upgrade). Joel-driven; high-leverage on product readiness.
   - Pumping Defense Wave 2 work deferred to Phase 5/8 design activation.
   - Broader threat-modeling workstream (BACKLOG Entry G) — launch-period deliverable, promotes `SECURITY_DRAFT.md` to canonical.
   - Migration 006 manual application (carry-forward from Session 58) — SQL committed but not applied to live shared Supabase.
   - Joel-actionable marketing items: affiliate signups (ShipFast 50%, Supastarter, Saaspegasus, Makerkit) + remaining tooling confirmation.

---

## Retirement sweep findings

None — mid-phase close-out, no MASTER_PLAN phase boundary crossed (Phase 1 still active).

---

## Drift-watch findings

None — mid-phase close-out, drift-watch skipped per CLAUDE.md step 9.

---

## Gotchas for next session

1. **Two copies of the Tiptap editor + helpers now exist on disk** (`prototype/lib/editor/` + `marketing-site/lib/editor/`; `prototype/lib/variable-scope.ts` analogue split across `marketing-site/lib/configurator/example-values.ts` + `compliance.ts`). Parity is intentional per D-375; each marketing-site copy carries a header comment naming its prototype source. Future edits to either side must consciously decide whether to mirror or diverge — drift is the failure mode this decision accepts in exchange for avoiding workspace setup. If next iteration touches the dashboard edit experience, ask whether the marketing-site copy should re-sync or whether the divergence is deliberate.

2. **Bundle weight for `/` jumped 9.83 kB → 109 kB on this branch** — Tiptap is heavy. If marketing-site bundle size becomes a concern (e.g., LCP regression on the home page), the lift is to lazy-load `MessageEditor` behind the edit-card open state so Tiptap doesn't load until a user clicks Edit. Not blocking for now; flagged as a known trade-off per D-375.

3. **Per-message tone state model** is the subtle piece: `globalTone` + `perMessageTone[key]` + `editedBodies[key]` resolve via "if `editedBodies[key]` → Custom; else `perMessageTone[key] ?? globalTone`". Setting global tone does NOT clobber per-message overrides; this is intentional. Any future iteration that adds tone semantics (e.g., a fourth tone) needs to thread the same resolution rule.

4. **Standard variant colon convention** is load-bearing: every Standard tone variant starts with `{business_name}: ` (literal colon + space — colon is part of the template, not a hardcoded JSX prefix). Friendly/Brief variants are allowed to break the pattern (e.g., `"Hey! Your {business_name} code is {code} — expires in 10 minutes."`) for tone-divergence purposes. The Custom-pill detection logic (text ≠ any canned variant ⇒ Custom) depends on this divergence being meaningful.

5. **`.pm-review.md` and `api/node_modules/`** remain untracked — standing local-only artifacts, not staged this session.

---

## Files modified this session

**Branch total (16 files, 15 feat commits since `c1c4ea6`):**

New (10):
- `marketing-site/app/signup/page.tsx`
- `marketing-site/components/configurator-section.tsx` (replaced earlier section file in commit 1; rewritten in commit 15)
- `marketing-site/components/configurator/message-edit-card.tsx`
- `marketing-site/lib/editor/variable-token.ts`
- `marketing-site/lib/editor/variable-node.ts`
- `marketing-site/lib/editor/variable-node-view.tsx`
- `marketing-site/lib/editor/template-serde.ts`
- `marketing-site/lib/editor/message-editor.tsx`
- `marketing-site/lib/configurator/types.ts`
- `marketing-site/lib/configurator/session-context.tsx`
- `marketing-site/lib/configurator/example-values.ts`
- `marketing-site/lib/configurator/compliance.ts`

Touched (4):
- `marketing-site/app/page.tsx` (hero trim + section wiring)
- `marketing-site/components/top-nav.tsx` (CTA flipped to secondary)
- `marketing-site/package.json` (six `@tiptap/*` deps at `^3.0.0`)
- `marketing-site/package-lock.json` (Tiptap dep tree)

**Close-out (this commit, 4 files):**
- `DECISIONS.md` (+D-375)
- `PROTOTYPE_SPEC.md` (+ "## Production Marketing Site — relaykit.ai" section)
- `REPO_INDEX.md` (Meta + `/marketing-site` subsection + change-log entry + doc-table rows)
- `CC_HANDOFF.md` (this file — overwrite)

**Untracked-but-untouched (not staged):**
- `.pm-review.md` — local-only review artifact, not refreshed this session.
- `api/node_modules/` — standing untracked.

**Untouched this session:** `/prototype`, `/api`, `/sdk`, `/src`, `MASTER_PLAN.md`, `BACKLOG.md`, `CLAUDE.md`, `PM_PROJECT_INSTRUCTIONS.md`, all of `/docs/`, audits, experiments. (PROTOTYPE_SPEC's prototype-side sections are unchanged; only the new "Production Marketing Site" section was added.)

---

## Suggested next session

1. **Wait for Joel preview verification + PM merge call** on `feat/configurator-section`. If feedback comes back with issues, iterate on the same branch before merge. If feedback is clean, PM directs merge to main.

2. **Home page architecture follow-on** — after the configurator merges, build out "Build it / The work we handle / Pricing / CTA strip" on a new branch (`feat/home-architecture` or per-section branches). Each section is its own discrete-scope iteration cycle.

3. **Dark mode session** — surface-wide; lower-leverage but bounded scope.

4. **Per-vertical hybrid pages, starting with Verification** — `/verification` page carrying its own configurator slice + vertical-specific copy + integration code samples. Phase 6 alignment.

5. **Stage 2 (`BRAND_DIRECTION.md`)** — when Joel routes back to the brand line. Consumes BRAND_AUDIT.md synthesis to produce the design system with point of view.

6. **Phase 1 downstream experiments** — Experiments 2b / 4 / 3c remain UNBLOCKED, all procedures drafted. Joel-driven; high-leverage on product-readiness side.

---

Configurator section build + dashboard edit-mode port wrapped on `feat/configurator-section`. Branch is pushed and ready for Joel preview verification at https://relaykit-marketing-site-bijt8jc9h-joelnatkins-projects.vercel.app. **Do not merge until PM directs.**
