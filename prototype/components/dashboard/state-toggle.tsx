"use client";

export type DashboardState = "pre-reg" | "sandbox" | "live";

interface StateToggleProps {
  state: DashboardState;
  onChange: (state: DashboardState) => void;
}

const STATES: { value: DashboardState; label: string }[] = [
  { value: "pre-reg", label: "Pre-reg" },
  { value: "sandbox", label: "Sandbox" },
  { value: "live", label: "Live" },
];

export function StateToggle({ state, onChange }: StateToggleProps) {
  return (
    <div className="inline-flex items-center rounded-lg border border-border-secondary bg-bg-secondary p-0.5">
      {STATES.map((s) => (
        <button
          key={s.value}
          type="button"
          onClick={() => onChange(s.value)}
          className={`px-3 py-1 text-xs font-medium rounded-md transition duration-100 ease-linear cursor-pointer ${
            state === s.value
              ? "bg-bg-primary text-text-primary shadow-xs"
              : "text-text-tertiary hover:text-text-secondary"
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
