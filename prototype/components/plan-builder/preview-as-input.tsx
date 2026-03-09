"use client";

import { useSession } from "@/context/session-context";

export function PreviewAsInput() {
  const { state, setField } = useSession();

  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="text-sm font-medium text-text-tertiary">Preview as</span>
      <input
        type="text"
        placeholder="Your app name"
        value={state.appName}
        onChange={(e) => setField("appName", e.target.value)}
        className="flex-1 border-b border-border-secondary bg-transparent text-lg font-semibold text-text-primary placeholder:text-text-placeholder focus:border-border-brand focus:outline-none"
      />
    </div>
  );
}
