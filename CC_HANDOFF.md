# CC_HANDOFF.md — Session Handoff
**Date:** 2026-04-04 (D-310–D-316, Phase 1 workspace reshape, Phase 2 message card redesign)
**Branch:** main

---

## Commits This Session

```
ace833d  refactor(prototype): reshape dashboard to messages-first workspace (Phase 1)
98e1764  feat(prototype): redesign message cards with edit state, send button, inline style pills (Phase 2)
482ae11  fix(prototype): visual polish on message cards — 10 refinements
bea3c21  fix(prototype): message card edit state refinements — 10 visual fixes
6e178e1  docs: add WORKSPACE_DESIGN_SPEC.md, update PROTOTYPE_SPEC.md for Phase 2 card redesign
```

---

## What Was Completed

### Phase 1: Workspace Reshape
- Default redirect changed from `/overview` to `/messages`
- Tab bar hidden entirely in sandbox/Default state — no navigational chrome
- Overview tab only appears for post-registration states (Pending, Approved, Extended Review, Rejected)
- Settings accessible via gear icon (Settings01) in top bar for sandbox state
- Removed from Messages page: PlaybookSummary flow diagram, AI tool setup dropdown, ToolPanel, Download/Re-download CTAs, compliance status line, AiCommandsGrid (dead code)
- Fixed pre-existing bug: `setRegistrationState` not destructured in overview page (rejected state "Start new registration" button)

### Phase 2: Message Card Redesign
- **Default state:** Title (bold) + info icon inline with title + pencil edit button right-aligned. Full interpolated message preview with variables in brand color. Clicking text enters edit. Send button (paper plane) floats outside card on right as tertiary circle.
- **Edit state:** Textarea with personalized values (GlowStudio, etc.), not raw template syntax. Badge-styled pills (Current + category variants) with Accept/Revert flow. Freeform AI help input (stubbed). Compliance feedback: 2s debounce, muted red hint + compact Fix button inline, Save disabled while non-compliant. Save primary purple, Cancel tertiary text-only, right-aligned.
- Removed: Global style pill bar, Personalize slideout, Show template toggle, Copy all, card numbers, per-card copy/template toggle, "Modify with AI" accordion, contextual AI suggestion links.
- Public messages page (`/sms/[category]/messages`) updated to new CatalogCard props.

### Decisions Recorded
- D-310: EIN and business identity are per-app, not per-account
- D-311: Multiple categories submit simultaneously at registration
- D-312: TCR allows up to 5 campaigns per brand; v1 supports max 2
- D-313: Pre-auth message send requires special endpoint or session token
- D-314: Single $99 go-live fee replaces $49/$150 split
- D-315: Price revealed at signup step, not at go-live or on arrival
- D-316: Signup is a wizard step, not a separate decision moment
- D-302 amended: EIN required for any second campaign, not just marketing

### Documentation
- WORKSPACE_DESIGN_SPEC.md added (wizard-to-workspace design spec)
- PROTOTYPE_SPEC.md Messages section rewritten for Phase 2 card design
- PROTOTYPE_SPEC.md file map updated (page.tsx redirects to /messages)

---

## Quality Checks Passed

- `tsc --noEmit` — clean (prototype)
- `next build` — clean (prototype)
- All routes return 200: /apps/glowstudio/messages, /apps/glowstudio/overview, /apps/glowstudio/settings, /sms/appointments/messages
- All 5 lifecycle states verified: Default, Pending, Approved, Extended Review, Rejected

---

## In Progress / Partially Done (Carried Forward)

### Sinch Carrier Integration
POST /v1/messages still logs to console instead of sending via Sinch. The msg_ ID and response contract are ready — just needs the carrier send call.

### Custom Messages
`namespace: "custom", event: "send"` returns 422 "not yet supported". Placeholder for D-280 (website authoring surface).

### AI Help Input (stubbed)
The freeform AI help input in the card edit state renders but doesn't call Claude. Needs backend integration (D-300).

### Style Pill → AI Pre-validation (stubbed)
Pill swaps currently show variant text directly. Per WORKSPACE_DESIGN_SPEC.md, pill changes should be AI pre-validated before showing. Currently swaps are instant with no validation.

---

## Gotchas for Next Session

1. **Delete `.next` before every dev server start** (prototype). API server has no `.next` — it uses tsx directly.

2. **API server runs on port 3002.** Prototype is port 3001, Next.js dev is default port 3000.

3. **No ESLint config in prototype.** `npx next lint` prompts for interactive setup. tsc and build are the quality gates. If Joel wants ESLint, it needs to be configured first.

4. **Public messages page uses new CatalogCard props.** The `/sms/[category]/messages` page was updated to pass `variants` instead of old props (`globalViewMode`, `activeTemplate`, `isPromptsOpen`, etc.). The page still has its own style pill bar and toolbar — those are the public marketing page controls, separate from the dashboard card redesign.

5. **D-294 is amended, not superseded.** D-304 and D-305 amend specific constraints (symmetrical pricing, marketing standalone). Core D-294 mechanics remain valid.

6. **Rate limiter is in-memory.** Resets on server restart. Fine for single-instance, needs Redis or similar for multi-instance deployment.

7. **`user_id` is `string | null` everywhere (D-292).** Unchanged from prior sessions.

8. **Signup endpoint is PUBLIC.** `POST /v1/signup/sandbox` — rate-limited (5/IP/hour) but no auth.

9. **Migrations 003 and 004 may not be applied to live DB.** Run via Supabase dashboard SQL editor if MCP permissions aren't fixed.

10. **SDK and API are sibling directories at repo root.** `/sdk` and `/api` — separate package.json, separate node_modules, separate test suites.

11. **30 templates across 8 namespaces.** All SDK methods have matching registry entries. Adding a new SDK method requires adding a registry template (and vice versa).

12. **Compliance check is a client-side stub.** The `checkCompliance()` function in catalog-card.tsx checks for missing opt-out language and missing business name. Real compliance checking will be server-side (D-293, D-300).

13. **WORKSPACE_DESIGN_SPEC.md references pending decisions.** The "Key Decisions Referenced" section at the bottom lists D-310–D-316 as "(PENDING — needs to be recorded)" — these are now recorded. The file should be updated to remove the PENDING annotations.

14. **Pricing references across prototype are stale.** D-314 changed to $99 flat fee. The overview page registration card still shows "$49 to submit, $150 + $19/mo after approval" and the register/review page shows "$49" pricing. These screens were not touched this session (post-registration states).

---

## Files Modified This Session

```
# Decisions & Specs
DECISIONS.md                                           # MODIFIED — D-310–D-316, D-302 amended
PROTOTYPE_SPEC.md                                      # MODIFIED — Messages section rewritten
WORKSPACE_DESIGN_SPEC.md                               # NEW — wizard-to-workspace design spec
CC_HANDOFF.md                                          # This file (overwritten)

# Prototype — Phase 1 workspace reshape
prototype/app/apps/[appId]/page.tsx                    # MODIFIED — redirect /overview → /messages
prototype/app/apps/[appId]/layout.tsx                  # MODIFIED — hide tabs in sandbox, add settings gear
prototype/app/apps/[appId]/overview/page.tsx            # MODIFIED — fix setRegistrationState destructure

# Prototype — Phase 2 card redesign
prototype/components/catalog/catalog-card.tsx           # REWRITTEN — new default/edit states
prototype/app/apps/[appId]/messages/page.tsx            # REWRITTEN — stripped controls, new card props
prototype/app/sms/[category]/messages/page.tsx          # MODIFIED — updated CatalogCard props
```

---

## What's Next (suggested order)

1. **Phase 2.5: Error states design session** — Per WORKSPACE_DESIGN_SPEC.md, walk through every interaction that can fail before building the wizard flow.
2. **Phase 3: `/start` wizard flow** — Vertical picker, intake questions, summary, phone verification, pre-auth messages view. Net-new pages.
3. **Fix stale pricing across prototype** — D-314 changed to $99. Update overview registration card, register/review page, settings billing section.
4. **Clean up WORKSPACE_DESIGN_SPEC.md pending annotations** — D-310–D-316 are recorded; remove "(PENDING)" markers.
5. **Sinch carrier integration** — Replace console.log stub in POST /v1/messages with real Sinch API call.
6. **Run migrations 003 + 004 in Supabase** — raw_key column and nullable user_id.
7. **AI help backend** — Wire the freeform AI input to Claude API for message rewrites (D-300).
