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
      "For founders who wrote SMS off years ago — what has actually changed, and why it is worth a second look.",
  },
  {
    slug: "verification-otp",
    name: "Verification & OTP",
    description:
      "One-time passcodes done right: the universal SMS primitive every indie SaaS eventually needs.",
  },
  {
    slug: "compliance-registration",
    name: "Compliance & Registration",
    description:
      "The 10DLC wall most indie founders hit — brand registration, campaigns, and getting approved fast.",
  },
  {
    slug: "cost-pricing",
    name: "Cost & Pricing",
    description:
      "What SMS actually costs, where the hidden fees hide, and how to budget it honestly.",
  },
  {
    slug: "ai-coding-tools",
    name: "AI Coding Tools",
    description:
      "Wiring SMS into your app with AI coding assistants — integration that holds up without hallucinations.",
  },
  {
    slug: "integration-code",
    name: "Integration & Code",
    description:
      "Hands-on integration guides: SDK setup, code patterns, and the details that trip people up.",
  },
  {
    slug: "consent-legal",
    name: "Consent & Legal",
    description:
      "TCPA liability, opt-in records, and the consent discipline that keeps you out of trouble.",
  },
  {
    slug: "live-fire-ops",
    name: "Live-Fire Ops",
    description:
      "War stories from production SMS — incidents, failures, and what they teach about running it well.",
  },
  {
    slug: "vertical-patterns",
    name: "Vertical Patterns",
    description:
      "Industry-specific SMS playbooks for healthcare, restaurants, tutoring, real estate, and e-commerce.",
  },
  {
    slug: "retrospective",
    name: "Retrospective",
    description:
      "Build-in-public posts on what we are making, what went wrong, and what we learned.",
  },
  {
    slug: "worldview",
    name: "Worldview",
    description:
      "Industry analysis and the bigger picture of where SMS infrastructure is heading.",
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
