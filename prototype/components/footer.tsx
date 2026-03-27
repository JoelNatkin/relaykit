import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border-secondary">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-text-primary">Product</p>
            <ul className="mt-3 flex flex-col gap-2">
              <li><Link href="/#how-it-works" className="text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear">How it works</Link></li>
              <li><Link href="/#categories" className="text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear">Use cases</Link></li>
              <li><Link href="/compliance" className="text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear">Compliance</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">Legal</p>
            <ul className="mt-3 flex flex-col gap-2">
              <li><Link href="#" className="text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear">Terms</Link></li>
              <li><Link href="#" className="text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear">Privacy</Link></li>
              <li><Link href="#" className="text-sm text-text-tertiary hover:text-text-secondary transition duration-100 ease-linear">Acceptable Use</Link></li>
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
