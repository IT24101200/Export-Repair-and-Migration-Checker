import type { MetadataRoute } from "next";

const baseUrl = "https://export-repair-and-migration-checker.onrender.com";

export default function robots(): MetadataRoute.Robots {
  const publicAccessRule = {
    allow: "/",
    disallow: ["/account", "/api/", "/dashboard", "/login"],
  };

  return {
    rules: [
      { userAgent: "Googlebot", ...publicAccessRule },
      { userAgent: "Google-InspectionTool", ...publicAccessRule },
      { userAgent: "*", ...publicAccessRule },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
