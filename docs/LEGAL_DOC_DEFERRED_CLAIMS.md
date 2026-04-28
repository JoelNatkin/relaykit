# Legal Doc Deferred Claims

**Purpose:** Track claims removed from legal docs (Terms, Privacy, AUP) because the underlying feature isn't shipped yet, but which should be restored once the feature ships. Companion to the BACKLOG entry on legal-doc sync process — that's the write-side, this is the read-side.

**Format per entry:**
- Source doc + section
- What was removed (verbatim or paraphrase)
- Why removed (which feature isn't built)
- Restoration trigger (which phase / decision / event signals readiness to restore)
- Date removed + commit hash

**When to consult this file:** At every MASTER_PLAN phase boundary — check if any restoration triggers have fired. Also when shipping any feature that previously triggered a legal-doc cut.

---

## Active deferred claims

(Entries added in chronological order — newest at bottom of section)

### 2026-04-28 — Terms editorial pass before carrier resubmission

**Source:** `/marketing-site/app/terms/page.tsx`

**Cuts:**

1. **§1 Definitions — "Compliance Site" definition.** Removed entire definition block. Restoration trigger: msgverified opt-in form ships per MASTER_PLAN v1.3 Phase 5. When restored, definition should describe the per-customer signup surface RelayKit hosts at msgverified.com/{slug}/signup, not a general "compliance website."

2. **§3.1 "What RelayKit Provides" — bullet "Compliance Proxy that routes all messages through inline compliance enforcement."** Cut because inline enforcement is partial. Restoration trigger: when full inline enforcement (SHAFT-C scanning, quiet hours, marketing consent verification at proxy) ships per MESSAGE_PIPELINE_SPEC. May be multiple sub-restorations as individual capabilities land.

3. **§3.1 "What RelayKit Provides" — bullet "Ongoing compliance monitoring including semantic drift detection and message content scanning."** Cut because drift detection isn't shipped. Restoration trigger: drift detection ships (currently no specific phase assigned — likely post-launch backlog).

4. **§5.1 "Registration Process" — bullet content about "opt-in copy and compliance site content" generated on customer's behalf.** Cut because per-customer compliance artifacts beyond campaign description and sample messages aren't built yet. Restoration trigger: msgverified opt-in form ships (Phase 5) AND any additional auto-generated compliance artifacts (privacy snippet, terms snippet) ship.

5. **§6.5 "Subscription Cancellation" — bullet "Your compliance site remains live for 30 days to satisfy carrier audit requirements."** Cut because there's no per-customer compliance site yet. Restoration trigger: msgverified opt-in form ships (Phase 5) — at that point the per-customer site IS live and the 30-day post-cancellation policy should be reinstated.

6. **§9.1 "Consent to Monitoring" — three bullets about (a) inline SHAFT-C scanning + opt-out + quiet hours + rate limit + marketing consent verification, (b) async monitoring for sender ID + opt-out language + frequency + drift, (c) drift detection using automated analysis.** Cut because most listed capabilities are aspirational or partial. Restoration trigger: as individual capabilities ship per MESSAGE_PIPELINE_SPEC and any future drift-detection spec, restore matching bullets. Treat as multiple sub-restorations.

**Removed in commit:** `eb8d160`

---

## Restored claims

(Entries moved here once features ship and claims restore. Empty for now.)
