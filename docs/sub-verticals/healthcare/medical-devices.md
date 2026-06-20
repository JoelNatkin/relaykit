## Medical device / wearable companion apps
**Vertical:** Healthcare
**Bucket:** Not yet, maybe not ever
**URL slug:** /for/medical-devices
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.

### What this builder is making
A companion app + cloud backend for a wearable or connected health device — an Oura/Whoop-style ring or strap, a CGM companion app, a smart blood-pressure cuff (Withings BPM-class), or a sleep/recovery tracker — that pairs the hardware over Bluetooth/Wi-Fi, syncs readings, surfaces trends, and pushes device and health alerts. The product job is the same across these: keep the device synced and the user informed when something needs attention. The bright line is regulatory status — a consumer-wellness wearable makes no medical claims and sits outside HIPAA, while an FDA-cleared device (CGM, medical BP cuff) crosses into clinical territory and is decided case by case.

### Why they need SMS
The moment that matters is a silent monitoring gap: the device went offline, hasn't synced in 12 hours, or the battery died before bedtime — and a push notification inside an app the user isn't looking at fails to land. SMS wins because it reaches the user out-of-app, at the exact moment monitoring would otherwise lapse unnoticed. For regulated variants, the body carries the device/sync condition and routes any health reading into the app — never the clinical value in the text.

### Message categories
1. account-events — device-tied lifecycle and security alerts (new sign-in, suspension) that get missed in app
2. order-updates — shipping the hardware itself (ring, sensor, cuff) is a physical-goods order lifecycle
3. team-alerts — threshold/anomaly "reading-ready" alerts map to the severity-cued system-alert pattern, framed as device events
4. verification — phone-ownership at signup and step-up before sensitive account changes
Excluded: appointments (device apps aren't booking provider visits — that's clinical-care, a different sub-vertical), marketing (promotional, EIN-gated, off-limits for any health-data context), community, customer-support (possible but not characteristic), waitlist (no queue model here)

### Workflows
**Hardware order tracking**
Get the physical device (ring, CGM sensor, BP cuff) from purchase to the user's hands.
Sequence:
1. order-updates:order-confirmed — "Device order confirmed" — right after purchase of the hardware
2. order-updates:order-shipped — "Device shipped" — when the unit ships, with tracking
3. order-updates:out-for-delivery — "Out for delivery" — day of arrival
4. order-updates:order-delivered — "Device delivered" — on delivery, with a setup/return link
Variable aliases (only where default feels wrong):
- workspace_name: "Oura"

**Device-offline / sync-gap alert**
Tell the user their device stopped reporting so monitoring doesn't lapse silently.
Sequence:
1. team-alerts:system-alert — "Device offline" — when the device hasn't synced past a threshold; routes to app, no reading value
Variable aliases (only where default feels wrong):
- severity: "Notice"
- alert_type: "Device offline"
- system_name: "your ring"

**Low-battery alert**
Warn the user before the device dies and a monitoring window is missed (Oura's pre-bedtime low-battery alert is the canonical case).
Sequence:
1. GAP:device-low-battery — "Battery low" — hours before a known monitoring window (e.g. bedtime)

**Reading-ready / threshold notice (regulated-variant gated)**
Tell the user a new reading or a threshold event is available — without putting the clinical value in the SMS.
Sequence:
1. GAP:reading-ready — "New reading ready" — when a sync completes or a threshold event fires; body routes to the app
Variable aliases (only where default feels wrong):
- (none)

**Account security**
Protect the account holding the user's health data.
Sequence:
1. verification:verification-code — "Verification code" — phone-ownership at signup
2. account-events:new-device-sign-in — "New sign-in" — account accessed from a new device
3. account-events:account-suspended — "Account suspended" — when the account is suspended
Variable aliases (only where default feels wrong):
- (none)

### Message gaps
**GAP:device-low-battery**
- **Classification:** Universal miss
- **Proposed corpus home:** account-events:device-low-battery (or a device-state group in a future registry layer)
- **Proposed universal name:** Device battery low
- **Why:** a dead device is a silent monitoring gap; no corpus message covers hardware battery state
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your {{device_name}} battery is low. Charge it before {{window}} to avoid a gap in tracking. Reply STOP to opt out.`
  - Friendly: `Heads up - your {{workspace_name}} {{device_name}} is running low. Charge it before {{window}} so you don't miss tonight. Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{device_name}} battery low. Charge before {{window}}. STOP to opt out.`
- **New variables:** device_name ("ring"), window ("bedtime")
- **Status:** FUTURE — do not add to corpus until bucket changes.

**GAP:reading-ready**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (device-state group)
- **Proposed universal name:** New reading ready (display alias; routes to app, no value in body)
- **Why:** a reading-available ping that deliberately carries no clinical value is specific to regulated-device companions and has no neutral corpus home
- **Status:** FUTURE — do not add to corpus until bucket changes.

**STRETCH:team-alerts:system-alert**
- **Classification:** Stretch
- **Proposed corpus home:** team-alerts:system-alert reused as a device-offline alert; fit gap is that the corpus framing is ops/infra ("on {{system_name}}"), not a personal consumer device
- **Proposed universal name:** Device offline alert (display alias of system-alert)
- **Why:** the structure (severity + condition + link, route-to-detail) fits device-offline cleanly, but the operational tone needs softening for a consumer health context
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your {{device_name}} hasn't synced since {{last_sync}}. Open the app to reconnect: {{action_link}} Reply STOP to opt out.`
  - Friendly: `Heads up - your {{workspace_name}} {{device_name}} stopped syncing around {{last_sync}}. Reconnect here: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{device_name}} offline since {{last_sync}}. Reconnect: {{action_link}} STOP to opt out.`
- **New variables:** device_name ("ring"), last_sync ("8am")
- **Status:** FUTURE — do not add to corpus until bucket changes.

### Content constraints
- Vet case by case on the REGULATORY STATUS headline before serving: it decides everything downstream.
- Consumer-wellness wearable (no medical claims, no covered-entity involvement) sits outside HIPAA and leans Clear-ish — device/order/sync/battery alerts resemble the IoT + e-commerce pattern.
- FDA-cleared / clinical-monitoring device (CGM, medical BP cuff), or any device feeding a remote-patient-monitoring or covered-entity program, crosses into clinical/PHI and gates like clinical-care (BAA territory — decline at intake under D-18 if PHI would route through the proxy).
- Device/order/sync/battery alerts are low-risk regardless of variant.
- Health-reading alerts are the line: never put a clinical reading value (glucose, BP, HRV) in the SMS body — route the user to the app for the number.
- No medical claims for consumer devices ("ensures," "diagnoses," "guarantees" — already prohibited platform-wide).
- Explicit consent required; transactional categories carry STOP/HELP; verification keeps the 2FA carve-out.

### Disambiguation
The bright line is regulatory status, not the device. An Oura/Whoop-style consumer-wellness wearable's device, order, and sync/battery alerts resemble the IoT + e-commerce pattern and carry lower risk — no medical claims, no covered entity, outside HIPAA. But an FDA-cleared CGM or cardiac/BP monitor companion that delivers health readings (or feeds a remote-patient-monitoring program) is clinical and BAA-gated, and decline-at-intake territory if PHI would route through the proxy. Distinguish this from wellness/fitness apps (Clear — no device-reading layer) and from clinical-care (the provider/appointment side). The dev's wrong assumption is "it's just my device app" — but a regulated-device reading alert is clinical health data, which is exactly why this whole sub-vertical sits in case-by-case vetting rather than a served bucket.

### Sources
https://support.ouraring.com/hc/en-us/articles/360025579173-Managing-Your-Notifications
https://www.dexcom.com/en-us/continuous-glucose-monitoring
https://www.fda.gov/medical-devices/medical-device-recalls-and-early-alerts/continuous-glucose-monitor-apps-correction-dexcom-inc-issues-correction-g7-apps-and-one-apps-due
https://www.businesswire.com/news/home/20250410304660/en/Dexcom-G7-15-Day-Receives-FDA-Clearance-the-Longest-Lasting-Wearable-and-Most-Accurate-CGM-System
https://www.withings.com/us/en/blood-pressure-monitors
https://www.amazon.com/Withings-BPM-Connect-Pressure-Monitor/dp/B07SJV1HNR
https://www.accountablehq.com/post/does-hipaa-protect-health-information-in-apps-wearables-and-employer-wellness-programs
https://www.techtarget.com/searchhealthit/feature/Wearable-health-technology-and-HIPAA-What-is-and-isnt-covered
https://www.paubox.com/blog/how-can-text-messaging-be-used-for-remote-patient-monitoring
https://www.dialoghealth.com/post/14-ways-text-messaging-drives-remote-patient-monitoring-success
