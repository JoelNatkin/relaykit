import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-xl px-6 pt-24 pb-16">
      <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
        We&apos;ll be ready soon.
      </h1>
      <p className="mt-4 text-base text-text-tertiary">
        Sign-up isn&apos;t open yet. Want a heads-up the day it is?
      </p>
      <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
        <Link
          href="/start/verify"
          className="rounded-lg bg-bg-brand-solid px-5 py-2.5 text-sm font-semibold text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
        >
          Get early access
        </Link>
        <Link
          href="/"
          className="text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
