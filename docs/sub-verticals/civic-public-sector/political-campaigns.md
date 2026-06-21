## Political campaigns / partisan organizing (single-campaign ops)
**Vertical:** Civic & public sector
**Bucket:** Not yet, maybe not ever
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.
**URL slug:** /for/political-campaigns

### What this builder is making
A single partisan campaign — a candidate's run, a party committee, or a ballot-measure committee — running its own voter-contact and field operation, typically on a campaign CRM stack like NGP VAN / VoteBuilder with a peer-to-peer texting layer (GetThru/ThruText, Hustle, Scale to Win) bolted on. The work splits cleanly into two halves: outbound advocacy (persuasion, GOTV, fundraising appeals) aimed at voters, and internal field ops (recruiting volunteers, scheduling canvass/phone-bank shifts, driving turnout to campaign events). RelayKit's transactional corpus could only ever touch the second half.

### Why they need SMS
The operational pain is the Saturday-morning canvass that half the signed-up volunteers no-show because the shift confirmation sat unread in email — a campaign has a fixed number of weekends before Election Day and cannot re-run a wasted one. SMS wins for the internal-ops half for the same reason it wins everywhere: a shift reminder or event-turnout text is read in minutes, not buried. But the messages a campaign most wants to send — "vote for X," "chip in $25," "polls close at 8" — are partisan advocacy, which is exactly the content carriers route through the political special lane, and that is the half RelayKit does not carry.

### Message categories
1. team-alerts — the only genuinely strong fit: volunteer shift scheduling, reminders, changes, and cancellations for canvasses, phone banks, and staging-location duty. Pure operational logistics, no advocacy.
2. community — onboarding a new volunteer and inviting them to campaign events (organizing events, not voter-facing rallies-as-persuasion). Maps if framed as internal volunteer-community ops, not voter contact.
3. verification — phone-ownership proof when a volunteer creates an account on the campaign's volunteer portal. Identity, not advocacy; clean.
4. account-events — volunteer-portal account lifecycle (new-device sign-in, account issues). Thin but operational.

Excluded: marketing (campaign promotion, GOTV, fundraising appeals are partisan advocacy — the SHAFT-C political content carriers treat as the political special use case; out of bounds regardless of the marketing carve-out), appointments (no provider/booking model), order-updates (no commerce), customer-support (no ticketed support relationship), waitlist (no queue model). The entire voter-contact surface — persuasion, GOTV, fundraising — is excluded as advocacy content, not because no category resembles it but because that content is precisely what defers this whole sub-vertical.

### Workflows

**Volunteer shift coordination** (operational — in-bounds)
Scheduling and reminding volunteers for canvass, phone-bank, and staging-location shifts. Pure logistics, identical in shape to any hourly-staff rota.
Sequence:
1. team-alerts:shift-scheduled — "Shift confirmed" — sent when a volunteer signs up for or is assigned a shift: date, time, staging location, role.
2. team-alerts:shift-reminder — "Shift reminder" — sent the morning of (or evening before) the shift.
3. team-alerts:shift-change — "Shift updated" — sent when a staging location or time moves.
4. team-alerts:shift-cancellation — "Shift cancelled" — sent when a shift is called off (weather, low turnout, scheduling).
Variable aliases (only where default would feel wrong):
- location: "Riverside HQ — canvass launch"
- role: "Door knocker"

**Volunteer onboarding** (operational — in-bounds)
Welcoming a newly recruited volunteer and pointing them to training resources. Internal volunteer community, not voter contact.
Sequence:
1. community:welcome — "Welcome aboard" — sent when a volunteer joins the campaign's volunteer roster.
2. community:first-action — "First step" — sent 24–48h later, nudging them to complete the volunteer training / sign the volunteer agreement.
3. community:resource-pointer — "Volunteer guide" — sent a few days in, linking the field manual / canvassing how-to.
Variable aliases (only where default would feel wrong):
- community_name: "Smith for Council — Volunteers"

**Campaign event turnout (volunteer/staff events)** (operational — in-bounds only for internal organizing events)
Driving turnout to organizing events — volunteer trainings, staging-location kickoffs, canvass launches. This is in-bounds ONLY where the event is internal organizing logistics; the same mechanism used to turn out voters to a partisan rally as a persuasion tactic is advocacy and out of bounds.
Sequence:
1. community:event-invitation — "Event invite" — sent when a volunteer organizing event is posted: name, time, RSVP link.
2. community:live-event-reminder — "Starting soon" — sent shortly before the event begins.
Variable aliases (only where default would feel wrong):
- event_name: "Saturday canvass training"

**Volunteer-portal account access** (operational — in-bounds)
Phone verification and account-security alerts for the campaign's volunteer portal.
Sequence:
1. verification:verification-code — "Verification code" — sent when a volunteer verifies their phone at portal signup.
2. account-events:new-device-sign-in — "New sign-in" — sent on access from a new device.

**Voter persuasion / GOTV / fundraising** (ADVOCACY — OUT OF BOUNDS)
The campaign's core outbound program: persuasion texts, get-out-the-vote reminders, polling-place info pushes, and fundraising appeals to voter/supporter lists. This is partisan advocacy content — the political special use case carriers route through enhanced vetting and the content RelayKit does not carry. No corpus mapping is offered or attempted. Documented here only to mark the line: this workflow is the reason the sub-vertical is deferred.

### Message gaps
No GAP or STRETCH is proposed. The in-bounds operational workflows above map cleanly to existing corpus IDs (team-alerts, community, verification, account-events), and the only unmapped surface is partisan advocacy content, which is deliberately out of scope rather than a corpus shortfall — proposing draft variants for it would violate the operational-only rule. There is therefore nothing to add to the corpus for this sub-vertical.

### Content constraints
- Partisan campaign SMS sits in TCR's Political special use case: registration requires a Campaign Verify token (a mandatory third-party attestation of the campaign/PAC/party, ~$95 per two-year cycle) before any number can send, and effective Feb 2026 one or more major carriers require that token across political short-code, toll-free, and 10DLC channels.
- Political campaigns receive enhanced manual carrier vetting beyond standard A2P review; approval timelines stretch (weeks), and surge periods near elections worsen it.
- The voter-contact half of campaign messaging is partisan advocacy content; carriers treat it as the political special case, and RelayKit's positioning treats partisan campaign SMS as falling under the SHAFT-C political prohibition framing — RelayKit does not carry it.
- Advocacy-vs-operational line: persuasion, GOTV, polling-place pushes, and fundraising appeals are advocacy (out of bounds); volunteer shift logistics, volunteer onboarding, internal organizing-event turnout, and portal account/verification are operational (mappable in principle).
- P2P vs A2P matters in this space: campaigns lean on peer-to-peer texting (a live human sends each message) precisely to use looser consent standards for cold voter outreach. RelayKit is A2P/transactional and assumes prior consent — it is structurally the wrong tool for the cold-outreach voter-contact program even setting content aside.
- Consent: the operational messages above presume an existing volunteer/staff relationship and explicit opt-in; they do not inherit any consent the campaign may claim for P2P voter outreach.

### Disambiguation
This row is partisan single-campaign operations and must not be confused with nonpartisan civic engagement or government voter-registration outreach, which is a separate sub-vertical with a different constraint profile. The hard line is content, not category: a campaign's volunteer shift reminder is indistinguishable from any business's staff rota and is in-bounds, while the same campaign's "vote Smith on Tuesday" text is partisan advocacy carriers route through the political special use case and RelayKit does not carry. The sub-vertical is deferred — "maybe not ever" — because the workflows a campaign actually buys a texting tool for are the advocacy half; the in-bounds operational sliver is real but is not why anyone adopts campaign software, so even a clean operational fit does not make this a viable target until the bucket changes. Serving the operational sliver alone would also invite advocacy content to leak in under an operational registration, which is exactly the misuse carrier political vetting exists to catch.

### Sources
https://www.ngpvan.com/
https://www.ngpvan.com/blog/political-text-messaging-service/
https://en.wikipedia.org/wiki/NGP_VAN
https://www.getthru.io/p2p-texting-campaigns
https://www.getthru.io/p2p-texting-101-guide
https://help.getthru.io/support/solutions/articles/44001908443-plan-your-first-thrutext-campaign
https://help.getthru.io/support/solutions/articles/44001905143-political-texting-suggested-scripts
https://www.eztexting.com/resources/sms-resources/a2p-vs-p2p-what-to-know-to-make-the-most-out-of-your-political-campaign
https://politicalcomms.com/blog/2025-political-texting-compliance-fcc-tcpa/
https://politicalcomms.com/blog/best-p2p-texting-platforms-campaigns/
https://callhub.io/blog/compliance/10dlc-2025-registration-callhub/
https://help.clicksend.com/en/articles/46589-political-sms-messaging-on-tfn-10dlc
https://www.10dlc.org/en/shaft
https://williamdudleycom.wordpress.com/2025/11/28/demystifying-the-mobile-messaging-ecosystem-part-7-the-25-billion-text-trap-why-political-messaging-isnt-spam-but-still-drives-you-crazy/
