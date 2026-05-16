/**
 * MDX element → styled component map for blog post bodies.
 *
 * The marketing site does not use `@tailwindcss/typography`, so prose styling
 * is hand-rolled here against Untitled UI semantic tokens. The styling mirrors
 * the long-form pattern established in `app/privacy/page.tsx`.
 *
 * All components are server-safe (no hooks) — `MDXRemote` renders in an RSC.
 */
import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  ImgHTMLAttributes,
  ReactNode,
} from "react";

function Anchor({ href, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const link = href ?? "#";
  const className =
    "text-text-brand-secondary underline hover:text-text-brand-primary";

  if (link.startsWith("/") || link.startsWith("#")) {
    return (
      <Link href={link} className={className}>
        {children}
      </Link>
    );
  }

  const isExternal = link.startsWith("http://") || link.startsWith("https://");
  return (
    <a
      href={link}
      className={className}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}

/** Code element: rehype-pretty-code tags block code with `data-language`.
 *  Block code passes through (Shiki sets inline span colors); inline code
 *  gets a small pill. */
function Code({
  children,
  ...rest
}: HTMLAttributes<HTMLElement> & { "data-language"?: string }) {
  if ("data-language" in rest) {
    return <code {...rest}>{children}</code>;
  }
  return (
    <code
      className="rounded-sm bg-bg-tertiary px-1.5 py-0.5 font-mono text-[0.875em] text-text-secondary"
      {...rest}
    >
      {children}
    </code>
  );
}

/** Element → component map passed to `<MDXRemote components=...>`. */
export const mdxComponents = {
  h1: ({ children }: { children?: ReactNode }) => (
    <h2 className="mt-12 mb-4 text-2xl font-semibold text-text-primary">
      {children}
    </h2>
  ),
  h2: ({ children }: { children?: ReactNode }) => (
    <h2 className="mt-12 mb-4 border-b border-border-secondary pb-2 text-lg font-semibold text-text-primary">
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: ReactNode }) => (
    <h3 className="mt-8 mb-3 text-base font-semibold text-text-secondary">
      {children}
    </h3>
  ),
  p: ({ children }: { children?: ReactNode }) => (
    <p className="my-4 text-base leading-relaxed text-text-tertiary">{children}</p>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="my-4 list-disc space-y-1.5 pl-5 text-base text-text-tertiary">
      {children}
    </ul>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className="my-4 list-decimal space-y-1.5 pl-5 text-base text-text-tertiary">
      {children}
    </ol>
  ),
  li: ({ children }: { children?: ReactNode }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  a: Anchor,
  strong: ({ children }: { children?: ReactNode }) => (
    <strong className="font-semibold text-text-secondary">{children}</strong>
  ),
  em: ({ children }: { children?: ReactNode }) => (
    <em className="italic">{children}</em>
  ),
  blockquote: ({ children }: { children?: ReactNode }) => (
    <blockquote className="my-6 border-l-2 border-border-brand pl-4 text-base italic text-text-tertiary">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-10 border-border-secondary" />,
  code: Code,
  pre: ({ children, ...rest }: HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="my-6 overflow-x-auto rounded-xl bg-bg-code-surface px-5 py-4 text-sm leading-relaxed"
      {...rest}
    >
      {children}
    </pre>
  ),
  figure: ({ children, ...rest }: HTMLAttributes<HTMLElement>) => (
    <figure className="my-6" {...rest}>
      {children}
    </figure>
  ),
  table: ({ children }: { children?: ReactNode }) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }: { children?: ReactNode }) => <thead>{children}</thead>,
  tbody: ({ children }: { children?: ReactNode }) => (
    <tbody className="divide-y divide-border-secondary">{children}</tbody>
  ),
  tr: ({ children }: { children?: ReactNode }) => (
    <tr className="border-b border-border-secondary">{children}</tr>
  ),
  th: ({ children }: { children?: ReactNode }) => (
    <th className="py-2 pr-4 text-left font-semibold text-text-secondary">
      {children}
    </th>
  ),
  td: ({ children }: { children?: ReactNode }) => (
    <td className="py-3 pr-4 align-top text-text-tertiary">{children}</td>
  ),
  // Plain <img>: next/image needs known dimensions; blog body images are
  // author-supplied at unknown sizes. No next/next ESLint plugin is active here.
  img: ({ src, alt }: ImgHTMLAttributes<HTMLImageElement>) => (
    <img
      src={typeof src === "string" ? src : undefined}
      alt={alt ?? ""}
      className="my-6 rounded-xl"
      loading="lazy"
    />
  ),
};
