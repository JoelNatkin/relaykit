# REPO_INDEX.md

> **Purpose:** Single source of truth for repo state. PM reads this at every browser chat start to orient without guessing. CC maintains it at every close-out.

---

## Meta

- **Last updated:** 2026-04-17 (Session 33 — orchestration setup)
- **Decision count:** D-348 (next available: D-349)
- **PM instructions synced (Claude.ai UI ↔ repo):** `true`
- **Active CC session branch:** main
- **Unpushed local commits:** TBD on next update

---

## Tier classification for browser chat uploads

**Tier 1 — Claude.ai project knowledge (permanent, rare updates):**
- `docs/VOICE_AND_PRODUCT_PRINCIPLES_v2.md`
- `docs/UNTITLED_UI_REFERENCE.md`

**Tier 2 — Upload at every browser chat start:**
- `REPO_INDEX.md` (this file)
- `CC_HANDOFF.md`
- `PM_HANDOFF.md` (only if rotating chats)

**Tier 3 — Upload on demand when topic comes up:**
- Everything else below

---

## Canonical docs (repo root)

| File | Last touched | Purpose |
|------|-------------|---------|
| `REPO_INDEX.md` | 2026-04-17 | This file |
| `PM_PROJECT_INSTRUCTIONS.md` | 2026-04-17 | Canonical PM instructions (synced to Claude.ai UI) |
| `CLAUDE.md` | 2026-04-17 | CC standing instructions (pared to ~110 lines) |
| `DECISIONS.md` | 2026-04-15 | Active decisions D-84+, index of D-01–D-83 |
| `DECISIONS_ARCHIVE.md` | (stable) | Full text of D-01–D-83 |
| `PROTOTYPE_SPEC.md` | 2026-04-16 | Screen specs for `/prototype` |
| `WORKSPACE_DESIGN_SPEC.md` | 2026-03-28 | Post-signup workspace architecture |
| `MESSAGE_PIPELINE_SPEC.md` | 2026-04-17 | `/api` pipeline — Sessions A (done) / B / C |
| `SDK_BUILD_PLAN.md` | pending | `/sdk` build + README + AGENTS.md + integration prompt |
| `CC_HANDOFF.md` | 2026-04-16 | Previous CC session state |
| `BACKLOG.md` | 2026-04-10 | Parked ideas, never build without promotion |
| `README.md` | (stable) | Repo readme |

---

## Canonical docs (`/docs`)

| File | Last touched | Purpose |
|------|-------------|---------|
| `RELAYKIT_PRD_CONSOLIDATED.md` | 2026-04-15 | Product narrative, what's built, what's next |
| `PRICING_MODEL.md` | 2026-03-15 | Tier definitions, costs, pricing logic |
| `PRD_SETTINGS_v2_3.md` | 2026-04-15 | Settings page spec |
| `VOICE_AND_PRODUCT_PRINCIPLES_v2.md` | (stable) | Copy rules (Tier 1 in project knowledge) |
| `UNTITLED_UI_REFERENCE.md` | (stable) | Design system reference (Tier 1 in project knowledge) |
| `STARTER_KIT_PROGRAM.md` | 2026-03-20 | Starter kit strategy (build plan update pending) |
| `AI_INTEGRATION_RESEARCH.md` | 2026-04-15 | AGENTS.md, Resend analog, tool prompts |

---

## Subdirectories

### `/docs/archive` (superseded, not operational)

Historical PRDs, vision docs, old strategy. CC does not read these unless Joel directs to a specific one.

Notable contents: `BUILD_SPEC_VALIDATION_LOG.md` (25 experiment rounds), Twilio-era PRDs (01–09), early vision docs, superseded design references.

### `/docs/plans`

Old UX prototype plans. Currently contains `2026-03-08-ux-prototype.md`. Superseded by current prototype + PROTOTYPE_SPEC; keeping for history only.

### `/docs/superpowers`

CC's internal artifacts from the `superpowers` skill (claude-plugins-official). CC-managed. PM does not touch.

### `/prototype`

Active prototype UI (port 3001). Source of truth for UI.

### `/src`

Legacy production codebase. Do not modify without explicit direction.

### `/sdk`

RelayKit npm package. Active (SDK build plan pending).

### `/api`

Message delivery backend. Session A of pipeline built.

### `/supabase`

Migrations and config.

---

## Build spec status

| Spec | Status | Implementation |
|------|--------|----------------|
| MESSAGE_PIPELINE_SPEC Session A | COMPLETE | `/api/src/pipeline/` — normalize, interpolate, send stub, log stub |
| MESSAGE_PIPELINE_SPEC Session B | BLOCKED | Waiting on Sinch account |
| MESSAGE_PIPELINE_SPEC Session C | NOT STARTED | Buildable after Session A; needs B for end-to-end |
| SDK_BUILD_PLAN | NOT STARTED | Waiting on spec doc |
| Workspace message row evolution | IN PROGRESS | Shared grid + /account shipped Session 32–33 |

---

## Decision count verification

Verify `D-348` against DECISIONS.md at chat start. If drifted, update this file.

---

## Sync obligations

- **CC at every close-out:** bump `Last updated`, `Decision count`, add/remove files, update build spec status, verify `PM instructions synced` flag if Joel confirmed a paste.
- **PM when proposing PM instructions changes:** write to `PM_PROJECT_INSTRUCTIONS.md`, flip `PM instructions synced` to `false` in this file, tell Joel to paste into Claude.ai UI.
- **Joel when pasting updated PM instructions into Claude.ai UI:** tell CC at next close-out "PM instructions synced — flip the flag."

---

## Change log

- **2026-04-17:** Initial REPO_INDEX created. Introduces tiered file orchestration, sync tracking between repo and Claude.ai UI project instructions, canonical file listings at root and `/docs`.
