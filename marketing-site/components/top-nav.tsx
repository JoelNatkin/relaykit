"use client";

import { Moon01, Sun } from "@untitledui/icons";
import Link from "next/link";
import { useWaitlist } from "@/context/waitlist-context";
import { useTheme } from "@/lib/use-theme";

export function TopNav() {
  const { theme, toggle } = useTheme();
  const { openModal } = useWaitlist();
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
          <button
            type="button"
            onClick={toggle}
            aria-label={actionLabel}
            title={actionLabel}
            className="flex size-9 cursor-pointer items-center justify-center text-fg-quaternary transition duration-100 ease-linear hover:text-fg-secondary"
          >
            {theme === null ? (
              <span className="size-5" aria-hidden />
            ) : theme === "dark" ? (
              <Moon01 className="size-5" />
            ) : (
              <Sun className="size-5" />
            )}
          </button>
          <button
            type="button"
            onClick={() => openModal("top-nav")}
            className="cursor-pointer rounded-lg border border-border-primary bg-bg-primary px-4 py-2 text-sm font-semibold text-text-secondary transition duration-100 ease-linear hover:bg-bg-primary_hover"
          >
            Get early access
          </button>
        </div>
      </div>
    </nav>
  );
}
