import { Button } from "@/components/base/buttons/button";

const TOOLS = ["Cursor", "Claude Code", "Lovable", "Replit", "Bolt"];

export function Hero() {
  return (
    <section className="bg-primary px-4 pb-16 pt-20 sm:px-6 sm:pb-24 sm:pt-28 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-display-md font-semibold tracking-tight text-primary sm:text-display-xl">
          Tell your AI to add SMS to your app.
        </h1>
        <p className="mt-5 text-lg text-tertiary sm:text-xl">
          Pick your messages. Generate a build spec. Your AI coding tool reads
          it, builds your SMS integration, and you test with a real API.
          Go live when you're ready. No credit card.
        </p>
        <div className="mt-8">
          <Button href="/signup" color="primary" size="xl">
            Start building free →
          </Button>
        </div>
        <div className="mt-10">
          <p className="mb-3 text-sm font-medium text-quaternary">
            Developers building with
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {TOOLS.map((tool) => (
              <span
                key={tool}
                className="rounded-full border border-secondary bg-secondary px-4 py-1.5 text-sm font-medium text-secondary"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
