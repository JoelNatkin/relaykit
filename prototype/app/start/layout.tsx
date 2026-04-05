import type { ReactNode } from "react";

export default function StartLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-[calc(100vh-3.5rem)] bg-bg-primary">{children}</div>;
}
