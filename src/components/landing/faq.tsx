"use client";

import { useState } from "react";
import { ChevronDown } from "@untitledui/icons";
import { cx } from "@/utils/cx";

const FAQ_ITEMS = [
  {
    q: "Can I try before paying?",
    a: "Yes \u2014 the sandbox is free, no credit card. Pick your use case, customize your messages, generate a build spec, and build your entire SMS integration before paying anything. You only pay when you\u2019re ready to send to real users.",
  },
  {
    q: "Does this work with my AI coding tool?",
    a: 'Yes. The build spec is a markdown file designed for AI coding assistants. It works with Cursor, Claude Code, Copilot, Lovable, Bolt, Replit, and any tool that can read project files. Tell your AI: \u201cRead SMS_BUILD_SPEC.md and build my SMS feature.\u201d',
  },
  {
    q: "What\u2019s in the build spec?",
    a: "Everything your AI coding tool needs: your message templates with trigger logic, the API endpoint and authentication, error handling, webhook setup for inbound messages, and an opt-in form template. It\u2019s use-case-specific \u2014 a dental appointment reminder app gets different templates than an e-commerce order notification app.",
  },
  {
    q: "How long does registration take?",
    a: "Approximately 2\u20133 weeks after you complete the intake. Your sandbox continues to work while you wait \u2014 keep building. When approved, swap one API key and you\u2019re live.",
  },
  {
    q: "Do I need a Twilio account?",
    a: "No. We handle everything. Your app talks to RelayKit\u2019s API \u2014 we handle Twilio, carriers, and compliance behind the scenes.",
  },
  {
    q: "What if my registration gets rejected?",
    a: "We fix it and resubmit at no extra cost. Our templates are optimized for first-time approval, but if carriers want changes, we handle it.",
  },
  {
    q: "Do I need an EIN or business entity?",
    a: "No. We support sole proprietor registration \u2014 no EIN or LLC needed. You\u2019re limited to one campaign and one phone number, which is plenty for most indie apps.",
  },
  {
    q: "What compliance does RelayKit handle?",
    a: "Every message through our API is checked for opt-out violations, prohibited content, quiet hours, and rate limits. Violations are blocked before reaching carriers. We also run drift detection to catch messages gradually moving outside your registered use case.",
  },
  {
    q: "Can I validate my message templates before deploying?",
    a: "Yes \u2014 the message preview endpoint checks any message against your registration and compliance rules, and returns compliant alternatives if anything needs to change.",
  },
  {
    q: "What if I already have a Twilio account?",
    a: "We\u2019re building a registration-only option for developers with existing Twilio accounts. We\u2019ll handle the 10DLC paperwork and compliance artifacts \u2014 you keep your Twilio setup. Scroll up to the pricing section to get notified when it launches.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="border-t border-secondary bg-secondary px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-display-xs font-semibold text-primary sm:text-display-sm">
          Questions
        </h2>
        <div className="mt-10 divide-y divide-secondary">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="py-5">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between text-left"
              >
                <span className="text-md font-medium text-primary">
                  {item.q}
                </span>
                <ChevronDown
                  className={cx(
                    "ml-4 size-5 shrink-0 text-fg-quaternary transition duration-100 ease-linear",
                    openIndex === i && "rotate-180"
                  )}
                />
              </button>
              {openIndex === i && (
                <p className="mt-2 text-md text-tertiary">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
