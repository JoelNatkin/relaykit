import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { PostHogProvider } from "@/components/posthog-provider";
import { SuspendedPostHogPageView } from "@/components/posthog-pageview";
import { TopNav } from "@/components/top-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "RelayKit",
  description: "Add SMS to your app in minutes, not months.",
};

// Runs synchronously in <head> before React hydrates so the page paints
// in the correct theme on first frame. Reads localStorage first (user
// override), falls back to prefers-color-scheme, applies the .dark
// class + color-scheme to <html>. The IIFE is wrapped in try/catch
// because localStorage can throw under strict privacy modes.
const themeInitScript = `(function(){try{var s=localStorage.getItem('relaykit-theme');var d=s==='dark'||(!s&&window.matchMedia('(prefers-color-scheme: dark)').matches);var e=document.documentElement;if(d){e.classList.add('dark');e.style.colorScheme='dark';}else{e.style.colorScheme='light';}}catch(_){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="bg-bg-primary font-sans antialiased">
        <PostHogProvider>
          <SuspendedPostHogPageView />
          <TopNav />
          <main className="pt-14">{children}</main>
          <Footer />
        </PostHogProvider>
      </body>
    </html>
  );
}
