# Phase B Prior-Art Digest
Date: 2026-05-11
Sources (in priority order, all under `docs/archive/` unless noted):
1. `RELAYKIT_PRD_CONSOLIDATED.md` (Apr 15 2026, archived 2026-04-21)
2. `PRD_02_TEMPLATE_ENGINE.md` v2.0 (Mar 3 2026) — heaviest category-substance source
3. `PRD_07_LANDING_PAGE.md` v3.0 (Mar 3 2026)
4. `PRD_05_DELIVERABLE.md` v3.0 (Mar 3 2026)
5. `EXPLORATION_BRIEF_v2.md` (Mar 13 2026)
6. `PRD_09_MESSAGING_PROXY.md` v1.0 (Mar 1 2026)
7. `PROTOTYPE_PROPOSAL.md` (Mar 8 2026)
8. `RELAYKIT_PRODUCT_VISION.md` (Mar 12 2026)
9. `PRD_06_DASHBOARD.md` v3.0 (Mar 3 2026, sections 1–5 read in full; sections 6+ skimmed)
10. `PRD_01_INTAKE_WIZARD.md` (Feb 26 2026) + `PRD_01_ADDENDUM_DASHBOARD_FLOW.md` (Mar 3 2026)
11. `V4 - ADDENDUM_MIXED_CAMPAIGN_AND_PRICING.md` (Mar 4 2026)

Plus `/src` light scan (per D-358, code is being sunset but content remains authoritative for substance):
- `/src/lib/intake/use-case-data.ts` (9 use cases, included/notIncluded scope, expansion options) — read in full
- `/src/lib/intake/campaign-type.ts` (campaign type mapping + promo-expansion logic) — read in full
- `/src/lib/intake/templates.ts` (preview templates per use case with sample-message labels) — read in full
- `/src/lib/templates/message-templates.ts` (PRD_02 materialized — 9 use cases × 5–8 base + 3–4 expansion templates) — 1230 lines, read first 180 lines (appointments full set + types/constants), structure inferred for remaining categories from PRD_02 mirror
- `/src/lib/templates/verticals/modules/` — 17 industry modules (healthcare, mental-health, financial, legal, restaurant, real-estate, fitness, automotive, beauty-wellness, ecommerce, education, home-services, nonprofit, saas, veterinary, appointments-general, appointments-medical) — sizes 22–41 lines each, healthcare read as exemplar
- `/src/lib/templates/verticals/detection.ts` — vertical detection regex map (dental, medical_general, mental_health, physical_therapy, veterinary, salon_spa, fitness, legal, financial, restaurant, real_estate) — first 80 lines read
- `/src/lib/intake/industry-gating.ts` — three-tier industry gating (cannabis/firearms decline; healthcare/legal/financial/restaurant gated) — header + grep

Scope: Synthesis of pre-archive thinking about RelayKit's category lineup, workflows, sub-uses, message drafts, and variable models. Phase 2a is the research phase that precedes per-category content authoring for the marketing-site home configurator. The prior-art body of work captured here is the substrate Phase 2a builds on — what to keep, what's been superseded, what's missing.

---

## Headline finding — read before everything else

**Prior PRDs and `/src` consistently enumerate nine use cases as: Appointments, Orders, Verification, Support, Marketing, Internal (Team alerts), Community, Waitlist, and *Exploring*.** This nine-way lineup appears in `RELAYKIT_PRD_CONSOLIDATED.md` §"Use Cases and Message Systems", `RELAYKIT_PRODUCT_VISION.md` §2, `PRD_02_TEMPLATE_ENGINE.md` §3–§4 (campaign descriptions + message templates for all nine), `PRD_06_DASHBOARD.md` §3 (use-case-tile grid), `PRD_07_LANDING_PAGE.md` §5 (use-case tiles), `EXPLORATION_BRIEF_v2.md` §"Category landing pages", `PROTOTYPE_PROPOSAL.md` §2 Screen 1 ("8 + Just exploring"), `PRD_01_INTAKE_WIZARD.md` §2 (8 use case tiles, Exploring added in PRD_02 v2.0), and `/src/lib/intake/use-case-data.ts` `UseCaseId` union. Every artifact agrees.

**The PM-specified Phase 2a launch posture grid replaces Exploring with Higher Education.** The 9 categories the Phase 2a prompt asks me to digest are Verification, Appointments, Orders, Support, Marketing, Team alerts, Community, Waitlist, **Higher Education** — but no prior PRD, brief, or `/src` file mentions Higher Education as a category. No template set, no campaign-type mapping, no sub-use enumeration, no opt-in disclosure, no compliance posture. The Higher Education category will be authored from a blank slate in Phase 2a — there is no prior-art surface to mine.

Conversely, the `exploring` category has substantial prior thinking — 8 base + 3 expansion message stubs in PRD_02 §4, dedicated campaign-description and opt-in-disclosure language, a `LOW_VOLUME` TCR mapping, and a `/src` implementation. The current launch posture rotates Exploring out (likely correctly — it was a tile design hack for "Just exploring" indecision, not a real audience). Carrying any of that prior thinking into Higher Ed would be cargo-culting. **Flag this surprise to PM before Phase 2a content authoring starts** — it changes which categories carry forward and which start from zero.

Note also: the SDK and current product surface keep `internal` as the SDK namespace key but rename to "Team alerts" in customer-facing copy (D-273 SDK namespaces; PRD_06 and `/src` tile label "Team & internal alerts"). PM's "Team alerts" in the Phase 2a list is consistent with the customer-facing label, not a category renaming.

---

## Per-category sections

Categories are listed in PM-supplied order. For each: prior thinking, sub-uses considered (with citations), workflows / triggers, message drafts (verbatim where they encode meaningful linguistic patterns), variable models, and a carry-forward verdict against current product reality (key decisions: D-358 `/src` sunset, D-330 SDK static, D-333 marketing always separate, D-360 verification as cross-vertical primitive, D-372 three-layer model, D-375 marketing-site replicates Tiptap editor, D-377 verification toggleable + "Verification only" preset, D-379/D-380/D-381 ONE SET + 4 editable placeholders + canonical-source impl deferred).

---

### 1. Verification

**Prior thinking.** Verification was the deepest-considered category in the archive — the headline "5 minutes to first SMS" claim in `PRD_07` and the `RELAYKIT_PRODUCT_VISION.md` opening flow are anchored to OTP. `PROTOTYPE_PROPOSAL.md` §2 puts verification first in its Screen 1 modal content because "every message is triggered by your user — they request it, your app sends it. Highest-trust SMS category with carriers." `PRD_02_TEMPLATE_ENGINE.md` §9 explicitly maps verification → TCR `TWO_FACTOR_AUTHENTICATION` and notes that opt-out language is intentionally omitted from OTP/2FA per CTIA convention.

**Sub-uses considered:**
- One-time login codes (`verification_login_code`) — PRD_02 §4 base #1
- Signup/phone verification codes (`verification_signup_code`) — PRD_02 §4 base #2
- Password reset codes (`verification_password_reset`) — PRD_02 §4 base #3
- Multi-factor auth codes (`verification_mfa_code`) — PRD_02 §4 base #4
- New device alerts (`verification_device_confirmation`) — PRD_02 §4 base #5
- Account-related notifications (password resets, security alerts) — `/src/lib/intake/use-case-data.ts` expansion `account_notifications`
- Onboarding / welcome messages — `/src` expansion `onboarding_welcome`, PRD_02 expansion E2

**Workflows / triggers (per PRD_02 §4 verification table).** All triggers are user-initiated: "When user requests login OTP" / "During account registration" / "When user requests password reset" / "When MFA is triggered" / "When login from new device detected". No scheduled or campaign-style triggers. Welcome/security-tip are user-action triggered ("After account creation" / "After successful verification"). Feature-announcement (E3 — expansion) is manual-send.

**Message drafts (verbatim from PRD_02 §4, materialized in `/src/lib/templates/message-templates.ts`).** Three carry distinctive linguistic patterns worth preserving:
- `"Your {app_name} verification code is {code}. This code expires in 10 minutes. If you didn't request this, ignore this message."` — 10-minute expiry, opt-out omitted, "if you didn't request" safety line.
- `"{app_name}: Use code {code} to verify your phone number. This code expires in 5 minutes."` — 5-minute expiry on signup vs. 10-minute on login (signup is higher-friction; faster expiry = stronger anti-replay).
- `"{app_name}: Your security code is {code}. Do not share this code with anyone. This code expires in 5 minutes."` — "Do not share" warning specific to MFA.

`/src/lib/intake/templates.ts` Preview variants (review-page only): three sample stubs using `{{code}}`, `{{name}}` double-brace syntax — divergent from `/src/lib/templates/message-templates.ts` which uses single-brace `{code}`. The double-brace `/src/lib/intake/templates.ts` set is the TCR-preview surface; the single-brace `/src/lib/templates/message-templates.ts` set is the dashboard plan-builder library. **This is a real prior variable-model split** (see Cross-cutting Patterns).

**Variable model.** `{app_name}` (preferred over `{business_name}` for verification — PRD_02 §2, `/src/lib/intake/use-case-data.ts` `notIncluded` line in personalization step), `{code}`, `{website_url}`. Opt-out language explicitly excluded for OTP/2FA per CTIA convention.

**TCR mapping.** `TWO_FACTOR_AUTHENTICATION` campaign type — narrowest, highest-trust, fastest approval.

**Carry-forward.** **All sub-uses survive into the current product as cross-vertical primitives, not as a category in the home configurator.** D-360 establishes verification as a feature included with every vertical (the OTP-as-feature design). D-370 establishes the symmetric `sendCode`+`checkCode` pair on every SDK namespace. D-369 establishes server-side validation infrastructure (hashed code storage, TTL, attempt tracking, rate limits). D-371 establishes verification template customizability. Phase 6 (MASTER_PLAN.md §10) ships verification-as-feature at launch.

**The implication for Phase 2a is that Verification's "category" framing is being demoted to a cross-vertical primitive.** D-377 (Session 78) records that verification is a toggleable category in the configurator with a "Verification only" preset — meaning customers who only want OTP get a different surface treatment than customers who want OTP plus other verticals. The home configurator should still let customers preview verification-shaped messages (the sub-uses above are still real), but the launch posture has Verification both a peer category and a primitive layered across the others. Phase 2a content authoring needs to decide what verification's home-configurator stub looks like given this dual role.

**Worth carrying forward into Phase 2a:** the user-initiated trigger framing (no opt-out required, CTIA convention), the per-sub-use expiry differentiation (5 min for signup/MFA, 10 min for login), the "Do not share" MFA warning, the `{app_name}`-over-`{business_name}` variable convention. Worth discarding: the welcome/security-tip expansion stubs (they're marketing-shaped, conflict with D-333's "marketing is always a separate campaign", and were already classified as `expansion_type: 'mixed'` or `'marketing'` in PRD_02).

---

### 2. Appointments

**Prior thinking.** Appointments is the only category currently working end-to-end in the prototype (per MASTER_PLAN.md §1 "The State of Things"). The category landing page surface, the messages page, and the SDK namespace methods all have appointments as their reference vertical. PRD_02 §4 specifies 6 base + 4 expansion messages — the deepest message-lifecycle treatment of any category. `RELAYKIT_PRODUCT_VISION.md` §0 uses "your dental appointment" vs "your appointment" as the canonical example of vertical-aware personalization. `EXPLORATION_BRIEF_v2.md` and `PROTOTYPE_PROPOSAL.md` both use appointments as the prototype's first-class case.

**Sub-uses considered:**
- Booking confirmation (`appointments_booking_confirmation`) — base #1, default-enabled
- 24-hour appointment reminder (`appointments_reminder_24hr`) — base #2, default-enabled
- Rescheduling confirmation (`appointments_reschedule_confirmation`) — base #3
- Cancellation notice (`appointments_cancellation`) — base #4, default-enabled
- No-show follow-up (`appointments_noshow_followup`) — base #5
- Pre-visit instructions (`appointments_previsit`) — base #6
- Promotional offer (`appointments_promo_offer`) — expansion, marketing
- Birthday/anniversary (`appointments_birthday`) — expansion, marketing
- Re-engagement ("we miss you") (`appointments_reengagement`) — expansion, marketing
- Review request (`appointments_review_request`) — expansion, mixed
- `/src/lib/intake/use-case-data.ts` adds: promotional offers to past clients (expansion `promotional_offers_past_clients`), reviews/feedback after appointments (expansion `reviews_feedback`), birthday/anniversary (expansion `birthday_anniversary`)

**Workflows / triggers.** Highly sequential — defines the canonical appointment lifecycle: booking → 24 h reminder → (reschedule branch) → (cancel branch) → (no-show branch) → day-of pre-visit → (post-visit promotional / review / re-engagement branches). PRD_02 §4 trigger column is the most precise spec across all categories: "When client books an appointment" / "24 hours before appointment" / "When client reschedules" / "When appointment is cancelled" / "After a missed appointment" / "Morning of appointment". The Vertical detection module `/src/lib/templates/verticals/modules/appointments-general.ts` (26 lines) plus `appointments-medical.ts` (32 lines) — both auto-injected from `business_description` regex match — adapts the language layer (dental/salon/medical/veterinary/fitness).

**Message drafts.** PRD_02 §4 verbatim, mirrored in `/src`:
- `"{business_name}: Your {service_type} appointment is confirmed for {date} at {time}. See you then! Reply HELP for help, STOP to unsubscribe."`
- `"{business_name}: Reminder — your {service_type} appointment is tomorrow at {time}. Reply C to confirm or R to reschedule. Reply STOP to opt out."`
- `"{business_name}: Your appointment has been rescheduled to {date} at {time}. Reply STOP to opt out of messages."`
- `"{business_name}: Your appointment on {date} has been cancelled. To rebook, visit {website_url} or call us. Reply STOP to unsubscribe."`
- `"{business_name}: We missed you today! Would you like to reschedule your {service_type} appointment? Reply YES or visit {website_url}. Reply STOP to opt out."`
- `"{business_name}: Your appointment is today at {time}. Please arrive 10 minutes early. Questions? Reply to this message. Reply STOP to opt out."`

**Variable model.** `{business_name}`, `{service_type}` (where `service_type` is the personalization-step field that toggles "dental" / "hair salon" / "medical" — this is the vertical-aware token), `{date}`, `{time}`, `{website_url}`. Two-way reply primitives: `C` (confirm), `R` (reschedule), `YES` (rebook).

**TCR mapping.** `CUSTOMER_CARE` campaign type (PRD_02 §9, `/src/lib/intake/campaign-type.ts`). Promotional/review expansions upgrade to `MIXED`.

**Carry-forward.** Appointments is the most-tested category and is the right anchor for Phase 2a's home configurator. Substantially all sub-uses, all triggers, and all message drafts survive into current product reality — the prior thinking is well-suited to direct re-use. The only thing to reconsider per D-379/D-380/D-381 is the **personalization model**: the personalization-step `service_type` field needs to become one of the home-configurator's 4 editable placeholders (currently `businessName` and `website` are the only two — D-380 mandates expansion to at least four). PROTOTYPE_PROPOSAL.md §2 Screen 2 already prescribes service_type as a personalization field for appointments specifically; this is now generalized.

**Worth carrying forward:** the 6-base + 4-expansion shape (matches D-380's "honest scope per category" working principle — 80/20 cut at 6 messages), the sequential workflow framing (booking → reminder → branching outcomes), the two-way reply primitives (`C`/`R`/`YES`), the vertical-aware `{service_type}` token, the "we missed you today" no-show language. Worth discarding: the explicit `default_enabled` flagging in PRD_02 (replaced by the message-set being the configurator's whole surface), the post-visit promotional/birthday/re-engagement expansions (D-333 says marketing is always a separate campaign — these belong in a marketing-shaped surface, not appointments).

---

### 3. Orders

**Prior thinking.** Orders is the second-deepest category in prior work — PRD_02 §4 specifies 7 base + 3 expansion messages (the most base messages of any category). The "your Acme order has shipped" pattern is the canonical example for ecommerce in `PROTOTYPE_PROPOSAL.md` §3 "Personalization Persistence" — typing app name on Verification and switching to Orders pre-populates the example. `RELAYKIT_PRODUCT_VISION.md` §0 names DELIVERY_NOTIFICATIONS as the TCR mapping. `/src` ecommerce vertical module exists at 33 lines.

**Sub-uses considered:**
- Order confirmation (`orders_confirmation`) — base, default-enabled
- Shipping notification (`orders_shipped`) — base, default-enabled
- Out-for-delivery (`orders_out_for_delivery`) — base
- Delivery confirmation (`orders_delivered`) — base, default-enabled
- Delay notification (`orders_delay_notice`) — base
- Return confirmation (`orders_return_confirmation`) — base
- Ready-for-pickup (`orders_pickup_ready`) — base
- Reorder reminder (`orders_reorder_reminder`) — expansion, marketing
- Flash sale (`orders_flash_sale`) — expansion, marketing
- Review request (`orders_review_request`) — expansion, mixed
- `/src/lib/intake/use-case-data.ts` adds: promotional offers to past customers, announcing new products, reviews after delivery as expansion options

**Workflows / triggers.** Same sequential lifecycle shape as Appointments, slightly longer chain: placed → confirmed → shipped → out-for-delivery → delivered → (return / delay branches) → (post-delivery review / reorder / promotional branches). All triggered by order-state changes in the developer's order system.

**Message drafts.** PRD_02 §4 verbatim — representative samples:
- `"{business_name}: Your order #{order_id} has been confirmed! We'll notify you when it ships. Reply STOP to opt out of notifications."`
- `"{business_name}: Great news — your order #{order_id} has shipped! Track it here: {tracking_url}. Reply STOP to unsubscribe."`
- `"{business_name}: Your order #{order_id} is out for delivery today. Keep an eye out! Reply STOP to opt out."`
- `"{business_name}: Update on order #{order_id} — there's a slight delay. New estimated delivery: {date}. We apologize for the wait. Reply STOP to opt out."`
- `"{business_name}: We received your return for order #{order_id}. Your refund will be processed within 5-7 business days. Reply STOP to unsubscribe."`
- `"{business_name}: Your order #{order_id} is ready for pickup! Visit us at {address} during business hours. Reply STOP to opt out."`

**Variable model.** `{business_name}`, `{order_id}` (uniformly with `#` prefix in display), `{tracking_url}`, `{date}` (for delay), `{address}` (for pickup). Note: `{product_type}` from PRD_02 §2 ("e.g., handmade jewelry") is the personalization-step field that conceptually parallels `{service_type}` for appointments. `{product_type}` appears in expansion templates (reorder reminder, flash sale), but **not in the base lifecycle messages** — those reference `order_id` as the per-event identifier and don't need product semantics. This is correct prior thinking that should survive.

**TCR mapping.** `DELIVERY_NOTIFICATIONS` campaign type.

**Carry-forward.** Orders' sub-use enumeration is solid prior art. The expansion lineup (reorder / flash sale / review request) is marketing-shaped and should follow D-333 (always a separate campaign). The base-message set survives substantially intact. The `{order_id}` `#`-prefix convention is a real linguistic pattern worth keeping — it visually separates the numeric identifier from surrounding prose and parallels how customers see order IDs in their own systems.

**Worth carrying forward:** the 7-base set (or a 5–6 80/20 subset per the v1.7 principle), `{order_id}` `#`-prefix, separation of pickup-vs-shipped lifecycle branches, the delay-notice language template (`"Update on order #{order_id} — there's a slight delay. New estimated delivery: {date}."` — useful linguistic shape for "things changed" status updates). Worth discarding: the marketing-shaped expansions (separate campaign), the conflation of "your Acme order" template with the personalization field name (`{product_type}` is conceptually overloaded between "what your business sells" and "what's in this specific order" — see Cross-cutting Patterns).

---

### 4. Support

**Prior thinking.** Customer Support is the most two-way-shaped category — every prior PRD treats it as conversational rather than scheduled or event-driven. PRD_02 §9 maps support → `CUSTOMER_CARE` (same as appointments). 6 base + 3 expansion messages. PRD_07 §5 ("Customer support") and PRD_06 §3 use `MessageChatCircle` icon (acknowledging the two-way primitive). `RELAYKIT_PRD_CONSOLIDATED.md` §"Customer Support" enumerates: "Ticket acknowledgment, status update, resolution confirmation, satisfaction follow-up, escalation notice, information request."

**Sub-uses considered:**
- Ticket acknowledgment (`support_acknowledgment`) — base, default-enabled
- Issue resolved (`support_resolution`) — base, default-enabled
- Response ETA (`support_eta`) — base, default-enabled
- Follow-up check-in (`support_followup`) — base
- Escalation notice (`support_escalation`) — base
- Information requested (`support_info_needed`) — base
- Satisfaction survey (`support_satisfaction_survey`) — expansion, mixed
- New feature tip (`support_new_feature_tip`) — expansion, marketing
- Maintenance notice (`support_maintenance_notice`) — expansion, mixed
- `/src/lib/intake/use-case-data.ts` adds: proactive outreach (e.g., known issue alerts), satisfaction surveys, promotional offers to support contacts as expansions

**Workflows / triggers.** Inbound-driven, not scheduled. Triggers: "When support request received" / "When ticket is closed" / "When request is queued" / "Days after resolution" / "When ticket is escalated" / "When agent needs more info". Note the explicit "Two-way support conversations don't require opt-out language in every reply. First message in a new conversation should include it." (PRD_05 §7).

**Message drafts.** Representative samples from PRD_02 §4:
- `"{business_name}: Thanks for reaching out! A support agent will respond shortly. Your ticket: #{ticket_id}. Reply STOP to opt out of messages."`
- `"{business_name} Support: Your issue (#{ticket_id}) has been resolved. Let us know if you need anything else. Reply STOP to unsubscribe."`
- `"{business_name}: We received your message and are looking into it. Expected response time: {eta}. Reply STOP to opt out."`
- `"{business_name}: Checking in — is your issue (#{ticket_id}) fully resolved? Reply YES if all good, or describe what's still wrong. Reply STOP to opt out."`
- `"{business_name}: We need a bit more info to resolve your issue (#{ticket_id}). Please reply with the details or call us at {contact_phone}. Reply STOP to opt out."`

**Variable model.** `{business_name}` (sometimes "`{business_name} Support`" as sender prefix — interesting pattern: prepending a role qualifier to the sender name), `{ticket_id}` (with `#` prefix, matching `{order_id}`), `{eta}`, `{contact_phone}`. Two-way reply primitives: `YES` (resolved), free-text replies for ongoing conversation.

**TCR mapping.** `CUSTOMER_CARE` campaign type.

**Carry-forward.** Support is the right category to test PROTOTYPE_PROPOSAL §3 "Live Consent Form Preview" and the compliance-checklist mechanism — because two-way replies expose the most edge cases (opt-out only on first message, free-text replies routed back to ticket system). Sub-uses survive. The `{business_name} Support` sender-prefix pattern is worth preserving — it cleanly communicates "this is the support thread, not marketing".

**Worth carrying forward:** the 6-base set (likely cut to 4–5 per the 80/20 principle), the sender-prefix convention (`{business_name} Support:`), the `{ticket_id}` `#`-prefix matching `{order_id}`, the explicit ETA language ("Expected response time: {eta}"). Worth discarding: the satisfaction-survey expansion (D-333 — marketing-shaped, separate campaign), the feature-tip expansion.

**Worth flagging:** Support's prior CTA was "Support ticket" — i.e., it assumes the customer's app has a ticketing system. For RelayKit's indie SaaS audience (MARKETING_STRATEGY MD-9 + MASTER_PLAN v1.5/v1.6 launch positioning), most customers don't yet have one. Phase 2a should consider whether Support is even the right category for indie SaaS launch, or whether it's a deferred category per the "tamp complexity, feel flexible, honest scope" principle (D-381 + v1.7 sixth working principle).

---

### 5. Marketing

**Prior thinking.** Marketing has the most-developed prior thinking on **product seam** rather than sub-uses — i.e., where marketing fits relative to transactional registration, not what marketing messages look like. PRD_02 §9 maps marketing → `MARKETING` campaign type. PRD_07 §4 ("MONTHLY — $19/month" + "What you get") and PRD_05 §7 reference marketing as the separate-campaign affordance. D-15 ("Campaign registration static after approval — expansion = second campaign") is superseded by D-294 (marketing auto-submits at registration if used in sandbox or on-demand). D-89 establishes marketing as always-separate. D-37 establishes marketing as "second campaign" never "upgrade". The V4 mixed-campaign addendum is the deepest prior treatment of marketing's relationship to other categories. 6 base + 3 expansion messages.

**Sub-uses considered (PRD_02 §4):**
- Weekly promotion (`marketing_weekly_promo`) — base, default-enabled
- New arrivals (`marketing_new_arrivals`) — base, default-enabled
- Loyalty reward (`marketing_loyalty_reward`) — base, default-enabled
- Seasonal sale (`marketing_seasonal_sale`) — base
- Back in stock (`marketing_back_in_stock`) — base
- Abandoned cart (`marketing_abandoned_cart`) — base
- Referral program (`marketing_referral`) — expansion
- VIP early access (`marketing_vip_early_access`) — expansion
- Event invitation (`marketing_event_invite`) — expansion (mixed)

**Workflows / triggers.** Mix of scheduled and event-driven. Scheduled: weekly promo (cadence), seasonal sale (calendar). Event-driven: new arrivals (product launch), loyalty reward (program trigger), back in stock (inventory event), abandoned cart (cart-abandonment timer), birthday (CRM trigger). The TCR campaign-description language (PRD_02 §3 marketing) calls out frequency as "approximately 2-4 messages per month" (`USE_CASE_FREQUENCIES['marketing']` in PRD_02 §10).

**Message drafts.** Representative samples:
- `"{business_name}: This week only — 20% off your next order with code SAVE20. Shop now at {website_url}. Reply STOP to unsubscribe."`
- `"{business_name}: New arrivals just dropped! Check out what's new: {website_url}/new. Msg & data rates may apply. Reply STOP to opt out."`
- `"{business_name}: Thanks for being a loyal customer! Enjoy free shipping on your next order. Use code FREESHIP at {website_url}. Reply STOP to unsubscribe."`
- `"{business_name}: Good news — the item you wanted is back in stock! Grab it before it's gone: {website_url}. Reply STOP to unsubscribe."`
- `"{business_name}: You left something in your cart! Complete your order at {website_url}/cart. Reply STOP to opt out."`

**Variable model.** `{business_name}`, `{website_url}` (deep-linked: `/new`, `/cart`, `/sale`, `/vip` — the `/segment` suffix is a real linguistic convention worth preserving), inline promo codes (e.g., `SAVE20`, `FREESHIP` — currently hardcoded string literals, not parameterized; this is a real prior-thinking limitation).

**TCR mapping.** `MARKETING` campaign type. Recipients require explicit marketing opt-in per V4 mixed addendum §A1 + D-89.

**Carry-forward.** Marketing's sub-use enumeration is largely usable but is heavily ecommerce-shaped. For indie SaaS launch positioning (MASTER_PLAN v1.5 — "indie SaaS founders specifically"), the relevant marketing sub-uses are different: subscription-change announcements, feature launches, paid-tier promotions, end-of-trial reminders, founder-direct re-engagement — not "back in stock" or "abandoned cart". **This is a real prior-thinking gap that Phase 2a needs to fill.**

**Worth carrying forward:** marketing-as-separate-campaign framing (every prior PRD agrees), the `{website_url}/segment` deep-link convention, the `Msg & data rates may apply` disclosure language on first-touch messages, "Reply STOP to unsubscribe" vs "Reply STOP to opt out" (interchangeable — both appear in PRD_02 with no policy distinction). Worth discarding: the ecommerce-flavored sub-uses (weekly promo / back in stock / abandoned cart) — they're audience-pack-mismatched; the hardcoded promo-code literals (`SAVE20`, `FREESHIP`) — should be a parameterized `{promo_code}` variable.

**Worth flagging:** D-372 + MD-9 (indie SaaS positioning) reframes how marketing should be presented in the home configurator. The configurator's marketing surface should preview the **kind of marketing an indie SaaS founder sends** — feature launches, subscription updates, founder-direct outreach — not the kind a retail brand sends. This is a substantial Phase 2a authoring task with no prior-art shortcut.

---

### 6. Team alerts (Internal)

**Prior thinking.** The SDK namespace is `internal` (D-273), but the customer-facing label everywhere is "Team alerts" or "Team & internal alerts" (PRD_07 §5, PRD_06 §3, `/src/lib/intake/use-case-data.ts`). PRD_02 §9 maps internal → `LOW_VOLUME` TCR (smallest expected volume). 6 base + 3 expansion messages.

**Sub-uses considered:**
- Meeting reminder (`internal_meeting_reminder`) — base, default-enabled
- Schedule change (`internal_schedule_change`) — base, default-enabled
- System maintenance notice (`internal_system_maintenance`) — base, default-enabled
- Incident alert (`internal_incident_alert`) — base
- Policy update (`internal_policy_update`) — base
- Task assignment (`internal_task_assignment`) — base
- Team celebration (`internal_team_celebration`) — expansion (mixed)
- Training reminder (`internal_training_reminder`) — expansion (mixed)
- Company news (`internal_company_news`) — expansion (mixed)
- `/src/lib/intake/use-case-data.ts` adds: messages to contractors/freelancers, operational alerts to customers (the latter is borderline — touches "Messages to non team members" expansion)

**Workflows / triggers.** Mix of scheduled (meeting reminder day-before, shift confirmation) and event-driven (incident alert, schedule change, task assignment, policy update). The category collapses two real audiences: internal staff (shift/meeting/system-status — true internal) and operational-customer alerts (incident-style alerts to end users). The expansion option `operational_alerts_customers` makes this ambiguity explicit.

**Message drafts.** Representative samples:
- `"{business_name} Team: Reminder — staff meeting tomorrow at {time} in the main conference room. Reply STOP to opt out."`
- `"{business_name} Alert: Schedule change — your shift on {date} has been moved to {time}. Please confirm by replying OK. Reply STOP to unsubscribe."`
- `"{business_name} Ops: System maintenance scheduled for {date} {time}. Please save your work. Reply STOP to opt out."`
- `"{business_name} URGENT: System incident in progress. Status page: {website_url}/status. Updates will follow. Reply STOP to opt out."`

**Variable model.** `{business_name}` (with role-suffix variants: `{business_name} Team`, `{business_name} Alert`, `{business_name} Ops`, `{business_name} URGENT` — this is **the deepest sender-prefix-pattern thinking in the archive**; only the support category has comparable role qualifiers), `{date}`, `{time}`, `{task_description}` (free-form task body — likely too unconstrained for a stub, but real for a live system), `{website_url}` with `/status` suffix.

**TCR mapping.** `LOW_VOLUME` campaign type.

**Carry-forward.** Team alerts has the most-developed **sender-prefix linguistic pattern** in the archive (`{business_name} Team:`, `{business_name} Alert:`, `{business_name} Ops:`, `{business_name} URGENT:`). This pattern works well for any category that wants to communicate role/urgency in the first 20 characters — and is the right primitive for the home configurator's tone variants. The 6-base set is solid; cut to 4 for 80/20.

**Worth carrying forward:** the sender-prefix linguistic primitive (could parameterize as `{prefix}` = "Team" / "Alert" / "Ops" / "URGENT" or similar), the system-status deep-link (`{website_url}/status`), the "Please save your work" maintenance-notice phrasing. Worth discarding: the operational-alerts-to-customers expansion (clearly belongs in a different category per "honest scope"), the team-celebration expansion (marketing-shaped, separate campaign), the training-reminder expansion (Support-shaped or its own category).

**Worth flagging:** for indie SaaS launch positioning, "team alerts" is the wrong frame. The closest indie-SaaS-relevant use is **founder-facing app monitoring alerts** (PRD_06 §17 risk: "Indie SaaS pack namespace gap"). Phase 2a needs to decide whether Team Alerts becomes Founder-Facing Alerts at launch, or whether the existing internal-staff framing carries forward unchanged. Per MASTER_PLAN.md §18 open architectural question ("Indie SaaS pack namespace composition"), this is unresolved.

---

### 7. Community

**Prior thinking.** Community is one of the most-loosely-defined categories. PRD_02 §9 maps community → `LOW_VOLUME` TCR. 6 base + 3 expansion. The opt-in description (PRD_02 §5) and campaign description both lean on `{community_name}` rather than `{business_name}` — distinct from every other category. PROTOTYPE_PROPOSAL §2 Screen 1 modal: "Event announcements, membership notifications, community news." 

**Sub-uses considered:**
- Event notification (`community_event_notification`) — base, default-enabled
- Welcome message (`community_welcome`) — base, default-enabled
- Dues / payment reminder (`community_dues_reminder`) — base
- Event reminder (`community_event_reminder`) — base, default-enabled
- Event cancelled (`community_event_cancelled`) — base
- General announcement (`community_announcement`) — base
- Sponsor promotion (`community_sponsor_promo`) — expansion, marketing
- Merchandise announcement (`community_merchandise`) — expansion, marketing
- Community survey (`community_survey`) — expansion, mixed
- `/src/lib/intake/use-case-data.ts` adds: sponsored or partner content, payments/fees via SMS links as expansion options

**Workflows / triggers.** Event-cycle shape: announcement → reminder → (cancellation branch or event-day) → post-event (survey expansion). Plus member-lifecycle: welcome on join → dues reminder on schedule. The trigger granularity is shallower than Appointments or Orders.

**Message drafts.**
- `"{community_name}: Meetup this Saturday at {time} at {location}! RSVP by replying YES. Reply STOP to opt out of updates."`
- `"{community_name}: Welcome to the group! Events and updates will be sent to this number. Reply HELP for info or STOP to leave."` — note "STOP to leave" vs "STOP to opt out" — implicit acknowledgment that opt-out feels like membership exit, not bureaucratic unsubscribe
- `"{community_name}: Reminder — dues are due by {date}. Details at {website_url}. Reply STOP to unsubscribe."`
- `"{community_name}: Tomorrow's event has been cancelled. We'll reschedule soon — stay tuned. Reply STOP to opt out."`

**Variable model.** `{community_name}` (replaces `{business_name}`), `{time}`, `{location}`, `{date}`, `{website_url}`, `{announcement_text}` (free-form — likely too unconstrained for a stub), `{sponsor_name}` (in expansion). RSVP primitive: `YES`.

**TCR mapping.** `LOW_VOLUME` campaign type.

**Carry-forward.** Community has the most-distinct sender-name convention (`{community_name}` instead of `{business_name}`). For Phase 2a, this is a real signal: communities aren't businesses, and a configurator that lets customers configure as one type might force the other into awkward language. The "STOP to leave" microcopy is genuinely good prior thinking — it matches the membership mental model. Sub-uses largely survive.

**Worth carrying forward:** `{community_name}` variable (or generalize as `{sender_name}` with per-category mapping), "STOP to leave" microcopy for membership categories, the event-cycle workflow shape (announcement → reminder → cancel branch), the RSVP `YES` primitive. Worth discarding: the sponsor-promo expansion (marketing-shaped), the merchandise expansion (marketing-shaped), the survey expansion.

**Worth flagging:** for indie SaaS launch positioning, Community is **almost certainly out of scope** at launch. PM brief MD-9/MD-10 (indie SaaS founder audience) doesn't overlap with community-organizer audience. Phase 2a should consider whether Community is a deferred category per v1.7's sixth working principle ("defer-don't-decline what we can't ship well") — likely yes.

---

### 8. Waitlist

**Prior thinking.** Waitlist is the only category that defaults to TCR `MIXED` campaign type in PRD_02 §9 and `/src/lib/intake/campaign-type.ts` — because waitlist legitimately covers both transactional (you're confirmed) and marketing-adjacent (we have an opening — book it) traffic. V4 mixed addendum acknowledges this exception. 6 base + 4 expansion messages — the most expansion stubs of any category.

**Sub-uses considered:**
- Waitlist confirmation (`waitlist_joined`) — base, default-enabled
- Table/spot ready (`waitlist_ready`) — base, default-enabled
- Opening available (`waitlist_opening`) — base, default-enabled
- Wait time update (`waitlist_update`) — base
- Reservation confirmation (`waitlist_reservation_confirmation`) — base
- Reservation reminder (`waitlist_reservation_reminder`) — base
- Special event invite (`waitlist_special_event`) — expansion, marketing
- Happy hour / daily special (`waitlist_happy_hour`) — expansion, marketing
- Loyalty perk (`waitlist_loyalty_perk`) — expansion, marketing
- Review request (`waitlist_review_request`) — expansion, mixed
- `/src/lib/intake/use-case-data.ts` adds: promotional offers to past guests, announce availability/special events, reviews after visits as expansion options

**Workflows / triggers.** Waitlist-state-driven: joined → opening (or wait-time update) → ready → walk-in (or no-show). Plus reservation-lifecycle: made → confirmed → reminded → completed.

**Message drafts.**
- `"{business_name}: You're on the waitlist! Estimated wait: {wait_time}. We'll text when your table is ready. Reply STOP to opt out."`
- `"{business_name}: Your table is ready! Please check in at the host stand within 10 minutes. Reply STOP to unsubscribe."`
- `"{business_name}: A reservation has opened up for {date} at {time}. Reply YES to book or NO to pass. Reply STOP to opt out."`
- `"{business_name}: Quick update — your estimated wait is now {wait_time}. Thanks for your patience! Reply STOP to opt out."`
- `"{business_name}: Your reservation is confirmed for {date} at {time}. Party of {party_size}. See you then! Reply STOP to unsubscribe."`

**Variable model.** `{business_name}`, `{wait_time}` (free-form duration: "20 minutes" / "1 hour" — needs constraint), `{date}`, `{time}`, `{party_size}`, `{venue_type}` (personalization-step field: "restaurant" / "barbershop" / "clinic" — parallel to `{service_type}` for appointments). Two-way reply primitives: `YES` (book), `NO` (pass).

**TCR mapping.** `MIXED` campaign type by default (per `/src/lib/intake/campaign-type.ts`).

**Carry-forward.** Waitlist is heavily venue-shaped (restaurants, barbers). For indie SaaS launch positioning, **almost certainly out of scope** like Community. The `{wait_time}` and `{party_size}` variables are too venue-specific to abstract over to a SaaS pack.

**Worth carrying forward:** the `{venue_type}` personalization-field pattern (parallel to `{service_type}` for appointments — same vertical-aware token shape), the "Reply YES to book or NO to pass" pattern (one of the cleanest two-way primitives in the archive). Worth discarding: most sub-uses (venue-specific), all marketing-shaped expansions (separate campaign), the `MIXED` default (it's vestigial — depends on launch posture).

**Worth flagging:** Waitlist + Community both look like Phase 2a candidates for the "honest deferral" pile per v1.7 sixth working principle. The home configurator should probably either ship them with very thin content (one canonical workflow each, no expansion paths) or simply not surface them at launch.

---

### 9. Higher Education

**Prior thinking: NONE.** Higher Education does not appear as a category in any reviewed prior PRD, brief, vision doc, exploration brief, dashboard spec, intake-wizard spec, or proxy spec. It does not exist as a `UseCaseId` in `/src/lib/intake/use-case-data.ts`. No template set, no opt-in disclosure, no campaign-description draft, no TCR campaign-type mapping, no compliance-posture treatment, no vertical-detection regex. The vertical-detection module at `/src/lib/templates/verticals/detection.ts` does not include education-related keywords (though there is an `education` vertical module at `/src/lib/templates/verticals/modules/education.ts` — 28 lines — but this is a vertical *flavor* that modifies messages, not a top-level use case).

**The closest prior-art adjacency is the `/src` education vertical module.** It exists as a vertical-detection target (triggered presumably by university/college/school regex keywords in `business_description`) and modifies message language to add education-domain considerations. It is a *modifier*, not a *category* — meaning a customer in higher ed would have selected (say) appointments or community and gotten education-flavored language overlaid on top.

**Sub-uses considered: NONE in prior PRDs.**
**Workflows / triggers defined: NONE in prior PRDs.**
**Message drafts: NONE in prior PRDs.**
**Variable model: NONE in prior PRDs.**

**Carry-forward.** Nothing. Higher Education enters Phase 2a with a blank slate.

**What Phase 2a needs to author from scratch:**
- The sub-use enumeration (likely: enrollment/admissions touches, financial-aid notifications, course/schedule changes, event reminders, registrar communications, emergency/campus alerts, advising appointments, student-facing transactional confirmations — but this is informed-guess territory, not prior thinking)
- The variable model — does `{business_name}` work, or do we need `{institution_name}` (parallel to `{community_name}`)? Are there per-program tokens (`{program_name}`, `{advisor_name}`)?
- The compliance posture — Higher Ed has FERPA constraints analogous to healthcare's HIPAA constraints. The healthcare module is the closest precedent for what an education-specific "industry rules" overlay might look like.
- The TCR campaign-type mapping — most likely `CUSTOMER_CARE`, possibly `LOW_VOLUME` depending on category-level expected traffic
- Whether emergency/campus-safety alerts are in scope (they're high-stakes, regulated separately, and probably out of launch scope per v1.7's "honest deferral" principle)

**Worth flagging hard to PM:** The Phase 2a brief lists Higher Education as one of the 9 launch-posture-grid categories, but no prior thinking exists. This is the highest-effort Phase 2a authoring task and the one most likely to surface "is this category even right for the launch audience?" If indie SaaS is the launch audience pack (per MASTER_PLAN v1.5), Higher Education does not obviously match. Suggest discussing with PM before authoring whether Higher Ed is a real launch-category-grid slot, a deferred category, or a placeholder for a different intended category (e.g., "founder-facing alerts" or "student SaaS" or similar).

---

## Cross-cutting patterns

### Common workflow shapes across categories

Three workflow shapes appear repeatedly in prior thinking:

1. **Sequential lifecycle** (Appointments, Orders) — a defined chain of events with branching outcomes. Triggers are state-change driven. Each category has a "happy path" of 3–4 messages plus 2–3 branch messages (cancel / reschedule / no-show / delay). This is the most-developed prior-art shape and the cleanest to port to a configurator preview.

2. **Inbound-driven conversation** (Support, Community RSVP) — first message from the customer's app is an acknowledgment ("we received your X"); subsequent messages depend on the support agent or member's reply. Two-way reply primitives are central. Each category has 3–4 routing variants.

3. **Cross-cutting primitive** (Verification, possibly Marketing) — events triggered by user action (OTP request) or business action (marketing campaign). No internal state machine within the message stream; each message stands alone. Verification's evolution to a cross-vertical primitive (D-360) is the canonical example.

**Implication for Phase 2a:** the home configurator's category cards should surface the workflow shape, not just a list of messages. Showing "here's the appointment lifecycle: booking → reminder → outcomes" communicates the configurator's mental model better than "here are 6 message previews."

### Variable interpolation problems surfaced in prior work

Real linguistic issues the prior work named but didn't fully solve:

1. **`{business_name}` vs `{app_name}` vs `{community_name}` — sender-name token ambiguity.** PRD_02 §2 reserves `{app_name}` for verification ("the name users see when they get a code") and `{community_name}` for community ("Austin Dog Owners"), but every other category uses `{business_name}`. `/src/lib/intake/templates.ts` falls back: `i.app_name ?? i.business_name` and `i.community_name ?? i.business_name`. **Phase 2a should standardize on `{sender_name}` (or similar) with per-category mapping to avoid the configurator having to ask "which name?" The 4-editable-placeholder model (D-380) needs to decide whether to expose one sender-name slot or three.**

2. **`{service_type}` vs `{product_type}` vs `{venue_type}` — vertical-aware noun.** Three different fields capture "what does your business do?" — `service_type` for appointments, `product_type` for orders, `venue_type` for waitlist. The token reads identically in usage ("Your dental appointment", "Your handmade jewelry order", "Your restaurant table") but is collected three different ways in personalization. **The home configurator's 4 editable placeholders should probably include exactly one such field (call it `{service_or_product}` or per-category alias), with the configurator's category-card prompt asking the right specific question.**

3. **Capitalization and possessives are not yet considered.** Templates use `{service_type}` in sentence-middle positions ("Your {service_type} appointment is confirmed") but never sentence-initial. Possessive ("`{business_name}'s` new arrivals") never appears. Plural is never parameterized. **For per-category content authoring, Phase 2a should explicitly decide whether the placeholder model supports grammatical inflection or whether tokens are required to be sentence-middle nouns. The simplest answer (sentence-middle nouns only) is honest and ships; richer inflection is deferrable per v1.7.**

4. **Hardcoded literals masquerading as variables.** PRD_02 §4 marketing templates use literal promo codes (`SAVE20`, `FREESHIP`) — these are obviously meant to be parameterized but weren't. Similarly: `{tracking_url}` vs `{website_url}/tracking` (one is a token, one is a literal-suffix). **Phase 2a should commit to a clean parameterization rule.**

5. **`{{double-brace}}` vs `{single-brace}` template syntax split.** `/src/lib/intake/templates.ts` uses `{{name}}` / `{{order_id}}` syntax for review-page preview messages; `/src/lib/templates/message-templates.ts` uses `{business_name}` / `{order_id}` single-brace for the dashboard plan-builder library. Both surfaces exist on disk and were diverging before /src was sunset. **The home configurator needs to pick one. D-381 (single canonical source impl deferred) explicitly defers this resolution, but Phase 2a content authoring should be syntax-consistent from the start.**

### Tone variant treatments

Two tone-variant systems appear in prior work:

1. **EXPLORATION_BRIEF_v2.md** pills: `Standard` / `Action-first` / `Context-first` — three variants per message, all transactional, differentiated by word order and lead phrase.
2. **Current production state (per env brief and PROTOTYPE_SPEC.md):** `Standard` / `Friendly` / `Brief` — three variants per message, differentiated by tone and length.

The current system survives because it works for both customers and AI tools (the "Brief" variant maps directly to character-budget reality on SMS). **Phase 2a should standardize on Standard/Friendly/Brief.** The "Action-first" / "Context-first" split from the earlier brief is interesting linguistic thinking but didn't survive into the prototype — likely because it was harder for customers to grok than the friendliness axis.

### Compliance posture per category

PRD_02's `APPROVED_MESSAGE_TYPES` and `NOT_APPROVED_CONTENT` constants (lines 833–860, mirrored in `/src/lib/templates/message-templates.ts` lines 29–69) are the most-developed compliance-by-category artifact in the archive. Each category has:
- A one-line "what's approved" summary (used in SMS_GUIDELINES.md / now in the SDK README pattern)
- A one-line "what's not approved" summary (used in drift detection / now in the proxy pumping defense per D-374)

These survive substantially intact through the current product, and are referenced by `/src/lib/deliverable/use-case-tips.ts` (per-category compliance one-liners). **They should carry forward into Phase 2a verbatim where the category survives.** Verification's "must be user-initiated" is the strictest. Marketing's "explicit marketing consent required" is the most legally load-bearing per D-89 and the V4 mixed addendum.

The compliance posture per category was the deepest prior thinking that successfully informed real product code — and is the safest content to bring forward without re-authoring.

---

## Meta

### What stands the test of time across prior thinking

- **The 9-use-case lineup (minus Higher Ed, plus Exploring) is internally consistent across every artifact** — including the SDK namespaces (D-273) which were validated through 25 experiment rounds. The current product can't easily reframe the categories without breaking SDK contracts. Phase 2a should respect this: any home-configurator category surface that doesn't map cleanly to an existing SDK namespace creates downstream confusion.
- **Per-category TCR campaign-type mapping** (`appointments → CUSTOMER_CARE`, `orders → DELIVERY_NOTIFICATIONS`, `verification → TWO_FACTOR_AUTHENTICATION`, etc. — PRD_02 §9, `/src/lib/intake/campaign-type.ts`) is solid and survives.
- **The PRD_02 base + expansion message library** (56 base + 28 expansion across the 8+exploring categories) is the deepest content body the prior work produced. Where the current product carries the category forward, the messages can be carried forward with minor edits.
- **Per-category compliance one-liners** (APPROVED_MESSAGE_TYPES / NOT_APPROVED_CONTENT) — the cleanest reusable artifact in the archive.
- **The "marketing is always a separate campaign" principle** (D-89 + V4 mixed addendum + D-333 + D-294) — every prior PRD agrees, every revision reinforces, and the current product enforces it at the campaign-type level. Not negotiable for Phase 2a.
- **Vertical detection as a modifier-on-category, not a category-of-its-own** (`/src/lib/templates/verticals/`) — 17 vertical modules + regex detection. Per D-358 this surface is sunset along with the rest of `/src`, but the *idea* (vertical-specific overlays on top of category-level templates) is real prior thinking that Phase 2a should consider for Higher Ed's FERPA-style overlay specifically.
- **The "before building, ask me" / clarifying-questions pattern** (RELAYKIT_PRODUCT_VISION §2) survives in the current SDK integration prompt model (D-331 / D-300) — the configurator should mirror this for the home-configurator UX.
- **The Standard/Friendly/Brief tone-variant axis** (current PROTOTYPE_SPEC) survives all evolutions.

### What was tried and explicitly rejected

- **AI-generated message templates** — PRD_02 §1 explicit ("The engine is a deterministic template system, not AI-generated. Every variable is filled from intake data."). PROTOTYPE_PROPOSAL §4 explicitly rejects "AI-powered compliance recommendations" in favor of deterministic checklists. Reasoning: compliance product, consistency matters more than creativity. **Reaffirmed by D-04 and D-381.**
- **Plan builder with message-selection toggles** — `RELAYKIT_PRODUCT_VISION.md` §3 "The Full-Library Principle" explicitly rejects "There is no plan builder. There is no message curation step. There is no 'enable this message' toggle." Yet PRD_06 §4 spec'd a plan builder anyway, and the prototype built it. The vision-doc framing won eventually (per D-85, D-86): no plan builder, full library always available. **Phase 2a should not reintroduce a selection toggle for home-configurator messages.**
- **Sticky bottom-bar CTA** — PROTOTYPE_PROPOSAL §4 explicitly rejected ("skeezy pattern").
- **Pre-populated sample data ("Business XYZ")** — PROTOTYPE_PROPOSAL §4 explicitly rejected ("Creates 'clear and overwrite' friction instead of 'type your thing'"). **Reinforces D-380's "4 editable placeholder fields" requirement — empty placeholders, not pre-fills.**
- **Chatbot for profile creation** — PROTOTYPE_PROPOSAL §4 explicitly rejected ("Too much engineering for what a few well-designed fields accomplish; developers are skeptical of chatbots").
- **Compliance tab pre-registration** — PROTOTYPE_PROPOSAL §4 explicitly rejected ("Creates anxiety or feels like empty furniture").
- **Build Spec / SMS_BUILD_SPEC.md as a download artifact** — D-358 sunsets `/src`, and the SDK delivery model (D-266) replaces the build-spec deliverable concept entirely. PRD_05's three-document lifecycle (SMS_BUILD_SPEC + SMS_GUIDELINES sandbox + production) is fully superseded by the SDK + AGENTS.md + per-builder-guides model (D-272–D-278, MASTER_PLAN §12).
- **17 vertical modules approach** — `/src/lib/templates/verticals/` exists but is sunset with the rest of `/src`. The architectural model (vertical modifier-on-category) is worth carrying forward; the specific module list (healthcare / fitness / legal / financial / restaurant / real-estate etc.) does not need to ship at launch. Per v1.7 sixth working principle, defer to post-launch.
- **MIXED tier registration at signup as a paid upsell** — V4 mixed addendum §A2 spec'd a $29/mo MIXED tier vs $19/mo Transactional tier (B1). This pricing structure is superseded by D-320 ($49 + $19/mo flat, no marketing-tier split) and D-321 ($8/500 overage). Mixed-campaign registration mechanics survive, but the pricing model that supported them does not.

### Gaps in prior thinking that Phase 2a research needs to fill

1. **Higher Education category — nothing exists.** Top priority. (See §9 above.) Decide if it's a real launch category, a misnamed slot, or a deferred entry.
2. **Indie SaaS audience-pack sub-use mapping.** The 9-category lineup was authored before the launch positioning narrowed to indie SaaS (MASTER_PLAN v1.5, 2026-05-03). Marketing's ecommerce-shaped sub-uses, Team Alerts' staff-shop framing, Community's organizer framing, and Waitlist's restaurant framing all need re-evaluation against an indie SaaS founder audience. MASTER_PLAN §17 ("Indie SaaS pack namespace gap") explicitly calls this out.
3. **Variable interpolation rules.** (See Cross-cutting Patterns §2.) Specifically: sender-name token consolidation, vertical-aware-noun consolidation, sentence-position constraints (middle-only?), syntax (single vs double brace), placeholder counts (D-380: 4+).
4. **Tone-variant treatment per category.** The Standard/Friendly/Brief axis works as a default but isn't per-category tuned. Verification's "Brief" variant is essentially forced by the OTP code budget; Appointments' "Friendly" variant has the most room; Community's "Standard" variant is closest to the membership-newsletter register. Phase 2a should decide whether per-category tone defaults are different.
5. **Workflow-shape representation in the home configurator.** Prior work shows category cards but never the workflow inside the category. The home configurator likely needs to communicate "this is a sequential-lifecycle category" vs "this is an inbound-driven category" vs "this is a primitive" — three different mental models.
6. **Out-of-scope-at-launch categories.** Per v1.7 sixth working principle ("tamp complexity smartly, feel flexible to users, scope honestly per category"), Phase 2a should explicitly mark which of the 9 categories ship at launch vs. defer with quality gates. Strong candidates for deferral: Community, Waitlist, possibly Support (depending on whether indie SaaS founders ship ticketing).
7. **Verification's dual role.** D-360 establishes verification as a cross-vertical primitive (sendCode/checkCode on every namespace); D-377 establishes verification as a toggleable category with a "Verification only" preset. These coexist but need a clean Phase 2a articulation: when is verification a category in the configurator surface, and when is it a feature layered into other categories?
8. **The 4+ editable placeholder fields (D-380) — which 4?** PRD_02 §2 enumerates 16 template variables. The launch posture needs to commit to 4 — likely `business_name`, `website`, `service_or_product_type` (per-category alias), and one more. The 4-field selection is not yet decided in any prior document.

---

*End of Phase B Prior-Art Digest. Phase 2a's per-category content authoring should treat this as ground truth for "what was already worked out" and the per-category sections' carry-forward verdicts as the starting position for what survives — modulo the Higher Education blank-slate flag in the headline.*
