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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
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
