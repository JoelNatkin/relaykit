import type { MetadataRoute } from "next";
import { clusterSlugs } from "@/lib/blog/clusters";
import { getAllPosts } from "@/lib/blog/posts";
import { absoluteUrl } from "@/lib/blog/site";
import { categorySlugs } from "@/lib/landing/categories";

/** Stable marketing routes that always belong in the sitemap. */
const STATIC_ROUTES = ["/", "/privacy", "/terms", "/acceptable-use", "/blog"];

// The deferred /for/developer-tools page is intentionally NOT listed — it's a
// noindex near-twin of /messages/account-events (reachable, but out of search
// and the sitemap until the /for/{slug} program ships).

/** Message-category landing pages — one per registry entry (extends D-436). */
const CATEGORY_ROUTES = categorySlugs().map((slug) => `/messages/${slug}`);

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    ...STATIC_ROUTES,
    ...CATEGORY_ROUTES,
  ].map((route) => ({
    url: absoluteUrl(route),
    lastModified: now,
  }));

  const clusterEntries: MetadataRoute.Sitemap = clusterSlugs().map((slug) => ({
    url: absoluteUrl(`/blog/cluster/${slug}`),
    lastModified: now,
  }));

  const postEntries: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(`${post.frontmatter.date}T00:00:00Z`),
  }));

  return [...staticEntries, ...clusterEntries, ...postEntries];
}
