# Build Spec Validation — Experiment Log
## March 29, 2026, 11:00 AM – 2:30 PM EDT

---

## Executive Summary

RelayKit's core promise is that a developer can add compliant SMS to their app by handing a spec file to their AI coding tool. This document records the experiments that validated that promise and explored alternative delivery models.

**Result: the spec works — and a working module works faster and generalizes across verticals.** A single markdown file was sufficient for three different AI coding tools to produce correct SMS integrations. When the same task was tested with a pre-built JavaScript module (Model B), all tools completed integrations in roughly half the time. The module format then generalized to a completely different app architecture (e-commerce with guest checkout, PayPal payments, phone on Order model) with identical success rates. **The SDK format (npm package with namespaced methods) validates as the production form factor** — both tools used `new RelayKit()` with zero-config and the namespace pattern on first attempt.

**Key numbers:**
- 3 AI tools tested (Claude Code, Cursor, Windsurf)
- 2 apps tested (appointment booking, e-commerce store)
- 2 verticals tested (appointments, orders)
- 4 delivery models tested (spec file, working module, repo report, SDK)
- 27 total experiment rounds (24 integration, 3 analysis)
- Full integration loop validated: consent collection + consent recording + SMS sending, all from two modules in one prompt
- Module format generalizes: identical success on fundamentally different app architectures
- Module reduced CC's completion time by 58% (3m18s → 1m22s)
- SDK namespace pattern used correctly by all tools on first attempt (Round 12)
- Repo report: 2/3 tools produced fully accurate structured analysis; Cursor hallucinated a nonexistent phone field 3 times
- Average implementation time: 1–3 minutes (module), 2–5 minutes (SDK), 3–5 minutes (spec)

---

## Experiment Design

### What we tested

Can an AI coding tool read a single spec file and produce a working SMS integration in an existing app it has never seen before? Does the spec generalize across different tools, codebases, and complexity levels?

### What we were NOT testing

- Whether developers want SMS (validated by Twilio's existence as a business)
- Whether pricing is right (market question, tested separately)
- Whether carriers approve templates (live registration test, separate workstream)
- Whether the dashboard UI is good (prototype work, already done)

### Delivery model

**Model A — Spec file only.** A markdown document dropped into the project root. No SDK, no working module, no guided setup. The AI tool reads the file and builds the integration from instructions alone.

### The prompt

Identical across all rounds and tools:

> Read SMS_BUILD_SPEC.md in the project root. Build the feature it describes. Before writing any code, explain what you found in the codebase — where bookings are created, where phone numbers are stored, and where you plan to add the SMS call.

### AI tools tested

| Tool | Version | Model | Interface |
|------|---------|-------|-----------|
| Claude Code | v2.1.87 | Opus 4.6 (1M context) | Terminal, bypass permissions |
| Cursor | Free Plan | Auto (Agent mode) | IDE sidebar |
| Windsurf | Free Plan | GPT-5.2 Low Thinking | Cascade panel |

### Apps tested

| App | Stack | Booking logic | Phone numbers | Existing SMS | Cancel flow |
|-----|-------|---------------|---------------|-------------|-------------|
| KillyBarbershop | Next.js 15, Supabase, PostgreSQL | `reservationsService.ts` → Supabase insert | Yes (Users table) | Yes (deactivated Twilio) | N/A |
| Appointment-Booking-System | Next.js 13, Prisma, MongoDB | `app/api/reservations/route.ts` → Prisma nested create | **None** | **None** | Yes (`[reservationId]/route.ts` DELETE) |

### Methodology

- **Scientist, not builder.** Observe and record. Don't help, don't correct, don't guide.
- **Fresh clone for every round.** `rm -rf` + `git clone` to ensure zero contamination between rounds.
- **Same prompt every time.** No variation in instructions across tools or rounds.
- **Record everything.** Files modified, questions asked, constraint violations, time elapsed, product decisions made.

---

## Phase 1: Spec v1 — Single Message Type

### Spec v1 characteristics
- 1 message type (booking confirmation), 1 trigger (appointment created)
- Narrow UI constraint: "Don't modify the booking flow UI"
- Assumed phone numbers exist
- Per-error handling instructions (e.g., "rate_limited — Wait and retry")
- No explicit scope boundary language

### Round 1 — Claude Code + KillyBarbershop (control)

**Purpose:** Baseline test. App has existing (deactivated) Twilio SMS code — AI tool has breadcrumbs.

**Result:** All 8 checklist items passed. Zero questions. 4m 5s. Self-corrected a client/server architectural split. Found the integration point, phone numbers, and business name without guidance.

**Confound:** Existing Twilio code may have guided integration point discovery.

### Round 5 — Claude Code + Appointment-Booking-System (clean test)

**Purpose:** Eliminate Round 1 confound. No existing SMS code anywhere.

**Result:** All 8 checklist items passed. 2 questions asked (phone approach, execution style). ~5 min. Correctly identified that phone numbers don't exist in the data model. Added optional `phone String?` to User. Deferred UI changes.

**Key finding:** CC did not need existing SMS code to find the integration point. Confound eliminated.

### Round 6A — Cursor + Appointment-Booking-System (v1)

**Result:** 7 of 8 passed. **Violated "no UI changes"** — added phone input to booking form and client component. Put phone on Reservation model instead of User.

### Round 6B — Windsurf + Appointment-Booking-System (v1)

**Result:** 7 of 8 passed. **Violated "no UI changes"** — added phone to registration form. **Added unrequested features** — smsOptedOut flag, opt-out persistence, rate-limit retry logic.

### Spec v1 — Failure Analysis

| Failure | Tool(s) | Root cause | Fix |
|---------|---------|------------|-----|
| UI modification | Cursor, Windsurf | "Booking flow UI" too narrow — tools found loopholes | Absolute prohibition: "don't modify any .tsx/.jsx file" |
| Scope creep | Windsurf | Error code descriptions interpreted as feature requests | Uniform error handling: "log and move on" + explicit scope boundary |
| Questions asked | CC, Windsurf | Spec assumed phone numbers exist | Explicit phone gap guidance |

---

## Phase 2: Spec v2 — Single Message Type (Improved)

### Five changes from v1 to v2

1. **Absolute UI constraint:** "Do not modify any file with `.tsx` or `.jsx` in its name"
2. **Phone gap guidance:** "Add optional field to schema, skip if missing, no UI"
3. **Scope boundary:** "Build only what this spec describes" + named exclusions
4. **Business name fallback:** `process.env.BUSINESS_NAME || "Our Business"`
5. **Stronger "don't ask" + uniform error handling:** "Do not ask. Log and move on for all errors."

### Round 7A — Claude Code + Appointment-Booking-System (v2)

**Result:** All 9 checklist items passed. Zero questions. **2m 47s** (fastest of all rounds). Used `BUSINESS_NAME` fallback exactly as specified. Made SMS fire-and-forget. The "don't ask" language eliminated all questions.

### Round 7B — Cursor + Appointment-Booking-System (v2)

**Result:** All 9 checklist items passed. Zero frontend files modified. Zero unrequested features. Explicitly stated "I'm now making backend-only edits." Used spec's exact skip-log message. The `.tsx/.jsx` prohibition completely fixed the v1 violation.

### Round 7C — Windsurf + Appointment-Booking-System (v2)

**Result:** All 9 checklist items passed. Zero frontend files modified. Zero unrequested features (no opt-out flag, no retry logic). 1 question (confirmation before building — Windsurf's consistent personality). Scope creep completely eliminated.

### Spec v2 — All v1 failures fixed

| v1 failure | v2 result |
|------------|-----------|
| Cursor modified booking form | Cursor: zero frontend files touched |
| Windsurf modified registration form | Windsurf: zero frontend files touched |
| Windsurf added opt-out/retry features | Windsurf: zero unrequested features |
| CC asked 2 questions | CC: zero questions |

---

## Phase 3: Round 2 — Multiple Message Types

### Spec design

Three message types testing progressively harder integration challenges:

1. **Booking confirmation** — trigger exists (POST create). Same as v2 but now alongside others.
2. **Cancellation notice** — trigger exists (DELETE). AI tool must find a *second* integration point independently.
3. **Reschedule notice** — trigger does NOT exist (no PUT/PATCH route). Tests what the tool does when the code path is missing.

### New spec instructions for missing code paths

> "If the app does not have a code path for one of the triggers, do not create the route or the feature. Instead: create the SMS sending function, add a TODO comment, and report it in your summary."

### New spec requirement: shared utility

> "Create a single utility file for all RelayKit SMS calls. Each message type should be a separate exported function. Do not duplicate the HTTP call logic."

### Round 2A — Claude Code

**Time:** 3m 18s. Zero questions.

**Integration point discovery:**
- Found `app/api/reservations/route.ts` (POST) — booking creation ✓
- Found `app/api/reservations/[reservationId]/route.ts` (DELETE) — cancellation ✓
- Confirmed no PUT/PATCH route exists — reschedule missing ✓

**Missing code path handling:**
- Created `sendRescheduleNotice()` in shared utility with `// TODO: Wire this into the reschedule handler when it exists.`
- Did NOT create a new API route
- Reported: "Reschedule route not found — SMS function created but not wired in."

**Shared utility:** `app/libs/sms.ts` with private `sendSms()` helper + 3 exported functions. No duplicated HTTP logic.

**Architectural insight:** Noticed that cancellation requires fetching reservation details *before* deletion (can't query a deleted record). Implemented fetch-then-delete-then-SMS correctly.

**Result:** All 13 checklist items passed.

### Round 2B — Cursor

**Integration point discovery:**
- Found POST (create) ✓
- Found DELETE (cancel) ✓
- Confirmed no PUT/PATCH (reschedule missing) ✓
- Also noticed the booking route already referenced `@/app/libs/relaykit` from a previous experiment's residue — handled gracefully

**Missing code path handling:**
- Created `sendRescheduleNoticeSms()` with TODO comment ✓
- Did NOT create new API route ✓

**Shared utility:** `app/libs/relaykit.ts` with 3 exported functions + shared HTTP logic.

**Result:** All 13 checklist items passed. Zero frontend files modified. Zero unrequested features.

### Round 2C — Windsurf

**Integration point discovery:**
- Found POST (create) ✓
- Found DELETE (cancel) ✓
- Confirmed no PUT/PATCH (reschedule missing) ✓

**Missing code path handling:**
- Created `sendRescheduleNotice()` with TODO comment ✓
- Did NOT create new API route ✓

**Architectural insights:** Noted that `deleteMany` doesn't return deleted record details (same insight as CC). Also noted that the nested `listing.update(...create reservation...)` doesn't naturally return the created reservation.

**Shared utility:** `app/libs/relaykit.ts` with 3 exported functions.

**Result:** All 13 checklist items passed. Zero frontend files modified. Zero unrequested features. 1 question (confirmation before building).

### Round 2 — Cross-Tool Comparison

| Behavior | Claude Code | Cursor | Windsurf |
|----------|-----------|--------|----------|
| Found create route (POST) | Yes | Yes | Yes |
| Found delete route (DELETE) | Yes | Yes | Yes |
| Identified missing reschedule | Yes | Yes | Yes |
| Reschedule: function + TODO | Yes | Yes | Yes |
| Did NOT create new API route | Yes | Yes | Yes |
| Shared utility, no duplicated logic | Yes | Yes | Yes |
| Fetch-before-delete for cancellation | Yes | Yes | Yes |
| No frontend files modified | Yes | Yes | Yes |
| No unrequested features | Yes | Yes | Yes |
| Questions asked | 0 | 0 | 1 |

**Perfect alignment across all three tools.** The Round 2 spec produced identical architectural decisions from three different AI tools with three different underlying models.

---

## Tool Personalities (Observed Across All Rounds)

### Claude Code — The careful engineer

- Stops at ambiguity in v1, zero questions with well-written v2/Round 2 specs
- Stays strictly within spec boundaries across all rounds
- Produces clean, minimal implementations
- Self-corrects architectural issues (caught client/server split in Round 1)
- Best constraint adherence of all tools
- Fastest with clear specs (2m47s single trigger, 3m18s multi-trigger)

### Cursor — The fast builder

- Makes decisions and builds without waiting for confirmation
- v1: violated constraints by finding loopholes in narrow language
- v2+: respects absolute constraints perfectly — responds well to explicit prohibition
- Zero questions across all rounds — always proceeds autonomously

### Windsurf — The thorough architect

- Most detailed codebase analysis in every round
- v1: added unrequested features (scope creep) and modified UI
- v2+: completely reformed — zero scope creep, zero UI changes
- Consistently asks 1 confirmation question before building (tool personality, not spec weakness)
- Catches architectural edge cases (deleteMany return value, nested create return value)

### Key insight: write specs for Cursor

The spec must be written for Cursor (the most aggressive tool), not Claude Code (the most careful). If Cursor respects the constraints, all tools will. This means:
- Constraints must be absolute and enumerated, not implied
- Scope must be explicitly bounded with named exclusions
- The "What NOT to do" section is as important as the "What to do" section
- File-extension heuristics (`.tsx/.jsx`) are more effective than conceptual boundaries ("booking flow")

---

## Conclusions

### 1. Model A (spec file) is validated for multi-message integration.

The spec scales from one trigger to three without degradation. AI tools correctly find multiple integration points, handle missing code paths, and structure shared utilities — all from a markdown file.

### 2. Integration point discovery works across multiple code paths.

All tools found both the create route AND the delete route independently, without being told which files to look at. The spec's generic instruction — "find where reservations are created/deleted" — is sufficient.

### 3. "Missing code path" instructions work perfectly.

When told "create the function but don't wire it, add a TODO, don't create new routes," all three tools followed exactly. This is a critical finding — it means the spec can describe message types that don't have triggers yet, and tools will handle it gracefully.

### 4. Spec v2's constraint language holds under increased complexity.

The v2 improvements (absolute UI prohibition, scope boundary, uniform error handling) continued to work perfectly in Round 2. No regressions when moving from 1 message type to 3. The constraint language is robust.

### 5. Architectural reasoning is consistent across tools.

All three tools independently made the same architectural decision for cancellation: fetch the reservation details before deleting, then send SMS with the original data. This wasn't specified — the tools figured it out. AI tools can reason about data lifecycle.

### 6. The spec format is production-ready for the appointments use case.

Between v2 (single trigger) and Round 2 (multi-trigger with missing paths), the spec format has been validated with 6 passing rounds across 3 tools. The format — message types with triggers, shared utility requirement, integration guidance, explicit constraints — is ready to be templatized in PRD_05's build spec generator.

---

## Spec Writing Principles (Derived from Experiments)

These principles should guide PRD_05's build spec generator:

### 1. Constraints must be absolute, not relative.
"Don't modify the booking flow UI" → "Don't modify any file with `.tsx` or `.jsx`."
Relative constraints get reinterpreted. Absolute constraints with file-extension heuristics are unambiguous.

### 2. Scope must be explicitly bounded with named exclusions.
"Build only what this spec describes. Do not add: [enumerate features that are out of scope]."
AI tools will add helpful features unless told not to. Name the features you don't want.

### 3. Error handling must be uniform.
"Log and move on" for all errors. Per-error instructions get interpreted as feature requirements.

### 4. Missing triggers need explicit instructions.
When a message type's trigger doesn't exist in the codebase, the spec must say what to do: create the function, add a TODO, don't create new routes.

### 5. Phone number gaps need explicit guidance.
Not every app collects phone numbers. The spec must address this with: add optional field, skip if missing, log the skip, no UI changes.

### 6. Business name needs a fallback chain.
`listing.title` → `process.env.BUSINESS_NAME` → `"Our Business"`. Don't leave it ambiguous.

### 7. Shared utilities should be explicitly required.
Without the instruction, tools may duplicate HTTP logic across handlers. "Create a single utility file" produces cleaner code.

### 8. The spec should tell tools NOT to ask questions.
"Make reasonable decisions and proceed. Document assumptions in code comments." This produces faster, more consistent results than tools that stop to ask.

---

## Phase 4: Round 1B — Working Module (Model B)
### March 30, 2026

### What we tested

Does a pre-built working module produce more reliable, faster integration than a spec file? The spec (Model A) already hits 100% on v2/R2. This experiment tests whether Model B — a JavaScript file with pre-built functions wrapping the RelayKit API — matches that reliability while reducing AI tool decision-making.

### The module: `relaykit-sms.js`

A single JS file dropped into the project root. Exports three functions:
- `sendBookingConfirmation(to, { date, time })`
- `sendCancellationNotice(to, { date })`
- `sendRescheduleConfirmation(to, { date, time })`

Internally: shared `_send()` function handles HTTP call, auth header, error logging, graceful failure (returns null on error, logs warning if phone missing or API key not set). All functions are fire-and-forget by default. `BUSINESS_NAME` fallback built in.

The module absorbs all API mechanics. The AI tool's only job: find where events happen, import the function, call it with the right data.

### The prompt

```
There is a file called relaykit-sms.js in the project root. It exports three functions
for sending SMS messages through RelayKit's API: sendBookingConfirmation,
sendCancellationNotice, and sendRescheduleConfirmation.

Read the file, then integrate it into this app:

1. Find where bookings are created and call sendBookingConfirmation with the
   customer's phone number and appointment date/time.

2. Find where bookings are cancelled and call sendCancellationNotice with the
   customer's phone number and the cancelled date.

3. If there's a reschedule flow, call sendRescheduleConfirmation. If not,
   don't create one — just skip it and note that it's available when the app
   adds rescheduling.

4. Add RELAYKIT_API_KEY=rk_sandbox_test_abc123xyz to the .env file.

5. Add BUSINESS_NAME=TestBusiness to the .env file.

Rules:
- Backend only. Do not modify any files that render UI (anything in /components,
  anything that returns JSX/TSX, any .css files). If a file contains both server
  logic and UI rendering, only modify the server logic portion.
- Do not add features, pages, routes, or UI elements that don't already exist.
- Do not install any npm packages.
- Make reasonable decisions and proceed. Document assumptions in code comments.
  Do not ask questions.
```

### Grading checklist (17 items)

Items 1–13: same as R2 spec experiments. Items 14–17: module-specific.
- 14: Module imported correctly (require or import, correct path)
- 15: Functions called with correct argument shape ({ date, time } not positional)
- 16: Module file itself NOT modified
- 17: SMS calls are fire-and-forget (not blocking the response)

### Round 1B-A — Claude Code + Appointment-Booking-System

**Time:** 1m 22s. Zero questions.

**Integration:**
- Found `app/api/reservations/route.ts` (POST) — booking creation ✓
- Found `app/api/reservations/[reservationId]/route.ts` (DELETE) — cancellation ✓
- Confirmed no reschedule flow — skipped with note ✓

**Phone number handling:** User model has no phone field. CC accepted optional `phone` from request body for booking creation. For cancellation, passed `undefined` with a comment explaining how to wire it up once phone field exists on User model. RelayKit module logs warning and skips gracefully.

**Module usage:** Imported correctly. Functions called with correct destructured argument shape. Module file unmodified. All calls fire-and-forget (not awaited in request handler).

**Files modified:** `app/api/reservations/route.ts`, `app/api/reservations/[reservationId]/route.ts`, `.env`

**Result:** 17/17 passed.

### Round 1B-B — Cursor + Appointment-Booking-System

**Time:** ~1 minute. Zero questions.

**Integration:**
- Found POST create route ✓
- Found DELETE cancel route ✓
- Confirmed no reschedule flow — skipped with note ✓

**Phone number handling:** Used `currentUser.phone` directly (assumed field exists — different assumption than CC, which accepted from request body). For cancellation, fetched reservation including user before deletion, used `reservationDetails.user.phone`.

**Module usage:** Imported correctly. Correct argument shape. Module unmodified. Used `void` for fire-and-forget.

**Extra:** Ran linter diagnostics on modified files — no errors introduced. Self-verification step that other tools didn't do.

**Files modified:** `app/api/reservations/route.ts`, `app/api/reservations/[reservationId]/route.ts`

**Result:** 17/17 passed.

### Round 1B-C — Windsurf + Appointment-Booking-System

**Time:** 2m 45s. **2 questions asked** (both about .env creation — Windsurf couldn't write gitignored files).

**Integration:**
- Found POST create route ✓
- Found DELETE cancel route ✓
- Confirmed no reschedule flow — skipped with note ✓

**Phone number handling:** Checked multiple possible field names (`phone`, `phoneNumber`, `mobile`) on currentUser. Noted Prisma User model doesn't define phone field; if missing at runtime, RelayKit logs and skips.

**Module usage:** Imported correctly. Correct argument shape. Module unmodified. Fire-and-forget with try/catch.

**.env issue:** Windsurf's IDE restrictions prevented writing to gitignored files. Asked for help twice instead of proceeding. .env had to be created manually by the experimenter.

**Files modified:** `app/api/reservations/route.ts`, `app/api/reservations/[reservationId]/route.ts`

**Result:** 15/17 passed. Failures: .env creation (item 8, 9 — tool limitation), questions asked (item 13).

### Round 1B — Cross-Tool Comparison

| Behavior | Claude Code | Cursor | Windsurf |
|----------|-----------|--------|----------|
| Found create route (POST) | Yes | Yes | Yes |
| Found delete route (DELETE) | Yes | Yes | Yes |
| Identified missing reschedule | Yes | Yes | Yes |
| Correct import of module | Yes | Yes | Yes |
| Correct argument shape | Yes | Yes | Yes |
| Module unmodified | Yes | Yes | Yes |
| Fire-and-forget calls | Yes | Yes | Yes |
| No frontend files modified | Yes | Yes | Yes |
| No unrequested features | Yes | Yes | Yes |
| .env created | Yes | Yes | **No** (tool limitation) |
| Questions asked | 0 | 0 | **2** |

### Round 1B — Model A (Spec) vs. Model B (Module) Comparison

| Metric | R2 Spec (Model A) | Module (Model B) |
|--------|-------------------|------------------|
| CC time | 3m 18s | **1m 22s** (58% faster) |
| CC questions | 0 | 0 |
| CC pass rate | 13/13 | 17/17 |
| Cursor pass rate | 13/13 | 17/17 |
| Windsurf pass rate | 13/13, 1 question | 15/17, 2 questions |
| Shared utility created by tool | Yes (tools built it) | No (provided by module) |
| Phone number approach | Tools decided | Tools decided (same) |
| Architectural decisions by tool | ~15 | ~3 (import, find events, map data) |

### Key findings

**1. The module is significantly faster.** CC finished in 1m22s vs 3m18s — 58% faster. The module eliminated all API-related decision-making (HTTP structure, error handling, auth, message formatting). The tool only solved: where do events happen, where's the phone number, how do I call this function.

**2. Reliability is equivalent.** Both models produce correct integrations. The module didn't introduce new failure modes — tools imported it correctly, used the right argument shapes, and didn't modify it.

**3. The module reduces architectural decisions from ~15 to ~3.** With the spec, tools had to decide: HTTP client, error handling pattern, retry logic, auth header format, response parsing, shared utility structure, function signatures, and more. With the module, all of that is pre-decided. Tools only decide: import path, event location, data mapping.

**4. Windsurf's weakness persists.** Windsurf asked questions in both Model A and Model B experiments. The root cause differs (.env permissions vs. confirmation-seeking), but the pattern is consistent: Windsurf is the most likely to stop and ask.

**5. Phone number handling remains the key variable.** All three tools made different assumptions about where phone numbers live. CC accepted from request body. Cursor assumed `currentUser.phone`. Windsurf checked multiple field names. This is a product/data-model problem, not a spec or module problem. Neither delivery model resolves it — both require the tool to discover the app's data model.

---

## Phase 5: Round 11 — Repo Report (Codebase Analysis)
### March 30, 2026

### What we tested

Can an AI tool produce a structured, machine-readable JSON report about a codebase that is accurate enough for RelayKit's generator to consume programmatically? Specifically: does the report correctly identify data fields, file paths, event handlers, and — critically — whether phone numbers exist in the data model?

### The hypothesis

If the repo report produces accurate, structured output, RelayKit can feed it into the spec/module generator and eliminate the phone number guessing problem observed across all 13 integration rounds.

### The prompt

Tools were asked to produce a JSON report with a fixed schema covering: app metadata (framework, language, database, ORM), user model details (location, phone field, email field, auth method), server-side events (name, file path, line number, HTTP method, data available at event), phone number collection status, and env file status.

Key instruction: "Do not guess. If you can't determine something from the code, use null."

### Ground truth (verified by experimenter)

- Framework: Next.js 13 (App Router)
- Language: TypeScript
- Database: MongoDB via Prisma
- User model: `prisma/schema.prisma` — fields: id, name, email, emailVerified, image, hashedPassword, createdAt, updatedAt, favoriteIds. **No phone field.**
- Phone field verified: `grep -n "phone" prisma/schema.prisma` returns zero matches.
- Events: 7 server-side mutation handlers across register, listings, reservations, and favorites.

### Round 11-A — Claude Code

**Time:** 1m 55s.

**Accuracy:** All fields correct. `phone_field: null`. Identified 7 events with correct file paths. Noted that the cancellation handler's deleteMany only returns a count, not the full record. Provided structure notes explaining the App Router + Pages Router hybrid and Prisma singleton pattern.

**Phone number reporting:** Correctly null. Notes: "No phone field exists." Also proactively suggested where to add it (schema + register route + RegisterModal component).

**JSON validity:** Valid, parseable, all required fields present.

**Result:** 13/13 accuracy, 4/4 structure. Pass.

### Round 11-B — Cursor (attempt 1)

**Time:** Near-instant.

**Accuracy:** All fields correct EXCEPT `phone_field`. Reported `"phone_field": "phone"` with `"phone_field_path": "prisma/schema.prisma (model User -> phone)"`. This field does not exist — verified by grep. **Hallucination.**

Internally contradictory: reported `"collected": false` and noted "No phone input field or phone write path was found" while simultaneously asserting the schema field exists.

**Result:** 12/13 accuracy. **Critical failure on highest-value field.**

### Round 11-B2 — Cursor (attempt 2, verification instruction)

Added to prompt: "For phone_field specifically: search the schema file for the literal string 'phone' before reporting. If the string does not appear, phone_field must be null."

**Result:** Same hallucination. Still reported `"phone_field": "phone"`. The verification instruction had no effect.

### Round 11-B3 — Cursor (attempt 3, evidence-first approach)

Added to prompt: "Before generating the JSON, output an EVIDENCE section containing the exact, complete contents of the User model from the schema file and the result of searching the entire project for 'phone'. Then generate the JSON based only on what appears in your EVIDENCE section."

**Result:** Cursor fabricated the evidence itself. The EVIDENCE section contained a User model with `phone String?` in it — a field that does not exist in the actual file. The search result within the same EVIDENCE section reported "No matches found" for "phone" — contradicting its own fabricated schema. Cursor then proceeded to report `"phone_field": "phone"` in the JSON despite its own search evidence saying otherwise.

**Conclusion:** Cursor's phone field hallucination is not a reasoning error — it is a read-level hallucination. The tool is not accurately reproducing file contents it claims to be copy-pasting. No prompt technique tested was able to override it. Three attempts, three identical hallucinations.

### Round 11-C — Windsurf

**Accuracy:** All fields correct. `phone_field: null`. Identified 7 events with correct file paths. Most thorough phone number notes of all tools: "No evidence of phone number collection or storage was found in the codebase: (1) Prisma User model has no phone field, (2) a repo-wide search for 'phone' returned no matches, (3) registration endpoint only accepts { email, name, password }."

**JSON validity:** Valid, parseable, all required fields present. Minor issue: output included commentary before the JSON block (the prompt said not to), but the JSON itself was clean.

**Result:** 13/13 accuracy, 3/4 structure (commentary before JSON). Pass.

### Round 11 — Cross-Tool Comparison

| Field | CC | Cursor (3 attempts) | Windsurf |
|-------|-----|---------------------|----------|
| Framework | ✓ | ✓ | ✓ |
| Language | ✓ | ✓ | ✓ |
| Database | ✓ | ✓ | ✓ |
| ORM | ✓ | ✓ | ✓ |
| User model location | ✓ | ✓ | ✓ |
| **Phone field (critical)** | **✓ (null)** | **✗ ✗ ✗ (hallucinated 3x)** | **✓ (null)** |
| Events found | 7 | 7 | 7 |
| Event file paths correct | ✓ | ✓ | ✓ |
| Phone not collected | ✓ | ✓* | ✓ |
| Valid JSON | ✓ | ✓ | ✓ |

*Cursor correctly reported `collected: false` but contradicted itself with `phone_field: "phone"`.

### Key findings

**1. The repo report concept is validated — with a known tool limitation.** Two of three tools (CC, Windsurf) produced accurate, structured, machine-readable JSON reports. All fields correct. File paths accurate. Phone number gap correctly identified with null values. The output is parseable by a standard JSON parser with no special handling.

**2. Cursor has a persistent, unfixable hallucination on this codebase.** Across three attempts with increasingly explicit verification instructions — including asking Cursor to paste the raw schema contents first — Cursor fabricated a phone field that does not exist. This is a read-level hallucination, not a reasoning error. No prompt technique resolved it.

**3. The mitigation is cheap.** When the developer pastes a repo report into the RelayKit website, a simple cross-reference catches the contradiction: if `phone_field` is not null but `collected` is false, ask the developer one yes/no question: "Does your User model actually have a phone field?" This resolves Cursor's hallucination with zero engineering complexity.

**4. Event discovery is consistent and accurate across all tools.** All three tools found the same 7 events, with matching file paths and similar line numbers. This is the second-highest-value data in the report (after phone status), and it's reliable across all tools.

**5. The JSON schema works as a programmatic contract.** A single parser handles all three tools' output. Field names, nesting, and types are consistent. The format is ready for RelayKit's generator to consume.

### Decision: repo report concept is viable

The repo report will be consumed by RelayKit's website after the developer's interview (use case selection, message personalization). The website cross-references the report to catch contradictions (phone field hallucination pattern). The output is used to customize the spec/module with app-specific file paths and data mappings. This eliminates the phone number guessing problem for tools that report accurately and catches the hallucination for tools that don't.

---

## Phase 6: Round 7 — Product Decisions (No Trigger Guidance)
### March 31, 2026

### What we tested

Can AI tools figure out WHERE to call each SMS function without being told? Previous experiments gave explicit trigger guidance ("find where bookings are created and call sendBookingConfirmation"). This experiment stripped all trigger guidance and gave only function names with one-line descriptions.

### The hypothesis

If tools correctly map functions to code paths from names alone, trigger descriptions are documentation for the developer — not instructions for the AI tool. The product playbook adds human value but isn't load-bearing for the integration.

### What changed from Round 1B

Round 1B prompt said:
1. "Find where bookings are created and call sendBookingConfirmation"
2. "Find where bookings are cancelled and call sendCancellationNotice"
3. "If there's a reschedule flow, call sendRescheduleConfirmation. If not, don't create one."

Round 7 prompt said only:
- `sendBookingConfirmation(to, { date, time })` — confirms an appointment
- `sendCancellationNotice(to, { date })` — notifies about a cancellation
- `sendRescheduleConfirmation(to, { date, time })` — confirms a reschedule
- "Figure out where each function should be called and integrate them."

No trigger guidance. No explicit instruction about missing code paths. Same constraint rules (backend only, no new features, no questions).

### Round 7-A — Claude Code

**Time:** 1m 19s. Zero questions.

**Integration point discovery (unprompted):**
- Mapped `sendBookingConfirmation` → POST `/api/reservations` ✓
- Mapped `sendCancellationNotice` → DELETE `/api/reservations/[reservationId]` ✓
- Identified no reschedule endpoint exists — skipped `sendRescheduleConfirmation` ✓

**Module handling:** Read the existing `relaykit-sms.js`, imported correctly, used correct argument shapes. Added `phone String?` to Prisma User model. Added `@ts-ignore` for CommonJS/TS boundary. Fire-and-forget with `.catch()`.

**Architectural insight:** Same fetch-before-delete pattern for cancellation. Checked `reservation.count > 0` before sending cancellation SMS.

**Result:** 14/14 passed.

### Round 7-B — Cursor

**Time:** 1m 30s. Zero questions.

**Integration point discovery (unprompted):**
- Mapped `sendBookingConfirmation` → POST `/api/reservations` ✓
- Mapped `sendCancellationNotice` → DELETE `/api/reservations/[reservationId]` ✓
- **Created a PUT handler for `sendRescheduleConfirmation`** ✗

**Constraint violation:** Cursor added a new PUT method to the existing `[reservationId]/route.ts` file with full reschedule logic (validate input, update reservation, send SMS). The prompt said "do not add features, pages, routes, or UI elements that don't already exist." Cursor interpreted adding a method to an existing route file as not adding a new route — same loophole-finding behavior observed in Phase 1.

**Result:** 12/14. Failures: created new feature (PUT handler), violated "no new features" constraint.

### Round 7-C — Windsurf

**Time:** ~5 minutes. Asked questions (same .env/gitignore issue as Round 1B).

**Integration point discovery (unprompted):**
- Mapped `sendBookingConfirmation` → POST `/api/reservations` ✓
- Mapped `sendCancellationNotice` → DELETE `/api/reservations/[reservationId]` ✓
- Correctly identified no reschedule endpoint — skipped, documented assumption ✓

**Explicit reasoning:** "There is no existing backend reschedule/update endpoint in this codebase (and I didn't add one per your rules)." Windsurf understood the constraint and applied it correctly — the opposite of Cursor's decision.

**.env issue:** Same gitignore restriction as Round 1B. Could not create .env, asked for manual intervention.

**Result:** 12/14. Failures: .env creation (tool limitation), questions asked.

### Round 7 — Cross-Tool Comparison

| Behavior | Claude Code | Cursor | Windsurf |
|----------|-----------|--------|----------|
| Mapped confirmation → POST | ✓ | ✓ | ✓ |
| Mapped cancellation → DELETE | ✓ | ✓ | ✓ |
| Skipped reschedule (no endpoint) | ✓ | **✗ (built PUT handler)** | ✓ |
| Module used as-is | ✓ | ✓ | ✓ |
| No new features | ✓ | **✗** | ✓ |
| .env created | ✓ | ✓ | **✗** (tool limitation) |
| Questions asked | 0 | 0 | Yes |
| Time | 1m 19s | 1m 30s | ~5m |

### Round 7 vs. Round 1B — Does trigger guidance matter?

| Question | Round 1B (with triggers) | Round 7 (without triggers) |
|----------|--------------------------|---------------------------|
| Found booking creation? | All 3 ✓ | All 3 ✓ |
| Found cancellation? | All 3 ✓ | All 3 ✓ |
| Skipped reschedule? | All 3 ✓ | CC ✓, Cursor ✗, Windsurf ✓ |
| Any wrong placements? | None | None (Cursor's PUT is new, not wrong) |
| CC time | 1m 22s | 1m 19s |

### Key findings

**1. Function names carry the intent.** All three tools correctly mapped `sendBookingConfirmation` to the POST reservation handler and `sendCancellationNotice` to the DELETE handler — without being told. The function names are self-documenting enough for AI tools to infer the correct integration points.

**2. Trigger descriptions are not load-bearing for AI tools.** Removing them produced identical integration quality for booking and cancellation. The tools don't need "call this when a booking is created" — they figure it out from `sendBookingConfirmation`.

**3. "Missing code path" guidance IS load-bearing — for Cursor.** Without the explicit instruction "if there's no reschedule flow, don't create one," Cursor built one. CC and Windsurf independently decided not to. This matches Cursor's Phase 1 personality: it fills gaps aggressively. The deliverable should include explicit "do not create" instructions for message types whose triggers may not exist in the developer's app.

**4. The product playbook serves the developer, not the AI tool.** Trigger descriptions ("send when a booking is created") help the developer understand the integration. The AI tool already knows. The playbook is documentation, not instructions — and it should be framed that way in the deliverable.

**5. Tool personalities are remarkably consistent across experiments.**
- CC: careful, minimal, respects constraints, fastest with clear specs
- Cursor: fast, aggressive, builds more than asked, finds constraint loopholes
- Windsurf: thorough, correct on constraints, struggles with .env/gitignore, asks questions

---

## Phase 7: Round 8 — Non-Appointment App (E-Commerce)
### March 31, 2026

### What we tested

Does the module format generalize beyond appointments? This is a fundamentally different app architecture tested against a purpose-built e-commerce orders module.

### The test app: AtilMohAmine/nextjs-commerce

| Dimension | Appointment app | E-commerce app |
|-----------|----------------|----------------|
| User model | Yes (no phone) | No User model at all |
| Phone location | Nowhere / currentUser | Order model (checkout form) |
| Auth | NextAuth + sessions | None (guest checkout) |
| Key events | POST/DELETE API routes | PayPal API routes (create + capture) |
| Missing code path | Reschedule (no endpoint) | Shipping (no event) |
| Framework | Next.js 13, Prisma, MongoDB | Next.js 13, Prisma, MongoDB |

### The module: relaykit-sms-orders.js

Three exported functions for e-commerce:
- `sendOrderConfirmation(to, { orderId })` — confirms a completed order
- `sendShippingNotification(to, { orderId, trackingUrl })` — notifies about shipment
- `sendOrderReceived(to, { orderId })` — acknowledges order was placed

Same internal pattern as the appointments module — shared `_send()`, fire-and-forget, graceful failure.

### The prompt

Same Round 7 style — no trigger guidance, just function names and one-line descriptions. Tools must figure out where each function maps to in a codebase they've never seen.

### Key integration challenges

1. **Phone is on Order, not User.** There is no User model. Customer phone is collected at checkout and stored on the Order record. Tools must discover this.
2. **PayPal two-step flow.** Order creation (pending) and payment capture (paid) are separate events. Tools must distinguish "order received" from "order confirmed."
3. **Capture route doesn't have phone in the request.** Only `orderId` is passed. Tools must query the Order from the database to get the phone number.
4. **No shipping event.** The app has no shipping/fulfillment workflow. Tools must skip `sendShippingNotification` gracefully.
5. **CommonJS module in a TypeScript project.** The module is `.js` CommonJS; the app is TypeScript ESM. Tools must handle the interop.

### Round 8-A — Claude Code

**Time:** 1m 8s. Zero questions.

**Event mapping:**
- `sendOrderReceived` → POST `/api/paypal/createorder` (order placed, status pending) ✓
- `sendOrderConfirmation` → POST `/api/paypal/captureorder` (payment captured, status paid) ✓
- `sendShippingNotification` → skipped, documented in comments ✓

**Phone handling:** Used `phone` from request body on createorder (already destructured). On captureorder, queried `prisma.order.findFirst({ where: { orderId } })` to get `order.phone`. Correct — phone isn't in the capture request.

**CommonJS/ESM:** Created `src/lib/sms.ts` as a TypeScript wrapper that re-exports the CommonJS functions. Original module untouched.

**Adaptation:** Module file was named `relaykit-sms-orders.js` not `relaykit-sms.js` (prompt said the latter). CC noticed the discrepancy, adapted without asking.

**Result:** 14/14 passed.

### Round 8-B — Cursor

**Time:** ~2 minutes. Zero questions.

**Event mapping:**
- `sendOrderReceived` → createorder route ✓
- `sendOrderConfirmation` → captureorder route ✓
- `sendShippingNotification` → not wired directly ✓

**Phone handling:** Same pattern as CC — queried Order from DB on capture route. Correct.

**Extra work:** Created a `sendStatusTransitionSms()` helper that would automatically trigger shipping notification when a future status transition to "shipped" occurs with a tracking URL. This is unrequested but not a constraint violation — it's a utility function, not a new route or feature. Consistent with Cursor's "builds more than asked" personality.

**CommonJS/ESM:** Created typed TS wrapper with `path.join(process.cwd())` for module resolution.

**Result:** 14/14 passed.

### Round 8-C — Windsurf

**Time:** 3m 30s. Zero questions (stated .env issue but gave instructions instead of asking).

**Event mapping:**
- `sendOrderReceived` → createorder route ✓
- `sendOrderConfirmation` → captureorder route ✓
- `sendShippingNotification` → skipped with thorough justification ✓

**Phone handling:** Correct — queried Order on capture route.

**Shipping skip reasoning:** Most detailed of all tools. Explicitly listed three reasons: (1) no API routes besides PayPal, (2) Prisma Order model has no tracking/carrier/shipment fields, (3) no backend code transitions orders to shipped/fulfilled. This is the same thoroughness Windsurf showed in Phase 5 (repo report).

**CommonJS/ESM:** Used `createRequire(import.meta.url)` — a different approach than CC or Cursor, but equally valid.

**.env:** Same gitignore restriction as all previous Windsurf rounds. Told the user what to add manually instead of asking.

**Result:** 13/14. Only failure: .env creation (tool limitation).

### Round 8 — Cross-Tool Comparison

| Behavior | Claude Code | Cursor | Windsurf |
|----------|-----------|--------|----------|
| Mapped received → createorder | ✓ | ✓ | ✓ |
| Mapped confirmation → captureorder | ✓ | ✓ | ✓ |
| Skipped shipping (no event) | ✓ | ✓ | ✓ |
| Phone from Order model (not User) | ✓ | ✓ | ✓ |
| DB query on capture for phone | ✓ | ✓ | ✓ |
| Correct received vs confirmed semantics | ✓ | ✓ | ✓ |
| CommonJS/ESM handled | ✓ (wrapper) | ✓ (wrapper) | ✓ (createRequire) |
| Module unmodified | ✓ | ✓ | ✓ |
| .env created | ✓ | ✓ | ✗ |
| Questions asked | 0 | 0 | 0 |

### Key findings

**1. The module format generalizes across verticals.** Different app, different data model, different auth pattern, different payment architecture — all three tools found the correct integration points, navigated the phone-on-Order pattern, and correctly distinguished "order received" from "order confirmed."

**2. AI tools navigate payment callback flows correctly.** The PayPal two-step flow (create then capture) is semantically more complex than simple CRUD. All three tools understood that "order confirmation" maps to payment capture, not order creation. This was never stated in the prompt — the function names carried the intent.

**3. Phone-on-Order is handled as naturally as phone-on-User.** All tools queried the Order model from the database when the capture route didn't have phone in the request. This is the same fetch-before-action pattern they used for fetch-before-delete in the appointment app. The pattern transfers across data models.

**4. "Missing shipping event" handled identically to "missing reschedule."** All three tools recognized there's no shipping workflow and didn't create one. Windsurf provided the most detailed justification. Cursor prepared a helper for future use. CC documented it in comments. The missing-code-path pattern is consistent across verticals.

**5. CommonJS/ESM interop is a universal challenge.** All three tools needed to bridge CommonJS (the module) into TypeScript ESM (the app). Each used a different approach — all valid. This suggests the production module should ship as ESM with TypeScript declarations, or the SDK should handle this natively.

**6. Tool personalities hold across app architectures.**
- CC: fastest (1m 8s), minimal, correct
- Cursor: builds extras (status transition helper), correct
- Windsurf: most thorough documentation, .env blocked, correct

---

## Phase 8: Round 3 — Consent Form Integration
### March 31, 2026

### What we tested

Can AI tools add a TCPA-compliant SMS consent checkbox to an existing registration form, wire it to a consent API, AND integrate SMS sending — all in a single pass? This is the first experiment that requires UI changes. All previous experiments prohibited UI modification.

### Why this matters

A developer can't use SMS in production without consent collection. If the AI tool can't add a compliant consent form, the developer hits a wall after sandbox testing. This is load-bearing for the product.

### The setup

Two modules in the project root:
- `relaykit-sms.js` — appointments SMS (sendBookingConfirmation, sendCancellationNotice, sendRescheduleConfirmation)
- `relaykit-consent.js` — consent collection (recordConsent, checkConsent)

The prompt explicitly grants scoped UI permission: "You MAY modify UI files for the registration form (step 2 only). Do NOT modify any other UI files."

### What the tools had to do (6 tasks in one pass)

1. Add phone field to User model
2. Add phone input + consent checkbox to registration form (with TCPA disclosure, unchecked default, conditional phone requirement)
3. Wire recordConsent() in registration API handler
4. Wire sendBookingConfirmation in booking creation
5. Wire sendCancellationNotice in cancellation
6. Create .env with API key and business name

### Round 3-A — Claude Code

**Time:** 2m 51s. Zero questions.

**Consent UI:** Phone input (type="tel") + checkbox with correct disclosure text. Used `useWatch` from react-hook-form to reactively track checkbox state, making phone `required={smsConsent}`. Checkbox unchecked by default.

**Consent backend:** recordConsent() called conditionally — only when both phone and smsConsent provided. Phone saved to User record with spread operator: `...(phone && smsConsent ? { phone } : {})`.

**SMS integration:** Both booking and cancellation wired correctly. Fetch-before-delete for cancellation. Fire-and-forget.

**Scoped UI permission:** Only RegisterModal.tsx modified. No other UI files touched.

**Extra work:** Verified getCurrentUser() returns phone automatically (spreads all Prisma fields). Attempted `prisma generate` (failed due to environment mismatch, not a code issue).

**Result:** 18/18 passed.

### Round 3-B — Cursor

**Time:** ~2 minutes. Zero questions.

**Consent UI:** Same pattern — phone input + checkbox with disclosure. Conditional requirement with `required={!!smsConsent}`. Checkbox unchecked by default.

**Consent backend:** recordConsent() called correctly. Server-side validation: if consent checked, phone must be present.

**Cancellation refactor:** Rewrote cancellation handler from `deleteMany` to `findUnique` → manual auth check → `delete` → SMS. Arguably cleaner than CC's approach of adding a separate findUnique before deleteMany.

**Disclosure text:** Showed both `TestBusiness` (hardcoded) and `[business name]` (template) — minor inconsistency in the output but disclosure content is complete.

**Result:** 18/18 passed.

### Round 3-C — Windsurf

**Time:** ~3m 30s. Zero questions. **.env created successfully** — first perfect Windsurf score in the entire experiment series. Enabled "Allow Cascade Access to Gitignore Files" setting before this round, which resolved the persistent .env creation failure from all previous Windsurf rounds.

**Consent UI:** Phone input + checkbox with disclosure. Conditional requirement. Checkbox unchecked by default. Same implementation pattern as CC and Cursor.

**Consent backend:** recordConsent() called with correct parameters. Conditional on both smsConsent and phone.

**SMS integration:** Both booking and cancellation wired correctly. Fire-and-forget.

**Result:** 18/18 passed.

### Round 3 — Cross-Tool Comparison

| Behavior | Claude Code | Cursor | Windsurf |
|----------|-----------|--------|----------|
| Phone input added | ✓ | ✓ | ✓ |
| Checkbox unchecked default | ✓ | ✓ | ✓ |
| TCPA disclosure text | ✓ | ✓ | ✓ |
| Conditional phone requirement | ✓ (useWatch) | ✓ (!!smsConsent) | ✓ (!!smsConsent) |
| recordConsent() wired | ✓ | ✓ | ✓ |
| Only registration form UI modified | ✓ | ✓ | ✓ |
| SMS booking wired | ✓ | ✓ | ✓ |
| SMS cancellation wired | ✓ | ✓ | ✓ |
| .env created | ✓ | ✓ | ✓ |
| Questions asked | 0 | 0 | 0 |

### Key findings

**1. Consent form integration works perfectly across all tools.** Every tool added a TCPA-compliant checkbox with correct disclosure text, conditional phone validation, and consent API wiring — in a single pass alongside SMS integration. This was the last untested piece of the core integration loop.

**2. Scoped UI permissions work.** "You MAY modify this form, do NOT modify others" was respected by all three tools. This is important for the production deliverable — it means the module can include consent form instructions that are scoped to specific pages without tools making changes elsewhere.

**3. The two-module pattern works.** Consent module + SMS module in the same project, wired in a single prompt. The tools handled both imports, both API patterns, and the data flow between them (phone collected via consent → stored on User → used for SMS) without confusion.

**4. Windsurf's .env problem was a settings issue, not a fundamental limitation.** Enabling "Allow Cascade Access to Gitignore Files" resolved it completely. All previous Windsurf .env failures should be attributed to default tool settings, not tool capability. In production, RelayKit's setup instructions should note this setting for Windsurf users.

**5. The full integration loop is validated.** A developer can now go from zero to: consent collection + consent recording + booking SMS + cancellation SMS — from two module files and one prompt. All three tools complete it in under 4 minutes with zero questions.

---

## Phase 9: Round 12 — SDK Prototype
### March 31, 2026

### What we tested

Does the SDK format (installed npm package, class instantiation, namespaced methods) produce equivalent results to the working module format that scored 17/17? The SDK adds layers over the flat module: package resolution, constructor instantiation, namespace navigation. This experiment tests whether those layers degrade performance or confuse AI tools.

### The mock SDK: `node_modules/relaykit`

A local package simulating `npm install relaykit`. Three files:
- `index.js` — Full SDK: `RelayKit` class with 8 vertical namespaces (`appointments`, `orders`, `verification`, `support`, `marketing`, `internal`, `community`, `waitlist`), top-level consent functions (`recordConsent`, `checkConsent`, `revokeConsent`), direct `send()` escape hatch, and shared internal `_send()` with graceful failure.
- `index.d.ts` — TypeScript declarations for all namespaces and functions.
- `package.json` — Package metadata.

Key design features:
- Zero-config: `new RelayKit()` reads `RELAYKIT_API_KEY` and `BUSINESS_NAME` from `process.env`
- Per-vertical namespaces: `relaykit.appointments.sendConfirmation(phone, { date, time })`
- Graceful failure: returns null + console warning when phone missing or API key not set
- Same `_send()` pattern as experiment modules — fire-and-forget by default

### The prompt

```
This app uses the RelayKit SDK for SMS messaging. The SDK is already 
installed (node_modules/relaykit). 

Read node_modules/relaykit/index.js to understand the available functions.

Then integrate it into this app:

1. Initialize RelayKit in the app's configuration or where other 
   services are initialized.

2. Find where bookings are created and send a confirmation SMS.

3. Find where bookings are cancelled and send a cancellation SMS.

4. If there's a reschedule flow, send a reschedule SMS. If not, 
   skip it and note it's available.

5. Add RELAYKIT_API_KEY=rk_sandbox_test_abc123xyz to the .env file.

6. Add BUSINESS_NAME=TestBusiness to the .env file.

Rules:
- Backend only. Do not modify any files that render UI (anything in 
  /components, anything that returns JSX/TSX, any .css files). If a 
  file contains both server logic and UI rendering, only modify the 
  server logic portion.
- Do not add features, pages, routes, or UI elements that don't 
  already exist.
- Do not install any npm packages.
- Make reasonable decisions and proceed. Document assumptions in code 
  comments. Do not ask questions.
```

### Grading checklist (20 items)

Items 1–17: same as Round 1B module experiments. Items 18–20: SDK-specific.
- 18: RelayKit instantiated with constructor (`new RelayKit()` or `new RelayKit({ ... })`)
- 19: Namespace pattern used correctly (`relaykit.appointments.sendConfirmation()`, not flat)
- 20: Zero-config: reads API key from process.env (not hardcoded in constructor)

### Round 12-A — Claude Code + Appointment-Booking-System

**Time:** 2m 46s. Zero questions.

**Integration point discovery:**
- Found `app/api/reservations/route.ts` (POST) — booking creation ✓
- Found `app/api/reservations/[reservationId]/route.ts` (DELETE) — cancellation ✓
- Confirmed no reschedule flow — noted SDK's `sendReschedule` is available ✓

**SDK usage:**
- Import: `const RelayKit = require('relaykit');`
- Initialization: Created `app/libs/relaykit.ts` — singleton pattern matching app's existing `prismadb.ts`. `const relaykit = globalThis.relaykit || new RelayKit();` with hot-reload guard.
- Confirmation call: `relaykit.appointments.sendConfirmation(userPhone, { date, time })`
- Cancellation call: `relaykit.appointments.sendCancellation(userPhone, { date })`

**Phone number handling:** `(currentUser as any).phone` — recognized User model has no phone field, documented that RelayKit returns null when phone is falsy.

**Cancellation pattern:** Fetched reservation details with user before deletion (fetch-before-delete), same pattern as all previous experiments.

**Config approach:** Zero-config. `new RelayKit()` with no arguments. Reads from process.env.

**Files created:** `app/libs/relaykit.ts` (12 lines), `.env`
**Files modified:** `app/api/reservations/route.ts`, `app/api/reservations/[reservationId]/route.ts`

**Result:** 20/20 passed.

### Round 12-B — Windsurf + Appointment-Booking-System

**Note:** Cursor skipped due to free tier usage limit. CC + Windsurf cover both ends of the tool personality spectrum (careful minimalist vs. thorough documenter).

**Time:** ~5 minutes. **1 question asked** — Windsurf tried to batch-read `node_modules/relaykit/index.js` and `relaykit-sms.js` (nonexistent file from previous experiments). The batch read failed, and Windsurf presented three options to the user. After recovering, it proceeded correctly.

**Integration point discovery:**
- Found POST create route ✓
- Found DELETE cancel route ✓
- Confirmed no reschedule flow ✓

**SDK usage:**
- Import: `const RelayKit = require('relaykit');`
- Initialization: Created `app/libs/relaykit.ts` — singleton pattern (69 lines vs. CC's 12). Included helper wrapper functions (`sendReservationConfirmationSMS`, `sendReservationCancellationSMS`) that encapsulate the namespace calls.
- Confirmation call: `relaykit.appointments.sendConfirmation(phone, { date, time })` (inside wrapper)
- Cancellation call: `relaykit.appointments.sendCancellation(phone, { date })` (inside wrapper)

**Phone number handling:** Tried multiple field names (`phone`, `phoneNumber`, `mobile`) on user object. RelayKit skips gracefully if all are null.

**Cancellation pattern:** Fetched reservation details before deletion using `findFirst` with same authorization constraints.

**Config approach:** Zero-config. `new RelayKit()` with no arguments.

**Files created:** `app/libs/relaykit.ts` (69 lines), `.env`
**Files modified:** `app/api/reservations/route.ts`, `app/api/reservations/[reservationId]/route.ts`

**Result:** 19/20 passed. Failure: item 13 (asked a question due to nonexistent file read, not SDK comprehension).

### Round 12 — Cross-Tool Comparison

| Behavior | Claude Code | Windsurf |
|----------|-----------|----------|
| Found create route (POST) | Yes | Yes |
| Found delete route (DELETE) | Yes | Yes |
| Identified missing reschedule | Yes | Yes |
| `new RelayKit()` constructor | Yes | Yes |
| Namespace: `relaykit.appointments.*` | Yes | Yes |
| Zero-config (reads from env) | Yes | Yes |
| Singleton pattern (mirrors prismadb.ts) | Yes | Yes |
| Module files unmodified | Yes | Yes |
| Fire-and-forget calls | Yes | Yes |
| .env created | Yes | Yes |
| Questions asked | 0 | 1 (file read failure) |
| Time | 2m 46s | ~5m |
| Wrapper abstraction | Minimal (12 lines) | Extensive (69 lines) |

### Round 12 vs. Round 1B (Module) Comparison

| Metric | Round 1B Module | Round 12 SDK |
|--------|----------------|-------------|
| CC time | 1m 22s | 2m 46s |
| CC score | 17/17 | 20/20 |
| Windsurf score | 15/17 | 19/20 |
| Import pattern | `require('./relaykit-sms')` | `require('relaykit')` + `new RelayKit()` |
| Function call | `sendBookingConfirmation(phone, data)` | `relaykit.appointments.sendConfirmation(phone, data)` |
| Decisions by tool | ~3 (import, find events, map data) | ~4 (import, init, find events, map data) |
| Wrapper created by tool | No | CC: minimal singleton; Windsurf: full helper layer |

**CC was slower** (2m46s vs. 1m22s) — the additional time was spent on codebase exploration (71 tool uses in the explore phase). The SDK itself didn't add friction; CC read it quickly and used it correctly. The time increase is attributable to CC's more thorough codebase scan, not to SDK complexity.

### Key findings

**1. The namespace pattern works perfectly.** Both tools used `relaykit.appointments.sendConfirmation()` and `relaykit.appointments.sendCancellation()` without hesitation. Neither attempted flat calls. The namespace was self-evident from reading `index.js`.

**2. Zero-config is the natural path.** Both tools used `new RelayKit()` with no arguments, relying on `process.env`. This matches the .env creation pattern every tool naturally follows. No tool tried to hardcode the API key in the constructor.

**3. The singleton pattern transfers from the app's existing architecture.** Both tools created `app/libs/relaykit.ts` mirroring the app's `prismadb.ts` singleton pattern. The SDK's class-based design invited this — tools recognized it as a service to initialize once and import everywhere.

**4. SDK adds one decision over the module format.** With the module, tools made ~3 decisions (import, find events, map data). With the SDK, they make ~4 (import, initialize, find events, map data). The initialization step is trivial and didn't cause any confusion.

**5. Windsurf's question was about a ghost, not the SDK.** Windsurf tried to read `relaykit-sms.js` (from previous experiments) alongside the SDK. When the file didn't exist, the batch read failed. This is a Windsurf behavior pattern (batching reads), not an SDK design issue. After recovery, Windsurf used the SDK correctly.

**6. Tool personalities hold in the SDK format.** CC: minimal, fast, correct. Windsurf: thorough, creates abstractions, documents extensively. Same patterns as all previous rounds. The SDK didn't change tool behavior — it was absorbed naturally into each tool's existing style.

---

## What to Test Next

### Round 10 — Real API endpoint
Replace the sandbox mock URL with a real RelayKit sandbox endpoint. Tests end-to-end message validation, not just code generation. Requires Sinch sandbox integration.

### Round 12B — SDK + Consent (protocol written, not yet run)
Tests `relaykit.recordConsent()` (top-level) alongside `relaykit.appointments.sendConfirmation()` (namespaced) in a single prompt. Protocol and 24-item checklist exist in `EXPERIMENT_ROUND_12B.md`. Evidence from Round 12 + Round 3 strongly suggests this would pass — both patterns individually validated. Run if needed to confirm the mixed API style.

---

## Appendix: Spec/Module Versions

### SMS_BUILD_SPEC.md v1
Used in Rounds 1, 5, 6A, 6B. Single message type with narrow constraints.

### SMS_BUILD_SPEC.md v2
Used in Rounds 7A, 7B, 7C. Single message type with absolute constraints and explicit guidance.

### SMS_BUILD_SPEC_R2.md
Used in Rounds 2A, 2B, 2C. Three message types (create, cancel, reschedule) with shared utility requirement and missing-code-path instructions.

### relaykit-sms.js (Module)
Used in Rounds 1B-A, 1B-B, 1B-C, 7-A, 7-B, 7-C. Pre-built JavaScript module exporting three functions wrapping the RelayKit API. Shared internal `_send()` with error handling, auth, and graceful failure. In Round 7, used with no trigger guidance — tools received only function names and one-line descriptions.

### relaykit-sms-orders.js (Orders Module)
Used in Rounds 8-A, 8-B, 8-C. Pre-built JavaScript module for e-commerce: `sendOrderConfirmation`, `sendShippingNotification`, `sendOrderReceived`. Same `_send()` pattern as appointments module. Tests format generalization across verticals.

### relaykit-consent.js (Consent Module)
Used in Rounds 3-A, 3-B, 3-C. Consent collection module: `recordConsent({ phone, consentType, source })` and `checkConsent(phone)`. Used alongside relaykit-sms.js to test the full integration loop (consent + messaging in one pass).

### node_modules/relaykit (SDK Mock Package)
Used in Rounds 12-A, 12-B. Mock npm package simulating `npm install relaykit`. Full SDK with `RelayKit` class: 8 vertical namespaces (appointments, orders, verification, support, marketing, internal, community, waitlist), top-level consent functions (recordConsent, checkConsent, revokeConsent), direct `send()` escape hatch. Zero-config init reads from `process.env`. Same `_send()` pattern as experiment modules. Includes TypeScript declarations (`index.d.ts`).

---

## Appendix: Round Index

| Round | Tool | App | Spec/Model | Triggers | Result |
|-------|------|-----|------------|----------|--------|
| 1 | Claude Code | KillyBarbershop | v1 spec | 1 (create) | Pass (8/8) |
| 5 | Claude Code | Appt-Booking-System | v1 spec | 1 (create) | Pass (8/8), 2 questions |
| 6A | Cursor | Appt-Booking-System | v1 spec | 1 (create) | **Fail** (7/8) — UI violation |
| 6B | Windsurf | Appt-Booking-System | v1 spec | 1 (create) | **Fail** (7/8) — UI + scope creep |
| 7A | Claude Code | Appt-Booking-System | v2 spec | 1 (create) | Pass (9/9) |
| 7B | Cursor | Appt-Booking-System | v2 spec | 1 (create) | Pass (9/9) |
| 7C | Windsurf | Appt-Booking-System | v2 spec | 1 (create) | Pass (9/9), 1 question |
| 2A | Claude Code | Appt-Booking-System | R2 spec | 3 (create, cancel, reschedule*) | Pass (13/13) |
| 2B | Cursor | Appt-Booking-System | R2 spec | 3 (create, cancel, reschedule*) | Pass (13/13) |
| 2C | Windsurf | Appt-Booking-System | R2 spec | 3 (create, cancel, reschedule*) | Pass (13/13), 1 question |
| 1B-A | Claude Code | Appt-Booking-System | Module | 3 (create, cancel, reschedule*) | Pass (17/17) |
| 1B-B | Cursor | Appt-Booking-System | Module | 3 (create, cancel, reschedule*) | Pass (17/17) |
| 1B-C | Windsurf | Appt-Booking-System | Module | 3 (create, cancel, reschedule*) | 15/17, 2 questions |
| 11-A | Claude Code | Appt-Booking-System | Repo report | Analysis only | Pass (13/13 accuracy) |
| 11-B | Cursor (×3) | Appt-Booking-System | Repo report | Analysis only | **Fail** — phone hallucination (3×) |
| 11-C | Windsurf | Appt-Booking-System | Repo report | Analysis only | Pass (13/13 accuracy) |
| 7-A | Claude Code | Appt-Booking-System | Module (no triggers) | 3 (inferred) | Pass (14/14) |
| 7-B | Cursor | Appt-Booking-System | Module (no triggers) | 3 (inferred) | 12/14 — built PUT handler |
| 7-C | Windsurf | Appt-Booking-System | Module (no triggers) | 3 (inferred) | 12/14 — .env blocked, questions |
| 8-A | Claude Code | nextjs-commerce | Orders module (no triggers) | 3 (inferred) | Pass (14/14) |
| 8-B | Cursor | nextjs-commerce | Orders module (no triggers) | 3 (inferred) | Pass (14/14) |
| 8-C | Windsurf | nextjs-commerce | Orders module (no triggers) | 3 (inferred) | 13/14 — .env blocked |
| 3-A | Claude Code | Appt-Booking-System | Consent + SMS modules | 6 tasks (consent + SMS) | Pass (18/18) |
| 3-B | Cursor | Appt-Booking-System | Consent + SMS modules | 6 tasks (consent + SMS) | Pass (18/18) |
| 3-C | Windsurf | Appt-Booking-System | Consent + SMS modules | 6 tasks (consent + SMS) | Pass (18/18) |
| 12-A | Claude Code | Appt-Booking-System | SDK (npm package) | 3 (create, cancel, reschedule*) | Pass (20/20) |
| 12-B | Windsurf | Appt-Booking-System | SDK (npm package) | 3 (create, cancel, reschedule*) | 19/20, 1 question |

*Appointment app: Reschedule trigger does not exist — CC and Windsurf correctly skipped; Cursor created a PUT handler (Round 7 only).
*E-commerce app: Shipping event does not exist — all tools correctly skipped.
*Round 3-C: Windsurf .env setting enabled before this round, resolving all previous .env failures.
*Round 12: Cursor skipped (free tier limit). SDK installed as local package in node_modules/relaykit.

---

## Appendix: Experiment Metadata

| Field | Value |
|-------|-------|
| Phase 1–3 date | March 29, 2026 |
| Phase 4–5 date | March 30, 2026 |
| Phase 6–8 date | March 31, 2026 |
| Phase 9 date | March 31, 2026 |
| Experimenter | Joel Natkin (RelayKit founder) |
| Total experiment time | ~10 hours including setup, tool installation, spec iteration, SDK design |
| Spec writing time | ~10 min (v1), ~15 min (v2), ~20 min (R2) |
| Module writing time | ~15 min (relaykit-sms.js), ~15 min (relaykit-sms-orders.js), ~15 min (relaykit-consent.js) |
| SDK design + build time | ~2 hours (architecture design, mock package, TypeScript declarations) |
| Repo report prompt writing time | ~15 min |
| Total rounds | 27 (24 integration, 3 analysis) |
| Cursor hallucination retries | 3 (all failed on same field) |
| Tools installed for first time during experiment | Cursor, Windsurf (Phase 1) |
| Apps cloned from GitHub | KillyBarbershop, Appointment-Booking-System*, nextjs-commerce |
| Fresh clones performed | 27 (one per round, excluding Cursor hallucination retries) |
| Windsurf .env setting fix | Enabled "Allow Cascade Access to Gitignore Files" before Round 3-C |
| Appointment-Booking-System repo | Original (Deia-ElDin) taken down; replaced with identical fork (adityayaduvanshi) for Phase 9 |

---

*This log follows the recording format specified in BUILD_SPEC_VALIDATION_FRAMEWORK.md and is intended as a reference document for PRD_05 (Deliverable Generator) development.*
