"use client";

import { useEffect, useState } from "react";

// Hardcoded one-pass frame sequence. The resting line ("Every text your app
// sends.") is intentionally NOT a category, so it can't be derived from
// CATEGORIES — hence a hand-kept list rather than CATEGORIES.map. Animates
// through these once and STOPS on the final frame (no loop, no further timers).
// Monochrome by the locked gold rule.
const FRAMES = [
  "Appointments.",
  "Order updates.",
  "Account events.",
  "Every text your app sends.",
];
const INTERVAL_MS = 1700;
const FADE_MS = 280;

export function CategoryRotor() {
  const [index, setIndex] = useState(0);
  // Start hidden so the FIRST frame plays the same fade/slide-in as the rest,
  // rather than mounting static at full opacity. Flipped to shown on first
  // paint via rAF below.
  const [out, setOut] = useState(true);

  // First-frame entrance: reveal frame 0 once the initial hidden state has
  // painted, so the CSS transition actually fires for index 0 too.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setOut(false));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    // Stop on the final frame — one pass, no loop, no further timers.
    if (index >= FRAMES.length - 1) return;
    let swap: ReturnType<typeof setTimeout>;
    const cycle = setTimeout(() => {
      setOut(true);
      swap = setTimeout(() => {
        setIndex((i) => i + 1);
        setOut(false);
      }, FADE_MS);
    }, INTERVAL_MS);
    // clearTimeout(undefined) is a no-op, so clearing swap pre-assignment is safe.
    return () => {
      clearTimeout(cycle);
      clearTimeout(swap);
    };
  }, [index]);

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
        {FRAMES[index]}
      </span>
    </div>
  );
}
