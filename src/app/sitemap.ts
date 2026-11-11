import type { MetadataRoute } from "next";

const baseUrl = "https://export-repair-and-migration-checker.onrender.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: Array<{
    path: string;
    changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
    priority: number;
  }> = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/check", changeFrequency: "monthly", priority: 0.9 },
    { path: "/guides", changeFrequency: "weekly", priority: 0.8 },
    { path: "/guides/notion-export", changeFrequency: "monthly", priority: 0.7 },
    {
      path: "/guides/repair-notion-markdown-export",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      path: "/guides/check-notion-export-before-moving",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      path: "/guides/notion-export-broken-links",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      path: "/guides/notion-export-long-paths",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      path: "/guides/notion-export-missing-images",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      path: "/guides/understanding-results",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      path: "/guides/troubleshoot-notion-export-problems",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    { path: "/help", changeFrequency: "monthly", priority: 0.6 },
    { path: "/changelog", changeFrequency: "weekly", priority: 0.5 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  ];

  return routes.map(({ path, ...entry }) => ({
    url: `${baseUrl}${path}`,
    ...entry,
  }));
}
