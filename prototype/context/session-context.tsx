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
import { generateSlug } from "@/lib/slug";

const STORAGE_KEY = "relaykit_prototype";

export interface CustomMessage {
  id: string;
  categoryId: string;
  name: string;
  trigger: string;
  template: string;
  /** Stable, immutable slug assigned on first Save (D-351). Empty string
   *  until first save — the message has no deliverable identity yet. */
  slug: string;
  archived: boolean;
}

export type DashboardVersion = "a" | "b" | "c";
export type AppState = "pre-download" | "sandbox" | "live";
export type RegistrationState = "onboarding" | "building" | "pending" | "registered" | "changes_requested" | "rejected";
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
  /** Inserts a blank custom message at the TOP of the stack and returns its
   *  generated id so the caller can immediately place it in edit state. */
  addCustomMessage: (categoryId: string) => string;
  /** Atomic save — applies name/template edits and, if the message has no
   *  slug yet (first save), assigns one from the name using the collision-safe
   *  generator in lib/slug.ts. Existing slugs are not rewritten: per D-351,
   *  the slug is immutable after assignment. */
  saveCustomMessage: (messageId: string, updates: { name: string; template: string }) => void;
  archiveCustomMessage: (messageId: string) => void;
  restoreCustomMessage: (messageId: string) => void;
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
  registrationState: "onboarding",
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
        // Back-fill custom messages persisted before `slug`/`archived` fields
        // existed. Missing fields would otherwise read as `undefined` and
        // break the archive filter + slug collision logic.
        //
        // One-time zombie cleanup (PM bug 2): drop any custom whose name and
        // template are both empty. These are leftovers from pre-fix Cancel
        // behavior that created a row on "+ Add" but left it behind when the
        // user cancelled without typing. Going-forward Cancel on never-saved
        // rows discards correctly (see commit 203a97b), so this migration
        // only needs to run against old sessions.
        if (Array.isArray(parsed.customMessages)) {
          parsed.customMessages = parsed.customMessages
            .map((m) => ({
              ...m,
              slug: typeof m.slug === "string" ? m.slug : "",
              archived: typeof m.archived === "boolean" ? m.archived : false,
            }))
            .filter((m) => (m.name ?? "").trim() !== "" || (m.template ?? "").trim() !== "");
        }
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

  const addCustomMessage = useCallback((categoryId: string): string => {
    const id = `custom_${Date.now()}`;
    const newMsg: CustomMessage = {
      id,
      categoryId,
      name: "",
      trigger: "",
      template: "",
      slug: "",
      archived: false,
    };
    setState((prev) => ({
      ...prev,
      customMessages: [newMsg, ...prev.customMessages],
      enabledMessages: { ...prev.enabledMessages, [id]: true },
    }));
    return id;
  }, []);

  const saveCustomMessage = useCallback(
    (messageId: string, updates: { name: string; template: string }) => {
      setState((prev) => {
        const target = prev.customMessages.find((m) => m.id === messageId);
        if (!target) return prev;
        let nextSlug = target.slug;
        if (!nextSlug) {
          const taken = new Set(
            prev.customMessages
              .filter((m) => m.id !== messageId && m.slug)
              .map((m) => m.slug)
          );
          nextSlug = generateSlug(updates.name, taken);
        }
        return {
          ...prev,
          customMessages: prev.customMessages.map((m) =>
            m.id === messageId
              ? { ...m, name: updates.name, template: updates.template, slug: nextSlug }
              : m
          ),
        };
      });
    },
    []
  );

  const archiveCustomMessage = useCallback((messageId: string) => {
    setState((prev) => ({
      ...prev,
      customMessages: prev.customMessages.map((m) =>
        m.id === messageId ? { ...m, archived: true } : m
      ),
    }));
  }, []);

  const restoreCustomMessage = useCallback((messageId: string) => {
    setState((prev) => ({
      ...prev,
      customMessages: prev.customMessages.map((m) =>
        m.id === messageId ? { ...m, archived: false } : m
      ),
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
        saveCustomMessage,
        archiveCustomMessage,
        restoreCustomMessage,
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
