/** JSON-LD `BlogPosting` structured data for a post. Hand-built and locally
 *  typed — no `schema-dts` dependency. */
import { absoluteUrl, BLOG_AUTHOR, DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/blog/site";
import type { Post } from "@/lib/blog/types";

interface ArticleJsonLd {
  "@context": "https://schema.org";
  "@type": "BlogPosting";
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  author: { "@type": "Person"; name: string };
  publisher: { "@type": "Organization"; name: string; url: string };
  image: string;
  mainEntityOfPage: { "@type": "WebPage"; "@id": string };
  url: string;
}

/** Resolve a post's OG image to an absolute URL, falling back to the brand default. */
function resolveImage(ogImage: string | undefined): string {
  if (!ogImage) return absoluteUrl(DEFAULT_OG_IMAGE);
  return ogImage.startsWith("http") ? ogImage : absoluteUrl(ogImage);
}

/** Build the JSON-LD object for a post. */
export function buildArticleJsonLd(post: Post): ArticleJsonLd {
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    datePublished: post.frontmatter.date,
    dateModified: post.frontmatter.date,
    author: { "@type": "Person", name: BLOG_AUTHOR },
    publisher: { "@type": "Organization", name: "RelayKit", url: SITE_URL },
    image: resolveImage(post.frontmatter.og_image),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": post.frontmatter.canonical_url ?? url,
    },
    url,
  };
}

export function JsonLd({ data }: { data: ArticleJsonLd }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
