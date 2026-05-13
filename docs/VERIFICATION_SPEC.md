# Verification Specification

> **Purpose:** Canonical OTP/verification feature surface — SDK contract (sendCode/checkCode per namespace), server endpoint (`POST /v1/verify/check`), code storage schema, validation logic, rate limits, TTL, customizability, dashboard panel, onboarding integration. Drives D-369/D-370/D-371.
>
> Not for: verification UI screens (PROTOTYPE_SPEC), carrier-level verification API differences, marketing copy about verification (MARKETING_STRATEGY).

## 1. Scope and intent

D-360 named OTP as a universal primitive included with every vertical. D-369 extends that decision by committing to launch-scope validation infrastructure (server endpoint, code storage, rate limits) so the marketing pillar "Verification included" is truthful at launch — not a send-only claim that pushes verification logic onto the developer. This spec is the single source for how that commitment manifests across server, SDK, dashboard, and onboarding surfaces.

## 2. SDK contract

Every vertical namespace exposes the symmetric pair per D-370:

- `relaykit.{namespace}.sendCode(phone, { code })` — sends a verification SMS containing the developer-supplied code
- `relaykit.{namespace}.checkCode(phone, code)` — validates a code submitted back from the user

The verification namespace additionally exposes:

- `relaykit.verification.sendPasswordReset(phone, { code })`
- `relaykit.verification.sendNewDevice(phone, { device })`

Code generation: developer-supplied (RelayKit does not auto-generate codes). Preserves the existing pattern from D-360 and current SDK.

Validation response shape:

{ valid: true }
or
{ valid: false, reason: 'expired' | 'incorrect' | 'too_many_attempts' | 'no_pending_code' }

The reason enum lets developers render appropriate user-facing error states without ambiguity.

## 3. Server endpoint

POST /v1/verify/check

Request body: { phone, code, namespace? }

Response: validation result per §2.

Auth: Bearer token (account API key).

Rate-limit: per §6.

## 4. Code storage

Postgres table `verification_codes`:

- id (uuid, primary key)
- phone_hash (sha256 of E.164 phone)
- code_hash (bcrypt cost 10)
- namespace (text, foreign key conceptually — the namespace the send/check is scoped to)
- account_id (foreign key)
- created_at (timestamp)
- expires_at (timestamp)
- attempts_count (integer, default 0)
- consumed_at (timestamp, nullable)

TTL: 10 minutes per D-360 default, locked.

Code length: 6 digits per D-360 default, locked.

Send-side invariant: when a sendCode call lands for a phone+namespace+account combination that already has an active (non-expired, non-consumed) code, the prior code is invalidated (set expires_at = now()) before the new one is created. One active code per phone per namespace at any time. Prevents stale-code confusion.

Daily Postgres cron drops rows where expires_at < now() - interval '24 hours' to keep the table bounded.

## 5. Validation logic

On checkCode call:

1. Lookup active code: SELECT WHERE phone_hash = ? AND namespace = ? AND account_id = ? AND consumed_at IS NULL AND expires_at > now() ORDER BY created_at DESC LIMIT 1
2. If no row found: return { valid: false, reason: 'no_pending_code' }
3. If row found and attempts_count >= 10: return { valid: false, reason: 'too_many_attempts' } and set expires_at = now() (invalidate the code)
4. Increment attempts_count atomically
5. Bcrypt-compare submitted code against code_hash
6. On match: set consumed_at = now(), return { valid: true }
7. On mismatch: return { valid: false, reason: 'incorrect' }

The 'expired' reason fires when expires_at <= now() at lookup time — falls into the no_pending_code path naturally, but the response distinguishes them by checking whether an expired-but-recent row exists.

## 6. Rate limits

Layered limits per D-369:

- **Per-phone-number**: max 5 send attempts per hour, max 10 check attempts per code (after which code is invalidated per §5). Prevents SMS bombing of a target user.
- **Per-API-key**: max 100 sends/min default, configurable per account tier. Prevents a compromised key from blasting OTPs.
- **Per-account**: daily ceiling with alerting at threshold. Prevents fraud-driven cost overruns.

Account-tier escalation handled via support ticket at launch (BACKLOG entry tracks the dashboard self-serve path post-launch).

Defaults are conservative; legitimate retry flows (resend after expired) unaffected at these levels.

## 7. Customizability (per D-371)

Verification template body is editable by the developer with compliance gates matching the canon-template pattern (D-356):

- Required and immutable: `{code}` placeholder
- Required: opt-out language ("Reply STOP to opt out" or equivalent)
- Character cap: matches existing canon template cap
- AI polish: available via existing "Ask AI: polish my edit" affordance
- Locked: code length (6 digits), TTL (10 minutes)

The {code} requirement extends the existing compliance gate set in /prototype/lib/editor/ — same enforcement model, one additional required placeholder for verification templates only.

## 8. Dashboard Verification panel

Placement: above Messages list on workspace page. Visual treatment distinct from message cards — it is a panel for the included Verification feature, not a message in the per-vertical catalog.

Contents at launch:

- Editable verification template per §7
- Test-send affordance (round-trip with code entry, restricted to RelayKit-account-holder verified phones during beta)
- Recent Activity rows capped at 5 (matches other message cards)
- "View all" clickthrough to full message log: out of scope at launch — BACKLOG entry tracks the cross-cutting full-message-log work that affects every message type, not OTP-specific

Out of scope at launch:

- TTL/code-length config (locked at 6/10)
- Rate-limit config (server-managed, support-escalated; dashboard self-serve in BACKLOG)
- Debug mode toggle (already exists at message-type level — Verification inherits)

Onboarding wizard: no Verification panel. Verification renders identically to other verticals' message lists in wizard view. The activation moment for verification is the onboarding round-trip OTP test (§9), not a settings panel.

## 9. Onboarding integration

Activation event: round-trip OTP test as part of get-started flow.

Test path:

1. RelayKit calls verification.sendCode server-side using a generated code
2. User receives SMS at their RelayKit-account verified phone
3. User enters code into form
4. RelayKit calls verification.checkCode with submitted code
5. On success: green check, "Verification works. You're ready to integrate."
6. On failure: try again

Restriction at beta: RelayKit-account-holder phones only — limits abuse during the beta period when nothing else is gated yet.

This is the proves-it-works moment in the onboarding funnel. Tracked as the activation milestone in funnel analytics.

## 10. Template registry reconciliation

Current state surfaced during PM Session 62 reconnaissance:

- API registry (api/src/templates/registry.ts) has 3 verification templates: verification_login_code, verification_password_reset, verification_new_device
- Prototype catalog (prototype/data/messages.ts) has 8 verification templates: the 3 above plus verification_signup_code, verification_mfa_code, verification_device_confirmation, verification_security_tip, verification_welcome, verification_feature_announcement

Resolution: prototype is the source of truth (D-163). API registry extends to match prototype's 8 verification templates. Phase 6 work item.

## 11. Beta MVP relationship

Per BACKLOG entry "OTP-led beta MVP, vertical-diverse registration":

- Beta users complete full carrier registration for their chosen vertical (appointments, orders, support, etc.)
- During beta, OTP/verification functionality is the only end-to-end working flow
- Non-OTP verticals "coming soon" in dashboard
- Phase 6 completion unblocks the beta MVP

## 12. Marketing surface

Pillar wording per PM Session 62 resolution: **"Verification included."**

Expanded copy when context allows:

> "...built-in phone verification you can use for account verification, login codes, sensitive-action confirmation, device verification..."

Per starter integration guide:

> "While you're here, RelayKit handles phone verification too — same SDK, no extra setup."

The word "verification" is the convergence anchor — covers the full surface (account verification, login codes, sensitive-action confirmation, device verification) without committing to "auth platform" framing or developer jargon.

BACKLOG entry tracks the marketing surface rollout (homepage, pricing page, every starter guide).
