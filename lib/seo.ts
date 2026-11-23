import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

type PageSeo = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
};

const DEFAULT_IMAGE = "/brand/logo-on-dark.png";

export function absoluteUrl(path = "/") {
  if (!path || path === "/") return siteConfig.url;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalized}`;
}

function brandedTitle(title: string) {
  return title.includes(siteConfig.name)
    ? title
    : `${title} | ${siteConfig.name}`;
}

export function createMetadata({
  title,
  description,
  path = "/",
  image = DEFAULT_IMAGE,
  type = "website",
  publishedTime,
}: PageSeo): Metadata {
  const canonical = path && path !== "/" ? (path.startsWith("/") ? path : `/${path}`) : "/";
  const fullTitle = brandedTitle(title);
  const ogImage =
    image === DEFAULT_IMAGE
      ? [{ url: image, width: 1024, height: 1024, alt: fullTitle }]
      : [{ url: image, alt: fullTitle }];

  return {
    title: title.includes(siteConfig.name) ? { absolute: fullTitle } : title,
    description,
    alternates: {
      canonical,
      languages: { "ar-SA": canonical },
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: ogImage,
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

function profileLinks() {
  return [
    siteConfig.social.linkedin,
    siteConfig.social.x,
    siteConfig.social.instagram,
  ].filter((url) => {
    try {
      const path = new URL(url).pathname.replace(/\/+$/, "");
      return path.length > 1;
    } catch {
      return false;
    }
  });
}

export function personJsonLd() {
  const sameAs = profileLinks();

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.url}/#person`,
    name: siteConfig.name,
    alternateName: siteConfig.nameEn,
    url: siteConfig.url,
    jobTitle: "مهندس حاسب ومصمم مواقع",
    description: siteConfig.description,
    image: absoluteUrl("/brand/wael.jpg"),
    knowsAbout: ["تصميم المواقع", "تطوير المواقع", "صفحات الهبوط"],
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function businessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteConfig.url}/#business`,
    name: siteConfig.name,
    url: siteConfig.url,
    image: absoluteUrl("/brand/wael.jpg"),
    logo: absoluteUrl(DEFAULT_IMAGE),
    description: siteConfig.description,
    telephone: `+${siteConfig.phone}`,
    founder: { "@id": `${siteConfig.url}/#person` },
    areaServed: { "@type": "Country", name: "Saudi Arabia" },
    availableLanguage: "Arabic",
    serviceType: ["تصميم مواقع تعريفية", "صفحات هبوط", "إعادة تصميم المواقع"],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "ar",
    publisher: { "@id": `${siteConfig.url}/#person` },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleJsonLd(post: {
  title: string;
  description: string;
  slug: string;
  date: string;
}) {
  const url = absoluteUrl(`/blog/${post.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "ar",
    mainEntityOfPage: url,
    url,
    image: absoluteUrl(DEFAULT_IMAGE),
    author: { "@id": `${siteConfig.url}/#person` },
    publisher: { "@id": `${siteConfig.url}/#person` },
  };
}

export function serviceJsonLd(service: {
  slug: string;
  title: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: { "@id": `${siteConfig.url}/#business` },
    areaServed: "SA",
  };
}

export function projectJsonLd(project: {
  slug: string;
  name: string;
  summary: string;
  image: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: project.summary,
    url: absoluteUrl(`/portfolio/${project.slug}`),
    image: absoluteUrl(project.image),
    creator: { "@id": `${siteConfig.url}/#person` },
  };
}
