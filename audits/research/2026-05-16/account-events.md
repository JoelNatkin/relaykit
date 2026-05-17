# Account events — Lead-Magnet Research
**Date:** 2026-05-16
**TCR mapping:** ACCOUNT_NOTIFICATION
**Classification:** discrete
**Authored by:** PM (Session 92)

## 1. Industry pattern observations

Account events SMS covers messages triggered by account-state changes — billing events (card declined, trial ending, subscription renewed), security events (password changed, new device sign-in), and lifecycle events (account suspended, plan changed). The defining trigger is that *something happened to the user's account* without the user taking an action in that moment; the message exists to notify them about it.

This is the most-common SMS shape for SaaS billing operations. Stripe, Linear, Vercel, Lemon Squeezy, Paddle, GitHub all ship some subset of these — but the vast majority ship as email. SMS in this category is rare in indie SaaS today, primarily because the providers indie SaaS founders use (Stripe Billing, Paddle, Lemon Squeezy as merchant of record) default to email-only billing notifications and SMS requires custom integration.

Where SMS does appear in this category, it concentrates on the urgent subset:
- Card declined / payment failed (Stripe Dashboard account-health SMS opt-in)
- New device sign-in (GitHub, sometimes Stripe)
- Suspicious activity / security alerts (GitHub, Linear)
- Trial ending (rare today, high-value pattern)

The cost-vs-email-deliverability calculus is unusually favorable here: card-declined emails get caught in spam filters, buried in promotional folders, or skimmed past. A card-declined SMS reaches the user in seconds with carrier-tier deliverability. The ROI on SMS for billing-critical events is high — every day a payment stays declined is a potential churn event. Indie SaaS founders who learn this typically wire up SMS for the urgent billing subset specifically; the lifecycle messages stay email.

Reference apps observed:
- **Stripe Dashboard:** account-health SMS opt-in (disputes, fraud alerts, payout status)
- **Stripe Billing:** powers most indie SaaS billing — email-primary, no native SMS
- **GitHub:** email + SMS for security events (new-device sign-in, suspicious activity), email-only for billing
- **Linear, Vercel:** email-only billing; security events email-only
- **Lemon Squeezy, Paddle:** email-only as merchants of record
- **Indie SaaS billing pain on IH/Twitter:** founder discussions frequently mention "I lost customers because they didn't see the card-declined email" — strong founder-visible pain point, weak existing-provider coverage

The category's load-bearing claim for indie SaaS positioning is "your churn-critical messages get there." That's a real differentiator versus the email-primary default.

## 2. Subs identified

Five discrete subs. Each is its own trigger-response — no workflow composition. Subs group related triggers that share template shape and voice.

1. **Payment failed** — card declined, charge failed, payment method expired, automatic retry exhausted. The most urgent sub; user must act or service interrupts. Action token: link to update payment method. Variables: business name, payment last-4 (optional), retry timing (optional). Examples: "Your card ending in 4242 was declined. Update payment to keep your subscription active: {{billing_link}}."

2. **Trial / renewal upcoming** — trial ending in N days, annual renewal upcoming, free-tier limit approaching. Action-required sub but less urgent than payment failed. Action token: link to upgrade or manage. Variables: trial end date, plan name, days remaining. Example: "Your {{app_name}} trial ends in 3 days. Pick a plan to keep your data: {{upgrade_link}}." **Per D-399: this template carries zero promotional content — no discount codes, no upgrade offers. The trigger speaks for itself.**

3. **Subscription confirmation** — renewal succeeded, plan changed (upgrade/downgrade), subscription canceled, refund issued. Confirmation sub, low urgency, no action required. **Per D-391, refund issued lives here** (state change shape, not ticket-resolution shape). One sub bundles multiple triggers because the template shape is the same: "X happened, here's the receipt." Variables: plan name, amount, effective date. Affiliate/referral SMS also routes here per D-390 (account-event-triggered notifications).

4. **Security event** — password changed, new device sign-in, suspicious activity detected, MFA method added/removed, API key created/revoked. Time-sensitive sub — the user needs to see it now to detect compromise. Voice must be alarming enough to prompt attention without panic. Action token: link to review activity or revert change. Variables: event type, timestamp, device or location context.

5. **Account status change** — account suspended, account restored, account closed, access revoked. Low frequency, high importance when fires. Often paired with email for full context. Variables: status, reason summary, recovery action if applicable.

Five subs is fewer than the category could support (refund issued, payment method updated, plan-change-specific templates could all be split out), but bundling under "subscription confirmation" and "security event" matches the Marketing-category pattern of grouping triggers that share shape.

## 3. Voice patterns observed

Account events SMS is **direct, factual, action-pointed** — every message has a clear "here's what happened, here's what to do (if anything)." Voice that works: "Your card ending in 4242 was declined. Update payment: {{link}}." Voice that fails: "Hi Joel! We noticed that your most recent payment attempt was unsuccessful. We'd love to help you resolve this issue — please log in to your account at your earliest convenience to update your payment method."

Length: 80-140 characters typical. The fact + the action link + optional context. Longer for security events when device or timing context aids the user's threat assessment.

Urgency framing: factual urgency is fine ("Your card was declined" / "Your trial ends in 3 days"); false urgency or pressure tactics break the transactional posture and erode trust. The trigger speaks for itself — the message doesn't need to amplify it.

Personalization tokens: business name always (per D-398, surfaces as `{{workspace_name}}` for multi-workspace apps), account-context identifier (card last-4, trial expiry, plan name, device name), action link when applicable. First name optional and often omitted. Deep merge data rare except for security events where device/location context is the value.

**Critical voice discipline (per D-399):** account events templates carry zero promotional content. "Your trial ends in 3 days. Upgrade: {{link}}" is fine (factual + action). "Your trial ends in 3 days. Upgrade now and get 20% off your first month: {{link}}" crosses into MARKETING territory and breaks the campaign mapping. The boundary is sharp and system-enforced — the editor surfaces an error when promotional content is added to a transactional template.

Security event voice has a unique requirement: alarming-but-not-panicking. "Someone just signed in to your account from a new device in {{location}}. Not you? Secure your account: {{link}}." Gets attention without crying wolf.

## 4. B2B vs B2C variations

Most paid SaaS that ships this category skews B2B. Voice register is professional-direct, not warm. B2C consumer subscription apps (Spotify, Netflix, streaming services) use softer voice — but those aren't indie SaaS and don't drive the relevant patterns.

Indie SaaS that targets a B2C end-user (e.g., a consumer app built by an indie founder) still tends to use professional-direct voice for billing — consumers expect billing messages to be transactional, not chatty.

Subscription billing flavor dominates the category. One-time-payment shops (e-commerce, course platforms) have a different shape — order confirmations sit under Order updates, not Account events. Per D-394: Order updates covers one-time purchase events; Account events covers recurring subscription lifecycle.

Multi-org / multi-account framing is the variation worth flagging: when a user has multiple subscriptions or belongs to multiple workspaces, messages must identify which account/workspace is affected ("Your *Acme* card was declined" not just "Your card was declined"). Per D-398, the `{{workspace_name}}` token ships in every Account events template by default — single-workspace apps pass business name, multi-workspace apps pass the affected workspace.

## 5. Compliance constraints / TCR considerations

ACCOUNT_NOTIFICATION mapping is a clean fit. Standard auto-approved TCR category. The trigger is always a discrete account event; the message is always transactional confirmation or alert.

Critical compliance pressure point (covered by D-399): **promotional CTA creep.** A trial-ending message that includes an upgrade offer is borderline; a trial-ending message with a discount code crosses into MARKETING and requires that separate campaign registration. RelayKit's authored templates hold the line strictly, and the editor enforces it — Account events sends factual notifications about account state, never offers or discounts.

Frequency: per-user volume is low (a few billing messages per year, occasional security events). No frequency-perception issues at carrier level. Bulk concerns don't apply.

STOP/START/HELP: universal compliance requirement. All Account events templates must honor opt-out, though the developer-side trade-off is real — a user who opts out of Account events SMS may miss a card-declined notification and churn as a result. Configurator copy should surface this trade-off when the category is selected.

Sender frame: business name + account context (workspace token per D-398). Account events SHOULD always identify which account/business the message refers to, especially for users with multiple subscriptions. Generic "Your card was declined" without sender context is confusing and feels like phishing.

Security event subs have a special voice consideration around impersonation: phishing SMS often mimics "new device sign-in" alerts to bait users into clicking malicious links. Genuine RelayKit-routed security alerts should link to the developer's authenticated UI, never to inline credential entry. Voice guidance during authoring should make this explicit.

## 6. Open questions / followups

- **Welcome / account-created placement** — **RESOLVED per D-389.** Welcome lives in Verification as a paired follow-up under Sub-use 1 (signup phone verification). The standalone shape (welcome SMS without verification flow) is rare enough not to need a dedicated home in Account events at launch. If post-launch data shows demand, add a "Welcome / account created" sub here.
- **Refund issued placement** — **RESOLVED per D-391.** Stays in Account events Sub 3 (subscription confirmation). Refund is an account-state change, not a support-ticket resolution.
- **Plan-change template granularity.** Sub 3 bundles renewal / plan change / cancellation under one umbrella. Whether upgrade, downgrade, and cancellation each warrant their own template within the sub (vs. one generic template with conditional variables) is an authoring-time call. **DEFERRED** to message authoring.
- **Multi-org / multi-workspace framing** — **RESOLVED per D-398.** All Account events templates include `{{workspace_name}}` token by default. Single-workspace apps pass business name; multi-workspace apps pass the affected workspace.
- **Security event escalation pathways.** "Suspicious activity detected" can point to (a) password change, (b) MFA setup, (c) security settings review, or (d) a recover-account flow. Default action varies per app architecture. **DEFERRED** to configurator UX work — configurator should let developers pick the primary action; templates support a single action token.
- **Carry-forward — research depth.** This category was added to the candidate list mid-Session 92, after the Phase 2a verification audit-depth research had already concluded. The research here is at lead-magnet depth from PM observation, not from the four-source audit framework D-384 used for Verification. If customer pull post-launch warrants it, a deeper audit pass on this category may be worth running. No action at launch.

## 7. Notable references

- Stripe Dashboard account-health SMS opt-in (canonical indie SaaS pattern)
- Stripe Billing email notification taxonomy (most indie SaaS billing today)
- GitHub security alert patterns (email + SMS for new-device sign-in)
- Linear and Vercel billing email patterns (no SMS — representative of email-only norm)
- Paddle and Lemon Squeezy merchant-of-record email defaults
- Founder discussions on Indie Hackers and Twitter about churn from missed card-declined emails (the load-bearing positioning anchor)
- TCR ACCOUNT_NOTIFICATION definition and approved use cases
- RelayKit's own VERIFICATION_SPEC.md §10 reference to "account-recovery channel" — adjacent category boundary
