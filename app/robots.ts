import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Form endpoints only — nothing to index, and no reason to crawl them.
      disallow: ["/api/", "/og-card-source"],
    },
    sitemap: `${site.url}/sitemap.xml`,
    // No `host`: it is a Yandex-only extension that every other crawler
    // ignores, and a stale value there is another way to point at the wrong
    // domain. Canonical tags already state the preferred host.
  };
}
