# MESSAGE_AUTHORING_GUIDE.md

> **Purpose:** The complete, canonical procedure and rules for authoring a message-library category. Anyone — PM or CC — authoring or reviewing a category works from this document.
>
> **Belongs here:** the authoring method, message-shape rules, tone rules, the technical encoding disciplines, the compliance baseline, the flat-model data shape.
> **Does not belong here:** per-category content (lives in `audits/research/2026-05-16/[category].md`), decision rationale (DECISIONS.md), the type system itself (`marketing-site/lib/message-library/types.ts`), product voice for marketing/product surfaces (VOICE_AND_PRODUCT_PRINCIPLES_v2.md).

## 1. What a category is (post-D-408)

A category is a flat list of messages. Every `Category` carries `messages: Message[]` directly — no subs, no stages, no classification. A message is one template, expressed as three tone variants, and renders as one checkbox in the configurator.

Research files predate D-408 and still carry a `Classification:` header (discrete / workflow / hybrid). That header is now advisory background, not a structural instruction. Author every category as a flat message list regardless of what the header says.

Two `Message` fields are documentation-only — they exist in the data and render nowhere: `description` (editorial: what the message is for) and `groupNote` (sequence annotation, e.g. "Order lifecycle — step 3 of 7: ..."). They are reserved for future workspace UX. Carry text into them when a research file supplies it; never write configurator behavior that depends on them.

## 2. The governing principle: author for the user, not for RelayKit

Every rule below this one is in service of a message a real developer copies and a real recipient reads. When a mechanical concern (segment math, a budget number, an internal optimization) pulls against what the user actually needs, the user wins — unless there is a genuine, specific reason it can't.

This is not a license to ignore the constraints. It's a direction for how to resolve tension. When a token's `budgetChars` and a good message body seem to conflict, the wrong move is to inflate the budget defensively or trim the body to something stilted. The right move is to think harder: is the budget modeling the *pathological* case or the *good* case? Is there a phrasing that's both compliant and natural? Most apparent conflicts dissolve under a second, more creative pass — `estimated_delivery` budgeted for "Thursday" instead of a full timestamp is the worked example: the tighter budget came from choosing the better message shape, not from compromising it.

In the lead magnet specifically, do not over-police for RelayKit's own optimizations. The lead magnet's job is to hand a developer message text they're glad to have. A message that's a few characters less "efficient" but reads well beats a cramped one that hits an internal target. The same bias holds for the product surface — UX comes first unless there's a strong, named need to override — but it is sharpest in the lead magnet, where the message *is* the product and there is no second chance to win the developer over.

Effectively failing the user to satisfy a RelayKit-side concern is the failure mode this section exists to prevent. If a rule below ever seems to force that, that's the signal to stop and think, not to comply.

## 3. The authoring method

Each category is authored in this order:

1. **Read the research file** — `audits/research/2026-05-16/[category].md`. All §6 open questions are resolved; the file is the source for use cases, voice patterns, variables, and compliance constraints.
2. **PM alignment** — PM and Joel settle: the message set (which messages the category contains), the variable catalog (shared tokens + category-specific), and the compliance block. PM writes a plain-language alignment paragraph and waits for Joel's read before authoring bodies.
3. **PM authors the bodies** — PM writes every message body and all three tone variants. Bodies are the product; PM keeps voice control.
4. **CC writes the file and computes charCounts** — CC writes the populated `[category].ts`, computes every `charCount` against `budgetChars` (§6), and reports all variants before commit. PM reviews via `.pm-review.md`; CC pushes on approval.

PM authors; CC verifies the math and writes to disk. CC does not author message bodies — unsupervised authoring drifts voice toward marketing register and skips the encoding disciplines.

## 4. Message-shape rules

A message is a moment — one thing that happens, one text a recipient receives. Author against moments, not a target count. Ceiling is roughly 1–3 messages per discrete use; let the moments fall where they fall. Do not pad a category to match another category's count, and do not force a count down to look tidy. A category with four genuine moments has four messages; one with seven has seven.

## 5. Tone variants

Every message has exactly three variants, and they must be genuinely differentiated — not micro-tweaks of one sentence:

- **Standard** — label-led. The sender frame and a plain statement of what happened.
- **Friendly** — possessive-led. "Your [workspace] order..." — warmer, conversational.
- **Brief** — verb-dropped. The shortest form that still carries the message.

If the three variants differ only by a word or two, they are not three variants. Re-author.

## 6. The two technical disciplines

These are non-negotiable. Both have caused authoring bugs; both are now mechanical checks.

**ASCII-only bodies.** Message bodies use only basic GSM-7 ASCII characters. No em dashes, no en dashes, no smart or curly quotes, no ellipsis character. Any single non-GSM-7-basic character forces the whole message into UCS-2 encoding, which collapses the single-segment limit from 160 characters to 70. Use a straight hyphen or comma-space in place of an em dash; straight quotes only.

**charCount computed against `budgetChars`, worst-case.** A `MessageVariant.charCount` is the worst-case GSM-7 length: substitute every `{{token}}` with a placeholder string of that variable's `budgetChars` length, then count. Not the example length — the budget length. CC writes a short script to do this substitution for every variant, reports all computed charCounts before commit, and stops on any variant over 160. A variant over 160 at worst case does not ship; the body is trimmed or a token's budget is reconsidered (see §2 — reconsider the budget before cramping the body).

## 7. Compliance baseline

Every category's `compliance.rules` block states the rules that govern its messages. Some are corpus-wide and appear (adapted) in every category:

- **No credentials in the body** (D-393) — license keys, API keys, passwords never appear in a message body. Confirmations link to authenticated retrieval.
- **No promotional content** (D-399) — no offers, discount codes, upsell or cross-sell CTAs in any non-Marketing category. The trigger speaks for itself.
- **Single GSM-7 segment** (D-402) — see §6.
- **Sender frame** — every message body identifies the sender so the recipient knows who is texting. D-398 establishes `workspace_name` as the sender frame for Account events, Customer support, and Team alerts. Verification uses `business_name` — that's Verification's own rule, visible in `verification.ts`, not part of D-398. Take a category's sender-frame token from its research file and existing authored precedent; don't assume D-398 covers it.

Category-specific compliance comes from the research file's §5. STOP/HELP handling varies by category: Verification carries a 2FA carve-out (no STOP/HELP in body); transactional categories carry STOP opt-out language in the body - 'Reply STOP to opt out.' in Standard and Friendly variants, 'STOP to opt out.' in Brief (per D-412); Marketing carries STOP opt-out language in the body (STOP-only, per D-410), while HELP functions as a keyword without in-body text. Always take the category's STOP/HELP posture from its research file, never by analogy to another category.

## 8. Variables

A category's variable catalog is `workspace_name` (or `business_name`) from `shared-variables.ts`, plus category-specific tokens. Each variable carries a `budgetChars` — the worst-case realistic value length, which drives the §6 math. Type-constrained tokens (codes, numeric values the SDK passes) are exempt from the GSM-7 character rule because the type contract enforces their shape; mark them `typeConstrained: true`.

Size `budgetChars` for the *good* shape the lead magnet should model, not the pathological case. Example: `estimated_delivery` budgets for "Thursday", not a full timestamp — the lead magnet teaches the better pattern. This is the §2 principle applied to a number.
