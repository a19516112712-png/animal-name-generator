import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: [
      "https://bestanimalnames.com/sitemap-index.xml",
      "https://bestanimalnames.com/sitemap-core.xml",
      "https://bestanimalnames.com/sitemap.xml",
    ],
  };
}
