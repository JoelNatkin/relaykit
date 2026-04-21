"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Copy01, Check, Code02 } from "@untitledui/icons";
import { useSession } from "@/context/session-context";

/* ── Copy button — icon swaps to checkmark for 2s after copy ── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="shrink-0 p-1 text-fg-tertiary hover:text-fg-secondary transition duration-100 ease-linear cursor-pointer"
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <Check className="size-4 text-fg-success-primary" />
      ) : (
        <Copy01 className="size-4" />
      )}
    </button>
  );
}

/* ── Prompt content (hardcoded for prototype) ── */

const PROMPT_TEXT = `I installed the RelayKit SDK. Add SMS to my app. I run a hair styling business called Club Woman. The SDK has my message templates — use them all.`;

const ENV_COPY_TEXT = `Add this API key to my .env file: RELAYKIT_API_KEY=rk_test_7Kx9mP2vL4qR8nJ5`;

/* ── Tool logos (same assets as home page hero) ── */

const TOOL_LOGO_MAP: Record<string, string> = {
  "claude-code": "/logos/claude-logo.svg",
  cursor: "/logos/cursor-logo.svg",
  windsurf: "/logos/windsurf-logo.svg",
  copilot: "/logos/github-copilot-logo.svg",
  cline: "/logos/cline-logo.svg",
};

const AI_TOOLS = [
  { id: "claude-code", name: "Claude Code" },
  { id: "cursor", name: "Cursor" },
  { id: "windsurf", name: "Windsurf" },
  { id: "copilot", name: "GitHub Copilot" },
  { id: "cline", name: "Cline" },
  { id: "other", name: "Other" },
];

function ToolLogo({ id }: { id: string }) {
  const logoSrc = TOOL_LOGO_MAP[id];
  if (!logoSrc) return <Code02 className="w-5 h-5 text-text-quaternary" />;
  const sizeClass = id === "windsurf" ? "w-[28px] h-[28px]" : "w-[22px] h-[22px]";
  return (
    <img src={logoSrc} alt={id} className={`${sizeClass} object-contain`} draggable={false} />
  );
}

/* ── Page ── */

export default function GetStartedPage() {
  const router = useRouter();
  const { appId } = useParams<{ appId: string }>();
  const { setRegistrationState } = useSession();

  function handleTransition(path: string) {
    setRegistrationState("building");
    router.push(path);
  }

  return (
    <div className="mx-auto max-w-[500px] px-6 py-12 pb-16">
      <h1 className="text-2xl font-bold text-text-primary">
        Start building
      </h1>
      <p className="mt-2 text-sm text-text-tertiary">
        Everything your AI tool needs to build your SMS feature.
      </p>

      {/* Tool logos */}
      <div className="mt-4 mb-5 flex items-center gap-3">
        {AI_TOOLS.map((tool) => (
          <div
            key={tool.id}
            title={tool.name}
            className="flex size-10 items-center justify-center rounded-full border border-[#c4c4c4] bg-white p-1"
          >
            <ToolLogo id={tool.id} />
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {/* Card 1: Install */}
        <div className="rounded-xl border border-border-secondary p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-text-primary">
              1. Install RelayKit
            </p>
            <CopyButton text="npm install relaykit" />
          </div>
          <p className="mt-1 mb-3 text-xs text-text-quaternary">
            Run this in your project&apos;s terminal.
          </p>
          <div className="overflow-x-auto rounded-lg bg-bg-secondary px-3 py-2">
            <span className="text-sm text-text-secondary whitespace-nowrap">
              npm install relaykit
            </span>
          </div>
        </div>

        {/* Card 2: Env */}
        <div className="rounded-xl border border-border-secondary p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-text-primary">
              2. Add your API key
            </p>
            <CopyButton text={ENV_COPY_TEXT} />
          </div>
          <p className="mt-1 mb-3 text-xs text-text-quaternary">
            Paste this prompt into your AI tool to add the key.
          </p>
          <div className="overflow-x-auto rounded-lg bg-bg-secondary px-3 py-2">
            <span className="text-sm text-text-secondary whitespace-nowrap">
              {ENV_COPY_TEXT}
            </span>
          </div>
        </div>

        {/* Card 3: Prompt */}
        <div className="rounded-xl border border-border-secondary p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-text-primary">
              3. Add SMS to your app
            </p>
            <CopyButton text={PROMPT_TEXT} />
          </div>
          <p className="mt-1 mb-3 text-xs text-text-quaternary">
            Paste this prompt into your AI tool to start building.
          </p>
          <div className="rounded-lg bg-bg-secondary px-3 py-2">
            <p className="text-sm text-text-secondary leading-relaxed">
              {PROMPT_TEXT}
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard CTA */}
      <button
        type="button"
        onClick={() => handleTransition(`/apps/${appId}`)}
        className="mt-8 w-full rounded-lg bg-bg-brand-solid px-5 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer"
      >
        View on dashboard
      </button>
    </div>
  );
}
