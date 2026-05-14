"use client";

import { useState } from "react";

export interface PlaybookStep {
  label: string;
  tooltip: string;
}

export const PLAYBOOK_FLOWS: Record<
  string,
  { heading: string; tagline: string; steps: PlaybookStep[] }
> = {
  appointments: {
    heading: "Your complete appointment SMS system",
    tagline: "One prompt. Your AI tool builds the whole flow.",
    steps: [
      { label: "Booking confirmed", tooltip: "Sent when a client books an appointment" },
      { label: "Reminder sent", tooltip: "Sent 24 hours before the appointment" },
      { label: "Pre-visit sent", tooltip: "Sent the morning of the appointment" },
      { label: "Reschedule handled", tooltip: "Sent when a client reschedules" },
      { label: "No-show followed up", tooltip: "Sent after a missed appointment" },
      { label: "Cancellation handled", tooltip: "Sent when an appointment is cancelled" },
    ],
  },
};

function FlowNode({ num, tooltip }: { num: number; tooltip: string }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="relative shrink-0"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="w-6 h-6 rounded-full bg-fg-brand-primary text-white flex items-center justify-center text-xs font-semibold">
        {num}
      </div>
      {hover && (
        <>
          {/* Mobile: tooltip to the right */}
          <div className="sm:hidden absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 rounded-md bg-white px-2.5 py-1.5 text-[12px] text-text-secondary shadow-md whitespace-nowrap pointer-events-none">
            {tooltip}
          </div>
          {/* Desktop: tooltip above */}
          <div className="hidden sm:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 rounded-md bg-white px-2.5 py-1.5 text-[12px] text-text-secondary shadow-md whitespace-nowrap pointer-events-none">
            {tooltip}
          </div>
        </>
      )}
    </div>
  );
}

export function PlaybookSummary({ categoryId }: { categoryId: string }) {
  const flow = PLAYBOOK_FLOWS[categoryId];
  if (!flow) return null;

  const lastIndex = flow.steps.length - 1;

  return (
    <div className="bg-bg-secondary py-8">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-lg font-semibold text-text-primary mb-2">
          {flow.heading}
        </h2>

        {/* Desktop: horizontal flow */}
        <div className="hidden sm:flex items-start mt-6">
          {flow.steps.map((step, i) => (
            <div key={step.label} className="flex items-start flex-1 min-w-0">
              <div className="flex flex-col items-start w-full">
                <div className="flex items-center w-full">
                  <FlowNode num={i + 1} tooltip={step.tooltip} />
                  {/* Connector line + arrow */}
                  {i < lastIndex && (
                    <div className="flex items-center flex-1 min-w-0 mx-1">
                      <div className="flex-1 h-px bg-fg-brand-primary" />
                      <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-fg-brand-primary shrink-0" />
                    </div>
                  )}
                </div>
                <span className="text-sm text-text-secondary mt-2 text-left max-w-[90px]">
                  {step.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: vertical flow */}
        <div className="sm:hidden mt-6 flex flex-col">
          {flow.steps.map((step, i) => (
            <div key={step.label} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <FlowNode num={i + 1} tooltip={step.tooltip} />
                {i < lastIndex && (
                  <div className="w-px h-6 bg-fg-brand-primary" />
                )}
              </div>
              <span className="text-sm text-text-secondary leading-6">
                {step.label}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-5 text-sm text-text-tertiary italic">
          {flow.tagline}
        </p>
      </div>
    </div>
  );
}
