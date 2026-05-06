export const SITE_NAME = "Ellera";
export const SITE_URL_FALLBACK = "https://www.ellera.it";
export const DEFAULT_OG_IMAGE = "/social-preview.svg";
export const DEFAULT_LOCALE = "it_IT";
export const DEFAULT_DESCRIPTION =
  "Scopri Ellera, borgo della Liguria tra galleria a cielo aperto, outdoor nella Valle Sansobbia, tradizioni, teatro ed eventi del Comitato Ellerese.";
export const DEFAULT_ROBOTS =
  "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

export const getSiteUrl = () =>
  (import.meta.env.VITE_SITE_URL || SITE_URL_FALLBACK).replace(/\/+$/, "");

export const toAbsoluteUrl = (value: string, siteUrl = getSiteUrl()) => {
  try {
    return new URL(value, siteUrl).toString();
  } catch {
    return siteUrl;
  }
};

export const buildPageTitle = (title?: string) => {
  if (!title) return SITE_NAME;
  return title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
};

export const summarizeText = (text: string, maxChars = 160) => {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxChars) return normalized;

  const shortened = normalized.slice(0, maxChars);
  const lastSpace = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, lastSpace > 0 ? lastSpace : maxChars)}...`;
};

export const createWebSiteJsonLd = (siteUrl = getSiteUrl()) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: siteUrl,
  inLanguage: "it-IT",
});

export const createOrganizationJsonLd = (siteUrl = getSiteUrl()) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Comitato Ellerese",
  url: siteUrl,
  email: "comitatoellera@gmail.com",
  logo: toAbsoluteUrl("/favicon.ico", siteUrl),
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ellera",
    addressRegion: "Liguria",
    addressCountry: "IT",
  },
});

export const createPlaceJsonLd = (
  description: string,
  image?: string,
  siteUrl = getSiteUrl(),
) => ({
  "@context": "https://schema.org",
  "@type": "Place",
  name: SITE_NAME,
  description,
  url: siteUrl,
  image: image ? toAbsoluteUrl(image, siteUrl) : toAbsoluteUrl(DEFAULT_OG_IMAGE, siteUrl),
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ellera",
    addressRegion: "Liguria",
    addressCountry: "IT",
  },
});
