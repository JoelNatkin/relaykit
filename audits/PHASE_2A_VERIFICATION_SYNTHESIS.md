# Phase 2a Verification synthesis

> **Status: DRAFT — PM-authored, Session 83.** Synthesis output from Source 2 (indie SaaS practice scan) and Source 4 (community signal) per D-383 / D-384. Pairs with `audits/PHASE_2A_VERIFICATION_EXTRACTION.md` (Sources 1 + 3, CC-authored Session 82). Together they form the substrate for Phase 2b template authoring for the Verification category, which surfaces universally across all recommended combinations (including SaaS, Verification only, and others).

---

## §1 — What this document is

D-383 defines four research sources per category. D-384 splits execution: CC handles Sources 1 (competitor surface) + 3 (starter kit scan) — extraction-shaped, fact-heavy. PM handles Sources 2 (indie SaaS practice scan) + 4 (community signal) — synthesis-shaped, judgment-heavy. This file is the PM-led output for Verification, the pilot category.

The Source 1 + 3 extraction already captured what competitors expose and what starter kits pre-wire. This synthesis adds two adjacent perspectives: how the canonical-indie-SaaS reference set actually handles verification for their own users (Source 2), and what founders are saying about the category in public (Source 4). The four sources together drive a Verification category composition recommendation for IH launch.

The output that matters: the four-sub-use composition recommendation in §5 and the resulting authoring inputs for Phase 2b in §7.

---

## §2 — Source 2: indie SaaS practice scan

Targets: Stripe, Vercel, Linear, Lemon Squeezy, GitHub. The question: when these canonical-indie-SaaS references need to verify a user, what do they ship?

### §2.1 — Per-target findings

**Stripe** has the richest SMS-verification surface of the five — five distinct SMS-using surfaces total:

1. *Dashboard 2FA.* Supports SMS but explicitly frames it as a last-resort fallback. Hierarchy: passkeys > security keys > authenticator apps > SMS. Verbatim: "SMS-based 2FA is vulnerable to SIM-swapping and interception, so use it only as a last resort." Account checklist recommends passkeys or security keys.
2. *Stripe Express 2FA* (Connect platform partners). SMS-prominent in this surface — Connect partners with no Stripe Dashboard access often use SMS as primary. Rate-limit observed in support docs: ~5 SMS in 10–30 minutes.
3. *Stripe Link* (consumer one-click checkout). SMS verification when a saved consumer creates a Link account, returns on a new device, or uses Link on a new merchant site. This is the consumer-facing surface — the developer's customer's customer, not the developer's user.
4. *Stripe Identity* (KYC infrastructure product). Phone-number verification is one of two primary identity-verification paths offered to Stripe Identity customers; the other is document-based. Phone verification framed as "low-friction." Falls back to document verification if phone ownership cannot be confirmed.
5. *Account-health SMS.* Optional opt-in SMS for critical account-health events (disputes, fraud alerts, payout status). Transactional, not auth. Surfaces in the Stripe account checklist as "Set up SMS from Stripe for critical account health updates."

**Vercel** has zero SMS surface. 2FA shipped April 2025; only TOTP and passkey/WebAuthn methods. Email magic-link is the primary sign-in path; Git OAuth (GitHub/GitLab/Bitbucket) is the alternative; SAML SSO is the enterprise option. Phone number is not collected anywhere in the flow.

**Linear** has zero SMS surface. Login methods per Linear's own docs: Google SSO, email magic-link (called "email codes"), passkeys, and SAML SSO (Plus plan). Notable: Linear skipped TOTP entirely. They went email → passkey directly.

**Lemon Squeezy** has zero SMS surface for 2FA. Authenticator-app TOTP only (Google Authenticator named explicitly in their setup docs). Recovery codes (12 single-use codes) are the lockout fallback. Identity verification is a separate flow — document-based (government-issued ID upload), not phone-based. Identity re-verification is occasionally mandatory and pauses payouts until completed.

**GitHub** has the most explicit anti-SMS posture of the five. SMS-2FA is supported but actively discouraged. Verbatim from GitHub's docs: "We strongly recommend using a TOTP application for two-factor authentication instead of SMS, and using security keys as backup methods instead of SMS. SMS is susceptible to interception, does not provide resistance against phishing attacks, has unreliable deliverability, and is not supported in all countries." And from the community FAQ: "Privacy is important to us. We're not trying to collect your phone number, which is one reason we don't default to suggesting SMS!" Three additional restrictions: organizations can block SMS-2FA for members; SMS is country-limited by GitHub's delivery success rates; passkeys/security keys are positioned as the canonical primary method.

### §2.2 — Cross-target patterns

**Pattern 1: SMS-2FA-as-login is fading in indie SaaS.** Four of five targets either have zero SMS-2FA surface or actively discourage it. Only Stripe and GitHub still expose SMS-2FA at all, and both frame it as last-resort. The shift over the past 2–3 years has been toward TOTP and passkeys/WebAuthn as primary, with email magic-link as the universal sign-in primitive.

**Pattern 2: Where SMS still lives in indie SaaS is not "auth," it's "verification."** Stripe's five SMS surfaces decompose as: one auth surface (dashboard 2FA, deprecating), one auth-adjacent (Express 2FA for Connect partners), one consumer-facing (Link), one phone-ownership product (Identity), one transactional notification channel (account-health). Three of the five are not authentication in the strict sense — they're verifying phone-ownership, confirming consumer device, or sending transactional alerts.

**Pattern 3: Phone collection is framed as a privacy downside.** GitHub explicitly says they don't want to collect phone numbers and that's why they don't default to SMS. Vercel and Linear collect none. Lemon Squeezy collects identity documents but not phone. The implicit message: phone-as-an-identifier is a privacy burden, not a feature.

**Pattern 4: TOTP and passkeys are the auth-hardening surface.** Every target that ships 2FA in 2026 ships TOTP and/or passkeys. SMS is the legacy fallback. Stripe and GitHub maintain SMS for accessibility (some users can't use TOTP), country edge cases, and lockout recovery — not as the recommended primary path.

---

## §3 — Source 4: community signal

Source 4 sought founder voice on SMS verification — what founders need, avoid, pay, hate, and what would change their mind. The OTP STOP/HELP-in-body question from Source 1's universal silence was a specific thing to chase.

### §3.1 — Cost is the founder-visible pain

The single strongest signal: **founders discuss SMS verification primarily in terms of cost**, secondarily in terms of fraud, almost never in terms of compliance.

Three anchoring data points:

- **Signal Foundation (2023 operating budget, publicly disclosed):** SMS verification codes cost $6M/year, nearly matching the $7M for storage, servers, and bandwidth combined. Reported via TechCrunch coverage of Prelude's Indie Hackers launch.
- **Zenly (pre-Snap acquisition, per Prelude founders' Indie Hackers post, October 2024):** "SMS verification was one of our biggest expenses, with up to 30% of the budget lost to fraud." Direct founder-voice quote from the team that subsequently built a Twilio Verify alternative.
- **Twilio Verify pricing anchor:** $0.05 per successful verification + $0.0075 per US SMS = $0.0575 minimum per US verification. For 500 verifications/month, $28.75; 1,000, $57.50; 5,000, $287.50; 10,000, $575. RelayKit's $49 registration + $19/mo with 500 messages included + $8 per 500 over runs $19 / $27 / $91 / $171 at the same tiers — substantially cheaper at every realistic indie SaaS volume, and predictable in shape (no per-event uncertainty, no retry-attempt billing surprises).

The Prelude positioning is the most explicit indie-hacker-targeted competitor narrative in the space, verbatim from their IH post: "We built Prelude to help founders and indie hackers like you onboard users with less headache and without letting fraud drain your budget — freeing you up to focus on what really matters: growth." They name Clerk, BeReal, and Scalapay as customers — Clerk is the most relevant adjacent reference (auth-infrastructure-for-developers, indie-SaaS-adjacent).

### §3.2 — Fraud is the founder-visible second pain

Every Twilio Verify competitor pitches fraud defense as a primary differentiator: Twilio Fraud Guard, Prelude's smart routing across 30+ carriers, Telnyx's AI-driven fraud analysis, Vonage's verification analytics. This is the SMS pumping / IRSF (International Revenue Share Fraud) attack surface — the same threat model RelayKit's Pumping Defense Wave 1 work was built against.

Founder voice from Indie Hackers ("We've detected suspicious users abusing our API," 2019): "I would recommend a combination of automated checks + SMS based verification for suspicious logins. You could use clearbit scores and anyone with below 95 directly gets in. Others are forced to enter sms otp." Direct founder-to-founder recommendation, treating SMS-OTP as anti-fraud signal rather than auth. This frames SMS-OTP as a gate, not as a 2FA mechanism — a step founders surface only when other signals are ambiguous.

### §3.3 — Compliance is invisible to indie SaaS founders

Three search passes across Indie Hackers, r/SaaS, and adjacent founder forums on "10DLC," "TCR," "STOP HELP," and "SMS compliance" returned zero indie-hacker-voice discussions. Every result was CSP marketing copy (Text Request, Hustle, Textedly, SMS Magic, TSG Global, Microsoft Azure docs, Quo). The audience these CSPs speak to is enterprise SMS marketers and political-campaign operators, not founders.

The OTP STOP/HELP-in-body question from Source 1's universal silence (none of Twilio/Telnyx/Plivo/Sinch prescribe STOP/HELP language in their Verify-specific docs) cross-checks cleanly here. Indie hackers don't ask the question because their providers (Twilio Verify, Auth0, Clerk) absorb the compliance entirely. The question only surfaces when a developer attempts to roll their own SMS infrastructure on raw carrier APIs — at which point they hit a wall and either give up or migrate to a Verify-shaped product.

**The positioning implication is load-bearing.** If RelayKit's pitch to indie SaaS founders leads with "we handle 10DLC compliance," the response will be *"what's 10DLC?"* Compliance is invisible because their existing providers absorb it. The pitch needs to land on the visible pain (cost, easy integration, fraud defense) and treat compliance as the silent infrastructure that makes the visible pitch possible — never as a feature in itself.

### §3.4 — Pure SMS-2FA-as-login is genuinely deprecating

Cross-validation between Source 2 and Source 4: Source 2 shows the canonical references actively discouraging SMS-2FA (Stripe, GitHub) or never adding it (Vercel, Linear, Lemon Squeezy). Source 4 shows founders' SMS-pain conversation is about cost and fraud, not about strengthening login security. The TOTP/passkey transition is well-established; SMS-2FA is the legacy path that survives because of accessibility and country-edge-case constraints.

But the founder *vocabulary* lags the technology shift. Founders search "Twilio Verify alternative" and "SMS 2FA API" — Path A vocabulary — even when their actual use cases are Path B (signup-verify, sensitive-action step-up, account-recovery fallback). Twilio Verify itself blurs the categories: it markets "Signup verification / Login protection / Secure transactions" as one product surface, and founders inherit that framing.

---

## §4 — The Path A / Path B fork, resolved

Mid-research, two competing framings emerged for what the Verification category should actually pitch to SaaS-shaped audiences:

**Path A — channel-swap.** "Indie SaaS already ships email-OTP plumbing; we provide the SMS channel." Founders pick SMS as a stronger channel than email for the OTP use case they already have. Pitch composes around `verification.sendCode()` / `verification.checkCode()` for traditional login 2FA.

**Path B — different category.** "Login OTP is fading. SMS lives now in the verifications that aren't login: phone-ownership at signup, sensitive-action step-up, account recovery." Pitch composes around the same SDK primitives but applied to use cases TOTP/passkey can't cover.

**Resolution:** the Verification category ships both, framed as Path A vocabulary serving Path B reality.

- **Pitch surface** (what founders read in marketing and search for): Path A. "$19 Twilio Verify replacement." "SMS OTP for your SaaS." Lead with the price-anchor and verb founders already use. Founders don't have Path B vocabulary; forcing it would lose conversion.
- **Architectural reality** (what we actually compose into the Verification category): all four sub-uses below, behind the same `verification.sendCode()` / `verification.checkCode()` primitive. The sub-uses share OTP plumbing but differ in template wording and intake context.

This resolution matches the Source 2 + 4 picture honestly: SMS-2FA-as-login isn't dead, but it's the smallest of four sub-uses by current trend; the bulk of category value comes from the other three.

---

## §5 — Verification category composition: four sub-uses

The Verification category ships four message sub-uses in IH launch (richer, full composition per Joel's Session 83 call). **These four sub-uses are universal across all recommended combinations that surface Verification** — SaaS, Verification only, Personal services, Real estate, Fitness, E-commerce, Custom. The recommended combinations curate which categories get pre-selected for the developer; they do not customize what's inside any category. Nothing about the messages is bespoke per audience.

### Sub-use 1 — Signup phone verification (PRIMARY)

The developer's user creates an account; the developer wants to verify they own the phone number they registered. Distinct from login 2FA — this is one-time phone-ownership proof at the account-creation moment, regardless of whether SMS is later used for auth.

- **Why primary:** Source 2 evidence (Stripe Identity's phone-verification path, Stripe Link's device-verify) shows phone-ownership-proof is the most-shipped SMS-verification use case in indie SaaS that survives the TOTP/passkey transition. Source 4 evidence (founder-to-founder anti-fraud advice on IH) confirms founders reach for SMS-OTP as a signup-fraud gate, not as ongoing auth.
- **Template shape:** Single-message OTP send + verify. Sender frame: account-creation context. Variable: `{{code}}`.
- **Intake question:** "What does your user see right before they get this code?" (anchors the message to a recognizable moment in the user's onboarding flow.)

### Sub-use 2 — Login 2FA with advisory (SECONDARY)

The developer's user already has an account; they're logging in and the developer wants SMS as a second factor. Path A use case, supported with explicit advisory framing per Source 2 evidence that the leading SaaS references treat SMS-2FA as last-resort.

- **Why secondary not primary:** Source 2 evidence shows this use case is actively deprecating in canonical indie SaaS (Vercel and Linear never added it; Stripe and GitHub discourage it). Source 4 evidence shows founders still use the *vocabulary* of SMS-2FA even when the actual use cases are Path B. We support both to honor the vocabulary and the reality.
- **Advisory framing (configurator UX surface, not message body):** something like *"SMS is the most common second factor and the least secure — consider TOTP or passkeys for primary 2FA."* One sentence, factual, Tier 2 voice per VOICE_AND_PRODUCT_PRINCIPLES_v2. Surfaces when "Login 2FA" sub-use is picked in the configurator; never in the message body itself; lives in docs as part of the broader verification guidance.
- **Template shape:** Single-message OTP send + verify. Sender frame: login context. Variable: `{{code}}`.
- **Intake question:** Same plumbing as Sub-use 1; the difference is the context the user sees the message in.

### Sub-use 3 — Sensitive-action step-up (SECONDARY)

The developer's user is performing a high-stakes action — withdrawing funds, changing payment details, transferring ownership, exporting data, deleting account — and the developer wants explicit phone-channel confirmation before completing it. Marketplace-flow shape: the user already trusts their session, the developer wants extra friction at a specific moment.

- **Why included:** Stripe Identity, Stripe Express, and similar marketplace flows explicitly call out SMS step-up for high-value transactions. This is a real and growing surface — passkeys can't reach a phone-channel for out-of-band confirmation. Joel's Session 83 endorsement: "sound worthwhile."
- **Template shape:** Single-message OTP send + verify, with optional context-line in the message body (e.g., "Confirm withdrawal of $X").
- **Intake question:** "What action triggers this verification?" (drives the optional context-line.)

### Sub-use 4 — Account-recovery channel (TERTIARY)

The developer's user lost access to their primary auth method (email compromised, TOTP device lost, passkey-bound device unavailable) and needs an out-of-band recovery channel. SMS as the lockout fallback, not as primary auth.

- **Why included:** GitHub and Stripe both maintain SMS specifically for this use case even while discouraging it for login 2FA. Joel's Session 83 endorsement: "sound worthwhile."
- **Why tertiary:** lower volume per customer than the other three; conditional surface (only fires when other auth fails).
- **Template shape:** Single-message OTP send + verify. Sender frame: account-recovery context, explicit that the user requested it.
- **Intake question:** "What can your user do once they get this code?" (frames the recovery action.)

### Out of Verification category at IH launch

**End-customer / multi-tenant verification** (the developer's customer's customer — e.g., the user's marketplace seller verifying their own withdrawal) is a real growth vector but stays in BACKLOG per Joel's Session 83 read. Multi-tenant flows require account-architecture work (per-tenant brand registration, per-tenant compliance site, billing implications) that's out of scope for IH launch.

---

## §6 — Variable-syntax convention

Source 1 finding: no industry standard. Twilio uses `{{code}}` (lowercase double-brace), Telnyx uses `{{code}}` (lowercase double-brace), Plivo uses `${code}` (dollar-brace), Sinch uses `{{CODE}}` (uppercase double-brace). Four competitors, three conventions.

**Recommendation: `{{code}}` lowercase double-brace.** Reasoning:

1. Matches two of four competitors (Twilio, Telnyx) — the two with the largest indie-SaaS-developer mindshare.
2. Matches Mustache/Handlebars conventions every founder has encountered in template work.
3. Reads cleanly in template strings: `"Your verification code is {{code}}. It expires in 10 minutes."`
4. Lowercase matches the variable-naming conventions in modern TypeScript/JavaScript ecosystems.

This unblocks line-1 template authoring in Phase 2b. The single-source impl per D-381 remains deferred (storage architecture stays TBD until workspace activates post-IH); the syntax convention is upstream of that and can be settled now.

---

## §7 — Authoring inputs for Phase 2b

When Phase 2b template authoring opens for Verification, the authoring chat receives:

1. **The four sub-uses from §5** with their template shapes and intake questions.
2. **The variable-syntax convention from §6** (`{{code}}` lowercase double-brace) — applied to every template across all four sub-uses.
3. **Voice register** per VOICE_AND_PRODUCT_PRINCIPLES_v2 — Tier 2 product voice in templates (quiet, confident, short), Tier 3 advisory framing in docs and configurator copy.
4. **The advisory framing for Sub-use 2** — verbatim or paraphrased line ready to drop into configurator UX when "Login 2FA" is selected.
5. **The OTP-body-text exemption posture from Source 1** — Source 1's universal silence on STOP/HELP-in-body for Verify-specific use cases means RelayKit's transactional OTP messages do not include STOP/HELP language in the body. This is consistent with Twilio/Telnyx/Plivo/Sinch Verify-product docs and with the carrier carve-outs for 2FA traffic. Marketing templates (different namespace) follow different compliance rules.
6. **Anti-cookie-cutter discipline** — five TCR sample messages per registration per RelayKit's anti-cookie-cutter strategy. The four sub-uses naturally produce more than five candidate messages; selection rotation discipline applies.

---

## §8 — Methodology evaluation: hybrid CC-extraction / PM-synthesis split

D-384 piloted the hybrid execution split on Verification. Evaluation against the pilot:

**What worked:**

- Extraction phase produced a 684-line traceable substrate (audits/PHASE_2A_VERIFICATION_EXTRACTION.md) with per-target sourcing, paraphrase/quote discipline, and a closing-gaps block per target. PM read it linearly during synthesis without re-fetching.
- Synthesis phase resolved a real product-design fork (Path A vs Path B) using cross-source evidence — Source 1's pricing/methods, Source 2's deprecation posture, Source 3's missing-SMS-channel pattern, Source 4's founder-voice cost-pain. The fork was not visible from any single source; cross-source synthesis produced it.
- Per-commit `.pm-review.md` cadence during extraction held; CC-PM gate friction stayed low.

**What surfaced for refinement:**

- Source 4 community-signal yielded mostly competitor marketing rather than raw founder voice. Reddit/Discord/Twitter discussions on SMS-verification are sparse and shallow at the indie-SaaS founder layer — the topic doesn't generate as much organic discussion as adjacent topics (Stripe billing, OAuth providers, AI tools). The Source 4 finding is itself a finding: silence is signal. But future categories may need adjusted search strategies if community discussion is similarly sparse.
- The compliance/STOP-HELP-in-body question that surfaced in Source 1 as "universal silence" cross-validated cleanly in Source 4 as "compliance is invisible to indie SaaS founders." This kind of cross-source confirmation is exactly what the four-source method was designed to surface. Worth noting as a methodology success — the question raised in extraction was answered in synthesis.

**Generalization recommendation:** the hybrid split should generalize to the other eight categories with one adjustment — for categories where Source 4 community discussion is likely to be sparse (Marketing, Internal, Community, Waitlist, Higher Ed), set expectations that Source 4 may produce silence-as-signal rather than rich founder voice, and adjust per-category synthesis time accordingly. Marketing is likely the inverse case — heavy community discussion, the challenge will be filtering rather than finding.

---

## §9 — Open carry-forward items

- **Verification category composition decision (D-number candidate):** the four-sub-use composition in §5 plus the advisory framing for Sub-use 2 plus the end-customer/multi-tenant defer to backlog. Apply seven gate tests at recording time.
- **Variable-syntax convention (D-number candidate):** `{{code}}` lowercase double-brace per §6. Apply seven gate tests at recording time. Unblocks Phase 2b template authoring.
- **D-384 generalization evaluation:** §8 conclusion is "generalize with Marketing/Internal/Community caveat." May land as a methodology refinement D-number or as a process note in the Marketing-category prompt setup. Joel's call.
- **Positioning recommendation (MD-number candidate, marketing-layer):** the "founder-visible pain is cost + fraud, compliance is invisible" insight from §3.3 has implications for the IH-launch pitch shape. Belongs in MARKETING_STRATEGY when MD-number-worthy. Not blocking Verification category composition.

---

*PM-authored Session 83. Pairs with `audits/PHASE_2A_VERIFICATION_EXTRACTION.md`. Substrate for Phase 2b authoring chat.*
