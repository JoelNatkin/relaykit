import { Check } from "@untitledui/icons";

const TIERS = [
  {
    name: "Instant",
    price: "Free",
    priceDetail: "No credit card",
    items: [
      "Sandbox API key (real, working API)",
      "Message plan builder — pick and customize your messages",
      "Build spec for your AI coding tool",
      "SMS compliance guidelines for your project",
      "Full outbound + inbound message testing",
      "Opt-out handling (STOP/START)",
      "Same compliance checks as production",
      "No time limit",
    ],
  },
  {
    name: "Setup",
    price: "$199",
    priceDetail: "One-time",
    items: [
      "10DLC brand and campaign registration",
      "Hosted compliance site with privacy policy and terms",
      "Carrier-approved campaign descriptions and sample messages",
      "Your curated messages become carrier-registered messages",
      "SMS opt-in form with all disclosures",
      "Rejection handling — we fix and resubmit, no extra cost",
      "MESSAGING_SETUP.md — production build spec for your AI coding tool",
    ],
  },
  {
    name: "Monthly",
    price: "$19",
    priceDetail: "/month",
    items: [
      "Dedicated phone number",
      "500 messages included",
      "Compliance proxy — every message checked before delivery",
      "Opt-out enforcement, quiet hours, content scanning",
      "Drift detection — alerts if messages leave your approved use case",
      "Message preview endpoint — validate templates before deploying",
      "Auto-scaling — $15 per additional 1,000 messages",
    ],
  },
];

export function WhatYouGet() {
  return (
    <section id="pricing" className="border-t border-secondary bg-secondary px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-display-xs font-semibold text-primary sm:text-display-sm">
          Everything you need. Nothing you don't.
        </h2>
        <div className="mt-12 grid gap-6 sm:mt-16 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className="rounded-xl border border-secondary bg-primary p-6"
            >
              <p className="text-sm font-semibold text-brand-secondary">
                {tier.name}
              </p>
              <p className="mt-2 flex items-baseline gap-1">
                <span className="text-display-sm font-semibold text-primary">
                  {tier.price}
                </span>
                <span className="text-md text-tertiary">
                  {tier.priceDetail}
                </span>
              </p>
              <ul className="mt-6 space-y-3">
                {tier.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-tertiary">
                    <Check className="mt-0.5 size-5 shrink-0 text-fg-brand-secondary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
