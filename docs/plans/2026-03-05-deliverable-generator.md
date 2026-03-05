# Deliverable Generator Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the full three-document deliverable lifecycle from PRD_05: SMS_BUILD_SPEC.md (sandbox), SMS_GUIDELINES.md (sandbox + production editions), and MESSAGING_SETUP.md (post-registration). Refactor existing inline-template generators into proper template-string + generator separation per PRD_05 Section 9 file structure.

**Architecture:** Each document has a template string file (the markdown with `{placeholders}`) and a generator file (the function that interpolates data into the template). Guidelines share a single `guidelines-generator.ts` with an `edition` parameter selecting between two separate template files. The `sendSMS()` function signature is identical across SMS_BUILD_SPEC.md and MESSAGING_SETUP.md — a developer changes one env var and their app works in production (PRD_05 Trap #6).

**Tech Stack:** TypeScript, Next.js App Router API routes, Supabase (registrations table with `canon_messages` JSONB), deterministic string interpolation (D-04).

**Key decisions:**
- D-04: Deterministic string interpolation, no AI
- D-07: MESSAGING_SETUP.md template is canonical in PRD_05 Section 3.1
- D-40: Three-document lifecycle
- D-42: `generateArtifacts()` selects exactly 3 messages for TCR; `getMessageTemplates()` returns full library

**PRD_05 Traps (implementation guardrails):**
1. Build spec is the primary sandbox deliverable, not an afterthought
2. No AI generation for any document — all string interpolation
3. Don't duplicate MESSAGING_SETUP.md template — canonical home is PRD_05 Section 3.1
4. Sandbox SMS_GUIDELINES.md is a separate template, NOT production-minus-sections
5. Canon messages are NOT in the build spec — only in production docs
6. Code structure (sendSMS signature, error codes, API URL) must be identical between build spec and MESSAGING_SETUP.md

---

## PRD_05 Section 9 Target File Structure

```
src/lib/deliverable/
  build-spec-template.ts         # SMS_BUILD_SPEC.md template string
  build-spec-generator.ts        # generateBuildSpec() — sandbox build spec
  guidelines-template-sandbox.ts # Sandbox SMS_GUIDELINES.md template string
  guidelines-template-prod.ts    # Production SMS_GUIDELINES.md template string
  guidelines-generator.ts        # generateGuidelines(input, edition) — both editions
  canon-messages.ts              # Canon message rendering for production docs
  use-case-tips.ts               # Per-use-case compliance tips (PRD_05 Section 7)
  template-relaykit.ts           # MESSAGING_SETUP.md template string (PRD_05 Section 3.1)
  generator.ts                   # generateMessagingSetup() — post-registration
  index.ts                       # Barrel exports
```

## Existing Code to Refactor

| File | Current state | Action |
|------|--------------|--------|
| `src/lib/deliverable/build-spec-generator.ts` | Template string inline in generator function | Extract template to `build-spec-template.ts`, refactor generator to import it |
| `src/lib/deliverable/sandbox-guidelines.ts` | Template string inline in generator function | Replace with `guidelines-template-sandbox.ts` + `guidelines-generator.ts` |
| `src/app/api/build-spec/route.ts` | Imports from old file names | Update imports after refactor |

---

## Task 1: Shared utilities — canon message renderer + use-case tips

Two independent files with no dependencies. Build these first since both production generators need them.

**Files:**
- Create: `src/lib/deliverable/canon-messages.ts`
- Create: `src/lib/deliverable/use-case-tips.ts`

### canon-messages.ts

Takes a `CanonMessage[]` array (from `registrations.canon_messages` JSONB, per D-13) and renders the markdown section used in both MESSAGING_SETUP.md and production SMS_GUIDELINES.md.

```typescript
export interface CanonMessage {
  template_id: string;
  category: string;
  text: string;
  trigger: string;
  variables: string[];
  is_expansion: boolean;
}

export function renderCanonMessagesSection(messages: CanonMessage[]): string
```

Output format per message (same shape as build spec's "What your app sends" — Trap #6):

```markdown
### {category}: {trigger}

{text}

Variables: {variable_list}
When to send: {trigger}
```

### use-case-tips.ts

```typescript
import type { UseCaseId } from "@/lib/intake/use-case-data";

export const USE_CASE_TIPS: Record<UseCaseId, string>
```

Values from PRD_05 Section 7 (RelayKit API edition):

| Use case | Tip |
|----------|-----|
| `appointments` | "RelayKit enforces quiet hours automatically — schedule sends any time and the API will block if outside 9am–9pm for the recipient." |
| `orders` | "Delivery update frequency can spike during shipping — RelayKit's rate limiter accounts for transactional message patterns." |
| `verification` | "OTP messages don't require opt-out language per CTIA guidelines. RelayKit won't flag these." |
| `support` | "Two-way support conversations don't require opt-out language in every reply. First message in a new conversation should include it." |
| `marketing` | "Marketing messages are subject to quiet hours (enforced automatically by RelayKit). Every marketing message must include opt-out language." |
| `internal` | "Team messages follow the same compliance rules. Recipients must opt in, even if they're employees." |
| `community` | "Group messages to large lists should be staggered. RelayKit handles queuing automatically." |
| `waitlist` | "Waitlist confirmations are time-sensitive — RelayKit prioritizes these over non-urgent messages in the queue." |
| `exploring` | "Start with a focused use case. RelayKit's sandbox lets you test each message type before committing to a registration." |

**Commit:** `feat: canon message renderer + use-case compliance tips`

---

## Task 2: Build spec template + generator refactor

Refactors the existing `build-spec-generator.ts` (which has the template inline) into two files matching PRD_05 Section 9. This is the primary sandbox deliverable — the document that creates developer investment before payment (D-41).

**Files:**
- Create: `src/lib/deliverable/build-spec-template.ts`
- Rewrite: `src/lib/deliverable/build-spec-generator.ts`

### build-spec-template.ts

The SMS_BUILD_SPEC.md template string from PRD_05 Section 2.1, exported as a const. Contains `{placeholders}` for:
- `{app_name_or_use_case}`, `{date}`, `{rk_sandbox_key}`
- `{messages_section}` — rendered enabled messages from plan builder
- `{triggers_section}` — per-message trigger list
- `{use_case_tip}` — from use-case-tips.ts (Task 1)

The "What to build" section is static template text — the sendSMS() signature, webhook handler, opt-in form, and error handling are hardcoded in the template because they are identical for all use cases and must match MESSAGING_SETUP.md exactly (Trap #6).

Shared sendSMS() block (identical in both templates):

```markdown
### 1. Utility function: sendSMS()
Create a reusable function that sends messages through the RelayKit API:
- POST to ${RELAYKIT_API_URL}/messages
- Headers: Authorization: Bearer ${RELAYKIT_API_KEY}, Content-Type: application/json
- Body: { "to": recipientPhone, "body": messageText }
- Handle errors: check response status, parse error codes (see SMS_GUIDELINES.md)
```

Shared error codes block (build spec has 4 codes, MESSAGING_SETUP.md adds `content_drift_detected`):

```markdown
- recipient_opted_out (422): Recipient has opted out. Do not retry.
- content_prohibited (422): Message contains prohibited content. See error detail.
- quiet_hours_violation (422): Outside allowed sending hours. Queue for morning.
- rate_limited (429): Too many requests. Implement backoff.
```

### build-spec-generator.ts

Refactored `generateBuildSpec()` that imports the template from `build-spec-template.ts` and interpolates:

```typescript
import type { MessagePlanEntry } from "@/lib/dashboard/message-plan-types";
import type { UseCaseId } from "@/lib/intake/use-case-data";
import { BUILD_SPEC_TEMPLATE } from "./build-spec-template";
import { USE_CASE_TIPS } from "./use-case-tips";

export interface BuildSpecInput {
  useCase: UseCaseId;
  sandboxApiKey: string;
  businessName?: string;
  messages: MessagePlanEntry[];
}

export function generateBuildSpec(input: BuildSpecInput): string
```

The `BuildSpecInput` interface is unchanged from the existing code. The function filters enabled messages, renders `messagesSection` and `triggersSection` the same way, then replaces placeholders in the imported template string.

**Important:** Messages in the build spec are the developer's selected/edited templates from the plan builder — NOT canon messages. Canon messages don't exist until registration (Trap #5).

**Verify:** `POST /api/build-spec` route still works after refactor — same function signature, same imports (update import path if needed).

**Commit:** `refactor: extract build spec template string, add use-case tip`

---

## Task 3: Sandbox SMS_GUIDELINES.md template + guidelines generator

Replaces the existing `sandbox-guidelines.ts` (inline template) with two files: a template string and a unified generator that handles both editions.

**Files:**
- Create: `src/lib/deliverable/guidelines-template-sandbox.ts`
- Create: `src/lib/deliverable/guidelines-generator.ts`
- Delete: `src/lib/deliverable/sandbox-guidelines.ts`
- Modify: `src/app/api/build-spec/route.ts` — update import

### guidelines-template-sandbox.ts

The sandbox SMS_GUIDELINES.md template string. Framing: "These are the compliance rules for your use case" — NOT "your registered requirements" (they haven't registered yet).

Placeholders: `{business_name}`, `{use_case_label}`, `{approved_message_types}`, `{not_approved_content}`, `{message_frequency}`, `{use_case_tip}`

**Sections (from PRD_05 Section 4.2):**
1. Header: "Your Use Case: {use_case_label}" (not "Your Registration")
2. Approved message types
3. Not approved for this use case
4. Message frequency
5. Hard rules (5 rules — identical content shared with production)
6. Best practices (message frequency, length, sending patterns, content quality — identical content shared with production)
7. Consent collection requirements (8 items — privacy/terms links use placeholder: "Add links to your privacy policy and terms of service")
8. Quick reference (Q&A — sandbox framing: "Your use case is..." not "Your campaign is registered as...")
9. Getting help (dashboard link only, no compliance site URL)

**What it excludes** (production-only):
- Canon messages section
- "What RelayKit Handles Automatically" section
- Drift detection rules
- Compliance site URL references
- Message preview/validation guidance
- Live credentials

### guidelines-generator.ts

Unified generator with edition parameter:

```typescript
import type { UseCaseId } from "@/lib/intake/use-case-data";
import type { CanonMessage } from "./canon-messages";

export interface GuidelinesInput {
  use_case: UseCaseId;
  business_name?: string;              // Optional in sandbox, required in production
  business_description?: string;       // Triggers vertical detection
  phone_number?: string;               // Production only
  registration_date?: string;          // Production only
  canon_messages?: CanonMessage[];     // Production only
  compliance_site_url?: string;        // Production only
  approved_message_types?: string;     // Override from registration data, or fallback
  not_approved_content?: string;       // Override from registration data, or fallback
  message_frequency?: string;          // Override or fallback
  rate_limit_tier?: string;            // Production only
}

export function generateGuidelines(
  input: GuidelinesInput,
  edition: "sandbox" | "production"
): string
```

Logic:
1. Select template based on `edition` param (sandbox vs production template)
2. Resolve `approved_message_types`, `not_approved_content`, `message_frequency` — use input overrides if provided, otherwise fall back to `APPROVED_MESSAGE_TYPES[useCase]`, `NOT_APPROVED_CONTENT[useCase]`, `USE_CASE_FREQUENCIES[useCase]` from template engine constants
3. Interpolate all placeholders
4. If `businessDescription` provided, call `detectVerticals()` + `assembleGuidelines()` to inject vertical modules (same pattern as existing code)
5. Return rendered markdown

**Update `src/app/api/build-spec/route.ts`:** Change import from `generateSandboxGuidelines` to `generateGuidelines(input, "sandbox")`. Same data flow, just new function signature.

**Commit:** `refactor: sandbox guidelines template + unified guidelines generator`

---

## Task 4: Production SMS_GUIDELINES.md template

The production counterpart to the sandbox template. Separate template, NOT sandbox-minus-sections (Trap #4). Different framing, additional sections.

**Files:**
- Create: `src/lib/deliverable/guidelines-template-prod.ts`

### guidelines-template-prod.ts

Placeholders: `{business_name}`, `{use_case_label}`, `{phone_number}`, `{registration_date}`, `{approved_message_types}`, `{not_approved_content}`, `{message_frequency}`, `{canon_messages_section}`, `{compliance_site_url}`, `{rate_limit_tier}`, `{use_case_tip}`

**Sections (from PRD_05 Section 4.3):**
1. Header: "Your Registration" — business name, registered use case, phone number, approved message types, approved frequency, registration date
2. Canon messages — `{canon_messages_section}` from `renderCanonMessagesSection()`
3. Approved message types (same content as sandbox, but framed as "registered scope")
4. Not approved for this registration
5. Message frequency
6. Hard rules (identical 5 rules — same text as sandbox template)
7. Best practices (identical — same text as sandbox template)
8. Validating new messages — POST /v1/messages/preview guidance, verdicts (pass/warning/fail)
9. What RelayKit handles automatically — opt-out enforcement, quiet hours, content scanning, rate limiting, drift detection
10. Drift detection rules — what constitutes drift, what gets flagged vs blocked
11. Consent collection requirements (8 items — updated with compliance site URL: `{compliance_site_url}/privacy`, `{compliance_site_url}/terms`)
12. Production error handling — 5 error codes (adds `content_drift_detected` over sandbox's 4)
13. Quick reference (Q&A — production framing: "Your campaign is registered as...")
14. Getting help (dashboard link + compliance site URL)

**No new generator code** — `guidelines-generator.ts` from Task 3 already handles production edition via the `edition` parameter. This task is template content only.

**Commit:** `feat: production SMS_GUIDELINES.md template`

---

## Task 5: MESSAGING_SETUP.md template + generator

The production deliverable that upgrades the build spec with live credentials and canon messages. Template is canonical per D-07 and PRD_05 Section 3.1.

**Files:**
- Create: `src/lib/deliverable/template-relaykit.ts`
- Create: `src/lib/deliverable/generator.ts`

### template-relaykit.ts

The MESSAGING_SETUP.md template string from PRD_05 Section 3.1 (canonical home per D-07).

Placeholders: `{business_name}`, `{registration_date}`, `{rk_live_key}`, `{webhook_secret}`, `{canon_messages_section}`, `{phone_number}`, `{compliance_site_url}`, `{rate_limit_tier}`, `{use_case_tip}`

**Sections:**
1. About this file — "This file upgrades your sandbox build spec with production credentials"
2. Environment setup — `RELAYKIT_API_KEY={rk_live_key}`, `RELAYKIT_API_URL`, `RELAYKIT_WEBHOOK_SECRET={webhook_secret}`
3. Your registered messages (canon messages) — `{canon_messages_section}`
4. What to build (6 subsections):
   - sendSMS() — **identical to build spec** (Trap #6)
   - Message triggers — "unchanged from build spec"
   - previewSMS() — NEW, POST /v1/messages/preview (production only)
   - Inbound webhook handler — updated with HMAC-SHA256 signature verification
   - Opt-in form — updated with `{compliance_site_url}/privacy` and `{compliance_site_url}/terms`
   - Error handling — 5 codes (adds `content_drift_detected`)
5. What RelayKit handles automatically — opt-out, quiet hours, content scanning, rate limiting, drift detection
6. Your phone number — `{phone_number}`
7. Production settings — rate limit tier, registration date, compliance site
8. Compliance rules summary

### generator.ts

```typescript
import type { UseCaseId } from "@/lib/intake/use-case-data";
import type { CanonMessage } from "./canon-messages";

export interface MessagingSetupInput {
  business_name: string;
  use_case: UseCaseId;
  registration_date: string;
  rk_live_key: string;
  webhook_secret: string;
  phone_number: string;
  compliance_site_url: string;
  canon_messages: CanonMessage[];
  rate_limit_tier: string;
}

export function generateMessagingSetup(input: MessagingSetupInput): string
```

Interpolates `MESSAGING_SETUP_TEMPLATE` from `template-relaykit.ts`. Uses `renderCanonMessagesSection()` from Task 1 for the `{canon_messages_section}` placeholder.

**Important — live key and webhook secret:** These were shown once at registration approval time and are not retrievable after that (production keys are SHA-256 hashed in `api_keys` table per D-45). The route in Task 6 will pass the values as `"Your live API key (copy from dashboard)"` and `"Your webhook secret (copy from dashboard)"` placeholders — the developer copies these from the approval moment, not from the downloaded file.

**Commit:** `feat: MESSAGING_SETUP.md template + generator (PRD_05 Section 3.1)`

---

## Task 6: `/api/deliverable` route

Serves production deliverables for download. The existing `approval-resources-card.tsx` already calls this endpoint.

**Files:**
- Create: `src/app/api/deliverable/route.ts`

**Endpoint:** `GET /api/deliverable?registration_id={id}&doc={messaging_setup|sms_guidelines}`

**Query params:**
- `registration_id` (required) — UUID
- `doc` (required) — `"messaging_setup"` or `"sms_guidelines"`

**Logic:**
1. Authenticate via Supabase `getUser()`
2. Load customer by email
3. Load registration by `registration_id`, verify `customer_id` matches
4. Verify `registration.status === "complete"` — only serve production docs for approved registrations
5. Based on `doc` param:
   - `"messaging_setup"` → call `generateMessagingSetup()` with registration + customer data
   - `"sms_guidelines"` → call `generateGuidelines(input, "production")` with registration + customer data
6. Return as `text/markdown` with `Content-Disposition: attachment` header

**Data sources:**

```typescript
// registrations table
{ id, status, canon_messages, phone_number, compliance_site_url,
  rate_limit_tier, approved_at, customer_id }

// customers table (via customer_id)
{ business_name, business_description, use_case, email }
```

**Credential placeholders** (see Task 5 note):

```typescript
const input = {
  rk_live_key: "Your live API key (copy from dashboard)",
  webhook_secret: "Your webhook secret (copy from dashboard)",
  // ... rest from registration + customer data
};
```

**Response:**

```typescript
return new Response(content, {
  headers: {
    "Content-Type": "text/markdown; charset=utf-8",
    "Content-Disposition": `attachment; filename="${filename}"`,
  },
});
```

Where `filename` is `"MESSAGING_SETUP.md"` or `"SMS_GUIDELINES.md"`.

**Commit:** `feat: GET /api/deliverable route for production documents`

---

## Task 7: Barrel index + build verification

**Files:**
- Create: `src/lib/deliverable/index.ts`

```typescript
// Sandbox
export { generateBuildSpec } from "./build-spec-generator";
export type { BuildSpecInput } from "./build-spec-generator";
export { generateGuidelines } from "./guidelines-generator";
export type { GuidelinesInput } from "./guidelines-generator";

// Production
export { generateMessagingSetup } from "./generator";
export type { MessagingSetupInput } from "./generator";

// Shared
export { renderCanonMessagesSection } from "./canon-messages";
export type { CanonMessage } from "./canon-messages";
export { USE_CASE_TIPS } from "./use-case-tips";
```

**Verification:** Run `npm run build` to confirm:
- No type errors
- No broken imports (especially `src/app/api/build-spec/route.ts` after Task 3 refactor)
- No missing modules

**Commit:** `feat: deliverable module barrel exports + build passes`

---

## Dependency Graph

```
Task 1 (canon renderer + tips) ─┬─> Task 2 (build spec refactor)
                                 │
                                 ├─> Task 3 (sandbox guidelines + unified generator)
                                 │        │
                                 │        └─> Task 4 (prod guidelines template)
                                 │                    │
                                 ├────────────────────┤
                                 │                    │
                                 └─> Task 5 (MESSAGING_SETUP.md) ──┐
                                                                    ├─> Task 6 (/api/deliverable)
                                              Task 4 ───────────────┘        │
                                                                             v
                                                                     Task 7 (index + build)
```

**Parallelizable:** Tasks 2, 3 can run in parallel after Task 1. Tasks 4, 5 can run in parallel after Task 3. Task 6 needs 4+5. Task 7 is last.

**Execution order (serial):** 1 → 2 → 3 → 4 → 5 → 6 → 7
