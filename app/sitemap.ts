import type { MetadataRoute } from "next";
import { categories, tools } from "@/content/tools/registry";
import { getPolicySlugs } from "@/content/policies";
import { getSiteUrl } from "@/lib/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const lastModified = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/browse`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    },
    {
      url: `${base}/about`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    {
      url: `${base}/contact`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = Object.values(categories).map((c) => ({
    url: `${base}${c.path}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const toolPages: MetadataRoute.Sitemap = tools.map((t) => ({
    url: `${base}/tools/${t.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const policyPages: MetadataRoute.Sitemap = getPolicySlugs().map((slug) => ({
    url: `${base}/p/${slug}`,
    lastModified,
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));

  return [...staticPages, ...categoryPages, ...toolPages, ...policyPages];
}
