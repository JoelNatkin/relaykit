"use client";

/**
 * Hover tooltip. Opens immediately on hover (default `delayMs = 0`) and
 * closes immediately on leave. Triggers are explicit ? icons today, so an
 * open delay would just be friction; callers can still pass `delayMs` to
 * reintroduce a gate if they have a softer trigger.
 *
 * Placed above the trigger (codebase convention; clip-safe at every viewport
 * width).
 */

import { useEffect, useRef, useState, type ReactNode } from "react";

interface TooltipProps {
  /** Tooltip body. When falsy the trigger renders with no tooltip behaviour. */
  content: ReactNode;
  children: ReactNode;
  /** Open delay in milliseconds. */
  delayMs?: number;
  className?: string;
}

export function Tooltip({ content, children, delayMs = 0, className }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clear() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function handleEnter() {
    if (!content) return;
    clear();
    timerRef.current = setTimeout(() => setVisible(true), delayMs);
  }

  function handleLeave() {
    clear();
    setVisible(false);
  }

  useEffect(() => clear, []);

  return (
    <span
      className={`relative inline-flex ${className ?? ""}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children}
      {visible && content ? (
        <span
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-0 z-[100] mb-1.5 w-64 rounded-lg bg-bg-primary-solid px-3 py-2 text-xs leading-relaxed whitespace-normal text-text-white shadow-lg"
        >
          {content}
        </span>
      ) : null}
    </span>
  );
}
