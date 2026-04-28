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

### 2026-04-28 — Privacy editorial pass before carrier resubmission (same session)

**Source:** `/marketing-site/app/privacy/page.tsx`

**Cuts:**

7. **§3.3 "Compliance Site" subsection — entire subsection.** Cut because there's no per-customer compliance site yet. Original described the publicly-visible signup surface at `{slug}.msgverified.com` displaying business name, contact info, privacy policy, terms of service, and SMS opt-in page, framed as a 10DLC requirement. Restoration trigger: msgverified opt-in form ships per MASTER_PLAN v1.3 Phase 5. Following subsections renumbered (3.4→3.3, 3.5→3.4, 3.6→3.5) at deletion; revert numbering when restoring.

8. **§6.3 "Deletion" — bullet "Your compliance site will be taken offline."** Cut because there's no per-customer compliance site yet. Restoration trigger: msgverified opt-in form ships (Phase 5) — at that point the per-customer site IS live and the deletion-flow bullet should be reinstated.

9. **§2 "How We Use Your Information" — bullet "Enforce compliance — scan outbound messages for prohibited content, enforce opt-out handling, quiet hours, rate limits, and drift detection."** Cut the specific capability enumeration; replaced with generic "process outbound messages and metadata to enforce the compliance rules described in our Terms of Service and Acceptable Use Policy." Reason: most enumerated capabilities (SHAFT-C scanning, quiet hours, rate limits, drift detection) are aspirational or partial today. Restoration trigger: as individual capabilities ship per MESSAGE_PIPELINE_SPEC and any future drift-detection spec, restore matching language. Treat as multiple sub-restorations. Mirrors Terms cut #2 and #6.

10. **§7.2 "Our Use of End User Data" — two bullets.** (a) "Enforce compliance rules (opt-out handling, quiet hours, SHAFT-C scanning, consent verification)" — cut the parenthetical enumeration; replaced with "Enforce the compliance rules described in our Terms of Service and Acceptable Use Policy." (b) "Detect semantic drift from your registered use case" — removed entirely. Reason: drift detection isn't shipped; specific compliance capabilities are aspirational or partial. Restoration trigger: as individual capabilities ship, restore matching language. Treat as multiple sub-restorations. Mirrors Terms cut #6 and Privacy cut #9.

11. **§1.4 "Usage Data" — Message metadata bullet parenthetical "(hashed for analytics)."** Cut because phone-number hashing is not implemented in the current `/api` surface. Verified via grep on `/api/src` — `auth.ts` only sha256-hashes API keys; no phone-number hashing exists. Also cut "Compliance Proxy" terminology in same §1.4 bullets (Message metadata + Message content) — replaced with "RelayKit" because "Compliance Proxy" has zero active occurrences across `/prototype`, `/api`, MESSAGE_PIPELINE_SPEC, or PROTOTYPE_SPEC. Restoration trigger for the parenthetical: phone-number hashing actually shipped as a privacy mitigation. The "Compliance Proxy" term replacement is permanent (not a restoration entry — terminology has been retired across the active surface).

**Infrastructure-change note (not a restoration entry):** §5 Data Security infrastructure-security bullet had named Cloudflare alongside Supabase. §3.1 Service Providers table also had a Cloudflare row. Both removed in same commit. Marketing site moved to Vercel for hosting; Cloudflare retained only for DNS which doesn't process customer data. If hosting infrastructure changes again, update §5 and §3.1 to reflect current providers.

**Removed in commit:** `78d4ada`

---

## Restored claims

(Entries moved here once features ship and claims restore. Empty for now.)
