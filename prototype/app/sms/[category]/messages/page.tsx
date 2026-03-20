"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  XClose,
  Download01,
  ShieldTick,
  Edit03,
  MessagePlusSquare,
  ClipboardCheck,
  Sliders04,
  ArrowDown,
} from "@untitledui/icons";
import { MESSAGES, CATEGORY_VARIANTS } from "@/data/messages";
import { useSession } from "@/context/session-context";
import { CatalogCard } from "@/components/catalog/catalog-card";
import { CatalogOptIn } from "@/components/catalog/catalog-opt-in";
import {
  formatMultipleCopyBlocks,
  interpolateTemplate,
} from "@/lib/catalog-helpers";
import { Footer } from "@/components/footer";

/* ── localStorage personalization ── */

const PERSONALIZE_KEY = "relaykit_personalize";

interface PersonalizeData {
  appName: string;
  website: string;
  serviceType: string;
}

function loadPersonalization(): PersonalizeData {
  try {
    const stored = localStorage.getItem(PERSONALIZE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // localStorage unavailable
  }
  return { appName: "", website: "", serviceType: "" };
}

function savePersonalization(data: PersonalizeData) {
  try {
    localStorage.setItem(PERSONALIZE_KEY, JSON.stringify(data));
  } catch {
    // localStorage unavailable
  }
}

/* ── Copy feedback hook ── */

function useCopyFeedback() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // Clipboard API unavailable
    }
  }, []);

  return { copied, copy };
}

/* ── Inline icons ── */

/* ── OTP digit input ── */

function OtpInput({ value, onChange, onComplete }: { value: string; onChange: (v: string) => void; onComplete: () => void }) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(6, "").slice(0, 6).split("");

  function handleInput(index: number, char: string) {
    if (!/^\d$/.test(char)) return;
    const next = digits.slice();
    next[index] = char;
    const joined = next.join("").replace(/[^\d]/g, "");
    onChange(joined);
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    if (joined.length === 6) {
      onComplete();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (digits[index] && digits[index] !== " ") {
        const next = digits.slice();
        next[index] = " ";
        onChange(next.join("").trimEnd());
      } else if (index > 0) {
        const next = digits.slice();
        next[index - 1] = " ";
        onChange(next.join("").trimEnd());
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) {
      onChange(pasted);
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
      if (pasted.length === 6) onComplete();
    }
  }

  return (
    <div className="flex gap-2 justify-center">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i]?.trim() || ""}
          onChange={() => {}}
          onInput={(e) => handleInput(i, (e.target as HTMLInputElement).value.slice(-1))}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className="w-12 h-14 rounded-xl border bg-bg-primary text-center text-xl font-medium text-text-brand-tertiary shadow-xs transition duration-100 ease-linear focus:ring-2 focus:ring-brand-600 focus:border-brand-600 focus:outline-none border-border-primary"
          aria-label={`Digit ${i + 1} of 6`}
        />
      ))}
    </div>
  );
}

/* ── Shared tool data ── */

const TOOLS = [
  { id: "claude-code", label: "Claude Code" },
  { id: "cursor", label: "Cursor" },
  { id: "windsurf", label: "Windsurf" },
  { id: "copilot", label: "GitHub Copilot" },
  { id: "cline", label: "Cline" },
  { id: "other", label: "Other" },
];

const TOOL_INSTRUCTIONS: Record<string, { before: string; prompt: string }> = {
  "claude-code": {
    before: "Drop both files in your project root. Then run:",
    prompt: 'claude "Build my SMS integration using SMS_BUILD_SPEC.md and SMS_GUIDELINES.md"',
  },
  cursor: {
    before: "Drop both files in your project root. Open Composer:",
    prompt: "Build my SMS integration using SMS_BUILD_SPEC.md and SMS_GUIDELINES.md",
  },
  windsurf: {
    before: "Drop both files in your project root. Open Cascade:",
    prompt: "Build my SMS integration using SMS_BUILD_SPEC.md and SMS_GUIDELINES.md",
  },
  copilot: {
    before: "Drop both files in your project root. Open Copilot Chat:",
    prompt: "Build my SMS integration using SMS_BUILD_SPEC.md and SMS_GUIDELINES.md",
  },
  cline: {
    before: "Drop both files in your project root. Open Cline:",
    prompt: "Build my SMS integration using SMS_BUILD_SPEC.md and SMS_GUIDELINES.md",
  },
  other: {
    before: "Drop both files in your project root. Tell your AI coding tool:",
    prompt: "Build my SMS integration using SMS_BUILD_SPEC.md and SMS_GUIDELINES.md",
  },
};

/* ── Interactive tool selector (used in modal + post-download band) ── */

function InteractiveToolSelector() {
  const [selectedTool, setSelectedTool] = useState("claude-code");
  const [promptCopied, setPromptCopied] = useState(false);

  function copyPrompt() {
    navigator.clipboard.writeText(TOOL_INSTRUCTIONS[selectedTool].prompt).catch(() => {});
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 1500);
  }

  return (
    <div>
      <div className="flex items-center gap-4 overflow-x-auto">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            type="button"
            onClick={() => setSelectedTool(tool.id)}
            className={`flex flex-col items-center gap-1.5 min-w-[56px] cursor-pointer transition duration-100 ease-linear ${
              selectedTool === tool.id ? "opacity-100" : "opacity-60 hover:opacity-80"
            }`}
          >
            <div className={`flex items-center justify-center w-12 h-12 rounded-full transition duration-100 ease-linear ${
              selectedTool === tool.id
                ? "border-2 border-brand-600"
                : "border border-[#999999]"
            }`}>
              <ToolLogo id={tool.id} />
            </div>
            <span className={`text-[10px] font-medium whitespace-nowrap ${
              selectedTool === tool.id ? "text-text-primary" : "text-text-tertiary"
            }`}>
              {tool.label}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4">
        <p className="text-sm text-text-tertiary leading-relaxed mb-2">
          {TOOL_INSTRUCTIONS[selectedTool].before}
        </p>
        <div className="flex items-center gap-2 rounded-md bg-bg-secondary px-3 py-2">
          <code className="flex-1 text-sm font-mono text-text-secondary">
            {TOOL_INSTRUCTIONS[selectedTool].prompt}
          </code>
          <button
            type="button"
            onClick={copyPrompt}
            className="shrink-0 p-1 text-fg-quaternary hover:text-fg-secondary transition duration-100 ease-linear cursor-pointer"
            aria-label="Copy prompt"
          >
            {promptCopied ? (
              <svg className="w-3.5 h-3.5 text-fg-success-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            ) : (
              <ClipboardIcon className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Files-only confirmation (inside download modal) ── */

function FilesOnlyConfirmation({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center size-10 rounded-full bg-bg-success-secondary">
          <svg className="size-5 text-fg-success-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Your files are downloading</h3>
          <p className="text-sm text-text-tertiary">Get started with your AI coding tool.</p>
        </div>
      </div>

      <InteractiveToolSelector />

      <div>
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-lg bg-bg-brand-solid px-4 py-[14px] text-sm font-semibold text-text-white shadow-xs transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer"
        >
          Done
        </button>
        <p className="mt-2 text-center text-xs text-text-tertiary">You can find this again under Tool setup</p>
      </div>
    </div>
  );
}

/* ── AI commands card grid (shared with post-download band) ── */

const AI_COMMANDS = [
  {
    id: "compliance-review",
    icon: ShieldTick,
    heading: "Compliance review",
    prompt: "Review my messages for compliance",
  },
  {
    id: "write-message",
    icon: Edit03,
    heading: "Write a message",
    prompt: "Write a message that lets us tell users [goal]",
  },
  {
    id: "add-type",
    icon: MessagePlusSquare,
    heading: "Add a message type",
    prompt: "Add a new message type for [purpose]",
  },
  {
    id: "optin-check",
    icon: ClipboardCheck,
    heading: "Check opt-in copy",
    prompt: "Check my opt-in form for compliance",
  },
];

function AiCommandsGrid() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function copyCommand(id: string, prompt: string) {
    navigator.clipboard.writeText(prompt).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {AI_COMMANDS.map((cmd) => {
        const Icon = cmd.icon;
        const isCopied = copiedId === cmd.id;
        return (
          <div
            key={cmd.id}
            className="rounded-lg border border-border-secondary bg-bg-primary p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-bg-brand-secondary">
                <Icon className="size-4 text-fg-brand-primary" />
              </div>
              <div className="relative group">
                <button
                  type="button"
                  onClick={() => copyCommand(cmd.id, cmd.prompt)}
                  className="p-1 text-fg-quaternary hover:text-fg-secondary transition duration-100 ease-linear cursor-pointer"
                  aria-label="Copy prompt"
                >
                  {isCopied ? (
                    <svg className="w-3.5 h-3.5 text-fg-success-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  ) : (
                    <ClipboardIcon className="w-3.5 h-3.5" />
                  )}
                </button>
                <div className="absolute right-0 bottom-full mb-1 z-[100] hidden group-hover:block rounded-md bg-[#333333] px-2 py-1 text-[11px] text-white shadow-md whitespace-nowrap pointer-events-none">
                  Copy prompt
                </div>
              </div>
            </div>
            <h4 className="text-sm font-semibold text-text-primary">
              {cmd.heading}
            </h4>
            <p className="mt-1.5 text-sm text-text-tertiary italic leading-relaxed">
              &ldquo;{cmd.prompt}&rdquo;
            </p>
          </div>
        );
      })}
    </div>
  );
}

/* ── Download modal ── */

function DownloadModal({ isOpen, onClose, onFilesDownloaded }: { isOpen: boolean; onClose: () => void; onFilesDownloaded?: () => void }) {
  const [step, setStep] = useState<"default" | "code" | "downloading" | "files-only">("default");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => { setStep("default"); setEmail(""); setCode(""); }, 200);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  function handleGetRelayKit() {
    if (!email.trim()) return;
    console.log("Send magic code to:", email);
    setStep("code");
  }

  function handleConfirmCode() {
    if (!code.trim()) return;
    console.log("Confirm code:", code, "for email:", email);
    setStep("downloading");
    setTimeout(() => {
      console.log("Download triggered — welcome to sandbox");
    }, 1500);
  }

  function handleFilesOnly() {
    console.log("Download files only — no account");
    setStep("files-only");
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div
        className={`relative w-full rounded-xl bg-bg-primary shadow-xl p-8 sm:p-10 ${step === "files-only" ? "max-w-lg" : "max-w-md"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-1 text-fg-quaternary hover:text-fg-secondary transition duration-100 ease-linear cursor-pointer"
          aria-label="Close"
        >
          <XClose className="size-5" />
        </button>

        {/* State 1: Default */}
        {step === "default" && (
          <div>
            <h3 className="text-3xl font-semibold text-text-primary">Get more from RelayKit<br />with an account</h3>
            <p className="mt-1.5 text-sm text-text-tertiary">No credit card. No commitment. No pressure.</p>

            <div className="mt-5">
              <p className="text-sm font-semibold text-text-primary">RelayKit files give you:</p>
              <ul className="mt-2.5 space-y-2.5">
                {[
                  "Compliant message templates for appointments",
                  "Opt-in and opt-out copy, ready for your app",
                  "Full integration spec — your AI coding tool does the building",
                  "Personalized files ready to drop in your AI tool",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                    <svg className="mt-0.5 size-4 shrink-0 text-fg-brand-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5">
              <p className="text-sm font-semibold text-text-primary">Create an account and start testing in minutes:</p>
              <ul className="mt-2.5 space-y-2.5">
                {[
                  "Live sandbox — test real SMS instantly",
                  "A real phone number to test with",
                  "Your own API key",
                  "Your project saved to your dashboard",
                  "One-click carrier registration when you're ready",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                    <svg className="mt-0.5 size-4 shrink-0 text-fg-brand-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                onKeyDown={(e) => { if (e.key === "Enter") handleGetRelayKit(); }}
                className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs focus:border-border-brand focus:outline-none transition duration-100 ease-linear"
              />
            </div>

            <button
              type="button"
              onClick={handleGetRelayKit}
              className="mt-4 w-full rounded-lg bg-bg-brand-solid px-4 py-[14px] text-sm font-semibold text-text-white shadow-xs transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer"
            >
              Create Account & Download
            </button>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleFilesOnly}
                className="text-sm text-text-tertiary hover:underline cursor-pointer"
              >
                Just the files please
              </button>
            </div>
          </div>
        )}

        {/* State 2: Code entry */}
        {step === "code" && (
          <div>
            <h3 className="text-xl font-semibold text-text-primary">Check your email</h3>
            <p className="mt-2 text-sm text-text-tertiary">
              We sent a code to <span className="font-medium text-text-secondary">{email}</span>
            </p>

            <div className="mt-6">
              <label className="mb-2.5 block text-sm font-medium text-text-secondary text-center">Verification code</label>
              <OtpInput value={code} onChange={setCode} onComplete={handleConfirmCode} />
            </div>

            <button
              type="button"
              onClick={handleConfirmCode}
              className="mt-4 w-full rounded-lg bg-bg-brand-solid px-4 py-2.5 text-sm font-semibold text-text-white shadow-xs transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer"
            >
              Confirm
            </button>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => console.log("Resend code to:", email)}
                className="text-sm text-text-tertiary hover:underline cursor-pointer"
              >
                Resend code
              </button>
            </div>
          </div>
        )}

        {/* State 3: Downloading (account path) */}
        {step === "downloading" && (
          <div className="flex flex-col items-center py-4 text-center">
            <div className="flex items-center justify-center size-12 rounded-full bg-bg-success-secondary">
              <svg className="size-6 text-fg-success-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-text-primary">You&#39;re in. Downloading RelayKit...</h3>
            <p className="mt-2 text-sm text-text-tertiary">Welcome to your sandbox. You can start building right away.</p>
          </div>
        )}

        {/* State 4: Files only confirmation — with tool selector */}
        {step === "files-only" && (
          <FilesOnlyConfirmation onClose={() => { onFilesDownloaded?.(); onClose(); }} />
        )}
      </div>
    </div>
  );
}

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

/* ── Tool logos (real SVGs from /logos/) ── */

const TOOL_LOGO_MAP: Record<string, string> = {
  "claude-code": "/logos/claude-logo.svg",
  cursor: "/logos/cursor-logo.svg",
  windsurf: "/logos/windsurf-logo.svg",
  copilot: "/logos/github-copilot-logo.svg",
  cline: "/logos/cline-logo.svg",
};

function ToolLogo({ id }: { id: string }) {
  const logoSrc = TOOL_LOGO_MAP[id];

  // "Other" — generic code brackets
  if (!logoSrc) return (
    <svg className="w-6 h-6 text-text-quaternary" viewBox="0 0 24 24" fill="none">
      <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  // Windsurf gets 20% larger
  const sizeClass = id === "windsurf" ? "w-[34px] h-[34px]" : "w-7 h-7";

  return (
    <img src={logoSrc} alt={id} className={`${sizeClass} object-contain`} draggable={false} />
  );
}

/* ── Personalize slideout ── */

function PersonalizeSlideout({
  isOpen,
  onClose,
  data,
  onChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: PersonalizeData;
  onChange: (data: PersonalizeData) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 top-14 z-40 bg-white/50 transition-opacity duration-200"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        ref={panelRef}
        className={`fixed top-14 right-0 z-50 h-[calc(100%-3.5rem)] w-full max-w-sm bg-bg-primary border-l border-border-secondary shadow-xl transition-transform duration-200 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border-secondary px-6 py-4">
          <h2 className="text-base font-semibold text-text-primary">
            Personalize messages
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-fg-quaternary hover:text-fg-secondary transition duration-100 ease-linear cursor-pointer"
            aria-label="Close"
          >
            <XClose className="size-5" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-5">
          <p className="text-sm text-text-tertiary">
            Fill in your details to see how messages will look with your business name. Saved automatically.
          </p>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              App / business name
            </label>
            <input
              type="text"
              value={data.appName}
              placeholder="GlowStudio"
              onChange={(e) => onChange({ ...data, appName: e.target.value })}
              className="w-full rounded-lg border border-border-primary bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs focus:border-border-brand focus:outline-none transition duration-100 ease-linear"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              Website URL
            </label>
            <input
              type="text"
              value={data.website}
              placeholder="glowstudio.com"
              onChange={(e) => onChange({ ...data, website: e.target.value })}
              className="w-full rounded-lg border border-border-primary bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs focus:border-border-brand focus:outline-none transition duration-100 ease-linear"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              Service type
            </label>
            <input
              type="text"
              value={data.serviceType}
              placeholder="haircut, dental cleaning, massage"
              onChange={(e) => onChange({ ...data, serviceType: e.target.value })}
              className="w-full rounded-lg border border-border-primary bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs focus:border-border-brand focus:outline-none transition duration-100 ease-linear"
            />
          </div>

          {data.appName && (
            <p className="text-xs text-text-quaternary">
              Messages, opt-in form, and Blueprint CTA will update in real time.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

/* ── Steps layout (left: journey, right: proof) ── */

function StepsLayout({
  categoryId,
  categoryLabel,
  state,
  setField,
  personalizeData,
  onPersonalizeChange,
  coreMessages,
  expansionMessages,
  allMessages,
  variants,
  variantLabels,
  activeVariant,
  setActiveVariant,
  viewMode,
  setViewMode,
  getActiveTemplate,
  handleCopyAll,
}: {
  categoryId: string;
  categoryLabel: string;
  state: ReturnType<typeof useSession>["state"];
  setField: (key: string, value: string) => void;
  personalizeData: PersonalizeData;
  onPersonalizeChange: (data: PersonalizeData) => void;
  coreMessages: typeof MESSAGES[string];
  expansionMessages: typeof MESSAGES[string];
  allMessages: typeof MESSAGES[string];
  variants: typeof CATEGORY_VARIANTS[string] | undefined;
  variantLabels: Record<string, string>;
  activeVariant: string;
  setActiveVariant: (v: string) => void;
  viewMode: "preview" | "template";
  setViewMode: (v: "preview" | "template") => void;
  getActiveTemplate: (msg: typeof MESSAGES[string][number]) => string | undefined;
  handleCopyAll: () => void;
}) {
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [showPersonalize, setShowPersonalize] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const tools = TOOLS;

  return (
    <div>
      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        onFilesDownloaded={() => setHasDownloaded(true)}
      />

      <PersonalizeSlideout
        isOpen={showPersonalize}
        onClose={() => setShowPersonalize(false)}
        data={personalizeData}
        onChange={onPersonalizeChange}
      />

      {/* Header */}
      <div className="bg-bg-secondary py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-brand-secondary px-3 py-1 text-xs font-medium text-text-brand-secondary">
              <Calendar className="size-3.5" />
              {categoryLabel}
            </span>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Appointment messages, ready to send.
            </h1>
            <button
              type="button"
              onClick={() => setShowDownloadModal(true)}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-bg-brand-solid px-5 py-2.5 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover cursor-pointer"
            >
              <Download01 className="size-4" />
              Download RelayKit
            </button>
          </div>
          <p className="mt-3 text-base text-text-tertiary max-w-2xl">
            Everything your AI coding tool needs to add SMS — in two files.
          </p>

          {/* Logo row */}
          <div className="mt-6 flex items-center gap-5">
            {tools.map((tool) => (
              <div key={tool.id} className="flex flex-col items-center gap-1.5 min-w-[56px]">
                <div className="flex items-center justify-center w-12 h-12 rounded-full border border-[#999999]">
                  <ToolLogo id={tool.id} />
                </div>
                <span className="text-[10px] font-medium text-text-tertiary whitespace-nowrap">
                  {tool.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Post-download AI prompts band */}
      {hasDownloaded && (
        <div className="mx-auto max-w-5xl px-6 pt-10 pb-2">
          {/* Header row */}
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-semibold text-text-primary">AI prompts</h2>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => {/* toggle tool setup inline */}}
                className="text-sm font-semibold text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear cursor-pointer"
              >
                AI tool setup
              </button>
              <span className="text-text-quaternary">|</span>
              <button
                type="button"
                onClick={() => setShowDownloadModal(true)}
                className="text-sm font-semibold text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear cursor-pointer"
              >
                Download RelayKit
              </button>
            </div>
          </div>
          <p className="mb-4 text-sm text-text-secondary">Quick commands for your AI tool with RelayKit loaded in your project.</p>

          <AiCommandsGrid />

          {/* Tool selector below cards */}
          <div className="mt-4 mb-2 rounded-xl border border-border-secondary bg-bg-primary p-4">
            <InteractiveToolSelector />
          </div>
        </div>
      )}

      {/* Two-column layout */}
      <div className={`mx-auto max-w-5xl px-6 ${hasDownloaded ? "pt-6" : "pt-10"} pb-16`}>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px]">
          {/* LEFT COLUMN — messages */}
          <div>
            {/* Messages header */}
            <div className="mb-3">
              <h2 className="text-lg font-semibold text-text-primary">Messages</h2>
              <p className="mt-1 text-sm text-text-secondary">Copy, adapt, or have your AI tool riff. RelayKit keeps them compliant.</p>
            </div>

            {/* Style variant pills + marketing link */}
            {(variants && variants.length > 1 || expansionMessages.length > 0) && (
              <div className="mt-1 mb-5 flex items-center gap-2">
                {variants && variants.length > 1 && variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setActiveVariant(v.id)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition duration-100 ease-linear ${
                      activeVariant === v.id
                        ? "bg-bg-brand-secondary text-text-brand-secondary"
                        : "bg-bg-secondary text-text-secondary hover:bg-bg-secondary_hover"
                    }`}
                  >
                    {variantLabels[v.id] || v.label}
                  </button>
                ))}
                {expansionMessages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => document.getElementById("marketing-section-steps")?.scrollIntoView({ behavior: "smooth" })}
                    className="ml-auto flex items-center gap-1 text-sm font-semibold text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear cursor-pointer"
                  >
                    Marketing messages
                    <ArrowDown className="size-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Toolbar row */}
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowPersonalize(true)}
                className="flex items-center gap-1.5 text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer"
              >
                <Sliders04 className="size-4" />
                Personalize
              </button>
              <div className="flex items-center gap-5">
                <button
                  type="button"
                  onClick={() => setViewMode(viewMode === "preview" ? "template" : "preview")}
                  className="flex items-center gap-1.5 text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer"
                >
                  {viewMode === "preview" ? <CodeIcon /> : <EyeIcon />}
                  <span>{viewMode === "preview" ? "Show template" : "Show preview"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyAll}
                  className="flex items-center gap-1.5 text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer"
                >
                  <ClipboardIcon className="w-3.5 h-3.5" />
                  <span>Copy all</span>
                </button>
              </div>
            </div>

            {/* Core message cards */}
            <div className="space-y-3">
              {coreMessages.map((message) => (
                <CatalogCard
                  key={message.id}
                  message={message}
                  categoryId={categoryId}
                  state={state}
                  globalViewMode={viewMode}
                  activeTemplate={getActiveTemplate(message)}
                  isPromptsOpen={expandedCardId === message.id}
                  onTogglePrompts={() =>
                    setExpandedCardId((prev) =>
                      prev === message.id ? null : message.id
                    )
                  }
                />
              ))}
            </div>

            {/* Marketing callout */}
            {expansionMessages.length > 0 && (
              <div id="marketing-section-steps" className="mt-8 rounded-xl border border-border-secondary bg-bg-secondary p-6">
                <h3 className="text-base font-semibold text-text-primary">
                  Need promotional messages too?
                </h3>
                <p className="mt-1 text-sm text-text-tertiary">
                  Promos and offers require a separate registration. Get your app live first, then add marketing from your dashboard.
                </p>
                <div className="mt-4 space-y-3">
                  {expansionMessages.map((msg) => {
                    const segments = interpolateTemplate(msg.template, categoryId, state);
                    return (
                      <div
                        key={msg.id}
                        className="rounded-xl border border-border-secondary bg-bg-primary p-4"
                      >
                        <span className="text-sm font-medium text-text-primary">
                          {msg.name}
                        </span>
                        <p className="mt-2 text-sm text-text-tertiary leading-relaxed">
                          {segments.map((seg, i) =>
                            seg.isVariable ? (
                              <span key={i} className="font-normal text-text-brand-secondary">
                                {seg.text}
                              </span>
                            ) : (
                              <span key={i}>{seg.text}</span>
                            )
                          )}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN — opt-in only */}
          <div className="lg:self-start lg:sticky lg:top-20">
            <h2 className="text-lg font-semibold text-text-primary mb-1">
              Opt-in form
            </h2>
            <p className="mb-3 text-sm text-text-secondary">Carriers require an opt-in form before you can send messages. RelayKit generates and maintains yours.</p>
            <CatalogOptIn
              appName={state.appName}
              website={state.website}
              allMessages={coreMessages}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Page component ── */

export default function PublicMessagesPage() {
  const { category } = useParams<{ category: string }>();
  const { state, setField } = useSession();

  const categoryId = category || "appointments";
  const allMessages = MESSAGES[categoryId] || [];
  const variants = CATEGORY_VARIANTS[categoryId];

  const [activeVariant, setActiveVariant] = useState("standard");
  const [viewMode, setViewMode] = useState<"preview" | "template">("preview");
  const [showPersonalize, setShowPersonalize] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const { copy } = useCopyFeedback();

  // Load personalization from localStorage on mount, sync to session state
  const [personalizeLoaded, setPersonalizeLoaded] = useState(false);
  useEffect(() => {
    const saved = loadPersonalization();
    if (saved.appName) setField("appName", saved.appName);
    if (saved.website) setField("website", saved.website);
    if (saved.serviceType) setField("serviceType", saved.serviceType);
    setPersonalizeLoaded(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handlePersonalizeChange(data: PersonalizeData) {
    setField("appName", data.appName);
    setField("website", data.website);
    setField("serviceType", data.serviceType);
    savePersonalization(data);
  }

  const personalizeData: PersonalizeData = {
    appName: state.appName,
    website: state.website,
    serviceType: state.serviceType,
  };

  // Split: core/also_covered go in main list, expansion goes in marketing callout
  const coreMessages = allMessages.filter((m) => m.tier !== "expansion");
  const expansionMessages = allMessages.filter((m) => m.tier === "expansion");

  function getActiveTemplate(msg: typeof allMessages[number]): string | undefined {
    if (activeVariant === "standard" || !msg.variants) return undefined;
    return msg.variants[activeVariant] ?? undefined;
  }

  function handleCopyAll() {
    const text = formatMultipleCopyBlocks(coreMessages, categoryId, state);
    copy(text, "all");
  }

  // Map variant IDs to marketing-friendly labels
  const variantLabels: Record<string, string> = {
    standard: "Brand-first",
    "action-first": "Action-first",
    "context-first": "Context-first",
  };

  const categoryLabel =
    categoryId === "appointments"
      ? "Appointments"
      : categoryId.charAt(0).toUpperCase() + categoryId.slice(1);

  const displayName = state.appName || categoryLabel;
  const searchParams = useSearchParams();
  const layoutMode = searchParams.get("layout");

  // ── Steps layout (default) ──
  if (layoutMode !== "default") {
    return (
      <>
        <StepsLayout
          categoryId={categoryId}
          categoryLabel={categoryLabel}
          state={state}
          setField={setField}
          personalizeData={personalizeData}
          onPersonalizeChange={handlePersonalizeChange}
          coreMessages={coreMessages}
          expansionMessages={expansionMessages}
          allMessages={allMessages}
          variants={variants}
          variantLabels={variantLabels}
          activeVariant={activeVariant}
          setActiveVariant={setActiveVariant}
          viewMode={viewMode}
          setViewMode={setViewMode}
          getActiveTemplate={getActiveTemplate}
          handleCopyAll={handleCopyAll}
        />
        <Footer />
      </>
    );
  }

  // ── Default layout ──
  return (
    <div>
      {/* Personalize slideout */}
      <PersonalizeSlideout
        isOpen={showPersonalize}
        onClose={() => setShowPersonalize(false)}
        data={personalizeData}
        onChange={handlePersonalizeChange}
      />

      {/* Hero */}
      <div className="bg-bg-secondary py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-brand-secondary px-3 py-1 text-xs font-medium text-text-brand-secondary">
              <Calendar className="size-3.5" />
              {categoryLabel}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Appointment messages, ready to send.
          </h1>
          <p className="mt-3 text-base text-text-tertiary max-w-2xl">
            Everything below goes into two files your AI coding tool reads to build and maintain your messaging feature.{" "}
            <button
              type="button"
              onClick={() => alert("Auth gate → Download")}
              className="inline-flex items-center gap-1 font-semibold text-text-brand-secondary hover:text-text-brand-secondary_hover transition duration-100 ease-linear"
            >
              <Download01 className="size-3.5" />
              Download RelayKit for {categoryLabel}
            </button>
          </p>
          <p className="mt-2 text-xs text-text-quaternary">
            Free to browse. Sign in to download.
          </p>
        </div>
      </div>

      {/* Two-column layout: messages + opt-in */}
      <div className="mx-auto max-w-5xl px-6 pt-10 pb-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[55fr_45fr]">
          {/* Left column — message cards */}
          <div>
            {/* Messages header */}
            <div className="mb-3">
              <h2 className="text-lg font-semibold text-text-primary">Messages</h2>
              <p className="mt-1 text-sm text-text-secondary">Copy, adapt, or have your AI tool riff. RelayKit keeps them compliant.</p>
            </div>

            {/* Style variant pills + marketing link */}
            {(variants && variants.length > 1 || expansionMessages.length > 0) && (
              <div className="mb-5 flex items-center gap-2">
                {variants && variants.length > 1 && variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setActiveVariant(v.id)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition duration-100 ease-linear ${
                      activeVariant === v.id
                        ? "bg-bg-brand-secondary text-text-brand-secondary"
                        : "bg-bg-secondary text-text-secondary hover:bg-bg-secondary_hover"
                    }`}
                  >
                    {variantLabels[v.id] || v.label}
                  </button>
                ))}
                {expansionMessages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => document.getElementById("marketing-section-default")?.scrollIntoView({ behavior: "smooth" })}
                    className="ml-auto flex items-center gap-1 text-sm font-semibold text-text-brand-secondary hover:text-text-brand-primary transition duration-100 ease-linear cursor-pointer"
                  >
                    Marketing messages
                    <ArrowDown className="size-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Toolbar row */}
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowPersonalize(true)}
                className="flex items-center gap-1.5 text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer"
              >
                <Sliders04 className="size-4" />
                Personalize
              </button>
              <div className="flex items-center gap-5">
                <button
                  type="button"
                  onClick={() => setViewMode(viewMode === "preview" ? "template" : "preview")}
                  className="flex items-center gap-1.5 text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer"
                >
                  {viewMode === "preview" ? <CodeIcon /> : <EyeIcon />}
                  <span>{viewMode === "preview" ? "Show template" : "Show preview"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyAll}
                  className="flex items-center gap-1.5 text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer"
                >
                  <ClipboardIcon className="w-3.5 h-3.5" />
                  <span>Copy all</span>
                </button>
              </div>
            </div>

            {/* Core message cards */}
            <div className="space-y-3">
              {coreMessages.map((message) => (
                <CatalogCard
                  key={message.id}
                  message={message}
                  categoryId={categoryId}
                  state={state}
                  globalViewMode={viewMode}
                  activeTemplate={getActiveTemplate(message)}
                  isPromptsOpen={expandedCardId === message.id}
                  onTogglePrompts={() =>
                    setExpandedCardId((prev) =>
                      prev === message.id ? null : message.id
                    )
                  }
                />
              ))}
            </div>

            {/* Marketing callout */}
            {expansionMessages.length > 0 && (
              <div id="marketing-section-default" className="mt-8 rounded-xl border border-border-secondary bg-bg-secondary p-6">
                <h3 className="text-base font-semibold text-text-primary">
                  Need promotional messages too?
                </h3>
                <p className="mt-1 text-sm text-text-tertiary">
                  Promos and offers require a separate registration. Get your app live first, then add marketing from your dashboard.
                </p>
                <div className="mt-4 space-y-3">
                  {expansionMessages.map((msg) => {
                    const segments = interpolateTemplate(msg.template, categoryId, state);
                    return (
                      <div
                        key={msg.id}
                        className="rounded-xl border border-border-secondary bg-bg-primary p-4"
                      >
                        <span className="text-sm font-medium text-text-primary">
                          {msg.name}
                        </span>
                        <p className="mt-2 text-sm text-text-tertiary leading-relaxed">
                          {segments.map((seg, i) =>
                            seg.isVariable ? (
                              <span key={i} className="font-normal text-text-brand-secondary">
                                {seg.text}
                              </span>
                            ) : (
                              <span key={i}>{seg.text}</span>
                            )
                          )}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right column — sticky opt-in preview */}
          <div className="lg:self-start lg:sticky lg:top-20">
            <h2 className="mb-1 text-lg font-semibold text-text-primary">
              Opt-in form
            </h2>
            <p className="mb-3 text-sm text-text-secondary">Carriers require an opt-in form before you can send messages. RelayKit generates and maintains yours.</p>
            <CatalogOptIn
              appName={state.appName}
              website={state.website}
              allMessages={coreMessages}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
