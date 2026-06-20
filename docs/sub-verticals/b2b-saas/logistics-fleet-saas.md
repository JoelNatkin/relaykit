## Logistics / supply-chain / fleet management SaaS
**Vertical:** B2B SaaS & developer tooling
**Bucket:** Clear
**URL slug:** /for/logistics-fleet-saas

### What this builder is making
A "Samsara-for-X" operations platform — TMS, dispatch software, last-mile delivery, fleet telematics, vehicle-maintenance tracking, or supply-chain visibility — sold to carriers, brokers, couriers, and fleet operators. The product tracks vehicles and shipments through a lifecycle (dispatch → in-transit → arrival → delivery → POD) and fires events off GPS geofences, route progress, and device diagnostics. It is two-sided: it coordinates the operator's own drivers and dispatchers while also keeping the end recipient informed about their delivery.

### Why they need SMS
The end recipient is waiting on a physical delivery and the "out for delivery / arriving in ~20 min" moment decides whether they're home to receive it — a missed delivery means a failed attempt, a redelivery cost, and a WISMO support ticket. SMS wins because the recipient never installed the operator's app and an email won't be seen in the 20-minute arrival window, while drivers and dispatchers need a reply-keyword channel (CONFIRM/ACK) that works from the cab without opening a dashboard. Geofence and route-progress events fire automatically, so a text is the only channel that reaches an app-less recipient at the exact moment the package is near.

### Message categories
1. order-updates — primary; the delivery-status lifecycle (confirmed → shipped → out-for-delivery → delivered) is the highest-volume traffic and the core consumer-facing job
2. appointments — delivery-window booking/confirmation, the day-before and arrival reminders that mirror a scheduled delivery slot
3. team-alerts — driver/dispatcher operational layer: dispatch assignment, exception/delay pings with ACK, vehicle maintenance and fault-code alerts
4. verification — driver/dispatcher app login and phone verification at onboarding
Excluded: marketing (delivery status is transactional; any promo/review-ask reclassifies it and breaks the consent lane — keep it out), community (no member community), customer-support (WISMO is real but handled inline by status texts here, not a ticket lifecycle), waitlist (no queue/availability model), account-events (operator billing is generic SaaS, not vertical-shaping)

### Workflows

**Last-mile delivery status (end recipient)**
Keep the recipient informed from dispatch through proof-of-delivery so they're present at arrival.
Sequence:
1. order-updates:order-confirmed — "Delivery scheduled" — recipient's delivery is booked with an estimated window
2. order-updates:order-shipped — "On the way / loaded" — shipment loaded and route assigned, tracking link issued
3. order-updates:out-for-delivery — "Out for delivery" — driver starts the route, live tracking link sent
4. GAP:driver-approaching — "Arriving soon / X stops away" — geofence/stops-away proximity fires the final heads-up
5. order-updates:order-delivered — "Delivered + POD" — task completed at the stop, proof-of-delivery link attached
Variable aliases (only where default feels wrong):
- order_number: "Delivery #4471"
- estimated_delivery: "today, 2-4pm"
- tracking_link: "live map link"
- return_link: "report a delivery issue"

**Delivery-window scheduling (end recipient)**
Let the recipient lock and be reminded of a delivery appointment slot.
Sequence:
1. appointments:confirmation — "Delivery window confirmed" — recipient's chosen delivery window is booked
2. appointments:reminder-distant — "Delivery tomorrow" — day-before reminder of the window
3. appointments:reminder-proximate — "Delivery in 1 hour" — same-day heads-up before the slot
4. GAP:failed-delivery-reschedule — "Missed you / reschedule" — delivery attempt failed, reschedule link sent
Variable aliases (only where default feels wrong):
- provider_name: "your courier"
- appointment_time: "Tue 2-4pm window"
- reschedule_link: "pick a new window"

**Dispatch coordination (driver / dispatcher)**
Assign work and confirm route/exception changes with the operator's own drivers.
Sequence:
1. GAP:dispatch-assignment — "New load assigned" — a load/route is assigned to a driver, reply to accept
2. team-alerts:shift-scheduled — "Route scheduled" — driver's route/shift for the day is published
3. team-alerts:escalation-ping — "Delay — reply ACK" — exception/delay on an active route needs driver acknowledgment
4. team-alerts:system-alert — "Route change" — route re-sequenced or pickup window moved
Variable aliases (only where default feels wrong):
- severity: "Delay"
- alert_type: "Route disruption"
- system_name: "Load #4471"
- shift_date / shift_time / location: "Mon, 6am, Dock 3"

**Fleet maintenance & diagnostics (fleet manager)**
Surface service-due and fault-code events to whoever keeps the vehicles running.
Sequence:
1. GAP:maintenance-due — "Service due" — odometer/engine-hours/time threshold crossed for a vehicle
2. GAP:vehicle-fault-code — "Fault code / check engine" — telematics device reports an active DTC
3. team-alerts:system-alert — "Inspection/DVIR defect" — a driver inspection logs a failed item
Variable aliases (only where default feels wrong):
- severity: "Maintenance"
- alert_type: "Service due"
- system_name: "Truck 12"

**Driver onboarding (driver)**
Verify a new driver's phone and let them into the dispatch app.
Sequence:
1. verification:verification-code — "Verify your phone" — driver verifies phone at app signup
2. verification:login-code — "Login code" — driver signs in to the dispatch app with SMS
Variable aliases (only where default feels wrong):
- business_name: "the dispatch app's name"

### Message gaps

**GAP:driver-approaching**
- **Classification:** Vertical-specific
- **Proposed corpus home:** order-updates:driver-approaching
- **Proposed universal name:** Arriving soon / driver approaching — "Arriving soon"
- **Why:** the geofence proximity "X stops away / arriving in ~20 min" moment is the single decision point for recipient presence, and order-updates has out-for-delivery but no proximity step
- **Draft variants:**
  - Standard: `{{workspace_name}}: Order {{order_number}} is arriving soon, about {{wait_estimate}} away. Track it: {{tracking_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} order {{order_number}} is almost there, about {{wait_estimate}} out. Track: {{tracking_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Order {{order_number}} arriving in {{wait_estimate}}. {{tracking_link}} STOP to opt out.`
- **New variables:** `{{wait_estimate}}` (reused from waitlist category)

**GAP:failed-delivery-reschedule**
- **Classification:** Vertical-specific
- **Proposed corpus home:** order-updates:delivery-failed
- **Proposed universal name:** Delivery attempt failed — reschedule — "Delivery missed"
- **Why:** a failed delivery attempt is a distinct lifecycle branch (not a return) that needs a reschedule path, and no corpus message covers it
- **Draft variants:**
  - Standard: `{{workspace_name}}: We missed you on order {{order_number}}. Reschedule delivery here: {{reschedule_link}} Reply STOP to opt out.`
  - Friendly: `We tried to deliver your {{workspace_name}} order {{order_number}} but missed you. Pick a new time: {{reschedule_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: Order {{order_number}} delivery missed. Reschedule: {{reschedule_link}} STOP to opt out.`
- **New variables:** none (`{{reschedule_link}}` reused from appointments)

**GAP:dispatch-assignment**
- **Classification:** Vertical-specific
- **Proposed corpus home:** team-alerts:dispatch-assignment
- **Proposed universal name:** Job/load assigned to driver — "New assignment"
- **Why:** assigning a load/route to a driver with a reply-to-accept loop is the core dispatch action, and team-alerts covers shifts and incidents but not work assignment
- **Draft variants:**
  - Standard: `{{workspace_name}}: New assignment {{system_name}}, pickup {{shift_time}} at {{location}}. Reply ACK to accept. Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: You've got a new load, {{system_name}}, pickup {{shift_time}} at {{location}}. Reply ACK to take it. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: New load {{system_name}}, {{shift_time}}, {{location}}. Reply ACK. STOP to opt out.`
- **New variables:** none (reuses team-alerts `{{system_name}}`, `{{shift_time}}`, `{{location}}`)

**GAP:maintenance-due**
- **Classification:** Vertical-specific
- **Proposed corpus home:** team-alerts:maintenance-due
- **Proposed universal name:** Vehicle service due — "Service due"
- **Why:** odometer/engine-hours service reminders are a named, recurring fleet feature and the corpus has no maintenance-threshold message
- **Draft variants:**
  - Standard: `{{workspace_name}}: Service due on {{system_name}}, {{alert_type}}. Details: {{action_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}} heads up: {{system_name}} is due for service, {{alert_type}}. Details: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{system_name}} service due, {{alert_type}}. {{action_link}} STOP to opt out.`
- **New variables:** none (reuses team-alerts `{{system_name}}`, `{{alert_type}}`, `{{action_link}}`)

**GAP:vehicle-fault-code**
- **Classification:** Vertical-specific
- **Proposed corpus home:** team-alerts:vehicle-fault-code
- **Proposed universal name:** Vehicle fault code / check-engine alert — "Fault code"
- **Why:** an active DTC from the telematics device is a real-time diagnostic event distinct from a scheduled service reminder
- **Draft variants:**
  - Standard: `{{workspace_name}} {{severity}}: Fault code on {{system_name}}, {{alert_type}}. Details: {{action_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}} {{severity}}: {{system_name}} reported a fault, {{alert_type}}. Details: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}} {{severity}}: {{system_name}} fault, {{alert_type}}. {{action_link}} STOP to opt out.`
- **New variables:** none (reuses team-alerts `{{severity}}`, `{{system_name}}`, `{{alert_type}}`, `{{action_link}}`)

### Content constraints
- TCR use case is DELIVERY_NOTIFICATION for the consumer status lane; driver/dispatcher coordination rides ACCOUNT_NOTIFICATION (Mixed) — both registrable, neither requires marketing consent.
- Hard line: status texts must stay transactional. No discount codes, upsells, or "rate us / leave a review" asks inside a delivery message — promo content reclassifies it as marketing and breaks the implied-consent lane.
- Deliverability: "package could not be delivered + link" is the most-impersonated smishing pattern in the US; carriers scrutinize public URL shorteners on this traffic. Favor branded/dedicated links over generic shorteners.
- Recipient consent is implied/transactional when the phone number is provided for the delivery; marketing to that list still needs separate express written opt-in.
- Driver/contractor messaging still needs a STOP path; 1099 drivers are a softer consent case than W-2 and should be treated like external contacts.
- HOS/ELD regulatory alerts belong on the in-cab device, not 10DLC SMS — don't position SMS as the compliance-alert channel.
- Standard carrier rules otherwise apply.

### Disambiguation
This sub-vertical is the operator-facing logistics *platform* (TMS, dispatch, telematics, last-mile), not a single merchant texting its own customers — the delivery-status messages here are sent on behalf of many carriers/couriers, and the same product also texts its own drivers and dispatchers. Distinguish it from generic e-commerce order-updates: an online store fires order-confirmed → shipped → delivered, but a logistics platform adds the geofence-driven proximity step, driver dispatch loops, and fleet-maintenance alerts that a merchant never touches. Also distinct from field-service/home-services dispatch: the unit of work here is a *shipment/vehicle* moving through space, not a technician visiting a fixed address, so the consumer lane is delivery-tracking rather than appointment-booking (though delivery-window scheduling overlaps).

### Sources
https://www.samsara.com/guides/geofencing
https://developers.samsara.com/reference/getconfigurations
https://onfleet.com/assignment-and-dispatching
https://support.onfleet.com/hc/en-us/articles/360023669392-Notification-Set-Up-Triggers
https://docs.onfleet.com/reference/webhooks
https://www.fleetio.com/features/fleet-management-notifications
https://www.fleetio.com/blog/auto-service-reminders-a-proactive-approach-to-fleet-maintenance
https://helpcenter.gomotive.com/hc/en-us/articles/31053547120413-Maintenance-Reports-and-Alerts
https://developers.project44.com/guides/shippers/visibility/ftl/get-tracking-updates
https://developers.tive.com/docs/triggers
https://www.messagedesk.com/blog/sms-text-dispatch-logistics-trucking-transportation
https://textus.com/texting-guides/sms-templates-for-logistics-transportation-companies
https://smartroutes.io/blogs/delivery-notifications/
https://www.descartes.com/resources/knowledge-center/elevating-last-mile-customer-experience-real-time-communication
https://route4me.com/platform/marketplace/notifications-and-alerts/notification-geofence-entered
https://www.upperinc.com/blog/geofence-based-driver-tracking/
https://www.ship24.com/help/how-to-handle-failed-delivery-attempts-from-couriers
https://help.twilio.com/articles/4408675845019-SMS-Compliance-and-A2P-10DLC-in-the-US
https://activeprospect.com/blog/sms-consent/
https://www.infobip.com/blog/tcpa-compliance-sms
