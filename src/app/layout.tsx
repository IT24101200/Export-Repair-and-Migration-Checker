import type { Metadata } from "next";
import "./globals.css";
import PublicHeader from "@/components/layout/PublicHeader";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Export Repair and Migration Checker — Fix Broken Notion Export Links",
  description: "Check your Notion Markdown/CSV export, review broken references, approve supported repairs, and download a clean copy entirely on your device.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased" suppressHydrationWarning>
        <PublicHeader />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
