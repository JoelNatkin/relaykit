"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  ShieldTick,
  Edit03,
  MessagePlusSquare,
  ClipboardCheck,
} from "@untitledui/icons";
import { MESSAGES, CATEGORY_VARIANTS } from "@/data/messages";
import { useSession } from "@/context/session-context";
import { CatalogCard } from "@/components/catalog/catalog-card";
import { CatalogOptIn } from "@/components/catalog/catalog-opt-in";
import {
  formatMultipleCopyBlocks,
  interpolateTemplate,
} from "@/lib/catalog-helpers";

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

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

/* ── Tool logos ── */

const TOOL_LOGO_MAP: Record<string, string> = {
  "claude-code": "/logos/claude-logo.svg",
  cursor: "/logos/cursor-logo.svg",
  windsurf: "/logos/windsurf-logo.svg",
  copilot: "/logos/github-copilot-logo.svg",
  cline: "/logos/cline-logo.svg",
};

function ToolLogo({ id }: { id: string }) {
  const logoSrc = TOOL_LOGO_MAP[id];
  if (!logoSrc)
    return (
      <svg className="w-6 h-6 text-text-quaternary" viewBox="0 0 24 24" fill="none">
        <path
          d="M16 18l6-6-6-6M8 6l-6 6 6 6"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  const sizeClass = id === "windsurf" ? "w-[34px] h-[34px]" : "w-7 h-7";
  return (
    <img src={logoSrc} alt={id} className={`${sizeClass} object-contain`} draggable={false} />
  );
}

/* ── AI commands — 2×2 card grid ── */

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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
      {AI_COMMANDS.map((cmd) => {
        const Icon = cmd.icon;
        const isCopied = copiedId === cmd.id;
        return (
          <div
            key={cmd.id}
            className="rounded-lg border border-border-secondary bg-bg-primary p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-bg-brand-secondary">
                <Icon className="size-5 text-fg-brand-primary" />
              </div>
              <button
                type="button"
                onClick={() => copyCommand(cmd.id, cmd.prompt)}
                className="p-1 text-fg-quaternary hover:text-fg-secondary transition duration-100 ease-linear cursor-pointer"
                aria-label={`Copy: ${cmd.prompt}`}
              >
                {isCopied ? (
                  <CheckIcon className="w-3.5 h-3.5 text-fg-success-primary" />
                ) : (
                  <ClipboardIcon className="w-3.5 h-3.5" />
                )}
              </button>
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

/* ── Tool setup panel (rendered when isOpen) ── */

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

function ToolPanel() {
  const [selectedTool, setSelectedTool] = useState("claude-code");
  const [promptCopied, setPromptCopied] = useState(false);

  function copyPrompt() {
    navigator.clipboard.writeText(TOOL_INSTRUCTIONS[selectedTool].prompt).catch(() => {});
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 1500);
  }

  return (
    <div className="mt-3 mb-8 rounded-xl border border-border-secondary bg-bg-primary p-4">
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
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full transition duration-100 ease-linear ${
                selectedTool === tool.id
                  ? "border-2 border-brand-600"
                  : "border border-[#999999]"
              }`}
            >
              <ToolLogo id={tool.id} />
            </div>
            <span
              className={`text-[10px] font-medium whitespace-nowrap ${
                selectedTool === tool.id ? "text-text-primary" : "text-text-tertiary"
              }`}
            >
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
              <CheckIcon className="w-3.5 h-3.5 text-fg-success-primary" />
            ) : (
              <ClipboardIcon className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Page ── */

export default function AppMessagesPage() {
  const { appId } = useParams<{ appId: string }>();
  const { state, setField } = useSession();

  const categoryId = state.selectedCategory || "appointments";
  const allMessages = MESSAGES[categoryId] || [];
  const variants = CATEGORY_VARIANTS[categoryId];

  const [isToolOpen, setIsToolOpen] = useState(false);
  const [activeVariant, setActiveVariant] = useState("standard");
  const [viewMode, setViewMode] = useState<"preview" | "template">("preview");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showCopyMenu, setShowCopyMenu] = useState(false);
  const copyMenuRef = useRef<HTMLDivElement>(null);

  const { copy } = useCopyFeedback();

  // Load personalization from localStorage on mount
  useEffect(() => {
    const saved = loadPersonalization();
    if (saved.appName) setField("appName", saved.appName);
    if (saved.website) setField("website", saved.website);
    if (saved.serviceType) setField("serviceType", saved.serviceType);
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

  // Split messages
  const coreMessages = allMessages.filter((m) => m.tier !== "expansion");
  const expansionMessages = allMessages.filter((m) => m.tier === "expansion");

  // Close copy menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (copyMenuRef.current && !copyMenuRef.current.contains(e.target as Node)) {
        setShowCopyMenu(false);
      }
    }
    if (showCopyMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showCopyMenu]);

  function toggleSelect(messageId: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(messageId)) next.delete(messageId);
      else next.add(messageId);
      return next;
    });
  }

  function getActiveTemplate(msg: (typeof allMessages)[number]): string | undefined {
    if (activeVariant === "standard" || !msg.variants) return undefined;
    return msg.variants[activeVariant] ?? undefined;
  }

  const selectedMessages = allMessages.filter((m) => selectedIds.has(m.id));
  const hasSelection = selectedIds.size > 0;

  function handleCopySelected() {
    const text = formatMultipleCopyBlocks(selectedMessages, categoryId, state);
    copy(text, "selected");
    setShowCopyMenu(false);
  }

  function handleCopyAll() {
    const text = formatMultipleCopyBlocks(coreMessages, categoryId, state);
    copy(text, "all");
    setShowCopyMenu(false);
  }

  const variantLabels: Record<string, string> = {
    standard: "Brand-first",
    "action-first": "Action-first",
    "context-first": "Context-first",
  };

  return (
    <div>
      {/* AI prompts header row */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-text-primary">AI prompts</h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsToolOpen((prev) => !prev)}
            className="text-sm font-medium text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer"
          >
            AI tool setup
          </button>
          <button
            type="button"
            onClick={() => console.log("Re-download triggered")}
            className="rounded-lg bg-bg-brand-solid px-3.5 py-2 text-sm font-semibold text-text-white shadow-xs hover:bg-bg-brand-solid_hover transition duration-100 ease-linear cursor-pointer"
          >
            Re-download RelayKit
          </button>
        </div>
      </div>

      <AiCommandsGrid />
      {isToolOpen && <ToolPanel />}

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[300px_1fr]">

        {/* LEFT — personalization + opt-in */}
        <div className="lg:self-start lg:sticky lg:top-20">
          <h2 className="text-lg font-semibold text-text-primary mb-3">
            Personalize
          </h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-text-secondary">
                App / business name
              </label>
              <input
                type="text"
                value={personalizeData.appName}
                placeholder="GlowStudio"
                onChange={(e) =>
                  handlePersonalizeChange({ ...personalizeData, appName: e.target.value })
                }
                className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs focus:border-border-brand focus:outline-none transition duration-100 ease-linear"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-text-secondary">
                Website URL
              </label>
              <input
                type="text"
                value={personalizeData.website}
                placeholder="glowstudio.com"
                onChange={(e) =>
                  handlePersonalizeChange({ ...personalizeData, website: e.target.value })
                }
                className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs focus:border-border-brand focus:outline-none transition duration-100 ease-linear"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-text-secondary">
                Service type
              </label>
              <input
                type="text"
                value={personalizeData.serviceType}
                placeholder="haircut, dental cleaning"
                onChange={(e) =>
                  handlePersonalizeChange({ ...personalizeData, serviceType: e.target.value })
                }
                className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-placeholder shadow-xs focus:border-border-brand focus:outline-none transition duration-100 ease-linear"
              />
            </div>
          </div>
          <p className="mt-2 text-xs text-text-quaternary">
            Preview only — your downloaded files use template variables.
          </p>

          {/* Opt-in form */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-text-primary mb-3">
              Sample opt-in form
            </h2>
            <CatalogOptIn
              appName={state.appName}
              website={state.website}
              allMessages={coreMessages}
              selectedIds={selectedIds}
            />
          </div>
        </div>

        {/* RIGHT — messages */}
        <div>
          {/* Messages header + toolbar */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-text-primary">
              Messages
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setViewMode(viewMode === "preview" ? "template" : "preview")
                }
                className="p-1 rounded text-fg-quaternary hover:text-fg-tertiary transition duration-100 ease-linear cursor-pointer"
                aria-label={viewMode === "preview" ? "Show template" : "Show preview"}
              >
                {viewMode === "preview" ? <CodeIcon /> : <EyeIcon />}
              </button>

              <div className="relative" ref={copyMenuRef}>
                <button
                  type="button"
                  onClick={() => setShowCopyMenu((prev) => !prev)}
                  className="flex items-center gap-0.5 p-1 rounded text-fg-quaternary hover:text-fg-secondary transition duration-100 ease-linear cursor-pointer"
                  aria-label="Copy options"
                >
                  <ClipboardIcon className="w-3.5 h-3.5" />
                  <ChevronDownIcon className="w-3 h-3" />
                </button>
                {showCopyMenu && (
                  <div className="absolute right-0 top-full mt-1 z-50 min-w-[160px] rounded-lg border border-border-secondary bg-bg-primary shadow-lg py-1">
                    {hasSelection && (
                      <button
                        type="button"
                        onClick={handleCopySelected}
                        className="w-full px-3 py-2 text-left text-xs text-text-secondary hover:bg-bg-secondary transition duration-100 ease-linear cursor-pointer"
                      >
                        Copy {selectedIds.size} selected
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleCopyAll}
                      className="w-full px-3 py-2 text-left text-xs text-text-secondary hover:bg-bg-secondary transition duration-100 ease-linear cursor-pointer"
                    >
                      Copy all {coreMessages.length} messages
                    </button>
                    {hasSelection && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedIds(new Set());
                          setShowCopyMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-xs text-text-quaternary hover:bg-bg-secondary transition duration-100 ease-linear cursor-pointer border-t border-border-secondary"
                      >
                        Clear selection
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Style variant pills */}
          {variants && variants.length > 1 && (
            <div className="mb-4 flex items-center gap-2">
              {variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setActiveVariant(v.id)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition duration-100 ease-linear ${
                    activeVariant === v.id
                      ? "bg-bg-brand-secondary text-text-brand-secondary"
                      : "bg-bg-secondary text-text-secondary hover:bg-bg-secondary_hover"
                  }`}
                >
                  {variantLabels[v.id] || v.label}
                </button>
              ))}
            </div>
          )}

          {/* Core message cards */}
          <div className="space-y-3">
            {coreMessages.map((message) => (
              <CatalogCard
                key={message.id}
                message={message}
                categoryId={categoryId}
                state={state}
                isSelected={selectedIds.has(message.id)}
                onToggleSelect={toggleSelect}
                globalViewMode={viewMode}
                activeTemplate={getActiveTemplate(message)}
              />
            ))}
          </div>

          {/* Marketing callout */}
          {expansionMessages.length > 0 && (
            <div className="mt-8 rounded-xl border border-border-secondary bg-bg-secondary p-6">
              <h3 className="text-base font-semibold text-text-primary">
                Need promotional messages too?
              </h3>
              <p className="mt-1 text-sm text-text-tertiary">
                Marketing campaigns — promos, re-engagement, seasonal offers —
                require a separate carrier registration. Start with your
                transactional messages, get approved, then add marketing when
                you&rsquo;re ready.
              </p>
              <div className="mt-4 space-y-3">
                {expansionMessages.map((msg) => {
                  const segments = interpolateTemplate(msg.template, categoryId, state);
                  return (
                    <div
                      key={msg.id}
                      className="rounded-xl border border-border-tertiary bg-bg-primary p-4 opacity-70"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-text-secondary">
                          {msg.name}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-bg-secondary border border-border-secondary px-2 py-0.5 text-[10px] font-medium text-text-quaternary">
                          Available with marketing registration
                        </span>
                      </div>
                      <p className="text-sm text-text-tertiary leading-relaxed">
                        {segments.map((seg, i) =>
                          seg.isVariable ? (
                            <span key={i} className="font-medium text-text-brand-tertiary">
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
      </div>
    </div>
  );
}
