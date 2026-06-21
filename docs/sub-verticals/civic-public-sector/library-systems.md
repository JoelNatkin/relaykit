## Library systems / civic information services

**Vertical:** Civic & public sector
**Bucket:** Clear
**URL slug:** /for/library-systems

### What this builder is making
An integrated library system (ILS) or a patron-notification layer bolted onto one — the software a public, academic, or special library runs to manage circulation: checkouts, holds, due dates, renewals, fines, card accounts, and program/event registration. Day to day it tracks who has what, what is overdue, which holds have arrived on the pickup shelf, and which library cards are about to expire, firing notices when each event occurs (Koha, Sierra, Apollo, Surpass, plus notification middleware like TextaLibrarian, MessageBee, and Patron Point). The builder here is either the ILS vendor itself or an indie/open-source developer wiring patron-facing text alerts onto circulation events.

### Why they need SMS
The single highest-value moment is "your hold is ready" — a patron requested a title weeks ago, it has finally landed on the pickup shelf, and the library holds it only a few days before reshelving it for the next person; an unread email means a missed pickup and a wasted reservation. Courtesy "due soon" and overdue texts directly prevent fines and lost-item charges, and SMS read rates near-universally beat the email and robocall channels libraries have leaned on. Patrons rarely log into a library account proactively, so a pushed text is the only reliable way to reach them before a deadline lapses.

### Message categories
1. waitlist — the hold queue IS a waitlist: patrons reserve a title, move up the queue, get notified when it is their turn, and lose the spot if not claimed in the grace window. Maps the core ILS hold lifecycle almost exactly.
2. appointments — courtesy/due-soon, overdue, and pickup-deadline reminders all follow the date-anchored reminder pattern; this carries the circulation-deadline workflows.
3. account-events — library card account lifecycle: card expiring, account suspended (blocked for unpaid fines), new-device sign-in for the patron portal.
4. community — library program/event lifecycle (story time, author talks, workshops): invitation, reminder, announcement, cancellation.
5. verification — patron portal sign-in and account-recovery codes.

Excluded: order-updates (nothing ships; physical-item movement is the hold/pickup flow, covered by waitlist), customer-support (libraries field reference questions but not a ticketed support queue in scope here), team-alerts (staff-facing, not patron communication), marketing (libraries are civic/nonprofit and these are transactional service notices; any promotional library-news blast would be a separate EIN-gated marketing registration, not core).

### Workflows

**Hold lifecycle (request to pickup)**
A patron reserves a checked-out or transferred title, waits in the queue, and is alerted the moment it lands on the pickup shelf.
Sequence:
1. waitlist:joined — "Hold placed" — sent when the patron places a hold on a title that is unavailable
2. waitlist:position-update — "Hold queue update" — sent as the patron advances in the holds queue
3. waitlist:almost-up — "Hold almost ready" — sent when the patron is near the front and a copy is about to free up
4. waitlist:your-turn — "Hold ready for pickup" — sent when the item is on the pickup shelf, with the branch/pickup location
5. waitlist:grace-expiring — "Pickup deadline approaching" — sent ~3 days before the hold expires and is reshelved (SPL/Sierra send this 3 days out)
6. waitlist:missed — "Hold expired" — sent when the pickup window lapses and the hold is cancelled
Variable aliases (only where default would feel wrong):
- queue_position: "3rd in line"
- wait_estimate: "about a week"
- claim_link: "your pickup branch and deadline"
- grace_window: "3 days"
- rejoin_link: "place the hold again"

**Circulation deadlines (due / overdue)**
Date-anchored reminders that keep checked-out items returning on time and surface overdues before charges mount.
Sequence:
1. appointments:reminder-distant — "Due soon (courtesy notice)" — sent a few days before items are due; the patron can renew (Koha/Sierra send up to 3 staged overdue triggers; libraries report courtesy notices 3 days prior are well received)
2. appointments:reminder-proximate — "Due tomorrow" — sent the day before due date
3. appointments:no-show-follow-up — "Item overdue" — sent after the due date passes, prompting return or renewal — STRETCH:appointments:no-show-follow-up (an overdue item is not a missed appointment; the reframe is "we missed your return")
Variable aliases:
- appointment_time: "due Fri, Jun 26"
- provider_name: (omit — no provider in a library due notice; see gap below)
- reschedule_link: "renew your items"

**Library card / account lifecycle**
The patron's borrowing privileges depend on an active, unblocked card account.
Sequence:
1. account-events:trial-ending — "Card expiring" — sent a few days before the library card registration lapses, prompting renewal (mapped onto the expiry-warning shape) — STRETCH:account-events:trial-ending (a card expiry is not a trial end, but the "expires in N days, act to keep access" structure fits)
2. account-events:account-suspended — "Borrowing blocked" — sent when the account is blocked (unpaid fines over threshold, lost-item charge), with next steps
3. account-events:new-device-sign-in — "New sign-in" — sent on patron-portal access from a new device
Variable aliases:
- days_remaining: "30 days"
- account_link: "renew your card"

**Fines & fees**
A standalone "you owe fines" notice, distinct from the suspension block.
Sequence:
1. GAP:fines-owed — "Fines on your account" — sent when fines or fees accrue, prompting payment before the account is blocked
(No clean corpus fit; see Message gaps.)

**Library program / event lifecycle**
Libraries run registered programs (story time, author talks, computer classes, maker workshops) with limited seats.
Sequence:
1. community:event-invitation — "Program announced" — sent when a new program opens for registration, with RSVP
2. community:live-event-reminder — "Program reminder" — sent shortly before the program begins, with room/branch
3. community:moderation-update / community:community-announcement — "Program change" — sent if the program is rescheduled or has news
4. GAP:event-registration-confirmed — "You're registered" — sent when a patron successfully registers for a seat-limited program
5. GAP:event-cancelled — "Program cancelled" — sent when a scheduled program is cancelled
Variable aliases:
- community_name: "Springfield Public Library"
- event_name: "Saturday Story Time"
- event_time: "Sat 10am, Children's Room"

**Patron portal authentication**
Sign-in and recovery for the patron's online account.
Sequence:
1. verification:login-code — "Sign-in code" — sent as a second factor when a patron logs into their account
2. verification:recovery-code — "Recovery code" — sent when a patron recovers a locked account
Variable aliases:
- business_name: "Springfield Public Library"

### Message gaps

**STRETCH:appointments:no-show-follow-up**
- **Classification:** Stretch
- **Proposed corpus home:** appointments:no-show-follow-up reused as the overdue notice; fit gap is the "we missed you" framing, which reads oddly for a returned-late item
- **Proposed universal name:** Overdue / past-due reminder
- **Why:** overdue notices are the most-sent library text and the corpus has no past-due-obligation message outside the appointment frame
- **Draft variants:**
  - Standard: `{{workspace_name}}: {{item_count}} item(s) are overdue. Return or renew to avoid charges: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Heads up from {{workspace_name}}: {{item_count}} item(s) are past due. Renew or return here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{item_count}} item(s) overdue. Renew/return: {{account_link}} STOP to opt out.`
- **New variables:** item_count ("2 books")

**STRETCH:account-events:trial-ending**
- **Classification:** Stretch
- **Proposed corpus home:** account-events:trial-ending reused as the card-expiry warning; fit gap is "trial" wording, irrelevant to a free civic card
- **Proposed universal name:** Membership / access expiring
- **Why:** library cards expire on a registration cycle and need a renewal nudge; the "expires in N days, act to keep access" shape is identical
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your library card expires in {{days_remaining}} days. Renew to keep borrowing: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} library card expires in {{days_remaining}} days. Renew here to keep borrowing: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Card expires in {{days_remaining}} days. Renew: {{account_link}} STOP to opt out.`

**GAP:fines-owed**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (a library-specific fines notice; close to but distinct from account-suspended, which is the block, not the balance)
- **Proposed universal name:** Balance / fees due
- **Why:** libraries text fine balances as a routine notice well before any account block; no corpus message states an outstanding-balance amount without a transaction (order/refund) context
- **Draft variants:**
  - Standard: `{{workspace_name}}: You have {{balance_due}} in fines on your account. Pay or ask staff: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Heads up from {{workspace_name}}: there's {{balance_due}} owed on your account. Details here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{balance_due}} in fines owed. {{account_link}} STOP to opt out.`
- **New variables:** balance_due ("$3.50")

**GAP:event-registration-confirmed**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (community category lacks a registration-confirmation step; existing community:event-invitation is the announce, not the confirm)
- **Proposed universal name:** Registration confirmed
- **Why:** seat-limited library programs confirm a held spot, which community:event-invitation (RSVP prompt) does not cover
- **Draft variants:** (vertical-specific — skip)

**GAP:event-cancelled**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (community category has no event-cancellation message; moderation-update/community-announcement are generic)
- **Proposed universal name:** Event cancelled
- **Why:** a cancelled program needs an unambiguous "it's off" notice, not a generic "update" pointer
- **Draft variants:** (vertical-specific — skip)

### Content constraints
- Standard carrier rules apply. No vertical-specific content restrictions on the message bodies.
- Government and 501(c)(3) library operators register via TCR with entity type "Government" or "Charity" (the latter requires proof of tax-exempt status); transactional patron notices are not marketing and do not need the marketing registration.
- Keep all patron notices transactional — hold/due/fine/event service messages. Any "library news" promotional blast is a separate EIN-gated marketing registration (D-15 / D-37 / D-89 logic), not part of the core notice set.
- No PII beyond what the notice requires; title names in hold/overdue texts are common but optional (some libraries omit titles for patron privacy).

### Disambiguation
This sub-vertical is the patron-facing transactional notice layer of a library, not a generic event/RSVP product or a retail order tracker. The hold lifecycle looks like e-commerce shipping but maps to waitlist, not order-updates: nothing is shipped to the patron — an item moves to a pickup shelf and lapses if unclaimed, which is queue-and-claim behavior. Library programs resemble the marketing event flow but are civic community notices to opted-in patrons, not promotional sends. If a builder's product is staff scheduling, branch operations, or internal incident alerting, that is team-alerts, not this entry.

### Sources
http://www.textalibrarian.com/ils-integration.php
https://www.springshare.com/patronpoint/notices
https://www.urbanlibraries.org/innovations/patron-notifications-by-text-message
https://iii.com/whats-new/sierra-6-3-revolutionizing-library-operations-with-enhanced-security-and-advanced-sms-integrations/
https://www.oplin.ohio.gov/sms
https://www.biblionix.com/apollo-ils-only-for-public-libraries/apollo/
https://uniquelibrary.com/real-life-notifications-from-messagebee/
http://manual.koha-community.org/3.2/en/noticetriggers.html
https://wiki.koha-community.org/wiki/Notifications_and_OPAC_messaging
https://koha-community.org/manual/latest/en/html/tools.html
https://www.spl.org/using-the-library/manage-your-account/notifications
https://completesms.com/industries/libraries/
https://rvalibrary.org/services/sms-notifications/
https://boulderlibrary.org/card/text-message-notifications/
https://tivertonlibrary.org/get-texts-from-the-library/
https://www.sandiego.gov/public-library/services/lending/notifications
https://indypl.org/about-the-library/account-notices
https://callhub.io/blog/compliance/10dlc-2025-registration-callhub/
