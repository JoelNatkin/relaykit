import type { Metadata } from "next";
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
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
