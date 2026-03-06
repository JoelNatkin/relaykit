const USE_CASES = [
  "Appointment reminders",
  "Order notifications",
  "Verification codes",
  "Customer support",
  "Marketing",
  "Team alerts",
  "Community",
  "Waitlists",
];

export function UseCases() {
  return (
    <section className="border-t border-secondary bg-primary px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-display-xs font-semibold text-primary sm:text-display-sm">
          Works for whatever you&apos;re building.
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {USE_CASES.map((uc) => (
            <span
              key={uc}
              className="rounded-full border border-secondary bg-secondary px-4 py-2 text-sm font-medium text-secondary"
            >
              {uc}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
