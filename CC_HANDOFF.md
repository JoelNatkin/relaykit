# CC_HANDOFF.md — Session Handoff
**Date:** 2026-04-18 (Session 35 — Tiptap editor + error-state resolution)
**Branch:** main (all session commits pushed; close-out commit with doc updates will land locally on top and is NOT pushed per PM direction)

---

## Commits This Session

All 12 pushed to `origin/main`:

```
989aac5  docs: add message editor Tiptap design doc (implements D-350/D-353)
c984b6d  feat(prototype): add Tiptap message editor scaffolding (D-350/D-353/D-354)
fdfeb58  feat(prototype): wire Tiptap editor into catalog-card; consolidate variable styling
bf19374  fix(prototype): variable token click-select, drag-disable, visible states
5e78377  fix(prototype): token states, drag kill, post-tone-swap click, row reorder, + Variable restyle
4a948bb  fix(prototype): popover sizing, flat selection band, + Variable hover, CC_HANDOFF
058a0df  fix(prototype): defer setContent to microtask to avoid flushSync warning
7c338d5  fix(prototype): token band padding, pointer cursor, label-accurate compliance errors
cf09e61  fix(prototype): band padding tightening, error gating, Fix copy
59cc72a  docs: session 35 close-out — Tiptap editor, D-354, error-state bugs unverified
55a87e5  fix(prototype): compliance check moved from reactive effect to explicit calls
858866d  fix(prototype): pass emitUpdate:false to editor.setEditable — root cause of error-state bugs
```

A final close-out commit containing this file + REPO_INDEX + PROTOTYPE_SPEC + design-doc §15 will follow and is intentionally unpushed.

---

## What Was Completed

### Tiptap editor (D-354)
Tiptap v3 wired into the workspace message editor. `prototype/lib/editor/`:
- **`variable-node.ts`** — Tiptap atom node. `inline: true, atom: true, selectable: true, draggable: false`.
- **`variable-node-view.tsx`** — React NodeView. Reads session state for live preview values. DOM-level drag suppression at three layers.
- **`template-serde.ts`** — `templateToContent` / `docToTemplate`. Round-trip stable — verified headlessly via `@tiptap/pm/model` schema parse.
- **`message-editor.tsx`** — thin Tiptap wrapper. Document + Paragraph + Text + VariableNode only (no StarterKit). Single-line (Enter suppressed). Editor-level drag kill. `setContent` deferred to `queueMicrotask` with `isDestroyed` guard to avoid `flushSync` commit-phase collision. `setEditable` called with `emitUpdate: false` (see §Gotcha below).

### Atomic variable tokens (D-350)
Variables render as indivisible atoms — cursor-before/after, click-selects-whole, backspace-deletes-whole, no cursor placement inside. Visual states:
- Rest: color only (`text-text-brand-secondary`), no background.
- Hover: flat horizontal band, `bg-bg-brand-primary`, `pt-[3px] pb-[3px] -mt-[3px] -mb-[3px]` padded footprint that preserves line height.
- Selected: same band, `bg-bg-brand-secondary`.

### `+ Variable` insert affordance (D-353)
Tertiary purple text button in the tone-pills row. Per-message scope via `Message.variables: string[]`. Custom messages use the intersection across all built-ins in the category. `prototype/lib/variable-scope.ts`.

### Token-styling consolidation
Single source `prototype/lib/variable-token.ts` (`VARIABLE_TOKEN_CLASSES`) used by the NodeView, catalog-card preview, `/sms/[category]/page.tsx`, and `/sms/[category]/messages/page.tsx`. Edit and preview now match exactly.

### Data model
`Message.variables: string[]` added to every built-in message (8 verification + 6 appointments) and the 4 inline marketing messages on `apps/[appId]/page.tsx`.

### Copy change
"Restore" button relabeled **Fix**; "Restoring…" → "Fixing…". Internal identifiers (`handleRestore`, `isFixLoading`) kept — not user-facing.

### Raw-color cleanup (in files we touched)
Three `bg-[#333333]` tooltips → `bg-bg-primary-solid text-text-white`. Marketing badge → `bg-bg-brand-secondary text-text-brand-secondary`. Compliance error `text-[#F97066]` → `text-text-error-primary`.

### Dead-code deletion
`plan-builder/message-card.tsx` and `plan-builder/message-tier.tsx` removed — pre-delete grep confirmed zero live references. The `MessageTier` *type* in `data/messages.ts` is a different entity and is kept.

### Compliance-error architecture (final form)
Compliance check is an explicit-call function `runComplianceCheck(text)` — not a reactive `useEffect`. Called from `handleTextChange`, `handleAiSubmit`, and `handlePillClick`'s Custom branch. `initEditSession`, `handleRestore`, `handleCancel`, and `handlePillClick`'s canned branch set clean state directly (no re-check). Error labels derive from the same source as the `+ Variable` dropdown (`getExampleValues().label`), so label lists and dropdown labels can never drift. 2s debounce on hint reveal; immediate hide on compliant.

### Error-state bugs — resolved (the saga)

Two PM-reported issues from mid-session:
- **Bug A.** Cold-open edit on Booking confirmation showed red "Needs opt-out language" + "Needs Business name, Service type, Date, and Time" before any user interaction.
- **Bug B.** Deleting `{app_name}` → click Fix once → "Needs Service type" persisted → second Fix click cleared it.

**Three attempts, one root cause in the last:**

1. **`cf09e61` — `hasUserEdited` gate (failed).** Added a flag that gated the reactive compliance `useEffect` on user typing. Reasoning: the effect was firing during edit-mode transitions against stale `editText`. The gate was bypassed by the very event it was meant to block — `handleTextChange` flipped the flag to true on the spurious emission, so the gate opened for exactly the wrong call.

2. **`55a87e5` — explicit-call compliance refactor (failed).** Moved compliance out of a reactive `useEffect` into explicit calls from handlers. Architecturally correct — reactive effects for correctness-critical UI state are fragile — but *orthogonal* to the real bug. `handleTextChange` remained a call site; the spurious emission still reached it with the wrong text.

3. **`858866d` — `emitUpdate: false` on `setEditable` (resolved).** Root cause: Tiptap's `Editor.setEditable(editable, emitUpdate = true)` unconditionally emits the `update` event via a direct `this.emit("update", ...)` call, bypassing the docChanged gating at `@tiptap/core dist/index.js:5131`. `message-editor.tsx` called `editor.setEditable(!disabled)` with no second argument, so every `disabled` flip synthesized an `update` event with whatever doc the editor currently held — which during React's effect sequence was stale relative to what the parent expected. Bug A: the first post-mount `setEditable(true)` fired against the empty-paragraph doc the editor was constructed with (because `editText` was still `""` when `useEditor` captured its options — `initEditSession`'s commit hadn't happened yet; the template-sync microtask ran *after* the setEditable effect). Bug B: `handleRestore`'s `isFixLoading: false` flipped `disabled` back before the template-sync microtask had replaced the modified doc with the original.

**One-line fix.** `editor.setEditable(!disabled, false)` in `message-editor.tsx:104`. Fully resolved both bugs; browser-verified by PM. `55a87e5`'s explicit-call architecture is *retained* — it's the better design regardless.

The saga is documented in the design doc at `docs/superpowers/specs/2026-04-17-message-editor-tiptap-design.md` §15 with a call-site audit and a rule for future editor commands: **any Tiptap method that isn't a real doc change must pass `emitUpdate: false` (or method-specific equivalent).**

---

## Quality Checks Passed

- `tsc --noEmit` clean on `/prototype` throughout the session and at close-out.
- Dev server restarted fresh (`rm -rf .next`) after the final fix; Ready in 2.5s; `/apps/glowstudio` HTTP 200 with no compile or runtime error markers.
- Bug A: browser-verified resolved by PM (cold-open edit → zero errors).
- Bug B: browser-verified resolved by PM (single Fix click fully clears).
- Token click-select, typing → compliance, `+ Variable` insertion, Save — all verified unregressed by PM.
- Raw-color scan clean on all files this session touched. Pre-existing raw colors remain in `/sms/[category]/messages/page.tsx` (lines 242, 379, 951) — outside this PR's scope; flagged for a future sweep.
- **ESLint — not verified.** No eslint config exists in `/prototype` or at repo root; `next lint` is deprecated and interactive. CLAUDE.md lists eslint as a gate but the tooling isn't wired. Unchanged from prior handoff.

---

## In Progress / Partially Done

Carried forward from prior sessions (unchanged this session):
- Signup backend stubbed (D-59)
- EIN verification backend stubbed (D-302/D-303)
- Phone OTP stubbed (D-46)
- Marketing messages hardcoded for Appointments only
- Ask Claude panel chat composer is a non-functional stub
- Testers invite flow stubbed
- Registered state metrics are mock data
- Marketing-only registration tracker transitions are prototype dropdowns
- Settings Notifications toggle has no backend wiring
- Cancel plan + Regenerate live key modals are close-modal no-ops
- `/account` actions all brand-link no-ops (email "Change", Stripe "Manage billing", delete account)

---

## Gotchas for Next Session

### 1. Tiptap `emitUpdate: false` rule — load-bearing
See design doc §15 for the full writeup. **Short version:** any Tiptap method that doesn't represent a real user-produced content change must pass `emitUpdate: false` (or method-specific equivalent). Currently `setContent` (line 98) and `setEditable` (line 104) in `message-editor.tsx` are correctly suppressed; `insertVariable` (catalog-card.tsx:525) is a real user transaction and correctly fires update. When adding any new editor command, audit the emit behavior before shipping.

### 2. D-355 variable grammar — must land as a decision before any related code
`state.serviceType = "Beauty & wellness appointments"` (title case, plural) reads awkwardly mid-sentence and collides with literal "appointment" in many templates. The design requires a decision on canonical-form storage vs. context-aware rendering. **Do not attempt a code fix without a recorded decision.** Candidate for the next D-number.

### 3. `onMouseDown preventDefault` on tone pills — do not remove
Every button in the tone-pills row (Standard, Friendly, Brief, Custom, `+ Variable`, popover items) uses this handler. Without it, clicking a tone pill blurs the editor and subsequent token clicks stop working (ProseMirror's click-to-select-atom requires a live editor view). The regression took a full diagnostic pass to find in `5e78377`.

### 4. `editText` holds a template, not resolved text
All compliance/rendering code that expected resolved strings was updated in Session 35. If you add a new edit-mode consumer, run `interpolateTemplate(editText, categoryId, state)` to get the resolved form.

### 5. `emitUpdate: false` + `queueMicrotask` in template-sync
`setContent` runs in a microtask to dodge React's `flushSync` inside-commit warning. Calling `setContent` synchronously inside the effect reintroduces the warning. See `058a0df`.

### 6. Compliance is explicit-call only
`runComplianceCheck(text)` runs exclusively from user-action handlers. Do not re-introduce a reactive `useEffect` that watches `editText` — the `55a87e5` commit message explains why the deterministic model is load-bearing.

### 7. Deferred delete-icon button
PM flagged during paste testing. Not in scope Session 35. Revisit after the atomic-token model has more production use.

### 8. `api/node_modules/` remains untracked
Intentionally not in `.gitignore` at the `api/` layer. Don't `git add -A` without checking — it will try to include the entire vendored tree.

### 9. Dev server
`npm run dev` in `/prototype` → port 3001. Memory rule: always `rm -rf .next` before starting.

---

## Files Modified This Session

```
DECISIONS.md                                                      # +D-354
REPO_INDEX.md                                                     # Meta + subtree index + change log; close-out bumps
PROTOTYPE_SPEC.md                                                 # Edit State section rewritten (compliance + Fix behavior)
CC_HANDOFF.md                                                     # This file (rewritten at close-out)
docs/superpowers/specs/2026-04-17-message-editor-tiptap-design.md # Design doc + §15 Gotchas added at close-out
prototype/package.json                                            # +@tiptap/{core,pm,react,extension-{document,paragraph,text}}
prototype/package-lock.json                                       # install
prototype/data/messages.ts                                        # +variables field on every Message
prototype/app/apps/[appId]/page.tsx                               # +variables on inline MARKETING_MESSAGES
prototype/app/sms/[category]/page.tsx                             # VARIABLE_TOKEN_CLASSES import
prototype/app/sms/[category]/messages/page.tsx                    # VARIABLE_TOKEN_CLASSES import
prototype/components/catalog/catalog-card.tsx                     # textarea → MessageEditor; + Variable popover; raw-color cleanup; Fix rename; compliance architecture refactor (55a87e5)
prototype/lib/variable-token.ts                                   # NEW — shared classes
prototype/lib/variable-scope.ts                                   # NEW — per-message scope (D-353)
prototype/lib/editor/message-editor.tsx                           # NEW — Tiptap wrapper (+ setEditable emitUpdate fix in 858866d)
prototype/lib/editor/variable-node.ts                             # NEW
prototype/lib/editor/variable-node-view.tsx                       # NEW
prototype/lib/editor/template-serde.ts                            # NEW
prototype/components/plan-builder/message-card.tsx                # DELETED (dead code)
prototype/components/plan-builder/message-tier.tsx                # DELETED (dead code)
```

---

## Suggested Next Tasks (priority order)

1. **D-355 — variable grammar decision.** Canonical-form storage (variables store base forms; renderer handles case + pluralization per insertion context) vs. context-aware rendering. Record as a decision *before* any code work. Blocks any polish pass on variable-heavy templates.
2. **Task 2 — Custom message CRUD** (next logical step in the D-351 custom-message model). Wire the Add message button to the session's `addCustomMessage`, make inline-editing of name + trigger persist, implement the Delete kebab. D-352 (content-based marketing classification) remains deferred — separate session.
3. **Stale pricing sweep.** $49 + $19/$29 is canonical; sweep residual `$199`/`$149` from prototype strings, PRDs, marketing copy. Not started.
4. **Extract shared `APP_NAMES` into `lib/app-names.ts`** (overdue — 4 duplicate copies).
5. **Session-aware "Back to {appName}" on `/account`.**
6. **Ask Claude panel backend** (streaming AI route).
7. **Wire signup / phone OTP / EIN verification to real backends** (D-59, D-46, D-302/D-303).
8. **Error-state design pass** across all interaction failures before copy lock. (Not just the Tiptap bug — we want a coherent design system for failure states site-wide.)
9. **Raw-color sweep** on pre-existing violations in `/sms/[category]/messages/page.tsx` (lines 242, 379, 951) and any others.
10. **Delete icon button next to `+ Variable`** — deferred polish; revisit after the atomic-token model has more production use.
