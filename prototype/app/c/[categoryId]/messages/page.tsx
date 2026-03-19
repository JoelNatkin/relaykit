"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { FC } from "react";
import { CATEGORIES } from "@/data/categories";
import { MESSAGES, CATEGORY_VARIANTS } from "@/data/messages";
import { useSession } from "@/context/session-context";
import { CatalogCard } from "@/components/catalog/catalog-card";
import { CatalogOptIn } from "@/components/catalog/catalog-opt-in";
import { formatMultipleCopyBlocks } from "@/lib/catalog-helpers";

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
      width="12"
      height="12"
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

/* ── Sentence builder inline input ── */

function InlineInput({
  value,
  placeholder,
  onChange,
}: {
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
}) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = useState(80);

  useEffect(() => {
    if (spanRef.current) {
      // Measure actual rendered text width, add padding (2px left + 4px right + 2px buffer = 8px)
      const textWidth = spanRef.current.offsetWidth + 8;
      setInputWidth(Math.max(80, textWidth));
    }
  }, [value, placeholder]);

  return (
    <>
      {/* Hidden measuring span — mirrors input font properties exactly */}
      <span
        ref={spanRef}
        aria-hidden
        className="absolute invisible whitespace-pre font-semibold text-lg"
        style={{ pointerEvents: "none" }}
      >
        {value || placeholder}
      </span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="border-b border-[#D0D5DD] bg-transparent font-semibold text-text-primary placeholder:text-text-placeholder placeholder:font-normal focus:border-border-brand focus:outline-none mx-1 text-lg overflow-visible"
        style={{ width: `${inputWidth}px`, paddingLeft: 2, paddingRight: 4 }}
      />
    </>
  );
}

/* ── Category icon ── */

function CategoryIcon({ icon: Icon }: { icon: FC<{ className?: string }> }) {
  return <Icon className="w-5 h-5 text-[#7C3AED]" />;
}

/* ── Page component ── */

export default function MessagesPage() {
  const params = useParams<{ categoryId: string }>();
  const router = useRouter();
  const { state, setField } = useSession();

  const category = CATEGORIES.find((c) => c.id === params.categoryId);
  const messages = category ? MESSAGES[category.id] : undefined;
  const shouldRedirect = !category || !messages || messages.length === 0;

  // Variant selection (D-91)
  const variants = category ? CATEGORY_VARIANTS[category.id] : undefined;
  const [activeVariant, setActiveVariant] = useState("standard");

  // View mode: preview (interpolated) or template (raw)
  const [viewMode, setViewMode] = useState<"preview" | "template">("preview");

  // Selected card IDs for multi-select copy
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Copy combo dropdown state
  const [showCopyMenu, setShowCopyMenu] = useState(false);
  const copyMenuRef = useRef<HTMLDivElement>(null);

  // Scroll-triggered border: show border only when sticky header is stuck
  const [isStuck, setIsStuck] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { copy } = useCopyFeedback();

  useEffect(() => {
    if (shouldRedirect) router.replace("/");
  }, [shouldRedirect, router]);

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

  // Scroll-triggered border: IntersectionObserver on sentinel
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (shouldRedirect) return null;

  const cat = category!;
  const allMessages = MESSAGES[cat.id] || [];
  const coreMessages = allMessages.filter((m) => m.tier !== "expansion");
  const expansionMessages = allMessages.filter((m) => m.tier === "expansion");

  function toggleSelect(messageId: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(messageId)) {
        next.delete(messageId);
      } else {
        next.add(messageId);
      }
      return next;
    });
  }

  const selectedMessages = allMessages.filter((m) => selectedIds.has(m.id));
  const hasSelection = selectedIds.size > 0;

  /** Get the active template for a message based on the selected variant */
  function getActiveTemplate(msg: typeof allMessages[number]): string | undefined {
    if (activeVariant === "standard" || !msg.variants) return undefined;
    return msg.variants[activeVariant] ?? undefined;
  }

  function handleCopySelected() {
    const text = formatMultipleCopyBlocks(selectedMessages, cat.id, state);
    copy(text, "selected");
    setShowCopyMenu(false);
  }

  function handleCopyAll() {
    const text = formatMultipleCopyBlocks(allMessages, cat.id, state);
    copy(text, "all");
    setShowCopyMenu(false);
  }

  return (
    <div className="mx-auto max-w-[1000px] px-6 py-8">
      {/* Header */}
      <div className="mb-4">
        <div className="mb-1 flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F9F5FF]" style={{ padding: '4px 12px' }}>
            <CategoryIcon icon={cat.icon} />
          </div>
          <p className="text-xs font-medium uppercase tracking-widest text-text-tertiary">
            {cat.label}
          </p>
        </div>
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
            Your messages
          </h1>
          <Link
            href={`/c/${cat.id}/plan`}
            className="text-xs font-medium text-text-quaternary hover:text-text-brand-secondary transition duration-100 ease-linear"
          >
            &larr; Edit plan
          </Link>
        </div>
      </div>

      {/* Sentence builder */}
      <div className="mb-8 flex flex-wrap items-baseline gap-0 text-lg text-text-tertiary leading-loose">
        <span className="font-semibold text-text-primary mr-2">Preview:</span>
        <span>I&rsquo;m building</span>
        <InlineInput
          value={state.appName}
          placeholder="MyApp"
          onChange={(v) => setField("appName", v)}
        />
        <span>. Our website is</span>
        <InlineInput
          value={state.website}
          placeholder="myapp.com"
          onChange={(v) => setField("website", v)}
        />
      </div>

      {/* Variant pills (D-91) */}
      {variants && variants.length > 1 && (
        <div className="mb-8 flex items-center gap-2">
          <span className="text-xs font-medium text-text-quaternary mr-1">Style:</span>
          <div className="flex items-center gap-1 rounded-lg border border-border-secondary p-0.5">
            {variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setActiveVariant(v.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition duration-100 ease-linear ${
                  activeVariant === v.id
                    ? "bg-bg-brand-solid text-text-white"
                    : "text-text-tertiary hover:text-text-secondary hover:bg-bg-primary_hover"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
          <span className="text-[11px] text-text-quaternary">
            All variants are included in your Blueprint regardless of selection.
          </span>
        </div>
      )}

      {/* Two-column layout: opt-in left, cards right */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[45fr_55fr]">
        {/* Left column — sticky opt-in preview */}
        <div className="mx-auto w-full max-w-[500px] md:mx-0 md:max-w-none md:self-start md:sticky md:top-20">
          <h2 className="mb-3 text-xl font-semibold text-text-primary">
            Sample opt-in form
          </h2>
          <CatalogOptIn
            appName={state.appName}
            website={state.website}
            allMessages={allMessages}
          />
        </div>

        {/* Right column — toolbar + message cards */}
        <div className="mx-auto w-full max-w-[500px] md:mx-0 md:max-w-none">
          {/* Sentinel — when this scrolls out of view, header is stuck */}
          <div ref={sentinelRef} className="h-0" />
          {/* Sticky header with inline icons */}
          <div className="md:sticky md:top-14 md:z-10">
            <div className={`flex items-center justify-between mb-3 md:bg-bg-primary md:pt-6 md:-mt-6 transition-[border-color] duration-100 ease-linear border-b ${isStuck ? "border-border-secondary" : "border-transparent"}`}>
              <h2 className="text-xl font-semibold text-text-primary">
                Your messages
              </h2>
              <div className="flex items-center gap-2">
                {/* View toggle icon button */}
                <button
                  type="button"
                  onClick={() => setViewMode(viewMode === "preview" ? "template" : "preview")}
                  className="p-1 rounded text-fg-quaternary hover:text-fg-tertiary transition duration-100 ease-linear cursor-pointer"
                  aria-label={viewMode === "preview" ? "Show template" : "Show preview"}
                >
                  {viewMode === "preview" ? <CodeIcon /> : <EyeIcon />}
                </button>

                {/* Copy icon with dropdown */}
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

                  {/* Dropdown menu */}
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
                        Copy all {allMessages.length} messages
                      </button>
                      {hasSelection && (
                        <button
                          type="button"
                          onClick={() => { setSelectedIds(new Set()); setShowCopyMenu(false); }}
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
          </div>

          {/* Message cards — transactional first, then marketing with divider */}
          <div className="space-y-3">
            {coreMessages.map((message) => (
              <CatalogCard
                key={message.id}
                message={message}
                categoryId={cat.id}
                state={state}

                globalViewMode={viewMode}
                activeTemplate={getActiveTemplate(message)}
              />
            ))}
          </div>

          {/* Marketing section — informational, not selection (D-89) */}
          {expansionMessages.length > 0 && (
            <>
              <div className="mt-8 mb-3 border-t border-border-secondary pt-6">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-sm font-semibold text-text-primary">
                    Marketing &amp; promotion messages
                  </h3>
                  <span className="text-xs text-text-quaternary">+$10/mo</span>
                </div>
                <p className="text-xs text-text-tertiary mt-1">
                  Available with a marketing campaign — add anytime from your dashboard. We&rsquo;ll register an additional campaign for marketing messages.
                </p>
              </div>
              <div className="space-y-3">
                {expansionMessages.map((message) => (
                  <CatalogCard
                    key={message.id}
                    message={message}
                    categoryId={cat.id}
                    state={state}

                    globalViewMode={viewMode}
                    activeTemplate={getActiveTemplate(message)}
                  />
                ))}
              </div>
            </>
          )}

          {/* Blueprint download CTA (D-84, D-92, D-97) */}
          <div className="mt-10 rounded-xl border border-border-brand bg-bg-brand-primary p-6">
            <h3 className="text-lg font-semibold text-text-primary">
              Get your {state.appName || cat.label} SMS Blueprint
            </h3>
            <p className="mt-1 text-sm text-text-tertiary">
              A complete integration guide with every message above, your sandbox API key, and setup instructions — ready for your AI coding tool.
            </p>

            {/* Platform-specific setup instructions (D-92) */}
            <div className="mt-4 space-y-2">
              <p className="text-xs font-medium text-text-quaternary uppercase tracking-wide">
                Works with
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div className="rounded-lg border border-border-secondary bg-bg-primary p-3">
                  <p className="text-xs font-semibold text-text-primary">Claude Code</p>
                  <p className="mt-0.5 text-[11px] text-text-tertiary font-mono">
                    Drop the Blueprint in your project root. Claude reads it automatically.
                  </p>
                </div>
                <div className="rounded-lg border border-border-secondary bg-bg-primary p-3">
                  <p className="text-xs font-semibold text-text-primary">Cursor</p>
                  <p className="mt-0.5 text-[11px] text-text-tertiary font-mono">
                    Add to your project. Reference it in chat: &ldquo;use the SMS Blueprint.&rdquo;
                  </p>
                </div>
                <div className="rounded-lg border border-border-secondary bg-bg-primary p-3">
                  <p className="text-xs font-semibold text-text-primary">Windsurf</p>
                  <p className="mt-0.5 text-[11px] text-text-tertiary font-mono">
                    Include in workspace. Cascade picks it up from your file tree.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert("Auth gate → Task 6")}
              className="mt-5 w-full rounded-lg bg-bg-brand-solid px-5 py-3 text-sm font-semibold text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
            >
              Get your SMS Blueprint →
            </button>
            <p className="mt-2 text-center text-[11px] text-text-quaternary">
              Free to browse. Sign in to download.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
