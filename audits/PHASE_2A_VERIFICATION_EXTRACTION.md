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

### Plivo Verify

Plivo's verification API. API model exposes a Verify Application (configured at Plivo console with brand name, OTP length, expiry, retry attempts, and template) and verification Sessions (created and validated via two endpoints). No per-verification platform fee — customer pays channel cost only. Extraction sourced from `plivo.com/verify/` (product landing), `plivo.com/docs/verify/` (API docs root including `/api/overview/` and `/api/session/create-a-session`), `plivo.com/verify/pricing/` (pricing), and `plivo.com/blog/` posts for code-sample detail.

**Positioning headline:**

> "Verify new users with Plivo"

> "Eliminate fake accounts and verify customers anywhere, in real time, with a 95% conversion rate."

Sub-headline:

> "Plivo Verify is the best way to secure users & boost OTP conversions"

**Source:** https://www.plivo.com/verify/

**Public-docs API surface:** Two primary API operations documented:

- **Create Session API** — initiates OTP delivery
- **Validate Session API** — confirms user-entered OTP

Key Create Session parameters per the docs overview and blog: `recipient` (phone number), `app_uuid` (Verify Application identifier), `channel` (sms or voice), `locale` (language override), `url` and `method` (callback for OTP final-state delivery), `otp` (optional — customer-supplied OTP instead of Plivo-generated). Channels per the API overview: SMS and Voice. Channels per the product landing: SMS, Voice, WhatsApp listed as Active; RCS and Email noted as coming soon (paraphrased).

**Source:** https://www.plivo.com/docs/verify/api/overview/ ; https://www.plivo.com/verify/ ; https://www.plivo.com/docs/verify/api/session/create-a-session

**Verbatim sample messages:**

Template example shown in the API overview as the default structure:

```
Your ${brand} verification code is ${code}
```

The 5-minute-tutorial blog shows code-side parameter usage (recipient, app_uuid, otp, locale) but does not surface the rendered SMS message body in prose form (paraphrased).

**Source:** https://www.plivo.com/docs/verify/api/overview/ ; https://www.plivo.com/blog/send-sms-verification-code-in-5-minutes/

**Variable/placeholder convention:** Templates use **dollar-sign plus curly braces** — `${variable_name}` — per the API overview. This is distinct from the `{{variable_name}}` convention used by Twilio Verify and Telnyx Verify. Two named template variables documented:

- `${brand}` — brand name configured at Verify Application creation
- `${code}` — the OTP

Verify Application–level configurable settings per the overview: Brand name, Code length, Expiry, Attempts, Template.

**Source:** https://www.plivo.com/docs/verify/api/overview/

**Opt-out language:** Plivo Verify–specific docs (API overview, Create Session API reference, Verify support category) contain no explicit guidance on STOP/HELP language inside OTP message bodies (paraphrased). No prescription about opt-out copy at the template-authoring level was observed in the Verify surfaces examined. Whether Verify OTP messages are formally exempt from STOP/HELP-in-body requirements is not stated.

**Source:** https://www.plivo.com/docs/verify/api/overview/

**Enumerated sub-uses:**

Product landing names broad framings (eliminate fake accounts, user verification, account security) without a discrete sub-use enumeration (paraphrased).

From the 5-minute-tutorial blog, example application domains (verbatim):

> "Financial institutions, e-commerce sites, streaming platforms, and delivery apps."

Additional sub-use phrases pulled from the same blog (verbatim):

> "peer-to-peer payment platform"

> "unauthorized purchases or account takeovers"

Two-factor and multi-factor authentication are framed across blog and product surfaces as the umbrella security pattern (paraphrased).

**Source:** https://www.plivo.com/verify/ ; https://www.plivo.com/blog/send-sms-verification-code-in-5-minutes/

**Pricing visibility:** Per-verification platform fee is $0 — customer pays channel cost only.

- **Per-verification platform fee:** $0 — verbatim: "$0 OTP Verification costs" and "Only pay SMS, Voice, or WhatsApp channel charges."
- **SMS (US):** verbatim: "Starts at $0.0077/sms"
- **Voice:** verbatim: "Starts at $0.0115/min"
- **WhatsApp:** verbatim: "Starts at $0.0143/conversation"
- **Fraud Shield:** verbatim: "$0 for Plivo Fraud Shield" — included at no extra cost
- **Free tier / trial:** sign-up flow advertises free credits with no credit card required (paraphrased from page copy); specific credit amount not surfaced
- **Volume discounts:** none observed in the pricing calculator — verification rates remain constant across volume tiers (paraphrased)
- **Starter / indie-developer tier:** none observed

Carrier surcharges (AT&T, T-Mobile, Verizon) apply on top of the base SMS rate per the broader Plivo SMS pricing landing (paraphrased).

**Source:** https://www.plivo.com/verify/pricing/

**Indie-SaaS-relevant positioning signal:** The 5-minute-tutorial blog leads with speed-of-integration framing. Verbatim:

> "Our API allows you to send your first OTP in 90% less implementation time than a legacy verification solution."

> "Start sending OTPs in one second with Plivo's Verify API."

> "in just 5 minutes."

The $0 verification fee plus free credits and no-credit-card signup lower the entry barrier for small teams (paraphrased). No explicit indie SaaS / founder / startup audience callout observed in the surfaces examined; the framing is broad-developer with implicit cost-and-speed-relative positioning vs. Twilio.

**Source:** https://www.plivo.com/blog/send-sms-verification-code-in-5-minutes/ ; https://www.plivo.com/verify/pricing/

**Gaps:**

- **Production-default English template body beyond the docs sample** — overview shows `Your ${brand} verification code is ${code}` as the template shape; whether this is the literal production English default or one of several built-in template options is *source unclear*
- **Custom-template authoring shape** — overview lists "Template" as a Verify Application setting but the create-application API detail was not pulled; the boundary between built-in template selection and full custom template authoring is *source unclear*
- **OTP-message exemption from STOP/HELP-in-body requirements** — *not observed in public docs*
- **WhatsApp Verify API shape** — *source unclear* (WhatsApp listed as Active on product landing and priced on the Verify pricing page, but the API overview channel list shows only sms/voice; create-session API behavior for WhatsApp specifically not exposed in the surfaces examined)
- **Free-credit amount and signup-credit duration** — *not observed in public docs* on the Verify pricing or landing pages
- **Device-verification, SMS-as-login-link, recovery-code-delivery sub-uses** — *not observed in public docs* as named sub-uses
- **Rate-limit defaults at the API level** — *not observed in public docs* (retry-attempts and OTP expiry are Verify Application–level configs; per-account or per-session rate-limit defaults not surfaced)
- **Character/segment-limit guidance for SMS template content** — *not observed in public docs* in the Verify-specific surfaces examined

### Sinch Verification

Sinch's verification API and mobile SDKs. Customer creates a Verification application in the Sinch dashboard, then triggers verifications via REST endpoints under `verification.api.sinch.com` (back-end usage) or via mobile SDKs (Android, iOS, JavaScript) for client-side flows including automatic SMS / flashcall code capture. Four verification methods span SMS, flashcall, phone call, and Data verification (carrier-infrastructure-based). Extraction sourced from `sinch.com/products/apis/verification/` (product landing), `developers.sinch.com/docs/verification/` (developer docs root, including `/introduction`, `/api-reference/verification/section/api-overview`, `/api-reference/verification/section/sms-verification`), and Sinch community-forum threads for custom-template detail.

**Positioning headline:**

> "Step up security, keep engagements flowing"

Sub-headlines:

> "Enhance app security with scalable multi-factor authentication solutions built with conversion in mind"

> "Don't choose between security and conversions"

> "Safer, smarter, cheaper: Pick your verification solution(s)!"

**Source:** https://www.sinch.com/products/apis/verification/

**Public-docs API surface:** Base URL: `https://verification.api.sinch.com`. Verification REST endpoints:

- `POST /verification/v1/verifications` — start a new verification request
- `PUT /verification/v1/verifications/number/{endpoint}` — report verification by phone number
- `PUT /verification/v1/verifications/id/{id}` — report verification by ID
- `GET /verification/v1/verifications/id/{id}` — query status by ID
- `GET /verification/v1/verifications/{method}/number/{endpoint}` — query status by number
- `GET /verification/v1/verifications/reference/{reference}` — query status by custom reference

Callback webhooks (POSTed to a customer-configured URL):

- `VerificationRequestEvent` — backend authorizes whether the verification may proceed
- `VerificationResultEvent` — verification completion result
- `SmsDeliveredEvent` — SMS delivery notification

Verification methods, verbatim per the API overview:

- **SMS** — "Sending an SMS message with an OTP code"
- **FlashCall** — "Placing a flashcall (missed call) and detecting the incoming calling number (CLI)"
- **Phone Call** — "Placing a PSTN call to the user's phone and playing a message containing the code"
- **Data** — "By accessing internal infrastructure of mobile carriers to verify if given verification attempt was originated from device with matching phone number"

Authentication options documented: Application Signed Request (recommended for production), Basic Authentication (recommended for prototyping), Public Authentication (paraphrased — labels verbatim, descriptions condensed).

**Source:** https://developers.sinch.com/docs/verification/api-reference/verification/section/api-overview

**Verbatim sample messages:**

The only verbatim SMS template body observed in the developer docs is the Spanish-locale sample returned in an API response (response shape, verbatim):

```json
{
  "id": "1087388",
  "sms": {
    "template": "Tu código de verificación es {{CODE}}.",
    "interceptionTimeout": 120
  }
}
```

No verbatim English-default template body was surfaced in the developer docs examined (paraphrased — secondary sources note the default content language is en-US but the literal English template string was not exposed).

**Source:** https://developers.sinch.com/docs/verification/api-reference/verification/section/api-overview ; https://developers.sinch.com/docs/verification/api-reference/verification/section/sms-verification

**Variable/placeholder convention:** Templates use **uppercase `{{CODE}}`** inside double curly braces — distinct from Twilio Verify (`{{code}}` lowercase), Telnyx Verify (`{{code}}` lowercase), and Plivo Verify (`${code}` dollar-brace). Only one named template variable observed in the verification SMS surface:

- `{{CODE}}` — the OTP

The `Accept-Language` request header (or the application's default content language, which defaults to en-US) selects the locale-specific template; carrier-provider-specific templates may override the content language at delivery time for compliance reasons, per the SMS verification docs (verbatim):

> "The content language specified in the API request or in the callback can be overridden by carrier provider specific templates, due to compliance and legal requirements, such as US shortcode requirements."

Per Sinch community-forum discussion, custom-template adjustment via the verification request is disabled in certain countries; applying a custom template typically requires contacting Sinch support or an account manager (paraphrased from community-forum source).

**Source:** https://developers.sinch.com/docs/verification/api-reference/verification/section/sms-verification ; https://community.sinch.com/t5/Discussion-Forum/SMS-Verification/td-p/15702

**Opt-out language:** Verification-specific docs (introduction, API overview, SMS verification section) contain no explicit guidance on STOP/HELP language inside OTP message bodies (paraphrased). The SMS verification docs note that carrier-provider-specific templates may override content language for compliance reasons (verbatim quoted in the Variable convention section above) but do not prescribe STOP/HELP-in-body content. Whether Verification OTP messages are formally exempt from STOP/HELP-in-body requirements is not stated in the surfaces examined.

**Source:** https://developers.sinch.com/docs/verification/api-reference/verification/section/sms-verification

**Enumerated sub-uses:**

Product landing enumerates the following sub-uses (verbatim list items):

- Sign-up
- Log-in
- Password resets
- Reducing unauthorized payments and account takeovers
- One-factor authentication

Per-method positioning copy on the product landing (verbatim):

> "Flash call verification – faster, more cost-efficient alternative to traditional SMS"

> "SMS Verification – Secure login and sign-up, reduce churn and boost revenue"

> "Data Verification – Instant verification with proven security"

> "Phone Call Verification – Global call verification for mobile and landline numbers"

Integration partnerships mentioned on the product landing: Okta and Auth0 (CIAM platforms) — positioning anchored to multi-factor-auth ecosystems (paraphrased).

**Source:** https://www.sinch.com/products/apis/verification/

**Pricing visibility:** Per-request basis. Verification fee structure per the API overview (verbatim):

> "Verification pricing is calculated on a per request basis. A fixed price is charged for each flash call attempted and a SMS price (depending on country and operator) is charged for each SMS verification attempt."

No flat published per-verification dollar amount surfaced on the public product or developer pages; the API overview directs the reader to download the current pricing list from the Sinch Build dashboard (paraphrased — dashboard access required for the actual numbers). Secondary search-index source cites US 10DLC SMS at approximately $0.0078 per outbound message plus carrier surcharges (paraphrased — not a Sinch-first-party quote). Volume discounts available via sales conversation (paraphrased — not enumerated on public pages). Free trial / sandbox / indie-developer tier: not observed in public docs.

**Source:** https://developers.sinch.com/docs/verification/api-reference/verification/section/api-overview ; https://sinch.com/pricing/sms/

**Indie-SaaS-relevant positioning signal:** No explicit indie SaaS / founder / startup audience callout observed in the surfaces examined. Product surface emphasizes scale, conversion optimization, CIAM-partner integrations (Okta, Auth0), and multi-method coverage — reads as enterprise / mid-market positioning (paraphrased). The sub-headline "Don't choose between security and conversions" (verbatim) is broad-developer framing not specifically aimed at indie SaaS founders.

**Source:** https://www.sinch.com/products/apis/verification/

**Gaps:**

- **Verbatim English-default SMS template body** — *source unclear* (default content language is en-US per secondary source, but the literal English template string was not exposed in the developer docs examined; only the Spanish-locale sample surfaced verbatim)
- **Public flat US pricing for SMS verification** — *not observed in public docs* (pricing list requires Sinch Build-dashboard download; community/secondary sources cite ~$0.0078 per 10DLC SMS but no per-verification fee disclosed publicly)
- **OTP-message exemption from STOP/HELP-in-body requirements** — *not observed in public docs* (Verification-specific docs do not address STOP/HELP-in-body; only language-override-for-compliance is mentioned)
- **Custom-template authoring shape via API** — *source unclear* (community-forum thread suggests custom templates are typically applied via support / account-manager intervention; an API-side surface for direct custom-template-text submission is not exposed in the docs examined)
- **Free trial / sandbox / test credits for Verification specifically** — *not observed in public docs* on the Verification product or pricing pages
- **WhatsApp / RCS / Email channels for Verification** — *not observed in public docs* on the Verification product page (channels listed are SMS, FlashCall, Phone Call, Data; Sinch's broader product line includes WhatsApp/RCS/Email but the Verification surfaces examined do not enumerate them)
- **Device-verification, SMS-as-login-link, recovery-code-delivery sub-uses** — *not observed in public docs* as named sub-uses (Data verification semantically overlaps device-context-verification; the product does not label it that way)
- **Per-method dollar pricing breakdown** — *not observed in public docs* (per-request fixed-fee for flashcall, per-SMS for SMS, but specific dollar amounts not published)
- **Character/segment-limit guidance for custom SMS template content** — *not observed in public docs* in the Verification surfaces examined
- **Rate-limit defaults** — *not observed in public docs* in the surfaces examined

---

## Source 3 — Starter kit scan

Per-target field shape per D-384 follow-up scoping: starter kits use a 6-field structure focused on whether and how SMS verification is wired, not the 8-field competitor treatment. Fields per target: (1) ships SMS verification (yes/no/partial), (2) if yes — provider/library, (3) integration pattern, (4) default auth pattern plus relationship to SMS, (5) opt-out treatment, (6) source URL trail. Closing **Gaps:** block per target as in Source 1.

### ShipFast

Marc Lou's Next.js SaaS boilerplate, sold as a paid closed-source code package. Marketing-site and public docs index examined; no public source repository available for code-level inspection. Extraction sourced from `shipfa.st` (product landing including pricing and FAQ) and `shipfa.st/docs` (public docs index).

**Ships SMS verification:** **No.** No SMS verification, phone-number authentication, or OTP-by-SMS feature surfaced anywhere in the product landing, pricing tiers, FAQ, or public docs index examined. The docs-index feature enumeration (verbatim list items):

> "SEO", "Database", "Emails", "Payments", "Google Oauth", "Magic Links", "Customer support", "Error handling", "Analytics"

Phone, SMS, OTP, and verification do not appear. No mention of Twilio, Telnyx, Plivo, Sinch, or any SMS provider in the marketing-and-docs surfaces examined (paraphrased).

**Source:** https://shipfa.st ; https://shipfa.st/docs

**If yes — provider/library:** n/a (no SMS verification shipped).

**Integration pattern:** n/a (no SMS verification shipped).

**Default auth pattern + relationship to SMS:** Email magic-link plus Google OAuth, wired through NextAuth. The docs-index header surfaces two auth-backend choices (verbatim):

> "NextAuth + Mongo-DB"

> "Supabase"

For the NextAuth-plus-Mongo path, NextAuth handles the magic-link adapter and stores users in MongoDB (paraphrased). For the Supabase path, Supabase Auth handles magic-link delivery without manual NextAuth adapter wiring (paraphrased — secondary source via ShipFast Guide TS). Landing-page FAQ surfaces magic-link economics (verbatim):

> "If you use Magic Link sign-ups, you'll spend $1 per 1,000 users."

SMS is absent — not fallback, not optional add-on. The kit's auth story is entirely email-channel-plus-OAuth (paraphrased).

**Source:** https://shipfa.st ; https://shipfa.st/docs ; https://shipfast.guide/ts/guides/user-auth

**Opt-out treatment:** n/a — no SMS surface means no STOP/HELP handling. Not implemented; not applicable.

**Gaps:**

- **None worth chasing.** Per the Source 3 prompt note, absence of SMS verification is a complete finding for this target. The starter is a paid closed-source code package; deeper inspection beyond marketing-and-docs is purchase-gated, but the public surface is unambiguous on the SMS-absence point. No SMS provider, no phone field in auth flows, no OTP-by-SMS feature anywhere in the public materials examined.

### Supastarter

Paid SaaS starter kit & boilerplate available in multiple variants (Next.js + better-auth, Next.js + Supabase, Nuxt + better-auth, TanStack Start). Public docs and landing pages examined for both Next.js variants; no public source repository for code-level inspection. Extraction sourced from `supastarter.dev` (product landing), `supastarter.dev/docs/nextjs/authentication/overview` (auth overview docs), and the two Next.js variant landings (`/nextjs-better-auth-boilerplate`, `/nextjs-supabase-boilerplate`).

**Ships SMS verification:** **No.** No SMS verification, phone-number authentication, or OTP-by-SMS feature surfaced in the product landing, variant landings, or auth overview docs examined across both Next.js variants. The auth feature enumeration is consistent across surfaces (verbatim list items):

> "Password, Passkeys & magic link"

> "oAuth"

> "2FA"

> "Forgot/reset password flow"

Phone, SMS, and OTP-by-SMS do not appear. No mention of Twilio, Telnyx, Plivo, Sinch, or any SMS provider in the public surfaces examined (paraphrased).

**Source:** https://supastarter.dev ; https://supastarter.dev/docs/nextjs/authentication/overview ; https://supastarter.dev/nextjs-better-auth-boilerplate ; https://supastarter.dev/nextjs-supabase-boilerplate

**If yes — provider/library:** n/a (no SMS verification shipped).

**Integration pattern:** n/a (no SMS verification shipped pre-wired).

**Default auth pattern + relationship to SMS:** Password (with passkeys and magic-link as passwordless options) plus OAuth social logins, with 2FA layered on top. The 2FA implementation type is not explicitly stated in the Supastarter docs examined; defaults to TOTP-app-based per the underlying better-auth library (paraphrased — inferred from better-auth defaults, not confirmed verbatim Supastarter-side).

The Next.js + better-auth variant uses **better-auth** as the auth library; the Next.js + Supabase variant uses **Supabase Auth**. Landing-page verbatim:

> "supastarter uses better-auth, a modern TypeScript authentication library."

OAuth provider list, verbatim:

> "Google, GitHub, Apple, and many other OAuth providers"

SMS-to-kit relationship (paraphrased): SMS verification is not pre-wired in either Next.js variant. Both variants' underlying auth libraries support SMS-based 2FA as a developer-implemented extension — better-auth via a customer-provided `sendOTP` callback (the kit does not include SMS-provider plumbing), Supabase Auth via its native phone-auth integration (which itself requires Twilio/Vonage configuration). Neither path is shipped pre-configured; SMS is an extension on top of the kit, not a shipped feature.

**Source:** https://supastarter.dev ; https://supastarter.dev/docs/nextjs/authentication/overview ; https://better-auth.com/docs/plugins/2fa (capability-boundary reference)

**Opt-out treatment:** n/a — no SMS surface means no STOP/HELP handling. Not implemented; not applicable.

**Gaps:**

- **Verbatim confirmation that shipped 2FA is TOTP-only** — *source unclear* (Supastarter feature lists name "2FA" without specifying implementation type; defaults inferred from better-auth library are TOTP-app-based, but not confirmed verbatim in the Supastarter surfaces examined)
- **Whether the Supabase variant pre-exposes any phone-auth surface in shipped UI** — *not observed in public docs* (Next.js + Supabase variant landing does not surface phone auth; whether the kit's shipped code includes a phone-auth route, even if unsurfaced in marketing, was not extractable from public materials)
- **Closed-source code access** — paid code package; deeper inspection beyond marketing-and-docs is purchase-gated. Public surface across two Next.js variants is consistent on the SMS-absence point.

### MakerKit

Paid SaaS Starter Kit for React, Next.js, and Remix, available in multiple variants — `next-supabase-turbo` (Next.js + Supabase) and `remix-supabase-turbo` (Remix + Supabase) use Supabase Auth; Drizzle and Prisma kit variants use Better Auth. Extensive public documentation with API reference, configuration guides, and a changelog blog; no public source repository for code-level inspection. Extraction sourced from `makerkit.dev` (product landing), `makerkit.dev/docs/next-supabase-turbo/configuration/authentication-configuration` (auth config docs), and `makerkit.dev/docs/next-supabase-turbo/api/otp-api` (OTP API docs).

**Ships SMS verification:** **No.** No SMS verification, phone-number authentication, or OTP-by-SMS feature surfaced in the product landing, authentication configuration docs, or OTP API docs examined. Configurable auth methods are explicitly listed as environment-variable flags (verbatim):

> `NEXT_PUBLIC_AUTH_PASSWORD` — Traditional email/password

> `NEXT_PUBLIC_AUTH_MAGIC_LINK` — Passwordless email links

> `NEXT_PUBLIC_AUTH_OTP` — One-time password codes

> `oAuth` — OAuth providers array

No `phone`, `sms`, or equivalent config key exists in the documented surface. No mention of Twilio, Telnyx, Plivo, Sinch, or any SMS provider in the public materials examined (paraphrased).

**Source:** https://makerkit.dev ; https://makerkit.dev/docs/next-supabase-turbo/configuration/authentication-configuration ; https://makerkit.dev/docs/next-supabase-turbo/api/otp-api

**If yes — provider/library:** n/a (no SMS verification shipped).

**Integration pattern:** n/a for SMS specifically. MakerKit does ship a server-side OTP infrastructure layer used for in-app verification of sensitive operations — verbatim use-case framing: "destructive actions in the SaaS Kit, such as deleting accounts, deleting teams, and deleting users." The OTP delivery channel is **email-only** per the OTP API docs; the documented method signature (verbatim from docs):

```
api.sendOtpEmail({ email: userEmail, otp: token.token })
```

OTP infrastructure features (paraphrased from the OTP API docs and the 2.11.0 changelog entry): server-side token generation, hashed storage in Supabase, automatic expiration, verification tracking, and a ready-to-use OTP verification form component.

**Default auth pattern + relationship to SMS:** Email/password plus magic-link plus email-OTP plus OAuth social, with TOTP-based MFA layered on top. The four-method authentication surface, verbatim from the product landing:

> "Email/Password — Secure email/password authentication with built-in password reset, email verification, and account recovery flows."

> "Magic Link — Passwordless authentication that delights users. One-click sign-in via email—no passwords to remember."

> "Social Sign-in — Google, GitHub, Facebook, X, Discord, and many more OAuth providers ready to configure."

> "Multi-Factor Authentication — TOTP-based MFA to protect your users' accounts."

OAuth providers documented in the auth config (verbatim list — 21 providers): Apple, Azure, Bitbucket, Discord, Facebook, Figma, GitHub, GitLab, Google, Fly, Kakao, Keycloak, LinkedIn, LinkedIn OIDC, Notion, Slack, Spotify, Twitch, Twitter, WorkOS, Zoom.

Auth library by variant (paraphrased from product landing):

- Supabase-stack variants (Next.js + Supabase, Remix + Supabase) use Supabase Auth
- Drizzle and Prisma kit variants use Better Auth

SMS-to-kit relationship (paraphrased): SMS verification is not pre-wired in any variant. The Supabase-stack path could in principle enable Supabase Auth's native phone-login by configuring a Supabase-supported SMS provider (MessageBird / Twilio / Vonage / TextLocal per Supabase docs), but MakerKit does not surface phone auth as a shipped kit feature, configurable kit option, or documented integration path. The Drizzle/Prisma path uses Better Auth, which supports SMS-2FA via developer-provided `sendOTP` callback (capability boundary noted in the Supastarter section above) — also not pre-wired. SMS is a customer-implemented extension on top of the shipped auth surface in all variants.

**Source:** https://makerkit.dev ; https://makerkit.dev/docs/next-supabase-turbo/configuration/authentication-configuration ; https://makerkit.dev/docs/next-supabase-turbo/api/otp-api

**Opt-out treatment:** n/a — no SMS surface means no STOP/HELP handling. Not implemented; not applicable.

**Gaps:**

- **Whether the Supabase-stack variants' shipped UI includes a phone-auth route that's just unsurfaced in marketing** — *not observed in public docs* (Supabase Auth phone-login is a backend capability the kit could surface, but the documented auth configuration does not expose a phone-auth option and no `phone`/`sms` config keys are documented)
- **MFA implementation specifics across variants** — *source unclear* on whether any kit pre-wires SMS-MFA via Supabase Auth's phone-MFA capability (auth config docs say MFA is built into Supabase Auth without specifying TOTP-only vs. also-phone-MFA at the kit level; product landing's "TOTP-based MFA" claim is the only explicit signal and points to TOTP-only)
- **Whether the email-channel OTP infrastructure is channel-pluggable** — *not observed in public docs* (the `sendOtpEmail` method signature is channel-specific; whether the surrounding storage / expiration / verification layer could be re-pointed at SMS by a customer extension is not addressed in the OTP API docs examined)
- **Closed-source code access** — paid code package across all kit variants; deeper inspection beyond marketing-and-docs is purchase-gated. Public surface across multiple variants plus detailed config + API docs is consistent on the SMS-absence point.

### Vercel-Supabase starter

The official `vercel/next.js` `with-supabase` example template — open-source, free, installable via `npx create-next-app --example with-supabase`. Serves as a wiring demonstration for Supabase Auth + Next.js App Router rather than a full SaaS stack. Extraction sourced from `vercel.com/templates/next.js/supabase` (Vercel template page) and `github.com/vercel/next.js/tree/canary/examples/with-supabase` (source repo README + `app/auth/` route directory).

**Ships SMS verification:** **No.** No SMS verification, phone-number authentication, or OTP-by-SMS feature in the starter. The README's verbatim feature list:

> "Works across the entire Next.js stack"

> "supabase-ssr package for cookie-based auth"

> "Password-based authentication block installed via the Supabase UI Library"

> "Tailwind CSS styling"

> "shadcn/ui components"

> "Supabase Vercel Integration with auto-assigned environment variables"

The auth routes shipped in `app/auth/` (verbatim directory listing from the source repo):

- `confirm/`
- `error/`
- `forgot-password/`
- `login/`
- `sign-up/`
- `sign-up-success/`
- `update-password/`

No `phone/`, `sms/`, `otp/`, `verify/`, or `oauth-callback/` route directory. No mention of Twilio, Telnyx, Plivo, Sinch, or any SMS provider in the README or template page (paraphrased).

**Source:** https://vercel.com/templates/next.js/supabase ; https://github.com/vercel/next.js/tree/canary/examples/with-supabase ; https://github.com/vercel/next.js/blob/canary/examples/with-supabase/README.md

**If yes — provider/library:** n/a (no SMS verification shipped).

**Integration pattern:** n/a (no SMS verification shipped). No OTP infrastructure of any kind in the starter — neither email-channel nor SMS-channel. Verification, where present, is via Supabase Auth's email-confirmation-link flow only (paraphrased — implied by the `confirm/` route and the password-based-auth feature description; not explicitly elaborated in the README).

**Default auth pattern + relationship to SMS:** Password-based email/password authentication via Supabase Auth, configured for cookie-based sessions through the `supabase-ssr` package. The README states verbatim:

> "Password-based authentication block installed via the Supabase UI Library"

> "A package to configure Supabase Auth to use cookies"

Auth library: **Supabase Auth** (via the `supabase-ssr` package). UI: Supabase UI Library + shadcn/ui components + Tailwind.

The pre-wired auth surface is password-only — magic-link, OAuth, OTP, MFA, and phone-auth all require customer-added wiring (paraphrased — observed from the README feature list combined with the `app/auth/` route inventory).

SMS-to-kit relationship (paraphrased): SMS verification is not pre-wired. The underlying Supabase Auth backend supports phone-login via configurable SMS providers (MessageBird / Twilio / Vonage / TextLocal per Supabase docs), but this starter does not surface or wire it. Adding SMS verification would require enabling Supabase phone-login in the Supabase dashboard, configuring an SMS provider, and building new auth routes in `app/auth/` — no scaffolding to extend, since the existing routes are email-confirmation-shaped.

**Source:** https://github.com/vercel/next.js/blob/canary/examples/with-supabase/README.md ; https://github.com/vercel/next.js/tree/canary/examples/with-supabase/app/auth

**Opt-out treatment:** n/a — no SMS surface means no STOP/HELP handling. Not implemented; not applicable.

**Gaps:**

- **Whether the starter intentionally limits to password-only or expects developers to extend with OAuth/magic-link/phone** — *not observed in public docs* (README and template page do not address extensibility intent; the scoping rationale is unstated)
- **Whether the Supabase UI Library that ships in the starter exposes phone-login UI blocks that could be dropped in alongside the password block** — *source unclear* (the starter installs the password-based-auth UI block specifically; whether parallel phone-login blocks exist in the Supabase UI Library catalog and could be added without writing custom routes was not extracted from the README)
- **Source-code verification of SMS-absence** — open-source repository allows direct inspection; the SMS-absence finding is verifiable from the `app/auth/` directory listing and the README feature list, not only from marketing copy. Recorded here for traceability rather than as an outstanding gap.
