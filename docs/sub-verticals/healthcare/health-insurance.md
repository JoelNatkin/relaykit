## Health insurance navigation / benefits
**Vertical:** Healthcare
**Bucket:** Not yet, maybe not ever
**URL slug:** /for/health-insurance
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.

### What this builder is making
Software that helps employees and consumers navigate health-insurance choices: open-enrollment helpers, plan-comparison and decision-support tools, benefits-administration apps for employer groups, and Medicare/ACA-marketplace navigators that guide people through plan selection and enrollment deadlines. The product sits on top of carriers and plans (Employee Navigator, Healthee, Selerix-style platforms) rather than delivering care — it moves people through enrollment windows, collects required documents, and surfaces benefits questions. Adjacent to clinical without being clinical, but health-insurance is a TCR Special category regardless.

### Why they need SMS
The driving moment is a hard deadline: an open-enrollment window closing, a plan-selection action still incomplete, or a verification document the carrier needs before coverage can take effect. The consequence is unusually severe — a missed open-enrollment window typically means no coverage change for a full year, so a buried email is a real harm, not just a lapsed cart. SMS wins because it lands on the deadline day where email does not, while bodies stay PHI-hygienic — logistics and portal links only, never a condition, claim, or plan-detail leak.

### Message categories
1. account-events — enrollment-window and plan-selection lifecycle nudges map to the account-lifecycle "trial ending"/"choose a plan" shape; the deadline-with-portal-link pattern is the core of this vertical.
2. appointments — benefits counselor / enrollment-advisor sessions and info-session reminders are straight appointment confirmations and reminders.
3. waitlist — Medicaid/marketplace eligibility-determination queues and plan-availability openings fit the position/your-turn lifecycle.
4. verification — phone-ownership 2FA at portal signup (the cleanest, lowest-scrutiny use; 2FA carve-out).
5. customer-support — benefits-question ticket lifecycle when the app runs a help desk.

Excluded: marketing (Medicare/insurance promotion carries CMS TPMO rules + is among the most carrier-filtered traffic — out of scope for this entry), order-updates (no physical fulfillment), team-alerts (no ops/on-call surface), community (no member-community layer).

### Workflows

**Open-enrollment deadline sequence**
Move a known, enrolled user through their enrollment window before it closes.
Sequence:
1. account-events:trial-ending — "Enrollment window opening" — sent when the window opens; reframes "trial ends in N days / choose a plan" as "enrollment ends in N days / make your selection." STRETCH — see gap below.
2. GAP:enrollment-action-needed — "Selection still needed" — mid-window nudge when no plan has been chosen.
3. account-events:trial-ending — "Final-days reminder" — sent in the last few days of the window (reuse, low days_remaining).
4. account-events:subscription-confirmed — "Enrollment confirmed" — sent when selection is submitted and accepted; "your enrollment change is confirmed."
Variable aliases (only where default feels wrong):
- days_remaining: "5" (days left in the enrollment window)
- account_link: "your enrollment portal link"

**Document / verification needed**
Get a required enrollment document from the user before the carrier can finalize coverage.
Sequence:
1. GAP:document-needed — "Document needed" — sent when the carrier flags a missing dependent-eligibility or income-verification document.
2. GAP:document-received — "Document received" — confirmation once the upload lands (reframe account-events:subscription-confirmed if a dedicated message is not added).
Variable aliases:
- account_link: "your document-upload link"

**ID card / coverage-active ready**
Tell the user their coverage is active and their ID card is available.
Sequence:
1. GAP:coverage-active — "Coverage active" — sent when the plan goes effective and the ID card is downloadable.
Variable aliases:
- account_link: "your member portal link"

**Enrollment-advisor session**
Confirm and remind a benefits-counselor or enrollment-help appointment.
Sequence:
1. appointments:confirmation — "Session confirmed" — when a counselor session is booked.
2. appointments:reminder-distant — "Session tomorrow" — day-before reminder.
3. appointments:reminder-proximate — "Session in 1 hour" — hour-before reminder.
Variable aliases:
- provider_name: "your benefits counselor"

**Eligibility-determination queue**
Update a marketplace/Medicaid applicant waiting on an eligibility decision or plan-availability opening.
Sequence:
1. waitlist:joined — "Application received" — when the applicant enters the determination queue.
2. waitlist:almost-up — "Decision coming soon" — when the determination is near.
3. waitlist:your-turn — "Action ready" — when a decision lands or a plan opens and the user must act.
Variable aliases:
- claim_link: "your enrollment action link"

**Portal sign-in verification**
Prove phone ownership at member-portal signup or step-up.
Sequence:
1. verification:verification-code — "Verification code" — at portal signup (2FA carve-out, no STOP/HELP).

### Message gaps

**GAP:enrollment-action-needed**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (display alias over account-events:trial-ending)
- **Proposed universal name:** "Action still needed" (display alias: "Selection still needed")
- **Why:** mid-window "you haven't chosen a plan yet" nudge has no clean lifecycle home and is the highest-value message in the vertical.
- **Status:** FUTURE — do not add to corpus until bucket changes.

**GAP:document-needed**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:document-needed
- **Proposed universal name:** "Document needed"
- **Why:** "we need a document from you to proceed" is a generic account-lifecycle moment (KYC, dependent-eligibility, income verification) the corpus has no message for.
- **Draft variants:**
  - Standard: `{{workspace_name}}: We need a document to finish your enrollment. Upload it here: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: One more thing to finish enrollment — a document. Upload it here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Document needed to finish enrollment. Upload: {{account_link}} STOP to opt out.`
- **Status:** FUTURE — do not add to corpus until bucket changes.

**GAP:document-received**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:document-received
- **Proposed universal name:** "Document received"
- **Why:** the confirming bookend to document-needed; closing the loop on a requested upload is a generic lifecycle moment.
- **Draft variants:**
  - Standard: `{{workspace_name}}: We received your document. No action needed — we'll let you know if anything else is required. Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: Got your document, thanks. Nothing more to do right now — we'll be in touch if we need anything else. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Document received. No action needed. STOP to opt out.`
- **Status:** FUTURE — do not add to corpus until bucket changes.

**GAP:coverage-active**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (reframe of account-events:subscription-confirmed)
- **Proposed universal name:** "Coverage active" (display alias over a generic "status active" lifecycle message)
- **Why:** "your coverage is now active / ID card ready" is a vertical-specific milestone; the subscription-confirmed shape covers it but the framing is health-insurance-only.
- **Status:** FUTURE — do not add to corpus until bucket changes.

**STRETCH:account-events:trial-ending**
- **Classification:** Stretch
- **Proposed corpus home:** account-events:trial-ending (used as the open-enrollment deadline message via display alias + variable aliasing)
- **Proposed universal name:** "Window closing soon" (display alias: "Enrollment ends soon")
- **Why:** "trial ends in N days, choose a plan" is structurally identical to "enrollment ends in N days, make your selection," but the trial framing is a real semantic stretch for a benefits deadline.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your enrollment window closes in {{days_remaining}} days. Make your selection here: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: Heads up — your enrollment window closes in {{days_remaining}} days. Choose your plan here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Enrollment closes in {{days_remaining}} days. Select: {{account_link}} STOP to opt out.`
- **Status:** FUTURE — do not add to corpus until bucket changes.

### Content constraints
- Health-insurance is a TCR **Special** use case — registration requires brand vetting and/or MNO pre/post approval and is reviewed case-by-case; expect substantially higher rejection rates than standard business traffic.
- Never put a health condition, diagnosis, claim, or plan-medical-detail in a body. Enrollment/benefits **logistics** only — deadlines, "action needed," "document needed," portal links.
- A benefits navigator/broker is generally a HIPAA **Business Associate** (the health plan is the covered entity), and may hold a BAA when handling PHI beyond enrollment. Even where enrollment-only handling is lighter-touch, keep SMS bodies PHI-free as a hard rule and route PHI behind the portal link, never into the message.
- Medicare marketing carries strict CMS rules on top of TCR: TPMO disclaimers, Permission to Contact (PTC, now 12-month expiry), and Prior Express Written Consent before sharing beneficiary data — and no cold call/text without that consent. RelayKit does not serve Medicare promotional outreach.
- Insurance lead-generation texting is high-abuse and among the most carrier-filtered traffic; under FCC one-to-one consent (Jan 2026) consent cannot be shared or sold across brands, and use case must match consent (an enrollment consent does not authorize marketing).
- TCPA consent required for all outreach; statutory exposure is $500–$1,500 per message with no cap.
- 2FA portal-signup verification is the cleanest path (2FA TCR carve-out, no STOP/HELP in body) and the lowest-scrutiny way into this audience.

### Disambiguation
This entry is benefits-navigation and enrollment admin — moving a *known, opted-in* user through plan selection, documents, and deadlines — not consumer-insurance insurtech (policy issuance, quoting, claims), which sits in the financial-services family and is also a Special category there. It is also not clinical care: no PHI, no diagnosis or treatment content ever touches a body. Medicare and ACA-marketplace navigation stack **CMS marketing rules** (TPMO disclaimers, PTC, PEWC) on top of the baseline TCR Special-category scrutiny, which is why the marketing category is excluded here entirely. A developer will assume the whole vertical is uniformly hard, but the gradient is steep: an "open enrollment ends soon" nudge to a person already enrolled in your benefits app is comparatively tame, while cold insurance lead-gen texting to acquired contacts is among the most aggressively carrier-filtered traffic that exists — the bucket is "Not yet, maybe not ever" because the Special-category vetting burden applies even to the tame end.

### Sources
https://peoplemanagingpeople.com/tools/benefits-administration-software/
https://www.myshortlister.com/benefits-navigation-platform/vendor-list
https://selerix.com/blog/how-to-choose-open-enrollment-software/
https://mytcrplus.com/resources/industry-sms-compliance-playbooks/healthcare-sms-compliance-playbook/
https://www.campaignregistry.com/resources/
https://blog.newhorizonsmktg.com/tpmo-disclaimer-tips-to-stay-compliant
https://natlawreview.com/article/cms-issues-its-2025-final-rule-aligning-fcc-cms-requires-tpmos-obtain-beneficiarys
https://activeprospect.com/blog/tpmo-medicare/
https://www.womblebonddickinson.com/us/insights/blogs/fcc-tightens-lead-generator-tcpa-consent-requirements-adopts-texting-do-not-call-and
https://www.leadgen-economy.com/blog/sms-lead-generation-tcpa-compliance-strategies/
https://www.infobip.com/blog/tcpa-compliance-sms
https://www.hipaajournal.com/hipaa-compliance-for-insurance-brokers/
https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/business-associates/index.html
https://www.text-em-all.com/blog/how-to-leverage-sms-for-a-smooth-open-enrollment-period
https://www.dialoghealth.com/open-enrollment-sms
https://www.udext.com/blog/open-enrollment-preparation-tips
