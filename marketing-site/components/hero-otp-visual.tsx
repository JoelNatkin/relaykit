// Static OTP visual for the home-page hero. Non-interactive — six boxes
// displaying "5", "6", "6", "8", focused-with-caret, empty, plus a disabled
// "Continue" button. Box styling mirrors prototype/components/sign-in-modal.tsx
// lines 210–224 (the live OTP input in the sign-in modal).

const FILLED = ["5", "6", "6", "8"] as const;

export function HeroOtpVisual() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        {FILLED.map((digit, i) => (
          <div
            key={i}
            className="flex h-12 w-12 items-center justify-center rounded-lg border border-border-primary bg-bg-primary text-lg font-semibold text-text-primary"
          >
            {digit}
          </div>
        ))}
        {/* Focused, empty box — solid caret. */}
        <div className="relative flex h-12 w-12 items-center justify-center rounded-lg border border-border-brand bg-bg-primary ring-1 ring-border-brand">
          <span className="h-5 w-px animate-pulse bg-text-primary" aria-hidden="true" />
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border-primary bg-bg-primary text-lg font-semibold text-text-primary" />
      </div>
      <button
        type="button"
        disabled
        aria-disabled
        tabIndex={-1}
        className="w-full cursor-not-allowed rounded-lg bg-bg-brand-solid/40 px-4 py-2.5 text-sm font-semibold text-text-white"
      >
        Continue
      </button>
    </div>
  );
}
