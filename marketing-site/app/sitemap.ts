import type { MetadataRoute } from "next";
import { clusterSlugs } from "@/lib/blog/clusters";
import { getAllPosts } from "@/lib/blog/posts";
import { absoluteUrl } from "@/lib/blog/site";
import { categorySlugs } from "@/lib/landing/categories";
import { subVerticalSlugs } from "@/lib/landing/sub-verticals";

/** Stable marketing routes that always belong in the sitemap. */
const STATIC_ROUTES = ["/", "/privacy", "/terms", "/acceptable-use", "/blog"];

/** Message-category landing pages — one per registry entry (extends D-436). */
const CATEGORY_ROUTES = categorySlugs().map((slug) => `/messages/${slug}`);

/** Sub-vertical landing pages — one per registry entry (Phase 1C A2). */
const SUB_VERTICAL_ROUTES = subVerticalSlugs().map((slug) => `/for/${slug}`);

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    ...STATIC_ROUTES,
    ...CATEGORY_ROUTES,
    ...SUB_VERTICAL_ROUTES,
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
