import {
  getEventOrganizers,
  type EventItem,
  type EventOrganizer,
} from "@/data/events";
import type { TrailData } from "@/data/trails";
import { ROUTES, eventDetailPath } from "@/lib/routes";
import { getSiteUrl, summarizeText, toAbsoluteUrl } from "@/lib/seo";

type SchemaContext = "https://schema.org";

export type JsonLdObject = {
  "@context": SchemaContext;
  "@type": string;
} & Record<string, unknown>;

const DEFAULT_LOCALITY = "Ellera";
const DEFAULT_REGION = "Liguria";
const DEFAULT_COUNTRY = "IT";

const cleanText = (value: string) =>
  value
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

const createPostalAddress = () => ({
  "@type": "PostalAddress",
  addressLocality: DEFAULT_LOCALITY,
  addressRegion: DEFAULT_REGION,
  addressCountry: DEFAULT_COUNTRY,
});

const createOrganizationNode = (siteUrl = getSiteUrl()) => ({
  "@type": "Organization",
  name: "Comitato Ellerese",
  url: siteUrl,
  email: "comitatoellera@gmail.com",
  logo: toAbsoluteUrl("/favicon.ico", siteUrl),
  address: createPostalAddress(),
  sameAs: [
    "https://www.facebook.com/profile.php?id=61578504275210#",
    "https://www.instagram.com/comitatoellerese",
  ],
});

const toOrganizerNode = (organizer: EventOrganizer, siteUrl: string) => ({
  "@type": "Organization",
  name: organizer.name,
  url: organizer.url ?? siteUrl,
  ...(organizer.logo ? { logo: toAbsoluteUrl(organizer.logo, siteUrl) } : {}),
});

export const createComitatoOrganizationJsonLd = (siteUrl = getSiteUrl()): JsonLdObject => ({
  "@context": "https://schema.org",
  ...createOrganizationNode(siteUrl),
});

export const createWebSiteJsonLd = (siteUrl = getSiteUrl()): JsonLdObject => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Ellera",
  url: siteUrl,
  description: "Borgo medievale nella Valle del Sansobbia, Albisola Superiore.",
});

export const createEventJsonLd = (event: EventItem, siteUrl = getSiteUrl()): JsonLdObject => {
  const organizers = getEventOrganizers(event, {
    fallbackOrganizer: { name: "Comitato Ellerese" },
  }).map((organizer) => toOrganizerNode(organizer, siteUrl));
  const description = summarizeText(cleanText(event.detailContent ?? event.desc), 400);
  const mainOrganizer = organizers.length === 1 ? organizers[0] : organizers;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description,
    url: toAbsoluteUrl(eventDetailPath(event.slug), siteUrl),
    image: [toAbsoluteUrl(event.image, siteUrl)],
    inLanguage: "it-IT",
    eventStatus: event.dateToBeConfirmed ? "https://schema.org/EventPostponed" : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.location,
      address: createPostalAddress(),
    },
    organizer: mainOrganizer,
    performer: mainOrganizer,
    offers: {
      "@type": "Offer",
      url: toAbsoluteUrl(eventDetailPath(event.slug), siteUrl),
      price: "0",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      validFrom: event.startDate,
    },
    ...(event.dateToBeConfirmed
      ? {}
      : {
          startDate: event.startDate,
          endDate: event.endDate ?? event.startDate,
        }),
  };
};

const createTrailTechnicalProperties = (trail: TrailData) => {
  const entries: Array<{ name: string; value?: string }> = [
    { name: "Difficolta", value: trail.difficulty },
    { name: "Lunghezza", value: trail.length },
    { name: "Dislivello", value: trail.elevation },
    { name: "Salita", value: trail.ascent },
    { name: "Discesa", value: trail.descent },
    { name: "Tempo medio", value: trail.estimatedTime },
    { name: "Direzione", value: trail.travelDirection },
  ];

  return entries
    .filter((entry): entry is { name: string; value: string } => Boolean(entry.value))
    .map((entry) => ({
      "@type": "PropertyValue",
      name: entry.name,
      value: entry.value,
    }));
};

interface TouristTripOptions {
  description?: string;
  image?: string;
  siteUrl?: string;
}

export const createTouristTripJsonLd = (
  trail: TrailData,
  options: TouristTripOptions = {},
): JsonLdObject => {
  const siteUrl = options.siteUrl ?? getSiteUrl();
  const description = summarizeText(
    options.description ?? cleanText(`${trail.desc} ${trail.characteristics}`),
    450,
  );
  const additionalProperty = createTrailTechnicalProperties(trail);

  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: trail.name,
    description,
    touristType: "Mountain bike",
    inLanguage: "it-IT",
    url: toAbsoluteUrl(`${ROUTES.mtb}/${trail.slug}`, siteUrl),
    itinerary: {
      "@type": "Place",
      name: "Albi Trail Area",
      address: createPostalAddress(),
    },
    provider: createOrganizationNode(siteUrl),
    ...(options.image ? { image: [toAbsoluteUrl(options.image, siteUrl)] } : {}),
    ...(trail.gpxPath
      ? {
          subjectOf: {
            "@type": "MediaObject",
            name: `Traccia GPX ${trail.name}`,
            encodingFormat: "application/gpx+xml",
            contentUrl: toAbsoluteUrl(trail.gpxPath, siteUrl),
          },
        }
      : {}),
    ...(additionalProperty.length > 0 ? { additionalProperty } : {}),
  };
};
