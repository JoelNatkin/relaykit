# Playbook Summary Section — Design Spec

**Date:** 2026-03-23
**Location:** Public Messages page, StepsLayout only (`/sms/[category]/messages`)
**Status:** Approved

## Purpose

Communicates the complete SMS system the developer gets — not just individual messages, but the full flow built by one prompt. Sits between the hero band and the Messages section as a conviction-building summary.

## Placement

Inserted between the gray hero band (`bg-bg-secondary`) and the post-download AI prompts band / two-column messages layout in the `StepsLayout` component. White background, open section (no card wrapper, no background color change).

## Data Structure

```ts
const PLAYBOOK_FLOWS: Record<string, {
  heading: string;
  tagline: string;
  steps: string[];
}> = {
  appointments: {
    heading: "Your complete appointment SMS system",
    tagline: "One prompt. Your AI tool builds the whole flow.",
    steps: [
      "Booking confirmed",
      "Reminder sent",
      "No response followed up",
      "No-show rebooked",
      "Cancellation handled",
    ],
  },
};
```

Flow labels describe system behavior, not message card titles. Each category gets its own entry. Other categories added later.

Graceful fallback: if no playbook data exists for the current `categoryId`, the section does not render.

## Layout

- Container: `max-w-5xl px-6 mx-auto py-8`
- Heading: `text-base font-semibold text-text-primary`
- Flow: horizontal on `sm:` breakpoint and up, vertical on mobile
- Steps: brand purple dot + `text-sm text-text-secondary` label, connected by thin brand-purple line or arrow
- Tagline: `text-sm text-text-tertiary italic`, below the flow
- Mobile: vertical stepper with left-side connector line

## Constraints

- No CTA button
- No card wrapper or background
- No modifications to existing sections
- StepsLayout only — does not touch logged-in Messages page
- Copy complies with Experience Principles (D-31): no "required", no "compliance" as bare noun, action-oriented language

## Files Modified

- `prototype/app/sms/[category]/messages/page.tsx` — add `PLAYBOOK_FLOWS` data, `PlaybookSummary` component, insert into StepsLayout render
