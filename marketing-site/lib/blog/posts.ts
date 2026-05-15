/**
 * Blog post loader. Reads `content/posts/*.mdx` from disk, parses + validates
 * frontmatter, and computes reading time. Server-only — never bundled to the
 * client.
 *
 * Validation is strict by design: a malformed post throws here, which fails
 * `next build` rather than shipping a broken page. `getAllPosts()` returns
 * published posts only; drafts and ready-but-unpublished posts are invisible
 * across the index, cluster pages, sitemap, and RSS in V1.
 */
import "server-only";

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import readingTime from "reading-time";
import { getCluster, LANES } from "./clusters";
import type {
  ClusterSlug,
  Lane,
  Post,
  PostFrontmatter,
  PostStatus,
} from "./types";

const POSTS_DIR = join(process.cwd(), "content", "posts");

const STATUSES: readonly PostStatus[] = ["draft", "ready", "published"];

/** Coerce a frontmatter date value to a `YYYY-MM-DD` string.
 *  YAML parses unquoted dates into `Date` objects, so both forms are handled. */
function asDateString(value: unknown, file: string): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10);
  }
  throw new Error(
    `[blog] ${file}: "date" must be an ISO date (YYYY-MM-DD); got ${JSON.stringify(value)}`,
  );
}

function requireString(value: unknown, field: string, file: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`[blog] ${file}: "${field}" is required and must be a non-empty string`);
  }
  return value;
}

/** Validate a raw frontmatter object into a typed `PostFrontmatter`. */
function validateFrontmatter(
  raw: Record<string, unknown>,
  file: string,
): PostFrontmatter {
  const cluster = requireString(raw.cluster, "cluster", file);
  if (!getCluster(cluster)) {
    throw new Error(`[blog] ${file}: unknown cluster "${cluster}"`);
  }

  const lane = requireString(raw.lane, "lane", file);
  if (!(lane in LANES)) {
    throw new Error(
      `[blog] ${file}: unknown lane "${lane}" (expected one of ${Object.keys(LANES).join(", ")})`,
    );
  }

  const status = requireString(raw.status, "status", file);
  if (!STATUSES.includes(status as PostStatus)) {
    throw new Error(
      `[blog] ${file}: unknown status "${status}" (expected one of ${STATUSES.join(", ")})`,
    );
  }

  const frontmatter: PostFrontmatter = {
    title: requireString(raw.title, "title", file),
    slug: requireString(raw.slug, "slug", file),
    date: asDateString(raw.date, file),
    cluster: cluster as ClusterSlug,
    lane: lane as Lane,
    status: status as PostStatus,
    description: requireString(raw.description, "description", file),
  };

  if (raw.canonical_url !== undefined) {
    frontmatter.canonical_url = requireString(raw.canonical_url, "canonical_url", file);
  }
  if (raw.og_image !== undefined) {
    frontmatter.og_image = requireString(raw.og_image, "og_image", file);
  }

  return frontmatter;
}

/** Read, parse, and validate every MDX file in `content/posts/`.
 *  Memoized per request via `React.cache` so disk I/O happens once. */
const loadAllPosts = cache((): Post[] => {
  const files = readdirSync(POSTS_DIR).filter((name) => name.endsWith(".mdx"));
  const seenSlugs = new Map<string, string>();

  const posts = files.map((file): Post => {
    const fileStem = file.replace(/\.mdx$/, "");
    const raw = readFileSync(join(POSTS_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const frontmatter = validateFrontmatter(data as Record<string, unknown>, file);

    if (frontmatter.slug !== fileStem) {
      throw new Error(
        `[blog] ${file}: frontmatter slug "${frontmatter.slug}" must match the filename stem "${fileStem}"`,
      );
    }
    const collision = seenSlugs.get(frontmatter.slug);
    if (collision) {
      throw new Error(
        `[blog] duplicate slug "${frontmatter.slug}" in ${file} and ${collision}`,
      );
    }
    seenSlugs.set(frontmatter.slug, file);

    return {
      frontmatter,
      slug: frontmatter.slug,
      content,
      readingTimeMinutes: Math.max(1, Math.ceil(readingTime(content).minutes)),
    };
  });

  return posts.sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date));
});

/** Every post regardless of status, newest first. For future preview tooling. */
export function getAllPostsIncludingDrafts(): Post[] {
  return loadAllPosts();
}

/** Published posts only, newest first. The default feed for all V1 surfaces. */
export function getAllPosts(): Post[] {
  return loadAllPosts().filter((post) => post.frontmatter.status === "published");
}

/** A single published post by slug, or `undefined` if not found / not published. */
export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

/** Published posts in a cluster, newest first. */
export function getPostsByCluster(cluster: ClusterSlug): Post[] {
  return getAllPosts().filter((post) => post.frontmatter.cluster === cluster);
}
