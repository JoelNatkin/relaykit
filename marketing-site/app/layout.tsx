import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { PostHogProvider } from "@/components/posthog-provider";
import { SuspendedPostHogPageView } from "@/components/posthog-pageview";
import { TopNav } from "@/components/top-nav";
import { WaitlistModal } from "@/components/waitlist-modal";
import { WaitlistProvider } from "@/context/waitlist-context";
import { SITE_URL } from "@/lib/blog/site";
import "./globals.css";

export const metadata: Metadata = {
  // Resolves relative OG/Twitter/canonical URLs (set per page) to absolute.
  metadataBase: new URL(SITE_URL),
  title: "RelayKit",
  description: "Add SMS to your app in minutes, not months.",
};

// Runs synchronously in <head> before React hydrates so the page paints
// in the correct theme on first frame. Reads localStorage first (user
// override). Dark is the site-wide default: anything other than an explicit
// stored 'light' resolves to dark (no stored preference -> dark; we no longer
// follow prefers-color-scheme). Applies the .dark class + color-scheme to
// <html>. The IIFE is wrapped in try/catch because localStorage can throw
// under strict privacy modes.
const themeInitScript = `(function(){var d=true;try{if(localStorage.getItem('relaykit-theme')==='light')d=false;}catch(_){}var e=document.documentElement;if(d){e.classList.add('dark');e.style.colorScheme='dark';}else{e.style.colorScheme='light';}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="bg-bg-primary font-sans antialiased">
        <PostHogProvider>
          <SuspendedPostHogPageView />
          <WaitlistProvider>
            <TopNav />
            <main className="pt-14">{children}</main>
            <Footer />
            <WaitlistModal />
          </WaitlistProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
