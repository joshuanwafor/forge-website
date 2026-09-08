import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags, getPostsByTag } from "@/lib/blog";
import { site } from "@/lib/site";

/**
 * `lastModified` is only set where a real modification date exists.
 *
 * Stamping every entry with the build time — which is what this did before —
 * tells crawlers the whole site changed on every deploy. Google's guidance is
 * that it ignores lastmod entirely once it stops matching reality, so an
 * inaccurate date is worse than none: it costs the signal for the pages where
 * the date genuinely is meaningful, namely the posts.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const dateOf = (post: (typeof posts)[number]) =>
    new Date(post.updated ?? post.date);

  /** Newest post overall — stands in for the blog index's freshness. */
  const newestPost = posts.length ? dateOf(posts[0]) : undefined;

  const marketingRoutes: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/tour`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/waitlist`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const blogIndex: MetadataRoute.Sitemap = [
    {
      url: `${site.url}/blog`,
      lastModified: newestPost,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${site.url}/blog/${post.slug}`,
    lastModified: dateOf(post),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  // A topic page changes when a post carrying that tag does.
  const tagRoutes: MetadataRoute.Sitemap = getAllTags().map((tag) => {
    const tagged = getPostsByTag(tag.slug);
    const newest = tagged.length
      ? new Date(Math.max(...tagged.map((p) => +dateOf(p))))
      : undefined;

    return {
      url: `${site.url}/blog/tag/${tag.slug}`,
      lastModified: newest,
      changeFrequency: "monthly",
      priority: 0.4,
    };
  });

  return [...marketingRoutes, ...blogIndex, ...postRoutes, ...tagRoutes];
}
