import { Eyebrow } from "@/components/home/section-ui";
import type { CategoryLanding, CategoryQA } from "@/lib/landing/categories";

// One Q&A card: bold lead + body + an optional gold-dot bullet list.
function QaCard({ item }: { item: CategoryQA }) {
  return (
    <div className="rounded-2xl border border-border-secondary bg-surface-card p-6">
      {item.category ? (
        <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-text-tertiary">
          <span className="size-1.5 rounded-full bg-gold" />
          {item.category}
        </p>
      ) : null}
      <h3 className="text-lg font-semibold text-text-primary">{item.q}</h3>
      <p className="mt-3 text-base leading-relaxed text-text-secondary">
        <span className="font-semibold text-text-primary">{item.lead}</span>{" "}
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
  );
}

// "The details" Q&A section (bucket 2a). Heading + the rich Q&A come from the
// registry. Two independently-packed columns at md+ (left = items 1 & 3, right
// = items 2 & 4) so a tall card (e.g. one carrying a bullet list) doesn't force
// a dead gap beside a short one — desktop reading order stays Q1, Q2, Q3, Q4.
export function CategoryDetails({ entry }: { entry: CategoryLanding }) {
  const left = entry.qa.filter((_, i) => i % 2 === 0);
  const right = entry.qa.filter((_, i) => i % 2 === 1);
  return (
    <section className="mx-auto max-w-5xl border-t border-border-secondary px-6 py-20 sm:py-28">
      <div className="max-w-2xl">
        <Eyebrow>The details</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          {entry.detailsHeading}
        </h2>
      </div>
      <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-start">
        <div className="flex flex-col gap-6 md:flex-1">
          {left.map((item) => (
            <QaCard key={item.q} item={item} />
          ))}
        </div>
        <div className="flex flex-col gap-6 md:flex-1">
          {right.map((item) => (
            <QaCard key={item.q} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
