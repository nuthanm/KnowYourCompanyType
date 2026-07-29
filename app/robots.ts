import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-meta";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl("https://knowyourithub.com");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/prototype", "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
