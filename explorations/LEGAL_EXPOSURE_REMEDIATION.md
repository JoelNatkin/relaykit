Status: exploring

# Legal Exposure Remediation — Free Authoring Tool

> **What this is:** A self-contained remediation plan for the legal exposure created when the configurator became a free, public, no-login authoring tool (MD-21) while the published Terms / AUP / Privacy (effective 2026-04-28) were still written only for account-holding, paid/sandbox developers. Feed this whole doc into a future session to execute.
>
> **Status:** exploring — §3.1 executed (D-424, point-of-use disclaimer); §3.2 + §3.4–§3.6 executed 2026-06-11 (D-431, browsewrap + Terms/AUP/Privacy reach to anonymous Visitors). §3.3 (marketing-claim narrowing) remains open — Joel's wording call, likely an MD-number.
>
> **Caveat (read once):** This is best-effort drafting, not lawyer-reviewed. Joel has decided to proceed without counsel. The composed clauses below match the register of the existing docs and are designed to drop in; treat them as strong candidates to adapt, not as filed legal language. Nothing here can make RelayKit literally immune from suit — the goal is to close the biggest reliance gap and extend existing protections to anonymous visitors.

---

## 1. The problem (one paragraph)

The home-page configurator is now a free tool used by anonymous visitors with no account and no Terms acceptance. It hands them message text plus rule-card bullets (compliance *advice*), and the marketing surface makes compliance *claims* ("Compliant text messages for your app," "We know the rules so you don't have to"). If a visitor relies on that, sends messages, and gets a TCPA suit or carrier penalty, they can point at RelayKit's advice and claims — and the protections that would normally cover this are written for people who agreed to the Terms.

## 2. The gap (why current docs don't reach the free tool)

The Terms/AUP/Privacy are strong but **gated behind agreement via account creation**:

- **Terms §3.3** — "RelayKit is not a law firm… not legal counsel, regulatory assurance, or a guarantee of compliance." Strong, but applies to "the Service" as defined around accounts.
- **Terms §14** — disclaims that compliance tooling/templates/guidelines "will ensure compliance" or are "legally sufficient." Strong, but gated.
- **Terms §12 (liability cap), §13 (indemnification), §8.4 (compliance is your responsibility).** All strong, all gated.
- The defined term **"Service"** (Terms §1) = dashboard, API, sandbox, message infrastructure, docs — it does **not** mention the public website or the free authoring tool. "Sandbox" is the logged-in dev environment, **not** the public configurator.

So an anonymous configurator user never triggers any of it. That is the exposure.

## 3. Remedies — composed and ready

### 3.1 Configurator point-of-use disclaimer (copy-only; highest priority)

Place visibly in the tool — under the rules card and/or beneath the message stream. Not buried in Terms.

**Short (inline, near the Copy button at the bottom of the configurator under all messages):**
> A starting point, not legal advice. You're responsible for consent and compliance.

**Fuller (tool footer / once per page):**
> RelayKit's sample messages and rules are a starting point — not legal advice or a guarantee that your texts comply. Getting consent and following the rules that apply to your business and your recipients is up to you. See our [Terms](https://relaykit.ai/terms).

Voice note: this is Tier-3-style fine print — plain and human, knowledgeable-friend not legal-brief. It's allowed to be explicit because the reader is looking at fine print.

### 3.2 Site-wide browsewrap footer line (copy-only)

> ✓ **RESOLVED** 2026-06-11 (D-431) — `marketing-site/components/footer.tsx`, commit `ba52a0f`.

Add to the global footer (near "© 2026 RelayKit LLC"):
> By using this site you agree to our [Terms of Service](https://relaykit.ai/terms), [Acceptable Use Policy](https://relaykit.ai/acceptable-use), and [Privacy Policy](https://relaykit.ai/privacy).

Purpose: this is the hook that makes the §3.3 / §12 / §13 / §14 protections reach anonymous visitors (see §3.4 below). Browsewrap is weaker than clickwrap; pairing it with the visible §3.1 disclaimer strengthens the "they were on notice" position.

### 3.3 Marketing claim narrowing (Joel's call on final wording)

Principle: **the compliance *guarantee* attaches to the paid product that actually enforces (the proxy/SDK). The free tool offers a compliant-ready *starting point*, not a guarantee of the output.**

Two exposed claims to revisit, with candidates:

1. **Hero subhead** — currently "Compliant text messages for your app. Free to use."
   - Option A (qualify the output): "Compliant-**ready** text messages for your app. Free to use." — "ready" signals draft/starting-point.
   - Option B (keep hero, move the guarantee): keep the line as the brand promise of the enforced product, and make sure the *free tool's* immediate framing describes drafting/guidance, not guaranteed-compliant output.

2. **"We know the rules so you don't have to"** section — reads as RelayKit fully handling compliance.
   - Candidate softening: "We know the rules, so you start in the right place."
   - Or keep it, but position it within the *enforced paid product* narrative, not next to the free authoring output.

These are demand-voice surfaces — final wording is Joel's (he leads copy). The job for the future session is to qualify the unbacked guarantee on free output, not to gut the marketing punch.

### 3.4 Terms of Service — candidate edits

> ✓ **RESOLVED** 2026-06-11 (D-431) — `marketing-site/app/terms/page.tsx`, commit `42278d7`.

**(a) §1 Definitions — add three terms and amend "Service":**

> **"Website"** means relaykit.ai and all pages and tools hosted on it, including pages and tools accessible without an Account.
>
> **"Authoring Tool"** means the free, public message-authoring tool on the Website that lets Visitors select a use case and generate, preview, and copy sample SMS message text and category guidance, without an Account.
>
> **"Visitor"** means any person who accesses the Website or Authoring Tool, whether or not they have an Account.

Amend the **"Service"** definition to read:
> **"Service"** means the RelayKit platform, including the **Website, the Authoring Tool,** the dashboard, API, sandbox, message processing infrastructure, and all related tools and documentation.

**(b) Add acceptance-by-use (browsewrap), e.g. a new §2.0 or amend the opening clause:**

> By accessing or using the Website or the Authoring Tool — whether or not you create an Account — you agree to be bound by these Terms, the Acceptable Use Policy, and the Privacy Policy. If you do not agree, do not use the Website or its tools.

**(c) Add a new section (e.g., §4A) "Free Authoring Tool and Website Content":**

> **4A.1 Purpose.** The Authoring Tool and the category guidance, sample messages, and rule summaries presented on the Website are provided to help Visitors understand common messaging practices and draft message text. They are general information and a starting point only.
>
> **4A.2 No Enforcement.** RelayKit does not review, approve, or enforce compliance on message text created with the Authoring Tool. Compliance enforcement applies only to messages sent through the paid Service after registration.
>
> **4A.3 No Legal Advice or Guarantee.** The sample messages, rule summaries, and guidance are not legal advice and are not a guarantee that any message complies with the TCPA, carrier policies, or any other law or regulation. Sections 3.3 and 14 apply to all Website and Authoring Tool content.
>
> **4A.4 Your Responsibility.** You are solely responsible for obtaining consent, following applicable law, and ensuring that any message you send — whether drafted with the Authoring Tool or otherwise — complies with all requirements that apply to your business and your recipients.

**(d) Survival (§11.5):** add **4A** to the list of sections that survive termination.

**(e) Effect:** §3.3 (not legal advice / no guarantee), §12 (liability cap), §13 (indemnification), and §14 (no warranty) already cover "templates, guidelines, industry-specific guidance." Once "Service" includes the Website + Authoring Tool and acceptance-by-use is in place, those protections reach anonymous Visitors. No change to the substance of §12–§14 needed.

### 3.5 Acceptable Use Policy — candidate edits

> ✓ **RESOLVED** 2026-06-11 (D-431) — `marketing-site/app/acceptable-use/page.tsx`, commit `5b635c2`.

**(a) Scope note** (add to the opening, after the first paragraph):
> This AUP applies to all use of the Service, including message text authored using the free Authoring Tool on the Website. The content and conduct rules below describe what US carriers and applicable law do and do not allow; RelayKit enforces them on messages sent through the paid Service.

**(b) Reconcile §2.3 "Advisory Industries"** with the 137-sub-vertical taxonomy + the new rule-card bullets. Minimum fix — add:
> Category-specific guidance is provided in the message-authoring tool. The list below is illustrative, not exhaustive.

(Fuller reconciliation — aligning the AUP's industry list with the Airtable taxonomy — is optional and lower priority; the one-line fix removes the "AUP says X, tool implies Y" contradiction.)

### 3.6 Privacy Policy — candidate edit

> ✓ **RESOLVED** 2026-06-11 (D-431) — `marketing-site/app/privacy/page.tsx`, commit `8829ab8`.

Add coverage for anonymous Website visitors (e.g., new §1.6 or an addition to §8):
> **Website Visitors and the Authoring Tool.** When you use the free Authoring Tool without an Account, your use-case selections and draft message text are stored locally in your browser and are not transmitted to or stored by RelayKit unless you submit them (for example, by joining a waitlist or creating an Account). We collect standard, aggregated web analytics for the Website as described in Section 8.

(Confirm against the actual storage keys — `relaykit_wizard`, `relaykit_personalize`, `relaykit_configurator`, `relaykit_elig` — so the description matches what the tool actually stores.)

## 4. Sequencing & execution

1. **Copy-only, ride with the configurator rework (fastest, biggest gap-closer):** §3.1 disclaimer + §3.2 browsewrap footer. Trivial UI/copy; can commit to main with the rework.
2. **Marketing claim narrowing (§3.3):** needs Joel's wording call. Small copy edits to the marketing site once decided.
3. **Legal-doc edits (§3.4–§3.6):** these touch published source files (in `marketing-site/`). Treat as one focused commit (or a small wave), PM-review bar high. **Bump "Effective Date / Last Updated"** on every edited doc. Note Terms §16 / AUP §7 notice rules — these edits *strengthen* protections and *add* disclaimers, which is favorable to users and arguably non-material, but bump dates regardless and post cleanly.

## 5. Decision recording

- **Claim narrowing (§3.3)** is a positioning choice → likely an **MD-number** in MARKETING_STRATEGY ("compliance guarantee attaches to the enforced product; the free tool is a compliant-ready starting point, not a guarantee").
- **Free-tool legal posture (§3.1 + §3.4)** is a product/legal choice → likely a **D-number** ("free authoring tool output is unenforced guidance, not a compliance guarantee; protections extended to anonymous visitors via browsewrap + point-of-use disclaimer").
- Apply the seven gate tests in-session before assigning numbers; verify the next number against DECISIONS.md / MARKETING_STRATEGY.md.

## 6. Open choices for Joel

1. Hero wording — Option A ("compliant-ready") vs Option B (keep hero, reframe the free tool's framing).
2. "We know the rules so you don't have to" — soften, or keep and re-position next to the enforced product.
3. AUP §2.3 — one-line illustrative fix now, or full reconciliation with the taxonomy later.
4. Whether to also add a lightweight clickwrap (a checkbox/affirmative step) at any point the Visitor acts — stronger than browsewrap, but adds friction to a free tool. Default recommendation: browsewrap + visible disclaimer now; revisit clickwrap if/when the tool collects anything.

---

*Best-effort, no-counsel draft. Composed by PM/architect session, 2026-05-31.*
