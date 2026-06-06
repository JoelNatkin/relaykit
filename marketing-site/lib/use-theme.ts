"use client";

import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "relaykit-theme";

function readDomTheme(): Theme {
  // Dark is the site-wide default (the inline head script applies it unless
  // the user has explicitly stored 'light'); the SSR fallback matches.
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  root.style.colorScheme = theme;
}

export function useTheme(): {
  theme: Theme | null;
  toggle: () => void;
} {
  // Null on first render (SSR + hydration) so consumers can render a
  // stable placeholder until the inline head script's effect is observable.
  // The actual document state is already correct from the inline script;
  // this hook just exposes it to React after mount.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(readDomTheme());

    function onStorage(event: StorageEvent) {
      if (event.key !== STORAGE_KEY) return;
      // Dark default: only an explicit stored 'light' yields light; a cleared
      // or absent value falls back to dark, matching the head script.
      const next: Theme = event.newValue === "light" ? "light" : "dark";
      applyTheme(next);
      setTheme(next);
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function toggle() {
    const current = readDomTheme();
    const next: Theme = current === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage can throw under strict privacy modes; the in-memory
      // state still flips so the toggle works for this tab.
    }
    setTheme(next);
  }

  return { theme, toggle };
}
