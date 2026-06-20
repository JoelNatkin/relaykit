## Private investigation / security services
**Vertical:** Professional services
**Bucket:** Not yet maybe not ever
**URL slug:** /for/private-investigation
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.

### What this builder is making
A licensed private investigation or security-services firm runs case-management and field-operations software (CROSSTrax, Polonious, Case IQ, i-Sight, CaseJacket-style products) that handles client intake, case assignment, evidence and timeline logging, billable-hour tracking, invoicing, and field-agent dispatch. The platform's operational core is moving an investigator to a location, logging what they observe, and reporting case progress back to the retaining client (often an attorney, insurer, or individual). Revenue comes from per-case or hourly billing for surveillance, background, skip-trace, insurance-fraud, and physical-security work — not from selling any list or lead.

### Why they need SMS
When a field investigator is dispatched to a moving surveillance subject or a security incident is unfolding, the dispatch ping and the agent's check-in have to land in seconds — email and app push die in dead zones and on shared devices, and a late acknowledgment can mean a lost subject or an uncovered post. Firms also want to text retaining clients a "case update posted" nudge so the client logs in to the secure portal rather than the firm narrating sensitive detail over an unsecured channel. SMS wins on the dispatch-and-check-in loop because it is the one channel that reaches an agent in the field reliably and demands an immediate acknowledgment.

### Message categories
1. team-alerts — internal field-agent dispatch, shift/post assignment, check-in, and escalation: the firm's own licensed staff, the cleanest consented surface
2. appointments — client/attorney case-consult scheduling and reminders (firm-to-retaining-client, first-party)
3. customer-support — retaining-client "update posted / question logged" portal nudges once an engagement exists
Excluded: marketing (promotional outreach by an investigative/surveillance firm is the exact profile carriers refuse), order-updates (no shipped-goods lifecycle), waitlist (no queue model), community (none), verification (no first-party consumer-auth surface that survives the surveillance-adjacency problem), account-events (no recurring consumer billing relationship — clients are invoiced, not subscribed)

### Workflows

**Field-agent dispatch and post assignment**
Sends a licensed investigator/guard their assignment and location when a case or post is staffed.
Sequence:
1. team-alerts:shift-scheduled — "Assignment set" — names the date/time, location, and role when an agent is assigned to a case or security post
2. team-alerts:shift-reminder — "Assignment reminder" — ahead of post/surveillance start time
3. team-alerts:shift-start — "On post — check in" — at start time, with a check-in action so dispatch confirms the agent is in position
Variable aliases (only where the default example would feel wrong):
- role: "lead surveillance"
- location: "subject's last-known address"

**Assignment change / standdown**
Tells a field agent their assignment moved or was called off (subject relocated, client paused, capacity).
Sequence:
1. team-alerts:shift-change — "Assignment changed" — new date/time/location after a reassignment
2. team-alerts:shift-cancellation — "Stand down" — assignment cancelled, agent released from the post
Variable aliases (only where the default example would feel wrong):
- location: "new staging point"

**Live-incident escalation (security ops)**
Routes an urgent field event to an on-call supervisor and forces acknowledgment.
Sequence:
1. team-alerts:escalation-ping — "Incident — ACK or it escalates" — supervisor must reply ACK or it routes to the next on-call
2. team-alerts:on-call-page — "Respond now" — shortest urgent page when a post/site needs immediate response
Variable aliases (only where the default example would feel wrong):
- system_name: "Site 4 north gate"
- severity: "URGENT"

**Client case-consult scheduling**
Schedules the retaining client/attorney case-review call with the lead investigator.
Sequence:
1. appointments:confirmation — "Case consult booked" — confirms the review-call time with the assigned investigator
2. appointments:reminder-distant — "Consult tomorrow" — day-before reminder with a reschedule path
3. appointments:reminder-proximate — "Consult in 1 hour" — proximate reminder before the call
Variable aliases (only where the default example would feel wrong):
- provider_name: "your lead investigator"

**Retaining-client portal nudge**
Tells the retaining client a case update is waiting in the secure portal — without putting case detail in SMS.
Sequence:
1. customer-support:agent-response — "Update posted" — a case update is in the portal, with a link to view (no case detail in body)
2. customer-support:ticket-received — "Question logged" — acknowledges a client question routed to the case team
Variable aliases (only where the default example would feel wrong):
- ticket_number: "case ref"

### Message gaps

**GAP:agent-check-in-request**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** "Check-in due" (display alias)
- **Why:** PI/security dispatch needs a periodic "confirm you're in position / still on post" prompt with a reply-to-confirm action — this is the surveillance-adjacent message that anchors the carrier-scrutiny concern, so it is documented as vertical-specific, never corpus-promoted
- **Status:** FUTURE

**GAP:subject-status-update**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** "Field status" (display alias)
- **Why:** a field agent texting case/subject status back to dispatch is the core surveillance-tool-adjacent traffic carriers flag; it must stay flagged vertical-specific so no clean universal message ever frames "tracking a subject" as routine
- **Status:** FUTURE

**STRETCH:customer-support:agent-response**
- **Classification:** Stretch
- **Proposed corpus home:** customer-support:agent-response reused as the retaining-client portal nudge; fit gap is that the corpus body assumes a routine support-ticket reply, whereas here it must carry zero case detail and only point to a secure portal
- **Proposed universal name:** customer-support:agent-response
- **Why:** the corpus message works only as a content-free "something's waiting, log in to view" nudge — any investigative detail in the body would put sensitive case material on an unsecured channel, so reuse requires the body stay strictly a portal pointer
- **Draft variants:**
  - Standard: `{{workspace_name}}: A case update is posted to your secure portal. View it here: {{ticket_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: There's a new update in your secure case portal. Take a look: {{ticket_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Case update posted. View: {{ticket_link}} STOP to opt out.`
- **Status:** FUTURE

### Content constraints
- **Why gated — TCR Special-category / surveillance-adjacency.** Investigative-services and tracking/monitoring traffic falls under heightened carrier and TCR treatment: campaigns whose stated purpose is locating, surveilling, or tracking a person draw vetting scrutiny and frequent denial because they read as harassment/stalking-adjacent regardless of the firm's licensure. The industry-wide standard here is that the brand's business description itself ("private investigations," "surveillance," "skip trace") triggers the suspicion, not the individual message.
- **Why gated — state PI/security licensing.** More than 40 states plus DC require PI and/or security-firm licensure (firm license + individual investigator/guard licenses + business registration). A defensible RelayKit posture would require the firm to attest to active licensure before any field-dispatch campaign — an attestation gate RelayKit does not currently operate.
- **Why gated — third-party consent break.** The retaining client consents to firm contact, but the surveillance *subject* never does and must never be messaged. Any message aimed at, about-by-name, or tracking a non-consenting third party is prohibited. Only the firm's own licensed staff (dispatch) and its own retaining clients (consults/portal nudges) are valid recipients.
- No case or subject detail in any SMS body — names, locations of subjects, findings, surveillance results. Sensitive content lives behind the secure portal; SMS is a content-free pointer only.
- No promotional content. An investigative/security firm sending marketing SMS is the exact profile carriers refuse; this sub-vertical carries no marketing surface.
- No skip-trace / locate / debt-adjacent messaging to located parties — that is third-party contact built on data the recipient never consented to share, and is auto-denied.
- First-party recipients only: licensed field staff (team-alerts) and retaining clients (appointments, support nudges). No subject, no purchased list, no located-party.

### Disambiguation
Legitimate, licensed PI/security operational messaging is a narrow first-party loop: a firm dispatching its own licensed investigators and guards (team-alerts), and nudging its own retaining clients to a secure portal for case consults and updates (appointments, customer-support). That traffic is, in shape, indistinguishable from any field-services dispatch or professional-services client-scheduling flow — the recipients consented and are known. What draws carrier scrutiny and TCR Special-category treatment is the surveillance/tracking-adjacent use that sits one inch away: messaging that locates, tracks, or reports on a non-consenting third party (the surveillance subject, a skip-traced person, a monitored individual), which carriers cannot distinguish from stalking/harassment at the brand level and therefore gate the whole vertical. The line that would have to be cleared to move this to Conditional: a licensure attestation gate plus an enforceable constraint that recipients are restricted to the firm's own staff and retaining clients with zero subject-directed or subject-detail traffic — so that a brand reading "private investigation" can be vetted as a benign internal-dispatch and client-portal sender rather than a tracking tool.

### Sources
https://www.harborcompliance.com/private-investigator-license
https://www.harborcompliance.com/private-investigator-firm-license
https://privateinvestigatoredu.org/license-requirements/
https://www.bsis.ca.gov/forms_pubs/pi_fact.shtml
https://www.crosstrax.co/investigation-case-management-software-guide/
https://www.polonious-systems.com/solutions/private-investigations/
https://casejacket.com/
https://www.einvestigator.com/case-management-software/
https://support.callrail.com/hc/en-us/articles/18593904382221-Text-Message-Compliance-10DLC-regulations-and-guidelines
https://www.tychron.com/files/10DLC-Use-Case-Selection-Guide.pdf
https://www.bandwidth.com/support/en/articles/12823092-10dlc-campaign-vetting-tips-and-tricks
https://legalclarity.org/10dlc-compliance-requirements-fees-and-penalties/
https://www.10dlc.org/en/shaft
