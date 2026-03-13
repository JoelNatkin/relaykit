"use client";

import { useParams } from "next/navigation";

export default function PublicMessagesPage() {
  const params = useParams<{ category: string }>();

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
      <p className="text-text-tertiary text-sm">
        Public messages page for {params.category} — reuses existing catalog component (Task 4/5)
      </p>
    </div>
  );
}
