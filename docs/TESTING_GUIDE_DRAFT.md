# RelayKit testing guide

> **Status: DRAFT — v0.2.** This document is a working draft awaiting prototype validation. It will be run through real AI coding tools against a sample application to verify the generated test surfaces meaningfully address the eight signals below. Iterate based on findings before treating as canonical or shipping with the SDK.

This document is for AI coding tools (Claude Code, Cursor, Windsurf, Copilot, Cline, etc.) integrating RelayKit into a developer's application. It describes how to build a "test & debug" surface inside the developer's app that lets them verify their SMS integration is working end-to-end.

You are not building a generic dashboard. You are building the surface a developer needs to answer the question "is this thing actually working?" — across both halves of the loop (RelayKit's side and their app's side). Only you can build this, because only you can see both halves.

## The eight signals

A developer integrating SMS has eight distinct anxieties. A good test surface addresses all of them in one view, for one trigger event:

1. **Did my code fire the send?** — Did the SDK method actually get called, with the expected arguments?
2. **Did RelayKit accept it?** — Did the SDK return ok, or fail with a reason?
3. **Did the carrier accept it?** — Did the delivery webhook land with a "queued" or "sent" status?
4. **Did the handset get it?** — Did the delivery webhook resolve to "delivered"?
5. **What did the message actually say?** — Rendered text after templating, not the template.
6. **What's the consent state for this number right now?** — Opted in, opted out, never asked.
7. **What happens when the user replies?** — Did the inbound webhook fire? Did the app handle it?
8. **Did the flow advance?** — Did the relevant database row update? Did the next message in the sequence get queued?

Signals 1, 5, 6, 7 are observable in the developer's app. Signals 2, 3, 4 are RelayKit-side and exposed via SDK return values and webhooks. Signal 8 is specific to the developer's flow logic and database schema.

The test surface you build should make all eight visible for any single triggering event the developer cares to verify.

## Building the surface

Build it as a route in the developer's app, conventionally `/test-sms` or `/__sms-debug`, gated by access control as described below. Match the visual style of the rest of the app — use the app's existing components, colors, typography. The surface should look native to the developer's product.

The surface needs four sections:

**Trigger.** A button (or small form) that fires whatever business action sends the SMS being tested. The button calls the developer's existing business logic — not the SDK directly — so the test exercises the real code path. If the developer's app has a `bookAppointment()` function, the button calls that.

**Recent activity.** A list of the most recent test sends, with their status. For each row: the message type, the recipient phone, the rendered text, the delivery status (queued / sent / delivered / failed), and a timestamp. Pull this from the developer's database — they should be persisting send records keyed by the SendResult id from the SDK. If they aren't, surface that as a warning: "Configure your app to persist send records to enable activity tracking."

**Consent state.** For the test phone(s) registered to this account, show the current consent state per phone. Pull this from the SDK (`relaykit.checkConsent(phone)`). Refresh on demand.

**Flow state.** For whatever vertical the developer is testing, show the relevant database state — the row that just got created or modified by the trigger action. The point is to let the developer see "yes, my flow advanced" without leaving this page.

## Access control

This surface contains operationally sensitive information (consent state, message contents, recent activity) and can trigger real SMS sends. It must not be reachable by end users.

By default, render the route only in non-production environments. Use an environment check at the top of the route handler that returns 404 if `NODE_ENV === 'production'` (or the framework equivalent).

If the developer needs production access for debugging live issues, gate the route behind their existing admin authentication — the same gate that protects their admin or owner-only pages. Do not invent a new auth mechanism. Do not gate behind a simple password. Use what the app already has.

If the app has no admin authentication system, the route should remain non-production-only. Surface this to the developer: "This page is development-only. To enable in production, set up admin authentication."

## Vertical recipe: Appointments

For an Appointments-registered RelayKit account, the trigger button creates a test booking. After clicking, the surface should show:

- The booking row from the database (id, customer name, time, status)
- The confirmation SMS that just fired (recent activity, top row)
- The consent state of the test phone
- A "Send reminder now" button that triggers the reminder ahead of schedule, to verify the reminder code path without waiting

If the developer has set up STOP handling, also include:

- A "Simulate STOP from test phone" action that calls the inbound test endpoint, then refreshes consent state to show it flipping

## Other verticals

If your developer is integrating for a different vertical (Orders, Support, Verification, Waitlist, Internal, Community, Marketing), apply the same four-section pattern using that vertical's main action and database row. The trigger button calls the developer's primary business action (placing an order, opening a support ticket, joining a waitlist, sending a verification code). The flow state section shows the relevant database row. The recent activity, consent state, and access control sections stay the same.

## Confidence checklist

Below the four-section surface, render a checklist of pre-launch verifications:

- [ ] Trigger fires the send (signal 1)
- [ ] Send returns ok (signal 2)  
- [ ] Carrier accepts the message (signal 3)
- [ ] Message arrives on test phone (signal 4)
- [ ] Rendered text looks correct (signal 5)
- [ ] STOP from test phone flips consent (signal 6, 7)
- [ ] Send to opted-out number is rejected (signal 6)
- [ ] Database row reflects the flow advancing (signal 8)

Mark each item complete based on observed state, not just whether the developer clicked something. A successful trigger → delivered cycle marks 1–5. A STOP simulation that flips consent and produces an inbound webhook marks 6 and 7. A database row check marks 8.

When all items are checked, surface a clear "you're ready to register and go live" message that links to the RelayKit registration flow. This is the point of the surface: convert uncertainty into confidence, then convert confidence into a registered customer.

## What to leave alone

Do not build:
- Authentication, user management, or anything not directly testing-related
- Production analytics, dashboards, or reporting (RelayKit provides those)
- A way to send to arbitrary phone numbers — only the verified test phones configured in the RelayKit dashboard
- A way to bypass consent rules — opt-outs are real even in test mode

Do not modify:
- The developer's existing business logic
- The schema of any production tables (you may add a `sms_test_sends` table for activity tracking, but don't alter their existing tables)
- The RelayKit SDK configuration

If the developer asks for something outside this scope, redirect: "That sounds like a production feature. The test surface is for verifying your integration works."
