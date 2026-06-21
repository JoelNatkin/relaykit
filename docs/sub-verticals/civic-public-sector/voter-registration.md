## Voter registration / civic engagement (nonpartisan)
**Vertical:** Civic & public sector
**Bucket:** Not yet, maybe not ever
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.
**URL slug:** /for/voter-registration

### What this builder is making
A nonpartisan civic-engagement tool — a TurboVote-for-X — that helps eligible people register to vote, check their registration status, request and return mail ballots, and find their polling place, with reminders timed to each jurisdiction's deadlines. It tracks a registrant's address, registration status, and upcoming-election calendar so it can surface localized, action-tied prompts at exactly the moment something is due. It favors or opposes no candidate, party, or ballot measure; its only job is helping someone complete the mechanics of voting.

### Why they need SMS
Civic deadlines are hard cutoffs that arrive once and don't move — a registration deadline, a vote-by-mail request deadline, a postmark date, or election day itself — and an email buried in a promotions tab the day before is a missed vote. The consequence of a missed message is not a missed sale but a registrant who is disenfranchised for an entire election cycle. SMS wins because the action moments are short, time-boxed, and location-specific (your polling place, your ballot's postmark date), and a phone in hand is the only channel that reliably reaches someone the morning a deadline lands.

### Message categories
1. **account-events** — registration-status confirmations and changes are lifecycle/account-state events, the closest corpus home for "you're registered" / "your registration needs attention." Fit is imperfect (see gaps).
2. **appointments** — election day and ballot deadlines behave like a dated appointment with distant + proximate reminder cadence; the reminder structure maps cleanly even though the "appointment" is civic.
3. **community** — civic-event announcements (registration drives, candidate-forum dates that are informational only) map to community announcement/event patterns when an org runs an audience.
4. **verification** — phone-ownership proof at signup for the reminder service; standard 2FA carve-out.
5. **waitlist** — weak/occasional fit for "we'll notify you when your jurisdiction's ballot info is ready"; mostly excluded.

Excluded: order-updates (no physical fulfillment — though mail-ballot tracking superficially resembles it, see STRETCH), marketing (any promotional or persuasion content is disqualifying here — advocacy is out of scope and SHAFT/political content rules bite hardest), customer-support (a thin ticketing layer is possible but not core), team-alerts (internal ops, not voter-facing).

### Workflows

**Registration confirmation**
Confirms to a registrant that their registration was submitted or that their status was checked, with no action implied beyond awareness.
Sequence:
1. [account-events:subscription-confirmed] — "Registration submitted" — STRETCH; on submission of a registration form, confirm it went through and point to status. Reframes a billing-subscription confirmation into a civic-status confirmation.
2. GAP:registration-status-confirmed — "Your registration status" — after a status check, report registered / needs-attention with a link to fix.

**Voter-registration deadline reminder**
Reminds an unregistered or lapsed registrant that their jurisdiction's registration deadline is approaching.
Sequence:
1. GAP:civic-deadline-distant — "Registration deadline approaching" — a week-plus out, name the deadline date and the action (register / update address).
2. GAP:civic-deadline-proximate — "Registration deadline tomorrow" — final-window nudge the day before the cutoff with the registration link.
Variable aliases (only where default would feel wrong):
- deadline_date: "Oct 7"
- action_link: "your registration link"

**Election-day reminder cadence**
A dated-event reminder sequence treating election day like an appointment.
Sequence:
1. [appointments:reminder-distant] — "Election is in N days" — the day/days before, with a link to polling-place / ballot info.
2. [appointments:reminder-proximate] — "Polls open today" — election-day morning, polling place and hours.
Variable aliases (only where default would feel wrong):
- appointment_time: "Tue Nov 5, polls 7am–8pm"
- provider_name: not used (no provider) — STRETCH, the appointment frame assumes a provider; election-day reminders have none.

**Polling-place / ballot info delivery**
Delivers the registrant's localized polling place or sample-ballot pointer when ready.
Sequence:
1. GAP:polling-place-info — "Your polling place" — on request or when assigned, the location, hours, and what to bring (factual, no candidate content).

**Vote-by-mail reminder sequence**
Tracks a mail ballot through request, receipt, and return against jurisdiction deadlines — not election day.
Sequence:
1. GAP:mail-ballot-request-reminder — "Request your mail ballot" — ahead of the request deadline, with the request link.
2. GAP:mail-ballot-return-reminder — "Return your ballot" — ahead of the postmark/drop-off deadline, with return instructions.
Variable aliases (only where default would feel wrong):
- deadline_date: "postmarked by Oct 29"

**Civic-event announcement (org-run)**
For an org running a registrant audience: informational announcements of nonpartisan events (registration drives, official candidate forums) — strictly no advocacy.
Sequence:
1. [community:community-announcement] — "Civic update" — informational announcement with a link.
2. [community:event-invitation] — "Registration drive" — invite to a nonpartisan civic event with RSVP.

**Reminder-service signup verification**
Phone-ownership proof when a registrant opts into SMS reminders.
Sequence:
1. [verification:verification-code] — "Verification code" — standard one-time code at opt-in.

### Message gaps

**STRETCH:account-events:subscription-confirmed**
- **Classification:** Stretch
- **Proposed corpus home:** account-events:subscription-confirmed (reframed) — or a new account-events:status-confirmed if civic/status confirmations recur across verticals
- **Proposed universal name:** Status confirmed
- **Why:** a registration confirmation is a status-state confirmation, not a billing-subscription event; the body's "subscription change" framing is wrong for civic use.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your registration was submitted. Check your status here: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} registration is submitted. See your status anytime: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Registration submitted. Status: {{account_link}} STOP to opt out.`
- **Status:** FUTURE

**GAP:registration-status-confirmed**
- **Classification:** Vertical-specific
- **Proposed corpus home:** account-events:registration-status-confirmed; or sub-vertical registry layer
- **Proposed universal name:** Registration status
- **Why:** reporting registered / needs-attention after a status check has no corpus equivalent.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your voter registration is {{registration_status}}. Details and next steps: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} check is done — registration is {{registration_status}}. Details here: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Registration {{registration_status}}. {{account_link}} STOP to opt out.`
- **New variables:** registration_status ("active", "needs an update")
- **Status:** FUTURE

**GAP:civic-deadline-distant**
- **Classification:** Universal miss
- **Proposed corpus home:** appointments:reminder-distant covers dated reminders, but a non-appointment deadline (registration cutoff) is a recurring civic/admin pattern; propose appointments:deadline-distant
- **Proposed universal name:** Deadline approaching
- **Why:** a registration deadline is a hard cutoff with no "appointment" or provider, and the existing distant reminder assumes a booking.
- **Draft variants:**
  - Standard: `{{workspace_name}}: The voter registration deadline is {{deadline_date}}. Register or update here: {{action_link}} Reply STOP to opt out.`
  - Friendly: `Heads up from {{workspace_name}}: registration closes {{deadline_date}}. Get it done here: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Registration deadline {{deadline_date}}. {{action_link}} STOP to opt out.`
- **New variables:** deadline_date ("Oct 7")
- **Status:** FUTURE

**GAP:civic-deadline-proximate**
- **Classification:** Universal miss
- **Proposed corpus home:** appointments:deadline-proximate (companion to the distant gap above)
- **Proposed universal name:** Deadline tomorrow
- **Why:** the final-window nudge for a hard civic cutoff has no provider-free corpus equivalent.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Last day to register to vote is tomorrow, {{deadline_date}}. Finish here: {{action_link}} Reply STOP to opt out.`
  - Friendly: `Final reminder from {{workspace_name}}: registration closes tomorrow, {{deadline_date}}. Do it now: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Register by tomorrow {{deadline_date}}. {{action_link}} STOP to opt out.`
- **New variables:** deadline_date ("Oct 7")
- **Status:** FUTURE

**STRETCH:appointments:reminder-proximate**
- **Classification:** Stretch
- **Proposed corpus home:** appointments:reminder-proximate (reframed for election day) — or a dedicated polls-open variant
- **Proposed universal name:** Polls open today
- **Why:** the proximate reminder assumes a provider and a personal slot; election day is a fixed public event with hours and a polling place instead.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Polls are open today, {{poll_hours}}. Your polling place: {{action_link}} Reply STOP to opt out.`
  - Friendly: `It's election day! Polls are open {{poll_hours}}. Find your spot: {{action_link}} Reply STOP to opt out. - {{workspace_name}}`
  - Brief: `{{workspace_name}}: Polls open today {{poll_hours}}. {{action_link}} STOP to opt out.`
- **New variables:** poll_hours ("7am–8pm")
- **Status:** FUTURE

**GAP:polling-place-info**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer; or appointments:location-info
- **Proposed universal name:** Polling place
- **Why:** delivering a registrant's assigned polling location, hours, and ID requirements has no corpus equivalent.
- **Status:** FUTURE

**GAP:mail-ballot-request-reminder**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (mail-ballot lifecycle)
- **Proposed universal name:** Request your ballot
- **Why:** the vote-by-mail request deadline is a distinct civic cutoff; order-updates resembles fulfillment but carries cross-sell/commerce framing that is wrong here.
- **Status:** FUTURE

**GAP:mail-ballot-return-reminder**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (mail-ballot lifecycle)
- **Proposed universal name:** Return your ballot
- **Why:** the postmark/drop-off deadline reminder has no corpus equivalent and is the highest-consequence civic moment.
- **Status:** FUTURE

### Content constraints
- Civic/voter SMS falls under a TCR Political/Special use case and draws heightened carrier scrutiny even when strictly nonpartisan — carriers treat the entire political/civic category as elevated risk and filter aggressively.
- Content must be strictly nonpartisan and factual: no candidate or party advocacy, no ballot-measure persuasion, no "vote for" framing — only the mechanics of registering, deadlines, polling places, and ballot return.
- Even 501(c)(3) nonpartisan voter-registration and GOTV activity is permitted only if it favors or opposes no candidate; advocacy content is disqualifying and risks both carrier blocking and the org's tax status.
- Political committees, PACs, and 527s must verify through Campaign Verify before TCR brand approval; nonpartisan nonprofits generally register under the Special/charity use case, but both sit in the elevated-scrutiny lane with higher filtering risk and slower review.
- Unregistered or misclassified civic traffic is treated as spam-level risk and heavily filtered or blocked outright — meaning deadline reminders may simply not deliver.
- Explicit prior consent is required to text reminders; opt-in must be unambiguous and STOP honored in every body except the 2FA verification carve-out.

### Disambiguation
The hard line is advocacy: nonpartisan civic engagement helps a person complete the mechanics of voting (register, find polls, return a ballot) and favors no candidate or party, while a partisan campaign exists to persuade — "vote for," "donate," "join the movement." Partisan political organizing is a separate row entirely, carries Campaign Verify identity requirements, and must never be conflated with this one. Even purely nonpartisan voter services are deferred because TCR classifies the whole political/civic category as a Special use case with heightened carrier scrutiny, aggressive filtering, and slower brand review — the elevated-risk lane applies regardless of intent. What would tip this toward Clear or Conditional: a settled, documented path for nonpartisan-only Special-use-case registration with predictable carrier acceptance, plus product guardrails that make advocacy content structurally impossible to send. Until that exists, the deliverability and classification risk is too high to serve indie builders responsibly.

### Sources
https://www.democracy.works/turbovote
https://en.wikipedia.org/wiki/TurboVote
https://partners.turbovote.org/
https://support.turbovote.org/hc/en-us/articles/18108605469844-Election-Reminders
https://www.vote.org/election-reminders/
https://reminders.vote.org/
https://support.ballotready.org/ballotready-communication-overview
https://www.rockthevote.org/how-to-vote/get-election-reminders/
http://civitech.io/voter-registration-suite/
https://www.nonprofitvote.org/can-nonprofits-register-voters/
https://help.clicksend.com/en/articles/46589-political-sms-messaging-on-tfn-10dlc
https://signalwire.com/blogs/industry/registering-your-political-sms-campaign-through-tcr
https://www.campaignverify.org/10dlc
https://www.impactive.io/blog/10dlc-for-political-campaigns-and-orgs
https://www.campaignregistry.com/wp-content/uploads/TCR-Intro_V4-2.pdf
