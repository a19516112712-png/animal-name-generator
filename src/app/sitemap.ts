import { MetadataRoute } from "next";
import { loadIndex, getAllNameTypeSlugs } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://animalnamegen.com";
  const animals = loadIndex();
  const nameTypeSlugs = getAllNameTypeSlugs();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/animals/`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  const animalPages: MetadataRoute.Sitemap = animals.map((a) => ({
    url: `${baseUrl}/animal/${a.slug}/`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const namePages: MetadataRoute.Sitemap = nameTypeSlugs.map((s) => ({
    url: `${baseUrl}/${s}/`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...animalPages, ...namePages];
}
