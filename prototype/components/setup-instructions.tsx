"use client";

import { useState, useEffect } from "react";
import { Copy01, Check, Code02 } from "@untitledui/icons";

/* ── Copy button ── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button type="button" onClick={handleCopy} className="shrink-0 p-1 text-fg-tertiary hover:text-fg-secondary transition duration-100 ease-linear cursor-pointer" aria-label="Copy to clipboard">
      {copied ? <Check className="size-4 text-fg-success-primary" /> : <Copy01 className="size-4" />}
    </button>
  );
}

/* ── Data ── */

const PROMPT_TEXT = `I installed the RelayKit SDK. Add SMS to my app. I run a hair styling business called Club Woman. The SDK has my message templates — use them all.`;
const ENV_TEXT = `Add this API key to my .env file: RELAYKIT_API_KEY=rk_sandbox_7Kx9mP2vL4qR8nJ5`;

const LOGO_MAP: Record<string, string> = {
  "claude-code": "/logos/claude-logo.svg",
  cursor: "/logos/cursor-logo.svg",
  windsurf: "/logos/windsurf-logo.svg",
  copilot: "/logos/github-copilot-logo.svg",
  cline: "/logos/cline-logo.svg",
};
const TOOLS = [
  { id: "claude-code", name: "Claude Code" },
  { id: "cursor", name: "Cursor" },
  { id: "windsurf", name: "Windsurf" },
  { id: "copilot", name: "GitHub Copilot" },
  { id: "cline", name: "Cline" },
  { id: "other", name: "Other" },
];

function ToolLogo({ id }: { id: string }) {
  const logoSrc = LOGO_MAP[id];
  if (!logoSrc) return <Code02 className="w-5 h-5 text-text-quaternary" />;
  const sizeClass = id === "windsurf" ? "w-[28px] h-[28px]" : "w-[22px] h-[22px]";
  return <img src={logoSrc} alt={id} className={`${sizeClass} object-contain`} draggable={false} />;
}

/* ── Toggle ── */

const STORAGE_PREFIX = "relaykit_setup_instructions_";

export function useSetupToggle(registrationState: string) {
  const defaultOn = registrationState === "building";
  const storageKey = `${STORAGE_PREFIX}${registrationState}`;
  const [visible, setVisible] = useState(defaultOn);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored !== null) {
        setVisible(stored === "true");
      } else {
        setVisible(defaultOn);
      }
    } catch {
      // sessionStorage unavailable
    }
  }, [storageKey, defaultOn]);

  function toggle() {
    const next = !visible;
    setVisible(next);
    try {
      sessionStorage.setItem(storageKey, String(next));
    } catch {
      // sessionStorage unavailable
    }
  }

  return { visible, toggle };
}

/* ── Toggle switch control ── */

export function SetupToggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-text-secondary">Setup instructions</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition duration-100 ease-linear ${
          checked ? "bg-bg-brand-solid" : "bg-bg-quaternary"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition duration-100 ease-linear mt-0.5 ${
            checked ? "translate-x-[16px] ml-0.5" : "translate-x-0 ml-0.5"
          }`}
        />
      </button>
    </div>
  );
}

/* ── Main component ── */

export function SetupInstructions({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div className="mb-6">
      <div className="rounded-xl bg-bg-secondary p-6 min-[860px]:max-w-[540px]">
          {/* Heading */}
          <h2 className="text-2xl font-bold text-text-primary">Start building</h2>
          <p className="mt-2 mb-5 text-sm text-text-tertiary">
            Everything your AI tool needs to build your SMS feature.
          </p>

          {/* Logo farm */}
          <div className="mb-5 flex items-center gap-3">
            {TOOLS.map((tool) => (
              <div key={tool.id} title={tool.name} className="flex size-10 items-center justify-center rounded-full border border-[#c4c4c4] bg-white p-1">
                <ToolLogo id={tool.id} />
              </div>
            ))}
          </div>

          {/* Three instruction cards — horizontal on desktop, stacked on mobile */}
          <div className="space-y-4">
            <div className="rounded-xl bg-white border border-border-secondary p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-text-primary">1. Install RelayKit</p>
                <CopyButton text="npm install relaykit" />
              </div>
              <p className="mt-1 mb-3 text-xs text-text-quaternary">Run this in your project&apos;s terminal.</p>
              <div className="overflow-x-auto rounded-lg bg-bg-secondary px-3 py-2">
                <span className="text-sm text-text-secondary whitespace-nowrap">npm install relaykit</span>
              </div>
            </div>

            <div className="rounded-xl bg-white border border-border-secondary p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-text-primary">2. Add your API key</p>
                <CopyButton text={ENV_TEXT} />
              </div>
              <p className="mt-1 mb-3 text-xs text-text-quaternary">Paste this prompt into your AI tool to add the key.</p>
              <div className="overflow-x-auto rounded-lg bg-bg-secondary px-3 py-2">
                <span className="text-sm text-text-secondary whitespace-nowrap">{ENV_TEXT}</span>
              </div>
            </div>

            <div className="rounded-xl bg-white border border-border-secondary p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-text-primary">3. Add SMS to your app</p>
                <CopyButton text={PROMPT_TEXT} />
              </div>
              <p className="mt-1 mb-3 text-xs text-text-quaternary">Paste this prompt into your AI tool to start building.</p>
              <div className="rounded-lg bg-bg-secondary px-3 py-2">
                <p className="text-sm text-text-secondary leading-relaxed">{PROMPT_TEXT}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
