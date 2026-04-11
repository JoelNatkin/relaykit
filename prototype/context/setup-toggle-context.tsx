"use client";

import { createContext, useContext } from "react";

export interface SetupToggleContextValue {
  visible: boolean;
  toggle: () => void;
}

const SetupToggleContext = createContext<SetupToggleContextValue>({
  visible: false,
  toggle: () => {},
});

export const SetupToggleProvider = SetupToggleContext.Provider;

export function useSetupToggleState(): SetupToggleContextValue {
  return useContext(SetupToggleContext);
}
