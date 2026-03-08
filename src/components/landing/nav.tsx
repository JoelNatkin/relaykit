import { Button } from "@/components/base/buttons/button";

export function Nav() {
  return (
    <nav className="border-b border-secondary bg-primary">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a href="/" className="text-lg font-semibold text-primary">
          RelayKit
        </a>
        <div className="flex items-center gap-3">
          <Button href="/login" color="link-gray" size="sm">
            Log in
          </Button>
          <Button href="/login" color="primary" size="sm">
            Start building free &rarr;
          </Button>
        </div>
      </div>
    </nav>
  );
}
