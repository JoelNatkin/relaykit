## Municipal utilities (water, power, gas)
**Vertical:** Civic & public sector
**Bucket:** Conditional
**URL slug:** /for/municipal-utilities

### What this builder is making
A customer-facing notification layer bolted onto a municipal water, electric, or gas utility's CIS/billing stack (CUSI, Tyler, Muni-Link, CIS Infinity, United Systems) that turns account events — bill generated, due date approaching, meter read anomaly, outage detected, planned maintenance scheduled — into outbound texts. The builder owns the integration that watches the system of record and the customer's notification preferences, not the metering or billing engine itself. The job is meter-to-cash and service-continuity communication: telling a ratepayer their bill is ready, their power is out and being restored, or their water needs boiling before they drink it.

### Why they need SMS
When a water main breaks or a boil-water advisory is issued, minutes matter and email sits unread — a text is opened within 15 minutes, which is the difference between a customer drinking contaminated water and not. On the billing side, a friendly pre-due-date nudge measurably lifts on-time payment and cuts the truck rolls and call-center volume that delinquency and "is my power back yet" inquiries generate. SMS wins because utility messages are time-critical, account-specific, and read in real time, where the alternative is a $150 truck roll or a missed shutoff that the utility itself does not want to happen.

### Message categories
1. account-events — primary: the bill-ready / payment-due / payment-confirmed billing lifecycle, framed as account notifications pointing to the payment portal (never a collections threat).
2. customer-support — service-status-alert is the spine of outage, restoration, planned-maintenance, and boil-water/safety communication; ticket lifecycle covers inbound service requests.
3. appointments — meter installs, service connects/disconnects, and field-tech visits are scheduled appointments with confirm/remind/reschedule needs.
4. verification — phone-ownership proof at enrollment in the notification program and step-up confirmation before account changes.
5. waitlist — narrow: new-service connection queues or solar/program enrollment backlogs.
Excluded: marketing (rebate/conservation promos are real but require separate marketing consent + EIN gating, out of the core transactional build; SHAFT-C and the no-scare rules make promotional framing risky here), community (no community-membership construct), team-alerts (internal crew dispatch is a separate operational build, not ratepayer-facing), order-updates (no physical fulfillment).

### Workflows

**Billing lifecycle**
The recurring bill-ready → due-soon → payment-confirmed cycle, always pointing the customer to the self-service portal rather than threatening service.
Sequence:
1. account-events:subscription-confirmed — "Bill ready" — STRETCH: sent when a new bill posts; tells the ratepayer their statement is available and links the portal. (See gap: bill-ready is a poor fit for the renewal-framed corpus copy.)
2. GAP:payment-due-reminder — "Payment reminder" — a few days before the due date, factual amount + due date + portal link, no threat language.
3. account-events:payment-failed — "Payment didn't go through" — sent when an autopay/card payment is declined; points to portal to update payment, reuses corpus copy cleanly.
4. GAP:payment-confirmed — "Payment received" — sent when a payment posts; reassurance that closes the loop and prevents duplicate payments.
Variable aliases (only where default would feel wrong):
- account_link: "your account portal"
- workspace_name: "City of Maple Grove Utilities"

**Outage & restoration**
Detection-to-restoration updates for unplanned service loss, the highest-value sequence in the vertical.
Sequence:
1. customer-support:service-status-alert — "Outage detected" — sent within 10-15 min of detection; acknowledges the outage and gives an ETA.
2. customer-support:service-status-alert — "Restoration update" — milestone updates (cause found, crew on site, revised ETA) reuse the same message with refreshed eta.
3. customer-support:account-issue-resolved — "Service restored" — sent when power/water/gas is back; no action needed.
Variable aliases (only where default would feel wrong):
- eta: "around 4:30 PM"

**Planned maintenance / service interruption**
Advance notice of scheduled work (line flushing, valve replacement, hydrant testing, planned outage) that will disrupt or discolor service.
Sequence:
1. customer-support:service-status-alert — "Planned interruption" — sent ~72 hours prior; describes the work, window, and expected impact.
2. customer-support:service-status-alert — "Work happening today" — morning-of reminder.
3. customer-support:account-issue-resolved — "Service back to normal" — sent when work completes.

**Safety / emergency advisory**
Boil-water advisories, gas-leak warnings, evacuation or PSPS guidance — the messages SMS exists for.
Sequence:
1. customer-support:service-status-alert — "Safety advisory" — issued immediately to affected service addresses with the specific protective action (boil water, evacuate, shut off gas).
2. customer-support:account-issue-resolved — "Advisory lifted" — sent when the advisory is rescinded.
Variable aliases (only where default would feel wrong):
- workspace_name: "Maple Grove Water"

**High-usage / leak alert**
Triggered when metering detects an unusual consumption spike that may indicate a leak or, for gas, a hazard.
Sequence:
1. customer-support:proactive-outreach — "Unusual usage" — STRETCH: notifies the ratepayer of a spike and invites a reply; corpus copy is friction-oriented ("hit a snag") rather than meter-anomaly framing.
Variable aliases (only where default would feel wrong):
- customer_name: "the account at 14 Oak St"

**Field service / meter appointment**
Scheduling for meter installs, exchanges, service connects/disconnects, and tech visits requiring access.
Sequence:
1. appointments:confirmation — "Visit confirmed" — when a meter/service appointment is booked.
2. appointments:reminder-distant — "Visit tomorrow" — day-before reminder.
3. appointments:reminder-proximate — "Tech arriving soon" — ~1 hour before the window.
4. appointments:no-show-follow-up — "We missed you" — when no one provided access; rebook.
Variable aliases (only where default would feel wrong):
- provider_name: "your service technician"

**New-service enrollment & verification**
Onboarding a customer to the account portal / notification program.
Sequence:
1. verification:verification-code — "Verify your number" — phone-ownership proof at enrollment.
2. account-events:new-device-sign-in — "New sign-in" — portal access from a new device.
3. verification:confirmation-code — "Confirm change" — step-up before a payment-method or account change.

### Message gaps

**STRETCH:account-events:subscription-confirmed**
- **Classification:** Stretch
- **Proposed corpus home:** account-events:subscription-confirmed — fit gap: corpus copy is renewal/plan-change framed ("Your subscription change is confirmed"), wrong for "your monthly utility bill is ready to view."
- **Proposed universal name:** Bill ready / statement available
- **Why:** a recurring statement-ready notice is the trigger of the billing lifecycle and has no clean corpus home.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your bill for account {{account_number}} is ready to view. See it in your account portal: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} bill for account {{account_number}} is ready. View it anytime in your portal: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Bill ready, account {{account_number}}. View: {{account_link}} STOP to opt out.`
- **New variables:** account_number

**GAP:payment-due-reminder**
- **Classification:** Vertical-specific (recurs across any biller, but no corpus message covers a pre-due-date balance nudge)
- **Proposed corpus home:** account-events:payment-due-reminder
- **Proposed universal name:** Payment due reminder
- **Why:** the core billing nudge; payment-failed covers a *declined* payment, not an upcoming due date.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your balance of {{amount_due}} is due {{due_date}}. Pay or view it in your account portal: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Heads up from {{workspace_name}}: {{amount_due}} is due {{due_date}}. View or pay in your portal: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{amount_due}} due {{due_date}}. Portal: {{account_link}} STOP to opt out.`
- **New variables:** amount_due, due_date

**GAP:payment-confirmed**
- **Classification:** Vertical-specific (universal-adjacent; biller payment receipt)
- **Proposed corpus home:** account-events:payment-confirmed
- **Proposed universal name:** Payment received
- **Why:** closes the billing loop and prevents duplicate payments; no corpus message confirms a received payment (refund-processed is order-scoped).
- **Draft variants:**
  - Standard: `{{workspace_name}}: We received your payment of {{amount_paid}} for account {{account_number}}. View it in your portal: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Thanks, {{workspace_name}} got your payment of {{amount_paid}} for account {{account_number}}. Details in your portal: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Payment of {{amount_paid}} received. Portal: {{account_link}} STOP to opt out.`
- **New variables:** amount_paid

**STRETCH:customer-support:proactive-outreach**
- **Classification:** Stretch
- **Proposed corpus home:** customer-support:proactive-outreach — fit gap: corpus copy is product-friction framed ("looks like you hit a snag"), not metering-anomaly framed.
- **Proposed universal name:** Unusual usage alert
- **Why:** a meter-detected consumption spike (possible leak/hazard) is a real proactive trigger with no metering-specific corpus copy.
- **Draft variants:**
  - Standard: `{{workspace_name}}: We noticed unusual usage on account {{account_number}}. Review it in your portal: {{account_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: usage on account {{account_number}} looks higher than normal, which can signal a leak. Check your portal: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: unusual usage, account {{account_number}}. Review: {{account_link}} STOP to opt out.`
- **New variables:** account_number

### Content constraints
- No scare tactics: never use urgency or fear framing to drive payment or action.
- No implied service-termination threat in any SMS body — do not state or imply disconnection, shutoff, or loss of service as a consequence of nonpayment.
- Point to the portal for payment: payment messages link to the self-service account portal; never request payment details, card numbers, or balances-paid-by-reply in the body.
- Treat any past-due/collections-adjacent message as FDCPA/Regulation F territory: factual only, no harassment, no false or misleading representation, send only 8am-9pm local time, and include a clear opt-out (STOP) in every body.
- Get explicit consent before texting an account; carriers (10DLC/TCR) will block and suspend campaigns on complaint, and TCPA exposure runs $500-$1,500 per message.
- Keep shutoff/disconnection *notices* out of SMS — those are statutorily regulated written notices; SMS may say "a balance is due, view your portal," never "service will be disconnected."
- No credentials, account passwords, or full account numbers beyond a reference identifier in the body.
- Safety advisories (boil-water, gas leak) carry a specific protective action, not just an alert.
- Marketing/conservation/rebate content is a separate marketing-consent campaign (EIN-gated), never folded into transactional billing or outage texts.

### Disambiguation
This sub-vertical is Conditional rather than Clear because the billing side sits one step from collections: a payment reminder is benign, but the moment copy implies "pay or lose service" it crosses into FDCPA/Regulation F and shutoff-notice territory, which RelayKit will not power as a threat channel. The tipping factor is framing — point-to-portal, factual, no-termination-language billing stays eligible; debt-pressure or disconnection-threat messaging does not. Standard 10DLC eligibility applies (industry-wide standard, not a special carrier prohibition), which is why the bucket reason is standard eligibility. Neighboring sub-verticals to keep distinct: debt collection (which is its own restricted Conditional/Not-yet posture and where the threat/collections framing is the whole product) and housing assistance / rental-arrears programs (same shutoff-pressure risk). A utility that only sends outage, safety, and pre-due-date portal nudges behaves like a Clear account-notification builder; the collections-adjacency is what holds it at Conditional.

### Sources
https://muni-link.com/products/utility-billing-software/
https://cusi.com/
https://www.tylertech.com/products/munis/utility-billing-cis
https://advancedutility.com/solutions/customer-information-systems/
https://united-systems.com/utility-management/
https://www.dialmycalls.com/blog/inform-utilities-customers-sms-text-message
https://www.text-em-all.com/blog/how-to-effectively-use-sms-for-utilities
https://www.tdworld.com/sponsored/article/55298910/the-power-of-a-single-text-message-how-sms-is-reshaping-utility-operations
https://www.clicksend.com/us/industries/utilities/
https://sinch.com/engage/industries/utilities/
https://www.consumerfinance.gov/rules-policy/regulations/1006/6/
https://www.consumerfinance.gov/compliance/compliance-resources/other-applicable-requirements/debt-collection/debt-collection-rule-faqs/
https://www.10dlc.org/en/TCPA
https://www.infobip.com/blog/tcpa-compliance-sms
