import Link from "next/link";
import { ArrowUpRight } from "@untitledui/icons";
import { Eyebrow } from "@/components/home/section-ui";
import { CATEGORY_LANDINGS } from "@/lib/landing/categories";

// Standing question links — placeholders to /messages until the concept pages
// ship (intended targets noted inline).
const FARM_QUESTIONS = [
  {
    label: "What 10DLC registration actually involves",
    href: "/messages", // intended: /10dlc-registration
  },
  {
    label: "How opt-outs and consent stay handled for you",
    href: "/messages", // intended: /consent-and-opt-outs
  },
];

// A Farm directory link: label + a trailing northeast arrow that nudges
// up-right on hover. Arrow is inline so the label wraps naturally.
function FarmLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group text-sm text-text-secondary transition duration-100 ease-linear hover:text-text-primary"
    >
      {children}
      <ArrowUpRight
        aria-hidden
        className="ml-0.5 inline-block size-3.5 align-[-2px] text-text-quaternary transition-transform duration-100 ease-linear group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </Link>
  );
}

// Farm: a quiet directory below the Closing CTA — a directory, not a CTA. Left
// column links to the other 8 category pages (real targets — the dynamic route
// generates all 9); right column carries the 2 standing question links.
export function CategoryFarm({ currentSlug }: { currentSlug: string }) {
  const others = CATEGORY_LANDINGS.filter((e) => e.urlSlug !== currentSlug);
  return (
    <section className="mx-auto max-w-5xl border-t border-border-secondary px-6 py-16 sm:py-20">
      <Eyebrow>Keep exploring</Eyebrow>
      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            Other messages RelayKit sends
          </h3>
          <ul className="mt-4 space-y-3">
            {others.map((e) => (
              <li key={e.urlSlug}>
                <FarmLink href={`/messages/${e.urlSlug}`}>{e.name}</FarmLink>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            Common questions
          </h3>
          <ul className="mt-4 space-y-3">
            {FARM_QUESTIONS.map((q) => (
              <li key={q.label}>
                <FarmLink href={q.href}>{q.label}</FarmLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
