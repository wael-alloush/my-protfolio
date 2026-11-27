import type { Metadata } from "next";
import { activeSocialLinks, siteConfig, type SiteConfig } from "@/lib/site";

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

/** العنوان كما يظهر في نتائج البحث: يُلحق به اسم الموقع ما لم يتضمنه. */
export function brandedTitle(title: string) {
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

function profileLinks(site: SiteConfig) {
  return activeSocialLinks(site).map((item) => item.href);
}

export function personJsonLd(site: SiteConfig = siteConfig) {
  const sameAs = profileLinks(site);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${site.url}/#person`,
    name: site.name,
    alternateName: site.nameEn,
    url: site.url,
    jobTitle: "مهندس حاسب ومصمم مواقع",
    description: site.description,
    image: absoluteUrl("/brand/wael.jpg"),
    knowsAbout: ["تصميم المواقع", "تطوير المواقع", "صفحات الهبوط"],
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function businessJsonLd(site: SiteConfig = siteConfig) {
  const sameAs = profileLinks(site);

  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${site.url}/#business`,
    name: site.brand,
    alternateName: [site.name, site.nameEn],
    url: site.url,
    image: absoluteUrl("/brand/wael.jpg"),
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(DEFAULT_IMAGE),
    },
    description: site.description,
    email: site.email,
    telephone: `+${site.phone}`,
    founder: { "@id": `${site.url}/#person` },
    address: {
      "@type": "PostalAddress",
      addressCountry: "SA",
      addressLocality: "الرياض",
    },
    areaServed: [
      { "@type": "City", name: "الرياض" },
      { "@type": "City", name: "جدة" },
      { "@type": "City", name: "الدمام" },
    ],
    availableLanguage: ["Arabic", "ar"],
    serviceType: ["تصميم مواقع تعريفية", "صفحات هبوط", "إعادة تصميم المواقع"],
    sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: `+${site.phone}`,
      email: site.email,
      url: absoluteUrl("/contact"),
      availableLanguage: ["Arabic", "ar"],
    },
  };
}

export function websiteJsonLd(site: SiteConfig = siteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: "ar",
    publisher: { "@id": `${site.url}/#business` },
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
  updatedAt?: string | null;
}) {
  const url = absoluteUrl(`/blog/${post.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updatedAt ?? post.date,
    inLanguage: "ar",
    mainEntityOfPage: url,
    url,
    image: absoluteUrl(DEFAULT_IMAGE),
    author: { "@id": `${siteConfig.url}/#person` },
    publisher: { "@id": `${siteConfig.url}/#business` },
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
