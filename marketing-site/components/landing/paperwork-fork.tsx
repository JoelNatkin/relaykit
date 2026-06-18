import Link from "next/link";

// Fork: a single landing-OWNED link rendered AFTER the verbatim <Paperwork />
// (the shared home component is never modified). It forks the reader who wants
// the registration detail off the funnel. Constant across categories.
export function PaperworkFork() {
  return (
    // Pulled up tight under Paperwork's bottom padding and right-aligned to the
    // card grid's right edge (same max-w-5xl px-6 container → matching edge).
    <div className="mx-auto -mt-14 max-w-5xl px-6 pb-20 text-right sm:-mt-20 sm:pb-28">
      {/* v1 → /messages. Intended target: /10dlc-registration pain-point page. */}
      <Link
        href="/messages"
        className="text-sm font-medium text-gold transition duration-100 ease-linear hover:opacity-90"
      >
        What registration actually involves <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
