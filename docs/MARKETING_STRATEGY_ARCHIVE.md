# Marketing Strategy Archive

> **Purpose:** Deprecated marketing approaches and tactics, with reasoning for why they were dropped. If conditions change and a parked approach becomes relevant again, this file preserves the thinking. Same archive pattern as DECISIONS_ARCHIVE.md.
>
> **Format per entry:** Approach name, what was decided, what triggered the deprecation, what would trigger a revisit.

## A-1 — Build first-party starter kit
**Decided:** Build RelayKit's own SaaS starter ("ShipFast for SMS-included apps") and ship it as our distribution surface. Pre-cooked appointments / orders / OTP integrations baked in.
**Deprecated:** April 2026.
**Trigger for deprecation:** Resend playbook research surfaced that embedding RelayKit in existing successful starters (Makerkit, Supastarter, ShipFast, KolbySisk's, Vercel's) is dramatically higher-leverage. Starter-kit market is mature, concentrated, and SMS is a genuine gap across all major starters. Building our own competes with the maintainers we'd rather partner with.
**What would trigger a revisit:** Every major starter rejects partnership AND a verticalized starter (e.g., "appointments-shaped SaaS starter") would clearly outperform horizontal alternatives. Both conditions, not either.

## A-2 — "Your AI tool builds it" as primary differentiator
**Decided:** Position RelayKit as "the SMS API your AI coding tool can integrate in 3 minutes." Lead with the AI-integration speed.
**Deprecated:** April 2026.
**Trigger for deprecation:** Honesty-pass conversation with Joel. By 2026, AI-tool integration speed is table stakes for any well-documented SDK; not a meaningful differentiator. Genuine differentiators are pre-written compliant messages and handled carrier registration.
**What would trigger a revisit:** AI coding tool integration becomes harder for some structural reason (vendor lock-in, tool fragmentation), or a competitor specifically positions against AI-tool integration as a flaw, opening counter-positioning space.

## A-3 — $199 setup fee with two-payment split ($49 / $150)
**Decided:** Registration fee structured as $49 on submission + $150 on carrier approval. Customer-initiated second payment.
**Deprecated:** April 2026.
**Trigger for deprecation:** D-320 collapsed to $49 single payment. Pricing comprehension and conversion cleaner with one payment.
**What would trigger a revisit:** Margin pressure from carrier-registration cost increases that single-payment $49 can't absorb.

## A-4 — Marketing pillar wording: "OTP, free forever"
**Decided:** Position OTP as a free-forever feature to bypass Stytch / Clerk / Auth0 comparison.
**Deprecated:** April–May 2026.
**Trigger for deprecation:** Pricing math made true-free OTP economically unsustainable for a bootstrapped product (per pricing strategy chat, April 30). Marketing pillar resolved as "Verification included" — feature is included, messages are billed normally.
**What would trigger a revisit:** Funded competitor positions on free-OTP and we need defensive counter-positioning, OR our delivery costs collapse enough to absorb a generous free tier.

End of file.
