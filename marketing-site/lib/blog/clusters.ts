/**
 * Cluster + lane registries — the single source of truth for taxonomy display.
 * `/blog/cluster/[name]`, the cluster badge, and the lane badge all read from
 * here, so a slug or display name is defined exactly once.
 *
 * The `CLUSTERS` order is the strategic priority order from POST_TOPICS.md §4.
 * The `slug` values must stay in lockstep with the `ClusterSlug` union in
 * `types.ts`; the `satisfies` clause below enforces that at compile time.
 */
import type { ClusterSlug, Lane } from "./types";

export interface Cluster {
  slug: ClusterSlug;
  /** Display name shown in headings and badges. */
  name: string;
  /** One-sentence blurb for the cluster index page and its meta description. */
  description: string;
}

export const CLUSTERS = [
  {
    slug: "dormant-assumption",
    name: "Dormant Assumptions",
    description:
      "For builders who gave up on adding text messages years ago — what's actually changed, and why it's worth another look.",
  },
  {
    slug: "verification-otp",
    name: "Verification & OTP",
    description:
      "The verification codes people type in to log in or confirm their number. Almost every app needs them — here's how to send them well.",
  },
  {
    slug: "compliance-registration",
    name: "Compliance & Registration",
    description:
      "What the phone carriers require before your app can send a single text. We map the bureaucracy so you don't have to — and so it takes days, not weeks.",
  },
  {
    slug: "cost-pricing",
    name: "Cost & Pricing",
    description:
      "What sending text messages actually costs, where the hidden fees hide, and how to budget for it honestly.",
  },
  {
    slug: "ai-coding-tools",
    name: "AI Coding Tools",
    description:
      "Adding text messages to your app with AI coding assistants — and getting an integration that actually holds up.",
  },
  {
    slug: "integration-code",
    name: "Integration & Code",
    description:
      "Hands-on guides for wiring it up: SDK setup, code patterns, and the details that trip people up.",
  },
  {
    slug: "consent-legal",
    name: "Consent & Legal",
    description:
      "Getting permission before you text someone — and keeping the records that keep you out of legal trouble.",
  },
  {
    slug: "live-fire-ops",
    name: "Live-Fire Ops",
    description:
      "War stories from running text messaging in production: the incidents, the failures, and what they teach.",
  },
  {
    slug: "vertical-patterns",
    name: "Vertical Patterns",
    description:
      "Text-messaging playbooks for specific industries — healthcare, restaurants, tutoring, real estate, and e-commerce.",
  },
  {
    slug: "retrospective",
    name: "Retrospective",
    description:
      "Build-in-public posts on what we're making, what went wrong, and what we learned.",
  },
  {
    slug: "worldview",
    name: "Worldview",
    description:
      "The bigger picture — where text messaging is heading, and what it means for the people building on it.",
  },
] as const satisfies readonly Cluster[];

const CLUSTER_BY_SLUG = new Map<string, Cluster>(
  CLUSTERS.map((cluster) => [cluster.slug, cluster]),
);

/** Look up a cluster by slug; `undefined` for an unknown slug. */
export function getCluster(slug: string): Cluster | undefined {
  return CLUSTER_BY_SLUG.get(slug);
}

/** Every cluster slug, in priority order — used by `generateStaticParams`. */
export function clusterSlugs(): ClusterSlug[] {
  return CLUSTERS.map((cluster) => cluster.slug);
}

export interface LaneMeta {
  slug: Lane;
  /** Display label shown in the lane badge. */
  label: string;
  /** Short code used in POST_TOPICS.md ([D]/[S]/[R]/[W]). */
  code: string;
}

export const LANES: Record<Lane, LaneMeta> = {
  demand: { slug: "demand", label: "Demand", code: "[D]" },
  supply: { slug: "supply", label: "Supply", code: "[S]" },
  retrospective: { slug: "retrospective", label: "Retrospective", code: "[R]" },
  worldview: { slug: "worldview", label: "Worldview", code: "[W]" },
};
