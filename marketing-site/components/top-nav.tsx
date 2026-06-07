"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Menu01, Moon01, Sun, X } from "@untitledui/icons";
import Link from "next/link";
import { useTheme } from "@/lib/use-theme";

// Primary nav links — shared href source for the desktop bar and the mobile
// menu so the two never drift. (Legal/Resources stay in the footer.)
const NAV_LINKS = [
  { href: "/messages", label: "Messages" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
] as const;

// Theme-toggle icon mirroring the bar's logic: Moon in dark, Sun in light, an
// invisible placeholder pre-mount (theme unknown server-side).
function ThemeIcon({ theme }: { theme: "dark" | "light" | null }) {
  if (theme === null) return <span className="size-5" aria-hidden />;
  return theme === "dark" ? (
    <Moon01 className="size-5" />
  ) : (
    <Sun className="size-5" />
  );
}

export function TopNav() {
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  // Names the action the click performs (the target state), not the current
  // state. Pre-mount the theme is unknown, so use a neutral label.
  const actionLabel =
    theme === null
      ? "Toggle color theme"
      : theme === "dark"
        ? "Switch to light mode"
        : "Switch to dark mode";

  return (
    <nav className="fixed inset-x-0 top-0 z-50 h-14 border-b border-border-secondary bg-bg-primary">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-base font-bold tracking-tight text-text-primary transition duration-100 ease-linear hover:text-text-secondary"
        >
          RelayKit
        </Link>
        <div className="flex items-center gap-6">
          {/* Theme toggle — desktop only; on mobile it moves into the menu. */}
          <button
            type="button"
            onClick={toggle}
            aria-label={actionLabel}
            title={actionLabel}
            className="hidden size-9 cursor-pointer items-center justify-center text-fg-quaternary transition duration-100 ease-linear hover:text-fg-secondary sm:flex"
          >
            <ThemeIcon theme={theme} />
          </button>
          {/* Primary nav links. Hidden below sm — the hamburger menu takes
              over there. Logo (left) stays the home link. */}
          <div className="hidden items-center gap-6 sm:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-text-secondary transition duration-100 ease-linear hover:text-text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
          {/* Hamburger — mobile only; opens the full-screen menu. */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex size-11 cursor-pointer items-center justify-center text-fg-quaternary transition duration-100 ease-linear hover:text-fg-secondary sm:hidden"
          >
            {menuOpen ? <X className="size-6" /> : <Menu01 className="size-6" />}
          </button>
        </div>
      </div>

      <MobileNavMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        theme={theme}
        toggle={toggle}
        actionLabel={actionLabel}
      />
    </nav>
  );
}

interface MobileNavMenuProps {
  isOpen: boolean;
  onClose: () => void;
  theme: "dark" | "light" | null;
  toggle: () => void;
  actionLabel: string;
}

// Full-screen mobile menu mirroring mobile-categories-modal's idioms: portal
// to <body>, body-scroll lock, ESC-to-close, sticky header X, body-scrolls
// layout (shell is flex-col with no overflow; body owns the scroll so the
// header pins). Adds focus management — focus moves into the panel on open and
// restores to the trigger on close. sm:hidden throughout (desktop bar owns the
// links + toggle there).
function MobileNavMenu({
  isOpen,
  onClose,
  theme,
  toggle,
  actionLabel,
}: MobileNavMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<Element | null>(null);

  // Lock body scroll while open.
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ESC closes.
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Focus into the panel on open; restore focus to the trigger (the hamburger)
  // on close. The cleanup fires when isOpen flips false, so restore happens as
  // the panel unmounts.
  useEffect(() => {
    if (!isOpen) return;
    restoreFocusRef.current = document.activeElement;
    panelRef.current?.focus();
    return () => {
      if (restoreFocusRef.current instanceof HTMLElement) {
        restoreFocusRef.current.focus();
      }
    };
  }, [isOpen]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    // Shell — flex column with NO overflow so the sticky header pins while the
    // body scrolls. tabIndex makes it focus-targetable on open. Opaque
    // full-screen panel, so no separate backdrop is needed.
    <div
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-[101] flex flex-col bg-bg-primary outline-none sm:hidden"
    >
        {/* Sticky header: wordmark + X close. */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border-secondary bg-bg-primary px-6 py-3">
          <Link
            href="/"
            onClick={onClose}
            className="text-base font-bold tracking-tight text-text-primary transition duration-100 ease-linear hover:text-text-secondary"
          >
            RelayKit
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex size-11 cursor-pointer items-center justify-center text-text-quaternary transition duration-100 ease-linear hover:text-text-secondary"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Scrollable body — owns the overflow so the header can stick. */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="border-b border-border-secondary py-4 text-lg font-medium text-text-primary transition duration-100 ease-linear hover:text-text-secondary"
              >
                {link.label}
              </Link>
            ))}
            {/* Theme toggle — same useTheme toggle/theme as the desktop bar. */}
            <button
              type="button"
              onClick={toggle}
              className="flex items-center gap-3 py-4 text-lg font-medium text-text-primary transition duration-100 ease-linear hover:text-text-secondary"
            >
              <span className="text-fg-quaternary">
                <ThemeIcon theme={theme} />
              </span>
              {actionLabel}
            </button>
          </div>
        </div>
      </div>,
    document.body,
  );
}
