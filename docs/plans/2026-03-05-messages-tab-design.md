# Messages Tab + Message Library Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the Messages tab (`/dashboard/messages`) with a read-only three-tier message library that shows sandbox plan entries or post-registration canon messages.

**Architecture:** Single `MessageLibrary` component renders three tier sections from the existing `/api/message-plan` endpoint data. A separate `MessageLibraryEntry` component displays each message card with tier badge, copy button, and optional canon star. The Messages page wraps the library with contextual links (edit on Overview, Go Live CTA). No new API routes — reuses existing data.

**Tech Stack:** Next.js App Router, React client components, Untitled UI badges/buttons, `@untitledui/icons`, dashboard context for lifecycle stage.

---

### Task 1: MessageLibraryEntry component

**Files:**
- Create: `src/components/dashboard/message-library-entry.tsx`

**Step 1: Create the MessageLibraryEntry component**

This is a read-only card for a single message. It shows the category name, message text (with `{variables}` visually highlighted), a tier badge, an optional canon star, and a copy button.

```tsx
"use client";

import { useState } from "react";
import { BadgeWithDot, BadgeWithIcon } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Copy06, Star01 } from "@untitledui/icons";
import type { MessagePlanEntry } from "@/lib/dashboard/message-plan-types";

type Tier = "included" | "available" | "expansion";

interface MessageLibraryEntryProps {
  entry: MessagePlanEntry;
  tier: Tier;
  isCanon: boolean;
}

const TIER_CONFIG = {
  included: {
    label: "Included with your registration",
    color: "success" as const,
  },
  available: {
    label: "Also available with your registration",
    color: "gray" as const,
  },
  expansion: {
    label: "Requires an additional campaign",
    color: "warning" as const,
  },
} as const;

function highlightVariables(text: string): React.ReactNode[] {
  const parts = text.split(/(\{[^}]+\})/g);
  return parts.map((part, i) =>
    part.startsWith("{") && part.endsWith("}") ? (
      <span key={i} className="rounded bg-brand-secondary px-0.5 text-brand-secondary">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export function MessageLibraryEntry({
  entry,
  tier,
  isCanon,
}: MessageLibraryEntryProps) {
  const [copied, setCopied] = useState(false);
  const displayText = entry.edited_text ?? entry.original_template;
  const tierConfig = TIER_CONFIG[tier];

  async function handleCopy() {
    await navigator.clipboard.writeText(displayText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-lg border border-secondary bg-primary p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {isCanon && (
              <Star01 className="size-4 shrink-0 text-fg-warning-secondary" />
            )}
            <span className="text-sm font-medium text-primary">
              {entry.category}
            </span>
            {isCanon && (
              <Badge size="sm" color="brand" type="pill-color">
                Registered message
              </Badge>
            )}
          </div>

          <p className="mt-1.5 whitespace-pre-wrap font-mono text-sm text-tertiary">
            &ldquo;{highlightVariables(displayText)}&rdquo;
          </p>

          <p className="mt-1.5 text-xs text-quaternary">
            Trigger: {entry.trigger}
          </p>

          {tier === "expansion" && entry.expansion_type && (
            <p className="mt-1.5 text-xs text-tertiary">
              Needs {entry.expansion_type} campaign — we register it alongside
              your existing one.
            </p>
          )}
        </div>

        <Button
          size="sm"
          color="tertiary"
          iconLeading={Copy06}
          onClick={handleCopy}
        >
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>

      <div className="mt-3">
        {tier === "expansion" ? (
          <BadgeWithIcon
            iconLeading={Star01}
            size="sm"
            color={tierConfig.color}
            type="pill-color"
          >
            {tierConfig.label}
          </BadgeWithIcon>
        ) : (
          <BadgeWithDot size="sm" color={tierConfig.color} type="pill-color">
            {tierConfig.label}
          </BadgeWithDot>
        )}
      </div>
    </div>
  );
}
```

**Important notes for the implementer:**
- Import `Badge` from `@/components/base/badges/badges` — it uses generics with `type` prop
- The `BadgeWithDot` and `BadgeWithIcon` components accept `type` as `"pill-color" | "color" | "modern"`
- `highlightVariables()` splits on `{variable}` patterns and wraps them in a brand-colored span
- The canon badge uses `Badge` with `"brand"` color, the tier badge uses `BadgeWithDot` or `BadgeWithIcon`
- `Copy06` icon is from `@untitledui/icons` — verify it exists; fallback to `Copy01` if not
- Buttons use `onClick` not `onPress` (per CC_HANDOFF.md gotcha #5)

**Step 2: Verify the icon imports exist**

Run: `grep -r "Copy06\|Copy01" node_modules/@untitledui/icons/dist/ | head -5`

If `Copy06` doesn't exist, use `Copy01` instead.

**Step 3: Commit**

```bash
git add src/components/dashboard/message-library-entry.tsx
git commit -m "feat: message library entry component with three-tier badges"
```

---

### Task 2: MessageLibrary component

**Files:**
- Create: `src/components/dashboard/message-library.tsx`

**Step 1: Create the MessageLibrary component**

This fetches the message plan from `/api/message-plan` and renders three tier sections. In registered mode (`stage === "live"` or `stage === "registering"`), it also accepts `canonMessageIds` to mark registered messages.

```tsx
"use client";

import { useEffect, useState } from "react";
import { useDashboard } from "./dashboard-context";
import { MessageLibraryEntry } from "./message-library-entry";
import { getMessageTemplates } from "@/lib/templates/message-templates";
import type { MessagePlanEntry } from "@/lib/dashboard/message-plan-types";
import type { MessageTemplate } from "@/lib/templates/message-templates";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { MessageSquare02, Star01 } from "@untitledui/icons";
import { ChevronDown } from "@untitledui/icons";
import { cx } from "@/utils/cx";

interface MessageLibraryProps {
  canonMessageIds?: string[];
}

export function MessageLibrary({ canonMessageIds = [] }: MessageLibraryProps) {
  const { stage, useCase } = useDashboard();
  const [entries, setEntries] = useState<MessagePlanEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expansionOpen, setExpansionOpen] = useState(false);
  const canonSet = new Set(canonMessageIds);

  useEffect(() => {
    if (!useCase) {
      setIsLoading(false);
      return;
    }

    async function load() {
      try {
        const res = await fetch("/api/message-plan");
        if (res.ok) {
          const data = await res.json();
          if (data.messages && data.use_case === useCase) {
            setEntries(data.messages);
            setIsLoading(false);
            return;
          }
        }
        // Fallback: build from templates
        const templates = getMessageTemplates(useCase!);
        setEntries(
          templates
            .filter((t) => t.default_enabled)
            .map(templateToEntry),
        );
      } catch {
        // Silent fallback
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [useCase]);

  if (!useCase) {
    return (
      <EmptyState
        title="Pick a use case first"
        description="Head to the Overview tab and choose what you're building — we'll show message templates for it."
      />
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-tertiary" />
        <div className="h-24 animate-pulse rounded-lg bg-secondary" />
        <div className="h-24 animate-pulse rounded-lg bg-secondary" />
      </div>
    );
  }

  // Three-tier split (D-35)
  // Canon messages sort first within each tier
  const sortByCanon = (a: MessagePlanEntry, b: MessagePlanEntry) => {
    const aCanon = canonSet.has(a.template_id) ? 0 : 1;
    const bCanon = canonSet.has(b.template_id) ? 0 : 1;
    return aCanon - bCanon;
  };

  const includedMessages = entries
    .filter((e) => !e.is_expansion && e.enabled)
    .sort(sortByCanon);
  const availableMessages = entries
    .filter((e) => !e.is_expansion && !e.enabled);
  const expansionMessages = entries
    .filter((e) => e.is_expansion);

  const hasAnyMessages = includedMessages.length > 0 || availableMessages.length > 0;

  if (!hasAnyMessages && expansionMessages.length === 0) {
    return (
      <EmptyState
        title="No messages selected yet"
        description="Head to the Overview tab to build your message plan — your selections will appear here."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Tier 1: Included */}
      {includedMessages.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-success-primary">
            Included with your registration
          </h3>
          {includedMessages.map((entry) => (
            <MessageLibraryEntry
              key={entry.template_id}
              entry={entry}
              tier="included"
              isCanon={canonSet.has(entry.template_id)}
            />
          ))}
        </div>
      )}

      {/* Tier 2: Available */}
      {availableMessages.length > 0 && (
        <div className="space-y-3">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-tertiary">
              Also available with your registration
            </h3>
            <p className="mt-0.5 text-xs text-quaternary">
              Your registration covers these too — turn them on from the Overview tab when you need them.
            </p>
          </div>
          {availableMessages.map((entry) => (
            <MessageLibraryEntry
              key={entry.template_id}
              entry={entry}
              tier="available"
              isCanon={false}
            />
          ))}
        </div>
      )}

      {/* Tier 3: Expansion */}
      {expansionMessages.length > 0 && (
        <div className="border-t border-secondary pt-4">
          <button
            type="button"
            onClick={() => setExpansionOpen((v) => !v)}
            className="flex w-full items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <Star01 className="size-4 text-fg-warning-secondary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-tertiary">
                Expansion messages
              </span>
            </div>
            <ChevronDown
              className={cx(
                "size-4 text-fg-quaternary transition duration-100 ease-linear",
                expansionOpen && "rotate-180",
              )}
            />
          </button>
          <p className="mt-1 text-xs text-quaternary">
            These need a broader registration — we handle the second campaign alongside your existing one.
          </p>

          {expansionOpen && (
            <div className="mt-3 space-y-3">
              {expansionMessages.map((entry) => (
                <MessageLibraryEntry
                  key={entry.template_id}
                  entry={entry}
                  tier="expansion"
                  isCanon={canonSet.has(entry.template_id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function templateToEntry(t: MessageTemplate): MessagePlanEntry {
  return {
    template_id: t.id,
    category: t.category,
    original_template: t.text,
    edited_text: null,
    trigger: t.trigger,
    variables: t.variables,
    is_expansion: t.is_expansion,
    expansion_type: t.expansion_type ?? null,
    enabled: t.default_enabled,
  };
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-secondary bg-primary px-6 py-12 text-center">
      <FeaturedIcon
        icon={MessageSquare02}
        size="lg"
        color="gray"
        theme="light"
      />
      <h3 className="mt-4 text-sm font-semibold text-primary">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-tertiary">{description}</p>
    </div>
  );
}
```

**Important notes for the implementer:**
- `canonMessageIds` is an optional prop — only passed in registered mode. The page component determines whether to fetch canon IDs.
- `templateToEntry()` helper converts a `MessageTemplate` to `MessagePlanEntry` for the fallback path (no saved plan).
- The loading skeleton matches the pattern from `message-plan-builder.tsx`.
- Expansion section uses the same collapsible pattern as the plan builder.
- `EmptyState` uses `FeaturedIcon` with `MessageSquare02` — verify this icon exists in `@untitledui/icons`.
- The component fetches data client-side (same pattern as plan builder) so it works as a client component within the server-rendered layout.

**Step 2: Commit**

```bash
git add src/components/dashboard/message-library.tsx
git commit -m "feat: message library component with three-tier sections"
```

---

### Task 3: Messages page

**Files:**
- Modify: `src/app/dashboard/messages/page.tsx`

**Step 1: Replace the placeholder messages page**

The page renders the `MessageLibrary` with contextual navigation — a link to Overview for editing (sandbox), Go Live CTA (ready stage), or canon message context (registered).

```tsx
"use client";

import { useDashboard } from "@/components/dashboard/dashboard-context";
import { MessageLibrary } from "@/components/dashboard/message-library";
import { GoLiveCta } from "@/components/dashboard/go-live-cta";
import { Button } from "@/components/base/buttons/button";
import { ArrowLeft } from "@untitledui/icons";

export default function DashboardMessagesPage() {
  const { stage } = useDashboard();
  const isRegistered = stage === "live" || stage === "registering";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-primary">Messages</h1>
        <p className="mt-1 text-sm text-tertiary">
          {isRegistered
            ? "Your message library — registered messages are marked with a star."
            : "Your message library — a read-only view of your plan. Edit messages on the Overview tab."}
        </p>
      </div>

      {!isRegistered && (
        <Button
          href="/dashboard"
          color="link-color"
          size="sm"
          iconLeading={ArrowLeft}
        >
          Edit your message plan
        </Button>
      )}

      <MessageLibrary />

      {stage === "ready" && <GoLiveCta variant="default" />}
    </div>
  );
}
```

**Important notes for the implementer:**
- This is a client component (`"use client"`) because it uses `useDashboard()` context.
- `ArrowLeft` icon — verify it exists in `@untitledui/icons`. Common alternatives: `ArrowNarrowLeft`, `ChevronLeft`.
- The Go Live CTA at the bottom only shows at stage `ready` (per PRD Section 11: "Go Live CTA appears on Messages tab as well").
- Canon message IDs are not yet passed — Task 4 handles the context expansion for post-registration canon messages. For now, `MessageLibrary` works without them (defaults to empty array).

**Step 2: Commit**

```bash
git add src/app/dashboard/messages/page.tsx
git commit -m "feat: messages tab page with library and contextual navigation"
```

---

### Task 4: Add canon message IDs to dashboard context (post-registration support)

**Files:**
- Modify: `src/components/dashboard/dashboard-context.tsx` (add `canonMessageIds` field)
- Modify: `src/app/dashboard/layout.tsx` (fetch `canon_messages` from registration, pass to shell)
- Modify: `src/components/dashboard/dashboard-shell.tsx` (pass through new prop)
- Modify: `src/app/dashboard/messages/page.tsx` (pass `canonMessageIds` to `MessageLibrary`)

**Step 1: Add `canonMessageIds` to DashboardContextValue**

In `src/components/dashboard/dashboard-context.tsx`, add to the interface:

```typescript
// Add to DashboardContextValue interface:
canonMessageIds: string[];
```

Update the `DashboardProvider` props spread and value to include `canonMessageIds`.

**Step 2: Update layout.tsx to fetch canon_messages**

In `src/app/dashboard/layout.tsx`, modify the registration query in `fetchDashboardState()`:

```typescript
// Change this line:
.select("id, status, phone_number")
// To:
.select("id, status, phone_number, canon_messages")
```

Add `canonMessageIds` to the returned `DashboardState`:

```typescript
// Add to DashboardState interface in lifecycle.ts:
canonMessageIds: string[];
```

In the pre-registration return, add `canonMessageIds: []`.
In the post-registration return, add:
```typescript
canonMessageIds: Array.isArray(registration?.canon_messages)
  ? registration.canon_messages.map((m: { template_id: string }) => m.template_id)
  : [],
```

**Step 3: Pass through DashboardShell**

In `dashboard-shell.tsx`, add `canonMessageIds` to the props passed to `DashboardProvider`.

**Step 4: Update messages page to use canon IDs**

In `messages/page.tsx`, update:

```tsx
const { stage, canonMessageIds } = useDashboard();
// ...
<MessageLibrary canonMessageIds={canonMessageIds} />
```

**Step 5: Commit**

```bash
git add src/components/dashboard/dashboard-context.tsx src/app/dashboard/layout.tsx src/lib/dashboard/lifecycle.ts src/components/dashboard/dashboard-shell.tsx src/app/dashboard/messages/page.tsx
git commit -m "feat: canon message IDs flow through dashboard context for registered messages"
```

---

### Task 5: Build and verify

**Step 1: Run the build**

Run: `npm run build`
Expected: Build succeeds with no type errors.

**Step 2: Fix any issues**

Common issues to watch for:
- Icon imports that don't exist (`Copy06`, `ArrowLeft`, `MessageSquare02`) — check `@untitledui/icons` exports and substitute
- Badge component generic type issues — `BadgeWithDot` and `BadgeWithIcon` require specific `type` prop values
- `canon_messages` column may not exist in the registrations table yet — if the build fails on the Supabase query, the `maybeSingle()` will return null and the fallback handles it gracefully

**Step 3: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve build issues in messages tab"
```

---

### Task 6: Update Compliance tab minStage

**Files:**
- Modify: `src/components/dashboard/tab-nav.tsx`

**Step 1: Change Compliance tab visibility**

The Compliance tab (Task 12) needs to be visible earlier for the explanatory sandbox card. Change `minStage` from `"live"` to `"use_case_selected"`:

```typescript
// In TABS array, change:
{ label: "Compliance", href: "/dashboard/compliance", minStage: "live" },
// To:
{ label: "Compliance", href: "/dashboard/compliance", minStage: "use_case_selected" },
```

**Step 2: Commit**

```bash
git add src/components/dashboard/tab-nav.tsx
git commit -m "feat: show compliance tab from use_case_selected stage"
```
