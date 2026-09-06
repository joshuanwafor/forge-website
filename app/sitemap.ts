import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/blog";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/tour`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/waitlist`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const posts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${site.url}/blog/${post.slug}`,
    lastModified: new Date(post.updated ?? post.date),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  const tags: MetadataRoute.Sitemap = getAllTags().map((tag) => ({
    url: `${site.url}/blog/tag/${tag.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [...staticRoutes, ...posts, ...tags];
}
