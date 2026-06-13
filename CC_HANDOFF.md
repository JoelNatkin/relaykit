# CC_HANDOFF — Session 134 close-out: sole-proprietor stance hardened to permanent (D-433) (2026-06-13)

> **Purpose:** Transient summary at the end of each CC session to orient the next. Overwritten each close-out.
>
> Not for: long-term state (REPO_INDEX), decision rationale (DECISIONS), product behavior (PRODUCT_SUMMARY). Write for the next reader.

**Session metrics:** Commits: 1 (held for PM `gg`, NOT pushed) | Files modified: 7 (DECISIONS, MASTER_PLAN, BACKLOG, explorations/no-ein-sole-proprietor-path, docs/PRODUCT_SUMMARY, docs/CUSTOMER_ARCHETYPE_FOUNDATION, REPO_INDEX) + CC_HANDOFF | Decisions added: 1 (**D-433**), 2 amended (D-247, D-302) | External actions: 0. **Doc-only session — no code touched, quality gates skipped.** Mid-phase (active phase stays Phase 2 — Session B → retirement sweep + drift watch skipped).

**Status: 🟡 Committed locally, HELD for PM `gg` review — do NOT push until approved.** A scoped doc-only hardening session; the substantive product pickup remains Phase 2 — Session B.

---

## What landed this session (one local commit, not pushed)

Converted RelayKit's stance on **sole proprietors without a registered business entity** from *deferred-at-launch / revisit-if-pull* to **permanently unsupported**, per Joel's instruction and the PM-approved plan (`.pm/plans/plan-mode-doc-only-session-virtual-lemon.md`). The deferral rested entirely on Sinch toll-free (TFN) verification as the eventual fallback; that path is confirmed permanently blocked (manual-only Verified Sender Form, no API, BRN mandatory since Jan 2026, discretionary not-guaranteed sole-prop carve-out). Short codes: zero existing copy anywhere — clean assertion. The truthful route is preserved everywhere: form a registered entity (LLC/corp + EIN) → standard 10DLC.

1. **D-433 recorded** — sole proprietors without a registered entity are permanently unsupported; TFN / short codes / secondary-carrier / RelayKit-as-CSP all permanently rejected; only route is form-an-entity → 10DLC. **Supersedes: none** — the key finding is that *no prior D-number ever owned the deferral* (it lived as a MASTER_PLAN scope note + BACKLOG entry + exploration).
2. **D-247 + D-302 amended** (not superseded) — each carries a now-false Twilio-era clause ("sole proprietor registrations are limited to one campaign"). Marked `⚠ Amended by D-433` in the same commit: the one-campaign clause is moot (a no-entity sole prop can't register at all), while their still-operative EIN-gating-for-marketing core stands. Handled as amendments per §Ledger (evolution ≠ supersession unless the earlier approach is no longer operative).
3. **MASTER_PLAN** out-of-scope bullet → permanent, cross-ref D-433, TFN/short-code hope removed.
4. **BACKLOG** "Sole Proprietor customer segment" entry → 2026-06-13 update line "PERMANENTLY CLOSED (D-433)"; `### Last updated` bumped to June 13.
5. **explorations/no-ein-sole-proprietor-path.md killed** — `Status: killed (2026-06-13) … (D-433)`; a dated supersession note added atop §Resolution so the file's "door open" conclusion reads as historical. Not in the REPO_INDEX active-explorations table (retired Session 126), so no row to remove; no PROTOTYPE_SPEC/PRODUCT_SUMMARY pointers existed.
6. **PRODUCT_SUMMARY §3** sole-prop bullet → permanent non-support; **Last reviewed** bumped (manual — blockquote header not hook-enforced).
7. **CUSTOMER_ARCHETYPE §4b** "no-EIN builder" → "sole-proprietor builder (no registered entity)", permanent non-support; §4c synthesis line updated. Terminology standardized to "sole proprietor(s)" — wall is registered-entity status, not the EIN.
8. **REPO_INDEX** — Meta lead (Session 134), count 347→348 / latest D-433, four doc-rows bumped (MASTER_PLAN, DECISIONS, PRODUCT_SUMMARY, CUSTOMER_ARCHETYPE).

## Verification done
- §Prose-sweep multiline grep across the six edited docs: no surviving "deferred at launch / door open / revisit post-launch / live candidate" framing for this segment; "no-EIN" framing retired from the edited canon. (See verification block in the plan.)
- Ledger: D-433 present, `Supersedes: none`; D-247 + D-302 each carry the `⚠ Amended by D-433` line; count = 348 / latest D-433.
- Hook: BACKLOG `### Last updated:` = June 13, 2026. (DECISIONS/MASTER_PLAN/REPO_INDEX carry no hook-enforced in-file header; PRODUCT_SUMMARY blockquote header bumped manually.)
- "short code" as a product offering: zero pre-existing copy anywhere (confirmed pre-edit); the term now appears only in D-433 / MASTER_PLAN as an explicit "never." (The two non-canon hits — `audits/…EXTRACTION.md`, `blog/clusters.ts` — are unrelated.)

## Carry-forwards (flagged, not done here)
- **`/prototype` + `/src` intake copy** — the stale "we'll register you as a sole proprietor (limited to one campaign)" promise still lives in `prototype/components/registration/business-details-form.tsx` (636–639, 647–648, 797) + `review-confirm.tsx:293` and the sunset `/src` FAQ/forms. **Deliberately deferred** to a dedicated `/prototype` UI session: the copy fix must move *with* the `has_ein="no"` flow-gating decision (block/redirect the no-entity path) — fixing copy while the flow still lets a no-entity sole prop click Continue and register would leave the prototype incoherent. `/src` items are sunsetting (D-358) — do not polish; they die with `/src`.
- **Standing (pre-existing):** dead token `--color-text-headline-muted` (globals.css:78); `globals.css` light→dark dead-token collapse (D-430); blog "configurator" voice rewrite; delete `joel+golive-smoke@gmail.com` from `early_access_subscribers`; OG unfurl cache-bust verify; migration `009_early_access_interest_tag.sql` apply-before-deploy; Claude.ai UI custom-instructions paste-sync.

## Branch state
**No open feature branches.** This session's commit is local on `main`, **unpushed** — held for PM `gg`. The five older marketing branches remain merged-not-deleted (optional cleanup).

## Untracked carryover — DO NOT COMMIT
- Only `.claude/settings.local.json` remains untracked.

## Next steps
- **PM `gg`** → review `.pm-review.md` → approve push of the D-433 hardening commit.
- **Phase 2 — Session B (Sinch outbound delivery)** per MASTER_PLAN — the substantive product pickup.
- When a `/prototype` UI session opens: fix the sole-prop intake copy + `has_ein="no"` flow-gating together (carry-forward above).
