"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { FC } from "react";
import { CATEGORIES } from "@/data/categories";
import { MESSAGES } from "@/data/messages";
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

/* ── Sentence builder inline input ── */

function InlineInput({
  value,
  placeholder,
  onChange,
  minWidth = "8em",
}: {
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  minWidth?: string;
}) {
  const displayLen = (value || placeholder).length;
  const calcWidth = `${displayLen * 0.6 + 1.5}em`;
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="border-b border-border-secondary bg-transparent font-semibold text-text-primary placeholder:text-text-placeholder placeholder:font-normal focus:border-border-brand focus:outline-none px-1 mx-1"
      style={{ width: `max(${minWidth}, ${calcWidth})` }}
    />
  );
}

/* ── Category icon ── */

function CategoryIcon({ icon: Icon }: { icon: FC<{ className?: string }> }) {
  return <Icon className="w-3.5 h-3.5 text-fg-secondary" />;
}

/* ── Page component ── */

export default function MessagesPage() {
  const params = useParams<{ categoryId: string }>();
  const router = useRouter();
  const { state, setField } = useSession();

  const category = CATEGORIES.find((c) => c.id === params.categoryId);
  const messages = category ? MESSAGES[category.id] : undefined;
  const shouldRedirect = !category || !messages || messages.length === 0;

  // View mode: preview (interpolated) or template (raw)
  const [viewMode, setViewMode] = useState<"preview" | "template">("preview");

  // Selected card IDs for multi-select copy
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Copy combo dropdown state
  const [showCopyMenu, setShowCopyMenu] = useState(false);
  const copyMenuRef = useRef<HTMLDivElement>(null);

  const { copied, copy } = useCopyFeedback();

  useEffect(() => {
    if (shouldRedirect) router.replace("/choose");
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

  if (shouldRedirect) return null;

  const cat = category!;
  const allMessages = MESSAGES[cat.id] || [];

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

  function handleDefaultCopy() {
    if (hasSelection) {
      handleCopySelected();
    } else {
      handleCopyAll();
    }
  }

  const copyButtonLabel = copied
    ? "Copied \u2713"
    : hasSelection
      ? `Copy ${selectedIds.size} selected`
      : "Copy all";

  return (
    <div className="mx-auto max-w-[1000px] px-6 py-8">
      {/* Header */}
      <div className="mb-4">
        <div className="mb-1 flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-bg-secondary">
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
      <div className="mb-8 flex flex-wrap items-baseline gap-0 text-base text-text-tertiary leading-loose">
        <span>I&rsquo;m building</span>
        <InlineInput
          value={state.appName}
          placeholder="MyApp"
          onChange={(v) => setField("appName", v)}
          minWidth="8em"
        />
        <span>. Our website is</span>
        <InlineInput
          value={state.website}
          placeholder="myapp.com"
          onChange={(v) => setField("website", v)}
          minWidth="10em"
        />
      </div>

      {/* Two-column layout: opt-in left, cards right */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,_45fr)_minmax(0,_55fr)]">
        {/* Left column — sticky opt-in preview */}
        <div className="mx-auto w-full max-w-[500px] md:mx-0 md:max-w-none md:self-start md:sticky md:top-20">
          <h2 className="mb-3 text-lg font-semibold text-text-primary">
            Sample opt-in form
          </h2>
          <CatalogOptIn
            appName={state.appName}
            website={state.website}
            allMessages={allMessages}
            selectedIds={selectedIds}
          />
        </div>

        {/* Right column — toolbar + message cards */}
        <div className="mx-auto w-full max-w-[500px] md:mx-0 md:max-w-none">
          {/* Sticky header + toolbar */}
          <div className="mb-4 md:sticky md:top-14 md:z-10 md:bg-bg-primary md:pt-6 md:pb-3 md:border-b md:border-border-secondary">
            <h2 className="mb-3 text-lg font-semibold text-text-primary">
              Your messages
            </h2>

          {/* Toolbar: view toggle + copy combo button */}
          <div className="flex items-center justify-between">
            {/* Left: view toggle */}
            <div className="flex items-center rounded-lg border border-border-secondary bg-bg-primary shadow-xs">
              <button
                type="button"
                onClick={() => setViewMode("preview")}
                className={`px-3 py-1.5 text-xs font-medium transition duration-100 ease-linear cursor-pointer rounded-l-lg ${
                  viewMode === "preview"
                    ? "bg-bg-active text-text-primary"
                    : "text-text-tertiary hover:text-text-secondary"
                }`}
              >
                Preview
              </button>
              <button
                type="button"
                onClick={() => setViewMode("template")}
                className={`px-3 py-1.5 text-xs font-medium transition duration-100 ease-linear cursor-pointer rounded-r-lg ${
                  viewMode === "template"
                    ? "bg-bg-active text-text-primary"
                    : "text-text-tertiary hover:text-text-secondary"
                }`}
              >
                Template
              </button>
            </div>

            {/* Right: clear all + copy combo button */}
            <div className="flex items-center gap-3">
              {hasSelection && (
                <button
                  type="button"
                  onClick={() => setSelectedIds(new Set())}
                  className="text-xs text-text-quaternary hover:text-text-secondary transition duration-100 ease-linear cursor-pointer"
                >
                  Clear all
                </button>
              )}
              <div className="relative" ref={copyMenuRef}>
                <div className="flex items-center rounded-lg border border-border-secondary bg-bg-primary shadow-xs">
                  {/* Main copy action */}
                  <button
                    type="button"
                    onClick={handleDefaultCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-bg-secondary transition duration-100 ease-linear cursor-pointer rounded-l-lg"
                  >
                    <ClipboardIcon className="w-3.5 h-3.5" />
                    {copyButtonLabel}
                  </button>
                  {/* Dropdown trigger */}
                  <button
                    type="button"
                    onClick={() => setShowCopyMenu((prev) => !prev)}
                    className="px-2 py-1.5 border-l border-border-secondary text-fg-quaternary hover:text-fg-secondary hover:bg-bg-secondary transition duration-100 ease-linear cursor-pointer rounded-r-lg"
                    aria-label="Copy options"
                  >
                    <ChevronDownIcon />
                  </button>
                </div>

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
                  </div>
                )}
              </div>
            </div>
          </div>
          </div>

          {/* Message cards — flat catalog, no tier grouping */}
          <div className="space-y-3">
            {allMessages.map((message) => (
              <CatalogCard
                key={message.id}
                message={message}
                categoryId={cat.id}
                state={state}
                isSelected={selectedIds.has(message.id)}
                onToggleSelect={toggleSelect}
                globalViewMode={viewMode}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
