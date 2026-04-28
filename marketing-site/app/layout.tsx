import type { Metadata } from "next";
import { TopNav } from "@/components/top-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "RelayKit",
  description: "Add SMS to your app in minutes, not months.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <TopNav />
        <main className="pt-14">{children}</main>
      </body>
    </html>
  );
}
