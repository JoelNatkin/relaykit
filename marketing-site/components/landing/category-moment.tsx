import { Eyebrow } from "@/components/home/section-ui";
import type { CategoryLanding } from "@/lib/landing/categories";

// Constant demo business name in the example bubble (matches the hero mock).
const DEMO_BUSINESS = "Acme";

// "The moment" section (bucket 2a). Eyebrow + heading are constant; the body
// and the example SMS / reply bubbles come from the registry.
export function CategoryMoment({ entry }: { entry: CategoryLanding }) {
  return (
    <section className="mx-auto max-w-5xl border-t border-border-secondary px-6 py-20 sm:py-28">
      <div className="max-w-2xl">
        <Eyebrow>The moment</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          A text can change the outcome.
        </h2>
      </div>
      <div className="mt-10 grid items-start gap-10 md:grid-cols-2">
        <p className="text-lg leading-relaxed text-text-secondary">
          {entry.moment.body}
        </p>
        <div className="space-y-3">
          <div className="max-w-[88%] rounded-2xl rounded-bl-md border border-border-secondary bg-surface-card px-4 py-3 text-sm leading-relaxed text-text-primary">
            <span className="font-semibold">{DEMO_BUSINESS}</span>:{" "}
            {entry.moment.exampleSms}
          </div>
          <div className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-md bg-bg-gold px-4 py-2.5 text-sm font-medium text-text-on-gold">
            {entry.moment.exampleReply}
          </div>
        </div>
      </div>
    </section>
  );
}
