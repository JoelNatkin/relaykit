## Veterans services / military-family support
**Vertical:** Civic & public sector
**Bucket:** Not yet, maybe not ever
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.
**URL slug:** /for/veterans-services

### What this builder is making
Two shapes share this slug: a VSO or veteran-services nonprofit running case management — intake, benefit-claim assistance, service referrals, and appointments for veteran clients (the CaseWorthy/PlanStreet/Unite Us pattern) — and a military-family support nonprofit running programs, chapter events, and resource navigation for service-member and survivor families (the Blue Star Families pattern). Both track people (veterans, families, survivors), the services or claims attached to them, and a calendar of appointments or events. SMS sits on the touchpoints between a caseworker or program coordinator and the client: reminders, status nudges, document asks, and event notices.

### Why they need SMS
A veteran who misses a benefits appointment loses a scheduling slot and can stall a time-sensitive claim, which is exactly the no-show problem the VA's own VEText system was built to attack — it cut missed appointments by over 10% across 7M+ veterans. This population skips email and answers texts, and the consequence of a missed message (a lapsed document deadline, an unclaimed referral) lands on someone already navigating a hard transition. SMS wins because it is the channel that actually reaches a mobile-first, frequently-relocating audience at the moment a confirmation or document is due.

### Message categories
1. appointments — intake meetings, benefits counseling, and service appointments are the core no-show problem; full confirm/reminder/reschedule lifecycle applies directly.
2. community — military-family nonprofits run chapter events, program announcements, milestones, and a multi-step new-member onboarding; sender frame is the org's own name, which fits.
3. waitlist — limited-slot programs (counseling cohorts, employment workshops, transitional housing referrals) queue clients and open spots.
4. account-events — portal/account lifecycle for orgs that give veterans a client login (case portal access, suspended/locked access).
5. verification — phone-ownership proof when a veteran first registers for a client portal.
6. customer-support — help-desk style ticketing where an org runs a support queue, though most use a caseworker model instead.

Excluded: order-updates (no physical fulfillment), marketing (promotional/fundraising solicitation is a separate consent class and EIN-gated; fundraising appeals are out of scope here), team-alerts (internal staff ops, not the client-facing surface this slug describes).

### Workflows

**Client intake / welcome**
First touch after a veteran or family is enrolled with the org.
Sequence:
1. [verification:verification-code] — "Phone verification" — sent if the org gives the client a case-portal login; proves phone ownership at registration.
2. [community:welcome] — "Welcome" — confirms enrollment and that the org will reach out by text. (Sender frame is the org name via community_name.)
3. [community:resource-pointer] — "Getting-started guide" — points the client to an orientation or benefits-overview resource a few days in.
Variable aliases (only where default would feel wrong):
- community_name: "Hometown Vets Outreach"
- resource_link: "your benefits orientation guide"

**Appointment reminder cadence**
The core no-show-reduction loop for benefits counseling and service appointments.
Sequence:
1. [appointments:confirmation] — "Appointment confirmed" — sent when a counseling or service appointment is booked.
2. [appointments:reminder-distant] — "Day-before reminder" — the day prior, with a reschedule link.
3. [appointments:reminder-proximate] — "Hour-before reminder" — ~1 hour out.
4. [appointments:reschedule-confirmation] — "Rescheduled" — when the time changes.
5. [appointments:no-show-follow-up] — "Missed appointment" — re-offers a slot after a no-show.
Variable aliases (only where default would feel wrong):
- provider_name: "your caseworker" / "the benefits counselor"
- workspace_name: "Hometown Vets Outreach"

**Document request**
Caseworker needs a record (DD-214, service or medical evidence) to move a case forward. No corpus message covers a generic "we need a document from you" prompt that points to a secure upload — see Message gaps.
Sequence:
1. [GAP:document-request] — "Document needed" — caseworker asks the client to upload a required record via a secure link. → GAP
2. [appointments:post-appointment] — "After your visit" — repurposed only loosely if the ask follows a meeting; the real need is a standalone document prompt, so the GAP is the primary path.

**Claim / application status update**
Client is told their benefit claim or service application changed state. No corpus message frames a non-order, non-ticket "your application status changed — view details" update; the closest is a stretch on the support resolution message.
Sequence:
1. [STRETCH:customer-support:resolution-notification] — "Application update" — reframed from "ticket resolved" to "your application/claim status changed, view details in the portal." The fit gap is that a claim is not a support ticket and most updates are progress, not resolution. → STRETCH
2. [account-events:account-issue-resolved] — "Issue cleared" — only when the org fixed something on the client's account, not for routine status.

**Resource referral follow-up**
After a caseworker refers a client to another service (housing, employment, mental-health partner), the org checks that the connection landed — the Unite Us closed-loop pattern.
Sequence:
1. [community:resource-pointer] — "Referral details" — passes the client the referred service's info/link.
2. [community:week-1-check-in] — "Checking in" — repurposed as a "did the referral connect?" nudge a few days later. (Imperfect: it's onboarding-framed; a true referral check-in is the better long-term home.)
3. [appointments:confirmation] — "Referral appointment confirmed" — if the referral results in a booked appointment at the org.

**Event / program announcement**
Military-family nonprofit notifies members of chapter events and programs.
Sequence:
1. [community:event-invitation] — "New event" — announces an event with RSVP.
2. [community:live-event-reminder] — "Event starting soon" — shortly before it begins.
3. [community:community-announcement] — "Program news" — general program or chapter update.
4. [community:member-milestone] — "Milestone" — recognizes a member's time or participation milestone.

**Limited-slot program enrollment**
A cohort program or scarce service (counseling group, employment workshop) with a queue.
Sequence:
1. [waitlist:joined] — "You're on the list" — confirms the client is queued for the next opening.
2. [waitlist:position-update] — "Position update" — movement in the queue.
3. [waitlist:almost-up] — "Almost your turn" — opening is near.
4. [waitlist:your-turn] — "Spot open" — claim the slot.
5. [waitlist:grace-expiring] — "Spot expiring" — claim window closing.
6. [waitlist:missed] — "Spot expired" — rejoin path.

**Case closure**
The org closes a client's case and may invite feedback. No corpus message frames "your case is now closed."
Sequence:
1. [GAP:case-closed] — "Case closed" — notifies the client their case is closed and how to reopen or follow up. → GAP
2. [appointments:post-appointment] — "Feedback" — repurposed to collect feedback after closure (feedback_link reframed as a closure survey).

### Message gaps

**GAP:document-request**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:document-request (or a new lightweight "requests" category if more request-type messages emerge)
- **Proposed universal name:** Document requested
- **Why:** many service, civic, and professional workflows need a neutral "please upload a required document via this secure link" prompt that no current category provides.
- **Draft variants:**
  - Standard: `{{workspace_name}}: We need a document to continue your case. Upload it securely here: {{upload_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: To keep things moving, we need one document from you. Upload it here: {{upload_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Document needed. Upload: {{upload_link}} STOP to opt out.`
- **New variables:** upload_link ("your secure upload link")
- **Status:** FUTURE

**GAP:case-closed**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (case-closed display alias over a generic status notice); or account-events if a broader "lifecycle closed" message is ever generalized
- **Proposed universal name:** Case closed (display alias)
- **Why:** case-based service orgs need a respectful "your case is closed, here's how to reopen" notice that no order/ticket/account message frames correctly.
- **Status:** FUTURE

**STRETCH:customer-support:resolution-notification**
- **Classification:** Stretch
- **Proposed corpus home:** customer-support:resolution-notification reframed as an application/claim status update; long-term, a dedicated "application status changed" message is the cleaner home
- **Proposed universal name:** Application status update
- **Why:** a benefit claim or service application is not a support ticket and most updates are interim progress, not resolution, so the resolution framing only partially fits.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your application status has changed. View the details in your portal: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: There's an update on your application. See the details in your portal: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Application updated. Details: {{account_link}} STOP to opt out.`
- **Status:** FUTURE

### Content constraints
- Two TCR registration pathways are potentially in play and neither maps cleanly to RelayKit's standard sole-prop/EIN onboarding — this is the core deferral reason. Government-affiliated registrants use the government-entity path (company_type "government", business_type "Non-profit Corporation", industry NOT_FOR_PROFIT) and may use the Emergency special use case for public-safety alerts, with vetting that yields higher carrier throughput. Nonprofit registrants use the Charity/nonprofit path requiring proof of 501(c)(3) tax-exempt status, with EIN/legal-name verification against the IRS letter.
- Most of the highest-value SMS in this space (the VA's VEText, VA.gov claim-status texts) is sent by the government itself, not by the small independent orgs RelayKit serves — true addressable demand is thin and customer-pull dependent.
- Consent must be explicit and documented (opt-in language plus a record of the opt-in method) per TCR campaign registration; carriers block unregistered traffic outright.
- Sensitive-population handling: never put benefit-claim specifics, service-connected disability details, medical/PHI, or survivor-status details in the message body. Point the recipient to a secure portal or office. This is not a HIPAA-covered context the way a clinic is, but the population and data are sensitive enough to treat the body as public.
- Marketing/fundraising solicitation is a separate consent class (MARKETING use case, EIN-gated) and out of scope for the client-service messages described here.

### Disambiguation
This slug spans two operationally different shapes that happen to share an audience: VSO/case-management tooling that moves veterans through claims, referrals, and appointments, and military-family nonprofits that run events, programs, and community onboarding. It differs from healthcare (general practice): RelayKit declines HIPAA/PHI at intake (D-18), so any clinical or treatment-record messaging belongs there and is declined, not here — this sub-vertical's claim/benefit content stays out of the body precisely to avoid that line. It is adjacent to but distinct from legal-aid: a VSO assisting with a disability claim is benefit-navigation, not legal representation, though an accredited-attorney VSO would lean legal-aid. It is deferred not because the workflows are unfit — appointments and community map well — but because real SMS demand is dominated by government senders on government TCR pathways, and the independent-org demand RelayKit could serve is unproven; the bucket is customer-pull dependent and should move only when concrete inbound from a qualifying org appears.

### Sources
https://caseworthy.com/who-we-serve/veterans-services/
https://www.planstreet.com/veterans-services
https://vetpro.us/10-advantages-of-using-claims-software-for-vsos/
https://casemanagementhub.org/software-for-veterans-and-veteran-family-programs/
https://uniteus.com/blog/messaging/
https://uniteus.com/products/closed-loop-referral-system/
https://uniteus.com/products/care-coordination-services/
https://bluestarfam.org/
https://www.militaryfamiliesunited.org/
https://news.va.gov/71317/how-blue-star-families-is-strengthening-military-families/
https://www.va.gov/resources/vetext-for-va-health-care-reminders-and-updates/
https://news.va.gov/73455/are-you-getting-va-text-messages-health-care-updates-reminders/
https://www.performance.gov/cx/blog/VEText-success-story/
https://fedscoop.com/vas-new-text-message-appointment-reminder-system-reducing-no-shows/
https://www.va.gov/claim-or-appeal-status/
https://design.va.gov/content-style-guide/email-and-text-notifications
https://support.twilio.com/hc/en-us/articles/4405850570267-Nonprofit-and-Government-Guide-to-A2P-10DLC-Text-Messaging
https://www.twilio.com/docs/messaging/compliance/a2p-10dlc/onboarding-for-government-and-non-profit-agencies
https://www.fransis.ai/articles/10dlc-registration-guide-2026
https://www.10dlc.org/tcr_quick_reference_guide.pdf
https://learn.microsoft.com/en-us/azure/communication-services/concepts/sms/ten-digit-long-code-guidelines
