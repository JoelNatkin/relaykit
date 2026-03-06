export function Problem() {
  return (
    <section className="border-t border-secondary bg-secondary px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-display-xs font-semibold text-primary sm:text-display-sm">
          Every other SMS API makes you wait.
        </h2>
        <div className="mt-5 space-y-4 text-lg text-tertiary">
          <p>
            You want to add texting to your app. But first: register your
            business with carriers, build a compliance site, write a privacy
            policy, submit a campaign, wait 1–3 weeks, and hope it doesn't get
            rejected (40%+ do).
          </p>
          <p>
            Then you're on the hook for TCPA compliance — $500 to $1,500 per
            wrong text. Opt-out enforcement, quiet hours, content rules.
          </p>
          <p className="font-medium text-primary">
            Most developers give up on SMS entirely. You don't have to.
          </p>
        </div>
      </div>
    </section>
  );
}
