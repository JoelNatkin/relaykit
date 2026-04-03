# CC_HANDOFF.md — Session Handoff
**Date:** 2026-04-03 (D-300–D-305, PRD v April 3, pricing v5.1, backlog updates, voice doc cleanup — docs-only session)
**Branch:** main

---

## Commits This Session

```
0bb2860  docs: add backlog items from April 2 strategy session — sandbox demos, connectors, multi-user, pricing exploration
f114523  docs: append D-300–D-305 — intake interview, variable schema, EIN verification, symmetrical pricing, marketing standalone
efc4093  docs: update consolidated PRD for D-300–D-305 — intake interview, symmetrical pricing, EIN verification, marketing standalone
6d2ebca  docs: update PRICING_MODEL.md v5.1 — symmetrical pricing, marketing-only tier, EIN requirement, direction-agnostic economics
7bf3648  docs: add backlog items from April 3 noodling session — intake interview, EIN verification, message editing UX, Claude API backend
ed1b7f9  docs: track voice principles v2, archive v1.1, add starter kit program
```

---

## What Was Completed

### Decisions D-300 through D-305
- **D-300:** Website intake interview replaces spec file prompt. Claude-powered on backend (~80/20 deterministic-to-Claude). Generates contextualized spec file delivered via `npx relaykit init` or API endpoint. Per-vertical business questions. Supersedes old download flow prompt. Extends D-279.
- **D-301:** Curated messages have locked variable schemas (editing can't break SDK calls). Custom messages (D-280) define their own variables.
- **D-302:** EIN required for marketing messages. Verified at sandbox access. Auto-populates business identity fields from authoritative sources (~$1-3/lookup).
- **D-303:** Business identity pre-validation from EIN lookup — registration form becomes "confirm what we found." Reduces TCR rejections, saves ~$15/rejection in vetting fees.
- **D-304:** Pricing is symmetrical — first campaign $19/month, second campaign $29/month, regardless of direction. Amends D-294.
- **D-305:** Marketing-only is a valid standalone use case at $19/month. Requires EIN (D-302). Amends D-294.

### D-294 Amendment
Inline note added: "⚠ Amended by D-304 (symmetrical pricing) and D-305 (marketing standalone valid). The 'transactional is the base' constraint is removed."

### RELAYKIT_PRD_CONSOLIDATED.md (dated April 3, 2026)
- Step 2 rewritten: intake interview before message preview (D-300)
- Step 3 rewritten: `npx relaykit init` delivers contextualized spec file, no copy-paste (D-300)
- SMS_GUIDELINES.md section: generated from intake, delivered via init command (D-300)
- Marketing Messages: constraint replaced with symmetrical pricing (D-304), EIN requirement (D-302/D-303), reverse direction on-demand activation (D-305)
- Compliance Site: marketing-only note added
- Pricing: direction-agnostic $19/$29 (D-304/D-305)
- "Not Yet Built": intake interview and EIN verification added
- Key Principles: "Website gathers context, AI tool executes" (D-300)
- Decision count: 305+

### PRICING_MODEL.md v5.1
- Direction-agnostic tier naming ("single-campaign" / "dual-campaign")
- Three-column monthly economics table: transactional $19 (~48% margin), marketing-only $19 (~30% margin), dual $29 (~36% margin)
- Marketing-only LTV row ($517, same as transactional-only)
- Bidirectional subscription lifecycle paths
- Screen 3 Preview Card updated
- Stripe Product Config: updated naming
- v5.1 change log entry

### BACKLOG.md Updates
**April 2 strategy session (5 new sections/items):**
- Sandbox Demo Features section (high priority — 5 items: multiple verified phones, "Send to my phone," manual demo send, app-triggered demo send, shareable invite link)
- Marketing & Growth: Lovable/Bolt/Replit connector exploration
- Infrastructure & Operations: multi-user / team access and project ownership transfer
- Pricing & Business Model: lower barrier-to-entry exploration
- Content & Marketing: constraint demolition framework blog post

**April 3 noodling session (4 new items + 2 updates):**
- Product Features: website intake interview per vertical, EIN verification, message editing UX with locked variables
- Infrastructure & Operations: Claude API integration for website backend
- Updated: marketing campaign registration flow (reverse direction note), sandbox API mock mode (D-300 partial supersession note)

### Voice Doc File Cleanup
- `docs/VOICE_AND_PRODUCT_PRINCIPLES_v2.md` — now tracked
- `docs/V4_EXPERIENCE_PRINCIPLES_v1.1.md` — git rm'd from root, archived at `docs/archive/`
- `docs/STARTER_KIT_PROGRAM.md` — now tracked

---

## Quality Checks Passed

- `tsc --noEmit` — clean (root project)
- `tsc --noEmit` — clean (`/api`)
- `eslint src/` — clean (`/api`)
- No code changes this session — docs only

---

## In Progress / Partially Done (Carried Forward)

### Sinch Carrier Integration
POST /v1/messages still logs to console instead of sending via Sinch. The msg_ ID and response contract are ready — just needs the carrier send call.

### Custom Messages
`namespace: "custom", event: "send"` returns 422 "not yet supported". Placeholder for D-280 (website authoring surface).

---

## Gotchas for Next Session

1. **Delete `.next` before every dev server start** (prototype). API server has no `.next` — it uses tsx directly.

2. **API server runs on port 3002.** Prototype is port 3001, Next.js dev is default port 3000.

3. **D-294 is amended, not superseded.** D-304 and D-305 amend specific constraints (symmetrical pricing, marketing standalone). Core D-294 mechanics (smart registration, on-demand activation, sandbox usage tracking) remain valid.

4. **Marketing-only margin is ~30%.** Lower than transactional-only (~48%) due to estimated higher Sinch marketing campaign monthly fee (~$5 vs ~$1.50). Exact Sinch fee schedule pending ISV tier confirmation (D-271).

5. **EIN verification data sources not yet chosen.** D-302/D-303 list options (IRS BMF, state SOS, Middesk, Enigma at ~$1-3/lookup) but no decision on which to use. Needs research.

6. **`user_id` is `string | null` everywhere (D-292).** Unchanged from prior session.

7. **Signup endpoint is PUBLIC.** `POST /v1/signup/sandbox` — no rate limiting yet (in BACKLOG.md).

8. **Migrations 003 and 004 may not be applied to live DB.** Run via Supabase dashboard SQL editor if MCP permissions aren't fixed.

9. **SDK and API are sibling directories at repo root.** `/sdk` and `/api` — separate package.json, separate node_modules, separate test suites.

10. **Supabase MCP had permission issues last session.** May need fixing.

11. **`createApp()` takes two params.** `createApp(lookup, consentStore?)` — consent store optional. Tests that don't need consent pass only the lookup.

12. **`index.ts` creates its own app instance.** The default `app` export was removed from `app.ts`. Tests use `createApp()` directly with mocks.

13. **`hasSupabase` guard in `index.ts`.** Both KeyLookup and ConsentStore are created behind `Boolean(supabaseUrl && supabaseKey)` check. Without env vars, the server runs with stub auth (all 401) and no consent routes.

14. **Environment type is `'sandbox' | 'live'`, not `'production'`.** Fixed in a prior session.

---

## Files Modified This Session

```
# Decisions
DECISIONS.md                                           # MODIFIED — D-300–D-305, D-294 amendment note

# PRD and pricing
docs/RELAYKIT_PRD_CONSOLIDATED.md                      # MODIFIED — D-300–D-305 updates, dated April 3
docs/PRICING_MODEL.md                                  # MODIFIED — v5.1

# Backlog
BACKLOG.md                                             # MODIFIED — April 2 + April 3 items, 2 existing items updated

# Voice doc cleanup
docs/VOICE_AND_PRODUCT_PRINCIPLES_v2.md                # NEW (tracked)
docs/archive/V4_EXPERIENCE_PRINCIPLES_v1.1.md          # MOVED from docs/ root
docs/V4_EXPERIENCE_PRINCIPLES_v1.1.md                  # DELETED (git rm)
docs/STARTER_KIT_PROGRAM.md                            # NEW (tracked)

# Session docs
CC_HANDOFF.md                                          # This file (overwritten)
```

---

## What's Next (suggested order)

1. **Run migrations 003 + 004 in Supabase** — raw_key column and nullable user_id. Either fix MCP permissions or run via dashboard SQL editor.
2. **Sinch carrier integration** — Replace console.log stub in POST /v1/messages with real Sinch API call. Wire msg_ ID as correlation ID.
3. **Sandbox signup flow integration** — API key creation endpoint exists; wire it into the dashboard or a signup page. Key shown once at creation, always visible in dashboard for sandbox (D-291).
4. **SDK → API server wiring** — Point SDK's fetch calls at the real API server. Verify end-to-end: `npm install relaykit` → `new RelayKit()` → `sendConfirmation()` → real text message.
5. **EIN verification data source research** — Investigate IRS BMF, state SOS, Middesk, Enigma. Pick a source and estimate integration effort (D-302/D-303).
6. **Prototype cleanup** — Remove compliance alerts system (D-293) and marketing expansion modal (D-294, D-295). Replace with inline marketing status/toggle.
7. **Marketing sandbox usage tracking (D-294)** — Track which namespaces a sandbox key has used, so registration can auto-submit marketing campaign if marketing was used.
8. **Website intake interview design (D-300)** — Per-vertical question sets, Claude API integration architecture, spec file generation pipeline.
