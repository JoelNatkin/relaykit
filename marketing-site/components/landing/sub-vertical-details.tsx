import { Eyebrow } from "@/components/home/section-ui";
import type { SubVerticalLanding } from "@/lib/landing/sub-verticals";

// Generic, data-driven Q&A section (Phase 1C A2). Same card layout/classes as
// the dev-tools <Details/> in app/for/developer-tools/sections.tsx; the heading
// is the constant "Common questions" (the dev-tools static page keeps its own
// "Q&A: Account event messages" heading), and the cards come from entry.qa.
export function SubVerticalDetails({ entry }: { entry: SubVerticalLanding }) {
  return (
    <section className="mx-auto max-w-5xl border-t border-border-secondary px-6 py-20 sm:py-28">
      <div className="max-w-2xl">
        <Eyebrow>The details</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Common questions
        </h2>
      </div>
      {/* Each Q&A is its own card; items-start so a card sizes to its own
          content height — no forced equal heights across a row. */}
      <div className="mt-10 grid items-start gap-6 md:grid-cols-2">
        {entry.qa.map((item) => (
          <div
            key={item.q}
            className="rounded-2xl border border-border-secondary bg-surface-card p-6"
          >
            <h3 className="text-lg font-semibold text-text-primary">
              {item.q}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-text-secondary">
              <span className="font-semibold text-text-primary">
                {item.lead}
              </span>{" "}
              {item.body}
            </p>
            {item.list ? (
              <ul className="mt-3 space-y-1.5">
                {item.list.map((li) => (
                  <li
                    key={li}
                    className="flex items-center gap-2.5 text-base text-text-secondary"
                  >
                    <span
                      className="size-1.5 flex-none rounded-sm bg-bg-gold"
                      aria-hidden
                    />
                    {li}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
