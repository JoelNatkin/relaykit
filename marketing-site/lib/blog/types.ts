/**
 * Shared type definitions for the blog. Single source of truth for post shapes.
 * The cluster/lane/status unions are validated against real data at load time
 * in `posts.ts` — a frontmatter value outside these unions fails `next build`.
 */

/** Narrative posture of a post within its cluster (POST_TOPICS.md §4). */
export type Lane = "demand" | "supply" | "retrospective" | "worldview";

/** Editorial workflow state. Only `published` posts render in V1. */
export type PostStatus = "draft" | "ready" | "published";

/** The 11 content clusters, ordered by strategic priority (POST_TOPICS.md §4). */
export type ClusterSlug =
  | "dormant-assumption"
  | "verification-otp"
  | "compliance-registration"
  | "cost-pricing"
  | "ai-coding-tools"
  | "integration-code"
  | "consent-legal"
  | "live-fire-ops"
  | "vertical-patterns"
  | "retrospective"
  | "worldview";

/** Frontmatter block at the top of every `content/posts/*.mdx` file. */
export interface PostFrontmatter {
  /** Display title. Required. */
  title: string;
  /** URL slug. Required. Must equal the MDX filename stem. */
  slug: string;
  /** ISO 8601 date, e.g. "2026-06-03". Required. Primary sort key. */
  date: string;
  /** One of the 11 clusters. Required. */
  cluster: ClusterSlug;
  /** One of the 4 lanes. Required. */
  lane: Lane;
  /** Workflow state. Required. Gates index/sitemap/RSS inclusion. */
  status: PostStatus;
  /** Meta description, RSS summary, and card blurb. Required. */
  description: string;
  /** If set, `rel=canonical` points here (mirrored-from-elsewhere case). */
  canonical_url?: string;
  /** Path or absolute URL to the post's OG image. Falls back to the brand default. */
  og_image?: string;
}

/** A fully loaded post: validated frontmatter plus derived fields. */
export interface Post {
  frontmatter: PostFrontmatter;
  /** Resolved slug (filename stem; equals `frontmatter.slug`). */
  slug: string;
  /** Raw MDX body with frontmatter stripped. */
  content: string;
  /** Estimated reading time, rounded up to whole minutes. */
  readingTimeMinutes: number;
}
