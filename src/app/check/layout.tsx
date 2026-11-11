import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check a Notion Markdown Export for Broken Links",
  description:
    "Check a Notion Markdown and CSV ZIP for broken relative links, missing image references, and path issues. Review repair suggestions locally in your browser.",
  alternates: {
    canonical: "/check",
  },
};

export default function CheckLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
