# RelayKit vertical taxonomy

> **Status: DRAFT — v0.1.** This document captures the vertical taxonomy thinking surfaced by Experiments 3a/3b (Sinch's TCR use-case dashboard). It is a working draft awaiting Phase 5 design resolution on the three directional pieces flagged in §4. The settled calls in §3 are firm; the directional pieces in §4 are explicitly unresolved. Iterate based on Phase 5 design resolutions before treating as canonical.
>
> **Phase 5 prerequisite gate.** Any Phase 5 work item touching customer registration form design, intake question design, vertical surface in onboarding, message template authorship for new/changed verticals, or registration backend logic — read this draft first as a prerequisite, not as a reference. The doors UX and the per-vertical TCR mapping decisions live here until promoted to a D-number or to PROTOTYPE_SPEC.

---

## §1 — TCR taxonomy primer

The use-case categories visible in Sinch's 10DLC dashboard are TCR-standard (industry-wide), not Sinch-specific. Every CSP/DCA exposes the same set because TCR (The Campaign Registry) defines it. The categories split into two classes:

**Standard** (auto-approved, no vetting — fits the one-person-shop automation posture):

- 2FA
- Account Notification
- Customer Care
- Delivery Notification
- Marketing
- Higher Education
- Public Service Announcement
- Security Alert
- Mixed
- Low Volume Mixed (LVM)

**Special** (vetting required — Aegis third-party verification, Campaign Verify for political, carrier human review, documentation back-and-forth, multi-week timelines):

- Charity
- K-12
- Political Campaign
- Sweepstakes
- Polling and Voting
- Emergency
- Machine to Machine
- Proxy
- Direct Lending
- Agents and Franchises
- Social
- Fraud Alert

One orthogonal concept: **Carrier Exemptions** — not a category, a per-carrier carve-out for specific traffic patterns (charity exemptions on T-Mobile, etc.). Surfaces during registration but doesn't appear in the use-case taxonomy itself.

---

## §2 — Mapping table: RelayKit verticals → TCR categories

| RelayKit vertical | TCR category | Class | Fit | Notes |
|---|---|---|---|---|
| Appointments | Account Notification | Standard | Clean | Confirmation/reminder traffic fits AN cleanly. |
| Verification | 2FA | Standard | Clean | OTP and step-up confirmation fit 2FA cleanly. |
| Orders | Delivery Notification | Standard | Clean | Order status / shipping / delivery fit DN cleanly. |
| Support | Customer Care | Standard | Clean | Inbound + outbound support fits CC cleanly. |
| Marketing | Marketing | Standard | Clean | 1:1 by name. |
| Internal | (no Standard fit) | — | **Reframe as curated LVM** | TCR has no employee-comms category. RelayKit authors templates; surface as LVM internally. See §3 settled call. |
| Community | Social | Special | **Disposition pending** | Social is Special; "accept Special friction" is off the table per §3. Either redefine or drop. See §4 directional. |
| Waitlist | Account Notification *or* Customer Care | Standard | Best-fit pending | Waitlist join confirmation = AN; queue progression notifications = CC. May warrant per-message classification at Phase 5. |
| **Higher Education** *(new)* | Higher Education | Standard | Clean | 1:1, no vetting. Add as new vertical per §3. |

---

## §3 — Settled calls (firm)

**Special TCR categories out of scope at launch.** Vetting workflows (Aegis third-party verification, Campaign Verify for political, carrier human review, documentation back-and-forth) are incompatible with the one-person-shop automation posture and with the planned paid-lookup-plus-AI-research approval-confidence stack. Decline at intake — pattern adapted from D-18's hard-decline. Decline copy TBD per Voice & Product Principles when intake flow design activates in Phase 5. Post-launch revisit gated on observed customer pull from these segments.

**Add Higher Education vertical.** TCR Standard category, clean 1:1 fit, no vetting friction. Real ICP segment (universities, online learning programs, postsecondary institutions). Adds full message template set (verification, registration confirmation, deadline reminders, course/cohort communications), intake entry, dashboard surface, onboarding-wizard vertical option. Phase 5 implementation work — additive, no architecture change.

**Internal reframed as RelayKit-curated LVM.** TCR has no employee-comms category, and forcing Internal into Account Notification or Customer Care misrepresents the traffic. LVM is the architecturally correct home for non-canonical Standard traffic. RelayKit authors the templates (curated, not customer-defined) so the customer experience reads as a product surface, not a workaround.

**LVM reframed as deliberate product surface.** Not a small-business catch-all. LVM carries non-canonical use cases that don't fit the named Standard categories. Throughput cap (3.75 MPS / ~2K segments/day on T-Mobile) is fine for the long tail. Possibly AI-assisted at Phase 5 (see §4 directional).

---

## §4 — Directional thinking (NOT YET DECIDED — Phase 5 resolves)

**Three-doors vs two-doors at launch.** Three doors: Single (one vertical → its Standard category) / Multi (2–5 verticals → Mixed campaign) / Custom (describe use case → LVM, possibly AI-assisted). Two doors: Single + Multi only, LVM door deferred to post-launch. Three is the richer design; two is the simpler launch. Tradeoff: simplicity-and-speed vs covers-the-long-tail-from-day-one. Pending.

**AI-assisted LVM scope at launch.** Three options:
- **Conservative:** AI proposes from a compliance-vetted pattern library (RelayKit-authored examples per traffic shape).
- **Aggressive:** AI generates from scratch with a compliance scanner pre-validating output.
- **Deferred entirely:** door 3 ships without AI assist — the customer writes a plain-text use-case description, RelayKit submits as LVM with that description verbatim.

Conservative-or-deferred most likely. Pending.

**Community vertical disposition.** Currently maps to TCR Social (Special). Per §3 "no Special at launch," the "accept friction" path is off the table. Narrows to:
- **Redefine:** reshape Community to fit Customer Care semantics (community-of-practice messaging from a business — moderation alerts, event reminders for member groups). Risk: overlaps with Support's CC mapping; differentiation becomes thin.
- **Drop:** remove Community from the launch vertical list; revisit post-launch if a real customer segment surfaces.

Pending.

---

## §5 — Implementation impact (when Phase 5 resolves)

Docs and surfaces that need revision/authorship when this work activates:

- **`docs/PRODUCT_SUMMARY.md`** — vertical descriptions in §4 (vertical-to-carrier-use-case mapping internals); §14 (intake interrogates); add Higher Education throughout; revise Internal to reflect the LVM-curated framing; update Community per disposition decision.
- **Existing 8 verticals' message templates** — review for TCR-mapping accuracy. Some may need revision (Internal especially under the LVM-curated reframing).
- **Higher Education template set** — full new set: verification SMS, registration confirmation, deadline reminders, course/cohort communications. Author per VOICE_AND_PRODUCT_PRINCIPLES_v2.
- **Customer registration form** — single/multi/custom routing logic per the doors decision.
- **Intake question design** — the doors UX (whichever count is decided). Surfaces as the first vertical-selection moment in onboarding.
- **Onboarding wizard** — vertical surface; drop or redefine Community accordingly; add Higher Education option.
- **Registration backend logic** — TCR category selection per door taken; Mixed sub-use-case enumeration when Multi is chosen; LVM use-case description capture when Custom is chosen.
- **Marketing positioning** — the "we know which TCR category fits you" angle becomes a real claim. Ties to MARKETING_STRATEGY (potential MD-number after taxonomy decisions resolve, not now).

---

## §6 — Phase 5 prerequisite gates

Resolution-ordering for Phase 5 work items dependent on this draft:

1. **Customer registration form design** ← blocked on doors decision (§4)
2. **Intake question design** ← blocked on doors decision (§4) + Community disposition (§4)
3. **Vertical surface in onboarding** ← blocked on Community disposition (§4) + Higher Education addition (§3)
4. **Message template authorship for new/changed verticals** ← blocked on Internal LVM-curated reframing (§3) + Higher Education addition (§3) + Community disposition (§4)
5. **Registration backend logic** ← blocked on doors decision (§4) + AI-assist scope (§4)

The three §4 directional pieces are the unblocking critical path. Once they resolve, the §3 settled calls + §4 resolved positions promote out of this draft into D-numbers, MASTER_PLAN amendments, or PROTOTYPE_SPEC sections as appropriate, and this file graduates from `VERTICAL_TAXONOMY_DRAFT.md` to `VERTICAL_TAXONOMY.md`.
