# RelayKit — Compliance Page Design Reference
## Internal Design Brief for `/dashboard/compliance`

> This document captures the jobs-to-be-done, UX principles, content strategy, scenarios, copy, and consent architecture for the RelayKit compliance page. It is intended as a design brief — use it to inform component layout, copy, information hierarchy, and state management.

---

## 1. The One-Line Brief

A developer lands here under stress. Get them from "what's happening" to "I handled it" in under two minutes, then get out of their way.

The page has two modes: **status confirmation** (most visits — green, done, close tab) and **alert triage** (something needs attention — understand it, act on it, move on).

The message log (table of every scanned message) is a last resort, not the opening frame. Developers should be able to feel confident and close the tab without ever opening the table.

---

## 2. Jobs to Be Done

Five distinct jobs, in priority order:

**Job 1 — Triage quickly**
Developer wants to know in under five seconds whether they have a real problem. Not a table — a status. Green or not green. If green, done. If not green: what kind? Blocked messages, drift warnings, and consent violations each carry different urgency and require different responses.

**Job 2 — Know what to do**
Every alert answers three questions: what happened, why it matters, and what the developer needs to do right now. If the answer is "nothing — we handled it automatically," say that explicitly. The worst outcome: a developer who reads an alert and doesn't know whether to act.

**Job 3 — Feel covered**
Most developers hitting this page have never navigated SMS compliance. They're worried about fines, account suspensions, carrier filtering. The page communicates: RelayKit caught this before it reached the carrier. You're protected. Here's what we did and why. That reassurance is as functional as the data.

**Job 4 — Reference canon messages when debugging**
When a drift alert fires, the developer needs to compare what they sent against what they registered. Canon messages are the ground truth — visible on this tab, read-only, labeled clearly. Side-by-side comparison should be one click away.

**Job 5 — Know how RelayKit will reach them**
Some alerts require no action. Others need a developer response within days. Surface this clearly: alert type, escalation path, and how RelayKit will contact them if something escalates. No surprises. No "we emailed you three times and paused your account."

---

## 3. Information Hierarchy

Top to bottom, in order of priority:

| Layer | Content | Visibility |
|---|---|---|
| 1 | KPI stat cards — Status badge, message count, last scanned | Always visible |
| 2 | Active alerts — Inline cards with action buttons | Only when alerts exist |
| 3 | Canon messages — Read-only reference list | Always visible (Stage 6+) |
| 4 | "How compliance works" — Expandable explainer | Collapsed by default |
| 5 | Message log — Full scan history table | Behind "View full log" link |

---

## 4. KPI Dashboard (Top of Page)

Three stat cards, scannable in under five seconds. The ratio matters more than the number.

| Card 1 | Card 2 | Card 3 |
|---|---|---|
| **1,842** | **All clear** | **4 min ago** |
| Messages This Period | Status | Last Scanned |
| clean / blocked / warned | No issues detected | Monitoring is active |

**Design notes:**
- Status is the first thing the eye hits. Color-coded: green (All clear), amber (Warnings), red (Action required).
- "Last scanned" timestamp is a trust signal. Silence is more alarming than a timestamp.
- Message breakdown (clean / blocked / warned) lives as sub-copy under the count, not a separate row.
- Never show raw percentages. Ratios tell the story better.

---

## 5. Scenarios & Required UI States

The page must handle five distinct states. Design each as a first-class state, not an edge case.

| Scenario | What Happened | What Developer Does |
|---|---|---|
| A — All clear | No alerts, no blocks, no drift. Most visits. | Nothing. Confirm status and leave. |
| B — Message blocked (resolved) | A message hit a compliance rule and was blocked before reaching the carrier. | Review the flagged content, update the template, test again. |
| C — Drift warning | Messages drifting from registered use case. Not a violation yet. | Optional but recommended — tighten the template or register expansion. |
| D — Consent violation | Marketing message attempted to recipient without marketing opt-in. Blocked. | Check opt-in data pipeline. Confirm POST /v1/opt-outs is wired on all channels. |
| E — Escalation approaching | Pattern of unresolved blocks/warnings across multiple alert cycles. | Specific action required before escalation date. Timeline surfaced clearly. |

---

## 6. Alert Card Anatomy

Every alert card follows the same structure. Nothing optional.

| Element | Content |
|---|---|
| **Alert type badge** | "Content blocked", "Drift warning", "Consent violation", "Escalation notice" — never generic "Compliance alert" |
| **What happened** | Plain-language description. One sentence. No jargon. |
| **Why it matters** | Brief consequence framing. Carrier risk, TCPA exposure, account impact. One sentence. |
| **What we did** | "RelayKit blocked this before it reached the carrier." or "This is a warning — no action required yet." Say it explicitly. |
| **What they do** | Specific next action. If nothing: say nothing. If code change needed: say what to change. |
| **Action buttons** | Primary: "Mark resolved" or "View details". Secondary: "Dismiss" (only for warnings, not blocks). |
| **Timestamp** | When the event occurred. Relative ("3 hours ago") with tooltip showing absolute time. |

---

## 7. Copy — Exact Strings

These strings are approved and should be used verbatim in implementation. Tone: knowledgeable colleague who caught something and handled it, now briefing you.

**All-clear state:**
> Everything looks good. Your messages are within your registered use case and no compliance issues were detected this period.

**Message blocked (handled automatically):**
> This message was blocked before it reached the carrier. No delivery, no carrier penalty. We caught it in the compliance layer — here's why it triggered.

**Drift warning:**
> Some of your messages are drifting from your registered use case. This isn't a violation yet, but it's worth a look — carrier filtering risk increases as drift accumulates. Here's what we're seeing.

**Escalation notice:**
> We've flagged this pattern a few times now. If it's not resolved by [date], we'll pause this specific message type to protect your account. Here's what needs to change.

**Consent violation:**
> A message was sent to a recipient without a recorded marketing opt-in. We blocked it — TCPA requires consent before marketing messages, and this one didn't have it. Check your opt-in pipeline to make sure you're capturing and passing consent correctly.

**Reassurance anchor (used across multiple components):**
> RelayKit's compliance layer runs on every message before it reaches Twilio. If we blocked something, the carrier never saw it.

**Copy rule:** Never use "failed," "error," "violation" (in alert headlines), "our team is reviewing." Always include: what specifically triggered, what was prevented, what to do next.

---

## 8. Alert Styling by Type

| Alert Type | Background | Border/Badge | Urgency |
|---|---|---|---|
| Consent violation | Red / destructive | Red badge | Highest — action required |
| Message blocked | Red / destructive | Red badge | High — review needed |
| Drift warning | Amber | Amber badge | Medium — recommended action |
| Escalation notice | Amber | Amber badge, escalation date | High — deadline visible |
| Info / all-clear | Green | Green badge | None — confirm and leave |

> **Rule:** In-dashboard banners for action-required items only. Warnings stay in the Compliance tab. The Overview tab stays clean.

---

## 9. How We Reach Them — Email Strategy

**Blocks — immediate email**
Sent on first block event or when blocks exceed threshold.
Subject: "A message was blocked — here's what happened"
Body: what triggered it, that it was caught before the carrier saw it, what to do. Ends with dashboard link, not a support ticket.

**Drift warnings — daily digest**
Not per-message. Batched.
Subject: "SMS compliance summary — [business name]"
Non-urgent. Links to dashboard for detail.

**Escalation warning — targeted**
After 2–3 unresolved alert cycles.
Subject: "Action needed — compliance issue unresolved"
Tone: direct and calm. "We've flagged this several times. Here's the escalation timeline so you're not caught off guard."

---

## 10. Consent Architecture — What RelayKit Knows vs. Doesn't

Critical for setting correct developer expectations on the page and in error states.

### What RelayKit enforces

**Marketing consent (MIXED tier)**
Per-recipient records in `recipient_consents` table. Proxy blocks marketing messages to any recipient with no consent record. Developer must call `POST /v1/consents` when a recipient opts in.

**Opt-out enforcement (all tiers)**
STOP keywords intercepted automatically. Written to `sms_opt_outs`. Checked before every outbound message. Developer calls `POST /v1/opt-outs` for non-SMS opt-outs (email, web form, phone).

### What RelayKit trusts the developer on

**Transactional consent (all tiers)**
The developer's registration describes how they collect consent (e.g., "checkbox at checkout"). TCR reviewed and approved that description. RelayKit has no visibility into whether individual recipients completed that flow.

This is a known gap in the 10DLC system generally — enforced through audit and complaint escalation, not technical controls. RelayKit's protection: accurate opt-in descriptions, a real compliance site as consent artifact, and automatic STOP enforcement.

### Optional audit trail

`POST /v1/consents` with `consent_type: "transactional"` is available but not enforced. Developers who want a per-recipient audit log (e.g., healthcare-adjacent businesses) can call it. The `recipient_consents` table already supports both values. Surface this in the "How compliance works" expandable.

---

## 11. Guardrails That Power This Page

What's actually running under the hood — useful for component copy and the expandable explainer.

| Layer | What It Does | Timing |
|---|---|---|
| Inline proxy enforcement | Opt-out check, SHAFT-C keywords, quiet hours, empty message, URL blocklist, marketing consent (MIXED). Violations blocked before Twilio sees the message. | Synchronous — every message |
| Async drift detection | Semantic comparison of outbound messages against registered canon. Catches gradual drift that rule-based scanning misses. Runs on sampled traffic via Claude API. | After delivery — sampled |
| Escalation automation | If patterns aren't addressed over multiple alert cycles, delivery pauses for the affected template — not the full account. | After 2–3 unresolved cycles |
| Canon message reference | Locked at registration. Surfaced read-only on this tab. Baseline for every drift comparison. | Permanent reference |

---

## 12. What Developers Actually Do on This Page

Full action inventory — nothing else should require a compliance tab visit.

1. Read the status card (5 seconds)
2. Open an alert to understand what happened (30–60 seconds)
3. Compare flagged message against canon side-by-side
4. Click a suggested fix link (if code change needed) or dismiss the alert (if already resolved)
5. Check canon messages for reference when debugging a template in their editor
6. Read the "How compliance works" expandable once, never again

> **Design principle:** The message log is forensic, not routine. It belongs at the bottom of the page or behind a "View full log" link that most developers will never click. Don't let it dominate the layout.

---

*RelayKit — Compliance Page Design Reference — Internal*
