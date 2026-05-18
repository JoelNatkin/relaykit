"use client";

/**
 * Holds the configurator's live `businessName` input so variable tokens can
 * resolve their preview value during render (the Tiptap `business_name` chip
 * in particular). Kept as context rather than prop-drilled so the editor's
 * nested NodeView can reach it.
 */

import { createContext, useContext, type ReactNode } from "react";

export interface SessionState {
  businessName: string;
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
