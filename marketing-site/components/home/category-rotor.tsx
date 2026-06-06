"use client";

import { useEffect, useState } from "react";
import { CATEGORIES } from "@/lib/message-library";

// Canonical category names drive the rotating hero line (plan: CATEGORIES.map
// (c => c.name) — single source, no hand-kept list). Monochrome by the locked
// gold rule (the v10 artifact rendered this in the accent; overridden here).
const WORDS = CATEGORIES.map((c) => `${c.name}.`);
const INTERVAL_MS = 2200;
const FADE_MS = 340;

export function CategoryRotor() {
  const [index, setIndex] = useState(0);
  const [out, setOut] = useState(false);

  useEffect(() => {
    const cycle = setInterval(() => {
      setOut(true);
      const swap = setTimeout(() => {
        setIndex((i) => (i + 1) % WORDS.length);
        setOut(false);
      }, FADE_MS);
      // Clear the inner timeout if the component unmounts mid-fade.
      return () => clearTimeout(swap);
    }, INTERVAL_MS);
    return () => clearInterval(cycle);
  }, []);

  return (
    <div
      className="mt-4 text-xl font-medium tracking-tight text-text-primary sm:text-2xl"
      aria-live="polite"
    >
      <span
        className={`inline-block transition-all duration-300 ease-linear motion-reduce:transition-none ${
          out ? "translate-y-1.5 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        {WORDS[index]}
      </span>
    </div>
  );
}
