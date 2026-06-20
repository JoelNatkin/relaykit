## Solar installation dispatch
**Vertical:** Home & local services
**Bucket:** Clear
**URL slug:** /for/solar-installation

### What this builder is making
A field-service and project-tracking tool for residential/commercial solar installers that moves a signed customer through the long post-sale pipeline: site survey, engineering and permitting, install scheduling, install-day crew dispatch, jurisdictional inspection, and the utility interconnection queue that ends in Permission to Operate (PTO). It tracks crew assignments and arrival windows, milestone status across a 2-4 month project, and post-activation service/maintenance visits. This is the operations layer for installers who already have a signed customer — not a lead-capture or sales-outreach product.

### Why they need SMS
A solar project spans months with long silent gaps (permitting, the interconnection queue) where homeowners assume the project has stalled and flood the office with status calls — and on install day a crew showing up to an absent homeowner or blocked driveway burns a full crew-day. A milestone text at each stage transition ("permit approved," "you're in the utility queue," "PTO granted — turn your system on") replaces those calls, and a "crew en route, arriving {{window}}" text the morning of install gets the gate unlocked and the driveway clear. SMS wins because homeowners read it in minutes where install-day email and the months-old portal login both get ignored.

### Message categories
1. account-events — milestone status transitions are the spine of a multi-month solar project (permit approved, queue entered, PTO granted); these are the lifecycle alerts that get missed in email
2. appointments — site survey, install day, and inspection are scheduled on-site visits with reminders, reschedules, and crew-arrival windows
3. customer-support — long silent gaps and post-activation issues generate tickets; proactive status outreach during stalls reduces inbound calls
4. team-alerts — crew/installer-facing shift dispatch for the install team (internal, not homeowner-facing)
Excluded: marketing (lead-gen cold outreach is explicitly out of scope — see Disambiguation; promotional solar offers are a separate, EIN-gated, high-scrutiny use), order-updates (no physical shipment lifecycle; the "milestone" framing lives in account-events/appointments), community (no community surface), verification (possible at portal signup but not distinctive to this vertical), waitlist (no queue-for-a-spot product; the utility interconnection queue is a status milestone, not a RelayKit waitlist)

### Workflows

**Project milestone tracker**
Keeps the homeowner informed across the months-long pipeline so silent gaps don't trigger status calls or churn anxiety.
Sequence:
1. GAP:milestone-update (survey scheduled) — "{{workspace_name}}" — site survey is booked; what to expect on the visit
2. GAP:milestone-update (permit submitted) — "{{workspace_name}}" — design done, permit submitted to the jurisdiction; expect a wait
3. GAP:milestone-update (permit approved) — "{{workspace_name}}" — permit approved, install scheduling next
4. GAP:milestone-update (install complete) — "{{workspace_name}}" — panels installed, inspection next
5. GAP:milestone-update (inspection passed) — "{{workspace_name}}" — passed inspection, now in the utility interconnection queue
6. GAP:milestone-update (PTO granted) — "{{workspace_name}}" — Permission to Operate granted; you may now turn your system on

**Site survey scheduling**
Books and protects the initial on-site survey visit that the whole design depends on.
Sequence:
1. appointments:confirmation — "{{workspace_name}}" — survey appointment confirmed for {{appointment_time}}
2. appointments:reminder-distant — "{{workspace_name}}" — reminder the day before; reschedule link
3. appointments:reminder-proximate — "{{workspace_name}}" — about an hour out; arrival window
4. appointments:no-show-follow-up — "{{workspace_name}}" — missed the surveyor; rebook
Variable aliases:
- provider_name: "your site surveyor"

**Install day dispatch**
Gets the crew onto the property on time with the homeowner present, gate unlocked, and driveway clear — the most expensive day to miss.
Sequence:
1. appointments:confirmation — "{{workspace_name}}" — install day confirmed for {{appointment_time}}; prep instructions
2. appointments:reminder-distant — "{{workspace_name}}" — reminder the day before install
3. GAP:crew-en-route — "{{workspace_name}}" — crew is en route, arriving {{arrival_window}}; please clear the driveway
4. STRETCH:appointments:post-appointment — "{{workspace_name}}" — install complete; feedback / what happens next
Variable aliases:
- provider_name: "your install crew"

**Inspection visit scheduling**
Coordinates the jurisdictional inspection that gates the interconnection queue.
Sequence:
1. appointments:confirmation — "{{workspace_name}}" — inspection scheduled for {{appointment_time}}; access needed
2. appointments:reminder-distant — "{{workspace_name}}" — reminder the day before the inspector arrives
3. appointments:reschedule-confirmation — "{{workspace_name}}" — inspection moved (jurisdiction backlog)
Variable aliases:
- provider_name: "the inspector"

**Interconnection-queue stall outreach**
Proactively reassures the homeowner during the multi-week interconnection queue — the longest silent gap and the top driver of "is this dead?" calls.
Sequence:
1. customer-support:proactive-outreach — "{{workspace_name}}" — we know it's quiet; you're in the utility queue, here's where things stand
2. GAP:milestone-update (PTO granted) — "{{workspace_name}}" — queue cleared, PTO granted, system ready to switch on

**Post-activation service / maintenance visit**
Schedules and reminds for warranty, monitoring, or repair visits after the system is live — the recurring service relationship.
Sequence:
1. appointments:confirmation — "{{workspace_name}}" — service visit confirmed for {{appointment_time}}
2. appointments:reminder-distant — "{{workspace_name}}" — reminder the day before the service tech arrives
3. appointments:cancellation-confirmation — "{{workspace_name}}" — visit cancelled; rebook link
Variable aliases:
- provider_name: "your service tech"

**Production / outage service alert**
Notifies the homeowner when system monitoring detects a fault or production drop and a service action is needed.
Sequence:
1. customer-support:service-status-alert — "{{workspace_name}}" — we detected a production issue on your system; we're on it, ETA {{eta}}
2. customer-support:account-issue-resolved — "{{workspace_name}}" — issue fixed, system producing normally again; no action needed

**Crew shift dispatch (internal)**
Assigns and reminds install/service crew members of their job-site shifts. Crew-facing, not homeowner-facing.
Sequence:
1. team-alerts:shift-scheduled — "{{workspace_name}}" — you're scheduled {{shift_date}} {{shift_time}} at {{location}} as {{role}}
2. team-alerts:shift-reminder — "{{workspace_name}}" — shift reminder ahead of start
3. team-alerts:shift-change — "{{workspace_name}}" — job-site or time changed
4. team-alerts:shift-cancellation — "{{workspace_name}}" — shift cancelled (weather/permit delay)
Variable aliases:
- location: "1428 Maple Ave (Rivera install)"
- role: "lead installer"

### Message gaps

**GAP:milestone-update**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:milestone-update
- **Proposed universal name:** Milestone update
- **Why:** Long multi-stage projects (solar, construction, immigration, custom manufacturing) need a generic "your project advanced to {{milestone}}" status notice; account-events has billing/security/lifecycle alerts but no project-progress milestone message
- **Draft variants:**
  - Standard: `{{workspace_name}}: Update on your project - {{milestone}}. Details: {{account_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} project just moved forward: {{milestone}}. See where things stand: {{account_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{milestone}}. Details: {{account_link}} STOP to opt out.`
- **New variables:** `{{milestone}}` — the stage just reached, plain phrase (e.g. "permit approved", "PTO granted"), budget ~28 chars, source: project status field, example: "permit approved"

**GAP:crew-en-route**
- **Classification:** Universal miss
- **Proposed corpus home:** appointments:en-route
- **Proposed universal name:** Provider en route
- **Why:** On-site field-service verticals (solar, HVAC, pest, cleaning, repair) need a same-day "we're on the way, arriving {{arrival_window}}" message; appointments has reminders but no en-route/arrival-window notice
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your crew is on the way, arriving {{arrival_window}}. Please clear access to the work area. Reply STOP to opt out.`
  - Friendly: `Heads up - your {{workspace_name}} crew is en route and should arrive {{arrival_window}}. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Crew en route, arriving {{arrival_window}}. STOP to opt out.`
- **New variables:** `{{arrival_window}}` — the expected arrival time range, budget ~18 chars, source: dispatch ETA, example: "between 8-10am"

**STRETCH:appointments:post-appointment**
- **Classification:** Stretch
- **Proposed corpus home:** appointments:post-appointment — fits as the install-day wrap message, but the corpus body is feedback-collection ("how did it go", feedback_link) whereas install day primarily needs a "what happens next" milestone handoff into inspection; usable for the feedback intent, reframe needed for the next-step intent
- **Proposed universal name:** Post-appointment
- **Why:** Install completion needs both a thank-you/feedback beat and a forward pointer to inspection; the corpus message covers only the former

### Content constraints
- Clear bucket applies ONLY to messaging existing, opted-in customers under a signed contract about their own project/service — survey, permitting, install, inspection, PTO, service visits.
- Standard carrier rules apply to all the workflows above. Sender frame first, "Reply STOP to opt out." present, single GSM-7 segment.
- Do NOT route solar lead-generation cold outreach through this sub-vertical: unsolicited "are you interested in solar?" prospecting, purchased/aggregated lead lists, and "you may qualify for free solar / tax credits" blasts carry a high-abuse profile, are heavily carrier-filtered and TCR-scrutinized, and have no prior consent — they are out of scope here regardless of how the builder describes them.
- Promotional / sales content (financing offers, seasonal discounts, referral incentives) is marketing-category traffic: EIN-gated, separate explicit consent, higher scrutiny — not part of the Clear install-ops profile.
- Milestone and en-route messages are transactional status notices, not marketing; keep all promotional framing (savings claims, incentive pitches) out of their bodies.
- No guaranteed-outcome language about permits, inspections, or utility approval timelines (e.g. avoid promising a specific PTO date); use ranges, and never imply RelayKit guarantees an approval.

### Disambiguation
The bright line is consent and contract: this sub-vertical is post-sale operations for a customer who has signed and opted in, which makes it Clear; solar lead-generation cold outreach to prospects who have not consented is a different, high-abuse use that carriers block and TCR scrutinizes — it never qualifies here no matter how the install-ops framing is presented. The tell for Clear→stays-Clear is that every recipient has an active project or service relationship and the content is their own status; the tell that a builder has drifted into lead-gen is purchased lists, "interested in solar?" prospecting, or qualification blasts to people with no booking. Neighboring sub-verticals: general home-services field dispatch (HVAC, pest, plumbing) shares the en-route/appointment pattern and is similarly Clear; solar sales/marketing platforms and lead aggregators are a distinct, non-served profile. A builder can run both ops and promotional messaging, but the promotional traffic is separate marketing-category, EIN-gated consent — do not fold it into the Clear install-ops campaign.

### Sources
https://www.arrivy.com/blog/the-ultimate-guide-to-solar-project-management-software/
https://www.arrivy.com/blog/best-field-service-management-software-for-solar/
https://klipboard.io/industry-sectors/solar-installer/
https://ezmanagement.com/renewable-energy-and-solar-panel-field-service-software/
https://www.bodhi.solar/blog/communicating-solar-project-milestones-to-customers
https://launchcontrol.us/industries/solar-installation/
https://echodial.io/solar-installer-scheduling-software
https://www.nrel.gov/solar/market-research-analysis/permitting-inspection-interconnection-timelines
https://powerlutions.com/elizabeth/solar-installation-timeline/
https://energyscaperenewables.com/post/solar-pto-process/
https://www.wattmonk.com/solar-pto-process-to-accelerate-approval/
https://energyscaperenewables.com/post/solar-interconnection-critical-path-2026/
https://www.usehatchapp.com/blog/10dlc-business-text-blocking
https://textbolt.com/blog/10dlc-compliance/
http://www.solarfoundationsusa.com/page/news--blog-5/news/what-to-expect-when-the-installation-crew-arrives-on-site-13.html
