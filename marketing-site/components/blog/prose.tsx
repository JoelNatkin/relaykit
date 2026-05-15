/** Reading-width column for long-form post content (~68ch ≈ the 65–72ch
 *  target). Wraps both the post header and the rendered MDX body. */
import type { ReactNode } from "react";

export function Prose({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-[68ch]">{children}</div>;
}
