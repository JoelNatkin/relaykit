import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border-secondary">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-text-primary">RelayKit</p>
            <div className="mt-3 flex flex-col gap-1 text-sm text-text-tertiary">
              <p>Vaulted Press LLC (d/b/a RelayKit)</p>
              <p>5196 Celtic Dr</p>
              <p>North Charleston, SC 29405</p>
              <p className="mt-2">
                <a
                  href="mailto:support@relaykit.ai"
                  className="transition duration-100 ease-linear hover:text-text-secondary"
                >
                  support@relaykit.ai
                </a>
              </p>
            </div>
          </div>
          <div className="sm:text-right">
            <p className="text-sm font-semibold text-text-primary">Legal</p>
            <ul className="mt-3 flex flex-col gap-2">
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-text-tertiary transition duration-100 ease-linear hover:text-text-secondary"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-text-tertiary transition duration-100 ease-linear hover:text-text-secondary"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/acceptable-use"
                  className="text-sm text-text-tertiary transition duration-100 ease-linear hover:text-text-secondary"
                >
                  Acceptable Use
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border-tertiary pt-6">
          <p className="text-xs text-text-quaternary">&copy; 2026 RelayKit LLC</p>
        </div>
      </div>
    </footer>
  );
}
