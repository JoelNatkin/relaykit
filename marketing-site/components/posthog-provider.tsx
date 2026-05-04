"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PostHogProviderUpstream } from "posthog-js/react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    if (!token || !host) return;
    if (posthog.__loaded) return;
    posthog.init(token, {
      api_host: host,
      capture_pageview: false,
      capture_pageleave: true,
    });
  }, []);

  return <PostHogProviderUpstream client={posthog}>{children}</PostHogProviderUpstream>;
}
