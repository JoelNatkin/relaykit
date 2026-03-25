"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

// ---------------------------------------------------------------------------
// Types & data
// ---------------------------------------------------------------------------

type CustomerStatus = "sandbox" | "pending" | "active" | "churned";
type SortKey = "name" | "status" | "useCase" | "registered" | "messages" | "compliance" | "plan" | "mrr" | "lastActivity";
type SortDir = "asc" | "desc";
type FilterTab = "all" | "sandbox" | "pending" | "active" | "churned";

interface Customer {
  id: string;
  name: string;
  app: string;
  status: CustomerStatus;
  useCase: string;
  registered: string;      // ISO date for sorting
  registeredLabel: string;  // Display string
  messages: number;
  compliance: number;       // 0–100
  plan: "Free" | "Go Live";
  mrr: number;
  lastActivity: string;     // relative time display
  lastActivityTs: number;   // epoch ms for sorting
}

const CUSTOMERS: Customer[] = [
  {
    id: "cust-1",
    name: "GlowStudio",
    app: "GlowStudio Booking",
    status: "active",
    useCase: "Appointments",
    registered: "2026-01-15",
    registeredLabel: "Jan 15, 2026",
    messages: 2847,
    compliance: 99.1,
    plan: "Go Live",
    mrr: 19,
    lastActivity: "2 hours ago",
    lastActivityTs: Date.now() - 2 * 60 * 60 * 1000,
  },
  {
    id: "cust-2",
    name: "TechRepair Pro",
    app: "TechRepair Hub",
    status: "active",
    useCase: "Support",
    registered: "2026-01-28",
    registeredLabel: "Jan 28, 2026",
    messages: 1203,
    compliance: 97.8,
    plan: "Go Live",
    mrr: 19,
    lastActivity: "5 hours ago",
    lastActivityTs: Date.now() - 5 * 60 * 60 * 1000,
  },
  {
    id: "cust-3",
    name: "FreshCuts Barbershop",
    app: "FreshCuts App",
    status: "pending",
    useCase: "Appointments",
    registered: "2026-03-12",
    registeredLabel: "Mar 12, 2026",
    messages: 0,
    compliance: 0,
    plan: "Go Live",
    mrr: 0,
    lastActivity: "1 day ago",
    lastActivityTs: Date.now() - 24 * 60 * 60 * 1000,
  },
  {
    id: "cust-4",
    name: "Bella's Nail Studio",
    app: "Bella Bookings",
    status: "active",
    useCase: "Appointments",
    registered: "2026-02-10",
    registeredLabel: "Feb 10, 2026",
    messages: 412,
    compliance: 100,
    plan: "Go Live",
    mrr: 19,
    lastActivity: "8 hours ago",
    lastActivityTs: Date.now() - 8 * 60 * 60 * 1000,
  },
  {
    id: "cust-5",
    name: "QuickFix Plumbing",
    app: "QuickFix Dispatch",
    status: "sandbox",
    useCase: "Support",
    registered: "2026-03-20",
    registeredLabel: "Mar 20, 2026",
    messages: 0,
    compliance: 0,
    plan: "Free",
    mrr: 0,
    lastActivity: "3 days ago",
    lastActivityTs: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
  {
    id: "cust-6",
    name: "FitZone Gym",
    app: "FitZone Reminders",
    status: "active",
    useCase: "Appointments",
    registered: "2025-12-05",
    registeredLabel: "Dec 5, 2025",
    messages: 3412,
    compliance: 99.8,
    plan: "Go Live",
    mrr: 19,
    lastActivity: "30 min ago",
    lastActivityTs: Date.now() - 30 * 60 * 1000,
  },
  {
    id: "cust-7",
    name: "PetPals Grooming",
    app: "PetPals Store",
    status: "active",
    useCase: "Appointments",
    registered: "2026-02-18",
    registeredLabel: "Feb 18, 2026",
    messages: 876,
    compliance: 96.4,
    plan: "Go Live",
    mrr: 19,
    lastActivity: "4 hours ago",
    lastActivityTs: Date.now() - 4 * 60 * 60 * 1000,
  },
  {
    id: "cust-8",
    name: "Downtown Deli",
    app: "Deli Orders",
    status: "active",
    useCase: "Orders",
    registered: "2026-01-03",
    registeredLabel: "Jan 3, 2026",
    messages: 4201,
    compliance: 98.5,
    plan: "Go Live",
    mrr: 29,
    lastActivity: "15 min ago",
    lastActivityTs: Date.now() - 15 * 60 * 1000,
  },
  {
    id: "cust-9",
    name: "CannaBliss",
    app: "CannaBliss Wellness",
    status: "churned",
    useCase: "Marketing",
    registered: "2026-03-05",
    registeredLabel: "Mar 5, 2026",
    messages: 0,
    compliance: 0,
    plan: "Free",
    mrr: 0,
    lastActivity: "1 week ago",
    lastActivityTs: Date.now() - 7 * 24 * 60 * 60 * 1000,
  },
  {
    id: "cust-10",
    name: "SpamKing Marketing",
    app: "SpamKing Blaster",
    status: "churned",
    useCase: "Marketing",
    registered: "2026-02-28",
    registeredLabel: "Feb 28, 2026",
    messages: 0,
    compliance: 0,
    plan: "Free",
    mrr: 0,
    lastActivity: "2 days ago",
    lastActivityTs: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: "cust-11",
    name: "YogaFlow Studio",
    app: "YogaFlow App",
    status: "active",
    useCase: "Appointments",
    registered: "2026-02-01",
    registeredLabel: "Feb 1, 2026",
    messages: 1589,
    compliance: 98.9,
    plan: "Go Live",
    mrr: 19,
    lastActivity: "1 hour ago",
    lastActivityTs: Date.now() - 60 * 60 * 1000,
  },
  {
    id: "cust-12",
    name: "UrbanBites",
    app: "UrbanBites Delivery",
    status: "active",
    useCase: "Orders",
    registered: "2025-11-20",
    registeredLabel: "Nov 20, 2025",
    messages: 6104,
    compliance: 88.3,
    plan: "Go Live",
    mrr: 29,
    lastActivity: "45 min ago",
    lastActivityTs: Date.now() - 45 * 60 * 1000,
  },
];

// ---------------------------------------------------------------------------
// Status config
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<CustomerStatus, { label: string; bg: string; text: string }> = {
  sandbox: { label: "Sandbox", bg: "bg-gray-100", text: "text-gray-600" },
  pending: { label: "Pending", bg: "bg-amber-100", text: "text-amber-700" },
  active: { label: "Active", bg: "bg-green-100", text: "text-green-700" },
  churned: { label: "Churned", bg: "bg-red-100", text: "text-red-700" },
};

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "sandbox", label: "Sandbox" },
  { id: "pending", label: "Pending" },
  { id: "active", label: "Active" },
  { id: "churned", label: "Churned" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function filterCustomers(customers: Customer[], tab: FilterTab): Customer[] {
  if (tab === "all") return customers;
  return customers.filter((c) => c.status === tab);
}

function complianceColor(rate: number): string {
  if (rate === 0) return "text-gray-400";
  if (rate >= 95) return "text-text-success-primary";
  if (rate >= 80) return "text-amber-600";
  return "text-text-error-primary";
}

function sortCustomers(customers: Customer[], key: SortKey, dir: SortDir): Customer[] {
  const sorted = [...customers].sort((a, b) => {
    let cmp = 0;
    switch (key) {
      case "name": cmp = a.name.localeCompare(b.name); break;
      case "status": cmp = a.status.localeCompare(b.status); break;
      case "useCase": cmp = a.useCase.localeCompare(b.useCase); break;
      case "registered": cmp = a.registered.localeCompare(b.registered); break;
      case "messages": cmp = a.messages - b.messages; break;
      case "compliance": cmp = a.compliance - b.compliance; break;
      case "plan": cmp = a.plan.localeCompare(b.plan); break;
      case "mrr": cmp = a.mrr - b.mrr; break;
      case "lastActivity": cmp = a.lastActivityTs - b.lastActivityTs; break;
    }
    return cmp;
  });
  return dir === "desc" ? sorted.reverse() : sorted;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CustomersPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterTab>("all");
  const [sortKey, setSortKey] = useState<SortKey>("lastActivity");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const filtered = useMemo(() => {
    return sortCustomers(filterCustomers(CUSTOMERS, filter), sortKey, sortDir);
  }, [filter, sortKey, sortDir]);

  const counts: Record<FilterTab, number> = {
    all: CUSTOMERS.length,
    sandbox: CUSTOMERS.filter((c) => c.status === "sandbox").length,
    pending: CUSTOMERS.filter((c) => c.status === "pending").length,
    active: CUSTOMERS.filter((c) => c.status === "active").length,
    churned: CUSTOMERS.filter((c) => c.status === "churned").length,
  };

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "lastActivity" || key === "messages" || key === "mrr" || key === "compliance" ? "desc" : "asc");
    }
  }

  function SortHeader({ label, sortKeyName, className }: { label: string; sortKeyName: SortKey; className?: string }) {
    const isActive = sortKey === sortKeyName;
    return (
      <th
        className={`px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer select-none hover:text-gray-200 transition duration-100 ease-linear ${className ?? ""}`}
        onClick={() => handleSort(sortKeyName)}
      >
        <span className="inline-flex items-center gap-1">
          {label}
          {isActive && (
            <span className="text-gray-300">{sortDir === "asc" ? "↑" : "↓"}</span>
          )}
        </span>
      </th>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text-primary">Customers</h1>
        <p className="mt-1 text-sm text-text-tertiary">{CUSTOMERS.length} customers</p>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition duration-100 ease-linear ${
              filter === tab.id
                ? "bg-white text-gray-900"
                : "bg-gray-800 text-gray-400 hover:text-gray-200"
            }`}
          >
            {tab.label}
            <span className={`ml-1.5 ${filter === tab.id ? "text-gray-500" : "text-gray-500"}`}>
              {counts[tab.id]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-gray-700">
              <SortHeader label="Customer" sortKeyName="name" />
              <SortHeader label="Status" sortKeyName="status" />
              <SortHeader label="Use case" sortKeyName="useCase" />
              <SortHeader label="Registered" sortKeyName="registered" />
              <SortHeader label="Messages" sortKeyName="messages" />
              <SortHeader label="Compliance" sortKeyName="compliance" className="hidden lg:table-cell" />
              <SortHeader label="Plan" sortKeyName="plan" />
              <SortHeader label="MRR" sortKeyName="mrr" className="hidden lg:table-cell" />
              <SortHeader label="Last activity" sortKeyName="lastActivity" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const statusCfg = STATUS_CONFIG[c.status];
              return (
                  <tr
                    key={c.id}
                    onClick={() => router.push(`/admin/customers/${c.id}`)}
                    className="border-b border-gray-700/50 hover:bg-gray-700/40 cursor-pointer transition duration-100 ease-linear"
                  >
                    {/* Customer name + app */}
                    <td className="px-4 py-3">
                      <div className="font-medium text-sm text-text-primary">{c.name}</div>
                      <div className="text-xs text-text-tertiary">{c.app}</div>
                    </td>

                    {/* Status badge */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusCfg.bg} ${statusCfg.text}`}>
                        {statusCfg.label}
                      </span>
                    </td>

                    {/* Use case */}
                    <td className="px-4 py-3 text-sm text-text-secondary">{c.useCase}</td>

                    {/* Registered date */}
                    <td className="px-4 py-3 text-sm text-text-secondary">{c.registeredLabel}</td>

                    {/* Messages this month */}
                    <td className="px-4 py-3 text-sm text-text-secondary tabular-nums">
                      {c.messages > 0 ? c.messages.toLocaleString() : "—"}
                    </td>

                    {/* Compliance rate */}
                    <td className={`px-4 py-3 text-sm tabular-nums hidden lg:table-cell ${complianceColor(c.compliance)}`}>
                      {c.compliance > 0 ? `${c.compliance}%` : "—"}
                    </td>

                    {/* Plan */}
                    <td className="px-4 py-3 text-sm text-text-secondary">{c.plan}</td>

                    {/* MRR */}
                    <td className="px-4 py-3 text-sm text-text-secondary tabular-nums hidden lg:table-cell">
                      {c.mrr > 0 ? `$${c.mrr}` : "—"}
                    </td>

                    {/* Last activity */}
                    <td className="px-4 py-3 text-sm text-text-tertiary">{c.lastActivity}</td>
                  </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-sm text-text-tertiary">
                  No customers match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
