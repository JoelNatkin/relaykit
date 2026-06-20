## Identity / authentication / SSO SaaS
**Vertical:** B2B SaaS & developer tooling
**Bucket:** Clear
**URL slug:** /for/identity-auth-saas

### What this builder is making
A drop-in authentication and identity layer that other developers embed in their apps — phone/email OTP, passwordless sign-in, MFA, SSO, and account recovery exposed through SDKs and APIs (the Auth0 / Clerk / Stytch / WorkOS / Descope / FusionAuth shape). The product's job is to prove a user controls a given phone number and to gate sensitive actions behind a second factor. SMS is not a feature bolted on — it is the delivery rail for the core OTP and step-up primitives the SDK ships.

### Why they need SMS
The defining moment is the OTP at signup or step-up: the user is mid-flow, staring at a code field, and the message must land in seconds or the conversion (or the sensitive action) fails. Email is too slow and too easily missed at the exact second a code is needed, and the auth product's own reputation rides on delivery latency. SMS wins because it is the one channel fast and ubiquitous enough to carry a time-boxed code to a phone the user is already holding.

### Message categories
1. verification — the wedge: every OTP, login code, recovery code, and step-up confirmation the SDK emits; 2FA TCR carve-out applies (no STOP/HELP).
2. account-events — security and lifecycle signals around the auth account itself: new-device sign-in, account suspended, and (for the auth vendor's own billing) payment/trial/subscription.
Excluded: appointments (no scheduling), order-updates (no commerce), waitlist (no queue), team-alerts (this is end-user auth, not internal ops paging), community (no membership surface), customer-support (possible for the vendor's own helpdesk, but not the auth product's emitted traffic), marketing (separate consent + EIN gate; out of the transactional auth lane).

### Workflows

**Phone verification at signup**
Prove a new user controls the phone number they entered.
Sequence:
1. verification:verification-code — "Verification code" — code sent the instant the user submits their number.

Variable aliases (only where default feels wrong):
- business_name: "Acme" (the end-app's name, not the auth vendor's — the SDK passes the customer's brand)
- expiry_minutes: "10"

**SMS as a second factor (MFA login)**
Deliver the step-up code when a returning user logs in with SMS 2FA enabled.
Sequence:
1. verification:login-code — "Login code" — sent after primary credential, code field waiting.

Variable aliases:
- business_name: "Acme"
- expiry_minutes: "5"

**Sensitive-action confirmation (step-up)**
Re-verify the user before a high-risk action — password/email change, MFA device change, payment update.
Sequence:
1. verification:confirmation-code — "Confirmation code" — sent at the moment the sensitive action is requested.

Variable aliases:
- business_name: "Acme"

**Account recovery**
Let a locked-out user regain access via SMS-delivered recovery code.
Sequence:
1. verification:recovery-code — "Recovery code" — sent when the user initiates account recovery.

Variable aliases:
- business_name: "Acme"

**New-device security alert**
Tell the user their account was just accessed from an unrecognized device, with a secure-it path.
Sequence:
1. account-events:new-device-sign-in — "New sign-in" — fires on login from an unknown device/location.

Variable aliases:
- workspace_name: "Acme"
- device_context: "Chrome on Windows, Austin TX"

### Message gaps
No gaps. Every workflow above maps to an exact corpus message ID (verification:verification-code, verification:login-code, verification:confirmation-code, verification:recovery-code, account-events:new-device-sign-in). The verification category was built for precisely this sub-vertical — it is the wedge use case — so coverage is complete with no Stretch or GAP entries required.

### Content constraints
- Verification (2FA) category carries NO "Reply STOP to opt out." / HELP language in the body — this is the TCR 2FA carve-out and is mandatory, not stylistic. Do not add opt-out copy to any OTP/login/recovery/confirmation message.
- OTP bodies must contain only the code and its expiry — no links, no promotional content, no upsell. Carriers scrutinize 2FA campaigns for embedded URLs.
- The OTP/2FA campaign must be registered with TCR under the 2FA use case; brand registration precedes it. Carrier review for the auth campaign takes a few days.
- The SDK passes the end-customer's brand into the sender frame ({{business_name}}), not the auth vendor's name — the recipient must recognize the app they signed up for.
- Standard carrier rules apply to the account-events traffic (new-device sign-in), which DOES carry "Reply STOP to opt out." — only the verification category is carved out.

### Disambiguation
This sub-vertical is the developer building the auth product (the Auth0-clone / Clerk-clone), not an app that merely uses an auth provider — RelayKit's wedge sits at the SDK layer, where the builder is emitting OTPs on behalf of their own downstream customers. Distinguish it from generic "B2B SaaS account security," where verification is one minor flow among many; here verification IS the product. Also distinct from internal team-alerts / on-call tooling: the recipients are the end-app's end users proving identity, not engineers being paged. When in doubt, the tell is the 2FA campaign and the {{business_name}} pass-through — the auth vendor's SDK stamps each message with its customer's brand.

### Sources
https://workos.com/blog/auth0-alternatives-2025
https://www.scalekit.com/blog/auth0-alternatives
https://fusionauth.io/guides/auth0-alternatives
https://clerk.com/docs/guides/development/custom-flows/authentication/email-sms-otp
https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options
https://auth0.com/docs/authenticate/passwordless/authentication-methods/sms-otp
https://www.twilio.com/en-us/blog/configure-auth0-mfa-twilio-verify
https://www.descope.com/blog/post/twilio-verify-connector
https://prelude.so/blog/10dlc-guide
https://www.messagecentral.com/blog/10dlc-otp-api-usa
https://textbolt.com/blog/10dlc-compliance/
