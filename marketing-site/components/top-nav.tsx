import Link from "next/link";

export function TopNav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 h-14 border-b border-border-secondary bg-bg-primary">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-base font-bold tracking-tight text-text-primary transition duration-100 ease-linear hover:text-text-secondary"
        >
          RelayKit
        </Link>
        <Link
          href="/start/verify"
          className="rounded-lg bg-bg-brand-solid px-4 py-2 text-sm font-semibold text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
        >
          Get early access
        </Link>
      </div>
    </nav>
  );
}
