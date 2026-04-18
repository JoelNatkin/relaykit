# Message Editor — Tiptap Variable Tokens (Design Doc)

**Date:** 2026-04-17
**Status:** Pending PM review
**Implements:** D-350 (atomic variable tokens), D-353 (per-method variable insertion affordance)
**Depends on:** D-349 (unrelated but adjacent), D-351 (custom messages), D-354 (library choice — to be recorded on approval)

---

## 1. Context — what exists today

The brief described replacing "a textarea" with a contentEditable editor. Ground truth after reading the prototype:

- **The canonical edit mode is `prototype/components/catalog/catalog-card.tsx:656–663`** — a plain `<textarea>` that holds *already-interpolated plain text* (variables resolved to demo values before edit). Used by the workspace messages page (`/apps/[appId]/page.tsx`) and the marketing messages page (`/sms/[category]/messages/page.tsx`).
- **A second, legacy custom contentEditable implementation lives in `prototype/components/plan-builder/message-card.tsx`** (via `message-tier.tsx`). JSX search finds **no usage** of `<MessageTier>` — this is dead code. It is *not* the editor users interact with today.
- **Preview (read-only) rendering** is `catalog-card.renderPreview()` (line 538–551). It calls `interpolateTemplate()` from `lib/catalog-helpers.ts` and renders variable segments with `VAR_CLASSES = "text-text-brand-secondary"`.

**Current variable-styling inconsistency across the codebase (three different treatments):**

| File | Class | Notes |
|---|---|---|
| `components/catalog/catalog-card.tsx:17` | `text-text-brand-secondary` | Color only — matches D-350 |
| `app/sms/[category]/messages/page.tsx:1271, 1562` | `font-normal text-text-brand-secondary` | Color + explicit weight=normal — matches D-350 |
| `app/sms/[category]/page.tsx:127` | `font-medium text-text-brand-tertiary` | Different color, different weight — inconsistent |
| `components/plan-builder/message-card.tsx:61` (legacy, unused) | `font-semibold text-[#7C3AED]` | Raw color + bold — violates D-350 + CLAUDE.md |

**The real problem D-350/D-353 are solving:** today's textarea stores resolved strings like `"GlowStudio: Your haircut appointment is confirmed for Mar 15, 2026 at 2:30 PM."` Users can silently turn "Mar 15, 2026" into literal static text that ships to every recipient. The atomic-token editor prevents that class of error.

---

## 2. Decisions this doc records

| # | Decision | Rationale |
|---|---|---|
| D-354 (proposed) | **Tiptap v3** for the editor | React 19 support, ProseMirror atom model is a first-class fit for variable tokens, strongest community examples for mention-pattern UIs. Rejected: Lexical (schema ergonomics weaker for this case), Slate (highest DIY footprint, weakest maintenance). |
| In-file | **`VariableNode`** — Tiptap inline atom | `atom: true` + `selectable: true` + `inline: true` gives: cursor-before/after, click selects whole token, backspace deletes whole, no cursor placement inside — all D-350 guarantees for free. |
| In-file | **Template format unchanged** — still `{var_key}` | Zero data migration. Parse: split on `/\{(\w+)\}/g`, emit variable nodes for known keys. Serialize: traverse ProseMirror doc, emit `{key}` for each `VariableNode`, text for text nodes. |
| In-file | **Per-message variable scope via `Message.variables: string[]`** | D-353 requires method-specific scope. Current `CATEGORY_EXAMPLE_VALUES` is category-wide. Each message declares its insertable set; preview values still live in `catalog-helpers`. Custom messages default to the intersection of all methods in the parent category (per D-351 + D-353). |
| In-file | **Shared variable styling** via new `lib/variable-token.ts` constant | Single source of truth for edit + all preview sites. Value: `text-text-brand-secondary` (color only, no weight). Matches the majority of current preview code; D-350 is explicit that edit must match preview. |
| In-file | **Insert affordance** — `+ Variable` button in the tone-pills row | Right-aligned, opens a popover listing the scoped variables with label + preview sample. Click inserts an atomic token at the cursor. Placement matches the brief. |
| In-file | **Delete `components/plan-builder/message-card.tsx`** and its tier wrapper | Unreferenced dead code, misleads future readers. Included in this PR as targeted cleanup of the code we're working in. |

---

## 3. VariableNode — Tiptap extension shape

```ts
// prototype/lib/editor/variable-node.ts
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { VariableNodeView } from "./variable-node-view";

export const VariableNode = Node.create({
  name: "variable",
  group: "inline",
  inline: true,
  atom: true,               // Single, indivisible unit
  selectable: true,         // Click selects the whole node
  draggable: false,
  addAttributes() {
    return {
      key: { default: null, parseHTML: (el) => el.getAttribute("data-variable-key") },
    };
  },
  parseHTML() {
    return [{ tag: "span[data-variable-key]" }];
  },
  renderHTML({ node, HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, { "data-variable-key": node.attrs.key }),
      0,
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(VariableNodeView);
  },
  addCommands() {
    return {
      insertVariable:
        (key: string) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { key } }),
    };
  },
});
```

**NodeView** (the in-editor React render) reads current session state:

```tsx
// prototype/lib/editor/variable-node-view.tsx
import { NodeViewWrapper } from "@tiptap/react";
import { useSession } from "@/context/session-context";
import { getExampleValues } from "@/lib/catalog-helpers";
import { VARIABLE_TOKEN_CLASSES } from "@/lib/variable-token";

export function VariableNodeView(props) {
  const { state } = useSession();
  const key = props.node.attrs.key;
  const categoryId = props.extension.options.categoryId; // passed at editor init
  const preview = getExampleValues(categoryId).get(key)?.preview(state) ?? `{${key}}`;
  return (
    <NodeViewWrapper as="span" data-variable-key={key} className={VARIABLE_TOKEN_CLASSES}>
      {preview}
    </NodeViewWrapper>
  );
}
```

Reason for NodeView (React) over pure `renderHTML`: preview text depends on live session state (`appName`, `serviceType`, `website`). Pure renderHTML would require re-materializing the editor whenever those change. NodeView reads state directly.

---

## 4. Editor instance

```tsx
// prototype/lib/editor/message-editor.tsx (thin wrapper component)
const editor = useEditor({
  extensions: [
    Document,
    Paragraph,
    Text,
    VariableNode.configure({ categoryId }),
  ],
  content: templateToContent(template, categoryId),
  editorProps: {
    attributes: {
      class: "outline-none text-sm text-text-secondary leading-relaxed",
      "aria-label": "Message text",
    },
    handleKeyDown(_view, event) {
      if (event.key === "Enter") return true;   // SMS is single-line
      return false;
    },
  },
  onUpdate: ({ editor }) => onChange(docToTemplate(editor.state.doc)),
});
```

No `StarterKit`. Minimal dep footprint: Document, Paragraph, Text, plus VariableNode. No marks (bold/italic don't exist in SMS).

**Dependency adds:** `@tiptap/core`, `@tiptap/pm`, `@tiptap/react`, `@tiptap/extension-document`, `@tiptap/extension-paragraph`, `@tiptap/extension-text`. All v3.x (React 19 compatible).

---

## 5. Template serialization helpers

```ts
// prototype/lib/editor/template-serde.ts

/** template string → ProseMirror JSON content */
export function templateToContent(template: string, categoryId: string) {
  const validKeys = new Set([...getExampleValues(categoryId).keys()]);
  const paragraph = { type: "paragraph", content: [] as Array<any> };
  for (const part of template.split(/(\{[^}]+\})/g)) {
    if (!part) continue;
    const m = part.match(/^\{(\w+)\}$/);
    if (m && validKeys.has(m[1])) {
      paragraph.content.push({ type: "variable", attrs: { key: m[1] } });
    } else {
      paragraph.content.push({ type: "text", text: part });
    }
  }
  return { type: "doc", content: [paragraph] };
}

/** ProseMirror doc → template string with `{key}` tokens */
export function docToTemplate(doc: Node): string {
  let out = "";
  doc.descendants((node) => {
    if (node.type.name === "variable") { out += `{${node.attrs.key}}`; return false; }
    if (node.isText) { out += node.text ?? ""; return false; }
    return true;
  });
  return out;
}
```

Round-trip property: `docToTemplate(templateToContent(t)) === t` for any valid template `t` (after the same STOP-suffix handling catalog-card already does).

---

## 6. Per-message variable scope (D-353)

**Data-model change** in `prototype/data/messages.ts`:

```ts
export interface Message {
  // ...existing fields...
  /** SDK method's data shape — drives the insert affordance scope. */
  variables: string[];   // keys into CATEGORY_EXAMPLE_VALUES[categoryId]
}
```

**Each existing message entry gets a `variables` list.** Example:

```ts
{
  id: "appointments_confirmation",
  // ...
  template: "{app_name}: Your {service_type} appointment is confirmed for {date} at {time}.",
  variables: ["app_name", "service_type", "date", "time", "customer_name", "website_url"],
},
{
  id: "appointments_reminder",
  // ...
  variables: ["app_name", "service_type", "date", "time"],   // narrower — no customer_name/website_url
},
```

**Custom messages (D-351, D-353):** scope defaults to the intersection of `variables` arrays across all built-in messages in the same `categoryId`. Computed via a helper:

```ts
// lib/variable-scope.ts
export function getVariableScope(message: Message | CustomMessage, categoryId: string): string[] {
  if ("variables" in message && message.variables) return message.variables;
  // Custom message — intersect across all built-in messages in this category
  const builtins = MESSAGES[categoryId] ?? [];
  if (builtins.length === 0) return [];
  return builtins.slice(1).reduce(
    (acc, m) => acc.filter((k) => m.variables.includes(k)),
    builtins[0].variables,
  );
}
```

**Forward compatibility note for the PR description:** when `SDK_BUILD_PLAN.md` method signatures are implemented, `message.variables` moves to live alongside the SDK method definitions so the data shape stays single-sourced. That's a follow-up, not in scope here.

---

## 7. Insert affordance — `+ Variable` popover

**Placement:** in the tone-pills row of `catalog-card.tsx`, right-aligned (same row as Standard / Friendly / Brief / Custom). On narrow widths, wraps to a new line — acceptable; the pills already wrap.

**Visual:** single outlined ghost button with the text `+ Variable` (no pill background, no purple — Voice principle: the control is a button, not a celebration). Semantic tokens only: `border border-border-secondary text-text-tertiary hover:text-text-secondary hover:border-border-primary`.

**Interaction:**
1. Click button → popover opens below button.
2. Popover lists variables scoped to the current message's `variables`. Each row: variable label (left, `text-text-primary`) + live preview sample (right, `text-text-brand-secondary`). Example row for `appointments_reminder`:
   - `Date` · `Mar 15, 2026`
   - `Time` · `2:30 PM`
3. Click row → `editor.commands.insertVariable(key)` → atomic token inserted at cursor; popover closes; editor regains focus.
4. Escape or outside click closes the popover.
5. Keyboard: arrow keys navigate rows, Enter selects, Tab moves focus out.

**Copy (one pass through Voice Principles v2):**
- Button label: `+ Variable`
- Popover header: none (direct list — the button context makes the purpose obvious, one-sentence rule: if it doesn't need the sentence, don't add it)
- Empty state (no variables available): `No variables for this message.` — unlikely in practice but cover the case.

---

## 8. Shared variable styling (edit + preview consolidation)

New shared constant:

```ts
// prototype/lib/variable-token.ts
export const VARIABLE_TOKEN_CLASSES = "text-text-brand-secondary";
```

**Applied everywhere a variable value is rendered:**

| File | Change |
|---|---|
| `lib/editor/variable-node-view.tsx` | Uses `VARIABLE_TOKEN_CLASSES` on NodeViewWrapper |
| `components/catalog/catalog-card.tsx:17` | Replace local `VAR_CLASSES` constant with import |
| `app/sms/[category]/messages/page.tsx:1271, 1562` | Replace inline `font-normal text-text-brand-secondary` with `VARIABLE_TOKEN_CLASSES` |
| `app/sms/[category]/page.tsx:127` | Replace inline `font-medium text-text-brand-tertiary` with `VARIABLE_TOKEN_CLASSES` |

After this change every surface that renders a variable value uses the same token, same weight (inherited from surrounding text), no `font-medium`/`font-semibold` overrides — color only, per D-350.

---

## 9. Raw-color violations fixed in this PR

Per CLAUDE.md rule and PM direction, touching `catalog-card.tsx` triggers a cleanup of any raw color in the file. Tokens verified against `docs/UNTITLED_UI_REFERENCE.md` (2026-04-18): no `utility-brand-*` scale exists in the exported token set — the reference exposes single-scale brand tokens only (`bg-brand-secondary`, `text-brand-secondary`, etc.), which in this codebase are addressed as `bg-bg-brand-secondary` / `text-text-brand-secondary` (double-prefix).

| Line | Original | Applied replacement |
|---|---|---|
| 579 | `bg-[#333333] ... text-white` (tooltip) | `bg-bg-primary-solid text-text-white` (reference: "primary-solid... useful for components such as tooltips") |
| 585 | `bg-[#F9F5FF] border-[#E9D7FE] text-[#7C3AED]` (Marketing badge) | `bg-bg-brand-secondary text-text-brand-secondary` (no border — matches the active-tone-pill pattern already used at line 704) |
| 624, 642 | Two more `bg-[#333333]` tooltips | Same as 579 |
| 670 | `text-[#F97066]` (compliance error) | `text-text-error-primary` |

`message-card.tsx` violations are removed by deleting the legacy file entirely (§2).

---

## 10. Files touched in this PR

**Added:**
- `prototype/lib/variable-token.ts` — shared color constant
- `prototype/lib/variable-scope.ts` — `getVariableScope(message, categoryId)` helper
- `prototype/lib/editor/variable-node.ts` — Tiptap extension
- `prototype/lib/editor/variable-node-view.tsx` — React NodeView
- `prototype/lib/editor/template-serde.ts` — `templateToContent` + `docToTemplate`
- `prototype/lib/editor/message-editor.tsx` — thin editor wrapper component

**Modified:**
- `prototype/components/catalog/catalog-card.tsx` — swap textarea for `<MessageEditor>`; replace textarea-specific state (`editText: string`) with template-shaped state; add `+ Variable` popover to tone-pills row; fix raw colors; import shared token class
- `prototype/data/messages.ts` — add `variables: string[]` field to each `Message`; populate per-method variable lists
- `prototype/app/sms/[category]/messages/page.tsx` — replace inline variable classes with `VARIABLE_TOKEN_CLASSES`
- `prototype/app/sms/[category]/page.tsx` — same
- `prototype/package.json` — add Tiptap v3 dependencies

**Deleted (dead code):**
- `prototype/components/plan-builder/message-card.tsx`
- `prototype/components/plan-builder/message-tier.tsx`

(Other `plan-builder/` files — `consent-preview.tsx`, `preview-as-input.tsx` — stay; they're used elsewhere. `categoryId`-keyed `CATEGORY_VARIABLES` inside the legacy file goes away with it. `catalog-helpers.ts` remains authoritative.)

---

## 11. Behavioral acceptance

1. **Atomic tokens (D-350):** cursor can be placed before/after a token; single click selects the entire token; backspace with a token selected removes it whole; no cursor can be placed inside a token; attempting to type inside a selected token replaces it with typed text (default atom behavior).
2. **Required-variable deletion:** existing compliance check in `catalog-card.tsx` (`checkCompliance` line 144) fires when `{app_name}` is missing. Delete-a-variable → `docToTemplate(doc)` no longer contains `{app_name}` → compliance check fails → red "Needs business name" shows → Save disabled. Unchanged behavior, same error copy.
3. **Variable insert (D-353):** `+ Variable` button in the tone-pills row opens a popover scoped to the current message's `variables`. Appointments `sendConfirmation` shows 6 variables; `sendReminder` shows 4. Custom messages (Appointments category) show the intersection.
4. **Preview matches edit (D-350 prose):** every variable renders with `VARIABLE_TOKEN_CLASSES` in both edit and preview — color-only, no weight override.
5. **Tone pill swap:** clicking Standard / Friendly / Brief re-seeds the editor with `templateToContent(variantTemplate, categoryId)`. Any user edit after that sets the Custom pill active (already implemented — preserved via the existing `handleTextChange` path, wired to editor `onUpdate`).
6. **Cancel/Save:** unchanged. Save writes `docToTemplate(doc)` into `savedText`.
7. **Enter key:** suppressed (single-line SMS).
8. **Paste:** plain text only; any pasted `{var}` literals do not auto-resolve into nodes (that would be magic) — they stay as text. If we want paste-converts-tokens later, add in a follow-up.
9. **TypeScript strict, ESLint clean.** No raw Tailwind colors in any file we touch. Voice v2 applied to the one new string (`+ Variable` button).

---

## 12. Risks / open questions

1. **Utility-brand color tokens (§9 line 585 fix):** if `bg-utility-brand-50` isn't in the current Untitled UI export, fall back to `bg-bg-brand-secondary`. Verify against `docs/UNTITLED_UI_REFERENCE.md` during implementation, not at design time.
2. **Test-mode keyboard interactions:** `contentEditable` + Tiptap on iOS Safari has edge-case IME quirks. Not a prototype blocker — flag during testing.
3. **Custom message variable scope** (intersection of methods) assumes each built-in `Message` has a complete `variables` list. The initial migration must hit every existing message in `data/messages.ts`. A missing list falls back to full category — acceptable temporarily, bad long-term. Fix up front.
4. **`components/plan-builder/` deletion:** verify no runtime imports outside the deleted files (`MessageCard`, `AddMessageCard`, `MessageTier`, `CATEGORY_VARIABLES`). A final grep before the delete-commit is required.

---

## 13. Out of scope (explicitly)

Per the brief:

- Custom message CRUD beyond what the current catalog-card already does (Task 2).
- Content-based marketing classification at authoring time (Task 3 / D-352).
- Any change to compliance rules beyond keeping the existing check working.
- Porting `/prototype` → `/src`.
- Paste-converts-`{var}`-to-token smart paste (future polish).

---

## 14. Execution shape

Two commits after design approval:

1. **Commit 1 — editor + data model.** Add Tiptap deps; add `lib/editor/*`; add `lib/variable-token.ts` + `lib/variable-scope.ts`; add `variables` to every `Message` in `data/messages.ts`; delete `plan-builder/message-card.tsx` + `message-tier.tsx`.
2. **Commit 2 — catalog-card integration + token consolidation.** Swap textarea for `<MessageEditor>` in `catalog-card.tsx`; add `+ Variable` popover; fix raw colors; consolidate variable classes in the two `/sms/[category]/*` pages.

PM reviews file diffs before push.

---

## 15. Gotchas — usage rules for future editor work

These are library-usage rules, not product decisions. Update this section when the editor surface grows.

### 15.1 Any Tiptap method that isn't a real doc change MUST pass `emitUpdate: false`

**The rule.** When calling a Tiptap Editor method that does not produce a user-visible content change, pass `emitUpdate: false` (or the method-specific equivalent). Real transactions — user typing, `insertVariable`, `setContent` called with the intent to replace content and re-notify — keep the default.

**The bug class.** Some Tiptap Editor methods emit the `update` event unconditionally, bypassing the normal "did the doc actually change?" gating. When they fire, `onUpdate` runs with whatever doc happens to be in the editor at that moment — which during React's commit-and-effects sequence may not match what the parent's controlled state is tracking. The parent's `onChange` listener then sees the wrong text and writes it back into React state, producing a permanent desync between what the editor renders and what the parent thinks the editor holds.

**Why the gating is asymmetric.** Tiptap's internal dispatch path at `node_modules/@tiptap/core/dist/index.js:5131` filters update emission based on three conditions — `transaction.getMeta("preventUpdate")`, `transactions.some((tr) => tr.docChanged)`, and `prevState.doc.eq(state.doc)`. Content-changing commands route through this path and get correctly filtered. But direct `this.emit("update", ...)` call sites — like `setEditable` at `dist/index.js:4839` — construct an empty transaction and fire the event directly, no gating. If those methods aren't told to skip the emit, they synthesize a "update" event with stale content and any listener that assumes `update` = doc changed will corrupt its own state.

**The symptom we hit — Session 35 error-state saga.** `message-editor.tsx` called `editor.setEditable(!disabled)` with no second argument, so `emitUpdate` defaulted to `true`.

- **Bug A (cold-open false positives).** The MessageEditor mounts when `isEditing` flips true, which happens *before* CatalogCard's `initEditSession` commits `setEditText(template)`. Tiptap's `useEditor` captures options at call time — so the first editor is constructed with `content = templateToContent("", categoryId)` = an empty paragraph. When the async editor init completes and the editor instance becomes non-null, three effects fire in this order: the template-sync effect queues a *microtask* to `setContent(realTemplate, { emitUpdate: false })`; the setEditable effect *synchronously* calls `setEditable(true)` and fires update with the empty doc; the microtask runs afterwards and loads the real template. By then `onUpdate` has already called `onChange("")` → `handleTextChange("")` → `setEditText("")`, `setActivePillId("custom")`, `runComplianceCheck("")` → "Needs opt-out language" + every required variable missing. The editor repainted correctly so the visible preview looks right; `editText` and compliance reflect the spurious empty-doc emission.
- **Bug B (Fix requires a second click).** `handleRestore` batches `setEditText(original) + setIsFixLoading(false) + clean compliance state`. `isFixLoading: false` flips `disabled` back to false, and the setEditable effect fires `setEditable(true)` → unconditional update emit — *before* the template-sync microtask has replaced the editor's doc with the restored template. So `onUpdate` fires with the user's modified doc still in place, `handleTextChange(modifiedTemplate)` clobbers the just-set clean compliance, and reports the variables the deletion removed. A second Fix click works because by then `lastEmittedRef`, the editor's doc, and `editText` are all aligned on the original template.

Commit `cf09e61` (`hasUserEdited` gate in CatalogCard) and commit `55a87e5` (explicit-call compliance refactor in CatalogCard) both treated this as a CatalogCard-side problem and both failed. The real root cause lived in MessageEditor. Commit `858866d` fixed it in one line: `editor.setEditable(!disabled, false)`. The `55a87e5` architecture is retained — explicit compliance calls are still cleaner than a reactive useEffect regardless of the Tiptap bug.

**Current call-site audit.** As of Session 35:

| Site | Call | emitUpdate handling |
|---|---|---|
| `lib/editor/message-editor.tsx:98` | `editor.commands.setContent(templateToContent(template, categoryId), { emitUpdate: false })` | Correctly suppressed — template-sync is a parent-driven replacement, not a user edit |
| `lib/editor/message-editor.tsx:104` | `editor.setEditable(!disabled, false)` | Correctly suppressed — editable toggles never represent a doc change |
| `components/catalog/catalog-card.tsx:525` | `editorRef.current?.chain().focus().insertVariable(key).run()` | Update emit kept (default) — insertVariable is a real user-initiated doc change; compliance and parent state SHOULD re-run |

**When adding a new editor command, ask:** does this call represent content the user just produced, or is it a mechanical reconfiguration? If mechanical (editable, focus, options, selection-only), suppress the update. If content (typing, insertion, replacement-with-intent-to-notify), let it fire.

**Verification path.** To check Tiptap's behavior for a new method, grep the core dist file for `emit("update"` and verify that your method routes through the transaction path (dispatch + `dispatchTransaction`) rather than a direct `this.emit("update", ...)` call. If it's direct, that method needs an `emitUpdate: false` equivalent.

---

*RelayKit LLC — design doc for D-354, implements D-350 + D-353. §15 added Session 35 close-out after resolving error-state bugs.*
