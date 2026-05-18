"use client";

/**
 * Configurator state — selections, tone, business name, per-message overrides,
 * and visitor-authored custom messages — with cross-session localStorage
 * persistence.
 *
 * State is seeded from the message-library corpus, so it tracks the corpus as
 * categories are authored. Persisted state is merged over a fresh seed on load
 * (ids intersected with the live corpus), so a removed/renamed corpus entry
 * never resurrects a stale selection.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { CATEGORIES, categorySubs } from "@/lib/message-library";
import type { VariantTone } from "@/lib/message-library";

const STORAGE_KEY = "relaykit_configurator";
const STATE_VERSION = 1 as const;
const SAVE_DEBOUNCE_MS = 200;

/** Launch defaults — the only authored category and its primary sub start checked. */
const DEFAULT_CHECKED_CATEGORY = "verification";
const DEFAULT_CHECKED_SUBS: Record<string, string[]> = {
  verification: ["signup-phone-verification"],
};

const TONES: VariantTone[] = ["Standard", "Friendly", "Brief"];

export type OverrideTone = VariantTone | "Custom";

export interface MessageOverride {
  /** Tone variant the card is pinned to, or "Custom" once the body is hand-edited. */
  tone: OverrideTone;
  /** The hand-edited body — present only when `tone` is "Custom". */
  customBody?: string;
}

export interface MessageState {
  /** Absent = follows the page-level tone. Present = sticky card-level override. */
  override?: MessageOverride;
}

export interface SubState {
  checked: boolean;
  messages: Record<string, MessageState>;
}

/** A visitor-authored message. Carries forward into the workspace at signup. */
export interface CustomMessage {
  localId: string;
  name: string;
  body: string;
}

export interface CategoryState {
  checked: boolean;
  /** Keyed by sub id. Empty for workflow/unauthored categories. */
  subs: Record<string, SubState>;
  customMessages: CustomMessage[];
}

export interface ConfiguratorState {
  version: typeof STATE_VERSION;
  categories: Record<string, CategoryState>;
  pageTone: VariantTone;
  businessName: string;
}

export interface ConfiguratorActions {
  toggleCategory: (categoryId: string) => void;
  toggleSub: (categoryId: string, subId: string) => void;
  setPageTone: (tone: VariantTone) => void;
  setBusinessName: (name: string) => void;
  setMessageOverride: (
    categoryId: string,
    subId: string,
    messageId: string,
    override: MessageOverride | undefined,
  ) => void;
  addCustomMessage: (
    categoryId: string,
    message: { name: string; body: string },
  ) => void;
  updateCustomMessage: (
    categoryId: string,
    localId: string,
    patch: Partial<Pick<CustomMessage, "name" | "body">>,
  ) => void;
  removeCustomMessage: (categoryId: string, localId: string) => void;
  selectPreset: (presetId: string) => void;
}

function newLocalId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `cm-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** Fresh state seeded from the corpus, with launch defaults applied. */
function seedState(): ConfiguratorState {
  const categories: Record<string, CategoryState> = {};
  for (const category of CATEGORIES) {
    const subs: Record<string, SubState> = {};
    for (const sub of categorySubs(category)) {
      const messages: Record<string, MessageState> = {};
      for (const message of sub.messages) messages[message.id] = {};
      subs[sub.id] = {
        checked: (DEFAULT_CHECKED_SUBS[category.id] ?? []).includes(sub.id),
        messages,
      };
    }
    categories[category.id] = {
      checked: category.id === DEFAULT_CHECKED_CATEGORY,
      subs,
      customMessages: [],
    };
  }
  return { version: STATE_VERSION, categories, pageTone: "Standard", businessName: "" };
}

function isValidCustomMessage(value: unknown): value is CustomMessage {
  if (!value || typeof value !== "object") return false;
  const m = value as Record<string, unknown>;
  return (
    typeof m.localId === "string" &&
    typeof m.name === "string" &&
    typeof m.body === "string"
  );
}

function readOverride(value: unknown): MessageOverride | undefined {
  if (!value || typeof value !== "object") return undefined;
  const o = value as Record<string, unknown>;
  if (typeof o.tone !== "string") return undefined;
  if (o.tone !== "Custom" && !TONES.includes(o.tone as VariantTone)) return undefined;
  const override: MessageOverride = { tone: o.tone as OverrideTone };
  if (o.tone === "Custom" && typeof o.customBody === "string") {
    override.customBody = o.customBody;
  }
  return override;
}

/** Merge persisted state over a fresh seed, intersecting ids with the live corpus. */
function mergeStored(stored: unknown): ConfiguratorState {
  const seed = seedState();
  if (!stored || typeof stored !== "object") return seed;
  const s = stored as Partial<ConfiguratorState> & Record<string, unknown>;
  if (s.version !== STATE_VERSION) return seed; // version-gated drop, no migration

  if (typeof s.pageTone === "string" && TONES.includes(s.pageTone as VariantTone)) {
    seed.pageTone = s.pageTone as VariantTone;
  }
  if (typeof s.businessName === "string") seed.businessName = s.businessName;

  const storedCats = (s.categories ?? {}) as Record<string, Partial<CategoryState>>;
  for (const [catId, catState] of Object.entries(seed.categories)) {
    const storedCat = storedCats[catId];
    if (!storedCat) continue;
    if (typeof storedCat.checked === "boolean") catState.checked = storedCat.checked;
    if (Array.isArray(storedCat.customMessages)) {
      catState.customMessages = storedCat.customMessages.filter(isValidCustomMessage);
    }
    const storedSubs = (storedCat.subs ?? {}) as Record<string, Partial<SubState>>;
    for (const [subId, subState] of Object.entries(catState.subs)) {
      const storedSub = storedSubs[subId];
      if (!storedSub) continue;
      if (typeof storedSub.checked === "boolean") subState.checked = storedSub.checked;
      const storedMsgs = (storedSub.messages ?? {}) as Record<string, unknown>;
      for (const msgId of Object.keys(subState.messages)) {
        const override = readOverride((storedMsgs[msgId] as Record<string, unknown>)?.override);
        if (override) subState.messages[msgId] = { override };
      }
    }
  }
  return seed;
}

export function useConfiguratorState(): { state: ConfiguratorState } & ConfiguratorActions {
  const [state, setState] = useState<ConfiguratorState>(seedState);
  const hydratedRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate from localStorage on mount — client-only, so SSR renders the seed.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState(mergeStored(JSON.parse(raw)));
    } catch {
      // Parse/availability failure — keep the seeded default, never block render.
    }
    hydratedRef.current = true;
  }, []);

  // Debounced persist. Fail-silent on quota/availability errors.
  useEffect(() => {
    if (!hydratedRef.current) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // Storage unavailable/full — selections simply won't persist this session.
      }
    }, SAVE_DEBOUNCE_MS);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [state]);

  const toggleCategory = useCallback((categoryId: string) => {
    setState((prev) => {
      const cat = prev.categories[categoryId];
      if (!cat) return prev;
      return {
        ...prev,
        categories: {
          ...prev.categories,
          [categoryId]: { ...cat, checked: !cat.checked },
        },
      };
    });
  }, []);

  const toggleSub = useCallback((categoryId: string, subId: string) => {
    setState((prev) => {
      const cat = prev.categories[categoryId];
      const sub = cat?.subs[subId];
      if (!cat || !sub) return prev;
      return {
        ...prev,
        categories: {
          ...prev.categories,
          [categoryId]: {
            ...cat,
            subs: { ...cat.subs, [subId]: { ...sub, checked: !sub.checked } },
          },
        },
      };
    });
  }, []);

  const setPageTone = useCallback((tone: VariantTone) => {
    setState((prev) => ({ ...prev, pageTone: tone }));
  }, []);

  const setBusinessName = useCallback((name: string) => {
    setState((prev) => ({ ...prev, businessName: name }));
  }, []);

  const setMessageOverride = useCallback(
    (
      categoryId: string,
      subId: string,
      messageId: string,
      override: MessageOverride | undefined,
    ) => {
      setState((prev) => {
        const cat = prev.categories[categoryId];
        const sub = cat?.subs[subId];
        if (!cat || !sub || !(messageId in sub.messages)) return prev;
        return {
          ...prev,
          categories: {
            ...prev.categories,
            [categoryId]: {
              ...cat,
              subs: {
                ...cat.subs,
                [subId]: {
                  ...sub,
                  messages: {
                    ...sub.messages,
                    [messageId]: override ? { override } : {},
                  },
                },
              },
            },
          },
        };
      });
    },
    [],
  );

  const addCustomMessage = useCallback(
    (categoryId: string, message: { name: string; body: string }) => {
      setState((prev) => {
        const cat = prev.categories[categoryId];
        if (!cat) return prev;
        const next: CustomMessage = { localId: newLocalId(), ...message };
        return {
          ...prev,
          categories: {
            ...prev.categories,
            [categoryId]: { ...cat, customMessages: [...cat.customMessages, next] },
          },
        };
      });
    },
    [],
  );

  const updateCustomMessage = useCallback(
    (
      categoryId: string,
      localId: string,
      patch: Partial<Pick<CustomMessage, "name" | "body">>,
    ) => {
      setState((prev) => {
        const cat = prev.categories[categoryId];
        if (!cat) return prev;
        return {
          ...prev,
          categories: {
            ...prev.categories,
            [categoryId]: {
              ...cat,
              customMessages: cat.customMessages.map((m) =>
                m.localId === localId ? { ...m, ...patch } : m,
              ),
            },
          },
        };
      });
    },
    [],
  );

  const removeCustomMessage = useCallback((categoryId: string, localId: string) => {
    setState((prev) => {
      const cat = prev.categories[categoryId];
      if (!cat) return prev;
      return {
        ...prev,
        categories: {
          ...prev.categories,
          [categoryId]: {
            ...cat,
            customMessages: cat.customMessages.filter((m) => m.localId !== localId),
          },
        },
      };
    });
  }, []);

  // Resets checkbox selections to the launch default. Per spec §8.3 it leaves
  // message overrides and custom messages untouched.
  const selectPreset = useCallback((presetId: string) => {
    if (presetId !== "verification-only") return;
    setState((prev) => {
      const categories: Record<string, CategoryState> = {};
      for (const [catId, cat] of Object.entries(prev.categories)) {
        const subs: Record<string, SubState> = {};
        for (const [subId, sub] of Object.entries(cat.subs)) {
          subs[subId] = {
            ...sub,
            checked: (DEFAULT_CHECKED_SUBS[catId] ?? []).includes(subId),
          };
        }
        categories[catId] = {
          ...cat,
          checked: catId === DEFAULT_CHECKED_CATEGORY,
          subs,
        };
      }
      return { ...prev, categories };
    });
  }, []);

  return {
    state,
    toggleCategory,
    toggleSub,
    setPageTone,
    setBusinessName,
    setMessageOverride,
    addCustomMessage,
    updateCustomMessage,
    removeCustomMessage,
    selectPreset,
  };
}
