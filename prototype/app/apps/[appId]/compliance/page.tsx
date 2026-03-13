"use client";

import { useSession } from "@/context/session-context";

export default function AppCompliance() {
  const { state } = useSession();

  return (
    <div className="py-4">
      <h2 className="text-lg font-semibold text-text-primary">Compliance</h2>
      <p className="mt-1 text-sm text-text-tertiary">
        {state.appState === "sandbox"
          ? "Sandbox compliance preview — Task 12"
          : "Live compliance monitoring — Task 13"}
      </p>
    </div>
  );
}
