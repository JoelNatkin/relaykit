# CC_HANDOFF.md — Session Handoff
**Date:** 2026-04-18 (Session 35 — Tiptap message editor)
**Branch:** main (9 unpushed commits pre-close-out; 10 after the close-out commit this file lives in)

---

## Commits This Session

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
```

A close-out commit overwriting this file + REPO_INDEX + PROTOTYPE_SPEC will follow.

---

## What Was Completed

### D-354 recorded
Tiptap v3 chosen for the message editor per D-350's requirement to use a proper contentEditable library. Rationale: React 19 support, ProseMirror atom model fits variable tokens perfectly, best community docs and mention-pattern examples. Recorded in `DECISIONS.md`.

### Design doc
`docs/superpowers/specs/2026-04-17-message-editor-tiptap-design.md` — 362 lines covering VariableNode shape, template serde, per-message scope refactor, insert affordance UX, color-token plan, raw-color cleanup, migration, and two-commit execution shape. Approved by PM before code touched.

### Editor architecture (`prototype/lib/editor/`)
- **`variable-node.ts`** — Tiptap atom node. `inline: true, atom: true, selectable: true, draggable: false`. Attribute `key` maps to a variable-registry entry. `parseHTML` matches `span[data-variable-key]` so clipboard HTML round-trips preserve atoms.
- **`variable-node-view.tsx`** — React NodeView. Reads session state via `useSession()` so variable preview values stay live. DOM-level drag suppression (`contentEditable={false}`, `draggable={false}`, `onDragStart preventDefault`, CSS `[-webkit-user-drag:none]`). Hover/selected state styling through Tiptap's `props.selected`.
- **`template-serde.ts`** — `templateToContent(template, categoryId)` parses `{var_key}` strings into ProseMirror JSON; `docToTemplate(doc)` walks the doc and emits `{key}` tokens. Round-trip stable.
- **`message-editor.tsx`** — thin wrapper. `useEditor` with Document + Paragraph + Text + VariableNode only (no StarterKit). Single-line (Enter suppressed). Editor-level drag kill (`handleDrop: () => true`, `handleDOMEvents.dragstart` preventDefault). Template-sync effect deferred to `queueMicrotask` with `isDestroyed` guard to avoid `flushSync` inside React commit phase.

### Data model additions
- **`prototype/data/messages.ts`** — added `variables: string[]` field to the `Message` interface. Populated for all 14 built-in messages (8 verification + 6 appointments) and the 4 inline marketing messages in `apps/[appId]/page.tsx`. Variables list = union of tokens used across default + all tone variants (since tone swap shouldn't change what's insertable — the SDK method's data shape is the same across tones).
- **`prototype/lib/variable-scope.ts`** — `getVariableScope(message, categoryId)`. For built-in messages returns `message.variables`. For custom messages (D-351 manual-send) returns the intersection of variables across all built-in messages in the category, per D-353.
- **`prototype/lib/variable-token.ts`** — shared `VARIABLE_TOKEN_CLASSES = "cursor-pointer text-text-brand-secondary"`. Single source for variable styling across the editor NodeView, `catalog-card` preview, `/sms/[category]/page.tsx`, `/sms/[category]/messages/page.tsx`. Edit and preview now match per D-350.

### catalog-card integration
- Plain `<textarea>` swapped for `<MessageEditor>`. Internal state changed from resolved-string to template-string. Compliance check resolves the template before matching.
- `+ Variable` popover added to the tone-pills row — tertiary purple text button with `Plus` icon, matches Ask Claude styling. Popover scoped per-message, rows use the top-nav dropdown scale (`text-sm px-3 py-2`), width content-driven.
- Tone-pills row reordered: `Standard | Friendly | Brief | Custom | [spacer] | + Variable`. Custom is grouped with tone variants since it's a tone state.
- Every control in the tone-pills row uses `onMouseDown preventDefault` so clicks don't blur the editor — this is required for ProseMirror's click-to-select on tokens to stay live across tone swaps. **Don't remove these in future refactors without reading the gotcha below.**
- Raw-color violations cleaned up: three `bg-[#333333]` tooltips → `bg-bg-primary-solid text-text-white`; Marketing badge → `bg-bg-brand-secondary text-text-brand-secondary`; compliance error `text-[#F97066]` → `text-text-error-primary`.
- Compliance error labels derive from the same source as the `+ Variable` dropdown (`getExampleValues().label`). Format: `Needs X` / `Needs X and Y` / `Needs X, Y, and Z`. Removed the hardcoded `VARIABLE_LABELS` map that collapsed `date`/`time`/`service_type` to vague "appointment details".
- Button copy: Restore → **Fix**, Restoring… → Fixing….
- Side effect: saved edits now preserve variable highlighting in preview (prior behavior saved resolved strings so `interpolateTemplate` couldn't round-trip them).

### Dead-code deletion
Pre-delete grep confirmed zero live references. Removed:
- `prototype/components/plan-builder/message-card.tsx`
- `prototype/components/plan-builder/message-tier.tsx`

`MessageTier` the **type** (in `data/messages.ts`) is a different entity, used by `Message.tier` in 6+ files — kept intact.

### Token visual states
- At rest: color only (`text-text-brand-secondary`), no background, no radius, no weight. Prose reads cleanly.
- Hover: flat horizontal band, `bg-bg-brand-primary` (lighter in this theme per browser testing), `pt-[3px] pb-[3px] -mt-[3px] -mb-[3px]` for a padded footprint that doesn't shift line height.
- Selected: same flat band, `bg-bg-brand-secondary` (darker shade). No ring.
- Cursor pointer on all variable renders (edit + preview).

---

## Quality Checks Passed

- `tsc --noEmit` clean on `/prototype` throughout the session and at close-out.
- `next build` passed cleanly once at mid-session; routes compile, SSR-safe (`immediatelyRender: false` on Tiptap).
- Dev server running at `http://localhost:3001`, HMR stable across all 9 code commits.
- Raw-color scan clean on all files this session touched. Pre-existing raw colors remain in `/sms/[category]/messages/page.tsx` (lines 242, 379, 951) — outside this PR's scope; flagged for a future sweep.
- **ESLint — not verified.** No eslint config exists in `/prototype` or at repo root; `next lint` is deprecated and interactive. CLAUDE.md lists eslint as a gate but the tooling isn't wired. Flag if PM wants this enforced going forward.

---

## In Progress / Partially Done

**Two error-state issues are unverified at close-out.** They may already be fixed by `cf09e61`, but I could not re-test in the browser end-to-end before handoff. Treat both as open until confirmed by PM testing.

Carried forward from prior sessions (unchanged):
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

### Two open error-state bugs — unverified fix attempt in `cf09e61`

**Bug A — false-positive compliance errors on first open.**
Reported by PM mid-session: opening edit mode on an untouched message immediately shows red "Needs Business name, Service type, Time, and Website" before any user interaction.

- **Suspected cause I diagnosed:** the compliance `useEffect` in `catalog-card.tsx` depends on `[editText, isEditing, message, categoryId, state]`. When `isEditing` flips true, the effect fires BEFORE `initEditSession`'s `setEditText(template)` has committed — it runs against stale or empty `editText`, finds no variable preview values in the empty string, and marks every required variable as missing. Secondary leak: `showComplianceHint` state from a prior edit session (in controlled mode, where the parent manages `isEditing` and `exitEdit` doesn't reset hint state) could be stuck true.
- **Fix attempted:** added a `hasUserEdited` flag. Compliance effect short-circuits to `{ isCompliant: true, issues: [] }` unless the flag is true. Flag resets in `initEditSession` + `handleRestore` (Fix); flips true in `handleTextChange` + `handleAiSubmit`.
- **Why it might still fail:** the gate is right in principle, but if there's a different code path that flips `hasUserEdited=true` unintentionally (e.g., an early `onUpdate` from Tiptap's editor fires handleTextChange during mount), the false positive would still surface. Fresh-eye re-test: open several messages cold, inspect React DevTools for `hasUserEdited` state on first render.

**Bug B — Fix (Restore) requires a second click to clear errors.**
Reported by PM: delete required variables → see errors → click Fix once → errors persist → click Fix again → errors clear.

- **Suspected cause I diagnosed:** after the 1.5s "Fixing…" timeout, `handleRestore` batches `setEditText(template) + setCompliance(clean) + setShowComplianceHint(false)`. React commits. The compliance useEffect then fires (because `editText` changed), re-runs the check against the restored template, and *should* keep compliance clean. But if something in the resolved-text match is flaky — preview value collision with a static word, empty session field — the check could flip compliance back to non-compliant, re-showing the error.
- **Fix attempted:** `handleRestore` also sets `hasUserEdited=false`. Combined with the compliance-effect gate, the post-Fix re-check is short-circuited. By UX contract, post-Fix state is clean.
- **Why it might still fail:** same surface as Bug A — if `hasUserEdited` gets flipped back to true by a code path I missed, the re-check runs and the bug reappears. Also worth checking whether the editor's template-sync effect triggers `onUpdate` (it shouldn't — we pass `emitUpdate: false` to setContent — but Tiptap has edge cases).

**Recommended next-session approach:**
1. Open `/apps/glowstudio` in browser. DevTools console open.
2. Click edit pencil on Booking confirmation. Observe: any errors? Any console warnings?
3. If errors appear, add `console.log` around the compliance effect to trace: what is `editText`, `hasUserEdited`, `resolved` at each fire?
4. Delete `{app_name}`. Wait for error. Click Fix once. Check state values as before.
5. If either bug reproduces, the gate I added isn't sufficient — the real fix may require moving compliance check out of `useEffect` (which can re-fire unexpectedly) into an explicit call in `handleTextChange` only. That would be a bigger refactor but makes the compliance trigger deterministic.

### Other gotchas (structural)

1. **Tiptap focus retention — do NOT remove `onMouseDown preventDefault` on tone pills.** Every button in the tone-pills row (Standard, Friendly, Brief, Custom, `+ Variable`, popover items) has this handler. Without it, clicking a tone pill blurs the editor, and subsequent token clicks stop working (ProseMirror's click-to-select-atom requires a live editor view). The regression took a full diagnostic pass to find in `5e78377`.
2. **`editText` holds a template, not resolved text.** All compliance/rendering code that expected resolved strings was updated. If you add a new edit-mode consumer, run `interpolateTemplate(editText, categoryId, state)` to get the resolved form.
3. **`emitUpdate: false` + `queueMicrotask` in template-sync.** The setContent call lives inside a microtask to dodge the `flushSync` warning from React. If you call setContent synchronously in an effect, the warning comes back. See `058a0df` for context.
4. **Variable grammar issue (deferred per D-352 candidate).** `state.serviceType` = "Beauty & wellness appointments" (title case, plural). Inserting mid-sentence reads as "…your Beauty & wellness appointments booking…" — wrong. Also collides with the literal word "appointment" in many templates ("{service_type} appointment is confirmed" → doubled noun). This is a template-authoring / variable-semantics problem. Proposed approach for a future session: variables store a canonical base form + the renderer (or authoring tool) handles case + pluralization per insertion context. Candidate for a new D-number — **do not attempt a fix without a decision**.
5. **Deferred delete-icon button.** PM flagged during paste testing. Not in scope this session. Revisit after the atomic-token model stabilizes.
6. **`api/node_modules/` remains untracked** and intentionally not in `.gitignore` at the `api/` layer. Don't `git add -A` without checking.
7. **Dev server:** `npm run dev` in `/prototype` → port 3001. Memory rule: always `rm -rf .next` before starting.

---

## Files Modified This Session

```
DECISIONS.md                                                     # +D-354
REPO_INDEX.md                                                    # meta + subtree index + change log
PROTOTYPE_SPEC.md                                                # Edit State section rewritten (line ~413)
CC_HANDOFF.md                                                    # this file (overwritten)
docs/superpowers/specs/2026-04-17-message-editor-tiptap-design.md # NEW
prototype/package.json                                           # +@tiptap/{core,pm,react,extension-{document,paragraph,text}}
prototype/package-lock.json                                      # install
prototype/data/messages.ts                                       # +variables field on every Message
prototype/app/apps/[appId]/page.tsx                              # +variables on inline MARKETING_MESSAGES
prototype/app/sms/[category]/page.tsx                            # VARIABLE_TOKEN_CLASSES import
prototype/app/sms/[category]/messages/page.tsx                   # VARIABLE_TOKEN_CLASSES import
prototype/components/catalog/catalog-card.tsx                    # textarea → MessageEditor; + Variable popover; raw-color cleanup; Fix button; compliance labels; hasUserEdited gate
prototype/lib/variable-token.ts                                  # NEW
prototype/lib/variable-scope.ts                                  # NEW
prototype/lib/editor/message-editor.tsx                          # NEW
prototype/lib/editor/variable-node.ts                            # NEW
prototype/lib/editor/variable-node-view.tsx                      # NEW
prototype/lib/editor/template-serde.ts                           # NEW
prototype/components/plan-builder/message-card.tsx               # DELETED (dead code)
prototype/components/plan-builder/message-tier.tsx               # DELETED (dead code)
```

---

## What's Next (suggested order)

1. **Priority 1 — Fresh-eye re-diagnosis of the two error-state bugs.** Bug A (false positives on first open) and Bug B (Fix requires second click). The `hasUserEdited` gate in `cf09e61` should address both in principle, but neither has been verified end-to-end. Re-test in browser with DevTools, confirm or reopen. If reopened, consider moving compliance invocation out of a React effect entirely and into an explicit call from `handleTextChange` + post-Fix — makes the trigger deterministic and eliminates the effect's dependency-array ambiguity. **This must land before Task 2.**
2. **Task 2 — Custom message CRUD** (next logical step in the D-351 custom message model). Wire the Add message button to the session's `addCustomMessage`, make inline-editing of name + trigger persist, implement the Delete kebab. Keep D-352 deferred (content-based marketing classification) — separate session.
3. **Variable grammar / D-352 candidate.** Design pass on canonical-form storage vs. context-aware rendering. Record as a decision before coding. Flagged in CC_HANDOFF #4 above.
4. **Stale pricing sweep.** $49 + $19/$29 is canonical; sweep residual `$199`/`$149` from prototype strings, PRDs, marketing copy. Not started.
5. Extract shared `APP_NAMES` into `lib/app-names.ts` (overdue — 4 duplicate copies).
6. Session-aware "Back to {appName}" on `/account`.
7. Ask Claude panel backend (streaming AI route).
8. Wire signup / phone OTP / EIN verification to real backends (D-59, D-46, D-302/D-303).
9. Error-state design pass across all interaction failures before copy lock.
10. Delete icon button next to `+ Variable` (deferred polish — revisit after the atomic-token model settles).
