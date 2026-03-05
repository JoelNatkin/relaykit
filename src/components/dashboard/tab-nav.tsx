"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/base/buttons/button";
import type { LifecycleStage } from "@/lib/dashboard/lifecycle";

interface Tab {
  label: string;
  href: string;
  minStage?: LifecycleStage;
}

const TABS: Tab[] = [
  { label: "Overview", href: "/dashboard" },
  { label: "Messages", href: "/dashboard/messages", minStage: "use_case_selected" },
  { label: "Compliance", href: "/dashboard/compliance", minStage: "use_case_selected" },
];

const STAGE_ORDER: LifecycleStage[] = [
  "new",
  "use_case_selected",
  "building",
  "ready",
  "registering",
  "live",
];

function stageIndex(stage: LifecycleStage): number {
  return STAGE_ORDER.indexOf(stage);
}

interface TabNavProps {
  stage: LifecycleStage;
}

export function TabNav({ stage }: TabNavProps) {
  const pathname = usePathname();

  const visibleTabs = TABS.filter(
    (tab) => !tab.minStage || stageIndex(stage) >= stageIndex(tab.minStage),
  );

  return (
    <nav className="flex gap-1 border-b border-secondary pb-px">
      {visibleTabs.map((tab) => {
        const isActive =
          tab.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(tab.href);

        return (
          <Button
            key={tab.href}
            href={tab.href}
            color={isActive ? "secondary" : "tertiary"}
            size="sm"
            className={
              isActive
                ? "border-b-2 border-brand rounded-b-none"
                : ""
            }
          >
            {tab.label}
          </Button>
        );
      })}
    </nav>
  );
}
