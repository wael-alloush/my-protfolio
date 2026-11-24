import { absoluteUrl } from "@/lib/seo";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin"],
      other: {
        "Content-Signal": "search=yes, ai-train=no",
      },
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
