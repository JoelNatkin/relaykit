"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/session-context";

/**
 * Auth-aware redirect at the prototype root.
 *
 * The prototype models `app.relaykit.ai` — no marketing surface lives
 * here. Marketing-shaped content (the old home page + /sms/[category])
 * was archived under prototype/archive/ when this redirect landed.
 * Logged-in users go straight to /apps; logged-out users land on the
 * placeholder /sign-in route until the auth refactor (future workstream)
 * replaces it.
 */
export default function RootRedirect() {
  const router = useRouter();
  const { state } = useSession();

  useEffect(() => {
    router.replace(state.isLoggedIn ? "/apps" : "/sign-in");
  }, [router, state.isLoggedIn]);

  return null;
}
