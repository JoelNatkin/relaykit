# PRD_06: CUSTOMER DASHBOARD
## RelayKit — Dashboard-First Developer Experience
### Version 3.0 — Mar 3, 2026

> **Dependencies:** Auth from Supabase. API key generation from PRD_09. Template content from PRD_02. Registration pipeline from PRD_04. Deliverable templates from PRD_05. Compliance monitoring from PRD_08.
>
> **CHANGE LOG (v3.0):** Complete rewrite. Dashboard is now the primary product surface, not a status page. Added: use case selection on dashboard, message plan builder, build spec generator, dual-path Quick Start (AI vs manual), progressive disclosure based on lifecycle stage, three-tab structure, message library, local phone number selection at registration. Sandbox dashboard is where product design, compliance education, and registration pre-work happen simultaneously.
>
> **What v2.0 described:** Simple sandbox dashboard (API key, phone verification, usage, cURL Quick Start, Go Live CTA) + registered status page.
>
> **What v3.0 describes:** Full sandbox experience (use case selection → message plan builder → build spec generator → dual-path Quick Start → registration) + registered experience (registration status, compliance, usage, keys).

---

## 1. OVERVIEW

The dashboard is the centerpiece of RelayKit. A developer signs up, lands here, and never needs to leave until they're building in their code editor. The dashboard handles use case selection, message design, build spec generation, sandbox testing, and registration — in that order, revealed progressively as the developer advances.

### The experience in one paragraph

Developer signs up with email, gets API key instantly, sees "What are you building?" tiles. Picks a use case (or "Just exploring"). Dashboard personalizes: shows compliant message templates for that use case as interactive cards. Developer selects, edits, and curates messages — they think they're designing their SMS feature, but they're simultaneously learning compliance boundaries and pre-populating their registration. When ready, they generate a build spec — a markdown document their AI coding tool reads to build the entire integration. Or they open the full API reference and build manually. They test in sandbox. When ready to go live, they click Register, and most of the intake wizard is already pre-filled from their dashboard work.

### Design principles

- **Progressive disclosure** — show exactly what matters now, trust the developer to find depth when needed
- **Triple duty** — every interaction teaches compliance, designs their product, AND pre-populates registration
- **Build spec as hero** — the primary deliverable is a document that AI coding tools consume, not API docs
- **Dual-path** — AI-first and manual paths are equal citizens, neither labeled "recommended"
- **Untitled UI components** throughout
- **Desktop-first** — vibe coders are on laptops, but dashboard must be responsive

### URL structure

```
relaykit.com/dashboard                    # Main dashboard (Overview tab)
relaykit.com/dashboard/messages           # Messages tab (plan builder, library)
relaykit.com/dashboard/compliance         # Compliance tab (alerts, status)
relaykit.com/dashboard/api-reference      # Full API reference
```

### Authentication

Same as v2.0:
- Magic link sent to customer's email at signup
- Same auth session carries through from sandbox to registration
- Session persisted via Supabase Auth (magic link provider)
- No password, no account creation — email is the identity

---

## 2. PROGRESSIVE DISCLOSURE: LIFECYCLE STAGES

The dashboard reveals depth based on where the developer is in their journey. Same URL, same tab structure, different density.

### Stage 1: Brand new (first visit)

**What they see (Overview tab):**
- Sandbox API key card (with copy button)
- "What are you building?" — 8 use case tiles + "Just exploring" (Section 3)
- Phone verification card

**What's hidden:** Message plan builder, build spec, Quick Start paths, usage card, Go Live CTA, Messages tab content, Compliance tab content.

**Transition trigger:** Developer selects a use case tile.

### Stage 2: Use case selected

**What changes:**
- Use case picker collapses to a single line: "Building: Appointment reminders [Change]"
- Message plan builder appears (Section 4) — the main visual element
- Quick Start section appears below plan builder with "Ready to build?" dual-path (Section 6)
- Phone verification card remains if not yet verified

**What's still hidden:** Usage card, Go Live engagement nudge, compliance tab content, message library (empty until they curate).

**Transition trigger:** Developer sends their first sandbox message OR generates a build spec.

### Stage 3: Actively building

**What changes:**
- Sandbox usage card appears (today's count)
- Messages tab becomes populated (message library starts accumulating from plan builder selections)
- Quick Start section fully visible with both paths

**Transition trigger:** Engagement signals met (>20 messages, webhook configured, opt-out tested, or 3+ active days).

### Stage 4: Ready to go live

**What changes:**
- Go Live CTA becomes prominent at top of Overview tab
- Go Live CTA appears on Messages tab as well

**Transition trigger:** Developer clicks Register (enters intake wizard with pre-populated data).

### Stage 5: Registration in progress

**What changes:**
- Registration status card appears at top of Overview (progress stepper)
- Sandbox continues to work — emphasized: "Your sandbox keeps working while you wait"
- Action cards appear if needed (OTP, rejection)

**Transition trigger:** Registration completes.

### Stage 6: Live

**What changes:**
- API Keys card shows both live and sandbox keys
- Usage card shows billing period (not daily sandbox count)
- Compliance tab activates with status, drift alerts, canon messages
- Resources card appears with MESSAGING_SETUP.md download
- Key swap instructions prominent: "Update RELAYKIT_API_KEY in your .env. That's it."

---

## 3. USE CASE SELECTION

### Appears: Stage 1 (first visit, Overview tab)

### Layout

```
┌──────────────────────────────────────────────────────────┐
│  What are you building?                                   │
│                                                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │ 📅       │  │ 📦       │  │ 🔐       │               │
│  │ Appt.    │  │ Orders & │  │ Verify   │               │
│  │ reminders│  │ delivery │  │ codes    │               │
│  └──────────┘  └──────────┘  └──────────┘               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │ 💬       │  │ 📣       │  │ 👥       │               │
│  │ Customer │  │ Marketing│  │ Team     │               │
│  │ support  │  │ & promos │  │ alerts   │               │
│  └──────────┘  └──────────┘  └──────────┘               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │ 🌐       │  │ 📋       │  │ 🔍       │               │
│  │ Community│  │ Waitlist &│  │ Just     │               │
│  │ & groups │  │ reserv.  │  │ exploring│               │
│  └──────────┘  └──────────┘  └──────────┘               │
│                                                           │
│  Pick the closest match — you can always change it.       │
└──────────────────────────────────────────────────────────┘
```

### Tiles

Same 8 use cases from PRD_01 Screen 1, plus "Just exploring":

| ID | Label | Icon |
|----|-------|------|
| `appointments` | Appointment reminders | Calendar |
| `orders` | Order & delivery updates | Package |
| `verification` | Verification codes | Shield |
| `support` | Customer support | MessageCircle |
| `marketing` | Marketing & promos | Megaphone |
| `internal` | Team & internal alerts | Users |
| `community` | Community & groups | Globe |
| `waitlist` | Waitlist & reservations | ClipboardList |
| `exploring` | Just exploring | Search |

### Behavior

- Single tap selects. No Continue button, no modal, no page transition.
- On selection: tile grid animates out, collapses to single-line indicator. Message plan builder fades in below.
- "Just exploring" selects a universal template set covering common patterns across use cases.
- Developer can change use case from the collapsed line: "Building: Appointment reminders [Change]"
- Changing use case resets the message plan builder to the new use case's templates.
- Selection is persisted to the `customers` table immediately (not just client state).

### Data captured

```typescript
{
  use_case: 'appointments' | 'orders' | 'verification' | 'support' |
            'marketing' | 'internal' | 'community' | 'waitlist' | 'exploring'
}
```

---

## 4. MESSAGE PLAN BUILDER

### Appears: Stage 2 (after use case selection, Overview tab)

This is the centerpiece of the sandbox experience. The developer thinks they're designing their SMS feature. They're actually simultaneously building their registration canon messages, learning compliance boundaries, and configuring their registration scope.

### Layout

```
┌──────────────────────────────────────────────────────────┐
│  Your message plan                                        │
│  These are the messages your app can send. Select the     │
│  ones you need, edit the wording, and we'll handle the    │
│  carrier registration.                                    │
│                                                           │
│  INCLUDED IN YOUR REGISTRATION                            │
│                                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │ ☑ Booking confirmation                              │  │
│  │                                                      │  │
│  │ "{business_name}: Your appointment is confirmed for  │  │
│  │  {date} at {time}. Reply HELP for help, STOP to     │  │
│  │  unsubscribe."                                       │  │
│  │                                                      │  │
│  │ Trigger: When client books an appointment             │  │
│  │                                              [Edit]  │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │ ☑ Appointment reminder                              │  │
│  │                                                      │  │
│  │ "{business_name}: Reminder — you have an appointment │  │
│  │  tomorrow at {time}. Reply C to confirm or R to      │  │
│  │  reschedule. STOP to unsubscribe."                   │  │
│  │                                                      │  │
│  │ Trigger: 24 hours before appointment                  │  │
│  │                                              [Edit]  │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  (additional included message cards...)                    │
│                                                           │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│                                                           │
│  EXPANSION MESSAGES ★                                     │
│  These require a broader registration.                    │
│  [Show expansion messages ▼]                              │
│                                                           │
│  {when expanded:}                                         │
│                                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │ ★ ☐ Promotional offer                               │  │
│  │                                                      │  │
│  │ "{business_name}: Happy holidays! Enjoy 20% off your │  │
│  │  next visit. Book at {url}. Reply STOP to opt out."  │  │
│  │                                                      │  │
│  │ Trigger: Manually sent for promotions                 │  │
│  │                                                      │  │
│  │ ⓘ Requires marketing expansion — adds separate       │  │
│  │   opt-in requirement for promotional messages.        │  │
│  │                                              [Edit]  │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  (additional expansion message cards...)                   │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Card anatomy

Each message card contains:

| Element | Description |
|---------|-------------|
| **Checkbox** | Toggle to include/exclude from build spec and registration |
| **Category label** | "Booking confirmation", "Appointment reminder", etc. |
| **Message text** | Full compliant template with `{variable}` placeholders |
| **Trigger description** | "When client books an appointment" — helps AI coding tool |
| **Edit button** | Opens inline edit mode for message text |
| **Compliance elements** | Opt-out language, business name — flagged if removed during edit |
| **Expansion indicator** | Star icon + advisory text for expansion messages |

### Included messages (on by default)

5-8 messages per use case covering the complete lifecycle. These map to the base registration scope.

**Example for `appointments`:**
1. ☑ Booking confirmation — "When client books"
2. ☑ Appointment reminder (24hr) — "24 hours before"
3. ☐ Rescheduling confirmation — "When client reschedules"
4. ☑ Cancellation notice — "When client cancels"
5. ☐ No-show follow-up — "After a missed appointment"
6. ☐ Pre-visit instructions — "Morning of appointment"

Default checkboxes: 2-3 most common messages on by default, remainder available but unchecked. Developer curates their selection.

### Expansion messages (off by default, behind toggle)

3-4 messages per use case that require a broader registration (typically adding marketing or mixed campaign type):
1. ★ Promotional offer — requires marketing expansion
2. ★ Birthday/anniversary message — requires marketing expansion
3. ★ Re-engagement ("We miss you!") — requires marketing expansion
4. ★ Review request — may require mixed expansion

### Editing behavior

- Click Edit → message text becomes editable inline (textarea swap)
- Compliance elements (opt-out language, business name placeholder) are highlighted
- If developer removes compliance elements: inline warning appears below the card: "This message is missing opt-out language. Carriers require it. [Restore default]"
- Developer can edit freely but compliance indicators update in real-time
- Edits are saved to `message_plans` table on blur (autosave, no Save button)

### Expansion toggle behavior

When developer enables an expansion message:
- Inline advisory appears once (dismissable): "Adding promotional messages means recipients must give separate, explicit consent for marketing texts. We'll handle the extra consent form in your registration."
- The expansion selection is tracked and feeds into the registration flow (maps to PRD_01 Screen 1b expansions)
- Messages work in sandbox immediately (sandbox doesn't enforce registration scope)
- In production without expansion: proxy blocks with clear error explaining expansion needed

### Content source

Templates come from PRD_02's template engine. The message plan builder calls a function that returns the full message set for a use case:

```typescript
interface MessageTemplate {
  id: string;                  // e.g., 'appointments_booking_confirmation'
  category: string;            // e.g., 'Booking confirmation'
  template: string;            // Full message text with {variables}
  trigger: string;             // "When client books an appointment"
  variables: string[];         // ['business_name', 'date', 'time']
  is_expansion: boolean;       // true for expansion messages
  expansion_type?: string;     // 'marketing' | 'mixed'
  default_enabled: boolean;    // true for the 2-3 most common
  compliance_elements: {
    has_opt_out: boolean;
    has_business_name: boolean;
  };
}

function getMessageTemplates(useCase: string): MessageTemplate[];
```

### Vertical customization

If the developer provides a business description (optional field on use case selection or business details), the template engine's vertical detection adjusts message content. A dental practice gets "Your dental appointment" instead of "Your appointment." A nail salon gets "Your nail appointment." This matches PRD_02's existing vertical detection logic.

### Data model

```sql
CREATE TABLE message_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),  -- NOT UNIQUE: Phase 2 multi-project allows multiple plans per customer
  project_id UUID REFERENCES projects(id),    -- Phase 2: multi-project. Currently nullable. Will become NOT NULL after Phase 2 migration.
  use_case TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]',
  -- messages is an array of:
  -- {
  --   template_id: string,
  --   category: string,
  --   original_template: string,
  --   edited_text: string | null,
  --   trigger: string,
  --   variables: string[],
  --   is_expansion: boolean,
  --   expansion_type: string | null,
  --   enabled: boolean
  -- }
  build_spec_generated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

> **Schema note:** The `customers` table also needs a `business_industry` TEXT nullable column for vertical detection. This is populated from `business_description` at intake (used by the template engine to select vertical-specific message variants). Nullable in V1 — no breaking change.

---

## 5. BUILD SPEC GENERATOR

### Appears: Stage 2+ (below message plan builder, Overview tab)

The build spec is the primary sandbox deliverable. It's a markdown document that AI coding tools consume to build the developer's entire SMS integration.

### "Ready to build?" section

```
┌──────────────────────────────────────────────────────────┐
│  Ready to build?                                          │
│                                                           │
│  ┌──────────────────────┐  ┌──────────────────────┐     │
│  │                       │  │                       │     │
│  │  Build with AI        │  │  Build manually       │     │
│  │                       │  │                       │     │
│  │  Generate a build     │  │  Full API reference,  │     │
│  │  spec for your AI     │  │  endpoint docs, and   │     │
│  │  coding tool.         │  │  code examples.       │     │
│  │                       │  │                       │     │
│  │  [Generate build      │  │  [View API docs →]    │     │
│  │   spec →]             │  │                       │     │
│  └──────────────────────┘  └──────────────────────┘     │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Build spec generation

When developer clicks "Generate build spec":

1. Collect enabled messages from the plan builder
2. Collect use case, business description (if provided), sandbox API key
3. Assemble the build spec document (see Section 5.1)
4. Show preview modal with download button and copy-to-clipboard
5. Also generate sandbox SMS_GUIDELINES.md for download
6. Record `build_spec_generated_at` on the message plan

### 5.1 Build spec template: SMS_BUILD_SPEC.md

```markdown
# SMS Build Spec for {app_name_or_use_case}
## Generated by RelayKit — {date}

## About this file
Drop this file and SMS_GUIDELINES.md in your project root. Tell your AI
coding tool: "Read SMS_BUILD_SPEC.md and build my SMS feature."

## Environment setup
Add to your .env file:

RELAYKIT_API_KEY={rk_sandbox_key}
RELAYKIT_API_URL=https://api.relaykit.dev/v1

Also add SMS_GUIDELINES.md to your project root. Your AI coding tool should
read it for compliance rules and boundaries.

## What your app sends

### {category_1}: {trigger_1}

{message_text_1}

Variables: {variable_list}
When to send: {trigger_description}

### {category_2}: {trigger_2}

{message_text_2}

Variables: {variable_list}
When to send: {trigger_description}

{repeat for all enabled messages}

## What to build

### 1. Utility function: sendSMS()
Create a reusable function that sends messages through the RelayKit API:
- POST to {RELAYKIT_API_URL}/messages
- Headers: Authorization: Bearer {RELAYKIT_API_KEY}, Content-Type: application/json
- Body: { "to": recipientPhone, "body": messageText }
- Handle errors: check response status, parse error codes (see SMS_GUIDELINES.md)

### 2. Message triggers
For each message above, create the trigger in your app:
{for each enabled message:}
- {trigger}: Call sendSMS() with the {category} template, replacing {variables} with actual values

### 3. Inbound webhook handler
Set up a POST endpoint to receive replies from your users:
- RelayKit sends JSON: { "type": "message.received", "data": { "from", "to", "body" } }
- Handle STOP/START keywords (RelayKit manages opt-outs automatically, but you receive the event)
- Process other replies based on your app logic
- Configure your webhook URL in your RelayKit dashboard

### 4. Opt-in form
Add an SMS consent form where users provide their phone number:
- Must include: program description, message frequency, "Message and data rates may apply"
- Must include: opt-out instructions ("Reply STOP to unsubscribe")
- Must include: link to privacy policy and terms of service
- See SMS_GUIDELINES.md Section "Consent Requirements" for full requirements

### 5. Error handling
RelayKit returns specific error codes for compliance violations:
- recipient_opted_out (422): Recipient has opted out. Do not retry.
- content_prohibited (422): Message contains prohibited content. See error detail.
- quiet_hours_violation (422): Outside allowed sending hours. Queue for morning.
- rate_limited (429): Too many requests. Implement backoff.

## Compliance rules (summary)
- Always include opt-out language (Reply STOP to unsubscribe)
- Always include your business name
- Don't send between 9 PM - 9 AM recipient's local time (RelayKit enforces this)
- Don't send to numbers that have opted out (RelayKit enforces this)
- See SMS_GUIDELINES.md for complete rules and boundaries
```

### 5.2 Sandbox SMS_GUIDELINES.md

Ships alongside the build spec. Generated on use case selection. Contains:
- Approved message types for selected use case
- Message types NOT approved (boundary examples)
- Vertical-specific module (if business description triggers vertical detection)
- Consent requirements
- Frequency guidance
- Content quality rules
- Near-the-line examples (still okay) vs over-the-line (not okay)

**Excludes:** Live credentials, production-specific settings, canon messages (those come post-registration).

**Upgrade path:** Replaced by full production SMS_GUIDELINES.md post-registration, which adds canon messages, registration-specific content, and production credentials reference.

### 5.3 Build spec vs MESSAGING_SETUP.md

| | SMS_BUILD_SPEC.md (sandbox) | MESSAGING_SETUP.md (post-registration) |
|---|---|---|
| **When** | Generated from message plan builder | Generated after registration approval |
| **Credentials** | Sandbox API key | Live API key + webhook secret |
| **Messages** | Developer's selected/edited templates | Canon messages (finalized at registration) |
| **Purpose** | AI coding tool builds the integration | AI coding tool upgrades to production |
| **Compliance** | Condensed rules + guidelines reference | Full compliance contract + enforcement details |
| **Opt-in form** | Generic template | Customized with compliance site URL |

The MESSAGING_SETUP.md is the build spec upgraded with production specifics. A developer who built from the build spec just swaps their API key — the code structure is identical.

---

## 6. DUAL-PATH QUICK START

### "Build with AI" path (Section 5 above)

Generate build spec → download → drop in project → tell AI "Read SMS_BUILD_SPEC.md and build my SMS feature."

### "Build manually" path

"View API docs →" links to `/dashboard/api-reference` — a full API reference page.

### API Reference page

Comprehensive, standalone documentation covering:

**Authentication:**
Bearer token authentication. Key prefixes (`rk_sandbox_` vs `rk_live_`). Key rotation via dashboard.

**Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| POST | /v1/messages | Send a message |
| POST | /v1/messages/preview | Validate a message against registration |
| GET | /v1/messages | List recent messages |
| GET | /v1/messages/:id | Get message status |
| GET | /v1/opt-outs | List opted-out numbers |
| POST | /v1/webhooks | Configure webhook URL |
| POST | /v1/sandbox/verify | Start phone verification |
| POST | /v1/sandbox/verify/confirm | Complete phone verification |

Each endpoint shows: request schema, response schema, example request (cURL + JavaScript + Python), error responses.

**Error reference:**
Full taxonomy of error codes with explanations — `recipient_opted_out`, `content_prohibited`, `quiet_hours_violation`, `rate_limited`, `invalid_api_key`, `registration_required`. Each with what it means, when it happens, and what the developer should do.

**Webhook reference:**
Event types (`message.received`, `message.status`, `opt_out.created`, `opt_out.removed`), payload schemas, signature verification with `X-RelayKit-Signature`, retry behavior.

**Code examples:**
Complete working examples in JavaScript (fetch), Python (requests), and raw HTTP for every endpoint.

**Rate limits and constraints:**
Sandbox: 100 messages/day. Production: based on trust score. Message size limits.

### Design intent

The API reference must be genuinely excellent. An experienced developer should think "This is a serious, well-documented API." Then they see the build spec and think "But this captures domain knowledge I'd spend hours researching. I'll use the spec."

---

## 7. QUICK START CARD

The Quick Start card changes based on lifecycle stage.

### Stage 1 (before use case selection)

Not shown. Use case selection is the first action.

### Stage 2 (after use case, before build spec)

```
┌──────────────────────────────────────────────────────────┐
│  Get started                                              │
│                                                           │
│  Curate your messages above, then generate a build spec   │
│  for your AI coding tool — or jump straight to the API    │
│  reference.                                               │
│                                                           │
│  Quick test (copy and paste):                             │
│                                                           │
│  curl -X POST https://api.relaykit.dev/v1/messages \      │
│    -H "Authorization: Bearer {sandbox_key}" \              │
│    -H "Content-Type: application/json" \                   │
│    -d '{"to": "+1{verified_phone}", "body": "Hello!"}'    │
│                                                           │
│  [Copy cURL]                                              │
└──────────────────────────────────────────────────────────┘
```

### Stage 3+ (build spec generated or messages sent)

Replaced by the "Ready to build?" dual-path section (Section 5).

---

## 8. SANDBOX INFRASTRUCTURE CARDS

These cards persist across all sandbox stages.

### 8.1 Sandbox API Key card

Always visible at top of Overview tab.

```
┌──────────────────────────────────────────────┐
│  Your Sandbox API Key                         │
│                                               │
│  rk_sandbox_••••••••••••••••••••  [Copy] [👁] │
│                                               │
│  Base URL: https://api.relaykit.dev/v1        │
│                                               │
│  Messages deliver to your verified phone only.│
└──────────────────────────────────────────────┘
```

- Key masked by default, reveal toggle shows full key
- Copy button copies full key with success toast
- [Regenerate key] link for key rotation

### 8.2 Phone verification card

Shown until verified, then collapses to one-line confirmation.

**Before verification:**
```
┌──────────────────────────────────────────────┐
│  Verify your phone number                     │
│                                               │
│  Your sandbox sends to one phone number.      │
│  Verify yours to start testing.               │
│                                               │
│  Phone: [+1 ___-___-____]  [Send code]       │
│                                               │
│  {after code sent:}                           │
│  Code: [______]  [Verify]                    │
│  Didn't receive it? [Resend] (60s cooldown)   │
└──────────────────────────────────────────────┘
```

**After verification:**
```
┌──────────────────────────────────────────────┐
│  Verified: {formatted_phone}          ✓       │
└──────────────────────────────────────────────┘
```

### 8.3 Sandbox usage card

Appears at Stage 3 (after first message sent).

```
┌──────────────────────────────────────────────┐
│  Today's Usage                                │
│                                               │
│  ████████░░░░░░░░░░░░  12 / 100 messages     │
│                                               │
│  Resets daily at midnight UTC.                │
└──────────────────────────────────────────────┘
```

---

## 9. GO LIVE / REGISTRATION FLOW

### Go Live CTA

**Default state (always visible at bottom, all stages):**
```
┌──────────────────────────────────────────────┐
│  Ready to send to real users?                 │
│                                               │
│  Register for carrier approval.               │
│  Same API, same code — just swap your key.    │
│                                               │
│  [Register now — $199 + $19/month]            │
└──────────────────────────────────────────────┘
```

**Engagement-nudge state (Stage 4, top of page):**
```
┌──────────────────────────────────────────────┐
│  You've been building — nice work.            │
│                                               │
│  Your integration looks ready for real users. │
│  Register to get your live API key.           │
│  Same code, one key swap.                     │
│                                               │
│  [Register now — $199 + $19/month]            │
└──────────────────────────────────────────────┘
```

### What happens when they click Register

1. Dashboard collects pre-populated data:
   - Use case (from tile selection)
   - Expansions (from expansion message toggles)
   - Enabled messages with any edits (from message plan)
   - Effective campaign type (computed from use case + expansions)

2. Developer enters intake wizard (PRD_01) at Screen 1b (Advisory) or Screen 2 (Business Details), skipping Screen 1 (use case already selected):
   - **Screen 1b (Advisory):** Pre-populated with expansion selections. Confirmatory, not discovery. Shows "Here's what your registration covers" based on message plan.
   - **Screen 2 (Business Details):** Genuinely new information — business name, EIN, contact details, address. Not pre-populated from dashboard (except email).
   - **Screen 3 (Review):** Sample messages pre-populated from edited message plan. Campaign description generated from use case + business details. Developer sees their own messages reflected back.
   - **Screen 4 (Payment):** Stripe checkout. $199 setup + $19/month.

3. After payment, developer returns to dashboard. Registration status card appears (Stage 5). Sandbox continues to work.

### Local phone number selection

On the Review screen (Screen 3) or as a post-payment preference:

```
┌──────────────────────────────────────────────┐
│  Your phone number                            │
│                                               │
│  We'll assign you a number with a local area  │
│  code based on your business location.        │
│                                               │
│  Your business is in Austin, TX — we'll look  │
│  for a (512) number.                          │
│                                               │
│  [That's perfect]  [Different area code →]    │
└──────────────────────────────────────────────┘
```

If different: type 3-digit area code or pick from short list of state area codes. One selection. RelayKit picks actual number from inventory.

Fallback: "No (512) numbers available. We've assigned you a (737) number — also an Austin area code."

### Pre-population data contract

```typescript
interface DashboardToIntakeData {
  use_case: string;
  expansions: string[];
  effective_campaign_type: string;
  selected_messages: {
    template_id: string;
    category: string;
    text: string;        // edited text if modified, original if not
    trigger: string;
    is_expansion: boolean;
    expansion_type?: string;  // 'marketing' | 'mixed' — for expansion messages
  }[];
  email: string;         // from auth session
  preferred_area_code?: string;
}
```

Passed via sessionStorage (see PRD_01_ADDENDUM Section 2 for rationale and transport details).

---

## 10. REGISTERED DASHBOARD

After registration payment, the dashboard adds registration-specific elements. All sandbox features remain.

### 10.1 Registration Status Card

Progress stepper with 4 steps:
```
[1. Submitted] → [2. Brand Review] → [3. Campaign Review] → [4. Ready!]
```

**Timing note:** Current TCR baseline is 10–15 business days (approximately 2–3 weeks). Never display "5–7 days" anywhere. The sandbox remains live throughout this window — always surface this in copy.

**Pending state narrative — required copy for each stepper step:**

Each active stepper step must display companion narrative copy beneath the stepper bar. This is not optional — never leave a pending state as just a badge without explanation.

**Step 1 — Submitted (immediately after payment):**
> *"Your registration is submitted. We're generating your compliance artifacts and setting up your Twilio account. This usually completes in a few minutes."*

**Step 2 — Brand Review (brand submitted to TCR, awaiting approval):**
> *"Your brand is submitted to The Campaign Registry. Carriers are verifying your business identity — this is the step that establishes your trust score and determines your message throughput. Most brands clear in 1–5 business days.*
>
> *Your sandbox is live. Keep building — your app will be ready when your registration clears."*

**Step 3 — Campaign Review (brand approved, campaign submitted):**
> *"Your brand is verified. Your campaign is submitted. Carriers are reviewing your traffic profile — this is the step that makes everything downstream trustworthy. Campaign reviews typically take 1–2 weeks.*
>
> *In the meantime, your sandbox is live. Keep building."*

**Stepper sub-states:**
- Show what's already completed (checkmark, green) — accumulation of progress matters
- Show what's in progress (spinner or pulsing dot)
- Show what's next (gray, not yet)
- Never show a raw percentage. "Your campaign is in carrier review — step 3 of 3" is better than "67% complete"

**AWAITING_BRAND_AUTH state (Authentication+ 2.0 — public companies):**
Action card with amber background:
> *"Check your email — TCR sent a verification link to {email}. Click it within 7 days to continue your registration. If you don't see it, check spam or contact support."*

### 10.2 Action Cards

**OTP verification** (sole proprietor only — same as v2.0 Section 4, amber background):
> *"We sent a 6-digit code to {formatted_phone}. Enter it below to verify your identity — this is how TCR confirms you're a real person behind this registration."*
>
> *Inline annotation: "TCR limits phone number verifications to 3 per phone number lifetime, across all providers. This counts as one of yours."*

**Rejection card** (red/destructive background — see full debrief spec in Section 10.7 below):
Rejection is a debrief, not an error. See Section 10.7.

### 10.3 API Keys Card

Live + sandbox keys side by side. Same as v2.0 Section 5.

### 10.4 Usage Card

Billing period usage + compliance stats. Same as v2.0 Section 6.

### 10.5 Details Card

Submitted business details, compliance site link, phone number. Collapsible. Same as v2.0 Section 7.

### 10.6 Resources Card — Post-Approval (Approval Moment)

The approval moment is the most important emotional touchpoint in the product. Do not just flip a status badge to green. This card is the developer's crossing-the-finish-line moment.

**Required copy — do not reduce or genericize:**

```
┌──────────────────────────────────────────────┐
│  Your campaign is approved.                   │
│                                               │
│  You now have verified SMS infrastructure —   │
│  a registered brand, an approved campaign,    │
│  and a compliance record on file with The     │
│  Campaign Registry. Most developers never     │
│  get here. You did.                           │
│                                               │
│  Here's what you can build with it:           │
│                                               │
│  Update RELAYKIT_API_KEY in your .env file    │
│  with your live key. That's it — same code,   │
│  same API, your app sends real texts.         │
│                                               │
│  📄 MESSAGING_SETUP.md  [Download]            │
│  📄 SMS_GUIDELINES.md   [Download]            │
│                                               │
└──────────────────────────────────────────────┘
```

**"Most developers never get here. You did."** — This line is intentional. It's true, and it names the achievement without being sycophantic. Do not remove or soften it.

### 10.7 Rejection Card — Debrief Spec

Rejection is the most painful moment in the journey. RelayKit's differentiation here is treating it as a debrief, not a failure notice.

**Rejection card structure (required for every rejection type):**

```
┌──────────────────────────────────────────────┐
│  ⚠ Carriers flagged your registration         │
│                                               │
│  [WHAT WAS FLAGGED — plain language]          │
│                                               │
│  [WHY THIS TRIGGERS A FLAG — one sentence     │
│  explaining the underlying carrier logic]     │
│                                               │
│  [WHAT WE'RE DOING — auto-fix status or       │
│  manual review notice]                        │
│                                               │
│  [WHAT APPROVED CAMPAIGNS LOOK LIKE —         │
│  one concrete example of the correct thing]   │
│                                               │
│  [CTA: "We're resubmitting" or "Contact us"]  │
└──────────────────────────────────────────────┘
```

**Example — missing opt-out (code 811):**
```
┌──────────────────────────────────────────────┐
│  ⚠ Carriers flagged your registration         │
│                                               │
│  Your sample messages were missing opt-out    │
│  language.                                    │
│                                               │
│  Carriers require every sample message to     │
│  include instructions for unsubscribing —     │
│  it's how they verify you'll honor opt-outs   │
│  before approving your traffic.               │
│                                               │
│  We've added "Reply STOP to unsubscribe" to   │
│  your sample messages and resubmitted.        │
│                                               │
│  Approved messages look like:                 │
│  "PetGroomers: Your appointment is tomorrow   │
│  at 2pm. Reply STOP to unsubscribe."          │
│                                               │
│  Most campaigns clear review in 1–2 weeks     │
│  after resubmission.                          │
└──────────────────────────────────────────────┘
```

Never use: "failed," "error," "violation," "our team is reviewing and will update you." Always include the specific fix and what happens next.

---

## 11. TAB STRUCTURE

### Overview tab (default)

All of the above: API key, use case selection, message plan builder, Quick Start / build spec, sandbox usage, Go Live CTA, registration status, keys, resources. This is where 90% of interaction happens.

### Messages tab

**Sandbox phase:**
- Message plan builder (same component as Overview, or link back to it)
- Message library below (populated from plan builder selections) — cards with copy icons, compliance indicators

**Post-registration:**
- Message library with canon messages marked (star badge)
- Expansion messages section (available templates for registration expansion)
- Phase 2: "Can I send this?" input wrapping preview endpoint

### Compliance tab

**Sandbox phase:**
- Simple card: "Compliance monitoring activates when you go live. In sandbox, the same compliance checks run on every message — check your API responses for error codes."

**Post-registration (no issues):**
- Green status card: "All clear. Your messages are within your registration."
- Canon messages (read-only reference)
- Link to compliance site

**Post-registration (with alerts):**
- Drift alert cards with detail views (side-by-side flagged vs canon, consequences, suggested fix, escalation timeline)
- Resolution action buttons
- Escalation status visualization

---

## 12. MESSAGE LIBRARY (MESSAGES TAB)

### Three-tier message structure

Messages in the plan builder and library are organized into three tiers. This structure governs what's shown in the plan builder, what appears in the Messages tab library, and what gets submitted at registration.

**Tier 1 — Included with your registration** (enabled by default, shown prominently)
The core message types covered by the developer's registered use case. No additional registration needed. For `appointments`: booking confirmations, reminders, cancellations, rescheduling, no-show follow-ups. Displayed with a green checkmark badge.

**Tier 2 — Also available with your registration** (available but off by default, shown with discovery framing)
Message types within the same campaign scope that the developer hasn't activated yet. Unspent capacity. Surfaced as a discovery nudge: "Your registration also covers these — you haven't used them yet." Displayed with a gray badge. Toggling these on doesn't change registration scope.

**Tier 3 — Requires an additional campaign** (expansion messages, marked with ⭐ and expansion note)
Message types outside the current registration scope. Activating these registers a second campaign. Displayed with a star and a brief note: *"Requires marketing campaign — we'll register it alongside your existing one."* These map to the expansion options from the intake wizard.

### Entry anatomy

```
┌──────────────────────────────────────────────────────────┐
│ ⭐ Booking confirmation                          [Copy]   │
│                                                           │
│ "{business_name}: Your appointment is confirmed for       │
│  {date} at {time}. Reply HELP for help, STOP to          │
│  unsubscribe."                                            │
│                                                           │
│ 🟢 Included with your registration                        │
└──────────────────────────────────────────────────────────┘
```

Star (⭐) = canon message (selected for registration). Badge color indicates tier.

### For BYO Twilio developers (Phase 2)

Registration-only developers who don't use the proxy still get the message library with all common templates for their use case, canon messages marked, compliance indicators, and expansion messages for reference.

---

## 13. EMAIL NOTIFICATIONS

> **Copy requirement:** All email subject lines and body copy must comply with the vocabulary rules in `V4_-_RELAYKIT_EXPERIENCE_PRINCIPLES.md`. The vocabulary table and framing shift table apply to every email. Key rules: never use "compliance" as a standalone noun, never use "failed" alone without context, never use "pending" without narrative, never use "required" or "violation."

### Email 0: Sandbox welcome (first login / magic link)
```
Subject: You're in. Here's your sandbox key.

Hi there,

Your RelayKit sandbox is live. Your API key is waiting on your dashboard.

Here's what to do next:
1. Pick your use case — we'll show you compliant message templates for it
2. Curate your message plan — design your SMS feature while we pre-fill your registration
3. Generate a build spec — drop it in your project and tell your AI to build it

When you're ready to go live, the registration is already set up from your message plan.
Same code, one key swap.

→ Your dashboard: https://relaykit.com/dashboard

— RelayKit
```

### Email 1: Build spec generated (first time only)
```
Subject: Your SMS build spec is ready — RelayKit

Hi there,

You generated a build spec from your message plan.

Drop SMS_BUILD_SPEC.md and SMS_GUIDELINES.md in your project root,
then tell your AI coding tool: "Read SMS_BUILD_SPEC.md and build
my SMS feature."

When you're ready to send to real users, register from your dashboard.
Same code, one key swap.

→ Dashboard: https://relaykit.com/dashboard

— RelayKit
```

### Email 2: Registration submitted (post-payment confirmation)
```
Subject: Your registration is submitted — RelayKit

Hi {first_name},

Your registration is in. Here's where things stand:

✓ Your business details are submitted to The Campaign Registry
✓ Your compliance site is live at {compliance_site_url}
✓ Your sandbox is active — keep building while you wait

What happens next: carriers will review your brand and campaign.
This typically takes 2–3 weeks. We'll email you when you're through.

Your sandbox keeps working the whole time. No waiting around.

→ Track your status: https://relaykit.com/dashboard

— RelayKit
```

### Email 3: OTP required (sole proprietor only)
```
Subject: Action needed: your verification code is waiting — RelayKit

Hi {first_name},

One more step: we sent a 6-digit verification code to {formatted_phone}.

Enter it at your dashboard to confirm your identity with TCR.
The code expires in 10 minutes — if it expired, request a new one from your dashboard.

→ Enter your code: https://relaykit.com/dashboard

— RelayKit
```

### Email 4: Approved — the moment
```
Subject: You're live. Here's what you can build now.

Hi {first_name},

Your campaign is approved.

You now have verified SMS infrastructure — a registered brand, an approved
campaign, and a compliance record on file with The Campaign Registry.
Most developers never get here. You did.

Your live API key is ready on your dashboard. Update RELAYKIT_API_KEY
in your .env file. That's it — same code, same API, your app sends
real texts.

Your production MESSAGING_SETUP.md and SMS_GUIDELINES.md are waiting
on your dashboard.

→ Go to your dashboard: https://relaykit.com/dashboard

— RelayKit
```

### Email 5: Rejection — debrief
```
Subject: Carriers flagged your registration — here's what to do

Hi {first_name},

Carriers reviewed your registration and flagged something.
Here's exactly what happened and what we're doing about it:

{rejection_explanation}
[Variable — populated from rejection code → developer explanation mapping in PRD_04]

{auto_fix_status}
[Variable — either "We've fixed it and resubmitted. Most campaigns clear in 1–2 weeks after resubmission."
OR "This one needs a manual review. Our team will contact you within 24 hours with the exact change needed."]

Your sandbox stays live in the meantime.

→ See details: https://relaykit.com/dashboard

— RelayKit
```

> **Implementation note:** The `{rejection_explanation}` variable must be populated from the rejection code → developer-facing explanation table in PRD_04 Section 11. Never send a generic rejection email — every email must include the specific plain-language explanation.

### Email 6: Message drift alert
```
Subject: ⚠ Your messages drifted from your registration — {business_name}

Hi {first_name},

We detected messages from {business_name} that don't match your
registered message patterns.

{drift_summary}
[Variable: what was detected, which messages, what pattern changed]

Your traffic is still flowing — this is a warning, not a block.
But messages that drift significantly from your registration can
trigger carrier review. Here's what to check:

→ Review your compliance tab: https://relaykit.com/dashboard/compliance

— RelayKit
```

### Email 7: Message blocked
```
Subject: ⚠ A message was blocked — here's why — {business_name}

Hi {first_name},

One of your messages was blocked before delivery.

{block_reason}
[Variable: plain-language reason — consent violation, content flag, quiet hours, etc.]

Blocked messages are not delivered and not charged.
Here's what to do to prevent this:

→ Your compliance tab: https://relaykit.com/dashboard/compliance

— RelayKit
```

---

## 14. API ENDPOINTS

### Unchanged from v2.0

- `GET /api/dashboard` — current state (extended, see below)
- `POST /api/otp` — submit OTP code
- `POST /api/sandbox/verify-phone` — start phone verification
- `POST /api/sandbox/verify-code` — complete phone verification
- `POST /api/keys/regenerate` — regenerate API key
- `GET /api/dashboard/usage` — usage details
- `GET /api/messages` — recent message log
- `GET /api/deliverable` — download MESSAGING_SETUP.md

### New in v3.0

**`POST /api/use-case`** — Set or change use case selection.
- Request: `{ use_case: string }`
- Response: `{ use_case: string, message_templates: MessageTemplate[] }`
- Creates/updates `message_plans` record with default templates

**`PATCH /api/message-plan`** — Update message plan (toggle, edit).
- Request: `{ messages: MessagePlanEntry[] }`
- Response: `{ messages: MessagePlanEntry[], updated_at: string }`
- Autosave — called on every toggle or edit blur

**`POST /api/build-spec`** — Generate build spec from current message plan.
- Request: `{}` (uses authenticated customer's plan)
- Response: `{ build_spec: string, guidelines: string }` (markdown content)
- Updates `build_spec_generated_at`

**`GET /api/message-templates/:useCase`** — Get all templates for a use case.
- Response: `{ templates: MessageTemplate[] }`

### Updated: `GET /api/dashboard`

Extends v2.0 response:

```typescript
{
  // ... all v2.0 fields, plus:
  message_plan: {
    use_case: string | null;
    messages: MessagePlanEntry[];
    build_spec_generated_at: string | null;
  } | null;
  lifecycle_stage: 'new' | 'use_case_selected' | 'building' | 'ready' | 'registering' | 'live';
  engagement_signals: {
    messages_sent: number;
    webhook_configured: boolean;
    opt_out_tested: boolean;
    active_days: number;
  };
}
```

---

## 15. REAL-TIME UPDATES

Same as v2.0 (Supabase Realtime for registration status and usage).

---

## 16. IMPLEMENTATION NOTES

### File structure

```
app/
  dashboard/
    page.tsx                        # Main dashboard (Overview tab)
    messages/
      page.tsx                      # Messages tab
    compliance/
      page.tsx                      # Compliance tab
    api-reference/
      page.tsx                      # Full API reference

components/
  dashboard/
    # Layout
    DashboardShell.tsx              # Nav, tabs, auth wrapper
    TabNav.tsx                      # Overview / Messages / Compliance

    # Stage 1: New user
    UseCaseSelector.tsx             # 8 tiles + Just exploring
    UseCaseBadge.tsx                # Collapsed single-line after selection

    # Stage 2: Message plan
    MessagePlanBuilder.tsx          # Card list with toggles and edits
    MessageCard.tsx                 # Individual message card
    MessageCardEdit.tsx             # Inline edit mode
    ExpansionToggle.tsx             # Show/hide expansion messages
    ExpansionAdvisory.tsx           # Inline advisory for expansion implications

    # Stage 2: Build spec
    ReadyToBuild.tsx                # Dual-path section (AI vs manual)
    BuildSpecPreview.tsx            # Preview modal with download/copy
    BuildSpecGenerator.tsx          # Generates markdown from plan

    # Sandbox infrastructure
    SandboxApiKeyCard.tsx
    PhoneVerification.tsx
    SandboxUsageCard.tsx
    QuickStartCard.tsx

    # Registration flow
    GoLiveCTA.tsx
    AreaCodeSelector.tsx

    # Registered components
    StatusCard.tsx
    ActionCard.tsx
    ApiKeysCard.tsx
    UsageCard.tsx
    DetailsCard.tsx
    ResourcesCard.tsx
    ProgressStepper.tsx
    ComplianceCard.tsx

    # Messages tab
    MessageLibrary.tsx
    MessageLibraryEntry.tsx

    # Compliance tab
    ComplianceStatus.tsx
    CanonMessagesRef.tsx
    DriftAlertCard.tsx

lib/
  build-spec/
    generator.ts                   # generateBuildSpec(plan, customer)
    template.ts                    # Build spec markdown template
    sandbox-guidelines.ts          # Sandbox SMS_GUIDELINES.md generator

  email/
    templates/
      sandbox-welcome.ts
      build-spec-ready.ts
      confirmation.ts
      otp-reminder.ts
      approval.ts
      rejection.ts
      drift-alert.ts
    send.ts
```

### Auth flow

1. **Sandbox signup:** Email → magic link → dashboard (Stage 1)
2. **Registration from dashboard:** "Register now" → intake wizard (pre-populated) → Stripe → back to dashboard (Stage 5)
3. **Direct registration (Phase 2, BYO Twilio):** Landing page → intake wizard (cold entry) → Stripe → dashboard
4. Subsequent visits: magic link from login page or email links

### Mobile

- Dashboard must be responsive
- Message plan cards stack vertically on mobile
- Build spec preview scrolls horizontally
- Tab nav becomes bottom tabs or hamburger on mobile
- API reference uses responsive layout for code examples

### State management

- Use case selection: persisted to Supabase immediately
- Message plan: persisted to Supabase on every change (autosave with debounce)
- Build spec: generated server-side, returned as string
- Lifecycle stage: computed from customer state, not stored separately
- Engagement signals: computed from usage data

---

## 17. DATABASE ADDITIONS

```sql
-- Message plans (new)
CREATE TABLE message_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) UNIQUE,
  use_case TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]',
  -- messages JSONB shape: see Section 4 data model for full field list
  -- includes: template_id, category, original_template, edited_text,
  -- trigger, variables (string[]), is_expansion, expansion_type, enabled
  build_spec_generated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add use_case to customers table if not already present
ALTER TABLE customers ADD COLUMN IF NOT EXISTS use_case TEXT;

-- Phase 2 guardrails (comments only, no schema changes now)
-- See PRD_10_PLATFORM_TIER.md for future tenants table
-- registrations: will add nullable tenant_id FK
-- api_keys: will add nullable tenant_id FK
-- customers: will add is_platform BOOLEAN, platform_config JSONB
```

---

## 18. WHAT THIS PRD DOES NOT COVER

Handled by other PRDs, unchanged:

- **Sandbox API behavior** (PRD_09) — message sending, compliance pipeline, Twilio forwarding
- **Registration pipeline** (PRD_04) — state machine, Twilio API calls, polling
- **Template engine** (PRD_02) — artifact generation logic (content expansion needed for 5-8 messages per use case, architecture unchanged)
- **Compliance site** (PRD_03) — static site generation and deployment
- **Post-registration deliverable** (PRD_05) — MESSAGING_SETUP.md and production SMS_GUIDELINES.md
- **Compliance monitoring** (PRD_08) — drift detection, inline enforcement rules
- **Landing page** (PRD_07) — marketing site and conversion flow
- **Pricing and Stripe** (PRICING_MODEL_UPDATE.md) — billing, subscriptions, overages
