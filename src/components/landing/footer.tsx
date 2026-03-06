const LINKS = {
  Product: [
    { label: "How it works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Contact", href: "mailto:hello@relaykit.com" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Acceptable Use Policy", href: "/acceptable-use-policy" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-secondary bg-primary px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div>
            <p className="text-md font-semibold text-primary">RelayKit</p>
          </div>
          <div className="grid grid-cols-3 gap-8">
            {Object.entries(LINKS).map(([category, links]) => (
              <div key={category}>
                <p className="text-sm font-semibold text-quaternary">
                  {category}
                </p>
                <ul className="mt-3 space-y-2">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-tertiary transition duration-100 ease-linear hover:text-secondary"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 border-t border-secondary pt-6">
          <p className="text-sm text-quaternary">
            © 2026 RelayKit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
