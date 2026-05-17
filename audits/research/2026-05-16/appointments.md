# Appointments — Lead-Magnet Research
**Date:** 2026-05-16
**TCR mapping:** ACCOUNT_NOTIFICATION
**Classification:** workflow
**Authored by:** PM (Session 91)

## 1. Industry pattern observations

Appointments is one of the most mature SMS use cases in SaaS — every booking-driven business sends SMS, from Calendly demo confirmations to hair-salon reminders to therapy session prompts. The pattern is reliably workflow-shaped: one appointment generates a sequence of messages over time, anchored to the appointment_time variable.

For indie SaaS, the appointment-driven segments are: coaching platforms, sales SaaS with demo booking, course-creator tools with 1:1 sessions, beta-call scheduling, customer-success tooling, and consulting platforms. Wellness/salon/medical adjacent indie SaaS also exist but skew toward established verticals (Calendly, Cal.com, Acuity, Vagaro, SimplyBook, TidyCal, Mindbody, ZocDoc) more than indie-built.

The temporal sequence is industry-standard: confirmation immediately after booking, one or two reminders before the appointment, conditional reschedule/cancellation acknowledgments, optional no-show follow-up, and an optional post-appointment touchpoint. Cal.com (open source) is the cleanest reference for indie SaaS-shaped appointment SMS — its templates are minimal and voice-clean. Calendly's templates are heavier on branding cues. Salon/wellness apps (Vagaro, Booksy) skew warmer and more personable.

## 2. Stages identified

Seven workflow stages cover the appointment lifecycle. Three are typically "default on," four are conditional or optional:

1. **Confirmation** (default on) — triggerCue: *Sent immediately after booking is confirmed in the developer's system.* The "your appointment is locked in" moment. Includes date, time, provider/service, and any prep instructions.

2. **Reminder — distant** (default on) — triggerCue: *Sent T-24h before appointment_time.* Lead-time reminder for planning. Often the most-opened SMS in the sequence.

3. **Reminder — proximate** (default on) — triggerCue: *Sent T-1h before appointment_time.* Final nudge. Higher show-up rate when paired with the T-24h reminder.

4. **Reschedule confirmation** (conditional) — triggerCue: *Sent when the user reschedules an existing appointment.* Confirms the new time and resets the reminder schedule.

5. **Cancellation confirmation** (conditional) — triggerCue: *Sent when the user cancels.* Warm acknowledgment + optional rebooking link.

6. **No-show follow-up** (optional) — triggerCue: *Sent T+1h after appointment_time if no check-in event received.* Non-judgmental, friction-low rebooking path.

7. **Post-appointment** (optional) — triggerCue: *Sent T+1h to T+24h after appointment completed.* Thanks + optional next-step. **Per D-392: this stage covers thanks + feedback only.** Rebooking promotions and discount offers route through the Marketing campaign, not as an Appointments stage. See also D-399 for the corpus-wide rule.

## 3. Voice patterns observed

Appointment SMS reads as **factual, time-bound, action-oriented**. Short — typically 60-140 characters per stage. The single most important thing is time/date clarity: every confirmation and reminder must state both date and time unambiguously, in the recipient's likely timezone.

Confirmation cues that work: "confirmed," "reserved," "booked," "you're in for [time]." Avoid: "thanks for booking" without confirming the actual time (forces the reader to scroll up in their thread).

Reminder cues: "tomorrow at [time]," "in 1 hour," "[date] at [time]." Specific beats vague every time — "tomorrow" beats "soon," "[date]" beats "next week."

Cancellation and reschedule: warm acknowledgment + immediate clarity on the next state. Voice that works: "Got it — your appointment is now [new_time]." Voice that fails: "Your request has been processed" (corporate, no actual confirmation of the new state).

No-show follow-up: non-judgmental. "We missed you — want to reschedule?" works. "You missed your appointment" sounds accusatory and bumps opt-out rates.

Variables typically used: `{{appointment_time}}` (combined date+time), `{{provider_name}}` or `{{service_type}}`, `{{location}}`, `{{customer_name}}` or `{{first_name}}`, `{{reschedule_link}}` and `{{cancel_link}}`. Personalization is high — appointment SMS is where merge data earns its keep.

## 4. B2B vs B2C variations

B2B appointment SMS (sales demos, customer success calls, consulting): tone slightly more professional, often references the meeting context ("your demo with [name]"), more likely to include a video conference link than a physical address.

B2C appointment SMS (salon, wellness, medical, home services, fitness, tutoring): tone warmer, more personable, location-focused for in-person services.

Common ground across both: time/date clarity, single clear action, low character count, reschedule/cancel link availability.

The default voice should land closer to B2C (warmer) with B2B variations noted in message authoring — RelayKit's launch audience skews indie SaaS, much of which lands B2B but tonally borrows from creator economy / consumer apps.

## 5. Compliance constraints / TCR considerations

- **TCR ACCOUNT_NOTIFICATION mapping.** Standard Class category — easier registration than Marketing, lower carrier scrutiny. Auto-approved at TCR for transactional Brand Tier LOW per experiment 3a findings.
- **STOP language required.** "Reply STOP to opt out" in every message. Less aggressive than Marketing scanning but non-negotiable.
- **Quiet hours apply.** 8am-9pm recipient local time. Appointment confirmations within quiet hours acceptable when triggered by user action (just booked), but proactive reminders should respect quiet hours.
- **No promotional content in transactional messages** (D-399). Appointment reminders must stay appointment-focused. Adding "Book your next appointment 10% off" to a reminder converts it to mixed content and risks the campaign classification. Promotional follow-ups belong in Marketing (separate campaign) — D-392 records this specifically for Stage 7.
- **HIPAA considerations.** Healthcare appointment reminders enjoy a narrow TCPA exemption under HIPAA, but RelayKit shouldn't lean on it — apply standard transactional consent. Healthcare-specific message templates (mention of medical condition, procedure, provider specialty) require extra care; HIPAA-regulated variants are tracked as a future BACKLOG item.
- **Reschedule/cancel links.** Carrier-friendly when the destination is the developer's own domain. Public URL shorteners increase suspicion.

## 6. Open questions / followups

- **Post-appointment stage — where does promotional crossover live?** — **RESOLVED per D-392.** Stage 7 covers thanks + feedback only; rebooking promos route to Marketing. Generalized corpus-wide by D-399.
- **Group appointments.** Yoga class, group session, cohort calls — many class names + capacity, not single provider/time. Likely a variation of Confirmation stage with `{{class_name}}` instead of `{{provider_name}}`. **DEFERRED** to message authoring — variable shape supports it.
- **Cancellation auto-fill (waitlist promotion).** When a cancellation opens a slot and a waitlisted user gets promoted — that flow belongs in Waitlist research; cross-referenced there.
- **HIPAA-regulated appointment SMS** — Healthcare-specific templates require restraint (no medical specifics). Launch ships with general templates; healthcare-specific variants tracked as BACKLOG ("HIPAA-regulated appointment template variants"). **DEFERRED.**
- **Provider-to-customer vs customer-to-provider direction.** Most appointment SMS is provider-to-customer (your appointment is...). Customer-to-provider SMS (cancel your visit) is inbound — different flow, **DEFERRED** to Phase 4 / inbound MO scope.

## 7. Notable references

- Cal.com (open source) — cleanest indie-SaaS-shaped appointment SMS templates
- Calendly default SMS templates — heavier branding but useful for pattern coverage
- Twilio Appointment Reminders documentation — variable patterns and timing logic
- HIPAA SMS compliance summary — context for healthcare-adjacent caveats
- TCR ACCOUNT_NOTIFICATION specifications
- Vagaro/Booksy template libraries — B2C wellness/salon reference for warmer voice
