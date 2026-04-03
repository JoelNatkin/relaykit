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

export interface CustomMessage {
  id: string;
  categoryId: string;
  name: string;
  trigger: string;
  template: string;
}

export type DashboardVersion = "a" | "b" | "c";
export type AppState = "pre-download" | "sandbox" | "live";
export type RegistrationState = "default" | "pending" | "approved" | "changes_requested" | "rejected";
export interface SessionState {
  // Auth mock
  isLoggedIn: boolean;

  // Dashboard version toggle (A/B/C comparison)
  dashboardVersion: DashboardVersion;

  // Per-app state toggle
  appState: AppState;

  // Registration lifecycle state
  registrationState: RegistrationState;

  // EIN on file — gates marketing UI (D-247)
  hasEIN: boolean;

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

  // Custom messages added by the developer
  customMessages: CustomMessage[];
}

interface SessionContextValue {
  state: SessionState;
  isHydrated: boolean;
  setField: (key: string, value: string) => void;
  setCategory: (categoryId: string) => void;
  toggleMessage: (messageId: string) => void;
  editMessage: (messageId: string, text: string) => void;
  resetMessages: (categoryId: string) => void;
  addCustomMessage: (categoryId: string) => void;
  deleteCustomMessage: (messageId: string) => void;
  updateCustomMessage: (messageId: string, updates: Partial<Pick<CustomMessage, "name" | "trigger" | "template">>) => void;
  setLoggedIn: (value: boolean) => void;
  setDashboardVersion: (version: DashboardVersion) => void;
  setAppState: (state: AppState) => void;
  setRegistrationState: (state: RegistrationState) => void;
}

const defaultState: SessionState = {
  isLoggedIn: false,
  dashboardVersion: "b",
  appState: "pre-download",
  registrationState: "default",
  hasEIN: true,
  appName: "",
  website: "",
  serviceType: "",
  productType: "",
  venueType: "",
  whatYouSell: "",
  selectedCategory: null,
  enabledMessages: {},
  messageEdits: {},
  customMessages: [],
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

  const addCustomMessage = useCallback((categoryId: string) => {
    const id = `custom_${Date.now()}`;
    const newMsg: CustomMessage = {
      id,
      categoryId,
      name: "New message",
      trigger: "When triggered",
      template: "{app_name}: Your message here. Reply STOP to opt out.",
    };
    setState((prev) => ({
      ...prev,
      customMessages: [...prev.customMessages, newMsg],
      enabledMessages: { ...prev.enabledMessages, [id]: true },
    }));
  }, []);

  const deleteCustomMessage = useCallback((messageId: string) => {
    setState((prev) => ({
      ...prev,
      customMessages: prev.customMessages.filter((m) => m.id !== messageId),
      enabledMessages: { ...prev.enabledMessages, [messageId]: undefined } as Record<string, boolean>,
      messageEdits: { ...prev.messageEdits, [messageId]: undefined } as Record<string, string>,
    }));
  }, []);

  const updateCustomMessage = useCallback(
    (messageId: string, updates: Partial<Pick<CustomMessage, "name" | "trigger" | "template">>) => {
      setState((prev) => ({
        ...prev,
        customMessages: prev.customMessages.map((m) =>
          m.id === messageId ? { ...m, ...updates } : m
        ),
      }));
    },
    []
  );

  const setLoggedIn = useCallback((value: boolean) => {
    setState((prev) => ({ ...prev, isLoggedIn: value }));
  }, []);

  const setDashboardVersion = useCallback((version: DashboardVersion) => {
    setState((prev) => ({ ...prev, dashboardVersion: version }));
  }, []);

  const setAppState = useCallback((appState: AppState) => {
    setState((prev) => ({ ...prev, appState }));
  }, []);

  const setRegistrationState = useCallback((registrationState: RegistrationState) => {
    setState((prev) => ({ ...prev, registrationState }));
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
        addCustomMessage,
        deleteCustomMessage,
        updateCustomMessage,
        setLoggedIn,
        setDashboardVersion,
        setAppState,
        setRegistrationState,
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
