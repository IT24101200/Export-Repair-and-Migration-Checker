import type { MetadataRoute } from "next";

const baseUrl = "https://export-repair-and-migration-checker.onrender.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account", "/api/", "/dashboard", "/login"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
