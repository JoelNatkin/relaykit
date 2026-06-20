## Real estate agents / brokerages (operations)
**Vertical:** Professional services
**Bucket:** Conditional
**URL slug:** /for/real-estate-ops

### What this builder is making
A transaction-management, showing-coordination, or brokerage-ops tool that an agent or transaction coordinator uses to move an active deal from showing through contract to close — tracking milestones (offer accepted, inspection, appraisal, contingency removal, clear-to-close, signing), scheduling showings and walkthroughs, and collecting client documents. The software sits on top of a CRM and a deal pipeline; SMS rides on status changes inside that pipeline. This is operations software for clients already under representation, not a lead-gen dialer or referral-blast tool.

### Why they need SMS
A deal under contract is a stack of hard, statutory deadlines — inspection windows, appraisal delivery, signature deadlines — where a client who misses one email can blow a contingency and cost everyone the close. The agent or TC needs the client to see "offer accepted, inspection Friday" or "sign by 5pm tomorrow to stay on schedule" the moment status changes, not whenever they next open email. SMS is the only channel a buyer reliably reads inside the hour, which is what these date-bound milestones demand.

### Message categories
1. appointments — showings, inspections, appraisals, walkthroughs, and the closing/signing appointment are the dominant scheduled events; confirmations and reminders carry the load
2. account-events — transaction-state confirmations (offer accepted, under contract, clear-to-close) map to lifecycle/state-change alerts the client must not miss
3. customer-support — proactive "you're stuck / something needs your attention" outreach when a client hasn't signed or responded
Excluded: marketing (promotional/lead-gen blasts are the deferred high-abuse referral tier, out of scope here), community (no member community), order-updates (e-commerce fulfillment framing doesn't fit; transaction milestones are their own thing — see gaps), waitlist (no queue), team-alerts (internal infra, not client ops), verification (no native 2FA surface for client deal portals at this tier)

### Workflows

**Showing / inspection / appraisal scheduling**
Confirms and reminds for every in-person property visit so the client and any third party show up on time and prepared.
Sequence:
1. appointments:confirmation — "Showing confirmation" — sent when a showing, inspection, appraisal, or walkthrough is booked; states address and time
2. appointments:reminder-distant — "Showing reminder" — day-before reminder with reschedule link
3. appointments:reminder-proximate — "Showing reminder (same day)" — about an hour before, with access/parking note
4. appointments:reschedule-confirmation — "Showing rescheduled" — when the visit moves
5. appointments:cancellation-confirmation — "Showing cancelled" — when a visit is called off, with rebook link
Variable aliases:
- provider_name: "your agent Dana Reyes" (the agent or inspector, not a clinician)
- appointment_time: "Sat 6/21 at 2:00pm, 14 Oak St"

**No-show / missed visit recovery**
Re-books a client or party who missed a scheduled showing or inspection so the deadline isn't lost.
Sequence:
1. appointments:no-show-follow-up — "Missed showing follow-up" — sent after a missed visit, with rebook link
Variable aliases:
- provider_name: "your agent Dana Reyes"

**Closing appointment + final walkthrough**
Locks in the two highest-stakes scheduled events of the deal — the final walkthrough and the closing/signing appointment.
Sequence:
1. appointments:confirmation — "Closing appointment confirmed" — when the signing date/location is set
2. appointments:reminder-distant — "Closing reminder" — day before, restating location and what to bring (ID, certified funds)
3. appointments:reminder-proximate — "Closing today" — morning-of reminder
Variable aliases:
- appointment_time: "Tue 6/24 at 10:00am, First Title, 200 Main St"

**Transaction milestone updates (offer → under contract → clear to close)**
Tells the client the deal advanced to a new state the moment status changes in the pipeline, so they always know where they stand without calling.
Sequence:
1. GAP:offer-accepted — "Offer accepted" — sent when the seller accepts; states address and next step (inspection scheduled)
2. GAP:under-contract-status — "Transaction update" — sent on each milestone (inspection done, appraisal ordered, contingency cleared)
3. GAP:clear-to-close — "Clear to close" — sent when lender clears the file, pointing to the closing appointment
Variable aliases:
- (uses new variables defined in gaps below)

**Document / signature request**
Drives the client to sign or return a time-bound document before a contractual deadline lapses.
Sequence:
1. GAP:document-request — "Document needed" — names the document and the deadline, links to where to sign
2. GAP:document-reminder — "Signature reminder" — follow-up as the deadline approaches
3. appointments:post-appointment — STRETCH:appointments:post-appointment — repurposed as a "thanks, all signed" confirmation once the document is returned
Variable aliases:
- (uses new variables defined in gaps below)

**Stalled-client nudge**
Reaches a client who has gone quiet on a needed action (unsigned doc, unscheduled inspection) before it threatens the timeline.
Sequence:
1. customer-support:proactive-outreach — "We need something from you" — flags that an action is outstanding and invites a reply

**Deal-state confirmation (representation lifecycle)**
Confirms a structural change to the engagement itself — listing went live, listing agreement signed, or the deal closed/funded.
Sequence:
1. account-events:subscription-confirmed — STRETCH:account-events:subscription-confirmed — repurposed as a generic "your transaction status is updated, details in your portal" confirmation
2. GAP:deal-closed — "Closed and funded" — sent when the deal records/funds; a milestone the client wants

### Message gaps

**GAP:offer-accepted**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** "Offer accepted" (display alias)
- **Why:** the single most-anticipated state change in a deal; no corpus message frames an accepted offer + next step

**GAP:under-contract-status**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** "Transaction milestone update" (display alias)
- **Why:** milestone-by-milestone deal progress (inspection done, appraisal ordered, contingency cleared) has no order-updates equivalent that isn't shipping-shaped

**GAP:clear-to-close**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** "Clear to close" (display alias)
- **Why:** lender-clears-file is a real-estate-specific terminal milestone with no corpus analog

**GAP:deal-closed**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer
- **Proposed universal name:** "Closed and funded" (display alias)
- **Why:** a recorded/funded close is a vertical-specific terminal event distinct from any subscription/order lifecycle end

**GAP:document-request**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:document-request (or a new lightweight "action-needed" message)
- **Proposed universal name:** "Document needed"
- **Why:** "sign/return this by a deadline" is a generic action-needed pattern many verticals share and the corpus lacks
- **Draft variants:**
  - Standard: `{{workspace_name}}: Please sign {{document_name}} by {{due_date}} to stay on schedule: {{action_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: One thing to do - sign {{document_name}} by {{due_date}} here: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Sign {{document_name}} by {{due_date}}: {{action_link}} STOP to opt out.`
- **New variables:** `{{document_name}}` — name of the document to sign/return, budget ~24 chars, source: deal record, example: "the inspection addendum". `{{due_date}}` — deadline, budget ~16 chars, source: deal record, example: "Fri 5pm".

**GAP:document-reminder**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:document-reminder (pairs with document-request)
- **Proposed universal name:** "Signature reminder"
- **Why:** the deadline-approaching follow-up to an outstanding document is a distinct, widely-needed nudge
- **Draft variants:**
  - Standard: `{{workspace_name}}: Reminder - {{document_name}} still needs your signature by {{due_date}}: {{action_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: Quick nudge - {{document_name}} is still waiting for you, due {{due_date}}: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{document_name}} due {{due_date}}: {{action_link}} STOP to opt out.`
- **New variables:** reuses `{{document_name}}` and `{{due_date}}` from GAP:document-request.

**STRETCH:appointments:post-appointment**
- **Classification:** Stretch
- **Proposed corpus home:** appointments:post-appointment — fit gap: corpus body is a feedback-collection prompt ("how did it go, leave feedback"); the ops use here is a neutral "document received / step complete" confirmation, so the feedback framing has to be dropped
- **Proposed universal name:** "Post-appointment follow-up"
- **Why:** closest corpus message for a "that step is done" confirmation, but its feedback intent doesn't match a signature-received acknowledgment
- **Draft variants:**
  - Standard: `{{workspace_name}}: Got it - {{document_name}} is signed and we're on track for {{appointment_time}}. Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: All set - {{document_name}} came through. Thanks! Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{document_name}} signed. On track. STOP to opt out.`

**STRETCH:account-events:subscription-confirmed**
- **Classification:** Stretch
- **Proposed corpus home:** account-events:subscription-confirmed — fit gap: corpus body is about a billing/plan change ("your subscription change is confirmed"); reused here as a generic "your transaction status is updated, see the portal" confirmation, which keeps the state-change-confirmed shape but not the subscription wording
- **Proposed universal name:** "Status-change confirmation"
- **Why:** structurally a state-change-confirmed-with-link message, but the subscription/billing framing is wrong for a deal-status update
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your transaction status is updated. See the details in your portal: {{action_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: Your transaction just moved forward - details here whenever you like: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Transaction updated. Details: {{action_link}} STOP to opt out.`

### Content constraints
- Operations-only: this entry covers SMS to clients already under representation (showing/inspection/appraisal/closing scheduling, transaction milestones, document/signature requests, deal-state confirmations). Cold buyer/seller prospecting and referral blasts are the deferred lead-gen tier and are out of scope.
- No outcome guarantees in any body: never state or imply a sale price, "we'll get you top dollar," "this will sell fast," guaranteed approval, or any promised financial result.
- Fair Housing Act framing: bodies must never imply suitability or preference by protected class (race, color, national origin, religion, sex, familial status, disability). No "great neighborhood for families like yours," no steering language tying a property/area to who the client is. Keep bodies about the deal, the date, and the action — never about the person.
- These transaction/milestone/scheduling messages are transactional (TCR ACCOUNT_NOTIFICATION-class) and require express consent established when the client engaged the agent; they are not the EIN-gated marketing tier.
- Carry STOP/HELP in every body (no 2FA carve-out applies here). Respect 8am-8pm local quiet hours; some states (FL, OK, WA) impose stricter texting windows.
- No promotional content, listing pushes, or open-house blasts mixed into these operational threads — that crosses into the marketing/lead-gen tier.

### Disambiguation
The tipping factor from Clear to Conditional is the lead-gen boundary: the moment a body addresses someone who is not yet a represented client — a cold buyer, an open-house list, a "just sold near you, want a valuation?" blast — it becomes the deferred real-estate referral/lead-gen tier (high-abuse), not this ops entry. Property management is a separate entry: tenant, rent, lease, and maintenance messaging to renters is a different relationship and lifecycle. Mortgage and lending live in a heavier financial-regulatory bucket; an agent forwarding a financing milestone is fine, but anything that originates lending terms, rates, or approvals belongs there. A subtle trap: milestone updates look purely transactional, but a "milestone" message that drifts into "and when you're ready to buy again, call me" is a promotional/referral solicitation wearing an operational disguise — keep milestone bodies strictly to the active deal's state and next action.

### Sources
https://trackxi.com/save-time-with-transaction-management-software/
https://trackxi.com/real-estate-transaction-coordinator-software-must-have-features/
https://wiseagent.com/
https://monday.com/blog/crm-and-sales/real-estate-agent-crm-software/
https://theclose.com/real-estate-text-message-scripts/
https://www.eztexting.com/industries/real-estate
https://www.sendhub.com/real-estate-text-messaging-lead-capture-to-closing-deals/
https://sinch.com/engage/resources/sms-marketing/real-estate-sms-marketing/
https://blog.transactly.com/how-transaction-coordinators-support-real-estate-deals
https://resimpli.com/blog/real-estate-transaction-coordinator/
https://midastransactiongroup.com/how-transaction-coordinators-keep-escrow-and-title-on-track/
https://listedkit.com/real-estate-transaction-management-checklist/
https://emitrr.com/blog/real-estate-text-templates/
https://simpletexting.com/real-estate-text-message-marketing/scripts-templates/
https://www.cresinsurance.com/real-estate-electronic-client-communication/
https://textdrip.com/blog/sms-compliance-real-estate-agent
https://help.twilio.com/articles/4408675845019-SMS-Compliance-and-A2P-10DLC-in-the-US
https://mytcrplus.com/solutions/real-estate-messaging-compliance/
https://theclose.com/fair-housing-real-estate/
https://nationalfairhousing.org/responsibleadvertising/
https://bulletins.ncrec.gov/fair-housing-10/
