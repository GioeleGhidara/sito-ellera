import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_LOCALE,
  DEFAULT_OG_IMAGE,
  DEFAULT_ROBOTS,
  buildPageTitle,
  getSiteUrl,
  toAbsoluteUrl,
} from "@/lib/seo";

type JsonLd = Record<string, unknown> | Array<Record<string, unknown>>;

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  canonicalPath?: string;
  robots?: string;
  noindex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  jsonLd?: object | object[];
  structuredData?: JsonLd;
}

const removeIfPresent = (selector: string) => {
  document.head.querySelector(selector)?.remove();
};

const upsertMeta = (attribute: "name" | "property", key: string, content?: string) => {
  const selector = `meta[${attribute}="${key}"]`;
  const existing = document.head.querySelector<HTMLMetaElement>(selector);

  if (!content) {
    existing?.remove();
    return;
  }

  const meta = existing ?? document.createElement("meta");
  meta.setAttribute(attribute, key);
  meta.setAttribute("content", content);

  if (!existing) {
    document.head.appendChild(meta);
  }
};

const upsertLink = (rel: string, href: string) => {
  const selector = `link[rel="${rel}"]`;
  const existing = document.head.querySelector<HTMLLinkElement>(selector);
  const link = existing ?? document.createElement("link");

  link.setAttribute("rel", rel);
  link.setAttribute("href", href);

  if (!existing) {
    document.head.appendChild(link);
  }
};

const Seo = ({
  title,
  description,
  image,
  imageAlt,
  canonicalPath,
  robots,
  noindex = false,
  type = "website",
  publishedTime,
  modifiedTime,
  section,
  jsonLd,
  structuredData,
}: SeoProps) => {
  const location = useLocation();

  useEffect(() => {
    const siteUrl = getSiteUrl();
    const pageTitle = buildPageTitle(title);
    const pageDescription = description ?? DEFAULT_DESCRIPTION;
    const canonicalUrl = toAbsoluteUrl(canonicalPath ?? location.pathname, siteUrl);
    const imageUrl = toAbsoluteUrl(image ?? DEFAULT_OG_IMAGE, siteUrl);
    const forceNoindex = String(import.meta.env.VITE_SITE_NOINDEX ?? "").toLowerCase() === "true";
    const robotsValue =
      forceNoindex || noindex ? "noindex,nofollow" : robots ?? DEFAULT_ROBOTS;

    document.title = pageTitle;

    upsertLink("canonical", canonicalUrl);

    upsertMeta("name", "description", pageDescription);
    upsertMeta("name", "robots", robotsValue);

    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:site_name", "Ellera");
    upsertMeta("property", "og:locale", DEFAULT_LOCALE);
    upsertMeta("property", "og:title", pageTitle);
    upsertMeta("property", "og:description", pageDescription);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:image", imageUrl);
    upsertMeta("property", "og:image:alt", imageAlt ?? pageTitle);

    upsertMeta("name", "twitter:card", imageUrl ? "summary_large_image" : "summary");
    upsertMeta("name", "twitter:title", pageTitle);
    upsertMeta("name", "twitter:description", pageDescription);
    upsertMeta("name", "twitter:image", imageUrl);

    upsertMeta("property", "article:published_time", type === "article" ? publishedTime : undefined);
    upsertMeta("property", "article:modified_time", type === "article" ? modifiedTime : undefined);
    upsertMeta("property", "article:section", type === "article" ? section : undefined);

    document.head.querySelectorAll('script[data-seo-jsonld="true"]').forEach((node) => node.remove());

    const structuredDataItems = structuredData
      ? Array.isArray(structuredData)
        ? structuredData
        : [structuredData]
      : [];
    const jsonLdItems = jsonLd
      ? Array.isArray(jsonLd)
        ? jsonLd
        : [jsonLd]
      : [];
    const allJsonLdItems = [...structuredDataItems, ...jsonLdItems];

    for (const item of allJsonLdItems) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.seoJsonld = "true";
      script.textContent = JSON.stringify(item);
      document.head.appendChild(script);
    }

    return () => {
      removeIfPresent('meta[property="article:published_time"]');
      removeIfPresent('meta[property="article:modified_time"]');
      removeIfPresent('meta[property="article:section"]');
      document.head.querySelectorAll('script[data-seo-jsonld="true"]').forEach((node) => node.remove());
    };
  }, [
    canonicalPath,
    description,
    image,
    imageAlt,
    location.pathname,
    modifiedTime,
    noindex,
    publishedTime,
    jsonLd,
    robots,
    section,
    structuredData,
    title,
    type,
  ]);

  return null;
};

export default Seo;
