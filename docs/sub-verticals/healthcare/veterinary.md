## Veterinary clinics & pet health
**Vertical:** Healthcare
**Bucket:** Conditional
**URL slug:** /for/veterinary

### What this builder is making
Veterinary practice-management and client-communication software (PetDesk/Shepherd/Vetstoria/IDEXX-Vello/Provet-class): online appointment booking, vaccine and wellness-visit reminders, pet-owner (client) communication, billing, and prescription-refill prompts driven off patient records filtered by age, breed, and due-date. The pet owner is the recipient; the patient is the animal, so messages reference "your pet" and a portal rather than clinical detail. Not HIPAA-covered (animals aren't protected persons), but medication and dosage detail still warrants liability hygiene.

### Why they need SMS
A vaccine or booster comes due, a wellness visit lapses, or a filled prescription is ready for pickup — and email sits unread while the protection window or refill quietly expires. A no-show burns a clinical slot the practice can't refill same-day, and a missed booster restarts a vaccine series. Pet owners reliably read texts and tap a confirm/reschedule link, which is why no-show rates drop sharply on SMS reminders.

### Message categories
1. appointments — confirmations, reminders, reschedules, no-show follow-ups, and post-visit feedback are the core no-show-reduction loop
2. order-updates — repurposed for Rx-refill-ready and pickup status, the transactional "your thing is ready" pattern
3. account-events — wellness/vaccine-due reminders ride the lifecycle-alert frame (GAP below); billing/balance notices
4. customer-support — two-way texting and post-procedure check-ins where owners reply with recovery questions
5. verification — phone-ownership proof when an owner sets up a client-portal account
Excluded: community (no member/community construct), team-alerts (internal ops, not pet-owner-facing), waitlist (vet booking is slot-based, not queued), marketing (separate EIN-gated consent — promotional vet offers belong there, never mixed into reminders)

### Workflows

**Appointment lifecycle**
Keep booked clinical slots filled and recover the misses.
Sequence:
1. appointments:confirmation — "Visit booked" — sent when the owner books online or the front desk schedules
2. appointments:reminder-distant — "Visit tomorrow" — day before the appointment, with reschedule link
3. appointments:reminder-proximate — "Visit soon" — ~1 hour before, final nudge
4. appointments:reschedule-confirmation — "Visit moved" — when the owner reschedules
5. appointments:cancellation-confirmation — "Visit cancelled" — on cancellation, with rebook link
6. appointments:no-show-follow-up — "We missed you" — after a missed slot, prompt to rebook
7. appointments:post-appointment — "How was your visit" — after the visit, feedback request
Variable aliases (only where default feels wrong):
- provider_name: "Dr. Reyes"
- appointment_time: "Thu Jun 25, 2:30pm"

**Post-procedure recovery check-in**
Check on a pet after surgery or a sedated procedure and open a reply channel.
Sequence:
1. customer-support:proactive-outreach — "Recovery check-in" — 24h post-op, invites the owner to reply with concerns
2. customer-support:agent-response — "Reply from the clinic" — when a staff member responds in the two-way thread
Variable aliases (only where default feels wrong):
- customer_name: "Sam" (the owner, not the pet)

**Prescription refill ready**
Tell the owner a refill is filled and ready, without naming the drug.
Sequence:
1. order-updates:order-confirmed — "Refill request received" — when the owner requests a refill via portal
2. order-updates:order-processing — "Refill being prepared" — when the pharmacy/clinic starts filling it
3. order-updates:out-for-delivery — "Refill ready" — when ready for pickup or out for delivery
Variable aliases (only where default feels wrong):
- order_number: "Rx #4471"
- estimated_delivery: "today after 3pm"

**Wellness & vaccine due**
Pull lapsing pets back in before a protection or screening window closes.
Sequence:
1. account-events:trial-ending — "Vaccine due soon" — repurposed lifecycle alert; fires when a vaccine/wellness item nears its due date (STRETCH — see gaps)
Variable aliases (only where default feels wrong):
- days_remaining: "14"
- account_link: portal link to the pet's care plan

### Message gaps

**GAP:vaccine-wellness-due-reminder**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (a "service/care due" reminder keyed to a due-date, distinct from a confirmed booking)
- **Proposed universal name:** "Service due reminder" — display alias "Vaccine/wellness due"
- **Why:** the core vet retention message is a recurring-care-due nudge with no appointment yet booked; appointments covers booked visits and account-events covers account lifecycle, but neither cleanly carries "a recurring service is now due, book one"

**STRETCH:account-events:trial-ending**
- **Classification:** Stretch
- **Proposed corpus home:** account-events:trial-ending as the carrier frame; fit gap is that "trial ending in N days" semantics don't natively express "your pet's booster is due in N days"
- **Proposed universal name:** "Service due reminder" (display alias "Vaccine/wellness due")
- **Why:** the countdown-to-a-deadline shape fits, but the trial framing is wrong for a care-due reminder and reads oddly to a pet owner
- **Draft variants:**
  - Standard: `{{workspace_name}}: {{pet_name}}'s {{service_due}} is due in {{days_remaining}} days. Book a visit: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{pet_name}} is due for {{service_due}} in {{days_remaining}} days. Book here when you're ready: {{account_link}} Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: {{pet_name}} due for {{service_due}} in {{days_remaining}}d. {{account_link}} STOP to opt out.`
- **New variables:** pet_name ("Bella"), service_due ("rabies booster"), days_remaining (reused from account-events)

### Content constraints
- Not HIPAA-covered (animal health), but keep medication and dosage detail out of the SMS body for liability hygiene — refill prompts reference "your pet's prescription" / "Rx ready" plus a portal link, never drug names, strengths, or doses
- Reminders, confirmations, refill-ready, and wellness-due are transactional/informational — require prior express consent (oral or written) from the pet owner at intake or booking; do not fold promotional content into them
- Any promotional vet content (new-service launch, seasonal offer, retail discount) is MARKETING-category, EIN-gated, and needs separate prior express written consent — never sent on the transactional consent
- Identify the practice in every body; include "Reply STOP to opt out." on all transactional messages
- Standard carrier care on financial/balance messages (billing, copay-due) — factual, portal link, no pressure language
- The recipient is the human owner; address the owner, reference the pet by name where personalization helps

### Disambiguation
This entry is the veterinary medical practice — a clinical-visit, vaccine-series, and prescription-refill cadence tied to an animal's medical record, which is what makes it Conditional rather than Clear. It is distinct from pet services (grooming, dog walking, boarding, daycare), which are appointment-led local-services businesses with no clinical record, no vaccine schedule, and no prescriptions — those are cleaner and fit the standard appointments pattern without medication caveats. Vet is not HIPAA-covered because patients are animals, so a developer reasonably assumes the body can carry anything; the avoidable liability is putting drug names and doses in the message text, where a wrong or misread medication detail in an SMS creates clinical-liability exposure with no upside. The fix is mechanical — reference the prescription and a portal, not the pharmacology — which is why this is Conditional (one light rule) and not Clear.

### Sources
https://petdesk.com/
https://www.shepherd.vet/clinical-tools/client-communication/
https://software.idexx.com/resources/blog/5-ways-to-use-client-communication-automation-in-veterinary-practice
https://software.idexx.com/vello
https://covetrus.com/covetrus-platform/client-engagement-tools/covetrus-comms/
https://www.provet.com/blog/how-to-manage-your-veterinary-reminder-system
https://www.getapp.com/industries-software/veterinary/f/sms-reminders/
https://activeprospect.com/blog/tcpa-text-messages/
