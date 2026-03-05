"use client";

import { useEffect, useState } from "react";
import { Copy01, Check, Eye, EyeOff } from "@untitledui/icons";

interface KeyData {
  key: string;
  prefix: string;
  environment: "sandbox" | "live";
}

function maskKey(k: string, prefix: string): string {
  const rest = k.slice(prefix.length);
  return `${prefix}${rest.slice(0, 4)}${"•".repeat(Math.max(0, rest.length - 4))}`;
}

function KeyRow({ label, keyData, accentLive }: { label: string; keyData: KeyData | null; accentLive?: boolean }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (keyData?.key) {
      navigator.clipboard.writeText(keyData.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (!keyData) {
    return (
      <div>
        <p className="text-xs font-medium text-tertiary">{label}</p>
        <div className="mt-1 rounded-lg border border-secondary bg-secondary px-3 py-2">
          <span className="font-mono text-sm text-quaternary">Not available</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className={`text-xs font-medium ${accentLive ? "text-success-primary" : "text-tertiary"}`}>
        {label}
      </p>
      <div className="mt-1 flex items-center gap-2">
        <code className="flex-1 rounded-lg border border-secondary bg-secondary px-3 py-2 font-mono text-sm text-secondary">
          {revealed ? keyData.key : maskKey(keyData.key, keyData.prefix)}
        </code>
        <button
          type="button"
          onClick={() => setRevealed(!revealed)}
          className="rounded-lg p-2 text-fg-quaternary transition duration-100 ease-linear hover:text-fg-secondary"
          aria-label={revealed ? "Hide key" : "Reveal key"}
        >
          {revealed ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-lg p-2 text-fg-quaternary transition duration-100 ease-linear hover:text-fg-secondary"
          aria-label="Copy key"
        >
          {copied ? (
            <Check className="size-5 text-fg-success-secondary" />
          ) : (
            <Copy01 className="size-5" />
          )}
        </button>
      </div>
    </div>
  );
}

export function LiveApiKeyCard() {
  const [liveKey, setLiveKey] = useState<KeyData | null>(null);
  const [sandboxKey, setSandboxKey] = useState<KeyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchKeys() {
      try {
        const [liveRes, sandboxRes] = await Promise.all([
          fetch("/api/live-key"),
          fetch("/api/sandbox-key"),
        ]);

        if (liveRes.ok) {
          const data = await liveRes.json();
          if (data.key) {
            setLiveKey({
              key: data.key,
              prefix: data.prefix ?? "rk_live_",
              environment: "live",
            });
          }
        }

        if (sandboxRes.ok) {
          const data = await sandboxRes.json();
          if (data.key) {
            setSandboxKey({
              key: data.key,
              prefix: "rk_sandbox_",
              environment: "sandbox",
            });
          }
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchKeys();
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-secondary bg-primary p-5">
        <div className="h-5 w-40 animate-pulse rounded bg-tertiary" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-secondary bg-primary p-5">
      <h3 className="text-sm font-semibold text-primary">API keys</h3>
      <p className="mt-1 text-sm text-tertiary">
        Base URL:{" "}
        <code className="font-mono text-secondary">
          https://api.relaykit.dev/v1
        </code>
      </p>

      <div className="mt-4 space-y-4">
        <KeyRow label="Live key" keyData={liveKey} accentLive />
        <KeyRow label="Sandbox key" keyData={sandboxKey} />
      </div>
    </div>
  );
}
