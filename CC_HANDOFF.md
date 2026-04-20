# CC_HANDOFF.md — Session Handoff
**Date:** 2026-04-20 (Session 37 — audit session, no build work)
**Branch:** main (all commits local, **NOT** pushed — PM review happens first)

---

## Session 37 Summary — Current-state audit

One commit added on top of Session 36's `192cda4`:

```
[pending]  docs(audit): session 37 — CURRENT_STATE_AUDIT.md repo inventory
```

**Deliverable:** `CURRENT_STATE_AUDIT.md` at repo root — ~480 lines covering every directory, spec drift, weirdness log, Sinch readiness, and recommendations. Read this first before next build session; it is the current picture of the repo.

**Five parallel investigation agents ran; main doc synthesizes their output.** `tsc --noEmit` passed clean on `/api`, `/sdk`, `/prototype`. No code modified. No decisions recorded — items are flagged for Joel + PM to decide, not for CC to resolve.

**Top 5 findings:**
1. Verification-vertical wizard→workspace handoff is broken — `state.selectedCategory` never reads `relaykit_wizard.vertical`. Every non-Appointments vertical is unreachable via the wizard flow. Data is fully populated in `data/messages.ts` and `catalog-helpers.ts`; the landing pages are placeholders.
2. Inbound-message handling is a split-brain story: `/src` has Twilio webhook receiver + STOP processing + `messages.direction='inbound'` column; `/api`, `/sdk`, `/prototype` have zero inbound surface; `MESSAGE_PIPELINE_SPEC` A/B/C never scope it; `PRICING_MODEL` advertises it as a sandbox feature.
3. Two parallel backends exist: `/src` (Next.js + Twilio, deployed, 319 files) and `/api` (Hono + Sinch-shaped, not deployed, ~1.5K LOC). Each has its own `supabase/migrations/` directory with a differently-shaped `messages` table. No migration plan documented.
4. D-349 (`rk_sandbox_` → `rk_test_`) is recorded but not swept. The old prefix appears in 40+ files: PRICING_MODEL, PROTOTYPE_SPEC, WORKSPACE_DESIGN_SPEC, SDK_BUILD_PLAN itself, prototype code, `/src` code, and `/api/v1/signup/sandbox`.
5. `SDK_BUILD_PLAN.md` is entirely stale — it describes a JavaScript mock needing TypeScript conversion, but `/sdk` is already a complete TypeScript-strict dual-published package at v0.1.0 (tgz pre-packed). SDK's `SendResult` shape diverges from what the plan documents; README.md still missing.

**Other spec drift found:**
- `CLAUDE.md` says wizard uses `relaykit_intake`; actual key is `relaykit_wizard`.
- `REPO_INDEX.md` says 28 unpushed commits; `CC_HANDOFF` (Session 36) said 31.
- `REPO_INDEX.md` PRICING_MODEL date shows 2026-03-15; actual file is v6.0 dated 2026-04-08.
- `RELAYKIT_PRD_CONSOLIDATED.md` says "329+ decisions"; actual is D-357.
- `MESSAGE_PIPELINE_SPEC.md` calls the consent API "Future"; `/api` shipped it with tests weeks ago.
- `MESSAGE_PIPELINE_SPEC.md` doesn't mention `POST /v1/messages/preview`; `/api` implements it.
- `RELAYKIT_PRD_CONSOLIDATED.md` lists `GET /v1/messages/:id`; `/api` doesn't implement it.
- `createApp()` in `/api` has no `carrierSender` parameter; Session B spec assumes it.
- `MessageContext.queuedUntil` missing from `/api/src/pipeline/types.ts`.
- `/src/components/auth/magic-link-form.tsx` implements OTP, not magic link (filename unchanged since refactor).
- Raw-color violations exist in `/prototype/components/top-nav.tsx` (247, 249) and `/prototype/app/apps/[appId]/page.tsx` (737, 914) — beyond the 3 lines flagged in Session 36 handoff.
- `WORKSPACE_DESIGN_SPEC.md` get-started step still shows `rk_sandbox_*` API key example.

**Build-health baseline at audit time:** `tsc --noEmit` passes on `/api`, `/sdk`, `/prototype`. `/api` tests 98/98 green. `/src` not re-validated in this audit.

**Top recommendations (decisions needed, not actions):**
- Reconcile `rk_sandbox_` → `rk_test_` across code + docs in one sweep.
- Decide where inbound handling lives in `/api` (Session D? extension to B? deferred?).
- Document the `/src` ↔ `/api` co-existence plan — parallel deploys, feature freeze on `/src`, or sunset date.
- Either wire up workspace category hydration from wizard storage, or ship non-Appointments vertical content, or block those cards with a "coming soon" state.
- Decide whether `SDK_BUILD_PLAN.md` gets rewritten as a post-ship doc (README + AGENTS.md + publish gates) or marked superseded.
- Review `/supabase/migrations/20260307200000_audit_fixes.sql` — its `DELETE FROM customers WHERE TRUE;` content is version-controlled and destructive.

See `CURRENT_STATE_AUDIT.md` §5 for the complete weirdness log (26 items) and §7 for the full recommendations list.

---

## Previous session (Session 36, 2026-04-19) — custom message CRUD + authoring lock

31 commits on top of Session 35's `5b0ced3`. Three broad phases:

### Phase 1 — Session 36 doc updates (from start, 2026-04-18)
```
cc0b319  docs: record D-355 — variable grammar (canonical base form + context-aware rendering)
9e7b35e  docs: revise D-351 to generic SDK method with slug; D-353 stale-reference cleanup
52a6caa  docs: update REPO_INDEX meta for D-355 + unpushed commits tracking
```

### Phase 2 — Custom message CRUD (D-351 revised) — Task 2
```
35f532b  feat(prototype): custom message CRUD scaffolding — + Add, editable name, slug-on-save, + Variable
2911d07  feat(prototype): custom message kebab + Archive modal
e06e258  feat(prototype): archived customs disclosure, Restore + Delete permanently
```

### Phase 3 — PM review rounds (polish + bug fixes + two new decisions)
```
ee66499  fix(prototype): set min-height on CustomMessageCard editor (PM bug 1)
203a97b  fix(prototype): Cancel on never-saved custom row discards it (PM bug 2)
693de78  fix(prototype): surface Save-disabled reason on CustomMessageCard (PM bug 3) ← later removed
cda880e  fix(prototype): add Fix button for opt-out compliance on customs (PM bug 4)
4a3d4d5  fix(prototype): explicit Name form field on custom rows (PM bug 1 + 6)
9f8682c  fix(prototype): purge empty-custom zombies on hydration (PM bug 2)
71575d4  fix(prototype): 540px max-width on custom surfaces (PM bug 3)
e09faf0  fix(prototype): activity icon + monitor state on saved customs, kebab leftmost (PM bug 4 + kebab reorder)
6392aeb  fix(prototype): keep Archive/Delete modal code block on one line (PM bug 5)
3fad604  fix(prototype): remove disableReason footer hint on CustomMessageCard (PM bugs 1 + 3)
66d86a0  fix(prototype): Save gates on non-empty body on customs (PM bug 2)
b6bd107  fix(prototype): drop muted styling on archived customs, rename muted to readOnly (PM bug 4)
33c015b  fix(prototype): auto-discard unsaved custom on navigation away (PM bug 5) ← later superseded
9767d11  fix(prototype): tighten + Variable row to editor, top-align in both cards (PM layout fix)
1b325ba  feat(prototype): pre-populate new custom body with opt-out phrase
a413cd7  feat(prototype): business-name variable in custom pre-pop + compliance check
b5ad6cd  feat(prototype): lock edit/monitor/+Add/AskClaude while an unsaved custom is open
ab7943a  fix(prototype): define bg-primary-solid + bg-secondary-solid tokens — Session 35 regression
bf72f19  feat(prototype): Reset action in onboarding step dropdown
eafbb19  feat(prototype): Edit business details dev modal from state dropdown
a79e3cc  fix(prototype): rename Quick send → Test send with clarifying hover tooltip
7a5de22  fix(prototype): user-facing Testers → Preview list rename (copy only)
95cbb0e  fix(prototype): revise Preview list panel subtext
a11f8f8  fix(prototype): status indicator yellow-state label → Test messages only
e1ee549  docs(pm): add response-brevity + step-by-step instruction guidelines
```

---

## What Was Completed

### Custom message CRUD (D-351 revised)
The `+ Add message` → edit → save → archive → delete flow is end-to-end. Not a separate UI — the row IS the authoring surface.

- **Data layer** — `CustomMessage` gains `slug: string` (empty until first save) and `archived: boolean`. `saveCustomMessage` generates an immutable kebab-case slug via `generateSlug(name, existingSlugsExcludingSelf)` from `prototype/lib/slug.ts`. Collision set includes archived slugs; deleted slugs are freed. Session-storage hydration drops empty-slug rows (one-time zombie cleanup + covers any future mid-edit reload).
- **`CustomMessageCard`** — sibling of `CatalogCard`, not a prop variant. Reuses `MessageEditor`, `getVariableScope`, `VARIABLE_TOKEN_CLASSES`, `interpolateTemplate`. Zero edits to `CatalogCard` core or Tiptap internals beyond the `locked` prop addition.
- **`MessageActionModal`** — shared shell for Archive + Delete permanently. Parameterized title/body/code-block/confirmLabel/tone. Code block uses `whitespace-nowrap overflow-x-auto` so quoted slugs stay on one line.
- **Page integration** (`/apps/[appId]/page.tsx`) — `+ Add` button (dashed-border, 540px max on ≥860px), active customs at top of stack, marketing + built-ins below, archived disclosure at bottom (`Archived (N)` collapsed-by-default).
- **Monitor mode on saved customs** — mirrors the built-in expansion: empty activity list + Test send + Preview list dropdown + Ask Claude + Close. Gated to saved non-archived rows.
- **Archived rows are read-only, not muted** — same colors/contrast as active rows. The disclosure is the only indicator.

### Authoring-time compliance gains a second rule (D-356)
Custom messages must contain the category's business-name variable token. Two rules now surface beneath the editor — each with its own Fix button. Save stays disabled until both pass.

- `getPrimaryBusinessVariable(categoryId)` in `catalog-helpers.ts` picks the right key per vertical: `app_name` for appointments/verification, `business_name` for orders/support/marketing/internal/waitlist/exploring, `community_name` for community.
- Fresh rows pre-populate with `{businessKey}: [your message here] Reply STOP to opt out.` → compliant from the start.
- Deleting the chip → Needs business name error → Fix prepends `{businessKey}: ` to the trimmed-start template.

### Lock-while-authoring (D-357) — supersedes auto-discard
While a never-saved custom (empty slug) is open, every other edit/monitor trigger on the page is disabled with tooltip `Save or cancel the current message first.`: `+ Add`, Ask Claude, every row's pencil + preview + activity icon. Authoring row itself stays fully interactive.

- First attempt was auto-discard (commit `33c015b`). PM review flagged silent-loss-of-work. Reversed via `b5ad6cd` — `discardUnsavedCustomIfNeeded` helper deleted outright; defensive guards in `requestEdit` / `requestMonitor` / `openAskClaude` / `handleAddCustom` reject transitions while locked.

### Session 35 regression fix — tooltip tokens
`--color-bg-primary-solid` was never defined in `globals.css` — Session 35's semantic-token migration (`fdfeb58`) referenced the utility class without adding the variable. Tooltips rendered empty/transparent (shadow-only). Fixed in `ab7943a` by adding both `bg-primary-solid` and `bg-secondary-solid` to `@theme`. Five card-level tooltips + two lock-overlay tooltips + Test send tooltip all resolve to near-black background + white text now.

### User-facing rename: Testers → Preview list
Panel title + subtext + cap tooltip updated. Code identifiers (`TestPhone`, `MAX_TEST_PHONES`, `testRecipients`, `test-phones-card.tsx`, `handleInviteTestPhone`, etc.) intentionally unchanged per the user-facing-vs-internal split in PM_PROJECT_INSTRUCTIONS. Test send tooltip also updated to drop "tester".

### User-facing rename: Quick send → Test send
Both monitor panels. New hover tooltip: `Sends from RelayKit to someone on your preview list. Not from your app.` clarifies the message source.

### Dev affordances on the state dropdowns
- **Onboarding dropdown:** appended `Reset` — hard reload into `/start` after `sessionStorage.clear() + localStorage.clear()`.
- **Workspace state dropdown:** appended `Edit business details` — opens a prototype-only modal for inline `appName` / `serviceType` edits. Service type is a per-vertical select (12 options for appointments) with text-input fallback. Hidden in Onboarding.

### Status indicator label
Yellow-state `Test mode` → `Test messages only`. Green-state `Live` unchanged. Applies to Building / Pending / Extended Review / Rejected via single string change in `StatusIndicator`.

### Decisions recorded
- **D-355** — Variable grammar: canonical base form + context-aware rendering. (Recorded at session start from a PM+Joel-aligned draft.)
- **D-351 revised** — Custom message delivery: generic SDK method with slug, plus manual Test send. (Revised at session start.)
- **D-356** — Custom messages require a business-name variable (compliance).
- **D-357** — Lock-while-authoring on never-saved custom rows.

### PM instructions sync
`PM_PROJECT_INSTRUCTIONS.md` gained response-brevity + step-by-step instruction guidelines. Joel confirmed paste into Claude.ai UI — `pm_instructions_synced` stays `true`.

---

## Quality Checks Passed

- **`tsc --noEmit` clean** on `/prototype` after every commit in the session.
- Dev server recompiles cleanly (`Ready in ~2s` each restart; `/apps/glowstudio` HTTP 200 no runtime errors).
- **ESLint:** not run — no eslint config exists in `/prototype` (eslint configs are under `/sdk` and `/api`, neither touched this session). Unchanged from prior handoff.

---

## In Progress / Partially Done

Carried forward (unchanged this session):
- Signup backend stubbed (D-59)
- EIN verification backend stubbed (D-302/D-303)
- Phone OTP stubbed (D-46)
- Marketing messages hardcoded for Appointments only
- Ask Claude panel chat composer is a non-functional stub
- Preview list invite flow is a 1.5s `setTimeout` — no real SMS yet
- Registered state metrics are mock data
- Marketing-only registration tracker transitions are prototype dropdowns
- Settings Notifications toggle has no backend wiring
- Cancel plan + Regenerate live key modals are close-modal no-ops
- `/account` actions all brand-link no-ops

**Deferred this session:**
- **Archive modal redesign (original PM bug 6 from round 2 of PM review)** — user confirmed the proposed body copy but we ran out of session before the redesign itself (larger modal, drop monospace, Copy affordance, expanded body). Proposed copy for when we pick it up: `"This message keeps sending from your app until you remove the line below. Your developer or AI coding tool can help."`

---

## Gotchas for Next Session

### 1. User-facing vs. internal naming split is now load-bearing
The "Preview list" rename is copy-only; `TestPhone`, `testerId`, `test-phones-card.tsx`, `INITIAL_TEST_PHONES`, `MAX_TEST_PHONES`, and all related code identifiers stay as `tester` / `test`. Same applies to `muted` → `readOnly` (behavior prop, not a visual prop anymore). When adding new code near these surfaces, don't panic-rename to match the copy — PM_PROJECT_INSTRUCTIONS defines this boundary.

### 2. `addCustomMessage` pre-populates the template
New custom rows mount with `{businessKey}: [your message here] Reply STOP to opt out.` — compliant from the start. Don't assume `message.template === ""` means unsaved; use `message.slug === ""` to test "never saved".

### 3. Hydration filter drops empty-slug rows
`session-context.tsx`'s sessionStorage-read effect drops any `customMessages` entry where `slug === ""`. Unsaved work does not survive reload — matches built-in behavior where `messageEdits` only stores persisted changes. If you add a flow that writes to `customMessages` before Save, expect it to vanish on reload.

### 4. Lock-while-authoring supersedes auto-discard
Don't re-introduce a discard helper on navigation. The `locked` prop + parent guards in `requestEdit` / `requestMonitor` / `openAskClaude` / `handleAddCustom` are the current protection. The relevant page-level derivation is `hasUnsavedCustomOpen` / `unsavedCustomId`.

### 5. `bg-bg-primary-solid` token is now defined
Fine to use across tooltips / dark pills. `--color-bg-secondary-solid` also defined (not yet consumed — Tailwind v4 only emits used tokens, so the compiled CSS won't carry `bg-bg-secondary-solid` until a class uses it, but the variable is there the moment it's needed).

### 6. `CustomMessageCard`'s tooltip infra mirrors CatalogCard's
Same `showEditTooltip` / `showMonitorTooltip` state + 300ms schedule/clear ref pattern. Don't add a third pattern — reuse.

### 7. Compliance is still explicit-call only
Post-Fix re-checks now bypass the 2s debounce via `revealImmediately` flag on `runComplianceCheck`. Don't re-introduce a reactive `useEffect` that watches `editText` / `editTemplate` — the determinism of explicit-call-only is what made the Session 35 error-state bugs go away, and D-357's lock logic depends on it.

### 8. `MAX_TEST_PHONES` cap is now visible, not silent
Previously the `+ Invite someone` button was hidden at 5/5. Now it renders disabled with a tooltip. If you need to change the cap, `MAX_TEST_PHONES` in `test-phones-card.tsx` is the single source.

### 9. Dev affordances live on the dropdowns
Reset + Edit business details are sentinel options on `<select>` elements in top-nav + dashboard-layout. When adding more state switchers, follow the same sentinel pattern (disabled em-dash row + `__sentinel_key__` value + `onChange` interception).

### 10. `api/node_modules/` remains untracked
Intentionally not in `.gitignore` at the `api/` layer. Don't `git add -A`.

### 11. Dev server
`npm run dev` in `/prototype` → port 3001. Memory rule: always `rm -rf .next` before starting.

---

## Files Modified This Session

### Added
```
prototype/lib/slug.ts
prototype/components/catalog/custom-message-card.tsx
prototype/components/catalog/message-action-modal.tsx
prototype/components/edit-business-details-modal.tsx
```

### Modified
```
DECISIONS.md                                       # +D-355, D-351 revised, +D-356, +D-357
PROTOTYPE_SPEC.md                                  # Custom messages section + Preview list + lock pattern + dev dropdown affordances
REPO_INDEX.md                                      # Meta + subtree index + change log
PM_PROJECT_INSTRUCTIONS.md                         # Response brevity + step-by-step instructions
CC_HANDOFF.md                                      # This file
prototype/app/globals.css                          # +--color-bg-{primary,secondary}-solid tokens
prototype/app/apps/[appId]/page.tsx                # + Add, archived disclosure, modals, lock state, Edit business modal mount
prototype/components/catalog/catalog-card.tsx      # locked prop + tooltip swap + layout tweak (min-h, items-start)
prototype/components/dashboard-layout.tsx          # Edit business details sentinel + status label
prototype/components/top-nav.tsx                   # Reset sentinel
prototype/components/test-phones-card.tsx          # Preview list title + subtext + cap tooltip
prototype/context/session-context.tsx              # CustomMessage shape + saveCustomMessage + archive/restore + hydrate filter
prototype/lib/catalog-helpers.ts                   # +getPrimaryBusinessVariable
```

### Deleted
None.

---

## Suggested Next Tasks (priority order)

1. **Archive modal redesign** (PM bug 6 deferred). Proposed body copy approved; ship the visual redesign (larger modal, non-monospace, Copy affordance on the code block, breathing room).
2. **D-352 — content-based marketing classification.** When a user creates/edits a custom message, detect marketing-class content at authoring time. If detected without marketing enabled, block Save with explanation + path to add marketing.
3. **D-355 — variable grammar rendering.** Canonical base form for common nouns + context-aware rendering (`{variable}` auto-capitalized at sentence start, `{variable:plural}` for common nouns only). Migrate existing state.serviceType values.
4. **Preview list invite flow backend wiring.** Currently a stubbed `setTimeout`. Spec the invite SMS copy + the accept flow (outside scope of this session).
5. **Stale-pricing sweep.** Residual `$199`/`$149` across prototype strings, PRDs, marketing copy. Canonical: $49 + $19/$29.
6. **Session-aware "Back to {appName}" on `/account`.**
7. **Ask Claude panel backend** (streaming AI route).
8. **Wire signup / phone OTP / EIN verification to real backends** (D-59, D-46, D-302/D-303).
9. **Error-state design pass** across all interaction failures before copy lock.
10. **Raw-color sweep** on pre-existing violations in `/sms/[category]/messages/page.tsx` (lines 242, 379, 951).
