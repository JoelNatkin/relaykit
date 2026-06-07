import Link from "next/link";

/**
 * Shared marketing-home primitives. Centralizing the eyebrow + CTA styles
 * keeps the gold accent system (D-427) in one place: PrimaryCta is the
 * gold-fill button; the eyebrow dot is gold.
 */

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-text-tertiary">
      <span className="size-1.5 rounded-sm bg-bg-gold" aria-hidden />
      {children}
    </span>
  );
}

// Primary CTA — solid gold fill + dark ink (D-427 site 1; overrides the v10
// outline style). Hover lifts one step via the /90 alpha.
const PRIMARY_CTA =
  "inline-flex items-center gap-2 rounded-lg bg-bg-gold px-5 py-3 text-sm font-semibold text-text-on-gold transition duration-100 ease-linear hover:bg-bg-gold/90";

// Ghost CTA — monochrome outline (secondary action). Not gilded.
const GHOST_CTA =
  "inline-flex items-center gap-2 rounded-lg border border-border-primary bg-transparent px-5 py-3 text-sm font-semibold text-text-secondary transition duration-100 ease-linear hover:border-border-primary hover:text-text-primary";

export function PrimaryCta({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={PRIMARY_CTA}>
      {children}
    </Link>
  );
}

export function GhostCta({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={GHOST_CTA}>
      {children}
    </Link>
  );
}
