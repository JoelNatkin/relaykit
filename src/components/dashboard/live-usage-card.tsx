"use client";

import { useEffect, useState } from "react";

interface UsageData {
  messageCount: number;
  blocksBilled: number;
  periodStart: string;
  periodEnd: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function LiveUsageCard() {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUsage() {
      try {
        const res = await fetch("/api/usage");
        if (res.ok) {
          const data = await res.json();
          setUsage(data);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsage();
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-secondary bg-primary p-5">
        <div className="h-5 w-40 animate-pulse rounded bg-tertiary" />
      </div>
    );
  }

  if (!usage) {
    return (
      <div className="rounded-xl border border-secondary bg-primary p-5">
        <h3 className="text-sm font-semibold text-primary">Usage</h3>
        <p className="mt-1 text-sm text-tertiary">
          No usage data available yet. Send your first message to start
          tracking.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-secondary bg-primary p-5">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-primary">Usage</h3>
        <span className="text-xs text-tertiary">
          {formatDate(usage.periodStart)} – {formatDate(usage.periodEnd)}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-2xl font-semibold text-primary">
            {usage.messageCount.toLocaleString()}
          </p>
          <p className="text-xs text-tertiary">Messages sent</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-primary">
            {usage.blocksBilled.toLocaleString()}
          </p>
          <p className="text-xs text-tertiary">Blocks billed</p>
        </div>
      </div>
    </div>
  );
}
