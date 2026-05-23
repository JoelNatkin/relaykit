"use client";

/**
 * Configurator state — category and per-message selections, page tone,
 * business name, and per-category authored content — with cross-session
 * localStorage persistence.
 *
 * State is seeded from the message-library corpus, so it tracks the corpus as
 * categories are authored. Persisted state is merged over a fresh seed on load
 * (ids intersected with the live corpus), so a removed/renamed corpus entry
 * never resurrects a stale selection.
 *
 * Authored content (D-414 / configurator-authoring Resolved §1) lives in
 * `categoryValues[catId]`, four buckets per category:
 *   - variables:     per-variable values, shared across the category's messages
 *   - customBodies:  hand-edited bodies for corpus messages, keyed by message id
 *   - addedMessages: messages the author created via "+ Add message"
 *   - messageTones:  per-message tone pin (absent = follows page tone)
 *
 * STATE_VERSION 4 retires the v3 in-message `MessageOverride` shape; per-
 * message tone and hand-edited body now live in `categoryValues`. Bumps are
 * version-gated and fail-silent — no migration code (D-409 precedent).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { CATEGORIES } from "@/lib/message-library";
import type { VariantTone } from "@/lib/message-library";

const STORAGE_KEY = "relaykit_configurator";
const STATE_VERSION = 4 as const;
const SAVE_DEBOUNCE_MS = 200;

/**
 * Launch default — the default category starts checked, and all of its messages
 * start checked along with it. Per-message granular defaults are intentionally
 * absent: the `toggleCategory` cascade makes "category on ⇒ every message on"
 * the consistent semantic, so the seed derives from `DEFAULT_CHECKED_CATEGORY`
 * alone — adding a new Verification message later is automatically picked up
 * at launch without an extra bookkeeping list.
 */
const DEFAULT_CHECKED_CATEGORY = "verification";

const TONES: VariantTone[] = ["Standard", "Friendly", "Brief"];

export interface MessageState {
  checked: boolean;
}

export interface CategoryState {
  checked: boolean;
  /** Keyed by message id. Empty for unauthored categories. */
  messages: Record<string, MessageState>;
}

/** A visitor-authored message — no corpus template behind it. Carries forward into the workspace at signup. */
export interface AddedMessage {
  localId: string;
  name: string;
  body: string;
}

/** Per-category authored content. Empty buckets when the visitor has touched nothing. */
export interface CategoryValues {
  variables: Record<string, string>;
  customBodies: Record<string, string>;
  addedMessages: AddedMessage[];
  messageTones: Record<string, VariantTone>;
}

export interface ConfiguratorState {
  version: typeof STATE_VERSION;
  categories: Record<string, CategoryState>;
  categoryValues: Record<string, CategoryValues>;
  pageTone: VariantTone;
  businessName: string;
}

/** Save decision from a corpus message's edit card. */
export type MessageEditDecision =
  | { kind: "tone"; tone: VariantTone }
  | { kind: "custom"; body: string };

export interface ConfiguratorActions {
  toggleCategory: (categoryId: string) => void;
  toggleMessage: (categoryId: string, messageId: string) => void;
  setPageTone: (tone: VariantTone) => void;
  setBusinessName: (name: string) => void;
  /**
   * Commit a message edit. `{ kind: "tone" }` pins the message to a corpus
   * variant and clears any hand-edited body; `{ kind: "custom" }` writes a
   * hand-edited body and clears any tone pin; `undefined` clears both.
   */
  setMessageEdit: (
    categoryId: string,
    messageId: string,
    decision: MessageEditDecision | undefined,
  ) => void;
  addCustomMessage: (
    categoryId: string,
    message: { name: string; body: string },
  ) => void;
  updateCustomMessage: (
    categoryId: string,
    localId: string,
    patch: Partial<Pick<AddedMessage, "name" | "body">>,
  ) => void;
  removeCustomMessage: (categoryId: string, localId: string) => void;
}

function newLocalId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `cm-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function emptyCategoryValues(): CategoryValues {
  return { variables: {}, customBodies: {}, addedMessages: [], messageTones: {} };
}

/** Return a copy of `rec` without `key`, or the same object when `key` is absent. */
function omit<T>(rec: Record<string, T>, key: string): Record<string, T> {
  if (!(key in rec)) return rec;
  const out: Record<string, T> = {};
  for (const [k, v] of Object.entries(rec)) {
    if (k !== key) out[k] = v;
  }
  return out;
}

/** Fresh state seeded from the corpus, with the launch default applied. */
function seedState(): ConfiguratorState {
  const categories: Record<string, CategoryState> = {};
  const categoryValues: Record<string, CategoryValues> = {};
  for (const category of CATEGORIES) {
    const isDefaultCategory = category.id === DEFAULT_CHECKED_CATEGORY;
    const messages: Record<string, MessageState> = {};
    for (const message of category.messages) {
      messages[message.id] = { checked: isDefaultCategory };
    }
    categories[category.id] = { checked: isDefaultCategory, messages };
    categoryValues[category.id] = emptyCategoryValues();
  }
  return {
    version: STATE_VERSION,
    categories,
    categoryValues,
    pageTone: "Standard",
    businessName: "",
  };
}

function isAddedMessage(value: unknown): value is AddedMessage {
  if (!value || typeof value !== "object") return false;
  const m = value as Record<string, unknown>;
  return (
    typeof m.localId === "string" &&
    typeof m.name === "string" &&
    typeof m.body === "string"
  );
}

function readStringMap(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object") return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (typeof v === "string") out[k] = v;
  }
  return out;
}

function readToneMap(value: unknown): Record<string, VariantTone> {
  if (!value || typeof value !== "object") return {};
  const out: Record<string, VariantTone> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (typeof v === "string" && TONES.includes(v as VariantTone)) {
      out[k] = v as VariantTone;
    }
  }
  return out;
}

function readCategoryValues(value: unknown): CategoryValues {
  if (!value || typeof value !== "object") return emptyCategoryValues();
  const v = value as Record<string, unknown>;
  return {
    variables: readStringMap(v.variables),
    customBodies: readStringMap(v.customBodies),
    addedMessages: Array.isArray(v.addedMessages)
      ? v.addedMessages.filter(isAddedMessage)
      : [],
    messageTones: readToneMap(v.messageTones),
  };
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
    const storedMsgs = (storedCat.messages ?? {}) as Record<string, Partial<MessageState>>;
    for (const [msgId, msgState] of Object.entries(catState.messages)) {
      const storedMsg = storedMsgs[msgId];
      if (!storedMsg) continue;
      if (typeof storedMsg.checked === "boolean") msgState.checked = storedMsg.checked;
    }
  }

  const storedCV = (s.categoryValues ?? {}) as Record<string, unknown>;
  for (const catId of Object.keys(seed.categoryValues)) {
    if (storedCV[catId] !== undefined) {
      seed.categoryValues[catId] = readCategoryValues(storedCV[catId]);
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

  // Cascades to every message in the category — ON sets all messages checked,
  // OFF sets all unchecked. Authored content (categoryValues) is preserved.
  const toggleCategory = useCallback((categoryId: string) => {
    setState((prev) => {
      const cat = prev.categories[categoryId];
      if (!cat) return prev;
      const nextChecked = !cat.checked;
      const messages: Record<string, MessageState> = {};
      for (const [msgId, msg] of Object.entries(cat.messages)) {
        messages[msgId] = { ...msg, checked: nextChecked };
      }
      return {
        ...prev,
        categories: {
          ...prev.categories,
          [categoryId]: { ...cat, checked: nextChecked, messages },
        },
      };
    });
  }, []);

  const toggleMessage = useCallback((categoryId: string, messageId: string) => {
    setState((prev) => {
      const cat = prev.categories[categoryId];
      const msg = cat?.messages[messageId];
      if (!cat || !msg) return prev;
      return {
        ...prev,
        categories: {
          ...prev.categories,
          [categoryId]: {
            ...cat,
            messages: { ...cat.messages, [messageId]: { ...msg, checked: !msg.checked } },
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

  const setMessageEdit = useCallback(
    (
      categoryId: string,
      messageId: string,
      decision: MessageEditDecision | undefined,
    ) => {
      setState((prev) => {
        const cv = prev.categoryValues[categoryId];
        if (!cv) return prev;
        let customBodies = cv.customBodies;
        let messageTones = cv.messageTones;
        if (!decision) {
          customBodies = omit(customBodies, messageId);
          messageTones = omit(messageTones, messageId);
        } else if (decision.kind === "tone") {
          customBodies = omit(customBodies, messageId);
          messageTones = { ...messageTones, [messageId]: decision.tone };
        } else {
          customBodies = { ...customBodies, [messageId]: decision.body };
          messageTones = omit(messageTones, messageId);
        }
        return {
          ...prev,
          categoryValues: {
            ...prev.categoryValues,
            [categoryId]: { ...cv, customBodies, messageTones },
          },
        };
      });
    },
    [],
  );

  const addCustomMessage = useCallback(
    (categoryId: string, message: { name: string; body: string }) => {
      setState((prev) => {
        const cv = prev.categoryValues[categoryId];
        if (!cv) return prev;
        const next: AddedMessage = { localId: newLocalId(), ...message };
        return {
          ...prev,
          categoryValues: {
            ...prev.categoryValues,
            [categoryId]: { ...cv, addedMessages: [...cv.addedMessages, next] },
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
      patch: Partial<Pick<AddedMessage, "name" | "body">>,
    ) => {
      setState((prev) => {
        const cv = prev.categoryValues[categoryId];
        if (!cv) return prev;
        return {
          ...prev,
          categoryValues: {
            ...prev.categoryValues,
            [categoryId]: {
              ...cv,
              addedMessages: cv.addedMessages.map((m) =>
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
      const cv = prev.categoryValues[categoryId];
      if (!cv) return prev;
      return {
        ...prev,
        categoryValues: {
          ...prev.categoryValues,
          [categoryId]: {
            ...cv,
            addedMessages: cv.addedMessages.filter((m) => m.localId !== localId),
          },
        },
      };
    });
  }, []);

  return {
    state,
    toggleCategory,
    toggleMessage,
    setPageTone,
    setBusinessName,
    setMessageEdit,
    addCustomMessage,
    updateCustomMessage,
    removeCustomMessage,
  };
}
