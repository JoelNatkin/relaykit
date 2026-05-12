# Phase 2a Verification Extraction

**Date:** 2026-05-11
**Reference:** Per D-383 + D-384

**Scope:** Sources 1 + 3 only per D-383's 4-source methodology — Source 1 (competitor surface scan: Twilio Verify, Telnyx Verify, Plivo Verify, Sinch Verification) and Source 3 (starter kit scan: ShipFast, Supastarter, MakerKit, Vercel-Supabase). Extraction only — no audience-fit judgments, no pack-composition recommendations, no synthesis. Sources 2 + 4 (Indie SaaS practice scan, Community signal) land via PM follow-up chat per D-384.

**File-shape convention:**

- H3 per target; opening one-paragraph orientation (what the target is + domain-root sources for extraction); bolded-label fields with hybrid inline/code-block content; closing **Gaps:** line enumerating fields marked "source unclear" or "not observed in public docs."
- **Verbatim** content rendered as code blocks or block quotes where findable.
- Content marked **(paraphrased)** where summarization helps but the exact wording isn't preserved.
- **"not observed in public docs"** = looked, didn't find — distinct from **"source unclear"** = docs ambiguous about whether the feature exists at all.
- **Source:** URL trail per non-obvious field for PM traceability during synthesis.

---

## Source 1 — Competitor surface scan

### Twilio Verify

Twilio's managed verification API. Hosted multi-channel verification (the customer does not store codes themselves; Twilio handles code generation, delivery, validation, and lifecycle). Extraction sourced from `twilio.com/en-us/user-authentication-identity/verify` (product landing), `twilio.com/docs/verify` (API docs root and sub-pages), `twilio.com/en-us/verify/pricing` (pricing), `twilio.com/docs/verify/developer-best-practices` (best practices), and `help.twilio.com` (help-center articles for default-template detail).

**Positioning headline:**

> "Let good users in. Keep bad actors out with Verify API."

Sub-headline:

> "A fully managed turnkey API that verifies users over multiple channels at scale — handling 4.8B+ verifications each year."

**Source:** https://www.twilio.com/en-us/user-authentication-identity/verify

**Public-docs API surface:** Verify API v2 resources documented include Services, Verifications, Verification Attempts, Verification Attempts Summary, Verification Check, Templates, Safe List, Access Token, Entity, Factor, Challenge, Push Webhooks, Push Notifications, Service Rate Limits, Service Rate Limit Buckets. Channel coverage: SMS, Voice, Email, WhatsApp, TOTP (authenticator apps such as Authy or Google Authenticator), Push, Silent Network Auth (SNA), Silent Device Approval, Passkeys, Automatic Channel Selection.
**Source:** https://www.twilio.com/docs/verify/api

**Verbatim sample messages:**

From the Templates API docs:

```
Your {{friendly_name}} verification code is: {{code}}. Do not share this code with anyone.
```

```
Your verification code is: {{code}}. Do not share it.
```

From the developer-best-practices doc (placeholder shown with angle brackets as docs-prose convention; numeric `123456` is the rendered example):

```
Your <App Name> verification code is: 123456
```

From the Verify Help Center via Google search index (direct WebFetch on the help-center URL returned no rendered content; the quoted body below appears verbatim in the indexed search snippet):

```
Your {Service Friendly Name} verification code is: {code}
```

The help-center source also notes (paraphrased from the indexed snippet): message bodies are subject to change as Twilio continuously optimizes them to maximize clarity and OTP conversion while minimizing message-segment cost across languages.

**Source:** https://www.twilio.com/docs/verify/api/templates ; https://www.twilio.com/docs/verify/developer-best-practices ; https://help.twilio.com/articles/9960174409627-Is-it-Possible-to-Customize-the-Verification-Message-for-Verify- (via search index only)

**Variable/placeholder convention:** Templates use **double curly braces** — `{{variable_name}}` — per the Templates API documentation. Named template-resource properties documented: `sid`, `accountSid`, `friendlyName` (≤32 characters), `channels` (sms/voice only for templates), `translations` (with approval status, text, and timestamps). Per-verification request parameters that bind a template: `TemplateSid` (which template to use) and `Locale` (optional override for auto-detected language). The help-center indexed snippet renders the default template with single curly braces (`{code}`, `{Service Friendly Name}`) — likely a paraphrased/display rendering rather than the underlying API syntax; the Templates API docs are authoritative on `{{...}}`. Pre-approved and custom templates support SMS and Voice channels only; not all template features extend to Email/WhatsApp/Push.
**Source:** https://www.twilio.com/docs/verify/api/templates

**Opt-out language:** The Verify-specific developer-best-practices doc surfaced contains **no explicit guidance** on whether STOP/HELP language must appear inside OTP message bodies. Twilio's broader A2P 10DLC compliance docs prescribe opt-out language at the **campaign-registration level** (per CTIA): "upon receiving opt-out keywords from end users, Twilio customers are expected to send back an auto-generated response which must provide acknowledgment of the opt-out request and confirmation that no further messages will be sent" (paraphrased). Twilio recommends keeping default opt-out values or configuring advanced opt-out during campaign registration. Whether Twilio considers Verify OTP messages formally **exempt** from STOP/HELP-in-body inclusion is not stated in the Verify docs surfaced.
**Source:** https://www.twilio.com/docs/verify/developer-best-practices ; https://www.twilio.com/docs/messaging/compliance/a2p-10dlc

**Enumerated sub-uses (per Twilio Verify product landing):**

Three primary use-case categories with verbatim taglines:

- **Signup verification** — "Prevent fake account creation and create a secure signup experience for new users"
- **Login protection** — "Protect users from account takeovers by sending verification codes upon login"
- **Secure transactions** — "Validate users in real-time so you can confidently authorize high-value online transactions"

Additional sub-uses named on the same page (paraphrased, not verbatim taglines): account recovery, step-up authentication, transaction verification, profile/account changes, high-risk support flows, promotional abuse prevention, consent confirmation.

**Source:** https://www.twilio.com/en-us/user-authentication-identity/verify

**Pricing visibility:** Per-successful-verification base fee plus channel-specific surcharge.

- **SMS (US):** $0.05 per successful verification + $0.0083 per SMS = ~$0.058 per successful US SMS verification
- **Voice:** $0.05 per successful verification
- **Email:** $0.05 per successful verification
- **WhatsApp:** $0.05 per successful verification + $0.0034 per authentication template message (US)
- **Push & TOTP:** fee included in the $0.05 verification charge
- **Volume discounts:** "Custom" — contact sales for volume-based discounts (paraphrased)
- **Free trial:** "Start for free" available with no credit card required; no dedicated starter / indie-developer pricing tier observed

**Source:** https://www.twilio.com/en-us/verify/pricing

**Indie-SaaS-relevant positioning signal:** Landing-page calls-to-action emphasize developer-friendly onboarding: "Build first, buy later. Start your free trial today" and "There's no credit card required to sign up." (verbatim). The 4.8B+ verifications/year metric and "fully managed turnkey API" language read as enterprise-scale framing. **No explicit indie SaaS / founder / startup audience callout** observed in the landing surfaces examined. Free-trial gating is broad-developer rather than indie-SaaS-specific.
**Source:** https://www.twilio.com/en-us/user-authentication-identity/verify

**Gaps:**

- **Production-default Verify template body** — direct WebFetch on the help-center article returned no rendered content; the verbatim default-template text shown above is taken from the Google search-index snippet only. *(source unclear at the verbatim level — the snippet reads as a quotation from the article body, but direct page render unavailable)*
- **OTP-message exemption from STOP/HELP-in-body requirements** — *not observed in public docs* (Verify-specific docs do not explicitly address whether OTP bodies are exempt from carrier opt-out-language inclusion)
- **Device-verification as a named sub-use** — *not observed in public docs* as an explicitly enumerated sub-use; Silent Device Approval appears as a channel/factor type but is not pitched as a sub-use category on the landing page
- **SMS-as-login-link sub-use** — *not observed in public docs* (Twilio Verify is code-entry-shaped; magic-link-via-SMS is not the product's surface)
- **Exact rate-limit defaults at the API level** — Service Rate Limits and Service Rate Limit Buckets resources are named but specific default thresholds were not extracted from the API-overview surface
- **Template character-budget specifics beyond one-segment guidance** — best-practices doc says "Keep messages to one SMS segment (160 GSM characters or 70 non-GSM characters)" but exact segment-handling behavior for over-limit templates was not pulled

### Telnyx Verify

Telnyx's authentication API, positioned primarily as 2FA infrastructure. Managed verification with profile-scoped templates: the customer creates a Verify Profile, selects (or creates) a template, and triggers verifications through channel-specific endpoints. Telnyx handles code generation, delivery, and validation. Extraction sourced from `telnyx.com/products/verify-api` (product landing), `developers.telnyx.com/docs/identity/verify/` (Verify docs root including `/quickstart` and `/custom-templates`), `telnyx.com/pricing/verify-api` (pricing), and `support.telnyx.com` (help-center articles for sample messages and channel detail).

**Positioning headline:**

> "Create your own authentication program or build one into your existing product. Use a single phone verification API to reach users across all devices with OTP and more."

Sub-headlines (verbatim):

> "A two-factor authentication solution at a great price"

> "Simple two-factor authentication API"

> "Developer-friendly, scalable API"

**Source:** https://telnyx.com/products/verify-api

**Public-docs API surface:** Verify API v2 endpoints documented in the quickstart:

- `POST /v2/verify_profiles` — create a verify profile
- `GET /v2/verify_profiles/templates` — list available message templates
- `POST /v2/verifications/sms` — initiate SMS verification
- `POST /v2/verifications/call` — initiate voice-call verification
- `POST /v2/verifications/by_phone_number/{phone_number}/actions/verify` — submit user-entered code for validation

A flashcall endpoint exists by analogue to SMS/call (channel is described in the quickstart) but the exact path was not exposed verbatim on the quickstart surface examined. Supported channels per product surfaces: **SMS, Voice (Call), Flash Call, WhatsApp** (mentioned in product-landing configuration guides), and **PSD2** (Strong Customer Authentication for EU payments, exposed as a verification method alongside the channels).

**Source:** https://developers.telnyx.com/docs/identity/verify/quickstart ; https://telnyx.com/products/verify-api ; https://support.telnyx.com/en/articles/5701653-telnyx-verify-2fa-made-easy

**Verbatim sample messages:**

Default-template body (when no custom template is selected) per quickstart docs:

```
Your verification code is {code}.
```

Default template selectable via a known template SID (`0abb5b4f-459f-445a-bfcd-488998b7572d`), per quickstart sample:

```
Your {{app_name}} verification code is: {{code}}.
```

Custom-template example strings from the custom-templates docs:

```
Your {{app_name}} verification code is {{code}}. Do not share this code.
```

```
Your {{app_name}} verification code is {{code}}. Complete your purchase securely.
```

```
{{code}} is your {{app_name}} security code. Never share this with anyone.
```

```
Your {{app_name}} appointment verification code: {{code}}.
```

```
Your {{app_name}} delivery confirmation code is {{code}}.
```

Support-article examples (single-brace `{code}` rendering — likely paraphrased display rather than API-stored template syntax):

```
Hello, this is the Acme Inc verification code you requested: {code}.
```

```
Your code is {code} for payment to {payee} in the amount of {amount} {currency}.
```

```
Your verification code is {code}.
```

**Source:** https://developers.telnyx.com/docs/identity/verify/quickstart ; https://developers.telnyx.com/docs/identity/verify/custom-templates ; https://support.telnyx.com/en/articles/5701653-telnyx-verify-2fa-made-easy

**Variable/placeholder convention:** Templates use **double curly braces** — `{{variable_name}}` — per the custom-templates docs. Two named variables documented:

- `{{app_name}}` — application name as configured in the Verify Profile
- `{{code}}` — verification code sent to the user

`app_name` is set at Verify Profile creation; templates bind to a profile, so the `{{app_name}}` value resolves from the profile context. Quickstart and support-article examples use single-brace `{code}` syntax in some places — appears to be paraphrased/display rendering rather than the underlying API syntax; the custom-templates page is authoritative on `{{...}}`.

**Source:** https://developers.telnyx.com/docs/identity/verify/custom-templates

**Opt-out language:** Verify-specific docs (quickstart, custom-templates, support article) contain **no explicit guidance** on STOP/HELP language inside OTP message bodies. The custom-templates docs prescribe that templates "comply with industry regulations (HIPAA, PCI-DSS, GDPR), carrier SMS requirements, local laws, and organizational security policies" (paraphrased) but do not prescribe specific STOP/HELP-in-body content. Recommended security language called out is anti-phishing copy ("Never share this code with anyone", "If you didn't request this, contact support immediately"), not opt-out copy. Whether Verify OTP messages are formally exempt from STOP/HELP-in-body requirements is not stated in the Verify-specific surfaces examined.

**Source:** https://developers.telnyx.com/docs/identity/verify/custom-templates

**Enumerated sub-uses:**

Primary positioning is **2FA** as the umbrella. Sub-uses surface in quickstart and custom-template examples rather than as a single canonical enumeration on the landing.

From quickstart (verbatim use-case labels):

- "General account login and registration"
- "Payment confirmation workflows"
- "Two-factor authentication (2FA) across web and mobile applications"

From custom-template example shapes (sub-use implied by template content, paraphrased categorization):

- Payment / purchase verification — "Complete your purchase securely"
- Appointment verification — "appointment verification code"
- Delivery confirmation — "delivery confirmation code"
- General security / step-up auth — "security code"

From channel/method enumeration, **PSD2** (Strong Customer Authentication for EU payments) is surfaced as a distinct verification method — overlaps payment-verification sub-use with a regulatory-specific shape.

**Source:** https://developers.telnyx.com/docs/identity/verify/quickstart ; https://developers.telnyx.com/docs/identity/verify/custom-templates ; https://support.telnyx.com/en/articles/5701653-telnyx-verify-2fa-made-easy

**Pricing visibility:** Per-successful-verification fee plus channel-specific surcharge (channel API pricing applied on top).

- **SMS (US):** $0.03 per successful verification + SMS API pricing (Telnyx general SMS pricing starts at $0.004 per message per the broader Telnyx pricing surface — paraphrased)
- **Voice:** $0.03 per successful verification + Voice API pricing
- **Flash call:** $0.03 per successful verification + Flash pricing
- **WhatsApp:** not listed with specific pricing on the Verify pricing page
- **Volume discounts:** "Receive a discounted rate with the more you spend instead of our pay-as-you-go rates" — contract-based tier (paraphrased)
- **Free tier / trial:** not enumerated on the Verify pricing page; product landing notes "no monthly commitments" (paraphrased)
- **Starter / indie-developer tier:** none observed

**Source:** https://telnyx.com/pricing/verify-api

**Indie-SaaS-relevant positioning signal:** "Developer-friendly, scalable API" and "A two-factor authentication solution at a great price" — cost-conscious developer framing. Sub-headline framing positions Verify as a component to "build into your existing product," not a platform takeover. "No monthly commitments" lowers the entry barrier for small teams. No explicit indie SaaS / founder / startup audience callout observed in the surfaces examined; the framing is broad-developer with implicit cost-relative positioning.

**Source:** https://telnyx.com/products/verify-api ; https://telnyx.com/pricing/verify-api

**Gaps:**

- **Verbatim default-template syntax at the storage layer** — quickstart shows the no-custom-template default rendered as `Your verification code is {code}.` (single-brace); whether the underlying API-stored template uses `{{code}}` per the custom-templates `{{...}}` convention is *source unclear*
- **OTP-message exemption from STOP/HELP-in-body requirements** — *not observed in public docs* (Telnyx Verify-specific docs do not address whether OTP bodies are exempt from carrier opt-out-language inclusion)
- **WhatsApp Verify pricing** — *not observed in public docs* on the Verify pricing page (channel is named in product surfaces but per-verify pricing not enumerated)
- **Flash-call endpoint path** — *source unclear* (channel exists per quickstart channel description but exact endpoint path not exposed in the surface examined)
- **PSD2 endpoint detail and template requirements** — *source unclear* (PSD2 named as a method but per-PSD2 verification-request shape and template constraints not surfaced in the docs examined)
- **Device-verification, SMS-as-login-link, recovery-code-delivery sub-uses** — *not observed in public docs* as named sub-uses (Telnyx Verify shape is code-entry across SMS/Voice/FlashCall; magic-link-via-SMS is not the product's surface)
- **Free trial / sandbox / test credits for Verify specifically** — *not observed in public docs* on the Verify pricing or product pages
- **Exact character/segment limits beyond the 160-character recommendation** — custom-templates page recommends "Keep your templates under 160 characters when possible to avoid message splitting and additional costs" (verbatim); exact over-limit segment-handling behavior not pulled
- **Rate-limit defaults** — *not observed in public docs* in the surfaces examined
