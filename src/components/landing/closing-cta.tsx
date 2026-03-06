import { Button } from "@/components/base/buttons/button";

export function ClosingCTA() {
  return (
    <section className="border-t border-secondary bg-primary px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-display-xs font-semibold text-primary sm:text-display-sm">
          Add SMS to your app. Let AI handle the code.
        </h2>
        <div className="mt-6">
          <Button href="/signup" color="primary" size="xl">
            Start building free →
          </Button>
        </div>
        <p className="mt-4 text-sm text-tertiary">
          Free sandbox. No credit card. Build spec in minutes.
        </p>
      </div>
    </section>
  );
}
