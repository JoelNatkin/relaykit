/**
 * Renders an MDX post body as a React Server Component.
 *
 * Centralizes the remark/rehype pipeline so every post is processed
 * identically: GFM tables, smart-quote typography, and Shiki syntax
 * highlighting (build-time — zero client JS).
 */
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode, { type Options as RehypePrettyCodeOptions } from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";
import { mdxComponents } from "@/lib/blog/mdx-components";

const prettyCodeOptions: RehypePrettyCodeOptions = {
  // Single dark theme: the code surface (`bg-bg-code-surface`) is gray-950 in
  // both light and dark mode, so code blocks are always dark.
  theme: "github-dark",
  // Drop Shiki's own background — the `pre` component applies the brand token.
  keepBackground: false,
};

export function MdxContent({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={mdxComponents}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkSmartypants],
          rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
        },
      }}
    />
  );
}
