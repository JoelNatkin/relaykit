"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/session-context";
import {
  Calendar,
  Package,
  Plus,
  ArrowRight,
} from "@untitledui/icons";
import { useEffect } from "react";

const SAMPLE_APPS = [
  {
    id: "radarlove",
    name: "RadarLove",
    category: "Appointments",
    categoryIcon: Calendar,
    status: "sandbox" as const,
    lastActivity: "2 hours ago",
  },
  {
    id: "shipfast",
    name: "ShipFast",
    category: "Order updates",
    categoryIcon: Package,
    status: "live" as const,
    lastActivity: "Mar 10, 2026",
  },
];

const STATUS_STYLES = {
  sandbox: {
    bg: "bg-bg-brand-secondary",
    text: "text-text-brand-secondary",
    label: "Sandbox",
  },
  building: {
    bg: "bg-bg-warning-secondary",
    text: "text-text-warning-primary",
    label: "Building",
  },
  registered: {
    bg: "bg-bg-success-secondary",
    text: "text-text-success-primary",
    label: "Registered",
  },
  live: {
    bg: "bg-bg-success-secondary",
    text: "text-text-success-primary",
    label: "Live",
  },
};

export default function YourApps() {
  const router = useRouter();
  const { state } = useSession();

  // Redirect to home if not logged in
  useEffect(() => {
    if (!state.isLoggedIn) {
      router.replace("/");
    }
  }, [state.isLoggedIn, router]);

  if (!state.isLoggedIn) return null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Your Apps</h1>
          <p className="mt-1 text-sm text-text-tertiary">
            Each app has its own message library, API key, and registration.
          </p>
        </div>
        <Link
          href="/choose"
          className="inline-flex items-center gap-2 rounded-lg border border-border-primary px-4 py-2 text-sm font-medium text-text-secondary transition duration-100 ease-linear hover:bg-bg-primary_hover"
        >
          <Plus className="size-4" />
          Add new app
        </Link>
      </div>

      <div className="space-y-3">
        {SAMPLE_APPS.map((app) => {
          const statusStyle = STATUS_STYLES[app.status];
          return (
            <Link
              key={app.id}
              href={`/apps/${app.id}/messages`}
              className="group flex items-center justify-between rounded-xl border border-border-secondary bg-bg-primary p-5 transition duration-100 ease-linear hover:border-border-brand hover:shadow-xs"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-secondary group-hover:bg-bg-brand-secondary">
                  <app.categoryIcon className="size-5 text-fg-secondary group-hover:text-fg-brand-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-text-primary">
                      {app.name}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                      {statusStyle.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-text-tertiary">{app.category}</span>
                    <span className="text-xs text-text-quaternary">·</span>
                    <span className="text-xs text-text-quaternary">{app.lastActivity}</span>
                  </div>
                </div>
              </div>
              <ArrowRight className="size-4 text-fg-quaternary group-hover:text-fg-brand-primary transition duration-100 ease-linear" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
