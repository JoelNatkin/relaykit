"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/base/buttons/button";
import { Copy01, Check, Eye, EyeOff, RefreshCw01 } from "@untitledui/icons";

export function SandboxApiKeyCard() {
  const [key, setKey] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchKey();
  }, []);

  async function fetchKey() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/sandbox-key");
      if (res.ok) {
        const data = await res.json();
        setHasKey(data.hasKey);
        if (data.key) setKey(data.key);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGenerate() {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/sandbox-key", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setKey(data.key);
        setHasKey(true);
        setRevealed(true);
      }
    } finally {
      setIsGenerating(false);
    }
  }

  function handleCopy() {
    if (key) {
      navigator.clipboard.writeText(key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function maskKey(k: string): string {
    // Show prefix + first 4 chars of random, mask the rest
    const prefix = "rk_sandbox_";
    const rest = k.slice(prefix.length);
    return `${prefix}${rest.slice(0, 4)}${"•".repeat(rest.length - 4)}`;
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border border-secondary bg-primary p-5">
        <div className="h-5 w-40 animate-pulse rounded bg-tertiary" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-secondary bg-primary p-5">
      <h3 className="text-sm font-semibold text-primary">
        Your sandbox API key
      </h3>

      {hasKey && key ? (
        <>
          <div className="mt-3 flex items-center gap-2">
            <code className="flex-1 rounded-lg border border-secondary bg-secondary px-3 py-2 font-mono text-sm text-secondary">
              {revealed ? key : maskKey(key)}
            </code>
            <button
              type="button"
              onClick={() => setRevealed(!revealed)}
              className="rounded-lg p-2 text-fg-quaternary transition duration-100 ease-linear hover:text-fg-secondary"
              aria-label={revealed ? "Hide key" : "Reveal key"}
            >
              {revealed ? (
                <EyeOff className="size-5" />
              ) : (
                <Eye className="size-5" />
              )}
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

          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-tertiary">
              Base URL:{" "}
              <code className="font-mono text-secondary">
                https://api.relaykit.dev/v1
              </code>
            </p>
            <button
              type="button"
              onClick={handleGenerate}
              className="flex items-center gap-1 text-sm text-brand-secondary transition duration-100 ease-linear hover:text-brand-secondary_hover"
            >
              <RefreshCw01 className="size-3.5" />
              Regenerate
            </button>
          </div>

          <p className="mt-2 text-xs text-tertiary">
            Sandbox messages deliver to your verified phone only.
          </p>
        </>
      ) : (
        <>
          <p className="mt-1 text-sm text-tertiary">
            Generate a key to start sending sandbox messages.
          </p>
          <Button
            size="sm"
            color="primary"
            onClick={handleGenerate}
            isLoading={isGenerating}
            showTextWhileLoading
            className="mt-3"
          >
            Generate API key
          </Button>
        </>
      )}
    </div>
  );
}
