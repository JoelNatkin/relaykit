# DECISIONS Audit — 2026-04-24
**Snapshot:** D-01 through D-362. Audit against MASTER_PLAN v1.1 and VOICE_AND_PRODUCT_PRINCIPLES_v2.0.

> **What this is:** A read-only findings report. No DECISIONS edits, no D-numbers added or removed, no rewrites. Resolutions are proposed for PM + Joel triage; nothing is executed by this audit.
>
> **Pre-condition note:** Many older decisions carry index-only supersession marks (in the DECISIONS.md "Archived Decision Index" summary table) but lack inline `⚠ Superseded by` annotations on the decision text itself. This audit treats the inline annotation as the load-bearing one — index summaries are convenience, the decision text is canonical. Where a decision is marked in the index but not inline, it appears in §B.

## Summary counts
- A. Direct contradictions: 1
- B. Superseded without notice: 8
- C. Orphaned (feature/codebase/approach no longer in scope): 5 grouped findings covering ~17 D-numbers
- D. Voice violations (per v2.0 kill list): 2
- E. Ambiguity (wording unclear, two defensible implementations): 2
- Appendix: 4 micro-inconsistencies / informational notes

## A. Direct contradictions

Active decisions that make opposite claims about the same subject and where neither is annotated as superseded by the other.

### A-1 — Marketing campaign activation flow
- **D-numbers:** D-89, D-294
- **Conflict:** D-89: "Marketing is always a separate campaign — never MIXED on initial registration." D-294 (per the DECISIONS.md index summary): "marketing auto-submits at registration (if used in sandbox) or on-demand." D-89 carries an inline `⚠ Superseded by D-294` annotation, BUT D-89 also says "Strengthens D-15 and D-37" in its body — D-15 and D-37 still describe the legacy "second campaign / expansion / never upgrade" flow without their own supersession notes. A reader following the D-89 → D-15 → D-37 chain sees a contradicted picture against D-294.
- **Proposed resolution:** Flag for PM. The cluster (D-15, D-37, D-89, D-294) needs a single coherent annotation pass — the index notes are insufficient because they don't propagate to the text.

## B. Superseded without notice

Older decisions whose approach a newer decision replaced, but the inline `⚠ Superseded by D-###` annotation on the older entry is missing.

### B-1 — Pricing chain: D-193, D-196, D-216, D-314 → D-320
- **D-numbers:** D-193, D-196, D-216, D-314 (older); D-320 (newer)
- **Issue:** D-320 explicitly says "Supersedes D-314 ($99 flat fee) and the original D-193/D-216 ($49 submission + $150 go-live split)." None of D-193, D-196, D-216, D-314 carry an inline `⚠ Superseded by D-320` note on the decision text itself. D-216 still prescribes a specific user-facing copy pattern ("$199 to register + $19/mo … $49/$150 split"); D-196 still says "Beta pricing: $49 flat, no second payment" (which is now identical to baseline pricing per D-320, not a beta benefit).
- **Proposed resolution:** Add inline supersession notes pointing each older entry → D-320.

### B-2 — D-105 carries stale $199 figure post-D-320
- **D-numbers:** D-105, D-320
- **Issue:** D-105 (Registration money-back guarantee): "they receive a full refund of the $199 setup fee." Active. D-320 made the fee $49. D-105's INTENT (full refund if rejected) survives, but the dollar amount is now wrong.
- **Proposed resolution:** Add inline note on D-105 pointing to D-320 for current fee figure (intent preserved, amount stale). Voice issue with same decision is filed separately under §D.

### B-3 — D-16 MIXED-from-day-one supersession is index-only
- **D-numbers:** D-16, D-89
- **Issue:** D-16 in archive: "MIXED tier registered from day one." D-89 explicitly says "Supersedes D-16." D-16 inline body lacks the `⚠ Superseded by D-89` annotation — the supersession appears only in the DECISIONS.md index summary line. (Note: D-89 itself is now superseded by D-294, but the D-16 → D-89 hop should be inline-annotated regardless.)
- **Proposed resolution:** Add inline supersession note on D-16 pointing to D-89 (and downstream chain to D-294 if PM prefers).

### B-4 — D-17 carrier-review timing supersession is index-only
- **D-numbers:** D-17, D-215
- **Issue:** D-17 in archive: "Campaign review timing is 2–3 weeks. … Never write '5–7 days'." D-215 confirms Sinch ("approval timeline drops to days"). D-17 inline body has no supersession annotation; index notes it.
- **Proposed resolution:** Add inline supersession note on D-17 pointing to D-215.

### B-5 — D-19 reframing by D-293 is missing inline note
- **D-numbers:** D-19, D-293
- **Issue:** D-19 in archive: "Compliance monitoring is non-optional for all customers" (send-time enforcement framing). D-293 explicitly says "Reframes D-19 (compliance checking is non-optional at authoring time, not send time)." D-19 inline body lacks the reframe annotation.
- **Proposed resolution:** Add inline `⚠ Reframed by D-293` note on D-19.

### B-6 — D-37 expansion-copy supersession is index-only
- **D-numbers:** D-37, D-294
- **Issue:** D-37 in archive: "Expansion options are 'second campaign,' never 'upgrade'." D-294 (per index) auto-submits marketing at registration when used in sandbox, eliminating the post-registration "expansion" UX entirely. D-37 inline body has no supersession annotation; index notes it.
- **Proposed resolution:** Add inline supersession note on D-37 pointing to D-294.

### B-7 — D-42 TCR sample-count supersession is index-only
- **D-numbers:** D-42, D-90
- **Issue:** D-42 in archive: "generateArtifacts() selects exactly 3 messages for TCR." D-90 changes to 5 with explicit "Supersedes D-42" language. D-42 inline body lacks the annotation; index notes it.
- **Proposed resolution:** Add inline supersession note on D-42 pointing to D-90.

### B-8 — Runtime-enforcement dashboard cluster orphaned by D-293 without inline notes
- **D-numbers:** D-237, D-243, D-244 (older cluster); D-293 (newer)
- **Issue:** D-293: "The three-tier runtime enforcement system (D-242) — silent rewrite, escalated notification, suspended — is removed. … Dashboard compliance attention cards … are removed." D-293 inline-annotates D-242 but not D-237, D-243, or D-244 — all three describe the now-removed runtime-enforcement UI/dashboard work and lack any supersession marker on their text. (D-244 also notes "supersedes D-233," which is fine on D-244's side; the issue is D-244 itself is now orphaned by D-293.)
- **Proposed resolution:** Add inline `⚠ Superseded by D-293` notes on D-237, D-243, D-244.

## C. Orphaned

Decisions about features, codebases, or approaches no longer in scope per MASTER_PLAN §16 or per architectural pivots that postdated them. Grouped by orphan reason.

### C-1 — Twilio-era /src codebase decisions retired by D-358
- **D-numbers:** D-02, D-26, D-199, D-232
- **Brief quotes:** D-02: "All Twilio API calls use `fetch()` against the Twilio REST API directly." D-26: "BYO Twilio is Model 2." D-199: "Sinch carrier layer evaluation (PENDING — do not build)." D-232: "Twilio-only registration service rejected."
- **Orphan reason:** All four belong to the Twilio era. D-358 sunsets `/src`; the carrier is Sinch (D-215). MASTER_PLAN §16 explicitly out-of-scopes "BYO Twilio / Sinch — Launch is managed-only" — D-26 is doubly orphaned (Twilio AND BYO).
- **Proposed resolution:** Add orphan note on each pointing to D-358 (and D-26 to MASTER_PLAN §16). D-199 is also satisfied by D-215 ("evaluation" → "confirmed"); could merge those notes. No rewrite — historical record preserved.

### C-2 — Three-document / spec-file delivery model superseded by SDK (D-266/D-279)
- **D-numbers:** D-257, D-258, D-259, D-260, D-261, D-286
- **Brief quotes:** D-257: "Do not reference 'two files' in marketing or public-facing copy." D-258: "Thin spec file in repo, intelligence behind the wall." D-259: "Living service architecture" (spec-file pointer). D-260: "Build spec is the highest-priority production deliverable." D-261: "Build spec testing does not require carrier integration." D-286: "Template lookup: static JSON registry for sandbox, Supabase for production" (extracted from `/src` template engine).
- **Orphan reason:** D-266 establishes the SDK (`npm install relaykit`) as the production delivery form factor. D-279 establishes the website as the authoring surface. The "spec file in repo" / "two files" / "build spec deliverable" model is gone. D-40 and D-41 already carry inline `⚠ Updated by D-266, D-279` annotations as precedent — these six should follow. D-286 is partially orphaned: the static-JSON sandbox path may still be live in `/api`; PM call.
- **Proposed resolution:** Add orphan/supersession notes pointing to D-266 + D-279. D-286 specifically: flag for PM — does the JSON registry still exist in `/api` as architected, or is everything Supabase now?

### C-3 — Custom-message UI cluster orphaned by D-280 (website authoring)
- **D-numbers:** D-64, D-72, D-79
- **Brief quotes:** D-64: "Custom messages via Add message card." D-72: "+ Add message card … editable title and trigger fields … Implements D-64." D-79: "Message composer/editor cut entirely."
- **Orphan reason:** D-64 / D-72 added an in-app composer/editor; D-79 cut it; D-280 then established website-side authoring as the canonical custom-message flow. None of the three carries an inline supersession annotation. D-72 is also a near-duplicate restatement of D-64 (see Appendix).
- **Proposed resolution:** Add orphan notes on D-64, D-72, D-79 pointing to D-280. Treat D-72 as duplicate-of-D-64 in Appendix (both are now orphaned anyway).

### C-4 — Marketing-page download flow concept superseded by SDK delivery
- **D-numbers:** D-162
- **Brief quote:** "Initial download happens on Messages page, not Overview."
- **Orphan reason:** D-162 already carries an inline `⚠ Updated by D-279` annotation. Strictly this is not a missing-note finding — it's noted here as an orphan flag because the underlying "download" framing is dead (it's `npm install` now). Captured for PM awareness; no action.
- **Proposed resolution:** No action — existing annotation is sufficient. Listed for cluster completeness.

### C-5 — Plan-builder UI vestiges
- **D-numbers:** D-47, D-85
- **Brief quotes:** D-47 (per index): "Messages tab read-only; plan builder on Overview only." D-85 (per index): "No plan builder — category selection is sufficient." (Note: D-85 already partially obsoleted the plan-builder concept; D-47's plan-builder UI references are vestigial.)
- **Orphan reason:** The "plan builder" UI surface no longer exists in the prototype or planned production design — it was an early authoring concept replaced by the curated library + website custom-message authoring (D-280). Decision INTENT (where authoring happens, where messages are read-only) survives in modern form.
- **Proposed resolution:** Flag for PM — confirm plan-builder UI is fully retired before annotating. If retired, add orphan notes pointing to D-280 + D-279. Low urgency.

## D. Voice violations

Decisions whose text prescribes user-facing copy that uses terms killed by VOICE_AND_PRODUCT_PRINCIPLES_v2.0 §6. Internal/code/DB-scope uses are exempt per the D-349 precedent.

### D-1 — D-105 prescribes "10DLC" in marketing-page copy
- **D-numbers:** D-105
- **Killed term:** "10DLC"
- **Context:** Marketing home page money-back guarantee copy. D-105: "If a customer's 10DLC registration is not approved, they receive a full refund of the $199 setup fee."
- **Proposed resolution:** Rewrite-eligible per v2.0 §6 Kill List ("10DLC … Don't mention it. If you must: 'carrier registration'"). Flag for PM — the decision predates v2.0; needs rewording to "registration" or "brand registration" per the kill list. (Stale pricing on the same decision is filed separately under §B-2.)

### D-2 — D-157 uses "leverage" in user-facing UI text
- **D-numbers:** D-157
- **Killed term:** "leverage"
- **Context:** Messages page user-facing AI command shortlist help text. D-157: "These commands leverage the AI tool + SMS_GUIDELINES.md as the compliance authoring and verification layer."
- **Proposed resolution:** Rewrite-eligible per v2.0 §6 Tone Killers ("Leverage" → "use"). Flag for PM — D-157 also references SMS_GUIDELINES.md as a downloadable artifact, which the SDK pivot (D-279/D-283) only partially preserves. Voice fix is independent of SDK rewording.

## E. Ambiguity

Decisions whose wording is unclear enough that a builder could reasonably implement them two different ways.

### E-1 — D-101 opt-in disclosure enumeration burden
- **D-number:** D-101
- **Ambiguous quote:** "Opt-in disclosure must enumerate implemented message types"
- **Two plausible readings:** (1) The disclosure template the SDK ships must literally list each message type the developer's app sends (e.g., "appointment reminders, cancellation notices"). (2) The SDK or website must require the developer to keep the disclosure copy in sync with their implemented message types (developer burden, possibly via tooling).
- **Proposed resolution:** Flag for PM — needs a follow-up decision specifying who owns the enumeration (SDK output vs developer maintenance) and what "enumerate" means (each message vs each category).

### E-2 — D-239 onboarding prompt timing
- **D-number:** D-239
- **Ambiguous quote:** "Prompt customer to enable SMS alerts after phone verification"
- **Two plausible readings:** (1) Synchronous step in the onboarding flow — show a modal/inline prompt immediately after phone verification completes. (2) Opportunistic — surface the prompt later in onboarding (e.g., on Overview entry), not blocking phone verification's completion.
- **Proposed resolution:** Flag for PM — needs UX-pattern specification (inline step vs deferred modal vs Overview card). May resolve naturally during workspace-only redesign work (D-332 cluster).

## Appendix: duplicates, micro-inconsistencies, informational notes

One-liners. No resolution proposals — for PM awareness.

- **D-72 is a near-duplicate of D-64** (both 2026-03-09, both "Custom messages via Add message card"). D-72 says "Implements D-64." Both are orphaned per §C-3. PM may prefer to fold D-72 into D-64 or annotate the duplication explicitly.
- **D-244 says "supersedes D-233"** but D-233's inline body should carry the reciprocal `⚠ Superseded by D-244` note (and D-244 itself is now orphaned by D-293 per §B-8 — chain is D-233 → D-244 → orphaned).
- **D-241 (per index) supersedes D-211** — confirm inline annotation on D-211 exists. (Not verified in this audit pass; spot-check during cleanup.)
- **D-358 (sunset /src)** does not list every Twilio-era decision it implicitly retires. The §C-1 cluster (D-02, D-26, D-199, D-232) is incomplete — a thorough sweep of D-01 through D-83 may surface more. PM call on whether to enumerate exhaustively.

---

## Patterns observed

Three clusters dominate the findings. The largest is **silent supersession by index-only annotation** — older decisions are correctly noted in the DECISIONS.md "Archived Decision Index" summary but lack the inline `⚠ Superseded by` mark on the decision text itself, so any reader who jumps directly to a decision by D-number sees an unflagged stale claim. This pattern accounts for §B in its entirety and significantly overlaps §C-1 / §C-2 / §C-3. The second cluster is **the Twilio era → Sinch + /src sunset** pivot (D-358 + D-215), which orphans an estimated 4–6 archive-era decisions (§C-1) plus partially affects others. The third cluster is **the runtime-enforcement → authoring-time enforcement** pivot (D-293), which silently orphaned D-237 / D-243 / D-244 and the entire compliance-attention dashboard surface. Voice violations and ambiguity findings are small in number — most user-facing-copy decisions either predate v2.0 and were already swept (D-349 precedent) or are scoped to internal/code surfaces. The audit found no evidence of high-stakes active contradictions where two competing approaches are both being built — the project's discipline at recording supersessions is good; the discipline at propagating those records inline to the older decision text is not.
