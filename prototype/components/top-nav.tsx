"use client";

export function TopNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-border-secondary bg-bg-primary px-6">
      {/* Left: wordmark */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-text-primary">RelayKit</span>
      </div>

      {/* Center: empty for now */}
      <div />

      {/* Right: Register button */}
      <button
        type="button"
        onClick={() => alert("Registration flow coming soon.")}
        className="rounded-lg bg-bg-brand-solid px-4 py-2 text-sm font-medium text-text-white transition duration-100 ease-linear hover:bg-bg-brand-solid_hover"
      >
        Register &rarr;
      </button>
    </nav>
  );
}
