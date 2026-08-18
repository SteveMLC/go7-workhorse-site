import type { MetadataRoute } from "next";
import { PAGES } from "@/lib/pages";
import { SITE_ORIGIN } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_ORIGIN, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_ORIGIN}${PAGES.download.path}`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_ORIGIN}${PAGES.features.path}`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_ORIGIN}${PAGES.docs.path}`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_ORIGIN}/llms.txt`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_ORIGIN}/llms-full.txt`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
  ];
}
