"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/session-context";
import {
  Calendar,
  Plus,
  ArrowRight,
} from "@untitledui/icons";
import { useEffect } from "react";

const SAMPLE_APPS = [
  {
    id: "glowstudio",
    name: "GlowStudio",
    category: "Appointments",
    categoryIcon: Calendar,
    status: "sandbox" as const,
    created: "March 16, 2026",
  },
];

const STATUS_STYLES = {
  sandbox: {
    bg: "bg-bg-brand-secondary",
    text: "text-text-brand-secondary",
    label: "Sandbox",
  },
  registered: {
    bg: "bg-bg-warning-secondary",
    text: "text-text-warning-primary",
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
          <h1 className="text-2xl font-semibold text-text-primary">Your Apps</h1>
          <p className="mt-1 text-sm text-text-tertiary">
            Manage your SMS projects.
          </p>
        </div>
        <Link
          href="/start"
          className="inline-flex items-center gap-2 rounded-lg border border-border-primary px-4 py-2 text-sm font-medium text-text-secondary transition duration-100 ease-linear hover:bg-bg-primary_hover cursor-pointer"
        >
          <Plus className="size-4" />
          New project
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SAMPLE_APPS.map((app) => {
          const statusStyle = STATUS_STYLES[app.status];
          return (
            <Link
              key={app.id}
              href={`/apps/${app.id}`}
              className="group flex flex-col justify-between rounded-lg border border-border-secondary bg-bg-primary p-5 transition duration-100 ease-linear hover:border-border-brand hover:shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-bg-secondary group-hover:bg-bg-brand-secondary transition duration-100 ease-linear">
                      <app.categoryIcon className="size-4.5 text-fg-secondary group-hover:text-fg-brand-primary transition duration-100 ease-linear" />
                    </div>
                    <span className="text-base font-semibold text-text-primary">
                      {app.name}
                    </span>
                  </div>
                  <ArrowRight className="size-4 text-fg-quaternary group-hover:text-fg-brand-primary transition duration-100 ease-linear" />
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="inline-flex items-center rounded-full bg-bg-secondary px-2 py-0.5 text-[11px] font-medium text-text-tertiary">
                    {app.category}
                  </span>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                    {statusStyle.label}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-xs text-text-tertiary">Created {app.created}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
