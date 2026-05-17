# Verification — Lead-Magnet Research
**Date:** 2026-05-16
**TCR mapping:** 2FA
**Classification:** discrete
**Authored by:** PM (Session 92) — distilled from `audits/PHASE_2A_VERIFICATION_EXTRACTION.md` (Sources 1+3, 684 lines) and `audits/PHASE_2A_VERIFICATION_SYNTHESIS.md` (Sources 2+4, 206 lines)

## 1. Industry pattern observations

Verification SMS is in the middle of a category-level shift. SMS-2FA-as-login is genuinely deprecating across indie SaaS — four of five canonical references (Vercel, Linear, Lemon Squeezy, GitHub) either never shipped SMS-2FA or actively discourage it; only Stripe and GitHub still expose it and both frame it as last-resort fallback. The TOTP and passkey transition is well-established. But the vocabulary indie founders use ("SMS 2FA," "Twilio Verify alternative") lags the technology shift — Twilio Verify itself markets "Signup verification / Login protection / Secure transactions" as one product surface, and founders inherit that framing.

Where SMS verification still lives in indie SaaS is not "auth," it's "verification" in the broader sense: proving phone-ownership at signup, confirming a sensitive action mid-session, providing an out-of-band recovery channel when other auth fails. Stripe's five SMS-using surfaces decompose roughly this way — Dashboard 2FA (deprecating), Express 2FA for Connect partners, Stripe Link consumer device-verify, Stripe Identity phone-ownership, and account-health transactional alerts.

The founder-visible pain is **cost**, secondarily **fraud**, almost never **compliance**. Three anchoring data points: Signal Foundation's 2023 public disclosure that SMS verification codes cost $6M/year (nearly matching all storage + servers + bandwidth combined); Zenly's pre-Snap-acquisition disclosure that "SMS verification was one of our biggest expenses, with up to 30% of the budget lost to fraud"; Twilio Verify's $0.05 per successful verification + $0.0075 per US SMS = $0.0575 minimum per US verification, which translates to $28.75/mo at 500 verifications, $287.50 at 5000. RelayKit's $19/mo with 500 messages included + $8 per 500 over runs substantially cheaper at every realistic indie SaaS volume, and predictable in shape — no per-event uncertainty, no retry-attempt billing surprises.

Compliance is invisible to indie founders because their providers (Twilio Verify, Auth0, Clerk) absorb it entirely. Search passes across Indie Hackers, r/SaaS, and adjacent forums on "10DLC," "TCR," "STOP HELP," and "SMS compliance" returned zero indie-hacker-voice discussions — every result was CSP marketing copy. The audience CSPs speak to is enterprise SMS marketers and political-campaign operators, not founders. **Positioning implication:** if RelayKit leads with "we handle 10DLC compliance," the response is "what's 10DLC?" Compliance must be silent infrastructure that enables the visible pitch (price, integration, fraud defense), never a feature in itself.

Starter-kit reality (ShipFast, Supastarter, MakerKit, Vercel-Supabase): none ship SMS verification. Email magic-link is the universal sign-in primitive; SMS-2FA appears nowhere as a default in 2026 indie-SaaS starters. The category-shape conclusion: RelayKit's Verification pitch leads with vocabulary founders already use (the "Twilio Verify alternative" frame), while the architectural reality serves four sub-uses behind a single SDK primitive.

## 2. Subs identified

Four discrete subs cover the Verification category at launch. All share the same SDK plumbing (`verification.sendCode()` / `verification.checkCode()`) — they differ in template wording and intake context.

1. **Signup phone verification (PRIMARY)** — the developer's user creates an account; the developer wants to verify they own the phone number they registered. Distinct from login 2FA — this is one-time phone-ownership proof at account creation, regardless of whether SMS is later used for auth. The most-shipped SMS-verification use case in indie SaaS that survives the TOTP/passkey transition. Single-message OTP send + verify. Intake question: "What does your user see right before they get this code?" (anchors the message to a recognizable onboarding moment.)

2. **Login 2FA with advisory (SECONDARY)** — the developer's user is logging in and the developer wants SMS as a second factor. Path A vocabulary use case, supported with explicit advisory framing because leading SaaS references treat SMS-2FA as last-resort. Same template plumbing as Sub-use 1; the difference is the context the user sees the message in. Critical: advisory wording — "SMS is the most common second factor and the least secure — consider TOTP or passkeys for primary 2FA" or similar — surfaces in the configurator UX when this sub is picked, never in the message body itself.

3. **Sensitive-action step-up (SECONDARY)** — the developer's user is performing a high-stakes action (withdrawing funds, changing payment details, transferring ownership, exporting data, deleting account) and the developer wants explicit phone-channel confirmation before completing it. Marketplace-flow shape: the user already trusts their session; the developer wants extra friction at a specific moment. Passkeys can't reach a phone-channel for out-of-band confirmation, so this surface is real and growing. Template shape includes an optional context-line in the body ("Confirm withdrawal of $X"). Intake question: "What action triggers this verification?"

4. **Account-recovery channel (TERTIARY)** — the developer's user lost access to their primary auth method (email compromised, TOTP device lost, passkey-bound device unavailable) and needs an out-of-band recovery channel. SMS as the lockout fallback, not as primary auth. GitHub and Stripe both maintain SMS specifically for this even while discouraging it for login 2FA. Lower volume per customer than the other three; conditional surface (only fires when other auth fails). Single-message OTP send + verify with explicit recovery framing. Intake question: "What can your user do once they get this code?"

Note: end-customer / multi-tenant verification (the developer's customer's customer — e.g., a marketplace seller verifying their own withdrawal) is a real growth vector but stays in BACKLOG for IH launch. Multi-tenant flows require account-architecture work (per-tenant brand registration, per-tenant compliance site, billing implications) that's out of scope.

## 3. Voice patterns observed

Verification SMS is the tightest voice surface in the entire message library. The message body is mechanical — a code, a context line, a phrase confirming what just happened — and any deviation reads as friction or sales noise to a user who's mid-flow on something else.

Strong indie-SaaS verification SMS reads as **terse and contextless beyond what's needed**: "Your code is 829341. It expires in 10 minutes." Sender frame implicit from the prior screen. Voice that fails: "Hey there! Thanks for signing up with [BUSINESS NAME]. Your verification code is 829341 — use it within the next 10 minutes to confirm your phone number and complete your profile."

Length: 60-120 characters typical. The code and the expiry are load-bearing; everything else is removable. Sender brand goes in the implementation header where carriers route it, not in the body.

Context-line discipline (Sub-use 3 specifically): when an action-specific context line is included ("Confirm withdrawal of $X"), it must be factual and short. No verbs like "secure," "protect," or "confirm" carrying marketing implication.

Variable syntax convention: `{{code}}` lowercase double-brace. Matches Twilio and Telnyx (the two competitors with the largest indie-SaaS-developer mindshare); matches Mustache/Handlebars conventions; lowercase matches modern TypeScript/JavaScript variable-naming. Plivo's `${code}` and Sinch's `{{CODE}}` exist but are not adopted by RelayKit.

Personalization tokens: code always, expiry timing usually, business name optional and often omitted. First name rare and only when the use case warrants it (some recovery scenarios). Deep merge data never.

## 4. B2B vs B2C variations

Voice register doesn't shift much across B2B/B2C in pure OTP messages — the code is the code, the timing is the timing. The variation surfaces in **sender frame** and **advisory placement**, not in the message body.

B2B SaaS surfaces (Stripe Dashboard, Linear, Vercel) reach an audience already familiar with TOTP and passkeys; SMS is fallback. Advisory framing in the configurator is well-received because the audience reads it as a knowing peer's recommendation, not a sales push.

B2C consumer surfaces (Stripe Link, marketplace sellers, fintech apps) reach an audience for whom SMS is often the only verification path they recognize. Advisory framing matters less; clear copy and reliable delivery matter more.

Marketplace and platform flows (Stripe Connect, Stripe Express, Shopify partners) sit between B2B and B2C — the developer is B2B, but the developer's user is often a B2C consumer or a small-business operator who responds to consumer-shape verification copy. Sub-use 3 (sensitive-action step-up) lives heavily in this space.

## 5. Compliance constraints / TCR considerations

TCR mapping is **2FA** — a Standard auto-approved category that fits the four sub-uses cleanly. No vetting workflow required.

OTP body conventions across the four major Verify-product competitors: none of Twilio, Telnyx, Plivo, or Sinch prescribe STOP/HELP language in the body of Verify-product OTP messages. This universal silence — cross-confirmed by Source 4's finding that compliance is invisible to founders because their providers absorb it — translates to a settled convention: **RelayKit's transactional OTP messages do not include STOP/HELP language in the body**. This is consistent with carrier carve-outs for 2FA traffic. Marketing templates (different namespace) follow different compliance rules.

Rate limiting: Stripe Express documents ~5 SMS in 10-30 minutes per phone for verification flows. Twilio Verify's account-tier defaults are similar. RelayKit's per-phone send limits (5/hour, 10 check attempts per code per VERIFICATION_SPEC §6) align with industry practice.

Fraud surface: SMS pumping / IRSF (International Revenue Share Fraud) is the live threat. Every Twilio Verify competitor pitches fraud defense as primary differentiator (Twilio Fraud Guard, Prelude's smart routing, Telnyx AI-driven fraud analysis, Vonage verification analytics). RelayKit's two-layer security posture (country allow-list, rate limits, premium-prefix block — Pumping Defense Wave 1) addresses this; voice in the configurator should mention "we block premium-rate destinations by default" without going deep on the IRSF mechanism.

Phone-collection privacy framing matters. GitHub explicitly states they don't want to collect phone numbers and that's why they don't default to SMS. Configurator copy should respect that posture: SMS as a sub-use the developer chooses for specific moments, not as a phone-number-harvesting default.

## 6. Open questions / followups

- **Advisory wording for Sub-use 2** — the configurator UX needs one specific sentence when "Login 2FA" is selected. Candidate: "SMS is the most common second factor and the least secure — consider TOTP or passkeys for primary 2FA." Voice-compliant; Tier 2 product voice. Final wording lands during configurator UX work, not now.
- **Onboarding / Welcome boundary** — Session 91 surfaced "Onboarding / Welcome" as a possible category or sub. Practically: welcome-after-signup is the message that follows immediately after Sub-use 1 (signup phone verification). It can fold into Verification as a paired send, live under Marketing's onboarding flavor, or split off as its own category. Lean: fold into Verification as a paired follow-up template; the trigger is the same (account creation), and splitting fragments the user's mental model. Worth a settled call before message authoring.
- **Account events / Subscription lifecycle** — surfaced in three prior research files as a possible 9th category (trial ending, card declined, password changed, plan upgraded). Most of these are ACCOUNT_NOTIFICATION-shaped and don't belong in Verification. But the "password changed" event lives close to verification compliance flavor. Decision deferred to category-count resolution.
- **Sub-use 3 context-line length policy** — the optional context-line in step-up messages ("Confirm withdrawal of $X") could be one phrase or one sentence. Industry examples vary. Should authoring establish a hard char limit?
- **Recovery flow paired messaging** — Sub-use 4 (account recovery) sometimes ships with a paired notification to the original auth channel ("a recovery code was sent to +1***-****-1234"). Out of scope for Verification's message library, but the cross-channel pattern affects integration guidance.

## 7. Notable references

- `audits/PHASE_2A_VERIFICATION_EXTRACTION.md` (Sources 1+3, 684 lines): Twilio Verify, Telnyx Verify, Plivo Verify, Sinch Verification; ShipFast, Supastarter, MakerKit, Vercel-Supabase starter kits.
- `audits/PHASE_2A_VERIFICATION_SYNTHESIS.md` (Sources 2+4, 206 lines): Stripe, Vercel, Linear, Lemon Squeezy, GitHub practice scan; community signal across Indie Hackers, r/SaaS, founder forums.
- Twilio Verify pricing anchor: $0.0575 minimum per US verification.
- Prelude's Indie Hackers launch post (October 2024) — verbatim founder positioning: "We built Prelude to help founders and indie hackers like you onboard users with less headache and without letting fraud drain your budget."
- Signal Foundation 2023 operating budget disclosure: SMS verification $6M/year.
- GitHub anti-SMS-2FA posture: "We're not trying to collect your phone number, which is one reason we don't default to suggesting SMS!"
- RelayKit's own VERIFICATION_SPEC.md — product/engineering spec for the verification feature surface (SDK contract, server endpoint, code storage, validation logic, rate limits, dashboard panel).
