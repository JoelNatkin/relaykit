"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const TABS = [
  { id: "overview", label: "Overview", href: (appId: string) => `/apps/${appId}/overview` },
  { id: "messages", label: "Messages", href: (appId: string) => `/apps/${appId}/messages` },
  { id: "registration", label: "Registration", href: (appId: string) => `/apps/${appId}/registration` },
  { id: "settings", label: "Settings", href: (appId: string) => `/apps/${appId}/settings` },
];

const APP_NAMES: Record<string, string> = {
  glowstudio: "GlowStudio",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { appId } = useParams<{ appId: string }>();
  const pathname = usePathname();

  const appName = APP_NAMES[appId] || appId;

  return (
    <div className="mx-auto max-w-5xl px-6">
      {/* Breadcrumb */}
      <div className="pt-6 pb-4">
        <nav className="flex items-center gap-1.5 text-sm">
          <Link href="/apps" className="text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear">
            Your Apps
          </Link>
          <span className="text-text-quaternary">/</span>
          <span className="font-medium text-text-primary">{appName}</span>
        </nav>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b border-border-secondary mb-6">
        {TABS.map((tab) => {
          const href = tab.href(appId);
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={tab.id}
              href={href}
              className={`px-3 py-2.5 text-sm font-medium transition duration-100 ease-linear border-b-2 -mb-px ${
                isActive
                  ? "border-border-brand text-text-brand-secondary"
                  : "border-transparent text-text-tertiary hover:text-text-secondary hover:border-border-primary"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Page content */}
      <div className="pb-16">
        {children}
      </div>
    </div>
  );
}
