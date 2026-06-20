## IoT / connected-device platforms (consumer-facing)
**Vertical:** B2B SaaS & developer tooling
**Bucket:** Not yet, maybe not ever
**URL slug:** /for/iot-saas
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.

### What this builder is making
A consumer-facing IoT platform — the app and cloud behind a smart-home device line such as water-leak and door/window sensors, security cameras and doorbells, power-fail and environmental monitors. The builder owns the device firmware-to-cloud pipeline and the homeowner-facing app, and needs to push the device's physical-world events (leak detected, motion at the door, hub offline, battery low) to a person who may not have the app open. The recipient is the device owner — a consumer who bought hardware, not a B2B operator monitoring a fleet.

### Why they need SMS
The moment is a real-world event with a closing window — water on the floor, a door opened at 2am, the monitoring hub dropping offline. The consequence of a missed alert is property damage, a security gap, or silent loss of all monitoring, and a backgrounded push notification or unopened email routinely fails to land. SMS wins because it reaches the owner's lock screen with no app dependency and the highest open-and-read rate of any channel, which is exactly why leak and security vendors (YoLink, Elertus, iSocket) already sell SMS as the escalation tier.

### Message categories
1. team-alerts — primary: the leak/motion/offline/threshold events are severity-cued device alerts that map directly onto System alert, Escalation ping, On-call page, and Service-level alert framings.
2. account-events — device-account lifecycle and security: New device sign-in (new app login to the home account), Account suspended, plus the security-status framing of a new device pairing.
3. verification — phone-ownership proof when the owner adds their number to the device account to enable SMS alerts at all.
4. customer-support — Service status alert (the vendor cloud is down, so alerts may not fire) and ticket lifecycle when an owner reports a malfunctioning device.
Excluded: appointments (no scheduled-visit model), order-updates (hardware-purchase shipping is a one-time pre-account event, not the recurring product), community (no member community), marketing (the entire reason this is gated — promotional device-tied or geofenced messaging is the abuse vector to keep out), waitlist (no queue model in the device-alert product).

### Workflows

**Critical sensor event alert**
Notify the owner the instant a sensor crosses a physical-world threshold (water, smoke/CO, open door, power loss).
Sequence:
1. team-alerts:system-alert — "Sensor triggered" — first-fire alert naming the sensor and condition
2. team-alerts:escalation-ping — "Acknowledge or we escalate" — if unacknowledged, prompt the owner before notifying a secondary contact
3. team-alerts:on-call-page — "Urgent: leak/intrusion now" — shortest, highest-severity form for an active emergency
Variable aliases (only where default feels wrong):
- system_name: "Kitchen Leak Sensor"
- alert_type: "Water detected"
- severity: "URGENT"
- escalation_to: "your emergency contact"
- action_link: "live view / device status link"

**Device health / connectivity**
Tell the owner when a device or hub goes offline or its battery is dying, because a dead sensor means silent loss of protection.
Sequence:
1. team-alerts:system-alert — "Device offline" — hub or sensor lost connectivity; monitoring is down
2. team-alerts:service-level-alert — "Monitoring degraded" — informational notice that coverage is below normal until resolved
3. GAP:device-battery-low — "Battery low" — recurring low-battery warning has no clean corpus home (see gaps).

**Account security on the device account**
Confirm and protect the home account that controls the devices.
Sequence:
1. verification:verification-code — "Verify your number" — owner adds phone to enable SMS alerts
2. account-events:new-device-sign-in — "New app sign-in" — someone logged into the home account from a new device
3. account-events:account-suspended — "Account suspended" — billing lapse or policy issue that would stop alerts
Variable aliases (only where default feels wrong):
- device_context: "a new phone in Austin, TX"

**Cloud service status**
Tell owners when the vendor cloud — not their device — is the problem, so a quiet system isn't mistaken for safety.
Sequence:
1. customer-support:service-status-alert — "Service issue" — vendor cloud outage; alerts may be delayed or not fire
2. customer-support:account-issue-resolved — "Resolved, no action needed" — service restored

### Message gaps

**GAP:device-battery-low**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (consumer-IoT device-health namespace) — or team-alerts:device-battery-low if generalized
- **Proposed universal name:** Low battery warning | "Battery low"
- **Why:** a dying sensor battery silently ends protection, and no corpus message frames a maintenance-action-needed device-health prompt distinct from a connectivity outage.
- **Draft variants:**
  - Standard: `{{workspace_name}}: {{device_name}} battery is low ({{battery_level}}). Replace it to keep monitoring active: {{action_link}} Reply STOP to opt out.`
  - Friendly: `Heads up - your {{workspace_name}} {{device_name}} battery is low ({{battery_level}}). Swap it soon so you stay covered: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: {{device_name}} battery low. Replace soon: {{action_link}} STOP to opt out.`
- **New variables:** {{device_name}}, {{battery_level}}
- **Status:** FUTURE — do not add to corpus until bucket changes.

**GAP:armed-state-change**
- **Classification:** Vertical-specific
- **Proposed corpus home:** sub-vertical registry layer (consumer-IoT security namespace)
- **Proposed universal name:** Security mode changed | "System armed/disarmed"
- **Why:** a confirmation that the home security system switched armed/disarmed state (a security-relevant event owners want verified) has no analog in the corpus, which has no home-security mode concept.
- **Draft variants:**
  - Standard: `{{workspace_name}}: Your system was set to {{armed_state}} at {{event_time}}. Not you? Review: {{action_link}} Reply STOP to opt out.`
  - Friendly: `Your {{workspace_name}} system is now {{armed_state}} (as of {{event_time}}). Wasn't you? Check here: {{action_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: System {{armed_state}} at {{event_time}}. Not you? {{action_link}} STOP to opt out.`
- **New variables:** {{armed_state}}, {{event_time}}
- **Status:** FUTURE — do not add to corpus until bucket changes.

**STRETCH:team-alerts:escalation-ping**
- **Classification:** Stretch
- **Proposed corpus home:** stretch: team-alerts:escalation-ping reused for consumer emergency-contact escalation — fit gap is the ACK/on-call frame, which assumes a workplace responder owning a system, not a homeowner being asked to confirm an alarm before a secondary household/emergency contact is pinged.
- **Proposed universal name:** Acknowledge before we escalate | "Acknowledge alert"
- **Why:** the mechanic (require ACK, else escalate) fits, but "{{escalation_to}}" and the on-call/incident voice read as B2B ops and need reframing to a consumer household context.
- **Status:** FUTURE — do not add to corpus until bucket changes.

### Content constraints
- TCR Special-category gate: consumer device alerts straddle Account Notification / Security Alert and, for hub-to-cloud traffic, Machine-to-Machine — all of which can require MNO vetting or pre/post approval and are not immediately available like Standard use cases. This vetting overhead and approval uncertainty is the core reason for the "Not yet, maybe not ever" bucket.
- Device-alert manipulation is an abuse vector: a sender frame that lets an attacker spoof "leak detected / door open / system disarmed" can be weaponized to cause panic or to lure an owner home/away. Bodies must carry a clear {{workspace_name}} sender frame and never embed credentials or one-tap state-change links that act without re-auth.
- Geofencing-based marketing is the disqualifying abuse vector: tying SMS to a device owner's location or presence (away-mode promotions, "you just left home" offers) is exactly the consumer-location-marketing pattern carriers and TCR treat as high-risk. No marketing category for this sub-vertical; alerts stay transactional and event-triggered only.
- Consent must come from the device owner's verified number (opt-in at the account), not inherited from hardware purchase; alerts must honor STOP even though a safety-critical leak/intrusion alert losing SMS reach is a real UX tension to flag at design time.
- Verification 2FA carve-out applies only to the verification-code path; all alert/account/support bodies carry "Reply STOP to opt out." (Brief: "STOP to opt out.").
- Never frame any alert as a guaranteed-safety or guaranteed-detection outcome (platform constraint): a sensor or cloud failure can suppress an alert, so copy must not imply the owner will always be warned.

### Disambiguation
Consumer-facing IoT is distinct from B2B IoT operational/fleet monitoring: here the recipient is an individual homeowner who bought hardware and receives alerts about their own property, whereas B2B IoT pushes machine telemetry and threshold breaches to operators monitoring an industrial or commercial fleet (closer to the existing team-alerts operational use). The two share the device-alert mechanic but differ entirely on consent model, recipient, and abuse surface. This sub-vertical is gated "Not yet, maybe not ever" because consumer device alerts fall into TCR Special use-case territory (Security Alert / M2M) that requires carrier vetting and carries an inherent location-and-presence marketing abuse vector (geofencing) plus device-alert spoofing risk — a compliance and trust-and-safety burden that a single-project indie-developer product is not currently positioned to carry. If the bucket ever opens, the device-health and armed-state gaps and the consumer escalation stretch above are the corpus work to revisit.

### Sources
https://2smart.com/docs-resources/platform-features/how-to-use-notifications-in-iot-to-improve-your-smart-product-s-user-experience
https://notify.events/en/smart-home
https://www.amazon.com/YoLink-Sensors-Detection-Compatible-Assistant/dp/B084WYB8PM
https://blues.com/blog/build-an-iot-smart-leak-detector-with-sms-alerts/
https://mobiusa.com/products/smart-wifi-water-leak-sensor
http://www.elertus.com/
https://www.isocketworld.com/en/iSocket-Water-Sensor-ISWSNO1/
https://support.yosmart.com/hc/en-001/articles/17988570459161-YoLink-App-Q-As
https://shop.yosmart.com/products/ys7106
https://support.simplisafe.com/conversations/product-requests-and-suggestions/outdoor-camera-motion-tied-to-alarm-system-armed-state-homeawayoff/6190c6828ea41ebb062412df
https://ring.com/support/articles/478aj/set-up-motion-warning
https://www.infobip.com/docs/essentials/usa-and-canada-compliance/us-messaging-use-cases
https://www.tsgglobal.com/10dlc-what-you-need-to-know/
https://help.twilio.com/articles/4408675845019-SMS-Compliance-and-A2P-10DLC-in-the-US
https://telnyx.com/resources/sms-compliance
