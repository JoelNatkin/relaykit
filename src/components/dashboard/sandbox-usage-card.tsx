"use client";

interface SandboxUsageCardProps {
  messageCount: number;
}

const DAILY_LIMIT = 100;

export function SandboxUsageCard({ messageCount }: SandboxUsageCardProps) {
  const percentage = Math.min((messageCount / DAILY_LIMIT) * 100, 100);

  return (
    <div className="rounded-xl border border-secondary bg-primary p-5">
      <h3 className="text-sm font-semibold text-primary">
        {"Today's usage"}
      </h3>

      <div className="mt-3">
        {/* Progress bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-quaternary">
          <div
            className="h-full rounded-full bg-brand-solid transition-all duration-300 ease-linear"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-tertiary">
          <span className="font-medium text-secondary">{messageCount}</span>
          {" / "}
          {DAILY_LIMIT} messages
        </p>
      </div>

      <p className="mt-2 text-xs text-tertiary">
        Resets daily at midnight UTC.
      </p>
    </div>
  );
}
