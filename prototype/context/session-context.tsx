"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { MESSAGES } from "@/data/messages";

const STORAGE_KEY = "relaykit_prototype";

export interface SessionState {
  // Personalization
  appName: string;
  website: string;
  serviceType: string;
  productType: string;
  venueType: string;
  whatYouSell: string;

  // Category selection
  selectedCategory: string | null;

  // Message plan — which messages are toggled on/off, keyed by message ID
  enabledMessages: Record<string, boolean>;

  // Message edits — custom text overrides, keyed by message ID
  messageEdits: Record<string, string>;
}

interface SessionContextValue {
  state: SessionState;
  isHydrated: boolean;
  setField: (key: string, value: string) => void;
  setCategory: (categoryId: string) => void;
  toggleMessage: (messageId: string) => void;
  editMessage: (messageId: string, text: string) => void;
  resetMessages: (categoryId: string) => void;
}

const defaultState: SessionState = {
  appName: "",
  website: "",
  serviceType: "",
  productType: "",
  venueType: "",
  whatYouSell: "",
  selectedCategory: null,
  enabledMessages: {},
  messageEdits: {},
};

const SessionContext = createContext<SessionContextValue | null>(null);

function getDefaultEnabledMessages(categoryId: string): Record<string, boolean> {
  const messages = MESSAGES[categoryId];
  if (!messages) return {};
  const enabled: Record<string, boolean> = {};
  for (const msg of messages) {
    if (msg.defaultEnabled) {
      enabled[msg.id] = true;
    }
  }
  return enabled;
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>(defaultState);
  const [isHydrated, setIsHydrated] = useState(false);
  const isInitialMount = useRef(true);

  // Read from sessionStorage on mount (SSR-safe)
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<SessionState>;
        setState((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // sessionStorage unavailable or corrupt — use defaults
    }
    setIsHydrated(true);
  }, []);

  // Write to sessionStorage on every state change (after hydration)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!isHydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // sessionStorage full or unavailable
    }
  }, [state, isHydrated]);

  const setField = useCallback((key: string, value: string) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetMessages = useCallback((categoryId: string) => {
    setState((prev) => ({
      ...prev,
      enabledMessages: getDefaultEnabledMessages(categoryId),
      messageEdits: {},
    }));
  }, []);

  const setCategory = useCallback(
    (categoryId: string) => {
      setState((prev) => {
        if (prev.selectedCategory === categoryId) return prev;
        return {
          ...prev,
          selectedCategory: categoryId,
          enabledMessages: getDefaultEnabledMessages(categoryId),
          messageEdits: {},
        };
      });
    },
    []
  );

  const toggleMessage = useCallback((messageId: string) => {
    setState((prev) => ({
      ...prev,
      enabledMessages: {
        ...prev.enabledMessages,
        [messageId]: !prev.enabledMessages[messageId],
      },
    }));
  }, []);

  const editMessage = useCallback((messageId: string, text: string) => {
    setState((prev) => ({
      ...prev,
      messageEdits: {
        ...prev.messageEdits,
        [messageId]: text,
      },
    }));
  }, []);

  return (
    <SessionContext.Provider
      value={{
        state,
        isHydrated,
        setField,
        setCategory,
        toggleMessage,
        editMessage,
        resetMessages,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
