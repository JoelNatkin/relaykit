# DECISIONS.md — RelayKit
## Authoritative Decision Log

> **How this file works:**
> - CC reads this at the start of every session (triggered by `DECISIONS CHECK` command)
> - CC checks relevant entries before implementing anything touching architecture, data model, pricing, UX copy, or compliance logic
> - When a new decision is made during a session, CC appends it at the end under `## New This Session` with date and context
> - When a direction in this session contradicts an existing entry, CC stops and flags it explicitly: `"⚠ DECISION CONFLICT: This contradicts D-[number]. Proceeding would mean [X]. Confirm override before I continue."`
> - Joel reviews and either confirms the override (updating the entry) or reverts the direction

---

## ARCHITECTURE

**D-01 — Twilio ISV model: subaccounts per customer**
Each customer gets a dedicated Twilio subaccount (Architecture #1). Never a shared account or Messaging Service shared across customers. Subaccount isolation means one customer's compliance issues cannot affect another's traffic or trust score.
_Alternatives rejected: Architecture #4 (shared account with Messaging Services) — rejected because proxy enforcement requires per-customer isolation and subaccount credentials._
_Affects: PRD_04, PRD_09, all Twilio API calls_

**D-02 — No Twilio SDK — fetch() only**
All Twilio API calls use `fetch()` against the Twilio REST API directly. No `twilio` npm package anywhere in the codebase.
_Reason: Avoids SDK version lock, keeps the dependency surface small, works identically across Edge Runtime and Node._
_Affects: PRD_04, PRD_09, all lib/twilio/ files_

**D-03 — Magic link auth only — no passwords**
Authentication is Supabase magic link exclusively. No password fields, no OAuth, no session tokens beyond what Supabase manages.
_Affects: All auth surfaces, signup flow, dashboard access_

**D-04 — Deterministic template generation — no AI for compliance artifacts**
The template engine uses string interpolation exclusively. No LLM generation for campaign descriptions, sample messages, opt-in copy, or compliance site content. Output must be deterministic and reproducible for regulatory submissions.
_Reason: Carrier-evaluated compliance content must be consistent. AI generation introduces variance that can cause rejections on resubmission._
_Affects: PRD_02, lib/templates/, all generateArtifacts() calls_

**D-05 — Compliance sites on Cloudflare Pages, neutral domain**
Static HTML compliance sites are deployed to Cloudflare Pages on a RelayKit-controlled neutral domain (not the customer's domain). This is included in the setup fee.
_Reason: Customers without websites need a compliant URL for carrier review. Neutral domain means RelayKit controls uptime and content integrity._
_Affects: PRD_03, lib/compliance-site/_

**D-06 — Messaging proxy architecture — all traffic through RelayKit**
Every customer message routes through RelayKit's proxy before reaching Twilio. This is Architecture #1 and is non-negotiable in v1.
_Reason: (1) Platform protection — violations blocked before carriers see them. (2) Revenue alignment — usage metering is a byproduct of routing. (3) Customer stickiness — integration lock-in before payment._
_Alternatives rejected: Direct-to-Twilio delivery — rejected because async monitoring detects violations after carriers see them, which is too late for ISV trust score protection._
_Affects: PRD_09, all /v1/messages handling_

**D-07 — MESSAGING_SETUP.md template is canonical in PRD_05 Section 3.1**
The authoritative home for the MESSAGING_SETUP.md template is PRD_05_DELIVERABLE.md Section 3.1. PRD_09 Section 10 references it; it does not redefine it. No other PRD should contain a competing template definition.
_Affects: PRD_05, PRD_09_

**D-08 — resolveMessageContext() pattern for Phase 2 readiness**
The proxy pipeline uses an explicit `resolveMessageContext()` function that takes the authenticated customer (and future optional `tenant_id`) and returns registration details, subaccount credentials, canon messages, and compliance rules. All downstream checks use this context object — never reaching back to the customer record for business details.
_Reason: Phase 2 platform tier will supply context from tenant records. This pattern makes the migration non-breaking._
_Affects: PRD_09, lib/proxy/compliance-pipeline.ts_

**D-09 — Business-identity fields are authoritative on registrations, not customers**
Phone number, campaign SID, canon messages — these live on the `registrations` record. The `customers` record may denormalize for convenience. Exception: `twilio_subaccount_sid` is correctly customer-scoped (one subaccount per customer, shared across registrations in Phase 2).
_Affects: Database schema, all queries touching registration identity fields_

---

## DATA MODEL

**D-10 — message_plans: no UNIQUE constraint on customer_id**
The `message_plans` table does NOT have a UNIQUE constraint on `customer_id`. Phase 2 multi-project allows multiple plans per customer.
_Affects: PRD_06 schema, Supabase migration_

**D-11 — Nullable project_id columns added now for Phase 2 migration**
`message_plans` and `api_keys` both have a nullable `project_id UUID` column from day one, with a migration comment: "Phase 2: multi-project. Will become NOT NULL after migration." Do not build project-switching UI or `/dashboard/[projectId]/` URL structure in v1.
_Affects: PRD_06 schema, PRD_11 (Phase 2)_

**D-12 — business_industry is nullable on customers table**
`customers.business_industry` is TEXT nullable. Populated from `business_description` at intake by vertical detection. No breaking change in v1.
_Affects: PRD_06 schema, PRD_02 vertical detection_

**D-13 — Canon messages stored as JSONB on registrations table**
Canon messages (the 3 messages selected for TCR submission) are snapshotted as a JSONB column on the `registrations` record at registration time. Drift detection compares production messages against this snapshot, not against the live message plan.
_Reason: Registration content must be immutable after submission. The plan builder can change; the registration cannot._
_Affects: PRD_06, PRD_08 BM-09, lib/compliance/drift-analyzer.ts_

**D-14 — recipient_consents table for MIXED tier marketing consent**
Marketing consent is tracked in a dedicated `recipient_consents` table with `consent_type IN ('transactional', 'marketing')`. Not stored on the opt-outs table. MIXED tier proxy checks this table before delivering marketing-classified messages.
_Affects: PRD_08 BM-10, PRD_09 /v1/consents endpoint, lib/proxy/compliance-pipeline.ts_

---

## REGISTRATION & COMPLIANCE

**D-15 — Campaign registration is static after approval**
An approved TCR campaign cannot be modified. Adding marketing capability post-registration requires registering a **second campaign** on the existing subaccount — not upgrading or modifying the existing one.
_Copy rule: "We'll register an additional campaign" — never "upgrade your registration."_
_Affects: PRD_01 expansion logic, PRD_04, PRD_06 dashboard expansion CTA, all UX copy_

**D-16 — MIXED tier registered from day one**
If a customer selects marketing capability (via expansion options or explicit MIXED election), their campaign type is determined at intake and registered as MIXED from the start. There is no upgrade path from transactional to MIXED within the same campaign.
_Affects: PRD_01 determineCampaignType(), PRD_04 submission, PRICING_MODEL_

**D-17 — Campaign review timing is 2–3 weeks**
Current TCR baseline is 10–15 business days (~2–3 weeks). Never write "5–7 days" or "3–10 business days" anywhere — in UI copy, emails, PRDs, or documentation.
_Affects: PRD_06 pending state copy, PRD_09 engagement nudge copy, all email templates, all marketing copy_

**D-18 — Healthcare/HIPAA is a hard decline at intake**
Healthcare and HIPAA-adjacent use cases are declined during intake. No BAA. No PHI routing through the proxy. This is a platform constraint, not a product gap.
_Affects: PRD_01 use case selection, prohibited business screening_

**D-19 — Compliance monitoring is non-optional for all customers**
Drift detection and inline compliance enforcement apply to all paying customers. There is no opt-out and no paid tier for compliance. Charging separately would create ISV liability without visibility.
_Reason: RelayKit shares ISV account risk. A customer who opts out and sends noncompliant content puts the entire platform at risk._
_Affects: PRD_08, PRD_09 compliance pipeline, PRICING_MODEL_

**D-20 — $15 re-vetting fee absorbed by RelayKit**
Campaign resubmission after rejection incurs a $15 Twilio/TCR vetting fee. RelayKit absorbs this as a COGS line item. It is not passed to the customer. Track `resubmission_count` per registration; 3+ rejections flagged for manual review as a margin risk signal.
_Affects: PRICING_MODEL unit economics, PRD_04 rejection handling_

**D-21 — Rejection surfaces as debrief, not error**
Rejection cards and emails must include: (1) plain-language explanation of what was flagged, (2) why it triggers a carrier flag, (3) exact fix being applied, (4) what an approved version looks like. Never show raw error codes or "our team is reviewing" language.
_Affects: PRD_04 rejection table, PRD_06 Section 10.7, email template Email 5_

**D-22 — Sole prop OTP: 3-use lifetime limit advisory**
TCR limits a phone number to 3 lifetime brand verifications across all providers. Surface an advisory before sole prop OTP submission. Never suppress this warning.
_Affects: PRD_04 AWAITING_OTP state, PRD_06 OTP action card_

**D-23 — EIN 5-brand limit detection (Phase 2 TODO)**
TCR allows max 5 Standard Brands per EIN. Detection and blocking before a 6th registration is submitted is a Phase 2 TODO (D-04 in PRD_04 Phase 2 section). Do not silently allow a 6th submission.
_Affects: PRD_04 TODO-P2-03_

**D-24 — Multi-channel opt-out required (April 2025 TCPA)**
Any reasonable means of opt-out must be honored — not just STOP keyword. Email, web form, phone call, natural language ("leave me alone") all qualify. Developers must call `POST /v1/opt-outs` when any channel receives a revocation request. `SMS_GUIDELINES.md` instructs AI coding tools to implement this pattern.
_Affects: PRD_08 sms_opt_outs schema, PRD_09 /v1/opt-outs endpoint, SMS_GUIDELINES_TEMPLATE_

**D-25 — Authentication+ 2.0 state added to state machine**
`AWAITING_BRAND_AUTH` is a valid registration state for public/for-profit brands that must click a TCR email verification link. Dashboard card: "Check your email — TCR sent a verification link to {email}. Click it within 7 days."
_Affects: PRD_04 RegistrationStatus enum, PRD_06 status card_

**D-26 — BYO Twilio is Model 2, not Model 3**
BYO Twilio registration creates a Primary Customer Profile in the customer's own Twilio Trust Hub — not a subaccount under RelayKit's ISV. This means their traffic does not flow through RelayKit's account.
_Reason: Model 3 (subaccount under ISV + direct credentials) would route their traffic through our ISV account without proxy coverage. Unmonitorable ISV risk._
_Phase 2 — do not build in v1._
_Affects: PRD_09 Section 11, PRICING_MODEL Section 3_

---

## PRICING

**D-27 — Core pricing: $199 setup + $19/month transactional + $29/month mixed**
- $199 one-time setup fee (registration, compliance site, artifacts, rejection handling)
- $19/month transactional tier (500 messages included)
- $29/month mixed tier (transactional + marketing campaign + recipient consent enforcement)
- $15 per additional 1,000 message block (auto-scaling)
_Affects: PRICING_MODEL, PRD_01 Stripe checkout, all marketing copy_

**D-28 — Sandbox is permanently free**
The sandbox tier is free with no time limit, no credit card required. Sandbox messages route through a shared RelayKit Twilio number to the developer's verified phone only.
_Reason: Sandbox is customer acquisition cost. At 100 sandbox developers sending 50 messages/day, carrier cost is ~$40/day — cheaper than paid acquisition._
_Affects: PRD_09 sandbox, PRICING_MODEL Section 1_

**D-29 — Compliance Shield paid tier removed**
There is no paid compliance tier. Drift detection and all compliance enforcement is baseline for all paying customers. The former $29/month Compliance Shield tier is eliminated.
_Affects: PRICING_MODEL, PRD_08_

**D-30 — Multi-project billing: $199 + $19/$29 per project (Phase 2)**
Each registered project carries its own subscription. All subscriptions under one Stripe Customer record. Sandbox projects always free regardless of count.
_Phase 2 — do not build in v1._
_Affects: PRICING_MODEL Section multi-project, PRD_11_

---

## UX & COPY

**D-31 — Experience Principles doc is mandatory before writing copy**
`V4_-_RELAYKIT_EXPERIENCE_PRINCIPLES.md` must be read before writing any user-facing string. The vocabulary table and framing shift table are binding constraints on all UI copy, emails, error messages, status text, button labels, and tooltips.
_No exceptions for "minor" strings._
_Affects: All components with user-facing text_

**D-32 — Pending states always have narrative — never just a badge**
Every waiting or pending state must include: what's completed, what's happening now, what's next, and a "keep building" prompt. A status badge alone is never sufficient.
_Affects: PRD_06 Section 10.1 stepper copy, all registration status states_

**D-33 — Approval moment has required copy — do not genericize**
The approval moment copy ("Most developers never get here. You did.") is intentional and must not be softened, shortened, or replaced with generic "You're live!" language.
_Affects: PRD_06 Section 10.6 resources card, Email 4_

**D-34 — Read-only campaign content in review screen**
Campaign descriptions and sample messages are read-only in the wizard review screen. Users cannot edit compliance-critical content that has been generated for carrier submission.
_Reason: Edits to carrier-evaluated content cause rejections on resubmission._
_Affects: PRD_01 Screen 4 (review), template engine output display_

**D-35 — Three-tier message library structure**
Messages in the plan builder and library are organized into three tiers: (1) Included with registration (default on, green), (2) Also available with registration (default off, gray — unspent capacity), (3) Requires additional campaign (expansion, starred). Tier 2 toggling does not change registration scope. Tier 3 triggers second campaign registration.
_Affects: PRD_06 Sections 4 and 12, message plan builder UI_

**D-36 — Canon messages = "registered messages" in developer-facing UI**
Internal term is "canon messages." Developer-facing label is "registered messages" — clearer for the audience. Drift alerts say "your messages drifted from your registration" not "from your canon."
_Affects: PRD_06 message library, PRD_08 drift alert copy, all developer-facing UI_

**D-37 — Expansion options are "second campaign," never "upgrade"**
When a customer adds marketing capability post-registration, it is a second campaign registration. Copy must say "We'll register an additional campaign" — never "upgrade your registration" or "expand your plan."
_Affects: PRD_01 expansion UI, PRD_06 dashboard expansion CTA, PRD_04 TODO-P2-02_

**D-38 — ISV legal posture: never guarantee compliance outcomes**
RelayKit is a telecom compliance registration platform, not a compliance attorney. Never write copy implying compliance outcomes are guaranteed.
_Prohibited phrases: "ensures compliance," "guarantees approval," "fully compliant messaging," "we handle compliance," "stay compliant automatically."_
_Affects: All marketing copy, onboarding copy, dashboard copy, emails_

**D-39 — Field annotations are one sentence maximum**
"Why this matters" annotations on form fields are exactly one sentence. Never a paragraph.
_Affects: PRD_01 Screen 3 business details, all form field help text_

---

## DELIVERABLES & DOCUMENTS

**D-40 — Three-document lifecycle model**
Developers receive three documents across two stages:
1. `SMS_BUILD_SPEC.md` — sandbox, pre-payment, generated from message plan builder
2. `SMS_GUIDELINES.md` (sandbox edition) — sandbox, pre-payment
3. `MESSAGING_SETUP.md` + `SMS_GUIDELINES.md` (production) — post-registration approval
_Affects: PRD_05, PRD_06 build spec generator, dashboard Resources card_

**D-41 — Build spec is primary sandbox deliverable and conversion mechanism**
The build spec is designed to be good enough that even experienced developers choose it over manual integration. It creates investment (real time building) before any money changes hands, which is the primary conversion mechanism.
_Affects: PRD_05, PRD_06 Section 5_

**D-42 — generateArtifacts() selects exactly 3 messages for TCR**
`generateArtifacts()` selects exactly 3 messages from the full template set for Twilio/TCR campaign submission. `getMessageTemplates()` returns the full library for the dashboard plan builder. These are two separate functions with separate purposes.
_Affects: PRD_02, lib/templates/_

---

## PHASE 2 — DO NOT BUILD IN V1

**D-43 — Phase 2 items are explicitly out of scope for v1**
The following must not be built in v1: BYO Twilio tier, Platform/multi-tenant tier (PRD_10), multi-project dashboard (PRD_11), toll-free number path, brand re-use for second projects (PRD_04 TODO-P2-01), second campaign registration pathway UI (PRD_04 TODO-P2-02), EIN 5-brand limit detection (PRD_04 TODO-P2-03), Authentication+ 2.0 expansion to all brands (PRD_04 TODO-P2-04), advanced rate limiting with queue mode, sandbox behavior analysis for use case inference.
_Any PRD section marked "Phase 2" or "BYO Twilio" is out of scope._

---

## New This Session

_CC appends new decisions here during build sessions. Format:_
_**D-[next number] — [Title]** (Date: YYYY-MM-DD)_
_Decision, reason, alternatives considered if any, files affected._

**D-44 — Pre-registration use case stored in Supabase user metadata, not customers table** (Date: 2026-03-05)
Sandbox users don't have a `customers` row until intake/payment — the customers table requires many NOT NULL fields (business_name, business_description, contact info, etc.) that aren't collected until the intake wizard. Pre-registration use case selection is persisted to `auth.users.raw_user_meta_data` via `supabase.auth.updateUser({ data: { use_case } })`. The dashboard layout reads from user metadata when no customer record exists, falling back to `customer.use_case` post-payment. When a customer record is created at checkout, the use_case value is copied from user metadata to the customers table.
_Alternative rejected: Creating a minimal customers row with nullable fields — would require schema changes to the existing customers table and risk breaking the intake/checkout flow._
_Affects: `src/app/api/use-case/route.ts`, `src/app/dashboard/layout.tsx`, `POST /api/checkout` (future: copy metadata to customer record)._

**D-45 — Sandbox API keys stored in plaintext in user metadata** (Date: 2026-03-05)
Pre-registration sandbox API keys are stored as full plaintext in `auth.users.raw_user_meta_data.sandbox_api_key`. This differs from production keys (which are SHA-256 hashed in the `api_keys` table, shown once, never retrievable). The plaintext approach is justified because sandbox keys are low-security: limited to 100 messages/day, deliver only to the developer's verified phone, and must be re-displayable on the dashboard. Post-registration, sandbox keys move to the `api_keys` table with proper hashing.
_Alternative rejected: Hashing sandbox keys like production keys — would prevent re-display on the dashboard, forcing a "shown once" UX that conflicts with the sandbox's learn-as-you-build experience._
_Affects: `src/app/api/sandbox-key/route.ts`, `src/components/dashboard/sandbox-api-key-card.tsx`._

**D-46 — Sandbox phone verification uses Twilio Verify API, separate from TCR brand OTP** (Date: 2026-03-05)
Sandbox phone verification (verifying the developer's phone number for sandbox message delivery) uses the Twilio Verify API via `TWILIO_VERIFY_SID`. This is a completely separate flow from the TCR brand OTP verification in `src/app/api/otp/route.ts` (which submits OTP codes to Twilio Trust Hub for brand identity verification). The verified phone is stored in user metadata as `verified_phone`.
_Affects: `src/app/api/phone-verify/route.ts`, `src/components/dashboard/phone-verification-card.tsx`, `src/app/dashboard/layout.tsx`._

**D-47 — Messages tab is read-only library; plan builder lives only on Overview** (Date: 2026-03-05)
The Messages tab shows a read-only message library with a "Edit your message plan" link back to the Overview tab. The plan builder component is not duplicated on the Messages tab to avoid dual-instance sync issues (two interactive instances of the same component writing to the same `/api/message-plan` endpoint). Post-registration, the Messages tab shows canon messages (from registration JSONB) marked with a star badge and "Registered message" label (D-36).
_Alternative rejected: Rendering the plan builder on both tabs — would require shared state synchronization or real-time updates between two instances of the same component._
_Affects: `src/app/dashboard/messages/page.tsx`, `src/components/dashboard/message-library.tsx`, `src/components/dashboard/message-library-entry.tsx`._

**D-48 — Email templates are deterministic functions, no provider wired yet** (Date: 2026-03-05)
Email templates (Emails 0–5) are implemented as deterministic string interpolation functions in `src/lib/emails/templates.ts` returning `{ subject, body }` objects. No email provider (Resend, SendGrid, etc.) is integrated yet — templates are ready to plug into any provider. Emails 6–7 (drift alert, message blocked) are deferred to the PRD_08 compliance monitoring build since they depend on drift detection infrastructure that doesn't exist yet.
_Affects: `src/lib/emails/templates.ts`, `src/lib/emails/types.ts`._

**D-49 — Intake wizard needs three-tier industry gating before beta** (Date: 2026-03-05)
Before beta launch, the intake wizard (PRD_01 Screen 2) needs a three-tier industry gating layer: Tier 1 (advisory guidance, proceed allowed) for industries like legal, financial, restaurants that have elevated carrier scrutiny but are registrable. Tier 2 (hard decline with waitlist CTA) for healthcare — no HIPAA/BAA per D-18. Tier 3 (hard decline, no waitlist) for cannabis and firearms — carrier ecosystem exclusions that cannot be registered under any circumstance. Implementation: extend `SENSITIVE_INDUSTRIES` config with cannabis/firearms patterns and add blocking logic during the PRD_01 dashboard-path build (Step 4).
_Affects: `src/lib/intake/` (future), PRD_01 Screen 2 business details._
