## Translation / interpretation services
**Vertical:** Professional services
**Bucket:** Clear
**URL slug:** /for/translation-services

### What this builder is making
An agency-CRM / translation management system (TMS) for language service providers — software that intakes a client's source document or interpreting request, generates a quote, dispatches the job to a freelance linguist or interpreter from a vendor pool, tracks it through translation/review/delivery, and bills both sides. The platform serves two distinct audiences: the end-client tracking project status, and the linguist/interpreter workforce receiving assignment offers and deadlines. Think XTRF, Plunet, Boostlingo, or Interpreter IO rebuilt by an indie developer for a single agency.

### Why they need SMS
A dispatched assignment that sits unread in a freelancer's inbox is a missed deadline or an uncovered interpreting appointment — the agency only finds out when the client is already on the phone with no interpreter. SMS reaches a freelance linguist who lives in their inbox sporadically but answers a text in minutes, which is exactly what time-boxed job offers ("accept within 30 min") and same-day on-site interpreting need. On the client side, the deadline-sensitive "your translation is ready" and the day-before interpreting reminder are the moments where a missed email costs a re-shoot or a no-show.

### Message categories
1. team-alerts — primary; the linguist/interpreter workforce-dispatch lane (assignment offered, deadline approaching, schedule change) is the highest-frequency, highest-value SMS in the agency
2. appointments — primary; on-site/remote interpreting bookings are real appointments with confirmation, reminder, reschedule, no-show
3. order-updates — secondary; client-facing translation project lifecycle (quote → confirmed → in progress → delivered) maps cleanly onto order status
4. customer-support — secondary; client and linguist support tickets, query about a project
5. account-events — tertiary; agency-account billing, invoice/payment notices to clients and linguists
6. verification — tertiary; phone verification at linguist/client onboarding
Excluded: marketing (agencies sell B2B via sales relationships, not opted-in promo SMS — no real transactional use case), community (no member community), waitlist (no queued-access model — capacity is managed by dispatch, not a public waitlist)

### Workflows

**Linguist assignment dispatch**
Offers a translation job to a freelance linguist with a time-boxed accept/decline, the core dispatch action of the agency.
Sequence:
1. team-alerts:escalation-ping — "Assignment offer" — GAP:assignment-offered — "New {{language_pair}} job, {{word_count}} words, due {{deadline}}. Reply YES to accept or it goes to the next linguist."
2. team-alerts:shift-scheduled — "Assignment confirmed" — STRETCH:team-alerts:shift-scheduled — sent when the linguist accepts, confirming the job is theirs with deadline and details
3. team-alerts:shift-change — "Deadline or scope change" — sent if the project deadline or scope is revised after assignment
4. team-alerts:shift-cancellation — "Assignment cancelled" — sent if the client cancels the project after dispatch
Variable aliases:
- shift_date: "Tue Jun 23" (delivery deadline date)
- shift_time: "5:00 PM ET" (delivery deadline time)
- location: "remote / file delivery" or the project reference
- role: "Translator (ES>EN)"

**Linguist deadline reminder**
Nudges an assigned linguist ahead of a translation deadline to prevent late delivery.
Sequence:
1. team-alerts:shift-reminder — "Deadline reminder" — "Reminder: {{language_pair}} job due {{deadline}}. Submit via your linguist portal."
2. team-alerts:service-level-alert — "Deadline missed" — STRETCH:team-alerts:service-level-alert — sent to the coordinator when a deadline lapses without delivery
Variable aliases:
- shift_date: "tomorrow"
- shift_time: "5:00 PM ET"

**Interpreting appointment lifecycle**
Manages a booked on-site or remote interpreting session for the assigned interpreter — the workforce-facing appointment lane.
Sequence:
1. appointments:confirmation — "Assignment confirmed" — confirms the interpreter is booked for a session at a given time/place
2. appointments:reminder-distant — "Day-before reminder" — sent the day before the interpreting session
3. appointments:reminder-proximate — "Hour-before reminder" — sent ~1 hour before an on-site session so the interpreter leaves on time
4. appointments:reschedule-confirmation — "Session rescheduled" — sent if the client moves the appointment
5. appointments:cancellation-confirmation — "Session cancelled" — sent when an interpreting session is cancelled
6. appointments:no-show-follow-up — "Interpreter no-show" — STRETCH:appointments:no-show-follow-up — internal alert to the coordinator when an interpreter misses a session
Variable aliases:
- provider_name: "the client / {{client_org}}" (the party the interpreter is serving)
- appointment_time: "Mon Jun 23, 9:00 AM at County Court, Room 4B"

**Client interpreting reminder**
Reminds the requesting client of an upcoming interpreting session so the appointment isn't missed on their end.
Sequence:
1. appointments:confirmation — "Interpreter booked" — confirms an interpreter is assigned to the client's requested session
2. appointments:reminder-distant — "Session tomorrow" — day-before reminder to the client
Variable aliases:
- provider_name: "your interpreter" or "{{linguist_name}}"
- appointment_time: "Mon Jun 23, 9:00 AM"

**Client translation project lifecycle**
Keeps the end-client informed as their document moves from quote to delivery.
Sequence:
1. order-updates:order-confirmed — "Project confirmed" — sent when the client approves the quote and the project is created, with estimated delivery
2. order-updates:order-processing — "In translation" — sent when the project is assigned and underway
3. order-updates:order-delivered — "Ready for download" — STRETCH:order-updates:order-delivered — sent when the finished translation reaches "for download" status in the client portal
Variable aliases:
- order_number: "Project #TR-4821"
- estimated_delivery: "Thu Jun 25"
- return_link: "{{project_link}}" (portal link to download / raise an issue)

**Client quote ready**
Tells a prospective client their quote is ready to review and approve, the start of the project lifecycle.
Sequence:
1. order-updates:order-confirmed — "Quote ready" — GAP:quote-ready — "Your quote for {{project_ref}} is ready. Review and approve: {{quote_link}}"
Variable aliases:
- order_number: "Project #TR-4821"

**Client support ticket lifecycle**
Handles client and linguist questions about a project through the agency's support queue.
Sequence:
1. customer-support:ticket-received — "Request received" — confirms a query about a project is logged
2. customer-support:agent-response — "Coordinator replied" — sent when a project coordinator responds
3. customer-support:resolution-notification — "Query resolved" — sent when the question is closed out
Variable aliases:
- ticket_number: "Query #Q-118"

**Invoice and payment notices**
Surfaces billing events to clients and payout events to linguists.
Sequence:
1. account-events:payment-failed — "Payment failed" — sent when a client's card for a project invoice is declined
2. account-events:subscription-confirmed — "Invoice / payout confirmed" — STRETCH:account-events:subscription-confirmed — sent when a client invoice is paid or a linguist payout is processed
Variable aliases:
- account_link: "{{invoice_link}}"

**Linguist / client onboarding verification**
Proves phone ownership when a new linguist or client account is created.
Sequence:
1. verification:verification-code — "Verification code" — sent at signup to verify the phone number

### Message gaps

**GAP:assignment-offered**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (the time-boxed accept-or-reroute job offer is the dispatch-marketplace pattern shared by translation, field services, gig workforce — register as a workforce-dispatch alias over team-alerts:escalation-ping)
- **Proposed universal name:** Assignment offered (display alias)
- **Why:** the escalation-ping ACK-or-reroute mechanic fits, but the body needs job-specific fields (language pair, word count, deadline) the corpus message doesn't carry

**GAP:quote-ready**
- **Classification:** Universal miss
- **Proposed corpus home:** order-updates:quote-ready (a pre-confirmation status step before order-confirmed — applies to any quote-driven service business: agencies, contractors, freelancers)
- **Proposed universal name:** Quote ready
- **Why:** the order lifecycle starts at "confirmed/paid" and has no step for "quote awaiting your approval," which is the actual first client touch for quote-driven services
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your quote for {{project_ref}} is ready. Review and approve here: {{quote_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} quote for {{project_ref}} is ready to view. Approve it here: {{quote_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Quote for {{project_ref}} ready. {{quote_link}} STOP to opt out.`
- **New variables:** `{{project_ref}}` — short project/quote reference shown to the client, budget ~12 chars, source: TMS project ID, example "TR-4821". `{{quote_link}}` — portal link to review and approve the quote, budget ~24 chars, source: TMS quote URL, example "rk.to/q/4821".

**STRETCH:team-alerts:shift-scheduled**
- **Classification:** Stretch
- **Proposed corpus home:** team-alerts:shift-scheduled — fits as the "assignment confirmed" message; gap is that the body frames a clock-in shift at a location/role, whereas a translation assignment is a deliverable due by a deadline (no physical location, "role" carries the language pair)
- **Proposed universal name:** Shift scheduled (used as "Assignment confirmed" alias)
- **Why:** delivery-deadline jobs reuse the shift-assignment frame but the location/role fields are repurposed via aliases rather than meaning a physical shift

**STRETCH:team-alerts:service-level-alert**
- **Classification:** Stretch
- **Proposed corpus home:** team-alerts:service-level-alert — fits as the internal "deadline missed" coordinator alert; gap is the SLA/incident-ID framing vs. a plain "linguist X missed deadline on project Y" message
- **Proposed universal name:** Service-level alert (used as "Deadline missed" alias)
- **Why:** a missed deliverable deadline is an SLA-style breach, but the body's incident_id framing reads as infra-ops, not a project deadline

**STRETCH:appointments:no-show-follow-up**
- **Classification:** Stretch
- **Proposed corpus home:** appointments:no-show-follow-up — fits the interpreter-missed-session event; gap is the corpus message is client-facing ("we missed you, rebook"), whereas the agency use is an internal alert to the coordinator that the interpreter didn't show
- **Proposed universal name:** No-show follow-up (used as internal "Interpreter no-show" alias)
- **Why:** the trigger (a missed appointment) matches, but the recipient and intent flip from customer-rebook to staff-alert

**STRETCH:order-updates:order-delivered**
- **Classification:** Stretch
- **Proposed corpus home:** order-updates:order-delivered — fits "translation ready for download"; gap is physical-delivery framing ("was delivered," "something wrong? start a return") vs. a digital file reaching download-ready status in a portal
- **Proposed universal name:** Order delivered (used as "Ready for download" alias)
- **Why:** a delivered digital deliverable maps to "delivered" but the return-link framing assumes physical goods

**STRETCH:account-events:subscription-confirmed**
- **Classification:** Stretch
- **Proposed corpus home:** account-events:subscription-confirmed — fits a generic billing-confirmed event; gap is subscription framing vs. a one-off project invoice payment or a linguist payout
- **Proposed universal name:** Subscription confirmed (used as "Invoice / payout confirmed" alias)
- **Why:** the "change confirmed, see details" shape works, but agency billing is per-project invoicing and linguist payouts, not subscription changes

### Content constraints
- Standard carrier rules apply; transactional dispatch, project-status, and appointment messages register as ACCOUNT_NOTIFICATION / DELIVERY_NOTIFICATION / CUSTOMER_CARE — no vertical-specific carrier restrictions.
- Two opt-in audiences with separate consent: the end-client (project/appointment updates) and the linguist/interpreter workforce (assignment dispatch). Collect consent at each onboarding; do not cross-use.
- Workforce-dispatch SMS to freelance linguists is transactional staff communication, not marketing — keep job offers factual (language pair, volume, deadline), no rate/pay-promo framing in the body.
- Never put source-document content or client/case identifying details (names, case numbers, medical/legal subject matter) in the SMS body — translation/interpreting work routinely touches confidential and regulated material; link to the portal instead.
- Marketing-style B2B outreach to prospective client orgs is a separate EIN-gated marketing campaign, not transactional — keep it out of the dispatch/status lanes.

### Disambiguation
The neighboring sub-vertical is general field-service / gig-workforce dispatch (cleaning, delivery, trades): the assignment-offer-with-accept/decline mechanic is shared, which is why this stays Clear and reuses team-alerts. What tips it back toward Conditional is the content, not the workflow — interpreters and translators handle court, medical, immigration, and legal material, so any drift toward putting case content, patient names, or document text in the SMS body risks PHI/PII exposure (RelayKit's healthcare/HIPAA decline at intake, D-18, is a hard line if the agency is doing medical-interpreting and wants PHI through the proxy). The pure dispatch/status/appointment use — "you have a job, here's the deadline, here's the portal link" — is clean and Clear. Also distinct from a localization-SaaS / continuous-translation tool (Lokalise, Phrase) whose users are developers pulling strings via API and have no SMS audience at all; the SMS-relevant builder here is the agency-CRM coordinating human linguists, not the CAT/string-management tool.

### Sources
https://blog.andovar.com/what-is-a-translation-management-system-tms-and-what-to-look-for
https://www.atltranslate.com/blog/best-translation-management-software-systems
https://xtrf.eu/home-portal//
https://xtrf.eu/project-management/
https://www.plunet.com/en/translation-management-news/plunet-translation-management-tools/
https://boostlingo.com/solutions/interpretation-management-system/
https://interpreter.io/Blog/best-interpreting-management-software-solution.html
https://www.gofluently.com/
https://gitnux.org/best/interpreter-scheduling-software/
https://www.selecthub.com/p/employee-scheduling-software/interpreter-management-system/
https://centus.com/blog/translation-workflow-guide
https://www.interpreters.com/document-translation-workflow/
https://docs.rws.com/en-US/trados-enterprise-&-accelerate-791611/viewing-and-downloading-project-quotes-in-trados-customer-portal-717114
https://www.infobip.com/blog/what-is-a2p-10dlc
https://sakari.io/blog/meeting-10dlc-compliance-with-opt-ins
https://www.apten.ai/blog/a2p-dlc-compliance-2026
