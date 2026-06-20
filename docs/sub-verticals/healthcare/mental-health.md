## Mental health / therapy platforms
**Vertical:** Healthcare
**Bucket:** Not yet
**URL slug:** /for/mental-health
> ⚠️ FUTURE REFERENCE ONLY — this sub-vertical is not currently served. Workflows and corpus additions documented here are for future use. Do not build into product surface until bucket changes to Clear or Conditional.

### What this builder is making
A teletherapy marketplace (BetterHelp/Talkspace-class) or therapy practice-management/EHR (SimplePractice, TherapyNotes, TheraNest) that matches a client to a licensed therapist, schedules and reminds video/phone sessions, runs intake and consent forms, carries secure in-app messaging, handles billing, and assigns homework/check-ins between sessions. The operational core is session attendance: no-shows directly cost the practice, so reminders and reschedule flows are the highest-volume SMS surface. Recipients are clients in active behavioral-health care, and that relationship is PHI — which is the gating fact for every message.

### Why they need SMS
A client books a session days out, email reminders go unread, and a missed therapy session is a billed-but-empty slot plus a treatment gap; a reschedule or therapist message also needs to land before the session window closes. SMS is the only channel reliably read in time, which is exactly why teletherapy and EHR products attach text reminders to bookings. But the body must stay PHI-hygienic — generic "your session" and a portal link only, never the condition, the modality, or anything a phone-screen glance would read as "this person is in therapy."

### Message categories
1. appointments — primary surface; session confirmations, reminders, reschedules, cancellations, and no-show recovery are the no-show-reducing core of every teletherapy/EHR product.
2. verification — phone-ownership at signup and SMS 2FA for portal access; 2FA carve-out keeps these clean of STOP/HELP.
3. account-events — billing failures, plan/subscription changes, and new-device sign-in alerts on the client account.
4. customer-support — portal/technical support tickets (login, video issues), distinct from clinical care messaging.
5. waitlist — therapist-availability waitlists are real in teletherapy (clients wait for a match or an opening).

Excluded: marketing (promotional content against a behavioral-health audience is the highest-risk possible use; SHAFT/sensitivity makes this a non-starter even after a future BAA), community (no community/cohort relationship in 1:1 care), order-updates (no physical fulfillment), team-alerts (internal ops, not a client surface).

### Workflows

**Session reminder + no-show recovery**
Cut missed sessions and recover the ones that slip, keeping every body free of care content.
Sequence:
1. appointments:confirmation — "Session booked" — sent when the client books a session.
2. appointments:reminder-distant — "Session tomorrow" — day-before nudge with reschedule link.
3. appointments:reminder-proximate — "Session in 1 hour" — final pre-session prompt.
4. appointments:reschedule-confirmation — "Session moved" — sent when the client or therapist reschedules.
5. appointments:cancellation-confirmation — "Session cancelled" — confirms a cancel, offers rebook link.
6. appointments:no-show-follow-up — "We missed you" — sent after a missed session, links to rebook.
Variable aliases (only where default feels wrong):
- provider_name: "your therapist" (never the therapist's real name in the body — a named clinician can imply specialization; keep it generic)
- appointment_time: "Thu 2:00 PM"
- reschedule_link: "portal rebooking link"

**Post-session check-in**
Prompt the client back into the portal after a session without referencing the session's content.
Sequence:
1. appointments:post-appointment — "How was your session" — generic post-session prompt linking to a feedback/check-in form in the portal.
Variable aliases (only where default feels wrong):
- feedback_link: "portal check-in link"

**Secure message waiting**
Tell a client a message is waiting in the portal without putting any care content in the SMS — the SMS is a doorbell, the content stays behind auth.
Sequence:
1. GAP:secure-message-waiting — "A message is waiting" — sent when the therapist posts a secure message; body is a neutral pointer to the portal.

**Account + access**
Phone proof, portal 2FA, and billing/account lifecycle on the client account.
Sequence:
1. verification:verification-code — "Verification code" — phone-ownership proof at signup.
2. verification:login-code — "Sign-in code" — SMS second factor for portal access.
3. account-events:payment-failed — "Payment failed" — card declined on the client's plan/copay.
4. account-events:subscription-confirmed — "Plan updated" — renewal, plan change, or cancellation.
5. account-events:new-device-sign-in — "New sign-in" — portal accessed from a new device.
Variable aliases: none — defaults fit.

**Therapist-availability waitlist**
Hold clients waiting for a therapist match or an opening, and pull them in when a slot frees.
Sequence:
1. waitlist:joined — "You're on the list" — client added to the availability waitlist.
2. waitlist:almost-up — "You're almost up" — approaching turn.
3. waitlist:your-turn — "A spot opened" — match/opening available, claim link.
4. waitlist:grace-expiring — "Spot still open" — claim window closing.
5. waitlist:missed — "Spot expired" — lapsed without action, rejoin link.
Variable aliases (only where default feels wrong):
- claim_link: "portal booking link"

### Message gaps

**GAP:secure-message-waiting**
- **Classification:** Universal miss
- **Proposed corpus home:** appointments:secure-message-waiting (or a future care-messaging category if one is created)
- **Proposed universal name:** "Secure message waiting"
- **Why:** secure in-portal messaging is core to every teletherapy product, and SMS is the standard doorbell for it, but the corpus has no "a message is waiting, view in portal" notification — appointments covers scheduling, not message-arrival.
- **Draft variants:**
  - Standard: `{{workspace_name}}: a new message is waiting for you. View it securely in your portal: {{portal_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: you have a new message. Read it securely in your portal: {{portal_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: new message waiting. {{portal_link}} STOP to opt out.`
- **New variables:** portal_link: "secure portal deep-link"
- **Status:** FUTURE — do not add to corpus until bucket changes.

**STRETCH:appointments:post-appointment**
- **Classification:** Stretch
- **Proposed corpus home:** appointments:post-appointment, used as a between-session check-in prompt; fit gap is that the corpus body frames it as "feedback" on a completed visit, whereas teletherapy uses it as a recurring clinical check-in form trigger.
- **Proposed universal name:** "Post-session check-in" (display alias over the feedback message)
- **Why:** the existing message points at a feedback link; the teletherapy use is a between-session check-in, a close-but-not-exact reframe of the same trigger.
- **Draft variants:**
  - Standard: `{{workspace_name}}: thanks for your session today. When you have a moment, your check-in is ready: {{portal_link}} Reply STOP to opt out.`
  - Friendly: `{{workspace_name}}: hope your session went well. Your check-in is ready whenever you are: {{portal_link}} Reply STOP to opt out.`
  - Brief: `{{workspace_name}}: session done. Check-in ready: {{portal_link}} STOP to opt out.`
- **New variables:** portal_link: "secure portal deep-link"
- **Status:** FUTURE — do not add to corpus until bucket changes.

### Content constraints
- **BAA gating headline:** RelayKit declines healthcare/PHI relationships at intake until a future BAA program exists (D-18). Teletherapy and therapy-EHR clients are behavioral-health PHI relationships and are gated by the same rule — this entry is future-reference only.
- Behavioral-health is extra-sensitive: the mere association of a person with a therapy/mental-health sender can itself be a disclosure. Keep the sender frame neutral — never let the workspace name read as "[X] Mental Health Clinic" or "[Y] Addiction Recovery" in the body.
- Never reference the condition, the diagnosis, the modality, the therapist's specialization, or any content of care in any body. Generic "your session" / "a message is waiting" + portal link only.
- Never put the therapist's real name in the body where it would imply specialization; use a generic "your therapist" frame.
- 42 CFR Part 2 applies if the sender is a federally-assisted substance-use program: requires written, specific, documented, revocable patient consent before any texting; even "your appointment at [program] is confirmed" can violate Part 2. Verbal consent is not sufficient. This sits on top of HIPAA, not instead of it.
- Crisis-line / safety content is care communication, not marketing — it must never be classified or routed as promotional.
- 2FA carve-out: verification codes carry no STOP/HELP and reference no care content.
- No promotional content to this audience under any circumstance, even post-BAA.

### Disambiguation
This sub-vertical carries the same BAA gating as clinical care and pharmacies: a behavioral-health relationship is PHI, and RelayKit declines it at intake until a BAA program exists (D-18). The behavioral-health twist is that even a clean, generic session reminder can be sensitive, because the sender's identity alone implies the recipient is in mental-health or substance-use care — the disclosure risk lives in the "from," not just the body. Distinguish this from wellness, meditation, and mood-tracking apps (Calm/Headspace-class), which are non-clinical, carry no therapist relationship, and are Clear — those are not PHI senders. Also distinguish it from healthcare-admin tooling that never touches a patient. The trap a developer falls into: assuming a teletherapy reminder is safe because the body says nothing clinical — it is still PHI-relationship territory the moment the sender is a therapy provider, regardless of how hygienic the text is.

### Sources
https://www.betterhelp.com/advice/therapy/does-text-therapy-work/
https://en.wikipedia.org/wiki/BetterHelp
https://headway.co/resources/headway-vs-talkspace
https://www.therapynotes.com/
https://docresponse.com/blog/therapynotes-vs-simplepractice/
https://www.findemr.com/resources/best-ehr-systems-for-streamlining-therapy-scheduling-in-mental-health-practices/
https://curogram.com/blog/mental-health/hipaa-compliant-texting-for-behavioral-health
https://www.paubox.com/blog/enhancing-addiction-recovery-programs-with-text-messaging
https://www.accountablehq.com/post/behavioral-health-clinic-data-classification-policy-template-categories-and-hipaa-42-cfr-part-2-compliance
https://www.ecfr.gov/current/title-42/chapter-I/subchapter-A/part-2
https://zandahealth.com/us/features/online-forms/
https://www.theraplatform.com/features/client-portal
