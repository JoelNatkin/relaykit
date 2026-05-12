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
