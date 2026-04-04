import type { Metadata } from "next";
import { SessionProvider } from "@/context/session-context";
import { TopNav } from "@/components/top-nav";
import { ProtoNavHelper } from "@/components/proto-nav-helper";
import "./globals.css";

export const metadata: Metadata = {
  title: "RelayKit Prototype",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <SessionProvider>
          <TopNav />
          <main className="pt-14">{children}</main>
          <ProtoNavHelper />
        </SessionProvider>
      </body>
    </html>
  );
}
