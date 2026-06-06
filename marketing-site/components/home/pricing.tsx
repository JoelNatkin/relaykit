import { Eyebrow } from "@/components/home/section-ui";

// Verbatim v10 copy; canon-clean against PRICING_MODEL v6.0 + D-215 ("a few
// days", no day count). Ticks are gold (D-427 accent system); the price figure
// stays monochrome (emphasis via weight).
const INCLUDES = [
  "500 messages a month",
  "Your own sending number",
  "Delivery, opt-outs & quiet hours",
  "A hosted compliance site",
  "Carrier rule-change tracking",
];

export function Pricing() {
  return (
    <section
      id="pricing"
      className="mx-auto max-w-5xl border-t border-border-secondary px-6 py-20 sm:py-28"
    >
      <div className="max-w-2xl">
        <Eyebrow>Pricing</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Simple pricing.
        </h2>
      </div>
      <div className="mt-10 grid grid-cols-1 items-start gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="overflow-hidden rounded-2xl border border-border-secondary bg-bg-primary dark:bg-bg-secondary">
          <div className="p-7">
            <div className="font-mono text-xs uppercase tracking-[0.13em] text-gold">
              Stage 1
            </div>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-text-primary">
              Build for free
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-text-secondary">
              Set up your messages. Add the code to your app. Test with real
              phones. No credit card.
            </p>
          </div>
          <div className="border-t border-border-secondary p-7">
            <div className="font-mono text-xs uppercase tracking-[0.13em] text-gold">
              Stage 2
            </div>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-text-primary">
              Go live for $49 + $19/mo
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-text-secondary">
              We file your registration with carriers. Approval takes a few
              days. 500 messages included per month, then $8 per additional 500.
              Full refund if you&apos;re not approved.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
            What $19/mo includes.
          </h2>
          <div className="mt-5">
            {INCLUDES.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 border-t border-dashed border-border-secondary py-3.5 text-base text-text-secondary last:border-b last:border-dashed last:border-border-secondary"
              >
                <span className="flex-none text-gold" aria-hidden>
                  ✓
                </span>
                {item}
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-md text-xs leading-relaxed text-text-tertiary">
            Marketing messages add $10/mo. Volume pricing above 5,000 messages.
            US and Canada at launch. We don&apos;t handle HIPAA,
            healthcare-regulated workflows, or enterprise procurement.
          </p>
        </div>
      </div>
    </section>
  );
}
