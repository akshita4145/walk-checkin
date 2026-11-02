import type { MetadataRoute } from "next";

// Demo only: ask crawlers to stay away from every page.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
