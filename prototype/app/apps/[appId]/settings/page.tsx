"use client";

import { useSession } from "@/context/session-context";

export default function AppSettings() {
  const { state } = useSession();

  return (
    <div className="py-4">
      <h2 className="text-lg font-semibold text-text-primary">Settings</h2>
      <p className="mt-1 text-sm text-text-tertiary">
        Settings tab — Task 14 ({state.appState === "sandbox" ? "sandbox key only" : "sandbox + live keys"})
      </p>
    </div>
  );
}
