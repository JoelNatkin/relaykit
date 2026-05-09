"use client";

/**
 * Marketing-side equivalent of the prototype's session context. Holds the
 * configurator's user-input state ({businessName, website}) so variable
 * tokens can resolve their preview values during render. Mirrors the
 * shape of `prototype/context/session-context.tsx` for the subset
 * relevant to the message editor.
 *
 * Parity expectation: the configurator section feeds this context with
 * the trimmed, defaulted user-input values; variable-node-view consumes
 * it identically to the prototype.
 */

import { createContext, useContext, type ReactNode } from "react";

export interface SessionState {
  businessName: string;
  website: string;
}

const SessionContext = createContext<SessionState | null>(null);

interface SessionProviderProps {
  state: SessionState;
  children: ReactNode;
}

export function SessionProvider({ state, children }: SessionProviderProps) {
  return <SessionContext.Provider value={state}>{children}</SessionContext.Provider>;
}

export function useSession(): { state: SessionState } {
  const state = useContext(SessionContext);
  if (!state) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return { state };
}
