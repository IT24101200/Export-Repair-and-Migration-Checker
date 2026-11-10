import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check and Repair a Notion Export | Online Tool",
  description:
    "Scan a Notion Markdown and CSV ZIP for broken relative links, missing image references, and path issues. Review suggested repairs locally in your browser.",
  alternates: {
    canonical: "/check",
  },
};

export default function CheckLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
