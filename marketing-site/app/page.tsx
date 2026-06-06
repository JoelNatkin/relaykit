import Link from "next/link";

// Wave 2 routing stub. The full v10 marketing home (hero / how-it-works /
// configurator peek / paperwork / AI / test / pricing / CTA) lands in Wave 3.
// Kept minimal and functional for routing until then; not pushed before the
// Wave 3 build replaces it.
export default function MarketingHome() {
  return (
    <div className="mx-auto max-w-5xl px-6 pt-16">
      <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
        SMS for your app,
        <br />
        minus the rulebook.
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-text-tertiary">
        Use these messages anywhere today. Send them through RelayKit Summer
        2026.
      </p>
      <Link
        href="/messages"
        className="mt-6 inline-flex items-center gap-1 text-lg font-medium text-text-secondary transition duration-100 ease-linear hover:text-text-primary"
      >
        Open the configurator →
      </Link>
    </div>
  );
}
