/**
 * Site-level constants for the blog. RSS, sitemap, canonical links, and
 * JSON-LD all need an absolute origin; `SITE_URL` is the single place it
 * is resolved.
 *
 * `NEXT_PUBLIC_SITE_URL` must be set in Vercel (Preview + Production) — the
 * hardcoded fallback keeps local and CI builds deterministic when it is not.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://relaykit.ai"
).replace(/\/$/, "");

export const BLOG_TITLE = "RelayKit Blog";

export const BLOG_DESCRIPTION =
  "Building with text messages is way too complicated. This is where we work it out.";

/** Single-author blog. Used for bylines and JSON-LD `author`. */
export const BLOG_AUTHOR = "Joel Natkin";

/** Static brand-default OG image; the fallback when a post has no `og_image`. */
export const DEFAULT_OG_IMAGE = "/blog-og-default.png";

/** Absolute URL for a path on the site. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
